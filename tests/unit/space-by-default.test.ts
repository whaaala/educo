import { describe, it, expect } from "vitest";
import type { CSSProperties } from "react";
import type { BoxNode } from "@/lib/box-model";
import { createContainer, createGrid, makeRowBand, createRoot, childStyle, paddingCSS, gapCSS, leafPaddingCSS, spaceDefaults, gapOf, SPACE_DEFAULT, u, padSide, isSectionContentIn, outerDefaults, outerSpaceCSS, isContainer, bandGutter } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";

import { DEFAULT_THEME } from "@/lib/site-storage";
import { renderPageHTML } from "@/lib/box-export";
/**
 * SPACE BY DEFAULT — words never touch an edge (CLAUDE.md rule 3; tests/features/components/website/box-builder-spacing.feature).
 * Enumerates the palette and the component catalogue, so a block added later is covered the day it appears.
 */

const PRIMITIVES = ["container", "row", "grid", "heading", "text", "button", "list", "image", "video", "divider", "spacer", "icon", "embed"];
const ALL_KINDS = [...PRIMITIVES, ...COMPONENT_CATALOGUE.map((c) => c.name)];

/** Every node in a subtree. */
const all = (n: BoxNode): BoxNode[] => [n, ...(n.children ?? []).flatMap(all)];

describe("every block added from now on carries the defaults", () => {
  it.each(ALL_KINDS)("%s is born spaced, with its spacing left unset", (kind) => {
    const block = blockForKind(kind);
    for (const n of all(block)) {
      if (n.rowBand) continue; // scaffolding: its space belongs to the blocks inside it
      expect(n.spaced, `${kind} → ${n.type} ${n.id}`).toBe(true);
    }
    // A stored 0 would read as the user's own zero and hide the default.
    if (kind === "container" || kind === "grid") expect([block.padding, block.gap]).toEqual([undefined, undefined]);
  });
});

describe("the defaults (the user's values, 2026-09-29)", () => {
  it("a stack has a gap down, a row a gap across, a grid both, a band none", () => {
    expect(gapCSS(createContainer("column"))).toEqual({ gap: u(SPACE_DEFAULT.stack) });
    expect(gapCSS(createContainer("row"))).toEqual({ gap: u(SPACE_DEFAULT.columns) });
    expect(gapOf(createGrid(3))).toEqual({ x: SPACE_DEFAULT.columns, y: SPACE_DEFAULT.stack });
    // A band's gap across is the columns' GUTTER (S1-a), never a flex gap — see "columns side by side" below.
    const col = () => createContainer("column", { children: [blockForKind("text")] });
    expect(gapCSS(makeRowBand([col(), col()]))).toEqual({ columnGap: u(0), rowGap: u(SPACE_DEFAULT.stack), "--bx-gut": u(SPACE_DEFAULT.columns) }); // the gutter, resolved once on the band (E0-e)
    expect(gapCSS(makeRowBand([col()]))).toEqual({ columnGap: u(0), rowGap: u(SPACE_DEFAULT.stack) }); // one column: nothing to keep apart (L2-b)
  });

  it("a box gets inner padding only once it has an edge you can see", () => {
    expect(spaceDefaults(createContainer("column")).pad).toEqual([0, 0, 0, 0]);
    for (const seen of [{ background: "#eee" }, { bgImage: "url(x)" }, { borderWidth: 1 }]) {
      expect(spaceDefaults(createContainer("column", seen)).pad).toEqual(Array(4).fill(SPACE_DEFAULT.inner));
    }
  });

  it("the content of a page section keeps the side gutter and the section space; a picture still bleeds", () => {
    const { section, gutter } = SPACE_DEFAULT;
    expect(spaceDefaults(createContainer("column"), true).pad).toEqual([section, gutter, section, gutter]);
    expect(spaceDefaults(blockForKind("heading"), true).pad).toEqual([section, gutter, section, gutter]);
    expect(spaceDefaults(blockForKind("image"), true).pad).toEqual([0, 0, 0, 0]);
    // The header and footer are slim bars (the user, 2026-09-30): 1rem above and below, the gutter at the sides.
    for (const tag of ["header", "footer"] as const) {
      expect(spaceDefaults(createContainer("row", { tag }), true).pad).toEqual([SPACE_DEFAULT.bar, gutter, SPACE_DEFAULT.bar, gutter]);
    }
  });

  it("is a section's content only one level down: a section inside a section is not inset twice", () => {
    const inner = createContainer("column", { children: [blockForKind("text")] });
    const outer = createContainer("column", { children: [makeRowBand([inner])] });
    const root = { ...createRoot(), children: [makeRowBand([outer])] };
    expect(isSectionContentIn(root, outer.id)).toBe(true);
    expect(isSectionContentIn(root, inner.id)).toBe(false);
    expect(isSectionContentIn(root, root.children[0].id)).toBe(false); // the band is scaffolding
  });

  it("the default is emitted in the unit system, never a pixel", () => {
    const css = Object.values(paddingCSS(createContainer("column"), true)).join(" ");
    expect(css).not.toMatch(/\d+px/);
    expect(css).toContain("--box-u");
  });
});

/**
 * S1-a — COLUMNS SIDE BY SIDE ON THE PAGE (the user, 2026-09-30): a 1rem gap between them, 1rem down when they wrap or
 * stack, and each column gives up its share so the line still fits. It is a GUTTER, not a flex gap: the band reaches
 * half a gap past each side and every column gives up one gap and takes half a gap of margin each side — so a line of
 * stored shares that adds up to 100% fits exactly however many columns share it, and a stored % means what it did.
 */
describe("columns side by side (S1-a)", () => {
  const G = SPACE_DEFAULT.columns;
  const GUT = "var(--bx-gut)"; // the band declares it (`gapCSS`); the reach and the columns read the ONE value (E0-e)
  const three = () => ["a", "b", "c"].map((id) => ({ ...createContainer("column", { children: [blockForKind("text")] }), id, width: "33.33%" }));

  it("a band made from now on has a 1rem gap across and down; an old one keeps none", () => {
    expect(gapOf(makeRowBand())).toEqual({ x: G, y: SPACE_DEFAULT.stack });
    const saved = { id: "b", type: "container", direction: "row", rowBand: true, gap: 0 } as BoxNode;
    expect(gapOf(saved)).toEqual({ x: 0, y: 0 });
    expect(gapCSS(saved)).toEqual({ gap: u(0) }); // byte for byte what it published before
  });

  it("the band reaches half a gap past each side, so the outer columns still meet the page edge", () => {
    const band = makeRowBand(three());
    const s = childStyle(band, createRoot());
    expect([s.marginLeft, s.marginRight]).toEqual([`calc(${GUT} * -0.5)`, `calc(${GUT} * -0.5)`]);
    expect(s.width).toBe(`calc(100% + ${GUT})`);
    expect(s.maxWidth).toBe("none");
  });

  it("each column gives up one gap and takes half a gap each side — a full line of shares fits exactly", () => {
    const band = makeRowBand(three());
    for (const c of band.children!) {
      const s = childStyle(c, band);
      // `%` resolves against the band, which is ALREADY the line plus one gap — so the slot is the share as stored
      expect(String(s.flex)).toContain(`calc(33.33% - ${GUT})`);
      expect([s.marginLeft, s.marginRight]).toEqual([`calc(0px + calc(${GUT} / 2))`, `calc(0px + calc(${GUT} / 2))`]);
      expect(s.minWidth).toBe(`min(100% - ${GUT}, 14rem)`);
    }
    // …and never wider than the line less one gap: `max-width: 100%` of the widened band let an Alert at fit width run
    // one gap (11px) past a 375 phone's edge (export-layout-invariants, 2026-09-30)
    for (const c of band.children!) expect(childStyle(c, band).maxWidth).toBe(`calc(100% - ${GUT})`);
    // Stacked on a phone, a column is the whole line less its gutter.
    expect(childStyle(band.children![0], band, "phone").minWidth).toBe(`calc(100% - ${GUT})`);
  });

  /**
   * The emitted CSS EVALUATED, not read: `%` is the band (the page plus one gap), the unit is 10px. A basis that added the
   * gap twice read plausibly and overflowed the line by one gap — the third column wrapped in the HEADED UAT, 2026-09-30.
   */
  // `var(--bx-gut)` is the band's `gapCSS` value — u(G) — evaluated with the same 10px unit
  const px = (css: string, band: number) => Function(`return ${css.replace(/var\(--bx-gut\)/g, `(${G / 10} * 10)`).replace(/var\(--box-u, 0\.625rem\)/g, "10").replace(/calc/g, "").replace(/(\d)px/g, "$1").replace(/(\d+(?:\.\d+)?)%/g, (_, n) => `(${n} * ${band} / 100)`)}`)() as number;
  it.each([[["33.33%", "33.33%", "33.34%"]], [["70%", "30%"]], [["25%", "25%", "25%", "25%"]]])("a full line of %j fits its band exactly, with a gap between each", (widths) => {
    const band = makeRowBand(widths.map((w, i) => ({ ...createContainer("column", { children: [blockForKind("text")] }), id: `k${i}`, width: w })));
    const B = 1280 + 16; // the page is 1280, the band reaches half a gap past each side
    const slots = band.children!.map((c) => { const s = childStyle(c, band); return px(String(s.flex).split(" ").slice(2).join(" "), B) + px(String(s.marginLeft), B) + px(String(s.marginRight), B); });
    expect(slots.reduce((a, b) => a + b, 0)).toBeCloseTo(B, 3);
    for (const c of band.children!) expect(px(String(childStyle(c, band).marginLeft), B) * 2).toBeCloseTo(G, 6); // one gap between two columns
  });

  it("a margin the user set on a column is kept, on top of its half gap", () => {
    const band = makeRowBand([{ ...createContainer("column"), id: "a", width: "50%", marginLeftPct: 10 }, { ...createContainer("column"), id: "b", width: "50%" }]);
    expect(childStyle(band.children![0], band).marginLeft).toBe(`calc(10% + calc(${GUT} / 2))`);
  });

  /**
   * L2-b: a gutter lies BETWEEN columns. A band of ONE column used to reach out by a gutter and take it back — invisible,
   * but each step rounds to the browser's 1/64px, and a menu hugging its links came out one unit short of them: "Contact"
   * wrapped on the published page at 7 of 20 widths. Measured in a browser by tests/e2e/canvas-scale-parity.spec.ts.
   */
  it("a band of ONE column has no gutter: no reach, no give-back, the column fills the band", () => {
    const band = makeRowBand([{ ...createContainer("column", { children: [blockForKind("text")] }), id: "only", width: "100%" }]);
    expect(bandGutter(band)).toBe(0);
    const reach = childStyle(band, createRoot());
    expect(String(reach.width)).not.toContain("--bx-gut"); // it fills its parent, it does not reach past it
    expect([reach.marginLeft, reach.marginRight]).toEqual([undefined, undefined]);
    const c = childStyle(band.children![0], band);
    expect(String(c.flex)).not.toContain("--bx-gut");
    expect(String(c.maxWidth ?? "")).not.toContain("--bx-gut");
    expect(c.marginLeft).toBeUndefined();
    // a floating block beside it is not a second column
    expect(bandGutter({ ...band, children: [...band.children!, { ...blockForKind("text"), position: "absolute" } as BoxNode] })).toBe(0);
  });

  it("an old band publishes its columns as before — no gutter; nobody sized them, so they may take what a line leaves (F-1)", () => {
    const saved = { id: "b", type: "container", direction: "row", rowBand: true, gap: 0, children: three() } as BoxNode;
    const s = childStyle(saved.children![0], saved);
    // the same share; the grow spends only space a wrap or a floor leaves, so a full line draws exactly as before
    expect(s.flex).toBe("1 1 33.33%");
    expect(s.marginLeft).toBeUndefined();
    expect(childStyle(saved, createRoot()).marginLeft).toBeUndefined();
  });
});

describe("E0-b: a line of menu links is spaced by the menu gap, the same on the canvas and the page", () => {
  const menu = () => {
    const links = ["About", "Admissions", "News", "Contact"].map((t) => ({ ...blockForKind("link"), text: t } as BoxNode));
    const line = makeRowBand(links);
    const list = createContainer("column", { tag: "ul", children: [line] });
    return { links, line, list };
  };
  it("the line gets 2rem across as LONGHANDS only — a `gap` key beside them made React drop both on the canvas", () => {
    const { line, list } = menu();
    const s = childStyle(line, list);
    expect("gap" in s).toBe(false);
    expect(s.columnGap).toBe("2rem");
  });
  it("its links take no columns' gutter on top of it (2rem apart, not 2rem + 1rem)", () => {
    const { links, line } = menu();
    for (const l of links) { const s = childStyle(l, line); expect(String(s.marginLeft ?? "")).not.toContain("calc"); expect(String(s.marginRight ?? "")).not.toContain("calc"); }
    expect(childStyle(line, menu().list).marginLeft).toBeUndefined(); // the line does not reach past its list either
  });
  it("a row of columns keeps its gutter", () => {
    const band = makeRowBand([createContainer("column"), createContainer("column")]);
    expect(String(childStyle(band.children![0], band).marginLeft)).toContain("calc");
  });
});

describe("E0-h: a column stretched by its host keeps its blocks at the top; the LAST takes the spare (the user, 2026-09-30)", () => {
  // `hostSized` = the column is as tall as its row because a neighbour is taller (or a shared edge was dragged)
  it("two blocks: the first keeps its size, the last takes the spare — nothing opens between them", () => {
    const cell = createContainer("column", { children: [makeRowBand([blockForKind("icon")]), makeRowBand([blockForKind("text")])] });
    expect(childStyle(cell.children![0], cell, "base", true).flex).not.toBe("1 1 auto");
    expect(childStyle(cell.children![1], cell, "base", true).flex).toBe("1 1 auto");
  });
  it("one block: it still fills the column, so a row of Cards stays equal height", () => {
    const cell = createContainer("column", { children: [makeRowBand([blockForKind("card")])] });
    expect(childStyle(cell.children![0], cell, "base", true).flex).toBe("1 1 auto");
  });
  it("a height the user SET still shares its space as before", () => {
    const sec = createContainer("column", { height: "30rem", children: [makeRowBand([blockForKind("icon")]), makeRowBand([blockForKind("text")])] } as Partial<BoxNode>);
    for (const band of sec.children!) expect(childStyle(band, sec).flex).toBe("1 1 auto");
  });
});

describe("always overridable, and saved pages keep what they had", () => {
  it("a stored 0 is the user's zero — on every side, and on the gap", () => {
    const n = createContainer("row", { background: "#eee", padding: 0, gap: 0 });
    expect(Object.values(paddingCSS(n, true))).toEqual(Array(4).fill(u(0)));
    expect(gapCSS(n)).toEqual({ gap: u(0) });
  });

  it("one side overrides, the others keep the default", () => {
    const n = createContainer("column", { background: "#eee", paddingLeft: 40 });
    expect(paddingCSS(n)).toEqual({ paddingTop: u(24), paddingRight: u(24), paddingBottom: u(24), paddingLeft: u(40) });
  });

  it("a block saved before space by default reads exactly as it did (padding 0, the old 16 gap, no leaf padding)", () => {
    const saved = { id: "s", type: "container", direction: "column", background: "#eee" } as BoxNode;
    expect(Object.values(paddingCSS(saved, true))).toEqual(Array(4).fill(u(0)));
    expect(gapCSS(saved)).toEqual({ gap: u(16) });
    expect(leafPaddingCSS({ id: "h", type: "heading", background: "#eee" } as BoxNode, true)).toEqual({});
  });

  it("a plain element can be given inner spacing (c-23), and the control reads what it has (c-24)", () => {
    const h = blockForKind("heading", { padding: 12 } as Partial<BoxNode>);
    expect(leafPaddingCSS(h)).toEqual({ paddingTop: u(12), paddingRight: u(12), paddingBottom: u(12), paddingLeft: u(12) });
    expect(padSide(blockForKind("text"), "Top")).toBe(0); // the bulk inspector showed 1.5rem for this
  });
});

describe("S-2 (5): a block that paints its own box keeps the section space OUTSIDE it", () => {
  // Every catalogue component (the `component` nodes AND the ones built as a tree — Card, Quote…) and the Button.
  const SELF_PAINTING = ["button", ...COMPONENT_CATALOGUE.map((c) => c.name)];
  const { section: s, gutter: g } = SPACE_DEFAULT;
  const margins = (t: number, r: number, b: number, l: number) => ({ marginTop: u(t), marginRight: u(r), marginBottom: u(b), marginLeft: u(l) });
  const pick = (css: CSSProperties) => Object.fromEntries(Object.entries(css).filter(([k]) => k.startsWith("margin")));

  it.each(SELF_PAINTING)("%s straight on the page: 1rem above and below and the gutter, as a margin outside its box", (kind) => {
    const b = blockForKind(kind);
    expect(outerDefaults(b, "page")).toEqual([s, g, s, g]); // what Outer spacing shows as its default
    expect(pick(outerSpaceCSS(b, "page"))).toEqual(margins(s, g, s, g));
    // …and the space is not ALSO put inside the box (a Card at the page's edge would be inset twice)
    expect(leafPaddingCSS(b, true)).toEqual({});
    if (isContainer(b)) expect(spaceDefaults(b, true).pad.every((v) => v === 0 || v === SPACE_DEFAULT.inner), kind).toBe(true);
  });

  it.each(SELF_PAINTING)("%s as a column of a band: 1rem above and below; the band's gutter spaces it across", (kind) => {
    expect(pick(outerSpaceCSS(blockForKind(kind), "band"))).toEqual({ marginTop: u(s), marginBottom: u(s) });
  });

  it.each(SELF_PAINTING)("%s inside a stack: the stack's gap spaces it, never a second space", (kind) => {
    expect(outerSpaceCSS(blockForKind(kind), undefined)).toEqual({});
  });

  it.each(SELF_PAINTING)("%s: a component's own inner spacing default is 0 — the control never shows space that is not drawn (S2-a)", (kind) => {
    const b = blockForKind(kind, { background: "#eee" } as Partial<BoxNode>);
    if (!isContainer(b)) expect(spaceDefaults(b, true).pad).toEqual([0, 0, 0, 0]);
  });

  it("a block that fills the line gives the side margins back from its width, so it never runs past the page", () => {
    const card = blockForKind("card");
    expect(card.width).toBe("100%");
    const css = outerSpaceCSS(card, "page");
    expect(css.width).toBe(`calc(100% - ${u(2 * g)})`);
    expect(css.maxWidth).toBe(css.width);
    expect(outerSpaceCSS(blockForKind("button"), "page").width).toBeUndefined(); // a button hugs its words
  });

  it("Outer spacing overrides it: one side set, that side's default goes; all set to 0 → nothing", () => {
    expect(pick(outerSpaceCSS(blockForKind("button", { marginTop: 4 } as Partial<BoxNode>), "page"))).toEqual({ marginRight: u(g), marginBottom: u(s), marginLeft: u(g) });
    expect(outerSpaceCSS(blockForKind("button", { margin: 0 } as Partial<BoxNode>), "page")).toEqual({});
  });

  it("a plain Stack or a coloured section gets none — coloured sections still meet edge to edge", () => {
    expect(outerDefaults(blockForKind("container", { background: "#eee" } as Partial<BoxNode>), "page")).toEqual([0, 0, 0, 0]);
    expect(outerDefaults(blockForKind("heading"), "page")).toEqual([0, 0, 0, 0]);
  });

  it("a block saved before this change publishes exactly as it did", () => {
    expect(outerSpaceCSS({ id: "c", type: "component", component: "alert" } as BoxNode, "page")).toEqual({});
    expect(outerSpaceCSS({ id: "b", type: "button" } as BoxNode, "page")).toEqual({});
    expect(outerSpaceCSS({ id: "k", type: "container", preset: "card", padding: 24 } as BoxNode, "page")).toEqual({});
  });

  it("the published page carries it: a Card and a Button on the page, 1rem apart from each other", () => {
    const root = createRoot();
    root.children = [blockForKind("card"), blockForKind("button")];
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain(`margin-top:${u(s)}`);
    expect(html).toContain(`width:calc(100% - ${u(2 * g)})`);
  });

  // S2-f — the shape the UI BUILDS: a block dropped on the page lands as a column of a page band, never straight on it.
  const bandRule = (html: string, band: BoxNode) => html.match(new RegExp(`\\.bx-${band.id}\\{[^}]*\\}`))?.[0] ?? "";
  it.each(SELF_PAINTING)("S2-f: %s dropped on the page (a column of a page band) keeps the gutter from both page edges", (kind) => {
    const band = makeRowBand([blockForKind(kind)]);
    const html = renderPageHTML({ ...createRoot(), children: [band] }, DEFAULT_THEME);
    expect(bandRule(html, band)).toContain(`padding-left:${u(g)}`);
    expect(bandRule(html, band)).toContain(`padding-right:${u(g)}`);
  });

  it("S2-f: a band of coloured sections still bleeds; a band inside a stack, a saved block and Outer spacing set across get no inset", () => {
    const html = (band: BoxNode, deep = false) => bandRule(renderPageHTML({ ...createRoot(), children: [deep ? makeRowBand([createContainer("column", { children: [band] })]) : band] }, DEFAULT_THEME), band);
    expect(html(makeRowBand([blockForKind("container", { background: "#eee" } as Partial<BoxNode>)]))).not.toContain(`padding-left:${u(g)}`);
    expect(html(makeRowBand([blockForKind("card")]), true)).not.toContain(`padding-left:${u(g)}`);
    expect(html(makeRowBand([{ id: "b", type: "button" } as BoxNode]))).not.toContain(`padding-left:${u(g)}`);
    expect(html(makeRowBand([blockForKind("button", { marginLeft: 0 } as Partial<BoxNode>)]))).not.toContain(`padding-left:${u(g)}`);
  });
});

describe("a Divider's thickness is its LINE, not a box edge (L3-r)", () => {
  it("setting the thickness gives the Divider no inner padding — the line stays level with the words beside it", () => {
    // measured: Thickness 8 through the Inspector gave the Divider's box 27.36px each side, the line 28px in from the heading
    for (const t of [1, 2, 8, 20]) {
      const d = { ...blockForKind("divider", { id: "d" } as Partial<BoxNode>), spaced: true, borderWidth: t };
      // no space at the SIDES (the line is level with the words) · half a stack gap above and below, so a hand can drop under it (L3-s)
      expect(spaceDefaults(d).pad, `thickness ${t}`).toEqual([8, 0, 8, 0]);
    }
    // …while a box with a real border keeps its inner padding
    expect(spaceDefaults({ ...createContainer("column"), spaced: true, borderWidth: 2 }).pad).not.toEqual([0, 0, 0, 0]);
  });
});
