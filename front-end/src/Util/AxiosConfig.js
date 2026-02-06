// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
});
// Create a separate instance for authenticated requests
export const authenticatedApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
});


// Add JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
