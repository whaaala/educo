"use client";

/**
 * SiteBuilder — a modern, brand-driven school website builder.
 *
 * Pages are a stack of CONTENT-DRIVEN sections (hero, about, programs, stats, gallery,
 * testimonials, CTA, contact) rendered by the reusable section library (`components/website/
 * sections`). Every colour comes from the site's brand `theme` — nothing hardcoded — so editing
 * the brand in the Design panel cascades across every section.
 *
 * Builder CHROME follows the app theme (dark/midnight/purple). Site CONTENT follows the site brand.
 * Data persists to localStorage via `siteStorage`; publishing is deferred.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Copy, Layout, FileText, Globe, Lock,
  Play, Save, ArrowLeft, PanelLeft, PanelRight, X, Monitor, Tablet, Smartphone, Type, Palette,
} from "lucide-react";
import {
  type Site, type Page, type Section, type SectionType, type SiteTheme,
  SECTION_CATALOG, createSection, createPage, siteStorage, resolveSiteTheme,
} from "@/lib/site-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { resolveIcon } from "@/components/website/sections/icons";
import SectionRenderer from "@/components/website/sections/SectionRenderer";
import { SiteNav, SiteFooter } from "@/components/website/sections/SiteRenderer";
import Tooltip from "@/components/shared/Tooltip";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

type DeviceWidth = "desktop" | "tablet" | "mobile";
const DEVICE_PX: Record<DeviceWidth, number | null> = { desktop: null, tablet: 820, mobile: 390 };

const FONT_CHOICES = ["Poppins, sans-serif", "'DM Sans', sans-serif", "Manrope, sans-serif", "Lexend, sans-serif", "Montserrat, sans-serif", "'Playfair Display', serif", "Inter, sans-serif"];

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
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<"idle" | "saving" | "saved">("idle");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightTab, setRightTab] = useState<"content" | "design">("content");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setSite(value); }, [value.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = useCallback((next: Site) => {
    setSite(next);
    setSavedAt("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { siteStorage.save(next); onChange(next); setSavedAt("saved"); }, 700);
  }, [onChange]);

  // The rendered site's base (bg/text) follows the app theme; brand colours stay from the site.
  const { theme: appTheme } = useTheme();
  const renderTheme = useMemo(() => resolveSiteTheme(site.theme, appTheme), [site.theme, appTheme]);

  const activePage: Page | undefined = useMemo(
    () => site.pages.find((p) => p.id === activePageId) ?? site.pages[0],
    [site.pages, activePageId],
  );
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
    if (!sec) return;
    updateSection(sectionId, { content: { ...sec.content, [key]: val } });
  }, [activePage, updateSection]);

  const setCta = useCallback((sectionId: string, which: "ctaPrimary" | "ctaSecondary", label: string) => {
    const sec = activePage?.sections.find((s) => s.id === sectionId);
    if (!sec) return;
    updateSection(sectionId, { content: { ...sec.content, [which]: { ...(sec.content[which] || {}), label } } });
  }, [activePage, updateSection]);

  const setItem = useCallback((sectionId: string, index: number, key: string, val: string) => {
    const sec = activePage?.sections.find((s) => s.id === sectionId);
    if (!sec?.content.items) return;
    const items = sec.content.items.map((it, i) => (i === index ? { ...it, [key]: val } : it));
    updateSection(sectionId, { content: { ...sec.content, items } });
  }, [activePage, updateSection]);

  const updateTheme = useCallback((patch: Partial<SiteTheme>) => {
    commit({ ...site, theme: { ...site.theme, ...patch } });
  }, [site, commit]);

  const addSection = useCallback((type: SectionType) => {
    if (!activePage) return;
    const sec = createSection(type);
    updatePage(activePage.id, { sections: [...activePage.sections, sec] });
    setActiveSectionId(sec.id);
    setAddSectionOpen(false);
  }, [activePage, updatePage]);

  const duplicateSection = useCallback((sectionId: string) => {
    if (!activePage) return;
    const i = activePage.sections.findIndex((s) => s.id === sectionId);
    if (i < 0) return;
    const clone: Section = { ...activePage.sections[i], id: `sec-${Date.now()}-${Math.round(performance.now())}` };
    const sections = [...activePage.sections];
    sections.splice(i + 1, 0, clone);
    updatePage(activePage.id, { sections });
    setActiveSectionId(clone.id);
  }, [activePage, updatePage]);

  const deleteSection = useCallback((sectionId: string) => {
    if (!activePage) return;
    updatePage(activePage.id, { sections: activePage.sections.filter((s) => s.id !== sectionId) });
    if (activeSectionId === sectionId) setActiveSectionId(null);
  }, [activePage, updatePage, activeSectionId]);

  const moveSection = useCallback((sectionId: string, dir: -1 | 1) => {
    if (!activePage) return;
    const secs = [...activePage.sections];
    const i = secs.findIndex((s) => s.id === sectionId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= secs.length) return;
    [secs[i], secs[j]] = [secs[j], secs[i]];
    updatePage(activePage.id, { sections: secs });
  }, [activePage, updatePage]);

  const addPage = useCallback(() => {
    const n = site.pages.length;
    const page = createPage(`Page ${n + 1}`, `/page-${n + 1}`, { withHero: true });
    commit({ ...site, pages: [...site.pages, page], nav: [...site.nav, { pageId: page.id, label: page.name }] });
    setActivePageId(page.id);
    setActiveSectionId(page.sections[0]?.id ?? null);
  }, [site, commit]);

  const deletePage = useCallback((pageId: string) => {
    if (site.pages.length <= 1) return;
    const pages = site.pages.filter((p) => p.id !== pageId);
    commit({ ...site, pages, nav: site.nav.filter((n) => n.pageId !== pageId) });
    if (activePageId === pageId) { setActivePageId(pages[0].id); setActiveSectionId(pages[0].sections[0]?.id ?? null); }
  }, [site, commit, activePageId]);

  const canvasWidth = DEVICE_PX[device];

  // Reusable chrome class fragments (app-theme aware).
  const panelBg = "bg-white dark:bg-[#161922] midnight:bg-[#0d1230] purple:bg-[#241435]";
  const panelBorder = "border-gray-200 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40";
  const inputCls = "w-full text-sm px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
  const labelCls = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";

  return (
    <div className="flex h-full w-full bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-gray-100">
      {/* ── Left: Pages + Sections ── */}
      {!preview && leftOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setLeftOpen(false)} aria-hidden="true" />}
      {!preview && (
        <aside
          className={`w-64 shrink-0 flex flex-col border-r ${panelBorder} ${panelBg} overflow-y-auto fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${leftOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Pages and sections"
        >
          <button onClick={() => setLeftOpen(false)} aria-label="Close panel" className="lg:hidden absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 z-10"><X className="w-4 h-4" /></button>

          {/* Pages */}
          <div className={`p-3 border-b ${panelBorder}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className={labelCls + " uppercase tracking-wide"}>Pages</h2>
              <button onClick={addPage} aria-label="Add page" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"><Plus className="w-4 h-4" /></button>
            </div>
            <ul className="space-y-0.5">
              {site.pages.map((p) => (
                <li key={p.id}>
                  <div
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ${p.id === activePageId ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-purple-900/40 text-blue-700 dark:text-blue-300" : "hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"}`}
                    onClick={() => { setActivePageId(p.id); setActiveSectionId(p.sections[0]?.id ?? null); }}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePageId(p.id); } }}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">{p.name}</span>
                    {p.isHome && <Globe className="w-3 h-3 opacity-60" aria-label="Home page" />}
                    {site.pages.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); deletePage(p.id); }} aria-label={`Delete ${p.name}`} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"><Trash2 className="w-3 h-3" /></button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          <div className="p-3 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className={labelCls + " uppercase tracking-wide"}>Sections</h2>
              <button onClick={() => setAddSectionOpen((v) => !v)} aria-label="Add section" aria-expanded={addSectionOpen} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"><Plus className="w-4 h-4" /></button>
            </div>

            {addSectionOpen && (
              <div className={`mb-2 rounded-lg border ${panelBorder} overflow-hidden`} role="menu" aria-label="Section types">
                {SECTION_CATALOG.map((c) => {
                  const Icon = resolveIcon(c.icon);
                  return (
                    <button key={c.type} onClick={() => addSection(c.type)} role="menuitem" className="w-full flex items-start gap-2 text-left px-2.5 py-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b last:border-b-0 border-gray-100 dark:border-gray-800">
                      <Icon className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" />
                      <span><span className="font-medium">{c.label}</span><span className="block text-[10px] text-gray-400">{c.description}</span></span>
                    </button>
                  );
                })}
              </div>
            )}

            <ul className="space-y-0.5">
              {activePage?.sections.map((s, i) => {
                const Icon = resolveIcon(SECTION_CATALOG.find((c) => c.type === s.type)?.icon);
                return (
                  <li key={s.id}>
                    <div
                      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${s.id === activeSectionId ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-purple-900/40 text-blue-700 dark:text-blue-300" : "hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"} ${s.hidden ? "opacity-50" : ""}`}
                      onClick={() => { setActiveSectionId(s.id); setRightTab("content"); }}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveSectionId(s.id); } }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate flex-1">{s.name}</span>
                      <div className="flex items-center opacity-0 group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, -1); }} disabled={i === 0} aria-label={`Move ${s.name} up`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, 1); }} disabled={i === (activePage?.sections.length ?? 0) - 1} aria-label={`Move ${s.name} down`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                        <button onClick={(e) => { e.stopPropagation(); updateSection(s.id, { hidden: !s.hidden }); }} aria-label={s.hidden ? `Show ${s.name}` : `Hide ${s.name}`} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">{s.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSection(s.id); }} aria-label={`Delete ${s.name}`} className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </li>
                );
              })}
              {activePage?.sections.length === 0 && <li className="text-xs text-gray-400 px-2 py-3 text-center">No sections yet. Click + to add one.</li>}
            </ul>
          </div>
        </aside>
      )}

      {/* ── Center ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Toolbar */}
        <div className={`h-14 shrink-0 flex items-center gap-2 px-3 border-b ${panelBorder} ${panelBg}/90 backdrop-blur`}>
          {!preview && <button onClick={() => setLeftOpen(true)} aria-label="Open pages and sections" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"><PanelLeft className="w-4 h-4" /></button>}
          <button onClick={() => onExit?.()} aria-label="Back to my sites" title="Back to my sites" className="flex items-center gap-2 pr-2 mr-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm relative">
              <Globe className="w-4 h-4 text-white group-hover:opacity-0 transition-opacity" />
              <ArrowLeft className="w-4 h-4 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
          <input value={site.name} onChange={(e) => commit({ ...site, name: e.target.value })} aria-label="Site name" className="text-sm font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-1 max-w-[180px] hover:bg-gray-50 dark:hover:bg-gray-800/50" />
          <div className="flex-1" />

          <div className="hidden sm:flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5" role="group" aria-label="Preview device width">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} aria-label={`${d} preview`} aria-pressed={device === d} className={`p-1.5 rounded-md ${device === d ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Icon className="w-4 h-4" /></button>
            ))}
          </div>

          <ThemeSwitcher compact />

          <button onClick={() => setPreview((v) => !v)} aria-label={preview ? "Exit preview" : "Preview"} aria-pressed={preview} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${preview ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}><Play className="w-3.5 h-3.5" /> {preview ? "Editing" : "Preview"}</button>

          <Tooltip content="Publishing & hosting come next — build your site now, go live later">
            <button disabled aria-label="Publish (coming soon)" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"><Lock className="w-3.5 h-3.5" /> Publish</button>
          </Tooltip>

          <span className="hidden md:flex text-[11px] text-gray-400 items-center gap-1 w-16 justify-end" aria-live="polite">
            {savedAt === "saving" ? <><Save className="w-3 h-3 animate-pulse" /> Saving</> : savedAt === "saved" ? <><Save className="w-3 h-3" /> Saved</> : null}
          </span>

          {!preview && <button onClick={() => setRightOpen(true)} aria-label="Open properties" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"><PanelRight className="w-4 h-4" /></button>}
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-gray-100 dark:bg-[#0b0d12] midnight:bg-[#080b1f] purple:bg-[#160a26]">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/10 transition-[width] duration-300 w-full" style={{ width: canvasWidth ? `${canvasWidth}px` : "100%", maxWidth: "100%" }}>
            {activePage && (
              <div style={{ fontFamily: renderTheme.bodyFont, background: renderTheme.background }}>
                <SiteNav site={site} theme={renderTheme} />
                {activePage.sections.filter((s) => (preview ? !s.hidden : true)).map((s) => {
                  const isActive = s.id === activeSectionId && !preview;
                  const i = activePage.sections.findIndex((x) => x.id === s.id);
                  return (
                    <div
                      key={s.id}
                      className={`relative ${s.hidden && !preview ? "opacity-40" : ""} ${!preview ? "cursor-pointer" : ""} ${isActive ? "ring-2 ring-inset ring-indigo-500" : !preview ? "hover:ring-2 hover:ring-inset hover:ring-indigo-300" : ""}`}
                      onClick={() => { if (!preview) { setActiveSectionId(s.id); setRightTab("content"); } }}
                    >
                      <SectionRenderer section={s} theme={renderTheme} />
                      {isActive && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-lg bg-gray-900/85 backdrop-blur px-1 py-0.5 shadow-lg" onClick={(e) => e.stopPropagation()}>
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
                {activePage.sections.length === 0 && <div className="h-64 flex items-center justify-center text-gray-400 text-sm">This page is empty — add a section from the left panel.</div>}
                <SiteFooter site={site} theme={renderTheme} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: Content / Design ── */}
      {!preview && rightOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setRightOpen(false)} aria-hidden="true" />}
      {!preview && (
        <aside
          className={`w-72 shrink-0 flex flex-col border-l ${panelBorder} ${panelBg} overflow-y-auto fixed lg:static inset-y-0 right-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${rightOpen ? "translate-x-0" : "translate-x-full"}`}
          aria-label="Section properties"
        >
          <button onClick={() => setRightOpen(false)} aria-label="Close panel" className="lg:hidden absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 z-10"><X className="w-4 h-4" /></button>

          {/* Tabs */}
          <div className={`flex border-b ${panelBorder}`}>
            {([["content", "Content", FileText], ["design", "Design", Palette]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setRightTab(key)} aria-pressed={rightTab === key} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 ${rightTab === key ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {rightTab === "content" ? (
            activeSection ? (
              <div className="p-4 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">{activeSection.name}</div>
                {activeSection.content.eyebrow !== undefined && (
                  <label className="block"><span className={labelCls}>Eyebrow</span><input value={activeSection.content.eyebrow || ""} onChange={(e) => setContent(activeSection.id, "eyebrow", e.target.value)} className={inputCls} /></label>
                )}
                {activeSection.content.heading !== undefined && (
                  <label className="block"><span className={labelCls}>Heading</span><textarea value={activeSection.content.heading || ""} onChange={(e) => setContent(activeSection.id, "heading", e.target.value)} rows={2} className={inputCls} /></label>
                )}
                {activeSection.content.subheading !== undefined && (
                  <label className="block"><span className={labelCls}>Subheading</span><textarea value={activeSection.content.subheading || ""} onChange={(e) => setContent(activeSection.id, "subheading", e.target.value)} rows={2} className={inputCls} /></label>
                )}
                {activeSection.content.body !== undefined && (
                  <label className="block"><span className={labelCls}>Body</span><textarea value={activeSection.content.body || ""} onChange={(e) => setContent(activeSection.id, "body", e.target.value)} rows={4} className={inputCls} /></label>
                )}
                {activeSection.content.ctaPrimary !== undefined && (
                  <label className="block"><span className={labelCls}>Primary button</span><input value={activeSection.content.ctaPrimary?.label || ""} onChange={(e) => setCta(activeSection.id, "ctaPrimary", e.target.value)} className={inputCls} /></label>
                )}
                {activeSection.content.ctaSecondary !== undefined && (
                  <label className="block"><span className={labelCls}>Secondary button</span><input value={activeSection.content.ctaSecondary?.label || ""} onChange={(e) => setCta(activeSection.id, "ctaSecondary", e.target.value)} className={inputCls} /></label>
                )}

                {activeSection.content.items && activeSection.content.items.length > 0 && (
                  <div className="pt-2">
                    <span className={labelCls + " block mb-1.5"}>Items</span>
                    <div className="space-y-2">
                      {activeSection.content.items.map((it, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border ${panelBorder} space-y-1.5`}>
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
              <div className="p-4 text-xs text-gray-400 text-center mt-8">Select a section to edit its content, or add one from the left.</div>
            )
          ) : (
            /* Design (global brand styles) */
            <div className="p-4 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Brand colours</div>
              <p className="text-[11px] text-gray-400 -mt-2">The light/dark base follows the theme you pick in the header. These set your brand accents.</p>
              {([["primary", "Primary"], ["accent", "Accent"]] as const).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between gap-2">
                  <span className={labelCls}>{label}</span>
                  <span className="flex items-center gap-2">
                    <input type="color" value={site.theme[key]} onChange={(e) => updateTheme({ [key]: e.target.value })} aria-label={`${label} colour`} className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-gray-700 bg-transparent" />
                  </span>
                </label>
              ))}

              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-2">Typography</div>
              <label className="block"><span className={labelCls}>Heading font</span>
                <select value={site.theme.headingFont} onChange={(e) => updateTheme({ headingFont: e.target.value })} className={inputCls}>
                  {FONT_CHOICES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}
                </select>
              </label>
              <label className="block"><span className={labelCls}>Body font</span>
                <select value={site.theme.bodyFont} onChange={(e) => updateTheme({ bodyFont: e.target.value })} className={inputCls}>
                  {FONT_CHOICES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}
                </select>
              </label>

              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-2">Corners</div>
              <label className="block"><span className={labelCls}>Radius: {site.theme.radius}px</span>
                <input type="range" min={0} max={28} step={2} value={site.theme.radius} onChange={(e) => updateTheme({ radius: Number(e.target.value) })} aria-label="Corner radius" className="w-full mt-1" />
              </label>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
