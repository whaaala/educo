/**
 * INTERACTIONS — Round 1a: HOVER & FOCUS, for every block and every component (existing and future).
 *
 * Why this exists at all: "Advanced CSS" lets a user write declarations, but the sanitiser correctly refuses
 * SELECTORS — so there was no supported way to style a hover anywhere in the builder. Every site wants one.
 *
 * Why it is a short list of NAMED effects rather than a free-form state editor (decision, 2026-09-05): the users
 * are teachers and admins, named effects cannot be put into an invalid state, and — the stronger argument — a
 * fixed list is something the browser invariants can assert EVERY member of. An open editor makes coverage
 * sampling, which is how the dead container queries and the unreachable component path survived.
 *
 * Pure CSS: nothing is added to the exported page, and the canvas renders the same rules, so hovering in the
 * builder shows exactly what a visitor gets.
 *
 * ACCESSIBILITY is built in rather than bolted on:
 *   • Every effect applies to `:focus-visible` as well as `:hover`, so a keyboard user gets the same affordance
 *     on anything focusable, and to `:has(:focus-visible)` so a card lights up when the button inside it is
 *     focused. Decorative boxes are deliberately NOT made tabbable — a wall of tabbable divs is worse than no
 *     focus style.
 *   • `prefers-reduced-motion` removes the movement while keeping the non-moving part of the feedback, so the
 *     effect still communicates "this is interactive" to someone who cannot tolerate motion.
 *   • A hover look applies only where a pointer can hover (`@media (hover:hover)`), and every effect answers a
 *     press (`:active`) — RX4-2, RX4-3.
 */

import { DURATION, EASING, SHADOW_SCALE } from "@/lib/educo-ui/tokens";

export type HoverEffect = {
  id: string;
  label: string;
  /** What the block looks like while hovered or focused. */
  decls: string;
  /** Properties to transition — omitted for effects that do not move. */
  transition?: string;
  /** True when the effect moves the block, so reduced-motion has something to strip. */
  moves?: boolean;
  /** What it looks like while PRESSED (`:active`) — transform only. Omitted → the shared small dip. */
  press?: string;
};

/** A token's fallback IS the token (RX4-7): one value, read from the token module, never a second copy here. */
const EASE = `var(--eu-dur-base, ${DURATION.base}) var(--eu-ease-standard, ${EASING.standard})`;

/**
 * THE PRESS (RX4-3): every effect answers a finger or a mouse-down with a small dip, so a block that reacts to a
 * hover also reacts to being pressed. Transform only — it never moves the layout — and stripped by reduced motion.
 */
const PRESS = "transform:scale(.98)";

/**
 * The catalogue. Colours come from tokens so an effect re-themes with the site and keeps its contrast in all
 * four themes; nothing here hardcodes a hex.
 */
export const HOVER_EFFECTS: HoverEffect[] = [
  { id: "", label: "None", decls: "" },
  { id: "lift", label: "Lift", moves: true, transition: `transform ${EASE}, box-shadow ${EASE}`,
    decls: "transform:translateY(-0.25rem);box-shadow:0 0.75rem 1.5rem -0.75rem rgba(0,0,0,.32)" },
  { id: "grow", label: "Grow", moves: true, transition: `transform ${EASE}`,
    decls: "transform:scale(1.03)" },
  // A PRESS, not a hover look (RX4-3): nothing happens until the block is pressed, then it sinks in.
  { id: "press", label: "Press", moves: true, transition: `transform ${EASE}`,
    decls: "", press: "transform:translateY(0.125rem) scale(.97)" },
  { id: "glow", label: "Glow", transition: `box-shadow ${EASE}`,
    decls: "box-shadow:0 0 0 0.25rem color-mix(in oklab, var(--eu-color-brand) 32%, transparent)" },
  { id: "outline", label: "Outline", transition: `outline-color ${EASE}`,
    decls: "outline:0.125rem solid var(--eu-color-brand);outline-offset:0.125rem" },
  { id: "brighten", label: "Brighten", transition: `filter ${EASE}`,
    decls: "filter:brightness(1.06) saturate(1.05)" },
  { id: "soften", label: "Soften", transition: `opacity ${EASE}`,
    decls: "opacity:.82" },
];

/**
 * Every hover declaration is `!important`, and it has to be.
 *
 * On the CANVAS a block's resting style is applied INLINE, and an inline style beats any stylesheet rule — so
 * a hover that overrides a property the block already sets inline silently did nothing. Measured: "Lift" worked
 * (nothing sets `transform` inline) while "Glow" did not, because the card sets `box-shadow` inline for its
 * resting shadow. The export, which emits classes rather than inline styles, was fine — so this was another
 * canvas ≠ export break, invisible until the effect was hovered in a real browser.
 *
 * It is also semantically right: a hover state is meant to override the resting look, not negotiate with it.
 */
function important(decls: string): string {
  return decls
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (d.includes("!important") ? d : `${d} !important`))
    .join(";");
}

export function hoverEffect(id?: string): HoverEffect | undefined {
  return id ? HOVER_EFFECTS.find((e) => e.id === id) : undefined;
}

/** Does this block have a hover effect to emit? ("" and undefined both mean none.) */
export function hasHover(hoverEffectId?: string): boolean {
  return !!hoverEffect(hoverEffectId);
}

/**
 * The CSS for one block's hover/focus effect, scoped to `scope` (a `[data-box-id]` selector on the canvas, a
 * `.bx-…` class in the export — the SAME function for both, so the builder cannot drift from the published page).
 *
 * Returns "" when there is no effect, so a page with no interactions ships not a single extra byte.
 */
/**
 * A box-shadow (one or more layers) as the same `drop-shadow()` filters. A drop-shadow has no spread: a spread-only ring
 * (Glow: `0 0 0 0.25rem`) becomes that much blur, any other spread is left out.
 */
export function dropShadows(shadow: string): string {
  return splitTop(shadow, ",").map((layer) => {
    const t = splitTop(layer.trim(), " ").filter(Boolean);
    const lens = t.filter((x) => /^-?[\d.]+(rem|em|px)?$/.test(x)), colour = t.filter((x) => !lens.includes(x)).join(" ");
    const [x = "0", y = "0", blur = "0", spread] = lens;
    const b = parseFloat(blur) === 0 && spread && parseFloat(spread) > 0 ? spread : blur;
    return `drop-shadow(${x} ${y} ${b} ${colour})`;
  }).join(" ");
}

/** Split on `sep` outside parentheses, at any depth — `color-mix(in oklab, var(--x) 32%, transparent)` stays whole. */
function splitTop(s: string, sep: string): string[] {
  const out: string[] = []; let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++; else if (ch === ")") depth--;
    if (depth === 0 && (sep === " " ? /\s/.test(ch) : ch === sep)) { out.push(cur); cur = ""; } else cur += ch;
  }
  return [...out, cur];
}

/**
 * The resting filter of a SHAPED band with a shadow (RX4-8) — its shadow as drop-shadows, because a clip would cut a
 * box-shadow away — or undefined for every other block. One answer, read by `bandEdgeCSS` (box-model) and by the hover
 * below, so a hover composes with it instead of overwriting it (RX4-22).
 */
export function shapeShadowFilter(n: { shadow?: keyof typeof SHADOW_SCALE; edgeTop?: string; edgeBottom?: string }): string | undefined {
  return n.shadow && (n.edgeTop || n.edgeBottom) ? dropShadows(SHADOW_SCALE[n.shadow]) : undefined;
}

/**
 * A hover look ON a shaped band (RX4-22): its box-shadow would be a rectangle and its filter would REPLACE the shape's
 * drop-shadow. So both go into ONE filter after the resting drop-shadows — the shadow as one more drop-shadow, a
 * brightness after them — and a transition of either becomes a transition of `filter`.
 */
function onShape(decls: string, rest: string): string {
  let add = "";
  const kept = decls.split(";").map((d) => d.trim()).filter(Boolean).filter((d) => {
    const i = d.indexOf(":"), p = d.slice(0, i).trim(), v = d.slice(i + 1).trim();
    if (p === "box-shadow") { add += ` ${dropShadows(v)}`; return false; }
    if (p === "filter") { add += ` ${v}`; return false; }
    return true;
  });
  return add ? [...kept, `filter:${rest}${add}`].join(";") : decls;
}

export function hoverCss(scope: string, hoverEffectId?: string, shapeFilter?: string): string {
  const base0 = hoverEffect(hoverEffectId);
  if (!base0 || !base0.id) return "";
  const fx: HoverEffect = shapeFilter
    ? { ...base0, decls: onShape(base0.decls, shapeFilter), transition: base0.transition?.replace(/\bbox-shadow\b/g, "filter") }
    : base0;

  // `:has(:focus-visible)` lets a card respond when the button inside it takes keyboard focus. Browsers that
  // do not support `:has` simply skip that selector — the hover and focus rules are separate, so nothing else
  // in the list is lost. (An invalid selector would otherwise void the whole rule, hence three rules, not one.)
  const focus = [`${scope}:focus-visible`, `${scope}:has(:focus-visible)`];
  const states = [`${scope}:hover`, ...focus, `${scope}:active`];
  // The press moves by transform, so every effect transitions transform too — or the dip would snap.
  const transition = [fx.transition, fx.transition?.includes("transform") ? "" : `transform ${EASE}`].filter(Boolean).join(", ");
  const base = `${scope}{transition:${transition}}`;
  // RX4-2: the HOVER look only where a pointer can hover. On a touch screen a tap sets :hover and leaves it set,
  // so a tapped Lift card stayed lifted after the finger had gone. Keyboard focus is not a hover: ungated.
  const on = fx.decls
    ? `@media (hover:hover){${scope}:hover{${important(fx.decls)}}}${focus.map((s) => `${s}{${important(fx.decls)}}`).join("")}`
    : "";
  // RX4-3: the press, LAST, so pressing a hovered or focused block still dips (same specificity, later wins).
  const press = `${scope}:active{${important(fx.press ?? PRESS)}}`;

  // Reduced motion strips the MOVEMENT, not the feedback: a lift keeps its shadow, a grow simply stops growing,
  // and no effect dips when pressed.
  const calmed = `@media (prefers-reduced-motion:reduce){${fx.moves ? `${scope}{transition:none !important}` : ""}${states.map((s) => `${s}{transform:none !important}`).join("")}}`;

  return `${base}${on}${press}${calmed}`;
}

// ── Round 1b: ENTRANCE & SCROLL-INTO-VIEW ─────────────────────────────────────────────────────────

/**
 * A block can arrive rather than simply be there. Same shape as the hover effects — a named list, on a field of
 * the node — so every block and component, existing and future, gets it by existing.
 *
 * THE SAFETY PROPERTY THAT MATTERS: the animation runs FROM hidden TO the block's natural look, and the resting
 * style IS the natural look. So if the animation never runs — an old browser, a blocked stylesheet, a printer,
 * a reader with reduced motion — the content is simply there. A reveal that hides content and relies on
 * something running to bring it back is how pages end up permanently blank; this cannot do that.
 */
export type RevealEffect = {
  id: string;
  label: string;
  /** The state it animates FROM. The state it animates TO is always the block's own look. */
  from: string;
  /** True when it moves, so reduced motion has something to strip. */
  moves?: boolean;
};

export const REVEAL_EFFECTS: RevealEffect[] = [
  { id: "", label: "None", from: "" },
  { id: "fade", label: "Fade in", from: "opacity:0" },
  { id: "rise", label: "Rise up", from: "opacity:0;transform:translateY(1.5rem)", moves: true },
  { id: "drop", label: "Drop down", from: "opacity:0;transform:translateY(-1.5rem)", moves: true },
  { id: "from-left", label: "From the left", from: "opacity:0;transform:translateX(-1.5rem)", moves: true },
  { id: "from-right", label: "From the right", from: "opacity:0;transform:translateX(1.5rem)", moves: true },
  { id: "zoom", label: "Zoom in", from: "opacity:0;transform:scale(.94)", moves: true },
  { id: "sharpen", label: "Sharpen", from: "opacity:0;filter:blur(0.5rem)" },
];

export function revealEffect(id?: string): RevealEffect | undefined {
  return id ? REVEAL_EFFECTS.find((e) => e.id === id) : undefined;
}

/** `@keyframes` are GLOBAL, so they are emitted once per page for the effects actually used — never per block. */
export function revealKeyframes(ids: Iterable<string>): string {
  const seen = new Set<string>();
  let out = "";
  for (const id of ids) {
    const fx = revealEffect(id);
    if (!fx || !fx.from || seen.has(fx.id)) continue;
    seen.add(fx.id);
    out += `@keyframes eu-reveal-${fx.id}{from{${fx.from}}}`;
  }
  return out;
}

export type RevealNode = { revealEffect?: string; revealScroll?: boolean; revealStagger?: boolean };

export type RevealOpts = {
  /** What "arrive one after another" should stagger, when it is NOT the scope's direct children — a
   *  component passes its item selector (`.eu-accordion__item`, `.eu-alert`). */
  staggerSelector?: string;
};

/**
 * The effects one ITEM inside a component can carry.
 *
 * RULE A — a capability built for one thing is the baseline for everything it can apply to. Hover and
 * entrance shipped for every BLOCK; an accordion row or an alert message could not have either, so a list of
 * five announcements had to arrive and react as one lump. The emitters below are the same ones blocks use, so
 * an effect cannot look different depending on what carries it.
 */
export type ItemEffects = { hoverEffect?: string; revealEffect?: string; revealScroll?: boolean };

/** Does this item carry any effect? Used to decide whether it needs its own class in the markup. */
export function hasItemEffects(it: ItemEffects): boolean {
  return !!(hasHover(it.hoverEffect) || revealEffect(it.revealEffect));
}

/**
 * One item's hover + entrance rules, at the item's own scope.
 *
 * Deliberately the SAME `hoverCss` / `revealCss` a block uses: an item's Lift has to be the block's Lift, and
 * routing both through one emitter is what makes that true rather than hoped for. Entrances never stagger
 * here — an item is one thing, and its own children are its title and body, which should not arrive
 * separately from each other.
 */
export function itemEffectsCss(scope: string, it: ItemEffects): string {
  return hoverCss(scope, it.hoverEffect)
    + revealCss(scope, { revealEffect: it.revealEffect, revealScroll: it.revealScroll });
}

/**
 * One block's entrance.
 *
 * `revealScroll` plays it ONCE when the block comes into view: the entrance is held by a class the shared
 * `revealOnceScript` adds and removes (RX4-1) — without the script it simply plays on load, never left hidden.
 * STAGGER applies the effect to the container's direct CHILDREN, each a beat later, which is what
 * people actually mean by it: a row of cards arriving one after another.
 */
/**
 * The entrance's timing, named once because a SECOND emitter needs it: a block can carry an entrance AND a
 * pinned arrival, and the two write the same animation properties on the same element — so whichever rule
 * the sheet wrote last silently took the block over. Measured in a browser: with both chosen, the only
 * animation running was the arrival. `pinArrivalCss` now declares both in one rule, reading these rather
 * than keeping a second copy that could drift out of step with the entrance it is naming.
 */
export const REVEAL_DUR = `var(--eu-dur-slow, ${DURATION.slow})`; // 320ms — the token, not a second copy (RX4-7)
export const REVEAL_EASE = `var(--eu-ease-standard, ${EASING.standard})`;
/** The class the shared script puts on a scroll entrance while it waits to come into view (RX4-1). Also read by
 *  `pinArrivalCss` (box-model.ts), whose entrance on a PINNED block waits behind the same gate (RX4-19). */
export const REVEAL_WAIT = "eu-wait";
const WAIT = REVEAL_WAIT;

/**
 * PLAY ONCE AS IT ENTERS (RX4-1). A scroll-driven `view()` timeline SCRUBS: scrolling back up ran the entrance
 * backwards (measured: opacity .99 → 0). There is no CSS that latches "has been seen", so a tiny shared script
 * does it: it reads the page's own `X.eu-wait` rules (so no selector list has to be plumbed through), puts the
 * class on each matching element — which pauses its entrance at the start — and takes it off, once, as the
 * element comes into view. One guarded `window.__euReveal` per page, shipped only when a scroll entrance exists.
 *
 * Nothing can be left hidden: no script, no IntersectionObserver, or a sheet that cannot be read → no class is
 * ever added, and the entrance simply plays on load. Reduced motion → `animation:none`, the block is there.
 */
export function revealOnceScript(): string {
  return `<script>(function(){if(window.__euReveal)return;window.__euReveal=1;var wire=${String(revealOnceWire)};wire(document,'${WAIT}');})();<\/script>`;
}

/**
 * THE GATE ITSELF, as a real function: the page ships its source (`revealOnceScript`) and the CANVAS calls it (RX4-17) —
 * one implementation, so a scroll entrance waits in the editor exactly as it does on the page. Self-contained (its source
 * is shipped), so the class comes in as an argument. Returns the disconnect, for the canvas to call as its tree changes.
 */
export function revealOnceWire(doc: Document, cls: string): () => void {
  if (typeof IntersectionObserver === "undefined") return function () {};
  const io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove(cls); io.unobserve(e.target); } });
  });
  const tail = new RegExp("\\." + cls + "$");
  const scan = function (rs: CSSRuleList) {
    for (let i = 0; i < rs.length; i++) {
      const r = rs[i] as CSSStyleRule & { cssRules?: CSSRuleList };
      if (r.cssRules && !r.selectorText) { scan(r.cssRules); continue; }
      let s = r.selectorText || "";
      if (!tail.test(s)) continue;
      s = s.replace(tail, "");
      if (/[\s>+~]$/.test(s)) s += "*";
      try { doc.querySelectorAll(s).forEach(function (el) { el.classList.add(cls); io.observe(el); }); } catch { /* a selector this browser cannot read */ }
    }
  };
  for (let i = 0; i < doc.styleSheets.length; i++) { try { scan(doc.styleSheets[i].cssRules); } catch { /* a sheet it may not read */ } }
  return function () { io.disconnect(); };
}

/** Does anything on this page — a block or one of its items — play its entrance on scroll? */
export function scrollRevealNeeded(n: { revealEffect?: string; revealScroll?: boolean; items?: ItemEffects[]; children?: unknown[] }): boolean {
  const on = (x: { revealEffect?: string; revealScroll?: boolean }) => !!(x.revealScroll && revealEffect(x.revealEffect)?.from);
  return on(n) || (n.items ?? []).some(on) || ((n.children ?? []) as typeof n[]).some(scrollRevealNeeded);
}

export function revealCss(scope: string, node: RevealNode, opts: RevealOpts = {}): string {
  const fx = revealEffect(node.revealEffect);
  if (!fx || !fx.from) return "";

  // WHAT STAGGER ACTUALLY STAGGERS.
  //
  // `> *` is right for a plain container, whose children are the boxes on the page. It is WRONG for a
  // COMPONENT: an accordion's block wrapper contains a <style> tag and one `.eu-accordion` div, so "arrive one
  // after another" animated the whole component as a single block and gave the invisible <style> the first
  // beat. The items — the things a person means when they tick that box — never staggered at all.
  //
  // So a component passes its own item selector and the delays land on the items.
  const staggerScope = opts.staggerSelector ? `${scope} ${opts.staggerSelector}` : `${scope} > *`;
  const target = node.revealStagger ? staggerScope : scope;
  const dur = REVEAL_DUR;
  const ease = REVEAL_EASE;
  let css = `${target}{animation:eu-reveal-${fx.id} ${dur} ${ease} both}`;

  if (node.revealStagger) {
    // A beat per item. Ten is plenty — past that the last one would arrive uncomfortably late anyway.
    // `nth-child` counts every sibling, so an accordion with category headings between its items simply
    // skips a beat or two; the arrival order is still first-to-last, which is the point.
    for (let i = 2; i <= 10; i++) css += `${staggerScope}:nth-child(${i}){animation-delay:${(i - 1) * 90}ms}`;
  }

  if (node.revealScroll) {
    // Held at its start while the shared script says it is out of view; released once (RX4-1, revealOnceScript).
    // The extra class out-ranks the `animation` shorthand above, which would otherwise reset the play state.
    css += `${target}.${WAIT}{animation-play-state:paused}`;
  }

  // Reduced motion: no entrance at all. The block is simply present — which is the resting style anyway.
  css += `@media (prefers-reduced-motion:reduce){${target}{animation:none !important}}`;
  return css;
}

/** Every reveal rule in a tree, plus one copy of each keyframes it needs. */
type RevealTree = RevealNode & { id: string; component?: string; items?: ItemEffects[]; children?: RevealTree[] };

export function treeRevealCss(
  node: RevealTree,
  scopeFor: (id: string) => string,
  /** What a COMPONENT node should stagger, given its component name — the canvas passes its item-selector map
   *  so the builder staggers the same things the exported page does. */
  staggerSelectorFor?: (n: RevealTree) => string | undefined,
): string {
  const used = new Set<string>();
  const walk = (n: RevealTree): string => {
    if (n.revealEffect) used.add(n.revealEffect);
    const self = revealCss(scopeFor(n.id), n, { staggerSelector: staggerSelectorFor?.(n) });
    // An ITEM's own entrance counts towards the keyframes this page needs, or the animation names nothing.
    for (const it of n.items ?? []) if (it.revealEffect) used.add(it.revealEffect);
    const kids = (n.children ?? []).map(walk).join("");
    return self + kids;
  };
  const rules = walk(node);
  return rules ? revealKeyframes(used) + rules : "";
}

/** Every hover rule in a tree, for the one stylesheet the canvas injects. `scopeFor` maps a node id to a selector. */
export function treeHoverCss(
  node: { id: string; hoverEffect?: string; children?: { id: string }[] } & Parameters<typeof shapeShadowFilter>[0],
  scopeFor: (id: string) => string,
): string {
  const self = hoverCss(scopeFor(node.id), node.hoverEffect, shapeShadowFilter(node)); // RX4-22
  const kids = ((node.children ?? []) as typeof node[]).map((c) => treeHoverCss(c, scopeFor)).join("");
  return self + kids;
}
