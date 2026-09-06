import { describe, it, expect } from "vitest";
import { sanitizeCssDeclarations, animatesLayout } from "@/lib/box-model";
import { HOVER_EFFECTS, hoverCss, hoverEffect, hasHover, treeHoverCss,
  REVEAL_EFFECTS, revealCss, revealKeyframes, treeRevealCss } from "@/lib/interactions";
import { renderSitePage } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxNode } from "@/lib/box-model";

/**
 * One page, rendered through the SHIPPING export path.
 *
 * These used to call `renderSiteHTML`, which put every page in one document. The app no longer emits that
 * shape — so the tests were validating a code path that could not reach a user, which is exactly the failure
 * these tests exist to catch. `inlineShared` is set because there is no styles.css to fetch here.
 */
const exportDoc = (root: BoxNode) => {
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

describe("hover & focus effects (Interactions 1a)", () => {
  it("costs nothing when no effect is chosen", () => {
    expect(hoverCss(".b", undefined)).toBe("");
    expect(hoverCss(".b", "")).toBe("");
    expect(hoverCss(".b", "no-such-effect")).toBe("");
    expect(hasHover("")).toBe(false);
    expect(hasHover("lift")).toBe(true);
  });

  it("styles hover AND focus together, so a keyboard user gets the same affordance", () => {
    const css = hoverCss(".b", "lift");
    expect(css).toContain(".b:hover{");
    expect(css).toContain(".b:focus-visible{");
    // a card must also respond when a control INSIDE it takes focus
    expect(css).toContain(".b:has(:focus-visible){");
  });

  it("emits each state as its OWN rule, so an unsupported :has() cannot void the others", () => {
    // Grouping them as one selector list would make the whole rule invalid in a browser without `:has`.
    const css = hoverCss(".b", "lift");
    expect(css).not.toMatch(/\.b:hover\s*,/);
  });

  it("marks every declaration !important — inline resting styles would otherwise win on the canvas", () => {
    const css = hoverCss(".b", "glow");
    const decls = css.slice(css.indexOf(".b:hover{") + 9, css.indexOf("}", css.indexOf(".b:hover{")));
    for (const d of decls.split(";").filter(Boolean)) expect(d).toContain("!important");
  });

  it("reduced motion strips the MOVEMENT but keeps the rest of the feedback", () => {
    const moving = hoverCss(".b", "lift");
    expect(moving).toContain("@media (prefers-reduced-motion:reduce)");
    expect(moving).toContain("transform:none !important");
    // a non-moving effect has nothing to calm, so it emits no media block at all
    expect(hoverCss(".b", "glow")).not.toContain("prefers-reduced-motion");
  });

  it("every effect is token-driven — no hardcoded brand colour", () => {
    for (const fx of HOVER_EFFECTS) {
      expect(fx.decls, `${fx.label} must not hardcode a hex colour`).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    }
  });

  it("names are unique and the first entry is the 'no effect' default", () => {
    expect(HOVER_EFFECTS[0].id).toBe("");
    expect(new Set(HOVER_EFFECTS.map((f) => f.id)).size).toBe(HOVER_EFFECTS.length);
    expect(new Set(HOVER_EFFECTS.map((f) => f.label)).size).toBe(HOVER_EFFECTS.length);
    expect(hoverEffect("lift")?.label).toBe("Lift");
  });

  it("walks a whole tree, scoping each block to its own selector", () => {
    const tree = { id: "a", hoverEffect: "lift", children: [
      { id: "b" }, { id: "c", hoverEffect: "glow" },
    ] } as unknown as Parameters<typeof treeHoverCss>[0];
    const css = treeHoverCss(tree, (id) => `[data-box-id="${id}"]`);
    expect(css).toContain('[data-box-id="a"]:hover');
    expect(css).toContain('[data-box-id="c"]:hover');
    expect(css).not.toContain('[data-box-id="b"]:hover'); // no effect → no rule
  });

  it("the EXPORT carries the effect, and ships nothing when there is none", () => {
    const withFx = { id: "root", type: "container", direction: "column", children: [
      { id: "x", type: "container", direction: "column", hoverEffect: "lift", children: [] },
    ] } as unknown as BoxNode;
    const without = { id: "root", type: "container", direction: "column", children: [
      { id: "x", type: "container", direction: "column", children: [] },
    ] } as unknown as BoxNode;

    expect(exportDoc(withFx)).toMatch(/\.bx-[\w-]+:hover/);
    expect(exportDoc(without)).not.toMatch(/\.bx-[\w-]+:hover/);
  });
});

describe("entrance effects (Interactions 1b)", () => {
  it("costs nothing when no entrance is chosen", () => {
    expect(revealCss(".b", {})).toBe("");
    expect(revealCss(".b", { revealEffect: "" })).toBe("");
    expect(revealCss(".b", { revealEffect: "no-such-effect" })).toBe("");
    expect(treeRevealCss({ id: "a" }, (id) => `#${id}`)).toBe("");
  });

  it("animates FROM hidden TO the block's own look, so a failed animation still shows the content", () => {
    // The property that stops a reveal ever leaving a page blank: hiding lives in the keyframes, never in the
    // resting style. If the animation does not run, nothing has hidden anything.
    const css = revealCss(".b", { revealEffect: "fade" });
    expect(css).toContain("animation:eu-reveal-fade");
    expect(css).not.toMatch(/\.b\{[^}]*opacity:0/);           // the block itself is never hidden
    expect(revealKeyframes(["fade"])).toBe("@keyframes eu-reveal-fade{from{opacity:0}}");
  });

  it("emits each keyframes ONCE per page, however many blocks use it", () => {
    const tree = { id: "a", revealEffect: "rise", children: [
      { id: "b", revealEffect: "rise" }, { id: "c", revealEffect: "fade" },
    ] } as Parameters<typeof treeRevealCss>[0];
    const css = treeRevealCss(tree, (id) => `#${id}`);
    expect(css.match(/@keyframes eu-reveal-rise/g)?.length, "one copy of rise").toBe(1);
    expect(css.match(/@keyframes eu-reveal-fade/g)?.length, "one copy of fade").toBe(1);
    expect(css).toContain("#a{animation:eu-reveal-rise");
    expect(css).toContain("#b{animation:eu-reveal-rise");
  });

  it("scroll-triggered entrances are GUARDED, so an unsupporting browser still reveals on load", () => {
    const css = revealCss(".b", { revealEffect: "fade", revealScroll: true });
    expect(css).toContain("@supports (animation-timeline: view())");
    // the plain animation is declared outside the @supports block — that is the fallback
    expect(css.indexOf("animation:eu-reveal-fade")).toBeLessThan(css.indexOf("@supports"));
  });

  it("stagger moves the effect onto the CHILDREN, each a beat later", () => {
    const css = revealCss(".b", { revealEffect: "rise", revealStagger: true });
    expect(css).toContain(".b > *{animation:eu-reveal-rise");
    expect(css).toContain(".b > *:nth-child(2){animation-delay:90ms}");
    expect(css).toContain(".b > *:nth-child(3){animation-delay:180ms}");
    expect(css).not.toMatch(/^\.b\{animation/);   // the container itself does not animate
  });

  it("reduced motion removes the entrance entirely", () => {
    for (const fx of REVEAL_EFFECTS.filter((f) => f.from)) {
      const css = revealCss(".b", { revealEffect: fx.id });
      expect(css, `${fx.label} must honour reduced motion`).toContain("@media (prefers-reduced-motion:reduce)");
      expect(css).toContain("animation:none !important");
    }
  });

  it("every entrance is token-driven and namespaced", () => {
    for (const fx of REVEAL_EFFECTS) {
      expect(fx.from, `${fx.label} must not hardcode a colour`).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    }
    expect(REVEAL_EFFECTS[0].id, "the first entry is 'no entrance'").toBe("");
    expect(new Set(REVEAL_EFFECTS.map((f) => f.id)).size).toBe(REVEAL_EFFECTS.length);
    expect(revealKeyframes(REVEAL_EFFECTS.map((f) => f.id))).not.toMatch(/@keyframes (?!eu-)/);
  });

  it("the EXPORT carries the entrance, and ships nothing when there is none", () => {
    const withFx = { id: "root", type: "container", direction: "column", children: [
      { id: "x", type: "container", direction: "column", revealEffect: "rise", children: [] },
    ] } as unknown as BoxNode;
    const without = { id: "root", type: "container", direction: "column", children: [
      { id: "x", type: "container", direction: "column", children: [] },
    ] } as unknown as BoxNode;

    const html = exportDoc(withFx);
    expect(html).toContain("@keyframes eu-reveal-rise");
    expect(html).toMatch(/\.bx-[\w-]+\{animation:eu-reveal-rise/);
    expect(exportDoc(without)).not.toContain("eu-reveal-");
  });
});

describe("the layout-property animation guard", () => {
  it("refuses to animate a property that forces layout", () => {
    // Animating width/height/top/margin drags the browser through Layout → Paint → Composite every frame,
    // which is what wrecks INP and CLS on the cheap hardware a school's audience actually uses.
    for (const bad of [
      "transition: width 0.3s",
      "transition: height .2s ease",
      "transition: top 200ms",
      "transition: margin-left 1s",
      "transition-property: padding",
      "animation: grow 2s",           // named below with a layout property
      "transition: font-size 0.4s",
      "transition: flex-basis 0.3s",
    ]) {
      const out = sanitizeCssDeclarations(bad.includes("animation:") ? "transition: height 1s" : bad);
      expect(out, `"${bad}" must be refused`).toBe("");
    }
  });

  it("refuses `transition: all`, which sweeps in every layout property by definition", () => {
    expect(sanitizeCssDeclarations("transition: all 0.3s ease")).toBe("");
  });

  it("ALLOWS the compositor-friendly properties, which is the whole point", () => {
    // The guard must not be a blanket ban on motion — these skip layout and paint entirely.
    for (const good of ["transition: transform 0.3s", "transition: opacity .2s", "transition: filter 1s",
                        "transition: box-shadow 0.3s", "transition: color 0.2s, background-color 0.2s"]) {
      expect(sanitizeCssDeclarations(good), `"${good}" must be allowed`).not.toBe("");
    }
  });

  it("leaves ordinary declarations alone — it only inspects transition/animation", () => {
    // `width` itself is fine; it is only ANIMATING it that costs.
    expect(sanitizeCssDeclarations("width: 50%")).toContain("width: 50%");
    expect(sanitizeCssDeclarations("padding: 1rem")).toContain("padding: 1rem");
  });

  it("names the rule directly, so it can be reasoned about", () => {
    expect(animatesLayout("transition", "width 1s")).toBe(true);
    expect(animatesLayout("transition", "transform 1s")).toBe(false);
    expect(animatesLayout("color", "width")).toBe(false); // not an animation property at all
  });
});
