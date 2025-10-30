"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "midnight" | "purple";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Theme[] = ["light", "dark", "midnight", "purple"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Check localStorage for saved theme preference on mount
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && themes.includes(savedTheme)) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Remove all theme classes
    document.documentElement.classList.remove("dark", "midnight", "purple");

    // Add the new theme class (skip for light theme)
    if (newTheme !== "light") {
      document.documentElement.classList.add(newTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Return default values if context is not available
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      cycleTheme: () => {}
    };
  }
  return context;
}
