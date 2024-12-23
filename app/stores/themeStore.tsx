import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// TODO: Handle app theme
type DefaultTheme = {};

export const lightTheme: DefaultTheme = {
  colors: {
    primary: "#9d6857",
    secondary: "#d78079",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    focusTextColor: "#000000",
    toggleBg: "#e0e0e0",
    toggleColor: "#666666",
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: "#ffffff",
    secondary: "#d78079",
    backgroundColor: "#121212",
    textColor: "#ffffff",
    focusTextColor: "#cccccc",
    toggleBg: "#333333",
    toggleColor: "#cccccc",
  },
};

type ThemeState = {
  theme: DefaultTheme;
  isDarkMode: boolean;
};

type ThemeAction = {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export type ThemeStore = ThemeState & ThemeAction;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: darkTheme, // Default to dark theme
      isDarkMode: true,
      toggleTheme: () =>
        set((state) => {
          const newIsDarkMode = !state.isDarkMode;
          return {
            isDarkMode: newIsDarkMode,
            theme: newIsDarkMode ? darkTheme : lightTheme,
          };
        }),
      setTheme: (isDark) =>
        set({
          isDarkMode: isDark,
          theme: isDark ? darkTheme : lightTheme,
        }),
    }),
    {
      name: "theme-storage", // name of the item in local storage
      storage: createJSONStorage(() => localStorage), // use JSON to store data
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        theme: state.theme,
      }), // only persist isDarkMode
    }
  )
);

// Optional: if you still need createStore for some reason
export const createThemeStore = () => {
  return useThemeStore;
};
