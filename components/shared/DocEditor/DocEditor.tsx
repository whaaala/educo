"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { DOC_LANGUAGES } from "./languages";
import { ColorGrid, SOLID_COLORS, TEXT_COLORS_MATRIX, TEXT_GRADIENT_COLORS, GLOSSY_COLORS, colorToCSS } from "@/components/shared/ColorPalettePicker";
import { FONT_FAMILY_CATEGORIES, FONT_SIZES } from "@/components/shared/Whiteboard/whiteboard-types";
import type { FontFamily } from "@/components/shared/Whiteboard/whiteboard-types";

const MenuCloseContext = createContext<(() => void) | null>(null);
const SubmenuCloseContext = createContext<(() => void) | null>(null);

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
  color?: string; // text/font color
}

interface TableWidgetCell {
  html: string;
  bg?: string; // per-cell background override (if set, takes priority over table-level cellBg)
  border?: Partial<{ color: string; widthPx: number; style: "solid" | "dashed" | "dotted" }>; // per-cell border override
  textFmt?: TableCellTextFormat; // per-cell text format override
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
  // Text wrapping mode: none (inline block), wrap (positioned, text flows around)
  wrapMode?: "none" | "wrap";
  // Position when wrapMode is "wrap" (px from top-left of content area)
  wrapX?: number;
  wrapY?: number;
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
          const isHeader = (model.headerRow && rIdx === 0) || (model.headerCol && cIdx === 0);
          const tag = isHeader ? "th" : "td";
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
          const txtColor = cellTxtFmt.color ?? baseTxtFmt.color;
          const style = [
            `border:${cellBorderStr}`,
            "padding:6px 8px",
            "vertical-align:top",
            "min-height:24px",
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
          return `<${tag} style="${style}">${safeHtml}</${tag}>`;
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

/** Returns the inline style string for a table widget container div based on its wrap mode. */
function getTableContainerStyle(model: TableWidgetModel): string {
  const base = "cursor:pointer;overflow:hidden";
  if (model.wrapMode === "wrap") {
    const x = model.wrapX ?? 0;
    const y = model.wrapY ?? 0;
    return `position:absolute;left:${x}px;top:${y}px;z-index:10;${base}`;
  }
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
  const [openMenu, setOpenMenu] = useState<"file" | "edit" | "view" | "insert" | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [languageQuery, setLanguageQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [showNonPrinting, setShowNonPrinting] = useState(false);
  const [showPrintLayout, setShowPrintLayout] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showEquationToolbar, setShowEquationToolbar] = useState(false);
  const [docMode, setDocMode] = useState<"editing" | "suggesting" | "viewing">("editing");
  const [isChromeCollapsed, setIsChromeCollapsed] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateRequestIdRef = useRef(0);
  const [tenantTranslationEnabled, setTenantTranslationEnabled] = useState(true);

  const [dialog, setDialog] = useState<null | "share" | "findReplace" | "pageSetup" | "details" | "security" | "versions">(null);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const lastFindIndexRef = useRef(0);

  const [pageWidthPx, setPageWidthPx] = useState(860);
  const [pagePaddingPx, setPagePaddingPx] = useState(40);
  const [pages, setPages] = useState<string[]>(() => parseHtmlPages(value.html));

  const [versions, setVersions] = useState<Array<{ ts: number; title: string; html: string; language?: string }>>([]);
  const htmlByLanguageRef = useRef<Map<string, string>>(new Map());

  const canEdit = !readOnly && docMode !== "viewing";

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
  const [textColorTab, setTextColorTab] = useState<"solid" | "gradient" | "glossy">("solid");

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
  const commitTableWidget = useCallback((el: HTMLElement, model: TableWidgetModel) => {
    try {
      el.dataset.docTableWidgetModel = encodeTableWidgetModel(model);
      el.innerHTML = renderTableWidgetHtml(model);
      el.style.cssText = getTableContainerStyle(model);

      // Manage the float proxy: an invisible element that makes text wrap around the table.
      // It sits in the normal flow with float + matching dimensions so text avoids that area.
      const proxyId = `${el.dataset.docTableWidgetId}_proxy`;
      const parent = el.parentElement;
      let proxy = parent?.querySelector(`[data-table-proxy-id="${proxyId}"]`) as HTMLElement | null;

      if (model.wrapMode === "wrap" && parent) {
        const tableW = model.colWidthsPx ? model.colWidthsPx.reduce((a, b) => a + b, 0) : 520;
        const tableH = (model.rowHeightsPx ? model.rowHeightsPx.reduce((a, b) => a + b, 0) : model.rows.length * 40)
          + (model.border.widthPx * 2);
        const x = model.wrapX ?? 0;
        const y = model.wrapY ?? 0;
        const contentW = parent.clientWidth || 780;
        // Determine float side: if table is in left half, float left; otherwise float right
        const floatSide = x + tableW / 2 < contentW / 2 ? "left" : "right";
        const marginOpp = floatSide === "left" ? "margin-right" : "margin-left";

        if (!proxy) {
          proxy = document.createElement("div");
          proxy.setAttribute("data-table-proxy-id", proxyId);
          proxy.setAttribute("contenteditable", "false");
          // Insert proxy as first child so it's before all text
          parent.insertBefore(proxy, parent.firstChild);
        }
        proxy.style.cssText = [
          `float:${floatSide}`,
          `width:${tableW}px`,
          `height:${tableH}px`,
          `margin-top:${y}px`,
          `${marginOpp}:16px`,
          `margin-bottom:8px`,
          "visibility:hidden",
          "pointer-events:none",
          "clear:both",
        ].join(";");
      } else if (proxy) {
        // Remove proxy when wrap mode is off
        proxy.remove();
      }
    } catch {
      // ignore best-effort
    }
  }, []);

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
      setTableWidgetEditor({ widgetId, model, activeCell: { r: focusCellR, c: focusCellC } });

      // Focus the target cell in the panel after React renders it.
      requestAnimationFrame(() => {
        const cellRef = cellEditRefs.current.get(`${focusCellR},${focusCellC}`);
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
        return { ...m, rows, rowHeightsPx };
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
        // Redistribute column widths evenly across the total table width (capped to page).
        const newColCount = rows[0]?.length ?? 1;
        const maxW = pageWidthPx - 2 * pagePaddingPx;
        const totalWidth = Math.min(maxW, m.colWidthsPx
          ? m.colWidthsPx.reduce((a, b) => a + b, 0)
          : Math.max(400, newColCount * 120));
        const evenWidth = Math.max(60, Math.floor(totalWidth / newColCount));
        const colWidthsPx = Array.from({ length: newColCount }, () => evenWidth);
        return { ...m, rows, colWidthsPx };
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

  const setTableWrapMode = useCallback(
    (mode: "none" | "wrap") => {
      updateTableWidgetModel((m) => {
        if (mode === "wrap" && !m.wrapX && !m.wrapY) {
          // Default position: centered, a bit down from top
          const tableW = m.colWidthsPx ? m.colWidthsPx.reduce((a, b) => a + b, 0) : 520;
          const contentW = pageWidthPx - 2 * pagePaddingPx;
          return { ...m, wrapMode: mode, wrapX: Math.round((contentW - tableW) / 2), wrapY: 20 };
        }
        return { ...m, wrapMode: mode };
      });
      commitWidgetSoon(true);
      showToast(mode === "none" ? "Table inline (no wrapping)" : "Table positioned (text wraps around)");
    },
    [commitWidgetSoon, showToast, updateTableWidgetModel, pageWidthPx, pagePaddingPx]
  );

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
        // Apply to active cell only
        const ac = tableWidgetEditorRef.current?.activeCell;
        if (!ac) return { ...m, bodyTextFmt: { ...(m.bodyTextFmt ?? {}), ...patch } };
        const rows = m.rows.map((r) => r.map((c) => ({ ...c })));
        const cell = rows[ac.r]?.[ac.c];
        if (cell) {
          cell.textFmt = { ...(cell.textFmt ?? {}), ...patch };
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
      const rows = m.rows.filter((_, i) => i !== idx);
      const rowHeightsPx = m.rowHeightsPx ? m.rowHeightsPx.filter((_, i) => i !== idx) : undefined;
      return { ...m, rows, rowHeightsPx };
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
      const rows = m.rows.map((r) => r.filter((_, i) => i !== idx));
      // Redistribute column widths evenly after deletion.
      const newColCount = rows[0]?.length ?? 1;
      const totalWidth = m.colWidthsPx
        ? m.colWidthsPx.reduce((a, b) => a + b, 0)
        : Math.max(400, newColCount * 120);
      const evenWidth = Math.max(60, Math.floor(totalWidth / newColCount));
      const colWidthsPx = Array.from({ length: newColCount }, () => evenWidth);
      return { ...m, rows, colWidthsPx };
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

      // If the table is in "wrap" mode, allow dragging to reposition
      const model = decodeTableWidgetModel(widget.dataset.docTableWidgetModel);
      if (model?.wrapMode === "wrap") {
        const startX = e.clientX;
        const startY = e.clientY;
        const startWrapX = model.wrapX ?? 0;
        const startWrapY = model.wrapY ?? 0;
        let dragged = false;

        const onMove = (me: PointerEvent) => {
          const dx = me.clientX - startX;
          const dy = me.clientY - startY;
          if (!dragged && Math.abs(dx) + Math.abs(dy) < 5) return; // dead zone
          dragged = true;
          const contentW = (widget.parentElement?.clientWidth || 780);
          const tableW = model.colWidthsPx ? model.colWidthsPx.reduce((a, b) => a + b, 0) : 520;
          const newX = Math.max(0, Math.min(contentW - tableW, Math.round(startWrapX + dx)));
          const newY = Math.max(0, Math.round(startWrapY + dy));
          widget.style.left = `${newX}px`;
          widget.style.top = `${newY}px`;
          // Live-update the proxy
          const proxyId = `${widget.dataset.docTableWidgetId}_proxy`;
          const proxy = widget.parentElement?.querySelector(`[data-table-proxy-id="${proxyId}"]`) as HTMLElement | null;
          if (proxy) {
            proxy.style.marginTop = `${newY}px`;
            const floatSide = newX + tableW / 2 < contentW / 2 ? "left" : "right";
            proxy.style.cssFloat = floatSide;
          }
        };
        const onUp = (me: PointerEvent) => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          document.body.style.cursor = "";
          if (dragged) {
            // Save final position to the model
            const dx = me.clientX - startX;
            const dy = me.clientY - startY;
            const contentW = (widget.parentElement?.clientWidth || 780);
            const tableW = model.colWidthsPx ? model.colWidthsPx.reduce((a, b) => a + b, 0) : 520;
            const finalX = Math.max(0, Math.min(contentW - tableW, Math.round(startWrapX + dx)));
            const finalY = Math.max(0, Math.round(startWrapY + dy));
            const newModel = { ...model, wrapX: finalX, wrapY: finalY };
            commitTableWidget(widget, newModel);
            emitChange();
            // Update editor state if this table is being edited
            setTableWidgetEditor((prev) => {
              if (prev && prev.widgetId === widget.dataset.docTableWidgetId) {
                return { ...prev, model: newModel };
              }
              return prev;
            });
          } else {
            // It was a click, not a drag — open the editor
            const cur = tableWidgetEditorRef.current;
            const widgetId = widget.dataset.docTableWidgetId;
            if (cur && widgetId && cur.widgetId === widgetId) return;
            if (cur) closeTableWidgetEditor();
            openTableWidgetEditor(widget, 0, 0);
          }
        };
        document.body.style.cursor = "grabbing";
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return;
      }

      const cur = tableWidgetEditorRef.current;
      const widgetId = widget.dataset.docTableWidgetId;
      if (cur && widgetId && cur.widgetId === widgetId) return; // Already editing this table.
      if (cur) closeTableWidgetEditor();
      openTableWidgetEditor(widget, 0, 0);
    };

    root.addEventListener("pointerdown", onPointerDown as any, true);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown as any, true);
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
    updateValue({ title: "Untitled document", html: "", language: "en" });
    showToast("New document created");
  };

  const handleMakeCopy = () => {
    updateValue({ title: `Copy of ${docTitle}`, html: value.html });
    showToast("Copy created");
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
      return;
    }
    if (format === "md") {
      downloadText(`${base}.md`, toMarkdown(value.html));
      return;
    }
    if (format === "json") {
      downloadText(`${base}.json`, JSON.stringify({ ...value, title: docTitle }, null, 2), "application/json;charset=utf-8");
      return;
    }
    if (format === "rtf") {
      const rtf = `{\\rtf1\\ansi\\deff0\\fs24\n${escapeRtf(getDocumentText())}\n}`;
      downloadText(`${base}.rtf`, rtf, "application/rtf;charset=utf-8");
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
      const text = await navigator.clipboard.readText();
      if (!text) throw new Error("Empty clipboard");
      exec("insertText", text);
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
    const style = getTableContainerStyle(model);
    const html = `<div contenteditable="false" data-doc-table-widget="true" data-doc-table-widget-id="${id}" data-doc-table-widget-model="${encodeTableWidgetModel(model)}" style="${style}">${renderTableWidgetHtml(model)}</div>`.trim();
    focusEditor();
    exec("insertHTML", html);
    emitChange();

    // Open the editor panel for the just-inserted table.
    // Use double-rAF to wait for React re-render (emitChange triggers state update → re-render → innerHTML sync).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const root = editorRootRef.current;
        if (!root) return;
        const widget = root.querySelector(`[data-doc-table-widget-id="${id}"]`) as HTMLElement | null;
        if (widget) {
          openTableWidgetEditor(widget, 0, 0);
        }
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
            : "flex flex-col w-full rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20",
          "bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035]",
          // Important: keep overflow visible so dropdown submenus can render outside the panel.
          "shadow-sm",
          className,
        ].join(" ")}
      >
      {isFullscreen && (
        <div className="absolute top-3 right-3 z-[220]">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur hover:bg-white dark:hover:bg-gray-900 transition-colors cursor-pointer"
            aria-label="Exit full screen"
            title="Exit full screen (Esc)"
          >
            Exit full screen <span className="text-gray-400 dark:text-gray-500">(Esc)</span>
          </button>
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
            <button
              type="button"
              title="Drag to reorder table"
              className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing"
              onMouseDown={handleTableDragStart}
            >
              <GripVertical size={14} />
            </button>
            {/* Move table up/down */}
            <button type="button" title="Move table up" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer" onClick={moveTableUp}>
              <MoveUp size={14} />
            </button>
            <button type="button" title="Move table down" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer" onClick={moveTableDown}>
              <MoveDown size={14} />
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Insert row/column */}
            <button type="button" title="Insert row above" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetRow("above")}>
              <Plus size={12} /><ArrowUp size={10} />
            </button>
            <button type="button" title="Insert row below" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetRow("below")}>
              <Plus size={12} /><ArrowDown size={10} />
            </button>
            <button type="button" title="Insert column left" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetCol("left")}>
              <Plus size={12} /><ArrowLeft size={10} />
            </button>
            <button type="button" title="Insert column right" className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-0.5 text-[10px] font-medium" onClick={() => insertWidgetCol("right")}>
              <Plus size={12} /><ArrowRight size={10} />
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Delete row/column */}
            <button type="button" title="Delete row" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer flex items-center gap-0.5 text-[10px]" onClick={deleteWidgetRow}>
              <Minus size={12} /><span>Row</span>
            </button>
            <button type="button" title="Delete column" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer flex items-center gap-0.5 text-[10px]" onClick={deleteWidgetCol}>
              <Minus size={12} /><span>Col</span>
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Header toggles */}
            <button
              type="button"
              title="Toggle header row"
              className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                tableWidgetEditor.model.headerRow
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
              onClick={toggleWidgetHeaderRow}
            >
              H-Row
            </button>
            <button
              type="button"
              title="Toggle header column"
              className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                tableWidgetEditor.model.headerCol
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
              onClick={toggleWidgetHeaderCol}
            >
              H-Col
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Text formatting popover */}
            <div className="relative">
              <button
                type="button"
                title="Text formatting"
                className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer flex items-center gap-0.5 text-[10px]"
                onClick={() => { setTableTextPopover(!tableTextPopover); setTableBorderPopover(false); setTableCellBgPopover(false); }}
              >
                <Type size={14} />
                <ChevronDown size={10} />
              </button>
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
                      <button type="button" title="Bold" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effBold ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ bold: !effBold })}><Bold size={13} /></button>
                      <button type="button" title="Italic" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effItalic ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ italic: !effItalic })}><Italic size={13} /></button>
                      <button type="button" title="Underline" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effUnderline ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ underline: !effUnderline })}><Underline size={13} /></button>
                      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
                      <button type="button" title="Align left" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "left" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "left" })}><AlignLeft size={13} /></button>
                      <button type="button" title="Align center" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "center" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "center" })}><AlignCenter size={13} /></button>
                      <button type="button" title="Align right" className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${effAlign === "right" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => setWidgetTextFmt({ textAlign: "right" })}><AlignRight size={13} /></button>
                    </div>

                    {/* Font color — tabbed: Solid / Gradient / Glossy */}
                    <div className="pt-1 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Color</div>
                      {/* Tab switcher */}
                      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 mb-2">
                        {(["solid", "gradient", "glossy"] as const).map((t) => (
                          <button key={t} type="button"
                            className={`flex-1 py-1 text-[9px] font-semibold rounded-md cursor-pointer transition-all capitalize ${textColorTab === t ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                            onClick={() => setTextColorTab(t)}
                          >{t}</button>
                        ))}
                      </div>

                      {/* Solid tab — color matrix organized by hue */}
                      {textColorTab === "solid" && (
                        <div className="max-h-[180px] overflow-y-auto scrollbar-thin space-y-0.5 mb-1.5">
                          {TEXT_COLORS_MATRIX.map((row, ri) => (
                            <div key={ri} className="grid grid-cols-10 gap-[3px]">
                              {row.map((c, ci) => (
                                <button key={ci} type="button"
                                  className={`w-[23px] h-[23px] rounded-md cursor-pointer transition-all hover:scale-110 hover:shadow-md hover:z-10 ${effColor === c ? "ring-2 ring-blue-500 ring-offset-1 z-10" : "border border-gray-200/60 dark:border-gray-600/60"}`}
                                  style={{ background: c }}
                                  title={c}
                                  onClick={() => setWidgetTextFmt({ color: c })}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Gradient tab */}
                      {textColorTab === "gradient" && (
                        <div className="max-h-[180px] overflow-y-auto scrollbar-thin mb-1.5">
                          <div className="grid grid-cols-6 gap-1.5">
                            {TEXT_GRADIENT_COLORS.map((c, i) => (
                              <button key={i} type="button"
                                className={`w-full aspect-square rounded-lg cursor-pointer transition-all hover:scale-110 hover:shadow-md hover:z-10 ${effColor === c ? "ring-2 ring-blue-500 ring-offset-1 z-10" : "border border-gray-200/60 dark:border-gray-600/60"}`}
                                style={{ background: colorToCSS(c) }}
                                title={c.replace(/gradient:/g, "").replace(/:/g, " → ")}
                                onClick={() => setWidgetTextFmt({ color: c })}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Glossy / Metallic tab */}
                      {textColorTab === "glossy" && (
                        <div className="max-h-[180px] overflow-y-auto scrollbar-thin mb-1.5">
                          <div className="grid grid-cols-6 gap-1.5">
                            {GLOSSY_COLORS.map((c, i) => (
                              <button key={i} type="button"
                                className={`w-full aspect-square rounded-lg cursor-pointer transition-all hover:scale-110 hover:shadow-md hover:z-10 ${effColor === c ? "ring-2 ring-blue-500 ring-offset-1 z-10" : "border border-gray-200/60 dark:border-gray-600/60"}`}
                                style={{ background: colorToCSS(c) }}
                                title={c.replace(/gradient:/g, "").replace(/:/g, " → ")}
                                onClick={() => setWidgetTextFmt({ color: c })}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom color picker */}
                      <div className="flex items-center gap-2">
                        <label className="relative cursor-pointer">
                          <input type="color" value={effColor.startsWith("gradient:") ? effColor.split(":")[1] : effColor} onChange={(e) => setWidgetTextFmt({ color: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner" style={{ background: effColor.startsWith("gradient:") ? colorToCSS(effColor) : effColor }}>
                            <div className="w-full h-full rounded-lg" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)", opacity: 0.3 }} />
                          </div>
                        </label>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Custom</span>
                        <input type="text" value={effColor} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) setWidgetTextFmt({ color: v }); }}
                          className="flex-1 px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400"
                          maxLength={7} spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Border settings */}
            <div className="relative">
              <button
                type="button"
                title="Border settings"
                className="p-1.5 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer flex items-center gap-0.5 text-[10px]"
                onClick={() => { setTableBorderPopover(!tableBorderPopover); setTableCellBgPopover(false); setTableTextPopover(false); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
                <ChevronDown size={10} />
              </button>
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
                      {/* Neutrals row */}
                      <div className="grid grid-cols-8 gap-1.5 mb-1.5">
                        {["#000000","#374151","#6b7280","#9ca3af","#d1d5db","#e5e7eb","#f3f4f6","#ffffff"].map((c, i) => (
                          <button key={i} type="button" className={`w-7 h-7 rounded-lg border cursor-pointer transition-all hover:scale-110 hover:shadow-md ${effectiveBorderColor === c ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-200 dark:border-gray-600"}`} style={{ background: c }} onClick={() => setWidgetBorder({ color: c })} />
                        ))}
                      </div>
                      {/* Main palette */}
                      <div className="grid grid-cols-8 gap-1.5 mb-2">
                        {[
                          "#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e","#14b8a6","#06b6d4",
                          "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e",
                          "#dc2626","#ea580c","#d97706","#ca8a04","#65a30d","#16a34a","#0d9488","#0891b2",
                          "#0284c7","#2563eb","#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48",
                          "#991b1b","#9a3412","#92400e","#854d0e","#3f6212","#166534","#115e59","#155e75",
                          "#075985","#1e40af","#3730a3","#5b21b6","#6b21a8","#86198f","#9d174d","#9f1239",
                        ].map((c, i) => (
                          <button key={i} type="button" className={`w-7 h-7 rounded-lg border-0 cursor-pointer transition-all hover:scale-110 hover:shadow-md ${effectiveBorderColor === c ? "ring-2 ring-blue-500 ring-offset-1" : ""}`} style={{ background: c }} onClick={() => setWidgetBorder({ color: c })} />
                        ))}
                      </div>
                      {/* Custom color input */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                        <label className="relative cursor-pointer">
                          <input
                            type="color"
                            value={effectiveBorderColor}
                            onChange={(e) => setWidgetBorder({ color: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner" style={{ background: effectiveBorderColor }}>
                            <div className="w-full h-full rounded-lg" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)", opacity: 0.3 }} />
                          </div>
                        </label>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">Custom</span>
                        <input
                          type="text"
                          value={effectiveBorderColor}
                          onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setWidgetBorder({ color: e.target.value }); }}
                          className="flex-1 px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400"
                          maxLength={7}
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            {/* Cell background color */}
            <div className="relative">
              <button
                type="button"
                title="Cell background color"
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
              </button>
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
                    {/* No fill button */}
                    <button
                      type="button"
                      onClick={() => setWidgetCellBg("transparent")}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition-all cursor-pointer ${
                        isNoFill
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                          : "text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0">
                        <rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="4" y1="16" x2="16" y2="4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      No fill (transparent)
                    </button>
                    {/* Neutrals */}
                    <div className="grid grid-cols-8 gap-1.5">
                      {["#ffffff","#f9fafb","#f3f4f6","#e5e7eb","#d1d5db","#9ca3af","#6b7280","#374151"].map((c, i) => (
                        <button key={i} type="button" className={`w-7 h-7 rounded-lg border cursor-pointer transition-all hover:scale-110 hover:shadow-md ${effectiveCellBg === c ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-200 dark:border-gray-600"}`} style={{ background: c }} onClick={() => setWidgetCellBg(c)} />
                      ))}
                    </div>
                    {/* Light tints (for cell backgrounds) */}
                    <div className="grid grid-cols-8 gap-1.5">
                      {[
                        "#fef2f2","#fff7ed","#fffbeb","#fefce8","#f7fee7","#f0fdf4","#f0fdfa","#ecfeff",
                        "#fecaca","#fed7aa","#fde68a","#fef08a","#d9f99d","#bbf7d0","#99f6e4","#a5f3fc",
                        "#fca5a5","#fdba74","#fcd34d","#facc15","#bef264","#86efac","#5eead4","#67e8f9",
                        "#f87171","#fb923c","#fbbf24","#eab308","#a3e635","#4ade80","#2dd4bf","#22d3ee",
                        "#ef4444","#f97316","#f59e0b","#d97706","#84cc16","#22c55e","#14b8a6","#06b6d4",
                        "#bfdbfe","#c7d2fe","#ddd6fe","#e9d5ff","#f5d0fe","#fbcfe8","#fecdd3","#e2e8f0",
                        "#93c5fd","#a5b4fc","#c4b5fd","#d8b4fe","#f0abfc","#f9a8d4","#fda4af","#cbd5e1",
                        "#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e","#64748b",
                      ].map((c, i) => (
                        <button key={i} type="button" className={`w-7 h-7 rounded-lg border-0 cursor-pointer transition-all hover:scale-110 hover:shadow-md ${effectiveCellBg === c ? "ring-2 ring-blue-500 ring-offset-1" : ""}`} style={{ background: c }} onClick={() => setWidgetCellBg(c)} />
                      ))}
                    </div>
                    {/* Custom color input */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                      <label className="relative cursor-pointer">
                        <input
                          type="color"
                          value={isNoFill ? "#ffffff" : effectiveCellBg}
                          onChange={(e) => setWidgetCellBg(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner" style={{ background: isNoFill ? "#fff" : effectiveCellBg }}>
                          <div className="w-full h-full rounded-lg" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)", opacity: 0.3 }} />
                        </div>
                      </label>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Custom</span>
                      <input
                        type="text"
                        value={effectiveCellBg}
                        onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setWidgetCellBg(e.target.value); }}
                        className="flex-1 px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400"
                        maxLength={7}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Table width control */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">W</span>
              <button type="button" title="Decrease table width" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
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
              ><Minus size={10} /></button>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 min-w-[32px] text-center">
                {tableWidgetEditor.model.colWidthsPx ? tableWidgetEditor.model.colWidthsPx.reduce((a, b) => a + b, 0) : "—"}
              </span>
              <button type="button" title="Increase table width" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const cols = m.rows[0]?.length ?? 1;
                    const totalW = m.colWidthsPx ? m.colWidthsPx.reduce((a, b) => a + b, 0) : cols * 120;
                    const maxW = pageWidthPx - 2 * pagePaddingPx;
                    const newTotal = Math.min(maxW, totalW + 40);
                    const evenW = Math.max(40, Math.floor(newTotal / cols));
                    return { ...m, colWidthsPx: Array.from({ length: cols }, () => evenW) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Plus size={10} /></button>
            </div>

            {/* Table row height control */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">H</span>
              <button type="button" title="Decrease row heights" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const rows = m.rows.length;
                    const curH = m.rowHeightsPx?.[0] ?? 40;
                    const newH = Math.max(24, curH - 8);
                    return { ...m, rowHeightsPx: Array.from({ length: rows }, () => newH) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Minus size={10} /></button>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 min-w-[24px] text-center">
                {tableWidgetEditor.model.rowHeightsPx?.[0] ?? 40}
              </span>
              <button type="button" title="Increase row heights" className="p-1 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => {
                  updateTableWidgetModel((m) => {
                    const rows = m.rows.length;
                    const curH = m.rowHeightsPx?.[0] ?? 40;
                    const newH = Math.min(200, curH + 8);
                    return { ...m, rowHeightsPx: Array.from({ length: rows }, () => newH) };
                  });
                  commitWidgetSoon(true);
                }}
              ><Plus size={10} /></button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Table position mode */}
            <div className="flex items-center gap-0.5">
              {/* Inline (block flow) */}
              <button
                type="button"
                title="Inline — table flows with text"
                className={`p-1 rounded-md cursor-pointer transition-colors text-[9px] font-medium ${
                  (!tableWidgetEditor.model.wrapMode || tableWidgetEditor.model.wrapMode === "none")
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setTableWrapMode("none")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="4" x2="21" y2="4" />
                  <rect x="5" y="8" width="14" height="8" rx="1" />
                  <line x1="3" y1="20" x2="21" y2="20" />
                </svg>
              </button>
              {/* Positioned — draggable, text wraps around */}
              <button
                type="button"
                title="Positioned — drag to move, text wraps around"
                className={`p-1 rounded-md cursor-pointer transition-colors text-[9px] font-medium ${
                  tableWidgetEditor.model.wrapMode === "wrap"
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setTableWrapMode("wrap")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="7" y="5" width="10" height="7" rx="1" />
                  <line x1="3" y1="4" x2="5" y2="4" />
                  <line x1="19" y1="4" x2="21" y2="4" />
                  <line x1="3" y1="8" x2="5" y2="8" />
                  <line x1="19" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                  <line x1="3" y1="20" x2="21" y2="20" />
                </svg>
              </button>
            </div>

            <div className="flex-1" />

            {/* Delete table */}
            <button type="button" title="Delete table" className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" onClick={deleteWidgetTable}>
              <Trash2 size={14} />
            </button>
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
                        const txtColor = cellTxtFmt.color ?? baseTxtFmt.color;
                        const isActive = tableWidgetEditor.activeCell.r === rIdx && tableWidgetEditor.activeCell.c === cIdx;
                        const cellKey = `${rIdx},${cIdx}`;
                        return (
                          <td
                            key={`${tableRevision}-${rIdx}-${cIdx}`}
                            style={{
                              border: borderStr,
                              padding: 0,
                              verticalAlign: "top",
                              background: effectiveBg || undefined,
                              outline: isActive ? "2px solid rgba(37,99,235,0.8)" : undefined,
                              outlineOffset: isActive ? "-2px" : undefined,
                              position: "relative",
                            }}
                            onClick={(e) => {
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
                                  if (prev.activeCell.r === rIdx && prev.activeCell.c === cIdx) return prev; // no change
                                  return { ...prev, activeCell: { r: rIdx, c: cIdx } };
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
                                // Defer to avoid re-render that resets cursor position
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
                                  const cols = tableWidgetEditor.model.rows[0]?.length ?? 1;
                                  const totalRows = tableWidgetEditor.model.rows.length;
                                  let nextR = rIdx, nextC = cIdx;
                                  if (e.shiftKey) {
                                    nextC--;
                                    if (nextC < 0) { nextR--; nextC = cols - 1; }
                                    if (nextR < 0) { nextR = 0; nextC = 0; }
                                  } else {
                                    nextC++;
                                    if (nextC >= cols) { nextR++; nextC = 0; }
                                    if (nextR >= totalRows) {
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
                            {cIdx < (tableWidgetEditor.model.rows[0]?.length ?? 1) - 1 && (
                              <div
                                className="absolute top-0 -right-[3px] w-[6px] h-full cursor-col-resize hover:bg-blue-400/40 z-10"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const startX = e.clientX;
                                  const startW = tableWidgetEditor.model.colWidthsPx?.[cIdx] ?? 120;
                                  const maxTableW = pageWidthPx - 2 * pagePaddingPx;
                                  const onMove = (me: MouseEvent) => {
                                    const delta = me.clientX - startX;
                                    const nextW = Math.max(40, Math.round(startW + delta));
                                    setTableWidgetEditor((prev) => {
                                      if (!prev) return prev;
                                      const widths = [...(prev.model.colWidthsPx ?? [])];
                                      widths[cIdx] = nextW;
                                      // Clamp so total table width never exceeds available page width
                                      const totalW = widths.reduce((a, b) => a + b, 0);
                                      if (totalW > maxTableW) {
                                        widths[cIdx] = Math.max(40, nextW - (totalW - maxTableW));
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
              <button
                type="button"
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Star"
              >
                <Star className="w-4 h-4" />
              </button>
            </div>
          </div>
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
                  <MenuItem label="Open share panel" icon={MessageSquare} onClick={() => setDialog("share")} />
                  <MenuDivider />
                  <MenuItem label="Copy as HTML" icon={Copy} onClick={() => handleShareCopy("html")} />
                  <MenuItem label="Copy as Markdown" icon={Copy} onClick={() => handleShareCopy("markdown")} />
                  <MenuItem label="Copy as Text" icon={Copy} onClick={() => handleShareCopy("text")} />
                  <MenuItem label="Copy as JSON" icon={Copy} onClick={() => handleShareCopy("json")} />
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
            <MenuItem label="Move to bin" onClick={() => showToast("Move to bin: wire to your storage layer")} />
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
                      setVersions((prev) => [{ ts: Date.now(), title: docTitle, html: value.html, language }, ...prev].slice(0, 30));
                      showToast("Version saved");
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
              isChecked={isChromeCollapsed}
              onClick={() => {
                setIsChromeCollapsed((v) => {
                  const next = !v;
                  showToast(next ? "Menus collapsed" : "Menus expanded");
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
        </div>
      </div>
      )}

      {/* Top bar: templates (optional) */}
      {hasTemplates && !isChromeCollapsed && (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 justify-center">
            {resolvedTemplates.slice(0, 2).map((tpl) => {
              const Icon = tpl.icon ?? FileText;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateInsert(tpl)}
                  disabled={!canEdit}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/70 dark:bg-gray-800/60 midnight:bg-[#111827]/70 purple:bg-[#2a1447]/70 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title={tpl.label}
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70" />
                  <span className="text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                    {tpl.label}
                  </span>
                </button>
              );
            })}

            {resolvedTemplates.length > 2 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  disabled={!canEdit}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/70 dark:bg-gray-800/60 midnight:bg-[#111827]/70 purple:bg-[#2a1447]/70 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="More templates"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-200">More</span>
                </button>
                {moreOpen && (
                  <div className="absolute z-[90] top-full mt-2 right-0 w-[220px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] shadow-xl">
                    {resolvedTemplates.slice(2).map((tpl) => {
                      const Icon = tpl.icon ?? FileText;
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            handleTemplateInsert(tpl);
                            setMoreOpen(false);
                          }}
                          disabled={!canEdit}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">
                            {tpl.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      {!isChromeCollapsed && (
      <div className="px-3 pt-3 pb-2">
        <div className="flex flex-wrap items-center gap-1.5 justify-center">
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("undo")}
            title="Undo"
            Icon={Undo2}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("redo")}
            title="Redo"
            Icon={Redo2}
          />
          <ToolbarDivider />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("bold")}
            title="Bold"
            Icon={Bold}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("italic")}
            title="Italic"
            Icon={Italic}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("underline")}
            title="Underline"
            Icon={Underline}
          />
          <ToolbarDivider />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("insertUnorderedList")}
            title="Bulleted list"
            Icon={List}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("insertOrderedList")}
            title="Numbered list"
            Icon={ListOrdered}
          />
          <ToolbarDivider />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("justifyLeft")}
            title="Align left"
            Icon={AlignLeft}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("justifyCenter")}
            title="Align center"
            Icon={AlignCenter}
          />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => handleCommand("justifyRight")}
            title="Align right"
            Icon={AlignRight}
          />
          <ToolbarDivider />
          <ToolbarButton
            disabled={!canEdit}
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (!url) return;
              handleCommand("createLink", url);
            }}
            title="Insert link"
            Icon={Link2}
          />
          <ToolbarDivider />
          <button
            disabled={!canEdit}
            onMouseDown={(e) => {
              if (!canEdit) return;
              e.preventDefault();
            }}
            onClick={() => handleCommand("formatBlock", "h2")}
            className="px-2.5 h-8 rounded-lg text-[11px] font-bold border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/60 dark:bg-gray-800/50 midnight:bg-[#111827]/60 purple:bg-[#2a1447]/60 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Heading"
          >
            H
          </button>
          <button
            disabled={!canEdit}
            onMouseDown={(e) => {
              if (!canEdit) return;
              e.preventDefault();
            }}
            onClick={() => handleCommand("formatBlock", "p")}
            className="px-2.5 h-8 rounded-lg text-[11px] font-bold border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/60 dark:bg-gray-800/50 midnight:bg-[#111827]/60 purple:bg-[#2a1447]/60 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Normal text"
          >
            P
          </button>
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
          <div className="mx-auto w-full max-w-[860px] mb-2 px-2">
            <div className="h-8 rounded-xl border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/70 dark:bg-gray-900/60 midnight:bg-[#0b1220] purple:bg-[#170a27] flex items-center justify-between px-3 text-[10px] text-gray-500 dark:text-gray-400">
              <span>Ruler</span>
              <span>{showPrintLayout ? "Print layout" : "Web layout"}</span>
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
        >
          {showPrintLayout ? (
            <div className="flex flex-col items-center gap-6">
              {pages.map((html, idx) => (
                <div key={idx} className="w-full flex flex-col items-center">
                  <div
                    className={[
                      "w-full rounded-2xl shadow-md",
                      "bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27]",
                      "border border-gray-200/80 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10",
                    ].join(" ")}
                    style={{
                      maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : pageWidthPx,
                    }}
                  >
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
              className="mx-auto w-full rounded-2xl shadow-sm bg-white dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27] border border-transparent py-10"
              style={{
                maxWidth: isFullscreen ? "min(1200px, calc(100vw - 64px))" : pageWidthPx,
                paddingLeft: isFullscreen ? 48 : pagePaddingPx,
                paddingRight: isFullscreen ? 48 : pagePaddingPx,
              }}
            >
              <div
                contentEditable={canEdit}
                suppressContentEditableWarning
                ref={(el) => {
                  pageRefs.current[0] = el;
                  if (el && el.innerHTML !== (pages[0] || "")) el.innerHTML = pages[0] || "";
                }}
                className={[
                  "min-h-[520px] outline-none relative",
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
            [data-doc-table-widget="true"] {
              cursor: pointer;
              border-radius: 4px;
              transition: outline 0.15s;
              max-width: 100%;
              overflow: hidden;
            }
            [data-doc-table-widget="true"]:hover {
              outline: 2px solid rgba(37, 99, 235, 0.25);
              outline-offset: 2px;
            }
            [data-doc-table-widget="true"][data-doc-table-widget-selected="true"] {
              outline: 2px solid rgba(37, 99, 235, 0.6);
              outline-offset: 2px;
            }
            /* Grab cursor for positioned (wrap mode) tables */
            [data-doc-table-widget="true"][style*="position:absolute"] {
              cursor: grab;
            }
            [data-doc-table-widget="true"][style*="position:absolute"]:active {
              cursor: grabbing;
            }
            [contenteditable="true"]::after {
              content: "";
              display: block;
              clear: both;
            }
          `}</style>
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
      {dialog === "share" && (
        <DocDialog title="Share" onClose={() => setDialog(null)}>
          <div className="text-[12px] text-gray-600 dark:text-gray-300">
            This demo doesn’t create a public URL yet. You can still share by copying the document.
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <DialogButton onClick={() => handleShareCopy("html")}>Copy HTML</DialogButton>
            <DialogButton onClick={() => handleShareCopy("markdown")}>Copy Markdown</DialogButton>
            <DialogButton onClick={() => handleShareCopy("text")}>Copy Text</DialogButton>
            <DialogButton onClick={() => handleShareCopy("json")}>Copy JSON</DialogButton>
          </div>
        </DocDialog>
      )}

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
            <div className="text-[12px] text-gray-500 dark:text-gray-400">
              No saved versions yet. Use File → Version history → Save version.
            </div>
          ) : (
            <div className="max-h-[320px] overflow-auto scrollbar-thin">
              {versions.map((v) => (
                <button
                  key={v.ts}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => {
                    updateValue({ title: v.title, html: v.html, language: v.language });
                    showToast("Version restored");
                    setDialog(null);
                  }}
                >
                  <div className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">
                    {new Date(v.ts).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {v.title}
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
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 midnight:bg-cyan-500/15 purple:bg-pink-500/15 mx-1" />;
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
  id: "file" | "edit" | "view" | "insert";
  label: string;
  openMenu: "file" | "edit" | "view" | "insert" | null;
  onOpen: (id: "file" | "edit" | "view" | "insert") => void;
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

  useLayoutEffect(() => {
    const el = panelRef.current;
    const menuItem = el?.parentElement; // MenuItem container div
    if (!el || !menuItem) return;

    // Calibrate: backdrop-filter on an ancestor makes position:fixed relative
    // to that ancestor instead of the viewport. Measure the actual offset.
    el.style.top = "0px";
    el.style.left = "0px";
    const base = el.getBoundingClientRect();
    const offsetX = base.left; // 0 if truly viewport-relative, otherwise ancestor's position
    const offsetY = base.top;

    // Use the parent menu panel's right edge for horizontal alignment
    const parentPanel = menuItem.closest("[data-doc-menu-panel]");
    const itemRect = menuItem.getBoundingClientRect();
    const panelRect = parentPanel?.getBoundingClientRect();
    let top = itemRect.top - offsetY;
    let left = (panelRect ? panelRect.right : itemRect.right) - offsetX;
    // Prevent going off the right edge — flip to left side if needed
    const pw = el.offsetWidth;
    const targetLeftVp = panelRect ? panelRect.right : itemRect.right;
    if (targetLeftVp + pw > window.innerWidth) {
      left = ((panelRect ? panelRect.left : itemRect.left) - pw) - offsetX;
    }
    // Prevent going off the bottom edge
    const ph = el.offsetHeight;
    if (itemRect.top + ph > window.innerHeight) {
      top = Math.max(4 - offsetY, (window.innerHeight - ph) - offsetY);
    }
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  });

  return (
    <SubmenuCloseContext.Provider value={null}>
      <div
        ref={panelRef}
        data-doc-menu-panel
        className={`fixed z-[130] rounded-2xl border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-900 midnight:bg-[#0d1526] purple:bg-[#1f1035] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-visible ${className}`}
      >
        {/* Invisible bridge connecting parent menu item to this submenu */}
        <div className="absolute -left-4 top-0 w-4 h-full" />
        <div className="py-1">{children}</div>
      </div>
    </SubmenuCloseContext.Provider>
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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (!hasSubmenu) requestCloseMenus?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        // Cancel this item's own pending close timer
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        if (hasSubmenu) {
          // Open this submenu (implicitly closes any other open submenu via state)
          onHover?.();
        } else {
          // Non-submenu item: close any open submenu at this menu level
          closeSubmenus?.();
        }
      }}
      onMouseLeave={(e) => {
        // Only run close logic for items with an open submenu
        if (!hasSubmenu || !isSubmenuOpen || !onLeave) return;
        // If moving to a DOM descendant (e.g. fixed-position submenu panel), stay open
        const rt = e.relatedTarget;
        if (rt instanceof Node && containerRef.current?.contains(rt)) return;
        closeTimerRef.current = setTimeout(() => {
          // If another submenu already opened (state changed), skip
          if (!isSubmenuOpenRef.current) return;
          // If mouse is still somewhere in our container (including submenu panel), skip
          if (containerRef.current?.matches(":hover")) return;
          onLeave();
        }, 350);
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
        <span className="flex-1 min-w-0 truncate" title={label}>{label}</span>
        {shortcut && <span className="text-[12px] text-gray-400 dark:text-gray-500">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
      </button>
      {submenu && isSubmenuOpen && submenu}
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
    <button
      type="button"
      onMouseDown={(e) => {
        // Preserve selection/caret in editor (esp. inside tables)
        // so execCommand applies to the intended text.
        if (!disabled) e.preventDefault();
      }}
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/60 dark:bg-gray-800/50 midnight:bg-[#111827]/60 purple:bg-[#2a1447]/60 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100" />
    </button>
  );
}

