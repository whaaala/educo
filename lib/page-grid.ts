/**
 * THE PAGE GRID (AC-37b) — the column maths, pure.
 *
 * Every new page sits on one invisible set of columns: 12 from tablet width up, half of that on a phone, edge to edge.
 * A block's width stays what it always was — a SHARE of its row (`width: "50%"`) — so a column count can change and
 * nothing moves: half is 6 of 12, 3 of 6, 5 of 10. This file turns shares into spans and back, snaps a dragged share to
 * whole or half columns, and names a span for people ("5 of 12 · phone 3 of 6"). The guides (G-2) and the snapping
 * (G-3) are built on it. Research and decisions: docs/web-anatomy/page-grid/04-map.md, docs/TASK_TREE.md AC-37b.
 */
import type { Breakpoint } from "@/lib/box-model";

/** A site's page grid, or a page's own (the user's choice, 2026-10-04: one grid per site, a page may opt out). */
export interface PageGridSettings {
  columns?: number;                                  // tablet portrait and up (default 12)
  phoneColumns?: number;                             // the phone (default half of `columns`)
  perRung?: Partial<Record<Breakpoint, number>>;     // a count set for one screen on purpose
  rowStepRem?: number;                               // the row lines the guides draw (default 1.5); rows follow content
}

export const PAGE_GRID_DEFAULT = { columns: 12, rowStepRem: 1.5 } as const;
/** What the panel allows (plan, 2026-10-04). */
export const PAGE_GRID_LIMITS = { columns: [4, 24], phoneColumns: [2, 12], rowStepRem: [0.5, 3] } as const;

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
