"use client";

/**
 * SiteBuilder — a modern, Framer/Webflow-style website builder for schools.
 *
 * Chrome: a slim LEFT ICON RAIL (Pages · Add · Layers · Media · Theme) opening a contextual panel,
 * a refined TOP TOOLBAR (brand/back, breadcrumb, device switcher, theme, Preview, Publish, save),
 * and a RIGHT INSPECTOR for the selected section's content. The canvas renders content-driven,
 * brand-themed sections (from `components/website/sections`) with INLINE editing.
 *
 * Builder chrome follows the app theme (dark/midnight/purple). Site content follows the site brand.
 * Persists to localStorage via `siteStorage`; publishing is deferred.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Copy, Eye, EyeOff, Globe, Lock, Play, Save, ArrowLeft,
  X, Monitor, Tablet, Smartphone, FileText, Layers, Image as ImageIcon, Palette, Type, ChevronRight,
  MoreVertical, Home, Settings2, ListTree, Link2, ChevronDown as ChevronDownIcon, GripVertical,
} from "lucide-react";
import {
  type Site, type Page, type Section, type SectionType, type SiteTheme, type NavItem, type HeaderEl,
  SECTION_CATALOG, createSection, createPage, createPageFromTemplate, pageNavItem, makeNavItem, slugify, siteStorage, resolveSiteTheme,
} from "@/lib/site-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { resolveIcon } from "@/components/website/sections/icons";
import SectionRenderer from "@/components/website/sections/SectionRenderer";
import { SiteFooter } from "@/components/website/sections/SiteRenderer";
import HeaderBar from "@/components/website/HeaderBar";
import HeaderInspector from "@/components/website/HeaderInspector";
import Tooltip from "@/components/shared/Tooltip";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { ColorPickerPopover } from "@/components/shared/ColorPalettePicker";
import AddPageModal from "@/components/website/AddPageModal";
import PageSettingsModal from "@/components/website/PageSettingsModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

type DeviceWidth = "desktop" | "tablet" | "mobile";
const DEVICE_PX: Record<DeviceWidth, number | null> = { desktop: null, tablet: 820, mobile: 390 };
const FONT_CHOICES = ["Poppins, sans-serif", "'DM Sans', sans-serif", "Manrope, sans-serif", "Lexend, sans-serif", "Montserrat, sans-serif", "'Playfair Display', serif", "Inter, sans-serif"];

// Per-nav-item visual identity: a shaped icon + a colour-coded badge so Page / Link / Dropdown are
// instantly distinguishable. Every dark: has midnight/purple variants (theme rule).
const NAV_TYPE = {
  page: { Icon: FileText, label: "Page", badge: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 midnight:bg-cyan-500/20 midnight:text-cyan-300 purple:bg-purple-500/20 purple:text-purple-300" },
  link: { Icon: Link2, label: "Link", badge: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300 midnight:bg-teal-500/20 midnight:text-teal-300 purple:bg-fuchsia-500/20 purple:text-fuchsia-300" },
  dropdown: { Icon: ChevronDownIcon, label: "Dropdown", badge: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 midnight:bg-blue-500/20 midnight:text-blue-300 purple:bg-pink-500/20 purple:text-pink-300" },
} as const;

type RailTab = "pages" | "add" | "layers" | "nav" | "media" | "theme";
const RAIL: { id: RailTab; label: string; icon: typeof FileText }[] = [
  { id: "pages", label: "Pages", icon: FileText },
  { id: "add", label: "Add section", icon: Plus },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "nav", label: "Navigation", icon: ListTree },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "theme", label: "Theme", icon: Palette },
];

interface SiteBuilderProps {
  value: Site;
  onChange: (site: Site) => void;
  onExit?: () => void;
}

export default function SiteBuilder({ value, onChange, onExit }: SiteBuilderProps) {
  const [site, setSite] = useState<Site>(value);
  const [activePageId, setActivePageId] = useState<string>(value.pages[0]?.id ?? "");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(value.pages[0]?.sections[0]?.id ?? null);
  const [device, setDevice] = useState<DeviceWidth>("desktop");
  const [preview, setPreview] = useState(false);
  const [savedAt, setSavedAt] = useState<"idle" | "saving" | "saved">("idle");
  const [railTab, setRailTab] = useState<RailTab>("layers");
  const [panelOpen, setPanelOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false); // mobile drawer
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);
  const [pageMenuId, setPageMenuId] = useState<string | null>(null);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [navPagePicker, setNavPagePicker] = useState<string | null>(null); // "top" or a dropdown id
  const [headerSelId, setHeaderSelId] = useState<string | null>(null); // selected freeform header element
  const [navDrag, setNavDrag] = useState<{ index: number; parentId?: string } | null>(null); // nav item being dragged
  const [navDragOver, setNavDragOver] = useState<{ index: number; parentId?: string } | null>(null); // current drop target
  const [secDrag, setSecDrag] = useState<number | null>(null); // section index being dragged
  const [secDropIdx, setSecDropIdx] = useState<number | null>(null); // insertion index (0..len) for the drop-between line

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => { setSite(value); }, [value.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bring the active section into view (so selecting one in Layers/jump-list scrolls the canvas to it).
  useEffect(() => {
    if (preview || !activeSectionId) return;
    const el = sectionRefs.current[activeSectionId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSectionId, preview]);

  // Close the per-page actions menu on any outside click (no full-screen backdrop that could
  // otherwise block the canvas if it's left open).
  useEffect(() => {
    if (!pageMenuId) return;
    const close = () => setPageMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pageMenuId]);

  const { theme: appTheme } = useTheme();
  const renderTheme = useMemo(() => resolveSiteTheme(site.theme, appTheme), [site.theme, appTheme]);

  const commit = useCallback((next: Site) => {
    setSite(next);
    setSavedAt("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { siteStorage.save(next); onChange(next); setSavedAt("saved"); }, 700);
  }, [onChange]);

  const activePage: Page | undefined = useMemo(() => site.pages.find((p) => p.id === activePageId) ?? site.pages[0], [site.pages, activePageId]);
  const activeSection = activePage?.sections.find((s) => s.id === activeSectionId) ?? null;

  // ── Mutators ──
  const updatePage = useCallback((pageId: string, patch: Partial<Page>) => {
    commit({ ...site, pages: site.pages.map((p) => (p.id === pageId ? { ...p, ...patch } : p)) });
  }, [site, commit]);
  const updateSection = useCallback((sectionId: string, patch: Partial<Section>) => {
    if (!activePage) return;
    updatePage(activePage.id, { sections: activePage.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)) });
  }, [activePage, updatePage]);
  const setContent = useCallback((sectionId: string, key: string, val: unknown) => {
    const sec = activePage?.sections.find((s) => s.id === sectionId);
    if (sec) updateSection(sectionId, { content: { ...sec.content, [key]: val } });
  }, [activePage, updateSection]);
  const setCta = useCallback((sectionId: string, which: "ctaPrimary" | "ctaSecondary", label: string) => {
    const sec = activePage?.sections.find((s) => s.id === sectionId);
    if (sec) updateSection(sectionId, { content: { ...sec.content, [which]: { ...(sec.content[which] || {}), label } } });
  }, [activePage, updateSection]);
  const setItem = useCallback((sectionId: string, index: number, key: string, val: string) => {
    const sec = activePage?.sections.find((s) => s.id === sectionId);
    if (!sec?.content.items) return;
    updateSection(sectionId, { content: { ...sec.content, items: sec.content.items.map((it, i) => (i === index ? { ...it, [key]: val } : it)) } });
  }, [activePage, updateSection]);
  const updateTheme = useCallback((patch: Partial<SiteTheme>) => commit({ ...site, theme: { ...site.theme, ...patch } }), [site, commit]);

  const addSection = useCallback((type: SectionType) => {
    if (!activePage) return;
    const sec = createSection(type);
    updatePage(activePage.id, { sections: [...activePage.sections, sec] });
    setActiveSectionId(sec.id);
    setRailTab("layers");
  }, [activePage, updatePage]);
  const duplicateSection = useCallback((sectionId: string) => {
    if (!activePage) return;
    const i = activePage.sections.findIndex((s) => s.id === sectionId);
    if (i < 0) return;
    const clone: Section = { ...activePage.sections[i], id: `sec-${Date.now()}-${Math.round(performance.now())}` };
    const sections = [...activePage.sections]; sections.splice(i + 1, 0, clone);
    updatePage(activePage.id, { sections }); setActiveSectionId(clone.id);
  }, [activePage, updatePage]);
  const deleteSection = useCallback((sectionId: string) => {
    if (!activePage) return;
    updatePage(activePage.id, { sections: activePage.sections.filter((s) => s.id !== sectionId) });
    if (activeSectionId === sectionId) setActiveSectionId(null);
  }, [activePage, updatePage, activeSectionId]);
  const moveSection = useCallback((sectionId: string, dir: -1 | 1) => {
    if (!activePage) return;
    const secs = [...activePage.sections];
    const i = secs.findIndex((s) => s.id === sectionId); const j = i + dir;
    if (i < 0 || j < 0 || j >= secs.length) return;
    [secs[i], secs[j]] = [secs[j], secs[i]]; updatePage(activePage.id, { sections: secs });
  }, [activePage, updatePage]);
  // Drag-and-drop: move a section from index `from` to index `to` (sections stack, so they can never
  // overlap — reordering just re-flows them, Lego-style).
  const reorderSection = useCallback((from: number, to: number) => {
    if (!activePage || from === to || from < 0 || to < 0) return;
    const secs = [...activePage.sections];
    if (from >= secs.length || to >= secs.length) return;
    const [moved] = secs.splice(from, 1); secs.splice(to, 0, moved);
    updatePage(activePage.id, { sections: secs });
  }, [activePage, updatePage]);
  // Finish a section drag: convert a drop-between insertion index into a target index and reorder.
  const dropSectionAt = useCallback((insertIdx: number) => {
    if (secDrag === null) return;
    const to = insertIdx > secDrag ? insertIdx - 1 : insertIdx;
    reorderSection(secDrag, to);
    setSecDrag(null); setSecDropIdx(null);
  }, [secDrag, reorderSection]);
  const deletePage = useCallback((pageId: string) => {
    if (site.pages.length <= 1) return;
    const pages = site.pages.filter((p) => p.id !== pageId);
    commit({ ...site, pages, nav: site.nav.filter((n) => n.pageId !== pageId) });
    if (activePageId === pageId) { setActivePageId(pages[0].id); setActiveSectionId(pages[0].sections[0]?.id ?? null); }
  }, [site, commit, activePageId]);

  const addPageFromTemplate = useCallback((name: string, path: string, key: string, showInNav: boolean) => {
    const page = createPageFromTemplate(name, path, key);
    const nav = showInNav ? [...site.nav, pageNavItem(page.id, page.name)] : site.nav;
    commit({ ...site, pages: [...site.pages, page], nav });
    setActivePageId(page.id); setActiveSectionId(page.sections[0]?.id ?? null);
    setAddPageOpen(false);
  }, [site, commit]);

  const duplicatePage = useCallback((pageId: string) => {
    const p = site.pages.find((x) => x.id === pageId);
    if (!p) return;
    const stamp = `${Date.now()}-${Math.round(performance.now())}`;
    const clone: Page = { ...p, id: `page-${stamp}`, isHome: false, name: `${p.name} copy`, path: slugify(`${p.name} copy`), sections: p.sections.map((s, i) => ({ ...s, id: `sec-${stamp}-${i}` })) };
    const i = site.pages.findIndex((x) => x.id === pageId);
    const pages = [...site.pages]; pages.splice(i + 1, 0, clone);
    commit({ ...site, pages, nav: [...site.nav, pageNavItem(clone.id, clone.name)] });
    setActivePageId(clone.id); setPageMenuId(null);
  }, [site, commit]);

  const setHomePage = useCallback((pageId: string) => {
    const pages = site.pages.map((p) => (p.id === pageId ? { ...p, isHome: true, path: "/" } : { ...p, isHome: false }));
    commit({ ...site, pages }); setPageMenuId(null);
  }, [site, commit]);

  const savePageSettings = useCallback((pageId: string, patch: { name: string; path: string; showInNav: boolean }) => {
    const pages = site.pages.map((p) => (p.id === pageId ? { ...p, name: patch.name, path: p.isHome ? "/" : patch.path } : p));
    const inNav = site.nav.some((n) => n.pageId === pageId);
    let nav = site.nav.map((n) => (n.pageId === pageId ? { ...n, label: patch.name } : n));
    if (patch.showInNav && !inNav) nav = [...nav, pageNavItem(pageId, patch.name)];
    if (!patch.showInNav && inNav) nav = nav.filter((n) => n.pageId !== pageId);
    commit({ ...site, pages, nav });
    setSettingsPageId(null);
  }, [site, commit]);

  // ── Navigation menu editor ──
  const setNav = useCallback((nav: NavItem[]) => commit({ ...site, nav }), [site, commit]);
  const addNavPage = useCallback((pageId: string, parentId?: string) => {
    const p = site.pages.find((x) => x.id === pageId); if (!p) return;
    const item = pageNavItem(p.id, p.name);
    setNav(parentId ? site.nav.map((n) => (n.id === parentId ? { ...n, children: [...(n.children || []), item] } : n)) : [...site.nav, item]);
    setNavPagePicker(null);
  }, [site.pages, site.nav, setNav]);
  const addNavLink = useCallback((parentId?: string) => {
    const item = makeNavItem({ type: "link", label: "New link", href: "#" });
    setNav(parentId ? site.nav.map((n) => (n.id === parentId ? { ...n, children: [...(n.children || []), item] } : n)) : [...site.nav, item]);
  }, [site.nav, setNav]);
  const addNavDropdown = useCallback(() => setNav([...site.nav, makeNavItem({ type: "dropdown", label: "Menu", children: [] })]), [site.nav, setNav]);
  const editNav = useCallback((id: string, patch: Partial<NavItem>, parentId?: string) => {
    setNav(parentId
      ? site.nav.map((n) => (n.id === parentId ? { ...n, children: (n.children || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) } : n))
      : site.nav.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, [site.nav, setNav]);
  const removeNav = useCallback((id: string, parentId?: string) => {
    setNav(parentId
      ? site.nav.map((n) => (n.id === parentId ? { ...n, children: (n.children || []).filter((c) => c.id !== id) } : n))
      : site.nav.filter((n) => n.id !== id));
  }, [site.nav, setNav]);
  const moveNav = useCallback((index: number, dir: -1 | 1, parentId?: string) => {
    if (parentId) {
      setNav(site.nav.map((n) => {
        if (n.id !== parentId) return n;
        const arr = [...(n.children || [])]; const j = index + dir;
        if (j < 0 || j >= arr.length) return n;
        [arr[index], arr[j]] = [arr[j], arr[index]]; return { ...n, children: arr };
      }));
    } else {
      const arr = [...site.nav]; const j = index + dir;
      if (j < 0 || j >= arr.length) return;
      [arr[index], arr[j]] = [arr[j], arr[index]]; setNav(arr);
    }
  }, [site.nav, setNav]);
  // Drag-and-drop reordering: move an item from `from` to `to` within the same list (top-level or a dropdown's children).
  const reorderNav = useCallback((from: number, to: number, parentId?: string) => {
    if (from === to || from < 0 || to < 0) return;
    if (parentId) {
      setNav(site.nav.map((n) => {
        if (n.id !== parentId) return n;
        const arr = [...(n.children || [])];
        if (from >= arr.length || to >= arr.length) return n;
        const [moved] = arr.splice(from, 1); arr.splice(to, 0, moved);
        return { ...n, children: arr };
      }));
    } else {
      const arr = [...site.nav];
      if (from >= arr.length || to >= arr.length) return;
      const [moved] = arr.splice(from, 1); arr.splice(to, 0, moved);
      setNav(arr);
    }
  }, [site.nav, setNav]);

  const selectRail = (t: RailTab) => { setPageMenuId(null); if (railTab === t && panelOpen) setPanelOpen(false); else { setRailTab(t); setPanelOpen(true); } };
  const openSection = (id: string) => { setHeaderSelId(null); setActiveSectionId(id); setInspectorOpen(true); };

  // ── Freeform header element editing ──
  const headerLayout = site.header?.layout ?? [];
  const headerEl = headerLayout.find((e) => e.id === headerSelId) ?? null;
  const headerHeight = site.header?.height ?? 78;
  const selectHeaderEl = useCallback((id: string | null) => { setHeaderSelId(id); if (id) { setActiveSectionId(null); setInspectorOpen(true); } }, []);
  const updateHeaderEl = useCallback((patch: Partial<HeaderEl>) => {
    if (!headerSelId) return;
    commit({ ...site, header: { ...site.header, layout: headerLayout.map((e) => (e.id === headerSelId ? { ...e, ...patch } : e)) } });
  }, [site, headerLayout, headerSelId, commit]);
  const deleteHeaderEl = useCallback(() => {
    if (!headerSelId) return;
    commit({ ...site, header: { ...site.header, layout: headerLayout.filter((e) => e.id !== headerSelId) } });
    setHeaderSelId(null);
  }, [site, headerLayout, headerSelId, commit]);
  const setHeaderHeight = useCallback((h: number) => commit({ ...site, header: { ...site.header, height: h } }), [site, commit]);
  // Add a navigation-menu element to the header (one-click fallback for the draggable block).
  const addNavToHeader = useCallback(() => {
    const layout = site.header?.layout ?? [];
    const existing = layout.find((e) => e.type === "nav");
    if (existing) { setHeaderSelId(existing.id); setInspectorOpen(true); return; }
    const el: HeaderEl = { id: `hel-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`, type: "nav", x: 42, y: 34 };
    commit({ ...site, header: { ...site.header, layout: [...layout, el] } });
    setHeaderSelId(el.id); setActiveSectionId(null); setInspectorOpen(true);
  }, [site, commit]);
  const headerHasNav = (site.header?.layout ?? []).some((e) => e.type === "nav");

  const canvasWidth = DEVICE_PX[device];

  // Chrome style fragments (app-theme aware).
  const panelBg = "bg-white dark:bg-[#161922] midnight:bg-[#0d1230] purple:bg-[#241435]";
  const border = "border-gray-200 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40";
  const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
  const label = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
  const sectionMeta = (t: SectionType) => SECTION_CATALOG.find((c) => c.type === t);

  return (
    <div className="flex h-full w-full bg-gray-100 dark:bg-[#0b0d12] midnight:bg-[#080b1f] purple:bg-[#160a26] text-gray-900 dark:text-gray-100">
      {/* ── Icon rail ── */}
      {!preview && (
        <nav className={`w-14 shrink-0 flex flex-col items-center gap-1 py-2.5 border-r ${border} ${panelBg}`} aria-label="Builder tools">
          <Tooltip content="Back to my sites">
            <button onClick={() => onExit?.()} aria-label="Back to my sites" className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm group relative mb-1">
              <Globe className="w-5 h-5 text-white group-hover:opacity-0 transition-opacity" />
              <ArrowLeft className="w-5 h-5 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Tooltip>
          {RAIL.map(({ id, label: l, icon: Icon }) => {
            const active = railTab === id && panelOpen;
            return (
              <Tooltip key={id} content={l}>
                <button
                  onClick={() => selectRail(id)}
                  aria-label={l}
                  aria-pressed={active}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? "bg-indigo-100 dark:bg-indigo-900/40 midnight:bg-cyan-900/40 purple:bg-purple-900/50 text-indigo-600 dark:text-indigo-300 midnight:text-cyan-300 purple:text-pink-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </Tooltip>
            );
          })}
        </nav>
      )}

      {/* ── Contextual panel ── */}
      {!preview && panelOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setPanelOpen(false)} aria-hidden="true" />
          <aside className={`w-64 shrink-0 flex flex-col border-r ${border} ${panelBg} fixed lg:static left-14 inset-y-0 z-40 lg:z-0 overflow-hidden`} aria-label={`${RAIL.find((r) => r.id === railTab)?.label} panel`}>
            <div className={`h-11 shrink-0 flex items-center justify-between px-3 border-b ${border}`}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{RAIL.find((r) => r.id === railTab)?.label}</h2>
              <button onClick={() => setPanelOpen(false)} aria-label="Close panel" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {/* Pages */}
              {railTab === "pages" && (
                <div>
                  <button onClick={() => setAddPageOpen(true)} className="w-full mb-3 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700" aria-label="Add page"><Plus className="w-4 h-4" /> Add page</button>
                  <ul className="space-y-1">
                    {site.pages.map((p) => {
                      const inNav = site.nav.some((n) => n.pageId === p.id);
                      return (
                        <li key={p.id} className="relative">
                          <div
                            className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-sm ${p.id === activePageId ? "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-purple-900/40 text-indigo-700 dark:text-indigo-300" : "hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"}`}
                            onClick={() => { setActivePageId(p.id); setActiveSectionId(p.sections[0]?.id ?? null); }}
                            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") { setActivePageId(p.id); } }}
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1">{p.name}</span>
                            {p.isHome && <Home className="w-3.5 h-3.5 opacity-60" aria-label="Home page" />}
                            {!inNav && !p.isHome && <EyeOff className="w-3 h-3 opacity-40" aria-label={`${p.name} hidden from navigation`} />}
                            <button onClick={(e) => { e.stopPropagation(); setPageMenuId(pageMenuId === p.id ? null : p.id); }} aria-label={`Actions for ${p.name}`} aria-haspopup="menu" className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"><MoreVertical className="w-3.5 h-3.5" /></button>
                          </div>
                          {pageMenuId === p.id && (
                            <div role="menu" aria-label={`${p.name} actions`} className="absolute right-2 top-9 z-20 min-w-[150px] py-1 rounded-lg shadow-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                              <button role="menuitem" onClick={() => { setSettingsPageId(p.id); setPageMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]"><Settings2 className="w-4 h-4" /> Settings</button>
                              <button role="menuitem" onClick={() => duplicatePage(p.id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]"><Copy className="w-4 h-4" /> Duplicate</button>
                              {!p.isHome && <button role="menuitem" onClick={() => setHomePage(p.id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]"><Home className="w-4 h-4" /> Set as home</button>}
                              {site.pages.length > 1 && !p.isHome && <button role="menuitem" onClick={() => { setDeletePageId(p.id); setPageMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /> Delete</button>}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Add section */}
              {railTab === "add" && (
                <div role="menu" aria-label="Section types" className="space-y-1.5">
                  {SECTION_CATALOG.map((c) => {
                    const Icon = resolveIcon(c.icon);
                    return (
                      <button key={c.type} onClick={() => addSection(c.type)} role="menuitem" className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border ${border} hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors`}>
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                        <span className="min-w-0"><span className="text-sm font-semibold block">{c.label}</span><span className="text-[11px] text-gray-400 leading-tight block">{c.description}</span></span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Layers (sections) */}
              {railTab === "layers" && (
                <div>
                  <button onClick={() => { setRailTab("add"); }} className="w-full mb-3 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4" /> Add section</button>
                  <p className="text-[11px] text-gray-400 mb-2 px-0.5">Drag the ⠿ handle to reorder sections — they drop <b>between</b> others and never overlap.</p>
                  <ul className="space-y-1" onDrop={(e) => { if (secDrag !== null && secDropIdx !== null) { e.preventDefault(); dropSectionAt(secDropIdx); } }}>
                    {activePage?.sections.map((s, i) => {
                      const Icon = resolveIcon(sectionMeta(s.type)?.icon);
                      const insertLine = secDrag !== null && secDropIdx === i;
                      return (
                        <li key={s.id}>
                          {insertLine && <div className="h-0.5 mx-1 mb-1 rounded-full bg-indigo-500" aria-hidden="true" />}
                          <div
                            className={`group flex items-center gap-1.5 pl-1 pr-2 py-2 rounded-lg cursor-pointer text-sm transition-all ${secDrag === i ? "opacity-40" : ""} ${s.id === activeSectionId ? "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-purple-900/40 text-indigo-700 dark:text-indigo-300" : "hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"} ${s.hidden ? "opacity-50" : ""}`}
                            onClick={() => openSection(s.id)}
                            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") openSection(s.id); }}
                            onDragOver={(e) => { if (secDrag === null) return; e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const idx = e.clientY > r.top + r.height / 2 ? i + 1 : i; if (secDropIdx !== idx) setSecDropIdx(idx); }}
                          >
                            <span
                              draggable
                              onDragStart={(e) => { setSecDrag(i); setSecDropIdx(i); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", s.id); }}
                              onDragEnd={() => { setSecDrag(null); setSecDropIdx(null); }}
                              aria-hidden="true"
                              title="Drag to reorder (keyboard: use the arrow buttons)"
                              className="shrink-0 flex items-center justify-center w-5 h-6 rounded cursor-grab active:cursor-grabbing text-gray-300 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-300 touch-none transition-colors"
                            ><GripVertical className="w-4 h-4" /></span>
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1">{s.name}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100">
                              <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, -1); }} disabled={i === 0} aria-label={`Move ${s.name} up`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                              <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, 1); }} disabled={i === (activePage?.sections.length ?? 0) - 1} aria-label={`Move ${s.name} down`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                              <button onClick={(e) => { e.stopPropagation(); updateSection(s.id, { hidden: !s.hidden }); }} aria-label={s.hidden ? `Show ${s.name}` : `Hide ${s.name}`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{s.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                              <button onClick={(e) => { e.stopPropagation(); deleteSection(s.id); }} aria-label={`Delete ${s.name}`} className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          {secDrag !== null && secDropIdx === i + 1 && i === (activePage?.sections.length ?? 0) - 1 && <div className="h-0.5 mx-1 mt-1 rounded-full bg-indigo-500" aria-hidden="true" />}
                        </li>
                      );
                    })}
                    {activePage?.sections.length === 0 && <li className="text-xs text-gray-400 px-2 py-4 text-center">No sections yet. Use Add.</li>}
                  </ul>
                </div>
              )}

              {/* Navigation menu editor */}
              {railTab === "nav" && (
                <div>
                  {/* What this panel is — the header menu shown on every page */}
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40 midnight:border-cyan-900/40 purple:border-purple-900/40 bg-gradient-to-br from-indigo-50 to-indigo-100/40 dark:from-indigo-950/30 dark:to-transparent midnight:from-cyan-950/30 purple:from-purple-950/30 p-3">
                    <ListTree className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500 midnight:text-cyan-400 purple:text-pink-400" />
                    <p className="text-[11px] leading-snug text-indigo-900/80 dark:text-indigo-200/80 midnight:text-cyan-200/80 purple:text-pink-200/80">
                      Your <b>header menu</b> — shown at the top of <b>every page</b>. Drag the <b>⠿</b> handle to reorder.
                    </p>
                  </div>

                  {/* Draggable "Navigation menu" block — drop it onto the header on the canvas */}
                  <div className="mb-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 px-0.5">Menu block</div>
                    <div
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData("application/x-educo-block", "nav"); e.dataTransfer.effectAllowed = "copy"; }}
                      onClick={addNavToHeader}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addNavToHeader(); } }}
                      role="button"
                      tabIndex={0}
                      aria-label="Navigation menu block. Drag onto the header, or press Enter to add it."
                      title="Drag onto the header — or press Enter / click to add it"
                      className={`group flex items-center gap-2.5 rounded-xl border-2 border-dashed ${headerHasNav ? border : "border-indigo-300 dark:border-indigo-700 midnight:border-cyan-700 purple:border-pink-700"} bg-indigo-50/50 dark:bg-indigo-950/20 midnight:bg-cyan-950/20 purple:bg-purple-950/20 p-2.5 cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors`}
                    >
                      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${NAV_TYPE.dropdown.badge}`}><ListTree className="w-4 h-4" /></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Navigation menu</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">Drag onto your header ↗</div>
                      </div>
                      <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 shrink-0" />
                    </div>
                    <button onClick={addNavToHeader} className="mt-1.5 w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium border border-indigo-200 dark:border-indigo-800 midnight:border-cyan-800 purple:border-pink-800 text-indigo-700 dark:text-indigo-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> {headerHasNav ? "Menu is on your header — select it" : "Add menu to header"}
                    </button>
                  </div>

                  {/* Quick-add your pages (WordPress/Hostinger style) — one tap each */}
                  {site.pages.some((p) => !site.nav.some((n) => n.type === "page" && n.pageId === p.id)) && (
                    <div className="mb-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 px-0.5">Add one of your pages</div>
                      <div className="flex flex-wrap gap-1.5">
                        {site.pages.filter((p) => !site.nav.some((n) => n.type === "page" && n.pageId === p.id)).map((p) => (
                          <button key={p.id} onClick={() => addNavPage(p.id)} title={`Add ${p.name} to the menu`} className={`group inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border ${border} bg-white dark:bg-gray-900/40 midnight:bg-cyan-950/20 purple:bg-purple-950/20 text-xs hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 midnight:hover:bg-cyan-950/40 purple:hover:bg-purple-950/40 transition-colors`}>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center ${NAV_TYPE.page.badge}`}><Plus className="w-3 h-3" /></span>
                            <span className="truncate max-w-[120px]">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add item types — modern icon cards */}
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 px-0.5">Add to menu</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {([
                      { key: "page", onClick: () => setNavPagePicker(navPagePicker === "top" ? null : "top"), hint: "Link to one of your pages" },
                      { key: "link", onClick: () => addNavLink(), hint: "External / custom URL" },
                      { key: "dropdown", onClick: addNavDropdown, hint: "A dropdown with sub-items" },
                    ] as const).map(({ key, onClick, hint }) => {
                      const meta = NAV_TYPE[key];
                      return (
                        <button key={key} onClick={onClick} title={hint} className={`group flex flex-col items-center gap-1.5 py-2.5 rounded-xl border ${border} bg-white dark:bg-gray-900/40 midnight:bg-cyan-950/20 purple:bg-purple-950/20 hover:border-indigo-300 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.badge} group-hover:scale-110 transition-transform`}><meta.Icon className="w-4 h-4" /></span>
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {navPagePicker === "top" && (
                    <div className={`mb-4 rounded-xl border ${border} overflow-hidden shadow-sm`} role="menu" aria-label="Pick a page">
                      {site.pages.map((p) => <button key={p.id} onClick={() => addNavPage(p.id)} className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/30 midnight:hover:bg-cyan-950/40 purple:hover:bg-purple-950/40 border-b last:border-b-0 border-gray-100 dark:border-gray-800"><FileText className="w-3.5 h-3.5 text-gray-400" />{p.name}</button>)}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Your menu</span>
                    <span className="text-[10px] font-semibold text-gray-400 tabular-nums px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 midnight:bg-cyan-950/40 purple:bg-purple-950/40">{site.nav.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {site.nav.map((item, i) => {
                      const meta = NAV_TYPE[item.type];
                      const isDragged = navDrag?.parentId === undefined && navDrag?.index === i;
                      const isDropTarget = navDrag?.parentId === undefined && navDragOver?.parentId === undefined && navDragOver?.index === i && navDrag?.index !== i;
                      return (
                        <li
                          key={item.id}
                          className={`group rounded-xl border bg-white dark:bg-gray-900/40 midnight:bg-cyan-950/20 purple:bg-purple-950/20 shadow-sm transition-all ${isDragged ? "opacity-40 scale-[0.98]" : "hover:shadow-md"} ${isDropTarget ? "border-indigo-400 ring-2 ring-indigo-400/40" : border}`}
                          onDragOver={(e) => { if (navDrag && navDrag.parentId === undefined) { e.preventDefault(); if (navDragOver?.index !== i || navDragOver?.parentId !== undefined) setNavDragOver({ index: i }); } }}
                          onDrop={(e) => { if (navDrag && navDrag.parentId === undefined) { e.preventDefault(); reorderNav(navDrag.index, i); } setNavDrag(null); setNavDragOver(null); }}
                        >
                          <div className="flex items-center gap-2 px-2 py-2">
                            <span
                              draggable
                              onDragStart={(e) => { setNavDrag({ index: i }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", item.id); }}
                              onDragEnd={() => { setNavDrag(null); setNavDragOver(null); }}
                              aria-hidden="true"
                              title="Drag to reorder (keyboard: use the arrow buttons)"
                              className="shrink-0 flex items-center justify-center w-6 h-7 -ml-0.5 rounded-md cursor-grab active:cursor-grabbing text-gray-300 hover:text-indigo-500 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-indigo-300 dark:hover:bg-gray-800 midnight:hover:bg-cyan-950/50 purple:hover:bg-purple-950/50 touch-none transition-colors"
                            ><GripVertical className="w-4 h-4" /></span>
                            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${meta.badge}`}><meta.Icon className="w-4 h-4" /></span>
                            <div className="flex-1 min-w-0">
                              <input value={item.label} onChange={(e) => editNav(item.id, { label: e.target.value })} aria-label="Menu item label" className="w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 outline-none focus:ring-1 focus:ring-indigo-400 rounded px-0.5" />
                              <span className="text-[10px] uppercase tracking-wide text-gray-400">{meta.label}</span>
                            </div>
                            <div className="flex items-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveNav(i, -1)} disabled={i === 0} aria-label="Move up" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                              <button onClick={() => moveNav(i, 1)} disabled={i === site.nav.length - 1} aria-label="Move down" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeNav(item.id)} aria-label="Remove item" className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          {item.type === "link" && <div className="px-2 pb-2 pl-10"><input value={item.href || ""} onChange={(e) => editNav(item.id, { href: e.target.value })} placeholder="https://…" aria-label="Link URL" className={inputCls + " py-1 text-xs"} /></div>}
                          {item.type === "dropdown" && (
                            <div className="ml-5 pl-3 pr-2 pb-2 space-y-1.5 border-l-2 border-gray-100 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40">
                              {(item.children || []).map((c, ci) => {
                                const cmeta = NAV_TYPE[c.type];
                                const childDragged = navDrag?.parentId === item.id && navDrag?.index === ci;
                                const childDropTarget = navDrag?.parentId === item.id && navDragOver?.parentId === item.id && navDragOver?.index === ci && navDrag?.index !== ci;
                                return (
                                <div
                                  key={c.id}
                                  className={`group/child flex items-center gap-1.5 rounded-lg px-1 py-0.5 transition-all ${childDragged ? "opacity-40" : ""} ${childDropTarget ? "ring-2 ring-indigo-400/50 bg-indigo-50/50 dark:bg-indigo-950/20" : ""}`}
                                  onDragOver={(e) => { if (navDrag && navDrag.parentId === item.id) { e.preventDefault(); if (navDragOver?.index !== ci || navDragOver?.parentId !== item.id) setNavDragOver({ index: ci, parentId: item.id }); } }}
                                  onDrop={(e) => { if (navDrag && navDrag.parentId === item.id) { e.preventDefault(); reorderNav(navDrag.index, ci, item.id); } setNavDrag(null); setNavDragOver(null); }}
                                >
                                  <span
                                    draggable
                                    onDragStart={(e) => { setNavDrag({ index: ci, parentId: item.id }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.id); }}
                                    onDragEnd={() => { setNavDrag(null); setNavDragOver(null); }}
                                    aria-hidden="true"
                                    title="Drag to reorder (keyboard: use the arrow buttons)"
                                    className="shrink-0 flex items-center justify-center w-5 h-6 rounded cursor-grab active:cursor-grabbing text-gray-300 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-300 touch-none transition-colors"
                                  ><GripVertical className="w-3 h-3" /></span>
                                  <span className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${cmeta.badge}`}><cmeta.Icon className="w-3 h-3" /></span>
                                  <input value={c.label} onChange={(e) => editNav(c.id, { label: e.target.value }, item.id)} aria-label="Submenu item label" className="flex-1 min-w-0 bg-transparent text-xs text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-400 rounded px-0.5" />
                                  <div className="flex items-center shrink-0 opacity-60 group-hover/child:opacity-100 transition-opacity">
                                    <button onClick={() => moveNav(ci, -1, item.id)} disabled={ci === 0} aria-label="Move up" className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                                    <button onClick={() => moveNav(ci, 1, item.id)} disabled={ci === (item.children!.length - 1)} aria-label="Move down" className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                                    <button onClick={() => removeNav(c.id, item.id)} aria-label="Remove submenu item" className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                </div>
                                );
                              })}
                              <div className="flex gap-3 pt-0.5 pl-1">
                                <button onClick={() => setNavPagePicker(navPagePicker === item.id ? null : item.id)} aria-label="Add a page to this dropdown" className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline">+ Page</button>
                                <button onClick={() => addNavLink(item.id)} aria-label="Add a link to this dropdown" className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline">+ Link</button>
                              </div>
                              {navPagePicker === item.id && (
                                <div className={`rounded-lg border ${border} overflow-hidden`} role="menu" aria-label="Pick a page">
                                  {site.pages.map((p) => <button key={p.id} onClick={() => addNavPage(p.id, item.id)} className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/30 midnight:hover:bg-cyan-950/40 purple:hover:bg-purple-950/40 border-b last:border-b-0 border-gray-100 dark:border-gray-800">{p.name}</button>)}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                    {site.nav.length === 0 && (
                      <li className={`rounded-xl border border-dashed ${border} text-center py-8 px-4`}>
                        <ListTree className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">No menu items yet</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Add a Page, Link or Dropdown above.</p>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Media */}
              {railTab === "media" && (
                <div className="text-center py-10 px-2">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3"><ImageIcon className="w-6 h-6 text-gray-400" /></div>
                  <p className="text-sm font-semibold">Media library</p>
                  <p className="text-xs text-gray-400 mt-1">Image upload &amp; a shared media library are coming next.</p>
                </div>
              )}

              {/* Theme (global styles) */}
              {railTab === "theme" && (
                <div className="space-y-4">
                  <p className="text-[11px] text-gray-400">The light/dark base follows the app theme. These set your school brand.</p>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Brand colours</div>
                  {([["primary", "Primary"], ["accent", "Accent"]] as const).map(([key, l]) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className={label}>{l}</span>
                      <ColorPickerPopover selectedColor={site.theme[key]} onSelect={(c) => updateTheme({ [key]: c })} mode="solid" align="right">
                        <button aria-label={`${l} colour`} className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ background: site.theme[key] }} />
                      </ColorPickerPopover>
                    </div>
                  ))}
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-1">Typography</div>
                  <label className="block"><span className={label}>Heading font</span>
                    <select value={site.theme.headingFont} onChange={(e) => updateTheme({ headingFont: e.target.value })} className={inputCls}>{FONT_CHOICES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}</select>
                  </label>
                  <label className="block"><span className={label}>Body font</span>
                    <select value={site.theme.bodyFont} onChange={(e) => updateTheme({ bodyFont: e.target.value })} className={inputCls}>{FONT_CHOICES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}</select>
                  </label>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-1">Corners</div>
                  <label className="block"><span className={label}>Radius: {site.theme.radius}px</span>
                    <input type="range" min={0} max={28} step={2} value={site.theme.radius} onChange={(e) => updateTheme({ radius: Number(e.target.value) })} aria-label="Corner radius" className="w-full mt-1" />
                  </label>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ── Center: toolbar + canvas ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className={`h-14 shrink-0 flex items-center gap-2 px-3 border-b ${border} ${panelBg}`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <input value={site.name} onChange={(e) => commit({ ...site, name: e.target.value })} aria-label="Site name" className="font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-1 max-w-[130px] hover:bg-gray-50 dark:hover:bg-gray-800/50 truncate" />
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            <span className="text-gray-500 dark:text-gray-400 hidden sm:block truncate max-w-[110px]">{activePage?.name}</span>
          </div>
          <div className="flex-1" />

          <div className="hidden sm:flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5" role="group" aria-label="Preview device width">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} aria-label={`${d} preview`} aria-pressed={device === d} className={`p-1.5 rounded-md ${device === d ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Icon className="w-4 h-4" /></button>
            ))}
          </div>

          <ThemeSwitcher compact />

          <button onClick={() => setPreview((v) => !v)} aria-label={preview ? "Exit preview" : "Preview"} aria-pressed={preview} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${preview ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}><Play className="w-3.5 h-3.5" /> {preview ? "Editing" : "Preview"}</button>

          <Tooltip content="Publishing & hosting come next — build your site now, go live later">
            <button disabled aria-label="Publish (coming soon)" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"><Lock className="w-3.5 h-3.5" /> Publish</button>
          </Tooltip>

          <span className="hidden md:flex text-[11px] text-gray-400 items-center gap-1 w-14 justify-end" aria-live="polite">
            {savedAt === "saving" ? <><Save className="w-3 h-3 animate-pulse" /> Saving</> : savedAt === "saved" ? <><Save className="w-3 h-3" /> Saved</> : null}
          </span>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/10 transition-[width] duration-300 w-full" style={{ width: canvasWidth ? `${canvasWidth}px` : "100%", maxWidth: "100%" }}>
            {activePage && (
              <div style={{ fontFamily: renderTheme.bodyFont, background: renderTheme.background }}>
                <HeaderBar
                  site={site}
                  theme={renderTheme}
                  layout={site.header?.layout ?? []}
                  editable={!preview}
                  selectedId={headerSelId}
                  onSelectId={selectHeaderEl}
                  onChange={(layout) => commit({ ...site, header: { ...site.header, layout } })}
                />
                {activePage.sections.filter((s) => (preview ? !s.hidden : true)).map((s) => {
                  const isActive = s.id === activeSectionId && !preview;
                  const i = activePage.sections.findIndex((x) => x.id === s.id);
                  return (
                    <div
                      key={s.id}
                      ref={(el) => { sectionRefs.current[s.id] = el; }}
                      className={`relative ${secDrag === i ? "opacity-40" : ""} ${s.hidden && !preview ? "opacity-40" : ""} ${isActive ? "ring-2 ring-inset ring-indigo-500" : !preview ? "hover:ring-2 hover:ring-inset hover:ring-indigo-300/70" : ""}`}
                      onMouseDown={() => { if (!preview) { setHeaderSelId(null); setActiveSectionId(s.id); } }}
                      onDragOver={(e) => { if (secDrag === null || preview) return; e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); const idx = e.clientY > r.top + r.height / 2 ? i + 1 : i; if (secDropIdx !== idx) setSecDropIdx(idx); }}
                      onDrop={(e) => { if (secDrag === null) return; e.preventDefault(); dropSectionAt(secDropIdx ?? i); }}
                    >
                      {/* Drop-between insertion lines */}
                      {secDrag !== null && secDropIdx === i && <div className="absolute -top-1 left-0 right-0 h-1.5 rounded-full bg-indigo-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(99,102,241,0.6)]" aria-hidden="true" />}
                      {secDrag !== null && secDropIdx === activePage.sections.length && i === activePage.sections.length - 1 && <div className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-indigo-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(99,102,241,0.6)]" aria-hidden="true" />}
                      <SectionRenderer section={s} theme={renderTheme} editable={!preview} onChange={(patch) => updateSection(s.id, { content: { ...s.content, ...patch } })} onBlocksChange={(blocks) => updateSection(s.id, { blocks })} />
                      {isActive && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-lg bg-gray-900/85 backdrop-blur px-1 py-0.5 shadow-lg" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                          <span draggable onDragStart={(e) => { setSecDrag(i); setSecDropIdx(i); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", s.id); }} onDragEnd={() => { setSecDrag(null); setSecDropIdx(null); }} aria-hidden="true" title="Drag to reorder this section" className="p-1.5 rounded text-white/90 hover:bg-white/15 cursor-grab active:cursor-grabbing"><GripVertical className="w-3.5 h-3.5" /></span>
                          <button onClick={() => moveSection(s.id, -1)} disabled={i === 0} aria-label="Move section up" className="p-1.5 rounded text-white/90 hover:bg-white/15 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                          <button onClick={() => moveSection(s.id, 1)} disabled={i === activePage.sections.length - 1} aria-label="Move section down" className="p-1.5 rounded text-white/90 hover:bg-white/15 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                          <button onClick={() => duplicateSection(s.id)} aria-label="Duplicate section" className="p-1.5 rounded text-white/90 hover:bg-white/15"><Copy className="w-3.5 h-3.5" /></button>
                          <button onClick={() => updateSection(s.id, { hidden: !s.hidden })} aria-label={s.hidden ? "Show section" : "Hide section"} className="p-1.5 rounded text-white/90 hover:bg-white/15">{s.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                          <button onClick={() => deleteSection(s.id)} aria-label="Delete section" className="p-1.5 rounded text-red-300 hover:bg-red-500/30"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {activePage.sections.length === 0 && <div className="h-64 flex items-center justify-center text-gray-400 text-sm">This page is empty — open <b className="mx-1">Add</b> to insert a section.</div>}
                <SiteFooter site={site} theme={renderTheme} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right inspector ── */}
      {!preview && (
        <>
          {inspectorOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setInspectorOpen(false)} aria-hidden="true" />}
          <aside className={`w-72 shrink-0 flex flex-col border-l ${border} ${panelBg} overflow-y-auto fixed lg:static inset-y-0 right-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${inspectorOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`} aria-label="Inspector">
            <div className={`h-11 shrink-0 flex items-center justify-between px-3 border-b ${border}`}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                {headerEl ? <><Globe className="w-3.5 h-3.5" />Header</> : activeSection ? <>{(() => { const I = resolveIcon(sectionMeta(activeSection.type)?.icon); return <I className="w-3.5 h-3.5" />; })()}{activeSection.name}</> : "Inspector"}
              </h2>
              <button onClick={() => setInspectorOpen(false)} aria-label="Close inspector" className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X className="w-4 h-4" /></button>
            </div>

            {headerEl ? (
              <HeaderInspector
                el={headerEl}
                theme={renderTheme}
                pages={site.pages}
                headerHeight={headerHeight}
                onChange={updateHeaderEl}
                onDelete={deleteHeaderEl}
                onHeaderHeight={setHeaderHeight}
                onOpenNav={() => { setRailTab("nav"); setPanelOpen(true); }}
              />
            ) : activeSection ? (
              <div className="p-4 space-y-3">
                <div className="text-[11px] text-gray-400 flex items-center gap-1"><Type className="w-3 h-3" /> Tip: you can also edit text directly on the canvas.</div>
                {activeSection.content.eyebrow !== undefined && <label className="block"><span className={label}>Eyebrow</span><input value={activeSection.content.eyebrow || ""} onChange={(e) => setContent(activeSection.id, "eyebrow", e.target.value)} className={inputCls} /></label>}
                {activeSection.content.heading !== undefined && <label className="block"><span className={label}>Heading</span><textarea value={activeSection.content.heading || ""} onChange={(e) => setContent(activeSection.id, "heading", e.target.value)} rows={2} className={inputCls} /></label>}
                {activeSection.content.subheading !== undefined && <label className="block"><span className={label}>Subheading</span><textarea value={activeSection.content.subheading || ""} onChange={(e) => setContent(activeSection.id, "subheading", e.target.value)} rows={2} className={inputCls} /></label>}
                {activeSection.content.body !== undefined && <label className="block"><span className={label}>Body</span><textarea value={activeSection.content.body || ""} onChange={(e) => setContent(activeSection.id, "body", e.target.value)} rows={4} className={inputCls} /></label>}
                {activeSection.content.ctaPrimary !== undefined && <label className="block"><span className={label}>Primary button</span><input value={activeSection.content.ctaPrimary?.label || ""} onChange={(e) => setCta(activeSection.id, "ctaPrimary", e.target.value)} className={inputCls} /></label>}
                {activeSection.content.ctaSecondary !== undefined && <label className="block"><span className={label}>Secondary button</span><input value={activeSection.content.ctaSecondary?.label || ""} onChange={(e) => setCta(activeSection.id, "ctaSecondary", e.target.value)} className={inputCls} /></label>}
                {activeSection.content.items && activeSection.content.items.length > 0 && (
                  <div className="pt-1">
                    <span className={label + " block mb-1.5"}>Items</span>
                    <div className="space-y-2">
                      {activeSection.content.items.map((it, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border ${border} space-y-1.5`}>
                          {it.value !== undefined && <input value={it.value || ""} onChange={(e) => setItem(activeSection.id, idx, "value", e.target.value)} placeholder="Value" className={inputCls} />}
                          {it.title !== undefined && <input value={it.title || ""} onChange={(e) => setItem(activeSection.id, idx, "title", e.target.value)} placeholder="Title" className={inputCls} />}
                          {it.body !== undefined && <textarea value={it.body || ""} onChange={(e) => setItem(activeSection.id, idx, "body", e.target.value)} placeholder="Body" rows={2} className={inputCls} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a <b>header element</b> (logo, text, nav, button) or a section on the canvas to edit it here.</div>
            )}
          </aside>
        </>
      )}

      {/* Page management modals */}
      <AddPageModal isOpen={addPageOpen} onClose={() => setAddPageOpen(false)} siteName={site.name} theme={renderTheme} onCreate={addPageFromTemplate} />
      <PageSettingsModal
        isOpen={!!settingsPageId}
        onClose={() => setSettingsPageId(null)}
        page={site.pages.find((p) => p.id === settingsPageId) ?? null}
        inNav={settingsPageId ? site.nav.some((n) => n.pageId === settingsPageId) : true}
        canDelete={site.pages.length > 1 && !site.pages.find((p) => p.id === settingsPageId)?.isHome}
        onSave={savePageSettings}
        onDelete={(id) => { setSettingsPageId(null); setDeletePageId(id); }}
      />
      <DeleteConfirmationModal
        isOpen={!!deletePageId}
        onClose={() => setDeletePageId(null)}
        onConfirm={() => { if (deletePageId) deletePage(deletePageId); setDeletePageId(null); }}
        title="Delete page"
        itemName={site.pages.find((p) => p.id === deletePageId)?.name}
        message="This permanently removes the page and all its sections. This can't be undone."
      />
    </div>
  );
}
