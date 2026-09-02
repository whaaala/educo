import { describe, it, expect } from "vitest";
import { getPresets, blockForKind, presetKindFor } from "@/lib/box-presets";
import { createContainer, createGrid, createElement, type BoxNode } from "@/lib/box-model";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("box-presets", () => {
  it("presetKindFor maps a node to its preset family", () => {
    expect(presetKindFor(createContainer("column"))).toBe("container");
    expect(presetKindFor(createGrid(3))).toBe("grid");
    expect(presetKindFor(createElement("button"))).toBe("button");
    expect(presetKindFor(createElement("heading"))).toBe("heading");
  });

  it("getPresets returns theme-aware variations for the main block kinds", () => {
    for (const kind of ["button", "heading", "text", "grid", "divider", "image", "video", "icon", "container"]) {
      expect(getPresets(kind, DEFAULT_THEME).length).toBeGreaterThan(0);
    }
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

  it("blockForKind builds COMPOSITE blocks (Card, Quote, Stats, Rating) as ready-made trees", () => {
    const card = blockForKind("card");
    const kinds = (card.children ?? []).map((c) => c.type);
    expect(kinds).toEqual(["image", "heading", "text", "button"]); // a real card
    expect(card.shadow).toBe("md");
    const rating = blockForKind("rating");
    expect((rating.children ?? []).filter((c) => c.type === "icon")).toHaveLength(5); // five stars
    const stats = blockForKind("stats");
    expect((stats.children ?? [])[0].type).toBe("heading");
  });
});
