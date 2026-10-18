// LE13-20 · an icon set whose chunk fails to load (a dropped connection on a slow network — RULE AF) is never an unhandled
// rejection, and the next call tries again: a failed load used to stay "pending" for good, so the set never arrived.
import { describe, it, expect, vi } from "vitest";

const net = vi.hoisted(() => ({ fail: true }));
vi.mock("@/lib/educo-ui/icon-svg-map.simple.generated", () => {
  if (net.fail) throw new Error("the connection dropped");
  return { MAP: { "si-test": "<svg></svg>" } };
});

describe("loadIconSource", () => {
  it("a failed load settles, leaves the set unloaded, and the next call loads it", async () => {
    const { loadIconSource, isIconSourceLoaded } = await import("@/lib/educo-ui/icon-svg");
    await expect(loadIconSource("simple")).resolves.toBeUndefined();
    expect(isIconSourceLoaded("simple")).toBe(false);
    net.fail = false; vi.resetModules();
    await loadIconSource("simple");
    expect(isIconSourceLoaded("simple")).toBe(true);
  });
});
