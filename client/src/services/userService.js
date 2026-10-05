import api from './api';

export const userService = {
  getUserProfile: async (idOrUsername) => {
    const response = await api.get(`/users/${idOrUsername}`);
    return response.data;
  },

  updateUserProfile: async (id, formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.put(`/users/${id}`, formDataOrObject, config);
    return response.data;
  },

  followUser: async (id) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  unfollowUser: async (id) => {
    const response = await api.delete(`/users/${id}/follow`);
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getSuggestedUsers: async () => {
    const response = await api.get('/users/suggested');
    return response.data;
  },
};
