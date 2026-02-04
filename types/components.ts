import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Color variants used across components
 */
export type ColorVariant =
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "purple"
  | "amber"
  | "indigo"
  | "teal"
  | "pink"
  | "gray";

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

/**
 * Filter values - generic key-value pairs
 */
export type FilterValues = Record<string, string | string[] | null>;

/**
 * Date range for filtering
 */
export interface DateRange {
  start: string | null;
  end: string | null;
}

// ============================================================================
// COLUMN & TABLE TYPES
// ============================================================================

/**
 * Column configuration for DataTable and EntityTable
 */
export interface ColumnConfig<T> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  renderHeader?: () => ReactNode;
  sortValue?: (item: T) => string | number;
  className?: string;
  hidden?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };
}

/**
 * Sort option for sort dropdowns
 */
export interface SortOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

/**
 * Filter field configuration
 */
export interface FilterField {
  id: string;
  label: string;
  options: string[] | { value: string; label: string }[];
  width?: "half" | "full";
  multiSelect?: boolean;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

/**
 * Row action configuration for table rows
 */
export interface RowAction<T> {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (item: T) => void;
  condition?: (item: T) => boolean;
  variant?: "danger" | "warning" | "default" | "success";
  dividerBefore?: boolean;
  dividerAfter?: boolean;
}

/**
 * Bulk action configuration for selected items
 */
export interface BulkAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (selectedIds: Set<string>) => void;
  variant?: "danger" | "warning" | "primary" | "success";
  showCount?: boolean;
  condition?: (selectedCount: number) => boolean;
}

/**
 * Page action configuration (header actions)
 */
export interface PageAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
}

/**
 * Action configuration for dropdown menus
 */
export interface ActionConfig<T> {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (item: T) => void;
  condition?: (item: T) => boolean;
  variant?: "danger" | "warning" | "default" | "success";
  dividerBefore?: boolean;
}

// ============================================================================
// STAT & DASHBOARD TYPES
// ============================================================================

/**
 * Stat card configuration
 */
export interface StatCardConfig<T = unknown> {
  icon: LucideIcon;
  label: string;
  getValue: (data: T[]) => string | number;
  color: ColorVariant;
  getBadge?: (data: T[]) => string | undefined;
  getSubtitle?: (data: T[]) => string | undefined;
  href?: string;
}

/**
 * Quick action configuration for dashboards
 */
export interface QuickActionConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: ColorVariant;
  badge?: string | number;
}

/**
 * Activity item for activity feeds
 */
export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  iconColor: ColorVariant;
  title: string;
  description?: string;
  timestamp: string;
  href?: string;
}

/**
 * List item for dashboard lists
 */
export interface DashboardListItem {
  id: string;
  title: string;
  subtitle?: string;
  value: string | number;
  avatar?: string;
  avatarColor?: string;
  href?: string;
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  type: "activity" | "list" | "chart" | "custom";
  title: string;
  icon?: LucideIcon;
  viewAllLink?: string;
  // Type-specific content
  activityItems?: ActivityItem[];
  listItems?: DashboardListItem[];
  chartConfig?: ChartConfig;
  customComponent?: ReactNode;
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  type: "bar" | "line" | "pie" | "doughnut";
  data: Record<string, number>;
  colors?: string[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "file"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
  width?: "half" | "full" | "third" | "quarter";
  helpText?: string;
  dependsOn?: {
    field: string;
    value: string | string[];
  };
}

/**
 * Form section configuration
 */
export interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  fields: FormFieldConfig[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// ============================================================================
// CARD TYPES
// ============================================================================

/**
 * Entity card configuration
 */
export interface EntityCardConfig<T> {
  getAvatar?: (item: T) => string | undefined;
  getAvatarColor?: (item: T) => string | undefined;
  getInitials?: (item: T) => string;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string | undefined;
  getSecondaryInfo?: (item: T) => string | undefined;
  getBadge?: (item: T) => { text: string; color: ColorVariant } | undefined;
  getStats?: (
    item: T
  ) => { label: string; value: string | number; color?: ColorVariant }[];
  actions?: RowAction<T>[];
}

// ============================================================================
// PAGE COMPONENT TYPES
// ============================================================================

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * Export configuration
 */
export interface ExportConfig<T> {
  filename: string;
  getPdfTitle?: () => string;
  getPdfData?: (items: T[]) => PdfExportData<T>;
  getExcelData?: (items: T[]) => ExcelExportData<T>;
  getPrintContent?: (items: T[]) => string;
}

/**
 * PDF export data structure
 */
export interface PdfExportData<T> {
  title: string;
  subtitle?: string;
  columns: { header: string; key: keyof T | ((item: T) => string) }[];
  data: T[];
  summary?: { label: string; value: string }[];
}

/**
 * Excel export data structure
 */
export interface ExcelExportData<T> {
  sheetName: string;
  columns: { header: string; key: keyof T | ((item: T) => string); width?: number }[];
  data: T[];
  summary?: { label: string; value: string }[];
}

// ============================================================================
// MODAL TYPES
// ============================================================================

/**
 * Modal state for multiple modals
 */
export interface ModalState {
  [key: string]: boolean;
}

/**
 * Modal configuration
 */
export interface ModalConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Return type for useDataManagement hook
 */
export interface UseDataManagementReturn<T> {
  processedData: T[];
  filters: FilterValues;
  sortOption: string;
  searchQuery: string;
  isFiltering: boolean;
  isSorting: boolean;
  handleFilterChange: (filters: FilterValues) => void;
  handleSortChange: (sort: string) => void;
  handleSearchChange: (query: string) => void;
  resetFilters: () => void;
  resetAll: () => void;
}

/**
 * Return type for useSelection hook
 */
export interface UseSelectionReturn {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedCount: number;
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (id: string, checked: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;
}

/**
 * Return type for useViewMode hook
 */
export interface UseViewModeReturn {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isTransitioning: boolean;
}

/**
 * Return type for useExport hook
 */
export interface UseExportReturn<T> {
  handlePrint: (items: T[]) => void;
  handleExportPDF: (items: T[]) => Promise<void>;
  handleExportExcel: (items: T[]) => Promise<void>;
  isExporting: boolean;
}

// ============================================================================
// GRID VIEW TYPES
// ============================================================================

/**
 * Grid card props passed to custom card components
 */
export interface GridCardProps<T> {
  item: T;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
  onAction: (actionId: string) => void;
  actions?: RowAction<T>[];
}

/**
 * Grid columns configuration
 */
export interface GridColumns {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
