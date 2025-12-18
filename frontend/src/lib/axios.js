import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);