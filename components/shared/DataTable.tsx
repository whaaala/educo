"use client";

import { useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = enablePagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Apply staggered animation delays to rows
  useEffect(() => {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
      (row as HTMLElement).style.setProperty('--delay', `${index / 25}s`);
    });
  }, [paginatedData]);

  // Handle column header click for sorting
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setIsSorting(true);
    if (sortColumn === columnKey) {
      // Toggle sort direction
      const newSortAsc = !sortAsc;
      setSortAsc(newSortAsc);
      setSortDirection(newSortAsc ? 'asc' : 'desc');
    } else {
      // New column, start with ascending
      setSortColumn(columnKey);
      setSortAsc(true);
      setSortDirection('asc');
    }
  };

  // Reset sorting animation after it completes
  useEffect(() => {
    if (isSorting) {
      const timer = setTimeout(() => {
        setIsSorting(false);
      }, 600);
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
    <div className="w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 backdrop-blur-md shadow-lg rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-300 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 midnight:from-gray-900 midnight:to-gray-850 purple:from-gray-900 purple:to-gray-850 backdrop-blur-md px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-row items-center justify-between gap-3 border-b border-gray-200/70 dark:border-gray-700/70 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-t-xl md:rounded-t-2xl">
        <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
          {title} {searchQuery && `(${sortedData.length})`}
        </h2>

        {/* Search Bar */}
        {showSearch && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={searchPlaceholder}
            size="sm"
            className="w-full sm:w-[45%] md:w-[35%]"
          />
        )}
      </div>

      {/* Table Body Container */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-750 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 border-b-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/50 purple:border-pink-500/50 shadow-sm">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${
                    column.sortable !== false ? 'cursor-pointer group/header select-none' : ''
                  } ${
                    sortColumn === column.key
                      ? 'text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400'
                      : 'text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:text-blue-500 dark:hover:text-blue-400 midnight:hover:text-cyan-400 purple:hover:text-pink-400'
                  } ${getHiddenClasses(column.hidden)} ${column.className || ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative">
                      {column.label}
                      {sortColumn === column.key && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 midnight:from-cyan-400 midnight:to-blue-400 purple:from-pink-400 purple:to-purple-400 rounded-full"></span>
                      )}
                    </span>
                    {column.sortable !== false && (
                      <span className={`icon-arrow inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] transition-all duration-300 ${
                        sortColumn === column.key
                          ? 'bg-blue-500 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white shadow-sm scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 group-hover/header:bg-gray-200 dark:group-hover/header:bg-gray-600 midnight:group-hover/header:bg-cyan-500/10 purple:group-hover/header:bg-pink-500/10 group-hover/header:text-gray-600 dark:group-hover/header:text-gray-300 midnight:group-hover/header:text-cyan-400 purple:group-hover/header:text-pink-400'
                      } ${sortColumn === column.key && !sortAsc ? 'rotate-180' : ''}`}>
                        ↑
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  style={{
                    '--delay': `${index / 25}s`,
                  } as React.CSSProperties}
                  className={`border-b border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:shadow-sm transition-all duration-200 ${
                    isSorting ? (sortDirection === 'asc' ? 'sorting-animate-asc' : 'sorting-animate-desc') : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 md:px-4 py-4 transition-all duration-300 ${getHiddenClasses(column.hidden)} ${column.className || ''} ${!column.render ? 'overflow-hidden' : ''}`}
                    >
                      {column.render ? column.render(item, index) : (
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 block truncate">
                          {String((item as any)[column.key] || "")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {enablePagination && sortedData.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 midnight:from-gray-900 midnight:to-gray-850 purple:from-gray-900 purple:to-gray-850 backdrop-blur-md px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 border-t border-gray-200/70 dark:border-gray-700/70 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-b-xl md:rounded-b-2xl">
          {/* Left - Showing info */}
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-medium order-2 sm:order-1">
            Showing <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{Math.min(endIndex, sortedData.length)}</span> of{" "}
            <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{sortedData.length}</span> {searchQuery ? 'filtered' : 'total'} entries
          </div>

          {/* Center - Page numbers */}
          <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[30px] h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white shadow-md scale-105"
                        : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>

          {/* Right - Items per page */}
          {enableItemsPerPage && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 order-3">
              <label htmlFor="itemsPerPage" className="whitespace-nowrap">Items per page:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-500 purple:focus:ring-pink-500 cursor-pointer"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
