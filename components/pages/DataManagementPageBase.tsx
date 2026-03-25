"use client";

import { useState, useMemo, useCallback, useEffect, type ReactNode, type ComponentType } from "react";
import PageHeader from "@/components/shared/PageHeader";
import InPageSpinner from "@/components/shared/InPageSpinner";
import PageLoader from "@/components/shared/PageLoader";
import PageActions from "@/components/shared/PageActions";
import ResponsiveListTable from "@/components/shared/ResponsiveListTable";
import SearchBar from "@/components/shared/SearchBar";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useDataManagement } from "@/components/hooks/useDataManagement";
import { useSelection } from "@/components/hooks/useSelection";
import { useViewMode } from "@/components/hooks/useViewMode";
import { useExport } from "@/components/hooks/useExport";
import { ActionBar, StatsGrid, GridView, EmptyState } from "./components";
import type {
  BreadcrumbItem,
  ColumnConfig,
  FilterField,
  FilterValues,
  SortOption,
  RowAction,
  BulkAction,
  StatCardConfig,
  ExportConfig,
  PageAction,
  EmptyStateConfig,
  GridCardProps,
  GridColumns,
  DateRange,
} from "@/types/components";

export interface DataManagementPageBaseProps<T> {
  // Required
  /** Page title */
  title: string;
  /** Page subtitle */
  subtitle?: string;
  /** Breadcrumb navigation items */
  breadcrumbs: BreadcrumbItem[];
  /** Data array to display */
  data: T[];
  /** Function to get unique key from item */
  getRowKey: (item: T) => string;
  /** Column configuration for table view */
  columns: ColumnConfig<T>[];

  // Stats
  /** Stats cards configuration */
  stats?: StatCardConfig<T>[];
  /** Stats grid column configuration */
  statsColumns?: { default?: number; sm?: number; md?: number; lg?: number };

  // Filters & Sort
  /** Filter fields configuration */
  filterFields?: FilterField[];
  /** Sort options configuration */
  sortOptions?: SortOption[];
  /** Default sort option */
  defaultSort?: string;
  /** Default filters applied on first render */
  defaultFilters?: FilterValues;
  /** Custom filter function */
  filterFn?: (data: T[], filters: FilterValues) => T[];
  /** Custom sort function */
  sortFn?: (data: T[], sortOption: string) => T[];
  /** Custom search function */
  searchFn?: (data: T[], query: string) => T[];
  /** Search placeholder (used when `searchFn` is provided) */
  searchPlaceholder?: string;

  // Date Range
  /** Enable date range filter */
  enableDateRange?: boolean;
  /** Callback when date range changes */
  onDateRangeChange?: (range: DateRange) => void;
  /**
   * Optional date getter for date range filtering.
   * If provided, items will be filtered to those whose date falls within the selected range.
   */
  getDateForRange?: (item: T) => string | Date | null | undefined;

  // View Mode
  /** Enable view toggle (grid/list) */
  enableViewToggle?: boolean;
  /** Default view mode */
  defaultViewMode?: "grid" | "list";
  /** Card component for grid view */
  gridCardComponent?: ComponentType<GridCardProps<T>>;
  /** Grid columns configuration */
  gridColumns?: GridColumns;

  // Selection
  /** Enable row selection */
  enableSelection?: boolean;
  /** Hide the built-in selection column at breakpoints */
  selectionColumnHidden?: ColumnConfig<T>["hidden"];
  /** Callback when selection changes */
  onSelectionChange?: (ids: Set<string>) => void;
  /** Maximum number of items that can be selected */
  maxSelection?: number;
  /** Controlled selection state (overrides internal selection) */
  controlledSelection?: {
    selectedIds: Set<string>;
    onChange: (ids: Set<string>) => void;
  };

  // Bulk Actions
  /** Bulk action configurations */
  bulkActions?: BulkAction[];
  /** Callback when bulk action is triggered */
  onBulkAction?: (actionId: string, selectedIds: Set<string>) => void;

  // Row Actions
  /** Row action configurations */
  rowActions?: RowAction<T>[];
  /** Callback when row action is triggered */
  onRowAction?: (actionId: string, item: T) => void;

  // Export
  /** Enable export functionality */
  enableExport?: boolean;
  /** Export configuration */
  exportConfig?: ExportConfig<T>;
  /** Custom print handler (overrides exportConfig) */
  onPrint?: (items: T[]) => void;
  /** Custom PDF export handler (overrides exportConfig) */
  onExportPDF?: (items: T[]) => void;
  /** Custom Excel export handler (overrides exportConfig) */
  onExportExcel?: (items: T[]) => void;

  // Page Actions
  /** Page header actions */
  pageActions?: PageAction[];
  /** Add button configuration */
  addButtonConfig?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  /** Callback for refresh action */
  onRefresh?: () => void;

  // Pagination
  /** Enable pagination */
  enablePagination?: boolean;
  /** Default items per page */
  defaultItemsPerPage?: number;
  /** Items per page options */
  itemsPerPageOptions?: number[];

  // Grid view pagination
  /** Enable load more for grid view */
  enableLoadMore?: boolean;
  /** Initial items to show in grid */
  initialGridCount?: number;
  /** Items to load on each "load more" */
  loadMoreCount?: number;

  // Empty State
  /** Empty state configuration */
  emptyStateConfig?: EmptyStateConfig;

  // Labels
  /** Item label (singular) */
  itemLabel?: string;
  /** Item label (plural) */
  itemLabelPlural?: string;

  // Table Options
  /** Number of sticky columns */
  stickyColumnCount?: 0 | 1 | 2;
  /** Show search in table (hidden automatically when `searchFn` is provided) */
  showTableSearch?: boolean;

  // Custom Content
  /** Content to render above the data table/grid */
  headerContent?: ReactNode;
  /** Content to render below the action bar */
  beforeContent?: ReactNode;
  /** Custom list view component (overrides default DataTable) - receives raw data */
  customListComponent?: ReactNode;
  /** Custom list render function - receives filtered/sorted data (preferred over customListComponent) */
  customListRender?: (data: T[]) => ReactNode;
  /** Modal children */
  children?: ReactNode;

  // Styling
  /** Additional className for the page container */
  className?: string;
  /** Page load animation duration */
  pageLoadDuration?: number;
}

/**
 * Reusable data management page component (layout-agnostic)
 * Provides a complete page layout with stats, filters, data table/grid, and modals
 * Fully responsive for all screen sizes
 */
export default function DataManagementPageBase<T>({
  // Required
  title,
  subtitle,
  breadcrumbs,
  data,
  getRowKey,
  columns,

  // Stats
  stats,
  statsColumns = { default: 2, sm: 2, md: 4 },

  // Filters & Sort
  filterFields,
  sortOptions,
  defaultSort = "",
  defaultFilters = {},
  filterFn,
  sortFn,
  searchFn,
  searchPlaceholder = "Search...",

  // Date Range
  enableDateRange = false,
  onDateRangeChange,
  getDateForRange,

  // View Mode
  enableViewToggle = true,
  defaultViewMode = "list",
  gridCardComponent,
  gridColumns = { sm: 1, md: 2, lg: 3, xl: 4 },

  // Selection
  enableSelection = true,
  selectionColumnHidden,
  onSelectionChange,
  maxSelection,
  controlledSelection,

  // Bulk Actions
  bulkActions,
  onBulkAction,

  // Row Actions
  rowActions,
  onRowAction,

  // Export
  enableExport = true,
  exportConfig,
  onPrint: customPrint,
  onExportPDF: customExportPDF,
  onExportExcel: customExportExcel,

  // Page Actions
  pageActions,
  addButtonConfig,
  onRefresh,

  // Pagination
  enablePagination = true,
  defaultItemsPerPage = 10,
  itemsPerPageOptions,

  // Grid view pagination
  enableLoadMore = true,
  initialGridCount = 8,
  loadMoreCount = 8,

  // Empty State
  emptyStateConfig,

  // Labels
  itemLabel = "record",
  itemLabelPlural = "records",

  // Table Options
  stickyColumnCount = 1,
  showTableSearch = true,

  // Custom Content
  headerContent,
  beforeContent,
  customListComponent,
  customListRender,
  children,

  // Styling
  className = "",
  pageLoadDuration = 600,
}: DataManagementPageBaseProps<T>) {
  const isPageLoading = usePageLoad(pageLoadDuration);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [displayedGridCount, setDisplayedGridCount] = useState(initialGridCount);

  // Data management hook
  const {
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
    clearSearch,
  } = useDataManagement({
    data,
    filterFn,
    sortFn,
    searchFn,
    defaultSort,
    defaultFilters,
  });

  // Optional date range filter (applied after filter/sort/search)
  const dateRangeFilteredData = useMemo(() => {
    if (!enableDateRange || !dateRange || !getDateForRange) return processedData;

    if (!dateRange.start || !dateRange.end) return processedData;

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    // Make end inclusive for whole-day selections
    end.setHours(23, 59, 59, 999);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return processedData;

    return processedData.filter((item) => {
      const value = getDateForRange(item);
      if (!value) return false;
      const itemDate = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(itemDate.getTime())) return false;
      return itemDate >= start && itemDate <= end;
    });
  }, [enableDateRange, dateRange, getDateForRange, processedData]);

  // Selection hook
  const {
    selectedIds,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    handleSelectAll,
    handleSelectItem,
    clearSelection,
  } = useSelection({
    items: dateRangeFilteredData,
    getKey: getRowKey,
    externalState: controlledSelection,
    onSelectionChange,
    maxSelection,
  });

  // View mode hook
  const { viewMode, setViewMode, isTransitioning } = useViewMode({
    defaultMode: defaultViewMode,
    syncWithUrl: true,
    transitionDuration: 600,
  });

  // Export hook
  const { handlePrint, handleExportPDF, handleExportExcel } = useExport(exportConfig);

  // Check if filters/search are active
  const hasActiveFilters = useMemo(() => {
    const hasFilters = Object.values(filters).some((v) => Array.isArray(v) && v.length > 0);
    const hasSearch = !!searchFn && searchQuery.trim().length > 0;
    const hasDateRange = enableDateRange && !!dateRange?.start && !!dateRange?.end;
    return hasFilters || hasSearch || hasDateRange;
  }, [filters, searchFn, searchQuery, enableDateRange, dateRange]);

  // Handle filter reset (+ search reset if enabled)
  const handleResetFilters = useCallback(() => {
    resetFilters();
    if (searchFn) handleSearchChange("");
    setFilterResetKey((k) => k + 1);
    setDateRange(null);
  }, [resetFilters, searchFn, handleSearchChange]);

  // Handle date range change
  const handleDateRangeChange = useCallback(
    (range: DateRange) => {
      setDateRange(range);
      onDateRangeChange?.(range);
    },
    [onDateRangeChange]
  );

  // Handle bulk action
  const handleBulkAction = useCallback(
    (actionId: string) => {
      const action = bulkActions?.find((a) => a.id === actionId);
      if (action) {
        action.onClick(selectedIds);
      }
      onBulkAction?.(actionId, selectedIds);
    },
    [bulkActions, selectedIds, onBulkAction]
  );

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setDisplayedGridCount((c) => c + loadMoreCount);
  }, [loadMoreCount]);

  // Reset grid count when filtered data changes (filters, sort, date range, search)
  useEffect(() => {
    setDisplayedGridCount(initialGridCount);
  }, [filters, sortOption, searchQuery, dateRange, initialGridCount]);

  // Clear grid search when switching views so searches are independent
  useEffect(() => {
    if (searchFn) {
      clearSearch();
    }
  }, [viewMode, searchFn, clearSearch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    handleResetFilters();
    clearSelection();
    setDisplayedGridCount(initialGridCount);
    onRefresh?.();
  }, [handleResetFilters, clearSelection, initialGridCount, onRefresh]);

  // Build columns with selection checkbox if enabled
  const tableColumns = useMemo(() => {
    if (!enableSelection) return columns;

    const selectionColumn: ColumnConfig<T> = {
      key: "__selection",
      label: "",
      sortable: false,
      searchable: false,
      className: "w-12",
      hidden: selectionColumnHidden,
      renderHeader: () => (
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(input) => {
            if (input) input.indeterminate = isSomeSelected;
          }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.has(getRowKey(item))}
          onChange={(e) => handleSelectItem(getRowKey(item), e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    };

    return [selectionColumn, ...columns];
  }, [
    columns,
    enableSelection,
    selectionColumnHidden,
    isAllSelected,
    isSomeSelected,
    selectedIds,
    getRowKey,
    handleSelectAll,
    handleSelectItem,
  ]);

  // Whether any loading transition is active
  const isLoadingContent = isTransitioning || isFiltering || isSorting || isSearching;

  // Get spinner message based on what's happening
  const getSpinnerMessage = () => {
    if (isTransitioning) {
      return viewMode === "grid" ? "Loading Grid Data" : "Loading Table Data";
    }
    if (isSearching) return "Searching";
    if (isFiltering) return "Filtering Data";
    if (isSorting) return "Sorting Data";
    return "Loading";
  };

  // Content transition classes
  const contentClasses = "mt-4";

  const effectiveShowTableSearch = showTableSearch && !searchFn;

  return (
    <>
      <PageLoader isLoading={isPageLoading} />

      <div
        className={`
          animate-in fade-in slide-in-from-bottom-4 duration-500
          ${className}
        `}
      >
        {/* Page Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={
            <PageActions
              onRefresh={handleRefresh}
              onPrint={enableExport ? () => (customPrint || handlePrint)(dateRangeFilteredData) : undefined}
              onExportPDF={enableExport ? () => (customExportPDF || handleExportPDF)(dateRangeFilteredData) : undefined}
              onExportExcel={enableExport ? () => (customExportExcel || handleExportExcel)(dateRangeFilteredData) : undefined}
              addButtonLabel={addButtonConfig?.label}
              addButtonHref={addButtonConfig?.href}
              onAdd={addButtonConfig?.onClick}
            />
          }
        />

        {/* Custom header content */}
        {headerContent}

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <div className="mt-6 mb-6">
            <StatsGrid stats={stats} data={data} columns={statsColumns} />
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-6 mb-4">
          <ActionBar
            filterFields={filterFields}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterResetKey={filterResetKey}
            hasActiveFilters={hasActiveFilters}
            sortOptions={sortOptions}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            enableDateRange={enableDateRange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            enableViewToggle={enableViewToggle && !!gridCardComponent}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedCount}
            bulkActions={bulkActions}
            onBulkAction={handleBulkAction}
            onClearSelection={clearSelection}
            totalCount={data.length}
            filteredCount={dateRangeFilteredData.length}
            itemLabel={itemLabel}
            itemLabelPlural={itemLabelPlural}
            leftContent={
              searchFn && viewMode === "grid" ? (
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  fullWidth
                />
              ) : undefined
            }
          />
        </div>

        {/* Custom before content */}
        {beforeContent}

        {/* Data Display */}
        <div className={contentClasses}>
          {isLoadingContent ? (
            <InPageSpinner
              loadingText={getSpinnerMessage()}
              subText="Please wait a moment..."
            />
          ) : dateRangeFilteredData.length === 0 ? (
            <EmptyState
              icon={emptyStateConfig?.icon}
              title={emptyStateConfig?.title || `No ${itemLabelPlural} found`}
              description={
                emptyStateConfig?.description ||
                "Try adjusting your filters or search criteria."
              }
              actionLabel={emptyStateConfig?.actionLabel}
              actionHref={emptyStateConfig?.actionHref}
              onAction={emptyStateConfig?.onAction}
              size="lg"
            />
          ) : viewMode === "grid" && gridCardComponent ? (
            <GridView
              data={dateRangeFilteredData}
              getKey={getRowKey}
              cardComponent={gridCardComponent}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectItem}
              onAction={(actionId, item) => onRowAction?.(actionId, item)}
              actions={rowActions}
              columns={gridColumns}
              enableLoadMore={enableLoadMore}
              displayedCount={displayedGridCount}
              onLoadMore={handleLoadMore}
              hasMore={displayedGridCount < dateRangeFilteredData.length}
            />
          ) : customListRender ? (
            customListRender(dateRangeFilteredData)
          ) : customListComponent ? (
            customListComponent
          ) : (
            <ResponsiveListTable
              variant="contained"
              showColumnHeaders={true}
              data={dateRangeFilteredData}
              columns={tableColumns}
              getRowKey={getRowKey}
              showSearch={effectiveShowTableSearch}
              enablePagination={enablePagination}
              defaultItemsPerPage={defaultItemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              stickyColumnCount={stickyColumnCount}
              onClearFilters={hasActiveFilters ? handleResetFilters : undefined}
              hasActiveFilters={hasActiveFilters}
              totalDataCount={data.length}
            />
          )}
        </div>

        {/* Modal children */}
        {children}
      </div>
    </>
  );
}

