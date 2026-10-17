/**
 * BATCH LE-12 · sizes and grids — a proportion for any block (SZ-4), min / max width and height and the bounded column (SZ-3),
 * as many cards as fit (GR-2). The sliders on the scale (SP-4) are guarded in tests/components/shared/Slider.test.tsx.
 * Scenarios: tests/features/components/website/box-builder-sizes.feature.
 */
import { describe, it, expect } from "vitest";
import type { CSSProperties } from "react";
import { createContainer, createElement, makeRowBand, insertBox, normalizeRowBands, markPageGrid, isPageRow, childStyle, containerStyle, rowNarrowsAt, findBox, gridColSizes, gridQueryCss, applyBoxSize, limitCss, ratioCss, imageSizing, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import LAYOUT from "@/config/layout.json";

const text = (id: string, words = "Some words for this column") => createElement("text", { id, text: words });
const col = (id: string, extra: Partial<BoxNode> = {}) => createContainer("column", { id, children: [text(`${id}-t`)], ...extra });
const pageWith = (...kids: BoxNode[]) => { const root = emptyPageRoot(); return markPageGrid(normalizeRowBands(insertBox(root, root.id, 0, makeRowBand(kids)))); };
const stack = createContainer("column", { id: "parent", children: [] });
const row = createContainer("row", { id: "rowp", children: [] });
const sized = (node: BoxNode, parent: BoxNode, s: CSSProperties = {}) => { const out = { ...s }; applyBoxSize(out, node, parent); return out; };
const published = (root: BoxNode) => { const s = siteFromRoot(root); return renderSitePage(s, DEFAULT_THEME, s.pages[0].id); };

describe("SZ-4 · a proportion for any block", () => {
  it("the presets come from config/layout.json and read as CSS ratios; anything else stored is refused (a trust boundary)", () => {
    expect(LAYOUT.sizes.ratios.length).toBeGreaterThanOrEqual(10); // RULE BEST: at least Webflow's presets
    for (const r of LAYOUT.sizes.ratios) expect(ratioCss(r.value)).toBe(r.value);
    expect(ratioCss("5 / 2")).toBe("5 / 2");
    expect(ratioCss("5:2")).toBe("5 / 2");
    for (const bad of ["", "0 / 9", "16 / 0", "wide", "-1 / 2", undefined]) expect(ratioCss(bad)).toBeNull();
  });
  it("a block with a proportion: aspect-ratio, its height given up, never shorter than its words", () => {
    const s = sized(col("a", { ratio: "16 / 9", height: "20rem" }), stack, { height: "20rem", flex: "1 1 auto", minHeight: 0 });
    expect(s.aspectRatio).toBe("16 / 9");
    expect(s.height).toBeUndefined();
    expect(s.minHeight).toBe("auto"); // LE12-5: Chrome resolves min-content to the ratio's own height; auto is content-based
    expect(s.flex).toBe("0 0 auto"); // a shape fills across, never down (css-layout 07, forced rule 2)
  });
  it("LE12-5: rounded corners clip without making it a scroll container (`hidden` would let words spill out of the shape)", () => {
    expect(sized(col("a", { ratio: "2 / 1", radius: 12 }), stack, { overflow: "hidden" }).overflow).toBe("clip");
    expect(sized(col("a", { ratio: "2 / 1", clip: true }), stack, { overflow: "hidden" }).overflow).toBe("hidden"); // Trim to size: cut, as asked
    expect(sized(col("a", { ratio: "2 / 1", maxHeight: "20rem" }), row, {}).minHeight).toBe("auto");
  });
  it("Trim to size keeps its zero floor; a floor the person set stays", () => {
    expect(sized(col("a", { ratio: "1 / 1", clip: true }), stack, { minHeight: 0 }).minHeight).toBe(0);
    expect(sized(col("a", { ratio: "1 / 1", minHeight: 160 }), stack, { minHeight: "10rem" }).minHeight).toBe("10rem");
  });
  it("in a row it sits at its top instead of being stretched to the row's height", () => {
    expect(sized(col("a", { ratio: "1 / 1" }), row, {}).alignSelf).toBe("flex-start");
    expect(sized(col("a", { ratio: "1 / 1", alignSelf: "center" }), row, { alignSelf: "center" }).alignSelf).toBe("center");
  });
  it("a picture takes the proportion through its own sizing, cropped; the page root never", () => {
    expect(imageSizing(createElement("image", { ratio: "4 / 3", imgW: 800, imgH: 200 }))).toEqual({ height: "auto", aspectRatio: "4 / 3" });
    expect(sized(createElement("image", { ratio: "4 / 3" }), stack, {}).aspectRatio).toBeUndefined(); // the picture's box, not its wrapper
    const out: CSSProperties = {}; applyBoxSize(out, col("a", { ratio: "1 / 1" }), null); expect(out).toEqual({});
  });
  it("canvas == export: the published page carries the shape, per screen", () => {
    const root = pageWith(col("a", { ratio: "16 / 9", responsive: { phone: { ratio: "1 / 1" } } }));
    const html = published(root);
    expect(html).toMatch(/aspect-ratio:16 \/ 9/);
    expect(html).toMatch(/aspect-ratio:1 \/ 1/);
  });
});

describe("SZ-3 · min / max width and height", () => {
  it("a limit is a length, typed px made rem; anything else is refused", () => {
    expect(limitCss("40rem")).toBe("40rem");
    expect(limitCss("65ch")).toBe("65ch");
    expect(limitCss("80%")).toBe("80%");
    expect(limitCss("320px")).toBe("20rem");
    for (const bad of ["", "0rem", "-2rem", "wide", "12", undefined]) expect(limitCss(bad)).toBeNull();
  });
  it("max width: never wider than it, nor than its container", () => {
    expect(sized(col("a", { maxWidth: "40rem" }), stack, { maxWidth: "100%" }).maxWidth).toBe("min(100%, 40rem)");
    expect(sized(col("a", { maxWidth: "40rem" }), stack, { maxWidth: "calc(100% - var(--bx-gut))" }).maxWidth).toBe("min(calc(100% - var(--bx-gut)), 40rem)");
  });
  it("min width: never a sideways overflow — never wider than the max it may be", () => {
    expect(sized(col("a", { minWidth: "20rem" }), stack, { maxWidth: "100%" }).minWidth).toBe("min(100%, 20rem)");
    expect(sized(col("a", { minWidth: "20rem", maxWidth: "30rem" }), stack, { maxWidth: "100%" }).minWidth).toBe("min(min(100%, 30rem), 20rem)");
  });
  it("max height caps a stretched block and never cuts its words", () => {
    const s = sized(col("a", { maxHeight: "40rem" }), row, {});
    expect(s.maxHeight).toBe("40rem");
    expect(s.minHeight).toBe("min-content");
  });
  it("max height caps a FLOOR (full screen, a set height) rather than cutting it: the words still grow it", () => {
    const s = sized(col("a", { maxHeight: "40rem" }), stack, { minHeight: "100svh", height: "100%" });
    expect(s.minHeight).toBe("min(100svh, 40rem)");
    expect(s.height).toBe("min(100%, 40rem)");
    expect(s.maxHeight).toBeUndefined();
  });
  it("Trim to size: a max height is a cap and nothing else", () => {
    const s = sized(col("a", { maxHeight: "10rem", clip: true }), row, {});
    expect(s.maxHeight).toBe("10rem");
    expect(s.minHeight).toBeUndefined();
  });
  it("the published page writes the limits on the block", () => {
    const html = published(pageWith(col("a", { maxWidth: "40rem", minWidth: "10rem", maxHeight: "30rem" })));
    expect(html).toContain("max-width:min(");
    expect(html).toMatch(/min-width:min\([^;]*10rem\)/);
    expect(html).toContain("max-height:30rem");
  });
  it("an element (a paragraph) carries its limits and its shape on the published page too", () => {
    const html = published(pageWith(createContainer("column", { id: "a", children: [createElement("text", { id: "p", text: "A quote", maxWidth: "30rem", ratio: "2 / 1" })] })));
    expect(html).toContain("max-width:min(100%, 30rem)");
    expect(html).toContain("aspect-ratio:2 / 1");
  });
});

describe("SZ-3 · AC-30 bounded — a sidebar between two widths", () => {
  it("a block with a min or max width takes its row off the page's lines, like a set width", () => {
    expect(isPageRow(pageWith(col("a", { maxWidth: "18rem" }), col("b")).children![0])).toBe(false);
    expect(isPageRow(pageWith(col("a", { minWidth: "12rem" }), col("b")).children![0])).toBe(false);
    expect(isPageRow(pageWith(col("a"), col("b")).children![0])).toBe(true);
  });
  it("the bounded block shares the row and is held between its limits; the other takes the rest", () => {
    const band = pageWith(col("side", { width: "25%", minWidth: "12rem", maxWidth: "18rem" }), col("main")).children![0];
    const side = childStyle(findBox(band, "side")!, band);
    expect(side.flex).toBe("25 1 0%");
    expect(childStyle(findBox(band, "main")!, band).flex).toBe("75 1 0%");
    const s = { ...side }; applyBoxSize(s, findBox(band, "side")!, band);
    expect(String(s.minWidth)).toContain("12rem");
    expect(String(s.maxWidth)).toContain("18rem");
  });
  it("the fit rule counts the bounded block at its min width: it stacks no later than 12rem + the other's floor", () => {
    const band = pageWith(col("side", { minWidth: "30rem" }), col("main")).children![0];
    const g = rowNarrowsAt(band, true)!;
    expect(g[0].steps[0].below).toBeGreaterThan(30);
  });
  it("a Grid column Between two widths: minmax over its tracks", () => {
    const cell = (id: string) => createContainer("column", { id, colSpan: 1, children: [text(`${id}-t`)] });
    const g = createContainer("row", { id: "g", layout: "grid", columns: 3, gapX: 0, colSizes: ["12rem 18rem", null, null], children: [cell("a"), cell("b"), cell("c")] });
    expect(gridColSizes(g)).toBe("minmax(12rem, 18rem) minmax(0, 1fr) minmax(0, 1fr)");
    const g4 = { ...g, columns: 12, children: g.children!.map((c) => ({ ...c, colSpan: 4 })) };
    expect(gridColSizes(g4)).toMatch(/^minmax\(max\(0px, calc\(12rem - 3 \* .+\)\), max\(0px, calc\(18rem - 3 \* .+\)\)\) 0px 0px 0px /);
  });
});

describe("GR-2 · as many cards across as fit", () => {
  const cards = Array.from({ length: 6 }, (_, i) => createContainer("column", { id: `c${i}`, colSpan: 4, colStart: i === 0 ? 1 : undefined, rowStart: i === 0 ? 1 : undefined, children: [text(`c${i}-t`)] }));
  const grid = createContainer("row", { id: "g", layout: "grid", columns: 12, minCard: "16rem", colSizes: ["20rem", null, null], children: cards });
  it("the template is auto-fit at the card's min width, never wider than the grid, on every screen", () => {
    for (const bp of ["phone", "tabletPortrait", "base", "wide"] as const)
      expect(containerStyle(grid, bp).gridTemplateColumns).toBe("repeat(auto-fit, minmax(min(100%, 16rem), 1fr))");
  });
  it("the cells flow one each: no span, no start, no row; Column widths and the narrowing ladder stand aside", () => {
    const s = childStyle(cards[0], grid, "base");
    expect(s.gridColumn).toBeUndefined();
    expect(s.gridRow).toBeUndefined();
    expect(gridColSizes(grid)).toBeNull();
    expect(gridQueryCss(".g", grid, (id) => `.${id}`, (c) => c)).toBe("");
  });
  it("the default card width is config/layout.json's; a stored value is a trust boundary", () => {
    expect(limitCss(LAYOUT.sizes.autoFitStart)).toBe(LAYOUT.sizes.autoFitStart);
    expect(containerStyle({ ...grid, minCard: "wide" }, "base").gridTemplateColumns).not.toContain("auto-fit");
  });
  it("the published page carries it", () => {
    const root = emptyPageRoot();
    const html = published(insertBox(root, root.id, 0, grid));
    expect(html).toMatch(/repeat\(auto-fit,\s*minmax\(min\(100%,\s*16rem\),\s*1fr\)\)/);
  });
});
