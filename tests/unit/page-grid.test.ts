import { describe, it, expect } from "vitest";
import { type BoxNode, type Breakpoint, SPACE_DEFAULT, SPACE_GRID, spaceDefaults, outerDefaults, gapOf, insertBox, normalizeRowBands, markPageGrid, u, createContainer, makeRowBand, sectionContent, gridBandOwnsGutter, pageBandInset, rowNarrowsAt, rowQueryCss, childStyle, tabletPlaces, rowSide, outerSpaceDefaults, spanAt, setSpan, resolveResponsive, lineUpWithGrid, isPageRow, containerStyle, pageRowCells, pageRowTracks, pageRowSlot, linesAt, setLinesAt, fullWidthAt, updateBoxResponsive, setFreeInset, slideFreeAt, fitStepAt, FRAME_CSS, frameRemAt, frameCss, pageFrameEnds, outerSpaceCSS, paddingCSS, rowSideRemAt } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { emptyPageRoot, siteFromRoot, setPageGrid, applyPageGrid, addPage } from "@/lib/box-site";
import { renderSitePage, SKIP_LINK_CSS } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { pageCheck } from "@/lib/semantics";
import { PAGE_GRID_DEFAULT, columnsAt, spanOf, snapShare, spanLabel, spanText, resolvePageGrid, gridSpaceOf, gridTemplate, spanOfWidth, spanOfRect, snapEdgePx, rowsToMinHeight, rowsOf, rowTrackCount } from "@/lib/page-grid";

/**
 * THE PAGE GRID IN THE ENGINE (AC-37b, BATCH G-1). Scenarios: tests/features/components/website/page-grid.feature.
 * Enumerates the palette (rule 3 / RULE Q): a kind added later is covered the day it appears.
 */
const PRIMITIVES = ["container", "row", "grid", "heading", "text", "button", "list", "image", "video", "divider", "spacer", "icon", "embed", "link"];
const ALL_KINDS = [...PRIMITIVES, ...COMPONENT_CATALOGUE.map((c) => c.name)];
const RUNGS: Breakpoint[] = ["phone", "tabletPortrait", "tabletLandscape", "base", "wide"];

/** Drop `node` on a page the way the editor commits it: insert, band, mark. */
const dropOn = (root: BoxNode, node: BoxNode) => markPageGrid(normalizeRowBands(insertBox(root, root.id, (root.children ?? []).length, node)));
const walk = (n: BoxNode, f: (n: BoxNode) => void) => { f(n); n.children?.forEach((c) => walk(c, f)); };
/** A page saved before the grid: the same root, without the mark. */
const savedRoot = (): BoxNode => { const r = emptyPageRoot(); delete r.pageGrid; return r; };

describe("a new page is a page-grid page; a saved page is left alone", () => {
  it("a fresh page carries the mark", () => expect(emptyPageRoot().pageGrid).toBe(true));

  it.each(ALL_KINDS)("%s dropped on a new page belongs to the page grid, all the way down", (kind) => {
    const page = dropOn(emptyPageRoot(), blockForKind(kind));
    let spaced = 0;
    walk(page, (n) => { if (n !== page && n.spaced) { spaced++; expect(n.onPageGrid, `${kind}: ${n.type}`).toBe(true); } });
    expect(spaced).toBeGreaterThan(0);
  });

  it.each(ALL_KINDS)("%s dropped on a SAVED page keeps the old defaults", (kind) => {
    const page = dropOn(savedRoot(), blockForKind(kind));
    walk(page, (n) => expect(n.onPageGrid).toBeUndefined());
  });

  it("a block pasted from an old page takes the new page's spacing", () => {
    const old = dropOn(savedRoot(), blockForKind("heading"));
    const band = old.children![0];
    const page = dropOn(emptyPageRoot(), band);
    walk(page.children![0], (n) => { if (n.spaced) expect(n.onPageGrid).toBe(true); });
  });

  it("marking is idempotent: a page already marked comes back as the same object", () => {
    const page = dropOn(emptyPageRoot(), blockForKind("text"));
    expect(markPageGrid(page)).toBe(page);
    const saved = savedRoot();
    expect(markPageGrid(saved)).toBe(saved);
  });
});

describe("the page grid's defaults: the side space and the gap, small and never zero", () => {
  const unitRem = { lo: 0.4375, hi: 0.875 }; // the fluid unit's clamp (`baseUnitParts`) at the default base
  it("G-3c: the frame is 1 rem on a 360 phone, ~1.14 rem at 1280, 1.25 rem wide (the user: \"1 rem, growing a little\"); gap ≥ 0.75 rem on a phone", () => {
    const page = emptyPageRoot();
    expect(frameRemAt(page, 22.5)).toBe(1);
    expect(frameRemAt(page, 80)).toBeCloseTo(1.14, 2);
    expect(frameRemAt(page, 120)).toBe(1.25);
    expect(FRAME_CSS).toBe("clamp(1rem, calc(var(--box-u, 0.625rem) * 1.6), 1.25rem)"); // rem with a fluid term (rule 16), never a pixel
    expect(frameRemAt({ ...page, gridSpace: { gutter: 0 } } as BoxNode, 80)).toBe(0); // the site's own value, down to 0
    expect((SPACE_GRID.columns / 10) * unitRem.lo).toBeGreaterThanOrEqual(0.74);
    expect(SPACE_GRID.gutter).toBeLessThan(SPACE_DEFAULT.gutter); // "not too much"
  });

  it.each(["heading", "text", "list", "container"])("a %s section on a page-grid page reads the page grid's side space", (kind) => {
    const n = { ...blockForKind(kind), onPageGrid: true } as BoxNode;
    expect(spaceDefaults(n, true).pad[1]).toBe(SPACE_GRID.gutter);
    expect(spaceDefaults(blockForKind(kind), true).pad[1]).toBe(SPACE_DEFAULT.gutter); // a saved block: unchanged
  });

  it("a component on the page keeps the new side space OUTSIDE its box", () => {
    const card = { ...blockForKind("card"), onPageGrid: true } as BoxNode;
    expect(outerDefaults(card, "page")[1]).toBe(SPACE_GRID.gutter);
    expect(outerDefaults(blockForKind("card"), "page")[1]).toBe(SPACE_DEFAULT.gutter);
  });

  it("a row of blocks on a page-grid page is spaced by the page grid's gap", () => {
    const page = dropOn(emptyPageRoot(), blockForKind("row"));
    const row = page.children![0].children![0];
    expect(gapOf(row).x).toBe(SPACE_GRID.columns);
  });

  it("the published page writes the new side space for a page-grid page and the old one for a saved page", () => {
    const html = (root: BoxNode) => { const site = siteFromRoot(root); return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }); };
    expect(html(dropOn(emptyPageRoot(), blockForKind("heading")))).toContain(FRAME_CSS);
    const saved = html(dropOn(savedRoot(), blockForKind("heading")));
    expect(saved).toContain(u(SPACE_DEFAULT.gutter));
    expect(saved).not.toContain(FRAME_CSS);
  });
});

describe("the column maths (lib/page-grid.ts)", () => {
  it("columns per screen: 6 on a phone, 12 elsewhere; half of any count on the phone", () => {
    const g = resolvePageGrid();
    expect(RUNGS.map((bp) => columnsAt(g, bp))).toEqual([6, 12, 12, 12, 12]);
    expect(columnsAt({ columns: 16 }, "phone")).toBe(8);
    expect(columnsAt({ columns: 10 }, "phone")).toBe(5);
    expect(columnsAt({ columns: 12, perRung: { tabletPortrait: 8 } }, "tabletPortrait")).toBe(8);
    expect(columnsAt({ columns: 99 }, "base")).toBe(24);
    expect(columnsAt({ columns: 4 }, "phone")).toBe(2);
  });

  it("a share keeps its meaning on every screen and any count", () => {
    expect(spanOf(0.5, 12)).toBe(6);
    expect(spanOf(0.5, 6)).toBe(3);
    expect(spanOf(0.5, 10)).toBe(5);
    expect(spanOf(1 / 3, 12)).toBe(4);
  });

  it("snapping: whole columns by default, half-steps when asked, never 0, never more than all", () => {
    expect(spanOf(0.413, 12)).toBe(5);
    expect(spanOf(0.413, 12, true)).toBe(5);
    expect(spanOf(0.374, 12, true)).toBe(4.5);
    expect(spanOf(0.374, 12)).toBe(4);
    expect(spanOf(0.001, 12)).toBe(1);
    expect(spanOf(0.001, 12, true)).toBe(0.5);
    expect(spanOf(1.2, 12)).toBe(12);
    expect(snapShare(0.413, 12)).toBeCloseTo(5 / 12, 10);
  });

  it("every span round-trips (span → share → span) on every count and screen, whole and half", () => {
    for (let cols = 4; cols <= 24; cols++) for (const bp of RUNGS) {
      const c = columnsAt({ columns: cols }, bp);
      for (let k = 0.5; k <= c; k += 0.5) {
        expect(spanOf(k / c, c, true), `${k} of ${c}`).toBe(k);
        if (Number.isInteger(k)) expect(spanOf(k / c, c), `${k} of ${c}`).toBe(k);
      }
    }
  });

  it("names a span for people", () => {
    expect(spanText(4.5)).toBe("4½");
    expect(spanText(0.5)).toBe("½");
    expect(spanText(5)).toBe("5");
    expect(spanLabel(5 / 12, resolvePageGrid())).toBe("5 of 12 · phone 3 of 6");
    expect(spanLabel(0.5, resolvePageGrid(), "phone")).toBe("3 of 6");
  });

  it("one grid per site; a page that uses its own grid ignores the site's", () => {
    expect(resolvePageGrid()).toEqual(PAGE_GRID_DEFAULT);
    expect(columnsAt(resolvePageGrid({ columns: 12 }), "base")).toBe(12);
    expect(columnsAt(resolvePageGrid({ columns: 12 }, { columns: 16 }), "base")).toBe(16);
    expect(resolvePageGrid({ columns: 12, rowStepRem: 2 }, { columns: 16 }).rowStepRem).toBe(PAGE_GRID_DEFAULT.rowStepRem);
  });
});

describe("a right-to-left page does not scroll sideways (G-1 #4, found in the HEADED UAT)", () => {
  it("the skip link waits off the START side by a logical inset, never a physical left", () => {
    expect(SKIP_LINK_CSS).toContain("inset-inline-start:-999rem");
    expect(SKIP_LINK_CSS).not.toMatch(/(^|[{;])left:/);
  });
});

describe("columns side by side sit one gap apart; the page's edges keep the side space (G-1 #6, seen in the HEADED UAT)", () => {
  const rowOf = (marked: boolean, n: number) => {
    const cols = Array.from({ length: n }, () => createContainer("column", { children: [blockForKind("text")] }));
    const root = { ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode; if (!marked) delete root.pageGrid;
    const page = markPageGrid(normalizeRowBands(root)); const band = page.children![0];
    return { band, cols: band.children!, flag: (c: BoxNode) => sectionContent(c, false, true, band) };
  };

  it.each([2, 3, 4])("a page-grid row of %i: the page's edges keep the side space (on the outer blocks, G-3b), its columns none inside", (n) => {
    const { band, cols, flag } = rowOf(true, n);
    expect(gridBandOwnsGutter(band)).toBe(true);
    expect(pageBandInset(band, true)).toEqual({}); // G-3b: the row is the page's width; the side space is the outer blocks' margin
    expect(childStyle(cols[0], band).marginLeft).toBe(`calc(${FRAME_CSS})`);
    expect(childStyle(cols[n - 1], band).marginRight).toBe(`calc(${FRAME_CSS})`);
    for (const c of cols) { expect(flag(c)).toBe("gridBand"); const pad = spaceDefaults(c, flag(c)).pad; expect([pad[1], pad[3]]).toEqual([0, 0]); expect(pad[0]).toBe(SPACE_GRID.section); }
  });

  it("a page-grid row of ONE section keeps the side space on the section, so a coloured section still reaches the edge", () => {
    const { band, cols, flag } = rowOf(true, 1);
    expect(gridBandOwnsGutter(band)).toBe(false);
    expect(flag(cols[0])).toBe(true);
    expect(spaceDefaults(cols[0], flag(cols[0])).pad[1]).toBe(SPACE_GRID.gutter);
  });

  it("a SAVED page's row of 3 is unchanged: each section keeps its own side space", () => {
    const { band, cols, flag } = rowOf(false, 3);
    expect(gridBandOwnsGutter(band)).toBe(false);
    expect(pageBandInset(band, true)).toEqual({});
    for (const c of cols) expect(spaceDefaults(c, flag(c)).pad[1]).toBe(SPACE_DEFAULT.gutter);
  });

  it("a coloured column keeps its inner padding, so its words never touch its own edge", () => {
    const { cols } = rowOf(true, 2);
    const painted = { ...cols[0], background: "#eee" } as BoxNode;
    expect(spaceDefaults(painted, "gridBand").pad[1]).toBe(SPACE_GRID.inner);
  });
});

describe("the fit rule on a page-grid row: only EQUAL lines, on every rung, the phone too (G-1 #12 / #13)", () => {
  const rowOfStacks = (marked: boolean, n: number, kind = "card") => {
    const cols = Array.from({ length: n }, () => createContainer("column", { width: `${100 / n}%`, children: [blockForKind(kind)] }));
    const root = { ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode; if (!marked) delete root.pageGrid;
    return markPageGrid(normalizeRowBands(root)).children![0];
  };
  const counts = (band: BoxNode) => (rowNarrowsAt(band)?.[0].steps ?? []).map((s) => s.lines.join("+"));

  it.each([[3, ["1+1+1"]], [4, ["2+2", "1+1+1+1"]], [5, ["1+1+1+1+1"]], [6, ["3+3", "2+2+2", "1+1+1+1+1+1"]]] as const)(
    "a page-grid row of %i steps only through equal lines", (n, want) => expect(counts(rowOfStacks(true, n))).toEqual(want));

  it("a SAVED row of 3 keeps L-4's balanced 2 + 1 (pages already saved are untouched)", () => {
    expect(counts(rowOfStacks(false, 3))).toContain("2+1");
  });

  it("each step fires no later than the browser would wrap the line: a row of 3 sections measures their readable floor", () => {
    // three sections (not a "many columns" line, which L-4 floors at 3rem) are each held to 14rem on screen, so the line
    // must give way to one per line before 3 × 14rem — the browser would otherwise wrap it 2 + 1 first
    const g = rowNarrowsAt(rowOfStacks(true, 3))![0].steps, saved = rowNarrowsAt(rowOfStacks(false, 3))![0].steps;
    expect(g[0].below).toBeGreaterThanOrEqual(3 * 14);
    expect(g[0].below).toBeGreaterThan(saved[0].below); // the words alone said less
    const four = rowNarrowsAt(rowOfStacks(true, 4))![0].steps;
    expect(four[0].below).toBeGreaterThan(four[1].below);
  });

  it("the phone follows the same steps: no column is forced to the whole line, and the steps are not held back to 600px+", () => {
    const band = rowOfStacks(true, 4);
    for (const c of band.children!) expect(String(childStyle(c, band, "phone").minWidth)).not.toMatch(/100%/);
    let wrapped = 0; rowQueryCss(band, (id) => `.x-${id}`, (css) => { wrapped++; return css; });
    expect(wrapped).toBe(0);
    const saved = rowOfStacks(false, 4);
    expect(String(childStyle(saved.children![0], saved, "phone").minWidth)).toMatch(/100%/); // the whole line, less the gutter
  });

  it("the tablet's own at-most-three rule steps aside on a page-grid row", () => {
    expect(tabletPlaces(rowOfStacks(true, 5), "tabletPortrait")).toBeNull();
    expect(tabletPlaces(rowOfStacks(false, 5), "tabletPortrait")).not.toBeNull();
  });
});

describe("words are measured at the size they really have on that screen (G-1 #14, seen at 360 in the HEADED UAT)", () => {
  const steps = (marked: boolean) => {
    const cols = Array.from({ length: 4 }, () => createContainer("column", { width: "25%", children: [blockForKind("stat")] }));
    const root = { ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode; if (!marked) delete root.pageGrid;
    return rowNarrowsAt(markPageGrid(normalizeRowBands(root)).children![0])![0].steps;
  };
  const PHONE_LINE_REM = (360 - 2 * 16) / 16; // a 360 phone, less the page grid's side space
  it("four Stats on a page-grid row stay two across on a 360 phone", () => {
    const one = steps(true).find((s) => s.lines.length === 4)!;
    expect(one.below).toBeLessThan(PHONE_LINE_REM);
  });
  it("a saved page keeps L-4's ceiling estimate (stacks them there, as it always did)", () => {
    expect(steps(false).find((s) => s.lines.length === 4)!.below).toBeGreaterThan(PHONE_LINE_REM);
  });
});

describe("the steps count everything a column is held to on screen (G-1 #15 / #16, measured in the Preview)", () => {
  const band = (statPad?: number) => {
    const cols = Array.from({ length: 4 }, () => { const st = blockForKind("stat") as BoxNode; if (statPad !== undefined) st.padding = statPad; return createContainer("column", { width: "25%", children: [st] }); });
    const root = { ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode;
    return markPageGrid(normalizeRowBands(root)).children![0];
  };
  const twoAcross = (b: BoxNode, onPage = false) => rowNarrowsAt(b, onPage)![0].steps.find((s) => s.lines.length === 2)!.below;
  it("the space around the words: a Stat's own padding moves the step out (it wrapped 3 + 1 at 600px without it)", () => {
    expect(twoAcross(band())).toBeGreaterThan(twoAcross(band(0)));
  });
  it("a row on the page is measured by the page, so it carries the page's side space twice", () => {
    expect(twoAcross(band(), true)).toBeGreaterThan(twoAcross(band(), false));
  });
});

describe("G-2 · the site's side space and gap, set in the page-grid panel", () => {
  const pageWith = (...kinds: string[]) => kinds.reduce((r, k) => dropOn(r, blockForKind(k)), emptyPageRoot());
  const html = (site: ReturnType<typeof siteFromRoot>, id = site.homeId) => renderSitePage(site, DEFAULT_THEME, id, { inlineShared: true });
  const spacedOf = (root: BoxNode) => { const out: BoxNode[] = []; walk(root, (n) => { if (n !== root && n.spaced) out.push(n); }); return out; };

  it("the defaults change nothing: a site with no settings comes back as the same object", () => {
    const site = siteFromRoot(pageWith("heading", "row", "card"));
    expect(applyPageGrid(site)).toBe(site);
    expect(setPageGrid(site, undefined).pages[0].root).toBe(site.pages[0].root);
  });

  it.each(ALL_KINDS)("%s: the side space and gap set for the site reach every block, and Reset puts the defaults back", (kind) => {
    const site = siteFromRoot(pageWith(kind));
    const set = setPageGrid(site, { sideSpace: 0, blockGap: 40 });
    for (const n of spacedOf(set.pages[0].root)) expect(n.gridSpace, n.type).toEqual({ gutter: 0, gap: 40 });
    const reset = setPageGrid(set, undefined);
    for (const n of spacedOf(reset.pages[0].root)) expect(n.gridSpace, n.type).toBeUndefined();
    expect(JSON.stringify(reset.pages[0].root)).toBe(JSON.stringify(site.pages[0].root)); // byte-identical, nothing lost
  });

  it("the published page writes the site's side space, and the canvas reads the same number", () => {
    const site = setPageGrid(siteFromRoot(pageWith("heading")), { sideSpace: 48 });
    expect(html(site)).toContain(u(48));
    expect(html(site)).not.toContain(FRAME_CSS);
    const heading = spacedOf(site.pages[0].root).find((n) => !n.rowBand)!;
    expect(spaceDefaults(heading, true).pad[1]).toBe(48);
  });

  it("side space 0: words start at the page edge (a person's choice, down to zero)", () => {
    const site = setPageGrid(siteFromRoot(pageWith("heading")), { sideSpace: 0 });
    const heading = spacedOf(site.pages[0].root).find((n) => !n.rowBand)!;
    expect(spaceDefaults(heading, true).pad[1]).toBe(0);
  });

  it("the gap between blocks is the site's, across and down", () => {
    const site = setPageGrid(siteFromRoot(pageWith("row")), { blockGap: 0 });
    const row = site.pages[0].root.children![0].children![0];
    expect(gapOf(row)).toEqual({ x: 0, y: 0 });
  });

  it("a block dropped AFTER the setting takes it too (the root keeps it)", () => {
    const site = setPageGrid(siteFromRoot(pageWith("heading")), { sideSpace: 8 });
    const later = dropOn(site.pages[0].root, blockForKind("text"));
    for (const n of spacedOf(later)) expect(n.gridSpace).toEqual({ gutter: 8 });
  });

  it("a page saved before the grid is left exactly as it was", () => {
    const old = dropOn(savedRoot(), blockForKind("heading"));
    const site = siteFromRoot(old);
    expect(setPageGrid(site, { sideSpace: 0, blockGap: 0 }).pages[0].root).toBe(old);
  });

  it("a page with its own grid keeps its own space; turning it off returns it to the site's", () => {
    let site = siteFromRoot(pageWith("heading"));
    site = addPage(site, "About", pageWith("text")).site;
    const about = site.pages[1].id;
    site = setPageGrid(site, { sideSpace: 0 });
    site = setPageGrid(site, { columns: 16, sideSpace: 64 }, about);
    expect(site.pages[0].root.gridSpace).toEqual({ gutter: 0 });
    expect(site.pages[1].root.gridSpace).toEqual({ gutter: 64, cols: { phone: 8, tabletPortrait: 16, tabletLandscape: 16, base: 16, wide: 16 } }); // G-3b: its rows are drawn on its own columns
    site = setPageGrid(site, undefined, about);
    expect(site.pages[1].root.gridSpace).toEqual({ gutter: 0 });
  });

  it("values are held to the panel's ranges", () => {
    expect(gridSpaceOf({ sideSpace: -5, blockGap: 999 })).toEqual({ gutter: 0, gap: 64 });
    expect(gridSpaceOf({ columns: 12 })).toBeUndefined(); // the default columns are not carried
    expect(gridSpaceOf({ columns: 99 })?.cols?.base).toBe(24);
  });
});

describe("G-2 · the one template and the measured span", () => {
  it("the guides and the page use one template", () => {
    expect(gridTemplate(12)).toBe("repeat(12, minmax(0, 1fr))");
  });
  it.each([[600, 100, 12, 6], [590, 100, 12, 6], [1300, 100, 12, 12], [10, 100, 12, 1], [330, 55, 6, 6], [160, 55, 6, 3]])(
    "a block %ipx wide on %ipx columns of %i covers %i", (w, col, cols, span) => expect(spanOfWidth(w, col, cols)).toBe(span));
});

describe("G-2 · the grid is stored tidy", () => {
  it("unset fields are dropped, and a grid with nothing set is no grid at all (the defaults)", () => {
    const site = siteFromRoot(emptyPageRoot());
    expect(setPageGrid(site, { columns: 10, phoneColumns: undefined, perRung: { wide: undefined } }).pageGrid).toEqual({ columns: 10 });
    expect(setPageGrid(site, { columns: undefined, perRung: {} }).pageGrid).toBeUndefined();
  });
});

describe("G-2 · a page's own grid", () => {
  it("is kept even when it holds only the defaults, and then ignores the site's", () => {
    let site = setPageGrid(siteFromRoot(emptyPageRoot()), { columns: 10 });
    site = setPageGrid(site, {}, site.homeId);
    expect(site.pages[0].grid).toEqual({});
    expect(columnsAt(resolvePageGrid(site.pageGrid, site.pages[0].grid), "base")).toBe(12);
    expect(setPageGrid(site, undefined, site.homeId).pages[0].grid).toBeUndefined();
  });
});

describe("G-3 (1) · edge to edge: the first and last block own the row's outer sides", () => {
  const rowOf = (n: number, edit?: (cols: BoxNode[]) => void) => {
    const cols = Array.from({ length: n }, () => createContainer("column", { children: [blockForKind("text")] }));
    edit?.(cols);
    const page = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
    return { page, band: page.children![0] };
  };

  it.each([2, 3, 4])("row of %i, nothing set: both sides are the site's side space (unchanged from G-1)", (n) => {
    const { band } = rowOf(n);
    expect([rowSide(band, "left"), rowSide(band, "right")]).toEqual([SPACE_GRID.gutter, SPACE_GRID.gutter]);
    expect(childStyle(band.children![0], band).marginLeft).toBe(`calc(${FRAME_CSS})`); // G-3b: on the blocks, not the row
    expect(childStyle(band.children![n - 1], band).marginRight).toBe(`calc(${FRAME_CSS})`);
  });

  it.each([0, 8, 48])("the FIRST block's left margin %i is the row's left side; the right stays", (v) => {
    const { band } = rowOf(3, (c) => { c[0].marginLeft = v; });
    expect(childStyle(band.children![0], band).marginLeft).toBe(`calc(${u(v)})`); // its own margin IS the side: never applied twice (G3-1)
    expect(childStyle(band.children![2], band).marginRight).toBe(`calc(${FRAME_CSS})`);
  });

  it("the LAST block's right margin is the row's right side; a middle block's margins stay its own", () => {
    const { band } = rowOf(3, (c) => { c[2].marginRight = 0; c[1].marginLeft = 32; });
    expect(childStyle(band.children![2], band).marginRight).toBe(`calc(${u(0)})`);
    expect(childStyle(band.children![1], band).marginLeft).toBe(`calc(${FRAME_CSS} * 0.6667 + var(--bx-gut) * 0.3333 + ${u(32)})`); // L + (G − L − R) / 3 + its own, R = 0 (G-3c: the frame as CSS)
  });

  it("the Inspector's default for the first / last block names the side it really has", () => {
    const { page, band } = rowOf(3); const [a, b, c] = band.children!;
    expect(outerSpaceDefaults(page, a.id)[3]).toBe(SPACE_GRID.gutter);
    expect(outerSpaceDefaults(page, c.id)[1]).toBe(SPACE_GRID.gutter);
    expect([outerSpaceDefaults(page, b.id)[1], outerSpaceDefaults(page, b.id)[3]]).toEqual([0, 0]);
  });

  it("the published page writes the row's left side from the first block", () => {
    const { page } = rowOf(2, (c) => { c[0].marginLeft = 0; });
    const site = siteFromRoot(page); const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toMatch(/margin-left:\s*calc\(calc\(var\(--box-u, 0\.625rem\) \* 0\)\)/);
  });

  it("the span counts the columns whose middle is inside the block", () => {
    const mids = Array.from({ length: 12 }, (_, i) => 50 + i * 100); // a 1200px page, columns edge to edge
    expect(spanOfRect(23, 600 - 8, mids)).toBe(6);
    expect(spanOfRect(23, 400 - 8, mids)).toBe(4);
    expect(spanOfRect(0, 1200, mids)).toBe(12);
    expect(spanOfRect(30, 40, mids)).toBe(1);
  });
});

describe("G-3 (2) · a dragged edge snaps to the page grid's lines", () => {
  it.each([[495, 1200, 12, false, 500], [449, 1200, 12, false, 400], [449, 1200, 12, true, 450], [530, 1200, 12, true, 550], [1250, 1200, 12, false, 1200], [-30, 1200, 12, false, 0], [170, 360, 6, false, 180]])(
    "%ipx on a %ipx line of %i columns (half %s) → %ipx", (at, w, cols, half, want) => expect(snapEdgePx(at as number, w as number, cols as number, half as boolean)).toBeCloseTo(want as number, 6));
});

describe("G-3 (3) · a column's span, set by number or Alt ← / →", () => {
  const rowOf = (widths: string[]) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const ids = (r: BoxNode) => r.children![0].children!.map((c) => c.id);
  const w = (r: BoxNode, i: number, bp: Breakpoint = "base") => widthPctOf(r, ids(r)[i], bp);
  const widthPctOf = (r: BoxNode, id: string, bp: Breakpoint) => parseFloat(resolveResponsive(r.children![0].children!.find((c) => c.id === id)!, bp).width!);

  it("two halves: 6 → 7 of 12, the neighbour gives exactly one column", () => {
    const r = rowOf(["50%", "50%"]); const [a] = ids(r);
    expect(spanAt(r, a, 12)).toBe(6);
    const n = setSpan(r, a, 7, 12);
    expect([w(n, 0), w(n, 1)]).toEqual([58.33, 41.67]);
    expect(spanAt(n, a, 12)).toBe(7);
  });

  it("the LAST block takes from the one before it", () => {
    const r = rowOf(["50%", "50%"]); const b = ids(r)[1];
    const n = setSpan(r, b, 4, 12);
    expect([w(n, 0), w(n, 1)]).toEqual([66.67, 33.33]);
  });

  it("the partner never goes below one column: the span stops there (rule 19)", () => {
    const r = rowOf(["50%", "50%"]); const [a] = ids(r);
    const n = setSpan(r, a, 12, 12);
    expect(spanAt(n, a, 12)).toBe(11);
    expect(Math.round((w(n, 1) / 100) * 12)).toBe(1);
  });

  it("half-lines: 6 → 6½", () => {
    const r = rowOf(["50%", "50%"]); const [a] = ids(r);
    expect(spanAt(setSpan(r, a, 6.5, 12), a, 12)).toBe(6.5);
  });

  it("on the phone it writes the phone's own slot; the desktop is untouched", () => {
    const r = rowOf(["50%", "50%"]); const [a] = ids(r);
    const n = setSpan(r, a, 4, 6, "phone");
    expect(spanAt(n, a, 6, "phone")).toBe(4);
    expect(spanAt(n, a, 12, "base")).toBe(6);
  });

  it("a block that is not a column of a page row has no span (and nothing changes)", () => {
    const r = rowOf(["50%", "50%"]);
    expect(spanAt(r, r.children![0].id, 12)).toBeNull();
    const one = rowOf(["100%"]);
    expect(spanAt(one, ids(one)[0], 12)).toBeNull();
    expect(setSpan(one, ids(one)[0], 6, 12)).toBe(one);
  });
});

describe("G-3 (4) · Rows: N", () => {
  it.each([[3, 1.5, 72], [1, 2, 32], [0, 1.5, undefined]])("%i rows of %srem → a %spx minimum (emitted as rem)", (n, step, px) => expect(rowsToMinHeight(n, step)).toBe(px));
  it("round trip, and an old minimum reads as the nearest whole rows", () => {
    for (const n of [1, 2, 5, 12]) expect(rowsOf(rowsToMinHeight(n, 1.5), 1.5)).toBe(n);
    expect(rowsOf(undefined, 1.5)).toBe(0);
    expect(rowsOf(80, 1.5)).toBe(3);
  });
});

describe("G-3 (5) · Line up with the grid", () => {
  const rowOf = (widths: (string | [string, number])[], extra: Partial<BoxNode> = {}) => {
    const cols = widths.map((w) => createContainer("column", { width: Array.isArray(w) ? w[0] : w, ...(Array.isArray(w) ? { marginLeftPct: w[1] } : {}), ...extra, children: [blockForKind("text")] } as Partial<BoxNode>));
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const ws = (r: BoxNode) => r.children![0].children!.map((c) => c.width);
  it("41.3 % + 58.7 % → 5 of 12 + 7 of 12, two blocks moved, the row still adds up", () => {
    const { root, moved } = lineUpWithGrid(rowOf(["41.3%", "58.7%"]), 12);
    expect(ws(root)).toEqual(["41.67%", "58.33%"]); expect(moved).toBe(2);
  });
  it("a row already on the lines: nothing moves", () => {
    const r = rowOf(["50%", "25%", "25%"]); expect(lineUpWithGrid(r, 12)).toEqual({ root: r, moved: 0 });
  });
  it("a gap before a block is lined up too", () => {
    const { root } = lineUpWithGrid(rowOf([["30%", 9], "61%"]), 12);
    const a = root.children![0].children![0];
    expect([a.marginLeftPct, a.width, root.children![0].children![1].width]).toEqual([8.33, "33.33%", "58.33%"]);
  });
  it("every block keeps at least one column", () => {
    const { root } = lineUpWithGrid(rowOf(["2%", "98%"]), 12);
    expect(ws(root)).toEqual(["8.33%", "91.67%"]);
  });
  it("a row with a block placed FREE on purpose is left alone", () => {
    const r = rowOf(["41.3%", "58.7%"], { freeInset: { right: 10 } }); expect(lineUpWithGrid(r, 12).moved).toBe(0);
  });
  it("on the phone it writes the phone's own widths; the desktop is untouched", () => {
    const { root } = lineUpWithGrid(rowOf(["41.3%", "58.7%"]), 6, "phone");
    expect(root.children![0].children!.map((c) => resolveResponsive(c, "phone").width)).toEqual(["33.33%", "66.67%"]);
    expect(ws(root)).toEqual(["41.3%", "58.7%"]);
  });
});

describe("G3-11 · a gap opened by dragging the first block's LEFT edge stays its own (width-round-trip, caught by the gate)", () => {
  it("the first block's share-of-the-line gap is still written (only a LENGTH margin is the row's side)", () => {
    const cols = [createContainer("column", { width: "40%", marginLeftPct: 10, children: [blockForKind("text")] } as Partial<BoxNode>), createContainer("column", { width: "50%", children: [blockForKind("text")] } as Partial<BoxNode>)];
    const page = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode)); const band = page.children![0];
    // G-3b: a `%` margin on a grid item is of its AREA (gap + block = 50%), so the 10% of the line is 20% of it
    expect(childStyle(band.children![0], band).marginLeft).toBe(`calc(20% + ${FRAME_CSS})`);
    expect(rowSide(band, "left")).toBe(SPACE_GRID.gutter); // …and the row keeps the site's side space
  });
});

describe("G-3b (1) · a row of the page is a CSS grid on the page's own lines (D5; closes G3-8)", () => {
  const rowOf = (widths: (string | undefined)[], marked = true, edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { ...(w ? { width: w } : {}), children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    const root = { ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode; if (!marked) delete root.pageGrid;
    const page = markPageGrid(normalizeRowBands(root));
    return { page, band: page.children![0] };
  };
  const spanOfCss = (s: { gridColumn?: unknown }) => Number(/^span (\d+)$/.exec(String(s.gridColumn))?.[1]);

  it("the track count: the page's lines on every screen, split only as far as the edges need", () => {
    expect(rowTrackCount([6, 12, 12, 12, 12], [0, 0.5, 0.5, 1])).toBe(12);          // halves
    expect(rowTrackCount([6, 12, 12, 12, 12], [0, 0.375, 0.375, 1])).toBe(24);      // 4½ of 12
    expect(rowTrackCount([6, 12, 12, 12, 12], [0, 0.2, 0.4, 0.6, 0.8, 1])).toBe(60); // five equal cards
    expect(rowTrackCount([12], [0, 0.3333, 0.6666, 1])).toBe(12);                    // thirds as stored, to a hundredth of a %
    expect(rowTrackCount([12], [0, 1], [5])).toBe(60);                               // a line of five shares the tracks
    expect(rowTrackCount([8, 16, 16, 16, 16], [0, 0.5, 1])).toBe(16);                // a site's own columns
  });

  it("a page row is a grid with no column gap; a SAVED page's row and a row inside a block stay flex", () => {
    const { band } = rowOf(["50%", "50%"]);
    expect(isPageRow(band)).toBe(true);
    const cs = containerStyle(band);
    expect([cs.display, cs.gridTemplateColumns, cs.columnGap]).toEqual(["grid", "repeat(12, minmax(0, 1fr))", u(0)]);
    const { page: pg, band: b2 } = rowOf(["50%", "50%"]); expect(childStyle(b2, pg).width).not.toBe("calc(100% + var(--bx-gut))"); // the page's width exactly: no reach past it
    const saved = rowOf(["50%", "50%"], false).band;
    expect(isPageRow(saved)).toBe(false); expect(containerStyle(saved).display).toBe("flex");
    const { page } = rowOf(["50%", "50%"]);
    const inner = markPageGrid(normalizeRowBands({ ...page, children: [makeRowBand([createContainer("column", { children: [makeRowBand([createContainer("column", { width: "50%" } as Partial<BoxNode>), createContainer("column", { width: "50%" } as Partial<BoxNode>)])] })])] } as BoxNode));
    const nested = inner.children![0].children![0].children![0];
    expect(nested.rowBand && !nested.pageRow && containerStyle(nested).display).toBe("flex");
  });

  it.each([
    [["50%", "50%"], [6, 6]], [["33.33%", "33.33%", "33.34%"], [4, 4, 4]], [["41.67%", "58.33%"], [5, 7]],
    [["25%", "25%", "25%", "25%"], [3, 3, 3, 3]], [["20%", "20%", "20%", "20%", "20%"], [12, 12, 12, 12, 12]], [["37.5%", "62.5%"], [9, 15]],
  ] as [string[], number[]][])("%j → spans %j: every edge ON a line, the line filled exactly", (widths, spans) => {
    const { band } = rowOf(widths);
    expect(band.children!.map((k) => spanOfCss(childStyle(k, band)))).toEqual(spans);
    expect(spans.reduce((a, b) => a + b, 0)).toBe(Number(/repeat\((\d+)/.exec(String(containerStyle(band).gridTemplateColumns))![1]));
  });

  it("width-less blocks share the line equally", () => {
    const { band } = rowOf([undefined, undefined, undefined]);
    expect(band.children!.map((k) => spanOfCss(childStyle(k, band)))).toEqual([4, 4, 4]);
  });

  it("margins: two blocks — half a gap between them, the side space at the line's ends; every screen the same", () => {
    const { band } = rowOf(["50%", "50%"]); const [a, b] = band.children!;
    for (const bp of RUNGS) {
      const sa = childStyle(a, band, bp), sb = childStyle(b, band, bp);
      expect([sa.marginLeft, sa.marginRight, sb.marginLeft, sb.marginRight]).toEqual([`calc(${FRAME_CSS})`, "calc(var(--bx-gut) * 0.5)", "calc(var(--bx-gut) * 0.5)", `calc(${FRAME_CSS})`]);
    }
  });

  it.each([2, 3, 4, 5, 6])("G3b-3 (the user: \"equal cards\"): %i equal blocks give up the same width, and neighbours stay one gap apart", (n) => {
    const { band } = rowOf(Array.from({ length: n }, () => `${Math.floor((100 / n) * 100) / 100}%`));
    const m = band.children!.map((k) => pageRowSlot(band, k.id, "base")!);
    const give = m.map((x) => x.left + x.right);
    expect(Math.max(...give) - Math.min(...give)).toBeLessThan(1e-9);
    for (let i = 0; i + 1 < n; i++) expect(m[i].right + m[i + 1].left).toBeCloseTo(SPACE_GRID.columns, 9);
    expect([m[0].left, m[n - 1].right]).toEqual([SPACE_GRID.gutter, SPACE_GRID.gutter]);
  });

  it("a block that wraps to a new line starts it with the side space", () => {
    const { band } = rowOf(["60%", "60%"]); const [, b] = band.children!;
    expect(childStyle(b, band).marginLeft).toBe(`calc(${FRAME_CSS})`);
    expect(pageRowCells(band, "base").get(b.id)).toMatchObject({ at: 0, of: 1 });
  });

  it("the site's own columns reach the row's tracks", () => {
    const site = setPageGrid(siteFromRoot(rowOf(["50%", "50%"]).page), { columns: 16 });
    const band = site.pages[0].root.children![0];
    expect(pageRowTracks(band)).toBe(16);
  });

  it("the published page draws the row as the grid (canvas == export: one emitter)", () => {
    const { page } = rowOf(["41.67%", "58.33%"]);
    const site = siteFromRoot(page); const out = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(out).toContain("display:grid;grid-template-columns:repeat(12, minmax(0, 1fr));column-gap:" + u(0));
    expect(out).toMatch(/grid-column:\s*span 5/); expect(out).toMatch(/grid-column:\s*span 7/);
  });
});

describe("G-3b (4) · the fit rule on the grid: every line steps, by span", () => {
  const rowOf = (cols: BoxNode[]) => { const page = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode)); return page.children![0]; };
  const words = (w: string) => createContainer("column", { width: w, children: [{ ...blockForKind("text"), text: "Admissions and enrolment information" } as BoxNode] } as Partial<BoxNode>);

  it("an icon beside words steps to one a line (a grid never wraps it by itself; the flex row left it to wrap)", () => {
    const band = rowOf([{ ...blockForKind("icon"), width: "50%" } as BoxNode, words("50%")]);
    expect(rowNarrowsAt(band, true)?.[0].steps.map((s) => s.lines)).toEqual([[1, 1]]);
  });

  it("a step writes spans and moves the side space to the blocks that start and end its lines", () => {
    const band = rowOf([words("25%"), words("25%"), words("25%"), words("25%")]);
    const css = rowQueryCss(band, (id) => `#${id}`, (c) => `@media{${c}}`, true);
    const [a, b] = band.children!;
    expect(css).toContain(`#${a.id}{grid-column:span 6 !important;margin-left:calc(${FRAME_CSS}) !important;margin-right:calc(var(--bx-gut) * 0.5) !important`);
    expect(css).toContain(`#${b.id}{grid-column:span 6 !important;margin-left:calc(var(--bx-gut) * 0.5) !important;margin-right:calc(${FRAME_CSS}) !important`);
    expect(css).toContain(`#${a.id}{grid-column:span 12 !important`);
    expect(css).not.toContain("flex:");
    expect(css).not.toContain("@media"); // the phone too
  });
});

describe("G-3b (5) · space between columns and between rows, each its own (the user, 2026-10-04)", () => {
  const pageWith = (...kinds: string[]) => kinds.reduce((r, k) => markPageGrid(normalizeRowBands(insertBox(r, r.id, (r.children ?? []).length, blockForKind(k)))), emptyPageRoot());
  it("stored as G-2 stored it when the two agree; each its own when they differ", () => {
    expect(gridSpaceOf({ blockGap: 20 })).toEqual({ gap: 20 });
    expect(gridSpaceOf({ columnGap: 20, rowGap: 20 })).toEqual({ gap: 20 });
    expect(gridSpaceOf({ columnGap: 40 })).toEqual({ gapX: 40 });
    expect(gridSpaceOf({ rowGap: 0, blockGap: 30 })).toEqual({ gapX: 30, gapY: 0 });
    expect(gridSpaceOf({ columnGap: 999, rowGap: -4 })).toEqual({ gapX: 64, gapY: 0 });
  });
  it("across reaches a row's columns and leaves the space down alone; down reaches stacks and wrapped lines", () => {
    let site = siteFromRoot(pageWith("row", "container"));
    site = setPageGrid(site, { columnGap: 40 });
    const row = site.pages[0].root.children![0].children![0], stack = site.pages[0].root.children![1].children![0];
    expect(gapOf(row)).toEqual({ x: 40, y: SPACE_GRID.stack });
    expect(gapOf(stack).y).toBe(SPACE_GRID.stack);
    site = setPageGrid(site, { columnGap: 40, rowGap: 0 });
    const row2 = site.pages[0].root.children![0].children![0], stack2 = site.pages[0].root.children![1].children![0];
    expect(gapOf(row2)).toEqual({ x: 40, y: 0 });
    expect(gapOf(stack2).y).toBe(0);
  });
  it("a page row's blocks keep exactly the space between columns between them", () => {
    const cols = [createContainer("column", { width: "50%", children: [blockForKind("text")] } as Partial<BoxNode>), createContainer("column", { width: "50%", children: [blockForKind("text")] } as Partial<BoxNode>)];
    const site = setPageGrid(siteFromRoot(markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode))), { columnGap: 40 });
    const band = site.pages[0].root.children![0]; const [a, b] = band.children!;
    expect(pageRowSlot(band, a.id, "base")!.right + pageRowSlot(band, b.id, "base")!.left).toBeCloseTo(40, 9);
  });
});


describe("G-3b (2) · from line, to line, to the last line, full width, bleed — per screen (map A1–A5)", () => {
  const pageOf = (widths: string[], edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const ids = (root: BoxNode) => root.children![0].children!.map((k) => k.id);
  const widthOf = (root: BoxNode, id: string, bp: Breakpoint = "base") => resolveResponsive(root.children![0].children!.find((k) => k.id === id)!, bp).width;

  it("reads the lines a block covers: 5 + 7 is lines 1–6 and 6–13; a gap before a block moves its start", () => {
    const root = pageOf(["41.67%", "58.33%"]); const [a, b] = ids(root);
    expect(linesAt(root, a, 12)).toEqual({ from: 1, to: 6, first: true, last: false });
    expect(linesAt(root, b, 12)).toEqual({ from: 6, to: 13, first: false, last: true });
    const gapped = pageOf(["40%", "50%"], (c) => { c[0].marginLeftPct = 10; });
    expect(linesAt(gapped, ids(gapped)[0], 10)).toMatchObject({ from: 2, to: 6 });
  });

  it("'To line' moves only the right edge; the block after gives what this one takes, never below one column (rule 19)", () => {
    const root = pageOf(["50%", "50%"]); const [a, b] = ids(root);
    const r = setLinesAt(root, a, { to: 9 }, 12);
    expect([widthOf(r, a), widthOf(r, b)]).toEqual(["66.67%", "33.33%"]);
    expect(linesAt(r, a, 12)!.from).toBe(1);
    const far = setLinesAt(root, a, { to: 13 }, 12);
    expect([widthOf(far, a), widthOf(far, b)]).toEqual(["91.67%", "8.33%"]); // the partner kept its one column
  });

  it("'From line' moves only the left edge: the block before gives way, or the space before it when it starts its line", () => {
    const root = pageOf(["50%", "50%"]); const [a, b] = ids(root);
    const r = setLinesAt(root, b, { from: 10 }, 12);
    expect([widthOf(r, a), widthOf(r, b)]).toEqual(["75.00%", "25.00%"]);
    expect(linesAt(r, b, 12)!.to).toBe(13);
    const g = setLinesAt(root, a, { from: 3 }, 12);
    expect(g.children![0].children![0].marginLeftPct).toBeCloseTo(16.67, 2);
    expect(linesAt(g, a, 12)).toMatchObject({ from: 3, to: 7 });
    expect(setLinesAt(root, a, { from: 0 }, 12)).toBe(root); // no space before it to give
  });

  it("per screen: set at Mobile, Desktop is untouched", () => {
    const root = pageOf(["50%", "50%"]); const [a] = ids(root);
    const r = setLinesAt(root, a, { to: 5 }, 6, "phone");
    expect(widthOf(r, a, "phone")).toBe("66.67%");
    expect(widthOf(r, a, "base")).toBe("50%");
  });

  it("'To the last line' reaches the end, and still does after the page grid goes from 12 columns to 16", () => {
    const root = pageOf(["25%", "50%"]); const [, b] = ids(root);
    const r = setLinesAt(root, b, { to: 13 }, 12);
    expect(linesAt(r, b, 12)!.to).toBe(13);
    expect(linesAt(r, b, 16)!.to).toBe(17);
  });

  it("'Full width' takes the whole line; the block beside it goes to the next", () => {
    const root = pageOf(["50%", "50%"]); const [a, b] = ids(root);
    const r = fullWidthAt(root, a);
    expect(linesAt(r, a, 12)).toEqual({ from: 1, to: 13, first: true, last: true });
    expect(linesAt(r, b, 12)).toMatchObject({ first: true, last: true });
  });

  it("bleed: only the side where it starts / ends a line goes to the page edge; nothing else moves", () => {
    const right = pageOf(["50%", "50%"], (c) => { c[1].bleed = "right"; }); const band = right.children![0]; const [a, b] = band.children!;
    const plain = pageOf(["50%", "50%"]); const pb = plain.children![0];
    expect(childStyle(b, band).marginRight).toBe(`calc(${u(0)})`);
    expect(childStyle(b, band).marginLeft).toBe(childStyle(pb.children![1], pb).marginLeft); // its gap side is unchanged
    expect(childStyle(a, band)).toEqual(childStyle(pb.children![0], pb)); // the words do not move
    expect(pageRowSlot(band, b.id, "base")!.right).toBe(0);
    const middle = pageOf(["50%", "50%"], (c) => { c[1].bleed = "left"; }); const mb = middle.children![0];
    expect(childStyle(mb.children![1], mb).marginLeft).toBe(childStyle(pb.children![1], pb).marginLeft); // not a line start: no edge to reach
  });

  it("bleed is per screen", () => {
    const root = pageOf(["50%", "50%"]); const [, b] = ids(root);
    const r = updateBoxResponsive(root, b, { bleed: "right" }, "phone"); const band = r.children![0];
    expect(childStyle(resolveResponsive(band.children![1], "phone"), band, "phone").marginRight).toBe(`calc(${u(0)})`);
    expect(childStyle(band.children![1], band, "base").marginRight).toBe(`calc(${FRAME_CSS})`);
  });

  it("the published page writes the bleed", () => {
    const site = siteFromRoot(pageOf(["50%", "50%"], (c) => { c[1].bleed = "both"; }));
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toMatch(/margin-right:calc\(calc\(var\(--box-u, 0\.625rem\) \* 0\)\)/);
  });
});


describe("G3b-11 · a width set for a screen wins there (the user: \"your setting wins\")", () => {
  const words = (w: string) => createContainer("column", { width: w, children: [{ ...blockForKind("text"), text: "Admissions and enrolment information for families" } as BoxNode] } as Partial<BoxNode>);
  const pageOf = () => markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand([words("50%"), words("50%")])] } as BoxNode));
  it("nothing set for a screen: the fit rule holds on every screen", () => {
    const band = pageOf().children![0]; const seen: string[][] = [];
    const css = rowQueryCss(band, (id) => `#${id}`, (c) => c, true, (c, screens) => { seen.push(screens); return c; });
    expect(css).toContain("@container"); expect(seen).toEqual([]);
  });
  it("a width set for phones: the fit rule stands aside on phones only", () => {
    let root = pageOf(); const [a, b] = root.children![0].children!;
    root = updateBoxResponsive(updateBoxResponsive(root, a.id, { width: "66.67%" }, "phone"), b.id, { width: "33.33%" }, "phone");
    const band = root.children![0]; let seen: string[] = [];
    rowQueryCss(band, (id) => `#${id}`, (c) => c, true, (c, screens) => { seen = screens; return c; });
    expect(seen).toEqual(["tabletPortrait", "tabletLandscape", "base", "wide"]);
    const site = siteFromRoot(root); const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toMatch(/@media \(min-width:37\.5em\)\{@container/);
  });
});

describe("G3b-12 · a picture not uploaded yet keeps its place on the published page (the user: \"same box, soft placeholder\")", () => {
  const pageWithImage = (patch: Partial<BoxNode> = {}) => { const r = emptyPageRoot(); return markPageGrid(normalizeRowBands(insertBox(r, r.id, 0, { ...blockForKind("image"), ...patch } as BoxNode))); };
  it("publishes a box the canvas's size, told to a screen reader as a picture to come", () => {
    const root = pageWithImage(); const site = siteFromRoot(root);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toMatch(/<div role="img" aria-label="Picture to come" style="[^"]*height:16\.25rem/);
    expect(html).toContain("lucide-image");
  });
  it("a height set on it is kept", () => {
    const site = siteFromRoot(pageWithImage({ height: "200px" }));
    expect(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true })).toMatch(/aria-label="Picture to come" style="[^"]*height:/);
  });
  it("a picture that has its image is published as the image", () => {
    const site = siteFromRoot(pageWithImage({ src: "data:image/png;base64,AAAA", alt: "A school" }));
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toContain('alt="A school"'); expect(html).not.toContain("Picture to come");
  });
});

describe("Page check · a missing picture, and words too tight where a person set the widths (G3b-11, G3b-12)", () => {
  it("lists a picture with no image, never as blocking publishing", () => {
    const r = emptyPageRoot(); const root = markPageGrid(normalizeRowBands(insertBox(r, r.id, 0, blockForKind("image"))));
    const issues = pageCheck(root);
    expect(issues.map((i) => [i.kind, i.blocks])).toContainEqual(["picture-missing", false]);
  });
  it("warns when widths set for phones leave words too little room there — and not when they fit", () => {
    const words = (w: string) => createContainer("column", { width: w, children: [{ ...blockForKind("text"), text: "Extraordinarily comprehensive admissions information" } as BoxNode] } as Partial<BoxNode>);
    const page = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand([words("50%"), words("50%")])] } as BoxNode));
    expect(pageCheck(page).some((i) => i.kind === "words-too-tight")).toBe(false);
    const [a, b] = page.children![0].children!;
    const tight = updateBoxResponsive(updateBoxResponsive(page, a.id, { width: "83.33%" }, "phone"), b.id, { width: "16.66%" }, "phone");
    expect(pageCheck(tight).find((i) => i.kind === "words-too-tight")?.message).toMatch(/^On phones/);
    // G3b-13: set for phones AND fitting — short words, an even split — says nothing (the first check above never reached the comparison)
    const short = (w: string) => createContainer("column", { width: w, children: [{ ...blockForKind("text"), text: "Fees" } as BoxNode] } as Partial<BoxNode>);
    const sp = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand([short("50%"), short("50%")])] } as BoxNode)); const [c, d] = sp.children![0].children!;
    const fits = updateBoxResponsive(updateBoxResponsive(sp, c.id, { width: "58.33%" }, "phone"), d.id, { width: "41.66%" }, "phone");
    expect(pageCheck(fits).some((i) => i.kind === "words-too-tight")).toBe(false);
  });
});


describe("G-3c · the page's frame on all four sides, from one emitter (the user: \"the same for the bottom, the right, the left — one rem\")", () => {
  const page = (...kinds: string[]) => kinds.reduce((r, k) => dropOn(r, blockForKind(k)), emptyPageRoot());
  const html = (root: BoxNode) => { const site = siteFromRoot(root); return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }); };

  it("the page keeps the frame above its first section and below its last", () => {
    expect(pageFrameEnds(page("heading", "text"))).toEqual({ paddingTop: FRAME_CSS, paddingBottom: FRAME_CSS });
    expect(containerStyle(page("heading"))).toMatchObject({ paddingTop: FRAME_CSS, paddingBottom: FRAME_CSS });
    expect(html(page("heading"))).toMatch(/padding-top:clamp\(1rem, calc\(var\(--box-u, 0\.625rem\) \* 1\.6\), 1\.25rem\)/);
  });

  it("a coloured or picture first / last section still reaches the edge on that side", () => {
    const r = page("heading", "text");
    const coloured = { ...r, children: [{ ...r.children![0], background: "var(--eu-color-primary)" }, r.children![1]] } as BoxNode;
    expect(pageFrameEnds(coloured)).toEqual({ paddingBottom: FRAME_CSS });
    expect(pageFrameEnds(page("text", "image"))).toEqual({ paddingTop: FRAME_CSS });
  });

  it("a page saved before the page grid gets no frame", () => {
    const saved = page("heading"); delete saved.pageGrid;
    expect(pageFrameEnds(saved)).toEqual({});
  });

  it("the site's own side space is the frame, all four sides, down to 0", () => {
    const site = setPageGrid(siteFromRoot(page("heading", "card")), { sideSpace: 0 });
    const root = site.pages[0].root;
    expect(pageFrameEnds(root)).toEqual({ paddingTop: u(0), paddingBottom: u(0) });
    expect(frameCss(root)).toBe(u(0));
  });

  it("a component on the page keeps the frame OUTSIDE its box, and fills its line less both sides", () => {
    const card = { ...blockForKind("card"), onPageGrid: true, width: "100%" } as BoxNode;
    const css = outerSpaceCSS(card, "page");
    expect([css.marginLeft, css.marginRight]).toEqual([FRAME_CSS, FRAME_CSS]);
    expect(css.maxWidth).toBe(`calc(100% - ${FRAME_CSS} - ${FRAME_CSS})`);
  });

  it("a lone section's words keep the frame at its sides; a menu line too", () => {
    const heading = { ...blockForKind("heading"), onPageGrid: true } as BoxNode;
    expect([paddingCSS(heading, true).paddingLeft, paddingCSS(heading, true).paddingRight]).toEqual([FRAME_CSS, FRAME_CSS]);
    expect(paddingCSS({ ...heading, paddingLeft: 0 } as BoxNode, true).paddingLeft).toBe(u(0)); // its own value wins
  });

  it("the arithmetic reads the frame as drawn: a row's sides in rem at a page width", () => {
    const cols = [createContainer("column", { width: "50%", children: [blockForKind("text")] } as Partial<BoxNode>), createContainer("column", { width: "50%", children: [blockForKind("text")] } as Partial<BoxNode>)];
    const band = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode)).children![0];
    expect(rowSideRemAt(band, "left", 22.5)).toBe(1);
    expect(rowSideRemAt(band, "right", 120)).toBe(1.25);
    const slot = pageRowSlot(band, band.children![0].id, "base", 80)!;
    expect(slot.left).toBeCloseTo(frameRemAt(band, 80), 9);
  });
});

describe("G-3b (3) · free placement: the nearest lines + a margin inside them, never page x / y (map §1)", () => {
  const pageOf = (widths: string[], edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const kid = (root: BoxNode, i: number) => root.children![0].children![i];
  const css = (root: BoxNode, i: number) => childStyle(kid(root, i), root.children![0]);

  it("a free margin is a % of its OWN columns, written as a share of its grid area — its columns stay on the lines", () => {
    // 5 + 7 of 12; the first block sits 20% of its 5 columns in from the right (one column)
    const p0 = pageOf(["41.67%", "58.33%"]); const r = setFreeInset(p0, kid(p0, 0).id, "right", 20);
    const band = r.children![0];
    expect(String(css(r, 0).gridColumn)).toBe("span 5");
    expect(String(css(r, 0).marginRight)).toMatch(/^calc\(20% \+ /);
    expect(String(css(r, 1).gridColumn)).toBe("span 7");
    // a dragged gap before it AND a free margin: the margin is of its columns, the area holds both
    const g = pageOf(["40%", "50%"], (c) => { c[0].marginLeftPct = 10; c[0].freeInset = { left: 50 }; }); // area 5 of 10 tracks, columns 4 of them
    const cell = pageRowCells(g.children![0], "base").get(kid(g, 0).id)!;
    expect([cell.gapPct, cell.insetL]).toEqual([20, 40]);
    expect(String(css(g, 0).marginLeft)).toMatch(/^calc\(60% \+ /);
    expect(band.children!.length).toBe(2);
  });

  it("the canvas's slot includes the free margin, so the next drag starts from the lines", () => {
    const root = pageOf(["50%", "50%"]); const a = kid(root, 0).id;
    const before = pageRowSlot(root.children![0], a, "base", 80)!;
    const after = pageRowSlot(setFreeInset(root, a, "right", 25).children![0], a, "base", 80)!;
    expect(after.left).toBeCloseTo(before.left, 6);
    expect(after.right - before.right).toBeCloseTo(0.25 * 40, 6); // a quarter of a half of an 80 rem page
  });

  it("setFreeInset: per side, per screen, the box keeps a tenth of its columns, undefined puts it back on the line", () => {
    const root = pageOf(["50%", "50%"]); const a = kid(root, 0).id;
    const r = setFreeInset(setFreeInset(root, a, "left", 70), a, "right", 70);
    expect(kid(r, 0).freeInset).toEqual({ left: 70, right: 20 });
    const back = setFreeInset(setFreeInset(r, a, "left", undefined), a, "right", undefined);
    expect(kid(back, 0).freeInset).toBeUndefined();
    const phone = setFreeInset(root, a, "left", 30, "phone");
    expect([kid(phone, 0).freeInset, resolveResponsive(kid(phone, 0), "phone").freeInset]).toEqual([undefined, { left: 30, right: undefined }]);
  });

  it("an Alt slide: the box keeps its width, its columns are the lines around it, the block after never moves", () => {
    // 3 of 12 then 6 of 12 with three columns of room after the first (a gap before the second)
    const root = pageOf(["25%", "50%"], (c) => { c[1].marginLeftPct = 25; }); const a = kid(root, 0).id;
    const bStart = linesAt(root, kid(root, 1).id, 12)!.from;
    const r = slideFreeAt(root, a, 1.5, 12); // its box moved 1.5 columns: from 1.5 to 4.5
    expect(linesAt(r, a, 12)).toMatchObject({ from: 2, to: 6 });               // lines 2 … 6 (columns 1 … 5)
    expect(kid(r, 0).freeInset).toEqual({ left: 12.5, right: 12.5 });           // half a column of four, each side
    expect(linesAt(r, kid(r, 1).id, 12)!.from).toBe(bStart);                     // the next block did not move
    // never past the block after it, nor before the line's start
    expect(linesAt(slideFreeAt(root, a, 99, 12), a, 12)).toMatchObject({ from: 4, to: 7 });
    expect(slideFreeAt(root, a, -5, 12)).toEqual(slideFreeAt(root, a, 0, 12));
    // landing ON lines leaves no free margin; a second slide starts from where the first left it
    expect(kid(slideFreeAt(root, a, 2, 12), 0).freeInset).toBeUndefined();
    const twice = slideFreeAt(r, a, 0.5, 12), once = slideFreeAt(root, a, 2, 12);
    expect([linesAt(twice, a, 12), kid(twice, 0).freeInset, linesAt(twice, kid(twice, 1).id, 12)]).toEqual([linesAt(once, a, 12), kid(once, 0).freeInset, linesAt(once, kid(once, 1).id, 12)]);
    // packed tight: there is nowhere to go, nothing changes
    const tight = pageOf(["50%", "50%"]);
    expect(linesAt(slideFreeAt(tight, kid(tight, 0).id, 3, 12), kid(tight, 0).id, 12)).toMatchObject({ from: 1, to: 7 });
  });

  it("G3b-16 · a slide never re-packs the row: nothing comes up from the line below, nothing jumps to the line above", () => {
    // line 1: a 4-column gap + A (4); line 2: B (6), which does not fit beside A
    const down = pageOf(["33.33%", "50%"], (c) => { c[0].marginLeftPct = 33.33; }); const a = kid(down, 0).id, b = kid(down, 1).id;
    expect(linesAt(down, b, 12)!.first).toBe(true);
    const r = slideFreeAt(down, a, -4, 12);
    expect(linesAt(r, b, 12)!.first).toBe(true);                       // B is still the first on ITS line: it did not come up
    expect(linesAt(r, a, 12)!.from).toBe(1);                            // A went where it was let go…
    expect(kid(r, 0).freeInset?.right).toBeGreaterThan(0);              // …its columns still covering where it was, the rest free
    // line 1: A (6); line 2: a 4-column gap + B (6) — sliding B left must not lift it onto line 1
    const up = pageOf(["50%", "50%"], (c) => { c[1].marginLeftPct = 33.33; });
    const r2 = slideFreeAt(up, kid(up, 1).id, -4, 12);
    expect(linesAt(r2, kid(r2, 1).id, 12)).toMatchObject({ first: true, from: 1 });
    expect(linesAt(r2, kid(r2, 0).id, 12)).toMatchObject({ first: true, last: true });
  });

  it("G3b-18 · a block's readable floor never asks for more than its area less its margins (no overlap at 2 of 6)", () => {
    const r = pageOf(["50%", "50%"], (c) => { c[0].responsive = { phone: { width: "33.33%" } }; });
    const band = r.children![0];
    for (const bp of ["phone", "base"] as Breakpoint[]) {
      const s = childStyle(kid(r, 0), band, bp);
      expect(String(s.minWidth), bp).toMatch(/^min\(calc\(100% - .+ - .+\), [\d.]+rem\)$/);
      expect(String(s.minWidth)).toContain(String(s.marginLeft)); // the very margins it is drawn with
    }
  });

  it("a slide stops at a block spanning down beside it (G-3b (6)): it never slides under it", () => {
    const r = pageOf(["50%", "50%", "25%"], (c) => { c[0].rowSpan = 2; }); const last = kid(r, 2).id;
    expect(linesAt(r, last, 12)).toMatchObject({ from: 7, to: 10 });
    expect(linesAt(slideFreeAt(r, last, -5, 12), last, 12)!.from).toBe(7);
  });

  it("a slide is per screen: the others keep their lines", () => {
    const root = pageOf(["25%", "50%"], (c) => { c[1].marginLeftPct = 25; }); const a = kid(root, 0).id;
    const r = slideFreeAt(root, a, 1.5, 6, "phone");
    expect(linesAt(r, a, 12, "base")).toMatchObject({ from: 1, to: 4 });
    expect(kid(r, 0).freeInset).toBeUndefined();
  });

  it("the fit rule drops the free margin where it steps a line (equal blocks)", () => {
    const r = pageOf(["25%", "25%", "25%", "25%"], (c) => { c[0].freeInset = { left: 40 }; });
    const site = siteFromRoot(r); const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    const steps = html.match(/grid-column:span \d+ !important;[^}]*/g) ?? [];
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.filter((d) => d.includes("40%"))).toEqual([]);
    expect(html).toMatch(/margin-left:calc\(40% \+ /); // …while the line is not stepped, it is there
  });
});

describe("G-3b (6) · a block of a row of the page spans rows (the user: a gallery photo two rows tall)", () => {
  const pageOf = (widths: string[], edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const kid = (root: BoxNode, i: number) => root.children![0].children![i];
  const css = (root: BoxNode, i: number, bp: Breakpoint = "base") => childStyle(kid(root, i), root.children![0], bp);
  const bento = () => pageOf(["50%", "50%", "50%"], (c) => { c[0].rowSpan = 2; });

  it("a photo two rows tall: it spans 2 rows, and the third block sits BESIDE it on the second row, not under it", () => {
    const r = bento(); const [p, a, b] = [0, 1, 2].map((i) => kid(r, i).id);
    expect(String(css(r, 0).gridRow)).toBe("span 2");
    expect(css(r, 1).gridRow).toBeUndefined();
    expect(linesAt(r, p, 12)).toMatchObject({ from: 1, to: 7, first: true });
    expect(linesAt(r, a, 12)).toMatchObject({ from: 7, to: 13, last: true });
    expect(linesAt(r, b, 12)).toMatchObject({ from: 7, to: 13, first: false, last: true }); // beside the photo, its right-hand block
  });

  it("the block beside it on the second row is spaced like the one above it (equal cards, one gap)", () => {
    const r = bento();
    expect([css(r, 2).marginLeft, css(r, 2).marginRight]).toEqual([css(r, 1).marginLeft, css(r, 1).marginRight]);
    const cells = pageRowCells(r.children![0], "base");
    expect([cells.get(kid(r, 1).id)!.at, cells.get(kid(r, 2).id)!.at, cells.get(kid(r, 2).id)!.of]).toEqual([1, 1, 2]);
  });

  it("a row that spans nothing is placed exactly as before (the same cells)", () => {
    const flat = pageOf(["50%", "50%", "50%"]); const cells = pageRowCells(flat.children![0], "base");
    expect([...cells.values()].map((c) => [c.span, c.at, c.of, c.rows])).toEqual([[6, 0, 2, 1], [6, 1, 2, 1], [6, 0, 1, 1]]);
  });

  it("where the fit rule steps the row, the photo spans one row again (the phone falls back)", () => {
    const r = bento(); const site = siteFromRoot(r);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    const steps = html.match(/grid-column:span \d+ !important;[^}]*/g) ?? [];
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.filter((d) => d.includes("grid-row:auto !important")).length).toBeGreaterThan(0);
  });

  it("G3b-23 · where the photo is stepped to one row, the block that sat beside it goes back to its own place (not 'beside')", () => {
    const r = bento(), flat = pageOf(["50%", "50%", "50%"]); const site = siteFromRoot(r);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    const own = String(childStyle(kid(flat, 2), flat.children![0]).marginLeft), beside = String(css(r, 2).marginLeft);
    expect(own).not.toBe(beside); // the precondition: beside the photo it has other margins
    const id = kid(r, 2).id.replace(/[^A-Za-z0-9_-]/g, "-"), esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expect(html).toMatch(new RegExp(`@container[^@]*${esc(id)}[^{]*\\{grid-row:auto !important;margin-left:${esc(own)} !important`));
  });

  it("per screen: one row at Tablet, two at Desktop", () => {
    const r = bento(); const p = kid(r, 0).id;
    const t = updateBoxResponsive(r, p, { rowSpan: undefined }, "tabletLandscape" as Breakpoint);
    expect(String(css(t, 0, "base").gridRow)).toBe("span 2");
    expect(css(t, 0, "tabletLandscape" as Breakpoint).gridRow).toBeUndefined();
  });

  it("a block sliding toward a photo spanning down beside it stops at it, and never writes the photo's own gap", () => {
    // A (6) + photo (6, 2 rows) on row 1; X (3) on row 2, left of the photo
    const r = pageOf(["50%", "50%", "25%"], (c) => { c[1].rowSpan = 2; }); const x = kid(r, 2).id;
    expect(linesAt(r, x, 12)).toMatchObject({ from: 1, to: 4 });
    const slid = slideFreeAt(r, x, 9, 12);
    expect(linesAt(slid, x, 12)!.to).toBe(7);
    expect(kid(slid, 1).marginLeftPct).toBeUndefined();
    const short = slideFreeAt(r, x, 1.5, 12); // a column of room is left before the photo: it is nobody's, never the photo's gap
    expect(linesAt(short, x, 12)!.to).toBe(6);
    expect(kid(short, 1).marginLeftPct).toBeUndefined();
  });

  it("'From line' cannot push a block under the photo spanning beside it; 'To line' on the photo still works", () => {
    const r = bento(); const b = kid(r, 2).id;
    expect(setLinesAt(r, b, { from: 5 }, 12)).toBe(r);
    const wider = setLinesAt(r, kid(r, 0).id, { to: 9 }, 12);
    expect(linesAt(wider, kid(wider, 0).id, 12)).toMatchObject({ from: 1, to: 9 });
  });
});

describe("G3b-24 · the panel says what the fit rule draws on this screen (fitStepAt)", () => {
  const pageOf = (widths: string[], edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  it("a phone stacks two halves: drawn one a line; a desktop: the fit rule does not act", () => {
    const r = pageOf(["50%", "50%"]); const band = r.children![0], id = band.children![0].id;
    expect(fitStepAt(band, id, 375 / 16, "phone")).toBe(1);
    expect(fitStepAt(band, id, 1280 / 16, "base")).toBeNull();
  });
  it("a width set for the phone wins there: the fit rule stands aside, so nothing is said", () => {
    const r = pageOf(["50%", "50%"], (c) => { c[0].responsive = { phone: { width: "33.33%" } }; c[1].responsive = { phone: { width: "66.67%" } }; });
    const band = r.children![0];
    expect(fitStepAt(band, band.children![0].id, 375 / 16, "phone")).toBeNull();
  });
  it("a row that is not a row of the page has no fit rule to report", () => {
    const r = pageOf(["50%", "50%"]); const band = { ...r.children![0], pageRow: false };
    expect(fitStepAt(band, band.children![0].id, 375 / 16, "phone")).toBeNull();
  });
});

describe("G3b-27 · on a stepped line a block's readable floor uses the margins it is drawn with there", () => {
  it("every stepped rule's min-width subtracts exactly that rule's own margins (no box wider than its line at 200 % text)", () => {
    const cols = ["50%", "50%"].map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    const r = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode)); const site = siteFromRoot(r);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    const rules = [...html.matchAll(/grid-column:span \d+ !important;(?:grid-row:auto !important;)?margin-left:(.+?) !important;margin-right:(.+?) !important;min-width:min\(calc\(100% - (.+?) - (.+?)\), [\d.]+rem\) !important/g)];
    expect(rules.length).toBeGreaterThan(0);
    for (const [, ml, mr, fl, fr] of rules) expect([fl, fr]).toEqual([ml, mr]);
  });
});

describe("G-3d (3) · on a phone no block of a page row has columns narrower than 10rem (D3-31)", () => {
  /** A row of the page from [kind, width] pairs — each a leaf block or, with `col`, a column holding it, as the panel drops them. */
  const rowOf = (blocks: [string, string, boolean?][], marked = true) => {
    const kids = blocks.map(([kind, width, col]) => (col ? createContainer("column", { width, children: [blockForKind(kind)] } as Partial<BoxNode>) : { ...blockForKind(kind), width } as BoxNode));
    const root = { ...emptyPageRoot(), children: [makeRowBand(kids)] } as BoxNode; if (!marked) delete root.pageGrid;
    return markPageGrid(normalizeRowBands(root)).children![0];
  };
  const across = (band: BoxNode, i: number, px: number) => fitStepAt(band, band.children![i].id, px / 16, px < 600 ? "phone" : "tabletPortrait") ?? band.children!.length;

  it.each([true, false])("a photo 40 %% wide beside a paragraph goes under it at 375 (photo in a column: %s)", (col) => {
    const band = rowOf([["text", "60%", col], ["image", "40%", col]]);
    expect(across(band, 1, 375)).toBe(1);
    // a leaf photo is beside again at the tablet rung; a photo in a COLUMN keeps the section's own 14rem floor there (G-1)
    expect(across(band, 1, col ? 1280 : 600)).toBe(2);
  });
  it("a sidebar 30 % wide beside an article goes under it at 375", () => {
    const band = rowOf([["text", "70%", true], ["text", "30%", true]]);
    expect(across(band, 1, 375)).toBe(1);
  });
  it("four Stats stay two across at 360 and 340, one a line where two areas no longer hold 10rem each", () => {
    const band = rowOf([["stat", "25%", true], ["stat", "25%", true], ["stat", "25%", true], ["stat", "25%", true]]);
    expect([360, 340, 300].map((px) => across(band, 0, px))).toEqual([2, 2, 1]);
  });
  it("a strip of six logos: 2 across at 360, 3 at 480, all six from the tablet rung (any block, not only words)", () => {
    const band = rowOf(Array.from({ length: 6 }, () => ["image", "16.6667%"] as [string, string]));
    expect([360, 479, 480, 599, 600, 1280].map((px) => across(band, 0, px))).toEqual([2, 2, 3, 3, 6, 6]);
  });
  it("the floor never steps a row at the tablet rung or wider, however narrow its blocks", () => {
    for (const n of [2, 3, 4, 6, 12]) {
      const band = rowOf(Array.from({ length: n }, () => ["image", `${100 / n}%`] as [string, string]));
      for (const g of rowNarrowsAt(band, true) ?? []) for (const s of g.steps) expect(s.below, `${n} blocks`).toBeLessThanOrEqual(600 / 16);
    }
  });
  it("a page saved before the page grid: a photo beside a paragraph is left as it was", () => {
    // measured: L-4's word step (8.4rem) stays; the floor would put it at 25rem. Six logos still have no step at all.
    expect(rowNarrowsAt(rowOf([["text", "60%"], ["image", "40%"]], false), true)![0].steps.map((s) => s.below)).toEqual([8.4]);
    expect(rowNarrowsAt(rowOf(Array.from({ length: 6 }, () => ["image", "16.6667%"] as [string, string]), false), true)).toBeNull();
  });
});

describe("G-3d (1) · on a phone a block alone on its line takes the whole line, unless its width was set on the phone", () => {
  // a row of ONE block is a flex band, already the whole line on a phone (`min-width:100%`); the case is a row of the page
  // whose stored lines leave a block alone — the third of three halves
  const pageOf = (widths: string[], edit?: (cols: BoxNode[]) => void) => {
    const cols = widths.map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    edit?.(cols);
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  const halves = (edit?: (c: BoxNode[]) => void) => pageOf(["50%", "50%", "50%"], edit);
  const spanOn = (root: BoxNode, i: number, bp: Breakpoint) => { const band = root.children![0]; return pageRowCells(band, bp).get(band.children![i].id)!.span / pageRowTracks(band); };

  it("the third of three halves: the whole line on the phone, still half on every wider screen", () => {
    const r = halves(); expect(isPageRow(r.children![0])).toBe(true);
    expect(spanOn(r, 2, "phone")).toBe(1);
    for (const bp of ["tabletPortrait", "tabletLandscape", "base", "wide"] as Breakpoint[]) expect(spanOn(r, 2, bp), bp).toBe(0.5);
  });
  it("a gap brought down from the desktop goes too", () => {
    const r = halves((c) => { c[2].marginLeftPct = 10; c[2].width = "40%"; });
    expect(spanOn(r, 2, "phone")).toBe(1);
    expect(pageRowCells(r.children![0], "phone").get(r.children![0].children![2].id)!.gapPct).toBe(0);
  });
  it("a width that came from the tablet is from a wider screen too: the whole line on the phone", () => {
    const r = halves((c) => { c[2].responsive = { tabletPortrait: { width: "33.33%" } }; });
    expect(spanOn(r, 2, "phone")).toBe(1);
  });
  it.each(["phone", "mobile"])("a width set on the phone itself (%s slot) wins there (G3b-11)", (slot) => {
    const r = halves((c) => { c[2].responsive = { [slot]: { width: "50%" } }; });
    expect(spanOn(r, 2, "phone")).toBe(0.5);
  });
  it("…and so does a gap set on the phone", () => {
    const r = halves((c) => { c[2].responsive = { phone: { marginLeftPct: 25 } }; });
    expect(spanOn(r, 2, "phone")).toBeLessThan(1);
  });
  it("the published page agrees: the lone block's phone rule spans every track, its tablet rule half", () => {
    const r = halves(); const site = siteFromRoot(r); const band = r.children![0], T = pageRowTracks(band), id = band.children![2].id;
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    const rules = [...html.matchAll(new RegExp(String.raw`[^{}]*${id}[^{}]*\{[^}]*grid-column:span (\d+)`, "g"))].map((m) => +m[1]);
    expect(rules[0]).toBe(T); // the phone (mobile first: the unprefixed rule)
    expect(rules).toContain(T / 2);
  });
});
