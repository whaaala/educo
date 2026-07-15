import { describe, it, expect } from "vitest";
import { createChartSpec, CHART_TYPES, chartToSvgString } from "@/lib/chart";

describe("chartToSvgString — shared static renderer (mobile / embeds / exports)", () => {
  it("produces a valid, non-empty SVG for every one of the 19 chart types", () => {
    for (const t of CHART_TYPES) {
      const svg = chartToSvgString(createChartSpec(t), { theme: "light", uid: t });
      expect(svg.startsWith("<svg"), `${t} should start with <svg`).toBe(true);
      expect(svg.trim().endsWith("</svg>"), `${t} should close`).toBe(true);
      // balanced-ish: has a viewBox and some drawn primitive
      expect(svg).toContain("viewBox=");
      expect(/<(rect|path|circle|polygon|line|text)\b/.test(svg), `${t} should draw something`).toBe(true);
      // no NaN / undefined leaking into attributes
      expect(svg.includes("NaN"), `${t} must not emit NaN`).toBe(false);
      expect(svg.includes("undefined"), `${t} must not emit undefined`).toBe(false);
    }
  });

  it("respects theme tokens (dark grid differs from light)", () => {
    const spec = createChartSpec("column");
    const light = chartToSvgString(spec, { theme: "light", uid: "l" });
    const dark = chartToSvgString(spec, { theme: "dark", uid: "d" });
    expect(light).not.toBe(dark);
  });

  it("renders the title and honours showValues", () => {
    const withTitle = chartToSvgString(createChartSpec("pie", { title: "Enrolment" }), { uid: "p1" });
    expect(withTitle).toContain("Enrolment");
    const noValues = chartToSvgString(createChartSpec("column", { showValues: false }), { uid: "c1" });
    const withValues = chartToSvgString(createChartSpec("column", { showValues: true }), { uid: "c2" });
    expect(withValues.length).toBeGreaterThan(noValues.length);
  });

  it("escapes text to keep the SVG well-formed", () => {
    const svg = chartToSvgString(createChartSpec("pie", { title: "A & B <x>" }), { uid: "esc" });
    expect(svg).toContain("A &amp; B &lt;x&gt;");
    expect(svg).not.toContain("A & B <x>");
  });
});
