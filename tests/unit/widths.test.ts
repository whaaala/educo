/**
 * BATCH LE-3 · widths — a column of a set width (AC-30) and one content width for the whole site (AC-9).
 * Scenarios: tests/features/components/website/box-builder-widths.feature.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, insertBox, normalizeRowBands, markPageGrid, isPageRow, childStyle, containerStyle, rowNarrowsAt, rowQueryCss, bandClasses, setSectionWidth, sectionWidthOf, findBox, gridColSizes, gridSeenColumns, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot, siteFromRoot, setPageGrid, addPage, setPageRoot, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { CONTENT_WIDTH } from "@/lib/educo-ui/layout";
import LAYOUT from "@/config/layout.json";
import INSPECTOR from "@/config/inspector.json";

const text = (id: string, words = "Some words for this column") => createElement("text", { id, text: words });
const col = (id: string, width?: string) => createContainer("column", { id, width, children: [text(`${id}-t`)] });
/** A row of the page, committed the way the editor commits it. */
const pageWith = (...kids: BoxNode[]) => {
  const root = emptyPageRoot();
  return markPageGrid(normalizeRowBands(insertBox(root, root.id, 0, makeRowBand(kids))));
};
const rowOf = (root: BoxNode) => root.children![0];

describe("AC-30 · a block of a set width on a row of the page", () => {
  it("a row of shares stays on the page's lines; a row holding a set width is drawn as a flex row", () => {
    expect(isPageRow(rowOf(pageWith(col("a", "50%"), col("b", "50%"))))).toBe(true);
    expect(isPageRow(rowOf(pageWith(col("a", "20rem"), col("b"))))).toBe(false);
  });
  it("the set block is exactly its width; every other block shares the REST in its stored proportion", () => {
    const row = rowOf(pageWith(col("side", "20rem"), col("half", "50%"), col("quarter", "25%"), col("auto")));
    const flex = (id: string) => childStyle(findBox(row, id)!, row).flex;
    expect(flex("side")).toBe("0 0 20rem");
    expect(flex("half")).toBe("50 1 0%");
    expect(flex("quarter")).toBe("25 1 0%");
    expect(flex("auto")).toBe("25 1 0%"); // a block with no share takes an equal part of what the shares leave, as on the page's lines
  });
  it("stacks one a line where the shares' floors stop fitting beside the set width — never later than the set width itself", () => {
    const row = rowOf(pageWith(col("side", "20rem"), col("main")));
    const g = rowNarrowsAt(row, true)!;
    expect(g).toHaveLength(1);
    expect(g[0].steps).toHaveLength(1);
    expect(g[0].steps[0].lines).toEqual([1, 1]);
    expect(g[0].steps[0].below).toBeGreaterThan(20);
    const css = rowQueryCss(row, (id) => `.c-${id}`, (c) => c, true);
    expect(css).toMatch(new RegExp(`@container \\(max-width:${(g[0].steps[0].below - 0.01).toFixed(4).replace(/0+$/, "").replace(".", "\\.")}`));
    expect(css).toContain(".c-side{flex:1 1 100% !important");
  });
  it("a typed length is a set width; a share, Fit and Full are not", () => {
    for (const w of ["20rem", "12.5rem", "240px", "15em"]) expect(isPageRow(rowOf(pageWith(col("a", w), col("b"))))).toBe(false);
    for (const w of ["30%", "auto", "fill", undefined]) expect(isPageRow(rowOf(pageWith(col("a", w), col("b"))))).toBe(true);
  });
});

describe("LE3-3 · a Grid's columns are the ones a person SEES (a palette \"3 across\" is 12 tracks of 4)", () => {
  const cell = (id: string) => createContainer("column", { id, colSpan: 4, children: [text(`${id}-t`)] });
  const g12 = (colSizes?: (string | null)[], kids = [cell("a"), cell("b"), cell("c")]) => createContainer("row", { id: "g", layout: "grid", columns: 12, colSizes, gapX: 0, children: kids });
  it("three seen columns of four tracks; a set width is exactly its width over its four tracks", () => {
    expect(gridSeenColumns(g12())).toEqual({ seen: 3, span: 4 });
    // the first column: 20rem less the three gaps inside it, then three 0px tracks; Fit: auto + three 0px; Share: four shares
    expect(containerStyle(g12(["20rem", "fit", null]), "base").gridTemplateColumns).toMatch(
      /^max\(0px, calc\(20rem - 3 \* .+\)\) 0px 0px 0px auto 0px 0px 0px minmax\(0, 1fr\) minmax\(0, 1fr\) minmax\(0, 1fr\) minmax\(0, 1fr\)$/);
  });
  it("an uneven grid (8 + 4) or a cell placed by hand has no column widths — drawn equal", () => {
    const uneven = g12(["20rem"], [{ ...cell("a"), colSpan: 8 }, cell("b")]);
    expect(gridSeenColumns(uneven)).toBeNull();
    expect(containerStyle(uneven, "base").gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    expect(gridSeenColumns(g12(undefined, [{ ...cell("a"), colStart: 5 }, cell("b")]))).toBeNull();
  });
});

describe("AC-30 · a Grid's columns, each its own width", () => {
  const grid = (colSizes?: (string | undefined)[]) => createContainer("row", { id: "g", layout: "grid", columns: 3, colSizes, children: [text("x"), text("y"), text("z")] });
  it("Set · Fit content · Share are drawn as a track each, where the Grid shows all its columns", () => {
    expect(containerStyle(grid(["20rem", "fit", undefined]), "base").gridTemplateColumns).toBe("20rem auto minmax(0, 1fr)");
    expect(containerStyle(grid(), "base").gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
  });
  it("equal columns where it shows fewer (a phone: one)", () => {
    expect(containerStyle(grid(["20rem", "fit", undefined]), "phone").gridTemplateColumns).toBe("repeat(1, minmax(0, 1fr))");
  });
  it("LE3-6: Column widths are written for EVERY screen — set while a phone is edited, they still draw where the Grid shows all its columns", () => {
    expect(INSPECTOR.perScreen.sharedKeys).toContain("colSizes");
  });
  it("a value that is not a width is a share (validated where it is read)", () => {
    expect(gridColSizes(grid(["abc", "-4rem", "0rem"]), "base")).toBeNull();
    expect(containerStyle(grid(["abc", "8rem"]), "base").gridTemplateColumns).toBe("minmax(0, 1fr) 8rem minmax(0, 1fr)");
  });
});

describe("AC-9 · one content width for every page", () => {
  const band = (id: string, sectionWidth?: BoxNode["sectionWidth"]) => ({ ...makeRowBand([col(`${id}-c`)]), id, sectionWidth });
  const site = (): BoxSite => {
    const root = emptyPageRoot(); root.children = [band("b1"), band("b2")];
    let s = siteFromRoot(root);
    const two = emptyPageRoot(); two.children = [band("p2")];
    s = addPage(s, "Page 2", two).site;
    return s;
  };
  it("is read from config/layout.json, validated", () => {
    expect(CONTENT_WIDTH).toEqual(LAYOUT.contentWidth);
    expect(CONTENT_WIDTH.minRem).toBeLessThan(CONTENT_WIDTH.startRem);
    expect(CONTENT_WIDTH.startRem).toBeLessThan(CONTENT_WIDTH.maxRem);
  });
  it("set once, every page carries it — and its root publishes it as the page measure", () => {
    const s = setPageGrid(site(), { contentWidth: 75 });
    for (const p of s.pages) expect(containerStyle(p.root)["--eu-measure" as keyof ReturnType<typeof containerStyle>]).toBe("75rem");
    expect(containerStyle(site().pages[0].root)["--eu-measure" as keyof ReturnType<typeof containerStyle>]).toBeUndefined();
  });
  it("a section with no choice of its own follows it; one set Edge to edge opts out", () => {
    expect(bandClasses(band("x"), true, true)).toContain("eu-band--contained");
    expect(bandClasses(band("x"), true, false)).not.toContain("eu-band--contained");
    expect(bandClasses(band("x", "band"), true, true)).not.toContain("eu-band--contained");
    expect(bandClasses(band("x", "contained"), true, false)).toContain("eu-band--contained");
  });
  it("Edge to edge is stored, so it survives the site width; the Inspector reads what is drawn", () => {
    let s = setPageGrid(site(), { contentWidth: 75 });
    const root = s.pages[0].root;
    expect(sectionWidthOf(root, "b1-c")).toBe("contained");
    const out = setSectionWidth(root, "b1-c", "band");
    expect(findBox(out, "b1")!.sectionWidth).toBe("band");
    expect(sectionWidthOf(out, "b1-c")).toBe("band");
    s = setPageRoot(s, s.pages[0].id, out);
    expect(sectionWidthOf(s.pages[0].root, "b2-c")).toBe("contained");
  });
  it("the published page: every page on the column, and a page added afterwards too", () => {
    let s = setPageGrid(site(), { contentWidth: 75 });
    s = addPage(s, "Page 3", (() => { const r = emptyPageRoot(); r.children = [band("p3")]; return r; })()).site;
    for (const p of s.pages) {
      const html = renderSitePage(s, DEFAULT_THEME, p.id);
      expect(html).toContain("--eu-measure:75rem");
      expect(html).toMatch(/class="[^"]*eu-band--contained/);
    }
  });
  it("a width outside the limits is held to them", () => {
    const s = setPageGrid(site(), { contentWidth: 5000 });
    expect(containerStyle(s.pages[0].root)["--eu-measure" as keyof ReturnType<typeof containerStyle>]).toBe(`${CONTENT_WIDTH.maxRem}rem`);
  });
});
