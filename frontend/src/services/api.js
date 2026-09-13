import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Adjust to your server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for token handling or error logging
api.interceptors.request.use(
  (config) => {
    // Example: Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
