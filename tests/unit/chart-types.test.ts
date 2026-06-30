import { describe, it, expect } from "vitest";
import {
  type ChartType, CHART_TYPE_LABELS, CHART_TYPE_GROUPS,
  defaultChartData, defaultChartOptions,
  isMultiSeries, isScatter, isCircular, isCartesian,
  SINGLE_SERIES_TYPES, MULTI_SERIES_TYPES, SCATTER_TYPES,
} from "@/lib/chart-types";
import { createChartObj } from "@/lib/slide-storage";

const ALL_TYPES: ChartType[] = [
  "column", "bar", "groupedBar", "stackedBar", "histogram",
  "line", "multiLine", "area", "stackedArea", "combo",
  "pie", "donut", "radialBar", "gauge",
  "waffle", "funnel", "radar", "scatter", "bubble",
];

describe("chart-types model", () => {
  it("covers 19 distinct chart types with labels", () => {
    expect(ALL_TYPES.length).toBe(19);
    expect(new Set(ALL_TYPES).size).toBe(19);
    for (const t of ALL_TYPES) expect(CHART_TYPE_LABELS[t]).toBeTruthy();
  });

  it("groups every type in the picker exactly once", () => {
    const grouped = CHART_TYPE_GROUPS.flatMap(g => g.types);
    expect(new Set(grouped).size).toBe(grouped.length); // no dupes
    for (const t of ALL_TYPES) expect(grouped).toContain(t);
  });

  it("classifies each type into exactly one data shape", () => {
    for (const t of ALL_TYPES) {
      const shapes = [isMultiSeries(t), isScatter(t), SINGLE_SERIES_TYPES.includes(t)].filter(Boolean);
      expect(shapes.length).toBe(1);
    }
    expect(MULTI_SERIES_TYPES).toContain("groupedBar");
    expect(SCATTER_TYPES).toContain("bubble");
  });

  it("seeds sensible, non-empty default data for every type", () => {
    for (const t of ALL_TYPES) {
      const seed = defaultChartData(t);
      if (isScatter(t)) {
        expect(seed.scatter && seed.scatter.length).toBeGreaterThan(0);
      } else if (isMultiSeries(t)) {
        expect(seed.series && seed.series.length).toBeGreaterThan(0);
        expect(seed.categories && seed.categories.length).toBeGreaterThan(0);
        // every series aligns to categories
        seed.series!.forEach(s => expect(s.values.length).toBe(seed.categories!.length));
      } else {
        expect(seed.data && seed.data.length).toBeGreaterThan(0);
      }
    }
  });

  it("default options enable axes only for cartesian types and legend for circular/multi", () => {
    expect(defaultChartOptions("column").showAxes).toBe(true);
    expect(defaultChartOptions("pie").showAxes).toBe(false);
    expect(defaultChartOptions("pie").showLegend).toBe(true);
    expect(defaultChartOptions("groupedBar").showLegend).toBe(true);
    expect(defaultChartOptions("scatter").showValues).toBe(false);
    expect(isCartesian("scatter")).toBe(true);
    expect(isCircular("donut")).toBe(true);
  });

  it("createChartObj builds a positioned object seeded for its type", () => {
    for (const t of ALL_TYPES) {
      const obj = createChartObj(t, { x: 5, y: 5, width: 40, height: 30, accent: "#10b981" });
      expect(obj.type).toBe("chart");
      expect(obj.chartType).toBe(t);
      expect(obj.accent).toBe("#10b981");
      expect(obj.width).toBe(40);
      // has the right data shape populated
      if (isScatter(t)) expect(obj.scatter!.length).toBeGreaterThan(0);
      else if (isMultiSeries(t)) expect(obj.series!.length).toBeGreaterThan(0);
      else expect(obj.data.length).toBeGreaterThan(0);
    }
  });

  it("overrides win over seeded defaults in createChartObj", () => {
    const obj = createChartObj("pie", { data: [{ label: "Solo", value: 1 }], showLegend: false });
    expect(obj.data).toEqual([{ label: "Solo", value: 1 }]);
    expect(obj.showLegend).toBe(false);
  });
});
