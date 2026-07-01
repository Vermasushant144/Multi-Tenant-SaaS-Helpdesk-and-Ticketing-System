import api from './api';

export const UserService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch users';
      throw new Error(message);
    }
  },

  getAgents: async () => {
    try {
      const response = await api.get('/users/agents');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch agents';
      throw new Error(message);
    }
  },

  addUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to create user';
      throw new Error(message);
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to update user';
      throw new Error(message);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to delete user';
      throw new Error(message);
    }
  }
};
