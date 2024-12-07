"use client";

import Footer from "@/app/_components/common/footer/footer";
import GlobalStyle from "@/app/_components/globalstyles";
import { ReactNode } from "react";
import { ThemeProvider, type DefaultTheme } from "styled-components";

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

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
