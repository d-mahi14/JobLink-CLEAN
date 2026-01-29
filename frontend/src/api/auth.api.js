import api from './axios';

export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.session?.access_token) {
      localStorage.setItem('token', response.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('profile', JSON.stringify(response.data.profile));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  },

  checkAuth: async () => {
    const response = await api.get('/auth/check');
    return response.data;
  },

  updateProfile: async (profilePic) => {
    const response = await api.put('/auth/update-profile', { profilePic });
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
  },
};