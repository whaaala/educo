import { memo } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const FONTS = {
  regular: 'Inter_400Regular',
};

interface DriveSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  isTablet: boolean;
}

export const DriveSearchBar = memo(function DriveSearchBar({
  value,
  onChangeText,
  viewMode,
  onViewModeChange,
  isTablet,
}: DriveSearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, isTablet && styles.rowTablet]}>
      <View style={[styles.bar, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search files and folders..."
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={[styles.toggle, { backgroundColor: colors.backgroundSecondary }]}>
        <Pressable
          onPress={() => onViewModeChange('list')}
          style={[styles.toggleBtn, viewMode === 'list' && [styles.toggleActive, { backgroundColor: colors.background }]]}
        >
          <Ionicons name="list" size={18} color={viewMode === 'list' ? colors.primary : colors.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => onViewModeChange('grid')}
          style={[styles.toggleBtn, viewMode === 'grid' && [styles.toggleActive, { backgroundColor: colors.background }]]}
        >
          <Ionicons name="grid-outline" size={18} color={viewMode === 'grid' ? colors.primary : colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  rowTablet: { paddingHorizontal: 24 },
  bar: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 44, borderRadius: 12, gap: 10 },
  input: { flex: 1, fontSize: 14, fontFamily: FONTS.regular, height: '100%', paddingVertical: 0 },
  toggle: { flexDirection: 'row', borderRadius: 10, padding: 3 },
  toggleBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  toggleActive: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
});

export default DriveSearchBar;
