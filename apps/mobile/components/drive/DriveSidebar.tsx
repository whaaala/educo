import type { ComponentProps } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveSection, SIDEBAR_SECTIONS } from './driveMockData';

/** Ionicons' own set of icon names. A name outside it renders nothing, so it is worth checking. */
type IoniconName = ComponentProps<typeof Ionicons>["name"];

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface DriveSidebarProps {
  activeSection: DriveSection;
  onSectionChange: (section: DriveSection) => void;
}

const STORAGE_USED_MB = 58.4;
const STORAGE_TOTAL_MB = 200;

// Separate main nav sections from utility sections
const MAIN_SECTIONS = SIDEBAR_SECTIONS.filter(s => ['myDrive', 'shared'].includes(s.id));
const UTILITY_SECTIONS = SIDEBAR_SECTIONS.filter(s => ['recent', 'starred', 'bin'].includes(s.id));

export function DriveSidebar({ activeSection, onSectionChange }: DriveSidebarProps) {
  const { colors } = useTheme();
  const storagePercent = (STORAGE_USED_MB / STORAGE_TOTAL_MB) * 100;

  const renderSection = (section: typeof SIDEBAR_SECTIONS[0]) => {
    const isActive = section.id === activeSection;
    return (
      <Pressable
        key={section.id}
        onPress={() => onSectionChange(section.id)}
        style={[
          styles.sectionButton,
          isActive && { backgroundColor: colors.primaryLight },
        ]}
      >
        <View style={[
          styles.sectionIconBox,
          { backgroundColor: isActive ? colors.primary + '18' : 'transparent' },
        ]}>
          <Ionicons
            name={section.icon as IoniconName}
            size={18}
            color={isActive ? colors.primary : colors.textMuted}
          />
        </View>
        <Text
          style={[
            styles.sectionLabel,
            {
              color: isActive ? colors.primary : colors.textSecondary,
              fontFamily: isActive ? FONTS.semiBold : FONTS.medium,
            },
          ]}
        >
          {section.label}
        </Text>
        {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary, borderRightColor: colors.border }]}>
      <View>
        {/* Drive title */}
        <View style={styles.titleRow}>
          <View style={[styles.titleIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="folder-open" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Drive</Text>
        </View>

        {/* Main sections */}
        <View style={styles.sectionGroup}>
          {MAIN_SECTIONS.map(renderSection)}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Utility sections */}
        <View style={styles.sectionGroup}>
          {UTILITY_SECTIONS.map(renderSection)}
        </View>
      </View>

      {/* Storage indicator */}
      <View style={[styles.storageCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.storageHeader}>
          <Ionicons name="cloud-outline" size={16} color={colors.primary} />
          <Text style={[styles.storageTitle, { color: colors.text }]}>Storage</Text>
        </View>
        <View style={[styles.storageBarBg, { backgroundColor: colors.backgroundTertiary }]}>
          <View
            style={[
              styles.storageBarFill,
              { backgroundColor: colors.primary, width: `${storagePercent}%` },
            ]}
          />
        </View>
        <Text style={[styles.storageText, { color: colors.textMuted }]}>
          {STORAGE_USED_MB} MB of {STORAGE_TOTAL_MB} MB used
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    borderRightWidth: 1,
    paddingTop: 48,
    paddingBottom: 100,
    justifyContent: 'space-between',
  },
  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 28,
    gap: 12,
  },
  titleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    letterSpacing: -0.4,
  },
  // Sections
  sectionGroup: {
    paddingHorizontal: 14,
    gap: 4,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 12,
    position: 'relative',
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    letterSpacing: -0.1,
    flex: 1,
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  // Storage
  storageCard: {
    marginHorizontal: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  storageTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  storageBarBg: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  storageText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
});

export default DriveSidebar;
