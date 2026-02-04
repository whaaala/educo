"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "./DataTable";
import { MoreVertical, type LucideIcon } from "lucide-react";
import type { ColumnConfig, RowAction, FilterValues } from "@/types/components";

export interface EntityTableProps<T> {
  /** Data array to display */
  data: T[];
  /** Column configuration */
  columns: ColumnConfig<T>[];
  /** Function to get unique key from item */
  getRowKey: (item: T) => string;
  /** Row action configurations */
  rowActions?: RowAction<T>[];
  /** Enable row selection */
  enableSelection?: boolean;
  /** External selection state (controlled mode) */
  selectedIds?: Set<string>;
  /** Callback when selection changes */
  onSelectionChange?: (ids: Set<string>) => void;
  /** Callback when row is clicked */
  onRowClick?: (item: T) => void;
  /** Enable pagination */
  enablePagination?: boolean;
  /** Default items per page */
  defaultItemsPerPage?: number;
  /** Items per page options */
  itemsPerPageOptions?: number[];
  /** Number of sticky columns */
  stickyColumnCount?: 0 | 1 | 2;
  /** Show search field */
  showSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Callback to clear filters */
  onClearFilters?: () => void;
  /** Whether there are active filters */
  hasActiveFilters?: boolean;
  /** Total data count (for showing filter info) */
  totalDataCount?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Loading message */
  loadingMessage?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Table title */
  title?: string;
  /** Additional className */
  className?: string;
}

// Menu position type
type MenuPosition = "top" | "bottom";

/**
 * Generic entity table component that wraps DataTable with common functionality
 * Includes selection, row actions with dropdown menu, and pagination
 * Fully responsive for all screen sizes
 *
 * @example
 * ```tsx
 * <EntityTable
 *   data={teachers}
 *   columns={teacherColumns}
 *   getRowKey={(item) => item.id}
 *   rowActions={[
 *     { id: "edit", label: "Edit", icon: Edit, onClick: handleEdit },
 *     { id: "delete", label: "Delete", icon: Trash2, onClick: handleDelete, variant: "danger" },
 *   ]}
 *   enableSelection
 *   onSelectionChange={setSelectedIds}
 * />
 * ```
 */
export default function EntityTable<T>({
  data,
  columns,
  getRowKey,
  rowActions,
  enableSelection = false,
  selectedIds: externalSelectedIds,
  onSelectionChange,
  onRowClick,
  enablePagination = true,
  defaultItemsPerPage = 10,
  itemsPerPageOptions,
  stickyColumnCount = 1,
  showSearch = true,
  searchPlaceholder,
  onClearFilters,
  hasActiveFilters,
  totalDataCount,
  isLoading = false,
  loadingMessage,
  emptyMessage,
  title,
  className = "",
}: EntityTableProps<T>) {
  const router = useRouter();

  // Internal selection state for uncontrolled mode
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const setSelectedIds = onSelectionChange ?? setInternalSelectedIds;

  // Menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>("bottom");
  const menuButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Calculate menu position based on button position
  const calculateMenuPosition = useCallback((buttonId: string) => {
    const button = menuButtonRefs.current.get(buttonId);
    if (!button) return "bottom";

    const rect = button.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const menuHeight = 250; // Approximate menu height

    return spaceBelow < menuHeight ? "top" : "bottom";
  }, []);

  // Toggle menu
  const toggleMenu = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (openMenuId === id) {
        setOpenMenuId(null);
      } else {
        setMenuPosition(calculateMenuPosition(id));
        setOpenMenuId(id);
      }
    },
    [openMenuId, calculateMenuPosition]
  );

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  // Selection handlers
  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(data.map(getRowKey)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [data, getRowKey, setSelectedIds]
  );

  const handleSelectItem = useCallback(
    (id: string, checked: boolean) => {
      const newIds = new Set(selectedIds);
      if (checked) {
        newIds.add(id);
      } else {
        newIds.delete(id);
      }
      setSelectedIds(newIds);
    },
    [selectedIds, setSelectedIds]
  );

  // Build columns with selection and actions
  const tableColumns = useMemo(() => {
    const cols: ColumnConfig<T>[] = [];

    // Selection column
    if (enableSelection) {
      cols.push({
        key: "__selection",
        label: "",
        sortable: false,
        searchable: false,
        className: "w-12",
        hidden: { mobile: true },
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
        render: (item) => {
          const id = getRowKey(item);
          return (
            <input
              type="checkbox"
              checked={selectedIds.has(id)}
              onChange={(e) => handleSelectItem(id, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          );
        },
      });
    }

    // User columns
    cols.push(...columns);

    // Actions column
    if (rowActions && rowActions.length > 0) {
      cols.push({
        key: "__actions",
        label: "",
        sortable: false,
        searchable: false,
        className: "w-16 text-right",
        render: (item) => {
          const id = getRowKey(item);
          const isOpen = openMenuId === id;
          const visibleActions = rowActions.filter((action) =>
            action.condition ? action.condition(item) : true
          );

          if (visibleActions.length === 0) return null;

          return (
            <div className="relative flex justify-end">
              <button
                ref={(el) => {
                  if (el) menuButtonRefs.current.set(id, el);
                }}
                onClick={(e) => toggleMenu(id, e)}
                className={`
                  p-2 rounded-lg transition-colors cursor-pointer
                  ${
                    isOpen
                      ? "bg-gray-200 dark:bg-gray-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className={`
                    absolute right-0 z-50 min-w-[180px]
                    bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900
                    rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
                    midnight:border-cyan-700/30 purple:border-pink-700/30
                    py-1 animate-in zoom-in-95 duration-150
                    ${menuPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  {visibleActions.map((action, index) => {
                    const Icon = action.icon;
                    const isDanger = action.variant === "danger";
                    const isWarning = action.variant === "warning";

                    return (
                      <div key={action.id}>
                        {action.dividerBefore && index > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                            setOpenMenuId(null);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                            transition-colors cursor-pointer
                            ${
                              isDanger
                                ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                : isWarning
                                ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          {action.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        },
      });
    }

    return cols;
  }, [
    enableSelection,
    columns,
    rowActions,
    isAllSelected,
    isSomeSelected,
    selectedIds,
    openMenuId,
    menuPosition,
    getRowKey,
    handleSelectAll,
    handleSelectItem,
    toggleMenu,
  ]);

  return (
    <div className={className}>
      <DataTable
        data={data}
        columns={tableColumns}
        getRowKey={getRowKey}
        title={title}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        enablePagination={enablePagination}
        defaultItemsPerPage={defaultItemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        stickyColumnCount={enableSelection ? (stickyColumnCount + 1) as 0 | 1 | 2 : stickyColumnCount}
        onRowClick={onRowClick}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalDataCount={totalDataCount}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
