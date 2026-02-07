/**
 * Theme Configuration - Single Source of Truth
 *
 * To add a new theme:
 *   1. Add an entry to THEMES below
 *   2. Add @variant <name> (&:where(.<name>, .<name> *)); in app/globals.css AND apps/admin/app/globals.css
 *   3. Add html.<name> { --background: ...; --foreground: ...; } CSS variables in both globals.css files
 *   4. Optionally add <name>: variant classes in components for theme-specific accent colors
 */

export type ThemeId = "light" | "dark" | "midnight" | "purple";

export interface ThemeColors {
  background: string;
  foreground: string;
  accent: string;
  accentLight: string;
  border: string;
  glow?: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  isDark: boolean;
  cssClass: string;
  icon: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  light: {
    id: "light",
    label: "Light",
    isDark: false,
    cssClass: "",
    icon: "Sun",
    colors: {
      background: "#f9fafb",
      foreground: "#171717",
      accent: "#3b82f6",
      accentLight: "#dbeafe",
      border: "#e5e7eb",
    },
  },
  dark: {
    id: "dark",
    label: "Dark",
    isDark: true,
    cssClass: "dark",
    icon: "Moon",
    colors: {
      background: "#0f1115",
      foreground: "#ededed",
      accent: "#3b82f6",
      accentLight: "#1e3a5f",
      border: "#374151",
    },
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    isDark: true,
    cssClass: "midnight",
    icon: "MoonStar",
    colors: {
      background: "#0a0e27",
      foreground: "#e2e8f0",
      accent: "#06b6d4",
      accentLight: "#083344",
      border: "rgba(6, 182, 212, 0.2)",
      glow: "#00d4ff",
    },
  },
  purple: {
    id: "purple",
    label: "Purple Dream",
    isDark: true,
    cssClass: "purple",
    icon: "Sparkles",
    colors: {
      background: "#1a0b2e",
      foreground: "#f3e8ff",
      accent: "#ec4899",
      accentLight: "#3b0764",
      border: "rgba(236, 72, 153, 0.2)",
      glow: "#ff00ff",
    },
  },
};

// Ordered list for cycling through themes
export const THEME_ORDER: ThemeId[] = ["light", "dark", "midnight", "purple"];

// All CSS classes that any theme can add (used for cleanup when switching)
export const ALL_THEME_CLASSES: string[] = [
  "dark",
  ...Object.values(THEMES)
    .map((t) => t.cssClass)
    .filter((c) => c && c !== "dark"),
];
