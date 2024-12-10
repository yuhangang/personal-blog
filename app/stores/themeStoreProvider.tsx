"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { createThemeStore, ThemeStore } from "./themeStore";
import { useStore } from "zustand";

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined
);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const ThemeStoreProvider = ({ children }: CounterStoreProviderProps) => {
  const storeRef = useRef<ThemeStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createThemeStore();
  }

  return (
    <ThemeStoreContext.Provider value={storeRef.current}>
      {children}
    </ThemeStoreContext.Provider>
  );
};

export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
  const themeStoreContext = useContext(ThemeStoreContext);

  if (!themeStoreContext) {
    throw new Error("useThemeStore must be used within a ThemeStoreProvider");
  }

  return useStore(themeStoreContext, selector);
};
``;
