import { supabase } from '../lib/supabase.config.js';
import { uploadToSupabase, deleteFromSupabase } from '../lib/supabaseStorage.js';
import { analyzeResumeWithAI } from '../lib/pythonAPI.js';

/**
 * Upload resume
 */
export const uploadResume = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { resumeFile, fileName } = req.body;

    if (!resumeFile) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // 1️⃣ Upload to Supabase Storage
    const uploadResult = await uploadToSupabase(
      resumeFile,
      'resumes',
      `resume_${candidateId}_${Date.now()}`
    );

    // 2️⃣ Optional AI analysis
    let analysisData = null;

    try {
      const base64Content = resumeFile.includes(',')
        ? resumeFile.split(',')[1]
        : resumeFile;

      const resumeText = await extractTextFromBase64(base64Content, fileName);
      const aiAnalysis = await analyzeResumeWithAI(resumeText, fileName);

      analysisData = {
        skills: aiAnalysis.skills || [],
        categorized_skills: aiAnalysis.categorized_skills || {},
        experience_years: aiAnalysis.experience_years || 0,
        education: aiAnalysis.education || [],
        certifications: aiAnalysis.certifications || [],
        summary: aiAnalysis.summary || '',
        score: calculateOverallScore(aiAnalysis),
        analyzed_at: new Date().toISOString()
      };
    } catch (err) {
      console.error('AI analysis failed:', err);
      // Resume upload should still succeed
    }

    // 3️⃣ Insert DB row
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        candidate_id: candidateId,
        resume_url: uploadResult.publicUrl,
        storage_path: uploadResult.path,
        file_name: fileName || uploadResult.fileName,
        file_size: uploadResult.fileSize,
        analysis_data: analysisData
      })
      .select()
      .single();

    if (error) {
      await deleteFromSupabase(uploadResult.path);
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('uploadResume error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all resumes of logged-in candidate
 */
export const getMyResumes = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(data || []);
  } catch (error) {
    console.error('getMyResumes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single resume
 */
export const getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Authorization check
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (profile?.user_type === 'candidate' && data.candidate_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('getResume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update resume analysis
 */
export const updateResumeAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { analysisData } = req.body;
    const candidateId = req.user.id;

    const { data, error } = await supabase
      .from('resumes')
      .update({ analysis_data: analysisData })
      .eq('id', resumeId)
      .eq('candidate_id', candidateId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('updateResumeAnalysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete resume
 */
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const candidateId = req.user.id;

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('storage_path')
      .eq('id', resumeId)
      .eq('candidate_id', candidateId)
      .single();

    if (error || !resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
      .eq('candidate_id', candidateId);

    if (resume.storage_path) {
      await deleteFromSupabase(resume.storage_path);
    }

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('deleteResume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ===================== HELPERS ===================== */

function calculateOverallScore(analysis) {
  let score = 50;

  if (analysis.skills?.length) {
    score += Math.min(analysis.skills.length * 2, 30);
  }

  if (analysis.experience_years) {
    score += Math.min(analysis.experience_years * 2, 20);
  }

  return Math.min(score, 100);
}

async function extractTextFromBase64(base64Content, fileName) {
  // TODO: implement pdf/docx parsing
  return 'Placeholder resume text';
}
