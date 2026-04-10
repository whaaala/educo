"use client";

/**
 * Reusable Insert Menu — Data + Rendering
 *
 * `<EditorInsertMenuPanel>` renders insert items using ViewMenuItem style.
 * Both DocEditor and SlideEditor pass different config for context-specific items.
 */

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import {
  ViewMenuItem, ViewMenuDivider, SubmenuPanel, MenuCloseContext,
} from "@/components/shared/EditorViewMenus";
import {
  Image as ImageIcon, Upload, Search, HardDrive, Camera, Link2,
  Table2, Shapes, Type, Sparkles, Minus, MessageCircle, PlusSquare,
  GitBranch, BarChart3, PenLine, LayoutTemplate, Bookmark, Sigma,
  ArrowRight, CircleDot, Hexagon, Square,
} from "lucide-react";

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

export type InsertAction = (action: string, payload?: unknown) => void;

export interface InsertMenuSection {
  items: EditorMenuItem[];
}

export interface InsertMenuConfig {
  onAction: InsertAction;
  /** Image submenu items — pass null to hide Image entirely */
  imageItems?: EditorMenuItem[] | null;
  /** Table handler — true for default, or custom onClick */
  showTable?: boolean;
  tableAction?: () => void;
  /** Custom table picker (e.g. DocEditor's grid picker) */
  tableContent?: React.ReactNode;
  /** Shape submenu — slide-only */
  shapeItems?: EditorMenuItem[];
  /** Diagram submenu — slide-only */
  diagramItems?: EditorMenuItem[];
  /** Chart submenu */
  chartItems?: EditorMenuItem[];
  /** Line/connector submenu — slide-only */
  lineItems?: EditorMenuItem[];
  /** Show text box insert */
  showTextBox?: boolean;
  /** Show word art */
  showWordArt?: boolean;
  /** Show link insert */
  showLink?: boolean;
  linkAction?: () => void;
  /** Drawing items — doc-only */
  drawingItems?: EditorMenuItem[];
  /** Building blocks / Templates — doc-only */
  templateItems?: EditorMenuItem[];
  /** Smart chips — doc-only */
  chipItems?: EditorMenuItem[];
  /** Symbols (emoji, special chars, equation) — doc-only */
  symbolItems?: EditorMenuItem[];
  /** Show horizontal line — doc-only */
  showHorizontalLine?: boolean;
  /** Break submenu (page, column, section) — doc-only */
  breakItems?: EditorMenuItem[];
  /** Bookmark — doc-only */
  showBookmark?: boolean;
  /** Page elements (TOC, header, footer, watermark) — doc-only */
  pageElementItems?: EditorMenuItem[];
  /** Comment */
  showComment?: boolean;
  /** New slide — slide-only */
  showNewSlide?: boolean;
  /** Extra items at the end */
  extraItems?: EditorMenuItem[];
}

// ══════════════════════════════════════════════════
// Default image submenu builder
// ══════════════════════════════════════════════════

export function defaultImageItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    { label: "Upload from computer", icon: Upload, onClick: act("insert:imageUpload") },
    { label: "Search the web", icon: Search, onClick: act("insert:imageWeb") },
    { label: "Drive", icon: HardDrive, onClick: act("insert:imageDrive") },
    { label: "Camera", icon: Camera, onClick: act("insert:imageCamera") },
    { label: "By URL", icon: Link2, onClick: act("insert:imageUrl") },
  ];
}

export function defaultShapeItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    { label: "Shapes", icon: Square, onClick: act("insert:shapeBasic") },
    { label: "Arrows", icon: ArrowRight, onClick: act("insert:shapeArrow") },
    { label: "Callouts", icon: MessageCircle, onClick: act("insert:shapeCallout") },
    { label: "Equation", icon: Sparkles, onClick: act("insert:shapeEquation") },
  ];
}

export function defaultDiagramItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    { label: "Grid", icon: Shapes, onClick: act("insert:diagramGrid") },
    { label: "Hierarchy", icon: GitBranch, onClick: act("insert:diagramHierarchy") },
    { label: "Timeline", icon: Minus, onClick: act("insert:diagramTimeline") },
    { label: "Process", icon: ArrowRight, onClick: act("insert:diagramProcess") },
    { label: "Relationship", icon: Link2, onClick: act("insert:diagramRelationship") },
    { label: "Cycle", icon: CircleDot, onClick: act("insert:diagramCycle") },
  ];
}

export function defaultChartItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    { label: "Bar", icon: BarChart3, onClick: act("insert:chartBar") },
    { label: "Column", icon: BarChart3, onClick: act("insert:chartColumn") },
    { label: "Line", icon: Minus, onClick: act("insert:chartLine") },
    { label: "Pie", icon: CircleDot, onClick: act("insert:chartPie") },
  ];
}

export function defaultLineItems(act: (a: string) => () => void): EditorMenuItem[] {
  return [
    { label: "Line", icon: Minus, onClick: act("insert:line") },
    { label: "Arrow", icon: ArrowRight, onClick: act("insert:arrow") },
    { label: "Elbow connector", icon: PenLine, onClick: act("insert:elbowConnector") },
    { label: "Curved connector", icon: PenLine, onClick: act("insert:curvedConnector") },
    { label: "Curve", icon: PenLine, onClick: act("insert:curve") },
    { label: "Polyline", icon: Hexagon, onClick: act("insert:polyline") },
    { label: "Scribble", icon: PenLine, onClick: act("insert:scribble") },
  ];
}

// ══════════════════════════════════════════════════
// Build the full menu item list from config
// ══════════════════════════════════════════════════

export function buildInsertMenu(config: InsertMenuConfig): EditorMenuItem[] {
  const { onAction } = config;
  const act = (action: string) => () => onAction(action);
  const items: EditorMenuItem[] = [];

  // Image
  if (config.imageItems !== null) {
    const imgItems = config.imageItems || defaultImageItems(act);
    items.push({ label: "Image", icon: ImageIcon, submenu: imgItems });
  }

  // Shape (slide-only)
  if (config.shapeItems) {
    items.push({ label: "Shape", icon: Shapes, submenu: config.shapeItems });
  }

  // Table
  if (config.showTable !== false) {
    items.push({ label: "Table", icon: Table2, onClick: config.tableAction || act("insert:table") });
  }

  // Diagram (slide-only)
  if (config.diagramItems) {
    items.push({ label: "Diagram", icon: GitBranch, submenu: config.diagramItems });
  }

  // Chart
  if (config.chartItems) {
    items.push({ label: "Chart", icon: BarChart3, submenu: config.chartItems });
  }

  items.push(D);

  // Text box (slide-only)
  if (config.showTextBox) {
    items.push({ label: "Text box", icon: Type, onClick: act("insert:textBox") });
  }

  // Word art (slide-only)
  if (config.showWordArt) {
    items.push({ label: "Word art", icon: Sparkles, onClick: act("insert:wordArt") });
  }

  // Line (slide-only)
  if (config.lineItems) {
    items.push({ label: "Line", icon: Minus, submenu: config.lineItems });
  }

  // Drawing (doc-only)
  if (config.drawingItems) {
    items.push({ label: "Drawing", icon: PenLine, submenu: config.drawingItems });
  }

  // Templates / Building blocks (doc-only)
  if (config.templateItems) {
    items.push({ label: "Building blocks", icon: LayoutTemplate, submenu: config.templateItems });
  }

  // Smart chips (doc-only)
  if (config.chipItems) {
    items.push({ label: "Smart chips", submenu: config.chipItems });
  }

  // Link
  if (config.showLink) {
    items.push({ label: "Link", icon: Link2, shortcut: "Ctrl+K", onClick: config.linkAction || act("insert:link") });
  }

  // Symbols (doc-only)
  if (config.symbolItems) {
    items.push({ label: "Symbols", icon: Sigma, submenu: config.symbolItems });
  }

  items.push(D);

  // Horizontal line (doc-only)
  if (config.showHorizontalLine) {
    items.push({ label: "Horizontal line", onClick: act("insert:horizontalLine") });
  }

  // Break (doc-only)
  if (config.breakItems) {
    items.push({ label: "Break", submenu: config.breakItems });
  }

  // Bookmark (doc-only)
  if (config.showBookmark) {
    items.push({ label: "Bookmark", icon: Bookmark, onClick: act("insert:bookmark") });
  }

  // Page elements (doc-only)
  if (config.pageElementItems) {
    items.push({ label: "Page elements", submenu: config.pageElementItems });
  }

  // Comment
  if (config.showComment !== false) {
    items.push({ label: "Comment", icon: MessageCircle, shortcut: "Ctrl+Alt+M", onClick: act("insert:comment") });
  }

  // New slide (slide-only)
  if (config.showNewSlide) {
    items.push({ label: "New slide", icon: PlusSquare, shortcut: "Ctrl+M", onClick: act("insert:newSlide") });
  }

  // Extra items
  if (config.extraItems?.length) {
    items.push(D);
    items.push(...config.extraItems);
  }

  // Clean up: remove leading/trailing/double dividers
  return items.filter((item, i, arr) => {
    if (!item.divider) return true;
    if (i === 0 || i === arr.length - 1) return false;
    if (arr[i - 1]?.divider) return false;
    return true;
  });
}

// ══════════════════════════════════════════════════
// EditorInsertMenuPanel — Rendering Component
// ══════════════════════════════════════════════════

export interface EditorInsertMenuPanelProps {
  config: InsertMenuConfig;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

/** Renders an EditorMenuItem, handling submenus recursively. */
function InsertMenuItemRenderer({ item, openSub, setOpenSub }: {
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
              if (sub.submenu) {
                return (
                  <InsertMenuItemRenderer key={j} item={sub} openSub={openSub} setOpenSub={setOpenSub} />
                );
              }
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
 * Self-contained Insert menu panel — used by both DocEditor and SlideEditor.
 * Portals to document.body for proper z-index stacking.
 */
export function EditorInsertMenuPanel({ config, onClose, anchorRef }: EditorInsertMenuPanelProps) {
  const items = buildInsertMenu(config);
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
        if (b && b.textContent?.trim() === "Insert") btn = b as HTMLButtonElement;
      });
    }
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [anchorRef]);

  const glassClasses = [
    "bg-white/80 dark:bg-[#121212]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0d2e]/80",
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    "border border-gray-300/60 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30/50 midnight:border-cyan-400/20 purple:border-pink-400/20",
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
            <InsertMenuItemRenderer key={i} item={item} openSub={openSub} setOpenSub={setOpenSub} />
          ))}
        </div>
      </div>
    </MenuCloseContext.Provider>
  );

  return createPortal(panelContent, document.body);
}
