import { describe, it, expect } from "vitest";
import { BREAKPOINTS_EM, BASE_CSS, BREAKPOINTS, stylesheet } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("Educo UI base stylesheet — the four responsive ingredients", () => {
  it("1. fluid layouts: max-width containers + auto-fit grid + flex cluster", () => {
    expect(BASE_CSS).toContain(".eu-container");
    expect(BASE_CSS).toContain("max-width: var(--eu-container-max");
    expect(BASE_CSS).toContain("repeat(auto-fit, minmax(");
    expect(BASE_CSS).toContain(".eu-cluster");
  });

  it("2. responsive units: respects the user's font size and uses clamp() fluid type", () => {
    expect(BASE_CSS).toContain("font-size: 100%"); // never a fixed px on the root
    expect(BASE_CSS).toContain("clamp(");
    expect(BASE_CSS).toContain("var(--eu-text-base)");
  });

  it("3. flexible images: max-width 100% + height auto + aspect-ratio", () => {
    expect(BASE_CSS).toMatch(/img[^{]*\{[^}]*max-width: 100%/);
    expect(BASE_CSS).toContain("height: auto");
    expect(BASE_CSS).toContain("aspect-ratio");
  });

  it("4. media queries: mobile-first min-width breakpoints", () => {
    // In `em`, not px: em breakpoints move with a reader who has raised their browser's base font.
    expect(BASE_CSS).toContain(`@media (min-width: ${BREAKPOINTS_EM.md}em)`);
    expect(BASE_CSS).toContain(`@media (min-width: ${BREAKPOINTS_EM.lg}em)`);
    expect(BASE_CSS).not.toMatch(/@media ([^)]*max-width[^)]*)/); // never desktop-first
    expect(BASE_CSS).not.toMatch(/@media (min-width: d+px)/);      // never a px breakpoint
    expect(BREAKPOINTS.sm).toBeLessThan(BREAKPOINTS.lg);
  });

  it("adds container queries so blocks respond to their own container", () => {
    expect(BASE_CSS).toContain("container-type: inline-size");
    expect(BASE_CSS).toContain("@container");
  });

  it("has a reset and honours reduced-motion", () => {
    expect(BASE_CSS).toContain("box-sizing: border-box");
    expect(BASE_CSS).toContain("prefers-reduced-motion: reduce");
  });

  it("covers accessibility & basic UI: focus-visible, selection, sr-only, accent-color", () => {
    expect(BASE_CSS).toContain(":focus-visible");
    expect(BASE_CSS).toContain("::selection");
    expect(BASE_CSS).toContain(".eu-visually-hidden");
    expect(BASE_CSS).toContain("accent-color");
  });

  it("covers forms, tables, lists, columns and responsive text", () => {
    expect(BASE_CSS).toMatch(/textarea[^{]*\{[^}]*font: inherit/);
    expect(BASE_CSS).toContain(".eu-table");
    expect(BASE_CSS).toContain("border-collapse: collapse");
    expect(BASE_CSS).toContain(".eu-columns");
    expect(BASE_CSS).toContain("overflow-wrap: break-word");
    expect(BASE_CSS).toContain("line-clamp");
  });

  it("covers motion tokens, print, safe-area and scroll containment", () => {
    expect(BASE_CSS).toContain("var(--eu-ease-standard)");
    expect(BASE_CSS).toContain("var(--eu-dur-");
    expect(BASE_CSS).toContain("@media print");
    expect(BASE_CSS).toContain("env(safe-area-inset");
    expect(BASE_CSS).toContain("overscroll-behavior");
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
    expect(css).toContain(".eu-container");
  });
});
