"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import {
  ThemeId,
  ThemeDefinition,
  THEMES,
  THEME_ORDER,
  ALL_THEME_CLASSES,
} from "@/lib/theme-config";

interface ThemeContextType {
  theme: ThemeId;
  themeConfig: ThemeDefinition;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("light");

  const applyTheme = useCallback((newTheme: ThemeId) => {
    const config = THEMES[newTheme];
    if (!config) return;

    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Remove all theme classes
    document.documentElement.classList.remove(...ALL_THEME_CLASSES);

    // For dark-based themes, always add "dark" for Tailwind dark: variant support
    if (config.isDark) {
      document.documentElement.classList.add("dark");
    }

    // Add theme-specific class (if it differs from "dark")
    if (config.cssClass && config.cssClass !== "dark") {
      document.documentElement.classList.add(config.cssClass);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeId;
    if (savedTheme && THEMES[savedTheme]) {
      applyTheme(savedTheme);
    }
  }, [applyTheme]);

  const setTheme = (newTheme: ThemeId) => {
    applyTheme(newTheme);
  };

  const cycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    applyTheme(THEME_ORDER[nextIndex]);
  };

  const themeConfig = THEMES[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        cycleTheme,
        isDark: themeConfig.isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: "light" as ThemeId,
      themeConfig: THEMES.light,
      setTheme: () => {},
      cycleTheme: () => {},
      isDark: false,
    };
  }
  return context;
}
