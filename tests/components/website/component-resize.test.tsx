import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createComponent, componentBoxCss, resizeTopEdge, hugsContent, hugContainmentCss, clampFloatGeom, floatBox, findBox, widthPct, isFloating, PLACEMENT_INSET_PCT, type BoxNode } from "@/lib/box-model";
import { renderSiteHTML } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";

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
      expect(euRoot.style.height).toBe("100%");
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
        expect(el.style.height, `${component}: wrapper height`).toBe("100%");
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
      const html = renderSiteHTML(siteFromRoot(pageWith(component)), DEFAULT_THEME);
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

  it("turns containment off while hugging, and leaves it on for a sized block", () => {
    expect(hugContainmentCss(createComponent("alert", { id: "a", width: "auto" }), ".s")).toBe(`.s,.s *{${HUG_RULE}}`);
    expect(hugContainmentCss(createComponent("alert", { id: "a", width: "fill" }), ".s")).toBe("");
  });

  for (const component of COMPONENTS) {
    it(`${component}: a Fit block emits the hug rule on canvas AND in the export`, () => {
      cleanup();
      const node = createComponent(component, { id: "tgt", width: "auto" }); // Fit
      const root = createContainer("column", { id: "page", children: [createContainer("row", { id: "row", children: [node] })] });

      const box = renderCanvas(root);
      const canvasCss = [...box.querySelectorAll("style")].map((s) => s.textContent ?? "").join("");
      expect(canvasCss, `${component}: canvas hug rule`).toContain(HUG_RULE);

      const html = renderSiteHTML(siteFromRoot(root), DEFAULT_THEME);
      expect(html, `${component}: export hug rule`).toContain(HUG_RULE);
    });

    it(`${component}: a Full-width block keeps its container queries`, () => {
      const root = createContainer("column", { id: "page", children: [
        createContainer("row", { id: "row", children: [createComponent(component, { id: "tgt", width: "fill" })] }),
      ] });
      expect(renderSiteHTML(siteFromRoot(root), DEFAULT_THEME)).not.toContain(HUG_RULE);
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
