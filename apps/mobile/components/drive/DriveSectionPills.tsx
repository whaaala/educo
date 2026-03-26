import { memo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveSection, type SidebarSection } from './driveMockData';

const FONTS = {
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
};

interface DriveSectionPillsProps {
  sections: SidebarSection[];
  activeSection: DriveSection;
  onSectionChange: (section: DriveSection) => void;
}

export const DriveSectionPills = memo(function DriveSectionPills({
  sections,
  activeSection,
  onSectionChange,
}: DriveSectionPillsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {sections.map((section) => {
        const isActive = section.id === activeSection;
        return (
          <Pressable
            key={section.id}
            onPress={() => onSectionChange(section.id)}
            style={[
              styles.pill,
              isActive
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Ionicons
              name={section.icon as any}
              size={15}
              color={isActive ? '#ffffff' : colors.textMuted}
            />
            <Text
              style={[
                styles.text,
                {
                  color: isActive ? '#ffffff' : colors.textSecondary,
                  fontFamily: isActive ? FONTS.semiBold : FONTS.medium,
                },
              ]}
            >
              {section.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginBottom: 10 },
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, paddingHorizontal: 16 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  text: { fontSize: 13, letterSpacing: -0.1 },
});

export default DriveSectionPills;
