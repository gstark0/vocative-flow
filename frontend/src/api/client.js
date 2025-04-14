import axios from 'axios';

// process.env.REACT_APP_API_URL || '/api
const api = axios.create({
  baseURL: '/api',
});

let logoutFn = null;

// Centralized auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && logoutFn) {
      logoutFn();
    }
    return Promise.reject(error);
  }
);

export const initializeApi = (logout) => {
  logoutFn = logout;
};

export default api;