import { describe, it, expect } from "vitest";
import { moveItem, reorderItem } from "@/lib/editor-ops/reorder";

const L = () => ["a", "b", "c", "d"];

describe("reorder — moveItem (menu: move to start/up/down/end)", () => {
  it("moves to start and reports index 0", () => {
    const { items, index } = moveItem(L(), 2, "start");
    expect(items).toEqual(["c", "a", "b", "d"]);
    expect(index).toBe(0);
  });
  it("moves to end and reports the last index", () => {
    const { items, index } = moveItem(L(), 1, "end");
    expect(items).toEqual(["a", "c", "d", "b"]);
    expect(index).toBe(3);
  });
  it("moves up by one", () => {
    const { items, index } = moveItem(L(), 2, "up");
    expect(items).toEqual(["a", "c", "b", "d"]);
    expect(index).toBe(1);
  });
  it("moves down by one", () => {
    const { items, index } = moveItem(L(), 1, "down");
    expect(items).toEqual(["a", "c", "b", "d"]);
    expect(index).toBe(2);
  });
  it("is a no-op (same array ref) at the boundaries", () => {
    const a = L();
    expect(moveItem(a, 0, "up").items).toBe(a);
    expect(moveItem(a, 3, "down").items).toBe(a);
    expect(moveItem(a, 0, "start").items).toBe(a);
    expect(moveItem(a, -1, "end").items).toBe(a);
  });
});

describe("reorder — reorderItem (drag & drop)", () => {
  it("reports the TRUE final index when dragging DOWN (the off-by-one bug)", () => {
    // Drag 'a' (0) onto slot 2. After removal everything shifts; final index is 2, and the
    // element that ends up at 2 is 'a'.
    const { items, index } = reorderItem(L(), 0, 2);
    expect(items).toEqual(["b", "c", "a", "d"]);
    expect(index).toBe(2);
    expect(items[index]).toBe("a");
  });
  it("reports the correct index when dragging UP", () => {
    const { items, index } = reorderItem(L(), 3, 1);
    expect(items).toEqual(["a", "d", "b", "c"]);
    expect(index).toBe(1);
    expect(items[index]).toBe("d");
  });
  it("clamps out-of-range targets", () => {
    expect(reorderItem(L(), 1, 99).items).toEqual(["a", "c", "d", "b"]);
    expect(reorderItem(L(), 1, -5).items).toEqual(["b", "a", "c", "d"]);
  });
  it("is a no-op when target equals source", () => {
    const a = L();
    expect(reorderItem(a, 2, 2).items).toBe(a);
  });
});
