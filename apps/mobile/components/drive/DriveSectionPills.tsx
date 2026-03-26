import { memo } from 'react';
import { Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveSection, type SidebarSection } from './driveMockData';

const FONTS = {
  medium: 'Inter_500Medium',
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
              {
                backgroundColor: isActive ? colors.primary : colors.background,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[styles.text, { color: isActive ? '#ffffff' : colors.textSecondary }]}
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
  scroll: { flexGrow: 0, paddingHorizontal: 16, marginBottom: 12 },
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  text: { fontSize: 13, fontFamily: FONTS.medium, letterSpacing: -0.1 },
});

export default DriveSectionPills;
