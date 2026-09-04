"use client";

/**
 * Box Builder — the recursive drag-and-drop website engine, now a MULTI-PAGE site. Each page is its own
 * BoxNode tree (stack of row bands; sections resize / float / multi-select / bulk-edit; every block carries
 * its own background, border, shadow, typography, radius; per-breakpoint responsive overrides). Pages,
 * navigation between them, a visitor Preview and HTML export turn the engine into an actual website.
 * The whole site persists to localStorage.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2, Undo2, Redo2, Eye, X, Home, Trash2, Files, Download, Settings2, Palette, SlidersHorizontal, PanelRightClose, PanelRightOpen } from "lucide-react";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import { THEMES, type ThemeId } from "@/lib/theme-config";
import {
  type BoxNode, type Breakpoint, createContainer, findBox, findParent, updateBox, insertBox, removeBox, duplicateBox, widthPct, makeRowBand, normalizeRowBands, groupBoxes, alignInRow, alignInRowOf,
  floatBox, unfloatBox, bringToFront, bringForward, sendBackward, sendToBack,
  resolveResponsive, updateBoxResponsive, clearOverride, hasOverride, isContainer,
} from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import {
  type BoxSite, siteFromRoot, coerceSite, normalizeSite, setPageRoot, addPage, deletePage, renamePage, setHomePage, duplicatePage, emptyPageRoot, setSiteTheme,
} from "@/lib/box-site";
import { renderSiteHTML, downloadHTML } from "@/lib/box-export";
import { warmIcons, hasIcon } from "@/lib/educo-ui/icon-svg";
import BoxCanvas, { measureFloatGeom, measureGroupGeom } from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import BulkInspector from "@/components/website/box/BulkInspector";
import BlocksPanel from "@/components/website/box/BlocksPanel";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { ToolBtn, ToolDivider, Segmented } from "@/components/website/box/ui";
import PageLoader from "@/components/shared/PageLoader";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

const KEY = "educo_box_site_v1"; // multi-page site
const LEGACY_KEY = "educo_box_demo_v9"; // old single-tree document (migrated on load)
const CLEANED_KEY = "educo_box_site_cleaned_v1"; // one-time flag: empty-section chrome already pruned
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
// A fresh page starts BLANK — an empty, transparent canvas. Blocks you drop land standalone (no tinted Section
// chrome around them); "Add section" is how you deliberately create a tinted, padded layout container.
const starter = (): BoxNode => pageRoot([]);
const countSections = (root: BoxNode): number => (root.children ?? []).reduce((n, row) => n + (row.children?.length ?? 0), 0);

// One-time cleanup for pages saved by the OLD starter (which seeded 2 empty tinted sections). A root row is
// "empty chrome" when its whole subtree holds no real content — no element/component anywhere, just nested
// containers — so we drop it. Runs ONCE (guarded by a flag) so a section a user deliberately leaves empty
// from now on is never removed on reload.
const hasRealContent = (n: BoxNode): boolean => (n.type !== "container" ? true : (n.children ?? []).some(hasRealContent));
function pruneEmptyChrome(root: BoxNode): BoxNode {
  const rows = (root.children ?? []).filter(hasRealContent);
  return rows.length === (root.children?.length ?? 0) ? root : { ...root, children: rows };
}

type Hist = { present: BoxSite; past: BoxSite[]; future: BoxSite[] };
const HIST_CAP = 100;

export default function BoxDemoPage() {
  const [hist, setHist] = useState<Hist | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pendingReveal = useRef<string | null>(null); // id of a just-added block to select + scroll into view
  const [device, setDevice] = useState<Device>("full");
  const [preview, setPreview] = useState(false);
  const [pageMenu, setPageMenu] = useState(false); // page-settings popover open
  const [confirmDeletePage, setConfirmDeletePage] = useState(false); // delete-page confirmation modal
  const [inspectorOpen, setInspectorOpen] = useState(true); // right Inspector panel collapsed?

  const site = hist?.present ?? null;
  const activePage = site ? (site.pages.find((p) => p.id === activePageId) ?? site.pages[0]) : null;
  const root = activePage?.root ?? null;

  useEffect(() => {
    let loaded: BoxSite | null = null;
    try { const raw = localStorage.getItem(KEY); if (raw) loaded = coerceSite(JSON.parse(raw)); } catch { /* ignore */ }
    if (!loaded) { try { const legacy = localStorage.getItem(LEGACY_KEY); if (legacy) loaded = coerceSite(JSON.parse(legacy)); } catch { /* ignore */ } }
    // One-time: strip empty tinted sections left by the old starter from previously-saved sites.
    if (loaded) {
      try {
        if (!localStorage.getItem(CLEANED_KEY)) {
          loaded = { ...loaded, pages: loaded.pages.map((p) => ({ ...p, root: pruneEmptyChrome(p.root) })) };
          localStorage.setItem(CLEANED_KEY, "1");
        }
      } catch { /* ignore */ }
    }
    const s = normalizeSite(loaded ?? siteFromRoot(starter()), ROW_GAP);
    setHist({ present: s, past: [], future: [] });
    setActivePageId(s.homeId);
  }, []);
  useEffect(() => { if (site) { try { localStorage.setItem(KEY, JSON.stringify(site)); } catch { /* ignore */ } } }, [site]);
  // After the tree changes, scroll a freshly-added block into view (set via revealBox) so it's never lost.
  useEffect(() => {
    const id = pendingReveal.current;
    if (!id) return;
    pendingReveal.current = null;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }, [site]);

  const pushSite = (next: BoxSite) => setHist((h) => (h ? { present: next, past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));
  const resetSite = (next: BoxSite) => { const s = normalizeSite(next, ROW_GAP); setHist({ present: s, past: [], future: [] }); setActivePageId(s.homeId); setSelectedIds([]); };
  // An edit to the ACTIVE page's tree.
  const commit = (nextRoot: BoxNode) => setHist((h) => (h && activePage ? { present: setPageRoot(h.present, activePage.id, normalizeRowBands(nextRoot, ROW_GAP)), past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));
  // Race-safe edit: `fn` receives the LATEST committed root (not a possibly-stale render closure), so rapid
  // successive actions (e.g. adding several blocks fast) each build on the previous result — every new block
  // lands in its OWN full-width row instead of being grouped into a shared row band with clamped widths.
  const commitWith = (fn: (currentRoot: BoxNode) => BoxNode) => setHist((h) => {
    if (!h || !activePage) return h;
    const cur = h.present.pages.find((p) => p.id === activePage.id)?.root;
    if (!cur) return h;
    const next = normalizeRowBands(fn(cur), ROW_GAP);
    return { present: setPageRoot(h.present, activePage.id, next), past: [...h.past, h.present].slice(-HIST_CAP), future: [] };
  });

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

  // The WEBSITE's theme (saved with the site) drives the canvas + content + export — independent of the editor's
  // own appearance. Defaults to Light for a fresh site.
  const siteThemeId = site?.themeId ?? "light";
  const renderTheme = useMemo(() => resolveSiteTheme(DEFAULT_THEME, siteThemeId), [siteThemeId]);
  const setWebsiteTheme = (id: string) => setHist((h) => (h ? { present: setSiteTheme(h.present, id), past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));

  // ── Isolated preview (Phase 0.4): render the ACTUAL export HTML in a sandboxed iframe, so the
  // preview is a true WYSIWYG of the exported, self-contained site — no editor styles bleed in. ──
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const previewHTML = useMemo(() => (preview && site ? renderSiteHTML(site, renderTheme, { preview: true }) : ""), [preview, site, renderTheme]);
  const scrollPreviewToPage = useCallback((path: string) => {
    const win = previewFrameRef.current?.contentWindow;
    if (win) win.location.hash = `#${path}`;
  }, []);

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
  const onAddPage = () => { const { site: s, id } = addPage(site, `Page ${site.pages.length + 1}`, emptyPageRoot()); pushSite(s); setActivePageId(id); setSelectedIds([]); };
  const onDuplicatePage = () => { const { site: s, id } = duplicatePage(site, activePage.id); pushSite(s); setActivePageId(id); setPageMenu(false); };
  const onRenamePage = (name: string) => pushSite(renamePage(site, activePage.id, name));
  const onDeletePage = () => { if (site.pages.length <= 1) return; const s = deletePage(site, activePage.id); pushSite(s); setActivePageId(s.homeId); setSelectedIds([]); setPageMenu(false); setConfirmDeletePage(false); };
  const onSetHome = () => { pushSite(setHomePage(site, activePage.id)); setPageMenu(false); };

  const addSection = () => { const sec = makeSection(SECTION_TINTS[countSections(root) % SECTION_TINTS.length]); sec.width = "100%"; commit(insertBox(root, root.id, root.children?.length ?? 0, makeRow([sec]))); };
  const onPatch = (patch: Partial<BoxNode>) => { if (selected) commit(patchAt(root, selected.id, patch)); };
  const resetOverride = () => { if (selected && bp !== "base") commit(clearOverride(root, selected.id, bp)); };
  const addChildSection = () => { if (!selected) return; const tint = SECTION_TINTS[(countSections(selected) + 1) % SECTION_TINTS.length]; const child = makeBlock(tint, "100%"); const pid = selected.id; commitWith((cur) => insertBox(cur, pid, findBox(cur, pid)?.children?.length ?? 0, child)); revealBox(child.id); };

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
  const bulkGroup = () => {
    const g = measureGroupGeom(root, selectedIds);
    if (!g) return;
    const next = groupBoxes(root, selectedIds, g);
    commit(next);
    const groupId = (next.children ?? []).filter((c) => c.position === "absolute").slice(-1)[0]?.id; // new group = root's last float
    if (groupId) setSelectedIds([groupId]);
  };

  // Non-lucide icons (Brands/Google/Ionicons) load lazily, so warm every icon the site uses BEFORE
  // building the HTML — otherwise iconSvg() would return "" for icons whose source isn't in memory yet.
  const onExport = async () => {
    const names: string[] = [];
    const walk = (v: unknown) => {
      if (typeof v === "string") { if (hasIcon(v)) names.push(v); }
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(walk);
    };
    walk(site);
    await warmIcons(names);
    downloadHTML(renderSiteHTML(site, renderTheme), "site.html");
  };

  // Click-to-add from the palette: insert into the selected container (or the page) with an optional style.
  const insertBlock = (kind: string, patch: Partial<BoxNode> = {}) => {
    const node = blockForKind(kind, patch);
    // Drop where YOU target: into the selected container if one is selected, else onto the page. Every block
    // (element OR component) sits in its own TRANSPARENT, hug-to-content wrapper — the only visible box is the
    // one the block itself paints. The tinted "Section" chrome only appears when you deliberately Add a section.
    commitWith((cur) => {
      const parentId = selected && isContainer(selected) ? selected.id : cur.id;
      const target = findBox(cur, parentId) ?? cur;
      return insertBox(cur, parentId, target.children?.length ?? 0, node);
    });
    // "Flow + auto-reveal": a new block joins the normal flow (a floating sibling overlays it), so SELECT it and
    // scroll it into view — you always see exactly what landed and where, never lost behind a floating card.
    revealBox(node.id);
  };

  // Select a box and scroll it into view AFTER the tree re-renders (so a just-added block is never hidden —
  // e.g. behind a floating sibling on the overlay layer). The reveal id is consumed by the effect below.
  const revealBox = (id: string) => { pendingReveal.current = id; setSelectedIds([id]); };

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
              <button key={p.id} onClick={() => { switchPage(p.id); scrollPreviewToPage(p.path); }} aria-current={p.id === activePage.id} className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${p.id === activePage.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>{p.name}{p.id === site.homeId ? " ·" : ""}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center rounded-lg border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-0.5" role="group" aria-label="Preview screen size">
            {DEVICES.map((d) => <button key={d.id} onClick={() => setDevice(d.id)} aria-label={`${d.label} preview`} aria-pressed={device === d.id} className={`p-1.5 rounded-md ${device === d.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}><d.Icon className="w-4 h-4" /></button>)}
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-6 flex justify-center">
          <iframe
            ref={previewFrameRef}
            title="Site preview"
            srcDoc={previewHTML}
            sandbox="allow-same-origin allow-scripts allow-popups"
            className="bg-white shadow-2xl rounded-xl ring-1 ring-black/10 shrink-0 border-0"
            style={{ width: frameW ?? "100%", maxWidth: frameW ? undefined : "64rem", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-canvas">
      {/* ── Top app bar ── */}
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 border-b border-line bg-surface z-30">
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
            <div className="absolute top-full left-0 mt-2 z-40 w-60 rounded-xl border border-line bg-surface shadow-2xl p-2.5 space-y-2">
              <label className="block"><span className="text-[0.625rem] font-medium text-gray-500">Page name</span>
                <input value={activePage.name} onChange={(e) => onRenamePage(e.target.value)} aria-label="Page name" className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-line bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 mt-0.5" />
              </label>
              <div className="text-[0.625rem] text-gray-400">/{activePage.path}{activePage.id === site.homeId ? " · home page" : ""}</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={onSetHome} disabled={activePage.id === site.homeId} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-line text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"><Home className="w-3.5 h-3.5" /> Home</button>
                <button onClick={onDuplicatePage} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-line text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10"><Files className="w-3.5 h-3.5" /> Duplicate</button>
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
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => commit(updateBox(root, root.id, { baseFont: Number(e.target.value) || 10 }))} aria-label="Base size (px)" className="w-12 text-xs px-1.5 py-1 rounded-lg border border-line bg-transparent" />
          </label>
          {/* WEBSITE theme (saved with the site → canvas + content + export). Distinct from the editor-appearance switcher. */}
          <ThemeSwitcher align="right" value={siteThemeId as ThemeId} onChange={setWebsiteTheme} ariaLabel="Website theme" triggerIcon={Palette} triggerLabel={THEMES[siteThemeId as ThemeId]?.label ?? "Theme"} />
          {/* EDITOR appearance (how the builder UI looks). */}
          <ThemeSwitcher compact align="right" />
        </div>
      </header>

      {/* ── Body: Canvas (with the FLOATING Blocks panel over it) · Inspector ── */}
      <div className="flex-1 flex min-h-0">
        {/* The Blocks panel floats over this column, so the canvas keeps its full width. */}
        <div className="relative flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0 overflow-auto">
            <div className="p-8 flex justify-center min-h-full">
              <div className={`shadow-sm rounded-xl ring-1 ring-black/10 dark:ring-white/10 shrink-0 h-fit transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: frameW ?? undefined, background: renderTheme.background, color: renderTheme.text, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
                <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedIds={selectedIds} onSelectIds={setSelectedIds} onChange={commit} breakpoint={bp} />
              </div>
            </div>
          </div>
          <BlocksPanel theme={renderTheme} onPick={insertBlock} />
        </div>

        {inspectorOpen ? (
          <aside className="w-[22rem] shrink-0 border-l border-line bg-surface flex flex-col">
            <div className="h-11 shrink-0 flex items-center gap-2 px-3.5 border-b border-line">
              <span className="grid place-items-center w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"><SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2} /></span>
              <span className="flex-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Inspector</span>
              <button onClick={() => setInspectorOpen(false)} aria-label="Collapse inspector" title="Collapse panel" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><PanelRightClose className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {bulk ? (
                <BulkInspector count={selectedIds.length} theme={renderTheme} sample={(() => { const f = findBox(root, selectedIds[0]); return f ? resolveResponsive(f, bp) : null; })()} onStepWidth={bulkStepWidth} onStepHeight={bulkStepHeight} onPatch={bulkPatch} onDuplicate={bulkDuplicate} onDelete={bulkDelete} onFloatAll={bulkFloat} onGroup={bulkGroup} />
              ) : selected ? (
                <BoxInspector node={bp === "base" ? selected : resolveResponsive(selected, bp)} theme={renderTheme} onPatch={onPatch} onAddChild={addChildSection} onFloat={floatSelected} onUnfloat={unfloatSelected} onLayer={layerSelected} onAlignInRow={(j) => commit(alignInRow(root, selected.id, j))} rowJustify={alignInRowOf(root, selected.id)} canFloat={selected.id !== root.id} inGrid={findParent(root, selected.id)?.parent.layout === "grid"} breakpoint={bp} overridden={hasOverride(selected, bp)} onResetOverride={resetOverride} pages={pageList} currentPageId={activePage.id} />
              ) : (
                <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block to edit it — or drag a box on empty canvas to select several at once.</div>
              )}
            </div>
          </aside>
        ) : (
          <aside className="w-11 shrink-0 border-l border-line bg-surface flex flex-col items-center pt-3 gap-2">
            <button onClick={() => setInspectorOpen(true)} aria-label="Expand inspector" title="Open Inspector" className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><PanelRightOpen className="w-4 h-4" /></button>
            <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-400 [writing-mode:vertical-rl] rotate-180">Inspector</span>
          </aside>
        )}
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
