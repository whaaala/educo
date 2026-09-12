import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createComponent, componentBoxCss, resizeTopEdge, hugsContent, blockContainmentCss, clampFloatGeom, floatBox, findBox, widthPct, isFloating, isClipped, clampContentScale, MIN_CONTENT_SCALE, comfortableWidth, COMFORTABLE_LINES, PLACEMENT_INSET_PCT, type BoxNode } from "@/lib/box-model";
import { renderSitePage } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";

/** One page through the SHIPPING export path — the app no longer emits the single-document shape. */
const exportDoc = (root: BoxNode) => {
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

// Every component offered in the Blocks palette. A new component MUST be added here — the rule it guards
// (RULE G: the component itself resizes from all four sides) applies to every component we add.
const COMPONENTS = ["accordion", "alert", "card", "quote", "stat", "badge", "rating"];

/** A page whose single block is a height- and width-resized instance of `component`. */
function pageWith(component: string): BoxNode {
  const node = createComponent(component, { id: "tgt", width: "100%", height: "200px" });
  return createContainer("column", { id: "page", children: [createContainer("row", { id: "row", children: [node] })] });
}

function renderCanvas(root: BoxNode) {
  render(<BoxCanvas root={root} theme={DEFAULT_THEME} onChange={vi.fn()} selectedId="tgt" onSelectId={vi.fn()} />);
  return document.querySelector('[data-box-id="tgt"]') as HTMLElement;
}

describe("Component sizing — the component itself fills its block (RULE G)", () => {
  for (const component of COMPONENTS) {
    it(`${component}: every wrapper between the block and the component element is a definite-size box`, () => {
      cleanup();
      const box = renderCanvas(pageWith(component));
      expect(box).toBeTruthy();
      const euRoot = box.querySelector(".eu-root") as HTMLElement;
      expect(euRoot).toBeTruthy();
      // It fills by STRETCHING inside the block's column flex, not by a percentage height: a percentage needs a
      // definite parent, and the block's height is a floor (min-height) so its content can never spill out.
      expect(euRoot.style.flex).toBe("1 1 auto");
      // Width must NOT be a percentage: a percentage-width child contributes nothing to a shrink-to-fit
      // parent, which collapsed every "Fit" component to its padding. Block-level auto fills AND hugs.
      expect(euRoot.style.width).toBe("");

      // Walk from .eu-root down to the component's own `.eu-<name>` element. Every wrapper introduced on the
      // way (the innerHTML holder that registry + alert components use) must carry width AND height 100% —
      // a wrapper with auto height makes the component's `height:100%` resolve to nothing, which is exactly
      // the bug that stopped the Alert resizing (the box grew, the alert did not).
      let el: HTMLElement | null = euRoot.firstElementChild as HTMLElement | null;
      while (el) {
        if (el.tagName === "STYLE") { el = el.nextElementSibling as HTMLElement | null; continue; }
        if (/(^| )eu-[a-z-]+( |$)/.test(el.className) && !el.className.includes("eu-root")) break; // reached the component
        expect(el.style.height, `${component}: wrapper height`).toBe("100%"); // inside .eu-root, which is stretched
        expect(el.style.width, `${component}: wrapper must not force a % width`).toBe("");
        el = el.firstElementChild as HTMLElement | null;
      }
      expect(el, `${component}: renders an .eu-* component element`).toBeTruthy();
    });

    it(`${component}: a sized block emits width/height fill onto the component's own element`, () => {
      const sized = createComponent(component, { id: "tgt", width: "100%", height: "200px" });
      const css = componentBoxCss(sized);
      expect(css).toContain("width:100%");
      expect(css).toContain("height:100%");
      // An unsized block must NOT be forced to fill — it hugs its content.
      expect(componentBoxCss(createComponent(component, { id: "t2" }))).not.toContain("height:100%");
    });

    it(`${component}: the exported HTML carries the same fill, so canvas === export`, () => {
      const html = exportDoc(pageWith(component));
      expect(html).toMatch(/height:\s*100%/);
      expect(html).toContain("200px");
    });
  }

  it("a multi-item component's items share the extra height, so the visible component grows", async () => {
    const { COMPONENT_CSS } = await import("@/lib/educo-ui/components");
    // Without this the alert stack would fill the box while each alert row stayed at its natural height,
    // leaving an empty gap under the message instead of a taller alert.
    expect(COMPONENT_CSS.replace(/\s+/g, " ")).toContain(".eu-alert-stack > .eu-alert { flex: 1 1 auto; }");
  });
});

describe("Top-edge resize is edge-anchored and never leaves the page (RULE H)", () => {
  // One coordinate space: px relative to the parent's content box. A block from y=100 to y=180, page top y=20.
  const START_TOP = 100, START_BOT = 180, MIN_H = 8, PAGE_TOP = 20;

  it("moves the TOP edge and leaves the BOTTOM exactly where it was", () => {
    const { top, height } = resizeTopEdge(START_TOP, START_BOT, -50, MIN_H, PAGE_TOP);
    expect(top).toBe(50);
    expect(height).toBe(130); // grew by the full 50 dragged
    expect(top + height).toBe(START_BOT); // bottom anchored
  });

  it("grows by exactly the distance dragged", () => {
    for (const dy of [-1, -10, -25, -79]) {
      const { height } = resizeTopEdge(START_TOP, START_BOT, dy, MIN_H, PAGE_TOP);
      expect(height).toBe(START_BOT - START_TOP - dy);
    }
  });

  it("shrinks when dragged down, and never collapses past the minimum", () => {
    expect(resizeTopEdge(START_TOP, START_BOT, 40, MIN_H, PAGE_TOP).height).toBe(40);
    expect(resizeTopEdge(START_TOP, START_BOT, 500, MIN_H, PAGE_TOP).height).toBe(MIN_H);
  });

  it("NEVER lets the top edge go above the page, however far it is dragged", () => {
    for (const dy of [-81, -200, -5000]) {
      const { top } = resizeTopEdge(START_TOP, START_BOT, dy, MIN_H, PAGE_TOP);
      expect(top).toBeGreaterThanOrEqual(PAGE_TOP);
    }
  });

  it("keeps growing at the page top instead of going dead — the overshoot extends the BOTTOM", () => {
    // Dragging 120 up from y=100 asks for a top of -20, which is 40 past the page top (y=20).
    const { top, height } = resizeTopEdge(START_TOP, START_BOT, -120, MIN_H, PAGE_TOP);
    expect(top).toBe(PAGE_TOP);              // pinned at the page top
    expect(height).toBe(200);                // still grew by the full 120 dragged
    expect(top + height).toBe(START_BOT + 40); // the overshoot went to the bottom
  });

  it("a block already flush against the page top still grows (the reported dead-handle case)", () => {
    const { top, height } = resizeTopEdge(PAGE_TOP, PAGE_TOP + 80, -100, MIN_H, PAGE_TOP);
    expect(top).toBe(PAGE_TOP);
    expect(height).toBe(180); // 80 + the 100 dragged
  });
});

describe("A 'Fit' block hugs its content — the component IS the block (RULE K)", () => {
  // Container queries need `container-type: inline-size`, which makes an element's inline size INDEPENDENT of
  // its contents. Every component sets it, so on a hug-to-content block it collapsed the component to its
  // padding — the Alert rendered as a 42px column of one-letter-per-line text inside a full-width band, which
  // is what read as "a wrapper around the component". Containment is turned off exactly while a block hugs.
  const HUG_RULE = "container-type:normal !important";

  it("recognises which blocks hug their content", () => {
    // "Fit" in the inspector clears the width; a palette-added component defaults to full width.
    expect(hugsContent({ id: "a", type: "component" } as BoxNode)).toBe(true);
    expect(hugsContent(createComponent("alert", { id: "a", width: "auto" }))).toBe(true);
    expect(hugsContent(createComponent("alert", { id: "a", width: "fill" }))).toBe(false);
    expect(hugsContent(createComponent("alert", { id: "a", width: "50%" }))).toBe(false);
  });

  it("puts the query container on the BLOCK BOX, so a component queries its own width and not the page", () => {
    // A component cannot query its own `container-type` — a query resolves against the nearest ANCESTOR
    // container. With containment only on `.eu-alert` itself, `@container (max-width:22rem){.eu-alert{...}}`
    // measured the page, so a 205px alert never wrapped. The container belongs on the box around it.
    expect(blockContainmentCss(createComponent("alert", { id: "a", width: "fill" }), ".s")).toBe(".s{container-type:inline-size}");
    expect(blockContainmentCss(createComponent("alert", { id: "a", width: "50%" }), ".s")).toBe(".s{container-type:inline-size}");
  });

  it("turns containment off while hugging, because intrinsic width and containment cannot coexist", () => {
    // Measured in a real browser: the same text is 252px wide without containment and 16px (padding only) with
    // it. So a hug block trades its container queries for being able to size to its contents at all.
    expect(blockContainmentCss(createComponent("alert", { id: "a", width: "auto" }), ".s")).toBe(`.s,.s *{${HUG_RULE}}`);
    expect(blockContainmentCss({ id: "a", type: "component" } as BoxNode, ".s")).toBe(`.s,.s *{${HUG_RULE}}`);
  });

  for (const component of COMPONENTS) {
    it(`${component}: a Fit block emits the hug rule on canvas AND in the export`, () => {
      cleanup();
      const node = createComponent(component, { id: "tgt", width: "auto" }); // Fit
      const root = createContainer("column", { id: "page", children: [createContainer("row", { id: "row", children: [node] })] });

      const box = renderCanvas(root);
      const canvasCss = [...box.querySelectorAll("style")].map((s) => s.textContent ?? "").join("");
      expect(canvasCss, `${component}: canvas hug rule`).toContain(HUG_RULE);

      const html = exportDoc(root);
      expect(html, `${component}: export hug rule`).toContain(HUG_RULE);
    });

    it(`${component}: a Full-width block keeps its container queries`, () => {
      const root = createContainer("column", { id: "page", children: [
        createContainer("row", { id: "row", children: [createComponent(component, { id: "tgt", width: "fill" })] }),
      ] });
      expect(exportDoc(root)).not.toContain(HUG_RULE);
    });
  }
});

describe("Floating never puts a block outside the page (RULE H)", () => {
  // Floating measures the block's CURRENT width as a % of its positioning parent. A full-width block measures
  // ~100% (plus the +1px safety margin), so floating it at any left offset used to hang it off the right of the
  // page — the reported bug. The geometry is clamped so the whole box always stays inside its parent.
  it("caps the width at the parent and pulls the offsets back inside", () => {
    expect(clampFloatGeom(7.9, 50, "100.1%")).toEqual({ left: 0, top: 50, width: "100%" });
    expect(clampFloatGeom(60, 10, "60%")).toEqual({ left: 40, top: 10, width: "60%" });
  });

  it("never allows a negative offset", () => {
    expect(clampFloatGeom(-25, -30, "40%")).toEqual({ left: 0, top: 0, width: "40%" });
  });

  it("leaves a geometry that already fits exactly as it is", () => {
    expect(clampFloatGeom(10, 20, "30%")).toEqual({ left: 10, top: 20, width: "30%" });
  });

  it("leaves a non-percentage width alone (only % can be capped against the parent)", () => {
    expect(clampFloatGeom(10, 20, "320px").width).toBe("320px");
  });

  for (const component of COMPONENTS) {
    it(`${component}: floating a full-width block keeps it inside the page`, () => {
      const root = createContainer("column", { id: "page", children: [
        createContainer("row", { id: "row", rowBand: true, children: [createComponent(component, { id: "tgt", width: "100%" })] }),
      ] });
      // The geometry a full-width block measures: ~100% wide, offset into the parent.
      const floated = floatBox(root, "tgt", "page", 7.9, 50, "100.1%", 80);
      const node = findBox(floated, "tgt")!;
      expect(node.position).toBe("absolute");
      expect(node.left! + widthPct(node.width)).toBeLessThanOrEqual(100);
      expect(node.left).toBeGreaterThanOrEqual(0);
      expect(node.top).toBeGreaterThanOrEqual(0);
    });
  }
});

describe("A newly placed block keeps a gap from the parent's top-left (RULE M)", () => {
  it("insets a block that would otherwise sit flush in the corner", () => {
    const g = clampFloatGeom(0, 0, "30%", PLACEMENT_INSET_PCT);
    expect(g.left).toBe(PLACEMENT_INSET_PCT);
    expect(g.top).toBe(PLACEMENT_INSET_PCT);
  });

  it("leaves a block that is already inside the gap where the user put it", () => {
    expect(clampFloatGeom(40, 30, "30%", PLACEMENT_INSET_PCT)).toEqual({ left: 40, top: 30, width: "30%" });
  });

  it("does not let the inset push a block off the right edge", () => {
    // A full-width block has no room for a left gap — it must still start at 0 rather than overflow.
    expect(clampFloatGeom(0, 0, "100%", PLACEMENT_INSET_PCT).left).toBe(0);
  });

  it("still never leaves the parent (RULE H holds with the inset applied)", () => {
    const g = clampFloatGeom(95, 0, "30%", PLACEMENT_INSET_PCT);
    expect(g.left + 30).toBeLessThanOrEqual(100);
  });

  for (const component of COMPONENTS) {
    it(`${component}: floating it lands with a gap, not in the corner`, () => {
      const root = createContainer("column", { id: "page", children: [
        createContainer("row", { id: "row", rowBand: true, children: [createComponent(component, { id: "tgt", width: "40%" })] }),
      ] });
      const node = findBox(floatBox(root, "tgt", "page", 0, 0, "40%", 80), "tgt")!;
      expect(isFloating(node)).toBe(true);
      expect(node.left).toBeGreaterThanOrEqual(PLACEMENT_INSET_PCT);
      expect(node.top).toBeGreaterThanOrEqual(PLACEMENT_INSET_PCT);
    });
  }
});

describe("A newly added component sizes to its content (RULE L)", () => {
  // The full-width default is what made a component read as "a wrapper taking the whole width of the parent".
  // Content sizing is now the default for EVERY component; Full / Custom are opt-in from the inspector.
  // Existing saved documents are deliberately NOT migrated — they keep the widths they were built with.
  for (const component of COMPONENTS) {
    it(`${component}: is content-sized when added, and therefore hugs`, () => {
      const node = createComponent(component, { id: "tgt" });
      expect(node.width).toBe("auto");
      expect(hugsContent(node)).toBe(true);
      // …so it does not force a fill onto its own element
      expect(componentBoxCss(node)).not.toContain("width:100%");
    });
  }

  it("Full and Custom still override it", () => {
    expect(componentBoxCss(createComponent("alert", { id: "a", width: "fill" }))).toContain("width:100%");
    expect(componentBoxCss(createComponent("alert", { id: "a", width: "40%" }))).toContain("width:100%");
    expect(hugsContent(createComponent("alert", { id: "a", width: "fill" }))).toBe(false);
  });

  it("does not touch blocks that are already saved with an explicit width", () => {
    // A document built before the rule keeps its widths — nothing migrates them.
    const saved = { id: "old", type: "component", component: "card", width: "100%" } as BoxNode;
    expect(hugsContent(saved)).toBe(false);
    expect(componentBoxCss(saved)).toContain("width:100%");
  });
});

describe("Resizing a component never crops it (RULE G)", () => {
  // The bug this guards: a height drag used to write `clip: true` on the node. That is invisible while the
  // block is selected — the selection needs `overflow: visible` to show its handles — so the component only
  // appeared cropped the moment you clicked away. A component's height now floors at the height its own
  // content needs instead, so there is nothing to crop.
  for (const component of COMPONENTS) {
    it(`${component}: a height-resized block is not marked as clipped`, () => {
      const sized = createComponent(component, { id: "tgt", width: "fill", height: "200px" });
      expect(sized.clip).toBeUndefined();
      expect(isClipped(sized)).toBe(false);
    });

    it(`${component}: an explicitly clipped block still clips (the setting is honoured)`, () => {
      expect(isClipped(createComponent(component, { id: "tgt", clip: true }))).toBe(true);
    });
  }
});

describe("Shrinking a component past its content scales the text, never crops it (RULE G)", () => {
  // What the user asked for: drag the height (or width) down to the content's own size and the box follows;
  // drag PAST it and the text scales down so everything still fits, until it reaches the minimum readable
  // size — then the drag stops. Nothing is ever hidden.
  it("clamps a requested scale into the readable range", () => {
    expect(clampContentScale(1)).toBe(1);
    expect(clampContentScale(0.8)).toBe(0.8);
    expect(clampContentScale(0.1)).toBe(MIN_CONTENT_SCALE);   // never smaller than the floor
    expect(clampContentScale(2)).toBe(1);                      // never larger than natural
    expect(clampContentScale(Number.NaN)).toBe(1);             // a bad value falls back to natural
  });

  it("the floor is a readable fraction, not an arbitrary tiny number", () => {
    expect(MIN_CONTENT_SCALE).toBeGreaterThanOrEqual(0.5);
    expect(MIN_CONTENT_SCALE).toBeLessThan(1);
  });

  for (const component of COMPONENTS) {
    it(`${component}: a shrunk block scales its text with em, so every size inside follows`, () => {
      const css = componentBoxCss(createComponent(component, { id: "t", width: "fill", height: "80px", contentScale: 0.75 }));
      expect(css).toContain("font-size:0.75em");
    });

    it(`${component}: a block at natural size carries no scaling at all`, () => {
      expect(componentBoxCss(createComponent(component, { id: "t", width: "fill", height: "300px" }))).not.toContain("font-size:");
      expect(componentBoxCss(createComponent(component, { id: "t", width: "fill", contentScale: 1 }))).not.toContain("font-size:");
    });

    it(`${component}: an out-of-range scale is clamped before it reaches the CSS`, () => {
      expect(componentBoxCss(createComponent(component, { id: "t", height: "10px", contentScale: 0.05 })))
        .toContain(`font-size:${MIN_CONTENT_SCALE}em`);
    });

    it(`${component}: the scale is carried into the exported site too`, () => {
      const root = createContainer("column", { id: "page", children: [
        createContainer("row", { id: "row", rowBand: true, children: [createComponent(component, { id: "tgt", width: "fill", height: "80px", contentScale: 0.7 })] }),
      ] });
      expect(exportDoc(root)).toContain("font-size:0.7em");
    });
  }
});

describe("Narrowing a component scales its text once wrapping gets untidy (RULE O, width)", () => {
  // Wrapping is normal and stays untouched while the text still reads well. Past the COMFORTABLE width — where
  // it would wrap to more than a tidy couple of lines — the font scales instead, so a narrow component never
  // becomes the tall one-word-per-line column it used to.
  it("the comfortable width is the one-line width shared over a tidy number of lines", () => {
    expect(COMFORTABLE_LINES).toBeGreaterThanOrEqual(2);
    expect(comfortableWidth(400, 90)).toBe(400 / COMFORTABLE_LINES);
  });

  it("never proposes a width narrower than the longest unbreakable word", () => {
    // A long single word (200px) beats the 400/2 = 200 share here, and must win outright when it is larger.
    expect(comfortableWidth(400, 320)).toBe(320);
    expect(comfortableWidth(100, 250)).toBe(250);
  });

  it("rounds up, so the reference is never a fraction of a pixel short", () => {
    expect(comfortableWidth(401, 10)).toBe(Math.ceil(401 / COMFORTABLE_LINES));
  });

  it("the scale that follows from it stays in the readable range", () => {
    const comfy = comfortableWidth(400, 90); // 200
    expect(clampContentScale(300 / comfy)).toBe(1);              // roomy → no scaling at all
    expect(clampContentScale(200 / comfy)).toBe(1);              // exactly comfortable → still none
    expect(clampContentScale(150 / comfy)).toBeCloseTo(0.75, 5); // narrower → scales proportionally
    expect(clampContentScale(20 / comfy)).toBe(MIN_CONTENT_SCALE); // far too narrow → floors, never vanishes
  });
});
