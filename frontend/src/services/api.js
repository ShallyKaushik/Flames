import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token on every request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('flames_accessToken');
      if (token) {
        // Ensure headers object exists (it always should on an axios config, but be safe)
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // If data is FormData, remove the default application/json Content-Type 
      // so Axios can automatically generate the multipart boundary header.
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    } catch (e) {
      console.error('Error reading token from localStorage', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
