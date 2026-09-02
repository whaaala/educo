"use client";

import { X, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Whiteboard } from "@/components/shared/Whiteboard";
import type { WhiteboardState } from "@/components/shared/Whiteboard";
import { useSidebar } from "@/contexts/SidebarContext";

export interface WhiteboardPanelProps {
  primaryColor?: string;
  secondaryColor?: string;
  onClose: () => void;
  onChange?: (state: WhiteboardState) => void;
  className?: string;
}

export function WhiteboardPanel({
  primaryColor = "#2563eb",
  onClose,
  onChange,
  className = "",
}: WhiteboardPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 288;

  // Get document.body on mount for portal rendering
  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  // Close expanded mode on Escape key
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isExpanded]);

  const header = (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0f1a] purple:bg-[#1a0e2e] flex-shrink-0">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <h3 className="text-sm font-semibold text-ink">
          Whiteboard
        </h3>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          title={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          title="Close whiteboard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const whiteboard = (
    <div className="flex-1 min-h-0">
      <Whiteboard className="h-full rounded-none border-0" onChange={onChange} />
    </div>
  );

  // Expanded mode: render via portal to escape the main content's stacking context.
  // Position below the header (64px) and to the right of the sidebar, matching CallModal's pattern.
  if (isExpanded && portalRoot) {
    return createPortal(
      <div
        className="fixed top-[64px] bottom-0 right-0 left-0 lg:left-[var(--sidebar-width)] z-[9999] flex flex-col bg-white dark:bg-[#0f1115] midnight:bg-[#0a0f1a] purple:bg-[#120622]"
        style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
      >
        {header}
        {whiteboard}
      </div>,
      portalRoot
    );
  }

  // Normal mode: render inline
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {header}
      {whiteboard}
    </div>
  );
}
