"use client";

import Link from "next/link";
import { FileX, type LucideIcon } from "lucide-react";
import type { EmptyStateConfig } from "@/types/components";

export interface EmptyStateProps extends Partial<EmptyStateConfig> {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

// Size configurations
const sizeConfig = {
  sm: {
    container: "py-8",
    iconWrapper: "w-12 h-12 rounded-xl",
    icon: "w-6 h-6",
    title: "text-sm font-medium",
    description: "text-xs",
    button: "px-3 py-1.5 text-sm",
  },
  md: {
    container: "py-12",
    iconWrapper: "w-16 h-16 rounded-2xl",
    icon: "w-8 h-8",
    title: "text-base font-semibold",
    description: "text-sm",
    button: "px-4 py-2 text-sm",
  },
  lg: {
    container: "py-16",
    iconWrapper: "w-20 h-20 rounded-2xl",
    icon: "w-10 h-10",
    title: "text-lg font-semibold",
    description: "text-base",
    button: "px-6 py-2.5 text-base",
  },
};

/**
 * Reusable empty state component for when there's no data to display
 * Fully responsive with multiple size variants
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Users}
 *   title="No students found"
 *   description="Try adjusting your filters or add a new student."
 *   actionLabel="Add Student"
 *   actionHref="/students/add"
 * />
 * ```
 */
export default function EmptyState({
  icon: Icon = FileX,
  title = "No items found",
  description,
  actionLabel,
  actionHref,
  onAction,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${config.container}
        ${className}
      `}
    >
      {/* Icon */}
      <div
        className={`
          ${config.iconWrapper}
          bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800
          flex items-center justify-center mb-4
        `}
      >
        <Icon
          className={`
            ${config.icon}
            text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50
          `}
        />
      </div>

      {/* Title */}
      <h3
        className={`
          ${config.title}
          text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100
          mb-1
        `}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={`
            ${config.description}
            text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70
            max-w-sm mb-4
          `}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {(actionLabel && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={`
                ${config.button}
                rounded-lg font-medium
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                midnight:bg-cyan-600 midnight:hover:bg-cyan-700
                purple:bg-pink-600 purple:hover:bg-pink-700
                text-white transition-colors
              `}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className={`
                ${config.button}
                rounded-lg font-medium cursor-pointer
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                midnight:bg-cyan-600 midnight:hover:bg-cyan-700
                purple:bg-pink-600 purple:hover:bg-pink-700
                text-white transition-colors
              `}
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
