import { describe, it, expect } from "vitest";
import { axisTicks, niceCeil, smoothPath, roundedTopRect } from "@/components/shared/Chart/geometry";

describe("axisTicks — safe tick builder", () => {
  it("produces a normal tick range", () => {
    const { min, max, ticks } = axisTicks(0, 100, 25);
    expect(min).toBe(0);
    expect(max).toBe(100);
    expect(ticks).toEqual([0, 25, 50, 75, 100]);
  });

  it("auto-derives a step when none is given", () => {
    const { ticks } = axisTicks(0, 80);
    expect(ticks.length).toBeGreaterThan(1);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBeCloseTo(80, 5);
  });

  // Regression: yMax === yMin (e.g. user typed yMax = 0) made step 0 → the old loop
  // pushed forever and threw "RangeError: Invalid array length".
  it("never loops forever on a degenerate range (yMax = yMin)", () => {
    expect(() => axisTicks(0, 0)).not.toThrow();
    const { min, max, ticks } = axisTicks(0, 0);
    expect(max).toBeGreaterThan(min);
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.length).toBeLessThanOrEqual(201);
  });

  it("never loops forever on a zero or negative step", () => {
    expect(() => axisTicks(0, 100, 0)).not.toThrow();
    expect(() => axisTicks(0, 100, -5)).not.toThrow();
    expect(axisTicks(0, 100, 0).ticks.length).toBeLessThanOrEqual(201);
  });

  it("caps the tick count for an absurdly small step", () => {
    const { ticks } = axisTicks(0, 100, 0.00001);
    expect(ticks.length).toBeLessThanOrEqual(201);
  });

  it("tolerates NaN / Infinity inputs without throwing", () => {
    expect(() => axisTicks(NaN, NaN)).not.toThrow();
    expect(() => axisTicks(0, Infinity)).not.toThrow();
  });
});

describe("geometry helpers", () => {
  it("niceCeil rounds up to 1/2/5 × 10ⁿ", () => {
    expect(niceCeil(86)).toBe(100);
    expect(niceCeil(8)).toBe(10);
    expect(niceCeil(23)).toBe(50);
    expect(niceCeil(0)).toBe(10);
  });
  it("smoothPath / roundedTopRect return non-empty paths for valid input", () => {
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 2 }])).toMatch(/^M/);
    expect(roundedTopRect(0, 0, 10, 20, 2)).toMatch(/^M/);
    expect(roundedTopRect(0, 0, 10, 0, 2)).toBe(""); // zero height → empty
  });
});
