"use client";

/**
 * SlideCanvas — Canvas-based slide editor with draggable, resizable objects.
 * Supports: TextBox, Image, Shape, Drawing objects.
 * Snap-to-grid and snap-to-guides when dragging.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import type { SlideObject, TextBoxObject, ImageObject, ShapeObject, DrawingObject } from "@/lib/slide-storage";

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
  shape: ShapeObject["shape"]; fill: string; stroke: string; strokeWidth: number;
  text?: string; textColor?: string; textSize?: number;
}) {
  const common = { fill, stroke, strokeWidth: strokeWidth || 0 };
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      {shape === "rect" && <rect x={strokeWidth/2} y={strokeWidth/2} width={100-strokeWidth} height={100-strokeWidth} rx="4" {...common} />}
      {shape === "circle" && <ellipse cx="50" cy="50" rx={50-strokeWidth/2} ry={50-strokeWidth/2} {...common} />}
      {shape === "triangle" && <polygon points="50,5 95,95 5,95" {...common} />}
      {shape === "star" && <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" {...common} />}
      {shape === "arrow-right" && <polygon points="10,30 65,30 65,10 90,50 65,90 65,70 10,70" {...common} />}
      {shape === "arrow-down" && <polygon points="30,10 70,10 70,65 90,65 50,90 10,65 30,65" {...common} />}
      {shape === "line-h" && <line x1="0" y1="50" x2="100" y2="50" stroke={fill} strokeWidth={Math.max(strokeWidth, 2)} />}
      {shape === "line-v" && <line x1="50" y1="0" x2="50" y2="100" stroke={fill} strokeWidth={Math.max(strokeWidth, 2)} />}
      {shape === "line-diag" && <line x1="0" y1="0" x2="100" y2="100" stroke={fill} strokeWidth={Math.max(strokeWidth, 2)} />}
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
  const base: React.CSSProperties = { position: "absolute", width: s, height: s, background: "#fff", border: "2px solid #3b82f6", borderRadius: 2, zIndex: 10 };
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
  const [drawingPath, setDrawingPath] = useState<string>("");
  const isDrawing = useRef(false);

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

  // Keyboard handler
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e: KeyboardEvent) => {
      if (editingTextId) return; // Don't handle keys while editing text
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) { e.preventDefault(); deleteSelected(); }
      if (e.key === "Escape") { onSelect(null); setEditingTextId(null); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [canEdit, selectedId, editingTextId, deleteSelected, onSelect]);

  // ── Drag handler ──
  const startDrag = useCallback((e: React.MouseEvent, objId: string) => {
    if (!canEdit || drawingMode) return;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obj = objects.find(o => o.id === objId);
    if (!obj) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = obj.x, origY = obj.y, origW = obj.width, origH = obj.height;

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      let x = origX, y = origY, w = origW, h = origH;
      if (handle.includes("e")) w = Math.max(5, origW + dx);
      if (handle.includes("w")) { w = Math.max(5, origW - dx); x = origX + origW - w; }
      if (handle.includes("s")) h = Math.max(3, origH + dy);
      if (handle.includes("n")) { h = Math.max(3, origH - dy); y = origY + origH - h; }
      updateObj(objId, { x, y, width: w, height: h });
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, [canEdit, objects, updateObj]);

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
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-slide-obj]")) return;
    onSelect(null);
    setEditingTextId(null);
  }, [onSelect]);

  // ── Render single object ──
  const renderObject = (obj: SlideObject) => {
    const isSelected = selectedId === obj.id;
    const isEditing = editingTextId === obj.id;

    return (
      <div
        key={obj.id}
        data-slide-obj={obj.id}
        className={`absolute ${canEdit && !drawingMode ? "cursor-move" : ""} ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
        style={{
          left: `${obj.x}%`, top: `${obj.y}%`, width: `${obj.width}%`, height: `${obj.height}%`,
          zIndex: obj.zIndex, transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
        }}
        onMouseDown={(e) => {
          if (!canEdit || drawingMode) return;
          onSelect(obj.id);
          if (!isEditing) startDrag(e, obj.id);
        }}
        onDoubleClick={() => {
          if (obj.type === "textbox" && canEdit) setEditingTextId(obj.id);
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

        {obj.type === "image" && (
          <img
            src={obj.src} alt={obj.alt}
            className="w-full h-full pointer-events-none"
            style={{
              objectFit: obj.objectFit, borderRadius: obj.borderRadius ?? 0,
              opacity: obj.opacity ?? 1,
              border: obj.borderColor ? `${obj.borderWidth || 1}px solid ${obj.borderColor}` : "none",
            }}
          />
        )}

        {obj.type === "shape" && (
          <ShapeSVG shape={obj.shape} fill={obj.fill} stroke={obj.stroke} strokeWidth={obj.strokeWidth}
            text={obj.text} textColor={obj.textColor} textSize={obj.textSize} />
        )}

        {obj.type === "drawing" && (
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path d={obj.paths} fill="none" stroke={obj.stroke} strokeWidth={obj.strokeWidth}
              strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
              style={{ opacity: obj.opacity ?? 1 }} />
          </svg>
        )}

        {/* Resize handles */}
        {isSelected && canEdit && !isEditing && HANDLES.map(dir => (
          <div key={dir} style={getHandlePosition(dir)} onMouseDown={(e) => startResize(e, obj.id, dir)} />
        ))}
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
    </div>
  );
}
