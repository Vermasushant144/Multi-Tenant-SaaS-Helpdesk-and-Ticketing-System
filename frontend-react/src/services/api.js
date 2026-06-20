import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Setup request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('bd_current_user');
    if (user) {
      const parsed = JSON.parse(user);
      config.headers.Authorization = `Bearer MOCK_TOKEN_${parsed.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
