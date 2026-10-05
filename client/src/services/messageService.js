import api from './api';

export const messageService = {
  sendMessage: async (receiverId, text) => {
    const response = await api.post('/messages', { receiverId, text });
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  getConversationsList: async () => {
    const response = await api.get('/messages/conversations/list');
    return response.data;
  },
};
