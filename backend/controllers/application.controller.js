import { supabase } from '../lib/supabase.config.js';
import { calculateJobMatch } from '../lib/pythonAPI.js';

// Apply for a job (candidate only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    const candidateId = req.user.id;

    if (!jobId || !resumeId) {
      return res.status(400).json({ message: "Job ID and Resume ID are required" });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_id', jobId)
      .single();

    if (existing) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert([
        {
          candidate_id: candidateId,
          job_id: jobId,
          resume_id: resumeId,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // 🆕 OPTIONAL: Calculate match score in background (non-blocking)
    // This won't delay the response to the user
    calculateMatchScoreInBackground(application.id, resumeId, jobId).catch(err => {
      console.error('Background match calculation failed:', err);
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get candidate's applications
export const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings(
          title,
          description,
          location,
          salary_range,
          profiles(full_name, profile_pic)
        ),
        resumes(file_name, storage_path)
      `)
      .eq('candidate_id', candidateId)
      .order('applied_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in getMyApplications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications for a specific job (company only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.user.id;

    // Verify job belongs to company
    const { data: job, error: jobError } = await supabase
      .from('job_postings')
      .select('company_id, title, description, requirements')
      .eq('id', jobId)
      .single();

    if (jobError || job.company_id !== companyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        id,
        candidate_id,
        status,
        match_score,
        applied_at,
        profiles!applications_candidate_id_fkey(
          id,
          full_name,
          email,
          profile_pic
        ),
        resumes(
          id,
          file_name,
          storage_path,
          analysis_data
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // 🔐 Generate signed URLs for resumes
    for (const app of applications) {
      if (app.resumes?.storage_path) {
        const { data, error: signError } = await supabase
          .storage
          .from('uploads')
          .createSignedUrl(app.resumes.storage_path, 60 * 10); // 10 minutes

        if (!signError) {
          app.resumes.resume_url = data.signedUrl;
        }
      }

      // 🆕 Calculate match score if not already calculated
      // This runs in the background and doesn't block the response
      if (!app.match_score && app.resumes?.analysis_data?.skills) {
        calculateMatchScoreInBackground(app.id, app.resume_id, jobId, job).catch(err => {
          console.error('Background match calculation failed for app:', app.id, err);
        });
      }
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in getJobApplications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status (company only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, matchScore } = req.body;
    const companyId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Verify application belongs to company's job
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        job_id,
        job_postings(company_id)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || application.job_postings.company_id !== companyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updateData = { status };
    if (matchScore !== undefined) updateData.match_score = Number(matchScore);

    const { data: updatedApplication, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .maybeSingle();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single application details
export const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles!applications_candidate_id_fkey(
          full_name,
          email,
          profile_pic
        ),
        job_postings(
          *,
          profiles!job_postings_company_id_fkey(
            full_name,
            profile_pic
          )
        ),
        resumes(*)
      `)
      .eq('id', applicationId)
      .single();

    if (error) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization
    const isCandidate = application.candidate_id === userId;
    const isCompany = application.job_postings.company_id === userId;

    if (!isCandidate && !isCompany) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error in getApplication:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Withdraw application (candidate only)
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const candidateId = req.user.id;

    // Delete the application and return the deleted row(s)
    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('candidate_id', candidateId)
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        message: "Application not found or you are not authorized to delete it" 
      });
    }

    res.status(200).json({ 
      message: "Application withdrawn successfully",
      deletedApplication: data[0]
    });
  } catch (error) {
    console.error("Error in withdrawApplication:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 Helper function: Calculate match score in background (non-blocking)
async function calculateMatchScoreInBackground(applicationId, resumeId, jobId, jobData = null) {
  try {
    // Fetch job data if not provided
    if (!jobData) {
      const { data: job } = await supabase
        .from('job_postings')
        .select('title, description, requirements')
        .eq('id', jobId)
        .single();
      
      if (!job) return;
      jobData = job;
    }

    // Fetch resume data
    const { data: resume } = await supabase
      .from('resumes')
      .select('analysis_data, storage_path')
      .eq('id', resumeId)
      .single();

    if (!resume || !resume.analysis_data?.skills) {
      console.log('No resume analysis data available for match calculation');
      return;
    }

    // Build resume text from analysis data
    const resumeText = buildResumeTextFromAnalysis(resume.analysis_data);

    // Calculate match using Python API
    const matchResult = await calculateJobMatch(
      resumeText,
      jobData.description,
      jobData.title,
      jobData.requirements
    );

    if (matchResult && matchResult.match_score) {
      // Update application with match score
      await supabase
        .from('applications')
        .update({ 
          match_score: Math.round(matchResult.match_score.overall_score)
        })
        .eq('id', applicationId);

      console.log(`Match score calculated for application ${applicationId}: ${matchResult.match_score.overall_score}%`);
    }
  } catch (error) {
    console.error('Error calculating match score in background:', error);
    // Don't throw - this is a background task
  }
}

// 🆕 Helper function: Build resume text from analysis data
function buildResumeTextFromAnalysis(analysisData) {
  const parts = [];

  if (analysisData.skills && analysisData.skills.length > 0) {
    parts.push(`Skills: ${analysisData.skills.join(', ')}`);
  }

  if (analysisData.experience_years) {
    parts.push(`${analysisData.experience_years} years of experience`);
  }

  if (analysisData.education && analysisData.education.length > 0) {
    parts.push(`Education: ${analysisData.education.join(', ')}`);
  }

  if (analysisData.summary) {
    parts.push(analysisData.summary);
  }

  return parts.join('. ');
}