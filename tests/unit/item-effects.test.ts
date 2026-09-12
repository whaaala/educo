import { describe, it, expect } from "vitest";
import { hasItemEffects, itemEffectsCss, revealCss } from "@/lib/interactions";
import {
  createContainer, createComponent, makeRowBand, itemNeedsClass, itemScope, treeItemEffectsCss,
  type BoxNode, type ComponentItem,
} from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * AN ITEM IS A THING IN ITS OWN RIGHT.
 *
 * RULE A: a capability built for one thing is the baseline for everything it can apply to. Hover and entrance
 * shipped for every BLOCK, but an accordion row or an alert message could carry neither — so five
 * announcements had to react and arrive as one lump, and the most obvious thing a person would try (hover the
 * row, not the list) did nothing.
 *
 * See tests/features/components/website/box-builder-item-effects.feature.
 */

const item = (patch: Partial<ComponentItem>): ComponentItem =>
  ({ id: "i1", title: "Sports day", body: "Now on the 12th.", ...patch });

const pageWith = (node: BoxNode) => {
  const root = createContainer("column", { id: "r", children: [makeRowBand([node])] } as Partial<BoxNode>);
  return renderPageHTML(root, DEFAULT_THEME);
};

describe("hasItemEffects", () => {
  it("is true for a hover effect, an entrance, or both", () => {
    expect(hasItemEffects(item({ hoverEffect: "lift" }))).toBe(true);
    expect(hasItemEffects(item({ revealEffect: "rise" }))).toBe(true);
    expect(hasItemEffects(item({ hoverEffect: "glow", revealEffect: "fade" }))).toBe(true);
  });

  it("is false for a plain item — so a page with no effects ships nothing extra", () => {
    expect(hasItemEffects(item({}))).toBe(false);
    // "" is what the picker's None option stores; it must not count as an effect.
    expect(hasItemEffects(item({ hoverEffect: "", revealEffect: "" }))).toBe(false);
  });
});

describe("itemEffectsCss", () => {
  it("emits the SAME rules a block would, at the item's scope", () => {
    const css = itemEffectsCss(".eu-al-i1", item({ hoverEffect: "lift" }));
    expect(css).toContain(".eu-al-i1:hover");
    expect(css).toContain("translateY(-0.25rem)");
    // Focus parity is not optional — a keyboard user gets what a mouse user gets.
    expect(css).toContain(".eu-al-i1:focus-visible");
  });

  it("emits an entrance without staggering — an item's title and body arrive together", () => {
    const css = itemEffectsCss(".eu-al-i1", item({ revealEffect: "rise" }));
    expect(css).toContain(".eu-al-i1{animation:eu-reveal-rise");
    expect(css, "an item must never stagger its own parts").not.toContain(".eu-al-i1 > *");
  });

  it("nothing at all when the item has no effect", () => {
    expect(itemEffectsCss(".eu-al-i1", item({}))).toBe("");
  });
});

describe("the per-item class", () => {
  it("is stamped when the item's ONLY setting is an effect", () => {
    // The accordion used to stamp `eu-acc-i-<id>` only for styling overrides, so an item whose one setting
    // was a hover effect had no selector for the rule to attach to: it would have matched nothing.
    expect(itemNeedsClass(item({ hoverEffect: "lift" }))).toBe(true);
    expect(itemNeedsClass(item({ revealEffect: "fade" }))).toBe(true);
    expect(itemNeedsClass(item({}))).toBe(false);
  });

  it("resolves to one selector both renderers use", () => {
    expect(itemScope("accordion", "i1")).toBe(".eu-accordion .eu-acc-i-i1");
    expect(itemScope("alert", "i1")).toBe(".eu-al-i1");
    expect(itemScope(undefined, "i1"), "a non-component block has no items").toBe("");
  });
});

describe("the exported page", () => {
  it("carries an accordion ROW's own hover", () => {
    const acc = createComponent("accordion", {
      id: "acc", items: [item({ hoverEffect: "lift" })],
    } as Partial<BoxNode>);
    const html = pageWith(acc);
    expect(html, "the row needs its class or the rule matches nothing").toContain("eu-acc-i-i1");
    expect(html).toContain(".eu-accordion .eu-acc-i-i1:hover");
  });

  it("carries an alert MESSAGE's own entrance, keyframes included", () => {
    const al = createComponent("alert", {
      id: "al", items: [item({ revealEffect: "zoom" })],
    } as Partial<BoxNode>);
    const html = pageWith(al);
    expect(html).toContain(".eu-al-i1{animation:eu-reveal-zoom");
    expect(html, "an animation naming keyframes that are not on the page does nothing")
      .toContain("@keyframes eu-reveal-zoom");
  });

  it("adds nothing when no item has an effect", () => {
    const acc = createComponent("accordion", { id: "acc", items: [item({})] } as Partial<BoxNode>);
    const html = pageWith(acc);
    expect(html).not.toContain("eu-acc-i-i1");
    expect(html).not.toContain("eu-reveal-");
  });
});

describe("stagger reaches the ITEMS, not the wrapper", () => {
  /**
   * The bug this pins down: a component's block wrapper contains a `<style>` tag and one `.eu-accordion`
   * div. `scope > *` therefore animated the whole component as a single block and gave the invisible style
   * tag the first beat — the rows never staggered at all.
   */
  it("targets the item selector for a component", () => {
    const css = revealCss(".bx-acc", { revealEffect: "rise", revealStagger: true }, { staggerSelector: ".eu-accordion__item" });
    expect(css).toContain(".bx-acc .eu-accordion__item{animation:eu-reveal-rise");
    expect(css).toContain(".bx-acc .eu-accordion__item:nth-child(2){animation-delay:90ms}");
    expect(css, "the wrapper's own children include a <style> tag").not.toContain(".bx-acc > *");
  });

  it("still targets direct children for a plain container, which is right there", () => {
    const css = revealCss(".bx-sec", { revealEffect: "rise", revealStagger: true });
    expect(css).toContain(".bx-sec > *{animation:eu-reveal-rise");
    expect(css).toContain(".bx-sec > *:nth-child(2){animation-delay:90ms}");
  });

  it("the export wires a component's item selector through", () => {
    const acc = createComponent("accordion", {
      id: "acc", revealEffect: "rise", revealStagger: true,
      items: [item({}), { id: "i2", title: "Second", body: "Body" }],
    } as Partial<BoxNode>);
    const html = pageWith(acc);
    expect(html).toContain(".bx-acc .eu-accordion__item{animation:eu-reveal-rise");
    expect(html).not.toContain(".bx-acc > *{animation");
  });
});

describe("treeItemEffectsCss", () => {
  it("collects every item's rules from anywhere in the tree", () => {
    const acc = createComponent("accordion", { id: "acc", items: [item({ hoverEffect: "glow" })] } as Partial<BoxNode>);
    const al = createComponent("alert", { id: "al", items: [item({ id: "m1", hoverEffect: "lift" })] } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [makeRowBand([acc, al])] } as Partial<BoxNode>);
    const css = treeItemEffectsCss(root);
    expect(css).toContain(".eu-accordion .eu-acc-i-i1:hover");
    expect(css).toContain(".eu-al-m1:hover");
  });

  it("is empty for a tree with no item effects", () => {
    const acc = createComponent("accordion", { id: "acc", items: [item({})] } as Partial<BoxNode>);
    expect(treeItemEffectsCss(createContainer("column", { id: "r", children: [acc] } as Partial<BoxNode>))).toBe("");
  });
});
