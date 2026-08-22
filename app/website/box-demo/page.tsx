"use client";

/**
 * Box-builder demo — sections auto-divide the page equally (Excel-sheet style). One section fills the
 * whole page; adding another splits the height evenly; a third → thirds; etc. Resize any section and
 * we prompt whether to reflow the others so the page stays filled. Persists to localStorage.
 */

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, createContainer, createElement, findBox, updateBox, insertBox,
} from "@/lib/box-model";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import PageLoader from "@/components/shared/PageLoader";

const KEY = "educo_box_demo_v4"; // v4: page is a WRAPPING ROW so shrunk sections pack side-by-side
const PAGE_MIN_H = 160; // small floor only; the page FITS its content (no leftover empty band) and grows/scrolls
const SECTION_TINTS = ["#eef2ff", "#faf5ff", "#ecfeff", "#fef2f2", "#f0fdf4", "#fffbeb"];

/** The page: a wrapping ROW. A full-width (100%) section fills its own line (they stack); shrink two
 *  and they PACK onto the same line, filling the freed space — like a real flex/grid website. */
function pageRoot(children: BoxNode[] = []): BoxNode {
  const r = createContainer("row", { layout: "flex", wrap: true, padding: 0, gap: 0, width: "fill", align: "stretch" });
  r.children = children;
  return r;
}

/** A section that fills its line by default (width 100%) and fits its content height (shrinkable). */
function makeSection(label: string, bg: string): BoxNode {
  const s = createContainer("column", { width: "100%", padding: 48, gap: 12, align: "center", justify: "center", background: bg });
  s.children = [
    createElement("heading", { text: label, fontSize: 28 }),
    createElement("text", { text: "Section content — edit it, or drag any handle to resize.", color: "#64748b" }),
  ];
  return s;
}

function starter(): BoxNode {
  return pageRoot([makeSection("Section 1", SECTION_TINTS[0]), makeSection("Section 2", SECTION_TINTS[1])]);
}

export default function BoxDemoPage() {
  const { theme: appTheme } = useTheme();
  const [root, setRoot] = useState<BoxNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    const sec = makeSection(`Section ${n + 1}`, SECTION_TINTS[n % SECTION_TINTS.length]);
    setRoot((r) => (r ? insertBox(r, r.id, n, sec) : r));
    setSelectedId(sec.id);
  };

  const onPatch = (patch: Partial<BoxNode>) => { if (selected) setRoot((r) => (r ? updateBox(r, selected.id, patch) : r)); };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Definite-height scroll region: h-screen + overflow-y-auto guarantees vertical scrolling as the page grows */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="p-6 flex flex-col items-center min-h-full">
        <div className="mb-3 flex items-center gap-3 self-stretch">
          <h1 className="text-sm font-bold text-gray-700 dark:text-gray-200">Box Builder (preview)</h1>
          <button onClick={addSection} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><Plus className="w-3.5 h-3.5" /> Add section</button>
          <button onClick={() => { setRoot(starter()); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Reset</button>
          <button onClick={() => { setRoot(pageRoot()); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Blank</button>
          <span className="text-[11px] text-gray-400">Full-width sections stack &amp; scroll. Shrink two and they sit side-by-side. Resize from any edge/corner.</span>
        </div>
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/10" style={{ fontFamily: renderTheme.bodyFont }}>
          <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedId={selectedId} onSelectId={setSelectedId} onChange={setRoot} />
        </div>
        </div>
      </div>

      <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161922] overflow-y-auto">
        <div className="h-11 flex items-center px-3 border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wide text-gray-500">Inspector</div>
        {selected ? (
          <BoxInspector node={selected} theme={renderTheme} onPatch={onPatch} />
        ) : (
          <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block on the canvas to edit its layout, size and background.</div>
        )}
      </aside>
    </div>
  );
}
