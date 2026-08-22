"use client";

/**
 * Website Builder — entry point. STANDALONE (no app side-menu / top-bar / user-menu), but tied to
 * the tenant: it reflects the signed-in school's branding (logo, name, brand colours) and lets the
 * user switch the app theme right here. Opening a site launches the full-screen editor.
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, FileStack, CheckCircle2 } from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { siteStorage, createSite, createSiteFromTemplate, SITE_TEMPLATES, createPage, type Site } from "@/lib/site-storage";
import SiteCard from "@/components/website/SiteCard";
import SitePreviewThumb from "@/components/website/SitePreviewThumb";
import CreateSiteModal, { type SiteStarter } from "@/components/website/CreateSiteModal";
import StudioHeader from "@/components/website/StudioHeader";
import StudioEmptyState from "@/components/website/StudioEmptyState";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

/** The app theme's base background — used so the hero fades into (and respects) the current theme. */
const THEME_BASE: Record<string, string | null> = { light: null, dark: "#0f1115", midnight: "#0a0e27", purple: "#1a0b2e" };

/** Hero background: vivid brand gradient in light mode; brand glow fading into the theme's dark base otherwise. */
export function heroBackground(themeId: string, primary: string, accent: string): string {
  const base = THEME_BASE[themeId];
  return base
    ? `radial-gradient(130% 130% at 0% 0%, ${primary} 0%, ${base} 68%)`
    : `radial-gradient(130% 130% at 0% 0%, ${accent} 0%, ${primary} 55%)`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export default function WebsiteBuilderHome() {
  const router = useRouter();
  const { settings, currentTenant } = useSchoolSettings();
  const { isDark } = useTheme();

  const [sites, setSites] = useState<Site[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── School branding (with graceful fallbacks to the neutral Studio palette) ──
  const branding = currentTenant?.branding;
  const schoolName = settings.schoolName || currentTenant?.name || "My School";
  const brandPrimary = branding?.primaryColor || "#4f46e5"; // indigo-600
  const brandAccent = branding?.accentColor || branding?.secondaryColor || "#7c3aed"; // violet-600
  const logoUrl = useMemo(
    () => (isDark ? branding?.logoDark || branding?.logo : branding?.logoLight || branding?.logo),
    [isDark, branding],
  );

  const refresh = useCallback(() => setSites(siteStorage.list()), []);
  useEffect(() => { refresh(); setLoaded(true); }, [refresh]);

  const create = useCallback((name: string, starter: SiteStarter) => {
    // New sites start on the school's brand palette.
    const site = siteStorage.create(name, { primary: brandPrimary, accent: brandAccent });
    if (starter === "blank") {
      site.pages = [createPage("Home", "/", { isHome: true })];
      siteStorage.save(site);
    }
    router.push(`/website/builder?id=${site.id}`);
  }, [router, brandPrimary, brandAccent]);

  const confirmDelete = useCallback(() => {
    if (deleteId) siteStorage.remove(deleteId);
    setDeleteId(null);
    refresh();
  }, [deleteId, refresh]);

  const open = useCallback((id: string) => router.push(`/website/builder?id=${id}`), [router]);
  const deleteTarget = sites.find((s) => s.id === deleteId);

  // A site to show in the hero's browser mock — the latest real site, or an on-brand demo.
  const previewSite = useMemo(
    () => sites[0] ?? createSite(schoolName, { primary: brandPrimary, accent: brandAccent }),
    [sites, schoolName, brandPrimary, brandAccent],
  );

  // On-brand demo sites for the first-run template gallery.
  const templates = useMemo(
    () => SITE_TEMPLATES.map((t) => ({ ...t, site: createSiteFromTemplate(schoolName, t.key, { primary: brandPrimary, accent: brandAccent }) })),
    [schoolName, brandPrimary, brandAccent],
  );

  const createFromTemplate = useCallback((key: string) => {
    const site = siteStorage.createFromTemplate(schoolName, key, { primary: brandPrimary, accent: brandAccent });
    router.push(`/website/builder?id=${site.id}`);
  }, [router, schoolName, brandPrimary, brandAccent]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-gray-100">
      <StudioHeader schoolName={schoolName} logoUrl={logoUrl} brandColor={brandPrimary} />

      <div className="flex-1 min-h-0 overflow-y-auto">
      {loaded && sites.length === 0 ? (
        <StudioEmptyState
          schoolName={schoolName}
          brandPrimary={brandPrimary}
          brandAccent={brandAccent}
          demoSite={previewSite}
          templates={templates}
          onCreate={() => setCreateOpen(true)}
          onPickTemplate={createFromTemplate}
        />
      ) : (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero — themed surface (follows app theme) with brand-only accents */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40 bg-white dark:bg-[#161922] midnight:bg-[#0d1230] purple:bg-[#241435] px-6 sm:px-10 lg:px-12 py-9 sm:py-11 lg:py-12">
          <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full blur-3xl" style={{ background: `${brandPrimary}26` }} aria-hidden="true" />
          <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full blur-3xl" style={{ background: `${brandAccent}1f` }} aria-hidden="true" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${brandPrimary}1a`, color: brandPrimary }}>
                <Sparkles className="w-3.5 h-3.5" /> {schoolName} · Website Builder
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Build your school&rsquo;s website in minutes
              </h1>
              <p className="mt-4 text-sm sm:text-base max-w-lg leading-relaxed text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Start from beautiful, ready-made sections, brand it in a click, and connect it to your
                Educo portal so staff and parents can sign in.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shadow-lg hover:-translate-y-0.5 transition-transform"
                  style={{ background: brandPrimary, boxShadow: `0 12px 28px -10px ${brandPrimary}80` }}
                >
                  <Plus className="w-4 h-4" /> Create a new site
                </button>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4" style={{ color: brandPrimary }} /> No code · Fully responsive · On-brand
                </div>
              </div>
            </div>

            {/* Live browser mock preview */}
            <div className="hidden md:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="h-9 flex items-center gap-1.5 px-3.5 bg-gray-100 dark:bg-[#0b0d12]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="ml-3 h-5 flex-1 rounded-full bg-white/70 dark:bg-white/10" />
                </div>
                <SitePreviewThumb site={previewSite} heightClass="h-72" />
              </div>
            </div>
          </div>
        </div>

        {/* Your sites */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              Your sites {sites.length > 0 && <span className="text-gray-400">({sites.length})</span>}
            </h2>
          </div>

          {!loaded ? null : sites.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 py-16 sm:py-20 flex flex-col items-center text-center px-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${brandPrimary}, ${brandAccent})` }}
              >
                <FileStack className="w-8 h-8" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">No sites yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1 mb-5 max-w-sm">
                Create your first website for {schoolName} — pick a starting point and you&rsquo;ll be editing in seconds.
              </p>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
                style={{ background: brandPrimary }}
              >
                <Plus className="w-4 h-4" /> Create a site
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
              {/* Create card */}
              <button
                onClick={() => setCreateOpen(true)}
                aria-label="Create a new site"
                className="group rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-indigo-400 dark:hover:border-indigo-500 min-h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">New site</span>
              </button>

              {sites.map((s) => (
                <SiteCard key={s.id} site={s} onOpen={open} onDelete={setDeleteId} updatedLabel={timeAgo(s.updatedAt)} />
              ))}
            </div>
          )}
        </div>
      </div>
      )}
      </div>

      <CreateSiteModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={create} />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete site"
        itemName={deleteTarget?.name}
        itemId={deleteTarget ? `${deleteTarget.pages.length} page${deleteTarget.pages.length !== 1 ? "s" : ""}` : undefined}
        avatarColor={deleteTarget?.theme.primary}
        message="This permanently removes the site and all its pages. This can't be undone."
      />
    </div>
  );
}
