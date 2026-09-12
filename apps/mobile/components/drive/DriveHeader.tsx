import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveSection, type SidebarSection } from './driveMockData';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface DriveHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  sections?: SidebarSection[];
  activeSection?: DriveSection;
  onSectionChange?: (section: DriveSection) => void;
  isTablet: boolean;
}

export function DriveHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sections,
  activeSection,
  onSectionChange,
  isTablet,
}: DriveHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {/* Section pills - mobile only */}
      {!isTablet && sections && activeSection && onSectionChange && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContainer}
          style={styles.pillsScroll}
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
                  style={[
                    styles.pillText,
                    { color: isActive ? '#ffffff' : colors.textSecondary },
                  ]}
                >
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Search bar + view toggle row */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBar,
            isTablet && styles.searchBarTablet,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: 'transparent',
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search files and folders..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* View toggle */}
        <View style={[styles.viewToggle, { backgroundColor: colors.backgroundSecondary }]}>
          <Pressable
            onPress={() => onViewModeChange('list')}
            style={[
              styles.viewToggleButton,
              viewMode === 'list' && [styles.viewToggleActive, { backgroundColor: colors.background }],
            ]}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === 'list' ? colors.primary : colors.textMuted}
            />
          </Pressable>
          <Pressable
            onPress={() => onViewModeChange('grid')}
            style={[
              styles.viewToggleButton,
              viewMode === 'grid' && [styles.viewToggleActive, { backgroundColor: colors.background }],
            ]}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={viewMode === 'grid' ? colors.primary : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
  },
  containerTablet: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 12,
  },
  pillsScroll: {
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    letterSpacing: -0.1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchBarTablet: {
    height: 44,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    height: '100%',
    paddingVertical: 0,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  viewToggleButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  viewToggleActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default DriveHeader;
