"use client";

/**
 * DESIGN GALLERY — the ONE way every component offers its designs (RULE S).
 *
 * A design is a LOOK, so it has to be shown, not spelled. The accordion already got this right — real markup
 * scaled down into a thumbnail — while the Alert, the registry components and the tree presets all listed their
 * designs as plain text chips ("Soft · Solid · Outline · Left accent…"), which asks the user to imagine the
 * result and then click to find out. Three call sites had drifted apart. This is that pattern, extracted.
 *
 * Two parts, and the second is the point:
 *   • CURRENT — a large preview of the design that is applied right now, so what is selected is always visible.
 *   • OPTIONS — a tile per design, each showing that design rather than naming it.
 *
 * Previews are REAL wherever the component renders to `.eu-*` markup (`HtmlThumb`), and derived from the node's
 * own resolved style where it is an editable tree (`NodeThumb`) — never hand-drawn mock-ups, which drift from
 * the thing they claim to show the moment a design changes.
 *
 * APPLIES TO EVERY COMPONENT, existing and future. A component that adds designs shows them through here; a
 * test asserts each one renders a preview rather than a bare label.
 */

import { useMemo, type ReactNode } from "react";
import type { BoxNode } from "@/lib/box-model";

/**
 * A preview is asked for the slot it will fill, because one scale cannot serve both: measured in the browser,
 * an alert thumbnail that fills 93% of a 48px tile fills only 56% of the 80px "Applied" panel, and dead space
 * around a preview is exactly what made the old text chips feel unfinished.
 */
export type ThumbSize = "tile" | "hero";
export type DesignItem = { id: string; label: string; preview: (size: ThumbSize) => ReactNode };
export type DesignGroup = { group?: string; items: DesignItem[] };

/** Scale real component markup down into a thumbnail — the truest preview there is, since it IS the component. */
export function HtmlThumb({ html, scale = 0.4, fontSize = 11 }: { html: string; scale?: number; fontSize?: number }) {
  return (
    <span
      className="eu-root"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        display: "block",
        width: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        pointerEvents: "none",
        fontSize: `${fontSize}px`,
      }}
    />
  );
}

/** The same, for a preview built from JSX rather than an HTML string. */
export function ScaledThumb({ children, scale = 0.4, fontSize = 11 }: { children: ReactNode; scale?: number; fontSize?: number }) {
  return (
    <span
      className="eu-root"
      aria-hidden="true"
      style={{
        display: "block",
        width: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        pointerEvents: "none",
        fontSize: `${fontSize}px`,
      }}
    >
      {children}
    </span>
  );
}

const SHADOW: Record<string, string> = {
  sm: "0 1px 2px rgba(0,0,0,.06)",
  md: "0 2px 6px rgba(0,0,0,.10)",
  lg: "0 6px 14px rgba(0,0,0,.14)",
  xl: "0 10px 22px rgba(0,0,0,.18)",
};

/**
 * A thumbnail for an editable TREE (Card, Quote, Stat, Badge, Rating), derived from the node's own resolved
 * style — background, border, radius, shadow and direction — with a placeholder per child type.
 *
 * Derived, not drawn: because a design is style-only, reading the applied node means the tile cannot claim a
 * look the canvas will not produce. Add a design and its preview appears with it.
 *
 * It carries `.eu-root` because that is where the token variables are defined — without it `var(--eu-color-*)`
 * resolves to nothing and a tinted design previews as transparent.
 */
export function NodeThumb({ node }: { node: BoxNode }) {
  const kids = useMemo(() => flattenLeaves(node, 0), [node]);
  const row = node.direction === "row";
  return (
    <span
      className="eu-root"
      aria-hidden="true"
      style={{
        display: "flex",
        flexDirection: row ? "row" : "column",
        alignItems: row ? "center" : node.align === "center" ? "center" : node.align === "start" ? "flex-start" : "stretch",
        justifyContent: node.justify === "center" ? "center" : "flex-start",
        gap: "3px",
        width: "100%",
        height: "100%",
        padding: "6px",
        boxSizing: "border-box",
        overflow: "hidden",
        background: paint(node.background),
        borderRadius: `${Math.min(10, (node.radius ?? 0) / 2)}px`,
        border: node.borderWidth ? `1px solid ${paint(node.borderColor) || "var(--eu-color-border)"}` : "1px solid transparent",
        boxShadow: node.shadow ? SHADOW[node.shadow] : "none",
      }}
    >
      {kids.map((k, i) => (
        <span key={i} style={leafStyle(k, row)} />
      ))}
    </span>
  );
}

/** The tree's leaf elements, in order — the canvas wraps each inserted element in a container, so walk through. */
function flattenLeaves(node: BoxNode, depth: number): BoxNode[] {
  if (depth > 4) return [];
  const kids = node.children ?? [];
  if (!kids.length) return node.type === "container" ? [] : [node];
  return kids.flatMap((c) => (c.type === "container" ? flattenLeaves(c, depth + 1) : [c])).slice(0, 6);
}

/** A placeholder shaped like the thing it stands for: a block for media, a bar for text, a pill for a button. */
function leafStyle(n: BoxNode, row: boolean): React.CSSProperties {
  const base: React.CSSProperties = { display: "block", borderRadius: "2px", flex: "none" };
  if (n.type === "image") {
    return { ...base, width: row ? "34%" : "100%", height: row ? "70%" : "38%", borderRadius: "4px", background: "var(--eu-color-neutral-200, #d7dbe3)" };
  }
  if (n.type === "button") {
    return { ...base, width: "42%", height: "8px", borderRadius: "999px", background: paint(n.background) || "var(--eu-color-brand, #4f46e5)" };
  }
  if (n.type === "icon") {
    return { ...base, width: "8px", height: "8px", borderRadius: "999px", background: paint(n.color) || "var(--eu-color-warning, #c07a10)" };
  }
  const big = (n.fontSize ?? 16) >= 22;
  return {
    ...base,
    width: n.type === "heading" || big ? "72%" : "100%",
    height: big ? "9px" : "5px",
    background: paint(n.color) || (n.type === "heading" ? "var(--eu-color-text, #151a23)" : "var(--eu-color-muted, #8a94a4)"),
    opacity: n.type === "heading" || big ? 0.85 : 0.55,
    alignSelf: n.textAlign === "center" ? "center" : undefined,
  };
}

/** Tokens pass straight through; a gradient token becomes a real gradient; nothing else is invented. */
function paint(v?: string): string | undefined {
  if (!v) return undefined;
  if (v.startsWith("gradient:")) {
    const [, a, b] = v.split(":");
    return `linear-gradient(135deg, ${a}, ${b})`;
  }
  return v;
}

export default function DesignGallery({
  label = "Design",
  hint,
  value,
  onPick,
  groups,
  ariaLabel,
  currentLabel,
  currentPreview,
  itemNoun = "design",
}: {
  label?: string;
  hint?: string;
  /**
   * The applied design's id ("" is the default design), or null when nothing records which one is on — style
   * presets are one-shot patches, not stored variants. With null, the hero shows the block AS IT IS NOW
   * (`currentPreview`) and no tile claims to be selected, which is honest: the old chips passed
   * `chipCls(false)` for every option, so a user could never see the current state at all.
   */
  value: string | null;
  /** Shown in the hero when `value` is null — the block's own current look. */
  currentPreview?: ReactNode;
  /**
   * What one entry is called, used in each tile's accessible name ("Outline style", "Outline hover effect").
   * Several galleries can appear in one panel and they share option names — "Outline" is a style preset AND a
   * hover effect — so a single noun for all of them would leave two controls with the same accessible name.
   */
  itemNoun?: string;
  onPick: (id: string) => void;
  groups: DesignGroup[];
  ariaLabel: string;
  /** Name shown under the big preview; falls back to the matching item's label. */
  currentLabel?: string;
}) {
  const all = groups.flatMap((g) => g.items);
  const current = value == null ? null : all.find((i) => i.id === value) ?? all[0];
  const hero = value == null ? currentPreview : current?.preview("hero");

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{label}</span>
        {hint && <span className="text-[0.5625rem] text-gray-400 dark:text-gray-500">{hint}</span>}
      </div>

      {/* CURRENT — what is selected, shown at a size you can actually read. */}
      {hero && (
        <div className="rounded-xl border border-line bg-surface-2 p-2">
          <div className="h-20 overflow-hidden rounded-lg border border-line bg-surface">{hero}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            <span className="text-[0.6875rem] font-semibold text-ink">{currentLabel ?? current?.label ?? "Current look"}</span>
            <span className="ml-auto text-[0.5625rem] uppercase tracking-wider text-gray-400 dark:text-gray-500">{value == null ? "Now" : "Applied"}</span>
          </div>
        </div>
      )}

      {/* OPTIONS — every design, shown rather than named. */}
      {groups.map((g, gi) => (
        <div key={g.group ?? gi} className="space-y-1.5">
          {g.group && (
            <div className="px-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-muted">{g.group}</div>
          )}
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={g.group ? `${g.group} — ${ariaLabel}` : ariaLabel}>
            {g.items.map((it) => {
              const on = it.id === value;
              return (
                <button
                  key={it.id || "default"}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${it.label} ${itemNoun}`}
                  title={it.label}
                  onClick={() => onPick(it.id)}
                  className={`group flex flex-col gap-1 rounded-xl border p-1.5 text-left transition-colors ${
                    on
                      ? "border-brand bg-brand/10 ring-1 ring-brand/40"
                      : "border-line hover:border-brand/50 hover:bg-brand/5"
                  }`}
                >
                  <span className="block h-12 overflow-hidden rounded-lg border border-line bg-surface">{it.preview("tile")}</span>
                  <span className={`block truncate text-center text-[0.6875rem] font-semibold ${on ? "text-brand" : "text-ink"}`}>
                    {it.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
