#!/usr/bin/env node
/**
 * HOW MUCH OF THIS AREA IS LEFT? (RULE PROGRESS, the user 2026-10-18: "always show what percentage of work we have left…
 * so we don't start adding more and more work to it").
 *
 * Reads the AREA MAP at the top of BATCHES in docs/TASK_TREE.md: an area's line lists its batches joined by " → ", the
 * essentials (Must + essential Should) up to the first "· then", and the lines put off for later after "RE-OPENED".
 * Each batch's heading says "N changes" and `[x]` when closed.
 * ponytail: counted in CHANGES, not effort — a batch counts as done only once it is closed.
 *
 * Usage: node scripts/area-progress.js ["Website layout"]
 */
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const ID = /[A-Z]+-\d+[a-z]?/;

function batchInfo(tree, id) {
  const head = tree.split("\n").find((l) => l.startsWith("- `[") && l.includes(`**BATCH ${id} · `));
  if (!head) return { id, found: false, done: false, changes: 0 };
  const n = head.match(/(\d+) changes?\b/);
  return { id, found: true, done: head.startsWith("- `[x]`"), changes: n ? Number(n[1]) : 0, counted: !!n };
}

function expand(from, to) {
  const [, p, a] = from.match(/^([A-Z]+-)(\d+)/);
  const b = Number(to.match(/\d+/)[0]);
  return Array.from({ length: b - Number(a) + 1 }, (_, k) => `${p}${Number(a) + k}`);
}

function areaProgress(tree, area) {
  const want = area.toLowerCase(); // LE15b-1: typed "website layout", the map says "Website layout"
  const line = tree.split("\n").find((l) => [" — ", ": ", " ("].some((end) => l.toLowerCase().startsWith(want + end)));
  if (!line) throw new Error(`no AREA MAP line for "${area}"`);
  const essentials = [];
  const segs = line.split(" → ");
  let i = 0;
  for (; i < segs.length; i++) {
    const seg = segs[i].trim();
    if (/^then /.test(seg)) break; // "→ then the rest: …"
    const m = seg.match(new RegExp(`(?:^|: )(${ID.source})(?: \\(| ·| … |$)`));
    if (m) {
      const range = seg.match(new RegExp(`^(${ID.source}) … (${ID.source})`)); // "VE-1 … VE-13"
      essentials.push(...(range ? expand(range[1], range[2]) : [m[1]]).map((id) => batchInfo(tree, id)));
    }
    if (/· then /.test(seg)) { i++; break; } // "LE-7 (…) · then the EFFECTS …"
  }
  const later = segs.slice(i).join(" → ").split(/RE-OPENED/).pop();
  const laterIds = [...later.matchAll(new RegExp(ID.source, "g"))].map((m) => m[0]);
  const deferred = [...new Set(laterIds)].map((id) => batchInfo(tree, id)).filter((b) => b.found && !b.done);
  const total = essentials.reduce((s, b) => s + b.changes, 0);
  const left = essentials.filter((b) => !b.done).reduce((s, b) => s + b.changes, 0);
  return { area, essentials, total, left, pctLeft: total ? Math.round((100 * left) / total) : 0, deferred };
}

module.exports = { areaProgress, batchInfo };

if (require.main === module) {
  const tree = readFileSync(join(__dirname, "..", "docs", "TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");
  let p;
  try { p = areaProgress(tree, process.argv[2] ?? "Website layout"); } catch (e) { console.error(e.message); process.exit(1); }
  const open = p.essentials.filter((b) => !b.done);
  console.log(`${p.area} — essentials (Must + essential Should): ${p.left} of ${p.total} changes left = ${p.pctLeft}% left`);
  console.log(`  open: ${open.map((b) => `${b.id} (${b.changes})`).join(" · ") || "none"}`);
  console.log(`  later (Nice / Great, mapped, re-opened after): ${p.deferred.length} batches — ${p.deferred.map((b) => b.id).join(" · ")}`);
  const unknown = p.essentials.filter((b) => !b.found || !b.counted).map((b) => b.id);
  if (unknown.length) { console.error(`  NOT COUNTED (no heading or no "N changes"): ${unknown.join(" · ")}`); process.exit(1); }
}
