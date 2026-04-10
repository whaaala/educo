"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";

// ── Types ──

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Custom icon color class (e.g. "text-blue-500") */
  iconColor?: string;
  /** Keyboard shortcut display text */
  shortcut?: string;
  /** Whether this item has a submenu arrow */
  hasSubmenu?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface ActionMenuDivider {
  type: "divider";
}

export type ActionMenuEntry = ActionMenuItem | ActionMenuDivider;

export interface ActionMenuDropdownProps {
  /** The trigger element — can be a ReactNode or a render function receiving isOpen */
  trigger: ReactNode | ((isOpen: boolean) => ReactNode);
  /** Menu items to display */
  items: ActionMenuEntry[];
  /** Alignment of dropdown relative to trigger */
  align?: "left" | "right";
  /** Additional class for the dropdown container */
  className?: string;
  /** Width of the dropdown menu */
  width?: string;
}

function isDivider(entry: ActionMenuEntry): entry is ActionMenuDivider {
  return "type" in entry && entry.type === "divider";
}

// ── Component ──

export default function ActionMenuDropdown({
  trigger,
  items,
  align = "left",
  className = "",
  width = "w-[240px]",
}: ActionMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {typeof trigger === "function" ? trigger(isOpen) : trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 ${align === "right" ? "right-0" : "left-0"} ${width} bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1.5 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          {items.map((entry, idx) => {
            if (isDivider(entry)) {
              return (
                <div
                  key={`divider-${idx}`}
                  className="my-1.5 h-px bg-gray-100 dark:bg-[#22262e] midnight:bg-cyan-500/10 purple:bg-pink-500/10 mx-2"
                />
              );
            }

            const item = entry as ActionMenuItem;
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer group"
              >
                {IconComp && (
                  <IconComp
                    className={`w-[18px] h-[18px] flex-shrink-0 ${
                      item.iconColor || "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                )}
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                    {item.shortcut}
                  </span>
                )}
                {item.hasSubmenu && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
