"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, MoonStar, Sparkles, Check, ChevronDown, type LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { THEMES, THEME_ORDER, type ThemeId } from "@/lib/theme-config";

const ICONS: Record<string, LucideIcon> = { Sun, Moon, MoonStar, Sparkles };

export interface ThemeSwitcherProps {
  /** Compact = icon-only trigger (no label). Useful in tight headers. */
  compact?: boolean;
  className?: string;
  /** Alignment of the dropdown relative to the trigger. */
  align?: "left" | "right";
}

/**
 * Reusable theme switcher — a dropdown listing all available themes (Light / Dark / Midnight /
 * Purple) with icons + labels, wired to the app-wide ThemeContext. Fully theme-aware and
 * keyboard/aria accessible. Drop it into any header/toolbar.
 */
export default function ThemeSwitcher({ compact = false, className = "", align = "right" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
  }, []);

  const current = THEMES[theme];
  const CurrentIcon = ICONS[current.icon] ?? Sun;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${current.label}`}
        className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 transition-colors"
      >
        <CurrentIcon className="w-4 h-4" />
        {!compact && <span className="hidden sm:inline">{current.label}</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Themes"
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-1.5 z-50 min-w-[180px] p-1 rounded-xl shadow-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 animate-in zoom-in-95 duration-150`}
        >
          {THEME_ORDER.map((id: ThemeId) => {
            const t = THEMES[id];
            const Icon = ICONS[t.icon] ?? Sun;
            const active = id === theme;
            return (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => { setTheme(id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-200 font-medium"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: t.colors.background, color: t.colors.accent, border: `1px solid ${t.colors.border}` }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1">{t.label}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
