"use client";

import { useState, useMemo, useCallback } from "react";
import type { FilterValues, UseDataManagementReturn } from "@/types/components";

export interface UseDataManagementOptions<T> {
  /** Source data array */
  data: T[];
  /** Custom filter function */
  filterFn?: (data: T[], filters: FilterValues) => T[];
  /** Custom sort function */
  sortFn?: (data: T[], sortOption: string) => T[];
  /** Custom search function */
  searchFn?: (data: T[], query: string) => T[];
  /** Default sort option */
  defaultSort?: string;
  /** Default filters */
  defaultFilters?: FilterValues;
  /** Animation delay in ms for smooth transitions */
  animationDelay?: number;
}

/**
 * Hook for managing data filtering, sorting, and searching
 *
 * @example
 * ```tsx
 * const {
 *   processedData,
 *   filters,
 *   handleFilterChange,
 *   handleSortChange,
 * } = useDataManagement({
 *   data: feeRecords,
 *   filterFn: (data, filters) => data.filter(item => ...),
 *   sortFn: (data, sortOption) => [...data].sort(...),
 *   defaultSort: "highest_balance",
 * });
 * ```
 */
export function useDataManagement<T>({
  data,
  filterFn,
  sortFn,
  searchFn,
  defaultSort = "",
  defaultFilters = {},
  animationDelay = 300,
}: UseDataManagementOptions<T>): UseDataManagementReturn<T> {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [sortOption, setSortOption] = useState(defaultSort);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Process data through filter -> search -> sort pipeline
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterFn && Object.keys(filters).some((key) => filters[key])) {
      result = filterFn(result, filters);
    }

    // Apply search
    if (searchFn && searchQuery.trim()) {
      result = searchFn(result, searchQuery.trim());
    }

    // Apply sort
    if (sortFn && sortOption) {
      result = sortFn(result, sortOption);
    }

    return result;
  }, [data, filters, sortOption, searchQuery, filterFn, sortFn, searchFn]);

  // Handle filter change with animation
  const handleFilterChange = useCallback(
    (newFilters: FilterValues) => {
      setIsFiltering(true);
      setTimeout(() => {
        setFilters(newFilters);
        setTimeout(() => setIsFiltering(false), 100);
      }, animationDelay);
    },
    [animationDelay]
  );

  // Handle sort change with animation
  const handleSortChange = useCallback(
    (newSort: string) => {
      setIsSorting(true);
      setTimeout(() => {
        setSortOption(newSort);
        setTimeout(() => setIsSorting(false), 100);
      }, animationDelay);
    },
    [animationDelay]
  );

  // Handle search change with animation
  const handleSearchChange = useCallback(
    (query: string) => {
      setIsSearching(true);
      setTimeout(() => {
        setSearchQuery(query);
        setTimeout(() => setIsSearching(false), 100);
      }, animationDelay);
    },
    [animationDelay]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(defaultFilters);
      setTimeout(() => setIsFiltering(false), 100);
    }, animationDelay);
  }, [defaultFilters, animationDelay]);

  // Clear search immediately (no animation, used for view mode switches)
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Reset all (filters, sort, search)
  const resetAll = useCallback(() => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(defaultFilters);
      setSortOption(defaultSort);
      setSearchQuery("");
      setTimeout(() => setIsFiltering(false), 100);
    }, animationDelay);
  }, [defaultFilters, defaultSort, animationDelay]);

  return {
    processedData,
    filters,
    sortOption,
    searchQuery,
    isFiltering,
    isSorting,
    isSearching,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
    resetFilters,
    resetAll,
    clearSearch,
  };
}

export default useDataManagement;
