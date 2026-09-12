"use client";

import { type ReactNode, type ComponentType } from "react";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import type { GridCardProps, RowAction, GridColumns } from "@/types/components";

export interface GridViewProps<T> {
  /** Data items to display */
  data: T[];
  /** Function to get unique key from item */
  getKey: (item: T) => string;
  /** Card component to render each item */
  cardComponent: ComponentType<GridCardProps<T>>;
  /** Selected item IDs */
  selectedIds?: Set<string>;
  /** Callback when item selection changes */
  onSelectionChange?: (id: string, selected: boolean) => void;
  /** Callback when action is triggered on item */
  onAction?: (actionId: string, item: T) => void;
  /** Actions available on each card */
  actions?: RowAction<T>[];
  /** Number of columns at different breakpoints */
  columns?: GridColumns;
  /** Gap between cards */
  gap?: "sm" | "md" | "lg";
  /** Enable load more pagination */
  enableLoadMore?: boolean;
  /** Initial number of items to show */
  initialCount?: number;
  /** Number of items to load on each "load more" */
  loadMoreCount?: number;
  /** Current displayed count (controlled mode) */
  displayedCount?: number;
  /** Callback for load more (controlled mode) */
  onLoadMore?: () => void;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Empty state content */
  emptyState?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
  /** Animation settings */
  animation?: {
    enabled?: boolean;
    stagger?: number;
    duration?: number;
  };
}

// Gap classes
const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

// Default column configuration
const defaultColumns: GridColumns = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

/**
 * Reusable grid view component for displaying items in a card grid
 * Fully responsive with configurable columns, pagination, and animations
 *
 * @example
 * ```tsx
 * <GridView
 *   data={feeRecords}
 *   getKey={(item) => item.id}
 *   cardComponent={FeeRecordCard}
 *   selectedIds={selectedIds}
 *   onSelectionChange={handleSelectionChange}
 *   columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
 *   enableLoadMore
 *   initialCount={8}
 * />
 * ```
 */
export default function GridView<T>({
  data,
  getKey,
  cardComponent: CardComponent,
  selectedIds = new Set(),
  onSelectionChange,
  onAction,
  actions,
  columns = defaultColumns,
  gap = "md",
  enableLoadMore = false,
  initialCount = 8,
  loadMoreCount = 8,
  displayedCount: controlledDisplayedCount,
  onLoadMore: controlledOnLoadMore,
  hasMore: controlledHasMore,
  emptyState,
  isLoading = false,
  className = "",
  animation = { enabled: true, stagger: 50, duration: 300 },
}: GridViewProps<T>) {
  // Use internal state for uncontrolled mode
  const isControlled = controlledDisplayedCount !== undefined;
  const displayedCount = isControlled ? controlledDisplayedCount : initialCount;

  // Slice data for pagination
  const displayedData = enableLoadMore ? data.slice(0, displayedCount) : data;
  const hasMore = isControlled
    ? controlledHasMore ?? false
    : displayedCount < data.length;

  // Build grid column classes
  const getGridClasses = () => {
    const classes = ["grid"];

    // Base column (mobile first - 1 column)
    classes.push("grid-cols-1");

    // Responsive columns
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

    // Gap
    classes.push(gapClasses[gap]);

    return classes.join(" ");
  };

  // Handle load more
  const handleLoadMore = () => {
    if (controlledOnLoadMore) {
      controlledOnLoadMore();
    }
    // For uncontrolled mode, parent needs to manage displayed count
  };

  // Empty state
  if (data.length === 0 && !isLoading) {
    if (emptyState) {
      return <>{emptyState}</>;
    }
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <p>No items to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Grid */}
      <div className={getGridClasses()}>
        {displayedData.map((item, index) => {
          const key = getKey(item);
          const isSelected = selectedIds.has(key);
          const delay = animation.enabled ? index * (animation.stagger || 50) : 0;

          return (
            <div
              key={key}
              className={`
                ${animation.enabled ? "animate-in fade-in zoom-in-95" : ""}
              `}
              style={{
                animationDelay: animation.enabled ? `${delay}ms` : undefined,
                animationDuration: animation.enabled ? `${animation.duration || 300}ms` : undefined,
              }}
            >
              <CardComponent
                item={item}
                isSelected={isSelected}
                onSelectionChange={(selected) => onSelectionChange?.(key, selected)}
                onAction={(actionId) => onAction?.(actionId, item)}
                actions={actions}
              />
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {enableLoadMore && hasMore && (
        <div className="mt-6 flex justify-center">
          <LoadMoreButton
            onClick={handleLoadMore}
            totalItems={data.length}
            displayedItems={displayedCount}
            loadMoreCount={loadMoreCount}
          />
        </div>
      )}

      {/* Loading overlay for load more */}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
