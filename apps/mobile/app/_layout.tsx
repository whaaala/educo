import Ionicons from '@expo/vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { TenantSettingsProvider } from '../contexts/TenantSettingsContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TenantSettingsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </TenantSettingsProvider>
    </ThemeProvider>
  );
}


