import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Locks the Educo UI "token bridge" (State 1): both globals.css files must map semantic Tailwind
 * utilities (bg-surface, text-ink, text-muted, border-line, bg-brand) onto --eu-color-* variables,
 * and define those variables for all four app themes. This is what makes the whole app token-driven.
 */
const FILES = ["app/globals.css", "apps/admin/app/globals.css"];
const read = (f: string) => readFileSync(resolve(process.cwd(), f), "utf8");

describe("Educo UI token bridge (globals.css)", () => {
  for (const f of FILES) {
    describe(f, () => {
      const css = read(f);

      it("maps semantic Tailwind utilities to --eu-color-* in @theme", () => {
        expect(css).toContain("--color-surface: var(--eu-color-surface)");
        expect(css).toContain("--color-ink: var(--eu-color-text)");
        expect(css).toContain("--color-muted: var(--eu-color-muted)");
        expect(css).toContain("--color-line: var(--eu-color-border)");
        expect(css).toContain("--color-brand: var(--eu-color-brand)");
        expect(css).toContain("--color-canvas: var(--eu-color-bg)");
      });

      it("defines the semantic tokens for all four themes", () => {
        // light (:root) + the three dark-based themes
        expect(css).toMatch(/:root\s*\{[^}]*--eu-color-surface:\s*#ffffff/);
        expect(css).toMatch(/html\.dark\s*\{[^}]*--eu-color-surface:\s*#1a1d24/);
        expect(css).toMatch(/html\.midnight\s*\{[^}]*--eu-color-surface:\s*#0f1729/);
        expect(css).toMatch(/html\.purple\s*\{[^}]*--eu-color-surface:\s*#2a1a3e/);
      });

      it("keeps a canvas/text token per theme so nothing renders unthemed", () => {
        for (const key of ["--eu-color-bg", "--eu-color-text", "--eu-color-border", "--eu-color-brand"]) {
          // appears at least once per theme block (4 themes) → >= 4 occurrences
          const count = css.split(key).length - 1;
          expect(count).toBeGreaterThanOrEqual(4);
        }
      });
    });
  }
});
