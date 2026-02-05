"use client";

import ExportButton from "./ExportButton";
import AddButton from "./AddButton";
import RefreshButton from "./RefreshButton";
import PrintButton from "./PrintButton";
import { LucideIcon } from "lucide-react";

interface Action {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface PageActionsProps {
  // New actions array API
  actions?: Action[];

  // Legacy API (kept for backward compatibility)
  onRefresh?: () => void;
  onPrint?: () => void;
  onAdd?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  addButtonLabel?: string;
  addButtonHref?: string;
  exportDescription?: string;
  showRefresh?: boolean;
  showPrint?: boolean;
  showExport?: boolean;
  showAdd?: boolean;
  className?: string;
}

export default function PageActions({
  actions,
  onRefresh,
  onPrint,
  onAdd,
  onExportPDF,
  onExportExcel,
  addButtonLabel = "Add",
  exportDescription = "Download data",
  showRefresh = true,
  showPrint = true,
  showExport = true,
  showAdd = true,
  className = "",
}: PageActionsProps) {
  // If using new actions array API
  if (actions && actions.length > 0) {
    return (
      <div className={`flex items-center gap-2 lg:gap-3 ${className}`}>
        {actions.map((action, index) => {
          const Icon = action.icon;

          // Special handling for Export button
          if (action.label === "Export") {
            return (
              <ExportButton
                key={index}
                onExportPDF={onExportPDF}
                onExportExcel={onExportExcel}
                description={exportDescription}
              />
            );
          }

          // Primary buttons
          if (action.variant === "primary") {
            return (
              <AddButton
                key={index}
                label={action.label}
                onClick={action.onClick}
                icon={<Icon className="w-4 h-4" />}
              />
            );
          }

          // Secondary buttons
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              <span className="text-sm whitespace-nowrap hidden sm:inline text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Legacy API
  return (
    <div className={`flex items-center justify-between lg:justify-end gap-2 lg:gap-4 w-full lg:flex-1 lg:max-w-2xl ${className}`}>
      {/* Icon Buttons Group */}
      {(showRefresh || showPrint) && (
        <div className="flex items-center gap-2">
          {/* Refresh */}
          {showRefresh && onRefresh && (
            <RefreshButton onRefresh={onRefresh} size="md" />
          )}

          {/* Print */}
          {showPrint && onPrint && (
            <PrintButton onPrint={onPrint} size="md" />
          )}
        </div>
      )}

      {/* Primary Actions Group */}
      {(showExport || showAdd) && (
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Export Button */}
          {showExport && <ExportButton onExportPDF={onExportPDF} onExportExcel={onExportExcel} description={exportDescription} />}

          {/* Add Button */}
          {showAdd && <AddButton label={addButtonLabel} onClick={onAdd} />}
        </div>
      )}
    </div>
  );
}
