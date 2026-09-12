import { describe, it, expect } from "vitest";
import { getPresets, blockForKind, presetKindFor, gridLayoutPatch, GRID_LAYOUTS } from "@/lib/box-presets";
import { createContainer, createGrid, createElement, type BoxNode } from "@/lib/box-model";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("box-presets", () => {
  it("presetKindFor maps a node to its preset family", () => {
    expect(presetKindFor(createContainer("column"))).toBe("container");
    // A GRID takes the container LOOKS. Its shape is the Arrange panel's Columns control, which re-cuts the
    // row without moving its blocks; a Styles preset that set `columns` straight would leave every span
    // pointing at tracks that no longer existed. See tests/unit/twelve-columns.test.ts.
    expect(presetKindFor(createGrid(3))).toBe("container");
    expect(presetKindFor(createElement("button"))).toBe("button");
    expect(presetKindFor(createElement("heading"))).toBe("heading");
  });

  it("getPresets returns theme-aware variations for the main block kinds", () => {
    // "grid" is deliberately absent: a row's shape is not a look, so it has no restyle presets of its own.
    for (const kind of ["button", "heading", "text", "divider", "image", "video", "icon", "container"]) {
      expect(getPresets(kind, DEFAULT_THEME).length).toBeGreaterThan(0);
    }
    expect(getPresets("grid", DEFAULT_THEME)).toEqual([]);
    expect(getPresets("nonexistent", DEFAULT_THEME)).toEqual([]);
    // an Outline button preset flips to a transparent fill + coloured border
    const outline = getPresets("button", DEFAULT_THEME).find((p) => p.id === "outline")!;
    expect(outline.patch.borderWidth).toBeGreaterThan(0);
    expect(outline.patch.borderColor).toBe(DEFAULT_THEME.primary);
  });

  it("blockForKind builds a fresh node for a kind and applies a preset patch", () => {
    const row = blockForKind("row"); expect(row.type).toBe("container"); expect(row.direction).toBe("row");
    const grid = blockForKind("grid"); expect(grid.layout).toBe("grid");
    const section = blockForKind("container"); expect(section.type).toBe("container"); expect(section.direction).toBe("column");
    const btn = blockForKind("button", { radius: 8, background: "#123456" } as Partial<BoxNode>);
    expect(btn.type).toBe("button"); expect(btn.radius).toBe(8); expect(btn.background).toBe("#123456");
    const spacer = blockForKind("spacer"); expect(spacer.type).toBe("spacer"); expect(spacer.height).toBe("48px");
  });

  it("blockForKind builds Card/Quote/Stat/Rating as EDITABLE TREES — every inner piece is a real, editable BoxNode", () => {
    // a Card = image + heading + text + button, each a normal element you can select + fully style
    const card = blockForKind("card");
    expect(card.type).toBe("container");
    expect((card.children ?? []).map((c) => c.type)).toEqual(["image", "heading", "text", "button"]);
    // a Quote = two editable text elements (quote + author)
    expect((blockForKind("quote").children ?? []).every((c) => c.type === "text")).toBe(true);
    // a Stat = heading (value) + text (label)
    expect((blockForKind("stat").children ?? []).map((c) => c.type)).toEqual(["heading", "text"]);
    // a Rating = five editable star icons
    expect((blockForKind("rating").children ?? []).filter((c) => c.type === "icon")).toHaveLength(5);
    // every composite uses design TOKENS (no hardcoded hex) so it re-themes + passes WCAG
    const hex = (n: BoxNode): boolean => /#([0-9a-f]{3}|[0-9a-f]{6})\b/i.test(JSON.stringify(n));
    for (const kind of ["card", "quote", "stat", "badge", "rating"]) expect(hex(blockForKind(kind))).toBe(false);
  });

  it("blockForKind builds a Badge as a padded pill around an editable text element", () => {
    // It was a SINGLE text element carrying padding — but `paddingCSS` is only applied by `containerStyle`,
    // so an element never renders padding. The pill had no breathing room and CLIPPED its own text by 4px
    // (wrapper hugged to 27px, text needed 31px, overflow hidden). The padding has to live on a container.
    const badge = blockForKind("badge");
    expect(badge.type).toBe("container");
    expect(badge.radius).toBeGreaterThan(0);                 // still a pill
    expect(badge.paddingLeft ?? badge.padding).toBeGreaterThan(0); // and the padding now actually renders
    const text = (badge.children ?? [])[0];
    expect(text?.type).toBe("text");                          // the label is still a fully-editable element
    expect(text?.text).toBeTruthy();
  });

  it("the Accordion stays a component (its items edit inline)", () => {
    expect(blockForKind("accordion").type).toBe("component");
  });
});

describe("a Columns block never chooses its own shape", () => {
  it("blockForKind('grid') with no shape is ONE undivided cell", () => {
    // Two bugs came from this default, from opposite directions. `createGrid(3)` had no children at all —
    // an empty shell with nothing to click, resize or fill. Replacing it with two equal cells fixed that and
    // broke something else: a dropped Columns block divided the section in two without being asked. The only
    // honest default is a grid that is undivided but real — one cell, spanning the full twelve.
    const g = blockForKind("grid");
    expect(g.layout).toBe("grid");
    expect(g.children).toHaveLength(1);
    expect(g.children?.[0].colSpan).toBe(12);
  });

  it("gridLayoutPatch returns fresh cells, so two picks never share an id", () => {
    const a = gridLayoutPatch("sidebar-left");
    const b = gridLayoutPatch("sidebar-left");
    expect(a?.children?.map((c) => c.colSpan)).toEqual([4, 8]);
    expect(a?.columns).toBe(12);
    expect(a?.children?.[0].id).not.toBe(b?.children?.[0].id);
    expect(gridLayoutPatch("no-such-split")).toBeNull();
  });

  it("every offered split fills the twelve exactly", () => {
    for (const l of GRID_LAYOUTS) {
      expect(l.spans.reduce((s, n) => s + n, 0), `${l.id} must fill the twelve`).toBe(12);
    }
  });
});
