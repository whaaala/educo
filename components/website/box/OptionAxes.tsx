"use client";

/**
 * OPTION AXES — the shared control for a component's fine-tuning.
 *
 * Every component's look is a design plus a handful of ORTHOGONAL axes (RULE T): shape, border, density,
 * indicator, rhythm… The Alert has six, the Accordion has six, and every future component will have its own.
 * This renders any set of them, so that panel is written once rather than per component.
 *
 * WHY IT LOOKS LIKE THIS. A grid of six identical dropdowns is honest but mute: nothing tells you which axes
 * you have touched, the labels float free of their controls, and it reads as a form to fill in rather than a
 * set of adjustments. The design here is built around three things a person actually needs from it:
 *
 *   • WHAT HAVE I CHANGED? Every touched axis is marked, and the header carries a live count with one click to
 *     put everything back. Previously the only way to know was to read all six values and remember the defaults.
 *   • WHAT IS THIS AXIS? Each row states its purpose in a word, so "Rhythm" is not a guess.
 *   • WHERE AM I? The row you are changing lifts and warms; the rest stay quiet.
 *
 * Everything is a token — no hardcoded colour — so it re-skins with light, dark, midnight and purple, and the
 * whole panel is keyboard-operable with a visible focus ring.
 */

import { useId } from "react";
import { RotateCcw, Check } from "lucide-react";
import CompactSelect from "@/components/shared/CompactSelect";

export type AxisOption = { id: string; label: string };
export type Axis = {
  /** The node field this axis writes to. */
  key: string;
  label: string;
  options: readonly AxisOption[];
  /** One line on what the axis is for — shown quietly beside the label. */
  hint?: string;
};

export default function OptionAxes({
  axes,
  values,
  onChange,
  onReset,
  title = "Fine tuning",
  subtitle = "combines with any design",
}: {
  axes: readonly Axis[];
  /** Current value per axis key; "" or undefined means untouched. */
  values: Record<string, string | undefined>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  title?: string;
  subtitle?: string;
}) {
  const headingId = useId();
  const touched = axes.filter((a) => values[a.key]);

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-line bg-surface-2/60 p-2.5 space-y-2.5 backdrop-blur-[2px]"
    >
      <header className="flex items-center gap-2 px-0.5">
        <h3 id={headingId} className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink">
          {title}
        </h3>
        {/* The live count is the answer to "what have I changed?" — previously you had to read all six and
            remember which value was the default. */}
        {touched.length > 0 ? (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-brand/12 px-1.5 py-0.5 text-[0.625rem] font-semibold text-brand"
            aria-label={`${touched.length} of ${axes.length} adjusted`}
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
            {touched.length}
          </span>
        ) : (
          <span className="text-[0.5625rem] text-muted">{subtitle}</span>
        )}
        {touched.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            aria-label={`Reset all ${touched.length} adjustments`}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[0.6875rem] font-medium text-muted transition-colors hover:bg-brand/8 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
            Reset
          </button>
        )}
      </header>

      <div className="grid grid-cols-2 gap-1.5">
        {axes.map((axis) => {
          const value = values[axis.key] ?? "";
          const isSet = !!value;
          return (
            <div
              key={axis.key}
              className={`group relative rounded-xl border p-1.5 transition-colors ${
                isSet
                  ? "border-brand/35 bg-brand/[0.06]"
                  : "border-transparent bg-surface hover:border-line"
              }`}
            >
              {/* A set axis carries a dot: colour alone must never be the only signal (WCAG 1.4.1), so the
                  count above, the dot here and the value in the control all say the same thing. */}
              {isSet && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand"
                />
              )}
              <CompactSelect
                label={axis.label}
                ariaLabel={`${axis.label}${axis.hint ? ` — ${axis.hint}` : ""}`}
                value={value}
                onChange={(v: string) => onChange(axis.key, v)}
                options={axis.options.map((o) => ({ value: o.id, label: o.label }))}
              />
              {axis.hint && (
                <p className="mt-0.5 px-0.5 text-[0.5625rem] leading-tight text-muted">{axis.hint}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
