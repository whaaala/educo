import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

/**
 * Suites that belong to OTHER areas and are deliberately not part of the builder's browser gate — they have
 * their own runners. Listed explicitly rather than pattern-matched, so adding one is a decision somebody
 * makes on purpose rather than a name that happens to slip through.
 */
const NOT_IN_THIS_GATE = [
  "tests/e2e/admin-parents.spec.ts",
  "tests/e2e/communication.spec.ts",
  "tests/e2e/doc-editor-comprehensive.spec.ts",
  "tests/e2e/doc-editor.spec.ts",
  "tests/e2e/parent-portal.spec.ts",
  "tests/e2e/visual-regression.spec.ts",
  "tests/e2e/whiteboard.spec.ts",
];

/**
 * THE TWO LISTS OF BROWSER SUITES MUST AGREE.
 *
 * `test:invariants:rest` in package.json and `INVARIANT_SPECS` in `scripts/test-fast.js` name the same suites
 * for two different runners — the dev-server path and the production-build path. Two hand-maintained copies of
 * a list drift, and this particular drift is silent: a spec added to one and not the other simply stops being
 * run on that path, and nothing fails. Nobody notices until the guard it contained was needed.
 *
 * It also checks each named file EXISTS, because a renamed spec leaves a path that Playwright reports as
 * "no tests found" — which reads like a filter problem rather than a missing guard.
 */

// Normalised at the point of reading — a CRLF checkout otherwise breaks any assertion spanning a line break.
const root = process.cwd();
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8").replace(/\r\n/g, "\n"));
const fastRunner = readFileSync(resolve(root, "scripts/test-fast.js"), "utf8").replace(/\r\n/g, "\n");

/** Every `tests/e2e/*.spec.ts` mentioned in a string, deduped and sorted. */
const specsIn = (text: string) =>
  [...new Set([...text.matchAll(/tests\/e2e\/[\w.-]+\.spec\.ts/g)].map((m) => m[0]))].sort();

/** The production-build runner's list, read from the array rather than the whole file, so its usage examples
 *  in the header comment cannot be mistaken for entries. */
const fastList = specsIn(fastRunner.slice(fastRunner.indexOf("const INVARIANT_SPECS"), fastRunner.indexOf("];")));

const devList = specsIn(
  [pkg.scripts["test:layout"], pkg.scripts["test:invariants:rest"]].join(" "),
);

describe("the browser suites are the same on both paths", () => {
  it("names at least the suites we know exist, so an empty match cannot pass", () => {
    // Without this, a regex that stopped matching would make every comparison below trivially true.
    expect(fastList.length, "the fast runner must list the suites").toBeGreaterThan(15);
    expect(devList.length, "and so must the npm scripts").toBeGreaterThan(15);
  });

  it("runs the same set of specs whether it goes through next dev or next start", () => {
    const onlyDev = devList.filter((s) => !fastList.includes(s));
    const onlyFast = fastList.filter((s) => !devList.includes(s));
    expect(
      { missingFromTestFast: onlyDev, missingFromNpmScripts: onlyFast },
      "a suite in one list and not the other silently stops running on that path",
    ).toEqual({ missingFromTestFast: [], missingFromNpmScripts: [] });
  });

  it("names only specs that actually exist", () => {
    const missing = [...new Set([...devList, ...fastList])].filter((s) => !existsSync(resolve(root, s)));
    expect(missing, "a renamed spec leaves a path Playwright reports as 'no tests found', not as an error")
      .toEqual([]);
  });

  it("runs every BUILDER spec that exists on disk", () => {
    /**
     * The gap the two checks above cannot see.
     *
     * They compare the two lists with EACH OTHER, which a spec missing from BOTH satisfies perfectly. Three
     * builder suites — `empty-box-height`, `float-round-trip` and `see-through` — sat on disk in neither
     * list, so no runner ever executed them and nothing said so. A guard nobody runs is indistinguishable
     * from a guard that passes, which is this repo's oldest lesson and its most repeated one.
     *
     * Scoped to the BUILDER rather than to `tests/e2e/*`, because the other areas (the doc editor, the admin
     * and parent portals, the whiteboard, visual regression) are deliberately outside this gate — they have
     * their own runners, and sweeping them in here would trade a silent gap for a noisy one.
     */
    const BUILDER_SPECS = readdirSync(resolve(root, "tests/e2e"))
      .filter((f) => f.endsWith(".spec.ts"))
      .map((f) => `tests/e2e/${f}`)
      .filter((s) => !NOT_IN_THIS_GATE.includes(s));
    const unlisted = BUILDER_SPECS.filter((s) => !fastList.includes(s));
    expect(unlisted, "a builder spec in neither list is never run by anything — add it to both")
      .toEqual([]);
  });

  it("keeps a production-build check available, since the browser suites now depend on one", () => {
    expect(pkg.scripts["build:check"], "the suites run against `next start`, so the build must be checkable")
      .toBeTruthy();
    expect(pkg.scripts["test:fast"]).toContain("scripts/test-fast.js");
  });
});
