import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, useColorScheme, useWindowDimensions, View } from 'react-native';
import 'react-native-reanimated';

import { TenantSettingsProvider } from '../contexts/TenantSettingsContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import BottomTabBar from '../components/ui/BottomTabBar';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const scheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemeProvider>
        <TenantSettingsProvider>
          <AppChrome />
        </TenantSettingsProvider>
      </ThemeProvider>
    </NavigationThemeProvider>
  );
}

function AppChrome() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Keep screen content above the fixed bottom nav on all pages.
  const tabBottomPadding = isTablet ? 20 : Platform.OS === 'ios' ? 24 : 16;
  const tabBarHeight = 72;
  const contentPaddingBottom = tabBarHeight + tabBottomPadding;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: contentPaddingBottom }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reports" options={{ presentation: 'card' }} />
        <Stack.Screen name="report-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="term-progress" options={{ presentation: 'card' }} />
        <Stack.Screen name="payment-history" options={{ presentation: 'card' }} />
      </Stack>

      <BottomTabBar />
    </View>
  );
}


