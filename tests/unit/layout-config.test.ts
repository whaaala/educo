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
const SCAN = ["lib", "app", "components", "apps/mobile/app", "apps/mobile/components", "apps/mobile/hooks", "tests/unit", "tests/e2e", "scripts/uat"];
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
const widthChecks = edges.map((px) => new RegExp(`(?:innerWidth|width|vw|\\bw|px)\\)?\\s*[<>]=?\\s*${px}\\b`));
/**
 * A width check in px is an edge only in the BUILDER and the app (and their tests and scripts). ponytail: the rest of the Educo
 * web app (`app/admin`, `app/students`…) has its own Tailwind `lg` 1024 typed by hand — ledger A2-8, a separate area.
 */
const BUILDER = /^(lib|app[\\/]website|components[\\/]website|apps[\\/]mobile|tests[\\/]e2e|scripts[\\/]uat)[\\/]/;
// Comments may name an edge. A block comment keeps its newlines, so a reported line number is the file's own (A2-10).
const codeOnly = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, "")).replace(/(^|[^:])\/\/.*$/gm, "$1");

export function hardCodedEdges(): string[] {
  return SCAN.flatMap(files).flatMap((f) => {
    const lines = codeOnly(readFileSync(join(ROOT, f), "utf8").replace(/\r\n/g, "\n")).split("\n");
    const patterns = BUILDER.test(f) ? [...emForms, ...widthChecks] : emForms;
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
