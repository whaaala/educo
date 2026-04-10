"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  Minimize2,
  PenLine,
  ChevronDown,
  MessageSquarePlus,
  Eye,
  Check,
} from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

/* ═══════════════════════════════════════════════════════════════════════════
 *  EditorDialog — Generic modal dialog overlay with title and close button
 * ═══════════════════════════════════════════════════════════════════════════ */

export function EditorDialog({
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
      data-editor-dialog
      className="absolute inset-0 z-[210] flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4"
    >
      <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
            {title}
          </div>
          <button
            className="px-2 py-1 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer"
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

/* ═══════════════════════════════════════════════════════════════════════════
 *  EditorDialogButton — Standardized button for dialog actions
 * ═══════════════════════════════════════════════════════════════════════════ */

export function EditorDialogButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  FullscreenFloatingPill — Glassmorphism pill shown at top of fullscreen mode
 *  Appears when user moves mouse near top of viewport, hides after delay
 * ═══════════════════════════════════════════════════════════════════════════ */

export function FullscreenFloatingPill({
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
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
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

  const pillBtnClass =
    "px-3 py-2 text-[12px] font-medium transition-colors hover:bg-white/20 dark:hover:bg-white/10 cursor-pointer min-h-[44px] flex items-center";

  return (
    <div
      data-editor-floating-pill
      className={[
        "fixed top-3 left-1/2 -translate-x-1/2 z-[250]",
        "flex items-center rounded-full",
        // Glassmorphism pill
        "bg-gray-900/70 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0d2e]/80",
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
              onClick={() => {
                setZoomLevel(z);
                setZoomExpanded(false);
              }}
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
        <kbd className="text-[10px] text-white/50 ml-1 hidden sm:inline">
          Esc
        </kbd>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  TableGridPicker — Interactive grid for selecting table rows and columns
 * ═══════════════════════════════════════════════════════════════════════════ */

export function TableGridPicker({
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
    <div className="inline-block">
      <div className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 text-center">
        {hoverRow} × {hoverCol}
      </div>
      <div
        className="inline-grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${maxCols}, 20px)` }}
      >
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
              className={`w-5 h-5 rounded-sm border transition-colors cursor-pointer ${
                active
                  ? "bg-blue-500/30 border-blue-400 dark:bg-blue-500/30 midnight:bg-cyan-500/30 purple:bg-pink-500/30 midnight:border-cyan-400 purple:border-pink-400"
                  : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300"
              }`}
              aria-label={`${r}x${c}`}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  EditingModeButton — Mode selector dropdown (Editing / Suggesting / Viewing)
 * ═══════════════════════════════════════════════════════════════════════════ */

export type EditingMode = "editing" | "suggesting" | "viewing";

export function EditingModeButton({
  editingMode,
  onModeChange,
}: {
  editingMode: EditingMode;
  onModeChange: (mode: EditingMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = editingMode.charAt(0).toUpperCase() + editingMode.slice(1);

  return (
    <div ref={ref} className="relative" data-editing-mode>
      <Tooltip content={`Current mode: ${label}`} delay={400}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-7 inline-flex items-center gap-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer text-[11px] font-medium text-gray-600 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>{label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </Tooltip>
      {open && (
        <div className="absolute z-[120] top-full mt-1 right-0 w-[180px] rounded-xl border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/80 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-xl py-1">
          {(
            [
              {
                mode: "editing" as const,
                icon: PenLine,
                desc: "Edit directly",
              },
              {
                mode: "suggesting" as const,
                icon: MessageSquarePlus,
                desc: "Edits become suggestions",
              },
              { mode: "viewing" as const, icon: Eye, desc: "Read only" },
            ] as const
          ).map(({ mode, icon: MIcon, desc }) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                onModeChange(mode);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                mode === editingMode
                  ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
              }`}
            >
              <MIcon className="w-4 h-4 flex-shrink-0" />
              <div>
                <div
                  className={`text-[12px] ${mode === editingMode ? "font-semibold" : ""}`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                  {desc}
                </div>
              </div>
              {mode === editingMode && (
                <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
