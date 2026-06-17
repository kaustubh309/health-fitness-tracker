import axios from 'axios';

// In production (Render), VITE_API_URL is set as an environment variable
// pointing to the live backend (e.g. https://fittrack-backend.onrender.com).
// Locally it falls back to localhost:8000.
const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : '/api/v1';

const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
