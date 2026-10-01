#!/usr/bin/env node
/**
 * IS THE SERVER I AM ABOUT TO TEST SERVING THE CODE I JUST WROTE?
 *
 * CLAUDE.md RULE Q: every test pass runs on a FRESH production build. Two ways it silently is not:
 *   • the server on the port is serving some OTHER build (a leftover `next start`, measured on 2026-09-25 —
 *     263 of 491 browser tests timed out against a stray server);
 *   • the build itself predates a source change (measured on 2026-09-26 — half a sweep ran on a build from
 *     before three fixes and had to be thrown away).
 * Both read exactly like product results, so this refuses to say "fresh" unless both are ruled out.
 *
 * Usage: node scripts/check-fresh-build.js [port=3100]   → exit 0 fresh · 1 stale · 2 no server
 */
const { readFileSync, statSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const http = require("node:http");

const root = join(__dirname, "..");
const port = Number(process.argv[2] ?? process.env.TEST_PORT ?? 3100);
let buildId;
// The build folder the server was started from — `.next`, or a second one beside it (NEXT_DIST_DIR, next.config.ts).
const dist = process.env.NEXT_DIST_DIR || ".next";
try { buildId = readFileSync(join(root, dist, "BUILD_ID"), "utf8").trim(); }
catch { console.error("NO BUILD: run `npx next build` first"); process.exit(1); }
const builtAt = statSync(join(root, dist, "BUILD_ID")).mtimeMs;

/** The newest source file under the app's code — anything edited after the build makes it stale. */
function newerThanBuild(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) newerThanBuild(p, out);
    else if (/\.(tsx?|css)$/.test(e.name) && statSync(p).mtimeMs > builtAt) out.push(p.slice(root.length + 1));
  }
  return out;
}
const changed = ["app", "components", "lib", "contexts"].flatMap((d) => { try { return newerThanBuild(join(root, d)); } catch { return []; } });

http.get({ host: "localhost", port, path: `/_next/static/${buildId}/_buildManifest.js`, timeout: 30000 }, (res) => {
  res.resume();
  if (res.statusCode !== 200) { console.error(`STALE SERVER: port ${port} is not serving build ${buildId} (HTTP ${res.statusCode})`); process.exit(1); }
  if (changed.length) { console.error(`STALE BUILD: source changed after build ${buildId}:\n  ${changed.slice(0, 5).join("\n  ")}`); process.exit(1); }
  console.log(`FRESH: port ${port} serves build ${buildId}, and no source is newer`);
}).on("error", () => { console.error(`NO SERVER on port ${port}: npx next start -p ${port}`); process.exit(2); });
