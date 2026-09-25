import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokensFromTheme } from "@/lib/educo-ui/tokens";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * Locks the Educo UI "token bridge" (State 1): both globals.css files must map semantic Tailwind
 * utilities (bg-surface, text-ink, text-muted, border-line, bg-brand) onto --eu-color-* variables,
 * and define those variables for all four app themes. This is what makes the whole app token-driven.
 */
const FILES = ["app/globals.css", "apps/admin/app/globals.css"];
/** Line endings normalised at the point of READING: git checks this repo out with CRLF on Windows, so an
 *  assertion spanning a line break otherwise fails on a file nobody has touched. Doing it here immunises
 *  every assertion in this file, including ones added later. Guarded by `source-reading-tests.test.ts`. */
const read = (f: string) => readFileSync(resolve(process.cwd(), f), "utf8").replace(/\r\n/g, "\n");

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

      it("exposes the theme-independent tokens on :root, and they MATCH the generated scale", () => {
        /**
         * THIS USED TO SAMPLE THREE VALUES, one of which it pinned as `--eu-radius-lg: 16px`.
         *
         * These declarations are a hand-written copy of what `tokensFromTheme()` generates — necessary,
         * because the app CHROME sits outside `.eu-root` and cannot read the generated set. A copy that is
         * only spot-checked drifts, and this one had: spacing and type were rem and matched, while the whole
         * radius scale sat in pixels. So every rounded corner in the app chrome ignored a reader who had
         * enlarged their browser text, and the numbers silently disagreed with `--eu-radius-*` inside the
         * builder — where they had been moved to rem for Core Rule 16.
         *
         * It was found by MEASURING, not by reading: a card's computed radius scaled correctly while
         * `--eu-radius-lg` read `16px` off the document element, and that contradiction exposed the copy.
         *
         * So the copy is now compared with the generator, key by key. A scale written twice is checked twice.
         */
        const t = tokensFromTheme(DEFAULT_THEME);
        // `.75rem` and `0.75rem` are the same length; the shells write the shorter form.
        const norm = (v: string) => v.trim().replace(/(^|\s)\./g, "$10.");
        const declared = (name: string) => {
          const m = new RegExp(`--eu-${name}\\s*:\\s*([^;]+);`).exec(css);
          return m ? norm(m[1]) : null;
        };

        for (const [k, want] of Object.entries(t.radius)) {
          expect(declared(`radius-${k}`), `--eu-radius-${k} is missing or has drifted from tokensFromTheme()`).toBe(norm(want));
        }
        // The shells carry a SUBSET of the spacing and type steps, so only what they declare is compared —
        // a missing step is a different (and harmless) thing from a step that disagrees.
        for (const [k, want] of Object.entries(t.space)) {
          const got = declared(`space-${k}`);
          if (got !== null) expect(got, `--eu-space-${k} has drifted`).toBe(norm(want));
        }
        for (const [k, want] of Object.entries(t.text)) {
          const got = declared(`text-${k}`);
          if (got !== null) expect(got, `--eu-text-${k} has drifted`).toBe(norm(want));
        }
        // …and at least the anchors are present, so "they all matched" can never mean "none were declared".
        for (const k of ["radius-lg", "space-4", "text-base"]) expect(declared(k), `--eu-${k} is not declared at all`).not.toBeNull();
      });

      it("makes the Educo UI layout utilities available APP-WIDE (not scoped under .eu-root)", () => {
        for (const util of [".eu-container", ".eu-grid", ".eu-stack", ".eu-cluster", ".eu-media", ".eu-columns", ".eu-visually-hidden"]) {
          expect(css).toContain(util);
          // must be a standalone selector, never gated behind an .eu-root ancestor
          expect(css).not.toContain(`.eu-root ${util}`);
        }
        expect(css).toContain("repeat(auto-fit, minmax(");  // intrinsic responsive grid
        expect(css).toContain("container-type: inline-size"); // container queries
      });

      it("applies the responsive foundation (four ingredients) app-wide", () => {
        expect(css).toContain("font-size: 100%");            // ② respect user font size
        expect(css).toMatch(/img[^{]*\{[^}]*max-width: 100%/); // ③ flexible images
        expect(css).toContain("overflow-wrap: break-word");  // responsive text
        expect(css).toContain("prefers-reduced-motion: reduce"); // a11y
      });
    });
  }
});
