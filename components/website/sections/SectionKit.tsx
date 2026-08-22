"use client";

/**
 * Shared, reusable building blocks for website sections. Every colour, font and radius comes from
 * the site's `theme` (SiteTheme) — NOTHING is hardcoded — so recolouring the brand cascades to all
 * sections. These primitives give every section a consistent, modern look.
 */

import React from "react";
import { ArrowRight } from "lucide-react";
import type { SiteTheme, SectionCta } from "@/lib/site-storage";

/** Slightly translucent version of a hex colour (for tints/overlays). */
export function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-6xl mx-auto px-6 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ theme, children }: { theme: SiteTheme; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
      style={{ background: tint(theme.primary, 0.1), color: theme.primary }}
    >
      {children}
    </span>
  );
}

export function Heading({ theme, children, className = "" }: { theme: SiteTheme; children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`font-extrabold tracking-tight leading-[1.1] ${className}`}
      style={{ color: theme.text, fontFamily: theme.headingFont }}
    >
      {children}
    </h2>
  );
}

export function Lead({ theme, children, className = "" }: { theme: SiteTheme; children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p className={`text-base sm:text-lg leading-relaxed ${className}`} style={{ color: theme.textMuted }}>
      {children}
    </p>
  );
}

/** A brand-coloured button. `kind`: solid (primary), ghost (outline), light (on dark bg). */
export function BrandButton({
  theme, cta, kind = "solid", onDark = false,
}: { theme: SiteTheme; cta?: SectionCta; kind?: "solid" | "ghost"; onDark?: boolean }) {
  if (!cta?.label) return null;
  const base = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5";
  let style: React.CSSProperties;
  if (kind === "solid") {
    style = onDark
      ? { background: "#ffffff", color: theme.primary }
      : { background: theme.primary, color: "#ffffff", boxShadow: `0 10px 25px -8px ${tint(theme.primary, 0.6)}` };
  } else {
    style = onDark
      ? { background: tint("#ffffff", 0.12), color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" }
      : { background: "transparent", color: theme.primary, border: `1.5px solid ${tint(theme.primary, 0.4)}` };
  }
  return (
    <a href={cta.href || "#"} className={base} style={style}>
      {cta.label}
      {kind === "solid" && <ArrowRight className="w-4 h-4" />}
    </a>
  );
}

/** A tasteful image placeholder that uses the brand gradient when no image is set. */
export function ImageBox({
  theme, src, alt = "", className = "", rounded = true,
}: { theme: SiteTheme; src?: string; alt?: string; className?: string; rounded?: boolean }) {
  const radius = rounded ? theme.radius * 1.25 : 0;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} style={{ borderRadius: radius }} />;
  }
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: radius }}
      aria-label={alt || "Image placeholder"}
    >
      <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-70" fill="none" stroke="#ffffff" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

/** Section shell — consistent vertical rhythm; pass a background style. */
export function SectionShell({
  children, style, className = "",
}: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${className}`} style={style}>
      {children}
    </section>
  );
}
