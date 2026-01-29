import { create } from 'zustand';
import { jobsAPI } from '../api/jobs.api';
import toast from 'react-hot-toast';

export const useJobStore = create((set, get) => ({
  jobs: [],
  myJobs: [],
  currentJob: null,
  isLoading: false,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },

  fetchAllJobs: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await jobsAPI.getAllJobs(params);
      set({
        jobs: response.jobs,
        pagination: {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch jobs');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchJobById: async (jobId) => {
    set({ isLoading: true });
    try {
      const job = await jobsAPI.getJobById(jobId);
      set({ currentJob: job });
      return job;
    } catch (error) {
      toast.error('Failed to fetch job details');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true });
    try {
      const job = await jobsAPI.createJob(jobData);
      set({ myJobs: [job, ...get().myJobs] });
      toast.success('Job posted successfully!');
      return job;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyJobs: async () => {
    set({ isLoading: true });
    try {
      const jobs = await jobsAPI.getMyJobPostings();
      set({ myJobs: jobs });
    } catch (error) {
      toast.error('Failed to fetch your jobs');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const updated = await jobsAPI.updateJob(jobId, jobData);
      set({
        myJobs: get().myJobs.map((j) => (j.id === jobId ? updated : j)),
      });
      toast.success('Job updated successfully');
      return updated;
    } catch (error) {
      toast.error('Failed to update job');
      throw error;
    }
  },

  deleteJob: async (jobId) => {
    try {
      await jobsAPI.deleteJob(jobId);
      set({ myJobs: get().myJobs.filter((j) => j.id !== jobId) });
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
      throw error;
    }
  },
}));
