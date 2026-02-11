"use client";

import { useRef, useEffect, useCallback } from "react";
import type { WhiteboardElement, WhiteboardTool, Point, Viewport } from "./whiteboard-types";
import { BBOX_SHAPE_TOOLS, LINE_TOOLS } from "./whiteboard-types";
import { drawElement, screenToCanvas, hitTest, generateId } from "./whiteboard-utils";

interface WhiteboardCanvasProps {
  elements: WhiteboardElement[];
  viewport: Viewport;
  activeTool: WhiteboardTool;
  activeColor: string;
  activeStrokeWidth: number;
  activeOpacity: number;
  activeFillColor: string | null;
  activeFontSize: number;
  activeStickyColor: string;
  readOnly?: boolean;
  onAddElement: (element: WhiteboardElement) => void;
  onUpdateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  onRemoveElement: (id: string) => void;
  onSelectElement: (id: string | null) => void;
  onViewportChange: (viewport: Viewport) => void;
  onTextEdit: (element: WhiteboardElement) => void;
}

export default function WhiteboardCanvas({
  elements,
  viewport,
  activeTool,
  activeColor,
  activeStrokeWidth,
  activeOpacity,
  activeFillColor,
  activeFontSize,
  activeStickyColor,
  readOnly = false,
  onAddElement,
  onUpdateElement,
  onRemoveElement,
  onSelectElement,
  onViewportChange,
  onTextEdit,
}: WhiteboardCanvasProps) {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const activeElement = useRef<WhiteboardElement | null>(null);
  const dragStart = useRef<Point | null>(null);
  const dragElementStart = useRef<{ x: number; y: number } | null>(null);
  const panStart = useRef<Point | null>(null);
  const lastPinchDist = useRef<number | null>(null);

  // Resize canvases to match container
  const resizeCanvases = useCallback(() => {
    const container = containerRef.current;
    const staticCanvas = staticCanvasRef.current;
    const activeCanvas = activeCanvasRef.current;
    if (!container || !staticCanvas || !activeCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = container.getBoundingClientRect();

    for (const canvas of [staticCanvas, activeCanvas]) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    }
  }, []);

  // Redraw static canvas
  const redrawStatic = useCallback(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dot grid
    drawDotGrid(ctx, viewport, canvas.width / dpr, canvas.height / dpr);

    // Draw all committed elements
    for (const el of elements) {
      drawElement(ctx, el, viewport);
    }
    ctx.restore();
  }, [elements, viewport]);

  // Clear active canvas
  const clearActive = useCallback(() => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.restore();
  }, []);

  // Draw active element preview
  const drawActivePreview = useCallback(() => {
    const canvas = activeCanvasRef.current;
    if (!canvas || !activeElement.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    drawElement(ctx, activeElement.current, viewport);
    ctx.restore();
  }, [viewport]);

  // Resize observer
  useEffect(() => {
    const handleResize = () => {
      resizeCanvases();
      redrawStatic();
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [resizeCanvases, redrawStatic]);

  // Redraw when elements or viewport change
  useEffect(() => {
    redrawStatic();
  }, [redrawStatic]);

  // Get canvas point from pointer event
  const getCanvasPoint = useCallback(
    (e: React.PointerEvent): Point => {
      const rect = containerRef.current!.getBoundingClientRect();
      return screenToCanvas(e.clientX, e.clientY, viewport, rect);
    },
    [viewport]
  );

  // Pointer down
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (readOnly) return;
      const canvas = activeCanvasRef.current;
      if (!canvas) return;

      // Middle click or two-finger = pan
      if (e.button === 1) {
        panStart.current = { x: e.clientX - viewport.x, y: e.clientY - viewport.y };
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      // Hand tool = pan with left click
      if (e.button === 0 && activeTool === "hand") {
        panStart.current = { x: e.clientX - viewport.x, y: e.clientY - viewport.y };
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      if (e.button !== 0) return;
      canvas.setPointerCapture(e.pointerId);

      const pt = getCanvasPoint(e);
      isDrawing.current = true;

      switch (activeTool) {
        case "pen":
        case "highlighter":
          activeElement.current = {
            id: generateId(),
            type: activeTool,
            points: [pt],
            color: activeColor,
            strokeWidth: activeTool === "highlighter" ? activeStrokeWidth * 2 : activeStrokeWidth,
            opacity: activeTool === "highlighter" ? 0.35 : activeOpacity,
          };
          break;

        case "eraser": {
          // Find and remove element under cursor
          for (let i = elements.length - 1; i >= 0; i--) {
            if (hitTest(pt, elements[i])) {
              onRemoveElement(elements[i].id);
              break;
            }
          }
          break;
        }

        case "rectangle":
        case "circle":
        case "triangle":
        case "diamond":
        case "star":
        case "hexagon":
        case "rounded-rect":
        case "cylinder":
        case "parallelogram":
        case "flowchart-process":
        case "flowchart-decision":
        case "flowchart-terminal":
        case "flowchart-data":
        case "flowchart-document":
          activeElement.current = {
            id: generateId(),
            type: activeTool,
            x: pt.x,
            y: pt.y,
            width: 0,
            height: 0,
            color: activeColor,
            fillColor: activeFillColor,
            strokeWidth: activeStrokeWidth,
            opacity: activeOpacity,
            borderRadius: activeTool === "rounded-rect" ? 12 : undefined,
          };
          break;

        case "line":
        case "arrow":
        case "double-arrow":
        case "connector":
          activeElement.current = {
            id: generateId(),
            type: activeTool,
            startX: pt.x,
            startY: pt.y,
            endX: pt.x,
            endY: pt.y,
            color: activeColor,
            strokeWidth: activeStrokeWidth,
            opacity: activeOpacity,
          };
          break;

        case "text":
          onTextEdit({
            id: generateId(),
            type: "text",
            x: pt.x,
            y: pt.y,
            text: "",
            color: activeColor,
            strokeWidth: 1,
            opacity: 1,
            fontSize: activeFontSize,
          });
          isDrawing.current = false;
          break;

        case "sticky": {
          const stickyElement: WhiteboardElement = {
            id: generateId(),
            type: "sticky",
            x: pt.x - 90,
            y: pt.y - 80,
            width: 180,
            height: 160,
            text: "",
            color: activeColor,
            strokeWidth: 1,
            opacity: 1,
            fontSize: 14,
            stickyColor: activeStickyColor,
          };
          onAddElement(stickyElement);
          onTextEdit(stickyElement);
          isDrawing.current = false;
          break;
        }

        case "select": {
          let found = false;
          for (let i = elements.length - 1; i >= 0; i--) {
            if (hitTest(pt, elements[i])) {
              onSelectElement(elements[i].id);
              dragStart.current = pt;
              const el = elements[i];
              dragElementStart.current = {
                x: el.x ?? el.startX ?? 0,
                y: el.y ?? el.startY ?? 0,
              };
              found = true;
              break;
            }
          }
          if (!found) onSelectElement(null);
          break;
        }
      }
    },
    [
      readOnly, activeTool, activeColor, activeFillColor, activeStrokeWidth, activeOpacity,
      activeFontSize, activeStickyColor, viewport, elements, getCanvasPoint,
      onAddElement, onRemoveElement, onSelectElement, onTextEdit,
    ]
  );

  // Pointer move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Pan
      if (panStart.current) {
        onViewportChange({
          ...viewport,
          x: e.clientX - panStart.current.x,
          y: e.clientY - panStart.current.y,
        });
        return;
      }

      if (!isDrawing.current || readOnly) return;
      const pt = getCanvasPoint(e);

      switch (activeTool) {
        case "pen":
        case "highlighter":
          if (activeElement.current?.points) {
            activeElement.current.points.push(pt);
            drawActivePreview();
          }
          break;

        case "eraser":
          for (let i = elements.length - 1; i >= 0; i--) {
            if (hitTest(pt, elements[i])) {
              onRemoveElement(elements[i].id);
              break;
            }
          }
          break;

        case "rectangle":
        case "circle":
        case "triangle":
        case "diamond":
        case "star":
        case "hexagon":
        case "rounded-rect":
        case "cylinder":
        case "parallelogram":
        case "flowchart-process":
        case "flowchart-decision":
        case "flowchart-terminal":
        case "flowchart-data":
        case "flowchart-document":
          if (activeElement.current) {
            activeElement.current.width = pt.x - (activeElement.current.x || 0);
            activeElement.current.height = pt.y - (activeElement.current.y || 0);
            drawActivePreview();
          }
          break;

        case "line":
        case "arrow":
        case "double-arrow":
        case "connector":
          if (activeElement.current) {
            activeElement.current.endX = pt.x;
            activeElement.current.endY = pt.y;
            drawActivePreview();
          }
          break;

        case "select":
          if (dragStart.current && dragElementStart.current) {
            const dx = pt.x - dragStart.current.x;
            const dy = pt.y - dragStart.current.y;
            const selectedEl = elements.find((el) => el.isSelected);
            if (selectedEl) {
              const updates: Partial<WhiteboardElement> = {};
              if (selectedEl.x !== undefined) {
                updates.x = dragElementStart.current.x + dx;
                updates.y = dragElementStart.current.y + dy;
              }
              if (selectedEl.startX !== undefined) {
                updates.startX = dragElementStart.current.x + dx;
                updates.startY = dragElementStart.current.y + dy;
                if (selectedEl.endX !== undefined && selectedEl.endY !== undefined) {
                  const origDx = selectedEl.endX - (selectedEl.startX || 0);
                  const origDy = selectedEl.endY - (selectedEl.startY || 0);
                  updates.endX = dragElementStart.current.x + dx + origDx;
                  updates.endY = dragElementStart.current.y + dy + origDy;
                }
              }
              if (selectedEl.points) {
                updates.points = selectedEl.points.map((p) => ({
                  x: p.x + dx,
                  y: p.y + dy,
                }));
              }
              onUpdateElement(selectedEl.id, updates);
            }
          }
          break;
      }
    },
    [
      readOnly, activeTool, viewport, elements, getCanvasPoint,
      drawActivePreview, onViewportChange, onRemoveElement, onUpdateElement,
    ]
  );

  // Pointer up
  const handlePointerUp = useCallback(() => {
    panStart.current = null;
    dragStart.current = null;
    dragElementStart.current = null;

    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (activeElement.current) {
      onAddElement(activeElement.current);
      activeElement.current = null;
      clearActive();
    }
  }, [onAddElement, clearActive]);

  // Wheel for zoom/pan
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(5, Math.max(0.1, viewport.zoom * delta));
        const rect = containerRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        onViewportChange({
          x: mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom),
          y: mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom),
          zoom: newZoom,
        });
      } else {
        // Pan
        onViewportChange({
          ...viewport,
          x: viewport.x - e.deltaX,
          y: viewport.y - e.deltaY,
        });
      }
    },
    [viewport, onViewportChange]
  );

  // Touch gestures for pinch zoom
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastPinchDist.current !== null) {
          const scale = dist / lastPinchDist.current;
          const newZoom = Math.min(5, Math.max(0.1, viewport.zoom * scale));
          onViewportChange({ ...viewport, zoom: newZoom });
        }
        lastPinchDist.current = dist;
      }
    },
    [viewport, onViewportChange]
  );

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = null;
  }, []);

  // Double-click to edit existing text/sticky elements
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly) return;
      const rect = containerRef.current!.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, viewport, rect);
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if ((el.type === "text" || el.type === "sticky") && hitTest(pt, el)) {
          onTextEdit(el);
          return;
        }
      }
    },
    [readOnly, viewport, elements, onTextEdit]
  );

  // Cursor based on active tool
  const getCursor = () => {
    if (readOnly) return "default";
    switch (activeTool) {
      case "pen":
      case "highlighter":
        return "crosshair";
      case "eraser":
        return "pointer";
      case "hand":
        return "grab";
      case "select":
        return "default";
      case "text":
        return "text";
      default:
        return "crosshair";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-hidden bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]"
      style={{ cursor: getCursor(), touchAction: "none" }}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Static layer - committed elements */}
      <canvas
        ref={staticCanvasRef}
        className="absolute inset-0"
      />
      {/* Active layer - in-progress drawing */}
      <canvas
        ref={activeCanvasRef}
        className="absolute inset-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
}

/** Draw subtle dot grid on canvas */
function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number
) {
  const spacing = 24 * viewport.zoom;
  if (spacing < 6) return; // Too zoomed out, skip dots

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.08)";

  const offsetX = viewport.x % spacing;
  const offsetY = viewport.y % spacing;

  for (let x = offsetX; x < width; x += spacing) {
    for (let y = offsetY; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
