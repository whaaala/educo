"use client";

/**
 * Box Builder — the recursive drag-and-drop website engine, now a MULTI-PAGE site. Each page is its own
 * BoxNode tree (stack of row bands; sections resize / float / multi-select / bulk-edit; every block carries
 * its own background, border, shadow, typography, radius; per-breakpoint responsive overrides). Pages,
 * navigation between them, a visitor Preview and HTML export turn the engine into an actual website.
 * The whole site persists to localStorage.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2, Undo2, Redo2, Eye, X, Home, Trash2, Files, Download, Settings2, PanelLeftOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type Breakpoint, createContainer, findBox, findParent, updateBox, insertBox, removeBox, duplicateBox, widthPct, makeRowBand, normalizeRowBands,
  floatBox, unfloatBox, bringToFront, bringForward, sendBackward, sendToBack,
  resolveResponsive, updateBoxResponsive, clearOverride, hasOverride, isContainer,
} from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import {
  type BoxSite, siteFromRoot, coerceSite, normalizeSite, setPageRoot, addPage, deletePage, renamePage, setHomePage, duplicatePage, emptyPageRoot, pageIdFromHref,
} from "@/lib/box-site";
import { renderSiteHTML, downloadHTML } from "@/lib/box-export";
import BoxCanvas, { measureFloatGeom } from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import BulkInspector from "@/components/website/box/BulkInspector";
import BlocksPanel from "@/components/website/box/BlocksPanel";
import { ToolBtn, ToolDivider, Segmented } from "@/components/website/box/ui";
import PageLoader from "@/components/shared/PageLoader";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

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
  const [blocksOpen, setBlocksOpen] = useState(true); // left blocks palette collapsed?
  const [confirmDeletePage, setConfirmDeletePage] = useState(false); // delete-page confirmation modal

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
  const onDeletePage = () => { if (site.pages.length <= 1) return; const s = deletePage(site, activePage.id); pushSite(s); setActivePageId(s.homeId); setSelectedIds([]); setPageMenu(false); setConfirmDeletePage(false); };
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

  // Click-to-add from the palette: insert into the selected container (or the page) with an optional style.
  const insertBlock = (kind: string, patch: Partial<BoxNode> = {}) => {
    const parentId = selected && isContainer(selected) ? selected.id : root.id;
    const target = findBox(root, parentId) ?? root;
    commit(insertBox(root, parentId, target.children?.length ?? 0, blockForKind(kind, patch)));
  };

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
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 midnight:bg-[#060a1e] purple:bg-[#120722]">
        <div className="h-12 shrink-0 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white dark:bg-[#161922]">
          <button onClick={() => setPreview(false)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><X className="w-3.5 h-3.5" /> Exit preview</button>
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Pages">
            {site.pages.map((p) => (
              <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${p.id === activePage.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>{p.name}{p.id === site.homeId ? " ·" : ""}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center rounded-lg border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-0.5" role="group" aria-label="Preview screen size">
            {DEVICES.map((d) => <button key={d.id} onClick={() => setDevice(d.id)} aria-label={`${d.label} preview`} aria-pressed={device === d.id} className={`p-1.5 rounded-md ${device === d.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}><d.Icon className="w-4 h-4" /></button>)}
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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0d1016]">
      {/* ── Top app bar ── */}
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] z-30">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 mr-1 shrink-0">Box Builder</span>
        <ToolDivider />

        {/* Page tabs */}
        <div className="relative flex items-center gap-0.5 rounded-xl bg-gray-100 dark:bg-white/5 p-1" role="group" aria-label="Pages">
          {site.pages.map((p) => (
            <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} title={p.name} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium max-w-[9rem] truncate ${p.id === activePage.id ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 shadow-sm" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100"}`}>{p.id === site.homeId && <Home className="w-3 h-3 shrink-0" />}{p.name}</button>
          ))}
          <button onClick={onAddPage} aria-label="Add page" title="Add page" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 hover:bg-white dark:hover:bg-white/10"><Plus className="w-4 h-4" /></button>
          <button onClick={() => setPageMenu((v) => !v)} aria-label="Page settings" aria-expanded={pageMenu} title="Page settings" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 hover:bg-white dark:hover:bg-white/10"><Settings2 className="w-4 h-4" /></button>
          {pageMenu && (
            <div className="absolute top-full left-0 mt-2 z-40 w-60 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] shadow-2xl p-2.5 space-y-2">
              <label className="block"><span className="text-[0.625rem] font-medium text-gray-500">Page name</span>
                <input value={activePage.name} onChange={(e) => onRenamePage(e.target.value)} aria-label="Page name" className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 mt-0.5" />
              </label>
              <div className="text-[0.625rem] text-gray-400">/{activePage.path}{activePage.id === site.homeId ? " · home page" : ""}</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={onSetHome} disabled={activePage.id === site.homeId} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"><Home className="w-3.5 h-3.5" /> Home</button>
                <button onClick={onDuplicatePage} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10"><Files className="w-3.5 h-3.5" /> Duplicate</button>
              </div>
              <button onClick={() => { setPageMenu(false); setConfirmDeletePage(true); }} disabled={site.pages.length <= 1} title={site.pages.length <= 1 ? "A site needs at least one page" : "Delete this page"} className="w-full flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /> Delete page</button>
            </div>
          )}
        </div>
        <ToolDivider />

        <ToolBtn onClick={addSection} primary title="Add a full-width section"><Plus className="w-3.5 h-3.5" /> Add section</ToolBtn>
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={undo} disabled={!canUndo} ariaLabel="Undo" title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={redo} disabled={!canRedo} ariaLabel="Redo" title="Redo (Ctrl+Y)"><Redo2 className="w-4 h-4" /></ToolBtn>
        </div>
        <ToolDivider />
        <ToolBtn onClick={() => setPreview(true)} title="See it as a visitor"><Eye className="w-3.5 h-3.5" /> Preview</ToolBtn>
        <ToolBtn onClick={onExport} title="Download the whole site as HTML"><Download className="w-3.5 h-3.5" /> Export</ToolBtn>
        <ToolBtn onClick={() => resetSite(siteFromRoot(starter()))} title="Start over">Reset</ToolBtn>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <Segmented ariaLabel="Preview screen size" value={device} onChange={setDevice} options={DEVICES.map((d) => ({ value: d.id, Icon: d.Icon, title: `${d.label}${d.w ? ` (${d.w}px)` : ""}` }))} />
          <label className="flex items-center gap-1 text-[0.6875rem] text-gray-400" title="Base size in px — everything scales off this so text stays readable when zoomed (WCAG)">
            <span className="hidden lg:inline">Base size</span>
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => commit(updateBox(root, root.id, { baseFont: Number(e.target.value) || 10 }))} aria-label="Base size (px)" className="w-12 text-xs px-1.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent" />
          </label>
        </div>
      </header>

      {/* ── Body: Blocks · Canvas · Inspector ── */}
      <div className="flex-1 flex min-h-0">
        {blocksOpen ? (
          <aside className="w-44 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] overflow-y-auto"><BlocksPanel theme={renderTheme} onPick={insertBlock} onCollapse={() => setBlocksOpen(false)} /></aside>
        ) : (
          <aside className="w-10 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] flex flex-col items-center pt-3">
            <button onClick={() => setBlocksOpen(true)} aria-label="Show blocks panel" title="Show blocks" className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10"><PanelLeftOpen className="w-4 h-4" /></button>
            <span className="mt-2 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-400 [writing-mode:vertical-rl] rotate-180">Blocks</span>
          </aside>
        )}

        <div className="flex-1 min-w-0 overflow-auto">
          <div className="p-8 flex justify-center min-h-full">
            <div className={`bg-white shadow-sm rounded-xl ring-1 ring-gray-200/70 dark:ring-white/10 shrink-0 h-fit transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: frameW ?? undefined, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
              <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedIds={selectedIds} onSelectIds={setSelectedIds} onChange={commit} breakpoint={bp} />
            </div>
          </div>
        </div>

        <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] overflow-y-auto">
          <div className="h-11 flex items-center px-3 border-b border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-wide text-gray-500">Inspector</div>
          {bulk ? (
            <BulkInspector count={selectedIds.length} theme={renderTheme} sample={(() => { const f = findBox(root, selectedIds[0]); return f ? resolveResponsive(f, bp) : null; })()} onStepWidth={bulkStepWidth} onStepHeight={bulkStepHeight} onPatch={bulkPatch} onDuplicate={bulkDuplicate} onDelete={bulkDelete} onFloatAll={bulkFloat} />
          ) : selected ? (
            <BoxInspector node={bp === "base" ? selected : resolveResponsive(selected, bp)} theme={renderTheme} onPatch={onPatch} onAddChild={addChildSection} onFloat={floatSelected} onUnfloat={unfloatSelected} onLayer={layerSelected} canFloat={selected.id !== root.id} inGrid={findParent(root, selected.id)?.parent.layout === "grid"} breakpoint={bp} overridden={hasOverride(selected, bp)} onResetOverride={resetOverride} pages={pageList} currentPageId={activePage.id} />
          ) : (
            <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block to edit it — or drag a box on empty canvas to select several at once.</div>
          )}
        </aside>
      </div>

      <DeleteConfirmationModal
        isOpen={confirmDeletePage}
        onClose={() => setConfirmDeletePage(false)}
        onConfirm={onDeletePage}
        title="Delete this page?"
        itemName={activePage.name}
        itemId={`/${activePage.path}`}
        confirmButtonText="Delete page"
        warningMessage={`Deleting “${activePage.name}” permanently removes the page and everything on it. You'll need to rebuild it from scratch — though you can still Undo (Ctrl+Z) right after.`}
      />
    </div>
  );
}
