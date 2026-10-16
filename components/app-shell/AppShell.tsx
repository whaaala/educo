"use client";

import type { KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, CalendarDays, ClipboardCheck, Ellipsis, FileBarChart, GraduationCap, House, LayoutDashboard, Megaphone,
  Menu, MessageCircle, School, Settings, Users, Wallet, type LucideIcon,
} from "lucide-react";
import ActionMenuDropdown from "@/components/shared/ActionMenuDropdown";
import PageLoader from "@/components/shared/PageLoader";
import { useWindowClass } from "@/hooks/useWindowClass";
import { MORE_LABEL, ROLES, activePlace, shellPlaces, type Place, type RoleId } from "@/lib/app-shell";

/** The web's drawing for each icon key a place carries in config/app-shell.json (the app maps the same keys to its own). */
export const PLACE_ICONS: Record<string, LucideIcon> = {
  home: House, children: Users, fees: Wallet, chat: MessageCircle, more: Menu, classes: School, attendance: ClipboardCheck,
  marks: GraduationCap, timetable: CalendarDays, notices: Megaphone, dashboard: LayoutDashboard, staff: BadgeCheck,
  reports: FileBarChart, settings: Settings,
};
/** Where a place of a role lives on the web sample page: /app-preview/<role><href>. */
export const placeHref = (role: RoleId, href: string) => `/app-preview/${role}${href === "/" ? "" : href}`;

/** Arrow keys walk the places along the shell's own direction; Home / End jump (WAI-ARIA toolbar pattern, keyboard first). */
function walk(vertical: boolean) {
  return (e: KeyboardEvent<HTMLUListElement>) => {
    const next = vertical ? "ArrowDown" : "ArrowRight", prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (![next, prev, "Home", "End"].includes(e.key)) return;
    const all = [...e.currentTarget.querySelectorAll<HTMLElement>(":scope > li > a, :scope > li button[aria-haspopup]")];
    const i = all.indexOf(document.activeElement as HTMLElement); if (i < 0) return;
    e.preventDefault();
    const j = e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : (i + (e.key === next ? 1 : -1) + all.length) % all.length;
    all[j].focus();
  };
}

/**
 * THE APP SHELL (A-2 change 3) — a role's places as a BAR along the bottom, a RAIL down the side, or a SIDEBAR, as
 * `windowClass` says for this window (config/layout.json); the places from config/app-shell.json. The same data and rules
 * as the phone app's bar and rail.
 */
export default function AppShell({ role, path, children }: { role: RoleId; path: string; children: ReactNode }) {
  const cls = useWindowClass();
  const router = useRouter();
  if (!cls) return <PageLoader isLoading />;
  const r = ROLES[role];
  const { shown, more } = shellPlaces(r.items, cls.shell, cls.barFits);
  const active = activePlace(r.items, path);
  const vertical = cls.shell !== "bar", wide = cls.shell === "sidebar";
  const link = (p: Place) => {
    const on = active?.id === p.id; const Icon = PLACE_ICONS[p.icon];
    const look = wide ? "flex-row gap-3 px-4 py-3 rounded-full text-sm" : vertical ? "flex-col gap-1 py-2 rounded-2xl text-xs" : "flex-col gap-0.5 py-2 text-[0.6875rem]";
    return (
      <Link href={placeHref(role, p.href)} aria-current={on ? "page" : undefined}
        className={`flex items-center ${look} min-h-11 font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? "text-brand bg-brand/10" : "text-muted hover:text-ink hover:bg-surface-2"}`}>
        <Icon aria-hidden="true" className="w-5 h-5 shrink-0" />
        {/* A2-22: a word is never cut ("Dashb…") nor split ("Dashboar d") — a place wraps between words, two lines at most; one that
            cannot fit is caught by the UAT, and the bar holds fewer places as the text grows (barFits) */}
        <span className={wide ? "min-w-0 break-words" : "max-w-full text-center leading-tight line-clamp-2 hyphens-auto"}>{p.label}</span>
      </Link>
    );
  };
  const nav = (
    <nav aria-label="Main" data-shell={cls.shell}
      className={vertical ? `${wide ? "w-sidebar" : "w-rail"} shrink-0 sticky top-0 h-dvh overflow-y-auto border-r border-line bg-surface py-3`
        : "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"}>
      <ul onKeyDown={walk(vertical)} className={vertical ? "flex flex-col gap-1 px-1" : "flex"}>
        {shown.map((p) => <li key={p.id} className={vertical ? "" : "flex-1 min-w-0"}>{link(p)}</li>)}
        {more.length > 0 && (
          <li className="flex-1 min-w-0">
            <ActionMenuDropdown placement="above" align="right" ariaLabel={`${MORE_LABEL} places`} width="w-56"
              items={more.map((p) => ({ id: p.id, label: p.label, icon: PLACE_ICONS[p.icon], onClick: () => router.push(placeHref(role, p.href)) }))}
              trigger={(open) => (
                <button type="button" aria-haspopup="menu" aria-expanded={open}
                  className={`w-full flex flex-col items-center gap-0.5 py-2 min-h-11 text-[0.6875rem] font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand ${more.some((p) => p.id === active?.id) ? "text-brand bg-brand/10" : "text-muted hover:text-ink"}`}>
                  <Ellipsis aria-hidden="true" className="w-5 h-5" /><span>{MORE_LABEL}</span>
                </button>
              )} />
          </li>
        )}
      </ul>
    </nav>
  );
  return (
    <div className={`bg-canvas text-ink ${vertical ? "flex min-h-dvh" : "min-h-dvh pb-20"}`}>
      {vertical && nav}
      <main className="flex-1 min-w-0">{children}</main>
      {!vertical && nav}
    </div>
  );
}
