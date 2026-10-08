import { StatusBar } from 'expo-status-bar';

import { useTheme } from '../../contexts/ThemeContext';

/** The clock and icons at the top follow the theme: light on the dark themes, dark on light (E5d-6 — they stayed dark on dark). */
export function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
