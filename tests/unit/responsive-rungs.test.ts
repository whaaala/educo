import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, resolveResponsive, type BoxNode } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * THE FIVE-RUNG LADDER, as the exported stylesheet sees it.
 *
 * Behaviours: tests/features/components/website/box-builder-rungs.feature.
 *
 * The model tests prove what `resolveResponsive` returns; these prove the CSS that comes out of it, which is
 * the half a visitor actually meets — and which used to map three stored layers onto five rungs through two
 * hand-written constants.
 *
 * THE DIRECTION, because it decides every expectation below: an override set at a rung applies AT that rung
 * and at every NARROWER one, unless a narrower rung overrides it in turn. That is what the three-layer model
 * always did (`mobile` inherited `tablet` inherited the base) and changing it would silently redraw every
 * saved page. `wide` is the exception and branches off the base on its own — a big desktop is not a narrowed
 * anything.
 *
 * The ladder is never re-typed here: a test that hard-codes `37.5em` stops testing the ladder the moment the
 * ladder moves.
 */

const page = (overrides: Record<string, unknown>, base: Record<string, unknown> = {}): BoxNode =>
  createContainer("column", {
    id: "root",
    children: [makeRowBand([
      createElement("text", { id: "t", text: "Hello", ...base, responsive: overrides } as Partial<BoxNode>),
    ])],
  } as Partial<BoxNode>);

const cssOf = (root: BoxNode): string => {
  const html = renderPageHTML(root, DEFAULT_THEME);
  return [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
};

/** The `@media (min-width:…)` widths a stylesheet declares, in the order they appear. */
const queryEms = (css: string): number[] =>
  [...css.matchAll(/@media \(min-width:([\d.]+)em\)/g)].map((m) => Number(m[1]));

/**
 * The block's own declarations at a given rung — inside that rung's query, or the unqualified rule when no
 * width is given.
 *
 * A percentage width on a FLEX CHILD is emitted as `flex: 0 1 <pct>`, not as `width`. That is the emitter
 * being right — `width` on a flex child is only a hint and `flex-basis` is what actually sizes it — so the
 * assertions read the property the browser will use, not the one the model field is named after.
 */
function ruleAt(css: string, em?: number): string {
  const scope = em == null
    ? css.split("@media")[0]
    // The capture keeps the LAST rule's own closing brace — `[\s\S]*?}}` swallows it, leaving `.bx-t{…`
    // with nothing to close it and every lookup returning empty.
    : css.match(new RegExp(`@media \\(min-width:${em}em\\)\\{([\\s\\S]*?\\})\\}`))?.[1] ?? "";
  return scope.match(/\.bx-t\{([^}]*)\}/)?.[1] ?? "";
}

/** What a percentage width looks like once emitted for a flex child. */
const basis = (pct: string) => `flex:0 1 ${pct}`;

describe("every rung reaches the stylesheet", () => {
  /** A block given a DIFFERENT width at all five rungs — the only page that can prove all five are wired. */
  const allFive = () => page({
    phone: { width: "10%" }, tabletPortrait: { width: "20%" },
    tabletLandscape: { width: "30%" }, wide: { width: "50%" },
  }, { width: "40%" }); // the node's own width IS the desktop rung

  it("produces exactly one query per rung above the phone, at the ladder's own widths", () => {
    const ems = queryEms(cssOf(allFive()));
    expect(ems).toEqual([
      BREAKPOINTS_EM.tabletPortrait,
      BREAKPOINTS_EM.tabletLandscape,
      BREAKPOINTS_EM.desktop,   // `base` IS the desktop rung
      BREAKPOINTS_EM.wide,
    ]);
  });

  it("ascending, so a wider rung wins on the cascade with no specificity tricks", () => {
    const ems = queryEms(cssOf(allFive()));
    expect(ems).toEqual([...ems].sort((a, b) => a - b));
    expect(new Set(ems).size, "a rung must not emit twice").toBe(ems.length);
  });

  it("each rung carries ITS OWN value, so five widths reach five screens", () => {
    const css = cssOf(allFive());
    expect(ruleAt(css)).toContain(basis("10%"));                                  // phone — unqualified
    expect(ruleAt(css, BREAKPOINTS_EM.tabletPortrait)).toContain(basis("20%"));
    expect(ruleAt(css, BREAKPOINTS_EM.tabletLandscape)).toContain(basis("30%"));
    expect(ruleAt(css, BREAKPOINTS_EM.desktop)).toContain(basis("40%"));
    expect(ruleAt(css, BREAKPOINTS_EM.wide)).toContain(basis("50%"));
  });

  it("the phone layer is unqualified — mobile-first, so the narrowest screen needs no query at all", () => {
    const css = cssOf(page({}, { width: "55%" }));
    expect(ruleAt(css)).toContain(basis("55%"));
    expect(queryEms(css), "a page with no per-rung changes needs no queries").toEqual([]);
  });

  it("a rung that changes nothing emits nothing — the sheet only pays for real differences", () => {
    const css = cssOf(page({ tabletPortrait: { width: "20%" } }, { width: "20%" }));
    expect(queryEms(css)).not.toContain(BREAKPOINTS_EM.tabletLandscape);
  });
});

describe("the direction of the cascade", () => {
  it("an override applies at its rung AND narrower, until something narrower overrides it", () => {
    const n = page({ tabletLandscape: { width: "60%" } }, { width: "90%" }).children![0].children![0];
    expect(resolveResponsive(n, "tabletLandscape").width).toBe("60%");
    expect(resolveResponsive(n, "tabletPortrait").width).toBe("60%"); // narrower inherits it
    expect(resolveResponsive(n, "phone").width).toBe("60%");
    expect(resolveResponsive(n, "base").width).toBe("90%");           // desktop is untouched
  });

  it("so the query that appears is where the value is REMOVED again, going wider", () => {
    const css = cssOf(page({ tabletLandscape: { width: "60%" } }, { width: "90%" }));
    expect(ruleAt(css)).toContain(basis("60%"));                                   // phone carries it
    expect(ruleAt(css, BREAKPOINTS_EM.desktop)).toContain(basis("90%"));           // desktop takes it back
  });

  it("wide branches off the base and is NOT part of that chain", () => {
    const n = page({ tabletLandscape: { width: "60%" } }, { width: "90%" }).children![0].children![0];
    expect(resolveResponsive(n, "wide").width).toBe("90%");
  });
});

describe("a page saved under the three-layer model still exports the same", () => {
  it("the legacy tablet layer reaches BOTH tablet rungs", () => {
    // It was the only tablet layer there was, so it has to keep covering both orientations.
    const n = page({ tablet: { width: "22%" } }, { width: "30%" }).children![0].children![0];
    expect(resolveResponsive(n, "tabletLandscape").width).toBe("22%");
    expect(resolveResponsive(n, "tabletPortrait").width).toBe("22%");
    expect(ruleAt(cssOf(page({ tablet: { width: "22%" } }, { width: "30%" })), BREAKPOINTS_EM.desktop))
      .toContain(basis("30%"));
  });

  it("the legacy mobile layer is still the phone layer", () => {
    const css = cssOf(page({ mobile: { width: "11%" } }, { width: "30%" }));
    expect(ruleAt(css)).toContain(basis("11%")); // the unqualified rule is the phone one
  });
});
