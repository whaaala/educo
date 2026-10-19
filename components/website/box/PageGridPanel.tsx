"use client";

/**
 * THE PAGE-GRID PANEL (AC-37b, G-2) — the page grid a person can see and set: columns per screen, the row lines the
 * guides draw, the side space and the gap between blocks, for the whole SITE, with "This page uses its own grid" for
 * the one page that needs another (the user, 2026-10-04). Every block keeps its share, so nothing moves or is lost;
 * a whole slider drag is one Undo (`mergeKey`). Plan: docs/web-anatomy/page-grid/plan/page-grid-plan.html.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { Breakpoint } from "@/lib/box-model";
import { SPACE_GRID, SPACE_NONE, fluidRemRange } from "@/lib/box-model";
import { type PageGridSettings, PAGE_GRID_DEFAULT, PAGE_GRID_LIMITS, columnsAt } from "@/lib/page-grid";
import Slider from "@/components/shared/Slider";
import type { SpaceShadeKind } from "@/components/website/box/BoxCanvas";
import { CHROME_Z } from "@/lib/educo-ui/stacking";
import { CONTENT_WIDTH } from "@/lib/educo-ui/layout";
import { SPACE_STEPS } from "@/lib/educo-ui/tokens";
import INSPECTOR from "@/config/inspector.json";
import { Segmented } from "./ui";

/**
 * WHAT A SPACING VALUE REALLY IS, from a phone to a wide screen (G3c-1). The values are numbers of the page's fluid unit, which
 * doubles from a phone to a wide screen — read as pixels (value / 16) the old default 23 said "1.44rem" while it ran 1 → 2 rem.
 */
const remRange = fluidRemRange; // the engine's one way a label says a fluid value (G3c-10)
const CW = INSPECTOR.widths; // the words (RULE CFG)
const SS = INSPECTOR.sectionSpace; // LE-15i — the words (RULE CFG)

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

export default function PageGridPanel({ grid, bare = false, ownPage, breakpoint, rows, onRows, onChange, onOwnPage, onSpaceFocus, onScreen, onClose }: {
  grid: PageGridSettings;                 // the grid in force on this page, as stored (the site's, or the page's own)
  bare?: boolean;                         // a page made since 2026-10-15: no space until it is set (`SPACE_NONE`)
  ownPage: boolean;                       // this page uses its own grid
  breakpoint: Breakpoint;                 // the screen being edited — the panel opens on it
  rows: boolean; onRows: (on: boolean) => void; // the guides' row lines (a viewing choice, per person)
  onChange: (next: PageGridSettings | undefined, mergeKey?: string) => void; // undefined = the defaults
  onOwnPage: (own: boolean) => void;
  onScreen?: (screen: Breakpoint) => void; // a screen picked here is the screen the canvas shows, so its columns are SEEN (E6-9)
  onSpaceFocus?: (kind: SpaceShadeKind | null) => void; // a space slider held or focused → the canvas shades that space (E6-5)
  onClose: () => void;
}) {
  const [screen, setScreen] = useState<Breakpoint>(breakpoint);
  // …and the other way: the canvas switched to another screen, the panel follows it
  useEffect(() => { setScreen(breakpoint); }, [breakpoint]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>("button, input")?.focus(); }, []);
  /**
   * IT NEVER COVERS THE PAGE IT CHANGES (E6-7, seen in the headed pass for E6-5): hung under its button it lay over the right of the
   * canvas — the right-hand side space and every block near that edge hidden while their slider moved. It sits against the window's
   * right edge instead, over the Inspector column, just under the bar its button is in. Re-placed when the window changes.
   */
  const [top, setTop] = useState<number | null>(null);
  const [shift, setShift] = useState<number | null>(null); // in the More sheet: its left, from its button, so all of it is on screen (E6-8)
  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    // in the More sheet of a phone or tablet it stays in the sheet, which scrolls (pinned to the window it fell off its bottom) —
    // but hung from its button's right it ran off the screen's LEFT edge (−52px on a 375 phone), so it is slid back on
    if (host?.closest('[role="dialog"]')) {
      const h = host.getBoundingClientRect(), w = ref.current!.offsetWidth;
      setShift(Math.min(Math.max(8, h.right - w), window.innerWidth - w - 8) - h.left);
      return;
    }
    const place = () => { const r = host?.getBoundingClientRect(); if (r) setTop(r.bottom + 8); };
    place(); window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);
  /**
   * ESCAPE STILL CLOSES IT WHEN FOCUS HAS FALLEN OUT (G3c-11, seen in the headed pass): "Back to default" disables itself when clicked,
   * the browser drops focus to the page body, and the panel's own Escape (on its element) never heard the key — it stayed open over
   * the canvas, for a keyboard user too (WCAG 2.1.1). Only when focus is on the body, so every other Escape keeps its meaning; one
   * listener for the panel's life, the close held in a ref (rule 2 — a listener re-made each render misses its first event).
   */
  const closeRef = useRef(onClose); closeRef.current = onClose;
  // THE SHADE GOES WHEN YOU MOVE ON (E6-5): the canvas keeps focus where it was when it is clicked, so the slider never blurred and its
  // shade stayed over the page. A press anywhere but on a space slider lets it go; pressing a slider brings its own back on focus.
  const spaceRef = useRef(onSpaceFocus); spaceRef.current = onSpaceFocus;
  useEffect(() => {
    const onDown = (e: PointerEvent) => { if (!(e.target instanceof HTMLInputElement && e.target.type === "range" && ref.current?.contains(e.target))) spaceRef.current?.(null); };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && (!document.activeElement || document.activeElement === document.body)) closeRef.current(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const cols = columnsAt(grid, screen);
  // the page's height in rem, as the canvas draws it now (the guides span the page) — what a number of rows divides
  const [pageRem, setPageRem] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-read after every render: adding rows or blocks changes the page's height; it bails out when unchanged
  useLayoutEffect(() => {
    const g = document.querySelector<HTMLElement>("[data-layout-guides]"); const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const h = g ? Math.round((g.offsetHeight / rem) * 100) / 100 : 0;
    if (h !== pageRem) setPageRem(h);
  });
  const rowStep = grid.rowStepRem ?? PAGE_GRID_DEFAULT.rowStepRem;
  const rowCount = Math.max(1, Math.round(pageRem / rowStep));
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
  const D = bare ? SPACE_NONE : SPACE_GRID; // what an unset value really is on this page
  const side = grid.sideSpace ?? D.gutter;
  // ACROSS AND DOWN, each its own (G-3b (5), the user 2026-10-04). A site that set G-2's one "Gap between blocks" keeps it as
  // both; moving either slider writes the two explicitly, so the other direction does not move.
  const gaps = [
    { key: "columnGap", label: "Space between columns", value: grid.columnGap ?? grid.blockGap ?? D.columns, set: grid.columnGap !== undefined || grid.blockGap !== undefined },
    { key: "rowGap", label: "Space between rows", value: grid.rowGap ?? grid.blockGap ?? D.stack, set: grid.rowGap !== undefined || grid.blockGap !== undefined },
  ] as const;
  const setGap = (key: "columnGap" | "rowGap", n: number | undefined) =>
    onChange({ ...grid, blockGap: undefined, columnGap: grid.columnGap ?? grid.blockGap, rowGap: grid.rowGap ?? grid.blockGap, [key]: n }, `pagegrid:${key}`);
  const link = "self-start text-[0.625rem] text-muted hover:text-ink underline-offset-2 hover:underline disabled:no-underline disabled:cursor-default";

  return (
    <div ref={ref} role="dialog" aria-label="Page grid" onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}
      // LE3-5 (seen on the tablet, 1280 × 800): taller than the screen, its last controls (Content width, its own grid, Reset) were off
      // the bottom with no way to reach them — it stops at the screen's foot and scrolls
      style={top !== null ? { zIndex: CHROME_Z.menu, position: "fixed", top, right: "0.5rem", marginTop: 0, maxHeight: `calc(100dvh - ${top}px - 0.5rem)`, overflowY: "auto" } : shift !== null ? { zIndex: CHROME_Z.menu, left: shift, right: "auto" } : { zIndex: CHROME_Z.menu }}
      className="absolute top-full right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface text-ink shadow-2xl p-3 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Page grid</h2>
        <span className="text-[0.625rem] text-muted">{ownPage ? "this page only" : "every page of this site"}</span>
      </div>

      <div className="space-y-1.5">
        <Segmented ariaLabel="Screen" full value={screen} onChange={(s) => { setScreen(s); onScreen?.(s); }} options={SCREENS} />
        <Stepper label={`Columns on ${SCREENS.find((s) => s.value === screen)!.label}`} value={cols} min={lim[0]} max={lim[1]} onChange={setCols} />
        <button type="button" className={link} disabled={!setHere} onClick={() => setCols(undefined)}>{setHere ? `Follow ${follows}` : `Follows ${follows}`}</button>
      </div>

      <div className="space-y-1">
        <label className="flex items-center justify-between gap-2 text-xs">
          <span>Row lines in the guides</span>
          <input type="checkbox" checked={rows} onChange={(e) => onRows(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
        </label>
        {/* ROWS AS YOU CHOOSE COLUMNS (E6-10, the user 2026-10-15: "how many rows I want… let me see it straight away"). A page's
            height is its content, so a number of rows divides the page as it is NOW into that many — the row height follows; the
            height can be set instead, and the count follows it. Either turns the row lines on, so the change is seen at once. */}
        {pageRem > 0 && <Stepper label="Rows on this page" value={rowCount} min={1} max={Math.max(1, Math.floor(pageRem / PAGE_GRID_LIMITS.rowStepRem[0]))}
          onChange={(n) => { if (!rows) onRows(true); onChange({ ...grid, rowStepRem: Math.round((pageRem / n) * 100) / 100 }, "pagegrid:rows"); }} />}
        <Slider label="Row height" value={rowStep} min={PAGE_GRID_LIMITS.rowStepRem[0]} max={PAGE_GRID_LIMITS.rowStepRem[1]} step={0.25}
          onChange={(n) => { if (!rows) onRows(true); onChange({ ...grid, rowStepRem: n }, "pagegrid:rows"); }} formatValue={(x) => `${x}rem`} />
      </div>

      <div className="space-y-1" onFocus={() => onSpaceFocus?.("side")} onBlur={() => onSpaceFocus?.(null)}>
        <Slider label="Side space (padding)" value={side} min={PAGE_GRID_LIMITS.sideSpace[0]} max={PAGE_GRID_LIMITS.sideSpace[1]} steps={SPACE_STEPS.filter((v) => v <= PAGE_GRID_LIMITS.sideSpace[1])}
          onChange={(n) => onChange({ ...grid, sideSpace: n }, "pagegrid:side")} formatValue={(x) => (grid.sideSpace !== undefined ? remRange(x) : bare ? "Default · 0rem" : "Default · 1–1.25rem")} />
        <button type="button" className={link} disabled={grid.sideSpace === undefined} onClick={() => onChange({ ...grid, sideSpace: undefined })}>{grid.sideSpace === undefined ? "At the default" : "Back to default"}</button>
      </div>
      {/* LE-15i (SG-1 · SG-2, the user 2026-10-19: "One size for all", "Every page, a switch"): the space above and below every
          section, on the scale; unset = each design's own. Same-colour neighbours share it unless turned off (`sectionSpacePad`). */}
      <div className="space-y-1">
        <Slider label={SS.label} value={grid.sectionSpace ?? 0} min={PAGE_GRID_LIMITS.sectionSpace[0]} max={PAGE_GRID_LIMITS.sectionSpace[1]} steps={SPACE_STEPS.filter((v) => v <= PAGE_GRID_LIMITS.sectionSpace[1])}
          onChange={(n) => onChange({ ...grid, sectionSpace: n }, "pagegrid:sections")} formatValue={(x) => (grid.sectionSpace !== undefined ? remRange(x) : SS.default)} />
        <button type="button" className={link} disabled={grid.sectionSpace === undefined} onClick={() => onChange({ ...grid, sectionSpace: undefined }, "pagegrid:sections")}>{grid.sectionSpace === undefined ? SS.atDefault : SS.back}</button>
        <label className="flex items-center justify-between gap-2 text-xs">
          <span>{SS.merge}</span>
          <input type="checkbox" checked={grid.mergeSections !== false} onChange={(e) => onChange({ ...grid, mergeSections: e.target.checked ? undefined : false }, "pagegrid:merge")} className="w-4 h-4 accent-indigo-600" />
        </label>
        <p className="text-[0.625rem] text-muted">{SS.mergeHint}</p>
      </div>
      {gaps.map((g) => (
        <div key={g.key} className="space-y-1" onFocus={() => onSpaceFocus?.(g.key)} onBlur={() => onSpaceFocus?.(null)}>
          <Slider label={g.label} value={g.value} min={PAGE_GRID_LIMITS[g.key][0]} max={PAGE_GRID_LIMITS[g.key][1]} steps={SPACE_STEPS.filter((v) => v <= PAGE_GRID_LIMITS[g.key][1])}
            onChange={(n) => setGap(g.key, n)} formatValue={(x) => (g.set ? remRange(x) : `Default · ${remRange(x)}`)} />
          <button type="button" className={link} disabled={!g.set} aria-label={`${g.label} — ${g.set ? "back to default" : "at the default"}`} onClick={() => setGap(g.key, undefined)}>{g.set ? "Back to default" : "At the default"}</button>
        </div>
      ))}
      {/* AC-9 (BATCH LE-3) · ONE content width for every page: Full width (as before) or a centred width every section sits on — the
          backgrounds still run edge to edge, and a section can still be set Edge to edge in the Inspector. Bounds: config/layout.json. */}
      <div className="space-y-1">
        <span className="text-xs text-ink">{CW.contentWidth}</span>
        <Segmented ariaLabel={CW.contentWidth} full value={grid.contentWidth !== undefined ? "centred" : "full"}
          onChange={(v) => onChange({ ...grid, contentWidth: v === "centred" ? grid.contentWidth ?? CONTENT_WIDTH.startRem : undefined }, "pagegrid:content")}
          options={[{ value: "full", label: CW.contentChoices.full }, { value: "centred", label: CW.contentChoices.centred }]} />
        {grid.contentWidth !== undefined && (
          <Slider label={CW.contentWidth} value={grid.contentWidth} min={CONTENT_WIDTH.minRem} max={CONTENT_WIDTH.maxRem} step={CONTENT_WIDTH.stepRem}
            onChange={(n) => onChange({ ...grid, contentWidth: n }, "pagegrid:content")} formatValue={(x) => `${x}rem`} />
        )}
        <p className="text-[0.625rem] text-muted">{grid.contentWidth !== undefined ? CW.contentHint : CW.contentFullHint}</p>
      </div>
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
