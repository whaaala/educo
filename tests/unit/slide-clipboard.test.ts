import { describe, it, expect } from "vitest";
import {
  setSlideClipboard, getSlideClipboard, hasSlideClipboard, packIntoFreeSpace, fitRotatedToPage,
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

describe("fitRotatedToPage", () => {
  const within = (o: { x: number; y: number; width: number; height: number; rotation?: number }, aspect = 16 / 9) => {
    // compute the rotated bbox in % and assert it's inside [0,100]
    const SW = 100 * aspect, SH = 100;
    const pw = (o.width / 100) * SW, ph = (o.height / 100) * SH;
    const t = ((o.rotation || 0) * Math.PI) / 180, c = Math.abs(Math.cos(t)), s = Math.abs(Math.sin(t));
    const bw = pw * c + ph * s, bh = pw * s + ph * c;
    const cx = ((o.x + o.width / 2) / 100) * SW, cy = ((o.y + o.height / 2) / 100) * SH;
    return cx - bw / 2 >= -0.5 && cx + bw / 2 <= SW + 0.5 && cy - bh / 2 >= -0.5 && cy + bh / 2 <= SH + 0.5;
  };

  it("leaves an unrotated object that already fits unchanged", () => {
    const o = { x: 10, y: 10, width: 50, height: 40, rotation: 0 };
    const r = fitRotatedToPage(o);
    expect(r.width).toBeCloseTo(50, 5);
    expect(r.height).toBeCloseTo(40, 5);
  });

  it("shrinks a wide chart rotated 90° so it fits the page height", () => {
    const o = { x: 12, y: 18, width: 76, height: 64, rotation: 90 };
    const r = fitRotatedToPage(o);
    expect(r.height).toBeLessThan(64);            // shrunk
    expect(r.width / r.height).toBeCloseTo(76 / 64, 3); // ratio preserved
    expect(within(r)).toBe(true);                 // rotated box now on-page
  });

  it("keeps the rotated box inside the page for any 90° multiple", () => {
    for (const rot of [0, 90, 180, 270]) {
      const r = fitRotatedToPage({ x: 5, y: 5, width: 90, height: 80, rotation: rot });
      expect(within({ ...r, rotation: rot })).toBe(true);
    }
  });

  it("does not shrink further on repeated rotation (no cumulative shrink)", () => {
    const once = fitRotatedToPage({ x: 12, y: 18, width: 76, height: 64, rotation: 90 });
    const twice = fitRotatedToPage({ ...once, rotation: 180 });
    expect(twice.width).toBeCloseTo(once.width, 3);
    expect(twice.height).toBeCloseTo(once.height, 3);
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
