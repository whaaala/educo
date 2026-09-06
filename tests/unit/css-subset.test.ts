import { describe, it, expect } from "vitest";
import { subsetCss, usedEuClasses } from "@/lib/educo-ui/subset";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";

describe("usedEuClasses", () => {
  it("reads every eu- class the page actually emitted", () => {
    const found = usedEuClasses('<div class="eu-root wrap"><p class="eu-body eu-body--lead">x</p></div>');
    expect([...found].sort()).toEqual(["eu-body", "eu-body--lead", "eu-root"]);
  });

  it("ignores classes that are not ours", () => {
    expect(usedEuClasses('<div class="container mx-auto bx-1">x</div>').size).toBe(0);
  });
});

describe("subsetCss", () => {
  it("drops a rule for a component the page does not have", () => {
    const css = ".eu-alert{color:red}.eu-btn{color:blue}";
    const out = subsetCss(css, new Set(["eu-btn"]));
    expect(out).not.toContain(".eu-alert");
    expect(out).toContain(".eu-btn");
  });

  it("drops a chained selector when any LINK in the chain is missing", () => {
    // `.eu-accordion--invert .eu-accordion__item` is a chain: it cannot match unless BOTH classes are on the
    // page. Keeping it because the second one is present shipped every accordion, alert and card VARIANT to
    // every page carrying any of those components — 27 KB of unmatchable rules on a four-component page.
    const css = ".eu-accordion--invert .eu-accordion__item{border:0}";
    expect(subsetCss(css, new Set(["eu-accordion__item"]))).toBe("");
    expect(subsetCss(css, new Set(["eu-accordion__item", "eu-accordion--invert"]))).toContain("border:0");
  });

  it("still keeps a chain whose links are ALL on the page", () => {
    const css = ".eu-root .eu-accordion .eu-accordion__header{font-weight:600}";
    expect(subsetCss(css, new Set(["eu-accordion", "eu-accordion__header"]))).toContain("font-weight:600");
  });

  it("keeps a selector using :is()/:where(), because those are alternatives and not a chain", () => {
    // `:is(.eu-a, .eu-b) .eu-c` matches with only ONE of a and b present, so the all-links-required test
    // would wrongly drop it. The sheet has no such selector today; this is what stops the day it gains one
    // from silently un-styling a page.
    const css = ":is(.eu-alert, .eu-callout) .eu-btn{color:red}";
    expect(subsetCss(css, new Set(["eu-alert", "eu-btn"]))).toContain("color:red");
    const negated = ".eu-btn:not(.eu-btn--ghost){padding:1em}";
    expect(subsetCss(negated, new Set(["eu-btn"]))).toContain("padding:1em");
  });

  it("keeps a selector list when ANY part of it is needed", () => {
    // Dropping the whole list because one part is unused would unstyle an element that IS on the page.
    const css = ".eu-alert__title,.eu-card__title{font-weight:700}";
    expect(subsetCss(css, new Set(["eu-card__title"]))).toContain("font-weight:700");
  });

  it("keeps a rule that names no eu- class, because it cannot be attributed", () => {
    // Under-shipping is a broken page on a school's live site; over-shipping is a few bytes.
    const css = "a:focus-visible{outline:2px solid}";
    expect(subsetCss(css, new Set(["eu-btn"]))).toContain("focus-visible");
  });

  it("treats .eu-root as universal rather than as evidence a component is used", () => {
    const css = ".eu-root .eu-alert{color:red}";
    expect(subsetCss(css, new Set(["eu-root"]))).toBe("");
  });

  it("keeps @keyframes and @font-face, which are referenced by name", () => {
    // A surviving rule can say `animation: eu-rise` — losing the keyframes makes it silently do nothing.
    // Byte-exact: each must pass through untouched, not be taken apart and reassembled as a conditional group.
    const frames = "@keyframes eu-rise{from{opacity:0}to{opacity:1}}";
    const face = "@font-face{font-family:x}";
    expect(subsetCss(frames, new Set([]))).toBe(frames);
    expect(subsetCss(face, new Set([]))).toBe(face);
  });

  it("subsets inside a media query and drops the wrapper when nothing survives", () => {
    const css = "@media (min-width:40em){.eu-alert{color:red}}@media print{.eu-btn{color:blue}}";
    const out = subsetCss(css, new Set(["eu-btn"]));
    expect(out).not.toContain("min-width:40em");
    expect(out).toContain("@media print");
    expect(out).toContain(".eu-btn");
  });

  it("does not tear a nested block in half", () => {
    const css = "@media print{.eu-btn{color:blue}.eu-alert{color:red}}";
    const out = subsetCss(css, new Set(["eu-btn"]));
    // Braces balance — a naive split on "}" produces a stylesheet the browser silently discards.
    expect(out.split("{").length).toBe(out.split("}").length);
  });

  it("REGRESSION: a comma inside a CSS comment must not save an unused rule", () => {
    // The real bug. Selector lists split on commas, so a comment reading "…the severity colour, so an action…"
    // produced a fragment naming no class. "When in doubt, keep" then treated it as needed, and alert rules
    // shipped to pages with no alert. Silent over-shipping: the subsetter looked like it worked.
    const css = "/* On a solid alert the surface is the severity colour, so an action would vanish */\n.eu-alert--solid .eu-alert__action{color:red}";
    expect(subsetCss(css, new Set(["eu-btn"]))).toBe("");
  });

  it("strips comments from what it keeps, so visitors do not download them", () => {
    const css = "/* explain the button */\n.eu-btn{color:blue}";
    const out = subsetCss(css, new Set(["eu-btn"]));
    expect(out).toContain(".eu-btn");
    expect(out).not.toContain("explain");
  });
});

describe("subsetCss against the real stylesheet", () => {
  // The property that actually matters: never drop a rule the page needs.
  const usedBy = (html: string) => {
    const used = usedEuClasses(html);
    return { used, out: subsetCss(COMPONENT_CSS, used) };
  };

  it("keeps every rule that mentions a class the page uses", () => {
    const { used, out } = usedBy(
      '<div class="eu-root"><div class="eu-alert eu-alert--solid eu-alert__body eu-alert__title"></div></div>',
    );
    const full = subsetCss(COMPONENT_CSS, new Set([...used, "__never__"]));
    for (const cls of used) {
      if (cls === "eu-root") continue;
      const inFull = (full.match(new RegExp(`\.${cls}(?![A-Za-z0-9_-])`, "g")) ?? []).length;
      const inOut = (out.match(new RegExp(`\.${cls}(?![A-Za-z0-9_-])`, "g")) ?? []).length;
      expect(inOut, `${cls} lost rules during subsetting`).toBe(inFull);
    }
  });

  it("a text-only page carries no component rules at all", () => {
    const { out } = usedBy('<div class="eu-root"><h1>Term dates</h1><p>Autumn starts 2 September.</p></div>');
    expect(out.length).toBeLessThan(COMPONENT_CSS.length * 0.02);
  });

  it("even the richest page is far smaller than the whole stylesheet", () => {
    const { out } = usedBy(
      '<div class="eu-root"><div class="eu-alert eu-alert--solid"></div><details class="eu-acc eu-acc--boxed"></details>' +
        '<div class="eu-card eu-btn eu-stat eu-quote eu-rating"></div></div>',
    );
    expect(out.length).toBeLessThan(COMPONENT_CSS.length * 0.5);
  });

  it("produces a balanced stylesheet for every page shape", () => {
    for (const html of [
      '<div class="eu-root"></div>',
      '<div class="eu-root eu-alert eu-alert--toast"></div>',
      '<div class="eu-root eu-acc eu-acc--timeline eu-card eu-btn"></div>',
    ]) {
      const { out } = usedBy(html);
      expect(out.split("{").length, html).toBe(out.split("}").length);
    }
  });
});
