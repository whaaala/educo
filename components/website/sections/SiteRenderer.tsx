"use client";

/**
 * SiteRenderer — renders a full page of a website: an auto nav bar, the visible sections, and a
 * footer. Everything is brand-driven from the site theme. Used for the live builder preview AND
 * the eventual published output. Reusable.
 */

import React from "react";
import { Menu } from "lucide-react";
import type { Site, Page, SiteTheme } from "@/lib/site-storage";
import SectionRenderer from "./SectionRenderer";
import { Container, tint } from "./SectionKit";

export function SiteNav({ site, theme }: { site: Site; theme: SiteTheme }) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{ background: tint(theme.background, 0.85), borderBottom: `1px solid ${tint(theme.text, 0.08)}` }}
    >
      <Container className="h-16 flex items-center">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
            {(site.name || "S").charAt(0)}
          </span>
          <span className="font-bold" style={{ color: theme.text, fontFamily: theme.headingFont }}>{site.name}</span>
        </div>
        <nav className="hidden md:flex items-center gap-7 mx-auto">
          {site.nav.map((n) => (
            <a key={n.pageId} href="#" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: theme.textMuted }}>{n.label}</a>
          ))}
        </nav>
        <div className="ml-auto md:ml-0 flex items-center gap-3">
          <a href="#" className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ background: theme.primary }}>Apply now</a>
          <button className="md:hidden p-2 rounded-lg" style={{ color: theme.text }} aria-label="Menu"><Menu className="w-5 h-5" /></button>
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter({ site, theme }: { site: Site; theme: SiteTheme }) {
  // Footer follows the theme: surface background, theme text — never a fixed light/dark colour.
  return (
    <footer style={{ background: theme.surface, color: theme.textMuted, borderTop: `1px solid ${tint(theme.text, 0.08)}` }}>
      <Container className="py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {(site.name || "S").charAt(0)}
              </span>
              <span className="font-bold" style={{ color: theme.text, fontFamily: theme.headingFont }}>{site.name}</span>
            </div>
            <p className="mt-4 text-sm max-w-sm" style={{ color: theme.textMuted }}>
              Nurturing tomorrow&rsquo;s leaders through excellence in education.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Pages</div>
            <ul className="space-y-2 text-sm">
              {site.nav.map((n) => <li key={n.pageId}><a href="#" className="transition-opacity hover:opacity-70">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3" style={{ color: theme.text }}>Contact</div>
            <ul className="space-y-2 text-sm">
              <li>123 School Road, Lagos</li>
              <li>+234 800 000 0000</li>
              <li>hello@ourschool.edu</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 text-xs" style={{ borderTop: `1px solid ${tint(theme.text, 0.08)}` }}>
          © {site.name}. Built with Educo Studio.
        </div>
      </Container>
    </footer>
  );
}

export default function SiteRenderer({ site, page, theme }: { site: Site; page: Page; theme?: SiteTheme }) {
  const t = theme ?? site.theme;
  const visible = page.sections.filter((s) => !s.hidden);
  return (
    <div style={{ background: t.background, fontFamily: t.bodyFont }}>
      <SiteNav site={site} theme={t} />
      {visible.map((s) => <SectionRenderer key={s.id} section={s} theme={t} />)}
      <SiteFooter site={site} theme={t} />
    </div>
  );
}
