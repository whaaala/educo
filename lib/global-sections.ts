/**
 * GLOBAL SECTIONS — edited once, the same everywhere (BATCH LE-15, PS-5 (2); D3 signed 2026-10-19).
 *
 * The leader's model (Wix Studio "Set as Global") on the mechanism the shared header and footer already use (PS-2,
 * `syncSharedRegions`): every page keeps its own whole copy, so the canvas, the Preview, the export and the app's webview
 * draw it like anything else, and an edit to one copy is written to every other copy — on every page, and more than once on
 * one page (D3) — in `setPageRoot`, the one function every edit goes through (so Undo carries it back the same way).
 * A copy is marked by `globalId` on its section block; the list of global sections is READ from the pages, never stored
 * beside them, so it cannot disagree with them. The published page is plain HTML: nothing links the copies at run time.
 * Pure and portable (rule 20).
 */
import type { BoxSite } from "@/lib/box-site";
import { cloneBox, newBoxId, updateBox, type BoxNode } from "@/lib/box-model";

const sig = (n: BoxNode) => JSON.stringify(n, (k, v) => (k === "id" ? undefined : v));
function copies(n: BoxNode, out: BoxNode[] = []): BoxNode[] {
  if (n.globalId) out.push(n);
  for (const c of n.children ?? []) copies(c, out);
  return out;
}
const mapTree = (n: BoxNode, f: (n: BoxNode) => BoxNode | null): BoxNode => {
  const hit = f(n);
  if (hit) return hit;
  return n.children ? { ...n, children: n.children.map((c) => mapTree(c, f)) } : n;
};

/** Make the section at `id` global, under a name. */
export const makeGlobal = (root: BoxNode, id: string, name: string): BoxNode => updateBox(root, id, { globalId: newBoxId(), globalName: name.trim() });
/** Detach this one copy: it becomes an ordinary section; the other copies stay global. */
export const detachGlobal = (root: BoxNode, id: string): BoxNode => updateBox(root, id, { globalId: undefined, globalName: undefined });

export interface GlobalSection { id: string; name: string; pages: number; copies: number }
/** Every global section of the site, with how many pages and copies use it — read from the pages. */
export function globalsInSite(site: BoxSite): GlobalSection[] {
  const by = new Map<string, { name: string; pages: Set<string>; copies: number }>();
  for (const p of site.pages) for (const c of copies(p.root)) {
    const g = by.get(c.globalId!) ?? { name: c.globalName ?? "", pages: new Set<string>(), copies: 0 };
    g.pages.add(p.id); g.copies++;
    by.set(c.globalId!, g);
  }
  return [...by].map(([id, g]) => ({ id, name: g.name, pages: g.pages.size, copies: g.copies }));
}

/** One copy as it is on its page — to draw it (its tile), never to place it. */
export function globalSample(site: BoxSite, gid: string): BoxNode | null {
  for (const p of site.pages) { const c = copies(p.root).find((x) => x.globalId === gid); if (c) return c; }
  return null;
}
/** A new copy of a global section, ready to place (fresh ids, still global). */
export function globalCopy(site: BoxSite, gid: string): BoxNode | null {
  const c = globalSample(site, gid);
  return c ? cloneBox(c) : null;
}

/** Delete a global section from the list: every copy stays where it is, as an ordinary section. */
export function removeGlobal(site: BoxSite, gid: string): BoxSite {
  const plain = (n: BoxNode) => (n.globalId === gid ? { ...n, globalId: undefined, globalName: undefined, children: n.children } : null);
  return { ...site, pages: site.pages.map((p) => ({ ...p, root: mapTree(p.root, (n) => { const h = plain(n); return h ? { ...h, children: h.children?.map((c) => mapTree(c, plain)) } : null; }) })) };
}

/** The global sections whose content an edit changed (from `prev` to `next` of one page) — for "This changes N pages". */
export function changedGlobals(prev: BoxNode, next: BoxNode): string[] {
  const before = new Map(copies(prev).map((c) => [c.id, sig(c)]));
  return [...new Set(copies(next).filter((c) => before.has(c.id) && before.get(c.id) !== sig(c)).map((c) => c.globalId!))];
}

/**
 * After page `id` changed from `prev`: a global copy whose CONTENT changed there is written to every other copy, on every
 * page. Each other copy keeps its own block id (its band and its place are its own); everything inside gets fresh ids, so
 * ids stay unique on a page holding two copies. An edit elsewhere carries nothing, and the site is returned as it was.
 */
export function syncGlobals(site: BoxSite, id: string, prev: BoxNode): BoxSite {
  const page = site.pages.find((p) => p.id === id);
  if (!page) return site;
  const before = new Map(copies(prev).map((c) => [c.id, sig(c)]));
  const changed = copies(page.root).filter((c) => before.has(c.id) && before.get(c.id) !== sig(c));
  if (!changed.length) return site;
  let pages = site.pages;
  for (const src of changed) {
    pages = pages.map((p) => {
      let touched = false;
      const root = mapTree(p.root, (n) => {
        if (n.globalId !== src.globalId || n.id === src.id) return null;
        touched = true;
        return { ...cloneBox(src), id: n.id };
      });
      return touched ? { ...p, root } : p;
    });
  }
  return { ...site, pages };
}
