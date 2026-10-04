/**
 * THE PAGE GRID (AC-37b) — the column maths, pure.
 *
 * Every new page sits on one invisible set of columns: 12 from tablet width up, half of that on a phone, edge to edge.
 * A block's width stays what it always was — a SHARE of its row (`width: "50%"`) — so a column count can change and
 * nothing moves: half is 6 of 12, 3 of 6, 5 of 10. This file turns shares into spans and back, snaps a dragged share to
 * whole or half columns, and names a span for people ("5 of 12 · phone 3 of 6"). The guides (G-2) and the snapping
 * (G-3) are built on it. Research and decisions: docs/web-anatomy/page-grid/04-map.md, docs/TASK_TREE.md AC-37b.
 */
import type { Breakpoint, GridSpace } from "@/lib/box-model";
import { oklchToHex, nearestAccessibleColor, contrastRatio } from "@/lib/educo-ui/color";

/** A site's page grid, or a page's own (the user's choice, 2026-10-04: one grid per site, a page may opt out). */
export interface PageGridSettings {
  columns?: number;                                  // tablet portrait and up (default 12)
  phoneColumns?: number;                             // the phone (default half of `columns`)
  perRung?: Partial<Record<Breakpoint, number>>;     // a count set for one screen on purpose
  rowStepRem?: number;                               // the row lines the guides draw (default 1.5); rows follow content
  sideSpace?: number;                                // the sections' side space, in the stored fluid unit (default: SPACE_GRID's)
  blockGap?: number;                                 // the space between blocks, across and down, the same unit (default: SPACE_GRID's)
}

export const PAGE_GRID_DEFAULT = { columns: 12, rowStepRem: 1.5 } as const;
/** What the panel allows (plan, 2026-10-04). */
export const PAGE_GRID_LIMITS = { columns: [4, 24], phoneColumns: [2, 12], rowStepRem: [0.5, 3], sideSpace: [0, 96], blockGap: [0, 64] } as const;

const RUNGS: Breakpoint[] = ["phone", "tabletPortrait", "tabletLandscape", "base", "wide"];
const clamp = (n: number, [lo, hi]: readonly [number, number]) => Math.min(hi, Math.max(lo, Math.round(n)));

/** The grid in force on a page: its own when it has one, else the site's, else the default. */
export function resolvePageGrid(site?: PageGridSettings, page?: PageGridSettings): PageGridSettings {
  return { ...PAGE_GRID_DEFAULT, ...(page ?? site ?? {}) };
}

/** How many columns a screen has. */
export function columnsAt(grid: PageGridSettings, bp: Breakpoint): number {
  const set = grid.perRung?.[bp];
  if (set) return clamp(set, PAGE_GRID_LIMITS.columns);
  const cols = clamp(grid.columns ?? PAGE_GRID_DEFAULT.columns, PAGE_GRID_LIMITS.columns);
  if (bp !== "phone") return cols;
  return clamp(grid.phoneColumns ?? cols / 2, PAGE_GRID_LIMITS.phoneColumns);
}

/** The span a share takes on `cols` columns, on whole columns or half-steps; never less than one step, never more than all. */
export function spanOf(share: number, cols: number, half = false): number {
  const step = half ? 0.5 : 1;
  return Math.min(cols, Math.max(step, Math.round((share * cols) / step) * step));
}

/** The share a dragged one snaps to — a whole (or half) number of columns of `cols`. */
export function snapShare(share: number, cols: number, half = false): number {
  return spanOf(share, cols, half) / cols;
}

/** A span written for people: 4.5 → "4½". */
export function spanText(span: number): string {
  const whole = Math.floor(span);
  return span - whole ? `${whole || ""}½` : `${whole}`;
}

/** "5 of 12 · phone 3 of 6" — what the guides and the drag label show for a share. */
export function spanLabel(share: number, grid: PageGridSettings, bp: Breakpoint = "base", half = false): string {
  const cols = columnsAt(grid, bp), phone = columnsAt(grid, "phone");
  const here = `${spanText(spanOf(share, cols, half))} of ${cols}`;
  return bp === "phone" ? here : `${here} · phone ${spanText(spanOf(share, phone, half))} of ${phone}`;
}

/** The side space and gap a page-grid page's blocks read (`spaceFor`); `undefined` = the page grid's defaults. */
export function gridSpaceOf(grid: PageGridSettings): GridSpace | undefined {
  const out: GridSpace = {};
  if (grid.sideSpace !== undefined) out.gutter = clamp(grid.sideSpace, PAGE_GRID_LIMITS.sideSpace);
  if (grid.blockGap !== undefined) out.gap = clamp(grid.blockGap, PAGE_GRID_LIMITS.blockGap);
  // the rows of the page are drawn on these columns (G-3b), so the page carries them — only when they are not the default
  if (RUNGS.some((bp) => columnsAt(grid, bp) !== columnsAt(PAGE_GRID_DEFAULT, bp))) out.cols = Object.fromEntries(RUNGS.map((bp) => [bp, columnsAt(grid, bp)]));
  return Object.keys(out).length ? out : undefined;
}

/** THE page grid's column template — the one the guides draw now and G-3 emits, so the two can never disagree. */
export function gridTemplate(cols: number): string {
  return `repeat(${cols}, minmax(0, 1fr))`;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/**
 * THE TRACKS A ROW OF THE PAGE IS DRAWN ON (G-3b (1), D5). The template has no gap (the guides draw none: the space between
 * blocks is their own half-gap margins, centred on a line), so the page's columns can be split evenly into any number of
 * tracks without moving a single line. The count is the SAME on every screen — the lines of every screen's column count
 * (`cols`), times the fewest splits that put every block edge (`edges`, shares 0–1 of the line) on a track and let every
 * line of `across` equal blocks share it: 4½ of 12 is 9 of 24, five equal cards are 12 of 60 each. One count on every screen
 * is what lets the fit rule's container queries write a span without knowing which screen they are on.
 */
export function rowTrackCount(cols: number[], edges: number[], across: number[] = []): number {
  const base = Math.min(240, [...cols, ...across].filter((n) => n > 0).reduce(lcm, 1));
  const on = (t: number) => edges.every((e) => Math.abs(e * t - Math.round(e * t)) <= t * 0.0002);
  for (let n = 1; n <= 12; n++) if (on(base * n)) return base * n;
  return base * 12; // ponytail: an edge between every split (a width dragged free with Alt) is drawn on the nearest 1/12 column
}

/** How many whole columns a block MEASURED `width` wide covers, columns being `column` wide (what a person sees). */
export function spanOfWidth(width: number, column: number, cols: number): number {
  return column > 0 ? Math.min(cols, Math.max(1, Math.round(width / column))) : cols;
}

/** The guides' colour: a magenta (the colour design tools use for layout grids) held to ≥ 3:1 against the page's own
 *  background, so the lines show on every website theme (WCAG 1.4.11, non-text contrast). */
export function guideColor(background: string): string {
  return nearestAccessibleColor(oklchToHex({ L: 0.55, C: 0.2, h: 350 }), background, 3);
}

/** Words on a guide-coloured chip ("6 of 12"): white or black, whichever reads at ≥ 4.5:1. */
export function guideInk(guide: string): string {
  return contrastRatio("#ffffff", guide) >= 4.5 ? "#ffffff" : "#000000";
}

/** How many of the drawn columns a block covers: the columns whose MIDDLE lies inside it (G-3 (1)). With the columns edge to
 *  edge and the side space a margin inside the first and last, a block's box never starts exactly on a line — its middles do. */
export function spanOfRect(left: number, right: number, middles: number[]): number {
  return Math.max(1, middles.filter((m) => m > left && m < right).length);
}

/** Where a dragged edge lands (G-3 (2)): `at` px into a line `width` px wide, on the nearest of `cols` lines (half-lines too). */
export function snapEdgePx(at: number, width: number, cols: number, half = false): number {
  const step = width / (half ? cols * 2 : cols);
  return Math.min(width, Math.max(0, Math.round(at / step) * step));
}

/** "Rows: N" (G-3 (4)) as the block's stored minimum height (px, emitted as rem): N row steps — it still grows with its words. */
export const rowsToMinHeight = (rows: number, rowStepRem: number): number | undefined => (rows > 0 ? Math.round(rows * rowStepRem * 16 * 1000) / 1000 : undefined);
/** …and back: how many whole row steps a stored minimum height covers (0 = follows its content). */
export const rowsOf = (minHeight: number | undefined, rowStepRem: number): number => (minHeight ? Math.round(minHeight / (rowStepRem * 16)) : 0);
