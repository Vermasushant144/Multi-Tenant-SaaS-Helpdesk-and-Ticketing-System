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
    const token = localStorage.getItem('bd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
