/**
 * Patches the birpc RPC timeout in Vitest to 180s (3 minutes).
 * This prevents "Timeout calling onTaskUpdate" errors when running
 * large test suites (1200+ tests) where the worker RPC payload is large.
 *
 * ROBUST: Scans ALL chunk files in vitest/dist/chunks/ for the birpc
 * DEFAULT_TIMEOUT constant, so it survives vitest version upgrades
 * (chunk filenames change with every release).
 */
const fs = require("fs");
const path = require("path");

const DESIRED_TIMEOUT = "18e4"; // 180 seconds (3 minutes)
const PATCHED_LINE = `const DEFAULT_TIMEOUT = ${DESIRED_TIMEOUT};`;
const TIMEOUT_REGEX = /const DEFAULT_TIMEOUT = \d+e?\d*;/;

const chunksDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "vitest",
  "dist",
  "chunks"
);

if (!fs.existsSync(chunksDir)) {
  // vitest not installed yet — skip silently
  process.exit(0);
}

let patched = 0;
const files = fs.readdirSync(chunksDir).filter((f) => f.endsWith(".js"));

for (const file of files) {
  const filePath = path.join(chunksDir, file);
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    continue;
  }

  // Skip if already patched to our desired value
  if (content.includes(PATCHED_LINE)) {
    continue;
  }

  // Check if this file contains the birpc DEFAULT_TIMEOUT
  if (TIMEOUT_REGEX.test(content)) {
    content = content.replace(TIMEOUT_REGEX, PATCHED_LINE);
    fs.writeFileSync(filePath, content);
    console.log(`Patched birpc timeout in ${file} → ${DESIRED_TIMEOUT} (180s)`);
    patched++;
  }
}

if (patched === 0) {
  // Check if already at desired value
  let alreadyPatched = false;
  for (const file of files) {
    const filePath = path.join(chunksDir, file);
    try {
      if (fs.readFileSync(filePath, "utf8").includes(PATCHED_LINE)) {
        alreadyPatched = true;
        break;
      }
    } catch {
      continue;
    }
  }
  if (alreadyPatched) {
    console.log("Vitest birpc timeout already at 180s — no changes needed");
  } else {
    console.warn(
      "Could not find birpc DEFAULT_TIMEOUT in any vitest chunk — " +
        "this is OK if vitest updated their internals. " +
        "The vitest.config.ts pool/timeout settings provide the primary protection."
    );
  }
}
