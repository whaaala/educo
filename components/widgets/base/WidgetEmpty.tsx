"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface WidgetEmptyProps {
  /** Icon to display */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action element (button/link) */
  action?: ReactNode;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function WidgetEmpty({
  icon,
  title,
  description,
  action,
  className,
}: WidgetEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "p-3 rounded-xl mb-3",
          "bg-gray-100/80 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50"
        )}
      >
        <div className="text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h4
        className={cn(
          "text-sm font-semibold mb-1",
          "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300"
        )}
      >
        {title}
      </h4>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-xs max-w-[200px]",
            "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
          )}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default WidgetEmpty;
