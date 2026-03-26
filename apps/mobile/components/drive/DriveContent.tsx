import { memo, useRef, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';
import { DriveEmptyState } from './DriveEmptyState';

interface DriveContentProps {
  items: DriveItem[];
  viewMode: 'list' | 'grid';
  isTablet: boolean;
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  emptyIcon?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
}

function GridItems({ items, onItemPress, onItemLongPress, isTablet }: {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
}) {
  const numColumns = isTablet ? 3 : 2;
  const rows: DriveItem[][] = [];
  for (let i = 0; i < items.length; i += numColumns) {
    rows.push(items.slice(i, i + numColumns));
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
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
          {row.length < numColumns &&
            Array.from({ length: numColumns - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.gridEmptySlot} />
            ))
          }
        </View>
      ))}
    </>
  );
}

function ListItems({ items, onItemPress, onItemLongPress, isTablet, borderColor }: {
  items: DriveItem[];
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  isTablet: boolean;
  borderColor: string;
}) {
  return (
    <>
      {items.map((item, index) => (
        <View key={item.id}>
          {!isTablet && index > 0 && (
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
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
    </>
  );
}

export const DriveContent = memo(function DriveContent({
  items,
  viewMode,
  isTablet,
  onItemPress,
  onItemLongPress,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
}: DriveContentProps) {
  const { colors } = useTheme();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <DriveEmptyState
          icon={emptyIcon || 'folder-open-outline'}
          title={emptyTitle || 'No items'}
          subtitle={emptySubtitle}
        />
      </View>
    );
  }

  const contentPadding = viewMode === 'grid'
    ? (isTablet ? styles.gridContentTablet : styles.gridContent)
    : (isTablet ? styles.listContentTablet : styles.listContent);

  return (
    <View style={styles.container}>
      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={contentPadding}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        {viewMode === 'grid' ? (
          <GridItems
            items={items}
            onItemPress={onItemPress}
            onItemLongPress={onItemLongPress}
            isTablet={isTablet}
          />
        ) : (
          <ListItems
            items={items}
            onItemPress={onItemPress}
            onItemLongPress={onItemLongPress}
            isTablet={isTablet}
            borderColor={colors.border}
          />
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
  },
  gridContent: { padding: 10, paddingBottom: 80 },
  gridContentTablet: { padding: 18, paddingBottom: 80 },
  gridRow: { flexDirection: 'row' },
  gridEmptySlot: { flex: 1, margin: 6 },
  listContent: { paddingBottom: 80 },
  listContentTablet: { paddingTop: 8, paddingBottom: 80 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 74, marginRight: 16 },
});

export default DriveContent;
