"use client";

import { useState, useCallback, useMemo } from "react";
import type { UseSelectionReturn } from "@/types/components";

export interface UseSelectionOptions<T> {
  /** Items to select from */
  items: T[];
  /** Function to get unique key from item */
  getKey: (item: T) => string;
  /** External state (for controlled mode) */
  externalState?: {
    selectedIds: Set<string>;
    onChange: (ids: Set<string>) => void;
  };
  /** Maximum number of items that can be selected (optional) */
  maxSelection?: number;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

/**
 * Hook for managing item selection with support for bulk operations
 *
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   isAllSelected,
 *   handleSelectAll,
 *   handleSelectItem,
 *   clearSelection,
 * } = useSelection({
 *   items: feeRecords,
 *   getKey: (item) => item.id,
 * });
 * ```
 */
export function useSelection<T>({
  items,
  getKey,
  externalState,
  maxSelection,
  onSelectionChange,
}: UseSelectionOptions<T>): UseSelectionReturn {
  const [internalIds, setInternalIds] = useState<Set<string>>(new Set());

  // Use external state if provided (controlled mode)
  const selectedIds = externalState?.selectedIds ?? internalIds;
  const setSelectedIds = useCallback(
    (ids: Set<string>) => {
      if (externalState) {
        externalState.onChange(ids);
      } else {
        setInternalIds(ids);
      }
      onSelectionChange?.(ids);
    },
    [externalState, onSelectionChange]
  );

  // Calculate derived state
  const selectedCount = selectedIds.size;
  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  // Get all item keys
  const allKeys = useMemo(() => items.map(getKey), [items, getKey]);

  // Handle select all toggle
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const keysToSelect = maxSelection
          ? allKeys.slice(0, maxSelection)
          : allKeys;
        setSelectedIds(new Set(keysToSelect));
      } else {
        setSelectedIds(new Set());
      }
    },
    [allKeys, maxSelection, setSelectedIds]
  );

  // Handle individual item selection
  const handleSelectItem = useCallback(
    (id: string, checked: boolean) => {
      const newIds = new Set(selectedIds);
      if (checked) {
        if (maxSelection && newIds.size >= maxSelection) {
          return; // Don't add if at max
        }
        newIds.add(id);
      } else {
        newIds.delete(id);
      }
      setSelectedIds(newIds);
    },
    [selectedIds, maxSelection, setSelectedIds]
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, [setSelectedIds]);

  // Select all items
  const selectAll = useCallback(() => {
    const keysToSelect = maxSelection ? allKeys.slice(0, maxSelection) : allKeys;
    setSelectedIds(new Set(keysToSelect));
  }, [allKeys, maxSelection, setSelectedIds]);

  return {
    selectedIds,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    handleSelectAll,
    handleSelectItem,
    clearSelection,
    selectAll,
  };
}

export default useSelection;
