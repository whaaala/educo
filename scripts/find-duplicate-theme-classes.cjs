/**
 * find-duplicate-theme-classes — scans for a systemic bug introduced by bulk theme-variant
 * tooling: the SAME theme prefix + colour declared twice in one className with different
 * opacities (e.g. `midnight:bg-[#0a0e27] ... midnight:bg-[#0a0e27]/60`).
 *
 * Tailwind keeps the last one, so the earlier declaration is dead — and the intended
 * translucency is often lost (killing backdrop-blur/glass effects in dark themes).
 *
 * Usage: node scripts/find-duplicate-theme-classes.cjs
 */
const fs = require("fs");
const path = require("path");

const EXTS = [".tsx", ".ts"];
const SKIP = new Set(["node_modules", ".next", ".git", "android", "ios", "build", "dist"]);
const THEME_TOKEN = /(?:dark|midnight|purple):(?:hover:)?(?:bg|text|border)-\[[^\]]+\](?:\/\d+)?/g;

const hits = [];

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
    } else if (EXTS.includes(path.extname(e.name))) {
      let src;
      try {
        src = fs.readFileSync(p, "utf8");
      } catch {
        continue;
      }
      // Scan each STRING LITERAL separately, not each line. A ternary puts two independent
      // class strings on one line (`starred ? "bg-white …" : "bg-white/90 …"`) — those are
      // different branches, not duplicates, and must not be reported.
      src.split(/\r?\n/).forEach((line, i) => {
        const literals = line.match(/(["'`])[^"'`\n]*?\1/g) || [];
        for (const lit of literals) {
          const toks = lit.match(THEME_TOKEN);
          if (!toks || toks.length < 2) continue;
          const seen = {};
          for (const t of toks) {
            const base = t.replace(/\/\d+$/, ""); // strip opacity to find same-property dupes
            (seen[base] = seen[base] || []).push(t);
          }
          const dups = Object.entries(seen).filter(([, list]) => list.length > 1);
          if (dups.length) {
            hits.push({
              file: p.split(path.sep).join("/"),
              line: i + 1,
              dups: dups.map(([, list]) => list.join(" vs ")),
            });
          }
        }
      });
    }
  }
}

walk(process.cwd());

console.log(`Conflicting duplicate theme classes: ${hits.length}`);
for (const h of hits.slice(0, 40)) {
  console.log(`  ${h.file}:${h.line}`);
  for (const d of h.dups) console.log(`      ${d}`);
}
if (hits.length > 40) console.log(`  … and ${hits.length - 40} more`);
