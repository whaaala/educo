"use client";

/**
 * Bulk properties panel — shown when MORE THAN ONE box is selected (via marquee). Any change here is
 * applied to EVERY selected box at once: quick +/- width & height steppers plus a shared-property panel
 * (margin, padding, background, corner radius, opacity, alignment). Duplicate / delete act on the whole
 * selection. Mirrors BoxInspector's look so it feels like the same panel, just multi-target.
 */

import { Minus, Plus, Copy, Trash2, Layers } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import type { BoxNode, FlexAlign } from "@/lib/box-model";
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const label = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
const section = "text-[11px] font-semibold uppercase tracking-wide text-gray-400 pt-1";
const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
const toRem = (px: number) => +(px / 10).toFixed(2);

/** A −/+ stepper row that repeatedly nudges a property on every selected box. */
function Stepper({ title, onStep }: { title: string; onStep: (dir: -1 | 1) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={label}>{title}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onStep(-1)} aria-label={`Decrease ${title.toLowerCase()}`} title={`Decrease ${title.toLowerCase()}`} className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus className="w-4 h-4" /></button>
        <button onClick={() => onStep(1)} aria-label={`Increase ${title.toLowerCase()}`} title={`Increase ${title.toLowerCase()}`} className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function BulkInspector({ count, theme, onStepWidth, onStepHeight, onPatch, onDuplicate, onDelete, onFloatAll }: {
  count: number;
  theme: SiteTheme;
  onStepWidth: (dir: -1 | 1) => void;
  onStepHeight: (dir: -1 | 1) => void;
  onPatch: (patch: Partial<BoxNode>) => void;   // applied to ALL selected
  onDuplicate: () => void;
  onDelete: () => void;
  onFloatAll: () => void;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300"><Layers className="w-3.5 h-3.5" /> {count} sections selected</div>
      <p className="text-[10px] text-gray-400">Every change below applies to all {count} at once.</p>

      {/* ── Quick steppers (their exact ask: grow/shrink width & height together) ── */}
      <div className={section}>Size</div>
      <Stepper title="Width" onStep={onStepWidth} />
      <Stepper title="Height" onStep={onStepHeight} />

      {/* ── Shared spacing ── */}
      <div className={section}>Spacing</div>
      <label className="block"><span className={label}>Margin (all sides): {toRem(0)}rem+</span>
        <input type="range" min={0} max={96} defaultValue={0} onChange={(e) => onPatch({ margin: Number(e.target.value) })} aria-label="Margin all sides" className="w-full mt-1" />
      </label>
      <label className="block"><span className={label}>Padding (all sides)</span>
        <input type="range" min={0} max={96} defaultValue={24} onChange={(e) => onPatch({ padding: Number(e.target.value) })} aria-label="Padding all sides" className="w-full mt-1" />
      </label>

      {/* ── Shared look ── */}
      <div className={section}>Look</div>
      <div className="flex items-center justify-between gap-2">
        <span className={label}>Background</span>
        <ColorPickerPopover selectedColor={theme.surface} onSelect={(c) => onPatch({ background: c })} mode="both" label="Background" align="right" width={272} portal>
          <button aria-label="Background" className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ background: colorToCSS(theme.surface) }} />
        </ColorPickerPopover>
      </div>
      <label className="block"><span className={label}>Corner radius</span>
        <input type="range" min={0} max={40} defaultValue={0} onChange={(e) => onPatch({ radius: Number(e.target.value) })} aria-label="Corner radius" className="w-full mt-1" />
      </label>
      <label className="block"><span className={label}>Opacity</span>
        <input type="range" min={0} max={100} defaultValue={100} onChange={(e) => onPatch({ opacity: Number(e.target.value) })} aria-label="Opacity" className="w-full mt-1" />
      </label>
      <label className="block"><span className={label}>Align (cross axis)</span>
        <select defaultValue="stretch" onChange={(e) => onPatch({ align: e.target.value as FlexAlign })} className={inputCls}>
          {["stretch", "start", "center", "end"].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>

      {/* ── Bulk actions ── */}
      <div className={section}>Actions</div>
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onFloatAll} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Layers className="w-4 h-4" /> Float</button>
        <button onClick={onDuplicate} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Copy className="w-4 h-4" /> Duplicate</button>
        <button onClick={onDelete} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"><Trash2 className="w-4 h-4" /> Delete</button>
      </div>
    </div>
  );
}
