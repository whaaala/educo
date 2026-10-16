import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import LAYOUT from "@/config/layout.json";

/**
 * RULE CFG — THE LAYOUT IS DATA (the user, 2026-10-16: "I don't want anything hard-coded… we'll just change in the
 * configuration file"). Every screen edge lives in `config/layout.json`; the engine, the editor, the export, the app, the
 * UAT scripts and the tests read it. This fails when one of its edges is typed back into code — in the forms a media query
 * or a width check takes — so a copy is caught the day it appears (A2-1, A2-6).
 */
const ROOT = process.cwd();
const SCAN = ["lib", "app", "components", "contexts", "hooks", "apps/admin/app", "apps/admin/components", "apps/mobile/app", "apps/mobile/components", "apps/mobile/hooks", "tests/unit", "tests/e2e", "scripts/uat"];
const SKIP = /\.generated\.|node_modules|[\\/](logs|[\w-]+-out)[\\/]|layout-config\.test\.ts$/; // generated files and saved run output are not code
const files = (dir: string): string[] => {
  const abs = join(ROOT, dir);
  try { statSync(abs); } catch { return []; }
  return readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (SKIP.test(p)) return [];
    return e.isDirectory() ? files(p) : /\.(tsx?|jsx?|css)$/.test(e.name) ? [p] : [];
  });
};

const edges = [...Object.values(LAYOUT.rungs).map((r) => r.from).filter((px) => px > 0), LAYOUT.editor.dockFrom];
const em = (n: number) => String(+n.toFixed(4)).replace(".", "\\.");
/** The forms an edge takes when it is typed in by hand: `37.5em`, `37.49em`, `min-[37.5em]`, `width < 600`. */
const emForms = edges.flatMap((px) => [
  new RegExp(`(?<![\\d.])${em(px / 16)}em\\b`), // not the 75em inside 1.75em
  new RegExp(`(?<![\\d.])${em(px / 16 - 0.01)}em\\b`),
]);
// …and `MW` (the page audit's window width — L6-3: `MW >= 600 && MW < 900` slipped past this list)
const widthChecks = edges.map((px) => new RegExp(`(?:innerWidth|width|vw|\\bw|\\bMW|px)\\)?\\s*[<>]=?\\s*${px}\\b`));
/**
 * A width check in px against one of the rung / dock numbers is an edge in the builder and the app, their tests and scripts.
 */
const BUILDER = /^(lib|app[\\/]website|components[\\/]website|apps[\\/]mobile|tests[\\/]e2e|scripts[\\/]uat)[\\/]/;
/**
 * In the WEB APP's own code (A2-8 / A2-9) a typed screen width in ANY form is an edge: a Tailwind class `min-[1600px]:` /
 * `max-[23em]:` (Tailwind reads named lines from the config — `lg:`, `labels:`, `sheet:`), an `innerWidth` compared with a
 * number, a `matchMedia` with a number in it.
 */
const WEB = /^(app|components|contexts|hooks|apps[\\/]admin)[\\/]/;
/** In the phone / tablet app (A2-3 / A2-4): the window read ONCE at import, or its width compared with a typed number. */
const MOBILE = /^apps[\\/]mobile[\\/]/;
const mobileForms = [/^(?:const|let|var)\b.*Dimensions\.get\(/, /(?:Dimensions\.get\(['"]window['"]\)|useWindowDimensions\(\))\.width\s*[<>]=?\s*\d/];
const webForms = [/\b(?:min|max)-\[[\d.]+(?:px|em|rem)\]:/, /innerWidth\s*[<>]=?\s*\d/, /matchMedia\(\s*["'`][^"'`]*\d+(?:px|em|rem)/];
// Comments may name an edge. A block comment keeps its newlines, so a reported line number is the file's own (A2-10).
const codeOnly = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, "")).replace(/(^|[^:])\/\/.*$/gm, "$1");

export function hardCodedEdges(): string[] {
  return SCAN.flatMap(files).flatMap((f) => {
    const lines = codeOnly(readFileSync(join(ROOT, f), "utf8").replace(/\r\n/g, "\n")).split("\n");
    const patterns = [...emForms, ...(BUILDER.test(f) ? widthChecks : []), ...(WEB.test(f) ? webForms : []), ...(MOBILE.test(f) ? mobileForms : [])];
    return lines.flatMap((l, i) => (patterns.some((p) => p.test(l)) ? [`${relative(ROOT, join(ROOT, f))}:${i + 1}: ${l.trim().slice(0, 120)}`] : []));
  });
}

describe("RULE CFG — the screen edges live in config/layout.json only", () => {
  it("the rungs climb from 0, and every one has its label and words", () => {
    const rs = Object.values(LAYOUT.rungs);
    expect(rs[0].from).toBe(0);
    rs.forEach((r, i) => { if (i) expect(r.from).toBeGreaterThan(rs[i - 1].from); expect(r.label && r.words).toBeTruthy(); });
  });
  it("no edge is typed into code — a media query or a width check reads the config", () => {
    expect(hardCodedEdges()).toEqual([]);
  });
});

/**
 * L5-3 — THE RESIZE NUMBERS ARE DATA TOO. The column floors (14rem untouched, 3rem by hand, 10rem below the tablet rung) and the
 * edge-drag thresholds lived as literals in `lib/box-model.ts` and `BoxCanvas.tsx`; they are read from `config/layout.json`
 * (`columns`, `resize`). This fails when one of them is assigned a number again, or the 14rem floor is typed into a drag.
 */
const RESIZE_NAMES = /\b(REFLOW_FLOOR_REM|HAND_FLOOR_REM|BLOCK_FLOOR_REM|HUG_SNAP_PX|NEIGHBOUR_MIN|MIN_ROW_PX|WRAP_PULL)\s*=\s*\d/;
export const typedResizeNumbers = (src: string) => src.split("\n").filter((l) => RESIZE_NAMES.test(l) || /\b14 \* rootPx\b/.test(l)).map((l) => l.trim());
describe("RULE CFG — the resize floors and thresholds live in config/layout.json only (L5-3)", () => {
  it("every one is in the config, as a number", () => {
    for (const v of [...Object.entries(LAYOUT.columns), ...Object.entries(LAYOUT.resize)].filter(([k]) => k !== "$comment")) expect(typeof v[1]).toBe("number");
  });
  it("none is typed into the engine or the canvas", () => {
    for (const f of ["lib/box-model.ts", "components/website/box/BoxCanvas.tsx"]) expect(typedResizeNumbers(readFileSync(join(ROOT, f), "utf8").replace(/\r\n/g, "\n"))).toEqual([]);
  });
  it("…and one typed back in is caught", () => {
    expect(typedResizeNumbers("export const HAND_FLOOR_REM = 3;\nconst x = 1;")).toHaveLength(1);
    expect(typedResizeNumbers("    const neighbourMinPx = Math.min(maxW, 14 * rootPx + 2 * HG);")).toHaveLength(1);
  });
});
