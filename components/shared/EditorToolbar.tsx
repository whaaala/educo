"use client";

import React, { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

/**
 * Shared toolbar components for document and slide editors.
 * Extracted from DocEditor for reuse across editor types.
 */

// --- ToolbarButton ---

export interface ToolbarButtonProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export function ToolbarButton({
  Icon,
  title,
  onClick,
  disabled,
  active,
  className,
}: ToolbarButtonProps) {
  return (
    <Tooltip content={title} delay={400}>
      <button
        type="button"
        onMouseDown={(e) => {
          if (!disabled) e.preventDefault();
        }}
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
        className={`w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${active ? "bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-400" : ""} ${className ?? ""}`}
      >
        <Icon
          className={`w-4 h-4 ${
            active
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"
          }`}
        />
      </button>
    </Tooltip>
  );
}

// --- ToolbarDivider ---

export function ToolbarDivider() {
  return (
    <div className="w-px h-5 bg-gray-300 dark:bg-[#2a2d35] midnight:bg-cyan-500/15 purple:bg-pink-500/15 mx-0.5" />
  );
}

// --- ToolbarDropdown ---

export interface ToolbarDropdownProps {
  label?: string;
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  width?: string;
  align?: "left" | "right";
  /** Optional guard that prevents closing the dropdown while a native picker (e.g. color) is active. */
  isPickerOpen?: () => boolean;
}

export function ToolbarDropdown({
  label,
  title,
  Icon,
  isOpen,
  onToggle,
  disabled,
  children,
  width = "w-[200px]",
  align = "left",
  isPickerOpen,
}: ToolbarDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (isPickerOpen?.()) return;
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle, isPickerOpen]);

  return (
    <div ref={ref} className="relative">
      <Tooltip content={title} delay={400}>
        <button
          type="button"
          onMouseDown={(e) => {
            if (!disabled) e.preventDefault();
          }}
          onClick={onToggle}
          disabled={disabled}
          aria-label={title}
          className="h-7 inline-flex items-center gap-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label && <span className="truncate max-w-[80px]">{label}</span>}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </Tooltip>
      {isOpen && (
        <div
          className={`absolute z-[120] top-full mt-1 ${
            align === "right" ? "right-0" : "left-0"
          } ${width} rounded-xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/95 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30 max-h-[80vh] overflow-y-auto overflow-x-hidden`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
