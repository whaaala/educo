"use client";

import { useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Loader2, Search, FileX } from "lucide-react";
import SearchBar from "./SearchBar";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  sortable?: boolean;
  hidden?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };
  render?: (item: T, index: number) => ReactNode;
  renderHeader?: () => ReactNode;
  sortValue?: (item: T) => string | number;
  searchable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  title?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];
  getRowKey: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  enablePagination?: boolean;
  enableItemsPerPage?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalDataCount?: number;
}

export default function DataTable<T>({
  data,
  columns,
  title = "Records",
  searchPlaceholder = "Search...",
  showSearch = true,
  defaultItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 15, 20, 25],
  getRowKey,
  onRowClick,
  emptyMessage = "No records found",
  enablePagination = true,
  enableItemsPerPage = true,
  isLoading = false,
  loadingMessage = "Loading...",
  onClearFilters,
  hasActiveFilters = false,
  totalDataCount,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSearching, setIsSearching] = useState(false);
  const [sortCounter, setSortCounter] = useState(0);

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;

    const searchData = searchQuery.toLowerCase().trim();

    // Search through all searchable columns
    const searchableColumns = columns.filter(col => col.searchable !== false);

    for (const column of searchableColumns) {
      let value = "";

      if (column.sortValue) {
        value = String(column.sortValue(item));
      } else {
        value = String((item as any)[column.key] || "");
      }

      if (value.toLowerCase().includes(searchData)) {
        return true;
      }
    }

    return false;
  });

  // Sort data based on selected column
  const sortedData = sortColumn !== null ? [...filteredData].sort((a, b) => {
    const column = columns.find(col => col.key === sortColumn);
    if (!column) return 0;

    let firstValue: string | number;
    let secondValue: string | number;

    if (column.sortValue) {
      firstValue = column.sortValue(a);
      secondValue = column.sortValue(b);
    } else {
      firstValue = String((a as any)[column.key] || "");
      secondValue = String((b as any)[column.key] || "");
    }

    // Handle string comparison
    if (typeof firstValue === "string" && typeof secondValue === "string") {
      firstValue = firstValue.toLowerCase();
      secondValue = secondValue.toLowerCase();
    }

    if (sortAsc) {
      return firstValue < secondValue ? -1 : 1;
    } else {
      return firstValue < secondValue ? 1 : -1;
    }
  }) : filteredData;

  // Calculate pagination based on sorted data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Apply pagination to sorted data
  const displayData = enablePagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Handle search with animation
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setIsSearching(true);

    // Reset searching state after animation completes
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Apply staggered animation delays to rows for sorting
  useEffect(() => {
    if (!isSorting) return;

    // Use setTimeout to ensure DOM has been updated with new sorted data
    setTimeout(() => {
      const allRows = document.querySelectorAll('tbody tr');
      const totalRows = allRows.length;
      console.log('🎯 Applying sort animation delays, totalRows:', totalRows, 'sortAsc:', sortAsc, 'sortDirection:', sortDirection);

      allRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        // For ascending: first rows (top) should have longest delay (animate last from bottom)
        // For descending: first rows (top) should have shortest delay (animate first from top)
        const delay = sortAsc
          ? ((totalRows - 1 - index) / 150)  // Ascending: reverse delay (bottom to top) - ultra fast cascade
          : (index / 150);                    // Descending: normal delay (top to bottom) - ultra fast cascade
        htmlRow.style.setProperty('--delay', `${delay}s`);
        console.log(`📌 Row ${index} delay:`, delay, 'sortAsc:', sortAsc);
      });
    }, 0);
  }, [isSorting, sortAsc, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    // Don't sort if there are no results
    if (sortedData.length === 0) return;

    console.log('🔄 Sorting triggered:', columnKey);

    if (sortColumn === columnKey) {
      // Toggle sort direction
      const newSortAsc = !sortAsc;
      setSortAsc(newSortAsc);
      setSortDirection(newSortAsc ? 'asc' : 'desc');
      console.log('📊 Direction:', newSortAsc ? 'asc' : 'desc');
    } else {
      // New column, start with ascending
      setSortColumn(columnKey);
      setSortAsc(true);
      setSortDirection('asc');
      console.log('📊 New column, direction: asc');
    }

    // Increment sort counter to trigger re-render with new keys
    setSortCounter(prev => prev + 1);

    // Trigger animation after state updates
    setTimeout(() => {
      console.log('✨ Setting isSorting to true');
      setIsSorting(true);
    }, 50);
  };

  // Reset sorting animation after it completes
  useEffect(() => {
    if (isSorting) {
      console.log('⏰ isSorting is true, will reset after 250ms');
      const timer = setTimeout(() => {
        console.log('🔚 Resetting isSorting to false');
        setIsSorting(false);
      }, 250); // Ultra fast animation duration (0.15s animation + tiny delays)
      return () => clearTimeout(timer);
    }
  }, [isSorting]);

  // Helper function to get responsive classes
  const getHiddenClasses = (hidden?: { mobile?: boolean; tablet?: boolean; desktop?: boolean }) => {
    if (!hidden) return "";

    const classes = [];
    if (hidden.mobile) classes.push("hidden sm:table-cell");
    if (hidden.tablet) classes.push("hidden md:table-cell");
    if (hidden.desktop) classes.push("hidden lg:table-cell");

    return classes.join(" ");
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-lg rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-300 overflow-visible">
      {/* Table Header */}
      {(title || showSearch) && (
        <div className="bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-row items-center justify-between gap-2 sm:gap-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-t-xl md:rounded-t-2xl">
          <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
            {title} {searchQuery && `(${sortedData.length})`}
          </h2>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            {/* Search Bar */}
            {showSearch && (
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                size="sm"
                className="w-full sm:w-[45%] md:w-[35%]"
              />
            )}
          </div>
        </div>
      )}

      {/* Table Body Container */}
      <div className="overflow-x-auto overflow-y-visible -mx-px smooth-scroll snap-x snap-mandatory">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border-b border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
              {columns.map((column, index) => {
                // Determine alignment from className
                const isLeftAligned = column.className?.includes('text-left');
                const isCenterAligned = column.className?.includes('text-center') || !isLeftAligned;
                const justifyClass = isLeftAligned ? 'justify-start' : 'justify-center';

                // Make first two columns sticky on mobile
                const stickyClass = index === 0
                  ? 'md:relative md:left-auto sticky left-0 z-30 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800'
                  : index === 1
                  ? 'md:relative md:left-auto sticky left-[80px] z-30 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800'
                  : '';

                return (
                <th
                  key={column.key}
                  onClick={() => column.renderHeader ? undefined : handleSort(column.key)}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-[10px] md:text-[9px] lg:text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap align-middle transition-all duration-300 ease-in-out ${stickyClass} ${
                    sortedData.length === 0
                      ? 'cursor-not-allowed opacity-50'
                      : column.sortable !== false && !column.renderHeader ? 'cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-gray-600/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10' : ''
                  } ${
                    sortedData.length === 0
                      ? 'text-gray-400 dark:text-gray-500'
                      : sortColumn === column.key
                      ? 'text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10'
                      : 'text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300'
                  } ${getHiddenClasses(column.hidden)} ${column.className || ''}`}
                >
                  {column.renderHeader ? (
                    column.renderHeader()
                  ) : (
                    <div className={`flex items-center ${justifyClass} gap-1.5`}>
                      <span className="relative">
                        {column.label}
                      </span>
                      {column.sortable !== false && (
                        <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                          sortColumn === column.key
                            ? 'text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100'
                            : 'text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100'
                        } ${sortColumn === column.key && !sortAsc ? 'rotate-180' : 'rotate-0'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                      {/* Spinning loader */}
                      <Loader2
                        className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      />

                      {/* Pulsing circle background */}
                      <div className="absolute inset-0 -z-10">
                        <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 animate-pulse" />
                      </div>
                    </div>

                    {/* Loading message */}
                    <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 animate-pulse">
                      {loadingMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : displayData.length > 0 ? (
              displayData.map((item, index) => {
                const animationClass = isSorting ? (sortDirection === 'asc' ? 'sorting-animate-asc' : 'sorting-animate-desc') : '';

                if (index === 0) {
                  console.log('🎨 First row classes:', {
                    isSorting,
                    sortDirection,
                    animationClass,
                    isSearching
                  });
                }

                return (
                  <tr
                  key={`${getRowKey(item, index)}-${sortCounter}-${searchQuery}`}
                  style={{
                    animation: isSearching ? `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index / 80}s both` : undefined,
                  } as React.CSSProperties}
                  className={`border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 ${!isSorting ? 'transition-all duration-200' : ''} ${animationClass} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => {
                    // Make first two columns sticky on mobile with shadow to indicate more content
                    const stickyClass = colIndex === 0
                      ? 'md:relative md:left-auto sticky left-0 z-20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 after:md:hidden after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:shadow-[2px_0_4px_rgba(0,0,0,0.1)] after:pointer-events-none'
                      : colIndex === 1
                      ? 'md:relative md:left-auto sticky left-[80px] z-20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 after:md:hidden after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:shadow-[2px_0_4px_rgba(0,0,0,0.1)] after:pointer-events-none'
                      : '';

                    return (
                    <td
                      key={column.key}
                      className={`px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle transition-colors duration-200 ${stickyClass} ${getHiddenClasses(column.hidden)} ${column.className || ''}`}
                    >
                      {column.render ? column.render(item, index) : (
                        <span className="text-[12px] font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 block truncate">
                          {String((item as any)[column.key] || "")}
                        </span>
                      )}
                    </td>
                    );
                  })}
                </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 sm:py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                    {/* Icon with simple circular background */}
                    <div className="relative mb-6">
                      {/* Simple circular background */}
                      <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10">
                        {searchQuery.trim() ? (
                          <Search className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" strokeWidth={2} />
                        ) : (
                          <FileX className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/60 purple:text-pink-400/60" strokeWidth={2} />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-2">
                      {searchQuery.trim() ? 'No results found' : 'No data available'}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-relaxed">
                      {searchQuery.trim()
                        ? `No results match "${searchQuery}". Try a different search term.`
                        : hasActiveFilters
                        ? 'No results match the current filters. Try adjusting your filters.'
                        : emptyMessage}
                    </p>

                    {/* Clear search/filters button */}
                    {(searchQuery.trim() || (hasActiveFilters && onClearFilters)) && (
                      <button
                        onClick={() => {
                          if (searchQuery.trim()) {
                            setIsSearching(true);
                            setSearchQuery('');
                            setCurrentPage(1);
                          } else if (onClearFilters) {
                            onClearFilters();
                          }
                        }}
                        className="mt-6 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        {searchQuery.trim() ? 'Clear search' : 'Clear filters'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {enablePagination && (totalDataCount ? totalDataCount > 0 : data.length > 0) && (
        <div className={`bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-b-xl md:rounded-b-2xl transition-opacity duration-200 ${
          isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}>
          {/* Left - Showing info */}
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-medium order-2 sm:order-1">
            {sortedData.length > 0 ? (
              <>
                Showing <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{Math.min(endIndex, sortedData.length)}</span> of{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{sortedData.length}</span> {searchQuery.trim() ? 'filtered' : 'total'} entries
              </>
            ) : (
              <>
                Showing <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">0</span> of{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{data.length}</span> total entries
              </>
            )}
          </div>

          {/* Center - Page numbers */}
          <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || sortedData.length === 0 || isLoading}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === 1 || sortedData.length === 0 || isLoading
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
              style={{ cursor: currentPage === 1 || sortedData.length === 0 || isLoading ? 'not-allowed' : 'pointer' }}
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1;

                const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                  return null;
                }

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400 dark:text-gray-500 font-bold">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => sortedData.length > 0 && !isLoading && setCurrentPage(pageNum)}
                    disabled={sortedData.length === 0 || isLoading}
                    className={`min-w-[30px] h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                      sortedData.length === 0 || isLoading
                        ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : currentPage === pageNum
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white shadow-md scale-105 cursor-pointer"
                        : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:scale-105 active:scale-95 cursor-pointer"
                    }`}
                    style={{ cursor: sortedData.length === 0 || isLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || sortedData.length === 0 || isLoading}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === totalPages || sortedData.length === 0 || isLoading
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
              style={{ cursor: currentPage === totalPages || sortedData.length === 0 || isLoading ? 'not-allowed' : 'pointer' }}
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>

          {/* Right - Items per page */}
          {enableItemsPerPage && (
            <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm order-3 ${
              sortedData.length === 0 || isLoading
                ? 'text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-50'
                : 'text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70'
            }`}>
              <label htmlFor="itemsPerPage" className="whitespace-nowrap font-medium">Items per page:</label>
              <div className="relative">
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  disabled={sortedData.length === 0 || isLoading}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold focus:outline-none transition-all duration-200 ${
                    sortedData.length === 0 || isLoading
                      ? 'cursor-not-allowed opacity-60 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                      : 'cursor-pointer border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400 hover:shadow-md focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 midnight:focus:ring-cyan-500/50 purple:focus:ring-pink-500/50'
                  }`}
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                  sortedData.length === 0 || isLoading
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
