"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  Plus,
  Trash2,
  MoreVertical,
  Table2,
  ArrowUpDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Undo2,
  Redo2,
  FileText,
  Mail,
  MoreHorizontal,
  Star,
  Download,
  Printer,
  Image as ImageIcon,
  Table as TableIcon,
  LayoutTemplate,
  Smile,
  Sigma,
  Calendar,
  User,
  MapPin,
  File as FileIcon,
  Bookmark,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  Eye,
  MessageSquare,
  Minus,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveUp,
  MoveDown,
  GripVertical,
  Type,
  Strikethrough,
  IndentIncrease,
  IndentDecrease,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  ListChecks,
  Baseline,
  Highlighter,
  ChevronsUpDown,
  Paintbrush,
  PenLine,
  SpellCheck2 as SpellCheck,
  RemoveFormatting,
  MessageSquarePlus,
  AlignJustify,
  ChevronUp,
  Package,
  Circle,
  Square,
  Diamond,
  Check,
  Globe,
  UserPlus,
  RotateCw,
  Maximize2,
  Palette,
  X,
  Minimize2,
  PanelLeftClose,
  Pilcrow,
  SpellCheck as SpellCheckIcon,
  BookOpen,
  ZoomIn,
  MessageCircle,
  Reply,
  CheckCircle2,
  XCircle,
  AtSign,
  Send,
  CornerDownRight,
  PanelRightClose,
  FolderInput,
  Tag,
  FilePlus2,
  FileSpreadsheet,
  Presentation,
  FormInput as FormInputIcon,
  Pencil,
  Ellipsis,
  Upload,
  Camera,
  HardDrive,
  ImagePlus,
  Link,
  Loader2,
  RotateCcw,
  Crop,
  Replace,
  SlidersHorizontal,
  GripHorizontal,
  Move as MoveIcon,
  WrapText,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { DOC_LANGUAGES } from "./languages";
import Tooltip from "@/components/shared/Tooltip";
import ShareDialog from "@/components/shared/ShareDialog";
import type { ShareTarget } from "@/components/shared/ShareDialog";
import PublishDialog from "@/components/shared/PublishDialog";
import type { PublishScope, PublishAttachment } from "@/components/shared/PublishDialog";
// Safe imports: these hooks throw if no Provider, so we use try-catch wrappers
import { useUser as _useUser } from "@/contexts/UserContext";
import { useNotifications as _useNotifications, formatTimeAgo } from "@/contexts/NotificationContext";
function useSafeUser() {
  try { return _useUser(); } catch { return { user: null }; }
}
function useSafeNotifications() {
  try { return _useNotifications(); } catch { return { addNotification: () => "" }; }
}
import { ColorGrid, TabbedColorPalette, SOLID_COLORS, TEXT_COLORS_MATRIX, TEXT_GRADIENT_COLORS, GLOSSY_COLORS, BORDER_COLORS, CELL_BG_COLORS, colorToCSS, isNativeColorPickerOpen } from "@/components/shared/ColorPalettePicker";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import { FONT_FAMILY_CATEGORIES, FONT_SIZES, LINE_SPACINGS } from "@/components/shared/Whiteboard/whiteboard-types";
import type { FontFamily } from "@/components/shared/Whiteboard/whiteboard-types";

const MenuCloseContext = createContext<(() => void) | null>(null);
const SubmenuCloseContext = createContext<(() => void) | null>(null);
/** Provides the MenuItem container ref so SubmenuPanel (portalled) can position itself. */
const SubmenuAnchorContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);
/** Provides timer management so the portalled SubmenuPanel can cancel/schedule close. */
const SubmenuTimerContext = createContext<{ cancelClose: () => void; scheduleClose: () => void } | null>(null);
/** Module-level ref tracking the currently-open submenu portal panel element for hover checks. */
const activeSubmenuPanelEl: { current: HTMLElement | null } = { current: null };

const DOC_PAGE_BREAK_MARKER = `<div data-doc-page-break="true"></div>`;
const DOC_PAGE_BREAK_REGEX = /<div[^>]*data-doc-page-break=(?:"true"|'true')[^>]*>\s*<\/div>/gi;

// ── Supported Image Formats ──
const IMAGE_ACCEPT_EXTENSIONS = ".jpg,.jpeg,.jpe,.jfif,.pjpeg,.pjp,.png,.gif,.webp,.svg,.svgz,.heic,.heif,.tiff,.tif,.bmp,.dib,.avif,.ico,.cur,.apng,.jxl,.raw,.dng,.nef,.cr2,.orf,.arw,.rw2,.sr2";
const IMAGE_ACCEPT_ATTR = `${IMAGE_ACCEPT_EXTENSIONS},image/*`;
const IMAGE_VALID_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
  "image/heic", "image/heif", "image/tiff", "image/bmp", "image/avif",
  "image/x-icon", "image/vnd.microsoft.icon", "image/apng",
  "image/jxl", "image/x-jxl",
  // Camera RAW formats
  "image/x-adobe-dng", "image/x-nikon-nef", "image/x-canon-cr2",
  "image/x-olympus-orf", "image/x-sony-arw", "image/x-panasonic-rw2",
  "image/x-sony-sr2", "image/x-dcraw",
]);
const IMAGE_VALID_EXTENSIONS = new Set([
  "jpg", "jpeg", "jpe", "jfif", "pjpeg", "pjp", "png", "gif", "webp",
  "svg", "svgz", "heic", "heif", "tiff", "tif", "bmp", "dib", "avif",
  "ico", "cur", "apng", "jxl",
  // Camera RAW formats
  "raw", "dng", "nef", "cr2", "orf", "arw", "rw2", "sr2",
]);
const IMAGE_FORMAT_LIST = "JPG, PNG, GIF, WebP, SVG, HEIC, TIFF, BMP, AVIF, ICO, APNG, JXL, RAW, DNG";
// Formats that should be converted client-side for fast document loading
const IMAGE_CONVERT_FORMATS = new Set([
  "image/tiff", "image/bmp", "image/heic", "image/heif",
  "image/x-icon", "image/vnd.microsoft.icon",
]);

function getFileExtension(name: string): string {
  return (name.split(".").pop() || "").toLowerCase();
}

function isValidImageFile(file: File): { valid: boolean; reason?: string } {
  // Check MIME type first (security: prevents disguised files)
  const mime = file.type.toLowerCase();
  const ext = getFileExtension(file.name);
  if (mime && !IMAGE_VALID_MIME_TYPES.has(mime) && !mime.startsWith("image/")) {
    return { valid: false, reason: `Unsupported file type: ${mime}. Accepted formats: ${IMAGE_FORMAT_LIST}` };
  }
  // Fallback: check extension if MIME is empty (some OS don't set MIME for HEIC/AVIF)
  if (!mime && !IMAGE_VALID_EXTENSIONS.has(ext)) {
    return { valid: false, reason: `Unsupported file extension: .${ext}. Accepted formats: ${IMAGE_FORMAT_LIST}` };
  }
  // Size limit: 25MB
  if (file.size > 25 * 1024 * 1024) {
    return { valid: false, reason: "File is too large (max 25 MB)" };
  }
  return { valid: true };
}

/** Convert image to a web-safe format, verifying the browser can actually render it */
async function convertImageToWebSafe(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
  // SVGs stay as-is (vector, sharp at any zoom)
  if (file.type === "image/svg+xml") return dataUrl;
  const mime = file.type.toLowerCase();
  // For formats that need conversion (TIFF, BMP, HEIC, ICO), or any format,
  // verify the browser can decode the image by loading it first
  const img = new Image();
  const canDecode = await new Promise<boolean>((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
  if (!canDecode) {
    throw new Error(`Your browser cannot display this image format (${mime || file.name.split(".").pop()}). Try converting it to PNG or JPEG first.`);
  }
  // If the format needs conversion, draw to canvas and re-export as PNG
  if (IMAGE_CONVERT_FORMATS.has(mime)) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/png");
      }
    } catch {
      // Canvas conversion failed but browser can still display the original
    }
  }
  return dataUrl;
}

// ── Section Break ──
const DOC_SECTION_BREAK_REGEX = /<div[^>]*data-doc-section-break="true"[^>]*data-section-setup='([^']*)'[^>]*><\/div>/gi;
function makeSectionBreakMarker(setup: PageSetup): string {
  return `<div data-doc-section-break="true" data-section-setup='${JSON.stringify(setup)}'></div>`;
}

interface DocSection {
  pageSetup: PageSetup;
  pages: string[];
}

// ── Page Setup Constants ──

interface PaperSize {
  name: string;
  widthCm: number;
  heightCm: number;
}

const PAPER_SIZES: PaperSize[] = [
  { name: "Letter",    widthCm: 21.59, heightCm: 27.94 },
  { name: "Tabloid",   widthCm: 27.94, heightCm: 43.18 },
  { name: "Legal",     widthCm: 21.59, heightCm: 35.56 },
  { name: "Statement", widthCm: 13.97, heightCm: 21.59 },
  { name: "Executive", widthCm: 18.42, heightCm: 26.67 },
  { name: "Folio",     widthCm: 21.59, heightCm: 33.02 },
  { name: "A3",        widthCm: 29.70, heightCm: 42.00 },
  { name: "A4",        widthCm: 21.00, heightCm: 29.70 },
  { name: "A5",        widthCm: 14.80, heightCm: 21.00 },
  { name: "B4",        widthCm: 25.00, heightCm: 35.30 },
  { name: "B5",        widthCm: 17.60, heightCm: 25.00 },
];

const CM_TO_PX = 37.7953;
function cmToPx(cm: number): number {
  return Math.round(cm * CM_TO_PX);
}

/** Google Docs-style page colour palette — 10 columns × 8 rows */
const PAGE_COLORS: string[] = [
  // Row 1: Black → White
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  // Row 2: Accent base
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  // Row 3: Light tint 1
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  // Row 4: Light tint 2
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  // Row 5: Medium
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
  // Row 6: Medium dark
  "#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
  // Row 7: Dark
  "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47",
  // Row 8: Very dark
  "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130",
];

interface PageSetup {
  paperSize: string;
  orientation: "portrait" | "landscape";
  marginTopCm: number;
  marginBottomCm: number;
  marginLeftCm: number;
  marginRightCm: number;
  pageColor: string;
  pageless: boolean;
}

const DEFAULT_PAGE_SETUP: PageSetup = {
  paperSize: "A4",
  orientation: "portrait",
  marginTopCm: 2.54,
  marginBottomCm: 2.54,
  marginLeftCm: 2.54,
  marginRightCm: 2.54,
  pageColor: "#ffffff",
  pageless: false,
};

function parseHtmlPages(html: string): string[] {
  const normalized = (html || "").trim();
  if (!normalized) return ["<p></p>"];
  const parts = normalized.split(DOC_PAGE_BREAK_REGEX).map((p) => p.trim());
  const pages = parts.filter((p) => p.length > 0);
  return pages.length ? pages : ["<p></p>"];
}

function serializeHtmlPages(pages: string[]): string {
  const safe = (pages || []).map((p) => (p && p.trim().length ? p : "<p></p>"));
  return safe.join(DOC_PAGE_BREAK_MARKER);
}

// ── Section Parsing ──

function parseHtmlSections(html: string, defaultSetup: PageSetup): DocSection[] {
  const normalized = (html || "").trim();
  if (!normalized) return [{ pageSetup: defaultSetup, pages: ["<p></p>"] }];

  // Split by section breaks, capturing the data-section-setup JSON
  const sectionBreakPattern = /<div[^>]*data-doc-section-break="true"[^>]*data-section-setup='([^']*)'[^>]*><\/div>/gi;
  const chunks: string[] = [];
  const setups: (PageSetup | null)[] = [null]; // first section uses default
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = sectionBreakPattern.exec(normalized)) !== null) {
    chunks.push(normalized.slice(lastIdx, match.index).trim());
    try {
      setups.push(JSON.parse(match[1]) as PageSetup);
    } catch {
      setups.push(null);
    }
    lastIdx = match.index + match[0].length;
  }
  chunks.push(normalized.slice(lastIdx).trim());

  // Build sections
  const sections: DocSection[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk && i > 0 && i < chunks.length - 1) continue; // skip empty middle chunks
    const setup = setups[i] || defaultSetup;
    const pages = parseHtmlPages(chunk || "<p></p>");
    sections.push({ pageSetup: { ...setup }, pages });
  }

  return sections.length ? sections : [{ pageSetup: defaultSetup, pages: ["<p></p>"] }];
}

function serializeHtmlSections(sections: DocSection[]): string {
  if (!sections.length) return "<p></p>";
  const parts: string[] = [];
  for (let i = 0; i < sections.length; i++) {
    if (i > 0) {
      parts.push(makeSectionBreakMarker(sections[i].pageSetup));
    }
    parts.push(serializeHtmlPages(sections[i].pages));
  }
  return parts.join("");
}

/** Compute pixel dimensions from a PageSetup */
function computeSectionDimensions(setup: PageSetup) {
  const paper = PAPER_SIZES.find((p) => p.name === setup.paperSize) || PAPER_SIZES[7];
  const isLandscape = setup.orientation === "landscape";
  const widthCm = isLandscape ? paper.heightCm : paper.widthCm;
  const heightCm = isLandscape ? paper.widthCm : paper.heightCm;
  return {
    pageWidthPx: cmToPx(widthCm),
    pageHeightPx: cmToPx(heightCm),
    marginTopPx: cmToPx(setup.marginTopCm),
    marginBottomPx: cmToPx(setup.marginBottomCm),
    marginLeftPx: cmToPx(setup.marginLeftCm),
    marginRightPx: cmToPx(setup.marginRightCm),
  };
}

export interface DocTemplate {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** HTML that will be inserted at the cursor */
  html: string;
}

export interface DocEditorValue {
  /** Document title */
  title?: string;
  /** HTML string (persist this) */
  html: string;
  /** BCP-47 language tag (e.g. "en", "fr", "ar") */
  language?: string;
}

export interface DocEditorProps {
  value: DocEditorValue;
  onChange: (next: DocEditorValue) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  /** Show Google-Docs-like quick template chips */
  templates?: DocTemplate[];
  /** Optional tenant identifier for tenant-aware features (e.g., translation) */
  tenantId?: string;
  /** External comments (if not provided, uses internal localStorage-based state) */
  comments?: DocComment[];
  /** Called when comments change */
  onCommentsChange?: (comments: DocComment[]) => void;
}

// ── Comment / Review System Types ──

export type CommentStatus = "open" | "resolved" | "rejected";

export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface CommentMention {
  userId: string;
  name: string;
  offset: number;
  length: number;
}

export interface CommentReply {
  id: string;
  author: CommentAuthor;
  text: string;
  mentions: CommentMention[];
  createdAt: string;
}

export interface DocComment {
  id: string;
  documentId: string;
  author: CommentAuthor;
  /** The text the user highlighted when creating the comment */
  selectedText: string;
  /** Serialised range info so we can re-highlight and scroll-to */
  highlightRange: {
    pageIndex: number;
    startOffset: number;
    endOffset: number;
    /** XPath-like path from page root to the text node (legacy, kept for compat) */
    anchorPath: string;
    focusPath: string;
    /** Character offset of selected text within page's textContent (new approach) */
    textOffset?: number;
  };
  /** Which tab this comment belongs to */
  tabId?: string;
  /** The comment body */
  text: string;
  mentions: CommentMention[];
  status: CommentStatus;
  /** Who resolved/rejected + optional message */
  resolution?: {
    by: CommentAuthor;
    action: "resolved" | "rejected";
    message?: string;
    at: string;
  };
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

interface TableCellTextFormat {
  fontFamily?: string;
  fontSizePx?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  color?: string; // text/font color
}

interface TableWidgetCell {
  html: string;
  bg?: string; // per-cell background override (if set, takes priority over table-level cellBg)
  border?: Partial<{ color: string; widthPx: number; style: "solid" | "dashed" | "dotted" }>; // per-cell border override
  textFmt?: TableCellTextFormat; // per-cell text format override
  colspan?: number;   // columns spanned (default 1, only set on the owner/top-left cell)
  rowspan?: number;   // rows spanned (default 1, only set on the owner/top-left cell)
  mergedInto?: { r: number; c: number }; // if set, this cell is hidden — covered by the owner cell at (r,c)
}

interface TableWidgetModel {
  rows: TableWidgetCell[][];
  headerRow: boolean;
  headerCol: boolean;
  colWidthsPx?: number[];
  rowHeightsPx?: number[];
  text?: {
    fontFamily: string;
    fontSizePx: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  border: {
    color: string;
    widthPx: number;
    style: "solid" | "dashed" | "dotted";
  };
  cellBg: string; // "transparent" or #hex
  // Default text format for body cells
  bodyTextFmt?: TableCellTextFormat;
  // Default text format for header cells (headerRow row-0 / headerCol col-0)
  headerTextFmt?: TableCellTextFormat;
}

function encodeTableWidgetModel(model: TableWidgetModel): string {
  return encodeURIComponent(JSON.stringify(model));
}

function decodeTableWidgetModel(raw: string | null | undefined): TableWidgetModel | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as TableWidgetModel;
    if (!parsed || !Array.isArray(parsed.rows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// ── Cell merge helpers (pure functions) ──

function normalizeRange(r1: number, c1: number, r2: number, c2: number) {
  return { r1: Math.min(r1, r2), c1: Math.min(c1, c2), r2: Math.max(r1, r2), c2: Math.max(c1, c2) };
}

/** Expand a selection range to fully include any partially-overlapped merged cells. */
function expandRangeForMerges(
  rows: TableWidgetCell[][],
  range: { r1: number; c1: number; r2: number; c2: number }
): { r1: number; c1: number; r2: number; c2: number } {
  let { r1, c1, r2, c2 } = range;
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const cell = rows[r]?.[c];
        if (!cell) continue;
        if (cell.mergedInto) {
          const { r: or, c: oc } = cell.mergedInto;
          const owner = rows[or]?.[oc];
          if (owner) {
            const er = or + (owner.rowspan ?? 1) - 1;
            const ec = oc + (owner.colspan ?? 1) - 1;
            if (or < r1 || oc < c1 || er > r2 || ec > c2) {
              r1 = Math.min(r1, or); c1 = Math.min(c1, oc);
              r2 = Math.max(r2, er); c2 = Math.max(c2, ec);
              changed = true;
            }
          }
        } else if ((cell.colspan ?? 1) > 1 || (cell.rowspan ?? 1) > 1) {
          const er = r + (cell.rowspan ?? 1) - 1;
          const ec = c + (cell.colspan ?? 1) - 1;
          if (er > r2 || ec > c2 || r < r1 || c < c1) {
            r1 = Math.min(r1, r); c1 = Math.min(c1, c);
            r2 = Math.max(r2, er); c2 = Math.max(c2, ec);
            changed = true;
          }
        }
      }
    }
  }
  return { r1, c1, r2, c2 };
}

/** Merge cells in the given range into one spanning cell. */
function mergeCells(model: TableWidgetModel, rawRange: { r1: number; c1: number; r2: number; c2: number }): TableWidgetModel {
  const range = expandRangeForMerges(model.rows, rawRange);
  const { r1, c1, r2, c2 } = range;
  if (r1 === r2 && c1 === c2) return model;
  const rows = model.rows.map((row) => row.map((cell) => ({ ...cell })));
  const contentParts: string[] = [];
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = rows[r][c];
      if (cell && !cell.mergedInto && cell.html && cell.html !== "&nbsp;") {
        contentParts.push(cell.html);
      }
    }
  }
  const owner = rows[r1][c1];
  owner.html = contentParts.join(" ") || "&nbsp;";
  owner.colspan = c2 - c1 + 1;
  owner.rowspan = r2 - r1 + 1;
  delete owner.mergedInto;
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      if (r === r1 && c === c1) continue;
      const cell = rows[r][c];
      cell.html = "&nbsp;";
      cell.mergedInto = { r: r1, c: c1 };
      delete cell.colspan;
      delete cell.rowspan;
    }
  }
  return { ...model, rows };
}

/** Unmerge a merged cell, restoring all slave cells to independent cells. */
function unmergeCells(model: TableWidgetModel, r: number, c: number): TableWidgetModel {
  const rows = model.rows.map((row) => row.map((cell) => ({ ...cell })));
  const cell = rows[r]?.[c];
  if (!cell) return model;
  const ownerR = cell.mergedInto ? cell.mergedInto.r : r;
  const ownerC = cell.mergedInto ? cell.mergedInto.c : c;
  const ownerCell = rows[ownerR]?.[ownerC];
  if (!ownerCell) return model;
  const rs = ownerCell.rowspan ?? 1;
  const cs = ownerCell.colspan ?? 1;
  if (rs === 1 && cs === 1) return model;
  delete ownerCell.colspan;
  delete ownerCell.rowspan;
  for (let ri = ownerR; ri < ownerR + rs; ri++) {
    for (let ci = ownerC; ci < ownerC + cs; ci++) {
      if (ri === ownerR && ci === ownerC) continue;
      const sl = rows[ri]?.[ci];
      if (sl) { sl.html = "&nbsp;"; delete sl.mergedInto; delete sl.colspan; delete sl.rowspan; }
    }
  }
  return { ...model, rows };
}

/** Adjust merges when a row is inserted at insertAt. */
function adjustMergesForRowInsert(rows: TableWidgetCell[][], insertAt: number): TableWidgetCell[][] {
  const result = rows.map((row) => row.map((cell) => ({ ...cell })));
  for (let r = 0; r < result.length; r++) {
    for (let c = 0; c < result[r].length; c++) {
      const cell = result[r][c];
      if (cell.mergedInto) {
        // Shift owner pointer if it's at or below the insertion point
        if (cell.mergedInto.r >= insertAt) {
          cell.mergedInto = { ...cell.mergedInto, r: cell.mergedInto.r + 1 };
        }
      } else if ((cell.rowspan ?? 1) > 1) {
        const spanEnd = r + (cell.rowspan ?? 1) - 1;
        if (r < insertAt && spanEnd >= insertAt) {
          cell.rowspan = (cell.rowspan ?? 1) + 1;
        }
      }
    }
  }
  // Mark the new row's cells as slaves where they fall within an existing rowspan
  const newRow = result[insertAt];
  if (newRow) {
    for (let c = 0; c < newRow.length; c++) {
      // Find if any owner above spans across this row
      for (let r = 0; r < insertAt; r++) {
        const above = result[r]?.[c];
        if (above && !above.mergedInto && (above.rowspan ?? 1) > 1) {
          const spanEnd = r + (above.rowspan ?? 1) - 1;
          if (spanEnd >= insertAt) {
            newRow[c] = { html: "&nbsp;", mergedInto: { r, c } };
            break;
          }
        }
      }
    }
  }
  return result;
}

/** Adjust merges when a row is deleted. Dissolves any merge crossing the deleted row. */
function adjustMergesForRowDelete(model: TableWidgetModel, deleteIdx: number): TableWidgetModel {
  let rows = model.rows.map((row) => row.map((cell) => ({ ...cell })));
  // First: dissolve any merge whose owner spans the deleted row
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = rows[r][c];
      if (!cell.mergedInto && (cell.rowspan ?? 1) > 1) {
        const spanEnd = r + (cell.rowspan ?? 1) - 1;
        if (r <= deleteIdx && spanEnd >= deleteIdx) {
          const m = unmergeCells({ ...model, rows }, r, c);
          rows = m.rows.map((row) => row.map((cl) => ({ ...cl })));
        }
      }
    }
  }
  // Shift mergedInto.r pointers for rows above the deleted one
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = rows[r][c];
      if (cell.mergedInto && cell.mergedInto.r > deleteIdx) {
        cell.mergedInto = { ...cell.mergedInto, r: cell.mergedInto.r - 1 };
      }
    }
  }
  return { ...model, rows };
}

/** Adjust merges when a column is inserted at insertAt. */
function adjustMergesForColInsert(rows: TableWidgetCell[][], insertAt: number): TableWidgetCell[][] {
  const result = rows.map((row) => row.map((cell) => ({ ...cell })));
  for (let r = 0; r < result.length; r++) {
    for (let c = 0; c < result[r].length; c++) {
      const cell = result[r][c];
      if (cell.mergedInto) {
        if (cell.mergedInto.c >= insertAt) {
          cell.mergedInto = { ...cell.mergedInto, c: cell.mergedInto.c + 1 };
        }
      } else if ((cell.colspan ?? 1) > 1) {
        const spanEnd = c + (cell.colspan ?? 1) - 1;
        if (c < insertAt && spanEnd >= insertAt) {
          cell.colspan = (cell.colspan ?? 1) + 1;
        }
      }
    }
  }
  // Mark the new column's cells as slaves where they fall within an existing colspan
  for (let r = 0; r < result.length; r++) {
    const newCell = result[r]?.[insertAt];
    if (!newCell) continue;
    for (let c = 0; c < insertAt; c++) {
      const left = result[r]?.[c];
      if (left && !left.mergedInto && (left.colspan ?? 1) > 1) {
        const spanEnd = c + (left.colspan ?? 1) - 1;
        if (spanEnd >= insertAt) {
          result[r][insertAt] = { html: "&nbsp;", mergedInto: { r, c } };
          break;
        }
      }
    }
  }
  return result;
}

/** Adjust merges when a column is deleted. Dissolves any merge crossing the deleted column. */
function adjustMergesForColDelete(model: TableWidgetModel, deleteIdx: number): TableWidgetModel {
  let rows = model.rows.map((row) => row.map((cell) => ({ ...cell })));
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = rows[r][c];
      if (!cell.mergedInto && (cell.colspan ?? 1) > 1) {
        const spanEnd = c + (cell.colspan ?? 1) - 1;
        if (c <= deleteIdx && spanEnd >= deleteIdx) {
          const m = unmergeCells({ ...model, rows }, r, c);
          rows = m.rows.map((row) => row.map((cl) => ({ ...cl })));
        }
      }
    }
  }
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = rows[r][c];
      if (cell.mergedInto && cell.mergedInto.c > deleteIdx) {
        cell.mergedInto = { ...cell.mergedInto, c: cell.mergedInto.c - 1 };
      }
    }
  }
  return { ...model, rows };
}

function createTableWidgetModel(rows: number, cols: number): TableWidgetModel {
  const r = clamp(rows, 1, 50);
  const c = clamp(cols, 1, 20);
  // Distribute column widths evenly across a standard table width.
  const tableWidth = 520;
  const colWidth = Math.max(60, Math.floor(tableWidth / c));
  return {
    rows: Array.from({ length: r }).map(() =>
      Array.from({ length: c }).map(() => ({ html: "&nbsp;" } satisfies TableWidgetCell))
    ),
    headerRow: false,
    headerCol: false,
    colWidthsPx: Array.from({ length: c }, () => colWidth),
    rowHeightsPx: Array.from({ length: r }, () => 40),
    border: { color: "#e5e7eb", widthPx: 1, style: "solid" },
    cellBg: "transparent",
    bodyTextFmt: { fontFamily: "Inter", fontSizePx: 13 },
    headerTextFmt: { fontFamily: "Inter", fontSizePx: 13, bold: true },
  };
}

/** Render a static preview of the table (no contenteditable — just for display in the document). */
function renderTableWidgetHtml(model: TableWidgetModel): string {
  const bg = model.cellBg && model.cellBg !== "transparent" ? model.cellBg : "";
  const border = `${Math.max(0.5, model.border.widthPx)}px ${model.border.style} ${model.border.color}`;

  const colgroup =
    model.colWidthsPx && model.colWidthsPx.length
      ? `<colgroup>${model.colWidthsPx
          .slice(0, model.rows[0]?.length ?? 0)
          .map((w) => `<col style="width:${Math.max(40, Math.round(w))}px" />`)
          .join("")}</colgroup>`
      : "";

  const body = model.rows
    .map((row, rIdx) => {
      const h = model.rowHeightsPx?.[rIdx];
      const rowStyle = h ? ` style="height:${Math.max(24, Math.round(h))}px"` : "";
      const cells = row
        .map((cell, cIdx) => {
          // Skip slave cells — they are visually covered by their owner via colspan/rowspan
          if (cell.mergedInto) return "";
          const isHeader = (model.headerRow && rIdx === 0) || (model.headerCol && cIdx === 0);
          const tag = isHeader ? "th" : "td";
          const cs = cell.colspan ?? 1;
          const rs = cell.rowspan ?? 1;
          const spanAttrs = [cs > 1 ? `colspan="${cs}"` : "", rs > 1 ? `rowspan="${rs}"` : ""].filter(Boolean).join(" ");
          // Per-cell bg takes priority, then header bg, then table-level bg
          const cellBgOverride = cell.bg && cell.bg !== "transparent" ? cell.bg : "";
          const effectiveBg = cellBgOverride || (isHeader ? "#f3f4f6" : bg);
          // Per-cell border takes priority, then table-level border
          const cellBorder = cell.border;
          const bWidth = cellBorder?.widthPx ?? model.border.widthPx;
          const bStyle = cellBorder?.style ?? model.border.style;
          const bColor = cellBorder?.color ?? model.border.color;
          const cellBorderStr = `${Math.max(0.5, bWidth)}px ${bStyle} ${bColor}`;
          // Per-cell text format: cell → header/body defaults
          const baseTxtFmt = isHeader ? (model.headerTextFmt ?? {}) : (model.bodyTextFmt ?? {});
          const cellTxtFmt = cell.textFmt ?? {};
          const txtFont = cellTxtFmt.fontFamily ?? baseTxtFmt.fontFamily;
          const txtSize = cellTxtFmt.fontSizePx ?? baseTxtFmt.fontSizePx;
          const txtBold = cellTxtFmt.bold ?? baseTxtFmt.bold;
          const txtItalic = cellTxtFmt.italic ?? baseTxtFmt.italic;
          const txtUnderline = cellTxtFmt.underline ?? baseTxtFmt.underline;
          const txtAlign = cellTxtFmt.textAlign ?? baseTxtFmt.textAlign;
          const txtVAlign = cellTxtFmt.verticalAlign ?? baseTxtFmt.verticalAlign ?? "top";
          const txtColor = cellTxtFmt.color ?? baseTxtFmt.color;
          const style = [
            `border:${cellBorderStr}`,
            "padding:6px 8px",
            `vertical-align:${txtVAlign}`,
            "min-height:24px",
            "overflow-wrap:break-word",
            "word-break:break-word",
            "overflow:hidden",
            effectiveBg ? `background:${effectiveBg}` : "",
            txtFont ? `font-family:${txtFont},system-ui,sans-serif` : "",
            txtSize ? `font-size:${txtSize}px` : "",
            (txtBold || isHeader) ? "font-weight:600" : "",
            txtItalic ? "font-style:italic" : "",
            txtUnderline ? "text-decoration:underline" : "",
            txtAlign ? `text-align:${txtAlign}` : "",
            txtColor?.startsWith("gradient:")
              ? `background:${colorToCSS(txtColor)};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`
              : txtColor ? `color:${txtColor}` : "",
          ]
            .filter(Boolean)
            .join(";");
          const safeHtml = cell?.html?.length ? cell.html : "&nbsp;";
          return `<${tag}${spanAttrs ? " " + spanAttrs : ""} style="${style}">${safeHtml}</${tag}>`;
        })
        .join("");
      return `<tr${rowStyle}>${cells}</tr>`;
    })
    .join("");

  const totalW = model.colWidthsPx && model.colWidthsPx.length
    ? model.colWidthsPx.reduce((a, b) => a + b, 0)
    : 0;
  const tableStyle = [
    "border-collapse:collapse",
    totalW > 0 ? `width:${totalW}px` : "width:100%",
    "table-layout:fixed",
  ]
    .join(";");

  return `<table style="${tableStyle}">${colgroup}<tbody>${body}</tbody></table>`;
}

/** Returns the inline style string for a table widget container div.
 *  Auto-floats left with padding when the table is narrower than the page content width. */
function getTableContainerStyle(model: TableWidgetModel, maxContentWidth?: number): string {
  const borderW = model.border?.widthPx ?? 1;
  const base = `cursor:pointer;padding-right:${borderW}px;padding-bottom:${borderW}px`;
  const totalW = model.colWidthsPx?.reduce((a, b) => a + b, 0) ?? 0;
  // Auto-float when table is narrower than page content width
  if (maxContentWidth && totalW > 0 && totalW < maxContentWidth) {
    return `float:left;width:${totalW + borderW}px;margin:8px 24px 8px 0;${base}`;
  }
  // Full width or unknown: normal block flow
  return `margin:12px 0;max-width:100%;${base}`;
}

function exec(command: string, value?: string) {
  // Note: execCommand is deprecated but still widely supported; we already use it in this codebase.
  document.execCommand(command, false, value);
}

function getCleanHtml(el: HTMLElement): string {
  // Keep it simple: store the editor's HTML as-is.
  // If you want stricter output, we can add a sanitizer/normalizer later.
  return el.innerHTML;
}

function downloadText(filename: string, text: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toMarkdown(html: string): string {
  // Minimal HTML → Markdown conversion (v1). We can swap to a proper converter later.
  return (
    html
      .replaceAll(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replaceAll(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replaceAll(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replaceAll(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replaceAll(/<em[^>]*>(.*?)<\/em>/gi, "_$1_")
      .replaceAll(/<i[^>]*>(.*?)<\/i>/gi, "_$1_")
      .replaceAll(/<u[^>]*>(.*?)<\/u>/gi, "$1")
      .replaceAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replaceAll(/<br\s*\/?>/gi, "\n")
      .replaceAll(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replaceAll(/<p[^>]*>/gi, "")
      .replaceAll(/<\/p>/gi, "\n\n")
      .replaceAll(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replaceAll(/<\/ul>|<ul[^>]*>/gi, "\n")
      .replaceAll(/<\/ol>|<ol[^>]*>/gi, "\n")
      .replaceAll(/<[^>]+>/g, "")
      .replaceAll(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

function escapeRtf(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("\n", "\\par\n");
}

function markdownToHtml(md: string): string {
  // Minimal Markdown -> HTML (v1)
  const lines = md.replaceAll("\r\n", "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const h3 = line.match(/^###\s+(.*)$/);
    const h2 = line.match(/^##\s+(.*)$/);
    if (h3) out.push(`<h3>${h3[1]}</h3>`);
    else if (h2) out.push(`<h2>${h2[1]}</h2>`);
    else if (line.trim().startsWith("- ")) out.push(`<ul><li>${line.trim().slice(2)}</li></ul>`);
    else if (line.trim() === "") out.push("<p></p>");
    else out.push(`<p>${line}</p>`);
  }
  return out.join("");
}

function safeFilename(name: string): string {
  return name.replaceAll(/[<>:"/\\|?*\u0000-\u001F]/g, "-").slice(0, 120) || "document";
}

function getPrimaryLanguageTag(tag: string): string {
  return (tag || "en").split("-")[0].toLowerCase();
}

function getTextDirectionForLanguage(tag: string): "ltr" | "rtl" {
  const primary = getPrimaryLanguageTag(tag);
  // Common RTL languages (primary subtags)
  const rtl = new Set(["ar", "he", "fa", "ur", "dv", "ps", "ku", "yi", "ug", "sd"]);
  return rtl.has(primary) ? "rtl" : "ltr";
}

function plainTextToHtml(text: string): string {
  const escaped = (text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const paragraphs = escaped.split(/\n{2,}/g).map((p) => p.replaceAll("\n", "<br/>"));
  return paragraphs.map((p) => `<p>${p || "&nbsp;"}</p>`).join("");
}

function getSupportedLanguages(): Array<{ tag: string; label: string }> {
  try {
    // Modern browsers: returns a long list (closest to “all languages”).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supported = (Intl as any).supportedValuesOf?.("language") as string[] | undefined;
    if (!supported || supported.length === 0) throw new Error("No supportedValuesOf");
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    return supported
      .map((tag) => ({ tag, label: dn.of(tag) || tag }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    // Fallback: use our bundled comprehensive list.
    return [...DOC_LANGUAGES].sort((a, b) => a.label.localeCompare(b.label));
  }
}

export default function DocEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Start writing…",
  className = "",
  templates,
  tenantId,
  comments,
  onCommentsChange,
}: DocEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const latestValueRef = useRef<DocEditorValue>(value);
  const editorRootRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pagesRef = useRef<string[]>(parseHtmlPages(value.html));
  const lastSerializedHtmlRef = useRef<string>("");
  const paginateRafRef = useRef<number | null>(null);
  const paginationInProgressRef = useRef(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedEditorRangeRef = useRef<Range | null>(null);
  const openFileInputRef = useRef<HTMLInputElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"file" | "edit" | "view" | "insert" | "format" | "tools" | "extensions" | "help" | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [languageQuery, setLanguageQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showNonPrinting, setShowNonPrinting] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showSpellingSuggestions, setShowSpellingSuggestions] = useState(true);
  const [showGrammarSuggestions, setShowGrammarSuggestions] = useState(true);

  // ── Section-aware page setup ──
  // sectionInfos tracks per-section page setup + page count.
  // The flat `pages` array is the content; sectionInfos overlays structure on top.
  const defaultPageSetup = useMemo<PageSetup>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("educo_page_setup_default") : null;
      if (stored) return { ...DEFAULT_PAGE_SETUP, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...DEFAULT_PAGE_SETUP };
  }, []);

  interface SectionInfo { pageCount: number; pageSetup: PageSetup; }
  const [sectionInfos, setSectionInfos] = useState<SectionInfo[]>(() => {
    const parsed = parseHtmlSections(value.html, defaultPageSetup);
    return parsed.map(s => ({ pageCount: s.pages.length, pageSetup: s.pageSetup }));
  });
  const sectionInfosRef = useRef<SectionInfo[]>(sectionInfos);
  sectionInfosRef.current = sectionInfos;

  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const activeSectionIdxRef = useRef(0);
  activeSectionIdxRef.current = activeSectionIdx;

  // pageSetup = the active section's setup (for ruler, toolbar, and backward compat)
  const pageSetup = sectionInfos[Math.min(activeSectionIdx, sectionInfos.length - 1)]?.pageSetup || DEFAULT_PAGE_SETUP;

  // Custom setter: updates the active section's pageSetup
  const setPageSetup = useCallback((updater: PageSetup | ((prev: PageSetup) => PageSetup)) => {
    setSectionInfos(prev => {
      const idx = Math.min(activeSectionIdxRef.current, prev.length - 1);
      const currentSetup = prev[idx].pageSetup;
      const newSetup = typeof updater === 'function' ? updater(currentSetup) : updater;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], pageSetup: newSetup };
      return updated;
    });
  }, []);

  // Helpers: map flat page index ↔ section
  const getSectionForPage = useCallback((flatIdx: number): number => {
    let cumulative = 0;
    for (let i = 0; i < sectionInfosRef.current.length; i++) {
      cumulative += sectionInfosRef.current[i].pageCount;
      if (flatIdx < cumulative) return i;
    }
    return sectionInfosRef.current.length - 1;
  }, []);

  const getSectionPageRange = useCallback((sIdx: number): [number, number] => {
    let start = 0;
    for (let i = 0; i < sIdx; i++) start += sectionInfosRef.current[i].pageCount;
    return [start, start + (sectionInfosRef.current[sIdx]?.pageCount || 1) - 1];
  }, []);

  const pageDimensions = useMemo(() => computeSectionDimensions(pageSetup), [pageSetup]);

  const { pageWidthPx, pageHeightPx, marginTopPx, marginBottomPx, marginLeftPx, marginRightPx } = pageDimensions;
  const showPrintLayout = !pageSetup.pageless;
  const [showComments, setShowComments] = useState(false);
  const [showFloatingComments, setShowFloatingComments] = useState(false);
  const [floatingCommentsDismissed, setFloatingCommentsDismissed] = useState(false);
  const [sidebarManuallyDismissed, setSidebarManuallyDismissed] = useState(false);
  const [showEquationToolbar, setShowEquationToolbar] = useState(false);
  // ── Insert Image state ──
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [showImageSearchSidebar, setShowImageSearchSidebar] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  // Selected image state (for contextual toolbar)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<DOMRect | null>(null);
  // Image Options sidebar
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageOptions, setImageOptions] = useState({ opacity: 100, brightness: 100, contrast: 100 });
  const [imageRotation, setImageRotation] = useState(0);
  const [showCropOverlay, setShowCropOverlay] = useState(false);
  const [cropRect, setCropRect] = useState({ top: 0, left: 0, width: 100, height: 100 });
  const [resizeDimensions, setResizeDimensions] = useState<{ w: number; h: number; x: number; y: number } | null>(null);
  const isImageDraggingRef = useRef(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounterRef = useRef(0);
  const [docMode, setDocMode] = useState<"editing" | "suggesting" | "viewing">("editing");
  const [isChromeCollapsed, setIsChromeCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  // Auto-collapse sidebar on mobile viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsSidebarCollapsed(true);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Sidebar state ──
  const [sidebarTabs, setSidebarTabs] = useState<Array<{ id: string; name: string; html: string }>>([
    { id: "tab-1", name: "Tab 1", html: value.html },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [sidebarHeadings, setSidebarHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [tabMenuOpenId, setTabMenuOpenId] = useState<string | null>(null);
  const tabIdCounter = useRef(1);

  // ── Enhanced toolbar state ──
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [lineSpacingOpen, setLineSpacingOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [paragraphStyleOpen, setParagraphStyleOpen] = useState(false);
  const [currentParagraphStyle, setCurrentParagraphStyle] = useState("Normal text");
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const [currentAlignment, setCurrentAlignment] = useState<"left" | "center" | "right" | "justify">("left");
  const [listStyleOpen, setListStyleOpen] = useState(false);
  const [moreToolbarOpen, setMoreToolbarOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentFontFamily, setCurrentFontFamily] = useState("Arial");
  const [currentFontSize, setCurrentFontSize] = useState(11);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateRequestIdRef = useRef(0);
  const [tenantTranslationEnabled, setTenantTranslationEnabled] = useState(true);

  const [dialog, setDialog] = useState<null | "share" | "publish" | "findReplace" | "pageSetup" | "details" | "security" | "versions">(null);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const lastFindIndexRef = useRef(0);
  const [findMatchCount, setFindMatchCount] = useState<{ current: number; total: number } | null>(null);

  const [pages, setPages] = useState<string[]>(() => parseHtmlPages(value.html));

  const [versions, setVersions] = useState<Array<{
    ts: number;
    title: string;
    html: string;
    language?: string;
    author?: { name: string; avatar?: string };
    label?: string;
    type: "manual" | "auto";
  }>>(() => {
    try {
      const stored = localStorage.getItem("educo_doc_versions");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const htmlByLanguageRef = useRef<Map<string, string>>(new Map());

  // Persist versions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("educo_doc_versions", JSON.stringify(versions));
    } catch { /* localStorage full */ }
  }, [versions]);

  // ── Share dialog dependencies ──
  const { user: currentUser } = useSafeUser();
  const { addNotification } = useSafeNotifications();

  // ── Share: generate stable link ID per share session ──
  const shareLinkIdRef = useRef<string>("");
  const getShareLinkId = useCallback(() => {
    if (!shareLinkIdRef.current) {
      shareLinkIdRef.current = `shared-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    return shareLinkIdRef.current;
  }, []);

  // Generate shareable URL for "Copy link"
  const shareLinkUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/doc-editor-test?shared=${getShareLinkId()}`;
  }, [getShareLinkId]);

  // Save/update the shared doc entry in localStorage (used by both share and copy-link)
  const saveSharedDoc = useCallback((role: "viewer" | "editor", target?: { name: string; email: string; isClass?: boolean; isGroup?: boolean }) => {
    const ownerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Someone";
    const title = value.title?.trim() || "Untitled document";
    const lang = value.language || "en";
    const linkId = getShareLinkId();
    try {
      const sharedDocs: Array<{ id: string; [k: string]: unknown }> = JSON.parse(localStorage.getItem("educo_shared_documents") || "[]");
      // Update existing entry with same ID, or add new
      const existingIdx = sharedDocs.findIndex((d) => d.id === linkId);
      const entry = {
        id: linkId,
        title,
        html: value.html,
        language: lang,
        sharedBy: {
          name: ownerName,
          email: currentUser?.email || "",
          avatar: currentUser?.avatar,
        },
        sharedWith: target
          ? { name: target.name, email: target.email, isClass: target.isClass, isGroup: target.isGroup }
          : { name: "Anyone with link", email: "link" },
        role,
        sharedAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) {
        sharedDocs[existingIdx] = entry;
      } else {
        sharedDocs.push(entry);
      }
      localStorage.setItem("educo_shared_documents", JSON.stringify(sharedDocs));
    } catch { /* localStorage full or unavailable */ }
  }, [currentUser, value.title, value.html, value.language, getShareLinkId]);

  // Called when "Copy link" is clicked — ensures the doc is saved so the link works
  const handleCopyLink = useCallback(() => {
    saveSharedDoc("viewer");
  }, [saveSharedDoc]);

  // Save a version snapshot (used by manual save, auto-save on share/publish)
  const saveVersion = useCallback((label?: string, type: "manual" | "auto" = "manual") => {
    const authorName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : undefined;
    setVersions((prev) => [{
      ts: Date.now(),
      title: value.title?.trim() || "Untitled document",
      html: value.html,
      language: value.language || "en",
      author: authorName ? { name: authorName, avatar: currentUser?.avatar } : undefined,
      label,
      type,
    }, ...prev].slice(0, 30));
  }, [currentUser, value.title, value.html, value.language]);

  // Save shared doc to localStorage and send notification
  const handleShareDocument = useCallback(({ sharedWith: target, role }: { sharedWith: ShareTarget; role: "viewer" | "editor" }) => {
    const ownerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Someone";
    const title = value.title?.trim() || "Untitled document";
    saveSharedDoc(role, target);
    saveVersion(`Shared with ${target.name}`, "auto");
    addNotification({
      type: "document_shared",
      title: "Document Shared",
      message: (target.isClass || target.isGroup)
        ? `${ownerName} shared "${title}" with ${target.name}`
        : `${ownerName} shared "${title}" with you`,
      actionUrl: "/documents/shared",
      priority: "normal",
      avatar: currentUser?.avatar,
      userName: ownerName,
    });
  }, [currentUser, value.title, saveSharedDoc, saveVersion, addNotification]);

  // Publish document to a class/group/all
  const handlePublishDocument = useCallback(({ scope, attachment }: { scope: PublishScope; attachment?: PublishAttachment }) => {
    const ownerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Someone";
    const title = value.title?.trim() || "Untitled document";
    const lang = value.language || "en";
    const linkId = getShareLinkId();
    try {
      const publishedDocs: Array<{ id: string; [k: string]: unknown }> = JSON.parse(
        localStorage.getItem("educo_published_documents") || "[]"
      );
      const existingIdx = publishedDocs.findIndex((d) => d.id === linkId);
      const entry = {
        id: linkId,
        title,
        html: value.html,
        language: lang,
        publishedBy: {
          name: ownerName,
          email: currentUser?.email || "",
          avatar: currentUser?.avatar,
        },
        scope,
        attachment,
        publishedAt: existingIdx >= 0 ? (publishedDocs[existingIdx] as Record<string, unknown>).publishedAt as string : new Date().toISOString(),
        updatedAt: existingIdx >= 0 ? new Date().toISOString() : undefined,
      };
      if (existingIdx >= 0) {
        publishedDocs[existingIdx] = entry;
      } else {
        publishedDocs.push(entry);
      }
      localStorage.setItem("educo_published_documents", JSON.stringify(publishedDocs));
    } catch { /* localStorage full or unavailable */ }

    const scopeLabel = scope.type === "all" ? "all users" : scope.name;
    saveVersion(`Published to ${scopeLabel}`, "auto");
    addNotification({
      type: "document_published",
      title: "Document Published",
      message: `${ownerName} published "${title}" to ${scopeLabel}`,
      actionUrl: "/documents/published",
      priority: "normal",
      avatar: currentUser?.avatar,
      userName: ownerName,
    });
    setDialog(null);
  }, [currentUser, value.title, value.html, value.language, getShareLinkId, saveVersion, addNotification]);

  // ── Comment / Review System State ──
  const COMMENTS_STORAGE_KEY = "educo_doc_comments";
  const docId = useMemo(() => getShareLinkId(), [getShareLinkId]);

  const [docComments, setDocComments] = useState<DocComment[]>(() => {
    // Use external comments if provided, otherwise load from localStorage
    if (comments) return comments;
    try {
      const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (stored) {
        const all: DocComment[] = JSON.parse(stored);
        return all.filter((c) => c.documentId === docId).filter((c) => {
          // Skip comments without valid highlight data
          const hr = c.highlightRange;
          if (!hr) return false;
          // New format: has textOffset + selectedText
          if (hr.textOffset != null && c.selectedText) return true;
          // Legacy format: has anchorPath/focusPath
          return !!(hr.anchorPath && hr.focusPath);
        });
      }
    } catch { /* ignore */ }
    return [];
  });
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentTab, setCommentTab] = useState<"for-you" | "all">("all");
  const [commentFilter, setCommentFilter] = useState<"open" | "resolved" | "rejected" | "all">("open");
  const [commentPopover, setCommentPopover] = useState<{
    show: boolean;
    x: number;
    y: number;
    selectedText: string;
    range: DocComment["highlightRange"] | null;
  }>({ show: false, x: 0, y: 0, selectedText: "", range: null });
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Persist comments to localStorage when they change
  useEffect(() => {
    if (onCommentsChange) {
      onCommentsChange(docComments);
    } else {
      try {
        const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const all: DocComment[] = stored ? JSON.parse(stored) : [];
        const others = all.filter((c) => c.documentId !== docId);
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify([...others, ...docComments]));
      } catch { /* localStorage full */ }
    }
  }, [docComments, docId, onCommentsChange]);

  // Build author object from current user
  const commentAuthor = useMemo<CommentAuthor>(() => {
    if (!currentUser) return { id: "anonymous", name: "Anonymous" };
    return {
      id: currentUser.id || currentUser.email || "user",
      name: `${currentUser.firstName} ${currentUser.lastName}`.trim() || "User",
      avatar: currentUser.avatar,
      role: currentUser.role,
    };
  }, [currentUser]);

  // Get XPath-like path from page root to a node
  const getNodePath = useCallback((root: Node, target: Node): string => {
    if (target === root) return "";
    const parts: string[] = [];
    let node: Node | null = target;
    while (node && node !== root) {
      const parent: Node | null = node.parentNode;
      if (!parent) break;
      let idx = 0;
      for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] === node) { idx = i; break; }
      }
      parts.unshift(String(idx));
      node = parent;
    }
    return parts.join("/");
  }, []);

  // Resolve a path back to a node
  const resolveNodePath = useCallback((root: Node, path: string): Node | null => {
    if (!path) return null;
    const parts = path.split("/");
    let node: Node = root;
    for (const p of parts) {
      const idx = parseInt(p, 10);
      if (isNaN(idx) || !node.childNodes[idx]) return null;
      node = node.childNodes[idx];
    }
    return node;
  }, []);

  // Add a new comment from the current selection
  const addComment = useCallback((text: string, mentions: CommentMention[] = []) => {
    if (!commentPopover.range || !commentPopover.selectedText) return;
    const id = `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const newComment: DocComment = {
      id,
      documentId: docId,
      author: commentAuthor,
      selectedText: commentPopover.selectedText,
      highlightRange: commentPopover.range,
      tabId: activeTabId,
      text,
      mentions,
      status: "open",
      replies: [],
      createdAt: now,
      updatedAt: now,
    };
    setDocComments((prev) => [newComment, ...prev]);
    setCommentPopover({ show: false, x: 0, y: 0, selectedText: "", range: null });
    setActiveCommentId(id);
    if (!showComments) setShowComments(true);

    // Send notification to document owner (if commenter is not the owner)
    addNotification({
      type: "document_comment",
      title: "New Comment",
      message: `${commentAuthor.name} commented on "${value.title?.trim() || "Untitled document"}"`,
      priority: "normal",
      avatar: commentAuthor.avatar,
      userName: commentAuthor.name,
    });

    // Send mention notifications
    mentions.forEach((m) => {
      addNotification({
        type: "document_comment_mention",
        title: "You were mentioned",
        message: `${commentAuthor.name} mentioned you in a comment on "${value.title?.trim() || "Untitled document"}"`,
        priority: "high",
        avatar: commentAuthor.avatar,
        userName: commentAuthor.name,
        targetUserId: m.userId,
      });
    });

    return id;
  }, [commentPopover, docId, commentAuthor, showComments, addNotification, value.title]);

  // Reply to an existing comment
  const addReply = useCallback((commentId: string, text: string, mentions: CommentMention[] = []) => {
    const replyId = `reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const reply: CommentReply = {
      id: replyId,
      author: commentAuthor,
      text,
      mentions,
      createdAt: new Date().toISOString(),
    };
    setDocComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply], updatedAt: new Date().toISOString() }
          : c
      )
    );

    // Find the comment to get original author
    const comment = docComments.find((c) => c.id === commentId);
    if (comment && comment.author.id !== commentAuthor.id) {
      addNotification({
        type: "document_comment_reply",
        title: "Reply to your comment",
        message: `${commentAuthor.name} replied to your comment on "${value.title?.trim() || "Untitled document"}"`,
        priority: "normal",
        avatar: commentAuthor.avatar,
        userName: commentAuthor.name,
        targetUserId: comment.author.id,
      });
    }

    mentions.forEach((m) => {
      addNotification({
        type: "document_comment_mention",
        title: "You were mentioned",
        message: `${commentAuthor.name} mentioned you in a reply on "${value.title?.trim() || "Untitled document"}"`,
        priority: "high",
        avatar: commentAuthor.avatar,
        userName: commentAuthor.name,
        targetUserId: m.userId,
      });
    });
  }, [commentAuthor, docComments, addNotification, value.title]);

  // Resolve a comment
  const resolveComment = useCallback((commentId: string, message?: string) => {
    setDocComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              status: "resolved" as CommentStatus,
              resolution: { by: commentAuthor, action: "resolved", message, at: new Date().toISOString() },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    const comment = docComments.find((c) => c.id === commentId);
    if (comment && comment.author.id !== commentAuthor.id) {
      addNotification({
        type: "document_comment_resolved",
        title: "Comment Resolved",
        message: `${commentAuthor.name} resolved your comment on "${value.title?.trim() || "Untitled document"}"`,
        priority: "normal",
        avatar: commentAuthor.avatar,
        userName: commentAuthor.name,
        targetUserId: comment.author.id,
      });
    }
  }, [commentAuthor, docComments, addNotification, value.title]);

  // Reject a comment
  const rejectComment = useCallback((commentId: string, message?: string) => {
    setDocComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              status: "rejected" as CommentStatus,
              resolution: { by: commentAuthor, action: "rejected", message, at: new Date().toISOString() },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    const comment = docComments.find((c) => c.id === commentId);
    if (comment && comment.author.id !== commentAuthor.id) {
      addNotification({
        type: "document_comment_rejected",
        title: "Comment Rejected",
        message: `${commentAuthor.name} rejected your comment on "${value.title?.trim() || "Untitled document"}"`,
        priority: "normal",
        avatar: commentAuthor.avatar,
        userName: commentAuthor.name,
        targetUserId: comment.author.id,
      });
    }
  }, [commentAuthor, docComments, addNotification, value.title]);

  // Reopen a resolved/rejected comment
  const reopenComment = useCallback((commentId: string) => {
    setDocComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, status: "open" as CommentStatus, resolution: undefined, updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  // Delete a comment
  const deleteComment = useCallback((commentId: string) => {
    setDocComments((prev) => prev.filter((c) => c.id !== commentId));
    if (activeCommentId === commentId) setActiveCommentId(null);
  }, [activeCommentId]);

  // Handle text selection for adding comments — triggered from toolbar button
  const handleAddCommentFromSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setToast("Select text to add a comment");
      return;
    }
    const range = sel.getRangeAt(0);
    const selectedText = sel.toString().trim();
    if (!selectedText) {
      setToast("Select text to add a comment");
      return;
    }

    // Find which page contains the selection
    let pageIndex = -1;
    for (let i = 0; i < pageRefs.current.length; i++) {
      const pageEl = pageRefs.current[i];
      if (pageEl && pageEl.contains(range.startContainer)) {
        pageIndex = i;
        break;
      }
    }
    if (pageIndex < 0) {
      setToast("Select text inside the document to comment");
      return;
    }

    const pageEl = pageRefs.current[pageIndex]!;

    // Compute character offset of selection start within the page's textContent
    // Walk all text nodes in document order, sum their lengths until we reach the start container
    const computeTextOffset = (container: Node, offset: number): number => {
      const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
      let charCount = 0;
      let current = walker.nextNode();
      while (current) {
        if (current === container) {
          // For text nodes, add the offset within the node
          return charCount + (container.nodeType === Node.TEXT_NODE ? offset : 0);
        }
        charCount += current.textContent?.length || 0;
        current = walker.nextNode();
      }
      // If container is an element, find the text node at the child offset
      if (container.nodeType !== Node.TEXT_NODE && container.childNodes.length > 0) {
        const child = container.childNodes[Math.min(offset, container.childNodes.length - 1)];
        const walker2 = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
        let count = 0;
        let node = walker2.nextNode();
        while (node) {
          if (child.contains(node) || child === node) return count;
          count += node.textContent?.length || 0;
          node = walker2.nextNode();
        }
      }
      return charCount;
    };

    const textOffset = computeTextOffset(range.startContainer, range.startOffset);

    // Position popover to the right of the page (in the margin), aligned with the selection vertically
    const rect = range.getBoundingClientRect();
    const rootRect = rootRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    const pageRect = pageEl.getBoundingClientRect();
    // Place popover just past the right edge of the page
    const popoverX = pageRect.right - rootRect.left + 16;

    setCommentPopover({
      show: true,
      x: popoverX,
      y: rect.top - rootRect.top,
      selectedText,
      range: {
        pageIndex,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        anchorPath: "",
        focusPath: "",
        textOffset,
      },
    });

  }, []);

  // Navigate to a comment's highlighted text in the document
  const scrollToComment = useCallback((comment: DocComment) => {
    const { pageIndex } = comment.highlightRange;
    const pageEl = pageRefs.current[pageIndex];
    if (!pageEl) return;

    const selectedText = comment.selectedText || "";

    // Find the highlight span for this comment (if already applied)
    const highlightSpan = pageEl.querySelector(`span[data-doc-comment-highlight="${comment.id}"]`);
    if (highlightSpan) {
      highlightSpan.scrollIntoView({ behavior: "smooth", block: "center" });
      (highlightSpan as HTMLElement).style.transition = "background-color 0.3s";
      (highlightSpan as HTMLElement).style.backgroundColor = "rgba(99, 102, 241, 0.3)";
      setTimeout(() => {
        (highlightSpan as HTMLElement).style.backgroundColor = "";
        (highlightSpan as HTMLElement).style.transition = "";
      }, 1500);
      return;
    }

    // Fallback: find the text by offset and scroll to it
    if (!selectedText) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Find the text node containing the selected text using text offset
    let targetOffset = comment.highlightRange.textOffset;
    if (targetOffset == null) {
      const pageText = pageEl.textContent || "";
      targetOffset = pageText.indexOf(selectedText);
    }
    if (targetOffset < 0) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Walk text nodes to find the one at this offset
    const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
    let cumulative = 0;
    let current = walker.nextNode();
    while (current) {
      const len = current.textContent?.length || 0;
      if (cumulative + len > targetOffset) {
        // This text node contains our target
        try {
          const range = document.createRange();
          range.setStart(current, targetOffset - cumulative);
          range.collapse(true);
          const tempSpan = document.createElement("span");
          tempSpan.setAttribute("data-comment-scroll-target", "true");
          range.insertNode(tempSpan);
          tempSpan.scrollIntoView({ behavior: "smooth", block: "center" });
          tempSpan.parentNode?.removeChild(tempSpan);
          pageEl.normalize();
        } catch {
          pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      cumulative += len;
      current = walker.nextNode();
    }

    pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Comment highlight spans — text-offset based approach
  // Instead of DOM paths, uses character offset within page textContent to find and wrap text
  // Resolve the character range for a comment within its page element
  const resolveCommentRange = useCallback((comment: DocComment): { pageEl: HTMLElement; hlStart: number; hlEnd: number } | null => {
    const { pageIndex } = comment.highlightRange;
    const pageEl = pageRefs.current[pageIndex];
    if (!pageEl) return null;

    const selectedText = comment.selectedText || "";
    if (!selectedText.trim()) return null;

    let hlStart: number;
    let hlEnd: number;

    if (comment.highlightRange.textOffset != null) {
      hlStart = comment.highlightRange.textOffset;
      hlEnd = hlStart + selectedText.length;
    } else {
      const pageText = pageEl.textContent || "";
      const idx = pageText.indexOf(selectedText);
      if (idx < 0) return null;
      hlStart = idx;
      hlEnd = idx + selectedText.length;
    }

    // Validate text at offset matches
    const pageText = pageEl.textContent || "";
    const actualText = pageText.slice(hlStart, hlEnd);
    if (actualText !== selectedText) {
      const searchStart = Math.max(0, hlStart - 50);
      const searchEnd = Math.min(pageText.length, hlEnd + 50);
      const searchRegion = pageText.slice(searchStart, searchEnd);
      const foundIdx = searchRegion.indexOf(selectedText);
      if (foundIdx < 0) return null;
      hlStart = searchStart + foundIdx;
      hlEnd = hlStart + selectedText.length;
    }

    return { pageEl, hlStart, hlEnd };
  }, []);

  const applyCommentHighlights = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    // 1. Remove all existing highlight spans (restore original text nodes)
    const existingSpans = root.querySelectorAll("span[data-doc-comment-highlight]");
    existingSpans.forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
      parent.normalize();
    });

    // Only highlight the active comment — no active comment means no highlights
    if (!activeCommentId) return;

    const comment = docComments.find((c) => c.id === activeCommentId && c.status === "open");
    if (!comment) return;

    const resolved = resolveCommentRange(comment);
    if (!resolved) return;
    const { pageEl, hlStart, hlEnd } = resolved;

    const ACTIVE_BG = "rgba(99, 102, 241, 0.18)";
    const ACTIVE_BORDER = "2px solid rgba(99, 102, 241, 0.5)";

    try {
      // Walk text nodes, track cumulative position, wrap the matching portions
      const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
      const textNodes: { node: Text; nodeStart: number; nodeEnd: number }[] = [];
      let cumulative = 0;
      let current = walker.nextNode();
      while (current) {
        const len = current.textContent?.length || 0;
        const nodeStart = cumulative;
        const nodeEnd = cumulative + len;
        if (nodeEnd > hlStart && nodeStart < hlEnd) {
          textNodes.push({ node: current as Text, nodeStart, nodeEnd });
        }
        cumulative += len;
        current = walker.nextNode();
        if (nodeStart > hlEnd) break;
      }

      if (textNodes.length === 0) return;

      // Wrap each overlapping text node portion (in reverse to keep offsets valid)
      for (let i = textNodes.length - 1; i >= 0; i--) {
        const { node, nodeStart, nodeEnd } = textNodes[i];
        const parentEl = node.parentNode;
        if (!parentEl) continue;
        if ((parentEl as Element).getAttribute?.("data-doc-comment-highlight") === comment.id) continue;

        const sliceStart = Math.max(0, hlStart - nodeStart);
        const sliceEnd = Math.min(nodeEnd - nodeStart, hlEnd - nodeStart);

        const beforeText = node.textContent?.slice(0, sliceStart) || "";
        const highlightText = node.textContent?.slice(sliceStart, sliceEnd) || "";
        const afterText = node.textContent?.slice(sliceEnd) || "";

        if (!highlightText) continue;

        const span = document.createElement("span");
        span.setAttribute("data-doc-comment-highlight", comment.id);
        span.style.backgroundColor = ACTIVE_BG;
        span.style.borderBottom = ACTIVE_BORDER;
        span.style.borderRadius = "2px";
        span.style.cursor = "pointer";
        span.style.transition = "background-color 0.2s, border-color 0.2s";
        span.title = `Comment by ${comment.author.name}`;
        span.textContent = highlightText;

        // Click on highlight keeps it active (stopPropagation prevents click-away dismiss)
        span.addEventListener("click", (e) => {
          e.stopPropagation();
        });

        const frag = document.createDocumentFragment();
        if (beforeText) frag.appendChild(document.createTextNode(beforeText));
        frag.appendChild(span);
        if (afterText) frag.appendChild(document.createTextNode(afterText));
        parentEl.replaceChild(frag, node);
      }
    } catch {
      // Range may not be valid if document content changed
    }
  }, [docComments, activeCommentId, resolveCommentRange]);

  // Apply comment highlights when active comment changes
  useEffect(() => {
    const timer = setTimeout(applyCommentHighlights, 100);
    return () => clearTimeout(timer);
  }, [applyCommentHighlights]);

  // Click-away dismiss: clicking anywhere except highlighted text or its comment card clears the active comment
  useEffect(() => {
    if (!activeCommentId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // Keep active if clicking on the highlighted text itself
      if (target.closest("[data-doc-comment-highlight]")) return;
      // Keep active if clicking anywhere in the comments sidebar panel
      if (target.closest("[data-doc-comments-panel]")) return;
      // Keep active if clicking on the comment card in the sidebar
      if (target.closest("[data-doc-comment-card]")) return;
      // Keep active if clicking on the floating comment pill
      if (target.closest("[data-doc-floating-pill]")) return;
      // Keep active if clicking on the comment popover (creation form)
      if (target.closest("[data-doc-comment-popover]")) return;
      // Dismiss
      setActiveCommentId(null);
    };
    // Use capture phase so we detect clicks before stopPropagation in children
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [activeCommentId]);

  // Detect cursor inside commented text — activate that comment automatically
  useEffect(() => {
    const tabOpenComments = docComments.filter((c) => c.status === "open" && (!c.tabId || c.tabId === activeTabId));
    if (tabOpenComments.length === 0) return;

    const handler = () => {
      const sel = window.getSelection();
      if (!sel || !sel.isCollapsed || !sel.rangeCount) return; // Only for caret, not text selection
      if (commentPopover.show) return; // Don't interfere with comment creation

      const caretNode = sel.anchorNode;
      if (!caretNode) return;

      // Check if caret is inside the editor
      const root = rootRef.current;
      if (!root || !root.contains(caretNode)) return;

      // Find which page the caret is in and compute its character offset
      let caretPageEl: HTMLElement | null = null;
      let caretPageIdx = -1;
      for (let i = 0; i < pageRefs.current.length; i++) {
        const p = pageRefs.current[i];
        if (p && p.contains(caretNode)) {
          caretPageEl = p;
          caretPageIdx = i;
          break;
        }
      }
      if (!caretPageEl || caretPageIdx < 0) return;

      // Compute caret's character offset within the page's textContent
      const walker = document.createTreeWalker(caretPageEl, NodeFilter.SHOW_TEXT);
      let caretOffset = 0;
      let current = walker.nextNode();
      while (current) {
        if (current === caretNode) {
          caretOffset += sel.anchorOffset;
          break;
        }
        caretOffset += current.textContent?.length || 0;
        current = walker.nextNode();
      }

      // Check if the caret falls inside any comment's text range
      for (const comment of tabOpenComments) {
        if (comment.highlightRange.pageIndex !== caretPageIdx) continue;
        const resolved = resolveCommentRange(comment);
        if (!resolved) continue;
        if (caretOffset >= resolved.hlStart && caretOffset <= resolved.hlEnd) {
          // Caret is inside this comment's text
          if (activeCommentId !== comment.id) {
            setActiveCommentId(comment.id);
          }
          return;
        }
      }
    };

    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [docComments, activeTabId, commentPopover.show, activeCommentId, resolveCommentRange]);

  // Mock users for @mention autocomplete (reuse share dialog's people list pattern)
  const mentionableUsers = useMemo(() => [
    { id: "user-1", name: "Sylvia Thompson", avatar: "https://i.pravatar.cc/300?img=1" },
    { id: "user-2", name: "Shawn Williams", avatar: "https://i.pravatar.cc/300?img=12" },
    { id: "user-3", name: "John Smith", avatar: "https://i.pravatar.cc/300?img=15" },
    { id: "user-4", name: "George Wilson", avatar: "https://i.pravatar.cc/300?img=33" },
    { id: "user-5", name: "James Brown", avatar: "https://i.pravatar.cc/300?img=17" },
    { id: "user-6", name: "Teressa Johnson", avatar: "https://i.pravatar.cc/300?img=5" },
  ], []);

  // Mention hook for the comment creation popover
  const popoverMention = useMention({
    users: mentionableUsers,
    inputRef: commentInputRef,
    value: commentText,
    onChange: setCommentText,
  });

  // Parse @mentions from text
  const parseMentions = useCallback((text: string): CommentMention[] => {
    const mentions: CommentMention[] = [];
    const regex = /@(\w+(?:\s+\w+)?)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const name = match[1];
      const user = mentionableUsers.find((u) => u.name.toLowerCase().includes(name.toLowerCase()));
      if (user) {
        mentions.push({ userId: user.id, name: user.name, offset: match.index, length: match[0].length });
      }
    }
    return mentions;
  }, [mentionableUsers]);

  // Keyboard shortcut: Ctrl+Alt+M to add comment
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "m") {
        e.preventDefault();
        handleAddCommentFromSelection();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAddCommentFromSelection]);

  // Floating margin bubble — appears when text is selected inside the editor
  const [marginBubble, setMarginBubble] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 });
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount || commentPopover.show) {
        setMarginBubble({ show: false, x: 0, y: 0 });
        return;
      }
      // Check if selection is inside the editor
      const range = sel.getRangeAt(0);
      const root = rootRef.current;
      if (!root || !root.contains(range.startContainer)) {
        setMarginBubble({ show: false, x: 0, y: 0 });
        return;
      }
      const rect = range.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      // Position bubble in the right margin
      setMarginBubble({
        show: true,
        x: Math.min(rootRect.right - rootRect.left - 40, rootRect.width - 48),
        y: rect.top - rootRect.top + rect.height / 2 - 16,
      });
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [commentPopover.show]);

  // Filter comments for display
  const openComments = useMemo(() => docComments.filter((c) => c.status === "open" && (!c.tabId || c.tabId === activeTabId)), [docComments, activeTabId]);
  // Open comments sorted by text position (top of document first)
  const sortedOpenComments = useMemo(() => {
    return [...openComments].sort((a, b) => {
      if (a.highlightRange.pageIndex !== b.highlightRange.pageIndex) return a.highlightRange.pageIndex - b.highlightRange.pageIndex;
      return (a.highlightRange.textOffset ?? Infinity) - (b.highlightRange.textOffset ?? Infinity);
    });
  }, [openComments]);
  const resolvedComments = useMemo(() => docComments.filter((c) => (c.status === "resolved" || c.status === "rejected") && (!c.tabId || c.tabId === activeTabId)), [docComments, activeTabId]);

  // Default: show floating comments if unresolved comments exist (Mode A)
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (hasAutoOpened.current || floatingCommentsDismissed) return;
    if (openComments.length > 0) {
      setShowFloatingComments(true);
      hasAutoOpened.current = true;
    }
  }, [openComments, floatingCommentsDismissed]);

  // Mutual exclusivity: sidebar open → hide floating; sidebar close → show floating (if comments exist)
  useEffect(() => {
    if (showComments) {
      setShowFloatingComments(false);
    } else if (openComments.length > 0 && !floatingCommentsDismissed) {
      setShowFloatingComments(true);
    }
  }, [showComments, openComments.length, floatingCommentsDismissed]);

  // Compute floating pill positions — vertical offset relative to the editor root
  const [floatingPillPositions, setFloatingPillPositions] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!showFloatingComments || showComments) { setFloatingPillPositions({}); return; }
    const timer = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const rootRect = root.getBoundingClientRect();
      const positions: Record<string, number> = {};
      for (const comment of openComments) {
        const highlightSpan = root.querySelector(`span[data-doc-comment-highlight="${comment.id}"]`);
        if (highlightSpan) {
          const markRect = highlightSpan.getBoundingClientRect();
          positions[comment.id] = markRect.top - rootRect.top + markRect.height / 2 - 16;
        }
      }
      setFloatingPillPositions(positions);
    }, 200);
    return () => clearTimeout(timer);
  }, [showFloatingComments, showComments, openComments, applyCommentHighlights]);

  const sidebarFeedRef = useRef<HTMLDivElement>(null);

  // "For you" filter: comments where current user is mentioned or authored
  const forYouComments = useMemo(() => {
    const userId = commentAuthor.id;
    return docComments.filter((c) => {
      if (c.tabId && c.tabId !== activeTabId) return false;
      if (c.author.id === userId) return true;
      if (c.mentions.some((m) => m.userId === userId)) return true;
      if (c.replies.some((r) => r.mentions.some((m) => m.userId === userId))) return true;
      return false;
    });
  }, [docComments, commentAuthor.id, activeTabId]);

  // Final filtered list based on tab + filter + active tab
  const filteredComments = useMemo(() => {
    let base = commentTab === "for-you" ? forYouComments : docComments;
    // Filter to current tab (comments without tabId show everywhere for backwards compat)
    base = base.filter((c) => !c.tabId || c.tabId === activeTabId);
    if (commentFilter === "open") base = base.filter((c) => c.status === "open");
    else if (commentFilter === "resolved") base = base.filter((c) => c.status === "resolved");
    else if (commentFilter === "rejected") base = base.filter((c) => c.status === "rejected");
    return base;
  }, [commentTab, commentFilter, docComments, forYouComments, activeTabId]);

  // Sort comments by their text position in the document (top to bottom)
  const sortedFilteredComments = useMemo(() => {
    return [...filteredComments].sort((a, b) => {
      const aOffset = a.highlightRange.textOffset ?? Infinity;
      const bOffset = b.highlightRange.textOffset ?? Infinity;
      // First sort by page, then by text offset within the page
      if (a.highlightRange.pageIndex !== b.highlightRange.pageIndex) {
        return a.highlightRange.pageIndex - b.highlightRange.pageIndex;
      }
      return aOffset - bOffset;
    });
  }, [filteredComments]);

  const canEdit = !readOnly && docMode !== "viewing";

  const isDocEmpty = useMemo(() => {
    const html = pages[0] || "";
    // Check for text content
    const text = html.replace(/<[^>]*>/g, "").trim();
    if (text.length > 0) return false;
    // Also check for images — a page with just an image is not empty
    if (html.includes("<img")) return false;
    return true;
  }, [pages]);

  // ── Extract headings from document for sidebar outline ──
  useEffect(() => {
    const allHtml = pages.join("");
    const headingRegex = /<(h[1-6])[^>]*(?:\s+id="([^"]*)")?[^>]*>(.*?)<\/\1>/gi;
    const found: Array<{ id: string; text: string; level: number }> = [];
    let match;
    let idx = 0;
    while ((match = headingRegex.exec(allHtml)) !== null) {
      const tag = match[1].toLowerCase();
      const id = match[2] || `heading-${idx}`;
      const text = match[3].replace(/<[^>]*>/g, "").trim();
      if (text) {
        found.push({ id, text, level: parseInt(tag.charAt(1), 10) });
        idx++;
      }
    }
    setSidebarHeadings(found);
  }, [pages]);

  // ── Table editor state (React-controlled panel approach) ──
  // The table in the document is a static preview (contenteditable=false).
  // When clicked, a React panel opens with full editing capabilities.
  // IMPORTANT: We store the widget ID, NOT the DOM element directly, because
  // React re-renders can replace page innerHTML (destroying the element reference).
  // We re-find the element from the ID whenever we need it.
  const [tableWidgetEditor, setTableWidgetEditor] = useState<null | {
    widgetId: string;
    model: TableWidgetModel;
    activeCell: { r: number; c: number };
    selectionRange?: { r1: number; c1: number; r2: number; c2: number };
  }>(null);
  const tableWidgetEditorRef = useRef(tableWidgetEditor);
  useEffect(() => {
    tableWidgetEditorRef.current = tableWidgetEditor;
  }, [tableWidgetEditor]);

  /** Find the current DOM element for the active table widget (may change across re-renders). */
  const getWidgetEl = useCallback((): HTMLElement | null => {
    const cur = tableWidgetEditorRef.current;
    if (!cur) return null;
    const root = editorRootRef.current;
    if (!root) return null;
    return root.querySelector(`[data-doc-table-widget-id="${cur.widgetId}"]`) as HTMLElement | null;
  }, []);

  // Refs for contentEditable cells in the React editor panel
  const cellEditRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  // Drag-to-select state for cell merging
  const cellSelectDragRef = useRef<{ active: boolean; anchorR: number; anchorC: number }>({ active: false, anchorR: 0, anchorC: 0 });
  // Ref for the panel element itself (to measure its actual height for positioning)
  const tablePanelElRef = useRef<HTMLDivElement>(null);
  // Revision counter — increments on structural changes to force React to re-create cell elements
  const [tableRevision, setTableRevision] = useState(0);

  // Table editor panel sub-state
  const [tableBorderPopover, setTableBorderPopover] = useState(false);
  const [tableCellBgPopover, setTableCellBgPopover] = useState(false);
  // Scope for border/bg/text: "cell" applies to active cell only, "all" applies to whole table
  const [borderScope, setBorderScope] = useState<"cell" | "all">("cell");
  const [bgScope, setBgScope] = useState<"cell" | "all">("cell");
  const [textFmtScope, setTextFmtScope] = useState<"cell" | "all" | "header">("all");
  const [tableTextPopover, setTableTextPopover] = useState(false);

  const effectiveTenantId =
    tenantId ||
    (typeof window !== "undefined" ? localStorage.getItem("currentTenantId") || "" : "");

  useEffect(() => {
    let cancelled = false;
    async function loadTenantTranslationConfig() {
      if (!effectiveTenantId) return;
      try {
        const res = await fetch(`/api/tenants/${effectiveTenantId}/translation`, {
          method: "GET",
          headers: { "content-type": "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { translation?: { enabled?: boolean } | null };
        const enabled =
          typeof data.translation?.enabled === "boolean" ? data.translation.enabled : true;
        if (!cancelled) setTenantTranslationEnabled(enabled);
      } catch {
        // Best-effort only: if we can't load config, keep translation enabled.
      }
    }
    void loadTenantTranslationConfig();
    return () => {
      cancelled = true;
    };
  }, [effectiveTenantId]);

  const hasTemplates = (templates?.length ?? 0) > 0;
  const defaultTemplates = useMemo<DocTemplate[]>(
    () => [
      {
        id: "meeting-notes",
        label: "Meeting notes",
        icon: FileText,
        html: [
          "<h2>Meeting notes</h2>",
          "<p><strong>Date:</strong> </p>",
          "<p><strong>Attendees:</strong> </p>",
          "<h3>Agenda</h3>",
          "<ul><li></li></ul>",
          "<h3>Notes</h3>",
          "<ul><li></li></ul>",
          "<h3>Action items</h3>",
          "<ul><li><strong>Owner</strong> — </li></ul>",
        ].join(""),
      },
      {
        id: "email-draft",
        label: "Email draft",
        icon: Mail,
        html: [
          "<h2>Email draft</h2>",
          "<p><strong>To:</strong> </p>",
          "<p><strong>Subject:</strong> </p>",
          "<p>Hello,</p>",
          "<p></p>",
          "<p>Best regards,</p>",
        ].join(""),
      },
    ],
    []
  );

  const resolvedTemplates = templates ?? defaultTemplates;

  const docTitle = value.title?.trim() ? value.title : "Untitled document";
  const language = value.language || "en";
  const supportedLanguages = useMemo(() => getSupportedLanguages(), []);
  const filteredLanguages = useMemo(() => {
    const q = languageQuery.trim().toLowerCase();
    if (!q) return supportedLanguages;
    return supportedLanguages.filter(
      (l) => l.label.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q)
    );
  }, [languageQuery, supportedLanguages]);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const updateValue = useCallback(
    (partial: Partial<DocEditorValue>) => {
      onChange({ ...latestValueRef.current, ...partial });
    },
    [onChange]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  }, []);

  // Keep pages and sections in sync when value.html changes externally
  useEffect(() => {
    if (value.html === lastSerializedHtmlRef.current) return;
    const parsed = parseHtmlSections(value.html, defaultPageSetup);
    const nextPages = parsed.flatMap(s => s.pages);
    setPages(nextPages);
    pagesRef.current = nextPages;
    setSectionInfos(parsed.map(s => ({ pageCount: s.pages.length, pageSetup: s.pageSetup })));
  }, [value.html, defaultPageSetup]);

  // Close the "More" menu on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  // Close menus on outside click / ESC
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const root = target.closest?.("[data-doc-editor-root]");
      const isInsideEditor = Boolean(root);

      // If you click anywhere outside the menubar/panels (even inside the editor),
      // close the currently open menu/submenu.
      const isInsideMenu = Boolean(
        target.closest?.(
          "[data-doc-menubar],[data-doc-menu-root],[data-doc-menu-panel],[data-doc-dialog]"
        )
      );

      if (!isInsideMenu) {
        setOpenMenu(null);
        setOpenSubmenu(null);
        // If the click is outside the editor entirely, also close template "More" popover.
        if (!isInsideEditor) setMoreOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };
    document.addEventListener("pointerdown", handler, true);
    window.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("pointerdown", handler, true);
      window.removeEventListener("keydown", keyHandler);
    };
  }, [openMenu]);


  // Reset submenu + language search when switching menus
  useEffect(() => {
    setOpenSubmenu(null);
    setLanguageQuery("");
  }, [openMenu]);

  // F11 → toggle fullscreen, Escape → exit fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen((v) => !v);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Fullscreen UX: lock background scroll + allow Esc to exit.
  useEffect(() => {
    if (!isFullscreen) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isFullscreen]);

  const focusEditor = useCallback(() => {
    const active = document.activeElement as HTMLElement | null;
    if (active && editorRootRef.current?.contains(active)) return;
    pageRefs.current[0]?.focus();
  }, []);

  // Save the current editor selection/cursor so we can restore it after
  // the file picker dialog (which clears the browser selection).
  const saveEditorSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Only save if the selection is inside the editor
      if (editorRootRef.current?.contains(range.commonAncestorContainer)) {
        savedEditorRangeRef.current = range.cloneRange();
        return;
      }
    }
    savedEditorRangeRef.current = null;
  }, []);

  // Restore the saved selection, or place cursor at end of first page as fallback.
  // For drag-and-drop, the browser places the cursor at the drop point — if the
  // editor already has a valid selection and no range was saved, we leave it alone.
  const restoreEditorSelection = useCallback(() => {
    const page = pageRefs.current[0];
    if (!page) return;

    const sel = window.getSelection();
    if (!sel) return;

    // Try restoring the saved range
    if (savedEditorRangeRef.current) {
      page.focus();
      try {
        sel.removeAllRanges();
        sel.addRange(savedEditorRangeRef.current);
        savedEditorRangeRef.current = null;
        return;
      } catch {
        // Range may be invalid if DOM changed — fall through to fallback
      }
    }

    // If editor already has focus and a valid selection, leave it (e.g. drag-and-drop)
    if (
      sel.rangeCount > 0 &&
      editorRootRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)
    ) {
      return;
    }

    // Fallback: place cursor at the end of the first page
    page.focus();
    const range = document.createRange();
    range.selectNodeContents(page);
    range.collapse(false); // collapse to end
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const getDocumentText = useCallback(() => {
    const count = pagesRef.current.length;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const el = pageRefs.current[i];
      const t = (el?.innerText || "").trim();
      if (t) parts.push(t);
    }
    return parts.join("\n\n").trim();
  }, []);

  const flushDomToState = useCallback(() => {
    const count = pagesRef.current.length;
    const nextPages = Array.from({ length: count }, (_, idx) => {
      const el = pageRefs.current[idx];
      return el ? getCleanHtml(el) : pagesRef.current[idx] || "<p></p>";
    });
    setPages(nextPages);
    pagesRef.current = nextPages;
    // Serialize using section breaks
    const infos = sectionInfosRef.current;
    const sections: DocSection[] = [];
    let offset = 0;
    for (const info of infos) {
      const end = Math.min(offset + info.pageCount, nextPages.length);
      sections.push({ pageSetup: info.pageSetup, pages: nextPages.slice(offset, end) });
      offset = end;
    }
    // Any remaining pages belong to the last section
    if (offset < nextPages.length && sections.length > 0) {
      sections[sections.length - 1].pages.push(...nextPages.slice(offset));
    } else if (sections.length === 0) {
      sections.push({ pageSetup: DEFAULT_PAGE_SETUP, pages: nextPages });
    }
    const nextHtml = serializeHtmlSections(sections);
    lastSerializedHtmlRef.current = nextHtml;
    updateValue({ html: nextHtml });
  }, [updateValue]);

  const rebalancePages = useCallback(() => {
    if (!showPrintLayout) return;
    if (paginationInProgressRef.current) return;
    paginationInProgressRef.current = true;
    try {
      const pageCount = pagesRef.current.length;

      // Build section boundary set — pages that start a new section (don't pull content across)
      const sectionStartPages = new Set<number>();
      {
        let offset = 0;
        for (const info of sectionInfosRef.current) {
          if (offset > 0) sectionStartPages.add(offset);
          offset += info.pageCount;
        }
      }

      // Push overflow forward (within section boundaries)
      for (let i = 0; i < pageCount; i++) {
        const pageEl = pageRefs.current[i];
        if (!pageEl) continue;
        while (pageEl.scrollHeight > pageEl.clientHeight + 2) {
          let nextEl = pageRefs.current[i + 1];
          if (!nextEl) {
            const nextPages = [...pagesRef.current, "<p></p>"];
            pagesRef.current = nextPages;
            setPages(nextPages);
            // Update section info: add page to current section
            const sIdx = getSectionForPage(i);
            setSectionInfos(prev => {
              const updated = [...prev];
              updated[sIdx] = { ...updated[sIdx], pageCount: updated[sIdx].pageCount + 1 };
              return updated;
            });
            setTimeout(() => rebalancePages(), 0);
            return;
          }
          // Don't push content past a section boundary
          if (sectionStartPages.has(i + 1)) break;
          const last = pageEl.lastChild;
          if (!last) break;
          if (pageEl.childNodes.length <= 1) {
            const only = pageEl.lastElementChild;
            if (only && only.tagName === "P") {
              const words = (only.textContent || "").trim().split(/\s+/).filter(Boolean);
              if (words.length < 10) break;
              let lo = 1;
              let hi = words.length - 1;
              let best = Math.floor(words.length / 2);
              const original = words.join(" ");
              const trySplit = (splitAt: number) => {
                const kept = words.slice(0, splitAt).join(" ");
                const moved = words.slice(splitAt).join(" ");
                only.textContent = kept;
                const p = document.createElement("p");
                p.textContent = moved;
                nextEl.insertBefore(p, nextEl.firstChild);
                const ok = pageEl.scrollHeight <= pageEl.clientHeight + 2;
                p.remove();
                only.textContent = original;
                return ok;
              };
              while (lo <= hi) {
                const mid = Math.floor((lo + hi) / 2);
                if (trySplit(mid)) {
                  best = mid;
                  hi = mid - 1;
                } else {
                  lo = mid + 1;
                }
              }
              const kept = words.slice(0, best).join(" ");
              const moved = words.slice(best).join(" ");
              only.textContent = kept;
              const p = document.createElement("p");
              p.textContent = moved;
              nextEl.insertBefore(p, nextEl.firstChild);
              continue;
            }
            break;
          }
          nextEl.insertBefore(last, nextEl.firstChild);
        }
      }

      // Pull content back when there is space (don't pull across section boundaries)
      for (let i = 0; i < pagesRef.current.length - 1; i++) {
        // Don't pull from a page that starts a new section
        if (sectionStartPages.has(i + 1)) continue;
        const pageEl = pageRefs.current[i];
        const nextEl = pageRefs.current[i + 1];
        if (!pageEl || !nextEl) continue;
        while (nextEl.firstChild) {
          const node = nextEl.firstChild;
          pageEl.appendChild(node);
          if (pageEl.scrollHeight > pageEl.clientHeight + 2) {
            nextEl.insertBefore(node, nextEl.firstChild);
            break;
          }
        }
      }

      // Trim trailing empty pages (but don't remove section-starting pages)
      while (pagesRef.current.length > 1) {
        const lastIdx = pagesRef.current.length - 1;
        if (sectionStartPages.has(lastIdx)) break; // Don't remove a section's only page
        const lastEl = pageRefs.current[lastIdx];
        if (!lastEl) break;
        const html = (lastEl.innerHTML || "")
          .replaceAll(/<br\s*\/?>/gi, "")
          .replaceAll(/&nbsp;/gi, "")
          .trim();
        const text = (lastEl.innerText || "").trim();
        if (text || html.replaceAll(/<p>\s*<\/p>/gi, "").replaceAll(/\s+/g, "").length > 0) break;
        pagesRef.current = pagesRef.current.slice(0, -1);
        setPages(pagesRef.current);
        // Update section info: reduce page count of the section that lost a page
        const sIdx = getSectionForPage(lastIdx);
        setSectionInfos(prev => {
          const updated = [...prev];
          if (updated[sIdx] && updated[sIdx].pageCount > 1) {
            updated[sIdx] = { ...updated[sIdx], pageCount: updated[sIdx].pageCount - 1 };
          }
          return updated;
        });
      }

      // Persist DOM after any reflow/moves.
      flushDomToState();
    } finally {
      paginationInProgressRef.current = false;
    }
  }, [flushDomToState, showPrintLayout, getSectionForPage]);

  const schedulePaginate = useCallback(() => {
    if (paginateRafRef.current != null) cancelAnimationFrame(paginateRafRef.current);
    paginateRafRef.current = requestAnimationFrame(() => {
      paginateRafRef.current = null;
      // Rebalance pages after layout settles.
      rebalancePages();
    });
  }, [rebalancePages]);

  useEffect(() => {
    if (!showPrintLayout) return;
    schedulePaginate();
  }, [schedulePaginate, showPrintLayout]);

  const emitChange = useCallback(() => {
    flushDomToState();
    schedulePaginate();
  }, [flushDomToState, schedulePaginate]);

  const closeMenus = useCallback(() => {
    setOpenMenu(null);
    setOpenSubmenu(null);
  }, []);

  // ── Enhanced toolbar helpers ──
  const closeAllToolbarDropdowns = useCallback(() => {
    setFontFamilyOpen(false);
    setFontSizeOpen(false);
    setTextColorOpen(false);
    setHighlightOpen(false);
    setLineSpacingOpen(false);
    setZoomOpen(false);
    setParagraphStyleOpen(false);
    setAlignmentOpen(false);
    setListStyleOpen(false);
    setMoreToolbarOpen(false);
  }, []);

  // ── Sidebar tab management ──
  // Helper to load HTML into the editor without calling onChange during render.
  // We update pages state and let React re-render the contentEditable divs via
  // their ref callbacks — do NOT touch editorRootRef.innerHTML directly.
  const loadTabContent = useCallback((html: string) => {
    const parsed = parseHtmlSections(html, defaultPageSetup);
    const newPages = parsed.flatMap(s => s.pages);
    if (newPages.length === 0) newPages.push("");
    pagesRef.current = newPages;
    setPages([...newPages]);
    setSectionInfos(parsed.map(s => ({ pageCount: s.pages.length, pageSetup: s.pageSetup })));
    setActiveSectionIdx(0);
    // Also sync each page div's innerHTML via refs
    requestAnimationFrame(() => {
      newPages.forEach((pageHtml, idx) => {
        const el = pageRefs.current[idx];
        if (el && el.innerHTML !== pageHtml) el.innerHTML = pageHtml;
      });
    });
    // Defer onChange to avoid setState-during-render
    setTimeout(() => onChange({ ...latestValueRef.current, html }), 0);
  }, [onChange, defaultPageSetup]);

  const handleCreateTab = useCallback(() => {
    const currentHtml = pagesRef.current.join("");
    tabIdCounter.current += 1;
    const newId = `tab-${tabIdCounter.current}`;
    const newTab = { id: newId, name: `Tab ${tabIdCounter.current}`, html: "" };
    setSidebarTabs((prev) => [
      ...prev.map((t) => t.id === activeTabId ? { ...t, html: currentHtml } : t),
      newTab,
    ]);
    setActiveTabId(newId);
    loadTabContent("");
    showToast("New tab created");
  }, [activeTabId, loadTabContent]);

  const handleSwitchTab = useCallback((tabId: string) => {
    if (tabId === activeTabId) return;
    const currentHtml = pagesRef.current.join("");
    setSidebarTabs((prev) => {
      const updated = prev.map((t) => t.id === activeTabId ? { ...t, html: currentHtml } : t);
      const target = updated.find((t) => t.id === tabId);
      if (target) loadTabContent(target.html);
      return updated;
    });
    setActiveTabId(tabId);
    setActiveCommentId(null);
  }, [activeTabId, loadTabContent]);

  const handleDeleteTab = useCallback((tabId: string) => {
    setSidebarTabs((prev) => {
      if (prev.length <= 1) {
        showToast("Cannot delete the only tab");
        return prev;
      }
      const idx = prev.findIndex((t) => t.id === tabId);
      const remaining = prev.filter((t) => t.id !== tabId);
      if (tabId === activeTabId) {
        const newActive = remaining[Math.min(idx, remaining.length - 1)];
        setActiveTabId(newActive.id);
        loadTabContent(newActive.html);
      }
      return remaining;
    });
    showToast("Tab deleted");
    setTabMenuOpenId(null);
  }, [activeTabId, loadTabContent]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    const currentHtml = pagesRef.current.join("");
    tabIdCounter.current += 1;
    const newId = `tab-${tabIdCounter.current}`;
    setSidebarTabs((prev) => {
      const updated = prev.map((t) => t.id === activeTabId ? { ...t, html: currentHtml } : t);
      const source = updated.find((t) => t.id === tabId);
      if (!source) return prev;
      return [...updated, { id: newId, name: `${source.name} (copy)`, html: source.html }];
    });
    showToast("Tab duplicated");
    setTabMenuOpenId(null);
  }, [activeTabId]);

  const handleFontFamilyChange = useCallback((family: string) => {
    focusEditor();
    exec("fontName", family);
    setCurrentFontFamily(family);
    emitChange();
  }, [emitChange]);

  const handleFontSizeChange = useCallback((sizePx: number) => {
    focusEditor();
    // execCommand fontSize uses 1-7 scale; we use 7 (largest) then replace with inline style
    exec("fontSize", "7");
    // Replace all <font size="7"> created by the command with <span style="font-size: Xpx">
    const root = editorRootRef.current;
    if (root) {
      const fontEls = root.querySelectorAll('font[size="7"]');
      fontEls.forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = `${sizePx}px`;
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
    }
    setCurrentFontSize(sizePx);
    emitChange();
  }, [emitChange]);

  const handleLineSpacingChange = useCallback((value: number) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node = sel.anchorNode as HTMLElement | null;
      while (node && node !== editorRootRef.current) {
        if (node.nodeType === 1 && ["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "LI"].includes(node.tagName)) {
          (node as HTMLElement).style.lineHeight = `${value}`;
          break;
        }
        node = node.parentElement;
      }
    }
    emitChange();
  }, [emitChange]);

  const getOverlayForElement = useCallback((el: HTMLElement) => {
    const wrapper = rootRef.current;
    if (!wrapper) return null;
    const r = el.getBoundingClientRect();
    const wRect = wrapper.getBoundingClientRect();
    return {
      x: Math.max(8, r.left - wRect.left),
      y: Math.max(8, r.top - wRect.top),
      w: Math.max(40, r.width),
      h: Math.max(24, r.height),
      wrapperW: Math.max(1, wRect.width),
      wrapperH: Math.max(1, wRect.height),
    };
  }, []);

  /** Write model back to the DOM element as encoded data + static preview HTML. */
  const maxContentWidth = pageWidthPx - marginLeftPx - marginRightPx - 2;
  const commitTableWidget = useCallback((el: HTMLElement, model: TableWidgetModel) => {
    try {
      el.dataset.docTableWidgetModel = encodeTableWidgetModel(model);
      el.innerHTML = renderTableWidgetHtml(model);
      el.style.cssText = getTableContainerStyle(model, maxContentWidth);

      // Clean up any old float proxies from the previous implementation
      const proxyId = `${el.dataset.docTableWidgetId}_proxy`;
      const parent = el.parentElement;
      const proxy = parent?.querySelector(`[data-table-proxy-id="${proxyId}"]`) as HTMLElement | null;
      if (proxy) proxy.remove();
    } catch {
      // ignore best-effort
    }
  }, [maxContentWidth]);

  /** Open the React editor panel for a table widget element. */
  const openTableWidgetEditor = useCallback(
    (el: HTMLElement, focusCellR = 0, focusCellC = 0) => {
      const widgetId = el.dataset.docTableWidgetId || `tblw_${Math.random().toString(36).slice(2, 9)}`;
      el.dataset.docTableWidgetId = widgetId;
      el.dataset.docTableWidgetSelected = "true";
      const baseModel =
        decodeTableWidgetModel(el.dataset.docTableWidgetModel) ?? createTableWidgetModel(3, 3);
      const colCount = Math.max(1, baseModel.rows[0]?.length ?? 1);
      const rowCount = Math.max(1, baseModel.rows.length);
      const elRect = el.getBoundingClientRect();
      const defaultW = Math.max(200, elRect.width || 520);
      const colWidthsPx =
        baseModel.colWidthsPx && baseModel.colWidthsPx.length === colCount
          ? baseModel.colWidthsPx
          : Array.from({ length: colCount }).map(() => Math.max(80, Math.floor(defaultW / colCount)));
      const rowHeightsPx =
        baseModel.rowHeightsPx && baseModel.rowHeightsPx.length === rowCount
          ? baseModel.rowHeightsPx
          : Array.from({ length: rowCount }).map(() => 40);
      const model: TableWidgetModel = { ...baseModel, colWidthsPx, rowHeightsPx };

      cellEditRefs.current.clear();
      // If the focused cell is a slave (covered by merge), redirect to its owner
      let effectiveR = focusCellR, effectiveC = focusCellC;
      const focusCell = model.rows[focusCellR]?.[focusCellC];
      if (focusCell?.mergedInto) {
        effectiveR = focusCell.mergedInto.r;
        effectiveC = focusCell.mergedInto.c;
      }
      setTableWidgetEditor({ widgetId, model, activeCell: { r: effectiveR, c: effectiveC } });

      // Focus the target cell in the panel after React renders it.
      requestAnimationFrame(() => {
        const cellRef = cellEditRefs.current.get(`${effectiveR},${effectiveC}`);
        cellRef?.focus();
      });
    },
    []
  );

  /** Read all cell content from React panel refs into the model. */
  const readCellsFromPanel = useCallback((model: TableWidgetModel): TableWidgetModel => {
    const rows = model.rows.map((r) => r.map((c) => ({ ...c })));
    cellEditRefs.current.forEach((el, key) => {
      if (!el) return;
      const [rStr, cStr] = key.split(",");
      const r = Number(rStr), c = Number(cStr);
      if (rows[r]?.[c]) {
        const html = el.innerHTML?.trim();
        rows[r][c].html = html && html !== "<br>" ? html : "&nbsp;";
      }
    });
    return { ...model, rows };
  }, []);

  /** Close the editor panel, commit model back to DOM, clear state. */
  const closeTableWidgetEditor = useCallback(() => {
    const cur = tableWidgetEditorRef.current;
    if (!cur) return;
    // Read cells from the React panel before closing.
    const finalModel = readCellsFromPanel(cur.model);
    const el = getWidgetEl();
    if (el) {
      try { el.dataset.docTableWidgetSelected = "false"; } catch { /* ignore */ }
      commitTableWidget(el, finalModel);
    }
    cellEditRefs.current.clear();
    emitChange();
    setTableWidgetEditor(null);
    setTableBorderPopover(false);
    setTableCellBgPopover(false);
    setTableTextPopover(false);
  }, [commitTableWidget, emitChange, readCellsFromPanel, getWidgetEl]);

  // Keep the in-document preview in sync with the model (debounced to avoid excessive DOM writes).
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!tableWidgetEditor) {
      if (syncTimerRef.current) { clearTimeout(syncTimerRef.current); syncTimerRef.current = null; }
      return;
    }
    // Debounce: update the preview 300ms after last model change.
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      const el = getWidgetEl();
      const cur = tableWidgetEditorRef.current;
      if (el && cur) {
        commitTableWidget(el, cur.model);
        // CRITICAL: Also update the React pages state so the page ref callback
        // doesn't reset the DOM back to a stale version on the next re-render.
        emitChange();
      }
    }, 300);
    return () => {
      if (syncTimerRef.current) { clearTimeout(syncTimerRef.current); syncTimerRef.current = null; }
    };
  }, [commitTableWidget, tableWidgetEditor, getWidgetEl, emitChange]);

  // Close table editor panel when clicking outside.
  useEffect(() => {
    if (!tableWidgetEditor) return;

    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const cur = tableWidgetEditorRef.current;
      if (!cur) return;
      // If click is inside the active table widget in the document, keep editing.
      const widgetEl = editorRootRef.current?.querySelector(`[data-doc-table-widget-id="${cur.widgetId}"]`);
      if (widgetEl && widgetEl.contains(target)) return;
      // If click is inside the editor panel, keep editing.
      if (target.closest?.("[data-doc-table-editor-panel]")) return;
      closeTableWidgetEditor();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTableWidgetEditor();
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown as any, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown as any, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeTableWidgetEditor, tableWidgetEditor]);

  // Track panel position anchored to the table widget element.
  const [tablePanelPos, setTablePanelPos] = useState<{ left: number; top: number; width: number } | null>(null);
  useEffect(() => {
    if (!tableWidgetEditor) {
      setTablePanelPos(null);
      setTableBorderPopover(false);
      setTableCellBgPopover(false);
      return;
    }
    const updatePos = () => {
      const root = editorRootRef.current;
      if (!root) { setTablePanelPos(null); return; }
      const el = root.querySelector(`[data-doc-table-widget-id="${tableWidgetEditor.widgetId}"]`) as HTMLElement | null;
      if (!el) { setTablePanelPos(null); return; }
      const rect = el.getBoundingClientRect();
      const panelW = Math.max(360, rect.width);
      // Use actual panel height (measured from DOM) instead of a hardcoded guess.
      const panelH = tablePanelElRef.current?.offsetHeight ?? 200;
      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;
      let topPos: number;
      if (spaceBelow >= panelH + 16) {
        // Position below the table.
        topPos = rect.bottom + 8;
      } else if (spaceAbove >= panelH + 16) {
        // Position above the table, using measured panel height.
        topPos = rect.top - panelH - 8;
      } else {
        // Not enough space either way — overlap, anchored to the table's top.
        topPos = Math.max(8, Math.min(rect.top, window.innerHeight - panelH - 8));
      }
      setTablePanelPos({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - panelW - 8)),
        top: topPos,
        width: panelW,
      });
    };
    // Use rAF to ensure DOM has settled after React re-render before calculating position.
    const rafId = requestAnimationFrame(() => updatePos());
    // Do a second pass after panel has rendered to use its actual measured height.
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(() => updatePos()));
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(raf2);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [tableWidgetEditor]);

  const updateTableWidgetModel = useCallback(
    (updater: (prev: TableWidgetModel) => TableWidgetModel) => {
      setTableWidgetEditor((prev) => {
        if (!prev) return prev;
        // Read current cell content from React panel refs before applying structural change.
        const model = readCellsFromPanel(prev.model);
        const nextModel = updater(model);
        const next = { ...prev, model: nextModel };
        // CRITICAL: Sync ref immediately so commitWidgetSoon (which uses rAF)
        // reads the NEW model, not the stale one. useEffect ref sync runs AFTER rAF.
        tableWidgetEditorRef.current = next;
        return next;
      });
      // Bump revision so React re-creates cells with correct content after structural changes.
      setTableRevision((r) => r + 1);
    },
    [readCellsFromPanel]
  );

  const commitWidgetSoon = useCallback(
    (shouldEmit: boolean) => {
      requestAnimationFrame(() => {
        const cur = tableWidgetEditorRef.current;
        if (!cur) return;
        const el = getWidgetEl();
        if (el) commitTableWidget(el, cur.model);
        if (shouldEmit) emitChange();
      });
    },
    [commitTableWidget, emitChange, getWidgetEl]
  );

  const insertWidgetRow = useCallback(
    (where: "above" | "below") => {
      updateTableWidgetModel((m) => {
        const cols = Math.max(1, m.rows[0]?.length ?? 1);
        const newRow: TableWidgetCell[] = Array.from({ length: cols }).map(() => ({ html: "&nbsp;" }));
        const activeR = tableWidgetEditorRef.current?.activeCell?.r ?? -1;
        const idx = activeR >= 0 ? activeR : m.rows.length - 1;
        const insertAt = where === "above" ? Math.max(0, idx) : Math.min(m.rows.length, idx + 1);
        const rows = [...m.rows.slice(0, insertAt), newRow, ...m.rows.slice(insertAt)];
        const rowHeightsPx = m.rowHeightsPx ? [...m.rowHeightsPx] : undefined;
        if (rowHeightsPx) rowHeightsPx.splice(insertAt, 0, 40);
        // Adjust merges: extend any rowspan that crosses insertAt, mark new row cells as slaves where needed
        const adjustedRows = adjustMergesForRowInsert(rows, insertAt);
        return { ...m, rows: adjustedRows, rowHeightsPx };
      });
      commitWidgetSoon(true);
      showToast(where === "above" ? "Row added above" : "Row added below");
    },
    [commitWidgetSoon, showToast, updateTableWidgetModel]
  );

  const insertWidgetCol = useCallback(
    (where: "left" | "right") => {
      updateTableWidgetModel((m) => {
        const activeC = tableWidgetEditorRef.current?.activeCell?.c ?? -1;
        const idx = activeC >= 0 ? activeC : (m.rows[0]?.length ?? 1) - 1;
        const insertAt =
          where === "left" ? Math.max(0, idx) : Math.min(m.rows[0]?.length ?? 1, idx + 1);
        const rows = m.rows.map((r) => {
          const next = [...r];
          next.splice(insertAt, 0, { html: "&nbsp;" });
          return next;
        });
        // Adjust merges: extend any colspan that crosses insertAt, mark new col cells as slaves where needed
        const adjustedRows = adjustMergesForColInsert(rows, insertAt);
        // Redistribute column widths evenly across the total table width (capped to page).
        const newColCount = adjustedRows[0]?.length ?? 1;
        // Subtract 2 for the 1px border on each side of the page wrapper (border-box)
        const maxW = pageWidthPx - marginLeftPx - marginRightPx - 2;
        const totalWidth = Math.min(maxW, m.colWidthsPx
          ? m.colWidthsPx.reduce((a, b) => a + b, 0)
          : Math.max(400, newColCount * 120));
        const evenWidth = Math.max(60, Math.floor(totalWidth / newColCount));
        const colWidthsPx = Array.from({ length: newColCount }, () => evenWidth);
        return { ...m, rows: adjustedRows, colWidthsPx };
      });
      commitWidgetSoon(true);
      showToast(where === "left" ? "Column added left" : "Column added right");
    },
    [commitWidgetSoon, showToast, updateTableWidgetModel, pageWidthPx, marginLeftPx, marginRightPx]
  );

  const toggleWidgetHeaderRow = useCallback(() => {
    updateTableWidgetModel((m) => ({ ...m, headerRow: !m.headerRow }));
    commitWidgetSoon(true);
    showToast("Header row toggled");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const toggleWidgetHeaderCol = useCallback(() => {
    updateTableWidgetModel((m) => ({ ...m, headerCol: !m.headerCol }));
    commitWidgetSoon(true);
    showToast("Header column toggled");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const mergeSelectedCells = useCallback(() => {
    const cur = tableWidgetEditorRef.current;
    if (!cur?.selectionRange) return;
    const range = cur.selectionRange;
    updateTableWidgetModel((m) => mergeCells(m, range));
    setTableWidgetEditor((prev) =>
      prev ? { ...prev, activeCell: { r: range.r1, c: range.c1 }, selectionRange: undefined } : prev
    );
    commitWidgetSoon(true);
    showToast("Cells merged");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const unmergeActiveCell = useCallback(() => {
    const cur = tableWidgetEditorRef.current;
    if (!cur) return;
    const ac = cur.activeCell;
    updateTableWidgetModel((m) => unmergeCells(m, ac.r, ac.c));
    commitWidgetSoon(true);
    showToast("Cell unmerged");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const setWidgetBorder = useCallback(
    (patch: Partial<TableWidgetModel["border"]>, scope?: "cell" | "all") => {
      const effectiveScope = scope ?? borderScope;
      updateTableWidgetModel((m) => {
        if (effectiveScope === "all") {
          // Apply to whole table + clear per-cell overrides
          const rows = m.rows.map((r) => r.map((c) => {
            const { border: _b, ...rest } = c;
            return rest as TableWidgetCell;
          }));
          return { ...m, rows, border: { ...m.border, ...patch } };
        }
        // Apply to active cell only
        const ac = tableWidgetEditorRef.current?.activeCell;
        if (!ac) return { ...m, border: { ...m.border, ...patch } };
        const rows = m.rows.map((r) => r.map((c) => ({ ...c })));
        const cell = rows[ac.r]?.[ac.c];
        if (cell) {
          cell.border = { ...(cell.border ?? {}), ...patch };
        }
        return { ...m, rows };
      });
      commitWidgetSoon(true);
    },
    [borderScope, commitWidgetSoon, updateTableWidgetModel]
  );

  const setWidgetCellBg = useCallback(
    (bg: string, scope?: "cell" | "all") => {
      const effectiveScope = scope ?? bgScope;
      updateTableWidgetModel((m) => {
        if (effectiveScope === "all") {
          // Apply to whole table + clear per-cell overrides
          const rows = m.rows.map((r) => r.map((c) => {
            const { bg: _bg, ...rest } = c;
            return rest as TableWidgetCell;
          }));
          return { ...m, rows, cellBg: bg };
        }
        // Apply to active cell only
        const ac = tableWidgetEditorRef.current?.activeCell;
        if (!ac) return { ...m, cellBg: bg };
        const rows = m.rows.map((r) => r.map((c) => ({ ...c })));
        const cell = rows[ac.r]?.[ac.c];
        if (cell) {
          cell.bg = bg;
        }
        return { ...m, rows };
      });
      commitWidgetSoon(true);
    },
    [bgScope, commitWidgetSoon, updateTableWidgetModel]
  );

  const setWidgetTextFmt = useCallback(
    (patch: Partial<TableCellTextFormat>, scope?: "cell" | "all" | "header") => {
      const effectiveScope = scope ?? textFmtScope;
      updateTableWidgetModel((m) => {
        if (effectiveScope === "all") {
          // Apply to body text format (clears per-cell overrides)
          const rows = m.rows.map((r) => r.map((c) => {
            const { textFmt: _t, ...rest } = c;
            return rest as TableWidgetCell;
          }));
          return { ...m, rows, bodyTextFmt: { ...(m.bodyTextFmt ?? {}), ...patch } };
        }
        if (effectiveScope === "header") {
          return { ...m, headerTextFmt: { ...(m.headerTextFmt ?? {}), ...patch } };
        }
        // Apply to selection range (if any) or active cell
        const sel = tableWidgetEditorRef.current?.selectionRange;
        const ac = tableWidgetEditorRef.current?.activeCell;
        if (!ac) return { ...m, bodyTextFmt: { ...(m.bodyTextFmt ?? {}), ...patch } };
        const rows = m.rows.map((r) => r.map((c) => ({ ...c })));
        if (sel) {
          for (let r = sel.r1; r <= sel.r2; r++) {
            for (let c = sel.c1; c <= sel.c2; c++) {
              const cell = rows[r]?.[c];
              if (cell && !cell.mergedInto) {
                cell.textFmt = { ...(cell.textFmt ?? {}), ...patch };
              }
            }
          }
        } else {
          const cell = rows[ac.r]?.[ac.c];
          if (cell) {
            cell.textFmt = { ...(cell.textFmt ?? {}), ...patch };
          }
        }
        return { ...m, rows };
      });
      commitWidgetSoon(true);
    },
    [textFmtScope, commitWidgetSoon, updateTableWidgetModel]
  );

  const deleteWidgetRow = useCallback(() => {
    updateTableWidgetModel((m) => {
      if (m.rows.length <= 1) return m; // Keep at least 1 row.
      const activeR = tableWidgetEditorRef.current?.activeCell?.r ?? m.rows.length - 1;
      const idx = clamp(activeR, 0, m.rows.length - 1);
      // Dissolve any merge crossing the deleted row before removing it
      const adjusted = adjustMergesForRowDelete(m, idx);
      const rows = adjusted.rows.filter((_, i) => i !== idx);
      const rowHeightsPx = adjusted.rowHeightsPx ? adjusted.rowHeightsPx.filter((_, i) => i !== idx) : undefined;
      return { ...adjusted, rows, rowHeightsPx };
    });
    commitWidgetSoon(true);
    showToast("Row deleted");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const deleteWidgetCol = useCallback(() => {
    updateTableWidgetModel((m) => {
      const cols = m.rows[0]?.length ?? 1;
      if (cols <= 1) return m; // Keep at least 1 column.
      const activeC = tableWidgetEditorRef.current?.activeCell?.c ?? cols - 1;
      const idx = clamp(activeC, 0, cols - 1);
      // Dissolve any merge crossing the deleted column before removing it
      const adjusted = adjustMergesForColDelete(m, idx);
      const rows = adjusted.rows.map((r) => r.filter((_, i) => i !== idx));
      // Redistribute column widths evenly after deletion.
      const newColCount = rows[0]?.length ?? 1;
      const totalWidth = adjusted.colWidthsPx
        ? adjusted.colWidthsPx.reduce((a, b) => a + b, 0)
        : Math.max(400, newColCount * 120);
      const evenWidth = Math.max(60, Math.floor(totalWidth / newColCount));
      const colWidthsPx = Array.from({ length: newColCount }, () => evenWidth);
      return { ...adjusted, rows, colWidthsPx };
    });
    commitWidgetSoon(true);
    showToast("Column deleted");
  }, [commitWidgetSoon, showToast, updateTableWidgetModel]);

  const deleteWidgetTable = useCallback(() => {
    const cur = tableWidgetEditorRef.current;
    if (!cur) return;
    const el = getWidgetEl();
    setTableWidgetEditor(null);
    if (el) {
      // Remove the widget element from the document.
      let block: HTMLElement = el;
      const container = el.closest?.('[contenteditable="true"]') as HTMLElement | null;
      if (container) {
        while (block.parentElement && block.parentElement !== container) {
          block = block.parentElement as HTMLElement;
        }
      }
      block.remove();
    }
    emitChange();
    showToast("Table deleted");
  }, [emitChange, showToast, getWidgetEl]);

  const moveTableUp = useCallback(() => {
    const el = getWidgetEl();
    if (!el) return;
    // Walk up to the top-level block (direct child of contentEditable container).
    // The table might be nested inside a <p> or <div> when inserted with insertHTML.
    const container = el.closest?.('[contenteditable="true"]') as HTMLElement | null;
    let block: HTMLElement = el;
    if (container) {
      while (block.parentElement && block.parentElement !== container) {
        block = block.parentElement as HTMLElement;
      }
    }
    const prev = block.previousElementSibling;
    if (prev) {
      block.parentNode?.insertBefore(block, prev);
      emitChange();
      setTableWidgetEditor((p) => p ? { ...p } : p);
      showToast("Table moved up");
    } else if (container) {
      // No previous sibling — create an empty paragraph after the table so it can be "moved up"
      // (the table stays at top, but now there's content below it to type in)
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      if (block.nextElementSibling) {
        container.insertBefore(p, block.nextElementSibling);
      } else {
        container.appendChild(p);
      }
      emitChange();
      showToast("Already at top");
    }
  }, [emitChange, showToast, getWidgetEl]);

  const moveTableDown = useCallback(() => {
    const el = getWidgetEl();
    if (!el) return;
    // Walk up to the top-level block (direct child of contentEditable container).
    const container = el.closest?.('[contenteditable="true"]') as HTMLElement | null;
    let block: HTMLElement = el;
    if (container) {
      while (block.parentElement && block.parentElement !== container) {
        block = block.parentElement as HTMLElement;
      }
    }
    const next = block.nextElementSibling;
    if (next) {
      block.parentNode?.insertBefore(block, next.nextSibling);
      emitChange();
      setTableWidgetEditor((p) => p ? { ...p } : p);
      showToast("Table moved down");
    } else if (container) {
      // No next sibling — create an empty paragraph after the table
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      container.appendChild(p);
      emitChange();
      showToast("Already at bottom");
    }
  }, [emitChange, showToast, getWidgetEl]);

  // ── Drag-to-reorder table handle ──
  const tableDragRef = useRef<{
    startY: number;
    el: HTMLElement;
    swapsUp: number;
    swapsDown: number;
  } | null>(null);

  const handleTableDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = getWidgetEl();
    if (!el) return;
    // Walk up to the top-level block (direct child of contentEditable) for correct sibling swaps.
    const container = el.closest?.('[contenteditable="true"]') as HTMLElement | null;
    let block: HTMLElement = el;
    if (container) {
      while (block.parentElement && block.parentElement !== container) {
        block = block.parentElement as HTMLElement;
      }
    }
    tableDragRef.current = { startY: e.clientY, el: block, swapsUp: 0, swapsDown: 0 };
    block.style.transition = "transform 0.15s ease";
    block.style.zIndex = "50";
    block.style.opacity = "0.85";
    document.body.style.cursor = "grabbing";

    const onMove = (me: MouseEvent) => {
      const drag = tableDragRef.current;
      if (!drag) return;
      const deltaY = me.clientY - drag.startY;
      drag.el.style.transform = `translateY(${deltaY}px)`;

      // Check if we should swap with a sibling
      const rect = drag.el.getBoundingClientRect();
      const prevSib = drag.el.previousElementSibling as HTMLElement | null;
      const nextSib = drag.el.nextElementSibling as HTMLElement | null;

      if (deltaY < -20 && prevSib) {
        const prevRect = prevSib.getBoundingClientRect();
        if (rect.top < prevRect.top + prevRect.height / 2) {
          drag.el.parentNode?.insertBefore(drag.el, prevSib);
          drag.startY -= prevRect.height;
          drag.el.style.transform = `translateY(${me.clientY - drag.startY}px)`;
          drag.swapsUp++;
        }
      } else if (deltaY > 20 && nextSib) {
        const nextRect = nextSib.getBoundingClientRect();
        if (rect.bottom > nextRect.top + nextRect.height / 2) {
          drag.el.parentNode?.insertBefore(drag.el, nextSib.nextSibling);
          drag.startY += nextRect.height;
          drag.el.style.transform = `translateY(${me.clientY - drag.startY}px)`;
          drag.swapsDown++;
        }
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      const drag = tableDragRef.current;
      if (drag) {
        drag.el.style.transition = "";
        drag.el.style.transform = "";
        drag.el.style.zIndex = "";
        drag.el.style.opacity = "";
        if (drag.swapsUp > 0 || drag.swapsDown > 0) {
          emitChange();
          setTableWidgetEditor((p) => p ? { ...p } : p);
          showToast("Table moved");
        }
      }
      tableDragRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [getWidgetEl, emitChange, showToast]);

  // Open editor panel when user clicks on a table widget in the document.
  useEffect(() => {
    const root = editorRootRef.current;
    if (!root) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!canEdit) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const widget = target.closest?.('[data-doc-table-widget="true"]') as HTMLElement | null;
      if (!widget) return;

      // Prevent the contentEditable from trying to place a cursor in the non-editable block.
      e.preventDefault();
      e.stopPropagation();

      const cur = tableWidgetEditorRef.current;
      const widgetId = widget.dataset.docTableWidgetId;
      if (cur && widgetId && cur.widgetId === widgetId) return; // Already editing this table.
      if (cur) closeTableWidgetEditor();
      openTableWidgetEditor(widget, 0, 0);
    };

    // Handle clicks between adjacent non-editable blocks (e.g. two tables):
    // If the user clicks directly on the contentEditable root (not inside any child block),
    // find the closest gap and insert/focus an editable paragraph there.
    const onClickGap = (e: MouseEvent) => {
      if (!canEdit) return;
      const target = e.target as HTMLElement | null;
      if (!target || target !== root) return; // Only handle clicks directly on the root
      const y = e.clientY;
      // Walk through top-level children and find two adjacent non-editable blocks surrounding the click Y
      const children = Array.from(root.children) as HTMLElement[];
      for (let i = 0; i < children.length - 1; i++) {
        const a = children[i];
        const b = children[i + 1];
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        if (y >= aRect.bottom && y <= bRect.top) {
          // Click is in the gap between child[i] and child[i+1]
          const aIsWidget = a.hasAttribute("data-doc-table-widget") || a.querySelector("[data-doc-table-widget]");
          const bIsWidget = b.hasAttribute("data-doc-table-widget") || b.querySelector("[data-doc-table-widget]");
          if (aIsWidget || bIsWidget) {
            // Insert an editable paragraph between them
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            root.insertBefore(p, b);
            // Focus it
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              const range = document.createRange();
              range.setStart(p, 0);
              range.collapse(true);
              sel.addRange(range);
            }
            emitChange();
            e.preventDefault();
            return;
          }
        }
      }
      // Also handle click below the last child
      if (children.length > 0) {
        const last = children[children.length - 1];
        const lastRect = last.getBoundingClientRect();
        if (y > lastRect.bottom) {
          const isWidget = last.hasAttribute("data-doc-table-widget") || last.querySelector("[data-doc-table-widget]");
          if (isWidget) {
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            root.appendChild(p);
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              const range = document.createRange();
              range.setStart(p, 0);
              range.collapse(true);
              sel.addRange(range);
            }
            emitChange();
            e.preventDefault();
          }
        }
      }
    };

    root.addEventListener("pointerdown", onPointerDown as any, true);
    root.addEventListener("click", onClickGap as any);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown as any, true);
      root.removeEventListener("click", onClickGap as any);
    };
  }, [canEdit, openTableWidgetEditor, closeTableWidgetEditor, commitTableWidget, emitChange]);




  const handleTemplateInsert = (tpl: DocTemplate) => {
    if (!canEdit) return;
    focusEditor();
    exec("insertHTML", tpl.html);
    emitChange();
  };

  const handleCommand = (command: string, commandValue?: string) => {
    if (!canEdit) return;
    focusEditor();
    exec(command, commandValue);
    emitChange();
  };

  const handleRename = () => {
    titleInputRef.current?.focus();
    titleInputRef.current?.select();
  };

  const handleTranslateDocument = useCallback(
    async (fromTag: string, toTag: string) => {
      const from = getPrimaryLanguageTag(fromTag);
      const to = getPrimaryLanguageTag(toTag);
      const text = getDocumentText();
      if (!text) {
        showToast("Nothing to translate");
        return;
      }
      if (from === to) {
        showToast("Already in that language");
        return;
      }

      // Note: Language selection in docs normally sets metadata/spellcheck/RTL.
      // This translation step is a best-effort client-side translation for convenience.
      // Protect against races when user changes languages quickly.
      const requestId = ++translateRequestIdRef.current;
      try {
        showToast("Translating… (may remove formatting)");
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            text,
            from,
            to,
            tenantId:
              tenantId ||
              (typeof window !== "undefined"
                ? localStorage.getItem("currentTenantId") || undefined
                : undefined),
            provider:
              typeof window !== "undefined"
                ? (() => {
                    const tid = tenantId || localStorage.getItem("currentTenantId") || "";
                    const key = `tenant_translation_provider:${tid || "educo-default"}`;
                    const v = localStorage.getItem(key);
                    return v === "deepl" || v === "google" || v === "google-cloud" ? v : undefined;
                  })()
                : undefined,
          }),
        });
        if (res.status === 403) {
          showToast("Translation disabled for this tenant");
          return;
        }
        const data = (await res.json()) as { translatedText?: string; error?: string };
        const translated = (data.translatedText || "").trim();
        if (!translated) {
          showToast("Translation failed");
          return;
        }
        // Only apply the latest translation result.
        if (translateRequestIdRef.current !== requestId) return;
        const nextHtml = plainTextToHtml(translated);
        htmlByLanguageRef.current.set(toTag, nextHtml);
        updateValue({ html: nextHtml, language: toTag });
        showToast("Translated");
      } catch {
        showToast("Translation failed (network)");
      }
    },
    [getDocumentText, showToast, updateValue]
  );

  const handleNewDoc = () => {
    // Clear the active sidebar tab's stored HTML
    setSidebarTabs((prev) => prev.map((t) =>
      t.id === activeTabId ? { ...t, html: "" } : t
    ));
    // Clear pages state + sync DOM directly
    const emptyPages = ["<p></p>"];
    pagesRef.current = emptyPages;
    setPages(emptyPages);
    setSectionInfos([{ pageCount: 1, pageSetup: defaultPageSetup }]);
    setActiveSectionIdx(0);
    lastSerializedHtmlRef.current = "";
    requestAnimationFrame(() => {
      const el = pageRefs.current[0];
      if (el) el.innerHTML = "<p></p>";
    });
    onChange({ title: "Untitled document", html: "", language: "en" });
    showToast("New document created");
  };

  const handleMakeCopy = () => {
    // Save copied document to localStorage, then open in a new browser tab
    const copyData = {
      title: `Copy of ${docTitle}`,
      html: value.html,
      language,
    };
    localStorage.setItem("educo_doc_pending_copy", JSON.stringify(copyData));
    window.open(`${window.location.pathname}?copy=true`, "_blank");
    showToast("Copy opened in new tab");
  };


  const handleOpenFile = () => {
    openFileInputRef.current?.click();
  };

  const handleOpenFileSelected = async (file: File) => {
    const text = await file.text();
    const name = file.name.toLowerCase();
    if (name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(text) as DocEditorValue;
        updateValue({
          title: parsed.title || docTitle,
          html: parsed.html || "",
          language: parsed.language || "en",
        });
        showToast("Opened JSON document");
        return;
      } catch {
        showToast("Invalid JSON file");
        return;
      }
    }
    if (name.endsWith(".md")) {
      updateValue({ html: markdownToHtml(text) });
      showToast("Opened Markdown");
      return;
    }
    if (name.endsWith(".txt")) {
      const escaped = text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\n", "<br/>");
      updateValue({ html: `<p>${escaped}</p>` });
      showToast("Opened text file");
      return;
    }
    updateValue({ html: text });
    showToast("Opened HTML");
  };

  const handleShareCopy = async (mode: "html" | "markdown" | "text" | "json") => {
    try {
      let payload = "";
      if (mode === "html") payload = value.html;
      if (mode === "markdown") payload = toMarkdown(value.html);
      if (mode === "text") payload = getDocumentText();
      if (mode === "json") payload = JSON.stringify({ ...value, title: docTitle }, null, 2);
      await navigator.clipboard.writeText(payload);
      showToast(`Copied as ${mode.toUpperCase()}`);
    } catch {
      showToast("Copy failed");
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(docTitle);
    const body = encodeURIComponent(getDocumentText());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  const handleDownload = (format: "docx" | "pdf" | "odt" | "txt" | "rtf" | "html" | "epub" | "md" | "json") => {
    const base = safeFilename(docTitle);
    if (format === "pdf") {
      void (async () => {
        let container: HTMLDivElement | null = null;
        try {
          showToast("Preparing PDF…");
          const { default: jsPDF } = await import("jspdf");

          const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
          const pageW = doc.internal.pageSize.getWidth();
          const margin = 40;

          container = document.createElement("div");
          container.style.position = "fixed";
          container.style.left = "-10000px";
          container.style.top = "0";
          container.style.width = `${Math.floor((pageW / 72) * 96)}px`; // A4 width in CSS px @96dpi
          container.style.background = "white";
          container.style.color = "black";
          container.style.padding = "0";
          container.style.fontFamily =
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
          container.style.fontSize = "12pt";
          container.style.lineHeight = "1.5";
          container.innerHTML = value.html || "<p>&nbsp;</p>";

          document.body.appendChild(container);

          await doc.html(container, {
            x: margin,
            y: margin,
            width: pageW - margin * 2,
            windowWidth: container.scrollWidth,
            autoPaging: "text",
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: "#ffffff",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: (d: any) => {
              try {
                const blob = d.output("blob") as Blob;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${base}.pdf`;
                a.rel = "noopener";
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                showToast("PDF downloaded");
              } catch {
                // Fallback: jsPDF's built-in save
                d.save(`${base}.pdf`);
                showToast("PDF downloaded");
              }
            },
          } as any);
        } catch {
          showToast("PDF export failed");
        } finally {
          container?.remove();
        }
      })();
      return;
    }
    if (format === "docx") {
      // Note: this is HTML-based (not a zipped OOXML .docx). Use .doc so Word opens it without warnings.
      const htmlDoc = `<!doctype html><html><head><meta charset="utf-8"/></head><body>${value.html}</body></html>`;
      downloadText(`${base}.doc`, htmlDoc, "application/msword;charset=utf-8");
      showToast("DOC downloaded (Word-compatible)");
      return;
    }
    if (format === "txt") {
      downloadText(`${base}.txt`, getDocumentText());
      showToast("TXT downloaded");
      return;
    }
    if (format === "md") {
      downloadText(`${base}.md`, toMarkdown(value.html));
      showToast("Markdown downloaded");
      return;
    }
    if (format === "json") {
      downloadText(`${base}.json`, JSON.stringify({ ...value, title: docTitle }, null, 2), "application/json;charset=utf-8");
      showToast("JSON downloaded");
      return;
    }
    if (format === "rtf") {
      const rtf = `{\\rtf1\\ansi\\deff0\\fs24\n${escapeRtf(getDocumentText())}\n}`;
      downloadText(`${base}.rtf`, rtf, "application/rtf;charset=utf-8");
      showToast("RTF downloaded");
      return;
    }
    const htmlDoc = `<!doctype html><html><head><meta charset="utf-8"/></head><body>${value.html}</body></html>`;
    downloadText(`${base}.${format}`, htmlDoc, "text/html;charset=utf-8");
    showToast(`${format.toUpperCase()} downloaded (HTML-based)`);
  };

  /** Remove all find/replace highlight marks and merge adjacent text nodes */
  const clearFindHighlights = () => {
    const root = rootRef.current;
    if (!root) return;
    const marks = root.querySelectorAll("mark[data-doc-find-highlight]");
    if (marks.length === 0) return;
    const hadReplaced = root.querySelector('mark[data-doc-find-highlight="replaced"]') !== null;
    const parents = new Set<Node>();
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parents.add(parent);
    });
    // Merge adjacent text nodes so future searches map positions correctly
    parents.forEach((p) => (p as Element).normalize?.());
    // If replace highlights were present, pages state may contain mark HTML — sync cleaned DOM back
    if (hadReplaced) flushDomToState();
  };

  // Clear highlights when user clicks outside the Find/Replace panel;
  // restore them when focus returns to the panel
  useEffect(() => {
    if (dialog !== "findReplace") return;
    const handleClickOutside = (e: MouseEvent) => {
      const panel = (rootRef.current?.parentElement ?? document).querySelector("[data-doc-find-replace-panel]");
      if (panel && !panel.contains(e.target as Node)) {
        clearFindHighlights();
      }
    };
    const handlePanelFocusIn = () => {
      // Restore highlight if there's an active find query and no current highlight
      const root = rootRef.current;
      if (findQuery && root && !root.querySelector("mark[data-doc-find-highlight]")) {
        lastFindIndexRef.current = 0;
        findNextAndHighlight(findQuery);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    const panel = (rootRef.current?.parentElement ?? document).querySelector("[data-doc-find-replace-panel]");
    panel?.addEventListener("focusin", handlePanelFocusIn);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      panel?.removeEventListener("focusin", handlePanelFocusIn);
    };
  }, [dialog, findQuery]);

  // When the Find/Replace panel opens with an existing query, restore highlights
  useEffect(() => {
    if (dialog === "findReplace" && findQuery) {
      lastFindIndexRef.current = 0;
      findNextAndHighlight(findQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  /** Walk all text nodes in editor pages; return them with a combined search string */
  const collectTextNodes = () => {
    const els = pageRefs.current
      .slice(0, pagesRef.current.length)
      .filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return { entries: [] as { node: Text; start: number }[], combined: "" };
    const entries: { node: Text; start: number }[] = [];
    let combined = "";
    for (const el of els) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let cur = walker.nextNode() as Text | null;
      while (cur) {
        entries.push({ node: cur, start: combined.length });
        combined += cur.data;
        cur = walker.nextNode() as Text | null;
      }
    }
    return { entries, combined };
  };

  /** Count total occurrences of query in the editor text */
  const countMatches = (query: string): number => {
    if (!query) return 0;
    const { combined } = collectTextNodes();
    const needle = query.toLowerCase();
    const haystack = combined.toLowerCase();
    let count = 0;
    let idx = 0;
    while ((idx = haystack.indexOf(needle, idx)) >= 0) { count++; idx += needle.length; }
    return count;
  };

  /** Find query text in editor and return a DOM Range for the match (or null) */
  const findRange = (query: string): Range | null => {
    if (!query) return null;
    const { entries, combined } = collectTextNodes();
    if (entries.length === 0) return null;
    const needle = query.toLowerCase();
    const haystack = combined.toLowerCase();
    // Search from last position; wrap around to 0 if not found
    let idx = haystack.indexOf(needle, lastFindIndexRef.current);
    if (idx < 0) idx = haystack.indexOf(needle, 0);
    if (idx < 0) return null;
    const endPos = idx + needle.length;
    // Map character positions to DOM text nodes
    let startNode: Text | null = null;
    let startOffset = 0;
    let endNode: Text | null = null;
    let endOffset = 0;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const nodeEnd = entry.start + entry.node.data.length;
      if (!startNode && idx >= entry.start && idx < nodeEnd) {
        startNode = entry.node;
        startOffset = idx - entry.start;
      }
      if (endPos > entry.start && endPos <= nodeEnd) {
        endNode = entry.node;
        endOffset = endPos - entry.start;
        break;
      }
    }
    if (!startNode || !endNode) return null;
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    lastFindIndexRef.current = endPos;
    return range;
  };

  /** Find query text in editor and select it. Returns true if found. */
  const findAndSelect = (query: string) => {
    const range = findRange(query);
    if (!range) return false;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    return true;
  };

  /** Find next match, highlight it with a yellow <mark>, scroll into view */
  const findNextAndHighlight = (query: string): boolean => {
    clearFindHighlights();
    if (!query) { setFindMatchCount(null); return false; }
    // Count total matches before any DOM modification
    const total = countMatches(query);
    if (total === 0) { setFindMatchCount({ current: 0, total: 0 }); return false; }
    // Get the range directly (don't rely on browser selection which is lost on button click)
    const range = findRange(query);
    if (!range) { setFindMatchCount({ current: 0, total }); return false; }
    // Calculate which match we're on
    const foundAt = lastFindIndexRef.current - query.length;
    const { combined } = collectTextNodes();
    const needle = query.toLowerCase();
    const hay = combined.toLowerCase();
    let current = 0;
    let searchFrom = 0;
    while (searchFrom <= foundAt) {
      const pos = hay.indexOf(needle, searchFrom);
      if (pos < 0 || pos > foundAt) break;
      current++;
      searchFrom = pos + needle.length;
    }
    // Wrap the matched text in a yellow highlight mark using direct text node splitting
    const startContainer = range.startContainer;
    const startOff = range.startOffset;
    const endContainer = range.endContainer;
    const endOff = range.endOffset;
    try {
      const mark = document.createElement("mark");
      mark.setAttribute("data-doc-find-highlight", "current");
      mark.style.cssText = "background:#fde047;border-radius:2px;padding:0 1px;color:inherit;";
      if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text;
        if (endOff < textNode.data.length) textNode.splitText(endOff);
        const matchNode = textNode.splitText(startOff);
        matchNode.parentNode!.insertBefore(mark, matchNode);
        mark.appendChild(matchNode);
      } else {
        const contents = range.extractContents();
        mark.appendChild(contents);
        range.insertNode(mark);
      }
      mark.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[DocEditor findNextAndHighlight] failed to insert mark:", err);
    }
    setFindMatchCount({ current: Math.max(1, current), total });
    return true;
  };

  /** Replace current match (or find first), highlight replacement in green */
  const replaceAndHighlight = (query: string, replacement: string): boolean => {
    clearFindHighlights();
    if (!query) return false;
    // If current selection doesn't match the query, find first
    const sel = window.getSelection();
    const selText = sel?.toString() || "";
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed || selText.toLowerCase() !== query.toLowerCase()) {
      const ok = findAndSelect(query);
      if (!ok) return false;
    }
    exec("insertText", replacement);
    emitChange();
    // Highlight the replaced text in green
    if (replacement.length > 0) {
      const currentSel = window.getSelection();
      if (currentSel && currentSel.focusNode && currentSel.focusNode.nodeType === Node.TEXT_NODE) {
        try {
          const textNode = currentSel.focusNode as Text;
          const focusOffset = currentSel.focusOffset;
          const startOff = Math.max(0, focusOffset - replacement.length);
          // Split text node to isolate the replacement text
          if (focusOffset < textNode.data.length) textNode.splitText(focusOffset);
          const matchNode = textNode.splitText(startOff);
          const mark = document.createElement("mark");
          mark.setAttribute("data-doc-find-highlight", "replaced");
          mark.style.cssText = "background:#86efac;border-radius:2px;padding:0 1px;color:inherit;";
          matchNode.parentNode!.insertBefore(mark, matchNode);
          mark.appendChild(matchNode);
          mark.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        } catch {}
      }
    }
    return true;
  };

  /** Replace all matches; highlight each replacement in green */
  const replaceAllAndHighlight = (query: string, replacement: string): number => {
    clearFindHighlights();
    if (!query) return 0;
    lastFindIndexRef.current = 0;
    let count = 0;
    for (let i = 0; i < 500; i++) {
      const ok = findAndSelect(query);
      if (!ok) break;
      exec("insertText", replacement);
      count++;
      // Highlight each replacement in green
      if (replacement.length > 0) {
        const currentSel = window.getSelection();
        if (currentSel && currentSel.focusNode && currentSel.focusNode.nodeType === Node.TEXT_NODE) {
          try {
            const textNode = currentSel.focusNode as Text;
            const focusOffset = currentSel.focusOffset;
            const startOff = Math.max(0, focusOffset - replacement.length);
            if (focusOffset < textNode.data.length) textNode.splitText(focusOffset);
            const matchNode = textNode.splitText(startOff);
            const mark = document.createElement("mark");
            mark.setAttribute("data-doc-find-highlight", "replaced");
            mark.style.cssText = "background:#86efac;border-radius:2px;padding:0 1px;color:inherit;";
            matchNode.parentNode!.insertBefore(mark, matchNode);
            mark.appendChild(matchNode);
          } catch {}
        }
      }
    }
    emitChange();
    setFindMatchCount(null);
    return count;
  };

  const handlePaste = async (plainOnly: boolean) => {
    if (!canEdit) return;
    focusEditor();
    try {
      if (plainOnly) {
        // Paste as plain text only
        const text = await navigator.clipboard.readText();
        if (!text) throw new Error("Empty clipboard");
        exec("insertText", text);
      } else {
        // Try to paste with formatting (HTML) first
        const items = await navigator.clipboard.read();
        let pasted = false;
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            const html = await blob.text();
            if (html) {
              exec("insertHTML", html);
              pasted = true;
              break;
            }
          }
        }
        if (!pasted) {
          // Fallback to plain text
          const text = await navigator.clipboard.readText();
          if (!text) throw new Error("Empty clipboard");
          exec("insertText", text);
        }
      }
      emitChange();
      showToast(plainOnly ? "Pasted without formatting" : "Pasted");
    } catch {
      showToast("Paste not allowed by browser. Use Ctrl+V.");
    }
  };

  const insertChip = (label: string, valueText: string) => {
    if (!canEdit) return;
    focusEditor();
    exec(
      "insertHTML",
      `<span contenteditable="false" style="display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;background:#eef2ff;border:1px solid #c7d2fe;color:#1e40af;font-size:12px;margin:0 2px;">${label}: ${valueText}</span>&nbsp;`
    );
    emitChange();
  };

  const insertSvg = (svg: string) => {
    if (!canEdit) return;
    focusEditor();
    exec("insertHTML", `<div style="margin:12px 0;">${svg}</div>`);
    emitChange();
  };

  const insertBookmark = () => {
    const name = window.prompt("Bookmark name (letters/numbers/-) e.g. intro");
    if (!name) return;
    const id = name.trim().replaceAll(/\s+/g, "-").replaceAll(/[^a-zA-Z0-9-_]/g, "");
    if (!id) return;
    focusEditor();
    exec(
      "insertHTML",
      `<a id="${id}"></a><span style="padding:2px 8px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;font-size:12px;color:#374151;">🔖 ${id}</span>&nbsp;`
    );
    emitChange();
    showToast("Bookmark inserted");
  };

  const insertTOC = () => {
    const root = editorRootRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll("h2, h3")) as HTMLElement[];
    if (headings.length === 0) {
      showToast("No headings found");
      return;
    }
    const items = headings
      .map((h, idx) => {
        if (!h.id) h.id = `heading-${idx + 1}`;
        const indent = h.tagName.toLowerCase() === "h3" ? "margin-left:12px;" : "";
        return `<div style="${indent}"><a href="#${h.id}" style="color:#2563eb;text-decoration:underline;">${h.innerText}</a></div>`;
      })
      .join("");
    focusEditor();
    exec(
      "insertHTML",
      `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fafafa;margin:12px 0;"><strong>Table of contents</strong>${items}</div>`
    );
    emitChange();
  };

  const handleInsertHorizontalLine = () => {
    if (!canEdit) return;
    focusEditor();
    exec("insertHTML", `<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />`);
    emitChange();
  };

  const handleInsertPageBreak = () => {
    if (!canEdit) return;
    focusEditor();
    exec(
      "insertHTML",
      `<div style="page-break-after:always;border-top:1px dashed #e5e7eb;margin:24px 0;"></div>`
    );
    emitChange();
  };

  const handleInsertTable = (rows: number, cols: number) => {
    if (!canEdit) return;
    const id = `tblw_${Math.random().toString(36).slice(2, 9)}`;
    const model = createTableWidgetModel(rows, cols);
    // Default width = full page content width (account for 1px border each side)
    const contentW = pageWidthPx - marginLeftPx - marginRightPx - 2;
    const colW = Math.max(40, Math.floor(contentW / cols));
    model.colWidthsPx = Array.from({ length: cols }, () => colW);
    const style = getTableContainerStyle(model, maxContentWidth);
    const html = `<div contenteditable="false" data-doc-table-widget="true" data-doc-table-widget-id="${id}" data-doc-table-widget-model="${encodeTableWidgetModel(model)}" style="${style}">${renderTableWidgetHtml(model)}</div>`.trim();
    focusEditor();
    exec("insertHTML", html);

    // Ensure there are editable paragraphs before and after the table so the user
    // can always place the cursor above/below and move the table via drag/reorder.
    requestAnimationFrame(() => {
      const root = editorRootRef.current;
      if (!root) return;
      const widget = root.querySelector(`[data-doc-table-widget-id="${id}"]`) as HTMLElement | null;
      if (!widget) return;
      // Walk up to the top-level block (the table might be wrapped in a <p> by the browser)
      const container = widget.closest('[contenteditable="true"]') as HTMLElement | null;
      if (!container) return;
      let block: HTMLElement = widget;
      while (block.parentElement && block.parentElement !== container) {
        block = block.parentElement as HTMLElement;
      }
      // Add empty paragraph before the table if it's the first child
      if (!block.previousElementSibling) {
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        container.insertBefore(p, block);
      }
      // Add empty paragraph after the table if it's the last child
      if (!block.nextElementSibling) {
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        container.appendChild(p);
      }
      emitChange();

      // Open the editor panel for the just-inserted table.
      requestAnimationFrame(() => {
        const w = root.querySelector(`[data-doc-table-widget-id="${id}"]`) as HTMLElement | null;
        if (w) openTableWidgetEditor(w, 0, 0);
      });
    });
  };

  // Insert an image into the editor via direct DOM insertion + state sync.
  const insertImageElement = useCallback((src: string, alt: string) => {
    // Restore cursor position so we can insert at the right place
    restoreEditorSelection();

    // Determine the target page: prefer the page containing the cursor, else page 0
    const sel = window.getSelection();
    let targetPage: HTMLElement | null = null;
    let insertRange: Range | null = null;
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Walk up to find the contentEditable page element
      let node: Node | null = range.commonAncestorContainer;
      while (node && node !== editorRootRef.current) {
        if (node instanceof HTMLElement && node.contentEditable === "true" && node.hasAttribute("data-placeholder")) {
          targetPage = node;
          insertRange = range;
          break;
        }
        node = node.parentNode;
      }
    }
    if (!targetPage) targetPage = pageRefs.current[0];
    if (!targetPage) return;

    // Create image element via DOM API so src is set properly
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.dataset.docImage = "true";
    // Constrain to page width, maintain aspect ratio
    img.style.maxWidth = "100%";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.borderRadius = "12px";
    img.style.margin = "12px auto";
    img.style.display = "block";
    img.style.objectFit = "contain";

    // Wrap in a <p> so it's a proper block-level child
    const wrapper = document.createElement("p");
    wrapper.style.maxWidth = "100%";
    wrapper.appendChild(img);

    // Insert at cursor position if available, otherwise append to page
    if (insertRange) {
      insertRange.collapse(false);
      insertRange.insertNode(wrapper);
      // Move cursor after the inserted image
      insertRange.setStartAfter(wrapper);
      insertRange.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(insertRange);
    } else {
      targetPage.appendChild(wrapper);
    }

    // Sync DOM → state after the image loads (ensures correct layout)
    img.onload = () => emitChange();
    // Remove the image if the browser can't render it
    img.onerror = () => {
      wrapper.remove();
      emitChange();
    };
    // Also sync immediately for instant feedback
    emitChange();
  }, [emitChange, restoreEditorSelection]);

  const handleInsertImageFromFile = async (file: File) => {
    if (!canEdit) return;
    // MIME type + extension validation (security)
    const validation = isValidImageFile(file);
    if (!validation.valid) {
      showToast(validation.reason || "Unsupported image format");
      return;
    }

    setImageLoading(true);
    try {
      const dataUrl = await convertImageToWebSafe(file);
      insertImageElement(dataUrl, file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to upload ${file.name}`;
      showToast(msg);
    } finally {
      setImageLoading(false);
    }
  };

  const handleInsertImageFromUrl = (url: string) => {
    if (!canEdit || !url.trim()) return;
    setImageLoading(true);
    // Validate URL format
    try { new URL(url); } catch {
      setImageUrlError("Please enter a valid URL");
      setImageLoading(false);
      return;
    }
    // Pre-validate the URL by loading it in an Image object
    const probe = new Image();
    probe.onload = () => {
      // URL is valid — insert via direct DOM insertion
      insertImageElement(url.trim(), "");
      setImageLoading(false);
      setShowImageUrlModal(false);
      setImageUrlInput("");
      setImageUrlError("");
    };
    probe.onerror = () => {
      setImageLoading(false);
      setImageUrlError("Failed to load image from this URL");
    };
    probe.src = url.trim();
  };

  // Helper: get image overlay position relative to the content area container,
  // accounting for scroll offset within the page surface.
  const getImageOverlayPos = useCallback((imgRect: DOMRect) => {
    const container = contentAreaRef.current;
    if (!container) return { top: 0, left: 0, width: imgRect.width, height: imgRect.height };
    const containerRect = container.getBoundingClientRect();
    const scrollEl = scrollContainerRef.current;
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const scrollLeft = scrollEl ? scrollEl.scrollLeft : 0;
    return {
      top: imgRect.top - containerRect.top + scrollTop,
      left: imgRect.left - containerRect.left + scrollLeft,
      width: imgRect.width,
      height: imgRect.height,
    };
  }, []);

  // Helper: remove crop from an image, restoring original src and dimensions
  const removeCrop = useCallback((img: HTMLImageElement) => {
    // Canvas-based crop stores original src in data-original-src
    if (img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
      delete img.dataset.originalSrc;
    }
    // Restore pre-crop dimensions
    img.style.width = img.dataset.preCropWidth || "auto";
    img.style.height = img.dataset.preCropHeight || "auto";
    img.style.maxWidth = "100%";
    img.style.display = "block";
    delete img.dataset.preCropWidth;
    delete img.dataset.preCropHeight;
    delete img.dataset.cropTop;
    delete img.dataset.cropLeft;
    delete img.dataset.cropWidth;
    delete img.dataset.cropHeight;
    // Also remove legacy crop wrapper if present (from old approach)
    const wrapper = img.closest("[data-doc-image-crop]") as HTMLElement | null;
    if (wrapper) {
      wrapper.parentNode?.insertBefore(img, wrapper);
      wrapper.remove();
      img.style.marginTop = "";
      img.style.marginLeft = "";
    }
  }, []);

  // Click handler to detect image selection in contentEditable
  const handleEditorImageClick = useCallback((e: MouseEvent) => {
    // Skip deselection if a resize or crop drag just finished
    if (isImageDraggingRef.current) {
      isImageDraggingRef.current = false;
      return;
    }
    const target = e.target as HTMLElement;
    // Don't deselect when clicking on any image editing UI element
    if (target.closest("[data-doc-image-toolbar]") || target.closest("[data-doc-resize-handle]") || target.closest("[data-doc-image-options-panel]") || target.closest("[data-doc-crop-handle]") || target.closest("[data-doc-crop-overlay]") || target.closest("[data-doc-crop-mask]") || target.closest("[data-doc-crop-grid]") || target.closest("[data-doc-crop-marker]") || target.closest("[data-doc-crop-buttons]")) {
      return;
    }
    if (target.tagName === "IMG" && (target as HTMLImageElement).dataset.docImage) {
      e.preventDefault();
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      setSelectedImageRect(img.getBoundingClientRect());
      // Read current rotation from the element's transform style
      const rotMatch = img.style.transform?.match(/rotate\((\d+)deg\)/);
      setImageRotation(rotMatch ? Number(rotMatch[1]) : 0);
      // Read current opacity/brightness/contrast from element styles
      const parsedOpacity = img.style.opacity ? Math.round(parseFloat(img.style.opacity) * 100) : 100;
      let parsedBrightness = 100;
      let parsedContrast = 100;
      const filterStr = img.style.filter || "";
      const brightMatch = filterStr.match(/brightness\(([\d.]+)\)/);
      if (brightMatch) parsedBrightness = Math.round(parseFloat(brightMatch[1]) * 100);
      const contrastMatch = filterStr.match(/contrast\(([\d.]+)\)/);
      if (contrastMatch) parsedContrast = Math.round(parseFloat(contrastMatch[1]) * 100);
      setImageOptions({ opacity: parsedOpacity, brightness: parsedBrightness, contrast: parsedContrast });
      setShowCropOverlay(false);
    } else {
      setSelectedImage(null);
      setSelectedImageRect(null);
      setShowImageOptions(false);
      setShowCropOverlay(false);
    }
  }, []);

  // Attach image click listener to root element (delegates to all pages)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.addEventListener("click", handleEditorImageClick);
    return () => root.removeEventListener("click", handleEditorImageClick);
  }, [handleEditorImageClick]);


  // Update selected image rect on scroll/resize so selection border follows the image
  useEffect(() => {
    if (!selectedImage) return;
    const update = () => {
      setSelectedImageRect(selectedImage.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    // Also listen on the scroll container directly for inner scrolling
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", update);
    }
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", update);
      }
    };
  }, [selectedImage]);

  // Drag and drop images onto editor
  const handleEditorDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleEditorDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragActive(true);
    }
  }, []);

  const handleEditorDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleEditorDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragActive(false);
    const allFiles = Array.from(e.dataTransfer.files);
    if (allFiles.length === 0) return;

    // Separate valid images from unsupported files
    const imageFiles: File[] = [];
    const rejected: string[] = [];
    for (const file of allFiles) {
      const ext = getFileExtension(file.name);
      const mime = file.type.toLowerCase();
      if (mime.startsWith("image/") || IMAGE_VALID_EXTENSIONS.has(ext)) {
        const check = isValidImageFile(file);
        if (check.valid) {
          imageFiles.push(file);
        } else {
          rejected.push(check.reason || file.name);
        }
      } else {
        rejected.push(`"${file.name}" is not a supported image. Accepted: ${IMAGE_FORMAT_LIST}`);
      }
    }

    // Show toast for unsupported files
    if (rejected.length > 0) {
      showToast(rejected[0]);
    }

    // Insert valid images using the full upload flow (ghost preview + validation + conversion)
    for (const file of imageFiles) {
      await handleInsertImageFromFile(file);
    }
  }, [handleInsertImageFromFile, showToast]);

  return (
    <MenuCloseContext.Provider value={closeMenus}>
    <SubmenuCloseContext.Provider value={() => setOpenSubmenu(null)}>
      <div
        ref={rootRef}
        data-doc-editor-root
        className={[
          isFullscreen ? "fixed inset-0 z-[200] shadow-2xl" : "relative",
          isFullscreen
            ? "flex flex-col w-full h-full rounded-none border-0"
            : "flex flex-col w-full h-full rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20",
          "bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035]",
          // Important: keep overflow visible so dropdown submenus can render outside the panel.
          "shadow-sm",
          className,
        ].join(" ")}
      >
      {/* Fullscreen floating haptic-style pill menu — appears when cursor nears top */}
      {isFullscreen && <FullscreenFloatingPill onExitFullscreen={() => setIsFullscreen(false)} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}

      {/* ── Table Editor Panel (React-controlled, renders outside contentEditable) ── */}
      {tableWidgetEditor && tablePanelPos && (
        <div
          ref={tablePanelElRef}
          data-doc-table-editor-panel
          className="fixed z-[280] bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl shadow-2xl"
          style={{
            left: tablePanelPos.left,
            top: tablePanelPos.top,
            width: tablePanelPos.width,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Panel toolbar */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/80 dark:bg-gray-800/50 midnight:bg-[#111827]/60 purple:bg-[#2a1447]/60 flex-wrap">
            {/* Drag handle to reorder table */}
            <Tooltip content="Drag to reorder table" delay={400}>
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing"
                onMouseDown={handleTableDragStart}
              >
                <GripVertical size={14} />
              </button>
            </Tooltip>
            {/* Move table up/down */}
            <Tooltip content="Move table up" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer" onClick={moveTableUp}>
                <MoveUp size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Move table down" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer" onClick={moveTableDown}>
                <MoveDown size={14} />
              </button>
            </Tooltip>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Insert row/column */}
            <Tooltip content="Insert row above" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetRow("above")}>
                <Plus size={12} /><ArrowUp size={10} />
              </button>
            </Tooltip>
            <Tooltip content="Insert row below" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetRow("below")}>
                <Plus size={12} /><ArrowDown size={10} />
              </button>
            </Tooltip>
            <Tooltip content="Insert column left" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetCol("left")}>
                <Plus size={12} /><ArrowLeft size={10} />
              </button>
            </Tooltip>
            <Tooltip content="Insert column right" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetCol("right")}>
                <Plus size={12} /><ArrowRight size={10} />
              </button>
            </Tooltip>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Delete row/column */}
            <Tooltip content="Delete row" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer flex items-center gap-0.5 text-[10px]" onClick={deleteWidgetRow}>
                <Minus size={12} /><span>Row</span>
              </button>
            </Tooltip>
            <Tooltip content="Delete column" delay={400}>
              <button type="button" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer flex items-center gap-0.5 text-[10px]" onClick={deleteWidgetCol}>
                <Minus size={12} /><span>Col</span>
              </button>
            </Tooltip>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Header toggles */}
            <Tooltip content="Toggle header row" delay={400}>
              <button
                type="button"
                className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                  tableWidgetEditor.model.headerRow
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                onClick={toggleWidgetHeaderRow}
              >
                H-Row
              </button>
            </Tooltip>
            <Tooltip content="Toggle header column" delay={400}>
              <button
                type="button"
                className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                  tableWidgetEditor.model.headerCol
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
              onClick={toggleWidgetHeaderCol}
            >
              H-Col
              </button>
            </Tooltip>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Text formatting popover */}
            <div className="relative">
              <Tooltip content="Text formatting" delay={400}>
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer flex items-center gap-0.5 text-[10px]"
                onClick={() => { setTableTextPopover(!tableTextPopover); setTableBorderPopover(false); setTableCellBgPopover(false); }}
              >
                <Type size={14} />
                <ChevronDown size={10} />
                </button>
              </Tooltip>
              {tableTextPopover && (() => {
                // Resolve effective text format based on scope
                const ac = tableWidgetEditor.activeCell;
                const activeCell = tableWidgetEditor.model.rows[ac.r]?.[ac.c];
                const isHeader = (tableWidgetEditor.model.headerRow && ac.r === 0) || (tableWidgetEditor.model.headerCol && ac.c === 0);
                const getEffective = (): TableCellTextFormat => {
                  if (textFmtScope === "header") return tableWidgetEditor.model.headerTextFmt ?? {};
                  if (textFmtScope === "all") return tableWidgetEditor.model.bodyTextFmt ?? {};
                  const cellFmt = activeCell?.textFmt ?? {};
                  const baseFmt = isHeader ? (tableWidgetEditor.model.headerTextFmt ?? {}) : (tableWidgetEditor.model.bodyTextFmt ?? {});
                  return { ...baseFmt, ...Object.fromEntries(Object.entries(cellFmt).filter(([, v]) => v !== undefined)) };
                };
                const eff = getEffective();
                const effFont = (eff.fontFamily ?? "Inter") as FontFamily;
                const effSize = eff.fontSizePx ?? 13;
                const effBold = eff.bold ?? false;
                const effItalic = eff.italic ?? false;
                const effUnderline = eff.underline ?? false;
                const effAlign = eff.textAlign ?? "left";
                const effColor = eff.color ?? "#1f2937";
                return (
                <div
                  className="absolute top-full right-0 mt-2 w-[290px] bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-2xl z-[300] backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 space-y-3">
                    {/* Scope toggle */}
                    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
                      <button type="button" className={`flex-1 py-1.5 text-[10px] font-medium rounded-md cursor-pointer transition-all ${textFmtScope === "cell" ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`} onClick={() => setTextFmtScope("cell")}>This cell</button>
                      <button type="button" className={`flex-1 py-1.5 text-[10px] font-medium rounded-md cursor-pointer transition-all ${textFmtScope === "all" ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`} onClick={() => setTextFmtScope("all")}>All cells</button>
                      <button type="button" className={`flex-1 py-1.5 text-[10px] font-medium rounded-md cursor-pointer transition-all ${textFmtScope === "header" ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`} onClick={() => setTextFmtScope("header")}>Headers</button>
                    </div>

                    {/* Font family — categorized scrollable list */}
                    <div>
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Font</div>
                      <div className="max-h-[200px] overflow-y-auto scrollbar-thin space-y-2 pr-1">
                        {FONT_FAMILY_CATEGORIES.map((cat) => (
                          <div key={cat.label}>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 sticky top-0 bg-white dark:bg-gray-900 py-0.5">{cat.label}</div>
                            <div className="grid grid-cols-3 gap-1">
                              {cat.fonts.map((f) => (
                                <button
                                  key={f}
                                  type="button"
                                  className={`px-2 py-1.5 text-[10px] rounded-lg border cursor-pointer transition-all truncate ${
                                    effFont === f
                                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  }`}
                                  style={{ fontFamily: `${f}, system-ui, sans-serif` }}
                                  onClick={() => setWidgetTextFmt({ fontFamily: f })}
                                  title={f}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Font size — presets + custom input */}
                    <div>
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Size</div>
                      <div className="flex items-center gap-1.5">
                        <button type="button" className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => { const idx = FONT_SIZES.findIndex((s) => s >= effSize); setWidgetTextFmt({ fontSizePx: idx > 0 ? FONT_SIZES[idx - 1] : FONT_SIZES[0] }); }}
                        ><Minus size={12} /></button>
                        <div className="flex gap-1 flex-wrap flex-1 justify-center">
                          {[8, 10, 12, 14, 18, 24, 30, 36, 48].map((s) => (
                            <button key={s} type="button"
                              className={`min-w-[26px] py-1 text-[10px] font-medium rounded-md border cursor-pointer transition-all ${effSize === s ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
                              onClick={() => setWidgetTextFmt({ fontSizePx: s })}
                            >{s}</button>
                          ))}
                        </div>
                        <button type="button" className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => { const idx = FONT_SIZES.findIndex((s) => s > effSize); setWidgetTextFmt({ fontSizePx: idx >= 0 ? FONT_SIZES[idx] : FONT_SIZES[FONT_SIZES.length - 1] }); }}
                        ><Plus size={12} /></button>
                      </div>
                      {/* Custom size input */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Custom:</span>
                        <input
                          type="number"
                          min={6}
                          max={120}
                          value={effSize}
                          onChange={(e) => { const v = parseInt(e.target.value); if (v >= 6 && v <= 120) setWidgetTextFmt({ fontSizePx: v }); }}
                          className="w-[56px] px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400"
                        />
                        <span className="text-[10px] text-gray-400">px</span>
                      </div>
                    </div>

                    {/* B / I / U + Alignment */}
                    <div className="flex items-center gap-1 pt-1 border-t border-gray-100 dark:border-gray-700/50">
                      <Tooltip content="Bold" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effBold ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ bold: !effBold })}><Bold size={13} /></button></Tooltip>
                      <Tooltip content="Italic" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effItalic ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ italic: !effItalic })}><Italic size={13} /></button></Tooltip>
                      <Tooltip content="Underline" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effUnderline ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ underline: !effUnderline })}><Underline size={13} /></button></Tooltip>
                      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
                      <Tooltip content="Align left" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "left" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "left" })}><AlignLeft size={13} /></button></Tooltip>
                      <Tooltip content="Align center" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "center" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "center" })}><AlignCenter size={13} /></button></Tooltip>
                      <Tooltip content="Align right" delay={400}><button type="button" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "right" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "right" })}><AlignRight size={13} /></button></Tooltip>
                    </div>

                    {/* Font color — tabbed: Solid / Gradient / Glossy */}
                    <div className="pt-1 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Color</div>
                      <TabbedColorPalette
                        solidColors={TEXT_COLORS_MATRIX.flat()}
                        gradientColors={TEXT_GRADIENT_COLORS}
                        glossyColors={GLOSSY_COLORS}
                        selectedColor={effColor}
                        onSelect={(c) => setWidgetTextFmt({ color: c })}
                        columns={10}
                        showCustomHex
                      />
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Border settings */}
            <div className="relative">
              <Tooltip content="Border settings" delay={400}><button
                type="button"
                className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer flex items-center gap-0.5 text-[10px]"
                onClick={() => { setTableBorderPopover(!tableBorderPopover); setTableCellBgPopover(false); setTableTextPopover(false); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
                <ChevronDown size={10} />
              </button></Tooltip>
              {tableBorderPopover && (() => {
                // Resolve effective border values based on scope
                const ac = tableWidgetEditor.activeCell;
                const activeCell = tableWidgetEditor.model.rows[ac.r]?.[ac.c];
                const effectiveBorderWidth = borderScope === "cell" && activeCell?.border?.widthPx != null ? activeCell.border.widthPx : tableWidgetEditor.model.border.widthPx;
                const effectiveBorderStyle = borderScope === "cell" && activeCell?.border?.style != null ? activeCell.border.style : tableWidgetEditor.model.border.style;
                const effectiveBorderColor = borderScope === "cell" && activeCell?.border?.color != null ? activeCell.border.color : tableWidgetEditor.model.border.color;
                return (
                <div
                  className="absolute top-full right-0 mt-2 w-[280px] bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-2xl z-[300] backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 space-y-4">
                    {/* Scope toggle */}
                    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                          borderScope === "cell"
                            ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setBorderScope("cell")}
                      >
                        This cell
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                          borderScope === "all"
                            ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setBorderScope("all")}
                      >
                        All cells
                      </button>
                    </div>
                    {/* Width */}
                    <div>
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">Width</div>
                      <div className="flex gap-1.5">
                        {[0.5, 1, 1.5, 2, 3].map((w) => (
                          <button
                            key={w}
                            type="button"
                            className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg border cursor-pointer transition-all ${
                              effectiveBorderWidth === w
                                ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                            onClick={() => setWidgetBorder({ widthPx: w })}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Style */}
                    <div>
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">Style</div>
                      <div className="flex gap-1.5">
                        {(["solid", "dashed", "dotted"] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg border cursor-pointer capitalize transition-all ${
                              effectiveBorderStyle === s
                                ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                            onClick={() => setWidgetBorder({ style: s })}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Color */}
                    <div>
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">Color</div>
                      <ColorGrid
                        colors={BORDER_COLORS}
                        selectedColor={effectiveBorderColor}
                        onSelect={(c) => setWidgetBorder({ color: c })}
                        columns={8}
                        swatchSize="md"
                        showCustomHex
                      />
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            {/* Cell background color */}
            <div className="relative">
              <Tooltip content="Cell background color" delay={400}><button
                type="button"
                className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-0.5"
                onClick={() => { setTableCellBgPopover(!tableCellBgPopover); setTableBorderPopover(false); setTableTextPopover(false); }}
              >
                <div
                  className="w-4 h-3 rounded-sm border border-gray-300 dark:border-gray-600"
                  style={{ background: (() => {
                    const ac = tableWidgetEditor.activeCell;
                    const cell = tableWidgetEditor.model.rows[ac.r]?.[ac.c];
                    const cellBg = cell?.bg && cell.bg !== "transparent" ? cell.bg : null;
                    const tableBg = tableWidgetEditor.model.cellBg && tableWidgetEditor.model.cellBg !== "transparent" ? tableWidgetEditor.model.cellBg : null;
                    return cellBg || tableBg || "#ffffff";
                  })() }}
                />
                <ChevronDown size={10} className="text-gray-400" />
              </button></Tooltip>
              {tableCellBgPopover && (() => {
                // Resolve effective bg value based on scope
                const ac = tableWidgetEditor.activeCell;
                const activeCell = tableWidgetEditor.model.rows[ac.r]?.[ac.c];
                const effectiveCellBg = bgScope === "cell" && activeCell?.bg != null ? activeCell.bg : (tableWidgetEditor.model.cellBg || "transparent");
                const isNoFill = !effectiveCellBg || effectiveCellBg === "transparent";
                return (
                <div
                  className="absolute top-full right-0 mt-2 w-[280px] bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-2xl z-[300] backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 space-y-3">
                    {/* Scope toggle */}
                    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                          bgScope === "cell"
                            ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setBgScope("cell")}
                      >
                        This cell
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-1.5 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                          bgScope === "all"
                            ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                        onClick={() => setBgScope("all")}
                      >
                        All cells
                      </button>
                    </div>
                    <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Background</div>
                    <ColorGrid
                      colors={CELL_BG_COLORS}
                      selectedColor={effectiveCellBg}
                      onSelect={(c) => setWidgetCellBg(c)}
                      columns={8}
                      swatchSize="md"
                      allowNoFill
                      noFillSelected={isNoFill}
                      onNoFill={() => setWidgetCellBg("transparent")}
                      showCustomHex
                    />
                  </div>
                </div>
                );
              })()}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Table width control */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">W</span>
              <Tooltip content="Decrease table width" delay={400}><button type="button" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const cols = m.rows[0]?.length ?? 1;
                    const totalW = m.colWidthsPx ? m.colWidthsPx.reduce((a, b) => a + b, 0) : cols * 120;
                    const newTotal = Math.max(cols * 40, totalW - 40);
                    const evenW = Math.max(40, Math.floor(newTotal / cols));
                    return { ...m, colWidthsPx: Array.from({ length: cols }, () => evenW) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Minus size={10} /></button></Tooltip>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 min-w-[32px] text-center">
                {tableWidgetEditor.model.colWidthsPx ? tableWidgetEditor.model.colWidthsPx.reduce((a, b) => a + b, 0) : "—"}
              </span>
              <Tooltip content="Increase table width" delay={400}><button type="button" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const cols = m.rows[0]?.length ?? 1;
                    const totalW = m.colWidthsPx ? m.colWidthsPx.reduce((a, b) => a + b, 0) : cols * 120;
                    // Subtract 2 for the 1px border on each side of the page wrapper (border-box)
                    const maxW = pageWidthPx - marginLeftPx - marginRightPx - 2;
                    const newTotal = Math.min(maxW, totalW + 40);
                    const evenW = Math.max(40, Math.floor(newTotal / cols));
                    return { ...m, colWidthsPx: Array.from({ length: cols }, () => evenW) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Plus size={10} /></button></Tooltip>
            </div>

            {/* Table row height control */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">H</span>
              <Tooltip content="Decrease row heights" delay={400}><button type="button" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const rows = m.rows.length;
                    const curH = m.rowHeightsPx?.[0] ?? 40;
                    const newH = Math.max(24, curH - 8);
                    return { ...m, rowHeightsPx: Array.from({ length: rows }, () => newH) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Minus size={10} /></button></Tooltip>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 min-w-[24px] text-center">
                {tableWidgetEditor.model.rowHeightsPx?.[0] ?? 40}
              </span>
              <Tooltip content="Increase row heights" delay={400}><button type="button" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const rows = m.rows.length;
                    const curH = m.rowHeightsPx?.[0] ?? 40;
                    const newH = Math.min(200, curH + 8);
                    return { ...m, rowHeightsPx: Array.from({ length: rows }, () => newH) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Plus size={10} /></button></Tooltip>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Merge / Unmerge */}
            {(() => {
              const sel = tableWidgetEditor.selectionRange;
              const canMerge = !!sel && !(sel.r1 === sel.r2 && sel.c1 === sel.c2);
              const ac = tableWidgetEditor.activeCell;
              const acCell = tableWidgetEditor.model.rows[ac.r]?.[ac.c];
              const canUnmerge = acCell
                ? !!acCell.mergedInto || (acCell.colspan ?? 1) > 1 || (acCell.rowspan ?? 1) > 1
                : false;
              return (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    title={canMerge ? "Merge selected cells" : "Drag across cells to select, then merge"}
                    disabled={!canMerge}
                    className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                      canMerge
                        ? "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={canMerge ? mergeSelectedCells : undefined}
                  >
                    Merge
                  </button>
                  <button
                    type="button"
                    title={canUnmerge ? "Unmerge cell" : "Select a merged cell to unmerge"}
                    disabled={!canUnmerge}
                    className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                      canUnmerge
                        ? "cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={canUnmerge ? unmergeActiveCell : undefined}
                  >
                    Unmerge
                  </button>
                </div>
              );
            })()}

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Vertical alignment */}
            {(() => {
              const ac = tableWidgetEditor.activeCell;
              const sel = tableWidgetEditor.selectionRange;
              const m = tableWidgetEditor.model;
              // Determine current vertical alignment — if selection, check if all selected cells agree
              let curVAlign: "top" | "middle" | "bottom" | "mixed" = "top";
              if (sel) {
                const aligns = new Set<string>();
                for (let r = sel.r1; r <= sel.r2; r++) {
                  for (let c = sel.c1; c <= sel.c2; c++) {
                    const cell = m.rows[r]?.[c];
                    if (cell && !cell.mergedInto) {
                      const base = (m.headerRow && r === 0) || (m.headerCol && c === 0)
                        ? (m.headerTextFmt ?? {}) : (m.bodyTextFmt ?? {});
                      aligns.add(cell.textFmt?.verticalAlign ?? base.verticalAlign ?? "top");
                    }
                  }
                }
                curVAlign = aligns.size === 1 ? ([...aligns][0] as "top" | "middle" | "bottom") : "mixed";
              } else {
                const acCell = m.rows[ac.r]?.[ac.c];
                const baseFmt = (m.headerRow && ac.r === 0) || (m.headerCol && ac.c === 0)
                  ? (m.headerTextFmt ?? {}) : (m.bodyTextFmt ?? {});
                curVAlign = acCell?.textFmt?.verticalAlign ?? baseFmt.verticalAlign ?? "top";
              }
              const opts: Array<{ value: "top" | "middle" | "bottom"; title: string; icon: React.ReactNode }> = [
                { value: "top", title: "Align top", icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="20" y2="4" />
                    <line x1="12" y1="8" x2="12" y2="20" />
                    <line x1="8" y1="12" x2="12" y2="8" />
                    <line x1="16" y1="12" x2="12" y2="8" />
                  </svg>
                )},
                { value: "middle", title: "Align middle", icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <line x1="8" y1="8" x2="12" y2="4" />
                    <line x1="16" y1="8" x2="12" y2="4" />
                    <line x1="8" y1="16" x2="12" y2="20" />
                    <line x1="16" y1="16" x2="12" y2="20" />
                  </svg>
                )},
                { value: "bottom", title: "Align bottom", icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="20" x2="20" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="12" y2="16" />
                    <line x1="16" y1="12" x2="12" y2="16" />
                  </svg>
                )},
              ];
              return (
                <div className="flex items-center gap-0.5">
                  {opts.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      title={o.title}
                      className={`p-1 rounded-md cursor-pointer transition-colors ${
                        curVAlign === o.value
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                      onClick={() => setWidgetTextFmt({ verticalAlign: o.value }, "cell")}
                    >
                      {o.icon}
                    </button>
                  ))}
                </div>
              );
            })()}

            <div className="flex-1" />

            {/* Delete table */}
            <Tooltip content="Delete table" delay={400}><button type="button" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" onClick={deleteWidgetTable}>
              <Trash2 size={14} />
            </button></Tooltip>
          </div>

          {/* Editable table grid */}
          <div className="overflow-auto max-h-[calc(70vh-48px)] p-3 relative">
            <table style={{ borderCollapse: "collapse", width: tableWidgetEditor.model.colWidthsPx?.reduce((a, b) => a + b, 0) ?? "100%", tableLayout: "fixed" }}>
              {tableWidgetEditor.model.colWidthsPx && tableWidgetEditor.model.colWidthsPx.length > 0 && (
                <colgroup>
                  {tableWidgetEditor.model.colWidthsPx.map((w, i) => (
                    <col key={i} style={{ width: `${Math.max(40, Math.round(w))}px` }} />
                  ))}
                </colgroup>
              )}
              <tbody>
                {tableWidgetEditor.model.rows.map((row, rIdx) => {
                  const rowH = tableWidgetEditor.model.rowHeightsPx?.[rIdx];
                  return (
                    <tr key={`${tableRevision}-${rIdx}`} style={rowH ? { height: `${Math.max(24, Math.round(rowH))}px` } : undefined}>
                      {row.map((cell, cIdx) => {
                        // Skip slave cells — they are visually covered by their owner via colSpan/rowSpan
                        if (cell.mergedInto) return null;
                        const isHeader = (tableWidgetEditor.model.headerRow && rIdx === 0) || (tableWidgetEditor.model.headerCol && cIdx === 0);
                        // Per-cell bg takes priority, then header bg, then table-level bg
                        const cellBgOverride = cell.bg && cell.bg !== "transparent" ? cell.bg : "";
                        const tableBg = tableWidgetEditor.model.cellBg && tableWidgetEditor.model.cellBg !== "transparent" ? tableWidgetEditor.model.cellBg : "";
                        const effectiveBg = cellBgOverride || (isHeader ? "#f3f4f6" : tableBg);
                        // Per-cell border takes priority, then table-level border
                        const bWidth = cell.border?.widthPx ?? tableWidgetEditor.model.border.widthPx;
                        const bStyle = cell.border?.style ?? tableWidgetEditor.model.border.style;
                        const bColor = cell.border?.color ?? tableWidgetEditor.model.border.color;
                        const borderStr = `${Math.max(0.5, bWidth)}px ${bStyle} ${bColor}`;
                        // Resolve text format: per-cell → header/body defaults
                        const baseTxtFmt = isHeader ? (tableWidgetEditor.model.headerTextFmt ?? {}) : (tableWidgetEditor.model.bodyTextFmt ?? {});
                        const cellTxtFmt = cell.textFmt ?? {};
                        const txtFont = cellTxtFmt.fontFamily ?? baseTxtFmt.fontFamily ?? "Inter";
                        const txtSize = cellTxtFmt.fontSizePx ?? baseTxtFmt.fontSizePx ?? 13;
                        const txtBold = cellTxtFmt.bold ?? baseTxtFmt.bold ?? false;
                        const txtItalic = cellTxtFmt.italic ?? baseTxtFmt.italic ?? false;
                        const txtUnderline = cellTxtFmt.underline ?? baseTxtFmt.underline ?? false;
                        const txtAlign = cellTxtFmt.textAlign ?? baseTxtFmt.textAlign ?? "left";
                        const txtVAlign = cellTxtFmt.verticalAlign ?? baseTxtFmt.verticalAlign ?? "top";
                        const txtColor = cellTxtFmt.color ?? baseTxtFmt.color;
                        const isActive = tableWidgetEditor.activeCell.r === rIdx && tableWidgetEditor.activeCell.c === cIdx;
                        const selRange = tableWidgetEditor.selectionRange;
                        const inSelection = selRange
                          ? rIdx >= selRange.r1 && rIdx <= selRange.r2 && cIdx >= selRange.c1 && cIdx <= selRange.c2
                          : false;
                        const cellKey = `${rIdx},${cIdx}`;
                        const cs = cell.colspan ?? 1;
                        const rs = cell.rowspan ?? 1;
                        return (
                          <td
                            key={`${tableRevision}-${rIdx}-${cIdx}`}
                            data-r={rIdx}
                            data-c={cIdx}
                            colSpan={cs > 1 ? cs : undefined}
                            rowSpan={rs > 1 ? rs : undefined}
                            style={{
                              border: borderStr,
                              padding: 0,
                              verticalAlign: txtVAlign,
                              background: inSelection ? "rgba(37,99,235,0.1)" : (effectiveBg || undefined),
                              outline: isActive ? "2px solid rgba(37,99,235,0.8)" : inSelection ? "1px solid rgba(37,99,235,0.4)" : undefined,
                              outlineOffset: isActive ? "-2px" : inSelection ? "-1px" : undefined,
                              position: "relative",
                            }}
                            onMouseDown={(e) => {
                              // Start potential drag-to-select
                              if (e.button !== 0) return; // left button only
                              const anchorR = rIdx, anchorC = cIdx;
                              let dragged = false;
                              const onMove = (me: MouseEvent) => {
                                const el = document.elementFromPoint(me.clientX, me.clientY);
                                const td = (el as HTMLElement | null)?.closest?.("td[data-r]") as HTMLElement | null;
                                if (!td) return;
                                const r = parseInt(td.dataset.r ?? "0");
                                const c = parseInt(td.dataset.c ?? "0");
                                if (r === anchorR && c === anchorC) return;
                                if (!dragged) {
                                  dragged = true;
                                  // Clear text selection created by contentEditable
                                  window.getSelection()?.removeAllRanges();
                                }
                                const raw = normalizeRange(anchorR, anchorC, r, c);
                                const expanded = expandRangeForMerges(tableWidgetEditor.model.rows, raw);
                                setTableWidgetEditor((prev) => prev ? { ...prev, selectionRange: expanded, activeCell: { r: anchorR, c: anchorC } } : prev);
                              };
                              const onUp = () => {
                                window.removeEventListener("mousemove", onMove);
                                window.removeEventListener("mouseup", onUp);
                                if (dragged) {
                                  // Clear any text selection from the drag
                                  window.getSelection()?.removeAllRanges();
                                }
                              };
                              window.addEventListener("mousemove", onMove);
                              window.addEventListener("mouseup", onUp);
                            }}
                            onClick={(e) => {
                              if (e.shiftKey && tableWidgetEditor.activeCell) {
                                // Shift+click: extend selection from activeCell to this cell
                                const raw = normalizeRange(tableWidgetEditor.activeCell.r, tableWidgetEditor.activeCell.c, rIdx, cIdx);
                                const expanded = expandRangeForMerges(tableWidgetEditor.model.rows, raw);
                                setTableWidgetEditor((prev) => prev ? { ...prev, selectionRange: expanded } : prev);
                                return;
                              }
                              const ref = cellEditRefs.current.get(cellKey);
                              // If click was on the td padding/border (not on the editable div),
                              // focus the div and place cursor at the end.
                              if (ref && e.target !== ref && !ref.contains(e.target as Node)) {
                                ref.focus();
                                const sel = window.getSelection();
                                if (sel && ref.childNodes.length > 0) {
                                  sel.selectAllChildren(ref);
                                  sel.collapseToEnd();
                                }
                              }
                              // Defer activeCell update so it doesn't cause a re-render that disrupts cursor position
                              requestAnimationFrame(() => {
                                setTableWidgetEditor((prev) => {
                                  if (!prev) return prev;
                                  if (prev.activeCell.r === rIdx && prev.activeCell.c === cIdx && !prev.selectionRange) return prev;
                                  return { ...prev, activeCell: { r: rIdx, c: cIdx }, selectionRange: undefined };
                                });
                              });
                            }}
                          >
                            <div
                              ref={(el) => {
                                // Don't delete on null — React re-creates inline ref callbacks
                                // on every render and calls old(null) then new(el). Skipping
                                // delete keeps `prev === el` true so we don't reset innerHTML.
                                if (!el) return;
                                const prev = cellEditRefs.current.get(cellKey);
                                cellEditRefs.current.set(cellKey, el);
                                // Only set innerHTML on genuine first mount (new DOM element).
                                if (prev !== el) {
                                  const content = cell.html === "&nbsp;" ? "" : cell.html;
                                  el.innerHTML = content;
                                }
                              }}
                              contentEditable
                              suppressContentEditableWarning
                              className="outline-none min-h-[24px] text-gray-800 dark:text-gray-200"
                              style={{
                                fontFamily: `${txtFont}, system-ui, sans-serif`,
                                fontSize: `${txtSize}px`,
                                fontWeight: txtBold || isHeader ? 600 : 400,
                                fontStyle: txtItalic ? "italic" : "normal",
                                textDecoration: txtUnderline ? "underline" : "none",
                                textAlign: txtAlign,
                                padding: "6px 8px",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                ...(txtColor?.startsWith("gradient:")
                                  ? {
                                      background: colorToCSS(txtColor),
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      backgroundClip: "text",
                                    }
                                  : { color: txtColor || undefined }),
                              }}
                              onFocus={() => {
                                // Defer to avoid re-render that resets cursor position.
                                // Do NOT clear selectionRange here — onClick handles that for regular clicks,
                                // and Shift+click sets it intentionally.
                                requestAnimationFrame(() => {
                                  setTableWidgetEditor((prev) => {
                                    if (!prev) return prev;
                                    if (prev.activeCell.r === rIdx && prev.activeCell.c === cIdx) return prev;
                                    return { ...prev, activeCell: { r: rIdx, c: cIdx } };
                                  });
                                });
                              }}
                              onInput={() => {
                                // Cell content lives in the DOM. readCellsFromPanel() reads
                                // it when needed (close, structural changes, commit).
                                // We intentionally do NOT call setTableWidgetEditor here —
                                // updating React state on every keystroke causes re-renders
                                // that reset the cursor position in contentEditable elements.
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Tab") {
                                  e.preventDefault();
                                  // Clear selection when tabbing
                                  setTableWidgetEditor((prev) => prev?.selectionRange ? { ...prev, selectionRange: undefined } : prev);
                                  const cols = tableWidgetEditor.model.rows[0]?.length ?? 1;
                                  const totalRows = tableWidgetEditor.model.rows.length;
                                  let nextR = rIdx, nextC = cIdx;
                                  const advance = () => {
                                    if (e.shiftKey) {
                                      nextC--;
                                      if (nextC < 0) { nextR--; nextC = cols - 1; }
                                    } else {
                                      nextC++;
                                      if (nextC >= cols) { nextR++; nextC = 0; }
                                    }
                                  };
                                  advance();
                                  // Skip slave cells
                                  while (nextR >= 0 && nextR < totalRows && nextC >= 0 && nextC < cols &&
                                    tableWidgetEditor.model.rows[nextR]?.[nextC]?.mergedInto) {
                                    advance();
                                  }
                                  if (nextR < 0) { nextR = 0; nextC = 0; }
                                  if (nextR >= totalRows) {
                                    if (!e.shiftKey) {
                                      insertWidgetRow("below");
                                      nextR = totalRows;
                                      nextC = 0;
                                      requestAnimationFrame(() => {
                                        const ref = cellEditRefs.current.get(`${nextR},${nextC}`);
                                        ref?.focus();
                                      });
                                      return;
                                    }
                                  }
                                  const ref = cellEditRefs.current.get(`${nextR},${nextC}`);
                                  ref?.focus();
                                }
                              }}
                            />
                            {/* Column resize handle */}
                            {(cIdx + (cs - 1)) < (tableWidgetEditor.model.rows[0]?.length ?? 1) - 1 && (
                              <div
                                className="absolute top-0 -right-[3px] w-[6px] h-full cursor-col-resize hover:bg-blue-400/40 z-10"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const resizeColIdx = cIdx + (cs - 1); // last physical column covered by this span
                                  const startX = e.clientX;
                                  const startW = tableWidgetEditor.model.colWidthsPx?.[resizeColIdx] ?? 120;
                                  // Subtract 2 for the 1px border on each side of the page wrapper (border-box)
                                  const maxTableW = pageWidthPx - marginLeftPx - marginRightPx - 2;
                                  const onMove = (me: MouseEvent) => {
                                    const delta = me.clientX - startX;
                                    const nextW = Math.max(40, Math.round(startW + delta));
                                    setTableWidgetEditor((prev) => {
                                      if (!prev) return prev;
                                      const widths = [...(prev.model.colWidthsPx ?? [])];
                                      widths[resizeColIdx] = nextW;
                                      // Clamp so total table width never exceeds available page width
                                      const totalW = widths.reduce((a, b) => a + b, 0);
                                      if (totalW > maxTableW) {
                                        widths[resizeColIdx] = Math.max(40, nextW - (totalW - maxTableW));
                                      }
                                      return { ...prev, model: { ...prev.model, colWidthsPx: widths } };
                                    });
                                  };
                                  const onUp = () => {
                                    window.removeEventListener("mousemove", onMove);
                                    window.removeEventListener("mouseup", onUp);
                                    document.body.style.cursor = "";
                                    const cur = tableWidgetEditorRef.current;
                                    if (cur) {
                                      const wEl = getWidgetEl();
                                      if (wEl) commitTableWidget(wEl, cur.model);
                                      emitChange();
                                    }
                                  };
                                  document.body.style.cursor = "col-resize";
                                  window.addEventListener("mousemove", onMove);
                                  window.addEventListener("mouseup", onUp);
                                }}
                              />
                            )}
                            {/* Row resize handle */}
                            {cIdx === 0 && rIdx < tableWidgetEditor.model.rows.length - 1 && (
                              <div
                                className="absolute left-0 -bottom-[3px] w-full h-[6px] cursor-row-resize hover:bg-blue-400/40 z-10"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const startY = e.clientY;
                                  const startH = tableWidgetEditor.model.rowHeightsPx?.[rIdx] ?? 40;
                                  const onMove = (me: MouseEvent) => {
                                    const delta = me.clientY - startY;
                                    const nextH = Math.max(24, Math.round(startH + delta));
                                    setTableWidgetEditor((prev) => {
                                      if (!prev) return prev;
                                      const heights = [...(prev.model.rowHeightsPx ?? [])];
                                      heights[rIdx] = nextH;
                                      return { ...prev, model: { ...prev.model, rowHeightsPx: heights } };
                                    });
                                  };
                                  const onUp = () => {
                                    window.removeEventListener("mousemove", onMove);
                                    window.removeEventListener("mouseup", onUp);
                                    document.body.style.cursor = "";
                                    const cur = tableWidgetEditorRef.current;
                                    if (cur) {
                                      const wEl = getWidgetEl();
                                      if (wEl) commitTableWidget(wEl, cur.model);
                                      emitChange();
                                    }
                                  };
                                  document.body.style.cursor = "row-resize";
                                  window.addEventListener("mousemove", onMove);
                                  window.addEventListener("mouseup", onUp);
                                }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hidden image picker — accepts all modern image formats */}
      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_ACCEPT_ATTR}
        className="hidden"
        onChange={async (e) => {
          const inputEl = e.currentTarget;
          const file = e.target.files?.[0];
          if (!file) return;
          await handleInsertImageFromFile(file);
          if (inputEl) inputEl.value = "";
        }}
      />
      {/* Hidden file input for "Open" */}
      <input
        ref={openFileInputRef}
        type="file"
        accept=".html,.htm,.txt,.md,.json"
        className="hidden"
        onChange={async (e) => {
          const inputEl = e.currentTarget;
          const file = e.target.files?.[0];
          if (!file) return;
          await handleOpenFileSelected(file);
          if (inputEl) inputEl.value = "";
        }}
      />

      {/* Header row: doc icon + title (rename) */}
      {!isFullscreen && (
      <div data-doc-header className="relative z-[50] px-2 sm:px-4 pt-2 sm:pt-3 pb-1.5 sm:pb-2 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/70 dark:bg-gray-900/40 midnight:bg-[#0d1526]/60 purple:bg-[#1f1035]/60 backdrop-blur">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <input
                ref={titleInputRef}
                value={docTitle}
                onChange={(e) => updateValue({ title: e.target.value })}
                disabled={!canEdit}
                className="min-w-0 w-full max-w-[180px] sm:max-w-[420px] bg-transparent text-[14px] sm:text-[18px] font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 outline-none rounded-md px-1 sm:px-2 py-1 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 focus:bg-white/70 dark:focus:bg-gray-800/60 transition-colors"
                aria-label="Document title"
              />
              <Tooltip content="Star" delay={400}>
                <button
                  type="button"
                  className="p-1 sm:p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          {/* Top-right comment icon — opens/closes comments panel */}
          <div className="ml-auto flex items-center gap-2">
            <Tooltip content={showComments ? "Close comments" : "Open comments"} delay={400}>
              <button
                type="button"
                onClick={() => { setShowComments((v) => !v); setSidebarManuallyDismissed(false); }}
                className={[
                  "relative p-1.5 sm:p-2 rounded-full transition-all duration-200 cursor-pointer",
                  showComments
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                ].join(" ")}
                aria-label="Toggle comments panel"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {openComments.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[9px] font-bold px-1 shadow-sm">
                    {openComments.length}
                  </span>
                )}
              </button>
            </Tooltip>
            <button
              type="button"
              onClick={() => setDialog("share")}
              className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold text-white bg-[#1a73e8] hover:bg-[#1765cc] shadow-sm transition-colors cursor-pointer"
            >
              Share
            </button>
          </div>
        </div>

        {/* Menubar */}
        <div
          data-doc-menubar
          className="mt-1 sm:mt-2 flex items-center flex-wrap gap-1 sm:gap-2 text-[12px] sm:text-[13px] text-gray-700 dark:text-gray-200 select-none"
        >
          <MenuRoot
            id="file"
            label="File"
            openMenu={openMenu}
            onOpen={(id) => setOpenMenu(id)}
            onClose={() => setOpenMenu(null)}
          >
            <ViewMenuPanel>
            <ViewMenuItem
              label="New"
              icon={FilePlus2}
              hasSubmenu
              onHover={() => setOpenSubmenu("file-new")}
              onClick={() => setOpenSubmenu((prev) => (prev === "file-new" ? null : "file-new"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-new"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <ViewMenuItem label="Document" icon={FileText} onClick={handleNewDoc} />
                  <ViewMenuItem label="Spreadsheet" icon={FileSpreadsheet} onClick={() => showToast("Spreadsheet: coming soon")} />
                  <ViewMenuItem label="Presentation" icon={Presentation} onClick={() => showToast("Presentation: coming soon")} />
                  <ViewMenuItem label="Form" icon={FormInputIcon} onClick={() => showToast("Form: coming soon")} />
                  <ViewMenuItem label="Drawing" icon={Pencil} onClick={() => showToast("Drawing: coming soon")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem label="Open" icon={BookOpen} shortcut="Ctrl+O" onClick={handleOpenFile} />
            <ViewMenuItem label="Make a copy" icon={Copy} onClick={handleMakeCopy} />
            <ViewMenuDivider />
            <ViewMenuItem
              label="Share"
              icon={UserPlus}
              hasSubmenu
              onHover={() => setOpenSubmenu("file-share")}
              onClick={() => setOpenSubmenu((prev) => (prev === "file-share" ? null : "file-share"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-share"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <ViewMenuItem label="Share with others" icon={UserPlus} onClick={() => setDialog("share")} />
                  <ViewMenuItem label="Publish" icon={Globe} onClick={() => setDialog("publish")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Email"
              icon={Mail}
              hasSubmenu
              onHover={() => setOpenSubmenu("file-email")}
              onClick={() => setOpenSubmenu((prev) => (prev === "file-email" ? null : "file-email"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-email"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <ViewMenuItem label="Email this document" icon={Mail} onClick={handleEmail} />
                  <ViewMenuItem label="Copy email-ready text" icon={Copy} onClick={() => handleShareCopy("text")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Download"
              icon={Download}
              hasSubmenu
              onHover={() => setOpenSubmenu("file-download")}
              onClick={() => setOpenSubmenu((prev) => (prev === "file-download" ? null : "file-download"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-download"}
              submenu={
                <SubmenuPanel className="w-[280px]">
                  <ViewMenuItem label="Microsoft Word (.doc)" icon={Download} onClick={() => handleDownload("docx")} />
                  <ViewMenuItem label="PDF document (.pdf)" icon={Download} onClick={() => handleDownload("pdf")} />
                  <ViewMenuItem label="OpenDocument format (.odt)" icon={Download} onClick={() => handleDownload("odt")} />
                  <ViewMenuItem label="Plain text (.txt)" icon={Download} onClick={() => handleDownload("txt")} />
                  <ViewMenuItem label="Rich Text Format (.rtf)" icon={Download} onClick={() => handleDownload("rtf")} />
                  <ViewMenuItem label="Web page (.html)" icon={Download} onClick={() => handleDownload("html")} />
                  <ViewMenuItem label="EPUB publication (.epub)" icon={Download} onClick={() => handleDownload("epub")} />
                  <ViewMenuItem label="Markdown (.md)" icon={Download} onClick={() => handleDownload("md")} />
                  <ViewMenuDivider />
                  <ViewMenuItem label="JSON (.json)" icon={Download} onClick={() => handleDownload("json")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuDivider />
            <ViewMenuItem label="Rename" icon={PenLine} onClick={handleRename} />
            <ViewMenuItem label="Move" icon={FolderInput} onClick={() => showToast("Move: coming soon")} />
            <ViewMenuItem label="Add shortcut to Drive" icon={Star} onClick={() => showToast("Shortcut added to Drive")} />
            <ViewMenuItem label="Move to trash" icon={Trash2} onClick={() => { showToast("Document moved to trash"); handleNewDoc(); }} />
            <ViewMenuDivider />
            <ViewMenuItem
              label="Version history"
              hasSubmenu
              onHover={() => setOpenSubmenu("file-versions")}
              onClick={() => setOpenSubmenu((prev) => (prev === "file-versions" ? null : "file-versions"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-versions"}
              submenu={
                <SubmenuPanel className="w-[280px]">
                  <ViewMenuItem label="Name current version" icon={Tag} onClick={() => {
                    const name = window.prompt("Name this version:");
                    if (!name) return;
                    saveVersion(name, "manual");
                    showToast(`Version named: ${name}`);
                  }} />
                  <ViewMenuItem
                    label="Save version"
                    onClick={() => {
                      saveVersion("Manual save", "manual");
                      showToast("Version saved");
                      setDialog("versions");
                    }}
                  />
                  <ViewMenuItem label="View versions" onClick={() => setDialog("versions")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem label="Details" onClick={() => setDialog("details")} />
            <ViewMenuItem label="Security limitations" onClick={() => setDialog("security")} />
            <ViewMenuDivider />
            <ViewMenuItem
              label="Language"
              hasSubmenu
              disabled={!tenantTranslationEnabled}
              onHover={tenantTranslationEnabled ? () => setOpenSubmenu("file-language") : undefined}
              onClick={tenantTranslationEnabled ? () => setOpenSubmenu("file-language") : undefined}
              onLeave={tenantTranslationEnabled ? () => setOpenSubmenu(null) : undefined}
              isSubmenuOpen={openSubmenu === "file-language"}
              submenu={
                <SubmenuPanel className="w-[280px] p-2">
                  <div className="mb-2">
                    <input
                      value={languageQuery}
                      onChange={(e) => setLanguageQuery(e.target.value)}
                      placeholder="Search languages..."
                      className="w-full px-2 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                  <div
                    className="py-1 max-h-[320px] overflow-y-auto overscroll-contain scrollbar-thin"
                    onWheelCapture={(e) => e.stopPropagation()}
                  >
                    {filteredLanguages.map((l) => (
                    <ViewMenuItem
                      key={l.tag}
                      label={l.label}
                      onClick={() => {
                        const prevLang = language;
                        const nextLang = l.tag;

                        htmlByLanguageRef.current.set(prevLang, latestValueRef.current.html);

                        const existing = htmlByLanguageRef.current.get(nextLang);
                        if (existing) {
                          updateValue({ language: nextLang, html: existing });
                          return;
                        }

                        updateValue({ language: nextLang });
                        if (tenantTranslationEnabled) {
                          void handleTranslateDocument(prevLang, nextLang);
                        }
                      }}
                      isChecked={language === l.tag}
                    />
                  ))}
                    {filteredLanguages.length === 0 && (
                      <div className="px-3 py-2 text-[12px] text-gray-500 dark:text-gray-400">
                        No languages found
                      </div>
                    )}
                  </div>
                </SubmenuPanel>
              }
            />
            <ViewMenuItem label="Page setup" onClick={() => setDialog("pageSetup")} />
            <ViewMenuItem
              label="Print"
              icon={Printer}
              shortcut="Ctrl+P"
              onClick={() => {
                handleDownload("pdf");
              }}
            />
            </ViewMenuPanel>
          </MenuRoot>

        {/* Edit menu */}
          <MenuRoot
            id="edit"
            label="Edit"
            openMenu={openMenu}
            onOpen={(id) => {
              if (!canEdit) {
                showToast("Viewing mode");
                return;
              }
              setOpenMenu(id);
            }}
            onClose={() => setOpenMenu(null)}
          >
            <ViewMenuPanel>
            <ViewMenuItem label="Undo" shortcut="Ctrl+Z" icon={Undo2} onClick={() => handleCommand("undo")} />
            <ViewMenuItem label="Redo" shortcut="Ctrl+Y" icon={Redo2} onClick={() => handleCommand("redo")} />
            <ViewMenuDivider />
            <ViewMenuItem label="Cut" shortcut="Ctrl+X" icon={Scissors} onClick={() => handleCommand("cut")} />
            <ViewMenuItem label="Copy" shortcut="Ctrl+C" icon={Copy} onClick={() => handleCommand("copy")} />
            <ViewMenuItem label="Paste" shortcut="Ctrl+V" icon={ClipboardPaste} onClick={() => handlePaste(false)} />
            <ViewMenuItem label="Paste without formatting" shortcut="Ctrl+Shift+V" icon={ClipboardPaste} onClick={() => handlePaste(true)} />
            <ViewMenuDivider />
            <ViewMenuItem label="Select all" shortcut="Ctrl+A" onClick={() => handleCommand("selectAll")} />
            <ViewMenuItem label="Delete" icon={Trash2} onClick={() => handleCommand("delete")} />
            <ViewMenuDivider />
            <ViewMenuItem label="Find and replace" shortcut="Ctrl+H" icon={Search} onClick={() => setDialog("findReplace")} />
            </ViewMenuPanel>
          </MenuRoot>

        {/* View menu */}
          <MenuRoot
            id="view"
            label="View"
            openMenu={openMenu}
            onOpen={(id) => setOpenMenu(id)}
            onClose={() => setOpenMenu(null)}
          >
            <ViewMenuPanel>
            {/* ── Mode submenu ── */}
            <ViewMenuItem
              label="Mode"
              hasSubmenu
              onHover={() => setOpenSubmenu("view-mode")}
              onClick={() => setOpenSubmenu((prev) => (prev === "view-mode" ? null : "view-mode"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "view-mode"}
              activeMode={docMode}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <ViewMenuItem
                    label="Editing"
                    description="Edit the document directly"
                    isChecked={docMode === "editing"}
                    onClick={() => {
                      setDocMode("editing");
                      showToast("Mode: Editing");
                    }}
                  />
                  <ViewMenuItem
                    label="Suggesting"
                    description="Edits become suggestions"
                    isChecked={docMode === "suggesting"}
                    onClick={() => {
                      setDocMode("suggesting");
                      showToast("Mode: Suggesting");
                    }}
                  />
                  <ViewMenuItem
                    label="Viewing"
                    description="Read or print the final document"
                    isChecked={docMode === "viewing"}
                    onClick={() => {
                      setDocMode("viewing");
                      showToast("Mode: Viewing");
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <ViewMenuDivider />
            {/* ── Layout toggles ── */}
            <ViewMenuToggle
              label="Print layout"
              description="Page breaks, margins, headers/footers"
              isOn={showPrintLayout}
              onToggle={() => setSectionInfos((prev) => prev.map(s => ({ ...s, pageSetup: { ...s.pageSetup, pageless: !s.pageSetup.pageless } })))}
            />
            <ViewMenuToggle
              label="Pageless"
              description="Continuous scroll, wide content"
              isOn={!showPrintLayout}
              onToggle={() => setSectionInfos((prev) => prev.map(s => ({ ...s, pageSetup: { ...s.pageSetup, pageless: !s.pageSetup.pageless } })))}
            />
            <ViewMenuDivider />
            {/* ── Show toggles ── */}
            <ViewMenuToggle
              label="Show ruler"
              isOn={showRuler}
              onToggle={() => setShowRuler((v) => !v)}
            />
            <ViewMenuToggle
              label="Show equation toolbar"
              isOn={showEquationToolbar}
              onToggle={() => setShowEquationToolbar((v) => !v)}
            />
            <ViewMenuToggle
              label="Show non-printing characters"
              shortcut="Ctrl+Shift+P"
              isOn={showNonPrinting}
              onToggle={() => setShowNonPrinting((v) => !v)}
            />
            <ViewMenuToggle
              label="Show outline"
              isOn={showOutline}
              onToggle={() => {
                setShowOutline((v) => !v);
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
              }}
            />
            <ViewMenuToggle
              label="Show comments"
              isOn={showComments}
              onToggle={() => { setShowComments((v) => !v); setSidebarManuallyDismissed(false); }}
            />
            <ViewMenuDivider />
            {/* ── Proofing toggles ── */}
            <ViewMenuToggle
              label="Show spelling suggestions"
              isOn={showSpellingSuggestions}
              onToggle={() => setShowSpellingSuggestions((v) => !v)}
            />
            <ViewMenuToggle
              label="Show grammar suggestions"
              isOn={showGrammarSuggestions}
              onToggle={() => setShowGrammarSuggestions((v) => !v)}
            />
            <ViewMenuDivider />
            {/* ── Full screen ── */}
            <ViewMenuItem
              label="Full screen"
              icon={isFullscreen ? Minimize2 : Maximize2}
              shortcut="F11"
              onClick={() => setIsFullscreen((v) => !v)}
            />
            {/* ── Zoom submenu ── */}
            <ViewMenuItem
              label="Zoom"
              icon={ZoomIn}
              hasSubmenu
              onHover={() => setOpenSubmenu("view-zoom")}
              onClick={() => setOpenSubmenu((prev) => (prev === "view-zoom" ? null : "view-zoom"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "view-zoom"}
              submenu={
                <SubmenuPanel className="w-[180px]">
                  <ViewMenuItem label="Fit" isChecked={zoomLevel === 100} onClick={() => { setZoomLevel(100); showToast("Zoom: Fit"); }} />
                  <ViewMenuDivider />
                  {[50, 75, 100, 125, 150, 200].map((z) => (
                    <ViewMenuItem key={z} label={`${z}%`} isChecked={z === zoomLevel} onClick={() => { setZoomLevel(z); showToast(`Zoom: ${z}%`); }} />
                  ))}
                </SubmenuPanel>
              }
            />
            </ViewMenuPanel>
          </MenuRoot>

        {/* Insert menu */}
          <MenuRoot
            id="insert"
            label="Insert"
            openMenu={openMenu}
            onOpen={(id) => {
              if (!canEdit) {
                showToast("Viewing mode");
                return;
              }
              setOpenMenu(id);
            }}
            onClose={() => setOpenMenu(null)}
          >
            <ViewMenuPanel>
            <ViewMenuItem
              label="Image"
              hasSubmenu
              icon={ImageIcon}
              onHover={() => setOpenSubmenu("insert-image")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-image" ? null : "insert-image"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-image"}
              submenu={
                <SubmenuPanel className="w-[260px]">
                  <ViewMenuItem label="Upload from computer" icon={Upload} onClick={() => { saveEditorSelection(); closeMenus(); imageInputRef.current?.click(); }} />
                  <ViewMenuItem
                    label="Search the web"
                    icon={Search}
                    onClick={() => {
                      saveEditorSelection();
                      closeMenus();
                      setShowImageSearchSidebar(true);
                    }}
                  />
                  <ViewMenuItem label="Drive" icon={HardDrive} onClick={() => { saveEditorSelection(); closeMenus(); showToast("Google Drive integration — opening file picker"); imageInputRef.current?.click(); }} />
                  <ViewMenuItem label="Photos" icon={ImagePlus} onClick={() => { saveEditorSelection(); closeMenus(); showToast("Google Photos integration — opening file picker"); imageInputRef.current?.click(); }} />
                  <ViewMenuItem
                    label="Camera"
                    icon={Camera}
                    onClick={() => {
                      saveEditorSelection();
                      closeMenus();
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = IMAGE_ACCEPT_ATTR;
                      (input as any).capture = "environment";
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        await handleInsertImageFromFile(file);
                      };
                      input.click();
                    }}
                  />
                  <ViewMenuDivider />
                  <ViewMenuItem
                    label="By URL"
                    icon={Link}
                    onClick={() => {
                      saveEditorSelection();
                      closeMenus();
                      setShowImageUrlModal(true);
                      setImageUrlInput("");
                      setImageUrlError("");
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Table"
              hasSubmenu
              icon={TableIcon}
              onHover={() => setOpenSubmenu("insert-table")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-table" ? null : "insert-table"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-table"}
              submenu={
                <SubmenuPanel className="p-2">
                  <TableGridPicker
                    onPick={(rows, cols) => {
                      handleInsertTable(rows, cols);
                      closeMenus();
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Building blocks"
              hasSubmenu
              icon={LayoutTemplate}
              onHover={() => setOpenSubmenu("insert-blocks")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-blocks" ? null : "insert-blocks"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-blocks"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <ViewMenuItem label="Meeting notes" icon={FileText} onClick={() => handleTemplateInsert(resolvedTemplates[0])} />
                  <ViewMenuItem label="Email draft" icon={Mail} onClick={() => handleTemplateInsert(resolvedTemplates[1])} />
                  <ViewMenuItem
                    label="Simple decision log"
                    onClick={() => {
                      handleTemplateInsert({
                        id: "decision-log",
                        label: "Decision log",
                        html: `<h2>Decision log</h2><table style="border-collapse:collapse;width:100%;margin:12px 0;"><tr><td style="border:1px solid #e5e7eb;padding:8px;">Decision</td><td style="border:1px solid #e5e7eb;padding:8px;">Owner</td><td style="border:1px solid #e5e7eb;padding:8px;">Date</td></tr><tr><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td></tr></table>`,
                      });
                    }}
                  />
                  <ViewMenuDivider />
                  <ViewMenuItem label="View more" onClick={() => setMoreOpen(true)} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Smart chips"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-chips")}
              onClick={() => setOpenSubmenu((prev) => (prev?.startsWith("insert-chips") ? null : "insert-chips"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu?.startsWith("insert-chips")}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <ViewMenuItem
                    label="Date"
                    icon={Calendar}
                    onClick={() => {
                      const d = new Date().toISOString().slice(0, 10);
                      exec("insertHTML", `<span style="padding:2px 8px;border-radius:999px;background:#eff6ff;border:1px solid #bfdbfe;">${d}</span>`);
                      emitChange();
                    }}
                  />
                  <ViewMenuItem label="People" icon={User} onClick={() => { const name = window.prompt("Person name"); if (!name) return; insertChip("Person", name); }} />
                  <ViewMenuItem label="File" icon={FileIcon} onClick={() => { const name = window.prompt("File name"); if (!name) return; insertChip("File", name); }} />
                  <ViewMenuItem label="Place" icon={MapPin} onClick={() => { const name = window.prompt("Place"); if (!name) return; insertChip("Place", name); }} />
                  <ViewMenuItem
                    label="Placeholder chips"
                    hasSubmenu
                    onHover={() => setOpenSubmenu("insert-chips-placeholders")}
                    onClick={() => setOpenSubmenu((prev) => prev === "insert-chips-placeholders" ? "insert-chips" : "insert-chips-placeholders")}
                    onLeave={() => setOpenSubmenu("insert-chips")}
                    isSubmenuOpen={openSubmenu === "insert-chips-placeholders"}
                    submenu={
                      <SubmenuPanel className="w-[220px]">
                        <ViewMenuItem label="Document title" onClick={() => insertChip("Title", docTitle)} />
                        <ViewMenuItem label="Today" onClick={() => insertChip("Date", new Date().toLocaleDateString())} />
                        <ViewMenuItem label="Email" onClick={() => insertChip("Email", "name@example.com")} />
                      </SubmenuPanel>
                    }
                  />
                  <ViewMenuDivider />
                  <ViewMenuItem
                    label="Drop-down"
                    onClick={() => {
                      exec("insertHTML", `<select style="padding:6px 10px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;"><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>&nbsp;`);
                      emitChange();
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="eSignature"
              icon={PenLine}
              onClick={() => {
                exec("insertHTML", `<div style="margin:12px 0;padding:12px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc;"><strong>Signature</strong><div style="height:32px;"></div><div style="border-top:1px solid #cbd5e1;width:240px;"></div></div>`);
                emitChange();
              }}
            />
            <ViewMenuItem label="Link" icon={Link2} shortcut="Ctrl+K" onClick={() => {
              const url = window.prompt("Enter URL");
              if (!url) return;
              handleCommand("createLink", url);
            }} />
            <ViewMenuItem
              label="Drawing"
              icon={Pencil}
              onClick={() => {
                insertSvg(`<svg width="520" height="180" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="178" rx="14" fill="#f3f4f6" stroke="#e5e7eb"/><text x="260" y="92" text-anchor="middle" font-family="Inter, Arial" font-size="14" fill="#6b7280">Drawing placeholder</text></svg>`);
              }}
            />
            <ViewMenuItem
              label="Chart"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-chart")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-chart" ? null : "insert-chart"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-chart"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <ViewMenuItem label="Bar" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><rect x="80" y="120" width="50" height="60" rx="8" fill="#3b82f6"/><rect x="160" y="90" width="50" height="90" rx="8" fill="#22c55e"/><rect x="240" y="140" width="50" height="40" rx="8" fill="#eab308"/><rect x="320" y="70" width="50" height="110" rx="8" fill="#ef4444"/><line x1="60" y1="180" x2="460" y2="180" stroke="#e5e7eb"/></svg>`)} />
                  <ViewMenuItem label="Column" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><rect x="80" y="120" width="50" height="60" rx="8" fill="#3b82f6"/><rect x="160" y="90" width="50" height="90" rx="8" fill="#22c55e"/><rect x="240" y="140" width="50" height="40" rx="8" fill="#eab308"/><rect x="320" y="70" width="50" height="110" rx="8" fill="#8b5cf6"/><line x1="60" y1="180" x2="460" y2="180" stroke="#e5e7eb"/></svg>`)} />
                  <ViewMenuItem label="Line" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><polyline points="70,160 160,120 250,150 340,90 430,110" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="160" r="5" fill="#3b82f6"/><circle cx="160" cy="120" r="5" fill="#3b82f6"/><circle cx="250" cy="150" r="5" fill="#3b82f6"/><circle cx="340" cy="90" r="5" fill="#3b82f6"/><circle cx="430" cy="110" r="5" fill="#3b82f6"/></svg>`)} />
                  <ViewMenuItem label="Pie" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><g transform="translate(160,110)"><circle r="70" fill="#f3f4f6"/><path d="M0 0 L70 0 A70 70 0 0 1 -22 66 Z" fill="#3b82f6"/><path d="M0 0 L-22 66 A70 70 0 0 1 -70 0 Z" fill="#22c55e"/><path d="M0 0 L-70 0 A70 70 0 0 1 0 -70 Z" fill="#eab308"/><path d="M0 0 L0 -70 A70 70 0 0 1 70 0 Z" fill="#ef4444"/></g></svg>`)} />
                  <ViewMenuDivider />
                  <ViewMenuItem label="From Sheets" onClick={() => showToast("Sheets: add Google integration to enable")} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem
              label="Symbols"
              hasSubmenu
              icon={Sigma}
              onHover={() => setOpenSubmenu("insert-symbols")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-symbols" ? null : "insert-symbols"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-symbols"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <ViewMenuItem label="Emoji" icon={Smile} onClick={() => { const e = window.prompt("Emoji"); if (!e) return; exec("insertText", e); emitChange(); }} />
                  <ViewMenuItem label="Special characters" icon={Sigma} onClick={() => { const ch = window.prompt("Character"); if (!ch) return; exec("insertText", ch); emitChange(); }} />
                  <ViewMenuItem label="Equation" icon={Sigma} onClick={() => { const eq = window.prompt("Equation (LaTeX/plain)"); if (!eq) return; exec("insertHTML", `<span style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;padding:2px 6px;border-radius:8px;background:#f3f4f6;border:1px solid #e5e7eb;">${eq}</span>&nbsp;`); emitChange(); }} />
                </SubmenuPanel>
              }
            />
            <ViewMenuDivider />
            <ViewMenuItem
              label="Tab"
              shortcut="Shift+F11"
              onClick={() => { exec("insertHTML", "<span>&emsp;</span>"); emitChange(); }}
            />
            <ViewMenuItem label="Horizontal line" onClick={handleInsertHorizontalLine} />
            <ViewMenuItem
              label="Break"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-break")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-break" ? null : "insert-break"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-break"}
              submenu={
                <SubmenuPanel className="w-[250px]">
                  <ViewMenuItem label="Page break" shortcut="Ctrl+Enter" onClick={handleInsertPageBreak} />
                  <ViewMenuItem label="Column break" onClick={() => { exec("insertHTML", `<div style="border-top:1px dashed #e5e7eb;margin:16px 0;"><em>Column break</em></div>`); emitChange(); }} />
                  <ViewMenuItem label="Section break (next page)" onClick={() => {
                    const sIdx = activeSectionIdxRef.current;
                    const currentSetup = sectionInfosRef.current[sIdx]?.pageSetup || DEFAULT_PAGE_SETUP;
                    handleInsertPageBreak();
                    setTimeout(() => {
                      setSectionInfos(prev => {
                        const [rangeStart] = getSectionPageRange(sIdx);
                        let cursorPage = rangeStart;
                        const sel = window.getSelection();
                        if (sel?.anchorNode) {
                          let node = sel.anchorNode as HTMLElement | null;
                          while (node && node !== editorRootRef.current) {
                            const pidx = pageRefs.current.indexOf(node as HTMLDivElement);
                            if (pidx >= 0) { cursorPage = pidx; break; }
                            node = node.parentElement;
                          }
                        }
                        if (cursorPage <= rangeStart) return prev;
                        const pagesBeforeSplit = cursorPage - rangeStart;
                        const pagesAfterSplit = prev[sIdx].pageCount - pagesBeforeSplit;
                        if (pagesAfterSplit <= 0) return prev;
                        const updated = [...prev];
                        updated.splice(sIdx, 1,
                          { pageCount: pagesBeforeSplit, pageSetup: { ...currentSetup } },
                          { pageCount: pagesAfterSplit, pageSetup: { ...currentSetup } },
                        );
                        return updated;
                      });
                    }, 100);
                  }} />
                  <ViewMenuItem label="Section break (continuous)" onClick={() => {
                    exec("insertHTML", `<div style="border-top:1px dashed #e5e7eb;margin:16px 0;"><em>Section break (continuous)</em></div>`);
                    emitChange();
                  }} />
                </SubmenuPanel>
              }
            />
            <ViewMenuItem label="Bookmark" icon={Bookmark} onClick={insertBookmark} />
            <ViewMenuItem
              label="Page elements"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-elements")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-elements" ? null : "insert-elements"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-elements"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <ViewMenuItem label="Table of contents" onClick={insertTOC} />
                  <ViewMenuItem label="Header" onClick={() => { focusEditor(); exec("insertHTML", "<h3>Header</h3>"); emitChange(); }} />
                  <ViewMenuItem label="Footer" onClick={() => { focusEditor(); exec("insertHTML", "<h3>Footer</h3>"); emitChange(); }} />
                  <ViewMenuItem label="Watermark" onClick={() => { focusEditor(); exec("insertHTML", `<p style="text-align:center;opacity:0.18;font-size:36px;font-weight:700;letter-spacing:0.12em;">WATERMARK</p>`); emitChange(); }} />
                </SubmenuPanel>
              }
            />
            </ViewMenuPanel>
          </MenuRoot>

          {/* Format menu */}
          <MenuRoot id="format" label="Format" openMenu={openMenu} onOpen={(id) => { if (!canEdit) { showToast("Viewing mode"); return; } setOpenMenu(id); }} onClose={() => setOpenMenu(null)}>
            <ViewMenuPanel>
              <ViewMenuItem
                label="Text"
                icon={Type}
                hasSubmenu
                onHover={() => setOpenSubmenu("format-text")}
                onClick={() => setOpenSubmenu((p) => (p === "format-text" ? null : "format-text"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-text"}
                submenu={
                  <SubmenuPanel className="w-[240px]">
                    <ViewMenuItem label="Bold" shortcut="Ctrl+B" icon={Bold} onClick={() => handleCommand("bold")} />
                    <ViewMenuItem label="Italic" shortcut="Ctrl+I" icon={Italic} onClick={() => handleCommand("italic")} />
                    <ViewMenuItem label="Underline" shortcut="Ctrl+U" icon={Underline} onClick={() => handleCommand("underline")} />
                    <ViewMenuItem label="Strikethrough" shortcut="Alt+Shift+5" icon={Strikethrough} onClick={() => handleCommand("strikeThrough")} />
                    <ViewMenuItem label="Superscript" shortcut="Ctrl+." icon={SuperscriptIcon} onClick={() => handleCommand("superscript")} />
                    <ViewMenuItem label="Subscript" shortcut="Ctrl+," icon={SubscriptIcon} onClick={() => handleCommand("subscript")} />
                  </SubmenuPanel>
                }
              />
              <ViewMenuItem
                label="Paragraph styles"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-para")}
                onClick={() => setOpenSubmenu((p) => (p === "format-para" ? null : "format-para"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-para"}
                submenu={
                  <SubmenuPanel className="w-[220px]">
                    <ViewMenuItem label="Normal text" onClick={() => { handleCommand("formatBlock", "p"); setCurrentParagraphStyle("Normal text"); }} />
                    <ViewMenuItem label="Heading 1" onClick={() => { handleCommand("formatBlock", "h1"); setCurrentParagraphStyle("Heading 1"); }} />
                    <ViewMenuItem label="Heading 2" onClick={() => { handleCommand("formatBlock", "h2"); setCurrentParagraphStyle("Heading 2"); }} />
                    <ViewMenuItem label="Heading 3" onClick={() => { handleCommand("formatBlock", "h3"); setCurrentParagraphStyle("Heading 3"); }} />
                  </SubmenuPanel>
                }
              />
              <ViewMenuItem
                label="Align & indent"
                icon={AlignLeft}
                hasSubmenu
                onHover={() => setOpenSubmenu("format-align")}
                onClick={() => setOpenSubmenu((p) => (p === "format-align" ? null : "format-align"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-align"}
                submenu={
                  <SubmenuPanel className="w-[220px]">
                    <ViewMenuItem label="Left" icon={AlignLeft} onClick={() => handleCommand("justifyLeft")} />
                    <ViewMenuItem label="Center" icon={AlignCenter} onClick={() => handleCommand("justifyCenter")} />
                    <ViewMenuItem label="Right" icon={AlignRight} onClick={() => handleCommand("justifyRight")} />
                    <ViewMenuItem label="Justify" icon={AlignJustify} onClick={() => handleCommand("justifyFull")} />
                    <ViewMenuDivider />
                    <ViewMenuItem label="Increase indent" icon={IndentIncrease} onClick={() => handleCommand("indent")} />
                    <ViewMenuItem label="Decrease indent" icon={IndentDecrease} onClick={() => handleCommand("outdent")} />
                  </SubmenuPanel>
                }
              />
              <ViewMenuItem
                label="Line & paragraph spacing"
                icon={ChevronsUpDown}
                hasSubmenu
                onHover={() => setOpenSubmenu("format-spacing")}
                onClick={() => setOpenSubmenu((p) => (p === "format-spacing" ? null : "format-spacing"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-spacing"}
                submenu={
                  <SubmenuPanel className="w-[200px]">
                    {[...LINE_SPACINGS, { value: 2.5, label: "2.5" }, { value: 3.0, label: "3.0" }].map((ls) => (
                      <ViewMenuItem key={ls.value} label={ls.label} onClick={() => handleLineSpacingChange(ls.value)} />
                    ))}
                  </SubmenuPanel>
                }
              />
              <ViewMenuItem label="Columns" onClick={() => showToast("Columns: coming soon")} />
              <ViewMenuItem
                label="Lists"
                icon={List}
                hasSubmenu
                onHover={() => setOpenSubmenu("format-lists")}
                onClick={() => setOpenSubmenu((p) => (p === "format-lists" ? null : "format-lists"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-lists"}
                submenu={
                  <SubmenuPanel className="w-[200px]">
                    <ViewMenuItem label="Bulleted list" icon={List} onClick={() => handleCommand("insertUnorderedList")} />
                    <ViewMenuItem label="Numbered list" icon={ListOrdered} onClick={() => handleCommand("insertOrderedList")} />
                    <ViewMenuItem label="Checklist" icon={ListChecks} onClick={() => { focusEditor(); exec("insertHTML", '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><input type="checkbox" style="margin-top:3px;cursor:pointer;" /><span>Item</span></div>'); emitChange(); }} />
                  </SubmenuPanel>
                }
              />
              <ViewMenuDivider />
              <ViewMenuItem label="Clear formatting" shortcut="Ctrl+\\" icon={RemoveFormatting} onClick={() => { focusEditor(); exec("removeFormat"); emitChange(); }} />
            </ViewMenuPanel>
          </MenuRoot>

          {/* Tools menu */}
          <MenuRoot id="tools" label="Tools" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <ViewMenuPanel>
              <ViewMenuItem label="Spelling & grammar" icon={SpellCheck} onClick={() => showToast("Spell check: browser-native spellcheck is active")} />
              <ViewMenuItem label="Word count" onClick={() => {
                const text = pageRefs.current.map((el) => el?.textContent || "").join(" ");
                const words = text.trim().split(/\s+/).filter(Boolean).length;
                const chars = text.length;
                showToast(`Words: ${words} | Characters: ${chars}`);
              }} />
              <ViewMenuItem label="Translate document" onClick={() => showToast("Translate: use File > Language to switch languages")} />
              <ViewMenuItem label="Voice typing" onClick={() => showToast("Voice typing: requires Web Speech API integration")} />
              <ViewMenuDivider />
              <ViewMenuItem label="Preferences" onClick={() => showToast("Preferences dialog: coming soon")} />
            </ViewMenuPanel>
          </MenuRoot>

          {/* Extensions menu */}
          <MenuRoot id="extensions" label="Extensions" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <ViewMenuPanel>
              <ViewMenuItem label="Add-ons" icon={Package} onClick={() => showToast("Add-ons marketplace: coming soon")} />
              <ViewMenuItem label="Apps Script" onClick={() => showToast("Apps Script: coming soon")} />
            </ViewMenuPanel>
          </MenuRoot>

          {/* Help menu */}
          <MenuRoot id="help" label="Help" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <ViewMenuPanel>
              <ViewMenuItem label="Search the menus" icon={Search} onClick={() => showToast("Menu search: coming soon")} />
              <ViewMenuItem label="Keyboard shortcuts" shortcut="Ctrl+/" onClick={() => showToast("Keyboard shortcuts dialog: coming soon")} />
              <ViewMenuDivider />
              <ViewMenuItem label="Report an issue" onClick={() => showToast("Report issue: coming soon")} />
            </ViewMenuPanel>
          </MenuRoot>
        </div>
      </div>
      )}

      {/* Templates moved inside page content area */}

      {/* Toolbar — Google Docs order */}
      {!isChromeCollapsed && (
      <div data-doc-toolbar className="px-1.5 sm:px-3 pt-1.5 sm:pt-2 pb-1 sm:pb-1.5 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10">
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Search */}
          <ToolbarButton disabled={false} onClick={() => setDialog("findReplace")} title="Search" Icon={Search} />
          <ToolbarDivider />

          {/* Undo / Redo */}
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("undo")} title="Undo (Ctrl+Z)" Icon={Undo2} />
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("redo")} title="Redo (Ctrl+Y)" Icon={Redo2} />
          <ToolbarDivider />

          {/* Print */}
          <ToolbarButton disabled={false} onClick={() => window.print()} title="Print (Ctrl+P)" Icon={Printer} />
          <ToolbarDivider />

          {/* Spell check */}
          <ToolbarButton disabled={false} onClick={() => showToast("Spell check: browser-native spellcheck is active")} title="Spelling and grammar check" Icon={SpellCheck} />
          <ToolbarDivider />

          {/* Paint format */}
          <ToolbarButton disabled={!canEdit} onClick={() => showToast("Format painter: select text, then click destination")} title="Paint format" Icon={Paintbrush} />
          <ToolbarDivider />

          {/* Zoom */}
          <ToolbarDropdown
            label={`${zoomLevel}%`}
            title="Zoom"
            isOpen={zoomOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setZoomOpen(!zoomOpen); }}
            width="w-[120px]"
          >
            <div className="py-1">
              {[50, 75, 100, 125, 150, 200].map((z) => (
                <button key={z} type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setZoomLevel(z); setZoomOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${z === zoomLevel ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >{z}%</button>
              ))}
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Paragraph style ("Normal text") */}
          <ToolbarDropdown
            label={currentParagraphStyle}
            title="Styles"
            isOpen={paragraphStyleOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setParagraphStyleOpen(!paragraphStyleOpen); }}
            disabled={!canEdit}
            width="w-[200px]"
          >
            <div className="py-1">
              {[
                { label: "Normal text", tag: "p", cls: "text-[13px]" },
                { label: "Heading 1", tag: "h1", cls: "text-[22px] font-bold" },
                { label: "Heading 2", tag: "h2", cls: "text-[18px] font-bold" },
                { label: "Heading 3", tag: "h3", cls: "text-[15px] font-bold" },
                { label: "Title", tag: "h1", cls: "text-[26px] font-normal" },
                { label: "Subtitle", tag: "h2", cls: "text-[14px] font-normal text-gray-500" },
              ].map((s) => (
                <button key={s.label} type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { handleCommand("formatBlock", s.tag); setCurrentParagraphStyle(s.label); setParagraphStyleOpen(false); }}
                  className={`w-full px-3 py-2 text-left ${s.cls} transition-colors cursor-pointer ${currentParagraphStyle === s.label ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >{s.label}</button>
              ))}
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Font Family */}
          <ToolbarDropdown
            label={currentFontFamily}
            title="Font family"
            isOpen={fontFamilyOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setFontFamilyOpen(!fontFamilyOpen); }}
            disabled={!canEdit}
            width="w-[240px]"
          >
            <div className="p-2 max-h-[320px] overflow-y-auto space-y-2">
              {FONT_FAMILY_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 sticky top-0 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] py-0.5 z-10">{cat.label}</div>
                  {cat.fonts.map((f) => (
                    <button key={f} type="button" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { handleFontFamilyChange(f); setFontFamilyOpen(false); }}
                      style={{ fontFamily: `${f}, system-ui, sans-serif` }}
                      className={`w-full px-2 py-1.5 text-left text-[12px] rounded-lg truncate transition-colors cursor-pointer ${f === currentFontFamily ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >{f}</button>
                  ))}
                </div>
              ))}
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Font Size with −/+ buttons */}
          <Tooltip content="Decrease font size" delay={400}>
            <button type="button" disabled={!canEdit}
              onMouseDown={(e) => { if (!canEdit) return; e.preventDefault(); }}
              onClick={() => { const ns = Math.max(1, currentFontSize - 1); handleFontSizeChange(ns); }}
              className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </Tooltip>
          <ToolbarDropdown
            label={`${currentFontSize}`}
            title="Font size"
            isOpen={fontSizeOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setFontSizeOpen(!fontSizeOpen); }}
            disabled={!canEdit}
            width="w-[100px]"
          >
            <div className="py-1">
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map((s) => (
                <button key={s} type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { handleFontSizeChange(s); setFontSizeOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${s === currentFontSize ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >{s}</button>
              ))}
              <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700 px-2 pb-1">
                <input type="number" min={6} max={120} placeholder="Custom…"
                  className="w-full px-2 py-1 text-[11px] rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none"
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = parseInt(e.currentTarget.value);
                      if (v >= 6 && v <= 120) { handleFontSizeChange(v); setFontSizeOpen(false); }
                    }
                  }}
                />
              </div>
            </div>
          </ToolbarDropdown>
          <Tooltip content="Increase font size" delay={400}>
            <button type="button" disabled={!canEdit}
              onMouseDown={(e) => { if (!canEdit) return; e.preventDefault(); }}
              onClick={() => { const ns = Math.min(400, currentFontSize + 1); handleFontSizeChange(ns); }}
              className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </Tooltip>
          <ToolbarDivider />

          {/* Bold / Italic / Underline */}
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("bold")} title="Bold (Ctrl+B)" Icon={Bold} />
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("italic")} title="Italic (Ctrl+I)" Icon={Italic} />
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("underline")} title="Underline (Ctrl+U)" Icon={Underline} />
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("strikeThrough")} title="Strikethrough (Alt+Shift+5)" Icon={Strikethrough} />
          <ToolbarDivider />

          {/* Text Color */}
          <ToolbarDropdown
            title="Text color"
            Icon={Baseline}
            isOpen={textColorOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setTextColorOpen(!textColorOpen); }}
            disabled={!canEdit}
            width="w-[280px]"
          >
            <div className="p-3">
              <TabbedColorPalette
                solidColors={TEXT_COLORS_MATRIX.flat()}
                gradientColors={TEXT_GRADIENT_COLORS}
                selectedColor=""
                onSelect={(c) => {
                  focusEditor();
                  if (c.startsWith("gradient:")) {
                    const css = colorToCSS(c);
                    exec("insertHTML", `<span style="background:${css};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${window.getSelection()?.toString() || ""}</span>`);
                  } else {
                    exec("foreColor", c);
                  }
                  emitChange();
                  if (!isNativeColorPickerOpen()) setTextColorOpen(false);
                }}
                columns={10}
                showCustomHex
              />
            </div>
          </ToolbarDropdown>

          {/* Highlight Color */}
          <ToolbarDropdown
            title="Highlight color"
            Icon={Highlighter}
            isOpen={highlightOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setHighlightOpen(!highlightOpen); }}
            disabled={!canEdit}
            width="w-[280px]"
          >
            <div className="p-3">
              <TabbedColorPalette
                solidColors={TEXT_COLORS_MATRIX.flat()}
                gradientColors={[]}
                selectedColor=""
                onSelect={(c) => {
                  focusEditor();
                  exec("hiliteColor", c);
                  emitChange();
                  if (!isNativeColorPickerOpen()) setHighlightOpen(false);
                }}
                columns={10}
                showCustomHex
              />
              <button type="button"
                onClick={() => { focusEditor(); exec("hiliteColor", "transparent"); emitChange(); setHighlightOpen(false); }}
                className="mt-2 w-full text-center text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >Remove highlight</button>
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton disabled={!canEdit} onClick={() => { const url = window.prompt("Enter URL"); if (!url) return; handleCommand("createLink", url); }} title="Insert link (Ctrl+K)" Icon={Link2} />

          {/* Add comment */}
          <ToolbarButton disabled={false} onClick={handleAddCommentFromSelection} title="Add comment (Ctrl+Alt+M)" Icon={MessageSquarePlus} />

          {/* Insert image */}
          <ToolbarButton disabled={!canEdit} onClick={() => { saveEditorSelection(); imageInputRef.current?.click(); }} title="Insert image" Icon={ImageIcon} />
          <ToolbarDivider />

          {/* ── Desktop: show alignment/spacing/lists/indent/clear inline ── */}
          <div className="hidden lg:contents">
          {/* Alignment dropdown */}
          <ToolbarDropdown
            title="Align & indent"
            Icon={currentAlignment === "center" ? AlignCenter : currentAlignment === "right" ? AlignRight : currentAlignment === "justify" ? AlignJustify : AlignLeft}
            isOpen={alignmentOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setAlignmentOpen(!alignmentOpen); }}
            disabled={!canEdit}
            width="w-[180px]"
          >
            <div className="py-1">
              {([
                { cmd: "justifyLeft", label: "Left", icon: AlignLeft, key: "left" as const },
                { cmd: "justifyCenter", label: "Center", icon: AlignCenter, key: "center" as const },
                { cmd: "justifyRight", label: "Right", icon: AlignRight, key: "right" as const },
                { cmd: "justifyFull", label: "Justify", icon: AlignJustify, key: "justify" as const },
              ]).map((item) => (
                <button key={item.key} type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { handleCommand(item.cmd); setCurrentAlignment(item.key); setAlignmentOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${currentAlignment === item.key ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-200"}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {currentAlignment === item.key && <Check className="w-3.5 h-3.5 ml-auto" />}
                </button>
              ))}
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Line Spacing */}
          <ToolbarDropdown
            title="Line & paragraph spacing"
            Icon={ChevronsUpDown}
            isOpen={lineSpacingOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setLineSpacingOpen(!lineSpacingOpen); }}
            disabled={!canEdit}
            width="w-[160px]"
          >
            <div className="py-1">
              {[...LINE_SPACINGS, { value: 2.5, label: "2.5" }, { value: 3.0, label: "3.0" }].map((ls) => (
                <button key={ls.value} type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { handleLineSpacingChange(ls.value); setLineSpacingOpen(false); }}
                  className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >{ls.label}</button>
              ))}
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Lists dropdown */}
          <ToolbarDropdown
            title="Lists"
            Icon={List}
            isOpen={listStyleOpen}
            onToggle={() => { closeAllToolbarDropdowns(); setListStyleOpen(!listStyleOpen); }}
            disabled={!canEdit}
            width="w-[220px]"
          >
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bullet list</div>
              <div className="grid grid-cols-3 gap-0.5 px-2 pb-1">
                {([
                  { type: "disc", icon: <Circle className="w-2 h-2 fill-current" />, label: "Disc" },
                  { type: "circle", icon: <Circle className="w-2 h-2" />, label: "Circle" },
                  { type: "square", icon: <Square className="w-2 h-2 fill-current" />, label: "Square" },
                ]).map((style) => (
                  <button key={style.type} type="button" onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      focusEditor();
                      exec("insertUnorderedList");
                      const sel = window.getSelection();
                      if (sel?.anchorNode) {
                        let el: HTMLElement | null = sel.anchorNode as HTMLElement;
                        while (el && el.tagName !== "UL") el = el.parentElement;
                        if (el) (el as HTMLElement).style.listStyleType = style.type;
                      }
                      emitChange();
                      setListStyleOpen(false);
                    }}
                    title={style.label}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
                  >
                    <div className="w-8 h-8 flex flex-col items-start justify-center gap-0.5 border border-gray-200 dark:border-gray-600 rounded-md p-1.5">
                      <div className="flex items-center gap-1"><span className="flex-shrink-0">{style.icon}</span><div className="h-[2px] w-4 bg-gray-300 dark:bg-gray-500 rounded-full" /></div>
                      <div className="flex items-center gap-1"><span className="flex-shrink-0">{style.icon}</span><div className="h-[2px] w-3 bg-gray-300 dark:bg-gray-500 rounded-full" /></div>
                      <div className="flex items-center gap-1"><span className="flex-shrink-0">{style.icon}</span><div className="h-[2px] w-5 bg-gray-300 dark:bg-gray-500 rounded-full" /></div>
                    </div>
                    <span className="text-[10px]">{style.label}</span>
                  </button>
                ))}
              </div>
              <div className="mx-2 border-t border-gray-100 dark:border-gray-700" />
              <div className="px-3 py-1 mt-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Numbered list</div>
              <div className="grid grid-cols-3 gap-0.5 px-2 pb-1">
                {([
                  { type: "decimal", display: ["1.", "2.", "3."], label: "Numbers" },
                  { type: "lower-alpha", display: ["a.", "b.", "c."], label: "Lowercase" },
                  { type: "upper-alpha", display: ["A.", "B.", "C."], label: "Uppercase" },
                ]).map((style) => (
                  <button key={style.type} type="button" onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      focusEditor();
                      exec("insertOrderedList");
                      const sel = window.getSelection();
                      if (sel?.anchorNode) {
                        let el: HTMLElement | null = sel.anchorNode as HTMLElement;
                        while (el && el.tagName !== "OL") el = el.parentElement;
                        if (el) (el as HTMLElement).style.listStyleType = style.type;
                      }
                      emitChange();
                      setListStyleOpen(false);
                    }}
                    title={style.label}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
                  >
                    <div className="w-8 h-8 flex flex-col items-start justify-center gap-0.5 border border-gray-200 dark:border-gray-600 rounded-md p-1.5">
                      {style.display.map((d, i) => (
                        <div key={i} className="flex items-center gap-1"><span className="text-[6px] font-medium leading-none">{d}</span><div className={`h-[2px] ${i === 1 ? "w-3" : i === 2 ? "w-5" : "w-4"} bg-gray-300 dark:bg-gray-500 rounded-full`} /></div>
                      ))}
                    </div>
                    <span className="text-[10px]">{style.label}</span>
                  </button>
                ))}
              </div>
              <div className="mx-2 border-t border-gray-100 dark:border-gray-700" />
              <div className="px-3 py-1 mt-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Other</div>
              <button type="button" onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  focusEditor();
                  exec("insertHTML", '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><input type="checkbox" style="margin-top:3px;cursor:pointer;" /><span>Item</span></div>');
                  emitChange();
                  setListStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-[12px] flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <ListChecks className="w-4 h-4" />
                <span>Checklist</span>
              </button>
            </div>
          </ToolbarDropdown>
          <ToolbarDivider />

          {/* Indent / Outdent */}
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("outdent")} title="Decrease indent" Icon={IndentDecrease} />
          <ToolbarButton disabled={!canEdit} onClick={() => handleCommand("indent")} title="Increase indent" Icon={IndentIncrease} />
          <ToolbarDivider />

          {/* Clear formatting */}
          <ToolbarButton disabled={!canEdit} onClick={() => { focusEditor(); exec("removeFormat"); emitChange(); }} title="Clear formatting" Icon={RemoveFormatting} />
          </div>

          {/* ── Mobile/Tablet: "More" overflow dropdown ── */}
          <div className="relative flex lg:hidden">
            <Tooltip content="More formatting options" delay={400}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { closeAllToolbarDropdowns(); setMoreToolbarOpen(!moreToolbarOpen); }}
                className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Ellipsis className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            {moreToolbarOpen && (
              <div
                data-doc-menu-panel
                className="absolute right-0 top-full mt-1 z-[120] w-[220px] rounded-2xl overflow-hidden bg-white/80 dark:bg-[#121212]/80 midnight:bg-[#0b1220]/80 purple:bg-[#1a0d2e]/80 backdrop-blur-[20px] backdrop-saturate-[180%] border border-gray-300/60 dark:border-gray-600/50 midnight:border-cyan-400/20 purple:border-pink-400/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_12px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_12px_24px_-4px_rgba(0,0,0,0.4)] py-1.5"
              >
                {/* Alignment */}
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Alignment</div>
                <div className="flex items-center gap-0.5 px-2 pb-1">
                  {([
                    { cmd: "justifyLeft", icon: AlignLeft, label: "Left" },
                    { cmd: "justifyCenter", icon: AlignCenter, label: "Center" },
                    { cmd: "justifyRight", icon: AlignRight, label: "Right" },
                    { cmd: "justifyFull", icon: AlignJustify, label: "Justify" },
                  ] as const).map((item) => (
                    <button key={item.cmd} type="button" title={item.label}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { handleCommand(item.cmd); setMoreToolbarOpen(false); }}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
                    >
                      <item.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <div className="my-1 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 to-transparent" />
                {/* Spacing */}
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Spacing</div>
                <div className="flex items-center gap-0.5 px-2 pb-1">
                  {[1.0, 1.15, 1.5, 2.0].map((v) => (
                    <button key={v} type="button" title={`${v} spacing`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { handleLineSpacingChange(v); setMoreToolbarOpen(false); }}
                      className="px-2 h-8 rounded-lg text-[11px] font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
                    >{v}</button>
                  ))}
                </div>
                <div className="my-1 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 to-transparent" />
                {/* Lists & indent */}
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Lists & indent</div>
                <div className="flex items-center gap-0.5 px-2 pb-1">
                  <button type="button" title="Bulleted list" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleCommand("insertUnorderedList"); setMoreToolbarOpen(false); }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"><List className="w-4 h-4" /></button>
                  <button type="button" title="Numbered list" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleCommand("insertOrderedList"); setMoreToolbarOpen(false); }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"><ListOrdered className="w-4 h-4" /></button>
                  <button type="button" title="Decrease indent" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleCommand("outdent"); setMoreToolbarOpen(false); }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"><IndentDecrease className="w-4 h-4" /></button>
                  <button type="button" title="Increase indent" onMouseDown={(e) => e.preventDefault()} onClick={() => { handleCommand("indent"); setMoreToolbarOpen(false); }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"><IndentIncrease className="w-4 h-4" /></button>
                </div>
                <div className="my-1 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 to-transparent" />
                {/* Clear formatting */}
                <button type="button" onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { focusEditor(); exec("removeFormat"); emitChange(); setMoreToolbarOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 min-h-[40px] text-left text-[13px] text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RemoveFormatting className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Clear formatting</span>
                </button>
              </div>
            )}
          </div>

          {/* Spacer to push editing mode to right */}
          <div className="flex-1" />

          {/* Editing mode indicator */}
          <EditingModeButton docMode={docMode} onModeChange={(mode) => { setDocMode(mode); showToast(`Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`); }} />

          {/* Toolbar collapse chevron */}
          <Tooltip content="Hide the menus (Ctrl+Shift+F)" delay={400}>
            <button type="button"
              onClick={() => setIsChromeCollapsed(true)}
              className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
          </Tooltip>
        </div>
      </div>
      )}

      {/* Toolbar restore — show when collapsed */}
      {isChromeCollapsed && !isFullscreen && (
        <div data-doc-toolbar-restore className="px-3 py-0.5 flex justify-end border-b border-gray-200 dark:border-gray-800">
          <Tooltip content="Show the menus (Ctrl+Shift+F)" delay={400}>
            <button type="button" onClick={() => setIsChromeCollapsed(false)}
              className="w-7 h-5 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Main content: sidebar + page surface */}
      <div ref={contentAreaRef} className="flex flex-1 min-h-0 relative">
        {/* Sidebar expand button — shown when sidebar is collapsed */}
        {!isFullscreen && isSidebarCollapsed && (
          <div className="flex-shrink-0 flex flex-col items-center pt-3 px-1">
            <Tooltip content="Show sidebar" delay={400}>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </Tooltip>
          </div>
        )}
        {/* Left sidebar — Document tabs & outline */}
        {!isFullscreen && !isSidebarCollapsed && (
          <>
          {/* Mobile backdrop overlay */}
          <div data-doc-sidebar-backdrop className="absolute inset-0 bg-black/20 z-[90] md:hidden" onClick={() => setIsSidebarCollapsed(true)} />
          <div className="w-[260px] flex-shrink-0 absolute md:relative z-[100] md:z-auto h-full md:h-auto border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] overflow-y-auto" data-doc-sidebar onClick={() => setTabMenuOpenId(null)}>
            <div className="p-3">
              {/* Back arrow — collapses sidebar only */}
              <Tooltip content="Close sidebar" delay={400}>
                <button type="button" onClick={() => setIsSidebarCollapsed(true)} className="mb-3 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </Tooltip>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">Document tabs</span>
                <Tooltip content="Add tab" delay={400}>
                  <button type="button" onClick={handleCreateTab} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </Tooltip>
              </div>
              {/* Tab list */}
              <div className="space-y-1 mb-4">
                {sidebarTabs.map((tab) => (
                  <div key={tab.id} className="relative">
                    <div
                      onClick={() => handleSwitchTab(tab.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        tab.id === activeTabId
                          ? "bg-blue-50/80 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <FileText className={`w-4 h-4 flex-shrink-0 ${tab.id === activeTabId ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                      {renamingTabId === tab.id ? (
                        <input
                          autoFocus
                          defaultValue={tab.name}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => {
                            const newName = e.target.value.trim() || tab.name;
                            setSidebarTabs((prev) => prev.map((t) => t.id === tab.id ? { ...t, name: newName } : t));
                            setRenamingTabId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const newName = (e.target as HTMLInputElement).value.trim() || tab.name;
                              setSidebarTabs((prev) => prev.map((t) => t.id === tab.id ? { ...t, name: newName } : t));
                              setRenamingTabId(null);
                            }
                            if (e.key === "Escape") setRenamingTabId(null);
                          }}
                          className="flex-1 text-[12px] font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-400 rounded px-1 py-0 outline-none min-w-0"
                        />
                      ) : (
                        <span
                          className="flex-1 text-[12px] font-medium text-gray-700 dark:text-gray-200 truncate"
                          onDoubleClick={(e) => { e.stopPropagation(); setRenamingTabId(tab.id); }}
                        >{tab.name}</span>
                      )}
                      <Tooltip content="More options" delay={400}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setTabMenuOpenId(tabMenuOpenId === tab.id ? null : tab.id); }}
                          className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex-shrink-0"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </Tooltip>
                    </div>
                    {/* Tab context menu — positioned below the tab */}
                    {tabMenuOpenId === tab.id && (
                      <div
                        className="absolute right-0 top-full mt-1 z-50 w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button type="button" onClick={() => { setRenamingTabId(tab.id); setTabMenuOpenId(null); }}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">Rename</button>
                        <button type="button" onClick={() => handleDuplicateTab(tab.id)}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">Duplicate</button>
                        <button type="button" onClick={() => handleDeleteTab(tab.id)}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Outline: shown when document has headings AND showOutline is enabled */}
              {showOutline && sidebarHeadings.length > 0 && (
                <div data-doc-outline-panel className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Outline</span>
                  <div className="mt-2 space-y-0.5">
                    {sidebarHeadings.map((h, i) => (
                      <button key={`${h.id}-${i}`} type="button"
                        onClick={() => {
                          const root = editorRootRef.current;
                          if (!root) return;
                          const el = root.querySelector(`#${CSS.escape(h.id)}`) || root.querySelectorAll(`h${h.level}`)[i];
                          if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); }
                        }}
                        className="w-full text-left px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                        style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
                        title={h.text}
                      >
                        <span className="text-[11px] text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">{h.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {/* Page surface — shifts left when comments/image-search sidebar is open */}
        <div
          ref={scrollContainerRef}
          className={[
            "flex-1 min-h-0 overflow-auto transition-[margin] duration-300 ease-in-out",
            isFullscreen ? "px-0 pb-0" : "px-1 sm:px-2 md:px-4 pb-2 sm:pb-4",
            !isFullscreen && showComments ? "mr-[356px] max-md:mr-0" : "",
            !isFullscreen && showImageSearchSidebar && !showComments ? "mr-[356px] max-md:mr-0" : "",
          ].join(" ")}
          onDragOver={handleEditorDragOver}
          onDragEnter={handleEditorDragEnter}
          onDragLeave={handleEditorDragLeave}
          onDrop={handleEditorDrop}
        >
          {!isFullscreen && showEquationToolbar && (
            <div data-doc-equation-toolbar className="mx-auto w-full max-w-[860px] mb-2 px-2">
              <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/70 dark:bg-gray-900/60 midnight:bg-[#0b1220] purple:bg-[#170a27] backdrop-blur-sm">
                <Sigma className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  placeholder="Insert equation (LaTeX/plain)…"
                  className="flex-1 px-2 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const v = (e.currentTarget.value || "").trim();
                    if (!v) return;
                    exec("insertHTML", `<span style="font-family:ui-monospace, monospace;padding:2px 6px;border-radius:8px;background:#f3f4f6;border:1px solid #e5e7eb;">${v}</span>&nbsp;`);
                    emitChange();
                    const el = e.currentTarget;
                    if (el) el.value = "";
                  }}
                />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">Enter</span>
              </div>
            </div>
          )}
          {!isFullscreen && showRuler && (
            <div data-doc-ruler-container className="mx-auto w-full mb-1 mt-1" style={{ maxWidth: pageWidthPx }}>
              <div className="h-7 rounded-sm border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white dark:bg-gray-900/60 midnight:bg-[#0b1220] purple:bg-[#170a27] relative overflow-hidden select-none">
                {/* Ruler tick marks */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${pageWidthPx} 28`}>
                  {Array.from({ length: Math.ceil((pageWidthPx - marginLeftPx - marginRightPx) / 96) + 1 }, (_, i) => {
                    const x = marginLeftPx + i * 96;
                    return (
                      <g key={i}>
                        <line x1={x} y1="14" x2={x} y2="28" stroke="#9ca3af" strokeWidth="1" />
                        <text x={x} y="11" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">{i}</text>
                        {i < Math.ceil((pageWidthPx - marginLeftPx - marginRightPx) / 96) && (
                          <line x1={x + 48} y1="20" x2={x + 48} y2="28" stroke="#d1d5db" strokeWidth="0.5" />
                        )}
                        {[24, 72].map((offset) => {
                          const qx = x + offset;
                          if (qx >= pageWidthPx) return null;
                          return <line key={offset} x1={qx} y1="23" x2={qx} y2="28" stroke="#e5e7eb" strokeWidth="0.5" />;
                        })}
                      </g>
                    );
                  })}
                </svg>
                {/* Blue margin shading */}
                <div className="absolute top-0 h-full bg-blue-100/30 dark:bg-blue-900/15" style={{ left: 0, width: marginLeftPx }} />
                <div className="absolute top-0 h-full bg-blue-100/30 dark:bg-blue-900/15" style={{ right: 0, width: marginRightPx }} />
                {/* Indent triangles */}
                <Tooltip content="Left indent" delay={400}><div className="absolute bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500 cursor-pointer" style={{ left: marginLeftPx - 5 }} /></Tooltip>
                <Tooltip content="Right indent" delay={400}><div className="absolute bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500 cursor-pointer" style={{ right: marginRightPx - 5 }} /></Tooltip>
              </div>
            </div>
          )}
          <div
            ref={editorRootRef}
            className={[
              "w-full",
              showPrintLayout
                ? "min-h-full py-3 sm:py-6 bg-gray-50 dark:bg-gray-950 midnight:bg-[#06101f] purple:bg-[#12061f]"
                : "min-h-full",
            ].join(" ")}
            style={zoomLevel !== 100 ? {
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top center",
              width: `${10000 / zoomLevel}%`,
            } : undefined}
          >
            {showPrintLayout ? (
              <div className="flex flex-col items-center gap-3 sm:gap-6">
                {(() => {
                  let flatIdx = 0;
                  return sectionInfos.map((sInfo, sIdx) => {
                    const dims = computeSectionDimensions(sInfo.pageSetup);
                    const sectionPages = pages.slice(flatIdx, flatIdx + sInfo.pageCount);
                    const startIdx = flatIdx;
                    flatIdx += sInfo.pageCount;
                    return sectionPages.map((html, pIdx) => {
                      const globalIdx = startIdx + pIdx;
                      return (
                        <div key={globalIdx} className="w-full flex flex-col items-center">
                          {/* Section break indicator */}
                          {sIdx > 0 && pIdx === 0 && (
                            <div data-doc-section-indicator className="w-full flex justify-center mb-3">
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 select-none" style={{ maxWidth: dims.pageWidthPx }}>
                                <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
                                <span>Section break</span>
                                <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
                              </div>
                            </div>
                          )}
                          <div
                            className={[
                              "w-full rounded-sm shadow-md relative",
                              sInfo.pageSetup.pageColor === "#ffffff"
                                ? "bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27]"
                                : "",
                              "border border-gray-200/80 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10",
                            ].join(" ")}
                            style={{
                              maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : dims.pageWidthPx,
                              ...(sInfo.pageSetup.pageColor !== "#ffffff" ? { backgroundColor: sInfo.pageSetup.pageColor } : {}),
                            }}
                          >
                            <div
                              contentEditable={canEdit}
                              suppressContentEditableWarning
                              ref={(el) => {
                                pageRefs.current[globalIdx] = el;
                                // Skip innerHTML reset during active image resize/crop drag (DOM is being modified directly)
                                if (isImageDraggingRef.current) return;
                                // Skip innerHTML reset if find/replace or comment highlights are active (they modify the DOM temporarily)
                                if (el && !el.querySelector("mark[data-doc-find-highlight]") && !el.querySelector("span[data-doc-comment-highlight]") && el.innerHTML !== html) el.innerHTML = html;
                              }}
                              className={[
                                "outline-none overflow-hidden relative z-0",
                                "text-[14px] leading-6 text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50",
                                "selection:bg-blue-200/60 dark:selection:bg-blue-500/25 midnight:selection:bg-cyan-500/20 purple:selection:bg-pink-500/20",
                                "[&_h2]:text-[20px] [&_h2]:leading-7 [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3",
                                "[&_h3]:text-[16px] [&_h3]:leading-6 [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2",
                                "[&_p]:my-2",
                                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3",
                                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3",
                                "[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline",
                                showNonPrinting ? "[&_p]:after:content-['¶'] [&_p]:after:opacity-20" : "",
                                canEdit ? "cursor-text" : "cursor-default",
                              ].join(" ")}
                              style={{
                                height: dims.pageHeightPx,
                                paddingTop: dims.marginTopPx,
                                paddingBottom: dims.marginBottomPx,
                                paddingLeft: isFullscreen ? 48 : dims.marginLeftPx,
                                paddingRight: isFullscreen ? 48 : dims.marginRightPx,
                              }}
                              data-placeholder={placeholder}
                              lang={language}
                              dir={getTextDirectionForLanguage(language)}
                              spellCheck={showSpellingSuggestions}
                              onInput={emitChange}
                              onBlur={emitChange}
                              onFocus={() => setActiveSectionIdx(sIdx)}
                            />
                            {/* Template chips overlay — inside page when empty, rendered after contentEditable so it paints on top */}
                            {globalIdx === 0 && hasTemplates && isDocEmpty && canEdit && (
                              <div className="absolute inset-x-0 top-16 flex justify-center gap-2 z-20 pointer-events-none">
                                {resolvedTemplates.slice(0, 2).map((tpl) => {
                                  const TplIcon = tpl.icon ?? FileText;
                                  return (
                                    <button key={tpl.id}
                                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleTemplateInsert(tpl); }}
                                      className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title={tpl.label}>
                                      <TplIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                      <span className="text-gray-700 dark:text-gray-200">{tpl.label}</span>
                                    </button>
                                  );
                                })}
                                {resolvedTemplates.length > 2 && (
                                  <button
                                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMoreOpen((v) => !v); }}
                                    className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="More templates">
                                    <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-gray-700 dark:text-gray-200">More</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div data-doc-page-label className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                            Page {globalIdx + 1}
                          </div>
                        </div>
                      );
                    });
                  });
                })()}
              </div>
            ) : (
              <div
                className={[
                  "mx-auto w-full rounded-sm shadow-sm border border-transparent py-4 sm:py-6 md:py-10 relative",
                  pageSetup.pageColor === "#ffffff"
                    ? "bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27]"
                    : "",
                ].join(" ")}
                style={{
                  maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : pageWidthPx,
                  paddingLeft: isFullscreen ? 48 : marginLeftPx,
                  paddingRight: isFullscreen ? 48 : marginRightPx,
                  ...(pageSetup.pageColor !== "#ffffff" ? { backgroundColor: pageSetup.pageColor } : {}),
                }}
              >
                <div
                  contentEditable={canEdit}
                  suppressContentEditableWarning
                  ref={(el) => {
                    pageRefs.current[0] = el;
                    // Skip innerHTML reset during active image resize/crop drag (DOM is being modified directly)
                    if (isImageDraggingRef.current) return;
                    // Skip innerHTML reset if find/replace highlights are active (they modify the DOM temporarily)
                    if (el && !el.querySelector("mark[data-doc-find-highlight]") && !el.querySelector("span[data-doc-comment-highlight]") && el.innerHTML !== (pages[0] || "")) el.innerHTML = pages[0] || "";
                  }}
                  className={[
                    "min-h-[520px] outline-none overflow-hidden relative z-0",
                    "text-[14px] leading-6 text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50",
                    "selection:bg-blue-200/60 dark:selection:bg-blue-500/25 midnight:selection:bg-cyan-500/20 purple:selection:bg-pink-500/20",
                    "[&_h2]:text-[20px] [&_h2]:leading-7 [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3",
                    "[&_h3]:text-[16px] [&_h3]:leading-6 [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2",
                    "[&_p]:my-2",
                    "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3",
                    "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3",
                    "[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline",
                    showNonPrinting ? "[&_p]:after:content-['¶'] [&_p]:after:opacity-20" : "",
                    canEdit ? "cursor-text" : "cursor-default",
                  ].join(" ")}
                  data-placeholder={placeholder}
                  lang={language}
                  dir={getTextDirectionForLanguage(language)}
                  spellCheck={showSpellingSuggestions}
                  onInput={emitChange}
                  onBlur={emitChange}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (!target.closest("[data-doc-comment-highlight]")) {
                      setActiveCommentId(null);
                    }
                  }}
                />
                {/* Template chips overlay — inside page when empty, rendered after contentEditable so it paints on top */}
                {hasTemplates && isDocEmpty && canEdit && (
                  <div className="absolute inset-x-0 top-16 flex justify-center gap-2 z-20 pointer-events-none">
                    {resolvedTemplates.slice(0, 2).map((tpl) => {
                      const TplIcon = tpl.icon ?? FileText;
                      return (
                        <button key={tpl.id}
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleTemplateInsert(tpl); }}
                          className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title={tpl.label}>
                          <TplIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-200">{tpl.label}</span>
                        </button>
                      );
                    })}
                    {resolvedTemplates.length > 2 && (
                      <button
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMoreOpen((v) => !v); }}
                        className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="More templates">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-200">More</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Placeholder overlay (pure CSS, shows only when empty) */}
            <style jsx>{`
              [contenteditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: rgba(107, 114, 128, 0.8);
              }
            `}</style>
            {/* Table widget styles — static preview in document */}
            <style jsx global>{`
              [data-doc-editor-root] button:not(:disabled),
              [data-doc-editor-root] [role="button"]:not(:disabled),
              [data-doc-editor-root] summary {
                cursor: pointer;
              }
              [data-doc-editor-root] button:disabled {
                cursor: not-allowed;
              }
              [data-doc-table-widget="true"] {
                cursor: pointer;
                border-radius: 4px;
                transition: outline 0.15s;
                max-width: 100%;
              }
              [data-doc-table-widget="true"]:hover {
                outline: 2px solid rgba(37, 99, 235, 0.25);
                outline-offset: 2px;
              }
              [data-doc-table-widget="true"][data-doc-table-widget-selected="true"] {
                outline: 2px solid rgba(37, 99, 235, 0.6);
                outline-offset: 2px;
              }
              /* Ensure empty paragraphs next to tables are clickable */
              [data-doc-table-widget="true"] + p:empty,
              [data-doc-table-widget="true"] + p:has(> br:only-child) {
                min-height: 1em;
              }
              [contenteditable="true"]::after {
                content: "";
                display: block;
                clear: both;
              }
              /* Responsive: reduce page margins on small screens */
              @media (max-width: 639px) {
                [data-doc-editor-root] [contenteditable] {
                  padding-left: 16px !important;
                  padding-right: 16px !important;
                }
              }
              @media (min-width: 640px) and (max-width: 767px) {
                [data-doc-editor-root] [contenteditable] {
                  padding-left: 24px !important;
                  padding-right: 24px !important;
                }
              }
              /* Utility: hide scrollbar (for horizontal-scroll elements) */
              .scrollbar-none {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>

      {/* ── Mode A: Floating individual comment cards in the right margin ── */}
      {!isFullscreen && showFloatingComments && !showComments && openComments.length > 0 && (
        <div
          data-doc-floating-comments
          className="flex-shrink-0 w-[280px] max-md:hidden overflow-y-auto"
        >
          <div className="p-3 space-y-3">
            {/* Header with dismiss */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Comments ({openComments.length})
              </span>
              <Tooltip content="Dismiss all" delay={300}>
                <button
                  type="button"
                  onClick={() => { setShowFloatingComments(false); setFloatingCommentsDismissed(true); }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="Dismiss all floating comments"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </Tooltip>
            </div>
            {/* Comment cards — sorted by text position */}
            {sortedOpenComments.map((comment) => (
              <FloatingCommentPill
                key={comment.id}
                comment={comment}
                isActive={activeCommentId === comment.id}
                onSelect={() => setActiveCommentId((prev) => prev === comment.id ? null : comment.id)}
                onScrollTo={() => setTimeout(() => scrollToComment(comment), 200)}
                onReply={(text) => addReply(comment.id, text, parseMentions(text))}
                onResolve={(msg) => resolveComment(comment.id, msg)}
                onReject={(msg) => rejectComment(comment.id, msg)}
                onReopen={() => reopenComment(comment.id)}
                onDelete={() => deleteComment(comment.id)}
                onOpenSidebar={() => { setShowComments(true); setSidebarManuallyDismissed(false); setActiveCommentId(comment.id); }}
                isOwner={commentAuthor.id === comment.author.id || commentAuthor.role === "admin"}
                mentionableUsers={mentionableUsers}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Collapsed floating comments pill — appears after user dismisses floating view ── */}
      {!isFullscreen && !showFloatingComments && !showComments && floatingCommentsDismissed && openComments.length > 0 && (
        <div className="flex-shrink-0 max-md:hidden flex items-start pt-4 pr-3">
          <Tooltip content="Show comments" delay={300}>
            <button
              type="button"
              onClick={() => { setFloatingCommentsDismissed(false); setShowFloatingComments(true); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors cursor-pointer shadow-sm border border-blue-200/50 dark:border-blue-700/50"
              aria-label="Show floating comments"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{openComments.length}</span>
            </button>
          </Tooltip>
        </div>
      )}

      {/* ── Image Loading Overlay ── */}
      {imageLoading && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/90 dark:bg-gray-900/90 midnight:bg-[#0d1526]/90 purple:bg-[#1f1035]/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">Inserting image…</span>
          </div>
        </div>
      )}

      {/* ── Insert Image by URL Modal ── */}
      {showImageUrlModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setShowImageUrlModal(false); setImageUrlInput(""); setImageUrlError(""); }}>
          <div
            data-doc-image-url-modal
            className="w-full max-w-[480px] mx-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Insert image by URL</h3>
              <button
                type="button"
                onClick={() => { setShowImageUrlModal(false); setImageUrlInput(""); setImageUrlError(""); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="image-url-input" className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">Paste an image URL</label>
                <input
                  id="image-url-input"
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => { setImageUrlInput(e.target.value); setImageUrlError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleInsertImageFromUrl(imageUrlInput); }}
                  placeholder="https://example.com/image.png"
                  className={[
                    "w-full px-3 py-2.5 rounded-xl text-[13px] outline-none transition-all",
                    "bg-gray-50 dark:bg-gray-800 midnight:bg-[#0b1220] purple:bg-[#170a27]",
                    "border",
                    imageUrlError
                      ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/20",
                    "text-gray-800 dark:text-gray-100 placeholder:text-gray-400",
                  ].join(" ")}
                  autoFocus
                />
                {imageUrlError && <p className="text-[11px] text-red-500 mt-1">{imageUrlError}</p>}
              </div>
              {/* URL preview */}
              {imageUrlInput.trim() && !imageUrlError && (() => { try { new URL(imageUrlInput); return true; } catch { return false; } })() && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 flex items-center justify-center min-h-[120px] max-h-[200px] overflow-hidden">
                  <img
                    src={imageUrlInput.trim()}
                    alt="Preview"
                    className="max-w-full max-h-[180px] rounded-lg object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => { setShowImageUrlModal(false); setImageUrlInput(""); setImageUrlError(""); }}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertImageFromUrl(imageUrlInput)}
                  disabled={!imageUrlInput.trim()}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Search Sidebar — pushes doc left like Comment Sidebar ── */}
      {!isFullscreen && showImageSearchSidebar && (
        <div
          data-doc-image-search-panel
          className="absolute right-0 top-0 bottom-0 z-[150] w-[340px] max-md:hidden border-l border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-xl shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50">Search the web</span>
            </div>
            <Tooltip content="Close image search" delay={200}>
              <button
                type="button"
                onClick={() => setShowImageSearchSidebar(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Close image search panel"
              >
                <PanelRightClose className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </Tooltip>
          </div>
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imageSearchQuery}
                onChange={(e) => setImageSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && imageSearchQuery.trim()) {
                    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageSearchQuery.trim())}`, "_blank");
                  }
                }}
                placeholder="Search Google Images…"
                className="flex-1 px-3 py-2 rounded-xl text-[13px] bg-gray-50 dark:bg-gray-800 midnight:bg-[#0b1220] purple:bg-[#170a27] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/20"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (imageSearchQuery.trim()) {
                    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageSearchQuery.trim())}`, "_blank");
                  }
                }}
                className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 px-3 py-2 overflow-y-auto">
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-3">Search for images, then paste the URL using &quot;By URL&quot; to insert.</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  saveEditorSelection();
                  setShowImageSearchSidebar(false);
                  setShowImageUrlModal(true);
                  setImageUrlInput("");
                  setImageUrlError("");
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <Link className="w-3.5 h-3.5" />
                Paste image URL
              </button>
              <button
                type="button"
                onClick={() => { saveEditorSelection(); setShowImageSearchSidebar(false); imageInputRef.current?.click(); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload from computer instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Glassmorphism Drop Zone Overlay — visible when dragging files over editor ── */}
      {isDragActive && (
        <div
          className="absolute inset-0 z-[200] flex items-center justify-center pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            className="flex flex-col items-center gap-3 px-10 py-8 rounded-2xl"
            style={{
              border: "2.5px dashed rgba(99,102,241,0.7)",
              animation: "drop-zone-pulse 1.5s ease-in-out infinite",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-semibold text-indigo-600">Drop image here</span>
          </div>
        </div>
      )}

      {/* ── Squircle Resize Handles — fixed to viewport so they scroll with the image ── */}
      {selectedImage && selectedImageRect && canEdit && !showCropOverlay && (() => {
        const imgTop = selectedImageRect.top;
        const imgLeft = selectedImageRect.left;
        const imgW = selectedImageRect.width;
        const imgH = selectedImageRect.height;
        const handleSize = 12;
        const half = handleSize / 2;
        // Corner + edge handle positions: [top, left, cursor]
        const handles: Array<[number, number, string, string]> = [
          [imgTop - half, imgLeft - half, "nw-resize", "nw"],
          [imgTop - half, imgLeft + imgW / 2 - half, "n-resize", "n"],
          [imgTop - half, imgLeft + imgW - half, "ne-resize", "ne"],
          [imgTop + imgH / 2 - half, imgLeft + imgW - half, "e-resize", "e"],
          [imgTop + imgH - half, imgLeft + imgW - half, "se-resize", "se"],
          [imgTop + imgH - half, imgLeft + imgW / 2 - half, "s-resize", "s"],
          [imgTop + imgH - half, imgLeft - half, "sw-resize", "sw"],
          [imgTop + imgH / 2 - half, imgLeft - half, "w-resize", "w"],
        ];
        return (
          <>
            {/* Selection outline — Electric Indigo pulsating glow */}
            <div
              className="fixed z-[158] pointer-events-none rounded-xl"
              style={{
                top: imgTop,
                left: imgLeft,
                width: imgW,
                height: imgH,
                border: "2px solid #6366f1",
                boxShadow: "0 0 0 2px rgba(99,102,241,0.25), 0 0 12px 2px rgba(99,102,241,0.15)",
                animation: "image-select-pulse 2s ease-in-out infinite",
              }}
            />
            {/* Squircle resize handles */}
            {handles.map(([t, l, cursor, hpos]) => (
              <div
                key={hpos}
                data-doc-resize-handle={hpos}
                className="fixed z-[159] bg-white dark:bg-gray-200 border-2 border-indigo-500 shadow-md hover:bg-indigo-100 hover:scale-125 transition-all duration-150"
                style={{
                  top: t,
                  left: l,
                  width: handleSize,
                  height: handleSize,
                  cursor,
                  borderRadius: 5,
                }}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isImageDraggingRef.current = true;
                  if (!selectedImage) return;
                  const startX = e.clientX;
                  const startY = e.clientY;

                  const startW = selectedImage.offsetWidth || selectedImage.naturalWidth;
                  const startH = selectedImage.offsetHeight || selectedImage.naturalHeight;
                  const aspectRatio = startW / startH;
                  const lockAspect = !e.shiftKey;

                  // Get page container width for snap-to-margin
                  const pageEl = selectedImage.closest("[data-placeholder]") as HTMLElement | null;
                  const pageWidth = pageEl ? pageEl.clientWidth : 0;

                  const onMouseMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dy = ev.clientY - startY;
                    let newW = startW;
                    let newH = startH;

                    if (hpos.includes("e")) newW = startW + dx;
                    if (hpos.includes("w")) newW = startW - dx;
                    if (hpos.includes("s")) newH = startH + dy;
                    if (hpos.includes("n")) newH = startH - dy;

                    newW = Math.max(20, newW);
                    newH = Math.max(20, newH);

                    // Snap to page width when within 12px
                    if (pageWidth > 0 && Math.abs(newW - pageWidth) < 12) {
                      newW = pageWidth;
                    }
                    // Snap to 50% page width
                    if (pageWidth > 0 && Math.abs(newW - pageWidth / 2) < 12) {
                      newW = pageWidth / 2;
                    }

                    if (lockAspect && !ev.shiftKey) {
                      if (hpos === "n" || hpos === "s") newW = newH * aspectRatio;
                      else newH = newW / aspectRatio;
                    }

                    selectedImage.style.width = `${Math.round(newW)}px`;
                    selectedImage.style.height = `${Math.round(newH)}px`;
                    setSelectedImageRect(selectedImage.getBoundingClientRect());
                    // Show dimension tooltip near cursor
                    setResizeDimensions({ w: Math.round(newW), h: Math.round(newH), x: ev.clientX, y: ev.clientY });
                  };
                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                    setResizeDimensions(null);
                    // Keep the flag set so the subsequent click event doesn't deselect
                    // It gets cleared in handleEditorImageClick
                    emitChange();
                  };
                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
              />
            ))}
            {/* Resize dimension tooltip — shows current size near cursor */}
            {resizeDimensions && (() => {
              return (
                <div
                  className="fixed z-[170] px-2.5 py-1 rounded-lg bg-gray-900/90 text-white text-[11px] font-mono font-medium pointer-events-none backdrop-blur-sm shadow-lg"
                  style={{
                    top: resizeDimensions.y + 18,
                    left: resizeDimensions.x + 12,
                  }}
                >
                  {resizeDimensions.w} × {resizeDimensions.h} px
                </div>
              );
            })()}
          </>
        );
      })()}

      {/* ── Image Contextual Toolbar — glassmorphism pill floating 10px above selected image ── */}
      {selectedImage && selectedImageRect && canEdit && (() => {
        const toolbarHeight = 44;
        const top = selectedImageRect.top - toolbarHeight - 10;
        const left = selectedImageRect.left + (selectedImageRect.width / 2) - 140;
        return (
          <div
            data-doc-image-toolbar
            className="fixed z-[160] flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-2xl shadow-2xl border border-indigo-200/60 dark:border-indigo-500/30 midnight:border-cyan-500/20 purple:border-pink-500/20"
            style={{
              top: Math.max(4, top),
              left: Math.max(8, left),
              animation: "image-toolbar-spring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Tooltip content="Image options" delay={200}>
              <button
                type="button"
                onClick={() => setShowImageOptions(true)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Image options"
              >
                <SlidersHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            <Tooltip content="Replace image" delay={200}>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = IMAGE_ACCEPT_ATTR;
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    // Use full validation + conversion pipeline (same as insert)
                    const validation = isValidImageFile(file);
                    if (!validation.valid) {
                      showToast(validation.reason || "Unsupported image format");
                      return;
                    }
                    try {
                      const dataUrl = await convertImageToWebSafe(file);
                      if (selectedImage) {
                        selectedImage.src = dataUrl;
                        selectedImage.alt = file.name;
                        emitChange();
                      }
                    } catch (err: unknown) {
                      const msg = err instanceof Error ? err.message : `Failed to load ${file.name}`;
                      showToast(msg);
                    }
                  };
                  input.click();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Replace image"
              >
                <Replace className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            <Tooltip content={showCropOverlay ? "Exit crop" : "Crop image"} delay={200}>
              <button
                type="button"
                onClick={() => {
                  if (showCropOverlay) {
                    setShowCropOverlay(false);
                    return;
                  }
                  if (selectedImage) {
                    // If image is already cropped, restore original for re-cropping
                    if (selectedImage.dataset.originalSrc) {
                      const prevCrop = {
                        top: parseFloat(selectedImage.dataset.cropTop || "0"),
                        left: parseFloat(selectedImage.dataset.cropLeft || "0"),
                        width: parseFloat(selectedImage.dataset.cropWidth || "100"),
                        height: parseFloat(selectedImage.dataset.cropHeight || "100"),
                      };
                      // Restore original image so user sees full image for re-cropping
                      removeCrop(selectedImage);
                      emitChange();
                      setTimeout(() => {
                        setSelectedImageRect(selectedImage.getBoundingClientRect());
                      }, 0);
                      setCropRect(prevCrop);
                    } else {
                      setCropRect({ top: 0, left: 0, width: 100, height: 100 });
                    }
                    setShowCropOverlay(true);
                  }
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${showCropOverlay ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                aria-label="Crop image"
              >
                <Crop className={`w-4 h-4 ${showCropOverlay ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300"}`} />
              </button>
            </Tooltip>
            {/* Undo crop button — only visible when image has an active crop wrapper */}
            {selectedImage?.dataset.originalSrc && !showCropOverlay && (
              <Tooltip content="Remove crop" delay={200}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedImage) {
                      removeCrop(selectedImage);
                      emitChange();
                      setSelectedImageRect(selectedImage.getBoundingClientRect());
                      showToast("Crop removed — image restored");
                    }
                  }}
                  className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Remove crop"
                >
                  <Undo2 className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Rotate 90°" delay={200}>
              <button
                type="button"
                onClick={() => {
                  if (selectedImage) {
                    const newRotation = (imageRotation + 90) % 360;
                    setImageRotation(newRotation);
                    selectedImage.style.transform = newRotation === 0 ? "" : `rotate(${newRotation}deg)`;
                    emitChange();
                    setSelectedImageRect(selectedImage.getBoundingClientRect());
                  }
                }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Rotate 90 degrees"
              >
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            <Tooltip content="Reset image" delay={200}>
              <button
                type="button"
                onClick={() => {
                  if (selectedImage) {
                    // Remove crop wrapper first if it exists
                    removeCrop(selectedImage);
                    selectedImage.style.filter = "";
                    selectedImage.style.opacity = "";
                    selectedImage.style.width = "";
                    selectedImage.style.height = "";
                    selectedImage.style.transform = "";
                    selectedImage.style.clipPath = "";
                    selectedImage.style.maxWidth = "100%";
                    setImageOptions({ opacity: 100, brightness: 100, contrast: 100 });
                    setImageRotation(0);
                    setShowCropOverlay(false);
                    emitChange();
                    setSelectedImageRect(selectedImage.getBoundingClientRect());
                    showToast("Image reset to original");
                  }
                }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Reset image"
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <Tooltip content="Delete image" delay={200}>
              <button
                type="button"
                onClick={() => {
                  if (selectedImage) {
                    // Find the block-level parent (<p>) that wraps the image
                    const blockParent = selectedImage.parentElement;
                    selectedImage.remove();
                    // Clean up empty parent <p> wrapper left behind
                    if (blockParent && blockParent.tagName === "P" && blockParent.childNodes.length === 0) {
                      blockParent.remove();
                    }
                    setSelectedImage(null);
                    setSelectedImageRect(null);
                    setShowImageOptions(false);
                    setShowCropOverlay(false);
                    emitChange();
                  }
                }}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                aria-label="Delete image"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </Tooltip>
          </div>
        );
      })()}

      {/* ── Crop Overlay — Google Docs style crop with 8 handles, grid, dark mask ── */}
      {showCropOverlay && selectedImage && selectedImageRect && canEdit && (() => {
        const imgTop = selectedImageRect.top;
        const imgLeft = selectedImageRect.left;
        const imgW = selectedImageRect.width;
        const imgH = selectedImageRect.height;
        // cropRect values are percentages (0-100) relative to the image
        const cTop = imgTop + (cropRect.top / 100) * imgH;
        const cLeft = imgLeft + (cropRect.left / 100) * imgW;
        const cW = (cropRect.width / 100) * imgW;
        const cH = (cropRect.height / 100) * imgH;
        const minCropPct = 8; // minimum crop size in percent

        // Handle drag for all 8 handles (4 corners + 4 edges)
        const onCropHandleMouseDown = (handle: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          isImageDraggingRef.current = true;
          const startX = e.clientX;
          const startY = e.clientY;
          const startCrop = { ...cropRect };

          const onMouseMove = (ev: MouseEvent) => {
            const dxPct = ((ev.clientX - startX) / imgW) * 100;
            const dyPct = ((ev.clientY - startY) / imgH) * 100;
            const next = { ...startCrop };

            if (handle.includes("n")) {
              const newTop = Math.max(0, Math.min(startCrop.top + startCrop.height - minCropPct, startCrop.top + dyPct));
              next.height = startCrop.height - (newTop - startCrop.top);
              next.top = newTop;
            }
            if (handle.includes("s")) {
              next.height = Math.max(minCropPct, Math.min(100 - startCrop.top, startCrop.height + dyPct));
            }
            if (handle.includes("w")) {
              const newLeft = Math.max(0, Math.min(startCrop.left + startCrop.width - minCropPct, startCrop.left + dxPct));
              next.width = startCrop.width - (newLeft - startCrop.left);
              next.left = newLeft;
            }
            if (handle.includes("e")) {
              next.width = Math.max(minCropPct, Math.min(100 - startCrop.left, startCrop.width + dxPct));
            }
            setCropRect(next);
          };
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        };

        // Handle drag to move the entire crop area
        const onCropAreaMouseDown = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          isImageDraggingRef.current = true;
          const startX = e.clientX;
          const startY = e.clientY;
          const startCrop = { ...cropRect };

          const onMouseMove = (ev: MouseEvent) => {
            const dxPct = ((ev.clientX - startX) / imgW) * 100;
            const dyPct = ((ev.clientY - startY) / imgH) * 100;
            const newLeft = Math.max(0, Math.min(100 - startCrop.width, startCrop.left + dxPct));
            const newTop = Math.max(0, Math.min(100 - startCrop.height, startCrop.top + dyPct));
            setCropRect({ ...startCrop, left: newLeft, top: newTop });
          };
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        };

        // Apply crop using canvas — draws the cropped region to a canvas, exports as dataURL
        const applyCrop = () => {
          if (!selectedImage) {
            setShowCropOverlay(false);
            return;
          }

          const isFullCrop = cropRect.top < 0.5 && cropRect.left < 0.5 && cropRect.width > 99.5 && cropRect.height > 99.5;
          if (isFullCrop) {
            // No actual crop — restore original if previously cropped
            if (selectedImage.dataset.originalSrc) {
              removeCrop(selectedImage);
              emitChange();
              setTimeout(() => setSelectedImageRect(selectedImage.getBoundingClientRect()), 0);
            }
            setShowCropOverlay(false);
            return;
          }

          // Use natural dimensions for pixel-accurate cropping
          const natW = selectedImage.naturalWidth;
          const natH = selectedImage.naturalHeight;
          if (!natW || !natH) {
            setShowCropOverlay(false);
            return;
          }

          // Calculate source region in natural pixels from percentage cropRect
          const sx = (cropRect.left / 100) * natW;
          const sy = (cropRect.top / 100) * natH;
          const sw = (cropRect.width / 100) * natW;
          const sh = (cropRect.height / 100) * natH;

          // Store original src for undo (only on first crop)
          if (!selectedImage.dataset.originalSrc) {
            selectedImage.dataset.originalSrc = selectedImage.src;
          }
          // Store pre-crop display dimensions (only on first crop)
          if (!selectedImage.dataset.preCropWidth) {
            selectedImage.dataset.preCropWidth = selectedImage.style.width || `${selectedImage.offsetWidth}px`;
            selectedImage.dataset.preCropHeight = selectedImage.style.height || `${selectedImage.offsetHeight}px`;
          }
          // Store crop percentages for re-crop UI
          selectedImage.dataset.cropTop = cropRect.top.toFixed(1);
          selectedImage.dataset.cropLeft = cropRect.left.toFixed(1);
          selectedImage.dataset.cropWidth = cropRect.width.toFixed(1);
          selectedImage.dataset.cropHeight = cropRect.height.toFixed(1);

          // Prevent innerHTML resets during async canvas work
          isImageDraggingRef.current = true;

          // Draw cropped region to canvas
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(sw);
          canvas.height = Math.round(sh);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            isImageDraggingRef.current = false;
            setShowCropOverlay(false);
            return;
          }

          // Helper to finish the crop once the source image is drawn
          const finishCrop = () => {
            const dataUrl = canvas.toDataURL("image/png");
            selectedImage.src = dataUrl;

            // Calculate display size: maintain the visual width, adjust height for new aspect ratio
            const preCropDisplayW = parseFloat(selectedImage.dataset.preCropWidth || "0") || selectedImage.offsetWidth;
            const cropAspect = sw / sh;
            const displayCropW = preCropDisplayW * (cropRect.width / 100);
            const displayCropH = displayCropW / cropAspect;

            selectedImage.style.width = `${Math.round(displayCropW)}px`;
            selectedImage.style.height = `${Math.round(displayCropH)}px`;
            selectedImage.style.maxWidth = "100%";
            selectedImage.style.display = "block";

            setShowCropOverlay(false);
            emitChange();
            isImageDraggingRef.current = false;
            setTimeout(() => setSelectedImageRect(selectedImage.getBoundingClientRect()), 0);
          };

          // If the source is a data URL, we can draw directly from the DOM image
          // (it's already loaded). Otherwise, load from original src.
          const originalSrc = selectedImage.dataset.originalSrc;
          if (originalSrc.startsWith("data:")) {
            // Data URLs: draw directly from the already-loaded DOM element
            // Use a temp image with the original src to avoid drawing from an already-cropped version
            const tmpImg = new Image();
            tmpImg.onload = () => {
              ctx.drawImage(tmpImg, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), 0, 0, Math.round(sw), Math.round(sh));
              finishCrop();
            };
            tmpImg.src = originalSrc;
          } else {
            const srcImg = new Image();
            srcImg.crossOrigin = "anonymous";
            srcImg.onload = () => {
              ctx.drawImage(srcImg, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), 0, 0, Math.round(sw), Math.round(sh));
              finishCrop();
            };
            srcImg.src = originalSrc;
          }
        };

        // Corner L-bracket marker (thick black lines at corners like Google Docs)
        const cornerMarkerLen = Math.min(20, cW * 0.25, cH * 0.25);
        const cornerMarkerThick = 3;

        // Edge handle bars (short thick bars at midpoints of edges)
        const edgeBarLen = Math.min(24, cW * 0.2, cH * 0.2);
        const edgeBarThick = 3;

        // Handles: corners + edges
        const handles: { key: string; cursor: string; top: number; left: number; w: number; h: number }[] = [
          // Corner handles (invisible hitbox over corner markers)
          { key: "nw", cursor: "nw-resize", top: cTop - 4, left: cLeft - 4, w: cornerMarkerLen + 8, h: cornerMarkerLen + 8 },
          { key: "ne", cursor: "ne-resize", top: cTop - 4, left: cLeft + cW - cornerMarkerLen - 4, w: cornerMarkerLen + 8, h: cornerMarkerLen + 8 },
          { key: "sw", cursor: "sw-resize", top: cTop + cH - cornerMarkerLen - 4, left: cLeft - 4, w: cornerMarkerLen + 8, h: cornerMarkerLen + 8 },
          { key: "se", cursor: "se-resize", top: cTop + cH - cornerMarkerLen - 4, left: cLeft + cW - cornerMarkerLen - 4, w: cornerMarkerLen + 8, h: cornerMarkerLen + 8 },
          // Edge handles (hitbox over midpoint bars)
          { key: "n", cursor: "n-resize", top: cTop - 6, left: cLeft + cW / 2 - edgeBarLen / 2, w: edgeBarLen, h: 12 },
          { key: "s", cursor: "s-resize", top: cTop + cH - 6, left: cLeft + cW / 2 - edgeBarLen / 2, w: edgeBarLen, h: 12 },
          { key: "w", cursor: "w-resize", top: cTop + cH / 2 - edgeBarLen / 2, left: cLeft - 6, w: 12, h: edgeBarLen },
          { key: "e", cursor: "e-resize", top: cTop + cH / 2 - edgeBarLen / 2, left: cLeft + cW - 6, w: 12, h: edgeBarLen },
        ];

        return (
          <>
            {/* Darkened overlay outside crop area (4 rectangles approach for reliability) */}
            {/* Top bar */}
            <div data-doc-crop-mask className="fixed z-[161] pointer-events-none" style={{ top: imgTop, left: imgLeft, width: imgW, height: cTop - imgTop, background: "rgba(0,0,0,0.55)" }} />
            {/* Bottom bar */}
            <div data-doc-crop-mask className="fixed z-[161] pointer-events-none" style={{ top: cTop + cH, left: imgLeft, width: imgW, height: (imgTop + imgH) - (cTop + cH), background: "rgba(0,0,0,0.55)" }} />
            {/* Left bar */}
            <div data-doc-crop-mask className="fixed z-[161] pointer-events-none" style={{ top: cTop, left: imgLeft, width: cLeft - imgLeft, height: cH, background: "rgba(0,0,0,0.55)" }} />
            {/* Right bar */}
            <div data-doc-crop-mask className="fixed z-[161] pointer-events-none" style={{ top: cTop, left: cLeft + cW, width: (imgLeft + imgW) - (cLeft + cW), height: cH, background: "rgba(0,0,0,0.55)" }} />

            {/* Crop area border — thin white line */}
            <div
              data-doc-crop-overlay
              className="fixed z-[162]"
              style={{ top: cTop, left: cLeft, width: cW, height: cH, border: "1.5px solid rgba(255,255,255,0.85)", cursor: "move" }}
              onMouseDown={onCropAreaMouseDown}
            />

            {/* Rule-of-thirds grid lines inside crop area */}
            {cW > 40 && cH > 40 && (
              <>
                {/* Vertical lines at 1/3 and 2/3 */}
                <div data-doc-crop-grid className="fixed z-[162] pointer-events-none" style={{ top: cTop, left: cLeft + cW / 3, width: 1, height: cH, background: "rgba(255,255,255,0.4)" }} />
                <div data-doc-crop-grid className="fixed z-[162] pointer-events-none" style={{ top: cTop, left: cLeft + (cW * 2) / 3, width: 1, height: cH, background: "rgba(255,255,255,0.4)" }} />
                {/* Horizontal lines at 1/3 and 2/3 */}
                <div data-doc-crop-grid className="fixed z-[162] pointer-events-none" style={{ top: cTop + cH / 3, left: cLeft, width: cW, height: 1, background: "rgba(255,255,255,0.4)" }} />
                <div data-doc-crop-grid className="fixed z-[162] pointer-events-none" style={{ top: cTop + (cH * 2) / 3, left: cLeft, width: cW, height: 1, background: "rgba(255,255,255,0.4)" }} />
              </>
            )}

            {/* Corner L-bracket markers (thick black lines like Google Docs) */}
            {(["nw", "ne", "sw", "se"] as const).map((corner) => {
              const isTop = corner.includes("n");
              const isLeft = corner.includes("w");
              const cx = isLeft ? cLeft : cLeft + cW;
              const cy = isTop ? cTop : cTop + cH;
              return (
                <div key={`corner-mark-${corner}`} className="contents">
                  {/* Horizontal arm */}
                  <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{
                    top: isTop ? cy - cornerMarkerThick / 2 : cy - cornerMarkerThick / 2,
                    left: isLeft ? cx - cornerMarkerThick / 2 : cx - cornerMarkerLen + cornerMarkerThick / 2,
                    width: cornerMarkerLen, height: cornerMarkerThick,
                    background: "#fff", borderRadius: 1,
                  }} />
                  {/* Vertical arm */}
                  <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{
                    top: isTop ? cy - cornerMarkerThick / 2 : cy - cornerMarkerLen + cornerMarkerThick / 2,
                    left: isLeft ? cx - cornerMarkerThick / 2 : cx - cornerMarkerThick / 2,
                    width: cornerMarkerThick, height: cornerMarkerLen,
                    background: "#fff", borderRadius: 1,
                  }} />
                </div>
              );
            })}

            {/* Edge midpoint bars (short thick white bars) */}
            {/* Top edge */}
            <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{ top: cTop - edgeBarThick / 2, left: cLeft + cW / 2 - edgeBarLen / 2, width: edgeBarLen, height: edgeBarThick, background: "#fff", borderRadius: 1 }} />
            {/* Bottom edge */}
            <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{ top: cTop + cH - edgeBarThick / 2, left: cLeft + cW / 2 - edgeBarLen / 2, width: edgeBarLen, height: edgeBarThick, background: "#fff", borderRadius: 1 }} />
            {/* Left edge */}
            <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{ top: cTop + cH / 2 - edgeBarLen / 2, left: cLeft - edgeBarThick / 2, width: edgeBarThick, height: edgeBarLen, background: "#fff", borderRadius: 1 }} />
            {/* Right edge */}
            <div data-doc-crop-marker className="fixed z-[163] pointer-events-none" style={{ top: cTop + cH / 2 - edgeBarLen / 2, left: cLeft + cW - edgeBarThick / 2, width: edgeBarThick, height: edgeBarLen, background: "#fff", borderRadius: 1 }} />

            {/* Invisible hitbox handles for all 8 directions */}
            {handles.map((h) => (
              <div
                key={`crop-handle-${h.key}`}
                data-doc-crop-handle
                className="fixed z-[164]"
                style={{ top: h.top, left: h.left, width: h.w, height: h.h, cursor: h.cursor }}
                onMouseDown={onCropHandleMouseDown(h.key)}
              />
            ))}

            {/* Apply / Cancel / Remove crop buttons — positioned below crop area */}
            <div
              data-doc-crop-buttons
              className="fixed z-[164] flex items-center gap-2"
              style={{ top: cTop + cH + 12, left: cLeft + cW / 2 - (selectedImage?.dataset.originalSrc ? 105 : 65) }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={applyCrop}
                className="px-4 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer shadow-lg"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowCropOverlay(false)}
                className="px-4 py-1.5 rounded-lg text-[11px] font-semibold bg-white/95 dark:bg-gray-800/95 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-md"
              >
                Cancel
              </button>
              {selectedImage?.dataset.originalSrc && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedImage) {
                      removeCrop(selectedImage);
                      emitChange();
                      setSelectedImageRect(selectedImage.getBoundingClientRect());
                      showToast("Crop removed — image restored");
                    }
                    setShowCropOverlay(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer shadow-lg"
                >
                  Remove crop
                </button>
              )}
            </div>
          </>
        );
      })()}

      {/* ── Image Options Sidebar — glassmorphism panel ── */}
      {showImageOptions && selectedImage && (
        <div
          data-doc-image-options-panel
          className="absolute right-0 top-0 bottom-0 z-[155] w-[300px] max-md:hidden border-l border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-xl shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50">Image options</span>
            </div>
            <button
              type="button"
              onClick={() => setShowImageOptions(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close image options"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
            {/* Thumbnail preview — shows live CSS filter feedback */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img
                src={selectedImage.src}
                alt="Preview"
                className="w-full h-32 object-contain"
                style={{
                  opacity: imageOptions.opacity / 100,
                  filter: `brightness(${imageOptions.brightness / 100}) contrast(${imageOptions.contrast / 100})`,
                  transform: imageRotation ? `rotate(${imageRotation}deg)` : undefined,
                }}
              />
            </div>
            {/* Size & Rotation */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Size &amp; Rotation</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">Width</label>
                  <input
                    type="number"
                    defaultValue={selectedImage.offsetWidth || selectedImage.naturalWidth}
                    onChange={(e) => {
                      if (selectedImage) {
                        selectedImage.style.width = `${e.target.value}px`;
                        setSelectedImageRect(selectedImage.getBoundingClientRect());
                        emitChange();
                      }
                    }}
                    className="w-full mt-0.5 px-2 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">Height</label>
                  <input
                    type="number"
                    defaultValue={selectedImage.offsetHeight || selectedImage.naturalHeight}
                    onChange={(e) => {
                      if (selectedImage) {
                        selectedImage.style.height = `${e.target.value}px`;
                        setSelectedImageRect(selectedImage.getBoundingClientRect());
                        emitChange();
                      }
                    }}
                    className="w-full mt-0.5 px-2 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                  />
                </div>
              </div>
              {/* Rotation input */}
              <div className="mt-2">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Rotation</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="number"
                    min="0"
                    max="359"
                    step="90"
                    value={imageRotation}
                    onChange={(e) => {
                      const val = Number(e.target.value) % 360;
                      setImageRotation(val);
                      if (selectedImage) {
                        selectedImage.style.transform = val === 0 ? "" : `rotate(${val}deg)`;
                        emitChange();
                        setSelectedImageRect(selectedImage.getBoundingClientRect());
                      }
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                  />
                  <span className="text-[11px] text-gray-400">deg</span>
                </div>
              </div>
            </div>

            {/* Text Wrapping */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Text wrapping</h4>
              <div className="flex gap-1">
                {(["inline", "left", "right", "break"] as const).map((wrap) => (
                  <button
                    key={wrap}
                    type="button"
                    onClick={() => {
                      if (!selectedImage) return;
                      selectedImage.style.float = wrap === "left" ? "left" : wrap === "right" ? "right" : "none";
                      if (wrap === "left" || wrap === "right") selectedImage.style.margin = "8px 12px";
                      else selectedImage.style.margin = "12px 0";
                      if (wrap === "break") { selectedImage.style.display = "block"; selectedImage.style.float = "none"; }
                      emitChange();
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer capitalize"
                  >
                    {wrap === "break" ? "Break" : wrap === "inline" ? "Inline" : wrap === "left" ? "Left" : "Right"}
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Adjustments</h4>
              <div className="space-y-3">
                {/* Opacity */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-gray-500 dark:text-gray-400">Opacity</label>
                    <span className="text-[11px] text-gray-400 tabular-nums">{imageOptions.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imageOptions.opacity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setImageOptions((prev) => ({ ...prev, opacity: val }));
                      if (selectedImage) {
                        selectedImage.style.opacity = String(val / 100);
                        emitChange();
                      }
                    }}
                    className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-500 cursor-pointer"
                  />
                </div>
                {/* Brightness */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-gray-500 dark:text-gray-400">Brightness</label>
                    <span className="text-[11px] text-gray-400 tabular-nums">{imageOptions.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageOptions.brightness}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const prevContrast = imageOptions.contrast;
                      setImageOptions((prev) => ({ ...prev, brightness: val }));
                      if (selectedImage) {
                        selectedImage.style.filter = `brightness(${val / 100}) contrast(${prevContrast / 100})`;
                        emitChange();
                      }
                    }}
                    className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-500 cursor-pointer"
                  />
                </div>
                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-gray-500 dark:text-gray-400">Contrast</label>
                    <span className="text-[11px] text-gray-400 tabular-nums">{imageOptions.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageOptions.contrast}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const prevBrightness = imageOptions.brightness;
                      setImageOptions((prev) => ({ ...prev, contrast: val }));
                      if (selectedImage) {
                        selectedImage.style.filter = `brightness(${prevBrightness / 100}) contrast(${val / 100})`;
                        emitChange();
                      }
                    }}
                    className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Reset all adjustments */}
            <button
              type="button"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.style.filter = "";
                  selectedImage.style.opacity = "";
                  selectedImage.style.transform = "";
                  selectedImage.style.clipPath = "";
                  setImageOptions({ opacity: 100, brightness: 100, contrast: 100 });
                  setImageRotation(0);
                  emitChange();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset all adjustments
            </button>
          </div>
        </div>
      )}

      {/* Comments sidebar panel — docked right, aligned with page surface */}
      {!isFullscreen && showComments && (
        <div
          data-doc-comments-panel
          className="absolute right-0 top-0 bottom-0 z-[150] w-[340px] max-md:hidden border-l border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
        >
          {/* Header with tabs */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-3 pt-2.5 pb-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">Comments</span>
                {openComments.length > 0 && (
                  <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                    {openComments.length}
                  </span>
                )}
              </div>
              <Tooltip content="Close comments" delay={200}>
                <button
                  type="button"
                  onClick={() => { setShowComments(false); setSidebarManuallyDismissed(true); }}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="Close comments panel"
                >
                  <PanelRightClose className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </Tooltip>
            </div>
            {/* "For you" / "All comments" tabs */}
            <div className="flex px-3 mt-2" role="tablist">
              {(["for-you", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={commentTab === tab}
                  onClick={() => setCommentTab(tab)}
                  className={[
                    "flex-1 text-center text-[12px] font-medium pb-2 border-b-2 transition-all duration-200 cursor-pointer",
                    commentTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                  ].join(" ")}
                >
                  {tab === "for-you" ? "For you" : "All comments"}
                  {tab === "for-you" && forYouComments.filter((c) => c.status === "open").length > 0 && (
                    <span className="ml-1 text-[9px] bg-blue-500 text-white px-1 py-0.5 rounded-full">
                      {forYouComments.filter((c) => c.status === "open").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 rounded-lg p-0.5">
              {(["open", "resolved", "rejected", "all"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCommentFilter(f)}
                  className={[
                    "px-2 py-1 text-[10px] font-medium rounded-md transition-all duration-150 cursor-pointer",
                    commentFilter === f
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                  ].join(" ")}
                >
                  {f === "open" ? "Open" : f === "resolved" ? "Resolved" : f === "rejected" ? "Rejected" : "All"}
                </button>
              ))}
            </div>
            {commentFilter !== "open" && (
              <button
                type="button"
                onClick={() => setCommentFilter("open")}
                className="text-[10px] text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Comment feed — cards sorted by text position in the document */}
          <div ref={sidebarFeedRef} className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredComments.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                {commentTab === "for-you" ? (
                  <>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">&ldquo;For you&rdquo; will list comments that need your attention.</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Start a discussion by selecting text and adding a comment.</p>
                  </>
                ) : commentFilter !== "open" ? (
                  <>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">No matching results</p>
                    <button
                      type="button"
                      onClick={() => setCommentFilter("open")}
                      className="mt-2 text-[11px] text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      Reset filter
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Select text and click the comment button to add one</p>
                  </>
                )}
              </div>
            ) : (
              sortedFilteredComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  isActive={activeCommentId === comment.id}
                  onSelect={() => { setActiveCommentId(comment.id); setTimeout(() => scrollToComment(comment), 200); }}
                  onReply={(text) => addReply(comment.id, text, parseMentions(text))}
                  onResolve={(msg) => resolveComment(comment.id, msg)}
                  onReject={(msg) => rejectComment(comment.id, msg)}
                  onReopen={() => reopenComment(comment.id)}
                  onDelete={() => deleteComment(comment.id)}
                  isOwner={commentAuthor.id === comment.author.id || commentAuthor.role === "admin"}
                  currentAuthor={commentAuthor}
                  mentionableUsers={mentionableUsers}
                  filterFade={commentFilter === "open"}
                />
              ))
            )}
          </div>

          {/* Add comment button at bottom of panel */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-2.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAddCommentFromSelection}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-semibold text-white bg-blue-500 hover:bg-blue-600 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md active:scale-[0.98]"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Add comment
            </button>
          </div>
        </div>
      )}

      </div>

      {/* Floating margin bubble — chat icon that appears when text is selected */}
      {marginBubble.show && !commentPopover.show && (
        <div
          data-doc-margin-bubble
          className="absolute z-[180] transition-all duration-200"
          style={{ left: marginBubble.x, top: marginBubble.y }}
        >
          <Tooltip content="Add comment" delay={200}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAddCommentFromSelection}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Add comment to selection"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Comment creation popover — appears near selected text */}
      {commentPopover.show && (() => {
        const rootRect = rootRef.current?.getBoundingClientRect() || { left: 0, top: 0, right: 800 };
        const popoverHeight = 220;
        const viewportH = typeof window !== "undefined" ? window.innerHeight : 900;
        const absTop = commentPopover.y;
        const screenTop = rootRect.top + absTop;
        // If popover would overflow viewport bottom, flip it upward
        const clampedTop = screenTop + popoverHeight > viewportH - 16
          ? Math.max(0, absTop - popoverHeight)
          : absTop;
        const clampedLeft = Math.min(commentPopover.x, (rootRef.current?.clientWidth || 800) - 320);
        return (
        <div
          data-doc-comment-popover
          className="absolute z-[200] w-[300px] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl"
          style={{ left: clampedLeft, top: clampedTop }}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CommentAvatar author={commentAuthor} size={28} />
              <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">{commentAuthor.name}</span>
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 px-1 py-0.5 bg-yellow-50/60 dark:bg-yellow-900/20 rounded border-l-2 border-yellow-400 dark:border-yellow-600 line-clamp-2">
              &ldquo;{commentPopover.selectedText}&rdquo;
            </div>
            <div className="relative">
              <textarea
                ref={commentInputRef}
                autoFocus
                value={commentText}
                placeholder="Add a comment... (use @ to mention)"
                className="w-full text-[12px] text-gray-700 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-400/40 placeholder-gray-400 dark:placeholder-gray-500"
                rows={3}
                onKeyDown={(e) => {
                  popoverMention.handleKeyDown(e);
                  if (!popoverMention.active && e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const text = commentText.trim();
                    if (text) {
                      addComment(text, parseMentions(text));
                      setCommentText("");
                    }
                  }
                  if (e.key === "Escape" && !popoverMention.active) {
                    setCommentPopover({ show: false, x: 0, y: 0, selectedText: "", range: null });
                    setCommentText("");
                  }
                }}
                onChange={(e) => popoverMention.handleChange(e.target.value)}
              />
              {popoverMention.active && (
                <MentionPopover
                  users={popoverMention.filtered}
                  highlightIdx={popoverMention.highlightIdx}
                  onSelect={(u) => popoverMention.insertMention(u)}
                />
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => { setCommentPopover({ show: false, x: 0, y: 0, selectedText: "", range: null }); setCommentText(""); }}
                className="text-[11px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = commentText.trim();
                  if (text) { addComment(text, parseMentions(text)); setCommentText(""); }
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3 h-3" />
                Comment
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Mobile comments bottom sheet — shown on <768px when comments or floating pills are active */}
      {!isFullscreen && (showComments || (showFloatingComments && openComments.length > 0)) && (
        <div
          data-doc-comments-mobile-sheet
          className="md:hidden fixed inset-x-0 bottom-0 z-[200] max-h-[70vh] rounded-t-2xl border-t border-gray-200/80 dark:border-gray-700/80 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">Comments</span>
              {openComments.length > 0 && (
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                  {openComments.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => { setShowComments(false); setSidebarManuallyDismissed(true); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close comments"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto">
            {(["open", "resolved", "rejected", "all"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setCommentFilter(f)}
                className={[
                  "px-3 py-1 text-[11px] font-medium rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap",
                  commentFilter === f
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                ].join(" ")}
              >
                {f === "open" ? "Open" : f === "resolved" ? "Resolved" : f === "rejected" ? "Rejected" : "All"}
              </button>
            ))}
          </div>
          {/* Comment feed */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
            {filteredComments.length === 0 ? (
              <div className="text-center py-6 px-4">
                <MessageCircle className="w-7 h-7 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-[12px] text-gray-500 dark:text-gray-400">No comments yet</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  isActive={activeCommentId === comment.id}
                  onSelect={() => { setActiveCommentId(comment.id); setTimeout(() => scrollToComment(comment), 200); }}
                  onReply={(text) => addReply(comment.id, text, parseMentions(text))}
                  onResolve={(msg) => resolveComment(comment.id, msg)}
                  onReject={(msg) => rejectComment(comment.id, msg)}
                  onReopen={() => reopenComment(comment.id)}
                  onDelete={() => deleteComment(comment.id)}
                  isOwner={commentAuthor.id === comment.author.id || commentAuthor.role === "admin"}
                  currentAuthor={commentAuthor}
                  mentionableUsers={mentionableUsers}
                  filterFade={commentFilter === "open"}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ShareDialog
        isOpen={dialog === "share"}
        onClose={() => setDialog(null)}
        title={docTitle}
        onShare={handleShareDocument}
        linkUrl={shareLinkUrl}
        onCopyLink={handleCopyLink}
      />
      <PublishDialog
        isOpen={dialog === "publish"}
        onClose={() => setDialog(null)}
        title={docTitle}
        onPublish={handlePublishDocument}
      />

      {/* Find & Replace — floating panel (non-blocking, allows document interaction) */}
      {dialog === "findReplace" && (
        <div
          data-doc-find-replace-panel
          className="absolute right-3 top-[92px] z-[150] w-[300px] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 midnight:border-gray-600/60 purple:border-purple-700/60 bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1829]/95 purple:bg-[#1a0d2e]/95 backdrop-blur-md shadow-xl p-3"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
              Find and replace
            </span>
            <button
              onClick={() => {
                clearFindHighlights();
                setFindMatchCount(null);
                setDialog(null);
              }}
              className="p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
              aria-label="Close find and replace"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Find section */}
          <div data-doc-find-section className="space-y-1.5">
            <div className="relative">
              <input
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    findNextAndHighlight(findQuery);
                  }
                }}
                placeholder="Find…"
                className="w-full px-3 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 midnight:bg-[#111d30] purple:bg-[#1f0f35] border border-gray-200 dark:border-gray-700 midnight:border-gray-600 purple:border-purple-700 text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 outline-none focus:ring-1 focus:ring-blue-400"
                autoFocus
              />
              {findMatchCount && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
                  {findMatchCount.current}/{findMatchCount.total}
                </span>
              )}
            </div>
            <DialogButton
              onClick={() => {
                const ok = findNextAndHighlight(findQuery);
                if (!ok) showToast("Not found");
              }}
            >
              Find next
            </DialogButton>
          </div>

          {/* Divider */}
          <div className="my-2.5 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-gray-600/40 purple:border-purple-700/40" />

          {/* Replace section */}
          <div data-doc-replace-section className="space-y-1.5">
            <input
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  replaceAndHighlight(findQuery, replaceQuery);
                }
              }}
              placeholder="Replace with…"
              className="w-full px-3 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-gray-800 midnight:bg-[#111d30] purple:bg-[#1f0f35] border border-gray-200 dark:border-gray-700 midnight:border-gray-600 purple:border-purple-700 text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 outline-none focus:ring-1 focus:ring-blue-400"
            />
            <div className="flex items-center gap-1.5">
              <DialogButton
                onClick={() => {
                  const ok = replaceAndHighlight(findQuery, replaceQuery);
                  if (ok) {
                    showToast("Replaced");
                  } else {
                    showToast("Not found");
                  }
                }}
              >
                Replace
              </DialogButton>
              <DialogButton
                onClick={() => {
                  const count = replaceAllAndHighlight(findQuery, replaceQuery);
                  showToast(`Replaced ${count}`);
                }}
              >
                Replace all
              </DialogButton>
            </div>
          </div>
        </div>
      )}

      {dialog === "pageSetup" && (
        <PageSetupDialog
          pageSetup={pageSetup}
          onApply={(setup, applyTo) => {
            if (applyTo === "selected-content") {
              // Apply to only the active section. If there's only one section, split it.
              setSectionInfos(prev => {
                const sIdx = Math.min(activeSectionIdxRef.current, prev.length - 1);
                if (prev.length === 1) {
                  // Single section — split into up to 3 sections around the focused page
                  const totalPages = prev[0].pageCount;
                  // Find which page within the section the cursor is on
                  // Use a rough estimate: page 0 for now, or we detect from DOM
                  let focusedPageInSection = 0;
                  const sel = window.getSelection();
                  if (sel?.anchorNode) {
                    let node = sel.anchorNode as HTMLElement | null;
                    while (node && node !== editorRootRef.current) {
                      const pidx = pageRefs.current.indexOf(node as HTMLDivElement);
                      if (pidx >= 0) { focusedPageInSection = pidx; break; }
                      node = node.parentElement;
                    }
                  }
                  const sections: SectionInfo[] = [];
                  if (focusedPageInSection > 0) {
                    sections.push({ pageCount: focusedPageInSection, pageSetup: prev[0].pageSetup });
                  }
                  sections.push({ pageCount: 1, pageSetup: setup });
                  const remaining = totalPages - focusedPageInSection - 1;
                  if (remaining > 0) {
                    sections.push({ pageCount: remaining, pageSetup: prev[0].pageSetup });
                  }
                  return sections;
                }
                // Multiple sections already — just update the active one
                const updated = [...prev];
                updated[sIdx] = { ...updated[sIdx], pageSetup: setup };
                return updated;
              });
            } else {
              // "This tab" — apply to ALL sections, merge into one
              const totalPages = sectionInfosRef.current.reduce((sum, s) => sum + s.pageCount, 0);
              setSectionInfos([{ pageCount: totalPages, pageSetup: setup }]);
              setActiveSectionIdx(0);
            }
            setDialog(null);
            showToast("Page setup updated");
            // Trigger re-pagination after state settles
            setTimeout(() => schedulePaginate(), 50);
          }}
          onClose={() => setDialog(null)}
          showToast={showToast}
        />
      )}

      {dialog === "details" && (
        <DocDialog title="Details" onClose={() => setDialog(null)}>
          <div className="text-[12px] text-gray-600 dark:text-gray-300 space-y-2">
            <div><strong>Title:</strong> {docTitle}</div>
            <div><strong>Language:</strong> {language}</div>
            <div><strong>Characters:</strong> {getDocumentText().length}</div>
          </div>
        </DocDialog>
      )}

      {dialog === "security" && (
        <DocDialog title="Security limitations" onClose={() => setDialog(null)}>
          <div className="text-[12px] text-gray-600 dark:text-gray-300">
            Browser security prevents full clipboard control and some exports without additional libraries.
            This component keeps content local unless you wire it to your backend.
          </div>
        </DocDialog>
      )}

      {dialog === "versions" && (
        <DocDialog title="Version history" onClose={() => setDialog(null)}>
          {versions.length === 0 ? (
            <div className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 text-center py-4">
              No saved versions yet. Versions are saved automatically when you share or publish,
              or manually via File &rarr; Version history &rarr; Save version.
            </div>
          ) : (
            <div className="max-h-[320px] overflow-auto scrollbar-thin space-y-1">
              {versions.map((v) => (
                <button
                  key={v.ts}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors cursor-pointer group"
                  onClick={() => {
                    updateValue({ title: v.title, html: v.html, language: v.language });
                    showToast("Version restored");
                    setDialog(null);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {v.author?.avatar ? (
                      <img src={v.author.avatar} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />
                    ) : v.author?.name ? (
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 flex items-center justify-center text-[9px] font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0">
                        {v.author.name.charAt(0).toUpperCase()}
                      </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200">
                          {formatTimeAgo(new Date(v.ts).toISOString())}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                          v.type === "auto"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 midnight:bg-cyan-500/10 midnight:text-cyan-400 purple:bg-pink-500/10 purple:text-pink-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 midnight:bg-gray-700 midnight:text-gray-400 purple:bg-gray-700 purple:text-gray-400"
                        }`}>
                          {v.type === "auto" ? "Auto" : "Manual"}
                        </span>
                      </div>

                      {v.label && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 truncate">
                          {v.label}
                        </div>
                      )}

                      {v.author?.name && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500">
                          by {v.author.name}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      Restore
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DocDialog>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[220] px-3 py-2 rounded-xl bg-gray-900 text-white text-[12px] shadow-xl">
          {toast}
        </div>
      )}
      </div>
    </SubmenuCloseContext.Provider>
    </MenuCloseContext.Provider>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 midnight:bg-cyan-500/15 purple:bg-pink-500/15 mx-0.5" />;
}

function ToolbarDropdown({
  label,
  title,
  Icon,
  isOpen,
  onToggle,
  disabled,
  children,
  width = "w-[200px]",
}: {
  label?: string;
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (isNativeColorPickerOpen()) return;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <Tooltip content={title} delay={400}>
        <button
          type="button"
          onMouseDown={(e) => { if (!disabled) e.preventDefault(); }}
          onClick={onToggle}
          disabled={disabled}
          aria-label={title}
          className="h-7 inline-flex items-center gap-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label && <span className="truncate max-w-[80px]">{label}</span>}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </Tooltip>
      {isOpen && (
        <div className={`absolute z-[120] top-full mt-1 left-0 ${width} rounded-xl border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] shadow-xl max-h-[400px] overflow-y-auto`}>
          {children}
        </div>
      )}
    </div>
  );
}

function DocDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      data-doc-dialog
      className="absolute inset-0 z-[210] flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4"
    >
      <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-bold text-gray-800 dark:text-gray-100">
            {title}
          </div>
          <button
            className="px-2 py-1 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DialogButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

function PageSetupDialog({
  pageSetup,
  onApply,
  onClose,
  showToast,
}: {
  pageSetup: PageSetup;
  onApply: (setup: PageSetup, applyTo: "this-tab" | "selected-content") => void;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [tab, setTab] = useState<"pages" | "pageless">(pageSetup.pageless ? "pageless" : "pages");
  const [draft, setDraft] = useState<PageSetup>({ ...pageSetup });
  const [applyTo, setApplyTo] = useState<"this-tab" | "selected-content">("this-tab");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const colorGridRef = useRef<HTMLDivElement>(null);

  // Sync tab → pageless
  useEffect(() => {
    setDraft((d) => ({ ...d, pageless: tab === "pageless" }));
  }, [tab]);

  // Close color picker on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isNativeColorPickerOpen()) return;
      const target = e.target as Node;
      if (
        colorRef.current && !colorRef.current.contains(target) &&
        colorGridRef.current && !colorGridRef.current.contains(target)
      ) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker]);

  const paperSizeOptions = PAPER_SIZES.map((p) => ({
    value: p.name,
    label: `${p.name} (${p.widthCm.toFixed(1)} × ${p.heightCm.toFixed(1)} cm)`,
  }));

  return (
    <div data-doc-dialog className="absolute inset-0 z-[210] flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-[560px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div className="text-[16px] font-bold text-gray-800 dark:text-gray-100">Page setup</div>
          <button className="px-2 py-1 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={onClose}>Close</button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 px-6 mt-1 border-b border-gray-200 dark:border-gray-700">
          {(["pages", "pageless"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-4 py-2.5 text-[13px] font-semibold capitalize cursor-pointer transition-colors",
                tab === t
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Apply to */}
          <FormDropdown
            label="Apply to"
            icon={<FileText className="w-2.5 h-2.5" />}
            value={applyTo}
            onChange={(v) => setApplyTo(v as "this-tab" | "selected-content")}
            options={[
              { value: "this-tab", label: "This tab" },
              { value: "selected-content", label: "Selected content" },
            ]}
          />

          {tab === "pages" && (
            <>
              {/* Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <RotateCw className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Orientation</span>
                </label>
                <div className="flex items-center gap-5">
                  {(["portrait", "landscape"] as const).map((o) => (
                    <label key={o} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setDraft((d) => ({ ...d, orientation: o }))}>
                      <div className={[
                        "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors",
                        draft.orientation === o ? "border-blue-600 dark:border-blue-400" : "border-gray-300 dark:border-gray-600",
                      ].join(" ")}>
                        {draft.orientation === o && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200 capitalize">{o}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Paper size + Page colour */}
              <div className="grid grid-cols-[1fr,auto] gap-4 items-end">
                <FormDropdown
                  label="Paper size"
                  icon={<FileText className="w-2.5 h-2.5" />}
                  value={draft.paperSize}
                  onChange={(value) => setDraft((d) => ({ ...d, paperSize: value }))}
                  options={paperSizeOptions}
                />
                <div ref={colorRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <Palette className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Page colour</span>
                  </label>
                  <button
                    className="flex items-center gap-2 min-h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                    onClick={() => setShowColorPicker((v) => !v)}
                  >
                    <div className="w-6 h-6 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: draft.pageColor }} />
                    <ChevronRight className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showColorPicker ? "rotate-[-90deg]" : "rotate-90"}`} />
                  </button>
                </div>
              </div>
              {showColorPicker && (
                <div ref={colorGridRef} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2">Default</div>
                  <ColorGrid
                    colors={PAGE_COLORS}
                    selectedColor={draft.pageColor}
                    onSelect={(c) => { setDraft((d) => ({ ...d, pageColor: c })); if (!isNativeColorPickerOpen()) setShowColorPicker(false); }}
                    columns={10}
                    swatchSize="sm"
                    showCustomHex
                  />
                </div>
              )}

              {/* Margins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <Maximize2 className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Margins (centimetres)</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {([
                    ["Top", "marginTopCm"],
                    ["Bottom", "marginBottomCm"],
                    ["Left", "marginLeftCm"],
                    ["Right", "marginRightCm"],
                  ] as const).map(([label, key]) => (
                    <FormInput
                      key={key}
                      label={label}
                      type="number"
                      step={0.01}
                      min={0}
                      value={String(draft[key])}
                      onChange={(val) => setDraft((d) => ({ ...d, [key]: Math.max(0, Number(val) || 0) }))}
                      iconBgColor="bg-transparent"
                      iconColor="text-transparent"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "pageless" && (
            <>
              <div ref={colorRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <Palette className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Page colour</span>
                </label>
                <button
                  className="flex items-center gap-2 min-h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                  onClick={() => setShowColorPicker((v) => !v)}
                >
                  <div className="w-6 h-6 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: draft.pageColor }} />
                  <ChevronRight className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showColorPicker ? "rotate-[-90deg]" : "rotate-90"}`} />
                </button>
              </div>
              {showColorPicker && (
                <div ref={colorGridRef} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2">Default</div>
                  <ColorGrid
                    colors={PAGE_COLORS}
                    selectedColor={draft.pageColor}
                    onSelect={(c) => { setDraft((d) => ({ ...d, pageColor: c })); if (!isNativeColorPickerOpen()) setShowColorPicker(false); }}
                    columns={10}
                    swatchSize="sm"
                    showCustomHex
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5 pt-1">
          <button
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
            onClick={() => {
              try {
                localStorage.setItem("educo_page_setup_default", JSON.stringify(draft));
                showToast("Default page setup saved");
              } catch {
                showToast("Failed to save defaults");
              }
            }}
          >
            Set as default
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onApply(draft, applyTo)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuRoot({
  id,
  label,
  openMenu,
  onOpen,
  onClose,
  children,
}: {
  id: "file" | "edit" | "view" | "insert" | "format" | "tools" | "extensions" | "help";
  label: string;
  openMenu: "file" | "edit" | "view" | "insert" | "format" | "tools" | "extensions" | "help" | null;
  onOpen: (id: "file" | "edit" | "view" | "insert" | "format" | "tools" | "extensions" | "help") => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const isOpen = openMenu === id;
  return (
    <div className="relative z-[100]" data-doc-menu-root>
      <button
        type="button"
        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
            : "hover:bg-gray-100/70 dark:hover:bg-gray-800/60 midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen(id))}
        onMouseEnter={() => openMenu && onOpen(id)}
      >
        {label}
      </button>
      {isOpen ? children : null}
    </div>
  );
}

function MenuPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-doc-menu-panel
      className="absolute z-[120] mt-2 left-0 w-[260px] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-visible"
    >
      <div className="py-1 max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </div>
  );
}

function SubmenuPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const anchorRef = useContext(SubmenuAnchorContext);
  const timerCtx = useContext(SubmenuTimerContext);

  useLayoutEffect(() => {
    const el = panelRef.current;
    const anchor = anchorRef?.current;
    if (!el || !anchor) return;

    // Register as the active submenu panel for hover detection
    activeSubmenuPanelEl.current = el;

    // Position relative to the parent menu item (viewport coordinates — no calibration
    // needed because the portal renders at document.body, outside backdrop-blur).
    const parentPanel = anchor.closest("[data-doc-menu-panel]");
    const itemRect = anchor.getBoundingClientRect();
    const panelRect = parentPanel?.getBoundingClientRect() ?? null;

    let left = panelRect ? panelRect.right : itemRect.right;
    let top = itemRect.top;

    // Flip to left side if going off the right edge
    const pw = el.offsetWidth;
    if (left + pw > window.innerWidth) {
      left = (panelRect ? panelRect.left : itemRect.left) - pw;
    }
    // Prevent going off the bottom edge
    const ph = el.offsetHeight;
    if (top + ph > window.innerHeight) {
      top = Math.max(4, window.innerHeight - ph);
    }

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  });

  useEffect(() => {
    return () => {
      if (activeSubmenuPanelEl.current === panelRef.current) {
        activeSubmenuPanelEl.current = null;
      }
    };
  }, []);

  // SSR guard: createPortal needs document.body
  if (typeof document === "undefined") return null;

  return createPortal(
    <SubmenuCloseContext.Provider value={null}>
      <div
        ref={panelRef}
        data-doc-menu-panel
        className={`fixed z-[10000] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-visible ${className}`}
        onMouseEnter={() => timerCtx?.cancelClose()}
        onMouseLeave={() => timerCtx?.scheduleClose()}
      >
        {/* Invisible bridge connecting parent menu item to this submenu */}
        <div className="absolute -left-4 top-0 w-4 h-full" />
        <div className="py-1">{children}</div>
      </div>
    </SubmenuCloseContext.Provider>,
    document.body,
  );
}

function MenuDivider() {
  return <div className="my-1 h-px bg-gray-100 dark:bg-gray-800 midnight:bg-cyan-500/10 purple:bg-pink-500/10" />;
}

function MenuItem({
  label,
  shortcut,
  onClick,
  disabled,
  hasSubmenu,
  submenu,
  onHover,
  onLeave,
  isSubmenuOpen,
  icon: Icon,
  isChecked,
}: {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  hasSubmenu?: boolean;
  submenu?: React.ReactNode;
  onHover?: () => void;
  onLeave?: () => void;
  isSubmenuOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isChecked?: boolean;
}) {
  const requestCloseMenus = useContext(MenuCloseContext);
  const closeSubmenus = useContext(SubmenuCloseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmenuOpenRef = useRef(isSubmenuOpen);
  isSubmenuOpenRef.current = isSubmenuOpen;
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Stable timer callbacks shared with the portalled SubmenuPanel via context.
  const timerCallbacks = useMemo(() => ({
    cancelClose: () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    },
    scheduleClose: () => {
      closeTimerRef.current = setTimeout(() => {
        if (!isSubmenuOpenRef.current) return;
        onLeaveRef.current?.();
      }, 350);
    },
  }), []);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (!hasSubmenu) requestCloseMenus?.();
  };

  const content = (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        // Cancel any pending close timer (mouse returned to this item)
        timerCallbacks.cancelClose();
        if (hasSubmenu) {
          // Open this submenu (implicitly closes any other open submenu via state)
          onHover?.();
        } else {
          // Non-submenu item: close any open submenu at this menu level
          closeSubmenus?.();
        }
      }}
      onMouseLeave={() => {
        // Only run close logic for items with an open submenu
        if (!hasSubmenu || !isSubmenuOpen || !onLeave) return;
        // Schedule close — the portalled SubmenuPanel's onMouseEnter will cancel if mouse goes there
        timerCallbacks.scheduleClose();
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors ${
          disabled
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/70 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer"
        }`}
      >
        <span className="w-4 flex-shrink-0 flex items-center justify-center">
          {isChecked ? (
            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">✓</span>
          ) : Icon ? (
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : null}
        </span>
        <span className="flex-1 min-w-0 truncate">{label}</span>
        {shortcut && <span className="text-[12px] text-gray-400 dark:text-gray-500">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
      </button>
      <SubmenuTimerContext.Provider value={hasSubmenu ? timerCallbacks : null}>
        <SubmenuAnchorContext.Provider value={containerRef}>
          {submenu && isSubmenuOpen && submenu}
        </SubmenuAnchorContext.Provider>
      </SubmenuTimerContext.Provider>
    </div>
  );

  return (
    <Tooltip content={label} block delay={500}>
      {content}
    </Tooltip>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  MODERNIZED VIEW MENU COMPONENTS — 2026 Design System
 *  Glassmorphism surface · iOS pill toggles · Micro-interactions · WCAG 2.1
 * ═══════════════════════════════════════════════════════════════════════════ */

function ViewMenuPanel({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const glassClasses = [
    "bg-white/80 dark:bg-[#121212]/80 midnight:bg-[#0b1220]/80 purple:bg-[#1a0d2e]/80",
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    "border border-gray-300/60 dark:border-gray-600/50 midnight:border-cyan-400/20 purple:border-pink-400/20",
  ].join(" ");

  // Mobile: full-screen overlay bottom sheet with large touch targets
  if (isMobile) {
    return createPortal(
      <>
        <div
          data-doc-view-sheet-backdrop
          className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm"
        />
        <div
          data-doc-menu-panel
          data-doc-view-menu-panel
          data-doc-view-bottom-sheet
          className={[
            "fixed bottom-0 left-0 right-0 z-[301]",
            "rounded-t-3xl",
            glassClasses,
            "shadow-[0_-8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.4)]",
          ].join(" ")}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="px-1 pb-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </>,
      document.body,
    );
  }

  // Desktop/Tablet: glassmorphism dropdown
  return (
    <div
      data-doc-menu-panel
      data-doc-view-menu-panel
      className={[
        "absolute z-[120] mt-2 left-0 w-[300px] rounded-2xl overflow-visible",
        glassClasses,
        // Ambient occlusion shadows (soft, multi-layered)
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_12px_24px_-4px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      <div className="py-1.5 max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </div>
  );
}

function ViewMenuDivider() {
  return (
    <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 midnight:via-cyan-500/15 purple:via-pink-500/15 to-transparent" />
  );
}

function ViewMenuItem({
  label,
  description,
  shortcut,
  onClick,
  disabled,
  hasSubmenu,
  submenu,
  onHover,
  onLeave,
  isSubmenuOpen,
  icon: Icon,
  isChecked,
  activeMode,
}: {
  label: string;
  description?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  hasSubmenu?: boolean;
  submenu?: React.ReactNode;
  onHover?: () => void;
  onLeave?: () => void;
  isSubmenuOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isChecked?: boolean;
  activeMode?: string;
}) {
  const requestCloseMenus = useContext(MenuCloseContext);
  const closeSubmenus = useContext(SubmenuCloseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmenuOpenRef = useRef(isSubmenuOpen);
  isSubmenuOpenRef.current = isSubmenuOpen;
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  const timerCallbacks = useMemo(() => ({
    cancelClose: () => { if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; } },
    scheduleClose: () => { closeTimerRef.current = setTimeout(() => { if (!isSubmenuOpenRef.current) return; onLeaveRef.current?.(); }, 350); },
  }), []);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (!hasSubmenu) requestCloseMenus?.();
  };

  const content = (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        timerCallbacks.cancelClose();
        if (hasSubmenu) { onHover?.(); } else { closeSubmenus?.(); }
      }}
      onMouseLeave={() => {
        if (!hasSubmenu || !isSubmenuOpen || !onLeave) return;
        timerCallbacks.scheduleClose();
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={[
          "w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px]",
          // Variable typography: heavier weight on hover
          "font-[420] hover:font-[520]",
          disabled
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 hover:bg-gray-100/60 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8 cursor-pointer",
          // Active mode glow for "Suggesting" style context-aware feedback
          isChecked && !hasSubmenu
            ? "bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
            : "",
        ].join(" ")}
      >
        <span className="w-5 flex-shrink-0 flex items-center justify-center">
          {isChecked ? (
            <Check className="w-4 h-4 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
          ) : Icon ? (
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70" />
          ) : null}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[13px] leading-tight truncate">{label}</span>
          {description && (
            <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 midnight:text-cyan-300/40 purple:text-pink-300/40 mt-0.5 truncate">{description}</span>
          )}
        </div>
        {/* Active mode badge for submenu items */}
        {activeMode && hasSubmenu && (
          <span className={[
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
            activeMode === "suggesting"
              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              : activeMode === "viewing"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
          ].join(" ")}>
            {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
          </span>
        )}
        {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />}
      </button>
      <SubmenuTimerContext.Provider value={hasSubmenu ? timerCallbacks : null}>
        <SubmenuAnchorContext.Provider value={containerRef}>
          {submenu && isSubmenuOpen && submenu}
        </SubmenuAnchorContext.Provider>
      </SubmenuTimerContext.Provider>
    </div>
  );

  return content;
}

function ViewMenuToggle({
  label,
  description,
  shortcut,
  isOn,
  onToggle,
}: {
  label: string;
  description?: string;
  shortcut?: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  const requestCloseMenus = useContext(MenuCloseContext);

  return (
    <button
      type="button"
      onClick={() => {
        onToggle();
        // Keep menu open so user can toggle multiple items without re-opening
      }}
      className={[
        "w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px] cursor-pointer",
        "font-[420] hover:font-[520]",
        "text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50",
        "hover:bg-gray-100/60 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8",
      ].join(" ")}
      role="switch"
      aria-checked={isOn}
      aria-label={label}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <div className="min-w-0">
          <span className="block text-[13px] leading-tight truncate">{label}</span>
          {description && (
            <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 midnight:text-cyan-300/40 purple:text-pink-300/40 mt-0.5 truncate">{description}</span>
          )}
        </div>
      </div>
      {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums mr-2">{shortcut}</span>}
      {/* iOS-style pill toggle switch */}
      <div
        className={[
          "relative w-[38px] h-[22px] rounded-full flex-shrink-0 transition-colors duration-200",
          isOn
            ? "bg-blue-500 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
            : "bg-gray-300 dark:bg-gray-600 midnight:bg-gray-600 purple:bg-gray-600",
        ].join(" ")}
      >
        <div
          className={[
            "absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
            isOn ? "translate-x-[18px]" : "translate-x-[2px]",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  FULLSCREEN FLOATING PILL MENU
 *  Appears when cursor nears the top of the screen in fullscreen mode.
 *  Haptic-style pill with glassmorphism. Includes zoom and exit controls.
 * ═══════════════════════════════════════════════════════════════════════════ */

function FullscreenFloatingPill({
  onExitFullscreen,
  zoomLevel,
  setZoomLevel,
}: {
  onExitFullscreen: () => void;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [zoomExpanded, setZoomExpanded] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 48) {
        if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
        setVisible(true);
      } else if (e.clientY > 120) {
        if (!hideTimerRef.current) {
          hideTimerRef.current = setTimeout(() => {
            setVisible(false);
            setZoomExpanded(false);
            hideTimerRef.current = null;
          }, 600);
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExitFullscreen();
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [onExitFullscreen]);

  if (!visible) return null;

  const pillBtnClass = "px-3 py-2 text-[12px] font-medium transition-colors hover:bg-white/20 dark:hover:bg-white/10 cursor-pointer min-h-[44px] flex items-center";

  return (
    <div
      data-doc-floating-pill
      className={[
        "fixed top-3 left-1/2 -translate-x-1/2 z-[250]",
        "flex items-center rounded-full",
        // Glassmorphism pill
        "bg-gray-900/70 dark:bg-gray-800/80 midnight:bg-[#0b1220]/80 purple:bg-[#1a0d2e]/80",
        "backdrop-blur-[20px] backdrop-saturate-[180%]",
        "border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        "text-white",
      ].join(" ")}
    >
      {/* Zoom controls */}
      {zoomExpanded ? (
        <div className="flex items-center">
          {[50, 75, 100, 125, 150, 200].map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => { setZoomLevel(z); setZoomExpanded(false); }}
              className={[
                pillBtnClass,
                z === zoomLevel ? "bg-white/20 font-semibold" : "",
                z === 50 ? "rounded-l-full pl-4" : "",
              ].join(" ")}
            >
              {z}%
            </button>
          ))}
          <div className="w-px h-5 bg-white/20" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setZoomExpanded(true)}
          className={`${pillBtnClass} rounded-l-full pl-4 gap-1.5`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          {zoomLevel}%
        </button>
      )}
      <div className="w-px h-5 bg-white/20" />
      {/* Exit button */}
      <button
        type="button"
        onClick={onExitFullscreen}
        className={`${pillBtnClass} rounded-r-full pr-4 gap-1.5`}
        aria-label="Exit full screen"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Exit</span>
        <kbd className="text-[10px] text-white/50 ml-1 hidden sm:inline">Esc</kbd>
      </button>
    </div>
  );
}

function TableGridPicker({
  onPick,
  maxRows = 8,
  maxCols = 10,
}: {
  onPick: (rows: number, cols: number) => void;
  maxRows?: number;
  maxCols?: number;
}) {
  const [hoverRow, setHoverRow] = useState(1);
  const [hoverCol, setHoverCol] = useState(1);
  return (
    <div className="w-[220px]">
      <div className="text-[11px] font-medium text-gray-600 dark:text-gray-300 mb-2">
        {hoverRow} × {hoverCol}
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
        {Array.from({ length: maxRows * maxCols }, (_, idx) => {
          const r = Math.floor(idx / maxCols) + 1;
          const c = (idx % maxCols) + 1;
          const active = r <= hoverRow && c <= hoverCol;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => {
                setHoverRow(r);
                setHoverCol(c);
              }}
              onClick={() => onPick(r, c)}
              className={`w-4 h-4 rounded border transition-colors ${
                active
                  ? "bg-blue-500/25 border-blue-400 dark:bg-blue-500/25 midnight:bg-cyan-500/25 purple:bg-pink-500/25 midnight:border-cyan-400 purple:border-pink-400"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              aria-label={`${r}x${c}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ToolbarButton({
  Icon,
  title,
  onClick,
  disabled,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip content={title} delay={400}>
      <button
        type="button"
        onMouseDown={(e) => {
          if (!disabled) e.preventDefault();
        }}
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
        className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100" />
      </button>
    </Tooltip>
  );
}

function EditingModeButton({
  docMode,
  onModeChange,
}: {
  docMode: "editing" | "suggesting" | "viewing";
  onModeChange: (mode: "editing" | "suggesting" | "viewing") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = docMode.charAt(0).toUpperCase() + docMode.slice(1);

  return (
    <div ref={ref} className="relative" data-editing-mode>
      <Tooltip content={`Current mode: ${label}`} delay={400}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-7 inline-flex items-center gap-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-[11px] font-medium text-gray-600 dark:text-gray-200"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>{label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </Tooltip>
      {open && (
        <div className="absolute z-[120] top-full mt-1 right-0 w-[180px] rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-xl py-1">
          {(["editing", "suggesting", "viewing"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => { onModeChange(mode); setOpen(false); }}
              className={`w-full px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${
                mode === docMode
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  MENTION SYSTEM — Reusable hook + popover for @mention tagging
 *  Used in: comment creation popover, sidebar reply, floating pill reply
 * ═══════════════════════════════════════════════════════════════════════════ */

type MentionUser = { id: string; name: string; avatar?: string };

function useMention({
  users,
  inputRef,
  value,
  onChange,
}: {
  users: MentionUser[];
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  value: string;
  onChange: (val: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [triggerPos, setTriggerPos] = useState(-1);

  const filtered = useMemo(() => {
    if (!active) return [];
    return users.filter((u) => !query || u.name.toLowerCase().includes(query.toLowerCase()));
  }, [active, query, users]);

  // Reset highlight when filtered results change
  useEffect(() => {
    setHighlightIdx(0);
  }, [filtered.length]);

  const insertMention = useCallback((user: MentionUser) => {
    if (triggerPos < 0) return;
    const before = value.slice(0, triggerPos);
    const after = value.slice(triggerPos + 1 + query.length);
    const newVal = `${before}@${user.name} ${after}`;
    onChange(newVal);
    setActive(false);
    setQuery("");
    setTriggerPos(-1);

    // Move cursor to after the inserted mention
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        const cursorPos = triggerPos + user.name.length + 2;
        el.focus();
        el.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }, [triggerPos, query, value, onChange, inputRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!active || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && active) {
      e.preventDefault();
      e.stopPropagation();
      insertMention(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setActive(false);
    }
  }, [active, filtered, highlightIdx, insertMention]);

  const handleChange = useCallback((newVal: string) => {
    onChange(newVal);
    const el = inputRef.current;
    if (!el) return;
    const cursorPos = (el as HTMLTextAreaElement).selectionStart ?? newVal.length;

    // Find the @ trigger before cursor
    const textBeforeCursor = newVal.slice(0, cursorPos);
    const lastAt = textBeforeCursor.lastIndexOf("@");

    if (lastAt >= 0) {
      // Check no space between @ and cursor (allow spaces in names like "John Smith")
      const afterAt = textBeforeCursor.slice(lastAt + 1);
      // Activate if we just typed @ or are typing a name query
      if (afterAt.length === 0 || /^[\w\s]{0,30}$/.test(afterAt)) {
        setActive(true);
        setQuery(afterAt);
        setTriggerPos(lastAt);
        return;
      }
    }
    setActive(false);
    setQuery("");
    setTriggerPos(-1);
  }, [onChange, inputRef]);

  return { active, filtered, highlightIdx, query, insertMention, handleKeyDown, handleChange, setActive };
}

function MentionPopover({
  users,
  highlightIdx,
  onSelect,
  position = "above",
}: {
  users: MentionUser[];
  highlightIdx: number;
  onSelect: (user: MentionUser) => void;
  position?: "above" | "below";
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const highlighted = listRef.current.querySelector("[data-mention-highlighted='true']");
    if (highlighted) highlighted.scrollIntoView({ block: "nearest" });
  }, [highlightIdx]);

  if (users.length === 0) return null;

  return (
    <div
      ref={listRef}
      data-mention-popover
      className={[
        "absolute left-0 w-full max-h-[180px] overflow-y-auto z-[250]",
        "rounded-xl border border-white/20 dark:border-gray-600/40",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
        "shadow-2xl shadow-black/10 dark:shadow-black/30",
        position === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5",
      ].join(" ")}
      role="listbox"
      aria-label="Mention suggestions"
    >
      <div className="py-1">
        {users.map((user, i) => (
          <button
            key={user.id}
            type="button"
            role="option"
            aria-selected={i === highlightIdx}
            data-mention-highlighted={i === highlightIdx ? "true" : undefined}
            data-mention-user-id={user.id}
            className={[
              "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer",
              i === highlightIdx
                ? "bg-blue-50/80 dark:bg-blue-900/30"
                : "hover:bg-gray-50/80 dark:hover:bg-gray-800/50",
            ].join(" ")}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(user)}
          >
            <CommentAvatar author={{ id: user.id, name: user.name, avatar: user.avatar }} size={28} />
            <div className="min-w-0 flex-1">
              <div className={[
                "text-[12px] font-medium truncate",
                i === highlightIdx ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200",
              ].join(" ")}>
                {user.name}
              </div>
            </div>
            {i === highlightIdx && (
              <span className="text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0">Enter</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Render text with @mentions as blue pill tokens */
function renderMentionPills(text: string) {
  const parts = text.split(/(@\w+(?:\s+\w+)?)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span
          key={i}
          data-mention-pill
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-semibold leading-none whitespace-nowrap"
        >
          <AtSign className="w-2.5 h-2.5 opacity-70" />
          {part.slice(1)}
        </span>
      );
    }
    return part;
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  FLOATING COMMENT PILL — Mode A (individual margin comments)
 *  Compact pill that expands on hover/click to show full interaction
 * ═══════════════════════════════════════════════════════════════════════════ */

function FloatingCommentPill({
  comment,
  isActive,
  onSelect,
  onScrollTo,
  onReply,
  onResolve,
  onReject,
  onReopen,
  onDelete,
  onOpenSidebar,
  isOwner,
  mentionableUsers = [],
}: {
  comment: DocComment;
  isActive: boolean;
  onSelect: () => void;
  onScrollTo: () => void;
  onReply: (text: string) => void;
  onResolve: (msg?: string) => void;
  onReject: (msg?: string) => void;
  onReopen?: () => void;
  onDelete: () => void;
  onOpenSidebar: () => void;
  isOwner: boolean;
  mentionableUsers?: MentionUser[];
}) {
  const [replyText, setReplyText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const isResolved = comment.status === "resolved" || comment.status === "rejected";
  const floatingReplyRef = useRef<HTMLTextAreaElement>(null);

  const mention = useMention({
    users: mentionableUsers,
    inputRef: floatingReplyRef,
    value: replyText,
    onChange: setReplyText,
  });

  const handleSubmitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(text);
    setReplyText("");
    mention.setActive(false);
  };

  return (
    <div
      data-doc-floating-pill={comment.id}
      className={[
        "pointer-events-auto rounded-lg border transition-all duration-200 cursor-pointer",
        isActive
          ? "border-blue-300/80 dark:border-blue-600/60 bg-white dark:bg-gray-900 shadow-lg ring-1 ring-blue-200/40"
          : "border-gray-200/80 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 hover:border-blue-200/60 hover:shadow-md",
      ].join(" ")}
      onClick={() => { onSelect(); onScrollTo(); }}
    >
      {/* Card content — always visible */}
      <div className="p-3">
        {/* Header: avatar + name + time + actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <CommentAvatar author={comment.author} size={24} />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 truncate">{comment.author.name}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500">{formatTimeAgo(comment.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" onClick={(e) => { e.stopPropagation(); onOpenSidebar(); }}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="Open in sidebar">
              <MessageCircle className="w-3 h-3 text-gray-400" />
            </button>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-[120px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl py-1 z-20">
                  {isOwner && !isResolved && (
                    <>
                      <button type="button" onClick={() => { onResolve(); setShowActions(false); }}
                        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">
                        <CheckCircle2 className="w-3 h-3" /> Resolve
                      </button>
                      <button type="button" onClick={() => { onReject(); setShowActions(false); }}
                        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {isResolved && onReopen && (
                    <button type="button" onClick={() => { onReopen(); setShowActions(false); }}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                      <Reply className="w-3 h-3" /> Reopen
                    </button>
                  )}
                  <button type="button" onClick={() => { onDelete(); setShowActions(false); }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                    <X className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected text excerpt */}
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 px-2 py-1 bg-yellow-50/60 dark:bg-yellow-900/15 rounded border-l-2 border-yellow-400 dark:border-yellow-600 line-clamp-2">
          &ldquo;{comment.selectedText}&rdquo;
        </div>

        {/* Comment body */}
        <p className="text-[11px] text-gray-700 dark:text-gray-200 leading-relaxed">
          {renderMentionPills(comment.text)}
        </p>

        {/* Reply count indicator (collapsed) */}
        {!isActive && comment.replies.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-400">
            <CornerDownRight className="w-3 h-3" />
            <span>{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
          </div>
        )}
      </div>

      {/* Expanded section — replies + reply input (only when active) */}
      {isActive && (
        <div className="border-t border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="px-3 pt-2 pb-1 space-y-2 max-h-[160px] overflow-y-auto">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <CommentAvatar author={reply.author} size={20} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{reply.author.name}</span>
                      <span className="text-[9px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">{renderMentionPills(reply.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply input with @mention support */}
          <div className="px-3 py-2">
            <div className="relative">
              <textarea
                ref={floatingReplyRef}
                placeholder="Reply... (@ to mention)"
                value={replyText}
                onChange={(e) => mention.handleChange(e.target.value)}
                onKeyDown={(e) => {
                  mention.handleKeyDown(e);
                  if (!mention.active && e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitReply();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                rows={2}
              />
              {mention.active && (
                <MentionPopover
                  users={mention.filtered}
                  highlightIdx={mention.highlightIdx}
                  onSelect={(u) => mention.insertMention(u)}
                />
              )}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3 h-3" />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  COMMENT SYSTEM UI COMPONENTS
 *  Avatar, Card, Thread, Reply input with @mention support
 * ═══════════════════════════════════════════════════════════════════════════ */

function CommentAvatar({ author, size = 28 }: { author: CommentAuthor; size?: number }) {
  const bgColors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-indigo-500"];
  const hash = author.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bgColor = bgColors[hash % bgColors.length];
  const initials = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden ${bgColor}`}
      style={{ width: size, height: size }}
    >
      {author.avatar ? (
        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ fontSize: size * 0.4 }}>
          {initials}
        </div>
      )}
    </div>
  );
}

function CommentCard({
  comment,
  isActive,
  onSelect,
  onReply,
  onResolve,
  onReject,
  onReopen,
  onDelete,
  isOwner,
  currentAuthor,
  mentionableUsers,
  filterFade = false,
}: {
  comment: DocComment;
  isActive: boolean;
  onSelect: () => void;
  onReply: (text: string) => void;
  onResolve: (msg?: string) => void;
  onReject: (msg?: string) => void;
  onReopen?: () => void;
  onDelete: () => void;
  isOwner: boolean;
  currentAuthor: CommentAuthor;
  mentionableUsers: Array<{ id: string; name: string; avatar?: string }>;
  filterFade?: boolean;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const isResolved = comment.status === "resolved" || comment.status === "rejected";

  const mention = useMention({
    users: mentionableUsers,
    inputRef: replyRef,
    value: replyText,
    onChange: setReplyText,
  });

  useEffect(() => {
    if (!showActions) return;
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) setShowActions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions]);

  const handleSubmitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(text);
    setReplyText("");
    setShowReplyInput(false);
    mention.setActive(false);
  };

  const timeAgo = formatTimeAgo(comment.createdAt);

  return (
    <div
      data-doc-comment-card={comment.id}
      data-active={isActive ? "true" : undefined}
      data-resolved={isResolved ? "true" : undefined}
      data-filter-fade={filterFade && isResolved ? "true" : undefined}
      onClick={onSelect}
      className={[
        "rounded-xl border p-2.5 transition-all duration-200 cursor-pointer group",
        isActive
          ? "border-blue-300 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-200/50 dark:ring-blue-700/30"
          : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm",
        isResolved ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* Header: author + time + actions */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <CommentAvatar author={comment.author} size={24} />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 truncate">{comment.author.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo}</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {/* Status badge for resolved/rejected */}
          {comment.status === "resolved" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-1">
              Resolved
            </span>
          )}
          {comment.status === "rejected" && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-1">
              Rejected
            </span>
          )}
          {/* Quick actions for open comments: resolve (check) and reject (x) */}
          {!isResolved && isOwner && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Tooltip content="Resolve" delay={300}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onResolve(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                </button>
              </Tooltip>
              <Tooltip content="Reject" delay={300}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onReject(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-400 dark:text-red-400" />
                </button>
              </Tooltip>
            </div>
          )}
          {/* Reopen button for resolved/rejected comments */}
          {isResolved && onReopen && (
            <Tooltip content="Reopen" delay={300}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReopen(); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
              >
                <RotateCw className="w-3 h-3 text-blue-500 dark:text-blue-400" />
              </button>
            </Tooltip>
          )}
          {/* Reply button for open comments */}
          {!isResolved && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); }}
              className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title="Reply"
            >
              <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
          {/* More actions menu */}
          <div ref={actionsRef} className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
              className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl py-1 z-10">
                {isOwner && !isResolved && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onResolve(); setShowActions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onReject(); setShowActions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                )}
                {isResolved && onReopen && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onReopen(); setShowActions(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Reopen
                  </button>
                )}
                {(isOwner || currentAuthor.id === comment.author.id) && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); setShowActions(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab indicator */}
      {comment.tabId && (
        <div className="mb-1">
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {comment.tabId.replace("tab-", "Tab ")}
          </span>
        </div>
      )}

      {/* Selected text excerpt */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 px-1.5 py-1 bg-yellow-50/60 dark:bg-yellow-900/15 rounded border-l-2 border-yellow-400 dark:border-yellow-600 line-clamp-1">
        &ldquo;{comment.selectedText}&rdquo;
      </div>

      {/* Comment body */}
      <p className="text-[12px] text-gray-700 dark:text-gray-200 leading-relaxed mb-1.5">
        {renderMentionPills(comment.text)}
      </p>

      {/* Resolution info */}
      {comment.resolution && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 italic mb-1.5 flex items-center gap-1">
          {comment.resolution.action === "resolved" ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : (
            <XCircle className="w-3 h-3 text-red-500" />
          )}
          {comment.resolution.action === "resolved" ? "Resolved" : "Rejected"} by {comment.resolution.by.name}
          {comment.resolution.message && ` — "${comment.resolution.message}"`}
        </div>
      )}

      {/* Replies thread */}
      {comment.replies.length > 0 && (
        <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              <CommentAvatar author={reply.author} size={20} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{reply.author.name}</span>
                  <span className="text-[9px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  {renderMentionPills(reply.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {!isResolved && (
        <div className="mt-2">
          {showReplyInput ? (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <textarea
                  ref={replyRef}
                  autoFocus
                  value={replyText}
                  onChange={(e) => mention.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    mention.handleKeyDown(e);
                    if (!mention.active && e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitReply();
                    if (e.key === "Escape" && !mention.active) { setShowReplyInput(false); setReplyText(""); }
                  }}
                  placeholder="Reply... (@ to mention)"
                  className="w-full text-[11px] text-gray-700 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 resize-none outline-none focus:ring-2 focus:ring-blue-400/40 placeholder-gray-400"
                  rows={2}
                />
                {mention.active && (
                  <MentionPopover
                    users={mention.filtered}
                    highlightIdx={mention.highlightIdx}
                    onSelect={(u) => mention.insertMention(u)}
                  />
                )}
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowReplyInput(false); setReplyText(""); }}
                  className="text-[10px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSubmitReply(); }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-blue-500 hover:bg-blue-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  Reply
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); }}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

