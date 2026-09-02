"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  FlipVertical2,
  Layers,
  RotateCcw as RotateMenuIcon,
  Copy,
  ClipboardPaste,
  Trash2,
  Group,
  Ungroup,
  ChevronDown as ChevronToggle,
  ImagePlus,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────

export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action?: () => void;
  children?: ContextMenuAction[];
  disabled?: boolean;
  danger?: boolean;
  dividerAfter?: boolean;
}

interface WhiteboardContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

// ─── Main Component (Portal) ────────────────────────────

export default function WhiteboardContextMenu({
  x,
  y,
  actions,
  onClose,
}: WhiteboardContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ x, y });
  const [mounted, setMounted] = useState(false);

  // Ensure we only create the portal after mount (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Adjust position to fit within viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let newX = x;
    let newY = y;
    if (x + rect.width > vw - 8) newX = vw - rect.width - 8;
    if (y + rect.height > vh - 8) newY = vh - rect.height - 8;
    if (newX < 8) newX = 8;
    if (newY < 8) newY = 8;
    if (newX !== adjustedPos.x || newY !== adjustedPos.y) {
      setAdjustedPos({ x: newX, y: newY });
    }
  }, [x, y]);

  // Close on escape or click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick, true);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick, true);
    };
  }, [onClose]);

  if (!mounted) return null;

  const menu = (
    <div
      ref={menuRef}
      className="fixed min-w-[220px] py-1 bg-surface border border-line rounded-xl shadow-2xl backdrop-blur-sm"
      style={{ left: adjustedPos.x, top: adjustedPos.y, zIndex: 99999 }}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {actions.map((action) => (
        <div key={action.id}>
          {action.children ? (
            <SubmenuItem action={action} onClose={onClose} />
          ) : (
            <MenuItem action={action} onClose={onClose} />
          )}
          {action.dividerAfter && (
            <div className="h-px mx-2 my-1 bg-gray-100 dark:bg-[#22262e] midnight:bg-cyan-500/10 purple:bg-pink-500/10" />
          )}
        </div>
      ))}
    </div>
  );

  return createPortal(menu, document.body);
}

// ─── Menu Item ───────────────────────────────────────────

function MenuItem({
  action,
  onClose,
}: {
  action: ContextMenuAction;
  onClose: () => void;
}) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (!action.disabled && action.action) {
          action.action();
          onClose();
        }
      }}
      disabled={action.disabled}
      className={`flex items-center gap-2.5 w-full px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer ${
        action.disabled
          ? "text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 cursor-not-allowed"
          : action.danger
          ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20"
          : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      }`}
    >
      {action.icon && (
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 opacity-70">
          {action.icon}
        </span>
      )}
      <span className="flex-1">{action.label}</span>
      {action.shortcut && (
        <span className="text-[11px] text-gray-400 dark:text-gray-500 midnight:text-cyan-500/40 purple:text-pink-500/40 ml-4 tabular-nums">
          {action.shortcut}
        </span>
      )}
    </button>
  );
}

// ─── Submenu Item (Inline Accordion) ─────────────────────

function SubmenuItem({
  action,
  onClose,
}: {
  action: ContextMenuAction;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Trigger button */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="flex items-center gap-2.5 w-full px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      >
        {action.icon && (
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 opacity-70">
            {action.icon}
          </span>
        )}
        <span className="flex-1">{action.label}</span>
        <ChevronToggle
          className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Inline expanded children */}
      {isOpen && (
        <div className="pl-3 border-l-2 border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 ml-5 my-0.5">
          {action.children!.map((child) => (
            <div key={child.id}>
              <MenuItem action={child} onClose={onClose} />
              {child.dividerAfter && (
                <div className="h-px mx-2 my-1 bg-gray-100 dark:bg-[#22262e] midnight:bg-cyan-500/10 purple:bg-pink-500/10" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Action builders (used by Whiteboard.tsx) ────────────

export function buildContextMenuActions({
  hasSelection,
  selectionCount,
  canGroup,
  canUngroup,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onRotateCW,
  onRotateCCW,
  onFlipH,
  onFlipV,
  onCopy,
  onPaste,
  onDuplicate,
  onGroup,
  onUngroup,
  onDelete,
  onInsertImage,
}: {
  hasSelection: boolean;
  selectionCount: number;
  canGroup: boolean;
  canUngroup: boolean;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDelete: () => void;
  onInsertImage: () => void;
}): ContextMenuAction[] {
  const actions: ContextMenuAction[] = [];

  if (hasSelection) {
    // Order submenu
    actions.push({
      id: "order",
      label: "Order",
      icon: <Layers className="w-4 h-4" />,
      children: [
        {
          id: "bring-to-front",
          label: "Bring to front",
          icon: <ChevronsUp className="w-4 h-4" />,
          shortcut: "Ctrl+Shift+\u2191",
          action: onBringToFront,
        },
        {
          id: "bring-forward",
          label: "Bring forward",
          icon: <ChevronUp className="w-4 h-4" />,
          shortcut: "Ctrl+\u2191",
          action: onBringForward,
        },
        {
          id: "send-backward",
          label: "Send backward",
          icon: <ChevronDown className="w-4 h-4" />,
          shortcut: "Ctrl+\u2193",
          action: onSendBackward,
        },
        {
          id: "send-to-back",
          label: "Send to back",
          icon: <ChevronsDown className="w-4 h-4" />,
          shortcut: "Ctrl+Shift+\u2193",
          action: onSendToBack,
        },
      ],
      dividerAfter: false,
    });

    // Rotate submenu
    actions.push({
      id: "rotate",
      label: "Rotate",
      icon: <RotateMenuIcon className="w-4 h-4" />,
      children: [
        {
          id: "rotate-cw",
          label: "Rotate clockwise 90\u00B0",
          icon: <RotateCw className="w-4 h-4" />,
          action: onRotateCW,
        },
        {
          id: "rotate-ccw",
          label: "Rotate anticlockwise 90\u00B0",
          icon: <RotateCcw className="w-4 h-4" />,
          action: onRotateCCW,
          dividerAfter: true,
        },
        {
          id: "flip-h",
          label: "Flip horizontally",
          icon: <FlipHorizontal2 className="w-4 h-4" />,
          action: onFlipH,
        },
        {
          id: "flip-v",
          label: "Flip vertically",
          icon: <FlipVertical2 className="w-4 h-4" />,
          action: onFlipV,
        },
      ],
      dividerAfter: true,
    });

    // Copy, Duplicate
    actions.push({
      id: "copy",
      label: "Copy",
      icon: <Copy className="w-4 h-4" />,
      shortcut: "Ctrl+C",
      action: onCopy,
    });
    actions.push({
      id: "duplicate",
      label: "Duplicate",
      icon: <Copy className="w-4 h-4" />,
      shortcut: "Ctrl+D",
      action: onDuplicate,
      dividerAfter: true,
    });

    // Group / Ungroup
    if (canGroup) {
      actions.push({
        id: "group",
        label: "Group",
        icon: <Group className="w-4 h-4" />,
        shortcut: "Ctrl+G",
        action: onGroup,
      });
    }
    if (canUngroup) {
      actions.push({
        id: "ungroup",
        label: "Ungroup",
        icon: <Ungroup className="w-4 h-4" />,
        shortcut: "Ctrl+Shift+G",
        action: onUngroup,
      });
    }
    if (canGroup || canUngroup) {
      actions[actions.length - 1].dividerAfter = true;
    }

    // Delete
    actions.push({
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      shortcut: "Del",
      action: onDelete,
      danger: true,
    });
  } else {
    // No selection — show paste + insert options
    actions.push({
      id: "paste",
      label: "Paste",
      icon: <ClipboardPaste className="w-4 h-4" />,
      shortcut: "Ctrl+V",
      action: onPaste,
      dividerAfter: true,
    });

    actions.push({
      id: "insert-image",
      label: "Insert image",
      icon: <ImagePlus className="w-4 h-4" />,
      action: onInsertImage,
    });
  }

  return actions;
}
