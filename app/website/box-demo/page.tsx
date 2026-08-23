"use client";

/**
 * Box-builder demo — sections auto-divide the page equally (Excel-sheet style). One section fills the
 * whole page; adding another splits the height evenly; a third → thirds; etc. Resize any section and
 * we prompt whether to reflow the others so the page stays filled. Persists to localStorage.
 */

import { useEffect, useMemo, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, createContainer, findBox, findParent, updateBox, insertBox,
} from "@/lib/box-model";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import PageLoader from "@/components/shared/PageLoader";

const KEY = "educo_box_demo_v5"; // v5: sections start EMPTY (placeholder), nothing pre-filled
const PAGE_MIN_H = 160; // small floor only; the page FITS its content (no leftover empty band) and grows/scrolls
const SECTION_TINTS = ["#eef2ff", "#faf5ff", "#ecfeff", "#fef2f2", "#f0fdf4", "#fffbeb"];

// Responsive preview widths — narrow the canvas to check how the design reflows at each screen size.
type Device = "mobile" | "tablet" | "laptop" | "desktop" | "wide" | "full";
const DEVICES: { id: Device; label: string; w: number | null; Icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", w: 375, Icon: Smartphone },
  { id: "tablet", label: "Tablet", w: 768, Icon: Tablet },
  { id: "laptop", label: "Laptop", w: 1024, Icon: Laptop },
  { id: "desktop", label: "Desktop", w: 1280, Icon: Monitor },
  { id: "wide", label: "Wide", w: 1536, Icon: Tv },
  { id: "full", label: "Full width", w: null, Icon: Maximize2 },
];

/** The page: a wrapping ROW. A full-width (100%) section fills its own line (they stack); shrink two
 *  and they PACK onto the same line, filling the freed space — like a real flex/grid website. */
function pageRoot(children: BoxNode[] = []): BoxNode {
  const r = createContainer("row", { layout: "flex", wrap: true, padding: 0, gap: 0, width: "fill", align: "stretch", baseFont: 10 });
  r.children = children;
  return r;
}

/** An EMPTY section: fills its line (width 100%), fits its content, and shows the placeholder hint
 *  until YOU add content. Nothing is pre-filled — the hint is a non-editable placeholder. */
function makeSection(bg: string): BoxNode {
  return createContainer("column", { width: "100%", padding: 48, gap: 12, align: "center", justify: "center", background: bg });
}

function starter(): BoxNode {
  return pageRoot([makeSection(SECTION_TINTS[0]), makeSection(SECTION_TINTS[1])]);
}

export default function BoxDemoPage() {
  const { theme: appTheme } = useTheme();
  const [root, setRoot] = useState<BoxNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("full");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setRoot(raw ? JSON.parse(raw) : starter()); }
    catch { setRoot(starter()); }
  }, []);
  useEffect(() => { if (root) { try { localStorage.setItem(KEY, JSON.stringify(root)); } catch { /* ignore */ } } }, [root]);

  const renderTheme = useMemo(() => resolveSiteTheme(DEFAULT_THEME, appTheme), [appTheme]);

  if (!root) return <PageLoader isLoading loadingText="Box Builder" subText="Preparing your canvas…" />;
  const selected = selectedId ? findBox(root, selectedId) : null;

  const addSection = () => {
    const n = (root.children?.length ?? 0);
    const sec = makeSection(SECTION_TINTS[n % SECTION_TINTS.length]);
    setRoot((r) => (r ? insertBox(r, r.id, n, sec) : r)); // keep the current selection — don't jump to the new one
  };

  const onPatch = (patch: Partial<BoxNode>) => { if (selected) setRoot((r) => (r ? updateBox(r, selected.id, patch) : r)); };

  // Add a nested section inside the selected container (a section within a section).
  // The PARENT stays selected (we don't select the new child) so you can keep adding into it.
  const addChildSection = () => {
    if (!selected) return;
    const child = makeSection(SECTION_TINTS[(selected.children?.length ?? 0) % SECTION_TINTS.length]);
    setRoot((r) => (r ? insertBox(r, selected.id, selected.children?.length ?? 0, child) : r));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Definite-height scroll region: h-screen + overflow guarantees scrolling as the page grows / when a wide preview overflows */}
      <div className="flex-1 min-w-0 h-screen overflow-auto">
        <div className="p-6 flex flex-col items-center min-h-full">
        <div className="mb-3 flex items-center gap-3 self-stretch">
          <h1 className="text-sm font-bold text-gray-700 dark:text-gray-200">Box Builder (preview)</h1>
          <button onClick={addSection} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><Plus className="w-3.5 h-3.5" /> Add section</button>
          <button onClick={() => { setRoot(starter()); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Reset</button>
          <button onClick={() => { setRoot(pageRoot()); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Blank</button>

          {/* Responsive preview — narrow the canvas to test each screen size */}
          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 p-0.5 ml-1" role="group" aria-label="Preview screen size">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                title={`${d.label}${d.w ? ` (${d.w}px)` : ""}`}
                aria-label={`${d.label} preview`}
                aria-pressed={device === d.id}
                className={`p-1.5 rounded-md ${device === d.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              ><d.Icon className="w-4 h-4" /></button>
            ))}
          </div>
          <span className="text-[11px] text-gray-400 tabular-nums">{DEVICES.find((d) => d.id === device)!.w ? `${DEVICES.find((d) => d.id === device)!.w}px` : "full"}</span>

          {/* Global base unit (px → rem). Everything scales off this; rem keeps it browser-relative (WCAG). */}
          <label className="ml-1 flex items-center gap-1 text-[11px] text-gray-500" title="Base unit in px — rendered as rem, so it scales with the browser font size (WCAG)">
            Base
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => setRoot((r) => (r ? updateBox(r, r.id, { baseFont: Number(e.target.value) || 10 }) : r))} aria-label="Base font size (px)" className="w-12 text-xs px-1.5 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent" />
            px
          </label>
        </div>
        <div className={`bg-white shadow-2xl rounded-xl ring-1 ring-black/10 shrink-0 mx-auto transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: DEVICES.find((d) => d.id === device)!.w ?? undefined, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
          <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedId={selectedId} onSelectId={setSelectedId} onChange={setRoot} />
        </div>
        </div>
      </div>

      <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161922] overflow-y-auto">
        <div className="h-11 flex items-center px-3 border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wide text-gray-500">Inspector</div>
        {selected ? (
          <BoxInspector node={selected} theme={renderTheme} onPatch={onPatch} onAddChild={addChildSection} />
        ) : (
          <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block on the canvas to edit its layout, size and background.</div>
        )}
      </aside>
    </div>
  );
}
