/**
 * SPACE THE PAGE CHECK MEASURES (LE-1, BATCH S-3) — on the PUBLISHED page, at every screen size, the way the sweep's
 * `scripts/uat/page-audit.js` measures W7a / W7b, so the person building is told while they build:
 *  - words closer than 1rem to the page's edge (W7a) · words touching the edge of their coloured box, under ¼rem (W7a)
 *  - two sections, one under another, whose words are closer than 1rem (W7b)
 *  - a column too narrow for its words — a word drawn broken across two lines (S-3 (2), the user 2026-10-01)
 * Floors in rem, so they grow with the reader's text size like the space they measure. Pinned (fixed / sticky / absolute)
 * words and the skip link are left out, as the audit does. Behaviours: tests/features/components/website/box-builder-spacing.feature
 */
import LAYOUT from "../config/layout.json";
import PAGE_CHECK from "../config/page-check.json";
import { type BoxNode, isContainer, blockedByLabel } from "./box-model";
import { NARROWEST_PHONE_PX, RUNG_PX, RUNG_WORDS, type RungName } from "./educo-ui/layout";

/** The window height each width is measured at — the one the UAT uses for a rung (config/layout.json `uat.edgeHeight`). */
export const CHECK_HEIGHT: number = LAYOUT.uat.edgeHeight;

export type SpaceKind = "words-near-edge" | "words-touch-box" | "sections-close" | "words-broken";
export type SpaceHit = { id: string; kind: SpaceKind };

/** The widths measured: the narrowest phone a row must fit (RULE AF), then the first px of each wider rung — config/layout.json. */
export const CHECK_WIDTHS: { rung: RungName; px: number }[] = (Object.keys(RUNG_PX) as RungName[])
  .map((rung) => ({ rung, px: rung === "phone" ? NARROWEST_PHONE_PX : RUNG_PX[rung] }));

/** "phones and tablets held upright" — the screens a hit was measured on, in the words the Page check uses. */
export const screensInWords = (rungs: RungName[]): string => {
  const w = rungs.map((r) => RUNG_WORDS[r]);
  return w.length < 2 ? w.join("") : `${w.slice(0, -1).join(", ")} and ${w[w.length - 1]}`;
};

/**
 * What to call a measured block in a sentence: a component by its name, a container as the panel calls it, an element by its
 * kind ("Text"). A page band is a SECTION — LE1-5: it is a row underneath, and the check called it "this Side by side".
 */
export const spaceName = (n: BoxNode | null): string => {
  const kind = !n ? "block" : n.rowBand ? "section" : n.type === "component" || isContainer(n) ? blockedByLabel(n) ?? "block" : n.type.charAt(0).toUpperCase() + n.type.slice(1);
  // LE1-7: its first words, so four Headings too narrow are four different lines (config/page-check.json)
  // a block with no words of its own (a section, a Stack) is quoted by the first words inside it
  const firstText = (x: BoxNode | null | undefined): string => (!x ? "" : x.text?.trim() ? x.text : (x.children ?? []).map(firstText).find(Boolean) ?? "");
  const words = firstText(n).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean);
  return words.length ? `${kind} (“${words.slice(0, QUOTE_WORDS).join(" ")}${words.length > QUOTE_WORDS ? "…" : ""}”)` : kind;
};
const QUOTE_WORDS: number = PAGE_CHECK.quoteWords;

/** Every hit on the page as it is laid out NOW (the document's own width). One per block and kind. */
export function measureSpace(doc: Document): SpaceHit[] {
  const win = doc.defaultView;
  if (!win || !doc.body) return [];
  const cs = (e: Element) => win.getComputedStyle(e);
  const W = doc.documentElement.clientWidth;
  const rem = parseFloat(cs(doc.documentElement).fontSize) || 16;
  const blockOf = (e: Element | null) => e?.closest('[class*="bx-"]') ?? null;
  const idOf = (b: Element | null) => (b ? Array.from(b.classList).find((c) => c.startsWith("bx-"))?.slice(3) ?? "" : "");
  const pinned = (e: Element) => { for (let x: Element | null = e; x && x !== doc.body; x = x.parentElement) if (["absolute", "fixed", "sticky"].includes(cs(x).position)) return true; return false; };
  const seeThrough = (c: string) => c === "transparent" || /^rgba\(.*,\s*0\)$/.test(c) || /\/\s*0\)$/.test(c);
  const edged = (e: Element) => { const s = cs(e); return s.backgroundImage !== "none" || !seeThrough(s.backgroundColor) || ["top", "right", "bottom", "left"].some((k) => parseFloat(s.getPropertyValue(`border-${k}-width`)) > 0); };

  const runs: { e: Element; t: Text; r: DOMRect }[] = [];
  const tw = doc.createTreeWalker(doc.body, 4 /* NodeFilter.SHOW_TEXT */);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const t = n as Text, e = t.parentElement;
    if (!t.textContent?.trim() || !e || !e.checkVisibility() || e.closest(".eu-skip") || pinned(e)) continue;
    const rg = doc.createRange(); rg.selectNodeContents(t);
    const r = rg.getBoundingClientRect();
    if (r.width > 0) runs.push({ e, t, r });
  }
  const hits = new Map<string, SpaceHit>();
  const hit = (b: Element | null, kind: SpaceKind) => { const id = idOf(b); if (id) hits.set(`${id}|${kind}`, { id, kind }); };

  for (const { e, t, r } of runs) {
    // what a reader can SEE of the run: cut by every box that clips its overflow (a pager's waiting slide is cut to nothing)
    let cl = Math.max(r.left, 0), cr = Math.min(r.right, W);
    for (let a = e.parentElement; a && a !== doc.body && cl < cr; a = a.parentElement) if (cs(a).overflowX !== "visible") { const b = a.getBoundingClientRect(); cl = Math.max(cl, b.left); cr = Math.min(cr, b.right); }
    if (cr - cl < 1) continue;
    if (Math.min(r.left, W - r.right) < rem - 0.5) hit(blockOf(e), "words-near-edge");
    let box: Element | null = e;
    while (box && box !== doc.body && !edged(box)) box = box.parentElement;
    if (box && box !== doc.body) {
      const b = box.getBoundingClientRect();
      if (Math.min(r.left - b.left, b.right - r.right, r.top - b.top, b.bottom - r.bottom) < rem / 4 - 0.5) hit(blockOf(e), "words-touch-box");
    }
    // too narrow for its words: a word drawn on two lines (its rects at two heights), or one that sticks out of its block
    const own = blockOf(e)?.getBoundingClientRect();
    for (const m of (t.textContent ?? "").matchAll(/\S{2,}/g)) {
      const w = doc.createRange(); w.setStart(t, m.index ?? 0); w.setEnd(t, (m.index ?? 0) + m[0].length);
      const rs = Array.from(w.getClientRects()).filter((q) => q.width > 0);
      if (new Set(rs.map((q) => Math.round(q.top))).size > 1 || (own && rs.some((q) => q.right > own.right + 0.5 || q.left < own.left - 0.5))) { hit(blockOf(e), "words-broken"); break; }
    }
  }

  // sections: the page's own blocks one under another — their WORDS are measured, not their boxes (two coloured bands meet edge
  // to edge by design; the space inside them keeps the words apart)
  const pageRoot = Array.from(doc.querySelectorAll('[class*="bx-"]')).find((b) => !b.parentElement?.closest('[class*="bx-"]'));
  if (pageRoot) {
    const secs = Array.from(pageRoot.querySelectorAll('[class*="bx-"]')).filter((s) => s.parentElement?.closest('[class*="bx-"]') === pageRoot && s.checkVisibility() && !pinned(s));
    const wordsOf = (s: Element) => runs.filter((x) => s.contains(x.e)).map((x) => x.r);
    for (let i = 1; i < secs.length; i++) {
      const a = wordsOf(secs[i - 1]), b = wordsOf(secs[i]);
      if (!a.length || !b.length) continue;
      const d = Math.min(...b.map((q) => q.top)) - Math.max(...a.map((q) => q.bottom));
      if (d > -2 && d < rem - 0.5) hit(secs[i - 1], "sections-close"); // side by side (d < 0) is not one under another
    }
  }
  return Array.from(hits.values());
}
