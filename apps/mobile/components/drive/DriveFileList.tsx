import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';

interface DriveFileListProps {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
}

export function DriveFileList({ items, onItemPress, onItemLongPress, isTablet }: DriveFileListProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DriveFileItem
          item={item}
          onPress={onItemPress}
          onLongPress={onItemLongPress}
          layout="list"
          isTablet={isTablet}
        />
      )}
      ItemSeparatorComponent={
        isTablet
          ? undefined
          : () => (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.border },
                ]}
              />
            )
      }
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  contentTablet: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 74,
    marginRight: 16,
  },
});

export default DriveFileList;
