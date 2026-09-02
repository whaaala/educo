"use client";

/**
 * SlideCanvas — Canvas-based slide editor with draggable, resizable objects.
 * Supports: TextBox, Image, Shape, Drawing objects.
 * Snap-to-grid and snap-to-guides when dragging.
 */

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { SlideObject, TextBoxObject, ImageObject, ShapeObject, DrawingObject, TableObject, TableCell, MediaObject } from "@/lib/slide-storage";
import { SHAPE_DEFS } from "./shapes";
import { ColorGrid, TabbedColorPalette, ColorPickerPopover, isNativeColorPickerOpen, SOLID_COLORS, GRADIENT_COLORS, GLOSSY_COLORS, BORDER_COLORS, TEXT_COLORS, colorToCSS } from "@/components/shared/ColorPalettePicker";
import CustomDropdown from "@/components/shared/CustomDropdown";
import TextFormatToolbar from "@/components/shared/TextFormatToolbar";
import SlideChart, { SlideChartEditor } from "./SlideChart";
import { Link2 as LinkIcon, ImagePlus } from "lucide-react";
import { linkDisplayLabel } from "@/lib/link-utils";
import { setSlideClipboard, getSlideClipboard, hasSlideClipboard, packIntoFreeSpace, fitRotatedToPage } from "./slide-clipboard";
import { insertRow, insertCol, deleteRow, deleteCol, distributeRows, distributeCols } from "./table-ops";
import Tooltip from "@/components/shared/Tooltip";
import TableStylePanel from "@/components/shared/TableStylePanel";

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

interface SlideCanvasProps {
  objects: SlideObject[];
  onChange: (objects: SlideObject[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** The full selection set (single OR multi), lifted up so the host's Arrange menu can act on it. */
  onSelectionChange?: (ids: string[]) => void;
  background: string;
  themeTextColor?: string;
  themeAccent?: string;
  canEdit: boolean;
  showGuides?: boolean;
  guides?: { id: string; orientation: "h" | "v"; position: number }[];
  snapToGrid?: boolean;
  snapToGuides?: boolean;
  onGuideMove?: (id: string, position: number) => void;
  onGuideDelete?: (id: string) => void;
  drawingMode?: boolean;
  drawingColor?: string;
  drawingWidth?: number;
  onDrawingComplete?: (paths: string) => void;
  /** Open the comment sidebar anchored to an object (right-click → Add comment). */
  onAddComment?: (objId: string) => void;
  /** Activate an object's link (open URL / jump to slide). Provided by the host editor. */
  onActivateLink?: (href: string) => void;
}

// ══════════════════════════════════════════════════
// Snap helper
// ══════════════════════════════════════════════════

function snapValue(val: number, targets: number[], threshold = 1.5): number {
  for (const t of targets) {
    if (Math.abs(val - t) < threshold) return t;
  }
  return val;
}

function getSnapTargets(snapToGrid: boolean, snapToGuides: boolean, guides: { orientation: "h" | "v"; position: number }[], axis: "x" | "y"): number[] {
  const targets: number[] = [];
  if (snapToGrid) {
    for (let i = 0; i <= 100; i += 5) targets.push(i);
  }
  if (snapToGuides) {
    guides.filter(g => (axis === "x" ? g.orientation === "v" : g.orientation === "h"))
      .forEach(g => targets.push(g.position));
  }
  // Always snap to center and edges
  targets.push(0, 50, 100);
  return [...new Set(targets)];
}

// ══════════════════════════════════════════════════
// Shape SVG renderer
// ══════════════════════════════════════════════════

// Memoized so it does NOT re-render (and re-inject its dangerouslySetInnerHTML)
// on unrelated parent re-renders such as selection changes. Re-injecting the
// innerHTML remounts the inner shape node between mousedown/mouseup, which makes
// the browser swallow click/dblclick events — breaking double-click-to-edit.
const ShapeSVG = React.memo(function ShapeSVG({ shape, fill, stroke, strokeWidth, text, textColor, textSize }: {
  shape: string; fill: string; stroke: string; strokeWidth: number;
  text?: string; textColor?: string; textSize?: number;
}) {
  const def = SHAPE_DEFS[shape];
  if (!def) {
    return <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth} /></svg>;
  }
  // Apply fill and stroke directly to shape elements
  const hasStroke = stroke && stroke !== "transparent" && strokeWidth > 0;
  let svgContent = def.svg
    .replace(/fill="currentColor"/g, `fill="${fill}"`)
    // Line/stroke-drawn shapes (line-h, line-v, line-diag, cylinder edges, …) use currentColor as
    // their MAIN colour — map it to the shape's fill so they actually render. (Previously this was
    // set to "none" unless an outline was configured, which made the Line shape invisible.)
    .replace(/stroke="currentColor"/g, `stroke="${fill}"`);
  // Also add stroke to elements that only have fill (no existing stroke attr)
  if (hasStroke) {
    svgContent = svgContent
      .replace(/<(rect|circle|ellipse|polygon|path)([^>]*?)(?<!\bstroke=)(\s*\/?>)/g,
        (m, tag, attrs, close) => attrs.includes("stroke=") ? m : `<${tag}${attrs} stroke="${stroke}" stroke-width="${strokeWidth}"${close}`);
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      {text && <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fill={textColor || "#fff"} fontSize={textSize || 14} fontWeight="600">{text}</text>}
    </svg>
  );
});

// ══════════════════════════════════════════════════
// Resize handles
// ══════════════════════════════════════════════════

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type HandleDir = typeof HANDLES[number];

const HANDLE_CURSORS: Record<HandleDir, string> = {
  nw: "nw-resize", n: "n-resize", ne: "ne-resize", e: "e-resize",
  se: "se-resize", s: "s-resize", sw: "sw-resize", w: "w-resize",
};

function getHandlePosition(dir: HandleDir): React.CSSProperties {
  const m = -5;
  const s = 10;
  const base: React.CSSProperties = { position: "absolute", width: s, height: s, background: "#fff", border: "2px solid #3b82f6", borderRadius: 2, zIndex: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" };
  switch (dir) {
    case "nw": return { ...base, top: m, left: m, cursor: "nw-resize" };
    case "n":  return { ...base, top: m, left: "50%", marginLeft: -s/2, cursor: "n-resize" };
    case "ne": return { ...base, top: m, right: m, cursor: "ne-resize" };
    case "e":  return { ...base, top: "50%", right: m, marginTop: -s/2, cursor: "e-resize" };
    case "se": return { ...base, bottom: m, right: m, cursor: "se-resize" };
    case "s":  return { ...base, bottom: m, left: "50%", marginLeft: -s/2, cursor: "s-resize" };
    case "sw": return { ...base, bottom: m, left: m, cursor: "sw-resize" };
    case "w":  return { ...base, top: "50%", left: m, marginTop: -s/2, cursor: "w-resize" };
  }
}

// ══════════════════════════════════════════════════
// SubmenuItem — positions submenu left/right based on available space
// ══════════════════════════════════════════════════

function SubmenuItem({ item, menuBtnClass, menuPanelClass, arrowIcon, submenus, openSubmenu, onOpen, onScheduleClose, menuLeft, onAction }: {
  item: { label: string; icon?: React.ReactNode; submenu?: string };
  menuBtnClass: string; menuPanelClass: string; arrowIcon: React.ReactNode;
  submenus: Record<string, { label: string; icon?: React.ReactNode; action: () => void }[]>;
  openSubmenu: string | null; onOpen: (id: string) => void; onScheduleClose: () => void;
  menuLeft: number; onAction: (action: () => void) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isOpen = openSubmenu === item.submenu;
  // Position is measured AFTER the item is committed to the DOM (so its rect is
  // valid) and stored in state. Rendering the submenu only once positioned avoids
  // the old bug where a null ref made it flash in the top-left corner.
  const [subStyle, setSubStyle] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) { setSubStyle(null); return; }
    const el = itemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const submenuW = 230;
    const fitsRight = rect.right + submenuW + 8 < window.innerWidth;
    const subItems = submenus[item.submenu!] || [];
    const submenuH = subItems.length * 34 + 16;
    let top = rect.top;
    if (top + submenuH > window.innerHeight - 16) {
      top = Math.max(8, window.innerHeight - submenuH - 16);
    }
    // Overlap the parent by 1px (no dead gap) so the mouse can cross onto the submenu.
    const left = fitsRight ? rect.right - 1 : rect.left - submenuW + 1;
    setSubStyle({ top, left: Math.max(8, left), minWidth: 200 });
  }, [isOpen, item.submenu, submenus]);

  return (
    <div
      ref={itemRef}
      onMouseEnter={() => onOpen(item.submenu!)}
      onMouseLeave={onScheduleClose}
    >
      <button className={menuBtnClass}>
        <span className="flex items-center gap-2">{item.icon}<span>{item.label}</span></span>
        {arrowIcon}
      </button>
      {isOpen && subStyle && typeof document !== "undefined" && createPortal(
        <div
          className={`fixed z-[10002] ${menuPanelClass}`}
          style={subStyle}
          onMouseEnter={() => onOpen(item.submenu!)}
          onMouseLeave={onScheduleClose}
        >
          {submenus[item.submenu!].map((sub, j) => (
            <button
              key={j}
              onClick={() => onAction(sub.action)}
              className={menuBtnClass}
            >
              <span className="flex items-center gap-2">{sub.icon}<span>{sub.label}</span></span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SlideCanvas Component
// ══════════════════════════════════════════════════

export default function SlideCanvas({
  objects, onChange, selectedId, onSelect, onSelectionChange, background, themeTextColor, themeAccent,
  canEdit, showGuides = false, guides = [], snapToGrid = false, snapToGuides = false,
  onGuideMove, onGuideDelete, drawingMode = false, drawingColor = "#1a1a2e", drawingWidth = 2, onDrawingComplete,
  onAddComment,
  onActivateLink,
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [croppingId, setCroppingId] = useState<string | null>(null);
  const [showColorPickerId, setShowColorPickerId] = useState<string | null>(null);
  // Link / alt-text mini dialog + image-replace file input (right-click menu extras)
  const [metaDialog, setMetaDialog] = useState<{ id: string; kind: "link" | "alt"; value: string } | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);
  const isResizingRef = useRef(false);
  const [drawingPath, setDrawingPath] = useState<string>("");
  const isDrawing = useRef(false);
  const drawPathRef = useRef<string>("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; objId: string } | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  // Submenu open/close with a small close delay so the mouse can travel across the
  // gap between a parent item and its (portalled) submenu without it disappearing.
  const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openSubmenuNow = useCallback((id: string) => {
    if (submenuCloseTimerRef.current) { clearTimeout(submenuCloseTimerRef.current); submenuCloseTimerRef.current = null; }
    setOpenSubmenu(id);
  }, []);
  const scheduleSubmenuClose = useCallback(() => {
    if (submenuCloseTimerRef.current) clearTimeout(submenuCloseTimerRef.current);
    submenuCloseTimerRef.current = setTimeout(() => setOpenSubmenu(null), 220);
  }, []);
  const rubberBandJustFinished = useRef(false);

  // ── Multi-select ──
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<string>>(new Set());
  const multiSelectedIdsRef = useRef(multiSelectedIds);
  multiSelectedIdsRef.current = multiSelectedIds;

  // Keep multi-select in sync: if selectedId changes externally, reset multi-select
  // BUT preserve multi-selection if it already contains the new selectedId
  useEffect(() => {
    if (selectedId) {
      setMultiSelectedIds(prev => {
        // If multi-selection already includes the new selectedId, keep it
        if (prev.size > 1 && prev.has(selectedId)) return prev;
        // If single-selection already matches, no change needed
        if (prev.size === 1 && prev.has(selectedId)) return prev;
        // Otherwise reset to single selection
        return new Set([selectedId]);
      });
    } else {
      setMultiSelectedIds(new Set());
    }
  }, [selectedId]);

  // All IDs that should show selection ring
  const allSelectedIds = multiSelectedIds.size > 1 ? multiSelectedIds : new Set(selectedId ? [selectedId] : []);

  // Lift the true selection set up to the host (for the Arrange menu). Emit only when the
  // membership actually changes, keyed by the sorted id list.
  const selKey = [...allSelectedIds].sort().join(",");
  useEffect(() => {
    onSelectionChange?.(selKey ? selKey.split(",") : []);
  }, [selKey, onSelectionChange]);

  // Update a single object
  const updateObj = useCallback((id: string, updates: Partial<SlideObject>) => {
    onChange(objects.map(o => o.id === id ? { ...o, ...updates } as SlideObject : o));
  }, [objects, onChange]);

  // Save the link / alt-text mini dialog
  const saveMeta = useCallback(() => {
    setMetaDialog(m => {
      if (m) {
        const v = m.value.trim();
        if (m.kind === "link") updateObj(m.id, { link: v || undefined });
        else updateObj(m.id, { altText: v || undefined });
      }
      return null;
    });
  }, [updateObj]);

  // Replace an image's source from a chosen file (right-click → Replace image)
  const handleReplaceImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; const id = replaceTargetRef.current;
    if (file && id) {
      const reader = new FileReader();
      reader.onload = () => updateObj(id, { src: reader.result as string } as Partial<SlideObject>);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  }, [updateObj]);

  // Delete selected (supports multi-select)
  const deleteSelected = useCallback(() => {
    const ids = multiSelectedIdsRef.current;
    if (ids.size > 0) {
      onChange(objects.filter(o => !ids.has(o.id)));
      setMultiSelectedIds(new Set());
      onSelect(null);
    } else if (selectedId) {
      onChange(objects.filter(o => o.id !== selectedId));
      onSelect(null);
    }
  }, [selectedId, objects, onChange, onSelect]);

  // Z-index helpers
  const bringToFront = useCallback((id: string) => {
    const maxZ = Math.max(...objects.map(o => o.zIndex), 0);
    onChange(objects.map(o => o.id === id ? { ...o, zIndex: maxZ + 1 } as SlideObject : o));
  }, [objects, onChange]);

  const sendToBack = useCallback((id: string) => {
    const minZ = Math.min(...objects.map(o => o.zIndex), 0);
    onChange(objects.map(o => o.id === id ? { ...o, zIndex: minZ - 1 } as SlideObject : o));
  }, [objects, onChange]);

  const bringForward = useCallback((id: string) => {
    onChange(objects.map(o => o.id === id ? { ...o, zIndex: o.zIndex + 1 } as SlideObject : o));
  }, [objects, onChange]);

  const sendBackward = useCallback((id: string) => {
    onChange(objects.map(o => o.id === id ? { ...o, zIndex: o.zIndex - 1 } as SlideObject : o));
  }, [objects, onChange]);

  const duplicateObj = useCallback((id: string) => {
    const obj = objects.find(o => o.id === id);
    if (!obj) return;
    const clone = { ...obj, id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, x: obj.x + 3, y: obj.y + 3, zIndex: Math.max(...objects.map(o => o.zIndex), 0) + 1 };
    onChange([...objects, clone as SlideObject]);
    onSelect(clone.id);
  }, [objects, onChange, onSelect]);

  // ── Rotate / Flip helpers — applies to all selected or single objId ──
  const getTargetIds = useCallback((objId: string): Set<string> => {
    const multi = multiSelectedIdsRef.current;
    return multi.size > 1 ? multi : new Set([objId]);
  }, []);

  // ── Clipboard: copy / cut / paste objects ──
  // Uses the SHARED module-level clipboard so right-click copy, the Edit menu and Ctrl+C/X/V
  // all read/write the same thing — and it survives slide navigation (paste on another page).
  const copyObjects = useCallback((id: string) => {
    const ids = getTargetIds(id);
    const copied = objects.filter(o => ids.has(o.id));
    if (copied.length) setSlideClipboard(copied as SlideObject[]);
  }, [objects, getTargetIds]);

  const pasteObjects = useCallback(() => {
    const clip = getSlideClipboard();
    if (!clip || clip.length === 0) return;
    const maxZ = Math.max(...objects.map(o => o.zIndex), 0);
    const stamp = Date.now();
    const fresh = clip.map((o, i) => ({
      ...o, id: `obj-${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}`, zIndex: maxZ + 1 + i,
    })) as SlideObject[];
    // Drop into free space (so it sits next to existing content); fall back to a small offset.
    const content = objects.map(o => ({ x: o.x, y: o.y, width: o.width, height: o.height }));
    const packed = packIntoFreeSpace(fresh, content, { x: 4, y: 4, w: 92, h: 92 });
    const clones = packed || fresh.map(o => ({ ...o, x: Math.min(95, o.x + 3), y: Math.min(95, o.y + 3) }));
    onChange([...objects, ...clones]);
    onSelect(clones[0].id);
    setMultiSelectedIds(new Set(clones.map(c => c.id)));
  }, [objects, onChange, onSelect]);

  const cutObjects = useCallback((id: string) => {
    copyObjects(id);
    const ids = getTargetIds(id);
    onChange(objects.filter(o => !ids.has(o.id)));
    onSelect(null);
    setMultiSelectedIds(new Set());
  }, [copyObjects, getTargetIds, objects, onChange, onSelect]);

  const rotateObj = useCallback((id: string, degrees: number) => {
    const ids = getTargetIds(id);
    onChange(objects.map(o => {
      if (!ids.has(o.id)) return o;
      // Normalize rotation to 0-359
      let newRot = ((o.rotation || 0) + degrees) % 360;
      if (newRot < 0) newRot += 360;
      // Keep the rotated object on the page — shrink + reposition so its rotated bounding
      // box fits within the slide (a wide chart turned upright must fit the page height).
      return fitRotatedToPage({ ...o, rotation: newRot }) as SlideObject;
    }));
  }, [objects, onChange, getTargetIds]);

  const flipObjH = useCallback((id: string) => {
    const ids = getTargetIds(id);
    onChange(objects.map(o => (ids.has(o.id) ? { ...o, scaleX: (o.scaleX || 1) * -1 } : o)));
  }, [objects, onChange, getTargetIds]);

  const flipObjV = useCallback((id: string) => {
    const ids = getTargetIds(id);
    onChange(objects.map(o => (ids.has(o.id) ? { ...o, scaleY: (o.scaleY || 1) * -1 } : o)));
  }, [objects, onChange, getTargetIds]);

  // ── Centre on page — applies to all selected or single objId ──
  const centreOnPageH = useCallback((id: string) => {
    const ids = getTargetIds(id);
    onChange(objects.map(o => {
      if (!ids.has(o.id)) return o;
      return { ...o, x: (100 - o.width) / 2 } as SlideObject;
    }));
  }, [objects, onChange, getTargetIds]);

  const centreOnPageV = useCallback((id: string) => {
    const ids = getTargetIds(id);
    onChange(objects.map(o => {
      if (!ids.has(o.id)) return o;
      return { ...o, y: (100 - o.height) / 2 } as SlideObject;
    }));
  }, [objects, onChange, getTargetIds]);

  // ── Align objects — works for multi-select OR single object relative to slide ──
  const alignObjects = useCallback((direction: "left" | "centre" | "right" | "top" | "middle" | "bottom", objId?: string) => {
    const ids = multiSelectedIdsRef.current;
    const hasMulti = ids.size > 1;
    const selected = hasMulti ? objects.filter(o => ids.has(o.id)) : (objId ? objects.filter(o => o.id === objId) : []);
    if (selected.length === 0) return;

    let updated = [...objects];
    if (hasMulti) {
      // Align multiple objects relative to each other
      switch (direction) {
        case "left": { const v = Math.min(...selected.map(o => o.x)); updated = updated.map(o => ids.has(o.id) ? { ...o, x: v } as SlideObject : o); break; }
        case "centre": { const avg = selected.reduce((s, o) => s + o.x + o.width / 2, 0) / selected.length; updated = updated.map(o => ids.has(o.id) ? { ...o, x: avg - o.width / 2 } as SlideObject : o); break; }
        case "right": { const v = Math.max(...selected.map(o => o.x + o.width)); updated = updated.map(o => ids.has(o.id) ? { ...o, x: v - o.width } as SlideObject : o); break; }
        case "top": { const v = Math.min(...selected.map(o => o.y)); updated = updated.map(o => ids.has(o.id) ? { ...o, y: v } as SlideObject : o); break; }
        case "middle": { const avg = selected.reduce((s, o) => s + o.y + o.height / 2, 0) / selected.length; updated = updated.map(o => ids.has(o.id) ? { ...o, y: avg - o.height / 2 } as SlideObject : o); break; }
        case "bottom": { const v = Math.max(...selected.map(o => o.y + o.height)); updated = updated.map(o => ids.has(o.id) ? { ...o, y: v - o.height } as SlideObject : o); break; }
      }
    } else {
      // Single object — align relative to slide (0-100%)
      const obj = selected[0];
      switch (direction) {
        case "left": updated = updated.map(o => o.id === obj.id ? { ...o, x: 0 } as SlideObject : o); break;
        case "centre": updated = updated.map(o => o.id === obj.id ? { ...o, x: (100 - o.width) / 2 } as SlideObject : o); break;
        case "right": updated = updated.map(o => o.id === obj.id ? { ...o, x: 100 - o.width } as SlideObject : o); break;
        case "top": updated = updated.map(o => o.id === obj.id ? { ...o, y: 0 } as SlideObject : o); break;
        case "middle": updated = updated.map(o => o.id === obj.id ? { ...o, y: (100 - o.height) / 2 } as SlideObject : o); break;
        case "bottom": updated = updated.map(o => o.id === obj.id ? { ...o, y: 100 - o.height } as SlideObject : o); break;
      }
    }
    onChange(updated);
  }, [objects, onChange]);

  // ── Group / Ungroup (supports nested groups) ──
  // Each object can have groupIds: string[] — a stack of group memberships.
  // The last entry is the most recent group. Ungrouping pops the latest group.
  const getGroupIds = (o: SlideObject): string[] => (o as any).groupIds || ((o as any).groupId ? [(o as any).groupId] : []);
  const getTopGroupId = (o: SlideObject): string | null => { const ids = getGroupIds(o); return ids.length > 0 ? ids[ids.length - 1] : null; };

  const groupSelected = useCallback(() => {
    const ids = multiSelectedIdsRef.current;
    if (ids.size < 2) return;
    const newGroupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // Push new groupId onto each selected object's groupIds stack
    const grouped = objects.map(o => {
      if (!ids.has(o.id)) return o;
      const existing = getGroupIds(o);
      return { ...o, groupIds: [...existing, newGroupId] } as unknown as SlideObject;
    });
    onChange(grouped);
    setMultiSelectedIds(ids);
    onSelect([...ids][0]);
  }, [objects, onChange, onSelect]);

  const ungroupSelected = useCallback(() => {
    const ids = multiSelectedIdsRef.current;
    if (ids.size === 0) return;
    // Find the most recent (top-level) groupId among selected objects
    const selectedObjs = objects.filter(o => ids.has(o.id));
    const topGroupIds = selectedObjs.map(o => getTopGroupId(o)).filter(Boolean) as string[];
    if (topGroupIds.length === 0) return;
    // Find the most recent groupId (the one that was created last)
    // Group IDs contain timestamps, so sorting lexicographically gives chronological order
    const latestGroupId = topGroupIds.sort().pop()!;
    // Pop that groupId from all objects that have it as their top group
    const ungrouped = objects.map(o => {
      const gids = getGroupIds(o);
      if (gids.length > 0 && gids[gids.length - 1] === latestGroupId) {
        const newGids = gids.slice(0, -1);
        const updated = { ...o, groupIds: newGids } as any;
        // Clean up legacy groupId field
        delete updated.groupId;
        delete updated.groupOffsetX;
        delete updated.groupOffsetY;
        return updated as SlideObject;
      }
      return o;
    });
    onChange(ungrouped);
    // After ungrouping, select all objects that were in the ungrouped group
    const stillSelected = new Set(objects.filter(o => getTopGroupId(o) === latestGroupId).map(o => o.id));
    setMultiSelectedIds(stillSelected);
  }, [objects, onChange]);

  // Keyboard handler
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if (editingTextId) return; // Don't handle keys while editing text
      if (e.key === "Escape" && croppingId) { applyCrop(croppingId); setCroppingId(null); e.preventDefault(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && (selectedId || multiSelectedIdsRef.current.size > 0)) { e.preventDefault(); deleteSelected(); }
      if (e.key === "Escape") { onSelect(null); setMultiSelectedIds(new Set()); setEditingTextId(null); setCroppingId(null); }
      // Note: Ctrl+C/X/V/D for objects are handled at the SlideEditor level — do not
      // duplicate them here or they fire twice.
      // Group: Ctrl+Alt+G
      if (e.key === "g" && (e.ctrlKey || e.metaKey) && e.altKey) {
        e.preventDefault();
        const ids = multiSelectedIdsRef.current;
        if (ids.size >= 2) {
          // Check if selected objects share a common top-level group
          const selectedObjs = objects.filter(o => ids.has(o.id));
          const topGroups = selectedObjs.map(o => getTopGroupId(o)).filter(Boolean);
          const hasGroup = topGroups.length > 0;
          if (hasGroup) ungroupSelected();
          else groupSelected();
        } else if (ids.size === 1) {
          // Single object selected — ungroup if it's in a group
          const obj = objects.find(o => ids.has(o.id));
          if (obj && getTopGroupId(obj)) ungroupSelected();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [canEdit, selectedId, editingTextId, deleteSelected, onSelect, objects, groupSelected, ungroupSelected]);

  // ── Drag handler (supports multi-select and grouped objects) ──
  const startDrag = useCallback((e: React.MouseEvent, objId: string) => {
    if (!canEdit || drawingMode || isResizingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obj = objects.find(o => o.id === objId);
    if (!obj || obj.locked) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const xTargets = getSnapTargets(snapToGrid, snapToGuides, guides, "x");
    const yTargets = getSnapTargets(snapToGrid, snapToGuides, guides, "y");

    // Determine which objects to drag together
    const dragIds = new Set<string>();
    // 1) If this object is in multi-selection, drag all selected
    const currentMulti = multiSelectedIdsRef.current;
    if (currentMulti.has(objId) && currentMulti.size > 1) {
      currentMulti.forEach(id => dragIds.add(id));
    }
    // 2) If this object is grouped, drag all in the top-level group
    const topGid = getTopGroupId(obj);
    if (topGid) {
      objects.filter(o => getTopGroupId(o) === topGid).forEach(o => dragIds.add(o.id));
    }
    // 3) If neither, just drag the single object
    if (dragIds.size === 0) dragIds.add(objId);

    // Store original positions and compute group bounding box
    const draggedObjs = objects.filter(o => dragIds.has(o.id));
    const origPositions = new Map<string, { x: number; y: number }>();
    draggedObjs.forEach(o => origPositions.set(o.id, { x: o.x, y: o.y }));

    // Group bounding box (for clamping the entire group, not individual objects)
    const groupMinX = Math.min(...draggedObjs.map(o => o.x));
    const groupMinY = Math.min(...draggedObjs.map(o => o.y));
    const groupMaxX = Math.max(...draggedObjs.map(o => o.x + o.width));
    const groupMaxY = Math.max(...draggedObjs.map(o => o.y + o.height));

    const origX = obj.x;
    const origY = obj.y;

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      let newX = origX + dx;
      let newY = origY + dy;
      newX = snapValue(newX, xTargets);
      newY = snapValue(newY, yTargets);
      let deltaX = newX - origX;
      let deltaY = newY - origY;
      // Clamp delta so the entire group stays within the slide (0-100%)
      if (groupMinX + deltaX < 0) deltaX = -groupMinX;
      if (groupMaxX + deltaX > 100) deltaX = 100 - groupMaxX;
      if (groupMinY + deltaY < 0) deltaY = -groupMinY;
      if (groupMaxY + deltaY > 100) deltaY = 100 - groupMaxY;
      // Move all dragged objects by the same clamped delta
      onChange(objects.map(o => {
        if (!dragIds.has(o.id)) return o;
        const orig = origPositions.get(o.id)!;
        return { ...o, x: orig.x + deltaX, y: orig.y + deltaY } as SlideObject;
      }));
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [canEdit, drawingMode, objects, snapToGrid, snapToGuides, guides, onChange]);

  // ── Resize handler ──
  const startResize = useCallback((e: React.MouseEvent, objId: string, handle: HandleDir) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obj = objects.find(o => o.id === objId);
    if (!obj) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = obj.x, origY = obj.y, origW = obj.width, origH = obj.height;
    const origRotation = obj.rotation || 0;

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      let x = origX, y = origY, w = origW, h = origH;
      if (handle.includes("e")) w = Math.max(5, origW + dx);
      if (handle.includes("w")) { w = Math.max(5, origW - dx); x = origX + origW - w; }
      if (handle.includes("s")) h = Math.max(3, origH + dy);
      if (handle.includes("n")) { h = Math.max(3, origH - dy); y = origY + origH - h; }
      // Clamp to slide boundaries (0-100%)
      if (x < 0) { w += x; x = 0; }
      if (y < 0) { h += y; y = 0; }
      if (x + w > 100) w = 100 - x;
      if (y + h > 100) h = 100 - y;
      w = Math.max(5, w);
      h = Math.max(3, h);
      // Preserve rotation during resize
      updateObj(objId, { x, y, width: w, height: h, rotation: origRotation });
    };
    const handleUp = () => {
      isResizingRef.current = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [canEdit, objects, updateObj]);

  // ── Group resize — scales every selected object around the group's fixed edge ──
  const startGroupResize = useCallback((e: React.MouseEvent, handle: HandleDir) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ids = multiSelectedIdsRef.current;
    const sel = objects.filter(o => ids.has(o.id));
    if (sel.length < 2) { isResizingRef.current = false; return; }
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const minX = Math.min(...sel.map(o => o.x));
    const minY = Math.min(...sel.map(o => o.y));
    const maxX = Math.max(...sel.map(o => o.x + o.width));
    const maxY = Math.max(...sel.map(o => o.y + o.height));
    const bw = maxX - minX, bh = maxY - minY;
    const orig = new Map(sel.map(o => [o.id, { x: o.x, y: o.y, w: o.width, h: o.height }]));
    const hasE = handle.includes("e"), hasW = handle.includes("w"), hasS = handle.includes("s"), hasN = handle.includes("n");

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      let newW = bw, newH = bh;
      if (hasE) newW = bw + dx;
      if (hasW) newW = bw - dx;
      if (hasS) newH = bh + dy;
      if (hasN) newH = bh - dy;
      newW = Math.max(4, newW);
      newH = Math.max(4, newH);
      // Scale factors (1 on an axis with no active handle so edge handles don't squash)
      const sx = (hasE || hasW) ? newW / bw : 1;
      const sy = (hasS || hasN) ? newH / bh : 1;
      // Anchor = the fixed (non-dragged) edge of the group box
      const ax = hasW ? maxX : minX;
      const ay = hasN ? maxY : minY;
      onChange(objects.map(o => {
        const og = orig.get(o.id);
        if (!og) return o;
        return {
          ...o,
          x: ax + (og.x - ax) * sx,
          y: ay + (og.y - ay) * sy,
          width: Math.max(2, og.w * sx),
          height: Math.max(2, og.h * sy),
        } as SlideObject;
      }));
    };
    const handleUp = () => {
      isResizingRef.current = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [canEdit, objects, onChange]);

  // ── Crop handler ──
  const startCrop = useCallback((e: React.MouseEvent, objId: string, edge: "top" | "right" | "bottom" | "left") => {
    e.preventDefault();
    e.stopPropagation();
    const obj = objects.find(o => o.id === objId) as ImageObject | undefined;
    if (!obj) return;
    const el = (e.currentTarget as HTMLElement).closest("[data-slide-obj]") as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origCrop = {
      top: obj.cropTop || 0, right: obj.cropRight || 0,
      bottom: obj.cropBottom || 0, left: obj.cropLeft || 0,
    };

    const handleMove = (ev: MouseEvent) => {
      let dx = 0, dy = 0;
      if (edge === "left") dx = ((ev.clientX - startX) / rect.width) * 100;
      if (edge === "right") dx = ((startX - ev.clientX) / rect.width) * 100;
      if (edge === "top") dy = ((ev.clientY - startY) / rect.height) * 100;
      if (edge === "bottom") dy = ((startY - ev.clientY) / rect.height) * 100;

      const updates: Partial<ImageObject> = {};
      if (edge === "top") updates.cropTop = Math.max(0, Math.min(45, origCrop.top + dy));
      if (edge === "right") updates.cropRight = Math.max(0, Math.min(45, origCrop.right + dx));
      if (edge === "bottom") updates.cropBottom = Math.max(0, Math.min(45, origCrop.bottom + dy));
      if (edge === "left") updates.cropLeft = Math.max(0, Math.min(45, origCrop.left + dx));
      updateObj(objId, updates);
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [objects, updateObj]);

  // ── Drawing handler ──
  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (!drawingMode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    isDrawing.current = true;
    drawPathRef.current = `M ${x} ${y}`;
    setDrawingPath(drawPathRef.current);
  }, [drawingMode]);

  const continueDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    drawPathRef.current += ` L ${x} ${y}`;
    setDrawingPath(drawPathRef.current);
  }, []);

  const endDrawing = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    // Read from the ref (not state) so the completed path is never lost to a stale closure
    if (drawPathRef.current.length > 10) onDrawingComplete?.(drawPathRef.current);
    drawPathRef.current = "";
    setDrawingPath("");
  }, [onDrawingComplete]);

  // ── Click to deselect ──
  // Apply crop: shrink container to visible area when exiting crop mode
  // Apply crop: just exit crop mode — crop values stay on the object permanently as clip-path
  const applyCrop = useCallback((_objId: string) => {
    // Crop values (cropTop/Right/Bottom/Left) persist on the object
    // They render as clip-path: inset() — no container resizing needed
  }, []);

  // Reset crop: clear all crop values
  const resetCrop = useCallback((objId: string) => {
    updateObj(objId, {
      cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0,
    } as Partial<ImageObject>);
    setCroppingId(null);
  }, [updateObj]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Skip if rubber band selection just completed (click fires after mouseUp)
    if (rubberBandJustFinished.current) {
      rubberBandJustFinished.current = false;
      return;
    }
    const clickedObj = (e.target as HTMLElement).closest("[data-slide-obj]");
    // If clicked on the canvas background (not on any object) → deselect
    if (!clickedObj) {
      // Don't close anything if the native color picker is open
      if (isNativeColorPickerOpen()) return;
      if (croppingId) { applyCrop(croppingId); setCroppingId(null); }
      onSelect(null);
      setMultiSelectedIds(new Set());
      setEditingTextId(null);
      setShowColorPickerId(null);
      setContextMenu(null);
      return;
    }
  }, [onSelect, croppingId, applyCrop]);

  // ── Render single object ──
  const renderObject = (obj: SlideObject) => {
    const isSelected = allSelectedIds.has(obj.id);
    const isEditing = editingTextId === obj.id;

    // For images with crop, selection ring should wrap the visible area only
    const imgCrop = obj.type === "image" ? { t: obj.cropTop || 0, r: obj.cropRight || 0, b: obj.cropBottom || 0, l: obj.cropLeft || 0 } : null;
    const hasCropInset = imgCrop && (imgCrop.t > 0 || imgCrop.r > 0 || imgCrop.b > 0 || imgCrop.l > 0);
    const showRingOnOuter = isSelected && !hasCropInset;

    const rotation = obj.rotation || 0;
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    const transformParts: string[] = [];
    if (rotation) transformParts.push(`rotate(${rotation}deg)`);
    if (scaleX !== 1) transformParts.push(`scaleX(${scaleX})`);
    if (scaleY !== 1) transformParts.push(`scaleY(${scaleY})`);

    return (
      <div
        key={obj.id}
        data-slide-obj={obj.id}
        className={`absolute ${canEdit && !drawingMode ? "cursor-move" : ""} ${showRingOnOuter ? "ring-2 ring-blue-500" : ""}`}
        style={{
          left: `${obj.x}%`, top: `${obj.y}%`, width: `${obj.width}%`, height: `${obj.height}%`,
          zIndex: obj.zIndex,
          transform: transformParts.length ? transformParts.join(" ") : undefined,
        }}
        onContextMenu={(e) => {
          if (!canEdit) return;
          e.preventDefault();
          e.stopPropagation();
          // If this object is already in the multi-selection, keep the multi-selection
          if (!multiSelectedIdsRef.current.has(obj.id)) {
            onSelect(obj.id);
            setMultiSelectedIds(new Set([obj.id]));
          }
          setContextMenu({ x: e.clientX, y: e.clientY, objId: obj.id });
        }}
        onMouseDown={(e) => {
          if (!canEdit || drawingMode) return;
          if (isNativeColorPickerOpen()) return;
          if (contextMenu) setContextMenu(null);
          // Apply and exit crop/color mode if clicking a different object
          if (croppingId && croppingId !== obj.id) { applyCrop(croppingId); setCroppingId(null); }
          if (showColorPickerId && showColorPickerId !== obj.id) setShowColorPickerId(null);
          // Multi-select with Shift or Ctrl — add/remove from selection
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            setMultiSelectedIds(prev => {
              const next = new Set(prev);
              // If starting multi-select from single selection, ensure selectedId is included
              if (next.size === 0 && selectedId) next.add(selectedId);
              // Toggle clicked object
              if (next.has(obj.id)) {
                next.delete(obj.id);
              } else {
                next.add(obj.id);
              }
              // Update parent's selectedId to first remaining
              if (next.size === 0) onSelect(null);
              else if (!next.has(selectedId || "")) onSelect([...next][0]);
              return next;
            });
            return;
          }
          // Normal click
          onSelect(obj.id);
          const topGid = getTopGroupId(obj);
          // If clicking an object already in multi-selection, keep the multi-selection (for dragging)
          if (multiSelectedIdsRef.current.has(obj.id) && multiSelectedIdsRef.current.size > 1) {
            // Keep current multi-selection
          } else if (topGid) {
            // Select all objects in the same top-level group
            const groupMembers = new Set(objects.filter(o => getTopGroupId(o) === topGid).map(o => o.id));
            setMultiSelectedIds(groupMembers);
          } else {
            setMultiSelectedIds(new Set([obj.id]));
          }
          if (!isEditing && croppingId !== obj.id) startDrag(e, obj.id);
        }}
        onDoubleClick={() => {
          if (obj.type === "textbox" && canEdit) setEditingTextId(obj.id);
          if (obj.type === "image" && canEdit) setCroppingId(croppingId === obj.id ? null : obj.id);
          if (obj.type === "shape" && canEdit) setEditingTextId(obj.id); // Edit text inside shape
          if (obj.type === "table" && canEdit) setEditingTextId(obj.id); // Edit table cells
          if (obj.type === "chart" && canEdit) setEditingTextId(obj.id); // Open chart data editor
        }}
      >
        {/* Object content */}
        {obj.type === "textbox" && (
          <div
            className={`w-full h-full overflow-hidden ${isEditing ? "outline outline-2 outline-blue-400 outline-offset-1" : ""}`}
            style={{
              fontSize: obj.fontSize, fontFamily: obj.fontFamily, color: obj.color,
              fontWeight: obj.bold ? 700 : 400, fontStyle: obj.italic ? "italic" : "normal",
              textAlign: obj.align,
              display: "grid",
              alignContent: obj.verticalAlign === "middle" ? "center" : obj.verticalAlign === "bottom" ? "end" : "start",
              backgroundColor: obj.backgroundColor || "transparent", borderRadius: obj.borderRadius ?? 0,
              border: obj.borderColor ? `${obj.borderWidth || 1}px solid ${obj.borderColor}` : "none",
              padding: obj.padding ?? 4,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {isEditing ? (
              <div
                key={`tb-edit-${obj.id}`}
                contentEditable
                suppressContentEditableWarning
                data-textbox-edit={obj.id}
                className="w-full outline-none min-h-[1em] break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto"
                style={{ textAlign: obj.align }}
                onBlur={(e) => {
                  updateObj(obj.id, { content: (e.target as HTMLDivElement).innerHTML });
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Escape") { setEditingTextId(null); e.preventDefault(); }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (items) {
                    for (const item of Array.from(items)) {
                      if (item.type.startsWith("image/")) {
                        e.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => { document.execCommand("insertHTML", false, `<img src="${reader.result}" style="max-width:100%;height:auto;" />`); };
                          reader.readAsDataURL(file);
                        }
                        return;
                      }
                    }
                  }
                }}
                ref={(el) => {
                  if (el && !(el as any).__tbInit) {
                    (el as any).__tbInit = true;
                    el.innerHTML = obj.content || "";
                    setTimeout(() => {
                      el.focus();
                      const sel = window.getSelection();
                      if (sel && el.childNodes.length > 0) {
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                      }
                    }, 0);
                  }
                }}
              />
            ) : (
              <div key={`tb-view-${obj.id}`} className="w-full break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto" style={{ textAlign: obj.align }}>
                {obj.content ? (
                  <div dangerouslySetInnerHTML={{ __html: obj.content }} />
                ) : (
                  <span style={{ opacity: 0.35 }}>{obj.placeholder || "Click to add text"}</span>
                )}
              </div>
            )}
          </div>
        )}

        {obj.type === "image" && (() => {
          const ct = obj.cropTop || 0, cr = obj.cropRight || 0, cb = obj.cropBottom || 0, cl = obj.cropLeft || 0;
          const isCropping = croppingId === obj.id;
          return (
            <div className="w-full h-full relative" style={{ borderRadius: obj.borderRadius ?? 0 }}>
              {obj.src ? (
                <img
                  src={obj.src} alt={obj.alt}
                  className="pointer-events-none block"
                  style={{
                    width: "100%", height: "100%",
                    // Use 'fill' when cropped (crop percentages must be exact); otherwise default to
                    // 'contain' so the WHOLE image is always visible when the box is resized to any
                    // aspect ratio (never silently crop the edges). 'cover' only if explicitly set.
                    objectFit: (ct > 0 || cr > 0 || cb > 0 || cl > 0) ? "fill" : (obj.objectFit || "contain"),
                    opacity: obj.opacity ?? 1,
                    border: obj.borderColor ? `${obj.borderWidth || 1}px solid ${obj.borderColor}` : "none",
                    clipPath: (ct > 0 || cr > 0 || cb > 0 || cl > 0) ? `inset(${ct}% ${cr}% ${cb}% ${cl}%)` : undefined,
                  }}
                  draggable={false}
                />
              ) : (
                // No image yet — render a clean placeholder instead of an empty <img src="">, which
                // the browser rejects (and which showed broken-image alt text). Double-click still
                // opens the image picker via the object's normal edit flow.
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400 border border-dashed border-gray-300 select-none"
                  style={{ borderRadius: obj.borderRadius ?? 0 }}
                  aria-label={obj.alt || "Image placeholder"}
                >
                  <ImagePlus className="w-6 h-6" aria-hidden="true" />
                  <span className="text-[11px] font-medium px-2 text-center leading-tight">{obj.alt || "Add image"}</span>
                </div>
              )}
              {/* Selection border around visible (cropped) area */}
              {isSelected && hasCropInset && !isCropping && (
                <div className="absolute pointer-events-none border-2 border-blue-500 z-[4]" style={{
                  top: `${ct}%`, right: `${cr}%`, bottom: `${cb}%`, left: `${cl}%`,
                }} />
              )}
              {/* Crop mode UI */}
              {isCropping && canEdit && (
                <>
                  {/* Darkened overlay on cropped-out areas */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.5) ${ct}%, transparent ${ct}%, transparent ${100-cb}%, rgba(0,0,0,0.5) ${100-cb}%)`,
                  }} />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `linear-gradient(to right, rgba(0,0,0,0.5) ${cl}%, transparent ${cl}%, transparent ${100-cr}%, rgba(0,0,0,0.5) ${100-cr}%)`,
                    mixBlendMode: "darken",
                  }} />
                  {/* Crop border */}
                  <div className="absolute pointer-events-none border-2 border-amber-500 border-dashed" style={{
                    top: `${ct}%`, right: `${cr}%`, bottom: `${cb}%`, left: `${cl}%`,
                  }} />
                  {/* Edge handles */}
                  {(["top", "right", "bottom", "left"] as const).map(edge => {
                    const pos: React.CSSProperties = {};
                    if (edge === "top") { pos.top = `${ct}%`; pos.left = "30%"; pos.right = "30%"; pos.height = 10; pos.marginTop = -5; pos.cursor = "ns-resize"; }
                    if (edge === "bottom") { pos.bottom = `${cb}%`; pos.left = "30%"; pos.right = "30%"; pos.height = 10; pos.marginBottom = -5; pos.cursor = "ns-resize"; }
                    if (edge === "left") { pos.left = `${cl}%`; pos.top = "30%"; pos.bottom = "30%"; pos.width = 10; pos.marginLeft = -5; pos.cursor = "ew-resize"; }
                    if (edge === "right") { pos.right = `${cr}%`; pos.top = "30%"; pos.bottom = "30%"; pos.width = 10; pos.marginRight = -5; pos.cursor = "ew-resize"; }
                    return (
                      <div key={edge} className="absolute z-[25]" style={pos} onMouseDown={(e) => startCrop(e, obj.id, edge)}>
                        <div className={`absolute bg-amber-500 rounded-full shadow-sm ${
                          edge === "top" || edge === "bottom" ? "left-1/2 -translate-x-1/2 w-10 h-[5px] top-1/2 -translate-y-1/2" : "top-1/2 -translate-y-1/2 h-10 w-[5px] left-1/2 -translate-x-1/2"
                        }`} />
                      </div>
                    );
                  })}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[9px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                      Drag edges to crop · Esc to finish
                    </span>
                    {obj.preCropBounds && (
                      <button
                        onClick={(e) => { e.stopPropagation(); resetCrop(obj.id); }}
                        className="text-[9px] font-medium text-red-600 bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 dark:text-red-400 midnight:text-red-400 purple:text-red-400 px-2 py-0.5 rounded shadow-sm cursor-pointer hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {obj.type === "shape" && (
          <div className="w-full h-full relative" style={{ opacity: obj.opacity ?? 1 }}>
            <ShapeSVG shape={obj.shape} fill={obj.fill} stroke={obj.stroke} strokeWidth={obj.strokeWidth} />
            {/* Editable text overlay for shapes */}
            {isEditing ? (
              <div
                key={`shape-edit-${obj.id}`}
                contentEditable
                suppressContentEditableWarning
                data-shape-text={obj.id}
                className="absolute inset-0 grid outline-none cursor-text [&_img]:max-w-full [&_img]:h-auto"
                style={{
                  color: obj.textColor || "#fff", fontSize: obj.textSize || 14, fontWeight: 600, padding: "5%", wordBreak: "break-word",
                  alignContent: (obj as ShapeObject).textVerticalAlign === "top" ? "start" : (obj as ShapeObject).textVerticalAlign === "bottom" ? "end" : "center",
                  textAlign: (obj as ShapeObject).textAlign || "center",
                }}
                onBlur={(e) => {
                  updateObj(obj.id, { text: e.currentTarget.innerHTML || "" } as Partial<ShapeObject>);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { e.currentTarget.blur(); setEditingTextId(null); }
                  e.stopPropagation();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (items) {
                    for (const item of Array.from(items)) {
                      if (item.type.startsWith("image/")) {
                        e.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            document.execCommand("insertHTML", false, `<img src="${reader.result}" style="max-width:80%;height:auto;" />`);
                          };
                          reader.readAsDataURL(file);
                        }
                        return;
                      }
                    }
                  }
                }}
                ref={(el) => {
                  if (el && !(el as any).__shapeInit) {
                    (el as any).__shapeInit = true;
                    el.innerHTML = obj.text || "";
                    setTimeout(() => {
                      el.focus();
                      const sel = window.getSelection();
                      if (sel && el.childNodes.length > 0) {
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                      }
                    }, 0);
                  }
                }}
              />
            ) : obj.text ? (
              <div
                key={`shape-view-${obj.id}`}
                className="absolute inset-0 grid pointer-events-none [&_img]:max-w-full [&_img]:h-auto"
                style={{
                  color: obj.textColor || "#fff", fontSize: obj.textSize || 14, fontWeight: 600, padding: "5%", wordBreak: "break-word",
                  alignContent: (obj as ShapeObject).textVerticalAlign === "top" ? "start" : (obj as ShapeObject).textVerticalAlign === "bottom" ? "end" : "center",
                  textAlign: (obj as ShapeObject).textAlign || "center",
                }}
                dangerouslySetInnerHTML={{ __html: obj.text }}
              />
            ) : null}
          </div>
        )}

        {obj.type === "drawing" && (
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path d={obj.paths} fill="none" stroke={obj.stroke} strokeWidth={obj.strokeWidth}
              strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
              style={{ opacity: obj.opacity ?? 1 }} />
          </svg>
        )}

        {obj.type === "chart" && (
          // pointer-events none on the wrapper so dragging the chart body / selecting works;
          // individual labels re-enable pointer events when the chart is selected so they can
          // be dragged and styled. Double-click opens the data/font/axis editor.
          <div className="w-full h-full" style={{ pointerEvents: "none" }}>
            <SlideChart
              obj={obj}
              editing={isSelected && canEdit && !drawingMode && allSelectedIds.size <= 1}
              onUpdate={(patch) => updateObj(obj.id, patch as Partial<SlideObject>)}
            />
          </div>
        )}

        {obj.type === "media" && (() => {
          const m = obj as MediaObject;
          return m.mediaKind === "audio"
            ? <audio className="w-full h-full" controls src={m.src} loop={m.loop} style={{ display: "block" }} onMouseDown={(e) => e.stopPropagation()} />
            : <video className="w-full h-full rounded-lg bg-black" controls src={m.src} poster={m.poster} loop={m.loop} muted={m.muted} playsInline style={{ objectFit: "contain" }} onMouseDown={(e) => e.stopPropagation()} />;
        })()}

        {obj.type === "table" && (
          <SlideTableRenderer
            obj={obj}
            isEditing={isEditing}
            isSelected={isSelected}
            canEdit={canEdit}
            onCellChange={(r, c, content) => {
              const newCells = obj.cells.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? { ...cell, content } : cell));
              updateObj(obj.id, { cells: newCells } as Partial<TableObject>);
            }}
            onCellUpdate={(r, c, updates) => {
              const newCells = obj.cells.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? { ...cell, ...updates } : cell));
              updateObj(obj.id, { cells: newCells } as Partial<TableObject>);
            }}
            onUpdateTable={(updates) => updateObj(obj.id, updates as Partial<TableObject>)}
            onStopEditing={() => setEditingTextId(null)}
            canvasRef={canvasRef}
            objId={obj.id}
          />
        )}

        {/* Resize handles — per-object only for single selection; multi-select uses the group box */}
        {isSelected && canEdit && !isEditing && allSelectedIds.size <= 1 && HANDLES.map(dir => (
          <div
            key={dir}
            style={{ ...getHandlePosition(dir), zIndex: 20, pointerEvents: "auto" as const }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              startResize(e, obj.id, dir);
            }}
          />
        ))}

        {/* Link chip — a linked object is otherwise invisible as a link. Shows where it points
            and opens it on click (URL in a new tab, or jumps to the slide). */}
        {obj.link && isSelected && allSelectedIds.size <= 1 && (
          <div
            className="absolute left-0 -bottom-8 z-[26] flex items-center gap-1 max-w-full px-2 py-1 rounded-lg bg-gray-900/90 text-white shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onActivateLink?.(obj.link!); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivateLink?.(obj.link!); } }}
            aria-label={`Open link ${obj.link}`}
            title={obj.link}
          >
            <LinkIcon className="w-3 h-3 flex-shrink-0 opacity-70" aria-hidden="true" />
            <span className="text-[11px] truncate max-w-[180px] underline decoration-white/40">
              {obj.link.startsWith("slide://") ? "Go to slide" : linkDisplayLabel(obj.link)}
            </span>
          </div>
        )}

        {/* Rotation handle — above or below depending on position */}
        {isSelected && canEdit && !isEditing && allSelectedIds.size <= 1 && (obj.type === "shape" || obj.type === "image") && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-[25] cursor-grab active:cursor-grabbing ${obj.y < 15 ? "top-full mt-1" : "-top-8"}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const canvas = canvasRef.current;
              if (!canvas) return;
              const objEl = e.currentTarget.parentElement;
              if (!objEl) return;
              const rect = objEl.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;

              const handleMove = (ev: MouseEvent) => {
                const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI) + 90;
                const snapped = ev.shiftKey ? Math.round(angle / 15) * 15 : Math.round(angle);
                updateObj(obj.id, { rotation: snapped });
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
            title="Drag to rotate · Hold Shift for 15° snapping"
          >
            <div className="w-[2px] h-4 bg-blue-400 mx-auto" />
            <div className="w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-sm -mt-0.5 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-blue-500"><path d="M8 1a7 7 0 015.75 3H11.5a.5.5 0 000 1h3.75a.25.25 0 00.25-.25V1a.5.5 0 00-1 0v1.535A8 8 0 100 8a.5.5 0 001 0 7 7 0 018 1z" fill="currentColor"/></svg>
            </div>
          </div>
        )}

        {/* Connection points removed — use Insert > Line for connectors */}

        {/* Color button — small paint icon to open color picker */}
        {isSelected && canEdit && !isEditing && allSelectedIds.size <= 1 && (obj.type === "shape" || obj.type === "table") && (
          <button
            className={`absolute z-[25] w-6 h-6 rounded-full shadow-md border-2 cursor-pointer transition-all hover:scale-110 ${showColorPickerId === obj.id ? "border-blue-500 ring-2 ring-blue-300" : "border-white"}`}
            style={{ top: -4, right: -4, backgroundColor: obj.type === "shape" ? (obj as ShapeObject).fill || "#3b82f6" : (obj as TableObject).headerColor || "#3b82f6" }}
            onClick={(e) => { e.stopPropagation(); setShowColorPickerId(showColorPickerId === obj.id ? null : obj.id); }}
            title="Change colors"
          />
        )}

        {/* Color toolbar — only when user clicks the color button */}
        {showColorPickerId === obj.id && canEdit && obj.type === "shape" && typeof document !== "undefined" && createPortal(
          <>
            <div className="fixed inset-0 z-[10000]" onClick={() => { if (!isNativeColorPickerOpen()) setShowColorPickerId(null); }} onMouseDown={(e) => e.stopPropagation()} />
            <ShapeColorToolbar obj={obj as ShapeObject} updateObj={updateObj} canvasRef={canvasRef} />
          </>,
          document.body,
        )}
        {showColorPickerId === obj.id && canEdit && obj.type === "table" && typeof document !== "undefined" && createPortal(
          <>
            <div className="fixed inset-0 z-[10000]" onClick={() => { if (!isNativeColorPickerOpen()) setShowColorPickerId(null); }} onMouseDown={(e) => e.stopPropagation()} />
            <TableColorToolbar obj={obj as TableObject} updateObj={updateObj} canvasRef={canvasRef} onClose={() => setShowColorPickerId(null)} />
          </>,
          document.body,
        )}

        {/* Shape text format toolbar — shared TextFormatToolbar */}
        {isEditing && obj.type === "shape" && (() => {
          const shapeEl = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
          if (!shapeEl) return null;
          const shapeObj = obj as ShapeObject;
          return (
            <TextFormatToolbar
              anchorRect={shapeEl.getBoundingClientRect()}
              fontSize={shapeObj.textSize || 14}
              align={shapeObj.textAlign}
              verticalAlign={shapeObj.textVerticalAlign}
              textColor={shapeObj.textColor || "#fff"}
              showFontFamily={false}
              showWrap={false}
              showFillColor={false}
              showUnderline
              onFontSizeChange={(v) => updateObj(obj.id, { textSize: v } as Partial<ShapeObject>)}
              onBold={() => document.execCommand("bold")}
              onItalic={() => document.execCommand("italic")}
              onUnderline={() => document.execCommand("underline")}
              onAlignChange={(v) => updateObj(obj.id, { textAlign: v } as Partial<ShapeObject>)}
              onVerticalAlignChange={(v) => updateObj(obj.id, { textVerticalAlign: v } as Partial<ShapeObject>)}
              onTextColorChange={(c) => updateObj(obj.id, { textColor: c } as Partial<ShapeObject>)}
              onClose={() => setEditingTextId(null)}
            />
          );
        })()}

        {/* Textbox format toolbar — shared TextFormatToolbar */}
        {isEditing && obj.type === "textbox" && (() => {
          const tbEl = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
          if (!tbEl) return null;
          return (
            <TextFormatToolbar
              anchorRect={tbEl.getBoundingClientRect()}
              fontFamily={obj.fontFamily}
              fontSize={obj.fontSize}
              bold={obj.bold}
              italic={obj.italic}
              align={obj.align}
              verticalAlign={obj.verticalAlign}
              textColor={obj.color}
              fillColor={obj.backgroundColor || "transparent"}
              wrap={!obj.noWrap}
              onFontFamilyChange={(v) => updateObj(obj.id, { fontFamily: v })}
              onFontSizeChange={(v) => updateObj(obj.id, { fontSize: v })}
              onBold={() => document.execCommand("bold")}
              onItalic={() => document.execCommand("italic")}
              onAlignChange={(v) => updateObj(obj.id, { align: v })}
              onVerticalAlignChange={(v) => updateObj(obj.id, { verticalAlign: v })}
              onWrapToggle={() => updateObj(obj.id, { noWrap: !obj.noWrap } as any)}
              onTextColorChange={(c) => updateObj(obj.id, { color: c })}
              onFillColorChange={(c) => updateObj(obj.id, { backgroundColor: c })}
              onClose={() => setEditingTextId(null)}
            />
          );
        })()}

        {/* Chart data editor */}
        {isEditing && obj.type === "chart" && (() => {
          const chEl = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
          if (!chEl) return null;
          return (
            <SlideChartEditor
              obj={obj}
              anchorRect={chEl.getBoundingClientRect()}
              onUpdate={(patch) => updateObj(obj.id, patch as Partial<SlideObject>)}
              onClose={() => setEditingTextId(null)}
            />
          );
        })()}
      </div>
    );
  };

  // ── Rubber band (drag-to-select) ──
  const [rubberBand, setRubberBand] = useState<{ startX: number; startY: number; curX: number; curY: number } | null>(null);
  const rubberBandRef = useRef(rubberBand);
  rubberBandRef.current = rubberBand;

  const startRubberBand = useCallback((e: React.MouseEvent) => {
    if (drawingMode) { startDrawing(e); return; }
    if (!canEdit) return;
    // Only start rubber band on canvas background (not on objects)
    const clickedObj = (e.target as HTMLElement).closest("[data-slide-obj]");
    if (clickedObj) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setRubberBand({ startX: x, startY: y, curX: x, curY: y });
  }, [canEdit, drawingMode, startDrawing]);

  const moveRubberBand = useCallback((e: React.MouseEvent) => {
    if (drawingMode) { continueDrawing(e); return; }
    if (!rubberBandRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setRubberBand(prev => prev ? { ...prev, curX: x, curY: y } : null);
  }, [drawingMode, continueDrawing]);

  const endRubberBand = useCallback(() => {
    if (drawingMode) { endDrawing(); return; }
    const rb = rubberBandRef.current;
    if (!rb) return;
    // Calculate selection rectangle
    const left = Math.min(rb.startX, rb.curX);
    const top = Math.min(rb.startY, rb.curY);
    const right = Math.max(rb.startX, rb.curX);
    const bottom = Math.max(rb.startY, rb.curY);
    // Only select if drag was at least 2% in some direction (avoid click-select)
    if (right - left > 2 || bottom - top > 2) {
      const ids = new Set<string>();
      for (const obj of objects) {
        // Object is selected if it overlaps the rubber band rectangle
        if (obj.x + obj.width > left && obj.x < right && obj.y + obj.height > top && obj.y < bottom) {
          ids.add(obj.id);
        }
      }
      if (ids.size > 0) {
        setMultiSelectedIds(ids);
        onSelect([...ids][0]);
        // Prevent the subsequent click event from clearing the selection
        rubberBandJustFinished.current = true;
      }
    }
    setRubberBand(null);
  }, [drawingMode, endDrawing, objects, onSelect]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background }}
      onClick={handleCanvasClick}
      onMouseDown={startRubberBand}
      onMouseMove={moveRubberBand}
      onMouseUp={endRubberBand}
      onMouseLeave={endRubberBand}
    >
      {/* Objects */}
      {objects.sort((a, b) => a.zIndex - b.zIndex).map(renderObject)}

      {/* Group selection box — one bounding box with handles that resizes all selected objects together */}
      {canEdit && !drawingMode && allSelectedIds.size > 1 && (() => {
        const sel = objects.filter(o => multiSelectedIds.has(o.id));
        if (sel.length < 2) return null;
        const minX = Math.min(...sel.map(o => o.x));
        const minY = Math.min(...sel.map(o => o.y));
        const maxX = Math.max(...sel.map(o => o.x + o.width));
        const maxY = Math.max(...sel.map(o => o.y + o.height));
        return (
          <div
            className="absolute z-[40]"
            style={{ left: `${minX}%`, top: `${minY}%`, width: `${maxX - minX}%`, height: `${maxY - minY}%`, pointerEvents: "none" }}
          >
            <div className="absolute inset-0 border border-blue-400 border-dashed rounded-sm" />
            {HANDLES.map(dir => (
              <div
                key={dir}
                style={{ ...getHandlePosition(dir), zIndex: 41, pointerEvents: "auto" as const }}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startGroupResize(e, dir); }}
              />
            ))}
          </div>
        );
      })()}

      {/* Rubber band selection rectangle */}
      {rubberBand && (() => {
        const left = Math.min(rubberBand.startX, rubberBand.curX);
        const top = Math.min(rubberBand.startY, rubberBand.curY);
        const w = Math.abs(rubberBand.curX - rubberBand.startX);
        const h = Math.abs(rubberBand.curY - rubberBand.startY);
        return (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-[100]"
            style={{ left: `${left}%`, top: `${top}%`, width: `${w}%`, height: `${h}%` }}
          />
        );
      })()}

      {/* Guides */}
      {showGuides && guides.map(g => (
        <div
          key={g.id}
          className={`absolute z-[50] group ${g.orientation === "v" ? "cursor-col-resize" : "cursor-row-resize"}`}
          style={g.orientation === "v"
            ? { left: `${g.position}%`, top: 0, bottom: 0, width: 8, marginLeft: -4 }
            : { top: `${g.position}%`, left: 0, right: 0, height: 8, marginTop: -4 }
          }
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const handleMove = (ev: MouseEvent) => {
              const pos = g.orientation === "v"
                ? ((ev.clientX - rect.left) / rect.width) * 100
                : ((ev.clientY - rect.top) / rect.height) * 100;
              onGuideMove?.(g.id, Math.max(0, Math.min(100, pos)));
            };
            const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
            document.addEventListener("mousemove", handleMove);
            document.addEventListener("mouseup", handleUp);
          }}
          onDoubleClick={(e) => { e.stopPropagation(); onGuideDelete?.(g.id); }}
        >
          <div className="absolute bg-blue-500/60 group-hover:bg-blue-500"
            style={g.orientation === "v" ? { left: 3, top: 0, bottom: 0, width: 1 } : { top: 3, left: 0, right: 0, height: 1 }} />
          <div className={`absolute opacity-0 group-hover:opacity-100 text-[9px] font-mono text-white bg-blue-600 rounded px-1 py-0.5 pointer-events-none ${
            g.orientation === "v" ? "top-1 left-2" : "left-1 top-2"}`}>
            {g.position.toFixed(0)}%
          </div>
        </div>
      ))}

      {/* Snap grid dots */}
      {snapToGrid && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[3]">
          {Array.from({ length: 19 }, (_, i) => (i + 1) * 5).map(x =>
            Array.from({ length: 19 }, (_, j) => (j + 1) * 5).map(y => (
              <circle key={`${x}-${y}`} cx={`${x}%`} cy={`${y}%`} r="1" fill="rgba(66,133,244,0.2)" />
            ))
          )}
        </svg>
      )}

      {/* Drawing in progress */}
      {drawingMode && drawingPath && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[40]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={drawingPath} fill="none" stroke={drawingColor} strokeWidth={drawingWidth}
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}

      {/* Empty state */}
      {objects.length === 0 && canEdit && !drawingMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 text-[14px]">Click toolbar to add text, images, or shapes</p>
        </div>
      )}

      {/* Right-click context menu with submenus */}
      {contextMenu && typeof document !== "undefined" && (() => {
        const menuBtnClass = "w-full text-left px-3 py-1.5 text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 flex items-center justify-between cursor-pointer";
        const dividerClass = "border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 my-1";
        const menuPanelClass = "bg-surface rounded-lg shadow-2xl border border-line py-1 min-w-[200px]";
        const objId = contextMenu.objId;
        const ctxObj = objects.find(o => o.id === objId);
        const hasMultiSelect = multiSelectedIds.size > 1;
        const selectedObjs = objects.filter(o => multiSelectedIds.has(o.id));
        const hasGroup = selectedObjs.some(o => getTopGroupId(o) !== null);

        // Clamp menu position to viewport with margin. Reserve room on the RIGHT for a
        // submenu so submenus open rightward (the expected direction) instead of flipping
        // left over the slide when the menu lands near the right edge.
        const menuEstH = 520; // Estimated menu height (all items + padding)
        const menuW = 220, submenuW = 234;
        let menuTop = contextMenu.y;
        let menuLeft = contextMenu.x;
        if (menuLeft + menuW + submenuW > window.innerWidth - 8) menuLeft = window.innerWidth - menuW - submenuW - 8;
        menuLeft = Math.max(8, menuLeft);
        if (menuTop + menuEstH > window.innerHeight - 16) menuTop = Math.max(8, window.innerHeight - menuEstH - 16);

        const arrowIcon = <svg viewBox="0 0 16 16" className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,4 10,8 6,12" /></svg>;

        type MenuItem = { label: string; shortcut?: string; icon?: React.ReactNode; action?: () => void; submenu?: string; disabled?: boolean };
        const items: (MenuItem | "---")[] = [
          { label: "Cut", shortcut: "Ctrl+X", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="12" r="2.5"/><circle cx="11" cy="12" r="2.5"/><line x1="5" y1="9.5" x2="11" y2="3"/><line x1="11" y1="9.5" x2="5" y2="3"/></svg>, action: () => cutObjects(objId) },
          { label: "Copy", shortcut: "Ctrl+C", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1"/><path d="M2 11V3a1 1 0 011-1h8"/></svg>, action: () => copyObjects(objId) },
          { label: "Paste", shortcut: "Ctrl+V", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="10" height="12" rx="1"/><path d="M6 2V1h4v1"/><line x1="6" y1="7" x2="10" y2="7"/><line x1="6" y1="10" x2="10" y2="10"/></svg>, action: () => pasteObjects(), disabled: !hasSlideClipboard() },
          "---",
          { label: "Delete", shortcut: "Del", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v4M10 7v4M4 4l.5 9a1 1 0 001 1h5a1 1 0 001-1L12 4"/></svg>, action: () => { if (hasMultiSelect) { deleteSelected(); } else { onSelect(objId); setTimeout(deleteSelected, 0); } } },
          "---",
          { label: "Rotate", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4s2-3 7-3 7 3 7 3"/><polyline points="12,1 15,4 12,7"/><path d="M15 12s-2 3-7 3-7-3-7-3"/><polyline points="4,15 1,12 4,9"/></svg>, submenu: "rotate" },
          { label: "Centre on page", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="14" height="14" rx="1" strokeDasharray="2 2"/><rect x="5" y="5" width="6" height="6" rx="0.5"/></svg>, submenu: "centre" },
          "---",
          { label: "Align horizontally", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="1" x2="8" y2="15" strokeDasharray="2 2"/><rect x="3" y="4" width="10" height="3" rx="0.5"/><rect x="5" y="9" width="6" height="3" rx="0.5"/></svg>, submenu: "alignH" },
          { label: "Align vertically", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="8" x2="15" y2="8" strokeDasharray="2 2"/><rect x="2" y="3" width="3" height="10" rx="0.5"/><rect x="7" y="5" width="3" height="6" rx="0.5"/></svg>, submenu: "alignV" },
          "---",
          { label: "Group", shortcut: "Ctrl+Alt+G", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M10 4h2a1 1 0 011 1v2M6 12H4a1 1 0 01-1-1v-2" strokeDasharray="2 1"/></svg>, action: () => groupSelected(), disabled: !hasMultiSelect },
          { label: "Ungroup", shortcut: "Ctrl+Alt+G", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>, action: () => ungroupSelected(), disabled: !hasGroup },
          "---",
          { label: "Bring to Front", action: () => bringToFront(objId) },
          { label: "Bring Forward", action: () => bringForward(objId) },
          { label: "Send Backward", action: () => sendBackward(objId) },
          { label: "Send to Back", action: () => sendToBack(objId) },
          "---",
          { label: "Duplicate", shortcut: "Ctrl+D", action: () => duplicateObj(objId) },
          "---",
          { label: ctxObj?.link ? "Edit link" : "Link", shortcut: "Ctrl+K", action: () => setMetaDialog({ id: objId, kind: "link", value: ctxObj?.link || "" }) },
          { label: "Alt text", action: () => setMetaDialog({ id: objId, kind: "alt", value: ctxObj?.altText || (ctxObj?.type === "image" ? (ctxObj as ImageObject).alt : "") || "" }) },
          ...(onAddComment ? [{ label: "Add comment", action: () => onAddComment(objId) }] as MenuItem[] : []),
          ...(ctxObj?.type === "shape" ? [
            { label: "Edit Text", action: () => setEditingTextId(objId) },
            { label: "Change Colors", action: () => setShowColorPickerId(objId) },
          ] as MenuItem[] : []),
          ...(ctxObj?.type === "image" ? [
            { label: "Replace image", action: () => { replaceTargetRef.current = objId; replaceInputRef.current?.click(); } },
            { label: "Crop Image", action: () => setCroppingId(objId) },
          ] as MenuItem[] : []),
          ...(ctxObj?.type === "table" ? [
            { label: "Edit Cells", action: () => setEditingTextId(objId) },
            { label: "Table Style", action: () => setShowColorPickerId(objId) },
          ] as MenuItem[] : []),
        ];

        // Submenu definitions
        const submenus: Record<string, { label: string; icon?: React.ReactNode; action: () => void }[]> = {
          rotate: [
            { label: "Rotate clockwise by 90°", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v4h-4"/><path d="M12 6A6 6 0 103 8"/></svg>, action: () => rotateObj(objId, 90) },
            { label: "Rotate anticlockwise by 90°", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2v4h4"/><path d="M4 6A6 6 0 1113 8"/></svg>, action: () => rotateObj(objId, -90) },
            { label: "Flip horizontally", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="1" x2="8" y2="15"/><polyline points="3,5 1,8 3,11"/><polyline points="13,5 15,8 13,11"/></svg>, action: () => flipObjH(objId) },
            { label: "Flip vertically", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="8" x2="15" y2="8"/><polyline points="5,3 8,1 11,3"/><polyline points="5,13 8,15 11,13"/></svg>, action: () => flipObjV(objId) },
          ],
          centre: [
            { label: "Horizontally", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="1" x2="8" y2="15" strokeDasharray="2 2"/><rect x="4" y="5" width="8" height="6" rx="0.5"/></svg>, action: () => centreOnPageH(objId) },
            { label: "Vertically", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="8" x2="15" y2="8" strokeDasharray="2 2"/><rect x="5" y="3" width="6" height="10" rx="0.5"/></svg>, action: () => centreOnPageV(objId) },
          ],
          alignH: [
            { label: "Left", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="1" x2="2" y2="15"/><rect x="2" y="3" width="10" height="3" rx="0.5"/><rect x="2" y="9" width="7" height="3" rx="0.5"/></svg>, action: () => alignObjects("left", objId) },
            { label: "Centre", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="1" x2="8" y2="15" strokeDasharray="2 2"/><rect x="3" y="3" width="10" height="3" rx="0.5"/><rect x="4.5" y="9" width="7" height="3" rx="0.5"/></svg>, action: () => alignObjects("centre", objId) },
            { label: "Right", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="14" y1="1" x2="14" y2="15"/><rect x="4" y="3" width="10" height="3" rx="0.5"/><rect x="7" y="9" width="7" height="3" rx="0.5"/></svg>, action: () => alignObjects("right", objId) },
          ],
          alignV: [
            { label: "Top", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="2" x2="15" y2="2"/><rect x="3" y="2" width="3" height="10" rx="0.5"/><rect x="9" y="2" width="3" height="7" rx="0.5"/></svg>, action: () => alignObjects("top", objId) },
            { label: "Middle", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="8" x2="15" y2="8" strokeDasharray="2 2"/><rect x="3" y="3" width="3" height="10" rx="0.5"/><rect x="9" y="4.5" width="3" height="7" rx="0.5"/></svg>, action: () => alignObjects("middle", objId) },
            { label: "Bottom", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="14" x2="15" y2="14"/><rect x="3" y="4" width="3" height="10" rx="0.5"/><rect x="9" y="7" width="3" height="7" rx="0.5"/></svg>, action: () => alignObjects("bottom", objId) },
          ],
        };

        return createPortal(
          <>
            <div className="fixed inset-0 z-[10000]" onClick={() => { setContextMenu(null); setOpenSubmenu(null); }} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); setOpenSubmenu(null); }} />
            <div
              className={`fixed z-[10001] ${menuPanelClass}`}
              style={{ top: menuTop, left: menuLeft, maxHeight: `calc(100vh - ${menuTop + 16}px)`, overflowY: "auto" }}
            >
              {items.map((item, i) =>
                item === "---" ? (
                  <div key={i} className={dividerClass} />
                ) : item.submenu ? (
                  <SubmenuItem
                    key={i}
                    item={item}
                    menuBtnClass={menuBtnClass}
                    menuPanelClass={menuPanelClass}
                    arrowIcon={arrowIcon}
                    submenus={submenus}
                    openSubmenu={openSubmenu}
                    onOpen={openSubmenuNow}
                    onScheduleClose={scheduleSubmenuClose}
                    menuLeft={menuLeft}
                    onAction={(action) => { action(); setContextMenu(null); setOpenSubmenu(null); }}
                  />
                ) : (
                  <button
                    key={i}
                    onClick={() => { if (!item.disabled) { item.action?.(); setContextMenu(null); setOpenSubmenu(null); } }}
                    className={`${menuBtnClass} ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <span className="flex items-center gap-2">{item.icon}<span>{item.label}</span></span>
                    {item.shortcut && <span className="text-[10px] text-gray-400 ml-4">{item.shortcut}</span>}
                  </button>
                )
              )}
            </div>
          </>,
          document.body,
        );
      })()}

      {/* Hidden file input for "Replace image" */}
      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceImage} />

      {/* Link / Alt-text mini dialog (right-click → Link / Alt text) */}
      {metaDialog && createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/30" onMouseDown={() => setMetaDialog(null)}>
          <div className="w-[380px] rounded-2xl bg-white dark:bg-[#0f1115] shadow-2xl border border-gray-200 dark:border-gray-700 p-4" onMouseDown={e => e.stopPropagation()}>
            <div className="text-[13px] font-bold text-gray-800 dark:text-gray-100 mb-2">{metaDialog.kind === "link" ? "Link" : "Alt text"}</div>
            <input autoFocus value={metaDialog.value}
              onChange={e => setMetaDialog(m => m && { ...m, value: e.target.value })}
              onKeyDown={e => { if (e.key === "Enter") saveMeta(); if (e.key === "Escape") setMetaDialog(null); }}
              placeholder={metaDialog.kind === "link" ? "https://…" : "Describe this object for screen readers"}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400" />
            <div className="flex justify-end gap-2 mt-3">
              {metaDialog.kind === "link" && objects.find(o => o.id === metaDialog.id)?.link && (
                <button onClick={() => { updateObj(metaDialog.id, { link: undefined }); setMetaDialog(null); }} className="mr-auto px-3 py-1.5 text-[12px] text-red-500 hover:underline">Remove link</button>
              )}
              <button onClick={() => setMetaDialog(null)} className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">Cancel</button>
              <button onClick={saveMeta} className="px-3 py-1.5 text-[12px] rounded-lg bg-blue-600 text-white font-medium">Save</button>
            </div>
          </div>
        </div>, document.body)}
    </div>
  );
}

// ══════════════════════════════════════════════════
// TableResizeHandles — reads actual DOM cell positions for accurate alignment
// ══════════════════════════════════════════════════

function TableResizeHandles({ containerRef, obj, startColResize, startRowResize, onUpdateTableRef }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  obj: TableObject;
  startColResize: (e: React.MouseEvent, colIdx: number) => void;
  startRowResize: (e: React.MouseEvent, rowIdx: number) => void;
  onUpdateTableRef: React.RefObject<((updates: Partial<TableObject>) => void) | undefined>;
}) {
  const colLinesRef = useRef<number[]>([]);
  const rowLinesRef = useRef<number[]>([]);
  const [, forceUpdate] = useState(0);

  // Read actual cell positions from the CSS Grid DOM
  const readPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const numCols = obj.cols;
    const cells = container.querySelectorAll("[data-cell]");
    if (cells.length === 0) return;

    // Column lines: right edge of each cell in first row (except last column)
    const cols: number[] = [];
    for (let c = 0; c < numCols - 1; c++) {
      const cell = cells[c]; // first row cells are indices 0..numCols-1
      if (cell) {
        const r = (cell as HTMLElement).getBoundingClientRect();
        cols.push(r.right - containerRect.left);
      }
    }

    // Row lines: bottom edge of first cell in each row (except last row)
    const rLines: number[] = [];
    for (let r = 0; r < obj.rows - 1; r++) {
      const cell = cells[r * numCols]; // first cell of each row
      if (cell) {
        const rect = (cell as HTMLElement).getBoundingClientRect();
        rLines.push(rect.bottom - containerRect.top);
      }
    }

    colLinesRef.current = cols;
    rowLinesRef.current = rLines;
  }, [containerRef, obj.cols, obj.rows]);

  // Read positions after DOM updates (using useLayoutEffect with obj dependencies)
  useLayoutEffect(() => {
    readPositions();
    forceUpdate(n => n + 1);
  }, [obj.colWidths, obj.rowHeights, obj.cols, obj.rows, obj.borderWidth, obj.cellPadding, obj.fontSize, readPositions]);

  return (
    <>
      {/* Column resize handles */}
      {colLinesRef.current.map((leftPx, ci) => (
        <div
          key={`col-${ci}`}
          className="absolute top-0 bottom-0 z-[30] cursor-col-resize group"
          style={{ left: leftPx, width: 12, marginLeft: -6, pointerEvents: "auto" }}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startColResize(e, ci); }}
        >
          <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
        </div>
      ))}

      {/* Row resize handles */}
      {rowLinesRef.current.map((topPx, ri) => (
        <div
          key={`row-${ri}`}
          className="absolute left-0 right-0 z-[30] cursor-row-resize group"
          style={{ top: topPx, height: 12, marginTop: -6, pointerEvents: "auto" }}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startRowResize(e, ri); }}
        >
          <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
        </div>
      ))}

      {/* Bottom edge — resize last row only (grows/shrinks table height) */}
      <div
        className="absolute left-0 right-0 z-[30] cursor-row-resize group"
        style={{ bottom: 0, height: 8, pointerEvents: "auto" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const startY = e.clientY;
          const containerEl = containerRef.current;
          if (!containerEl) return;
          const objEl = containerEl.closest("[data-slide-obj]") as HTMLElement;
          const canvasEl = containerEl.closest(".relative.w-full.h-full") as HTMLElement;
          if (!objEl || !canvasEl) return;
          const canvasH = canvasEl.getBoundingClientRect().height;
          const startObjH = parseFloat(objEl.style.height);
          const startHeights = [...(obj.rowHeights || Array(obj.rows).fill(100 / obj.rows))];
          const lastIdx = startHeights.length - 1;
          const handleMove = (ev: MouseEvent) => {
            const dy = ev.clientY - startY;
            const objPctChange = (dy / canvasH) * 100;
            const newObjH = Math.max(5, startObjH + objPctChange);
            // Recalculate: grow table, keep other rows' pixel size constant → last row absorbs the change
            const ratio = startObjH / newObjH;
            const newHeights = startHeights.map((h, i) => i === lastIdx ? h : h * ratio);
            const usedPct = newHeights.reduce((a, b, i) => i === lastIdx ? a : a + b, 0);
            newHeights[lastIdx] = Math.max(3, 100 - usedPct);
            onUpdateTableRef.current?.({ height: newObjH, rowHeights: newHeights } as any);
          };
          const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
          document.addEventListener("mousemove", handleMove);
          document.addEventListener("mouseup", handleUp);
        }}
      >
        <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
      </div>

      {/* Top edge — resize first row only */}
      <div
        className="absolute left-0 right-0 z-[30] cursor-row-resize group"
        style={{ top: 0, height: 8, pointerEvents: "auto" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const startY = e.clientY;
          const containerEl = containerRef.current;
          if (!containerEl) return;
          const objEl = containerEl.closest("[data-slide-obj]") as HTMLElement;
          const canvasEl = containerEl.closest(".relative.w-full.h-full") as HTMLElement;
          if (!objEl || !canvasEl) return;
          const canvasH = canvasEl.getBoundingClientRect().height;
          const startObjH = parseFloat(objEl.style.height);
          const startObjY = parseFloat(objEl.style.top);
          const startHeights = [...(obj.rowHeights || Array(obj.rows).fill(100 / obj.rows))];
          const handleMove = (ev: MouseEvent) => {
            const dy = ev.clientY - startY;
            const objPctChange = (dy / canvasH) * 100;
            const newObjH = Math.max(5, startObjH - objPctChange);
            const newObjY = startObjY + objPctChange;
            const ratio = startObjH / newObjH;
            const newHeights = startHeights.map((h, i) => i === 0 ? h : h * ratio);
            const usedPct = newHeights.reduce((a, b, i) => i === 0 ? a : a + b, 0);
            newHeights[0] = Math.max(3, 100 - usedPct);
            onUpdateTableRef.current?.({ height: newObjH, y: newObjY, rowHeights: newHeights } as any);
          };
          const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
          document.addEventListener("mousemove", handleMove);
          document.addEventListener("mouseup", handleUp);
        }}
      >
        <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
      </div>

      {/* Left edge — resize first column only */}
      <div
        className="absolute top-0 bottom-0 z-[30] cursor-col-resize group"
        style={{ left: 0, width: 8, pointerEvents: "auto" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const startX = e.clientX;
          const containerEl = containerRef.current;
          if (!containerEl) return;
          const objEl = containerEl.closest("[data-slide-obj]") as HTMLElement;
          const canvasEl = containerEl.closest(".relative.w-full.h-full") as HTMLElement;
          if (!objEl || !canvasEl) return;
          const canvasW = canvasEl.getBoundingClientRect().width;
          const startObjW = parseFloat(objEl.style.width);
          const startObjX = parseFloat(objEl.style.left);
          const startWidths = [...(obj.colWidths || Array(obj.cols).fill(100 / obj.cols))];
          const handleMove = (ev: MouseEvent) => {
            const dx = ev.clientX - startX;
            const objPctChange = (dx / canvasW) * 100;
            const newObjW = Math.max(5, startObjW - objPctChange);
            const newObjX = startObjX + objPctChange;
            const ratio = startObjW / newObjW;
            const newWidths = startWidths.map((w, i) => i === 0 ? w : w * ratio);
            const usedPct = newWidths.reduce((a, b, i) => i === 0 ? a : a + b, 0);
            newWidths[0] = Math.max(3, 100 - usedPct);
            onUpdateTableRef.current?.({ width: newObjW, x: newObjX, colWidths: newWidths } as any);
          };
          const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
          document.addEventListener("mousemove", handleMove);
          document.addEventListener("mouseup", handleUp);
        }}
      >
        <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
      </div>

      {/* Right edge — resize last column only */}
      <div
        className="absolute top-0 bottom-0 z-[30] cursor-col-resize group"
        style={{ right: 0, width: 8, pointerEvents: "auto" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const startX = e.clientX;
          const containerEl = containerRef.current;
          if (!containerEl) return;
          const objEl = containerEl.closest("[data-slide-obj]") as HTMLElement;
          const canvasEl = containerEl.closest(".relative.w-full.h-full") as HTMLElement;
          if (!objEl || !canvasEl) return;
          const canvasW = canvasEl.getBoundingClientRect().width;
          const startObjW = parseFloat(objEl.style.width);
          const startWidths = [...(obj.colWidths || Array(obj.cols).fill(100 / obj.cols))];
          const lastIdx = startWidths.length - 1;
          const handleMove = (ev: MouseEvent) => {
            const dx = ev.clientX - startX;
            const objPctChange = (dx / canvasW) * 100;
            const newObjW = Math.max(5, startObjW + objPctChange);
            const ratio = startObjW / newObjW;
            const newWidths = startWidths.map((w, i) => i === lastIdx ? w : w * ratio);
            const usedPct = newWidths.reduce((a, b, i) => i === lastIdx ? a : a + b, 0);
            newWidths[lastIdx] = Math.max(3, 100 - usedPct);
            onUpdateTableRef.current?.({ width: newObjW, colWidths: newWidths } as any);
          };
          const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
          document.addEventListener("mousemove", handleMove);
          document.addEventListener("mouseup", handleUp);
        }}
      >
        <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-blue-500 transition-colors" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════
// FontSizeCombo — Editable input with dropdown for font sizes
// ══════════════════════════════════════════════════

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

function FontSizeCombo({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`fontsize-${Math.random().toString(36).slice(2)}`);

  // Sync input when value changes externally
  useEffect(() => { setInputVal(String(value)); }, [value]);

  // Close when another dropdown/popover opens
  useEffect(() => {
    const handleOtherOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== idRef.current) setIsOpen(false);
    };
    window.addEventListener("dropdown-open", handleOtherOpen);
    return () => window.removeEventListener("dropdown-open", handleOtherOpen);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const applyValue = (v: string) => {
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 1 && n <= 200) onChange(n);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center h-[30px] rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-700 dark:to-gray-700/50 overflow-hidden">
        <input
          type="text"
          inputMode="numeric"
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); applyValue(e.target.value); }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") { applyValue(inputVal); (e.target as HTMLInputElement).blur(); setIsOpen(false); }
            if (e.key === "Escape") setIsOpen(false);
          }}
          onFocus={() => setIsOpen(false)}
          className="w-[36px] h-full px-1 bg-transparent text-[12px] font-semibold text-gray-700 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-center outline-none"
        />
        <button
          type="button"
          onClick={() => {
            const opening = !isOpen;
            if (opening) window.dispatchEvent(new CustomEvent("dropdown-open", { detail: idRef.current }));
            setIsOpen(opening);
          }}
          className="h-full px-1 flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors"
        >
          <svg viewBox="0 0 10 6" className={`w-2.5 h-2.5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1,1 5,5 9,1" /></svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 min-w-full w-fit bg-surface rounded-lg shadow-xl border border-line z-[10000] py-1 max-h-[200px] overflow-y-auto">
          {FONT_SIZES.map(s => (
            <button key={s} type="button"
              onClick={() => { onChange(s); setInputVal(String(s)); setIsOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                value === s ? "bg-blue-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SlideTableRenderer — Renders an editable table inside a canvas object
// ══════════════════════════════════════════════════

function SlideTableRenderer({ obj, isEditing, isSelected, canEdit, onCellChange, onCellUpdate, onUpdateTable, onStopEditing, canvasRef, objId }: {
  obj: TableObject;
  isEditing: boolean;
  isSelected?: boolean;
  canEdit?: boolean;
  onCellChange: (row: number, col: number, content: string) => void;
  onCellUpdate?: (row: number, col: number, updates: Partial<TableCell>) => void;
  onUpdateTable?: (updates: Partial<TableObject>) => void;
  onStopEditing: () => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  objId?: string;
}) {
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [showCellToolbar, setShowCellToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const cellEditRef = useRef<HTMLDivElement | null>(null); // ref to the active contentEditable

  // Clear cell editing state when table exits edit mode
  useEffect(() => {
    if (!isEditing) { setEditingCell(null); setShowCellToolbar(false); cellEditRef.current = null; }
  }, [isEditing]);

  // Reset ref when switching cells
  useEffect(() => {
    cellEditRef.current = null;
  }, [editingCell?.r, editingCell?.c]);

  // Position the cell toolbar above the TABLE object (not above the cell)
  useEffect(() => {
    if (!editingCell || !canvasRef?.current || !objId) { setToolbarPos(null); return; }
    const objEl = canvasRef.current.querySelector(`[data-slide-obj="${objId}"]`) as HTMLElement;
    if (!objEl) return;
    const objRect = objEl.getBoundingClientRect();
    const toolbarH = 44;
    let top = objRect.top - toolbarH - 8;
    if (top < 8) top = objRect.bottom + 8;
    // Clamp left so toolbar stays in viewport
    let left = Math.max(8, Math.min(objRect.left, window.innerWidth - 500));
    setToolbarPos({ top, left });
  }, [editingCell, canvasRef, objId]);

  const activeCell = editingCell ? obj.cells[editingCell.r]?.[editingCell.c] : null;

  // Position for the portalled Table Tools bar (the table container has overflow:hidden,
  // so an in-flow bar above the table would be clipped).
  const [tblBarPos, setTblBarPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (!isSelected || !canEdit) { setTblBarPos(null); return; }
    const update = () => { const el = containerRef.current; if (el) { const r = el.getBoundingClientRect(); setTblBarPos({ top: r.top - 36, left: r.left }); } };
    update();
    window.addEventListener("scroll", update, true); window.addEventListener("resize", update);
    const t = setInterval(update, 300); // keep in sync while dragging/resizing the table
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); clearInterval(t); };
  }, [isSelected, canEdit]);

  // Column widths and row heights (default to equal)
  const colWidths = obj.colWidths || Array(obj.cols).fill(100 / obj.cols);
  const rowHeights = obj.rowHeights || Array(obj.rows).fill(100 / obj.rows);
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs to always get latest values in event handlers
  const colWidthsRef = useRef(colWidths);
  colWidthsRef.current = colWidths;
  const rowHeightsRef = useRef(rowHeights);
  rowHeightsRef.current = rowHeights;
  const onUpdateTableRef = useRef(onUpdateTable);
  onUpdateTableRef.current = onUpdateTable;

  // Drag column border to resize
  const startColResize = useCallback((e: React.MouseEvent, colIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const tableW = containerEl.getBoundingClientRect().width;
    const startWidths = [...colWidthsRef.current];
    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const pctChange = (dx / tableW) * 100;
      const newWidths = [...startWidths];
      const minW = 5;
      newWidths[colIdx] = Math.max(minW, startWidths[colIdx] + pctChange);
      newWidths[colIdx + 1] = Math.max(minW, startWidths[colIdx + 1] - pctChange);
      onUpdateTableRef.current?.({ colWidths: newWidths });
    };
    const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, []);

  // Drag row border to resize — uses actual pixel heights for smooth dragging
  const startRowResize = useCallback((e: React.MouseEvent, rowIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const containerH = containerEl.getBoundingClientRect().height;
    // Read actual pixel heights of all rows from the grid cells
    const numCols = obj.cols;
    const cells = containerEl.querySelectorAll("[data-cell]");
    const pixelHeights: number[] = [];
    for (let r = 0; r < obj.rows; r++) {
      const cell = cells[r * numCols];
      if (cell) pixelHeights.push((cell as HTMLElement).getBoundingClientRect().height);
      else pixelHeights.push(containerH / obj.rows);
    }

    const handleMove = (ev: MouseEvent) => {
      const dy = ev.clientY - startY;
      const newPx = [...pixelHeights];
      const minPx = 20;
      newPx[rowIdx] = Math.max(minPx, pixelHeights[rowIdx] + dy);
      newPx[rowIdx + 1] = Math.max(minPx, pixelHeights[rowIdx + 1] - dy);
      // Convert pixel heights to percentages
      const newTotal = newPx.reduce((a, b) => a + b, 0);
      const newHeights = newPx.map(h => (h / newTotal) * 100);
      onUpdateTableRef.current?.({ rowHeights: newHeights });
    };
    const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, []);

  // Table Tools bar (insert/delete rows & columns, distribute) — shown when the table is
  // selected. Operations act relative to the cell being edited, or the last row/col.
  const tblR = editingCell?.r ?? obj.rows - 1;
  const tblC = editingCell?.c ?? obj.cols - 1;
  const applyTbl = (patch: Partial<TableObject>) => { if (Object.keys(patch).length) onUpdateTable?.(patch); };
  const tblBtn = "px-1.5 h-6 inline-flex items-center gap-0.5 rounded text-[11px] text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22262e] cursor-pointer";

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative" onMouseDown={(e) => { if (isEditing) e.stopPropagation(); }}>
      {tblBarPos && typeof document !== "undefined" && createPortal(
        <div className="fixed z-[10001] flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-white dark:bg-[#0f1115] shadow-lg border border-gray-200 dark:border-gray-700"
          style={{ top: tblBarPos.top, left: tblBarPos.left }} onMouseDown={(e) => e.stopPropagation()}>
          <Tooltip content="Insert row above" delay={300}><button className={tblBtn} onClick={() => applyTbl(insertRow(obj, tblR))}>+↑Row</button></Tooltip>
          <Tooltip content="Insert row below" delay={300}><button className={tblBtn} onClick={() => applyTbl(insertRow(obj, tblR + 1))}>+↓Row</button></Tooltip>
          <Tooltip content="Delete row" delay={300}><button className={tblBtn} onClick={() => applyTbl(deleteRow(obj, tblR))}>−Row</button></Tooltip>
          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
          <Tooltip content="Insert column left" delay={300}><button className={tblBtn} onClick={() => applyTbl(insertCol(obj, tblC))}>+←Col</button></Tooltip>
          <Tooltip content="Insert column right" delay={300}><button className={tblBtn} onClick={() => applyTbl(insertCol(obj, tblC + 1))}>+→Col</button></Tooltip>
          <Tooltip content="Delete column" delay={300}><button className={tblBtn} onClick={() => applyTbl(deleteCol(obj, tblC))}>−Col</button></Tooltip>
          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
          <Tooltip content="Distribute rows evenly" delay={300}><button className={tblBtn} onClick={() => applyTbl(distributeRows(obj))}>≡Rows</button></Tooltip>
          <Tooltip content="Distribute columns evenly" delay={300}><button className={tblBtn} onClick={() => applyTbl(distributeCols(obj))}>≡Cols</button></Tooltip>
        </div>, document.body)}
      <div
        className="w-full h-full"
        style={{
          display: "grid",
          gridTemplateColumns: colWidths.map(w => `${w}%`).join(" "),
          gridTemplateRows: rowHeights.map(h => `${h}%`).join(" "),
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
        }}
      >
        {obj.cells.map((row, ri) => (
          <React.Fragment key={ri}>
              {row.map((cell, ci) => {
                const isHeader = obj.headerRow && ri === 0;
                const bgColor = isHeader ? obj.headerColor : ri % 2 === 0 ? obj.evenRowColor : obj.oddRowColor;
                const resolvedBg = cell.backgroundColor || bgColor;
                const textColor = isHeader && obj.headerColor !== "transparent" ? "#ffffff" : (cell.color || "#1f2937");
                const isCellEditing = isEditing && editingCell?.r === ri && editingCell?.c === ci;

                return (
                  <div
                    key={`${ri}-${ci}`}
                    data-cell={`${ri}-${ci}`}
                    className={`relative ${isCellEditing ? "outline outline-2 outline-blue-500 outline-offset-[-1px] z-10" : ""}`}
                    style={{
                      border: `${obj.borderWidth}px solid ${obj.borderColor}`,
                      padding: obj.cellPadding,
                      backgroundColor: resolvedBg,
                      color: textColor,
                      fontWeight: isHeader || cell.bold ? 700 : 400,
                      fontStyle: cell.italic ? "italic" : "normal",
                      textAlign: cell.align || (isHeader ? "center" : "left"),
                      display: "flex",
                      alignItems: (cell.verticalAlign || "middle") === "top" ? "flex-start" : (cell.verticalAlign || "middle") === "bottom" ? "flex-end" : "center",
                      overflow: "hidden",
                      wordBreak: cell.noWrap ? undefined : "break-word",
                      cursor: isEditing ? "text" : "default",
                      fontSize: cell.fontSize || obj.fontSize,
                      fontFamily: cell.fontFamily || obj.fontFamily,
                    }}
                    onClick={(e) => {
                      if (isEditing) { e.stopPropagation(); setEditingCell({ r: ri, c: ci }); }
                    }}
                  >
                    {isCellEditing ? (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="outline-none min-h-[1em] w-full [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full"
                        style={{ color: textColor }}
                        onBlur={(e) => {
                          onCellChange(ri, ci, e.currentTarget.innerHTML || "");
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Tab") {
                            e.preventDefault();
                            onCellChange(ri, ci, (e.target as HTMLElement).innerHTML || "");
                            const nextC = ci + 1 < obj.cols ? ci + 1 : 0;
                            const nextR = ci + 1 < obj.cols ? ri : ri + 1 < obj.rows ? ri + 1 : 0;
                            setEditingCell({ r: nextR, c: nextC });
                          }
                          if (e.key === "Escape") {
                            onCellChange(ri, ci, (e.target as HTMLElement).innerHTML || "");
                            setEditingCell(null); setShowCellToolbar(false); onStopEditing();
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onCellChange(ri, ci, (e.target as HTMLElement).innerHTML || "");
                            if (ri + 1 < obj.rows) setEditingCell({ r: ri + 1, c: ci });
                            else setEditingCell(null);
                          }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPaste={(e) => {
                          // Allow rich paste including images
                          const items = e.clipboardData?.items;
                          if (items) {
                            for (const item of Array.from(items)) {
                              if (item.type.startsWith("image/")) {
                                e.preventDefault();
                                const file = item.getAsFile();
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    document.execCommand("insertHTML", false, `<img src="${reader.result}" style="max-width:100%;height:auto;" />`);
                                  };
                                  reader.readAsDataURL(file);
                                }
                                return;
                              }
                            }
                          }
                        }}
                        ref={(el) => {
                          if (el && cellEditRef.current !== el) {
                            cellEditRef.current = el;
                            el.innerHTML = cell.content || "";
                            setTimeout(() => {
                              el.focus();
                              const sel = window.getSelection();
                              if (sel && el.childNodes.length > 0) {
                                const range = document.createRange();
                                range.selectNodeContents(el);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                              }
                            }, 0);
                          }
                        }}
                      />
                    ) : (
                      <div
                        className={`w-full ${cell.noWrap ? "truncate whitespace-nowrap" : "whitespace-pre-wrap break-words"} [&_img]:max-w-full [&_img]:h-auto [&_video]:max-w-full`}
                        dangerouslySetInnerHTML={{ __html: cell.content || (isEditing ? "&nbsp;" : "") }}
                      />
                    )}
                  </div>
                );
              })}
          </React.Fragment>
          ))}
      </div>

      {/* Column + Row resize handles — positioned from actual DOM cell positions */}
      {(isSelected || isEditing) && canEdit && onUpdateTable && <TableResizeHandles
        containerRef={containerRef}
        obj={obj}
        startColResize={startColResize}
        startRowResize={startRowResize}
        onUpdateTableRef={onUpdateTableRef}
      />}

      {/* Format button — shows when a cell is being edited */}
      {editingCell && !showCellToolbar && toolbarPos && typeof document !== "undefined" && createPortal(
        <button
          className="fixed z-[10002] w-8 h-8 rounded-lg bg-surface shadow-lg border border-line flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all"
          style={{ top: toolbarPos.top + 4, left: toolbarPos.left }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowCellToolbar(true);
          }}
          title="Format cell"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="10" y2="8"/><line x1="2" y1="12" x2="12" y2="12"/>
            <circle cx="13" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.3" />
          </svg>
        </button>,
        document.body,
      )}

      {/* Cell formatting toolbar — only shown when user explicitly opens it */}
      {showCellToolbar && editingCell && activeCell && onCellUpdate && canvasRef?.current && (() => {
        const objEl = canvasRef.current?.querySelector(`[data-slide-obj="${objId}"]`) as HTMLElement;
        if (!objEl) return null;
        return (
          <TextFormatToolbar
            anchorRect={objEl.getBoundingClientRect()}
            fontFamily={activeCell.fontFamily || obj.fontFamily}
            fontSize={activeCell.fontSize || obj.fontSize}
            bold={activeCell.bold}
            italic={activeCell.italic}
            align={activeCell.align || "left"}
            verticalAlign={activeCell.verticalAlign || "middle"}
            textColor={activeCell.color || "#1f2937"}
            fillColor={activeCell.backgroundColor || "#ffffff"}
            wrap={!activeCell.noWrap}
            onFontFamilyChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { fontFamily: v })}
            onFontSizeChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { fontSize: v })}
            onBold={() => onCellUpdate(editingCell.r, editingCell.c, { bold: !activeCell.bold })}
            onItalic={() => onCellUpdate(editingCell.r, editingCell.c, { italic: !activeCell.italic })}
            onAlignChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { align: v })}
            onVerticalAlignChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { verticalAlign: v })}
            onWrapToggle={() => onCellUpdate(editingCell.r, editingCell.c, { noWrap: !activeCell.noWrap })}
            onTextColorChange={(c) => onCellUpdate(editingCell.r, editingCell.c, { color: c })}
            onFillColorChange={(c) => onCellUpdate(editingCell.r, editingCell.c, { backgroundColor: c })}
            onClose={() => setShowCellToolbar(false)}
          />
        );
      })()}
    </div>
  );
}

// ══════════════════════════════════════════════════
// ShapeColorToolbar — Modern tabbed format panel
// Uses shared ColorPalettePicker components
// ══════════════════════════════════════════════════

type ShapeToolbarTab = "fill" | "border" | "text";

function ShapeColorToolbar({ obj, updateObj, canvasRef }: {
  obj: ShapeObject;
  updateObj: (id: string, updates: Partial<SlideObject>) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [tab, setTab] = useState<ShapeToolbarTab>("fill");

  useEffect(() => {
    const el = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const toolbarW = 280;
    const toolbarH = 340;
    // Position to the right of the shape, or left if not enough space
    let top = rect.top;
    let left = rect.right + 12;
    if (left + toolbarW > window.innerWidth - 8) left = rect.left - toolbarW - 12;
    if (left < 8) left = 8;
    if (top + toolbarH > window.innerHeight - 8) top = window.innerHeight - toolbarH - 8;
    if (top < 8) top = 8;
    setPos({ top, left });
  }, [obj.id, obj.x, obj.y, obj.width, obj.height, canvasRef]);

  const tabs: { key: ShapeToolbarTab; label: string; icon: string }[] = [
    { key: "fill", label: "Fill", icon: "◼" },
    { key: "border", label: "Border", icon: "◻" },
    { key: "text", label: "Text", icon: "A" },
  ];

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[10001] rounded-2xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-2xl border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden"
      style={{ top: pos.top, left: pos.left, width: 280, backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header — shape preview + opacity */}
      <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-line flex items-center justify-center overflow-hidden" style={{ backgroundColor: obj.fill || "#3b82f6" }}>
            <svg viewBox="0 0 100 100" className="w-7 h-7" style={{ color: "#fff" }}>
              <g dangerouslySetInnerHTML={{ __html: SHAPE_DEFS[obj.shape]?.svg.replace(/fill="currentColor"/g, 'fill="white"').replace(/stroke="currentColor"/g, 'stroke="white"') || "" }} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">
              {SHAPE_DEFS[obj.shape]?.label || "Shape"}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 shrink-0">Opacity</span>
              <input
                type="range" min={0} max={100} step={5}
                value={Math.round((obj.opacity ?? 1) * 100)}
                onChange={(e) => updateObj(obj.id, { opacity: Number(e.target.value) / 100 } as Partial<ShapeObject>)}
                className="flex-1 h-1 accent-blue-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-muted w-8 text-right">{Math.round((obj.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-3 gap-0.5 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-[11px] font-medium transition-all cursor-pointer relative ${
              tab === t.key
                ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hover:text-gray-600 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
            }`}
          >
            <span className="mr-1">{t.icon}</span>{t.label}
            {tab === t.key && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-3 py-3 max-h-[260px] overflow-y-auto">
        {tab === "fill" && (
          <div>
            <TabbedColorPalette
              selectedColor={obj.fill}
              onSelect={(c) => updateObj(obj.id, { fill: c } as Partial<ShapeObject>)}
              glossyColors={GLOSSY_COLORS}
              columns={6}
              swatchSize="sm"
              showCustomHex
            />
            {/* No fill option */}
            <button
              onClick={() => updateObj(obj.id, { fill: "transparent" } as Partial<ShapeObject>)}
              className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                obj.fill === "transparent"
                  ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 ring-1 ring-blue-200 dark:ring-blue-800"
                  : "text-muted hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border border-line"
              }`}
            >
              No fill
            </button>
          </div>
        )}

        {tab === "border" && (
          <div className="space-y-3">
            {/* Border color */}
            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Color</div>
              <ColorGrid
                colors={BORDER_COLORS.slice(0, 24)}
                selectedColor={obj.stroke}
                onSelect={(c) => updateObj(obj.id, { stroke: c, strokeWidth: Math.max(obj.strokeWidth || 0, 2) } as Partial<ShapeObject>)}
                columns={8}
                swatchSize="sm"
                allowNoFill
                noFillSelected={!obj.stroke || obj.stroke === "transparent"}
                onNoFill={() => updateObj(obj.id, { stroke: "transparent", strokeWidth: 0 } as Partial<ShapeObject>)}
                showCustomHex
              />
            </div>

            {/* Border weight */}
            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Weight</div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 6, 8].map(w => (
                  <button
                    key={w}
                    onClick={() => updateObj(obj.id, { strokeWidth: w, stroke: w === 0 ? "transparent" : (obj.stroke === "transparent" ? "#1a1a2e" : obj.stroke) } as Partial<ShapeObject>)}
                    className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      obj.strokeWidth === w
                        ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 ring-1.5 ring-blue-400"
                        : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border border-line"
                    }`}
                    title={w === 0 ? "None" : `${w}px`}
                  >
                    {w === 0 ? (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400"><line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    ) : (
                      <div style={{ width: 18, height: Math.max(1, w), backgroundColor: obj.stroke && obj.stroke !== "transparent" ? obj.stroke : "#6b7280", borderRadius: 1 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Border style — future: dashed, dotted */}
            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Style</div>
              <div className="flex gap-1">
                {[
                  { label: "Solid", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" /> },
                  { label: "Dashed", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" /> },
                  { label: "Dotted", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="1.5 2.5" strokeLinecap="round" /> },
                ].map((s, i) => (
                  <button
                    key={i}
                    className="flex-1 h-8 flex items-center justify-center rounded-lg border border-line hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer transition-all"
                    title={s.label}
                  >
                    <svg viewBox="0 0 32 20" className="w-6 h-4 text-muted">{s.svg}</svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "text" && (
          <div className="space-y-3">
            {/* Text color */}
            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Color</div>
              <ColorGrid
                colors={TEXT_COLORS}
                selectedColor={obj.textColor || "#ffffff"}
                onSelect={(c) => updateObj(obj.id, { textColor: c } as Partial<ShapeObject>)}
                columns={5}
                swatchSize="sm"
                showCustomHex
              />
            </div>

            {/* Text size */}
            <div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Size</div>
              <div className="flex gap-1">
                {[8, 10, 12, 14, 18, 24, 32, 48].map(s => (
                  <button
                    key={s}
                    onClick={() => updateObj(obj.id, { textSize: s } as Partial<ShapeObject>)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                      (obj.textSize || 14) === s
                        ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 ring-1 ring-blue-200 dark:ring-blue-800"
                        : "text-muted hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
              <div className="w-5 h-5 rounded bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center">
                <span className="text-[10px] text-gray-400">T</span>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Double-click shape to type text</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// TableColorToolbar — Wrapper for shared TableStylePanel
// ══════════════════════════════════════════════════

function TableColorToolbar({ obj, updateObj, canvasRef, onClose }: {
  obj: TableObject;
  updateObj: (id: string, updates: Partial<SlideObject>) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onClose?: () => void;
}) {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
    if (!el) return;
    setAnchorRect(el.getBoundingClientRect());
  }, [obj.id, obj.x, obj.y, obj.width, obj.height, canvasRef]);

  return (
    <TableStylePanel
      obj={obj}
      onUpdate={(updates) => updateObj(obj.id, updates as Partial<SlideObject>)}
      anchorRect={anchorRect}
      onClose={onClose}
    />
  );
}
