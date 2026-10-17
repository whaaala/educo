import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import BUDGETS from "@/config/budgets.json";

/**
 * RULE CFG — THE RULE AF BUDGETS ARE DATA (BATCH L-6). What a published page may weigh and how fast it must paint on Slow 3G live in
 * `config/budgets.json`; `scripts/uat/page-weight.js` reads them. This fails when one of them is typed back into the check.
 */
const numbers = (o: unknown): number[] => (typeof o === "number" ? [o] : o && typeof o === "object" ? Object.entries(o).filter(([k]) => k !== "$comment").flatMap(([, v]) => numbers(v)) : []);
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
// numbers too common to mean a budget when they appear (a ratio of 2, a count of 1)
const DISTINCT = numbers(BUDGETS).filter((n) => ![1, 2].includes(n));
export const typedBudgets = (src: string) => DISTINCT.filter((n) => new RegExp(`(?<![\\w.])${String(n).replace(".", "\\.")}(?![\\w.])`).test(stripComments(src)));

describe("RULE CFG — the page-weight budgets live in config/budgets.json only", () => {
  it("every budget is a number", () => {
    expect(numbers(BUDGETS).length).toBeGreaterThan(8);
    for (const n of numbers(BUDGETS)) expect(Number.isFinite(n)).toBe(true);
  });
  it("none is typed into the check", () => {
    expect(typedBudgets(readFileSync(join(process.cwd(), "scripts", "uat", "page-weight.js"), "utf8").replace(/\r\n/g, "\n"))).toEqual([]);
  });
  it("…and one typed back in is caught", () => {
    expect(typedBudgets("if (kb > 100) bad();")).toEqual([100]);
    expect(typedBudgets("// 100 KB, in a comment\nconst x = 1;")).toEqual([]);
  });
});
