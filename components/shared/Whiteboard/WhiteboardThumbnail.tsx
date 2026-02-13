"use client";

import type { WhiteboardElement, Viewport } from "./whiteboard-types";
import { getBoundingBox, getStrokeDashArray } from "./whiteboard-utils";

interface WhiteboardThumbnailProps {
  elements: WhiteboardElement[];
  viewport?: Viewport;
  className?: string;
}

/**
 * SVG-based miniature rendering of whiteboard elements.
 * Used in video/voice call thumbnails — no canvas API, pure React.
 */
export default function WhiteboardThumbnail({
  elements,
  className = "",
}: WhiteboardThumbnailProps) {
  // Compute bounding box of all elements to auto-fit
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const el of elements) {
    const bbox = getBoundingBox(el);
    if (!bbox) continue;
    minX = Math.min(minX, bbox.x);
    minY = Math.min(minY, bbox.y);
    maxX = Math.max(maxX, bbox.x + bbox.width);
    maxY = Math.max(maxY, bbox.y + bbox.height);
  }

  // If no elements, show empty state with visible dot grid + pen icon
  if (!isFinite(minX)) {
    return (
      <svg className={className} viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="90" fill="#f9fafb" />
        <DotGrid width={160} height={90} />
        {/* Subtle pen icon in center */}
        <g transform="translate(68, 28)" opacity={0.15}>
          <path d="M12 19l7-7 3 3-7 7-3-3z" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 2l7.586 7.586" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="2" fill="none" stroke="#6b7280" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  // Add padding around content
  const pad = 20;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  const contentW = maxX - minX || 1;
  const contentH = maxY - minY || 1;

  return (
    <svg
      className={className}
      viewBox={`${minX} ${minY} ${contentW} ${contentH}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x={minX} y={minY} width={contentW} height={contentH} fill="white" />
      <DotGrid width={contentW} height={contentH} offsetX={minX} offsetY={minY} />
      {elements.map((el) => (
        <ElementSVG key={el.id} el={el} />
      ))}
    </svg>
  );
}

function DotGrid({
  width,
  height,
  offsetX = 0,
  offsetY = 0,
}: {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
}) {
  const spacing = 24;
  const dots: { cx: number; cy: number }[] = [];
  const startX = Math.ceil(offsetX / spacing) * spacing;
  const startY = Math.ceil(offsetY / spacing) * spacing;

  for (let x = startX; x < offsetX + width; x += spacing) {
    for (let y = startY; y < offsetY + height; y += spacing) {
      dots.push({ cx: x, cy: y });
    }
  }

  return (
    <g opacity={0.18}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={1.2} fill="#9ca3af" />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Helpers for normalised bounding box (handles negative width/height)
// ---------------------------------------------------------------------------

function normaliseBBox(el: WhiteboardElement) {
  const x = el.x ?? 0;
  const y = el.y ?? 0;
  const w = el.width ?? 0;
  const h = el.height ?? 0;
  return {
    x: w >= 0 ? x : x + w,
    y: h >= 0 ? y : y + h,
    w: Math.abs(w),
    h: Math.abs(h),
  };
}

/** Common fill helper */
function fill(el: WhiteboardElement) {
  return el.fillColor || "none";
}

// ---------------------------------------------------------------------------
// Centered label text used by flowchart shapes
// ---------------------------------------------------------------------------

function LabelText({
  el,
  cx,
  cy,
}: {
  el: WhiteboardElement;
  cx: number;
  cy: number;
}) {
  if (!el.label) return null;
  return (
    <text
      x={cx}
      y={cy}
      fill={el.color}
      fontSize={el.fontSize || 14}
      fontFamily={`${el.fontFamily || "Inter"}, system-ui, sans-serif`}
      fontWeight={el.fontWeight || "normal"}
      fontStyle={el.fontStyle || "normal"}
      textAnchor="middle"
      dominantBaseline="central"
      opacity={el.opacity}
    >
      {el.label.length > 24 ? el.label.slice(0, 24) + "..." : el.label}
    </text>
  );
}

// ---------------------------------------------------------------------------
// Element dispatcher
// ---------------------------------------------------------------------------

function ElementSVG({ el }: { el: WhiteboardElement }) {
  switch (el.type) {
    // --- existing renderers ---
    case "pen":
    case "highlighter":
      return <PathSVG el={el} />;
    case "rectangle":
      return <RectSVG el={el} />;
    case "circle":
      return <EllipseSVG el={el} />;
    case "line":
      return <LineSVG el={el} />;
    case "arrow":
      return <ArrowSVG el={el} />;
    case "text":
      return <TextSVG el={el} />;
    case "sticky":
      return <StickySVG el={el} />;

    // --- new basic shapes ---
    case "triangle":
      return <TriangleSVG el={el} />;
    case "diamond":
      return <DiamondSVG el={el} />;
    case "star":
      return <StarSVG el={el} />;
    case "hexagon":
      return <HexagonSVG el={el} />;
    case "rounded-rect":
      return <RoundedRectSVG el={el} />;
    case "cylinder":
      return <CylinderSVG el={el} />;
    case "parallelogram":
      return <ParallelogramSVG el={el} />;

    // --- new line / arrow variants ---
    case "double-arrow":
      return <DoubleArrowSVG el={el} />;
    case "connector":
      return <ConnectorSVG el={el} />;
    case "curved-connector":
      return <CurvedConnectorSVG el={el} />;
    case "curve":
      return <CurveSVG el={el} />;
    case "polyline":
      return <PolylineSVG el={el} />;
    case "scribble":
      return <PathSVG el={el} />;

    // --- flowchart shapes ---
    case "flowchart-process":
      return <FlowchartProcessSVG el={el} />;
    case "flowchart-decision":
      return <FlowchartDecisionSVG el={el} />;
    case "flowchart-terminal":
      return <FlowchartTerminalSVG el={el} />;
    case "flowchart-data":
      return <FlowchartDataSVG el={el} />;
    case "flowchart-document":
      return <FlowchartDocumentSVG el={el} />;

    // --- new element types ---
    case "image":
      return <ImageSVG el={el} />;
    case "table":
      return <TableSVG el={el} />;
    case "chart":
      return <ChartSVG el={el} />;

    default:
      return null;
  }
}

// ===========================================================================
// Existing renderers (unchanged)
// ===========================================================================

/** Helper to get stroke-dasharray for an element */
function dash(el: WhiteboardElement): string | undefined {
  return getStrokeDashArray(el.strokeDash, el.strokeWidth);
}

function PathSVG({ el }: { el: WhiteboardElement }) {
  if (!el.points || el.points.length < 2) return null;
  let d = `M ${el.points[0].x} ${el.points[0].y}`;
  for (let i = 1; i < el.points.length; i++) {
    const prev = el.points[i - 1];
    const curr = el.points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function RectSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  return (
    <rect
      x={el.width > 0 ? el.x : el.x + el.width}
      y={el.height > 0 ? el.y : el.y + el.height}
      width={Math.abs(el.width)}
      height={Math.abs(el.height)}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function EllipseSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={Math.abs(el.width) / 2}
      ry={Math.abs(el.height) / 2}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function LineSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  return (
    <line
      x1={el.startX}
      y1={el.startY}
      x2={el.endX}
      y2={el.endY}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function ArrowSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  const angle = Math.atan2(el.endY - el.startY, el.endX - el.startX);
  const headLen = Math.max(12, el.strokeWidth * 3);
  const ax = el.endX - headLen * Math.cos(angle - Math.PI / 6);
  const ay = el.endY - headLen * Math.sin(angle - Math.PI / 6);
  const bx = el.endX - headLen * Math.cos(angle + Math.PI / 6);
  const by = el.endY - headLen * Math.sin(angle + Math.PI / 6);
  return (
    <g opacity={el.opacity}>
      <line
        x1={el.startX}
        y1={el.startY}
        x2={el.endX}
        y2={el.endY}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
        strokeLinecap="round"
      />
      <line x1={el.endX} y1={el.endY} x2={ax} y2={ay} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
      <line x1={el.endX} y1={el.endY} x2={bx} y2={by} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
    </g>
  );
}

function TextSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.text) return null;
  const align = el.textAlign || "left";
  const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
  const xPos = align === "center" ? el.x + (el.width || 200) / 2 : align === "right" ? el.x + (el.width || 200) : el.x;
  return (
    <text
      x={xPos}
      y={el.y + (el.fontSize || 16)}
      fill={el.color}
      fontSize={el.fontSize || 16}
      fontFamily={`${el.fontFamily || "Inter"}, system-ui, sans-serif`}
      fontWeight={el.fontWeight || "normal"}
      fontStyle={el.fontStyle || "normal"}
      textDecoration={el.textDecoration === "underline" ? "underline" : undefined}
      textAnchor={anchor}
      opacity={el.opacity}
    >
      {el.text}
    </text>
  );
}

function StickySVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined) return null;
  const w = el.width || 180;
  const h = el.height || 160;
  return (
    <g>
      <rect
        x={el.x}
        y={el.y}
        width={w}
        height={h}
        rx={8}
        ry={8}
        fill={el.stickyColor || "#fef08a"}
        opacity={0.95}
      />
      {el.text && (
        <text
          x={el.x + 12}
          y={el.y + 28}
          fill="#1f2937"
          fontSize={el.fontSize || 14}
          fontFamily={`${el.fontFamily || "Inter"}, system-ui, sans-serif`}
          fontWeight={el.fontWeight || "normal"}
          fontStyle={el.fontStyle || "normal"}
          textDecoration={el.textDecoration === "underline" ? "underline" : undefined}
        >
          {el.text.length > 30 ? el.text.slice(0, 30) + "..." : el.text}
        </text>
      )}
    </g>
  );
}

// ===========================================================================
// New basic shape renderers
// ===========================================================================

/** Triangle: 3-point polygon inscribed in bounding box */
function TriangleSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const points = `${x + w / 2},${y} ${x},${y + h} ${x + w},${y + h}`;
  return (
    <polygon
      points={points}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

/** Diamond: 4-point polygon (mid-top, mid-right, mid-bottom, mid-left) */
function DiamondSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const points = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
  return (
    <polygon
      points={points}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

/** Star: 10-point polygon with alternating outer/inner radii at 36 deg intervals */
function StarSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const outerRx = w / 2;
  const outerRy = h / 2;
  const innerRx = outerRx * 0.4;
  const innerRy = outerRy * 0.4;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    // Start from top (-90 deg) and go clockwise at 36 deg steps
    const angle = (Math.PI / 180) * (i * 36 - 90);
    const isOuter = i % 2 === 0;
    const rx = isOuter ? outerRx : innerRx;
    const ry = isOuter ? outerRy : innerRy;
    pts.push(`${cx + rx * Math.cos(angle)},${cy + ry * Math.sin(angle)}`);
  }
  return (
    <polygon
      points={pts.join(" ")}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

/** Hexagon: 6-point polygon at 60 deg intervals */
function HexagonSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    // Start from right (0 deg) and go at 60 deg steps; offset by -30 to get flat-top
    const angle = (Math.PI / 180) * (i * 60 - 90);
    pts.push(`${cx + rx * Math.cos(angle)},${cy + ry * Math.sin(angle)}`);
  }
  return (
    <polygon
      points={pts.join(" ")}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

/** Rounded-rect: rect with configurable border radius */
function RoundedRectSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const r = el.borderRadius || 12;
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      ry={r}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

/** Cylinder: ellipse top + rect body + curved bottom path */
function CylinderSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  // Top ellipse takes ~20% of height
  const ellipseRy = Math.min(h * 0.15, 20);
  const bodyTop = y + ellipseRy;
  const bodyBottom = y + h - ellipseRy;
  const cx = x + w / 2;

  return (
    <g opacity={el.opacity}>
      {/* Body rectangle */}
      <rect
        x={x}
        y={bodyTop}
        width={w}
        height={bodyBottom - bodyTop}
        fill={fill(el)}
        stroke="none"
      />
      {/* Left and right edges of body */}
      <line x1={x} y1={bodyTop} x2={x} y2={bodyBottom} stroke={el.color} strokeWidth={el.strokeWidth} />
      <line x1={x + w} y1={bodyTop} x2={x + w} y2={bodyBottom} stroke={el.color} strokeWidth={el.strokeWidth} />
      {/* Bottom curve (half ellipse, concave up) */}
      <path
        d={`M ${x} ${bodyBottom} A ${w / 2} ${ellipseRy} 0 0 0 ${x + w} ${bodyBottom}`}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
      />
      {/* Top ellipse (full) — drawn last to layer on top */}
      <ellipse
        cx={cx}
        cy={bodyTop}
        rx={w / 2}
        ry={ellipseRy}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
      />
    </g>
  );
}

/** Parallelogram: polygon with 20% width offset */
function ParallelogramSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const offset = w * 0.2;
  const points = `${x + offset},${y} ${x + w},${y} ${x + w - offset},${y + h} ${x},${y + h}`;
  return (
    <polygon
      points={points}
      fill={fill(el)}
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

// ===========================================================================
// New line / arrow variant renderers
// ===========================================================================

/** Double-arrow: line with arrowheads on both ends */
function DoubleArrowSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  const angle = Math.atan2(el.endY - el.startY, el.endX - el.startX);
  const headLen = Math.max(12, el.strokeWidth * 3);

  // End arrowhead
  const eax = el.endX - headLen * Math.cos(angle - Math.PI / 6);
  const eay = el.endY - headLen * Math.sin(angle - Math.PI / 6);
  const ebx = el.endX - headLen * Math.cos(angle + Math.PI / 6);
  const eby = el.endY - headLen * Math.sin(angle + Math.PI / 6);

  // Start arrowhead (reverse direction)
  const reverseAngle = angle + Math.PI;
  const sax = el.startX - headLen * Math.cos(reverseAngle - Math.PI / 6);
  const say = el.startY - headLen * Math.sin(reverseAngle - Math.PI / 6);
  const sbx = el.startX - headLen * Math.cos(reverseAngle + Math.PI / 6);
  const sby = el.startY - headLen * Math.sin(reverseAngle + Math.PI / 6);

  return (
    <g opacity={el.opacity}>
      <line
        x1={el.startX}
        y1={el.startY}
        x2={el.endX}
        y2={el.endY}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
        strokeLinecap="round"
      />
      {/* End arrowhead */}
      <line x1={el.endX} y1={el.endY} x2={eax} y2={eay} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
      <line x1={el.endX} y1={el.endY} x2={ebx} y2={eby} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
      {/* Start arrowhead */}
      <line x1={el.startX} y1={el.startY} x2={sax} y2={say} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
      <line x1={el.startX} y1={el.startY} x2={sbx} y2={sby} stroke={el.color} strokeWidth={el.strokeWidth} strokeLinecap="round" />
    </g>
  );
}

/** Connector: L-shaped elbow polyline (horizontal → vertical → horizontal) */
function ConnectorSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  const midX = (el.startX + el.endX) / 2;
  const points = `${el.startX},${el.startY} ${midX},${el.startY} ${midX},${el.endY} ${el.endX},${el.endY}`;
  return (
    <polyline
      points={points}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function CurvedConnectorSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  const midX = (el.startX + el.endX) / 2;
  const d = `M ${el.startX} ${el.startY} C ${midX} ${el.startY}, ${midX} ${el.endY}, ${el.endX} ${el.endY}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function CurveSVG({ el }: { el: WhiteboardElement }) {
  if (el.startX === undefined || el.startY === undefined || el.endX === undefined || el.endY === undefined) return null;
  const midX = (el.startX + el.endX) / 2;
  const midY = (el.startY + el.endY) / 2;
  const dx = el.endX - el.startX;
  const dy = el.endY - el.startY;
  const dist = Math.hypot(dx, dy);
  const offset = dist * 0.35;
  const angle = Math.atan2(dy, dx) - Math.PI / 2;
  const cpX = midX + Math.cos(angle) * offset;
  const cpY = midY + Math.sin(angle) * offset;
  const d = `M ${el.startX} ${el.startY} Q ${cpX} ${cpY}, ${el.endX} ${el.endY}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

function PolylineSVG({ el }: { el: WhiteboardElement }) {
  if (!el.points || el.points.length < 2) return null;
  const pts = el.points.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <polyline
      points={pts}
      fill="none"
      stroke={el.color}
      strokeWidth={el.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash(el)}
      opacity={el.opacity}
    />
  );
}

// ===========================================================================
// Flowchart shape renderers
// ===========================================================================

/** Flowchart Process: filled rectangle with optional label */
function FlowchartProcessSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  return (
    <g opacity={el.opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
      />
      <LabelText el={el} cx={x + w / 2} cy={y + h / 2} />
    </g>
  );
}

/** Flowchart Decision: filled diamond with optional label */
function FlowchartDecisionSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const points = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
  return (
    <g opacity={el.opacity}>
      <polygon
        points={points}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
        strokeLinejoin="round"
      />
      <LabelText el={el} cx={x + w / 2} cy={y + h / 2} />
    </g>
  );
}

/** Flowchart Terminal: pill / stadium shape (rounded-rect with radius = height/2) with optional label */
function FlowchartTerminalSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const r = h / 2;
  return (
    <g opacity={el.opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
      />
      <LabelText el={el} cx={x + w / 2} cy={y + h / 2} />
    </g>
  );
}

/** Flowchart Data: filled parallelogram with optional label */
function FlowchartDataSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const offset = w * 0.2;
  const points = `${x + offset},${y} ${x + w},${y} ${x + w - offset},${y + h} ${x},${y + h}`;
  return (
    <g opacity={el.opacity}>
      <polygon
        points={points}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
        strokeLinejoin="round"
      />
      <LabelText el={el} cx={x + w / 2} cy={y + h / 2} />
    </g>
  );
}

/** Flowchart Document: filled rectangle with wavy bottom edge + optional label */
function FlowchartDocumentSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined || !el.width || !el.height) return null;
  const { x, y, w, h } = normaliseBBox(el);
  // Reserve bottom ~12% for the wave
  const waveH = h * 0.12;
  const bodyH = h - waveH;

  // Build path: top-left → top-right → right side down → wavy bottom → left side up
  const d = [
    `M ${x} ${y}`,
    `L ${x + w} ${y}`,
    `L ${x + w} ${y + bodyH}`,
    // Wavy bottom: cubic bezier creating a wave shape
    `C ${x + w * 0.75} ${y + bodyH + waveH * 2}, ${x + w * 0.25} ${y + bodyH - waveH}, ${x} ${y + bodyH}`,
    `Z`,
  ].join(" ");

  return (
    <g opacity={el.opacity}>
      <path
        d={d}
        fill={fill(el)}
        stroke={el.color}
        strokeWidth={el.strokeWidth}
        strokeLinejoin="round"
      />
      <LabelText el={el} cx={x + w / 2} cy={y + bodyH / 2} />
    </g>
  );
}

// ===========================================================================
// Image, Table, Chart renderers
// ===========================================================================

/** Image: placeholder rectangle with icon (actual image not loaded in SVG thumbnail) */
function ImageSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined) return null;
  const { x, y, w, h } = normaliseBBox(el);
  return (
    <g opacity={el.opacity}>
      <rect
        x={x} y={y} width={w} height={h}
        fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1} rx={4}
      />
      {/* Simple image icon */}
      <g transform={`translate(${x + w / 2 - 10}, ${y + h / 2 - 10})`} opacity={0.3}>
        <rect width="20" height="20" rx="2" fill="none" stroke="#6b7280" strokeWidth="1.5" />
        <circle cx="7" cy="7" r="2" fill="#6b7280" />
        <polyline points="3,16 8,10 12,14 15,11 17,14" fill="none" stroke="#6b7280" strokeWidth="1.5" />
      </g>
    </g>
  );
}

/** Table: grid of cells */
function TableSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const rows = el.tableRows || 3;
  const cols = el.tableCols || 3;
  const cellW = w / cols;
  const cellH = h / rows;

  const lines: React.ReactNode[] = [];
  // Horizontal lines
  for (let r = 0; r <= rows; r++) {
    lines.push(
      <line key={`h${r}`} x1={x} y1={y + r * cellH} x2={x + w} y2={y + r * cellH}
        stroke="#d1d5db" strokeWidth={1} />
    );
  }
  // Vertical lines
  for (let c = 0; c <= cols; c++) {
    lines.push(
      <line key={`v${c}`} x1={x + c * cellW} y1={y} x2={x + c * cellW} y2={y + h}
        stroke="#d1d5db" strokeWidth={1} />
    );
  }

  return (
    <g opacity={el.opacity}>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" />
      <rect x={x} y={y} width={w} height={cellH} fill="#eff6ff" />
      {lines}
    </g>
  );
}

/** Chart: simplified bar/line/pie representation */
function ChartSVG({ el }: { el: WhiteboardElement }) {
  if (el.x === undefined || el.y === undefined) return null;
  const { x, y, w, h } = normaliseBBox(el);
  const chartType = el.chartType || "bar";
  const data = el.chartData || { labels: ["A", "B", "C", "D"], values: [40, 70, 30, 90] };
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const maxVal = Math.max(...data.values, 1);

  return (
    <g opacity={el.opacity}>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} rx={4} />
      {chartType === "pie" ? (
        (() => {
          const cx = x + w / 2;
          const cy = y + h / 2;
          const r = Math.min(w, h) / 2 - 10;
          const total = data.values.reduce((s, v) => s + v, 0) || 1;
          let startAngle = -Math.PI / 2;
          return data.values.map((v, i) => {
            const angle = (v / total) * Math.PI * 2;
            const x1 = cx + r * Math.cos(startAngle);
            const y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(startAngle + angle);
            const y2 = cy + r * Math.sin(startAngle + angle);
            const largeArc = angle > Math.PI ? 1 : 0;
            const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            startAngle += angle;
            return <path key={i} d={d} fill={colors[i % colors.length]} stroke="#ffffff" strokeWidth={1} />;
          });
        })()
      ) : (
        data.values.map((v, i) => {
          const barW = (w - 20) / data.values.length * 0.7;
          const gap = (w - 20) / data.values.length * 0.3;
          const barH = (v / maxVal) * (h - 30);
          const bx = x + 10 + i * (barW + gap) + gap / 2;
          const by = y + h - 10 - barH;
          return <rect key={i} x={bx} y={by} width={barW} height={barH} fill={colors[i % colors.length]} rx={2} />;
        })
      )}
    </g>
  );
}
