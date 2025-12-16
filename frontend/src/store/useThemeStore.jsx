import { create } from "zustand";

export const THEMES = {
  "midnight": {
    name: "Midnight",
    colors: {
      primary: "#2563eb",
      secondary: "#7c3aed",
      accent: "#0ea5e9",
      neutral: "#1f2937",
      base: "#0f172a",
      info: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    dark: true
  },
  "classic": {
    name: "Classic",
    colors: {
      primary: "#000000",
      secondary: "#4b5563",
      accent: "#6b7280",
      neutral: "#ffffff",
      base: "#f9fafb",
      info: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    dark: false
  },
  "sage": {
    name: "Sage",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
      neutral: "#f0fdf4",
      base: "#ffffff",
      info: "#0ea5e9",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626"
    },
    dark: false
  },
  "amethyst": {
    name: "Amethyst",
    colors: {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
      accent: "#a78bfa",
      neutral: "#f5f3ff",
      base: "#ffffff",
      info: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    dark: false
  },
  "carbon": {
    name: "Carbon",
    colors: {
      primary: "#171717",
      secondary: "#404040",
      accent: "#525252",
      neutral: "#262626",
      base: "#0a0a0a",
      info: "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    dark: true
  },
  "ocean": {
    name: "Ocean",
    colors: {
      primary: "#0369a1",
      secondary: "#0ea5e9",
      accent: "#38bdf8",
      neutral: "#f0f9ff",
      base: "#ffffff",
      info: "#0284c7",
      success: "#059669",
      warning: "#ea580c",
      error: "#dc2626"
    },
    dark: false
  },
  "sunset": {
    name: "Sunset",
    colors: {
      primary: "#ea580c",
      secondary: "#f97316",
      accent: "#fb923c",
      neutral: "#fff7ed",
      base: "#ffffff",
      info: "#0ea5e9",
      success: "#059669",
      warning: "#ea580c",
      error: "#dc2626"
    },
    dark: false
  }
};

export const useThemeStore = create((set) => ({
  theme: (() => {
    const saved = localStorage.getItem("chat-theme");
    return saved && THEMES[saved] ? saved : "midnight";
  })(),
  
  currentTheme: (() => {
    const saved = localStorage.getItem("chat-theme");
    return THEMES[saved] || THEMES["midnight"];
  })(),
  
  setTheme: (themeKey) => {
    const theme = THEMES[themeKey];
    if (!theme) return;
    
    localStorage.setItem("chat-theme", themeKey);
    
    // Apply theme to CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
    
    // Apply dark/light mode class
    if (theme.dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    set({ theme: themeKey, currentTheme: theme });
  },
  
  initializeTheme: () => {
    const saved = localStorage.getItem("chat-theme") || "midnight";
    const theme = THEMES[saved] || THEMES["midnight"];
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
    
    if (theme.dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    return { theme: saved, currentTheme: theme };
  }
}));