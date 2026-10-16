/**
 * THE APP'S NAVIGATION SHELL — data in, places out (BATCH A-2 change 3). Portable (rule 20): no React, no DOM — the web sample
 * page and `apps/mobile/` both read it. The places live in `config/app-shell.json`, the bar's size in `config/layout.json`
 * (RULE CFG); which shell a window gets is `windowClass` (lib/educo-ui/layout.ts).
 */
import SHELL_DATA from "../config/app-shell.json";
import LAYOUT from "../config/layout.json";
import LISTS_DATA from "../config/sample-lists.json";
import type { Shell } from "./educo-ui/layout";

export interface Place { id: string; label: string; icon: string; href: string; list?: string }
export interface Role { label: string; sample: boolean; items: Place[] }
export type RoleId = keyof typeof SHELL_DATA.roles;

export const ROLES = SHELL_DATA.roles as Record<RoleId, Role>;
export const ROLE_IDS = Object.keys(ROLES) as RoleId[];
export const MORE_LABEL: string = SHELL_DATA.moreLabel;
/** The words the shell and its sample page show (config/app-shell.json, RULE CFG). */
export const WORDS: Readonly<Record<keyof typeof SHELL_DATA.words, string>> = SHELL_DATA.words;
export const BAR_MAX: number = LAYOUT.shell.barMax;
export const RAIL_WIDTH: number = LAYOUT.shell.railWidth;
export const SIDEBAR_WIDTH: number = LAYOUT.shell.sidebarWidth;
export const BAR_CLEARANCE: number = LAYOUT.shell.barClearance;
export const LIST_WIDTH: number = LAYOUT.listDetail.listWidth;

/** What is wrong with the shell data — empty when it is sound. Checked where the config is read (a trust boundary, RULE M). */
export function shellProblems(roles: Record<string, Role>, barMax: number): string[] {
  const out: string[] = [];
  if (!(Number.isInteger(barMax) && barMax >= 2)) out.push(`shell.barMax ${barMax}: a bar needs at least 2 places`);
  for (const [rid, r] of Object.entries(roles)) {
    if (!r.label) out.push(`${rid}: no label`);
    if (!r.items?.length) out.push(`${rid}: no places`);
    const seen = new Set<string>();
    for (const p of r.items ?? []) {
      if (!p.id || !p.label || !p.icon || !p.href?.startsWith("/")) out.push(`${rid}.${p.id || "?"}: needs id, label, icon and an href starting with "/"`);
      if (seen.has(p.id)) out.push(`${rid}.${p.id}: the id is used twice`);
      seen.add(p.id);
    }
  }
  return out;
}
const bad = shellProblems(ROLES, BAR_MAX);
if (bad.length) throw new Error(`config/app-shell.json: ${bad.join(" · ")}`);

/**
 * The places a shell shows, and the ones a bar moves under More: a rail and a sidebar show every place; a bar shows at most
 * `barMax`, so when there are more it shows `barMax - 1` and a More that holds the rest (Apple: "the trailing tab becomes a
 * More tab"; Material: at most five destinations in a bar).
 */
export function shellPlaces(items: Place[], shell: Shell, barMax = BAR_MAX): { shown: Place[]; more: Place[] } {
  if (shell !== "bar" || items.length <= barMax) return { shown: items, more: [] };
  return { shown: items.slice(0, barMax - 1), more: items.slice(barMax - 1) };
}

/** The place a path belongs to: "/" only for itself, any other place for itself and everything under it; the longest wins. */
export function activePlace(items: Place[], path: string): Place | null {
  const p = path.replace(/\/+$/, "") || "/";
  let best: Place | null = null;
  for (const it of items) {
    const hit = it.href === "/" ? p === "/" : p === it.href || p.startsWith(it.href + "/");
    if (hit && (!best || it.href.length > best.href.length)) best = it;
  }
  return best;
}

// ── LIST-DETAIL (A-2 change 4) ──

export interface Row { id: string; title: string; subtitle: string; fields: { label: string; value: string }[] }
export interface SampleList { label: string; rows: Row[] }
/** The sample lists (config/sample-lists.json) — every row invented, shown MARKED as a sample (decision 7). */
export const LISTS = LISTS_DATA.lists as Record<string, SampleList>;
export const LIST_WORDS: Readonly<Record<keyof typeof LISTS_DATA.words, string>> = LISTS_DATA.words;
for (const [rid, r] of Object.entries(ROLES)) for (const p of r.items) {
  if (p.list && !LISTS[p.list]) throw new Error(`config/app-shell.json: ${rid}.${p.id} opens list "${p.list}", which config/sample-lists.json does not have`);
}

/**
 * What a list-detail shows (M3 canonical list-detail): ONE pane → the list, or the opened row's detail with Back; TWO panes
 * (from `listDetail.splitFrom`) → both, the opened row or else the first. The opened row is the URL's (one URL per detail),
 * so a reload, a pasted link and a resize across the split all keep it. An id the list does not have opens nothing.
 */
export function listView(list: SampleList, openId: string | null, panes: 1 | 2): { show: "list" | "detail" | "both"; row: Row | null; missing: boolean } {
  const opened = openId ? list.rows.find((r) => r.id === openId) ?? null : null;
  const missing = !!openId && !opened;
  if (panes === 1) return { show: opened ? "detail" : "list", row: opened, missing };
  return { show: "both", row: opened ?? (missing ? null : list.rows[0] ?? null), missing };
}
