"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, MoreHorizontal, ChevronDown, type LucideIcon } from "lucide-react";
import type { ActionConfig } from "@/types/components";

export interface ActionsDropdownProps<T> {
  /** The item to perform actions on */
  item: T;
  /** Action configurations */
  actions: ActionConfig<T>[];
  /** Trigger button variant */
  variant?: "icon" | "icon-horizontal" | "button";
  /** Button label (for button variant) */
  buttonLabel?: string;
  /** Custom trigger element */
  customTrigger?: React.ReactNode;
  /** Position preference */
  preferredPosition?: "top" | "bottom" | "auto";
  /** Alignment */
  align?: "left" | "right";
  /** Menu width */
  menuWidth?: "auto" | "sm" | "md" | "lg";
  /** Portal the menu to body */
  usePortal?: boolean;
  /** Additional className for trigger */
  triggerClassName?: string;
  /** Additional className for menu */
  menuClassName?: string;
  /** Callback when menu opens/closes */
  onOpenChange?: (open: boolean) => void;
}

// Menu width classes
const menuWidths = {
  auto: "min-w-[160px]",
  sm: "w-40",
  md: "w-48",
  lg: "w-56",
};

/**
 * Generic actions dropdown component for row/item actions
 * Supports multiple trigger variants and portal rendering
 * Fully responsive and accessible
 *
 * @example
 * ```tsx
 * <ActionsDropdown
 *   item={feeRecord}
 *   actions={[
 *     { id: "view", label: "View Details", icon: Eye, onClick: handleView },
 *     { id: "edit", label: "Edit", icon: Edit, onClick: handleEdit },
 *     { id: "delete", label: "Delete", icon: Trash2, onClick: handleDelete, variant: "danger" },
 *   ]}
 * />
 * ```
 */
export default function ActionsDropdown<T>({
  item,
  actions,
  variant = "icon",
  buttonLabel = "Actions",
  customTrigger,
  preferredPosition = "auto",
  align = "right",
  menuWidth = "auto",
  usePortal = false,
  triggerClassName = "",
  menuClassName = "",
  onOpenChange,
}: ActionsDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter visible actions
  const visibleActions = actions.filter((action) =>
    action.condition ? action.condition(item) : true
  );

  // Calculate position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const menuHeight = 250; // Approximate
    const menuWidthPx = 180; // Approximate

    // Vertical position
    let pos: "top" | "bottom" = "bottom";
    if (preferredPosition === "auto") {
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      pos = spaceBelow < menuHeight && spaceAbove > spaceBelow ? "top" : "bottom";
    } else {
      pos = preferredPosition;
    }

    // Coordinates for portal
    let top = pos === "bottom" ? rect.bottom + 4 : rect.top - menuHeight - 4;
    let left = align === "right" ? rect.right - menuWidthPx : rect.left;

    // Ensure menu stays within viewport
    if (left + menuWidthPx > windowWidth) {
      left = windowWidth - menuWidthPx - 8;
    }
    if (left < 8) {
      left = 8;
    }

    setPosition(pos);
    setMenuCoords({ top, left });
  }, [preferredPosition, align]);

  // Handle open
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpen = !isOpen;
    if (newOpen) {
      calculatePosition();
    }
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onOpenChange]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen || !usePortal) return;

    const handleUpdate = () => calculatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen, usePortal, calculatePosition]);

  if (visibleActions.length === 0) return null;

  // Render trigger button
  const renderTrigger = () => {
    if (customTrigger) {
      return (
        <button
          ref={triggerRef}
          onClick={handleToggle}
          className={`cursor-pointer ${triggerClassName}`}
        >
          {customTrigger}
        </button>
      );
    }

    if (variant === "button") {
      return (
        <button
          ref={triggerRef}
          onClick={handleToggle}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30
            hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer
            ${triggerClassName}
          `}
        >
          {buttonLabel}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      );
    }

    const IconComponent = variant === "icon-horizontal" ? MoreHorizontal : MoreVertical;

    return (
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`
          p-2 rounded-lg transition-colors cursor-pointer
          ${isOpen ? "bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}
          ${triggerClassName}
        `}
      >
        <IconComponent className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
      </button>
    );
  };

  // Render menu content
  const menuContent = (
    <div
      ref={menuRef}
      className={`
        ${menuWidths[menuWidth]}
        bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]
        rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
        midnight:border-cyan-700/30 purple:border-pink-700/30
        py-1 animate-in zoom-in-95 duration-150
        ${menuClassName}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {visibleActions.map((action, index) => {
        const Icon = action.icon;
        const isDanger = action.variant === "danger";
        const isWarning = action.variant === "warning";
        const isSuccess = action.variant === "success";

        return (
          <div key={action.id}>
            {action.dividerBefore && index > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 my-1" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
                setIsOpen(false);
                onOpenChange?.(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                transition-colors cursor-pointer
                ${
                  isDanger
                    ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20"
                    : isWarning
                    ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    : isSuccess
                    ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10/50"
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      {renderTrigger()}

      {isOpen && (
        <>
          {usePortal ? (
            createPortal(
              <div
                className="fixed z-[9999]"
                style={{ top: menuCoords.top, left: menuCoords.left }}
              >
                {menuContent}
              </div>,
              document.body
            )
          ) : (
            <div
              className={`
                absolute z-50
                ${align === "right" ? "right-0" : "left-0"}
                ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}
              `}
            >
              {menuContent}
            </div>
          )}
        </>
      )}
    </div>
  );
}
