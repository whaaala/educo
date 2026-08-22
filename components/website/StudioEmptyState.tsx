"use client";

import { Plus, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import type { Site } from "@/lib/site-storage";
import SitePreviewThumb from "@/components/website/SitePreviewThumb";

export interface EmptyTemplate {
  key: string;
  name: string;
  description: string;
  site: Site;
}

export interface StudioEmptyStateProps {
  schoolName: string;
  brandPrimary: string;
  brandAccent: string;
  demoSite: Site;
  templates: EmptyTemplate[];
  onCreate: () => void;
  onPickTemplate: (key: string) => void;
}

/**
 * First-run / "no website yet" onboarding. Fully theme-aware: it uses the app theme's surfaces
 * and text (light in Light, dark in Dark/Midnight/Purple) with the school BRAND used only as
 * accents (buttons, badges, glow, icons) — no saturated colour block. Responsive at every size.
 */
export default function StudioEmptyState({ schoolName, brandPrimary, brandAccent, demoSite, templates, onCreate, onPickTemplate }: StudioEmptyStateProps) {
  const brandTint = `${brandPrimary}1a`; // ~10% — brand accent tint

  return (
    <div className="min-h-full flex flex-col px-4 sm:px-6 lg:px-8 py-5 gap-5">
      {/* Welcome — themed surface with brand accents. Grows to fill the viewport height. */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40 bg-white dark:bg-[#161922] midnight:bg-[#0d1230] purple:bg-[#241435] px-6 sm:px-10 lg:px-12 py-8 sm:py-10 flex-1 min-h-[360px] flex items-stretch">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full blur-3xl" style={{ background: `${brandPrimary}26` }} aria-hidden="true" />
        <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full blur-3xl" style={{ background: `${brandAccent}1f` }} aria-hidden="true" />

        <div className="relative w-full grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          <div className="flex flex-col justify-center">
            <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: brandTint, color: brandPrimary }}>
              <Sparkles className="w-3.5 h-3.5" /> {schoolName} · Website Builder
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.08] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Let&rsquo;s build {schoolName}&rsquo;s website
            </h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 max-w-lg">
              You haven&rsquo;t created a site yet. Pick a template below or start from scratch — you&rsquo;ll be
              editing in seconds, no code needed.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={onCreate} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shadow-lg hover:-translate-y-0.5 transition-transform" style={{ background: brandPrimary, boxShadow: `0 12px 28px -10px ${brandPrimary}80` }}>
                <Plus className="w-4 h-4" /> Create your first website
              </button>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4" style={{ color: brandPrimary }} /> No code · Responsive · On-brand
              </span>
            </div>
          </div>

          {/* Live demo mock — fills the hero height */}
          <div className="relative hidden md:flex flex-col">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10 flex-1 flex flex-col min-h-0">
              <div className="h-8 shrink-0 flex items-center gap-1.5 px-3 bg-gray-100 dark:bg-[#0b0d12]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="ml-3 h-4 flex-1 rounded-full bg-white/70 dark:bg-white/10" />
              </div>
              <SitePreviewThumb site={demoSite} heightClass="flex-1 min-h-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Template gallery */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-4">
          Start from a template
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {templates.map((t) => (
            <div
              key={t.key}
              role="button"
              tabIndex={0}
              aria-label={`Use the ${t.name} template`}
              onClick={() => onPickTemplate(t.key)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPickTemplate(t.key); } }}
              className="group cursor-pointer text-left rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 midnight:border-cyan-900/40 purple:border-purple-900/40 bg-white dark:bg-[#161922] midnight:bg-[#0d1230] purple:bg-[#241435] hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="border-b border-gray-100 dark:border-gray-800">
                <SitePreviewThumb site={t.site} heightClass="h-32" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">{t.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: brandPrimary }} />
                </div>
                <p className="mt-1 text-[11px] leading-tight text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
