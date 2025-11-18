import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // optional: 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header automatically if token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors like 401 Unauthorized here
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      // localStorage.removeItem('token'); // optional logout
      // window.location.href = "/login"; // redirect
    }
    return Promise.reject(error);
  }
);

export default API;
