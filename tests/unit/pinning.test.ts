import { describe, it, expect } from "vitest";
import {
  pinCSS, pinBlockedBy, fixedBlockedBy, blockedByLabel, bandCarriesPin, pinScope, childStyle, createContainer, createGrid,
  createElement, normalizeRowBands, resolveResponsive, updateBoxResponsive, pinArrivalCss, pinArrivalKeyframes,
  pinArrivalHasEffect, treePinArrivalCss, PIN_ARRIVALS, SHADOW_CSS, floatHoldCSS, canvasFixedStyle, pinStackAttr, pinStackNeeded, pinStackGroup, scrollContainerOf, fixedContainerOf, pinHolder, type BoxNode,
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

  it("…and carries how much pinned bar is already stacked above it (Step 2c)", () => {
    /**
     * Two bars held at the same edge must sit under one another rather than on top of each other, and the
     * offset that separates them is the first bar's RENDERED height — which CSS cannot ask for. So the
     * vertical inset reads a custom property that the measuring pass sets.
     *
     * The fallback is `0rem` rather than `0px`, which the guard above caught and was right to: a page that
     * never runs the pass falls back to today's behaviour, and the rule that no raw pixel reaches the page
     * has no exception for a value that happens to be zero.
     */
    const top = String(pinCSS(box({ pin: "top", pinOffset: 24 })).top);
    expect(top, "the stacking offset is missing, so two top bars will cover each other").toContain("var(--eu-pin-above");
    expect(top, "the fallback must be a zero that is not a pixel").toContain("0rem");

    // A CORNER stacks down the screen and not across it, so only the vertical inset carries it.
    const corner = pinCSS(box({ pin: "top-right", pinOffset: 24, hold: "fixed" }));
    expect(String(corner.top), "a corner's vertical inset stacks").toContain("var(--eu-pin-above");
    expect(String(corner.right), "a corner's horizontal inset must NOT stack — bars do not queue sideways").not.toContain("--eu-pin-above");
  });

  describe("a bar stacks against the bars it can actually meet (Step 2c, completed by 2e)", () => {
    /**
     * ── WHAT 2e CHANGED HERE, AND WHY THESE TWO CASES WERE REWRITTEN RATHER THAN DELETED ──
     *
     * 2c was scoped to `hold: "fixed"` and two cases below asserted exactly that: a sticky block carried no
     * marker, and two sticky blocks were never a stack. Both were TRUE OF 2c and both are now wrong, because
     * 2e supplies the thing 2c was missing — a way to say which box each bar holds within.
     *
     * The distinction 2c could not make is still the whole point, and it is why the scoping existed at all: a
     * fixed bar is held against the WINDOW, so all of them share one queue; a sticky bar is held against the
     * box it travels inside, so two of them stack only when that box is the same one. Reaching for sticky
     * without that shoved a rail 160px down the page for a collision that could not happen.
     *
     * So the claim these cases make is now the stronger one: sticky DOES stack, and it stacks per box. Left as
     * they were, they would have described a product we deliberately moved past — which the rules call worse
     * than no test, because it is trusted and wrong.
     */
    it("a FIXED block carries the marker, at the edge it is held against", () => {
      expect(pinStackAttr(box({ pin: "top", hold: "fixed" }))).toBe("top");
      expect(pinStackAttr(box({ pin: "bottom-right", hold: "fixed" }))).toBe("bottom");
    });

    it("a STICKY block carries it too now — and is grouped by the box it holds within, not the window", () => {
      expect(pinStackAttr(box({ pin: "top" })), "sticky is the default").toBe("top");
      expect(pinStackAttr(box({ pin: "top", hold: "sticky" }))).toBe("top");
      // The grouping is what keeps it honest: fixed shares one queue, sticky queues per box.
      expect(pinStackGroup(box({ pin: "top", hold: "fixed" })), "all fixed bars meet at the viewport").toBe("window");
      const parent = createContainer("column", { id: "wrap" } as Partial<BoxNode>);
      expect(pinStackGroup(box({ pin: "top" }), parent), "a sticky bar queues inside its own box").toBe("wrap");
    });

    it("a side rail carries nothing either — bars queue down a screen, never across it", () => {
      expect(pinStackAttr(box({ pin: "left", hold: "fixed" }))).toBeNull();
      expect(pinStackAttr(box({ pin: "right", hold: "fixed" }))).toBeNull();
    });

    it("the script is shipped only when two bars really do share an edge AND a box", () => {
      const page = (kids: BoxNode[]) => createContainer("column", { children: kids } as Partial<BoxNode>);
      const barTop = (id: string) => box({ id, pin: "top", hold: "fixed" });
      expect(pinStackNeeded(page([barTop("a")])), "one bar has nothing to stack under").toBe(false);
      expect(pinStackNeeded(page([barTop("a"), barTop("b")])), "two bars at one edge do").toBe(true);
      expect(
        pinStackNeeded(page([barTop("a"), box({ id: "b", pin: "bottom", hold: "fixed" })])),
        "a top bar and a bottom bar are two stacks of one",
      ).toBe(false);
      // Two STICKY bars sharing a box DO need it — the case 2c left on the table.
      expect(
        pinStackNeeded(page([box({ id: "a", pin: "top" }), box({ id: "b", pin: "top" })])),
        "two sticky bars in the same box cover each other",
      ).toBe(true);
      // …and two in DIFFERENT boxes do not, which is the regression 2c was scoped to avoid.
      const section = (id: string, kid: BoxNode) =>
        createContainer("column", { id, children: [kid] } as Partial<BoxNode>);
      expect(
        pinStackNeeded(page([section("s1", box({ id: "a", pin: "top" })), section("s2", box({ id: "b", pin: "top" }))])),
        "two sticky bars that hand over are not a stack",
      ).toBe(false);
    });
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

    it("a FIXED child is never hoisted — it does not travel inside anything", () => {
      // The hoist buys travel within a parent. A fixed block is measured against the viewport, so moving
      // its pin onto the band would relocate the pin to a block the user did not pin, for no gain.
      const kid = box({ id: "kid", pin: "top", hold: "fixed" });
      expect(bandCarriesPin(wrapper([kid]))).toBeNull();
      expect(pinCSS(kid, wrapper([kid])).position).toBe("fixed");
    });
  });

  /**
   * FIXED — the second mechanism, and genuinely a different thing rather than a stronger sticky.
   */
  describe("hold: fixed", () => {
    it("writes `fixed`, and sticky stays the default for every page saved before this existed", () => {
      expect(pinCSS(box({ pin: "top", hold: "fixed" })).position).toBe("fixed");
      expect(pinCSS(box({ pin: "top" })).position).toBe("sticky");
      expect(pinCSS(box({ pin: "top", hold: "sticky" })).position).toBe("sticky");
    });

    it("a CORNER writes both of its insets", () => {
      const css = pinCSS(box({ pin: "bottom-right", hold: "fixed", pinOffset: 16 }));
      expect(css.bottom).toBeTruthy();
      expect(css.right).toBeTruthy();
      expect(css.top).toBeUndefined();
      expect(css.left).toBeUndefined();
    });

    it("a fixed block takes no alignment from its parent — it is out of the flow", () => {
      const row = createContainer("row", { direction: "row" } as Partial<BoxNode>);
      expect(pinCSS(box({ pin: "top", hold: "fixed" }), row).alignSelf).toBeUndefined();
      // …while a sticky one in the same parent still does.
      expect(pinCSS(box({ pin: "top" }), row).alignSelf).toBe("flex-start");
    });

    it("STICKY resolves a corner or a side down to one vertical edge", () => {
      // The UI never offers these for sticky, but switching fixed → sticky can leave one behind, and two
      // insets is exactly how a sticky block ends up inert. It resolves here rather than trusting the UI.
      expect(pinCSS(box({ pin: "bottom-right" })).bottom).toBeTruthy();
      expect(pinCSS(box({ pin: "bottom-right" })).right).toBeUndefined();
      expect(pinCSS(box({ pin: "top-left" })).top).toBeTruthy();
      expect(pinCSS(box({ pin: "left" })).top, "a bare side has no vertical sense — it holds to the top").toBeTruthy();
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

/**
 * PINNING PER DEVICE — through `childStyle`, exactly as both engines call it: each node resolved at the rung,
 * the rung passed along.
 *
 * `resolveResponsive` resolves a node and not its children, and the hoist decides by looking at the band's
 * CHILDREN — so it looked at the desktop's. Measured before the fix: a phone-only pin left the band `{}` and
 * made the block sticky inside a band that hugs it (zero travel), and a pin turned off on phones left the
 * band sticky on phones. The second was also lost on save, because `{ pin: undefined }` is `{}` in JSON.
 */
describe("pinning per device — the band decides at the rung it is drawn at", () => {
  const shaped = (kid: BoxNode) => normalizeRowBands(createContainer("column", { id: "root", children: [kid] } as Partial<BoxNode>));
  const at = (root: BoxNode, bp: "base" | "phone") => {
    const band = root.children![0];
    const kid = band.children![0];
    return {
      band: childStyle(resolveResponsive(band, bp), resolveResponsive(root, bp), bp).position,
      kid: childStyle(resolveResponsive(kid, bp), resolveResponsive(band, bp), bp).position,
    };
  };

  it("a pin set ONLY on phones is carried by its band on phones, and nowhere else", () => {
    const root = shaped(createContainer("column", { id: "nav", minHeight: 64, responsive: { phone: { pin: "top" } } } as Partial<BoxNode>));
    expect(at(root, "phone").band, "on phones the BAND sticks…").toBe("sticky");
    expect(at(root, "phone").kid, "…and the block stands down, so only one element writes `position`").not.toBe("sticky");
    expect(at(root, "base").band, "the desktop was never pinned").not.toBe("sticky");
  });

  it("a pin turned OFF on phones stops on phones — and the choice survives a save", () => {
    const pinned = shaped(createContainer("column", { id: "nav", minHeight: 64, pin: "top" } as Partial<BoxNode>));
    // The Inspector's "Scrolls away", made at the phone rung, then saved and loaded again.
    const off = updateBoxResponsive(pinned, "nav", { pin: undefined, hold: undefined }, "phone");
    const reloaded = JSON.parse(JSON.stringify(off)) as BoxNode;
    for (const [name, root] of [["before the save", off], ["after the save", reloaded]] as const) {
      expect(at(root, "phone").band, `${name}: nothing sticks on phones`).not.toBe("sticky");
      expect(at(root, "phone").kid, `${name}: nothing sticks on phones`).not.toBe("sticky");
      expect(at(root, "base").band, `${name}: the desktop still holds`).toBe("sticky");
    }
  });
});

describe("resolveResponsive — a clear made at a rung", () => {
  it("is stored as null, so a save keeps it", () => {
    const root = createContainer("column", { id: "a", screenHeight: "full" } as Partial<BoxNode>);
    const cleared = updateBoxResponsive(root, "a", { screenHeight: undefined }, "phone");
    const saved = JSON.parse(JSON.stringify(cleared)) as BoxNode;
    expect(saved.responsive?.phone).toHaveProperty("screenHeight", null);
  });

  it("resolves to ABSENT — never to a null a `!== undefined` check would mistake for a setting", () => {
    const root = createContainer("column", { id: "a", screenHeight: "full" } as Partial<BoxNode>);
    const saved = JSON.parse(JSON.stringify(updateBoxResponsive(root, "a", { screenHeight: undefined }, "phone"))) as BoxNode;
    const r = resolveResponsive(saved, "phone");
    expect(r.screenHeight).toBeUndefined();
    expect(resolveResponsive(saved, "base").screenHeight, "the desktop keeps its own").toBe("full");
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

/**
 * `fixedBlockedBy` — the warning for the other silent failure.
 *
 * A fixed block is captured by any ancestor carrying a transform, a container-type or a backdrop-filter.
 * This builder emits all three without anything in their names suggesting a connection to pinning, so
 * "my fixed bar stopped working when I tilted the section" is otherwise unexplainable.
 */
describe("fixedBlockedBy — naming the ancestor that captures a fixed block", () => {
  const tree = (ancestor: Partial<BoxNode>) => createContainer("column", {
    id: "root",
    children: [createContainer("column", {
      id: "mid", ...ancestor,
      children: [createContainer("column", { id: "me", pin: "top", hold: "fixed" } as Partial<BoxNode>)],
    } as Partial<BoxNode>)],
  } as Partial<BoxNode>);

  it("finds a TILTED ancestor — the one nobody would connect to pinning", () => {
    expect(fixedBlockedBy(tree({ rotate: 3 }), "me")?.id).toBe("mid");
  });

  it("finds a COMPONENT ancestor, which carries container-type for its own queries", () => {
    expect(fixedBlockedBy(tree({ type: "component", component: "card", width: "100%" }), "me")?.id).toBe("mid");
  });

  it("finds the GLASS design, which carries a backdrop-filter", () => {
    expect(fixedBlockedBy(tree({ variant: "--glass" }), "me")?.id).toBe("mid");
  });

  it("reports nothing when the chain is clear", () => {
    expect(fixedBlockedBy(tree({}), "me")).toBeNull();
  });

  it("says nothing about a STICKY block, however captured its ancestors", () => {
    // A transform does not stop sticky — it is a containing block for fixed, not a scroll container.
    // Warning about it would send the user to fix something that is not the problem.
    const root = createContainer("column", {
      id: "root",
      children: [createContainer("column", {
        id: "mid", rotate: 3,
        children: [createContainer("column", { id: "me", pin: "top" } as Partial<BoxNode>)],
      } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    expect(fixedBlockedBy(root, "me")).toBeNull();
  });

  it("a block's OWN tilt is irrelevant — an element does not contain itself", () => {
    const root = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "me", pin: "top", hold: "fixed", rotate: 5 } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    expect(fixedBlockedBy(root, "me")).toBeNull();
  });

  it("returns null for an id that is not in the tree", () => {
    expect(fixedBlockedBy(tree({ rotate: 3 }), "nobody")).toBeNull();
  });
});

/** The label a warning uses. A Card called a "Stack" sends the user looking for a block that is not there. */
describe("blockedByLabel", () => {
  it("names a component for what it is", () => {
    expect(blockedByLabel(createContainer("column", { type: "component", component: "card" } as Partial<BoxNode>))).toBe("Card");
  });
  it("names a container by its user-facing name", () => {
    expect(blockedByLabel(createContainer("row", { direction: "row" } as Partial<BoxNode>))).toBe("Side by side");
    expect(blockedByLabel(createGrid(3))).toBe("Grid");
  });
  it("carries the null case, so both warnings read from one function", () => {
    expect(blockedByLabel(null)).toBeNull();
  });
});

/**
 * WHERE A STICKY BLOCK LETS GO — what the Inspector's line underneath is built from.
 *
 * Every tree here goes through `normalizeRowBands` first, the pass the builder runs on load and on every
 * commit. The Inspector used to say "while its section shows" for every block, and for a block placed straight
 * on the page that was false: the band hugs it, the pin moves up to the band, and the band's parent is the
 * page. A hand-built tree with two blocks in one band cannot see that, so none of these build one.
 */
describe("pinScope — the box a sticky block travels inside", () => {
  const shaped = (children: BoxNode[]) =>
    normalizeRowBands(createContainer("column", { id: "root", children } as Partial<BoxNode>));
  const pinned = (id: string, extra: Partial<BoxNode> = {}) =>
    createContainer("column", { id, pin: "top", minHeight: 64, ...extra } as Partial<BoxNode>);

  it("a block placed straight on the page holds for the WHOLE page — the case the old wording got wrong", () => {
    const root = shaped([pinned("nav"), createContainer("column", { id: "body", minHeight: 3000 } as Partial<BoxNode>)]);
    expect(pinScope(root, "nav")).toBe("page");
  });

  it("an ELEMENT placed straight on the page does too — a heading or a button is pinned the same way", () => {
    const root = shaped([createElement("button", { id: "cta", pin: "top" } as Partial<BoxNode>)]);
    expect(pinScope(root, "cta")).toBe("page");
  });

  it("a block inside a Stack lets go when THAT Stack does, and the Stack is what gets named", () => {
    const root = shaped([createContainer("column", { id: "outer", minHeight: 900, children: [pinned("rail")] } as Partial<BoxNode>)]);
    const scope = pinScope(root, "rail");
    expect(typeof scope === "object" && scope?.id).toBe("outer");
    expect(blockedByLabel(scope as BoxNode)).toBe("Stack");
  });

  it("a block sharing its band with a neighbour lets go at the end of that ROW", () => {
    // Two blocks side by side on the page: one band, two children, so the band does not hug and nothing is
    // hoisted. The rail travels inside the band, which is as tall as its tallest neighbour.
    const band = { ...createContainer("row", { id: "band", rowBand: true } as Partial<BoxNode>),
      children: [pinned("rail", { width: "30%" }), createContainer("column", { id: "main", width: "70%", minHeight: 2400 } as Partial<BoxNode>)] };
    const root = shaped([band]);
    expect(pinScope(root, "rail")).toBe("row");
  });

  it("a grid cell lets go with the whole GRID, not its row — measured in the browser, which the spec reading got wrong", () => {
    // Measured: a pinned cell in row 1 of a two-row grid was still held 900px into row 2 and let go only when
    // the grid ended. The browser guard in pinning-explained.spec.ts holds the words to that measurement.
    const grid = { ...createGrid(2), id: "grid", children: [pinned("cell"), createContainer("column", { id: "tall", minHeight: 1200 } as Partial<BoxNode>)] };
    const root = shaped([grid]);
    const scope = pinScope(root, "cell");
    expect(typeof scope === "object" && scope?.id).toBe("grid");
    expect(blockedByLabel(scope as BoxNode)).toBe("Grid");
  });

  it("is null for a FIXED block — measured against the window, it never lets go", () => {
    const root = shaped([pinned("nav", { hold: "fixed" })]);
    expect(pinScope(root, "nav")).toBeNull();
  });

  it("is null for a FLOATING block — free positioning wins and the pin is ignored", () => {
    const root = shaped([pinned("nav", { position: "absolute", left: 10, top: 10 })]);
    expect(pinScope(root, "nav")).toBeNull();
  });

  it("is null for a block nobody pinned, and for an id that is not in the tree", () => {
    const root = shaped([createContainer("column", { id: "plain" } as Partial<BoxNode>)]);
    expect(pinScope(root, "plain")).toBeNull();
    expect(pinScope(root, "nobody")).toBeNull();
  });

  it("answers AT THE RUNG being edited — a pin set only on phones is still the whole page there", () => {
    const root = shaped([createContainer("column", { id: "nav", minHeight: 64, responsive: { phone: { pin: "top" } } } as Partial<BoxNode>)]);
    expect(pinScope(root, "nav", "phone"), "on phones the band carries it, so it holds for the page").toBe("page");
    expect(pinScope(root, "nav", "base"), "and on the desktop nothing is pinned").toBeNull();
  });
});

/** The warnings read the rung too — a phone-only pin inside a phone-only rounded Stack must still be told. */
describe("the pin warnings, per device", () => {
  const shaped = (children: BoxNode[]) =>
    normalizeRowBands(createContainer("column", { id: "root", children } as Partial<BoxNode>));

  it("pinBlockedBy sees a pin AND a rounding that exist only on phones", () => {
    const root = shaped([createContainer("column", { id: "outer", minHeight: 900, responsive: { phone: { radius: 24 } }, children: [
      createContainer("column", { id: "rail", minHeight: 64, responsive: { phone: { pin: "top" } } } as Partial<BoxNode>),
    ] } as Partial<BoxNode>)]);
    expect(pinBlockedBy(root, "rail", "phone")?.id).toBe("outer");
    expect(pinBlockedBy(root, "rail", "base"), "the desktop has neither").toBeNull();
  });

  it("fixedBlockedBy sees a tilt that exists only on phones", () => {
    const root = shaped([createContainer("column", { id: "outer", responsive: { phone: { rotate: 3 } }, children: [
      createContainer("column", { id: "bar", pin: "top", hold: "fixed" } as Partial<BoxNode>),
    ] } as Partial<BoxNode>)]);
    expect(fixedBlockedBy(root, "bar", "phone")?.id).toBe("outer");
    expect(fixedBlockedBy(root, "bar", "base")).toBeNull();
  });
});

/**
 * CLAUSE 5 — a fixed block is given its width.
 *
 * Measured on the canvas AND the export before this existed: a full-width bar set to "Floats on screen" was
 * 0px wide in both. Out of flow it takes no size from its row or grid, and every guard that existed measured
 * where it sat rather than how big it was, so an invisible block shipped.
 */
describe("clause 5 — a FIXED block carries its own width", () => {
  it("a full-width bar is told to be full width", () => {
    expect(pinCSS(box({ pin: "top", hold: "fixed", width: "100%" })).width).toBe("100%");
    expect(pinCSS(box({ pin: "top", hold: "fixed", width: "fill" })).width).toBe("100%");
  });

  it("an explicit size is kept", () => {
    expect(pinCSS(box({ pin: "bottom-right", hold: "fixed", width: "56px" })).width).toBe("56px");
  });

  it("a block told to HUG its content keeps hugging — a chat bubble is as wide as what is in it", () => {
    // "auto" is the hug. A container with no width of its own is not hugging: it is created full-width.
    expect(pinCSS(box({ pin: "bottom-right", hold: "fixed", width: "auto" })).width).toBeUndefined();
    expect(pinCSS(createElement("button", { pin: "bottom-right", hold: "fixed", width: "auto" } as Partial<BoxNode>)).width).toBeUndefined();
  });

  it("a STICKY block is never given one — it is still in the flow, which sizes it", () => {
    expect(pinCSS(box({ pin: "top", width: "100%" })).width).toBeUndefined();
  });
});

/**
 * THE ARRIVAL (Step 2b) — what a pinned block becomes once the page has moved under it.
 *
 * The contract only. Whether any of it is VISIBLE is settled by scrolling a real page in
 * tests/e2e/pin-arrival.spec.ts, because a CSS assertion passes happily on an inert feature — which is
 * exactly how pinning itself shipped doing nothing.
 */
describe("pinArrivalCss — the one arrival resolver", () => {
  it("emits nothing at all for a block with no arrival, and none for an arrival on an unpinned block", () => {
    expect(pinArrivalCss(".bx-a", box({ pin: "top" }))).toBe("");
    expect(pinArrivalCss(".bx-a", box({ pinArrival: "shadow" })), "an arrival with nothing to arrive").toBe("");
  });

  it("runs on the SCROLL timeline over a distance in REM — not px, and not the container unit either", () => {
    /**
     * `--box-u` is the builder's fluid LAYOUT unit and is tied to the container's width
     * (`clamp(0.4375rem, 1cqw, 0.875rem)`, measured). Used for a scroll distance it made "500px of
     * scrolling" resolve to 64px, so the arrival was over almost immediately. Scrolling has nothing to do
     * with how wide a box is; `rem` follows the reader's text size, which it should.
     */
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow" }));
    expect(css).toContain("@supports (animation-timeline: scroll())");
    expect(css).toContain("animation-timeline:scroll()");
    expect(css).toContain("animation-range:0 7.5rem");              // the 120px default, at ordinary text size
    expect(css).not.toMatch(/animation-range:0 \d+px/);
    expect(css, "never the container-width unit").not.toContain("--box-u");
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow", pinArrivalAfter: 320 })))
      .toContain("animation-range:0 20rem");
  });

  it("writes `animation-duration: auto`, because the shorthand's 0s finishes before the range starts", () => {
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow" }))).toContain("animation-duration:auto");
  });

  it("reduced motion gets the resting look and no animation", () => {
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "glass" })))
      .toContain("@media (prefers-reduced-motion:reduce){.bx-a{animation:none !important}}");
  });

  it("a shadow arrival KEEPS the shadow the block already had, and adds to it", () => {
    const plain = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow" }));
    expect(plain).toContain("--eu-arrive-rest:none");
    const own = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow", shadow: "md" }));
    expect(own, "its own design is not overwritten by the effect").toContain(`--eu-arrive-rest:${SHADOW_CSS.md}`);
    expect(own).toContain(`--eu-arrive-on:${SHADOW_CSS.md},`);
  });

  it("a solid arrival fills to the block's OWN colour, and to the surface token when it has none", () => {
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "solid", background: "#0d3b1e" }))).toContain("--eu-arrive-bg:#0d3b1e");
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "solid" }))).toContain("--eu-arrive-bg:var(--eu-color-surface");
    // A gradient or a photograph is not a colour to fill to.
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "solid", background: "gradient:#111:#222" }))).toContain("--eu-arrive-bg:var(--eu-color-surface");
  });

  it("CONDENSE needs something to condense — and says so by emitting nothing", () => {
    expect(pinArrivalHasEffect(box({ pin: "top", pinArrival: "condense" }))).toBe(false);
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense" }))).toBe("");
    expect(pinArrivalHasEffect(box({ pin: "top", pinArrival: "condense", minHeight: 80 }))).toBe(true);
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense", minHeight: 80, padding: 20 }));
    expect(css).toContain("--eu-arrive-h-rest:");
    expect(css).toContain("--eu-arrive-pad-on:");
  });

  it("the keyframes a page needs are emitted once, and only the ones it uses", () => {
    const one = pinArrivalKeyframes(new Set(["shadow"]));
    expect(one).toContain("@keyframes eu-arrive-shadow");
    expect(one).not.toContain("eu-arrive-glass");
    expect(pinArrivalKeyframes(new Set())).toBe("");
  });

  it("every arrival emits something DIFFERENT from every other (RULE T, at the contract level)", () => {
    const seen = PIN_ARRIVALS.map((a) => pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: a.id, minHeight: 80, padding: 20 })));
    expect(new Set(seen).size, "two arrivals emitting identical CSS cannot look different").toBe(PIN_ARRIVALS.length);
  });

  it("a tree emits one copy of the keyframes and a rule per pinned block", () => {
    const root = normalizeRowBands(createContainer("column", { id: "root", children: [
      createContainer("column", { id: "a", pin: "top", pinArrival: "shadow" } as Partial<BoxNode>),
      createContainer("column", { id: "b", pin: "top", pinArrival: "shadow" } as Partial<BoxNode>),
    ] } as Partial<BoxNode>));
    const css = treePinArrivalCss(root, (id) => `[data-box-id="${id}"]`);
    expect(css.match(/@keyframes eu-arrive-shadow/g)?.length, "one copy, however many blocks use it").toBe(1);
    expect(css).toContain('[data-box-id="a"]');
    expect(css).toContain('[data-box-id="b"]');
  });
});

/**
 * A FLOATED BLOCK THAT HOLDS ON SCREEN — asked for directly: "if I float a stack and then make it fixed, it
 * should work, right?"
 *
 * It should, and the browser agrees: emitted as `fixed` the same block travelled 0px over a 900px scroll
 * while the `absolute` one lost all 900. Sticky is the one that cannot — forced onto a floated block it
 * returns to its place in the flow and starts taking space, which is the opposite of free placement.
 */
describe("floatHoldCSS — free placement AND holding on screen", () => {
  const floated = (extra: Partial<BoxNode> = {}) =>
    box({ position: "absolute", left: 20, top: 30, ...extra });

  it("a floated block set to float on screen is FIXED", () => {
    expect(floatHoldCSS(floated({ pin: "top", hold: "fixed" })).position).toBe("fixed");
  });

  it("…at the place it was measured sitting, in a unit that means the same in both boxes", () => {
    const css = floatHoldCSS(floated({ pin: "top", hold: "fixed", pinX: 256, pinY: 240 }));
    expect(css.left).toBe("16rem");
    expect(css.top).toBe("15rem");
    expect(String(css.left), "never a stored pixel").not.toMatch(/px/);
  });

  it("with no measurement stored it leaves the float's own placement alone, rather than moving it", () => {
    const css = floatHoldCSS(floated({ pin: "top", hold: "fixed" }));
    expect(css.left).toBeUndefined();
    expect(css.top).toBeUndefined();
  });

  it("STICKY on a floated block emits nothing — it would jump back into the flow", () => {
    expect(floatHoldCSS(floated({ pin: "top" }))).toEqual({});
    expect(floatHoldCSS(floated({ pin: "top", hold: "sticky" }))).toEqual({});
  });

  it("nothing for a floated block nobody pinned, and nothing for a block that is not floating", () => {
    expect(floatHoldCSS(floated())).toEqual({});
    expect(floatHoldCSS(box({ pin: "top", hold: "fixed" }))).toEqual({});
  });

  it("`pinCSS` still writes nothing for a floating block — one property, decided in one place", () => {
    // The flow resolver keeps its hands off: a floated block's position is settled by `floatHoldCSS`, so the
    // two can never both write `position` and leave the winner to whichever spread ran last.
    expect(pinCSS(floated({ pin: "top", hold: "fixed" }))).toEqual({});
  });
});

/**
 * THE CANVAS'S PICTURE OF `position: fixed`.
 *
 * It cannot use the property: the page frame declares `container-type: inline-size` for container queries,
 * and that captures every fixed descendant — so in the editor a fixed block is measured against the page,
 * which scrolls. Reported by a user twice: first it scrolled away entirely, then it held with a gap above
 * it, because the page sits inset inside the canvas and the offset had not paid for that inset.
 */
describe("canvasFixedStyle — what the editor draws instead", () => {
  it("leaves everything that is not fixed completely alone", () => {
    const sticky = { position: "sticky" as const, top: "0px" };
    expect(canvasFixedStyle(sticky)).toBe(sticky);
    expect(canvasFixedStyle({ position: "relative" as const })).toEqual({ position: "relative" });
  });

  it("holds a TOP-held block against the top of the view, less the page's own inset", () => {
    const css = canvasFixedStyle({ position: "fixed", top: "2rem" });
    expect(css.position).toBe("absolute");
    expect(String(css.top)).toContain("var(--canvas-scroll");
    expect(String(css.top), "the canvas insets the page; a gap that wide opened above it").toContain("var(--canvas-top");
    expect(String(css.top)).toContain("2rem");
  });

  it("…and never below zero, so at rest it sits exactly where it was placed", () => {
    // Before the page's own top edge has scrolled away, that edge IS the top of the view.
    expect(String(canvasFixedStyle({ position: "fixed", top: "0px" }).top)).toContain("max(0px");
  });

  it("a BOTTOM-held block is measured from the bottom of the view, and pulled back by its own height", () => {
    const css = canvasFixedStyle({ position: "fixed", bottom: "1rem" });
    expect(css.bottom, "one inset only — two would fight").toBeUndefined();
    expect(String(css.top)).toContain("var(--canvas-h");
    expect(css.translate, "`translate`, not `transform` — a tilt lives in transform").toBe("0 -100%");
  });

  it("keeps the block's other declarations, including a tilt it was given", () => {
    const css = canvasFixedStyle({ position: "fixed", top: "0px", transform: "rotate(3deg)", zIndex: 30, left: "4rem" });
    expect(css.transform).toBe("rotate(3deg)");
    expect(css.zIndex).toBe(30);
    expect(css.left).toBe("4rem");
  });
});

/**
 * STEP 2e — ONE RESOLVER FOR "WHICH BOX DOES THIS BLOCK RESOLVE AGAINST?"
 *
 * Four features asked that question and each had written its own walk of the same chain: the sticky warning,
 * the fixed warning, the Inspector's "where it lets go", and — now — which sticky bars can cover each other.
 * These assert the resolvers directly, because the wrappers above can only show that the ANSWERS still agree;
 * they cannot show that the distinction sticky stacking needs is available at all.
 */
describe("the shared scroll-container resolver", () => {
  const shaped = (children: BoxNode[]) =>
    normalizeRowBands(createContainer("column", { id: "root", children } as Partial<BoxNode>));
  const pinned = (id: string, extra: Partial<BoxNode> = {}) =>
    createContainer("column", { id, pin: "top", minHeight: 64, ...extra } as Partial<BoxNode>);

  it("a rounded ancestor IS the scroll container — which is why rounding a section switches sticky off", () => {
    const root = shaped([createContainer("column", { id: "card", radius: 12, minHeight: 900, children: [pinned("rail")] } as Partial<BoxNode>)]);
    expect(scrollContainerOf(root, "rail")?.id).toBe("card");
  });

  it("nothing above it means the PAGE, which is the answer the browser gives too", () => {
    const root = shaped([pinned("nav"), createContainer("column", { id: "body", minHeight: 3000 } as Partial<BoxNode>)]);
    expect(scrollContainerOf(root, "nav")).toBeNull();
  });

  it("the block's OWN radius does not capture it — an element is not inside itself", () => {
    const root = shaped([pinned("nav", { radius: 12 }), createContainer("column", { id: "body", minHeight: 3000 } as Partial<BoxNode>)]);
    expect(scrollContainerOf(root, "nav")).toBeNull();
  });

  it("a tilted ancestor captures a FIXED block, and that is a different question from clipping", () => {
    const root = shaped([createContainer("column", { id: "tilted", rotate: 3, minHeight: 900, children: [pinned("bar", { hold: "fixed" })] } as Partial<BoxNode>)]);
    expect(fixedContainerOf(root, "bar")?.id).toBe("tilted");
    expect(scrollContainerOf(root, "bar"), "a tilt does not clip, so it is not a scroll container").toBeNull();
  });

  it("the two warnings still read the same answers through the resolver", () => {
    const rounded = shaped([createContainer("column", { id: "card", radius: 12, minHeight: 900, children: [pinned("rail")] } as Partial<BoxNode>)]);
    expect(pinBlockedBy(rounded, "rail")?.id).toBe("card");
    // …and neither fires on a block that is not pinned at all.
    const plain = shaped([createContainer("column", { id: "card", radius: 12, children: [createContainer("column", { id: "inner" } as Partial<BoxNode>)] } as Partial<BoxNode>)]);
    expect(pinBlockedBy(plain, "inner")).toBeNull();
    expect(fixedBlockedBy(plain, "inner")).toBeNull();
  });

  /**
   * THE DISTINCTION `pinScope` CANNOT MAKE, and the reason `pinHolder` exists.
   *
   * `pinScope` says "row" for a block sharing a band, because that is what the Inspector should call a band the
   * user never made. Two bars in two DIFFERENT bands both come back as "row" — identical strings for boxes that
   * are not the same box. Grouping sticky bars on that would stack bars that can never cover each other, which
   * is the F15 regression that shoved a rail 160px down the page.
   */
  it("pinHolder gives the box's IDENTITY where pinScope only gives the word", () => {
    const bandWith = (id: string, railId: string) => ({
      ...createContainer("row", { id, rowBand: true } as Partial<BoxNode>),
      children: [pinned(railId, { width: "30%" }), createContainer("column", { id: `${id}-main`, width: "70%", minHeight: 1200 } as Partial<BoxNode>)],
    });
    const root = shaped([bandWith("b1", "r1"), bandWith("b2", "r2")]);

    expect(pinScope(root, "r1"), "the Inspector's word for both").toBe("row");
    expect(pinScope(root, "r2")).toBe("row");

    const h1 = pinHolder(root, "r1"), h2 = pinHolder(root, "r2");
    expect(typeof h1 === "object" && h1?.id).toBe("b1");
    expect(typeof h2 === "object" && h2?.id).toBe("b2");
    expect(h1, "two different boxes, so they can never cover each other").not.toBe(h2);
  });

  it("a block straight on the page holds within the PAGE, so two of them share one holder", () => {
    const root = shaped([pinned("nav"), pinned("notice"), createContainer("column", { id: "body", minHeight: 2400 } as Partial<BoxNode>)]);
    expect(pinHolder(root, "nav")).toBe("page");
    expect(pinHolder(root, "notice"), "the same holder — which is why these two DO cover each other").toBe("page");
  });
});
