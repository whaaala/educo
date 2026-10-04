import { describe, it, expect } from "vitest";
import { type BoxNode, type Breakpoint, SPACE_DEFAULT, SPACE_GRID, spaceDefaults, outerDefaults, gapOf, insertBox, normalizeRowBands, markPageGrid, u, createContainer, makeRowBand, sectionContent, gridBandOwnsGutter, pageBandInset, rowNarrowsAt, rowQueryCss, childStyle, tabletPlaces, rowSide, outerSpaceDefaults, spanAt, setSpan, resolveResponsive, lineUpWithGrid } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { emptyPageRoot, siteFromRoot, setPageGrid, applyPageGrid, addPage } from "@/lib/box-site";
import { renderSitePage, SKIP_LINK_CSS } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { PAGE_GRID_DEFAULT, columnsAt, spanOf, snapShare, spanLabel, spanText, resolvePageGrid, gridSpaceOf, gridTemplate, spanOfWidth, spanOfRect, snapEdgePx, rowsToMinHeight, rowsOf } from "@/lib/page-grid";

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
  it("side space ≥ 1 rem on a phone, ≈ 2 rem wide; gap ≥ 0.75 rem on a phone (the user, 2026-10-04)", () => {
    expect((SPACE_GRID.gutter / 10) * unitRem.lo).toBeGreaterThanOrEqual(1);
    expect((SPACE_GRID.gutter / 10) * unitRem.hi).toBeLessThanOrEqual(2.1);
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
    expect(html(dropOn(emptyPageRoot(), blockForKind("heading")))).toContain(u(SPACE_GRID.gutter));
    const saved = html(dropOn(savedRoot(), blockForKind("heading")));
    expect(saved).toContain(u(SPACE_DEFAULT.gutter));
    expect(saved).not.toContain(u(SPACE_GRID.gutter));
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

  it.each([2, 3, 4])("a page-grid row of %i: the row keeps the side space, its columns none at their sides", (n) => {
    const { band, cols, flag } = rowOf(true, n);
    expect(gridBandOwnsGutter(band)).toBe(true);
    expect(pageBandInset(band, true)).toEqual({ paddingLeft: u(SPACE_GRID.gutter), paddingRight: u(SPACE_GRID.gutter) });
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
    expect(html(site)).not.toContain(u(SPACE_GRID.gutter));
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
    expect(site.pages[1].root.gridSpace).toEqual({ gutter: 64 });
    site = setPageGrid(site, undefined, about);
    expect(site.pages[1].root.gridSpace).toEqual({ gutter: 0 });
  });

  it("values are held to the panel's ranges", () => {
    expect(gridSpaceOf({ sideSpace: -5, blockGap: 999 })).toEqual({ gutter: 0, gap: 64 });
    expect(gridSpaceOf({ columns: 10 })).toBeUndefined();
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
    expect(pageBandInset(band, true)).toEqual({ paddingLeft: u(SPACE_GRID.gutter), paddingRight: u(SPACE_GRID.gutter) });
  });

  it.each([0, 8, 48])("the FIRST block's left margin %i is the row's left side; the right stays", (v) => {
    const { band } = rowOf(3, (c) => { c[0].marginLeft = v; });
    expect(pageBandInset(band, true)).toEqual({ paddingLeft: u(v), paddingRight: u(SPACE_GRID.gutter) });
    expect(childStyle(band.children![0], band).marginLeft).toBe("calc(0px + calc(var(--bx-gut) / 2))"); // only the half gap: never applied twice (G3-1)
  });

  it("the LAST block's right margin is the row's right side; a middle block's margins stay its own", () => {
    const { band } = rowOf(3, (c) => { c[2].marginRight = 0; c[1].marginLeft = 32; });
    expect(pageBandInset(band, true)).toEqual({ paddingLeft: u(SPACE_GRID.gutter), paddingRight: u(0) });
    expect(String(childStyle(band.children![1], band).marginLeft)).toContain(u(32));
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
    expect(html).toMatch(/padding-left:\s*calc\(var\(--box-u, 0\.625rem\) \* 0\)/);
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
    const r = rowOf(["41.3%", "58.7%"], { freeWidth: true }); expect(lineUpWithGrid(r, 12).moved).toBe(0);
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
    expect(String(childStyle(band.children![0], band).marginLeft)).toContain("10%");
    expect(rowSide(band, "left")).toBe(SPACE_GRID.gutter); // …and the row keeps the site's side space
  });
});
