import { describe, it, expect } from "vitest";
import { gapPatch, snapSpace, spacePatch, stepSpace, type BoxNode } from "@/lib/box-model";
import { SPACE_STEPS } from "@/lib/educo-ui/tokens";

/**
 * THE SPACING HANDLES ON THE CANVAS (E-6 (3)) — what a drag or a key on a handle writes.
 * Behaviours: tests/features/components/website/box-builder-spacing.feature ("I drag the … handle", "A key held while dragging").
 */
describe("the spacing scale a handle snaps to", () => {
  it("is the token scale, 0 → 6rem, written as stored numbers (rem × 16)", () => {
    expect(SPACE_STEPS).toEqual([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]);
  });

  it("lands every value on the nearest step, and never below 0 or past the top", () => {
    expect(snapSpace(13)).toBe(12);
    expect(snapSpace(15)).toBe(16);
    expect(snapSpace(35)).toBe(32);
    expect(snapSpace(-20)).toBe(0);
    expect(snapSpace(500)).toBe(96);
    expect(snapSpace(Infinity), "the End key and the slider's maximum ask for the top").toBe(96);
  });

  it("with Shift takes a bigger step: every other one", () => {
    expect(snapSpace(13, true)).toBe(16);
    expect(snapSpace(5, true)).toBe(8);
    expect(snapSpace(30, true)).toBe(24);
    for (const v of [0, 7, 19, 33, 50, 70, 90]) expect([0, 8, 16, 24, 40, 64, 96]).toContain(snapSpace(v, true));
  });

  it("an arrow key moves one step, from a value on a step or between two", () => {
    expect(stepSpace(16, 1)).toBe(20);
    expect(stepSpace(16, -1)).toBe(12);
    expect(stepSpace(17, 1)).toBe(20);
    expect(stepSpace(17, -1)).toBe(16);
    expect(stepSpace(15.999, 1)).toBe(20); // a measured 16 is 16
    expect(stepSpace(0, -1)).toBe(0);
    expect(stepSpace(96, 1)).toBe(96);
    expect(stepSpace(16, 1, true)).toBe(24);
    expect(stepSpace(4, 1, true)).toBe(12); // E6-15: two steps, never one step of a coarser scale (4 → 8)
    expect(stepSpace(12, -1, true)).toBe(4);
    expect(stepSpace(4, -1, true)).toBe(0);
  });
});

describe("what a handle writes", () => {
  it("its own side only", () => {
    expect(spacePatch("padding", "Top", 16)).toEqual({ paddingTop: 16, ownSpace: true }); // LE-15i: a dragged top keeps its own
    expect(spacePatch("margin", "Left", 8)).toEqual({ marginLeft: 8 });
  });

  it("with Alt, the opposite side too", () => {
    expect(spacePatch("padding", "Top", 16, { alt: true })).toEqual({ paddingTop: 16, paddingBottom: 16, ownSpace: true });
    expect(spacePatch("margin", "Right", 4, { alt: true })).toEqual({ marginRight: 4, marginLeft: 4 });
  });

  it("with Alt + Shift, all four sides", () => {
    expect(spacePatch("padding", "Left", 24, { alt: true, all: true })).toEqual({ paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24, ownSpace: true });
  });

  it("a gap: the one shared gap while the box spaces one way only, else that axis", () => {
    const stack = { id: "s", type: "container" } as BoxNode;
    expect(gapPatch(stack, "y", 16, false)).toEqual({ gap: 16 });
    expect(gapPatch(stack, "x", 16, true)).toEqual({ gapX: 16 });
    expect(gapPatch({ ...stack, gapY: 8 } as BoxNode, "y", 16, false)).toEqual({ gapY: 16 }); // its own axis value is what is drawn
  });
});
