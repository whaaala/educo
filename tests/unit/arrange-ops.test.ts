import { describe, it, expect } from "vitest";
import {
  reorder, align, distribute, center, rotate, flip, applyArrange,
  type ArrangeItem,
} from "@/lib/editor-ops/arrange";

const box = (id: string, x: number, y: number, w = 10, h = 10, z = 0): ArrangeItem =>
  ({ id, x, y, width: w, height: h, zIndex: z });

describe("arrange — z-ordering", () => {
  const items = [box("a", 0, 0, 10, 10, 0), box("b", 0, 0, 10, 10, 1), box("c", 0, 0, 10, 10, 2)];

  it("bring to front puts the selection on top", () => {
    const z = Object.fromEntries(reorder(items, ["a"], "front").map(i => [i.id, i.zIndex]));
    expect(z.a).toBeGreaterThan(z.b);
    expect(z.a).toBeGreaterThan(z.c);
  });

  it("send to back puts the selection at the bottom", () => {
    const z = Object.fromEntries(reorder(items, ["c"], "back").map(i => [i.id, i.zIndex]));
    expect(z.c).toBeLessThan(z.a);
    expect(z.c).toBeLessThan(z.b);
  });

  it("bring forward moves up exactly one step", () => {
    const z = Object.fromEntries(reorder(items, ["a"], "forward").map(i => [i.id, i.zIndex]));
    // a was bottom (0); now it swaps with b → a=1, b=0
    expect(z.a).toBe(1);
    expect(z.b).toBe(0);
    expect(z.c).toBe(2);
  });

  it("send backward moves down exactly one step", () => {
    const z = Object.fromEntries(reorder(items, ["c"], "backward").map(i => [i.id, i.zIndex]));
    expect(z.c).toBe(1);
    expect(z.b).toBe(2);
  });

  it("is a no-op with fewer than 2 items", () => {
    const one = [box("a", 0, 0)];
    expect(reorder(one, ["a"], "front")).toBe(one);
  });
});

describe("arrange — align", () => {
  it("aligns to the selection bounds when 2+ selected", () => {
    const items = [box("a", 10, 0, 10, 10), box("b", 40, 0, 20, 10)];
    const out = align(items, ["a", "b"], "left");
    expect(out.find(i => i.id === "a")!.x).toBe(10); // both to min x
    expect(out.find(i => i.id === "b")!.x).toBe(10);
  });

  it("right-aligns to the selection's right edge", () => {
    const items = [box("a", 10, 0, 10, 10), box("b", 40, 0, 20, 10)]; // maxX = 60
    const out = align(items, ["a", "b"], "right");
    expect(out.find(i => i.id === "a")!.x).toBe(50); // 60 - 10
    expect(out.find(i => i.id === "b")!.x).toBe(40); // 60 - 20
  });

  it("aligns a single object to the PAGE", () => {
    const items = [box("a", 30, 30, 10, 10)];
    expect(align(items, ["a"], "left")[0].x).toBe(0);
    expect(align(items, ["a"], "right", { w: 100, h: 100 })[0].x).toBe(90);
    expect(align(items, ["a"], "center")[0].x).toBe(45); // 50 - 5
    expect(align(items, ["a"], "middle")[0].y).toBe(45);
  });
});

describe("arrange — distribute", () => {
  it("equalises gaps between 3+ items on the horizontal axis", () => {
    const items = [box("a", 0, 0, 10, 10), box("b", 15, 0, 10, 10), box("c", 80, 0, 10, 10)];
    const out = distribute(items, ["a", "b", "c"], "h");
    const xs = ["a", "b", "c"].map(id => out.find(i => i.id === id)!.x);
    // gaps: (b.x - (a.x+10)) === (c.x - (b.x+10))
    const gap1 = xs[1] - (xs[0] + 10);
    const gap2 = xs[2] - (xs[1] + 10);
    expect(gap1).toBeCloseTo(gap2, 5);
    // endpoints stay put
    expect(xs[0]).toBe(0);
    expect(xs[2]).toBe(80);
  });

  it("needs at least 3 items", () => {
    const items = [box("a", 0, 0), box("b", 50, 0)];
    expect(distribute(items, ["a", "b"], "h")).toBe(items);
  });
});

describe("arrange — center on page", () => {
  it("centres the selection bbox horizontally", () => {
    const items = [box("a", 0, 0, 20, 10)]; // cx=10 → delta 40
    expect(center(items, ["a"], "h")[0].x).toBe(40); // 0 + (50-10)
  });
  it("centres a multi-selection as a group", () => {
    const items = [box("a", 0, 0, 10, 10), box("b", 10, 0, 10, 10)]; // bbox 0..20, cx=10 → +40
    const out = center(items, ["a", "b"], "h");
    expect(out.find(i => i.id === "a")!.x).toBe(40);
    expect(out.find(i => i.id === "b")!.x).toBe(50);
  });
});

describe("arrange — rotate / flip", () => {
  it("adds rotation and normalises to 0–359", () => {
    const items: ArrangeItem[] = [{ ...box("a", 0, 0), rotation: 350 }];
    expect(rotate(items, ["a"], 90)[0].rotation).toBe(80); // 440 % 360
    expect(rotate(items, ["a"], -360 - 10)[0].rotation).toBe(340);
  });
  it("flips by toggling scale sign", () => {
    const items = [box("a", 0, 0)];
    expect(flip(items, ["a"], "h")[0].scaleX).toBe(-1);
    expect(flip(flip(items, ["a"], "h"), ["a"], "h")[0].scaleX).toBe(1);
    expect(flip(items, ["a"], "v")[0].scaleY).toBe(-1);
  });
});

describe("arrange — applyArrange dispatcher covers every arrange:* action", () => {
  const items = [box("a", 0, 0, 10, 10, 0), box("b", 30, 20, 10, 10, 1), box("c", 60, 40, 10, 10, 2)];
  const actions = [
    "arrange:bringFront", "arrange:sendBack", "arrange:bringForward", "arrange:sendBackward",
    "arrange:alignLeft", "arrange:alignCenter", "arrange:alignRight",
    "arrange:alignTop", "arrange:alignMiddle", "arrange:alignBottom",
    "arrange:distributeH", "arrange:distributeV", "arrange:centerH", "arrange:centerV",
    "arrange:rotateCW", "arrange:rotateCCW", "arrange:flipH", "arrange:flipV",
  ];
  it("returns a valid array for each action (never throws / drops items)", () => {
    for (const action of actions) {
      const out = applyArrange(action, items, ["a", "b", "c"]);
      expect(out).toHaveLength(3);
      expect(out.map(i => i.id).sort()).toEqual(["a", "b", "c"]);
    }
  });
  it("an unknown action returns the items unchanged", () => {
    expect(applyArrange("arrange:nope", items, ["a"])).toBe(items);
  });
});
