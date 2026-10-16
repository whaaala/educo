"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import AppShell, { placeHref } from "@/components/app-shell/AppShell";
import ListDetail from "@/components/app-shell/ListDetail";
import { useWindowClass } from "@/hooks/useWindowClass";
import { ROLES, ROLE_IDS, WORDS, activePlace, type RoleId } from "@/lib/app-shell";

/**
 * THE APP LAYOUT ON SAMPLE DATA (BATCH A-2, decision 3: the layout is proved before the database). /app-preview/<role>/<place>
 * [/<row>] — a role's navigation shell (bar · rail · sidebar for this window) and, where a place opens a list, its
 * list-detail. Every place, word and row comes from config/ (RULE CFG); the roles marked as samples say so on screen.
 */
export default function AppPreviewPage() {
  const params = useParams<{ path?: string[] }>();
  const [roleSeg = "parent", ...rest] = params.path ?? [];
  if (!(ROLE_IDS as string[]).includes(roleSeg)) notFound();
  const role = roleSeg as RoleId;
  const path = "/" + rest.join("/");
  return <AppShell role={role} path={path}><PlaceView role={role} path={path} /></AppShell>;
}

function PlaceView({ role, path }: { role: RoleId; path: string }) {
  const cls = useWindowClass();
  const r = ROLES[role];
  const place = activePlace(r.items, path);
  const openId = place?.list ? path.slice(place.href === "/" ? 1 : place.href.length + 1).split("/")[0] || null : null;
  return (
    <div>
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-ink">{place?.label ?? r.label}</h1>
        <nav aria-label={WORDS.viewAs} className="flex items-center gap-1">
          <span className="text-sm text-muted">{WORDS.viewAs}</span>
          {ROLE_IDS.map((id) => (
            <Link key={id} href={placeHref(id, "/")} aria-current={id === role ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 min-h-11 inline-flex items-center text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand ${id === role ? "bg-brand text-brand-fg" : "text-muted hover:bg-surface-2"}`}>
              {ROLES[id].label}
            </Link>
          ))}
        </nav>
        {r.sample && <p className="w-full text-sm text-muted">{WORDS.sampleNote}</p>}
      </header>
      {!place ? (
        <div className="p-6">
          <p className="text-ink">{WORDS.notInMenu}</p>
          <Link href={placeHref(role, "/")} className="mt-2 inline-flex min-h-11 items-center font-medium text-brand underline">{WORDS.backHome}</Link>
        </div>
      ) : place.list && cls ? (
        <ListDetail role={role} place={place} openId={openId} panes={cls.panes} />
      ) : (
        <p className="p-6 text-muted">{place.label} — {WORDS.sampleNote}</p>
      )}
    </div>
  );
}
