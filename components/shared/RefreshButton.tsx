"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function RefreshButton({
  onRefresh,
  size = "md",
  className = "",
  disabled = false,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || disabled) return;

    setIsRefreshing(true);

    try {
      await onRefresh();
    } finally {
      // Keep spinning for at least 500ms for visual feedback
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const sizeClasses = {
    sm: "w-7 h-7 p-1.5",
    md: "w-9 h-9 p-2",
    lg: "w-11 h-11 p-2.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={disabled || isRefreshing}
      title="Refresh"
      className={`
        ${sizeClasses[size]}
        relative flex items-center justify-center
        rounded-lg
        bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900
        border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30
        text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400
        hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10
        hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50
        hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-300 purple:hover:text-pink-300
        active:scale-95
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      <RefreshCw
        className={`
          ${iconSizes[size]}
          transition-transform duration-500 ease-in-out
          ${isRefreshing ? "animate-spin" : ""}
        `}
      />
    </button>
  );
}
