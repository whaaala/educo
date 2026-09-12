import { describe, it, expect } from "vitest";
import { BREAKPOINTS_EM, BASE_CSS, BREAKPOINTS, stylesheet } from "@/lib/educo-ui/base";
import { stripComments } from "@/lib/educo-ui/subset";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("Educo UI base stylesheet — the four responsive ingredients", () => {
  it("1. fluid layouts: a page measure the whole page can read", () => {
    // The measure now comes from the rung ladder in layout.ts and is set on the ROOT, so a band can read it.
    // It used to be `.eu-container { max-width: var(--eu-container-max, 1200px) }` — a variable no code ever
    // set, on a class no renderer ever emitted, shipped to every page.
    expect(BASE_CSS).toContain("--eu-measure:");
    expect(BASE_CSS).toContain(".eu-band");
  });

  it("ships NO class a renderer cannot emit", () => {
    // The layer used to carry 36 utility classes — .eu-grid, .eu-cluster, .eu-table, .eu-ratio-*, .eu-safe and
    // the rest. Nothing could ever apply one: the builder emits markup from the node tree and a user cannot
    // type a class name. They shipped to every page of every school site and could not affect a pixel.
    const shipped = stripComments(BASE_CSS);
    const declared = new Set([...shipped.matchAll(/\.(eu-[A-Za-z0-9_-]+)/g)].map((m) => m[1]));
    for (const c of declared) {
      expect(["eu-root", "eu-band", "eu-band--contained"], `.${c} is declared but nothing emits it`).toContain(c);
    }
  });

  it("2. responsive units: respects the user's font size and uses clamp() fluid type", () => {
    expect(BASE_CSS).toContain("font-size: 100%"); // never a fixed px on the root
    expect(BASE_CSS).toContain("clamp(");
    expect(BASE_CSS).toContain("var(--eu-text-base)");
  });

  it("3. flexible images: max-width 100% + height auto, by element", () => {
    expect(BASE_CSS).toMatch(/img[^{]*\{[^}]*max-width: 100%/);
    expect(BASE_CSS).toContain("height: auto");
    expect(BASE_CSS).toContain("display: block");
  });

  it("4. media queries: mobile-first min-width breakpoints", () => {
    // In `em`, not px: em breakpoints move with a reader who has raised their browser's base font.
    expect(BASE_CSS).toContain(`@media (min-width: ${BREAKPOINTS_EM.tabletPortrait}em)`);
    expect(BASE_CSS).toContain(`@media (min-width: ${BREAKPOINTS_EM.desktop}em)`);
    // These two were written as `/@media ([^)]*max-width[^)]*)/` and `/@media (min-width: d+px)/` — the parens
    // were capture groups and the `\d` had lost its backslash, so the px guard could never fail. Both are now
    // escaped, and both are mutation-tested.
    expect(BASE_CSS).not.toMatch(/@media \([^)]*max-width[^)]*\)/); // never desktop-first
    expect(BASE_CSS).not.toMatch(/@media \(min-width: \d+px\)/); // never a px breakpoint
    expect(BREAKPOINTS.tabletPortrait).toBeLessThan(BREAKPOINTS.desktop);
  });

  it("carries no container-query scaffolding, because nothing could opt a block into it", () => {
    // .eu-container-ctx and .eu-cq-* were shipped to every page and no renderer ever emitted one. Container
    // queries return with the Phase 2 controls that put a block into a query context.
    expect(BASE_CSS).not.toContain("container-type: inline-size");
    expect(BASE_CSS).not.toContain("@container");
  });

  it("has a reset and honours reduced-motion", () => {
    expect(BASE_CSS).toContain("box-sizing: border-box");
    expect(BASE_CSS).toContain("prefers-reduced-motion: reduce");
  });

  it("covers accessibility & basic UI: focus-visible, selection, accent-color", () => {
    expect(BASE_CSS).toContain(":focus-visible");
    expect(BASE_CSS).toContain("::selection");
    expect(BASE_CSS).toContain("accent-color");
  });

  it("covers forms, tables and responsive text — all addressed by element", () => {
    expect(BASE_CSS).toMatch(/textarea[^{]*\{[^}]*font: inherit/);
    // By ELEMENT, not by class: a table block emits a plain table tag, so .eu-table could never be on it.
    expect(BASE_CSS).toContain(".eu-root table");
    expect(BASE_CSS).toContain("border-collapse: collapse");
    expect(BASE_CSS).toContain("overflow-wrap: break-word");
  });

  it("covers motion tokens and print", () => {
    expect(BASE_CSS).toContain("var(--eu-ease-standard)");
    expect(BASE_CSS).toContain("var(--eu-dur-");
    expect(BASE_CSS).toContain("@media print");
    expect(BASE_CSS).toContain("break-inside: avoid");
  });

  it("is scoped under .eu-root so it never leaks into the editor chrome", () => {
    expect(BASE_CSS).toContain(".eu-root");
    // the root reset targets .eu-root descendants, not a bare universal selector
    expect(BASE_CSS).not.toMatch(/^\s*\*\s*,/m);
  });

  it("stylesheet(theme) bundles the token variables with the base rules", () => {
    const css = stylesheet(DEFAULT_THEME);
    expect(css).toContain("--eu-color-primary-500:#");
    expect(css).toContain("--eu-font-heading:");
    expect(css).toContain(".eu-band");
  });
});
