/**
 * chart-types — the single source of truth for the reusable Chart component.
 *
 * These types are presentation-agnostic: they describe WHAT a chart shows and HOW
 * it is styled, never WHERE it sits. The slide editor composes `ChartSpec` into a
 * positioned `ChartObject` (see lib/slide-storage.ts); the work document and any
 * other surface can build a `ChartSpec` directly and hand it to <Chart>.
 */

export type ChartType =
  // bars / columns
  | "column" | "bar" | "groupedBar" | "stackedBar"
  // lines / areas
  | "line" | "multiLine" | "area" | "stackedArea" | "combo"
  // circular
  | "pie" | "donut" | "radialBar"
  // distribution / specialty
  | "waffle" | "scatter" | "bubble"
  | "funnel" | "radar" | "gauge" | "histogram";

/**
 * Every chart type, in one canonical list. Menus, pickers, tests and exports all iterate this
 * rather than keeping their own copies — add a type once here and every surface picks it up.
 */
export const CHART_TYPES: ChartType[] = [
  "column", "bar", "groupedBar", "stackedBar", "histogram",
  "line", "multiLine", "area", "stackedArea", "combo",
  "pie", "donut", "radialBar", "gauge",
  "waffle", "funnel", "radar", "scatter", "bubble",
];

/** Charts that use a single categorical series held in `data`. */
export const SINGLE_SERIES_TYPES: ChartType[] = [
  "column", "bar", "line", "area", "pie", "donut", "radialBar",
  "waffle", "funnel", "gauge", "histogram",
];
/** Charts that use multiple series in `series` aligned to `categories`. */
export const MULTI_SERIES_TYPES: ChartType[] = [
  "groupedBar", "stackedBar", "multiLine", "stackedArea", "combo", "radar",
];
/** Charts that use free x/y(/size) points in `scatter`. */
export const SCATTER_TYPES: ChartType[] = ["scatter", "bubble"];

export const CIRCULAR_TYPES: ChartType[] = ["pie", "donut", "radialBar"];
/** Cartesian charts that can show X/Y axes + grid. */
export const CARTESIAN_TYPES: ChartType[] = [
  "column", "bar", "groupedBar", "stackedBar", "line", "multiLine",
  "area", "stackedArea", "combo", "scatter", "bubble", "histogram",
];

export function isMultiSeries(t: ChartType): boolean { return MULTI_SERIES_TYPES.includes(t); }
export function isScatter(t: ChartType): boolean { return SCATTER_TYPES.includes(t); }
export function isCircular(t: ChartType): boolean { return CIRCULAR_TYPES.includes(t); }
export function isCartesian(t: ChartType): boolean { return CARTESIAN_TYPES.includes(t); }

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
  /** Custom data-label text. Supports tokens {label} {value} {percent}. Empty = default. */
  customLabel?: string;
}

export interface ChartSeries {
  name: string;
  color?: string;
  /** For combo charts: render this series as bars, a line, or an area. Ignored otherwise. */
  kind?: "bar" | "line" | "area";
  values: number[];
}

export interface ScatterPoint {
  x: number;
  y: number;
  size?: number;   // bubble radius weight (bubble charts)
  label?: string;
  color?: string;
}

/** Text styling — applies to the whole chart (defaults) or a single label (override). */
export interface ChartTextStyle {
  fontFamily?: string;
  fontSize?: number;   // relative multiplier (1 = default)
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

/** Per-label override: free-drag offset + snap alignment + custom text + style. Keyed by label id. */
export interface ChartLabelOverride {
  dx?: number;   // drag offset in logical units
  dy?: number;
  align?: "left" | "center" | "right";    // snap horizontally within the chart
  valign?: "top" | "middle" | "bottom";   // snap vertically within the chart
  text?: string;
  style?: ChartTextStyle;
}

/** Everything needed to render a chart — no positioning, fully reusable. */
export interface ChartSpec {
  chartType: ChartType;
  /** Single-series categorical data (also the X labels for cartesian single-series). */
  data: ChartDatum[];
  /** Multi-series values aligned to `categories`. */
  series?: ChartSeries[];
  categories?: string[];
  /** Free points for scatter / bubble. */
  scatter?: ScatterPoint[];
  /** Max for the gauge chart (default: nice-ceil of value). */
  gaugeMax?: number;

  accent: string;
  threeD?: boolean;
  showLegend?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showValues?: boolean;

  title?: string;
  subtitle?: string;
  /** Title/subtitle block placement within the chart (they move together as a header). */
  titleAlign?: "left" | "center" | "right";
  titleVAlign?: "top" | "middle" | "bottom";

  font?: ChartTextStyle;
  labels?: Record<string, ChartLabelOverride>;

  yMin?: number;
  yMax?: number;
  yStep?: number;
}

// ── Sensible defaults per chart type ────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

function catData(labels: string[], vals: number[]): ChartDatum[] {
  return labels.map((label, i) => ({ label, value: vals[i] }));
}

/** Returns the data/series/scatter seed for a freshly-created chart of `type`. */
export function defaultChartData(type: ChartType): Partial<ChartSpec> {
  switch (type) {
    case "column":
    case "histogram":
      return { data: catData(MONTHS, [50, 72, 40, 86, 55, 68]) };
    case "bar":
      return { data: catData(["Product A", "Product B", "Product C", "Product D"], [82, 64, 47, 30]) };
    case "line":
    case "area":
      return { data: catData(MONTHS, [30, 45, 38, 62, 70, 88]) };
    case "pie":
    case "donut":
    case "radialBar":
      return { data: catData(["Category A", "Category B", "Category C", "Category D"], [35, 25, 22, 18]) };
    case "waffle":
      return { data: catData(["Done", "In progress", "Blocked"], [62, 25, 13]) };
    case "funnel":
      return { data: catData(["Visitors", "Leads", "Trials", "Customers"], [1000, 620, 310, 140]) };
    case "gauge":
      return { data: [{ label: "Score", value: 72 }], gaugeMax: 100 };
    case "groupedBar":
    case "stackedBar":
      return {
        categories: QUARTERS,
        series: [
          { name: "2025", values: [40, 55, 48, 70] },
          { name: "2026", values: [52, 60, 66, 84] },
        ],
        data: catData(QUARTERS, [40, 55, 48, 70]),
      };
    case "multiLine":
    case "stackedArea":
      return {
        categories: MONTHS,
        series: [
          { name: "Revenue", values: [30, 45, 38, 62, 70, 88] },
          { name: "Cost", values: [22, 28, 30, 40, 44, 50] },
        ],
        data: catData(MONTHS, [30, 45, 38, 62, 70, 88]),
      };
    case "combo":
      return {
        categories: QUARTERS,
        series: [
          { name: "Revenue", kind: "bar", values: [40, 55, 48, 72] },
          { name: "Growth %", kind: "line", values: [20, 35, 28, 48] },
        ],
        data: catData(QUARTERS, [40, 55, 48, 72]),
      };
    case "radar":
      return {
        categories: ["Speed", "Power", "Range", "Defense", "Agility"],
        series: [
          { name: "Model A", values: [80, 60, 70, 50, 90] },
          { name: "Model B", values: [55, 85, 60, 75, 65] },
        ],
        data: catData(["Speed", "Power", "Range", "Defense", "Agility"], [80, 60, 70, 50, 90]),
      };
    case "scatter":
      return {
        scatter: [
          { x: 12, y: 24 }, { x: 28, y: 40 }, { x: 35, y: 32 }, { x: 48, y: 60 },
          { x: 60, y: 55 }, { x: 72, y: 80 }, { x: 85, y: 72 },
        ],
        data: [],
      };
    case "bubble":
      return {
        scatter: [
          { x: 18, y: 30, size: 18, label: "A" }, { x: 40, y: 55, size: 30, label: "B" },
          { x: 62, y: 38, size: 12, label: "C" }, { x: 78, y: 72, size: 24, label: "D" },
        ],
        data: [],
      };
    default:
      return { data: catData(MONTHS, [50, 72, 40, 86, 55, 68]) };
  }
}

/** Default option flags per type (axes, legend, values). */
export function defaultChartOptions(type: ChartType): Partial<ChartSpec> {
  return {
    showAxes: isCartesian(type),
    showGrid: isCartesian(type),
    showLegend: isCircular(type) || isMultiSeries(type),
    showValues: !isScatter(type) && type !== "radar",
  };
}

/**
 * Build a complete, ready-to-render ChartSpec for a type.
 *
 * The ONE factory every surface uses — slides, work-documents, whiteboard, mobile, reports —
 * so a "column chart" means exactly the same thing (same seed data, same defaults) everywhere.
 * Pure: safe to call from React Native and from server-side export code.
 */
export function createChartSpec(type: ChartType, overrides?: Partial<ChartSpec>): ChartSpec {
  return {
    chartType: type,
    ...defaultChartData(type),
    ...defaultChartOptions(type),
    ...overrides,
  } as ChartSpec;
}

/** Human-readable label for a chart type (menus, chips). */
export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  column: "Column", bar: "Bar", groupedBar: "Grouped bar", stackedBar: "Stacked bar",
  line: "Line", multiLine: "Multi-line", area: "Area", stackedArea: "Stacked area", combo: "Combo",
  pie: "Pie", donut: "Donut", radialBar: "Radial",
  waffle: "Waffle", scatter: "Scatter", bubble: "Bubble",
  funnel: "Funnel", radar: "Radar", gauge: "Gauge", histogram: "Histogram",
};

/** Grouped catalogue for the type picker. */
export const CHART_TYPE_GROUPS: { group: string; types: ChartType[] }[] = [
  { group: "Bars", types: ["column", "bar", "groupedBar", "stackedBar", "histogram"] },
  { group: "Lines", types: ["line", "multiLine", "area", "stackedArea", "combo"] },
  { group: "Circular", types: ["pie", "donut", "radialBar", "gauge"] },
  { group: "Specialty", types: ["waffle", "funnel", "radar", "scatter", "bubble"] },
];
