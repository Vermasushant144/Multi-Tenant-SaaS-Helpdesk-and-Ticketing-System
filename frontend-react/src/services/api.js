import axios from 'axios';

// Create base axios instance
// In production, VITE_API_BASE_URL points to the deployed backend (e.g. https://your-backend.railway.app/api)
// In local dev, falls back to '/api' which Vite proxies to localhost:8081
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
