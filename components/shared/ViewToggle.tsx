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
    <div className={`relative flex items-center gap-0.5 p-0.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm ${className}`}>
      {/* Animated background slider */}
      <div
        className={`absolute h-[calc(100%-4px)] w-[calc(50%-2px)] top-0.5 rounded-md bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 shadow-lg transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          viewMode === "list" ? "left-0.5" : "left-[calc(50%+1px)]"
        }`}
      />

      <button
        onClick={() => onViewModeChange("list")}
        className="relative z-10 px-[11px] py-[7px] rounded-md transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer transform hover:scale-110 active:scale-95"
        aria-label="List view"
        title="List view"
      >
        <List className={`w-4 h-4 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          viewMode === "list"
            ? "text-white scale-110 drop-shadow-sm"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 scale-100"
        }`} />
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        className="relative z-10 px-[11px] py-[7px] rounded-md transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer transform hover:scale-110 active:scale-95"
        aria-label="Grid view"
        title="Grid view"
      >
        <Grid3x3 className={`w-4 h-4 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          viewMode === "grid"
            ? "text-white scale-110 drop-shadow-sm"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 scale-100"
        }`} />
      </button>
    </div>
  );
}
