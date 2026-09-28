# UAT harness — the builder driven the way a user drives it

Headed Playwright scripts that build pages **through the UI** (RULE Y) — opening the blocks panel, dropping tiles
beside and under each other, filling stacks with real text and images — then drive every combination around a
change (RULE Q / RULE Z) and read the result. Run against the **fresh production build** on port 3100
(`npx next build && npx next start -p 3100`, then `node scripts/check-fresh-build.js` must print FRESH).

Run from the repo root with `NODE_PATH=node_modules` (the scripts `require('playwright')`).

| File | What it is |
|---|---|
| `h.js` | The shared helpers: `open` (real window size + position), `panel`, `clickTile`, `dropBeside`, `dropInto`, `select`, `dragEdge`, `rowOf`, `rowProblems` (holes, gaps, overflow), `fillStacks`, `fillImages`, `tree`. |
| `pages.js` | Builders for whole pages (`first`, `beside`, `under`, `into`, `row`, `grid`, `tileAfter`) and a few full landing pages. |
| `catalogue.js` | The benchmark page structures from `docs/LAYOUT_BENCHMARK.md` (simple → medium → complex), each built through the UI. |
| `structs.js`, `sweep.js` | Row/stack structures and the edge-resize sweep over them. |
| `pagesweep.js` | Every block on a catalogue page × every edge, float, move and pin. |
| `previewcheck.js` | Opens the real Preview at 375 / 768 / 1024 / 1280 / 1920: overflow, overlaps, canvas == preview, units, 150% text. |
| `inspectorpass.js` | Drives the Inspector controls on built pages. |
| `catbuild.js` | Builds one catalogue page and leaves it open to look at. |
| `uat43m.js` | The row-resize matrix (#43/#45/#47): structures × canvas sizes × real window sizes × edge × gesture × fresh/reload, six visible windows at once. `node scripts/uat/uat43m.js --all`. The template for any new matrix. |
| `uat78.js` | Rows of 4+ columns (#78): one row on desktop/laptop/wide, ≤3 per line on a tablet, stacked on a phone — canvas, a tablet drag and back, reload, Preview. |
| `img/` | Real photos used by `fillImages`. |

**Windows are real screen sizes** — the user's own screen is 1536×864 (a 1520×720 page). A window wider than the
screen hides the Inspector and masks bugs (it hid #49).

**The one accepted canvas ≠ Preview difference (#41):** a desktop scrollbar makes a block's share of the page differ by
~0.4%. Every Preview check allows `H.PREVIEW_SHARE_TOL` (0.6%) across and `H.PREVIEW_HEIGHT_TOL` (4px) down — never a
number of its own. More than that is a bug.

Label every run you report: `HEADED UAT` (this folder, visible windows) or `HEADLESS GATE` (the `tests/e2e` specs).
Only a HEADED UAT closes a ledger line.
