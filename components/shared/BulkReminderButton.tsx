"use client";

import { Send } from "lucide-react";

interface BulkReminderButtonProps {
  selectedCount: number;
  onBulkReminder: () => void;
  className?: string;
}

export default function BulkReminderButton({
  selectedCount,
  onBulkReminder,
  className = "",
}: BulkReminderButtonProps) {
  if (selectedCount === 0) return null;

  return (
    <button
      onClick={onBulkReminder}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20
        border border-orange-300 dark:border-orange-700 midnight:border-orange-600 purple:border-orange-600
        text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400
        hover:bg-orange-100 dark:hover:bg-orange-900/30 midnight:hover:bg-orange-900/30 purple:hover:bg-orange-900/30
        hover:border-orange-400 dark:hover:border-orange-600 midnight:hover:border-orange-500 purple:hover:border-orange-500
        active:scale-95
        transition-all duration-200
        cursor-pointer
        font-medium text-sm
        whitespace-nowrap
        animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-300
        ${className}
      `}
      title={`Send reminder to ${selectedCount} selected ${selectedCount === 1 ? 'record' : 'records'}`}
    >
      <Send className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline">
        Send Reminder ({selectedCount})
      </span>
      <span className="sm:hidden">
        ({selectedCount})
      </span>
    </button>
  );
}
