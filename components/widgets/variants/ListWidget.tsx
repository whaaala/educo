"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export interface ListWidgetItem {
  id: string;
  /** Primary content */
  primary: ReactNode;
  /** Secondary content (e.g., subtitle, metadata) */
  secondary?: ReactNode;
  /** Left side element (avatar, icon, indicator) */
  left?: ReactNode;
  /** Right side element (timestamp, badge, action) */
  right?: ReactNode;
  /** Link href (makes item clickable) */
  href?: string;
  /** Click handler (if no href) */
  onClick?: () => void;
  /** Highlight variant for special states */
  variant?: "default" | "highlight" | "success" | "warning" | "danger";
}

export interface ListWidgetProps {
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
  items: ListWidgetItem[];
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
// Variant styles
// ============================================================================

const variantStyles: Record<string, string> = {
  default: cn(
    "bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/30 dark:to-gray-700/10",
    "midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20",
    "border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15",
    "hover:border-gray-200 dark:hover:border-gray-500/30 midnight:hover:border-gray-500/30 purple:hover:border-gray-500/30"
  ),
  highlight: cn(
    "bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-700/10",
    "midnight:from-cyan-900/20 midnight:to-gray-800/20 purple:from-pink-900/20 purple:to-gray-800/20",
    "border-blue-100 dark:border-blue-700/30 midnight:border-cyan-700/20 purple:border-pink-700/20",
    "hover:border-blue-300 dark:hover:border-blue-500/40 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40"
  ),
  success: cn(
    "bg-gradient-to-r from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-700/10",
    "midnight:from-emerald-900/20 midnight:to-gray-800/20 purple:from-emerald-900/20 purple:to-gray-800/20",
    "border-green-100 dark:border-green-700/30 midnight:border-emerald-700/20 purple:border-emerald-700/20",
    "hover:border-green-300 dark:hover:border-green-500/40 midnight:hover:border-emerald-500/40 purple:hover:border-emerald-500/40"
  ),
  warning: cn(
    "bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-700/10",
    "midnight:from-amber-900/20 midnight:to-gray-800/20 purple:from-amber-900/20 purple:to-gray-800/20",
    "border-amber-100 dark:border-amber-700/30 midnight:border-amber-700/20 purple:border-amber-700/20",
    "hover:border-amber-300 dark:hover:border-amber-500/40 midnight:hover:border-amber-500/40 purple:hover:border-amber-500/40"
  ),
  danger: cn(
    "bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-700/10",
    "midnight:from-red-900/20 midnight:to-gray-800/20 purple:from-red-900/20 purple:to-gray-800/20",
    "border-red-100 dark:border-red-700/30 midnight:border-red-700/20 purple:border-red-700/20",
    "hover:border-red-300 dark:hover:border-red-500/40 midnight:hover:border-red-500/40 purple:hover:border-red-500/40"
  ),
};

// ============================================================================
// Component
// ============================================================================

export function ListWidget({
  id,
  title,
  icon,
  colorScheme = "blue",
  badge,
  viewAllHref,
  items,
  maxItems = 3,
  emptyIcon,
  emptyTitle = "No items",
  emptyDescription,
  showDragHandle = true,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: ListWidgetProps) {
  const displayItems = items.slice(0, maxItems);

  const renderItem = (item: ListWidgetItem, index: number) => {
    const itemContent = (
      <div
        className={cn(
          "group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200",
          "hover:shadow-md hover:-translate-x-0.5",
          variantStyles[item.variant || "default"]
        )}
      >
        {/* Left element */}
        {item.left && <div className="flex-shrink-0">{item.left}</div>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate transition-colors">
            {item.primary}
          </div>
          {item.secondary && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">
              {item.secondary}
            </div>
          )}
        </div>

        {/* Right element */}
        {item.right && <div className="flex-shrink-0">{item.right}</div>}

        {/* Arrow for links */}
        {(item.href || item.onClick) && (
          <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600 midnight:text-gray-600 purple:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all duration-200" />
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

    return (
      <div key={item.id}>
        {itemContent}
      </div>
    );
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

export default ListWidget;
