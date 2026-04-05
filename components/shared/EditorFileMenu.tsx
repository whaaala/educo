"use client";

/**
 * Reusable File Menu — Data + Rendering
 *
 * `buildFileMenu(config)` generates the menu item data.
 * `<EditorFileMenuPanel>` renders it using ViewMenuItem style (glassmorphism, mobile bottom sheet).
 *
 * Both DocEditor and SlideEditor use the same component — just pass different config.
 */

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import {
  ViewMenuItem, ViewMenuDivider, SubmenuPanel, MenuCloseContext,
} from "@/components/shared/EditorViewMenus";
import {
  FilePlus, FolderOpen, Upload, Copy, CopyPlus, Share2, ExternalLink,
  Mail, Download, Video, PencilLine, Move, Star, FolderSymlink, Trash2,
  History, Tag, Clock, Info, ShieldCheck, Globe, Settings, Eye, Printer,
} from "lucide-react";

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

export type FileMenuAction = (action: string, payload?: unknown) => void;

export interface NewMenuConfig {
  items: EditorMenuItem[];
}

export interface WorkspaceMenuConfig {
  newMenu?: NewMenuConfig;
  /** "Make a copy" — submenu items for presentations, or single direct item for docs */
  copyMenu?: EditorMenuItem[];
  /** Direct "Make a copy" click (no submenu) — used by DocEditor */
  makeCopyItem?: EditorMenuItem | null;
  showConvertToVideo?: boolean;
  /** Label: "Slide language", "Document language", "Language" */
  languageLabel?: string;
  importItem?: EditorMenuItem | null;
  showOpen?: boolean;
  showPageSetup?: boolean;
  /** Override version history submenu items */
  versionHistoryItems?: EditorMenuItem[];
  /** Override "Sharing permissions" label (e.g., "Security limitations") */
  permissionsLabel?: string;
  extraItems?: EditorMenuItem[];
}

export interface FileMenuConfig {
  onAction: FileMenuAction;
  isStarred?: boolean;
  currentFolder?: string;
  workspace?: WorkspaceMenuConfig;
}

// ══════════════════════════════════════════════════
// Individual Item Factories
// ══════════════════════════════════════════════════

export function newMenuItems(act: (a: string) => () => void, config?: NewMenuConfig): EditorMenuItem {
  if (config?.items?.length) {
    return { label: "New", icon: FilePlus, submenu: config.items };
  }
  return { label: "New", icon: FilePlus, onClick: act("file:new") };
}

export function openItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Open", icon: FolderOpen, shortcut: "Ctrl+O", onClick: act("file:open") };
}

export function shareMenuItems(act: (a: string) => () => void): EditorMenuItem {
  return {
    label: "Share", icon: Share2, submenu: [
      { label: "Share with others", icon: Share2, onClick: act("file:share") },
      { label: "Publish", icon: ExternalLink, onClick: act("file:publish") },
    ],
  };
}

export function emailMenuItems(act: (a: string) => () => void): EditorMenuItem {
  return {
    label: "Email", icon: Mail, submenu: [
      { label: "Email this file", icon: Mail, onClick: act("file:emailFile") },
      { label: "Email collaborators", icon: Mail, onClick: act("file:emailCollaborators") },
    ],
  };
}

export function downloadItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Download", icon: Download, onClick: act("file:download") };
}

export function convertToVideoItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Convert to video", icon: Video, onClick: act("file:convertVideo") };
}

export function renameItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Rename", icon: PencilLine, onClick: act("file:rename") };
}

export function moveItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Move", icon: Move, onClick: act("file:move") };
}

export function starItem(act: (a: string) => () => void, isStarred: boolean): EditorMenuItem {
  return {
    label: isStarred ? "Remove from starred" : "Add to starred",
    icon: Star,
    onClick: act("file:star"),
  };
}

export function locationItem(act: (a: string) => () => void, currentFolder: string): EditorMenuItem {
  return { label: `Location: ${currentFolder}`, icon: FolderSymlink, onClick: act("file:addToFolder") };
}

export function moveToBinItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Move to bin", icon: Trash2, onClick: act("file:delete") };
}

export function versionHistoryMenuItems(act: (a: string) => () => void, customItems?: EditorMenuItem[]): EditorMenuItem {
  return {
    label: "Version history", icon: History, submenu: customItems || [
      { label: "Name current version", icon: Tag, onClick: act("file:versionName") },
      { label: "See version history", icon: Clock, shortcut: "Ctrl+Alt+Shift+H", onClick: act("file:versionHistory") },
    ],
  };
}

export function detailsItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Details", icon: Info, onClick: act("file:details") };
}

export function sharingPermissionsItem(act: (a: string) => () => void, label = "Sharing permissions"): EditorMenuItem {
  return { label, icon: ShieldCheck, onClick: act("file:security") };
}

export function languageItem(act: (a: string) => () => void, label = "Language"): EditorMenuItem {
  return { label, icon: Globe, onClick: act("file:language") };
}

export function pageSetupItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Page setup", icon: Settings, onClick: act("file:pageSetup") };
}

export function printPreviewItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Print preview", icon: Eye, onClick: act("file:printPreview") };
}

export function printItem(act: (a: string) => () => void): EditorMenuItem {
  return { label: "Print", icon: Printer, shortcut: "Ctrl+P", onClick: act("file:print") };
}

// ══════════════════════════════════════════════════
// Group Factories
// ══════════════════════════════════════════════════

export function fileManagementItems(
  act: (a: string) => () => void,
  options: { isStarred: boolean; currentFolder: string },
): EditorMenuItem[] {
  return [
    renameItem(act),
    moveItem(act),
    starItem(act, options.isStarred),
    locationItem(act, options.currentFolder),
    moveToBinItem(act),
  ];
}

export function infoItems(
  act: (a: string) => () => void,
  options: { languageLabel?: string; showPageSetup?: boolean; permissionsLabel?: string },
): EditorMenuItem[] {
  const items: EditorMenuItem[] = [
    detailsItem(act),
    sharingPermissionsItem(act, options.permissionsLabel),
  ];
  if (options.languageLabel) {
    items.push(languageItem(act, options.languageLabel));
  }
  if (options.showPageSetup !== false) {
    items.push(pageSetupItem(act));
  }
  return items;
}

export function printItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    printPreviewItem(act),
    printItem(act),
  ];
}

// ══════════════════════════════════════════════════
// Full File Menu Builder
// ══════════════════════════════════════════════════

export function buildFileMenu(config: FileMenuConfig): EditorMenuItem[] {
  const { onAction, isStarred = false, currentFolder = "My Drive", workspace = {} } = config;
  const act = (action: string) => () => onAction(action);

  const {
    newMenu,
    copyMenu,
    makeCopyItem,
    showConvertToVideo = false,
    languageLabel,
    importItem: importMenuItem = null,
    showOpen = true,
    showPageSetup = true,
    versionHistoryItems,
    permissionsLabel,
    extraItems = [],
  } = workspace;

  const items: EditorMenuItem[] = [];

  // Section 1: New / Open / Import
  items.push(newMenuItems(act, newMenu));
  if (showOpen) items.push(openItem(act));
  if (importMenuItem) items.push(importMenuItem);
  items.push(D);

  // Section 2: Copy / Share / Email
  if (makeCopyItem) {
    items.push(makeCopyItem);
  } else if (copyMenu?.length) {
    items.push({ label: "Make a copy", icon: Copy, submenu: copyMenu });
  }
  items.push(shareMenuItems(act));
  items.push(emailMenuItems(act));
  items.push(D);

  // Section 3: Download / Convert
  items.push(downloadItem(act));
  if (showConvertToVideo) items.push(convertToVideoItem(act));
  items.push(D);

  // Section 4: File management
  items.push(...fileManagementItems(act, { isStarred, currentFolder }));
  items.push(D);

  // Section 5: Version history
  items.push(versionHistoryMenuItems(act, versionHistoryItems));
  items.push(D);

  // Section 6: Info
  items.push(...infoItems(act, { languageLabel, showPageSetup, permissionsLabel }));

  // Extra items
  if (extraItems.length) {
    items.push(D);
    items.push(...extraItems);
  }

  items.push(D);

  // Section 7: Print
  items.push(...printItems(act));

  return items;
}

// ══════════════════════════════════════════════════
// EditorFileMenuPanel — Rendering Component
// ══════════════════════════════════════════════════

export interface EditorFileMenuPanelProps {
  /** File menu config passed to buildFileMenu */
  config: FileMenuConfig;
  /** Close the menu */
  onClose: () => void;
  /** Ref to the trigger button for portal positioning */
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

/** Renders a single EditorMenuItem as ViewMenuItem, handling submenus recursively. */
function FileMenuItemRenderer({ item, openSub, setOpenSub }: {
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
 * Self-contained File menu panel — used by both DocEditor and SlideEditor.
 * Renders using ViewMenuItem style (glassmorphism, min-h-44px, mobile bottom sheet).
 * Portals to document.body for proper z-index stacking in all contexts.
 */
export function EditorFileMenuPanel({ config, onClose, anchorRef }: EditorFileMenuPanelProps) {
  const items = buildFileMenu(config);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Position below the trigger button
  useEffect(() => {
    // Try anchorRef first, then find the File button via DOM query
    let btn = anchorRef?.current;
    if (!btn) {
      const roots = document.querySelectorAll("[data-doc-menu-root],[data-editor-menu-root]");
      roots.forEach(r => {
        const b = r.querySelector("button");
        if (b && b.textContent?.trim() === "File") btn = b as HTMLButtonElement;
      });
    }
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [anchorRef]);

  const glassClasses = [
    "bg-white/80 dark:bg-[#121212]/80 midnight:bg-[#0b1220]/80 purple:bg-[#1a0d2e]/80",
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
            <FileMenuItemRenderer key={i} item={item} openSub={openSub} setOpenSub={setOpenSub} />
          ))}
        </div>
      </div>
    </MenuCloseContext.Provider>
  );

  return createPortal(panelContent, document.body);
}
