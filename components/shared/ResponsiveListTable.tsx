"use client";

import React, { forwardRef } from "react";
import DataTable, { type ColumnConfig, type DataTableProps } from "./DataTable";

// Re-export ColumnConfig for consumers
export type { ColumnConfig };

export interface ResponsiveListTableProps<T> {
  /** Data array to render */
  data: T[];
  /** Column configuration — same as DataTable ColumnConfig */
  columns: ColumnConfig<T>[];
  /** Unique key extractor for each row */
  getRowKey: (item: T, index: number) => string;

  /**
   * Visual variant:
   * - "seamless": no outer border/shadow — rows flow into the page (Drive style)
   * - "contained": rounded card with border, shadow, scroll hint (Messages/Chat style)
   */
  variant?: "seamless" | "contained";

  /** Show table column headers (default: false for list-style look) */
  showColumnHeaders?: boolean;

  // ── Interaction ──
  onRowClick?: (item: T) => void;

  // ── Pagination ──
  enablePagination?: boolean;
  enableItemsPerPage?: boolean;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];

  // ── Search (off by default — most list tables manage search externally) ──
  showSearch?: boolean;
  searchPlaceholder?: string;

  // ── Empty / Loading ──
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalDataCount?: number;

  // ── Mobile behavior ──
  stickyColumnCount?: 0 | 1 | 2;
  /**
   * Disable horizontal scrolling (default: true for seamless, false for contained).
   * When false, a gradient scroll hint is shown on mobile.
   */
  disableHorizontalScroll?: boolean;

  /** Table title (shown in DataTable header bar when showSearch is also true) */
  title?: string;

  // ── Styling ──
  className?: string;
}

/**
 * ResponsiveListTable — a reusable, responsive list-style table component.
 *
 * Wraps DataTable with the glossy/curvy design pattern used across
 * Messages, Chat, Call Logs, and Drive pages. Provides two variants:
 *
 * - **"contained"** (default): Rounded card with border, shadow, and mobile scroll hint.
 *   Used for communication tables (Messages, Chat, Call Logs).
 *
 * - **"seamless"**: No outer border/shadow — rows blend into the page.
 *   Used for file browsers (Drive).
 *
 * Both variants share: no horizontal scroll by default, hidden column headers,
 * glossy pagination footer, responsive column hiding, and tight row spacing.
 */
function ResponsiveListTableInner<T>(
  {
    data,
    columns,
    getRowKey,
    variant = "contained",
    showColumnHeaders = false,
    onRowClick,
    enablePagination = true,
    enableItemsPerPage = true,
    defaultItemsPerPage = 15,
    itemsPerPageOptions,
    showSearch = false,
    searchPlaceholder,
    title,
    isLoading,
    loadingMessage,
    emptyMessage = "No records found",
    onClearFilters,
    hasActiveFilters,
    totalDataCount,
    stickyColumnCount = 0,
    disableHorizontalScroll,
    className = "",
  }: ResponsiveListTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // Default disableHorizontalScroll based on variant
  const shouldDisableHScroll = disableHorizontalScroll ?? (variant === "seamless");

  const containerClassName =
    variant === "contained"
      ? "relative bg-surface rounded-xl sm:rounded-2xl border border-line shadow-sm"
      : "";

  return (
    <div ref={ref} className={`${containerClassName} ${className}`}>
      {/* Mobile scroll hint — only for contained variant with horizontal scroll */}
      {variant === "contained" && !shouldDisableHScroll && (
        <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none rounded-r-xl" />
      )}

      <DataTable<T>
        data={data}
        columns={columns}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
        title={title || ""}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        enablePagination={enablePagination}
        enableItemsPerPage={enableItemsPerPage}
        defaultItemsPerPage={defaultItemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        hideColumnHeaders={!showColumnHeaders}
        disableHorizontalScroll={shouldDisableHScroll}
        stickyColumnCount={stickyColumnCount}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        emptyMessage={emptyMessage}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalDataCount={totalDataCount}
      />
    </div>
  );
}

// forwardRef with generic support
const ResponsiveListTable = forwardRef(ResponsiveListTableInner) as <T>(
  props: ResponsiveListTableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export default ResponsiveListTable;
