import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { createContainer, createGrid, makeRowBand, createRoot, childStyle, paddingCSS, gapCSS, leafPaddingCSS, spaceDefaults, gapOf, SPACE_DEFAULT, u, padSide, isSectionContentIn } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";

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
    expect(gapCSS(makeRowBand())).toEqual({ columnGap: u(0), rowGap: u(SPACE_DEFAULT.stack) });
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
    expect([s.marginLeft, s.marginRight]).toEqual([u(-G / 2), u(-G / 2)]);
    expect(s.width).toBe(`calc(100% + ${u(G)})`);
    expect(s.maxWidth).toBe("none");
  });

  it("each column gives up one gap and takes half a gap each side — a full line of shares fits exactly", () => {
    const band = makeRowBand(three());
    for (const c of band.children!) {
      const s = childStyle(c, band);
      // `%` resolves against the band, which is ALREADY the line plus one gap — so the slot is the share as stored
      expect(String(s.flex)).toContain(`calc(33.33% - ${u(G)})`);
      expect([s.marginLeft, s.marginRight]).toEqual([`calc(0px + ${u(G / 2)})`, `calc(0px + ${u(G / 2)})`]);
      expect(s.minWidth).toBe(`min(100% - ${u(G)}, 14rem)`);
    }
    // …and never wider than the line less one gap: `max-width: 100%` of the widened band let an Alert at fit width run
    // one gap (11px) past a 375 phone's edge (export-layout-invariants, 2026-09-30)
    for (const c of band.children!) expect(childStyle(c, band).maxWidth).toBe(`calc(100% - ${u(G)})`);
    // Stacked on a phone, a column is the whole line less its gutter.
    expect(childStyle(band.children![0], band, "phone").minWidth).toBe(`calc(100% - ${u(G)})`);
  });

  /**
   * The emitted CSS EVALUATED, not read: `%` is the band (the page plus one gap), the unit is 10px. A basis that added the
   * gap twice read plausibly and overflowed the line by one gap — the third column wrapped in the HEADED UAT, 2026-09-30.
   */
  const px = (css: string, band: number) => Function(`return ${css.replace(/var\(--box-u, 0\.625rem\)/g, "10").replace(/calc/g, "").replace(/(\d)px/g, "$1").replace(/(\d+(?:\.\d+)?)%/g, (_, n) => `(${n} * ${band} / 100)`)}`)() as number;
  it.each([[["33.33%", "33.33%", "33.34%"]], [["70%", "30%"]], [["25%", "25%", "25%", "25%"]], [["100%"]]])("a full line of %j fits its band exactly, with a gap between each", (widths) => {
    const band = makeRowBand(widths.map((w, i) => ({ ...createContainer("column", { children: [blockForKind("text")] }), id: `k${i}`, width: w })));
    const B = 1280 + 16; // the page is 1280, the band reaches half a gap past each side
    const slots = band.children!.map((c) => { const s = childStyle(c, band); return px(String(s.flex).split(" ").slice(2).join(" "), B) + px(String(s.marginLeft), B) + px(String(s.marginRight), B); });
    expect(slots.reduce((a, b) => a + b, 0)).toBeCloseTo(B, 3);
    for (const c of band.children!) expect(px(String(childStyle(c, band).marginLeft), B) * 2).toBeCloseTo(G, 6); // one gap between two columns
  });

  it("a margin the user set on a column is kept, on top of its half gap", () => {
    const band = makeRowBand([{ ...createContainer("column"), id: "a", width: "50%", marginLeftPct: 10 }]);
    expect(childStyle(band.children![0], band).marginLeft).toBe(`calc(10% + ${u(G / 2)})`);
  });

  it("an old band publishes its columns exactly as before — no gutter", () => {
    const saved = { id: "b", type: "container", direction: "row", rowBand: true, gap: 0, children: three() } as BoxNode;
    const s = childStyle(saved.children![0], saved);
    expect(s.flex).toBe("0 1 33.33%");
    expect(s.marginLeft).toBeUndefined();
    expect(childStyle(saved, createRoot()).marginLeft).toBeUndefined();
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
