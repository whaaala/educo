import { describe, it, expect } from "vitest";
import { COMPONENT_CSS, componentCss } from "@/lib/educo-ui/components";
import { stylesheet } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("Educo UI component styles", () => {
  it("provides the core components (button/card/input/badge/alert/link)", () => {
    for (const cls of [".eu-btn", ".eu-card", ".eu-input", ".eu-field", ".eu-badge", ".eu-alert", ".eu-link", ".eu-section"]) {
      expect(COMPONENT_CSS).toContain(cls);
    }
  });

  it("provides the Phase 1 interactive components (accordion/tabs/navbar)", () => {
    for (const cls of [".eu-accordion", ".eu-accordion__item", ".eu-accordion__header", ".eu-tabs__list", ".eu-tab", ".eu-tabs__panel", ".eu-navbar", ".eu-navbar__link"]) {
      expect(COMPONENT_CSS).toContain(cls);
    }
    // accordion is CSS-only (native <details>): open state + selected tab are attribute-driven
    expect(COMPONENT_CSS).toContain(".eu-accordion__item[open]");
    expect(COMPONENT_CSS).toContain('.eu-tab[aria-selected="true"]');
    expect(COMPONENT_CSS).toContain(".eu-tabs__panel[hidden]");
  });

  it("offers many token-driven accordion variants (≥20 distinct designs)", () => {
    const variants = ["--flush", "--separated", "--filled", "--accent", "--chevron", "--numbered", "--plus-circle",
      "--arrow", "--left", "--pill", "--ghost", "--elevated", "--brand-header", "--underline", "--large", "--compact",
      "--zebra", "--body-tint", "--divided", "--square", "--rail", "--switch", "--gradient", "--soft", "--tag", "--line",
      "--stepper", "--outline", "--glass", "--timeline", "--minimal",
      // bold, structurally-distinct designs (grounded in a live study of the 4 source sites)
      "--horizontal", "--panel", "--index", "--bubble", "--alt", "--bignum",
      "--qa", "--callout", "--float", "--folder", "--news", "--ring", "--stripe", "--dashed",
      "--enclosed", "--menu", "--quote", "--invert", "--grid", "--gradient-full", "--spotlight", "--corner", "--split"];
    for (const v of variants) expect(COMPONENT_CSS).toContain(`.eu-accordion${v}`);
    expect(variants.length).toBeGreaterThanOrEqual(40);
    // the dark-glossy "invert" swaps text/bg tokens rather than hardcoding a dark colour
    expect(COMPONENT_CSS).toContain(".eu-accordion--invert { background: var(--eu-color-text)");
    // the two-column grid reflows to one column on the ACCORDION's OWN width (intrinsic auto-fit, no breakpoint)
    expect(COMPONENT_CSS).toContain("repeat(auto-fit, minmax(min(100%, 15rem), 1fr))");
    // horizontal accordion reflows to a vertical stack based on its own width — CONTAINER query, not viewport
    expect(COMPONENT_CSS).toContain("writing-mode: vertical-rl");
    expect(COMPONENT_CSS).toContain("@container (max-width: 40rem)");
    expect(COMPONENT_CSS).not.toContain("@media (max-width: 40rem)"); // no viewport breakpoints for reflow
    // horizontal panels tint from the token ramps (Articulate / Dribbble colored fan), never hardcoded hues
    expect(COMPONENT_CSS).toContain(".eu-accordion--horizontal .eu-accordion__item:nth-child(4n+1)");
    // circular avatar helper for pill rows (Dribbble kffein)
    expect(COMPONENT_CSS).toContain(".eu-accordion__media--round");
    // frosted glass uses token-driven translucency (color-mix), never a hardcoded rgba
    expect(COMPONENT_CSS).toContain("color-mix(in oklab, var(--eu-color-surface)");
    // content helpers: pricing/menu meta slot, image thumbnail, and nested sub-accordions
    expect(COMPONENT_CSS).toContain(".eu-accordion__meta");
    expect(COMPONENT_CSS).toContain(".eu-accordion__media");
    expect(COMPONENT_CSS).toContain(".eu-accordion .eu-accordion");
    // responsive robustness: long titles wrap, the indicator never shrinks
    expect(COMPONENT_CSS).toContain("overflow-wrap: anywhere");
    expect(COMPONENT_CSS).toContain("flex: 0 0 auto");
    // Responsive Field Guide: the accordion is a container context + fluid type (scales with its OWN width)
    expect(COMPONENT_CSS).toContain("container-type: inline-size");
    expect(COMPONENT_CSS).toMatch(/font-size: clamp\([^)]*cqi/); // clamp() driven by container-query units
    // no hardcoded hex anywhere in the variants — all token-driven
    expect(COMPONENT_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    // theme-safe indicators: chevron/currentColor, deterministic numbering, gradients from tokens
    expect(COMPONENT_CSS).toContain("border-right: 2px solid currentColor");
    // numbered designs read the item's ordinal from a per-item CSS var (deterministic in editor + export),
    // never a CSS counter (which fails to accumulate in the editor's DOM)
    expect(COMPONENT_CSS).toContain("content: var(--eu-n0");
    expect(COMPONENT_CSS).not.toContain("counter(eu-");
    expect(COMPONENT_CSS).toContain("linear-gradient(90deg, var(--eu-color-primary-50), var(--eu-color-accent-50))");
  });

  it("offers the button variants and sizes", () => {
    for (const v of ["--primary", "--secondary", "--outline", "--ghost", "--danger", "--sm", "--lg", "--block"]) {
      expect(COMPONENT_CSS).toContain(`.eu-btn${v}`);
    }
  });

  it("is entirely token-driven — no hardcoded hex colours", () => {
    expect(COMPONENT_CSS).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(COMPONENT_CSS).toContain("var(--eu-color-brand)");
    expect(COMPONENT_CSS).toContain("var(--eu-radius-md)");
  });

  it("is scoped under .eu-root so it never leaks into the editor", () => {
    // every rule block is prefixed with .eu-root
    const selectors = COMPONENT_CSS.split("{").slice(0, -1).map((s) => s.split("}").pop()!.trim()).filter(Boolean);
    for (const sel of selectors) {
      if (sel.startsWith("/*") || sel.startsWith("@")) continue;
      expect(sel.includes(".eu-root")).toBe(true);
    }
  });

  it("uses states + motion tokens (hover/disabled/transition)", () => {
    expect(COMPONENT_CSS).toContain(":hover");
    expect(COMPONENT_CSS).toContain(":disabled");
    expect(COMPONENT_CSS).toContain("var(--eu-ease-standard)");
  });

  it("stylesheet(theme) now bundles tokens + base + components", () => {
    const css = stylesheet(DEFAULT_THEME);
    expect(css).toContain("--eu-color-primary-500:#"); // tokens
    expect(css).toContain(".eu-container");            // base
    expect(css).toContain(".eu-btn--primary");         // components
  });

  it("componentCss() returns the same sheet", () => {
    expect(componentCss()).toBe(COMPONENT_CSS);
  });
});
