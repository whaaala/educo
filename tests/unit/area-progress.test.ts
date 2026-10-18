import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

/**
 * RULE PROGRESS (the user, 2026-10-18): every reply that closes a piece of work says how much of its AREA is left, as a
 * percentage counted by `scripts/area-progress.js` from the AREA MAP. The number is only honest if every essentials batch
 * on the map is found and carries "N changes" — so a batch the counter cannot count fails here, the day it is written.
 */
const require = createRequire(import.meta.url);
const { areaProgress } = require("../../scripts/area-progress.js") as {
  areaProgress: (tree: string, area: string) => {
    essentials: { id: string; found: boolean; counted?: boolean; done: boolean; changes: number }[];
    total: number; left: number; pctLeft: number;
  };
};
const TREE = readFileSync(resolve(process.cwd(), "docs/TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");
const AREAS = ["Website layout", "App layout / app builder", "AREA V"];

describe("area progress — the percentage left is counted, never guessed", () => {
  it.each(AREAS)("%s: every essentials batch on the map is found and counted", (area) => {
    const p = areaProgress(TREE, area);
    expect(p.essentials.length).toBeGreaterThan(0);
    expect(p.essentials.filter((b) => !b.found || !b.counted).map((b) => b.id)).toEqual([]);
    expect(p.left).toBeLessThanOrEqual(p.total);
  });

  it("a batch heading that loses its change count is caught", () => {
    const broken = TREE.replace(/(\*\*BATCH LE-14 · [^\n]*?)\d+ changes/, "$1");
    expect(areaProgress(broken, "Website layout").essentials.find((b) => b.id === "LE-14")?.counted).toBe(false);
  });

  it("closing a batch lowers what is left by its changes", () => {
    const before = areaProgress(TREE, "Website layout");
    const closed = TREE.replace("- `[ ]` **BATCH LE-14 · ", "- `[x]` **BATCH LE-14 · ");
    const after = areaProgress(closed, "Website layout");
    const le14 = before.essentials.find((b) => b.id === "LE-14")!;
    expect(before.left - after.left).toBe(le14.changes);
  });
});
