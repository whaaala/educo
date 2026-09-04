/**
 * Reusable icon → inline-SVG string, so icons work in the EXPORTED HTML (not just the React canvas).
 *
 * Icons come from FOUR free libraries so users can pick almost any icon they need:
 *   • lucide            (bare names, e.g. "Calendar")   — eager (bundled, the default set)
 *   • Simple Icons      ("si-" prefix, brand/social)     — lazy-loaded on demand
 *   • Material Symbols  ("ms-" prefix, Google, outlined) — lazy-loaded on demand
 *   • Ionicons          ("ion-" prefix)                  — lazy-loaded on demand
 *
 * lucide stays bundled (back-compat: existing docs store bare lucide names). The other three sources are
 * ~8MB of SVG combined, so they are CODE-SPLIT and lazy-loaded per source — only when a user actually
 * browses/uses them. A tiny (145KB) names index is eager so the picker can search/list every icon instantly.
 *
 * `iconSvg(name)` stays synchronous (export + canvas rely on it). If an icon's source isn't loaded yet it
 * returns "" and kicks off the load; subscribe with `onIconsLoaded` to re-render when it arrives, or call
 * `warmIcons(names)` up-front (e.g. before export / on doc load) to guarantee the SVGs are present.
 *
 * Regenerate maps: node scripts/gen-icon-svg.js (lucide) + node scripts/gen-all-icons.js (others)
 */
import { ICON_SVG_MAP } from "./icon-svg-map.generated";
import { SOURCE_NAMES } from "./icon-names.generated";

export type IconSource = "lucide" | "simple" | "material" | "ionicons";

const loaded: Record<string, string> = {}; // non-lucide SVGs, filled in as sources load
const loadedSources = new Set<IconSource>(["lucide"]);
const pending: Partial<Record<IconSource, Promise<void>>> = {};
const listeners = new Set<() => void>();

/** Subscribe to be notified when a lazy icon source finishes loading (so components can re-render). */
export function onIconsLoaded(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function emit() { listeners.forEach((f) => f()); }

/** Which library an icon name belongs to (by prefix). Bare names are lucide. */
export function iconSourceOf(name?: string): IconSource {
  if (!name) return "lucide";
  if (name.startsWith("si-")) return "simple";
  if (name.startsWith("ms-")) return "material";
  if (name.startsWith("ion-")) return "ionicons";
  return "lucide";
}

/** Lazy-load one icon source's SVG map (idempotent; dedupes concurrent calls). */
export function loadIconSource(src: IconSource): Promise<void> {
  if (loadedSources.has(src)) return Promise.resolve();
  if (pending[src]) return pending[src]!;
  const imp =
    src === "simple" ? import("./icon-svg-map.simple.generated")
    : src === "material" ? import("./icon-svg-map.material.generated")
    : src === "ionicons" ? import("./icon-svg-map.ionicons.generated")
    : Promise.resolve({ MAP: {} as Record<string, string> });
  const p = imp.then((m) => {
    Object.assign(loaded, m.MAP);
    loadedSources.add(src);
    delete pending[src];
    emit();
  });
  pending[src] = p;
  return p;
}

export function isIconSourceLoaded(src: IconSource): boolean {
  return loadedSources.has(src);
}

export function iconSvg(name?: string): string {
  if (!name) return "";
  if (name in ICON_SVG_MAP) return ICON_SVG_MAP[name];
  if (name in loaded) return loaded[name];
  const src = iconSourceOf(name);
  if (src !== "lucide" && !loadedSources.has(src)) loadIconSource(src); // fire-and-forget; re-render on load
  return "";
}

/** True when the name exists in ANY library (even if its SVG isn't loaded into memory yet). */
export function hasIcon(name?: string): boolean {
  if (!name) return false;
  if (name in ICON_SVG_MAP || name in loaded) return true;
  const src = iconSourceOf(name);
  if (src === "lucide") return false;
  return (SOURCE_NAMES as Record<string, readonly string[]>)[src]?.includes(name) ?? false;
}

/** Ensure the SVGs for these icon names are loaded (loads whatever sources they need). */
export function warmIcons(names: (string | undefined)[]): Promise<void> {
  const srcs = new Set<IconSource>();
  for (const n of names) { const s = iconSourceOf(n); if (s !== "lucide") srcs.add(s); }
  return Promise.all([...srcs].map(loadIconSource)).then(() => {});
}

/** Every icon name available to pickers, across all four libraries (names are cheap; SVGs load lazily). */
export const ALL_ICON_NAMES: string[] = [
  ...Object.keys(ICON_SVG_MAP),
  ...SOURCE_NAMES.simple,
  ...SOURCE_NAMES.material,
  ...SOURCE_NAMES.ionicons,
];
