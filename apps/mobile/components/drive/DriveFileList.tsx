import { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';

interface DriveFileListProps {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
}

export const DriveFileList = memo(function DriveFileList({ items, onItemPress, onItemLongPress, isTablet }: DriveFileListProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
      showsVerticalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <View key={item.id}>
          {!isTablet && index > 0 && (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
          <DriveFileItem
            item={item}
            onPress={onItemPress}
            onLongPress={onItemLongPress}
            layout="list"
            isTablet={isTablet}
          />
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  contentTablet: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 74,
    marginRight: 16,
  },
});

export default DriveFileList;
