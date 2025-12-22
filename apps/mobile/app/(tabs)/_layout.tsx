import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { colors, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="children" />
        <Tabs.Screen name="fees" />
        <Tabs.Screen name="messages" />
        <Tabs.Screen name="more" />
      </Tabs>
      <BottomTabBar key={`bottom-tab-${theme}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
