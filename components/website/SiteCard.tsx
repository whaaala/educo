"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, ExternalLink, Trash2, FileStack, Clock, Globe } from "lucide-react";
import type { Site } from "@/lib/site-storage";
import SitePreviewThumb from "@/components/website/SitePreviewThumb";

export interface SiteCardProps {
  site: Site;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  /** Relative "time ago" label for the last update. */
  updatedLabel: string;
}

/**
 * A single website card for the builder's entry point grid. Matches the app's card language
 * (rounded-xl, themed surfaces, hover lift, ⋮ actions menu) and is fully theme-aware
 * (dark / midnight / purple) and responsive.
 */
export default function SiteCard({ site, onOpen, onDelete, updatedLabel }: SiteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pageCount = site.pages.length;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Open ${site.name}`}
      onClick={() => onOpen(site.id)}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(site.id); }}
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-surface border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Live preview of the actual site */}
      <div className="relative border-b border-gray-100 dark:border-gray-800">
        <SitePreviewThumb site={site} heightClass="h-40" />
        {/* subtle top sheen so the thumbnail reads as a browser preview */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/5 to-transparent" />

        {/* Actions menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            aria-label={`Actions for ${site.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`p-1.5 rounded-lg transition-colors ${menuOpen ? "bg-black/40" : "bg-black/20 opacity-0 group-hover:opacity-100 focus:opacity-100"} text-white hover:bg-black/40`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 z-20 min-w-[150px] py-1 rounded-xl shadow-xl bg-surface border border-line animate-in zoom-in-95 duration-150"
            >
              <button
                role="menuitem"
                onClick={() => { setMenuOpen(false); onOpen(site.id); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              >
                <ExternalLink className="w-4 h-4" /> Open
              </button>
              <button
                role="menuitem"
                onClick={() => { setMenuOpen(false); onDelete(site.id); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="p-3.5 sm:p-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
            <Globe className="w-3.5 h-3.5 text-muted" />
          </span>
          <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
            {site.name}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[0.6875rem] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          <span className="inline-flex items-center gap-1"><FileStack className="w-3 h-3" /> {pageCount} page{pageCount !== 1 ? "s" : ""}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {updatedLabel}</span>
        </div>
      </div>
    </div>
  );
}
