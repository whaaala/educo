import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * A TEST THAT READS SOURCE MUST NORMALISE ITS LINE ENDINGS.
 *
 * Git checks this repository out with CRLF on Windows. A test that reads a source file and asserts on a
 * snippet spanning a line break therefore compares a bare newline against a carriage-return pair and
 * fails — on a file nobody has touched, for a reason that has nothing to do with the behaviour asserted.
 *
 * Not hypothetical: `immersive-layout.test.ts` failed exactly this way the day the branch changed and the
 * working tree was re-normalised, and three more files were carrying the same landmine unexploded.
 *
 * So this is a guard rather than a note somebody has to remember. Read source through a helper that
 * strips the carriage returns and this stays green; write a bare read in a test and it fails immediately,
 * while the author still has the context to fix it.
 */

const TESTS = resolve(process.cwd(), "tests/unit");
const files = readdirSync(TESTS).filter((f) => f.endsWith(".test.ts"));

/** How far after a read to look for the strip — comfortably past a wrapped line, well short of the next statement. */
const WINDOW = 220;

describe("tests that read source files", () => {
  it.each(files)("%s normalises line endings wherever it reads a file", (file) => {
    const raw = readFileSync(join(TESTS, file), "utf8").replace(/\r\n/g, "\n");
    // COMMENTS ARE STRIPPED FIRST. This very file explains the rule by quoting an example read in a
    // comment — and the first version flagged itself for it. A guard that fails on prose about the guard
    // teaches people to stop reading its output.
    const src = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

    // Look AHEAD from each read rather than trying to parse its arguments. The first version of this
    // matched `readFileSync\([^)]*\)`, which stops at the first closing bracket — so a nested call like
    // `readFileSync(join(dir, f), "utf8")` truncated before the `.replace` and reported four
    // already-fixed files as broken. A guard that cries wolf costs exactly the trust of one that stays
    // quiet, so it now asks the simpler question: is a CRLF strip anywhere just after this read?
    const bare: string[] = [];
    for (const m of src.matchAll(/readFileSync\(/g)) {
      const tail = src.slice(m.index, m.index + WINDOW);
      if (!tail.includes("replace(/\\r\\n/g")) bare.push(tail.split("\n")[0].trim());
    }

    expect(bare, `${file} reads a file without stripping carriage returns — a CRLF checkout will break it:\n  ${bare.join("\n  ")}`)
      .toEqual([]);
  });
});
