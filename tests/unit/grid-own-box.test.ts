import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, normalizeRowBands, gridNarrowsAt, hostsNarrowingGrid, gridQueryCss, treeGridQueryCss, gridLeftoverAt, gridColumnsAt, containerStyle, capturesFixed, gridPlacementAt, CELL_MIN_REM, type BoxNode } from "@/lib/box-model";
import { tableGrid } from "@/lib/box-presets";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * A GRID NARROWS BY ITS OWN BOX (#111) — behaviours in tests/features/components/website/box-builder-columns.feature.
 *
 * Measured on a dressed page: a three-quote grid nested in the middle cell of a three-cell grid drew each quote 85px
 * wide at 768px and broke every word letter by letter, in both engines. The ladder (`gridColumnsAt`) reasons from the
 * screen; this guards the rule that reasons from the box — a container query, emitted once for both engines.
 */
const quoteGrid = (): BoxNode => { const g = tableGrid(3, 1); for (const c of g.children ?? []) c.children = [createElement("text", { text: "“This changed everything for us.”", width: "100%" })]; return g; };
const scope = (id: string) => `.bx-${id}`;
const aboveThePhone = (css: string) => `@media (min-width:37.5em){${css}}`;

describe("a grid narrows by its own box, not only by the screen", () => {
  it("three cells of four: two across below 36rem, one below 24rem — the ladder's own 12rem cell floor", () => {
    const g = quoteGrid();
    expect(gridNarrowsAt(g)).toEqual({ two: 3 * CELL_MIN_REM, one: 2 * CELL_MIN_REM });
    const css = gridQueryCss(scope(g.id), g, scope, aboveThePhone);
    expect(css).toContain(`@container (max-width:${3 * CELL_MIN_REM - 0.01}rem){${scope(g.id)}{grid-template-columns:repeat(2,minmax(0,1fr)) !important}`);
    expect(css).toContain(`@container (max-width:${2 * CELL_MIN_REM - 0.01}rem){${scope(g.id)}{grid-template-columns:repeat(1,minmax(0,1fr)) !important}`);
  });
  it("at two across the cells re-fit: one column each, and the cell ending the short last row fills it", () => {
    const g = quoteGrid(); const [a, b, c] = g.children!;
    const css = gridQueryCss(scope(g.id), g, scope, aboveThePhone);
    const two = css.slice(0, css.indexOf(`max-width:${2 * CELL_MIN_REM - 0.01}rem`));
    expect(two).toContain(`${scope(a.id)}{grid-column:auto !important;grid-row:auto !important}`);
    expect(two).toContain(`${scope(b.id)}{grid-column:auto !important`);
    expect(two).toContain(`${scope(c.id)}{grid-column:span 2 !important`); // the orphan stretches (the same rule the ladder applies)
  });
  it("the two-across rule is wrapped by the engine's 'above the phone' guard; the one-across rule is not", () => {
    const g = quoteGrid();
    const css = gridQueryCss(scope(g.id), g, scope, aboveThePhone);
    expect(css.startsWith("@media (min-width:37.5em){@container")).toBe(true);
    expect(css.indexOf("@media")).toBe(css.lastIndexOf("@media")); // exactly one guard — the one-across rule agrees with every rung
    // …and the canvas at its phone preset leaves the two-across rule out entirely
    const phone = gridQueryCss(scope(g.id), g, scope, () => "");
    expect(phone).not.toContain("repeat(2,");
    expect(phone).toContain("repeat(1,");
  });
  it("an 11 / 1 split is TWO across — by its spans, not by its smallest span — so it narrows only below 24rem", () => {
    const g = tableGrid(2, 1); g.children![0].colSpan = 11; g.children![1].colSpan = 1;
    expect(gridNarrowsAt(g)).toEqual({ two: null, one: 2 * CELL_MIN_REM });
    expect(gridQueryCss("x", g, scope, aboveThePhone)).not.toContain("repeat(2,");
  });
  it("a two-cell grid only ever goes to one; a single cell never narrows", () => {
    expect(gridNarrowsAt(tableGrid(2, 1))).toEqual({ two: null, one: 2 * CELL_MIN_REM });
    expect(gridQueryCss("x", tableGrid(2, 1), scope, aboveThePhone)).not.toContain("repeat(2,");
    expect(gridNarrowsAt(tableGrid(1, 1))).toBeNull();
  });
  it("a count the person set at a rung wins: no query at all", () => {
    const g = quoteGrid(); g.responsive = { tabletPortrait: { columns: 3 } };
    expect(gridNarrowsAt(g)).toBeNull();
    expect(gridQueryCss("x", g, scope, aboveThePhone)).toBe("");
  });
  it("a masonry gallery and a pager keep their tracks", () => {
    const m = quoteGrid(); m.rowFlow = "masonry"; expect(gridNarrowsAt(m)).toBeNull();
    const p = quoteGrid(); p.pager = true; expect(gridNarrowsAt(p)).toBeNull();
  });
  it("the ladder's own placement is unchanged by the refactor", () => {
    const g = quoteGrid(); const c = g.children![0];
    expect(gridPlacementAt(g, c, "base")).toEqual({ track: 12, span: 4, start: null });
    expect(gridPlacementAt(g, c, "phone")).toEqual({ track: 1, span: 1, start: null });
  });
});

describe("the box holding such a grid is its query container — in both engines", () => {
  it("a band around the grid gets container-type: inline-size; a hugging box does not, nor the grid itself", () => {
    const g = quoteGrid();
    const band = makeRowBand([g]);
    expect(hostsNarrowingGrid(band)).toBe(true);
    expect(containerStyle(band).containerType).toBe("inline-size");
    expect(capturesFixed(band)).toBe(false); // a size container leaves a fixed bar on screen in Chromium, Firefox and WebKit (#144)
    const hug = createContainer("column", { width: "auto", children: [g] });
    expect(hostsNarrowingGrid(hug)).toBe(false);
    expect(containerStyle(hug).containerType).toBeUndefined();
    expect(hostsNarrowingGrid(g)).toBe(false);
    const plain = makeRowBand([createElement("text", { text: "words" })]);
    expect(containerStyle(plain).containerType).toBeUndefined();
    expect(capturesFixed(plain)).toBe(false);
  });
  it("the export carries the same rules, after every rung, and marks the host", () => {
    const g = quoteGrid();
    const root = normalizeRowBands(createContainer("column", { id: "page", width: "fill", children: [createContainer("column", { width: "100%", children: [g] })] }));
    const html = renderPageHTML(root, DEFAULT_THEME);
    const style = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g)!.join("");
    expect(style).toContain(`@media (min-width:37.5em){@container (max-width:${3 * CELL_MIN_REM - 0.01}rem){.bx-${g.id}{grid-template-columns:repeat(2,minmax(0,1fr)) !important}`);
    expect(style).toContain(`@container (max-width:${2 * CELL_MIN_REM - 0.01}rem){.bx-${g.id}{grid-template-columns:repeat(1,minmax(0,1fr)) !important}`);
    // the query rules come AFTER the widest rung's media block, so they win every tie
    expect(style.lastIndexOf("@container")).toBeGreaterThan(style.lastIndexOf("@media (min-width:112.5em)"));
    expect(style).toContain("container-type:inline-size");
  });
  it("the canvas's per-tree stylesheet walks every grid, nested ones included", () => {
    const inner = quoteGrid(); const outer = tableGrid(3, 1);
    outer.children![1].children = [makeRowBand([inner])];
    const root = createContainer("column", { width: "fill", children: [makeRowBand([outer])] });
    const css = treeGridQueryCss(root, (id) => `[data-box-id="${id}"]`, (c) => c);
    expect(css).toContain(`[data-box-id="${outer.id}"]{grid-template-columns:repeat(2`);
    expect(css).toContain(`[data-box-id="${inner.id}"]{grid-template-columns:repeat(2`);
    expect(css).toContain(`[data-box-id="${inner.id}"]{grid-template-columns:repeat(1`);
  });
  it("the columns the editor may offer are counted ROW BY ROW — a cell that wraps leaves its hole behind it", () => {
    const gridOf = (...spans: number[]): BoxNode => { const g = tableGrid(spans.length, 1); (g.children ?? []).forEach((c, i) => { c.colSpan = spans[i]; }); return g; };
    // every arrangement, with what is really free at the END of the last row (twelve columns)
    const cases: [number[], number][] = [[[4, 4, 4], 0], [[4, 4], 4], [[1, 3, 8], 0], [[6, 6, 6], 6], [[8, 8], 4], [[8, 8, 4], 0], [[12], 0], [[5], 7], [[7, 6, 6], 0], [[10, 3], 9]];
    for (const [spans, free] of cases) expect(gridLeftoverAt(gridOf(...spans)), `${spans.join(" + ")} of 12`).toBe(free);
    // The arithmetic it replaces, `used % track`, is right only when the cells pack tightly: it says 8 for 8 + 8, where 4
    // are free, and 5 for 7 + 6 + 6, where nothing is free at all — the two sixes fill the second row.
    expect((12 - ((8 + 8) % 12)) % 12).toBe(8);
    expect((12 - ((7 + 6 + 6) % 12)) % 12).toBe(5);
    expect(gridLeftoverAt(createContainer("column", { layout: "grid", columns: 12, children: [] } as Partial<BoxNode>))).toBe(0);
    // WHERE THE LADDER NARROWED THE GRID the last row is always filled (the cell that ends it stretches), whatever the
    // spans were on the desktop — so at every narrowed rung there is nothing to offer, for every arrangement above.
    for (const [spans] of cases) for (const bp of ["tabletPortrait", "phone"] as const) {
      const g = gridOf(...spans);
      if (gridColumnsAt(g, bp) < 12) expect(gridLeftoverAt(g, bp), `${spans.join(" + ")} at ${bp}`).toBe(0);
    }
    expect(gridColumnsAt(gridOf(11, 1), "tabletPortrait"), "the case measured in the browser: 11 + 1 is two across on a tablet").toBe(2);
  });

  it("the editor can add its own rules INSIDE each query — and the published page carries none of them", () => {
    const g = quoteGrid();
    const ghost = (scope: string) => `${scope}>[data-gridghost]{display:none !important}`;
    const canvas = gridQueryCss(scope(g.id), g, scope, aboveThePhone, ghost);
    // once per narrowing (two across, one across), and INSIDE the query: outside it the offer would vanish on a wide grid too
    const [outside, ...queries] = canvas.split("@container");
    expect(queries).toHaveLength(2);
    for (const q of queries) expect(q).toContain(`${scope(g.id)}>[data-gridghost]{display:none !important}`);
    expect(outside).not.toContain("gridghost");
    expect(gridQueryCss(scope(g.id), g, scope, aboveThePhone)).not.toContain("gridghost");
    expect(renderPageHTML(normalizeRowBands(createContainer("column", { width: "fill", children: [g] })), DEFAULT_THEME)).not.toContain("gridghost");
    const root = createContainer("column", { width: "fill", children: [makeRowBand([g])] });
    expect(treeGridQueryCss(root, scope, (c) => c, ghost)).toContain(`${scope(g.id)}>[data-gridghost]{display:none !important}`);
  });
});
