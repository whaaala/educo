import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

// Theme types matching desktop version
export type ThemeMode = 'light' | 'dark' | 'midnight' | 'purple';

// Color palette for each theme
export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceHover: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Borders
  border: string;
  borderSecondary: string;
  borderFocus: string;

  // Primary (Brand)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryText: string;

  // Accent colors
  accent: string;
  accentLight: string;

  // Status colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;

  // Input
  inputBackground: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputPlaceholder: string;

  // Modal
  modalBackground: string;
  modalOverlay: string;
  modalHeader: string;
  modalHeaderGradientStart: string;
  modalHeaderGradientEnd: string;

  // Card
  cardBackground: string;
  cardBorder: string;

  // Shadow (for elevation)
  shadowColor: string;
}

// Light theme colors
const lightColors: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  surface: '#ffffff',
  surfaceHover: '#f8fafc',

  text: '#0f172a',
  textSecondary: '#334155',
  textTertiary: '#475569',
  textMuted: '#94a3b8',

  border: '#e2e8f0',
  borderSecondary: '#cbd5e1',
  borderFocus: '#3b82f6',

  primary: '#3b82f6',
  primaryLight: '#dbeafe',
  primaryDark: '#2563eb',
  primaryText: '#ffffff',

  accent: '#6366f1',
  accentLight: '#e0e7ff',

  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  inputBackground: '#ffffff',
  inputBorder: '#e2e8f0',
  inputBorderFocus: '#3b82f6',
  inputPlaceholder: '#94a3b8',

  modalBackground: '#ffffff',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  modalHeader: '#f8fafc',
  modalHeaderGradientStart: '#f0f9ff',
  modalHeaderGradientEnd: '#e0f2fe',

  cardBackground: '#ffffff',
  cardBorder: '#e2e8f0',

  shadowColor: '#000000',
};

// Dark theme colors
const darkColors: ThemeColors = {
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  surface: '#1e293b',
  surfaceHover: '#334155',

  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textTertiary: '#cbd5e1',
  textMuted: '#64748b',

  border: '#334155',
  borderSecondary: '#475569',
  borderFocus: '#3b82f6',

  primary: '#3b82f6',
  primaryLight: '#1e3a5f',
  primaryDark: '#60a5fa',
  primaryText: '#ffffff',

  accent: '#818cf8',
  accentLight: '#312e81',

  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#60a5fa',
  infoLight: '#1e3a5f',

  inputBackground: '#1e293b',
  inputBorder: '#334155',
  inputBorderFocus: '#3b82f6',
  inputPlaceholder: '#64748b',

  modalBackground: '#1e293b',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  modalHeader: '#0f172a',
  modalHeaderGradientStart: '#1e293b',
  modalHeaderGradientEnd: '#334155',

  cardBackground: '#1e293b',
  cardBorder: '#334155',

  shadowColor: '#000000',
};

// Midnight theme colors (cyan accent)
const midnightColors: ThemeColors = {
  background: '#0c1222',
  backgroundSecondary: '#111827',
  backgroundTertiary: '#1f2937',
  surface: '#111827',
  surfaceHover: '#1f2937',

  text: '#ecfeff',
  textSecondary: '#cffafe',
  textTertiary: '#a5f3fc',
  textMuted: '#67e8f9',

  border: '#164e63',
  borderSecondary: '#0e7490',
  borderFocus: '#06b6d4',

  primary: '#06b6d4',
  primaryLight: '#083344',
  primaryDark: '#22d3ee',
  primaryText: '#0c1222',

  accent: '#22d3ee',
  accentLight: '#083344',

  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#22d3ee',
  infoLight: '#083344',

  inputBackground: '#111827',
  inputBorder: '#164e63',
  inputBorderFocus: '#06b6d4',
  inputPlaceholder: '#67e8f9',

  modalBackground: '#111827',
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
  modalHeader: '#0c1222',
  modalHeaderGradientStart: '#083344',
  modalHeaderGradientEnd: '#164e63',

  cardBackground: '#111827',
  cardBorder: '#164e63',

  shadowColor: '#000000',
};

// Purple theme colors (pink accent)
const purpleColors: ThemeColors = {
  background: '#0f0a1a',
  backgroundSecondary: '#1a1025',
  backgroundTertiary: '#2d1f3d',
  surface: '#1a1025',
  surfaceHover: '#2d1f3d',

  text: '#fdf4ff',
  textSecondary: '#f5d0fe',
  textTertiary: '#e879f9',
  textMuted: '#d946ef',

  border: '#581c87',
  borderSecondary: '#7e22ce',
  borderFocus: '#d946ef',

  primary: '#d946ef',
  primaryLight: '#3b0764',
  primaryDark: '#f0abfc',
  primaryText: '#0f0a1a',

  accent: '#f0abfc',
  accentLight: '#3b0764',

  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#f0abfc',
  infoLight: '#3b0764',

  inputBackground: '#1a1025',
  inputBorder: '#581c87',
  inputBorderFocus: '#d946ef',
  inputPlaceholder: '#d946ef',

  modalBackground: '#1a1025',
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
  modalHeader: '#0f0a1a',
  modalHeaderGradientStart: '#3b0764',
  modalHeaderGradientEnd: '#581c87',

  cardBackground: '#1a1025',
  cardBorder: '#581c87',

  shadowColor: '#000000',
};

// Get colors for a theme
const getThemeColors = (mode: ThemeMode): ThemeColors => {
  switch (mode) {
    case 'dark':
      return darkColors;
    case 'midnight':
      return midnightColors;
    case 'purple':
      return purpleColors;
    default:
      return lightColors;
  }
};

// Context interface
interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const colors = useMemo(() => getThemeColors(theme), [theme]);
  const isDark = theme !== 'light';

  const value = useMemo(
    () => ({ theme, colors, setTheme, isDark }),
    [theme, colors, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// Export color palettes for direct use
export { lightColors, darkColors, midnightColors, purpleColors, getThemeColors };
