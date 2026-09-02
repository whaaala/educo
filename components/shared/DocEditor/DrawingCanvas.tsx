"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  X, Check, Minus, ArrowRight, Square, Circle, Type, ImagePlus,
  RotateCw, Trash2, MousePointer2, Pentagon,
} from "lucide-react";

type ShapeType = "select" | "line" | "arrow" | "rect" | "ellipse" | "polygon" | "text" | "image";
interface Shape {
  id: string;
  type: ShapeType;
  x: number; y: number; w: number; h: number;
  rotation: number;
  fill: string; stroke: string; strokeWidth: number;
  text?: string;
  points?: { x: number; y: number }[];
  imgSrc?: string;
}

const TOOLS: { type: ShapeType; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { type: "select", Icon: MousePointer2, label: "Select" },
  { type: "line", Icon: Minus, label: "Line" },
  { type: "arrow", Icon: ArrowRight, label: "Arrow" },
  { type: "rect", Icon: Square, label: "Rectangle" },
  { type: "ellipse", Icon: Circle, label: "Ellipse" },
  { type: "polygon", Icon: Pentagon, label: "Polygon" },
  { type: "text", Icon: Type, label: "Text Box" },
  { type: "image", Icon: ImagePlus, label: "Image" },
];

function genId() { return `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

export default function DrawingCanvas({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [activeTool, setActiveTool] = useState<ShapeType>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState("#4f46e5");
  const [strokeColor, setStrokeColor] = useState("#1e1b4b");
  const [isDrawing, setIsDrawing] = useState(false);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const [pendingShape, setPendingShape] = useState<Shape | null>(null);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CANVAS_W = 800;
  const CANVAS_H = 500;

  // Draw all shapes to canvas
  const drawAll = useCallback((ctx: CanvasRenderingContext2D, shapeList: Shape[], pending: Shape | null) => {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const allShapes = pending ? [...shapeList, pending] : shapeList;
    for (const s of allShapes) {
      ctx.save();
      ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
      ctx.rotate((s.rotation * Math.PI) / 180);
      ctx.translate(-(s.x + s.w / 2), -(s.y + s.h / 2));

      ctx.fillStyle = s.fill;
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = s.strokeWidth;

      if (s.type === "rect") {
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.strokeRect(s.x, s.y, s.w, s.h);
      } else if (s.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(s.x + s.w / 2, s.y + s.h / 2, Math.abs(s.w / 2), Math.abs(s.h / 2), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (s.type === "line" || s.type === "arrow") {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.w, s.y + s.h);
        ctx.stroke();
        if (s.type === "arrow") {
          const angle = Math.atan2(s.h, s.w);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(s.x + s.w, s.y + s.h);
          ctx.lineTo(s.x + s.w - headLen * Math.cos(angle - Math.PI / 6), s.y + s.h - headLen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(s.x + s.w, s.y + s.h);
          ctx.lineTo(s.x + s.w - headLen * Math.cos(angle + Math.PI / 6), s.y + s.h - headLen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      } else if (s.type === "polygon") {
        const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
        const rx = Math.abs(s.w / 2), ry = Math.abs(s.h / 2);
        const sides = 6;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
          const px = cx + rx * Math.cos(a);
          const py = cy + ry * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (s.type === "text") {
        ctx.fillStyle = s.stroke;
        ctx.font = "16px Inter, Arial, sans-serif";
        ctx.textBaseline = "top";
        const lines = (s.text || "Text").split("\n");
        lines.forEach((line, i) => ctx.fillText(line, s.x + 4, s.y + 4 + i * 20));
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(s.x, s.y, s.w, s.h);
        ctx.setLineDash([]);
      } else if (s.type === "image" && s.imgSrc) {
        // Image drawn in a separate effect
      }
      ctx.restore();

      // Selection highlight with 8-point handles
      if (s.id === selectedId) {
        ctx.save();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(s.x - 2, s.y - 2, s.w + 4, s.h + 4);
        ctx.setLineDash([]);

        // 8 resize handles
        const hSize = 6;
        const handles = [
          { x: s.x, y: s.y }, { x: s.x + s.w / 2, y: s.y }, { x: s.x + s.w, y: s.y },
          { x: s.x + s.w, y: s.y + s.h / 2 },
          { x: s.x + s.w, y: s.y + s.h }, { x: s.x + s.w / 2, y: s.y + s.h }, { x: s.x, y: s.y + s.h },
          { x: s.x, y: s.y + s.h / 2 },
        ];
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 1.5;
        handles.forEach(h => {
          ctx.fillRect(h.x - hSize / 2, h.y - hSize / 2, hSize, hSize);
          ctx.strokeRect(h.x - hSize / 2, h.y - hSize / 2, hSize, hSize);
        });

        // Rotation handle (top)
        const rotX = s.x + s.w / 2;
        const rotY = s.y - 24;
        ctx.beginPath();
        ctx.moveTo(rotX, s.y);
        ctx.lineTo(rotX, rotY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rotX, rotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
        ctx.restore();
      }
    }
  }, [selectedId]);

  // Re-render on shape changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawAll(ctx, shapes, pendingShape);
  }, [shapes, pendingShape, selectedId, drawAll]);

  // Draw images (loaded asynchronously)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    shapes.filter(s => s.type === "image" && s.imgSrc).forEach(s => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.drawImage(img, -s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
      };
      img.src = s.imgSrc!;
    });
  }, [shapes]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const hitTest = (x: number, y: number): Shape | null => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      const sx = Math.min(s.x, s.x + s.w), sy = Math.min(s.y, s.y + s.h);
      const sw = Math.abs(s.w), sh = Math.abs(s.h);
      if (x >= sx - 4 && x <= sx + sw + 4 && y >= sy - 4 && y <= sy + sh + 4) return s;
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoords(e);

    if (activeTool === "select") {
      const hit = hitTest(x, y);
      if (hit) {
        setSelectedId(hit.id);
        setDragOffset({ dx: x - hit.x, dy: y - hit.y });
      } else {
        setSelectedId(null);
      }
      return;
    }

    if (activeTool === "image") {
      fileInputRef.current?.click();
      return;
    }

    setIsDrawing(true);
    drawStart.current = { x, y };

    const base: Shape = {
      id: genId(), type: activeTool, x, y, w: 0, h: 0,
      rotation: 0, fill: fillColor, stroke: strokeColor, strokeWidth: 2,
    };
    if (activeTool === "text") {
      base.text = "Text";
      base.w = 120;
      base.h = 30;
      base.fill = "transparent";
    }
    setPendingShape(base);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoords(e);

    // Dragging a selected shape
    if (activeTool === "select" && dragOffset && selectedId) {
      setShapes(prev => prev.map(s =>
        s.id === selectedId ? { ...s, x: x - dragOffset.dx, y: y - dragOffset.dy } : s
      ));
      return;
    }

    if (!isDrawing || !drawStart.current || !pendingShape) return;
    const dx = x - drawStart.current.x;
    const dy = y - drawStart.current.y;
    setPendingShape({ ...pendingShape, w: dx, h: dy });
  };

  const onMouseUp = () => {
    if (dragOffset) { setDragOffset(null); return; }
    if (!isDrawing || !pendingShape) return;
    setIsDrawing(false);
    drawStart.current = null;

    // Only add shapes with meaningful size (or text boxes)
    if (Math.abs(pendingShape.w) > 3 || Math.abs(pendingShape.h) > 3 || pendingShape.type === "text") {
      const normalized = { ...pendingShape };
      if (normalized.w < 0) { normalized.x += normalized.w; normalized.w = Math.abs(normalized.w); }
      if (normalized.h < 0) { normalized.y += normalized.h; normalized.h = Math.abs(normalized.h); }
      setShapes(prev => [...prev, normalized]);
      setSelectedId(normalized.id);
      if (normalized.type === "text") setEditingTextId(normalized.id);
    }
    setPendingShape(null);
    setActiveTool("select");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const w = Math.min(300, img.width);
        const h = w / aspectRatio;
        const shape: Shape = {
          id: genId(), type: "image", x: 50, y: 50, w, h,
          rotation: 0, fill: "transparent", stroke: "transparent", strokeWidth: 0,
          imgSrc: src,
        };
        setShapes(prev => [...prev, shape]);
        setSelectedId(shape.id);
        setActiveTool("select");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes(prev => prev.filter(s => s.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setShapes(prev => prev.map(s =>
      s.id === selectedId ? { ...s, rotation: (s.rotation + 15) % 360 } : s
    ));
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Re-draw at 2x for high-resolution export
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = CANVAS_W * 2;
    exportCanvas.height = CANVAS_H * 2;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    drawAll(ctx, shapes, null);
    // Draw images synchronously from already-loaded sources
    const imgShapes = shapes.filter(s => s.type === "image" && s.imgSrc);
    let remaining = imgShapes.length;
    if (remaining === 0) {
      onSave(exportCanvas.toDataURL("image/png"));
      return;
    }
    imgShapes.forEach(s => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.drawImage(img, -s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
        remaining--;
        if (remaining === 0) onSave(exportCanvas.toDataURL("image/png"));
      };
      img.src = s.imgSrc!;
    });
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div
        ref={containerRef}
        className="bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden"
        style={{ width: CANVAS_W + 48, maxWidth: "95vw", maxHeight: "95vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Drawing</span>
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Save and Close
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex-wrap">
          {TOOLS.map(tool => (
            <button
              key={tool.type}
              onClick={() => setActiveTool(tool.type)}
              title={tool.label}
              className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer ${activeTool === tool.type ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-400" : "text-muted hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}
            >
              <tool.Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-6 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] mx-1" />
          <label className="flex items-center gap-1 text-[10px] text-muted cursor-pointer" title="Fill color">
            Fill
            <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-5 h-5 border-0 p-0 rounded cursor-pointer" />
          </label>
          <label className="flex items-center gap-1 text-[10px] text-muted cursor-pointer" title="Stroke color">
            Stroke
            <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-5 h-5 border-0 p-0 rounded cursor-pointer" />
          </label>
          <div className="w-px h-6 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] mx-1" />
          <button onClick={rotateSelected} disabled={!selectedId} title="Rotate 15°" className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 disabled:opacity-30 cursor-pointer transition-colors">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={deleteSelected} disabled={!selectedId} title="Delete" className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 disabled:opacity-30 cursor-pointer transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-start justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="bg-white rounded-lg shadow-md cursor-crosshair"
            style={{ imageRendering: "auto" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
          {/* Hidden file input for image upload */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {/* Inline text editing overlay */}
          {editingTextId && (() => {
            const shape = shapes.find(s => s.id === editingTextId);
            if (!shape) return null;
            const canvas = canvasRef.current;
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return (
              <textarea
                autoFocus
                className="fixed z-[510] border-2 border-indigo-400 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 resize-none outline-none p-1 text-[16px] font-sans rounded"
                style={{ top: rect.top + shape.y, left: rect.left + shape.x, width: shape.w, minHeight: shape.h }}
                defaultValue={shape.text || ""}
                onBlur={(e) => {
                  const val = e.target.value;
                  setShapes(prev => prev.map(s => s.id === editingTextId ? { ...s, text: val } : s));
                  setEditingTextId(null);
                }}
                onKeyDown={(e) => { if (e.key === "Escape") setEditingTextId(null); }}
              />
            );
          })()}
        </div>

        {/* Footer status */}
        <div className="px-4 py-1.5 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 flex items-center justify-between">
          <span>{shapes.length} shape{shapes.length !== 1 ? "s" : ""} · {CANVAS_W}×{CANVAS_H}</span>
          <span className="italic">Click &amp; drag to draw · Shift+click to multi-select</span>
        </div>
      </div>
    </div>
  );
}
