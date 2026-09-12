#!/usr/bin/env node
/**
 * px → rem codemod (Educo UI, State 2). Converts hardcoded px font-sizes to the EXACT rem equivalent
 * (÷16) so text scales with the user's browser font-size — with zero visual change at the default base.
 *
 * Targets ONLY:
 *   - `text-[Npx]`                Tailwind arbitrary font-size  → `text-[Xrem]`
 *   - `fontSize: 'Npx'` (JS obj)  inline style literal          → `fontSize: 'Xrem'`
 * It does NOT touch raw CSS `font-size: Npx` inside print/export template strings (different syntax),
 * and SKIPS editors/canvas/print where px is intentional (document/slide sizing must stay px).
 *
 * Usage:  node scripts/codemods/px-to-rem.mjs            # dry run (report only)
 *         node scripts/codemods/px-to-rem.mjs --write    # apply changes
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const WRITE = process.argv.includes("--write");
const ROOTS = ["app", "components"];
// px here is intentional (document/slide/whiteboard content, print templates) — leave alone.
const SKIP = /(DocEditor|SlideEditor|SlideCanvas|Whiteboard|PresenterView|presentations|ReportCardTemplate|TranscriptTemplatePrintable|Printable|\.test\.|\.visual\.|educo-ui)/;

const toRem = (px) => {
  const rem = Number(px) / 16;
  return `${rem.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}rem`;
};

const RE_CLASS = /text-\[(\d+(?:\.\d+)?)px\]/g;
const RE_STYLE = /(fontSize:\s*)(['"])(\d+(?:\.\d+)?)px\2/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!/node_modules|\.next/.test(p)) walk(p, out); }
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

let filesChanged = 0, classHits = 0, styleHits = 0, skipped = 0;
const report = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = file.split(sep).join("/");
    if (SKIP.test(rel)) { skipped++; continue; }
    const src = readFileSync(file, "utf8");
    let c = 0, s = 0;
    let next = src.replace(RE_CLASS, (_, px) => { c++; return `text-[${toRem(px)}]`; });
    next = next.replace(RE_STYLE, (_, pre, q, px) => { s++; return `${pre}${q}${toRem(px)}${q}`; });
    if (c + s > 0) {
      filesChanged++; classHits += c; styleHits += s;
      report.push(`  ${String(c + s).padStart(3)}  ${rel}  (class:${c} style:${s})`);
      if (WRITE) writeFileSync(file, next);
    }
  }
}

report.sort((a, b) => parseInt(b) - parseInt(a));
console.log(`\n${WRITE ? "APPLIED" : "DRY RUN"} — px → rem font-size codemod`);
console.log(`files ${WRITE ? "changed" : "to change"}: ${filesChanged} | text-[Npx]: ${classHits} | fontSize px: ${styleHits} | total: ${classHits + styleHits} | files skipped (editors/print): ${skipped}\n`);
console.log(report.slice(0, 40).join("\n"));
if (report.length > 40) console.log(`  … and ${report.length - 40} more files`);
if (!WRITE) console.log(`\nRe-run with --write to apply.`);
