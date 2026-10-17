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
import type { CSSProperties } from "react";
import { type BoxNode, type Breakpoint, BP_ORDER, regionBlock, regionSpan, isBare, isPageRow, resolveResponsive, baseUnitParts, pageRowCells, pageRowTracks, rowSide, bandGutter, longestWordRem } from "./box-model";
import { FONT_FAMILIES, familyOf, missingLetters } from "./educo-ui/fonts";
import PAGE_CHECK from "../config/page-check.json";
import { NARROWEST_PHONE_PX, RUNG_PX, RUNG_WORDS, type RungName } from "./educo-ui/layout";

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
  selfContained?: boolean; // a heading inside an article / aside / figure / nav — never the page's title (#118)
};

export type PageSemantics = {
  byId: Map<string, Resolved>;
  /** The automatic <main>: the range of the root's children it wraps (end exclusive), or null when a block is Main. */
  mainWrap: { start: number; end: number } | null;
  /** LE-2 · the AUTOMATIC menus: per container, the runs of its children (end exclusive) published as `<nav><ul>`, and the key of
   *  each run's own entry in `byId` (its name, its "fixed for you" note). */
  menus: Map<string, { start: number; end: number; key: string }[]>;
};

/** The key an automatic menu's entry is stored under in `byId` — its first link's id, prefixed so it never meets a block's own. */
export const MENU_KEY = "menu:";
/** A child that is ONE link: a Link block, or a line (row band) holding a single Link. */
const isLinkItem = (c: BoxNode) => c.type === "link" || (!!c.rowBand && (c.children ?? []).length === 1 && c.children![0].type === "link");

/** A top-level child's region: its own tag, or the tag of the one block a structural band wraps. */
const regionTag = (n: BoxNode): string | undefined => { const t = regionBlock(n)?.tag; return isTag(t) ? t : undefined; };


/**
 * PS-9 (BATCH LE-8) · A SHORT PAGE STILL ENDS AT THE BOTTOM OF THE SCREEN. A page that ends with a Page footer is at least
 * one screen tall (`svh`: the screen on arrival, chrome shown), and its footer takes the space left over above itself
 * (`margin-top: auto` in the page's column) — so on a page shorter than the screen the footer sits on the screen's bottom
 * edge, and on a longer one nothing changes. One resolver: the canvas (where `svh` is the canvas view, LE2-3) and the
 * export both call it.
 */
const fillsColumn = (root: BoxNode) => root.layout === "flex" && root.direction === "column";
export function pageFillCss(root: BoxNode): CSSProperties {
  const [s, e] = regionSpan(root, "footer");
  return s < e && fillsColumn(root) ? { minHeight: "100svh" } : {};
}
/** …and the first block of the footer region is the one pushed down — unless the user gave it a top space of their own. */
export function footerPushCss(root: BoxNode, child: BoxNode): CSSProperties {
  const [s, e] = regionSpan(root, "footer");
  if (s === e || !fillsColumn(root) || root.children?.[s]?.id !== child.id) return {};
  return (child.marginTop ?? child.margin) === undefined ? { marginTop: "auto" } : {};
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
  /**
   * A SELF-CONTAINED piece never titles the page (#118). The first heading of the main content is the page's title —
   * but a card's title, a quote's caption or a sidebar's heading is the title of THAT piece, not of the page. Measured
   * on a dressed home page with no hero whose first section was a row of cards: "Card title" was published as the
   * <h1>, at 19px under the 24px section headings that followed it.
   */
  // (A page header's or footer's heading is never in the main pass, so neither needs listing: the site name in the header
  // is still the fallback title of a page whose content has no heading of its own.)
  const SELF_CONTAINED = new Set(["article", "aside", "figure", "nav"]);
  const headingLevel = (n: BoxNode, ctx: number, inMain: boolean, inSelf: boolean): number => {
    if (typeof n.level === "number" && n.level >= 1 && n.level <= 6) return n.level; // the user's, never renumbered
    if (inMain && !inSelf && firstMainHeading) { firstMainHeading = false; return 1; }
    return Math.min(6, Math.max(2, ctx));
  };

  // Headings in the main content get numbered FIRST, so the main content owns the H1 even though the header comes first.
  // `own` is the level of headings directly in this block; `inner` is where a sectioning block nested in it sits. A
  // section's OWN heading is at the level the section sits at, and only what is nested inside it goes one deeper (#64).
  /** Lines of a list that hold several blocks side by side — each becomes the list itself (#104). */
  const lineAsList = new Map<string, SemanticTag>();
  /**
   * LE-2 · A HEADER'S OR FOOTER'S LINKS ARE A MENU, WITHOUT ANYONE SAYING SO. Two or more Links one after another — on one line, or one
   * per line down a footer column — published as `<div>`s, so a screen reader met a run of loose links and no "navigation, list, 4
   * items". Each run is published as `<nav><ul>` with each link an `<li>`, both wrappers `display: contents`, so nothing moves; a box
   * the person marked Menu or List keeps their choice, and two Buttons side by side stay what they are.
   */
  const menus = new Map<string, { start: number; end: number; key: string }[]>();
  const autoItems = new Set<string>();
  const findMenus = (n: BoxNode) => {
    const kids = n.children ?? [], runs: { start: number; end: number; key: string }[] = [];
    for (let i = 0; i < kids.length; ) {
      let j = i; while (j < kids.length && isLinkItem(kids[j])) j++;
      if (j - i >= 2) { runs.push({ start: i, end: j, key: MENU_KEY + kids[i].id }); kids.slice(i, j).forEach((k) => autoItems.add(k.id)); }
      i = Math.max(j, i + 1);
    }
    if (runs.length) menus.set(n.id, runs);
  };
  const walk = (n: BoxNode, own: number, inner: number, where: "header" | "footer" | "main", parentTag: string, pass: "main" | "rest", inSelf = false, inMenu = false) => {
    if (pass === "main" && where !== "main" && !inMenu && n !== root) {
      findMenus(n);
      for (const r of menus.get(n.id) ?? []) { byId.set(r.key, { tag: "nav", corrected: "These links are published as a menu — a list of links a screen reader can find and count." }); navs.push({ n: { id: r.key } as BoxNode, region: where }); }
    }
    for (const c of n.children ?? []) {
      const inMainNow = where === "main";
      const listItem = parentTag === "ul" || parentTag === "ol" || autoItems.has(c.id);
      if (c.type === "heading") {
        if ((pass === "main") !== inMainNow) continue;
        if (!hasText(c)) { byId.set(c.id, { tag: "div", omit: true, listItem, corrected: "An empty heading is not published until it has words." }); continue; }
        const level = headingLevel(c, own, inMainNow, inSelf);
        byId.set(c.id, { tag: `h${level}`, level, listItem, selfContained: inSelf || undefined });
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
      const nextSelf = inSelf || SELF_CONTAINED.has(tag);
      const nextMenu = inMenu || tag === "nav" || tag === "ul" || tag === "ol" || autoItems.has(c.id);
      if (SECTIONING.has(tag) && ownsHeading(c)) walk(c, inner, Math.min(6, inner + 1), nextWhere, tag, pass, nextSelf, nextMenu);
      else walk(c, own, inner, nextWhere, tag, pass, nextSelf, nextMenu);
    }
  };
  walk(root, 2, 2, "main", "div", "main");
  walk(root, 2, 2, "main", "div", "rest");
  // No page-titling heading in the main content at all: the first heading anywhere that is not inside a self-contained
  // piece becomes the H1 — the site name in the header, typically — and only failing that, the first heading of any kind.
  if (firstMainHeading) {
    const all = [...byId.entries()].filter(([, v]) => v.level && !v.omit);
    const firstAny = all.find(([, v]) => !v.selfContained) ?? all[0];
    if (firstAny) { const [id, v] = firstAny; byId.set(id, { ...v, tag: "h1", level: 1 }); }
  }
  /**
   * THE SECTION THE PAGE TITLE HEADS (#121). A section's own heading sits at the section's level and what is nested
   * inside it goes one deeper — worked out before it is known that this heading becomes the page's H1. So the cards
   * inside the first section published as h3 under an h1: a skipped level (S37) on every page whose title opens a
   * section. Once the H1 is known, everything inside its section comes up one level, except a level the user set.
   */
  const h1 = [...byId.entries()].find(([, v]) => v.level === 1 && !v.omit)?.[0];
  if (h1) {
    const holder = (n: BoxNode): BoxNode | null => { for (const c of n.children ?? []) { if (c.id === h1) return n; const f = holder(c); if (f) return f; } return null; };
    let owner = holder(root);
    // up through the bands the heading sits in, to the SECTIONING block whose own heading it is
    const parentOf = (id: string): BoxNode | null => { const f = (n: BoxNode): BoxNode | null => { for (const c of n.children ?? []) { if (c.id === id) return n; const r = f(c); if (r) return r; } return null; }; return f(root); };
    while (owner && owner !== root && !(SECTIONING.has(byId.get(owner.id)?.tag ?? "") && ownsHeading(owner))) owner = parentOf(owner.id);
    if (owner && owner !== root) {
      const lift = (n: BoxNode) => { for (const c of n.children ?? []) { const r = byId.get(c.id); if (c.type === "heading" && r?.level && r.level >= 3 && c.id !== h1 && typeof c.level !== "number") byId.set(c.id, { ...r, level: r.level - 1, tag: `h${r.level - 1}` }); lift(c); } };
      lift(owner);
    }
  }

  // Repeated menus need names to be told apart; name the unnamed ones by where they are.
  const unnamed = navs.filter((x) => !x.n.landmarkName);
  if (navs.length > 1) {
    let k = navs.some((x) => x.region === "header") ? 1 : 0; // "Main menu" is the first; the rest count on from it (RX3-10)
    for (const x of unnamed) {
      const r = byId.get(x.n.id)!;
      const label = x.region === "header" && !navs.some((o) => o !== x && o.region === "header" && byId.get(o.n.id)?.label === "Main menu") ? "Main menu"
        : x.region === "footer" ? "Footer menu" : `Menu ${++k}`;
      byId.set(x.n.id, { ...r, label, corrected: x.n.id.startsWith(MENU_KEY) // an automatic menu still says what it is
        ? `These links are published as a menu, "${label}" — a list of links a screen reader can find, count and tell from the others.`
        : `Two or more menus are named so they can be told apart — this one is "${label}".` });
    }
  }

  return { byId, mainWrap: explicitMain ? null : end > start ? { start, end } : null, menus };
}

/** Something only the user can fix — plain words, what to do, and whether it stops publishing. */
export type PageIssue = { id: string; kind: "image-description" | "button-words" | "link-words" | "heading-jump" | "picture-missing" | "words-too-tight" | "words-at-edge" | "font-letters" | "link-page-gone"; blocks: boolean; message: string; fix?: { level?: number; sideSpace?: number; font?: string } };

/** The site's heading + body fonts (CSS stacks) — what a block draws in when nothing above it sets a font. */
export type SiteFonts = { heading: string; body: string };

/** A-1b (3): a font that draws `text` whole — of the same kind as `stack` (a serif for a serif) when one exists. */
function fontThatWrites(text: string, stack: string): string | undefined {
  const kind = FONT_FAMILIES.find((f) => f.name === familyOf(stack))?.category;
  const ok = FONT_FAMILIES.filter((f) => !missingLetters(text, f.stack).length);
  return (ok.find((f) => f.category === kind) ?? ok[0])?.stack;
}

/** The narrowest screen of each kind, in rem — what a row set for that screen has to fit (G3b-11). 360px is the low-cost phone (RULE AF). */
const rungOf = (bp: Breakpoint): RungName => (bp === "base" ? "desktop" : bp);
const NARROWEST_REM = (bp: Breakpoint) => (bp === "phone" ? NARROWEST_PHONE_PX : RUNG_PX[rungOf(bp)]) / 16; // config/layout.json (RULE CFG)
const SCREEN_WORDS = (bp: Breakpoint) => RUNG_WORDS[rungOf(bp)];

/** C1: the Page check — ONLY what needs a person. Everything else was corrected by `resolvePage`. */
/**
 * WORDS AT THE PAGE'S EDGE (E-6, the user 2026-10-15: no space unless you add it — and the deck's whitespace rule says words never
 * touch the edge). On a page made now with no side space set, the first block whose words sit at the left or right edge of the
 * page: nothing between them and it — no padding or margin on the way down, and the block is the first / last of its row. A page
 * saved before keeps its space by default and is never asked. ponytail: inner spacing only — a block's own colour is not checked.
 */
/** The side space "Add space at the sides" sets, in the fluid unit: 23 is ≥ 1 rem on a 360 phone (the audit's floor), ≈ 2 rem wide. */
export const EDGE_SPACE = 23;
export function wordsAtEdge(root: BoxNode): string | null {
  if (!root.pageGrid || !isBare(root) || root.gridSpace?.gutter) return null;
  const side = (n: BoxNode, k: "Left" | "Right") => (n[`padding${k}`] ?? n.padding ?? 0) + (n[`margin${k}`] ?? n.margin ?? 0);
  // does a word sit `k` of this block with no space on the way down to it?
  const touches = (n: BoxNode, k: "Left" | "Right"): boolean => {
    if (n.hidden || side(n, k) > 0) return false;
    if (hasText(n)) return true;
    const kids = (n.children ?? []).filter((c) => !c.hidden);
    if (!kids.length) return false;
    // across a row only its first / last block reaches that side; down a stack every block does
    const across = n.layout === "grid" || (n.direction ?? "column") === "row";
    return across ? touches(k === "Left" ? kids[0] : kids[kids.length - 1], k) : kids.some((c) => touches(c, k));
  };
  for (const band of root.children ?? []) {
    if (band.hidden) continue;
    const blocks = band.rowBand ? (band.children ?? []).filter((c) => !c.hidden) : [band];
    if (!blocks.length) continue;
    if (touches(blocks[0], "Left")) return blocks[0].id;
    if (touches(blocks[blocks.length - 1], "Right")) return blocks[blocks.length - 1].id;
  }
  return null;
}

/** `pages`: the site's page ids — a link to one not among them was deleted (LE8-3). */
export function pageCheck(root: BoxNode, sem: PageSemantics = resolvePage(root), fonts?: SiteFonts, pages?: ReadonlySet<string>): PageIssue[] {
  const out: PageIssue[] = [];
  let lastLevel = 0;
  // `font`: the nearest font set above — a block's own font sets its headings and words alike, as the canvas draws it
  const visit = (n: BoxNode, font?: string) => {
    for (const c of n.children ?? []) {
      if (c.hidden) continue;
      const own = c.fontFamily ?? font;
      // A-1b (3): words whose letters the font they are drawn in does not have (another font fills them in, mid-word)
      if (fonts && hasText(c)) {
        const words = (c.text ?? "").replace(/<[^>]*>/g, ""), drawn = own ?? (c.type === "heading" ? fonts.heading : fonts.body);
        const lacks = missingLetters(words, drawn);
        if (lacks.length) {
          const better = fontThatWrites(words, drawn);
          out.push({ id: c.id, kind: "font-letters", blocks: false, fix: better ? { font: better } : undefined,
            message: `${familyOf(drawn)} has no ${lacks.join(" ")}, so ${lacks.length > 1 ? "those letters are" : "that letter is"} drawn in another font in the middle of these words.${better ? ` ${familyOf(better)} has them.` : ""}` });
        }
      }
      // G3b-12 (the user 2026-10-04): an empty picture keeps its place as a soft box on the page — so say it is still missing
      if (c.type === "image" && !c.src)
        out.push({ id: c.id, kind: "picture-missing", blocks: false, message: "This picture has no image yet — visitors see an empty box. Upload one, or delete the block." });
      if (c.type === "image" && c.src && c.alt === undefined)
        out.push({ id: c.id, kind: "image-description", blocks: true, message: "Describe this picture for people who can't see it — or mark it as only decoration." });
      if (c.type === "link" && !hasText(c))
        out.push({ id: c.id, kind: "link-words", blocks: true, message: "This link has no words, so nobody knows where it goes. Add words to it." });
      if (pages && (c.type === "link" || c.type === "button") && c.href?.startsWith("page:") && !pages.has(c.href.slice(5))) // LE8-3: published as a dead "#"
        out.push({ id: c.id, kind: "link-page-gone", blocks: true, message: PAGE_CHECK.pageGone.replace("{block}", c.type) });
      if (c.type === "button" && !hasText(c))
        out.push({ id: c.id, kind: "button-words", blocks: true, message: "This button has no words, so nobody knows what it does. Add words to it." });
      const r = sem.byId.get(c.id);
      if (c.type === "heading" && r?.level && !r.omit) {
        // Only a level the USER set can jump — automatic levels never do.
        if (typeof c.level === "number" && lastLevel && r.level > lastLevel + 1)
          out.push({ id: c.id, kind: "heading-jump", blocks: false, message: `This heading jumps from level ${lastLevel} to ${r.level}. Make it level ${lastLevel + 1}.`, fix: { level: lastLevel + 1 } });
        lastLevel = r.level;
      }
      visit(c, own);
    }
  };
  visit(root, root.fontFamily);
  const edge = wordsAtEdge(root);
  if (edge) out.push({ id: edge, kind: "words-at-edge", blocks: false, message: "Words on this page touch its left or right edge, which makes them hard to read — on a phone most of all. Add space at the sides; you can change it any time in Layout guides.", fix: { sideSpace: EDGE_SPACE } });
  // G3b-11 (the user 2026-10-04: "your setting wins"): a row of the page set by hand for a screen is drawn as set there, so say when
  // a WORD would not fit its block on the narrowest such screen — the longest word at the type size it has there, against the room
  // its share leaves after its part of the side space and gaps (G3b-13: not the fit rule's 14 rem readable floor, which breaks no word).
  for (const band of root.children ?? []) {
    if (!isPageRow(band)) continue;
    const kids = band.children ?? [];
    for (const bp of BP_ORDER) {
      if (bp === "base" || !kids.some((k) => { const r = resolveResponsive(k, bp); return r.width !== k.width || r.marginLeftPct !== k.marginLeftPct; })) continue;
      const W = NARROWEST_REM(bp), { loRem, hiRem, remHalf, cqwHalf } = baseUnitParts(), unit = Math.min(hiRem, Math.max(loRem, remHalf + (cqwHalf * W) / 100));
      const cells = pageRowCells(band, bp), give = (rowSide(band, "left", bp) + rowSide(band, "right", bp) + bandGutter(band)) / 10 * unit; // a block's part, at most
      const tight = kids.some((k) => { const c = cells.get(k.id); const share = c ? c.span / pageRowTracks(band) : 1; return (longestWordRem(k) / hiRem) * unit > share * W - give; });
      if (tight) out.push({ id: kids[0].id, kind: "words-too-tight", blocks: false, message: `On ${SCREEN_WORDS(bp)} these blocks sit side by side as you set them, but their words need more room than the narrowest of those screens has — some may break. Give them more room there, or put that screen back to its default.` });
    }
  }
  return out;
}

/** Everything `resolvePage` fixed for the user — shown in the Page check as "fixed for you", so nothing is a mystery. */
export function corrections(sem: PageSemantics): { id: string; message: string }[] {
  return [...sem.byId.entries()].filter(([, r]) => r.corrected).map(([id, r]) => ({ id: id.startsWith(MENU_KEY) ? id.slice(MENU_KEY.length) : id, message: r.corrected! })); // an automatic menu shows its first link
}
