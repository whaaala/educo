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
.eu-root .eu-card__icon { display: inline-flex; font-size: 2em; line-height: 1; color: var(--eu-color-brand); margin-block-end: var(--eu-space-2); }
.eu-root .eu-card__icon svg, .eu-root .eu-stat__icon svg, .eu-root .eu-badge__icon svg { width: 1em; height: 1em; }

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
.eu-root .eu-badge__icon { display: inline-flex; font-size: 1.1em; line-height: 1; }
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
.eu-root .eu-stat__icon { display: inline-flex; font-size: 2em; line-height: 1; color: var(--eu-color-brand); margin-block-end: var(--eu-space-1); }

/* ── Rating (stars) — inline SVG, currentColor, em-sized ────────────────────── */
.eu-root .eu-rating { display: inline-flex; align-items: center; gap: clamp(0.1em, 1cqi, 0.25em); color: var(--eu-color-neutral-300); }
.eu-root .eu-rating__star { width: 1.3em; height: 1.3em; flex: none; }
.eu-root .eu-rating__star.is-on { color: var(--eu-color-warning); }
.eu-root .eu-rating--brand .eu-rating__star.is-on { color: var(--eu-color-brand); }

/* ── Alert (severity × treatment × form factor — all token-driven, re-themes in every theme) ── */
.eu-root .eu-alert {
  --al-c: var(--eu-color-info);                                                   /* severity accent */
  --al-tint: color-mix(in oklab, var(--al-c) 14%, var(--eu-color-surface));       /* soft background */
  --al-line: color-mix(in oklab, var(--al-c) 34%, var(--eu-color-surface));       /* soft border */
  container-type: inline-size;
  display: flex; align-items: flex-start; gap: var(--eu-space-3);
  padding: var(--eu-space-4) var(--eu-space-5);
  border-radius: var(--eu-radius-md);
  background: var(--al-tint); color: var(--eu-color-text); border: 1px solid var(--al-line);
}
/* severities set the accent colour only — every treatment reads --al-c */
.eu-root .eu-alert--info    { --al-c: var(--eu-color-info); }
.eu-root .eu-alert--success { --al-c: var(--eu-color-success); }
.eu-root .eu-alert--warning { --al-c: var(--eu-color-warning); }
.eu-root .eu-alert--danger  { --al-c: var(--eu-color-danger); }
.eu-root .eu-alert--neutral { --al-c: var(--eu-color-muted); }
.eu-root .eu-alert--brand   { --al-c: var(--eu-color-brand); }
/* parts */
.eu-root .eu-alert__icon { display: inline-flex; flex: none; color: var(--al-c); font-size: 1.3rem; line-height: 1; margin-block-start: 0.05em; }
.eu-root .eu-alert__icon svg { width: 1em; height: 1em; }
.eu-root .eu-alert__content { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: var(--eu-space-1); }
.eu-root .eu-alert__title { font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); color: var(--al-c); line-height: 1.2; }
.eu-root .eu-alert__body { color: var(--eu-color-text); font-size: 0.95em; }
.eu-root .eu-alert__action { align-self: flex-start; margin-block-start: var(--eu-space-2); }
.eu-root .eu-alert__close { appearance: none; flex: none; background: transparent; border: 0; color: inherit; opacity: 0.55; cursor: pointer; padding: 0.15rem; line-height: 0; border-radius: var(--eu-radius-sm); }
.eu-root .eu-alert__close:hover { opacity: 1; background: color-mix(in oklab, currentColor 14%, transparent); }
.eu-root .eu-alert__close svg { width: 1.1rem; height: 1.1rem; }
/* ── treatments ── */
.eu-root .eu-alert--solid { background: var(--al-c); border-color: transparent; }
.eu-root .eu-alert--solid .eu-alert__icon, .eu-root .eu-alert--solid .eu-alert__title, .eu-root .eu-alert--solid .eu-alert__body { color: var(--eu-color-on-brand); }
.eu-root .eu-alert--solid .eu-alert__action { background: var(--eu-color-on-brand); color: var(--al-c); border-color: transparent; }
.eu-root .eu-alert--outline { background: transparent; border: 1.5px solid var(--al-c); }
.eu-root .eu-alert--accent { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); border-inline-start: 4px solid var(--al-c); }
.eu-root .eu-alert--top { background: var(--al-tint); border: 1px solid var(--al-line); border-block-start: 4px solid var(--al-c); }
.eu-root .eu-alert--card { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-alert--glass { background: color-mix(in oklab, var(--eu-color-surface) 55%, transparent); -webkit-backdrop-filter: blur(12px) saturate(1.5); backdrop-filter: blur(12px) saturate(1.5); border: 1px solid color-mix(in oklab, var(--al-c) 30%, transparent); box-shadow: var(--eu-shadow-lg); }
/* ── form factors ── */
.eu-root .eu-alert--banner { border-radius: 0; border-inline: 0; }
.eu-root .eu-alert--callout { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); border-inline-start: 4px solid var(--al-c); }
/* responsive: stack the action under the text on very narrow blocks */
@container (max-width: 22rem) { .eu-root .eu-alert { flex-wrap: wrap; } }
/* ── multi-item stack + form factors + parts ── */
.eu-root .eu-alert-stack { display: flex; flex-direction: column; gap: var(--eu-space-3); }
/* Height resize (COMPONENT SIZING RULE): when the block is given a definite height the stack fills it and the
   alert rows share the extra space, so dragging the top/bottom edge grows the ALERT itself — not just an empty
   box around it. With an auto-height stack there is no free space, so the rows keep hugging their content. */
.eu-root .eu-alert-stack > .eu-alert { flex: 1 1 auto; }
.eu-root .eu-alert-stack--banner { gap: 0; }
.eu-root .eu-alert-stack--banner .eu-alert { border-radius: 0; border-inline: 0; }

/* ── Alert designs ─────────────────────────────────────────────────────────────────────────────────
   Every design paints with --al-c (the severity colour), --al-tint and --al-line, so ONE rule serves all six
   severities and re-themes with the site. Nothing here hardcodes a colour — the no-hex guard in
   tests/unit/educo-components.test.ts fails the build if it does.

   WHY THERE ARE SO MANY: the Alert is the block a school reaches for most (a closure notice, an open day, a
   fees deadline) and it shipped with 7 designs while the Accordion had 54. The sources the plan studied —
   Bootstrap's spec and 28 real-world designs from Colorlib among them — carry far more variety than 7. */

/* Signature */
.eu-root .eu-alert--split { padding: 0; overflow: hidden; align-items: stretch; gap: 0; }
.eu-root .eu-alert--split .eu-alert__icon { display: grid; place-items: center; background: var(--al-c); color: var(--eu-color-on-brand); padding: var(--eu-space-4); align-self: stretch; }
.eu-root .eu-alert--split .eu-alert__content { padding: var(--eu-space-4) var(--eu-space-5); }
.eu-root .eu-alert--ribbon { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); position: relative; overflow: hidden; }
.eu-root .eu-alert--ribbon::before { content: ""; position: absolute; inset-block-start: 0; inset-inline-start: 0; border-block-start: 2.2rem solid var(--al-c); border-inline-end: 2.2rem solid transparent; }
.eu-root .eu-alert--ticket { background: var(--al-tint); border: 1px dashed var(--al-line); position: relative; }
.eu-root .eu-alert--ticket::before, .eu-root .eu-alert--ticket::after { content: ""; position: absolute; inline-size: 0.9rem; block-size: 0.9rem; border-radius: var(--eu-radius-full); background: var(--eu-color-bg); inset-block-start: calc(50% - 0.45rem); }
.eu-root .eu-alert--ticket::before { inset-inline-start: -0.5rem; }
.eu-root .eu-alert--ticket::after { inset-inline-end: -0.5rem; }
.eu-root .eu-alert--note { background: var(--al-tint); border: 0; border-radius: var(--eu-radius-sm); box-shadow: var(--eu-shadow-md); border-block-end: 3px solid var(--al-c); }
.eu-root .eu-alert--terminal { background: var(--eu-color-neutral-900); border: 1px solid var(--al-c); border-radius: var(--eu-radius-sm); font-family: var(--eu-font-mono); }
.eu-root .eu-alert--terminal .eu-alert__title, .eu-root .eu-alert--terminal .eu-alert__icon { color: var(--al-c); }
.eu-root .eu-alert--terminal .eu-alert__body { color: var(--eu-color-neutral-200); }
.eu-root .eu-alert--bubble { background: var(--al-tint); border: 1px solid var(--al-line); border-radius: var(--eu-radius-lg); position: relative; }
.eu-root .eu-alert--bubble::after { content: ""; position: absolute; inset-block-end: -0.55rem; inset-inline-start: var(--eu-space-6); inline-size: 0.9rem; block-size: 0.9rem; background: var(--al-tint); border-inline-end: 1px solid var(--al-line); border-block-end: 1px solid var(--al-line); transform: rotate(45deg); }
.eu-root .eu-alert--stripe { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); position: relative; overflow: hidden; padding-inline-start: var(--eu-space-6); }
.eu-root .eu-alert--stripe::before { content: ""; position: absolute; inset-block: 0; inset-inline-start: 0; inline-size: 0.5rem; background: repeating-linear-gradient(45deg, var(--al-c) 0 0.28rem, transparent 0.28rem 0.56rem); }
.eu-root .eu-alert--inset { background: var(--al-tint); border: 0; box-shadow: inset 0 2px 6px color-mix(in oklab, var(--al-c) 25%, transparent); }
.eu-root .eu-alert--underline { background: transparent; border: 0; border-block-end: 2px solid var(--al-c); border-radius: 0; padding-inline: 0; }
.eu-root .eu-alert--bracket { background: transparent; border: 0; border-inline-start: 2px solid var(--al-c); border-block-start: 2px solid var(--al-c); border-block-end: 2px solid var(--al-c); border-start-start-radius: var(--eu-radius-md); border-end-start-radius: var(--eu-radius-md); }
.eu-root .eu-alert--frame { background: var(--eu-color-surface); border: 2px solid var(--al-c); outline: 1px solid var(--al-line); outline-offset: 3px; }
.eu-root .eu-alert--shadowed { background: var(--eu-color-surface); border: 1px solid var(--al-line); box-shadow: 0.35rem 0.35rem 0 color-mix(in oklab, var(--al-c) 30%, transparent); }
.eu-root .eu-alert--elevated { background: var(--eu-color-surface); border: 0; border-radius: var(--eu-radius-lg); box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-alert--gradient { background: linear-gradient(135deg, var(--al-c), color-mix(in oklab, var(--al-c) 45%, var(--eu-color-surface))); border-color: transparent; }
.eu-root .eu-alert--gradient .eu-alert__title, .eu-root .eu-alert--gradient .eu-alert__body, .eu-root .eu-alert--gradient .eu-alert__icon { color: var(--eu-color-on-brand); }
.eu-root .eu-alert--duotone { background: linear-gradient(90deg, var(--al-c) 0 0.4rem, var(--al-tint) 0.4rem); border: 1px solid var(--al-line); padding-inline-start: var(--eu-space-6); }

/* Icon treatment */
.eu-root .eu-alert.eu-alert--icon-square .eu-alert__icon { background: var(--al-c); color: var(--eu-color-on-brand); padding: var(--eu-space-2); border-radius: var(--eu-radius-sm); }
.eu-root .eu-alert.eu-alert--icon-circle .eu-alert__icon { background: var(--al-c); color: var(--eu-color-on-brand); padding: var(--eu-space-2); border-radius: var(--eu-radius-full); }
.eu-root .eu-alert.eu-alert--icon-outline .eu-alert__icon { border: 1.5px solid var(--al-c); padding: var(--eu-space-2); border-radius: var(--eu-radius-full); }
.eu-root .eu-alert.eu-alert--icon-top { flex-direction: column; align-items: flex-start; }
.eu-root .eu-alert.eu-alert--icon-right { flex-direction: row-reverse; }
.eu-root .eu-alert.eu-alert--icon-big .eu-alert__icon { font-size: 1.75em; }
.eu-root .eu-alert.eu-alert--no-icon .eu-alert__icon { display: none; }

/* Shape */
.eu-root .eu-alert.eu-alert--sharp { border-radius: 0; }
.eu-root .eu-alert.eu-alert--round { border-radius: var(--eu-radius-xl); }
.eu-root .eu-alert.eu-alert--pill { border-radius: var(--eu-radius-full); padding-inline: var(--eu-space-6); }
.eu-root .eu-alert.eu-alert--cut { border-radius: 0; clip-path: polygon(0.7rem 0, 100% 0, 100% calc(100% - 0.7rem), calc(100% - 0.7rem) 100%, 0 100%, 0 0.7rem); }
.eu-root .eu-alert.eu-alert--lean { border-start-start-radius: var(--eu-radius-xl); border-end-end-radius: var(--eu-radius-xl); border-start-end-radius: var(--eu-radius-sm); border-end-start-radius: var(--eu-radius-sm); }

/* Border and rule */
.eu-root .eu-alert.eu-alert--dashed {  border: 1.5px dashed var(--al-c); }
.eu-root .eu-alert.eu-alert--dotted {  border: 2px dotted var(--al-c); }
.eu-root .eu-alert.eu-alert--double {  border: 4px double var(--al-c); }
.eu-root .eu-alert.eu-alert--thick-left {  border: 1px solid var(--eu-color-border); border-inline-start: 0.5rem solid var(--al-c); }
.eu-root .eu-alert.eu-alert--thick-top {  border: 1px solid var(--eu-color-border); border-block-start: 0.4rem solid var(--al-c); }
.eu-root .eu-alert.eu-alert--thick-bottom {  border: 1px solid var(--eu-color-border); border-block-end: 0.4rem solid var(--al-c); }
.eu-root .eu-alert.eu-alert--hairline { border-width: 1px; border-style: solid; border-color: color-mix(in oklab, var(--al-c) 16%, transparent); }

/* Density and emphasis */
.eu-root .eu-alert.eu-alert--compact { padding: var(--eu-space-2) var(--eu-space-3); gap: var(--eu-space-2); font-size: var(--eu-text-sm); }
.eu-root .eu-alert.eu-alert--spacious { padding: var(--eu-space-6); gap: var(--eu-space-4); }
.eu-root .eu-alert.eu-alert--large { font-size: var(--eu-text-lg); }
.eu-root .eu-alert.eu-alert--large .eu-alert__title { font-size: var(--eu-text-xl); }
.eu-root .eu-alert--quiet { background: transparent; border-color: transparent; }
.eu-root .eu-alert--quiet .eu-alert__title, .eu-root .eu-alert--quiet .eu-alert__icon { color: var(--eu-color-muted); }
.eu-root .eu-alert.eu-alert--loud { background: var(--al-c); border-color: transparent; box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-alert.eu-alert--loud .eu-alert__title, .eu-root .eu-alert.eu-alert--loud .eu-alert__body, .eu-root .eu-alert.eu-alert--loud .eu-alert__icon { color: var(--eu-color-on-brand); }
.eu-root .eu-alert.eu-alert--loud .eu-alert__title { font-weight: var(--eu-weight-bold); }
.eu-root .eu-alert.eu-alert--strong-title .eu-alert__title { font-weight: var(--eu-weight-bold); letter-spacing: var(--eu-tracking-tight); }
.eu-root .eu-alert.eu-alert--caps-title .eu-alert__title { text-transform: uppercase; letter-spacing: var(--eu-tracking-wide); font-size: var(--eu-text-sm); }

/* Layout */
.eu-root .eu-alert.eu-alert--centred { flex-direction: column; align-items: center; text-align: center; }
.eu-root .eu-alert.eu-alert--end { flex-direction: row-reverse; text-align: end; }
.eu-root .eu-alert.eu-alert--inline-title { align-items: center; }
.eu-root .eu-alert.eu-alert--inline-title .eu-alert__content { display: flex; align-items: baseline; gap: var(--eu-space-2); flex-wrap: wrap; }
.eu-root .eu-alert.eu-alert--narrow { max-inline-size: 32rem; }
.eu-root .eu-alert.eu-alert--flush { border-inline: 0; border-radius: 0; padding-inline: var(--eu-space-6); }

/* ── Alert actions ─────────────────────────────────────────────────────────────────────────────────
   Buttons and links ON a message: cookie consent (Manage / Accept), a promo bar, "Update information",
   "Learn more". The severity still supplies the colour through --al-c, so an action inherits the meaning of
   the message it sits on rather than introducing a second one.
   Focus is styled explicitly and never removed: these are the only interactive things inside an alert. */
.eu-root .eu-alert__actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--eu-space-2); margin-block-start: var(--eu-space-3); }
.eu-root .eu-alert__action {
  display: inline-flex; align-items: center; gap: var(--eu-space-1);
  padding: var(--eu-space-2) var(--eu-space-4); border-radius: var(--eu-radius-md);
  font: inherit; font-weight: var(--eu-weight-semibold); font-size: var(--eu-text-sm);
  line-height: var(--eu-leading-snug); text-decoration: none; cursor: pointer; border: 1px solid transparent;
  transition: background-color var(--eu-dur-fast) var(--eu-ease-standard), color var(--eu-dur-fast) var(--eu-ease-standard), border-color var(--eu-dur-fast) var(--eu-ease-standard);
}
.eu-root .eu-alert__action--primary { background: var(--al-c); color: var(--eu-color-on-brand); }
.eu-root .eu-alert__action--secondary { background: transparent; color: var(--al-c); border-color: var(--al-c); }
.eu-root .eu-alert__action--link { background: transparent; color: var(--al-c); padding-inline: 0; text-decoration: underline; text-underline-offset: 0.2em; }
.eu-root .eu-alert__action--link::after { content: " →"; }
.eu-root .eu-alert__action:hover { filter: brightness(1.06); }
.eu-root .eu-alert__action--secondary:hover { background: color-mix(in oklab, var(--al-c) 12%, transparent); }
.eu-root .eu-alert__action:focus-visible { outline: 2px solid var(--al-c); outline-offset: 2px; }

/* On a SOLID or LOUD alert the surface is already the severity colour, so an action painted in it would vanish.
   These flip to the on-brand colour instead — checked per design rather than assumed. */
.eu-root .eu-alert--solid .eu-alert__action--primary,
.eu-root .eu-alert.eu-alert--loud .eu-alert__action--primary,
.eu-root .eu-alert--gradient .eu-alert__action--primary { background: var(--eu-color-on-brand); color: var(--al-c); }
.eu-root .eu-alert--solid .eu-alert__action--secondary,
.eu-root .eu-alert.eu-alert--loud .eu-alert__action--secondary,
.eu-root .eu-alert--gradient .eu-alert__action--secondary { color: var(--eu-color-on-brand); border-color: var(--eu-color-on-brand); }
.eu-root .eu-alert--solid .eu-alert__action--link,
.eu-root .eu-alert.eu-alert--loud .eu-alert__action--link,
.eu-root .eu-alert--gradient .eu-alert__action--link { color: var(--eu-color-on-brand); }
.eu-root .eu-alert--terminal .eu-alert__action--primary { background: var(--al-c); color: var(--eu-color-neutral-900); }

/* Actions ON THE RIGHT — written MOBILE-FIRST (RULE R). The base is the stacked layout a phone gets, and the
   side-by-side arrangement is ADDED from the sm rung up. Writing it the other way round (side-by-side by
   default, undone by a max-width query) is the inversion the Responsive Field Guide warns against, and a button
   pushed off the side of a phone is worse than one sitting below the text. */
.eu-root .eu-alert--actions-right { align-items: flex-start; flex-wrap: wrap; }
.eu-root .eu-alert--actions-right .eu-alert__actions { margin-inline-start: 0; margin-block-start: var(--eu-space-3); flex-basis: 100%; }
@media (min-width: 40em) {
  .eu-root .eu-alert--actions-right { align-items: center; flex-wrap: nowrap; }
  .eu-root .eu-alert--actions-right .eu-alert__actions { margin-block-start: 0; margin-inline-start: auto; flex: none; flex-basis: auto; }
}

/* AUTO-DISMISS countdown. Pure CSS: the bar shows the time passing without a line of script, and the script
   is needed only to act when it runs out. It PAUSES on hover and on keyboard focus inside the alert — an
   auto-dismissing message the reader cannot hold still is a WCAG 2.2.1 failure, and it is also just rude. */
.eu-root .eu-alert { position: relative; }
.eu-root .eu-alert__progress {
  position: absolute; inset-inline: 0; inset-block-end: 0; block-size: 0.1875rem;
  transform-origin: left center; background: var(--al-c); opacity: .55;
  animation: eu-alert-countdown var(--al-auto, 5s) linear forwards;
}
.eu-root .eu-alert:hover .eu-alert__progress,
.eu-root .eu-alert:focus-within .eu-alert__progress { animation-play-state: paused; }
@keyframes eu-alert-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
/* Reduced motion keeps the bar (it is information, not decoration) but stops it sliding. */
@media (prefers-reduced-motion: reduce) {
  .eu-root .eu-alert__progress { animation: none; transform: scaleX(1); opacity: .3; }
}

.eu-root .eu-alert-stack--toast { align-items: stretch; }
.eu-root .eu-alert-stack--toast .eu-alert { box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-alert__meta { margin-inline-start: auto; color: var(--eu-color-muted); font-size: 0.85em; align-self: flex-start; }
.eu-root .eu-alert__sub { display: flex; flex-direction: column; gap: var(--eu-space-2); margin-block-start: var(--eu-space-2); padding-inline-start: var(--eu-space-3); border-inline-start: 2px solid color-mix(in oklab, var(--al-c) 30%, transparent); }
.eu-root .eu-alert__sub .eu-alert { padding: var(--eu-space-3) var(--eu-space-4); }
.eu-root .eu-alert__body a { color: inherit; text-decoration: underline; }

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
