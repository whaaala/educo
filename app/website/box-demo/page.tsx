"use client";

/**
 * Box Builder — the recursive drag-and-drop website engine, now a MULTI-PAGE site. Each page is its own
 * BoxNode tree (stack of row bands; sections resize / float / multi-select / bulk-edit; every block carries
 * its own background, border, shadow, typography, radius; per-breakpoint responsive overrides). Pages,
 * navigation between them, a visitor Preview and HTML export turn the engine into an actual website.
 * The whole site persists to localStorage.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2, Undo2, Redo2, Eye, X, Home, Trash2, Files, Download, Settings2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type Breakpoint, createContainer, findBox, findParent, updateBox, insertBox, removeBox, duplicateBox, widthPct, makeRowBand, normalizeRowBands,
  floatBox, unfloatBox, bringToFront, bringForward, sendBackward, sendToBack,
  resolveResponsive, updateBoxResponsive, clearOverride, hasOverride,
} from "@/lib/box-model";
import {
  type BoxSite, siteFromRoot, coerceSite, normalizeSite, setPageRoot, addPage, deletePage, renamePage, setHomePage, duplicatePage, emptyPageRoot, pageIdFromHref,
} from "@/lib/box-site";
import { renderSiteHTML, downloadHTML } from "@/lib/box-export";
import BoxCanvas, { measureFloatGeom } from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import BulkInspector from "@/components/website/box/BulkInspector";
import PageLoader from "@/components/shared/PageLoader";

const KEY = "educo_box_site_v1"; // multi-page site
const LEGACY_KEY = "educo_box_demo_v9"; // old single-tree document (migrated on load)
const PAGE_MIN_H = 160;
const ROW_GAP = 0;
const SECTION_TINTS = ["#eef2ff", "#faf5ff", "#ecfeff", "#fef2f2", "#f0fdf4", "#fffbeb"];

type Device = "mobile" | "tablet" | "laptop" | "desktop" | "wide" | "full";
const DEVICES: { id: Device; label: string; w: number | null; Icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", w: 375, Icon: Smartphone },
  { id: "tablet", label: "Tablet", w: 768, Icon: Tablet },
  { id: "laptop", label: "Laptop", w: 1024, Icon: Laptop },
  { id: "desktop", label: "Desktop", w: 1280, Icon: Monitor },
  { id: "wide", label: "Wide", w: 1536, Icon: Tv },
  { id: "full", label: "Full width", w: null, Icon: Maximize2 },
];

function pageRoot(rows: BoxNode[] = []): BoxNode {
  const r = createContainer("column", { layout: "flex", direction: "column", wrap: false, padding: 0, gap: 0, width: "fill", align: "stretch", justify: "start", baseFont: 10 });
  r.children = rows;
  return r;
}
const makeRow = (sections: BoxNode[] = []): BoxNode => makeRowBand(sections, ROW_GAP);
const makeSection = (bg: string): BoxNode => createContainer("column", { direction: "column", wrap: false, width: "100%", padding: 48, gap: 0, align: "stretch", justify: "start", background: bg });
const makeBlock = (bg: string, width: string): BoxNode => createContainer("column", { direction: "column", wrap: false, width, padding: 24, gap: 0, align: "stretch", justify: "start", background: bg });
const starter = (): BoxNode => pageRoot([makeRow([makeSection(SECTION_TINTS[0])]), makeRow([makeSection(SECTION_TINTS[1])])]);
const countSections = (root: BoxNode): number => (root.children ?? []).reduce((n, row) => n + (row.children?.length ?? 0), 0);

type Hist = { present: BoxSite; past: BoxSite[]; future: BoxSite[] };
const HIST_CAP = 100;

export default function BoxDemoPage() {
  const { theme: appTheme } = useTheme();
  const [hist, setHist] = useState<Hist | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [device, setDevice] = useState<Device>("full");
  const [preview, setPreview] = useState(false);
  const [pageMenu, setPageMenu] = useState(false); // page-settings popover open

  const site = hist?.present ?? null;
  const activePage = site ? (site.pages.find((p) => p.id === activePageId) ?? site.pages[0]) : null;
  const root = activePage?.root ?? null;

  useEffect(() => {
    let loaded: BoxSite | null = null;
    try { const raw = localStorage.getItem(KEY); if (raw) loaded = coerceSite(JSON.parse(raw)); } catch { /* ignore */ }
    if (!loaded) { try { const legacy = localStorage.getItem(LEGACY_KEY); if (legacy) loaded = coerceSite(JSON.parse(legacy)); } catch { /* ignore */ } }
    const s = normalizeSite(loaded ?? siteFromRoot(starter()), ROW_GAP);
    setHist({ present: s, past: [], future: [] });
    setActivePageId(s.homeId);
  }, []);
  useEffect(() => { if (site) { try { localStorage.setItem(KEY, JSON.stringify(site)); } catch { /* ignore */ } } }, [site]);

  const pushSite = (next: BoxSite) => setHist((h) => (h ? { present: next, past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));
  const resetSite = (next: BoxSite) => { const s = normalizeSite(next, ROW_GAP); setHist({ present: s, past: [], future: [] }); setActivePageId(s.homeId); setSelectedIds([]); };
  // An edit to the ACTIVE page's tree.
  const commit = (nextRoot: BoxNode) => setHist((h) => (h && activePage ? { present: setPageRoot(h.present, activePage.id, normalizeRowBands(nextRoot, ROW_GAP)), past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));

  const undo = useCallback(() => setHist((h) => (h && h.past.length ? { present: h.past[h.past.length - 1], past: h.past.slice(0, -1), future: [h.present, ...h.future].slice(0, HIST_CAP) } : h)), []);
  const redo = useCallback(() => setHist((h) => (h && h.future.length ? { present: h.future[0], past: [...h.past, h.present].slice(-HIST_CAP), future: h.future.slice(1) } : h)), []);
  const canUndo = !!hist?.past.length, canRedo = !!hist?.future.length;

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

  if (!site || !activePage || !root) return <PageLoader isLoading loadingText="Box Builder" subText="Preparing your canvas…" />;

  const selected = selectedIds.length === 1 ? findBox(root, selectedIds[0]) : null;
  const bulk = selectedIds.length > 1;
  const bp: Breakpoint = device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "base";
  const CONTENT_KEYS = new Set(["text", "href", "newTab", "anchor", "src", "icon", "html", "listItems", "listStyle"]);
  const patchAt = (base: BoxNode, id: string, patch: Partial<BoxNode>): BoxNode => {
    if (bp === "base") return updateBox(base, id, patch);
    const content: Partial<BoxNode> = {}, style: Partial<BoxNode> = {};
    for (const [k, v] of Object.entries(patch)) (CONTENT_KEYS.has(k) ? content : style)[k as keyof BoxNode] = v as never;
    let next = base;
    if (Object.keys(content).length) next = updateBox(next, id, content);
    if (Object.keys(style).length) next = updateBoxResponsive(next, id, style, bp);
    return next;
  };

  // ── Page management ──
  const switchPage = (id: string) => { setActivePageId(id); setSelectedIds([]); setPageMenu(false); };
  const onAddPage = () => { const { site: s, id } = addPage(site, `Page ${site.pages.length + 1}`, emptyPageRoot(makeSection(SECTION_TINTS[site.pages.length % SECTION_TINTS.length]))); pushSite(s); setActivePageId(id); setSelectedIds([]); };
  const onDuplicatePage = () => { const { site: s, id } = duplicatePage(site, activePage.id); pushSite(s); setActivePageId(id); setPageMenu(false); };
  const onRenamePage = (name: string) => pushSite(renamePage(site, activePage.id, name));
  const onDeletePage = () => { if (site.pages.length <= 1) return; const s = deletePage(site, activePage.id); pushSite(s); setActivePageId(s.homeId); setSelectedIds([]); setPageMenu(false); };
  const onSetHome = () => { pushSite(setHomePage(site, activePage.id)); setPageMenu(false); };

  const addSection = () => { const sec = makeSection(SECTION_TINTS[countSections(root) % SECTION_TINTS.length]); sec.width = "100%"; commit(insertBox(root, root.id, root.children?.length ?? 0, makeRow([sec]))); };
  const onPatch = (patch: Partial<BoxNode>) => { if (selected) commit(patchAt(root, selected.id, patch)); };
  const resetOverride = () => { if (selected && bp !== "base") commit(clearOverride(root, selected.id, bp)); };
  const addChildSection = () => { if (!selected) return; const tint = SECTION_TINTS[(countSections(selected) + 1) % SECTION_TINTS.length]; commit(insertBox(root, selected.id, selected.children?.length ?? 0, makeBlock(tint, "100%"))); };

  const floatSelected = () => { if (!selected) return; const g = measureFloatGeom(root, selected.id); if (g) commit(floatBox(root, selected.id, g.parentId, g.left, g.top, g.width, g.height)); };
  const unfloatSelected = () => { if (selected) commit(unfloatBox(root, selected.id)); };
  const LAYER_OPS = { front: bringToFront, forward: bringForward, backward: sendBackward, back: sendToBack };
  const layerSelected = (dir: keyof typeof LAYER_OPS) => { if (selected) commit(LAYER_OPS[dir](root, selected.id)); };

  const bulkPatch = (patch: Partial<BoxNode>) => { commit(selectedIds.reduce((next, id) => patchAt(next, id, patch), root)); };
  const bulkStepWidth = (dir: -1 | 1) => { commit(selectedIds.reduce((next, id) => { const n = findBox(next, id); if (!n) return next; const w = Math.max(5, Math.min(100, Math.round(widthPct(resolveResponsive(n, bp).width) + dir * 5))); return patchAt(next, id, { width: `${w}%` }); }, root)); };
  const bulkStepHeight = (dir: -1 | 1) => {
    commit(selectedIds.reduce((next, id) => {
      const n = findBox(next, id); if (!n) return next;
      let base = resolveResponsive(n, bp).minHeight;
      if (base == null && typeof document !== "undefined") { const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`); base = el ? el.getBoundingClientRect().height : 120; }
      return patchAt(next, id, { minHeight: Math.max(16, Math.round((base ?? 120) + dir * 24)), height: undefined });
    }, root));
  };
  const bulkDuplicate = () => { commit(selectedIds.reduce((next, id) => duplicateBox(next, id), root)); };
  const bulkDelete = () => { commit(selectedIds.reduce((next, id) => (id !== root.id ? removeBox(next, id) : next), root)); setSelectedIds([]); };
  const bulkFloat = () => { commit(selectedIds.reduce((next, id) => { const g = measureFloatGeom(next, id); return g ? floatBox(next, id, g.parentId, g.left, g.top, g.width, g.height) : next; }, root)); };

  const onExport = () => downloadHTML(renderSiteHTML(site, renderTheme), "site.html");

  // In Preview, a click on a page link switches the active page (anchors scroll natively).
  const onPreviewClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest?.("a") as HTMLAnchorElement | null;
    const pid = pageIdFromHref(a?.getAttribute("href") ?? undefined);
    if (pid && site.pages.some((p) => p.id === pid)) { e.preventDefault(); switchPage(pid); }
  };

  const frameW = DEVICES.find((d) => d.id === device)!.w;
  const pageList = site.pages.map((p) => ({ id: p.id, name: p.name }));

  // ── Visitor preview ──
  if (preview) {
    return (
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
        <div className="h-12 shrink-0 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161922]">
          <button onClick={() => setPreview(false)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><X className="w-3.5 h-3.5" /> Exit preview</button>
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Pages">
            {site.pages.map((p) => (
              <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${p.id === activePage.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{p.name}{p.id === site.homeId ? " ·" : ""}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center rounded-lg border border-gray-300 dark:border-gray-700 p-0.5" role="group" aria-label="Preview screen size">
            {DEVICES.map((d) => <button key={d.id} onClick={() => setDevice(d.id)} aria-label={`${d.label} preview`} aria-pressed={device === d.id} className={`p-1.5 rounded-md ${device === d.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><d.Icon className="w-4 h-4" /></button>)}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <div onClickCapture={onPreviewClick} className={`bg-white shadow-2xl rounded-xl ring-1 ring-black/10 shrink-0 h-fit ${frameW ? "" : "w-full max-w-5xl"}`} style={{ width: frameW ?? undefined, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
            <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} editable={false} onChange={() => {}} breakpoint={bp} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <div className="flex-1 min-w-0 h-screen overflow-auto">
        <div className="p-6 flex flex-col items-center min-h-full">
        <div className="mb-3 flex items-center gap-3 self-stretch flex-wrap">
          <h1 className="text-sm font-bold text-gray-700 dark:text-gray-200">Box Builder</h1>

          {/* Page tabs */}
          <div className="relative flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 p-0.5" role="group" aria-label="Pages">
            {site.pages.map((p) => (
              <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} title={p.name} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md whitespace-nowrap max-w-[10rem] truncate ${p.id === activePage.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{p.id === site.homeId && <Home className="w-3 h-3 shrink-0" />}{p.name}</button>
            ))}
            <button onClick={onAddPage} aria-label="Add page" title="Add page" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
            <button onClick={() => setPageMenu((v) => !v)} aria-label="Page settings" aria-expanded={pageMenu} title="Page settings" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><Settings2 className="w-4 h-4" /></button>
            {pageMenu && (
              <div className="absolute top-full left-0 mt-1 z-40 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-2 space-y-2">
                <label className="block"><span className="text-[10px] font-medium text-gray-500">Page name</span>
                  <input value={activePage.name} onChange={(e) => onRenamePage(e.target.value)} aria-label="Page name" className="w-full text-sm px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
                <div className="text-[10px] text-gray-400">/{activePage.path}{activePage.id === site.homeId ? " · home" : ""}</div>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={onSetHome} disabled={activePage.id === site.homeId} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"><Home className="w-3.5 h-3.5" /> Home</button>
                  <button onClick={onDuplicatePage} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><Files className="w-3.5 h-3.5" /> Duplicate</button>
                </div>
                <button onClick={onDeletePage} disabled={site.pages.length <= 1} className="w-full flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-md border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /> Delete page</button>
              </div>
            )}
          </div>

          <button onClick={addSection} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><Plus className="w-3.5 h-3.5" /> Add section</button>
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo" className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"><Undo2 className="w-4 h-4" /></button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" aria-label="Redo" className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"><Redo2 className="w-4 h-4" /></button>
          <button onClick={() => setPreview(true)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"><Eye className="w-3.5 h-3.5" /> Preview</button>
          <button onClick={onExport} title="Download the whole site as static HTML" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"><Download className="w-3.5 h-3.5" /> Export</button>
          <button onClick={() => resetSite(siteFromRoot(starter()))} className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">Reset</button>

          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 p-0.5 ml-auto" role="group" aria-label="Preview screen size">
            {DEVICES.map((d) => (
              <button key={d.id} onClick={() => setDevice(d.id)} title={`${d.label}${d.w ? ` (${d.w}px)` : ""}`} aria-label={`${d.label} preview`} aria-pressed={device === d.id} className={`p-1.5 rounded-md ${device === d.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><d.Icon className="w-4 h-4" /></button>
            ))}
          </div>
          <label className="flex items-center gap-1 text-[11px] text-gray-500" title="Base unit in px — rendered as rem (WCAG)">
            Base
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => commit(updateBox(root, root.id, { baseFont: Number(e.target.value) || 10 }))} aria-label="Base font size (px)" className="w-12 text-xs px-1.5 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent" />
            px
          </label>
        </div>
        <div className={`bg-white shadow-2xl rounded-xl ring-1 ring-black/10 shrink-0 mx-auto transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: frameW ?? undefined, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
          <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedIds={selectedIds} onSelectIds={setSelectedIds} onChange={commit} breakpoint={bp} />
        </div>
        </div>
      </div>

      <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161922] overflow-y-auto">
        <div className="h-11 flex items-center px-3 border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wide text-gray-500">Inspector</div>
        {bulk ? (
          <BulkInspector count={selectedIds.length} theme={renderTheme} sample={(() => { const f = findBox(root, selectedIds[0]); return f ? resolveResponsive(f, bp) : null; })()} onStepWidth={bulkStepWidth} onStepHeight={bulkStepHeight} onPatch={bulkPatch} onDuplicate={bulkDuplicate} onDelete={bulkDelete} onFloatAll={bulkFloat} />
        ) : selected ? (
          <BoxInspector node={bp === "base" ? selected : resolveResponsive(selected, bp)} theme={renderTheme} onPatch={onPatch} onAddChild={addChildSection} onFloat={floatSelected} onUnfloat={unfloatSelected} onLayer={layerSelected} canFloat={selected.id !== root.id} inGrid={findParent(root, selected.id)?.parent.layout === "grid"} breakpoint={bp} overridden={hasOverride(selected, bp)} onResetOverride={resetOverride} pages={pageList} currentPageId={activePage.id} />
        ) : (
          <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block to edit it — or drag a box on empty canvas to select several at once.</div>
        )}
      </aside>
    </div>
  );
}
