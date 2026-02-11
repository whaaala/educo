"use client";

import Link from "next/link";
import { SearchX, type LucideIcon } from "lucide-react";
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
    container: "py-10",
    iconOuter: "w-16 h-16",
    iconInner: "w-10 h-10",
    icon: "w-5 h-5",
    title: "text-sm font-semibold",
    description: "text-xs",
    button: "px-4 py-2 text-sm",
  },
  md: {
    container: "py-14",
    iconOuter: "w-24 h-24",
    iconInner: "w-14 h-14",
    icon: "w-7 h-7",
    title: "text-base font-bold",
    description: "text-sm",
    button: "px-5 py-2.5 text-sm",
  },
  lg: {
    container: "py-20",
    iconOuter: "w-28 h-28",
    iconInner: "w-16 h-16",
    icon: "w-8 h-8",
    title: "text-lg font-bold",
    description: "text-base",
    button: "px-6 py-3 text-base",
  },
};

/**
 * Reusable empty state component for when there's no data to display.
 * Modern design with animated entrance, gradient icon, and theme support.
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
  icon: Icon = SearchX,
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
        animate-in fade-in slide-in-from-bottom-4 duration-500
        ${config.container}
        ${className}
      `}
    >
      {/* Icon with layered rings */}
      <div className="relative mb-6">
        {/* Outer pulsing ring */}
        <div
          className={`
            ${config.iconOuter} rounded-full
            bg-gradient-to-br from-blue-50 to-blue-100/50
            dark:from-blue-900/10 dark:to-blue-800/5
            midnight:from-cyan-900/15 midnight:to-cyan-800/5
            purple:from-pink-900/15 purple:to-pink-800/5
            flex items-center justify-center
            animate-pulse
          `}
        >
          {/* Inner icon circle */}
          <div
            className={`
              ${config.iconInner} rounded-full
              bg-gradient-to-br from-blue-100 to-blue-200/80
              dark:from-blue-800/20 dark:to-blue-700/10
              midnight:from-cyan-800/25 midnight:to-cyan-700/10
              purple:from-pink-800/25 purple:to-pink-700/10
              border border-blue-200/50 dark:border-blue-700/30
              midnight:border-cyan-600/20 purple:border-pink-600/20
              flex items-center justify-center
              shadow-sm
            `}
          >
            <Icon
              className={`
                ${config.icon}
                text-blue-400 dark:text-blue-400/70
                midnight:text-cyan-400/70 purple:text-pink-400/70
              `}
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        className={`
          ${config.title}
          text-gray-800 dark:text-gray-200
          midnight:text-cyan-100 purple:text-pink-100
          mb-2
        `}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={`
            ${config.description}
            text-gray-500 dark:text-gray-400
            midnight:text-cyan-400/60 purple:text-pink-400/60
            max-w-md leading-relaxed mb-5
          `}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={`
                ${config.button}
                rounded-xl font-semibold
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700
                midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800
                purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800
                text-white shadow-md hover:shadow-lg
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className={`
                ${config.button}
                rounded-xl font-semibold cursor-pointer
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700
                midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800
                purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800
                text-white shadow-md hover:shadow-lg
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
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
