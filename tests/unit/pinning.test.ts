import { describe, it, expect } from "vitest";
import {
  pinCSS, pinBlockedBy, bandCarriesPin, childStyle, createContainer, createGrid, type BoxNode,
} from "@/lib/box-model";
import { PAGE_Z } from "@/lib/educo-ui/stacking";

/**
 * PINNING — `position: sticky` as an option on any block. Phase 3 of the Layout System.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The whole value of pinning is that the canvas and the published page agree about it, so the tests that
 * matter most are the ones asserting there is exactly ONE resolver and that both engines reach it. A sticky
 * block that works in the builder and scrolls away on the school's live site is worse than no feature.
 */

const box = (extras: Partial<BoxNode>) => createContainer("column", extras as Partial<BoxNode>);

describe("pinCSS — the one resolver", () => {
  it("a block nobody pinned emits nothing at all", () => {
    // Not `position: static`, not an empty rule — NOTHING. A block that has never been pinned must produce
    // the same CSS it did before pinning existed, or every saved page changes the day this ships.
    expect(pinCSS(box({}))).toEqual({});
  });

  it("pinned to the top writes `top`, and pinned to the bottom writes `bottom`", () => {
    const top = pinCSS(box({ pin: "top" }));
    expect(top.position).toBe("sticky");
    expect(top.top).toBeTruthy();
    expect(top.bottom).toBeUndefined();   // writing BOTH is how a sticky block ends up inert

    const bottom = pinCSS(box({ pin: "bottom" }));
    expect(bottom.position).toBe("sticky");
    expect(bottom.bottom).toBeTruthy();
    expect(bottom.top).toBeUndefined();
  });

  it("sits on the sticky rung of the page ladder, not a number somebody picked", () => {
    expect(pinCSS(box({ pin: "top" })).zIndex).toBe(PAGE_Z.sticky);
  });

  it("the offset is emitted in the fluid base unit, never a raw pixel", () => {
    // Responsive Field Guide: a stored size must not reach the page as px, or a reader who raised their
    // browser font gets an offset that ignores them.
    const css = pinCSS(box({ pin: "top", pinOffset: 24 }));
    expect(String(css.top)).not.toMatch(/\d+px/);
    expect(String(css.top)).toContain("var(--box-u");
  });

  it("a FLOATING block is never pinned — the two are the same CSS property", () => {
    // `position: absolute` and `position: sticky` cannot both apply. Free positioning wins, because the user
    // placed that block by hand and sticky would silently move it. Without this clause the winner would be
    // whichever the object spread happened to write last.
    expect(pinCSS(box({ pin: "top", position: "absolute", left: 10, top: 10 }))).toEqual({});
  });

  /**
   * CLAUSE 3 — the contract for “it has somewhere to travel”.
   *
   * These assert the CSS text, which is all a unit test can do, and that is exactly why they are not enough
   * on their own: `tests/e2e/pinning-holds.spec.ts` scrolls a real page and measures whether the block
   * actually held. Both exist deliberately — this guards the resolver's contract, that one guards the
   * behaviour. The feature shipped for its whole life with only the first kind, and did nothing.
   */
  describe("clause 3 — a stretched block has nowhere to go", () => {
    it("a pinned child of a ROW is taken out of the stretch", () => {
      const row = createContainer("row", { direction: "row" } as Partial<BoxNode>);
      expect(pinCSS(box({ pin: "top" }), row).alignSelf).toBe("flex-start");
    });

    it("a pinned child of a GRID is too", () => {
      expect(pinCSS(box({ pin: "top" }), createGrid(3)).alignSelf).toBe("flex-start");
    });

    it("a pinned child of a COLUMN is NOT — there the cross axis is width", () => {
      // Writing `align-self` in a column shrinks a full-width pinned header to the width of its text.
      // That would be a different bug traded for this one.
      const col = createContainer("column", { direction: "column" } as Partial<BoxNode>);
      expect(pinCSS(box({ pin: "top" }), col).alignSelf).toBeUndefined();
    });

    it("nothing is written for a block nobody pinned, whatever the parent", () => {
      const row = createContainer("row", { direction: "row" } as Partial<BoxNode>);
      expect(pinCSS(box({}), row)).toEqual({});
    });
  });

  /**
   * CLAUSE 4 — the band hoist. A wrapper that hugs its only child gives that child no travel, so the BAND
   * is what has to move. The builder puts every top-level block in its own band, which makes this the
   * ordinary case rather than a corner: a pinned header alone in its band lost the whole 700px it was
   * scrolled until this existed.
   */
  describe("clause 4 — a hugging band carries its only child's pin", () => {
    const wrapper = (kids: BoxNode[], extras: Partial<BoxNode> = {}) =>
      createContainer("row", { rowBand: true, children: kids, ...extras } as Partial<BoxNode>);

    it("the band writes the pin, at the CHILD's edge and offset", () => {
      const kid = box({ id: "kid", pin: "bottom", pinOffset: 12 });
      const band = wrapper([kid]);
      expect(bandCarriesPin(band)?.id).toBe("kid");
      const css = pinCSS(band, createContainer("column"));
      expect(css.position).toBe("sticky");
      expect(css.bottom).toBeTruthy();
      expect(css.top).toBeUndefined();
    });

    it("…and the child stands down, so only one element writes `position`", () => {
      const kid = box({ id: "kid", pin: "top" });
      expect(pinCSS(kid, wrapper([kid]))).toEqual({});
    });

    it("a band with TWO children does not hoist — the child has real travel there", () => {
      const kid = box({ id: "kid", pin: "top" });
      const band = wrapper([kid, box({ id: "other" })]);
      expect(bandCarriesPin(band)).toBeNull();
      expect(pinCSS(kid, band).position).toBe("sticky"); // the child keeps it
    });

    it("a band with a height of its own does not hoist", () => {
      // It gives its child room, and hoisting would stick the whole band instead of the block.
      const kid = box({ id: "kid", pin: "top" });
      expect(bandCarriesPin(wrapper([kid], { minHeight: 600 }))).toBeNull();
    });

    it("an ordinary container that is not a band never hoists", () => {
      const kid = box({ id: "kid", pin: "top" });
      expect(bandCarriesPin(createContainer("column", { children: [kid] } as Partial<BoxNode>))).toBeNull();
    });

    it("a band whose only child is NOT pinned carries nothing", () => {
      expect(bandCarriesPin(wrapper([box({ id: "kid" })]))).toBeNull();
    });
  });
});

describe("childStyle reaches the resolver from BOTH engines", () => {
  // The bug this exists for would be silent: pinning working in a Stack and doing nothing in a Grid, because
  // `childStyle` returns early for a grid parent and the pin was applied after that return.
  it("a child of a flex parent is pinned", () => {
    const s = childStyle(box({ pin: "top" }), createContainer("column"));
    expect(s.position).toBe("sticky");
  });

  it("a child of a GRID parent is pinned identically", () => {
    const s = childStyle(box({ pin: "top" }), createGrid(12));
    expect(s.position).toBe("sticky");
  });

  it("both engines agree on every declaration, not merely on `position`", () => {
    const flex = childStyle(box({ pin: "bottom", pinOffset: 16 }), createContainer("column"));
    const grid = childStyle(box({ pin: "bottom", pinOffset: 16 }), createGrid(12));
    for (const k of ["position", "bottom", "zIndex"] as const) {
      expect(grid[k], `${k} must match between the two engines`).toEqual(flex[k]);
    }
  });
});

describe("pinBlockedBy — naming the ancestor that makes sticky inert", () => {
  /**
   * `position: sticky` is measured against the nearest SCROLL CONTAINER, and `overflow: hidden` makes one.
   * The wrapper clips whenever a block is clipped OR merely has a corner radius — so rounding a section, an
   * entirely ordinary thing to do, silently switches off a sticky block inside it. Nothing errors. The
   * inspector is the only place that can say so, and it can only say so if this finds it.
   */
  const tree = (ancestor: Partial<BoxNode>): BoxNode => ({
    ...createContainer("column", { id: "root" } as Partial<BoxNode>),
    id: "root",
    children: [{
      ...createContainer("column", { id: "mid", ...ancestor } as Partial<BoxNode>),
      id: "mid",
      children: [{ ...createContainer("column", { id: "kid", pin: "top" } as Partial<BoxNode>), id: "kid", children: [] }],
    }],
  });

  it("finds a CLIPPED ancestor", () => {
    expect(pinBlockedBy(tree({ clip: true }), "kid")?.id).toBe("mid");
  });

  it("finds an ancestor that merely has a corner radius — the case nobody would guess", () => {
    expect(pinBlockedBy(tree({ radius: 12 }), "kid")?.id).toBe("mid");
  });

  it("reports nothing when the chain is clear", () => {
    expect(pinBlockedBy(tree({}), "kid")).toBeNull();
  });

  it("a block's OWN clipping is irrelevant — it is an ANCESTOR that captures it", () => {
    const t = tree({});
    t.children![0].children![0].clip = true;
    expect(pinBlockedBy(t, "kid"), "its own overflow does not create the scroll container above it").toBeNull();
  });

  it("says nothing about a block that is not pinned, however clipped its ancestors", () => {
    const t = tree({ clip: true });
    delete t.children![0].children![0].pin;
    expect(pinBlockedBy(t, "kid")).toBeNull();
  });

  it("returns null for an id that is not in the tree", () => {
    expect(pinBlockedBy(tree({ clip: true }), "nobody")).toBeNull();
  });
});
