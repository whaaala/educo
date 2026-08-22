"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

export interface StudioHeaderProps {
  /** The school / tenant name shown next to the logo. */
  schoolName: string;
  /** Theme-resolved logo URL (light/dark variant already picked). Falls back to an initial mark. */
  logoUrl?: string;
  /** School brand colour — used for the fallback initial mark. */
  brandColor?: string;
  /** Where "Back to app" points. */
  backHref?: string;
}

/**
 * The website builder's OWN top bar (no app side-menu / user-menu). Presentational + reusable:
 * shows the school's logo + name (tenant branding), a theme switcher, and a link back to the app.
 * Fully responsive and theme-aware.
 */
export default function StudioHeader({ schoolName, logoUrl, brandColor = "#4f46e5", backHref = "/" }: StudioHeaderProps) {
  const initial = (schoolName?.trim()?.[0] || "S").toUpperCase();

  return (
    <header className="shrink-0 sticky top-0 z-30 backdrop-blur-md bg-white/85 dark:bg-[#161922]/85 midnight:bg-[#0d1230]/85 purple:bg-[#241435]/85 border-b border-gray-200/70 dark:border-gray-800/70 midnight:border-cyan-900/40 purple:border-purple-900/40">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* School brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          {logoUrl ? (
            <span className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
              <Image src={logoUrl} alt={`${schoolName} logo`} fill className="object-contain" unoptimized />
            </span>
          ) : (
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
              aria-hidden="true"
            >
              {initial}
            </span>
          )}
          <div className="leading-tight min-w-0">
            <div className="font-bold text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[40vw] sm:max-w-none">
              {schoolName}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Website Builder</div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Controls */}
        <ThemeSwitcher />
        <a
          href={backHref}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 midnight:text-cyan-300 purple:text-pink-300 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e]"
        >
          Back to app <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
