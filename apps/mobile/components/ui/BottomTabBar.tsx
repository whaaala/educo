import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

// Custom SVG Icons for a more premium look
const HomeIcon = ({ color, size, filled }: { color: string; size: number; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Path
        d="M3 10.5V21C3 21.5523 3.44772 22 4 22H9V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V22H20C20.5523 22 21 21.5523 21 21V10.5L12 3L3 10.5Z"
        fill={color}
      />
    ) : (
      <Path
        d="M3 10.5V21C3 21.5523 3.44772 22 4 22H9V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V22H20C20.5523 22 21 21.5523 21 21V10.5M3 10.5L12 3L21 10.5M3 10.5L1 12M21 10.5L23 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

const ChildrenIcon = ({ color, size, filled }: { color: string; size: number; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Circle cx="9" cy="7" r="4" fill={color} />
        <Circle cx="17" cy="7" r="3" fill={color} opacity={0.7} />
        <Path
          d="M2 21C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21H2Z"
          fill={color}
        />
        <Path
          d="M16 21C16 18.5 17.5 16 20 15C22 15.5 23 18 22 21H16Z"
          fill={color}
          opacity={0.7}
        />
      </>
    ) : (
      <>
        <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2" />
        <Circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth="1.5" opacity={0.7} />
        <Path
          d="M3 21C3 17.6863 5.68629 15 9 15C12.3137 15 15 17.6863 15 21"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M15 21C15 18.5 16.5 16.5 19 16C21 16.3 22 18.5 22 21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.7}
        />
      </>
    )}
  </Svg>
);

const FeesIcon = ({ color, size, filled }: { color: string; size: number; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Rect x="2" y="5" width="20" height="14" rx="3" fill={color} />
        <Rect x="2" y="9" width="20" height="3" fill={color} opacity={0.3} />
        <Circle cx="17" cy="15" r="2" fill="white" opacity={0.4} />
      </>
    ) : (
      <>
        <Rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="2" />
        <Path d="M2 10H22" stroke={color} strokeWidth="2" />
        <Circle cx="17" cy="15" r="1.5" stroke={color} strokeWidth="1.5" />
      </>
    )}
  </Svg>
);

const ChatIcon = ({ color, size, filled }: { color: string; size: number; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path
          d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H6L2 22V6C2 4.9 2.9 4 4 4Z"
          fill={color}
        />
        <Circle cx="8" cy="11" r="1.5" fill="white" opacity={0.5} />
        <Circle cx="12" cy="11" r="1.5" fill="white" opacity={0.5} />
        <Circle cx="16" cy="11" r="1.5" fill="white" opacity={0.5} />
      </>
    ) : (
      <>
        <Path
          d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H6L2 22V6C2 4.9 2.9 4 4 4Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="8" cy="11" r="1" fill={color} />
        <Circle cx="12" cy="11" r="1" fill={color} />
        <Circle cx="16" cy="11" r="1" fill={color} />
      </>
    )}
  </Svg>
);

const MoreIcon = ({ color, size, filled }: { color: string; size: number; filled: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Rect x="3" y="3" width="8" height="8" rx="2.5" fill={color} />
        <Rect x="13" y="3" width="8" height="8" rx="2.5" fill={color} opacity={0.7} />
        <Rect x="3" y="13" width="8" height="8" rx="2.5" fill={color} opacity={0.7} />
        <Rect x="13" y="13" width="8" height="8" rx="2.5" fill={color} opacity={0.5} />
      </>
    ) : (
      <>
        <Rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
        <Rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
      </>
    )}
  </Svg>
);

interface TabItem {
  name: string;
  route: string;
  label: string;
  icon: typeof HomeIcon;
}

const TABS: TabItem[] = [
  { name: 'index', route: '/', label: 'Home', icon: HomeIcon },
  { name: 'children', route: '/children', label: 'Children', icon: ChildrenIcon },
  { name: 'fees', route: '/fees', label: 'Fees', icon: FeesIcon },
  { name: 'messages', route: '/messages', label: 'Chat', icon: ChatIcon },
  { name: 'more', route: '/more', label: 'More', icon: MoreIcon },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark, theme } = useTheme();
  const isTablet = useIsTablet();

  // Animation refs for each tab
  const scaleAnims = useRef(TABS.map(() => new Animated.Value(1))).current;
  const translateYAnims = useRef(TABS.map(() => new Animated.Value(0))).current;

  // Get the active tab index
  const getActiveIndex = () => {
    // Handle root path
    if (pathname === '/' || pathname === '') return 0;

    const index = TABS.findIndex(tab => {
      if (tab.route === '/') return pathname === '/';
      return pathname.startsWith(tab.route);
    });
    return index >= 0 ? index : 0;
  };

  const activeIndex = getActiveIndex();

  // Animate active tab
  useEffect(() => {
    TABS.forEach((_, index) => {
      const isActive = index === activeIndex;

      Animated.parallel([
        Animated.spring(scaleAnims[index], {
          toValue: isActive ? 1 : 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnims[index], {
          toValue: isActive ? -4 : 0,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [activeIndex]);

  const handlePress = (route: string, index: number) => {
    // Bounce animation on press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(route as any);
  };

  // Get gradient colors based on theme
  const getActiveGradient = (): readonly [string, string] => {
    switch (theme) {
      case 'midnight':
        return ['#06b6d4', '#0891b2'] as const;
      case 'purple':
        return ['#d946ef', '#a855f7'] as const;
      case 'dark':
        return ['#3b82f6', '#6366f1'] as const;
      default:
        return ['#3b82f6', '#6366f1'] as const;
    }
  };

  const activeGradient = getActiveGradient();

  // Background color - use solid colors for proper theme support
  const tabBarBg = colors.surface;

  const borderColor = colors.border;

  return (
    <View
      style={[
        styles.container,
        isTablet && styles.containerTablet,
      ]}
    >
      {/* Background */}
      <View
        style={[
          styles.solidBackground,
          isTablet && styles.solidBackgroundTablet,
          {
            backgroundColor: tabBarBg,
            borderColor,
            shadowColor: isDark ? colors.primary : '#000',
            shadowOpacity: isDark ? 0.3 : 0.12,
          },
        ]}
      />

      {/* Tab items */}
      <View style={[styles.tabsContainer, isTablet && styles.tabsContainerTablet]}>
        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          const IconComponent = tab.icon;

          return (
            <Animated.View
              key={tab.name}
              style={[
                styles.tabItem,
                isTablet && styles.tabItemTablet,
                {
                  transform: [
                    { scale: scaleAnims[index] },
                    { translateY: translateYAnims[index] },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={() => handlePress(tab.route, index)}
                style={[styles.tabButton, isTablet && styles.tabButtonTablet]}
              >
                {/* Active indicator background */}
                {isActive && (
                  <LinearGradient
                    colors={activeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.activeIndicator, isTablet && styles.activeIndicatorTablet]}
                  />
                )}

                {/* Icon container */}
                <View style={[
                  styles.iconContainer,
                  isTablet && styles.iconContainerTablet,
                  isActive && styles.iconContainerActive,
                ]}>
                  <IconComponent
                    color={isActive ? '#ffffff' : colors.textMuted}
                    size={isTablet ? 24 : 22}
                    filled={isActive}
                  />
                </View>

                {/* Label */}
                <Text
                  style={[
                    styles.label,
                    isTablet && styles.labelTablet,
                    { color: isActive ? activeGradient[0] : colors.textMuted },
                    isActive && styles.labelActive,
                  ]}
                >
                  {tab.label}
                </Text>

                {/* Active dot indicator */}
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: activeGradient[0] }]} />
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  containerTablet: {
    paddingHorizontal: 80,
    paddingBottom: 20,
  },
  solidBackground: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  solidBackgroundTablet: {
    left: 80,
    right: 80,
    height: 76,
    borderRadius: 28,
    bottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: 8,
  },
  tabsContainerTablet: {
    height: 76,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabItemTablet: {
    flex: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  tabButtonTablet: {
    paddingVertical: 8,
  },
  activeIndicator: {
    position: 'absolute',
    top: 2,
    width: 44,
    height: 44,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeIndicatorTablet: {
    width: 48,
    height: 48,
    borderRadius: 18,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconContainerTablet: {
    width: 48,
    height: 48,
    borderRadius: 18,
  },
  iconContainerActive: {
    // Active state handled by gradient background
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelTablet: {
    fontSize: 11,
    marginTop: 4,
  },
  labelActive: {
    fontFamily: FONTS.bold,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
