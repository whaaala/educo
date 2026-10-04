"use client";

/**
 * THE PAGE-GRID PANEL (AC-37b, G-2) — the page grid a person can see and set: columns per screen, the row lines the
 * guides draw, the side space and the gap between blocks, for the whole SITE, with "This page uses its own grid" for
 * the one page that needs another (the user, 2026-10-04). Every block keeps its share, so nothing moves or is lost;
 * a whole slider drag is one Undo (`mergeKey`). Plan: docs/web-anatomy/page-grid/plan/page-grid-plan.html.
 */

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { Breakpoint } from "@/lib/box-model";
import { SPACE_GRID, baseUnitParts } from "@/lib/box-model";
import { type PageGridSettings, PAGE_GRID_DEFAULT, PAGE_GRID_LIMITS, columnsAt } from "@/lib/page-grid";
import Slider from "@/components/shared/Slider";
import { CHROME_Z } from "@/lib/educo-ui/stacking";
import { Segmented } from "./ui";

/**
 * WHAT A SPACING VALUE REALLY IS, from a phone to a wide screen (G3c-1). The values are numbers of the page's fluid unit, which
 * doubles from a phone to a wide screen — read as pixels (value / 16) the old default 23 said "1.44rem" while it ran 1 → 2 rem.
 */
const remRange = (v: number) => { const { loRem, hiRem } = baseUnitParts(); const a = +((v / 10) * loRem).toFixed(2), b = +((v / 10) * hiRem).toFixed(2); return a === b ? `${a}rem` : `${a}–${b}rem`; };

const SCREENS: { value: Breakpoint; label: string }[] = [
  { value: "phone", label: "Phone" }, { value: "tabletPortrait", label: "Tablet" }, { value: "tabletLandscape", label: "Laptop" },
  { value: "base", label: "Desktop" }, { value: "wide", label: "Wide" },
];

/** A person's "− 12 +" — a number they can step with the buttons, type, or move with the arrow keys. */
function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const btn = "inline-grid place-items-center w-7 h-7 rounded-lg border border-line text-ink hover:bg-surface-2 disabled:opacity-40";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-ink">{label}</span>
      <span className="inline-flex items-center gap-1">
        <button type="button" className={btn} aria-label={`${label}: one fewer`} disabled={value <= min} onClick={() => onChange(value - 1)}><Minus className="w-3.5 h-3.5" aria-hidden="true" /></button>
        <input type="number" aria-label={label} min={min} max={max} value={value}
          onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= min && n <= max) onChange(n); }}
          className="w-12 text-center text-xs px-1 py-1 rounded-lg border border-line bg-transparent text-ink outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="button" className={btn} aria-label={`${label}: one more`} disabled={value >= max} onClick={() => onChange(value + 1)}><Plus className="w-3.5 h-3.5" aria-hidden="true" /></button>
      </span>
    </div>
  );
}

export default function PageGridPanel({ grid, ownPage, breakpoint, rows, onRows, onChange, onOwnPage, onClose }: {
  grid: PageGridSettings;                 // the grid in force on this page, as stored (the site's, or the page's own)
  ownPage: boolean;                       // this page uses its own grid
  breakpoint: Breakpoint;                 // the screen being edited — the panel opens on it
  rows: boolean; onRows: (on: boolean) => void; // the guides' row lines (a viewing choice, per person)
  onChange: (next: PageGridSettings | undefined, mergeKey?: string) => void; // undefined = the defaults
  onOwnPage: (own: boolean) => void;
  onClose: () => void;
}) {
  const [screen, setScreen] = useState<Breakpoint>(breakpoint);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>("button, input")?.focus(); }, []);

  const cols = columnsAt(grid, screen);
  const isPhone = screen === "phone", isDesktop = screen === "base";
  // Desktop sets the count every larger screen follows; the phone follows HALF of it; any other screen follows the desktop
  // until a count is set for it on purpose.
  const setHere = isDesktop ? grid.columns !== undefined : isPhone ? grid.phoneColumns !== undefined : grid.perRung?.[screen] !== undefined;
  const follows = isDesktop ? "the default" : isPhone ? "half of Desktop" : "Desktop";
  const setCols = (n: number | undefined) => {
    if (isDesktop) return onChange({ ...grid, columns: n }, "pagegrid:columns");
    if (isPhone) return onChange({ ...grid, phoneColumns: n }, "pagegrid:phone");
    const perRung = { ...grid.perRung, [screen]: n };
    if (n === undefined) delete perRung[screen];
    onChange({ ...grid, perRung }, `pagegrid:${screen}`);
  };
  const lim = isPhone ? PAGE_GRID_LIMITS.phoneColumns : PAGE_GRID_LIMITS.columns;
  const side = grid.sideSpace ?? SPACE_GRID.gutter;
  // ACROSS AND DOWN, each its own (G-3b (5), the user 2026-10-04). A site that set G-2's one "Gap between blocks" keeps it as
  // both; moving either slider writes the two explicitly, so the other direction does not move.
  const gaps = [
    { key: "columnGap", label: "Space between columns", value: grid.columnGap ?? grid.blockGap ?? SPACE_GRID.columns, set: grid.columnGap !== undefined || grid.blockGap !== undefined },
    { key: "rowGap", label: "Space between rows", value: grid.rowGap ?? grid.blockGap ?? SPACE_GRID.stack, set: grid.rowGap !== undefined || grid.blockGap !== undefined },
  ] as const;
  const setGap = (key: "columnGap" | "rowGap", n: number | undefined) =>
    onChange({ ...grid, blockGap: undefined, columnGap: grid.columnGap ?? grid.blockGap, rowGap: grid.rowGap ?? grid.blockGap, [key]: n }, `pagegrid:${key}`);
  const link = "self-start text-[0.625rem] text-muted hover:text-ink underline-offset-2 hover:underline disabled:no-underline disabled:cursor-default";

  return (
    <div ref={ref} role="dialog" aria-label="Page grid" onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}
      style={{ zIndex: CHROME_Z.menu }}
      className="absolute top-full right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface text-ink shadow-2xl p-3 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Page grid</h2>
        <span className="text-[0.625rem] text-muted">{ownPage ? "this page only" : "every page of this site"}</span>
      </div>

      <div className="space-y-1.5">
        <Segmented ariaLabel="Screen" full value={screen} onChange={setScreen} options={SCREENS} />
        <Stepper label={`Columns on ${SCREENS.find((s) => s.value === screen)!.label}`} value={cols} min={lim[0]} max={lim[1]} onChange={setCols} />
        <button type="button" className={link} disabled={!setHere} onClick={() => setCols(undefined)}>{setHere ? `Follow ${follows}` : `Follows ${follows}`}</button>
      </div>

      <div className="space-y-1">
        <label className="flex items-center justify-between gap-2 text-xs">
          <span>Row lines in the guides</span>
          <input type="checkbox" checked={rows} onChange={(e) => onRows(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
        </label>
        {rows && <Slider label="Row step" value={grid.rowStepRem ?? PAGE_GRID_DEFAULT.rowStepRem} min={PAGE_GRID_LIMITS.rowStepRem[0]} max={PAGE_GRID_LIMITS.rowStepRem[1]} step={0.25}
          onChange={(n) => onChange({ ...grid, rowStepRem: n }, "pagegrid:rows")} formatValue={(x) => `${x}rem`} />}
      </div>

      <div className="space-y-1">
        <Slider label="Side space (padding)" value={side} min={PAGE_GRID_LIMITS.sideSpace[0]} max={PAGE_GRID_LIMITS.sideSpace[1]}
          onChange={(n) => onChange({ ...grid, sideSpace: n }, "pagegrid:side")} formatValue={(x) => (grid.sideSpace === undefined ? "Default · 1–1.25rem" : remRange(x))} />
        <button type="button" className={link} disabled={grid.sideSpace === undefined} onClick={() => onChange({ ...grid, sideSpace: undefined })}>{grid.sideSpace === undefined ? "At the default" : "Back to default"}</button>
      </div>
      {gaps.map((g) => (
        <div key={g.key} className="space-y-1">
          <Slider label={g.label} value={g.value} min={PAGE_GRID_LIMITS[g.key][0]} max={PAGE_GRID_LIMITS[g.key][1]}
            onChange={(n) => setGap(g.key, n)} formatValue={(x) => (g.set ? remRange(x) : `Default · ${remRange(x)}`)} />
          <button type="button" className={link} disabled={!g.set} aria-label={`${g.label} — ${g.set ? "back to default" : "at the default"}`} onClick={() => setGap(g.key, undefined)}>{g.set ? "Back to default" : "At the default"}</button>
        </div>
      ))}
      <p className="text-[0.625rem] text-muted">Changing a number moves every block with it. Half stays half; nothing is lost, and Undo puts it back. Each block&apos;s own spacing stays in the Inspector.</p>

      <label className="flex items-center justify-between gap-2 text-xs border-t border-line pt-2.5">
        <span>This page uses its own grid</span>
        <input type="checkbox" checked={ownPage} onChange={(e) => onOwnPage(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
      </label>
      <button type="button" onClick={() => onChange(undefined)} className="inline-flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border border-line hover:bg-surface-2">
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reset to default
      </button>
    </div>
  );
}
