import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: backendUrl || 'http://localhost:8000', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
