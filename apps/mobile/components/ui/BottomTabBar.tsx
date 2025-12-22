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

  // Tablet sizing: keep the bar centered with a max width so it doesn't look "stretched" on large screens.
  const tabletHorizontalGutter = 24;
  const tabletBarMaxWidth = 720;
  const tabletBarWidth = Math.min(SCREEN_WIDTH - tabletHorizontalGutter * 2, tabletBarMaxWidth);
  const tabletSideInset = Math.max(0, Math.round((SCREEN_WIDTH - tabletBarWidth) / 2));

  // Animation refs for each tab
  const scaleAnims = useRef(TABS.map(() => new Animated.Value(1))).current;
  const translateYAnims = useRef(TABS.map(() => new Animated.Value(0))).current;

  // Figure out which tab matches the current URL (if any).
  // For non-tab pages (e.g. /term-progress), we keep the last matched tab highlighted.
  const getMatchedTabIndex = (): number | null => {
    // Handle root path
    if (pathname === '/' || pathname === '') return 0;

    const index = TABS.findIndex(tab => {
      if (tab.route === '/') return pathname === '/';
      return pathname.startsWith(tab.route);
    });
    return index >= 0 ? index : null;
  };

  const matchedTabIndex = getMatchedTabIndex();
  const [lastTabIndex, setLastTabIndex] = useState<number>(() => matchedTabIndex ?? 0);

  useEffect(() => {
    if (matchedTabIndex === null) return;
    setLastTabIndex(matchedTabIndex);
  }, [matchedTabIndex]);

  // Important: on non-tab pages we DO NOT "highlight" any tab.
  // We only *indicate* context (via a subtle dot) using lastTabIndex.
  const activeIndex = matchedTabIndex ?? -1;

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

    setLastTabIndex(index);
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

  const barGradientColors = isDark
    ? ([colors.surfaceHover, colors.surface] as const)
    : (['rgba(255, 255, 255, 0.92)', 'rgba(248, 250, 252, 0.92)'] as const);

  // Less outspoken, but still clearly defined edges
  const barBorderColor = isDark ? colors.border : colors.border;
  const barBorderWidth = 1;
  const barShadowOpacity = isDark ? 0.22 : 0.09;
  const barBaseBg = isDark ? colors.surface : colors.backgroundSecondary;

  const inactiveColor = isDark ? colors.textSecondary : colors.textTertiary;
  const inactiveIconBg = 'transparent';
  const inactiveIconBorder = 'transparent';

  return (
    <View
      style={[
        styles.container,
        isTablet && styles.containerTablet,
      ]}
    >
      {/* Background */}
      <View
        pointerEvents="none"
        style={[
          styles.solidBackgroundShadow,
          isTablet && styles.solidBackgroundShadowTablet,
          isTablet && {
            left: tabletSideInset,
            right: tabletSideInset,
          },
          {
            backgroundColor: barBaseBg,
            borderColor: barBorderColor,
            borderWidth: barBorderWidth,
            shadowColor: isDark ? colors.primary : '#000',
            shadowOpacity: barShadowOpacity,
          },
        ]}
      >
        <View
          style={[
            styles.solidBackgroundInner,
            isTablet && styles.solidBackgroundInnerTablet,
          ]}
        >
          <LinearGradient
            colors={barGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </View>

      {/* Tab items */}
      <View
        style={[
          styles.tabsContainer,
          isTablet && { width: tabletBarWidth, alignSelf: 'center' },
        ]}
      >
        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          const isContext = matchedTabIndex === null && lastTabIndex === index;
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
                style={styles.tabButton}
              >
                {/* Tab content container */}
                <View
                  style={[
                    styles.tabContent,
                  ]}
                >
                  {/* Icon with subtle background */}
                  <View style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: isActive
                        ? (isDark ? `${activeGradient[0]}35` : `${activeGradient[0]}18`)
                        : inactiveIconBg,
                      borderWidth: 0,
                      borderColor: isActive ? 'transparent' : inactiveIconBorder,
                    },
                  ]}>
                    <IconComponent
                      color={isActive ? activeGradient[0] : inactiveColor}
                      size={20}
                      filled={isActive}
                    />
                  </View>

                  {/* Label */}
                  <Text
                    style={[
                      styles.label,
                      { color: isActive ? activeGradient[0] : inactiveColor },
                      isActive && styles.labelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>

                  {/* Context indicator (non-tab pages): indicate, don't highlight */}
                  {isContext && !isActive ? (
                    <View
                      style={[
                        styles.contextDot,
                        { backgroundColor: activeGradient[0] },
                      ]}
                    />
                  ) : null}
                </View>
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
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  solidBackgroundShadow: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
  },
  solidBackgroundShadowTablet: {
    left: 0,
    right: 0,
    bottom: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 12,
  },
  solidBackgroundInner: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  solidBackgroundInnerTablet: {},
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: 8,
  },
  tabsContainerTablet: {},
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
    flex: 1,
  },
  tabButtonTablet: {},
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 56,
    marginTop: 3,
  },
  tabContentTablet: {},
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapperTablet: {},
  label: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelTablet: {},
  labelActive: {
    fontFamily: FONTS.semiBold,
  },
  contextDot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.75,
  },
});
