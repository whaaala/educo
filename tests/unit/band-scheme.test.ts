import { describe, it, expect } from "vitest";
import { createContainer, containerStyle, bandScheme, type BoxNode } from "@/lib/box-model";
import { contrastRatio } from "@/lib/educo-ui/color";

/**
 * A BAND'S COLOUR SCHEME FOLLOWS ITS BACKGROUND (#92) — contrast is asserted, never assumed (Core Rule 17, Rule D).
 * Measured through the UI: a call-to-action band and a footer coloured dark blue kept the page's dark words (71 text
 * elements under WCAG contrast on one page); then, with ramp shades, grey words on pale tinted bands read 4.29–4.41:1,
 * and a sweep showed no ramp shade reads on a mid-tone band. The colours are computed from the band.
 * Behaviours: tests/features/components/website/box-builder-design.feature ("Words stay readable on a coloured band").
 */
const hsl = (h: number, s: number, l: number) => { s /= 100; l /= 100; const k = (n: number) => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l); const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join(""); };
const SWEEP: string[] = []; for (let h = 0; h < 360; h += 30) for (const s of [0, 40, 80]) for (let l = 0; l <= 100; l += 5) SWEEP.push(hsl(h, s, l));
const best = (bg: string) => Math.max(contrastRatio("#000000", bg), contrastRatio("#ffffff", bg));
const band = (background?: string, extra: Partial<BoxNode> = {}) => createContainer("column", { id: "b", background, ...extra } as Partial<BoxNode>);
const v = (s: object, k: string) => (s as Record<string, string>)[k];

describe("the words on a coloured band always read", () => {
  it(`every one of ${SWEEP.length} band colours: words ≥ 7:1 and muted words ≥ 4.5:1 — against the band AND a card on it (or the best any colour can)`, () => {
    for (const bg of SWEEP) {
      const s = bandScheme(bg)!.vars; const surf = s["--eu-color-surface"];
      const bestHere = Math.min(best(bg), best(surf));
      for (const [k, want] of [["--bx-text", 7], ["--bx-text-muted", 4.5], ["--eu-color-text", 7], ["--eu-color-muted", 4.5], ["--bx-link", 4.5]] as const) {
        const got = Math.min(contrastRatio(s[k], bg), contrastRatio(s[k], surf));
        expect(got, `${k} on ${bg}`).toBeGreaterThanOrEqual(Math.min(want, bestHere) - 0.05);
      }
    }
  });
  it("the reported cases: dark blue, and grey words on pale tints", () => {
    for (const bg of ["#1e3a8a", "#eef2ff", "#fef2f2", "#f5f5f8"]) {
      const s = bandScheme(bg)!.vars;
      expect(contrastRatio(s["--bx-text-muted"], bg), bg).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("words are a TINT of the band, not pure black or white (Rule #2.9) — where a tint can reach the ratio", () => {
    for (const bg of ["#1e3a8a", "#eef2ff", "#064e3b"]) { const t = bandScheme(bg)!.vars["--bx-text"]; expect(t, bg).not.toMatch(/^#(000000|ffffff)$/); }
  });
  it("the side is the one that reads better: dark band → light words, light band → dark words", () => {
    for (const bg of SWEEP) expect(bandScheme(bg)!.dark, bg).toBe(contrastRatio("#ffffff", bg) > contrastRatio("#000000", bg));
  });
  it("containerStyle carries it (canvas and page use the same function)", () => {
    const s = containerStyle(band("#1e3a8a"));
    expect(v(s, "--bx-text")).toBe(bandScheme("#1e3a8a")!.vars["--bx-text"]);
    expect(v(s, "--eu-color-surface")).toBeTruthy();
  });
  it("rgb() and 8-digit hex count; a see-through one does not decide anything", () => {
    expect(bandScheme("rgb(30, 58, 138)")?.dark).toBe(true);
    expect(bandScheme("#1e3a8aff")?.dark).toBe(true);
    expect(bandScheme("rgba(30, 58, 138, 0.3)")).toBeNull();
    expect(bandScheme("#1e3a8a40")).toBeNull();
  });
  it("no scheme is imposed where the background cannot be read: none, a gradient, a photo, a token", () => {
    for (const b of [band(undefined), band("gradient:linear-gradient(#000,#fff)"), band("#1e3a8a", { bgImage: "https://x/y.jpg" } as Partial<BoxNode>), band("var(--eu-color-brand)")])
      expect(v(containerStyle(b), "--bx-text")).toBeUndefined();
  });
});
