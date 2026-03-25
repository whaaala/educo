import { FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';

interface DriveFileGridProps {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
}

export function DriveFileGrid({ items, onItemPress, onItemLongPress, isTablet }: DriveFileGridProps) {
  const { colors } = useTheme();
  const numColumns = isTablet ? 3 : 2;

  return (
    <FlatList
      key={numColumns}
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <DriveFileItem
          item={item}
          onPress={onItemPress}
          onLongPress={onItemLongPress}
          layout="grid"
          isTablet={isTablet}
        />
      )}
      style={[styles.grid, { backgroundColor: colors.background }]}
      contentContainerStyle={isTablet ? styles.contentTablet : styles.content}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingBottom: 100,
  },
  contentTablet: {
    padding: 18,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
});

export default DriveFileGrid;
