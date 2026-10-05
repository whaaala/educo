import { describe, it, expect } from "vitest";
import { documentBackdropCss } from "@/lib/box-export";
import type { SiteTheme } from "@/lib/site-storage";

/**
 * A PAGE SHORTER THAN THE SCREEN ENDS IN ITS OWN BACKGROUND — never in a slab of white nobody added.
 *
 * Behaviours: tests/features/components/website/box-builder-site.feature.
 *
 * Measured on an iPad Pro 11 (834 × 1210) with a three-band page: the content ended at 410px and 800 pixels
 * of white followed it, directly beneath a dark footer. Two thirds of the screen. Reported as exactly what
 * it looks like — "it looks like a user is seeing what they have not added."
 *
 * The rule chosen, and the three that were rejected:
 *   • CHOSEN — paint the DOCUMENT with the PAGE'S OWN BACKGROUND. One sentence a user already understands,
 *     theirs to set rather than the system guessing, and the same colour the builder paints the page with —
 *     so the two surfaces agree by construction rather than through a mirroring rule kept in sync by hand.
 *   • rejected — INFER the colour from the last band. This is what shipped first, and it works only when
 *     that band is a single full-width block. On a band holding two columns it picked ONE of them and
 *     painted the FULL WIDTH with it: a 28%-wide green stack produced a green slab beneath the entire page.
 *     Reported as "it covers everything, which is wrong". Abandoned rather than patched, because the
 *     condition for it being right could not be stated to a user in a sentence.
 *   • rejected — stretch the last band to `100vh`: that changes the user's layout and turns a 90px footer
 *     into an 800px one, which is adding the empty space this exists to remove.
 *   • rejected — a per-page setting: asking someone to fix a problem they did not cause.
 */

const theme = (background: string): SiteTheme => ({ background } as unknown as SiteTheme);

describe("the colour a short page ends in", () => {
  it("is the page's own background", () => {
    expect(documentBackdropCss(theme("#1f2937"))).toBe("html{background-color:#1f2937}");
  });

  it("is the page's background even when it is white — that is a choice, not an accident", () => {
    expect(documentBackdropCss(theme("#ffffff"))).toBe("html{background-color:#ffffff}");
  });

  /**
   * THE CASE THAT KILLED THE OLD RULE. Whatever the page is made of — one band, two columns, a footer in a
   * colour of its own — the backdrop is the PAGE's background and nothing else. The old rule read the
   * layout and could therefore be surprised by it; this one cannot be, which is the entire point.
   */
  it("does not depend on the layout at all", () => {
    const dark = documentBackdropCss(theme("#0d3b1e"));
    expect(dark).toBe("html{background-color:#0d3b1e}");
    // Same theme, and it cannot differ — there is nothing about the page for it to read.
    expect(documentBackdropCss(theme("#0d3b1e"))).toBe(dark);
  });

  it("emits nothing for a gradient — `background-color` cannot take one", () => {
    expect(documentBackdropCss(theme("linear-gradient(#fff, #000)"))).toBe("");
  });

  it("emits nothing when the theme carries no background, leaving the browser default", () => {
    expect(documentBackdropCss(theme(""))).toBe("");
    expect(documentBackdropCss(theme("   "))).toBe("");
  });
});
