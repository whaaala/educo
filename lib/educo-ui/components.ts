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
  font-family: var(--eu-font-body); font-weight: var(--eu-weight-semibold); font-size: var(--eu-text-sm);
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
.eu-root .eu-card { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-lg); padding: var(--eu-space-6); box-shadow: var(--eu-shadow-sm); }
.eu-root .eu-card--flat { box-shadow: none; }
.eu-root .eu-card--raised { box-shadow: var(--eu-shadow-lg); }
.eu-root .eu-card__title { font-family: var(--eu-font-heading); font-weight: var(--eu-weight-bold); font-size: var(--eu-text-xl); margin-block-end: var(--eu-space-2); }

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
.eu-root .eu-badge { display: inline-flex; align-items: center; gap: var(--eu-space-1); font-size: var(--eu-text-xs); font-weight: var(--eu-weight-semibold); padding: var(--eu-space-1) var(--eu-space-2); border-radius: var(--eu-radius-full); background: var(--eu-color-neutral-100); color: var(--eu-color-text); }
.eu-root .eu-badge--brand   { background: var(--eu-color-brand);   color: var(--eu-color-on-brand); }
.eu-root .eu-badge--success { background: var(--eu-color-success); color: var(--eu-color-on-brand); }
.eu-root .eu-badge--warning { background: var(--eu-color-warning); color: var(--eu-color-on-brand); }
.eu-root .eu-badge--danger  { background: var(--eu-color-danger);  color: var(--eu-color-on-brand); }
.eu-root .eu-badge--info    { background: var(--eu-color-info);    color: var(--eu-color-on-brand); }

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
`.trim();

/** The component layer on its own (base.ts owns reset/utilities; tokens.ts owns the variables). */
export function componentCss(): string {
  return COMPONENT_CSS;
}
