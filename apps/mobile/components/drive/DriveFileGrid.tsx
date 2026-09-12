import { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';

interface DriveFileGridProps {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
}

export const DriveFileGrid = memo(function DriveFileGrid({ items, onItemPress, onItemLongPress, isTablet }: DriveFileGridProps) {
  const { colors } = useTheme();
  const numColumns = isTablet ? 3 : 2;

  // Split items into rows
  const rows: DriveItem[][] = [];
  for (let i = 0; i < items.length; i += numColumns) {
    rows.push(items.slice(i, i + numColumns));
  }

  return (
    <ScrollView
      style={[styles.grid, { backgroundColor: colors.background }]}
      contentContainerStyle={isTablet ? styles.contentTablet : styles.content}
      showsVerticalScrollIndicator={false}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <DriveFileItem
              key={item.id}
              item={item}
              onPress={onItemPress}
              onLongPress={onItemLongPress}
              layout="grid"
              isTablet={isTablet}
            />
          ))}
          {/* Fill empty slots so cards don't stretch */}
          {row.length < numColumns &&
            Array.from({ length: numColumns - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.emptySlot} />
            ))
          }
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  grid: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingBottom: 20,
  },
  contentTablet: {
    padding: 18,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  emptySlot: {
    flex: 1,
    margin: 6,
  },
});

export default DriveFileGrid;
