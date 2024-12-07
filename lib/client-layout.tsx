"use client";

import { ReactNode, useEffect, useState } from "react";
import styled, { ThemeProvider, type DefaultTheme } from "styled-components";
import GlobalStyle from "@/app/_components/globalstyles";
import Navbar from "@/app/_components/common/navbar/navbar";
import Footer from "@/app/_components/common/footer/footer";

const lightTheme: DefaultTheme = {
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

const darkTheme: DefaultTheme = {
  colors: {
    primary: "#9d6857",
    secondary: "#d78079",
    backgroundColor: "#121212",
    textColor: "#ffffff",
    focusTextColor: "#cccccc",
    toggleBg: "#333333",
    toggleColor: "#cccccc",
  },
};

// Styled toggle button
const ThemeToggleButton = styled.button`
  background-color: ${(props) => props.theme.toggleBg};
  color: ${(props) => props.theme.toggleColor};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

// Styled container for theme demo
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
`;

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Determine initial theme based on system preference and localStorage
  const getInitialTheme = (): DefaultTheme => {
    // Check if user has manually selected a theme before
    const userSelectedTheme =
      localStorage.getItem("userSelectedTheme") === "true";

    // If user has selected a theme, use their previous choice
    if (userSelectedTheme) {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark" ? darkTheme : lightTheme;
    }

    // If no user selection, check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? darkTheme : lightTheme;
  };

  // State management with initial theme
  const [theme, setTheme] = useState<DefaultTheme>(getInitialTheme);

  // Media query listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't manually selected a theme
      const userSelectedTheme =
        localStorage.getItem("userSelectedTheme") === "true";

      if (!userSelectedTheme) {
        setTheme(e.matches ? darkTheme : lightTheme);
      }
    };

    // Add listener
    mediaQuery.addEventListener("change", handleThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);

    // Mark that user has manually selected a theme
    localStorage.setItem("userSelectedTheme", "true");
    localStorage.setItem("theme", newTheme === darkTheme ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <ThemeToggleButton onClick={toggleTheme}>
        {theme === lightTheme ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </ThemeToggleButton>
      <Footer />
    </ThemeProvider>
  );
}
