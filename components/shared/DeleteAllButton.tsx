"use client";

import { Trash2 } from "lucide-react";

interface DeleteAllButtonProps {
  selectedCount: number;
  onDeleteAll: () => void;
  className?: string;
}

export default function DeleteAllButton({
  selectedCount,
  onDeleteAll,
  className = "",
}: DeleteAllButtonProps) {
  if (selectedCount === 0) return null;

  return (
    <button
      onClick={onDeleteAll}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20
        border border-red-300 dark:border-red-700 midnight:border-red-600 purple:border-red-600
        text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400
        hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30
        hover:border-red-400 dark:hover:border-red-600 midnight:hover:border-red-500 purple:hover:border-red-500
        active:scale-95
        transition-all duration-200
        cursor-pointer
        font-medium text-sm
        whitespace-nowrap
        animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-300
        ${className}
      `}
      title={`Delete ${selectedCount} selected ${selectedCount === 1 ? 'item' : 'items'}`}
    >
      <Trash2 className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline">
        Delete ({selectedCount})
      </span>
      <span className="sm:hidden">
        ({selectedCount})
      </span>
    </button>
  );
}
