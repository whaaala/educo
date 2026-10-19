import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, basename } from "node:path";

/**
 * RULE R, STORED FIRST (the user, 2026-10-19): before any new research, read what is already stored and write it on the
 * research-check line. Measured that day: LE-15's research began a web search and a CodePen crawl before reading the
 * Awwwards crawl. So a research-check that has started must name at least one stored file that exists.
 */
const root = resolve(__dirname, "../..");

function filesUnder(dir: string, out = new Set<string>()): Set<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) filesUnder(p, out);
    else out.add(basename(p));
  }
  return out;
}

/** The started research-check lines that name no stored file which exists. */
export function researchChecksWithoutStored(tree: string, stored: Set<string>): string[] {
  return tree
    .split("\n")
    .filter((l) => /^\s*- `\[(x|>)\]`.*RESEARCH-CHECK/.test(l))
    .filter((l) => ![...l.matchAll(/`([^`\s]+\.(?:md|json|tsv))`/g)].some((m) => stored.has(basename(m[1]))))
    .map((l) => l.trim().slice(0, 120));
}

describe("every research starts from what is already stored (RULE R)", () => {
  const stored = filesUnder(resolve(root, "docs"));

  it("every started research-check in the tree names a stored file", () => {
    const tree = readFileSync(resolve(root, "docs/TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");
    expect(researchChecksWithoutStored(tree, stored)).toEqual([]);
  });

  it("a started check with no stored file fails; one not started is not held to it", () => {
    expect(researchChecksWithoutStored("  - `[>]` X RESEARCH-CHECK — searched the web", stored)).toHaveLength(1);
    expect(researchChecksWithoutStored("  - `[>]` X RESEARCH-CHECK — stored: `nowhere-at-all.md`", stored)).toHaveLength(1);
    expect(researchChecksWithoutStored("  - `[>]` X RESEARCH-CHECK — stored: `LAYOUT_BENCHMARK.md`", stored)).toEqual([]);
    expect(researchChecksWithoutStored("  - `[ ]` X RESEARCH-CHECK — before any build", stored)).toEqual([]);
  });

  it("the research archive is indexed, each entry with the area it serves (BALANCE)", () => {
    const idx = resolve(root, "docs/web-anatomy/research-archive.md");
    const rows = readFileSync(idx, "utf8").replace(/\r\n/g, "\n").split(/\r?\n/).filter((l) => /^\| [^-|]/.test(l) && !/^\| What /.test(l));
    expect(rows.length).toBeGreaterThan(5);
    for (const r of rows) expect(r.split("|")[3]?.trim(), r.slice(0, 60)).toBeTruthy();
  });
});
