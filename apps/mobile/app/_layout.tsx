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
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
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

  const rootStyle = useMemo(() => ({
    flex: 1,
    backgroundColor: colors.background,
  }), [colors.background]);

  const screenContentStyle = useMemo(() => ({
    backgroundColor: colors.background,
  }), [colors.background]);

  const screenOptions = useMemo(() => ({
    headerShown: false,
    contentStyle: screenContentStyle,
  }), [screenContentStyle]);

  return (
    <View style={rootStyle}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reports" options={{ presentation: 'card' }} />
        <Stack.Screen name="report-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="term-progress" options={{ presentation: 'card' }} />
        <Stack.Screen name="payment-history" options={{ presentation: 'card' }} />
        <Stack.Screen name="drive" options={{ presentation: 'card' }} />
        <Stack.Screen name="file-preview" options={{ presentation: 'card' }} />
      </Stack>

      <BottomTabBar />
    </View>
  );
}


