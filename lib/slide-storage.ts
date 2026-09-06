/**
 * Slide presentation storage layer — persists presentations to localStorage.
 */

import {
  type ChartSpec, type ChartType, defaultChartData, defaultChartOptions,
} from "./chart-types";

export type { ChartSpec, ChartType, ChartDatum, ChartTextStyle, ChartLabelOverride } from "./chart-types";

// ── Slide Object System ──

export type SlideObjectType = "textbox" | "image" | "shape" | "drawing" | "table" | "chart" | "media";

export interface SlideObjectBase {
  id: string;
  type: SlideObjectType;
  x: number;      // % from left (0-100)
  y: number;      // % from top (0-100)
  width: number;  // % of slide width
  height: number; // % of slide height
  rotation: number; // degrees
  zIndex: number;
  scaleX?: number;  // horizontal flip when negative (Arrange → Flip horizontally)
  scaleY?: number;  // vertical flip when negative (Arrange → Flip vertically)
  locked?: boolean;
  link?: string;    // optional hyperlink — opens in the slideshow / on click
  altText?: string; // optional accessibility description
  /** Group membership, outermost first — an object can be grouped, and that group grouped again. The canvas
   *  has always written this; it just was never declared, so every read went through a cast. */
  groupIds?: string[];
  /** Legacy single-group field from before nesting was supported. Read when loading old slides, never written. */
  groupId?: string;
  /** Legacy per-object offset within its group. Deleted on ungroup; never written by the current canvas. */
  groupOffsetX?: number;
  groupOffsetY?: number;
}

export interface TextBoxObject extends SlideObjectBase {
  type: "textbox";
  content: string;  // HTML content
  fontSize: number; // px
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  placeholder?: string;
  noWrap?: boolean;
}

export interface ImageObject extends SlideObjectBase {
  type: "image";
  src: string;       // data URL or URL
  alt: string;
  objectFit: "cover" | "contain" | "fill";
  borderRadius?: number;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  /** Crop: percentage inset from each edge (0-50) */
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  cropLeft?: number;
  /** Original bounds before crop — for reset */
  preCropBounds?: { x: number; y: number; width: number; height: number };
}

export interface ShapeObject extends SlideObjectBase {
  type: "shape";
  shape: string; // Any shape key from SHAPE_PATHS
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
  opacity?: number;
  text?: string;
  textColor?: string;
  textSize?: number;
  textAlign?: "left" | "center" | "right";
  textVerticalAlign?: "top" | "middle" | "bottom";
}

export interface DrawingObject extends SlideObjectBase {
  type: "drawing";
  paths: string; // SVG path data
  stroke: string;
  strokeWidth: number;
  opacity?: number;
}

export interface TableCell {
  content: string;  // HTML content
  backgroundColor?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  fontFamily?: string;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  noWrap?: boolean;  // true = single line truncated, false/undefined = wrap (default)
}

export interface TableObject extends SlideObjectBase {
  type: "table";
  rows: number;
  cols: number;
  cells: TableCell[][];  // [row][col]
  colWidths?: number[];  // % width per column (must sum to 100)
  rowHeights?: number[]; // % height per row (must sum to 100)
  borderColor: string;
  borderWidth: number;
  headerRow: boolean;    // First row styled as header
  headerColor: string;   // Header background color
  evenRowColor: string;  // Alternating row color
  oddRowColor: string;
  fontSize: number;
  fontFamily: string;
  cellPadding: number;
}

/**
 * A positioned chart on a slide. Composes the reusable, surface-agnostic `ChartSpec`
 * (the WHAT/HOW — type, data, styling) with slide positioning (the WHERE). The same
 * ChartSpec renders identically in the work document or any other surface.
 */
export interface ChartObject extends SlideObjectBase, ChartSpec {
  type: "chart";
}

/** Audio or video embedded on a slide — plays in the editor and the slideshow. */
export interface MediaObject extends SlideObjectBase {
  type: "media";
  mediaKind: "audio" | "video";
  src: string;          // data URL or remote URL
  poster?: string;      // optional video poster image
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export type SlideObject = TextBoxObject | ImageObject | ShapeObject | DrawingObject | TableObject | ChartObject | MediaObject;

// ── Slide Object Factories ──

let _objCounter = 0;
function objId() { return `obj-${Date.now()}-${(++_objCounter).toString(36)}`; }

export function createTextBox(overrides?: Partial<TextBoxObject>): TextBoxObject {
  return {
    id: objId(), type: "textbox",
    x: 10, y: 10, width: 80, height: 15, rotation: 0, zIndex: 1,
    content: "", fontSize: 18, fontFamily: "Inter, sans-serif", color: "#1a1a2e",
    bold: false, italic: false, align: "left", verticalAlign: "top",
    placeholder: "Click to add text",
    ...overrides,
  };
}

export function createImageObj(src: string, overrides?: Partial<ImageObject>): ImageObject {
  return {
    id: objId(), type: "image",
    x: 25, y: 20, width: 50, height: 50, rotation: 0, zIndex: 1,
    // 'contain' keeps the WHOLE image visible when the box is resized to any aspect ratio
    // (never crops the edges). Users can switch to 'cover' via image formatting if they want fill.
    src, alt: "Image", objectFit: "contain",
    ...overrides,
  };
}

export function createShapeObj(shape: ShapeObject["shape"], overrides?: Partial<ShapeObject>): ShapeObject {
  return {
    id: objId(), type: "shape",
    x: 30, y: 30, width: 20, height: 20, rotation: 0, zIndex: 1,
    shape, fill: "#3b82f6", stroke: "transparent", strokeWidth: 0,
    ...overrides,
  };
}

export function createDrawingObj(paths: string, overrides?: Partial<DrawingObject>): DrawingObject {
  return {
    id: objId(), type: "drawing",
    x: 0, y: 0, width: 100, height: 100, rotation: 0, zIndex: 1,
    paths, stroke: "#1a1a2e", strokeWidth: 2,
    ...overrides,
  };
}

/**
 * A freeform pen path arrives in slide space (0–100 on both axes). If we drop it into a
 * full-page (0,0,100,100) drawing object, that object's selection box spans the whole slide
 * and every stroke overlaps every other — impossible to pick or move one.
 *
 * This computes a TIGHT bounding box around the stroke and rewrites the path into that box's
 * own 0–100 viewBox, so each drawing's box hugs just its own ink. A small pad keeps the
 * (non-scaling) stroke from being clipped at the box edge. Visual position is unchanged.
 */
export function fitDrawingToStroke(
  paths: string,
  pad = 1.5,
): { paths: string; x: number; y: number; width: number; height: number } {
  const nums = (paths.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
  if (xs.length === 0) return { paths, x: 0, y: 0, width: 100, height: 100 };
  const minX = Math.max(0, Math.min(...xs) - pad);
  const minY = Math.max(0, Math.min(...ys) - pad);
  const maxX = Math.min(100, Math.max(...xs) + pad);
  const maxY = Math.min(100, Math.max(...ys) + pad);
  const width = Math.max(0.5, maxX - minX);
  const height = Math.max(0.5, maxY - minY);
  // Rewrite every coordinate (x,y alternating) into the box's local 0–100 space.
  let idx = 0;
  const rescaled = paths.replace(/-?\d+(?:\.\d+)?/g, (m) => {
    const v = Number(m);
    const local = idx % 2 === 0 ? ((v - minX) / width) * 100 : ((v - minY) / height) * 100;
    idx++;
    return local.toFixed(2);
  });
  return { paths: rescaled, x: minX, y: minY, width, height };
}

export function createChartObj(chartType: ChartType, overrides?: Partial<ChartObject>): ChartObject {
  const seed = defaultChartData(chartType);   // data / series / categories / scatter per type
  const opts = defaultChartOptions(chartType); // axes / grid / legend / values per type
  return {
    id: objId(), type: "chart",
    x: 12, y: 18, width: 76, height: 64, rotation: 0, zIndex: 1,
    chartType,
    data: [],
    accent: "#3b82f6",
    threeD: false,
    title: "",
    ...opts,
    ...seed,
    ...overrides,
  };
}

export function createMediaObj(mediaKind: "audio" | "video", src: string, overrides?: Partial<MediaObject>): MediaObject {
  return {
    id: objId(), type: "media",
    x: 20, y: 25, width: mediaKind === "audio" ? 60 : 56, height: mediaKind === "audio" ? 10 : 42,
    rotation: 0, zIndex: 1,
    mediaKind, src, autoplay: false, loop: false, muted: false,
    ...overrides,
  };
}

export function createTableObj(rows: number, cols: number, overrides?: Partial<TableObject>): TableObject {
  const cells: TableCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: TableCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ content: r === 0 ? `Header ${c + 1}` : "", bold: r === 0 });
    }
    cells.push(row);
  }
  const colW = 100 / cols;
  const rowH = 100 / rows;
  return {
    id: objId(), type: "table",
    x: 10, y: 20, width: 80, height: Math.min(50, 5 + rows * 5), rotation: 0, zIndex: 1,
    rows, cols, cells,
    colWidths: Array(cols).fill(colW),
    rowHeights: Array(rows).fill(rowH),
    borderColor: "#d1d5db", borderWidth: 1,
    headerRow: false, headerColor: "transparent",
    evenRowColor: "#ffffff", oddRowColor: "#ffffff",
    fontSize: 12, fontFamily: "Inter, sans-serif", cellPadding: 6,
    ...overrides,
  };
}

// ── Default slide templates with objects ──

export function makeDefaultTitleObjects(title: string, accent: string, textColor: string): SlideObject[] {
  return [
    createTextBox({ x: 10, y: 8, width: 80, height: 6, content: "", fontSize: 14, color: accent, align: "center", placeholder: "" }),
    createTextBox({ x: 10, y: 30, width: 80, height: 20, content: title || "Presentation Title", fontSize: 42, bold: true, color: textColor, align: "center", verticalAlign: "middle", placeholder: "Click to add title" }),
    createTextBox({ x: 20, y: 52, width: 60, height: 10, content: "", fontSize: 18, color: textColor, align: "center", verticalAlign: "middle", placeholder: "Click to add subtitle" }),
    createShapeObj("line-h", { x: 35, y: 50, width: 30, height: 0.5, fill: accent, zIndex: 0 }),
  ];
}

export function makeDefaultContentObjects(accent: string, textColor: string): SlideObject[] {
  return [
    createTextBox({ x: 5, y: 5, width: 90, height: 12, content: "Section Title", fontSize: 28, bold: true, color: textColor, align: "left", verticalAlign: "middle", placeholder: "Click to add title" }),
    createShapeObj("line-h", { x: 5, y: 17, width: 12, height: 0.4, fill: accent, zIndex: 0 }),
    createTextBox({ x: 5, y: 22, width: 90, height: 70, content: "", fontSize: 16, color: textColor, align: "left", verticalAlign: "top", placeholder: "Click to add content" }),
  ];
}

export function makeDefaultClosingObjects(accent: string, textColor: string): SlideObject[] {
  return [
    createShapeObj("line-h", { x: 35, y: 32, width: 30, height: 0.5, fill: accent, zIndex: 0 }),
    createTextBox({ x: 10, y: 35, width: 80, height: 18, content: "Thank You", fontSize: 42, bold: true, color: textColor, align: "center", verticalAlign: "middle" }),
    createTextBox({ x: 20, y: 55, width: 60, height: 8, content: "Questions & Discussion", fontSize: 16, color: textColor, align: "center", verticalAlign: "middle" }),
    createTextBox({ x: 25, y: 66, width: 50, height: 6, content: "", fontSize: 14, color: accent, align: "center", verticalAlign: "middle", placeholder: "your.email@example.com" }),
  ];
}

// ── Slide Data ──

export interface SlideData {
  id: string;
  content: string; // Legacy HTML content (kept for backward compat)
  notes: string;
  background: string; // CSS background value
  transition: "none" | "fade" | "dissolve" | "flip" | "cube";
  objects?: SlideObject[]; // New: canvas objects
}

export interface PresentationPermissions {
  preventAccessChange: boolean;
  disableCopyPrintDownload: boolean;
  requireSignIn: boolean;
}

export const DEFAULT_PERMISSIONS: PresentationPermissions = {
  preventAccessChange: false,
  disableCopyPrintDownload: false,
  requireSignIn: true,
};

export interface StoredPresentation {
  id: string;
  title: string;
  slides: SlideData[];
  theme: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  folder?: string;
  permissions?: PresentationPermissions;
  language?: string;
}

const STORAGE_KEY = "educo_presentations";

function getAll(): StoredPresentation[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveAll(items: StoredPresentation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeSlide(content = "", bg = "#ffffff"): SlideData {
  return { id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, content, notes: "", background: bg, transition: "fade" };
}

export const slideStorage = {
  list(): StoredPresentation[] {
    return getAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  get(id: string): StoredPresentation | null {
    return getAll().find(d => d.id === id) || null;
  },

  create(data: { title?: string; slides?: SlideData[]; theme?: string }): string {
    const items = getAll();
    const id = `pres-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    items.push({
      id,
      title: data.title || "Untitled presentation",
      slides: data.slides || [makeSlide('<h1 style="text-align:center;font-size:36px;margin-top:120px;">Untitled Presentation</h1><p style="text-align:center;color:#6b7280;font-size:18px;">Click to add subtitle</p>')],
      theme: data.theme || "default",
      owner: "Me",
      createdAt: now,
      updatedAt: now,
      starred: false,
    });
    saveAll(items);
    return id;
  },

  update(id: string, data: Partial<Pick<StoredPresentation, "title" | "slides" | "theme">>) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    if (data.title !== undefined) items[idx].title = data.title;
    if (data.slides !== undefined) items[idx].slides = data.slides;
    if (data.theme !== undefined) items[idx].theme = data.theme;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  toggleStar(id: string) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].starred = !items[idx].starred;
    saveAll(items);
  },

  moveToFolder(id: string, folder: string) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].folder = folder;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  getFolder(id: string): string {
    const item = getAll().find(d => d.id === id);
    return item?.folder || "Presentations";
  },

  getPermissions(id: string): PresentationPermissions {
    const item = getAll().find(d => d.id === id);
    return item?.permissions || { ...DEFAULT_PERMISSIONS };
  },

  setPermissions(id: string, permissions: PresentationPermissions) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].permissions = permissions;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  setLanguage(id: string, language: string) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].language = language;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  getLanguage(id: string): string {
    const item = getAll().find(d => d.id === id);
    return item?.language || "English";
  },

  moveToBin(id: string) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].folder = "Bin";
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  remove(id: string) {
    saveAll(getAll().filter(d => d.id !== id));
  },

  makeSlide,
};
