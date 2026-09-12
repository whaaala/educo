import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  toPptxColor, htmlToText, toPptxChartKind, toPptxChartData, toPptxShape,
  isPptxStacked, isPptxBarHorizontal, pctX, pctY, pxToPt, PPTX_W, PPTX_H,
} from "@/lib/export/pptx-map";
import { CHART_TYPES, type ChartType } from "@/lib/chart";

describe("pptx-map — colour normalisation", () => {
  it("returns bare 6-digit hex", () => {
    expect(toPptxColor("#3b82f6")).toBe("3B82F6");
    expect(toPptxColor("3b82f6")).toBe("3B82F6");
    expect(toPptxColor("#abc")).toBe("AABBCC");
  });
  it("drops alpha and parses rgb/rgba", () => {
    expect(toPptxColor("#3b82f6ff")).toBe("3B82F6");
    expect(toPptxColor("rgb(255, 0, 0)")).toBe("FF0000");
    expect(toPptxColor("rgba(0,128,0,0.5)")).toBe("008000");
  });
  it("treats transparent / gradients / junk as no-fill (null)", () => {
    expect(toPptxColor("transparent")).toBeNull();
    expect(toPptxColor("gradient:#a:#b")).toBeNull();
    expect(toPptxColor("")).toBeNull();
    expect(toPptxColor(undefined)).toBeNull();
    expect(toPptxColor("notacolor")).toBeNull();
  });
});

describe("pptx-map — htmlToText", () => {
  it("preserves line breaks and strips tags/entities", () => {
    expect(htmlToText("<p>Hello</p><p>World</p>")).toBe("Hello\nWorld");
    expect(htmlToText("a<br>b")).toBe("a\nb");
    expect(htmlToText("A &amp; B &lt;x&gt;")).toBe("A & B <x>");
    expect(htmlToText("<b>bold</b> text")).toBe("bold text");
  });
  it("handles empty / undefined", () => {
    expect(htmlToText("")).toBe("");
    expect(htmlToText(undefined)).toBe("");
  });
});

describe("pptx-map — chart mapping", () => {
  it("maps every one of the 19 types to a valid native kind", () => {
    const valid = new Set(["bar", "line", "area", "pie", "doughnut", "scatter", "radar"]);
    for (const t of CHART_TYPES) expect(valid.has(toPptxChartKind(t))).toBe(true);
  });
  it("column→col bars, bar→horizontal bars, stacked flags", () => {
    expect(isPptxBarHorizontal("bar" as ChartType)).toBe(true);
    expect(isPptxBarHorizontal("column" as ChartType)).toBe(false);
    expect(isPptxStacked("stackedBar" as ChartType)).toBe(true);
    expect(isPptxStacked("groupedBar" as ChartType)).toBe(false);
  });
  it("builds single-series data from data[]", () => {
    const out = toPptxChartData({ chartType: "column", data: [{ label: "A", value: 3 }, { label: "B", value: 5 }] });
    expect(out).toHaveLength(1);
    expect(out[0].labels).toEqual(["A", "B"]);
    expect(out[0].values).toEqual([3, 5]);
  });
  it("builds multi-series data from series[]", () => {
    const out = toPptxChartData({ chartType: "groupedBar", categories: ["Q1", "Q2"], series: [{ name: "X", values: [1, 2] }, { name: "Y", values: [3, 4] }] });
    expect(out).toHaveLength(2);
    expect(out[1]).toEqual({ name: "Y", labels: ["Q1", "Q2"], values: [3, 4] });
  });
});

describe("pptx-map — shapes & geometry", () => {
  it("maps known shapes and falls back to roundRect", () => {
    expect(toPptxShape("circle")).toBe("ellipse");
    expect(toPptxShape("star")).toBe("star5");
    expect(toPptxShape("arrow-right")).toBe("rightArrow");
    expect(toPptxShape("totally-unknown")).toBe("roundRect");
  });
  it("maps 0–100% to inches and clamps", () => {
    expect(pctX(0)).toBe(0);
    expect(pctX(100)).toBe(PPTX_W);
    expect(pctX(50)).toBeCloseTo(PPTX_W / 2, 5);
    expect(pctY(200)).toBe(PPTX_H); // clamped
    expect(pxToPt(24)).toBe(18);
    expect(pxToPt(1)).toBe(6); // min floor
  });
});

describe("pptx export — wired to a REAL .pptx (not the PDF-print fallback)", () => {
  const read = (p: string) => fs.readFileSync(path.resolve(__dirname, p), "utf-8");
  const dialog = read("../../components/shared/DownloadDialog.tsx");
  const editor = read("../../components/shared/SlideEditor/SlideEditor.tsx");

  it("DownloadDialog builds a real .pptx from the slide model", () => {
    expect(dialog).toContain('from "@/lib/export/pptx"');
    expect(dialog).toContain("slidesToPptxBlob(slides");
    expect(dialog).toContain('downloadBlob(blob, `${filename}.pptx`)');
    // the format is advertised as real PowerPoint, not "Presentation (PDF)"
    expect(dialog).toContain('label: "PowerPoint (.pptx)"');
    expect(dialog).toContain('extension: ".pptx"');
  });

  it("SlideEditor passes the slide model to the download dialog", () => {
    expect(editor).toContain("slides={slides}");
  });
});
