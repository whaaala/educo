#!/usr/bin/env node
/**
 * THE FAST GATE — the browser suites against a production build instead of the dev server.
 *
 * Which server these run against is the single biggest thing about how long they take. `next dev` compiles a
 * route the first time it is asked for, so the builder page costs ~35s cold and ~5s warm, and every test that
 * opens it pays again. `next start` has the routes already built, so the same page is served in ~100ms.
 *
 * Measured on this machine, desktop-chrome:
 *   `test:layout`          5.4 min  ->  40s
 *   `test:invariants:rest` 7.4 min  ->  ~3 min
 *
 * Most of that is the server, and the rest came from lifting the forced-serial mode the seeding race had made
 * look necessary — see `tests/e2e/helpers/seed-site.ts`.
 *
 * Usage:
 *   npm run test:fast                 build, serve, run every invariant suite, stop the server
 *   npm run test:fast -- --no-build   reuse the existing .next build (fine if nothing app-side changed)
 *   npm run test:fast -- tests/e2e/pager-hero.spec.ts        just these files
 *
 * A build cannot run while `next dev` holds `.next/trace`, so stop the dev server first — the build failing
 * with a file lock is that, not a broken build.
 */

const { spawn, spawnSync } = require("node:child_process");
const http = require("node:http");
const { existsSync } = require("node:fs");

const PORT = Number(process.env.TEST_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;
const isWindows = process.platform === "win32";
const npx = isWindows ? "npx.cmd" : "npx";
// Node 20 refuses to spawn a `.cmd` without a shell (EINVAL), so Windows needs one. The arguments here are
// all plain paths and flags with no spaces, so nothing is exposed to shell parsing.
const useShell = isWindows;

/**
 * The invariant suites, listed once.
 *
 * Kept here rather than duplicated from `test:invariants:rest` in package.json, because two copies of a list
 * like this drift and the drift is invisible — a spec quietly stops being run and nothing says so.
 * `tests/unit/test-scripts.test.ts` asserts the two agree.
 */
const INVARIANT_SPECS = [
  "tests/e2e/component-layout-invariants.spec.ts",
  "tests/e2e/export-layout-invariants.spec.ts",
  "tests/e2e/interactions.spec.ts",
  "tests/e2e/design-distinctness.spec.ts",
  "tests/e2e/alert-actions.spec.ts",
  "tests/e2e/multipage-preview.spec.ts",
  "tests/e2e/exported-site.spec.ts",
  "tests/e2e/layout-bands.spec.ts",
  "tests/e2e/advanced-css.spec.ts",
  "tests/e2e/export-fonts.spec.ts",
  "tests/e2e/image-intrinsic.spec.ts",
  "tests/e2e/item-effects.spec.ts",
  "tests/e2e/stacking.spec.ts",
  "tests/e2e/twelve-columns.spec.ts",
  "tests/e2e/grid-cell-resize.spec.ts",
  "tests/e2e/add-grid-in-grid.spec.ts",
  "tests/e2e/drag-grid-in.spec.ts",
  "tests/e2e/masonry.spec.ts",
  "tests/e2e/masonry-builder.spec.ts",
  "tests/e2e/spacing-gestures.spec.ts",
  "tests/e2e/photo-gallery.spec.ts",
  "tests/e2e/pager-hero.spec.ts",
  "tests/e2e/add-without-asking.spec.ts",
];

const argv = process.argv.slice(2);
const skipBuild = argv.includes("--no-build");
const specs = argv.filter((a) => !a.startsWith("--"));

/** Run a command to completion, inheriting stdio. Returns its exit code. */
function run(cmd, args, extraEnv = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...extraEnv }, shell: useShell });
  return r.status ?? 1;
}

/**
 * Resolve once the server answers WELL, or reject after `timeoutMs`.
 *
 * "Answers" is not enough. A `.next` that `next start` cannot serve still binds the port and replies 500 to
 * everything, so a readiness check that accepts any response hands the suites a dead server and lets every
 * test fail on its own wait — which says nothing about the real cause. A 5xx here is a broken build, and
 * saying so once beats hundreds of timeouts that do not.
 */
function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const poll = () => {
      const req = http.get(BASE_URL, (res) => {
        res.resume();
        if (res.statusCode < 500) resolve();
        else if (Date.now() > deadline) reject(new Error(`${BASE_URL} answers ${res.statusCode} — the build cannot be served. Run a clean \`next build\` (a dev server may have overwritten .next).`));
        else setTimeout(poll, 300);
      });
      req.on("error", () => {
        if (Date.now() > deadline) reject(new Error(`no server on ${BASE_URL} after ${timeoutMs}ms`));
        else setTimeout(poll, 300);
      });
    };
    poll();
  });
}

/**
 * Stop the server AND anything it started.
 *
 * `child.kill()` on Windows kills only the launcher, leaving the actual Next process holding the port — so the
 * next run finds it occupied and silently tests a stale build. `taskkill /T` takes the whole tree.
 */
function stop(child) {
  if (!child || child.exitCode !== null) return;
  if (isWindows) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  else child.kill("SIGTERM");
}

/**
 * Is `.next` the output of `next dev` rather than `next build`?
 *
 * `npm run dev` runs `next dev --turbopack`, and it writes into the SAME `.next` a build does — so starting
 * the dev server after a build silently replaces the build. `next start` then serves a hybrid and answers
 * every request with a 500: "Expected to use Webpack bindings ... referencing the Turbopack bindings". None of
 * that reaches the test output, which shows only a page that never rendered, so it reads as a product
 * regression or a flaky wait. It cost an afternoon once; the runner detects it now rather than trusting
 * `--no-build`.
 */
const devContaminated = () => existsSync(".next/server/chunks/ssr/[turbopack]_runtime.js");

(async () => {
  let build = !skipBuild;
  if (skipBuild && devContaminated()) {
    console.log("\n.next holds `next dev` (turbopack) output, which `next start` cannot serve — building anyway.");
    build = true;
  }
  if (build) {
    console.log("\n=== building (next build) ===");
    const code = run(npx, ["next", "build"]);
    if (code !== 0) { console.error("\nBuild failed — the suites would only test a stale .next."); process.exit(code); }
  }

  console.log(`\n=== serving the build on ${BASE_URL} ===`);
  const server = spawn(npx, ["next", "start", "-p", String(PORT)], { stdio: ["ignore", "pipe", "pipe"], shell: useShell });
  server.stdout.on("data", (b) => process.stdout.write(`[server] ${b}`));
  server.stderr.on("data", (b) => process.stderr.write(`[server] ${b}`));

  const bail = () => { stop(server); process.exit(130); };
  process.on("SIGINT", bail);
  process.on("SIGTERM", bail);

  try {
    await waitForServer();
  } catch (err) {
    console.error(String(err));
    stop(server);
    process.exit(1);
  }

  const target = specs.length
    ? ["playwright", "test", ...specs, "--project=desktop-chrome", "--workers=4"]
    : ["playwright", "test", "--project=desktop-chrome", "--workers=4", ...INVARIANT_SPECS];

  console.log("\n=== running the browser suites ===");
  const code = run(npx, target, { BASE_URL });

  stop(server);
  process.exit(code);
})();
