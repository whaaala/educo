import { describe, it, expect } from "vitest";
import { parseGradient, serializeGradient } from "@/components/shared/GradientEditor";

describe("GradientEditor — parse/serialize", () => {
  it("parses a linear gradient with an angle + two stops", () => {
    const m = parseGradient("linear-gradient(135deg, #2193b0, #6dd5ed)");
    expect(m).toEqual({ type: "linear", angle: 135, stops: [{ color: "#2193b0", pos: undefined }, { color: "#6dd5ed", pos: undefined }] });
  });

  it("parses a 'to right' direction into an angle", () => {
    expect(parseGradient("linear-gradient(to right, #a00, #0a0)")?.angle).toBe(90);
  });

  it("parses stops with explicit positions", () => {
    const m = parseGradient("linear-gradient(90deg, #fff 0%, #000 100%)");
    expect(m?.stops).toEqual([{ color: "#fff", pos: 0 }, { color: "#000", pos: 100 }]);
  });

  it("parses radial + conic, dropping the shape/from token", () => {
    expect(parseGradient("radial-gradient(circle at 30% 25%, #a, #b)")?.type).toBe("radial");
    expect(parseGradient("radial-gradient(circle at 30% 25%, #a, #b)")?.stops.length).toBe(2);
    const c = parseGradient("conic-gradient(from 210deg at 50% 50%, #a, #b, #c)");
    expect(c?.type).toBe("conic");
    expect(c?.angle).toBe(210);
    expect(c?.stops.length).toBe(3);
  });

  it("keeps rgb()/var() colours intact (top-level comma split)", () => {
    const m = parseGradient("linear-gradient(90deg, rgb(255, 0, 0), var(--eu-color-brand))");
    expect(m?.stops).toEqual([{ color: "rgb(255, 0, 0)", pos: undefined }, { color: "var(--eu-color-brand)", pos: undefined }]);
  });

  it("returns null for patterns / non-gradients (caller falls back to raw CSS)", () => {
    expect(parseGradient("repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)")).toBeNull(); // a pattern → falls back to raw CSS editor
    expect(parseGradient("url(https://x/y.jpg)")).toBeNull();
    expect(parseGradient("#ff0000")).toBeNull();
    expect(parseGradient(undefined)).toBeNull();
  });

  it("round-trips: serialize(parse(x)) is a valid equivalent gradient", () => {
    const css = "linear-gradient(45deg, #ff0000, #00ff00 50%, #0000ff)";
    const m = parseGradient(css)!;
    expect(serializeGradient(m)).toBe("linear-gradient(45deg, #ff0000, #00ff00 50%, #0000ff)");
  });
});
