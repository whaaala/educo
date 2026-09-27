import { describe, it, expect } from "vitest";
import { zoomOf } from "@/components/website/box/BoxCanvas";

/** Behaviours: tests/features/components/website/box-builder-site.feature — "The EDITOR canvas on a real screen". */
describe("zoomOf — the canvas's effective zoom, read the way the drag code needs it (#49)", () => {
  const withZoom = (z: unknown) => ({ currentCSSZoom: z }) as unknown as Element;

  it("reads the browser's effective zoom", () => {
    expect(zoomOf(withZoom(0.85))).toBe(0.85);
    expect(zoomOf(withZoom(1))).toBe(1);
  });
  it("is 1 where the browser does not report it (older engines, jsdom) — never NaN, never 0", () => {
    expect(zoomOf(document.createElement("div"))).toBe(1);
    expect(zoomOf(null)).toBe(1);
    expect(zoomOf(undefined)).toBe(1);
    expect(zoomOf(withZoom(0))).toBe(1);
    expect(zoomOf(withZoom(-2))).toBe(1);
    expect(zoomOf(withZoom("0.5"))).toBe(1);
  });
});
