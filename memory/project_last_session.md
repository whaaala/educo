---
name: project_last_session
description: Where we left off — current task, last step, next steps (updated every session)
metadata:
  type: project
---

# Last Session State — Box Builder (`/website/box-demo`)

**Updated:** 2026-08-23

## Current focus
Building the unified recursive **Box Builder** (Framer/Webflow-style editor) at `app/website/box-demo/page.tsx`. Everything is a `BoxNode` (container flex/grid OR element). Core files:
- `components/website/box/BoxCanvas.tsx` — canvas/editor (drag, resize, toolbar, DnD)
- `components/website/box/BoxInspector.tsx` — right panel
- `lib/box-model.ts` — pure immutable tree ops + CSS mapping
- Tests: `tests/components/website/BoxCanvas.test.tsx` (23), `tests/unit/box-model.test.ts` (29)

## State = GREEN (safe checkpoint)
Full suite **134 files / 2112 tests pass**, `tsc --noEmit` clean, route `/website/box-demo` → 200. Working tree is in a consistent tested state (last completed edits all verified green). Nothing half-applied.

## What was just completed this session
1. **⋯ actions menu portaled** to `document.body` (fixed pos) so a narrow box never clips it (grip + ⋯ collapsed toolbar). Outside-click / scroll / resize closes it.
2. **Resize rebuilt on ONE model** — every box is TOP-LEFT anchored (`alignSelf: flex-start`) with pixel-exact margins so the grabbed edge moves and the opposite edge stays, no jump on grab. `measureBoxU()` resolves the live `--box-u` px so px↔stored-unit conversion is exact at any screen size. Cursor overlay (`resizeCursor` state + fixed portal) + `requestAnimationFrame` batching = smooth, cursor never disappears.
3. **`pxU` made SIGNED** (was clamped ≥0) — fixes "can't drag the left/top edge outward to the page edge" (margin could only grow, never shrink back to 0).
4. **Freeze-siblings on width resize** (replaced the old `width:"fill"` sibling-fill) — resizing a section in a row now moves ONLY its own edges; the neighbor is pinned to its current explicit width and doesn't move.
5. **Pointer drag-and-drop** (replaced native HTML5 DnD): floating preview + insertion line, reorder + reparent into any container. Drop position uses **geometry-based reading-order** (`slotFromKids` in BoxCanvas) — detects whether the target sits beside a sibling (row → vertical line, compare X) or is stacked (column/wrapped → horizontal line, compare Y), so drops land where the line shows even in the wrapping page row.

## ARCHITECTURE (v7, current): page = STACK of ROW BANDS
The page is now a **vertical column** whose direct children are all **row bands** (`rowBand: true`, a full-width `direction:row` container). Each row holds SECTIONS side-by-side. This replaced the old single-wrapping-row (where "rows" were implicit wrap-lines and drag-drop was fragile). Model helpers in `lib/box-model.ts`: `makeRowBand(children, gap)`, `normalizeRowBands(root, gap)` (wraps any bare section under root into its own full-width row; keeps existing rows; idempotent — run after every edit), `widthPct(token)`. `BoxNode.rowBand?: boolean`. `app/website/box-demo/page.tsx`: `pageRoot` = column, `makeRow` = makeRowBand, `KEY = educo_box_demo_v7`, `commit = setRoot(normalizeRowBands(next))` wired to BoxCanvas `onChange` and every edit. **Add section** fills the FIRST row with free space (used ≤88% → new section width = remaining), else a new full-width row. **DnD edge-band** (`computeDrop` in BoxCanvas) checks proximity only along the parent's MAIN axis: top/bottom of a ROW → new row above/below (drop into root column → normalize wraps); left/right of a SECTION → beside it in the row; center of a row → into the row's empty space (fills leftover via `slotFromKids` gap detection). Resize is edge-anchored + page-bounded (see [[feedback_edge_anchored_resize]]). All green: 134 files / 2116 tests, tsc clean, route 200.

## OLD NEXT STEP (superseded by v7 rows architecture)
**Bug:** two columns/sections side-by-side in the wrapping page row → resizing the 2nd (right) one makes it **wrap to a new line**. Cause: freeze-siblings + growing past the free space (and rounding pushing total >100%) triggers wrap.

**Planned fix (was about to edit `startResize` onMove in BoxCanvas.tsx ~line 324):** cap the resized width to the space available on the line so it can't overflow/wrap. Compute at grab (only when `parentRow`):
```js
let othersPx = 0;
for (const c of info.parent.children!) if (c.id !== id) othersPx += (document.querySelector(`[data-box-id="${c.id}"]`)?.getBoundingClientRect().width ?? 0);
const gapPx = parseFloat(getComputedStyle(pEl).columnGap || getComputedStyle(pEl).gap) || 0;
const n = info.parent.children!.length;
const selfMaxPx = Math.max(1, maxW - othersPx - (n - 1) * gapPx);
```
Then in onMove wrap widths: `const capW = (px) => parentRow ? Math.min(px, selfMaxPx) : px;` and use `pct(capW(W0 + dx))` / `pct(capW(W0 - dx))`. Verify existing tests still pass (row-child left-edge test: jsdom maxW=1, selfMaxPx=1, capW(-60)=-60 → clamps to 3% — unchanged). Then full suite + route.

## Design decisions locked in (from user)
- DnD: floating preview + insertion line; anything droppable into any container at any position.
- Resize: the grabbed edge moves, opposite stays; smooth; must reach the page edge.
- Resize should NOT move the neighbor (freeze) AND should NOT wrap (the cap above is the resolution).
- Units: width %, height vh, padding/margin/gap/font in rem-multiples of `--box-u = clamp(minRem, cqw, maxRem)` (WCAG).
- Test env quirk: running 1–2 test files sometimes reports "no tests" (resolver hiccup) — re-run with a third file.
- `dropIndexAmong` in box-model is now unused by the app but kept + unit-tested (harmless utility).
