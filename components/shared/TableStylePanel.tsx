"use client";

/**
 * TableStylePanel — Shared table formatting panel component.
 * Used by SlideEditor (and potentially DocEditor) for styling tables.
 * Respects all available themes.
 */

import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Palette, Grid3X3, Rows3, ChevronDown } from "lucide-react";
import { ColorMatrixGrid } from "@/components/shared/ColorPalettePicker";
import type { TableObject } from "@/lib/slide-storage";

/** Inline expandable color swatch — click to toggle the matrix grid below it */
function InlineColorPicker({ color, onChange, label }: { color: string; onChange: (c: string) => void; label?: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2">
        {label && <span className="text-[10px] text-gray-400 dark:text-gray-500 w-10 shrink-0">{label}</span>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
          style={{ backgroundColor: color === "transparent" ? "#f3f4f6" : color }}
        >
          {color === "transparent" && <svg viewBox="0 0 20 20" className="w-4 h-4"><line x1="4" y1="16" x2="16" y2="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 flex-1 truncate">{color}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform cursor-pointer ${expanded ? "rotate-180" : ""}`} onClick={() => setExpanded(!expanded)} />
      </div>
      {expanded && (
        <div className="mt-2 p-2 rounded-xl border border-gray-100 dark:border-[#22262e] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          <ColorMatrixGrid
            selectedColor={color}
            onSelect={(c) => { onChange(c); setExpanded(false); }}
            showCustomHex={false}
          />
          {/* Custom hex row — separate so it doesn't close the grid on change */}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#22262e] midnight:border-cyan-500/10 purple:border-pink-500/10">
            <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
              <label className="relative cursor-pointer shrink-0">
                <input
                  type="color"
                  value={color.startsWith("#") ? color : "#000000"}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }}>
                  <div className="w-full h-full rounded-lg" style={{ backgroundColor: color, opacity: 0.7 }} />
                </div>
              </label>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Custom</span>
              <input
                type="text"
                value={color}
                onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value); }}
                onKeyDown={(e) => e.stopPropagation()}
                className="flex-1 px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#0f1115] text-gray-700 dark:text-gray-300 outline-none focus:border-blue-400"
                maxLength={7}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Theme presets ──

const TABLE_PRESETS = [
  { name: "None", header: "transparent", even: "#ffffff", odd: "#ffffff", border: "#d1d5db" },
  { name: "Blue", header: "#3b82f6", even: "#ffffff", odd: "#eff6ff", border: "#bfdbfe" },
  { name: "Indigo", header: "#6366f1", even: "#ffffff", odd: "#eef2ff", border: "#c7d2fe" },
  { name: "Green", header: "#22c55e", even: "#ffffff", odd: "#f0fdf4", border: "#bbf7d0" },
  { name: "Teal", header: "#14b8a6", even: "#ffffff", odd: "#f0fdfa", border: "#99f6e4" },
  { name: "Orange", header: "#f97316", even: "#ffffff", odd: "#fff7ed", border: "#fed7aa" },
  { name: "Red", header: "#ef4444", even: "#ffffff", odd: "#fef2f2", border: "#fecaca" },
  { name: "Purple", header: "#8b5cf6", even: "#ffffff", odd: "#faf5ff", border: "#ddd6fe" },
  { name: "Rose", header: "#ec4899", even: "#ffffff", odd: "#fdf2f8", border: "#fbcfe8" },
  { name: "Slate", header: "#475569", even: "#ffffff", odd: "#f8fafc", border: "#cbd5e1" },
  { name: "Dark", header: "#1f2937", even: "#f9fafb", odd: "#e5e7eb", border: "#9ca3af" },
  { name: "Zebra", header: "transparent", even: "#ffffff", odd: "#f3f4f6", border: "#e5e7eb" },
];

// ── Types ──

interface TableStylePanelProps {
  obj: TableObject;
  onUpdate: (updates: Partial<TableObject>) => void;
  /** Anchor element rect for positioning */
  anchorRect?: DOMRect | null;
  onClose?: () => void;
}

// ── Active state classes ──
const activeBtn = "bg-blue-100 text-blue-700 dark:bg-[#22262e] dark:text-gray-100 dark:border dark:border-gray-600 midnight:bg-cyan-500/15 midnight:text-cyan-400 midnight:border midnight:border-cyan-500/30 purple:bg-pink-500/15 purple:text-pink-400 purple:border purple:border-pink-500/30";
const inactiveBtn = "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border border-transparent";
const sectionLabel = "text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/60 purple:text-pink-400/60 mb-2";

export default function TableStylePanel({ obj, onUpdate, anchorRect, onClose }: TableStylePanelProps) {
  const [tab, setTab] = useState<"theme" | "border" | "structure">("theme");
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position panel to the right of the table (or left if no space)
  useEffect(() => {
    if (!anchorRect) return;
    const w = 300;
    const margin = 16;
    let top = anchorRect.top;
    let left = anchorRect.right + 12;
    if (left + w > window.innerWidth - margin) left = anchorRect.left - w - 12;
    if (left < margin) left = margin;
    if (top < margin) top = margin;
    // Clamp top so panel + maxHeight doesn't go below viewport
    const maxTop = window.innerHeight - margin - 200; // at least 200px visible
    if (top > maxTop) top = maxTop;
    setPos({ top, left });
  }, [anchorRect]);

  const tabs = [
    { key: "theme" as const, icon: Palette, label: "Theme" },
    { key: "border" as const, icon: Grid3X3, label: "Border" },
    { key: "structure" as const, icon: Rows3, label: "Structure" },
  ];

  return (
    <div
      ref={panelRef}
      className="fixed z-[10001] w-[300px] rounded-2xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex flex-col"
      style={{ top: pos.top, left: pos.left, maxHeight: `calc(100vh - ${pos.top + 16}px)` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#1a1d24] midnight:bg-cyan-500/10 purple:bg-pink-500/10 flex items-center justify-center">
              <Grid3X3 className="w-4.5 h-4.5 text-blue-600 dark:text-gray-300 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                Table {obj.rows} × {obj.cols}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
                Double-click to edit cells
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22262e] cursor-pointer transition-all">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-3 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 shrink-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-all cursor-pointer relative ${
              tab === t.key
                ? "text-blue-600 dark:text-gray-100 midnight:text-cyan-400 purple:text-pink-400"
                : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {tab === t.key && <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 dark:bg-gray-300 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-3.5 flex-1 overflow-y-auto space-y-4 min-h-0">

        {/* ── THEME TAB ── */}
        {tab === "theme" && (
          <>
            <div>
              <div className={sectionLabel}>Quick Themes</div>
              <div className="grid grid-cols-4 gap-2">
                {TABLE_PRESETS.map(t => {
                  const isActive = obj.headerColor === t.header && obj.evenRowColor === t.even && obj.oddRowColor === t.odd;
                  return (
                    <button
                      key={t.name}
                      onClick={() => onUpdate({ headerColor: t.header, evenRowColor: t.even, oddRowColor: t.odd, borderColor: t.border, headerRow: t.header !== "transparent" })}
                      className={`rounded-xl p-1.5 cursor-pointer transition-all hover:scale-105 ${
                        isActive
                          ? "ring-2 ring-blue-500 dark:ring-gray-400 midnight:ring-cyan-400 purple:ring-pink-400 ring-offset-2 dark:ring-offset-[#0f1115] midnight:ring-offset-[#0a0e27] purple:ring-offset-[#1a0b2e]"
                          : "border border-gray-200 dark:border-[#22262e] midnight:border-cyan-500/15 purple:border-pink-500/15 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      title={t.name}
                    >
                      <div className="rounded-lg overflow-hidden">
                        <div className="h-3" style={{ backgroundColor: t.header === "transparent" ? "#e5e7eb" : t.header }} />
                        <div className="h-2.5" style={{ backgroundColor: t.even }} />
                        <div className="h-2.5" style={{ backgroundColor: t.odd }} />
                        <div className="h-2.5" style={{ backgroundColor: t.even }} />
                      </div>
                      <div className="text-[8px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 mt-1 text-center font-medium">{t.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className={sectionLabel}>Header Color</div>
              <InlineColorPicker color={obj.headerColor} onChange={(c) => onUpdate({ headerColor: c })} />
              <label className="flex items-center gap-1.5 cursor-pointer mt-2">
                <input type="checkbox" checked={obj.headerRow} onChange={(e) => onUpdate({ headerRow: e.target.checked })} className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Header row</span>
              </label>
            </div>
          </>
        )}

        {/* ── BORDER TAB ── */}
        {tab === "border" && (
          <>
            <div>
              <div className={sectionLabel}>Border Color</div>
              <InlineColorPicker color={obj.borderColor} onChange={(c) => onUpdate({ borderColor: c })} />
            </div>

            <div>
              <div className={sectionLabel}>Border Width</div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map(w => (
                  <button key={w}
                    onClick={() => onUpdate({ borderWidth: w })}
                    className={`flex-1 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                      obj.borderWidth === w ? activeBtn : inactiveBtn
                    }`}
                    title={w === 0 ? "None" : `${w}px`}
                  >
                    {w === 0 ? (
                      <svg viewBox="0 0 20 20" className="w-4 h-4"><line x1="4" y1="16" x2="16" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    ) : (
                      <div style={{ width: 20, height: Math.max(1, w), backgroundColor: "currentColor", borderRadius: 1 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className={sectionLabel}>Cell Padding</div>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={20} value={obj.cellPadding}
                  onChange={(e) => onUpdate({ cellPadding: Number(e.target.value) })}
                  className="flex-1 h-1.5 accent-blue-500 dark:accent-gray-400 midnight:accent-cyan-500 purple:accent-pink-500 cursor-pointer rounded-full"
                />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 w-8 text-right">{obj.cellPadding}px</span>
              </div>
            </div>

            <div>
              <div className={sectionLabel}>Font Size</div>
              <div className="flex gap-1">
                {[8, 10, 12, 14, 16, 18, 20, 24].map(s => (
                  <button key={s}
                    onClick={() => onUpdate({ fontSize: s })}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition-all ${
                      obj.fontSize === s ? activeBtn : inactiveBtn
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── STRUCTURE TAB ── */}
        {tab === "structure" && (
          <>
            <div>
              <div className={sectionLabel}>Add / Remove</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {
                  const newCells = [...obj.cells, Array.from({ length: obj.cols }, () => ({ content: "" }))];
                  const rh = obj.rowHeights ? [...obj.rowHeights, 100 / (obj.rows + 1)] : undefined;
                  onUpdate({ rows: obj.rows + 1, cells: newCells, rowHeights: rh, height: obj.height + 6 });
                }} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium cursor-pointer transition-all ${inactiveBtn} hover:!bg-blue-50 dark:hover:!bg-[#22262e]`}>
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
                <button onClick={() => {
                  const newCells = obj.cells.map(row => [...row, { content: "" }]);
                  const cw = obj.colWidths ? [...obj.colWidths, 100 / (obj.cols + 1)] : undefined;
                  onUpdate({ cols: obj.cols + 1, cells: newCells, colWidths: cw });
                }} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium cursor-pointer transition-all ${inactiveBtn} hover:!bg-blue-50 dark:hover:!bg-[#22262e]`}>
                  <Plus className="w-3.5 h-3.5" /> Add Column
                </button>
                <button onClick={() => {
                  if (obj.rows <= 1) return;
                  const newCells = obj.cells.slice(0, -1);
                  const rh = obj.rowHeights?.slice(0, -1);
                  onUpdate({ rows: obj.rows - 1, cells: newCells, rowHeights: rh, height: Math.max(10, obj.height - 6) });
                }} disabled={obj.rows <= 1}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed text-red-500 dark:text-red-400 border border-transparent hover:bg-red-50 dark:hover:bg-red-500/10`}>
                  <Minus className="w-3.5 h-3.5" /> Remove Row
                </button>
                <button onClick={() => {
                  if (obj.cols <= 1) return;
                  const newCells = obj.cells.map(row => row.slice(0, -1));
                  const cw = obj.colWidths?.slice(0, -1);
                  onUpdate({ cols: obj.cols - 1, cells: newCells, colWidths: cw });
                }} disabled={obj.cols <= 1}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed text-red-500 dark:text-red-400 border border-transparent hover:bg-red-50 dark:hover:bg-red-500/10`}>
                  <Minus className="w-3.5 h-3.5" /> Remove Column
                </button>
              </div>
            </div>

            <div>
              <div className={sectionLabel}>Row Colors</div>
              <div className="space-y-2.5">
                <InlineColorPicker label="Even" color={obj.evenRowColor} onChange={(c) => onUpdate({ evenRowColor: c })} />
                <InlineColorPicker label="Odd" color={obj.oddRowColor} onChange={(c) => onUpdate({ oddRowColor: c })} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
