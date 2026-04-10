"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetColorScheme } from "./WidgetContainer";

// ============================================================================
// Types
// ============================================================================

export interface WidgetHeaderProps {
  /** Widget title */
  title: string;
  /** Icon element */
  icon: ReactNode;
  /** Color scheme for icon background */
  colorScheme?: WidgetColorScheme;
  /** Optional badge count */
  badge?: number;
  /** Optional "View All" link */
  viewAllHref?: string;
  /** Whether to show the drag handle */
  showDragHandle?: boolean;
  /** Drag handle listeners (from dnd-kit) */
  dragHandleProps?: Record<string, unknown>;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Color scheme mappings for icon backgrounds
// ============================================================================

const iconBgColors: Record<WidgetColorScheme, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
  indigo: "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30",
  violet: "bg-violet-50 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-pink-900/30",
  purple: "bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30",
  pink: "bg-pink-50 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30",
  rose: "bg-rose-50 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-pink-900/30",
  red: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
  orange: "bg-orange-50 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
  amber: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
  yellow: "bg-yellow-50 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30",
  lime: "bg-lime-50 dark:bg-lime-900/30 midnight:bg-lime-900/30 purple:bg-lime-900/30",
  green: "bg-green-50 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
  emerald: "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
  teal: "bg-teal-50 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30",
  cyan: "bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  sky: "bg-sky-50 dark:bg-sky-900/30 midnight:bg-sky-900/30 purple:bg-sky-900/30",
};

const badgeGradients: Record<WidgetColorScheme, string> = {
  blue: "from-blue-500 to-blue-600",
  indigo: "from-indigo-500 to-indigo-600",
  violet: "from-violet-500 to-purple-500",
  purple: "from-purple-500 to-purple-600",
  pink: "from-pink-500 to-pink-600",
  rose: "from-rose-500 to-rose-600",
  red: "from-red-500 to-red-600",
  orange: "from-orange-500 to-orange-600",
  amber: "from-amber-500 to-amber-600",
  yellow: "from-yellow-500 to-yellow-600",
  lime: "from-lime-500 to-lime-600",
  green: "from-green-500 to-green-600",
  emerald: "from-emerald-500 to-emerald-600",
  teal: "from-teal-500 to-teal-600",
  cyan: "from-cyan-500 to-cyan-600",
  sky: "from-sky-500 to-sky-600",
};

// ============================================================================
// Component
// ============================================================================

export function WidgetHeader({
  title,
  icon,
  colorScheme = "blue",
  badge,
  viewAllHref,
  showDragHandle = true,
  dragHandleProps,
  className,
}: WidgetHeaderProps) {
  return (
    <div
      className={cn(
        "relative px-3 py-2.5 flex items-center justify-between gap-2",
        "border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20",
        className
      )}
    >
      {/* Left side: Icon + Title + Badge */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Icon */}
        <div
          className={cn(
            "p-1.5 rounded-lg shrink-0 transition-transform duration-200",
            iconBgColors[colorScheme]
          )}
        >
          {icon}
        </div>

        {/* Title */}
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 truncate">
          {title}
        </span>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <span
            className={cn(
              "text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm min-w-[18px] text-center shrink-0",
              "bg-gradient-to-r",
              badgeGradients[colorScheme]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Right side: View All + Drag Handle */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* View All Link */}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className={cn(
              "text-[10px] font-semibold flex items-center gap-0.5 whitespace-nowrap transition-colors",
              "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
              "hover:text-blue-700 dark:hover:text-blue-300"
            )}
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        )}

        {/* Drag Handle */}
        {showDragHandle && (
          <button
            type="button"
            className={cn(
              "p-1 rounded-md cursor-grab active:cursor-grabbing transition-all duration-200",
              "text-gray-400 dark:text-gray-500",
              "hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]/50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            )}
            {...dragHandleProps}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WidgetHeader;
