import { describe, it, expect } from "vitest";
import { FONT_FAMILIES, FONT_CATEGORIES, FONT_WEIGHTS, FONT_SIZES, LETTER_SPACING, familyOptions } from "@/lib/educo-ui/fonts";

describe("Educo UI fonts", () => {
  it("offers a large, uniquely-named family list", () => {
    expect(FONT_FAMILIES.length).toBeGreaterThanOrEqual(40);
    const names = FONT_FAMILIES.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every family has a valid stack (name + fallback) and a known category", () => {
    for (const f of FONT_FAMILIES) {
      expect(f.stack).toContain(f.name);
      // multi-word names must be quoted; single-word names are bare
      if (f.name.includes(" ")) expect(f.stack).toContain(`'${f.name}'`);
      expect(f.stack).toMatch(/,\s*(sans-serif|serif|cursive|monospace)$/);
      expect(FONT_CATEGORIES).toContain(f.category);
    }
  });

  it("covers all five categories", () => {
    for (const c of FONT_CATEGORIES) {
      expect(FONT_FAMILIES.some((f) => f.category === c)).toBe(true);
    }
  });

  it("exposes the full 100–900 weight ladder", () => {
    expect(FONT_WEIGHTS.map((w) => w.value)).toEqual([100, 200, 300, 400, 500, 600, 700, 800, 900]);
  });

  it("exposes an ascending rem size scale with px equivalents", () => {
    expect(FONT_SIZES.length).toBe(10);
    for (let i = 1; i < FONT_SIZES.length; i++) {
      expect(FONT_SIZES[i].px).toBeGreaterThan(FONT_SIZES[i - 1].px);
    }
    expect(FONT_SIZES.find((s) => s.name === "base")?.px).toBe(16);
  });

  it("exposes a letter-spacing scale in em units, including a normal step", () => {
    expect(LETTER_SPACING.length).toBeGreaterThanOrEqual(5);
    for (const l of LETTER_SPACING) expect(l.em).toMatch(/^-?\d*\.?\d+em$/);
    expect(LETTER_SPACING.some((l) => l.name === "normal" && l.em === "0em")).toBe(true);
    const names = LETTER_SPACING.map((l) => l.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("familyOptions maps value=stack and a searchable label", () => {
    const opts = familyOptions();
    expect(opts).toHaveLength(FONT_FAMILIES.length);
    expect(opts[0].value).toBe(FONT_FAMILIES[0].stack);
    expect(opts[0].label).toContain(FONT_FAMILIES[0].name);
  });
});
