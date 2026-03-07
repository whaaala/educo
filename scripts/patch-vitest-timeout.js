/**
 * Patches the birpc RPC timeout in Vitest from 60s to 120s.
 * This prevents "Timeout calling onTaskUpdate" errors when running
 * large test suites (1200+ tests) where the worker RPC payload is large.
 */
const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "vitest",
  "dist",
  "chunks",
  "index.B521nVV-.js"
);

if (!fs.existsSync(target)) {
  // File doesn't exist yet (pre-install) or chunk name changed — skip silently
  process.exit(0);
}

let content = fs.readFileSync(target, "utf8");
const old = "const DEFAULT_TIMEOUT = 6e4;";
const patched = "const DEFAULT_TIMEOUT = 12e4;";

if (content.includes(patched)) {
  // Already patched
  process.exit(0);
}

if (!content.includes(old)) {
  // Chunk structure changed — try a broader match
  const regex = /const DEFAULT_TIMEOUT = \d+e?\d*;/;
  if (regex.test(content)) {
    content = content.replace(regex, patched);
    fs.writeFileSync(target, content);
    console.log("Patched Vitest birpc timeout (regex fallback) → 120s");
  } else {
    console.warn("Could not find birpc DEFAULT_TIMEOUT to patch — skipping");
  }
  process.exit(0);
}

content = content.replace(old, patched);
fs.writeFileSync(target, content);
console.log("Patched Vitest birpc timeout → 120s");
