import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { setupCallListeners, teardownCallListeners, useCallStore } from "./useCallStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Helper function to get token (works on both mobile and desktop)
const getAuthToken = () => {
  // Try to get from localStorage first (reliable on mobile)
  const tokenFromStorage = localStorage.getItem("authToken");
  console.log("🔑 Token from localStorage:", tokenFromStorage ? "Found" : "Not found");
  
  if (tokenFromStorage) {
    return tokenFromStorage;
  }
  
  // Fallback to cookies for desktop (this won't work on mobile browsers)
  if (typeof document !== 'undefined') {
    const cookies = document.cookie;
    console.log("🍪 Cookies available:", cookies);
    const match = cookies.match(/jwt=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;
    console.log("🔑 Token from cookie:", tokenFromCookie ? "Found" : "Not found");
    
    // If found in cookies, also store in localStorage for future
    if (tokenFromCookie) {
      localStorage.setItem("authToken", tokenFromCookie);
    }
    return tokenFromCookie;
  }
  
  return null;
};

// Helper function to set token
const setAuthToken = (token) => {
  console.log("💾 Storing token in localStorage:", token ? "Yes" : "No");
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
      console.log("🔍 Checking authentication...");
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      
      // Store token from response if available
      if (res.data.token) {
        console.log("✅ Token received in checkAuth response:", res.data.token.substring(0, 20) + "...");
        setAuthToken(res.data.token);
      } else {
        console.log("❌ No token in checkAuth response");
      }
      
      get().connectSocket();
    } catch (error) {
      console.log("❌ Error in checkAuth:", error.response?.data || error.message);
      set({ authUser: null });
      localStorage.removeItem("authToken");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("📝 Signing up user...");
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      
      if (res.data.token) {
        console.log("✅ Signup token received:", res.data.token.substring(0, 20) + "...");
        setAuthToken(res.data.token);
      } else {
        console.log("❌ No token in signup response");
      }
      
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.log("❌ Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("🔑 Logging in user...");
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      if (res.data.token) {
        console.log("✅ Login token received:", res.data.token.substring(0, 20) + "...");
        setAuthToken(res.data.token);
      } else {
        console.log("❌ No token in login response");
      }
      
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("❌ Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
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
    if (!authUser) {
      console.log("❌ No authUser, cannot connect socket");
      return;
    }
    
    if (socket) {
      console.log("ℹ️ Socket already exists, reusing");
      return;
    }

    // Get token from storage if available (optional, for mobile)
    const token = getAuthToken();
    console.log("🔑 Token for socket connection:", token ? "Available" : "Using cookies");

    console.log("🌐 Attempting socket connection with userId:", authUser._id);
    console.log("🔗 Socket URL:", SOCKET_URL);

    // Add delay for mobile
    setTimeout(() => {
      const socketOptions = {
        query: {
          userId: authUser._id,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 30000,
        withCredentials: true,
        forceNew: true,
      };

      // Only add auth token if available (mobile), otherwise rely on cookies
      if (token) {
        socketOptions.auth = { token };
      }

      const newSocket = io(SOCKET_URL, socketOptions);

      set({ socket: newSocket });

      // Connection events with detailed logging
      newSocket.on("connect", () => {
        console.log("✅ Socket connected with ID:", newSocket.id);
        console.log("📤 Socket auth data sent:", { token: token ? token.substring(0, 20) + "..." : "cookies" });
        setupCallListeners(newSocket);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
        console.error("🔧 Error details:", error);
        
        // If auth fails, try to reconnect with fresh token
        if (error.message.includes("Authentication error") || error.message.includes("unauthorized")) {
          console.log("🔐 Authentication failed, attempting to refresh token...");
          
          // Clear old token and reconnect
          localStorage.removeItem("authToken");
          
          setTimeout(() => {
            console.log("🔄 Reconnecting socket...");
            get().disconnectSocket();
            get().checkAuth(); // Refresh auth first
            setTimeout(() => get().connectSocket(), 1000);
          }, 2000);
        }
      });

      newSocket.on("auth:success", (data) => {
        console.log("✅ Socket authentication successful:", data);
      });

      newSocket.on("getOnlineUsers", (users) => {
        console.log("👥 Online users updated:", users.length, "users");
        set({ onlineUsers: users });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected. Reason:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected, try to reconnect
          setTimeout(() => {
            get().connectSocket();
          }, 1000);
        }
      });

      newSocket.on("error", (error) => {
        console.error("🚨 Socket error:", error);
      });

    }, 1500); // 1.5-second delay for mobile
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("👋 Disconnecting socket...");
      teardownCallListeners(socket);
      useCallStore.getState().cleanup();
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null });
    }
  },
}));