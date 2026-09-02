import { describe, it, expect } from "vitest";
import { PALETTES, PALETTE_CATEGORIES, palettesByCategory, SPECTRUM } from "@/lib/educo-ui/palettes";
import { rampFromHex, SHADES } from "@/lib/educo-ui/color";

const HEX = /^#[0-9a-fA-F]{6}$/;

describe("Educo UI palettes", () => {
  it("offers a large, uniquely-named library", () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(40);
    const names = PALETTES.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every palette has a valid primary + accent and a known category", () => {
    for (const p of PALETTES) {
      expect(p.patch.primary).toMatch(HEX);
      expect(p.patch.accent).toMatch(HEX);
      expect(PALETTE_CATEGORIES).toContain(p.category);
    }
  });

  it("dark-theme palettes also set surfaces and text", () => {
    const dark = PALETTES.filter((p) => p.category === "Dark themes");
    expect(dark.length).toBeGreaterThan(0);
    for (const p of dark) {
      expect(p.patch.background).toMatch(HEX);
      expect(p.patch.surface).toMatch(HEX);
      expect(p.patch.text).toMatch(HEX);
      expect(p.patch.textMuted).toMatch(HEX);
    }
  });

  it("groups by category with no palette lost", () => {
    const grouped = palettesByCategory();
    const total = PALETTE_CATEGORIES.reduce((n, c) => n + grouped[c].length, 0);
    expect(total).toBe(PALETTES.length);
    for (const c of PALETTE_CATEGORIES) expect(grouped[c].length).toBeGreaterThan(0);
  });

  it("the spectrum has 22 valid hues that each yield a full ramp", () => {
    expect(SPECTRUM.length).toBe(22);
    for (const s of SPECTRUM) {
      expect(s.hex).toMatch(HEX);
      expect(Object.keys(rampFromHex(s.hex))).toHaveLength(SHADES.length);
    }
  });
});
