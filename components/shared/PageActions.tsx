"use client";

import ExportButton from "./ExportButton";
import AddButton from "./AddButton";
import RefreshButton from "./RefreshButton";
import PrintButton from "./PrintButton";

interface PageActionsProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  onAdd?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
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
  onExportPDF,
  onExportExcel,
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
          {showPrint && onPrint && (
            <PrintButton onPrint={onPrint} size="md" />
          )}
        </div>
      )}

      {/* Primary Actions Group */}
      {(showExport || showAdd) && (
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Export Button */}
          {showExport && <ExportButton onExportPDF={onExportPDF} onExportExcel={onExportExcel} />}

          {/* Add Button */}
          {showAdd && <AddButton label={addButtonLabel} onClick={onAdd} />}
        </div>
      )}
    </div>
  );
}
