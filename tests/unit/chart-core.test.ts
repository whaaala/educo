import { describe, it, expect } from "vitest";
import {
  createChartSpec, CHART_TYPE_GROUPS, CHART_TYPE_LABELS, CHART_TYPES,
  isCircular, isCartesian, chartTheme,
} from "@/lib/chart";
import { encodeChartSpec, decodeChartSpec } from "@/components/shared/Chart/chart-embed";

describe("chart core — the single source of truth for every surface", () => {
  it("createChartSpec builds a complete, renderable spec for every chart type", () => {
    for (const t of CHART_TYPES) {
      const spec = createChartSpec(t);
      expect(spec.chartType).toBe(t);
      // Every spec must carry enough to render: data, series, or scatter points.
      const hasData = !!(spec.data?.length || spec.series?.length || spec.scatter?.length);
      expect(hasData, `${t} has no seed data`).toBe(true);
    }
  });

  it("defaults are type-appropriate (axes only on cartesian, legend on circular)", () => {
    expect(createChartSpec("column").showAxes).toBe(true);
    expect(createChartSpec("pie").showAxes).toBe(false);
    expect(createChartSpec("pie").showLegend).toBe(true);
    expect(isCircular("donut")).toBe(true);
    expect(isCartesian("column")).toBe(true);
  });

  it("overrides win over the defaults", () => {
    const spec = createChartSpec("column", { title: "Enrolment", showGrid: false });
    expect(spec.title).toBe("Enrolment");
    expect(spec.showGrid).toBe(false);
  });

  it("every type in the picker groups is a real, labelled type", () => {
    const grouped = CHART_TYPE_GROUPS.flatMap(g => g.types);
    for (const t of grouped) {
      expect(CHART_TYPES).toContain(t);
      expect(CHART_TYPE_LABELS[t]).toBeTruthy();
    }
  });

  it("the palette resolves for every surface theme", () => {
    for (const theme of ["light", "dark", "midnight", "purple"] as const) {
      const T = chartTheme(theme);
      expect(T.grid).toBeTruthy();
      expect(T.axis).toBeTruthy();
    }
  });
});

describe("chart-embed — round-trips a spec so embedded charts stay editable", () => {
  it("encode → decode returns the identical spec", () => {
    const spec = createChartSpec("donut", { title: "Attendance" });
    const decoded = decodeChartSpec(encodeChartSpec(spec));
    expect(decoded).toEqual(spec);
  });

  it("survives unicode labels (non-ASCII must not corrupt the base64)", () => {
    const spec = createChartSpec("pie", { title: "Écoles — 学生 📊" });
    const decoded = decodeChartSpec(encodeChartSpec(spec));
    expect(decoded?.title).toBe("Écoles — 学生 📊");
  });

  it("returns null for unreadable data instead of throwing", () => {
    expect(decodeChartSpec("not-base64!!")).toBeNull();
    expect(decodeChartSpec("")).toBeNull();
  });
});
