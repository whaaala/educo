"use client";

/**
 * Bulk properties panel — shown when MORE THAN ONE box is selected (via marquee). Any change here is
 * applied to EVERY selected box at once: quick +/- width & height steppers plus a shared-property panel
 * (margin, padding, background, corner radius, opacity, alignment). Duplicate / delete act on the whole
 * selection. Mirrors BoxInspector's look so it feels like the same panel, just multi-target.
 */

import { Minus, Plus, Copy, Trash2, Layers, Group as GroupIcon } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import type { BoxNode, FlexAlign } from "@/lib/box-model";
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const label = "text-[0.6875rem] font-medium text-gray-500 dark:text-gray-400";
const section = "text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400 pt-1";
const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
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

export default function BulkInspector({ count, theme, sample, onStepWidth, onStepHeight, onPatch, onDuplicate, onDelete, onFloatAll, onGroup }: {
  count: number;
  theme: SiteTheme;
  sample?: BoxNode | null;                      // a representative selected box (first) — seeds the sliders' shown values
  onStepWidth: (dir: -1 | 1) => void;
  onStepHeight: (dir: -1 | 1) => void;
  onPatch: (patch: Partial<BoxNode>) => void;   // applied to ALL selected
  onDuplicate: () => void;
  onDelete: () => void;
  onFloatAll: () => void;
  onGroup?: () => void;                          // combine all selected into ONE movable, lockable group
}) {
  const s = sample ?? undefined;
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-indigo-600 dark:text-indigo-300"><Layers className="w-3.5 h-3.5" /> {count} sections selected</div>
      <p className="text-[0.625rem] text-gray-400">Every change below applies to all {count} at once.</p>

      {/* ── Quick steppers (their exact ask: grow/shrink width & height together) ── */}
      <div className={section}>Size</div>
      <Stepper title="Width" onStep={onStepWidth} />
      <Stepper title="Height" onStep={onStepHeight} />

      {/* ── Shared spacing (seeded from the first selected box) ── */}
      <div className={section}>Spacing</div>
      <label className="block"><span className={label}>Outer spacing: {toRem(s?.margin ?? 0)}rem</span>
        <input type="range" min={0} max={96} value={s?.margin ?? 0} onChange={(e) => onPatch({ margin: Number(e.target.value) })} aria-label="Outer spacing" className="w-full mt-1 accent-indigo-600" />
      </label>
      <label className="block"><span className={label}>Inner spacing: {toRem(s?.padding ?? 24)}rem</span>
        <input type="range" min={0} max={96} value={s?.padding ?? 24} onChange={(e) => onPatch({ padding: Number(e.target.value) })} aria-label="Inner spacing" className="w-full mt-1 accent-indigo-600" />
      </label>

      {/* ── Shared look ── */}
      <div className={section}>Look</div>
      <div className="flex items-center justify-between gap-2">
        <span className={label}>Background colour</span>
        <ColorPickerPopover selectedColor={s?.background || theme.surface} onSelect={(c) => onPatch({ background: c })} mode="both" label="Background colour" align="right" width={272} portal>
          <button aria-label="Background colour" className="w-8 h-8 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm" style={{ background: colorToCSS(s?.background || theme.surface) }} />
        </ColorPickerPopover>
      </div>
      <label className="block"><span className={label}>Border: {s?.borderWidth ?? 0}px</span>
        <input type="range" min={0} max={16} value={s?.borderWidth ?? 0} onChange={(e) => onPatch({ borderWidth: Number(e.target.value) })} aria-label="Border" className="w-full mt-1 accent-indigo-600" />
      </label>
      <div className="space-y-1">
        <span className={label}>Shadow</span>
        <div className="inline-flex w-full items-center gap-0.5 rounded-xl bg-gray-100 dark:bg-white/5 p-1">
          {([["none", "None"], ["sm", "Soft"], ["md", "Medium"], ["lg", "Strong"], ["xl", "Bold"]] as const).map(([sh, l]) => <button key={sh} onClick={() => onPatch({ shadow: sh === "none" ? undefined : sh })} className={`flex-1 py-1 text-[0.6875rem] rounded-lg ${(s?.shadow ?? "none") === sh ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"}`}>{l}</button>)}
        </div>
      </div>
      <label className="block"><span className={label}>Rounded corners: {s?.radius ?? 0}px</span>
        <input type="range" min={0} max={64} value={s?.radius ?? 0} onChange={(e) => onPatch({ radius: Number(e.target.value) })} aria-label="Rounded corners" className="w-full mt-1 accent-indigo-600" />
      </label>
      <label className="block"><span className={label}>See-through: {s?.opacity ?? 100}%</span>
        <input type="range" min={0} max={100} value={s?.opacity ?? 100} onChange={(e) => onPatch({ opacity: Number(e.target.value) })} aria-label="See-through" className="w-full mt-1 accent-indigo-600" />
      </label>
      <label className="block"><span className={label}>Line up (across)</span>
        <select value={s?.align ?? "stretch"} onChange={(e) => onPatch({ align: e.target.value as FlexAlign })} aria-label="Line up" className={inputCls}>
          {([["stretch", "Fill"], ["start", "Start"], ["center", "Center"], ["end", "End"]] as const).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>

      {/* ── Bulk actions ── */}
      <div className={section}>Actions</div>
      {onGroup && (
        <button onClick={onGroup} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700" title="Group into one movable, lockable unit (Ctrl+G)"><GroupIcon className="w-4 h-4" /> Group these {count}</button>
      )}
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onFloatAll} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Layers className="w-4 h-4" /> Float</button>
        <button onClick={onDuplicate} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Copy className="w-4 h-4" /> Duplicate</button>
        <button onClick={onDelete} className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"><Trash2 className="w-4 h-4" /> Delete</button>
      </div>
    </div>
  );
}
