"use client";

import { Printer } from "lucide-react";
import ExportButton from "./ExportButton";
import AddButton from "./AddButton";
import RefreshButton from "./RefreshButton";

interface PageActionsProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  onAdd?: () => void;
  addButtonLabel?: string;
  showRefresh?: boolean;
  showPrint?: boolean;
  showExport?: boolean;
  showAdd?: boolean;
  className?: string;
}

export default function PageActions({
  onRefresh,
  onPrint,
  onAdd,
  addButtonLabel = "Add",
  showRefresh = true,
  showPrint = true,
  showExport = true,
  showAdd = true,
  className = "",
}: PageActionsProps) {
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
          {showPrint && (
            <button
              onClick={onPrint}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Print"
            >
              <Printer className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          )}
        </div>
      )}

      {/* Primary Actions Group */}
      {(showExport || showAdd) && (
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Export Button */}
          {showExport && <ExportButton />}

          {/* Add Button */}
          {showAdd && <AddButton label={addButtonLabel} onClick={onAdd} />}
        </div>
      )}
    </div>
  );
}
