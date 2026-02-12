import type { WhiteboardElement, Point, WhiteboardTool } from "./whiteboard-types";
import { BBOX_SHAPE_TOOLS, LINE_TOOLS } from "./whiteboard-types";

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

// --- Text & sticky ---

function drawText(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined || !el.text) return;
  ctx.font = `${el.fontSize || 16}px Inter, system-ui, sans-serif`;
  ctx.fillText(el.text, el.x, el.y + (el.fontSize || 16));
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
    ctx.font = `${el.fontSize || 14}px Inter, system-ui, sans-serif`;
    wrapText(ctx, el.text, el.x + 12, el.y + 28, w - 24, (el.fontSize || 14) * 1.4);
  }
}

function drawShapeLabel(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  const labelText = el.label || el.text;
  if (!labelText || el.x === undefined || el.y === undefined) return;
  const w = el.width || 0;
  const h = el.height || 0;
  ctx.fillStyle = el.color;
  ctx.font = `${el.fontSize || 14}px Inter, system-ui, sans-serif`;
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

function drawChart(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  if (el.x === undefined || el.y === undefined) return;
  const w = el.width || 300;
  const h = el.height || 200;
  const chartType = el.chartType || "bar";
  const data = el.chartData || { labels: ["A", "B", "C", "D"], values: [40, 70, 30, 90], colors: undefined };
  const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const colors = data.colors || defaultColors;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(el.x, el.y, w, h);
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.strokeRect(el.x, el.y, w, h);

  const pad = 30;
  const chartX = el.x + pad;
  const chartY = el.y + pad;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const maxVal = Math.max(...data.values, 1);

  if (chartType === "bar" || chartType === "column") {
    const barW = chartW / data.values.length * 0.7;
    const gap = chartW / data.values.length * 0.3;
    for (let i = 0; i < data.values.length; i++) {
      const barH = (data.values[i] / maxVal) * chartH;
      const bx = chartX + i * (barW + gap) + gap / 2;
      const by = chartY + chartH - barH;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(bx, by, barW, barH);
      // Label
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(data.labels[i] || "", bx + barW / 2, chartY + chartH + 14);
    }
    ctx.textAlign = "start";
  } else if (chartType === "line") {
    ctx.beginPath();
    for (let i = 0; i < data.values.length; i++) {
      const px = chartX + (i / Math.max(data.values.length - 1, 1)) * chartW;
      const py = chartY + chartH - (data.values[i] / maxVal) * chartH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Points
    for (let i = 0; i < data.values.length; i++) {
      const px = chartX + (i / Math.max(data.values.length - 1, 1)) * chartW;
      const py = chartY + chartH - (data.values[i] / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[0];
      ctx.fill();
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(data.labels[i] || "", px, chartY + chartH + 14);
    }
    ctx.textAlign = "start";
  } else if (chartType === "pie") {
    const total = data.values.reduce((s, v) => s + v, 0) || 1;
    const cx = el.x + w / 2;
    const cy = el.y + h / 2;
    const radius = Math.min(chartW, chartH) / 2 - 5;
    let startAngle = -Math.PI / 2;
    for (let i = 0; i < data.values.length; i++) {
      const sliceAngle = (data.values[i] / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle += sliceAngle;
    }
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
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
  if (el.type === "pen" || el.type === "highlighter") {
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
    return { x: el.x, y: el.y, width: 200, height: el.fontSize || 16 };
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
