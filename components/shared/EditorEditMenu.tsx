"use client";

/**
 * Reusable Edit Menu — Data + Rendering
 *
 * `buildEditMenu(config)` generates the menu item data.
 * `<EditorEditMenuPanel>` renders it using ViewMenuItem style (glassmorphism, portalled).
 *
 * Both DocEditor and SlideEditor use the same component — just pass different config.
 */

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import {
  ViewMenuItem, ViewMenuDivider, SubmenuPanel, MenuCloseContext,
} from "@/components/shared/EditorViewMenus";
import {
  Undo2, Redo2, Scissors, Copy, ClipboardPaste, Clipboard,
  MousePointer2, Trash2, CopyPlus, Search,
} from "lucide-react";

// ══════════════════════════════════════════════════
// Content check helper
// ══════════════════════════════════════════════════

/** Check if any contenteditable element on the page has text content. */
export function checkEditorHasContent(): boolean {
  if (typeof window === "undefined") return false;
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return false;
  return (editor.textContent?.trim().length ?? 0) > 0;
}

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

export type EditMenuAction = (action: string, payload?: unknown) => void;

export interface EditMenuConfig {
  onAction: EditMenuAction;
  /** Whether user can edit (used to gate actions) — defaults to true */
  canEdit?: boolean;
  /** Whether the editor has content — disables Cut, Copy, Delete, Duplicate when false */
  hasContent?: boolean;
  /** Show "Duplicate" item — defaults to true */
  showDuplicate?: boolean;
  /** Custom Find and replace handler — if not provided, dispatches "edit:findReplace" */
  findReplaceAction?: () => void;
  /** Extra items appended after Find and replace */
  extraItems?: EditorMenuItem[];
}

// ══════════════════════════════════════════════════
// Individual Item Factories
// ══════════════════════════════════════════════════

export function undoItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Undo", icon: Undo2, shortcut: "Ctrl+Z", onClick: act("edit:undo") };
}

export function redoItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Redo", icon: Redo2, shortcut: "Ctrl+Y", onClick: act("edit:redo") };
}

export function cutItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Cut", icon: Scissors, shortcut: "Ctrl+X", onClick: act("edit:cut") };
}

export function copyItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Copy", icon: Copy, shortcut: "Ctrl+C", onClick: act("edit:copy") };
}

export function pasteItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Paste", icon: Clipboard, shortcut: "Ctrl+V", onClick: act("edit:paste") };
}

export function pasteWithoutFormattingItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Paste without formatting", icon: ClipboardPaste, shortcut: "Ctrl+Shift+V", onClick: act("edit:pasteNoFormat") };
}

export function selectAllItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Select all", icon: MousePointer2, shortcut: "Ctrl+A", onClick: act("edit:selectAll") };
}

export function deleteItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Delete", icon: Trash2, onClick: act("edit:delete") };
}

export function duplicateItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Duplicate", icon: CopyPlus, shortcut: "Ctrl+D", onClick: act("edit:duplicate") };
}

export function findAndReplaceItem(act: (a: string) => () => void, customAction?: () => void): EditorMenuItem {
  return { label: "Find and replace", icon: Search, shortcut: "Ctrl+H", onClick: customAction || act("edit:findReplace") };
}

// ══════════════════════════════════════════════════
// Full Edit Menu Builder
// ══════════════════════════════════════════════════

export function buildEditMenu(config: EditMenuConfig): EditorMenuItem[] {
  const { onAction, hasContent = true, showDuplicate = true, findReplaceAction, extraItems = [] } = config;
  const act = (action: string) => () => onAction(action);
  const noContent = !hasContent; // disabled when editor is empty

  const items: EditorMenuItem[] = [];

  // Section 1: Undo / Redo
  items.push(undoItem(act));
  items.push(redoItem(act));
  items.push(D);

  // Section 2: Clipboard — Cut/Copy disabled when editor is empty
  items.push({ ...cutItem(act), disabled: noContent });
  items.push({ ...copyItem(act), disabled: noContent });
  items.push(pasteItem(act));
  items.push(pasteWithoutFormattingItem(act));
  items.push(D);

  // Section 3: Selection / Delete / Duplicate — disabled when editor is empty
  items.push(selectAllItem(act));
  items.push({ ...deleteItem(act), disabled: noContent });
  if (showDuplicate) items.push({ ...duplicateItem(act), disabled: noContent });
  items.push(D);

  // Section 4: Find and replace
  items.push(findAndReplaceItem(act, findReplaceAction));

  // Extra items
  if (extraItems.length) {
    items.push(D);
    items.push(...extraItems);
  }

  return items;
}

// ══════════════════════════════════════════════════
// EditorEditMenuPanel — Rendering Component
// ══════════════════════════════════════════════════

export interface EditorEditMenuPanelProps {
  /** Edit menu config passed to buildEditMenu */
  config: EditMenuConfig;
  /** Close the menu */
  onClose: () => void;
  /** Ref to the trigger button for portal positioning */
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

/** Renders a single EditorMenuItem as ViewMenuItem, handling submenus recursively. */
function EditMenuItemRenderer({ item, openSub, setOpenSub }: {
  item: EditorMenuItem;
  openSub: string | null;
  setOpenSub: (id: string | null) => void;
}) {
  if (item.divider) return <ViewMenuDivider />;

  if (item.submenu) {
    return (
      <ViewMenuItem
        label={item.label}
        icon={item.icon}
        shortcut={item.shortcut}
        disabled={item.disabled}
        hasSubmenu
        isSubmenuOpen={openSub === item.label}
        onHover={() => setOpenSub(item.label)}
        onLeave={() => setOpenSub(null)}
        submenu={
          <SubmenuPanel className="w-[240px]">
            {item.submenu.map((sub, j) => {
              if (sub.divider) return <ViewMenuDivider key={j} />;
              return (
                <ViewMenuItem
                  key={j}
                  label={sub.label}
                  icon={sub.icon}
                  shortcut={sub.shortcut}
                  disabled={sub.disabled}
                  isChecked={sub.isChecked}
                  onClick={sub.onClick}
                />
              );
            })}
          </SubmenuPanel>
        }
      />
    );
  }

  return (
    <ViewMenuItem
      label={item.label}
      icon={item.icon}
      shortcut={item.shortcut}
      disabled={item.disabled}
      isChecked={item.isChecked}
      onClick={item.onClick}
    />
  );
}

/**
 * Self-contained Edit menu panel — used by both DocEditor and SlideEditor.
 * Renders using ViewMenuItem style (glassmorphism, min-h-44px).
 * Portals to document.body for proper z-index stacking in all contexts.
 */
export function EditorEditMenuPanel({ config, onClose, anchorRef }: EditorEditMenuPanelProps) {
  // Use explicitly provided hasContent, or auto-detect from DOM
  const resolvedConfig = {
    ...config,
    hasContent: config.hasContent ?? checkEditorHasContent(),
  };

  const items = buildEditMenu(resolvedConfig);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Position below the trigger button
  useEffect(() => {
    let btn = anchorRef?.current;
    if (!btn) {
      const roots = document.querySelectorAll("[data-doc-menu-root],[data-editor-menu-root]");
      roots.forEach(r => {
        const b = r.querySelector("button");
        if (b && b.textContent?.trim() === "Edit") btn = b as HTMLButtonElement;
      });
    }
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [anchorRef]);

  const glassClasses = [
    "bg-white/80 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80",
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    "border border-gray-300/60 dark:border-gray-600/50 midnight:border-cyan-400/20 purple:border-pink-400/20",
  ].join(" ");

  if (typeof document === "undefined") return null;

  const panelContent = (
    <MenuCloseContext.Provider value={onClose}>
      <div
        ref={panelRef}
        data-editor-menu-panel
        data-doc-menu-panel
        className={[
          "fixed z-[10000] w-[300px] rounded-2xl overflow-visible",
          glassClasses,
          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_12px_24px_-4px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.4)]",
        ].join(" ")}
        style={pos
          ? { top: pos.top, left: pos.left, maxHeight: `calc(100vh - ${pos.top + 24}px)` }
          : { top: 0, left: 0, visibility: "hidden" as const }
        }
      >
        <div className="py-1.5 pb-4 overflow-y-auto" style={{ maxHeight: "inherit" }}>
          {items.map((item, i) => (
            <EditMenuItemRenderer key={i} item={item} openSub={openSub} setOpenSub={setOpenSub} />
          ))}
        </div>
      </div>
    </MenuCloseContext.Provider>
  );

  return createPortal(panelContent, document.body);
}
