"use client";

import { X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { Whiteboard } from "@/components/shared/Whiteboard";
import type { WhiteboardState } from "@/components/shared/Whiteboard";

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

  return (
    <div
      className={`flex flex-col h-full ${
        isExpanded ? "fixed inset-0 z-[60] bg-white dark:bg-gray-900 midnight:bg-[#0a0f1a] purple:bg-[#120622]" : ""
      } ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-gray-800/50 midnight:bg-[#0a0f1a] purple:bg-[#1a0e2e] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Whiteboard
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
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
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            title="Close whiteboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Whiteboard */}
      <div className="flex-1 min-h-0">
        <Whiteboard className="h-full rounded-none border-0" onChange={onChange} />
      </div>
    </div>
  );
}
