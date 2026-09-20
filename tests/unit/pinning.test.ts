import { describe, it, expect } from "vitest";
import {
  pinCSS, pinBlockedBy, childStyle, createContainer, createGrid, type BoxNode,
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
