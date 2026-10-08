import { describe, it, expect } from "vitest";
import { edgeSwipeSides, EDGE_SWIPE_PX } from "@/lib/box-model";

// E5d-3: a finger's handle inside the screen edge's Back swipe (Android 24dp, measured) is not drawn (the user's decision).
describe("edgeSwipeSides", () => {
  it("flags a side whose handle would sit closer than 32px to the window's edge", () => {
    expect(EDGE_SWIPE_PX).toBe(32);
    expect(edgeSwipeSides({ left: 8, right: 300 }, 393)).toBe("w");   // a phone's full-width block: the handle at 0
    expect(edgeSwipeSides({ left: 32, right: 300 }, 768)).toBe("w");  // a tablet's 2rem gutter: the handle at 24
    expect(edgeSwipeSides({ left: 100, right: 360 }, 393)).toBe("e");
    expect(edgeSwipeSides({ left: 8, right: 385 }, 393)).toBe("e w");
  });
  it("leaves a block with room on both sides alone", () => {
    expect(edgeSwipeSides({ left: 40, right: 353 }, 393)).toBe("");
    expect(edgeSwipeSides({ left: 200, right: 900 }, 1280)).toBe("");
  });
});
