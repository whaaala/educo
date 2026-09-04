"use client";

/**
 * GradientEditor — a friendly, no-CSS way to build & edit a gradient background. Pick the type (Linear /
 * Radial / Conic), drag the angle, and edit colour stops with real colour swatches + a live preview bar.
 * Reusable anywhere a gradient is edited. Emits a CSS gradient string via onChange.
 *
 * Parsing is best-effort: `parseGradient` returns null for anything it can't represent visually (complex
 * patterns, mesh, multi-layer) — callers should fall back to a raw-CSS field in that case.
 */

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import EducoColorField from "@/components/shared/EducoColorField";

export type GradType = "linear" | "radial" | "conic";
export type GradStop = { color: string; pos?: number };
export type GradModel = { type: GradType; angle: number; stops: GradStop[] };

/** Split on top-level commas (ignoring commas inside parentheses, e.g. rgb(...) ). */
function splitTop(s: string): string[] {
  const out: string[] = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const DIRS: Record<string, number> = {
  "to top": 0, "to right": 90, "to bottom": 180, "to left": 270,
  "to top right": 45, "to right top": 45, "to bottom right": 135, "to right bottom": 135,
  "to bottom left": 225, "to left bottom": 225, "to top left": 315, "to left top": 315,
};

function parseStop(s: string): GradStop | null {
  s = s.trim();
  const pm = s.match(/\s(-?\d+(?:\.\d+)?)%$/);
  let pos: number | undefined;
  let color = s;
  if (pm) { pos = parseFloat(pm[1]); color = s.slice(0, pm.index).trim(); }
  if (!color) return null;
  return { color, pos };
}

/** Parse a CSS gradient into an editable model, or null if it isn't a simple single gradient. */
export function parseGradient(css?: string): GradModel | null {
  if (!css) return null;
  const m = css.trim().match(/^(linear|radial|conic)-gradient\(([\s\S]*)\)$/i);
  if (!m) return null;
  const type = m[1].toLowerCase() as GradType;
  let parts = splitTop(m[2]);
  if (parts.length < 2) return null;
  let angle = type === "conic" ? 0 : 135;
  const first = parts[0];
  const isColor = (t: string) => /^(#|rgb|hsl|var\(|[a-z]+$)/i.test(t) && !/^(to|from|circle|ellipse|at|closest|farthest)\b/i.test(t);
  if (type === "linear") {
    const deg = first.match(/^(-?\d+(?:\.\d+)?)deg$/i);
    if (deg) { angle = parseFloat(deg[1]); parts = parts.slice(1); }
    else if (/^to\s/i.test(first)) { angle = DIRS[first.toLowerCase()] ?? 135; parts = parts.slice(1); }
  } else if (type === "radial") {
    if (!isColor(first)) parts = parts.slice(1); // drop the shape/position token
  } else if (type === "conic") {
    const fm = first.match(/from\s+(-?\d+(?:\.\d+)?)deg/i);
    if (fm) angle = parseFloat(fm[1]);
    if (!isColor(first)) parts = parts.slice(1);
  }
  const stops = parts.map(parseStop).filter(Boolean) as GradStop[];
  if (stops.length < 2) return null;
  return { type, angle, stops };
}

export function serializeGradient(m: GradModel): string {
  const stops = m.stops.map((s) => s.color + (s.pos != null ? ` ${s.pos}%` : "")).join(", ");
  if (m.type === "linear") return `linear-gradient(${m.angle}deg, ${stops})`;
  if (m.type === "conic") return `conic-gradient(from ${m.angle}deg at 50% 50%, ${stops})`;
  return `radial-gradient(circle at 50% 50%, ${stops})`;
}

const TYPES: { id: GradType; label: string }[] = [
  { id: "linear", label: "Linear" }, { id: "radial", label: "Radial" }, { id: "conic", label: "Conic" },
];

export default function GradientEditor({ value, onChange }: { value?: string; onChange: (css: string) => void }) {
  const [model, setModel] = useState<GradModel>(() => parseGradient(value) ?? { type: "linear", angle: 135, stops: [{ color: "#6a11cb" }, { color: "#2575fc" }] });
  const lastEmitted = useRef<string>("");

  // Re-sync from an external change (e.g. a new preset was picked) without clobbering in-progress edits.
  useEffect(() => {
    if (value && value !== lastEmitted.current) {
      const parsed = parseGradient(value);
      if (parsed) setModel(parsed);
    }
  }, [value]);

  const update = (next: GradModel) => {
    setModel(next);
    const css = serializeGradient(next);
    lastEmitted.current = css;
    onChange(css);
  };
  const setStop = (i: number, patch: Partial<GradStop>) => update({ ...model, stops: model.stops.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const addStop = () => update({ ...model, stops: [...model.stops, { color: model.stops[model.stops.length - 1]?.color ?? "#ffffff" }] });
  const removeStop = (i: number) => { if (model.stops.length > 2) update({ ...model, stops: model.stops.filter((_, j) => j !== i) }); };

  const showAngle = model.type !== "radial";
  const preview = serializeGradient(model);

  return (
    <div className="space-y-2 rounded-xl border border-line/70 bg-surface-2/40 p-2.5">
      {/* live preview */}
      <div className="h-9 w-full rounded-lg border border-line/60" style={{ backgroundImage: preview }} aria-hidden />

      {/* type */}
      <div className="flex gap-1" role="group" aria-label="Gradient type">
        {TYPES.map((t) => (
          <button key={t.id} type="button" aria-pressed={model.type === t.id} onClick={() => update({ ...model, type: t.id })}
            className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${model.type === t.id ? "bg-brand text-brand-fg shadow-sm" : "bg-surface-2 text-muted hover:text-ink"}`}>{t.label}</button>
        ))}
      </div>

      {/* angle */}
      {showAngle && (
        <label className="block">
          <span className="flex items-center justify-between text-[0.6875rem] text-muted"><span>Angle</span><span className="tabular-nums">{Math.round(model.angle)}°</span></span>
          <input type="range" min={0} max={360} step={1} value={model.angle} aria-label="Gradient angle"
            onChange={(e) => update({ ...model, angle: Number(e.target.value) })} className="w-full accent-indigo-600" />
        </label>
      )}

      {/* colour stops */}
      <div className="space-y-1.5">
        <span className="text-[0.6875rem] font-medium text-muted">Colours</span>
        {model.stops.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="flex-1"><EducoColorField ariaLabel={`Colour ${i + 1}`} value={s.color} onChange={(hex) => setStop(i, { color: hex })} /></div>
            <input type="number" min={0} max={100} value={s.pos ?? ""} placeholder="auto" aria-label={`Colour ${i + 1} position %`}
              onChange={(e) => setStop(i, { pos: e.target.value === "" ? undefined : Number(e.target.value) })}
              className="w-14 rounded-lg border border-line bg-surface px-1.5 py-1 text-xs text-ink outline-none focus:border-brand" />
            <button type="button" aria-label={`Remove colour ${i + 1}`} disabled={model.stops.length <= 2} onClick={() => removeStop(i)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-3 hover:text-red-500 disabled:opacity-30"><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={addStop} className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-line py-1 text-xs text-muted hover:border-brand/50 hover:text-brand"><Plus className="h-3.5 w-3.5" /> Add colour</button>
      </div>
    </div>
  );
}
