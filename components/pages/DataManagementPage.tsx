"use client";

import { useState, useMemo, useCallback, type ReactNode, type ComponentType } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import PageActions from "@/components/shared/PageActions";
import DataTable from "@/components/shared/DataTable";
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

export interface DataManagementPageProps<T> {
  // Required
  /** Page title */
  title: string;
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
  /** Custom filter function */
  filterFn?: (data: T[], filters: FilterValues) => T[];
  /** Custom sort function */
  sortFn?: (data: T[], sortOption: string) => T[];
  /** Custom search function */
  searchFn?: (data: T[], query: string) => T[];

  // Date Range
  /** Enable date range filter */
  enableDateRange?: boolean;
  /** Callback when date range changes */
  onDateRangeChange?: (range: DateRange) => void;

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
  /** Callback when selection changes */
  onSelectionChange?: (ids: Set<string>) => void;
  /** Maximum number of items that can be selected */
  maxSelection?: number;

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
  /** Show search in table */
  showTableSearch?: boolean;

  // Custom Content
  /** Content to render above the data table/grid */
  headerContent?: ReactNode;
  /** Content to render below the action bar */
  beforeContent?: ReactNode;
  /** Modal children */
  children?: ReactNode;

  // Styling
  /** Additional className for the page container */
  className?: string;
  /** Page load animation duration */
  pageLoadDuration?: number;
}

/**
 * Reusable data management page component
 * Provides a complete page layout with stats, filters, data table/grid, and modals
 * Fully responsive for all screen sizes
 *
 * @example
 * ```tsx
 * <DataManagementPage
 *   title="Fee Records"
 *   breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Fees", isActive: true }]}
 *   data={feeRecords}
 *   getRowKey={(item) => item.id}
 *   columns={feeColumns}
 *   stats={feeStats}
 *   filterFields={feeFilters}
 *   sortOptions={feeSortOptions}
 *   enableViewToggle
 *   gridCardComponent={FeeRecordCard}
 *   enableSelection
 *   bulkActions={bulkActions}
 *   rowActions={rowActions}
 * >
 *   <FeeModals {...modalProps} />
 * </DataManagementPage>
 * ```
 */
export default function DataManagementPage<T>({
  // Required
  title,
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
  filterFn,
  sortFn,
  searchFn,

  // Date Range
  enableDateRange = false,
  onDateRangeChange,

  // View Mode
  enableViewToggle = true,
  defaultViewMode = "list",
  gridCardComponent,
  gridColumns = { sm: 1, md: 2, lg: 3, xl: 4 },

  // Selection
  enableSelection = true,
  onSelectionChange,
  maxSelection,

  // Bulk Actions
  bulkActions,
  onBulkAction,

  // Row Actions
  rowActions,
  onRowAction,

  // Export
  enableExport = true,
  exportConfig,

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
  children,

  // Styling
  className = "",
  pageLoadDuration = 600,
}: DataManagementPageProps<T>) {
  const isPageLoading = usePageLoad(pageLoadDuration);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [displayedGridCount, setDisplayedGridCount] = useState(initialGridCount);

  // Data management hook
  const {
    processedData,
    filters,
    sortOption,
    isFiltering,
    handleFilterChange,
    handleSortChange,
    resetFilters,
  } = useDataManagement({
    data,
    filterFn,
    sortFn,
    searchFn,
    defaultSort,
  });

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
    items: processedData,
    getKey: getRowKey,
    onSelectionChange,
    maxSelection,
  });

  // View mode hook
  const { viewMode, setViewMode, isTransitioning } = useViewMode({
    defaultMode: defaultViewMode,
    syncWithUrl: true,
  });

  // Export hook
  const { handlePrint, handleExportPDF, handleExportExcel, isExporting } =
    useExport(exportConfig);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (v) => v !== null && v !== undefined && v !== "" && (Array.isArray(v) ? v.length > 0 : true)
    );
  }, [filters]);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    resetFilters();
    setFilterResetKey((k) => k + 1);
    setDateRange(null);
  }, [resetFilters]);

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
    isAllSelected,
    isSomeSelected,
    selectedIds,
    getRowKey,
    handleSelectAll,
    handleSelectItem,
  ]);

  // Content transition classes
  const contentClasses = `
    transition-all duration-300
    ${isFiltering || isTransitioning ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"}
  `;

  return (
    <MainLayout>
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
          breadcrumbs={breadcrumbs}
          actions={
            <PageActions
              onRefresh={handleRefresh}
              onPrint={enableExport ? () => handlePrint(processedData) : undefined}
              onExportPDF={enableExport ? () => handleExportPDF(processedData) : undefined}
              onExportExcel={enableExport ? () => handleExportExcel(processedData) : undefined}
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
        <div className="mb-4">
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
            filteredCount={processedData.length}
            itemLabel={itemLabel}
            itemLabelPlural={itemLabelPlural}
          />
        </div>

        {/* Custom before content */}
        {beforeContent}

        {/* Data Display */}
        <div className={contentClasses}>
          {processedData.length === 0 ? (
            <EmptyState
              icon={emptyStateConfig?.icon}
              title={emptyStateConfig?.title || `No ${itemLabelPlural} found`}
              description={emptyStateConfig?.description || "Try adjusting your filters or search criteria."}
              actionLabel={emptyStateConfig?.actionLabel}
              actionHref={emptyStateConfig?.actionHref}
              onAction={emptyStateConfig?.onAction}
              size="lg"
            />
          ) : viewMode === "grid" && gridCardComponent ? (
            <GridView
              data={processedData}
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
              hasMore={displayedGridCount < processedData.length}
            />
          ) : (
            <DataTable
              data={processedData}
              columns={tableColumns}
              getRowKey={getRowKey}
              showSearch={showTableSearch}
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
    </MainLayout>
  );
}
