"use client";

import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type WidgetColorScheme =
  | "blue" | "indigo" | "violet" | "purple" | "pink"
  | "rose" | "red" | "orange" | "amber" | "yellow"
  | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky";

export interface WidgetContainerProps {
  children: ReactNode;
  /** Color scheme for accent gradient */
  colorScheme?: WidgetColorScheme;
  /** Additional class names */
  className?: string;
  /** Whether the widget is being dragged */
  isDragging?: boolean;
  /** Whether the widget is a drag overlay */
  isOverlay?: boolean;
  /** Data attributes for drag-drop */
  "data-widget-id"?: string;
}

// ============================================================================
// Color scheme mappings
// ============================================================================

const colorGradients: Record<WidgetColorScheme, string> = {
  blue: "from-blue-500/5 via-transparent to-transparent dark:from-blue-400/10",
  indigo: "from-indigo-500/5 via-transparent to-transparent dark:from-indigo-400/10",
  violet: "from-violet-500/5 via-transparent to-transparent dark:from-violet-400/10",
  purple: "from-purple-500/5 via-transparent to-transparent dark:from-purple-400/10",
  pink: "from-pink-500/5 via-transparent to-transparent dark:from-pink-400/10",
  rose: "from-rose-500/5 via-transparent to-transparent dark:from-rose-400/10",
  red: "from-red-500/5 via-transparent to-transparent dark:from-red-400/10",
  orange: "from-orange-500/5 via-transparent to-transparent dark:from-orange-400/10",
  amber: "from-amber-500/5 via-transparent to-transparent dark:from-amber-400/10",
  yellow: "from-yellow-500/5 via-transparent to-transparent dark:from-yellow-400/10",
  lime: "from-lime-500/5 via-transparent to-transparent dark:from-lime-400/10",
  green: "from-green-500/5 via-transparent to-transparent dark:from-green-400/10",
  emerald: "from-emerald-500/5 via-transparent to-transparent dark:from-emerald-400/10",
  teal: "from-teal-500/5 via-transparent to-transparent dark:from-teal-400/10",
  cyan: "from-cyan-500/5 via-transparent to-transparent dark:from-cyan-400/10",
  sky: "from-sky-500/5 via-transparent to-transparent dark:from-sky-400/10",
};

// ============================================================================
// Component
// ============================================================================

export const WidgetContainer = forwardRef<HTMLDivElement, WidgetContainerProps>(
  function WidgetContainer(
    {
      children,
      colorScheme = "blue",
      className,
      isDragging,
      isOverlay,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative bg-surface",
          "rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10",
          "shadow-sm overflow-hidden flex flex-col",
          // Transitions
          "transition-all duration-300 ease-out",
          // Hover state (only when not dragging)
          !isDragging && !isOverlay && "hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600/50",
          // Dragging state
          isDragging && "opacity-50 scale-[0.98] shadow-none",
          // Overlay state (the floating copy while dragging)
          isOverlay && "shadow-2xl scale-[1.02] ring-2 ring-blue-500/30 dark:ring-blue-400/30",
          className
        )}
        {...props}
      >
        {/* Accent gradient background */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl pointer-events-none",
            colorGradients[colorScheme],
            "midnight:from-cyan-400/10 purple:from-pink-400/10"
          )}
        />

        {/* Content */}
        {children}
      </div>
    );
  }
);

export default WidgetContainer;
