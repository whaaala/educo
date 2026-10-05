import { describe, it, expect } from "vitest";
import { blockForKind, tableGrid } from "@/lib/box-presets";
import { gridNarrowsAt, gridQueryCss, longestWordRem, createElement, createContainer, rowNarrowsAt, hostsNarrowingGrid, CELL_MIN_REM, HAND_FLOOR_REM, type BoxNode } from "@/lib/box-model";

/**
 * c-8 — THE GRID GIVES UP COLUMNS RATHER THAN BREAK A WORD (decided by the user 2026-09-29, B; L-4).
 *
 * Reproduced through the UI (probe-l4-c8, headed): six palette Stats in a grid, in a 70% main column — at Wide 1920 each
 * cell was 163px and "1,000+" (44 → 61.6px) needed ~200, so the "+" fell onto its own line in the Preview. The grid's
 * narrowing knew only a fixed 12rem cell floor, and nothing about the words in the cell.
 */
const statGrid = (n: number): BoxNode => { const g = tableGrid(n, 1); for (const c of g.children ?? []) c.children = [blockForKind("stat")]; return g; };
const scope = (id: string) => `#${id}`;
const above = (css: string) => `@media (min-width:37.5em){${css}}`;

describe("c-8: a grid narrows by the longest word it holds", () => {
  it("reads the longest word of a cell at the largest size its font reaches", () => {
    expect(longestWordRem(blockForKind("stat"))).toBeCloseTo(6 * 0.6 * 4.4 * 0.875, 3); // "1,000+", 44px heading
    expect(longestWordRem(tableGrid(1, 1).children![0])).toBe(0);                        // an empty cell has no words
  });

  it("six Stats across give up columns as soon as the word no longer fits — and the lines come out even (3 + 3)", () => {
    const n = gridNarrowsAt(statGrid(6))!;
    expect(n.more?.map((m) => m.track)).toEqual([3]);                 // 6 → 3 → 2 → 1, never 5 + 1 (L4-c)
    const steps = [...(n.more ?? []).map((m) => m.below), n.two!, n.one];
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeLessThan(steps[i - 1]); // widest first, then narrower
    // At Wide the main column is ~81rem: below the first step (6 across needs ~90rem) — three across, two even lines…
    expect(n.more![0].below).toBeGreaterThan(81);
    expect(n.two!).toBeLessThan(81);
    // …and three cells of (81 − 2 gaps) / 3 hold the word.
    expect((81 - 2 * 1.4) / 3).toBeGreaterThan(longestWordRem(blockForKind("stat")));
  });

  it("never leaves a cell alone on its line when a count without one exists", () => {
    const orphan = (cells: number, track: number) => cells % track !== 0 && cells % track < track / 2;
    for (const [across, rows] of [[6, 1], [6, 2], [5, 1], [4, 2], [12, 1]]) {
      const g = tableGrid(across, rows); for (const c of g.children ?? []) c.children = [blockForKind("stat")];
      const n = gridNarrowsAt(g)!; const cells = across * rows;
      for (const t of [...(n.more ?? []).map((m) => m.track), ...(n.two ? [2] : [])]) expect(orphan(cells, t), `${cells} cells at ${t}`).toBe(false);
    }
    const g = tableGrid(6, 2); for (const c of g.children ?? []) c.children = [blockForKind("stat")];
    expect(gridNarrowsAt(g)!.more?.[0].track).toBe(4);                // twelve at "five" are 4 × 3
  });

  it("emits the in-between steps as container queries, widest first, each kept off the phone", () => {
    const g = statGrid(6);
    const css = gridQueryCss(scope(g.id), g, scope, above);
    const threes = css.indexOf("repeat(3,"), twos = css.indexOf("repeat(2,"), ones = css.indexOf("repeat(1,");
    expect([threes, twos, ones].every((i) => i >= 0)).toBe(true);
    expect(threes).toBeLessThan(twos); expect(twos).toBeLessThan(ones);
    expect(css).not.toContain("repeat(5,"); expect(css).not.toContain("repeat(4,");
    expect(css.match(/@media/g)).toHaveLength(2); // 3 · 2 across never apply on the phone rung; one across does
  });

  it("a grid of fewer than four whose words fit the floor keeps exactly today's two rules", () => {
    const g = tableGrid(3, 1); for (const c of g.children ?? []) c.children = [createElement("text", { text: "Small words only here", width: "100%" })];
    expect(gridNarrowsAt(g)).toEqual({ two: 3 * CELL_MIN_REM, one: 2 * CELL_MIN_REM });
  });

  it("L4-o: a grid of four or more across keeps its count like a row (#78) — seven icons stay seven on a desktop", () => {
    const g = tableGrid(7, 1); for (const c of g.children ?? []) c.children = [createElement("icon")];
    const n = gridNarrowsAt(g)!;
    expect(n.more?.[0].below).toBeLessThanOrEqual(7 * HAND_FLOOR_REM + 0.0001); // shown at 7 across down to 21rem…
    expect(n.more![0].below).toBeLessThan(60);                                   // …so on a ~73rem desktop column, all seven
    const words = tableGrid(7, 1); for (const c of words.children ?? []) c.children = [blockForKind("stat")];
    expect(gridNarrowsAt(words)!.more![0].below).toBeGreaterThan(60);           // seven "1,000+" still give columns up
  });

  it("the NARROWEST cell that holds words decides: a Stat in a 2-of-12 cell beside a wide one", () => {
    const g = tableGrid(2, 1); g.children![0].colSpan = 2; g.children![1].colSpan = 10;
    g.children![0].children = [blockForKind("stat")];
    const n = gridNarrowsAt(g)!;
    expect(n.two).toBeNull();
    expect(n.one).toBeGreaterThan(longestWordRem(blockForKind("stat")) * 6); // its share is a sixth of the line
  });
});

/**
 * L4-h (decided by the user 2026-10-03: "rows balance too") — a ROW of four Stats in a 70% column wrapped 3 + 1 at Laptop,
 * one Stat alone on its line (L-4's headed pass). A row of words that has to wrap now shares its columns evenly.
 */
const statRow = (n: number): BoxNode => ({ id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
  children: Array.from({ length: n }, (_, i) => createContainer("column", { id: `c${i}`, width: `${+(100 / n).toFixed(2)}%`, children: [blockForKind("stat")] })) } as BoxNode);

describe("L4-h: a row of words wraps into EVEN lines", () => {
  it("four Stats go 4 → 2 + 2 → 1 each — never 3 + 1", () => {
    const [line] = rowNarrowsAt(statRow(4))!;
    expect(line.steps.map((s) => s.lines.join("+"))).toEqual(["2+2", "1+1+1+1"]);
    expect(line.steps[0].below).toBeGreaterThan(line.steps[1].below);
  });
  it("five go 3 + 2, then 2 + 2 + 1, then one each — as even as they can be", () => {
    expect(rowNarrowsAt(statRow(5))![0].steps.map((s) => s.lines.join("+"))).toEqual(["3+2", "2+2+1", "1+1+1+1+1"]);
  });
  it("emits the regrouping as container queries on the row's host, the stacking step outside the phone wrapper", () => {
    const band = statRow(4);
    const css = gridQueryCss("#band", band, (id) => `#${id}`, (c) => `@media (min-width:37.5em){${c}}`);
    expect(css.match(/@container/g)).toHaveLength(2);
    expect(css.match(/@media/g)).toHaveLength(1);             // 2 + 2 is kept off the phone; stacking is the phone's own
    expect(css).toContain("#c0{flex:1 1 calc((100% - 0%) * 0.5");
    expect(hostsNarrowingGrid(createContainer("column", { children: [band] }))).toBe(true);
    // L4-s: the stacking step (one a line, which also applies on the phone) leaves each column's OWN minimum alone — the
    // phone's 100%; a min-content there let a long word at 150% text push a column out of its band
    const stack = css.split("@container").pop()!;
    expect(stack).toContain("flex:1 1 calc((100% - 0%) * 1");
    expect(stack).not.toContain("min-width");
  });
  it("a row that is not words — a table of ticks — is left alone", () => {
    const band = statRow(4); for (const c of band.children!.slice(1)) c.children = [createElement("icon")];
    expect(rowNarrowsAt(band)).toBeNull();
  });
});
