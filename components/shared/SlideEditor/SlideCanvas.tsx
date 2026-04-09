"use client";

/**
 * SlideCanvas — Canvas-based slide editor with draggable, resizable objects.
 * Supports: TextBox, Image, Shape, Drawing objects.
 * Snap-to-grid and snap-to-guides when dragging.
 */

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { SlideObject, TextBoxObject, ImageObject, ShapeObject, DrawingObject, TableObject, TableCell } from "@/lib/slide-storage";
import { SHAPE_DEFS } from "./shapes";
import { ColorGrid, TabbedColorPalette, ColorPickerPopover, SOLID_COLORS, GRADIENT_COLORS, GLOSSY_COLORS, BORDER_COLORS, TEXT_COLORS, colorToCSS } from "@/components/shared/ColorPalettePicker";
import CustomDropdown from "@/components/shared/CustomDropdown";

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

interface SlideCanvasProps {
  objects: SlideObject[];
  onChange: (objects: SlideObject[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
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

function ShapeSVG({ shape, fill, stroke, strokeWidth, text, textColor, textSize }: {
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
    .replace(/stroke="currentColor"/g, `stroke="${hasStroke ? stroke : "none"}" stroke-width="${hasStroke ? strokeWidth : 0}"`);
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
}

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
// SlideCanvas Component
// ══════════════════════════════════════════════════

export default function SlideCanvas({
  objects, onChange, selectedId, onSelect, background, themeTextColor, themeAccent,
  canEdit, showGuides = false, guides = [], snapToGrid = false, snapToGuides = false,
  onGuideMove, onGuideDelete, drawingMode = false, drawingColor = "#1a1a2e", drawingWidth = 2, onDrawingComplete,
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [croppingId, setCroppingId] = useState<string | null>(null);
  const [showColorPickerId, setShowColorPickerId] = useState<string | null>(null);
  const isResizingRef = useRef(false);
  const [drawingPath, setDrawingPath] = useState<string>("");
  const isDrawing = useRef(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; objId: string } | null>(null);

  // Update a single object
  const updateObj = useCallback((id: string, updates: Partial<SlideObject>) => {
    onChange(objects.map(o => o.id === id ? { ...o, ...updates } as SlideObject : o));
  }, [objects, onChange]);

  // Delete selected
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    onChange(objects.filter(o => o.id !== selectedId));
    onSelect(null);
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

  // Keyboard handler
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if (editingTextId) return; // Don't handle keys while editing text
      if (e.key === "Escape" && croppingId) { applyCrop(croppingId); setCroppingId(null); e.preventDefault(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) { e.preventDefault(); deleteSelected(); }
      if (e.key === "Escape") { onSelect(null); setEditingTextId(null); setCroppingId(null); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [canEdit, selectedId, editingTextId, deleteSelected, onSelect]);

  // ── Drag handler ──
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
    const origX = obj.x;
    const origY = obj.y;
    const xTargets = getSnapTargets(snapToGrid, snapToGuides, guides, "x");
    const yTargets = getSnapTargets(snapToGrid, snapToGuides, guides, "y");

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      let newX = Math.max(0, Math.min(100 - obj.width, origX + dx));
      let newY = Math.max(0, Math.min(100 - obj.height, origY + dy));
      newX = snapValue(newX, xTargets);
      newY = snapValue(newY, yTargets);
      // Also snap right edge and center
      newX = snapValue(newX + obj.width, xTargets) - obj.width;
      newX = snapValue(newX + obj.width / 2, xTargets) - obj.width / 2;
      newY = snapValue(newY + obj.height, yTargets) - obj.height;
      newY = snapValue(newY + obj.height / 2, yTargets) - obj.height / 2;
      updateObj(objId, { x: newX, y: newY });
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [canEdit, drawingMode, objects, snapToGrid, snapToGuides, guides, updateObj]);

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
    setDrawingPath(`M ${x} ${y}`);
  }, [drawingMode]);

  const continueDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawingPath(prev => prev + ` L ${x} ${y}`);
  }, []);

  const endDrawing = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (drawingPath.length > 10) onDrawingComplete?.(drawingPath);
    setDrawingPath("");
  }, [drawingPath, onDrawingComplete]);

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
    const clickedObj = (e.target as HTMLElement).closest("[data-slide-obj]");
    // If clicked on the canvas background (not on any object) → deselect
    if (!clickedObj) {
      if (croppingId) { applyCrop(croppingId); setCroppingId(null); }
      onSelect(null);
      setEditingTextId(null);
      setShowColorPickerId(null);
      setContextMenu(null);
      return;
    }
    // If clicked on the already-selected object and NOT in crop/edit mode → deselect
    const clickedId = clickedObj.getAttribute("data-slide-obj");
    if (clickedId === selectedId && !croppingId && !editingTextId) {
      // Only deselect on single click (not double-click which enters edit/crop)
      // Use a small delay to differentiate single vs double click
    }
  }, [onSelect, croppingId, applyCrop, selectedId, editingTextId]);

  // ── Render single object ──
  const renderObject = (obj: SlideObject) => {
    const isSelected = selectedId === obj.id;
    const isEditing = editingTextId === obj.id;

    // For images with crop, selection ring should wrap the visible area only
    const imgCrop = obj.type === "image" ? { t: obj.cropTop || 0, r: obj.cropRight || 0, b: obj.cropBottom || 0, l: obj.cropLeft || 0 } : null;
    const hasCropInset = imgCrop && (imgCrop.t > 0 || imgCrop.r > 0 || imgCrop.b > 0 || imgCrop.l > 0);
    const showRingOnOuter = isSelected && !hasCropInset;

    const rotation = obj.rotation || 0;

    return (
      <div
        key={obj.id}
        data-slide-obj={obj.id}
        className={`absolute ${canEdit && !drawingMode ? "cursor-move" : ""} ${showRingOnOuter ? "ring-2 ring-blue-500" : ""}`}
        style={{
          left: `${obj.x}%`, top: `${obj.y}%`, width: `${obj.width}%`, height: `${obj.height}%`,
          zIndex: obj.zIndex,
          // Rotation applied via CSS transform but handles stay in screen-aligned space
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
        }}
        onContextMenu={(e) => {
          if (!canEdit) return;
          e.preventDefault();
          e.stopPropagation();
          onSelect(obj.id);
          setContextMenu({ x: e.clientX, y: e.clientY, objId: obj.id });
        }}
        onMouseDown={(e) => {
          if (!canEdit || drawingMode) return;
          if (contextMenu) setContextMenu(null);
          // Apply and exit crop/color mode if clicking a different object
          if (croppingId && croppingId !== obj.id) { applyCrop(croppingId); setCroppingId(null); }
          if (showColorPickerId && showColorPickerId !== obj.id) setShowColorPickerId(null);
          onSelect(obj.id);
          if (!isEditing && croppingId !== obj.id) startDrag(e, obj.id);
        }}
        onDoubleClick={() => {
          if (obj.type === "textbox" && canEdit) setEditingTextId(obj.id);
          if (obj.type === "image" && canEdit) setCroppingId(croppingId === obj.id ? null : obj.id);
          if (obj.type === "shape" && canEdit) setEditingTextId(obj.id); // Edit text inside shape
          if (obj.type === "table" && canEdit) setEditingTextId(obj.id); // Edit table cells
        }}
      >
        {/* Object content */}
        {obj.type === "textbox" && (
          <div
            className={`w-full h-full overflow-hidden ${isEditing ? "outline outline-2 outline-blue-400 outline-offset-1" : ""}`}
            style={{
              fontSize: obj.fontSize, fontFamily: obj.fontFamily, color: obj.color,
              fontWeight: obj.bold ? 700 : 400, fontStyle: obj.italic ? "italic" : "normal",
              textAlign: obj.align, display: "flex", alignItems: obj.verticalAlign === "middle" ? "center" : obj.verticalAlign === "bottom" ? "flex-end" : "flex-start",
              backgroundColor: obj.backgroundColor || "transparent", borderRadius: obj.borderRadius ?? 0,
              border: obj.borderColor ? `${obj.borderWidth || 1}px solid ${obj.borderColor}` : "none",
              padding: obj.padding ?? 4,
            }}
          >
            {isEditing ? (
              <div
                contentEditable
                suppressContentEditableWarning
                className="w-full outline-none min-h-[1em]"
                style={{ textAlign: obj.align }}
                dangerouslySetInnerHTML={{ __html: obj.content || "" }}
                onBlur={(e) => {
                  updateObj(obj.id, { content: (e.target as HTMLDivElement).innerHTML });
                  setEditingTextId(null);
                }}
                onKeyDown={(e) => { if (e.key === "Escape") { setEditingTextId(null); e.preventDefault(); } }}
                ref={(el) => { if (el && isEditing) el.focus(); }}
              />
            ) : (
              <div className="w-full" style={{ textAlign: obj.align }}>
                {obj.content ? (
                  <span dangerouslySetInnerHTML={{ __html: obj.content }} />
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
              <img
                src={obj.src} alt={obj.alt}
                className="pointer-events-none block"
                style={{
                  width: "100%", height: "100%",
                  // Use 'fill' when cropped so crop percentages are exact; 'cover' when uncropped for best appearance
                  objectFit: (ct > 0 || cr > 0 || cb > 0 || cl > 0) ? "fill" : (obj.objectFit || "cover"),
                  opacity: obj.opacity ?? 1,
                  border: obj.borderColor ? `${obj.borderWidth || 1}px solid ${obj.borderColor}` : "none",
                  clipPath: (ct > 0 || cr > 0 || cb > 0 || cl > 0) ? `inset(${ct}% ${cr}% ${cb}% ${cl}%)` : undefined,
                }}
                draggable={false}
              />
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
                    <span className="text-[9px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                      Drag edges to crop · Esc to finish
                    </span>
                    {obj.preCropBounds && (
                      <button
                        onClick={(e) => { e.stopPropagation(); resetCrop(obj.id); }}
                        className="text-[9px] font-medium text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded shadow-sm cursor-pointer hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors"
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
                contentEditable
                suppressContentEditableWarning
                className="absolute inset-0 flex items-center justify-center text-center outline-none cursor-text"
                style={{ color: obj.textColor || "#fff", fontSize: obj.textSize || 14, fontWeight: 600, padding: "10%", wordBreak: "break-word" }}
                onBlur={(e) => {
                  updateObj(obj.id, { text: e.currentTarget.textContent || "" } as Partial<ShapeObject>);
                  setEditingTextId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { e.currentTarget.blur(); }
                  e.stopPropagation(); // Prevent global shortcuts while typing
                }}
                onMouseDown={(e) => e.stopPropagation()}
                dangerouslySetInnerHTML={{ __html: obj.text || "" }}
                ref={(el) => { if (el && isEditing) setTimeout(() => el.focus(), 0); }}
              />
            ) : obj.text ? (
              <div
                className="absolute inset-0 flex items-center justify-center text-center pointer-events-none"
                style={{ color: obj.textColor || "#fff", fontSize: obj.textSize || 14, fontWeight: 600, padding: "10%", wordBreak: "break-word" }}
              >
                {obj.text}
              </div>
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

        {/* Resize handles — always at container edges */}
        {isSelected && canEdit && !isEditing && HANDLES.map(dir => (
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

        {/* Rotation handle — above or below depending on position */}
        {isSelected && canEdit && !isEditing && (obj.type === "shape" || obj.type === "image") && (
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
        {isSelected && canEdit && !isEditing && (obj.type === "shape" || obj.type === "table") && (
          <button
            className={`absolute z-[25] w-6 h-6 rounded-full shadow-md border-2 cursor-pointer transition-all hover:scale-110 ${showColorPickerId === obj.id ? "border-blue-500 ring-2 ring-blue-300" : "border-white"}`}
            style={{ top: -4, right: -4, backgroundColor: obj.type === "shape" ? (obj as ShapeObject).fill || "#3b82f6" : (obj as TableObject).headerColor || "#3b82f6" }}
            onClick={(e) => { e.stopPropagation(); setShowColorPickerId(showColorPickerId === obj.id ? null : obj.id); }}
            title="Change colors"
          />
        )}

        {/* Color toolbar — only when user clicks the color button */}
        {showColorPickerId === obj.id && canEdit && obj.type === "shape" && typeof document !== "undefined" && createPortal(
          <ShapeColorToolbar obj={obj as ShapeObject} updateObj={updateObj} canvasRef={canvasRef} />,
          document.body,
        )}
        {showColorPickerId === obj.id && canEdit && obj.type === "table" && typeof document !== "undefined" && createPortal(
          <TableColorToolbar obj={obj as TableObject} updateObj={updateObj} canvasRef={canvasRef} />,
          document.body,
        )}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background }}
      onClick={handleCanvasClick}
      onMouseDown={startDrawing}
      onMouseMove={continueDrawing}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    >
      {/* Objects */}
      {objects.sort((a, b) => a.zIndex - b.zIndex).map(renderObject)}

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
          <p className="text-gray-400 dark:text-gray-600 text-[14px]">Click toolbar to add text, images, or shapes</p>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-[10000]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
          <div
            className="fixed z-[10001] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {[
              { label: "Cut", shortcut: "Ctrl+X", action: () => { /* handled by keyboard */ } },
              { label: "Copy", shortcut: "Ctrl+C", action: () => { /* handled by keyboard */ } },
              { label: "Paste", shortcut: "Ctrl+V", action: () => { /* handled by keyboard */ } },
              { label: "---" },
              { label: "Duplicate", shortcut: "Ctrl+D", action: () => duplicateObj(contextMenu.objId) },
              { label: "Delete", shortcut: "Del", action: () => { onSelect(contextMenu.objId); setTimeout(deleteSelected, 0); } },
              { label: "---" },
              { label: "Bring to Front", action: () => bringToFront(contextMenu.objId) },
              { label: "Bring Forward", action: () => bringForward(contextMenu.objId) },
              { label: "Send Backward", action: () => sendBackward(contextMenu.objId) },
              { label: "Send to Back", action: () => sendToBack(contextMenu.objId) },
              { label: "---" },
              ...(objects.find(o => o.id === contextMenu.objId)?.type === "shape" ? [
                { label: "Edit Text", action: () => setEditingTextId(contextMenu.objId) },
                { label: "Change Colors", action: () => setShowColorPickerId(contextMenu.objId) },
              ] : []),
              ...(objects.find(o => o.id === contextMenu.objId)?.type === "image" ? [
                { label: "Crop Image", action: () => setCroppingId(contextMenu.objId) },
              ] : []),
              ...(objects.find(o => o.id === contextMenu.objId)?.type === "table" ? [
                { label: "Edit Cells", action: () => setEditingTextId(contextMenu.objId) },
                { label: "Table Style", action: () => setShowColorPickerId(contextMenu.objId) },
              ] : []),
            ].map((item, i) =>
              item.label === "---" ? (
                <div key={i} className="border-t border-gray-100 dark:border-gray-700 my-1" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.action?.(); setContextMenu(null); }}
                  className="w-full text-left px-3 py-1.5 text-[12px] text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-between cursor-pointer"
                >
                  <span>{item.label}</span>
                  {item.shortcut && <span className="text-[10px] text-gray-400 ml-4">{item.shortcut}</span>}
                </button>
              )
            )}
          </div>
        </>,
        document.body,
      )}
    </div>
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

  // Sync input when value changes externally
  useEffect(() => { setInputVal(String(value)); }, [value]);

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
      <div className="flex items-center h-[30px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-700 dark:to-gray-700/50 overflow-hidden">
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
          className="w-[36px] h-full px-1 bg-transparent text-[12px] font-semibold text-gray-700 dark:text-white text-center outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full px-1 flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
        >
          <svg viewBox="0 0 10 6" className={`w-2.5 h-2.5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1,1 5,5 9,1" /></svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 min-w-full w-fit bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[10000] py-1 max-h-[200px] overflow-y-auto">
          {FONT_SIZES.map(s => (
            <button key={s} type="button"
              onClick={() => { onChange(s); setInputVal(String(s)); setIsOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                value === s ? "bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Position the cell toolbar above the TABLE object (not above the cell)
  useEffect(() => {
    if (!editingCell || !canvasRef?.current || !objId) { setToolbarPos(null); return; }
    const objEl = canvasRef.current.querySelector(`[data-slide-obj="${objId}"]`) as HTMLElement;
    if (!objEl) return;
    const objRect = objEl.getBoundingClientRect();
    const toolbarW = 420;
    const toolbarH = 44;
    let top = objRect.top - toolbarH - 8;
    let left = objRect.left + objRect.width / 2 - toolbarW / 2;
    // If no room above, place below the table
    if (top < 8) top = objRect.bottom + 8;
    left = Math.max(8, Math.min(window.innerWidth - toolbarW - 8, left));
    setToolbarPos({ top, left });
  }, [editingCell, canvasRef, objId]);

  const activeCell = editingCell ? obj.cells[editingCell.r]?.[editingCell.c] : null;

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

  // Drag row border to resize
  const startRowResize = useCallback((e: React.MouseEvent, rowIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const tableH = containerEl.getBoundingClientRect().height;
    const startHeights = [...rowHeightsRef.current];
    const handleMove = (ev: MouseEvent) => {
      const dy = ev.clientY - startY;
      const pctChange = (dy / tableH) * 100;
      const newHeights = [...startHeights];
      const minH = 5;
      newHeights[rowIdx] = Math.max(minH, startHeights[rowIdx] + pctChange);
      newHeights[rowIdx + 1] = Math.max(minH, startHeights[rowIdx + 1] - pctChange);
      onUpdateTableRef.current?.({ rowHeights: newHeights });
    };
    const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative" onMouseDown={(e) => { if (isEditing) e.stopPropagation(); }}>
      <table
        className="w-full h-full"
        style={{ borderCollapse: "collapse", fontSize: obj.fontSize, fontFamily: obj.fontFamily, tableLayout: "fixed" }}
      >
        {/* Colgroup for column widths */}
        <colgroup>
          {colWidths.map((w, ci) => <col key={ci} style={{ width: `${w}%` }} />)}
        </colgroup>
        <tbody>
          {obj.cells.map((row, ri) => (
            <tr key={ri} style={{ height: `${rowHeights[ri]}%` }}>
              {row.map((cell, ci) => {
                const isHeader = obj.headerRow && ri === 0;
                const bgColor = isHeader ? obj.headerColor : ri % 2 === 0 ? obj.evenRowColor : obj.oddRowColor;
                const resolvedBg = cell.backgroundColor || bgColor;
                const textColor = isHeader && obj.headerColor !== "transparent" ? "#ffffff" : (cell.color || "#1f2937");
                const isCellEditing = isEditing && editingCell?.r === ri && editingCell?.c === ci;

                return (
                  <td
                    key={ci}
                    className={`relative ${isCellEditing ? "outline outline-2 outline-blue-500 outline-offset-[-1px] z-10" : ""}`}
                    style={{
                      border: `${obj.borderWidth}px solid ${obj.borderColor}`,
                      padding: obj.cellPadding,
                      backgroundColor: resolvedBg,
                      color: textColor,
                      fontWeight: isHeader || cell.bold ? 700 : 400,
                      fontStyle: cell.italic ? "italic" : "normal",
                      textAlign: cell.align || (isHeader ? "center" : "left"),
                      verticalAlign: cell.verticalAlign || "middle",
                      overflow: cell.noWrap ? "hidden" : "visible",
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
                        className="outline-none min-h-[1em] w-full"
                        style={{ color: textColor }}
                        onBlur={(e) => {
                          onCellChange(ri, ci, e.currentTarget.textContent || "");
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Tab") {
                            e.preventDefault();
                            onCellChange(ri, ci, (e.target as HTMLElement).textContent || "");
                            const nextC = ci + 1 < obj.cols ? ci + 1 : 0;
                            const nextR = ci + 1 < obj.cols ? ri : ri + 1 < obj.rows ? ri + 1 : 0;
                            setEditingCell({ r: nextR, c: nextC });
                          }
                          if (e.key === "Escape") { setEditingCell(null); onStopEditing(); }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onCellChange(ri, ci, (e.target as HTMLElement).textContent || "");
                            if (ri + 1 < obj.rows) setEditingCell({ r: ri + 1, c: ci });
                            else setEditingCell(null);
                          }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        dangerouslySetInnerHTML={{ __html: cell.content || "" }}
                        ref={(el) => {
                          if (el && !el.dataset.focused) {
                            el.dataset.focused = "1";
                            setTimeout(() => el.focus(), 0);
                          }
                        }}
                      />
                    ) : (
                      <span className={`block ${cell.noWrap ? "truncate whitespace-nowrap" : "whitespace-pre-wrap break-words"}`}>{cell.content || (isEditing ? "\u00A0" : "")}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Column resize handles — draggable borders between columns */}
      {(isSelected || isEditing) && canEdit && onUpdateTable && (() => {
        let accW = 0;
        return colWidths.slice(0, -1).map((w, ci) => {
          accW += w;
          return (
            <div
              key={`col-${ci}`}
              className="absolute top-0 bottom-0 z-[30] cursor-col-resize group"
              style={{ left: `${accW}%`, width: 12, marginLeft: -6, pointerEvents: "auto" }}
              onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startColResize(e, ci); }}
            >
              <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-blue-400/40 group-hover:bg-blue-500 transition-colors" />
            </div>
          );
        });
      })()}

      {/* Row resize handles — draggable borders between rows AND bottom edge */}
      {(isSelected || isEditing) && canEdit && onUpdateTable && (() => {
        const handles: React.ReactNode[] = [];
        let accH = 0;
        // Between rows
        rowHeights.slice(0, -1).forEach((h, ri) => {
          accH += h;
          handles.push(
            <div
              key={`row-${ri}`}
              className="absolute left-0 right-0 z-[30] cursor-row-resize group"
              style={{ top: `${accH}%`, height: 12, marginTop: -6, pointerEvents: "auto" }}
              onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startRowResize(e, ri); }}
            >
              <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-blue-400/40 group-hover:bg-blue-500 transition-colors" />
            </div>
          );
        });
        // Bottom edge — resize last row by changing table height
        handles.push(
          <div
            key="row-bottom"
            className="absolute left-0 right-0 z-[30] cursor-row-resize group"
            style={{ bottom: 0, height: 12, marginBottom: -6, pointerEvents: "auto" }}
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
              const startObjH = parseFloat(objEl.style.height); // percentage
              const handleMove = (ev: MouseEvent) => {
                const dy = ev.clientY - startY;
                const pctChange = (dy / canvasH) * 100;
                const newH = Math.max(5, startObjH + pctChange);
                onUpdateTableRef.current?.({ height: newH } as any);
              };
              const handleUp = () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          >
            <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-blue-400/40 group-hover:bg-blue-500 transition-colors" />
          </div>
        );
        return handles;
      })()}

      {/* Cell formatting toolbar — floating above the table, only when a cell is active */}
      {editingCell && activeCell && toolbarPos && onCellUpdate && typeof document !== "undefined" && createPortal(
        <div
          data-cell-toolbar
          className="fixed z-[10002] rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 px-2 py-1.5">
            {/* Font family */}
            <CustomDropdown
              value={activeCell.fontFamily || obj.fontFamily}
              options={[
                { label: "Inter", value: "Inter, sans-serif" },
                { label: "Arial", value: "Arial, sans-serif" },
                { label: "Arial Black", value: "Arial Black, sans-serif" },
                { label: "Calibri", value: "Calibri, sans-serif" },
                { label: "Cambria", value: "Cambria, serif" },
                { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
                { label: "Consolas", value: "Consolas, monospace" },
                { label: "Courier New", value: "Courier New, monospace" },
                { label: "Garamond", value: "Garamond, serif" },
                { label: "Georgia", value: "Georgia, serif" },
                { label: "Impact", value: "Impact, sans-serif" },
                { label: "Lucida Console", value: "Lucida Console, monospace" },
                { label: "Palatino", value: "Palatino Linotype, serif" },
                { label: "Segoe UI", value: "Segoe UI, sans-serif" },
                { label: "Tahoma", value: "Tahoma, sans-serif" },
                { label: "Times New Roman", value: "Times New Roman, serif" },
                { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
                { label: "Verdana", value: "Verdana, sans-serif" },
              ]}
              onChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { fontFamily: String(v) })}
              className="w-[130px]"
            />

            {/* Font size — typeable + dropdown */}
            <FontSizeCombo
              value={activeCell.fontSize || obj.fontSize}
              onChange={(v) => onCellUpdate(editingCell.r, editingCell.c, { fontSize: v })}
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Bold */}
            <button onClick={() => onCellUpdate(editingCell.r, editingCell.c, { bold: !activeCell.bold })}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold cursor-pointer transition-all ${activeCell.bold ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              title="Bold">B</button>

            {/* Italic */}
            <button onClick={() => onCellUpdate(editingCell.r, editingCell.c, { italic: !activeCell.italic })}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] italic cursor-pointer transition-all ${activeCell.italic ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              title="Italic">I</button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Alignment */}
            {(["left", "center", "right"] as const).map(a => (
              <button key={a} onClick={() => onCellUpdate(editingCell.r, editingCell.c, { align: a })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${(activeCell.align || "left") === a ? "bg-blue-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                title={`Align ${a}`}>
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {a === "left" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="10" y2="8"/><line x1="1" y1="12" x2="13" y2="12"/></>}
                  {a === "center" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="3.5" y1="8" x2="12.5" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></>}
                  {a === "right" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="6" y1="8" x2="15" y2="8"/><line x1="3" y1="12" x2="15" y2="12"/></>}
                </svg>
              </button>
            ))}

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Wrap toggle */}
            <button onClick={() => onCellUpdate(editingCell.r, editingCell.c, { noWrap: !activeCell.noWrap })}
              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${!activeCell.noWrap ? "bg-blue-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              title={activeCell.noWrap ? "Enable wrap" : "Wrap on"}>
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="11" y2="8"/><path d="M11 8 C14 8 14 12 11 12 L6 12" /><polyline points="8,10 6,12 8,14" />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Vertical alignment — top, middle, bottom */}
            {(["top", "middle", "bottom"] as const).map(va => (
              <button key={va} onClick={() => onCellUpdate(editingCell.r, editingCell.c, { verticalAlign: va })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${(activeCell.verticalAlign || "middle") === va ? "bg-blue-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                title={`Align ${va}`}>
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {va === "top" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="9" y2="8"/><path d="M8 12 L8 10 M6 12 L8 10 L10 12" strokeWidth="1.2" /></>}
                  {va === "middle" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="6.5" x2="11" y2="6.5"/><line x1="5" y1="9.5" x2="9" y2="9.5"/></>}
                  {va === "bottom" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="8" x2="9" y2="8"/><line x1="5" y1="11" x2="11" y2="11"/><path d="M8 4 L8 6 M6 4 L8 6 L10 4" strokeWidth="1.2" /></>}
                </svg>
              </button>
            ))}

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Text color — using ColorPickerPopover */}
            <ColorPickerPopover
              selectedColor={activeCell.color || "#1f2937"}
              onSelect={(c) => onCellUpdate(editingCell.r, editingCell.c, { color: c })}
              mode="text"
              label="Text Color"
              align="right"
              width={180}
            >
              <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 relative" title="Text color">
                <span className="text-[13px] font-bold" style={{ color: activeCell.color || "#1f2937" }}>A</span>
                <div className="absolute bottom-1 left-2 right-2 h-[2.5px] rounded-full" style={{ backgroundColor: activeCell.color || "#1f2937" }} />
              </button>
            </ColorPickerPopover>

            {/* Cell fill — using ColorPickerPopover */}
            <ColorPickerPopover
              selectedColor={activeCell.backgroundColor || "#ffffff"}
              onSelect={(c) => onCellUpdate(editingCell.r, editingCell.c, { backgroundColor: c })}
              mode="solid"
              label="Cell Fill"
              align="right"
              width={200}
            >
              <button className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" title="Cell fill">
                <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: activeCell.backgroundColor || "#fff" }} />
              </button>
            </ColorPickerPopover>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Close button */}
            <button
              onClick={() => { setEditingCell(null); onStopEditing(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Close toolbar (Esc)"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        </div>,
        document.body,
      )}
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
      className="fixed z-[10001] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden"
      style={{ top: pos.top, left: pos.left, width: 280, backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header — shape preview + opacity */}
      <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden" style={{ backgroundColor: obj.fill || "#3b82f6" }}>
            <svg viewBox="0 0 100 100" className="w-7 h-7" style={{ color: "#fff" }}>
              <g dangerouslySetInnerHTML={{ __html: SHAPE_DEFS[obj.shape]?.svg.replace(/fill="currentColor"/g, 'fill="white"').replace(/stroke="currentColor"/g, 'stroke="white"') || "" }} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate">
              {SHAPE_DEFS[obj.shape]?.label || "Shape"}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">Opacity</span>
              <input
                type="range" min={0} max={100} step={5}
                value={Math.round((obj.opacity ?? 1) * 100)}
                onChange={(e) => updateObj(obj.id, { opacity: Number(e.target.value) / 100 } as Partial<ShapeObject>)}
                className="flex-1 h-1 accent-blue-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 w-8 text-right">{Math.round((obj.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-3 gap-0.5 border-b border-gray-100 dark:border-gray-800">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-[11px] font-medium transition-all cursor-pointer relative ${
              tab === t.key
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Color</div>
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
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Weight</div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 6, 8].map(w => (
                  <button
                    key={w}
                    onClick={() => updateObj(obj.id, { strokeWidth: w, stroke: w === 0 ? "transparent" : (obj.stroke === "transparent" ? "#1a1a2e" : obj.stroke) } as Partial<ShapeObject>)}
                    className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      obj.strokeWidth === w
                        ? "bg-blue-50 dark:bg-blue-900/30 ring-1.5 ring-blue-400"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Style</div>
              <div className="flex gap-1">
                {[
                  { label: "Solid", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" /> },
                  { label: "Dashed", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" /> },
                  { label: "Dotted", svg: <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="1.5 2.5" strokeLinecap="round" /> },
                ].map((s, i) => (
                  <button
                    key={i}
                    className="flex-1 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    title={s.label}
                  >
                    <svg viewBox="0 0 32 20" className="w-6 h-4 text-gray-500 dark:text-gray-400">{s.svg}</svg>
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
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Color</div>
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
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Size</div>
              <div className="flex gap-1">
                {[8, 10, 12, 14, 18, 24, 32, 48].map(s => (
                  <button
                    key={s}
                    onClick={() => updateObj(obj.id, { textSize: s } as Partial<ShapeObject>)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                      (obj.textSize || 14) === s
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
              <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-[10px] text-gray-400">T</span>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Double-click shape to type text</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// TableColorToolbar — Table formatting panel
// ══════════════════════════════════════════════════

function TableColorToolbar({ obj, updateObj, canvasRef }: {
  obj: TableObject;
  updateObj: (id: string, updates: Partial<SlideObject>) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [section, setSection] = useState<"style" | "border" | "rows">("style");

  useEffect(() => {
    const el = canvasRef.current?.querySelector(`[data-slide-obj="${obj.id}"]`) as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = 280, h = 340;
    let top = rect.top;
    let left = rect.right + 12;
    if (left + w > window.innerWidth - 8) left = rect.left - w - 12;
    if (left < 8) left = 8;
    if (top + h > window.innerHeight - 8) top = window.innerHeight - h - 8;
    if (top < 8) top = 8;
    setPos({ top, left });
  }, [obj.id, obj.x, obj.y, obj.width, obj.height, canvasRef]);

  const TABLE_THEMES = [
    { name: "Blue", header: "#3b82f6", even: "#ffffff", odd: "#eff6ff" },
    { name: "Green", header: "#22c55e", even: "#ffffff", odd: "#f0fdf4" },
    { name: "Red", header: "#ef4444", even: "#ffffff", odd: "#fef2f2" },
    { name: "Purple", header: "#8b5cf6", even: "#ffffff", odd: "#faf5ff" },
    { name: "Orange", header: "#f97316", even: "#ffffff", odd: "#fff7ed" },
    { name: "Teal", header: "#14b8a6", even: "#ffffff", odd: "#f0fdfa" },
    { name: "Dark", header: "#1f2937", even: "#f9fafb", odd: "#e5e7eb" },
    { name: "Rose", header: "#ec4899", even: "#ffffff", odd: "#fdf2f8" },
  ];

  return (
    <div
      className="fixed z-[10001] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden"
      style={{ top: pos.top, left: pos.left, width: 280, backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-gray-500"><rect x="2" y="2" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="2" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1" /><line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1" /><line x1="9" y1="7" x2="9" y2="18" stroke="currentColor" strokeWidth="1" /></svg>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">Table {obj.rows} × {obj.cols}</div>
            <div className="text-[9px] text-gray-400">Double-click to edit cells</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-3 gap-0.5 border-b border-gray-100 dark:border-gray-800">
        {([["style", "◼ Style"], ["border", "◻ Border"], ["rows", "≡ Rows"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key as typeof section)}
            className={`flex-1 py-2 text-[11px] font-medium transition-all cursor-pointer relative ${
              section === key ? "text-blue-600 dark:text-blue-400" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
            {section === key && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-3 py-3 max-h-[260px] overflow-y-auto">
        {section === "style" && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quick Themes</div>
            <div className="grid grid-cols-4 gap-1.5">
              {TABLE_THEMES.map(t => (
                <button
                  key={t.name}
                  onClick={() => updateObj(obj.id, { headerColor: t.header, evenRowColor: t.even, oddRowColor: t.odd } as Partial<TableObject>)}
                  className={`rounded-lg p-1 cursor-pointer transition-all hover:scale-105 border ${
                    obj.headerColor === t.header ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200 dark:border-gray-700"
                  }`}
                  title={t.name}
                >
                  <div className="rounded overflow-hidden">
                    <div className="h-2.5" style={{ backgroundColor: t.header }} />
                    <div className="h-2" style={{ backgroundColor: t.even }} />
                    <div className="h-2" style={{ backgroundColor: t.odd }} />
                    <div className="h-2" style={{ backgroundColor: t.even }} />
                  </div>
                  <div className="text-[8px] text-gray-500 mt-0.5 text-center">{t.name}</div>
                </button>
              ))}
            </div>

            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-1.5">Header Color</div>
            <ColorGrid
              colors={SOLID_COLORS.slice(0, 18)}
              selectedColor={obj.headerColor}
              onSelect={(c) => updateObj(obj.id, { headerColor: c } as Partial<TableObject>)}
              columns={6}
              swatchSize="sm"
              showCustomHex
            />

            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={obj.headerRow}
                  onChange={(e) => updateObj(obj.id, { headerRow: e.target.checked } as Partial<TableObject>)}
                  className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-[11px] text-gray-600 dark:text-gray-400">Header row</span>
              </label>
            </div>
          </div>
        )}

        {section === "border" && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Border Color</div>
            <ColorGrid
              colors={BORDER_COLORS.slice(0, 24)}
              selectedColor={obj.borderColor}
              onSelect={(c) => updateObj(obj.id, { borderColor: c } as Partial<TableObject>)}
              columns={8}
              swatchSize="sm"
              showCustomHex
            />

            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-1.5">Border Width</div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(w => (
                <button key={w}
                  onClick={() => updateObj(obj.id, { borderWidth: w } as Partial<TableObject>)}
                  className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    obj.borderWidth === w ? "bg-blue-50 dark:bg-blue-900/30 ring-1.5 ring-blue-400" : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                  }`}
                  title={w === 0 ? "None" : `${w}px`}
                >
                  {w === 0 ? <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400"><line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    : <div style={{ width: 18, height: Math.max(1, w), backgroundColor: obj.borderColor, borderRadius: 1 }} />}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-1.5">Cell Padding</div>
            <div className="flex items-center gap-2">
              <input type="range" min={2} max={16} value={obj.cellPadding} onChange={(e) => updateObj(obj.id, { cellPadding: Number(e.target.value) } as Partial<TableObject>)} className="flex-1 h-1 accent-blue-500 cursor-pointer" />
              <span className="text-[10px] font-mono text-gray-500 w-6 text-right">{obj.cellPadding}px</span>
            </div>

            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-1.5">Font Size</div>
            <div className="flex gap-1">
              {[8, 10, 12, 14, 16, 18, 20].map(s => (
                <button key={s}
                  onClick={() => updateObj(obj.id, { fontSize: s } as Partial<TableObject>)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition-all ${
                    obj.fontSize === s ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 ring-1 ring-blue-200" : "text-gray-500 hover:bg-gray-50 border border-gray-100 dark:border-gray-800"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {section === "rows" && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Add / Remove</div>
            <div className="flex gap-2">
              <button onClick={() => {
                const newCells = [...obj.cells, Array.from({ length: obj.cols }, () => ({ content: "" }))];
                updateObj(obj.id, { rows: obj.rows + 1, cells: newCells, height: obj.height + 6 } as Partial<TableObject>);
              }} className="flex-1 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[11px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">+ Row</button>
              <button onClick={() => {
                const newCells = obj.cells.map(row => [...row, { content: "" }]);
                updateObj(obj.id, { cols: obj.cols + 1, cells: newCells } as Partial<TableObject>);
              }} className="flex-1 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[11px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">+ Column</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                if (obj.rows <= 1) return;
                const newCells = obj.cells.slice(0, -1);
                updateObj(obj.id, { rows: obj.rows - 1, cells: newCells, height: Math.max(10, obj.height - 6) } as Partial<TableObject>);
              }} className={`flex-1 py-2 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${obj.rows <= 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"}`}>- Row</button>
              <button onClick={() => {
                if (obj.cols <= 1) return;
                const newCells = obj.cells.map(row => row.slice(0, -1));
                updateObj(obj.id, { cols: obj.cols - 1, cells: newCells } as Partial<TableObject>);
              }} className={`flex-1 py-2 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${obj.cols <= 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"}`}>- Column</button>
            </div>

            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-1.5">Row Colors</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-12">Even</span>
                <div className="flex gap-1 flex-1">
                  {["#ffffff", "#f9fafb", "#f3f4f6", "#eff6ff", "#f0fdf4", "#fef2f2", "#faf5ff", "#fff7ed"].map(c => (
                    <button key={c} onClick={() => updateObj(obj.id, { evenRowColor: c } as Partial<TableObject>)}
                      className={`w-6 h-6 rounded-md border cursor-pointer hover:scale-110 transition-transform ${obj.evenRowColor === c ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-200"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-12">Odd</span>
                <div className="flex gap-1 flex-1">
                  {["#f9fafb", "#f3f4f6", "#e5e7eb", "#dbeafe", "#dcfce7", "#fee2e2", "#ede9fe", "#ffedd5"].map(c => (
                    <button key={c} onClick={() => updateObj(obj.id, { oddRowColor: c } as Partial<TableObject>)}
                      className={`w-6 h-6 rounded-md border cursor-pointer hover:scale-110 transition-transform ${obj.oddRowColor === c ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-200"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
