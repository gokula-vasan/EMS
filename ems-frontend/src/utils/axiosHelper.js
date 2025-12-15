import axios from 'axios';

// 1. Create the Axios Instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach Token Automatically
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

// 3. Response Interceptor: Handle Token Expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid/expired (401), log user out
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



export default API;