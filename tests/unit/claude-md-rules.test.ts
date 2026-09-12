import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * EVERY STANDING RULE IS STATED IN `CLAUDE.md`.
 *
 * The rules used to live in the memory directory and in the published Hub artifact — both of which are
 * *recalled* rather than *required*. `CLAUDE.md` is the one file a session is obliged to read, and the
 * one that says its checklists override default behaviour. A rule that is not in it is a rule that a
 * session can legitimately never see, which is exactly how "fix every bug you find" came to be broken
 * three times in one day while being, on paper, one of the project's oldest rules.
 *
 * So this asserts the register itself. It is deliberately a test rather than a promise: adding a rule
 * to the memory and forgetting to state it here is the failure mode, and a promise cannot catch it.
 *
 * Adding a rule? Put it in `CLAUDE.md` and add its key below. Never the other way round.
 */

// Line endings normalised at the point of READING — a CRLF checkout otherwise fails any assertion that
// spans a line break. Guarded by `source-reading-tests.test.ts`.
const CLAUDE = readFileSync(resolve(process.cwd(), "CLAUDE.md"), "utf8").replace(/\r\n/g, "\n");

/** Each standing rule, and a phrase that can only appear if the rule is actually stated. */
const RULES: [name: string, mustSay: RegExp][] = [
  ["Fix what you find (RULE V)", /a bug you find is a bug you \*\*fix\*\*|BUG LEDGER/i],
  ["…and it covers bugs in TESTS", /bugs in \*\*tests\*\*|bugs in TESTS/i],
  ["…and skipping one is the user's call", /never your|USER'S call/i],
  ["Clean code — zero errors, no `any` (RULE W)", /ZERO ERRORS/],
  ["Design galleries you can see (RULE S)", /RULE S/],
  ["Distinct, combining variations (RULE T)", /RULE T/],
  ["Playwright everything, user POV (RULE U)", /RULE U/],
  ["Capability parity (Rule A)", /Rule A — capability parity/i],
  ["Full CRUD per item (Rule B)", /Rule B/],
  ["The component workflow needs approval", /get approval|→ \*\*get approval\*\*/i],
  ["Artifacts updated in the SAME change", /SAME change/],
  ["Living guide updated with the feature", /docs\/guide\//],
  ["Full suite before a COMMIT", /before a COMMIT/i],
  ["Never vitest and Playwright at once", /NEVER run vitest and Playwright/i],
  ["Responsive Field Guide — four ingredients", /Fluid layouts/i],
  ["Container queries, not the viewport", /Container queries/i],
  ["Token-driven, no hardcoded hex", /no hardcoded hex/i],
  ["Contrast asserted, not assumed", /ASSERTED, not assumed/i],
  ["The five-rung ladder, base IS desktop", /base.{0,4} IS desktop/i],
  ["Edge-anchored resize", /edge you grab is the ONLY one that moves/i],
  ["Nothing rounded until asked", /Nothing is rounded until someone asks/i],
  ["Nothing spaced until asked", /Spacing is a decision, never a default/i],
  ["No alert/confirm/prompt", /No .?alert\(\)/i],
  ["Loading spinners on all pages", /PageLoader/],
  ["Every UI element actually works", /working functionality/i],
  ["WCAG 2.1 AA everywhere", /WCAG 2\.1 AA/],
  ["Keyboard path for every feature", /keyboard shortcuts/i],
  ["All themes supported", /ALL available themes|ALL themes/i],
  ["BDD feature files are the source of truth", /\.feature/],
  ["Mobile + tablet parity", /apps\/mobile\//],
  ["Verify on both emulators", /emulator/i],
  ["Session continuity — save state at the end", /project_last_session/],
  ["Reuse-first component architecture", /components\/shared\//],
  ["One branch per AREA, named for the area", /One branch per AREA/],
  ["…and named for the area, not the audience", /never the audience/i],
  ["Branches stay short", /Keep a branch SHORT/],
  ["Merge through a pull request", /PULL REQUEST/],
  ["The gate is green at the merged commit", /green at the commit being merged/i],
  ["Delete the branch after merging", /delete the branch/i],
];

describe("CLAUDE.md is the complete rule register", () => {
  it.each(RULES)("states the rule: %s", (_name, mustSay) => {
    expect(CLAUDE).toMatch(mustSay);
  });

  it("puts the bug rule FIRST in the AFTER checklist, where it cannot be scrolled past", () => {
    const after = CLAUDE.slice(CLAUDE.indexOf("## ✅ AFTER"));
    const firstItem = after.slice(after.indexOf("- [ ]"), after.indexOf("- [ ]") + 400);
    expect(firstItem, "the rule most often broken goes at the top of the list that is read last")
      .toMatch(/EVERY BUG IN THE LEDGER READS FIXED/);
  });

  it("opens the ledger in the BEFORE checklist, so there is somewhere to write a bug down", () => {
    const before = CLAUDE.slice(CLAUDE.indexOf("## ⚠️ BEFORE"), CLAUDE.indexOf("## ✅ AFTER"));
    expect(before).toMatch(/BUG LEDGER/);
  });

  it("links the detail rather than burying it, so the file stays readable", () => {
    expect(CLAUDE).toMatch(/docs\/FIX_WHAT_YOU_FIND\.md/);
  });

  it("numbers its Core Rules in order, so a reader can tell none is missing", () => {
    const nums = [...CLAUDE.matchAll(/^### (\d+)\. /gm)].map((m) => Number(m[1]));
    expect(nums, "an out-of-order list is one somebody edited without reading").toEqual(
      Array.from({ length: nums.length }, (_, i) => i + 1),
    );
  });
});
