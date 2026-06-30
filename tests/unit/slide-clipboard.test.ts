import { describe, it, expect } from "vitest";
import {
  setSlideClipboard, getSlideClipboard, hasSlideClipboard, packIntoFreeSpace,
} from "@/components/shared/SlideEditor/slide-clipboard";
import type { SlideObject } from "@/lib/slide-storage";

const box = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });
const AREA = { x: 4, y: 4, w: 92, h: 88 };

describe("packIntoFreeSpace", () => {
  it("places a new object at full size on an empty slide", () => {
    const obj = box(0, 0, 80, 60);
    const placed = packIntoFreeSpace([obj], [], AREA);
    expect(placed).not.toBeNull();
    expect(placed![0].width).toBe(80);
    expect(placed![0].height).toBe(60);
    // anchored at the content area's top-left
    expect(placed![0].x).toBe(AREA.x);
    expect(placed![0].y).toBe(AREA.y);
  });

  it("fits a new object into the free space below an existing small chart", () => {
    // existing chart occupies the top ~third
    const existing = [box(4, 4, 92, 28)];
    const obj = box(0, 0, 80, 60); // too tall to fit below at full size → must shrink
    const placed = packIntoFreeSpace([obj], existing, AREA);
    expect(placed).not.toBeNull();
    // it lands below the existing content, not overlapping it
    expect(placed![0].y).toBeGreaterThanOrEqual(32);
    // and it was shrunk to fit
    expect(placed![0].height).toBeLessThan(60);
  });

  it("fits a second object beside one that only takes the left half", () => {
    const existing = [box(4, 4, 44, 88)]; // left half full
    const obj = box(0, 0, 44, 88);
    const placed = packIntoFreeSpace([obj], existing, AREA);
    expect(placed).not.toBeNull();
    // placed to the right of the existing box
    expect(placed![0].x).toBeGreaterThanOrEqual(48);
  });

  it("returns null when the slide is genuinely full (no room even shrunk)", () => {
    const existing = [box(4, 4, 92, 88)]; // fills the whole content area
    const obj = box(0, 0, 80, 60);
    expect(packIntoFreeSpace([obj], existing, AREA)).toBeNull();
  });

  it("keeps a multi-object group's relative layout while packing", () => {
    const group = [box(0, 0, 20, 20), box(25, 0, 20, 20)]; // two side-by-side
    const placed = packIntoFreeSpace(group, [box(4, 4, 92, 40)], AREA);
    expect(placed).not.toBeNull();
    // relative offset between the two preserved (both scaled equally)
    const dx0 = placed![1].x - placed![0].x;
    const scale = placed![0].width / 20;
    expect(dx0).toBeCloseTo(25 * scale, 5);
  });
});

describe("shared clipboard", () => {
  it("stores and returns deep copies, and survives across reads", () => {
    const obj = { id: "a", type: "chart", x: 1, y: 2, width: 10, height: 10 } as unknown as SlideObject;
    setSlideClipboard([obj]);
    expect(hasSlideClipboard()).toBe(true);
    const out = getSlideClipboard();
    expect(out).toHaveLength(1);
    expect(out![0]).not.toBe(obj);        // deep copy, not the same reference
    expect(out![0].id).toBe("a");
    // a second read still works (clipboard persists)
    expect(getSlideClipboard()).toHaveLength(1);
  });

  it("clears when set with an empty list", () => {
    setSlideClipboard([]);
    expect(hasSlideClipboard()).toBe(false);
    expect(getSlideClipboard()).toBeNull();
  });
});
