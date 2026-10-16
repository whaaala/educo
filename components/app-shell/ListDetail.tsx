"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LISTS, LIST_WORDS, WORDS, listView, type Place, type RoleId } from "@/lib/app-shell";
import { placeHref } from "./AppShell";

/** Where a list was scrolled when a row was opened, per list — so Back (the button or the browser's) returns to the same spot. */
const scrolled = new Map<string, number>();

const SampleBadge = () => (
  <span className="shrink-0 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[0.6875rem] font-medium text-muted">{WORDS.sample}</span>
);

/**
 * THE LIST-DETAIL CONTAINER (A-2 change 4, M3's canonical list-detail) on SAMPLE rows (decision 7, each marked "Sample"):
 * one pane → the list, a row opens its detail with Back; two panes (from `listDetail.splitFrom`, config/layout.json) → the
 * list beside the detail. One URL per detail (…/<place>/<row id>), so a reload, a pasted link and a resize keep the row.
 */
export default function ListDetail({ role, place, openId, panes }: { role: RoleId; place: Place; openId: string | null; panes: 1 | 2 }) {
  const list = LISTS[place.list!];
  const base = placeHref(role, place.href);
  const v = listView(list, openId, panes);
  // back on the one-pane list: to where it was when the row was opened
  useEffect(() => { if (v.show === "list" && scrolled.has(base)) window.scrollTo(0, scrolled.get(base)!); }, [v.show, base]);

  const listPane = (
    <section aria-label={list.label} className={panes === 2 ? "w-list-pane shrink-0 border-r border-line overflow-y-auto" : ""}>
      {v.missing && <p role="status" className="m-4 rounded-lg border border-line bg-surface-2 p-3 text-sm">{LIST_WORDS.missing}</p>}
      {list.rows.length === 0 ? <p className="p-6 text-muted">{LIST_WORDS.empty}</p> : (
        <ul className="divide-y divide-line">
          {list.rows.map((row) => {
            const on = panes === 2 && v.row?.id === row.id;
            return (
              <li key={row.id}>
                <Link href={`${base}/${row.id}`} scroll={panes === 1} aria-current={on ? "true" : undefined}
                  onClick={() => scrolled.set(base, window.scrollY)}
                  className={`flex items-start gap-3 px-4 py-3 min-h-11 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${on ? "bg-brand/10" : "hover:bg-surface-2"}`}>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-medium ${on ? "text-brand" : "text-ink"}`}>{row.title}</span>
                    <span className="block truncate text-sm text-muted">{row.subtitle}</span>
                  </span>
                  <SampleBadge />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
  const detail = v.row ? (
    <article aria-labelledby={`row-${v.row.id}`} className="min-w-0 flex-1 p-4 sm:p-6">
      {panes === 1 && (
        <Link href={base} scroll={false} className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 min-h-11 text-sm font-medium text-brand outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />{LIST_WORDS.back}
        </Link>
      )}
      <div className="flex items-start gap-3">
        <h2 id={`row-${v.row.id}`} className="min-w-0 flex-1 text-xl font-semibold text-ink break-words">{v.row.title}</h2><SampleBadge />
      </div>
      <p className="mt-1 text-muted">{v.row.subtitle}</p>
      <dl className="mt-6 grid gap-4">
        {v.row.fields.map((f) => (
          <div key={f.label}><dt className="text-sm text-muted">{f.label}</dt><dd className="mt-0.5 text-ink break-words">{f.value}</dd></div>
        ))}
      </dl>
    </article>
  ) : panes === 2 ? <p className="flex-1 p-6 text-muted">{list.rows.length ? LIST_WORDS.select : ""}</p> : null;

  if (v.show === "list") return listPane;
  if (v.show === "detail") return detail;
  return <div className="flex min-h-[calc(100dvh-4rem)]">{listPane}{detail}</div>;
}
