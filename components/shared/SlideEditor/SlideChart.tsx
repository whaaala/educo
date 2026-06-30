"use client";

/**
 * SlideChart — a thin slide adapter around the reusable <Chart> component.
 *
 * All chart rendering, editing, label drag/style and the 19 chart types live in
 * components/shared/Chart (surface-agnostic). This wrapper only translates a
 * positioned slide ChartObject into the size-agnostic ChartSpec the renderer wants
 * (computing the pixel aspect so the logical viewBox stays undistorted) and forwards
 * the editor. The work document imports <Chart>/<ChartEditor> directly.
 */

import React from "react";
import Chart from "@/components/shared/Chart/Chart";
import ChartEditor from "@/components/shared/Chart/ChartEditor";
import type { ChartObject, ChartSpec, SlideObject } from "@/lib/slide-storage";

const SLIDE_ASPECT = 16 / 9;
const chartAspect = (obj: ChartObject) => Math.max(0.3, (obj.width / Math.max(1, obj.height)) * SLIDE_ASPECT);

export default function SlideChart({ obj, editing, onUpdate }: {
  obj: ChartObject;
  editing?: boolean;
  onUpdate?: (patch: Partial<SlideObject>) => void;
}) {
  return (
    <Chart
      spec={obj}
      uid={obj.id}
      aspect={chartAspect(obj)}
      editing={editing}
      onUpdate={onUpdate ? (patch: Partial<ChartSpec>) => onUpdate(patch as Partial<SlideObject>) : undefined}
    />
  );
}

export function SlideChartEditor({ obj, anchorRect, onUpdate, onClose }: {
  obj: ChartObject;
  anchorRect: DOMRect;
  onUpdate: (patch: Partial<SlideObject>) => void;
  onClose: () => void;
}) {
  return (
    <ChartEditor
      spec={obj}
      anchorRect={anchorRect}
      onUpdate={(patch: Partial<ChartSpec>) => onUpdate(patch as Partial<SlideObject>)}
      onClose={onClose}
    />
  );
}
