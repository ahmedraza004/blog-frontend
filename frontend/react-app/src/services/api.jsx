import axios from 'axios';

const api = axios.create({
  // For Vite:
  baseURL: import.meta.env.VITE_API_URL ?? 'blog-backend-production-64e5.up.railway.app/api/', // <-- adjust to your backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
