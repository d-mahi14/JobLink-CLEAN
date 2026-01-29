import api from './axios';

export const applicationsAPI = {
  applyForJob: async (jobId, resumeId) => {
    const response = await api.post('/applications', {
      jobId,
      resumeId,
    });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  getApplicationById: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status, matchScore) => {
    const response = await api.put(`/applications/${applicationId}/status`, {
      status,
      matchScore,
    });
    return response.data;
  },

  withdrawApplication: async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },
};