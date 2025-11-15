"use client";

import { Loader2, RefreshCw } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
}

export default function LoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
  text = "Load More",
  loadingText = "Loading...",
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center items-center pt-4">
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        <span>{isLoading ? loadingText : text}</span>
      </button>
    </div>
  );
}
