"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Play, Trash2, Copy, Palette, LayoutGrid, X, ArrowLeft, Presentation,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Strikethrough, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Image as ImageIcon, Type, Table2, Paintbrush, MessageCircle, Shapes,
  Share2, Undo2, Redo2, ZoomIn, ZoomOut, Minimize2, Minus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Upload, Eye, PenLine,
  Bookmark, ShieldCheck, Globe, Tag, FolderPlus, Lock, AlertTriangle, Send, Mail,
} from "lucide-react";
import { slideStorage, type SlideData, type SlideObject, type TableObject, type ChartType, type PresentationPermissions, DEFAULT_PERMISSIONS, createTextBox, createImageObj, createShapeObj, createDrawingObj, fitDrawingToStroke, createTableObj, createChartObj, createMediaObj, makeDefaultTitleObjects, makeDefaultContentObjects, makeDefaultClosingObjects } from "@/lib/slide-storage";
import { driveStorage, type DriveItem } from "@/lib/drive-storage";
import { permissionRequests } from "@/lib/permission-requests";
import { useNotifications } from "@/contexts/NotificationContext";
import SlideMenuBar from "./SlideMenuBar";
import SlideCanvasComponent from "./SlideCanvas";
import SlideChart from "./SlideChart";
import { setSlideClipboard, getSlideClipboard, packIntoFreeSpace } from "./slide-clipboard";
import ShapePickerDialogFull from "@/components/shared/ShapePickerDialog";
import LinkDialog from "@/components/shared/LinkDialog";
import { normalizeUrl, isDangerousUrl } from "@/lib/link-utils";
import { applyArrange } from "@/lib/editor-ops/arrange";
import { moveItem, reorderItem } from "@/lib/editor-ops/reorder";
import PresenterView from "@/components/shared/PresenterView";
import { useScreenRecorder } from "@/components/shared/useScreenRecorder";
import { SHAPE_DEFS } from "./shapes";

// Shared components
import { ToolbarButton, ToolbarDivider, ToolbarDropdown } from "@/components/shared/EditorToolbar";
import { EditorDialog, EditorDialogButton, TableGridPicker, EditingModeButton, type EditingMode } from "@/components/shared/EditorDialogs";
import { ShortcutsDialog, UpdatesDialog, TrainingDialog, AccessibilityDialog, DictionaryDialog, LinkedObjectsDialog, ExploreDialog, MenuSearchDialog, FormatOptionsDialog, MediaUrlDialog, applyA11y, loadA11y } from "./SlideToolsDialogs";
import { CommentAvatar, CommentCard, FloatingCommentPill, useMention, type DocComment, type CommentAuthor } from "@/components/shared/EditorComments";
import Button from "@/components/shared/Button";
import ShareDialog from "@/components/shared/ShareDialog";
import PublishDialog from "@/components/shared/PublishDialog";
import EmailDialog, { type EmailMode } from "@/components/shared/EmailDialog";
import DownloadDialog from "@/components/shared/DownloadDialog";
import ConvertToVideoDialog from "@/components/shared/ConvertToVideoDialog";
import MoveDialog from "@/components/shared/MoveDialog";

// ── Types ──
export interface SlideEditorValue {
  title: string;
  slides: SlideData[];
  theme: string;
}

interface SlideEditorProps {
  value: SlideEditorValue;
  onChange: (value: SlideEditorValue) => void;
}

// ── Themes ──
interface ThemeDef {
  bg: string; text: string; accent: string; label: string;
  category: "light" | "dark" | "gradient";
  layout: "center" | "left" | "split";
}

// ── Slide template builders ──

function slideHTML_Title(title: string, subtitle: string, a: string, t: string, layout: "center" | "left" | "split") {
  const bar = `<div style="width:80px;height:4px;border-radius:4px;background:${a};margin:${layout === "center" ? "0 auto 24px" : "0 0 24px"}"></div>`;
  const h1 = `<h1 style="font-size:2.4em;font-weight:800;letter-spacing:-0.02em;line-height:1.15;color:${t};margin:0 0 8px">${title}</h1>`;
  const sub = `<p style="font-size:1em;font-weight:400;opacity:0.5;color:${t};margin:0">${subtitle}</p>`;
  if (layout === "center") return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center">${bar}${h1}${sub}</div>`;
  if (layout === "left") return `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding-left:5%">${bar}${h1}${sub}</div>`;
  return `<div style="display:flex;height:100%"><div style="width:8px;background:${a};flex-shrink:0;border-radius:0 4px 4px 0"></div><div style="display:flex;flex-direction:column;justify-content:center;padding-left:8%">${bar}${h1}${sub}</div></div>`;
}

function slideHTML_Content(a: string, t: string) {
  return `<div style="display:flex;flex-direction:column;height:100%"><div style="width:60px;height:3px;border-radius:3px;background:${a};margin-bottom:16px"></div><h2 style="font-size:1.6em;font-weight:700;color:${t};margin:0 0 20px;letter-spacing:-0.01em">Section Title</h2><ul style="font-size:0.95em;color:${t};opacity:0.7;line-height:2;list-style:none;padding:0;margin:0"><li style="padding-left:20px;position:relative"><span style="position:absolute;left:0;color:${a}">&#x2022;</span>Key point one — describe your idea</li><li style="padding-left:20px;position:relative"><span style="position:absolute;left:0;color:${a}">&#x2022;</span>Key point two — provide evidence</li><li style="padding-left:20px;position:relative"><span style="position:absolute;left:0;color:${a}">&#x2022;</span>Key point three — explain the impact</li></ul></div>`;
}

function slideHTML_TwoColumn(a: string, t: string) {
  const col = (title: string, items: string[]) => `<div style="flex:1;min-width:0"><h3 style="font-size:1.2em;font-weight:700;color:${t};margin:0 0 12px">${title}</h3><ul style="font-size:0.85em;color:${t};opacity:0.7;line-height:1.9;list-style:none;padding:0;margin:0">${items.map(i => `<li style="padding-left:16px;position:relative"><span style="position:absolute;left:0;color:${a}">&#x2013;</span>${i}</li>`).join("")}</ul></div>`;
  return `<div style="display:flex;flex-direction:column;height:100%"><div style="width:60px;height:3px;border-radius:3px;background:${a};margin-bottom:16px"></div><h2 style="font-size:1.5em;font-weight:700;color:${t};margin:0 0 24px">Comparison</h2><div style="display:flex;gap:32px">${col("Option A", ["First advantage", "Second advantage", "Third advantage"])}${col("Option B", ["First advantage", "Second advantage", "Third advantage"])}</div></div>`;
}

function slideHTML_SectionDivider(title: string, a: string, t: string) {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center"><div style="width:48px;height:48px;border-radius:50%;background:${a};opacity:0.15;margin-bottom:20px"></div><div style="width:60px;height:3px;border-radius:3px;background:${a};margin:0 auto 20px"></div><h2 style="font-size:2em;font-weight:800;color:${t};margin:0;letter-spacing:-0.02em">${title}</h2></div>`;
}

function slideHTML_Quote(a: string, t: string) {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:0 10%"><div style="font-size:3em;color:${a};opacity:0.3;line-height:1;margin-bottom:8px">&ldquo;</div><p style="font-size:1.4em;font-weight:500;color:${t};line-height:1.6;margin:0 0 16px;font-style:italic">The best way to predict the future is to create it.</p><p style="font-size:0.85em;color:${t};opacity:0.5;margin:0">&mdash; Peter Drucker</p></div>`;
}

function slideHTML_Closing(a: string, t: string) {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center"><div style="width:80px;height:4px;border-radius:4px;background:${a};margin:0 auto 24px"></div><h1 style="font-size:2.6em;font-weight:800;color:${t};margin:0 0 12px;letter-spacing:-0.02em">Thank You</h1><p style="font-size:1em;color:${t};opacity:0.5;margin:0 0 24px">Questions &amp; Discussion</p><p style="font-size:0.85em;color:${a};margin:0">your.email@example.com</p></div>`;
}

const THEMES: Record<string, ThemeDef> = {
  // Light
  default:  { bg: "#ffffff", text: "#1a1a2e", accent: "#3b82f6", label: "Default", category: "light", layout: "center" },
  minimal:  { bg: "#fafafa", text: "#18181b", accent: "#71717a", label: "Minimal", category: "light", layout: "left" },
  clean:    { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0ea5e9", label: "Clean", category: "light", layout: "center" },
  warm:     { bg: "#fffbeb", text: "#78350f", accent: "#f59e0b", label: "Warm", category: "light", layout: "split" },
  rose:     { bg: "#fff1f2", text: "#881337", accent: "#f43f5e", label: "Rose", category: "light", layout: "center" },
  nature:   { bg: "#f0fdf4", text: "#14532d", accent: "#22c55e", label: "Nature", category: "light", layout: "left" },
  // Dark
  midnight: { bg: "#0f172a", text: "#e2e8f0", accent: "#38bdf8", label: "Midnight", category: "dark", layout: "center" },
  charcoal: { bg: "#18181b", text: "#fafafa", accent: "#a78bfa", label: "Charcoal", category: "dark", layout: "split" },
  forest:   { bg: "#052e16", text: "#bbf7d0", accent: "#4ade80", label: "Forest", category: "dark", layout: "left" },
  navy:     { bg: "#1e1b4b", text: "#e0e7ff", accent: "#818cf8", label: "Navy", category: "dark", layout: "center" },
  // Gradient
  aurora:   { bg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #3b82f6 100%)", text: "#ffffff", accent: "#38bdf8", label: "Aurora", category: "gradient", layout: "center" },
  sunset:   { bg: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f59e0b 100%)", text: "#ffffff", accent: "#fbbf24", label: "Sunset", category: "gradient", layout: "left" },
  cosmic:   { bg: "linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)", text: "#ffffff", accent: "#c4b5fd", label: "Cosmic", category: "gradient", layout: "center" },
  ocean:    { bg: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)", text: "#ffffff", accent: "#7dd3fc", label: "Ocean", category: "gradient", layout: "split" },
  ember:    { bg: "linear-gradient(135deg, #450a0a 0%, #b91c1c 50%, #ef4444 100%)", text: "#ffffff", accent: "#fca5a5", label: "Ember", category: "gradient", layout: "center" },
  neon:     { bg: "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #c026d3 100%)", text: "#ffffff", accent: "#f0abfc", label: "Neon", category: "gradient", layout: "left" },
};

/** Generate a full themed slide deck from a theme definition */
function buildThemedSlides(t: ThemeDef, title: string, existingSlides: SlideData[]): SlideData[] {
  const { accent: a, text: tx, bg } = t;

  return existingSlides.map((slide, i) => {
    const hasObjects = slide.objects && slide.objects.length > 0;
    // First slide always gets title objects
    if (i === 0) return { ...slide, background: bg, objects: makeDefaultTitleObjects(title || "Presentation Title", a, tx), content: "" };
    // Last slide gets closing
    if (i === existingSlides.length - 1 && existingSlides.length > 1) return { ...slide, background: bg, objects: hasObjects ? slide.objects : makeDefaultClosingObjects(a, tx), content: "" };
    // Middle slides: keep existing objects or assign content template
    if (hasObjects) return { ...slide, background: bg };
    return { ...slide, background: bg, objects: makeDefaultContentObjects(a, tx), content: "" };
  });
}

// ── Transitions ──
const TRANSITION_STYLES: Record<string, string> = {
  none: "",
  fade: "transition-opacity duration-500",
  dissolve: "transition-all duration-700",
  flip: "transition-transform duration-500 [transform-style:preserve-3d]",
  cube: "transition-transform duration-600",
};

function makeSlide(content = "", bg = "#ffffff"): SlideData {
  return { id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, content, notes: "", background: bg, transition: "fade" };
}

// ── Ruler Component ──
function SlideRuler({ direction, length, slideOffset }: { direction: "h" | "v"; length: number; slideOffset: number }) {
  const isH = direction === "h";
  // Use cm-based ruler: ~37.8px per cm
  const pxPerCm = 37.8;
  const totalCm = Math.ceil(length / pxPerCm);

  return (
    <div className={`relative ${isH ? "h-[20px] w-full" : "w-[20px] h-full"} bg-[#f1f3f4] dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 select-none overflow-hidden`}>
      {/* Slide range highlight */}
      <div
        className={`absolute ${isH ? "h-full" : "w-full"} bg-white/70 dark:bg-[#1a1d24]/50 midnight:bg-cyan-900/30 purple:bg-pink-900/30`}
        style={isH ? { left: slideOffset, width: length } : { top: slideOffset, height: length }}
      />
      {/* Ticks and numbers */}
      {Array.from({ length: totalCm + 1 }, (_, i) => {
        const pos = slideOffset + i * pxPerCm;
        return (
          <React.Fragment key={i}>
            {/* Major tick */}
            <div
              className="absolute"
              style={isH ? { left: pos, bottom: 0 } : { top: pos, right: 0 }}
            >
              <div className={isH ? "w-px h-[10px] bg-gray-400/70" : "h-px w-[10px] bg-gray-400/70"} />
            </div>
            {/* Number label */}
            {i > 0 && (
              <span
                className="absolute text-[8px] text-gray-400 font-medium"
                style={isH
                  ? { left: pos - 3, top: 1 }
                  : { top: pos - 4, left: 2 }
                }
              >
                {i}
              </span>
            )}
            {/* Half tick */}
            {i < totalCm && (
              <div
                className="absolute"
                style={isH ? { left: pos + pxPerCm / 2, bottom: 0 } : { top: pos + pxPerCm / 2, right: 0 }}
              >
                <div className={isH ? "w-px h-[6px] bg-gray-300/60" : "h-px w-[6px] bg-gray-300/60"} />
              </div>
            )}
          </React.Fragment>
        );
      })}
      {/* Border line */}
      <div className={`absolute ${isH ? "bottom-0 left-0 right-0 h-px" : "right-0 top-0 bottom-0 w-px"} bg-gray-300/50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50`} />
    </div>
  );
}

/** Renders slide content — objects (new system) or HTML (legacy) */
function SlideContentPreview({ slide, themeTextColor, scale = 1 }: { slide: SlideData; themeTextColor?: string; scale?: number }) {
  if (slide.objects && slide.objects.length > 0) {
    return (
      <div className="w-full h-full relative" style={{ color: themeTextColor }}>
        {slide.objects.map(obj => (
          <div key={obj.id} className="absolute overflow-hidden" style={{ left: `${obj.x}%`, top: `${obj.y}%`, width: `${obj.width}%`, height: `${obj.height}%`, zIndex: obj.zIndex, transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined }}>
            {obj.type === "textbox" && (
              <div style={{ fontSize: obj.fontSize * scale, fontFamily: obj.fontFamily, color: obj.color, fontWeight: obj.bold ? 700 : 400, fontStyle: obj.italic ? "italic" : "normal", textAlign: obj.align, display: "flex", alignItems: obj.verticalAlign === "middle" ? "center" : obj.verticalAlign === "bottom" ? "flex-end" : "flex-start", width: "100%", height: "100%", padding: obj.padding ?? 4, backgroundColor: obj.backgroundColor || "transparent" }}>
                <div className="w-full" dangerouslySetInnerHTML={{ __html: obj.content || `<span style="opacity:0.3">${obj.placeholder || ""}</span>` }} />
              </div>
            )}
            {obj.type === "image" && (() => {
              const hasCr = obj.cropTop || obj.cropRight || obj.cropBottom || obj.cropLeft;
              return <img src={obj.src} alt={obj.alt} className="block w-full h-full" style={{
                objectFit: hasCr ? "fill" : (obj.objectFit || "cover"), opacity: obj.opacity ?? 1,
                borderRadius: obj.borderRadius ?? 0,
                clipPath: hasCr ? `inset(${obj.cropTop || 0}% ${obj.cropRight || 0}% ${obj.cropBottom || 0}% ${obj.cropLeft || 0}%)` : undefined,
              }} />;
            })()}
            {obj.type === "shape" && (() => {
              const def = SHAPE_DEFS[obj.shape];
              if (!def) return <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="4" fill={obj.fill} /></svg>;
              const hasStroke = obj.stroke && obj.stroke !== "transparent" && obj.strokeWidth > 0;
              let svgHtml = def.svg
                .replace(/fill="currentColor"/g, `fill="${obj.fill}"`)
                .replace(/stroke="currentColor"/g, `stroke="${hasStroke ? obj.stroke : "none"}" stroke-width="${hasStroke ? obj.strokeWidth : 0}"`);
              if (hasStroke) {
                svgHtml = svgHtml.replace(/<(rect|circle|ellipse|polygon|path)([^>]*?)(?<!\bstroke=)(\s*\/?>)/g,
                  (m: string, tag: string, attrs: string, close: string) => attrs.includes("stroke=") ? m : `<${tag}${attrs} stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}"${close}`);
              }
              return (
                <div className="w-full h-full relative" style={{ opacity: obj.opacity ?? 1 }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none" dangerouslySetInnerHTML={{ __html: svgHtml }} />
                  {obj.text && (
                    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none"
                      style={{ color: obj.textColor || "#fff", fontSize: (obj.textSize || 14) * scale, fontWeight: 600, padding: "10%", wordBreak: "break-word" as const }}>
                      {obj.text}
                    </div>
                  )}
                </div>
              );
            })()}
            {obj.type === "drawing" && (
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <path d={obj.paths} fill="none" stroke={obj.stroke} strokeWidth={obj.strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            )}
            {obj.type === "chart" && <SlideChart obj={obj} />}
            {obj.type === "media" && (obj.mediaKind === "audio"
              ? <audio className="w-full h-full" controls src={obj.src} loop={obj.loop} style={{ display: "block" }} />
              : <video className="w-full h-full rounded-lg bg-black" controls src={obj.src} poster={obj.poster} loop={obj.loop} muted={obj.muted} autoPlay={obj.autoplay} playsInline style={{ objectFit: "contain" }} />)}
            {obj.type === "table" && (() => {
              const cw = obj.colWidths || Array(obj.cols).fill(100 / obj.cols);
              const rh = obj.rowHeights || Array(obj.rows).fill(100 / obj.rows);
              return (
              <table className="w-full h-full" style={{ borderCollapse: "collapse", fontSize: obj.fontSize * scale, fontFamily: obj.fontFamily, tableLayout: "fixed" }}>
                <colgroup>{cw.map((w, i) => <col key={i} style={{ width: `${w}%` }} />)}</colgroup>
                <tbody>
                  {obj.cells.map((row, ri) => (
                    <tr key={ri} style={{ height: `${rh[ri]}%` }}>
                      {row.map((cell, ci) => {
                        const isHeader = obj.headerRow && ri === 0;
                        const bgColor = isHeader ? obj.headerColor : ri % 2 === 0 ? obj.evenRowColor : obj.oddRowColor;
                        const resolvedBg = cell.backgroundColor || bgColor;
                        const textColor = isHeader && obj.headerColor !== "transparent" ? "#fff" : (cell.color || "#1f2937");
                        return (
                          <td key={ci} style={{
                            border: `${obj.borderWidth}px solid ${obj.borderColor}`,
                            padding: obj.cellPadding * scale,
                            backgroundColor: resolvedBg,
                            color: textColor,
                            fontWeight: isHeader || cell.bold ? 700 : 400,
                            fontStyle: cell.italic ? "italic" : "normal",
                            textAlign: cell.align || (isHeader ? "center" : "left"),
                            verticalAlign: cell.verticalAlign || "middle",
                            overflow: "hidden",
                            fontSize: cell.fontSize ? cell.fontSize * scale : undefined,
                            fontFamily: cell.fontFamily || undefined,
                          }}>
                            <span className={`block ${cell.noWrap ? "truncate whitespace-nowrap" : "whitespace-pre-wrap break-words"} [&_img]:max-w-full [&_img]:h-auto`} dangerouslySetInnerHTML={{ __html: cell.content || "" }} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              );
            })()}
          </div>
        ))}
      </div>
    );
  }
  // Legacy HTML fallback
  return <div className="w-full h-full" style={{ color: themeTextColor }} dangerouslySetInnerHTML={{ __html: slide.content || "" }} />;
}

function ShapeSVGPreview({ shape }: { shape: string }) {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      {shape === "rect" && <rect x="2" y="6" width="28" height="20" rx="2" fill="#3b82f6" opacity="0.7" />}
      {shape === "circle" && <ellipse cx="16" cy="16" rx="14" ry="12" fill="#3b82f6" opacity="0.7" />}
      {shape === "triangle" && <polygon points="16,4 30,28 2,28" fill="#3b82f6" opacity="0.7" />}
      {shape === "arrow-right" && <polygon points="4,10 20,10 20,4 28,16 20,28 20,22 4,22" fill="#3b82f6" opacity="0.7" />}
      {shape === "star" && <polygon points="16,2 19,12 30,12 21,18 25,28 16,22 7,28 11,18 2,12 13,12" fill="#3b82f6" opacity="0.7" />}
      {shape === "line-h" && <line x1="2" y1="16" x2="30" y2="16" stroke="#3b82f6" strokeWidth="2" />}
    </svg>
  );
}

// ── Slide Canvas with rulers and proper fit ──
function SlideCanvasArea({ zoom, activeSlide, canEdit, editorRef, contentRef, onInput, slideRatio = { w: 16, h: 9 }, showRuler = true, showGuides = false, guides = [], snapToGrid = false, snapToGuides = false, onClick, isSuggesting = false, themeTextColor, themeAccent, onGuideMove, onGuideDelete, selectedObjectId, onSelectObject, onObjectsChange, drawingMode, drawingColor, drawingWidth, onDrawingComplete, onAddComment, onActivateLink, onSelectionChange }: {
  zoom: number;
  activeSlide: SlideData | undefined;
  canEdit: boolean;
  editorRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onInput: (html: string) => void;
  slideRatio?: { w: number; h: number };
  showRuler?: boolean;
  showGuides?: boolean;
  guides?: { id: string; orientation: "h" | "v"; position: number }[];
  snapToGrid?: boolean;
  snapToGuides?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isSuggesting?: boolean;
  themeTextColor?: string;
  themeAccent?: string;
  onGuideMove?: (id: string, position: number) => void;
  onGuideDelete?: (id: string) => void;
  selectedObjectId?: string | null;
  onSelectObject?: (id: string | null) => void;
  onObjectsChange?: (objects: import("@/lib/slide-storage").SlideObject[]) => void;
  drawingMode?: boolean;
  drawingColor?: string;
  drawingWidth?: number;
  onDrawingComplete?: (paths: string) => void;
  onAddComment?: (objId: string) => void;
  onActivateLink?: (href: string) => void;
  onSelectionChange?: (ids: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 450 });
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 600 });

  useEffect(() => {
    const calc = () => {
      const el = containerRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      setContainerSize({ w: cw, h: ch });
      const pad = 32;
      const rulerH = 18;
      const availW = cw - pad * 2 - rulerH;
      const availH = ch - pad * 2 - rulerH;
      let w = availW;
      let h = w * slideRatio.h / slideRatio.w;
      if (h > availH) {
        h = availH;
        w = h * slideRatio.w / slideRatio.h;
      }
      setSize({ w: Math.max(200, Math.round(w)), h: Math.max(112, Math.round(h)) });
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [slideRatio]);

  const slideLeft = 18 + (containerSize.w - 18 - size.w) / 2;
  const slideTop = 18 + (containerSize.h - 18 - size.h) / 2;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-[#e8eaed]/60 dark:bg-[#0b0e14] midnight:bg-[#060a1e] purple:bg-[#120722] overflow-hidden relative">
      {/* Horizontal ruler */}
      {showRuler && <SlideRuler direction="h" length={size.w} slideOffset={slideLeft} />}

      <div className="flex flex-1 min-h-0">
        {/* Vertical ruler */}
        {showRuler && <SlideRuler direction="v" length={size.h} slideOffset={slideTop - 18} />}

        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center overflow-hidden" onClick={() => {
          // Don't deselect if native color picker is open
          const activeEl = document.activeElement as HTMLInputElement | null;
          if (activeEl?.type === "color") return;
          onSelectObject?.(null);
        }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: size.w,
              height: size.h,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
            className="relative transition-transform duration-200 ease-out flex-shrink-0"
          >
            <div
              ref={editorRef}
              data-slide-canvas
              className="absolute inset-0 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden"
              style={{ background: activeSlide?.background || "#ffffff" }}
            >
              {/* Object-based canvas (new system) */}
              {activeSlide?.objects && onObjectsChange ? (
                <SlideCanvasComponent
                  objects={activeSlide.objects}
                  onChange={onObjectsChange}
                  selectedId={selectedObjectId ?? null}
                  onSelect={onSelectObject ?? (() => {})}
                  background="transparent"
                  themeTextColor={themeTextColor}
                  themeAccent={themeAccent}
                  canEdit={canEdit}
                  showGuides={showGuides}
                  guides={guides}
                  snapToGrid={snapToGrid}
                  snapToGuides={snapToGuides}
                  onGuideMove={onGuideMove}
                  onGuideDelete={onGuideDelete}
                  drawingMode={drawingMode}
                  drawingColor={drawingColor}
                  drawingWidth={drawingWidth}
                  onDrawingComplete={onDrawingComplete}
                  onAddComment={onAddComment}
                  onActivateLink={onActivateLink}
                  onSelectionChange={onSelectionChange}
                />
              ) : (
                /* Legacy: single contentEditable fallback */
                <div
                  ref={contentRef}
                  contentEditable={canEdit}
                  suppressContentEditableWarning
                  className={[
                    "absolute inset-0 outline-none px-[8%] py-[6%]",
                    isSuggesting ? "caret-green-500" : "",
                  ].join(" ")}
                  style={themeTextColor ? { color: themeTextColor } : undefined}
                  dangerouslySetInnerHTML={{ __html: activeSlide?.content || "" }}
                  onInput={(e) => { if (!isSuggesting) onInput((e.target as HTMLDivElement).innerHTML); }}
                  onClick={onClick}
                />
              )}
              {/* Guides overlay — draggable */}
              {showGuides && guides.map(g => (
                <div
                  key={g.id}
                  className={`absolute z-[5] group ${g.orientation === "v" ? "cursor-col-resize" : "cursor-row-resize"}`}
                  style={g.orientation === "v"
                    ? { left: `${g.position}%`, top: 0, bottom: 0, width: 8, marginLeft: -4 }
                    : { top: `${g.position}%`, left: 0, right: 0, height: 8, marginTop: -4 }
                  }
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const slideEl = e.currentTarget.parentElement;
                    if (!slideEl) return;
                    const rect = slideEl.getBoundingClientRect();
                    const handleMove = (ev: MouseEvent) => {
                      const pos = g.orientation === "v"
                        ? ((ev.clientX - rect.left) / rect.width) * 100
                        : ((ev.clientY - rect.top) / rect.height) * 100;
                      onGuideMove?.(g.id, Math.max(0, Math.min(100, pos)));
                    };
                    const handleUp = () => {
                      document.removeEventListener("mousemove", handleMove);
                      document.removeEventListener("mouseup", handleUp);
                    };
                    document.addEventListener("mousemove", handleMove);
                    document.addEventListener("mouseup", handleUp);
                  }}
                  onDoubleClick={(e) => { e.stopPropagation(); onGuideDelete?.(g.id); }}
                  title="Drag to move, double-click to delete"
                >
                  {/* Visible guide line */}
                  <div
                    className="absolute bg-blue-500/70 group-hover:bg-blue-500"
                    style={g.orientation === "v"
                      ? { left: 3, top: 0, bottom: 0, width: 1 }
                      : { top: 3, left: 0, right: 0, height: 1 }
                    }
                  />
                  {/* Position label on hover */}
                  <div className={`absolute opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-white bg-blue-600 rounded px-1 py-0.5 pointer-events-none ${
                    g.orientation === "v" ? "top-1 left-2" : "left-1 top-2"
                  }`}>
                    {g.position.toFixed(0)}%
                  </div>
                </div>
              ))}
              {/* Snap grid overlay — dotted grid every 10% */}
              {snapToGrid && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[3]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="slide-grid-dots" width="10%" height="10%" patternUnits="objectBoundingBox">
                      <circle cx="50%" cy="50%" r="1" fill="rgba(66,133,244,0.25)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#slide-grid-dots)" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Slide Picker Modal ──
function SlidePickerModal({ title: modalTitle, subtitle, slides: slideList, defaultSelected, onConfirm, onClose, confirmLabel = "Confirm", theme = "default" }: {
  title: string;
  subtitle?: string;
  slides: SlideData[];
  defaultSelected?: Set<string>;
  onConfirm: (selectedSlides: SlideData[]) => void;
  onClose: () => void;
  confirmLabel?: string;
  /** Slide theme id — the body reads THEMES[theme] for thumbnail text colour. It was referencing
      an out-of-scope `theme`, which threw a ReferenceError and crashed this modal on open. */
  theme?: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => defaultSelected || new Set(slideList.map(s => s.id)));

  const toggleSlide = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.size === slideList.length ? new Set() : new Set(slideList.map(s => s.id)));
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[600px] max-w-[92vw] max-h-[80vh] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{modalTitle}</h2>
            {subtitle && <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleAll}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 transition-colors cursor-pointer">
              {selectedIds.size === slideList.length ? "Deselect all" : "Select all"}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Slide grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
            {slideList.map((slide, idx) => {
              const isSelected = selectedIds.has(slide.id);
              return (
                <button key={slide.id} onClick={() => toggleSlide(slide.id)}
                  className={`relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] shadow-lg shadow-blue-500/10"
                      : "ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-video overflow-hidden bg-white" style={{ background: slide.background || "#fff" }}>
                    <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: `scale(${160 / 384})` }}>
                      <div style={{ aspectRatio: "16/9" }}><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} /></div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isSelected ? "bg-blue-500 text-white" : "bg-black/50 text-white/80"}`}>{idx + 1}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected ? "bg-blue-500 shadow-md shadow-blue-500/30" : "bg-white/80 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 group-hover:border-blue-400"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  {!isSelected && <div className="absolute inset-0 bg-white/30 dark:bg-black/20 group-hover:bg-transparent transition-colors" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          <span className="text-[13px] text-gray-400">{selectedIds.size} of {slideList.length} selected</span>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">Cancel</button>
            <button onClick={() => onConfirm(slideList.filter(s => selectedIds.has(s.id)))} disabled={selectedIds.size === 0}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer">
              {confirmLabel} {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Copy Selected Modal (uses SlidePickerModal) ──
function CopySelectedModal({ slides, title, theme, activeSlideIdx, onClose }: {
  slides: SlideData[]; title: string; theme: string; activeSlideIdx: number; onClose: () => void;
}) {
  return (
    <SlidePickerModal
      title="Make a copy"
      subtitle="Select the slides to include in the copy"
      slides={slides}
      theme={theme}
      defaultSelected={new Set(slides.map(s => s.id))}
      confirmLabel="Copy slides"
      onClose={onClose}
      onConfirm={(selected) => {
        const newId = slideStorage.create({
          title: title + " (Copy)",
          slides: selected,
          theme,
        });
        window.open(`/presentations/editor?id=${newId}`, "_blank");
        onClose();
      }}
    />
  );
}

// ── Import Slides Modal ──
function ImportSlidesModal({ currentPresId, onImport, onClose, theme = "default" }: {
  currentPresId: string;
  onImport: (slides: SlideData[]) => void;
  onClose: () => void;
  /** Slide theme id — see SlidePickerModal: `theme` was out of scope here too. */
  theme?: string;
}) {
  const [presentations] = useState(() =>
    slideStorage.list().filter(p => p.id !== currentPresId)
  );
  const [selectedPresId, setSelectedPresId] = useState<string | null>(null);
  const [selectedSlideIds, setSelectedSlideIds] = useState<Set<string>>(new Set());
  const selectedPres = presentations.find(p => p.id === selectedPresId);

  const toggleSlide = (slideId: string) => {
    setSelectedSlideIds(prev => {
      const next = new Set(prev);
      if (next.has(slideId)) next.delete(slideId); else next.add(slideId);
      return next;
    });
  };

  const selectAll = () => {
    if (!selectedPres) return;
    if (selectedSlideIds.size === selectedPres.slides.length) {
      setSelectedSlideIds(new Set());
    } else {
      setSelectedSlideIds(new Set(selectedPres.slides.map(s => s.id)));
    }
  };

  const handleImport = () => {
    if (!selectedPres || selectedSlideIds.size === 0) return;
    onImport(selectedPres.slides.filter(s => selectedSlideIds.has(s.id)));
  };

  // Full-screen centered modal (not using EditorDialog — custom for better control)
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[600px] max-w-[92vw] max-h-[80vh] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
          <div className="flex items-center gap-3">
            {selectedPresId && (
              <button onClick={() => { setSelectedPresId(null); setSelectedSlideIds(new Set()); }}
                className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                {selectedPresId ? "Select slides" : "Import slides"}
              </h2>
              {selectedPresId && selectedPres && (
                <p className="text-[12px] text-gray-400 mt-0.5">{selectedPres.title}</p>
              )}
              {!selectedPresId && (
                <p className="text-[12px] text-gray-400 mt-0.5">Choose a presentation to import from</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedPresId && (
              <button onClick={selectAll}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 transition-colors cursor-pointer">
                {selectedSlideIds.size === selectedPres?.slides.length ? "Deselect all" : "Select all"}
              </button>
            )}
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {presentations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-[15px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">No presentations found</p>
              <p className="text-[13px] text-gray-400 mt-1 max-w-[280px]">Create another presentation first, then come back to import slides from it</p>
            </div>

          ) : !selectedPresId ? (
            /* Step 1: Presentation list */
            <div className="space-y-2">
              {presentations.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPresId(p.id); setSelectedSlideIds(new Set(p.slides.map(s => s.id))); }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer group border border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10 hover:shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-[96px] flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                    <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: "scale(0.25)", background: p.slides[0]?.background || "#fff" }}>
                      <div style={{ aspectRatio: "16/9" }} dangerouslySetInnerHTML={{ __html: p.slides[0]?.content || "" }} />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] px-2 py-0.5 rounded-full">
                        {p.slides.length} slide{p.slides.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Edited {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>

          ) : (
            /* Step 2: Slide grid */
            <div className="grid grid-cols-3 gap-3">
              {selectedPres?.slides.map((slide, idx) => {
                const isSelected = selectedSlideIds.has(slide.id);
                return (
                  <button
                    key={slide.id}
                    onClick={() => toggleSlide(slide.id)}
                    className={`relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] shadow-lg shadow-blue-500/10"
                        : "ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md"
                    }`}
                  >
                    {/* Slide preview */}
                    <div className="aspect-video overflow-hidden bg-white" style={{ background: slide.background || "#fff" }}>
                      <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: `scale(${160 / 384})` }}>
                        <div style={{ aspectRatio: "16/9" }}><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} /></div>
                      </div>
                    </div>

                    {/* Slide number */}
                    <div className="absolute bottom-2 left-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-black/50 text-white/80"
                      }`}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-500 shadow-md shadow-blue-500/30"
                          : "bg-white/80 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 group-hover:border-blue-400"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    {/* Dim overlay for unselected */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-white/30 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — only on step 2 */}
        {selectedPresId && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
            <span className="text-[13px] text-gray-400">
              {selectedSlideIds.size} of {selectedPres?.slides.length} selected
            </span>
            <div className="flex gap-2.5">
              <button onClick={onClose}
                className="px-5 py-2 rounded-xl text-[13px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleImport} disabled={selectedSlideIds.size === 0}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer">
                Import {selectedSlideIds.size > 0 ? `${selectedSlideIds.size} slide${selectedSlideIds.size !== 1 ? "s" : ""}` : "slides"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal typings for the Web Speech API (voice typing), which lacks TS lib types.
interface SpeechRecEvent { resultIndex: number; results: { length: number; [i: number]: { [j: number]: { transcript: string } } } }
interface SpeechRec { continuous: boolean; interimResults: boolean; lang: string; onresult: (e: SpeechRecEvent) => void; onend: () => void; start(): void; stop(): void }

// ── Component ──
export default function SlideEditor({ value, onChange }: SlideEditorProps) {
  const { title, slides, theme } = value;
  const { addNotification } = useNotifications();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  // Live-slideshow tools: blank screen (B/W), laser pointer (L), speaker-notes panel (S)
  const [blankScreen, setBlankScreen] = useState<null | "black" | "white">(null);
  const [laserPointer, setLaserPointer] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [presenterNotes, setPresenterNotes] = useState(false);
  const [presenterView, setPresenterView] = useState(false); // rich presenter screen (P)
  const recorder = useScreenRecorder({ title }); // shared screen recorder
  const [showThemes, setShowThemes] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [editingMode, setEditingMode] = useState<EditingMode>("editing");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPageSetup, setShowPageSetup] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showImportSlides, setShowImportSlides] = useState(false);
  const [showCopySelected, setShowCopySelected] = useState(false);
  const [showPublishWeb, setShowPublishWeb] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showConvertVideo, setShowConvertVideo] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState<EmailMode | null>(null);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showAddToFolderDialog, setShowAddToFolderDialog] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(() => {
    if (typeof window === "undefined") return "Presentations";
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id ? slideStorage.getFolder(id) : "Presentations";
  });
  const [isStarred, setIsStarred] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return false;
    const pres = slideStorage.get(id);
    return pres?.starred ?? false;
  });
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [permissionBlockedMsg, setPermissionBlockedMsg] = useState<{ message: string; permType?: "copy" | "print" | "download" } | null>(null);
  const [permissionRequestSent, setPermissionRequestSent] = useState(false);
  const [permissions, setPermissionsState] = useState<PresentationPermissions>(() => {
    if (typeof window === "undefined") return { ...DEFAULT_PERMISSIONS };
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id ? slideStorage.getPermissions(id) : { ...DEFAULT_PERMISSIONS };
  });
  // Block keyboard shortcuts when copy/print/download is disabled
  useEffect(() => {
    if (!permissions.disableCopyPrintDownload) return;
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && (e.key === "c" || e.key === "x")) {
        e.preventDefault();
        setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" });
      }
      if (ctrl && e.key === "p") {
        e.preventDefault();
        setPermissionBlockedMsg({ message: "Printing is disabled by the document owner.", permType: "print" });
      }
      if (ctrl && e.key === "s") {
        e.preventDefault();
        setPermissionBlockedMsg({ message: "Downloading is disabled by the document owner.", permType: "download" });
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [permissions.disableCopyPrintDownload]);

  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showVersionNameDialog, setShowVersionNameDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [presentationLanguage, setPresentationLanguage] = useState(() => {
    if (typeof window === "undefined") return "English";
    const p = new URLSearchParams(window.location.search);
    const id = p.get("id");
    return id ? slideStorage.getLanguage(id) : "English";
  });
  const [comments, setComments] = useState<DocComment[]>([]);
  const [zoom, setZoom] = useState(100);
  const [slideRatio, setSlideRatio] = useState<{ label: string; w: number; h: number }>({ label: "Widescreen 16:9", w: 16, h: 9 });
  const [notesHeight, setNotesHeight] = useState(0);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [filmstripCollapsed, setFilmstripCollapsed] = useState(false);
  // Tools/Help utility dialog (shortcuts, updates, accessibility, dictionary, explore, …)
  const [utilDialog, setUtilDialog] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const [spellCheckOn, setSpellCheckOn] = useState(true);
  const [voiceListening, setVoiceListening] = useState(false);
  const voiceRecogRef = useRef<{ stop: () => void } | null>(null);
  // Audio/Video insert: a hidden file input reused for both kinds
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mediaKindRef = useRef<"audio" | "video">("video");
  // Image upload: a PERSISTENT hidden file input. A dynamically-created input that is clicked
  // while the dropdown unmounts in the same event gets its user-gesture dropped in some browsers
  // (the picker silently never opens). A stable input in the DOM always opens reliably.
  const imageInputRef = useRef<HTMLInputElement>(null);
  // Apply saved accessibility preferences on mount.
  useEffect(() => { applyA11y(loadA11y()); }, []);
  const [showRuler, setShowRuler] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [guides, setGuides] = useState<{ id: string; orientation: "h" | "v"; position: number }[]>([]);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [snapToGuides, setSnapToGuides] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGridView, setShowGridView] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  // The full selection set (single OR multi), lifted from the canvas so the Arrange menu can act.
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const selectedObjectIdsRef = useRef<string[]>([]);
  selectedObjectIdsRef.current = selectedObjectIds;
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#1a1a2e");
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [textBoxDrawMode, setTextBoxDrawMode] = useState(false);
  const [showImageUrlDialog, setShowImageUrlDialog] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  // Link (Insert → Link / Ctrl+K / right-click → Link). `mode` records whether we're linking a
  // run of selected TEXT or the selected OBJECT, so Apply knows which to write to.
  const [linkDialog, setLinkDialog] = useState<{ mode: "text" | "object"; objId?: string; url: string; targetId?: string } | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [showImageSearchDialog, setShowImageSearchDialog] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [showDrivePickerDialog, setShowDrivePickerDialog] = useState(false);
  const [showShapePickerDialog, setShowShapePickerDialog] = useState<string | null>(null); // category or null
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const undoStackRef = useRef<string[]>([]); // JSON strings for deep clone
  const redoStackRef = useRef<string[]>([]);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const activeSlideIdxRef = useRef(activeSlideIdx);
  activeSlideIdxRef.current = activeSlideIdx;
  const [toast, setToastRaw] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setToast = useCallback((msg: string) => {
    setToastRaw(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastRaw(null), 2000);
  }, []);
  const isDraggingNotes = useRef(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const activeSlide = slides[activeSlideIdx] || slides[0];
  const canEdit = editingMode !== "viewing"; // contentEditable: true in editing + suggesting
  const canDirectEdit = editingMode === "editing"; // toolbar/execCommand: only in editing mode
  const isSuggesting = editingMode === "suggesting";
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [suggestionPopupPos, setSuggestionPopupPos] = useState<{ top: number; left: number } | null>(null);

  const currentAuthor: CommentAuthor = { id: "current-user", name: "You", avatar: undefined };

  const updateSlides = useCallback((newSlides: SlideData[]) => {
    undoStackRef.current.push(JSON.stringify(slidesRef.current));
    if (undoStackRef.current.length > 50) undoStackRef.current.shift();
    redoStackRef.current = [];
    onChange({ ...value, slides: newSlides });
  }, [value, onChange]);

  const updateCurrentSlide = useCallback((updates: Partial<SlideData>) => {
    const newSlides = [...slides];
    newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], ...updates };
    updateSlides(newSlides);
  }, [slides, activeSlideIdx, updateSlides]);

  // Object management for current slide
  const currentObjects = activeSlide?.objects || [];
  const updateCurrentObjects = useCallback((objs: SlideObject[]) => {
    updateCurrentSlide({ objects: objs });
  }, [updateCurrentSlide]);

  /** Find the content area bounds — below the title, with margins so inserted
   *  objects (diagrams, charts) always fit on the slide and aren't flush to the edge. */
  const getContentArea = useCallback((): { x: number; y: number; w: number; h: number } => {
    const objs = activeSlide?.objects || [];
    const SIDE = 8;        // left/right margin
    const TOP = 20;        // default top (leaves room for a title)
    const BOTTOM = 92;     // bottom margin (8% breathing room)
    // A real title is a SMALL textbox near the top — ignore the full-slide title
    // placeholder (height ~90) which would otherwise leave no usable area.
    const titleObj = objs.find(o => o.type === "textbox" && o.y < 20 && o.height >= 8 && o.height <= 35);
    const top = titleObj ? titleObj.y + titleObj.height + 4 : TOP;
    return { x: SIDE, y: top, w: 100 - SIDE * 2, h: Math.max(20, BOTTOM - top) };
  }, [activeSlide]);

  /** Layout/placeholder objects (empty title/subtitle/content boxes, decorative
   *  lines) don't count as real content when deciding whether a slide is "full". */
  const isLayoutPlaceholder = useCallback((o: SlideObject): boolean => {
    if (o.type === "textbox") {
      const c = (o.content || "").trim();
      if (c === "" || c === "<br>") return true;          // empty title/subtitle/content box
      if (o.y < 12 && o.height >= 45) return true;          // full-slide title placeholder
      return false;
    }
    if (o.type === "shape" && (o.height ?? 0) < 2) return true; // thin decorative line
    return false;
  }, []);

  /** Is the current slide the presentation TITLE page — i.e. only a title/subtitle and no
   *  real content? Inserting content onto it should instead start a new slide so the title
   *  page keeps to itself. */
  const isBareTitleSlide = useCallback((): boolean => {
    const objs = currentObjects;
    const titleish = (o: SlideObject) => o.type === "textbox" && (
      (o.y < 12 && o.height >= 45) ||                                   // full-slide title placeholder
      (o.align === "center" && o.y < 60 && (o.fontSize ?? 18) >= 26)    // centered large title / subtitle
    );
    const real = objs.filter(o => !isLayoutPlaceholder(o) && !titleish(o));
    if (real.length > 0) return false;
    const hasLegacyTitle = !!(activeSlide?.content && activeSlide.content.trim() && activeSlide.content.trim() !== "<br>");
    return objs.some(titleish) || hasLegacyTitle;
  }, [currentObjects, activeSlide, isLayoutPlaceholder]);

  /** Get position for a new object — stacks below existing real content (ignoring
   *  placeholders). May return a y past the content area; the caller's fit check
   *  then moves it to a fresh slide. */
  const getInsertPosition = useCallback((objWidth: number, objHeight: number): { x: number; y: number } => {
    const area = getContentArea();
    const content = currentObjects.filter(o => !isLayoutPlaceholder(o) && o.y + o.height > area.y);
    let y = area.y;
    if (content.length > 0) {
      const lowestBottom = Math.max(...content.map(o => o.y + o.height));
      y = lowestBottom + 2;
    }
    const x = area.x + (area.w - objWidth) / 2; // centered horizontally
    return { x: Math.max(2, x), y: Math.max(area.y, y) };
  }, [getContentArea, currentObjects, isLayoutPlaceholder]);

  /** Does the given object group fit on the current slide — i.e. it neither
   *  overflows the content area nor overlaps existing real content? */
  const fitsOnCurrentSlide = useCallback((objs: SlideObject[]): boolean => {
    const area = getContentArea();
    const newBottom = Math.max(...objs.map(o => o.y + o.height));
    if (newBottom > area.y + area.h + 1) return false; // would run off the slide
    const content = currentObjects.filter(o => !isLayoutPlaceholder(o));
    const overlaps = (a: SlideObject, b: SlideObject) =>
      a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    return !content.some(c => objs.some(o => overlaps(o, c)));
  }, [getContentArea, currentObjects, isLayoutPlaceholder]);

  /**
   * Try to PACK a new object group into the free space on the current slide. Returns the
   * group repositioned (and uniformly shrunk if needed) into an empty region that doesn't
   * overlap existing content, or `null` if the slide is genuinely full.
   *
   * This is what lets a small chart sit next to / below another instead of jumping to a new
   * slide. We only overflow to a new slide when no free region (even shrunk) can hold it.
   */
  const placeInFreeSpace = useCallback((objs: SlideObject[]): SlideObject[] | null => {
    const area = getContentArea();
    const content = currentObjects.filter(o => !isLayoutPlaceholder(o));
    return packIntoFreeSpace(objs, content, area);
  }, [getContentArea, currentObjects, isLayoutPlaceholder]);

  // Add object(s) to the slide. If they don't fit on the current slide (it's full),
  // a new slide is created after it and the object(s) are placed there instead.
  // A single update is used so multiple objects (e.g. a diagram) aren't lost to a
  // stale currentObjects snapshot.
  const addObjectsToSlide = useCallback((objs: SlideObject[]) => {
    if (objs.length === 0) return;
    // The presentation title page keeps to itself: inserting content while on it starts a
    // new slide instead of dropping the content on top of the title.
    const onTitleSlide = isBareTitleSlide();
    // Pack the object(s) into free space on the current slide. Only when none exists
    // (the page is genuinely full) do we fall through to a new slide.
    const fitted = onTitleSlide ? null : placeInFreeSpace(objs);
    if (fitted) {
      // Auto-migrate legacy slide if needed, then append the fitted object(s)
      if (!activeSlide?.objects || activeSlide.objects.length === 0) {
        const th = THEMES[theme] || THEMES.default;
        const htmlContent = activeSlide?.content?.trim() || "";
        const existingObjs: SlideObject[] = [];
        if (htmlContent && htmlContent !== "<br>") {
          existingObjs.push(createTextBox({ x: 5, y: 5, width: 90, height: 90, content: htmlContent, fontSize: 18, color: th.text, align: "left", verticalAlign: "top", zIndex: 1 }));
        }
        updateCurrentSlide({ objects: [...existingObjs, ...fitted], content: "" });
      } else {
        updateCurrentSlide({ objects: [...currentObjects, ...fitted] });
      }
      setSelectedObjectId(fitted[fitted.length - 1].id);
    } else {
      // Current slide is full → open a new slide and place the object(s) there,
      // repositioned to the top of the new slide's content area.
      const th = THEMES[theme] || THEMES.default;
      const area = getContentArea();
      const minY = Math.min(...objs.map(o => o.y));
      const delta = area.y - minY;
      const placed = delta !== 0 ? objs.map(o => ({ ...o, y: o.y + delta } as SlideObject)) : objs;
      setToast(onTitleSlide ? "Added to a new slide — the title page stays on its own" : "Slide was full — added to a new slide");
      // Defer the whole new-slide creation out of the current event. Adding a slide
      // (a structural change) while a menu is open orphans the menu's portal and
      // swallows the next menu action, so we wait until the menu has closed. Read
      // live state via refs at fire time so rapid back-to-back inserts don't race
      // on a stale slide list.
      requestAnimationFrame(() => {
        const curSlides = slidesRef.current;
        const curIdx = activeSlideIdxRef.current;
        const newSlide = makeSlide("", th.bg);
        newSlide.objects = placed;
        const ns = [...curSlides];
        ns.splice(curIdx + 1, 0, newSlide);
        undoStackRef.current.push(JSON.stringify(curSlides));
        onChangeRef.current({ ...valueRef.current, slides: ns });
        setActiveSlideIdx(curIdx + 1);
        setSelectedObjectId(placed[placed.length - 1].id);
      });
    }
  }, [activeSlide, currentObjects, updateCurrentSlide, theme, placeInFreeSpace, isBareTitleSlide, getContentArea, slides, activeSlideIdx, updateSlides, setToast]);

  const addObjectToSlide = useCallback((obj: SlideObject) => {
    addObjectsToSlide([obj]);
  }, [addObjectsToSlide]);

  const handleDrawingComplete = useCallback((paths: string) => {
    // Shrink the object to a tight box around the actual stroke (not the whole slide),
    // so each drawing is independently selectable/movable instead of overlapping.
    const fit = fitDrawingToStroke(paths);
    const obj = createDrawingObj(fit.paths, { x: fit.x, y: fit.y, width: fit.width, height: fit.height, stroke: drawingColor, strokeWidth: drawingWidth, zIndex: currentObjects.length + 1 });
    // A freeform drawing is an annotation at the exact spot the user drew — keep it on THIS
    // slide. Never route it through free-space packing/overflow (that would jump the stroke to
    // a new slide, since a drawing spans the whole page). Append directly to the current slide.
    updateCurrentSlide({ objects: [...currentObjects, obj], content: "" });
    setSelectedObjectId(obj.id);
    // Stay in drawing mode so the user can keep sketching multiple strokes.
  }, [drawingColor, drawingWidth, currentObjects, updateCurrentSlide]);

  // Auto-migrate legacy slide (HTML content) to objects
  const migrateSlideToObjects = useCallback(() => {
    if (activeSlide?.objects && activeSlide.objects.length > 0) return; // Already has objects
    const th = THEMES[theme] || THEMES.default;
    const htmlContent = activeSlide?.content?.trim() || "";
    const objects: SlideObject[] = [];
    if (htmlContent && htmlContent !== "<br>") {
      // Convert existing HTML content into a text box
      objects.push(createTextBox({
        x: 5, y: 5, width: 90, height: 90,
        content: htmlContent, fontSize: 18, color: th.text,
        align: "left", verticalAlign: "top",
        zIndex: 1,
      }));
    } else {
      // Empty slide: add default content template
      objects.push(...makeDefaultContentObjects(th.accent, th.text));
    }
    updateCurrentSlide({ objects, content: "" });
    setToast("Slide upgraded to canvas mode");
  }, [activeSlide, theme, updateCurrentSlide, setToast]);

  // ── Link (Insert → Link, Ctrl+K, right-click → Link) ──────────────────────────────
  // Links a selected run of TEXT if there is one, otherwise the selected OBJECT.
  const openLinkDialog = useCallback(() => {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    const range = sel && sel.rangeCount > 0 && !sel.isCollapsed ? sel.getRangeAt(0) : null;
    const inEditable = !!range && !!(range.commonAncestorContainer as HTMLElement | null)
      ?.parentElement?.closest?.('[contenteditable="true"]');

    if (range && inEditable) {
      // Remember the selection — opening the dialog blurs it, and execCommand needs it back.
      savedRangeRef.current = range.cloneRange();
      const existing = (range.commonAncestorContainer as HTMLElement).parentElement?.closest("a");
      setLinkDialog({ mode: "text", url: existing?.getAttribute("href") || "" });
      return;
    }

    const objId = selectedObjectId;
    if (!objId) { setToast("Select text or an object to link"); return; }
    const obj = currentObjects.find(o => o.id === objId);
    const existing = obj?.link || "";
    const slideTarget = existing.startsWith("slide://") ? existing.slice("slide://".length) : undefined;
    setLinkDialog({ mode: "object", objId, url: slideTarget ? "" : existing, targetId: slideTarget });
  }, [selectedObjectId, currentObjects, setToast]);

  const openLinkDialogRef = useRef(openLinkDialog);
  useEffect(() => { openLinkDialogRef.current = openLinkDialog; }, [openLinkDialog]);

  const applyLink = useCallback((href: string) => {
    const d = linkDialog;
    if (!d) return;
    if (d.mode === "text") {
      // Restore the selection we captured, then let execCommand wrap it in an <a>.
      const sel = window.getSelection();
      if (sel && savedRangeRef.current) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      document.execCommand("createLink", false, href);
      savedRangeRef.current = null;
    } else if (d.objId) {
      updateCurrentSlide({ objects: currentObjects.map(o => (o.id === d.objId ? { ...o, link: href } : o)) });
    }
    setLinkDialog(null);
    setToast("Link applied");
  }, [linkDialog, currentObjects, updateCurrentSlide, setToast]);

  const removeLink = useCallback(() => {
    const d = linkDialog;
    if (!d) return;
    if (d.mode === "text") {
      const sel = window.getSelection();
      if (sel && savedRangeRef.current) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
      document.execCommand("unlink");
      savedRangeRef.current = null;
    } else if (d.objId) {
      updateCurrentSlide({ objects: currentObjects.map(o => (o.id === d.objId ? { ...o, link: undefined } : o)) });
    }
    setLinkDialog(null);
    setToast("Link removed");
  }, [linkDialog, currentObjects, updateCurrentSlide, setToast]);

  /** Activate a link: navigate to a slide (slide://<id>) or open the URL in a new tab. */
  const activateLink = useCallback((href: string) => {
    if (href.startsWith("slide://")) {
      const id = href.slice("slide://".length);
      const idx = slidesRef.current.findIndex(s => s.id === id);
      if (idx >= 0) setActiveSlideIdx(idx);
      return;
    }
    if (isDangerousUrl(href)) return; // never open javascript:/data: hrefs
    window.open(normalizeUrl(href), "_blank", "noopener,noreferrer");
  }, []);

  // Opens the native file picker via the persistent hidden <input> below (reliable across browsers).
  const handleImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  // Insert an uploaded/selected image file, sizing the box to the image's natural aspect ratio
  // (on a 16:9 slide) so it isn't letterboxed or stretched.
  const insertImageFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      migrateSlideToObjects();
      const probe = new window.Image();
      const place = (w: number, h: number) => {
        const pos = getInsertPosition(w, h);
        addObjectToSlide(createImageObj(src, { ...pos, width: w, height: h, zIndex: currentObjects.length + 1 }));
      };
      probe.onload = () => {
        const nat = (probe.naturalWidth || 1) / (probe.naturalHeight || 1);
        const w = 45;
        // heightPct so on-screen aspect (accounting for 16:9 slide) matches the image's natural aspect
        const h = Math.max(8, Math.min(80, Math.round((w * 16 / 9) / nat)));
        place(w, h);
      };
      probe.onerror = () => place(45, 34);
      probe.src = src;
    };
    reader.readAsDataURL(file);
  }, [currentObjects.length, addObjectToSlide, migrateSlideToObjects, getInsertPosition]);

  const slideTranslations: Record<string, { title: string; subtitle: string }> = {
    English: { title: "Click to add title", subtitle: "Click to add subtitle" },
    Spanish: { title: "Haga clic para añadir título", subtitle: "Haga clic para añadir subtítulo" },
    French: { title: "Cliquez pour ajouter un titre", subtitle: "Cliquez pour ajouter un sous-titre" },
    German: { title: "Klicken Sie, um einen Titel hinzuzufügen", subtitle: "Klicken Sie, um einen Untertitel hinzuzufügen" },
    Portuguese: { title: "Clique para adicionar título", subtitle: "Clique para adicionar subtítulo" },
    Italian: { title: "Fai clic per aggiungere un titolo", subtitle: "Fai clic per aggiungere un sottotitolo" },
    Dutch: { title: "Klik om een titel toe te voegen", subtitle: "Klik om een ondertitel toe te voegen" },
    Russian: { title: "Нажмите, чтобы добавить заголовок", subtitle: "Нажмите, чтобы добавить подзаголовок" },
    Chinese: { title: "点击添加标题", subtitle: "点击添加副标题" },
    Japanese: { title: "タイトルを追加するにはクリック", subtitle: "サブタイトルを追加するにはクリック" },
    Korean: { title: "제목을 추가하려면 클릭하세요", subtitle: "부제목을 추가하려면 클릭하세요" },
    Arabic: { title: "انقر لإضافة عنوان", subtitle: "انقر لإضافة عنوان فرعي" },
    Hindi: { title: "शीर्षक जोड़ने के लिए क्लिक करें", subtitle: "उपशीर्षक जोड़ने के लिए क्लिक करें" },
    Yoruba: { title: "Tẹ lati fi àkọlé kún", subtitle: "Tẹ lati fi àkọlé-abẹ́ kún" },
    Igbo: { title: "Pịa iji tinye aha", subtitle: "Pịa iji tinye aha nke abụọ" },
    Hausa: { title: "Danna don ƙara taken", subtitle: "Danna don ƙara ƙaramin taken" },
    Swahili: { title: "Bofya ili kuongeza kichwa", subtitle: "Bofya ili kuongeza kichwa kidogo" },
    Zulu: { title: "Chofoza ukuze ungeze isihloko", subtitle: "Chofoza ukuze ungeze isihloko esincane" },
  };

  const addSlide = useCallback(() => {
    const th = THEMES[theme] || THEMES.default;
    const newSlide = makeSlide("", th.bg);
    newSlide.objects = makeDefaultContentObjects(th.accent, th.text);
    const newSlides = [...slides];
    newSlides.splice(activeSlideIdx + 1, 0, newSlide);
    updateSlides(newSlides);
    setActiveSlideIdx(activeSlideIdx + 1);
  }, [slides, activeSlideIdx, updateSlides, theme]);

  const duplicateSlide = useCallback(() => {
    const newSlides = [...slides];
    const dup = { ...slides[activeSlideIdx], id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    newSlides.splice(activeSlideIdx + 1, 0, dup);
    updateSlides(newSlides);
    setActiveSlideIdx(activeSlideIdx + 1);
  }, [slides, activeSlideIdx, updateSlides]);

  const deleteSlide = useCallback(() => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== activeSlideIdx);
    updateSlides(newSlides);
    setActiveSlideIdx(Math.min(activeSlideIdx, newSlides.length - 1));
  }, [slides, activeSlideIdx, updateSlides]);

  // ── Find and Replace for slides ──
  const slideFindNext = useCallback(() => {
    if (!findQuery || !editorRef.current) return;
    const content = editorRef.current;
    const sel = window.getSelection();
    // Start searching from current cursor position
    const startNode = sel?.focusNode || content;
    const startOffset = sel?.focusOffset || 0;

    // Use window.find for browser-native search
    const found = (window as any).find(findQuery, false, false, true, false, false, false);
    if (!found) {
      // Wrap around: move to beginning and try again
      sel?.removeAllRanges();
      const range = document.createRange();
      range.setStart(content, 0);
      range.collapse(true);
      sel?.addRange(range);
      const foundWrap = (window as any).find(findQuery, false, false, true, false, false, false);
      if (!foundWrap) {
        // Not found at all
        return;
      }
    }
  }, [findQuery]);

  const slideReplace = useCallback(() => {
    if (!findQuery || !editorRef.current) return;
    const sel = window.getSelection();
    if (sel && sel.toString() === findQuery) {
      document.execCommand("insertText", false, replaceQuery);
    }
    // Find next occurrence
    slideFindNext();
  }, [findQuery, replaceQuery, slideFindNext]);

  const slideReplaceAll = useCallback(() => {
    if (!findQuery || !editorRef.current) return;
    const content = editorRef.current;
    let count = 0;
    // Move to start
    const sel = window.getSelection();
    sel?.removeAllRanges();
    const range = document.createRange();
    range.setStart(content, 0);
    range.collapse(true);
    sel?.addRange(range);
    // Find and replace all
    while ((window as any).find(findQuery, false, false, true, false, false, false)) {
      document.execCommand("insertText", false, replaceQuery);
      count++;
      if (count > 1000) break; // safety limit
    }
  }, [findQuery, replaceQuery]);

  // Continuously save editor selection so menu actions can restore it
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
          savedSelectionRef.current = range.cloneRange();
        }
      }
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const restoreSlideSelection = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const sel = window.getSelection();
    if (!sel) return;
    if (savedSelectionRef.current) {
      editor.focus();
      try {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
        savedSelectionRef.current = null;
        return;
      } catch { /* range may be invalid */ }
    }
    // Fallback: focus editor with cursor at end
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const insertTable = useCallback((rows: number, cols: number) => {
    const th = THEMES[theme] || THEMES.default;
    const tableHeight = Math.min(60, 8 + rows * 8);
    const tableObj = createTableObj(rows, cols, {
      x: 10, y: 20, width: 80, height: tableHeight,
      zIndex: 1,
    });
    // Use refs for fresh data — avoids stale closure issues
    const currentSlides = [...slidesRef.current];
    const idx = activeSlideIdx;
    const slide = currentSlides[idx];
    const existingObjects = slide?.objects || [];
    tableObj.zIndex = existingObjects.length + 1;
    currentSlides[idx] = { ...slide, objects: [...existingObjects, tableObj] };
    // Push undo, update via ref-based onChange
    undoStackRef.current.push(JSON.stringify(slidesRef.current));
    if (undoStackRef.current.length > 50) undoStackRef.current.shift();
    redoStackRef.current = [];
    onChangeRef.current({ ...valueRef.current, slides: currentSlides });
    setSelectedObjectId(tableObj.id);
    setShowTablePicker(false);
  }, [theme, activeSlideIdx]);

  const addComment = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text) return;
    const now = new Date().toISOString();
    const newComment: DocComment = {
      id: `comment-${Date.now()}`,
      documentId: "slide",
      author: currentAuthor,
      selectedText: text,
      highlightRange: { pageIndex: activeSlideIdx, startOffset: 0, endOffset: 0, anchorPath: "", focusPath: "" },
      text: "",
      mentions: [],
      status: "open",
      replies: [],
      createdAt: now,
      updatedAt: now,
    };
    setComments(prev => [...prev, newComment]);
    setShowCommentSidebar(true);
  }, [currentAuthor]);

  // Auto-scroll filmstrip to keep active slide fully visible
  useEffect(() => {
    const container = filmstripRef.current;
    if (!container) return;
    const activeThumb = container.querySelector(`[data-slide-idx="${activeSlideIdx}"]`) as HTMLElement | null;
    if (!activeThumb) return;
    const containerRect = container.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    // If thumbnail is above the visible area
    if (thumbRect.top < containerRect.top) {
      container.scrollTop -= (containerRect.top - thumbRect.top + 8);
    }
    // If thumbnail is below the visible area
    if (thumbRect.bottom > containerRect.bottom) {
      container.scrollTop += (thumbRect.bottom - containerRect.bottom + 8);
    }
  }, [activeSlideIdx]);

  // Keyboard navigation + tools in slideshow (matches common presenter shortcuts)
  useEffect(() => {
    if (!isPresenting) return;
    let numBuf = "";
    let numTimer: ReturnType<typeof setTimeout> | null = null;
    const go = (idx: number) => setActiveSlideIdx(Math.max(0, Math.min(idx, slides.length - 1)));
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      // Type a slide number then Enter to jump to it
      if (/^[0-9]$/.test(k)) { numBuf += k; if (numTimer) clearTimeout(numTimer); numTimer = setTimeout(() => { numBuf = ""; }, 1200); return; }
      if (k === "Enter" && numBuf) { go(parseInt(numBuf, 10) - 1); numBuf = ""; return; }
      if (k === "Escape") { setIsPresenting(false); setBlankScreen(null); setLaserPointer(false); setPresenterNotes(false); return; }
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "n" || k === "N") { e.preventDefault(); setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1)); }
      else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace" || k === "p" || k === "P") { e.preventDefault(); setActiveSlideIdx(i => Math.max(i - 1, 0)); }
      else if (k === "Home") { e.preventDefault(); go(0); }
      else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
      else if (k === "b" || k === "B") { setBlankScreen(s => s === "black" ? null : "black"); }
      else if (k === "w" || k === "W") { setBlankScreen(s => s === "white" ? null : "white"); }
      else if (k === "l" || k === "L") { setLaserPointer(v => !v); }
      else if (k === "s" || k === "S") { setPresenterNotes(v => !v); }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); if (numTimer) clearTimeout(numTimer); };
  }, [isPresenting, slides.length]);

  // Track the cursor for the laser pointer while presenting.
  useEffect(() => {
    if (!isPresenting || !laserPointer) { setLaserPos(null); return; }
    const move = (e: MouseEvent) => setLaserPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isPresenting, laserPointer]);

  // Keyboard navigation in editor — PageUp/PageDown always work globally
  useEffect(() => {
    if (isPresenting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "PageDown") { e.preventDefault(); setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1)); }
      if (e.key === "PageUp") { e.preventDefault(); setActiveSlideIdx(i => Math.max(i - 1, 0)); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPresenting, slides.length]);

  // Keyboard shortcuts: F11, F5, Ctrl+Alt+1, Ctrl+Z/Y/C/X/V/D for objects
  // Uses refs to avoid stale closures — effect only registers once
  const selectedObjRef = useRef(selectedObjectId);
  selectedObjRef.current = selectedObjectId;
  const activeSlideRef = useRef(activeSlide);
  activeSlideRef.current = activeSlide;
  const updateCurrentSlideRef = useRef(updateCurrentSlide);
  updateCurrentSlideRef.current = updateCurrentSlide;
  // Paste routes through addObjectsToSlide so it lands in free space (or a new slide if full).
  const addObjectsToSlideRef = useRef(addObjectsToSlide);
  addObjectsToSlideRef.current = addObjectsToSlide;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isEditingText = active?.getAttribute("contenteditable") === "true" || active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";

      if (e.key === "F11") { e.preventDefault(); setIsFullscreen(v => !v); }
      else if (e.key === "Escape") { setShowGridView(false); setIsFullscreen(false); setTextBoxDrawMode(false); }
      else if (e.key === "F5" && e.ctrlKey) { e.preventDefault(); setActiveSlideIdx(0); setIsPresenting(true); }
      else if (e.key === "F5") { e.preventDefault(); setIsPresenting(true); }
      else if (e.key === "1" && e.ctrlKey && e.altKey) { e.preventDefault(); setShowGridView(v => !v); }
      // Ctrl+K — link. Deliberately handled BEFORE the !isEditingText guard: it must work both
      // while editing text (link the selected run) and with an object selected.
      else if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openLinkDialogRef.current();
      }
      else if (!isEditingText && (e.ctrlKey || e.metaKey)) {
        if (e.key === "z") {
          e.preventDefault();
          const p = undoStackRef.current.pop();
          if (p) { redoStackRef.current.push(JSON.stringify(slidesRef.current)); onChangeRef.current({ ...valueRef.current, slides: JSON.parse(p) }); }
        }
        else if (e.key === "y") {
          e.preventDefault();
          const n = redoStackRef.current.pop();
          if (n) { undoStackRef.current.push(JSON.stringify(slidesRef.current)); onChangeRef.current({ ...valueRef.current, slides: JSON.parse(n) }); }
        }
        else if (e.key === "c" && selectedObjRef.current) {
          // Copy the selected object (expanding to its whole group) to the SHARED clipboard,
          // which works across slides, the keyboard, the Edit menu and the right-click menu.
          const objs = activeSlideRef.current?.objects || [];
          const obj = objs.find(o => o.id === selectedObjRef.current);
          if (obj) {
            const gid = (obj as { groupId?: string }).groupId;
            const sel = gid ? objs.filter(o => (o as { groupId?: string }).groupId === gid) : [obj];
            setSlideClipboard(sel);
          }
        }
        else if (e.key === "x" && selectedObjRef.current) {
          const objs = activeSlideRef.current?.objects || [];
          const obj = objs.find(o => o.id === selectedObjRef.current);
          if (obj) {
            const gid = (obj as { groupId?: string }).groupId;
            const sel = gid ? objs.filter(o => (o as { groupId?: string }).groupId === gid) : [obj];
            const ids = new Set(sel.map(o => o.id));
            setSlideClipboard(sel);
            updateCurrentSlideRef.current({ objects: objs.filter(o => !ids.has(o.id)) });
            setSelectedObjectId(null);
          }
        }
        else if (e.key === "v") {
          const clip = getSlideClipboard();
          if (clip && clip.length) {
            e.preventDefault();
            // Re-id so we don't duplicate ids, then route through addObjectsToSlide → lands in
            // free space (or a new slide if full).
            const stamp = Date.now();
            const fresh = clip.map((o, i) => ({ ...o, id: `obj-${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}` } as SlideObject));
            addObjectsToSlideRef.current(fresh);
          }
        }
        else if (e.key === "d" && selectedObjRef.current) {
          e.preventDefault();
          const objs = activeSlideRef.current?.objects;
          const obj = objs?.find(o => o.id === selectedObjRef.current);
          if (obj) {
            const dup = { ...JSON.parse(JSON.stringify(obj)), id: `obj-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, x: obj.x + 3, y: obj.y + 3 };
            updateCurrentSlideRef.current({ objects: [...objs!, dup] });
            setSelectedObjectId(dup.id);
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // Empty deps — all values accessed via refs

  // ── Suggestion system (suggesting mode) — uses native addEventListener like DocEditor ──
  const handleSuggestionBeforeInput = useCallback((e: InputEvent) => {
    if (!e.inputType) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    // Handle text insertion
    if (e.inputType === "insertText" || e.inputType === "insertParagraph") {
      e.preventDefault();
      const id = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const text = e.inputType === "insertParagraph" ? "<br>" : (e.data || "");
      const span = document.createElement("span");
      span.dataset.suggestion = id;
      span.dataset.suggestionType = "insert";
      span.style.cssText = "color:#16a34a;text-decoration:underline;text-decoration-color:#16a34a;text-underline-offset:2px;cursor:pointer;";
      span.innerHTML = text;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      // Move cursor after the inserted span
      range.setStartAfter(span);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      // Sync content back
      if (contentRef.current) {
        updateCurrentSlide({ content: contentRef.current.innerHTML });
      }
      return;
    }

    // Handle deletion (backspace/delete)
    if (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward") {
      e.preventDefault();
      const range = sel.getRangeAt(0);
      if (range.collapsed) {
        // Select the character to delete
        if (e.inputType === "deleteContentBackward") {
          range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
        } else {
          range.setEnd(range.endContainer, range.endOffset + 1);
        }
      }
      const text = range.toString();
      if (!text) return;
      const id = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const span = document.createElement("span");
      span.dataset.suggestion = id;
      span.dataset.suggestionType = "delete";
      span.style.cssText = "color:#dc2626;text-decoration:line-through;text-decoration-color:#dc2626;cursor:pointer;opacity:0.7;";
      span.textContent = text;
      range.deleteContents();
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      if (contentRef.current) {
        updateCurrentSlide({ content: contentRef.current.innerHTML });
      }
      return;
    }

    // Block all other input types in suggesting mode (formatting, paste, etc.)
    e.preventDefault();
  }, [updateCurrentSlide]);

  // Attach native beforeinput listener when in suggesting mode (like DocEditor)
  useEffect(() => {
    if (editingMode !== "suggesting") return;
    const el = contentRef.current;
    if (!el) return;
    const handler = (e: Event) => handleSuggestionBeforeInput(e as InputEvent);
    el.addEventListener("beforeinput", handler);
    return () => el.removeEventListener("beforeinput", handler);
  }, [editingMode, handleSuggestionBeforeInput]);

  const acceptSuggestion = useCallback((id: string) => {
    if (!contentRef.current) return;
    const spans = contentRef.current.querySelectorAll(`[data-suggestion="${id}"]`);
    spans.forEach(span => {
      const type = span.getAttribute("data-suggestion-type");
      if (type === "insert") {
        const parent = span.parentNode;
        while (span.firstChild) parent?.insertBefore(span.firstChild, span);
        parent?.removeChild(span);
      } else if (type === "delete") {
        span.parentNode?.removeChild(span);
      }
    });
    updateCurrentSlide({ content: contentRef.current.innerHTML });
    setActiveSuggestionId(null);
    setSuggestionPopupPos(null);
    setToast("Suggestion accepted");
  }, [updateCurrentSlide, setToast]);

  const rejectSuggestion = useCallback((id: string) => {
    if (!contentRef.current) return;
    const spans = contentRef.current.querySelectorAll(`[data-suggestion="${id}"]`);
    spans.forEach(span => {
      const type = span.getAttribute("data-suggestion-type");
      if (type === "insert") {
        span.parentNode?.removeChild(span);
      } else if (type === "delete") {
        const parent = span.parentNode;
        while (span.firstChild) parent?.insertBefore(span.firstChild, span);
        parent?.removeChild(span);
      }
    });
    updateCurrentSlide({ content: contentRef.current.innerHTML });
    setActiveSuggestionId(null);
    setSuggestionPopupPos(null);
    setToast("Suggestion rejected");
  }, [updateCurrentSlide, setToast]);

  // Handle clicking on suggestion spans to show accept/reject popup
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const suggSpan = target.closest("[data-suggestion]") as HTMLElement | null;
    if (suggSpan) {
      const id = suggSpan.dataset.suggestion!;
      const rect = suggSpan.getBoundingClientRect();
      setActiveSuggestionId(id);
      setSuggestionPopupPos({ top: rect.bottom + 4, left: rect.left });
    } else {
      setActiveSuggestionId(null);
      setSuggestionPopupPos(null);
    }
  }, []);

  // ── Slideshow Mode — portaled to body to escape sidebar stacking context ──
  if (isPresenting && presenterView) {
    // Rich presenter screen (shared component): current + next + notes + timer.
    return createPortal(
      <PresenterView
        slides={slides}
        currentIndex={activeSlideIdx}
        onNavigate={setActiveSlideIdx}
        onEnd={() => { setPresenterView(false); setIsPresenting(false); }}
        renderSlide={(i) => slides[i] ? <SlideContentPreview slide={slides[i]} themeTextColor={THEMES[theme]?.text} /> : null}
        aspect={slideRatio}
        title={title}
      />,
      document.body,
    );
  }

  if (isPresenting) {
    return createPortal(
      <>
        <SlideshowPresenter
          slides={slides}
          activeSlideIdx={activeSlideIdx}
          setActiveSlideIdx={setActiveSlideIdx}
          slideRatio={slideRatio}
          onExit={() => setIsPresenting(false)}
          theme={theme}
        />

        {/* Blank screen (B = black, W = white) — click or press the key again to resume */}
        {blankScreen && (
          <div onClick={() => setBlankScreen(null)} className="fixed inset-0 z-[2147483000] cursor-pointer"
            style={{ background: blankScreen === "black" ? "#000" : "#fff" }} />
        )}

        {/* Speaker-notes panel (S) */}
        {presenterNotes && (
          <div className="fixed bottom-0 left-0 right-0 z-[2147483001] max-h-[35vh] overflow-y-auto bg-black/85 text-white p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide text-white/50">Speaker notes · Slide {activeSlideIdx + 1}</span>
              <button onClick={() => setPresenterNotes(false)} className="text-white/60 hover:text-white text-sm">✕</button>
            </div>
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {slides[activeSlideIdx]?.notes?.trim() || <span className="text-white/40">No notes for this slide.</span>}
            </div>
          </div>
        )}

        {/* Laser pointer (L) */}
        {laserPointer && laserPos && (
          <div className="fixed z-[2147483002] pointer-events-none rounded-full"
            style={{ left: laserPos.x, top: laserPos.y, width: 18, height: 18, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(255,60,60,0.95) 0%, rgba(255,0,0,0.55) 45%, rgba(255,0,0,0) 70%)", boxShadow: "0 0 14px 5px rgba(255,0,0,0.5)" }} />
        )}

        {/* Shortcut hint (fades — informational) */}
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[2147483001] px-3 py-1 rounded-full bg-black/40 text-white/70 text-[11px] pointer-events-none">
          B/W blank · L laser · S notes · type number+Enter to jump · Esc to exit
        </div>

        {/* Enter the rich presenter screen (current + next + notes + timer) */}
        <button onClick={() => setPresenterView(true)}
          className="fixed top-3 right-4 z-[2147483001] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] font-medium transition-colors cursor-pointer">
          <Presentation className="w-3.5 h-3.5" /> Presenter view
        </button>
      </>,
      document.body,
    );
  }

  const editorContent = (
    <div
      className={[
        "flex flex-col h-full bg-[#f8f9fa] dark:bg-[#0b0e14] midnight:bg-[#060a1e] purple:bg-[#120722] slide-editor-root",
        isFullscreen ? "fixed inset-0 z-[9999]" : "relative",
      ].join(" ")}
      lang={(() => {
        const langCodes: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Portuguese: "pt", Italian: "it", Dutch: "nl", Russian: "ru", Chinese: "zh", Japanese: "ja", Korean: "ko", Arabic: "ar", Hindi: "hi", Yoruba: "yo", Igbo: "ig", Hausa: "ha", Swahili: "sw", Zulu: "zu" };
        return langCodes[presentationLanguage] || "en";
      })()}
      dir={["Arabic"].includes(presentationLanguage) ? "rtl" : "ltr"}
      style={permissions.disableCopyPrintDownload ? { userSelect: "none", WebkitUserSelect: "none" } : undefined}
      onCopy={permissions.disableCopyPrintDownload ? (e) => { e.preventDefault(); setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); } : undefined}
    >
      {/* Fullscreen floating pill — appears when cursor nears top */}
      {isFullscreen && (
        <SlideFullscreenPill
          onExit={() => setIsFullscreen(false)}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      )}

      {/* Print styles — landscape, hide UI, show only slides */}
      <style>{`
        @page { size: landscape; margin: 0; }
        @media print {
          /* Hide everything outside the editor */
          html, body { margin: 0 !important; padding: 0 !important; }
          body > * { visibility: hidden !important; }
          .slide-editor-root { visibility: visible !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: auto !important; background: white !important; }

          /* Hide editor UI elements */
          .slide-editor-root > *:not([data-print-slides]) { display: none !important; }

          /* Show and style the print slides container */
          [data-print-slides] { display: block !important; visibility: visible !important; }
          [data-print-slide] {
            page-break-after: always;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4% !important;
            box-sizing: border-box !important;
          }
          [data-print-slide]:last-child { page-break-after: avoid; }
          [data-print-slide] * { color-adjust: exact !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

          /* Hide sidebar, header, nav */
          nav, header, aside, [role="complementary"], [role="banner"] { display: none !important; }
        }
      `}</style>

      {/* Print-only slides (hidden on screen, visible when printing) */}
      <div data-print-slides="" className="hidden print:block">
        {slides.map((slide, i) => (
          <div key={slide.id} data-print-slide="" style={{ background: slide.background || "#fff" }}>
            <div style={{ width: "100%", maxWidth: 900, aspectRatio: `${slideRatio.w}/${slideRatio.h}` }}><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} /></div>
          </div>
        ))}
      </div>

      {/* ── Top Header — always visible ── */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-b border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 flex-shrink-0">
        <button onClick={() => window.location.href = "/presentations"}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <input
            value={title}
            onChange={e => onChange({ ...value, title: e.target.value })}
            placeholder="Untitled presentation"
            className="text-[17px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-500 px-1 py-0.5 max-w-[340px] transition-all duration-200"
          />
          <button
            onClick={() => setShowAddToFolderDialog(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0"
            title={`Located in: ${currentFolder}`}
          >
            <FolderPlus className="w-3 h-3" />
            <span>{currentFolder}</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        </div>
        <div className="flex-1" />
        {/* Collapse/expand toggle for menus+toolbar */}
        <button
          onClick={() => setHeaderCollapsed(c => !c)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer"
          title={headerCollapsed ? "Show menus & toolbar" : "Hide menus & toolbar"}
        >
          {headerCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <ToolbarButton title="Comments" Icon={MessageCircle} onClick={() => setShowCommentSidebar(!showCommentSidebar)} active={showCommentSidebar} />
        {permissions.requireSignIn && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 text-[10px] font-medium" title="Sign-in required to view">
            <Lock className="w-3 h-3" /> Sign-in required
          </span>
        )}
        {permissions.disableCopyPrintDownload && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 text-[10px] font-medium" title="Copy, print, and download disabled">
            <ShieldCheck className="w-3 h-3" /> Restricted
          </span>
        )}
        <Button
          size="sm"
          icon={<Share2 className="w-3.5 h-3.5" />}
          className="!rounded-full"
          onClick={() => {
            if (permissions.preventAccessChange) {
              setPermissionBlockedMsg({ message: "Sharing permissions are locked. Only the owner can manage access." });
            } else {
              setShowShareDialog(true);
            }
          }}
        >
          Share
        </Button>
        {/* Screen recording (shared hook). Only shown where the browser supports it. */}
        {recorder.supported && (
          <button
            onClick={() => (recorder.recording ? recorder.stop() : recorder.start())}
            title={recorder.recording ? "Stop recording" : "Record screen"}
            aria-label={recorder.recording ? "Stop recording" : "Record screen"}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
              recorder.recording
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#22262e]"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${recorder.recording ? "bg-white animate-pulse" : "bg-red-500"}`} />
            {recorder.recording ? `Stop · ${Math.floor(recorder.elapsed / 60)}:${String(recorder.elapsed % 60).padStart(2, "0")}` : "Record"}
          </button>
        )}
        <Button
          size="sm"
          icon={<Play className="w-3.5 h-3.5 fill-current" />}
          className="!rounded-full !px-5"
          onClick={() => { setActiveSlideIdx(0); setIsPresenting(true); }}
        >
          Present
        </Button>
      </div>

      {/* ── Collapsible Menu + Toolbar ── */}
      {/* overflow must be VISIBLE when expanded, otherwise it clips toolbar dropdown panels
          (Insert image / shape) that hang below the toolbar — they open but stay invisible.
          Only clip while collapsed so the max-height collapse animation still works. */}
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 ${headerCollapsed ? "overflow-hidden" : "overflow-visible"}`}
        style={{ maxHeight: headerCollapsed ? 0 : 300, opacity: headerCollapsed ? 0 : 1 }}
      >
      {/* ── Menu Bar (shared component) ── */}
      <SlideMenuBar
        isStarred={isStarred}
        currentFolder={currentFolder}
        editingMode={editingMode}
        zoom={zoom}
        showFilmstrip={!filmstripCollapsed}
        showRuler={showRuler}
        showGuides={showGuides}
        snapToGrid={snapToGrid}
        snapToGuides={snapToGuides}
        isFullscreen={isFullscreen}
        onAction={(action) => {
        // Block direct-edit actions in suggesting/viewing mode (only view:* and file:* allowed)
        if (editingMode !== "editing") {
          const directEditPrefixes = ["edit:", "format:", "slide:", "insert:", "arrange:"];
          const isDirectEdit = directEditPrefixes.some(p => action.startsWith(p));
          // Allow view:*, file:*, tools:*, help:* and comment insertion
          if (isDirectEdit && action !== "insert:comment") {
            if (editingMode === "viewing") setToast("Switch to Editing mode to make changes");
            else if (editingMode === "suggesting") setToast("Formatting is not available in Suggesting mode");
            return;
          }
        }
        // Restore editor focus and selection for edit/format actions
        if (action.startsWith("edit:") || action.startsWith("format:")) {
          restoreSlideSelection();
        }
        // Generic chart insert covering all 19 types: "insert:chart:<type>".
        const insertChart = (chartType: ChartType) => {
          migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
          const ca = getContentArea();
          addObjectsToSlide([createChartObj(chartType, {
            x: ca.x, y: ca.y, width: ca.w, height: ca.h,
            accent: th.accent, zIndex: currentObjects.length + 1,
          })]);
        };
        if (action.startsWith("insert:chart:")) {
          insertChart(action.slice("insert:chart:".length) as ChartType);
          return;
        }
        // Audio / video insert (upload or by URL)
        const insertMedia = (kind: "audio" | "video", src: string) => {
          migrateSlideToObjects();
          addObjectsToSlide([createMediaObj(kind, src, { zIndex: currentObjects.length + 1 })]);
        };
        if (action === "insert:audioUpload" || action === "insert:videoUpload") {
          mediaKindRef.current = action === "insert:audioUpload" ? "audio" : "video";
          mediaInputRef.current?.click();
          return;
        }
        if (action === "insert:audioUrl" || action === "insert:videoUrl") {
          const kind = action === "insert:audioUrl" ? "audio" : "video";
          setUtilDialog({ title: kind === "audio" ? "Insert audio" : "Insert video", content: (
            <MediaUrlDialog kind={kind} onInsert={(url) => { setUtilDialog(null); insertMedia(kind, url); }} />
          ) });
          return;
        }
        switch (action) {
          case "slide:new": case "insert:newSlide": addSlide(); break;
          case "edit:duplicate": {
            if (selectedObjectId && activeSlide?.objects) {
              const obj = activeSlide.objects.find(o => o.id === selectedObjectId);
              if (obj) {
                const dup = { ...JSON.parse(JSON.stringify(obj)), id: `obj-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, x: obj.x + 3, y: obj.y + 3 };
                updateCurrentSlide({ objects: [...activeSlide.objects, dup] });
                setSelectedObjectId(dup.id);
                setToast("Object duplicated");
              }
            } else {
              duplicateSlide();
            }
            break;
          }
          case "slide:duplicate": duplicateSlide(); break;
          case "edit:delete": {
            // Delete selected object, or delete slide if no object selected
            if (selectedObjectId && activeSlide?.objects) {
              updateCurrentSlide({ objects: activeSlide.objects.filter(o => o.id !== selectedObjectId) });
              setSelectedObjectId(null);
              setToast("Object deleted");
            } else {
              deleteSlide();
            }
            break;
          }
          case "slide:delete": deleteSlide(); break;
          case "view:slideshow": setActiveSlideIdx(0); setIsPresenting(true); break;
          case "slide:transitions": setShowTransitions(true); break;
          case "slide:editTheme": setShowThemes(true); break;
          case "edit:undo": {
            const prevJson = undoStackRef.current.pop();
            if (prevJson) {
              redoStackRef.current.push(JSON.stringify(slidesRef.current));
              onChange({ ...value, slides: JSON.parse(prevJson) });
              setToast("Undo");
            } else {
              setToast("Nothing to undo");
            }
            break;
          }
          case "edit:redo": {
            const nextJson = redoStackRef.current.pop();
            if (nextJson) {
              undoStackRef.current.push(JSON.stringify(slidesRef.current));
              onChange({ ...value, slides: JSON.parse(nextJson) });
              setToast("Redo");
            } else {
              setToast("Nothing to redo");
            }
            break;
          }
          case "edit:cut": {
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); break; }
            if (selectedObjectId && activeSlide?.objects) {
              const obj = activeSlide.objects.find(o => o.id === selectedObjectId);
              if (obj) {
                const gid = (obj as { groupId?: string }).groupId;
                const sel = gid ? activeSlide.objects.filter(o => (o as { groupId?: string }).groupId === gid) : [obj];
                const ids = new Set(sel.map(o => o.id));
                setSlideClipboard(sel);
                updateCurrentSlide({ objects: activeSlide.objects.filter(o => !ids.has(o.id)) });
                setSelectedObjectId(null);
                setToast("Cut");
              }
            }
            break;
          }
          case "edit:copy": {
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); break; }
            if (selectedObjectId && activeSlide?.objects) {
              const obj = activeSlide.objects.find(o => o.id === selectedObjectId);
              if (obj) {
                const gid = (obj as { groupId?: string }).groupId;
                const sel = gid ? activeSlide.objects.filter(o => (o as { groupId?: string }).groupId === gid) : [obj];
                setSlideClipboard(sel);
                setToast("Copied");
              }
            }
            break;
          }
          case "edit:paste": case "edit:pasteNoFormat": {
            const clip = getSlideClipboard();
            if (clip && clip.length) {
              // Re-id the pasted objects and drop them into free space (or a new slide if full).
              const stamp = Date.now();
              const fresh = clip.map((o, i) => ({ ...o, id: `obj-${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}` } as SlideObject));
              addObjectsToSlide(fresh);
              setToast("Pasted");
            }
            break;
          }
          case "edit:selectAll": {
            // Select all doesn't apply to single object — toast instead
            setToast("Use Ctrl+A to select text inside a text box");
            break;
          }
          case "format:bold": document.execCommand("bold"); break;
          case "format:italic": document.execCommand("italic"); break;
          case "format:underline": document.execCommand("underline"); break;
          case "format:strikethrough": document.execCommand("strikeThrough"); break;
          case "format:superscript": document.execCommand("superscript"); break;
          case "format:subscript": document.execCommand("subscript"); break;
          case "format:alignLeft": document.execCommand("justifyLeft"); break;
          case "format:alignCenter": document.execCommand("justifyCenter"); break;
          case "format:alignRight": document.execCommand("justifyRight"); break;
          case "format:alignJustify": document.execCommand("justifyFull"); break;
          case "format:indentMore": document.execCommand("indent"); break;
          case "format:indentLess": document.execCommand("outdent"); break;
          case "format:numberedList": document.execCommand("insertOrderedList"); break;
          case "format:bulletedList": document.execCommand("insertUnorderedList"); break;
          case "format:clear": document.execCommand("removeFormat"); break;
          case "file:print":
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Printing is disabled by the document owner.", permType: "print" }); break; }
            setTimeout(() => window.print(), 300); break;
          case "file:printPreview": {
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Printing is disabled by the document owner.", permType: "print" }); break; }
            const printParams = new URLSearchParams(window.location.search);
            const printPresId = printParams.get("id");
            if (printPresId) window.open(`/presentations/print-preview?id=${printPresId}`, "_blank");
            break;
          }
          case "file:newFromTemplate": window.location.href = "/presentations"; break;
          case "file:share":
            if (permissions.preventAccessChange) {
              setPermissionBlockedMsg({ message: "Sharing permissions are locked. Only the owner can manage access." });
            } else {
              setShowShareDialog(true);
            }
            break;
          case "file:publish":
            if (permissions.preventAccessChange) {
              setPermissionBlockedMsg({ message: "Sharing permissions are locked. Only the owner can publish." });
            } else {
              setShowPublishWeb(true);
            }
            break;
          case "file:rename": {
            const titleInput = document.querySelector('input[placeholder="Untitled presentation"]') as HTMLInputElement;
            if (titleInput) { titleInput.focus(); titleInput.select(); }
            break;
          }
          case "file:new": {
            // Create a new blank presentation and open in a new tab
            const newPresId = slideStorage.create({});
            window.open(`/presentations/editor?id=${newPresId}`, "_blank");
            break;
          }
          case "file:open": window.open("/presentations", "_blank"); break;
          case "file:import": setShowImportSlides(true); break;
          case "file:copyAll": {
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copying is disabled by the document owner.", permType: "copy" }); break; }
            const newId = slideStorage.create({ title: title + " (Copy)", slides, theme });
            window.open(`/presentations/editor?id=${newId}`, "_blank");
            break;
          }
          case "file:copySelected":
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copying is disabled by the document owner.", permType: "copy" }); break; }
            setShowCopySelected(true); break;
          case "file:delete": setShowDeleteConfirm(true); break;
          case "file:move": setShowMoveDialog(true); break;
          case "file:star": {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            if (id) slideStorage.toggleStar(id);
            setIsStarred(!isStarred);
            break;
          }
          case "file:addToFolder": setShowAddToFolderDialog(true); break;
          case "file:details": setShowDetailsDialog(true); break;
          case "file:security": setShowSecurityDialog(true); break;
          case "file:language": setShowLanguageDialog(true); break;
          case "file:emailFile": setShowEmailDialog("file"); break;
          case "file:emailCollaborators": setShowEmailDialog("collaborators"); break;

          case "file:convertVideo":
          case "file:videoAll":
          case "file:videoSelected":
            setShowConvertVideo(true); break;
          case "file:versionName": setShowVersionNameDialog(true); break;
          case "file:versionHistory": setShowVersionHistory(true); break;
          case "file:pageSetup": setShowPageSetup(true); break;
          case "file:download":
          case "file:downloadPptx": case "file:downloadOdp": case "file:downloadPdf":
          case "file:downloadTxt": case "file:downloadJpeg": case "file:downloadPng":
          case "file:downloadSvg":
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Downloading is disabled by the document owner.", permType: "download" }); break; }
            setShowDownloadDialog(true);
            break;
          case "insert:comment": addComment(); break;
          case "insert:link": openLinkDialog(); break;
          case "insert:table": setShowTablePicker(true); break;

          // ── Edit menu ──
          case "edit:pasteNoFormat": {
            navigator.clipboard?.readText?.().then(text => {
              if (text) document.execCommand("insertText", false, text);
            }).catch(() => { document.execCommand("paste"); });
            break;
          }
          case "edit:findReplace": setShowFindReplace(prev => !prev); break;

          // ── View menu ──
          case "view:modeEditing": setEditingMode("editing"); setToast("Mode: Editing"); break;
          case "view:modeSuggesting": case "view:modeCommenting": setEditingMode("suggesting"); setToast("Mode: Suggesting"); break;
          case "view:modeViewing": setEditingMode("viewing"); setToast("Mode: Viewing"); break;
          case "view:motion": setShowTransitions(true); break;
          case "view:themeBuilder": setShowThemes(true); break;
          case "view:gridView": {
            setShowGridView(v => !v);
            break;
          }
          case "view:ruler": setShowRuler(v => !v); break;
          case "view:showGuides": setShowGuides(v => !v); break;
          case "view:addVGuide": {
            setShowGuides(true);
            const vCount = guides.filter(g => g.orientation === "v").length;
            const vPos = vCount === 0 ? 50 : vCount === 1 ? 25 : vCount === 2 ? 75 : 33 + (vCount * 11) % 34;
            setGuides(prev => [...prev, { id: `g-${Date.now()}`, orientation: "v", position: vPos }]);
            setToast("Vertical guide added — drag to reposition");
            break;
          }
          case "view:addHGuide": {
            setShowGuides(true);
            const hCount = guides.filter(g => g.orientation === "h").length;
            const hPos = hCount === 0 ? 50 : hCount === 1 ? 25 : hCount === 2 ? 75 : 33 + (hCount * 11) % 34;
            setGuides(prev => [...prev, { id: `g-${Date.now()}`, orientation: "h", position: hPos }]);
            setToast("Horizontal guide added — drag to reposition");
            break;
          }
          case "view:editGuides": {
            setShowGuides(true);
            setToast("Drag guides to reposition, double-click to delete");
            break;
          }
          case "view:clearGuides": {
            setGuides([]);
            setToast("All guides cleared");
            break;
          }
          case "view:snapGrid": {
            setSnapToGrid(v => { setToast(v ? "Snap to grid off" : "Snap to grid on — drag objects to snap"); return !v; });
            migrateSlideToObjects();
            break;
          }
          case "view:snapGuides": {
            setSnapToGuides(v => { setToast(v ? "Snap to guides off" : "Snap to guides on — drag objects to snap"); return !v; });
            migrateSlideToObjects();
            break;
          }
          case "view:filmstrip": setFilmstripCollapsed(c => !c); break;
          case "view:zoomFit": setZoom(100); break;
          case "view:zoom50": setZoom(50); break;
          case "view:zoom75": setZoom(75); break;
          case "view:zoom100": setZoom(100); break;
          case "view:zoom150": setZoom(150); break;
          case "view:zoom200": setZoom(200); break;
          case "view:fullscreen": {
            setIsFullscreen(v => !v);
            break;
          }

          // ── Insert menu ──
          case "insert:imageUpload": { handleImageUpload(); break; }
          case "insert:imageDrive": { setShowDrivePickerDialog(true); break; }
          case "insert:imageUrl": { setShowImageUrlDialog(true); break; }
          case "insert:imageWeb": { setShowImageSearchDialog(true); break; }
          case "insert:imageCamera": { setShowCameraCapture(true); break; }
          case "insert:textBox": {
            setTextBoxDrawMode(true);
            setDrawingMode(false);
            break;
          }
          case "insert:wordArt": {
            const th = THEMES[theme] || THEMES.default;
            migrateSlideToObjects();
            const waPos = getInsertPosition(80, 18);
            addObjectToSlide(createTextBox({ ...waPos, width: 80, height: 18, content: "Word Art", fontSize: 48, bold: true, color: th.accent, align: "center", verticalAlign: "middle", zIndex: currentObjects.length + 1 }));
            break;
          }
          case "insert:shapeBasic": { setShowShapePickerDialog("shapes"); break; }
          case "insert:shapeArrow": { setShowShapePickerDialog("arrows"); break; }
          case "insert:shapeCallout": { setShowShapePickerDialog("callouts"); break; }
          case "insert:shapeEquation": { setShowShapePickerDialog("equation"); break; }
          case "insert:line": { migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default; const p = getInsertPosition(60, 0.5); addObjectToSlide(createShapeObj("line-h", { ...p, width: 60, height: 0.5, fill: th.accent, zIndex: currentObjects.length + 1 })); break; }
          case "insert:arrow": { migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default; const p = getInsertPosition(30, 15); addObjectToSlide(createShapeObj("arrow-right", { ...p, width: 30, height: 15, fill: th.accent, zIndex: currentObjects.length + 1 })); break; }
          case "insert:elbowConnector": case "insert:curvedConnector": case "insert:curve":
          case "insert:polyline": case "insert:scribble":
            setDrawingMode(true); setToast("Draw on the slide"); break;
          case "insert:diagramGrid": {
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea();
            addObjectsToSlide([0,1,2,3].map((i) => createShapeObj("rect", {
              x: ca.x + (i % 2) * (ca.w / 2 + 1), y: ca.y + Math.floor(i / 2) * (ca.h / 2 + 1),
              width: ca.w / 2 - 2, height: ca.h / 2 - 3,
              fill: th.accent, text: `Item ${i + 1}`, textColor: "#fff", zIndex: currentObjects.length + i + 1,
            })));
            break;
          }
          case "insert:diagramHierarchy": {
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea(); const z = currentObjects.length;
            addObjectsToSlide([
              createShapeObj("rect", { x: ca.x + ca.w * 0.25, y: ca.y, width: ca.w * 0.5, height: ca.h * 0.25, fill: th.accent, text: "Main", textColor: "#fff", zIndex: z + 1 }),
              createShapeObj("arrow-down", { x: ca.x + ca.w * 0.45, y: ca.y + ca.h * 0.27, width: ca.w * 0.1, height: ca.h * 0.12, fill: th.text, zIndex: z + 2 }),
              createShapeObj("rect", { x: ca.x, y: ca.y + ca.h * 0.42, width: ca.w * 0.45, height: ca.h * 0.25, fill: th.accent, text: "Branch A", textColor: "#fff", zIndex: z + 3 }),
              createShapeObj("rect", { x: ca.x + ca.w * 0.55, y: ca.y + ca.h * 0.42, width: ca.w * 0.45, height: ca.h * 0.25, fill: th.accent, text: "Branch B", textColor: "#fff", zIndex: z + 4 }),
            ]);
            break;
          }
          case "insert:diagramTimeline": {
            // Horizontal line with markers and alternating labels above/below
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea(); const z = currentObjects.length;
            const lineY = ca.y + ca.h * 0.5;
            const objs: SlideObject[] = [
              createShapeObj("line-h", { x: ca.x, y: lineY, width: ca.w, height: 0.5, fill: th.text, zIndex: z + 1 }),
            ];
            const n = 4;
            for (let i = 0; i < n; i++) {
              const cx = ca.x + ca.w * (0.1 + i * (0.8 / (n - 1)));
              const above = i % 2 === 0;
              objs.push(createShapeObj("circle", { x: cx - 1.4, y: lineY - 1.8, width: 2.8, height: 4, fill: th.accent, zIndex: z + 2 + i * 2 }));
              objs.push(createShapeObj("rect", {
                x: cx - ca.w * 0.09, y: above ? ca.y + ca.h * 0.16 : ca.y + ca.h * 0.62,
                width: ca.w * 0.18, height: ca.h * 0.2,
                fill: th.accent, text: `Step ${i + 1}`, textColor: "#fff", zIndex: z + 3 + i * 2,
              }));
            }
            addObjectsToSlide(objs);
            break;
          }
          case "insert:diagramProcess": {
            // Left-to-right boxes connected by arrows
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea(); const z = currentObjects.length;
            const n = 3;
            const boxW = ca.w * 0.26;
            const gap = (ca.w - n * boxW) / (n - 1);
            const boxY = ca.y + ca.h * 0.35;
            const boxH = ca.h * 0.3;
            const objs: SlideObject[] = [];
            for (let i = 0; i < n; i++) {
              const bx = ca.x + i * (boxW + gap);
              objs.push(createShapeObj("rect", { x: bx, y: boxY, width: boxW, height: boxH, fill: th.accent, text: `Step ${i + 1}`, textColor: "#fff", zIndex: z + 1 + i * 2 }));
              if (i < n - 1) objs.push(createShapeObj("arrow-right", { x: bx + boxW + gap * 0.15, y: boxY + boxH * 0.28, width: gap * 0.7, height: boxH * 0.44, fill: th.text, zIndex: z + 2 + i * 2 }));
            }
            addObjectsToSlide(objs);
            break;
          }
          case "insert:diagramRelationship": {
            // Two concepts linked by a double-headed arrow
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea(); const z = currentObjects.length;
            const boxW = ca.w * 0.34, boxH = ca.h * 0.3;
            const y = ca.y + ca.h * 0.35;
            addObjectsToSlide([
              createShapeObj("rect", { x: ca.x, y, width: boxW, height: boxH, fill: th.accent, text: "Concept A", textColor: "#fff", zIndex: z + 1 }),
              createShapeObj("arrow-double-h", { x: ca.x + boxW + ca.w * 0.02, y: y + boxH * 0.25, width: ca.w - 2 * boxW - ca.w * 0.04, height: boxH * 0.5, fill: th.text, zIndex: z + 2 }),
              createShapeObj("rect", { x: ca.x + ca.w - boxW, y, width: boxW, height: boxH, fill: th.accent, text: "Concept B", textColor: "#fff", zIndex: z + 3 }),
            ]);
            break;
          }
          case "insert:diagramCycle": {
            // Four stages in a loop with clockwise arrows
            migrateSlideToObjects(); const th = THEMES[theme] || THEMES.default;
            const ca = getContentArea(); const z = currentObjects.length;
            const bw = ca.w * 0.3, bh = ca.h * 0.32;
            const x0 = ca.x, x1 = ca.x + ca.w - bw;
            const y0 = ca.y, y1 = ca.y + ca.h - bh;
            const gapX = ca.w - 2 * bw, gapY = ca.h - 2 * bh;
            addObjectsToSlide([
              createShapeObj("rect", { x: x0, y: y0, width: bw, height: bh, fill: th.accent, text: "Stage 1", textColor: "#fff", zIndex: z + 1 }),
              createShapeObj("rect", { x: x1, y: y0, width: bw, height: bh, fill: th.accent, text: "Stage 2", textColor: "#fff", zIndex: z + 2 }),
              createShapeObj("rect", { x: x1, y: y1, width: bw, height: bh, fill: th.accent, text: "Stage 3", textColor: "#fff", zIndex: z + 3 }),
              createShapeObj("rect", { x: x0, y: y1, width: bw, height: bh, fill: th.accent, text: "Stage 4", textColor: "#fff", zIndex: z + 4 }),
              createShapeObj("arrow-right", { x: x0 + bw, y: y0 + bh * 0.3, width: gapX, height: bh * 0.4, fill: th.text, zIndex: z + 5 }),
              createShapeObj("arrow-down", { x: x1 + bw * 0.3, y: y0 + bh, width: bw * 0.4, height: gapY, fill: th.text, zIndex: z + 6 }),
              createShapeObj("arrow-left", { x: x0 + bw, y: y1 + bh * 0.3, width: gapX, height: bh * 0.4, fill: th.text, zIndex: z + 7 }),
              createShapeObj("arrow-up", { x: x0 + bw * 0.3, y: y0 + bh, width: bw * 0.4, height: gapY, fill: th.text, zIndex: z + 8 }),
            ]);
            break;
          }
          case "insert:chartColumn": case "insert:chartBar": case "insert:chartLine": case "insert:chartPie": case "insert:chartDonut": {
            // Legacy fixed-type chart inserts. Generic "insert:chart:<type>" is handled
            // by the early intercept above the switch (covers all 19 types).
            const legacy: Record<string, ChartType> = {
              "insert:chartColumn": "column", "insert:chartBar": "bar", "insert:chartLine": "line",
              "insert:chartPie": "pie", "insert:chartDonut": "donut",
            };
            insertChart(legacy[action] || "column");
            break;
          }

          // ── Format menu (text) ──
          case "format:sizeUp": document.execCommand("fontSize", false, "5"); break;
          case "format:sizeDown": document.execCommand("fontSize", false, "2"); break;
          case "format:uppercase": case "format:lowercase": case "format:titleCase": {
            const sel = window.getSelection();
            const text = sel?.toString();
            if (text) {
              const transformed = action === "format:uppercase" ? text.toUpperCase()
                : action === "format:lowercase" ? text.toLowerCase()
                : text.replace(/\b\w/g, c => c.toUpperCase());
              document.execCommand("insertText", false, transformed);
            }
            break;
          }
          case "format:spacingSingle": document.execCommand("insertHTML", false, '<div style="line-height:1;">'); break;
          case "format:spacing115": document.execCommand("insertHTML", false, '<div style="line-height:1.15;">'); break;
          case "format:spacing15": document.execCommand("insertHTML", false, '<div style="line-height:1.5;">'); break;
          case "format:spacingDouble": document.execCommand("insertHTML", false, '<div style="line-height:2;">'); break;
          case "format:spacingCustom": { const val = window.prompt("Line spacing:", "1.5"); if (val) document.execCommand("insertHTML", false, `<div style="line-height:${val};">`); break; }
          case "format:checklist":
            document.execCommand("insertHTML", false, '<div style="margin:4px 0;"><span style="margin-right:8px;">☐</span>Checklist item</div>');
            break;
          case "format:borderWeight": case "format:borderDash": case "format:borderColor":
          case "format:options": {
            const obj = activeSlide?.objects?.find(o => o.id === selectedObjectId);
            if (!obj) { setToast("Select an object first to change its format options"); break; }
            setUtilDialog({
              title: "Format options",
              content: <FormatOptionsDialog obj={obj} onUpdate={(patch) => {
                const objs = (activeSlideRef.current?.objects || []).map(o => o.id === selectedObjectId ? { ...o, ...patch } as SlideObject : o);
                updateCurrentSlideRef.current({ objects: objs });
              }} />,
            });
            break;
          }

          // ── Slide menu ──
          case "slide:skip": {
            // Toggle skip flag on current slide (visual dimming)
            const el = editorRef.current;
            if (el) { el.style.opacity = el.style.opacity === "0.3" ? "1" : "0.3"; }
            break;
          }
          case "slide:moveStart": case "slide:moveUp": case "slide:moveDown": case "slide:moveEnd": {
            // Uses the SHARED, pure reorder op (lib/editor-ops/reorder) — same logic the filmstrip
            // drag-reorder and a future mobile filmstrip reuse.
            const mode = ({ "slide:moveStart": "start", "slide:moveUp": "up", "slide:moveDown": "down", "slide:moveEnd": "end" } as const)[action];
            const { items, index } = moveItem(slides, activeSlideIdx, mode);
            if (items !== slides) { updateSlides(items); setActiveSlideIdx(index); }
            break;
          }
          case "slide:background": {
            const color = window.prompt("Background color (hex):", activeSlide?.background || "#ffffff");
            if (color) updateCurrentSlide({ background: color });
            break;
          }
          case "slide:layoutTitle":
            updateCurrentSlide({ content: '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;"><h1 style="text-align:center;font-size:40px;font-weight:700;margin:0;">Title</h1><p style="text-align:center;font-size:20px;color:#6b7280;margin:0;">Subtitle</p></div>' });
            break;
          case "slide:layoutSection":
            updateCurrentSlide({ content: '<div style="display:flex;align-items:center;height:100%;padding-left:10%;"><h2 style="font-size:36px;font-weight:600;color:#1f2937;">Section Header</h2></div>' });
            break;
          case "slide:layoutTitleBody":
            updateCurrentSlide({ content: '<div style="padding:6%;"><h2 style="font-size:32px;font-weight:700;margin-bottom:20px;">Title</h2><p style="font-size:16px;color:#4b5563;line-height:1.6;">Body text goes here. Click to edit.</p></div>' });
            break;
          case "slide:layoutTwoCol":
            updateCurrentSlide({ content: '<div style="padding:6%;"><h2 style="font-size:28px;font-weight:700;margin-bottom:20px;">Title</h2><div style="display:flex;gap:24px;"><div style="flex:1;"><p style="font-size:14px;color:#4b5563;">Left column content</p></div><div style="flex:1;"><p style="font-size:14px;color:#4b5563;">Right column content</p></div></div></div>' });
            break;
          case "slide:layoutBlank":
            updateCurrentSlide({ content: '' });
            break;

          // ── Arrange menu ──
          case "arrange:bringFront": case "arrange:bringForward":
          case "arrange:sendBackward": case "arrange:sendBack":
          case "arrange:alignLeft": case "arrange:alignCenter": case "arrange:alignRight":
          case "arrange:alignTop": case "arrange:alignMiddle": case "arrange:alignBottom":
          case "arrange:distributeH": case "arrange:distributeV":
          case "arrange:centerH": case "arrange:centerV":
          case "arrange:rotateCW": case "arrange:rotateCCW":
          case "arrange:flipH": case "arrange:flipV": {
            // Arrange runs the SHARED, pure ops (lib/editor-ops/arrange) on the current selection.
            const ids = selectedObjectIdsRef.current.length
              ? selectedObjectIdsRef.current
              : (selectedObjectId ? [selectedObjectId] : []);
            if (!ids.length) { setToast("Select an object first"); break; }
            const next = applyArrange(action, currentObjects, ids);
            if (next !== currentObjects) updateCurrentSlide({ objects: next });
            break;
          }
          case "arrange:group": case "arrange:ungroup":
            setToast("Grouping is coming soon");
            break;

          // ── Tools menu ──
          case "tools:spellCheck": {
            const on = !spellCheckOn;
            setSpellCheckOn(on);
            document.querySelectorAll<HTMLElement>("[contenteditable]").forEach(el => el.setAttribute("spellcheck", String(on)));
            setToast(on ? "Spell check enabled" : "Spell check disabled");
            break;
          }
          case "tools:dictionary": setUtilDialog({ title: "Personal dictionary", content: <DictionaryDialog /> }); break;
          case "tools:explore": setUtilDialog({ title: "Explore", content: <ExploreDialog slides={slides} onGoToSlide={(i: number) => { setActiveSlideIdx(i); setUtilDialog(null); }} /> }); break;
          case "tools:linkedObjects": setUtilDialog({ title: "Linked objects", content: <LinkedObjectsDialog objects={currentObjects} /> }); break;
          case "tools:dictionaryLookup": {
            const word = window.getSelection()?.toString()?.trim();
            if (word) window.open(`https://www.google.com/search?q=define+${encodeURIComponent(word)}`, "_blank");
            else setToast("Select a word first, then use Dictionary lookup");
            break;
          }
          case "tools:voiceType": {
            const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
            const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
            if (!SR) { setToast("Voice typing isn't supported in this browser"); break; }
            if (voiceRecogRef.current) { voiceRecogRef.current.stop(); voiceRecogRef.current = null; setVoiceListening(false); setToast("Voice typing stopped"); break; }
            const rec = new SR();
            rec.continuous = true; rec.interimResults = false; rec.lang = "en-US";
            rec.onresult = (e: SpeechRecEvent) => {
              const text = Array.from({ length: e.results.length - e.resultIndex }, (_, k) => e.results[e.resultIndex + k][0].transcript).join(" ").trim();
              const el = document.activeElement as HTMLElement | null;
              if (el && (el.isContentEditable || el.tagName === "TEXTAREA" || el.tagName === "INPUT")) document.execCommand("insertText", false, text + " ");
              else setToast("Click into a text box or the notes, then speak");
            };
            rec.onend = () => { setVoiceListening(false); voiceRecogRef.current = null; };
            rec.start(); voiceRecogRef.current = rec; setVoiceListening(true);
            setToast("Listening… choose Voice typing again to stop");
            break;
          }
          case "tools:accessibility": setUtilDialog({ title: "Accessibility", content: <AccessibilityDialog /> }); break;

          // ── Help menu ──
          case "help:search": setUtilDialog({ title: "Search the menus", content: (
            <MenuSearchDialog onClose={() => setUtilDialog(null)} commands={[
              { label: "New slide", run: () => addSlide() },
              { label: "Present slideshow", run: () => { setActiveSlideIdx(0); setIsPresenting(true); } },
              { label: "Themes", run: () => setShowThemes(true) },
              { label: "Transitions", run: () => setShowTransitions(true) },
              { label: "Grid view", run: () => setShowGridView(v => !v) },
              { label: "Find & replace", run: () => setShowFindReplace(true) },
              { label: "Insert text box", run: () => addObjectToSlide(createTextBox({ x: 15, y: 30, width: 70, height: 15, color: (THEMES[theme] || THEMES.default).text, zIndex: currentObjects.length + 1 })) },
              { label: "Insert table", run: () => setShowTablePicker(true) },
              { label: "Keyboard shortcuts", run: () => setUtilDialog({ title: "Keyboard shortcuts", content: <ShortcutsDialog /> }) },
              { label: "Accessibility", run: () => setUtilDialog({ title: "Accessibility", content: <AccessibilityDialog /> }) },
              { label: "Personal dictionary", run: () => setUtilDialog({ title: "Personal dictionary", content: <DictionaryDialog /> }) },
              { label: "What's new", run: () => setUtilDialog({ title: "What's new", content: <UpdatesDialog /> }) },
            ]} />
          ) }); break;
          case "help:shortcuts": setUtilDialog({ title: "Keyboard shortcuts", content: <ShortcutsDialog /> }); break;
          case "help:training": setUtilDialog({ title: "Training & help", content: <TrainingDialog /> }); break;
          case "help:updates": setUtilDialog({ title: "What's new", content: <UpdatesDialog /> }); break;

          default: break;
        }
      }} />

      {/* ── Slide Toolbar (using shared ToolbarButton & ToolbarDivider) ── */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-b border-gray-200/60 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 flex-shrink-0">
        <ToolbarButton title="New slide (Ctrl+M)" Icon={Plus} onClick={addSlide} disabled={!canDirectEdit} />
        <ToolbarButton title="Duplicate slide" Icon={Copy} onClick={duplicateSlide} disabled={!canDirectEdit} />
        <ToolbarButton title="Delete slide" Icon={Trash2} onClick={deleteSlide} disabled={!canDirectEdit || slides.length <= 1} />
        <ToolbarDivider />
        <ToolbarButton title="Undo (Ctrl+Z)" Icon={Undo2} onClick={() => {
          const el = document.activeElement as HTMLElement | null;
          if (el && el.isContentEditable) { document.execCommand("undo"); return; }
          const p = undoStackRef.current.pop();
          if (p) { redoStackRef.current.push(JSON.stringify(slidesRef.current)); onChangeRef.current({ ...valueRef.current, slides: JSON.parse(p) }); }
          else setToast("Nothing to undo");
        }} disabled={!canDirectEdit} />
        <ToolbarButton title="Redo (Ctrl+Y)" Icon={Redo2} onClick={() => {
          const el = document.activeElement as HTMLElement | null;
          if (el && el.isContentEditable) { document.execCommand("redo"); return; }
          const n = redoStackRef.current.pop();
          if (n) { undoStackRef.current.push(JSON.stringify(slidesRef.current)); onChangeRef.current({ ...valueRef.current, slides: JSON.parse(n) }); }
          else setToast("Nothing to redo");
        }} disabled={!canDirectEdit} />
        <ToolbarDivider />
        <ToolbarButton title="Themes" Icon={Palette} onClick={() => { setShowThemes(!showThemes); setShowTransitions(false); }} active={showThemes} />
        <ToolbarButton title="Transitions" Icon={LayoutGrid} onClick={() => { setShowTransitions(!showTransitions); setShowThemes(false); }} active={showTransitions} />
        <ToolbarDivider />
        {/* Text formatting */}
        <ToolbarButton title="Bold (Ctrl+B)" Icon={Bold} onClick={() => document.execCommand("bold")} disabled={!canDirectEdit} />
        <ToolbarButton title="Italic (Ctrl+I)" Icon={Italic} onClick={() => document.execCommand("italic")} disabled={!canDirectEdit} />
        <ToolbarButton title="Underline (Ctrl+U)" Icon={Underline} onClick={() => document.execCommand("underline")} disabled={!canDirectEdit} />
        <ToolbarButton title="Strikethrough" Icon={Strikethrough} onClick={() => document.execCommand("strikeThrough")} disabled={!canDirectEdit} />
        <ToolbarDivider />
        {/* Alignment */}
        <ToolbarButton title="Align left" Icon={AlignLeft} onClick={() => document.execCommand("justifyLeft")} disabled={!canDirectEdit} />
        <ToolbarButton title="Align center" Icon={AlignCenter} onClick={() => document.execCommand("justifyCenter")} disabled={!canDirectEdit} />
        <ToolbarButton title="Align right" Icon={AlignRight} onClick={() => document.execCommand("justifyRight")} disabled={!canDirectEdit} />
        <ToolbarDivider />
        {/* Insert */}
        <ToolbarButton title="Insert table" Icon={Table2} onClick={() => setShowTablePicker(!showTablePicker)} />
        <ToolbarDropdown title="Insert image" Icon={ImageIcon} isOpen={showImageDropdown} onToggle={() => setShowImageDropdown(v => !v)} disabled={!canDirectEdit}>
          <div className="p-1.5 min-w-[180px]">
            {/* A <label> tied to the persistent file input opens the native picker as the click's
                DEFAULT action — no JS .click() (which real Chrome drops when the dropdown unmounts
                in the same event). Closing the dropdown is deferred so it can't cancel the picker. */}
            <label htmlFor="educo-image-upload-input"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { setTimeout(() => setShowImageDropdown(false), 0); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer text-left">
              <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-[13px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Upload from computer</span>
            </label>
            <button onClick={() => { setShowImageDropdown(false); setShowImageUrlDialog(true); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer text-left">
              <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-[13px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">By URL</span>
            </button>
          </div>
        </ToolbarDropdown>
        <ToolbarButton title="Insert text box" Icon={Type} onClick={() => {
          const th = THEMES[theme] || THEMES.default;
          addObjectToSlide(createTextBox({ x: 15, y: 30, width: 70, height: 15, color: th.text, zIndex: currentObjects.length + 1 }));
        }} disabled={!canDirectEdit} />
        {/* Open the SAME full shape picker as the Insert menu (all shapes, categorised, tidy grid) */}
        <ToolbarButton title="Insert shape" Icon={Shapes} onClick={() => setShowShapePickerDialog("shapes")} disabled={!canDirectEdit} />
        <ToolbarButton title={drawingMode ? "Exit drawing" : "Draw"} Icon={drawingMode ? X : PenLine} onClick={() => { if (!drawingMode) migrateSlideToObjects(); setDrawingMode(v => !v); }} active={drawingMode} disabled={!canDirectEdit} />
        <div className="flex-1" />
        {/* Zoom controls */}
        <ToolbarButton title="Zoom out" Icon={ZoomOut} onClick={() => setZoom(z => Math.max(50, z - 25))} />
        <span className="text-[11px] text-gray-500 min-w-[36px] text-center">{zoom}%</span>
        <ToolbarButton title="Zoom in" Icon={ZoomIn} onClick={() => setZoom(z => Math.min(200, z + 25))} />
        <ToolbarDivider />
        {/* Editing mode (shared component) */}
        <EditingModeButton editingMode={editingMode} onModeChange={setEditingMode} />
      </div>
      </div>{/* end collapsible menu+toolbar wrapper */}

      {/* Drawing controls — shown while Draw mode is active (pick colour + brush size) */}
      {drawingMode && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[112px] z-[160] flex items-center gap-3 px-3 py-1.5 rounded-full bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-lg border border-gray-200 dark:border-gray-700">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">✎ Draw</span>
          <div className="flex items-center gap-1">
            {["#1a1a2e", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"].map(c => (
              <button key={c} onClick={() => setDrawingColor(c)} aria-label={`Pen colour ${c}`}
                className={`w-5 h-5 rounded-full border-2 ${drawingColor === c ? "border-gray-800 dark:border-white" : "border-transparent"}`} style={{ background: c }} />
            ))}
            <input type="color" value={drawingColor} onChange={e => setDrawingColor(e.target.value)} className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent" aria-label="Custom pen colour" title="Custom colour" />
          </div>
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-1">
            {[2, 4, 8].map(w => (
              <button key={w} onClick={() => setDrawingWidth(w)} aria-label={`Pen width ${w}`}
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${drawingWidth === w ? "bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-400" : "hover:bg-gray-100 dark:hover:bg-[#22262e]"}`}>
                <span className="rounded-full bg-gray-700 dark:bg-gray-200" style={{ width: w + 2, height: w + 2 }} />
              </button>
            ))}
          </div>
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <button onClick={() => setDrawingMode(false)} className="px-3 py-1 rounded-full bg-blue-600 text-white text-[12px] font-medium">Done</button>
        </div>
      )}

      {/* Find and Replace panel */}
      {showFindReplace && (
        <div className="absolute right-3 top-[120px] z-[150] w-[280px] rounded-2xl border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/95 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/95 backdrop-blur-md shadow-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Find and replace</span>
            <button onClick={() => setShowFindReplace(false)} className="p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 text-gray-400 transition-colors cursor-pointer" aria-label="Close">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            <input value={findQuery} onChange={(e) => setFindQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); slideFindNext(); } }}
              placeholder="Find…" autoFocus
              className="w-full px-3 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 outline-none focus:ring-1 focus:ring-blue-400" />
            <button onClick={slideFindNext}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              Find next
            </button>
          </div>
          <div className="my-2.5 border-t border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20" />
          <div className="space-y-1.5">
            <input value={replaceQuery} onChange={(e) => setReplaceQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); slideReplace(); } }}
              placeholder="Replace with…"
              className="w-full px-3 py-1.5 rounded-lg text-[12px] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 outline-none focus:ring-1 focus:ring-blue-400" />
            <div className="flex items-center gap-1.5">
              <button onClick={slideReplace}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                Replace
              </button>
              <button onClick={slideReplaceAll}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                Replace all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mode Banners ── */}
      {editingMode === "viewing" && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 text-[11px] font-medium select-none flex-shrink-0">
          <Eye className="w-3.5 h-3.5" />
          <span>You are viewing this presentation. To make edits, switch to Editing mode.</span>
          <button onClick={() => setEditingMode("editing")} className="ml-2 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-700/40 transition-colors cursor-pointer font-semibold">
            Switch to Editing
          </button>
        </div>
      )}
      {editingMode === "suggesting" && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 text-[11px] font-medium select-none flex-shrink-0">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Suggesting mode — your edits will appear as suggestions that can be accepted or rejected.</span>
        </div>
      )}

      {/* ── Grid View (replaces main area when active) ── */}
      {showGridView && (
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#0b0e14] midnight:bg-[#060a1e] purple:bg-[#120722] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">All Slides ({slides.length})</h2>
            <button onClick={() => setShowGridView(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" /> Close grid
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => { setActiveSlideIdx(idx); setShowGridView(false); }}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(idx)); e.dataTransfer.effectAllowed = "move"; (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
                onDragEnd={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; (e.currentTarget as HTMLElement).style.outline = "2px solid #3b82f6"; }}
                onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.outline = ""; }}
                onDrop={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).style.outline = "";
                  const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
                  if (isNaN(fromIdx) || fromIdx === idx) return;
                  // Shared reorder op — returns the moved slide's TRUE final index (dragging
                  // downward shifts it, so the old setActiveSlideIdx(idx) was off by one).
                  const { items, index } = reorderItem(slides, fromIdx, idx);
                  updateSlides(items);
                  setActiveSlideIdx(index);
                }}
                className={`rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                  idx === activeSlideIdx
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-950 shadow-lg"
                    : "ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 hover:ring-gray-400 hover:shadow-lg"
                }`}
              >
                <div className="w-full overflow-hidden relative" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}`, background: slide.background || "#fff" }}>
                  <div className="w-[800px] origin-top-left pointer-events-none" style={{ transform: "scale(0.28)", transformOrigin: "top left" }}>
                    <div className="w-full" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}` }}><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} /></div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="px-2.5 py-2 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${idx === activeSlideIdx ? "text-blue-600" : "text-gray-500"}`}>Slide {idx + 1}</span>
                  <span className="text-[10px] text-gray-400 capitalize">{slide.transition || "fade"}</span>
                </div>
              </button>
            ))}
            {/* Add slide in grid */}
            <button
              onClick={() => { addSlide(); setShowGridView(false); }}
              className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10 transition-all duration-200 cursor-pointer group"
              style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}` }}
            >
              <Plus className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors" />
              <span className="text-[11px] text-gray-400 group-hover:text-blue-500 mt-1.5 font-medium">Add slide</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main Area ── */}
      {!showGridView && <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Filmstrip — collapsible */}
        {filmstripCollapsed ? (
          /* Collapsed: thin strip with expand button */
          <div className="flex-shrink-0 w-[24px] bg-[#f1f3f4] dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-r border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 flex items-start justify-center pt-3">
            <button
              onClick={() => setFilmstripCollapsed(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer"
              title="Show filmstrip"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded: full filmstrip with slides */
          <div
            className="flex-shrink-0 w-[200px] lg:w-[220px] bg-[#f1f3f4] dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-r border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 flex flex-col outline-none"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1));
              }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                setActiveSlideIdx(i => Math.max(i - 1, 0));
              }
              if (e.key === "Delete" || e.key === "Backspace") {
                if (slides.length > 1) deleteSlide();
              }
            }}
          >
            {/* Scrollable slide list — drag-and-drop reorder */}
            <div ref={filmstripRef} className="flex-1 overflow-y-auto pt-3 pb-4 px-3 space-y-1.5">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  data-slide-idx={idx}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", String(idx));
                    e.dataTransfer.effectAllowed = "move";
                    (e.currentTarget as HTMLElement).style.opacity = "0.4";
                  }}
                  onDragEnd={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    const rect = e.currentTarget.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    const el = e.currentTarget as HTMLElement;
                    if (e.clientY < midY) {
                      el.style.borderTop = "2px solid #3b82f6";
                      el.style.borderBottom = "";
                    } else {
                      el.style.borderBottom = "2px solid #3b82f6";
                      el.style.borderTop = "";
                    }
                  }}
                  onDragLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderTop = "";
                    el.style.borderBottom = "";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderTop = "";
                    el.style.borderBottom = "";
                    const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
                    if (isNaN(fromIdx) || fromIdx === idx) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    let toIdx = e.clientY < midY ? idx : idx + 1;
                    if (fromIdx < toIdx) toIdx--;
                    if (fromIdx === toIdx) return;
                    const newSlides = [...slides];
                    const [moved] = newSlides.splice(fromIdx, 1);
                    newSlides.splice(toIdx, 0, moved);
                    updateSlides(newSlides);
                    setActiveSlideIdx(toIdx);
                  }}
                  className="flex items-start gap-2"
                >
                  <span className={`text-[11px] font-medium mt-3 w-5 text-right flex-shrink-0 ${
                    idx === activeSlideIdx ? "text-blue-600" : "text-gray-400"
                  }`}>{idx + 1}</span>
                  <button
                    onClick={() => { setActiveSlideIdx(idx); (filmstripRef.current?.closest('[tabindex]') as HTMLElement)?.focus(); }}
                    className={`flex-1 rounded-lg overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing ${
                      idx === activeSlideIdx
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#f1f3f4] dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] shadow-lg shadow-blue-500/10"
                        : "ring-1 ring-gray-300/60 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 hover:ring-gray-400 dark:hover:ring-gray-600 hover:shadow-md"
                    }`}
                  >
                    <div className="w-full overflow-hidden" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}`, background: slide.background || "#fff" }}>
                      <div className="w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(0.24)" }}>
                        <div className="w-full" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}` }}><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} /></div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              {/* Add slide */}
              <div className="flex items-start gap-2">
                <span className="w-5" />
                <button onClick={addSlide}
                  className="flex-1 aspect-video rounded-lg border-2 border-dashed border-gray-300/80 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10 transition-all duration-200 cursor-pointer group">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              </div>
            </div>
            {/* Collapse button — pinned at bottom */}
            <div className="flex-shrink-0 flex justify-center py-1.5 border-t border-gray-200/60 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
              <button
                onClick={() => setFilmstripCollapsed(true)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer"
                title="Hide filmstrip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Center column: canvas + notes + status */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <SlideCanvasArea
            zoom={zoom}
            activeSlide={activeSlide}
            canEdit={canEdit}
            editorRef={editorRef}
            contentRef={contentRef}
            slideRatio={slideRatio}
            showRuler={showRuler}
            showGuides={showGuides}
            guides={guides}
            snapToGrid={snapToGrid}
            snapToGuides={snapToGuides}
            isSuggesting={isSuggesting}
            themeTextColor={THEMES[theme]?.text}
            themeAccent={THEMES[theme]?.accent}
            onInput={(html) => updateCurrentSlide({ content: html })}
            onClick={handleEditorClick}
            onGuideMove={(id, pos) => setGuides(prev => prev.map(g => g.id === id ? { ...g, position: pos } : g))}
            onGuideDelete={(id) => setGuides(prev => prev.filter(g => g.id !== id))}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onObjectsChange={updateCurrentObjects}
            drawingMode={drawingMode}
            drawingColor={drawingColor}
            drawingWidth={drawingWidth}
            onDrawingComplete={handleDrawingComplete}
            onAddComment={(objId) => { setSelectedObjectId(objId); setShowCommentSidebar(true); }}
            onActivateLink={activateLink}
            onSelectionChange={setSelectedObjectIds}
          />

          {/* Textbox draw mode overlay — click and drag to create a textbox */}
          {textBoxDrawMode && (
            <div
              className="absolute inset-0 z-[100] cursor-crosshair"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const slideEl = document.querySelector("[data-slide-canvas]") as HTMLElement;
                const slideRect = slideEl?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;

                // Create preview rect
                const preview = document.createElement("div");
                preview.style.cssText = "position:fixed;border:2px dashed #3b82f6;background:rgba(59,130,246,0.08);pointer-events:none;z-index:10000;border-radius:4px;";
                document.body.appendChild(preview);

                const onMove = (ev: MouseEvent) => {
                  const x = Math.min(startX, ev.clientX);
                  const y = Math.min(startY, ev.clientY);
                  const w = Math.abs(ev.clientX - startX);
                  const h = Math.abs(ev.clientY - startY);
                  preview.style.left = x + "px";
                  preview.style.top = y + "px";
                  preview.style.width = w + "px";
                  preview.style.height = h + "px";
                };

                const onUp = (ev: MouseEvent) => {
                  document.removeEventListener("mousemove", onMove);
                  document.removeEventListener("mouseup", onUp);
                  preview.remove();
                  setTextBoxDrawMode(false);

                  // Calculate position as percentage of slide
                  const x1 = Math.min(startX, ev.clientX);
                  const y1 = Math.min(startY, ev.clientY);
                  const w = Math.abs(ev.clientX - startX);
                  const h = Math.abs(ev.clientY - startY);

                  // Minimum size — if just clicked (no drag), create default size
                  const minPx = 20;
                  const finalW = w < minPx ? slideRect.width * 0.4 : w;
                  const finalH = h < minPx ? slideRect.height * 0.08 : h;
                  const finalX = w < minPx ? x1 - slideRect.left - finalW / 2 : x1 - slideRect.left;
                  const finalY = h < minPx ? y1 - slideRect.top - finalH / 2 : y1 - slideRect.top;

                  const pctX = Math.max(0, Math.min(95, (finalX / slideRect.width) * 100));
                  const pctY = Math.max(0, Math.min(95, (finalY / slideRect.height) * 100));
                  const pctW = Math.max(5, Math.min(100 - pctX, (finalW / slideRect.width) * 100));
                  const pctH = Math.max(3, Math.min(100 - pctY, (finalH / slideRect.height) * 100));

                  const th = THEMES[theme] || THEMES.default;
                  migrateSlideToObjects();
                  const tbObj = createTextBox({
                    x: pctX, y: pctY, width: pctW, height: pctH,
                    color: th.text, fontSize: 18,
                    zIndex: (activeSlide?.objects?.length || 0) + 1,
                  });
                  const currentSlides = [...slidesRef.current];
                  const idx = activeSlideIdx;
                  const slide = currentSlides[idx];
                  const existingObjects = slide?.objects || [];
                  currentSlides[idx] = { ...slide, objects: [...existingObjects, tbObj] };
                  undoStackRef.current.push(JSON.stringify(slidesRef.current));
                  if (undoStackRef.current.length > 50) undoStackRef.current.shift();
                  redoStackRef.current = [];
                  onChangeRef.current({ ...valueRef.current, slides: currentSlides });
                  setSelectedObjectId(tbObj.id);
                  // Textbox is selected — user can double-click to edit
                };

                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[13px] text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-[#0f1115]/80 px-3 py-1.5 rounded-lg shadow-sm">
                  Click and drag to draw a text box, or click to place one
                </span>
              </div>
            </div>
          )}

          {/* Suggestion accept/reject popup */}
          {activeSuggestionId && suggestionPopupPos && (
            <div
              className="fixed z-[300] flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
              style={{ top: suggestionPopupPos.top, left: suggestionPopupPos.left }}
            >
              <button
                onClick={() => acceptSuggestion(activeSuggestionId)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 hover:bg-green-100 dark:hover:bg-green-800/40 transition-colors cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => rejectSuggestion(activeSuggestionId)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          )}

          {/* Speaker Notes + Status inside canvas column */}
          {notesHeight > 0 && (
            <>
              {/* Draggable resize handle */}
              <div
                className="flex-shrink-0 h-[5px] bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] cursor-row-resize hover:bg-blue-100 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 active:bg-blue-200 transition-colors group relative select-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  isDraggingNotes.current = true;
                  const startY = e.clientY;
                  const startH = notesHeight;
                  document.body.style.cursor = "row-resize";
                  const onMove = (ev: MouseEvent) => {
                    if (!isDraggingNotes.current) return;
                    const delta = startY - ev.clientY;
                    setNotesHeight(Math.max(0, Math.min(400, startH + delta)));
                  };
                  const onUp = () => {
                    isDraggingNotes.current = false;
                    document.body.style.cursor = "";
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                  };
                  document.addEventListener("mousemove", onMove);
                  document.addEventListener("mouseup", onUp);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 group-hover:bg-blue-400 transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 group-hover:bg-blue-400 transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 group-hover:bg-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
              {/* Notes textarea */}
              <div className="flex-shrink-0 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] overflow-hidden transition-[height] duration-150" style={{ height: notesHeight }}>
                <div className="px-5 py-1.5 h-full">
                  <textarea
                    value={activeSlide?.notes || ""}
                    onChange={e => updateCurrentSlide({ notes: e.target.value })}
                    placeholder="Click to add speaker notes"
                    className="w-full h-full text-[13px] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 bg-transparent outline-none resize-none placeholder:text-gray-400/50 dark:placeholder:text-gray-500/40 leading-relaxed"
                  />
                </div>
              </div>
            </>
          )}

          {/* Status bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-0.5 border-t border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-[#f8f9fa] dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 h-[28px]">
            <div className="flex items-center gap-1.5">
              <button className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer" title="Grid view">
                <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
                title={notesHeight > 0 ? "Hide speaker notes" : "Show speaker notes"}
                onClick={() => setNotesHeight(h => h > 0 ? 0 : 90)}
              >
                <ChevronLeft className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${notesHeight > 0 ? "rotate-90" : "-rotate-90"}`} />
              </button>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Slide {activeSlideIdx + 1} of {slides.length} · {presentationLanguage}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                <ZoomOut className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <span className="text-[10px] text-gray-400 font-medium min-w-[32px] text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — Themes / Transitions / Comments */}
        {(showThemes || showTransitions || showCommentSidebar) && (
          <div className="w-[300px] flex-shrink-0 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-l border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 overflow-y-auto p-4">
            {showThemes && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">Themes</h3>
                  <button onClick={() => setShowThemes(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                {/* Theme categories */}
                {(["light", "dark", "gradient"] as const).map(cat => {
                  const catThemes = Object.entries(THEMES).filter(([, t]) => t.category === cat);
                  return (
                    <div key={cat} className="mb-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mb-2">
                        {cat === "light" ? "Light" : cat === "dark" ? "Dark" : "Gradient"}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {catThemes.map(([key, t]) => (
                          <button
                            key={key}
                            onClick={() => {
                              const updatedSlides = buildThemedSlides(t, value.title, slides);
                              onChange({ ...value, theme: key, slides: updatedSlides });
                              setToast(`Theme: ${t.label}`);
                            }}
                            className={`rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                              theme === key
                                ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] shadow-lg scale-[1.02]"
                                : "ring-1 ring-gray-200/80 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 hover:ring-gray-300 hover:shadow-md hover:scale-[1.01]"
                            }`}
                          >
                            <div className="aspect-video relative overflow-hidden" style={{ background: t.bg }}>
                              {/* Realistic title slide preview */}
                              <div className="absolute inset-0 p-2 flex flex-col items-center justify-center">
                                <div className="h-[3px] w-[30%] rounded-full mb-1" style={{ backgroundColor: t.accent }} />
                                <div className="h-[4px] w-[60%] rounded-full mb-0.5" style={{ backgroundColor: t.text, opacity: 0.8 }} />
                                <div className="h-[2px] w-[40%] rounded-full" style={{ backgroundColor: t.text, opacity: 0.3 }} />
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />
                            </div>
                            <p className={`text-[10px] text-center py-1.5 font-medium ${
                              theme === key ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                            }`}>{t.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {showTransitions && (
              <div className={showThemes ? "mt-5 pt-5 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">Transitions</h3>
                  <button onClick={() => setShowTransitions(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-1">
                  {(["none", "fade", "dissolve", "flip", "cube"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => updateCurrentSlide({ transition: t })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                        activeSlide?.transition === t
                          ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium ring-1 ring-blue-200 dark:ring-blue-800"
                          : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        activeSlide?.transition === t ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-400"
                      }`}>
                        {t === "none" ? "—" : t.charAt(0).toUpperCase()}
                      </span>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showCommentSidebar && (
              <div className={showThemes || showTransitions ? "mt-4 pt-4 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Comments</h3>
                  <button onClick={() => setShowCommentSidebar(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                {comments.length === 0 ? (
                  <p className="text-[12px] text-gray-400 text-center py-8">No comments yet. Select text and use Insert &gt; Comment.</p>
                ) : (
                  <div className="space-y-2">
                    {comments.map(comment => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        isActive={false}
                        isOwner={comment.author.id === currentAuthor.id}
                        onSelect={() => {}}
                        onReply={(text) => {
                          setComments(prev => prev.map(c =>
                            c.id === comment.id ? { ...c, replies: [...c.replies, { id: `r-${Date.now()}`, author: currentAuthor, text, mentions: [], createdAt: new Date().toISOString() }] } : c
                          ));
                        }}
                        onResolve={() => setComments(prev => prev.map(c => c.id === comment.id ? { ...c, status: "resolved" } : c))}
                        onReject={() => setComments(prev => prev.map(c => c.id === comment.id ? { ...c, status: "rejected" } : c))}
                        onReopen={() => setComments(prev => prev.map(c => c.id === comment.id ? { ...c, status: "open" } : c))}
                        onDelete={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                        currentAuthor={currentAuthor}
                        mentionableUsers={[]}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>}

      {/* Notes and status bar are now inside the center column above */}

      {/* ── Share Dialog (shared component) ── */}
      {showShareDialog && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          title={title}
          onShare={() => {}}
        />
      )}

      {/* Convert to Video Dialog */}
      {showConvertVideo && (
        <ConvertToVideoDialog
          isOpen={true}
          onClose={() => setShowConvertVideo(false)}
          title={title}
          slides={slides.map(s => ({ id: s.id, content: s.content, background: s.background }))}
          activeSlideIndex={activeSlideIdx}
          totalSlides={slides.length}
        />
      )}

      {/* Download Dialog */}
      {showDownloadDialog && (
        <DownloadDialog
          isOpen={true}
          onClose={() => setShowDownloadDialog(false)}
          title={title}
          content={slides.map(s => s.content)}
          slides={slides}
          activeIndex={activeSlideIdx}
          backgrounds={slides.map(s => s.background)}
        />
      )}

      {/* Email Dialog — "Email this file" (full school directory) */}
      {showEmailDialog === "file" && (
        <EmailDialog
          isOpen={true}
          onClose={() => setShowEmailDialog(null)}
          title={title}
          mode="file"
          attachments={[
            { name: `${title}.pptx`, type: "pptx", size: "2.4 MB" },
            { name: `${title}.pdf`, type: "pdf", size: "1.8 MB" },
          ]}
          onSend={(data) => { console.log("Email sent:", data); setShowEmailDialog(null); }}
        />
      )}

      {/* Email Dialog — "Email collaborators" (only people with access) */}
      {showEmailDialog === "collaborators" && (
        <EmailDialog
          isOpen={true}
          onClose={() => setShowEmailDialog(null)}
          title={title}
          mode="collaborators"
          recipients={[
            { email: "you@educo.edu", name: "You (Owner)", role: "Owner" },
          ]}
          groups={[
            { id: "collaborators", name: "Collaborators", icon: "individual", members: [
              { email: "you@educo.edu", name: "You (Owner)", role: "Owner" },
            ]},
          ]}
          onSend={(data) => { console.log("Email sent to collaborators:", data); setShowEmailDialog(null); }}
        />
      )}

      {/* Publish Dialog (same as DocEditor) */}
      {showPublishWeb && (
        <PublishDialog
          isOpen={showPublishWeb}
          onClose={() => setShowPublishWeb(false)}
          title={title}
          onPublish={() => setShowPublishWeb(false)}
        />
      )}

      {/* Move Dialog */}
      {showMoveDialog && (
        <MoveDialog
          isOpen={true}
          onClose={() => setShowMoveDialog(false)}
          fileName={title}
          sourceId={(() => { const p = new URLSearchParams(window.location.search); return p.get("id") || ""; })()}
          sourceType="presentation"
          onMoveComplete={({ newFolder }) => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            if (id) slideStorage.moveToFolder(id, newFolder);
            setCurrentFolder(newFolder);
          }}
        />
      )}

      {/* Copy Selected Slides Modal */}
      {showCopySelected && (
        <CopySelectedModal
          slides={slides}
          title={title}
          theme={theme}
          activeSlideIdx={activeSlideIdx}
          onClose={() => setShowCopySelected(false)}
        />
      )}

      {/* Import Slides Modal */}
      {showImportSlides && (
        <ImportSlidesModal
          theme={theme}
          currentPresId={(() => { const p = new URLSearchParams(window.location.search); return p.get("id") || ""; })()}
          onImport={(importedSlides) => {
            const newSlides = [...slides, ...importedSlides.map(s => ({
              ...s,
              id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            }))];
            updateSlides(newSlides);
            setActiveSlideIdx(slides.length);
            setShowImportSlides(false);
          }}
          onClose={() => setShowImportSlides(false)}
        />
      )}

      {/* Hidden file input for audio/video upload */}
      <input ref={mediaInputRef} type="file" accept="audio/*,video/*" className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => { migrateSlideToObjects(); addObjectsToSlide([createMediaObj(mediaKindRef.current, reader.result as string, { zIndex: currentObjects.length + 1 })]); };
            reader.readAsDataURL(file);
          }
          e.target.value = "";
        }} />

      {/* Persistent hidden input for image upload. Triggered by the toolbar's <label htmlFor> (native,
          reliable) and by handleImageUpload() for the Insert → Image → Upload menu path. */}
      <input id="educo-image-upload-input" ref={imageInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) insertImageFile(file);
          e.target.value = "";
        }} />

      {/* Tools / Help utility dialog (shortcuts, updates, accessibility, dictionary, explore, menu search) */}
      {utilDialog && (
        <EditorDialog title={utilDialog.title} onClose={() => setUtilDialog(null)}>
          {utilDialog.content}
        </EditorDialog>
      )}
      {/* Voice-typing indicator */}
      {voiceListening && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-[13px] font-medium shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Listening… (choose Tools → Voice typing to stop)
        </div>
      )}

      {/* Details Dialog */}
      {showDetailsDialog && (
        <EditorDialog title="Presentation Details" onClose={() => setShowDetailsDialog(false)}>
          <div className="space-y-3 text-[13px] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Title</span><span>{title}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Slides</span><span>{slides.length}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Theme</span><span className="capitalize">{theme}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Owner</span><span>You</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Last modified</span><span>{new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Created</span><span>{new Date().toLocaleDateString()}</span></div>
          </div>
        </EditorDialog>
      )}

      {/* Page Setup Dialog */}
      {showPageSetup && (
        <EditorDialog title="Page Setup" onClose={() => setShowPageSetup(false)}>
          <div className="space-y-4">
            <p className="text-[13px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Slide dimensions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Widescreen 16:9", w: 16, h: 9 },
                { label: "Standard 4:3", w: 4, h: 3 },
                { label: "Widescreen 16:10", w: 16, h: 10 },
                { label: "Square 1:1", w: 1, h: 1 },
              ].map(opt => {
                const isSelected = slideRatio.w === opt.w && slideRatio.h === opt.h;
                return (
                  <button key={opt.label} onClick={() => { setSlideRatio(opt); setShowPageSetup(false); }}
                    className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border text-[12px] transition-colors cursor-pointer ${
                      isSelected
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                        : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 hover:border-blue-300"
                    }`}>
                    <div className="border border-current rounded" style={{ width: 48, aspectRatio: `${opt.w}/${opt.h}` }} />
                    {opt.label}
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Current: {slideRatio.label} ({slideRatio.w}:{slideRatio.h})</p>
          </div>
        </EditorDialog>
      )}

      {/* Version History Panel */}
      {showVersionHistory && (
        <EditorDialog title="Version History" onClose={() => setShowVersionHistory(false)}>
          <div className="space-y-3">
            <p className="text-[12px] text-gray-400">Saved versions of this presentation</p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-[13px] font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">Current version</p>
                <p className="text-[11px] text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">{new Date().toLocaleString()}</p>
              </div>
              <p className="text-[12px] text-gray-400 text-center py-4">No previous versions saved yet</p>
            </div>
          </div>
        </EditorDialog>
      )}

      {/* Add to Folder Dialog */}
      {showAddToFolderDialog && (() => {
        const FolderPicker = () => {
          const [selected, setSelected] = React.useState(currentFolder);
          const folders = ["My Drive", "Documents", "Presentations", "Spreadsheets", "Images"];
          const handleSave = () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            if (id) slideStorage.moveToFolder(id, selected);
            setCurrentFolder(selected);
            setShowAddToFolderDialog(false);
          };
          return (
            <EditorDialog title="Add to Folder" onClose={() => setShowAddToFolderDialog(false)}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 border border-blue-200 dark:border-blue-800">
                  <FolderPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200">{title}</p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">Currently in: <span className="font-semibold">{currentFolder}</span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">Move to:</p>
                  <div className="space-y-1.5">
                    {folders.map(folder => (
                      <button key={folder} onClick={() => setSelected(folder)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
                          selected === folder
                            ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold border border-blue-300 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500"
                            : folder === currentFolder
                              ? "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border border-transparent"
                              : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 border border-transparent"
                        }`}>
                        <FolderPlus className={`w-4 h-4 ${selected === folder ? "text-blue-500" : "text-gray-400"}`} />
                        {folder}
                        {folder === currentFolder && selected !== folder && (
                          <span className="ml-auto text-[11px] text-gray-400">(current)</span>
                        )}
                        {selected === folder && <Check className="w-4 h-4 ml-auto text-blue-500" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <EditorDialogButton variant="secondary" onClick={() => setShowAddToFolderDialog(false)}>Cancel</EditorDialogButton>
                  <EditorDialogButton variant="primary" onClick={handleSave}>Move to Folder</EditorDialogButton>
                </div>
              </div>
            </EditorDialog>
          );
        };
        return <FolderPicker />;
      })()}


      {/* Sharing Permissions Dialog */}
      {showSecurityDialog && (() => {
        const SecurityContent = () => {
          const [localPerms, setLocalPerms] = React.useState<PresentationPermissions>({ ...permissions });
          const toggle = (key: keyof PresentationPermissions) => setLocalPerms(prev => ({ ...prev, [key]: !prev[key] }));
          const handleSave = () => {
            setPermissionsState(localPerms);
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            if (id) slideStorage.setPermissions(id, localPerms);
            setShowSecurityDialog(false);
          };
          const items = [
            { key: "preventAccessChange" as const, icon: Lock, label: "Prevent editors from changing access", desc: "Only you can manage sharing permissions. Editors cannot add or remove collaborators." },
            { key: "disableCopyPrintDownload" as const, icon: Copy, label: "Disable copy, print, and download", desc: "Viewers and commenters cannot copy, print, or download this presentation." },
            { key: "requireSignIn" as const, icon: ShieldCheck, label: "Require sign-in to view", desc: "Only signed-in users can access this file. Anonymous access is blocked." },
          ];
          return (
            <div className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => {
                  const enabled = localPerms[item.key];
                  return (
                    <div key={item.key} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${enabled ? "border-blue-300 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10" : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-300 dark:hover:border-blue-700"}`}>
                      <item.icon className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${enabled ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`} />
                      <div className="flex-1">
                        <p className={`text-[13px] font-medium ${enabled ? "text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200" : "text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"}`}>{item.label}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`mt-0.5 w-9 h-5 rounded-full transition-colors cursor-pointer ${enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700"}`}
                        onClick={() => toggle(item.key)}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <EditorDialogButton variant="secondary" onClick={() => setShowSecurityDialog(false)}>Cancel</EditorDialogButton>
                <EditorDialogButton variant="primary" onClick={handleSave}>Save Permissions</EditorDialogButton>
              </div>
            </div>
          );
        };
        return (
          <EditorDialog title="Sharing Permissions" onClose={() => setShowSecurityDialog(false)}>
            <SecurityContent />
          </EditorDialog>
        );
      })()}

      {/* Language Dialog */}
      {showLanguageDialog && (
        <EditorDialog title="Slide Language" onClose={() => setShowLanguageDialog(false)}>
          <div className="space-y-4">
            <p className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Set the language for slide content. Placeholder text on slides will be translated to the selected language.</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-[240px] overflow-y-auto">
              {["English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Russian", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Yoruba", "Igbo", "Hausa", "Swahili", "Zulu"].map(lang => (
                <button key={lang} onClick={() => {
                    // Translate placeholder text on all existing slides
                    const oldT = slideTranslations[presentationLanguage] || slideTranslations.English;
                    const newT = slideTranslations[lang] || slideTranslations.English;
                    const updatedSlides = slides.map(slide => {
                      let content = slide.content;
                      // Replace from current language to new language
                      const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      // Replace current language placeholders
                      content = content.replace(new RegExp(esc(oldT.title), 'g'), newT.title);
                      content = content.replace(new RegExp(esc(oldT.subtitle), 'g'), newT.subtitle);
                      // Also replace English defaults (for first-time language change)
                      if (presentationLanguage !== "English") {
                        const enT = slideTranslations.English;
                        content = content.replace(new RegExp(esc(enT.title), 'g'), newT.title);
                        content = content.replace(new RegExp(esc(enT.subtitle), 'g'), newT.subtitle);
                      }
                      content = content.replace(/Untitled Presentation/g, newT.title);
                      return { ...slide, content };
                    });
                    onChange({ ...value, slides: updatedSlides });

                    // Also update the presentation title if it's still the default
                    if (title === "Untitled presentation" || Object.values(slideTranslations).some(t => title === t.title)) {
                      onChange({ ...value, title: newT.title, slides: updatedSlides });
                    }

                    setPresentationLanguage(lang);
                    const p = new URLSearchParams(window.location.search);
                    const id = p.get("id");
                    if (id) slideStorage.setLanguage(id, lang);
                    setShowLanguageDialog(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-[12px] text-left transition-colors cursor-pointer ${
                    presentationLanguage === lang
                      ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold border border-blue-300 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border border-transparent"
                  }`}>
                  {presentationLanguage === lang && <Check className="w-3 h-3 inline mr-1.5" />}
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </EditorDialog>
      )}

      {/* Name Version Dialog */}
      {showVersionNameDialog && (() => {
        const VersionNameContent = () => {
          const [versionName, setVersionNameLocal] = React.useState(`Version ${new Date().toLocaleDateString()}`);
          return (
            <div className="space-y-4">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Give this version a name so you can find it later in version history.</p>
              <input
                type="text"
                value={versionName}
                onChange={e => setVersionNameLocal(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-[13px] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Final draft, Before review..."
              />
              <div className="flex justify-end gap-2">
                <EditorDialogButton variant="secondary" onClick={() => setShowVersionNameDialog(false)}>Cancel</EditorDialogButton>
                <EditorDialogButton variant="primary" onClick={() => setShowVersionNameDialog(false)}>
                  <Tag className="w-3.5 h-3.5 mr-1" /> Save Version
                </EditorDialogButton>
              </div>
            </div>
          );
        };
        return (
          <EditorDialog title="Name This Version" onClose={() => setShowVersionNameDialog(false)}>
            <VersionNameContent />
          </EditorDialog>
        );
      })()}

      {/* Permission Blocked Dialog */}
      {permissionBlockedMsg && (() => {
        // Check if current user is the document owner
        const params = new URLSearchParams(window.location.search);
        const presId = params.get("id") || "";
        const pres = presId ? slideStorage.get(presId) : null;
        const isOwner = !pres || pres.owner === "You" || pres.owner === "System Administrator";
        const canRequest = !!permissionBlockedMsg.permType && !isOwner;

        const handleRequestPermission = () => {
          if (!permissionBlockedMsg.permType) return;

          const permReq = permissionRequests.request({
            presentationId: presId,
            presentationTitle: title,
            permission: permissionBlockedMsg.permType,
            requesterUsername: "current.user",
            requesterFullName: "System Administrator",
            requesterEmail: "admin@educo.school",
            ownerUsername: "doc.owner",
            ownerFullName: "Document Owner",
            message: `Requesting ${permissionBlockedMsg.permType} access`,
          });

          addNotification({
            type: "permission_request",
            title: "Permission Request",
            message: `has requested ${permissionBlockedMsg.permType} access to "${title}".`,
            priority: "high",
            userName: "System Administrator",
            actionUrl: `/presentations/editor?id=${presId}`,
            metadata: {
              requestId: permReq.id,
              permissionType: permissionBlockedMsg.permType,
              presentationId: presId,
              presentationTitle: title,
              requesterUsername: "current.user",
              requesterFullName: "System Administrator",
            },
          });

          setPermissionRequestSent(true);
        };

        return (
          <EditorDialog title="Action Restricted" onClose={() => { setPermissionBlockedMsg(null); setPermissionRequestSent(false); }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                <p className="text-[13px] text-amber-800 dark:text-amber-200">{permissionBlockedMsg.message}</p>
              </div>

              {!permissionRequestSent ? (
                <>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                    {isOwner
                      ? "You set this restriction in Sharing Permissions. You can edit your permissions to change this."
                      : `This restriction was set by the document owner in Sharing Permissions.${canRequest ? " You can request permission from the owner." : ""}`
                    }
                  </p>
                  <div className="flex justify-end gap-2">
                    <EditorDialogButton variant="secondary" onClick={() => { setPermissionBlockedMsg(null); setPermissionRequestSent(false); }}>
                      Close
                    </EditorDialogButton>
                    {isOwner ? (
                      <button
                        onClick={() => { setPermissionBlockedMsg(null); setPermissionRequestSent(false); setShowSecurityDialog(true); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Edit Permissions
                      </button>
                    ) : canRequest ? (
                      <button
                        onClick={handleRequestPermission}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Request Permission
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-green-800 dark:text-green-200">Permission request sent!</p>
                      <p className="text-[11px] text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 mt-0.5">
                        A notification and email have been sent to the document owner. You&apos;ll be notified when they respond.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <EditorDialogButton variant="primary" onClick={() => { setPermissionBlockedMsg(null); setPermissionRequestSent(false); }}>
                      Done
                    </EditorDialogButton>
                  </div>
                </>
              )}
            </div>
          </EditorDialog>
        );
      })()}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <EditorDialog title="Move to Bin" onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-red-800 dark:text-red-200">Are you sure you want to move this presentation to the bin?</p>
                <p className="text-[11px] text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-1">&ldquo;{title}&rdquo; · {slides.length} slides</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">You can restore it from the bin within 30 days. After that, it will be permanently deleted.</p>
            <div className="flex justify-end gap-2">
              <EditorDialogButton variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</EditorDialogButton>
              <button onClick={() => {
                const params = new URLSearchParams(window.location.search);
                const id = params.get("id");
                if (id) slideStorage.moveToBin(id);
                window.location.href = "/presentations";
              }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 transition-colors cursor-pointer">
                Move to Bin
              </button>
            </div>
          </div>
        </EditorDialog>
      )}

      {/* ── Image URL Dialog ── */}
      {showImageUrlDialog && (
        <EditorDialog title="Insert image by URL" onClose={() => { setShowImageUrlDialog(false); setImageUrlInput(""); }}>
          <div className="space-y-3">
            <input
              autoFocus
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && imageUrlInput.trim()) {
                  migrateSlideToObjects();
                  addObjectToSlide(createImageObj(imageUrlInput.trim(), { ...getInsertPosition(50, 40), width: 50, height: 40, zIndex: currentObjects.length + 1 }));
                  setShowImageUrlDialog(false);
                  setImageUrlInput("");
                }
              }}
              placeholder="https://example.com/image.png"
              className="w-full px-3 py-2 rounded-lg text-[13px] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {imageUrlInput && (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] p-2">
                <img src={imageUrlInput} alt="Preview" className="max-h-[200px] mx-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <EditorDialogButton onClick={() => { setShowImageUrlDialog(false); setImageUrlInput(""); }}>Cancel</EditorDialogButton>
              <button
                disabled={!imageUrlInput.trim()}
                onClick={() => {
                  migrateSlideToObjects();
                  addObjectToSlide(createImageObj(imageUrlInput.trim(), { ...getInsertPosition(50, 40), width: 50, height: 40, zIndex: currentObjects.length + 1 }));
                  setShowImageUrlDialog(false);
                  setImageUrlInput("");
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Insert
              </button>
            </div>
          </div>
        </EditorDialog>
      )}

      {/* ── Image Search Dialog ── */}
      {showImageSearchDialog && (
        <ImageSearchDialog
          onInsert={(src) => {
            migrateSlideToObjects();
            addObjectToSlide(createImageObj(src, { ...getInsertPosition(50, 40), width: 50, height: 40, zIndex: currentObjects.length + 1 }));
            setShowImageSearchDialog(false);
            setToast("Image inserted");
          }}
          onClose={() => setShowImageSearchDialog(false)}
        />
      )}

      {/* ── Drive Picker Dialog ── */}
      {/* ── Shape Picker Dialog ── */}
      {showShapePickerDialog && (
        <ShapePickerDialogFull
          initialCategory={showShapePickerDialog}
          onInsert={(shapeKey) => {
            migrateSlideToObjects();
            const th = THEMES[theme] || THEMES.default;
            // The shape's viewBox is square (100×100). On a 16:9 slide, equal width/height %
            // yields a WIDE box that squashes circles/stars into ellipses. Scale the height by
            // the slide aspect so a square shape reads as square on screen (undistorted).
            const W = 20, H = Math.round(W * 16 / 9); // ≈ 36
            const p = getInsertPosition(W, H);
            addObjectToSlide(createShapeObj(shapeKey, { ...p, width: W, height: H, fill: th.accent, zIndex: currentObjects.length + 1 }));
            setShowShapePickerDialog(null);
          }}
          onClose={() => setShowShapePickerDialog(null)}
        />
      )}

      {/* ── Link Dialog (shared component — also used by the doc editor / whiteboard) ── */}
      {linkDialog && (
        <LinkDialog
          initialUrl={linkDialog.url}
          initialTargetId={linkDialog.targetId}
          // Offer every OTHER slide as an in-deck destination (Google Slides "Slides in this presentation")
          targets={slides
            .map((s, i) => ({ id: s.id, label: `Slide ${i + 1}` }))
            .filter(t => !(linkDialog.mode === "object" && t.id === activeSlide?.id))}
          targetsLabel="Slides in this presentation"
          onSave={({ url, targetId }) => applyLink(targetId ? `slide://${targetId}` : (url || ""))}
          onRemove={
            linkDialog.mode === "text" || currentObjects.find(o => o.id === linkDialog.objId)?.link
              ? removeLink
              : undefined
          }
          onClose={() => { savedRangeRef.current = null; setLinkDialog(null); }}
        />
      )}

      {/* ── Table Picker Dialog ── */}
      {showTablePicker && (
        <div className="absolute inset-0 z-[210] flex items-center justify-center bg-black/25 backdrop-blur-[2px]" onClick={() => setShowTablePicker(false)}>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Insert Table</span>
              <button className="px-2 py-1 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer" onClick={() => setShowTablePicker(false)}>Close</button>
            </div>
            <TableGridPicker onPick={(r, c) => insertTable(r, c)} />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-2 text-center">Hover to select size, click to insert</p>
          </div>
        </div>
      )}

      {showDrivePickerDialog && (
        <DrivePickerDialog
          onInsert={(src) => {
            migrateSlideToObjects();
            addObjectToSlide(createImageObj(src, { ...getInsertPosition(50, 40), width: 50, height: 40, zIndex: currentObjects.length + 1 }));
            setShowDrivePickerDialog(false);
            setToast("Image inserted from Drive");
          }}
          onClose={() => setShowDrivePickerDialog(false)}
        />
      )}

      {/* ── Camera Capture Dialog ── */}
      {showCameraCapture && (
        <EditorDialog title="Take a photo" onClose={() => {
          cameraStreamRef.current?.getTracks().forEach(t => t.stop());
          cameraStreamRef.current = null;
          setShowCameraCapture(false);
        }}>
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden bg-black aspect-video">
              <video ref={cameraVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"
                onLoadedMetadata={() => {}}
              />
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => {
                // Start camera if not started
                if (!cameraStreamRef.current) {
                  navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
                    .then(stream => {
                      cameraStreamRef.current = stream;
                      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = stream;
                    })
                    .catch(() => setToast("Camera access denied"));
                }
              }} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-[13px] font-medium hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors">
                Start Camera
              </button>
              <button onClick={() => {
                const video = cameraVideoRef.current;
                if (!video) return;
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                canvas.getContext("2d")?.drawImage(video, 0, 0);
                const src = canvas.toDataURL("image/jpeg", 0.9);
                migrateSlideToObjects();
                addObjectToSlide(createImageObj(src, { ...getInsertPosition(50, 40), width: 50, height: 40, zIndex: currentObjects.length + 1 }));
                cameraStreamRef.current?.getTracks().forEach(t => t.stop());
                cameraStreamRef.current = null;
                setShowCameraCapture(false);
                setToast("Photo captured and inserted");
              }} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 cursor-pointer transition-colors">
                Capture Photo
              </button>
            </div>
          </div>
        </EditorDialog>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[220] px-3 py-2 rounded-xl bg-gray-900 text-white text-[12px] shadow-xl pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );

  // When fullscreen, portal to document.body to escape parent stacking contexts (sidebar z-40)
  if (isFullscreen && typeof document !== "undefined") {
    return createPortal(editorContent, document.body);
  }
  return editorContent;
}

// ══════════════════════════════════════════════════
// Fullscreen floating pill — appears when cursor nears top
// ══════════════════════════════════════════════════

function SlideFullscreenPill({ onExit, zoom, onZoomChange }: {
  onExit: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
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
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  const btnClass = "px-3 py-2 text-[12px] font-medium transition-colors hover:bg-white/20 cursor-pointer min-h-[44px] flex items-center";

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[10000] flex items-center rounded-full bg-gray-900/70 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white">
      {zoomExpanded ? (
        <div className="flex items-center">
          {[50, 75, 100, 150, 200].map((z) => (
            <button key={z} type="button" onClick={() => { onZoomChange(z); setZoomExpanded(false); }}
              className={`${btnClass} ${z === zoom ? "bg-white/20 font-semibold" : ""} ${z === 50 ? "rounded-l-full pl-4" : ""}`}>
              {z}%
            </button>
          ))}
          <div className="w-px h-5 bg-white/20" />
        </div>
      ) : (
        <button type="button" onClick={() => setZoomExpanded(true)} className={`${btnClass} rounded-l-full pl-4 gap-1.5`}>
          <ZoomIn className="w-3.5 h-3.5" />
          {zoom}%
        </button>
      )}
      <div className="w-px h-5 bg-white/20" />
      <button type="button" onClick={onExit} className={`${btnClass} rounded-r-full pr-4 gap-1.5`} aria-label="Exit full screen">
        <Minimize2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Exit</span>
        <kbd className="text-[10px] text-white/50 ml-1 hidden sm:inline">Esc</kbd>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════
// SlideshowPresenter — Full-featured presentation mode
// ══════════════════════════════════════════════════

function SlideshowPresenter({ slides, activeSlideIdx, setActiveSlideIdx, slideRatio, onExit, theme = "default" }: {
  slides: SlideData[];
  activeSlideIdx: number;
  setActiveSlideIdx: React.Dispatch<React.SetStateAction<number>>;
  slideRatio: { w: number; h: number };
  onExit: () => void;
  theme?: string;
}) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [prevSlideIdx, setPrevSlideIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(activeSlideIdx);
  idxRef.current = activeSlideIdx;
  const progress = slides.length > 1 ? ((activeSlideIdx) / (slides.length - 1)) * 100 : 100;
  const activeSlide = slides[activeSlideIdx] || slides[0];
  const transitionType = activeSlide?.transition || "fade";

  // Enter browser fullscreen to hide tabs/address bar, exit on unmount
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const goTo = useCallback((idx: number) => {
    const cur = idxRef.current;
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    if (clamped === cur) return;
    setDirection(clamped > cur ? "next" : "prev");
    setPrevSlideIdx(cur);
    setActiveSlideIdx(clamped);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => setPrevSlideIdx(null), 500);
  }, [slides.length, setActiveSlideIdx]);

  const goNext = useCallback(() => goTo(idxRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(idxRef.current - 1), [goTo]);

  // Auto-hide controls after 3s of inactivity
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [resetHideTimer]);

  // Exit slideshow when browser exits fullscreen
  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) onExit(); };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [onExit]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === "Escape") { onExit(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " " || e.key === "Enter" || e.key === "PageDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") { e.preventDefault(); goPrev(); }
      if (e.key === "Home") { e.preventDefault(); goTo(0); }
      if (e.key === "End") { e.preventDefault(); goTo(slides.length - 1); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onExit, goNext, goPrev, goTo, resetHideTimer, slides.length]);

  // Mouse wheel navigation
  const wheelCooldown = useRef(false);
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelCooldown.current) return;
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 600);
      resetHideTimer();
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };
    document.addEventListener("wheel", handler, { passive: false });
    return () => document.removeEventListener("wheel", handler);
  }, [goNext, goPrev, resetHideTimer]);

  // Click to advance — top 25% goes back, bottom 75% goes forward
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    resetHideTimer();
    if (e.clientY < window.innerHeight * 0.25) goPrev();
    else goNext();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black select-none cursor-none overflow-hidden"
      onClick={handleClick}
      onMouseMove={resetHideTimer}
    >
      {/* Slide layers with per-slide transitions */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Previous slide (behind, animating out) */}
        {prevSlideIdx !== null && (() => {
          const prevSlide = slides[prevSlideIdx];
          const t = transitionType;
          const isNext = direction === "next";
          const outStyle: React.CSSProperties = { transition: "all 550ms cubic-bezier(0.4, 0, 0.2, 1)" };
          if (t === "none") { outStyle.opacity = 0; outStyle.transition = "none"; }
          else if (t === "fade") { outStyle.opacity = 0; }
          else if (t === "dissolve") { outStyle.opacity = 0; outStyle.transform = `scale(${isNext ? 0.85 : 1.15})`; }
          else if (t === "flip") { outStyle.transform = `rotateX(${isNext ? -90 : 90}deg)`; outStyle.opacity = 0; outStyle.transformOrigin = isNext ? "bottom center" : "top center"; }
          else if (t === "cube") { outStyle.transform = `translateY(${isNext ? "-100" : "100"}%) rotateX(${isNext ? 90 : -90}deg)`; outStyle.transformOrigin = isNext ? "bottom center" : "top center"; outStyle.opacity = 0.5; }
          return (
            <div className="absolute inset-0 z-[1]" style={outStyle}>
              <div className="w-full h-full" style={{ background: prevSlide?.background || "#fff" }}>
                <div className="w-full h-full p-[5%] overflow-hidden" style={{ fontSize: "clamp(16px, 2.5vw, 40px)" }}>
                  <SlideContentPreview slide={prevSlide} themeTextColor={THEMES[theme]?.text} scale={2} />
                </div>
              </div>
            </div>
          );
        })()}
        {/* Current slide (front, animating in) */}
        {(() => {
          const t = transitionType;
          const isNext = direction === "next";
          const inStyle: React.CSSProperties = { transition: "all 550ms cubic-bezier(0.4, 0, 0.2, 1)" };
          if (prevSlideIdx === null) { /* idle — no transform */ }
          else if (t === "none") { inStyle.transition = "none"; }
          return (
            <div className="absolute inset-0 z-[2]" style={inStyle}>
              <div className="w-full h-full" style={{ background: activeSlide?.background || "#fff" }}>
                <div className="w-full h-full p-[5%] overflow-hidden" style={{ fontSize: "clamp(16px, 2.5vw, 40px)" }}>
                  <SlideContentPreview slide={activeSlide} themeTextColor={THEMES[theme]?.text} scale={2} />
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Progress bar — thin vertical line on right side */}
      <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-white/10">
        <div
          className="w-full bg-blue-500/80 transition-all duration-300 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Controls overlay — auto-hide */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${controlsVisible ? "opacity-100" : "opacity-0"}`}>
        {/* Top bar: slide count + exit */}
        <div className="absolute top-0 left-0 right-0 pointer-events-auto flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/40 to-transparent">
          <div className="text-white/70 text-[13px] font-medium">
            {activeSlideIdx + 1} <span className="text-white/40">/ {slides.length}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onExit(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer text-[12px] font-medium"
          >
            <X className="w-4 h-4" />
            Exit <kbd className="text-[10px] text-white/40 ml-0.5">Esc</kbd>
          </button>
        </div>

        {/* Right side: vertical slide thumbnails */}
        <div className="absolute top-0 right-[3px] bottom-0 pointer-events-auto">
          <div className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 h-full bg-gradient-to-l from-black/40 to-transparent overflow-y-auto">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={(e) => { e.stopPropagation(); setActiveSlideIdx(i); resetHideTimer(); }}
                className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  i === activeSlideIdx
                    ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,244,0.5)] scale-110"
                    : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                }`}
                style={{
                  width: 56,
                  height: 56 * slideRatio.h / slideRatio.w,
                  background: slide.background || "#fff",
                }}
              >
                <div
                  className="w-full h-full overflow-hidden text-[2px] p-0.5 pointer-events-none"
                  style={{ transform: "scale(0.14)", transformOrigin: "top left", width: 400, height: 400 * slideRatio.h / slideRatio.w }}
                ><SlideContentPreview slide={slide} themeTextColor={THEMES[theme]?.text} scale={0.3} /></div>
              </button>
            ))}
          </div>
        </div>

        {/* Vertical navigation arrows — top/bottom center */}
        {activeSlideIdx > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); resetHideTimer(); }}
            className="absolute top-4 left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            <ChevronUp className="w-7 h-7" />
          </button>
        )}
        {activeSlideIdx < slides.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); resetHideTimer(); }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            <ChevronDown className="w-7 h-7" />
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ImageSearchDialog — web image search with categories
// ══════════════════════════════════════════════════

const IMAGE_CATEGORIES = [
  { label: "All", query: "" },
  { label: "Business", query: "business" },
  { label: "Education", query: "education" },
  { label: "Technology", query: "technology" },
  { label: "Nature", query: "nature" },
  { label: "People", query: "people" },
  { label: "Architecture", query: "architecture" },
  { label: "Food", query: "food" },
  { label: "Travel", query: "travel" },
  { label: "Health", query: "health" },
  { label: "Sports", query: "sports" },
  { label: "Abstract", query: "abstract" },
];

// Curated picsum image IDs organized by category for offline/fast access
const CURATED_IMAGES: Record<string, number[]> = {
  "": [1,2,3,4,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
  business: [3,7,20,60,180,366,380,395,403,445,453,488,502,514,532,566,593,620,659,674],
  education: [4,24,42,60,180,301,343,367,403,445,488,514,532,566,593,620,659,674,733,756],
  technology: [0,2,60,160,180,325,366,367,403,445,453,488,502,514,532,566,593,620,659,674],
  nature: [10,11,13,14,15,16,17,18,19,22,23,25,27,28,29,33,34,35,36,37,38,39,40,41,43,44,46,47,48,49],
  people: [1,7,8,64,65,91,177,203,275,306,338,349,399,433,447,453,473,505,550,557],
  architecture: [9,12,20,21,26,30,31,32,49,101,109,164,175,188,260,264,274,304,356,363],
  food: [75,88,89,102,139,163,225,279,292,312,326,365,390,429,431,488,493,547,571,627],
  travel: [10,11,13,14,16,28,33,39,42,48,50,55,57,58,100,106,119,122,129,142],
  health: [1,8,64,65,91,177,203,275,306,338,349,399,433,447,453,473,505,550,557,583],
  sports: [1,8,54,64,65,91,106,177,203,275,306,338,349,399,433,447,453,473,505,550],
  abstract: [2,50,51,52,53,54,55,56,57,58,59,60,61,62,63,66,67,68,69,70],
};

function ImageSearchDialog({ onInsert, onClose }: { onInsert: (src: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);

  // Filter images: use category curated list, then filter by search query (simulated)
  const baseIds = CURATED_IMAGES[category] || CURATED_IMAGES[""];
  const pageSize = 18;
  const displayIds = baseIds.slice(0, (page + 1) * pageSize);
  const hasMore = displayIds.length < baseIds.length;

  // When user types a search query, try to match a category
  const handleSearch = () => {
    const q = query.toLowerCase().trim();
    const match = IMAGE_CATEGORIES.find(c => c.query && q.includes(c.query));
    if (match) setCategory(match.query);
    else setCategory("");
    setPage(0);
  };

  return (
    <EditorDialog title="Search for images" onClose={onClose}>
      <div className="space-y-3" style={{ minWidth: 500 }}>
        {/* Search bar */}
        <div className="flex gap-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="Search images (e.g. nature, business, technology)..."
            className="flex-1 px-3 py-2 rounded-lg text-[13px] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleSearch} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[12px] font-medium hover:bg-blue-700 cursor-pointer transition-colors">
            Search
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {IMAGE_CATEGORIES.map(cat => (
            <button
              key={cat.query}
              onClick={() => { setCategory(cat.query); setPage(0); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                category === cat.query
                  ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-1">
          {displayIds.map(id => (
            <button
              key={id}
              onClick={() => onInsert(`https://picsum.photos/id/${id}/800/600`)}
              className="aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:ring-2 hover:ring-blue-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <img
                src={`https://picsum.photos/id/${id}/300/200`}
                alt={`Image ${id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center">
            <button onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors">
              Load more images
            </button>
          </div>
        )}

        <p className="text-[10px] text-gray-400 text-center">Click an image to insert · Images from Picsum Photos</p>
      </div>
    </EditorDialog>
  );
}

// ══════════════════════════════════════════════════
// DrivePickerDialog — browse Drive files and select images
// ══════════════════════════════════════════════════

function DrivePickerDialog({ onInsert, onClose }: { onInsert: (src: string) => void; onClose: () => void }) {
  const [currentFolder, setCurrentFolder] = useState("root");
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([{ id: "root", name: "My Drive" }]);
  const [refreshKey, setRefreshKey] = useState(0);

  const items = driveStorage.getChildren(currentFolder);
  const folders = items.filter(i => i.type === "folder");
  const files = items.filter(i => i.type === "file");
  const imageFiles = files.filter(f => f.mimeType?.startsWith("image/") || f.name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i));
  const otherFiles = files.filter(f => !imageFiles.includes(f));
  // Also find ALL images across the entire Drive for quick access
  const allItems = driveStorage.list();
  const allImages = allItems.filter(i => i.type === "file" && (i.mimeType?.startsWith("image/") || i.name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i)));

  const navigateToFolder = (folder: DriveItem) => {
    setCurrentFolder(folder.id);
    setBreadcrumb(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const navigateToBreadcrumb = (idx: number) => {
    setCurrentFolder(breadcrumb[idx].id);
    setBreadcrumb(prev => prev.slice(0, idx + 1));
  };

  /** Get stored image data from localStorage */
  const getFileData = (file: DriveItem): string | null => {
    const dataKey = `educo_drive_file_${file.id}`;
    return localStorage.getItem(dataKey) || null;
  };

  /** Upload an image file to Drive (saves to localStorage + creates Drive entry) */
  const uploadImageToDrive = (file: File, targetFolder: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Create Drive file entry
      const fileId = driveStorage.create({
        parentId: targetFolder,
        name: file.name,
        type: "file",
        mimeType: file.type,
        size: file.size,
        sourceType: "upload",
      });
      // Store actual file data
      localStorage.setItem(`educo_drive_file_${fileId}`, dataUrl);
      // Refresh the view
      setRefreshKey(k => k + 1);
    };
    reader.readAsDataURL(file);
  };

  return (
    <EditorDialog title="Insert from Drive" onClose={onClose}>
      <div className="space-y-3" style={{ minWidth: 480, minHeight: 300 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[12px] flex-wrap">
          {breadcrumb.map((b, i) => (
            <span key={b.id} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => navigateToBreadcrumb(i)}
                className={`px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer transition-colors ${
                  i === breadcrumb.length - 1 ? "font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200" : "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                }`}
              >
                {b.name}
              </button>
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[350px] overflow-y-auto space-y-1 pr-1">
          {/* Folders */}
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => navigateToFolder(folder)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <FolderPlus className="w-4 h-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate">{folder.name}</p>
                <p className="text-[10px] text-gray-400">Folder</p>
              </div>
            </button>
          ))}

          {/* Image files — shown as grid */}
          {imageFiles.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-1.5">Images</p>
              <div className="grid grid-cols-3 gap-2 px-2">
                {imageFiles.map(file => {
                  const data = getFileData(file);
                  return (
                    <button
                      key={file.id}
                      onClick={() => { if (data) onInsert(data); }}
                      className={`aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group flex flex-col ${!data ? "opacity-50" : ""}`}
                    >
                      {data ? (
                        <img src={data} alt={file.name} className="w-full flex-1 object-cover" />
                      ) : (
                        <div className="w-full flex-1 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <p className="text-[9px] text-gray-500 truncate px-1 py-0.5">{file.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other files */}
          {otherFiles.map(file => (
            <div
              key={file.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center flex-shrink-0">
                <Type className="w-4 h-4 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-500 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-400">{file.mimeType || "File"}</p>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-[13px] text-gray-400">This folder is empty</p>
              <p className="text-[11px] text-gray-400 mt-1">Upload files to your Drive to see them here</p>
            </div>
          )}

          {/* No images in current folder */}
          {imageFiles.length === 0 && folders.length === 0 && otherFiles.length > 0 && (
            <div className="py-4 text-center">
              <p className="text-[12px] text-gray-400">No images in this folder</p>
            </div>
          )}
        </div>

        {/* All images in Drive (quick access) */}
        {currentFolder === "root" && allImages.length > 0 && imageFiles.length === 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-1.5">All images in Drive</p>
            <div className="grid grid-cols-3 gap-2 px-2">
              {allImages.slice(0, 12).map(file => {
                const data = getFileData(file);
                return data ? (
                  <button key={file.id} onClick={() => onInsert(data)}
                    className="aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
                    <img src={data} alt={file.name} className="w-full h-full object-cover" />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Upload option */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <p className="text-[10px] text-gray-400">Upload saves to Drive & inserts into slide</p>
          <div className="flex gap-2">
            <button onClick={() => {
              const input = document.createElement("input");
              input.type = "file"; input.accept = "image/*"; input.multiple = true;
              input.onchange = () => {
                const fileList = input.files;
                if (!fileList) return;
                Array.from(fileList).forEach(f => uploadImageToDrive(f, currentFolder));
              };
              input.click();
            }} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors">
              Upload to Drive
            </button>
            <button onClick={() => {
              const input = document.createElement("input");
              input.type = "file"; input.accept = "image/*";
              input.onchange = () => {
                const f = input.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = reader.result as string;
                  // Save to Drive AND insert
                  const fileId = driveStorage.create({ parentId: currentFolder, name: f.name, type: "file", mimeType: f.type, size: f.size, sourceType: "upload" });
                  localStorage.setItem(`educo_drive_file_${fileId}`, dataUrl);
                  onInsert(dataUrl);
                };
                reader.readAsDataURL(f);
              };
              input.click();
            }} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors">
              Upload & Insert
            </button>
          </div>
        </div>
      </div>
    </EditorDialog>
  );
}
