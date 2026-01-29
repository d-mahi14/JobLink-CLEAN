import api from './axios';

export const resumesAPI = {
  uploadResume: async (resumeFile, fileName) => {
    const response = await api.post('/resumes', {
      resumeFile,
      fileName,
    });
    return response.data;
  },

  getMyResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },

  getResumeById: async (resumeId) => {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
  },

  updateResumeAnalysis: async (resumeId, analysisData) => {
    const response = await api.put(`/resumes/${resumeId}/analysis`, {
      analysisData,
    });
    return response.data;
  },

  deleteResume: async (resumeId) => {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  },
};