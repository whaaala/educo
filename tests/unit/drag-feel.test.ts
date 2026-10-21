import { describe, it, expect } from "vitest";
import { previewScale, slideOffsets } from "@/components/website/box/drag-feel";
import LAYOUT from "../../config/layout.json";

/** BATCH LE-15n — tests/features/components/website/drag-feel.feature ("The block itself follows the pointer", "Its neighbours make room"). */
describe("the lifted copy's size (LE-15n (2))", () => {
  const max = LAYOUT.drag.previewMaxPx;
  it("a block smaller than the limit is carried at its own size", () => expect(previewScale(120, 40, max)).toBe(1));
  it("a big block is shrunk so its LARGER side is the limit", () => {
    expect(previewScale(1100, 600, max) * 1100).toBeCloseTo(max);
    expect(previewScale(200, 700, max) * 700).toBeCloseTo(max);
  });
});

describe("the neighbours make room: where each slides (LE-15n (3))", () => {
  // three blocks down a stack: 0–100, 110–150, 160–260 (a 10px gap)
  const starts = [0, 110, 160], ends = [100, 150, 260];
  it("the first, put after the last: the others slide up by its size + the gap, it slides to the end", () => {
    expect(slideOffsets(starts, ends, 0, 3)).toEqual([160, -110, -110]);
  });
  it("the last, put first: the others slide down by its size + the gap", () => {
    expect(slideOffsets(starts, ends, 2, 0)).toEqual([110, 110, -160]);
  });
  it("its own place, either side of itself: nothing moves", () => {
    expect(slideOffsets(starts, ends, 1, 1)).toEqual([0, 0, 0]);
    expect(slideOffsets(starts, ends, 1, 2)).toEqual([0, 0, 0]);
  });
  it("one step down: it and the next swap places, the gap kept", () => {
    expect(slideOffsets(starts, ends, 0, 2)).toEqual([50, -110, 0]);
  });
});
