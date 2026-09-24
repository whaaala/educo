import { describe, it, expect } from "vitest";
import { documentEdgeCss } from "@/lib/box-export";
import { normalizeRowBands, type BoxNode } from "@/lib/box-model";

/**
 * A PAGE SHORTER THAN THE SCREEN ENDS IN ITS OWN COLOUR — never in a slab of white nobody added.
 *
 * Behaviours: tests/features/components/website/box-builder-site.feature.
 *
 * Measured on an iPad Pro 11 (834 × 1210) with a three-band page: the content ended at 410px and 800 pixels
 * of white followed it, directly beneath a dark footer. Two thirds of the screen. Reported as exactly what
 * it looks like — "it looks like a user is seeing what they have not added."
 *
 * The rule chosen, and the two that were rejected:
 *   • CHOSEN — paint the DOCUMENT the colour of the band that ends the page. Adds no element, no space, no
 *     height and no setting; invisible on any page taller than the screen; responsive by construction.
 *   • rejected — stretch the last band to `100vh`: that changes the user's layout and turns a 90px footer
 *     into an 800px one, which is adding the empty space this exists to remove.
 *   • rejected — a per-page setting: asking someone to fix a problem they did not cause.
 */

const band = (id: string, background?: string, extra: Record<string, unknown> = {}): BoxNode =>
  ({ id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 80, background, ...extra } as unknown as BoxNode);

const page = (kids: BoxNode[]): BoxNode =>
  ({ id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: kids } as unknown as BoxNode);

describe("the colour a short page ends in", () => {
  it("is the background of the band that ends the page", () => {
    expect(documentEdgeCss(page([band("a", "#0d3b1e"), band("b", "#ffffff"), band("c", "#1f2937")])))
      .toBe("html{background-color:#1f2937}");
  });

  it("is found through the ROW BANDS the builder wraps every block in", () => {
    // The shape the BUILDER makes, not a hand-built tree: every top-level child gets its own band, so the
    // colour is one level deeper than it looks. A guard written against the raw tree would pass while the
    // real page — the only one a visitor ever sees — emitted nothing at all.
    const built = normalizeRowBands(page([band("a", "#0d3b1e"), band("c", "#1f2937")]), 0);
    expect(built.children?.[0].rowBand, "the fixture really is banded").toBe(true);
    expect(documentEdgeCss(built)).toBe("html{background-color:#1f2937}");
  });

  it("ignores a FLOATING block — it is on its own layer, not the bottom of the page", () => {
    const floatOnTop = band("card", "#ff00ff", { position: "absolute", left: 10, top: 10 });
    expect(documentEdgeCss(page([band("a", "#0d3b1e"), band("c", "#1f2937"), floatOnTop])))
      .toBe("html{background-color:#1f2937}");
  });

  it("ignores a block that is hidden, since it ends nothing", () => {
    expect(documentEdgeCss(page([band("c", "#1f2937"), band("gone", "#ff00ff", { hidden: true })])))
      .toBe("html{background-color:#1f2937}");
  });

  it("takes the first band that HAS a colour, looking upward", () => {
    expect(documentEdgeCss(page([band("a", "#0d3b1e"), band("plain")])))
      .toBe("html{background-color:#0d3b1e}");
  });

  it("refuses a GRADIENT rather than repeating it below the page", () => {
    // `background-color` cannot take a gradient, and `background` on <html> would paint the whole gradient
    // again under the content — which is adding something, the one thing this must not do.
    expect(documentEdgeCss(page([band("g", "linear-gradient(180deg, #000, #fff)")]))).toBe("");
  });

  it("emits NOTHING when no band carries a colour, leaving the browser exactly as it was", () => {
    expect(documentEdgeCss(page([band("a"), band("b")]))).toBe("");
    expect(documentEdgeCss(page([]))).toBe("");
  });
});
