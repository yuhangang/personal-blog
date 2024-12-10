"use client";

import { ReactNode, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useThemeStore } from "../app/stores/themeStore";
import GlobalStyle from "../app/_components/globalstyles";
import Footer from "../app/_components/common/footer/footer";

// Styled toggle button
const ThemeToggleButton = styled.button`
  background-color: ${(props) => props.theme.colors.toggleBg};
  color: ${(props) => props.theme.colors.toggleColor};
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

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Use Zustand store for theme
  const { theme, isDarkMode, toggleTheme } = useThemeStore();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <ThemeToggleButton onClick={toggleTheme}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </ThemeToggleButton>
      <Footer />
    </ThemeProvider>
  );
}
