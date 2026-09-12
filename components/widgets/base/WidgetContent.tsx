"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface WidgetContentProps {
  children: ReactNode;
  /** Remove padding */
  noPadding?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function WidgetContent({ children, noPadding, className }: WidgetContentProps) {
  return (
    <div
      className={cn(
        "relative flex-1 flex flex-col",
        !noPadding && "px-3 py-2.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default WidgetContent;
