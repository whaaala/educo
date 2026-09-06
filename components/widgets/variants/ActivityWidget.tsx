"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
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

export type ActivityIconColor = "blue" | "green" | "purple" | "amber" | "red" | "gray";

export interface ActivityItem {
  id: string;
  /** Icon component */
  icon: LucideIcon;
  /** Icon color variant */
  iconColor?: ActivityIconColor;
  /** Activity title */
  title: string;
  /** Activity description */
  description: string;
  /** Timestamp string */
  timestamp: string;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface ActivityWidgetProps {
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
  /** Activity items to display */
  items: ActivityItem[];
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
// Icon color mappings
// ============================================================================

const iconColorStyles: Record<ActivityIconColor, { bg: string; text: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/40 midnight:bg-blue-900/40 purple:bg-blue-900/40",
    text: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40",
    text: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/40 midnight:bg-purple-900/40 purple:bg-pink-900/40",
    text: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/40 midnight:bg-amber-900/40 purple:bg-amber-900/40",
    text: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40",
    text: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-[#22262e]/40 midnight:bg-[#0f1330]/40 purple:bg-[#251340]/40",
    text: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
  },
};

// ============================================================================
// Component
// ============================================================================

export function ActivityWidget({
  id,
  title,
  icon,
  colorScheme = "blue",
  badge,
  viewAllHref,
  items,
  maxItems = 5,
  emptyIcon,
  emptyTitle = "No activity",
  emptyDescription = "Recent activity will appear here",
  showDragHandle = true,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: ActivityWidgetProps) {
  const displayItems = items.slice(0, maxItems);

  const renderItem = (item: ActivityItem, _index: number) => {
    const colorStyle = iconColorStyles[item.iconColor || "blue"];
    const IconComponent = item.icon;

    const itemContent = (
      <div
        className={cn(
          "group flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200",
          "bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/30 dark:to-gray-700/10",
          "midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20",
          "border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15",
          "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-500/30",
          "midnight:hover:border-gray-500/30 purple:hover:border-gray-500/30"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
            colorStyle.bg
          )}
        >
          <IconComponent className={cn("w-4 h-4", colorStyle.text)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">
            {item.title}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 line-clamp-2">
            {item.description}
          </div>
          <div className="text-[0.625rem] text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mt-1">
            {item.timestamp}
          </div>
        </div>

        {/* Arrow for links */}
        {(item.href || item.onClick) && (
          <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1.5 text-gray-300 dark:text-gray-600 midnight:text-gray-600 purple:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all duration-200" />
        )}
      </div>
    );

    if (item.href) {
      return (
        <Link key={item.id} href={item.href} className="block">
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
            {displayItems.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </WidgetContent>
    </WidgetContainer>
  );
}

export default ActivityWidget;
