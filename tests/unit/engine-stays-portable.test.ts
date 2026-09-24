import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * THE BUILDER'S ENGINE STAYS PORTABLE — because the phone and tablet builder will be built on it.
 *
 * The decision this guards, taken 2026-09-24 and recorded in CLAUDE.md:
 *
 *   The web builder is finished FIRST. When the mobile/tablet builder is built, its canvas is a WEBVIEW
 *   rendering the real exported HTML, with native chrome (palette, inspector, gestures) around it — never a
 *   second renderer drawing the page in React Native views.
 *
 * Why a WebView, stated here because this is where someone will come to argue with it: React Native's layout
 * is Yoga, which is flexbox and nothing else. No CSS Grid, no media queries, no container queries, no
 * `position: sticky`, no `clamp()`, no pseudo-elements. Every one of those is load-bearing in what this
 * builder emits. A native canvas could therefore only ever APPROXIMATE the published page, which is
 * canvas ≠ export as a permanent architectural feature — and canvas ≠ export is the most expensive bug class
 * in this project's history (`h-full` never reaching an `<img>`, a 20px image radius on the canvas and 0 on
 * the page, Advanced CSS that appeared only once published, a preview that laid out at the wrong rung).
 *
 * What that buys is this file's subject: the ENGINE is shared as-is, so "replicate it for mobile" means
 * building native chrome around code that already exists rather than porting 4,863 lines of layout logic.
 * That only stays true while the engine keeps out of the DOM and out of React — hence the two checks below.
 *
 * Measured when the decision was taken: box-model.ts 4,863 lines, box-export.ts 833 — both portable —
 * against BoxCanvas.tsx 3,481 and BoxInspector.tsx 1,790, which are React DOM and are not.
 */

// Line endings normalised at the point of READING — guarded by `source-reading-tests.test.ts`.
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");

const ENGINE = ["lib/box-model.ts", "lib/box-export.ts"];

/**
 * The functions allowed to touch a browser, and what each one is.
 *
 * This list is the PORTING SURFACE, not an amnesty: when the mobile builder is built, these are precisely the
 * functions that need a React Native answer, and everything else comes across untouched. Keeping the list
 * short is the point, so adding to it should feel like a decision.
 */
const BROWSER_ALLOWED = new Set([
  // Passes the canvas CALLS and the export ships the SOURCE of — one algorithm, never two.
  "pagerWire",
  "masonryMeasurePass",
  "pinStackPass",
  // Builders of <script> strings. Their `document.` lives inside a template literal: it is text the exported
  // page will run, not something this module does.
  "alertDismissScript",
  "pagerScript",
  "masonryMeasureScript",
  "pinStackScript",
  // Genuinely browser-only, and each needs a React Native equivalent on the day:
  "measureImage",   // new Image() + decode
  "importPhoto",    // FileReader + a canvas to downscale through
  "rootFontPx",     // the reader's own text size
  "downloadSite",   // Blob + createObjectURL + a clicked <a>; on a phone this is the share sheet instead
]);

/**
 * Comments and template literals removed, so what is left is only CODE THAT RUNS.
 *
 * The first version of this guard skipped this and was pure noise. `masonryMeasureScript` builds a `<script>`
 * as a template literal containing `function all(){document.querySelectorAll(…)}` — at column 0, because that
 * is how the string is laid out — so the splitter below read `all`, `soon` and `hide` as top-level functions
 * of this module and reported them as reaching for a browser. They are text. Worse, attributing the DOM to
 * those phantoms meant the real script builders looked clean, so the guard was simultaneously noisy and
 * blind. Prose was doing the same thing from the other direction: a comment that merely says the word
 * `document.` flagged four functions that never touch one.
 */
function code(src: string): string {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    if (two === "/*") { const end = src.indexOf("*/", i + 2); i = end === -1 ? src.length : end + 2; continue; }
    if (two === "//") { const end = src.indexOf("\n", i); i = end === -1 ? src.length : end; continue; }
    if (src[i] === "`") {
      i++;
      while (i < src.length && src[i] !== "`") i += src[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    out += src[i++];
  }
  return out;
}

/** Every top-level function in a file, as { name, body }. */
function functions(src: string): { name: string; body: string }[] {
  const out: { name: string; body: string }[] = [];
  const re = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/gm;
  const starts: { name: string; at: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) starts.push({ name: m[1], at: m.index });
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].at : src.length;
    out.push({ name: starts[i].name, body: src.slice(starts[i].at, end) });
  }
  return out;
}

/** A real browser touch — `document.`, `window.`, `getComputedStyle`, `new Image`, `FileReader`, an element type. */
const DOM = /\bdocument\s*\.|\bwindow\s*\.|\bgetComputedStyle\s*\(|new\s+Image\s*\(|\bFileReader\b|\bHTMLElement\b/;

describe("the engine the mobile builder will be built on", () => {
  it("never imports React as a value — only as a type, which compiles away", () => {
    for (const file of ENGINE) {
      const src = read(file);
      const imports = src.split("\n").filter((l) => /^import\b/.test(l) && /["']react["']/.test(l));
      for (const line of imports) {
        expect(line.trim(), `${file} imports React at runtime: React Native has React, but this line is the thin end of importing react-dom`)
          .toMatch(/^import\s+type\b/);
      }
    }
  });

  it("touches the browser only in the handful of places that are ALLOWED to", () => {
    const offenders: string[] = [];
    for (const file of ENGINE) {
      for (const fn of functions(code(read(file)))) {
        if (!DOM.test(fn.body)) continue;
        if (BROWSER_ALLOWED.has(fn.name)) continue;
        offenders.push(`${file} → ${fn.name}()`);
      }
    }
    expect(offenders, `these reach for a browser, so they cannot come to React Native as they are:\n${offenders.join("\n")}`)
      .toEqual([]);
  });

  it("…and the allow-list is honest — every name on it still exists", () => {
    /**
     * A stale allow-list is the way this guard would rot: rename `masonryMeasurePass`, and the old name sits
     * here forgiving nothing while the new one is silently unguarded. So the list is checked against the code
     * rather than trusted.
     */
    const all = ENGINE.flatMap((f) => functions(code(read(f))).map((fn) => fn.name));
    const missing = [...BROWSER_ALLOWED].filter((n) => !all.includes(n));
    expect(missing, `named in the allow-list but no longer in the engine: ${missing.join(", ")}`).toEqual([]);
  });
});
