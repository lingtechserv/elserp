import axios from 'axios';

// Configure axios to point to your backend
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',  // Ensure this URL matches your Laravel backend
  timeout: 5000,  // Optional timeout setting
  withCredentials: true,  // Allow credentials (cookies, etc.) if necessary
});

export default axiosInstance;
