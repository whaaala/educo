"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WidgetContainer,
  WidgetHeader,
  WidgetContent,
  WidgetEmpty,
  type WidgetColorScheme,
} from "../base";

// ============================================================================
// Types
// ============================================================================

export type StatusType = "approved" | "pending" | "rejected" | "completed" | "overdue" | "warning";

export interface StatusListItem {
  id: string;
  /** Primary title */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Status type */
  status: StatusType;
  /** Custom status label (defaults to status name) */
  statusLabel?: string;
  /** Additional info (e.g., date range) */
  info?: ReactNode;
  /** Right side value (e.g., amount, duration) */
  value?: string | number;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface StatusListWidgetProps {
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
  /** List items to display */
  items: StatusListItem[];
  /** Maximum items to display */
  maxItems?: number;
  /** Empty state icon */
  emptyIcon?: ReactNode;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
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
// Status configuration
// ============================================================================

interface StatusConfig {
  icon: ReactNode;
  bgClass: string;
  textClass: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  gradientFrom: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  approved: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bgClass: "bg-green-100 dark:bg-green-900/40",
    textClass: "text-green-600 dark:text-green-400",
    badgeBg: "bg-green-100 dark:bg-green-900/40",
    badgeText: "text-green-700 dark:text-green-400",
    borderClass: "border-green-100 dark:border-green-700/20 hover:border-green-300 dark:hover:border-green-500/40",
    gradientFrom: "from-green-50/50 dark:from-green-900/10",
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bgClass: "bg-emerald-100 dark:bg-emerald-900/40",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    borderClass: "border-emerald-100 dark:border-emerald-700/20 hover:border-emerald-300 dark:hover:border-emerald-500/40",
    gradientFrom: "from-emerald-50/50 dark:from-emerald-900/10",
  },
  pending: {
    icon: <Clock className="w-4 h-4" />,
    bgClass: "bg-amber-100 dark:bg-amber-900/40",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-100 dark:border-amber-700/20 hover:border-amber-300 dark:hover:border-amber-500/40",
    gradientFrom: "from-amber-50/50 dark:from-amber-900/10",
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bgClass: "bg-orange-100 dark:bg-orange-900/40",
    textClass: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 dark:bg-orange-900/40",
    badgeText: "text-orange-700 dark:text-orange-400",
    borderClass: "border-orange-100 dark:border-orange-700/20 hover:border-orange-300 dark:hover:border-orange-500/40",
    gradientFrom: "from-orange-50/50 dark:from-orange-900/10",
  },
  rejected: {
    icon: <XCircle className="w-4 h-4" />,
    bgClass: "bg-red-100 dark:bg-red-900/40",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900/40",
    badgeText: "text-red-700 dark:text-red-400",
    borderClass: "border-red-100 dark:border-red-700/20 hover:border-red-300 dark:hover:border-red-500/40",
    gradientFrom: "from-red-50/50 dark:from-red-900/10",
  },
  overdue: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bgClass: "bg-red-100 dark:bg-red-900/40",
    textClass: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900/40",
    badgeText: "text-red-700 dark:text-red-400",
    borderClass: "border-red-200 dark:border-red-700/30 hover:border-red-300 dark:hover:border-red-500/40",
    gradientFrom: "from-red-50/80 dark:from-red-900/20",
  },
};

// ============================================================================
// Component
// ============================================================================

export function StatusListWidget({
  id,
  title,
  icon,
  colorScheme = "cyan",
  badge,
  viewAllHref,
  items,
  maxItems = 2,
  emptyIcon,
  emptyTitle = "No items",
  emptyDescription,
  showDragHandle = true,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: StatusListWidgetProps) {
  const displayItems = items.slice(0, maxItems);

  const renderItem = (item: StatusListItem) => {
    const config = statusConfig[item.status];

    const itemContent = (
      <div
        className={cn(
          "group p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md",
          "bg-gradient-to-r to-white dark:to-gray-700/10 midnight:to-gray-800/20 purple:to-gray-800/20",
          config.gradientFrom,
          config.borderClass
        )}
      >
        {/* Top row: Icon + Title + Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Status Icon */}
            <div className={cn("relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center", config.bgClass)}>
              <span className={config.textClass}>{config.icon}</span>
            </div>
            {/* Title & Subtitle */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-[0.6875rem] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
          {/* Status Badge */}
          <span
            className={cn(
              "flex-shrink-0 px-2 py-1 rounded-lg text-[0.625rem] font-bold uppercase",
              config.badgeBg,
              config.badgeText
            )}
          >
            {item.statusLabel || item.status}
          </span>
        </div>

        {/* Bottom row: Info + Value */}
        {(item.info || item.value) && (
          <div className="flex items-center justify-between gap-2 mt-2">
            {item.info && (
              <div className="flex-1 text-[0.6875rem] text-gray-500 dark:text-gray-400 truncate">
                {item.info}
              </div>
            )}
            {item.value && (
              <span className={cn("text-sm font-bold min-w-[45px] text-right", config.textClass)}>
                {item.value}
              </span>
            )}
          </div>
        )}
      </div>
    );

    if (item.href) {
      return (
        <Link key={item.id} href={item.href}>
          {itemContent}
        </Link>
      );
    }

    if (item.onClick) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className="w-full text-left"
        >
          {itemContent}
        </button>
      );
    }

    return <div key={item.id}>{itemContent}</div>;
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
        {displayItems.length === 0 ? (
          <WidgetEmpty
            icon={emptyIcon || icon}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {displayItems.map(renderItem)}
          </div>
        )}
      </WidgetContent>
    </WidgetContainer>
  );
}

export default StatusListWidget;
