"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WidgetContainer,
  WidgetHeader,
  WidgetContent,
  type WidgetColorScheme,
} from "../base";

// ============================================================================
// Types
// ============================================================================

export interface StatItem {
  id: string;
  /** Label text */
  label: string;
  /** Value to display */
  value: string | number;
  /** Trend direction */
  trend?: "up" | "down" | "stable";
  /** Trend value (e.g., "+5%") */
  trendValue?: string;
  /** Icon for stat */
  icon?: ReactNode;
  /** Color variant */
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  /** Link to detail view */
  href?: string;
}

export interface StatsWidgetProps {
  /** Widget ID for drag-and-drop */
  id?: string;
  /** Title displayed in header */
  title: string;
  /** Icon element for header */
  icon: ReactNode;
  /** Color scheme */
  colorScheme?: WidgetColorScheme;
  /** Badge count in header */
  badge?: number;
  /** "View All" link href */
  viewAllHref?: string;
  /** Stats to display */
  stats: StatItem[];
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Show drag handle */
  showDragHandle?: boolean;
  /** Drag handle props from dnd-kit */
  dragHandleProps?: Record<string, unknown>;
  /** Whether widget is being dragged */
  isDragging?: boolean;
  /** Whether widget is drag overlay */
  isOverlay?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Variant styles
// ============================================================================

const variantBgStyles: Record<string, string> = {
  default: "bg-gray-50 dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/40 purple:bg-[#251340]/40",
  primary: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-pink-900/30",
  success: "bg-green-50 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
  warning: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
  danger: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
};

const variantTextStyles: Record<string, string> = {
  default: "text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100",
  primary: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  success: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
  danger: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
};

// ============================================================================
// Component
// ============================================================================

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (trend === "down") return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
}

export function StatsWidget({
  id,
  title,
  icon,
  colorScheme = "blue",
  badge,
  viewAllHref,
  stats,
  columns = 2,
  showDragHandle = true,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: StatsWidgetProps) {
  const renderStat = (stat: StatItem) => {
    const variant = stat.variant || "default";
    const content = (
      <div
        className={cn(
          "group p-3 rounded-xl border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15",
          "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-500/30 transition-all duration-200",
          variantBgStyles[variant]
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          {stat.icon && (
            <div className={cn("text-gray-500 dark:text-gray-400", variantTextStyles[variant])}>
              {stat.icon}
            </div>
          )}
          <span className="text-[0.625rem] font-medium text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 uppercase tracking-wide truncate">
            {stat.label}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className={cn("text-xl font-bold", variantTextStyles[variant])}>
            {stat.value}
          </span>
          {stat.trend && (
            <div className="flex items-center gap-1">
              <TrendIcon trend={stat.trend} />
              {stat.trendValue && (
                <span
                  className={cn(
                    "text-[0.625rem] font-semibold",
                    stat.trend === "up" && "text-green-600 dark:text-green-400",
                    stat.trend === "down" && "text-red-600 dark:text-red-400",
                    stat.trend === "stable" && "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {stat.trendValue}
                </span>
              )}
            </div>
          )}
          {stat.href && (
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
    );

    if (stat.href) {
      return (
        <Link key={stat.id} href={stat.href}>
          {content}
        </Link>
      );
    }

    return <div key={stat.id}>{content}</div>;
  };

  return (
    <WidgetContainer
      colorScheme={colorScheme}
      isDragging={isDragging}
      isOverlay={isOverlay}
      data-widget-id={id}
      className={className}
    >
      <WidgetHeader
        title={title}
        icon={icon}
        colorScheme={colorScheme}
        badge={badge}
        viewAllHref={viewAllHref}
        showDragHandle={showDragHandle}
        dragHandleProps={dragHandleProps}
      />
      <WidgetContent>
        <div
          className={cn(
            "grid gap-2",
            columns === 2 && "grid-cols-2",
            columns === 3 && "grid-cols-3",
            columns === 4 && "grid-cols-4"
          )}
        >
          {stats.map(renderStat)}
        </div>
      </WidgetContent>
    </WidgetContainer>
  );
}

export default StatsWidget;
