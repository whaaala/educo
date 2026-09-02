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
