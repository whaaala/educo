"use client";

/**
 * chart-embed — bridge that lets NON-React surfaces embed the SAME <Chart> component.
 *
 * The presentation editor renders <Chart> directly (it has a React object model). But the
 * work-document editor is a contentEditable that stores HTML, and exports (PDF/pptx/email)
 * need static markup. Rather than re-implementing charts for those surfaces, we render the
 * one real <Chart> to static SVG markup and embed that.
 *
 * The ChartSpec is round-tripped in a `data-chart-spec` attribute, so an embedded chart stays
 * a real chart — it can be re-opened, edited, and re-rendered — not a dead picture.
 *
 * Reusable by: work-documents, whiteboard, exports, reports, emails, and future surfaces.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Chart from "./Chart";
import type { ChartSpec, ChartThemeName } from "@/lib/chart";

/** Attribute + class used to mark an embedded chart in document HTML. */
export const CHART_EMBED_CLASS = "educo-chart-embed";
export const CHART_SPEC_ATTR = "data-chart-spec";

/** Base64-encode a spec for safe storage in an HTML attribute (handles unicode labels). */
export function encodeChartSpec(spec: ChartSpec): string {
  const json = JSON.stringify(spec);
  if (typeof window === "undefined") return Buffer.from(json, "utf-8").toString("base64");
  return window.btoa(String.fromCharCode(...new TextEncoder().encode(json)));
}

/** Decode a spec previously stored by encodeChartSpec. Returns null if unreadable. */
export function decodeChartSpec(encoded: string): ChartSpec | null {
  try {
    const bin = typeof window === "undefined"
      ? Buffer.from(encoded, "base64").toString("utf-8")
      : new TextDecoder().decode(Uint8Array.from(window.atob(encoded), (c) => c.charCodeAt(0)));
    return JSON.parse(bin) as ChartSpec;
  } catch {
    return null;
  }
}

/**
 * Render the shared <Chart> to a self-contained HTML block for embedding in a document.
 * `contenteditable="false"` so the document editor treats it as an atomic block.
 */
export function chartToEmbedHtml(
  spec: ChartSpec,
  opts?: { theme?: ChartThemeName; width?: number; aspect?: number },
): string {
  const { theme = "light", width = 560, aspect = 1.6 } = opts || {};
  const height = Math.round(width / aspect);

  const svg = renderToStaticMarkup(
    <Chart spec={spec} theme={theme} aspect={aspect} uid={`embed-${spec.chartType}`} />,
  );

  return (
    `<div class="${CHART_EMBED_CLASS}" ${CHART_SPEC_ATTR}="${encodeChartSpec(spec)}" ` +
    `contenteditable="false" style="margin:12px 0;width:${width}px;height:${height}px;max-width:100%;">` +
    `${svg}</div>`
  );
}
