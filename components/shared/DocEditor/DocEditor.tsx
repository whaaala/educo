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
import { ColorGrid, TabbedColorPalette, SOLID_COLORS, TEXT_COLORS_MATRIX, TEXT_GRADIENT_COLORS, GLOSSY_COLORS, BORDER_COLORS, CELL_BG_COLORS, colorToCSS } from "@/components/shared/ColorPalettePicker";
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
}: DocEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const latestValueRef = useRef<DocEditorValue>(value);
  const editorRootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pagesRef = useRef<string[]>(parseHtmlPages(value.html));
  const lastSerializedHtmlRef = useRef<string>("");
  const paginateRafRef = useRef<number | null>(null);
  const paginationInProgressRef = useRef(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const openFileInputRef = useRef<HTMLInputElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"file" | "edit" | "view" | "insert" | "format" | "tools" | "extensions" | "help" | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [languageQuery, setLanguageQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showNonPrinting, setShowNonPrinting] = useState(false);
  const [showPrintLayout, setShowPrintLayout] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showEquationToolbar, setShowEquationToolbar] = useState(false);
  const [docMode, setDocMode] = useState<"editing" | "suggesting" | "viewing">("editing");
  const [isChromeCollapsed, setIsChromeCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const [pageWidthPx, setPageWidthPx] = useState(860);
  const [pagePaddingPx, setPagePaddingPx] = useState(40);
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

  const canEdit = !readOnly && docMode !== "viewing";

  const isDocEmpty = useMemo(() => {
    const text = (pages[0] || "").replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
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

  // Keep pages in sync when value.html changes externally
  useEffect(() => {
    if (value.html === lastSerializedHtmlRef.current) return;
    const nextPages = parseHtmlPages(value.html);
    setPages(nextPages);
    pagesRef.current = nextPages;
  }, [value.html]);

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
    const nextHtml = serializeHtmlPages(nextPages);
    lastSerializedHtmlRef.current = nextHtml;
    updateValue({ html: nextHtml });
  }, [updateValue]);

  const rebalancePages = useCallback(() => {
    if (!showPrintLayout) return;
    if (paginationInProgressRef.current) return;
    paginationInProgressRef.current = true;
    try {
      const pageCount = pagesRef.current.length;

      // Push overflow forward
      for (let i = 0; i < pageCount; i++) {
        const pageEl = pageRefs.current[i];
        if (!pageEl) continue;
        // Ensure we have a next page if needed.
        while (pageEl.scrollHeight > pageEl.clientHeight + 2) {
          const nextEl = pageRefs.current[i + 1];
          if (!nextEl) {
            const nextPages = [...pagesRef.current, "<p></p>"];
            pagesRef.current = nextPages;
            setPages(nextPages);
            // Continue pagination once the new page mounts.
            setTimeout(() => rebalancePages(), 0);
            return;
          }
          const last = pageEl.lastChild;
          if (!last) break;
          // If we can't move anything else, stop.
          if (pageEl.childNodes.length <= 1) {
            const only = pageEl.lastElementChild;
            if (only && only.tagName === "P") {
              const words = (only.textContent || "").trim().split(/\s+/).filter(Boolean);
              if (words.length < 10) break;
              // Move roughly half the words to the next page; adjust by binary search.
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
                if (!ok) {
                  // Revert and try a different split.
                  p.remove();
                  only.textContent = original;
                } else {
                  // Keep this split, but remove the inserted paragraph so caller can finalize.
                  p.remove();
                  only.textContent = original;
                }
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

      // Pull content back when there is space
      for (let i = 0; i < pagesRef.current.length - 1; i++) {
        const pageEl = pageRefs.current[i];
        const nextEl = pageRefs.current[i + 1];
        if (!pageEl || !nextEl) continue;
        while (nextEl.firstChild) {
          const node = nextEl.firstChild;
          pageEl.appendChild(node);
          if (pageEl.scrollHeight > pageEl.clientHeight + 2) {
            // Revert if it overflowed.
            nextEl.insertBefore(node, nextEl.firstChild);
            break;
          }
        }
      }

      // Trim trailing empty pages
      while (pagesRef.current.length > 1) {
        const lastIdx = pagesRef.current.length - 1;
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
      }

      // Persist DOM after any reflow/moves.
      flushDomToState();
    } finally {
      paginationInProgressRef.current = false;
    }
  }, [flushDomToState, showPrintLayout]);

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
  }, []);

  // ── Sidebar tab management ──
  // Helper to load HTML into the editor without calling onChange during render.
  // We update pages state and let React re-render the contentEditable divs via
  // their ref callbacks — do NOT touch editorRootRef.innerHTML directly.
  const loadTabContent = useCallback((html: string) => {
    const newPages = parseHtmlPages(html);
    if (newPages.length === 0) newPages.push("");
    pagesRef.current = newPages;
    setPages([...newPages]);
    // Also sync each page div's innerHTML via refs
    requestAnimationFrame(() => {
      newPages.forEach((pageHtml, idx) => {
        const el = pageRefs.current[idx];
        if (el && el.innerHTML !== pageHtml) el.innerHTML = pageHtml;
      });
    });
    // Defer onChange to avoid setState-during-render
    setTimeout(() => onChange({ ...latestValueRef.current, html }), 0);
  }, [onChange]);

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
  const maxContentWidth = pageWidthPx - 2 * pagePaddingPx - 2;
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
        const maxW = pageWidthPx - 2 * pagePaddingPx - 2;
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
    [commitWidgetSoon, showToast, updateTableWidgetModel, pageWidthPx, pagePaddingPx]
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

  const handleSaveOffline = () => {
    try {
      const key = `educo_doc_offline_${safeFilename(docTitle)}`;
      localStorage.setItem(key, JSON.stringify({ ...value, title: docTitle }));
      showToast("Saved for offline use");
    } catch {
      showToast("Offline save failed");
    }
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

  const findAndSelect = (query: string) => {
    const els = pageRefs.current
      .slice(0, pagesRef.current.length)
      .filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return false;
    const pageTexts = els.map((el) => (el.innerText || "").toLowerCase());
    const combined = pageTexts.join("\n\n");
    if (!query) return false;
    const needle = query.toLowerCase();
    const idx = combined.indexOf(needle, lastFindIndexRef.current);
    const foundAt = idx >= 0 ? idx : combined.indexOf(needle, 0);
    if (foundAt < 0) return false;

    // Map global index to a page + local index
    let acc = 0;
    let pageIdx = 0;
    for (let i = 0; i < pageTexts.length; i++) {
      const len = pageTexts[i].length;
      if (foundAt < acc + len) {
        pageIdx = i;
        break;
      }
      acc += len + 2; // "\n\n"
    }
    const localFoundAt = Math.max(0, foundAt - acc);

    const root = els[pageIdx];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let cur = walker.nextNode() as Text | null;
    let pos = 0;
    while (cur) {
      const len = cur.data.length;
      const start = localFoundAt - pos;
      const end = start + query.length;
      if (start >= 0 && end <= len) {
        const range = document.createRange();
        range.setStart(cur, start);
        range.setEnd(cur, end);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        lastFindIndexRef.current = foundAt + query.length;
        return true;
      }
      pos += len;
      cur = walker.nextNode() as Text | null;
    }
    return false;
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
    const contentW = pageWidthPx - 2 * pagePaddingPx - 2;
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

  const handleInsertImageFromFile = async (file: File) => {
    if (!canEdit) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
    focusEditor();
    exec(
      "insertHTML",
      `<img src="${dataUrl}" alt="" style="max-width:100%;border-radius:12px;margin:12px 0;" />`
    );
    emitChange();
  };

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
      {isFullscreen && (
        <div className="absolute top-3 right-3 z-[220]">
          <Tooltip content="Exit full screen (Esc)" delay={400}>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur hover:bg-white dark:hover:bg-gray-900 transition-colors cursor-pointer"
            aria-label="Exit full screen"
          >
            Exit full screen <span className="text-gray-400 dark:text-gray-500">(Esc)</span>
          </button>
          </Tooltip>
        </div>
      )}

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
                    const maxW = pageWidthPx - 2 * pagePaddingPx - 2;
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
                                  const maxTableW = pageWidthPx - 2 * pagePaddingPx - 2;
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

      {/* Hidden image picker */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
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
      <div className="relative z-[50] px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/70 dark:bg-gray-900/40 midnight:bg-[#0d1526]/60 purple:bg-[#1f1035]/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <input
                ref={titleInputRef}
                value={docTitle}
                onChange={(e) => updateValue({ title: e.target.value })}
                disabled={!canEdit}
                className="min-w-0 w-full max-w-[420px] bg-transparent text-[18px] font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 outline-none rounded-md px-2 py-1 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 focus:bg-white/70 dark:focus:bg-gray-800/60 transition-colors"
                aria-label="Document title"
              />
              <Tooltip content="Star" delay={400}>
                <button
                  type="button"
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <Star className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDialog("share")}
            className="ml-auto px-4 py-1.5 rounded-full text-[13px] font-semibold text-white bg-[#1a73e8] hover:bg-[#1765cc] shadow-sm transition-colors cursor-pointer"
          >
            Share
          </button>
        </div>

        {/* Menubar */}
        <div
          data-doc-menubar
          className="mt-2 flex items-center gap-2 text-[13px] text-gray-700 dark:text-gray-200 select-none"
        >
          <MenuRoot
            id="file"
            label="File"
            openMenu={openMenu}
            onOpen={(id) => setOpenMenu(id)}
            onClose={() => setOpenMenu(null)}
          >
            <MenuPanel>
            <MenuItem label="New" onClick={handleNewDoc} />
            <MenuItem label="Open" shortcut="Ctrl+O" onClick={handleOpenFile} />
            <MenuItem label="Make a copy" onClick={handleMakeCopy} />
            <MenuDivider />
            <MenuItem
              label="Share"
              hasSubmenu
              onHover={() => setOpenSubmenu("file-share")}
              onClick={() => setOpenSubmenu("file-share")}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-share"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <MenuItem label="Share with others" icon={UserPlus} onClick={() => setDialog("share")} />
                  <MenuItem label="Publish" icon={Globe} onClick={() => setDialog("publish")} />
                </SubmenuPanel>
              }
            />
            <MenuItem
              label="Email"
              hasSubmenu
              onHover={() => setOpenSubmenu("file-email")}
              onClick={() => setOpenSubmenu("file-email")}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-email"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <MenuItem label="Email this document" icon={Mail} onClick={handleEmail} />
                  <MenuItem label="Copy email-ready text" icon={Copy} onClick={() => handleShareCopy("text")} />
                </SubmenuPanel>
              }
            />
            <MenuItem
              label="Download"
              hasSubmenu
              onHover={() => setOpenSubmenu("file-download")}
              onClick={() => setOpenSubmenu("file-download")}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-download"}
              submenu={
                <SubmenuPanel className="w-[260px]">
                  <MenuItem label="Microsoft Word (.doc)" icon={Download} onClick={() => handleDownload("docx")} />
                  <MenuItem label="PDF document (.pdf)" icon={Download} onClick={() => handleDownload("pdf")} />
                  <MenuItem label="OpenDocument format (.odt)" icon={Download} onClick={() => handleDownload("odt")} />
                  <MenuItem label="Plain text (.txt)" icon={Download} onClick={() => handleDownload("txt")} />
                  <MenuItem label="Rich Text Format (.rtf)" icon={Download} onClick={() => handleDownload("rtf")} />
                  <MenuItem label="Web page (.html)" icon={Download} onClick={() => handleDownload("html")} />
                  <MenuItem label="EPUB publication (.epub)" icon={Download} onClick={() => handleDownload("epub")} />
                  <MenuItem label="Markdown (.md)" icon={Download} onClick={() => handleDownload("md")} />
                  <MenuDivider />
                  <MenuItem label="JSON (.json)" icon={Download} onClick={() => handleDownload("json")} />
                </SubmenuPanel>
              }
            />
            <MenuDivider />
            <MenuItem label="Rename" onClick={handleRename} />
            <MenuDivider />
            <MenuItem
              label="Version history"
              hasSubmenu
              onHover={() => setOpenSubmenu("file-versions")}
              onClick={() => setOpenSubmenu("file-versions")}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "file-versions"}
              submenu={
                <SubmenuPanel className="w-[260px]">
                  <MenuItem
                    label="Save version"
                    onClick={() => {
                      saveVersion("Manual save", "manual");
                      showToast("Version saved");
                      setDialog("versions");
                    }}
                  />
                  <MenuItem label="View versions" onClick={() => setDialog("versions")} />
                </SubmenuPanel>
              }
            />
            <MenuItem label="Make available offline" onClick={handleSaveOffline} />
            <MenuDivider />
            <MenuItem label="Details" onClick={() => setDialog("details")} />
            <MenuItem label="Security limitations" onClick={() => setDialog("security")} />
            <MenuDivider />
            <MenuItem
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
                    <MenuItem
                      key={l.tag}
                      label={l.label}
                      onClick={() => {
                        const prevLang = language;
                        const nextLang = l.tag;

                        // Save current HTML under current language.
                        htmlByLanguageRef.current.set(prevLang, latestValueRef.current.html);

                        // If we've already produced content for the next language,
                        // restore it immediately (so switching back is exact).
                        const existing = htmlByLanguageRef.current.get(nextLang);
                        if (existing) {
                          updateValue({ language: nextLang, html: existing });
                          return;
                        }

                        updateValue({ language: nextLang });
                        // Best-effort translation so the change is visible immediately.
                        // Note: This converts the current document to plain text.
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
            <MenuItem label="Page setup" onClick={() => setDialog("pageSetup")} />
            <MenuItem
              label="Print"
              shortcut="Ctrl+P"
              onClick={() => {
                // Avoid browser print preview; export a PDF instead.
                handleDownload("pdf");
              }}
            />
            </MenuPanel>
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
            <MenuPanel>
            <MenuItem label="Undo" shortcut="Ctrl+Z" onClick={() => handleCommand("undo")} />
            <MenuItem label="Redo" shortcut="Ctrl+Y" onClick={() => handleCommand("redo")} />
            <MenuDivider />
            <MenuItem label="Cut" shortcut="Ctrl+X" icon={Scissors} onClick={() => handleCommand("cut")} />
            <MenuItem label="Copy" shortcut="Ctrl+C" icon={Copy} onClick={() => handleCommand("copy")} />
            <MenuItem label="Paste" shortcut="Ctrl+V" icon={ClipboardPaste} onClick={() => handlePaste(false)} />
            <MenuItem label="Paste without formatting" shortcut="Ctrl+Shift+V" icon={ClipboardPaste} onClick={() => handlePaste(true)} />
            <MenuDivider />
            <MenuItem label="Select all" shortcut="Ctrl+A" onClick={() => handleCommand("selectAll")} />
            <MenuItem label="Delete" onClick={() => handleCommand("delete")} />
            <MenuDivider />
            <MenuItem label="Find and replace" shortcut="Ctrl+H" icon={Search} onClick={() => setDialog("findReplace")} />
            </MenuPanel>
          </MenuRoot>

        {/* View menu */}
          <MenuRoot
            id="view"
            label="View"
            openMenu={openMenu}
            onOpen={(id) => setOpenMenu(id)}
            onClose={() => setOpenMenu(null)}
          >
            <MenuPanel>
            <MenuItem
              label="Mode"
              hasSubmenu
              onHover={() => setOpenSubmenu("view-mode")}
              onClick={() => setOpenSubmenu((prev) => (prev === "view-mode" ? null : "view-mode"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "view-mode"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <MenuItem
                    label="Editing"
                    isChecked={docMode === "editing"}
                    onClick={() => {
                      setDocMode("editing");
                      showToast("Mode: Editing");
                    }}
                  />
                  <MenuItem
                    label="Suggesting"
                    isChecked={docMode === "suggesting"}
                    onClick={() => {
                      setDocMode("suggesting");
                      showToast("Mode: Suggesting");
                    }}
                  />
                  <MenuItem
                    label="Viewing"
                    isChecked={docMode === "viewing"}
                    onClick={() => {
                      setDocMode("viewing");
                      showToast("Mode: Viewing");
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <MenuItem label="Comments" icon={MessageSquare} isChecked={showComments} onClick={() => setShowComments((v) => !v)} />
            <MenuItem
              label="Collapse tabs and outlines sidebar"
              shortcut="Ctrl+Alt+A Ctrl+Alt+H"
              isChecked={isSidebarCollapsed}
              onClick={() => {
                setIsSidebarCollapsed((v) => {
                  const next = !v;
                  showToast(next ? "Sidebar collapsed" : "Sidebar expanded");
                  return next;
                });
              }}
            />
            <MenuDivider />
            <MenuItem
              label="Show print layout"
              isChecked={showPrintLayout}
              onClick={() => setShowPrintLayout((v) => !v)}
            />
            <MenuItem
              label="Show ruler"
              isChecked={showRuler}
              onClick={() => setShowRuler((v) => !v)}
            />
            <MenuItem label="Show equation toolbar" isChecked={showEquationToolbar} onClick={() => setShowEquationToolbar((v) => !v)} />
            <MenuItem
              label="Show non-printing characters"
              shortcut="Ctrl+Shift+P"
              isChecked={showNonPrinting}
              onClick={() => setShowNonPrinting((v) => !v)}
            />
            <MenuDivider />
            <MenuItem
              label="Full screen"
              icon={Eye}
              isChecked={isFullscreen}
              onClick={() => setIsFullscreen((v) => !v)}
            />
            </MenuPanel>
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
            <MenuPanel>
            <MenuItem
              label="Image"
              hasSubmenu
              icon={ImageIcon}
              onHover={() => setOpenSubmenu("insert-image")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-image" ? null : "insert-image"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-image"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <MenuItem label="Upload from computer" onClick={() => imageInputRef.current?.click()} />
                  <MenuItem
                    label="Search the web"
                    onClick={() => {
                      const q = window.prompt("Search images for…");
                      if (!q) return;
                      window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`, "_blank");
                    }}
                  />
                  <MenuItem
                    label="Drive"
                    onClick={() => {
                      showToast("Pick an image (Drive integration optional)");
                      imageInputRef.current?.click();
                    }}
                  />
                  <MenuItem
                    label="Photos"
                    onClick={() => {
                      showToast("Pick an image (Photos integration optional)");
                      imageInputRef.current?.click();
                    }}
                  />
                  <MenuItem
                    label="Camera"
                    onClick={() => {
                      // Best-effort: use a temporary capture input when supported.
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      (input as any).capture = "environment";
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        await handleInsertImageFromFile(file);
                      };
                      input.click();
                    }}
                  />
                  <MenuItem
                    label="By URL"
                    onClick={() => {
                      const url = window.prompt("Image URL");
                      if (!url) return;
                      focusEditor();
                      exec("insertHTML", `<img src="${url}" alt="" style="max-width:100%;border-radius:12px;margin:12px 0;" />`);
                      emitChange();
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <MenuItem
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
            <MenuItem
              label="Building blocks"
              hasSubmenu
              icon={LayoutTemplate}
              onHover={() => setOpenSubmenu("insert-blocks")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-blocks" ? null : "insert-blocks"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-blocks"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <MenuItem label="Meeting notes" icon={FileText} onClick={() => handleTemplateInsert(resolvedTemplates[0])} />
                  <MenuItem label="Email draft" icon={Mail} onClick={() => handleTemplateInsert(resolvedTemplates[1])} />
                  <MenuItem
                    label="Simple decision log"
                    onClick={() => {
                      handleTemplateInsert({
                        id: "decision-log",
                        label: "Decision log",
                        html: `<h2>Decision log</h2><table style="border-collapse:collapse;width:100%;margin:12px 0;"><tr><td style="border:1px solid #e5e7eb;padding:8px;">Decision</td><td style="border:1px solid #e5e7eb;padding:8px;">Owner</td><td style="border:1px solid #e5e7eb;padding:8px;">Date</td></tr><tr><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td><td style="border:1px solid #e5e7eb;padding:8px;">&nbsp;</td></tr></table>`,
                      });
                    }}
                  />
                  <MenuDivider />
                  <MenuItem label="View more" onClick={() => setMoreOpen(true)} />
                </SubmenuPanel>
              }
            />
            <MenuItem
              label="Smart chips"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-chips")}
              onClick={() => setOpenSubmenu((prev) => (prev?.startsWith("insert-chips") ? null : "insert-chips"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu?.startsWith("insert-chips")}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <MenuItem
                    label="Date"
                    icon={Calendar}
                    onClick={() => {
                      const d = new Date().toISOString().slice(0, 10);
                      exec("insertHTML", `<span style="padding:2px 8px;border-radius:999px;background:#eff6ff;border:1px solid #bfdbfe;">${d}</span>`);
                      emitChange();
                    }}
                  />
                  <MenuItem
                    label="People"
                    icon={User}
                    onClick={() => {
                      const name = window.prompt("Person name");
                      if (!name) return;
                      insertChip("Person", name);
                    }}
                  />
                  <MenuItem
                    label="File"
                    icon={FileIcon}
                    onClick={() => {
                      const name = window.prompt("File name");
                      if (!name) return;
                      insertChip("File", name);
                    }}
                  />
                  <MenuItem
                    label="Place"
                    icon={MapPin}
                    onClick={() => {
                      const name = window.prompt("Place");
                      if (!name) return;
                      insertChip("Place", name);
                    }}
                  />
                  <MenuItem
                    label="Placeholder chips"
                    hasSubmenu
                    onHover={() => setOpenSubmenu("insert-chips-placeholders")}
                    onClick={() =>
                      setOpenSubmenu((prev) =>
                        prev === "insert-chips-placeholders" ? "insert-chips" : "insert-chips-placeholders"
                      )
                    }
                    onLeave={() => setOpenSubmenu("insert-chips")}
                    isSubmenuOpen={openSubmenu === "insert-chips-placeholders"}
                    submenu={
                      <SubmenuPanel className="w-[220px]">
                        <MenuItem label="Document title" onClick={() => insertChip("Title", docTitle)} />
                        <MenuItem label="Today" onClick={() => insertChip("Date", new Date().toLocaleDateString())} />
                        <MenuItem label="Email" onClick={() => insertChip("Email", "name@example.com")} />
                      </SubmenuPanel>
                    }
                  />
                  <MenuDivider />
                  <MenuItem
                    label="Drop-down"
                    onClick={() => {
                      exec("insertHTML", `<select style="padding:6px 10px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;"><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>&nbsp;`);
                      emitChange();
                    }}
                  />
                </SubmenuPanel>
              }
            />
            <MenuItem
              label="eSignature"
              onClick={() => {
                exec("insertHTML", `<div style="margin:12px 0;padding:12px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc;"><strong>Signature</strong><div style="height:32px;"></div><div style="border-top:1px solid #cbd5e1;width:240px;"></div></div>`);
                emitChange();
              }}
            />
            <MenuItem label="Link" shortcut="Ctrl+K" onClick={() => {
              const url = window.prompt("Enter URL");
              if (!url) return;
              handleCommand("createLink", url);
            }} />
            <MenuItem
              label="Drawing"
              onClick={() => {
                insertSvg(`<svg width="520" height="180" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="178" rx="14" fill="#f3f4f6" stroke="#e5e7eb"/><text x="260" y="92" text-anchor="middle" font-family="Inter, Arial" font-size="14" fill="#6b7280">Drawing placeholder</text></svg>`);
              }}
            />
            <MenuItem
              label="Chart"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-chart")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-chart" ? null : "insert-chart"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-chart"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <MenuItem label="Bar" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><rect x="80" y="120" width="50" height="60" rx="8" fill="#3b82f6"/><rect x="160" y="90" width="50" height="90" rx="8" fill="#22c55e"/><rect x="240" y="140" width="50" height="40" rx="8" fill="#eab308"/><rect x="320" y="70" width="50" height="110" rx="8" fill="#ef4444"/><line x1="60" y1="180" x2="460" y2="180" stroke="#e5e7eb"/></svg>`)} />
                  <MenuItem label="Column" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><rect x="80" y="120" width="50" height="60" rx="8" fill="#3b82f6"/><rect x="160" y="90" width="50" height="90" rx="8" fill="#22c55e"/><rect x="240" y="140" width="50" height="40" rx="8" fill="#eab308"/><rect x="320" y="70" width="50" height="110" rx="8" fill="#8b5cf6"/><line x1="60" y1="180" x2="460" y2="180" stroke="#e5e7eb"/></svg>`)} />
                  <MenuItem label="Line" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><polyline points="70,160 160,120 250,150 340,90 430,110" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="160" r="5" fill="#3b82f6"/><circle cx="160" cy="120" r="5" fill="#3b82f6"/><circle cx="250" cy="150" r="5" fill="#3b82f6"/><circle cx="340" cy="90" r="5" fill="#3b82f6"/><circle cx="430" cy="110" r="5" fill="#3b82f6"/></svg>`)} />
                  <MenuItem label="Pie" onClick={() => insertSvg(`<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="518" height="218" rx="14" fill="#ffffff" stroke="#e5e7eb"/><g transform="translate(160,110)"><circle r="70" fill="#f3f4f6"/><path d="M0 0 L70 0 A70 70 0 0 1 -22 66 Z" fill="#3b82f6"/><path d="M0 0 L-22 66 A70 70 0 0 1 -70 0 Z" fill="#22c55e"/><path d="M0 0 L-70 0 A70 70 0 0 1 0 -70 Z" fill="#eab308"/><path d="M0 0 L0 -70 A70 70 0 0 1 70 0 Z" fill="#ef4444"/></g></svg>`)} />
                  <MenuDivider />
                  <MenuItem label="From Sheets" onClick={() => showToast("Sheets: add Google integration to enable")} />
                </SubmenuPanel>
              }
            />
            <MenuItem
              label="Symbols"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-symbols")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-symbols" ? null : "insert-symbols"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-symbols"}
              submenu={
                <SubmenuPanel className="w-[220px]">
                  <MenuItem label="Emoji" icon={Smile} onClick={() => {
                    const e = window.prompt("Emoji");
                    if (!e) return;
                    exec("insertText", e);
                    emitChange();
                  }} />
                  <MenuItem label="Special characters" icon={Sigma} onClick={() => {
                    const ch = window.prompt("Character");
                    if (!ch) return;
                    exec("insertText", ch);
                    emitChange();
                  }} />
                  <MenuItem label="Equation" icon={Sigma} onClick={() => {
                    const eq = window.prompt("Equation (LaTeX/plain)");
                    if (!eq) return;
                    exec("insertHTML", `<span style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;padding:2px 6px;border-radius:8px;background:#f3f4f6;border:1px solid #e5e7eb;">${eq}</span>&nbsp;`);
                    emitChange();
                  }} />
                </SubmenuPanel>
              }
            />
            <MenuDivider />
            <MenuItem
              label="Tab"
              shortcut="Shift+F11"
              onClick={() => {
                exec("insertHTML", "<span>&emsp;</span>");
                emitChange();
              }}
            />
            <MenuItem label="Horizontal line" onClick={handleInsertHorizontalLine} />
            <MenuItem
              label="Break"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-break")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-break" ? null : "insert-break"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-break"}
              submenu={
                <SubmenuPanel className="w-[250px]">
                  <MenuItem label="Page break" shortcut="Ctrl+Enter" onClick={handleInsertPageBreak} />
                  <MenuItem label="Column break" onClick={() => { exec("insertHTML", `<div style="border-top:1px dashed #e5e7eb;margin:16px 0;"><em>Column break</em></div>`); emitChange(); }} />
                  <MenuItem label="Section break (next page)" onClick={() => { exec("insertHTML", `<div style="border-top:1px dashed #e5e7eb;margin:16px 0;"><em>Section break (next page)</em></div>`); emitChange(); }} />
                  <MenuItem label="Section break (continuous)" onClick={() => { exec("insertHTML", `<div style="border-top:1px dashed #e5e7eb;margin:16px 0;"><em>Section break (continuous)</em></div>`); emitChange(); }} />
                </SubmenuPanel>
              }
            />
            <MenuItem label="Bookmark" icon={Bookmark} onClick={insertBookmark} />
            <MenuItem
              label="Page elements"
              hasSubmenu
              onHover={() => setOpenSubmenu("insert-elements")}
              onClick={() => setOpenSubmenu((prev) => (prev === "insert-elements" ? null : "insert-elements"))}
              onLeave={() => setOpenSubmenu(null)}
              isSubmenuOpen={openSubmenu === "insert-elements"}
              submenu={
                <SubmenuPanel className="w-[240px]">
                  <MenuItem label="Table of contents" onClick={insertTOC} />
                  <MenuItem label="Header" onClick={() => { focusEditor(); exec("insertHTML", "<h3>Header</h3>"); emitChange(); }} />
                  <MenuItem label="Footer" onClick={() => { focusEditor(); exec("insertHTML", "<h3>Footer</h3>"); emitChange(); }} />
                  <MenuItem label="Watermark" onClick={() => { focusEditor(); exec("insertHTML", `<p style="text-align:center;opacity:0.18;font-size:36px;font-weight:700;letter-spacing:0.12em;">WATERMARK</p>`); emitChange(); }} />
                </SubmenuPanel>
              }
            />
            </MenuPanel>
          </MenuRoot>

          {/* Format menu */}
          <MenuRoot id="format" label="Format" openMenu={openMenu} onOpen={(id) => { if (!canEdit) { showToast("Viewing mode"); return; } setOpenMenu(id); }} onClose={() => setOpenMenu(null)}>
            <MenuPanel>
              <MenuItem
                label="Text"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-text")}
                onClick={() => setOpenSubmenu((p) => (p === "format-text" ? null : "format-text"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-text"}
                submenu={
                  <SubmenuPanel className="w-[220px]">
                    <MenuItem label="Bold" shortcut="Ctrl+B" icon={Bold} onClick={() => handleCommand("bold")} />
                    <MenuItem label="Italic" shortcut="Ctrl+I" icon={Italic} onClick={() => handleCommand("italic")} />
                    <MenuItem label="Underline" shortcut="Ctrl+U" icon={Underline} onClick={() => handleCommand("underline")} />
                    <MenuItem label="Strikethrough" shortcut="Alt+Shift+5" icon={Strikethrough} onClick={() => handleCommand("strikeThrough")} />
                    <MenuItem label="Superscript" shortcut="Ctrl+." icon={SuperscriptIcon} onClick={() => handleCommand("superscript")} />
                    <MenuItem label="Subscript" shortcut="Ctrl+," icon={SubscriptIcon} onClick={() => handleCommand("subscript")} />
                  </SubmenuPanel>
                }
              />
              <MenuItem
                label="Paragraph styles"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-para")}
                onClick={() => setOpenSubmenu((p) => (p === "format-para" ? null : "format-para"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-para"}
                submenu={
                  <SubmenuPanel className="w-[220px]">
                    <MenuItem label="Normal text" onClick={() => { handleCommand("formatBlock", "p"); setCurrentParagraphStyle("Normal text"); }} />
                    <MenuItem label="Heading 1" onClick={() => { handleCommand("formatBlock", "h1"); setCurrentParagraphStyle("Heading 1"); }} />
                    <MenuItem label="Heading 2" onClick={() => { handleCommand("formatBlock", "h2"); setCurrentParagraphStyle("Heading 2"); }} />
                    <MenuItem label="Heading 3" onClick={() => { handleCommand("formatBlock", "h3"); setCurrentParagraphStyle("Heading 3"); }} />
                  </SubmenuPanel>
                }
              />
              <MenuItem
                label="Align & indent"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-align")}
                onClick={() => setOpenSubmenu((p) => (p === "format-align" ? null : "format-align"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-align"}
                submenu={
                  <SubmenuPanel className="w-[220px]">
                    <MenuItem label="Left" icon={AlignLeft} onClick={() => handleCommand("justifyLeft")} />
                    <MenuItem label="Center" icon={AlignCenter} onClick={() => handleCommand("justifyCenter")} />
                    <MenuItem label="Right" icon={AlignRight} onClick={() => handleCommand("justifyRight")} />
                    <MenuItem label="Justify" icon={AlignJustify} onClick={() => handleCommand("justifyFull")} />
                    <MenuDivider />
                    <MenuItem label="Increase indent" icon={IndentIncrease} onClick={() => handleCommand("indent")} />
                    <MenuItem label="Decrease indent" icon={IndentDecrease} onClick={() => handleCommand("outdent")} />
                  </SubmenuPanel>
                }
              />
              <MenuItem
                label="Line & paragraph spacing"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-spacing")}
                onClick={() => setOpenSubmenu((p) => (p === "format-spacing" ? null : "format-spacing"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-spacing"}
                submenu={
                  <SubmenuPanel className="w-[200px]">
                    {[...LINE_SPACINGS, { value: 2.5, label: "2.5" }, { value: 3.0, label: "3.0" }].map((ls) => (
                      <MenuItem key={ls.value} label={ls.label} onClick={() => handleLineSpacingChange(ls.value)} />
                    ))}
                  </SubmenuPanel>
                }
              />
              <MenuItem label="Columns" onClick={() => showToast("Columns: coming soon")} />
              <MenuItem
                label="Lists"
                hasSubmenu
                onHover={() => setOpenSubmenu("format-lists")}
                onClick={() => setOpenSubmenu((p) => (p === "format-lists" ? null : "format-lists"))}
                onLeave={() => setOpenSubmenu(null)}
                isSubmenuOpen={openSubmenu === "format-lists"}
                submenu={
                  <SubmenuPanel className="w-[200px]">
                    <MenuItem label="Bulleted list" icon={List} onClick={() => handleCommand("insertUnorderedList")} />
                    <MenuItem label="Numbered list" icon={ListOrdered} onClick={() => handleCommand("insertOrderedList")} />
                    <MenuItem label="Checklist" icon={ListChecks} onClick={() => { focusEditor(); exec("insertHTML", '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><input type="checkbox" style="margin-top:3px;cursor:pointer;" /><span>Item</span></div>'); emitChange(); }} />
                  </SubmenuPanel>
                }
              />
              <MenuDivider />
              <MenuItem label="Clear formatting" shortcut="Ctrl+\\" icon={RemoveFormatting} onClick={() => { focusEditor(); exec("removeFormat"); emitChange(); }} />
            </MenuPanel>
          </MenuRoot>

          {/* Tools menu */}
          <MenuRoot id="tools" label="Tools" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <MenuPanel>
              <MenuItem label="Spelling & grammar" icon={SpellCheck} onClick={() => showToast("Spell check: browser-native spellcheck is active")} />
              <MenuItem label="Word count" onClick={() => {
                const text = pageRefs.current.map((el) => el?.textContent || "").join(" ");
                const words = text.trim().split(/\s+/).filter(Boolean).length;
                const chars = text.length;
                showToast(`Words: ${words} | Characters: ${chars}`);
              }} />
              <MenuItem label="Translate document" onClick={() => showToast("Translate: use File > Language to switch languages")} />
              <MenuItem label="Voice typing" onClick={() => showToast("Voice typing: requires Web Speech API integration")} />
              <MenuDivider />
              <MenuItem label="Preferences" onClick={() => showToast("Preferences dialog: coming soon")} />
            </MenuPanel>
          </MenuRoot>

          {/* Extensions menu */}
          <MenuRoot id="extensions" label="Extensions" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <MenuPanel>
              <MenuItem label="Add-ons" onClick={() => showToast("Add-ons marketplace: coming soon")} />
              <MenuItem label="Apps Script" onClick={() => showToast("Apps Script: coming soon")} />
            </MenuPanel>
          </MenuRoot>

          {/* Help menu */}
          <MenuRoot id="help" label="Help" openMenu={openMenu} onOpen={(id) => setOpenMenu(id)} onClose={() => setOpenMenu(null)}>
            <MenuPanel>
              <MenuItem label="Search the menus" icon={Search} onClick={() => showToast("Menu search: coming soon")} />
              <MenuItem label="Keyboard shortcuts" shortcut="Ctrl+/" onClick={() => showToast("Keyboard shortcuts dialog: coming soon")} />
              <MenuDivider />
              <MenuItem label="Report an issue" onClick={() => showToast("Report issue: coming soon")} />
            </MenuPanel>
          </MenuRoot>
        </div>
      </div>
      )}

      {/* Templates moved inside page content area */}

      {/* Toolbar — Google Docs order */}
      {!isChromeCollapsed && (
      <div className="px-3 pt-2 pb-1.5 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10">
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
                  setTextColorOpen(false);
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
                  setHighlightOpen(false);
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
          <ToolbarButton disabled={false} onClick={() => showToast("Select text to add a comment")} title="Add comment (Ctrl+Alt+M)" Icon={MessageSquarePlus} />

          {/* Insert image */}
          <ToolbarButton disabled={!canEdit} onClick={() => imageInputRef.current?.click()} title="Insert image" Icon={ImageIcon} />
          <ToolbarDivider />

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
        <div className="px-3 py-0.5 flex justify-end border-b border-gray-200 dark:border-gray-800">
          <Tooltip content="Show the menus (Ctrl+Shift+F)" delay={400}>
            <button type="button" onClick={() => setIsChromeCollapsed(false)}
              className="w-7 h-5 inline-flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Main content: sidebar + page surface */}
      <div className="flex flex-1 min-h-0">
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
          <div className="w-[260px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] overflow-y-auto" data-doc-sidebar onClick={() => setTabMenuOpenId(null)}>
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
                        <span className="flex-1 text-[12px] font-medium text-gray-700 dark:text-gray-200 truncate">{tab.name}</span>
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
              {/* Outline: only shown when document has headings */}
              {sidebarHeadings.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
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
        )}

        {/* Page surface */}
        <div className={`flex-1 min-h-0 overflow-auto ${isFullscreen ? "px-0 pb-0" : "px-4 pb-4"}`}>
          {!isFullscreen && showEquationToolbar && (
            <div className="mx-auto w-full max-w-[860px] mb-2 px-2">
              <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/70 dark:bg-gray-900/60 midnight:bg-[#0b1220] purple:bg-[#170a27]">
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
            <div className="mx-auto w-full mb-1 mt-1" style={{ maxWidth: pageWidthPx }}>
              <div className="h-7 rounded-sm border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white dark:bg-gray-900/60 midnight:bg-[#0b1220] purple:bg-[#170a27] relative overflow-hidden select-none">
                {/* Ruler tick marks */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${pageWidthPx} 28`}>
                  {Array.from({ length: Math.ceil((pageWidthPx - 2 * pagePaddingPx) / 96) + 1 }, (_, i) => {
                    const x = pagePaddingPx + i * 96;
                    return (
                      <g key={i}>
                        <line x1={x} y1="14" x2={x} y2="28" stroke="#9ca3af" strokeWidth="1" />
                        <text x={x} y="11" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">{i}</text>
                        {i < Math.ceil((pageWidthPx - 2 * pagePaddingPx) / 96) && (
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
                <div className="absolute top-0 h-full bg-blue-100/30 dark:bg-blue-900/15" style={{ left: 0, width: pagePaddingPx }} />
                <div className="absolute top-0 h-full bg-blue-100/30 dark:bg-blue-900/15" style={{ right: 0, width: pagePaddingPx }} />
                {/* Indent triangles */}
                <Tooltip content="Left indent" delay={400}><div className="absolute bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500 cursor-pointer" style={{ left: pagePaddingPx - 5 }} /></Tooltip>
                <Tooltip content="Right indent" delay={400}><div className="absolute bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500 cursor-pointer" style={{ right: pagePaddingPx - 5 }} /></Tooltip>
              </div>
            </div>
          )}
          <div
            ref={editorRootRef}
            className={[
              "w-full",
              showPrintLayout
                ? "min-h-full py-6 bg-gray-50 dark:bg-gray-950 midnight:bg-[#06101f] purple:bg-[#12061f]"
                : "min-h-full",
            ].join(" ")}
            style={zoomLevel !== 100 ? {
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top center",
              width: `${10000 / zoomLevel}%`,
            } : undefined}
          >
            {showPrintLayout ? (
              <div className="flex flex-col items-center gap-6">
                {pages.map((html, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center">
                    <div
                      className={[
                        "w-full rounded-sm shadow-md relative",
                        "bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27]",
                        "border border-gray-200/80 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10",
                      ].join(" ")}
                      style={{
                        maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : pageWidthPx,
                      }}
                    >
                      {/* Template chips overlay — inside page when empty */}
                      {idx === 0 && hasTemplates && isDocEmpty && canEdit && (
                        <div className="absolute inset-x-0 top-16 flex justify-center gap-2 z-10 pointer-events-none">
                          {resolvedTemplates.slice(0, 2).map((tpl) => {
                            const TplIcon = tpl.icon ?? FileText;
                            return (
                              <button key={tpl.id} onClick={() => handleTemplateInsert(tpl)}
                                className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title={tpl.label}>
                                <TplIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-200">{tpl.label}</span>
                              </button>
                            );
                          })}
                          {resolvedTemplates.length > 2 && (
                            <button onClick={() => setMoreOpen((v) => !v)}
                              className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="More templates">
                              <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-200">More</span>
                            </button>
                          )}
                        </div>
                      )}
                      <div
                        contentEditable={canEdit}
                        suppressContentEditableWarning
                        ref={(el) => {
                          pageRefs.current[idx] = el;
                          if (el && el.innerHTML !== html) el.innerHTML = html;
                        }}
                        className={[
                          "outline-none overflow-hidden relative",
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
                          height: 1120,
                          paddingTop: 64,
                          paddingBottom: 64,
                          paddingLeft: isFullscreen ? 48 : pagePaddingPx,
                          paddingRight: isFullscreen ? 48 : pagePaddingPx,
                        }}
                        data-placeholder={placeholder}
                        lang={language}
                        dir={getTextDirectionForLanguage(language)}
                        spellCheck
                        onInput={emitChange}
                        onBlur={emitChange}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                      Page {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="mx-auto w-full rounded-sm shadow-sm bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27] border border-transparent py-10 relative"
                style={{
                  maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : pageWidthPx,
                  paddingLeft: isFullscreen ? 48 : pagePaddingPx,
                  paddingRight: isFullscreen ? 48 : pagePaddingPx,
                }}
              >
                {/* Template chips overlay — inside page when empty */}
                {hasTemplates && isDocEmpty && canEdit && (
                  <div className="absolute inset-x-0 top-16 flex justify-center gap-2 z-10 pointer-events-none">
                    {resolvedTemplates.slice(0, 2).map((tpl) => {
                      const TplIcon = tpl.icon ?? FileText;
                      return (
                        <button key={tpl.id} onClick={() => handleTemplateInsert(tpl)}
                          className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title={tpl.label}>
                          <TplIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-200">{tpl.label}</span>
                        </button>
                      );
                    })}
                    {resolvedTemplates.length > 2 && (
                      <button onClick={() => setMoreOpen((v) => !v)}
                        className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="More templates">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-200">More</span>
                      </button>
                    )}
                  </div>
                )}
                <div
                  contentEditable={canEdit}
                  suppressContentEditableWarning
                  ref={(el) => {
                    pageRefs.current[0] = el;
                    if (el && el.innerHTML !== (pages[0] || "")) el.innerHTML = pages[0] || "";
                  }}
                  className={[
                    "min-h-[520px] outline-none overflow-hidden relative",
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
                  spellCheck
                  onInput={emitChange}
                  onBlur={emitChange}
                />
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
            `}</style>
          </div>
        </div>
      </div>

      {/* Comments panel (simple) */}
      {!isFullscreen && showComments && (
        <div className="absolute right-3 top-[92px] z-[150] w-[260px] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl p-3">
          <div className="text-[12px] font-bold text-gray-700 dark:text-gray-200 mb-1">
            Comments
          </div>
          <div className="text-[12px] text-gray-500 dark:text-gray-400">
            Comments UI is ready to wire to your backend (threads, mentions, permissions).
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

      {dialog === "findReplace" && (
        <DocDialog title="Find and replace" onClose={() => setDialog(null)}>
          <div className="space-y-2">
            <input
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              placeholder="Find…"
              className="w-full px-3 py-2 rounded-xl text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
            />
            <input
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with…"
              className="w-full px-3 py-2 rounded-xl text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
            />
            <div className="flex flex-wrap items-center gap-2">
              <DialogButton
                onClick={() => {
                  const ok = findAndSelect(findQuery);
                  showToast(ok ? "Found" : "Not found");
                }}
              >
                Find next
              </DialogButton>
              <DialogButton
                onClick={() => {
                  const sel = window.getSelection();
                  if (!sel || sel.rangeCount === 0) {
                    const ok = findAndSelect(findQuery);
                    if (!ok) return showToast("Not found");
                  }
                  exec("insertText", replaceQuery);
                  emitChange();
                  showToast("Replaced");
                }}
              >
                Replace
              </DialogButton>
              <DialogButton
                onClick={() => {
                  lastFindIndexRef.current = 0;
                  let count = 0;
                  for (let i = 0; i < 500; i++) {
                    const ok = findAndSelect(findQuery);
                    if (!ok) break;
                    exec("insertText", replaceQuery);
                    count++;
                  }
                  emitChange();
                  showToast(`Replaced ${count}`);
                }}
              >
                Replace all
              </DialogButton>
            </div>
          </div>
        </DocDialog>
      )}

      {dialog === "pageSetup" && (
        <DocDialog title="Page setup" onClose={() => setDialog(null)}>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[12px] text-gray-600 dark:text-gray-300">
              Width (px)
              <input
                type="number"
                value={pageWidthPx}
                onChange={(e) => setPageWidthPx(Math.max(560, Number(e.target.value || 860)))}
                className="mt-1 w-full px-3 py-2 rounded-xl text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
              />
            </label>
            <label className="text-[12px] text-gray-600 dark:text-gray-300">
              Side padding (px)
              <input
                type="number"
                value={pagePaddingPx}
                onChange={(e) => setPagePaddingPx(Math.max(16, Number(e.target.value || 40)))}
                className="mt-1 w-full px-3 py-2 rounded-xl text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 outline-none"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <DialogButton onClick={() => { setShowPrintLayout(true); showToast("Print layout enabled"); }}>
              Print layout
            </DialogButton>
            <DialogButton onClick={() => { setShowPrintLayout(false); showToast("Web layout enabled"); }}>
              Web layout
            </DialogButton>
          </div>
        </DocDialog>
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

