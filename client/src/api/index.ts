import axios from 'axios';
import { toast } from 'react-toastify';

export const baseUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: baseUrl + '/api/',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hm_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            toast.error(error.response.data.message || "An error occurred");
        } else if (error.request) {
            toast.error("No response received from the server");
        } else if (Array.isArray(error)) {
            error.forEach((err) => toast.error(err.msg));
        } else {
            toast.error("Error: " + error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
