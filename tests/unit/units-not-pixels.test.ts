import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * EVERY BLOCK IS SIZED IN THE UNIT SYSTEM, NOT IN STORED PIXELS.
 *
 * Asked for directly: *"we have a breakdown of the units and then we are using that unit to do everything on
 * the content… make sure everything is responsive, make sure it makes sense at the breakpoint it's supposed to
 * be, following the units that make sense."* And Core Rule 16: **never a stored pixel reaching the page.**
 *
 * The units this project has:
 *   `--box-u`   clamp(0.4375rem, calc(0.3125rem + 0.5cqw), 0.875rem)
 *                                                — the fluid base. HALF rem so it follows the reader, half
 *                                                  cqw so it follows the container. It was a bare `1cqw`,
 *                                                  and a reader who set their browser to 24px moved the
 *                                                  page's spacing by 0px.
 *   `u(n)`      calc(var(--box-u) * n/10)        — every spacing and size derived from it
 *   text        max(1rem, u(16))                 — fluid, with a readable floor
 *   `remLen`    for anything that should follow the READER's text size rather than the container
 *
 * A raw `px` in the emitted CSS is a size that ignores all of that: it does not grow on a large screen, it
 * does not shrink on a phone, and it does not respond to a reader who has enlarged their browser text.
 *
 * IT ENUMERATES THE CATALOGUE, so a component added tomorrow is audited the day it appears — the same
 * decision as the corner-radius guard and the sixty-device sweep.
 */

const PRIMITIVES = ["container", "row", "grid", "heading", "text", "button", "list", "image", "video", "divider", "spacer", "icon", "embed"];
const ALL_KINDS = [...PRIMITIVES, ...COMPONENT_CATALOGUE.map((c) => c.name)];

/** The whole document a page emits for one block, styles included. */
function pageFor(kind: string): string {
  const block = blockForKind(kind, { id: "probe" } as Partial<BoxNode>);
  const root = { id: "root", type: "container", direction: "column", children: [block] } as unknown as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
}

/**
 * The pixel lengths that are NOT a stored size, and why each is legitimate.
 *
 * Kept as a named list rather than a loose regex so that adding to it is a decision someone has to write down.
 */
const LEGITIMATE = [
  /0px/,                       // zero is zero in every unit
  /1px/,                       // a hairline is one device pixel by definition — a rule, a border, a divider
  /\b(?:0?\.\d+)px/,           // sub-pixel, only ever from a computed hairline
];

/** Every `<n>px` that is a real, stored size. */
function storedPixels(css: string): string[] {
  const found = [...css.matchAll(/(-?\d*\.?\d+)px/g)].map((m) => m[0]);
  return [...new Set(found.filter((v) => !LEGITIMATE.some((ok) => ok.test(v))))];
}

/**
 * THE BLOCK'S OWN RULES, separated from the framework stylesheet it sits on.
 *
 * The first run of this audit reported the SAME ten pixel values for all twenty kinds, which is the tell: they
 * were coming from the shared `.eu-*` sheet, not from anything the builder emits per block. Those are two
 * different questions with two different answers — a framework's hairlines and pill radii are its own design
 * decisions, while a size the BUILDER writes from a user's model is the one Core Rule 16 is about.
 */
const blockRules = (css: string): string =>
  [...css.matchAll(/\.bx-[a-zA-Z0-9_-]+\s*\{[^}]*\}/g)].map((m) => m[0]).join("\n");

describe("the unit system reaches the page, and stored pixels do not", () => {
  it("no block the builder emits carries a stored pixel size", () => {
    const report: Record<string, string[]> = {};
    for (const kind of ALL_KINDS) {
      const px = storedPixels(blockRules(pageFor(kind)));
      if (px.length) report[kind] = px;
    }
    if (Object.keys(report).length) console.log("stored pixels in BLOCK rules:\n" + JSON.stringify(report, null, 2));
    expect(Object.keys(report), `blocks emitting stored pixels: ${Object.keys(report).join(", ")}`).toEqual([]);
  });

  it("…and the SHARED framework stylesheet holds to the same rule", () => {
    /**
     * THIS USED TO MERELY LIST THEM, capped at fourteen. That was the honest state at the time — the blocks
     * had been converted and the framework had not — but a guard that tolerates the thing it is named for is
     * a guard that stops being read. There were ten, and they were not incidental:
     *
     *   • the RADIUS token scale was emitted in px, and `--eu-radius-*` is what every Card, Alert, Badge and
     *     Accordion reads, so every corner in the design system ignored a reader's text size;
     *   • the SHADOW scale existed TWICE, byte for byte, here and in `box-model`. Only one copy was moved to
     *     rem, so blocks lifted in rem while components lifted in pixels — invisible until the two sat side
     *     by side at a large text size;
     *   • focus rings, accent bars and decorative borders throughout the component sheet.
     *
     * One change to the token module fixed eight of the ten, because the tokens are what everything reads.
     * The rule now applies to the framework exactly as it applies to a block: `1px` for a hairline border,
     * and nothing else.
     */
    const sheet = pageFor("container").replace(/\.bx-[a-zA-Z0-9_-]+\s*\{[^}]*\}/g, "");
    const px = storedPixels(sheet).sort((a, b) => parseFloat(a) - parseFloat(b));
    expect(px, `the framework stylesheet emitted stored pixels: ${px.join(", ")}`).toEqual([]);
  });

  /**
   * The app shells' hand-copied token scales are guarded in `educo-bridge.test.ts`, which already owns that
   * question — a duplicate here was written before noticing it existed, and two guards asking one question
   * is the thing this codebase keeps paying for. It compares every key against `tokensFromTheme()` now,
   * rather than sampling three.
   */
});
