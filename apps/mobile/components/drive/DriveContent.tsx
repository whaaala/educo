import { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { type DriveItem } from './driveMockData';
import { DriveFileItem } from './DriveFileItem';
import { DriveEmptyState } from './DriveEmptyState';
import { LoadMoreButton } from '../ui/LoadMoreButton';
import { Spinner } from '../ui/Spinner';

interface DriveContentProps {
  items: DriveItem[];
  viewMode: 'list' | 'grid';
  isTablet: boolean;
  onItemPress: (item: DriveItem) => void;
  onItemLongPress: (item: DriveItem) => void;
  emptyIcon?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  totalItems?: number;
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
  isLoading = false,
  loadingMessage,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  totalItems,
}: DriveContentProps) {
  const { colors } = useTheme();

  // Full-page loading state
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Spinner message={loadingMessage || 'Loading files...'} size="md" />
      </View>
    );
  }

  // Empty state
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

        {/* Load More button or item count */}
        {hasMore && onLoadMore ? (
          <LoadMoreButton
            onPress={onLoadMore}
            isLoading={isLoadingMore}
            text="Load More"
            loadingText="Loading..."
            displayedItems={items.length}
            totalItems={totalItems}
          />
        ) : totalItems !== undefined && totalItems > 0 ? (
          <View style={styles.countContainer}>
            <Text style={[styles.countText, { color: colors.textMuted }]}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
          </View>
        ) : null}
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
  gridContent: { padding: 10, paddingBottom: 90 },
  gridContentTablet: { padding: 18, paddingBottom: 90 },
  gridRow: { flexDirection: 'row' },
  gridEmptySlot: { flex: 1, margin: 6 },
  listContent: { paddingBottom: 90 },
  listContentTablet: { paddingTop: 8, paddingBottom: 90 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 74, marginRight: 16 },
  countContainer: { alignItems: 'center', paddingVertical: 16 },
  countText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
});

export default DriveContent;
