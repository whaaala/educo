// ─── Text formatting types ──────────────────────────────────────────────

export type FontFamily =
  // Sans-serif
  | "Inter"
  | "Arial"
  | "Calibri"
  | "Helvetica"
  | "Verdana"
  | "Tahoma"
  | "Trebuchet MS"
  | "Segoe UI"
  | "Century Gothic"
  | "Candara"
  | "Gill Sans"
  | "Lucida Sans"
  | "Open Sans"
  | "Roboto"
  | "Lato"
  | "Montserrat"
  | "Nunito"
  | "Poppins"
  | "Raleway"
  | "Source Sans 3"
  | "Ubuntu"
  | "Work Sans"
  | "Lexend"
  | "Comfortaa"
  | "Oswald"
  | "PT Sans"
  | "Rubik"
  | "Karla"
  | "Manrope"
  | "DM Sans"
  // Serif
  | "Times New Roman"
  | "Georgia"
  | "Garamond"
  | "Cambria"
  | "Palatino Linotype"
  | "Book Antiqua"
  | "Constantia"
  | "Merriweather"
  | "Playfair Display"
  | "Lora"
  | "EB Garamond"
  | "PT Serif"
  | "Libre Baskerville"
  | "Crimson Text"
  | "Noto Serif"
  | "Cormorant Garamond"
  | "Bitter"
  // Monospace
  | "Courier New"
  | "Consolas"
  | "Lucida Console"
  | "Roboto Mono"
  | "Source Code Pro"
  | "Fira Code"
  | "JetBrains Mono"
  | "IBM Plex Mono"
  | "Space Mono"
  // Display & Handwriting
  | "Impact"
  | "Comic Sans MS"
  | "Caveat"
  | "Lobster"
  | "Pacifico"
  | "Dancing Script"
  | "Satisfy"
  | "Indie Flower"
  | "Permanent Marker"
  | "Amatic SC"
  | "Shadows Into Light"
  | "Patrick Hand"
  | "Sacramento"
  | "Great Vibes"
  | "Abril Fatface"
  | "Righteous"
  | "Bebas Neue"
  | "Anton"
  | "Fredoka";

export type TextAlign = "left" | "center" | "right";

export type StrokeDashPattern = "solid" | "dashed" | "dotted" | "dash-dot" | "dash-dot-dot";

// ─── Tool type ──────────────────────────────────────────────────────────

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
  | "curved-connector"
  | "curve"
  | "polyline"
  | "scribble"
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
  richText?: string;        // HTML rich text (from contentEditable)
  label?: string;
  // Style
  color: string;
  fillColor?: string | null;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  borderRadius?: number;
  stickyColor?: string;
  // Text formatting
  fontFamily?: FontFamily;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: TextAlign;
  lineSpacing?: number;        // Line-height multiplier (1.0, 1.15, 1.5, 2.0)
  // Line/shape stroke dash
  strokeDash?: StrokeDashPattern;
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
  chartTitle?: string;
  chartTitleColor?: string;
  chartTitleFontFamily?: FontFamily;
  chartTitleFontSize?: number;
  chartTitleFontWeight?: "normal" | "bold";
  chartTitleFontStyle?: "normal" | "italic";
  chartTitleTextDecoration?: "none" | "underline";
  chartTitleTextAlign?: TextAlign;
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
  "curved-connector",
  "curve",
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

// ─── Text formatting constants ─────────────────────────────────────────

export const FONT_FAMILIES: FontFamily[] = [
  // Sans-serif
  "Inter", "Arial", "Calibri", "Helvetica", "Verdana", "Tahoma",
  "Trebuchet MS", "Segoe UI", "Century Gothic", "Candara", "Gill Sans", "Lucida Sans",
  "Open Sans", "Roboto", "Lato", "Montserrat", "Nunito", "Poppins",
  "Raleway", "Source Sans 3", "Ubuntu", "Work Sans", "Lexend", "Comfortaa",
  "Oswald", "PT Sans", "Rubik", "Karla", "Manrope", "DM Sans",
  // Serif
  "Times New Roman", "Georgia", "Garamond", "Cambria", "Palatino Linotype",
  "Book Antiqua", "Constantia", "Merriweather", "Playfair Display", "Lora",
  "EB Garamond", "PT Serif", "Libre Baskerville", "Crimson Text", "Noto Serif",
  "Cormorant Garamond", "Bitter",
  // Monospace
  "Courier New", "Consolas", "Lucida Console", "Roboto Mono",
  "Source Code Pro", "Fira Code", "JetBrains Mono", "IBM Plex Mono", "Space Mono",
  // Display & Handwriting
  "Impact", "Comic Sans MS", "Caveat", "Lobster", "Pacifico",
  "Dancing Script", "Satisfy", "Indie Flower", "Permanent Marker", "Amatic SC",
  "Shadows Into Light", "Patrick Hand", "Sacramento", "Great Vibes",
  "Abril Fatface", "Righteous", "Bebas Neue", "Anton", "Fredoka",
];

/** Font families organized by category for UI display */
export const FONT_FAMILY_CATEGORIES: { label: string; fonts: FontFamily[] }[] = [
  {
    label: "Sans-serif",
    fonts: [
      "Inter", "Arial", "Calibri", "Helvetica", "Verdana", "Tahoma",
      "Trebuchet MS", "Segoe UI", "Century Gothic", "Candara", "Gill Sans", "Lucida Sans",
      "Open Sans", "Roboto", "Lato", "Montserrat", "Nunito", "Poppins",
      "Raleway", "Source Sans 3", "Ubuntu", "Work Sans", "Lexend", "Comfortaa",
      "Oswald", "PT Sans", "Rubik", "Karla", "Manrope", "DM Sans",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Times New Roman", "Georgia", "Garamond", "Cambria", "Palatino Linotype",
      "Book Antiqua", "Constantia", "Merriweather", "Playfair Display", "Lora",
      "EB Garamond", "PT Serif", "Libre Baskerville", "Crimson Text", "Noto Serif",
      "Cormorant Garamond", "Bitter",
    ],
  },
  {
    label: "Monospace",
    fonts: [
      "Courier New", "Consolas", "Lucida Console", "Roboto Mono",
      "Source Code Pro", "Fira Code", "JetBrains Mono", "IBM Plex Mono", "Space Mono",
    ],
  },
  {
    label: "Display & Handwriting",
    fonts: [
      "Impact", "Comic Sans MS", "Caveat", "Lobster", "Pacifico",
      "Dancing Script", "Satisfy", "Indie Flower", "Permanent Marker", "Amatic SC",
      "Shadows Into Light", "Patrick Hand", "Sacramento", "Great Vibes",
      "Abril Fatface", "Righteous", "Bebas Neue", "Anton", "Fredoka",
    ],
  },
];

export const FONT_SIZES = [6, 8, 10, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

export const LINE_SPACINGS = [
  { value: 1.0, label: "Single" },
  { value: 1.15, label: "1.15" },
  { value: 1.5, label: "1.5" },
  { value: 2.0, label: "Double" },
];

export const STROKE_DASH_PATTERNS: StrokeDashPattern[] = [
  "solid", "dashed", "dotted", "dash-dot", "dash-dot-dot",
];

export const EXTENDED_STROKE_WIDTHS = [1, 2, 3, 4, 8, 12, 16, 24];

export const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };
