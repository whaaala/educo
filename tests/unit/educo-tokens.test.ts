import { describe, it, expect } from "vitest";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { contrastRatio, SHADES } from "@/lib/educo-ui/color";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("Educo UI tokens — from theme", () => {
  const t = tokensFromTheme(DEFAULT_THEME);

  it("builds full ramps (every shade step) for primary, accent and neutral", () => {
    for (const ramp of [t.color.primary, t.color.accent, t.color.neutral]) {
      expect(Object.keys(ramp)).toHaveLength(SHADES.length);
      expect(ramp[500]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it("maps surfaces + fonts straight from the SiteTheme", () => {
    expect(t.color.bg).toBe(DEFAULT_THEME.background);
    expect(t.color.text).toBe(DEFAULT_THEME.text);
    expect(t.color.brand).toBe(DEFAULT_THEME.primary);
    expect(t.font.heading).toBe(DEFAULT_THEME.headingFont);
    expect(t.font.body).toBe(DEFAULT_THEME.bodyFont);
  });
  it("derives a brand-tinted neutral (low but non-grey chroma) for borders", () => {
    expect(t.color.border).toBe(t.color.neutral[200]);
    expect(t.color.border).toMatch(/^#[0-9a-f]{6}$/);
  });
  it("exposes a rem type scale, weights and spacing", () => {
    expect(t.text.base).toBe("1rem");
    expect(t.text["3xl"]).toBe("1.875rem");
    expect(t.weight.bold).toBe("700");
    expect(t.space["4"]).toBe("1rem");
  });
  it("scales radius from the theme radius", () => {
    expect(t.radius.lg).toBe(`${DEFAULT_THEME.radius}px`);
    expect(t.radius.full).toBe("9999px");
  });
  it("default body text on background clears WCAG AA", () => {
    expect(contrastRatio(t.color.text, t.color.bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Educo UI tokens — to CSS", () => {
  const css = tokensToCss(tokensFromTheme(DEFAULT_THEME));

  it("wraps everything in the given selector", () => {
    expect(css.startsWith(":root{")).toBe(true);
    expect(css.endsWith("}")).toBe(true);
  });
  it("emits colour ramp, font, type, spacing and radius variables", () => {
    expect(css).toContain("--eu-color-primary-500:#");
    expect(css).toContain("--eu-color-neutral-950:#");
    expect(css).toContain("--eu-color-bg:");
    expect(css).toContain("--eu-font-heading:");
    expect(css).toContain("--eu-text-base:1rem;");
    expect(css).toContain("--eu-space-4:1rem;");
    expect(css).toContain("--eu-radius-lg:");
    expect(css).toContain("--eu-shadow-md:");
    expect(css).toContain("--eu-dur-base:");
    expect(css).toContain("--eu-ease-standard:");
  });
  it("honours a custom selector", () => {
    const scoped = tokensToCss(tokensFromTheme(DEFAULT_THEME), ".eu-root");
    expect(scoped.startsWith(".eu-root{")).toBe(true);
  });
});
