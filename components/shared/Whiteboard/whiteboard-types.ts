export type WhiteboardTool =
  // Pointer tools
  | "select"
  | "hand"
  // Drawing tools
  | "pen"
  | "highlighter"
  | "eraser"
  // Basic shapes
  | "rectangle"
  | "circle"
  | "triangle"
  | "diamond"
  | "star"
  | "hexagon"
  | "rounded-rect"
  | "cylinder"
  | "parallelogram"
  // Lines & arrows
  | "line"
  | "arrow"
  | "double-arrow"
  | "connector"
  // Text & content
  | "text"
  | "sticky"
  // Flowchart
  | "flowchart-process"
  | "flowchart-decision"
  | "flowchart-terminal"
  | "flowchart-data"
  | "flowchart-document"
  // Media
  | "image"
  // Tables
  | "table"
  // Charts
  | "chart";

export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  type: WhiteboardTool;
  // Freehand paths (pen, highlighter)
  points?: Point[];
  // Position for shapes, text, sticky
  x?: number;
  y?: number;
  // Dimensions for rectangle, circle, sticky, and all bbox shapes
  width?: number;
  height?: number;
  // Endpoints for arrow, line, double-arrow, connector
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  // Content
  text?: string;
  label?: string;
  // Style
  color: string;
  fillColor?: string | null;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  borderRadius?: number;
  stickyColor?: string;
  // Transform
  rotation?: number;       // Degrees (0, 90, 180, 270, or any angle)
  flipH?: boolean;         // Flip horizontally
  flipV?: boolean;         // Flip vertically
  // Image
  imageUrl?: string;       // Data URL or external URL for image elements
  // Table
  tableRows?: number;
  tableCols?: number;
  tableData?: string[][];  // 2D array of cell values
  // Chart
  chartType?: "bar" | "column" | "line" | "pie";
  chartData?: { labels: string[]; values: number[]; colors?: string[] };
  // Selection state
  isSelected?: boolean;
  // Grouping
  groupId?: string;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface WhiteboardState {
  elements: WhiteboardElement[];
  viewport: Viewport;
}

export interface WhiteboardProps {
  className?: string;
  readOnly?: boolean;
  initialData?: WhiteboardState;
  onSave?: (state: WhiteboardState) => void;
  onChange?: (state: WhiteboardState) => void;
}

/** Shape tools that use bounding-box (x, y, width, height) creation */
export const BBOX_SHAPE_TOOLS: WhiteboardTool[] = [
  "rectangle",
  "circle",
  "triangle",
  "diamond",
  "star",
  "hexagon",
  "rounded-rect",
  "cylinder",
  "parallelogram",
  "flowchart-process",
  "flowchart-decision",
  "flowchart-terminal",
  "flowchart-data",
  "flowchart-document",
];

/** Line-based tools that use start/end points */
export const LINE_TOOLS: WhiteboardTool[] = [
  "line",
  "arrow",
  "double-arrow",
  "connector",
];

/** Tools that show fill color in properties */
export const FILL_TOOLS: WhiteboardTool[] = [
  "rectangle",
  "circle",
  "triangle",
  "diamond",
  "star",
  "hexagon",
  "rounded-rect",
  "cylinder",
  "parallelogram",
  "flowchart-process",
  "flowchart-decision",
  "flowchart-terminal",
  "flowchart-data",
  "flowchart-document",
];

export const DEFAULT_COLORS = [
  "#000000", // Black
  "#374151", // Gray
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ffffff", // White
];

export const FILL_COLORS = [
  null,      // No fill
  "#f3f4f6", // Light gray
  "#fef2f2", // Light red
  "#fff7ed", // Light orange
  "#fefce8", // Light yellow
  "#f0fdf4", // Light green
  "#eff6ff", // Light blue
  "#f5f3ff", // Light purple
  "#fdf2f8", // Light pink
  "#ffffff", // White
];

export const STICKY_COLORS = [
  "#fef08a", // Yellow
  "#bbf7d0", // Green
  "#bfdbfe", // Blue
  "#fecaca", // Red
  "#e9d5ff", // Purple
  "#fed7aa", // Orange
];

export const STROKE_WIDTHS = [2, 4, 6, 8, 12];

export const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };
