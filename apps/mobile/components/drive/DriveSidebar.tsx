import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveSection, SIDEBAR_SECTIONS } from './driveMockData';

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

export function DriveSidebar({ activeSection, onSectionChange }: DriveSidebarProps) {
  const { colors } = useTheme();
  const storagePercent = (STORAGE_USED_MB / STORAGE_TOTAL_MB) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary, borderRightColor: colors.border }]}>
      {/* Drive title */}
      <View style={styles.titleRow}>
        <View style={[styles.titleIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="folder-open" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Drive</Text>
      </View>

      {/* Section buttons */}
      <View style={styles.sections}>
        {SIDEBAR_SECTIONS.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <Pressable
              key={section.id}
              onPress={() => onSectionChange(section.id)}
              style={[
                styles.sectionButton,
                isActive && [styles.sectionButtonActive, { backgroundColor: colors.primaryLight }],
              ]}
            >
              <Ionicons
                name={section.icon as any}
                size={20}
                color={isActive ? colors.primary : colors.textMuted}
              />
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
            </Pressable>
          );
        })}
      </View>

      {/* Storage indicator */}
      <View style={[styles.storageContainer, { borderTopColor: colors.border }]}>
        <View style={styles.storageHeader}>
          <Ionicons name="cloud-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.storageTitle, { color: colors.textSecondary }]}>Storage</Text>
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
    width: 240,
    borderRightWidth: 1,
    paddingTop: 48,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  sections: {
    paddingHorizontal: 12,
    gap: 2,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 12,
  },
  sectionButtonActive: {
    borderRadius: 10,
  },
  sectionLabel: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
  storageContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  storageTitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  storageBarBg: {
    height: 5,
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
