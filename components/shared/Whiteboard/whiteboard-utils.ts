import type { WhiteboardElement, Point, WhiteboardTool, StrokeDashPattern, TextAlign } from "./whiteboard-types";
import { BBOX_SHAPE_TOOLS, LINE_TOOLS } from "./whiteboard-types";

// ---------------------------------------------------------------------------
// Resize handle types
// ---------------------------------------------------------------------------

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'line-start' | 'line-end';

let idCounter = 0;

export function generateId(): string {
  idCounter++;
  return `wb-${Date.now()}-${idCounter}`;
}

// ---------------------------------------------------------------------------
// Image cache — avoids re-creating HTMLImageElement on every redraw
// ---------------------------------------------------------------------------
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(url: string): HTMLImageElement | null {
  if (imageCache.has(url)) {
    const img = imageCache.get(url)!;
    return img.complete ? img : null;
  }
  const img = new Image();
  img.src = url;
  imageCache.set(url, img);
  // Return null until loaded; next redraw will pick it up
  return null;
}

export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imageCache.has(url)) {
      const cached = imageCache.get(url)!;
      if (cached.complete) { resolve(cached); return; }
      cached.onload = () => resolve(cached);
      cached.onerror = reject;
      return;
    }
    const img = new Image();
    img.onload = () => { imageCache.set(url, img); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

// ---------------------------------------------------------------------------
// Fill helper — call before stroke for shapes with fillColor
// ---------------------------------------------------------------------------
function applyFill(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.fillColor) {
    ctx.fillStyle = el.fillColor;
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Font string builder — constructs CSS font string from element fields
// ---------------------------------------------------------------------------

export function buildFontString(el: WhiteboardElement): string {
  const style = el.fontStyle === "italic" ? "italic " : "";
  const weight = el.fontWeight === "bold" ? "bold " : "";
  const size = el.fontSize || 16;
  const family = el.fontFamily || "Inter";
  return `${style}${weight}${size}px ${family}, system-ui, sans-serif`;
}

// ---------------------------------------------------------------------------
// Stroke dash helper — sets ctx.setLineDash from pattern name
// ---------------------------------------------------------------------------

export function applyStrokeDash(
  ctx: CanvasRenderingContext2D,
  pattern: StrokeDashPattern | undefined,
  strokeWidth: number
) {
  if (!pattern || pattern === "solid") {
    ctx.setLineDash([]);
    return;
  }
  const w = Math.max(strokeWidth, 1);
  switch (pattern) {
    case "dashed":
      ctx.setLineDash([w * 4, w * 3]);
      break;
    case "dotted":
      ctx.setLineDash([w, w * 2]);
      break;
    case "dash-dot":
      ctx.setLineDash([w * 4, w * 2, w, w * 2]);
      break;
    case "dash-dot-dot":
      ctx.setLineDash([w * 4, w * 2, w, w * 2, w, w * 2]);
      break;
  }
}

// ---------------------------------------------------------------------------
// SVG stroke-dasharray helper (for thumbnails)
// ---------------------------------------------------------------------------

export function getStrokeDashArray(
  pattern: StrokeDashPattern | undefined,
  strokeWidth: number
): string | undefined {
  if (!pattern || pattern === "solid") return undefined;
  const w = Math.max(strokeWidth, 1);
  switch (pattern) {
    case "dashed":
      return `${w * 4} ${w * 3}`;
    case "dotted":
      return `${w} ${w * 2}`;
    case "dash-dot":
      return `${w * 4} ${w * 2} ${w} ${w * 2}`;
    case "dash-dot-dot":
      return `${w * 4} ${w * 2} ${w} ${w * 2} ${w} ${w * 2}`;
  }
}

// ---------------------------------------------------------------------------
// Main draw dispatcher
// ---------------------------------------------------------------------------
export function drawElement(
  ctx: CanvasRenderingContext2D,
  el: WhiteboardElement,
  viewport: { x: number; y: number; zoom: number }
) {
  ctx.save();
  ctx.translate(viewport.x, viewport.y);
  ctx.scale(viewport.zoom, viewport.zoom);
  ctx.globalAlpha = el.opacity;
  ctx.strokeStyle = el.color;
  ctx.fillStyle = el.color;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Apply stroke dash pattern
  applyStrokeDash(ctx, el.strokeDash, el.strokeWidth);

  // Apply rotation/flip transforms around element center
  if (el.rotation || el.flipH || el.flipV) {
    const bbox = getBoundingBox(el);
    if (bbox) {
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      ctx.translate(cx, cy);
      if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
      if (el.flipH) ctx.scale(-1, 1);
      if (el.flipV) ctx.scale(1, -1);
      ctx.translate(-cx, -cy);
    }
  }

  switch (el.type) {
    case "pen":
    case "highlighter":
      drawPath(ctx, el);
      break;
    case "rectangle":
    case "flowchart-process":
      drawRectangle(ctx, el);
      break;
    case "circle":
      drawCircle(ctx, el);
      break;
    case "triangle":
      drawTriangle(ctx, el);
      break;
    case "diamond":
    case "flowchart-decision":
      drawDiamond(ctx, el);
      break;
    case "star":
      drawStar(ctx, el);
      break;
    case "hexagon":
      drawHexagon(ctx, el);
      break;
    case "rounded-rect":
    case "flowchart-terminal":
      drawRoundedRect(ctx, el);
      break;
    case "cylinder":
      drawCylinder(ctx, el);
      break;
    case "parallelogram":
    case "flowchart-data":
      drawParallelogram(ctx, el);
      break;
    case "flowchart-document":
      drawDocument(ctx, el);
      break;
    case "line":
      drawLine(ctx, el);
      break;
    case "arrow":
      drawArrow(ctx, el);
      break;
    case "double-arrow":
      drawDoubleArrow(ctx, el);
      break;
    case "connector":
      drawConnector(ctx, el);
      break;
    case "curved-connector":
      drawCurvedConnector(ctx, el);
      break;
    case "curve":
      drawCurve(ctx, el);
      break;
    case "polyline":
      drawPolyline(ctx, el);
      break;
    case "scribble":
      drawPath(ctx, el);
      break;
    case "text":
      drawText(ctx, el);
      break;
    case "sticky":
      drawSticky(ctx, el);
      break;
    case "image":
      drawImageElement(ctx, el);
      break;
    case "table":
      drawTable(ctx, el);
      break;
    case "chart":
      drawChart(ctx, el);
      break;
  }

  // Centered label for flowchart shapes
  if (el.type.startsWith("flowchart") && (el.label || el.text)) {
    drawShapeLabel(ctx, el);
  }

  // Selection outline
  if (el.isSelected) {
    const bbox = getBoundingBox(el);
    if (bbox) {
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2 / viewport.zoom;
      ctx.globalAlpha = 1;
      ctx.strokeRect(bbox.x - 4, bbox.y - 4, bbox.width + 8, bbox.height + 8);
      ctx.setLineDash([]);
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Group outlines — draws a subtle outline around grouped elements
// ---------------------------------------------------------------------------

export function drawGroupOutlines(
  ctx: CanvasRenderingContext2D,
  elements: WhiteboardElement[],
  viewport: { x: number; y: number; zoom: number }
) {
  // Collect groups
  const groups = new Map<string, { minX: number; minY: number; maxX: number; maxY: number }>();
  for (const el of elements) {
    if (!el.groupId) continue;
    const bbox = getBoundingBox(el);
    if (!bbox) continue;
    const existing = groups.get(el.groupId);
    if (existing) {
      existing.minX = Math.min(existing.minX, bbox.x);
      existing.minY = Math.min(existing.minY, bbox.y);
      existing.maxX = Math.max(existing.maxX, bbox.x + bbox.width);
      existing.maxY = Math.max(existing.maxY, bbox.y + bbox.height);
    } else {
      groups.set(el.groupId, {
        minX: bbox.x,
        minY: bbox.y,
        maxX: bbox.x + bbox.width,
        maxY: bbox.y + bbox.height,
      });
    }
  }

  if (groups.size === 0) return;

  ctx.save();
  ctx.translate(viewport.x, viewport.y);
  ctx.scale(viewport.zoom, viewport.zoom);

  const pad = 8;
  const radius = 6;
  for (const [, bounds] of groups) {
    const x = bounds.minX - pad;
    const y = bounds.minY - pad;
    const w = bounds.maxX - bounds.minX + pad * 2;
    const h = bounds.maxY - bounds.minY + pad * 2;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = "rgba(59, 130, 246, 0.04)";
    ctx.fill();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
    ctx.lineWidth = 1.5 / viewport.zoom;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Drawing functions
// ---------------------------------------------------------------------------

function drawPath(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (!el.points || el.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(el.points[0].x, el.points[0].y);
  for (let i = 1; i < el.points.length; i++) {
    const prev = el.points[i - 1];
    const curr = el.points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  }
  ctx.stroke();
}

function drawRectangle(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  ctx.beginPath();
  ctx.rect(el.x, el.y, el.width, el.height);
  applyFill(ctx, el);
  ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const rx = Math.abs(el.width) / 2;
  const ry = Math.abs(el.height) / 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  applyFill(ctx, el);
  ctx.stroke();
}

function drawTriangle(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawDiamond(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawStar(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const outerR = Math.min(w, h) / 2;
  const innerR = outerR * 0.38;
  const spikes = 5;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI / 2) * -1 + (Math.PI / spikes) * i;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawHexagon(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = w / 2;
  const ry = h / 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + rx * Math.cos(angle);
    const py = cy + ry * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const r = el.type === "flowchart-terminal"
    ? Math.min(h / 2, w / 2)
    : Math.min(el.borderRadius ?? 12, w / 2, h / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawCylinder(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const ellH = Math.min(h * 0.15, 20);

  // Fill body + bottom ellipse
  if (el.fillColor) {
    ctx.fillStyle = el.fillColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h - ellH, w / 2, ellH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(x, y + ellH, w, h - ellH * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + ellH, w / 2, ellH, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top ellipse (full)
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + ellH, w / 2, ellH, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Side lines
  ctx.beginPath();
  ctx.moveTo(x, y + ellH);
  ctx.lineTo(x, y + h - ellH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w, y + ellH);
  ctx.lineTo(x + w, y + h - ellH);
  ctx.stroke();

  // Bottom ellipse (bottom half only)
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - ellH, w / 2, ellH, 0, 0, Math.PI);
  ctx.stroke();
}

function drawParallelogram(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const offset = w * 0.2;

  ctx.beginPath();
  ctx.moveTo(x + offset, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - offset, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

function drawDocument(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return;
  const { x, y, width: w, height: h } = normalizeRect(el.x, el.y, el.width, el.height);
  const wave = h * 0.1;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - wave);
  ctx.quadraticCurveTo(x + w * 0.75, y + h - wave * 2, x + w / 2, y + h - wave);
  ctx.quadraticCurveTo(x + w * 0.25, y + h, x, y + h - wave);
  ctx.closePath();
  applyFill(ctx, el);
  ctx.stroke();
}

// --- Line-based shapes ---

function drawLine(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.lineTo(el.endX, el.endY);
  ctx.stroke();
}

function drawArrow(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.lineTo(el.endX, el.endY);
  ctx.stroke();
  drawArrowHead(ctx, el.startX, el.startY, el.endX, el.endY, el.strokeWidth);
}

function drawDoubleArrow(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.lineTo(el.endX, el.endY);
  ctx.stroke();
  drawArrowHead(ctx, el.startX, el.startY, el.endX, el.endY, el.strokeWidth);
  drawArrowHead(ctx, el.endX, el.endY, el.startX, el.startY, el.strokeWidth);
}

function drawConnector(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  const midX = (el.startX + el.endX) / 2;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.lineTo(midX, el.startY);
  ctx.lineTo(midX, el.endY);
  ctx.lineTo(el.endX, el.endY);
  ctx.stroke();
  drawArrowHead(ctx, midX, el.endY, el.endX, el.endY, el.strokeWidth);
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number,
  toX: number, toY: number,
  strokeWidth: number
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = Math.max(12, strokeWidth * 3);
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

// --- Curved connector (S-curve between start and end) ---

function drawCurvedConnector(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  const midX = (el.startX + el.endX) / 2;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.bezierCurveTo(midX, el.startY, midX, el.endY, el.endX, el.endY);
  ctx.stroke();
  drawArrowHead(ctx, midX, el.endY, el.endX, el.endY, el.strokeWidth);
}

// --- Curve (smooth bezier arc between start and end) ---

function drawCurve(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return;
  // Control point offset perpendicular to the line
  const midX = (el.startX + el.endX) / 2;
  const midY = (el.startY + el.endY) / 2;
  const dx = el.endX - el.startX;
  const dy = el.endY - el.startY;
  const dist = Math.hypot(dx, dy);
  const offset = dist * 0.35;
  const angle = Math.atan2(dy, dx) - Math.PI / 2;
  const cpX = midX + Math.cos(angle) * offset;
  const cpY = midY + Math.sin(angle) * offset;
  ctx.beginPath();
  ctx.moveTo(el.startX, el.startY);
  ctx.quadraticCurveTo(cpX, cpY, el.endX, el.endY);
  ctx.stroke();
}

// --- Polyline (connected straight line segments) ---

function drawPolyline(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (!el.points || el.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(el.points[0].x, el.points[0].y);
  for (let i = 1; i < el.points.length; i++) {
    ctx.lineTo(el.points[i].x, el.points[i].y);
  }
  ctx.stroke();
}

// --- Text & sticky ---

function drawText(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.text) return;
  const fontSize = el.fontSize || 16;
  ctx.font = buildFontString(el);
  const lineSpacing = el.lineSpacing || 1.4;
  const lineHeight = fontSize * lineSpacing;
  const align = el.textAlign || "left";
  const underline = el.textDecoration === "underline";
  const family = el.fontFamily || "Inter";

  const padding = 4;
  const drawWidth = el.width ? el.width - padding * 2 : 600;

  // Use rich text rendering if available
  if (el.richText) {
    drawRichTextFormatted(ctx, el.richText, el.x + padding, el.y + fontSize + padding, drawWidth, lineHeight, align, fontSize, family, underline);
    return;
  }

  if (el.width && el.height) {
    wrapTextFormatted(ctx, el.text, el.x + padding, el.y + fontSize + padding, drawWidth, lineHeight, align, underline, fontSize);
  } else {
    // Legacy single-line text
    const oldAlign = ctx.textAlign;
    ctx.textAlign = align;
    const xPos = align === "center" ? el.x + 100 : align === "right" ? el.x + 200 : el.x;
    ctx.fillText(el.text, xPos, el.y + fontSize);
    if (underline) {
      const metrics = ctx.measureText(el.text);
      const ux = align === "center" ? xPos - metrics.width / 2 : align === "right" ? xPos - metrics.width : xPos;
      ctx.beginPath();
      ctx.moveTo(ux, el.y + fontSize + 2);
      ctx.lineTo(ux + metrics.width, el.y + fontSize + 2);
      ctx.lineWidth = Math.max(1, fontSize / 14);
      ctx.stroke();
    }
    ctx.textAlign = oldAlign;
  }
}

function drawSticky(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined) return;
  const w = el.width || 180;
  const h = el.height || 160;
  const r = 8;

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = el.stickyColor || "#fef08a";
  ctx.beginPath();
  ctx.moveTo(el.x + r, el.y);
  ctx.lineTo(el.x + w - r, el.y);
  ctx.quadraticCurveTo(el.x + w, el.y, el.x + w, el.y + r);
  ctx.lineTo(el.x + w, el.y + h - r);
  ctx.quadraticCurveTo(el.x + w, el.y + h, el.x + w - r, el.y + h);
  ctx.lineTo(el.x + r, el.y + h);
  ctx.quadraticCurveTo(el.x, el.y + h, el.x, el.y + h - r);
  ctx.lineTo(el.x, el.y + r);
  ctx.quadraticCurveTo(el.x, el.y, el.x + r, el.y);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#000000";
  ctx.fillRect(el.x + 4, el.y + h - 6, w - 8, 4);

  if (el.text) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#1f2937";
    ctx.font = buildFontString(el);
    const fontSize = el.fontSize || 14;
    const lineSpacing = el.lineSpacing || 1.4;
    const lineHeight = fontSize * lineSpacing;
    const align = el.textAlign || "left";
    const underline = el.textDecoration === "underline";
    const family = el.fontFamily || "Inter";

    if (el.richText) {
      drawRichTextFormatted(ctx, el.richText, el.x + 12, el.y + 28, w - 24, lineHeight, align, fontSize, family, underline);
    } else {
      wrapTextFormatted(ctx, el.text, el.x + 12, el.y + 28, w - 24, lineHeight, align, underline, fontSize);
    }
  }
}

function drawShapeLabel(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  const labelText = el.label || el.text;
  if (!labelText || el.x === undefined || el.y === undefined) return;
  const w = el.width || 0;
  const h = el.height || 0;
  ctx.fillStyle = el.color;
  ctx.font = buildFontString(el);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 1;
  ctx.fillText(labelText, el.x + w / 2, el.y + h / 2);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

// --- Image ---

function drawImageElement(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (!el.imageUrl || el.x === undefined || el.y === undefined) return;
  const img = getCachedImage(el.imageUrl);
  if (!img) return; // Not loaded yet; will render on next redraw
  const w = el.width || img.naturalWidth;
  const h = el.height || img.naturalHeight;

  // Draw shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.1)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.drawImage(img, el.x, el.y, w, h);
  ctx.restore();

  // Stroke border
  if (el.strokeWidth > 0) {
    ctx.strokeStyle = el.color || "#d1d5db";
    ctx.lineWidth = el.strokeWidth;
    ctx.strokeRect(el.x, el.y, w, h);
  }
}

// --- Table ---

function drawTable(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined) return;
  const rows = el.tableRows || 3;
  const cols = el.tableCols || 3;
  const w = el.width || cols * 100;
  const h = el.height || rows * 36;
  const cellW = w / cols;
  const cellH = h / rows;

  // Fill background
  ctx.fillStyle = el.fillColor || "#ffffff";
  ctx.fillRect(el.x, el.y, w, h);

  // Header row
  ctx.fillStyle = el.color || "#3b82f6";
  ctx.globalAlpha = 0.12;
  ctx.fillRect(el.x, el.y, w, cellH);
  ctx.globalAlpha = el.opacity;

  // Grid lines
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;
  ctx.strokeRect(el.x, el.y, w, h);

  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(el.x, el.y + r * cellH);
    ctx.lineTo(el.x + w, el.y + r * cellH);
    ctx.stroke();
  }
  for (let c = 1; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo(el.x + c * cellW, el.y);
    ctx.lineTo(el.x + c * cellW, el.y + h);
    ctx.stroke();
  }

  // Cell text
  if (el.tableData) {
    ctx.fillStyle = "#374151";
    ctx.font = `${el.fontSize || 13}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    for (let r = 0; r < rows && r < el.tableData.length; r++) {
      for (let c = 0; c < cols && c < el.tableData[r].length; c++) {
        const text = el.tableData[r][c];
        if (text) {
          const cx = el.x + c * cellW + 8;
          const cy = el.y + r * cellH + cellH / 2;
          ctx.fillText(text, cx, cy);
        }
      }
    }
    ctx.textBaseline = "alphabetic";
  }
}

// --- Chart ---

/** Resolve a color string to a canvas fill style, supporting gradient:from:to format */
function resolveChartColor(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number, y: number, w: number, h: number
): string | CanvasGradient {
  if (color.startsWith("gradient:")) {
    const parts = color.split(":");
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, parts[1]);
    grad.addColorStop(1, parts[2]);
    return grad;
  }
  return color;
}

function drawChart(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined) return;
  const w = el.width || 300;
  const h = el.height || 200;
  const chartType = el.chartType || "bar";
  const data = el.chartData || { labels: ["A", "B", "C", "D"], values: [40, 70, 30, 90], colors: undefined };
  const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const colors = data.colors || defaultColors;

  // Title
  const hasTitle = !!el.chartTitle;
  const tFontSizeForLayout = el.chartTitleFontSize || 14;
  const titleHeight = hasTitle ? tFontSizeForLayout + 10 : 0;

  const pad = 30;
  const chartX = el.x + pad;
  const chartY = el.y + pad + titleHeight;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2 - titleHeight;
  const maxVal = Math.max(...data.values, 1);

  if (hasTitle) {
    ctx.save();
    const tFontFamily = el.chartTitleFontFamily || "Inter";
    const tFontSize = el.chartTitleFontSize || 14;
    const tFontWeight = el.chartTitleFontWeight || "bold";
    const tFontStyle = el.chartTitleFontStyle || "normal";
    const tTextDecoration = el.chartTitleTextDecoration || "none";
    const tTextAlign = el.chartTitleTextAlign || "center";
    ctx.fillStyle = el.chartTitleColor || el.color || "#374151";
    ctx.font = `${tFontStyle === "italic" ? "italic " : ""}${tFontWeight} ${tFontSize}px ${tFontFamily}, system-ui, sans-serif`;
    ctx.textAlign = tTextAlign;
    const titleTextX =
      tTextAlign === "left" ? el.x + pad :
      tTextAlign === "right" ? el.x + w - pad :
      el.x + w / 2;
    ctx.fillText(el.chartTitle!, titleTextX, el.y + pad + 4);
    // Underline
    if (tTextDecoration === "underline") {
      const metrics = ctx.measureText(el.chartTitle!);
      const ulY = el.y + pad + 4 + 3;
      let ulX = titleTextX;
      if (tTextAlign === "center") ulX -= metrics.width / 2;
      else if (tTextAlign === "right") ulX -= metrics.width;
      ctx.strokeStyle = ctx.fillStyle as string;
      ctx.lineWidth = Math.max(1, tFontSize / 14);
      ctx.beginPath();
      ctx.moveTo(ulX, ulY);
      ctx.lineTo(ulX + metrics.width, ulY);
      ctx.stroke();
    }
    ctx.textAlign = "start";
    ctx.restore();
  }

  // Draw axes for bar/column and line charts
  if (chartType !== "pie") {
    ctx.save();
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartH);
    ctx.stroke();
    // X-axis
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartH);
    ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.stroke();
    // Y-axis tick marks and grid lines
    const tickCount = 4;
    const tickFontSize = Math.max(7, Math.min(11, Math.min(chartW, chartH) * 0.045));
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${Math.round(tickFontSize)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "right";
    for (let t = 0; t <= tickCount; t++) {
      const ratio = t / tickCount;
      const yPos = chartY + chartH - ratio * chartH;
      const val = Math.round(maxVal * ratio);
      // Grid line (dashed)
      if (t > 0) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.moveTo(chartX, yPos);
        ctx.lineTo(chartX + chartW, yPos);
        ctx.stroke();
        ctx.restore();
      }
      // Tick label
      ctx.fillText(String(val), chartX - 5, yPos + 3);
    }
    ctx.textAlign = "start";
    ctx.restore();
  }

  // Scale font size proportionally to chart dimensions
  const baseFontSize = Math.max(8, Math.min(14, Math.min(chartW, chartH) * 0.06));
  const labelFont = `${Math.round(baseFontSize)}px Inter, system-ui, sans-serif`;
  const axisLabelOffset = baseFontSize + 4;

  if (chartType === "bar" || chartType === "column") {
    const barW = chartW / data.values.length * 0.7;
    const gap = chartW / data.values.length * 0.3;
    for (let i = 0; i < data.values.length; i++) {
      const barH = (data.values[i] / maxVal) * chartH;
      const bx = chartX + i * (barW + gap) + gap / 2;
      const by = chartY + chartH - barH;
      // Draw bar with rounded top corners
      const cornerR = Math.min(3, barW / 4);
      ctx.beginPath();
      ctx.moveTo(bx, by + cornerR);
      ctx.arcTo(bx, by, bx + cornerR, by, cornerR);
      ctx.arcTo(bx + barW, by, bx + barW, by + cornerR, cornerR);
      ctx.lineTo(bx + barW, by + barH);
      ctx.lineTo(bx, by + barH);
      ctx.closePath();
      ctx.fillStyle = resolveChartColor(ctx, colors[i % colors.length], bx, by, barW, barH);
      ctx.fill();
      // Label below X axis
      ctx.fillStyle = "#6b7280";
      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.fillText(data.labels[i] || "", bx + barW / 2, chartY + chartH + axisLabelOffset);
      // Value on top of bar (only if bar is tall enough)
      if (barH > baseFontSize + 6) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.round(baseFontSize * 0.85)}px Inter, system-ui, sans-serif`;
        ctx.fillText(String(data.values[i]), bx + barW / 2, by + baseFontSize + 2);
      }
    }
    ctx.textAlign = "start";
  } else if (chartType === "line") {
    // Draw line with smooth stroke
    ctx.beginPath();
    for (let i = 0; i < data.values.length; i++) {
      const px = chartX + (i / Math.max(data.values.length - 1, 1)) * chartW;
      const py = chartY + chartH - (data.values[i] / maxVal) * chartH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = resolveChartColor(ctx, colors[0], chartX, chartY, chartW, chartH);
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    // Points and labels
    const pointR = Math.max(3, Math.min(6, baseFontSize * 0.4));
    for (let i = 0; i < data.values.length; i++) {
      const px = chartX + (i / Math.max(data.values.length - 1, 1)) * chartW;
      const py = chartY + chartH - (data.values[i] / maxVal) * chartH;
      // White ring around point
      ctx.beginPath();
      ctx.arc(px, py, pointR + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Colored point
      ctx.beginPath();
      ctx.arc(px, py, pointR, 0, Math.PI * 2);
      ctx.fillStyle = resolveChartColor(ctx, colors[i % colors.length], px - pointR, py - pointR, pointR * 2, pointR * 2);
      ctx.fill();
      // Label below X axis
      ctx.fillStyle = "#6b7280";
      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.fillText(data.labels[i] || "", px, chartY + chartH + axisLabelOffset);
    }
    ctx.textAlign = "start";
  } else if (chartType === "pie") {
    const total = data.values.reduce((s, v) => s + v, 0) || 1;
    const cx = chartX + chartW / 2;
    const cy = chartY + chartH / 2;
    const radius = Math.min(chartW, chartH) / 2 - 5;
    let startAngle = -Math.PI / 2;
    // Draw slices
    for (let i = 0; i < data.values.length; i++) {
      const sliceAngle = (data.values[i] / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = resolveChartColor(ctx, colors[i % colors.length], cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle += sliceAngle;
    }
    // Draw labels — font size proportional to radius and slice size
    startAngle = -Math.PI / 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < data.values.length; i++) {
      const sliceAngle = (data.values[i] / total) * Math.PI * 2;
      const slicePercent = data.values[i] / total;
      const midAngle = startAngle + sliceAngle / 2;
      const label = data.labels[i] || "";
      // Only show label if slice is big enough
      if (label && sliceAngle > 0.25) {
        // Font size scales with radius and slice proportion
        const pieFontSize = Math.max(8, Math.min(16, radius * 0.14 * Math.min(1, slicePercent * 6)));
        ctx.font = `600 ${Math.round(pieFontSize)}px Inter, system-ui, sans-serif`;
        // Position label at ~60% of radius from center
        const labelR = radius * 0.6;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);
        // White text shadow for readability
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, lx, ly);
        ctx.restore();
        // Show percentage below label for larger slices
        if (slicePercent > 0.08 && radius > 50) {
          const pctFontSize = Math.round(pieFontSize * 0.75);
          ctx.font = `${pctFontSize}px Inter, system-ui, sans-serif`;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 2;
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(`${Math.round(slicePercent * 100)}%`, lx, ly + pieFontSize + 1);
          ctx.restore();
        }
      }
      startAngle += sliceAngle;
    }
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }
}

// ---------------------------------------------------------------------------
// Rich text (HTML) parsing and canvas rendering
// ---------------------------------------------------------------------------

interface StyledSegment {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

interface StyledWord {
  word: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  trailingSpace: boolean;
}

/** Parse HTML from contentEditable into styled segments */
export function parseRichText(html: string): StyledSegment[] {
  if (typeof DOMParser === "undefined") {
    return [{ text: html.replace(/<[^>]*>/g, ""), bold: false, italic: false, underline: false }];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const segments: StyledSegment[] = [];

  function walk(node: Node, bold: boolean, italic: boolean, underline: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent || "";
      if (t) segments.push({ text: t, bold, italic, underline });
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      let b = bold, i = italic, u = underline;
      if (tag === "b" || tag === "strong") b = true;
      if (tag === "i" || tag === "em") i = true;
      if (tag === "u") u = true;
      // Check inline style (execCommand sometimes uses style instead of tags)
      const style = el.style;
      if (style.fontWeight === "bold" || parseInt(style.fontWeight) >= 700) b = true;
      if (style.fontStyle === "italic") i = true;
      if (style.textDecoration?.includes("underline") || style.textDecorationLine?.includes("underline")) u = true;
      // Handle <br> and <div> as newlines
      if (tag === "br") {
        segments.push({ text: "\n", bold, italic, underline });
        return;
      }
      if ((tag === "div" || tag === "p") && segments.length > 0) {
        const last = segments[segments.length - 1];
        if (last.text && !last.text.endsWith("\n")) {
          segments.push({ text: "\n", bold: false, italic: false, underline: false });
        }
      }
      for (const child of Array.from(el.childNodes)) {
        walk(child, b, i, u);
      }
    }
  }

  walk(doc.body, false, false, false);
  return segments;
}

/** Split styled segments into words with style info */
function segmentsToWords(segments: StyledSegment[]): StyledWord[] {
  const words: StyledWord[] = [];
  for (const seg of segments) {
    if (seg.text === "\n") {
      words.push({ word: "\n", bold: seg.bold, italic: seg.italic, underline: seg.underline, trailingSpace: false });
      continue;
    }
    const parts = seg.text.split(/( +)/);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      if (/^ +$/.test(part)) {
        // Attach trailing space to previous word
        if (words.length > 0 && words[words.length - 1].word !== "\n") {
          words[words.length - 1].trailingSpace = true;
        }
      } else {
        words.push({ word: part, bold: seg.bold, italic: seg.italic, underline: seg.underline, trailingSpace: false });
      }
    }
  }
  return words;
}

/** Build a font string for a styled word */
function buildWordFont(
  word: { bold: boolean; italic: boolean },
  baseFontSize: number,
  baseFontFamily: string
): string {
  const style = word.italic ? "italic " : "";
  const weight = word.bold ? "bold " : "";
  return `${style}${weight}${baseFontSize}px ${baseFontFamily}, system-ui, sans-serif`;
}

/** Render rich text (HTML) on canvas with word wrapping and mixed styles */
function drawRichTextFormatted(
  ctx: CanvasRenderingContext2D,
  html: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: TextAlign,
  baseFontSize: number,
  baseFontFamily: string,
  baseUnderline: boolean
) {
  const segments = parseRichText(html);
  const words = segmentsToWords(segments);
  if (words.length === 0) return;

  const oldAlign = ctx.textAlign;
  ctx.textAlign = "left"; // We'll manually position for alignment

  // Build lines by measuring words
  interface LineWord { word: string; bold: boolean; italic: boolean; underline: boolean; width: number; spaceWidth: number; }
  type Line = LineWord[];
  const lines: Line[] = [];
  let currentLine: LineWord[] = [];
  let currentLineWidth = 0;

  for (const w of words) {
    if (w.word === "\n") {
      lines.push(currentLine);
      currentLine = [];
      currentLineWidth = 0;
      continue;
    }
    ctx.font = buildWordFont(w, baseFontSize, baseFontFamily);
    const wordWidth = ctx.measureText(w.word).width;
    const spaceWidth = w.trailingSpace ? ctx.measureText(" ").width : 0;
    const totalWord = wordWidth + spaceWidth;

    if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      currentLineWidth = 0;
    }
    currentLine.push({ word: w.word, bold: w.bold, italic: w.italic, underline: w.underline || baseUnderline, width: wordWidth, spaceWidth });
    currentLineWidth += totalWord;
  }
  if (currentLine.length > 0) lines.push(currentLine);

  // Render lines
  let currentY = y;
  for (const line of lines) {
    const lineWidth = line.reduce((sum, w) => sum + w.width + w.spaceWidth, 0) - (line.length > 0 ? line[line.length - 1].spaceWidth : 0);
    let drawX = x;
    if (align === "center") drawX = x + (maxWidth - lineWidth) / 2;
    else if (align === "right") drawX = x + maxWidth - lineWidth;

    for (const lw of line) {
      ctx.font = buildWordFont(lw, baseFontSize, baseFontFamily);
      ctx.fillText(lw.word, drawX, currentY);

      if (lw.underline) {
        const savedStroke = ctx.strokeStyle;
        const savedLW = ctx.lineWidth;
        ctx.strokeStyle = ctx.fillStyle as string;
        ctx.lineWidth = Math.max(1, baseFontSize / 14);
        ctx.beginPath();
        ctx.moveTo(drawX, currentY + 2);
        ctx.lineTo(drawX + lw.width, currentY + 2);
        ctx.stroke();
        ctx.strokeStyle = savedStroke;
        ctx.lineWidth = savedLW;
      }

      drawX += lw.width + lw.spaceWidth;
    }
    currentY += lineHeight;
  }

  ctx.textAlign = oldAlign;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  wrapTextFormatted(ctx, text, x, y, maxWidth, lineHeight, "left", false, 16);
}

function wrapTextFormatted(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: TextAlign,
  underline: boolean,
  fontSize: number
) {
  const oldAlign = ctx.textAlign;
  ctx.textAlign = align;
  const anchorX = align === "center" ? x + maxWidth / 2 : align === "right" ? x + maxWidth : x;

  const drawLine = (lineText: string, ly: number) => {
    ctx.fillText(lineText, anchorX, ly);
    if (underline && lineText) {
      const metrics = ctx.measureText(lineText);
      const ux = align === "center" ? anchorX - metrics.width / 2 : align === "right" ? anchorX - metrics.width : anchorX;
      const savedStroke = ctx.strokeStyle;
      const savedLW = ctx.lineWidth;
      ctx.strokeStyle = ctx.fillStyle as string;
      ctx.lineWidth = Math.max(1, fontSize / 14);
      ctx.beginPath();
      ctx.moveTo(ux, ly + 2);
      ctx.lineTo(ux + metrics.width, ly + 2);
      ctx.stroke();
      ctx.strokeStyle = savedStroke;
      ctx.lineWidth = savedLW;
    }
  };

  // Split by newlines first to preserve explicit line breaks
  const paragraphs = text.split("\n");
  let currentY = y;

  for (const paragraph of paragraphs) {
    if (paragraph === "") {
      // Empty line — just advance Y
      drawLine("", currentY);
      currentY += lineHeight;
      continue;
    }
    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        drawLine(line.trim(), currentY);
        line = word + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    drawLine(line.trim(), currentY);
    currentY += lineHeight;
  }

  ctx.textAlign = oldAlign;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize negative width/height to positive with adjusted origin */
function normalizeRect(x: number, y: number, w: number, h: number) {
  return {
    x: w < 0 ? x + w : x,
    y: h < 0 ? y + h : y,
    width: Math.abs(w),
    height: Math.abs(h),
  };
}

// ---------------------------------------------------------------------------
// Bounding box, hit test, coordinate conversion
// ---------------------------------------------------------------------------

export function getBoundingBox(el: WhiteboardElement): { x: number; y: number; width: number; height: number } | null {
  // Path-based elements
  if (el.type === "pen" || el.type === "highlighter" || el.type === "polyline" || el.type === "scribble") {
    if (!el.points || el.points.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of el.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  // Bounding-box shapes — normalize negative dimensions from right-to-left drawing
  if (BBOX_SHAPE_TOOLS.includes(el.type) || el.type === "sticky" || el.type === "image" || el.type === "table" || el.type === "chart") {
    if (el.x === undefined || el.y === undefined) return null;
    const w = el.width || 0;
    const h = el.height || 0;
    return {
      x: w < 0 ? el.x + w : el.x,
      y: h < 0 ? el.y + h : el.y,
      width: Math.abs(w),
      height: Math.abs(h),
    };
  }

  // Line-based shapes
  if (LINE_TOOLS.includes(el.type)) {
    if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
    return {
      x: Math.min(el.startX, el.endX),
      y: Math.min(el.startY, el.endY),
      width: Math.abs(el.endX - el.startX),
      height: Math.abs(el.endY - el.startY),
    };
  }

  // Text
  if (el.type === "text") {
    if (el.x === undefined || el.y === undefined) return null;
    const w = el.width || 200;
    const h = el.height || (el.fontSize || 16) + 8;
    return { x: el.x, y: el.y, width: w, height: h };
  }

  return null;
}

export function hitTest(
  point: Point,
  el: WhiteboardElement,
  tolerance: number = 8
): boolean {
  const bbox = getBoundingBox(el);
  if (!bbox) return false;
  return (
    point.x >= bbox.x - tolerance &&
    point.x <= bbox.x + bbox.width + tolerance &&
    point.y >= bbox.y - tolerance &&
    point.y <= bbox.y + bbox.height + tolerance
  );
}

export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewport: { x: number; y: number; zoom: number },
  canvasRect: DOMRect
): Point {
  return {
    x: (screenX - canvasRect.left - viewport.x) / viewport.zoom,
    y: (screenY - canvasRect.top - viewport.y) / viewport.zoom,
  };
}

// ---------------------------------------------------------------------------
// Resize handles — positions, drawing, hit testing
// ---------------------------------------------------------------------------

export function getResizeHandles(
  el: WhiteboardElement
): { handle: ResizeHandle; x: number; y: number }[] {
  // Line-based elements: handles at start and end points
  if (LINE_TOOLS.includes(el.type)) {
    if (el.startX === undefined || el.endX === undefined) return [];
    return [
      { handle: 'line-start', x: el.startX, y: el.startY ?? 0 },
      { handle: 'line-end', x: el.endX, y: el.endY ?? 0 },
    ];
  }

  const bbox = getBoundingBox(el);
  if (!bbox) return [];
  const { x, y, width: w, height: h } = bbox;
  return [
    { handle: 'nw', x, y },
    { handle: 'n', x: x + w / 2, y },
    { handle: 'ne', x: x + w, y },
    { handle: 'e', x: x + w, y: y + h / 2 },
    { handle: 'se', x: x + w, y: y + h },
    { handle: 's', x: x + w / 2, y: y + h },
    { handle: 'sw', x, y: y + h },
    { handle: 'w', x, y: y + h / 2 },
  ];
}

export function drawResizeHandles(
  ctx: CanvasRenderingContext2D,
  el: WhiteboardElement,
  viewport: { x: number; y: number; zoom: number }
) {
  const handles = getResizeHandles(el);
  if (handles.length === 0) return;

  ctx.save();
  ctx.translate(viewport.x, viewport.y);
  ctx.scale(viewport.zoom, viewport.zoom);

  const size = 8 / viewport.zoom;
  const half = size / 2;

  for (const h of handles) {
    ctx.beginPath();
    ctx.rect(h.x - half, h.y - half, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5 / viewport.zoom;
    ctx.setLineDash([]);
    ctx.stroke();
  }

  ctx.restore();
}

export function hitTestResizeHandle(
  pt: Point,
  el: WhiteboardElement,
  zoom: number
): ResizeHandle | null {
  const handles = getResizeHandles(el);
  const tolerance = 10 / zoom;
  for (const h of handles) {
    if (Math.abs(pt.x - h.x) <= tolerance && Math.abs(pt.y - h.y) <= tolerance) {
      return h.handle;
    }
  }
  return null;
}
