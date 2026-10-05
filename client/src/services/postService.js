import api from './api';

export const postService = {
  getFeedPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  getExplorePosts: async (page = 1, limit = 12) => {
    const response = await api.get(`/posts/explore?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserPosts: async (userId) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/posts', formDataOrObject, config);
    return response.data;
  },

  updatePost: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
};
