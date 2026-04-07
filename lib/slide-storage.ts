/**
 * Slide presentation storage layer — persists presentations to localStorage.
 */

// ── Slide Object System ──

export type SlideObjectType = "textbox" | "image" | "shape" | "drawing";

export interface SlideObjectBase {
  id: string;
  type: SlideObjectType;
  x: number;      // % from left (0-100)
  y: number;      // % from top (0-100)
  width: number;  // % of slide width
  height: number; // % of slide height
  rotation: number; // degrees
  zIndex: number;
  locked?: boolean;
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
}

export interface DrawingObject extends SlideObjectBase {
  type: "drawing";
  paths: string; // SVG path data
  stroke: string;
  strokeWidth: number;
  opacity?: number;
}

export type SlideObject = TextBoxObject | ImageObject | ShapeObject | DrawingObject;

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
    src, alt: "Image", objectFit: "cover",
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
