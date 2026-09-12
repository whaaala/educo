import { describe, it, expect } from "vitest";
import { createContainer, createElement, fadeColor, fadedPaint, paintAlpha, boxOpacity, fadesPaintOnly, paintsViaLayer, paintLayerCss, treePaintLayerCss, backgroundCss, type BoxNode } from "@/lib/box-model";

/**
 * SEE-THROUGH — a box fades, its contents do not.
 *
 * Behaviours: tests/features/components/website/box-builder-design.feature.
 *
 * CSS `opacity` is a group operation: it fades the element and everything inside it, and a child cannot opt
 * out — there is no value a child can set that undoes its parent's. So "make this grid see-through" cannot be
 * `opacity`, because what it means is "let the page show through THIS BOX" with the cards inside untouched.
 * The fade goes into the box's own paint instead, and `fadeContents` is the explicit opt-in for the other
 * meaning. The rule is the same at every depth — a child protects its own content exactly as its parent does.
 */

const section = (patch: Partial<BoxNode> = {}) =>
  Object.assign(createContainer("column", { background: "#3366cc" }), patch);

describe("what a see-through box fades", () => {
  it("a box holding content fades only its OWN paint — never publishes opacity", () => {
    const n = section({ opacity: 40 });
    expect(fadesPaintOnly(n)).toBe(true);
    expect(boxOpacity(n), "no CSS opacity, or everything inside would fade with it").toBeUndefined();
    expect(fadedPaint(n).background).toBe("rgba(51, 102, 204, 0.4)");
  });

  it("ticking 'fade what's inside too' switches to real opacity, and leaves the colours alone", () => {
    const n = section({ opacity: 40, fadeContents: true });
    expect(fadesPaintOnly(n)).toBe(false);
    expect(boxOpacity(n)).toBe(0.4);
    expect(fadedPaint(n).background, "the colour must not fade twice").toBe("#3366cc");
  });

  it("a fully opaque box is untouched by any of it", () => {
    for (const n of [section(), section({ opacity: 100 })]) {
      expect(paintAlpha(n)).toBe(1);
      expect(boxOpacity(n)).toBeUndefined();
      expect(fadedPaint(n).background).toBe("#3366cc");
    }
  });

  it("an ELEMENT fades whole — its own text IS its content, so there is nothing to protect", () => {
    const t = Object.assign(createElement("text"), { opacity: 40 });
    expect(fadesPaintOnly(t)).toBe(false);
    expect(boxOpacity(t)).toBe(0.4);
  });

  it("the fade never reaches a child — a solid child inside a see-through parent stays solid", () => {
    // The whole point, stated as the tree the user describes: a see-through grid holding an untouched cell.
    const child = createContainer("column", { background: "#ffffff" });
    const grid = section({ opacity: 30, children: [child] });
    expect(boxOpacity(grid), "nothing on the parent that CSS would push down the tree").toBeUndefined();
    expect(fadedPaint(child).background, "and the child is drawn exactly as it was set").toBe("#ffffff");
    expect(boxOpacity(child)).toBeUndefined();
  });

  it("a child can be see-through on its own, and protects ITS content in turn", () => {
    const grandchild = createContainer("column", { background: "#111111" });
    const child = createContainer("column", { background: "#ffffff", opacity: 50, children: [grandchild] });
    section({ children: [child] });
    expect(fadedPaint(child).background).toBe("rgba(255, 255, 255, 0.5)");
    expect(boxOpacity(child), "the same rule one level down").toBeUndefined();
    expect(fadedPaint(grandchild).background, "and its own content is untouched").toBe("#111111");
  });

  it("border and overlay fade with the box; the radius, shadow and content do not care", () => {
    const n = section({ opacity: 25, borderColor: "#000000", bgOverlay: "#ff0000" });
    const p = fadedPaint(n);
    expect(p.borderColor).toBe("rgba(0, 0, 0, 0.25)");
    expect(p.bgOverlay).toBe("rgba(255, 0, 0, 0.25)");
  });
});

describe("fadeColor handles every kind of colour this builder stores", () => {
  it("a six-digit hex becomes rgba", () => {
    expect(fadeColor("#3366cc", 0.5)).toBe("rgba(51, 102, 204, 0.5)");
  });

  it("a three-digit hex expands first", () => {
    expect(fadeColor("#36c", 0.5)).toBe("rgba(51, 102, 204, 0.5)");
  });

  it("a gradient fades BOTH stops and stays a gradient", () => {
    // It must come back in the same `gradient:a:b` shape, because colorToCSS is what turns it into CSS and
    // it is called after this — returning a linear-gradient() here would be double-converted.
    expect(fadeColor("gradient:#000000:#ffffff", 0.5)).toBe("gradient:rgba(0, 0, 0, 0.5):rgba(255, 255, 255, 0.5)");
  });

  it("a token or var() cannot be picked apart, so it goes through color-mix", () => {
    expect(fadeColor("var(--eu-color-brand)", 0.4)).toBe("color-mix(in srgb, var(--eu-color-brand) 40%, transparent)");
  });

  it("full alpha is a no-op — never rewrite a colour that is not fading", () => {
    expect(fadeColor("#3366cc", 1)).toBe("#3366cc");
    expect(fadeColor("gradient:#000:#fff", 1)).toBe("gradient:#000:#fff");
  });
});

describe("a background IMAGE fades on a layer of its own", () => {
  const hero = (patch: Partial<BoxNode> = {}) =>
    Object.assign(createContainer("column", { bgImage: "https://example.test/p.jpg" }), patch);

  it("a fading image box paints through ::before, and the box itself paints nothing", () => {
    const n = hero({ opacity: 40 });
    expect(paintsViaLayer(n)).toBe(true);
    expect(backgroundCss(n, fadedPaint(n)), "the element paints NOTHING — or the picture appears twice").toEqual({});
    const rule = paintLayerCss('[data-box-id="h"]', n);
    expect(rule).toContain('[data-box-id="h"]::before');
    expect(rule).toContain("opacity:0.4");
    expect(rule).toContain('url("https://example.test/p.jpg")');
    expect(rule, "behind the box's own content…").toContain("z-index:-1");
    expect(rule, "…and no further: the box becomes a stacking context").toContain("isolation:isolate");
    expect(rule, "the layer is the shape of the box, rounded corners and all").toContain("border-radius:inherit");
    expect(rule, "and never in the way of a click or a drag").toContain("pointer-events:none");
  });

  it("no layer for a box that is not fading — nothing is added to a box that did not ask", () => {
    const n = hero();
    expect(paintsViaLayer(n)).toBe(false);
    expect(paintLayerCss('[data-box-id="h"]', n)).toBe("");
    expect(backgroundCss(n, fadedPaint(n)).backgroundImage, "the image paints on the box as it always did")
      .toContain('url("https://example.test/p.jpg")');
  });

  it("no layer when the fade is meant to take the contents — that is plain opacity again", () => {
    const n = hero({ opacity: 40, fadeContents: true });
    expect(paintsViaLayer(n)).toBe(false);
    expect(paintLayerCss('[data-box-id="h"]', n)).toBe("");
    expect(boxOpacity(n)).toBe(0.4);
  });

  it("a COLOUR-only box never needs a layer — alpha in the colour reaches it", () => {
    expect(paintsViaLayer(section({ opacity: 40 }))).toBe(false);
    expect(paintLayerCss("#x", section({ opacity: 40 }))).toBe("");
  });

  it("the border still fades in its own colour — it is not part of the background stack", () => {
    const n = hero({ opacity: 40, borderColor: "#000000", borderWidth: 2 });
    expect(fadedPaint(n).borderColor).toBe("rgba(0, 0, 0, 0.4)");
  });

  it("treePaintLayerCss reaches every box in the tree, at any depth", () => {
    const deep = hero({ id: "deep", opacity: 20 } as Partial<BoxNode>);
    const mid = createContainer("column", { id: "mid", children: [deep] } as Partial<BoxNode>);
    const root = createContainer("column", { id: "root", children: [mid] } as Partial<BoxNode>);
    const css = treePaintLayerCss(root, (id) => `#${id}`);
    expect(css).toContain("#deep::before");
    expect(css).not.toContain("#mid::before");
  });
});
