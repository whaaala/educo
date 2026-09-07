import { describe, it, expect } from "vitest";
import { bandEdgeCSS, createContainer, type BoxNode } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * SLOPED AND CURVED BAND EDGES.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The plan called this the clearest case of "the capability exists, only the control is missing" — the model
 * could always do it through per-block Advanced CSS, which means a teacher typing `clip-path`, which means it
 * never happened.
 *
 * The thing worth guarding is that the shape is expressed entirely in PERCENTAGES. That is what makes it
 * survive any width, height and breakpoint with no media query, and it is the reason both edges live in one
 * `clip-path` rather than one being done with `border-radius` — which the corner-radius control already owns.
 */

const band = (o: Partial<BoxNode>) => createContainer("column", o as Partial<BoxNode>);
const clip = (o: Partial<BoxNode>) => bandEdgeCSS(band(o)).clipPath as string | undefined;

/** Every `x% y%` pair in a polygon(). */
const points = (css: string) => [...css.matchAll(/(-?[\d.]+)% (-?[\d.]+)%/g)].map((m) => [Number(m[1]), Number(m[2])] as const);

describe("it stays out of the way until asked", () => {
  it("emits nothing when neither edge is shaped", () => {
    expect(bandEdgeCSS(band({}))).toEqual({});
    expect(bandEdgeCSS(band({ edgeDepth: 20 })), "a depth alone is not a shape").toEqual({});
  });
});

describe("the shape is entirely in percentages, so it survives any size", () => {
  it("never emits an absolute unit", () => {
    for (const shape of ["slope-right", "slope-left", "curve-out", "curve-in"] as const) {
      const css = clip({ edgeTop: shape, edgeBottom: shape })!;
      expect(css).toMatch(/^polygon\(/);
      expect(css, `${shape} must not carry a pixel or rem`).not.toMatch(/px|rem|em\b/);
    }
  });

  it("spans the full width, so no sliver of background is left at either side", () => {
    const p = points(clip({ edgeTop: "curve-out", edgeBottom: "slope-left" })!);
    expect(Math.min(...p.map(([x]) => x))).toBe(0);
    expect(Math.max(...p.map(([x]) => x))).toBe(100);
  });
});

describe("each shape does what its name says", () => {
  it("a slope falls the way it is named", () => {
    // Top edge, 10% deep: "slope-right" starts at the very top on the left and drops as it goes right.
    const right = points(clip({ edgeTop: "slope-right", edgeDepth: 10 })!);
    expect(right[0]).toEqual([0, 0]);
    expect(right[1]).toEqual([100, 10]);
    const left = points(clip({ edgeTop: "slope-left", edgeDepth: 10 })!);
    expect(left[0]).toEqual([0, 10]);
    expect(left[1]).toEqual([100, 0]);
  });

  it("a curve is deepest in the MIDDLE and flat at both ends", () => {
    // A cosine arch, not a circle segment: a circle would meet the sides at an angle and read as a lens.
    // Only the TOP edge's own points: the polygon continues with the (flat, default) bottom edge after them,
    // and a curve is 17 samples wide.
    const p = points(clip({ edgeTop: "curve-in", edgeDepth: 10 })!).slice(0, 17);
    const mid = p.find(([x]) => Math.abs(x - 50) < 0.01)!;
    expect(mid[1], "deepest at the centre").toBeCloseTo(10, 1);
    expect(p[0][1], "flat where it meets the left edge").toBeCloseTo(0, 1);
    expect(p[p.length - 1][1], "and the right").toBeCloseTo(0, 1);
  });

  it("curve-out bulges the opposite way to curve-in", () => {
    const into = points(clip({ edgeTop: "curve-in", edgeDepth: 10 })!).find(([x]) => Math.abs(x - 50) < 0.01)!;
    const outOf = points(clip({ edgeTop: "curve-out", edgeDepth: 10 })!).find(([x]) => Math.abs(x - 50) < 0.01)!;
    expect(into[1]).toBeGreaterThan(0);
    expect(outOf[1]).toBeLessThan(0);
  });

  it("the bottom edge cuts UPWARD from 100%, mirroring the top", () => {
    const p = points(clip({ edgeBottom: "slope-right", edgeDepth: 10 })!);
    const ys = p.map(([, y]) => y);
    expect(Math.max(...ys)).toBe(100);
    expect(ys).toContain(90); // 10% up from the bottom
  });
});

describe("the two edges are independent, in ONE clip-path", () => {
  it("a sloped top and a curved bottom come out as a single polygon", () => {
    // `clip-path` is one property, so they cannot be two declarations — and doing curves with `border-radius`
    // instead would collide with the corner-radius control, which owns that property.
    const css = clip({ edgeTop: "slope-right", edgeBottom: "curve-out", edgeDepth: 8 })!;
    expect((css.match(/polygon\(/g) ?? []).length).toBe(1);
    const p = points(css);
    expect(p.some(([, y]) => y > 0 && y < 50), "the top edge is sloped").toBe(true);
    expect(p.some(([, y]) => y > 100), "the bottom edge bulges outward").toBe(true);
  });

  it("depth is clamped, so a shape can never swallow the band", () => {
    expect(clip({ edgeTop: "slope-right", edgeDepth: 500 })).toContain("100% 50%");
    expect(clip({ edgeTop: "slope-right", edgeDepth: -20 })).toContain("100% 0%");
  });
});

describe("it reaches the published page", () => {
  it("the exported stylesheet carries the clip-path", () => {
    const root = createContainer("column", { id: "root", children: [
      createContainer("column", { id: "hero", edgeBottom: "curve-out" } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    expect(renderPageHTML(root, DEFAULT_THEME)).toContain("clip-path:polygon(");
  });
});
