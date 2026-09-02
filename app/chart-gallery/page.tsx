"use client";

/**
 * Chart gallery — a live preview of every chart type in the reusable <Chart> component.
 * Handy for browsing the catalogue, checking the 3D look, and copying data shapes.
 */

import React from "react";
import Chart from "@/components/shared/Chart/Chart";
import {
  type ChartType, CHART_TYPE_GROUPS, CHART_TYPE_LABELS,
  defaultChartData, defaultChartOptions,
} from "@/lib/chart-types";

const ACCENTS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

export default function ChartGalleryPage() {
  const [threeD, setThreeD] = React.useState(false);
  const [accent, setAccent] = React.useState(ACCENTS[0]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0e14] p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chart gallery — 19 types</h1>
        <button
          onClick={() => setThreeD(v => !v)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${threeD ? "bg-indigo-600 text-white" : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
        >
          3D: {threeD ? "on" : "off"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Accent</span>
          {ACCENTS.map(a => (
            <button
              key={a}
              onClick={() => setAccent(a)}
              aria-label={`Accent ${a}`}
              className={`w-6 h-6 rounded-full border-2 ${accent === a ? "border-slate-800 dark:border-white" : "border-transparent"}`}
              style={{ background: a }}
            />
          ))}
        </div>
      </div>

      {CHART_TYPE_GROUPS.map(group => (
        <section key={group.group} className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">{group.group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {group.types.map((t: ChartType) => {
              const spec = {
                chartType: t, data: [], accent, title: CHART_TYPE_LABELS[t],
                threeD, ...defaultChartOptions(t), ...defaultChartData(t),
              };
              return (
                <div key={t} className="bg-white dark:bg-[#11151c] rounded-xl p-3 shadow-sm">
                  <div className="text-[0.6875rem] uppercase tracking-wide text-slate-400 mb-1 px-1">{CHART_TYPE_LABELS[t]}</div>
                  <div style={{ aspectRatio: "16 / 10" }}>
                    <Chart spec={spec as any} aspect={16 / 10} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-xs text-slate-400 mt-8">
        These are live previews of the shared <code>&lt;Chart&gt;</code> component. To use one, go to the
        presentation editor → Insert → Chart, then double-click to edit its data, type, 3D, colours and labels.
      </p>
    </div>
  );
}
