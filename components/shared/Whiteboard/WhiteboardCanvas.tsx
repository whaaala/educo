"use client";

import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import type { WhiteboardElement, WhiteboardTool, Point, Viewport, FontFamily, TextAlign, StrokeDashPattern } from "./whiteboard-types";
import { drawElement, screenToCanvas, hitTest, generateId, getBoundingBox, drawGroupOutlines, drawResizeHandles, hitTestResizeHandle } from "./whiteboard-utils";
import type { ResizeHandle } from "./whiteboard-utils";

interface ContextMenuEvent {
  x: number;
  y: number;
  canvasPoint: { x: number; y: number };
  elementId: string | null;
}

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
  activeFontFamily: FontFamily;
  activeFontWeight: "normal" | "bold";
  activeFontStyle: "normal" | "italic";
  activeTextDecoration: "none" | "underline";
  activeTextAlign: TextAlign;
  activeLineSpacing: number;
  activeStrokeDash: StrokeDashPattern;
  readOnly?: boolean;
  onAddElement: (element: WhiteboardElement) => void;
  onBatchUpdate: (updates: Map<string, Partial<WhiteboardElement>>) => void;
  onRemoveElement: (id: string) => void;
  onSelectElement: (id: string | null, addToSelection?: boolean) => void;
  onSelectMultiple: (ids: string[]) => void;
  onViewportChange: (viewport: Viewport) => void;
  onTextEdit: (element: WhiteboardElement) => void;
  onMoveStart: () => void;
  onContextMenu?: (event: ContextMenuEvent) => void;
}

export type { ContextMenuEvent };

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
  activeFontFamily,
  activeFontWeight,
  activeFontStyle,
  activeTextDecoration,
  activeTextAlign,
  activeLineSpacing,
  activeStrokeDash,
  readOnly = false,
  onAddElement,
  onBatchUpdate,
  onRemoveElement,
  onSelectElement,
  onSelectMultiple,
  onViewportChange,
  onTextEdit,
  onMoveStart,
  onContextMenu: onContextMenuProp,
}: WhiteboardCanvasProps) {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const activeElement = useRef<WhiteboardElement | null>(null);
  const dragStart = useRef<Point | null>(null);
  const dragOriginals = useRef<Map<string, WhiteboardElement> | null>(null);
  const hasDragMoved = useRef(false);
  const panStart = useRef<Point | null>(null);
  const panRafId = useRef<number | null>(null);
  const pendingViewport = useRef<Viewport | null>(null);
  const lastPinchDist = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const needsRedraw = useRef(false);
  const marqueeStart = useRef<Point | null>(null);
  const marqueeEnd = useRef<Point | null>(null);
  const resizeHandleRef = useRef<ResizeHandle | null>(null);
  const resizeOriginal = useRef<WhiteboardElement | null>(null);
  const resizeElementId = useRef<string | null>(null);
  const hasResizeMoved = useRef(false);

  // Stable ref for elements — avoids recreating handlers on every elements change
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

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

  // Redraw static canvas — uses refs so the function itself is stable
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

    // Draw group outlines (behind selection outlines)
    const els = elementsRef.current;
    drawGroupOutlines(ctx, els, viewport);

    // Draw all committed elements
    for (const el of els) {
      drawElement(ctx, el, viewport);
    }

    // Draw resize handles for single-selected element
    const selectedEls = els.filter(el => el.isSelected);
    if (selectedEls.length === 1) {
      drawResizeHandles(ctx, selectedEls[0], viewport);
    }

    ctx.restore();
  }, [viewport]);

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

  // Draw active element preview (RAF-throttled for smooth rendering)
  const flushActivePreview = useCallback(() => {
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
    needsRedraw.current = false;
  }, [viewport]);

  const drawActivePreview = useCallback(() => {
    if (!needsRedraw.current) {
      needsRedraw.current = true;
      rafId.current = requestAnimationFrame(flushActivePreview);
    }
  }, [flushActivePreview]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (panRafId.current !== null) cancelAnimationFrame(panRafId.current);
    };
  }, []);

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

  // Commit active polyline when switching away from polyline tool
  useEffect(() => {
    if (activeTool !== "polyline" && activeElement.current?.type === "polyline") {
      const pts = activeElement.current.points!;
      if (pts.length > 2) pts.pop();
      if (pts.length >= 2) {
        onAddElement(activeElement.current);
      }
      activeElement.current = null;
      clearActive();
    }
  }, [activeTool, onAddElement, clearActive]);

  // Redraw when elements or viewport change — useLayoutEffect ensures the canvas
  // is redrawn synchronously before the browser paints, so resize/drag/move
  // updates are immediately visible without a one-frame lag.
  useLayoutEffect(() => {
    redrawStatic();
  }, [redrawStatic, elements]);

  // Get canvas point from pointer event
  const getCanvasPoint = useCallback(
    (e: React.PointerEvent): Point => {
      const rect = containerRef.current!.getBoundingClientRect();
      return screenToCanvas(e.clientX, e.clientY, viewport, rect);
    },
    [viewport]
  );

  // Deep-copy an element (including points array)
  const cloneElement = (el: WhiteboardElement): WhiteboardElement => ({
    ...el,
    points: el.points ? el.points.map((p) => ({ ...p })) : undefined,
  });

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

      // Select tool — handles single-select, shift+multi-select, and group-aware selection
      if (activeTool === "select") {
        const els = elementsRef.current;

        // Check resize handles first (single selection only)
        const selectedEls = els.filter(el => el.isSelected);
        if (selectedEls.length === 1) {
          const handleHit = hitTestResizeHandle(pt, selectedEls[0], viewport.zoom);
          if (handleHit) {
            resizeHandleRef.current = handleHit;
            resizeOriginal.current = cloneElement(selectedEls[0]);
            resizeElementId.current = selectedEls[0].id;
            hasResizeMoved.current = false;
            return;
          }
        }

        let found = false;
        for (let i = els.length - 1; i >= 0; i--) {
          if (hitTest(pt, els[i])) {
            const clickedEl = els[i];
            const isShift = e.shiftKey;

            // Handle selection
            if (isShift) {
              onSelectElement(clickedEl.id, true);
            } else if (!clickedEl.isSelected) {
              onSelectElement(clickedEl.id, false);
            }
            // If already selected and no shift, keep existing selection (enables group drag)

            // Determine which elements will be dragged
            dragStart.current = pt;
            hasDragMoved.current = false;
            dragOriginals.current = new Map();

            // Collect IDs of all elements that should move together
            const dragIds = new Set<string>();

            if (isShift && clickedEl.isSelected) {
              // Shift-clicking a selected item = deselecting, no drag
              dragStart.current = null;
              dragOriginals.current = null;
            } else if (isShift) {
              // Adding to selection: drag all currently selected + this one + group members
              for (const el of els) {
                if (el.isSelected) dragIds.add(el.id);
              }
              dragIds.add(clickedEl.id);
              if (clickedEl.groupId) {
                for (const el of els) {
                  if (el.groupId === clickedEl.groupId) dragIds.add(el.id);
                }
              }
            } else if (clickedEl.isSelected) {
              // Already selected: drag all currently selected elements
              for (const el of els) {
                if (el.isSelected) dragIds.add(el.id);
              }
            } else {
              // New selection: drag this element + its group members
              dragIds.add(clickedEl.id);
              if (clickedEl.groupId) {
                for (const el of els) {
                  if (el.groupId === clickedEl.groupId) dragIds.add(el.id);
                }
              }
            }

            // Store originals for all drag targets
            if (dragOriginals.current) {
              for (const el of els) {
                if (dragIds.has(el.id)) {
                  dragOriginals.current.set(el.id, cloneElement(el));
                }
              }
            }

            found = true;
            break;
          }
        }
        if (!found) {
          onSelectElement(null);
          dragStart.current = null;
          dragOriginals.current = null;
          // Start marquee selection on empty space
          marqueeStart.current = pt;
          marqueeEnd.current = pt;
        }
        return;
      }

      isDrawing.current = true;

      switch (activeTool) {
        case "pen":
        case "highlighter":
        case "scribble":
          activeElement.current = {
            id: generateId(),
            type: activeTool,
            points: [pt],
            color: activeColor,
            strokeWidth: activeTool === "highlighter" ? activeStrokeWidth * 2 : activeStrokeWidth,
            opacity: activeTool === "highlighter" ? 0.35 : activeOpacity,
            strokeDash: activeStrokeDash,
          };
          break;

        case "eraser": {
          const els = elementsRef.current;
          for (let i = els.length - 1; i >= 0; i--) {
            if (hitTest(pt, els[i])) {
              onRemoveElement(els[i].id);
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
            strokeDash: activeStrokeDash,
          };
          break;

        case "line":
        case "arrow":
        case "double-arrow":
        case "connector":
        case "curved-connector":
        case "curve":
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
            strokeDash: activeStrokeDash,
          };
          break;

        case "polyline":
          // Polyline: click to place points, double-click to finish
          if (activeElement.current?.type === "polyline") {
            // Add another point to existing polyline
            activeElement.current.points!.push(pt);
            drawActivePreview();
            isDrawing.current = false;
          } else {
            // Start new polyline
            activeElement.current = {
              id: generateId(),
              type: "polyline",
              points: [pt, { ...pt }],
              color: activeColor,
              strokeWidth: activeStrokeWidth,
              opacity: activeOpacity,
              strokeDash: activeStrokeDash,
            };
            isDrawing.current = false;
          }
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
            fontFamily: activeFontFamily,
            fontWeight: activeFontWeight,
            fontStyle: activeFontStyle,
            textDecoration: activeTextDecoration,
            textAlign: activeTextAlign,
            lineSpacing: activeLineSpacing,
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
            fontFamily: activeFontFamily,
            fontWeight: activeFontWeight,
            fontStyle: activeFontStyle,
            textDecoration: activeTextDecoration,
            textAlign: activeTextAlign,
            lineSpacing: activeLineSpacing,
          };
          onAddElement(stickyElement);
          onTextEdit(stickyElement);
          isDrawing.current = false;
          break;
        }
      }
    },
    [
      readOnly, activeTool, activeColor, activeFillColor, activeStrokeWidth, activeOpacity,
      activeFontSize, activeStickyColor, activeFontFamily, activeFontWeight, activeFontStyle,
      activeTextDecoration, activeTextAlign, activeLineSpacing, activeStrokeDash,
      viewport, getCanvasPoint,
      onAddElement, onRemoveElement, onSelectElement, onTextEdit,
    ]
  );

  // Compute resize updates for an element given a handle and pointer position
  const computeResizeUpdates = (
    orig: WhiteboardElement,
    handle: ResizeHandle,
    pt: Point
  ): Partial<WhiteboardElement> => {
    // Line endpoints — just move start or end
    if (handle === 'line-start') {
      return { startX: pt.x, startY: pt.y };
    }
    if (handle === 'line-end') {
      return { endX: pt.x, endY: pt.y };
    }

    const bbox = getBoundingBox(orig);
    if (!bbox) return {};

    let left = bbox.x;
    let top = bbox.y;
    let right = bbox.x + bbox.width;
    let bottom = bbox.y + bbox.height;

    // Adjust edges based on which handle is being dragged
    if (handle.includes('n')) top = pt.y;
    if (handle.includes('s')) bottom = pt.y;
    if (handle.includes('w')) left = pt.x;
    if (handle.includes('e')) right = pt.x;

    // Enforce minimum size (prevent collapsing)
    const MIN = 10;
    if (right - left < MIN) {
      if (handle.includes('w')) left = right - MIN;
      else right = left + MIN;
    }
    if (bottom - top < MIN) {
      if (handle.includes('n')) top = bottom - MIN;
      else bottom = top + MIN;
    }

    // Pen/highlighter: scale all points proportionally
    if (orig.points && orig.points.length > 0) {
      const scaleX = bbox.width > 0 ? (right - left) / bbox.width : 1;
      const scaleY = bbox.height > 0 ? (bottom - top) / bbox.height : 1;
      return {
        points: orig.points.map(p => ({
          x: left + (p.x - bbox.x) * scaleX,
          y: top + (p.y - bbox.y) * scaleY,
        })),
      };
    }

    // Bbox-based shapes (rect, circle, sticky, image, table, chart, etc.)
    if (orig.x !== undefined) {
      return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      };
    }

    return {};
  };

  // Compute position updates for an element given a delta
  const computeMoveUpdates = (orig: WhiteboardElement, dx: number, dy: number): Partial<WhiteboardElement> => {
    const updates: Partial<WhiteboardElement> = {};
    if (orig.x !== undefined) {
      updates.x = orig.x + dx;
      updates.y = (orig.y ?? 0) + dy;
    }
    if (orig.startX !== undefined) {
      updates.startX = orig.startX + dx;
      updates.startY = (orig.startY ?? 0) + dy;
      if (orig.endX !== undefined) {
        updates.endX = orig.endX + dx;
        updates.endY = (orig.endY ?? 0) + dy;
      }
    }
    if (orig.points) {
      updates.points = orig.points.map((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      }));
    }
    return updates;
  };

  // Pointer move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Pan — RAF-throttled for smooth, jitter-free movement
      if (panStart.current) {
        const newViewport: Viewport = {
          ...viewport,
          x: e.clientX - panStart.current.x,
          y: e.clientY - panStart.current.y,
        };
        pendingViewport.current = newViewport;
        if (panRafId.current === null) {
          panRafId.current = requestAnimationFrame(() => {
            if (pendingViewport.current) {
              onViewportChange(pendingViewport.current);
            }
            panRafId.current = null;
          });
        }
        return;
      }

      // Resize drag — resize the single selected element
      if (resizeHandleRef.current && resizeOriginal.current && resizeElementId.current) {
        const pt = getCanvasPoint(e);
        if (!hasResizeMoved.current) {
          hasResizeMoved.current = true;
          onMoveStart();
        }
        const updates = computeResizeUpdates(resizeOriginal.current, resizeHandleRef.current, pt);
        onBatchUpdate(new Map([[resizeElementId.current, updates]]));
        return;
      }

      // Select/drag — move all selected elements using stored originals
      if (dragStart.current && dragOriginals.current && dragOriginals.current.size > 0) {
        const pt = getCanvasPoint(e);
        if (!hasDragMoved.current) {
          hasDragMoved.current = true;
          onMoveStart();
        }
        const dx = pt.x - dragStart.current.x;
        const dy = pt.y - dragStart.current.y;

        const allUpdates = new Map<string, Partial<WhiteboardElement>>();
        for (const [id, orig] of dragOriginals.current) {
          allUpdates.set(id, computeMoveUpdates(orig, dx, dy));
        }
        onBatchUpdate(allUpdates);
        return;
      }

      // Marquee selection — draw rubber band rectangle on active canvas
      if (marqueeStart.current) {
        const pt = getCanvasPoint(e);
        marqueeEnd.current = pt;
        // Draw marquee on active canvas
        const canvas = activeCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            ctx.save();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

            const sx = marqueeStart.current.x * viewport.zoom + viewport.x;
            const sy = marqueeStart.current.y * viewport.zoom + viewport.y;
            const ex = pt.x * viewport.zoom + viewport.x;
            const ey = pt.y * viewport.zoom + viewport.y;
            const rx = Math.min(sx, ex);
            const ry = Math.min(sy, ey);
            const rw = Math.abs(ex - sx);
            const rh = Math.abs(ey - sy);

            ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
            ctx.fillRect(rx, ry, rw, rh);
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(rx, ry, rw, rh);
            ctx.setLineDash([]);
            ctx.restore();
          }
        }
        return;
      }

      // Polyline preview — update last point to follow cursor (even when not "drawing")
      if (activeElement.current?.type === "polyline" && activeTool === "polyline") {
        const pt = getCanvasPoint(e);
        const pts = activeElement.current.points!;
        if (pts.length >= 2) {
          pts[pts.length - 1] = pt;
          drawActivePreview();
        }
        return;
      }

      if (!isDrawing.current || readOnly) return;
      const pt = getCanvasPoint(e);

      // Coalesced pointer events for smoother pen/highlighter strokes
      const coalescedEvents = (e as unknown as { getCoalescedEvents?: () => PointerEvent[] }).getCoalescedEvents?.() || [];

      switch (activeTool) {
        case "pen":
        case "highlighter":
        case "scribble":
          if (activeElement.current?.points) {
            if (coalescedEvents.length > 1) {
              const rect = containerRef.current!.getBoundingClientRect();
              for (const ce of coalescedEvents) {
                activeElement.current.points.push(
                  screenToCanvas(ce.clientX, ce.clientY, viewport, rect)
                );
              }
            } else {
              activeElement.current.points.push(pt);
            }
            drawActivePreview();
          }
          break;

        case "eraser": {
          const els = elementsRef.current;
          for (let i = els.length - 1; i >= 0; i--) {
            if (hitTest(pt, els[i])) {
              onRemoveElement(els[i].id);
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
        case "curved-connector":
        case "curve":
          if (activeElement.current) {
            activeElement.current.endX = pt.x;
            activeElement.current.endY = pt.y;
            drawActivePreview();
          }
          break;
      }
    },
    [
      readOnly, activeTool, viewport, getCanvasPoint,
      drawActivePreview, onViewportChange, onRemoveElement, onBatchUpdate, onMoveStart,
    ]
  );

  // Pointer up
  const handlePointerUp = useCallback(() => {
    // Flush any pending pan viewport update
    if (panStart.current && pendingViewport.current) {
      if (panRafId.current !== null) {
        cancelAnimationFrame(panRafId.current);
        panRafId.current = null;
      }
      onViewportChange(pendingViewport.current);
      pendingViewport.current = null;
    }
    panStart.current = null;

    // Clean up resize state
    resizeHandleRef.current = null;
    resizeOriginal.current = null;
    resizeElementId.current = null;
    hasResizeMoved.current = false;

    // Clean up select/drag state
    dragStart.current = null;
    dragOriginals.current = null;
    hasDragMoved.current = false;

    // Finalize marquee selection
    if (marqueeStart.current && marqueeEnd.current) {
      const ms = marqueeStart.current;
      const me = marqueeEnd.current;
      const minX = Math.min(ms.x, me.x);
      const minY = Math.min(ms.y, me.y);
      const maxX = Math.max(ms.x, me.x);
      const maxY = Math.max(ms.y, me.y);

      // Only count as marquee if dragged at least a small distance
      if (maxX - minX > 4 || maxY - minY > 4) {
        const els = elementsRef.current;
        const hitIds: string[] = [];
        for (const el of els) {
          const bbox = getBoundingBox(el);
          if (!bbox) continue;
          // Element is inside marquee if its bounding box overlaps the marquee rect
          if (
            bbox.x + bbox.width >= minX &&
            bbox.x <= maxX &&
            bbox.y + bbox.height >= minY &&
            bbox.y <= maxY
          ) {
            hitIds.push(el.id);
          }
        }
        if (hitIds.length > 0) {
          onSelectMultiple(hitIds);
        }
      }

      marqueeStart.current = null;
      marqueeEnd.current = null;
      clearActive();
    }

    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (activeElement.current) {
      const el = activeElement.current;

      // Minimum size threshold: discard tiny/accidental shapes
      const MIN_SIZE = 4;
      const isBbox = el.width !== undefined && el.height !== undefined;
      const isLine = el.startX !== undefined && el.endX !== undefined;
      const isPen = el.points && el.points.length > 0;

      let tooSmall = false;
      if (isBbox && Math.abs(el.width!) < MIN_SIZE && Math.abs(el.height!) < MIN_SIZE) {
        tooSmall = true;
      } else if (isLine) {
        const dx = (el.endX || 0) - (el.startX || 0);
        const dy = (el.endY || 0) - (el.startY || 0);
        if (Math.hypot(dx, dy) < MIN_SIZE) tooSmall = true;
      } else if (isPen && el.points!.length < 2) {
        tooSmall = true;
      }

      if (!tooSmall) {
        onAddElement(el);
      }
      activeElement.current = null;
      clearActive();
    }
  }, [onAddElement, clearActive, onViewportChange, onSelectMultiple]);

  // Wheel for zoom/pan
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
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

  // Double-click to edit existing text/sticky elements or finish polyline
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly) return;

      // Finish active polyline on double-click
      if (activeElement.current?.type === "polyline") {
        const pts = activeElement.current.points!;
        // Remove the trailing "follow cursor" point
        if (pts.length > 2) pts.pop();
        if (pts.length >= 2) {
          onAddElement(activeElement.current);
        }
        activeElement.current = null;
        clearActive();
        return;
      }
      const rect = containerRef.current!.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, viewport, rect);
      const els = elementsRef.current;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        if ((el.type === "text" || el.type === "sticky") && hitTest(pt, el)) {
          onTextEdit(el);
          return;
        }
      }
    },
    [readOnly, viewport, onTextEdit]
  );

  // Right-click context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!onContextMenuProp) return;
      const rect = containerRef.current!.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, viewport, rect);

      // Hit test to find element under cursor
      const els = elementsRef.current;
      let elementId: string | null = null;
      for (let i = els.length - 1; i >= 0; i--) {
        if (hitTest(pt, els[i])) {
          elementId = els[i].id;
          // Select the element if not already selected
          if (!els[i].isSelected) {
            onSelectElement(elementId, false);
          }
          break;
        }
      }

      onContextMenuProp({
        x: e.clientX,
        y: e.clientY,
        canvasPoint: pt,
        elementId,
      });
    },
    [viewport, onSelectElement, onContextMenuProp]
  );

  // Image drag-and-drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (readOnly) return;
      const rect = containerRef.current!.getBoundingClientRect();
      const pt = screenToCanvas(e.clientX, e.clientY, viewport, rect);

      // Handle dropped files (images)
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );

      // Handle dropped URLs / HTML images
      const html = e.dataTransfer.getData("text/html");
      const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");

      if (files.length > 0) {
        files.forEach((file, i) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
              // Scale down large images to fit reasonable whiteboard dimensions
              let w = img.naturalWidth;
              let h = img.naturalHeight;
              const maxDim = 600;
              if (w > maxDim || h > maxDim) {
                const scale = maxDim / Math.max(w, h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
              }
              onAddElement({
                id: generateId(),
                type: "image",
                x: pt.x + i * 20,
                y: pt.y + i * 20,
                width: w,
                height: h,
                imageUrl: dataUrl,
                color: "#d1d5db",
                strokeWidth: 0,
                opacity: 1,
              });
            };
            img.src = dataUrl;
          };
          reader.readAsDataURL(file);
        });
      } else if (html) {
        // Extract image URL from dropped HTML
        const match = html.match(/<img[^>]+src="([^"]+)"/);
        if (match && match[1]) {
          onAddElement({
            id: generateId(),
            type: "image",
            x: pt.x,
            y: pt.y,
            width: 300,
            height: 200,
            imageUrl: match[1],
            color: "#d1d5db",
            strokeWidth: 0,
            opacity: 1,
          });
        }
      } else if (url && (url.startsWith("http") || url.startsWith("data:"))) {
        onAddElement({
          id: generateId(),
          type: "image",
          x: pt.x,
          y: pt.y,
          width: 300,
          height: 200,
          imageUrl: url,
          color: "#d1d5db",
          strokeWidth: 0,
          opacity: 1,
        });
      }
    },
    [readOnly, viewport, onAddElement]
  );

  // Cursor based on active tool
  const getCursor = () => {
    if (readOnly) return "default";
    if (resizeHandleRef.current) {
      switch (resizeHandleRef.current) {
        case 'nw': case 'se': return 'nwse-resize';
        case 'ne': case 'sw': return 'nesw-resize';
        case 'n': case 's': return 'ns-resize';
        case 'e': case 'w': return 'ew-resize';
        case 'line-start': case 'line-end': return 'crosshair';
      }
    }
    if (dragStart.current && hasDragMoved.current) return "grabbing";
    if (panStart.current) return "grabbing";
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
      className="absolute inset-0 z-0 overflow-hidden bg-surface"
      style={{ cursor: getCursor(), touchAction: "none" }}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas ref={staticCanvasRef} className="absolute inset-0 whiteboard-static-canvas" />
      <canvas
        ref={activeCanvasRef}
        className="absolute inset-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
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
  if (spacing < 6) return;

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
