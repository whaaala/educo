import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * RULE X — ONE UAT PASS PER BATCH (the user, 2026-09-30). The batches live in docs/TASK_TREE.md, and the limits that
 * keep a batch honest are checked here rather than remembered: one area, at most 6 changes, one open at a time, never
 * closed with an unticked line — and no ledger line that is a bare number (#42 and #46 were lost that way).
 */

export type BatchProblem = string;

/** Every broken limit in a task tree's text. Exported so the test can prove each check goes red. */
export function batchProblems(tree: string): BatchProblem[] {
  const out: BatchProblem[] = [];
  const start = tree.indexOf("## BATCHES");
  if (start < 0) return ["no BATCHES section"];
  const end = tree.indexOf("\n## ", start + 1);
  const lines = tree.slice(start, end < 0 ? undefined : end).split("\n");
  const batches: { head: string; body: string[] }[] = [];
  // Any OTHER top-level item (an AREA, a research line) ends the batch above it — its children are not the batch's
  // (2026-10-03: AREA V's open lines were read as L-3's the moment L-3 closed).
  let inBatch = false;
  for (const l of lines) {
    if (/^- `\[.\]` \*\*BATCH /.test(l)) { batches.push({ head: l, body: [] }); inBatch = true; }
    else if (/^- /.test(l)) inBatch = false;
    else if (inBatch && /^\s+\S/.test(l)) batches[batches.length - 1].body.push(l);
  }
  if (!batches.length) out.push("no batch in the BATCHES section");
  const open = batches.filter((b) => b.head.startsWith("- `[>]`"));
  if (open.length > 1) out.push(`${open.length} batches open at once`);
  for (const b of batches) {
    const name = /BATCH ([^*]+)\*\*/.exec(b.head)?.[1]?.trim() ?? b.head;
    const n = /· (\d+) changes?/.exec(b.head);
    if (n && +n[1] > 6) out.push(`${name}: ${n[1]} changes (at most 6)`);
    if (b.head.startsWith("- `[x]`") && b.body.some((l) => l.includes("`[ ]`"))) out.push(`${name}: closed with an unticked line`);
  }
  // A ledger line that is ONLY numbers ("#46 and #42", "#127b") says nothing a later session can act on.
  for (const l of tree.split("\n")) {
    const m = /^\s*- `\[.\]` (.*)$/.exec(l);
    if (m && /^(#\d+\w?[\s,·and&]*)+(—.*(could not|unknown).*)?$/i.test(m[1].replace(/\*\*/g, "").trim())) out.push(`bare ledger number: ${m[1].trim()}`);
  }
  return out;
}

const TREE = readFileSync(join(__dirname, "..", "..", "docs", "TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");

describe("the task tree's batches keep RULE X's limits", () => {
  it("the real tree breaks none of them", () => {
    expect(batchProblems(TREE)).toEqual([]);
  });

  // Each check proven red, so the guard above cannot pass for the wrong reason.
  const ok = "## BATCHES\n\n- `[>]` **BATCH A · x** (area: a · 2 changes)\n  - `[ ]` one\n- `[ ]` **BATCH B · y** (area: b · 1 change)\n\n## 1 · next\n";
  it("a healthy tree passes", () => expect(batchProblems(ok)).toEqual([]));
  it("two open batches fail", () => expect(batchProblems(ok.replace("- `[ ]` **BATCH B", "- `[>]` **BATCH B"))).toContain("2 batches open at once"));
  it("a batch of 7 fails", () => expect(batchProblems(ok.replace("2 changes", "7 changes"))).toContain("A · x: 7 changes (at most 6)"));
  it("a batch closed with an unticked line fails", () => expect(batchProblems(ok.replace("- `[>]` **BATCH A", "- `[x]` **BATCH A"))).toContain("A · x: closed with an unticked line"));
  it("an AREA's open lines under a closed batch are not the batch's", () => expect(batchProblems(ok.replace("- `[>]` **BATCH A · x** (area: a · 2 changes)\n  - `[ ]` one", "- `[x]` **BATCH A · x** (area: a · 2 changes)\n  - `[x]` one\n- `[>]` **AREA V · z**\n  - `[ ]` open area work"))).toEqual([]));
  it("a bare ledger number fails", () => expect(batchProblems(ok + "- `[?]` #46 and #42\n")).toContain("bare ledger number: #46 and #42"));
  it("a numbered line WITH its description passes", () => expect(batchProblems(ok + "- `[ ]` **#42 · a Stats row's height does not come back**\n")).toEqual([]));
});
