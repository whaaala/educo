/**
 * fix-duplicate-theme-classes — codemod for the systemic bug found by
 * scripts/find-duplicate-theme-classes.cjs.
 *
 * Bulk theme-variant tooling left the SAME theme prefix + property + colour declared more than
 * once in a single className, e.g.:
 *
 *     midnight:bg-[#0a0e27]      midnight:bg-[#0a0e27]/60
 *     dark:bg-[#0f1115]          dark:bg-[#0f1115]/40
 *
 * Tailwind emits both as separate utilities; which one wins depends on generated-CSS order, not
 * the class string — so the result is unpredictable, and the intended translucency (which pairs
 * with backdrop-blur for the glass surfaces) is frequently lost.
 *
 * Rule: keep ONE token per (prefix, property, colour). Prefer the opacity-qualified variant —
 * that is the deliberate one (it mirrors the light-mode `bg-white/70` translucency). Exact
 * duplicates are simply de-duplicated.
 *
 * Usage:
 *   node scripts/fix-duplicate-theme-classes.cjs --dry    # report only
 *   node scripts/fix-duplicate-theme-classes.cjs          # apply
 */
const fs = require("fs");
const path = require("path");

const DRY = process.argv.includes("--dry");
const EXTS = [".tsx", ".ts"];
const SKIP = new Set(["node_modules", ".next", ".git", "android", "ios", "build", "dist", "scripts"]);

// A theme-prefixed arbitrary-value utility, with optional opacity suffix.
const TOKEN = /(?:dark|midnight|purple):(?:hover:)?(?:bg|text|border)-\[[^\]]+\](?:\/\d+)?/g;

let filesChanged = 0;
let tokensRemoved = 0;

/** Collapse duplicate theme tokens within one whitespace-separated class string. */
function fixClassString(str) {
  const tokens = str.match(TOKEN);
  if (!tokens || tokens.length < 2) return str;

  // Group by the token minus its opacity suffix.
  const groups = new Map();
  for (const t of tokens) {
    const base = t.replace(/\/\d+$/, "");
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(t);
  }

  // Decide the single winner per group, and collect the losers to strip.
  const losers = [];
  for (const [, list] of groups) {
    if (list.length < 2) continue;
    const withOpacity = list.filter((t) => /\/\d+$/.test(t));
    // Prefer the opacity-qualified token (deliberate translucency); else keep the last.
    const winner = withOpacity.length > 0 ? withOpacity[withOpacity.length - 1] : list[list.length - 1];
    let keptWinner = false;
    for (const t of list) {
      if (t === winner && !keptWinner) {
        keptWinner = true; // keep exactly one instance of the winner
        continue;
      }
      losers.push(t);
    }
  }
  if (losers.length === 0) return str;

  // Rebuild the class string, dropping loser tokens (removing each only as many times as needed).
  const toDrop = new Map();
  for (const l of losers) toDrop.set(l, (toDrop.get(l) || 0) + 1);

  const parts = str.split(/(\s+)/); // keep whitespace so formatting survives
  const out = [];
  for (const p of parts) {
    const n = toDrop.get(p);
    if (n) {
      toDrop.set(p, n - 1);
      tokensRemoved++;
      continue; // drop this token
    }
    out.push(p);
  }
  return out.join("").replace(/\s{2,}/g, " ").trim();
}

function processFile(file) {
  const src = fs.readFileSync(file, "utf8");
  // Only touch string literals (className="…", "…" inside arrays, template chunks).
  const next = src.replace(/(["'`])([^"'`\n]*?)\1/g, (whole, q, body) => {
    if (!/(?:dark|midnight|purple):/.test(body)) return whole;
    const fixed = fixClassString(body);
    return fixed === body ? whole : q + fixed + q;
  });
  if (next !== src) {
    filesChanged++;
    if (!DRY) fs.writeFileSync(file, next, "utf8");
    return true;
  }
  return false;
}

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
    if (e.isDirectory()) walk(p);
    else if (EXTS.includes(path.extname(e.name))) processFile(p);
  }
}

walk(process.cwd());
console.log(`${DRY ? "[dry-run] would change" : "changed"} ${filesChanged} files, removing ${tokensRemoved} duplicate theme tokens`);
