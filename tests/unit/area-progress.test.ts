import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

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

  // LE-14's close (2026-10-18) broke both of these: they named LE-14, and a named batch closes one day — they take the first OPEN one
  const OPEN = areaProgress(TREE, "Website layout").essentials.find((b) => !b.done && b.changes > 0)!;
  const esc = (id: string) => id.replace(/[-.]/g, "\\$&");

  it("a batch heading that loses its change count is caught", () => {
    const broken = TREE.replace(new RegExp(`(\\*\\*BATCH ${esc(OPEN.id)} · [^\\n]*?)\\d+ changes?`), "$1");
    expect(areaProgress(broken, "Website layout").essentials.find((b) => b.id === OPEN.id)?.counted).toBe(false);
  });

  it("closing a batch lowers what is left by its changes", () => {
    const before = areaProgress(TREE, "Website layout");
    // the first open batch may be the one in progress, `[>]` (LE15f-1: replacing only `[ ]` closed nothing once a batch was opened)
    const closed = TREE.replace(new RegExp(`- \`\\[[ >]\\]\` \\*\\*BATCH ${esc(OPEN.id)} · `), `- \`[x]\` **BATCH ${OPEN.id} · `);
    expect(closed).not.toBe(TREE);
    const after = areaProgress(closed, "Website layout");
    expect(OPEN.changes).toBeGreaterThan(0);
    expect(before.left - after.left).toBe(OPEN.changes);
  });
  // LE15b-1: "website layout" crashed with a stack trace — the name a person types is matched whatever its case
  it("the area is found whatever case it is typed in, and an unknown one says so plainly", () => {
    expect(areaProgress(TREE, "website layout").total).toBe(areaProgress(TREE, "Website layout").total);
    const out = spawnSync(process.execPath, [resolve(process.cwd(), "scripts/area-progress.js"), "no such area"], { encoding: "utf8" });
    expect(out.status).toBe(1);
    expect(out.stderr).toContain('no AREA MAP line for "no such area"');
    expect(out.stderr, "no stack trace").not.toContain("    at ");
  });
});
