import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
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
  );
}
