/**
 * Multi-page site model for the box builder — the step that turns the box ENGINE into an actual WEBSITE.
 * A site is an ordered list of PAGES, each a named/slugged BoxNode tree, with one marked home. Pure +
 * immutable like box-model, so it's testable and undo-safe. Persistence + editing live in the box-demo page.
 */

import { type BoxNode, newBoxId, createContainer, makeRowBand, normalizeRowBands } from "@/lib/box-model";

export interface BoxPage {
  id: string;
  name: string;
  path: string;   // URL slug (unique within the site), e.g. "about" — "" / "home" for the landing page
  root: BoxNode;  // the page's box tree
}

export interface BoxSite {
  pages: BoxPage[];
  homeId: string; // which page is the landing page
  themeId?: string; // the WEBSITE's theme (light | dark | midnight | purple) — drives the canvas + content + export
}

/** Slugify a page name into a URL-safe path ("About Us" → "about-us"). */
export function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "page";
}

/** A unique slug within the site (appends -2, -3, … on collision), optionally ignoring one page's own slug. */
export function uniquePath(site: BoxSite, base: string, ignoreId?: string): string {
  const taken = new Set(site.pages.filter((p) => p.id !== ignoreId).map((p) => p.path));
  const slug = slugify(base);
  if (!taken.has(slug)) return slug;
  for (let i = 2; ; i++) { const s = `${slug}-${i}`; if (!taken.has(s)) return s; }
}

/** A fresh empty page tree (a page root with one starter section). */
export function emptyPageRoot(section?: BoxNode): BoxNode {
  const r = createContainer("column", { layout: "flex", direction: "column", wrap: false, padding: 0, gap: 0, width: "fill", align: "stretch", justify: "start", baseFont: 10 });
  r.children = section ? [makeRowBand([section], 0)] : [];
  return normalizeRowBands(r, 0);
}

export function makeBoxPage(name: string, root: BoxNode, path?: string): BoxPage {
  return { id: newBoxId(), name, path: path ?? slugify(name), root };
}

/** A one-page site around an existing box tree (used to migrate the old single-tree document). */
export function siteFromRoot(root: BoxNode, name = "Home"): BoxSite {
  const page = makeBoxPage(name, root, "home");
  return { pages: [page], homeId: page.id };
}

export const findPage = (site: BoxSite, id: string): BoxPage | undefined => site.pages.find((p) => p.id === id);

/** Set the WEBSITE's theme (the theme the canvas + content + export use). Returns a new site. */
export function setSiteTheme(site: BoxSite, themeId: string): BoxSite {
  return { ...site, themeId };
}

/** Replace a page's root (an edit). Returns a new site. */
export function setPageRoot(site: BoxSite, id: string, root: BoxNode): BoxSite {
  return { ...site, pages: site.pages.map((p) => (p.id === id ? { ...p, root } : p)) };
}

/** Add a page (unique slug); returns the new site + the new page id. */
export function addPage(site: BoxSite, name: string, root: BoxNode): { site: BoxSite; id: string } {
  const page = makeBoxPage(name, root, uniquePath(site, name));
  return { site: { ...site, pages: [...site.pages, page] }, id: page.id };
}

/** Duplicate a page (fresh id, "… copy" name, unique slug). */
export function duplicatePage(site: BoxSite, id: string): { site: BoxSite; id: string } {
  const src = findPage(site, id);
  if (!src) return { site, id };
  const name = `${src.name} copy`;
  const page: BoxPage = { id: newBoxId(), name, path: uniquePath(site, name), root: src.root };
  const idx = site.pages.findIndex((p) => p.id === id);
  const pages = [...site.pages]; pages.splice(idx + 1, 0, page);
  return { site: { ...site, pages }, id: page.id };
}

export function renamePage(site: BoxSite, id: string, name: string): BoxSite {
  return { ...site, pages: site.pages.map((p) => (p.id === id ? { ...p, name, path: uniquePath(site, name, id) } : p)) };
}

/** Delete a page (never the last one). If the home page goes, the first remaining page becomes home. */
export function deletePage(site: BoxSite, id: string): BoxSite {
  if (site.pages.length <= 1) return site;
  const pages = site.pages.filter((p) => p.id !== id);
  const homeId = site.homeId === id ? pages[0].id : site.homeId;
  return { pages, homeId };
}

export function setHomePage(site: BoxSite, id: string): BoxSite {
  return findPage(site, id) ? { ...site, homeId: id } : site;
}

/** Normalize every page's tree (used on load / after edits). */
export function normalizeSite(site: BoxSite, gap = 0): BoxSite {
  return { ...site, pages: site.pages.map((p) => ({ ...p, root: normalizeRowBands(p.root, gap) })) };
}

/**
 * Documents saved before the multi-item field was renamed store their component items under `accItems` (the
 * name it had when only the Accordion used it). The field is now shared by every multi-item component, so it is
 * simply `items` — rename it on load, everywhere in the tree, or an older document would open with no items at
 * all. Kept forever: it costs one pass and there is no other migration hook.
 */
function hasLegacyItemsField(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLegacyItemsField);
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return "accItems" in o || Object.values(o).some(hasLegacyItemsField);
}

function migrateItemsField(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(migrateItemsField);
  if (!value || typeof value !== "object") return value;
  const o = { ...(value as Record<string, unknown>) };
  if ("accItems" in o) {
    if (o.items === undefined) o.items = o.accItems; // never clobber a newer `items` if both somehow exist
    delete o.accItems;
  }
  for (const k of Object.keys(o)) o[k] = migrateItemsField(o[k]);
  return o;
}

/** Load a persisted value that may be a legacy single BoxNode tree OR a BoxSite → always a BoxSite. */
export function coerceSite(rawInput: unknown): BoxSite | null {
  if (!rawInput || typeof rawInput !== "object") return null;
  // Only rewrite when there is actually something to migrate — a modern document is passed straight through,
  // so loading never deep-copies the whole site (and callers keep the identity they had).
  const raw = hasLegacyItemsField(rawInput) ? migrateItemsField(rawInput) : rawInput;
  const o = raw as Record<string, unknown>;
  if (Array.isArray(o.pages) && typeof o.homeId === "string") return o as unknown as BoxSite; // already a site
  if (o.type === "container" && Array.isArray(o.children)) return siteFromRoot(raw as BoxNode); // legacy single tree
  return null;
}

/** Resolve a link href to a target page id, if it is a "page:<id>" link. */
export function pageIdFromHref(href?: string): string | null {
  return href?.startsWith("page:") ? href.slice(5) : null;
}
