"use client";

/**
 * Reusable navigation menu renderer — one tree model (NavItem: page | link | dropdown), rendered
 * as a horizontal header menu (hover dropdowns) or a mobile overlay. Brand/theme-driven. The same
 * model powers the header nav, a portal user-menu, and a sidebar menu (later).
 */

import { useState } from "react";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import type { NavItem, SiteTheme } from "@/lib/site-storage";
import { tint } from "./SectionKit";

/** Where a nav item points. Page links resolve to their path; in the builder preview it's inert. */
export function navItemHref(item: NavItem): string {
  if (item.type === "link") return item.href || "#";
  return "#";
}

function isDropdown(item: NavItem): boolean {
  return item.type === "dropdown" && !!item.children?.length;
}

/** Optional per-header styling for the nav (set from the header inspector). */
export interface NavStyle {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  gap?: number; // px between items
}

/** Desktop header menu (hidden on mobile) with hover dropdowns. */
export function HeaderMenu({ items, theme, style }: { items: NavItem[]; theme: SiteTheme; style?: NavStyle }) {
  const color = style?.color || theme.textMuted;
  const linkStyle = { color, fontSize: style?.fontSize, fontFamily: style?.fontFamily };
  return (
    <nav className="hidden md:flex items-center mx-auto" style={{ gap: style?.gap ?? 28 }}>
      {items.map((item) =>
        isDropdown(item) ? (
          <div key={item.id} className="relative group">
            <button className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70" style={linkStyle}>
              {item.label}<ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-30">
              <div className="min-w-[190px] rounded-xl shadow-xl p-1.5 border" style={{ background: theme.background, borderColor: tint(theme.text, 0.08) }}>
                {item.children!.map((c) => (
                  <a key={c.id} href={navItemHref(c)} target={c.newTab ? "_blank" : undefined} rel={c.newTab ? "noopener noreferrer" : undefined} className="block px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70" style={{ color: theme.text, fontFamily: style?.fontFamily }}>{c.label}</a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <a key={item.id} href={navItemHref(item)} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noopener noreferrer" : undefined} className="text-sm font-medium transition-opacity hover:opacity-70" style={linkStyle}>{item.label}</a>
        ),
      )}
    </nav>
  );
}

/** Mobile burger + full-width overlay listing all items, dropdowns expanded inline. */
export function MobileMenu({ items, theme }: { items: NavItem[]; theme: SiteTheme }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg" style={{ color: theme.text }} aria-label="Open menu"><MenuIcon className="w-5 h-5" /></button>
      {open && (
        <div className="fixed inset-0 z-50" style={{ background: tint(theme.text, 0.4) }} onClick={() => setOpen(false)}>
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85%] p-5 overflow-y-auto shadow-2xl" style={{ background: theme.background }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2"><button onClick={() => setOpen(false)} aria-label="Close menu" style={{ color: theme.text }}><X className="w-5 h-5" /></button></div>
            <nav className="space-y-1">
              {items.map((item) => (
                <div key={item.id}>
                  <a href={navItemHref(item)} className="block px-2 py-2 rounded-lg font-medium text-sm" style={{ color: theme.text }}>{item.label}</a>
                  {isDropdown(item) && (
                    <div className="ml-3 border-l pl-3 space-y-0.5" style={{ borderColor: tint(theme.text, 0.1) }}>
                      {item.children!.map((c) => (
                        <a key={c.id} href={navItemHref(c)} target={c.newTab ? "_blank" : undefined} className="block px-2 py-1.5 rounded-lg text-sm" style={{ color: theme.textMuted }}>{c.label}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
