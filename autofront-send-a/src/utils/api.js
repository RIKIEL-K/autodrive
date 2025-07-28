import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: '/', // Option 1: Base URL est la racine du domaine du frontend
  baseURL: '/api',
});

export default axiosInstance;