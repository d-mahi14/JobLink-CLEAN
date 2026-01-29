import { supabase } from '../lib/supabase.config.js';

// Create job posting (company only)
export const createJobPosting = async (req, res) => {
  try {
    const { title, description, requirements, location, salaryRange } = req.body;
    const companyId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const { data: job, error } = await supabase
      .from('job_postings')
      .insert([
        {
          company_id: companyId,
          title,
          description,
          requirements: requirements || [],
          location,
          salary_range: salaryRange,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(job);
  } catch (error) {
    console.error("Error in createJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all active job postings (public)
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('job_postings')
      .select('*, profiles!job_postings_company_id_fkey(full_name, profile_pic)', { count: 'exact' })
      .eq('status', 'active');

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: jobs, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({
      jobs,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get company's own job postings
export const getMyJobPostings = async (req, res) => {
  try {
    const companyId = req.user.id;

    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getMyJobPostings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single job posting
export const getJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { data: job, error } = await supabase
      .from('job_postings')
      .select('*, profiles!job_postings_company_id_fkey(full_name, email, profile_pic)')
      .eq('id', jobId)
      .single();

    if (error) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error in getJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update job posting
export const updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, requirements, location, salaryRange, status } = req.body;
    const companyId = req.user.id;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (requirements) updateData.requirements = requirements;
    if (location) updateData.location = location;
    if (salaryRange) updateData.salary_range = salaryRange;
    if (status) updateData.status = status;

    const { data: job, error } = await supabase
      .from('job_postings')
      .update(updateData)
      .eq('id', jobId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error in updateJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete job posting
export const deleteJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.user.id;

    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', jobId)
      .eq('company_id', companyId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJobPosting:", error);
    res.status(500).json({ message: "Server error" });
  }
};