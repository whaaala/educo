import { useState, ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type ThemeMode } from '../../contexts/ThemeContext';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Mock user data
const mockUser = {
  name: 'Emeka Okonkwo',
  email: 'emeka.okonkwo@email.com',
  phone: '+234 803 456 7890',
  avatarUri: 'https://i.pravatar.cc/150?img=12',
  childrenCount: 2,
  memberSince: '2022',
};

interface ThemeOption {
  id: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: readonly [string, string];
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'light', label: 'Light', icon: 'sunny', colors: ['#f8fafc', '#e2e8f0'] as const },
  { id: 'dark', label: 'Dark', icon: 'moon', colors: ['#1e293b', '#0f172a'] as const },
  { id: 'midnight', label: 'Midnight', icon: 'sparkles', colors: ['#0e7490', '#083344'] as const },
  { id: 'purple', label: 'Purple', icon: 'color-palette', colors: ['#d946ef', '#7e22ce'] as const },
];

export default function MoreScreen() {
  const { colors, theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const menuSections: { title: string; items: { id: string; icon: keyof typeof Ionicons.glyphMap; label: string; subtitle: string; color: string; onPress: () => void; showArrow: boolean; rightElement?: ReactNode }[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: 'person-circle-outline' as const,
          label: 'My Profile',
          subtitle: 'View and edit your profile',
          color: colors.primary,
          onPress: () => {},
          showArrow: true,
        },
        {
          id: 'children',
          icon: 'people-outline' as const,
          label: 'My Children',
          subtitle: `${mockUser.childrenCount} children enrolled`,
          color: colors.success,
          onPress: () => {},
          showArrow: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'theme',
          icon: 'color-palette-outline' as const,
          label: 'Theme',
          subtitle: THEME_OPTIONS.find(t => t.id === theme)?.label || 'Light',
          color: colors.accent,
          onPress: () => setShowThemeSelector(!showThemeSelector),
          showArrow: true,
        },
        {
          id: 'notifications',
          icon: 'notifications-outline' as const,
          label: 'Notifications',
          subtitle: 'Receive updates and alerts',
          color: colors.warning,
          onPress: () => {},
          showArrow: false,
          rightElement: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          ),
        },
        {
          id: 'biometrics',
          icon: 'finger-print-outline' as const,
          label: 'Biometric Login',
          subtitle: 'Use fingerprint or face ID',
          color: colors.info,
          onPress: () => {},
          showArrow: false,
          rightElement: (
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          ),
        },
      ],
    },
    {
      title: 'School',
      items: [
        {
          id: 'calendar',
          icon: 'calendar-outline' as const,
          label: 'School Calendar',
          subtitle: 'Events and holidays',
          color: '#f97316',
          onPress: () => {},
          showArrow: true,
        },
        {
          id: 'handbook',
          icon: 'book-outline' as const,
          label: 'Parent Handbook',
          subtitle: 'Policies and guidelines',
          color: '#8b5cf6',
          onPress: () => {},
          showArrow: true,
        },
        {
          id: 'contact',
          icon: 'call-outline' as const,
          label: 'Contact School',
          subtitle: 'Get in touch',
          color: colors.success,
          onPress: () => {},
          showArrow: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline' as const,
          label: 'Help Center',
          subtitle: 'FAQs and guides',
          color: colors.primary,
          onPress: () => {},
          showArrow: true,
        },
        {
          id: 'feedback',
          icon: 'chatbox-outline' as const,
          label: 'Send Feedback',
          subtitle: 'Share your thoughts',
          color: colors.accent,
          onPress: () => {},
          showArrow: true,
        },
        {
          id: 'about',
          icon: 'information-circle-outline' as const,
          label: 'About',
          subtitle: 'Version 1.0.0',
          color: colors.textMuted,
          onPress: () => {},
          showArrow: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <Pressable
          style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <LinearGradient
            colors={[colors.primaryLight, colors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          />
          <View style={styles.profileContent}>
            <Image source={{ uri: mockUser.avatarUri }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{mockUser.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{mockUser.email}</Text>
              <View style={[styles.memberBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="star" size={10} color={colors.primary} />
                <Text style={[styles.memberBadgeText, { color: colors.primary }]}>
                  Member since {mockUser.memberSince}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </Pressable>

        {/* Theme Selector (Expandable) */}
        {showThemeSelector && (
          <View style={[styles.themeSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.themeSectionTitle, { color: colors.textSecondary }]}>Choose Theme</Text>
            <View style={styles.themeGrid}>
              {THEME_OPTIONS.map((option) => {
                const isSelected = theme === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.themeOption,
                      { backgroundColor: colors.backgroundSecondary, borderColor: isSelected ? colors.primary : colors.border },
                      isSelected && { borderWidth: 2 },
                    ]}
                    onPress={() => setTheme(option.id)}
                  >
                    <LinearGradient
                      colors={option.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.themePreview}
                    >
                      <Ionicons name={option.icon} size={18} color="#ffffff" />
                    </LinearGradient>
                    <Text style={[styles.themeLabel, { color: colors.text }]}>{option.label}</Text>
                    {isSelected && (
                      <View style={[styles.themeCheckmark, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={10} color="#ffffff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
            <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index < section.items.length - 1 && [styles.menuItemBorder, { borderBottomColor: colors.border }],
                  ]}
                  onPress={item.onPress}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                    {item.subtitle && (
                      <Text style={[styles.menuItemSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.rightElement || (
                    item.showArrow && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.errorLight, borderColor: colors.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Educo Parent Portal v1.0.0</Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Made with care for parents</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    gap: 4,
  },
  memberBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  themeSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  themeSectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  themeCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
});
