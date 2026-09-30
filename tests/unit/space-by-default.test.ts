import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { createContainer, createGrid, makeRowBand, createRoot, paddingCSS, gapCSS, leafPaddingCSS, spaceDefaults, gapOf, SPACE_DEFAULT, u, padSide, isSectionContentIn } from "@/lib/box-model";
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
    expect(gapCSS(makeRowBand())).toEqual({ gap: u(0) });
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
