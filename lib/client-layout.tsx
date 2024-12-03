"use client";

import { ReactNode } from "react";
import { ThemeProvider, type DefaultTheme } from "styled-components";
import GlobalStyle from "@/app/_components/globalstyles";
import Navbar from "@/app/_components/common/navbar/navbar";
import Footer from "@/app/_components/common/footer/footer";

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
  },
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
