import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Helper function to get token (works on both mobile and desktop)
const getAuthToken = () => {
  // Try to get from localStorage first (reliable on mobile)
  const tokenFromStorage = localStorage.getItem("authToken");
  
  // Fallback to cookies for desktop
  if (!tokenFromStorage && typeof document !== 'undefined') {
    const match = document.cookie.match(/jwt=([^;]+)/);
    return match ? match[1] : null;
  }
  
  return tokenFromStorage;
};

// Helper function to set token
const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      
      // Store token from response if available
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      localStorage.removeItem("authToken");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      setAuthToken(res.data.token); // Store token
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      setAuthToken(res.data.token); // Store token
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    // Get token from storage (works on mobile)
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token available for socket connection");
      return;
    }

    // Add delay for mobile
    setTimeout(() => {
      const newSocket = io(SOCKET_URL, {
        query: { 
          userId: authUser._id,
        },
        auth: {
          token: token  // Send token in auth object
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        withCredentials: true,
      });

      set({ socket: newSocket });

      // Connection events
      newSocket.on("connect", () => {
        console.log("Socket connected with ID:", newSocket.id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        
        // If auth fails, try to reconnect with fresh token
        if (error.message.includes("Authentication error")) {
          setTimeout(() => {
            get().disconnectSocket();
            get().connectSocket();
          }, 1000);
        }
      });

      newSocket.on("auth:success", (data) => {
        console.log("Socket authentication successful:", data);
      });

      newSocket.on("getOnlineUsers", (users) => {
        set({ onlineUsers: users });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

    }, 1000);
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));