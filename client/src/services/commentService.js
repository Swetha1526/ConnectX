import api from './api';

export const commentService = {
  getPostComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
