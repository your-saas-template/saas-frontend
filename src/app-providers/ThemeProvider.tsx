"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/shared/ui";
import { THEME_COOKIE } from "@/shared/config";
import { getCookie, setCookie } from "@/shared/lib/cookies";
import { useAuth } from "@/entities/user";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  // Load theme from cookie or system preference
  useEffect(() => {
    const saved = getCookie(THEME_COOKIE) as Theme | null;

    if (saved && Object.values(Theme).includes(saved)) {
      setTheme(saved);
    } else {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? Theme.DARK : Theme.LIGHT);
    }
  }, []);

  useEffect(() => {
    const backendTheme = user?.settings?.theme as Theme | undefined;
    if (!backendTheme) return;

    setTheme(backendTheme);
  }, [user?.settings?.theme, setTheme]);

  // Apply theme class and sync to cookie
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK);
      document.documentElement.classList.add(theme);
    }
    setCookie(THEME_COOKIE, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
