import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, childStyle, textLen, textUnit, TYPE_UNIT_PROPERTY_CSS, t, u, type BoxNode } from "@/lib/box-model";
import { LAYOUT_CSS } from "@/lib/educo-ui/layout";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * THE FOUR LAYOUT DECISIONS OF 2026-09-28 (the user chose 1D · 2A · 3A · 4A after the dressed sweep) — behaviours in
 * tests/features/components/website/box-builder-layout.feature and box-builder-responsive.feature. 2A (hidden blocks
 * leave the canvas) is a canvas behaviour and is guarded in tests/e2e/hidden-blocks-leave-the-canvas.spec.ts.
 */
describe("1D — one pixel of slack on a line that holds a hand-sized column", () => {
  const row = (kids: BoxNode[]) => { const r = makeRowBand(kids, 0); return r; };
  const col = (width: string, byHand: boolean, extra: Partial<BoxNode> = {}) => createContainer("column", { width, widthByHand: byHand, children: [createElement("text", { text: "words" })], ...extra });
  it("the LAST column of the line carries a −0.0625rem right margin; every share stays exactly what was dragged", () => {
    const a = col("30%", true), b = col("70%", true);
    const r = row([a, b]);
    expect(childStyle(a, r).flex).toBe("0 1 30%");
    expect(childStyle(a, r).marginRight).toBeUndefined();
    expect(childStyle(b, r).flex).toBe("0 1 70%");
    expect(childStyle(b, r).marginRight).toBe("-0.0625rem");
  });
  it("a line with no hand-sized column gets no slack — its floors are 14rem, not a word", () => {
    const a = col("50%", false), b = col("50%", false);
    const r = row([a, b]);
    expect(childStyle(b, r).marginRight).toBeUndefined();
  });
  it("a right margin the user set on that column is left alone", () => {
    const a = col("30%", true), b = col("70%", true, { marginRight: 24 });
    expect(childStyle(b, row([a, b])).marginRight).not.toBe("-0.0625rem");
  });
  it("the slack is in rem, never a pixel (rule 16)", () => {
    const a = col("30%", true), b = col("70%", true);
    expect(String(childStyle(b, row([a, b])).marginRight)).not.toMatch(/\dpx/);
  });
});

describe("3A — type scales with the page, spacing with the box", () => {
  it("text sizes are written in the TYPE unit, spacing in the box unit", () => {
    expect(textUnit()).toBe(`max(1rem, ${t(16)})`);
    expect(textLen(22)).toBe(`max(1.1875rem, ${t(22)})`);
    expect(t(16)).toContain("var(--box-t");
    expect(u(16)).toContain("var(--box-u");
    expect(u(16)).not.toContain("--box-t");
  });
  it("the type unit is a registered length that inherits, with a zero initial value (no stored pixel)", () => {
    expect(TYPE_UNIT_PROPERTY_CSS).toBe("@property --box-t{syntax:'<length>';inherits:true;initial-value:0px}");
  });
  it("the published page's root is a size container, so the unit reads the page's content width — not the window with its scrollbar (#137)", async () => {
    const { BASE_CSS } = await import("@/lib/educo-ui/base");
    expect(BASE_CSS).toMatch(/\.eu-root \{ container-type: inline-size; \}/);
  });
  it("the export registers it and sets it on the page root beside the box unit", () => {
    const root = createContainer("column", { id: "page", width: "fill", children: [createElement("heading", { text: "Title" })] });
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain(TYPE_UNIT_PROPERTY_CSS);
    expect(html).toMatch(/--box-t:clamp\(/);
    expect(html).toMatch(/--box-u:clamp\(/);
  });
});

describe("4A — the fluid spacing tokens carry a rem in their ideal term", () => {
  it("every one of the four is clamp(min, <rem> + <cqw>, max)", () => {
    for (const name of ["--eu-gutter-page", "--eu-gap-section", "--eu-gap-group", "--eu-gap-element"]) {
      const m = new RegExp(`${name}:\\s*clamp\\(([\\d.]+)rem,\\s*([\\d.]+)rem \\+ ([\\d.]+)cqw,\\s*([\\d.]+)rem\\)`).exec(LAYOUT_CSS);
      expect(m, `${name} carries rem + cqw`).not.toBeNull();
      expect(+m![2], `${name}: the rem term is real`).toBeGreaterThan(0);
    }
    const rules = LAYOUT_CSS.replace(/\/\*[\s\S]*?\*\//g, ""); // the CSS itself, not its comments
    expect(rules).not.toMatch(/clamp\([^)]*,\s*[\d.]+cqw,/); // no bare container term anywhere in the layer
    expect(rules).not.toMatch(/[\d.]+vw/); // and nothing reads the window (#117)
  });
});
