import { describe, it, expect } from "vitest";
import { stepZoom, clampZoom, anchorDelta, zoomToFit, zoomLabel, readZoom, writeZoom, ZOOM_KEY, ZOOM_MIN, ZOOM_MAX } from "@/lib/canvas-zoom";

/** BATCH Z-1 — scenarios: tests/features/components/website/box-builder-site.feature "Zooming the editor canvas". */
describe("canvas zoom", () => {
  it("steps along the ladder from wherever it is, fitted values included", () => {
    expect(stepZoom(1, 1)).toBe(1.25);
    expect(stepZoom(1, -1)).toBe(0.75);
    expect(stepZoom(0.55, 1)).toBe(0.67);
    expect(stepZoom(0.55, -1)).toBe(0.5);
  });
  it("stops at 25% and 400%", () => {
    expect(stepZoom(ZOOM_MIN, -1)).toBe(ZOOM_MIN);
    expect(stepZoom(ZOOM_MAX, 1)).toBe(ZOOM_MAX);
    expect(clampZoom(9)).toBe(4);
    expect(clampZoom(0.01)).toBe(0.25);
  });
  it("keeps the point under the pointer where it was", () => {
    // A point 100px into the page at 50% sits 50px right of the frame; the pointer is there.
    const a = { lx: 100, ly: 40, clientX: 300, clientY: 220 };
    // At 200% the frame (not moved yet) would draw it 200px right of its origin: scroll on by the difference.
    expect(anchorDelta(a, { left: 250, top: 200 }, 2)).toEqual({ dx: 150, dy: 60 });
    // Nothing to do when the zoom did not change the point's place.
    expect(anchorDelta(a, { left: 250, top: 200 }, 0.5)).toEqual({ dx: 0, dy: 0 });
  });
  it("zooms to show a selection with a margin, within the range", () => {
    expect(zoomToFit(100, 50, 800, 600)).toBe(4);
    expect(zoomToFit(1600, 400, 800, 600)).toBe(0.43);
    expect(zoomToFit(0, 0, 800, 600)).toBe(1);
  });
  it("reads Fit with its percentage, or the chosen one", () => {
    expect(zoomLabel(null, 0.55)).toBe("Fit · 55%");
    expect(zoomLabel(1.5, 0.55)).toBe("150%");
  });
  it("remembers the zoom per device in this browser, and survives storage that refuses", () => {
    const m = new Map<string, string>();
    const store = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
    writeZoom(store, "desktop", 1.5);
    expect(readZoom(store, "desktop")).toBe(1.5);
    expect(readZoom(store, "mobile"), "a device never zoomed opens at Fit").toBeNull();
    writeZoom(store, "desktop", null);
    expect(readZoom(store, "desktop")).toBeNull();
    const refuses = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
    expect(readZoom(refuses, "desktop")).toBeNull();
    expect(() => writeZoom(refuses, "desktop", 2)).not.toThrow();
    expect(ZOOM_KEY).toMatch(/^educo_box_/);
  });
});
