"use client";

import { ArrowRightLeft } from "lucide-react";

interface BulkTransferButtonProps {
  selectedCount: number;
  onBulkTransfer: () => void;
  className?: string;
}

export default function BulkTransferButton({
  selectedCount,
  onBulkTransfer,
  className = "",
}: BulkTransferButtonProps) {
  if (selectedCount === 0) return null;

  return (
    <button
      onClick={onBulkTransfer}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20
        border border-blue-300 dark:border-blue-700 midnight:border-cyan-600 purple:border-pink-600
        text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400
        hover:bg-blue-100 dark:hover:bg-blue-900/30 midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30
        hover:border-blue-400 dark:hover:border-blue-600 midnight:hover:border-cyan-500 purple:hover:border-pink-500
        active:scale-95
        transition-all duration-200
        cursor-pointer
        font-medium text-sm
        whitespace-nowrap
        animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-300
        ${className}
      `}
      title={`Transfer ${selectedCount} selected ${selectedCount === 1 ? 'student' : 'students'}`}
    >
      <ArrowRightLeft className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline">
        Transfer ({selectedCount})
      </span>
      <span className="sm:hidden">
        ({selectedCount})
      </span>
    </button>
  );
}
