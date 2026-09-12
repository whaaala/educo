# Testing — how the gate runs, and why it is shaped this way

The short version lives in [CLAUDE.md](../CLAUDE.md) rule 15. This is the detail behind it.

## The gate

```
npm run typecheck     # tsc, web + mobile — zero errors
npx eslint .          # zero ERRORS (103 accepted exhaustive-deps warnings, see eslint.config.mjs)
npx vitest run        # 3158 unit/functional/integration tests
npm run test:fast     # builds, serves, runs all 344 browser tests
```

**Never run vitest and Playwright at the same time.** A 30s timeout under that load is contention, not a
failure — it has been misread as one more than once.

## `npm run test:fast`

`scripts/test-fast.js` does the whole thing: `next build`, `next start` on port 3100, every browser suite
against it, then stops the server and exits with the suites' code.

| | against `next dev` | against `next start` |
|---|---|---|
| `test:layout` (65 tests) | 5.4 min | **40s** |
| `test:invariants:rest` (279) | 7.4 min | **~1 min** |
| all 344 together | ~12.8 min | **1.4 min** |

Two things produced that, and only one of them is the server.

### 1. `next dev` compiles each route on first request

The builder page costs ~35s cold and ~5s warm, and every test that opens it pays. `next start` serves a route
that is already built in about 100ms. This is why the production build is now part of the gate at all — and
why a broken build is a gate failure rather than a deployment surprise.

### 2. The seeding race — the bigger half, and the one that looked like something else

Twenty specs each hand-rolled the same three steps: open the builder, write a site into `localStorage` with
`page.evaluate`, reload. That is a race. The builder saves a **starter document** the moment it mounts and
finds nothing stored, so the order matters:

- Against `next dev` the page is slow enough that it had always mounted before `goto` returned. The seed was
  written afterwards and won. Nobody knew there was a race.
- Against `next start` the load event fires first, so the order inverted: the seed landed, the app then
  mounted, read the storage it had queued *before* the seed existed, found nothing, and saved its starter
  over the top. Every test then waited for a box that was never going to appear.

Adding workers widens the same window on the dev server too — which is exactly why
`component-layout-invariants.spec.ts` and `interactions.spec.ts` had been forced `mode: "serial"`, with a
comment blaming the dev server's throughput. **That diagnosis was wrong, and forcing them serial hid the bug
for months.** Both now run in parallel.

`tests/e2e/helpers/seed-site.ts` closes it. `addInitScript` runs before the page's own scripts, so storage is
already populated the first time the builder looks — no window to lose, and no reload needed either.

**If a browser suite only fails under load, suspect a race, not the server.**

#### Generations, not a one-shot flag

An init script runs on every navigation and they accumulate, which pulls two ways: some specs reload to prove
that what the user did survives a refresh (re-seeding would wipe the state under test), and a few seed twice
in one test (the second must win). A plain "already seeded" flag satisfies the first and breaks the second —
it did, and the second seed silently measured the first site. So each call carries a generation and a script
acts only when its generation is higher than the last applied.

## Traps

- **`npm run dev` overwrites a build.** `next dev --turbopack` writes into the same `.next`, so starting the
  dev server after `next build` replaces it. `next start` then binds the port and answers *every* request
  with a 500 — "Expected to use Webpack bindings … referencing the Turbopack bindings". None of that reaches
  the test output; you see only pages that never rendered. `test-fast.js` detects it and rebuilds, and its
  readiness check treats a 5xx as a broken build rather than as "ready".
- **`.next/trace` is locked while the dev server runs**, so a build started beside it fails on the lock. That
  is the lock, not a broken build.
- **Route segment config is ignored in a `"use client"` page.** `export const dynamic = "force-dynamic"` in
  one compiles, ships, and does nothing — the route still reports as Static. Sixteen pages carried it as a
  supposed fix for a prerender error whose real cause was one shared component; the pages were never the
  problem. If a prerender error names a route, look at what the *layout* renders before touching the page.
- **`useSearchParams()` in a component used by every layout** takes every prerendered route down with it.
  Bound it with Suspense at the leaf that needs it — see `components/layout/Sidebar.tsx`.
- **Playwright's `locator.click()` scrolls the element into view first**, which fakes a page nudge in any test
  that measures scroll. Click through `el.click()` inside the page instead.
- **Playwright's mouse is rate-limited (~23 events/sec)**, so it cannot reproduce real drag lag. Drive those
  gestures with `dispatchEvent`.
- **Git checks this repo out with CRLF**, so any test reading source must `.replace(/\r\n/g, "\n")` at the
  point of reading. Guarded by `tests/unit/source-reading-tests.test.ts`.

## Where the lists live

`scripts/test-fast.js` (`INVARIANT_SPECS`) and `package.json` (`test:invariants:rest`) name the same suites
for the two runners. `tests/unit/test-scripts.test.ts` asserts they agree and that every named file exists —
a spec added to one and not the other silently stops running, and nothing else would say so.
