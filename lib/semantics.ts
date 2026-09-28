/**
 * THE PAGE'S HTML5 SEMANTICS — one resolver shared by the canvas and the export, so what a user builds is what
 * publishes (rule 11). Decided with the user 2026-09-27 (plan: https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ):
 *
 *   A1 — the <main> region is AUTOMATIC: everything between the page's header and footer regions is wrapped in one
 *        <main>; a block the user marks Main is used instead.
 *   B1 — heading LEVELS follow the page: the first heading of the main content is H1, later ones H2, and a heading
 *        inside a sectioning block (section / article / aside / nav) sits one level below that block's context, down
 *        to H6. Size is separate. A level the user sets by hand is theirs and is never renumbered.
 *   C1 — AUTO-CORRECT FIRST. Whatever can be fixed without a person's judgement is fixed silently here; only what
 *        needs the user's own words (an image description, the words on a button) is reported by `pageCheck`.
 *
 * Research followed (RULE R): docs/web-anatomy/html-semantics.md — landmark rules, one main, banner/contentinfo only at
 * page level, named repeated landmarks, list items only in lists, no skipped heading levels, skip link.
 *
 * Pure: no React, no DOM (engine-stays-portable).
 */
import type { BoxNode } from "./box-model";

/** The elements a container may be. `div` is the neutral default. */
export type SemanticTag = "div" | "header" | "nav" | "main" | "section" | "article" | "aside" | "footer" | "ul" | "ol" | "figure" | "address";

/** For the Inspector's "What is this block?" control: plain words, and what a screen reader announces. */
export const CONTAINER_TAGS: { tag: SemanticTag; label: string; hint: string; announces: string }[] = [
  { tag: "div", label: "Plain block", hint: "No special meaning — most blocks are this", announces: "nothing" },
  { tag: "header", label: "Page header", hint: "The top of the page: logo, menu", announces: "banner (at the top of the page)" },
  { tag: "nav", label: "Menu", hint: "A set of links to other pages", announces: "navigation" },
  { tag: "main", label: "Main content", hint: "What this page is about — made automatically if you do not choose", announces: "main" },
  { tag: "section", label: "Section", hint: "A part of the page with its own heading", announces: "region (when named)" },
  { tag: "article", label: "Article / card", hint: "Something that stands on its own: a news item, a card", announces: "article" },
  { tag: "aside", label: "Sidebar", hint: "Related but not the main thing", announces: "complementary" },
  { tag: "footer", label: "Page footer", hint: "The bottom of the page: contact, links", announces: "contentinfo (at the bottom of the page)" },
  { tag: "ul", label: "List", hint: "Its blocks are items of a list", announces: "list" },
  { tag: "ol", label: "Numbered list", hint: "Its blocks are steps in order", announces: "list" },
  { tag: "figure", label: "Figure", hint: "A picture or chart with its caption", announces: "figure" },
  { tag: "address", label: "Contact details", hint: "How to reach the school or organisation", announces: "group" },
];

const SECTIONING = new Set<string>(["section", "article", "aside", "nav"]);
const isTag = (t: unknown): t is SemanticTag => typeof t === "string" && CONTAINER_TAGS.some((c) => c.tag === t);

/** What one block publishes as, after the automatic corrections. */
export type Resolved = {
  tag: string;            // the element: a container's tag, `h1`..`h6` for a heading, `li` wrapper handled via `listItem`
  level?: number;         // headings
  label?: string;         // aria-label (named landmarks)
  listItem?: boolean;     // wrap this block in <li> (it is a child of a list)
  omit?: boolean;         // not published (an empty heading)
  corrected?: string;     // what was fixed automatically, in plain words (shown in the Page check as "fixed for you")
};

export type PageSemantics = {
  byId: Map<string, Resolved>;
  /** The automatic <main>: the range of the root's children it wraps (end exclusive), or null when a block is Main. */
  mainWrap: { start: number; end: number } | null;
};

/** A top-level child's region: its own tag, or the tag of the one block a structural band wraps. */
function regionTag(n: BoxNode): string | undefined {
  if (isTag(n.tag)) return n.tag;
  const kids = n.children ?? [];
  if (n.rowBand && kids.length === 1 && isTag(kids[0].tag)) return kids[0].tag;
  return undefined;
}

const hasText = (n: BoxNode) => !!(n.text ?? "").replace(/<[^>]*>/g, "").trim();

/** Does this subtree contain a heading (not counting headings inside nested sectioning blocks)? */
function ownsHeading(n: BoxNode): boolean {
  for (const c of n.children ?? []) {
    if (c.type === "heading" && hasText(c)) return true;
    if (!SECTIONING.has(String(c.tag)) && ownsHeading(c)) return true;
  }
  return false;
}

export function resolvePage(root: BoxNode): PageSemantics {
  const byId = new Map<string, Resolved>();
  const top = root.children ?? [];

  // ── REGIONS (A1): leading headers, trailing footers, everything between is main ──
  let start = 0; while (start < top.length && regionTag(top[start]) === "header") start++;
  let end = top.length; while (end > start && regionTag(top[end - 1]) === "footer") end--;
  const pageHeaders = new Set(top.slice(0, start).map((n) => n.id));
  const pageFooters = new Set(top.slice(end).map((n) => n.id));

  // One explicit Main at most, and never inside a sectioning block, header or footer.
  let explicitMain: string | null = null;
  const findMain = (n: BoxNode, inside: string[]) => {
    for (const c of n.children ?? []) {
      if (c.tag === "main" && !explicitMain && !inside.some((t) => SECTIONING.has(t) || t === "header" || t === "footer")) explicitMain = c.id;
      findMain(c, [...inside, String(c.tag ?? "div")]);
    }
  };
  findMain(root, []);

  // ── NAMES for repeated menus (auto): the one in the header is the main menu, the footer's is the footer menu ──
  const navs: { n: BoxNode; region: "header" | "footer" | "body" }[] = [];

  // ── HEADINGS (B1) ──
  let firstMainHeading = true;
  const headingLevel = (n: BoxNode, ctx: number, inMain: boolean): number => {
    if (typeof n.level === "number" && n.level >= 1 && n.level <= 6) return n.level; // the user's, never renumbered
    if (inMain && firstMainHeading) { firstMainHeading = false; return 1; }
    return Math.min(6, Math.max(2, ctx));
  };

  // Headings in the main content get numbered FIRST, so the main content owns the H1 even though the header comes first.
  // `own` is the level of headings directly in this block; `inner` is where a sectioning block nested in it sits. A
  // section's OWN heading is at the level the section sits at, and only what is nested inside it goes one deeper (#64).
  /** Lines of a list that hold several blocks side by side — each becomes the list itself (#104). */
  const lineAsList = new Map<string, SemanticTag>();
  const walk = (n: BoxNode, own: number, inner: number, where: "header" | "footer" | "main", parentTag: string, pass: "main" | "rest") => {
    for (const c of n.children ?? []) {
      const inMainNow = where === "main";
      const listItem = parentTag === "ul" || parentTag === "ol";
      if (c.type === "heading") {
        if ((pass === "main") !== inMainNow) continue;
        if (!hasText(c)) { byId.set(c.id, { tag: "div", omit: true, listItem, corrected: "An empty heading is not published until it has words." }); continue; }
        const level = headingLevel(c, own, inMainNow);
        byId.set(c.id, { tag: `h${level}`, level, listItem });
        continue;
      }
      if (c.type !== "container" && c.type !== "component") {
        if (pass === "main" && listItem) byId.set(c.id, { ...(byId.get(c.id) ?? { tag: "" }), listItem: true });
        continue;
      }
      let tag = isTag(c.tag) ? c.tag : "div";
      let corrected: string | undefined;
      /**
       * A LIST WHOSE LINES HOLD SEVERAL BLOCKS (#104). Blocks side by side sit in an invisible LINE, so the line — not the
       * blocks — was the list's child, and four menu links published as ONE <li>. Only <li> may sit inside <ul>, so the
       * line itself becomes the list and each block on it an item; the line keeps its side-by-side layout, and the box
       * the user marked becomes a plain wrapper. A list of one block per line is unchanged.
       */
      const listLines = (tag === "ul" || tag === "ol") && (c.children ?? []).some((k) => k.rowBand && (k.children ?? []).length > 1);
      if (listLines) { for (const k of c.children ?? []) if (k.rowBand) lineAsList.set(k.id, tag); tag = "div"; }
      else if (c.rowBand && lineAsList.has(c.id)) tag = lineAsList.get(c.id)!;
      if (pass === "main") {
        if (tag === "main" && c.id !== explicitMain) { tag = "div"; corrected = "There can be only one main content area, so this one is published as a plain block."; }
        if (tag === "header" && n === root && !pageHeaders.has(c.id)) { tag = "div"; corrected = "A page header belongs at the top of the page, so this one is published as a plain block."; }
        if (tag === "footer" && n === root && !pageFooters.has(c.id)) { tag = "div"; corrected = "A page footer belongs at the bottom of the page, so this one is published as a plain block."; }
        if (tag === "section" && !ownsHeading(c) && !c.landmarkName) { tag = "div"; corrected = "A section needs a heading or a name, so this one is published as a plain block."; }
        if (tag === "nav") navs.push({ n: c, region: where === "main" ? "body" : where });
        byId.set(c.id, { tag, label: c.landmarkName || undefined, listItem, corrected });
      }
      const nextWhere = n === root ? (pageHeaders.has(c.id) ? "header" : pageFooters.has(c.id) ? "footer" : "main") : where;
      if (SECTIONING.has(tag) && ownsHeading(c)) walk(c, inner, Math.min(6, inner + 1), nextWhere, tag, pass);
      else walk(c, own, inner, nextWhere, tag, pass);
    }
  };
  walk(root, 2, 2, "main", "div", "main");
  walk(root, 2, 2, "main", "div", "rest");
  // No heading in the main content at all: the first heading anywhere becomes the H1.
  if (firstMainHeading) {
    const firstAny = [...byId.entries()].find(([, v]) => v.level && !v.omit);
    if (firstAny) { const [id, v] = firstAny; byId.set(id, { ...v, tag: "h1", level: 1 }); }
  }

  // Repeated menus need names to be told apart; name the unnamed ones by where they are.
  const unnamed = navs.filter((x) => !x.n.landmarkName);
  if (navs.length > 1) {
    let k = 0;
    for (const x of unnamed) {
      const r = byId.get(x.n.id)!;
      const label = x.region === "header" && !navs.some((o) => o !== x && o.region === "header" && byId.get(o.n.id)?.label === "Main menu") ? "Main menu"
        : x.region === "footer" ? "Footer menu" : `Menu ${++k + 1}`;
      byId.set(x.n.id, { ...r, label, corrected: `Two or more menus are named so they can be told apart — this one is "${label}".` });
    }
  }

  return { byId, mainWrap: explicitMain ? null : end > start ? { start, end } : null };
}

/** Something only the user can fix — plain words, what to do, and whether it stops publishing. */
export type PageIssue = { id: string; kind: "image-description" | "button-words" | "link-words" | "heading-jump"; blocks: boolean; message: string; fix?: { level?: number } };

/** C1: the Page check — ONLY what needs a person. Everything else was corrected by `resolvePage`. */
export function pageCheck(root: BoxNode, sem: PageSemantics = resolvePage(root)): PageIssue[] {
  const out: PageIssue[] = [];
  let lastLevel = 0;
  const visit = (n: BoxNode) => {
    for (const c of n.children ?? []) {
      if (c.hidden) continue;
      if (c.type === "image" && c.src && c.alt === undefined)
        out.push({ id: c.id, kind: "image-description", blocks: true, message: "Describe this picture for people who can't see it — or mark it as only decoration." });
      if (c.type === "link" && !hasText(c))
        out.push({ id: c.id, kind: "link-words", blocks: true, message: "This link has no words, so nobody knows where it goes. Add words to it." });
      if (c.type === "button" && !hasText(c))
        out.push({ id: c.id, kind: "button-words", blocks: true, message: "This button has no words, so nobody knows what it does. Add words to it." });
      const r = sem.byId.get(c.id);
      if (c.type === "heading" && r?.level && !r.omit) {
        // Only a level the USER set can jump — automatic levels never do.
        if (typeof c.level === "number" && lastLevel && r.level > lastLevel + 1)
          out.push({ id: c.id, kind: "heading-jump", blocks: false, message: `This heading jumps from level ${lastLevel} to ${r.level}. Make it level ${lastLevel + 1}.`, fix: { level: lastLevel + 1 } });
        lastLevel = r.level;
      }
      visit(c);
    }
  };
  visit(root);
  return out;
}

/** Everything `resolvePage` fixed for the user — shown in the Page check as "fixed for you", so nothing is a mystery. */
export function corrections(sem: PageSemantics): { id: string; message: string }[] {
  return [...sem.byId.entries()].filter(([, r]) => r.corrected).map(([id, r]) => ({ id, message: r.corrected! }));
}
