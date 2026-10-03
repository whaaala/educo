import { describe, it, expect } from "vitest";
import { tableGrid, gridForAcross, PICKER_COLUMNS, TWELFTHS_COLUMNS } from "@/lib/box-presets";
import { containerStyle, childStyle, gridNarrowsAt, GRID_MAX, CELL_MIN_REM, HAND_FLOOR_REM } from "@/lib/box-model";

/**
 * THE LAYOUT PICKER OFFERS ANY COUNT OF COLUMNS UP TO TWELVE (L-4, decided by the user 2026-09-29, B).
 *
 * It used to offer 1 · 2 · 3 · 4 · 6 · 12 — only what twelve divides into — so "five across" could not be chosen at
 * all (the sweep's harness had to take six and delete one). Every count is offered now, and every one must give
 * exactly that many EQUAL cells across: a count twelve divides as twelfths (so the finer twelfths stay there), any
 * other as a grid of its own count.
 */
describe("the layout picker: any count up to 12 (L-4)", () => {
  it("offers every count from 1 to 12", () => {
    expect(PICKER_COLUMNS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("the gallery keeps the twelfths it was built on", () => {
    expect(TWELFTHS_COLUMNS).toEqual([1, 2, 3, 4, 6, 12]);
  });

  for (const n of PICKER_COLUMNS) {
    it(`${n} across: ${n} equal cells on the first line, ${n} × rows cells in all`, () => {
      const g = tableGrid(n, 2);
      const cells = g.children ?? [];
      expect(cells).toHaveLength(n * 2);
      const tracks = Number(/repeat\((\d+),/.exec(String(containerStyle(g).gridTemplateColumns))?.[1]);
      expect(tracks).toBe(g.columns);
      // A cell of one track writes no `grid-column` at all — one track is what an unplaced grid item takes.
      const spans = cells.map((c) => Number(/span (\d+)/.exec(String(childStyle(c, g).gridColumn ?? "span 1"))?.[1]));
      expect(new Set(spans).size).toBe(1);                 // equal — never two quietly wider
      expect(spans[0] * n).toBe(tracks);                   // exactly n fill the line
      expect(g.columns).toBe(GRID_MAX % n === 0 ? GRID_MAX : n);
    });
  }

  it("an empty grid of five KEEPS its count like a row of five (L4-o): it steps down only under 5 × the hand floor", () => {
    const n = gridNarrowsAt(tableGrid(5, 1))!;
    expect(n.more?.[0]).toEqual({ track: 3, below: 5 * HAND_FLOOR_REM });    // 5 → 3 + 2, never 4 + 1
    expect(n.two).toBeLessThan(5 * HAND_FLOOR_REM);
    expect(5 * CELL_MIN_REM).toBeGreaterThan(n.more![0].below);             // the old floor hid it below 60rem
  });

  it("clamps what it is given", () => {
    expect(gridForAcross(0)).toEqual({ columns: GRID_MAX, span: GRID_MAX });
    expect(gridForAcross(13)).toEqual({ columns: GRID_MAX, span: 1 });
    expect(gridForAcross(7.4)).toEqual({ columns: 7, span: 1 });
  });
});
