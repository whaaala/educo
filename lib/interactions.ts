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
 */

export type HoverEffect = {
  id: string;
  label: string;
  /** What the block looks like while hovered or focused. */
  decls: string;
  /** Properties to transition — omitted for effects that do not move. */
  transition?: string;
  /** True when the effect moves the block, so reduced-motion has something to strip. */
  moves?: boolean;
};

const EASE = "var(--eu-dur-base, .18s) var(--eu-ease-standard, cubic-bezier(.2,0,0,1))";

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
  { id: "press", label: "Press", moves: true, transition: `transform ${EASE}`,
    decls: "transform:translateY(0.125rem) scale(.995)" },
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
export function hoverCss(scope: string, hoverEffectId?: string): string {
  const fx = hoverEffect(hoverEffectId);
  if (!fx || !fx.decls) return "";

  // `:has(:focus-visible)` lets a card respond when the button inside it takes keyboard focus. Browsers that
  // do not support `:has` simply skip that selector — the hover and focus rules are separate, so nothing else
  // in the list is lost. (An invalid selector would otherwise void the whole rule, hence three rules, not one.)
  const states = [`${scope}:hover`, `${scope}:focus-visible`, `${scope}:has(:focus-visible)`];
  const base = fx.transition ? `${scope}{transition:${fx.transition}}` : "";
  const on = states.map((s) => `${s}{${important(fx.decls)}}`).join("");

  // Reduced motion strips the MOVEMENT, not the feedback: a lift keeps its shadow, a grow simply stops growing.
  const calmed = fx.moves
    ? `@media (prefers-reduced-motion:reduce){${scope}{transition:none !important}${states.map((s) => `${s}{transform:none !important}`).join("")}}`
    : "";

  return `${base}${on}${calmed}`;
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

/**
 * One block's entrance.
 *
 * `revealScroll` plays it when the block comes into view, through a CSS scroll-driven timeline — with an
 * `@supports` guard, so a browser without `animation-timeline` plays the entrance on load instead of showing
 * nothing. STAGGER applies the effect to the container's direct CHILDREN, each a beat later, which is what
 * people actually mean by it: a row of cards arriving one after another.
 */
export function revealCss(scope: string, node: RevealNode): string {
  const fx = revealEffect(node.revealEffect);
  if (!fx || !fx.from) return "";

  const target = node.revealStagger ? `${scope} > *` : scope;
  const dur = "var(--eu-dur-slow, .55s)";
  const ease = "var(--eu-ease-standard, cubic-bezier(.2,0,0,1))";
  let css = `${target}{animation:eu-reveal-${fx.id} ${dur} ${ease} both}`;

  if (node.revealStagger) {
    // A beat per child. Ten is plenty — past that the last one would arrive uncomfortably late anyway.
    for (let i = 2; i <= 10; i++) css += `${scope} > *:nth-child(${i}){animation-delay:${(i - 1) * 90}ms}`;
  }

  if (node.revealScroll) {
    css += `@supports (animation-timeline: view()){${target}{animation-timeline:view();animation-range:entry 0% cover 28%}}`;
  }

  // Reduced motion: no entrance at all. The block is simply present — which is the resting style anyway.
  css += `@media (prefers-reduced-motion:reduce){${target}{animation:none !important}}`;
  return css;
}

/** Every reveal rule in a tree, plus one copy of each keyframes it needs. */
type RevealTree = RevealNode & { id: string; children?: RevealTree[] };

export function treeRevealCss(node: RevealTree, scopeFor: (id: string) => string): string {
  const used = new Set<string>();
  const walk = (n: RevealTree): string => {
    if (n.revealEffect) used.add(n.revealEffect);
    const self = revealCss(scopeFor(n.id), n);
    const kids = (n.children ?? []).map(walk).join("");
    return self + kids;
  };
  const rules = walk(node);
  return rules ? revealKeyframes(used) + rules : "";
}

/** Every hover rule in a tree, for the one stylesheet the canvas injects. `scopeFor` maps a node id to a selector. */
export function treeHoverCss(
  node: { id: string; hoverEffect?: string; children?: { id: string }[] },
  scopeFor: (id: string) => string,
): string {
  const self = hoverCss(scopeFor(node.id), node.hoverEffect);
  const kids = ((node.children ?? []) as typeof node[]).map((c) => treeHoverCss(c, scopeFor)).join("");
  return self + kids;
}
