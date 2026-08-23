"use client";

/**
 * Box-builder demo — sections auto-divide the page equally (Excel-sheet style). One section fills the
 * whole page; adding another splits the height evenly; a third → thirds; etc. Resize any section and
 * we prompt whether to reflow the others so the page stays filled. Persists to localStorage.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2, Undo2, Redo2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, createContainer, findBox, updateBox, insertBox, makeRowBand, normalizeRowBands, widthPct,
} from "@/lib/box-model";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import PageLoader from "@/components/shared/PageLoader";

const KEY = "educo_box_demo_v8"; // v8: sections are wrapping ROWS of blocks (add beside → wrap); children fit the section height
const PAGE_MIN_H = 160; // small floor only; the page FITS its content (no leftover empty band) and grows/scrolls
const ROW_GAP = 0;      // gap between sections inside a row (0 = flush)
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

/** The page: a vertical STACK of ROW bands. Each row lays its sections out side-by-side; add another row
 *  below to grow the page. Sections move freely between rows and into a row's empty space (drag-and-drop). */
function pageRoot(rows: BoxNode[] = []): BoxNode {
  const r = createContainer("column", { layout: "flex", direction: "column", wrap: false, padding: 0, gap: 0, width: "fill", align: "stretch", justify: "start", baseFont: 10 });
  r.children = rows;
  return r;
}

/** A row band holding sections side-by-side. */
function makeRow(sections: BoxNode[] = []): BoxNode {
  return makeRowBand(sections, ROW_GAP);
}

/** A SECTION: a wrapping ROW of blocks. Blocks you add sit BESIDE each other (columns) and wrap to a new
 *  row inside the section when the row is full; each block STRETCHES to the section's height and is clipped
 *  so it can never grow taller than the section. Give it a background, then build any layout inside it. */
function makeSection(bg: string): BoxNode {
  return createContainer("row", { direction: "row", wrap: true, width: "100%", padding: 48, gap: 12, align: "stretch", justify: "start", background: bg, clip: true });
}

/** A block placed INSIDE a section: fills the section's height (no fixed height — stretches), width = its
 *  share of the row. Reuses the section styling so any block can itself hold more blocks (recursive). */
function makeBlock(bg: string, width: string): BoxNode {
  return createContainer("row", { direction: "row", wrap: true, width, padding: 24, gap: 12, align: "stretch", justify: "start", background: bg, clip: true });
}

function starter(): BoxNode {
  return pageRoot([makeRow([makeSection(SECTION_TINTS[0])]), makeRow([makeSection(SECTION_TINTS[1])])]);
}

/** Count sections across all rows (for cycling background tints). */
function countSections(root: BoxNode): number {
  return (root.children ?? []).reduce((n, row) => n + (row.children?.length ?? 0), 0);
}

// Undo/redo history: present tree + past/future stacks.
type Hist = { present: BoxNode; past: BoxNode[]; future: BoxNode[] };
const HIST_CAP = 100;

export default function BoxDemoPage() {
  const { theme: appTheme } = useTheme();
  const [hist, setHist] = useState<Hist | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("full");
  const root = hist?.present ?? null;

  useEffect(() => {
    // Normalize on load too, so any previously-saved over-full rows are repaired (clamped ≤100%, no overflow).
    try { const raw = localStorage.getItem(KEY); setHist({ present: normalizeRowBands(raw ? JSON.parse(raw) : starter(), ROW_GAP), past: [], future: [] }); }
    catch { setHist({ present: starter(), past: [], future: [] }); }
  }, []);
  useEffect(() => { if (root) { try { localStorage.setItem(KEY, JSON.stringify(root)); } catch { /* ignore */ } } }, [root]);

  // A brand-new document (load / reset / blank): no history to undo into.
  const reset = (next: BoxNode) => setHist({ present: normalizeRowBands(next, ROW_GAP), past: [], future: [] });
  // An edit: normalize, push the previous state onto the undo stack, clear redo. Every mutation goes here.
  const commit = (next: BoxNode) => setHist((h) => (h ? { present: normalizeRowBands(next, ROW_GAP), past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));

  const undo = useCallback(() => setHist((h) => (h && h.past.length ? { present: h.past[h.past.length - 1], past: h.past.slice(0, -1), future: [h.present, ...h.future].slice(0, HIST_CAP) } : h)), []);
  const redo = useCallback(() => setHist((h) => (h && h.future.length ? { present: h.future[0], past: [...h.past, h.present].slice(-HIST_CAP), future: h.future.slice(1) } : h)), []);
  const canUndo = !!hist?.past.length, canRedo = !!hist?.future.length;

  // Keyboard undo/redo (Ctrl/Cmd+Z, Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z), ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return;
      const mod = e.ctrlKey || e.metaKey; const k = e.key.toLowerCase();
      if (mod && k === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (mod && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const renderTheme = useMemo(() => resolveSiteTheme(DEFAULT_THEME, appTheme), [appTheme]);

  if (!root) return <PageLoader isLoading loadingText="Box Builder" subText="Preparing your canvas…" />;
  const selected = selectedId ? findBox(root, selectedId) : null;

  // "Add section" ALWAYS creates a NEW full-width row. Multiple sections side-by-side in ONE row come only
  // from resizing a section to open space, then dragging another section into the gap. Keeps the selection.
  const addSection = () => {
    const sec = makeSection(SECTION_TINTS[countSections(root) % SECTION_TINTS.length]); sec.width = "100%";
    commit(insertBox(root, root.id, root.children?.length ?? 0, makeRow([sec])));
  };

  const onPatch = (patch: Partial<BoxNode>) => { if (selected) commit(updateBox(root, selected.id, patch)); };

  // Add a block INSIDE the selected section: it sits BESIDE the existing blocks (a column), filling the
  // row's leftover width; when the row is full it takes 100% and WRAPS to a new row inside the section.
  // The PARENT stays selected so you can keep adding. Blocks stretch to the section's height.
  const addChildSection = () => {
    if (!selected) return;
    const used = (selected.children ?? []).reduce((s, c) => s + widthPct(c.width), 0);
    const width = used <= 88 ? `${Math.max(15, Math.round(100 - used))}%` : "100%"; // fill leftover, else new row
    const block = makeBlock(SECTION_TINTS[(selected.children?.length ?? 0) % SECTION_TINTS.length], width);
    commit(insertBox(root, selected.id, selected.children?.length ?? 0, block));
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Definite-height scroll region: h-screen + overflow guarantees scrolling as the page grows / when a wide preview overflows */}
      <div className="flex-1 min-w-0 h-screen overflow-auto">
        <div className="p-6 flex flex-col items-center min-h-full">
        <div className="mb-3 flex items-center gap-3 self-stretch">
          <h1 className="text-sm font-bold text-gray-700 dark:text-gray-200">Box Builder (preview)</h1>
          <button onClick={addSection} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><Plus className="w-3.5 h-3.5" /> Add section</button>
          {/* Undo / redo (also Ctrl/Cmd+Z and Ctrl/Cmd+Y / Ctrl/Cmd+Shift+Z) */}
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo" className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"><Undo2 className="w-4 h-4" /></button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" aria-label="Redo" className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"><Redo2 className="w-4 h-4" /></button>
          <button onClick={() => { reset(starter()); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Reset</button>
          <button onClick={() => { reset(pageRoot([makeRow([makeSection(SECTION_TINTS[0])])])); setSelectedId(null); }} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Blank</button>

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
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => commit(updateBox(root, root.id, { baseFont: Number(e.target.value) || 10 }))} aria-label="Base font size (px)" className="w-12 text-xs px-1.5 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent" />
            px
          </label>
        </div>
        <div className={`bg-white shadow-2xl rounded-xl ring-1 ring-black/10 shrink-0 mx-auto transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: DEVICES.find((d) => d.id === device)!.w ?? undefined, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
          <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedId={selectedId} onSelectId={setSelectedId} onChange={commit} />
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
