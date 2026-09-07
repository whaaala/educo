import { describe, it, expect } from "vitest";
import { combineMinHeight, containerStyle, createContainer, createGrid, type BoxNode } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * A SECTION MEASURED AGAINST THE SCREEN — the full-screen hero, and the split-screen that fills the window.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Two decisions carry the whole feature, and both are easy to get wrong in a way nobody notices until it is
 * on a phone: the UNIT (`svh`, not `vh`) and the fact that it is a FLOOR (`min-height`, never `height`).
 */

describe("the unit is svh, and that is not a detail", () => {
  it("full screen is 100svh and half is 50svh", () => {
    expect(combineMinHeight(undefined, "full")).toBe("100svh");
    expect(combineMinHeight(undefined, "half")).toBe("50svh");
  });

  it("never emits vh, which is taller than the screen actually is on a phone", () => {
    // `100vh` is the viewport WITHOUT the browser's own chrome, which is hidden only after you scroll. A hero
    // sized that way overflows on arrival and drops its last line below the fold — on the one device where
    // that matters most. `svh` is the small viewport height: it always fits, then grows into the extra room.
    for (const s of ["full", "half"] as const) {
      const v = combineMinHeight(undefined, s)!;
      expect(v).toContain("svh");
      expect(v).not.toMatch(/\d+vh\b/);
    }
  });

  it("does nothing at all when the box was never asked to be screen-sized", () => {
    expect(combineMinHeight(undefined, undefined)).toBeUndefined();
    expect(combineMinHeight("12rem", undefined)).toBe("12rem");
  });
});

describe("it is a FLOOR, so content is never cut off", () => {
  it("combines with the box's own minimum, larger wins", () => {
    // A hero whose words outgrow the screen must get TALLER, not hide them. `max()` says exactly that, and
    // says it to the browser rather than to whichever of the two values happened to be written last.
    expect(combineMinHeight("40rem", "full")).toBe("max(40rem, 100svh)");
    expect(combineMinHeight("10rem", "half")).toBe("max(10rem, 50svh)");
  });

  it("reaches a container's style as min-height, never height", () => {
    const s = containerStyle(createContainer("column", { screenHeight: "full" } as Partial<BoxNode>));
    expect(s.minHeight).toBe("100svh");
    expect(s.height, "a cap would crop the content it was meant to hold").toBeUndefined();
  });

  it("works on a grid as well as a plain section", () => {
    expect(containerStyle(createGrid(12, { screenHeight: "half" } as Partial<BoxNode>)).minHeight).toBe("50svh");
  });
});

describe("it reaches the published page", () => {
  it("emits the screen height in the exported stylesheet", () => {
    const root = createContainer("column", { id: "root", children: [
      createContainer("column", { id: "hero", screenHeight: "full" } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("min-height:100svh");
  });
});
