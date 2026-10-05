import { describe, it, expect } from "vitest";
import { readableLink, tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { contrastRatio } from "@/lib/educo-ui/color";
import { APP_THEME_BASE, DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import { createContainer, createElement, normalizeRowBands, LINK_COLOR_CSS } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";

/**
 * A LINK READS ON THE PAGE (#108) — behaviours in tests/features/components/website/box-builder-content.feature.
 *
 * Measured by the page audit on every dressed page: a menu link in the brand indigo read 3.02:1 on the Midnight
 * background and 2.9:1 on Dark. The brand is chosen for white words on a button; as words on a dark page it is not
 * readable, so the link has its own token, the brand moved until it reads.
 */
describe("the link token reads 4.5:1 on the page and on a card, in every website theme", () => {
  for (const id of Object.keys(APP_THEME_BASE)) {
    it(`${id}: on the background and on the surface`, () => {
      const t = resolveSiteTheme(DEFAULT_THEME, id);
      const link = tokensFromTheme(t).color.link;
      expect(contrastRatio(link, t.background), `on ${t.background}`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(link, t.surface), `on ${t.surface}`).toBeGreaterThanOrEqual(4.5);
    });
  }
  it("a brand that already reads is returned untouched (light: nothing that was right changes)", () => {
    const t = resolveSiteTheme(DEFAULT_THEME, "light");
    expect(readableLink(t.primary, t.background, t.surface)).toBe(t.primary);
  });
  it("…and a brand that does not is moved, keeping its hue", () => {
    const t = resolveSiteTheme(DEFAULT_THEME, "midnight");
    expect(contrastRatio(t.primary, t.background)).toBeLessThan(4.5); // the measured 3.02:1 — the precondition is real
    expect(readableLink(t.primary, t.background, t.surface)).not.toBe(t.primary);
  });
  it("the Stat's number — the brand as words — reads through the link token too (#139)", async () => {
    const { buildCatalogueComponent } = await import("@/lib/component-catalogue");
    const stat = buildCatalogueComponent("stat")!;
    const number = (stat.children ?? []).find((c) => c.type === "heading")!;
    expect(number.color).toBe("var(--eu-color-link, var(--eu-color-brand))");
  });
  it("is emitted as --eu-color-link, and both engines' links fall back to it before the brand", () => {
    expect(tokensToCss(tokensFromTheme(resolveSiteTheme(DEFAULT_THEME, "midnight")))).toMatch(/--eu-color-link:#[0-9a-f]{6};/);
    expect(LINK_COLOR_CSS).toBe("var(--bx-link, var(--eu-color-link, var(--eu-color-brand)))");
    const root = normalizeRowBands(createContainer("column", { id: "page", width: "fill", children: [createElement("link", { text: "About", href: "/about" })] }));
    expect(renderPageHTML(root, resolveSiteTheme(DEFAULT_THEME, "midnight"))).toContain(`color:${LINK_COLOR_CSS}`);
  });
});
