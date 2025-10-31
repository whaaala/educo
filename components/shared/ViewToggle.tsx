"use client";

import { Grid3x3, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

export default function ViewToggle({
  viewMode,
  onViewModeChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 ${className}`}>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
          viewMode === "list"
            ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 shadow-md"
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
        aria-label="List view"
        title="List view"
      >
        <List className={`w-4 h-4 transition-colors ${
          viewMode === "list"
            ? "text-white"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
          viewMode === "grid"
            ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 shadow-md"
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
        aria-label="Grid view"
        title="Grid view"
      >
        <Grid3x3 className={`w-4 h-4 transition-colors ${
          viewMode === "grid"
            ? "text-white"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
      </button>
    </div>
  );
}
