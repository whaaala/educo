#!/usr/bin/env node
/**
 * surface → token codemod (Educo UI, State 2b, option A = zero visual change).
 * Collapses the app's most-duplicated card-surface class combo into the semantic `bg-surface` token.
 * ONLY the EXACT full 4-value combo is replaced (light + all three dark themes), because the token was
 * calibrated to those exact values — so rendering is pixel-identical. Partials, opacity variants
 * (…/50), and other orderings are intentionally left untouched.
 *
 * Usage:  node scripts/codemods/surface-to-token.mjs         # dry run
 *         node scripts/codemods/surface-to-token.mjs --write # apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const WRITE = process.argv.includes("--write");
const ROOTS = ["app", "components"];
const SKIP = /(\.test\.|\.visual\.|educo-ui)/;

// [exact source combo, replacement]. Values match --eu-color-surface / surface-2 per theme exactly.
const RULES = [
  // Family A (flat) + Family B (raised) card surfaces — both unified to the raised `bg-surface` token.
  ["bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]", "bg-surface"],
  ["bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]", "bg-surface"],
  ["bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]", "bg-surface-2"],
  ["bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]", "bg-canvas"],
  ["text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300", "text-muted"],
  ["text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50", "text-ink"],
  ["border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20", "border-line"],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!/node_modules|\.next/.test(p)) walk(p, out); }
    else if (/\.tsx$/.test(name)) out.push(p);
  }
  return out;
}

let filesChanged = 0, hits = 0;
const report = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = file.split(sep).join("/");
    if (SKIP.test(rel)) continue;
    let src = readFileSync(file, "utf8");
    let n = 0;
    for (const [from, to] of RULES) {
      const parts = src.split(from);
      if (parts.length > 1) { n += parts.length - 1; src = parts.join(to); }
    }
    if (n > 0) { filesChanged++; hits += n; report.push(`  ${String(n).padStart(3)}  ${rel}`); if (WRITE) writeFileSync(file, src); }
  }
}
report.sort((a, b) => parseInt(b) - parseInt(a));
console.log(`\n${WRITE ? "APPLIED" : "DRY RUN"} — surface combo → bg-surface`);
console.log(`files: ${filesChanged} | replacements: ${hits}\n`);
console.log(report.slice(0, 30).join("\n"));
if (report.length > 30) console.log(`  … and ${report.length - 30} more files`);
if (!WRITE) console.log(`\nRe-run with --write to apply.`);
