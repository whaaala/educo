import { describe, it, expect } from "vitest";
import {
  SHADES, hexToRgb, rgbToHex, hexToOklch, oklchToHex,
  rampFromHex, relativeLuminance, contrastRatio, passesAA, nearestAccessibleColor,
} from "@/lib/educo-ui/color";

describe("Educo UI colour — hex/rgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#4f46e5")).toEqual({ r: 0x4f, g: 0x46, b: 0xe5 });
  });
  it("expands 3-digit shorthand", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("drops an alpha channel", () => {
    expect(hexToRgb("#4f46e5ff")).toEqual({ r: 0x4f, g: 0x46, b: 0xe5 });
  });
  it("round-trips rgb → hex → rgb", () => {
    for (const hex of ["#000000", "#ffffff", "#4f46e5", "#7c3aed", "#16a34a"]) {
      expect(rgbToHex(hexToRgb(hex))).toBe(hex);
    }
  });
  it("clamps out-of-range channels", () => {
    expect(rgbToHex({ r: 300, g: -20, b: 128 })).toBe("#ff0080");
  });
});

describe("Educo UI colour — OKLCH round-trip", () => {
  it("returns to (nearly) the same hex through OKLCH", () => {
    for (const hex of ["#4f46e5", "#7c3aed", "#0f172a", "#f8fafc", "#dc2626"]) {
      const back = hexToRgb(oklchToHex(hexToOklch(hex)));
      const orig = hexToRgb(hex);
      expect(Math.abs(back.r - orig.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.g - orig.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.b - orig.b)).toBeLessThanOrEqual(2);
    }
  });
  it("black and white sit at the lightness extremes", () => {
    expect(hexToOklch("#000000").L).toBeCloseTo(0, 2);
    expect(hexToOklch("#ffffff").L).toBeCloseTo(1, 2);
  });
});

describe("Educo UI colour — ramp", () => {
  const ramp = rampFromHex("#4f46e5");
  it("has one valid hex per shade step", () => {
    expect(Object.keys(ramp)).toHaveLength(SHADES.length);
    expect(SHADES.length).toBeGreaterThanOrEqual(20); // extended 25 → 1000 scale
    for (const s of SHADES) expect(ramp[s]).toMatch(/^#[0-9a-f]{6}$/);
  });
  it("gets darker as the shade number rises", () => {
    for (let i = 1; i < SHADES.length; i++) {
      expect(relativeLuminance(ramp[SHADES[i]])).toBeLessThan(relativeLuminance(ramp[SHADES[i - 1]]));
    }
  });
  it("keeps the seed hue roughly constant across the ramp", () => {
    const h0 = hexToOklch("#4f46e5").h;
    for (const s of [200, 500, 800] as const) {
      expect(Math.abs(hexToOklch(ramp[s]).h - h0)).toBeLessThan(12);
    }
  });
});

describe("Educo UI colour — WCAG contrast", () => {
  it("black on white is the maximum 21:1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
  });
  it("identical colours are 1:1", () => {
    expect(contrastRatio("#777777", "#777777")).toBe(1);
  });
  it("is order-independent", () => {
    expect(contrastRatio("#0f172a", "#ffffff")).toBe(contrastRatio("#ffffff", "#0f172a"));
  });
  it("passesAA reflects the 4.5 / 3.0 thresholds", () => {
    expect(passesAA("#0f172a", "#ffffff")).toBe(true);   // dark text on white
    expect(passesAA("#9ca3af", "#ffffff")).toBe(false);  // light grey on white fails body
    expect(passesAA("#9ca3af", "#ffffff", true)).toBe(false);
  });
});

describe("Educo UI colour — nearest accessible fix", () => {
  it("leaves an already-passing colour unchanged", () => {
    expect(nearestAccessibleColor("#0f172a", "#ffffff")).toBe("#0f172a");
  });
  it("darkens a too-light foreground on a light background until it clears AA", () => {
    const fixed = nearestAccessibleColor("#9ca3af", "#ffffff"); // light grey on white (fails)
    expect(contrastRatio(fixed, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(relativeLuminance(fixed)).toBeLessThan(relativeLuminance("#9ca3af")); // it got darker
  });
  it("lightens a too-dark foreground on a dark background", () => {
    const fixed = nearestAccessibleColor("#334155", "#0f172a"); // slate on near-black (fails)
    expect(contrastRatio(fixed, "#0f172a")).toBeGreaterThanOrEqual(4.5);
    expect(relativeLuminance(fixed)).toBeGreaterThan(relativeLuminance("#334155")); // it got lighter
  });
  it("honours a custom (large-text) ratio of 3", () => {
    const fixed = nearestAccessibleColor("#b0b0b0", "#ffffff", 3);
    expect(contrastRatio(fixed, "#ffffff")).toBeGreaterThanOrEqual(3);
  });
});
