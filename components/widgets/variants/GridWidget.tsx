"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
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

export interface GridWidgetItem {
  id: string;
  /** Image source URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Title text */
  title: string;
  /** Subtitle or metadata */
  subtitle?: ReactNode;
  /** Badge to display on image */
  badge?: {
    label: string;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
  };
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface GridWidgetProps {
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
  /** Grid items to display */
  items: GridWidgetItem[];
  /** Number of columns (2 or 3) */
  columns?: 2 | 3;
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
// Badge variant styles
// ============================================================================

const badgeVariants: Record<string, string> = {
  default: "bg-gray-500 text-white",
  primary: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-500 text-white",
};

// ============================================================================
// Component
// ============================================================================

export function GridWidget({
  id,
  title,
  icon,
  colorScheme = "purple",
  badge,
  viewAllHref,
  items,
  columns = 2,
  maxItems,
  emptyIcon,
  emptyTitle = "No items",
  emptyDescription,
  showDragHandle = true,
  dragHandleProps,
  isDragging,
  isOverlay,
  className,
}: GridWidgetProps) {
  const effectiveMaxItems = maxItems ?? (columns === 2 ? 4 : 6);
  const displayItems = items.slice(0, effectiveMaxItems);

  const renderItem = (item: GridWidgetItem) => {
    const itemContent = (
      <div
        className={cn(
          "group flex flex-col rounded-xl overflow-hidden",
          "border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15",
          "hover:border-purple-200 dark:hover:border-purple-500/30 midnight:hover:border-indigo-500/30 purple:hover:border-pink-500/30",
          "hover:shadow-md transition-all duration-200"
        )}
      >
        {/* Image area */}
        {item.image && (
          <div className="relative h-[70px] w-full">
            <Image
              src={item.image}
              alt={item.imageAlt || item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            {/* Badge */}
            {item.badge && (
              <span
                className={cn(
                  "absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[0.5625rem] font-bold",
                  badgeVariants[item.badge.variant || "default"]
                )}
              >
                {item.badge.label}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-2 bg-surface">
          <p className="text-xs font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-indigo-400 purple:group-hover:text-pink-400 transition-colors">
            {item.title}
          </p>
          {item.subtitle && (
            <div className="text-[0.625rem] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5">
              {item.subtitle}
            </div>
          )}
        </div>
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
          <div
            className={cn(
              "grid gap-2",
              columns === 2 ? "grid-cols-2" : "grid-cols-3"
            )}
          >
            {displayItems.map(renderItem)}
          </div>
        )}
      </WidgetContent>
    </WidgetContainer>
  );
}

export default GridWidget;
