import { describe, it, expect } from "vitest";
import { BG_PRESETS, GRADIENTS, MESH, PATTERNS, BG_GROUPS, bgPresetById } from "@/lib/educo-ui/backgrounds";

describe("educo-ui backgrounds — the self-contained background library", () => {
  it("bundles a sizeable, well-formed library across all groups", () => {
    expect(BG_PRESETS.length).toBeGreaterThanOrEqual(GRADIENTS.length + MESH.length + PATTERNS.length); // + themed
    expect(BG_PRESETS.length).toBeGreaterThanOrEqual(120); // a genuinely large library
    expect(GRADIENTS.length).toBeGreaterThanOrEqual(60);
    expect(MESH.length).toBeGreaterThanOrEqual(15);
    expect(PATTERNS.length).toBeGreaterThanOrEqual(20);
    // every preset has a stable id, a human label and a CSS value
    for (const p of BG_PRESETS) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.css.length).toBeGreaterThan(0);
    }
  });

  it("ids are unique (so selection + lookup are deterministic)", () => {
    const ids = BG_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no preset ends in a bare colour layer (that blanks the whole background-image)", () => {
    // background-image layers must be gradients/urls — a trailing bare colour invalidates the ENTIRE property.
    for (const p of BG_PRESETS) {
      expect(/,\s*(#[0-9a-fA-F]{3,8}|var\(--[^)]+\)|rgb\([^)]*\))\s*$/.test(p.css), `${p.id} ends in a bare colour`).toBe(false);
      expect(p.css.trim().endsWith(")"), `${p.id} css should end with a closed function`).toBe(true);
    }
  });

  it("gradients & mesh are gradient CSS (fill); patterns carry a tile and use currentColor (themeable)", () => {
    for (const p of [...GRADIENTS, ...MESH]) expect(p.css).toMatch(/gradient\(/);
    for (const p of PATTERNS) {
      expect(p.tile, `${p.id} needs a tile`).toBeTruthy();
      expect(p.css).toContain("currentColor"); // inherits the block's colour → re-themes
    }
  });

  it("groups list matches the preset groups; lookup by id works", () => {
    const groupIds = new Set(BG_GROUPS.map((g) => g.id));
    for (const p of BG_PRESETS) expect(groupIds.has(p.group)).toBe(true);
    expect(bgPresetById("dots")?.group).toBe("pattern");
    expect(bgPresetById("nope")).toBeUndefined();
  });
});
