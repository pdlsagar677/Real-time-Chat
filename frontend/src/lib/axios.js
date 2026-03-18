import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "/api" : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach token from localStorage as Authorization header (mobile fallback)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
