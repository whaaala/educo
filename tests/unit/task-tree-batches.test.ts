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

/**
 * DONE IS DONE EVERYWHERE (the user, 2026-10-06, after the tree audit found 109 lines still open whose work was finished: "make
 * sure that this mistake doesn't happen again… anybody that picks it up would understand this is ticked, this is done"). The same
 * work is often written in two places — a ledger line in section 1 and its fix in a batch, a decision and its answer, a parent and
 * its children — and the batch that finished it ticked only its own copy. Three checks, over the WHOLE tree:
 *   1. one id, one status — a ledger id (c-11a, E3-5, AC-35, #42…) that is a line's own id is never open in one place and done in another;
 *   2. a finished parent is closed — an open line, or an unanswered `[?]`, whose every direct child is ticked or parked;
 *   3. a line handed to a batch ("→ BATCH L-5", "moved to L-3") is not left open once that batch has closed.
 */
export function staleLines(tree: string): string[] {
  const OPEN = new Set([" ", ">", "?"]), DONE = new Set(["x", "~"]);
  const lines = tree.split("\n");
  const items: { i: number; ind: number; mark: string; text: string }[] = [];
  lines.forEach((l, i) => { const m = /^(\s*)- `\[(.)\]` (.*)$/.exec(l); if (m) items.push({ i: i + 1, ind: m[1].length, mark: m[2], text: m[3] }); });
  const out: string[] = [];
  const byId = new Map<string, typeof items>();
  for (const it of items) {
    const m = /^(?:\*\*)?([A-Za-z]{1,3}\d?[a-z]?-\d+[a-z]?|#\d+[a-z]?)\s*·/.exec(it.text);
    if (m) byId.set(m[1], [...(byId.get(m[1]) ?? []), it]);
  }
  for (const [id, its] of byId) {
    if (its.some((x) => OPEN.has(x.mark)) && its.some((x) => DONE.has(x.mark))) out.push(`${id} is open at line ${its.filter((x) => OPEN.has(x.mark)).map((x) => x.i).join(", ")} and done at line ${its.filter((x) => DONE.has(x.mark)).map((x) => x.i).join(", ")}`);
  }
  items.forEach((it, k) => {
    if (!OPEN.has(it.mark)) return;
    const kids: typeof items = [];
    for (let j = k + 1; j < items.length && items[j].ind > it.ind; j++) {
      if (lines.slice(it.i, items[j].i - 1).some((l) => /^\S/.test(l))) break; // a heading or a paragraph between ends the list
      kids.push(items[j]);
    }
    const top = Math.min(...kids.map((c) => c.ind));
    const direct = kids.filter((c) => c.ind === top);
    if (direct.length && direct.every((c) => DONE.has(c.mark))) out.push(`line ${it.i} is still [${it.mark}] though every line under it is done: ${it.text.slice(0, 70)}`);
  });
  const closed = new Set([...tree.matchAll(/^- `\[x\]` \*\*BATCH ([A-Z]+-\d+[a-z]?) ·/gm)].map((m) => m[1]));
  for (const it of items) {
    if (!OPEN.has(it.mark) || /\*\*BATCH /.test(it.text)) continue;
    for (const m of it.text.matchAll(/(?:→|moved to|MOVED to)\s*(?:BATCH\s+)?([A-Z]+-\d+[a-z]?)\b/g)) {
      if (closed.has(m[1])) out.push(`line ${it.i} was handed to BATCH ${m[1]}, which has closed — tick it or say what is left: ${it.text.slice(0, 60)}`);
    }
  }
  return out;
}

const TREE = readFileSync(join(__dirname, "..", "..", "docs", "TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");

describe("the task tree's batches keep RULE X's limits", () => {
  it("the real tree breaks none of them", () => {
    expect(batchProblems(TREE)).toEqual([]);
  });

  // E1-6: an edit that dropped BATCH G-3's header left its closed record running on inside another batch's ledger, and the checks
  // above passed — every batch the tree NAMES must have a header of its own
  const headless = (t: string) => {
    const headed = new Set([...t.matchAll(/\*\*BATCH ([A-Z]+-\d+[a-z]?) ·/g)].map((m) => m[1]));
    return [...new Set([...t.matchAll(/BATCH ([A-Z]+-\d+[a-z]?)\b/g)].map((m) => m[1]))].filter((id) => !headed.has(id));
  };
  it("every batch the tree names has its own header", () => expect(headless(TREE)).toEqual([]));
  it("…and a dropped header fails", () => expect(headless("- `[x]` **BATCH A-1 · x**\n  see BATCH B-2\n")).toEqual(["B-2"]));

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

describe("done is done everywhere in the tree (the user, 2026-10-06)", () => {
  it("the real tree has no line left open whose work is done", () => expect(staleLines(TREE)).toEqual([]));

  // each check proven red — on the pattern the 2026-10-06 audit found 109 times
  it("an id open in section 1 and closed in a batch fails", () => expect(staleLines("- `[ ]` c-11a · the packing comment\n\n- `[x]` c-11a · fixed in L-3\n")[0]).toMatch(/^c-11a is open at line 1 and done at line 3/));
  it("the same id open in both places passes", () => expect(staleLines("- `[ ]` c-11a · x\n\n- `[>]` c-11a · y\n")).toEqual([]));
  it("an open parent whose children are all done fails", () => expect(staleLines("- `[>]` Tier 95 sweep\n  - `[x]` the 19 failures re-run\n  - `[~]` one parked\n")[0]).toMatch(/^line 1 is still \[>\]/));
  it("a decision left [?] after its answer is ticked fails", () => expect(staleLines("- `[?]` A or B?\n  - `[x]` DECIDED: B\n")[0]).toMatch(/^line 1 is still \[\?\]/));
  it("a parent with one open child passes", () => expect(staleLines("- `[>]` Tier 95\n  - `[x]` one\n  - `[ ]` two\n")).toEqual([]));
  it("a line handed to a batch that has closed fails", () => expect(staleLines("- `[x]` **BATCH L-3 · x**\n\n- `[ ]` #42 · a Stats row → BATCH L-3\n")[0]).toMatch(/handed to BATCH L-3/));
  it("…and one handed to a QUEUED batch passes", () => expect(staleLines("- `[ ]` **BATCH L-5 · x**\n\n- `[ ]` #42 · a Stats row → BATCH L-5\n")).toEqual([]));
});
