import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.focused ? 'rgba(15,23,42,0.08)' : 'transparent',
      }}
    >
      <Ionicons size={22} color={props.color} name={props.name} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: 'Children',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="people-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fees"
        options={{
          title: 'Fees',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="card-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="chatbubbles-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="grid-outline" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}


