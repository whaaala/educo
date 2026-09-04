/**
 * Educo UI — component styles (Phase 0.3). Class-based, token-driven styles for the core UI blocks a
 * website builder emits: buttons, cards, inputs/fields, badges, alerts, links, sections. Every value
 * reads from a `--eu-*` token, so switching a theme restyles all of them; scoped under `.eu-root`;
 * states (hover/focus/disabled) use the motion + focus rules from `base.ts`. More components follow.
 */

export const COMPONENT_CSS = `
/* ── Button ────────────────────────────────────────────────────────────────── */
.eu-root .eu-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--eu-space-2);
  /* fluid type — scales gently with the viewport (Responsive Field Guide, ingredient 2), token-bounded */
  font-family: var(--eu-font-body); font-weight: var(--eu-weight-semibold); font-size: clamp(var(--eu-text-xs), 0.7rem + 0.35vw, var(--eu-text-sm));
  line-height: 1; padding: var(--eu-space-3) var(--eu-space-5); border-radius: var(--eu-radius-md);
  border: 1px solid transparent; cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background-color var(--eu-dur-fast) var(--eu-ease-standard), border-color var(--eu-dur-fast) var(--eu-ease-standard), box-shadow var(--eu-dur-fast) var(--eu-ease-standard), transform var(--eu-dur-fast) var(--eu-ease-standard);
}
.eu-root .eu-btn:active { transform: translateY(1px); }
.eu-root .eu-btn:disabled, .eu-root .eu-btn[aria-disabled="true"] { opacity: .55; cursor: not-allowed; transform: none; }
.eu-root .eu-btn--primary   { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
.eu-root .eu-btn--primary:hover:not(:disabled)   { background: var(--eu-color-primary-600); }
.eu-root .eu-btn--secondary { background: var(--eu-color-surface); color: var(--eu-color-text); border-color: var(--eu-color-border); }
.eu-root .eu-btn--secondary:hover:not(:disabled) { background: var(--eu-color-neutral-100); }
.eu-root .eu-btn--outline   { background: transparent; color: var(--eu-color-brand); border-color: var(--eu-color-border); }
.eu-root .eu-btn--outline:hover:not(:disabled)   { border-color: var(--eu-color-brand); background: var(--eu-color-primary-50); }
.eu-root .eu-btn--ghost     { background: transparent; color: var(--eu-color-text); }
.eu-root .eu-btn--ghost:hover:not(:disabled)     { background: var(--eu-color-neutral-100); }
.eu-root .eu-btn--danger    { background: var(--eu-color-danger); color: var(--eu-color-on-brand); }
.eu-root .eu-btn--sm { font-size: var(--eu-text-xs); padding: var(--eu-space-2) var(--eu-space-3); }
.eu-root .eu-btn--lg { font-size: var(--eu-text-base); padding: var(--eu-space-4) var(--eu-space-6); }
.eu-root .eu-btn--block { width: 100%; }

/* ── Card ──────────────────────────────────────────────────────────────────── */
/* container-type + fluid padding: the card tightens its own padding when placed in a narrow column */
.eu-root .eu-card { container-type: inline-size; background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-lg); padding: clamp(var(--eu-space-4), 4cqi, var(--eu-space-6)); box-shadow: var(--eu-shadow-sm); }
.eu-root .eu-card--flat { box-shadow: none; }
.eu-root .eu-card--raised { box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-card__title { font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); font-size: 1.35em; margin-block-end: var(--eu-space-2); }

/* ── Form controls + field ─────────────────────────────────────────────────── */
.eu-root .eu-input, .eu-root .eu-select, .eu-root .eu-textarea {
  width: 100%; font-family: var(--eu-font-body); font-size: var(--eu-text-sm); color: var(--eu-color-text);
  background: var(--eu-color-bg); border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-md);
  padding: var(--eu-space-3) var(--eu-space-4);
  transition: border-color var(--eu-dur-fast) var(--eu-ease-standard), box-shadow var(--eu-dur-fast) var(--eu-ease-standard);
}
.eu-root .eu-input:focus-visible, .eu-root .eu-select:focus-visible, .eu-root .eu-textarea:focus-visible { border-color: var(--eu-color-brand); outline: none; box-shadow: 0 0 0 3px var(--eu-color-primary-100); }
.eu-root .eu-input[aria-invalid="true"] { border-color: var(--eu-color-danger); }
.eu-root .eu-field { display: flex; flex-direction: column; gap: var(--eu-space-2); }
.eu-root .eu-label { font-size: var(--eu-text-sm); font-weight: var(--eu-weight-medium); color: var(--eu-color-text); }
.eu-root .eu-help  { font-size: var(--eu-text-xs); color: var(--eu-color-muted); }
.eu-root .eu-error { font-size: var(--eu-text-xs); color: var(--eu-color-danger); }

/* ── Badge ─────────────────────────────────────────────────────────────────── */
.eu-root .eu-badge { display: inline-flex; align-items: center; gap: var(--eu-space-1); font-size: 0.8em; font-weight: var(--eu-weight-semibold); padding: 0.35em 0.7em; border-radius: var(--eu-radius-full); background: var(--eu-color-neutral-100); color: var(--eu-color-text); }
.eu-root .eu-badge--brand   { background: var(--eu-color-brand);   color: var(--eu-color-on-brand); }
.eu-root .eu-badge--success { background: var(--eu-color-success); color: var(--eu-color-on-brand); }
.eu-root .eu-badge--warning { background: var(--eu-color-warning); color: var(--eu-color-on-brand); }
.eu-root .eu-badge--danger  { background: var(--eu-color-danger);  color: var(--eu-color-on-brand); }
.eu-root .eu-badge--info    { background: var(--eu-color-info);    color: var(--eu-color-on-brand); }

/* ── Card extras (media / body / action) — fluid + token-driven ─────────────── */
.eu-root .eu-card { display: flex; flex-direction: column; gap: clamp(var(--eu-space-2), 2cqi, var(--eu-space-3)); }
.eu-root .eu-card__media { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; border-radius: var(--eu-radius-md); display: block; }
.eu-root .eu-card__body { color: var(--eu-color-muted); font-size: 1em; }
.eu-root .eu-card__action { align-self: flex-start; margin-block-start: var(--eu-space-1); }

/* ── Quote (blockquote) ─────────────────────────────────────────────────────── */
.eu-root .eu-quote { container-type: inline-size; display: flex; flex-direction: column; gap: var(--eu-space-2); margin: 0; }
.eu-root .eu-quote__text { margin: 0; font-family: var(--eu-font-heading); font-style: italic; color: var(--eu-color-text); font-size: 1.6em; line-height: var(--eu-leading-snug); }
.eu-root .eu-quote__author { color: var(--eu-color-muted); font-size: 0.9em; }
.eu-root .eu-quote--bordered { border-inline-start: 4px solid var(--eu-color-brand); padding-inline-start: clamp(var(--eu-space-3), 3cqi, var(--eu-space-5)); }
.eu-root .eu-quote--large .eu-quote__text { font-size: 2.1em; }

/* ── Stat (big number + label) ──────────────────────────────────────────────── */
.eu-root .eu-stat { container-type: inline-size; display: flex; flex-direction: column; gap: var(--eu-space-1); align-items: center; text-align: center; }
.eu-root .eu-stat__value { font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); line-height: 1; color: var(--eu-color-text); font-size: 3.4em; }
.eu-root .eu-stat__label { color: var(--eu-color-muted); font-size: 0.95em; }
.eu-root .eu-stat--brand .eu-stat__value { color: var(--eu-color-brand); }
.eu-root .eu-stat--big .eu-stat__value { font-size: 4.8em; }

/* ── Rating (stars) — inline SVG, currentColor, em-sized ────────────────────── */
.eu-root .eu-rating { display: inline-flex; align-items: center; gap: clamp(0.1em, 1cqi, 0.25em); color: var(--eu-color-neutral-300); }
.eu-root .eu-rating__star { width: 1.3em; height: 1.3em; flex: none; }
.eu-root .eu-rating__star.is-on { color: var(--eu-color-warning); }
.eu-root .eu-rating--brand .eu-rating__star.is-on { color: var(--eu-color-brand); }

/* ── Alert ─────────────────────────────────────────────────────────────────── */
.eu-root .eu-alert { padding: var(--eu-space-4) var(--eu-space-5); border-radius: var(--eu-radius-md); border-left: 4px solid var(--eu-color-info); background: var(--eu-color-surface); color: var(--eu-color-text); }
.eu-root .eu-alert--success { border-inline-start-color: var(--eu-color-success); }
.eu-root .eu-alert--warning { border-inline-start-color: var(--eu-color-warning); }
.eu-root .eu-alert--danger  { border-inline-start-color: var(--eu-color-danger); }

/* ── Link + section ────────────────────────────────────────────────────────── */
.eu-root .eu-link { color: var(--eu-color-brand); text-decoration: underline; text-underline-offset: .15em; }
.eu-root .eu-link:hover { text-decoration-thickness: 2px; }
.eu-root .eu-section { padding-block: clamp(var(--eu-space-12), 6vw, var(--eu-space-24)); }
.eu-root .eu-divider { border: 0; border-top: 1px solid var(--eu-color-border); margin-block: var(--eu-space-6); }

/* ── Accordion — native <details>/<summary>: ZERO JS, works in the export. Fully fluid (any width),
 *    long titles wrap, the indicator never shrinks. Variants: flush · separated · filled · accent ·
 *    chevron · numbered — all token-themed and flat/clean. ───────────────────────────────────────── */
/* container-type makes the accordion respond to ITS OWN width (cqi) — so type + padding scale down when it's
   placed in a narrow column, not only when the whole viewport shrinks (Responsive Field Guide, ingredient 4). */
.eu-root .eu-accordion { display: grid; gap: var(--eu-space-2); container-type: inline-size; }
.eu-root .eu-accordion__item { border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-md); background: var(--eu-color-surface); overflow: hidden; }
/* title wrapper: behaves like the bare title text did (fills the header row, keeps the gap to meta/icon) so
   its spacing is preserved even when the header content is nudged/positioned. */
.eu-root .eu-accordion__title { flex: 1 1 auto; min-width: 0; }
.eu-root .eu-accordion__header {
  cursor: pointer; list-style: none; padding: clamp(var(--eu-space-3), 3.2cqi, var(--eu-space-4)); font-weight: var(--eu-weight-semibold);
  /* fluid type: scales with the accordion's own width so a narrow card shrinks its text instead of breaking words */
  font-size: clamp(0.9rem, 0.82rem + 1.1cqi, 1.05rem); line-height: var(--eu-leading-snug);
  color: var(--eu-color-text); display: flex; align-items: center; justify-content: space-between;
  gap: var(--eu-space-3); overflow-wrap: anywhere; transition: background-color var(--eu-dur-fast) var(--eu-ease-standard);
}
.eu-root .eu-accordion__header:hover { background: var(--eu-color-surface-2); }
/* a11y: a clear keyboard focus ring on the header (inset so overflow:hidden never clips it) */
.eu-root .eu-accordion__header:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--eu-color-brand); }
.eu-root .eu-accordion__header::-webkit-details-marker { display: none; }
.eu-root .eu-accordion__header::after { content: "+"; flex: 0 0 auto; color: var(--eu-color-muted); font-weight: var(--eu-weight-normal); transition: transform var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion__item[open] > .eu-accordion__header::after { content: "\\2212"; } /* minus */
.eu-root .eu-accordion__body { padding: 0 clamp(var(--eu-space-3), 3.2cqi, var(--eu-space-4)) clamp(var(--eu-space-3), 3.2cqi, var(--eu-space-4)); font-size: clamp(0.85rem, 0.8rem + 0.7cqi, 1rem); color: var(--eu-color-muted); }
/* rich answer body (safe markdown-lite → links / bold / lists) */
.eu-root .eu-accordion__body p { margin: 0 0 var(--eu-space-2); }
.eu-root .eu-accordion__body p:last-child { margin-bottom: 0; }
.eu-root .eu-accordion__body ul { margin: var(--eu-space-1) 0; padding-inline-start: 1.25em; }
.eu-root .eu-accordion__body a { color: var(--eu-color-brand); text-decoration: underline; }
.eu-root .eu-accordion__body a:hover { text-decoration: none; }
/* a11y: honour the OS "reduce motion" setting — no header/indicator/shadow animation */
@media (prefers-reduced-motion: reduce) { .eu-root .eu-accordion *, .eu-root .eu-accordion *::after, .eu-root .eu-accordion *::before { transition: none !important; animation: none !important; } }
/* opt-in "Expand all / Collapse all" control bar (token-driven ghost buttons) */
.eu-root .eu-accordion__controls { display: flex; gap: var(--eu-space-2); justify-content: flex-end; margin-block-end: var(--eu-space-1); }
/* category heading — groups items under a label */
.eu-root .eu-accordion__category { font-family: var(--eu-font-heading); font-size: var(--eu-text-sm); font-weight: var(--eu-weight-bold); letter-spacing: .04em; text-transform: uppercase; color: var(--eu-color-muted); margin-block: var(--eu-space-3) var(--eu-space-1); padding-inline-start: var(--eu-space-1); }
.eu-root .eu-accordion__category:first-child { margin-block-start: 0; }
/* no doubled gap when a category heading (or an item) follows the search box */
.eu-root .eu-accordion__search + .eu-accordion__category { margin-block-start: 0; }
/* live search / filter box — modern: full-width, leading icon, clean focus ring */
.eu-root .eu-accordion__search { position: relative; display: flex; align-items: center; inline-size: 100%; margin-block-end: var(--eu-space-3); }
.eu-root .eu-accordion__search-ico { position: absolute; inset-inline-start: 0.9em; inset-block-start: 50%; transform: translateY(-50%); display: inline-flex; color: var(--eu-color-muted); font-size: 1.05em; pointer-events: none; }
.eu-root .eu-accordion__search input { inline-size: 100%; box-sizing: border-box; padding: clamp(var(--eu-space-2), 2cqi, var(--eu-space-3)); padding-inline-start: 2.6em; border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-lg); background: var(--eu-color-surface); color: var(--eu-color-text); font: inherit; transition: border-color var(--eu-dur-base) var(--eu-ease-standard), box-shadow var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion__search input::placeholder { color: var(--eu-color-muted); }
.eu-root .eu-accordion__search input:focus-visible { outline: none; border-color: var(--eu-color-brand); box-shadow: 0 0 0 3px color-mix(in oklab, var(--eu-color-brand) 22%, transparent); }
.eu-root .eu-accordion__noresults { color: var(--eu-color-muted); font-size: var(--eu-text-sm); padding: var(--eu-space-3) var(--eu-space-1); }
.eu-root .eu-accordion__controls button { font: inherit; font-size: var(--eu-text-xs); font-weight: var(--eu-weight-medium); cursor: pointer; padding: .3em .75em; border-radius: var(--eu-radius-sm); border: 1px solid var(--eu-color-border); background: var(--eu-color-surface); color: var(--eu-color-muted); transition: background-color var(--eu-dur-fast) var(--eu-ease-standard), color var(--eu-dur-fast) var(--eu-ease-standard); }
.eu-root .eu-accordion__controls button:hover { background: var(--eu-color-surface-2); color: var(--eu-color-text); }
.eu-root .eu-accordion__controls button:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--eu-color-brand); }

/* flush — borderless, hairline dividers only (Bootstrap-flush / ultra-minimal) */
.eu-root .eu-accordion--flush { gap: 0; }
.eu-root .eu-accordion--flush .eu-accordion__item { border: 0; border-bottom: 1px solid var(--eu-color-border); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--flush .eu-accordion__item:last-child { border-bottom: 0; }
/* separated — each item a spaced, softly-raised card */
.eu-root .eu-accordion--separated { gap: var(--eu-space-3); }
.eu-root .eu-accordion--separated .eu-accordion__item { border-radius: var(--eu-radius-lg); box-shadow: var(--eu-shadow-sm); }
/* filled — the OPEN item's header fills with the brand tint */
.eu-root .eu-accordion--filled .eu-accordion__item[open] > .eu-accordion__header { background: var(--eu-color-primary-50); color: var(--eu-color-brand); }
.eu-root .eu-accordion--filled .eu-accordion__item[open] > .eu-accordion__header::after { color: var(--eu-color-brand); }
/* accent — the OPEN item gets a brand left rail (FAQ style) */
.eu-root .eu-accordion--accent .eu-accordion__item[open] { border-inline-start: 3px solid var(--eu-color-brand); }
/* chevron — a rotating chevron indicator instead of +/− (uses currentColor, em-sized) */
.eu-root .eu-accordion--chevron .eu-accordion__header::after { content: ""; width: .5em; height: .5em; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); opacity: .55; }
.eu-root .eu-accordion--chevron .eu-accordion__item[open] > .eu-accordion__header::after { transform: rotate(-135deg); }
/* numbered — 01 / 02 / 03 leading counter */
.eu-root .eu-accordion--numbered { counter-reset: eu-acc; }
.eu-root .eu-accordion--numbered .eu-accordion__header { counter-increment: eu-acc; }
.eu-root .eu-accordion--numbered .eu-accordion__header::before { content: var(--eu-n0, "01"); flex: 0 0 auto; font-family: var(--eu-font-mono); font-size: var(--eu-text-xs); color: var(--eu-color-muted); margin-inline-end: var(--eu-space-1); }
/* plus-circle — the +/− sits inside a round badge that fills with brand when open */
.eu-root .eu-accordion--plus-circle .eu-accordion__header::after { display: grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 999px; background: var(--eu-color-surface-2); color: var(--eu-color-muted); font-size: .8em; }
.eu-root .eu-accordion--plus-circle .eu-accordion__item[open] > .eu-accordion__header::after { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
/* arrow — a small triangle caret that flips 180° on open */
.eu-root .eu-accordion--arrow .eu-accordion__header::after { content: "\\25BE"; color: var(--eu-color-muted); }
.eu-root .eu-accordion--arrow .eu-accordion__item[open] > .eu-accordion__header::after { transform: rotate(180deg); }
/* left — indicator moves to the LEADING edge, title after it */
.eu-root .eu-accordion--left .eu-accordion__header { flex-direction: row-reverse; justify-content: flex-end; }
/* pill — fully-rounded items (soften to xl when open so the body reads cleanly) */
.eu-root .eu-accordion--pill .eu-accordion__item { border-radius: 999px; }
.eu-root .eu-accordion--pill .eu-accordion__item[open] { border-radius: var(--eu-radius-xl); }
/* ghost — no border, no surface: text + indicator only, tight rhythm */
.eu-root .eu-accordion--ghost { gap: var(--eu-space-1); }
.eu-root .eu-accordion--ghost .eu-accordion__item { border: 0; background: transparent; border-radius: var(--eu-radius-md); }
/* elevated — raised cards that lift a touch on hover */
.eu-root .eu-accordion--elevated .eu-accordion__item { border-radius: var(--eu-radius-lg); box-shadow: var(--eu-shadow-sm); transition: box-shadow var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--elevated .eu-accordion__item:hover { box-shadow: var(--eu-shadow-md); }
/* brand-header — every header carries the brand tint */
.eu-root .eu-accordion--brand-header .eu-accordion__header { background: var(--eu-color-primary-50); color: var(--eu-color-brand); }
.eu-root .eu-accordion--brand-header .eu-accordion__header::after { color: var(--eu-color-brand); }
/* underline — flush with a brand underline under the open header */
.eu-root .eu-accordion--underline .eu-accordion__item { border: 0; border-bottom: 1px solid var(--eu-color-border); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--underline .eu-accordion__item[open] > .eu-accordion__header { box-shadow: inset 0 -2px 0 var(--eu-color-brand); color: var(--eu-color-brand); }
/* large — spacious, bigger type */
.eu-root .eu-accordion--large .eu-accordion__header { padding: var(--eu-space-6); font-size: var(--eu-text-lg); }
.eu-root .eu-accordion--large .eu-accordion__body { padding: 0 var(--eu-space-6) var(--eu-space-6); }
/* compact — tight, small type */
.eu-root .eu-accordion--compact .eu-accordion__header { padding: var(--eu-space-3); font-size: var(--eu-text-sm); }
.eu-root .eu-accordion--compact .eu-accordion__body { padding: 0 var(--eu-space-3) var(--eu-space-3); font-size: var(--eu-text-sm); }
/* zebra — alternating item surfaces */
.eu-root .eu-accordion--zebra .eu-accordion__item:nth-child(even) { background: var(--eu-color-surface-2); }
/* body-tint — the open panel sits on a tinted surface */
.eu-root .eu-accordion--body-tint .eu-accordion__item[open] > .eu-accordion__body { background: var(--eu-color-surface-2); padding-top: var(--eu-space-4); }
/* divided — a hairline between the open header and its body */
.eu-root .eu-accordion--divided .eu-accordion__item[open] > .eu-accordion__header { border-bottom: 1px solid var(--eu-color-border); }
/* square — sharp corners */
.eu-root .eu-accordion--square .eu-accordion__item { border-radius: 0; }
/* rail — a permanent muted left rail that turns brand when open */
.eu-root .eu-accordion--rail .eu-accordion__item { border-inline-start: 3px solid var(--eu-color-border); }
.eu-root .eu-accordion--rail .eu-accordion__item[open] { border-inline-start-color: var(--eu-color-brand); }
/* switch — a pill toggle indicator that slides/colours on open */
.eu-root .eu-accordion--switch .eu-accordion__header::after { content: ""; width: 2em; height: 1.1em; border-radius: 999px; background: var(--eu-color-surface-2); box-shadow: inset -1.1em 0 0 -0.15em var(--eu-color-muted); transition: box-shadow var(--eu-dur-base) var(--eu-ease-standard), background-color var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--switch .eu-accordion__item[open] > .eu-accordion__header::after { background: var(--eu-color-brand); box-shadow: inset 1.1em 0 0 -0.15em var(--eu-color-on-brand); }
/* gradient — open header gets a soft brand→accent wash (modern) */
.eu-root .eu-accordion--gradient .eu-accordion__item[open] > .eu-accordion__header { background: linear-gradient(90deg, var(--eu-color-primary-50), var(--eu-color-accent-50)); color: var(--eu-color-brand); }
.eu-root .eu-accordion--gradient .eu-accordion__item[open] > .eu-accordion__header::after { color: var(--eu-color-brand); }
/* soft — pastel, borderless, generously-rounded surface cards (spa / pricing feel) */
.eu-root .eu-accordion--soft { gap: var(--eu-space-3); }
.eu-root .eu-accordion--soft .eu-accordion__item { border: 0; background: var(--eu-color-surface-2); border-radius: var(--eu-radius-xl); }
.eu-root .eu-accordion--soft .eu-accordion__header:hover { background: transparent; }
/* tag — a leading status dot that lights up to brand when open (modern dropdown) */
.eu-root .eu-accordion--tag .eu-accordion__header::before { content: ""; flex: 0 0 auto; width: .55em; height: .55em; border-radius: 999px; background: var(--eu-color-muted); margin-inline-end: var(--eu-space-2); transition: background-color var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--tag .eu-accordion__item[open] > .eu-accordion__header::before { background: var(--eu-color-brand); }
/* line — the very simplest: a single hairline over each row, flush to the edges */
.eu-root .eu-accordion--line { gap: 0; }
.eu-root .eu-accordion--line .eu-accordion__item { border: 0; border-top: 1px solid var(--eu-color-border); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--line .eu-accordion__header, .eu-root .eu-accordion--line .eu-accordion__body { padding-inline: 0; }
/* stepper — a circular number badge that fills with brand when open (e-learning) */
.eu-root .eu-accordion--stepper { counter-reset: eu-step; }
.eu-root .eu-accordion--stepper .eu-accordion__header { counter-increment: eu-step; }
.eu-root .eu-accordion--stepper .eu-accordion__header::before { content: var(--eu-n, "1"); flex: 0 0 auto; width: 1.8em; height: 1.8em; display: grid; place-items: center; border-radius: 999px; background: var(--eu-color-surface-2); color: var(--eu-color-muted); font-family: var(--eu-font-mono); font-size: .8em; margin-inline-end: var(--eu-space-3); }
.eu-root .eu-accordion--stepper .eu-accordion__item[open] > .eu-accordion__header::before { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
/* outline — transparent items with an outlined edge that turns brand when open */
.eu-root .eu-accordion--outline .eu-accordion__item { background: transparent; }
.eu-root .eu-accordion--outline .eu-accordion__item[open] { border-color: var(--eu-color-brand); }
/* glass — frosted translucent panels that glow on open (FreeFrontend gradient/frosted) */
.eu-root .eu-accordion--glass .eu-accordion__item { background: color-mix(in oklab, var(--eu-color-surface) 62%, transparent); border-color: color-mix(in oklab, var(--eu-color-border) 60%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: var(--eu-radius-lg); }
.eu-root .eu-accordion--glass .eu-accordion__item[open] { box-shadow: var(--eu-shadow-lg); border-color: color-mix(in oklab, var(--eu-color-brand) 45%, transparent); }
.eu-root .eu-accordion--glass .eu-accordion__header:hover { background: color-mix(in oklab, var(--eu-color-surface-2) 55%, transparent); }
/* timeline — a vertical axis with a node dot per item that fills brand on open (FreeFrontend scroll timeline) */
.eu-root .eu-accordion--timeline { position: relative; gap: 0; padding-inline-start: 1.5rem; }
.eu-root .eu-accordion--timeline::before { content: ""; position: absolute; inset-block: 0.6rem 0.6rem; inset-inline-start: 0.4rem; width: 2px; background: var(--eu-color-border); }
.eu-root .eu-accordion--timeline .eu-accordion__item { border: 0; background: transparent; border-radius: 0; }
.eu-root .eu-accordion--timeline .eu-accordion__header { position: relative; }
.eu-root .eu-accordion--timeline .eu-accordion__header::before { content: ""; position: absolute; inset-inline-start: -1.35rem; top: 1.4em; width: 0.7em; height: 0.7em; border-radius: 999px; background: var(--eu-color-surface); border: 2px solid var(--eu-color-border); }
.eu-root .eu-accordion--timeline .eu-accordion__item[open] > .eu-accordion__header::before { background: var(--eu-color-brand); border-color: var(--eu-color-brand); }
/* minimal — the quietest: hairline rows, flush, title turns brand when open (Colorlib V18/V19) */
.eu-root .eu-accordion--minimal { gap: 0; }
.eu-root .eu-accordion--minimal .eu-accordion__item { border: 0; border-bottom: 1px solid var(--eu-color-border); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--minimal .eu-accordion__header { padding-inline: 0; font-weight: var(--eu-weight-medium); }
.eu-root .eu-accordion--minimal .eu-accordion__body { padding-inline: 0; }
.eu-root .eu-accordion--minimal .eu-accordion__item[open] > .eu-accordion__header { color: var(--eu-color-brand); }
/* __meta — an optional right-aligned slot in the header for a price / count / badge (Colorlib pricing V01, menu V02) */
.eu-root .eu-accordion__meta { margin-inline-start: auto; color: var(--eu-color-muted); font-size: 0.9em; font-weight: var(--eu-weight-normal); font-variant-numeric: tabular-nums; }
/* __media — an optional leading thumbnail in the header (Colorlib image V09, menu V02) */
.eu-root .eu-accordion__icon { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; font-size: 1.15em; color: var(--eu-color-brand); }
.eu-root .eu-accordion__icon svg { inline-size: 1em; block-size: 1em; }
.eu-root .eu-accordion__media { flex: 0 0 auto; inline-size: 2.75em; block-size: 2.75em; max-inline-size: 100%; border-radius: var(--eu-radius-md); object-fit: cover; background: var(--eu-color-surface-2); }
.eu-root .eu-accordion__media--wide { inline-size: 4em; block-size: 2.5em; }
/* nested — an accordion inside a body panel gets indented with a subtle guide rule (Colorlib profile V04/V05/V08/V15) */
.eu-root .eu-accordion .eu-accordion { margin-block-start: var(--eu-space-2); margin-inline-start: var(--eu-space-3); border-inline-start: 2px solid var(--eu-color-border); padding-inline-start: var(--eu-space-3); gap: var(--eu-space-1); }
.eu-root .eu-accordion .eu-accordion .eu-accordion__header { padding-block: var(--eu-space-2); font-size: 0.95em; font-weight: var(--eu-weight-medium); }

/* ============================================================
   BOLD designs — structurally distinct, not recolours
   ============================================================ */
/* horizontal — panels sit in a row; the open one expands sideways, collapsed ones show a vertical label (Articulate 5-panel) */
.eu-root .eu-accordion--horizontal { display: flex; flex-direction: row; flex-wrap: wrap; gap: var(--eu-space-2); min-block-size: 15rem; align-items: stretch; }
.eu-root .eu-accordion--horizontal .eu-accordion__item { flex: 0 0 3.25rem; display: flex; flex-direction: column; overflow: hidden; transition: flex-grow var(--eu-dur-slow) var(--eu-ease-standard); }
.eu-root .eu-accordion--horizontal .eu-accordion__item[open] { flex: 1 1 auto; }
.eu-root .eu-accordion--horizontal .eu-accordion__header { flex: 1 1 auto; justify-content: center; writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
.eu-root .eu-accordion--horizontal .eu-accordion__item[open] > .eu-accordion__header { flex: 0 0 auto; writing-mode: horizontal-tb; transform: none; justify-content: space-between; background: var(--eu-color-primary-50); color: var(--eu-color-brand); }
.eu-root .eu-accordion--horizontal .eu-accordion__header::after { display: none; }
.eu-root .eu-accordion--horizontal .eu-accordion__body { flex: 1 1 auto; overflow: auto; }
/* colored folded panels, like the Dribbble fan (Reina DuFrene) — token ramps only, so it re-themes */
.eu-root .eu-accordion--horizontal .eu-accordion__item:nth-child(4n+1) { background: var(--eu-color-primary-50); }
.eu-root .eu-accordion--horizontal .eu-accordion__item:nth-child(4n+2) { background: var(--eu-color-accent-50); }
.eu-root .eu-accordion--horizontal .eu-accordion__item:nth-child(4n+3) { background: var(--eu-color-neutral-100); }
.eu-root .eu-accordion--horizontal .eu-accordion__item:nth-child(4n+4) { background: var(--eu-color-primary-100); }
/* Reflow on the accordion's OWN width (container query, not viewport): full-width items wrap into a vertical
   stack, headers return to horizontal text. Descendant-only rules so the container-query context applies. */
@container (max-width: 40rem) {
  .eu-root .eu-accordion--horizontal .eu-accordion__item { flex: 1 1 100%; }
  .eu-root .eu-accordion--horizontal .eu-accordion__item[open] { flex: 1 1 100%; }
  .eu-root .eu-accordion--horizontal .eu-accordion__header { writing-mode: horizontal-tb; transform: none; justify-content: space-between; }
}
/* panel — open fills the WHOLE item solid brand with light text (FreeFrontend "Collapse Blue") */
.eu-root .eu-accordion--panel .eu-accordion__item[open] { background: var(--eu-color-brand); border-color: var(--eu-color-brand); }
.eu-root .eu-accordion--panel .eu-accordion__item[open] > .eu-accordion__header,
.eu-root .eu-accordion--panel .eu-accordion__item[open] > .eu-accordion__header:hover { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--panel .eu-accordion__item[open] > .eu-accordion__header::after { color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--panel .eu-accordion__item[open] > .eu-accordion__body { color: color-mix(in oklab, var(--eu-color-on-brand) 82%, transparent); }
/* index — a large bold numeral tile on the left that fills brand when open (e-learning step) */
.eu-root .eu-accordion--index { counter-reset: eu-idx; }
.eu-root .eu-accordion--index .eu-accordion__header { counter-increment: eu-idx; gap: var(--eu-space-4); }
.eu-root .eu-accordion--index .eu-accordion__header::before { content: var(--eu-n, "1"); flex: 0 0 auto; display: grid; place-items: center; inline-size: 2.4em; block-size: 2.4em; border-radius: var(--eu-radius-md); background: var(--eu-color-primary-50); color: var(--eu-color-brand); font-family: var(--eu-font-heading); font-size: 1.05em; font-weight: var(--eu-weight-bold); line-height: 1; }
.eu-root .eu-accordion--index .eu-accordion__item[open] { background: var(--eu-color-primary-50); border-color: var(--eu-color-brand); }
.eu-root .eu-accordion--index .eu-accordion__item[open] > .eu-accordion__header::before { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--index .eu-accordion__item[open] > .eu-accordion__header:hover { background: transparent; }
/* bubble — chat-style: pill headers, brand bubble when open, offset body bubble (Dribbble) */
.eu-root .eu-accordion--bubble { gap: var(--eu-space-3); }
.eu-root .eu-accordion--bubble .eu-accordion__item { border: 0; background: transparent; overflow: visible; }
.eu-root .eu-accordion--bubble .eu-accordion__header { background: var(--eu-color-surface-2); border-radius: var(--eu-radius-xl); }
.eu-root .eu-accordion--bubble .eu-accordion__item[open] > .eu-accordion__header { background: var(--eu-color-brand); color: var(--eu-color-on-brand); border-end-start-radius: var(--eu-radius-sm); }
.eu-root .eu-accordion--bubble .eu-accordion__item[open] > .eu-accordion__header::after { color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--bubble .eu-accordion__body { margin-block-start: var(--eu-space-2); padding: var(--eu-space-4); background: var(--eu-color-surface-2); border-radius: var(--eu-radius-xl); border-start-start-radius: var(--eu-radius-sm); }
/* alt — borderless rows with alternating item fills for an even reading rhythm (Dribbble) */
.eu-root .eu-accordion--alt { gap: 0; border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-md); overflow: hidden; }
.eu-root .eu-accordion--alt .eu-accordion__item { border: 0; border-radius: 0; background: transparent; }
.eu-root .eu-accordion--alt .eu-accordion__item:nth-child(even) { background: var(--eu-color-surface-2); }
.eu-root .eu-accordion--alt .eu-accordion__item[open] { background: var(--eu-color-primary-50); }
/* bignum — a large ghosted numeral beside each row that lights to brand when open (Dribbble big-number FAQ) */
.eu-root .eu-accordion--bignum { counter-reset: eu-bn; gap: 0; }
.eu-root .eu-accordion--bignum .eu-accordion__item { border: 0; border-bottom: 1px solid var(--eu-color-border); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--bignum .eu-accordion__header { counter-increment: eu-bn; gap: var(--eu-space-4); padding-inline: 0; align-items: center; }
.eu-root .eu-accordion--bignum .eu-accordion__header::before { content: var(--eu-n0, "01"); flex: 0 0 auto; font-family: var(--eu-font-heading); font-size: 1.7em; font-weight: var(--eu-weight-bold); line-height: 1; color: var(--eu-color-border); font-variant-numeric: tabular-nums; transition: color var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--bignum .eu-accordion__item[open] > .eu-accordion__header::before { color: var(--eu-color-brand); }
.eu-root .eu-accordion--bignum .eu-accordion__body { padding-inline: 0; }
/* __media--round — circular avatar/thumbnail, e.g. for pill rows (Dribbble kffein) */
.eu-root .eu-accordion__media--round { border-radius: 999px; }
/* qa — a FAQ identity: a brand "Q" badge on the header, a muted "A" badge on the answer (Dribbble/Colorlib FAQ) */
.eu-root .eu-accordion--qa .eu-accordion__header::before { content: "Q"; flex: 0 0 auto; display: grid; place-items: center; inline-size: 1.9em; block-size: 1.9em; border-radius: var(--eu-radius-md); background: var(--eu-color-brand); color: var(--eu-color-on-brand); font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); margin-inline-end: var(--eu-space-2); }
.eu-root .eu-accordion--qa .eu-accordion__body { display: flex; gap: var(--eu-space-3); align-items: flex-start; padding-top: var(--eu-space-2); }
.eu-root .eu-accordion--qa .eu-accordion__body::before { content: "A"; flex: 0 0 auto; display: grid; place-items: center; inline-size: 1.9em; block-size: 1.9em; border-radius: var(--eu-radius-md); background: var(--eu-color-surface-2); color: var(--eu-color-muted); font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); }
/* callout — each item is an info-box: a coloured left border over a brand-tinted panel (Dribbble highlighted-open) */
.eu-root .eu-accordion--callout { gap: var(--eu-space-3); }
.eu-root .eu-accordion--callout .eu-accordion__item { border: 0; border-inline-start: 3px solid var(--eu-color-brand); border-radius: var(--eu-radius-sm); background: var(--eu-color-primary-50); }
.eu-root .eu-accordion--callout .eu-accordion__header { color: var(--eu-color-brand); }
.eu-root .eu-accordion--callout .eu-accordion__header:hover { background: transparent; }
.eu-root .eu-accordion--callout .eu-accordion__body { color: var(--eu-color-text); }
/* float — flat cards that lift with a big shadow when open (Dribbble card list) */
.eu-root .eu-accordion--float { gap: var(--eu-space-3); }
.eu-root .eu-accordion--float .eu-accordion__item { border: 0; border-radius: var(--eu-radius-lg); background: var(--eu-color-surface); box-shadow: var(--eu-shadow-sm); transition: box-shadow var(--eu-dur-base) var(--eu-ease-standard), transform var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--float .eu-accordion__item[open] { box-shadow: var(--eu-shadow-xl); transform: translateY(-2px); }
/* folder — headers shaped like file-folder tabs; open tab fills brand and joins its body (Articulate tabcordion) */
.eu-root .eu-accordion--folder { gap: var(--eu-space-2); }
.eu-root .eu-accordion--folder .eu-accordion__item { border: 0; background: transparent; overflow: visible; }
.eu-root .eu-accordion--folder .eu-accordion__header { background: var(--eu-color-surface-2); border-radius: var(--eu-radius-md) var(--eu-radius-md) 0 0; min-inline-size: 55%; inline-size: fit-content; }
.eu-root .eu-accordion--folder .eu-accordion__item[open] > .eu-accordion__header { background: var(--eu-color-brand); color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--folder .eu-accordion__item[open] > .eu-accordion__header::after { color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--folder .eu-accordion__body { border: 1px solid var(--eu-color-border); border-radius: 0 var(--eu-radius-md) var(--eu-radius-md) var(--eu-radius-md); padding-top: var(--eu-space-4); }
/* news — editorial broadsheet: heavy top rules, heading-font titles, flush to the edges (Dribbble editorial) */
.eu-root .eu-accordion--news { gap: 0; }
.eu-root .eu-accordion--news .eu-accordion__item { border: 0; border-block-start: 2px solid var(--eu-color-text); border-radius: 0; background: transparent; }
.eu-root .eu-accordion--news .eu-accordion__item:last-child { border-block-end: 2px solid var(--eu-color-text); }
.eu-root .eu-accordion--news .eu-accordion__header { font-family: var(--eu-font-heading); font-size: var(--eu-text-lg); padding-inline: 0; }
.eu-root .eu-accordion--news .eu-accordion__body { padding-inline: 0; }
/* ring — an outlined circular step number that turns brand when open (Dribbble big-number/step) */
.eu-root .eu-accordion--ring { counter-reset: eu-ring; }
.eu-root .eu-accordion--ring .eu-accordion__header { counter-increment: eu-ring; gap: var(--eu-space-3); }
.eu-root .eu-accordion--ring .eu-accordion__header::before { content: var(--eu-n, "1"); flex: 0 0 auto; display: grid; place-items: center; inline-size: 2em; block-size: 2em; border-radius: 999px; border: 2px solid var(--eu-color-border); color: var(--eu-color-muted); font-weight: var(--eu-weight-semibold); font-size: 0.85em; }
.eu-root .eu-accordion--ring .eu-accordion__item[open] > .eu-accordion__header::before { border-color: var(--eu-color-brand); color: var(--eu-color-brand); }
/* stripe — a permanent, multi-colour left bar per item, cycling the token ramps (Dribbble colour fan) */
.eu-root .eu-accordion--stripe .eu-accordion__item { border-inline-start: 4px solid var(--eu-color-brand); }
.eu-root .eu-accordion--stripe .eu-accordion__item:nth-child(3n+2) { border-inline-start-color: var(--eu-color-accent-500); }
.eu-root .eu-accordion--stripe .eu-accordion__item:nth-child(3n+3) { border-inline-start-color: var(--eu-color-success); }
/* dashed — a playful dashed frame that snaps to a solid brand outline when open */
.eu-root .eu-accordion--dashed .eu-accordion__item { border-style: dashed; }
.eu-root .eu-accordion--dashed .eu-accordion__item[open] { border-style: solid; border-color: var(--eu-color-brand); }
/* enclosed — one bordered card holding every row, split by internal hairlines (the classic FAQ card, Dribbble Talha) */
.eu-root .eu-accordion--enclosed { gap: 0; border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-lg); overflow: hidden; background: var(--eu-color-surface); }
.eu-root .eu-accordion--enclosed .eu-accordion__item { border: 0; border-radius: 0; }
.eu-root .eu-accordion--enclosed .eu-accordion__item + .eu-accordion__item { border-block-start: 1px solid var(--eu-color-border); }
/* menu — big rounded "button list" rows that morph from pill to card when open (Dribbble kffein) */
.eu-root .eu-accordion--menu { gap: var(--eu-space-2); }
.eu-root .eu-accordion--menu .eu-accordion__item { border: 0; background: var(--eu-color-surface-2); border-radius: 999px; overflow: hidden; transition: border-radius var(--eu-dur-base) var(--eu-ease-standard), box-shadow var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--menu .eu-accordion__item[open] { border-radius: var(--eu-radius-xl); background: var(--eu-color-surface); box-shadow: var(--eu-shadow-md); }
.eu-root .eu-accordion--menu .eu-accordion__header { padding-block: var(--eu-space-4); font-size: var(--eu-text-lg); }
.eu-root .eu-accordion--menu .eu-accordion__item[open] > .eu-accordion__header { color: var(--eu-color-brand); }
/* quote — an oversized quotation mark leads each row (editorial FAQ, Dribbble) */
.eu-root .eu-accordion--quote .eu-accordion__header::before { content: "\\201C"; flex: 0 0 auto; font-family: var(--eu-font-heading); font-size: 2em; line-height: 0.7; color: var(--eu-color-primary-300); margin-inline-end: var(--eu-space-2); }
.eu-root .eu-accordion--quote .eu-accordion__item[open] > .eu-accordion__header::before { color: var(--eu-color-brand); }
/* invert — an always-dark glossy card on any theme, by swapping the text/bg tokens (Dribbble/Framer dark FAQ) */
.eu-root .eu-accordion--invert { background: var(--eu-color-text); border-radius: var(--eu-radius-lg); padding: var(--eu-space-2); gap: var(--eu-space-1); }
.eu-root .eu-accordion--invert .eu-accordion__item { border: 0; background: transparent; }
.eu-root .eu-accordion--invert .eu-accordion__header { color: var(--eu-color-bg); border-radius: var(--eu-radius-md); }
.eu-root .eu-accordion--invert .eu-accordion__header::after { color: var(--eu-color-bg); }
.eu-root .eu-accordion--invert .eu-accordion__header:hover { background: color-mix(in oklab, var(--eu-color-bg) 12%, transparent); }
.eu-root .eu-accordion--invert .eu-accordion__body { color: color-mix(in oklab, var(--eu-color-bg) 68%, transparent); }
/* grid — a two-column wall of items that collapses to one column on narrow (Dribbble two-column FAQ).
   Intrinsic auto-fit: reflows on the accordion's OWN width with NO breakpoint (Field Guide ingredient 1). */
.eu-root .eu-accordion--grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: var(--eu-space-2); align-items: start; }
/* gradient-full — every header is a brand→accent gradient bar with light text (Dribbble gradient FAQ) */
.eu-root .eu-accordion--gradient-full .eu-accordion__header,
.eu-root .eu-accordion--gradient-full .eu-accordion__header:hover { background: linear-gradient(90deg, var(--eu-color-primary-500), var(--eu-color-accent-500)); color: var(--eu-color-on-brand); }
.eu-root .eu-accordion--gradient-full .eu-accordion__header::after { color: var(--eu-color-on-brand); }
/* spotlight — the open item lights up with a soft brand glow ring */
.eu-root .eu-accordion--spotlight .eu-accordion__item[open] { border-color: var(--eu-color-brand); box-shadow: 0 0 0 3px color-mix(in oklab, var(--eu-color-brand) 22%, transparent); }
/* corner — a folded dog-ear in the top corner that turns brand when open */
.eu-root .eu-accordion--corner .eu-accordion__item { position: relative; overflow: hidden; }
.eu-root .eu-accordion--corner .eu-accordion__item::before { content: ""; position: absolute; inset-block-start: 0; inset-inline-end: 0; border-width: 0 var(--eu-space-5) var(--eu-space-5) 0; border-style: solid; border-color: var(--eu-color-primary-100) transparent; transition: border-color var(--eu-dur-base) var(--eu-ease-standard); }
.eu-root .eu-accordion--corner .eu-accordion__item[open]::before { border-color: var(--eu-color-brand) transparent; }
/* split — the accordion sits beside a media/visual panel; stacks on the accordion's OWN narrow width (SaaS) */
.eu-root .eu-accordion--split { display: grid; grid-template-columns: minmax(min(100%, 14rem), 1fr) minmax(0, 1.6fr); gap: var(--eu-space-4); align-items: start; }
.eu-root .eu-accordion--split .eu-accordion__panel { grid-column: 1; grid-row: 1 / -1; align-self: stretch; min-block-size: 12rem; border-radius: var(--eu-radius-lg); background-color: var(--eu-color-surface-2); background-size: cover; background-position: center; }
/* everything except the panel lives in the items column (2), so nothing lands in an empty cell */
.eu-root .eu-accordion--split > .eu-accordion__item,
.eu-root .eu-accordion--split > .eu-accordion__search,
.eu-root .eu-accordion--split > .eu-accordion__controls,
.eu-root .eu-accordion--split > .eu-accordion__category { grid-column: 2; }
@container (max-width: 34rem) {
  .eu-root .eu-accordion--split { grid-template-columns: 1fr; }
  .eu-root .eu-accordion--split .eu-accordion__panel { grid-column: 1; grid-row: auto; min-block-size: 8rem; }
  .eu-root .eu-accordion--split > .eu-accordion__item,
  .eu-root .eu-accordion--split > .eu-accordion__search,
  .eu-root .eu-accordion--split > .eu-accordion__controls,
  .eu-root .eu-accordion--split > .eu-accordion__category { grid-column: 1; }
}

/* ── Tabs — styles; the export injects a tiny vanilla toggle (aria-selected / [hidden]) ──────── */
.eu-root .eu-tabs__list { display: flex; flex-wrap: wrap; gap: var(--eu-space-1); border-bottom: 1px solid var(--eu-color-border); }
.eu-root .eu-tab { appearance: none; border: 0; background: none; cursor: pointer; padding: var(--eu-space-3) var(--eu-space-4); font-family: var(--eu-font-body); font-weight: var(--eu-weight-medium); color: var(--eu-color-muted); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.eu-root .eu-tab:hover { color: var(--eu-color-text); }
.eu-root .eu-tab[aria-selected="true"] { color: var(--eu-color-brand); border-bottom-color: var(--eu-color-brand); }
.eu-root .eu-tabs__panel { padding-block: var(--eu-space-4); }
.eu-root .eu-tabs__panel[hidden] { display: none; }

/* ── Navbar ─────────────────────────────────────────────────────────────────────────────────── */
.eu-root .eu-navbar { display: flex; align-items: center; gap: var(--eu-space-6); padding: var(--eu-space-3) var(--eu-space-5); background: var(--eu-color-surface); border-bottom: 1px solid var(--eu-color-border); }
.eu-root .eu-navbar__brand { font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); font-size: var(--eu-text-lg); color: var(--eu-color-text); }
.eu-root .eu-navbar__links { display: flex; flex-wrap: wrap; gap: var(--eu-space-1); margin-inline-start: auto; }
.eu-root .eu-navbar__link { padding: var(--eu-space-2) var(--eu-space-3); border-radius: var(--eu-radius-md); color: var(--eu-color-text); text-decoration: none; }
.eu-root .eu-navbar__link:hover { background: var(--eu-color-surface-2); }
.eu-root .eu-navbar__link[aria-current="page"] { color: var(--eu-color-brand); font-weight: var(--eu-weight-semibold); }
/* Container-query responsive: when the navbar's container is narrow, links drop to a full-width row
 * (responds to ITS container, not the viewport — per the Responsive Design field guide). */
@container (max-width: 34rem) {
  .eu-root .eu-navbar { flex-wrap: wrap; gap: var(--eu-space-3); }
  .eu-root .eu-navbar__links { margin-inline-start: 0; width: 100%; }
}
`.trim();

/** The component layer on its own (base.ts owns reset/utilities; tokens.ts owns the variables). */
export function componentCss(): string {
  return COMPONENT_CSS;
}
