import { describe, it, expect } from "vitest";
import { type BoxNode, type Breakpoint, SPACE_DEFAULT, SPACE_GRID, spaceDefaults, outerDefaults, gapOf, insertBox, normalizeRowBands, markPageGrid, u, createContainer, makeRowBand, sectionContent, gridBandOwnsGutter, pageBandInset, rowNarrowsAt, rowQueryCss, childStyle, tabletPlaces } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";
import { renderSitePage, SKIP_LINK_CSS } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { PAGE_GRID_DEFAULT, columnsAt, spanOf, snapShare, spanLabel, spanText, resolvePageGrid } from "@/lib/page-grid";

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
