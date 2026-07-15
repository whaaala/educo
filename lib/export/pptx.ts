/**
 * pptx — REAL PowerPoint (.pptx) export as a shared module.
 *
 * Turns `SlideData[]` (the slide model used by the presentation editor) into a genuine OOXML
 * .pptx via pptxgenjs — native editable text, shapes, images, tables and CHARTS (charts reuse
 * the shared ChartSpec, so a chart in the deck exports as a native, re-editable PowerPoint chart,
 * not a picture). The old "pptx" download just opened a print dialog and told the user to convert
 * a PDF online — this replaces that with the real thing.
 *
 * All the fiddly conversions live in the pure, unit-tested `pptx-map` module; this file only
 * orchestrates pptxgenjs. Reusable by the presentation editor and any future surface that holds
 * slides (e.g. exporting a report or a lesson as a deck).
 */

import type { SlideData, SlideObject } from "@/lib/slide-storage";
import {
  PPTX_W, PPTX_H, pctX, pctY, pxToPt, toPptxColor, htmlToText,
  toPptxChartKind, toPptxChartData, isPptxStacked, isPptxBarHorizontal, toPptxShape,
} from "./pptx-map";

export interface PptxExportOptions {
  /** Deck title (document properties). */
  title?: string;
}

// pptxgenjs types are loose; a minimal structural type keeps this file honest without `any` sprawl.
type PptxSlide = {
  background?: { color: string };
  addText: (text: string, opts: Record<string, unknown>) => void;
  addShape: (type: string, opts: Record<string, unknown>) => void;
  addImage: (opts: Record<string, unknown>) => void;
  addTable: (rows: unknown[], opts: Record<string, unknown>) => void;
  addChart: (type: unknown, data: unknown[], opts: Record<string, unknown>) => void;
};

/** Build the .pptx as a Blob (browser) — ready to download. */
export async function slidesToPptxBlob(slides: SlideData[], opts: PptxExportOptions = {}): Promise<Blob> {
  // Dynamic import keeps pptxgenjs out of the main bundle until an export actually happens.
  const PptxGen = (await import("pptxgenjs")).default;
  const pptx = new PptxGen();

  pptx.defineLayout({ name: "EDUCO_16x9", width: PPTX_W, height: PPTX_H });
  pptx.layout = "EDUCO_16x9";
  if (opts.title) pptx.title = opts.title;

  for (const s of slides) {
    const slide = pptx.addSlide() as unknown as PptxSlide;
    const bg = toPptxColor(s.background);
    if (bg) slide.background = { color: bg };

    const objects = (s.objects || []).slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    if (objects.length) {
      for (const o of objects) addObject(slide, o, PptxGen);
    } else if (s.content) {
      // Legacy HTML-only slide → a single text box.
      slide.addText(htmlToText(s.content) || " ", { x: 0.4, y: 0.4, w: PPTX_W - 0.8, h: PPTX_H - 0.8, fontSize: 18, valign: "top", color: "1A1A2E" });
    }
  }

  return (await pptx.write({ outputType: "blob" })) as Blob;
}

function box(o: SlideObject) {
  return { x: pctX(o.x), y: pctY(o.y), w: pctX(o.width), h: pctY(o.height) };
}

function addObject(slide: PptxSlide, o: SlideObject, PptxGen: unknown): void {
  const rect = box(o);
  const rotate = o.rotation ? { rotate: o.rotation } : {};

  switch (o.type) {
    case "textbox": {
      const t = htmlToText(o.content);
      slide.addText(t || " ", {
        ...rect, ...rotate,
        fontSize: pxToPt(o.fontSize || 18),
        color: toPptxColor(o.color) || "1A1A2E",
        bold: !!o.bold, italic: !!o.italic,
        align: (o.align || "left"),
        valign: (o.verticalAlign || "top"),
        fontFace: (o.fontFamily || "Inter").split(",")[0].replace(/["']/g, "").trim(),
        wrap: true,
      });
      break;
    }
    case "shape": {
      const fill = toPptxColor(o.fill);
      const line = toPptxColor(o.stroke);
      slide.addShape(toPptxShape(o.shape), {
        ...rect, ...rotate,
        fill: fill ? { color: fill } : { type: "none" },
        line: line ? { color: line, width: o.strokeWidth || 1 } : { type: "none" },
      });
      if (o.text) {
        slide.addText(htmlToText(o.text), { ...rect, ...rotate, align: "center", valign: "middle", color: toPptxColor(o.textColor) || "FFFFFF", fontSize: pxToPt(o.textSize || 14) });
      }
      break;
    }
    case "image": {
      // pptxgenjs accepts a data URL via `data`, or a remote URL via `path`.
      const isData = o.src.startsWith("data:");
      slide.addImage({ ...rect, ...rotate, ...(isData ? { data: o.src } : { path: o.src }) });
      break;
    }
    case "table": {
      const rows = o.cells.map((row) =>
        row.map((cell) => ({
          text: htmlToText(cell.content),
          options: {
            fill: toPptxColor(cell.backgroundColor) ? { color: toPptxColor(cell.backgroundColor)! } : undefined,
            color: toPptxColor(cell.color) || "1A1A2E",
            fontSize: pxToPt(cell.fontSize || 12),
            align: cell.align || "left",
            bold: !!cell.bold,
          },
        })),
      );
      slide.addTable(rows, { ...rect, border: { type: "solid", pt: 1, color: "D0D5DD" } });
      break;
    }
    case "chart": {
      const Gen = PptxGen as { ChartType?: Record<string, unknown> };
      const kindName = toPptxChartKind(o.chartType);
      const kind = Gen.ChartType ? Gen.ChartType[kindName] : kindName;
      slide.addChart(kind, toPptxChartData(o), {
        ...rect,
        showLegend: o.showLegend !== false,
        showTitle: !!o.title,
        title: o.title || undefined,
        showValue: o.showValues !== false && kindName !== "scatter",
        barDir: isPptxBarHorizontal(o.chartType) ? "bar" : "col",
        barGrouping: isPptxStacked(o.chartType) ? "stacked" : "clustered",
        holeSize: kindName === "doughnut" ? 55 : undefined,
        chartColors: (o.data || []).map((d) => toPptxColor(d.color)).filter(Boolean) as string[],
      });
      break;
    }
    case "media": {
      // Audio/video can't live in a static export — leave a labelled placeholder so it's not silently dropped.
      slide.addShape("roundRect", { ...rect, fill: { color: "EEF2F7" }, line: { color: "C0C7D0", width: 1 } });
      slide.addText(`▶ ${o.mediaKind === "video" ? "Video" : "Audio"}`, { ...rect, align: "center", valign: "middle", color: "64748B", fontSize: 12 });
      break;
    }
    case "drawing":
      // Freeform ink has no clean OOXML equivalent; skip rather than emit something wrong.
      break;
  }
}
