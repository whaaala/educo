"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Plus, Play, Trash2, Copy, Palette, LayoutGrid, X, ArrowLeft,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Strikethrough, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Image as ImageIcon, Type, Table2, Paintbrush, MessageCircle,
  Share2, Undo2, Redo2, ZoomIn, ZoomOut, Minus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
} from "lucide-react";
import type { SlideData } from "@/lib/slide-storage";
import SlideMenuBar from "./SlideMenuBar";

// Shared components
import { ToolbarButton, ToolbarDivider, ToolbarDropdown } from "@/components/shared/EditorToolbar";
import { EditorDialog, EditorDialogButton, TableGridPicker, EditingModeButton, type EditingMode } from "@/components/shared/EditorDialogs";
import { CommentAvatar, CommentCard, FloatingCommentPill, useMention, type DocComment, type CommentAuthor } from "@/components/shared/EditorComments";
import ShareDialog from "@/components/shared/ShareDialog";

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
const THEMES: Record<string, { bg: string; text: string; accent: string; label: string }> = {
  default: { bg: "#ffffff", text: "#111827", accent: "#3b82f6", label: "Default" },
  corporate: { bg: "#f8fafc", text: "#1e3a5f", accent: "#1e40af", label: "Corporate" },
  modern: { bg: "#faf5ff", text: "#7c3aed", accent: "#8b5cf6", label: "Modern" },
  vibrant: { bg: "linear-gradient(135deg, #1e40af, #7c3aed)", text: "#ffffff", accent: "#f59e0b", label: "Vibrant" },
  bold: { bg: "#0f172a", text: "#ffffff", accent: "#3b82f6", label: "Bold Dark" },
  elegant: { bg: "#ffffff", text: "#111827", accent: "#111827", label: "Elegant" },
  clean: { bg: "#f1f5f9", text: "#0f172a", accent: "#0ea5e9", label: "Clean" },
  academic: { bg: "#f0f9ff", text: "#1e3a5f", accent: "#2563eb", label: "Academic" },
  bright: { bg: "linear-gradient(135deg, #2563eb, #7c3aed)", text: "#ffffff", accent: "#fbbf24", label: "Bright" },
};

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
    <div className={`relative ${isH ? "h-[20px] w-full" : "w-[20px] h-full"} bg-[#f1f3f4] dark:bg-gray-900/80 select-none overflow-hidden`}>
      {/* Slide range highlight */}
      <div
        className={`absolute ${isH ? "h-full" : "w-full"}`}
        style={{
          background: "rgba(255,255,255,0.7)",
          ...(isH ? { left: slideOffset, width: length } : { top: slideOffset, height: length }),
        }}
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
      <div className={`absolute ${isH ? "bottom-0 left-0 right-0 h-px" : "right-0 top-0 bottom-0 w-px"} bg-gray-300/50 dark:bg-gray-700/50`} />
    </div>
  );
}

// ── Slide Canvas with rulers and proper fit ──
function SlideCanvasArea({ zoom, activeSlide, canEdit, editorRef, onInput }: {
  zoom: number;
  activeSlide: SlideData | undefined;
  canEdit: boolean;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onInput: (html: string) => void;
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
      let h = w * 9 / 16;
      if (h > availH) {
        h = availH;
        w = h * 16 / 9;
      }
      setSize({ w: Math.max(200, Math.round(w)), h: Math.max(112, Math.round(h)) });
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const slideLeft = 18 + (containerSize.w - 18 - size.w) / 2;
  const slideTop = 18 + (containerSize.h - 18 - size.h) / 2;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-[#e8eaed]/60 dark:bg-gray-950 overflow-hidden relative">
      {/* Horizontal ruler */}
      <SlideRuler direction="h" length={size.w} slideOffset={slideLeft} />

      <div className="flex flex-1 min-h-0">
        {/* Vertical ruler */}
        <SlideRuler direction="v" length={size.h} slideOffset={slideTop - 18} />

        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div
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
              className="absolute inset-0 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden"
              style={{ background: activeSlide?.background || "#ffffff" }}
            >
              <div
                contentEditable={canEdit}
                suppressContentEditableWarning
                className="absolute inset-0 outline-none px-[8%] py-[6%]"
                dangerouslySetInnerHTML={{ __html: activeSlide?.content || "" }}
                onInput={(e) => onInput((e.target as HTMLDivElement).innerHTML)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ──
export default function SlideEditor({ value, onChange }: SlideEditorProps) {
  const { title, slides, theme } = value;
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);
  const [editingMode, setEditingMode] = useState<EditingMode>("editing");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [comments, setComments] = useState<DocComment[]>([]);
  const [zoom, setZoom] = useState(100);
  const [notesHeight, setNotesHeight] = useState(0);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [filmstripCollapsed, setFilmstripCollapsed] = useState(false);
  const isDraggingNotes = useRef(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const activeSlide = slides[activeSlideIdx] || slides[0];
  const canEdit = editingMode === "editing";

  const currentAuthor: CommentAuthor = { id: "current-user", name: "You", avatar: undefined };

  const updateSlides = useCallback((newSlides: SlideData[]) => {
    onChange({ ...value, slides: newSlides });
  }, [value, onChange]);

  const updateCurrentSlide = useCallback((updates: Partial<SlideData>) => {
    const newSlides = [...slides];
    newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], ...updates };
    updateSlides(newSlides);
  }, [slides, activeSlideIdx, updateSlides]);

  const addSlide = useCallback(() => {
    const newSlides = [...slides];
    const newSlide = makeSlide('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#1f2937;margin:0;">Click to add title</h2><p style="text-align:center;font-size:18px;color:#9ca3af;margin:0;">Click to add subtitle</p></div>');
    newSlides.splice(activeSlideIdx + 1, 0, newSlide);
    updateSlides(newSlides);
    setActiveSlideIdx(activeSlideIdx + 1);
  }, [slides, activeSlideIdx, updateSlides]);

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

  const insertTable = useCallback((rows: number, cols: number) => {
    if (!editorRef.current) return;
    let html = '<table style="width:80%;margin:20px auto;border-collapse:collapse;">';
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += `<td style="border:1px solid #d1d5db;padding:8px;min-width:60px;">&nbsp;</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    document.execCommand("insertHTML", false, html);
    setShowTablePicker(false);
  }, []);

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

  // Keyboard navigation in slideshow
  useEffect(() => {
    if (!isPresenting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPresenting(false);
      if (e.key === "ArrowRight" || e.key === " ") setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1));
      if (e.key === "ArrowLeft") setActiveSlideIdx(i => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPresenting, slides.length]);

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

  // ── Slideshow Mode ──
  if (isPresenting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none" onClick={() => setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1))}>
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-full h-full max-w-[100vw] max-h-[100vh] relative" style={{ aspectRatio: "16/9" }}>
            <div
              className={`w-full h-full ${TRANSITION_STYLES[activeSlide?.transition || "fade"]}`}
              style={{ background: activeSlide?.background || "#ffffff" }}
            >
              <div className="w-full h-full p-8 lg:p-16" dangerouslySetInnerHTML={{ __html: activeSlide?.content || "" }} />
            </div>
          </div>
          {/* Slide counter — bottom center pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 text-[12px] font-medium">
            {activeSlideIdx + 1} / {slides.length}
          </div>
          {/* Exit button */}
          <button onClick={(e) => { e.stopPropagation(); setIsPresenting(false); }}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white/60 hover:bg-black/60 hover:text-white transition-all duration-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          {/* Navigation arrows */}
          {activeSlideIdx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveSlideIdx(i => Math.max(i - 1, 0)); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:bg-black/50 hover:text-white transition-all duration-200 cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {activeSlideIdx < slides.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveSlideIdx(i => Math.min(i + 1, slides.length - 1)); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:bg-black/50 hover:text-white transition-all duration-200 cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-gray-950">
      {/* ── Top Header — always visible ── */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800 flex-shrink-0">
        <button onClick={() => window.location.href = "/presentations"}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <input
          value={title}
          onChange={e => onChange({ ...value, title: e.target.value })}
          placeholder="Untitled presentation"
          className="text-[17px] font-semibold text-gray-800 dark:text-gray-200 bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-500 px-1 py-0.5 max-w-[340px] transition-all duration-200"
        />
        <div className="flex-1" />
        {/* Collapse/expand toggle for menus+toolbar */}
        <button
          onClick={() => setHeaderCollapsed(c => !c)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          title={headerCollapsed ? "Show menus & toolbar" : "Hide menus & toolbar"}
        >
          {headerCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <ToolbarButton title="Comments" Icon={MessageCircle} onClick={() => setShowCommentSidebar(!showCommentSidebar)} active={showCommentSidebar} />
        <button onClick={() => setShowShareDialog(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        <button onClick={() => { setActiveSlideIdx(0); setIsPresenting(true); }}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[13px] font-semibold hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer">
          <Play className="w-3.5 h-3.5 fill-current" /> Present
        </button>
      </div>

      {/* ── Collapsible Menu + Toolbar ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0"
        style={{ maxHeight: headerCollapsed ? 0 : 300, opacity: headerCollapsed ? 0 : 1 }}
      >
      {/* ── Menu Bar (shared component) ── */}
      <SlideMenuBar onAction={(action) => {
        switch (action) {
          case "slide:new": case "insert:newSlide": addSlide(); break;
          case "slide:duplicate": case "edit:duplicate": duplicateSlide(); break;
          case "slide:delete": case "edit:delete": deleteSlide(); break;
          case "view:slideshow": setActiveSlideIdx(0); setIsPresenting(true); break;
          case "slide:transitions": setShowTransitions(true); break;
          case "slide:editTheme": setShowThemes(true); break;
          case "edit:undo": document.execCommand("undo"); break;
          case "edit:redo": document.execCommand("redo"); break;
          case "edit:cut": document.execCommand("cut"); break;
          case "edit:copy": document.execCommand("copy"); break;
          case "edit:paste": document.execCommand("paste"); break;
          case "edit:selectAll": document.execCommand("selectAll"); break;
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
          case "file:print": setTimeout(() => window.print(), 300); break;
          case "file:newFromTemplate": window.location.href = "/presentations"; break;
          case "file:share": setShowShareDialog(true); break;
          case "file:rename": {
            const titleInput = document.querySelector('input[placeholder="Untitled presentation"]') as HTMLInputElement;
            if (titleInput) { titleInput.focus(); titleInput.select(); }
            break;
          }
          case "file:new": window.location.href = "/presentations/editor"; break;
          case "file:open": window.location.href = "/presentations"; break;
          case "file:details": { /* TODO: show details modal */ break; }
          case "file:security": { /* TODO: show security limitations */ break; }
          case "file:language": { /* TODO: show language picker */ break; }
          case "file:offline": { /* TODO: enable offline mode */ break; }
          case "file:move": { /* TODO: show Drive folder picker */ break; }
          case "file:shortcut": { /* TODO: add Drive shortcut */ break; }
          case "file:emailFile": { /* TODO: email file dialog */ break; }
          case "file:emailCollaborators": { /* TODO: email collaborators */ break; }
          case "file:videoAll": { /* TODO: convert to video */ break; }
          case "file:videoSelected": { /* TODO: convert selected to video */ break; }
          case "file:versionName": { /* TODO: name current version */ break; }
          case "file:versionHistory": { /* TODO: show version history */ break; }
          case "file:pageSetup": { /* TODO: page setup dialog */ break; }
          case "insert:comment": addComment(); break;
          case "insert:table": setShowTablePicker(true); break;
          default: break;
        }
      }} />

      {/* ── Slide Toolbar (using shared ToolbarButton & ToolbarDivider) ── */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 bg-white dark:bg-gray-900 border-b border-gray-200/60 dark:border-gray-800 flex-shrink-0">
        <ToolbarButton title="New slide (Ctrl+M)" Icon={Plus} onClick={addSlide} disabled={!canEdit} />
        <ToolbarButton title="Duplicate slide" Icon={Copy} onClick={duplicateSlide} disabled={!canEdit} />
        <ToolbarButton title="Delete slide" Icon={Trash2} onClick={deleteSlide} disabled={!canEdit || slides.length <= 1} />
        <ToolbarDivider />
        <ToolbarButton title="Undo (Ctrl+Z)" Icon={Undo2} onClick={() => document.execCommand("undo")} disabled={!canEdit} />
        <ToolbarButton title="Redo (Ctrl+Y)" Icon={Redo2} onClick={() => document.execCommand("redo")} disabled={!canEdit} />
        <ToolbarDivider />
        <ToolbarButton title="Themes" Icon={Palette} onClick={() => { setShowThemes(!showThemes); setShowTransitions(false); }} active={showThemes} />
        <ToolbarButton title="Transitions" Icon={LayoutGrid} onClick={() => { setShowTransitions(!showTransitions); setShowThemes(false); }} active={showTransitions} />
        <ToolbarDivider />
        {/* Text formatting */}
        <ToolbarButton title="Bold (Ctrl+B)" Icon={Bold} onClick={() => document.execCommand("bold")} disabled={!canEdit} />
        <ToolbarButton title="Italic (Ctrl+I)" Icon={Italic} onClick={() => document.execCommand("italic")} disabled={!canEdit} />
        <ToolbarButton title="Underline (Ctrl+U)" Icon={Underline} onClick={() => document.execCommand("underline")} disabled={!canEdit} />
        <ToolbarButton title="Strikethrough" Icon={Strikethrough} onClick={() => document.execCommand("strikeThrough")} disabled={!canEdit} />
        <ToolbarDivider />
        {/* Alignment */}
        <ToolbarButton title="Align left" Icon={AlignLeft} onClick={() => document.execCommand("justifyLeft")} disabled={!canEdit} />
        <ToolbarButton title="Align center" Icon={AlignCenter} onClick={() => document.execCommand("justifyCenter")} disabled={!canEdit} />
        <ToolbarButton title="Align right" Icon={AlignRight} onClick={() => document.execCommand("justifyRight")} disabled={!canEdit} />
        <ToolbarDivider />
        {/* Insert */}
        <ToolbarDropdown title="Insert table" Icon={Table2} isOpen={showTablePicker} onToggle={() => setShowTablePicker(!showTablePicker)} disabled={!canEdit}>
          <TableGridPicker onPick={(r, c) => insertTable(r, c)} />
        </ToolbarDropdown>
        <ToolbarButton title="Insert image" Icon={ImageIcon} onClick={() => {/* image upload */}} disabled={!canEdit} />
        <ToolbarButton title="Insert text box" Icon={Type} onClick={() => {
          document.execCommand("insertHTML", false, '<div style="border:1px solid #d1d5db;padding:16px;margin:12px;min-height:40px;">Text box</div>');
        }} disabled={!canEdit} />
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

      {/* ── Main Area ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Filmstrip — collapsible */}
        {filmstripCollapsed ? (
          /* Collapsed: thin strip with expand button */
          <div className="flex-shrink-0 w-[24px] bg-[#f1f3f4] dark:bg-gray-900/50 border-r border-gray-200/80 dark:border-gray-800 flex items-start justify-center pt-3">
            <button
              onClick={() => setFilmstripCollapsed(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
              title="Show filmstrip"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded: full filmstrip with slides */
          <div
            className="flex-shrink-0 w-[200px] lg:w-[220px] bg-[#f1f3f4] dark:bg-gray-900/50 border-r border-gray-200/80 dark:border-gray-800 flex flex-col outline-none"
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
            {/* Scrollable slide list */}
            <div ref={filmstripRef} className="flex-1 overflow-y-auto pt-3 pb-4 px-3 space-y-1.5">
              {slides.map((slide, idx) => (
                <div key={slide.id} data-slide-idx={idx} className="flex items-start gap-2">
                  <span className={`text-[11px] font-medium mt-3 w-5 text-right flex-shrink-0 ${
                    idx === activeSlideIdx ? "text-blue-600" : "text-gray-400"
                  }`}>{idx + 1}</span>
                  <button
                    onClick={() => { setActiveSlideIdx(idx); (filmstripRef.current?.closest('[tabindex]') as HTMLElement)?.focus(); }}
                    className={`flex-1 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      idx === activeSlideIdx
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#f1f3f4] dark:ring-offset-gray-900 shadow-lg shadow-blue-500/10"
                        : "ring-1 ring-gray-300/60 dark:ring-gray-700/60 hover:ring-gray-400 dark:hover:ring-gray-600 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden" style={{ background: slide.background || "#fff" }}>
                      <div className="w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(0.24)" }}>
                        <div className="w-full" style={{ aspectRatio: "16/9" }} dangerouslySetInnerHTML={{ __html: slide.content }} />
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              {/* Add slide */}
              <div className="flex items-start gap-2">
                <span className="w-5" />
                <button onClick={addSlide}
                  className="flex-1 aspect-video rounded-lg border-2 border-dashed border-gray-300/80 dark:border-gray-600 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer group">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              </div>
            </div>
            {/* Collapse button — pinned at bottom */}
            <div className="flex-shrink-0 flex justify-center py-1.5 border-t border-gray-200/60 dark:border-gray-800">
              <button
                onClick={() => setFilmstripCollapsed(true)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
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
            onInput={(html) => updateCurrentSlide({ content: html })}
          />

          {/* Speaker Notes + Status inside canvas column */}
          {notesHeight > 0 && (
            <>
              {/* Draggable resize handle */}
              <div
                className="flex-shrink-0 h-[5px] bg-gray-100 dark:bg-gray-800 cursor-row-resize hover:bg-blue-100 dark:hover:bg-blue-900/20 active:bg-blue-200 transition-colors group relative select-none"
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
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
              {/* Notes textarea */}
              <div className="flex-shrink-0 bg-white dark:bg-gray-900 overflow-hidden transition-[height] duration-150" style={{ height: notesHeight }}>
                <div className="px-5 py-1.5 h-full">
                  <textarea
                    value={activeSlide?.notes || ""}
                    onChange={e => updateCurrentSlide({ notes: e.target.value })}
                    placeholder="Click to add speaker notes"
                    className="w-full h-full text-[13px] text-gray-600 dark:text-gray-400 bg-transparent outline-none resize-none placeholder:text-gray-400/50 dark:placeholder:text-gray-500/40 leading-relaxed"
                  />
                </div>
              </div>
            </>
          )}

          {/* Status bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-0.5 border-t border-gray-200/80 dark:border-gray-800 bg-[#f8f9fa] dark:bg-gray-900/80 h-[28px]">
            <div className="flex items-center gap-1.5">
              <button className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="Grid view">
                <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title={notesHeight > 0 ? "Hide speaker notes" : "Show speaker notes"}
                onClick={() => setNotesHeight(h => h > 0 ? 0 : 90)}
              >
                <ChevronLeft className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${notesHeight > 0 ? "rotate-90" : "-rotate-90"}`} />
              </button>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Slide {activeSlideIdx + 1} of {slides.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <ZoomOut className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <span className="text-[10px] text-gray-400 font-medium min-w-[32px] text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-0.5 rounded hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — Themes / Transitions / Comments */}
        {(showThemes || showTransitions || showCommentSidebar) && (
          <div className="w-[300px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200/80 dark:border-gray-800 overflow-y-auto p-4">
            {showThemes && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Themes</h3>
                  <button onClick={() => setShowThemes(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => onChange({ ...value, theme: key })}
                      className={`rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                        theme === key
                          ? "ring-2 ring-blue-500 ring-offset-2 shadow-md"
                          : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="aspect-video relative" style={{ background: t.bg }}>
                        <div className="absolute inset-0 p-3 flex flex-col justify-center">
                          <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: t.accent }} />
                          <div className="h-1 w-14 rounded-full mt-1.5" style={{ backgroundColor: t.text, opacity: 0.2 }} />
                          <div className="h-1 w-10 rounded-full mt-1" style={{ backgroundColor: t.text, opacity: 0.1 }} />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center py-1.5 font-medium">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showTransitions && (
              <div className={showThemes ? "mt-5 pt-5 border-t border-gray-100 dark:border-gray-800" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Transitions</h3>
                  <button onClick={() => setShowTransitions(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
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
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium ring-1 ring-blue-200 dark:ring-blue-800"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        activeSlide?.transition === t ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
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
              <div className={showThemes || showTransitions ? "mt-4 pt-4 border-t border-gray-100 dark:border-gray-800" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Comments</h3>
                  <button onClick={() => setShowCommentSidebar(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
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
      </div>

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
    </div>
  );
}
