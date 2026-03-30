"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Plus, Play, Trash2, Copy, Palette, LayoutGrid, X, ArrowLeft,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Strikethrough, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Image as ImageIcon, Type, Table2, Paintbrush, MessageCircle,
  Share2, Undo2, Redo2, ZoomIn, ZoomOut, Minus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Upload,
  Bookmark, ShieldCheck, Globe, Tag, FolderPlus, Lock, AlertTriangle, Send, Mail,
} from "lucide-react";
import { slideStorage, type SlideData, type PresentationPermissions, DEFAULT_PERMISSIONS } from "@/lib/slide-storage";
import { permissionRequests } from "@/lib/permission-requests";
import { useNotifications } from "@/contexts/NotificationContext";
import SlideMenuBar from "./SlideMenuBar";

// Shared components
import { ToolbarButton, ToolbarDivider, ToolbarDropdown } from "@/components/shared/EditorToolbar";
import { EditorDialog, EditorDialogButton, TableGridPicker, EditingModeButton, type EditingMode } from "@/components/shared/EditorDialogs";
import { CommentAvatar, CommentCard, FloatingCommentPill, useMention, type DocComment, type CommentAuthor } from "@/components/shared/EditorComments";
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
function SlideCanvasArea({ zoom, activeSlide, canEdit, editorRef, onInput, slideRatio = { w: 16, h: 9 } }: {
  zoom: number;
  activeSlide: SlideData | undefined;
  canEdit: boolean;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onInput: (html: string) => void;
  slideRatio?: { w: number; h: number };
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

// ── Reusable Slide Picker Modal ──
function SlidePickerModal({ title: modalTitle, subtitle, slides: slideList, defaultSelected, onConfirm, onClose, confirmLabel = "Confirm" }: {
  title: string;
  subtitle?: string;
  slides: SlideData[];
  defaultSelected?: Set<string>;
  onConfirm: (selectedSlides: SlideData[]) => void;
  onClose: () => void;
  confirmLabel?: string;
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
      <div className="relative z-10 w-[600px] max-w-[92vw] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{modalTitle}</h2>
            {subtitle && <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleAll}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
              {selectedIds.size === slideList.length ? "Deselect all" : "Select all"}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
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
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg shadow-blue-500/10"
                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-video overflow-hidden bg-white" style={{ background: slide.background || "#fff" }}>
                    <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: `scale(${160 / 384})` }}>
                      <div style={{ aspectRatio: "16/9" }} dangerouslySetInnerHTML={{ __html: slide.content }} />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isSelected ? "bg-blue-500 text-white" : "bg-black/50 text-white/80"}`}>{idx + 1}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected ? "bg-blue-500 shadow-md shadow-blue-500/30" : "bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
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
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <span className="text-[13px] text-gray-400">{selectedIds.size} of {slideList.length} selected</span>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">Cancel</button>
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
function ImportSlidesModal({ currentPresId, onImport, onClose }: {
  currentPresId: string;
  onImport: (slides: SlideData[]) => void;
  onClose: () => void;
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
      <div className="relative z-10 w-[600px] max-w-[92vw] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {selectedPresId && (
              <button onClick={() => { setSelectedPresId(null); setSelectedSlideIds(new Set()); }}
                className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
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
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                {selectedSlideIds.size === selectedPres?.slides.length ? "Deselect all" : "Select all"}
              </button>
            )}
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {presentations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-[15px] font-medium text-gray-600 dark:text-gray-400">No presentations found</p>
              <p className="text-[13px] text-gray-400 mt-1 max-w-[280px]">Create another presentation first, then come back to import slides from it</p>
            </div>

          ) : !selectedPresId ? (
            /* Step 1: Presentation list */
            <div className="space-y-2">
              {presentations.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPresId(p.id); setSelectedSlideIds(new Set(p.slides.map(s => s.id))); }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer group border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 hover:shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-[96px] flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700">
                    <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: "scale(0.25)", background: p.slides[0]?.background || "#fff" }}>
                      <div style={{ aspectRatio: "16/9" }} dangerouslySetInnerHTML={{ __html: p.slides[0]?.content || "" }} />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
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
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg shadow-blue-500/10"
                        : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300 dark:hover:ring-blue-700 hover:shadow-md"
                    }`}
                  >
                    {/* Slide preview */}
                    <div className="aspect-video overflow-hidden bg-white" style={{ background: slide.background || "#fff" }}>
                      <div className="w-[384px] origin-top-left pointer-events-none" style={{ transform: `scale(${160 / 384})` }}>
                        <div style={{ aspectRatio: "16/9" }} dangerouslySetInnerHTML={{ __html: slide.content }} />
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
                          : "bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
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
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <span className="text-[13px] text-gray-400">
              {selectedSlideIds.size} of {selectedPres?.slides.length} selected
            </span>
            <div className="flex gap-2.5">
              <button onClick={onClose}
                className="px-5 py-2 rounded-xl text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
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

// ── Component ──
export default function SlideEditor({ value, onChange }: SlideEditorProps) {
  const { title, slides, theme } = value;
  const { addNotification } = useNotifications();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);
  const [editingMode, setEditingMode] = useState<EditingMode>("editing");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
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
    const t = slideTranslations[presentationLanguage] || slideTranslations.English;
    const newSlides = [...slides];
    const newSlide = makeSlide(`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#1f2937;margin:0;">${t.title}</h2><p style="text-align:center;font-size:18px;color:#9ca3af;margin:0;">${t.subtitle}</p></div>`);
    newSlides.splice(activeSlideIdx + 1, 0, newSlide);
    updateSlides(newSlides);
    setActiveSlideIdx(activeSlideIdx + 1);
  }, [slides, activeSlideIdx, updateSlides, presentationLanguage]);

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
          <div className="w-full h-full max-w-[100vw] max-h-[100vh] relative" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}` }}>
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
    <div
      className="flex flex-col h-full bg-[#f8f9fa] dark:bg-gray-950 slide-editor-root"
      lang={(() => {
        const langCodes: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Portuguese: "pt", Italian: "it", Dutch: "nl", Russian: "ru", Chinese: "zh", Japanese: "ja", Korean: "ko", Arabic: "ar", Hindi: "hi", Yoruba: "yo", Igbo: "ig", Hausa: "ha", Swahili: "sw", Zulu: "zu" };
        return langCodes[presentationLanguage] || "en";
      })()}
      dir={["Arabic"].includes(presentationLanguage) ? "rtl" : "ltr"}
      style={permissions.disableCopyPrintDownload ? { userSelect: "none", WebkitUserSelect: "none" } : undefined}
      onCopy={permissions.disableCopyPrintDownload ? (e) => { e.preventDefault(); setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); } : undefined}
    >
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
            <div style={{ width: "100%", maxWidth: 900, aspectRatio: `${slideRatio.w}/${slideRatio.h}` }} dangerouslySetInnerHTML={{ __html: slide.content }} />
          </div>
        ))}
      </div>

      {/* ── Top Header — always visible ── */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800 flex-shrink-0">
        <button onClick={() => window.location.href = "/presentations"}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <input
            value={title}
            onChange={e => onChange({ ...value, title: e.target.value })}
            placeholder="Untitled presentation"
            className="text-[17px] font-semibold text-gray-800 dark:text-gray-200 bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-500 px-1 py-0.5 max-w-[340px] transition-all duration-200"
          />
          <button
            onClick={() => setShowAddToFolderDialog(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0"
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
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          title={headerCollapsed ? "Show menus & toolbar" : "Hide menus & toolbar"}
        >
          {headerCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <ToolbarButton title="Comments" Icon={MessageCircle} onClick={() => setShowCommentSidebar(!showCommentSidebar)} active={showCommentSidebar} />
        {permissions.requireSignIn && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium" title="Sign-in required to view">
            <Lock className="w-3 h-3" /> Sign-in required
          </span>
        )}
        {permissions.disableCopyPrintDownload && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[10px] font-medium" title="Copy, print, and download disabled">
            <ShieldCheck className="w-3 h-3" /> Restricted
          </span>
        )}
        <button onClick={() => {
            if (permissions.preventAccessChange) {
              setPermissionBlockedMsg({ message: "Sharing permissions are locked. Only the owner can manage access." });
            } else {
              setShowShareDialog(true);
            }
          }}
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
      <SlideMenuBar isStarred={isStarred} currentFolder={currentFolder} onAction={(action) => {
        switch (action) {
          case "slide:new": case "insert:newSlide": addSlide(); break;
          case "slide:duplicate": case "edit:duplicate": duplicateSlide(); break;
          case "slide:delete": case "edit:delete": deleteSlide(); break;
          case "view:slideshow": setActiveSlideIdx(0); setIsPresenting(true); break;
          case "slide:transitions": setShowTransitions(true); break;
          case "slide:editTheme": setShowThemes(true); break;
          case "edit:undo": document.execCommand("undo"); break;
          case "edit:redo": document.execCommand("redo"); break;
          case "edit:cut":
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); break; }
            document.execCommand("cut"); break;
          case "edit:copy":
            if (permissions.disableCopyPrintDownload) { setPermissionBlockedMsg({ message: "Copy is disabled by the document owner.", permType: "copy" }); break; }
            document.execCommand("copy"); break;
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
          case "insert:table": setShowTablePicker(true); break;

          // ── Edit menu ──
          case "edit:pasteNoFormat": {
            navigator.clipboard?.readText?.().then(text => {
              if (text) document.execCommand("insertText", false, text);
            }).catch(() => { document.execCommand("paste"); });
            break;
          }
          case "edit:findReplace": { /* TODO: find & replace dialog */ alert("Find & Replace — coming soon"); break; }

          // ── View menu ──
          case "view:modeEditing": setEditingMode("editing"); break;
          case "view:modeCommenting": setEditingMode("suggesting"); break;
          case "view:modeViewing": setEditingMode("viewing"); break;
          case "view:motion": setShowTransitions(true); break;
          case "view:themeBuilder": setShowThemes(true); break;
          case "view:gridView": { /* TODO: grid view */ break; }
          case "view:ruler": { /* rulers already visible */ break; }
          case "view:showGuides": case "view:addVGuide": case "view:addHGuide":
          case "view:editGuides": case "view:clearGuides":
          case "view:snapGrid": case "view:snapGuides": break;
          case "view:filmstrip": setFilmstripCollapsed(c => !c); break;
          case "view:zoomFit": setZoom(100); break;
          case "view:zoom50": setZoom(50); break;
          case "view:zoom75": setZoom(75); break;
          case "view:zoom100": setZoom(100); break;
          case "view:zoom150": setZoom(150); break;
          case "view:zoom200": setZoom(200); break;
          case "view:fullscreen": {
            if (document.fullscreenElement) { document.exitFullscreen(); }
            else { document.documentElement.requestFullscreen(); }
            break;
          }

          // ── Insert menu ──
          case "insert:imageUpload": {
            const input = document.createElement("input");
            input.type = "file"; input.accept = "image/*";
            input.onchange = () => {
              const file = input.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => { document.execCommand("insertHTML", false, `<img src="${reader.result}" style="max-width:80%;margin:12px auto;display:block;" />`); };
              reader.readAsDataURL(file);
            };
            input.click();
            break;
          }
          case "insert:imageUrl": {
            const imgUrl = window.prompt("Enter image URL:");
            if (imgUrl) document.execCommand("insertHTML", false, `<img src="${imgUrl}" style="max-width:80%;margin:12px auto;display:block;" />`);
            break;
          }
          case "insert:imageWeb": case "insert:imageDrive": case "insert:imageCamera":
            alert("This image source is coming soon"); break;
          case "insert:textBox":
            document.execCommand("insertHTML", false, '<div style="border:2px solid #e5e7eb;padding:16px;margin:12px;min-height:60px;border-radius:8px;font-size:16px;">Click to type</div>');
            break;
          case "insert:wordArt":
            document.execCommand("insertHTML", false, '<h1 style="text-align:center;font-size:48px;font-weight:900;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:20px 0;">Word Art</h1>');
            break;
          case "insert:shapeBasic":
            document.execCommand("insertHTML", false, '<div style="width:120px;height:120px;background:#3b82f6;border-radius:8px;margin:12px auto;"></div>');
            break;
          case "insert:shapeArrow":
            document.execCommand("insertHTML", false, '<div style="text-align:center;font-size:48px;color:#3b82f6;margin:12px 0;">→</div>');
            break;
          case "insert:shapeCallout":
            document.execCommand("insertHTML", false, '<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:16px;margin:12px;font-size:14px;">💬 Callout text</div>');
            break;
          case "insert:shapeEquation":
            document.execCommand("insertHTML", false, '<div style="text-align:center;font-family:serif;font-size:24px;font-style:italic;margin:12px 0;">E = mc²</div>');
            break;
          case "insert:line": case "insert:arrow": case "insert:elbowConnector":
          case "insert:curvedConnector": case "insert:curve": case "insert:polyline":
          case "insert:scribble":
            document.execCommand("insertHTML", false, '<hr style="border:none;border-top:2px solid #3b82f6;margin:16px 0;" />');
            break;
          case "insert:diagramGrid": case "insert:diagramHierarchy": case "insert:diagramTimeline":
          case "insert:diagramProcess": case "insert:diagramRelationship": case "insert:diagramCycle":
            alert("Diagram insertion — coming soon"); break;
          case "insert:chartBar": case "insert:chartColumn": case "insert:chartLine": case "insert:chartPie":
            alert("Chart insertion — coming soon"); break;

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
          case "format:options":
            alert("Format options — coming soon"); break;

          // ── Slide menu ──
          case "slide:skip": {
            // Toggle skip flag on current slide (visual dimming)
            const el = editorRef.current;
            if (el) { el.style.opacity = el.style.opacity === "0.3" ? "1" : "0.3"; }
            break;
          }
          case "slide:moveStart": {
            if (activeSlideIdx > 0) {
              const ns = [...slides]; const [s] = ns.splice(activeSlideIdx, 1); ns.unshift(s);
              updateSlides(ns); setActiveSlideIdx(0);
            }
            break;
          }
          case "slide:moveUp": {
            if (activeSlideIdx > 0) {
              const ns = [...slides]; [ns[activeSlideIdx - 1], ns[activeSlideIdx]] = [ns[activeSlideIdx], ns[activeSlideIdx - 1]];
              updateSlides(ns); setActiveSlideIdx(activeSlideIdx - 1);
            }
            break;
          }
          case "slide:moveDown": {
            if (activeSlideIdx < slides.length - 1) {
              const ns = [...slides]; [ns[activeSlideIdx], ns[activeSlideIdx + 1]] = [ns[activeSlideIdx + 1], ns[activeSlideIdx]];
              updateSlides(ns); setActiveSlideIdx(activeSlideIdx + 1);
            }
            break;
          }
          case "slide:moveEnd": {
            if (activeSlideIdx < slides.length - 1) {
              const ns = [...slides]; const [s] = ns.splice(activeSlideIdx, 1); ns.push(s);
              updateSlides(ns); setActiveSlideIdx(ns.length - 1);
            }
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
          case "arrange:flipH": case "arrange:flipV":
          case "arrange:group": case "arrange:ungroup":
            // Arrange operations work on selected objects (future feature)
            break;

          // ── Tools menu ──
          case "tools:spellCheck": alert("Spell check — coming soon"); break;
          case "tools:dictionary": alert("Personal dictionary — coming soon"); break;
          case "tools:explore": alert("Explore — coming soon"); break;
          case "tools:linkedObjects": alert("Linked objects — none found"); break;
          case "tools:dictionaryLookup": {
            const word = window.getSelection()?.toString()?.trim();
            if (word) window.open(`https://www.google.com/search?q=define+${encodeURIComponent(word)}`, "_blank");
            else alert("Select a word first, then use Dictionary");
            break;
          }
          case "tools:voiceType": alert("Voice typing for speaker notes — coming soon"); break;
          case "tools:accessibility": alert("Accessibility settings — coming soon"); break;

          // ── Help menu ──
          case "help:search": alert("Search the menus — coming soon"); break;
          case "help:shortcuts": alert("Keyboard shortcuts:\n\nCtrl+M — New slide\nCtrl+D — Duplicate slide\nCtrl+Z — Undo\nCtrl+Y — Redo\nCtrl+B — Bold\nCtrl+I — Italic\nCtrl+U — Underline\nCtrl+P — Print\nCtrl+F5 — Slideshow\nPageUp/Down — Navigate slides\nArrow Up/Down — Navigate slides (in filmstrip)"); break;
          case "help:training": window.open("https://support.google.com/docs/answer/2763168", "_blank"); break;
          case "help:updates": alert("You are using the latest version"); break;

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
                    <div className="w-full overflow-hidden" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}`, background: slide.background || "#fff" }}>
                      <div className="w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(0.24)" }}>
                        <div className="w-full" style={{ aspectRatio: `${slideRatio.w}/${slideRatio.h}` }} dangerouslySetInnerHTML={{ __html: slide.content }} />
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
            slideRatio={slideRatio}
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
              Slide {activeSlideIdx + 1} of {slides.length} · {presentationLanguage}
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

      {/* Details Dialog */}
      {showDetailsDialog && (
        <EditorDialog title="Presentation Details" onClose={() => setShowDetailsDialog(false)}>
          <div className="space-y-3 text-[13px] text-gray-600 dark:text-gray-400">
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Title</span><span>{title}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Slides</span><span>{slides.length}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Theme</span><span className="capitalize">{theme}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Owner</span><span>You</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Last modified</span><span>{new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-800 dark:text-gray-200">Created</span><span>{new Date().toLocaleDateString()}</span></div>
          </div>
        </EditorDialog>
      )}

      {/* Page Setup Dialog */}
      {showPageSetup && (
        <EditorDialog title="Page Setup" onClose={() => setShowPageSetup(false)}>
          <div className="space-y-4">
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Slide dimensions</p>
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
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold"
                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300"
                    }`}>
                    <div className="border border-current rounded" style={{ width: 48, aspectRatio: `${opt.w}/${opt.h}` }} />
                    {opt.label}
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Current: {slideRatio.label} ({slideRatio.w}:{slideRatio.h})</p>
          </div>
        </EditorDialog>
      )}

      {/* Version History Panel */}
      {showVersionHistory && (
        <EditorDialog title="Version History" onClose={() => setShowVersionHistory(false)}>
          <div className="space-y-3">
            <p className="text-[12px] text-gray-400">Saved versions of this presentation</p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-[13px] font-medium text-blue-700 dark:text-blue-300">Current version</p>
                <p className="text-[11px] text-blue-500 dark:text-blue-400 mt-0.5">{new Date().toLocaleString()}</p>
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
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                  <FolderPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-blue-800 dark:text-blue-200">{title}</p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400">Currently in: <span className="font-semibold">{currentFolder}</span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2">Move to:</p>
                  <div className="space-y-1.5">
                    {folders.map(folder => (
                      <button key={folder} onClick={() => setSelected(folder)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
                          selected === folder
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border border-blue-300 dark:border-blue-700"
                            : folder === currentFolder
                              ? "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-transparent"
                              : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent"
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
                    <div key={item.key} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${enabled ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10" : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"}`}>
                      <item.icon className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${enabled ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                      <div className="flex-1">
                        <p className={`text-[13px] font-medium ${enabled ? "text-blue-800 dark:text-blue-200" : "text-gray-800 dark:text-gray-200"}`}>{item.label}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`mt-0.5 w-9 h-5 rounded-full transition-colors cursor-pointer ${enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
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
            <p className="text-[12px] text-gray-500 dark:text-gray-400">Set the language for slide content. Placeholder text on slides will be translated to the selected language.</p>
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
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border border-blue-300 dark:border-blue-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
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
              <p className="text-[12px] text-gray-500 dark:text-gray-400">Give this version a name so you can find it later in version history.</p>
              <input
                type="text"
                value={versionName}
                onChange={e => setVersionNameLocal(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
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
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-green-800 dark:text-green-200">Permission request sent!</p>
                      <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
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
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">&ldquo;{title}&rdquo; · {slides.length} slides</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">You can restore it from the bin within 30 days. After that, it will be permanently deleted.</p>
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
    </div>
  );
}
