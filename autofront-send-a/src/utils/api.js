import axios from 'axios';
import AuthService from '../services/Authservice';

const axiosInstance = axios.create({
  // baseURL: '/', // Option 1: Base URL est la racine du domaine du frontend
  baseURL: '/api',
});
    // Attache automatiquement le JWT si présent
    axiosInstance.interceptors.request.use((config) => {
      const token = AuthService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
export default axiosInstance;