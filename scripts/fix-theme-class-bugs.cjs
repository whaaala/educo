/**
 * fix-theme-class-bugs — repairs two systemic class bugs left by bulk theme-variant tooling.
 *
 *  BUG 1 — malformed double opacity:
 *      purple:hover:bg-pink-500/10/50      (two opacity suffixes)
 *    Tailwind emits NOTHING for these, so the themed hover/border/ring state is silently dead.
 *    Fix: keep the first (theme-chosen) opacity, drop the trailing leftover  ->  .../10
 *
 *  BUG 2 — the same utility declared twice with different opacities:
 *      midnight:hover:bg-cyan-500/5 ... midnight:hover:bg-cyan-500/8
 *      dark:bg-[#0f1115]            ... dark:bg-[#0f1115]/40
 *    Which one wins depends on generated-CSS order, not the class string — unpredictable, and
 *    the intended translucency (paired with backdrop-blur) is often lost.
 *    Fix: keep ONE — preferring the opacity-qualified variant (the deliberate one).
 *
 * Usage:
 *   node scripts/fix-theme-class-bugs.cjs --dry
 *   node scripts/fix-theme-class-bugs.cjs
 */
const fs = require("fs");
const path = require("path");

const DRY = process.argv.includes("--dry");
const EXTS = [".tsx", ".ts"];
const SKIP = new Set(["node_modules", ".next", ".git", "android", "ios", "build", "dist", "scripts"]);

const PROP = "(?:bg|text|border|ring|divide|from|to|via|shadow|outline|decoration|accent|caret|fill|stroke)";
const VARIANT = "(?:[a-z-]+:)+"; // dark: / midnight: / purple: / hover: chains
// Malformed: <variant><prop>-<color>-<shade>/<n>/<m>
const MALFORMED = new RegExp(`(${VARIANT}${PROP}-[a-z]+-\\d+\\/\\d+)\\/\\d+`, "g");
// Any themed utility (named colour OR arbitrary value), with optional opacity.
const TOKEN = new RegExp(`(?:dark|midnight|purple):(?:[a-z-]+:)*${PROP}-(?:\\[[^\\]]+\\]|[a-z]+-\\d+)(?:\\/\\d+)?`, "g");

let filesChanged = 0;
let malformedFixed = 0;
let dupesRemoved = 0;

/** BUG 2: collapse duplicate themed utilities inside one class string. */
function dedupe(str) {
  const tokens = str.match(TOKEN);
  if (!tokens || tokens.length < 2) return str;

  const groups = new Map();
  for (const t of tokens) {
    const base = t.replace(/\/\d+$/, "");
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(t);
  }

  const drop = new Map();
  for (const [, list] of groups) {
    if (list.length < 2) continue;
    const withOpacity = list.filter((t) => /\/\d+$/.test(t));
    const winner = withOpacity.length ? withOpacity[withOpacity.length - 1] : list[list.length - 1];
    let kept = false;
    for (const t of list) {
      if (t === winner && !kept) {
        kept = true;
        continue;
      }
      drop.set(t, (drop.get(t) || 0) + 1);
    }
  }
  if (!drop.size) return str;

  const parts = str.split(/(\s+)/);
  const out = [];
  for (const p of parts) {
    const n = drop.get(p);
    if (n) {
      drop.set(p, n - 1);
      dupesRemoved++;
      continue;
    }
    out.push(p);
  }
  return out.join("").replace(/\s{2,}/g, " ").trim();
}

function processFile(file) {
  const src = fs.readFileSync(file, "utf8");

  // BUG 1 first — repair malformed tokens so BUG 2 can then see them as normal duplicates.
  let next = src.replace(MALFORMED, (_m, keep) => {
    malformedFixed++;
    return keep;
  });

  // BUG 2 — dedupe within each string literal.
  next = next.replace(/(["'`])([^"'`\n]*?)\1/g, (whole, q, body) => {
    if (!/(?:dark|midnight|purple):/.test(body)) return whole;
    const fixed = dedupe(body);
    return fixed === body ? whole : q + fixed + q;
  });

  if (next !== src) {
    filesChanged++;
    if (!DRY) fs.writeFileSync(file, next, "utf8");
  }
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
console.log(
  `${DRY ? "[dry-run] would change" : "changed"} ${filesChanged} files — ` +
    `${malformedFixed} malformed double-opacity classes repaired, ${dupesRemoved} duplicate tokens removed`,
);
