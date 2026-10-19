import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, insertBox, normalizeRowBands, markPageGrid, withGridSpace, sectionSpacePad, sectionSpaceOf, spacePatch, resolveResponsive, u, type BoxNode, type GridSpace } from "@/lib/box-model";
import { gridSpaceOf, PAGE_GRID_LIMITS } from "@/lib/page-grid";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import LAYOUT from "@/config/layout.json";

/**
 * THE SPACE BETWEEN SECTIONS (BATCH LE-15i, SG-1 · SG-2 — box-builder-sections.feature "The space between sections").
 * The user, 2026-10-19: "One size for all" (a size in Page grid for the site or a page; a section can keep its own) and
 * "Every page, a switch" (same-colour neighbours share their space, saved pages included; Page grid turns it off).
 */
const words = (t: string) => createElement("text", { text: t });
const sec = (extra: Partial<BoxNode> = {}) => createContainer("column", { tag: "section", paddingTop: 96, paddingBottom: 96, children: [words("Some words")], ...extra });
/** A page of these blocks, each a band of its own, with the page grid's space. */
function page(blocks: BoxNode[], space?: GridSpace): BoxNode {
  let root = emptyPageRoot();
  blocks.forEach((b, i) => { root = insertBox(root, root.id, i, makeRowBand([b])); });
  return withGridSpace(markPageGrid(normalizeRowBands(root)), space);
}
/** What the helper gives each block on `bp`, found in its band on the page, as both renderers call it. */
function pads(root: BoxNode, bp: "base" | "phone" = "base") {
  return (root.children ?? []).map((band) => { const n = band.children![0]; return sectionSpacePad(band, resolveResponsive(n, bp), root, bp); });
}

describe("SG-1 · one space above and below every section", () => {
  it("the Page grid value reaches the page — clamped to config/layout.json's limit — and is not lost as 'no change'", () => {
    expect(PAGE_GRID_LIMITS.sectionSpace).toEqual([0, LAYOUT.sectionSpace.max]);
    expect(gridSpaceOf({ sectionSpace: 64 })).toEqual({ sectionY: 64 });
    expect(gridSpaceOf({ sectionSpace: 999 })?.sectionY).toBe(LAYOUT.sectionSpace.max);
    expect(gridSpaceOf({ mergeSections: false })).toEqual({ noMerge: true });
    const before = page([sec()]);
    expect(withGridSpace(before, { sectionY: 64 }).gridSpace).toEqual({ sectionY: 64 });
  });
  it("every section of the page takes it above and below; the header and the footer keep their own; unset = each design's own", () => {
    const root = page([sec({ tag: "header" }), sec(), createContainer("column", { children: [words("My stack")] }), sec({ tag: "footer" })], { sectionY: 64 });
    const p = pads(root);
    expect(p[0]).toEqual({});
    expect(p[1]).toEqual({ paddingTop: u(64), paddingBottom: u(64) });
    expect(p[2]).toEqual({ paddingTop: u(0), paddingBottom: u(64) }); // a plain Stack under a plain section: their 64s are shared (SG-2)
    expect(p[3]).toEqual({});
    expect(pads(page([sec(), sec({ background: "#fde68a" })]))).toEqual([{}, {}]);
  });
  it("a section that keeps its own space keeps it; a block beside another in a row is not a section", () => {
    const root = page([sec({ ownSpace: true }), sec()], { sectionY: 64 });
    expect(pads(root)[0]).toEqual({});
    let two = emptyPageRoot(); two = insertBox(two, two.id, 0, makeRowBand([sec(), sec()]));
    two = withGridSpace(markPageGrid(normalizeRowBands(two)), { sectionY: 64 });
    const band = two.children![0];
    expect(band.children!.map((n) => sectionSpacePad(band, n, two, "base"))).toEqual([{}, {}]);
  });
  it("the published page carries it", () => {
    const s = siteFromRoot(page([sec({ id: "s1" })], { sectionY: 64 }));
    expect(renderSitePage(s, DEFAULT_THEME, s.pages[0].id)).toMatch(new RegExp(`padding-top:${u(64).replace(/[()*.]/g, "\\$&")}`));
  });
});

describe("SG-2 · two sections of the same colour share their space", () => {
  it("96 + 96 becomes 96: the lower section's top gives up what the upper's bottom already gives", () => {
    expect(pads(page([sec(), sec()]))).toEqual([{}, { paddingTop: u(0) }]);
    expect(pads(page([sec({ paddingBottom: 48 }), sec()]))[1]).toEqual({ paddingTop: u(48) });
    expect(pads(page([sec(), sec()], { sectionY: 64 }))[1]).toEqual({ paddingTop: u(0), paddingBottom: u(64) });
    expect(pads(page([sec({ background: "#fde68a" }), sec({ background: "#fde68a" })]))[1]).toEqual({ paddingTop: u(0) });
  });
  it("another colour, a photo, a border, rounded corners or a shadow keep each band's own; so does a section keeping its own", () => {
    for (const other of [{ background: "#fde68a" }, { bgImage: "data:image/png;base64,AA" }, { borderWidth: 2 }, { radius: 16 }, { shadow: "md" as const }, { ownSpace: true }])
      expect(pads(page([sec(), sec(other)]))[1], JSON.stringify(other)).toEqual({});
  });
  it("LE15i-1: a block with no background shows the page's, so it shares with a section painted the page's colour", () => {
    expect(pads(page([sec({ background: "var(--eu-color-bg)" }), createContainer("column", { paddingTop: 96, children: [words("Mine")] })]))[1]).toEqual({ paddingTop: u(0) });
  });
  it("Page grid turns it off", () => {
    expect(pads(page([sec(), sec()], { noMerge: true }))).toEqual([{}, {}]);
  });
});

describe("SG-1 · a drag of a section's space on the canvas makes it keep its own", () => {
  it("its top or bottom inner space (or all four) — never a side or an outer space alone", () => {
    expect(spacePatch("padding", "Top", 64)).toEqual({ paddingTop: 64, ownSpace: true });
    expect(spacePatch("padding", "Bottom", 0)).toEqual({ paddingBottom: 0, ownSpace: true });
    expect(spacePatch("padding", "Left", 8, { all: true })).toEqual({ paddingLeft: 8, paddingTop: 8, paddingRight: 8, paddingBottom: 8, ownSpace: true });
    expect(spacePatch("padding", "Left", 8)).toEqual({ paddingLeft: 8 });
    expect(spacePatch("margin", "Top", 8)).toEqual({ marginTop: 8 });
  });
});

describe("LE15i-5 · LE15i-6 · the space in effect, as numbers — what the Inspector shows and what keeping its own starts from", () => {
  it("a section following the site reads the site's value; a shared top reads 0; the header nothing", () => {
    const root = page([sec({ tag: "header" }), sec(), sec()], { sectionY: 64 });
    const of = (i: number) => { const band = root.children![i]; return sectionSpaceOf(band, band.children![0], root, "base"); };
    expect(of(0)).toEqual({});
    expect(of(1)).toEqual({ top: 64, bottom: 64 });
    expect(of(2)).toEqual({ top: 0, bottom: 64 });
  });
});
