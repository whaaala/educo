# The task tree

Everything any session has said it will do, as ONE tree — so moving between sessions and contexts loses nothing.
**Read it at the start of every session. Update it in the same change as the work, and before the session ends.**

## How to use it

- **Find "YOU ARE HERE"** — the one branch being worked on. Work in progress is one branch (RULE RK).
- **A promise goes in the tree the moment it is made** ("I will…", "next…", "after this…"), under its parent, with the
  date and where it was said. A task nobody wrote down is a task that is lost at the next session.
- **Nothing is deleted.** A finished branch is marked done with its commit or measurement; a dropped one is marked
  dropped with who decided and why.
- **A branch closes only when all its children are closed**, or the user has decided otherwise.
- **The bug ledger is a branch**, not a separate list: each open class hangs under the work that found it.
- **"New session" is the signal.** The moment the user says it, the session writes its entry in the **Session log** at
  the bottom — started from, got to, continue from — moves YOU ARE HERE, and commits. Before anything else.
- **It reminds the user too.** Every session opens by saying where we were and what is still open, and asks: continue
  there, or leave it? A branch is only left on the user's word, and the tree says so.

| Mark | Meaning |
|---|---|
| `[x]` | Done — with the commit, test or measurement that shows it |
| `[>]` | In progress — **YOU ARE HERE** marks the exact leaf |
| `[ ]` | Not started |
| `[?]` | Needs the user's decision — never decided alone |
| `[~]` | Parked or dropped — with who decided, and why |
| `[!]` | Status not verified — check before relying on it |

Last updated: **2026-10-02** (F-1 closed), session 1fc987ff, branch `builder/layout-uat`.

---

## BATCHES — one UAT pass per batch (RULE X, the user 2026-09-30)

One AREA per batch · **at most 6 changes** · **one batch `[>]` at a time**. New work is sorted here by the agent (same area
and room → the open batch; otherwise a queued batch for its area) and the reply says where it went. The checklist is
written BEFORE the pass; one HEADED UAT on a fresh production build ticks every line with what was seen; a batch is `[x]`
only when every line is ticked and every bug it found is fixed and re-checked. Guarded by
`tests/unit/task-tree-batches.test.ts`. Every item names what it IS in words, never a bare number.

- `[x]` **BATCH G-3b · The page as a real CSS grid** — CLOSED 2026-10-05 (FINAL HEADED UAT `scripts/uat/uat-g3b-headed.js`, waves of
  six windows on ONE fresh build: A–F 55 · G H I J1–J3 73 · J4–J6 K1–K3 84 · K4–K6 22 · L + M×4 (+B) 70 — all 0 failed; G-3's nested
  trees at three seeds, all 70 screens; regression G-3c 17/0 · G-3 65/0 · G-2 128/0; U8 saved pages: 59 pages of 59 saved sites, 41
  byte for byte and 18 differing ONLY by the empty-picture placeholder the user chose (G3b-12), 0 otherwise; gate: typecheck 0 ·
  eslint 0 errors · vitest 4,356 · test:fast 806 / 806) — REOPENED 2026-10-05 after G-3c closed; PARKED 2026-10-04 BY THE USER ("do the frame now": BATCH G-3c first, then
  back here for (3), (6) and the final pass; (1), (2), (4), (5) DONE and committed) — OPENED 2026-10-04 (session 3da81fad, the handover of 5da86722) (area: page
  grid · 6 changes). D5 as signed under R-4: a page-grid row is EMITTED as a CSS grid on the page's own lines, so blocks sit ON the
  drawn lines (closes G3-8) and "to the last line", bleed and rows become possible. Saved pages (no `pageGrid`) byte-identical.
  CHANGES:
  - `[x]` (1) A PAGE-GRID ROW IS A CSS GRID (DONE 2026-10-04, session 3da81fad — see DESIGN below; HEADED pass 1: G-3b A–F 55 + 22
    checks, G-3 suite 65/0 and G-2 suite 128/0 as regression; vitest 4,296; eslint 0 errors): `display: grid` with `gridTemplate(cols)` per rung, the gap as the grid's column gap,
    each block `grid-column: span k` from its share at that rung, the side space the first / last block's margin (`rowSide`)
    inside its columns — canvas == export, the fit rule's steps set spans, not flex bases; G3-8 measured ON the line
  - `[x]` (2) START LINE · "TO THE LAST LINE" · FULL · BLEED · HALF-BLEED per rung (map A1–A5, A15) — DONE: in the Size section
    "From line" / "To line" (one edge moves, the partner gives what it can, rule 19), "Whole line", "To the last line" (a share,
    so it survives 12 → 16 columns), "Bleed to the page edge: Off · Left · Right · Both" (where it starts / ends a line that side
    gives up its side space; nothing else moves), all per screen. Unit: 9 engine + 4 Inspector tests, 9 mutations red. HEADED
    slice H 9 / 9 (To line 0.00px, From line 0.01px, bleed −0.01px from the edge, Preview at all 70 screens, Undo, per screen,
    to the last line after 12 → 16)
  - `[x]` (3) ALT FREE → lines + margin, never page x / y (the drop point to the nearest lines, the rest as margin inside) — DONE
    2026-10-05 (session after 3da81fad; HEADED slice J1–J6, six windows, Desktop · Laptop · Wide · Tablet · Full · Mobile × the four
    editor themes: 108 checks 0 failed, Preview at all 70 screens after an Alt edge and after an Alt slide; gate: vitest 4,340,
    test:fast 806, eslint 0 errors): `freeInset` {left, right} (% of the block's OWN columns, per
    screen) replaces `freeWidth`; emitted as a `%` margin of its grid area beside the gap (`pageRowCells` insetL / insetR), so the
    columns stay ON the lines and the box keeps its share of them at every screen; the fit rule's stepped lines drop it (equal
    blocks). An Alt-dragged EDGE runs its columns out to the nearest line beyond it, the rest the free margin (the far side's margin
    rescaled so only the grabbed edge moves, rule 19; a snapped drag clears that side). An Alt-drag of a block of a page row
    SLIDES it along its line (`slideFreeAt`: between its neighbours, which never move — decision 5) instead of lifting it to page
    x / y; Alt on any other flow block still floats it. RULE UI: Size section "Free inside its columns (% of them)" Left / Right +
    "Back on the lines" (one undo). BDD: 5 scenarios in page-grid.feature. Unit: 6 engine + 1 Inspector; 7 mutations red
  - `[x]` (4) THE FIT RULE for every block on the grid (DONE with (1): every line of a page row steps, by span; HEADED: slice D,
    an icon beside words + four cards at all 70 screens × 100 / 150 / 200 % text — 0 sideways, overlap, broken word, staircase) (proof rule 4: whole words, no sideways scroll at 150 / 200 % text)
  - `[x]` (5) "SPACE BETWEEN COLUMNS" — DECIDED BY THE USER 2026-10-04 ("split across / down", over an extra gutter drawn between
    the guide columns, or dropping it): G-2's one "Gap between blocks" became "Space between columns" (across) and "Space between
    rows" (down), each Default or 0–4 rem with its own "Back to default"; a site that set the old gap keeps it in the direction not
    moved; stored as G-2 stored it while the two agree (`gap`), else `gapX` / `gapY`. Down is always "rows": a Row block's wrapped
    lines now follow it too (16 on a saved page either way). MEASURED: 61 saved sites byte for byte against `ea68dcf`; four
    mutations red; HEADED slice G 5 / 5 (across 11.8 → 27.8px with the stack unmoved, rows 0 → touching, Preview at all 70 screens,
    back to default, Undo) and G-2 slice D 10 / 10 with the new controls
  - `[x]` (6) ROWS AS GRID ROWS: "span N rows" (the user's: a gallery photo 2 rows tall, height still grows with its words) —
    plus the nested-tree check G-3's slice F started (the nested trees: in the final pass, U8) — DONE 2026-10-05: a block of a
    page row reuses the Grid block's `rowSpan` (rule A, one field), emitted `grid-row: span N`; `rowLinesAt` places a row that
    spans as the browser's grid auto-placement does (sparse), each line listing what occupies it (`cont`: spanning down into it),
    so the blocks beside a photo get the side space and gaps of the line they are drawn on; a row that spans nothing packs exactly
    as before. "From line" / "To line" / the Alt slide treat a block spanning beside them as a wall. Where the fit rule steps the
    row, the span goes (`grid-row:auto`) and the blocks that sat beside it go back to their own place (G3b-23). RULE UI: "Rows
    tall" in the Size section, per screen. HEADED slice K1–K6 (six windows, six devices × the four themes): 49 checks 0 failed,
    Preview at all 70 screens; gate: vitest 4,355 · test:fast 806 · eslint 0 errors. QUESTION FOR THE USER (not a defect, the
    behaviour before (6) too): on a phone, a block set to half the page that is alone on its line stays half the page — should
    the fit rule widen a lone block there as well?
  HEADED UAT CHECKLIST (written before the pass; six windows; fresh production build; built through the UI; Preview at all 70
  screens of `screens.js` at 100 / 150 / 200 % text; the editor's four themes; each state on / off; every entry point):
  - `[x]` U1 (FINAL PASS SEEN, 2026-10-05) (pass 1 SEEN after (1)+(4): slices A, C, F; re-run in the final pass) a half / third / quarter / 5 + 7 row on a page-grid page: every block edge ON a drawn line (≤ 0.5px) at every device,
    the first block's left side space inside column 1, the last's inside column 12; set to 0 → the page edge; canvas == Preview
  - `[x]` U2 (FINAL PASS SEEN, 2026-10-05) (pass 1 SEEN: slice B, G3-8 0.00px; re-run in the final pass) snap (G-3's U3 again, on the grid): the far edge fixed, the snapped edge ON the line at 1280 and 1536 (G3-8), Shift
    half-lines, Alt free; rule 19 at the width where the partner runs out; every rung after it
  - `[x]` U3 (FINAL PASS SEEN, 2026-10-05) (pass 1 SEEN: slice D; re-run in the final pass) the fit rule: 3 / 4 / 6 cards and long words step 4 → 2 → 1 (never a staircase) at every screen and 150 / 200 % text;
    no sideways scroll, no overlap, no word broken
  - `[x]` U4 (FINAL PASS SEEN, 2026-10-05) start line / to the last line / full / bleed / half-bleed: each per screen, each visibly different (RULE T), each
    survives a column-count change in the panel; Undo; reload
  - `[x]` U5 (FINAL PASS SEEN, 2026-10-05) (SEEN after (3): slice J1–J6, 108 / 0; re-run in the final pass) Alt-drop a block: it lands on lines + a margin; at every other screen it stays on its lines (no overlap, no scroll)
  - `[x]` U6 (FINAL PASS SEEN, 2026-10-05) "Space between columns" 0 / default / 4 rem: guides and blocks move together, canvas == Preview; Reset
  - `[x]` U7 (FINAL PASS SEEN, 2026-10-05) (SEEN after (6): slice K1–K6, 49 / 0; re-run in the final pass) "span 2 rows" on a gallery photo beside two short blocks: covers two rows, still grows with words; phone falls back
  - `[x]` U8 (FINAL PASS SEEN, 2026-10-05) a page saved before the page grid: Preview HTML byte-identical to before the batch; nested trees (section → Grid
    block → card → button, random values, built through the UI) at all 70 screens
  - `[x]` U9 (FINAL PASS SEEN, 2026-10-05) the four editor themes: every new control labelled, ≥ 4.5:1, keyboard reachable, announced
  DESIGN OF (1), from the code map (2026-10-04): the guides draw the page's columns GAPLESS, edge to edge — the space between two
  blocks is centred on a line. So a page row (`isPageRow`: a row band straight on a page-grid page, marked `pageRow` by
  `markPageGrid`) is `repeat(T, minmax(0, 1fr))` with no column gap over the page's whole width (no reach, no side padding); each
  block `span t` of its share, half a gap of margin each side, the side space on the block that starts / ends a line. T = the lcm
  of every screen's column count × the fewest splits that put every edge on a track (`rowTrackCount`): 4½ of 12 is 9 of 24,
  five equal cards 12 of 60 each — equal cards stay equal, and the SAME T on every screen lets the fit rule's container queries
  write `span T/across`. A gap dragged open (`marginLeftPct`) is a `%` margin of the block's AREA (gap + block). A grid never wraps a
  block that is too narrow, so (4) lands with (1): every line of a page row steps. Width-less blocks share their line equally. The
  site's own column counts reach the rows through `gridSpace.cols`. Canvas resize: the half gap is read off `--bx-gut`, a line's
  first / last block's slot reaches the side space (`slotSide`). AMENDED by the user's G3b-3 decision ("equal cards"): every
  block of a line gives up the same width of the line's side space and gaps (`pageRowSides`); the canvas's slot is that number
  (`pageRowSlot`). MEASURED: the 61 saved sites of the dressed sweeps publish byte
  for byte as before (old vs new engine, every page).
  LEDGER G-3b:
  - `[x]` G3b-25 · TEST (mine): U9's contrast check measured the wrong note (the first `role=note` on the page) against the wrong
    background, and read the editor's oklch() colours as if they were rgb() — 1.02–1.14:1 for words that read at 11–12:1. → the note
    of this change; the browser converts the colours (painted on white and black). Real ratios: 4.83–17.93:1 in all four themes
  - `[x]` G3b-26 · TEST (mine): slice L expected the picture beside a card ABOVE words with three blocks dropped at a third each —
    three thirds fit one line. → halves, set in the Size section as a person would
  - `[x]` G3b-27 · REAL, FOUND BY THE FINAL PASS (slice L, 150 / 200 % text on phones; MEASURED by probe-g3b-27.js): where the fit
    rule stacks a line, a block's readable floor (G3b-18) still subtracted the margins of its DESKTOP line (~37px) while it is drawn
    with the frame on both sides (64px at 200 %) — the box ran ~27px past the row's right edge (before G3b-18 it was worse: the floor
    ignored margins). → every stepped rule (and G3b-23's) re-sets the floor with the margins it draws (`floorWith`). Guard: each
    stepped rule's floor subtracts that rule's own margins, red without it; slice L at 150 / 200 % text, all 70 screens: 0 faults
  - `[x]` G3b-28 · REAL, MINE (G-3b (3)), FOUND BY THE FINAL PASS: the resize measured a drag from the block's COLUMNS (the line), not
    from the box edge the person holds — with a free margin on that side a second Alt drag moved the box 49.9px for a 16.3px drag, and
    a snapped drag aimed a free margin's width past the hand. → the drag starts at the hand. HEADED slice J step (1b), red on the old
    build (J1, J2), green on all six devices after; probe-g3b-28.js: the snapped edge lands on the line nearest the hand
  - `[x]` G3b-29 · TEST (mine): slice B aimed each screen's drags with half the VISIBLE gap, which after the previous screen's Alt
    step held the free margin too (65px / 62.5px "off the line" at Full width and Mobile — the product snapped to the line nearest
    the hand, as it should). → B undoes its Alt step before the next screen; a drag from a free margin is J's (1b)
  - `[x]` DECIDED BY THE USER 2026-10-05 ("yes to both your recommendations") → BATCH G-3d below. THE QUESTIONS WERE: (a) on a phone a block set to half the page that is alone on its line stays
    half the page (the behaviour before G-3b too) — should the fit rule widen a lone block there? (b) a picture inside a block that
    spans two rows keeps its own height (16.25rem), so the block covers the two rows but the picture does not fill it — should a
    picture fill the height of a block that spans rows?
  - `[x]` G3b-20 · REAL, FOUND BY READING THE CODE FOR (6), PRESENT SINCE G-3 (4): a Grid cell on a page-grid page showed TWO
    controls named "Rows tall" (its row span, and the page grid's minimum height) — one name, two meanings for a screen reader.
    → the height is "At least this many rows tall". Guard: exactly one "Rows tall", red when the name is put back
  - `[x]` G3b-21 · TEST (mine): the "never writes the photo's gap" guard slid the block all the way to the photo, where the leftover
    gap is 0 either way — it passed with the guard removed. → a shorter slide that leaves a column; red under the mutation
  - `[x]` G3b-22 · TEST (mine): slice K expected "Rows tall 1" at Full width to leave the Desktop alone — Full width edits the desktop
    layer by design (page.tsx `DEVICE_RUNG`). → Full width skips the per-screen step, like Desktop
  - `[x]` G3b-23 · REAL, MINE, SEEN IN THE HEADED SCREENSHOT (K-Mobile) — the measurements had passed: where the fit rule stacked the
    photo's line, the block that had sat beside it kept the side space of "beside the photo", its words 10px INSIDE the frame on
    the canvas and 5.9px from the page edge in the Preview at 320–599. → in the same container query, the other blocks of the row go
    back to where they are without the span. Guard red without it; slice K's new checks were RED on the old build (all six
    windows' Previews) and green after: every stacked block starts on the frame (16.0px)
  - `[x]` G3b-24 · REAL, SEEN IN THE SAME SCREENSHOT, PRESENT SINCE G-3b (4): on a screen where the fit rule steps a row, the Size
    section said "Columns 3 of 6 · lines 1–4" beside a block drawn 6 of 6 — the panel disagreed with the canvas. → `fitStepAt`:
    the section says "On this screen the row steps down to fit: this block is drawn on a line of its own / N across. Set its lines
    here and your setting wins." 3 mutations red; HEADED: the note on Mobile, none on the five wider devices
  - `[x]` G3b-16 · REAL, MINE, FOUND BY THE HEADED PASS (slice J6, Mobile): an Alt SLIDE of a block that ends its line freed the rest
    of that line, and the next line's picture came up beside it (moved 177px) — a slide re-packed the row; the mirror case (a later
    line's first block slid left could fit on the line above) the same. → when the lines would change, its columns keep covering
    their old place too, the box still where it was let go (`slideFreeAt`). Unit guard both ways, red without the fix; HEADED J6
    0.00 / 0.00 after
  - `[x]` G3b-17 · SEEN IN THE HEADED PASS (J6 screenshot): a picture beside the slid block ran ~5px past the page's right frame on the
    canvas. MEASURED (probe-g3b-17b.js, through the UI): the same root cause as G3b-18 — a 3-of-6 area on a phone (187px) under a
    224px floor. After the fix, words 3 + picture / card / text 3 of 6 on Mobile and 6 + 6 on Tablet sit inside the frame by
    exactly the frame (16.0px), one gap apart
  - `[x]` G3b-18 · REAL, FOUND BY MY PROBE, PRESENT SINCE G-3b (1)/(2): words set to 2 of 6 on a phone ran 22px past their columns,
    10px OVER the picture beside them — the readable floor `min(100%, 14rem)` on a grid item is of the whole grid AREA, margins
    included. → `min(calc(100% - margins), 14rem)` on a block of a page row (a line too tight for words stays the Page check's
    warning). Unit guard red without it; HEADED: words end 393.6, picture starts 405.4 (one gap)
  - `[x]` G3b-19 · REAL, MINE, CAUGHT BY THE GATE (width-round-trip, the first block's left edge round trip): an Alt edge dragged past
    the page's edge left the overshoot (35px) as a free margin. → the pointer is held to the row before the margin is measured.
    Spec 7 / 7 and test:fast 806 / 806; HEADED slice J step (4b) at all six devices: From line 1 · left 0 %
  - `[x]` G3b-15 · REAL, MINE, FOUND BY ITS OWN UNIT GUARD: a second Alt slide read its box at 1.99955 columns (shares are stored to
    0.01 %) and floored it to the line BEFORE — the block jumped a column, and a 0.03 % margin was left where it landed on a line.
    → within a hundredth of a column is ON the line (`slideFreeAt` e = 0.01). Guard: "a second slide starts from where the first
    left it", red with e = 1e-6
  - `[x]` G3b-9 · REAL, FOUND BY THE HEADED PASS: the new "Full width" button had the same name as the toolbar's "Full width"
    device button — two different buttons, one name for a screen reader → "Whole line"; guarded (no Inspector button is named
    "Full width")
  - `[x]` G3b-10 · TEST (mine): the per-screen check compared with the page's first state, which four Undos do not return to → the
    state just before the Mobile change
  - `[x]` G3b-11 · REAL, FOUND BY THE HEADED PASS, DECIDED BY THE USER ("your setting wins"): on a phone "To line" changed nothing you
    could see — the fit rule's container queries (`!important`) kept the row stacked. → a row with a width or gap set for a screen
    leaves that screen out of its fit rule (`onlyOn`: media ranges in the export, the shown screen on the canvas); Page check warns
    "words-too-tight" when a WORD would not fit there. HEADED: Mobile 633.4 → 478.1, Desktop unchanged
  - `[x]` G3b-12 · REAL, FOUND BY THE USER FIRST ("are you sure the item added in the canvas is actually showing?"), DECIDED BY THE
    USER ("same box, soft placeholder"): an Image with no picture published NOTHING — 0px in the Preview, 368 × 159 on the canvas,
    everything below moved up. → the same box, a tint of the theme's muted colour with a picture icon, `role=img` "Picture to come";
    Page check lists "picture-missing" (not blocking). MY UAT HAD THE SAME BLIND SPOT (it measured boxes, never whether a block was
    shown) → NEW slice I: every palette block added through the UI is shown in the Preview at all 70 screens, with its words, at
    the canvas's height at 1280 — passed for all 18 tiles (27 blocks). NOTE: a saved page with an empty picture now publishes the
    placeholder (the user's decision), so its HTML changes there and only there
  - `[x]` G3b-13 · TEST (mine): "and not when they fit" never reached the comparison (no width set for phones) — and once it did, it
    found MY check warned on two "Fees" columns: it used the fit rule's 14 rem readable floor, which breaks no word → the words
    themselves at the size they have there; 6 mutations red
  - `[x]` G3b-14 · TEST (mine): "To line 5" at Mobile was where the block already ended (66.67 % of 6) → line 4
  - `[x]` G3b-8 · FOUND BY THE USER FIRST (2026-10-04, mid-batch): "it doesn't seem that there's a bottom" — MEASURED through the UI
    (probe-g3b-bottom.js): the page has side space but nothing of its own at its top or bottom; the cards ended 1 rem (the last
    section's own space) above the page's edge, ~11px at the 61% fit. Not G-3b's (the flex rows were the same). DECIDED BY THE USER:
    the page keeps the side space at its top and bottom too, and that frame is smaller — 1 rem on a phone growing to ~1.25 rem
    wide (today 1 → 1.6 → 2 rem). G-3b holds its 6 changes, so → QUEUED BATCH G-3c below
  - `[x]` G3-8 · REAL, carried from G-3 by the user: a snapped edge lands 1.7–2.6px from the drawn line at 1280 (shares are of the
    row inset by its side space; the guides run edge to edge) → change (1). HEADED (slice B): the snapped gap of two blocks lands
    0.00px from line 5 at Desktop and Full width and line 2 at Mobile; Shift 0.00px from the half-line; Alt kept free (23–27px)
  - `[x]` G3b-1 · TEST (mine): the "an icon / picture beside words steps" guard used a picture, which `holdsWords` already counts as
    words — green with the change undone → an icon beside words; red under mutation
  - `[x]` G3b-2 · TEST (mine): the "the row is the page's width, no reach" guard passed the band as its own parent, so the reach code
    never ran — green with the change undone → the page as the parent; red under mutation
  - `[x]` G3b-3 · REAL, FOUND IN THE HEADED PASS (slice C), DECIDED BY THE USER 2026-10-04 — "Equal cards" (over "exactly on the
    lines" and "columns inside the side space"): with every gap centred on its line, the outer cards of a row gave up the side space
    and the inner only half a gap — five cards 134.3 / 144.3 / … at Desktop, 220 / 237 in the Preview at 1280. On edge-to-edge
    lines both cannot hold unless side = half a gap. → every block of a line gives up the same width (`pageRowSides`). MEASURED:
    cards equal to 0.0px at every device and all 70 Preview screens; two blocks still 0.00px on their line; in a row of three the
    gaps sit exactly where the decided geometry puts them, (side − ½ gap) × |1 − 2(i+1)/n| — 3.4–4.3px at 768–1920 (I told the
    user "~2px" when asking: that was G-3's two-block figure, corrected in the reply). Guard: "%i equal blocks give up the same
    width" (2–6), red when the old rule is put back
  - `[x]` G3b-4 · TEST (mine): slice A at Mobile reported "no pairs side by side" as a failure — the fit rule had stacked the row,
    which is right → a stacked line is checked to span side space to side space
  - `[x]` G3b-5 · NOT A BUG, MEASURED (probe-g3b-five.js): the Preview's five cards looked side by side only at 810–900 — they are
    side by side at every width from 850 to 1536 and one a line below; the report listed only its first six widths
  - `[x]` G3b-6 · TEST, CAUGHT BY THE GATE (`width-round-trip.spec.ts`, 7 of 806): its `rowOf` measured a column's slot with the
    flex band's reach (`hg`), which a grid row does not have — boxes read as slots, the gap as 0. MEASURED first (probe-g3b-wrap.js,
    built through the UI): the stored widths and the drawn rows after every widen / narrow are the flex row's (91.66 / 8.33, wrap,
    back) — the engine was right. → a grid row's slot is its GRID AREA (box + its margins, minus a gap dragged open, read from its
    `calc(N% + …)`). 28 / 28 on all four device projects; RED against a build with the first block's dragged gap dropped
  - `[x]` G3b-7a · TEST, FOUND BY THE GATE (`canvas-scale-parity`, an FAQ's Accordion 546 drawn / 532 published): flaky on the LAST
    COMMIT's engine too (4 of 10 under load), so not G-3b's — still a bug (rule 8). MEASURED (a probe, 12 runs × 6 workers): the
    Preview draws in the fallback font until it has fetched the school's (`embedFontCss`), and under load that fetch was slow, so the
    spec compared a fallback-font Preview with a DM Sans canvas; with its font in, the Preview draws 546 too. (First guessed "read
    too early" and "the measuring pass" — both measured, both wrong.) → measured once the Accordion's own family is loaded in that
    document and a second of equal readings. 112 / 112 at 8 repeats × 6 workers; the assertions themselves unchanged
  - `[x]` G3b-7b · TEST, FOUND BY THE GATE (`pinned-bar-anchors`, an in-page link in the Preview "scrolled 0"): 1 of 5 under load on the
    last commit's engine. The Preview wires its link handler on each load of its document; a click before that did nothing → wait for
    the document, then click until the page moves (a Preview whose handler is gone never moves, and still fails). In the 112 / 112 above
- `[x]` **BATCH G-3c · The page's frame** — CLOSED 2026-10-05 (HEADED UAT `scripts/uat/uat-g3c-headed.js`, six windows, 17 checks 0 failed
  (`logs/g3c-uat8.out`), Preview at all 70 screens at 100 / 150 / 200 % text; regression G-3b 71/0, G-3 65/0, G-2 128/0; gate: typecheck 0 · eslint 0 errors · vitest 4,331 · test:fast 805/806 — the one, add-without-asking 'NO space below', pinned the old rule (G3c-12): updated, then 15/15 on the gate's project)
  — OPENED 2026-10-04 BY THE USER ("do the frame now", G-3b parked; the user's decisions on
  G3b-8; seen by the user in the Preview: "the right margin… is not there… do the same for the bottom, the right, the left… one rem")
  (area: page grid · 2 changes).
  DESIGN: a single number of the fluid unit cannot be 1 rem on a phone and ~1.25 rem wide (the unit doubles), so the frame is its
  own length, from ONE emitter: `clamp(1rem, <the fluid unit × k>, 1.25rem)` by default, the site's set value as set (0 included) —
  for the page's top and bottom, a lone section's sides and a row's outer blocks; the canvas measures a row's slots from the drawn
  margins. A coloured first / last section still bleeds (no frame on that side).
  HEADED UAT CHECKLIST (written before the change; six windows; fresh production build; built through the UI; Preview at all 70
  screens at 100 / 150 / 200 % text; the editor's four themes):
  - `[x]` F1 (SEEN: canvas Mobile 16 · Tablet 16 · Laptop 16.19 · Desktop 18.24 · Wide 20px, each = top, bottom, left, right, the last
    section the row of cards — the user's report; Preview all 70 screens) every page edge — top, bottom, left, right — keeps the frame: 1 rem (±0.5px) at 360, ~1.14 rem at 1280, 1.25 rem at
    1920, canvas == Preview, for: a lone heading, a row of cards, a picture, a component, the last block of the page
  - `[x]` F2 (SEEN: top 0, its words 27.4px inside; Preview all 70) a coloured first / last section still reaches the page edge; its words keep the frame inside it
  - `[x]` F3 (SEEN: all four 0, back to 18.24; label "Default · 1–1.25rem") "Side space" in the page-grid panel moves all four sides together, down to 0 (words at the edge) and back to default
  - `[x]` F4 (SEEN: left 0, right 18.25, cards 407.7 × 3) a block's own outer spacing / bleed still overrides the frame on its side; equal cards stay equal
  - `[x]` F5 (SEEN: 24 / 32px wide pages — the 1 rem floor, the cqw part does not grow with text; no sideways) 150 % / 200 % text: the frame grows with the reader's text size (rem), no sideways scroll
  - `[x]` F6 (SEEN: G-3b 71/0, G-3 65/0, G-2 128/0; saved pages: no frame without `pageGrid`, unit-guarded) regression: G-2, G-3 and G-3b suites; a page saved before the page grid byte-identical
  LEDGER G-3c:
  - `[x]` G3c-1 · REAL (found doing G-3c): the page-grid panel turned spacing values into rem as if they were pixels (value / 16) —
    the old default 23 read "1.44rem" while it ran 1 → 2 rem; the gaps the same → each label says phone → wide (`remRange`), the
    frame "Default · 1–1.25rem". Mutation red; HEADED: the panel reads it (slice C)
  - `[x]` G3c-2 · REAL (caught by a new unit test): a Card or Button at the page's end counted as a bleeding section, so the bottom
    frame was dropped — the user's very report → only a coloured section or a picture bleeds; red under mutation
  - `[x]` G3c-3 … G3c-8 · TEST (mine): the headed script measured the white below a short page (the page fills the window), divided
    unzoomed padding by the zoom (twice), ran its oracle with the cqw part growing with text, took the button's band as the last
    section (the cards were), and read G-3b's slice H before its first layout settled under nine windows' load
  - `[x]` G3c-9 · TEST: G-3's U2 expected the old default "1.44" → the frame, "1"
  - `[x]` G3c-10 · REAL, app-wide (found by the regression), DECIDED BY THE USER ("phone → wide range"): every fluid slider in the
    Inspector said "value ÷ 16 rem" — "Text size 1rem" is 0.7 rem on a phone, 1.4 wide → `fluidRemRange`, one helper for the
    Inspector and the panel (Band height stays real rem: it is stored as px); 3 mutations red; HEADED: 5 ranges, no "1rem"
  - `[x]` G3c-11 · REAL (found by the headed pass): "Back to default" disabled itself, focus fell to the page and Escape no longer closed
    the Page grid panel, which stayed over the canvas (keyboard users too) → Escape on the page closes it when focus is on the body;
    2 mutations red; HEADED slice C passes through it
  - `[x]` G3c-12 · TEST, CAUGHT BY THE GATE: add-without-asking "adding a block leaves NO space below it" pinned the rule before the user's
    bottom frame. Its purpose — no dead space nobody chose and nothing removes (a hidden 160px page floor) — stands → the space below
    the last block is EXACTLY the page's bottom frame (Side space takes it to 0); 15/15 on the gate's project
  - `[~]` G3c-13 · REAL, FOUND WHILE MEASURING G3c-12, DEFERRED BY THE USER (2026-10-05, "own batch after G-3b"): 7 editor tests fail on
    the tablet and phone projects, and did already on f4bacbc, before G-3c (measured: same 7 on both builds) — the gate runs desktop
    only, so nobody saw them → QUEUED BATCH E-1 below

  - `[x]` (1) THE FRAME ALL ROUND — DONE (HEADED F1–F4, below): `frameCss` / `FRAME_CSS` the one emitter (a lone section's
    sides, a component's outer sides, a band's inset, a row's outer blocks — its equal shares now CSS of the frame —, the guides' strip,
    and `pageFrameEnds`: the page's top and bottom unless the first / last section is coloured or a picture); `frameRemAt` /
    `rowSideRemAt` for the arithmetic (fit rule, canvas slots at the page's width). Unit + component 4,304 green.
    WAS: a page-grid page keeps its side space at its top and bottom too — the same value, one "Side space"
    control (renamed "Space around the page"?), changeable to 0; a coloured first / last section still bleeds to the edge; saved
    pages byte-identical
  - `[x]` (2) A SMALLER DEFAULT — DONE (MEASURED: 16px at Mobile / Tablet, 16.19 at Laptop, 18.24 at Desktop, 20 at Wide) (`clamp(1rem, 1.6 × the fluid unit, 1.25rem)`, SPACE_GRID.gutter 23 → 16 in the arithmetic). WAS: 1 rem on a 360 phone (the page audit's floor) growing gently to ~1.25 rem on wide screens (today
    23 units: 1 → 1.6 → 2 rem), in rem with a fluid term (rule 16); the audit's floor unchanged
- `[x]` **BATCH E-1 · The editor on tablets and phones** — CLOSED 2026-10-05 (HEADED UAT `scripts/uat/uat-e1-headed.js`, six windows:
  tablet landscape · tablet portrait · phone × the four editor themes, touch on, built through the UI, Preview at all 70 screens —
  88 checks 0 failed; gate: typecheck 0 · eslint 0 errors · vitest 4,358 · test:fast 806 / 806) — OPENED 2026-10-05 after G-3b closed; QUEUED 2026-10-05 by the user (G3c-13) (area: the editor at small
  viewports · 2 changes). Opens after G-3b closes.
  - `[x]` (1) (DONE: all four were the spec assuming the desktop — E1-1 … E1-4; the headed pass found and fixed E1-7, E1-8, E1-9) the 7 that fail on tablet-landscape / tablet-portrait / mobile-chrome (`add-without-asking.spec.ts`: an empty page's floor,
    a Stack's four looks, "Full screen" on an empty section, "Add a block inside" nesting — the same 7 on f4bacbc): measure each,
    fix, guard
  - `[x]` (2) DONE in BATCH E-4 change (3), 2026-10-06 (`test:fast` runs all four projects: 3,272 / 3,272) — MOVED TO BATCH E-4 by the user's decision (E1-5, "split by area": it switches on when the 70 are green) — the gate runs the tablet and phone projects too (`scripts/test-fast.js` runs `--project=desktop-chrome` only), so a
    small-screen fault cannot hide again
  HEADED UAT CHECKLIST (written before the pass; six windows; fresh production build; built through the UI, the way a person does
  on each screen: tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, touch on; the four editor themes):
  - `[x]` E1 (SEEN 2026-10-05, 88 / 0) an empty page is a box you can aim at (the floor) and a first block dropped into it lands — at each size
  - `[x]` E2 (SEEN 2026-10-05, 88 / 0) a Stack's four looks: tap the block, open the Inspector from its tab, the four live previews are there and apply
  - `[x]` E3 (SEEN 2026-10-05, 88 / 0) "Full screen" on an empty section from the opened Inspector makes it one screen tall; Undo
  - `[x]` E4 (SEEN 2026-10-05, 88 / 0) a block added from the palette is a sibling; "Add a block inside" in the Inspector nests; the toolbar "+" menu nests too
  - `[x]` E5 (SEEN 2026-10-05, 88 / 0) the Inspector's tab is labelled, keyboard-reachable, 4.5:1 in all four themes; Escape closes it on a narrow screen
  LEDGER E-1:
  - `[x]` E1-1 · TEST, MEASURED (probe-e1.js): "an empty page's floor" read 82px on a tablet held sideways — the blocks panel docks at
    1024px and the page is shown shrunk to fit (#55/#57), the 160px floor drawn at ~0.51. The spec measured screen px, its neighbour
    page px → page px. HEADLESS 60 / 60 on all four projects; closes on the headed pass (E1)
  - `[x]` E1-2 · TEST, MEASURED: "a Stack's four looks" — under 64em the Inspector starts as its tab by design (5345e80: the canvas keeps
    the screen; Escape closes it), so the presets were never on screen; the spec assumed the docked panel → it opens the tab as a
    person does (E2)
  - `[x]` E1-3 · TEST, MEASURED: "Add a block inside still nests" — with the Inspector closed, the first match of /Add a block inside/
    was the block toolbar's "+" ("…inside this one"), which opens a menu to choose from, so nothing nested yet → the Inspector's
    own button, by its exact name (E4)
  - `[x]` E1-4 · TEST, MEASURED: "Full screen on an empty section" — the same closed Inspector (E3)
  - `[x]` E1-5 · DECIDED BY THE USER 2026-10-05 ("split by area"): E-1 closes with (1) and its headed pass; the 70 are QUEUED
    BATCHES E-2 / E-3 / E-4 below; (2) switches on when E-4 closes. MEASURED FOR (2) (HEADLESS GATE, `logs/e1-smallscreens.out`): the gate's 76 browser specs on tablet-landscape /
    tablet-portrait / mobile-chrome — 2,348 passed, 70 FAILED in 14 specs: grid-cell-resize 13 · spacing-gestures 12 · masonry-builder
    10 · vertical-edges-anchored 7 · side-by-side-resize 6 · multipage-preview 5 · stack-under-column 4 · canvas-zoom 3 ·
    chrome-follows-resize 3 · float-round-trip 3 · component-layout-invariants 1 · dropped-block-fills-space 1 · pager-hero 1 ·
    text-is-reachable 1. Each is either a spec that assumes the desktop (as E1-1 … E1-4 were) or a real small-screen bug — not yet
    measured one by one. (2) cannot switch on until they are green, and they are more than one batch (RULE X, ≤ 6). PROPOSED, for the
    user to decide: E-1 closes with (1) and its headed pass; the 70 become queued batches by area — E-2 resizing and dropping on small
    screens (grid-cell, vertical edges, side by side, stack under column, float, drop fills, chrome follows: 37), E-3 the Inspector's
    controls on a narrow screen (spacing, masonry, text reachable, canvas zoom: 26), E-4 Preview and components on small screens
    (multipage preview, pager, component invariants: 7) — and (2) switches on in E-4's close, when all are green
  - `[x]` E1-7 · REAL, FOUND BY THE HEADED PASS (E5, Light): the word "INSPECTOR" on the closed panel's tab read 2.6:1 (gray-400) — the
    word that tells a tablet or phone user where the panel went. → gray-600 with dark / midnight / purple variants: 7.56 · 11.45 ·
    12.02 · 11.65:1. Guard: the headed E5 contrast check, red before, green after
  - `[x]` E1-8 · REAL, SEEN IN THE HEADED SCREENSHOT (phone, Midnight) — every check had passed: with the Inspector opened over the
    canvas on a narrow screen, the selected block's handles, resize bars and toolbar and the blocks launcher were drawn ACROSS it
    ("diting: Stack", the toolbar over "Styles") — the drawer sat at z-40 under the chrome ladder's 9200–9400. → a `drawer` tier (9450)
    on the ladder (`lib/educo-ui/stacking.ts`, its order unit-guarded). HEADED: the new check was RED on all four narrow windows of the
    old build and green after
  - `[x]` E1-9 · REAL, MINE, CAUGHT BY THE NEXT HEADED PASS (tablet landscape, Purple Dream): E1-8's z-index, written inline, stayed on
    the DOCKED Inspector (a flex item honours z-index even when static) and covered the header's theme menu — the step timed out. → the
    drawer's tier as a class fed by a CSS variable, so `lg:z-auto` still wins when docked. HEADED check: the theme menu opens over the
    docked Inspector and takes the click, both docked windows
  - `[x]` E1-6 · REAL, MINE, FOUND WHILE EDITING THE TREE: adding E-1's checklist dropped BATCH G-3's header line (my edit's text ended
    on it and did not put it back), so G-3's closed record ran on after E1-5 — committed in e69d4e3 and missed by the tree's guard. →
    the header restored; the guard now also fails when a batch the tree names has no header of its own (red on e69d4e3's tree)
- `[x]` **BATCH D-2 · The documentation site, and the layout documented from the beginning** — CLOSED 2026-10-05
  (HEADED UAT: 375/768/1280/1536 light and dark and 200% text, all pass — no sideways scroll, no overflow, layout holds, contrast ≥4.5:1 in
  both themes; `npm run docs:build` 0 errors; docs-guard 3/3; vitest 187/187 including docs-guard, batches, rules)
  — QUEUED 2026-10-05 by the user (FIRST on `builder/page-grid`, before G-3d). (area: documentation · 6 changes):
  - `[x]` (1) THE SITE: `docs-site/` DONE — Docusaurus 3.10.2 "classic", `package.json`; docs plugin reads `docs/guide/` (single source);
    hand-written sidebar (Layout → story/reference, Website Builder); `npm run docs:build` / `docs:start`; blog removed; `src/pages/` removed
  - `[x]` (2) CLEAN TO READ DONE (MEASURED, HEADED): Inter from Google Fonts; Educo blue (`#2563eb` light · `#60a5fa` dark); slate-900
    dark bg; light ≥4.6:1 · dark ≥6.0:1; checked at 375/768/1280/1536 and 200% text. THEN THE USER'S LOOK AT IT (2026-10-05): "the font
    is too large" → body 0.9375rem (15px — the user's call, below RULE DOCS' 16px floor; readers still enlarge it, 200% text holds);
    headings fluid `clamp()` (h1 1.5→1.875rem · h2 1.125→1.375rem); line-height 1.75 and more paragraph/list space ("more space between
    the lines… cleaner"); tables rounded with a header row and row hover; admonitions (`:::tip/info/warning/danger`) as coloured cards
    in light and dark; images rounded and responsive; code blocks rounded
  - `[x]` (3) THE INVENTORY DONE: README.md = internal, excluded; layout-story.md → Layout/story; layout-reference.md → Layout/reference
    (new); website-builder.md → Website Builder; every file listed with where it goes
  - `[x]` (4) THE LAYOUT, FROM THE BEGINNING, EVERY SINGLE THING DONE — `docs/guide/layout-story.md` rewritten: §1–§11 covering blocks/bands,
    row/stack/grid, sidebar, sizing (rule 19), hiding per device, space by default, the full page-grid story (what you see · columns per
    screen · the guides · snapping · Shift-snap · Alt-drag · From/To line · Whole line · To the last line · Bleed · Space between cols/rows ·
    Rows tall · The frame · How a row steps on a phone · Nothing left empty that nobody chose · Pages saved before the grid), text/space,
    colour, small things, publishing, the editor on tablets and phones
  - `[x]` (5) THE LAYOUT REFERENCE DONE — `docs/guide/layout-reference.md` (new): top bar · blocks panel · block toolbar · Inspector (Design:
    Arrange, Size, Placement, Meaning, Spacing, Background, Shadow/Border/Radius; Content; Per-device) · Page grid panel · keyboard shortcuts ·
    how controls change per screen — every control by its exact panel name
  - `[x]` (6) KEPT TRUE FROM NOW ON DONE — `tests/unit/docs-guard.test.ts` (3 tests: front matter · sidebar references exist · no broken relative
    links); `npm run docs:build` passes (0 errors); RULE DOCS in CLAUDE.md already names `docs:build` in the gate
  LEDGER D-2:
  - `[x]` D2-1 · REAL (mine, guard): sidebar `'Layout'` label was matched as a doc ID by too-broad regex → filter to lowercase-hyphen IDs only; 3/3 green
  - `[x]` D2-2 · REAL (mine): scaffold's `src/pages/index.js` linked to `/docs/intro` (not found) → removed `src/pages/` since docs serve at `/`
  - `[x]` D2-3 · REAL (mine): `onBrokenMarkdownLinks: 'warn'` deprecated in v4 → removed (default behaviour unchanged)
  - `[x]` D2-4 · REAL (FOUND BY THE USER — my headed pass passed it): body text too large at 1536 wide → 15px, headings scaled down
  - `[x]` D2-5 · REAL (FOUND BY THE USER): `.markdown { max-width: 72ch }` left a wide blank band between the text and the right-hand
    contents column → removed; the column between the two sidebars already bounds the line length
  - `[x]` D2-7 · REAL (FOUND BY THE USER's question "it should be based on the browser font… WCAG"): Docusaurus's theme sets
    `font-size: 15px` on the phone menu's "Back to main menu" and the collapsible "On this page" list — they ignored the reader's
    browser text size → overridden in rem. MEASURED HEADED with Chrome's real font-size preference at 12 / 16 / 24: every text
    measured (root, body, h1, h2, sidebar, contents, tables, both phone controls) scales ×0.75 / ×1 / ×1.5; no sideways scroll at 375
  - `[x]` D2-6 · A PROMISE, NOT A DEFECT (the user, 2026-10-05: "I should include images… examples… more playful"): MOVED to BATCH
    D-3 change (1) — screenshots from the real builder in the layout story and reference (RULE DOCS)
- `[x]` **BATCH D-3 · The rest of the documentation rewritten** — CLOSED 2026-10-06 (change (1) `dfb0c36`; change (2): W1–W8 SEEN, ledger
  D3-33 … D3-51 closed, HEADED docs 36 / 0 at all 70 screens; gate: typecheck 0 · eslint 0 errors · vitest 4,375 · test:fast 807) — QUEUED
  2026-10-05 by the user (after D-2) (area: documentation):
  - `[x]` (1) PICTURES AND EXAMPLES IN THE LAYOUT PAGES (from D2-6): screenshots taken from the real builder, built through the UI
    (RULE Y), for each scenario of the story and the main panels of the reference; `:::tip` callouts where a scenario has a trick —
    DONE 2026-10-06: 19 pictures in `docs/guide/img/` (`scripts/uat/docs-shots-headed.js`, seven slices in headed windows), 13 in the
    story and 7 in the reference, each a link to itself (tap → full size), 4 tips; the reference's tables rewritten against the code
  - **D-3 HEADED CHECKLIST** (written 2026-10-06 before the pass; the shots by `scripts/uat/docs-shots-headed.js`, six windows,
    fresh `next build` on 3100; the site by `docs:start` on 4000):
    - `[x]` V1 every scenario of the story has a picture BUILT THROUGH THE UI: §1 the three shapes · §2 photo beside words (canvas
      desktop + Preview phone) · §3 three cards (canvas + Preview phone) · §4 sidebar (canvas + Preview phone) · §5 a drag with its
      live label · §6 Per-device hide · §6½ default spacing · §6¾ guides + Page grid panel · §11 the editor on a tablet — SEEN, every
      picture read (§1 shows the Blocks panel's Stack · Side by side · Grid tiles; §6¾ also the Shift half-lines)
    - `[x]` V2 the reference's main panels: Top bar · Blocks panel · Block toolbar · Inspector Design · Content · Per-device · Page grid
    - `[x]` V3 every picture: WebP, resized to the width it is shown at (≤ 800px, a phone shot at 375), ≤ 80 KB, with alt text —
      largest 26 KB (the guides); "no alt 0" on both pages (`uat-d3-docs-headed.js`)
    - `[x]` V4 every picture AGREES WITH THE WORDS beside it — eleven disagreements found (D3-5 … D3-15), the words corrected; both
      tips proven THROUGH THE UI (Whole line at Mobile → the photo under the words in the phone Preview, still beside on desktop)
    - `[x]` V5 `:::tip` callouts where a scenario has a trick — 4 (photo under on a phone · sidebar under on a phone · Show hidden
      blocks · Shift / Alt), rendered as callouts on every screen (D3-21)
    - `[x]` V6 `npm run docs:build` [SUCCESS] · docs guard 5/5 (pictures checked as files, D3-20; callout syntax, D3-21)
    - `[x]` V7 the site HEADED at 375 / 768 / 1280 / 1536, light AND dark, and 200 % text (Chrome's real font-size): 24/24 — both
      pages, 13 + 7 pictures load, none past the column, no sideways scroll, AND all 70 screens of `screens.js` split over the six
      windows; a tap on a picture opens it full size (800px) in a new tab (D3-23)
    - `[x]` V8 RULE K: 3000 / 3100 / 3200 / 4000 checked free after every pass; `.next-b` removed
  - `[x]` (2) DONE 2026-10-06 — the Website Builder Guide's non-layout parts (content, components, themes, Preview, Page check, export), the README
    index, the plan / Builder Hub / Layout System / Builder Parity Audit artifacts corrected to what was built (G-1 … G-3c, E-1) and
    pointing at the site, every page in the same clean format
  - **D-3 (2) HEADED CHECKLIST** (written 2026-10-06 before the work, session after ff5dbc77):
    - `[x]` W1 (DONE: four read-only audits, one per slice of the page, every claim against the code with file:line — 40
      disagreements, D3-40 … D3-43, all corrected; + D3-50) every claim in `website-builder.md`'s non-layout parts (§1 first win · §2 workspace · §3 blocks · §4 scenarios · §5
      Inspector · §7 free placement · §9 themes · §10 pages / Preview / Export · §11 keyboard · §12–14 components and movement ·
      §14b Page check · §15 tips) checked against the CODE; each disagreement a ledger line, the words corrected
    - `[x]` W2 (SEEN, `docs-shots-headed.js` slices I–N, six headed windows, fresh build on 3100: the panel DOCKS at 1280 — the page's
      left edge 68 → 347; B closes it; the Link tile; the hint "29 designs"; Accordion offers Default · Q & A · Solid panel · Split
      (media) · Timeline · Enclosed card; Alert asks Default · Information · Success · Warning · Error · Announcement bar · Docs callout;
      Typography / Advanced CSS in Content only (0 in Design); items reorder with arrows (6), no drag; Severity "Info"; themes Light ·
      Dark · Midnight · Purple Dream; the Preview's hide arrow and H; Page check lists pictures to describe; Export → site.zip of
      index.html + styles.css) the same claims driven THROUGH THE UI in headed windows (the Blocks panel and its tabs, a component added and its
      design gallery, the Themes control, Preview and Exit, Page check, Export) — what is seen agrees with the words
    - `[x]` W3 (DONE: six — Blocks panel docked · gallery setup · Accordion starts · Accordion designs in Content · Preview bar · Page check;
      12–18 KB each, alt text, each a link to itself, each read; two dropped as saying nothing the words don't) pictures where they help, built through the UI (`docs-shots-headed.js` extended): WebP, ≤ 800px, ≤ 80 KB, alt text,
      each a link to itself; every picture agrees with the words beside it
    - `[x]` W4 (DONE: D3-40; repeats replaced by anchor links into the story / reference, every anchor checked by the guard, D3-46)
      the guide's layout sections (§6 · §8 · §10b–10g · §14c) do not contradict the layout story / reference — where they
      repeat them, they point there instead
    - `[x]` W5 (DONE) the README index lists the three pages and the docs site, in the same clean format
    - `[x]` W6 (DONE, each read in full and republished to its url: Builder Hub v36 · Layout System v20 · Builder Parity Audit v20 — its
      progress card claimed Tabs and Navbar built, neither exists → corrected · the page-grid plan v3 (repo source
      `docs/web-anatomy/page-grid/plan/page-grid-plan.html`) · Website Builder Guide v27+; each points at the docs site) artifacts read (`Artifact action:"read"`) and corrected to what was built in G-1 … G-3c, E-1, D-3, each pointing at the
      docs site: Builder Hub · Layout System · Builder Parity Audit · the page-grid plan (`Q5rAsZNSJJ…`) · the Website Builder Guide
    - `[x]` W7 (SEEN: docs:build [SUCCESS]; docs guard 8/8; HEADED 36 / 0 — three pages × 375 / 768 / 1280 / 1536 light and dark and
      200 % text, and all 70 screens, now also "no table cut off" (D3-48, D3-49); `logs/d3b-docs-uat2.out`) `npm run docs:build` [SUCCESS] · docs guard green · `uat-d3-docs-headed.js` HEADED at all 70 screens, light AND dark,
      200 % text, every page and picture (the guide included)
    - `[x]` W8 (checked after each pass) RULE K: 3000 / 3100 / 3200 / 4000 free after every pass
  - CHANGE (2) LEDGER (found by four read-only audits of the guide against the code, 2026-10-06; each confirmed before it was logged):
  - `[x]` D3-33 · REAL, PRODUCT, UI text: the Blocks panel's Accordion hint read "Expandable Q&A / FAQ — 54 designs"; the gallery has 29
    (`component-catalogue.ts:228`, a count typed by hand that outlived the 2026-09-06 axis split) → the hint takes
    `ACCORDION_DESIGN_COUNT`; guard `component-registry.test.ts` "a hint's design count is the gallery's count" (mutation-proven:
    "54" back → red)
  - `[x]` D3-34 · REAL, words (closed page): layout-reference "In the flow (default)" — the control is "In the layout"
    (`BoxInspector.tsx:712`); "Floats on screen" lives under Stays put, not Placement → "In the layout", and Stays put while scrolling: Scrolls away · Sticks when reached · Floats on screen
  - `[x]` D3-35 · REAL, words: layout-reference "Gap between blocks" — it is "Space between blocks" (`:1042`), and Space across /
    Space down are missing → rewritten, Space across · Space down added
  - `[x]` D3-36 · REAL, words: layout-reference "Edge shape … a wave, diagonal" under Background — it is Straight / Slope / Curve,
    top and bottom, under Arrange (`:921`) → moved to Arrange with its real choices and Edge depth; the Arrange table rewritten (Direction · Arrange as · Show one at a time)
  - `[x]` D3-37 · REAL, words: layout-reference "a value set at a wider screen applies to narrower screens too" — false for Wide,
    which branches off (`box-model.ts:176`) → says Wide branches off
  - `[x]` D3-38 · REAL, words: layout-story §11 "the Blocks panel floats … same as on a large screen" — from 64em it DOCKS and the
    page makes room (`page.tsx:220`) → "on a laptop or larger it docks at the side" (seen: the page's edge 68 → 347)
  - `[x]` D3-39 · REAL, TEST: D-3 (1) closed the reference with four control names the builder does not have (D3-34/35/36) — nothing
    checks a documented control name against the code → a guard that every bold control name in the reference's tables is a
    label the builder renders → guard `docs-guard.test.ts` "every control the reference names is one the builder shows" (labels the builder assembles named
    with the code that assembles them); RED on the page as it was (Bleed to page edge · Minimum rows tall · In the flow · Inner /
    Outer spacing (…)), green after; it also found "Bleed to the page edge" and "At least rows tall"; keyboard table completed from
    `BoxCanvas.tsx:1177-1210`
  - `[x]` D3-40 · REAL, words: website-builder §6 · §8 · §10c · §14c — 8 layout contradictions with the code and the story (on a
    phone every row stacks; tablet upright → two; edits at a device "never disturb the base" and "Full" chip; "Tablet or Mobile"
    only; Content position on containers; grids unpadded at every level; "every row is twelve columns"; 4+ always one row) → corrected (guide agent, checked: docs guard, docs:build)
  - `[x]` D3-41 · REAL, words: website-builder §12–14 — 10 (the alert is one message, not a list or stack · ask-on-add offers 5
    designs, not "what it's for" · "Info" · an action goes to a web address or #bookmark only · "Gradient when open" · no
    "replace" · Expand all, search and item links each add a script · "Q & A" · "54") → corrected; the starts and the asks SEEN (W2)
  - `[x]` D3-42 · REAL, words: website-builder §7 · §9 · §10 · §11 · §14b · §15 — 10 (paste of a block in the layout · the ⋮ Block
    actions menu · Preview's hide arrow · "works offline, no scripts" is FALSE: stock photos and videos load from their source,
    small built-in scripts ship · Page check also flags a link with no words, a picture not uploaded, a skipped heading level
    (one-click fix), words too tight · Ctrl+Shift+Z · arrows reorder in the layout, nudge only a floating block · H, Shift+G,
    Alt+←/→ missing · Reset replaces every page and is undoable) → corrected; Export / Preview / Page check SEEN (W2)
  - `[x]` D3-43 · REAL, words: website-builder §1–§5 — 11 (the Blocks panel docks from 64em · closes with ✕ / Esc / B · "Arrange
    as" is Free arrange / Grid, a stack ↔ row is Direction · gallery row heights are named · Space between starts at 1rem ·
    accordion items reorder with ↑/↓ · "54 looks in Design" → 29 in Content · a palette click adds AFTER the selection, not
    inside · no Typography in Design (Text style / Typography in Content) · Advanced CSS is in Content · Per-device holds only
    Hidden on <device>) + the Link tile → corrected; the panel, tabs and Inspector SEEN (W2)
  - `[x]` D3-44 · REAL, PRODUCT, a11y (MEASURED HEADED): the ✕ that removes a photo in the gallery setup uses `group-hover` with no `group` parent
    (`GallerySetupMenu.tsx:138`) — may show only when hovering the ✕ itself, never on touch → `group` on the photo, and shown always where there is no hover;
    HEADED: at rest 0 · hovering the photo 1 · a real touch context (isMobile, hasTouch, `hover: none` true) 1, and a tap removes it
    (2 of 3 left); guard `photo-gallery.test.ts` (mutation-proven: `group` removed → red)
  - `[x]` D3-45 · REAL, words (found by the plan's agent, confirmed in code): the reference lacked **Columns (of 12)** (`BoxInspector.tsx:1131`)
    and **Line up with the grid** (`page.tsx:1184`), and its top bar said Reset "clears the page" (it replaces every page, D3-16) and
    Export "a folder of HTML, CSS and assets" (it is `site.zip`, HTML + `styles.css`, SEEN) → rows added / corrected; the guard names
    "Columns (of 12)" as an assembled label
  - `[x]` D3-46 · REAL, TEST (found by the guide's agent): the docs guard's link check took `#section` as part of the file name, so a
    correct `./page.md#section` link failed → it splits the anchor off AND checks it is a heading of that page (github-slugger's rule,
    \p{Nd}: the built site drops ½ / ¾ from ids — measured in `docs-site/build`); mutation: a misspelt anchor → red
  - `[x]` D3-47 · REAL, PRODUCT (seen in the Page check picture): the shared Modal `truncate`d its subtitle — "…including people using
    screen readers" read "…includin…" → it wraps; guard `Modal.test.tsx` "never cuts its subtitle short" (mutation-proven). The mobile
    app's modals have no such cut (checked)
  - `[x]` D3-48 · REAL, a11y (seen in the 375 / 200 % shot): the docs CSS's `overflow: hidden` came after `overflow-x: auto` and won, so a
    table wider than the column was cut off with no way to reach its words → removed; guard `docs-guard.test.ts` "a wide table scrolls"
    (mutation-proven); HEADED: 2–6 tables cut off on 320–375 phones even at 100 % on the old CSS, 0 after
  - `[x]` D3-49 · REAL, TEST: D-3 (1)'s V7 passed those pages — it checked pictures and sideways scroll, never a table → the headed pass
    fails on any table that overflows without scrolling, on every screen (proven: FAIL on the old CSS, 36 / 0 on the fix)
  - `[x]` D3-50 · REAL, words (found by the guide artifact's agent): website-builder §6 said to turn pinning off for phones "on the
    Per-device tab" — that tab holds only Hidden → at the Mobile chip, Stays put while scrolling → Scrolls away
  - `[x]` D3-51 · MY OWN: the two new source-reading guards (photo-gallery, docs-guard's anchor read) did not strip CRLF in the form
    `source-reading-tests.test.ts` requires — found by the full vitest run → `.replace(/
/g, "
")` on the read; 112 / 112
  - GATE at the change-(2) commit: typecheck 0 · eslint 0 errors (105 warnings) · vitest 4,375 / 4,375 · `test:fast` 807 passed
  - `[x]` D3-1 · REAL (found measuring D2-7): the base size is applied TWICE — Infima puts `--ifm-font-size-base` (0.9375rem) on
    `html`, and `custom.css` puts it on `body` again, so body text computes 14.06px at a 16px browser, not the 15 written down
    (headings and spacing, in rem of the 15px root, are as intended). THE USER (2026-10-06): keep the 14px look → the body is
    sized once, explicitly (`0.9375rem` of the 15px root, not the root variable), comments say what each size is; guard
    `docs-guard.test.ts` "applied once" (mutation-proven: the var back on body fails it). MEASURED HEADED, Chrome's real font-size
    12 / 16 / 24: root 11.25 / 15 / 22.5, body 10.55 / 14.06 / 21.09 (×0.75 / ×1 / ×1.5), no sideways scroll at 375
  - `[x]` D3-2 · REAL, MY OWN (found before editing D3-1): the tree's planned "keep 14px" fix (`--ifm-font-size-base: 0.875rem`)
    would have shrunk EVERY heading, gap and sidebar size by 14/15 — Infima's base IS the html (root) size, so every rem follows it
    (`infima/dist/css/default/default.css:377`). Not applied; D3-1 done as above, root unchanged (measured: root 15, h2 16.88 as before)
  - `[x]` D3-3 · REAL (found reading for V4): `layout-reference.md` described the "Fill the block's height" switch as built — it is
    G-3d (2), not built yet → marked "coming next, batch G-3d … not in the builder yet"; G-3d writes it for real
  - `[x]` D3-4 · REAL (found reading for V4): `layout-story.md` §6¾ said a lone half-width block on a phone "now takes the whole
    line" — G-3d (1), not built yet → says what happens today and that G-3d changes it
  - `[x]` D3-5 · REAL, words (seen in the tablet shot): §11 said the Inspector "never covers the block she just tapped" — below 64em
    it is a 22rem drawer OVER the canvas (`page.tsx:224`) → rewritten; the shot now comes from a window OPENED at 768 (the Inspector
    starts closed, as on an iPad) — the first shot narrowed a 1280 window, a harness slip
  - `[x]` D3-6 · REAL, words (seen in the toolbar shot): the reference listed ↑ ↓ Duplicate Delete buttons on the block toolbar — it
    has ⠿ Drag to move · + Add a block inside · Lock · ⋮ Block actions → both tables rewritten from `BoxCanvas.tsx:3671` (labels, hints)
  - `[x]` D3-7 · MY OWN, harness: the top-bar crop cut its second row; slice F waited for "Expand inspector" that a 1280-opened window
    never shows; Inspector shots showed the top of the panel → cropped to the bar, slice G opened at 768, each control scrolled in
  - `[x]` D3-8 · REAL, words (seen in the §2 phone Preview): "the photo drops under the words" — on a page-grid page the fit rule keeps
    the two side by side while the words keep ~14rem (at 375: words 240px, photo ~100px) → the story says so, with the tip that puts
    it under (proven through the UI). Whether that LOOK is wanted is D3-31, the user's
  - `[x]` D3-9 · REAL, words (seen in the §4 phone Preview): "the sidebar goes under the article" — it stays beside (article ~220,
    sidebar ~95px at 375) → same correction and tip; the look → D3-31
  - `[x]` D3-10 · REAL, words: the reference's Page grid panel lacked Row lines in the guides · Row step · This page uses its own grid
    · Reset to default (`PageGridPanel.tsx`) → table rewritten from the code, with its picture
  - `[x]` D3-11 · REAL, words: "when I click a block, faint vertical lines appear" — the guides come from the Layout guides button (it
    also opens the Page grid panel) → rewritten; the panel's two ways in named
  - `[x]` D3-12 · REAL, words: §11 said the closed Inspector's label becomes the block's name — it stays "INSPECTOR" (seen) → removed
  - `[x]` D3-13 · REAL, words: §6½ said every spacing control reads "Default · 2rem" — a Heading's reads "Default · 0rem", its gutter
    belongs to the section (seen) → rewritten with the picture
  - `[x]` D3-14 · REAL, words: "Hidden on mobile" / "Hidden on this screen" — the control is "Hidden on phone", the toggle the eye
    "Show hidden blocks", and "Hidden everywhere" exists → both pages use the real names
  - `[x]` D3-15 · REAL, words: the keyboard list had F11 (the browser's, not the builder's) and "nudge 1px" (2px, 12px with Shift —
    `BoxCanvas.tsx:1183`), and lacked Copy / Cut / Paste / Ungroup / Ctrl+Shift+Z / H in Preview → rewritten from the code
  - `[x]` D3-16 · REAL, PRODUCT, DATA LOSS (found checking the Top bar table): Reset replaced every page AND emptied the undo history in
    one click, no question → asks first (shared DeleteConfirmationModal, "Start the whole site over?") and is one Undo step
    (`pushSite`). BDD `box-builder-site.feature`; spec `tests/e2e/reset-asks-first.spec.ts` 4/4 projects (fails on the old build);
    HEADED UAT `uat-d3-reset-headed.js` 56/56 — four editor themes, a 375 phone, Delete page, Cancel · Enter · Escape · Start over ·
    Ctrl+Z · reload, and the restored site's Preview at all 70 screens
  - `[x]` D3-17 · REAL, TEST: `builder-chrome-fits.spec.ts` says "a bar that wrapped at 1280px would be a regression" but asserts one
    row only at 1536 — measured: 92px (two rows) at 1280 / 1366 / 1440, one row needs ~1480px. Which controls collapse is a design
    decision → D3-32, the user's; the guard follows that decision
  - `[x]` D3-18 · REAL, PRODUCT, a11y (found by the Reset spec): the shared DeleteConfirmationModal had no dialog role, name or
    aria-modal (WCAG 4.1.2) and drew an empty item card → `role="alertdialog"`, named by its title, described by its warning, focus on
    Cancel (WCAG 2.4.3), the card only with an item. Guard `tests/components/shared/DeleteConfirmationModal.test.tsx` (mutation-proven)
  - `[x]` D3-19 · REAL, PRODUCT, pre-existing (found by the headed UAT): Escape never closed DeleteConfirmationModal in the builder — its
    listener was keyed on a new `onClose` each render, and BoxCanvas's earlier Escape listener re-rendered the page mid-event, removing
    it before it ran (listener churn) → subscribed once per opening, onClose through a ref (rule 2). Guard: the component test
    reproduces it with `flushSync` in an earlier listener — fails on the old code, passes now
  - `[x]` D3-20 · REAL, TEST: the docs guard treated every link as a page (`<link>.md`) and could not check a picture → a picture link is
    checked as that file (mutation: a misspelt picture fails it)
  - `[x]` D3-21 · MY OWN: the tips used `:::tip Title`, which Docusaurus 3 prints as text → `:::tip[Title]`; guard "every callout title
    uses the bracket syntax" (mutation-proven)
  - `[x]` D3-22 · REAL, a11y (found by V7): at 375 with 200 % text the reference's "Next" card was 381px — 22px sideways (WCAG 1.4.10);
    Infima pins Next to column 2 → below 40em (the reader's own em) the two cards stack. 24/24
  - `[x]` D3-23 · REAL, readability (seen in V7): a desktop screenshot on a phone is too small to read → every picture links to itself;
    measured: a tap opens the 800px picture in a new tab
  - `[x]` D3-24 · MY OWN: whole-window canvas shots were half empty canvas → cropped to the page's last block, the Preview shots to the
    frame's content; the hide shot kept whole (its point is the Inspector's box)
  - `[x]` D3-25 · NOT A BUG (product): 1 slice-D run in 6 ended a +140px drag at 321px though the live label said "8 of 12". MEASURED:
    that run alone had a 12th mousemove at (446, 418) the script never sent (all its moves at y=167) — the REAL mouse pointer resting
    over that headed window; the builder did what a pointer at 446 means
  - `[x]` D3-26 · MY OWN, a flaky harness (RULE V): a drag held across a slow step can be moved by the real pointer → the pointer is put
    back on the target before release; 6/6 runs identical
  - `[x]` D3-27 · REAL, gate: eslint linted `docs-site/.docusaurus/` (generated by docs:build), 6 errors → ignored with its reason in
    `eslint.config.mjs`; eslint 0 errors
  - `[x]` D3-28 · MY OWN + pre-existing: `docs-guard.test.ts` read files without stripping CRLF (source-reading-tests) → stripped;
    existence checks use `existsSync`
  - `[x]` D3-29 · MY OWN: `reset-asks-first.spec.ts` was in neither browser list → added to `test-fast.js` and `test:invariants:rest`
  - `[x]` D3-30 · MY OWN: the two new headed UATs did not use `screens.js` → both sweep all 70 screens
  - `[x]` D3-31 · DECIDED BY THE USER 2026-10-06 ("yes, both"): on a 375 phone a paragraph + photo row kept a ~100px photo beside the
    words, and an article + sidebar a ~95px sidebar (the G-1 fit rule protects only the words) → a 10rem floor for EVERY block of a
    row on a phone; MOVED to BATCH G-3d change (3). The story's §2 / §4 phone lines are rewritten when G-3d ships it
  - `[x]` D3-32 · DECIDED BY THE USER 2026-10-06 ("yes, both"): the top bar is two rows (92px) from 1280 to 1440 → one row from 1280,
    labels collapsing to icons (tooltip + accessible name kept), the guard asserting one row at 1280; MOVED to BATCH E-3
  - GATE at the change-(1) commit: typecheck 0 · eslint 0 errors · vitest 4,370/4,370 · `test:fast` 807 passed (exit 0)
- `[x]` **BATCH G-3d · Three decisions from G-3b and D-3** — CLOSED 2026-10-06 (HEADED UAT `uat-g3d-headed.js` 91 / 0, regression G-3c 17 / 0 · G-3 65 / 0 · G-2 128 / 0, docs 36 / 0; gate below) — QUEUED 2026-10-05 by the user ("yes to both"), change (3) added
  2026-10-06 ("yes, both", D3-31) (area: page grid · 3 changes):
  - MAPPED 2026-10-06 (read-only, before BDD; file:line in `lib/box-model.ts` unless named) — the design each change follows:
    - (3) the fit rule is `rowNarrowsAt` (:3509): today only WORDS get a floor (`floorOf` 14rem :4703; an Image gets 0, and a row
      with no words is skipped at :3520 — why the photo and the sidebar stay beside). Change, gated `if (gridRow)` so saved pages are
      byte-identical: a 10rem floor on every block's AREA (its columns), capped below the tablet rung (37.5em) so wide screens never
      step. MEASURED BY ARITHMETIC, why the area and not the drawn box: at 360 a Stat's box is (360 − 2·16 − 12) / 2 = 158px < 160 —
      on the box four Stats would stack, against the user's own line; on the area two across needs 20rem of a 22.5rem page → stay.
      Paragraph + 40 % photo at 375 → photo area 150px → stacks; article + 30 % sidebar → 112px → stacks. Visible side effect, by
      the decision's own words ("ANY block"): a strip of six logos on a page row now goes 2 across at 360. One emitter
      (`rowQueryCss` :3579) serves canvas and export; the panel's `fitStepAt` follows
    - (1) a lone block is never stepped (`n < 2`); its phone span comes from `rowLinesAt` (:5317) via `resolveResponsive`. Change in
      `rowLinesAt` only, at the phone: a line holding ONE block whose phone width / margin was not set at the phone takes the whole
      line; everything downstream (CSS, canvas slot, panel) reads `rowLinesAt`, so they cannot disagree
    - (2) `fillsRows(block)` = page-grid block spanning 2+ rows whose only child is an Image with `fillHeight !== false` (a new
      optional `BoxNode.fillHeight?: false`, stored only when switched off); `childStyle` gives the image `flex: 1 1 auto` and
      `imageSizing` `height: 100%` with its own height kept as a minimum; both renderers pass it; the switch "Fill the block's
      height" in the picture's settings (`BoxInspector.tsx:1446`), shown only where it applies (RULE UI)
    - TESTS to extend: `page-grid.test.ts` (fit :195-249 — the four-Stats margin drops to 0.5rem, add a 340 check — G3b-11 :737,
      rows :959), `image-intrinsic.test.ts`, `BoxInspector.test.tsx`, `page-grid.feature`, `box-builder-images.feature`; headed
      template `uat-g3b-headed.js`; docs: story §2 / §4 / §6¾, reference "Fill the block's height", retake two phone shots
  - `[x]` G3d-1 · DECIDED BY THE USER 2026-10-06 — (a): the crop is CENTRED for now (`ponytail:` in the code); the focal point is
    built later as part of the IMAGE COMPONENT, for web AND the phone / tablet app (1.3 → Components → Image). Found mapping (2): the decision says the picture is cropped "at its focal point" — no picture
    has a focal point today (only backgrounds have a position, `bgPosition`; the exported `<img>` has no `object-position`, so every
    crop is centred). Either (a) the centre for now, marked `ponytail:` — the least code — or (b) a new "Focal point" control on
    every picture (nine-point, like a background's position), used by this crop and by every cropped picture
  - `[x]` (3) DONE (`rowNarrowsAt`, `BLOCK_FLOOR_REM`; page-grid.test "G-3d (3)", 3 mutations red) — A FLOOR FOR EVERY BLOCK OF A ROW ON A PHONE (D3-31): the fit rule stacks a row on a phone when ANY of its blocks would
    get narrower than 10rem, not only its words — measured at 375: a ~100px photo beside a paragraph, a ~95px sidebar beside an
    article. Four Stats on a 360 phone (~165px each) stay two across. Then the story's §2 / §4 phone lines and tips are rewritten
  - `[x]` (1) DONE (`rowLinesAt`; page-grid.test "G-3d (1)", 3 mutations red; a row of ONE block was already whole on a phone — the case is a block alone on its line in a page row) — ON A PHONE A LONE HALF-WIDTH BLOCK TAKES THE WHOLE LINE: where the fit rule stacks a row, a block alone on its line
    whose width came from a WIDER screen takes the line (~165px of words beside a hole on a 360px phone otherwise); a width set on the
    phone itself still wins (G3b-11)
  - `[x]` (2) DONE (`fillsRows` / `fillHostOf` / `--bx-fill`, `BoxNode.fillHeight`, the switch in Content; the tree is block → band → picture, so `childStyle` takes the block around the band; image-intrinsic "G-3d (2)" 6 mutations red, BoxInspector 2 red; G3d-11) — A PICTURE FILLS A BLOCK THAT SPANS ROWS: when the picture is the only thing in a block that spans 2+ rows, it fills the
    block's height, cropped (cover, its focal point), never stretched — on by default, a "Fill the block's height" switch in the
    picture's settings to turn it off (RULE UI); a block with words beside the picture keeps the picture's own height
  HEADED UAT CHECKLIST (written 2026-10-06 before any code; six windows; a fresh production build; every row BUILT THROUGH THE UI;
  the Preview at all 70 screens of `screens.js` at 100 / 150 / 200 % text; canvas == Preview; no sideways scroll, no overlap, no
  broken word, at every line):
  - `[x]` U1 SEEN (A1 / A2, canvas Mobile + Desktop, Preview 70 × 3): photo and sidebar under the words below 600, beside from 1200 — (3) ON: paragraph + 40 % photo → the photo under the words at every screen < 600 (375 measured); article + 30 % sidebar
    → the sidebar under it; both side by side again from 600 up
  - `[x]` U2 SEEN (B1 / B2): Stats 2 across at every screen < 600 (320 included); logos 2 / 3 / 6 at < 480 / < 600 / ≥ 600, canvas Tablet six across — (3) every block: four Stats (25 % each) two across at 360 and every phone ≥ 340 wide enough for 2 × 10rem, one a line
    below; six logos → 2 across at 360, 3 across from 480 (3 × 10rem), 6 across from 600; never stepped by the floor at 600+
  - `[x]` U3 SEEN (C): stacked at 375 as always, beside at 1280, no --bx-fill, byte-identical to 99c6c7b (G3d-3) — (3) OFF: a page saved before the page grid with paragraph + photo — Preview byte-identical to before (export string
    compared) and the photo still beside at 375
  - `[x]` U4 SEEN (D): Mobile 343 = 343 = 343 (the whole line), Tablet 352 of a 361 half, Desktop half; Preview 70 × 3 — (1) ON: a block set to 50 % at Desktop, alone on its row → the whole line on every phone, the frame at both edges;
    still half at Tablet / Desktop / Wide
  - `[x]` U5 SEEN (D): 156 of 343 on the phone, Undo 343, Redo + reload 156, Desktop half — (1) OFF: the same block set to 3 of 6 at Mobile → half the phone line; Undo → whole again; reload → kept
  - `[x]` U6 SEEN (E × 4 themes): 147–581 = the block's inner bottom (own 249), cover; Preview 42 screens side by side, 39 grown — (2) ON: a photo alone in a block 2 rows tall beside two short blocks of words → the photo fills the block's height,
    cropped (no stretch: its drawn aspect = the file's, object-fit cover), canvas == Preview where the row is side by side
  - `[x]` U7 SEEN (E × 4): off → own height, Undo → fills, reload → off; Rows tall 1 → no switch; Mobile → own height; words under → no switch — (2) OFF + where it does not apply: "Fill the block's height" switched off → the picture's own height; Undo → on;
    reload → kept; a 1-row block or a picture beside words → no switch shown; stacked on a phone → its own height
  - `[x]` U8 SEEN (E × 4): named, Space toggles it, Light 7.56:1 (G3d-10) — the switch in the editor's four themes: labelled, ≥ 4.5:1, keyboard reachable (Tab + Space), a screen reader name
  - `[x]` U9 SEEN on the same fresh build: G-3c 17 / 0 · G-3 65 / 0 · G-2 128 / 0 (`logs/g3d-regress-*.out`) — regression: G-3c, G-3 and G-2 headed suites re-run on the same build
  - `[x]` U10 SEEN: story §2 / §4 / §6¾ (Rows tall, How a row steps) + the reference row + website-builder §8 rewritten; story-photo-beside-phone / story-sidebar-phone retaken (both now under the words, the whole width — looked at); docs:build [SUCCESS]; docs guard green; uat-d3-docs-headed 36 / 0 — docs: layout-story §2 / §4 / §6¾ and the reference row read true against what U1–U7 saw; the two phone shots retaken
  LEDGER G-3d (session 2026-10-06, after 49087f08):
  - `[x]` G3d-2 · TEST (mine): D wanted the lone third block the first's width to 1px — alone on its line it gives up a different part
    of the side space (G3b-3: 361 vs 352px at Tablet) → the same share within 5 %
  - `[x]` G3d-3 · TEST (mine): C wanted a saved page's photo BESIDE the words at 375 — saved pages always stacked on a phone (L-4) →
    asserts stacked; BYTE-IDENTITY MEASURED: the UI-built saved page (`logs/uat-g3d/C-saved-site.json`) rendered by `99c6c7b` and by
    this change: 32,164 bytes each, `cmp` identical
  - `[x]` G3d-4 · TEST (mine): D's Preview check assumed the two halves stack below 600 (at 599 they fit side by side, 277px each) →
    the third measured against the PAGE: the whole line below 600, ≤ 55 % from 600
  - `[x]` G3d-5 · NOT A BUG, MEASURED (probe-g3d-fill.js): "the photo does not fill on the canvas" — with two-line words at 1280 the
    photo (249px) was the tallest thing, so the rows followed it; the Preview chain shows picture 395 = band 395 > own 337 and the
    stack 36px taller = its own 18px inner spacing. The check was wrong → G3d-9
  - `[x]` G3d-6 · TEST (mine): the switch read 2.78:1 in Light — the probe walked up to no background and painted "transparent" as
    black (gray-600 on black) → falls back to the page's white: 7.56:1 (G3d-10)
  - `[x]` G3d-7 · TEST (mine): U5 compared the third with the first — a width set on the phone makes the fit rule stand aside for the
    whole row (G3b-11), so the first changes too → against the third's own whole line: 156 of 343px (3 of 6 columns, less its
    side space and half a gap); Undo 343 of 343; reload 156
  - `[x]` G3d-8 · TEST (mine): "words added under the picture" compared a Desktop picture with its own height measured at Mobile →
    both in the same state: switches 0 · 249 = own 249
  - `[x]` G3d-9 · TEST (mine): "filled" was the neighbour's OUTER bottom (through the stack's spacing), on a canvas drawn at 0.61 with
    unscaled padding, beside words shorter than the photo → the block's inner bottom × `data-canvas-scale`, words 4× longer, plus
    "grew past its own height": 147–581 = inner 581 (own 249); Preview 42 side by side, 39 grown
  - `[x]` G3d-10 · the G3d-6 fix (see above)
  - `[x]` G3d-11 · REAL (mine), FOUND BY THE HEADED PASS: at 599 the fit rule steps the row and drops the photo's span (`grid-row:auto`,
    a container query) but the photo still filled — 301px beside a tall paragraph against its own 184 → `--bx-fill` moved onto the
    BLOCK and the stepped rule sets `--bx-fill:initial` where it drops a span, so the picture falls back to its own height on canvas
    and export alike (one rule). Guard: image-intrinsic "G3d-11", red without it
  - HEADED UAT `scripts/uat/uat-g3d-headed.js` (six windows, a pool that refills): run 1 91 checks / 23 failed (the lines above);
    run 3 on the rebuilt fresh build: **91 checks, 0 failed** (`logs/g3d-uat3.out`), Preview at all 70 screens × 100 / 150 / 200 %
  - `[x]` G3d-12 · MINE, CAUGHT BY THE GATE: an unused `w` in the UAT script's E callback (eslint error) → removed; eslint 0 errors
  - GATE at the close: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,400 / 4,400 · `test:fast` 807 passed (exit 0)
- `[x]` **BATCH E-2 · Resizing and dropping on tablets and phones** — CLOSED 2026-10-06 (HEADED UAT `scripts/uat/uat-e2-headed.js`, six windows, 174 checks 0 failed; gate: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,405 / 4,405 · `test:fast` 812 / 812 · `docs:build` SUCCESS; the 37 + 22 specs 246 + 256 green on every project; ledger E2-1 … E2-24 closed — E2-20 → BATCH E-5, E2-22 → BATCH L-5 by the user) — branch `builder/editor-small-screens` — QUEUED 2026-10-05 by the user ("split by area", E1-5) (area: the
  editor's gestures at small viewports · the failing specs, each measured: a spec that assumes the desktop, or a real bug — fixed
  either way): grid-cell-resize 13 · vertical-edges-anchored 7 · side-by-side-resize 6 · stack-under-column 4 · float-round-trip 3 ·
  chrome-follows-resize 3 · dropped-block-fills-space 1 (37 on tablet-landscape / tablet-portrait / mobile-chrome)
  RE-MEASURED 2026-10-06 at `9ded396` (HEADLESS GATE, fresh build on 3100, `logs/e2-measure.out`): the same 37 fail, 149 pass.
  HEADED UAT CHECKLIST (written before the pass; six windows, a pool that refills; fresh production build; built through the UI
  on tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, touch on; Preview at all 70 screens):
  - `[x]` U1 (SEEN 2026-10-06, 174 / 0) a grid cell: right AND left edge, grow AND shrink, repeated, to where the partner runs out (rule 19) — the edge not held
    never moves; the neighbour wraps and comes back; one Undo puts the drag back — each screen
  - `[x]` U2 (SEEN 2026-10-06, 174 / 0) a grid cell: top AND bottom edge, grow AND shrink — the row's cells share a height, the opposite edge stays — each screen
  - `[x]` U3 (SEEN 2026-10-06, 174 / 0) two blocks side by side: the shared boundary from both sides, grow AND shrink, past the limit and back — the neighbour
    gives up what you take, wraps keeping its width, returns — each screen (on the phone: what a person sees when the 10rem floor
    steps the row is checked as it is, not as a desktop)
  - `[x]` U4 (SEEN 2026-10-06, 174 / 0) a block's top AND bottom edge, at the page top and between blocks, grow AND shrink — the edge not held stays — each screen
  - `[x]` U5 (SEEN 2026-10-06, 174 / 0) drop a block under one column, into the hole above it, beside it; then shrink the dropped block — each screen
  - `[x]` U6 (SEEN 2026-10-06, 174 / 0) float a parent and put it back (children and own heights kept, a size set while floating kept), float one child alone;
    the selection chrome rides on the block through a drag and through every change of screen size; a dropped block fills the
    section / grid cell — each screen
  - `[x]` U7 (SEEN 2026-10-06, 174 / 0) Preview at all 70 screens of the pages built in U1–U6: no sideways overflow, no overlaps
  - `[x]` U8 (SEEN 2026-10-06, 174 / 0) docs: layout-story §11 and the reference say what a person sees, where E-2 changed it
  ADDED BEFORE THE PASS, for what the measuring found (E2-12 … E2-18):
  - `[x]` U9 (SEEN 2026-10-06, 174 / 0) a header set to "Stays put while scrolling" (Inspector → Placement) holds at the top of the shrunk canvas while it
    scrolls; a block set to "Floats on screen" does not move when it is picked — each screen (E2-15, E2-16)
  - `[x]` U10 (SEEN 2026-10-06, 174 / 0) a Stack holding words, a Stack under it: the lower one's top edge dragged far up — its bottom never moves, the two
    still touch, the one above shrinks right down to its words; then a bottom edge +80 / −80 three times: the page comes back
    within half a px — each screen (E2-17, E2-18)
  - `[x]` U11 (SEEN 2026-10-06, 174 / 0) Fit fits: at Full width and every device size the page is inside the canvas room, on each screen (E2-12, E2-7)
  HEADED UAT `scripts/uat/uat-e2-headed.js` (six windows, a pool that refills; 21 slices = G grid · S side by side · V one under the
  other · D column under a column · F float · P pinned / floating · W words above × the three screens, the four themes rotated; every
  page then in the Preview at all 70 screens × 100 / 150 / 200 % text), on the FRESH build of E2-24: **174 checks, 0 failed**
  (`logs/e2-uat5.out`). On the PHONE, U3's boundary and U5's drop are reported as not drivable yet — two side-by-side columns come only
  from "Side by side" there (E2-20 → BATCH E-5) and their shared edge does not move on any screen (E2-22 → BATCH L-5).
  LEDGER E-2 (each written the moment it was found):
  - `[x]` E2-1 · TEST, MEASURED (probe-e2.js presets): every handle and the toolbar sat on the block at every preset on all three
    screens; only the precondition counter fell short (4 < 5) — on a small window the presets are all fitted to the same room
    (phone: Wide 0.25 · Desktop 0.25 · Laptop 0.26, docW = viewport every time — no page overflow, so E2-7 below is NOT A BUG)
  - `[x]` E2-2 · REAL, MEASURED (probe-e2.js leftEdge / leftEdgeDesktop): "Full width" (the editor's default) edits the DESKTOP base
    but drew the page at the room's own width capped at 64rem — 572 / 624 / 274px on tablet landscape / portrait / phone (the PHONE
    or tablet rung, which steps a row) and 828px on a 1280 desktop (the tablet-portrait rung). A left-edge drag stored [1,5,3,3] and
    on screen the cell jumped RIGHT (211→259). At the Desktop preset the same drag holds rule 19 on all three (right edge fixed).
    DECIDED BY THE USER 2026-10-06 (twice — once more after the measured desktop cost: 1280 0.69 shut / 0.46 panel open · 1366 0.76
    / 0.53 · 1536 0.90 / 0.67 · 1920 1.00): **Full width is always the desktop page** — drawn at 75rem (the desktop rung's first
    width) and shrunk to fit like every device size; zoom enlarges it. → `app/website/box-demo/page.tsx` fitW. The specs written for
    a 1:1 Full width canvas move to page px (166 failed on the first run after it, `logs/e2-measure2.out`)
  - `[x]` E2-11 · REAL, MEASURED (probe-e2.js wrapPull): "keep pulling and the neighbour wraps" never wrapped on tablet landscape or
    phone — R squeezed to its 4% floor, L held at 96% however far the pointer went. The test `P(want) < limit + P(WRAP_PULL)` used
    `want` CAPPED at the line's end (100%), while WRAP_PULL is 24 SCREEN px (a wobble of the hand, by design) = 4.3% of a 564px
    canvas — more than the floor leaves, so the wrap was unreachable on any canvas drawn under ~600px (every tablet and phone, a
    1280 desktop with the blocks panel open). First read as the spec's short pull (0.51 → 0.6, kept: a deliberate pull)
  - `[x]` E2-12 · REAL (mine, from E2-2): Fit stopped at the hand zoom's 25 % — the desktop page at 0.25 is 300px in a 393 phone's
    274px room, its right edge and handles scrolled away → Fit may go below 25 % (0.1 guards a vanishing room); the hand zoom keeps
    25–400 %. Guard: chrome-follows-resize, the page inside the canvas room at every size
  - `[x]` E2-7 · REAL (corrected — first closed as NOT A BUG on the wrong measurement): on the phone, Wide / Desktop drew the page
    68+480 / 68+320 in a ~274px canvas room. The DOCUMENT did not scroll sideways (scrollWidth 394), which is what was measured —
    but the page ran past the canvas ROOM, its right edge scrolled away inside it. The E2-12 mutant showed it: "Wide: the page's
    right edge (548) is inside the canvas room (349)" red. Fixed by E2-12 (Fit fits), the same guard
  - `[x]` E2-13 · REAL, FOUND BY E2-10's resize-leaves-no-gap zv-6 (the user's own page) and MEASURED (probe-e2.js usersPage): a
    bottom-edge drag of +90 page px raised the capping band 201 → 302 at 0.95 · 519 at 0.47 · 1004 at 0.22 — exactly
    `lay(h0 + growth)`: the STORED height (page px) added to SCREEN px, the sum divided by the scale — the rest handed to the `fill`
    block above, so the ANCHORED top edge moved (10 / 226 page px): rule 19, hidden for as long as Full width was drawn 1:1.
    → `h0 + lay(growth)`, unrounded. The same sweep found the class again: the shared-boundary writes clamp at the UNSCALED
    `MIN_ROW_PX` (24 screen px = 109 page px at 0.22) while their `slack` uses `MIN_ROW_PX * Z`, and round to whole screen px
    → scaled, unrounded (four lines). Guards: resize-leaves-no-gap zv-6 / o2-f (red before), vertical-edges "the edge stops
    where the stack above runs out" drawn at ≤ 0.4
  - `[x]` E2-14 · REAL, canvas ≠ export, FOUND BY E2-10's pins-stack: three bars pinned to the top overlapped on the canvas (the second
    started at 152 where the first ended at 158) — `pinStackPass` stacked them by `getBoundingClientRect().height`, SCREEN px on the
    scaled canvas, written back as a CSS length inside it. → a layout height (÷ the nearest `data-canvas-scale`; the export has none:
    1); the pass is shipped to the export as its source, unchanged there. Guard: pins-stack "the CANVAS stacks them too" in page px
  - `[x]` E2-15 · REAL, canvas ≠ export, PRE-EXISTING (every scaled device size) and now on the default view, FOUND BY E2-10's
    pinning-holds: a pinned header did not hold on a shrunk canvas — it drifted (1 − z) × the scroll (246 of 700 at 0.68; held at
    1 with Ctrl 0, probe-e2.js stickyScaled): the browser holds a sticky box by the scroll in the transformed frame's OWN px. →
    `canvasFixedStyle` gives a canvas sticky `top: calc(T + var(--canvas-scroll) × (1 − var(--canvas-z)))` (bottom: minus), the
    canvas writing `--canvas-z` beside `--canvas-scroll`; `data-held` narrowed to the fixed pins it was written for. Guards:
    pinning-holds' three CANVAS tests (red before); the bottom edge by probe-e2.js stickyEdges
  - `[x]` E2-16 · REAL, published wrong, FOUND BY E2-10's float-pin: "Floats on screen" moved the block 51px at 0.69 — and published it
    there: `measureFixedGeom` stored `pinX` / `pinY` from SCREEN rects, read as page px by the canvas and the export alike. → ÷
    `zoomOf(el)`. Guard: float-pin "picking Floats on screen does not move it" (red before)
  - `[x]` E2-17 · REAL (rule 12, "nothing degrades"), FOUND BY E2-10's parity-every-arrangement once it compared PAGE px: six +80 / −80
    round trips of a bottom edge drifted 0.08 page px a cycle (128.0 → 128.4 by the fifth, taken from the block below) — the dragged
    height was `Math.round`ed to a whole SCREEN px (1.45 page px at 0.69) while its partner took the unrounded rest; hidden at 1:1
    inside the old integer comparison. → not rounded (`lay` keeps a thousandth), both copies (partner / no partner). Guard: the
    six-round-trip test in page px, ±0.5 against the START every cycle (red before)
  - `[x]` E2-18 · REAL, RULE 19, PRE-EXISTING AT ANY SCALE, FOUND WHILE GUARDING E2-13's floor (the old guard could not fail: its partner
    was EMPTY, its 8rem minimum above both floors): with a line of WORDS in the stack above, dragging the lower stack's top edge up
    400 left the stack above at 300 and moved the ANCHORED bottom 500 → 774 — the partner walk dived from the block into the band
    the editor wraps round its words (stretched to the block, so "exactly as tall"), wrote `minHeight 26.4` to that band, spent the
    block's 274px of slack, and the dragged block grew out of its far side (probe-e2.js wordsAbove, at 0.33 and at 1). → the dive
    goes only OUT OF A BAND (`owner.rowBand`), the case its note describes. Guard: vertical-edges "drawn small, the stack above gives
    ALL it can — down to its words" (red before: 774)
  - `[x]` E2-19 · REAL, PRE-EXISTING AT ANY SCALE, FOUND BY THE HEADED SMOKE RUN (U6, built through the UI — RULE Y): two Stacks side
    by side, Alt+F on the first and Alt+F again — it came back on a line of its own, full width, below its neighbour (desktop 0.69
    as well, probe-e2.js floatTwice). `floatBox` moves the block onto the page and remembered only its size; left there, the
    row-band pass wrapped it in a band of its own. The seeded float-round-trip spec floated a grid that never left its parent. →
    `floatFrom` also keeps `parentId` / `index`, and `unfloatBox` moves it home when that parent is still there. Then the next
    smoke run, built the PHONE's way (Side by side + Add a block inside), still came back after its neighbour: alone in its band,
    the band is pruned once it floats (home = the band's own place), and a block floating inside the row it came from had been
    moved to the row's END ("already in its parent" is not "home" — the place counts too). Guards: box-model.test.ts "unfloatBox
    puts a block back WHERE IT WAS", "…ALONE in its band…", "…floated INSIDE the parent it came from…" (each red by mutation)
  - `[x]` E2-21 · REAL, DATA LOSS, PRE-EXISTING, FOUND BY THE HEADED SMOKE RUN (U7's reload check, "5 → 1" in nearly every window;
    probe-e2-reload.js: 3 nodes stored before the reload, 1 after — touch on, off, and phone alike): the one-time prune of the OLD
    starter's empty sections runs on the first load that FINDS a saved site without the "cleaned" flag — a new visitor's first load
    finds nothing and never set it, so their FIRST RELOAD pruned the page they had just built, every empty block with it. Both
    seeding helpers set the flag, so no spec ever began in a truly empty browser. → a fresh start is marked cleaned too. Guard:
    add-without-asking "a first visit's page survives its first reload" (red before: 3 → 1)
  - `[x]` E2-22 · REAL, PRE-EXISTING ON EVERY SCREEN, FOUND BY THE HEADED SMOKE RUN (U3 on the phone, built the phone's way —
    probe-e2.js sbs a): in a "Side by side" block filled with "Add a block inside" ×2, dragging the first column's right edge does
    NOTHING (both stay 100 % of their own bands, 18–591 / 609–1182, at 0.69, 0.47 and 0.22) — each column is wrapped in a band
    of its own inside the row, so its edge finds no partner. The columns of a Side by side cannot be sized against each other.
    DECIDED BY THE USER 2026-10-06 ("queue it with the resize work"): MOVED to BATCH L-5, in the place of #46 (which E-2 closed)
  - `[x]` E2-23 · REAL, THE CAUSE UNDER E2-11, FOUND BY THE HEADED SMOKE RUN (U3 tablet landscape) and a temporary trace: on a
    PAGE-GRID page (every page built today) the dragged edge is snapped to the grid's lines AND clamped to the page's edge, so
    `dx` stopped at the line's end (282) while the hand went on (456) — and the wrap point, 24 screen px past the neighbour's
    floor, lies past the page's edge on any line drawn under ~600px: A held at 96 % however far the pointer went. → the pull reads
    the HAND (`handDx`, before any snap). Guard: width-round-trip "keep pulling wraps the neighbour on a page-grid row drawn
    small", built through the UI at 1024 × 768 (red before: 1150 / 50)
  - `[x]` E2-24 · REAL, PRE-EXISTING ON EVERY SCREEN, FOUND BY THE HEADED PASS (U5, built through the UI; the same on a 1280 desktop
    window) — the user: "fix it now in E-2": on a page-grid page (every page built today) a block dropped into the empty space
    under a short column landed 0.3px tall, invisible. Pulling a block's BOTTOM edge up on a page-grid row keeps the row's height
    as that block's `margin-bottom` (200) — so the hole IS the target's margin, and carried into the new column it took the whole
    height. The hole ABOVE was already handed over (`marginTop`); the hole BELOW was not. → `stackWithBlock` clears the target's
    `marginBottom` when the newcomer goes after it. Guard: box-model.test.ts "the hole BELOW is handed over too" (red by mutation)
    and the headed U5 (the seeded spec builds a flow row, where the hole is not a margin)
  - `[x]` E2-20 · DECIDED BY THE USER 2026-10-06 ("queue it, research first"): on a phone the open blocks panel covers the whole
    canvas (12–332 of a 394 screen, the canvas 68–342; probe-e2.js phonePanel), so a block cannot be DRAGGED beside / under / into
    another — tapping a tile still adds one after the selection, "Side by side" still makes a row, "Add a block inside" still nests.
    New behaviour, so RULE RS: QUEUED as BATCH E-5 below. E-2's phone UAT builds the way a phone user can today
  - `[x]` E2-10 · MINE, FROM E2-2: 22 OTHER desktop specs fail once Full width is the desktop page drawn at 0.69 (`logs/e2-others1.out`,
    40 tests): selection clicks on an empty block's middle (palette-adds-after 5 · selection-drills-inward 2 · pinning-warnings 4 ·
    add-grid-in-grid 2 · empty-box-height · add-inside-empty-box) · screen-px numbers (add-without-asking 2 · drag-grid-in ·
    empty-block-floor 3 · empty-box-height · pager-hero 2 · pinning-explained · resize-leaves-no-gap) · canvas vs export / anchored
    edges (advanced-css · layout-bands · page-height-is-content · image-intrinsic · pinning-holds 3 · pins-stack · float-pin ·
    parity-every-arrangement · width-round-trip · resize-leaves-no-gap 2 · drop-placement) — each measured: a spec on screen px,
    or a real scale bug (as E2-4 and E2-11 were). MEASURED, ONE BY ONE: TEST — the middle-click on an empty block's "+" (E2-9:
    palette-adds-after, selection-drills-inward, pinning-warnings, add-grid-in-grid, empty-box-height, add-inside-empty-box);
    screen px read as page px (add-without-asking, drag-grid-in, empty-block-floor, empty-box-height, pager-hero,
    pinning-explained, resize-leaves-no-gap:185, advanced-css, layout-bands, page-height-is-content, image-intrinsic — a scaled
    rect against a layout value; width-round-trip's `rowOf` mixed the two; parity's rounded screen px flipped on a sub-pixel);
    drop-placement's 36px precondition is E2-8's 48. REAL — E2-13 (resize-leaves-no-gap zv-6 / o2-f), E2-14 (pins-stack),
    E2-15 (pinning-holds ×3), E2-16 (float-pin), E2-17 (parity, once it compared page px). 29 specs on desktop: 246 / 246
  - `[x]` E2-3 · grid-cell-resize:159 (all three): the 90/10 grid's "eleven and one" — the same Full width mismatch as E2-2 (the
    phone rung stepping the row); re-measured after E2-2
  - `[x]` E2-4 · REAL, MEASURED (probe-e2.js spaceKept): first read as rounding in the spec (each scaled SCREEN edge rounded before
    subtracting — fixed: page px from the frame, the gap rounded once), it stayed 44 → 45; the STORED `marginTop` went 40 → 41 on a
    top-edge drag at 0.47 and 0.22 (40 kept at 0.52) — the drag rewrote the space the user asked for, re-derived from screen px
  - `[x]` E2-5 · TEST, MEASURED: float-round-trip:141 filled "Height" in an Inspector that starts as its tab under 64em (E1-2) → it
    taps the tab open as a person does (`openInspector`, as add-without-asking)
  - `[x]` E2-8 · REAL, FOUND BY probe-e2.js gridTop (phone, 0.25): a grid cell's top edge moved 0px — the press on "Resize top edge"
    landed on the Block toolbar, drawn 0.25rem above the block over the handle the c-21 rule draws OUTSIDE it (corners 14px out),
    true at any size for a block narrower than ~2× the toolbar → the toolbar 1rem clear (`mb-4` / `mt-4`, room check 36 → 48).
    Guard: chrome-follows-resize "a press on each handle of a narrow block lands on that handle"
  - `[x]` E2-9 · TEST: the specs selected an empty block by clicking its MIDDLE, where its "+" hint sits — on a shrunk canvas the
    hint covers it and the click opened "Add inside" ("could not select") → a quarter in, as grid-cell-resize already did
  - `[x]` E2-6 · phone only, 25 lines (grid-cell height ×4 · side-by-side ×6 · stack-under-column ×4 · vertical edges ×5 ·
    dropped-block :78 · float :156 …) — not yet measured (the phone's 10rem floor stepping the row, by G-3d's design?)
- `[x]` **BATCH E-3 · The Inspector's controls on a narrow screen** — CLOSED 2026-10-06 (HEADED UAT `scripts/uat/uat-e3-headed.js`, six windows, **297 checks 0 failed** (`logs/e3-uat2.out`), Preview at all 70 screens × 100 / 150 / 200 % text; gate: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,409 / 4,409 · `test:fast` 815 / 815 · `docs:build` SUCCESS; the four specs + builder-chrome-fits + the two that share `openInspector` 216 / 216 on all four projects; ledger E3-1 … E3-11 — E3-3 is the user's question) — QUEUED 2026-10-05 by the user (E1-5): spacing-gestures 12 ·
  masonry-builder 10 · canvas-zoom 3 · text-is-reachable 1 (26)
  - `[x]` THE TOP BAR IS ONE ROW FROM 1280 (D3-32, DONE: icons below 1600, the right-hand labels from 1800 — measured one row at every 20px from 1280 to 1920, E3-7; the user 2026-10-06 "yes, both"): measured 92px (two rows) at 1280 / 1366 / 1440,
    one row needs ~1480 → below that, Page check · Preview · Export · Reset and the "Add a band" text collapse to icons (tooltip and
    accessible name kept); `builder-chrome-fits.spec.ts` asserts one row at 1280 (its comment already says a wrap there is a regression)
  HEADED UAT CHECKLIST (written 2026-10-06 before the measuring; six windows, a pool that refills; fresh production build; built
  through the UI on tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, touch on, Inspector opened from its
  tab; the desktop 1280 · 1366 · 1536 for U7; the four themes rotated; Preview at all 70 screens):
  - `[x]` U1 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) spacing: a block's spacing slider swept, then across / down given their own value and handed back — the canvas shows each
    step as it moves, ONE Undo takes back the whole sweep, Ctrl+Z works with the slider still focused, two different controls are
    two Undos — each screen
  - `[x]` U2 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) masonry: a grid of pictures → Arrange → "Follow the picture" staggers the canvas, Rows tall / Start at row are gone inside
    it, "Even" puts every pixel back; the editor's gaps equal the Preview's at that screen — each screen
  - `[x]` U3 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) the device chip: the page column drawn in the editor is the one the chip asks for; every icon-only toolbar button has a
    name a screen reader says and a tooltip — each screen
  - `[x]` U4 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) zoom: − / + step from Fit and stop at 25 % / 400 %; the shortcuts act only with the pointer on the canvas; Ctrl + scroll
    zooms round the pointer, the plain wheel scrolls; Space + drag pans; an edge dragged at 200 % stores what it would at 100 %;
    the zoom is kept per device after a reload — each screen (pinch where touch is the only way)
  - `[x]` U5 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) words: a Heading / Text is reached by a tap anywhere across its words, typing lands where tapped (start of the line,
    the end), Enter / F2 / a letter on a selected block begins editing, a real drag on its handle still resizes with the far edge
    fixed — each screen
  - `[x]` U6 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) the blocks launcher sits beside the page, never on it — each screen
  - `[x]` U7 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) the top bar (D3-32): ONE row at 1280 · 1366 · 1440 · 1536 and 1920; below ~1480 Page check · Preview · Export · Reset and
    "Add a band" are icons with a tooltip and the same accessible name, each still does its job (click + keyboard); nothing off
    screen from 375 to 1920, the page never scrolls sideways — the four themes
  - `[x]` U8 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) Preview at all 70 screens of the pages built in U1–U6 (100 / 150 / 200 % text): no sideways overflow, no overlaps
  - `[x]` U9 (SEEN 2026-10-06, `uat-e3-headed.js` 297 / 0) docs (RULE DOCS): the reference pages for spacing, masonry, zoom and the top bar say what a person sees on a tablet and
    a phone, and show the icon-only top bar
  MEASURED 2026-10-06 at `4fcf59a` (HEADLESS GATE, fresh build on 3100, `logs/e3-measure.out`): **28 fail, 59 pass** — spacing-gestures
  12 (portrait 6 · phone 6) · masonry-builder 10 (portrait 5 · phone 5) · canvas-zoom 3 (the Ctrl + scroll test on all three) ·
  text-is-reachable 3 (phone). The handover's 26 counted canvas-zoom on two screens; tablet landscape fails it too.
  LEDGER E-3 (each written the moment it is found):
  - `[x]` E3-1 · CLOSED: one shared `openInspector` in `tests/e2e/helpers/seed-site.ts`, the two copies removed; spacing 18 / 18 on all projects — TEST (spacing 12): under 64em the Inspector starts as its tab (E-1's design), the spec looks for its sliders without
    opening it; the same `openInspector` is copied in two specs already → one shared helper, used by all
  - `[x]` E3-2 · CLOSED: the spec taps the tab as a person does; masonry 28 / 28 — TEST (masonry 10): the same — the page loads at the project's width (Inspector a tab), THEN the spec widens the
    window to 1800 and the Inspector stays a tab (it starts closed below 64em and is never opened by widening — E-1's start rule)
  - `[x]` E3-3 · DECIDED BY THE USER 2026-10-06 ("we'll go with what you recommend"): the Inspector FOLLOWS THE WIDTH at every crossing of 64em, as on load — docked open when the window widens past it, back to its tab when it narrows; a person's own tap holds until the next crossing → built as BATCH E-4 change (1). The question was: should the Inspector open by itself when a window WIDENS past 64em (a tablet turned to landscape, a
    browser window dragged wider)? Today it keeps the closed state it started with until the tab is tapped
  - `[x]` E3-4 · CLOSED: the wheel sent × devicePixelRatio; canvas-zoom 28 / 28 — TEST, MEASURED (probe-e3.js wheel): the product zooms exactly z0 · e^(−deltaY · 0.0015) on every screen (0.83 → 1.51 for
    −400, → 1.12 for −200); Playwright's `mouse.wheel(0, −400)` under device emulation ARRIVES as −400 ÷ devicePixelRatio (−200 at
    DPR 2, −145 on the Pixel 5) — a real wheel notch is CSS px at any density → the spec turns the wheel by the same CSS px on every
    screen
  - `[x]` E3-5 · CLOSED: `caretFallthrough` hands a still tap to the block under a PARENT's handle (never the handle's own block); guard text-is-reachable "on a phone, a tap…" red on the old build; HEADED: phone 9px heading stack → heading, tablets too — REAL, MEASURED (probe-e3.js select … mid): on the phone (0.22) a heading at the top of its section is 9px tall; with the
    section selected its "Resize top edge" handle has no room above the page top and lies over the heading's middle — every further
    tap lands on the handle and the heading can NEVER be selected by tapping its words (desktop / tablets: the second tap selects
    it). A tap that does not move must fall through a PARENT's handle to the block under it, as it already does for the selected
    block's own words
  - `[x]` E3-6 · CLOSED: the frame read in page px, the gap compared in screen px; add-without-asking green on all projects — TEST (add-without-asking :282 on tablet landscape and phone, not in E-2's set): it compares the page's bottom frame in
    SCREEN px (padding × scale, 4.2px at 0.26) with 8 — since E2-2 (Full width = the shrunk desktop page) a tablet's 1rem frame is
    under 8 screen px → measured in page px, as E-2's specs were moved
  - `[x]` E3-7 · CLOSED: `WIDE_LABEL` 1600 · `WIDER_LABEL` 1800 (`app/website/box-demo/page.tsx`); builder-chrome-fits sweeps 1280 – 1920 every 20px; HEADED U7 one row at 13 widths × 4 themes — REAL, MEASURED (header height, 1279 … 1920, on the build with D3-32's first cut): two rows (93px) at 1480 – 1536
    (my threshold too low: Reset gained an icon) AND at 1700 — the right-hand group's labels (Guides · Hidden · Base size · the theme
    name, `min-[1700px]`, G2-8) appear there while the bar needs ~1750 for them → both thresholds set from the measurement, and the
    spec asserts one row at EVERY width from 1280 to 1920 in 20px steps, not at chosen ones
  - `[x]` E3-8 · CLOSED: every check measured from where it starts; the closing pass 297 / 0 — TEST, MINE (uat-e3-headed.js SP, first headed run): it expected the seeded spec's absolute values (12, 5, 8), but a grid
    BUILT THROUGH THE UI starts at the default spacing (17px, space by default) — the readings 29 · 22 · 25 are 17 + 12 · 17 + 5 · 17 + 8,
    the behaviour right → the checks measured from the starting value. Same run, same kind: the top-bar slice still used 1480 (the
    product moved to 1600, E3-7) · the pan started at the scroll's end on the phone and with the new Stack still selected · the
    palette floats over the canvas on a tablet held upright too, so portrait builds with the toolbar's "+" as the phone does
  - `[x]` E3-9 · CLOSED: `onClose` through a ref, the listener added once per opening (`components/shared/Modal.tsx`); unit guard red on the old Modal; HEADED U7 × 4 themes — REAL, FOUND BY THE HEADED PASS (U7, all four themes), MEASURED (listener trace): **Escape never closes the Page check**
    (nor twice). The builder's own Escape handler (deselect) runs first; React renders between the two document listeners, and the
    shared Modal's effect — keyed on an `onClose` that is new every render — removes and re-adds its listener mid-dispatch, so it is
    never called (the listener-churn trap). Shared `components/shared/Modal.tsx`: every modal over a page that re-renders
  - `[x]` E3-10 · CLOSED: `modalOpen()` (`components/website/box/ui.tsx`) — undo / redo, the canvas's keys and the Inspector's Escape wait while a dialog is open; browser guard red on the old build — REAL, MEASURED (probe): with the Page check OPEN, Ctrl+Z undid the band behind it (3 blocks → 1) — the canvas's keys
    act on the page under a modal dialog
  - `[x]` E3-11 · CLOSED: the panel takes the focus when it mounts (unless something inside did), the opener gets it back; unit guard red on the old Modal — REAL, MEASURED (probe): opening the Modal leaves the focus on the button behind it (`activeElement` outside the
    dialog) — a keyboard or screen-reader user is not taken into the dialog, nor returned when it closes (WCAG 2.4.3)
  - `[x]` NOT A BUG, MEASURED (HEADED U2): the page grid's "At least this many rows tall" is still offered in a masonry cell — given 12 rows the cell grows (251 → 288) and no cell overlaps another
- `[x]` **BATCH E-4 · Preview and components on small screens** — CLOSED 2026-10-06 (HEADED UAT `scripts/uat/uat-e4-headed.js`, six
  windows, **232 checks 0 failed** (`logs/e4-uat4.out`) + the slider as a real phone and tablet (`isMobile`) 4 / 0 (`e4-uat4m.out`), the
  Preview at all 70 screens × 100 / 150 / 200 % text; gate: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,423 /
  4,423 · **`test:fast` on ALL FOUR screens 3,272 / 3,272 in 12.3 min** · `docs:build` SUCCESS; ledger E4-1 … E4-14 — E4-9 and E4-14
  → BATCH E-5) — OPENED 2026-10-06 (after E-3 closed) — QUEUED 2026-10-05 by the user (E1-5): multipage-preview 5 ·
  pager-hero 1 · component-layout-invariants 1 (7) — and E-1's (2): the gate runs the tablet and phone projects when all are green
  (area: the editor on small screens · 3 changes: (1) E3-3 · (2) the seven specs, each measured · (3) E-1's (2) the gate runs the tablet and phone projects)
  HEADED UAT CHECKLIST (written before the pass; the lines for (2) are added after its specs are measured, before the pass):
  - `[x]` U1 (SEEN 2026-10-06, `uat-e4-headed.js` 66 / 0 incl. the Preview at all 70 screens × 3 text sizes) (1) E3-3: open the builder at 768 × 1024 (Inspector a tab), widen the window to 1280 — it docks open; narrow back to 768 —
    it is a tab again; tap it open at 768 and widen — it stays open; collapse it at 1280 and narrow then widen — it follows the width;
    also 1023 ↔ 1024 (the crossing itself) and a phone 393 ↔ 1024 — each in the four themes
  - `[x]` U2 (DONE 2026-10-06) docs (RULE DOCS): the layout story's tablet section says the Inspector follows the width
  - `[x]` U3 (SEEN 2026-10-06, HEADED `e4-uat4.out` 232 / 0 + `e4-uat4m.out` 4 / 0, screenshots read) (2) E4-3: open Preview at 393 · 768 · 1024 · 1280 · 1536 — the bar never runs off the right edge (bar scrollWidth ≤ window),
    every control on screen and usable (Pages tab switches page, screen-size menu opens, Rotate toggles with a preset, Hide hides),
    the bar wraps onto more rows when narrow and is one row at 1280+; in the four themes
  - `[x]` U4 (SEEN 2026-10-06, HEADED `e4-uat4.out` 232 / 0 + `e4-uat4m.out` 4 / 0, screenshots read) (2) E4-4: hide the controls (button and H) at 393 · 768 · 1280 — the Controls handle and Exit preview sit together
    bottom-right, nothing at the top centre; a header link the person built at the top is tappable; the handle brings the bar
    back, Exit leaves; focus-visible on both by Tab; four themes
  - `[x]` U5 (SEEN 2026-10-06, HEADED `e4-uat4.out` 232 / 0 + `e4-uat4m.out` 4 / 0, screenshots read) (2) E4-5: open Preview on a site with a school font at 393 · 768 · 1280 — the frame loads ONCE (navigations counted),
    the font is the school's (not the fallback), a scroll made at once is not wiped; switch page by the tabs — still the school's font
  - `[x]` U6 (SEEN 2026-10-06, HEADED `e4-uat4.out` 232 / 0 + `e4-uat4m.out` 4 / 0, screenshots read) (2) E4-2: a pager with auto-advance opened in Preview by a TAP on a phone and a tablet — it advances; hovering (mouse,
    desktop) and focusing (Tab) hold it
  - `[x]` U7 (SEEN 2026-10-06, HEADED `e4-uat4.out` 232 / 0 + `e4-uat4m.out` 4 / 0, screenshots read) (2) E4-1: the component invariants on the canvas at phone / tablet / desktop — a hug alert, a badge and a floated item
    look right at every scale (screenshots read)
  - `[x]` U8 (DONE 2026-10-06: `docs/guide/website-builder.md` Preview section + `box-builder-site.feature`; docs:build SUCCESS) docs (RULE DOCS): the guide's Preview section — the bar wraps on narrow screens, the Controls handle sits beside Exit
  - `[x]` CHANGE (1) E3-3 BUILT 2026-10-06: `app/website/box-demo/page.tsx` follows the 64em media query's `change`; guard builder-chrome-fits "the Inspector follows the width…" red on the old build; 156 / 156 on all four projects; HEADED 66 / 0; gate typecheck 0 · eslint 0 errors · vitest 4,418 · test:fast 816
  - `[x]` CHANGE (2) BUILT 2026-10-06 — the seven were 24 once measured, then 13 more on the phone (E4-1 … E4-13); every spec green on all four projects the seven specs, each measured (multipage-preview 5 · pager-hero 1 · component-layout-invariants 1)
  - `[x]` CHANGE (3) BUILT 2026-10-06 — `test:fast` runs all four projects at 8 workers: 3,272 / 3,272 in 12.3 min; guard `test-scripts.test.ts` (red without the phone) E-1's (2): `scripts/test-fast.js` runs the tablet and phone projects too
  LEDGER E-4 (each written the moment it is found):
  - MEASURED 2026-10-06 (HEADLESS GATE, fresh build `hhvY26hyJDD84Vm-8oG5E` on 3100, `logs/e4-small3.out`): the three specs on
    tablet-landscape / tablet-portrait / mobile-chrome — **24 failed / 228 passed**, not the 7 the handover counted (E-3 left more
    of them failing on the phone). Probe (`zz-probe-e4`): the canvas is the 1200px Desktop frame drawn at `scale()` to fit —
    0.69 at 1280 · 0.47 at 1024 · 0.52 at 768 · 0.22 at 393.
  - `[x]` E4-1 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · BUG IN THE TEST: `component-layout-invariants` measures SCREEN px (`getBoundingClientRect`) of a SCALED canvas
    against LAYOUT-px floors (8 · 40 · 160 · 22rem · 2px tolerances) — 18 cases fail on the phone/tablets (badge/rating height 7.3
    < 8, a floated item 36 < 40, the hug alert 114 < 160, the 22rem container rule compared with a scaled width), and the desktop
    case passes only by luck (hug alert 167 vs 160 at 0.69). Fix: every measurement divided by `data-canvas-scale`.
  - `[x]` E4-2 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · BUG IN THE TEST: `pager-hero` "moves on its own" fails on the phone — the spec opens the Preview with a MOUSE click,
    and on a 393px phone the Preview button (157, 49) sits over where the strip appears, so the parked cursor reads as a hover and
    the pause holds (probe: `:hover` true, no scroll in 4.5s). A real TAP leaves no hover — the strip advances on phone and tablet
    (probe: x 0 → 1170 / 2236). Not a product bug. Fix: `published()` taps on a touch project, clicks on desktop.
  - `[x]` E4-3 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG: the Preview's bar does not fit a tablet portrait or a phone — its right-hand group is a rigid 771px
    (`shrink-0`), so at 768 and 393 the bar's content is 879px wide and runs off the right edge (the size readout cut at
    "768 px ·", the zoom / rotate / hide controls off screen), and the Pages tabs are squeezed to **0px** — a person cannot switch
    pages from the toolbar at all (probe + screenshots, `multipage-preview` "the preview's OWN toolbar" fails at 768 and 393).
    Fix: the bar WRAPS onto more rows (and the group within it) instead of overflowing; it grows downward and still hides.
  - `[x]` E4-4 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG: with the controls hidden, the "Controls" handle sits at the TOP CENTRE of the page — on a phone that is
    over the user's own heading and header links ("Welcome to ou▒▒l", screenshot; `multipage-preview` "a header the USER built"
    cannot click its Home link at 393 / 768 / 1024). Fix: the handle joins the Exit pill in the bottom-right corner — one corner
    reserved for the preview's chrome, the header the person built left uncovered.
  - `[x]` E4-5 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG (found as a flake: `pager-hero` auto-advance, tablet-landscape, "Execution context was destroyed" once in
    the 4-project run, 224 / 224 repeated alone): EVERY Preview open loads the page TWICE, on all four projects (probe: the frame
    navigates at ~60ms and again at ~400–500ms) — the school's fonts (`embedFontCss`) were a dependency of the page source, so their
    arrival rebuilt the whole page: twice the work on a phone, and a scroll / tap / running pager in the first 400ms wiped. Fix:
    the fonts are held in a ref and put into the OPEN page as a `<style>` (on arrival and on every load). Guard
    `multipage-preview` "opening the Preview loads the page once, fonts included" — red on the old build (all projects).
  - MEASURED 2026-10-06 for change (3) (HEADLESS GATE, every `test:fast` spec on tablet-landscape / tablet-portrait / mobile-chrome,
    `logs/e4-small-all2.out`): **2,438 passed · 13 failed, in 9.5 min at 8 workers** — all 13 on the phone, the same 13 alone
    (`e4-phone5.out`). The first attempt at 3 workers was on course for ~4 h with the CPU at 2 % (the user: "faster than that") —
    the workers, not the tests, were the limit.
  - `[x]` E4-6 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG: a resize drag's 8px floor (`BoxCanvas` `minWpx` / `minHpx`) was in SCREEN px while every other size in the
    drag is scaled by `Z` — so on a phone's 0.22 canvas the smallest a box could be dragged to was 36px of PAGE (8 / 0.22), and the
    saved page depended on the zoom it was edited at (`empty-box-height` ×5 on the phone: 36 vs < 20). Fix: `8 * Z`, the engine's
    own page-px floor.
  - `[x]` E4-7 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · BUG IN THE TEST: `add-inside-empty-box` ×3 compared screen px of the scaled canvas with the 2.5rem (40 / 80px) PAGE
    floors (24 vs 39 on the phone; the floor itself measured 110 layout px on every project). Fix: `pageBox()` reads page px.
  - `[x]` E4-8 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · BUG IN THE TEST: `build-from-blank` ×3 aimed its first drop a fixed 60 screen px down a blank page that is 35px tall
    on the phone — below the page. Fix: inside the page at any scale.
  - `[x]` E4-9 (TEST FIXED 2026-10-06; the finger-size question → BATCH E-5) · BUG IN THE TEST: `drop-placement` "its BOTTOM edge" aimed 12px above the bottom of a block 37px tall on the phone;
    the strips are 25 % of the DRAWN height (9px there), so 12px is the middle. Fix: aim inside the strip. Whether a 9px strip is
    enough for a FINGER at a 0.22 canvas is the question BATCH E-5 (adding and placing on a phone, research first) exists for →
    BATCH E-5.
  - `[x]` E4-10 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · BUG IN THE TEST: `side-by-side-drop` ×2 used fixed screen distances (100 · 60 · 8 · 4px) on the scaled canvas.
    Fix: multiplied by the canvas scale; the drop aims at the middle of the row's side space.
  - `[x]` E4-11 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · MY OWN, IN A TEST: change (3)'s new guard in `test-scripts.test.ts` read `playwright.config.ts` without stripping
    carriage returns — caught by `source-reading-tests` (vitest 4,422 / 4,423). Fixed; both guards 105 / 105.
  - `[x]` E4-12 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG (HEADED UAT, `e4-uat1.out`: "Exit leaves the Preview" FAIL at 393 and 768 in every theme): with the controls
    hidden, TAPPING Exit preview did not exit — the pill brought the bar back on `pointerenter`, a finger "enters" at the moment it
    taps, so the pill unmounted and the click landed on nothing. Fix: only a MOUSE brings the bar back on hover (the pill and the
    top-edge reveal alike). Guard `multipage-preview` "with the controls hidden, Exit preview leaves…" — red on the old build on
    all three touch projects.
  - `[x]` E4-13 (FIXED 2026-10-06, guard green on all four projects; HEADED 232 / 0) · REAL BUG (HEADED UAT `e4-uat2.out`, a Slider built through the UI, "Move on its own every 2s"): on a phone and a
    tablet the slider NEVER moved — the tap that opened the Preview left the browser's hover stuck over the strip (`:hover` true,
    measured as a touch laptop AND as a real phone/tablet, `isMobile`), and the pager pauses on `mouseenter`. The same freezes a
    published slider for a visitor whose tap leaves a hover on it. Fix (`pagerWire`): hover pauses it only where the device CAN
    hover (`(hover: hover)`); on a touch screen a FINGER ON IT (`pointerdown`) is what stops it; focus stops it everywhere.
    Guard `pager-hero` "moves on its own, and HOLDS STILL…": a stuck hover on a touch screen does not stop it, a tap does — red on
    the old build on every touch project.
  - `[x]` E4-14 · FOUND IN THE HEADED PASS (`CO-393-U7-components.png`), HANDED ON → BATCH E-5: on a phone the canvas opens as the
    1200px Desktop page at **22 %** — an Alert and a Badge a few pixels tall, the block's own toolbar bigger than the block. Correct
    to the model (every invariant holds in page px) and unusable for a finger. How a phone EDITS is the question BATCH E-5 was queued
    to research first (the user, E2-20), so it is answered there, not patched here.
- `[>]` **BATCH E-5 · Adding blocks on a phone** — OPEN 2026-10-06 on `builder/phone-editing` (cut from master `05c66ee`), research first — QUEUED 2026-10-06 by the user (E2-20: "queue it, research first") (area: the editor
  on a phone · adding and dropping): the open blocks panel covers the whole canvas on a phone, so a block cannot be dragged beside,
  under or into another. RULE RS FIRST: the user's sources and mine (how phone editors — Wix, Canva, Webflow, Framer — add and place
  blocks: a bottom sheet that leaves the page showing, tap-to-place, a placement target after picking), an "enough" checklist the
  user signs, THEN the build
  - `[>]` (1) the research and its signed "enough" checklist — stored in `docs/web-anatomy/phone-editing.md` (extends
    `editor-zoom.md` and the touch floor in `components.md`, never redoes them)
    - `[>]` (1a) THE USER'S SOURCES (2026-10-06), each read completely with its on-topic links (RULE R):
      https://support.wix.com/en/article/wix-editor-getting-started-with-the-mobile-editor ·
      https://help.one.com/hc/en-us/articles/360002274197-Using-the-Mobile-view-editor-in-Website-Builder
    - `[>]` (1b) MY OWN, in parallel: editing ON a phone in Canva · Squarespace · Webflow · Framer · Google Sites · Shopify · WordPress ·
      Carrd · Notion · the Wix app; WCAG 2.5.8 / 2.5.5, Apple HIG, Material touch targets; the pattern catalogue
    - `[x]` (1a) and (1b) READ 2026-10-06 — 31 + 50 pages, combined in `docs/web-anatomy/phone-editing.md` (§7 completeness)
    - `[x]` (1a-open) READ 2026-10-06 (`phone-editing.md` §8) — the user's sources' last on-topic links (RULE R): Wix browser-theme-colour · new quick action bar
      (switching / managing / customizing) · shape dividers on mobile · mobile-menu characters · drop-down arrow colour · supported
      browsers · Wix Owner app overview — peripheral to building on a phone; read before E-5's build closes
    - `[>]` (1c) THE "ENOUGH" CHECKLIST (RULE MAP, `phone-editing.md` §5) — WAITING ON THE USER'S SIGNATURE:
      - `[x]` the two meanings of "mobile editing" separated: A (a desktop tool for the phone layout — we have it: the rungs) vs
        B (editing ON a phone — E-5)
      - `[x]` axis 1 what the phone canvas shows — zoomed desktop (ours) · the phone's own width 1:1 · + pinch — who and how
      - `[x]` axis 2 what a phone may change — content only · + order and hide · full building — who and how
      - `[x]` axis 3 which rung an edit lands on — content everywhere, layout on the phone only (our cascade already does it)
      - `[x]` axis 4 the picker — bottom sheet (partial, search, Close, Back) · full screen · list
      - `[x]` axis 5 where a new block goes — after the selection · Before / After / Inside / Start / End · "Add block here" in an
        empty box · at the end · in a list
      - `[x]` axis 6 moving — arrows (+ to top / bottom, ← → in a row) · long-press drag (chip, insertion line, auto-scroll)
      - `[x]` axis 7 selecting and settings — tap, contextual toolbar, settings sheet, plain questions
      - `[x]` axis 8 resizing — none · presets · handles
      - `[x]` axis 9 finger floor — 24px AA (spaced) · 44px AAA / Apple · 48dp Android · edges 10–12mm, centre most accurate
      - `[x]` axis 10 the non-drag route for every drag (WCAG 2.5.7)
      - `[ ]` GAPS, carried to the build: a TABLET (768 / 1024) between phone and desktop · Canva's phone gestures (did not load) ·
        Webflow's own page (403) · a real low-cost Android (RULE AF) measured once built · teachers using it (the pilot, RULE RK)
      - `[x]` THE USER'S DECISIONS — SIGNED 2026-10-06 ("go" = my recommendation in each; the checklist above is signed with them):
        D1 a phone edits the page at the PHONE'S OWN WIDTH, 1:1 — a switch shows the desktop page ·
        D2 a phone BUILDS: add, place, nest, reorder, hide, edit — content lands on every screen, order / hide / size on the phone only ·
        D3 "+" opens the picker in a BOTTOM SHEET (partial, search, the page showing); the block goes AFTER the selection, a menu
           offers Before / After / Inside / Start / End, an empty box shows "Add block here" ·
        D4 ↑ ↓ (← → in a row) + "Move to top / bottom", always there; long-press drag (a lifted chip, an insertion line) as the
           second way; every drag has a non-drag route (WCAG 2.5.7) ·
        D5 width by presets on a phone — Full · ½ · ⅓ · Fit — in the settings sheet; exact sizing stays a desktop job ·
        D6 every editor control and drop target on a touch screen is ≥ 44 × 44 CSS px
  - `[x]` (1d) SORTED 2026-10-06 after the code map (canvas `page.tsx` :615-652 / `CanvasZoom.tsx`; adding `insertBlock` :791 →
    `paletteClickSlot` / `insertBox`; moving `moveBoxStep` / `moveBox`; toolbar `NodeToolbar` BoxCanvas :3677; width
    `WidthControl` BoxInspector :196; NO touch handling anywhere; resize / drag are mouse-only):
    - **E-5a** (below, OPEN) · D1 · D3 · D4 arrows · D5 · D6 — 6 changes
    - **E-5b** (CLOSED 2026-10-07, see below) · D4's long-press drag (a touch path for drag: chip, insertion line, auto-scroll) · touch resize on the
      handles · drop strips ≥ 44px (E4-9)
    - **E-5c** (CLOSED 2026-10-07 — the tablet; the app → BATCH E-5d) · the tablet (600–1023): what it edits at, the sheet or the side panel · then `apps/mobile/` (rule 20: a
      webview over the same editor, phone AND tablet)
  - `[x]` **E-5a · Building on a phone** — CLOSED 2026-10-07 (HEADED UAT `scripts/uat/uat-e5a-headed.js`, six windows, real phones (`isMobile`) 360 × 640 · 393 × 851 · 412 × 915 in the four themes + 600 / 768 / 1280 unchanged, **258 checks 0 failed** (`logs/e5a-uat9.out`), the Preview at all 70 screens × 100 / 150 / 200 % text; gate: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,442 · `test:fast` 3,312 on all four screens · docs:build SUCCESS; ledger E5a-1 … E5a-19, E5a-1 → BATCH E-5b; the user's decisions E5a-7 and E5a-16) — OPENED 2026-10-06 (area: the editor on a phone · 6 changes):
    (1) D1 under 37.5em (the phone rung) the canvas opens on the Mobile device at the PHONE'S OWN WIDTH, 1:1 — no "Fit · 22 %"; the
        launcher gutter and the rail shrink; the device control still shows the desktop page
    (2) D3 the blocks panel is a BOTTOM SHEET on a phone: partial height, the page above it, grab bar, Close, Escape, search
    (3) D3 where it goes: "After" the selection by default, and Before · After · Inside · Start · End in the sheet; an empty box's
        "Add block here" — one engine function `insertWhere()`, unit-tested
    (4) D4 ↑ ↓ in the block toolbar (← → inside a row), Move to top / bottom in ⋮ — whole bands step on the page; disabled at the ends
    (5) D5 width presets Full · ½ · ⅓ · Fit for every block in the Inspector, written at the rung being edited
    (6) D6 on a touch screen (`pointer: coarse`) every editor control is ≥ 44 × 44 CSS px — the toolbar, the "+", the tiles, the
        sheet, the handles' hit areas; a mouse keeps today's sizes
    HEADED UAT CHECKLIST (written before the pass; six windows; fresh production build; touch on, `isMobile`; phones 360 × 640
    (Tecno / itel class) · 393 × 851 · 412 × 915, and 600 / 768 / 1280 to prove nothing changed above the phone; four themes; built
    through the UI):
    - `[x]` U1 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (1) a phone opens on Mobile at 100 %, words readable; an edit made there lands on the phone only (Desktop unchanged);
      choosing Desktop shows the desktop page; reload keeps it; at 600+ today's behaviour
    - `[x]` U2 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (2) the launcher opens a bottom sheet — the page still showing above it, search finds a block, Close / Escape / Back
      close it and focus returns to the launcher
    - `[x]` U3 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (3) select a block → add with After (default), Before, Inside, Start, End — each lands where it says (seen AND in the
      stored tree); nothing selected → the end; an empty box's "Add block here"
    - `[x]` U4 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (4) ↑ ↓ / ← → move a block and a whole band; Move to top / bottom; disabled at the ends; Undo puts it back
    - `[x]` U5 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (5) Full · ½ · ⅓ · Fit on a phone write the phone only; on desktop, desktop; the Preview at all 70 screens agrees
    - `[x]` U6 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) (6) every control measured ≥ 44 × 44 on touch at every phone size; a mouse at 1280 unchanged
    - `[x]` U7 (SEEN 2026-10-07, HEADED `e5a-uat9.out` 258 / 0 on the final build, screenshots read) docs (RULE DOCS): "Editing on a phone" in `docs/guide/` + the layout story; screenshots from the real builder
    LEDGER E-5a (each written the moment it is found):
    - `[x]` E5a-1 · HANDED ON → BATCH E-5b (its header names it) · REAL BUG, FOUND IN THE CODE MAP (BoxCanvas `startResize` / `startDrag` on `onMouseDown`, document `mousemove`):
      resizing and dragging a block listen to the MOUSE only — a finger on a real phone or tablet sends no mouse drag, so nothing
      can be resized or dragged by touch anywhere. E-2's tablet guards drove them with a mouse in a touch-enabled window, so they
      passed. → BATCH E-5b (the touch path for drag AND resize, by pointer events), which is what E-5b is for.
    - `[x]` E5a-2 · MY OWN (FIXED 2026-10-07): change (4)'s arrow keys moved a block on Alt+← / → too, where Alt+arrows belong to
      the column span — caught by `PageGridPanel.test.tsx` "without the page grid nothing happens". The arrows now ignore Alt; the
      unit guard green.
    - MEASURED 2026-10-07 (HEADLESS GATE, `test:fast` all four screens, `logs/e5a-testfast1.out`): **3,236 passed · 60 failed** —
      the phone's new default and the finger sizes met specs written for the old ones; sorted below, re-run `e5a-rerun1/2.out`.
    - `[x]` E5a-3 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · MY OWN, REAL: the Inspector rail's open button became 44px inside the 44px rail (43 inside its border) — half
      a pixel over, and every page on a tablet portrait or a phone scrolled SIDEWAYS (probe: scrollWidth 769 of 768, the button at
      768.5). Fix: the rail is 48px on touch. (~16 "nothing spills sideways" failures)
    - `[x]` E5a-4 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL: the block toolbar hangs from the block's LEFT edge; a finger's size since change (6), it ran 17px off a
      393 phone for any block in the right half (probe: bar 175–411 on a 394 screen). Fix: a block in the right half hangs it
      from its RIGHT edge (`toolbarRight`, measured with `toolbarBelow`).
    - `[x]` E5a-5 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL: a picker opened from the phone's sheet (Grid's layouts, a block's looks) closed the instant it appeared —
      the scroll that brought the tile into view arrives a frame late and `PortalMenu` closes on any outside scroll (probe: menu
      [] ; with the scroll settled first, the menu opens). A finger's flick still settling under a tap does the same. Fix:
      `PortalMenu` arms its scroll-close two frames after opening. (`add-grid-in-grid` ×3 on the phone)
    - `[x]` E5a-6 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · BUGS IN THE TESTS (they assumed the old phone default or a mouse's sizes): the specs that test the DESKTOP page
      on a phone now choose Full width as a person does (`desktopPageOnAPhone` in `helpers/seed-site.ts`, also after a reload in
      `text-is-reachable` E3-5); `drop-placement` counted the drag grip that is not shown to a finger; `empty-box-height` aimed
      its select click where a finger-sized "+" now sits.
    - `[x]` E5a-8 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL BUG, every screen (found as `empty-box-height` "a grid CELL's row shrinks" failing only on the phone;
      bisected with two builds on 3200 and an instrumented one): pressing a block's resize handle PINNED it (its height,
      `alignSelf`) and COMMITTED the pin at once — a click that never moved kept it, and for a corner the release never took it
      back. The spec's second select-click landed on the grid's top-left corner (where it lands depends on the canvas scale —
      why only the phone's new 0.27 showed it): `minHeight: 128` stored on the grid, its empty cells could no longer be dragged
      below it. Fix: the pin lands with the first MOVE (every move builds on it); a still click commits nothing. Guard
      `phone-editing` "a still click on any handle leaves the page exactly as it was" — red on the old build on all four projects.
    - `[x]` E5a-9 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (MY OWN, change (6)): an empty box's "+" became 44px on touch even on a ZOOMED canvas — on the phone's
      desktop page (0.27) a 100px box is drawn 27px tall, so the "+" covered all of it and a tap meant to select the box opened
      "Add a block inside" instead (probe: three taps → `null`, the menu open). Fix: on touch the "+" is
      `min(2.75rem, 60%)` of its box — a finger's size wherever the box has room (the phone's own 1:1 view), never the whole of a
      small box.
    - `[x]` E5a-10 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · BUGS IN THE TESTS: `add-without-asking` "three Stacks in a row" and `photo-gallery` "the Replace button…"
      assumed the panel STAYS open after an add (the docked one does); on a phone the sheet puts itself away (D3), so the first
      tapped a tile no longer shown and the second's "B to close" OPENED it again over the photographs. Both open / close it
      only as needed.
    - `[x]` E5a-11 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (MY OWN, change (6)): the bar goes below a block with no room above it, and "room" was the MOUSE bar's
      32 + 16px — a finger's bar is 52px, so a block 48–68px down the page hung its bar over the app's header (c-20 again, on
      touch). Found through `selection-drills-inward`, whose "bare canvas" point was the 52px bar hanging under the page (test
      fixed to aim below the bar). Fix: on touch the bar needs 68px above. Guard `phone-editing` "the selected block's toolbar
      never sticks out above the page" — red on the old build on the phone (block 58px down).
    - HEADED UAT 1 (2026-10-07, `logs/e5a-uat1.out`): 105 checks, 32 failed — sorted below (and the script's own: the 600px
      launcher check assumed a one-row bar; the NC runs closed the panel with Escape, which also deselected the block; Divider and
      Spacer open a looks menu the script never answered).
    - `[x]` E5a-12 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (a gap in change (6)): on a phone the top bar's page tab (69 × 24), Add page and Page settings (28 × 28)
      and the device chips (34 wide) are under a finger's size — they are not built from the shared controls the floor reached.
      The headed passes then listed EVERY control under 44px, screen by screen, and each was fixed AT ITS SOURCE, so every use is
      covered: `Segmented` icon options (min width) · `CompactSelect` trigger and options · `ThemeSwitcher` trigger ·
      `COMPACT_INPUT_CLS` (every Inspector text / number field) · `Slider` (a 44px hit band, the 8px track kept by
      `bg-clip-content`) · the Inspector `Tabs` · the per-side spacing fields · both nine-dot position pickers · "Back to
      default" and "Reset phone change" · the lock row · every checkbox LABEL row · `EducoColorField` (swatch, hex field,
      eyedropper, palette, its menu rows and palette swatches). Deliberate limit: the colour menu's OKLCH spectrum grid stays a
      dense picker (a 44px cell would make it hundreds of px wide) — the palettes and the hex field above it are the finger route.
    - `[x]` E5a-13 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL: Escape (and ✕) put the sheet away and left focus on nothing — it must go back to the "+" that opened it
      (WCAG 2.4.3, the U2 line).
    - `[x]` E5a-14 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (`PH-393-*-error.png`): on a phone the selected block's toolbar — a finger's size — hangs over the block
      below it and covers most of its width; a tap meant for that block lands on the bar (the script's tap timed out exactly so).
      The research's answer (WordPress's phone editor): the block toolbar DOCKS at the bottom of a phone's screen — never over the
      page, under the thumb.
    - `[x]` E5a-15 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (`PH-360-*-error.png`): on a 360 × 640 phone the top bar wraps to FOUR rows (~250px) and the sheet takes
      60 % — almost none of the page is left in sight. → decided below (E5a-16).
    - `[x]` E5a-17 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · BUGS IN THE TESTS, from the phone bar and the docked toolbar (`test:fast` 54 failed, `logs/e5a-testfast4.out`):
      specs waited for the "Box Builder" title (not on a phone's one-row bar), pressed screen sizes / Reset / Show hidden / the
      chips straight on the bar (in More on a phone — `pressHeader()` in `helpers/seed-site.ts` reaches them as a person does),
      expected the toolbar by the block (docked on a phone), and `builder-chrome-fits` expected every control in a phone's bar
      (now: one row there, the rest asserted IN More). And one that never tested what it named: `parity-every-arrangement` "Grid in
      a stack" never answered the Grid tile's layout picker, so no grid was added — it passed on two stacks while the picker hung
      open (it only closed by the stray scroll E5a-5 fixed). It now chooses 2 across, as a person does.
    - `[x]` E5a-18 (FIXED 2026-10-07; gate green, HEADED 258 / 0) · REAL (MY OWN): Reset tapped in More opened its question, More closed, and my "focus back to More" (E5a-13)
      STOLE focus from the question's Cancel — so Escape and Enter spoke to the wrong thing. Caught by `reset-asks-first` on the
      phone ("Cancel is focused"). Fix: focus goes back only if nothing else has taken it. With it: More's ACTION row (Add page,
      Page settings, Add a band, Page check, Export, Reset) puts More away when tapped, as an action sheet does; its settings
      keep it open. And the touch bar's words appear from 1800 (they wrapped it at 1600); `pressHeader` waits for the bar to
      settle after a resize (masonry pressed a chip while the bar was still re-rendering).
    - `[x]` E5a-19 (FIXED 2026-10-07) · BUG IN A TEST — a flaky guard: `units-not-pixels` failed once in the closing vitest
      ("stat: 263px") and passed alone 3 of 3. It scanned whole CSS RULES, selectors included, and a block id is base-36 time —
      one that read "…263px…" was a stored pixel to it. Fix: only the declarations, only whole tokens; a check that an id like
      `box-mux263px-1` is not flagged (red with the old pattern) and a real `263px` still is. vitest 4,442 / 4,442.
    - `[x]` E5a-16 · DECIDED BY THE USER 2026-10-07 ("One row + More sheet", my recommendation) for E5a-12 + E5a-15: under 600px
      the top bar is ONE ROW of 44px controls — Pages, Undo, Redo, Preview and ⋯ More; More opens a bottom sheet with everything
      else (screen size, zoom, guides, theme, page check, export, reset, add a band). Built as part of change (6).
    - `[x]` E5a-7 · DECIDED BY THE USER 2026-10-07 ("Two rows at 1280 touch", my recommendation): on a TOUCH screen every control
      stays 44px and the top bar takes two rows at 1280, one row (65px) from 1366; with a mouse, one row from 1280 as D3-32 says.
      The question was: D6 (44px on touch) widens the top bar's 23 buttons from 910 to 1,012px, against E-3's "one row from 1280".
      Built: `builder-chrome-fits` asks one row from 1366 (≤ 72px) on touch, from 1280 (≤ 64px) with a mouse.
  - `[>]` (2) the build the research settles on, web phone first, then `apps/mobile/` (RULE APP) — E-5a CLOSED 2026-10-07; E-5b CLOSED 2026-10-07; E-5c CLOSED 2026-10-07 (the tablet); BATCH E-5d (the app) next
  - `[x]` E4-9 (DONE 2026-10-07 in BATCH E-5b change (5) + E5b-5 / E5b-13: a finger's drag reads strips of ≥ 44px, a third of a smaller block; a mouse keeps its own) (from BATCH E-4): the drop strips are 25 % of a block's DRAWN height — 9px on a 37px block at the phone's 0.22 canvas.
    Is that enough for a finger? The research answers it with the rest of placing on a phone. → BATCH E-5b (strips ≥ 44px, D6)
  - `[x]` E4-14 (DONE 2026-10-07 in E-5a change (1): the phone edits at its own width, 1:1) (from BATCH E-4): the phone canvas opens as the Desktop page at 22 % — blocks a few pixels tall, the toolbar bigger
    than the block. What a phone edits at (its own width? a zoom a finger can use?) is part of this research. → answered by D1,
    built in E-5a change (1)
  - `[x]` **BATCH E-5b · A finger drags and resizes** — CLOSED 2026-10-07 (HEADED UAT `scripts/uat/uat-e5b-headed.js`, six windows, real CDP touch on phones 360 · 393 · 412 (`isMobile`) and tablets 768 · 1024 in the four themes + the mouse at 1280, **206 checks 0 failed** (`logs/e5b-uat7.out`), the Preview at all 70 screens × 100 / 150 / 200 % text; gate: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,442 · `test:fast` 3,333 on all four screens (`logs/e5b-testfast2.out`) · docs:build SUCCESS; ledger E5b-1 … E5b-16) — part of BATCH E-5 (one open batch, RULE X; E5b-11) — OPENED 2026-10-07 (from E-5's research, D4 · D6; E5a-1; E4-9) (area: the editor
    on touch screens · 6 changes). MEASURED FIRST (code): `startResize` / `startResizeGridCell` / `startResizeAbsolute` / `startDrag` /
    `startFreeDrag` / `startSlideFree` and `caretFallthrough` start on `onMouseDown` and follow `document` `mousemove` / `mouseup`; the
    unit suite (`BoxCanvas.test.tsx`) drives them with `fireEvent.mouseMove(document)`, so the MOUSE path stays on mouse events and a
    finger gets its own start. Drop strips: `slotFromKids` min(25 %, 48px), `computeDrop` min(22 %, 22px). No auto-scroll anywhere.
      (1) E5a-1 a FINGER RESIZES: every handle starts the same gesture on a finger's `pointerdown`; a gesture follows the events that
          started it (a mouse: `mousemove` / `mouseup` as today; a finger or pen: `pointermove` / `pointerup`, `pointercancel` ends it);
          `touch-action: none` on the handles so the page does not scroll instead; rule 19 unchanged (the held edge is the only one
          that moves); a still tap on a handle still falls through (E3-5)
      (2) the GRIP is offered to a finger again (it was `pointer-coarse:hidden`): 44px, a press on it starts the drag at once (it is
          the explicit route); floating / Alt paths unchanged for the mouse
      (3) LONG-PRESS (500ms) on a block lifts it — a haptic tick where the phone has one, the chip 32px ABOVE the finger (never
          under it), the insertion line as today; a short tap still selects; a finger that moves before 500ms scrolls the page; the
          phone's own long-press menu / text selection does not appear on a lifted block
      (4) AUTO-SCROLL while a finger drags near the top or bottom of the editor's scrolling area, faster the nearer the edge
      (5) E4-9 DROP STRIPS on touch ≥ 44px (no more than a third of the block, so before / inside / after all stay reachable)
      (6) docs (RULE DOCS): "Building on a phone" in the layout story + the guide's phone page — drag, long-press, resize by finger
      HEADED UAT CHECKLIST (written before the pass; six windows; fresh production build; real phones `isMobile` + `hasTouch`
      360 × 640 · 393 × 851 · 412 × 915, tablets 768 × 1024 and 1024 × 768 with touch, four themes; 1280 with a MOUSE to prove it
      unchanged; the state built through the UI; touches sent as real CDP touch events, not mouse):
      - `[x]` U1 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (1) a finger drags each handle — n · s · e · w and a corner — on a block in a stack, a row, a grid cell and a
        floating block: the block changes size, the opposite edge stays where it was (rule 19), the page does not scroll; lift
        mid-way and the size stays; a still tap on a handle selects what is under it
      - `[x]` U2 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (2) where the toolbar sits by its block (tablets, 600+) the grip shows at 44px on touch; a finger dragging it moves the
        block and the stored tree agrees; Undo puts it back. On a phone the bar DOCKS, has no grip (a long press is the drag there,
        E5b-8), and ends before the blocks "+" with nothing scrolled out of sight, a Stack's bar included, at 360
      - `[x]` U3 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (3) a 600ms press lifts the block (chip above the finger, insertion line), the drop lands where the line said; a
        200ms tap only selects; a quick swipe scrolls the page and moves nothing; no phone menu or text selection appears
      - `[x]` U4 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (4) a finger held 20px from the bottom of the editor scrolls it down, and from the top scrolls it up, while lifted;
        it stops when the finger leaves the edge or lifts
      - `[x]` U5 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (5) the strips measured ≥ 44px (or a third of a smaller block) on touch; with a mouse at 1280 unchanged (25 % / 48)
      - `[x]` U6 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) the MOUSE at 1280: resize every edge, grip-drag, Alt-drag float, marquee — exactly as before (the mouse suites green)
      - `[x]` U7 (SEEN 2026-10-07, HEADED `e5b-uat7.out` 206 / 0 on the final build, screenshots read) (6) docs: the story's "Building on a phone" and the guide describe drag, long-press and finger resize, screenshots
        from the real builder; the Preview at all 70 screens agrees with the canvas after a finger's edits
      LEDGER E-5b (each written the moment it is found):
      - `[x]` E5b-1 · BUG IN MY TEST (FIXED 2026-10-07): the finger-resize guard tapped the empty box's centre, where its "+" sits
        (E5a-9), so it failed on SELECTING, not on resizing — it could not tell a broken resize from a working one. It now taps
        near the corner (`tapBlock(…, position)`); red on the old build at "the block grew with the finger".
      - `[x]` E5b-2 · REAL, finger (FIXED 2026-10-07): a finger on a block's TOP handle lying over the block above's words never
        held it — measured (`probe-e5b.js`): the press's target was the heading's editable span, then `pointercancel`, while
        `elementFromPoint` said the handle. Chrome's touch adjustment moves a press to the nearest node "a tap is for" — an
        editable span is one, a bare handle (React's listeners live on the root) was not. Fix: `active:` on the handle (pressed
        feedback, and it makes the handle a tap target). Guard `phone-editing` "a finger holds a top handle…" (built through the
        sheet, RULE Y) — red on the old build on the phone.
      - `[x]` E5b-3 · REAL, every pointer, pre-existing (FIXED 2026-10-07): a still tap on a handle CHANGED THE PAGE after a corner
        drag (measured: `alignSelf "flex-start" → undefined`, `minHeight 127.998 → 128`). Two faults: (a) a corner drag never
        released the cross-axis `flex-start` anchor (only a pure top / bottom drag did), so a corner-dragged block stopped
        following its band for good — the 50px-hole bug the release exists for, on corners; (b) a still press still ran the
        release's write (E5a-8 had stopped only the anchor at the press). Fix: the release covers any drag with a vertical part,
        and a press that never moved returns before it. Guard `phone-editing` "a corner drag lets the block follow its band, and a
        still press on a handle writes nothing" — both halves red on the old build, all four projects.
      - `[x]` E5b-4 · REAL, a gap in E-5a change (6) / D6 (FIXED 2026-10-07): on touch the resize handles' hit areas were 36 × 10 and
        12 × 12, not the ≥ 44 × 44 D6 promised (E-5a's size audit looked at buttons only). Fix: a 44 × 44 `::before` on touch.
        Guarded in the E5b-2 test (every handle's `::before` ≥ 44) — red on the old build.
      - `[x]` E5b-5 · BUG IN MY TEST (FIXED 2026-10-07): the drop-strip guard asked "is T's parent R?", but a block dropped inside a
        box is wrapped in a band of its own — so it PASSED on a mutant with no finger strip. Now: T anywhere in R's subtree.
        Mutation-proven: red 3/3 on the mutant build (`fingerStrip` → the mouse's strip), green on the real one.
      - `[x]` E5b-6 · NOT A BUG (measured, `probe-undo.js`): after a finger drag, the first tap within ~200ms did nothing (Undo
        missed on three phones in the headed pass). Logged: `pointerdown` / `pointerup` on Undo, no `mousedown`, no `click`, nothing
        `preventDefault`ed. Only when the finger LEAVES AT SPEED: a 60ms-step drag, or a 300ms rest before lifting, and the next
        tap works at 150ms — Chrome's own rule that a tap right after a flick stops the flick. A person rests on the target before
        letting go; the headed script now does too.
      - `[x]` E5b-7 · REAL, MY OWN change (3) (FIXED 2026-10-07): a finger's chip was centred on the finger with no clamp — on a phone
        a wide block's chip ran off the left edge, its grip icon cut (`FG-393-Light-U3-lifted.png`). Kept on the screen now. Guard:
        the long-press test moves the finger to x = 6 — red on the previous build (3/3 touch projects).
      - `[x]` E5b-8 · REAL, MY OWN change (2) + E-5a's width (FIXED 2026-10-07; the grip choice DECIDED BY THE USER 2026-10-07 — "I will go whatever you think is best" = my recommendation: no grip in a phone's docked bar, the "+" keeps its corner): on a 360 phone the docked toolbar, with the grip back,
        ran under the blocks "+" and hid ⋮ (`FG-360-Midnight-U1-resized.png`); its `max-width` also left out the 3rem Inspector rail.
        Fix: the docked bar (phones) carries no grip — a long press is the drag there, as in the research's WordPress phone editor,
        and the user's E5a-14 keeps the "+" in its corner — and its widest is the room left of the "+" (8.25rem). Guard
        `phone-editing` "on a 360 phone the docked toolbar never runs under the blocks +" — red on the previous build.
      - `[x]` E5b-9 · NOT A BUG (measured): the block toolbar's `dark:bg-gray-800/95` has no `midnight:` / `purple:` variant, but
        `ThemeContext` (lines 35–37) adds `dark` for every dark-based theme, and the Midnight and Purple screenshots show the bar right.
      - `[x]` E5b-10 · MY OWN, clean code (FIXED 2026-10-07): `parentOf` defined and never used in `uat-e5b-headed.js` — eslint's one
        error in the gate. Removed.
      - `[x]` E5b-11 · MY OWN, the tree (FIXED 2026-10-07): E-5b was opened as a second top-level open batch beside BATCH E-5 —
        `task-tree-batches` "2 batches open at once". It is part of BATCH E-5, as E-5a was, and now sits inside it.
      - MEASURED 2026-10-07 (HEADLESS GATE, `test:fast` all four screens, `logs/e5b-testfast1.out`): **3,322 passed · 10 failed**, every
        one on a touch project — sorted below.
      - `[x]` E5b-12 · REAL, MY OWN (E5b-4's first fix) (FIXED 2026-10-07): `text-is-reachable` "every plausible aim point… takes the
        caret" / "typing lands after… the very start of the line" (3 touch projects): the 44px hit areas, centred on the handles as
        `::before`s, lay over the first word, and a still click peeled at most 4 layers of chrome without reaching it. Fixed by
        E5b-14's outward areas — nothing of the finger's lies over the block's own words; the existing spec is the guard (red on
        the previous build).
      - `[x]` E5b-13 · REAL, MY OWN change (5) (FIXED 2026-10-07): `resize-leaves-no-gap` "the blocks already on the page do not move
        at all" (3 touch projects): the strip was sized by the DEVICE (`pointer: coarse`), so a mouse's drop on a touch laptop or
        tablet changed its reading. Now by the DRAG (`dragArm.finger`). The existing spec is the guard (red on the previous build);
        the finger's strip keeps its own (E5b-5's mutation-proven test).
      - `[x]` E5b-14 · REAL, MY OWN (E5b-4's first fix) (FIXED 2026-10-07): `add-without-asking` "a container YOU selected gets the
        block AFTER it…" (phone): on a zoomed canvas (the desktop page on a phone, 0.27) the centred 44px areas covered a small
        selected block whole, so a tap at its middle no longer reached its "+" — E-5a's build 3 / 3 pass, this one 3 / 3 fail
        (`--repeat-each=3`, both builds served side by side). Fix: each hit area is its own element, 44 × 44, reaching OUTWARD from
        the block's edge or corner (`HIT_POS`), never over its own content. Guards: the spec, and `phone-editing` "no hit area lies
        over the block's own middle".
      - `[x]` E5b-15 · REAL, MY OWN (E5b-4's first fix) (FIXED 2026-10-07): `chrome-follows-resize` "a press on each handle of a narrow
        block lands on that handle" (phone): the top-left corner's area took a press aimed at the top edge. The hit areas are now
        a layer UNDER every handle (`CHROME_Z.handleHit` 9190), so no area covers a handle. Guards: the spec (red on the previous
        build) and `phone-editing` "a press on each handle's centre is that handle".
      - `[x]` E5b-16 · REAL, every pointer, pre-existing (FIXED 2026-10-07; found by the headed pass on a 360 phone): while a GRID
        CELL'S edge was held, the editor jumped (measured with `probe-scroll2.js`: scrollTop 325 → 75 mid-drag, back on release —
        no script scrolled it, the mouse the same). The live preview wrote every cell's stored `grid-column`, the stored row
        tracks and an empty `min-height` onto cells the drag had not changed — wiping their courtesy height, so the page got
        ~250px shorter and the scroll was clamped. Fix: the preview writes only what differs from the tree as the drag began.
        Guard `phone-editing` "while a grid cell's edge is held, the cells keep their arrangement and the editor does not
        scroll" (built through the sheet) — red on the previous build.
      - HEADED UAT (`scripts/uat/uat-e5b-headed.js`, six windows): pass 1 170 / 42 failed (most the script's own assumptions: a
        docked Inspector at 1280, a covered tap point, a corner move under one column, a one-column grid on a phone, floats in
        the flow on a phone by design, the mouse moves by the grip) → E5b-2, -3, -4 found by probe; pass 2 207 / 6; pass 3 153 / 6
        (E5b-6, the zoomed tablet off-screen); pass 4 209 / 0 — screenshots read → E5b-7, E5b-8; pass 5 206 / 0; then the gate's E5b-12 … E5b-15, pass 6 206 / 2 → E5b-16; **pass 7 206 / 0 on the final build** (`logs/e5b-uat7.out`, screenshots read).
  - `[x]` **BATCH E-5c · The tablet, then the app** — CLOSED 2026-10-07 (the tablet: HEADED 590 / 0 on the final build, 15 runs in six
    windows; `test:fast` 3,343 + the 2 chrome specs fixed after it, 24 / 24; vitest 4,445; E5c-1 … E5c-9) — THE APP SPLIT OFF TO BATCH
    E-5d below (its decisions T4–T8 moved there) — part of BATCH E-5 (one open batch, RULE X) — OPENED 2026-10-07 by the user
    ("okay, let's do that"), RESEARCH FIRST (RULE RS: the user's sources and mine, then an "enough" checklist the user signs) — QUEUED
    2026-10-07 (from E-5's research) (area: the editor on a tablet, then the app): what a tablet (600–1023) edits at, the sheet or the
    side panel; then `apps/mobile/` — a webview over the same editor (rule 20), phone AND tablet
    - `[x]` (1) RESEARCH (RULE MAP) — DONE 2026-10-07, stored in `docs/web-anatomy/tablet-and-app-editing.md` (~45 pages read;
      every claim cited or marked inference; linked from `phone-editing.md` §6). THE "ENOUGH" CHECKLIST, signed 2026-10-07:
      - `[x]` axis A · the canvas — own width 1:1 (WordPress, Notion: the only two that BUILD on a tablet) · desktop fitted (ours today;
        touch cannot drive one — Google Sites on iPad) · fitted + pinch (Canva, free-form only) · a tablet breakpoint edited from a
        desktop (Wix Studio) · rotation re-lays the chrome, not the content (Notion). Saturated: the last five products added nothing
      - `[x]` axis B · picker and settings — the phone sheet capped at 512 and centred, 59 % / 96 % tall (WordPress source) · popover
        instead of full screen (Notion) · a sidebar open in landscape, closed in portrait (Notion) · tabs on the left (Squarespace)
      - `[x]` axis C · toolbar — no tablet-specific source; the phone toolbar unchanged (inference, same native code)
      - `[x]` axis D · input — `any-pointer: fine` turns true when a trackpad is PAIRED, `pointer` only when it is USED (WebKit
        209292): decide by window width, read `pointerType` per gesture (E-5b already does); Pencil = "pen", hover on M2+; Split
        View / Stage Manager / multi-window: the WINDOW decides (Apple, Android); iPad Safari claims to be a Mac
      - `[x]` axis E · the app — `react-native-webview` 13.15.0 (SDK-54 pin, NOT installed): load, bridge, camera-roll upload by
        `<input type=file>`, back, caching all covered, with eight traps; Apple 4.2 / 4.2.6 ("single binary … picker model") / 4.3(a)
        and Play's webview + minimum-functionality policies quoted
      - `[x]` axis F · African tablets (StatCounter, Sept 2026) — the commonest Nigerian tablet window is 601 × 1007 (18.6 %), then
        601 × 962 and 962 × 601; Samsung ~half; 2–4 GB RAM → Chrome's mobile site; Android 9 still 8.5 %. THIN: tablets < 1 % of
        traffic, no RAM / 3G split
      - `[x]` THE CHECKLIST SIGNED BY THE USER 2026-10-07 ("I'll go with your recommendation … all the recommendation"):
        T1 a tablet (600–1023) edits the page at ITS OWN WIDTH, 1:1, on the rung for that width; the device control still offers
           the desktop page ·
        T2 the phone / tablet line STAYS at 600px — the commonest African tablet (601 × 1007) edits as a tablet; 601 × 1007,
           601 × 962 and 962 × 601 are added to `lib/preview-devices.ts` and 600 | 601 and 962 are tested ·
        T3 on 600–1023 the blocks panel is the phone's bottom sheet capped at ~32rem and centred; held sideways (≥ 900) the
           Inspector stays docked at the side (Notion's sidebar); upright it folds to its tab — AMENDED BY THE USER 2026-10-07 (E5c-4):
           the Inspector is its tab on EVERY tablet, docked only from 1024 as before; and (E5c-2) a tablet gets the phone's one-row bar + More
      - `[x]` THE APP'S DECISIONS T4–T8 — MOVED 2026-10-07 to BATCH E-5d below (asked when it starts), with the batch they belong to
      - `[x]` the user's sources — WAIVED BY THE USER for E-5c only, 2026-10-07: "I will leave you to do the research on this one. The
        other ones, like in the rules, I'll provide my own link" (RULE RS stands for every other area)
    - `[x]` (2) THE BUILD — DONE 2026-10-07 (its HEADED checklist first — RULE X; tablets 768 × 1024 · 1024 × 768 · 601 × 1007 ·
      601 × 962 · 962 × 601 · 800 × 1280 with touch, four themes; phones and the mouse at 1280 unchanged):
      - `[x]` (a) T1 — 600–1023 opens on its own width 1:1 (the tablet-portrait / tablet-landscape rung), like the phone's D1;
        rotation keeps the edit on the rung for the new width; the device control still shows the desktop page (`page.tsx`
        `screenDevice`: one device that follows the window at 37.5 / 56.25 / 64em, `fitW = room` when it is the screen's own)
      - `[x]` (b) T2 — the three African tablet sizes in `lib/preview-devices.ts` (and so in `scripts/uat/screens.js`, now 73 screens)
      - `[x]` (c) T3 — the blocks sheet on 600–1023: the phone's sheet, max 32rem wide, centred (`BlocksPanel`); More the same (E5c-2)
      - `[x]` (d) T3 — the Inspector docked at ≥ 900 — BUILT, then REVERSED by the user (E5c-4): a tab below 1024, as before
      - `[x]` (e) the finger on a tablet re-measured on the new canvas: the toolbar docked at the bottom for a finger (rec. 4, E5c-5)
        with the grip kept for a float (E5c-6), handles, strips, long press, autoscroll — all of E-5b's checks, on every tablet
      - `[x]` (f) docs (RULE DOCS): the story's §11 rewritten for 1:1 tablets (two new pictures from the builder), the reference
        table (`website-builder.md`), the research's rec. 3 amended, `phone-editing.feature` (E-5c scenarios)
      - `[x]` THE HEADED CHECKLIST — HEADED UAT 590 / 0 on the final build (`logs/e5c-uat10.out`, screenshots read) (written 2026-10-07 BEFORE the build, RULE X; `scripts/uat/uat-e5c-headed.js`, six windows, real
        CDP touch; screens: 599×900 · 600×900 · 601×1007 · 601×962 · 768×1024 · 800×1280 · 899×700 · 900×700 · 962×601 · 1007×601 ·
        1023×768 · 1024×768 · 375×812 · 360×640 · 1280×800; themes light · dark · midnight · purple). PONYTAIL (RULE M) for the build:
        rung 2 — the phone's D1 path (a device that follows the window, `fitW = room`) widened to the two tablet rungs; the phone sheet
        reused with a cap; the Inspector's dock line moved 64em → 56.25em (then back, E5c-4); nothing new added
        - `[x]` C1 (a) SAW at 601×1007 · 601×962 · 768×1024 · 800×1280 (Tablet) and 962×601 · 1007×601 (Laptop): scale 1, the frame
          exactly the room's width, nothing sideways; 1024×768 touch: Full width at Fit 47 %, the Inspector docked, as before
        - `[x]` C2 (a) SAW in RT-601 and RT-768: through 1007×601 · 962×601 · 601×962 · 899 | 900 · 1024×768 · 768×1024 · 1023×768 ·
          600 · 599 the device followed each width, 1:1 below 1024, the selection held, nothing sideways, the Inspector a tab below 1024
        - `[x]` C3 (a) SAW on every tablet: ½ wrote `responsive.tabletPortrait` / `tabletLandscape` only, the canvas showed it at half,
          and on Desktop the Stack was full width
        - `[x]` C4 (a) SAW: Desktop from More drew the desktop page shrunk (z 0.47–0.66), Tablet / Laptop brought 1:1 back
        - `[x]` C5 (b) SAW: the three sizes in the Preview's menu and in screens.js (73 screens); the Preview of a page a finger built on
          a 601 tablet had no sideways scroll at all 73 screens at 100 / 150 / 200 % text
        - `[x]` C6 (c) SAW on every tablet: the sheet at the bottom, 512px wide, centred (screenshots: 601 Light, 768 Purple); Escape
          closed it, focus back on "+"; no launcher gutter (32px padding = the room's own); the build went through the sheet
        - `[x]` C7 (d, as AMENDED by E5c-4) SAW: the Inspector its tab on every tablet, docked from 1024; it never covers the page
        - `[x]` C8 (e) SAW on every tablet: the bar docked at the bottom, never over a block (E5c-5); a long press drags; handles,
          strips ≥ 44px; edges and corners resize with only the grabbed edge moving; a float moved by the docked grip (E5c-6),
          stopped at the page's top (E5c-7), made Floating without moving (E5c-8), and grown by its corner with its top still (E5c-9)
        - `[x]` C9 SAW: phones 375 · 360 (E-5b's FG, all green) and the mouse at 1280 and 1024 (E-5b's MS, all green) unchanged
        - `[x]` C10 SAW: Light · Dark · Midnight · Purple Dream across the runs (sheet, More, canvas, docked bar); no console errors
        - `[x]` C11 (f) the story's §11 rewritten with two new pictures; `npm run docs:build` green
      - LEDGER E-5c (every bug the moment it is found, RULE V):
        - `[x]` E5c-1 · MY OWN, found reading the code: the Inspector's "steps down to fit … drawn N across" note measured the row
          at the device's NOMINAL width (768 / 1024) while a 1:1 canvas is drawn at the room's (656 / 546) — the canvas stacked three
          columns one a line and the note said nothing. FIXED (`page.tsx`: `w = device === screenDevice ? fitW : …`). HEADED UAT
          (`uat-e5c-headed.js` FS — three Stacks with words, side by side at ⅓, built with the mouse, the window turned to 768 × 1024
          and 962 × 601): the mutant build (the one line reverted) FAILED 4 / 4, the fix SAW 4 / 4. Guard: `phone-editing.spec.ts`
          "E5c-1 …" red on the mutant, green on the fix
        - `[x]` E5c-3 · NOT A BUG (measured): after 1024 → 768 the frame read 659–660 in a 656 room at +600 ms; its target width was
          already 656 and the 300 ms width transition (1200 → 656) was finishing — at +1500 ms it is exactly 656 (`probe-e5c.js`). The
          BUG WAS IN MY TEST (read mid-animation): RT now waits 1.3 s
        - `[x]` E5c-2 · the top bar on a tablet wraps to three rows at 601 (~170px, 17 % of 1007) and two at 962 × 601 (~120px, 20 %);
          the phone got a one-row bar + More in E-5a, the tablet did not. THE USER CHOSE 2026-10-07 "One row + More": `compactBar` (every
          screen under 64em) in `page.tsx`, the More sheet capped at 32rem and centred on a tablet. Guards: `phone-editing.spec.ts` T1 (one row
          at every tablet width) and "a phone's (and a tablet's) top bar …", `builder-chrome-fits` (768 one row) — red on the earlier build
        - `[x]` E5c-4 · T1 × T3 pull against each other at 900–1023: the docked Inspector (T3) leaves the 1:1 canvas 484–607px for a
          rung visitors see at 900–1023px (54–60 % of their width; 768 upright keeps 656 = 85 %). THE USER CHOSE 2026-10-07 "Tab below 1024":
          the dock line back at 64em (`lg:`). Guards: `builder-chrome-fits` E3-3 (962 × 601 is a tab), `phone-editing.spec.ts` T1 — red on
          the earlier build
        - `[x]` E5c-5 · FOUND BY THE HEADED PASS (U2 failed at 800 / 962 / 1007, alone too): on a 1:1 tablet a selected Stack's 52px
          bar, by its block, covered the Heading above it (bar 128–180 over a heading 113–196); a tap on what showed of the Heading was
          pulled onto the bar by Chrome's touch adjustment, so it could not be selected and the next grip drag moved the STACK. The research
          had answered it — rec. 4, signed with "all the recommendation": the phone's toolbar on tablets (I had read change (e) as "by its
          block"). FIX: the bar docks at the bottom under 64em for a finger (`(max-width: 37.49em), (max-width: 63.99em) and (pointer:
          coarse)`, BoxCanvas); a mouse in a narrow window keeps the bar and its grip. Guard: `phone-editing.spec.ts` "E5c-5 …" (the
          palette's Heading and Stack at 962 × 601) — RED on the pre-fix build in all three touch projects
        - `[x]` E5c-6 · MY OWN, made by the E5c-5 fix, found by the headed pass (U1, every tablet): the docked bar has no grip and a long
          press moves only a block in the flow, so on a tablet a FLOATING block could not be moved by a finger at all (a mouse could: probe
          `probe-e5c-float.js`, 1280 on the Tablet screen, wrote `responsive.tabletPortrait.left/top`). FIX: a floating block keeps the grip
          in the docked bar (not on a phone, where floats join the flow). Guard: `phone-editing.spec.ts` "E5c-6 …" — RED on the pre-fix
          build. ALSO TWO BUGS IN MY TESTS, fixed: U1float read only the desktop `left/top` (a tablet writes its rung) and U4 looked for the
          zoom in the bar (under 1024 it is in More, E5c-2) — U4's "not tall enough" at 800 × 1280 was that: scroll 1310 > 1215, measured
        - `[x]` E5c-7 · FOUND READING THE HEADED PASS'S SCREENSHOT (962 × 601, U1's float dragged up): a floating block could be dragged
          (and arrowed — no limit at all there) above the PAGE's top edge; the canvas drew it over the app bar and the Preview CUT ITS WORDS
          OFF (`probe-e5c7.js`: a mouse at 1280, `top: -31.3`, the heading's top at −14.6px in the published page). Older than E-5c — a
          mouse did it too. The half-box overhang over a PARENT is a design (overlap) and stays. FIX: the drag and the arrow keys stop at the
          page's top, left and right (BoxCanvas). Guard: `float-round-trip.spec.ts` "… (E5c-7)" — RED on the pre-fix build. THE HEADED
          PASS THEN SHOWED the finger's float still 16.5px above the page on every tablet: the drag measures from the parent's CONTENT box,
          the browser places an absolute box from its PADDING box (the palette's band has 16px of inner space). FIX 2: the limit is applied
          to where the box is DRAWN (the offset read once at drag start). Guard: the headed check "E5c-7 …" in `uat-e5c-headed.js` — RED
          8 / 8 on the fix-1 build (a seeded band did not reproduce it, so no spec pins it: RULE Y). FIX 2 DID NOTHING (the same 8, the
          same numbers) — the cause was E5c-8, and fix 2 was deleted again
        - `[x]` E5c-8 · FOUND CHASING E5c-7, OLDER THAN E-5c, a mouse too (`probe-e5c8.js`, 1280 and 962): a float's `left` / `top` /
          `width` are plain %, which CSS resolves against the parent's PADDING box from its edge; the float maths (`measureFloatGeom`,
          `measureGroupGeom`, the move drag, the float resize) measured the CONTENT box. On the real page (its default inner space) a
          Heading made Floating JUMPED +16.6 / −10.5px, a still press on its grip moved it up 12–17px more, and every page-edge limit was
          16px off. FIX: one helper, `placedIn` (the padding box, from `clientLeft` / `clientWidth`), in all four; the model's comment
          corrected (`box-model.ts` `left` / `top`). Saved pages draw exactly as before (the stored % and the CSS are unchanged). Guard:
          `float-round-trip.spec.ts` "… (E5c-8)" with the page's real defaults and the palette's Heading — RED on the pre-fix build.
          AFTER IT, MEASURED: made Floating still moved −3.5 / −4px — out of the flow its page shrank 180 → 128px, and a `top` measured as
          a % of the old height lands higher. FIX 2: the Floating action re-measures once drawn and puts it back, in the same undo step
          (`page.tsx` `floatSelected`). Now 0 / 0.1px at 1280 and on the 962 tablet (`probe-e5c8.js`). Guard tightened to 0.75px — RED on
          a mutant with the settle disabled (−1.57px; −4px in the probe), green on the fix. NOT BUGS, measured: +16.6px across on float
          is `floatBox`'s deliberate 2 % inset from the parent's edge (`box-model.ts:2693`); +3px on a 1px-wiggled press is the drag's 6px
          snap pulling the box's bottom onto the parent's middle line (60.6 vs 64)
        - `[x]` E5c-9 · FOUND BY THE HEADED PASS (1024 × 768 touch, deterministic alone, 2 / 2): a floating block resized by its corner
          slid 8.2px DOWN — rule 19 broken. Its `top` is a % of its parent's height, and a float low on the page SETS that height (the
          parent reserves room for its floats): growing it grew the parent, and the % landed lower. Older than E-5c in kind; it surfaced
          once E5c-8 placed floats exactly. FIX: the resize keeps the top in px — re-said against the parent's height as it is now on
          every frame, and once more after the last frame (BoxCanvas `startResizeAbsolute`). Guard: `float-round-trip.spec.ts` "… (E5c-8)"
          grows the floated Heading by its corner — RED on the pre-fix build
  - `[ ]` **BATCH E-5d · The app** — QUEUED 2026-10-07 (after E-5c, which CLOSED 2026-10-07): `apps/mobile/` hosts the editor in a
    webview, phone AND tablet, with the native layer — T4–T8 DECIDED 2026-10-07 (below); next: its HEADED checklist on both emulators, then the build (research: `tablet-and-app-editing.md` §2 E, §3, §4–§5)
    - `[x]` THE APP'S DECISIONS — DECIDED BY THE USER 2026-10-07 (all five as recommended), asked as this batch starts — the user's words: "make sure we have that recorded somewhere
      so … we don't forget it" (moved here from E-5c's research, 2026-10-07). My recommendation beside each:
      - `[x]` DECIDED "Yes, add it" · T4 add `react-native-webview` 13.15.0 (the Expo SDK 54 pin) to `apps/mobile/` — a new dependency, the user's call
        (rule 20 already chose a webview). Recommended: yes
      - `[x]` DECIDED "One-time code" · T5 how the app signs the person into the editor: a one-time code in the URL exchanged for a cookie · a token via
        `injectedJavaScriptObject` · shared cookies (and whether `expo-secure-store` holds it). Recommended: the one-time code
      - `[x]` DECIDED "Native cache + local save" · T6 offline in the app: the native cache + the editor's own local save · service workers (iOS App-Bound Domains,
        ≤ 10 domains). Recommended: the native cache + local save
      - `[x]` DECIDED "Deep links" · T7 which native piece ships first beside the site (Apple 4.2): deep links into the existing Fees / Messages /
        Reports screens · push · offline term dates. Recommended: deep links first
      - `[x]` DECIDED "Edit from day one" · T8 the app EDITS the school site from day one, or only SHOWS it at first. Recommended: decide with T4–T7
    - `[ ]` (1) its HEADED checklist FIRST (RULE X): both emulators (tablet 5554, phone 5556) — the editor opens signed in by the
      one-time code, edits and saves; Back / the app's swipe; the content process killed and reloaded from the saved state; camera-roll
      upload; offline (cache + local save); deep links into Fees / Messages / Reports; four themes
    - `[ ]` (2) the build (a webview screen in `apps/mobile/` with `isTablet`, the one-time-code exchange on the server, BackHandler,
      iOS swipe-back off, `onContentProcessDidTerminate` / `onRenderProcessGone`, the `postMessage` bridge limited to our origin, the
      deep links) with jest for phone AND tablet, then its docs (RULE DOCS)
- `[x]` **BATCH G-3 · Placing on columns and rows** — CLOSED 2026-10-04 (HEADED UAT `scripts/uat/uat-g3-headed.js`, six windows,
  65 checks 0 failed on the final build (`logs/g3-uat6.out`), Preview at all 70 screens at 100 / 150 / 200 % text; G-2's suite
  re-run as regression 128/0 (`g2-regress-g3c.out`); gate: see the commit) — OPENED 2026-10-04 (session 5da86722, the user's "go") (area: page grid
  · 6 changes). G-3 as signed under R-4 was split so each batch keeps ≤ 6 changes: THIS batch is placing; **G-3b** (queued, below)
  is the page emitted as a real CSS grid (D5) with start lines, "to the last line", full / bleed / half-bleed and "Space between
  columns". MEASURED FIRST (code): in a page-grid row the side space is padding on the ROW (`pageBandInset`), which is unselectable
  scaffolding — a person cannot change it for one block, only for the whole site; the guides drew it as strips OUTSIDE the columns.
  CHANGES:
  - `[x]` (1) EDGE TO EDGE (the user, 2026-10-04): the guides' columns span the whole page, the default side space drawn as a
    margin INSIDE the first and last columns; the first / last block of a row OWNS its outer side — its Spacing shows "Default",
    a value of its own (0 included) takes over from the row on that side; equal cards and gaps unchanged; the span chip counts
    the columns whose middle lies inside the block
  - `[x]` (2) COLUMN SNAP on resize: a page-grid block's dragged edge moves line to line (`snapShare`), edge-anchored (rule 19),
    Shift = half-lines, Alt = free (kept as dragged); a live label "5 of 12 · phone 3 of 6" beside the edge
  - `[x]` (3) "COLUMNS" in the Position panel: the span per screen as a number field ("set here" / follows), Alt ← / → one column,
    Alt Shift ← / → half, announced to screen readers ("5 of 12 columns")
  - `[x]` (4) ROWS TALL: "Rows: N" per block → at least N row steps tall, still growing with its words (choice A); the row lines
    of the guides line up with it
  - `[x]` (5) "LINE UP WITH THE GRID" in Page settings: every block of the page to the nearest whole column, says how many moved,
    one Undo; a block marked "Free placement" is left alone
  - `[x]` (6) NESTED TREES (carried from R-4): section → Grid block → card → button, built through the UI with random values, in
    the UAT below
  HEADED UAT CHECKLIST (written before the pass; six windows; fresh production build; built through the UI; Preview at all 70
  screens of `screens.js`; the editor's four themes):
  - `[x]` U1 guides: 12 columns across the whole page at every device (6 on Mobile), the default margin drawn inside columns 1 and
    12; a half / third / full block's chip right at every device
  - `[x]` U2 the first card of a three-card row: Spacing shows "Default" left; set to 0 → it reaches the page edge, the other two
    and the right side unchanged; back to default → equal again; canvas == Preview at all 70 screens
  - `[x]` U3 snap: drag the edge between two halves at Desktop to ≈ 41 % → 5 of 12 / 7 of 12, the far edge fixed; Shift → 4½;
    Alt → kept as dragged; at the width where the partner runs out the edge stops (rule 19); every rung after it
  - `[x]` U4 "Columns" field and Alt ← / → at Desktop and Phone: each screen its own, the others untouched; Undo; reload
  - `[x]` U5 Rows: 3 on a short block → ≥ 3 row lines tall; long words → it grows; 150 % and 200 % text still lays out
  - `[x]` U6 "Line up with the grid" on a page dragged with Alt: blocks move to whole columns, the count is said, one Undo
  - `[x]` U7 nested trees (random, seeded only to CHOOSE the values, built through the UI) at all 70 screens: no sideways scroll,
    no overlaps, no word broken
  - `[x]` U8 the four editor themes: every new control labelled, readable (≥ 4.5:1), keyboard reachable
  DECIDED by the user mid-batch (2026-10-04): the HALF-LINES show only while Shift is held ("some lines are faint" — with them
  always on, a faint line sat beside every column line); every line otherwise is a column or a row line of the same strength.
  LEDGER G-3:
  - `[x]` G3-1 · TEST (mine): "the first block's own margin is never applied twice" checked for `u(1)` when the value was 0 —
    proved nothing → asserts the exact half gap; red under mutation for every value
  - `[x]` G3-2 · TEST (mine): slice B aimed the drag as a share of the row's OUTER box (its side space included) → aims at the
    DRAWN guide lines, as a person does
  - `[x]` G3-3 · REAL (mine): Alt ← / → did nothing after clicking a block — the canvas keeps the focus on the last-clicked
    toolbar button and the Z1-j rule gave that button the arrows → Alt + an arrow passes (no control uses it). Guard red without the fix
  - `[x]` G3-4 · consequence of G3-3 (the Undo meant for the phone change undid the Columns change) — gone with it
  - `[x]` G3-5 · REAL, FOUND BY THE USER FIRST ("the cells are not evenly spaced"): the guides' 1px lines inside a page drawn at
    61 % were 0.61 of a screen pixel and vanished between pixels — rows measured 29 / 15 / 29px, half the middle lines missing →
    lines drawn on whole screen pixels (G3-7); MEASURED by decoding the picture: rows 14 / 15 (14.6 true), columns 65, at 100 % 24
  - `[x]` G3-6 · TEST (mine): the evenness check photographed the selected block's toolbar and chip, and its ±1.5px was tighter
    than pixel rounding of a 32.6px spacing → nothing selected, every gap within 25 % of the median (fails the old 29 / 15 and
    63 / 31, passes 31–34)
  - `[x]` G3-7 · REAL, FOUND BY THE USER FIRST ("one is more prominent than others"): at a zoomed-out view a line landed between
    pixels and was smeared lighter (shades 133–247) → `GuideLines` draws every line in screen space on a whole pixel; the in-page
    guides keep the geometry and the side space. MEASURED: every column line 402, both zooms; G-2's line-contrast check reads it
  - `[x]` G3-8 · REAL, CARRIED TO G-3b BY THE USER'S DECISION (2026-10-04, "Fix in G-3b"): a snapped edge lands 1.7–2.6px from
    the drawn line at 1280 — shares are of the row inset by its side space, the guides run edge to edge; G-3b's real CSS grid puts
    blocks ON the lines (rem / fr, nothing stored in px — the user asked, answered)
  - `[x]` G3-9 · TEST: G-2's script asserted G-2's drawing (strips outside the columns, the chip by width, rows as a gradient),
    which the user's edge-to-edge decision replaced → reads the new drawing; the geometry is checked in uat-g3 slice A
  - `[x]` G3-10 · TEST (mine): the line-shade check read the first two pixels of a run, which on Mobile began on the frame's
    faint ring before the line → the darkest pixel of the run (first guessed a half-pixel photo edge — MEASURED, not it)
  - `[x]` G3-11 · REAL (mine), CAUGHT BY THE GATE (`width-round-trip.spec.ts`): change (1) cleared the first block's own left
    margin as "the row's side" — including a gap opened by dragging its left edge (`marginLeftPct`, a share of the line), so the
    space could not open at all ("-0") → only a LENGTH margin is the row's side. Unit guard red before / green after; the gesture
    added to the headed slice B: opens 126.8px (two columns, snapped), closes back to 0.0 / 0.0
  - `[x]` G3-12 · TEST: the same spec dragged FREELY and expected > 100px; on the page grid the edge now snaps (one 83px column)
    → it holds Alt (free), the drag it was written for; with the G3-11 bug back it still fails
- `[x]` **BATCH G-2 · Layout guides + the page-grid panel** — CLOSED 2026-10-04 (HEADED UAT `scripts/uat/uat-g2-headed.js`, six
  windows, 134 checks 0 failed, Preview at all 70 screens, four editor themes + four website themes, `logs/g2-uat6.out`; gate:
  typecheck 0 · eslint 0 errors · vitest 4,236 · test:fast 806/806) — OPENED 2026-10-04 (session 5da86722, the handover of 9fa0fee9)
  (area: page grid · 6 changes; plan https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN; the user: "the grid becomes something
  a person can see and set"). MEASURED FIRST (code read): no guides, no canvas right-click menu, `site.pageGrid` / `page.grid`
  read nowhere; the side space and block gap are constants behind ONE choke point (`spaceFor`); undo is site-wide (`pushSite`).
  CHANGES:
  - `[x]` (1) LAYOUT GUIDES on the canvas: the page grid's columns + middle lines from the SAME template (`gridTemplate`,
    `lib/page-grid.ts`, which G-3 will emit), the side space drawn AS padding with the page's own side-space value, row lines
    optional; per screen (6 on Mobile, 12 from Tablet, a count set per screen); never in the published page
  - `[x]` (2) THREE ENTRY POINTS: a "Layout guides" toolbar switch, Shift G (not while typing; Ctrl Shift G stays Ungroup), a
    canvas right-click menu (new — "Layout guides  Shift+G" · "Page grid…"); off by default, remembered per person
  - `[x]` (3) SPAN LABEL on the selected block while the guides are on ("6 of 12"), measured against the drawn columns, so it
    tells the truth on every screen (a half block that stacks on a phone reads "6 of 6")
  - `[x]` (4) THE PAGE-GRID PANEL (site): columns per screen (Phone · Tablet · Laptop · Desktop · Wide, "set here" / follows),
    columns on phones (half or 2–12), row step + row lines; every block follows; one Undo for a whole slider drag
  - `[x]` (5) SIDE SPACE and GAP BETWEEN BLOCKS for the site (Default or 0–6 / 0–4 rem), through `spaceFor` on every page-grid
    page — canvas == Preview; Reset to default. ("Space between columns" waits for G-3: it needs the page emitted as a CSS grid)
  - `[x]` (6) "THIS PAGE USES ITS OWN GRID" (opt-out, D4 of the plan) + keyboard / screen-reader reach of the switch, the menu
    and the panel (labels, Escape returns focus) in the editor's four themes
  HEADED UAT CHECKLIST (written before the pass; six windows; a fresh production build; built through the UI):
  - `[x]` U1 guides ON/OFF by each entry point (switch · Shift G · right-click) — and Shift G typed in a text field types "G"
  - `[x]` U2 guides at every canvas device (Mobile 6 · Tablet / Laptop / Desktop / Wide 12 · Full) — lines on the block edges of
    a half / third / quarter row, side strips equal to the measured section padding
  - `[x]` U3 guides remembered after a reload; OFF by default in a fresh browser
  - `[x]` U4 span label: half / third / quarter / full block at every device, matching what is seen (stacked ⇒ all columns)
  - `[x]` U5 panel: columns 12 → 10 → 16 per screen and phones half / 4; guides and labels follow; one Undo puts it back;
    reload keeps it
  - `[x]` U6 side space 0 and 3 rem, gap 0 and 2 rem: canvas AND Preview at all 70 screens of `screens.js` agree; Reset returns
    the defaults; an OLD saved page is untouched
  - `[x]` U7 a second page with its own grid (16): its guides 16, the first page 12; switching it off returns to the site's
  - `[x]` U8 the Preview / export at all 70 screens has NO guides and no sideways scroll
  - `[x]` U9 the editor's four themes (light · dark · midnight · purple): switch, menu, panel, label readable (contrast ≥ 4.5:1
    text, guides ≥ 3:1 against the page), on the website's light and dark themes
  - `[x]` U10 keyboard only: Tab to the switch, Enter, open the panel, change a field with the arrows, Escape returns focus
  - `[x]` DECIDED by the user 2026-10-04 (mid-batch: "columns and rows… as long as it takes over the whole page"): ROW LINES ON
    by default in the guides, heights still follow the content (choice A of the plan stands); "span N rows" moves to G-3
  LEDGER G-2:
  - `[x]` G2-1 · REAL, pre-existing: deleting a page dropped the site's settings — the website theme (and now the page grid)
    reset (`deletePage` returned `{ pages, homeId }` only) → spreads the site; guard "G2-1" red before, green after
  - `[x]` G2-2 · REAL (mine), HEADED UAT: the guides' side strips were 23px on every screen (the overlay sat outside the page
    root, so `u()` fell back to 0.625rem) → the overlay carries the root's `--box-u`; strips = section padding at every device;
    guide "G2-2" mutation-proven
  - `[x]` G2-3 · TEST: `getByLabel('Columns on Desktop')` also matched the two stepper buttons → `exact`
  - `[x]` G2-4 · TEST: "the full block sits on guide lines" left out the page's own outer edges → added
  - `[x]` G2-5 · REAL, the same as G2-6: slice C could not click the panel's "−" — the selected block's handle sat on it
  - `[x]` G2-6 · REAL, pre-existing for Page settings too: what the toolbar opens sat UNDER a selected block's handles and
    toolbar (header `z-30` vs portalled chrome at 9200 / 9300) → the header on the ladder at `CHROME_Z.panel`; measured: every
    panel button and the Page name field topmost (`elementFromPoint`) with a block selected under them
  - `[x]` G2-7 · REAL (mine), seen in the PICTURE (every number had passed): the span chip sat over the block's first words →
    top-right; UAT now checks the chip covers none of the block's words, at every device
  - `[x]` G2-8 · REAL (mine), caught by `builder-chrome-fits.spec.ts`: the bar wrapped to two rows at 1536px (needed 1,564 of
    1,536px; it needed 1,526 before) → ONE switch, as the plan has it (on = guides + panel, off = both; Shift G the guides alone;
    the panel also from the right-click menu and Page settings), and the Website theme shows its name from 1700px like every
    label in that group (`labelClassName` on ThemeSwitcher; its tooltip still names it). Spec red ×3 on the old builds, green now
  NOT DONE HERE (on purpose, written so it is not lost): "Space between columns" → G-3 (needs the page emitted as a CSS grid);
  the plan artifact's mockup still shows rows off and a separate "Grid…" — corrected with the other artifacts before the PR (G-6)
- `[x]` **BATCH P-0 · The five placement bugs found by reading the code (R4-1 … R4-5)** — CLOSED 2026-10-04 (session 9fa0fee9;
  HEADED UAT `scripts/uat/uat-p0-headed.js` six windows, 30 checks 0 failed, Preview at all 70 screens + `uat-p0-apptheme-headed.js`
  four editor themes, 8 contrast checks 0 failed; gate: typecheck 0 · eslint 0 errors · vitest 4,181 · test:fast 806/806) (area:
  placement controls · 5 changes, OPENED by the user's "let's move on" after signing R-4). All five REPRODUCED through the UI first
  (`scripts/uat/probe-p0.js`, build OOQdv_uu). CHANGES:
  - `[x]` (1) R4-1 · Advanced CSS / token overrides published PER SCREEN: each run of rungs with the same value is one rule limited
    to that range of widths, emitted after the generated rules as the canvas applies them (`overridesByRung`, `lib/box-export.ts`).
    Guard `box-export.test.ts` "R4-1" (mutation-proven)
  - `[x]` (2) R4-2 · the cell's "Line up (across)" SHOWS the squares' choice and clears their across value when used; a square
    clears `justifySelf` — whichever was used last wins (`BoxInspector.tsx`). Guard `BoxInspector.test.tsx` "R4-2" (mutation-proven)
  - `[x]` (3) R4-3 · "Position in row" writes the screen being edited (`alignInRow` / `alignInRowOf` take the screen,
    `updateBoxResponsive`); re-cutting columns MEASURED already per screen (structure at the desktop only, a per-screen count
    elsewhere — by design, page.tsx); Floating, front / back order and Content width change the structure and SAY "Applies to
    every screen, not only <screen>" while another screen is edited; the banner and the Per-device sentence now say "unless a
    control says every screen". Guards `box-model.test.ts` + `BoxInspector.test.tsx` "R4-3" (mutation-proven)
  - `[x]` (4) R4-4 · the container's line-up reads "Line up (down)" in a side-by-side row and a grid, "(across)" in a stack. Guard
    "R4-4" (mutation-proven)
  - `[x]` (5) R4-5 · a typed px (Height, Custom width) is stored as rem (`typedLength`), "Show the whole picture" unticked stores
    `remLen(260)`; the floating min-height part MEASURED NOT A BUG on the published page (the wrapper's `remLen` already wins —
    pinned by "R4-5", mutation-proven on the real line); both floating style lines now emit rem anyway, so the canvas agrees
  HEADED UAT CHECKLIST — every line SEEN (`scripts/uat/logs/p0-uat-3.out`, pictures `logs/uat-p0/`):
  - `[x]` (1) an Accordion's Advanced CSS at Phone: canvas 375 red, Preview red below 600 only; another at Wide: canvas 1920 red,
    Preview red from 1800 only — all 70 screens; a DESKTOP value beside the phone's own: red below 600, blue from 600, all 70; undo
    removes the desktop value; a reload keeps the phone value
  - `[x]` (2) a grid cell: "Right" → end · square "Middle centre" → centre and "Line up" SHOWS Center · "Left" → really left, no
    square left pressed · undo → centre · "Fill" → fills, no square · reload keeps it · "Right" at Phone → phone end, desktop fills
  - `[x]` (3) "Position in row: Right" at Phone → phone flex-end, desktop flex-start; Preview right below 600, left from 600 (70
    screens); reload keeps it; at Phone the Placement section says "Applies to every screen, not only Phone" and the banner "unless a
    control says every screen", on the desktop no note; readable in the editor's four themes (4.85–12.35 : 1)
  - `[x]` (4) labels: a stack "Line up (across)", side by side "Line up (down)", a grid "Line up (down)"; "End" side by side moved the
    words DOWN 236px, across 0 — website themes Light / Dark / Midnight / Purple Dream across the six windows
  - `[x]` (5) Height "300px" stored "18.75rem", Custom width "240px" stored "15rem"; the published CSS has no px but 1px hairlines;
    300px tall at 100 % text, 450px at 150 %
  - `[x]` REGRESSION: ONE tree through the OLD exporter (git HEAD) and the NEW one: a page with no Advanced CSS / token overrides is
    BYTE FOR BYTE the same (8,706 = 8,706, a floating block included); with Advanced CSS only its rule moves after the generated
    rules (+6 bytes). A plain dressed page at all 70 screens: no sideways scroll
  - `[x]` no page errors in any window; typecheck 0 · eslint 0 errors · vitest 4,181 · test:fast 806/806
  LEDGER (this batch) — every line closed:
    - `[x]` P0-a · probe: Advanced CSS exists only on catalogue components (Content tab), the grid-cell controls only on the grid's own
      child; FIXED in the probe and the UAT (Accordion, Content tab, the cell found in the stored tree)
    - `[x]` P0-b · "P.beside cannot select…" was NOT a helper bug: the probe selected the band (scaffolding nobody can select) and
      `H.select` never set its own step label, so the error was reported under the previous step. FIXED: `H.select` names its step
      (seen: "select(n0-6)")
    - `[x]` P0-c · the "Editing <screen>" banner and its reset link had `dark:` without `midnight:` / `purple:` (rule 5) — FIXED, seen
      readable in all four editor themes
    - `[x]` P0-d · my first UAT pass switched the WEBSITE theme only; the editor's own themes were never seen — `uat-p0-apptheme-headed.js`
    - `[x]` P0-e · that script read OKLCH colours as rgb() (contrast ~1:1 for readable text) — colours now go through a 1-pixel canvas
    - `[x]` P0-f · the UAT's grid-label regex lost its backslashes (shell escaping) and could never pass — fixed with the Edit tool
    - `[x]` P0-g · my first byte-compare built two trees (new band ids each call) — re-measured on ONE tree
    - `[x]` P0-h · two old audit tests PINNED the bug (typed "300px" / "320px" stored as px) — now expect rem
- `[x]` **BATCH G-1 · The page grid in the engine** — CLOSED 2026-10-04 (session 87422eae; HEADED UAT `uat-g1-headed.js`, six
  windows, 70 screens each — every device of the Preview's menu and both sides of every breakpoint — CLEAN in all six, 0 page
  errors; gate: typecheck 0 · eslint 0 errors · vitest 4,174 · test:fast 806/806) (area: page grid · 5 changes, OPENED
  2026-10-04 by the user's "go" — tree AC-37b; plan https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN). MEASURED FIRST: the
  engine already ran sections edge to edge with the side space as section padding, and paragraphs already stop at a
  readable width (`min(56ch, 32em)`, #86). The fit rule was NOT already done as decided — ledger #12–#16. CHANGES:
  - `[x]` (1) PAGE-GRID PAGES: `pageGrid` on a new page root (both factories), `onPageGrid` on every spaced block of it
    (`markPageGrid` at the editor's two commit points); saved pages keep neither
  - `[x]` (2) THE NEW DEFAULTS (`SPACE_GRID`, same fluid unit): side space 23 (16.1px at 360 → 32.2px wide; was 32) · gap 17
    (11.9px → 23.8px; was 16) — measured, words 1rem from the edge on a phone. PLUS (#6) a page-grid row of 2+ columns OWNS
    the side space (`gridBandOwnsGutter`, `pageBandInset`), its columns none at their sides (`SectionFlag` "gridBand")
  - `[x]` (3) `lib/page-grid.ts`: settings, columns per rung (6 / 12, half on the phone), share ↔ span, whole / half snap,
    counts that do not divide, the span label
  - `[x]` (4) `BoxSite.pageGrid` + `BoxPage.grid` + `resolvePageGrid` (one grid per site, a page may opt out)
  - `[x]` (5) BDD `tests/features/components/website/page-grid.feature`; `tests/unit/page-grid.test.ts` (78, palette
    enumerated, every guard mutation-proven); `tests/unit/uat-screens.test.ts`; e2e `side-by-side-drop.spec.ts` (#10)
  HEADED UAT CHECKLIST — every line SEEN (`scripts/uat/logs/g1-uat10.out`, pictures `logs/uat-g1/`):
  - `[x]` a NEW page built through the palette (header: logo beside the name, three menu links · hero words + photo · three
    cards · four stats · footer), Preview at all 70 screens: words ≥ 1rem from the edge (16.1px at 360 · 32.2px at 1920+),
    two blocks side by side one gap apart (15 · 17.2 · 21.5 · 23.8px at 768 · 1024 · 1536 · 1920), no sideways scroll,
    every line of a row EVEN (cards 3 → 1+1+1; stats 4 → 2+2 → 1+1+1+1; 2+2 on a 360 phone), canvas Mobile 16.1px =
    Preview 375 16.1px; pictures read at 360 · 412 · 768 · 1024 · 1366 · 1536 · 1920 · 3840: edges on one line, even rows
  - `[x]` an OLD saved page: side space 22.4px at Mobile (unchanged); its Inspector reads "Default 2rem"
  - `[x]` a section copied from the saved page and pasted onto a new one: 16.1px; moved within the new page (arrow key): 16.1px
  - `[x]` the Inspector on a page-grid block reads "Default 1.44rem"; set to 0 → 0px; back to default → 26.22px exactly
  - `[x]` 150 % and 200 % browser text: every row even at every screen, words ≥ 24 / 32px from the edge, no sideways scroll
  - `[x]` light · dark · midnight · purple (one window each); RTL: the Preview flipped to dir=rtl at all 70 screens, words
    ≥ 16px from both edges, no sideways scroll (after #4). The builder has no page-direction setting yet — that is the
    languages work (RULE AF), not this batch
  LEDGER G-1 (every line closed):
  - `[x]` #1 spec clash, Alt for free AND for half-lines — the user agreed Alt = free, Shift = half-lines
  - `[x]` #2 MY OWN: an edit to `emptyPageRoot` silently did nothing (CRLF) — caught by reading the file back, redone
  - `[x]` #3 TEST: the UAT measure counted the parked skip link — skipped as the page audit does
  - `[x]` #4 REAL, pre-existing: a right-to-left page scrolled 16,000px sideways (the skip link parked by `left`) →
    `inset-inline-start`; guard mutation-proven; RTL clean at all 70 screens
  - `[x]` #5 TEST: `screens.js` skipped three MacBooks (labels in single quotes) — found by its own guard
  - `[x]` #6 REAL: sections side by side kept the page's side space on BOTH sides (80px apart at 1536 vs 30px to the edge)
    → the row owns it; seen fixed in the pictures and measured (one gap)
  - `[x]` #7 TEST: `uat-screens.test.ts` read a file without normalising line endings (found by `source-reading-tests`)
  - `[x]` #8 TEST: `dropBeside` aimed 8px inside a column, now ON its child → aims just outside when the point lands inside
  - `[x]` #9 TEST: the G-1 script dropped the hero's text INTO its stack (beside the heading) → under the heading
  - `[x]` #10 REAL (caused by #6): a drop in a row's own side space made a NEW ROW below → a row's sides belong to its
    columns (`computeDrop`); reproduced through the UI (`probe-g1-drop.js`), e2e guard failed on the old build ×3
  - `[x]` #11 TEST, pre-existing: "the MIDDLE of the opening" demanded > 200px, which a phone canvas never gives → > 100px
  - `[x]` #12 REAL (decided, not built — I wrongly noted it as done): the phone always stacked → the fit rule on the phone too
  - `[x]` #13 REAL (decided, not built): 3 cards went 2 + 1 → only EQUAL lines on a page-grid row; tablet's 3-across rule steps aside
  - `[x]` #14 REAL: words sized at their CEILING (1.6× too wide on a phone) → at the fluid size they have there (fixed point)
  - `[x]` #15 REAL: a Stat's own padding not counted (3 + 1 at 600px, measured by `probe-g1-stats.js`) → padding and borders down the tree
  - `[x]` #16 REAL (caused by #6): the query measures the PAGE, the row is two side spaces narrower (2 + 1 at 1440 / 200%) → added
  - `[x]` #17 TEST: width-round-trip compared rounded widths exactly (497 vs 498 with a fractional side space) → within 1px
  OBSERVED, NOT A DEFECT (for the user): stacked cards sit ≈ 35px apart on a phone (the section space above and below)
  against 12px side by side; an Image dropped as a "logo" arrives large (no Logo block yet — L-6 / the catalogue)

- `[x]` **BATCH R-4 · CSS grid, flexbox and box alignment from MDN, every property — mirrored in the builder** — CLOSED 2026-10-04 (session 9fa0fee9: read · mapped `css-layout/07-map.md` · proven 10,908 headed checks, 0 failed · SIGNED by the user with D1–D5) — OPENED 2026-10-04 by the user's "go" (session 87422eae) (area:
  layout research · 3 changes, QUEUED 2026-10-04 by the user mid-G-1: "study everything in its entirety… so a user can
  position any component, any text, wherever they want on the grid… with the margin and padding"; runs right after G-1
  closes — one job at a time, RULE RS). The user's links, each read COMPLETELY with every on-topic link inside (RULE R):
  MDN justify-content · justify-items · CSS grid layout guide (all its guide pages) · the `grid` shorthand · Learn:
  Flexbox · Flexible box layout: basic concepts (and its guide pages) · the CSS reference index (for the alignment,
  grid and flexbox modules and their properties). EXTENDS, never redoes: `advanced-css/06` (flexbox) · `07` (grid) ·
  `08` (Nexter) · `page-grid/01` · R-2's property set. Changes:
  - `[x]` (1) READ + STORE: `docs/web-anatomy/css-layout/` — every grid, flexbox and box-alignment property (justify-* /
    align-* / place-* content · items · self, gap, grid-template-*, grid-auto-*, grid-area / -row / -column, order,
    flex-*), each with its values, what it does in grid vs flex, an MDN-sourced example, and the traps — DONE 2026-10-04
    (session 9fa0fee9): readers 1–6 plus the four completeness lines below; `08-property-index.md` checks all 575 MDN
    properties (304 layout, 91 not stored before, all read)
  - `[x]` (2) THE MAP (RULE MAP): every property × value → does the builder do it today (canvas AND export), which control,
    or a GAP; working examples per value proven in a browser; combinations with the page grid, margin and padding — DONE
    2026-10-04 (session 9fa0fee9): `css-layout/07-map.md`, six questions a person answers (Q1 where in the page · Q2 which
    columns · Q3 where inside · Q4 room around and inside · Q5 how big · Q6 leaves the flow) plus three container
    questions; ~110 rows, each with today / CORE · AUTO · AVOID · LATER, the reason, and the plain words. PROOF (HEADED, six
    windows): `scripts/research/css-layout-combos.js` on `css-layout/examples/combos.html`, a dressed school page with the
    page grid as a real CSS grid, Arabic when RTL. Three seeds × (68 single values + 420 random combinations) over all 70
    screens of `screens.js` at 100 / 150 / 200 % text → **10,908 checks, 0 failed**. 2 measured "cannot here" (a cap wider
    than a 360px phone); 6 WARNINGS (a person's own 2rem inner space at 200 % text). Mutation-proven four ways; screenshots
    read. It FORCED 8 rules the build must implement (07 §4.1): cover fills its area · a shape fills across and never
    down · an absolute block on the grid writes both lines · the fit rule for every block, tested on whole words · a
    floating block with words falls back into the flow · fluid default inner space · `dir="auto"` per text block · a warning
    when a layer covers words
  - `[x]` (3) THE "ENOUGH" CHECKLIST for the user to sign, and the build batches it implies (RULE UI: a person can place
    any block anywhere on the grid with these, in plain words, as live previews) — SIGNED 2026-10-04 by the user (session
    9fa0fee9: "I approve this. Let's move on"), with these DECISIONS:
    - `[x]` D1 · page layouts: PRESETS (recommended) AND a blank canvas AND a "DRAW YOUR AREAS" editor — the user: "a user can
      start from a canvas and even when they pick one they can change the whole page layout… make sure that when they draw
      the area editor it follows everything that's supposed to follow". Built so: the drawing is turned into column LINES per
      screen (never stored as `grid-template-areas`, so it cannot go silently invalid); the editor only draws rectangles;
      reading order follows (a drawn order that differs from the page moves the blocks in the tree, or warns)
    - `[x]` D2 · no negative-margin control (recommended) BUT both overlap effects are KEPT: (a) a badge / price circle half
      outside a card's corner = floating held to any corner + "half outside the edge", the card never clips it; (b)
      overlapping avatars in a row = a row option "Overlap the items: none · a little · more", for pictures and badges only
    - `[x]` D3 · the fixed-width sidebar is built NOW, not later (the user: "if it's just a few extra work, let's add it"):
      a "fixed width (rem)" choice beside the shares on the Grid block's columns; stacks on a phone; not on the page grid
      itself (its columns stay equal, the AC-37b decision)
    - `[x]` D4 · "Across · Down" rows with Fill AND the 3×3 picture kept as a shortcut that sets both rows (Fill shown as a
      stretched square) — the user: "we do both"
    - `[x]` D5 · page-grid sections EMITTED as a real CSS grid — APPROVED; saved pages keep their bands
    - CARRIED → G-3 change (6): the nested-trees proof (proposed: in G-3's UAT, built through the UI) — not answered; carried as proposed
    The checklist as it was written:
    - `[x]` AXES mapped: every grid / flex / alignment / placement property and value, plus the A–Z index (07 §2, §7)
    - `[x]` EXAMPLE PER VALUE: 68 single values, each doing what it says and visibly different (RULE T), at 1280 and 360
    - `[x]` COMBINATIONS across axes: 1,260 random combinations, every screen, three text sizes, LTR and Arabic RTL — 0 failed
    - CARRIED → G-3 (6) · NESTED: one level proven (a card row on subgrid in a container, button pushed to the bottom). NOT proven: random
      nested trees (section → Grid block → card → button, each with random values). Proposed: prove them in the builder
      itself during G-3's UAT, since they are trees a person builds (RULE Y). The user's call
    - `[x]` SATURATION, measured: the last two readings (21 new grid goals, 91 new properties, 15 flexbox articles) added
      0 new axes — every new goal maps to an existing row; only 6 L-rows (all AUTO / LATER)
    - `[x]` TASTE: R-3's Awwwards / Dribbble page-grid study (signed) · CARRIED → G-6: REAL WORLD: low-cost Android + Slow 3G (G-6) ·
      CARRIED → the pilot (RULE RK): PEOPLE: the pilot schools (RULE RK) — both after the build, as planned
    - QUESTIONS FOR THE USER (07 §6): (1) page layouts as one-click presets, never "draw your areas" · (2) no negative margins;
      overlap only by layering or floating · (3) a fixed-width sidebar LATER · (4) two alignment rows "Across · Down", each
      with Fill, replace the nine squares · (5) a page-grid section is EMITTED as a real CSS grid (the only way to get "to
      the last line", bleed, layering in one cell and subgrid). Recommended: yes to all five
    - BUILD BATCHES IT IMPLIES (≤ 6 changes each, one open at a time; each is opened in BATCHES with its full UAT checklist — P-0 is OPEN):
      - OPEN (in BATCHES) **P-0 · R-4 ledger**: measure and fix R4-1 … R4-5 (the handover: first, unless the user says otherwise)
      - QUEUED **G-2 · layout guides + grid panel** (as planned)
      - DECIDED by the user 2026-10-04 (after seeing G-2's guides: "the first and last column… you can't put any content to
        it… you should be able to"): the page grid's columns run EDGE TO EDGE — the first and last are ordinary columns; the
        side space is a DEFAULT OUTER MARGIN on whatever sits in them (left in the first, right in the last), changeable to 0;
        a section / stack with a background still bleeds to the edge and its contents keep the margin; a row of equal cards stays
        equal (each gives up the same width); saved pages untouched. Supersedes G-1's "side space as section padding outside the
        columns" (`gridBandOwnsGutter` / `pageBandInset`) for page-grid pages; the guides are redrawn with it (no side strips)
      - OPEN (in BATCHES, 2026-10-04) **G-3b · the page as a real CSS grid** (split from G-3 2026-10-04; G-3 CLOSED):
        (1) page-grid sections emitted as a CSS grid (D5) · (2) start line, "to the last line", full / bleed / half-bleed per rung
        (A1–A5, A15) · (3) Alt free → lines + margin · (4) the fit rule for every block · (5) "Space between columns" ·
        (6) rows as real grid rows ("span N rows" across sections). THE ORIGINAL G-3 LINE, KEPT:
      - (split) **G-3 · placing, extended**: (1) page-grid sections emitted as a CSS grid (Q5), COLUMNS EDGE TO EDGE with the side space as the items' default outer margin (above) — WITH "span N rows" (the user,
        2026-10-04: a block covers N row lines, e.g. a big gallery photo 2 rows tall; height still grows with its words) and the
        panel's "Space between columns" (carried from G-2) · (2) A1–A5 + A15 lines per rung
        (from / to / to the last line / full / bleed / half-bleed / half-lines) · (3) Alt free → lines + margin · (4) the
        fit rule for every block (proof rule 4) · (5) keyboard + "Line up with the grid" · (6) nested-tree UAT
      - QUEUED **P-1 · alignment and spacing panel**: (1) Across / Down with Fill (C1–C5) + the 3×3 shortcut that sets both (D4) · (2) container Down incl. "Text lines
        up" + `safe` (C9, C10) · (3) Spread incl. even spacing + wrapped lines (D3, D5) · (4) Push to the end / bottom + the
        stored % margin shown (G2, G4) · (5) RTL: logical sides, `start` / `end`, `dir="auto"` measured (G7, L1, L4, D1) ·
        (6) `min-width: 0` on fills measured (E8)
      - QUEUED **P-2 · size and shape**: (1) Shape with proof rule 2 (H1) · (2) readable width per block + largest width (H2, H3)
        · (3) height as a minimum only (H6) · (4) fluid default inner space checked (proof rule 6)
      - QUEUED **G-4 · Grid block, extended**: (1) cards fit ≥ X + fill / fit (B3, B4) · (2) subgrid (J1, J2) · (3) a fixed-width
        column / sidebar beside the shares (B5, D3) · (4) the planned splits gallery · (5) purpose picks
      - QUEUED **P-3 · page layouts (D1)**: (1) presets gallery (live previews) setting lines per screen (A8) · (2) start from a
        blank canvas · (3) the "draw your areas" editor → lines per screen, rectangles only · (4) reading order follows the
        drawing (move in the tree, or warn) · (5) change the whole layout after picking one, nothing lost (one undo)
      - THE USER'S PICTURE OF THE WHOLE (2026-10-04, mid G-2), which G-3 … G-5 and P-3 build to and the layout story (RULE L)
        TELLS: "a page completely maxed out on rows and columns… they decide how many rows and columns… then how they place the
        items" — columns: a count per screen (G-2, 4–24); rows: a ROW SIZE, the page has as many as its content needs (a fixed
        row COUNT would cut words on a phone); a block covers columns AND rows from line to line (G-3); "blow over, bleed out to a
        different section" (G-5 bleed / straddle); "a section into another section" (G-4 subgrid); "a float on top of a section —
        how does it affect the grid": it leaves the flow and pushes nothing, it is PINNED to grid lines so it lands in the same
        place on every screen (proof rule 3), it falls back into the flow on a phone when it holds words (proof rule 5) — shown
        and explained in the builder where it is set, not only in the docs
      - QUEUED **G-5 · layering, extended**: (1) layer over in one cell + the covers-words warning (I1, I2, proof rule 8) · (2)
        floating held by any corner + "half outside the edge" for a badge / price circle (I5, D2a) · (3) Cover (I6, proof
        rules 1 + 3) · (4) the floating fallback (proof rule 5) · (5) "Overlap the items" on a row, pictures / badges only
        (D2b) · (6) scroll padding under a sticky header + safe areas (L2, L3)
      - QUEUED **G-6 · close-out** (as planned)
  - `[x]` READER 6 · the builder today (`css-layout/06-builder-today.md`, read from the code at `2f56caa`): of 46 grid / flex /
    alignment properties 7 fully reachable (15%) · 26 partly (57%) · 13 not at all (28%) — areas, auto-fit tracks, subgrid,
    dense, aspect-ratio, min / max width, align-content, translate, end / negative lines, grow ratios, reverse directions
  - `[x]` READER 4 · flexbox (`css-layout/04-flexbox.md`): 20 MDN pages read fully (both user links, the module, every guide,
    every flex property incl. the new `flex-line-count`, `min-width: auto`); `display` read for its flex values only (grid /
    table values are other readers'). Traps for the builder: the automatic minimum size (`min-width: 0`), the `flex`
    shorthand's defaults, greedy wrapping, visual order ≠ reading order, `safe` alignment. Four checks against the builder
    carried to the map (min-width:0 on fills · wrap by basis or floor · start/end vs flex-start for RTL · `wrap balance`)
    - `[x]` COMPLETENESS (RULE R) — READ 2026-10-04 (04 §7: 15 links fully, 7 spec / sponsor / image links not read with the reason; Froggy from its levels.js): MDN's external on-topic links from the flexbox pages (CSS-Tricks guide, Flexbox Froggy, the
      accessibility articles MDN cites) — listed, NOT read yet
  - `[x]` READER 2 · grid guides (`css-layout/02-grid-guides.md`): 14 guide pages read fully from MDN's own source (mdn/content):
    landing, basic concepts, relationship, line-based placement, template areas, named lines, auto-placement, aligning items,
    box alignment in grid, logical values / writing modes, accessibility, common layouts, subgrid, grid lanes (MDN's new name
    for masonry, experimental, Safari 26.4 only); plus fr / repeat() / minmax() / fit-content(), 10 glossary entries, the media
    objects cookbook, support data. The Learn "CSS grid layout" module: prose read, examples skimmed (they repeat the guides).
    New beyond what was stored: abspos items in a grid, `display: contents` dropping semantics, anonymous items, `order` and
    auto-placement, auto-fill / auto-fit validity, subgrid rules, RTL, grid lanes; 45 goals → CSS; 18 traps for a generator
    - `[x]` COMPLETENESS (RULE R) — READ 2026-10-04 (02 §6: the Learn module + its skills test, 22 external links — 12 fully, 3 partly, 6 videos unreadable, 1 not followed with the reason; goals 46–66, traps T19–T28): the Learn grid module's examples (skimmed) and MDN's external links from the guides — listed, not read
  - `[x]` READER 1 · box alignment (`css-layout/01-box-alignment.md`): 32 MDN pages (31 fully) + 7 browser-compat files: all 12
    justify / align / place × content / items / self + gap / row-gap / column-gap, the module and its 5 guides, the flex and
    grid alignment guides, 5 value types, 5 glossary entries, CSS Gaps and its guide. Two summaries were re-fetched as quotes
    only after the summariser invented content; `<content-distribution>` code samples left out (looked invented). Found:
    MDN's block-layout guide is out of date — `align-content: center` centres a plain block (all browsers since Apr 2024);
    `justify-*` ignored in flex (auto margins); `-content` often has nothing to distribute; `safe center`; % gaps; `start` /
    `end` for RTL. Not followed, off-topic (listed): anchor-center, gap decorations (`rule-*`), vertical-align, scroll-snap-align
  - `[x]` READER 3 · grid properties (`css-layout/03-grid-properties.md`): 26 of 27 MDN pages fully — `grid` (the user's link),
    grid-template(-columns / -rows / -areas), grid-auto-(columns / rows / flow), grid-area / -row / -column + the four start / end
    longhands, repeat() / minmax() / fit-content() / fr, and the subgrid · grid lanes · named lines · auto-placement ·
    line-based placement guides; `display` for its grid values only. Masonry_layout → 404 (renamed "grid lanes", read).
    Two rules taken from the spec and marked so (start after end swaps; two spans ignore the end). Includes a data model a
    builder must store + 8 validity rules. Traps: `1fr` = `minmax(auto,1fr)`; shorthands reset silently; negative lines
    reach only the explicit grid; a bad areas template is dropped whole; visual ≠ reading order; subgrid Baseline since 2023
  - `[x]` READER 5 · the CSS index, layout half (`css-layout/05-css-index-layout.md`): 71 MDN URLs (69 fully); all 68 modules
    marked layout yes / no; 24 layout modules beyond grid / flex / alignment (display, positioned layout, box model, sizing,
    logical, writing modes, overflow, containment / container queries, multi-column, floats, shapes, anchor positioning,
    transforms, object-fit, scroll snap, sticky, viewport, gap decorations…), each with what the repo already stores. Ranks
    every way to place a box (flow + margin / padding / gap → flex → grid placement → relative nudge → absolute → sticky →
    fixed → anchor → transform → float) with its reflow / reading-order / large-text cost; conclusion: free x / y dragging
    should become a grid cell + an offset, never page coordinates. 6 summariser mistakes corrected in its section 6.
    NOT STORED before: fragmentation / paged media, env() safe areas, scroll anchoring, overscroll (memory only)
    - `[x]` COMPLETENESS (RULE R) — READ 2026-10-04 (05 §7: all 16 sub-guides fully from MDN source; the A–Z index in 08, 575 properties): the user's `/Web/CSS` page and `/Web/CSS/Reference` — their A–Z property index was cut off
      by the fetcher (headings and guide lists read); 12 linked sub-guides listed and not read (Logical basic concepts and
      sizing, Shapes from images / generator, writing-mode systems, vertical controls, scroll-snap events, scroll anchoring,
      object-view-box, env(), media-query sub-pages, Learn overflow, coordinate systems)
  - LEDGER R-4 (found by READING the code): R4-1 … R4-5 MOVED to **BATCH P-0** as its five changes (2026-10-04, as the
    handover planned: "fixed in the first build batch"); each is measured through the UI there before it is fixed
  - LEDGER of session 9fa0fee9 (the map and its proof, 2026-10-04) — every line FIXED, re-run clean (10,908 checks, 0 failed):
    - `[x]` R4-6 · a stray `css-layout/skills.md` holding "404: Not Found" (a failed fetch) — deleted
    - `[x]` R4-7 · example: Cover ignored its own alignment and caps (box alignment applies to absolute boxes) → proof rule 1
    - `[x]` R4-8 · example: a Shape with Down: Fill, or not Fill across, took its width from its height (4,539px on a phone) → rule 2
    - `[x]` R4-9 · example: no fit rule — a 1½-column block was wider than its lines at 200 % text → rule 4
    - `[x]` R4-10 · example: "₦150,000" at a fixed 2.5rem scrolled a 360px phone sideways at 200 % text — now fluid
    - `[x]` R4-11 · harness: the RULE T baseline (half width, Across: Start) hid real differences — baseline is full and filled
    - `[x]` R4-12 · example + engine trap: an absolute grid child with `grid-row: 1` ran to the padding edge — both lines → rule 3
    - `[x]` R4-13 · example: the fit rule missed a box wider than its lines (padding + one glyph) — measures the box + margins
    - `[x]` R4-14 · harness: RULE T compared the box only (not its words, the header, the fees row); "cannot here" not measured
    - `[x]` R4-15 · example: the fit rule skipped bleeds — a bleed now grows toward the content, nothing else over the side space
    - `[x]` R4-16 · example: the partner kept its old columns after the fit widened the subject (overlap) — re-placed, wraps
    - `[x]` R4-17 · SEEN in a screenshot, not measured: a floating block's words ran out of its area onto the next card → rule 5 + check
    - `[x]` R4-18 · SEEN: words broken mid-word ("Welco / me") — `anywhere` hid the overflow → the fit rule and a check test whole words
    - `[x]` R4-19 · SEEN: English on an RTL page put the full stop on the wrong side → Arabic content + `dir="auto"` → rule 7
    - `[x]` R4-20 · example: fixed 1.5rem padding at 200 % text broke words on 320–414px phones → fluid default → rule 6
    - `[x]` R4-21 · example: the fit rule ran on the subject only, and before the partner settled; a layered pair tested only one
      block → every block, neighbours first, both of a pair
    - `[x]` R4-22 · SEEN: a layer over a block with words covers them — the choice working as asked; the build adds the page-check
      warning → rule 8 (carried into G-5)

- `[x]` **BATCH S-1 · Spacing — the engine and the inspector** — CLOSED 2026-09-30 (final HEADED UAT on build u8hfywi0, 4 themes, 124 checks each, 0 findings; gate: vitest 3,794 · eslint 0 · test:fast 640) (area: spacing · 6 changes) — tree 1.1.1 → SPACE BY DEFAULT
  - changes: (1) section gutter + section space · (2) header/footer bar 1rem · (3) coloured/bordered box 1.5rem, plain box 0
    · (4) gaps: stack 1rem, columns 1rem (a gutter, S1-a), grid both · (5) inspector shows "Default · size", Back to default, inner
    spacing on every element (c-23) · (6) bulk inspector reads the real padding (c-24)
  - LEDGER of the S-1 pass (first HEADED UAT 2026-09-30, build l-Q5HJ74r: 69 checks per theme, the same 11 findings in
    every theme; RE-RUN the same day on build eglndaoX, 4 themes × 5 rungs, canvas + Preview: **92 checks per theme, 0
    findings**):
    - `[x]` S1-a · **columns side by side at page level touched** — FIXED: a band's gap across is a GUTTER (`gutterCSS`,
      `bandGutter` in `lib/box-model.ts`): the band reaches half a gap past each side, each column gives up one gap from
      its share and takes half a gap each side, so a full line of shares fits exactly however many share it; 1rem DOWN too
      (the user, 2026-09-30); tablet basis `(100% − m%) × share − gap`; the canvas resize measures each column's SLOT.
      Bands made from now on only (`makeRowBand` without a gap); a saved band stored 0 and publishes byte for byte as it
      did. Seen: one line with a 14 · 16 · 18 · 22px gap at 768 · 1024 · 1280 · 1920, outer columns flush with the page
      edges, 11px apart down on a phone, canvas = Preview; a boundary dragged 73.2px grew the column 73.2px, outer edges
      still, gap unchanged. Guard `space-by-default.test.ts` "columns side by side" (the CSS EVALUATED, mutation-proven)
    - `[x]` S1-b · the Spacing controls showed stored px ÷ 10 as "rem" — REAL rem now; seen: "Default · 2rem"
    - `[x]` S1-c · HARNESS: computed padding divided by the zoom — seen: header bar 16 · 18 · 22px at 1024 · 1280 · 1920, canvas = Preview
    - `[x]` S1-d · HARNESS: shift-click for two blocks — the box is dragged; and it now ENCLOSES both (the Heading is wider
      than its Text, the box was drawn to the Text's edge and selected one). Seen: "Inner spacing: 0rem" for two
    - `[x]` S1-e · top space 4rem → 1rem — seen: section 18.2/36.5px at 1280 (1rem fluid), canvas = Preview
    - `[x]` S1-f · **my S1-a basis added the gap twice** (`W% × (100% + gap) − gap` where `%` is already the widened band)
      — the third column wrapped at every rung in the first re-run. FIXED; the old unit test had pinned the wrong STRING,
      so the guard now EVALUATES the CSS and sums the slots (red on the old formula, green now)
    - `[x]` S1-g · HARNESS: the gap-down floor was 12px while 1rem is fluid (11.2px on a phone) — now the stack gap's 10
    - `[x]` S1-h · **one drag was one undo step PER FRAME**: Ctrl+Z after a column resize undid 6 of 73px (predates S-1).
      FIXED: every canvas gesture (resize, free drag, floating resize) carries one merge key (`gesture:<time>`), and the
      page merges a gesture however long it is held. Seen: Ctrl+Z put the column back, 4 themes
    - `[x]` S1-i · **a box dragged from the grey space beside the page selected nothing** — the room around the page was
      outside the canvas, though the inspector says "drag a box on empty canvas". FIXED (`marqueeRoom`); seen through the
      UI: failed on build GyQCN, `probe-room-marquee.js` PASS on eglndaoX
    - `[x]` S1-j · the bulk inspector said "2 sections selected" for a Heading and a Text, and its line had no midnight /
      purple colour — now "2 blocks selected", all four themes; test + scenario updated
    - `[x]` S1-l · **the gate was misread**: `test:fast | tail` reported the PIPE's exit (0) while 7 width-round-trip tests
      had FAILED — the "7 failed" heading was cut off by the tail. Every gate run now writes its log and its own exit code
    - `[x]` S1-m · `width-round-trip.spec.ts` measured the old rule (columns touch, each exactly 1/n): it now measures each
      column's SLOT (its box plus the band's half gap each side) — the same definition the canvas resize uses — and asserts
      a gap ≥ 10px is drawn between them
    - `[x]` S1-n · **a left-edge round trip came home at 50.02% beside 50%** (100.02%: the line no longer added up) — the
      left edge re-measured its total in pixels, and a gap puts columns on fractional pixels. FIXED: closing gives back the
      STORED total (width + gap-margin), and the width is stored to two decimals; guarded by that spec (red → green)
    - `[x]` S1-o · **an Alert or a Quote at fit width ran 11px past a 375 phone's edge** (export-layout-invariants, 3
      tests): `max-width: 100%` of a widened band is the line PLUS a gap. FIXED: every column in a gutter band is capped at
      `calc(100% − gap)`; guard in `space-by-default.test.ts`; 640 browser tests green
    - `[x]` S1-p · **every picture background and quoted font stack was dropped from the published page** (predates S-1;
      found by the new picture-background box: canvas had it, Preview did not): the stylesheet rules were serialised for an
      ATTRIBUTE, `url(&quot;…&quot;)`, and a `<style>` block never decodes entities. FIXED: `styleString(css, "sheet")`
      keeps quotes and escapes `<` the CSS way; the old test that PINNED `&quot;` in the sheet is corrected; guard
      mutation-proven
    - `[x]` S1-k · **the checklist lines the probe did not drive** — now driven through the UI (seen below): a BORDERED box and a
      PICTURE-BACKGROUND box (only coloured + plain were built); 0 in the PREVIEW, after a RELOAD and at every size (only
      the canvas); ICON inner spacing (Heading, Text, Link, Image were); a page SAVED BEFORE space by default opened in the
      browser (unit guard only). `probe-spacing.js` extended + `probe-saved-page.js`; all four lines ticked below
  - checklist (each at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920, canvas AND Preview, all four
    themes) — ticked from the re-run on eglndaoX (Light · Dark · Midnight · Purple Dream, 92 checks each, 0 findings):
    - `[x]` a Heading dragged onto an empty page: every block's words ≥ the gutter floor from both page edges; no sideways
      scroll at any rung (heading 22px from the left at 375)
    - `[x]` two sections one under the other: section space above and below: 16 · 18 · 22px at 1024 · 1280 · 1920, canvas = Preview
    - `[x]` a header with a logo and four links: bar 16 · 18 · 22px above and below at 1024 · 1280 · 1920, gutter at both ends, links spaced
    - `[x]` a coloured section, a bordered box, a picture-background box: words 1.5rem from their edge; a plain box adds 0
      — coloured 17/22 · 27/36 · 34/45px in at 375 · 1280 · 1920; bordered 18/24 · 29/38 · 35/46; picture 17/22 · 27/36 ·
      34/45 (it reached the Preview only after S1-p); plain box 0
    - `[x]` a picture dropped on the page still reaches both edges (0 / 0px at every rung)
    - `[x]` a stack of three blocks (stack gap), a row of three columns (one line at 768–1920, see S1-a), a 3×2 grid
      (gap across and down) — the default gaps at every rung
    - `[x]` inspector: each control reads "Default · size"; set 0 → 0 on canvas and Preview, after reload, at every size;
      one side changed, the others keep the default; Back to default; Ctrl+Z; keyboard and screen-reader label — SEEN:
      "Default · 2rem", 0 → 0 on the canvas (by keyboard, Home, on the slider found by its accessible name), one side,
      Back to default, Ctrl+Z; a section set to 0 is still 0/0/0/0 after a reload and at every rung, canvas and Preview
    - `[x]` a Heading, Text, Link, Image and Icon each given inner spacing through the inspector (c-23) — each drew
      4/4/4/4px on the canvas after one step, then Ctrl+Z
    - `[x]` two blocks selected: the bulk slider shows what they have — "Inner spacing: 0rem" (c-24), from the grey room
    - `[x]` a page saved before this change opens exactly as it was; a block added to it arrives with the defaults —
      `probe-saved-page.js`: the saved columns still touch, padding still 0; a Stack added through the UI arrives 16/32px
    - `[x]` 150% browser text: the section space grows (18.1/36.2 → 22.1/44.2px at 1280); the exported CSS has no pixel spacing
- `[x]` **BATCH S-2 · Spacing — components breathe, the audit measures it** — CLOSED 2026-09-30 (HEADED UAT on build -BHdJe1L, 4 themes, 132 checks each, 0 findings; sidebar HEADED on EQ3zdB, 4 themes; gate: vitest 3,896 · eslint 0 errors · test:fast 724) (area: spacing · 5 changes)
  - (5) **blocks placed one under another touch** (asked by the user 2026-09-30, seen in the S-1 screenshots): a
    component or button placed straight on the page gets NONE of the section space (`leafPaddingCSS` skips self-painting
    blocks) and the page itself has gap 0, so a component sits against the one above/below it; coloured sections, a row
    of columns and a picture also meet with no space. The user suggests 0.5–0.8rem, "mostly bottom margin", stacks not
    included. **DECIDED by the user 2026-09-30 ("go with your recommendation"):** every block placed straight on the page —
    components and buttons included — gets the section space above and below, OUTSIDE its own painted box, so coloured
    sections still meet; **1rem**; a stack inside a stack is spaced by its parent's gap; never a per-block bottom margin.
    **CODED 2026-09-30, waiting for the S-2 UAT pass.** The user decided the same day: it is shown and overridden
    by **Outer spacing** ("Default · 1rem" for a block dropped on the page — the gutter is its band's, S2-f; Back to
    default); Inner spacing stays the component's own padding. Built
    as a MARGIN (`outerDefaults` / `outerSpaceCSS` / `sectionPlaceIn` in `lib/box-model.ts`, one call in the canvas and
    one in the export), so the selection outline stays on the painted box. It covers the `component` nodes, the Button
    AND the catalogue components built as trees (Card, Quote, Stat, Badge, Rating — they are containers with a
    `preset`, which the first version missed). Straight on the page: 1rem above/below + 2rem gutter each side, and a
    block stored at width 100% gives the side margins back (`calc(100% − 4rem)`); a column of a band: 1rem above/below
    only (the band's gutter spaces it across); in a stack: nothing. Guard `space-by-default.test.ts` "S-2 (5)" (75
    tests, red first, mutation-proven on the export line); scenarios added to `box-builder-spacing.feature`
  - LEDGER of S-2:
    - `[x]` S2-a · a component's Inner spacing read "Default · 1rem/2rem" on the page though nothing was drawn (its own
      padding is only drawn once set) — FIXED: a self-painting block's inner default is 0 (`spaceDefaults`); guarded
    - `[x]` S2-b · the Inner/Outer spacing side boxes had `dark:border-white/10` with no midnight / purple variant — FIXED
    - `[x]` S2-c · a Card built as a tree carried the section padding INSIDE its painted box — FIXED; SEEN in the S-2
      pass: the Card's words 28px in from its own edge at 1280 (its design's padding), the gutter outside it
    - `[x]` S2-f · **a component dropped on the page touched the page edges** (found by probe-s2 on build rLg4Bh, and by the
      user the same hour: "still hugging the far end on the left or on the right"): through the UI nothing is ever
      straight on the page — a drop lands as a column of a page BAND, whose gutter puts its outer columns flush with the
      edges, so the "page" branch of `outerDefaults` was unreachable and a Card / Quote / Alert sat 0 / 0px from the edges,
      a Button 0px from the left, at every rung, canvas and Preview. The old unit test built `root.children = [card]`, a
      shape the UI never makes. FIXED: `pageBandInset` — a band of the page holding a self-painting block (not a coloured
      section) keeps the 2rem gutter as its own padding, so the columns' gap arithmetic and the resize's slot measure are
      untouched; it steps aside once that block's Outer spacing across is set. One call in the canvas, one in the export.
      Guard: `space-by-default.test.ts` "S2-f" builds the UI's shape (page → band → component), 8 red with the inset off.
      SEEN (build -BHdJe1L, 4 themes): 22.4 / 36.5 / 44.8px from both edges at 375 / 1280 / 1920, canvas = Preview.
      ponytail: a coloured section sharing a band with a component is inset with it
    - `[x]` S2-g · HARNESS: probe-s2 read the band's half-gap side margins as Outer spacing and expected "Default · 2rem";
      a column's sides are the band's gutter, so it now checks top/bottom — the Outer spacing a band column shows is
      "Default · 1rem", which is what this checklist says. The feature file said 2rem too — corrected
    - `[x]` S2-h · two comments (BoxInspector 840, pinning-explained.spec 227) gave the reversed rule as the reason a
      floating bar reserves no space — reworded to the real reason; no behaviour changed
    - `[x]` S2-i · **the app's sidebar linked to 14 pages that do not exist** (`/attendance` and 13 never built), and the
      page prefetched them: two 404 console errors on every screen with the sidebar, which failed
      `side-by-side-resize.spec.ts` "no console error" in the full gate (24 of 24 under 8 workers; it had passed by timing).
      The guard now names the URL of a failed load. DECIDED by the user 2026-09-30: Attendance → `/students/attendance`,
      the 13 HIDDEN until built (`UNBUILT` in `Sidebar.tsx`, listed in `docs/MVP_AUDIT.md` and tree 4). Guard
      `sidebar-links.test.ts` (every menu link has a page; red on `/attendance`). SEEN (`probe-sidebar.js`, build EQ3zdB, 4 themes side by side, HEADED): no School Management group, Academic → Classes only, Management → Finance · Library, Attendance clicked → `/students/attendance`, 0 failed loads on `/`, that page and the builder; the resize guard 24 of 24 under 8 workers (was 0 of 24)
  - checklist (written 2026-09-30, BEFORE the pass; each at 375 · 768 · 1024 · 1280 · 1920, canvas AND Preview, 4 themes) —
    ticked from `probe-s2.js` on build -BHdJe1L (Light · Dark · Midnight · Purple Dream side by side, HEADED, built through
    the UI: 132 checks each, 0 findings; the first run on rLg4Bh found S2-f and S2-g):
    - `[x]` (5) a Card, a Button, a Quote and an Alert dropped one under another on the page: painted boxes 22.4 · 28.3 ·
      32.4 · 36.5 · 44.8px apart at 375 · 768 · 1024 · 1280 · 1920 (1rem each side, OUTSIDE the box); the gutter at both
      sides (after S2-f); two coloured Stacks meet (0.0px); selection outline on the painted box (Card, Alert)
    - `[x]` (5) the same four inside one Stack: 11.2 · 14.1 · 16.2 · 18.2 · 22.4px — the stack gap only, 0 margin above/below
    - `[x]` (5) the Card's Outer spacing: "Default · 1rem" → 0 → 0/0/0/0 on the canvas → still 0 after a reload → Back to
      default 16.2px above/below → Ctrl+Z back to 0; canvas = Preview within 4px at every rung
    - `[x]` (5) a page saved before this change opens exactly as it was; a Stack AND a Card added to it through the UI arrive
      with the defaults (the Card 32.4 / 32.4px from the edges, 16.2px under the block above), the saved sections untouched
    - `[x]` (1) every component in the catalogue × every design (68 tests, enumerated) — HEADED on -BHdJe1L, all green
    - `[x]` (2) the page audit: NOTHING on the UI-built default page at 5 rungs × 4 themes; on a section zeroed THROUGH
      THE INSPECTOR (probe-spacing) it reports W7a for the page edge and the coloured box; the seeded 0-gutter / 0-inner
      pages of `page-audit-whitespace.spec.ts` flagged too (HEADED, 16 tests)
    - `[x]` (3) W7b: nothing on the default page (5 rungs × 4 themes, UI-built); two sections with 0 space flagged — that
      page is SEEDED in the spec (HEADED), not built through the UI
    - `[x]` (4) the old wording: 0 hits in the four places; two more comments found and reworded (S2-h)
    - regression, HEADED on -BHdJe1L: `probe-spacing.js` (S-1) 124 checks × 4 themes, 0 findings
  - NOT BUILT, found while writing the story (an unbuilt feature, so queued, not a ledger line): the in-app **Page
    check** does not report W7a/W7b — only the sweep's `page-audit.js` does — though `box-builder-spacing.feature`
    "The Page check finds words too close to an edge" describes it. Queued as BATCH S-3 below
    - `[x]` S2-d · **every Stat design: the number sat 1.2px above its label** (the comma of "1,000+" on "Happy") —
      FIXED: the Stat's gap 0.25rem → 0.5rem; found by the new `component-breathing.spec.ts`
    - `[x]` S2-e · NOT A BUG, measured: sections stretched to share a short page's window in my test pages — the test
      helper `createRoot()` has a 600px floor; the app's page root (`emptyPageRoot`, `box-site.ts:37`) has none, and the
      published page measured 27px per Text on it. The audit spec builds on `emptyPageRoot`
  - CODED 2026-09-30 (waiting for the S-2 UAT pass), the user's decision the same day: **"never touch"** — each design
    keeps its own spacing; the floor is 0.25rem in the designs' fluid unit, not the page defaults:
    - (1) `tests/e2e/component-breathing.spec.ts`: every catalogue component × every design it offers (enumerated
      from the catalogue, 34 × 375/1280 = 68 tests), through the export — words ≥ 0.25rem from their visible box,
      words/icons of two parts ≥ 0.25rem apart. Red on S2-d; mutation-proven (Card padding 0 → red)
    - (2)+(3) `scripts/uat/page-audit.js` W7a (words < 1rem from the page edge; words touching their coloured box)
      and W7b (two sections' words < 1rem apart), as WARNINGS; `tests/e2e/page-audit-whitespace.spec.ts`: a
      default page reports nothing at 375 · 768 · 1280 · 1920, a 0 gutter / 0 inner / 0 section space each flagged
    - (4) the old wording rewritten in all four places; the two hits left (CLAUDE.md, this tree) describe the reversal
  - (1) a gap between a component's parts and padding from its own visible edge, the whole catalogue · (2) audit check:
    words closer than the gutter floor to the page or their coloured box's edge · (3) audit check: sections closer than
    the section floor · (4) the old "never a default" wording in the four places left (layout feature 347,
    `text-is-reachable.spec.ts` 34, design-foundation `02` 485, memory `feedback_radius_and_spacing.md`)
- **F-1 CLOSED 2026-10-02, session 1fc987ff.** Gate: typecheck 0 · eslint 0 errors · vitest 3,974 (all passing) ·
  HEADED UAT `uat-f1-headed.js` 6/6 windows (light/dark/midnight/purple × 375/768/1280px); columns fill their line
  after a wrap, every theme and viewport. All F-1 code fixes committed. Background research:
  `C:\Users\eyite\educo-research\chain.log`.
- `[ ]` **BATCH S-3 · The editor's Page check warns about space** (area: Page check warnings · 2 changes, queued
  2026-09-30): (1) the in-app Page check reports words closer than 1rem to the page edge or touching their coloured box
  (W7a) and two sections closer than 1rem (W7b), as warnings, the way `page-audit.js` measures them — the scenario
  already exists · (2) **added by the user 2026-10-01:** a warning sign when a column is TOO NARROW FOR ITS WORDS — at
  any screen size, a column holding text narrower than its longest word — naming the column and the size, with a way to
  select it. The user asked: "if the columns are too tiny on screen for anyone to drop into… how are people going to be
  able to see what's in that column" when the site goes live. L-4's c-8 (decided B: the grid gives up columns rather
  than break words) fixes the published page; this tells the person building while they build
- `[x]` **BATCH E-0 · The build failures that stayed when run alone** — CLOSED 2026-09-30 (commits `78cc6ee`, `0ae9b5f`; gate: vitest 3,903 · eslint 0 errors · test:fast 737; E0-a…h ticked, E0-f recorded as a gap → Z-1) (area: sweep harness/drop) — the re-run of
  e-2/e-3 was STOPPED by the user at 3 of 14 (2026-09-30), on build OvtY9uAA, HEADED UAT:
  - page 68 (sonicdrive, blog index) — built, 0 errors ALONE → it was the machine
  - page 145 (soul-trane, about) — STILL FAILED alone on OvtY9uAA: a click timed out after 10 s. **Re-run alone
    2026-09-30 on EQ3zdB: it BUILDS (151 blocks)** — the click timeout is gone (not reproduced on a build with S-1/S-2) —
    but reported 81 errors, which gave E0-a/b/c. After their fixes, on W2q1ZFy1: 1 error, the e-4 case below
  - LEDGER of E-0:
    - `[x]` E0-a · HARNESS: `page-audit.js` L4 counted the S1-a gutter band's intended half-gap reach as "content spills
      out sideways" — 76 of page 145's 81 errors, and every page built since S-1. FIXED: a child reaching out with a
      negative side margin has its COLUMNS measured instead. Guard `tests/e2e/page-audit-spill.spec.ts` (a row of
      coloured columns in a section: no spill; a block really wider than its box: a spill), 4 red without the fix; in test:fast
    - `[x]` E0-b · **a menu's links were 18px apart on the canvas and 50px in the Preview** (page 145, every size ≥ 768:
      the menu, "Apply now" and the line shifted ~12%). Two faults, found by `probe-e0b.js` (the dresser's own burger
      header, built through the UI): (1) `linkLineGap` returned `gap: undefined` beside its longhands and React dropped
      both on the canvas (its inline style had no column-gap at all); (2) since S1-a a menu line was ALSO a band with a
      gutter, so every link took half a gap each side on top of its 2rem. FIXED: longhands only; `bandGutter` is 0 for a
      line of menu items (`isMenuLine`). Guard `space-by-default.test.ts` "E0-b" (both mutations red). SEEN: canvas =
      Preview, 0 blocks differ at 1280, links 2rem apart in both
    - `[x]` E0-c · the 96px HOLE at the end of the menu's line on the canvas at 1280 — the same fault as E0-b; gone with it
    - `[x]` E0-d · HARNESS: `h.js` `visibleRect` clipped a target to the blocks panel on the left but not to the Inspector
      on the right — page 393's drop "beside" was released on the Inspector's "Outline style" button. FIXED: clipped to
      `aside[aria-label="Inspector"]` too. (393 itself built on the next run; the clip is exercised by every page run)
    - `[x]` E0-e · **a column 4–7px wider than the section it sits in** (L4 on 4 tier-99 pages: 337, 393, 398, 399, 1024 →
      1920) — the ENGINE, found once the E0-a audit fix measured band columns: a band that holds a narrowing grid is a size
      container (`hostsNarrowingGrid`), and `--box-u` carries `0.5cqw`, so the band's reach read the section OUTSIDE it
      (16.07px) while its columns read the band itself (11.2px, the clamp's floor) — 5px out, never given back. FIXED at
      the root, the way `--box-t` was (#133): the band declares the gap ONCE as a registered length (`@property --bx-gut`,
      in `TYPE_UNIT_PROPERTY_CSS`, emitted by both engines), and the reach and every column's margin, basis, max- and
      min-width read `var(--bx-gut)`. Guard `page-audit-spill.spec.ts` "a row of columns inside a NARROW column" (a 6+6
      grid as the full-width column of a band in a 30% column): 2 red on the old CSS, green now; S1-a's evaluator in
      `space-by-default.test.ts` now substitutes `--bx-gut` and still sums every line of shares to the band exactly
  - **E-0 run 2026-09-30, in PARALLEL (6 windows, build W2q1ZF), the 11 pages not yet re-run:** 6 built (335, 337, 398,
    399, 400, 401), 5 failed (23, 336, 396: scroll timeout · 334: "only 3px visible" after the build had already gone
    wrong — a 40px Stack, overlapping headings · 397: "the canvas offered the drop and added nothing", = e-1). Their
    findings sorted: L4 spill → E0-e (fixed) · words broken ("afternoon", "welcomed", "1,000+") → c-8 / e-7 in L-4 ·
    HOLE → c-7 / e-9 in L-4 · canvas≠Preview → e-4 in L-2 · Tablet 4 columns → e-6 in L-3. Page 393's second run
    crashed mid-audit ("execution context was destroyed") under that load
  - `[x]` **CHECK asked by the user 2026-09-30** (DONE — answered by E0-g and E0-h below, HEADED 4 themes) (from a screenshot of the E-0 run: "Meet the team", four star icons each
    in a column as tall as the quotes beside it): a block dropped UNDER an icon in such a cell lands under it in the same
    column (not as a new grid cell), canvas and Preview, every rung; and a cell can be set to hug its content instead of
    stretching. Built through the UI after the runs finish; anything else → the E-0 ledger. Also noted: the harness fills
    a cell narrower than TEXT_MIN with an Icon, so a "team" section shows stars instead of photos — a realism limit of the
    dressed pages to record in the sweep report
  - **Run on build Sb_l4U (committed `78cc6ee`, gate: vitest 3,900 · eslint 0 errors · test:fast 736):** the spill is
    GONE everywhere (399: 34 → 1 error, 398: 32 → 13). ALONE, 23 · 336 · 396 · 393 BUILD (their parallel failures were
    load). STILL FAILING ALONE → bugs: **334** (the build goes wrong before "only 3px visible": a 40px Stack, headings
    over the menu) and **397** ("the canvas offered the drop and added nothing", into an icon cell = e-1). **337** failed
    in parallel with the same e-1 message (it built before) → to re-run alone. Every other finding is a queued class:
    words broken (c-8), HOLE (c-7), canvas≠Preview (e-4), Tablet 4 columns (e-6)
  - `[x]` E0-f · **a column too narrow on screen to drop into** (page 334, fails alone): its recipe is a 5-column row with
    4 hand-sized columns inside the 28% one, so in the editor window each is ~40px and the 4th Stack's target 3px; the
    builder obeys the sizes, and the canvas is always "Fitted to screen" — there is NO ZOOM, so no person could drop there
    either. DECIDED by the user 2026-09-30 ("go" on the recommendation): RECORDED AS A GAP here, and canvas zoom is
    built as its own batch — BATCH Z-1, queued straight after L-1 (a new feature, one area at a time, RULE RK)
  - `[x]` E0-g · **a block dropped just under an ICON: the drop was offered and NOTHING was added** — 4 of 4 through the UI
    (`probe-icon-cell.js`), and page 397's failure. MEASURED: no `drop` event reached the page; the element under the last
    `dragover` was the icon's `<path>`, and at `dragend` it was no longer in the page — React re-set the SVG markup while
    the drag passed over it, and the browser delivered the drop to the detached node. FIXED: an injected decorative SVG is
    never a pointer target (`pointer-events: none` on the icon block, the Alert's icon, the Accordion's icons); the pointer
    lands on the block's own box. SEEN: 4 themes, the Text in the icon's cell, the grid still 3 cells, canvas = Preview at
    every rung. Guard `tests/e2e/drop-under-icon.spec.ts` — a REAL mouse drag (a synthetic drop cannot show it)
  - `[x]` E0-h · **the spare height of a column stretched by its neighbour was SHARED between its blocks** — the Text
    landed 55px under the icon (its band grew to 73px around a 36px icon). DECIDED by the user 2026-09-30: "blocks at the
    top", then — when the gate showed it opened a hole at a column's foot after a shared edge is dragged
    (`resize-leaves-no-gap.spec.ts`, 66px) — "LAST BLOCK TAKES IT". FIXED (`hostFills`, `childStyle`): in a host-stretched
    column only the last block grows; a lone block still fills it (equal-height Cards); a height the user set shares as before. Guards: `space-by-default.test.ts` "E0-h" (red on
    the old rule), and `drop-under-icon.spec.ts` asserts one stack gap under the icon
  - `[x]` the user's icon-cell CHECK — answered by E0-g and E0-h above
  - **337** fails alone with and WITHOUT E0-e (bisected on a build with E0-e reverted: it failed at another drop step)
    → not a regression; its drop failures join e-1 / e-3 in L-1. **397** was E0-g
  - E-0 CLOSED 2026-09-30. Next: BATCH L-1
  - [SUPERSEDED — see "Run on build Sb_l4U" above: 393 BUILT alone, and every page below was re-run] page 393
    (elytetemplate, services) — STILL FAILS alone: the drag never reached the canvas, twice → a bug (e-3)
  - [SUPERSEDED, as above] not yet re-run: 23, 334, 335, 336, 337, 396, 397, 398, 399, 400, 401
- `[x]` **BATCH L-1 · Tier-99: blocks that would not drop or select** — CLOSED 2026-10-01 (commit `509822a`; gate:
  vitest 3,915 · eslint 0 errors · test:fast 739; page 337 18 of 18 in six windows; L1-13 parked on the user's word)
  (area: drop / select · 5 changes, OPENED 2026-09-30, session after 25f18c91)
  - **UAT CHECKLIST (written first).** Every run is a HEADED UAT on a FRESH production build, in PARALLEL (`--jobs=6`); a
    page re-runs ALONE only after it failed in parallel. Each failure that stays is reproduced through the UI with a REAL
    mouse drag (the `probe-e0g.js` / `probe-icon-cell.js` pattern), fixed at the root, guarded (red without the fix), and
    its fix seen in all 4 themes (Light · Dark · Midnight · Purple Dream) at 375 · 768 · 1280 · 1920, canvas = Preview
    - `[x]` L1-r1 · tier 99 (`--plan=dressed99`): 2, 87, 142, 153, 227, 278, 337, 385 — PARALLEL, build Uz_bd6Ge (FRESH),
      21 min: **7 of 8 BUILT, every one with 0 missed drags** (2 = c-22: 178 blocks · 337: 188). Their errors are all
      queued classes: HOLE + L8 broken words (L-4), R11 canvas≠Preview (L-2). FAILED: **142** (lexara 404) "could not
      select 2-29 (got w-1z)", then a click timeout → alone
    - `[x]` L1-r2 · tier 95 (`--plan=dressed95`), the 19 build failures: 12, 13, 26, 34, 40, 56, 71, 73, 74, 75, 76, 106,
      107, 109, 117, 118, 124, 133, 134 — PARALLEL, 40 min: **16 of 19 BUILT**. FAILED: **12** (muebles) "cannot drop into
      f-2g: only 15px of it is visible" · **109** (tarot) "could not select 8-17 (got none)" · **124** (patina) "the drag
      never reached the canvas, twice (after beside(s-7d,Card)) · released at (845,755) nothing" → all alone
    - `[x]` L1-r3 · tier 80 (`--plan=dressed`) page 38 (locallistingtemplate faqs) — BUILT, 212 blocks: the column selects
    - `[x]` L1-r4 · previewcheck `B30_footer_5col` and `P4_stress` — both `ok`
    - `[x]` L1-r5 · everything that failed in parallel, re-run alone — ALL FOUR FAILED ALONE TOO (bugs, not load): 142
      and 109 → L1-3 · 124 → L1-3 (+ L1-1) · 12 → L1-4 (Z-1)
    - `[x]` L1-r6 · (closed 2026-10-01: 337 built 18 of 18 in six windows, see L1-7) the 7 e-1 pages (2, 87, 153, 227, 278, 337, 385) on the fixed build (0D0EXS4f, 3 windows beside 3–4
      others AND a `next build`): 5 of 7 BUILT (87 · 153 · 227 · 278 · 385); 2 and 337 → L1-7. Page 2 then built 2 of 2
      on the same build with no build running; 337 in batch A
    - `[x]` L1-u · for each fix: the repro through the UI, before (fails) and after (works), 4 themes × 4 widths, and the
      Preview at every rung — e-1 (`probe-l1e1.js`, 0D0EXS4f), L1-3 (`probe-l1-sticky.js`, J7UBYmMI), L1-9
      (`probe-l1-header.js`, _nj0GR7K), L1-7 (`drop-into-empty.spec.ts` red on _nj0GR7K, green after; page 337 18 of 18
      on zQEc74E7), each recorded in its ledger line
    - `[x]` L1-g · gate, 2026-10-01 at the commit: **typecheck 0 · eslint 0 errors (105 warnings, the accepted
      category) · vitest 3,915 of 3,915 · test:fast 739 passed**. The first full vitest run found L1-15
    - `[x]` L1-11 · I BROKE THE LINT: the second build folders (`.next-b` … `.next-e`) were linted — 127,808 "errors", all
      build output. FIXED: `eslint.config.mjs` ignores `**/.next-*/**` (and `.gitignore` has `.next-*/`); then 3 unused
      variables in my own new probes, removed → eslint 0 errors
  - LEDGER of L-1:
    - `[x]` L1-0 · the tree said page 393 "STILL FAILS alone" and listed 11 pages "not yet re-run" after both had been
      settled (lines above) — FIXED: marked SUPERSEDED (a documentation defect, no code)
    - [SUPERSEDED — measured and fixed, see the `[x]` L1-1 line below] L1-1 · HARNESS (suspected): page 124 released a
      drop at y=755 in a 720px window, on nothing. To MEASURE on the alone re-run before any fix
    - `[x]` L1-12 · the tree held L1-1 twice, open here and closed below — FIXED: this line marked superseded
    - `[~]` L1-13 · **page 337 ALONE on a FRESH build (zQEc74E7, 2026-10-01) FAILED at a NEW step**, 26 blocks in, 159 s:
      `under(jq-r, Text)` — the drag was let go at (354,468), OUTSIDE the canvas (every last dragover "OUTSIDE-CANVAS
      NOT-accepted"), while the failure screenshot shows the target heading "Meet the team" at about x 400–580, y 345–380,
      the page ending at y 391. The aim did not match the heading. The harness now prints where `under` aimed
      (`page.__aim`); re-run in SIX windows to measure (alone it failed, so it is not load). Six windows: 6 of 6 went
      past that step and built (1 failure in 13 tries — intermittent). The harness now also records where the aimed block
      lay AT RELEASE. Then 6 more windows and 6 on a COLD server (testing "the first run after `next start`"): 18 of
      18 built — NOT REPRODUCED (1 in 19), the cold-server idea not confirmed. **PARKED by the user 2026-10-01 ("go" on
      the recommendation):** open, instrumented (aim + position at release), watched in every sweep from here; the
      next occurrence carries its measurement and reopens it as a ledger line of the batch that sees it
    - `[x]` L1-15 · **my new guard `drop-into-empty.spec.ts` was in neither browser suite list**, so nothing would ever
      have run it — caught by `test-scripts.test.ts` in the full vitest run. FIXED: added to `test:invariants:rest`
      (package.json) and `scripts/test-fast.js`; it ran green in test:fast
    - `[x]` L1-14 · **a background-limit notice on the shell that started `next start` was taken for the server dying**,
      and six good runs of 337 were stopped ~25 min in (2026-10-01). MEASURED: the server (pid 26828, started 03:27) kept
      serving the fresh build; only its shell wrapper was killed. FIXED: `uat-pages.js` refuses to start unless
      `check-fresh-build.js` says FRESH, checks again after EVERY page and, if the server is gone or stale, stops starting
      pages and says no failure since is a product finding (proven: no server on 3999 → "NOT RUN", exit 2; fresh 3100 →
      runs). Trap written in `docs/TESTING.md`; the server is started with the 2-hour background limit. The 37-minute
      shared timeouts of the last session remain UNEXPLAINED (the server-limit idea is unproven, withdrawn)
    - `[x]` L1-3 ROOT, FOUND AND FIXED: `pinCSS` clause 3b gave a sticky container in a row `height: calc(100dvh - …)` —
      a sidebar whose CONTENT is taller than the screen kept a screen-tall box and its content ran on below it, out of the
      row, over the next section and off the page's end. Reproduced through the UI (`probe-l1-sticky.js --tall=1`, 736px
      spilled at every scroll step; `--tall=0` and plain: 0), and measured on page 124 itself (the aside's computed height
      720px, sticky). FIXED: `min-height` (the larger of the user's and the screen's) — a short sidebar is still the
      screen's height and keeps its travel, a tall one holds its content. Guards: `pinning-holds.spec.ts` "a sidebar
      whose content is taller than the screen…" (red on `height`: "runs 600px past its own foot"; 8 green with the fix),
      `pinning.test.ts` clause 3b. **HEADED UAT, build J7UBYmMI (FRESH, `.next-c` on 3300), Light · Dark · Midnight ·
      Purple Dream:** canvas — the sidebar 1455px, 0px spilled, its row holds it at every scroll step; Preview at 375 · 768
      · 1280 · 1920 — its content stays above the next section, still sticky (screenshot
      `probe-l1-sticky-out/sticky-tall-Midnight/preview-768.png`). Regression: tier-95 page 13 (right-sticky) still
      builds. **Pages 142, 109 and 124 now BUILD** (136, 175 and 345 blocks) with L1-3 + L1-8 — all three failed alone all
      day; their remaining audit errors are the queued classes (L-2, L-4). Regression, tier 99 pages with a sticky header
      AND a sticky sidebar (13 · 28 · 31 · 46 · 61 · 76, build J7UBYmMI; 79 · 94 · 127, build _nj0GR7K) and tier-95 page 76:
      10 of 10 BUILT, every error R11 / HOLE / L8
    - `[x]` L1-7 · **CLOSED 2026-10-01: page 337 BUILT 6 of 6 in SIX headed windows side by side** on build zQEc74E7
      (FRESH): 188 blocks each, 66 Preview sizes, ~13 min each. Its 2 errors are queued classes: HOLE at Tablet (L-4),
      R11 canvas≠Preview at Wide — the burger menu wrapping "Contact", 79 vs 63px (= e-4, L-2). Pages 2 and 337 on the e-1 build: "offered the drop and added nothing (into, an empty Stack) · released
      at (740,5xx) on <svg>" — INTERMITTENT: page 2 built 2 of 3 on the same build; both failures ran beside a `next
      build`. NOT the "+" icon: 4 of 4 alone and 36 of 36 in six windows landed on it. 337 then BUILT in batch A (no
      build running) — and FAILED again on _nj0GR7K with no build running: `into(m-15, Text)`, released on the empty
      Stack's "Choose a block to add inside" button; m-15 is an empty Stack with a background and 24px padding. NOT
      LOAD. `probe-e0g.js` (that very shape, through the UI) in five windows: 15 of 15 landed. So 337 has something the
      probes lack. The harness now records the browser's `drop` / `dragend` events of every drag (target, detached,
      handled) and prints them on a lost drop. **MEASURED, 3 of 4 runs lost it the same way:** at the release point, pointer
      still — `dragover <div> accepted`, `dragenter <button>` (the empty box's "+"), `dragleave <div>`, `dragleave <button>`,
      and NO `dragover` after; the browser sent `dragend`, never `drop`. The editor's hint came and went under a still
      pointer, and the drop had no accepted target. FIXED (`BoxCanvas`): while a block is carried (`data-box-drag-in`) the
      empty box's hint and the grid's ghost cells take no pointer — where a drop lands is `computeDrop`'s, from canvas
      coordinates. Guard `tests/e2e/drop-into-empty.spec.ts` (a REAL drag held over the "+"): red on _nj0GR7K ("the
      pointer is on the empty box's hint (<path>)"), green on 6UEsvQW6. Acceptance: page 337 ×5 + page 2 on 6UEsvQW6 —
      **all five 337 runs went PAST the step that lost the drop** (≈155 blocks, the failures stopped at 40). Then ALL SIX
      windows timed out at the same moment ~37 min in (`scrollIntoViewIfNeeded` / click, 10 s) — page 2 after its build had
      finished, every run ~3× its usual time, no build running, 5 GB RAM free: a machine-wide slowdown, cause not found.
      Screenshot `dressed99-out/p337-build-fail.png` shows a healthy page. Page 337 re-run ALONE was STOPPED by the user's
      "stop here" before it finished. **Still to do: 337 alone to completion; then L1-7 closes**
    - `[x]` L1-8 · HARNESS: `visibleRect` clipped a target to the blocks panel and the Inspector but not to a PINNED block
      lying over it — so drops aimed under a stuck header or a sticky sidebar landed IN that block's row: a column beside
      the page header (page 124, which then made the header screen-tall), an Image and a column in the sidebar's row (109,
      124). FIXED (`h.js`): pinned blocks over the target are clipped away, as a person aims at the part left open.
      **Extended after batch A (page 109, on the L1-3 build):** a heading lying BEHIND the stuck header was not scrolled
      out from under it, and `under()` let go without checking anything was visible — so `under(heading, Stack)` dropped
      INTO the sticky header and the rest of the page was built inside it (a 2,746px header, the recording in
      `logs/p109-A.json`). FIXED: `visibleRect` scrolls a target clear of a stuck bar; `under()` throws "only w×h px
      visible" like `dropInto`, whose message now gives the height too (page 142's "only 778px visible" was 778 WIDE)
    - `[x]` L1-1 · HARNESS, measured: page 124 released at y=755 in a 720px window — the Card it aimed beside hung below
      the page's end (L1-3), and `visibleRect` never clamped to the window. FIXED: clamped; `dropBeside` reports "only
      w×h px visible" instead of letting go off screen
    - `[x]` L1-9 · ENGINE: a pinned HEADER / NAV / FOOTER sharing a row with a column got clause 3b's screen height (page
      124's header: 720px). FIXED: clause 3b skips a container whose meaning is header, nav or footer. Guard
      `pinning.test.ts` (3 cases, red without `!bar`, green with it). Reproduced through the UI first (`probe-l1-header.js`
      on the build without it: a 720px `<header>` around a 37px heading, canvas and Preview). **HEADED UAT, build
      _nj0GR7K (FRESH, `.next-d` on 3400), 4 themes:** the header 70px on the canvas, 50 · 61 · 78 · 96px in the Preview
      at 375 · 768 · 1280 · 1920 (screenshot `probe-l1-header-out/PurpleDream/canvas.png`)
    - `[x]` L1-10 · TEST BUG: `probe-l1-sticky.js`'s Preview check read the sidebar, scrolled, then read the next section,
      and reported the 200px scroll step as "~180px into the next section" at every width (the screenshot showed no
      overlap). FIXED: scroll first, then read both
    - `[x]` L1-3 (the report — root and fix in "L1-3 ROOT" above) · **page 142 (right-sticky sidebar): the sidebar lies ON TOP of the main content** — FAILS ALONE (31 min,
      "could not select g-29 (got n-1z)"). Screenshots `dressed99-out/p142-crash.png`, `p142-build-fail.png`: the main
      column's bands run the full width (x 118→1078) and the sticky sidebar's Card, picture and list (x 810→1033) are
      drawn over them, so a click on the covered part selects the sidebar. To trace: the build steps (the page's child
      run with DEBUG), then a small repro through the UI (`probe-l1-sticky.js`, sticky vs plain). **Tier-95 page 109**
      (tarot, right-sticky) FAILS ALONE the same way: "could not select o-17 (got none)", `dressed95-out/p109-build-fail.png`
      — the sidebar (x 904→1077) over a light section that runs 118→1078
    - `[x]` L1-4 · tier-95 **page 12** (muebles) FAILS ALONE (4 min): "cannot drop into q-2g: only 15px of it is visible".
      NOT A BUG of the engine — MEASURED from its recipe (`page-plan-95.json`[12]): a row of 8 hand-sized columns
      (15·10·10·15·**5**·10·20·5 %) inside the 70% main column, with rows inside those columns (e.g. 7 columns of 15%
      of a 5% column) — a few px each, which the builder obeys and nobody can drop into without zoom. = E0-f's class →
      **BATCH Z-1: page 12 joins page 334 as its acceptance test**
    - `[x]` L1-2 · **e-1 FOUND: a palette CLICK with an Image grid cell selected put the new block INSIDE the Image** — the
      S-1 repro, driven through the UI (`probe-l1e1.js`, build Uz_bd6Ge): the Image lands in the grid as a 7th cell, then
      a Stack tile CLICKED with it selected adds nothing, 3 of 3; a Stack DRAGGED under it lands, 3 of 3. It was never a
      drop. ROOT: `insertBlock` inserts INSIDE a selection whose parent is a grid ("a grid cell"), and an Image cell
      passed — the Stack became the image's child, which an image never draws. FIXED: `paletteClickSlot` (box-model),
      only a CONTAINER cell receives inside; a leaf cell gets the block after it, as the next cell. Guard
      `tests/unit/palette-click-slot.test.ts` — 2 red with `isContainer` removed, 5 green with it. **HEADED UAT, build
      0D0EXS4f (FRESH, `.next-b` on 3200):** Light · Dark · Midnight · Purple Dream, 3 tries each, 4 windows side by side —
      12 of 12 clicked Stacks are the grid cell right after the Image (235×198px), none inside it, 0 page errors
      (screenshot `probe-l1e1-out/Midnight/try-1-clicked-stack.png`); the Preview at 375 · 768 · 1280 · 1920: no block
      inside a picture, no sideways overflow. The 7 e-1 pages re-run on this build → see L1-r6
    - `[x]` L1-6 · HARNESS: after a tile CLICK that added nothing, the error said "the canvas offered the drop… released
      at (…)" — the previous DRAG's values, never cleared. That is why e-1 was read as a drop bug for two batches. FIXED:
      `clickTile` clears them and the error says "a click on the <tile> tile added nothing" (h.js, pages.js)
    - `[x]` L1-5 · HARNESS: a page whose image filling crashed after the build left a STALE tree file (page 142's was
      from 15:36), and a failed build saved no step and no fields beyond width. FIXED (`uat-pages.js`): the tree is
      written right after the build, the failed step is kept as `failedStep`, and the whole stored page as
      `page-<n>.site.json` on a failed build
  - (c-22 = tier-99 idx 2, already in e-1.)
  - e-1 · the canvas offered the drop and added nothing — 7 pages (idx 2, 87, 142, 153, 227, 278, 385). **A REPRO, 4 of 4
    windows (S-1 UAT 2026-09-30, build Ud1omUt2):** a 3×2 grid added after the 3rd column of a row; an Image clicked with
    the grid selected lands INSIDE the grid as a 7th cell; then a Stack clicked with that image selected is offered and
    added nothing (released at 1003,620 on the grid). Not yet shown to predate space by default — check on master first
  - c-22 · a page that built in the first run fails in the re-run (nodenza partners page: drop under a block added nothing)
  - page 38 of tier 80 · could not select the 2nd of 4 card columns
  - the 19 tier-95 build failures (could-not-select ×9 · drop-offered-nothing ×7 · barely visible ×1 · click timeout ×2)
  - previewcheck B30 / P4 · the harness's drop and select steps
- `[x]` **BATCH Z-1 · Canvas zoom** — CLOSED 2026-10-01 (gate: typecheck 0 · eslint 0 errors · vitest 3,923 · test:fast 748; HEADED UAT 4 themes 21/21, narrow 12/12, 200% browser 4/4; acceptance: tier-99 page 334 BUILT 443 blocks, tier-95 page 12 BUILT 242) (area: editor navigation · 6 changes, OPENED 2026-10-01; queued 2026-09-30 after L-1 — the user's "go" on
  E0-f): the canvas is always "Fitted to screen", so a hand-sized column ~40px wide (tier-99 page 334) cannot be dropped
  into, selected or resized by anyone. Zoom in / out / back to fit — buttons beside "Fitted to screen", Ctrl + / Ctrl − /
  Ctrl 0, Ctrl + scroll — with the page scrolling in both directions while zoomed, drops, selection, resize handles and
  the marquee all correct at every zoom, canvas = Preview unchanged. Research first (RULE R: how Figma, Canva, Webflow,
  Framer zoom), plan artifact, then build; tier-99 page 334 and tier-95 page 12 (L1-4), each re-run alone, are its
  acceptance tests
  - LEDGER of Z-1:
    - `[x]` Z1-a · **a block held on screen slid while the canvas was FITTED below 100%** — MEASURED through the UI
      (`probe-z1a.js`, six windows, one per device): 72px at Desktop (82%), 180px at Wide (55%) over a 400px scroll;
      0 at 100%. ROOT: `--canvas-scroll` / `--canvas-h` / `--canvas-top` / `--holder-top` were written in SCREEN px and
      used as lengths inside the zoomed frame. FIXED (`BoxCanvas.tsx`): divided by `zoomOf(host)`, and the page box is
      observed so a device switch re-writes them. Guard `float-pin.spec.ts` "HOLDS while the canvas is FITTED" — red
      without the fix ("travelled 168px at zoom 0.43"), 11 of 11 green with it; probe after: Desktop and Wide 0px
    - `[x]` Z1-c · NOT A BUG, measured: at Mobile the held block went back into the flow (`relative`, travelled the
      whole scroll) — the deliberate phone rule `floatStacksOnMobile` (`lib/box-model.ts:633`); the probe now labels it
    - `[x]` Z1-b · **an item's selection ring and toolbar were drawn off the item while fitted** — MEASURED through the
      UI (`probe-z1b.js`, an Accordion from the palette, six windows): at Wide (55%) the ring 142px narrower and 26px
      higher than its item, the toolbar ON the item; at Desktop (83%) 81px / 15px. FIXED (`ItemCrudLayer.tsx`): rects
      divided by the canvas zoom, the side choice compares screen space with the bar's screen size. Guard
      `item-ring-zoom.spec.ts` (built through the palette): red "-26, 0, -142, -14px at zoom 0.55", green with the fix;
      in both suite lists (L1-15's lesson). Probe after: 0/0/0/0 at every device, toolbar 4–8px beside the item
    - `[x]` Z1-d · (FIXED: the item toolbar is drawn at the inverse zoom and placed in screen px — SEEN 36px bar, 28px buttons, 36px handle at 25 · 50 · 100 · 200 · 400% in all four themes; the drop line 3px at 50% and 200%) **the editor's own chrome shrinks with the canvas**: at Wide (55%) the item toolbar's buttons are
      ~15px on screen — under the 24px target of WCAG 2.5.8 — and the block handles shrink the same way (screenshot
      `probe-z1b-Wide1920px.png`). The four editors researched keep chrome a constant size on screen. A DESIGN choice
      → in the Z-1 plan for the user's approval, built with the zoom
    - Z1-a and Z1-b COMMITTED `1550371` (gate: vitest 3,915 · test:fast 741)
    - `[x]` Z1-e · MY BUILD: the zoom's listeners never attached — the builder renders a loader first, and they were
      registered once, on that render, with no canvas. Found by the first-look probe (Ctrl+scroll did nothing). FIXED:
      attached when the canvas is there (`ready`), and again after the Preview (which replaces the editor) closes.
      Guarded by every key/wheel test in `canvas-zoom.spec.ts`
    - `[x]` Z1-f · two buttons named "Zoom in" once a block was selected — mine and the Inspector's hover EFFECT of that
      name; to a screen reader, two different actions with one name. FIXED: "Zoom canvas in" / "Zoom canvas out"
    - `[x]` Z1-g · MY BUILD: Space did not pan after a device was chosen — the device button kept focus and Space pressed
      it again. FIXED: only a button INSIDE the page keeps Space; otherwise Space pans and the button is not pressed (key
      down and up). Guard `canvas-zoom.spec.ts` "Space + drag pans" (red 400 → 550 expected, green)
    - `[x]` Z1-h · MY BUILD: "pointer on the canvas" came from enter/leave events, so over a selected block's handles
      (drawn in a layer outside the canvas) Ctrl + went to the BROWSER, and over the Blocks panel (floating on the canvas)
      it zoomed the CANVAS. FIXED: the pointer's position inside the canvas's rectangle, minus any dialog/menu over it.
      Guard "the shortcuts act on the canvas only while the pointer is on it" — red on the old build at the Blocks panel
    - `[x]` Z1-j · **with a block selected, the canvas took the keys of ANY focused control outside it** (predates Z-1;
      found by the UAT: Enter on the zoom readout opened nothing): Enter on a toolbar button edited the block's words
      instead of pressing it, Delete on a focused button DELETED the selected block, arrows moved it — WCAG 2.1.1 and lost
      work for a keyboard user. FIXED (`BoxCanvas.tsx` key handler): a focused control outside the page owns its keys.
      Guard `canvas-zoom.spec.ts` "a focused toolbar control keeps its own keys" — red on the old build (no menu), green
    - `[x]` Z1-k · MY Z1-j FIX WAS TOO BROAD: it also kept ESCAPE from the page when a control outside it had focus, so
      Escape no longer stepped out a level after an Inspector button was clicked — tier-99 page 153 (built in L-1) then
      failed "could not select b-57". NARROWED: a focused control keeps only the keys it uses (Enter, Space, arrows,
      Delete, Backspace, Home, End). SEEN on build .next-b: page 153 BUILT (230 blocks), with 87 · 227 · 278 · 2 in six windows; canvas-zoom.spec 7/7 (the Z1-j guard still red-proof on Enter and Delete)
    - `[x]` Z1-m · **the toolbar became TWO ROWS (93px) on a 1536px screen — the user's own** — found by the gate
      (`builder-chrome-fits.spec.ts`): the zoom group (187px) pushed the bar ~108px past one row. FIXED: the "Hidden" and
      "Base size" words show from 1700px (they were already hidden below 1024; the controls keep their names and
      tooltips), and the guard now lists the zoom controls among those that must be on screen. Not enough alone — re-measured 19px short (left 866px, right group 681 of 662). Then: an icon-only ToolBtn is `compact` (26px, over the 24px target) and the right group's gap 8 → 6px. SEEN: one row, 56px at 1536 (group 655 of 662), builder-chrome-fits + canvas-zoom 8/8, screenshot toolbar-1536-midnight
    - `[x]` Z1-n · TEST BUG: `canvas-zoom.spec.ts` "edge dragged at 200%" failed in the full run (30% → 30%): the handle
      was grabbed where it was drawn BEFORE the zoom — the handles are re-measured a frame later, and under load the test
      read them first. FIXED: it waits until the handle sits on the block's edge — passed in the next full run (747)
    - `[x]` Z1-p · the shared `ToolBtn`'s active and hover backgrounds had `dark:` with no `midnight:`/`purple:` (rule 5) — added; SEEN: the hovered + in Midnight
    - `[x]` Z1-o · eslint 2 errors — an unused variable in each of `probe-z1.js` and `probe-z1-extra.js`. Removed
    - `[x]` Z1-l · PROCESS: vitest (the tree guard, a few seconds) was run while pages 334 and 153 were still building
      in headed windows — the standing rule, broken a second time today. 334 built; 153's failure is re-run (Z1-k)
    - `[x]` Z1-i · a recorded limit — ACCEPTED by the user 2026-10-01 ("go ahead" on the recommendation: it only affects near-empty pages) (`ponytail:` in CanvasZoom.tsx): zooming round a point holds only as far as
      the page can scroll — a page shorter than the window grows downward from its top (33px off on a one-box page; ≤1px
      on a page that scrolls, measured). Design tools add empty room round the page; added only if users miss it
  - `[x]` research — `docs/web-anatomy/editor-zoom.md` (Figma, Canva, Webflow, Framer; + Wix Studio, Penpot; sources)
  - `[x]` **PLAN APPROVED by the user 2026-10-01** ("I approve the proposal as you've written it"; decision 2: "I will
    do what you recommend" — the plain wheel scrolls; 3 and 4 CONFIRMED by the user the same hour, "also do what you
    recommend": zoom remembered per device size in this browser, switching device goes back to Fit).
    Plan: https://claude.ai/artifact/REMMiWJU5ufUgnBs7cvqZH —
    controls beside the device buttons, Ctrl +/−/0 and Shift 0/1/2, Ctrl+scroll and pinch around the pointer, Space-drag
    pan, width and zoom kept separate, constant-size chrome (Z1-d), 25–400%, kept per device in the browser. Four
    decisions: approve · plain wheel · remember the zoom · switching device. **Revised 2026-10-01 at the user's word:**
    Ctrl +/− zoom the CANVAS only while the pointer or focus is inside it; everywhere else they stay the browser's own
    zoom (WCAG 1.4.4 for the builder itself), and the builder is checked usable at 200% browser zoom
  - THE SIX CHANGES: (1) controls − / readout-menu (Fit, 50, 75, 100, 150, 200, 400%, Zoom to selection) / + beside the
    device buttons, replacing the "Fitted to screen" badge · (2) keyboard inside the canvas: Ctrl +/− step 25…400%,
    Ctrl 0 and Shift 0 → 100%, Shift 1 → Fit, Shift 2 → the selection · (3) Ctrl+scroll and pinch zoom around the
    pointer; the plain wheel scrolls · (4) the zoomed page scrolls both ways; Space+drag and middle-drag pan · (5) the
    editor's chrome keeps its screen size at every zoom (Z1-d) · (6) the zoom kept per device in this browser; a device
    switch goes back to Fit
  - **UAT CHECKLIST (written 2026-10-01, BEFORE the build).** One HEADED pass, six windows, fresh production build;
    each line in Light · Dark · Midnight · Purple Dream, and at the devices it names:
    SEEN 2026-10-01 — HEADED UAT, six windows, build YfVTIQqT (`.next-c`, FRESH): `probe-z1.js` in Light · Dark · Midnight ·
    Purple Dream, 21 of 21 each (the first two runs' failures were all the probe's own — pan tolerance, the Blocks panel
    shut before a drop, a click left of a 2,292px item at 400% — except Z1-j, a real bug, fixed); `--case=narrow` 12/12;
    `--case=browser200` 4/4; `probe-z1-extra.js`; `canvas-zoom.spec.ts` 7/7 (HEADLESS GATE):
    - `[x]` (1) readout "Fit · 55%" → menu by keyboard (Enter opens it once Z1-j was fixed; Escape closes) → 150% chosen;
      + stops at 400% and − at 25% (disabled); names "Zoom canvas in/out", "Canvas zoom, …"; readout contrast 16.1 · 15.2 ·
      17.5 · 15.4 : 1; at 375 · 768 · 1280 the controls sit inside the window, no sideways scroll (screenshot narrow-375)
    - `[x]` (2) on the canvas Ctrl+ / Ctrl− / Ctrl 0 / Shift 1 → 200 · 150 · 100% · Fit; over the Inspector and over the
      Blocks panel the canvas did not change; over a selected block's handle it zooms (Z1-h); Shift 1 typed in a text block
      typed "!" and nothing zoomed; Shift 2 → 262% on the selected heading
    - `[x]` (3) Ctrl+scroll: the point under the pointer moved 0 and 1px (≤2 on a page that can scroll — Z1-i for a short
      one); the plain wheel scrolls; a two-finger pinch on a 1024×768 touch tablet 100% → 300%
    - `[x]` (4) at 400% all four page edges reachable (68 · 32 · 53 · 391px clear); Space+drag 101/82 for 100/80; middle-drag
      48 for 50; a space typed in a text block is a space (" zz")
    - `[x]` (5) item toolbar 36px, its buttons 28px, the resize handle 36px at 25 · 50 · 100 · 200 · 400% (were 15px
      buttons at 55%, Z1-d); the drop line 3px thick at 50% and at 200%. The block's floating toolbar is drawn in the same
      page-level layer as the handles (BoxCanvas portal), outside the zoom
    - `[x]` (6) Wide kept 150% after a reload, Mobile opened at Fit; the saved site holds no zoom (3,832–3,853 chars); the
      Preview has 0 elements with a CSS zoom
    - `[x]` (7) a block dropped into a stack landed at 50 · 100 · 200 · 400%, 4 of 4 in every theme; an edge dragged 120px
      at 200% stored the same width as 60px at 100% (within 0.5%), Ctrl+Z undid it in one step; a held block held at 200%
      (0px over 400px); the item ring on its item (Z1-b, item-ring-zoom.spec)
    - `[x]` (8) the Preview opened while zoomed: nothing in it zoomed; after closing it Ctrl 0 still worked (Z1-e)
    - `[x]` (9) 200% BROWSER zoom (760×450 CSS at 2×): the zoom controls inside the window, no sideways scroll, the Blocks
      panel opens 320×292 (screenshot browser200)
    - `[x]` ACCEPTANCE: tier-99 page 334 BUILT (443 blocks) and tier-95 page 12 BUILT (242 blocks), the harness zooming
      in to reach a thin column as a person would (`reach` in h.js, centring it both ways). Their errors are queued
      classes only: HOLE and broken words (L-4), canvas≠Preview at Wide (L-2). Regression: 2 · 87 · 142 · 153 · 227 ·
      278 · 337 · 385 · 109 all BUILT
- `[x]` **BATCH L-2 · Tier-99: the editor and the Preview disagree** — CLOSED 2026-10-01 (commit `2bcc73f`; every checklist line seen in a HEADED
  UAT, every ledger line fixed and re-checked; gate: typecheck 0 · eslint 0 errors (105 accepted warnings) · vitest 3,932 ·
  test:fast 757) (area: canvas = Preview · 4 changes)
  - e-4 · canvas≠Preview — 13 pages: headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other
    heights, 4 containers 122–198px shorter at Wide (idx 109, 141 carry most). **A clean repro, built through the UI
    (E-0, 2026-09-30):** `probe-e0b.js --w=1920` — the burger header's hugged menu is 419.3px on BOTH sides, yet the
    zoomed canvas measures the link words a few px wider and wraps "Contact" (menu 79 vs 63px tall); page 145 at Wide
  - e-8 · a component 20–24px taller in the Preview — 2 pages (idx 209 and one more)
  - e-10 · one block 28px taller in the Preview — 1 page (idx 272)
  - #144 · the canvas copy of fixed blocks — checked in WebKit and Firefox before it is removed
  - **UAT CHECKLIST (written 2026-10-01, BEFORE any code).** One HEADED pass, six windows, fresh production build, the
    state built THROUGH THE UI; every line in Light · Dark · Midnight · Purple Dream, canvas AND Preview, at Mobile 375 ·
    Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920, and on the canvas at Fit AND 100% zoom (the canvas zoom changes
    how text is measured):
    - `[x]` (1) e-4: the burger header (`probe-e0b.js`) — every block's place and size within 1px canvas = Preview at every
      rung and zoom; "Contact" on one line in both; the menu the same height in both. SEEN: 28 runs (4 themes × 375 · 768 ·
      1024 · 1280 · 1920 + 1920 at 50/100%), 0 blocks differ, menu one line on both; the zoomed line 230.5875px for 230.5875
      needed (L2-b, L2-c); screenshots read in Light, Dark, Midnight, Purple Dream
    - `[x]` (2) e-4: tier-99 pages 109 and 141 (most of the 37 findings) and 334 · 12 · 337 rebuilt — 0 R11 findings. SEEN on
      the FINAL build (CtkDsK, FRESH): 109 · 272 · 334 · 337 (tier 99) and 12 (tier 95) BUILT through the UI, 0 canvas≠Preview,
      every error a HOLE (F-1); 141 on xL7cJ1: HOLE only
    - `[x]` (3) e-8: page 209 (and the other page) — the component the same height canvas = Preview at every rung. SEEN: the
      FAQ built through the UI, 4 themes × 5 rungs, 0 blocks differ (L2-i); page 209 on the final build: 0 canvas≠Preview
    - `[x]` (4) e-10: page 272 — the block the same height canvas = Preview at every rung. SEEN: page 272 on build k63Oav (with
      L2-b/c): 0 canvas≠Preview, HOLE only — e-10 had the same cause as e-4
    - `[x]` (5) #144: a fixed block (header pinned to the screen) in Chromium, WebKit and Firefox — the canvas shows it
      once, where the Preview shows it, while scrolling; then the canvas copy removed or kept on that measurement. SEEN:
      `probe-144.js` in all three engines; `probe-144-ui.js` in Light · Midnight · Dark: no false warning, canvas and Preview
      both hold. The canvas's own simulation is KEPT (its frame is scaled, which captures a fixed block); the wrong
      container-type assumption is removed
    - `[x]` (6) regression: `probe-spacing.js` (S-1) and pages 2 · 87 · 153 · 227 · 278 build with no new R11. SEEN: S-1 125
      checks × 4 themes, 0 findings; the five pages BUILT, the only R11 page 2's (L2-j), gone on the final build; Z-1's own
      UAT 21/21 × 4 themes, narrow 12/12, browser200 4/4, extra 6/6 (L2-m)
  - LEDGER of L-2 (numbered as found):
    - `[x]` L2-a · HARNESS: `probe-e0b.js` printed "0 blocks differ" at 1280 50%/75% while "Contact" had wrapped — it
      compares canvas with Preview, and a wrap in BOTH reads as "no difference". It must also report a line that wraps
    - `[x]` L2-b · **ENGINE: a band of ONE column reached out by a gutter and took it back** (`calc(100% + gut)` /
      `calc(100% − gut)`), each step rounding to 1/64px, so a menu hugging its links came out one unit short — "Contact"
      wrapped on the PUBLISHED page at 1024 · 1280 · 1366 · 1440 · 1550 · 1650 · 1750 (7 of 20 widths). CODED: a gutter lies
      between columns, `bandGutter` is 0 for fewer than two (0 of 20 wrap). Guard `space-by-default.test.ts` "a band of
      ONE column" (mutant red) + `canvas-scale-parity.spec.ts`
    - `[x]` L2-c · **CANVAS: CSS `zoom` laid the page out in shrunken sub-pixels** (e-4's cause on the canvas: at 100% 0
      blocks differ, at Fit 9). CODED: the frame is scaled with `transform` inside a sizer (`page.tsx`), `zoomOf` reads
      `data-canvas-scale` (`lib/canvas-zoom.ts`); harness + 6 specs read it too. Guard `canvas-scale-parity.spec.ts`
      (red on the old build: "Contact" wrapped at Wide Fit/50/75 and Desktop 50/75)
    - `[x]` L2-d · **the header packs everything to the LEFT** (the user, 2026-10-01, from the Preview at 1920: "a whole
      lot of space on the right… it looks proper bad"). Every line is made "Start". DECIDED by the user the same hour
      ("Header spreads"): giving a block the meaning Page header / Page footer sets its line(s) to "Spread out" — logo at
      the left edge, buttons at the right (`docs/web-anatomy/regions-and-education.md:32`); a real, visible, undoable
      value; a line added to a header later spreads too; saved pages untouched. CODED: `makeRowBand` leaves `justify`
      unset (still Start), `normalizeRowBands` → `spreadBarLine`; "Position in row" gains "Spread". Guard
      `header-spreads.test.ts` (mutant red). HEADED (build 9Qm7Sv, six windows, burger header built through the UI): the
      items span 98–99% of the header line at 768 · 1024 · 1280 · 1920 (Fit and 50%), canvas = Preview, menu on one line
      in both; at 375 logo left, "☰ Menu" right, "Apply now" on the next line (the phone is too narrow for three)
    - `[x]` L2-e · HARNESS: my L2-d probe measured logo-to-button ACROSS two rows on a phone (read "69% empty"). FIXED:
      measured per visual row
    - `[x]` L2-f · **the menu's words sat ~12px above the logo's and the button's middles** (seen in the 1920 Preview
      screenshot). CODED: a header line set to Spread is also centred (`align: center`, once, changeable). Guard
      `header-spreads.test.ts` (mutant red)
    - `[x]` L2-g · **every button's words were underlined on the published page** ("Apply now"): `blockTypography`
      returned `textDecoration: undefined`, which erased the button's `none` when spread after it. CODED: it emits only
      the keys it has a value for. Guard `header-spreads.test.ts` (mutant red)
    - `[x]` L2-h · HARNESS: my per-row metric grouped by TOP; once L2-f centred the items, one line read as several rows.
      FIXED: rows are items that overlap vertically, measured on the logo's row
    - `[x]` L2-i · **e-8's cause: on the canvas a component's body text was an editable `<span>`** (Accordion answer and
      sub-answer, Alert message); the export writes `<p>`, which the reading-width cap reaches — at 768 the answer ran
      539px on one line on the canvas and wrapped at 512 in the Preview: the open item 96 vs 120px, the Accordion hugging
      572 vs 546px (page 209 at every rung ≥ 768; reproduced through the UI by `probe-l2-acc.js`). CODED: `EditableText`
      renders its editable element as the tag asked for, and the three body sites ask for `p`. Guard
      `canvas-scale-parity.spec.ts` "an FAQ's open answer" (RED on the old build: 96px drawn, 120px published, 768 and 1280)
    - `[x]` L2-j · regression page 2 (nodenza, about): canvas≠Preview at 1024 and 1280 in a grid of 4.4%-wide cells where
      words break mid-word ("welcomed", "teacher" — c-8): 461 vs 534px at 1024. Was 5–8 such findings before today
      (z1-accept-99, z1-reg-6), 2 now. TRACED (both sides compute the same `overflow-wrap`, width 61.4px and font): on
      the canvas the words sit in `EditableText`'s `inline-block` span, which is as wide as its longest WORD — "welcomed"
      overflowed instead of breaking: "Every | family is | welcomed | by our | teachers." 5 lines drawn, 7 published. A
      first guess (a shared `overflow-wrap` rule for the canvas) was MEASURED to change nothing and reverted. FIXED:
      `max-w-full` on the editable span, for every editable text. Guard `canvas-scale-parity.spec.ts` "a word longer than
      its column" (RED: 121px drawn, 170px published; green after)
    - `[x]` L2-k · **HARNESS: `check-fresh-build.js` called a STALE build FRESH** — it compared sources with `BUILD_ID`,
      written at the END of a build, so a file saved mid-build looked older: box-model.ts saved 09:14:03 into a build begun
      09:12:21 (BUILD_ID 09:15:12), and the #144 fix was missing from a build it passed. FIXED: compared with the build's
      START (its folder's `package.json`, created first). Proven on that same folder: FRESH before, STALE after
    - `[x]` #144 · **MEASURED in Chromium, Firefox and WebKit** (`probe-144.js`): a `container-type` box leaves a fixed bar
      on screen (0px after a 1200px scroll) in all three; a tilt and the glass capture it (−607 / −600px) in all three.
      `capturesFixed` counted container-type, so a block set to "Floats on screen" in a band holding a narrowing grid was
      warned "This will not stay on screen" AND the canvas let it scroll away (−247 → −527px) while the Preview held it
      at 0px — canvas ≠ Preview. FIXED: the two container-type lines removed (the canvas's own fixed simulation stays: its
      frame is scaled). HEADED through the UI (`probe-144-ui.js`, 200% so the canvas really scrolls): no warning, canvas
      holds (57 → 57px over 615px), Preview holds. Guards `pinning.test.ts`, `grid-own-box.test.ts` updated to the measurement
    - `[x]` L2-l · eslint: an unused variable in my own `probe-l2-acc.js`. Removed
    - `[x]` L2-m · HARNESS: `probe-z1-extra.js` failed "the drop line keeps its thickness" and "Shift 2 zooms to the
      selection" — the SAME on this morning's code with this morning's probe (worktree at `7e1a030`, port 3500), so not
      today's change. Three probe faults, traced one by one: its hand-made drag lost its dragover events (now `H.dropTile`,
      with an observer reading the line); it scrolled the heading into view BEFORE each zoom, so it aimed off screen
      (now after); its select click left a caret in the heading's words, so Shift 2 typed "@" — correct, keys typed into
      text never zoom (Z-1) — a person presses Escape first (#87), and so does the probe now. Shift 2 checked alone first:
      55% → 262%. Now 6 of 6: the line 3px at 50% and 200%, Shift 2 → 260%
  - FINAL HEADED UAT (build xL7cJ1, `.next-c`, FRESH by the corrected check): burger header 4 themes × 5 rungs + 1920 at
    50/100% and the FAQ 4 themes × 5 rungs — 48 runs, 0 blocks differ, menu one line, header items span 96.7–98.8% of
    the line; the 1920 menu line 230.5875px for 230.5875px needed (was one unit short); pages 2 · 141 · 209 built
    through the UI: 0 canvas≠Preview (HOLE and c-8's broken words only); #144 in Midnight; S-1 `probe-spacing.js` 125
    checks × 4 themes, 0 findings; Z-1 `probe-z1.js` 21/21 × 4 themes, `--case=narrow` 12/12, `--case=browser200` 4/4,
    `probe-z1-extra.js` 6/6
  - HEADED (build k63Oav, six windows): pages 109, 141, 272 and 337 (e-4's largest carriers and e-10) — 0 canvas≠Preview;
    their errors are HOLE only (F-1). Pages 141 and 337 (most of e-4's findings) — 0 canvas≠Preview; their errors are
    HOLE only (F-1). Burger header 4 themes × 5 rungs + 1920 at 50/100%: 28 runs, 0 blocks differ, menu one line on both
- `[x]` **BATCH F-1 · The page uses its space** — CLOSED 2026-10-02 (HEADED UAT `uat-f1-headed.js` 6/6 windows; gate: typecheck 0 · eslint 0 errors · vitest 3,974; F1-a…k all ticked) (area: filling the page · OPEN 2026-10-01, right after L-2, before L-3 —
  the user: "the whole page needs to be used, the whole width… the whole height where it makes sense… the component
  needs to be used width and height everywhere… there can't be spaces when it's not needed unless it's the space a
  user wanted"). Understood and confirmed back to the user. Changes:
  - (1) MEASURE FIRST: a page-audit check for unused space — items packed to one side leaving a large share of the line
    empty · a component smaller than its cell/column · a column shorter than its row · a band under the footer on a
    short page; run over every crawled tier at every rung, so every case is found, not only the ones seen
  - (2) c-7 / e-9 (moved here from L-4, decided B): a column nobody sized takes what is left of the line — the HOLE
  - SEEN in the L-2 pass (to be measured by (1), fixed here): **an FAQ's Accordion hugs its words** — at 1280 it takes
    ~545px of the line and leaves the right half empty, every theme (`probe-l2-acc.js`, screenshot w1280PurpleDream);
    on a phone the burger header's "Apply now" sits alone on a second line
  - (3)–(6) the fixes, by class, at the root, as the measurement sorts them (filled in when (1) has run)
  - space someone set on purpose (a size, gap or margin they chose) is respected, never "fixed"
  - **FOR NOW AND THE FUTURE (the user, 2026-10-01: "so we don't have to do this for everything we're building in the
    future"):** every fix lands in the shared engine (the resolvers both the canvas and the export call), and its guard
    ENUMERATES the palette and the component catalogue — like `corner-radius.test.ts` and `units-not-pixels.test.ts` — so
    a component, template or LLM-built page added later is covered the day it appears; the audit check runs on every
    swept page
  - (1) BUILT 2026-10-01: `page-audit.js` W19 (warn) — W19a a line packed to one side (only space a visitor SEES: a line
    that wrapped, or a painted block / component with bare room beside it), W19b a block narrower than its column, W19c a
    painted column shorter than its row, W19d the window empty under the last block; `chosenIds(site)` skips every block
    whose width (widthByHand), height, margin or line arrangement (justify, unset until aligned — L2-d) the person set.
    Guard `tests/e2e/page-audit-unused-space.spec.ts` (56, in test:fast), mutation-proven both ways (skip off → 24 red;
    report off → 24 red). `uat-pages.js --sizes=rungs` (5 rungs + both sides of each breakpoint) for the measuring pass;
    `w19-summary.js` sorts findings into classes; `w19-calibrate.js` tuned it on 71 saved exports.
    Measured cost: ~520s a page through the UI → every tier is ~14h in six windows. ORDER (RULE Z 80/20): tier 80 + 95
    first to find the classes, tier 99 as the sweep that proves the fixes.
  - CLASSES found so far (tier 80, first 6 pages; saved exports): (A) a component that hugs its words in its line — the
    FAQ Accordion (`createComponent` stores `width: "auto"` → `flex: 0 0 auto; align-self: flex-start`; the old "every
    component hugs" rule in `lib/educo-ui/registry.ts` `defaultComponentWidth` is what F-1 reverses — which kinds keep
    hugging by design, Button/Badge/Icon/Rating, to be listed from the measurement) · (B) two unsized columns that WRAP
    because their 14rem floors do not fit (768: 2 × (224+14) > 461) each stay at their share alone on a line, grow 0 —
    `aloneOnItsLine` packs at the DESKTOP widths, so a wrap caused at a narrower rung is never seen; c-7 B; must keep
    rule 1 (space opened at an outer edge stays where the shares hold) · (C) header links wrapping on a phone
  - FIX for (B), designed 2026-10-01 (to code when the run ends — no source edit during a run): in `childStyle`
    (`lib/box-model.ts` ~5337) an unsized column grows when alone on its line (as today) OR when NOBODY sized any column of
    its band — the same "any hand-sized column" test line 5353 uses. A band nobody sized holds no chosen space, so grow
    only spends what a wrap, a floor or a deleted column left; a band with a hand-sized column keeps today's rule, so
    rule 1 is untouched; the canvas writes `widthByHand` on the first frame of a drag (BoxCanvas 2522/2538), so a drag
    behaves as today. REJECTED: a container query per band (every band a size container — the unregistered `--box-u`
    re-measures every band's spacing, E0-e; and rule 1 still broken below its threshold). Checklist adds: a drag started
    in a band drawn wider than stored opens no gap beside another column (rule 3), canvas = Preview
  - MEASURED (tier 80, 64 pages, build FD2OyO, every rung + both sides of each breakpoint): 13 classes, all three of
    (A) a component hugging its words (Accordion, 5 pages) · (B) columns left at their share after a wrap (img 30 pages,
    p 23, img+img 16 — Tablet, Laptop, 600/900 breakpoints) · (C) links wrapping on a phone (29 pages). W19b/c/d: none.
  - FIXES (each guard red without its fix, green with it):
    - (A) `defaultComponentWidth`: a new component fills its line unless `HUGS_BY_NATURE` (Stat, Badge, Rating) — the
      old "every component hugs" rule REVERSED (the user's F-1 words); `component-fills-its-line.test.ts` enumerates the
      catalogue; the two tests that pinned the old rule updated
    - (B) c-7 B: in `childStyle` an unsized column grows when NOBODY sized any column of its band (a width set at the
      rung counts — the #78 tablet test caught my first version); saved pages included, since only unchosen space
      moves (the user may reverse this); 5 arrangements × sized/unsized in the guard
    - (C) the user chose: links on a PHONE 1rem apart (`LINK_GAP_ACROSS_PHONE`), 2rem from 600 up; a chosen gap kept;
      the Inspector's fallback reads the same constants (it said 2rem on a phone)
  - LEDGER of F-1:
    - `[x]` F1-a · tier-80 page 1 BUILD FAILED (click timeout) in parallel — NOT A BUG, measured: built ALONE (284
      blocks, 561s) on the same build; it was load
    - `[x]` F1-b · **sticky header + sticky sidebar** (4 tier-80 pages, canvas AND Preview): the sidebar stuck at top 0
      UNDER the header (z 30/30) and its heading painted over the logo; the header had no colour of its own so the page's
      words showed through it ("Nillside Schp"); a click aimed at a block landed on the bar → page 13 "could not select".
      FIXED: `pinStackPass` queues a bar behind every earlier bar whose holder CONTAINS it (holder found by id — a
      landmark can sit between), `pinStackNeeded` ships the script for that pair; `pagePinCover` (applied LAST in both
      engines): a bar pinned to the page is z 31 and takes `--eu-color-bg` when it has no colour. Guard
      `pins-stack.spec.ts` F1-b × painted/unpainted header (each half mutation-proven). Waiting: page 13 through the UI
    - `[x]` F1-c · **Delete did nothing after any toolbar button was clicked** — clicking a block left the focus on the
      device preset, and Z1-j gives a focused control its keys. FIXED in `onSelectDown`: a block picked with the pointer
      blurs a control outside the canvas. Guard `select-takes-keys.spec.ts` (3 presets) red on the old build
    - `[x]` F1-d · **links dropped side by side on the page each took the page gutter as padding** (106px boxes round 61px
      links; 3+1 on a phone). FIXED: `sectionContent` — a menu line's links are not sections; `pageBandInset` gives the
      line the gutter and section space once. Guard in `link-spacing.test.ts` (mutation-proven)
    - `[x]` F1-f · HARNESS: probe-f1 measured the newest LEAF (the "New" inside a Badge) and held a dragged Accordion to
      the "hugs" bar — now the page band's column, and "keeps its dragged width". 40/40 and 10/10 per theme
    - `[x]` F1-g · HARNESS: `H.select` clicked its fallback point when nothing of the target was visible — under a sticky
      header that now covers what scrolls beneath it, it selected the logo (page 13). It scrolls the target to the centre
    - `[x]` F1-h · HARNESS: the audit grouped a row into LINES by each block's top (±2px) — a centred header's logo and menu
      read as three lines: false HOLEs on every page with a header since L-2. A line = blocks that OVERLAP down the page
      (3 places in `page-audit.js`). Guard in `page-audit-unused-space.spec.ts`, mutation-proven (12 red on the old)
    - `[x]` F1-i · NOT A BUG, measured: page 38 "the drop added nothing" under 5 windows; ALONE it built (212 blocks)
    - `[x]` F1-j · **hand-sized columns whose shares fill the line WRAPPED at a laptop/tablet** (a longest word floored the
      narrow one: 16.74/26.38/56.86 on page 1, 24.67/75.32 on 32, 92.43/7.56 on 38) and left a hole nobody made. DECIDED
      by the user 2026-10-01: **"fill after a wrap"** — rule 2 now reads "the size you drag is the size you get, while
      the line holds it" (memory `feedback_layout_rules_agreed.md`). FIXED: `bandHoldsChosenSpace` — only a stored line
      whose shares are short of 100% (an outer edge dragged in) holds chosen space; elsewhere every column may take what
      its line leaves. Guard: 5 arrangements × hand-filling / outer-edge-in (mutation-proven, 4 red); the 1D and rule-2
      unit tests updated to the decision
    - `[x]` F1-e · **a Stat, Badge or Rating dropped on the page was forced full width** (`normalizeRowBands` made every
      container 100%; the column floor gave them 14rem, and on a phone 100%: a pill across the line, stars spread). FIXED:
      both skip `HUGS_BY_NATURE`; guard enumerates the catalogue through the drop pass at every rung (mutation-proven)
    - `[x]` F1-k · **tier-80 page 38 at Tablet: canvas = Preview confirmed by headed probe 2026-10-02.** Root cause:
      k-1m (FAQ section container) has `hasVisibleEdge=true` (background colour) → `paddingLeft/Right = u(24) ≈ 21.216px`
      from `SPACE_DEFAULT.inner=24` → k-1m.contentWidth = 457.6px → band i-1p = 471.7px → both columns fill to 458px.
      The F1-b…j fixes already handled the export path; no additional code change needed. HEADED probe: canvas w472
      pad21.216/21.216 gut14.144 · kids w458 flex(1 1 calc(92.44% - 14.144px)) = Preview (byte-for-byte). Free = 6.9px
      ≤ 40 → no HOLE. R11 delta = 0. FIXED by the batch (no additional commit line — same uncommitted working tree).
  - checklist (written 2026-10-01, BEFORE the pass; each at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide
    1920 + the device presets, canvas AND Preview, all four themes, HEADED, built through the UI, six windows):
    - `[x]` (1) the audit check W19 exists and is honest: on a page built to waste space (an Accordion alone in a band, a
      line of two hand-less columns at 30% + 30%, a short page) it reports each class; on the same page with the space
      CHOSEN (a width dragged by hand, a height set, a margin set) it reports nothing — red-then-green spec
    - `[x]` (1) W19 run over tier 80 · 95 · 99 through the UI, every rung; the findings sorted into classes, the classes
      written into (3)–(6) with their page counts
    - `[x]` (2) the HOLE: a column nobody sized takes what is left of the line — 0 HOLE on the canvas and 0 W19 line
      findings on the pages that had them, at every rung; a column sized by hand keeps its size
    - `[x]` the FAQ Accordion fills its column at every rung, every theme (was ~545px of 1280); every catalogue
      component × design dropped in a column fills it across unless it is a hugging kind by design (Button, Badge,
      Icon) — the guard ENUMERATES the catalogue
    - `[x]` a phone burger header: logo, burger and "Apply now" on one line at 375 (or the decided arrangement), no lone
      item on a second line
    - `[x]` a short page: no empty band under the footer at any rung (or the footer meets the window's bottom)
    - `[x]` space set on purpose survives everything above: a dragged width, a set height, a set gap/margin — unchanged
      after the fixes, after reload, canvas = Preview
    - `[x]` regression: probe-spacing (S-1), probe-s2 (S-2), L-2's probes — 0 findings; a page saved before F-1 keeps
      every size it CHOSE (hand widths, set gaps); space nobody chose fills there too (decided in the session, reversible)
- `[x]` **BATCH L-3 · Tier-99: React error #185 and the tablet line** — CLOSED 2026-10-03 (session 6eaa0c27: L3-p/b/o one bug — a drag's height measure broke the columns' flex shorthand; c-11b drawn-line cap; c-11a comment, the user's decision; L3-t/u/w harness; commit 6d67d52; every checklist line ticked) (area: engine rules · 5 changes, opened 2026-10-02; PAUSED the same day by the user's order, RESUMED 2026-10-02 ~20:00 when R-1 closed; L3-h · L3-g · #185 (change 1) · c-12b CLOSED 2026-10-03; session 07c6c075 CLOSED L3-f (harness) · L3-c · change 4 c-11c · change 5 R-23 (HEADED 6/6) · L3-j/k/l/m/q/r/s — next leaf L3-p (the live-canvas cell that a reload fixes; with L3-b and L3-o, one bug most likely), then L3-t, c-11b, c-11a, the checklist's regression line, and the batch close. Was — next leaf L3-h: c-11a / c-11b / c-11c and L3-b · L3-c (page 141 re-run) · L3-f · L3-g · L3-h are open)
  - e-5 · React #185 (maximum update depth) — 9 pages
  - e-6 · four columns on one line at Tablet — 8 pages, 142 findings (= c-11)
  - c-11c (decided B) · an icon cell does not count for the tablet rule
  - changes: (1) e-5/c-12 · #185 found through the UI and fixed at its root · (2) c-11a · `packRowLines` treats a line
    that rounds to 100.4% as one line, as its own comment says · (3) c-11b · find out what stores rows over 100% and stop
    it · (4) c-11c · decided B in `tabletPlaces` AND the audit's L6 check, in the same change · (5) R-23 · the Divider
    publishes `<hr>` (canvas + export), from R-1 — its headed check is in this batch's pass: canvas == Preview, one line,
    no UA margin / inset border, line style / thickness / colour in all 4 themes, a separator in the accessibility tree
  - `[x]` c-12b · BUILT 2026-10-03 as decided (see #185 PART 2 in the ledger: 65–95 → 8–9.5 ms a key). Was — the user decides: typing currently re-renders and saves the whole site on every key. Measure the time
    per key at 150 and 520 blocks FIRST. Batching the keys would change what one Undo takes back while typing. Not built
    until the user answers
    - **DECIDED by the user 2026-10-02: "go with your recommendation"** — measure first; if typing lags, a burst of
      typing is ONE Undo step (it ends at a pause, as in Word / Google Docs) and the site is saved once typing stops,
      not on every key. Text is never lost: a pending save is written on blur, page hide and before unload
  - LEDGER of L-3:
    - `[x]` L3-a · **#185 NOT REPRODUCED — measured.** 12 headed page runs on 2026-10-02, the 6 pages that once had it:
      6 plain (`l3-185-repro.out`) and 6 STRESSED (`l3-185-stress2.out`: 12 text blocks × 3 rounds × 3 × 150 characters
      at 0 delay, Tablet ↔ Desktop switched between each, the machine at ~91% CPU) — 0 page errors in all 12, on an
      unmangled production build. ~76 dressed pages since 2026-09-30 also 0. So something between 09-30 and now (L-1 / L-2
      / F-1) removed it, or it needs a load not reached. The sweep's page-error check stays its guard: it REOPENS the
      moment one is seen, now with its stack and step (L3-d). c-12b (typing lag) is separate and still to be measured
    - `[x]` L3-h · **CLOSED 2026-10-02 — NOT A LAYOUT BUG; the AUDIT was wrong (R-24).** HEADED UAT `l3h-stress.out` (six
      pages at once, fresh build, --stress, 43 min): 0 page errors again; the 250px HOLE on 141 / 329 / 332 / 333 is the
      HEADER row — site name (heading), a small 86px button, a button — at canvas Mobile. The stress typed 450 characters
      into both words, so each is 330px (the whole line) and `flex: 0 0 auto` (it hugs its words and never shrinks): the
      330px button cannot fit in 250px, so the line is right. The audit assumed the waiting block could shrink to 14rem.
      FIX `page-audit.js`: a block with `flex-shrink: 0` needs its drawn width (as a min-content block already did).
      PROVEN with `probe-l3-row.js --audit` (new) on the saved sites: RED on 4 / 4 before, GREEN on 4 / 4 after, the same
      pages before the typing clean at 375 and 768; and the other way (`logs/r24-both.js`): the same button made
      shrinkable → the HOLE is reported again. The Tablet HOLE on 332 (`i-3g`, 241px, 3 cards) does NOT come back from
      the reloaded tree (its columns reload as `flex: 1 1` and fill the line) → it is L3-b's question, moved there.
      Was: **after the stress typing, canvas Mobile shows a HOLE of 250px at the end of a line of a "…-6" block on 4
      of 6 pages (141, 329, 332, 333)** — the same id slot and width on four different pages, so one shape: most likely
      the header line once 450 characters are typed into its words. Plus R11 canvas ≠ Preview after the typing on 333
      (Mobile 18 blocks, Laptop 3, Desktop / Wide 16). The run had the old audit loaded — next: one stressed page with
      the new HOLE details (each column's drawn width, flex, min-width), then the tree read at that block
    - `[x]` L3-i · MY OWN: the F-1 close-out wrote the marker as `← **YOU ARE HERE**`, which the rules guard does not count
      (it needs the arrow followed by the plain words, no bold), and it was committed in `9c85ed6` / `3e044bb` without running that guard. FIXED: the
      marker; the guard now passes. The full gate runs before every commit from here (rule 15)
    - (was) L3-a · **#185 did not come back** — the 6 pages that had it (dressed99 141, 329, 332, 333, 34, 43), re-run in 6
      headed windows on an unmangled production build (`.next-b`, 3200): 0 page errors. Last seen in the 2026-09-30 sweep;
      ~76 dressed pages since, 0. Being stress-tested (`uat-pages.js --stress`: 3 × 150 characters typed with no delay
      into 12 text blocks, 3 rounds, Tablet ↔ Desktop switched between each) before anything is closed
    - `[x]` **#185 PART 2 + c-12b BUILT AND PROVEN, 2026-10-03.** The observer fix alone did NOT end it: on the fixed build #185
      came from the typing path (`onInput → onText → commit`). A stand-in devtools hook showed the last 60 commits before
      it were each a FULL builder re-render (page, canvas, 112 block views, Inspector…) — every key committed the whole
      site and wrote all of it to storage. MEASURED (c-12b's "measure first", `scripts/uat/probe-c12b.js`, six headed
      windows, pages built through the UI): 65 / 84 / 95 ms a key at 135 / 294 / 355 blocks; 185 / 279 / 353 ms with the
      CPU slowed 3×, and #185 in all three slowed windows after 150 characters. BUILT as decided: `EditableText` keeps the
      words while typing and sends them once typing pauses (400 ms) or the words could be lost (blur / Escape / Enter,
      page hidden or closed with `flushSync`, unmount). AFTER: **8.1 / 9.0 / 9.5 ms a key; 25.6 / 22.0 / 28.3 ms slowed 3×;
      0 errors.** Guards: `tests/e2e/typing-is-one-step.spec.ts` (≤ 2 saves for 40 keys — RED 41 · one Undo takes the burst —
      RED one letter · a reload mid-burst keeps the words), `EditableText.test.tsx` (pause / blur, fake timers),
      `inline-editing.test.tsx` updated (the edit arrives on blur); scenario in `box-builder-layout.feature`. HEADED UAT
      (`logs/c12b-stress-*.out`): the full stress — 450 characters into each of 12 blocks, Tablet ↔ Desktop between them,
      then Mobile / Tablet / Laptop / a reload — in six windows with the CPU slowed 3×, which crashed EVERY window before:
      **6 / 6 clean, 0 page errors**, and page 332's card row identical to the untouched control (three 380px columns,
      grow on) → **L3-b CLOSED: its live HOLE was #185's half-finished update, not a grow rule**
    - `[x]` **#185 PART 1 — the frame observer, 2026-10-02 ~23:00.** CPU slowed 3× (`probe-l3b.js --cpu=3`) reproduces it in every
      stressed window on the unmangled build: **13 of 13 thrown from ONE place**, the canvas frame's ResizeObserver
      (`app/website/box-demo/page.tsx`). Instrumented: the same 6,216px reported 30 times running, zoom 0.83 and room 740px
      unchanged — not growth, not a bounce. Its effect depended on `site`, which changes on EVERY key, so every key made a
      new observer and each one reported (and set state) once; fast typing on a slow CPU stacked them past React's 50.
      FIX: re-made only when the frame appears (`frameReady`, `preview`), and a report that changes < 0.5px sets nothing.
      GUARD `tests/e2e/frame-observer-stays.spec.ts` RED on the old code (observers grew with typing), GREEN on the fix;
      scenario in `box-builder-layout.feature`. HEADED proof: the same six throttled windows on the fixed build
      (`logs/l3-185-fixed-*.out`) — RUNNING
    - `[x]` **#185 REPRODUCED THROUGH THE UI, 2026-10-02 ~21:30** (`scripts/uat/probe-l3b.js`, `logs/l3b-probe.out`): page
      332's tree from BEFORE the words, then the stress typing through the UI, six headed windows: **4 / 4 full-stress
      variants hit React #185** (stress → Tablet · → Mobile → Tablet · → reload → Mobile → Tablet · → Laptop → Tablet);
      the control and ONE round of typing did not. After it, the card row is drawn for the wrong screen (gap term 14.144
      → 18.24 / 11.2 / 16.192px, cards 210–253px instead of 380) — so L3-b's live hole is most likely #185's half-finished
      update, not a grow rule. Next: the same run on an UNMANGLED build (`next build --no-mangling` → `.next-b`, 3200) for
      the stack, then the root fix (change 1, e-5/c-12a), then L3-b re-measured
    - `[x]` L3-b · CLOSED 2026-10-03 with #185 (above): after the fix the live row equals the reloaded one in 6 / 6 stressed windows. Was: **page 332 (noma careers) at canvas Tablet: a 241px HOLE, and canvas ≠ Preview at Tablet and Laptop on
      29 blocks** (a row of card · words · card at 33.33% each: 224px on the canvas, the line filled in the Preview).
      Reloading the tree saved BEFORE the words were typed gives canvas = Preview at 768 and 1024 — so it is in the tree
      after the words, or in the live canvas. The harness now saves that tree too (`page-N.final.site.json`).
      MEASURED 2026-10-02: the FINAL tree reloaded is also canvas = Preview at 768 and 1024, opened at Tablet or after
      Mobile (`probe-l3-row.js --tree=final.site --before=375`) — every column 458px at 768. In both runs the LIVE canvas
      drew the column at its 224px floor (R11 29.2% of 768) with 241px free. So it is live state, not the tree. The HOLE
      message now carries each column's drawn width, `flex` and `min-width`; the next run says which input was stale
    - `[x]` L3-e · HARNESS: `uat-pages.js --stress` did nothing — the parent hands its pages only `--sizes=`, so the first
      stress run (`l3-185-stress.out`) ran no stress phase (`stressed` empty on all 6). FIXED: `--stress` is forwarded;
      re-run as `l3-185-stress2.out`
    - `[x]` L3-c re-run · HEADED (`logs/l3f-stress.out`, 6 windows, --stress, .next-c FRESH, 19 min): 0 page errors on all
      6 pages (#185 stays fixed); page 141 has no W7a left → L3-c CLOSED
    - `[x]` L3-b CLOSED AGAIN 2026-10-03 with L3-p (332: no Tablet HOLE, no R11 in `l3p-fixed` / `c11b-fixed`). REOPENED 2026-10-03: the same run shows page 332's 241px HOLE at canvas Tablet with 0 page errors — the
      close rested on `probe-l3b.js`, not on the page run. Diagnostic re-run `logs/l3f-diag.out`
    - `[x]` L3-f · CLOSED 2026-10-03 — HARNESS, measured (`logs/l3f-diag.out`, R11 now prints left): on the LIVE canvas the
      rotating hero's slides sat at left -200% vs 0% in the Preview — the typing into slide 3 left the canvas ON slide 3
      (right for an editor), the Preview opens on slide 1 (right for a visitor). Which slide shows is view state, not
      layout: `uat-pages.js` now puts every canvas pager back to slide 1 before measuring (and logs it). Re-run to confirm
      with the next page run
    - `[x]` L3-p · CLOSED 2026-10-03 on the headed re-runs (`l3p-fixed.out`, `c11b-fixed.out`: 223 0 errors). **ROOT FOUND AND FIXED 2026-10-03 (with L3-b and L3-o — one bug).** Reproduced THROUGH THE UI with NO
      stress: `probe-l3p-build.js` (new) builds a dressed page with the Dresser, then diffs every block's computed flex
      live vs reloaded — 21 / 34 / 28 / 26 blocks differ on 223 / 333 / 359 / 382 (`logs/l3p-build.out`), every column of
      a dragged row at grow 0 live, 1 reloaded; the R11 detail (`uat-pages.js` now prints the canvas's flex / min-width /
      inline style) showed `flex-shrink: ; flex-basis: ;` in their style. CAUSE: `naturalHeightOf` (every resize start,
      on the block ABOVE the edge) turns its children's grow off and "restores" `flex-grow` read with
      `getPropertyValue` — but a column's `flex` is a shorthand holding `var(--bx-gut)` (`gutterCSS`), which is not
      split into longhands, so it read "" and REMOVED it, breaking the shorthand; React never rewrites an unchanged
      prop, so it stayed until a reload. (`probe-l3p.js`, a row on its own, and `probe-l3b.js` from a reloaded tree
      never reached it: no block under the row / no live drags.) FIX: put back the whole `style` attribute (and the grid
      drag's `put`/`restore` the same — ledger 3). GUARD `tests/e2e/drag-keeps-flex.spec.ts` (6 cases): RED 3/3 "block
      under the row" on the old build (all three columns broken), GREEN 6/6 on the fix (.next-b, 3200, FRESH); scenario
      outline in `box-builder-layout.feature`; in package.json + test-fast.js. HEADED re-run of the six pages:
      `logs/l3p-fixed.out`. Was: page 223 (live canvas): the wrapped 4th cell drawn at its 224px floor (29.2% at 768) vs filling its
      line in the Preview (54.1%) at Tablet → Wide. The final tree RELOADED gives canvas == Preview (416px both at 768) —
      live state, like L3-b and probably L3-o (359). Not a cache (the canvas recomputes `childStyle` each render) and not
      a stray inline style (the row drag writes none). `probe-c11b.js --live` did not reproduce it on a fresh full-width
      row — its first "DIFFERENT" was my measurement (screen px, the canvas zoom changed on reload: every ratio 1.75)
    - `[x]` L3-t · CLOSED 2026-10-03 — HARNESS, measured: the headed windows ran at Windows' display scaling, so a 390px window measured 390.40 and the Preview's page 375.2 against the canvas's exact 375; 0.2px wrapped a 1,408-character quote two lines fewer (57px; source found by `probe-l3t.js`, traced by `logs/l3t-chain.js` / `l3t-anc.js` to `html` itself). FIX `h.js`: `--force-device-scale-factor=1` + `deviceScaleFactor: 1`. PROVEN: 333 at 375, 22 blocks differ → 0; `html` 390.40 → 390.00. Was: page 333 after the stress: canvas ≠ Preview in HEIGHT (≈35–110px) at Mobile · Laptop · Desktop · Wide
      (2026-10-03: 333 had 34 blocks drawn un-grown live by L3-p — re-measured on the fixed build before anything else)
    - `[x]` L3-u · HARNESS (proven: 141 0 errors, its reset logged, `c11b-fixed.out`) (found 2026-10-03, `l3p-pages.out`): page 141 at Mobile — the pager's slides at -16.9% vs 0%
      AFTER L3-f's reset. A pager is `scroll-behavior: smooth`, so `scrollLeft = 0` ANIMATES and 300 ms later it was 83%
      home. FIXED: `scrollTo({ left: 0, behavior: 'instant' })` in `uat-pages.js`; proven by page 141 in the next run
    - `[x]` L3-v · MY OWN, the same hazard as L3-p one edit away: the grid drag's preview `put`/`restore` remembered
      each property with `getPropertyValue` — FIXED with L3-p (the whole `style` attribute); grid specs run in the gate
    - `[x]` L3-x · GUARD BUG (found closing L-3): `task-tree-batches.test.ts` read the indented lines of ANY top-level
      item after a batch (AREA V) as that batch's, so closing L-3 failed on AREA V's open work. FIXED: another top-level
      item ends the batch; new case "an AREA's open lines under a closed batch are not the batch's"; MUTATION-PROVEN (the
      fix removed → the real tree and the new case red; restored → 8/8)
    - `[x]` L3-y · MY OWN: a stray `git stash push`/`pop` in that mutation check popped an OLD stash (`feature/teacher`)
      onto `app/website/box-demo/page.tsx` as a conflict. Undone: the file restored from HEAD (it held no uncommitted work);
      the stash entry is still in the list, untouched (5 entries). No stash commands in checks from here
    - `[x]` L3-w · AUDIT (found 2026-10-03 on the fixed build): the canvas HOLE check ignored the GUTTER — since S1-a it is
      half a gutter of margin on each column, while the check added the band's `column-gap` (0px). Page 359 at 1024: a
      224px column "could come up" into 234px, needing 240. FIXED in `page-audit.js` (the waiting column's margins + the
      last column's right margin). PROVEN both ways (`logs/l3p-audit-both.js`, 359's saved site): old audit HOLE → new
      none; the same row made into a REAL hole (middle 100px, waiting column 400px basis) → reported by both (305px)
    - FIXED-BUILD HEADED RE-RUN (`logs/l3p-fixed.out`, 6 windows, stressed, .next-b FRESH): 223 4 → 0 errors · 141 1 → 0
      (L3-u) · 332 R11 + Tablet HOLE → gone · 359 R11 (40 blocks) → gone · 333 4 R11 → 1 (Mobile heights, L3-t) · 382 1 →
      1. The HOLEs left: 359 Laptop (L3-w, false) · 332 Wide (a row stored 145%, the recorded GAP "30 · 10 · 25 wraps
      at Desktop" — no HOLE on the new audit) · 359 Tablet and 382 Wide = c-11b (rows stored 100.15 / 100.01: the last
      icon cell drops to a line of its own)
    - `[x]` c-11b · **FOUND, FIXED, GUARDED 2026-10-03 — HEADED `logs/c11b-fixed.out`: 0 rows stored 100–101% on 6 pages, 359 and 382 0 errors.** DEBUG=1 live builds
      (`logs/c11b-debug.out`, 4 windows): every over-100 row is the dresser's gesture — widen the first two until the 4th
      wraps, then NARROW the third so the 4th comes back (359: 100.15 · 382: 100.01). The drag gives the dragged column and
      its followers `room = maxW − startLeftPx`, from where it is DRAWN, while the columns before it keep their STORED
      shares; and the line before it already stored 100.01 (42.71 + 41.62 + 15.68), DRAWN as one line (#131's one-pixel
      slack) while `packRowLines` called its third column wrapped — so a cap from the stored packing found nothing before it
      (my first fix: measured, did nothing, 100.15 again). FIX (`BoxCanvas` flow drag): the room is capped at 100 − the
      stored shares of the blocks before it on its DRAWN line. PINNED (RULE Y, after the UI repro):
      `probe-c11b-pin.js` + `tests/e2e/row-never-stores-over-100.spec.ts` on 359's own saved site (fixture
      `c11b-page359.site.json`, the row put back as before the third drag): RED 100.15 / 100.15 / 100.16 on the old build,
      GREEN 4/4 (99.99) on the fix; a drag too short to make room still leaves the 4th below (122.21, by design). Scenario
      in `box-builder-layout.feature`. The UI-built version of the spec could not fail on either build (its icon cells
      kept a 113px floor, the 4th never came back) — a guard that cannot fail, replaced (ledger 5, RULE V)
    - `[x]` (closed with L3-f above — the pager reset in the harness; its instant form L3-u) L3-f MEASURED 2026-10-03: the reloaded final tree has NOTHING scrolled on either side (no scrollLeft / scrollTop
      > 0) and the flagged blocks are the rotating hero's slides at the same places — so either the LIVE canvas was
      scrolled after the typing, or it is the audit. R11 compares LEFT too and never printed it: the harness now prints
      `left c vs p` and logs every box scrolled sideways on the live canvas (`uat-pages.js`); re-run `logs/l3f-diag.out`.
      Was: page 141 after the stress typing: canvas ≠ Preview at all 5 rungs on 12 blocks whose SIZES match
      (100%×3708 vs 100%×3708…). INFERRED: typing into the rotating hero's hidden slides scrolls the pager on the canvas,
      while the Preview opens on slide 1 — so the comparison reads positions inside a scrolled pager. To be MEASURED
      (the blocks' left positions, the pager's scrollLeft on both sides) before calling it harness or product
    - `[x]` L3-g · CLOSED 2026-10-02 with L3-h / R-24: ids are new on every run; `gx-6` is the same HEADER row (the same "-6" slot, the same 250px) — the re-run with the new audit showed only that row at 141 Mobile, and R-24 explained it. Was: page 141 at canvas Mobile: HOLE 250px at the end of a line of gx-6 — a second LIVE-canvas hole, like
      L3-b. The run had the old audit loaded, so no column details; the next run of it carries them
    - `[x]` (closed by "L3-c re-run" above: page 141 has no W7a left) L3-c · page 141: 71 × W7a "headings closer than 1rem to the page edge" at -295px / -670px — "Welcome to our
      school 2 / 3", the rotating hero's slides that are off screen. HARNESS: W7a measured a run's rect, not what a reader
      sees of it; a waiting slide that starts inside the window (-153px) is cut by the pager's own box. FIXED in
      `page-audit.js`: the run is clipped by every box that cuts its overflow, and skipped when nothing is left. Guard
      `page-audit-whitespace.spec.ts` "a pager's slides…" at 375/768/1280/1920 — red on the old audit (3 runs flagged),
      red with the skip disabled, 55/55 audit specs green. Waiting: page 141 re-run through the UI on the fixed audit
    - `[x]` L3-j · CLOSED 2026-10-03 on the user's "stop it": chain + measurer stopped, nothing research left running,
      free memory 0.5 → 3.9 GB (aw-coll-menu resumes when the Navigation component's research starts). Was: research still RUNNING after R-1 closed — `educo-research/r1-aw.sh 1 2`
      (PID 40232) moved on to `aw-measure.js aw-coll-menu` at 04:21, beside L-3's testing (RULE RS forbids it). The
      session was NOT permitted to stop it → the user's call: stop it (it resumes) before the six-window runs
    - `[x]` L3-k · MY OWN: ran one vitest file (4 s) while `c11-measure` (Playwright) ran — rule 15. Its timings are checked
      for contention before anything is trusted from it; no vitest again until a browser run ends
    - `[x]` c-11a · CLOSED 2026-10-03 — comment corrected (`box-model.ts`, packRowLines header), no behaviour change, box-model 221/221. **DECIDED by the user 2026-10-03: "Fix the comment only"** (asked with this session's measurement: #131's
      one-pixel slack draws a line stored at 100.01 as ONE line while `packRowLines` calls it two; 100.4 the browser wraps,
      as `packRowLines` says; c-11b stops drags writing such rows). To do: the stale sentence at `box-model.ts` 4379
      ("a hair over 100 is still one line — … round to 100.4 …") corrected; no behaviour change. Was — **THE USER DECIDES:** the handed-over step said "a line that rounds to 100.4% must be one line, as its own
      comment says"; the measurement says a browser WRAPS it (#69), so making the model call it one line would make the
      model disagree with every page it draws. Recommended: fix the stale COMMENT only (no behaviour change) and stop rows
      being stored over 100% (c-11b). MEASURED FIRST, 2026-10-03: the premise contradicts #69 (`box-model.test.ts` "a line breaks exactly where
      a BROWSER breaks it" — 50.3 + 50.1 is two lines) and the gutter arithmetic (each slot = its stored share of the widened
      band, so 100.19% overflows → 3 + 1, which `packRowLines` already says). The top comment ("a hair over 100 is still one
      line") is the stale part. Being measured on pages 223 / 359 / 382 rebuilt through the UI (`logs/c11-measure.out`)
    - `[x]` (superseded: c-11b CLOSED 2026-10-03 — the writer was the narrow-the-third drag, see the c-11b line above) c-11b · `probe-c11b.js` (new): a row of words + 3 icon cells built through the UI, dragged by the harness's own
      `sizeColumns` to 6 share sets → all store ≤ 100% (99.91–99.98). A plain drag is not the writer; next: the rebuilt trees
    - `[x]` c-11c · BUILT (decided B) + HEADED in `uat-l3-headed.js` 6/6 (the 8 e-6 pages: checklist line (4), with the batch close): `holdsWords` in `tabletPlaces` + the audit's L6 check (a cell of icons only does not
      count; ≥ 2 cells with words or a card). Guard in `box-model.test.ts` RED before, GREEN after (221/221).
      Scenario Outline in `box-builder-layout.feature`. Typecheck 0. HEADED check → `uat-l3-headed.js` (the ticks row)
    - `[x]` L3-l · the Divider's THICKNESS reached the page as px (2–20px) on the canvas AND the export — rule 16; the units
      guard only ever saw the default. FIXED: `dividerThickness()` in `box-model.ts`, called by both — PLAIN rem (`remLen`),
      1px stays a hairline. My first fix used the fluid `u()`: the headed pass measured 12px drawn as 8px on a phone and
      16.8px on Wide → plain rem. Guard `units-not-pixels.test.ts` RED (19 values) → GREEN, + "12 → 0.75rem"
    - `[x]` L3-q · MY OWN (the headed script): the Thickness slider is on the Content tab (the script never chose it), and a
      row dropped "under" a cell lands INSIDE that cell — both fixed; a failed window now saves a screenshot
    - `[x]` L3-r · a Divider with a thickness set was PADDED 27.36px each side (`hasVisibleEdge` read its `borderWidth` as a
      box border), so its line started 28px in from the words — seen only in the SCREENSHOT, every number passed. FIXED
      in `hasVisibleEdge`. Guard `space-by-default.test.ts` RED (24 each side) → GREEN; the headed check "line level with
      the heading" RED on the old build (10 findings in each of 6 windows, 17–34px) → GREEN
    - `[x]` L3-s · exposed by L3-r: a 1–2px Divider is a 3–6px box — "cannot drop under" in 2 of 6 windows (a fresh Divider
      was always so). FIXED: a Divider breathes ABOVE and BELOW only (half a stack gap, 0.5rem; sides 0 — new blocks only,
      saved pages keep theirs, the user can set 0). Guard in `space-by-default.test.ts`
    - `[x]` **R-23 / change 5 HEADED UAT — CLOSED 2026-10-03** (`uat-l3-headed.js`, 6 windows, .next-c on 3400, FRESH):
      Light 1 · Purple Dream 2 · Dark 4 · Midnight 8 · Light 12 · Dark 20px — 6/6 CLEAN at 375 · 768 · 1024 · 1280 · 1920,
      canvas AND Preview: `<hr>` with role separator (accessibility tree on both), margin 0, side borders none, the
      thickness asked, the theme's colour, canvas == Preview, the line level with the words, 0 page errors; the ticks row
      one line at Tablet (c-11c) and four cells of words 2 + 2 (#78). Screenshots read (`logs/uat-l3/`)
    - `[x]` L3-n · HARNESS (FIXED + re-run `l3n-223.out`: the rows are now dragged; they still wrap at Desktop by #102, recorded as a GAP): `c11-measure` (pages 223/359/382, 0 errors on 223) did NOT size page 223's four ticks rows — "on
      one line at no screen size". MEASURED (`probe-l3-row.js --band=murv1fmb-2k`): at Desktop 24.99·24.99·25·25.02 wraps
      3 + 1 on canvas AND Preview, because the words cell's longest word is 157px against a 137px share (#102, by design);
      at Wide the row was 70.93·10.01·5.69·13.36 — the dresser had sized it at WIDE, which branches off (rule 18), so the
      desktop never got the widths. FIX `build-page.js sizeColumns`: widen to Desktop only; a still-wrapped row is dragged
      anyway (as a person would), a gap only if it wraps after. So c-11b/c-11a's "0 over 100%" on 223 proved nothing yet —
      re-run `logs/l3n-223.out` on the fresh `.next-b` build
    - `[x]` L3-o · CLOSED 2026-10-03: its R11 was L3-p, its Tablet HOLE c-11b, its Laptop HOLE the audit (L3-w) — 359 0 errors in `c11b-fixed.out`. Was: page 359 (`c11-measure`): HOLE 96px at canvas Tablet (row 0-59, a 54.44% column 243px) and R11 canvas ≠
      Preview at Tablet / Laptop on 40 blocks (heights 5478 vs 5251). Re-run with 223; then measured like L3-b
    - `[x]` L3-d · HARNESS (c-12c): a page error kept only its first line, with no step — `h.js` now keeps the stack and
      `page.__step`, `uat-pages.js` writes them as `pageErrors` and names its phases (pictures, words, canvas audit per
      preset, Preview)
  - checklist (written 2026-10-02, BEFORE the pass; HEADED, six windows, built through the UI, canvas AND Preview,
    all four themes, Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920 + the device presets):
    - `[x]` (1) c-12a: #185 reproduced through the UI (a long page, 3 × 150 characters typed, repeated), with the full
      stack and the step it happened on kept. The guard spec is RED first (a `pageerror` matching #185 fails it) — SEEN:
      `probe-l3b.js` 4/4 stressed variants hit #185; `frame-observer-stays.spec.ts` + `typing-is-one-step.spec.ts` red→green
    - `[x]` (1) c-12c: the harness keeps a page error's whole stack and the step it happened on (`h.js`, `uat-pages.js`) — L3-d
    - `[x]` (1) after the fix: 0 #185 on all 9 e-5 pages (+ idx 34, 43, tier-95 page 0, tier-80 page 26), run in
      parallel; typing still works, Undo still works and the text survives a reload — SEEN: `l3f-stress.out`,
      `c12b-stress-*.out` (6/6, CPU ×3), and 2026-10-03 `l3p-pages` / `l3p-fixed` / `c11b-fixed` (18 stressed page runs, 0 page errors)
    - `[x]` (2) SUPERSEDED by the user's c-11a decision 2026-10-03 ("fix the comment only" — no packing change, so no packing guard); the second half — each column's flex the same on canvas and Preview at 768 — SEEN: `drag-keeps-flex.spec.ts` + `l3p-fixed` / `c11b-fixed` (0 R11 width findings). Was: guard `packRowLines([70.04, 9.99, 10.14, 10.02])` is red before the fix and green after;
      at 768, each column's computed `flex` and `margin-right` read the same on the canvas and in the Preview
    - `[x]` (3) the rows that store more than 100% are counted in fresh trees; what writes them is found through the UI
      (a drag or the dresser) and fixed, with a guard — SEEN 2026-10-03: the dresser's narrow-the-third drag (DEBUG=1),
      fixed (drawn-line cap), `row-never-stores-over-100.spec.ts` red→green; `c11b-fixed.out`: 0 rows stored 100–101% on 6 pages
    - `[x]` (4) a line of three icon cells + one cell of words at Tablet stays on one line; two cells of words + two
      icon cells are rearranged. The engine and the audit agree on every one of the 8 e-6 pages (0 L6 findings left
      that the engine does not act on) — SEEN: `uat-l3-headed.js` 6/6 (c-11c)
    - `[x]` regression — HEADED 2026-10-03, six windows, fresh `.next-c` (lNMRuyfu): probe-spacing Light 125/125 · Dark 125/125, probe-s2 Midnight 132/132 · Purple Dream 132/132, probe-l2-acc 0 blocks differ at 768, probe-saved-page CLEAN; F-1's guards in the green gate (test:fast 803); screenshots read (`probe-s2-out/Midnight/preview-1024.png`, `probe-l2-acc-out/w768-canvas.png`). Was: F-1's guards, probe-spacing, probe-s2 and L-2's probes show 0 findings; a page saved before L-3
      keeps its widths
- `[>]` **AREA V · THE PAGE COMES ALIVE — blending, effects, motion, colour, for EVERY block** (the user, 2026-10-03, after
  L-3 is nearly done: "how a layout blending into each other… transition… animation… scrolling… moving between sections…
  each section being a straight line horizontal, we can have it in any shape… background colour, gradient, switches,
  effect, transition, animation… the user being able to select anything… a user can create their own colour… not only for
  the layout… components… elements like text field"). STEP 1 (now): INVESTIGATE what we have — research AND code — and
  report back what I understand; nothing built until the user confirms. Folds in: S-2 (section transitions, queued), the
  motion Batches A / B, R-2 (the CSS property side: backgrounds, gradients, colour). Applies to sections, components and
  elements alike (RULE A capability parity)
  - `[x]` STEP 1 investigation 2026-10-03: two read-only readers (research + code), reported to the user
  - `[ ]` **RULE UI (the user, 2026-10-03 — now in CLAUDE.md):** everything built is in the builder, easy to select AND
    make your own. Part of AREA V: (a) every V family ships with its control, presets + "make your own"; (b) an AUDIT of
    what is ALREADY built for capabilities with no control or a control the export ignores — known so far: per-device
    backgrounds (banner says "size & layout only", V-5) · Advanced CSS offered only on components · the legacy
    `gradient:` only from the bulk inspector · motion tokens internal only · image / overlay controls on a Button the
    export drops (V-1)
  - `[?]` the user's three answers: understanding right? · the order? · named effects only, or free sliders too?
    (RULE UI answers the third in part: ready-made AND make-your-own)
  - LEDGER of V (found by the code reader, NOT yet verified — each measured before it is called a bug):
    - `[ ]` V-1 · a Button's export reads only `background` — a gradient / image set on it (`bgImage`) is dropped (`box-export.ts:144`), while the Inspector offers it
    - `[ ]` V-2 · components drop `bgOverlay` (`componentBoxCss` has none)
    - `[ ]` V-3 · a legacy `gradient:#a:#b` value is written raw by `componentBoxCss` — invalid CSS on a component
    - `[ ]` V-4 · "Tint over background" uses a 6-digit-hex-only field — no alpha, so the tint is opaque; its `mode="both"` is ignored
    - `[ ]` V-5 · the per-device banner says "size & layout only change here", but `patchAt` stores EVERY non-content key per device (backgrounds too)
    - `[ ]` V-6 · `REVEAL_DUR` falls back to .55s (`interactions.ts:212`) against the 320ms "slow" token
    - FOUND 2026-10-03 by the R-2 inventory (read in the code — each is REPRODUCED through the UI first, then fixed with
      a guard red first, in AREA V's first batch, colour & backgrounds; RULE V):
    - `[ ]` V-7 · the GradientEditor writes `radial-gradient(circle at 50% 50% …)` / `conic … at 50% 50%` whatever it was
      given (`GradientEditor.tsx:80-81`) — editing a radial preset silently drops its shape and position
    - `[ ]` V-8 · a gradient STOP edited in the GradientEditor goes through the hex-only colour field — its alpha is lost
    - `[ ]` V-9 · a gradient BASE fill is dropped whenever a photo / `bgImage` is set (`box-model.ts:1028`)
    - `[ ]` V-10 · a band's SHADOW is clipped away by its own edge shape (the edge's `clip-path`)
    - `[ ]` V-11 · the shadow scale is emitted as LITERAL values (`box-model.ts:1131`, `box-export.ts:86`) while the
      `--eu-shadow-*` tokens are emitted unused (`tokens.ts:163`) — a theme can never restyle shadows (Core Rule 17)
    - `[ ]` V-13 · (found by the R-2 states proof) VERIFY the builder keeps two rules: (a) a block's OWN hover / focus / press beats a
      state driven from its parent (parent-driven rules at zero specificity, `:where`), and (b) no base look is INLINE where a
      state may change it (an inline background beats every `:hover` rule) — the canvas draws with inline styles, so the
      existing interactions (`lib/interactions.ts`) are checked first; any that lose are bugs, fixed with a guard red first
    - `[ ]` V-12 · the contrast hint shows only on component colour tokens (`BoxInspector.tsx:1786-1792`), never on a
      block's own text / background colour — RULE 4 / 17 ("contrast is ASSERTED") on the commonest case
  - `[ ]` **From R-2 (signed 2026-10-03):** RULE MAP 6 — the USER can make every combination at every level in the builder (live
    previews + "make your own" for every axis, re-proven THROUGH THE UI and in Preview), first batch colour & backgrounds incl.
    V-7 … V-13 · 5c PEOPLE — the pilot schools try it once the first batch ships (RULE RK). WAITS for Task 1 (the user, 2026-10-03)
- `[ ]` **BATCH U-1 · Surface what is ALREADY built (RULE UI, the user 2026-10-03: "this rule must also follow existing
  stuff that we've done… something a user has to create")** (QUEUED; area: builder controls). Step 1: an AUDIT —
  every field the engine reads (`BoxNode` in `lib/box-model.ts`, presets, components, interactions) set against the
  Inspector / palette control that reaches it, for every block kind: no control · a control hidden or misleading · a
  control the export ignores · presets only with no "make your own". Step 2: the user sees the list and orders it; then
  batches of ≤ 6 by area, each HEADED-tested through the UI. Known so far: V-1 · V-5 · Advanced CSS on components only ·
  legacy `gradient:` only from the bulk inspector · motion tokens internal only
- `[x]` **BATCH R-2 · Everything an element can be styled and do — the full property set** — CLOSED 2026-10-03 by the user signing the "enough" checklist (session 35640e85; commits `43fb21c` · `e885c84` · `4e307dc`) (QUEUED 2026-10-03, the user:
  "typography, types, utilities, background colour… transition… all of the exhaustive stuff an HTML element on a page
  might need"). Motion / events / elements are covered and signed (R-1, `html-semantics.md`, `dom-element-api.md`); the
  CSS PROPERTY side has no signed "enough" checklist: the CSS coverage map (memory `project_css_coverage`, MDN's 68
  modules) is from 2026-09-02, lists several Missing, and was never re-checked against today's builder. RULE RS: the
  user's sources + my own, every property family checked against what the builder emits, then an "enough" checklist
  signed by the user. Starts AFTER L-3 closes (one job at a time)
  - `[x]` **THE USER'S LINKS — all read or decided (2026-10-03)** — the user, 2026-10-03: "I'm going to give you my own list of websites to look
    at… this afternoon". Their list + my own sources (MDN backgrounds / gradients / blend modes / filters / shadows,
    colour-picker patterns) run side by side (RULE RS), every link read completely (RULE R), in parallel windows —
    never beside an L-3 test run. Scope: gradients · overlays · shadows (incl. gradient / glow) · box effects · colour
    picker and the user's own colours · section shapes and blending
    - THE USER'S LINKS (completeness list, RULE R — each read completely before it is marked done):
      - `[x]` https://webgradients.com/ — **2026-10-03: 661 pages read (every gradient page), 0 errors** — (2026-10-03) — every gradient on it, each opened and its CSS read (stops, angles,
        type), how each is made, which the builder can already draw (GradientEditor: linear / radial / conic, stops,
        angle) and which it cannot; plus the site's own UI for picking and copying a gradient (a reference for RULE UI)
      - `[x]` https://uigradients.com/ — **2026-10-03: all 377 gradients (one page holds the whole collection)** — (2026-10-03) — every gradient in its collection (all of them, not a first page),
        each one's colours and direction, how its picker / browse / copy UI works, compared with webgradients
      - `[x]` https://grabient.com/ — **2026-10-03: SATURATED — 927 pages, 13 gradient techniques, last new at page 533, then 393 in a row with none (a generator: its palettes never end)** — (2026-10-03) — its gradient generator: every control it offers (how a user makes
        their own), every preset, the CSS it emits
      - `[x]` https://cssgradient.io/ — **2026-10-03: 23 pages (generator + every on-topic guide), queue empty** — (2026-10-03) — the generator (types, stops, angle, positions, colour input) AND
        every page it links to on the topic (its gradient guides / swatches / tools), each read completely
      - `[x]` https://webflow.com/made-in-webflow/overlay — **27 measured live with the SURFACE recorded (R2-26)** — (2026-10-03) — EVERY project in the listing (all pages / all
        "load more"), each opened and run live (hover, scroll, click), its overlay technique read and written down item
        by item: what sits on top (colour / gradient / image / blur / blend), when it appears, how it animates
      - `[x]` https://www.convertflow.com/campaigns/popup-overlay-examples — **2026-10-03: 18 pages, queue empty; the modal pattern proven in r2-states (click · dim + blur backdrop · focus in · Escape · focus back)** — (2026-10-03) — every popup / overlay example on
        the page and every example page it links to: its trigger (on load, on scroll, exit intent, a click), how it
        enters and leaves, the backdrop (dim, blur, colour), how it is closed (button, Escape, outside click), focus and
        accessibility, and how it behaves on a phone. NOTE: a popup is a COMPONENT (a modal / dialog) — it feeds the
        component rebuild and needs the user's approval before it is built (rule 13)
      - `[x]` https://mobbin.com/explore/web/ui-elements/full-screen-overlay — **SKIPPED by the user 2026-10-03 · NEEDS AN ACCOUNT: the first page shows ~40 screens, then "Log in or join for free to continue browsing" — the user decides (never a workaround)** — (2026-10-03) — every full-screen overlay
        screen in the collection (all of it, scrolled to the end): what it covers, what it holds (menu, search, video,
        form), how it opens / closes, its backdrop. CHECK FIRST: Mobbin usually needs a signed-in account to show more
        than a preview — if it does, the user is asked for access (never a workaround) and the line stays open
      - `[x]` https://webflow.com/made-in-webflow/shadow — **2026-10-03: all 7 measured live, surface recorded (R2-26 re-measure)** — (2026-10-03) — EVERY project in the listing (all pages / all
        "load more"), each opened and run live, its shadows read from the code item by item: box / drop / text / inset,
        layered, coloured or gradient (glow), soft vs hard, how a shadow changes on hover or scroll — compared with the
        builder's elevation scale and `library/10-surface.md` (HAVE / PARTIAL / GAP)
      - `[x]` https://codepen.io/Syed-Faraz-Ahmad/pen/PoXbeqq — **2026-10-03: run and read in full (pens-r2-single)** — (2026-10-03) — run live, its HTML / CSS / JS read in FULL
        (never cut), how the effect is made written down step by step, what a builder control for it would need
      - `[x]` https://codepen.io/tag/shadow — **2026-10-03: SATURATED at page 63 — 326 pens with full code, 150 in a row added nothing** — (2026-10-03) — NOT collected before (checked: no shadow tag in
        `docs/web-anatomy/codepen/`; only getcssscan's 95 box-shadows in `research-runs/`). EVERY listing page to the end
        with `cp-tag.js` (it resumes, R-21 fixed), every pen opened and its code read in full, how-it-is-done per pen via
        `cp-how.js`, saturation measured; in parallel collectors, never beside a UAT
      - `[x]` https://codepen.io/tag/overlay — **2026-10-03: SATURATED at page 84 — 501 pens** — (2026-10-03) — NOT collected before (checked: nothing named overlay in
        `docs/web-anatomy/codepen/`). Same method as the shadow tag: every page, every pen run and read in full, how each
        overlay is made (colour / gradient / image / blur / blend, on hover, on scroll, full screen)
      - `[x]` https://dribbble.com/tags/colorpicker — **ENOUGH, the user 2026-10-03 · 2026-10-03: the listing + 98 shots read and every screenshot OPENED (picker
        controls per shot + patterns: `area-v/picker-shots.json`); 18 "shots" were captcha pages saved before R2-24 (R2-36) —
        removed and re-crawled, 17 recovered; 1 + 21 queued shots NOT read: Dribbble shows Human Verification again (stepped
        down) — retried later, never worked around** — (2026-10-03) — EVERY shot in the tag (scrolled to the end), each opened
        (its full images, and video where it has one): the colour picker's layout and controls — spectrum / wheel /
        sliders, hex / RGB / HSL / OKLCH entry, transparency, eyedropper, saved and brand swatches, gradient stops,
        contrast hints — written down per shot, then the patterns that repeat. Designs, not code: it decides what the
        builder's picker should LOOK and FEEL like (RULE UI), compared with today's `EducoColorField`
      - `[x]` https://dribbble.com/search/color-picker — **ENOUGH, the user 2026-10-03 · BLOCKED: Dribbble answers "Human Verification" from page 13 — stepped down (RULE RS, R2-24); 21 search pages read, no shot reached; the tag above covers the same designs** — (2026-10-03) — every result to the end, the same per-shot notes;
        shots already read from the tag above are recognised and not read twice (only new ones added)
      - `[x]` https://codepen.io/tag/colorpicker — **2026-10-03: read to the end — 182 pens** — (2026-10-03) — every page, every pen run and its code read in full: how a
        working picker is BUILT (canvas / gradients for the spectrum, pointer + keyboard on the thumb, colour maths
        HSV ↔ RGB ↔ OKLCH, alpha, the native EyeDropper API, accessibility of sliders) — the code side of Dribbble's designs
      - `[x]` https://www.magnific.com/free-photos-vectors/website-divider-shapes — **2026-10-03: 548 pages (listing + items, depth-limited, R2-19); shape families tallied — scallop · drip · mountain · brush added to the map** — (2026-10-03) — every divider shape in the
        listing (all pages): the shape family (wave, curve, tilt, zigzag, layered, torn, blob), single vs stacked layers,
        how it would be drawn (SVG path / clip-path / mask), which the builder's 4 `BandEdge` shapes already cover. Check
        the licence before anything is reused: the shapes are STUDIED, our own are drawn (RULE R, never copied)
      - `[x]` https://codepen.io/tag/divider — **2026-10-03: read to the end — 86 pens (+ dividers 11)** — (2026-10-03) — PARTLY collected in R-1 (step 4: 75 pens, stopped at the
        user's "enough"; `cp-tag.js` RESUMES): finish every page, read every new pen in full, then `cp-how.js`
      - `[x]` https://codepen.io/tag/frosted-glass — **2026-10-03: read to the end — 36 pens** — (2026-10-03) — every page, every pen run and read in full: how the glass is
        made (`backdrop-filter: blur()` + saturation, a translucent fill, a light border / highlight, noise), its fallback
        where `backdrop-filter` is missing, its contrast over a busy photo, and its cost on a low-cost Android (RULE AF)
      - `[x]` https://webflow.com/made-in-webflow/glassmorphism — **47 measured live with the SURFACE recorded (R2-26)** — (2026-10-03) — EVERY project in the listing, each opened and
        run live: where the glass sits (header, cards, modal, hero panel), what is behind it, blur strength, border /
        highlight, how it moves on scroll or hover — the real-site side of the frosted-glass pens
      - `[x]` https://www.awwwards.com/websites/texture/ — **SATURATED on SURFACE after 220 sites (50 in a row, 37 known; 581 not needed)** — (2026-10-03) — EVERY site in the category (all pages), each live
        site visited and measured with `aw-measure.js` (it resumes): what the texture is (grain / noise, paper, fabric,
        pattern, an image), how it is made (SVG `feTurbulence`, a tiled image, CSS gradients, canvas), where it sits
        (whole page, a band, behind text), whether it moves, and its weight on a 360px phone on 3G (RULE AF)
      - `[x]` https://codepen.io/tag/texture — **2026-10-03: SATURATED at page 54 — 319 pens** — (2026-10-03) — every page, every pen run and its code read in full: how each
        texture is BUILT (SVG `feTurbulence` grain, CSS gradient patterns, a tiled image, canvas noise), how it is layered
        over colour or a photo (opacity, blend mode), its weight — the code side of the Awwwards texture sites
      - `[x]` https://codepen.io/tag/curves — **2026-10-03: read to the end — 77 pens** — (2026-10-03, link 21, sent during L3-p) — every listing page to the end, every
        pen opened, run live and its code read in FULL: how each curve is BUILT (SVG path / `clip-path` / `border-radius`
        ellipses / masks / canvas), whether it is a section edge, a divider, a background shape or a moving line, how it
        responds to width, and its weight — feeds AREA V's "section shapes & blending" batch beside the divider and wave
        tags (R-1). In parallel collectors, never beside a UAT
    - **THE METHOD, INSIDE EVERY LINK (the user, 2026-10-03, during wave 1: "click inside each link… we want to study
      everything that each of this item has in each of this link").** A listing is only the way in:
      - CodePen tags → every pen on every page OPENED and RUN (scrolled, hovered, screenshotted), its FULL html / css / js
        saved and read, how it is made written per pen (`cp-tag.js` + `cp-how.js`)
      - galleries (Webflow showcases, Awwwards) → every item listed (`src-list.js`), then EACH item opened, its "Visit"
        followed to the LIVE site, and that site met as a visitor does — loaded, scrolled, hovered, clicked, desktop and
        phone — the overlay / shadow / glass / texture read from its own code (`aw-measure.js`)
      - tool / collection sites (webgradients, uiGradients, Grabient, cssgradient.io, ConvertFlow, Dribbble, Magnific,
        Mobbin) → every ITEM opened (each gradient, example, shot, shape) AND every on-topic link inside the site followed
        and read; each site gets a completeness list here (what it holds · what is read) and is never marked read on its
        front page or thumbnails
    - **DECIDED by the user 2026-10-03: research "until saturated"** — and the test of enough, in their words: "until we
      understand what that thing is… the gist of virtually any variations that we want and we can do it — then we stop".
      Written into RULE R (CLAUDE.md, guarded). Small sources complete; CodePen tags `--saturate=150`, Awwwards texture
      `--saturate=50`; the stopping points recorded here with their numbers. Running from 10:39: `r2-saturate.sh` +
      `r2-sites.sh` (6 windows, 6.1 GB free at start)
    - **THE ORDER TO "ENOUGH" (RULE MAP, agreed with the user 2026-10-03):** `[x]` 1 the axis map (`area-v/AXIS-MAP.md`) ·
      `[x]` 2 a specimen per value · `[x]` 3a combinations per family proven · `[x]` 3b ACROSS families on one block — 40 stacks, 213 ablations, 0 invalid, 10 clashes all explained (V-10 9/9,
      fixed by a wrapper drop-shadow, proven; a white pattern × multiply is a no-op) — `r2-stack.js`, `specimens/stack.html` · `[x]` 3c EVERY LEVEL, NESTED (section → card → button → text): 40 trees, 161 ablations, 0 invalid, cascade-down 0
      failures, 0 clashes, 2 named no-ops — `r2-nest.js`, `specimens/nest.html` · `[x]` 3d STATES / EFFECTS / TRANSITIONS at
      every level, both ways, WCAG first: 30 trees, 133 checks, 0 failed (real mouse + keyboard; focus ring; reduce motion) —
      `r2-states.js`; two builder rules found (own state beats a driven one; no inline base where a state changes it) · `[x]` 4 the crawl's GAP CHECK (`43fb21c`) —
      r2-gap.js 71 techniques over 6,736 items + r2-census.js (every property / function / SVG element in 4,131 pens): ~50
      values added AS CODE, 0 gaps left (cross-fade: 0 uses); every proof re-run headed and identical twice: 8 families painted,
      0 invalid, honest distinct counts with every repeat explained · stack 241 ablations, 9 clashes = V-10 · nest 164, 0
      clashes · states 197 checks, 0 failed · `[x]` 5 the AXIS-MAP "Not yet" values — added with step 4 (4/8-digit hex,
      currentColor, transparent, to-corner, image-set, background-clip, hover / scroll overlays, dark shadow scale, glass
      fallback, moving grain, path() / shape(), scroll-linked edge); the picker CONTROLS are a UI → AREA V's build, designs read
      (75 pickers, `picker-shots.json`) · `[x]` 6 the real-world pass — 17 effects × 3 runs on a 360 × 640 DPR-2 phone, CPU ×6, Slow 3G,
      software drawing, off-screen headed window (`specimens/realworld.json`, AXIS-MAP step 6): blur is the one real cost (glass on
      every card 4px 108 · 12px 93 · 24px 76 fps; one glass header 126), a FIXED full-page grain 87 fps, moving grain / SVG
      displacement ~3 ms raster per frame; gradients, overlays, shadows, shaped edges free; every page 5–11 KB, first paint ≤ 620 ms;
      CONTROL 16 fps / 36 long frames · `[x]` 7 (SIGNED by the user 2026-10-03) the
      "enough" checklist to the user — then AREA V builds it so a USER can do every combination (RULE MAP 6)
    - **THE "ENOUGH" CHECKLIST (RULE MAP, step 7) — `[x]` SIGNED BY THE USER 2026-10-03 ("checklist is fine by me. You can go ahead")** (written 2026-10-03, session 35640e85).
      Each line covered / not covered, with its evidence; the build of AREA V starts only after the user signs.
      - `[x]` 1 MAP — 7 families broken into axes and values, each with how it is made: colour 6 axes · 33 values · gradients 9 · 31
        · backgrounds 8 · 25 · overlays 5 · 20 · shadows 9 · 29 · glass / filters / blend 10 · 49 · textures 11 · 37 · section
        shapes 11 · 51 — `AXIS-MAP.md`, `scripts/uat/r2-axes.js`
      - `[x]` 2 AN EXAMPLE PER VALUE — 275 specimens, all painted, 0 invalid — `specimens/<family>.html`
      - `[x]` 3a COMBINATIONS PER FAMILY — 60 random each, all valid; honest distinct counts with every repeat explained (named
        no-op or dependent axis) — `proof.json`
      - `[x]` 3b ACROSS FAMILIES — 40 stacked blocks, 241 ablations, 0 invalid, 9 clashes = all V-10 (a builder bug for AREA V)
      - `[x]` 3c EVERY LEVEL, NESTED, BOTH WAYS — 40 trees, 164 ablations, cascade down 0 failures, 0 clashes up
      - `[x]` 3d STATES / EFFECTS / TRANSITIONS, WCAG FIRST — 197 checks, 0 failed (hover, press, pointer-following, scroll-linked,
        modal backdrop, focus ring ≥ 3px, reduced motion)
      - `[x]` 4 SATURATION, MEASURED — every CodePen tag saturated (150 in a row) or read to the end; Grabient 927 (last new at 533);
        Awwwards texture 220 on SURFACE (50 in a row, 37 known); gap scan 6,736 items + census of 4,131 pens → 0 gaps
      - `[x]` 5a TASTE — 33 hand-picked best-in-class examples across the 7 families, 85 screenshots opened (`area-v/taste-set.md`);
        two spot-checked by me (Kiawah scrim, HAUS grain — matched to the stored CSS); 8 learnings for the builder
      - `[x]` 5b REAL WORLD — 17 effects on a 360px DPR-2 phone, CPU ×6, Slow 3G (`realworld.json`): blur is the one real cost
        (default ≤ 12px, warn above, few elements); fixed full-page grain costs ~40% of frames; moving grain / displacement opt-in;
        the rest free; pages 5–11 KB, first paint ≤ 620 ms
      - `[x]` 5c PEOPLE — MOVED to AREA V (build work) — the pilot schools (RULE RK): not possible before something is built; comes with AREA V's first batch
      - `[x]` 6 THE USER CAN DO IT — MOVED to AREA V (build work) — the BUILD itself (RULE MAP 6, RULE UI): AREA V's batches, first colour & backgrounds incl.
        V-7 … V-13, each axis as live previews + "make your own", re-proven through the UI and in Preview
      - Open by the user's decision: Mobbin (skipped), Dribbble search + 22 tag shots (enough). Builder bugs found, fixed in AREA V:
        V-1 … V-13 (V-10 confirmed again on the new edge methods)
    - LEDGER of R-2:
      - `[x]` R2-1 · `aw-measure.js` followed Made in Webflow's "Clone" button (`dashboard/sites/new…unauthSignup`, a
        sign-up page) — 12 of 12 overlay items recorded `noLiveSite`, unmeasured. FIXED: the item's own `*.webflow.io`
        site (a link or its description); the Awwwards-only `/sites/` fallback kept to Awwwards. SEEN: items 1–10 now
        measured on their live sites (476 KB, 3,858 KB…); the 12 bad records removed so they are re-measured
      - `[x]` R2-2 · `site-read.js` (new) read 1 page of uiGradients / Grabient / cssgradient.io / webgradients: Git Bash
        rewrote `\.` in the include pattern into `/.`, so no inner link matched. FIXED: `MSYS_NO_PATHCONV=1` in the
        runner. SEEN: webgradients now opens every gradient's own page (`/gradient/033-…`, 41 read in the first minutes)
      - `[x]` R2-4…R2-13 · MY OWN, the RULE MAP proof (`scripts/uat/r2-axes.js` + `r2-combos.js`), each found by READING the
        sheets and fixed: R2-4 shape bands drew nothing (no width in a centring stage) · R2-5 "painted" = differs from an
        empty stage passed blank sheets → ≥ 2 colours inside the stage · R2-6 `url("…")` inside a `style="…"` attribute
        ended the attribute (every mask, the glass grain) → single quotes · R2-7 shadow on the stage fell outside the
        picture → on a card · R2-8 one-in-97 pixel sampling missed thin letters / 1px lines → every pixel · R2-9 gradient
        text on a positioned child → on the words · R2-10 wave layers inside the band were invisible → behind it, peeking
        out · R2-11 the mask edge was mirrored vs clip-path / SVG → 1 − f · R2-12 "repeating" did not repeat → stops in a 20%
        period (hard edges kept hard) · R2-13 "distinct" by hash → ≥ 0.6% of pixels moved > 8/255; and whole-number keys
        reordered by JavaScript made the colour base 25% → labels with units, an explicit visible base per family.
        Every check MUTATION-PROVEN (blank bands → 0/28 painted; invisible layers → same look)
      - `[x]` R2-15 · the per-family proof checked only each stage's OWN style, never the elements inside it (glass card,
        shape bands, gradient words) → every element, a `-webkit-` fallback beside its standard form accepted
      - `[x]` R2-16 · the stack's band filled 70% of the WIDTH (in a row flexbox `flex: 0 0 70%` is a width) → fills it
      - `[x]` R2-17 · shots taken before a data-URI texture / photo decoded differed from finished ones → retaken until two
        consecutive shots match
      - `[x]` R2-18 · ablations compared tiles at DIFFERENT sheet positions — sub-pixel anti-aliasing read as a change, so 8
        of the 9 V-10 clashes were missed (one measured 0.00% alone) → rendered in ONE stage: 9 / 9 found
      - `[x]` R2-19 · `site-read.js` followed Magnific's "related vectors" for ever (747 pages, off the topic) → `--depth` and
        `--listing` (a listing's own pages stay at depth 0, its items depth 1); the drifted read kept aside in educo-research
      - `[x]` R2-20 · `cp-tag.js` read the `--saturate=150` flag as a TAG too (an empty listing each run — harmless, confusing)
        → flags filtered out; and collector A's restart died on a profile still locked by the window stopped earlier, with
        no notice — re-run, reading `shadow` from pen 166 (a restart is checked for its first pens, not assumed)
      - `[x]` R2-21 · the states proof read the button's "rest" with the mouse still on it (which hovers the card too) → every
        DOWN check failed falsely → rest is read with the mouse away
      - `[x]` R2-22 · the states demo wrote base looks INLINE, so the card's tint and the button's gradient-swap hovers could never
        show → base looks in the stylesheet (and the lesson is V-13 for the builder)
      - `[x]` R2-14 · `site-read.js` died on one write Windows had locked (`UNKNOWN: open`) after 661 pages of webgradients →
        temp file + rename, retried; a failed save no longer ends the crawl
      - `[x]` R2-3 · MY OWN: wave 1 recorded bash PIDs that cannot stop Windows processes (collector D "killed" was still
        running). Every crawler is now stopped by its unique profile path, verified (RULE K)
      - `[x]` R2-23 · NOT A BUG (measured): webgradients and Grabient logs end in `UNKNOWN: open` crashes — both from 11:22 /
        12:12, BEFORE the R2-14 fix; the current `save()` retries and goes on (Magnific then saved 548 pages, 0 crashes), and
        both sites were resumed to completion (webgradients 661, Grabient 927)
      - `[x]` R2-24 · `site-read.js` kept crawling Dribbble search through "Human Verification" pages and SAVED them as data
        (21 of 42). FIXED: a challenge title stops the crawl (RULE RS: step down) and is never recorded; the 21 pages removed.
        Mutation-proven on a local challenge page: with the check 0 pages saved + "stepping down"; without it 2 recorded
      - `[x]` R2-25 · Dribbble tag stopped at 84 of ~800 queued with no DONE line and no note (the restarts at 10:29/10:39) —
        an unfinished crawl that looked finished; and it had no depth limit, so related shots drifted off the tag. FIXED:
        resumed with `--depth=1 --listing=tags/colorpicker` (depth written onto the 84 read pages) → DONE, 100 pages, 0 left
      - `[x]` R2-26 · `aw-measure.js` recorded MOTION only (sticky / fixed / timeline / clip / snap) — 78 Awwwards TEXTURE sites
        and all 81 Webflow overlay / shadow / glassmorphism sites held nothing about texture, overlay, glass or shadow. FIXED:
        `how.css.surface` (gradient / filter url / backdrop / blend / image-background / layered shadow rules),
        `surfaceDom` (SVG filter primitives in the page, canvases, the big backgrounds with size / repeat / blend / opacity),
        cssF `noiseSvg · gradient · filterUrl · blendMode` (which also feed saturation). Old records kept aside in
        educo-research/runs/*.motion-only.json; all four re-measured
      - `[x]` R2-27 · MY OWN, the proof: `diffRatio` called two pictures of DIFFERENT SIZES 100% different — 1fr columns beside
        a scrollbar (296 / 297px), rows at fractional y (160 / 161px) and a stage's own border (177px) — so same-look values
        read as distinct and every earlier "distinct" count could be inflated. FIXED: fixed 18rem columns, fixed caption height,
        `box-sizing: border-box` on the stage, and a size mismatch now THROWS (it stopped all six windows once — the proof it
        was real) instead of counting as "different". Every proof re-run
      - `[x]` R2-28 · MY OWN, the proof: sheets loaded on `about:blank`, an INSECURE context — Chrome 145 hides `paint()` and
        `CSS.paintWorklet` there (measured: about:blank supports=false, localhost supports=true), so a value every https
        page has read as invalid. FIXED: sheets served at http://localhost through Playwright's router (no server). Also a
        builder fact: `paint()` and the EyeDropper work only on a page served over HTTPS
      - `[x]` R2-29 · MY OWN, found by reading the look-alike groups (every repeat must be explained): (a) the overlay's blur strip on
        the WORDS had `inset: auto …` and no height — it drew nothing; (b) the dark-theme drop shadow put `filter` on the now-opaque
        stage, so the shadow fell outside the picture. FIXED (a height; the filter on a wrapper of the shape); groups re-read — every
        remaining repeat is a named no-op or a dependent axis
      - `[x]` R2-30 · MY OWN, the states proof: the scroller's moving SCROLLBAR THUMB passed the SCROLL check on its own (a guard that
        could not fail) and failed the reduced-motion check (20 false failures). FIXED: `scrollbar-width: none` in the measured stage.
        Mutation-proven: 197 checks 0 failed; scroll link removed → 20 SCROLL failures; pointer script + backdrop rule removed → 15
        POINTER + 1 MODAL failures
      - `[x]` R2-31 · MY OWN: sheet captions were not HTML-escaped — "svg <pattern>" was parsed as a tag (SEEN in the texture sheet
        as "texture.source.svg"). FIXED: `esc()`; the caption now holds `svg &lt;pattern&gt;`
      - `[x]` R2-32 · `npx eslint .` — 1 error: `site-read.js` resume loop destructured an unused `u`. FIXED (`Object.values`):
        0 errors (the 105 warnings are the documented exhaustive-deps category)
      - `[x]` R2-33 · `aw-measure.js`: when its BROWSER closed (free memory had fallen to 752 MB) it ran through the 765 queued
        texture sites in seconds, each recorded as failed, and printed `DONE 805` — a dead crawl that looked finished. FIXED: a
        closed browser stops the run at once with "BROWSER CLOSED … rerun to resume" (exit 2). Mutation-proven by killing its
        browser on purpose: stopped after 41 measured, no DONE; relaunched, it resumes
      - `[x]` R2-34 · `aw-measure.js` saturated on MOTION signatures (menus, page transitions, scroll libraries, hover) — on the
        texture category a new menu pattern kept resetting the streak (69 measured, streak 1: `menu:esc…`, `lib:lenis`,
        `pt:view-transition`), so "saturated" could never mean saturated on texture. FIXED: `--signature=surface` (SVG filter
        primitives · canvas · the kind of each big background: photo / tile / svg / gradient, tiled or single, blend, mix,
        translucent · the surface CSS features · conic / radial / repeating / layered / inset / text shadows in the rules).
        SEEN: after the restart no motion signature appears in `novel` (the first 12 sites: nothing new); the known set is written
        to `aw-texture.saturated.json` at saturation; the R-1 motion question is untouched (the flag is opt-in)
      - `[x]` R2-35 · MY OWN: the colour-picker tally (`r2-picker-tally.js`) read each Dribbble shot's WHOLE page text — the shot's
        palette as hex codes, "Download color palette", an agency ad — so "hex 71 · palette 71 · mobile 81" counted Dribbble's page
        frame. FIXED: only the title + the author's description (cut at "Get in touch" / "Hire a" / "More by") → hex 0, palette 5,
        mobile 12; 72 of 99 descriptions name no control at all — so the designs are read from the 100 screenshots
        (`area-v/picker-shots.json`, every image opened)
      - `[x]` R2-36 · the Dribbble TAG data held 18 "Human Verification" pages saved as shots by its first run (before R2-24) —
        my scrub after R2-24 cleaned the SEARCH file only, and I reported the tag "complete, 100 pages". Found by the subagent
        opening every screenshot. FIXED: removed (82 real pages left), re-crawled with the challenge stop → 17 recovered, then
        Dribbble challenged again and the crawl stepped down by itself (R2-24 seen working in the wild: nothing saved). Open
        remainder recorded on the link's line
      - `[x]` R2-37 · MY OWN, the real-world pass: every effect read **144 fps** (the monitor's refresh rate), FCP within noise —
        a guard that could not fail. The CPU throttle slows only the main thread; blur / shadow / grain are RASTER work, done free
        by a desktop GPU — exactly the cost a low-cost phone pays. FIXED: `--disable-gpu --disable-gpu-compositing` (software
        drawing) + the drawing WORK traced (raster + paint ms per scrolled frame, vs the baseline) + a deliberately heavy CONTROL.
        Proven: baseline 0.14 ms raster / 144 fps · glass 24px 0.48 ms / 96 fps · CONTROL 8.22 ms / 22.8 fps, a long frame
      - `[x]` R2-38 · NOT A BUG (measured) — the user asked, 2026-10-03: "where is the window and the content in it this large?".
        The real-world pass launches Chrome at `--force-device-scale-factor=2`; I first took it for the "headed windows at scale 1"
        trap and set 1 — then MEASURED: the page still reports devicePixelRatio 2, but the window draws half the phone's pixels and
        the cost collapses (CONTROL 13.68 → 0.75 ms raster per frame, 10.9 → 84 fps; glass 24px 48 → 111 fps). The large window
        IS a 720 × 1280 phone at its real density — what a low-cost Android draws. Reverted to 2, with the reason in the code. The
        scale-1 rule stands for the proof windows (r2-combos etc.), where pixels are compared, not costs
      - **DECIDED by the user 2026-10-03 (the big window covered their screen):** the real-world COST pass runs in a headed window
        placed OFF-SCREEN (`--window-position=-2600,0`, occlusion throttling and backgrounding switched off). HEADLESS was tried and
        REJECTED by measurement: capped at 60 fps and composited without a screen, it showed glass 24px at 60 fps where the real
        window shows 33–48 — it hides the main finding. Off-screen checked against the visible window (baseline 144 fps / 0.14 ms
        both; CONTROL 9.0 ms / 22.5 fps vs 8.22 ms / 22.8 fps). **Nothing else changes:** every other test, proof and UAT stays
        HEADED and visible (RULE Z), six windows; the user asked to be sure of that
    - **DECIDED by the user 2026-10-03:** Mobbin — SKIP (needs an account; the ~40 screens seen are kept, overlays are covered by
      Webflow 27 · CodePen 501 · ConvertFlow 18). Dribbble — ENOUGH as it is (75 picker designs read; the blocked search and the
      tag's last 22 shots are not chased)
    - WAVE 1 running 2026-10-03 10:26 (`educo-research/r2-wave1.sh`): CodePen shadow · overlay + frosted-glass +
      glassmorphism + backdrop-filter · colorpicker + texture + curves + noise + grain; lists wf-overlay (27) / wf-shadow /
      wf-glassmorphism / aw-texture; the single pen READ. Collector D (divider, gradient-text, gradient-border,
      mesh-gradient, blend-mode, mix-blend-mode) PAUSED at 0.8 GB free (RULE RS: stepped down) — restarts when memory allows
    - My own sources for the same scope (RULE RS), run beside the user's: MDN (background, gradients, mix-blend-mode,
      filter / backdrop-filter, box-shadow / drop-shadow / text-shadow, color functions, color-mix, relative colours,
      `@property` for animating gradients, clip-path / mask) · web.dev / Chrome developers · getwaves.io · shapedivider.app
      · haikei.app · css.glass · coolors.co / Adobe Color (palettes) · grain / noise and mesh gradients · gradient text and
      borders. GAPS the user was told about 2026-10-03 (glass and textures since sent). The user, 2026-10-03: "we have enough… or you're good on that?" → the rest is MY research, no more links needed: shape-divider tools, blend modes, palettes, gradient text / borders / animated gradients, mesh — from MDN and the tools listed above. Was: no link of theirs yet for section shapes / blending on real sites,
      glass / blur, textures, blend modes, palettes
- `[x]` **BATCH R-1 · Research at full width** — CLOSED 2026-10-02 ~20:00 by the user's "enough" (area: research runs · 4 changes, OPEN 2026-10-02 — the user: "once the
  testing is done… multiple browsers so we can do it faster… we start this in a NEW session"; the rule is in CLAUDE.md
  under RULE RS, "research runs as wide as the machine allows")
  - PAUSED 2026-10-02 ~18:45 for the L-3 stress run (the new rule: no research beside a batch's testing): the CodePen
    resume (`codepen-resume.sh`, it resumes) and the Awwwards chain (`educo-research/chain.sh`) — it had finished
    `aw-coll-about-page` (300) and was on `aw-coll-animation-libraries-examples-inspiration --saturate=150`. Restart the
    chain WITHOUT `--saturate` (the user: "grab everything"); `aw-measure.js` resumes from what it measured
  - `[x]` (1) MEASURED 2026-10-02 18:55, nothing running (no UAT, 3100/3200 free, no research): 16 logical cores at
    5% load, 3.6 GB free of 15.6 GB — MEMORY is the limit, not CPU. With the six CodePen collectors: 0.3 → 0.7–1.5 GB
    free, load 40–90%
  - `[>]` RUNNING (session f86b7fdf): `educo-research/r1-codepen.sh` — 3 tag collectors (A parallax sticky hover-effect
    dialog …, B clip-path hover sticky-header …, C cursor marquee + the step-4 names + the small tags) and 3 list
    collectors over `pens-own-s1..3.list.json` (1,382 / 1,381 / 1,381 = the 4,144 unread), profiles `cp-prof/1..6`
    (copies of prof-c). Shard outputs `raw/pens-own-sN.json` are MERGED into `pens-own.json` when they finish.
    `educo-research/r1-aw.sh <lane> <jobs>` — the Awwwards lists without `--saturate`, two lanes on alternate lists
    (`profile`, `profile-aw2`), lane 1 started at 2 jobs
  - STEPPED DOWN 19:08: collector C raised CodePen's human check 13 times in 6 minutes (walking listing pages of pens
    already read) → stopped; its tags (cursor marquee horizontal-scroll view-transitions page-transition
    scroll-driven-animations + the step-4 names) run when A or B finishes. Awwwards lane 2 NOT started: with five
    CodePen + one Awwwards lane at 2 jobs the machine reads 100% CPU, 0.8 GB free, and the list collectors fell from
    ~8 to ~1.5 pens a minute — the machine is the limit
  - `[x]` **THE USER'S DECISION, 2026-10-02 ~19:35: "we have enough" — the big runs STOPPED.** Estimate given: ~3–4 days
    at full width (Awwwards ~9,500 sites left at ~100/h; CodePen tags open-ended). The "enough" checklist already marks
    every need covered and says the runs "change shares, not the list of techniques"; six tags had saturated. What this
    session read before stopping: **1,212 new pens** (pens-own +1,016 → 1,586 / 4,714 · parallax 962 · clip-path 603 ·
    marquee 256 …) and **~391 Awwwards sites** checked (aw-coll-transitions 366/366 · animation-libraries 25/25 ·
    aw-coll-animation 8/243). Every run resumes if an area turns out thin. Kept to finish: the user's own aw-coll-hovers
    (4 left), the step-4 names (saturated at 150), the `sticky` re-walk that proves R-21
  - **Ledger (this session):**
    - `[x]` R-21 · `cp-tag.js` treated a listing page with no new pens as the END even when it failed to load after a
      human check — `sticky` ended at page 3 with 12 pens (585 read before). Fix: a page with no pen links is retried
      twice; END logs the link count. PROVEN: the `sticky` re-walk went past page 3 to page 98 and read pen 586 (new);
      `dividers` ended on a real end ("page 3 pens 11 links on the page 0" after the two retries). Re-walk then stopped
      (the user's "enough"). aw-coll-hovers 466/466 — every one of the user's own links is complete
    - `[x]` R-23 · the builder's Divider published `<div aria-hidden>` on the canvas AND the page, where the stored research
      (`html-semantics.md:132`) and MDN say `<hr>` (separator) — found while judging the divider pens. FIXED: `<hr>` in
      `box-export.ts:158` and `BoxCanvas.tsx` (UA margin / inset border reset), guard `box-export.test.ts` "a Divider
      publishes <hr>" RED on the old code, green on the new; BoxCanvas test selector updated; scenario in
      `box-builder-layout.feature`. HEADED check → BATCH L-3's pass (change 5)
    - `[x]` R-22 · MY OWN: `r1-aw.sh` gave the user's aw-coll-hovers (462/466) to lane 2, which was never started — a
      list on a lane that does not run is never read. Fix: run directly; `r1-aw.sh` retired with the runs
  - (2) CodePen at 6 windows: three `cp-tag.js` collectors, each with its own COPY of the cleared profile (`prof-c`) and
    its own share of the tags; `list:pens-own` (4,144 not read) split into its own collectors, running AT THE SAME TIME
    instead of after; step back down if CodePen starts asking "are you human"
  - (3) every other link at full width: `aw-measure.js --jobs=` raised as far as the machine allows (Awwwards items are
    separate sites), and the queued runs (wf-page-transitions, opl-drop-shadow, aw-coll-transitions, aw-coll-hovers,
    aw-cat-transitions, aw-cat-animation, the own demo lists) run side by side, not one after another
  - `[x]` (4) DONE 2026-10-02 (stopped at the user's "enough" — 137 pens: divider 75 · dividers 11 to its end · wave 51; svg-divider / stacked-cards / card-stack / stacking not reached, resumable); tag pages regenerated by `cp-how.js` (29 tags); judgement in `motion/library/3-section-transition.md` "Added 2026-10-02 (R-1)": band edges HAVE · wave / SVG edge GAP · overlap GAP · moving wave GAP · rule between blocks PARTIAL→fixed by R-23 · stacked cards GAP. Was: the three 0-pen CodePen tags under the names CodePen uses (divider · dividers · wave · svg-divider ·
    stacked-cards · card-stack · stacking); then the tag pages regenerated (`cp-how.js`) and the HAVE / PARTIAL / GAP
    judgement against the builder
- `[ ]` **BATCH S-2 · Section transitions** (area: band edges and held sections · 5 changes, queued 2026-10-02 by the
  user: "yes" — runs AFTER the layout batches L-3…L-7 and the agreed motion Batches A and B; research done in R-1,
  `motion/library/3-section-transition.md` "Added 2026-10-02 (R-1)")
  - ST-5 · a block can overlap a band edge (a card hanging across two bands): outer spacing may go below 0
  - ST-1 · a sloped / curved band edge shows the NEXT band's colour, as the guide says, not the page colour
  - ST-4 · wave and SVG-shape band edges beside the four `BandEdge` shapes (mask / clip-path, rem-sized, per rung)
  - NEW · a moving (keyframed) wave edge — still under `prefers-reduced-motion`, approved motion tokens
  - ST-7 · stacked cards — **DECIDED by the user 2026-10-02: BOTH behaviours, side by side** ("can we not do a and b
    together"): each held section chooses **Queue** (today's, one under another — stays the DEFAULT so no saved page
    changes) or **Stack** (each card slides over the last); switchable any time, canvas == export
- `[x]` **BATCH L-4 · The decided layout changes** — CLOSED 2026-10-03 (session a51af34e; HEADED pass 4 six windows CLEAN, the eight tier-99
  pages 0 errors / L8 = 0, gate typecheck 0 · eslint 0 errors · vitest 4,022 · test:fast 805; L4-l + L4-n → L-5, L4-r → E-1 by the user).
  Was — next leaf: write its UAT checklist FIRST, then c-8 / c-21 / the grid picker; the user decided 2026-10-03: "finish Task 1 first" — L-4 → L-5 → L-6 (+ S-3, D-1) → the frozen layout list 1.1.5 → PR → Tasks 2–4 → re-sweep + story; AREA V waits) (area: rows and grids · 3 changes)
  - c-7 (decided B) / e-9 · MOVED to BATCH F-1 (2026-10-01) — the HOLE at the end of a line is unused space
  - c-8 (decided B) / e-7 / #127b · words broken across lines ("1,000+" in 165px Stat columns) — 4 pages, 58 findings
  - c-21 (decided B) · edge handles no longer cover the last letter of a block that hugs its words
  - grid picker (decided B) · any count of columns up to 12, not only 1 · 2 · 3 · 4 · 6 · 12
  - checklist (written 2026-10-03, session a51af34e, BEFORE the pass; HEADED, six windows, `scripts/uat/uat-l4-headed.js`,
    built through the UI, fresh production build on 3100, canvas AND Preview, Light · Dark · Midnight · Purple Dream,
    Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920 + the device presets):
    - `[x]` (1) c-21: a selected Heading that hugs its words, in the middle of the page — every one of the 8 handles lies
      OUTSIDE the block (no handle rect intersects the block rect) and its last letter is visible in the screenshot — SEEN pass 4 (A, Light): 0 handles over the block at 375 · 768 · 1024 · 1280 · 1920 · Full width; `A-1280.png` read
    - `[x]` (1) c-21: the same block flush against the canvas on the left, the right, the top (first band) — the handle on
      that side is drawn just inside, visible and NOT cut off; drag it and the block resizes (edge-anchored, rule 19) — SEEN: flush sides kept inside and visible at every rung (no handle cut off); unit `mirrorFlushSides` guards the rule
    - `[x]` (1) c-21: every edge and corner still resizes (drag each of the 8 out and back); a click on a handle with no
      move still places the caret in the words underneath (caretFallthrough); at 375 and at the canvas's Full width — SEEN: all 8 dragged out and back exact (top corners inward = L4-l, handed to L-5 by the user); caret through a handle by `caretFallthrough` unchanged (canvas specs in test:fast)
    - `[x]` (2) picker: the "Choose a layout" menu shows 12 squares across, each ≥ 24px wide, labelled 1 … 12, nothing
      cut off, in all four themes; arrows + Enter pick a size (keyboard), the live region reads "5 across × 2 down" — SEEN pass 4 (B, Dark): 72 squares, narrowest 24px, labels 1 … 12, frame not cut (L4-i); arrows + Enter → "5 across × 2 down" → 5 + 5
    - `[x]` (2) picker: each of 5 · 7 · 8 · 9 · 10 · 11 across, picked from BOTH entry points (the Blocks panel tile and
      the canvas's Add-a-layout), gives exactly that many EQUAL cells on one line at Desktop, canvas == Preview — SEEN pass 4 (C, Midnight + Purple Dream): 5 · 7 · 8 · 9 · 10 · 11 equal on one line at Desktop by drag-in and "Add a block inside" (the tile is B's), canvas == Preview
    - `[x]` (2) picker: on a 5-across grid, a cell's right edge dragged wider takes one fifth and the neighbour gives it;
      dragged back, the grid returns to five equal cells (round trip); the Inspector's column controls still work on it — SEEN: one fifth wider = 275 (2 tracks); back = L4-n, handed to L-5 by the user; Inspector 5 → 6 re-cuts
    - `[x]` (2) picker: the 5-across grid narrows by its own box (two across, then one) at Tablet / Mobile, canvas ==
      Preview, no sideways scroll; the gallery setup still offers 2 · 3 · 4 · 6 across — SEEN: by L4-o a grid of 4+ keeps its count and steps down by words; the D windows show canvas == Preview at every rung, 0 sideways; gallery list unchanged (TWELFTHS_COLUMNS, unit)
    - `[x]` (3) c-8: reproduced THROUGH THE UI first — Stats ("1,000+") in a row of columns AND in a grid of 4 / 5 / 6,
      inside a 70% main column beside a sidebar — the number broken across two lines in the Preview (RED) — SEEN (probe-l4-c8, 6 windows, build Igj0xUNs): grid of 6 at Wide 1920 broke "1,000+" (RED); rows 3 / 4, grids 3 / 4 / 5 held
    - `[x]` (3) c-8 after the fix: at every rung the number is on ONE line (the grid gave up columns first); a column that
      cannot hold the word even alone still breaks it (last resort) and nothing spills sideways — SEEN pass 4 (D, Light + Dark): 0 broken at every rung, canvas and Preview, lines even (6 → 3 + 3, 12 → 4 × 3, row of 4 → 2 + 2)
    - `[x]` (3) c-8: the 4 sweep pages (idx 2, 23, 393, 398) re-run headed — 0 L8 findings — SEEN: all EIGHT tier-99 pages with L8 (2 · 13 · 23 · 31 · 335 · 393 · 396 · 398), headed, build EbyFazDZ: L8 = 0, 0 errors
    - `[x]` regression: the grid / row / resize browser specs (test:fast) green; the gate (typecheck · eslint · vitest ·
      test:fast) green at the commit — SEEN: typecheck 0 · eslint 0 errors (105 warnings, none new) · vitest 4,022 · test:fast 805
  - ledger (RULE V):
    - `[x]` L4-a · MY OWN TEST: the new picker guard read a one-track cell's missing `grid-column` as a broken span (NaN)
      — a cell of one track writes none, which is the default. Fixed in the guard; NOT an engine bug (probe: 5 across →
      `repeat(5, minmax(0, 1fr))`, every cell colSpan 1, no grid-column). The guard is mutation-proven (8 red with
      `gridForAcross` forced to twelfths)
    - `[x]` L4-b · MY OWN PROBE: `probe-l4-c8.js` measured `.eu-stat__value`, but a palette Stat is a TREE of ordinary blocks
      (a 44px heading "1,000+" and a text), so the first six-window run measured NOTHING and printed "one line
      everywhere". Fixed: it measures the words themselves and says "MEASURED NOTHING (probe fault)" when it finds none
    - `[x]` c-8 SEEN CLOSED (pass 4 D windows: 0 broken at every rung, canvas and Preview; the eight tier-99 pages L8 = 0) — ROOT (measured, probe-l4-c8 HEADED, build Igj0xUNs): row3 · row4 · grid3 · grid4 · grid5 hold at every width;
      **grid6 in a 70% main column at Wide 1920 breaks "1,000+"** — cells 163px, the word ~200px at its 61.6px ceiling
      (the type unit is capped at 0.875rem). The grid's narrowing knew only `CELL_MIN_REM` (12rem, gaps not counted) and
      nothing about the words. FIX: `longestWordRem` (the longest word at its font's ceiling, `GLYPH_EM` 0.6 — errs wide)
      and `gridNarrowsAt` steps down by the narrowest word-holding cell + the gaps, one count at a time; a grid whose words
      fit the floor keeps exactly today's two rules. Guard `grid-words-never-break.test.ts`, mutation-proven (3 red with
      the old floor-only path, 3 red with `GLYPH_EM` 0). Re-run headed on build Nm6MZlDF: all six shapes one line at every
      width. Closes on the batch's HEADED pass
    - `[x]` L4-c · SEEN CLOSED (pass 4: 6 → 3 + 3, 12 → 4 + 4 + 4, no Stat alone) — MY OWN FIRST CUT of c-8: stepping 6 → 5 left the sixth Stat ALONE on a second line (seen in the Preview
      screenshot at Wide). FIX: each step takes the BALANCED count (6 → 3 + 3; twelve at five → 4 × 3). Guard: the orphan
      test in `grid-words-never-break.test.ts`, mutation-proven (3 red with the balance removed). Closes on the HEADED pass
    - HEADED pass 1 (`uat-l4-headed.js`, build Jype81CY, `logs/uat-l4-run1.out`): D4 CLEAN (grids of 6 and 5 Stats, every
      width, canvas and Preview, 0 broken, 0 sideways). Found:
    - `[x]` L4-d · B: a keyboard-picked 5 × 2 drew 2+2+2+2+2 — NOT A BUG, measured: the canvas was at Full width (Fit 64%,
      a ~790px page) and an EMPTY 5-across grid narrows by the 12rem floor below 60rem (960px), as designed. The probe
      now sets Desktop first
    - `[x]` L4-e · SEEN CLOSED (passes 2 and 4: no handle over the block at any rung or Full width) — c-21: the right / bottom handles lay 1–17px² over the block at Tablet … Wide — flush against its edge, a
      scaled canvas rounded them a fraction over it. FIX: 2px clear (edges `-3`, corners `-3.5`; `HANDLE_ROOM_PX` 14)
    - `[x]` L4-f · CLOSED: `hug-round-trip.spec.ts` red on the build without it (51 vs 26px), green after; pass 4 every edge
      exact — a Heading that hugs its words, its right edge dragged 40px in and back, came home at the same width but
      a STORED width a fraction under its words — 25px taller, the words never unwrapped (only on a SCALED canvas: a
      1240 window at Desktop, 61%). DECIDED by the user 2026-10-03: fix in L-4. FIX: `maxContentPx` at drag start; a
      left / right drag ending within `HUG_SNAP_PX` (2px) of the one-line width, no neighbour on the line, writes no
      width — the block fits its words again. Guard `tests/e2e/hug-round-trip.spec.ts` RED on the build without it
      (51 vs 26px), green expected on the next build
    - `[x]` L4-g · MY OWN PROBE: C's `under(grid, Stack)` timed out in both windows — each grid now goes in its own Stack
    - `[x]` L4-h · SEEN CLOSED (passes 3 and 4: the row of 4 is 2 + 2 at 1024, canvas and Preview; L4-s fixed its phone step) —
      a ROW of four Stats in a 70% column wrapped 3 + 1 at Laptop 1024 (canvas and Preview) — one alone on
      its line. DECIDED by the user 2026-10-03: "rows balance too". FIX: `rowNarrowsAt` / `rowQueryCss` — below the width
      its longest word needs on every column, each stored line regroups by `balancedLines` (4 → 2 + 2, 5 → 3 + 2), by
      the host's container query, through the grid emitter (canvas == export); not for icon-only lines or menus. Guard
      in `grid-words-never-break.test.ts`, mutation-proven (3 red greedy, 1 red with rows not emitted)
    - `[x]` L4-i · SEEN CLOSED (passes 2 and 4: frame and squares inside the menu's visible box) — the picker's frame ran under the menu's own scrollbar at 360px (the squares were whole, the frame's right
      edge was hidden). FIX: `GRID_MENU_WIDTH` 384
    - `[x]` L4-l · → BATCH L-5 by the user's decision 2026-10-03 ("move to L-5 with #42"): a TOP corner dragged inward and
      back leaves the heading 14px taller (height floor from the wrapped height); measured `probe-l4-corner.js`, 6 windows:
      top corners inward +14, bottom corners and outward drags exact, the width half of L4-f holds in all six
    - `[x]` L4-m · NOT A BUG, measured (`probe-l4-m.js`, band AND section, headed): the Preview grid has 5 tracks, 1,171px,
      as the canvas. The "one per line" was L4-p. Was — CANVAS ≠ PREVIEW: grids in a band made with "Add a band" draw 5 across on the canvas at Desktop, and ONE
      PER LINE in the Preview at 1280 (5, 7, 8, 9, 10, 11 across — `uat-l4-run6c.out`)
    - `[x]` L4-n · → BATCH L-5 by the user's decision 2026-10-03 ("move to L-5"). Was — a 5-across cell dragged a fifth wider and back: 132/132 → 275/132 → 132/275 — the neighbour keeps the
      space; not reversible
    - `[x]` L4-o · SEEN CLOSED (pass 4: 5 · 7 · 8 · 9 · 10 · 11 equal on one line at Desktop) — DECIDED by the user 2026-10-03 ("like rows — keep its count"): a grid of four or more across is floored
      at `HAND_FLOOR_REM` and gives columns up only when its words need it (balanced); fewer than four keep 12rem. Guards
      in `grid-words-never-break` / `grid-picker-any-count`, mutation-proven (2 red with the 12rem floor back). Was — 7 … 11
      across picked at Desktop draw 2 across: an EMPTY grid narrows by the fixed 12rem cell floor
      (7 × 12rem = 1,344px > the page), so a count the picker offers is never shown. The user's decision (asked)
    - SWEEP PAGES (dressed99, idx 2 · 13 · 23 · 31 · 335 · 393 · 396 · 398 — every tier-99 page with L8), HEADED, 6 jobs,
      build 7xxlqqT7: **L8 = 0 on all eight** (tier 99 had 1–6 per size). 2 errors, both L4-s
    - `[x]` L4-s · CLOSED on the eight pages re-run HEADED on build EbyFazDZ: **0 errors, L8 = 0 on all eight**. MY OWN
      REGRESSION from L4-h: at Mobile 375 with 150% text a row band 173px held a column 179px (pages 393,
      396). The row rule's stacking step (one a line — it is NOT kept off the phone) set `min-width: min-content !important`
      over the phone's own `100%`, so a column grew to its longest word. FIX: the stacking step sets the basis only.
      Guard in `grid-words-never-break.test.ts`, mutation-proven (1 red). D4 / D5 re-run CLEAN on build EbyFazDZ; the eight
      pages re-run on it to close
    - `[x]` L4-t · test:fast: four `chrome-follows-resize` tests measured a handle's CENTRE to the edge (< 4px); c-21 puts it
      2px clear by the user's decision, a steady 7px from its centre. The spec measures the handle's NEAR side now (a handle
      that stops following still grows the gap) — test:fast 805 green
    - `[x]` L4-u · test:fast: `side-by-side-resize` aimed the handle's CENTRE at the target edge and landed 7px short (49.21%).
      It aims the edge now — green. Not the L4-f snap (measured: 7px of ~880 = the 0.79% missing)
    - `[x]` W19a on the same pages — NOT an L-4 defect, measured: only at 320 / 323px (iPhone SE, Fold 6 folded), the header's
      PLACEHOLDER menu of four Links wraps 3 + 1 (a three-link line 2 + 1); menu lines are excluded from L4-h's balancing, the
      warnings were there before L4-s's fix, and W19a was added 2026-10-02 (after the 09-29 baseline). A menu that needs a
      burger on a 320px phone is the Navigation component's (COMPONENT_GAPS: "no overlay yet") — into its plan
    - `[x]` L4-r · → BATCH E-1 by the user's decision 2026-10-03: the floating toolbar, flipped below a selected block,
      covers the first words of the block underneath (editor chrome, pre-existing)
    - `[x]` L4-q · MY OWN PROBE: C compared the Preview (after the 5-across round trip, spans 1/2/1/1/1 → 4 + 1, L4-n) with
      the canvas measured BEFORE it. It re-measures after the round trip; C2 re-run CLEAN
    - HEADED pass 4 (build 7xxlqqT7, `uat-l4-run7.out` + `run8c`): ALL SIX WINDOWS CLEAN — A handles outside at every rung +
      Full width, every edge round trip exact (top corners inward = L4-l, handed to L-5); B 12 squares ≥ 24px, labels 1 … 12,
      frame not cut, keyboard 5 × 2; C 5 · 7 · 8 · 9 · 10 · 11 across by drag-in and "Add a block inside", equal, canvas ==
      Preview, Inspector re-cut (round trip = L4-n, handed to L-5); D grids 6 · 5 · 6×2 · 4 and a row of 4: 0 broken words at
      every rung, canvas and Preview, lines even, 0 sideways. Screenshots read (A-1280, C2-canvas, D5-preview-1280)
    - `[x]` L4-p · MY OWN PROBE: `linesOf` grouped cells into lines by vertical OVERLAP, and an empty cell is 0px tall in the
      Preview, so every empty cell read as a line of its own (L4-m). It groups by TOP edge now
    - `[x]` L4-k · MY OWN PROBE: C's hosts — a tile click adds AFTER the selection (never into a chosen host), and the
      add-inside "+" was the first EMPTY box on the page, not the host's. C now drives the drag-in and the host's own "+";
      the tile entry point is B's
    - `[x]` L4-j · MY OWN PROBE: the "cut off" check compared the picker with the wrong box and said CLEAN with it cut —
      it now measures against the nearest scrolling box's client width, frame AND squares; proven RED on the 360 build
- `[ ]` **BATCH E-6 · The empty-box hint is not a button** (RENAMED from E-1 by the tree audit 2026-10-06 — the id clashed with the closed E-1 · The editor on tablets and phones) (area: editor chrome · 2 changes, queued — asked by the user
  2026-10-03: "do we actually need that in the center… that doesn't make the user click on it by mistake"): every empty box
  draws a large centred "+  Empty — drag a block in, or click to add" that is one big click target. PROPOSED (the user to
  confirm when it opens): a faint dashed outline and a quiet, NOT clickable "Drop a block here"; the "+" only on the
  SELECTED empty box, small; "Add a block inside" stays in the toolbar and the Inspector, with a keyboard shortcut — as
  Webflow / Wix Studio do. Every theme, every rung, keyboard and screen reader (the hint is `aria-hidden`, the button named)
  - L4-r · (found in L-4's headed pass, `uat-l4/A-1280.png`; moved here by the user 2026-10-03) a selected block's floating
    toolbar, flipped BELOW it, sits over the first words of the block underneath ("…ck to edit")
- `[ ]` **BATCH L-5 · Resize round trips** (area: resize · 6 changes, queued — after the page grid AC-37b, the user 2026-10-03)
  - #42 · a Stats row's height does not come back after a top/bottom round trip
  - L4-n · (handed over from L-4 by the user 2026-10-03) in a grid of ONE-TRACK cells (5 across, 12 across…) widening a
    cell wraps the LAST cell; dragging back gives the freed track to the NEIGHBOUR (132/132 → 275/132 → 132/275):
    `startResizeGridCell` re-measures the row without the wrapped cell, so `pairBudget` grows. Pre-existing
  - L4-l · (handed over from L-4 by the user 2026-10-03, same root as #42) a Heading's TOP corner dragged inward and back
    stays 14px taller: its words wrap mid-gesture and the height floor is taken from the WRAPPED height (`minHeight` 65.7
    against the words' 42.6, `probe-l4-corner.js`); bottom corners and outward drags come back exact
  - E2-22 · (moved here by the user 2026-10-06, "queue it with the resize work") the columns of a "Side by side" block filled with
    "Add a block inside" cannot be sized against each other on any screen — each sits in a band of its own inside the row, so a
    column's edge finds no partner (columns made by dropping beside each other do resize). Its place here was #46 (the
    side-by-side-resize spec failing on tablet and phone), CLOSED BY BATCH E-2 2026-10-06: 256 / 256 on all four projects
  - #82b · #83 · width round trips drift at 1366
  - #84 · the left-edge resize uses a fixed 14rem neighbour floor
- `[ ]` **BATCH L-6 · Africa-first measurements and the innovative pages** (area: harness · 4 changes, queued)
  - LOGO in every test header (the user, 2026-10-03: "wherever you say new heading in the test, that should always be a
    logo"): the dresser's header puts a LOGO placeholder where it typed a Heading — a small Image (the school's mark) beside
    the school's name, named in the page report as a placeholder (RULE C) — so every swept header is logo + navigation,
    as real sites are; the probes that build a header do the same. The real Logo block is a COMPONENT (below)
  - page-weight audit in every page report (≤ 100 KB compressed, ≤ 500 KB first view at 360px, images sized and lazy,
    ≤ 2 font families) · Slow-3G profile (first band within 5 s) · the innovative plan (19 pages)
- `[ ]` **BATCH D-1 · A README a newcomer can start from** (area: documentation · 1 change, queued — asked by the user
  2026-09-30): the root `README.md` is still the create-next-app template. Replace it with how to install and run each
  app (web 3000, admin 3001, mobile), the project structure, how to test (vitest, test:fast, the UAT scripts, the
  production build on 3100), where the rules (`CLAUDE.md`), the task tree and the guide live. Short; links out
- `[ ]` **BATCH L-7 · Task 2: the wrapper dissolve** (area: layout wrappers · 1 change, queued 2026-10-01 — the user: "go
  with your recommendation") — tree 1.1.2: a band holding ONE block inside a column is dissolved; a band with a
  background, height or edge-to-edge setting is kept; a block directly in a stretched column must still shrink (V4 in
  `resize-leaves-no-gap.spec.ts`, which reverted the first attempt). On a FRESH branch `builder/layout-2` cut from
  `master` after L-1 … L-6 and D-1 are merged (rule 9: this branch is already long)
- `[ ]` **BATCH L-8 · Task 3: outer-edge space in a column** (area: resize · 1 change, queued 2026-10-01) — tree 1.1.3:
  when the parent is a COLUMN, shrinking a block opens a space at its outer edge that sticks. Branch `builder/layout-2`
- `[ ]` **BATCH L-9 · Task 4: the parity spec covers every arrangement** (area: canvas = Preview · 1 change, queued
  2026-10-01) — tree 1.1.4: `parity-every-arrangement.spec.ts` extended to grid cells, components, sticky, floating and
  fixed (neighbours of a floating/fixed block do not move), at every breakpoint. Branch `builder/layout-2`
- `[ ]` **BATCH P-1 · Alignment and spacing panel** (area: the Inspector's alignment · 6 changes, queued 2026-10-04 inside R-4's
  "BUILD BATCHES IT IMPLIES" — given its own heading by the tree audit 2026-10-06): (1) Across / Down with Fill + the 3×3 shortcut
  (AC-27) · (2) container Down incl. "Text lines up" + `safe` · (3) Spread incl. even spacing + wrapped lines (AC-25) · (4) Push to
  the end / bottom (AC-26) · (5) RTL logical sides · (6) `min-width: 0` on fills measured. Detail: R-4 in this file
- `[ ]` **BATCH P-2 · Size and shape** (area: block size · 4 changes, queued 2026-10-04 inside R-4 — heading added by the tree audit
  2026-10-06): (1) Shape — a chosen proportion (AC-34) · (2) readable width per block + largest width · (3) height as a minimum only,
  incl. a screen-height share and "minus the header" (AC-3) · (4) fluid default inner space checked
- `[ ]` **BATCH G-4 · Grid block, extended** (area: the Grid block · 6 changes, queued 2026-10-04 inside R-4 — heading added by the
  tree audit 2026-10-06): (1) cards fit ≥ X, fill / fit (AC-33) · (2) subgrid (AC-36) · (3) a fixed-width or content-sized column
  beside the shares (AC-30) · (4) the planned splits gallery · (5) purpose picks (AC-37c) · (6) dense packing (AC-32 — in no batch
  until the audit)
- `[ ]` **BATCH P-3 · Page layouts** (area: whole-page layouts · 5 changes, queued 2026-10-04 inside R-4 (D1) — heading added by the
  tree audit 2026-10-06): presets gallery · blank canvas · "draw your areas" editor · reading order follows the drawing · change the
  layout after picking one, nothing lost
- `[ ]` **BATCH G-5 · Layering, extended** (area: overlap and floating · 6 changes, queued 2026-10-04 inside R-4 — heading added by the
  tree audit 2026-10-06): (1) layer over in one cell + the covers-words warning (AC-31) · (2) floating held by any corner, "half
  outside the edge" (AC-10) · (3) Cover · (4) the floating fallback on a phone (AC-21) · (5) "Overlap the items" on a row · (6) scroll
  padding under a sticky header + safe areas (SP-1, SP-14)
- `[ ]` **BATCH G-6 · Page-grid close-out** (area: page grid · queued 2026-10-04 inside R-4 "as planned" — heading added by the tree
  audit 2026-10-06; its changes are set when it opens): the real-world pass R-3 left (low-cost Android, screen reader, Slow 3G)
- `[ ]` **BATCH M-1 · The L-2 fixes in the phone and tablet app** (area: `apps/mobile/` · MUST BE DONE, NOT STARTED — the
  user, 2026-10-01: "Yes, I want something built in mobile for this, but… just have this noted that it must be done", so
  we do not get carried away). What it holds, to be planned when it opens (phone AND tablet, `isTablet`, Jest + both
  emulators): a school's site shown inside the Educo app as a WEBVIEW over the real export (rule 20), so the L-2 fixes
  arrive as they are — the header spread and centred, words and FAQ answers wrapping as published, "Floats on screen"
  holding — checked on emulator-5556 (phone) and 5554 (tablet) at their real widths; plus whatever native chrome the plan
  approves. Same item as section 4's "Builder on phone and tablet". WHEN: the user places it; the layout order below
  stands until then
- `[ ]` **ORDER, DECIDED by the user 2026-10-01:** L-1 … L-6 and D-1 on this branch → pull request to `master` → fresh
  branch `builder/layout-2` → L-7, L-8, L-9 → THEN the whole-tier re-sweep and the layout story (RULE L) ONCE, over all
  of it, so neither is done twice
- `[ ]` **Then, in order (after L-9):** the whole tier swept again (spacing changes every page) → the story and the published
  artifacts → the full gate → pull request to `master` → the original queue (1.2)

---

## 1 · Website builder (current focus — first product to release)

### 1.1 · The four tasks (the user's handoff note, 2026-09-26) — see memory `project_four_tasks.md`

**TREE AUDIT 2026-10-06 (the user: "what is left for the layout task?" → "yes, please do that").** Every open line of 1.1 – 1.3
checked against the BATCHES, `git log` and the code; 109 lines re-marked in place (each carries "AUDIT 2026-10-06:" and its
evidence), nothing deleted. Most of 1.1.1 had been closed by L-1 … L-4, S-1, S-2, F-1, E-0 and E-2 without its lines being ticked.
Ids fixed: the queued "empty-box hint" batch is now **E-6** (it clashed with the closed E-1); the second SP-12 is **SP-12b**.
P-1 · P-2 · G-4 · P-3 · G-5 · G-6 existed only as text inside R-4 and now have queued headings in BATCHES. **WHAT IS LEFT OF THE LAYOUT:**
- **Now:** E-3 (open) · E-4 · E-5 (research first).
- **Task 1 tail:** L-5 resize round trips (6: #42 · #82b / #83 · #84 · L4-l · L4-n · E2-22) · L-6 Africa-first measurements + the
  innovative pages (4) + the dresser's "Centred column" · S-3 Page check warns about space (2) · E-6 the empty-box hint (2) · the
  1.2 queue (Add a block inside nests · Side by side makes an empty row · the stale `alignSelf` · "Place here") · then the whole-tier
  re-sweep, the final story and the artifacts.
- **Tasks 2–4:** L-7 · L-8 · L-9 (one change each; L-9 also takes WebKit and Firefox projects, #144's follow-up).
- **The frozen list (1.1.5):** MUST 1 of 6 done (AC-35) — 3 not started (AC-33 · AC-36 · AC-34), 2 partly (AC-26 · AC-3) · BUILD 0 of 6
  — 2 not started (AC-30 · AC-32), 4 partly (AC-31 · AC-21 · AC-10 · AC-37) · smaller 0 of 14 — 10 not started, 4 partly · CHECK 0 of
  9 seen headed (7 have their feature built) · sticky / fixed: SP-1 and SP-4 (the two MUSTs), SP-2 · 3 · 5 · 7 · 8 · 11 · 14, the SP-12
  gallery, SP-13, SF-8, the SP headed check — 3 more LATER. Nearly all of MUST / BUILD sit in the queued P-1 · P-2 · G-4 · G-5.
- **Unbatched ledger lines (found, never given a batch):** the motion / effects bugs EX-2 · 3 · 5 · 6, MR-2 … MR-9, SA-1, N1 … N10,
  SH-7, NEW-A1, EX-10, MR-16, AM-1, CE-19, HV-17, NEW-C1 (planned as "Batch A / B / C", never opened) — they go to S-2 / a motion batch
  when AREA V opens; until then they stay open here.
- **Queued batches beside the layout:** S-2 section transitions (5) · U-1 surface what is built · D-1 README · M-1 the app.
- **After the layout (1.3 on):** everything except the documentation site (built early: D-2 `f437b5c`, D-3 `af533ac`).

- `[>]` **1.1.1 · TASK 1 — the layout** (grew from "width round trips"; branch `builder/layout-uat`) — AUDIT 2026-10-06: the batches closed nearly every line below — what is left is L-5 · L-6 · L-7 · L-8 · L-9, the whole-tier re-sweep, the story and the artifacts; `builder/layout-uat` merged early as PR #5 (`1541d98`)
  - `[x]` Width round trips in stored percentages — `2de0ef2`
  - `[x]` Semantic pages, real-screen editing, resize that comes home — `5345e80`
  - `[x]` Link blocks, band colour schemes, dressed pages (RULE E) — `c3e99cf`
  - `[x]` The four layout decisions 1D · 2A · 3A · 4A — `919d731`
  - `[x]` **Tier 80 dressed sweep** — 70 pages, fixes in `67f7f64`
    - `[x]` page 38 "could not select" the 2nd of 4 card columns (same class as 1.1.1.c-11 below) — AUDIT 2026-10-06: L-1 L1-r3 "page 38 … BUILT, 212 blocks" (`509822a`)
  - `[x]` **Tier 95 dressed sweep** — 135 pages swept, fixes in `919d731` — AUDIT 2026-10-06: its one child closed
    - `[x]` The 19 build failures re-run (could-not-select ×9 · drop-offered-nothing ×7 · barely visible ×1 · click — AUDIT 2026-10-06: L-1 L1-r2: 16 of 19 built; 142 / 109 / 124 after L1-3 / L1-8; page 12 in Z-1 (`509822a`)
      timeout ×2) — same classes as tier 99, fixed there first
  - `[x]` **Tier 99 dressed sweep** — 403 pages in 688 min, 52 could not be built, 17 clean (2026-09-29) — AUDIT 2026-10-06: every c- and e-line closed by a batch (below)
    - `[x]` a · The log copied out of Temp → `scripts/uat/logs/sweep99.log`; baseline results kept in
      `scripts/uat/dressed99-baseline-out`
    - `[x]` b · Uncommitted work secured — gate green, `bc89d68` pushed
    - `[x]` c · **Triage and fix, class by class (the bug ledger of this sweep)** — counts are pages affected — AUDIT 2026-10-06: every class closed below
      - `[x]` c-1 · **Icon taller in the Preview than on the canvas** (#143) — 185 pages, +18px phone … +6px wide.
        ROOT CAUSE: `isEmptyBox` counted a block that draws its own content (Icon, List, Divider) as an empty box, so
        it got the 2.5rem floor; the canvas then discarded the floor's height and the export kept it (7 of 11 block
        types disagreed). Fixed in `isEmptyBox` + `childStyle` + the canvas wrapper; guard enumerates every block type,
        mutation-proven ×3. HEADED UAT probe-t7 on build DM9hSozR: identical at all five rungs; sweep pages 21, 139, 86,
        63, 10 re-run headed: 5 errors → 0 each
      - `[x]` c-2 · **List shorter in the Preview** (#135) — 145 pages, −8 … −17px. Root cause: the canvas spaced its
        items, the export did not. Fixed with one shared `LIST_ITEM_GAP`, guard mutation-proven. HEADED UAT probe-t7 on
        build DM9hSozR: identical at all five rungs (80.4 · 82.6 · 84.9 · 95.7 · 117.6px); same five pages at 0 errors
      - `[x]` c-3 · **Heading / text wraps differently in the Preview** — 77 pages at Tablet 768 (+33 / +50px), 28 at — AUDIT 2026-10-06: = e-4, closed by L-2 (0 R11 findings, `2bcc73f`)
        Desktop. #137 (page as a size container) is in `bc89d68`. Pages 139, 63, 10 carried it and are at 0 errors on
        the fresh build; the full re-run (d) closes it or reopens it
      - `[x]` c-4 · **Build failed: could not select a column** — 36 pages (incl. page 199). HARNESS. Measured on all 36:
        the click selected an ANCESTOR every time (its grid ×21, a stack ×13, nothing ×2). Logged click by click on
        pages 298, 37, 122: each click goes one box deeper, the column is SEVEN boxes down on a sidebar page, and the
        harness stopped at six. It clicks until it is there now (up to 16). Pages 298, 37, 122, 199, 266, 185 re-run
        headed: all six build, all six at 0 errors
        - `[x]` the harness's "come back" misfired once it existed: dragging back cannot restore a row whose neighbour
          dropped (page 33: a cell left 41px wide). It UNDOES the drag and tries one step less now
      - `[x]` c-5 · **Build failed: the canvas offered the drop and added nothing** — 15 pages (9 "under", 6 "into"),
        every one right after the hero. Screenshot p33-build-fail.png read: the first section's heading and text sit
        under it (the section has no background of its own, so it reads as one band with the header). The tree is right;
        the drop under the text was offered and added nothing. The selected heading's floating toolbar sits over that
        text. CONFIRMED through the UI (probe-t9): released on the toolbar, nothing is added (3 of 3); beside it, the
        block is (2 of 2). FIXED: while anything is dragged over the window the selection chrome lets the pointer
        through (`body[data-box-drag-in]`). Browser guard with a REAL pointer drag onto every control of the toolbar,
        red on the old build; HEADED UAT probe-t9 on build TylJ2DR6: 5 of 5 added, screenshot read.
        - `[x]` pages 219 and 249 failed for a SECOND cause, the harness's: they ask for a grid of 5 across and the
          picker offers 1 · 2 · 3 · 4 · 6 · 12 — it found no square, clicked nothing, and the picker sat open. It takes
          the next size up and deletes a cell now, and says so under GAPS. Pages 33, 163, 219, 249 re-run headed: all
          four BUILD; 33 and 163 at 0 errors, 219 and 249 at 1 each (canvas≠Preview at Wide, to look at)
        - `[x]` GAP, the user's decision: **a grid of five across cannot be chosen** (nor 5, 7, 8… — only what — AUDIT 2026-10-06: decided B and built in L-4: 5 · 7 · 8 · 9 · 10 · 11 across give equal cells (`7aa75e5`)
          twelve divides into). A leave, take six and delete one · B let the picker offer any count up to 12 (a grid
          already stores its own column count)
          - `[x]` **DECIDED by the user 2026-09-29: B** — the picker offers any count up to 12. Before building: drive — AUDIT 2026-10-06: L-4 + L4-o (`7aa75e5`); the round-trip leftover L4-n is in L-5
            how a cell resizes on a count twelve does not divide into (5, 7, 8, 9, 10, 11). Not started
      - `[x]` c-20 · **The toolbar kept the side it chose when the block was selected** — dock the blocks panel and the
        page is refitted to 77%, the block moves to within 36px of the top, and the bar stayed ABOVE it, over the top
        edge of the page. It re-measures on `transitionend` now. Browser guard, red on the old build, green on TylJ2DR6
      - `[x]` c-21 · **The right-edge handle covers the last letter of a selected block that hugs its words** ("What we — AUDIT 2026-10-06: decided B, built in L-4: 0 handles over the block at every rung (`7aa75e5`)
        offe", probe-t9 screenshots). The handles are centred ON the edge, so half of each lies inside the block. The
        user's decision — it moves every handle: A leave · B draw the edge handles outside the block · C fade a handle
        that lies over words. Recommended: B
        - `[x]` **DECIDED by the user 2026-09-29: B** — the edge handles are drawn outside the block. The UAT drives a — AUDIT 2026-10-06: L-4 checklist (1), L4-e, L4-t (`7aa75e5`)
          block flush against the page edge, where a handle has no room outside. Not started
      - `[x]` c-6 · **Build failed: timeout** — 1 page (+2 click timeouts that also could not select) — AUDIT 2026-10-06: = e-2: E-0 (68 the machine, 145 builds); the missing `__step` fixed in L3-d / c-12c
        - READ ONLY, 2026-09-29. idx 38 (altamedfoundation.org/help_campaign): `scrollIntoViewIfNeeded` timed out
          after 10 s waiting for a palette tile, 209 blocks built; its screenshot shows the blocks panel CLOSED.
          INFERRED: a harness step closed the panel and did not reopen it — which step is not recorded (`__step` is
          not saved in the report; that is a gap in the harness to close). idx 234 and 327: "could not select", then a
          click timeout AFTER the build had failed (most likely the Upload click on a card squeezed to 45px) — the
          class c-4 fixed. No sign of the app hanging. The re-run says whether the three still fail
      - `[x]` c-7 · **HOLE at the end of a line at canvas Wide 1920** — 29 pages, 44 findings. Every such row stores
        widths summing over 100% (50 + 25 + 33.34). MEASURED (page 101 with step logging, probe-t8 --row --main=62):
        three columns need 3 × 14rem = 672px; in a 668px main column the third had ALREADY dropped to the next line when
        the dresser sized the first two. Dragging itself is sound — every probe on one line stores 100%.
        - `[x]` HARNESS: `sizeColumns` checks the whole line; a row that is not on one line is sized at the Desktop
          (then Wide) screen size, as a person would, and the count is in the report (`SIZING:`); a row no screen size
          holds on one line is left as dropped and listed under `GAPS`. Pages 6, 74, 101, 186, 36 re-run headed: 0 errors
        - `[x]` page 64 had c-8's cause (a Quote in a 111px column); 0 errors after the dresser's width-first change
        - `[x]` ENGINE, the user's decision: a person who DOES size two columns while the third is on the next line — AUDIT 2026-10-06: decided B, built in F-1 (`e6a30d4`)
          gets 50 + 25 + 33.34, and a hole on every wider screen. A keep as is (the size you drag is the size you get,
          and an unsized column keeps the share it was dropped with) · B a column nobody has sized by hand takes what
          is left of its line · C the editor warns when a line adds up to more than 100%. Recommended: B
          - `[x]` **DECIDED by the user 2026-09-29: B** — a column nobody has sized by hand takes what is left of its — AUDIT 2026-10-06: F-1 change (2) c-7 B in `childStyle` (`e6a30d4`)
            line; under its floor it drops to the next line as today. Not started
      - `[x]` c-8 · CLOSED in BATCH L-4 2026-10-03 (the grid gives up columns, evenly, by its words; the eight tier-99 pages L8 = 0) —
        **Words broken across lines in the Preview** — 23 pages, 905 instances, column width median 77px.
        Text placed in a column narrower than its longest word ("1,000+", "everything", "description"). Measured:
        a Card in a grid cell 2 columns of 12 wide, inside a 70% main column (119px). Two halves:
        - `[x]` HARNESS: the dresser picked a column's content by its SHARE (< 12% → an Icon); it picks by the WIDTH the
          column has at 900px now (`fitTile`: under 6rem an Icon, under 150px words instead of a Card / Quote / Stat),
          and sets the section's width BEFORE filling it. Pages 148, 150, 159 re-run headed: 40, 18, 32 errors → 0.
          After the width-first change page 64 is at 0 errors; page 211 still breaks "1,000+" in a Stat at 900px
          (120px columns; the estimate said 150): the floor is 190px now, carrying that fifth. Page 211 re-run: 0 errors
        - `[x]` ENGINE, the user's decision: what a grid does when words are put in a cell narrower than the longest — AUDIT 2026-10-06: decided B, built in L-4 (`7aa75e5`)
          word — A break the word (today) · B narrow the grid by its narrowest cell that holds words · C leave it
          and have the Page check say so. (A row column is already never narrower than its longest word.)
          - `[x]` **DECIDED by the user 2026-09-29: B** — the grid narrows by its narrowest cell that holds words; — AUDIT 2026-10-06: L-4: the grid gives up columns by its words; tier-99 pages L8 = 0 (`7aa75e5`)
            breaking the word stays as the last resort when one column cannot hold it. The largest of the decisions:
            read how the grid narrows by its own box before choosing how. Not started
      - `[x]` c-9 · **Image runs off the page by 1px** (#142) — 12 pages at 600–899px. Right edge lands at 769 on a
        768 page: decision 1D's −0.0625rem slack on the last column (1px, 1.5px at 150% text) plus sub-pixel rounding.
        The page does not scroll sideways (L1 is clean on all 12). NOT A BUG in the engine (measured: 1–2px on every one
        of the 12); the audit allows the slack + half a pixel now. Pages 24 and 290 re-run headed: 0 errors
      - `[x]` c-10 · **150% text: an Icon spills out of a 50–55px column and overlaps** — 9 pages spill, 5 overlap.
        Same root as c-1 (the floor's 2.5rem minimum width is 60px at 150%). Pages 119, 285, 378, 328, 254 re-run
        headed: no spill and no overlap left
      - `[x]` c-11 · **Tablet: 4 columns on one line** (L6, #78) — 3 pages — AUDIT 2026-10-06: = e-6, L-3 (`6d67d52`)
        - READ ONLY, 2026-09-29 (the sweep was running; nothing driven yet). Pages idx 223 (5 rows), 359 (2 rows),
          382 (1 row, only at 800–876). MEASURED from the baseline trees: all 8 flagged rows store widths that add up
          to 100.01 – 100.19% (70.04 · 9.99 · 10.14 · 10.02); of 984 rows of four or more, the 965 that add up to
          100.001 or less are all clean, and the 8 are among the 19 that add up to more
        - `[x]` c-11a · ENGINE, MEASURED in the file: `packRowLines` (`lib/box-model.ts` 4328) starts a new line at — AUDIT 2026-10-06: the user decided "fix the comment only" — closed in L-3, no behaviour change
          `> 100.001`, while its own comment (4306) says "percentages that round to 100.4 are meant to be a full
          line". INFERRED, to be driven: the stored packing says 3 + 1, so `tabletPlaces` finds no line of four and
          the #78 rule is skipped, while the browser draws all four on one line. Guard first:
          `packRowLines([70.04, 9.99, 10.14, 10.02])`, red before the fix; then HEADED UAT at 768 reading each
          column's computed `flex` and `margin-right`
        - `[x]` c-11b · **Rows that store more than 100%** — 19 in the baseline, against "every probe on one line — AUDIT 2026-10-06: L-3: found, fixed, guarded by `row-never-stores-over-100.spec.ts` (`6d67d52`)
          stores 100%" (c-7). Count them in the re-run's trees; if they are still there, find whether the drag or the
          dresser writes them, through the UI
        - `[x]` c-11c · The user's decision: **does a cell holding one icon count as a column for the tablet rule?** — AUDIT 2026-10-06: decided B, built in L-3: `holdsWords` in `tabletPlaces` + the audit's L6 (`e80b889`)
          On all three pages the three narrow "columns" are single-icon cells of 8–10% beside the words (a table of
          ticks). A yes, four is four (today's check) · B a line of four is rearranged only when at least two of them
          hold words or a card. Asked, not assumed
          - `[x]` **DECIDED by the user 2026-09-29: B** — a line of four is rearranged on a tablet only when at least — AUDIT 2026-10-06: L-3 (`e80b889`)
            two of its cells hold words or a card; a cell holding one icon does not count. The engine (`tabletPlaces`)
            and the audit's L6 check take the SAME rule, in the same change. Not started
      - `[x]` c-12 · **React error #185** (max update depth, #134) — 2 pages (idx 34, 43) — AUDIT 2026-10-06: L-3 change 1: 0 #185 on all 9 e-5 pages + idx 34, 43 (`cf614c8`)
        - READ ONLY, 2026-09-29. MEASURED: idx 34 is 522 blocks, idx 43 is 156; the editor survived and both audits
          finished; the two share nothing the other 401 lack (7 pages of the same recipe ran clean); the same error
          is in tier 95 (page 0) and tier 80 (page 26) on other recipes — so timing, not structure. No stack, step or
          screen size was recorded
        - INFERRED from the React 19.2 source and the code path, NOT reproduced: every keystroke is a synchronous
          commit of the whole site (`SectionKit.tsx` 49 → `BoxCanvas.tsx` 3323 → `commit` in `box-demo/page.tsx`
          260) followed by a save of the whole site to localStorage (230–242); the harness types 150 characters with
          no delay; more than 50 such commits while another update waits (the handles' next measurement, the scroll
          re-measure) and React throws #185 in the next `setState`. None of the canvas's measuring loops can reach it
          alone (default priority, frame budget)
        - `[x]` c-12a · Reproduce through the UI (a long page, type 3 × 150 characters, repeated), full stack kept; — AUDIT 2026-10-06: L-3 checklist (1)
          guard red first: a `pageerror` matching #185 fails the spec
        - `[x]` c-12b · **Typing re-renders and saves the whole site on every key** — beyond the error, this is what — AUDIT 2026-10-06: L-3: 65–95 → 8–9.5 ms a key (`cf614c8`)
          a teacher on a low-cost phone feels as lag on a long page (RULE AF). To be MEASURED (time per keystroke at
          150 and 520 blocks) before anything is changed. The fix changes what one Undo takes back while typing, so
          the user is asked first
        - `[x]` c-12c · HARNESS: a page error keeps only its first line (`h.js` 11) and is attached once at the end — AUDIT 2026-10-06: L3-d: `h.js` keeps the stack and the step
          (`uat-pages.js` 184), so neither the stack nor the step is known — same gap as c-6. After the sweep
      - `[x]` c-15 · **Selection handles stay at the previous screen size** — the page frame changes width by a 300ms
        transition with no render, so the handles were never re-measured (97…1107 around a block at 415…790). The
        mirror now follows `transitionrun` / `transitionend` of anything that holds the block. Guard in
        `chrome-follows-resize.spec.ts` (8 changes of size in a row): red on the old build (225px off), green on
        fxuGzvaE. HEADED UAT probe-t8, canvas-768 and canvas-375 read: handles on the block
      - `[x]` c-16 · NOT A BUG — the two purple bars in Preview are the Preview's OWN width grips
        (`app/website/box-demo/page.tsx` 992–998: `h-10 w-1.5 rounded-full bg-indigo-500/70`), and the canvas with
        its selection chrome is unmounted while Preview is open (`if (preview) return …`)
      - `[x]` c-17 · **A narrowed grid had a row more in the editor than on the page** — the editor's "Add a block
        here" offer took a cell of its own (Tablet: 3 rows of 116px drawn, 2 of 174px published). THREE causes, each
        found by re-running: (1) the offer ignored a grid narrowed by its OWN BOX → hidden inside the container query;
        (2) it counted `used % track`, as if cells packed tightly → `gridLeftoverAt` walks the rows; (3) it counted
        unstretched spans → counts `gridSpanAt`, the spans drawn. Unit guard (10 arrangements × rungs) and browser guard
        (1·3·8, 1·11, 11·1 × 4 sizes), each red before its fix. HEADED UAT probe-t8 on build hQOBKlr1: identical at all
        five rungs; sweep pages 285, 119, 378, 328 re-run headed: 0 errors
      - `[x]` c-19 · HARNESS: **the dresser drags past what the neighbour can give, then clicks the editor's offer.**
        In a narrow grid one column is under the 3rem hand floor, so the neighbour keeps its 6 columns and drops a row
        (stored 11 + 6, page 254); the free half-row offers "Add a block here" under the pointer and the next click
        meant to SELECT adds an empty cell (7 of 777 grids in the baseline). `sizeColumns` now looks, and brings the
        edge back until the neighbour is beside it again (counted per page as `cameBack`); `select` moves the pointer
        first and never clicks the offer. Page 254 re-run headed: 0 errors, the dresser came back 6 times, no stray
        cell in any of 13 grids
      - `[x]` c-18 · HARNESS: the sweep compared a 720px editor window with a 900px Preview window, so a row beside
        a sticky sidebar (one screen tall by design, `100dvh`) read as canvas≠Preview on every block (page 141).
        The rungs are compared in windows of the same height now; page 141 re-run headed: 4 errors → 0
      - `[x]` c-13 · Sweep header said "tier ≤ 80%" on a tier-99 run — names the plan now (`uat-pages.js`)
      - `[x]` c-14 · Two unit guards were wrong about what ships (base budget counted comments; scaffolding guard
        forbade the page's own size container) — both measure the shipped sheet now, mutation-proven, `bc89d68`
    - `[x]` d · **The whole tier re-run on the fixed build** — 39 affected pages re-run headed first, 35 of them at 0 — AUDIT 2026-10-06: finished 2026-09-30, 403 pages in 957 min (child below)
      errors. The full run (403 pages, about 11.5 hours, no tokens spent) was STARTED 2026-09-29 on build wg5lR_xU:
      log `scripts/uat/logs/sweep99-rerun.log`, results `scripts/uat/dressed99-out`, the first run kept in
      `scripts/uat/dressed99-baseline-out`. **DO NOT edit `scripts/uat/*.js` while it runs.** When the log ends with
      "403 pages in N min": `node scripts/uat/triage.js scripts/uat/dressed99-out` and
      `node scripts/uat/triage-r11.js scripts/uat/dressed99-out`, compare with the baseline (17 clean, 52 not built),
      and put every class into this ledger — DONE 2026-09-30, see below
      - RE-STARTED 2026-09-29 11:05 (sweep pid 18896, server pid 8384 on 3100, six windows). Read at 11:09 by
        session 6c14c5c8: alive, 1 of 403 logged
      - `[x]` **FINISHED 2026-09-30 03:1x — 403 pages in 957 min.** Page 402 hung 45 min, was stopped and re-run alone
        (15 min, built, 0 errors). Every page a HEADED UAT on build wg5lR_xU (checked FRESH). Triage in
        `scripts/uat/logs/triage99-rerun.txt` and `triage99-rerun-r11.txt`. **Against the baseline:** clean 17 → **356**
        · built and audited 351 → **382** · not built 52 → **21** · pages with 0 errors **373**
      - The classes of the re-run, 80/20 (pages affected):
        - `[x]` e-1 · not built: **the canvas offered the drop and added nothing** — 7 (idx 2, 87, 142, 153, 227, 278, — AUDIT 2026-10-06: L-1 L1-2 / L1-7, L1-r6: the 7 pages build (the intermittent L1-13 parked there)
          385): "into" ×4, "under" ×2, "beside" ×1. = c-22, now 7 pages
        - `[x]` e-2 · not built: **scroll / click timeouts** — 9 (idx 393, 396–401 scroll; 68, 145, 400 click). Six of — AUDIT 2026-10-06: E-0 (`78cc6ee`, `0ae9b5f`)
          the scroll timeouts are the LAST pages of the night, in a row — INFERRED the machine, not the page (screen
          lock or load); re-run them in PARALLEL, and only a page that fails there alone (RULE Z). = c-6
        - `[x]` e-3 · not built: **the drag never reached the canvas, twice** — 4 (idx 23, 334, 335, 337; three in a — AUDIT 2026-10-06: E-0; 334 in Z-1 (443 blocks); 337 18 / 18 in L1-7
          row) · and 1 "cannot drop into m-2a: only 0px visible" (idx 336). Same clustering: re-run in PARALLEL, a failure there alone (RULE Z)
        - `[x]` e-4 · **canvas≠Preview (R11)** — 13 pages, 37 findings, every screen size; 6 pages carry most of it — AUDIT 2026-10-06: L-2 (1)(2), L2-b / c (`2bcc73f`)
          (idx 109, 141): headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other heights
          (−24 … +10px); 4 containers 122–198px shorter at Wide. = c-3, reopened
        - `[x]` e-5 · **React #185** — 9 pages (was 2). = c-12 — AUDIT 2026-10-06: L-3 (`cf614c8`)
        - `[x]` e-6 · **Tablet: 4 columns on one line** — 8 pages, 142 findings (was 3). = c-11 — AUDIT 2026-10-06: L-3 c-11b / c-11c (`6d67d52`, `e80b889`)
        - `[x]` e-7 · **Words broken across lines** — 4 pages, 58 ("1,000+" in 165px Stat columns). = c-8 (decided B) — AUDIT 2026-10-06: L-4: the eight tier-99 pages L8 = 0 (`7aa75e5`)
        - `[x]` e-8 · canvas≠Preview on a component 20–24px taller in the Preview — 2 pages (idx 209 and one more) — AUDIT 2026-10-06: L-2 (3), L2-i (`2bcc73f`)
        - `[x]` e-9 · HOLE at the end of a line — 2 pages (idx 210 at Wide 228px; one at Mobile). = c-7 (decided B) — AUDIT 2026-10-06: F-1 change (2) (`e6a30d4`)
        - `[x]` e-10 · canvas≠Preview on one block 28px taller — 1 page (idx 272) — AUDIT 2026-10-06: L-2 (4), the cause of e-4 (`2bcc73f`)
        - `[x]` **Re-run e-2 and e-3** — in PARALLEL; only a page that fails there is re-run alone (RULE Z, the user 2026-09-30) (idx 23, 68, 145, 334–337, 393, 396–401) on a FRESH build — — AUDIT 2026-10-06: E-0 closed
          a failure that goes away alone was the machine, one that stays is a bug — STOPPED by the user at 3 of 14, the rest
          moved to BATCH E-0 (top of this file). **YOU ARE HERE is BATCH L-1** (S-1, S-2 and E-0 closed 2026-09-30)
        - NOT A BUG, expected: 379 pages warn "things need the user's words" (the dressed placeholders' empty text)
      - `[x]` c-22 · **A page that BUILT in the baseline does not build on the fixed build** — the first page logged — AUDIT 2026-10-06: = tier-99 idx 2, in e-1; L1-r1 page 2 BUILT, 178 blocks
        (nodenza.com/partners_ross_morton): baseline 182 blocks, 2 errors; re-run BUILD FAILED at 80 blocks, "the canvas
        offered the drop and added nothing (after: under(2-2h,tack))", released at (422,646) on a `<span>` in block
        2-2h. c-5's signature, but NOT on the toolbar. One page so far: a regression from c-5 / c-20, or a race — the
        finished run gives the count; then reproduced through the UI before it is called either
  - `[x]` **SPACE BY DEFAULT — words never touch an edge** (the user, 2026-09-29: "I hope you are considering the margin — AUDIT 2026-10-06: S-1 (`1cfcfc1`) and S-2 (`60a2051`) closed; only the whole-tier re-sweep is left, after L-9 (ORDER line)
    and padding… some tests are very close to the edge… the user can override, but it is already considered")
    - MEASURED 2026-09-29: it was NOT considered. CLAUDE.md rule 3 says "Spacing is a decision, never a default"
      (`gap: 0`, `padding: 0`); a new section is edge to edge; the page audit has no check for words near an edge or
      for space between sections; design-foundation Rule #7 (96–192px between sections, ~24px within a group, a
      16px scale, pp. 185–196) is written down and not enforced
    - `[x]` BDD scenarios DRAFTED 2026-09-29 while the sweep runs (the user chose "A": read c-11, c-12, c-6 and — AUDIT 2026-10-06: `box-builder-spacing.feature` committed; S-2 added scenarios
      draft this; nothing built or run): `tests/features/components/website/box-builder-spacing.feature`, uncommitted.
      The default VALUES and the saved-pages scenario wait on the user
    - `[x]` The user's decision: **the default values** — proposed from the tokens and deck Rule #7: side gutter
      1rem → 2rem · section space 2rem → 4rem a side (64 → 128px between two sections) · stack gap 1rem · column gap
      1.5rem · inner padding of a coloured or bordered box 1.5rem, 1rem in a narrow box
      - `[x]` **DECIDED by the user 2026-09-29: as proposed** ("I will go with your recommendation. For all of it.")
    - `[x]` Rule 3 REWRITTEN in CLAUDE.md 2026-09-29, at the user's word ("it should be for every element in every — AUDIT 2026-10-06: CLAUDE.md rule 3 + `claude-md-rules.test.ts`, committed
      component and everything added on the layout… you should have added it as a rule"), with three lines in
      `tests/unit/claude-md-rules.test.ts`. NOT YET RUN — vitest waits for the sweep. Uncommitted
      - `[x]` The old wording is still in: `GallerySetupMenu.tsx` 62 · `lib/box-presets.ts` 200 · — AUDIT 2026-10-06: S-2 checklist (4): 0 hits; only the reversal notes remain
        `box-builder-layout.feature` 347 · `tests/e2e/text-is-reachable.spec.ts` 34 (a guard that asserts a heading
        FLUSH against its box by default — it changes with the engine) · design-foundation `02` line 485 · memory
        `feedback_radius_and_spacing.md`. Each corrected in the same change as the engine
    - The user, 2026-09-29, watching the sweep: **"for the logo and the link at the very top it doesn't seem like the
      margin or padding is being considered"**. TRUE, and expected on this build: the sweep runs the build from
      BEFORE space by default, where a header is created with `padding: 0`. The header scenario is in the feature
      file; the whole tier is swept again after the engine change
    - `[x]` c-23 · **A plain element cannot be given inner spacing.** MEASURED in the file: `BoxInspector.tsx` 1139 — AUDIT 2026-10-06: S-1 checklist: Heading, Text, Link, Image and Icon each given inner spacing (`1cfcfc1`)
      offers "Inner spacing" only to a container or a component; a Heading, Text, Link, Button, Image or Icon gets
      outer spacing only (1140). Against the rule as the user states it (every element). To be confirmed through the
      UI, block by block, then fixed with the enumerated guard
    - `[x]` c-24 · **The bulk inspector shows 1.5rem of inner spacing for blocks that have none.** MEASURED in the — AUDIT 2026-10-06: S-1 checklist: the bulk slider reads 0rem (`1cfcfc1`)
      file: `BulkInspector.tsx` 62–63 falls back to `padding ?? 24` while blocks are created with 0 / unset. To be
      confirmed through the UI (select two blocks, read the slider, measure the blocks)
    - `[x]` **Components breathe too** (the user 2026-09-30: "spacing within components by default… the text, the — AUDIT 2026-10-06: S-2 (1) `component-breathing.spec.ts` 68 tests (`60a2051`)
      edges breathe… natural and slick"): a gap between a component's parts and inner padding from its own edge, from
      the same tokens, overridable to 0; measured across the whole catalogue in a browser, guard enumerates it. A
      component with no visible edge gets the gaps but no outer padding (told to the user; theirs to overrule)
    - `[x]` **DECIDED by the user 2026-09-30:** (1) a box with NO background and NO border keeps 0 inner padding — its
      edge cannot be seen, words line up, nested boxes do not narrow; it gets padding the moment it gets an edge ·
      (2) the page header and footer are BARS: 1rem above and below, the 2rem gutter at the sides (not 4rem) · (3) the
      phone gutter stays as built (~22px at 360, fluid through --box-u; 16px was offered) — confirmed 2026-09-30 · (4) the
      SECTION SPACE above and below is **1rem**, not 4rem ("the heading is too far from the top… 2rem is too much")
    - `[x]` Engine, from the spacing tokens (rem + cqw), in BOTH engines by one emitter — WRITTEN 2026-09-30, not yet — AUDIT 2026-10-06: S-1 changes (1)–(6), 0 findings (`1cfcfc1`)
      tested: new blocks carry `spaced`; unset spacing reads `spaceDefaults` (`lib/box-model.ts`); `sectionContent`
      decides the gutter/section space the same way in the canvas and the export; `leafPaddingCSS` gives a plain
      element inner spacing (c-23); the inspector shows "Default · size" and "Back to default"; the bulk inspector reads
      the real padding (c-24). Typecheck 0: a side gutter for every
      section's content even when its background runs edge to edge (only pictures and backgrounds bleed) · space
      above and below a section · a gap between the blocks of a stack and the columns of a row · inner padding for
      any box that has a background or a border
    - `[x]` Audit: two new checks on every page at every size — words within N px of the page edge or of the edge — AUDIT 2026-10-06: S-2 (2)(3) W7a / W7b in `page-audit.js`; the in-app Page check is BATCH S-3 (queued)
      of the coloured box they sit in · space between sections under the floor
    - `[ ]` The dresser stops compensating (it sets "Centred column" to get an inset) once the default exists — AUDIT 2026-10-06: STILL OPEN, no batch: `scripts/uat/dress.js` 124 / 144 / 204 still set "Centred column" → joins L-6 (the harness)
    - `[ ]` Story and guide; then THE WHOLE TIER IS SWEPT AGAIN — every page's geometry changes — AUDIT 2026-10-06: after L-9 by the ORDER line; D-2 / D-3 wrote the story so far (`af533ac`)
    - `[x]` The user's decision: pages already saved keep their spacing (defaults for NEW blocks only — recommended),
      or take the new defaults too?
      - `[x]` **DECIDED by the user 2026-09-29: saved pages KEEP their spacing**; the defaults are for new blocks
  - `[ ]` **RULE AF harness additions** (promised 2026-09-28) — AUDIT 2026-10-06: → BATCH L-6 (queued)
    - `[ ]` Page-weight audit in every page report (HTML+CSS+JS ≤ 100 KB compressed · first view ≤ 500 KB at 360px ·
      images sized and lazy · ≤ 2 font families)
    - `[ ]` Slow-3G profile in the sweep and in `test:fast` (first band within 5 s)
  - `[ ]` **The innovative plan** — `--plan=dressedinnovative`, 19 pages — AUDIT 2026-10-06: → BATCH L-6 (queued)
  - `[ ]` **Open engine lines carried from earlier sessions** — AUDIT 2026-10-06: #144 · #127b · B30 / P4 · #46 closed; #42 · #82b · #83 · #84 are in L-5
    - `[ ]` #144 `capturesFixed` / `fixedBlockedBy` still assume a size container captures a fixed block (false in — AUDIT 2026-10-06: the engine half CLOSED in L-2 (all three engines); OPEN: WebKit and Firefox projects in `playwright.config.ts` → joins L-9 (parity)
      Chromium 145; check Safari 16 before removing the canvas mirror). The user 2026-09-30: do NOT wait for a Mac —
      check it in Playwright's **WebKit** (Safari's engine, runs on Windows) now, and add WebKit and Firefox to the
      browser checks; a real Safari 16 only if WebKit and Chromium disagree
    - `[x]` #127b the stat number "1,000+" breaks in a 10% column (joins c-8) — AUDIT 2026-10-06: L-4 (`7aa75e5`)
    - `[ ]` #82b · #83 (1366 width round trips drift) · #84 (left-edge resize uses a fixed 14rem neighbour floor) — AUDIT 2026-10-06: → BATCH L-5 (queued)
    - `[x]` previewcheck B30 / P4 (harness: drop / select) — AUDIT 2026-10-06: L1-r4: B30_footer_5col and P4_stress both ok
    - `[ ]` **#42 · a Stats row's height does not come back after a top/bottom round trip** — drag a Stat's top or — AUDIT 2026-10-06: → BATCH L-5 (queued), with L4-l
      bottom edge out and back and the row stays taller. Suspected a stale `alignSelf`/`minHeight` stretch; never
      diagnosed. Re-check through the UI; fix at the root with a guard (joins the round-trip family, #82b · #83)
    - `[x]` **#46 · the side-by-side-resize spec failed 14 tests on the Tablet and Phone Playwright projects** — marked — AUDIT 2026-10-06: closed by BATCH E-2: 256 / 256 on all four projects (`979fc5d`)
      "pre-existing" (the phone half was fixed as #48), left as "re-run after the matrix", never re-run. Re-run it
    - WHY THEY WERE LOST (found 2026-09-30 in the transcript of session c7a3c172, 2026-09-26): both were written only in
      replies and handovers, then carried forward as bare numbers until nobody knew what they meant. **From now on a
      ledger line in this tree always carries its one-line description, never a number alone.** Asked by the user:
      "why you got missed? We need to add it to our tree"
    - `[~]` the slide-image check (Sonnet) — named in the 2026-09-28 handover, status unknown. PARKED by the user
      2026-09-30: it belongs to the components, which are rebuilt one by one (1.3); the placeholder stands until then
  - `[ ]` **Story additions** in `docs/guide/layout-story.md` for everything above (RULE L) — AUDIT 2026-10-06: D-2 / D-3 documented the layout from the beginning (`f437b5c`, `af533ac`); the final story after L-9
  - `[ ]` Artifacts and guide updated in the same change (Builder Hub · Layout System · Parity Audit · Semantic plan · — AUDIT 2026-10-06: the guide checked in D-3 (`af533ac`); the published artifacts with the final story
    `docs/guide/website-builder.md`)
  - `[x]` Gate → commit → **pull request to `master`** → delete the branch (rule 9) — AUDIT 2026-10-06: PR #5 merged `1541d98` 2026-10-05 — earlier than the ORDER line planned; later work runs on short branches (rule 9)
- `[ ]` **1.1.2 – 1.1.4 are BATCHES L-7 · L-8 · L-9** (BATCHES, decided 2026-10-01: before the re-sweep and the story) — AUDIT 2026-10-06: still queued, none started
- `[ ]` **1.1.2 · TASK 2 — put the wrapper dissolve back.** A band holding ONE block inside a column is dissolved; a
  band with a background, height or edge-to-edge setting is kept. Built once and reverted: a block directly in a
  stretched column could not be shrunk (V4 in `resize-leaves-no-gap.spec.ts`)
- `[ ]` **1.1.3 · TASK 3 — outer-edge space when the parent is a COLUMN**, so shrinking opens a space that sticks
- `[ ]` **1.1.4 · TASK 4 — extend `parity-every-arrangement.spec.ts`** to grid cells, components, sticky, floating and
  fixed (neighbours of a floating/fixed block do NOT move; their contents follow every rule), at all breakpoints.
  Today it covers Stack / Side by side / Grid only
- `[x]` **Which list is Tasks 2–4?** A 2026-09-28 session wrote a different one (semantic layer · template feature · — AUDIT 2026-10-06: confirmed by the user 2026-09-29 (child)
  template library) and marked it "correct this if different"; never confirmed. The original above is assumed
  - `[x]` **CONFIRMED by the user 2026-09-29: the ORIGINAL list** — wrapper dissolve · column outer-edge space ·
    parity spec extended

### 1.1.5 · LAYOUT — DEFINITION OF DONE (**FROZEN 2026-10-02 — signed off by the user**)

**USER SIGN-OFF 2026-10-02:** every item in MUST, DECIDE and the sticky/fixed group (GROUP 3) is approved to BUILD.
The user: "I sign off on everything… let's have everything… all the stuff on the table." LATER items (motion,
typography, components) stay LATER and move to 1.3 when the layout closes. The "DECIDE" heading is kept for
history; all its items are now BUILD targets, not open questions.

The one list that says when the layout is finished. Sources: the user's Advanced CSS course (stored, technique by
technique, in `docs/web-anatomy/advanced-css/` — README's gap list AC-1…AC-36), the user's own list (to be added once
sent), and my research. Nothing on the layout is done until every line here is closed. LATER items move to 1.3.

**What the course taught us (2026-10-01, read this first):**
- The builder already does most of it RIGHT, often better than the 2018 course: rem not px, `gap` not margins (the
  course's "Flexbox has no gap" is out of date), `minmax(0, 1fr)` so a long word never widens a column, media never
  overflow, heights are floors not caps, placement stored per block (so nothing is renumbered when a rung changes the
  layout), the reader's text size is never overridden (the course's "root font-size 50% at a breakpoint" is rejected —
  WCAG 1.4.4).
- The real gaps are few and specific: the six under MUST. They are what modern real pages use most and the builder
  cannot build: auto-fit grids, half-bleed, subgrid, push / grow space, height-aware sizing, chosen proportions.
- Most of the course's effects are NOT layout (hover, flip cards, gradients, filters, component designs) — they wait
  for the component and motion work (LATER), so the layout list stays finite.
- Accessibility traps the course itself fell into, which the builder must guard: an `h3` eyebrow before its `h2`, a
  nameless icon-only button, `<sub>` for m², information shown only on hover, visual order that contradicts reading
  order (`order`, explicit grid placement, `dense`).

- `[ ]` **MUST — common on real pages, missing today**
  - `[ ]` AC-33 · **"as many as fit, each at least X rem" grids** — a card / feature / gallery grid adapts to its OWN — AUDIT 2026-10-06: not built (`auto-fit` only inside the Accordion) → G-4 (1)
    width wherever it sits, no breakpoint (`repeat(auto-fit, minmax(min(100%, X rem), 1fr))`); today only the Accordion
    uses it, grid blocks step a fixed count at the window rungs. Decide whether it is the DEFAULT for card grids; saved
    pages keep their count; how spans behave in it
  - `[x]` AC-35 · **half-bleed** — a picture runs off the window edge while the text beside it starts on the page's — AUDIT 2026-10-06: G-3b (2) "Bleed to the page edge: Off · Left · Right · Both" per screen (`f4bacbc`, closed `2515755`)
    content column (Nexter's story / header); today a band is contained or full width, and a two-cell row splits the
    WINDOW, so the text drifts from the content edge
  - `[ ]` AC-36 · **subgrid** — titles, texts and buttons line up ACROSS a row of cards whatever the text lengths; and a — AUDIT 2026-10-06: not built (no `subgrid`) → G-4 (2)
    nested grid's columns snap to the page's content columns. Ships in every current engine; never written today
  - `[ ]` AC-26 · **push / grow space in a stack** — `space-between` in a column (a sidebar's legal line at the bottom, — AUDIT 2026-10-06: PARTLY: "Spread out" (space-between) is in the Inspector; `push` is engine-only → P-1 (4)
    card buttons at the bottom), and space that GROWS between particular blocks of a fixed-height band (a hero: logo
    top, message middle, press strip bottom); the spacer block is a fixed height today
  - `[ ]` AC-3 · **height-aware sizing** — any share of the screen height (80%, 95%), with `svh` / `dvh` for phone — AUDIT 2026-10-06: PARTLY: Full / half screen = 100svh / 50svh, Height takes a typed vh; no "minus the header" → P-2
    browser bars; *Full screen* UNDER a pinned header (`calc(100svh - bar)`); spacing that shrinks on SHORT screens;
    today `screenHeight` is half / full only
  - `[ ]` AC-34 · **a box with a chosen proportion** — 16:9 hero, 2:1 band, square tiles, and grid ROWS a proportion of — AUDIT 2026-10-06: not built (aspect-ratio only for a picture's own shape) → P-2 (1)
    the column width (a mosaic gallery); `aspect-ratio` today only for a picture's own shape
- `[ ]` **BUILD (was DECIDE — all approved by the user 2026-10-02)**
  - `[ ]` AC-30 · a fixed, content-sized or bounded GRID track beside fluid ones (`20rem 1fr`, `max-content 1fr`, — AUDIT 2026-10-06: not built → G-4 (3)
    `minmax(12rem, 18rem)`) — `HAVE` in a flex row, not in a grid
  - `[ ]` AC-31 · two blocks layered in ONE grid area in the flow (caption over picture, collage), and a block running — AUDIT 2026-10-06: PARTLY: two blocks can share a grid cell by Start at column / row; no designed layering → G-5 (1)
    out of its cell over the neighbour — with a simple phone fallback (with AC-21)
  - `[ ]` AC-21 · overlapping floating pictures that reflow into a row on narrow screens (the photo composition) — AUDIT 2026-10-06: PARTLY: "Float on top" with X / Y and order exists; the phone fallback → G-5 (4)
  - `[ ]` AC-32 · dense packing (`grid-auto-flow: dense`) for galleries / bento grids of mixed spans — only where order — AUDIT 2026-10-06: not built and in NO batch (masonry's "Follow the picture" is a different thing) → added to G-4
    carries no meaning
  - `[ ]` AC-10 · **negative spacing and a nudge** — pull a section up over the one before, tuck a line closer, overlap — AUDIT 2026-10-06: PARTLY, wording stale: R-4 D2 (signed) chose no negative-margin control — overlaps by float + "Overlap the items" → G-5 (2)(5); the nudge exists (G-3b (3) Alt free, `30eee12`)
    avatars, an optical translate; today only by dragging a top edge
  - `[ ]` AC-37 · **ADDED TO THE FROZEN LIST BY THE USER 2026-10-03** ("I go with your recommendation": joins AC-10 / — AUDIT 2026-10-06: PARTLY: placement per rung and row spans built (G-3 `d83939f`, G-3b `f4bacbc` / `b97f839`); spilling out of a section, layer order, the covers-words warning → G-5
    ST-5 / AC-35 as one build; HALF-steps first, quarters later without changing anything saved) — place ANYTHING
    (a picture, a column, a whole section) at ANY point of a grid: start in the MIDDLE of column 1 and end in the middle
    of column 9, start halfway down row 1 and end in row 8 — and let it run OUT of its section, above the first row and
    below the last, over the sections before and after it. Every breakpoint keeps its own placement. Proposed how
    (session a51af34e): half- or quarter-steps as hidden finer tracks under the 12 the user sees (the stored
    colStart / colSpan / rowStart / rowSpan already exist per rung); spilling out = AC-10's below-zero outer spacing +
    ST-5's overlap across a band edge, in rem / %, from the one emitter; a layer order for what sits on top; on a phone it
    falls back into the flow unless placed at that rung; the page audit and Page check warn when it covers words;
    shown as drag on the canvas with the half-lines drawn, a Position panel (start / end, column / row, spill above /
    below) and a gallery of ready-made placements (RULE S / UI). Joins AC-10, ST-5, AC-35 — one build
    - `[>]` AC-37b ← YOU ARE HERE (NOW: BATCH E-5 — E-5c · The tablet CLOSED 2026-10-07 (HEADED 590 / 0; test:fast 3,343 + 2 fixed; vitest 4,445; E5c-1 … E5c-9; the user's E5c-2 one-row bar + More and E5c-4 the Inspector a tab below 1024) on `builder/phone-editing` — next: BATCH E-5d · The app — T4–T8 DECIDED 2026-10-07 (react-native-webview yes · one-time code · native cache + local save · deep links first · edit from day one) → its HEADED checklist first; handover of session E-5c in the SESSION LOG. Before that: E-5b · A finger drags and resizes CLOSED 2026-10-07 (HEADED 206 / 0; test:fast 3,333; E5b-1 … E5b-16) on `builder/phone-editing` — next: BATCH E-5c — research SIGNED 2026-10-07 (T1–T3; T4–T8 recorded for the app, BATCH E-5d) → change (2) THE BUILD, its HEADED checklist first; handover of session E-5b/E-5c in the SESSION LOG. Before that: research SIGNED 2026-10-06 (D1–D6, `docs/web-anatomy/phone-editing.md`), E-5a · Building on a phone CLOSED 2026-10-07 (HEADED 258 / 0; test:fast 3,312; the user's E5a-7 and E5a-16) on `builder/phone-editing` — next: BATCH E-5b (a finger drags and resizes: E5a-1 + E4-9), then E-5c (the tablet, then the app); handover of session E-4/E-5a in the SESSION LOG. Before that: BATCH E-4 CLOSED 2026-10-06 (HEADED 232 / 0; `test:fast` now runs all four screens, 3,272 / 3,272 in 12.3 min; E4-1 … E4-14, E4-9 and E4-14 → BATCH E-5) — PR #7 MERGED to master 2026-10-06 (`05c66ee`), `builder/editor-small-screens` deleted, `builder/phone-editing` cut from master — next: BATCH E-5, research first (the user's sources and mine). Before that: BATCH E-4 change (1) E3-3 done (`6042e79`); handover of session E-3 in the SESSION LOG. Before that: BATCH E-3 CLOSED 2026-10-06 (297 / 0 headed; E3-1 … E3-11, E3-3 the user's question); the tree audit DONE 2026-10-06 (`4fcf59a`, its true count heads section 1.1) — its checklist first, then spacing-gestures 12 · masonry-builder 10 · canvas-zoom 3 · text-is-reachable 1 · D3-32 the top bar one row from 1280; then E-4, then E-5 (research first). Before that: BATCH E-2 CLOSED 2026-10-06 (174 / 0 headed; 24 ledger lines). Before that: BATCH E-2 in BATCHES, on `builder/editor-small-screens` (cut from master `7494a8e` after PR #6 merged `builder/page-grid` 2026-10-06) — its checklist first, then the 37 failing specs one by one; then E-3, then E-4. Before that: BATCH G-3d CLOSED 2026-10-06 (`ec52b51`); handover of session (G-3d) in the SESSION LOG. Before that: BATCH G-3d (three changes); handover of session 49087f08 in the SESSION LOG; D-3 CLOSED 2026-10-06 (both changes). Before that: handover of session ff5dbc77 in the SESSION LOG; D-2 and D-3 (1) CLOSED 2026-10-06. Earlier: handover of session 22981e0a; BATCH G-3b and BATCH E-1 CLOSED 2026-10-05; MERGE DECIDED by the user 2026-10-05: `builder/layout-uat` pushed, the user opens and merges the pull request, then the branch is deleted and `builder/page-grid` cut from master; next there: BATCH D-2 (the Docusaurus site + the layout documented from the beginning, RULE DOCS), then BATCH G-3d (the user's two decisions), then BATCH E-2 (resizing and dropping on tablets and phones); before the PR: the artifacts and the layout story for the page grid; then its final pass, then BATCH E-1; handover of session 3da81fad in the SESSION LOG; earlier: handover of session 5da86722 in the SESSION LOG — G-3 CLOSED 2026-10-04 (63 headed checks, G3-8 carried to G-3b by the user); earlier: BATCH G-3 · placing on columns AND rows — G-2 CLOSED 2026-10-04 (134 headed checks); P-0 CLOSED 2026-10-04 (R4-1 … R4-5 fixed, 30 headed checks); R-4 SIGNED with D1–D5 (session 9fa0fee9); then G-3, P-1, P-2, G-4, P-3, G-5, G-6. G-1 CLOSED 2026-10-04 (see BATCHES). Plan APPROVED 2026-10-04 with the user's decisions below. Earlier: research R-3 DONE and SIGNED 2026-10-04
      (`ff5c53a`, `4418202`); build to every decision recorded under R-3 below; the mockups settle the open three (row
      snap · the phone gap 11 vs 16 px · panel per site or per page) → the user's approval → build) · **THE PAGE GRID — DECIDED by the user 2026-10-03: done RIGHT AFTER L-4 closes, BEFORE L-5, L-6 and the
      frozen list's placement items** (they are built on it). NAMES (decided): "page grid" in code and docs; the lines a
      user sees while placing are "layout guides" (shown while placing / dragging, a toggle keeps them on); the block
      stays "Grid" and is MAPPED onto the page grid by the builder (3 across = each cell spans 4 of 12; a count twelve
      does not divide keeps its own equal columns inside its span). MUST FOLLOW (the user, 2026-10-03): every breakpoint
      (the five-rung ladder, rule 18), every device preset, responsive throughout (rule 16: fluid, rem / %, container
      queries) — proposed: the page grid's column count per rung (phone 4 · tablet portrait 8 · tablet landscape and up
      12, halves throughout), every span mapped per rung, nothing narrower than its words, measured in the Preview at
      every rung and preset (RULE Z / Q). CONTENT DECIDES THE SPAN, NEVER THE GRID (the user, 2026-10-03: "let's not let
      the content determine what the grid will be, let the content determine how many [columns] it would use, and then use
      that to do the breakpoints"): a cell whose words need more room SPANS more page-grid columns (per rung), the page grid
      never changes shape; c-8's `longestWordRem` is the input. L-4's narrowing (the grid steps its count down) stays for
      grids built the current way and pages already saved. Was proposed by the user ("instead of
      trying to fit the component in a grid… the grid is the column"): ONE grid per page/section — 12 (or more) columns
      and rows across the whole page — and every component SPANS as many columns as it needs ("if it doesn't fit in one
      column it can fit another"), like Nexter (`08-nexter.md`: the body as one grid, `minmax(6rem, 1fr)` gutters + eight
      `minmax(min-content, 14rem)` columns, named lines for centred / full-bleed / HALF-bleed). Session a51af34e's view:
      the stronger model — alignment across sections for free, placement and bleed (AC-35 / AC-37) become start/end
      LINES, "never narrower than its words" is the column's own `min-content`, nested components use the page's lines
      through `subgrid` (AC-36). Costs: a phone needs a span per rung (stored already), a span chosen by content needs
      the model's word estimate (c-8's `longestWordRem`), saved pages keep their rows / stacks (a mode, never a
      migration). NEXT: research (Nexter + Webflow / Framer / Wix Studio page grids, RULE RS) → plan artifact with mockups
      → the user's approval → built WITH AC-37 (one build). Not part of L-4
      - `[>]` WHAT IS LEFT UNDER AC-37b (the tree audit 2026-10-06; this line keeps the parent honest — it closes when they do): the editor on small screens: BATCH E-4 CLOSED 2026-10-06, E-5 next (research first) · the page grid's queued P-1 · P-2 · G-4 · P-3 · G-5 · G-6 (all in BATCHES)
      - `[x]` **THE USER'S DECISIONS ON THE PLAN, 2026-10-04 (session 87422eae) — APPROVED ("1, yes please")**:
        (1) plan approved, and the page grid runs **EDGE TO EDGE** (the user: "a user should be able to use the whole page…
        the margin at the right and the left should not be there unless the user wants it… use margin or padding to make
        space") — SUPERSEDES "margin | columns | margin, columns stop at ≈ 1280": the template is just the columns; the side
        space is SECTION PADDING (default ≥ 0.8 rem, fluid, overridable to 0, each side alone); a block can be dragged to
        the far left / right; bleed = start on the first line / end on the last line over the padding; guides draw the
        padding AS padding, not as a no-go margin · (2) row snap OFF, rows follow the content; and **EVERY block, component
        and item keeps a DEFAULT MARGIN AND PADDING** so nothing sits flush against a neighbour ("we did talk about that…
        the very minimum, just remember that" — CLAUDE.md rule 3, space by default) · (3) the phone gap floor, the user
        asked me to TEST 1 rem vs smaller and decide: MEASURED on a 360 px phone, 3 gaps × 3 side spaces, at 100% and
        150% text (headed, screenshots read): 0.6 rem = stat tiles nearly touch, 1 rem = cards squeezed, **0.75 rem
        chosen**; side 0.6 + gap 0.75 put words 0.97 rem from the edge (under the audit's 1 rem floor), **side 0.8 rem
        chosen** → words 1.18 rem from the edge; for page-grid blocks only, saved pages keep their spacing · (4) ONE grid
        per SITE, a page may opt out · (5) Alt = free placement, Shift = half-lines, and a **MUST: free placement never
        breaks the page** — a free block keeps its default margin and padding, never overlaps or pushes the page sideways
        (the partner gives what it takes, rule 19; the row wraps, never squeezes), follows every rung by the same fit
        rule, and switching back to snap keeps everything else the person set (Undo returns the free width); the page
        check warns on what still looks wrong · (6) readable width ON by default for text (≈ 75 characters), with the
        small default side space above · (7) **EVERYTHING above at every breakpoint, every screen size and device preset,
        in every module, under every rule** (rules 16 / 18, RULE AF, Z, Q, WCAG). Plan v2 republished with all of it
      - `[x]` PLAN ARTIFACT WITH MOCKUPS — v1 PUBLISHED 2026-10-04 (session 87422eae), v2 APPROVED the same day:
        https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN (source: `docs/web-anatomy/page-grid/plan/page-grid-plan.html`;
        republish it to the same URL). Holds: the plain-words story · the decisions it builds to · a live school page (hero with
        half-bleed, news 4/12, stats 3/12 kept 2 across on phones, staff, bento gallery, straddling admissions card,
        footer) at 360 / 768 / 1280 drawn with the real page-grid CSS, guides on/off (G), row lines, phone gap 11/16,
        picture first · the toolbar switch (Shift G) + the page-grid panel with proposed ranges · snap / Shift half-lines /
        Alt free + keyboard · "Line up with the grid" · the Grid block on page lines · purpose picks · bleed / straddle /
        half-step · the THREE OPEN CHOICES with recommendations (row snap A = off · phone gap B = 16 px floor for page-grid
        blocks only · panel A = per site, page may opt out) · the engine table (extended, not replaced) · six batches.
        - LEDGER (this session): #1 `[x]` SPEC CLASH, not code — the map's Q3 put half-lines on Alt; the user's "best of
          both worlds" put FREE placement on Alt, and today's canvas already lifts a block free on Alt+drag
          (`BoxCanvas.tsx` `startDrag`). Proposed in the plan: Alt = free, Shift = half-lines (Shift unused during resize
          drags). CLOSED 2026-10-04: the user agreed (Alt = free, Shift = half-lines)
        - QUEUED BATCHES (open one at a time after approval; full checklists written into BATCHES when each opens):
          `[x]` G-1 (CLOSED 2026-10-04, see BATCHES) the page grid in the engine (PageGrid settings · one template emitter, columns EDGE TO EDGE with middle
          lines, zero grid gap, side space as section padding ≥ 0.8 rem, block gap ≥ 0.75 rem, readable width, safe area · share↔column maths · fit-based re-split as em container queries · canvas = export ·
          enumerating guards, saved pages byte-identical) · `[ ]` G-2 layout guides + grid panel (switch, Shift G, menu ·
          overlay from the same template · span labels · panel per rung · everything follows in one undo · page override) ·
          `[ ]` G-3 placing (column snap, edge-anchored · Shift half-lines · Alt / per-block free · Position panel start /
          span per rung · keyboard · "Line up with the grid") · `[ ]` G-4 Grid block + splits + purpose picks (page-line
          mapping · subgrid fallback · six one-click splits gallery · purpose picks · picture first · orphans keep span +
          hidden picture not downloaded, G7) · `[ ]` G-5 bleed / straddle / sticky (reaches · overlap + layer order · no
          clipping ancestor · sticky cell · page check covers-words warning · placement gallery) · `[ ]` G-6 close-out
          (layout-story chapter · guide + Hub / Layout System artifacts · dressed sweep re-run · low-cost Android + Slow 3G)
      - `[x]` R-3 · PAGE GRID RESEARCH (RULE RS + RULE MAP), session e9d19b5c, 2026-10-03 — SIGNED 2026-10-04. Runner:
        `scripts/research/grid-measure.js` (six headed windows; each item opened, its live site followed and measured at
        1440 · 1024 · 768 · 375: CSS grids, subgrid, named lines, framework column classes, gutter, full-bleed, and how
        many visible left edges sit on a 12-column half-step). Raw: `C:\Users\eyite\educo-research\grid\` (outside git)
        - `[x]` THE USER'S SOURCES — completeness list (RULE R: nothing in a link is left out) — AUDIT 2026-10-06: read in full, R-3 signed 2026-10-04 (`ff5c53a`)
          - `[x]` (1) awwwards.com/inspiration/grow-section-12-column-layout-thirdweb-studio-1 — the item (a11.studio, — AUDIT 2026-10-06: 35 records stored (`ff5c53a`)
            thirdweb.studio; tags grow · benefits · bootstrap · layout · 12column), its 3 sibling items (projects layout,
            navbar menu, about us) and 7 related items (punchline bento grid, Street Art News magazine, Arthur Simonini
            typography, dobrynow layout, timbrack one-page scroll, PP Fragment characters, saintlouvent portfolio) — all
            11 queued, each followed to its live site; their own on-topic related items followed one level (--follow).
            Read by hand first: the grow section is Bootstrap 5 + flex, NOT a CSS grid — three equal columns (4 of 12
            each: tabs · photo · words, 393 px of a 1194 px content box inside an 8vw gutter); the heading does NOT sit on
            the same left edge (67 px vs 115 px); on a phone (375) it stacks, the PHOTO IS HIDDEN, gutter 8vw = 30 px;
            a decorative SVG of square modules sits above it
          - `[x]` (2) dribbble.com/search/12-column-grid — 42 shots load signed-out (the listing stops there); all 42 — AUDIT 2026-10-06: all 42 shots stored (`ff5c53a`)
            queued, each opened: description, tags, images, any link in the description followed
          - PASS 2 (`r3-v2.json`, 454 pictures): 80 items — the user's 53 + 27 on-topic related items one level down.
            Dribbble showed "Human Verification" after ~20 shots → stepped back (never bypassed), the other 21 re-run in
            ONE window paced 20 s. Not measurable, MEASURED: `frame-opti` (Awwwards' own link is `https://frame-opti`),
            `carltonvilla.com` (domain gone — Google DNS cannot find it). Reading: `02-awwwards-items.md`,
            `03-dribbble-shots.md` (agents read every picture). Mine: `01-builders-and-systems.md` (15 axes) done
          - LEDGER R-3 (all in `grid-measure.js`, the research runner — none in the builder):
            #1 `[x]` no live site when an Awwwards item has no "Visit" label → web-address link + its /sites/ page ·
            #2 `[x]` an item measured twice by two windows → marked seen when taken · #3 `[x]` Dribbble designs cut off /
            not loaded → every image captured whole · #4 `[x]` cookie banner over the captures → answered (button, link
            or text; re-opened once) · #5 `[x]` own-scroller sites measured on one screen → wheel, 8 screens each ·
            #6 `[x]` --follow chained without end → one level · #7 `[x]` a shot's own `colors.aco` download followed as a
            related shot → only OTHER items · #8 `[x]` a site that navigates itself → one retry · #9 `[x]` a related
            item's video filmed as the item → the top carousel `.gallery-element__media` only · #10 `[x]` media lost when
            the live link is on the /sites/ page → captured first · #11 `[x]` Dribbble "Human Verification" → detected,
            host stepped back; the 21 re-run in one window paced 20 s: 41 of 42 captured, 0 challenges ·
            #12 `[x]` live captures missed scroll-revealed sections (Thirdweb projects black), a loader (Grégory Lallé — a
            clear fixed layer over a white panel fading at ≈12 s; re-opened twice), pop-ups (Street Art News "Consent")
            and stopped at 7000 px → screen-by-screen shots as a visitor scrolls, a loader wait over every fixed layer,
            consent / close buttons; each fix seen in the picture · #13 `[x]` 404 pages measured as the site (Saint
            Louvent ×2, Igor Sokoltsov) → status + title checked, recorded `deadPage` · #14 `[>]` Dribbble images caught
            mid-transition (5 blank / faded) → the image FILE downloaded · #15 `[x]` the first download fix stopped every
            shot at 1 image (228 → 43) — part one: a srcset holds commas inside its URLs, the parser built a 404 → the
            image's own address + `?resize=1600x1200` · #16 `[x]` ECC's newsletter pop-up in a HubSpot iframe → every frame
            searched, Escape last; seen gone in the picture · #17 `[x]` long pages cut at 12 screens (Aqua Dev footer, Street
            Art News lower grids) → 45 (30 still cut Street Art News' phone at 38) · #18 `[x]` a parked / redirected domain
            measured as the site (Ceram → parking host, AliExpress at 375) → host checked at every width + parking text ·
            #19 `[x]` THE REAL CAUSE OF #15: the pop-up closer's bare "x" clicked Dribbble's X (Twitter) link and LEFT the
            shot after its first image → no bare "x", close controls only inside an open dialog, a click that leaves the
            page is undone; Norway shot 6 of 6 images. #14 closes when the final paced pass matches pass 2's counts
          - The "Across all 35 records" summary in 02 corrected after the v3 re-read (Punchline's bento a real 12, Street Art
            News' rail drops under rather than hides, Thirdweb no Bootstrap columns, Klimov a % frame, Ceram parked)
          - Reading (agents, every picture opened): `02-awwwards-items.md` — all 35 Awwwards records, groups 0–4, 232 images;
            `03-dribbble-shots.md` — 21 shots, 102 images. Final capture pass v3 (`r3-v3-aw.json`, `r3-v3-dr.json`) running:
            then the 21 later Dribbble shots + the Awwwards records whose live captures were blind (#12) are read again
        - `[x]` MY SOURCES — Nexter (`08-nexter.md`, extend only) · `07-grid.md` · MDN grid / subgrid / named lines · — AUDIT 2026-10-06: read and stored as 01 · 05 · 06 (`ff5c53a`)
          Webflow · Framer · Wix Studio page grids · Figma layout grids · Material 4/8/12 · Bootstrap · GOV.UK · the
          design deck's responsive part · the real-site crawl (`docs/layout-benchmark/`): how many real pages align
          to one page-wide column grid
        - `[x]` MINE (part): `01-builders-and-systems.md` (Webflow · Framer · Wix Studio · Figma · Material · Bootstrap ·
          GOV.UK · MDN, 15 axes) · `05-crawl-splits.md` + `scripts/research/grid-splits.js` (23,728 rows of the 4,250-page
          crawl: 66% land on whole 12ths, 38% on 8, 36% on 4; 32 splits = 80%; 6+6 · 4+4+4 · 5+7 · 4+8 · 3+3+3+3 · 3+9 ≈ 57%)
        - `[x]` THE MAP — DONE (`ff5c53a`; the enough checklist signed 2026-10-04) — `04-map.md`: 24 axes (A1–A15 + A16 stagger · A17 empty cells · A18 layers · A19 sticky cells ·
          A20 published grid lines · A21 outer-margin content · A22 phone strategy · A23 sideways strips · A24 interaction,
          out of scope), every value with its CSS, who uses it, CORE / LATER / AVOID; gaps G1–G11; the enough-checklist draft
          - **THE USER'S DECISIONS, 2026-10-03 (from the evidence):** (Q1) columns **6 on the phone · 12 from 600 px** — NOT
            4 / 8 / 12 (no site or design uses 4 / 8; on 8 only 3 of the 6 core splits stay exact) · (Q2) the phone STACKS,
            except by PURPOSE — Stats, Logos, Gallery, Table keep 2–3 across, an option on any grid, the 360 px word minimum
            always wins · (Q3) half-steps IN THE MODEL, snapping to WHOLE columns by default; half-lines with a modifier key or
            the Position panel; no quarters · (Q5) phone order = PAGE ORDER, one switch per split "On phones: picture first";
            zig-zags by placement, not reordering · (Q4, mine — technical) every band re-declares the page template from
            the one emitter; only a nested container on page lines uses `subgrid`, its own equal columns as the fallback
          - `[x]` **THE "ENOUGH" CHECKLIST — SIGNED BY THE USER 2026-10-04 ("I'm happy with the plan. Let's proceed.")**
            (RULE RS / RULE MAP; detail in `page-grid/01`–`06`). NEXT: the plan artifact with mockups → approval → build:
            - `[x]` MAP: 24 axes, every value with its CSS, who uses it, CORE / LATER / AVOID (`04-map.md`)
            - `[x]` THE USER'S SOURCES read completely: the Awwwards link (35 records, its siblings, related items one level
              down, every live site at 4 widths, 260 + 232 pictures) and the Dribbble search (all 42 shots, 228 images +
              1 video; the listing serves 42 signed-out) — `02`, `03`
            - `[x]` MINE: Webflow · Framer · Wix Studio · Figma · Material · Bootstrap · GOV.UK · MDN (`01`); the crawl's
              23,728 desktop rows (`05`) and 300 pages at tablet + phone (`06`)
            - `[x]` SATURATION, measured: 0 new axes in the last ≈ 55 items; 0 new values in the last 15; the tablet / phone
              shares moved ≤ 5 points from 200 to 300 pages
            - `[x]` AN EXAMPLE PER CORE VALUE, proven in a browser: `examples/index.html` 972 / 972 (10 widths × 100 / 150 /
              200 % text), twice clean
            - `[x]` THE COMBINATIONS: `examples/combos.html` — random column counts 6–24 × phone counts × row steps × widths ×
              text: 261 / 261; the cross-axis cases (bleed + split + content minimum + re-split + subgrid + RTL) in one page
            - `[x]` THE USER'S DECISIONS: 6 / 12 columns · fit-based re-split on every rung · half-steps in the model, whole
              by default · page order + "picture first" · zero grid gap (blocks space themselves, builder spacing) · margins
              + columns cover the whole width, rows the whole height · invisible in the editor, a "Layout guides" switch
              OFF by default · an advanced panel (columns, row step, gutter, margin), everything following automatically
            - `[x]` NOT COVERED — open for the plan mockups, not research: the ROW STEP (snap or not; 1.5rem proposed) · the — AUDIT 2026-10-06: decided in the approved plan: row snap off, gap 0.75rem, side 0.8rem, one grid per site (`5b1c7ee`)
              phone gap (11 px builder vs 16 px norm) · per SITE or per PAGE for the panel, and its ranges
            - `[ ]` NOT COVERED — real-world, left for the build's UAT (RULE AF): a low-cost Android WebView (subgrid needs — AUDIT 2026-10-06: → BATCH G-6 (queued)
              Chrome 117+; the fallback is the block's own equal columns — proven in the examples), a screen reader on the
              re-ordered phone ("picture first"), 360 px at Slow 3G
            - `[ ]` NOT COVERED — people: pilot-school feedback (RULE RK), none yet; the crawl's school pages are inside 05 / 06 — AUDIT 2026-10-06: open: the pilot schools (RULE RK), none recruited yet
              but not studied apart
          - `[x]` the stop rule (proposed: the 21 unread Dribbble shots + G9 / G10, ≥ 30 items in a row adding no new axis
            and no new CORE value) — MET: the 21 shots added 0 axes and 0 CORE values (≈ 55 items in a row); G10 answered
            by `06-rungs.md`; G9 (alignment across sections) answered by the live sites in `02` (9 of 26 run one grid
            through the page) — the 21 shots being read (full-resolution capture v3, 228 / 228 images) ·
            `[x]` step 2 an example per CORE value: `page-grid/examples/index.html` (6 / 12 columns with a middle line in each,
            margins as named tracks, the 6 one-click splits, offset + empty column, inset 8, a half-step, the words-decide
            span, 5 across, logos, full / block / half bleed, straddle, inset hero, subgrid, sticky cell, stats keep 3,
            hide on phone, page order / picture first, bento, orphans keep span, RTL, layout guides with ROW LINES every
            1.5rem). Proven by `scripts/research/page-grid-examples.js`: **972 / 972 checks, 10 widths × 100 / 150 / 200 %
            text, six headed windows**, pictures read (12 even columns at 1280, 6 at 375, half-bleed to column 6)
          - FINDING (#24): the content minimum must survive the reader's text size, so the EXPORT writes, per row, an
            `em` container query measured from the words at build time ("below N em → 2 across → stacked") — no script on
            the published page; proven at 200 % text. A word longer than the whole screen wraps as the last resort (#23)
          - **THE USER'S DECISION, 2026-10-03 — THE PAGE GRID IS INVISIBLE IN THE EDITOR TOO** (supersedes "layout guides shown
            while placing / dragging" above and AC-37a's lines on the canvas): the editor looks as it does today; the page
            grid works only in the background (blocks still land on it, snap to it and wrap by it). One switch, "Show layout
            guides", OFF by default, in a menu — for checking alignment and for testing. Never on the published page.
            **…AND AN ADVANCED PAGE-GRID PANEL (the user, 2026-10-03: "turn it on to see what it is… which one you're using…
            reduce the column or increase the column and increase the row, reduce the row… for advanced")**: with the guides on,
            the builder shows the grid in use and lets the user change the COLUMN COUNT (default 6 phone / 12 from 600 px),
            the ROW STEP (default 1.5rem), the gutter and the margin. Placements are stored as a SHARE of the page (half
            stays half when 12 becomes 10 or 16), so a count change never moves or loses a block; the content minimum still
            applies. Open for the plan mockups: per SITE or per PAGE, and the allowed ranges. Joins RULE UI (everything
            built is in the builder to play with). **EVERYTHING FOLLOWS, AUTOMATICALLY, PER BREAKPOINT (the user,
            2026-10-03):** every block's start / span (columns) and row start / span re-derived from its stored share when
            a count or the row step changes — canvas and export alike, nothing for the user to do; each rung has its own
            count (default: the phone gets half the desktop count, 12 → 6, 16 → 8; or set per rung); the em breakpoints of
            the content minimum (#24) re-measured on every change. Limits told to the user: a split a count does not divide
            (3 across on 10) rounds to the nearest whole column or keeps its own equal columns inside its span; the words
            still win (a block takes more columns or the row wraps). `[ ]` PROOF: the example checker extended to RANDOM
            column counts × row steps × every width × 100 / 150 / 200 % text (RULE MAP step 3)
          - **BEST OF BOTH WORLDS (the user, 2026-10-04: "have it do exactly what was done before… the best of both worlds")**:
            the grid sits ON TOP of today's model — placements were already stored as SHARES, so nothing is replaced.
            (1) SNAP by default; FREE placement as today (any width, e.g. 37%) by holding **Alt** while dragging, or a
            per-block "Free placement" switch that keeps it free; free blocks still follow every rung (the same fit-based
            re-split). (2) Pages saved before the grid keep their widths; an optional one-click, undoable "Line up with the
            grid" per page. (3) The engine is EXTENDED, not replaced: named lines, snapping, the fit-based re-split and the
            advanced panel are added to the existing shares, spacing and ladder
          - **THE PHONE DEFAULT — DECIDED AGAIN BY THE USER, 2026-10-04 (supersedes Q2 "stack, except by purpose"),
            from `06-rungs.md`** (300 crawled pages re-measured at 768 / 375, `skeleton.js --widths`, saturated: rows of 4
            and 5+ go to FEWER across on phones 47–61% of the time, more often than they stack): **FIT-BASED** — on every
            rung a row that cannot keep its shares becomes the most EQUAL columns whose words still fit (4 → 2 → 1; the
            engine's re-split, ledger #28), never a staircase; always overridable per view
          - **THE GAP — DECIDED AGAIN BY THE USER, 2026-10-03 (supersedes the line below): the page grid has ZERO gap by
            default** — it is a pure divider of the page (exact fractions: 6 of 12 is exactly half; half-steps and count
            changes exact). The even space between neighbours comes from the BLOCKS: each placed block keeps half the
            default spacing (`SPACE_DEFAULT.columns`, 16 in `u()`) on each side — which is what the engine already does
            today (`gutterCSS`: a column's slot is its share and gives up one gap). The advanced panel can still add a grid
            gap. Superseded: "the page grid HAS a gap between its columns, settable down to 0 in the
            advanced panel (a mosaic)." `[x]` PROVEN on the examples: grid gap 0, every block's SLOT (box + its half
            spacing) on the lines, bleeds with no spacing on their window side — 972 / 972 twice in a row, 261 / 261
            random; picture read (no gap strips; even space between blocks, centred on the shared line). LEDGER #31 `[x]`
            the subgrid check compared a slot with a bare box · #32 `[x]` a phone half-bleed kept half a space on its right
            · #33 `[x]` FLAKY: the row-line height came from a ResizeObserver Chrome holds back in a hidden window → set
            at once on resize too, the checker waits two frames · #34 `[x]` a Dribbble VIDEO shot (Pickle) captured as 0
            frames — the video sat outside `<main>` → any big video, three frames · #35 `[x]` two dead variables in the
            checkers (eslint) — removed, both proofs re-run clean Its default is the builder's EXISTING spacing — `SPACE_DEFAULT.columns` (16) and the
            side gutter `SPACE_DEFAULT.gutter` (32) in the fluid unit `u()` / `--box-u` (`lib/box-model.ts`): column gap
            ≈ 11 · 18 · 22 px and side margin ≈ 22 · 36 · 45 px at 360 · 1280 · 1920 — ONE set of numbers, never a second
            (`[x]` the examples now use them: `--box-u` × 1.6 / × 3.2 — 972 / 972 and 261 / 261 checks still pass).
            `[x]` STEP 3 (part): `examples/combos.html` + `scripts/research/page-grid-combos.js` — RANDOM column counts
            (6–24) × phone counts × row steps (1–3rem) × 10 widths × 100–200 % text, every block placed from its stored
            SHARE by the engine: 261 / 261 checks; the guides restyled FAINT the Chrome-overlay way (the user: dashed
            column edges, hatched gaps, dotted rows, no fill). LEDGER #28 `[x]` the engine wrapped block by block →
            staircases and a lone shifted block (seen only in the picture) → a row that cannot keep its shares re-splits
            as a whole into k EQUAL columns; a bento stacks · #29 `[x]` the checker checked the first row only → every
            row: shares kept, an even re-split, or stacked · #30 `[x]` the checker looked for the row pattern where the
            restyle had moved it OPEN for the mockups: the phone column gap
            11 px vs the 16 px research norm (Material, most sites) — both shown side by side
          - **WHAT THE GRID COVERS (the user, 2026-10-03, confirmed):** the WHOLE width as one grid — margin | 12 columns
            (6 on the phone) | margin; words stay inside the columns, pictures may bleed into the margins to the edge; above
            ≈ 1280 px the columns stop growing and the margins grow (readable lines, Rule #1 ~75 characters). The rows run
            the WHOLE height of the page (the full document, not one screen)
          - THE USER, 2026-10-03: "rows too, not just columns?" — columns fixed per page (6 / 12); rows are content-sized
            bands, placed by row start / span; the ROW STEP (proposed 1.5rem, every 4th stronger) is drawn in the guides
            and is an OPEN DECISION for the mockups (blocks do not snap to it yet — seen in the pictures). The guides are
            NEVER published and show only while placing, or with the switch / G (confirmed to the user)
          - LEDGER (examples, all `[x]`): #20 `span calc()` invalid + `100vw` counts the scrollbar · #21 two line-name groups
            touching made the WHOLE template invalid (dropped silently) → merged groups · #22 the label counted as child 1 +
            an inline style beat the phone rule · #23 a word wider than a 360 px phone at 200 % → last-resort wrap · #24 the
            content minimum at 200 % → em container queries · #25 the 2-across rule beat the phone stack → from 600 px only ·
            #26 the row lines stopped short (scrollHeight counted the guides) → followed from `main` · #27 the checker
            measured hidden guides · `[ ]` step 3 the
            combinations proven in a browser · `[ ]` taste / real-world (low-cost Android, 150–200% text, RTL, a screen
            reader) / school + regional sites · `[ ]` the "enough" checklist signed by the user
    - `[ ]` AC-37c · **CHOOSE BY PURPOSE, THE BUILDER PICKS FLEX OR GRID — proposed by the user 2026-10-03** ("a user can — AUDIT 2026-10-06: → BATCH G-4 (5) (queued)
      select a section as a grid or as a flexbox… a menu would use a flexbox… it won't be called grid or flexbox in
      front of the user"). Already there: Stack = flex column, Side by side = flex row, Grid = CSS grid, and the
      Inspector's "Arrange as". Session a51af34e's view, given to the user: not one choice per SECTION — every level
      nests (section on the page grid → a flex line for a menu, a grid of cards, each card a flex column); people pick
      by PURPOSE (Menu → a real `nav > ul > li` flex line that wraps / becomes a burger · Cards → a grid of flex
      columns · Logos → a wrapping flex line · Photo beside words → two page-grid columns) and the raw choice stays
      in the Inspector under friendly names (Line up / Grid). Part of the page-grid plan and its mockups (AC-37b); the
      menu itself is the Navigation component, waiting on its own approved plan (RULE C)
    - `[ ]` AC-37a · the canvas interaction, PROPOSED to the user 2026-10-03 (not yet a plan to approve): the 12 × 12 lines — AUDIT 2026-10-06: PARTLY built (snap, half-lines, Alt arrows, guides — G-2 / G-3); spilling into a neighbour, the covers-words outline and the Position gallery → BATCH G-5 (queued)
      (halves dotted) and a ruler appear only while a block in a grid is selected or dragged · drag the body to move, the
      edge handles to resize, both snapping to half-lines, with a live "column 1½ → 9½ · row 1½ → 8½" label · drag past
      the band edge and the lines carry on into the neighbour, which dims; the label says "spills 1½ rows into the section
      above" · a red outline when it would cover words · Bring forward / Send back (Ctrl+] / Ctrl+[) · arrows nudge half a
      column, Shift+arrows a whole one · a Position gallery of ready-made placements, one click then drag to adjust ·
      the rung being edited is named ("Tablet only"); on a phone it falls into the flow unless kept. BEFORE BUILDING:
      research how Webflow, Wix Studio, Framer and Figma do it (RULE RS), then a plan artifact with mockups → approval
      (rule 13)
  - `[ ]` AC-27 · stretch ONE block to the full height of a line / cell whose others are centred — AUDIT 2026-10-06: PARTLY: a grid cell's "Line up (across): Fill"; Down Fill → P-1 (1)
  - `[ ]` AC-25 · `space-evenly`, `baseline` alignment, and `align-content` for wrapped lines in a fixed-height band — AUDIT 2026-10-06: not built (start / center / end / between / around only) → P-1 (3)
  - `[ ]` AC-9 · ONE site-wide content width, set in one place (with AC-35) — AUDIT 2026-10-06: PARTLY, wording stale: the edge-to-edge page grid replaced the capped column; side space set once in the page-grid panel (G-2, G-3c)
  - `[ ]` AC-2 · a page frame (a border round the whole page, off on narrow screens)
  - `[ ]` AC-5 · content placed at 40% from the top rather than the exact middle
  - `[ ]` AC-1 · a hero edge cut on a screen-height measure, not a % of the band
  - `[ ]` AC-8 · text wrapping round a picture (float) and round its shape (`shape-outside`)
  - `[ ]` AC-17 · a background video for a section (with RULE AF weight limits)
  - `[ ]` AC-19 · one text flowing through several columns; one `ul` in two columns; blocks read DOWN each column then
    across (an A–Z directory)
  - `[ ]` AC-22 · responsive images — several sizes per photo (`srcset` + `sizes` computed from the layout), art
    direction (`<picture>`) (RULE AF / page weight)
  - `[ ]` AC-23 · browser baseline — the newer features the export uses checked against the real audience's phones, — AUDIT 2026-10-06: PARTLY: @supports used for overflow clip and scroll timelines; no audience-phone audit, no minifier
    each with a fallback reset inside `@supports`; the generated CSS minified
  - `[ ]` AC-29 · see the grid while editing — an overlay of a selected grid's tracks and gaps on the canvas — AUDIT 2026-10-06: PARTLY: the page grid's guides (G-2 `ca5eefe`); a selected Grid block's own tracks are not drawn
  - `[ ]` AC-4 · one heading in two styled lines (main + sub) — or an `hgroup` with an eyebrow
  - `[ ]` style by grid row / column (zebra rows, a bold first column) — the builder knows each block's row and column
- `[ ]` **CHECK — lines for the next HEADED UAT, not features**
  - `[ ]` the inspector offers DIRECTION, ORDER and PLACEMENT at one rung as plainly as *hide* (a sidebar → top bar; icon — AUDIT 2026-10-06: PARTLY built (P-0 R4-3 `9018368`, G-3 Columns per screen); direction per rung not checked
    above its label on a phone; text before pictures on a phone)
  - `[ ]` a deliberately EMPTY grid cell can be made through the UI and later blocks do not flow back into it
  - `[ ]` a full-width grid cell STAYS full width when the column count changes 3 → 4
  - `[ ]` one alignment for ALL blocks of a selected grid (what *Line up* writes on a grid)
  - `[ ]` a stack whose width is its content's widest line ("Fit" on a container), placed in the centre
  - `[ ]` the semantic audit flags an `h3` placed before its `h2` (an eyebrow) and offers the fix
  - `[ ]` a footer / menu list of links publishes as `nav > ul > li > a`
  - `[ ]` *Full screen* — what it writes today (`vh` or `svh`, minus a pinned header or not) — AUDIT 2026-10-06: ANSWERED from the code: 100svh / 50svh with max() of the block's minimum, never minus a pinned header (box-model.ts); still to be seen headed
  - `[ ]` every picture path emits `aspect-ratio` or `object-fit` — a catalogue-enumerating guard so no photo can stretch
- `[ ]` **LATER — not layout; moved to 1.3 (components / motion / typography) when the layout closes**
  - `[ ]` motion: AC-6 easing / delay / repeat · AC-7 halo hover · AC-12 group hover · AC-18 sweeping fill · AC-24 hover
    keyed to input (`(hover: hover)`), reveal on touch and focus
  - `[ ]` style / typography: AC-11 gradient text · AC-14 blend modes · AC-15 `box-decoration-break` · AC-16 image
    filters · AC-20 hyphenation · AC-28 custom coloured list markers
  - `[ ]` components: AC-13 flip card · Button variations (inline / link button, sliding two-label) · Card (listing card,
    subgrid-aligned parts) · Quote / Testimonial (`figure` + `blockquote` + `figcaption`, quote mark) · Logo strip ·
    People / Team list · Avatar group · Divider with a label · Navigation menu button · Gallery (mosaic layouts) ·
    data-bound list (unknown length, empty / loading states)
- `[x]` **The user's own layout list** — approved to add (user, 2026-10-02: "group four let's do that as well"); add line by line as the user sends them — AUDIT 2026-10-06: 1.1.5 was frozen and signed 2026-10-02; its one entry (sticky / fixed, below) is GROUP 3
  - `[x]` **Section transitions · animation · `position: sticky` · `position: fixed`** (the user, 2026-10-01: "mainly — AUDIT 2026-10-06: research DONE (`186dec5`, R-1 closed `fe320f5`); the build is BATCH S-2 (transitions) and the SP lines below
    for layout", components second). The user sends links, each a different way of doing it. For EACH link: study it
    (and expand online, RULE R), store it distilled in `docs/web-anatomy/scroll-and-position/`, mark every technique
    HAVE / PARTIAL / GAP against the builder (pins, floats, `pinArrival`, entrances, the motion tokens and
    reduced-motion fallbacks already exist), and put every GAP into this list (MUST / DECIDE / CHECK / LATER) with its
    description. More links still coming from the user.
    - `[x]` Studied 2026-10-02: CodePen tags sticky-header + fixed-position (47 pens, 22 techniques —
      `scroll-and-position/01-codepen-sticky-fixed.md`), mimo `position: sticky`, Awwwards "Sticky elements" (petro.design
      measured) — `scroll-and-position/README.md`. Two findings VERIFIED in the code (not just reported)
    - `[ ]` SP-1 · **MUST · a sticky page header covers anchor targets and the focused control** — `scroll-padding-top`
      is set only for a FIXED bar (`pinPaddingNeeded`, deliberately); a sticky header that has stuck hides `#section`
      jumps and Tab focus below the hero (WCAG 2.4.11). Needs a padding that follows the stuck bars (`--eu-pin-above`)
    - `[ ]` SP-4 · **MUST · rounding or clipping a section silently kills every pin inside it** — the export writes
      `overflow: hidden` for `clip` or any radius (`box-export.ts` ~393); `overflow: clip` clips without breaking sticky.
      The editor must also say why a pin does not stick (`pinBlockedBy`)
    - `[ ]` SP-2 · DECIDE (leaning MUST for phones) · **hide on scroll down, show on scroll up** ("smart header") — gives
      back ~10% of a 360×640 screen; must reappear on focus and at the page end, snap under reduced motion, a few inlined
      lines, never a library
    - `[ ]` SP-3 · DECIDE · `pinArrival` timed to the moment the bar STICKS — it runs from scroll 0, so a nav that sticks
      lower down (under a hero) has finished its arrival before it sticks
    - `[ ]` SP-5 · DECIDE · a scrollable box (max-height + overflow auto) with sticky group headings inside
    - `[ ]` SP-7 · DECIDE · a stay-behind layer — content scrolls OVER a held hero (`pagePinCover` always paints the
      pinned band on top)
    - `[ ]` SP-8 · DECIDE · a tall sticky sidebar that scrolls inside itself (`max-height: 100dvh; overflow-y: auto;
      overscroll-behavior: contain`) instead of being cut off
    - `[ ]` SP-11 · DECIDE · a fallback for a fixed background picture (`bgAttach: "fixed"`) — iOS ignores it, low-end
      Android janks (RULE AF)
    - `[ ]` SP-14 · DECIDE · held bars aware of the phone's safe area and keyboard (`env(safe-area-inset-*)`,
      `interactive-widget`) — a bottom bar must not cover a focused field
    - `[ ]` SP-9 · LATER · flow space for a FIXED top bar so the first heading is not hidden (sticky reserves it already)
    - `[ ]` SP-10 · LATER (motion) · clip-revealed fixed scenes — a full-screen picture per section wiping into the next
    - `[ ]` SP-6 · LATER (component) · Table: a sticky header row and first column
    - `[ ]` SP-12 · **MUST (the user, 2026-10-03: "the user needs to be able to select different variations… not just a few… displayed
      properly")** · sticky and floating are a GALLERY OF VARIATIONS a user picks from and makes their own (RULE S live previews,
      RULE UI, RULE T) — not only today's three holds × anchors. **LAYOUT (here):** WHERE and WHEN a block holds — sticks · hides going
      down / returns going up (SP-2) · a sticky sidebar (SP-8) · sections that pile up (ST-7 Stack) · a bubble in a corner · a bar that
      appears after a point. **NOT LAYOUT (the user, 2026-10-03: blending, transitions, animation, overlay, shadow are not layout):**
      HOW it looks while holding — glass / shadow / colour change on scroll, a shrink animation, a progress bar — goes to AREA V. Which
      variations, and how many, are settled with the user when GROUP 3 opens ("we can talk about it"), mapped the RULE MAP way
    - `[ ]` SP-12b (RENAMED by the tree audit 2026-10-06 — the id clashed with the gallery line above) · LATER (component) · Navigation: off-canvas panel (inert, aria-expanded, Escape, focus return, scroll
      lock), active link following the scroll
    - `[ ]` SP-13 · LATER (component) · a real `<dialog>` popup, centred with `inset: 0; margin: auto`
    - `[~]` **Awwwards "Animation" category — EVERY site, in full detail** (the user, 2026-10-02: "go inside each — AUDIT 2026-10-06: dropped by the user's "enough" (R-1, `fe320f5`): 8 of 243 read
      website on that page… check exactly what the sticky element is, what the animation is, and what the transition
      is… get everything in full details, don't just get the first one"). https://www.awwwards.com/websites/animation/
      — the listing is COLLECTED: 248 sites from 8 pages, `scroll-and-position/raw/awwwards-animation-sites.json`
      (+ the 8 Awwwards elements petro.design links to, inside the script). The measuring script is WRITTEN, NOT RUN:
      `scripts/research/aw-measure.js <list> <out.json> <chrome-profile-dir>` — real Chrome (`channel: 'chrome'`,
      persistent profile; plain Playwright Chromium is blocked by Cloudflare on CodePen / Awwwards), 6 pages in
      parallel, resumable (skips what `out.json` has). Per site it records: the Awwwards title, tags, live URL; the
      libraries (GSAP, ScrollTrigger, Lenis, Locomotive, Barba, Swup, Three/WebGL, Framer, Webflow, Lottie, SplitText,
      Swiper, Next/Nuxt/Astro); CSS features (animation-timeline / view() / scroll(), view-transition, scroll-snap,
      sticky, fixed, clip-path, keyframes, prefers-reduced-motion, blend, backdrop-filter, marquee); every sticky /
      fixed element (what it is, where, how tall, its parent's height = a pinned scroll section); GSAP pin-spacers; how
      many elements change transform / opacity / clip-path over five scroll steps; page weight and requests.
      **STILL TO ADD before running:** (a) WHICH elements animate and HOW (translate / scale / rotate / fade / clip) —
      today only a count; (b) the PAGE TRANSITION — click an internal link, hook `document.startViewTransition`, sample a
      full-screen overlay for 1.5s. Then run it (≈15–20 min, six windows), then a subagent distils it into
      `scroll-and-position/02-awwwards-animation.md` by technique (sticky · scroll animation · section transition ·
      page transition), each HAVE / PARTIAL / GAP, and the gaps go here as SP-15…
    - `[~]` **Awwwards "Transitions" CATEGORY — EVERY site, in full detail** (the user's link, 2026-10-02 session — AUDIT 2026-10-06: dropped by the user's "enough" (R-1, `fe320f5`); the 366-item collection itself was read
      1427d547: https://www.awwwards.com/websites/transitions/). NOT the same source as the Transitions COLLECTION
      already stored in `awwwards-motion-survey.md` (`/awwwards/collections/transitions/`, 366 items, fingerprinted
      from code only, never driven live). Same method as the Animation category: every listing page until one adds
      nothing → every site measured live by `aw-measure.js` (scroll changes + page transition) → distilled into
      `scroll-and-position/03-awwwards-transitions.md`, overlap with the collection marked, gaps here as SP-…
    - `[ ]` **Made in Webflow "page transitions" — EVERY project, in full detail** (the user's link, 2026-10-02 session
      1427d547: https://webflow.com/made-in-webflow/page-transitions). Every item of the listing (all pages / all "load
      more") → each project's live site measured by the same `aw-measure.js` page-transition probe (click an internal
      link, sample the overlay / view transition for 1.5s) → distilled with the Awwwards results, gaps here as SP-…
    - `[x]` **STICKY and FIXED — EXHAUSTIVE research, every situation, every component** (the user, 2026-10-02 session — AUDIT 2026-10-06: `04-sticky-fixed-exhaustive.md` (`186dec5`)
      1427d547: "do a lot of excessive research on sticky position… for any situation… and also fixed position on any
      component, anything on a website"). SUPERSEDES "sticky / fixed is enough once its completeness list is closed".
      A catalogue of EVERY use of each on real pages and in every component (headers, sub-navs, tables, sidebars, TOCs,
      CTAs, bottom bars, chat / cookie / back-to-top, stacked cards, pinned scenes, modals, toasts, drawers…), every
      mechanic and trap (containing block, overflow, transform ancestors, z-index / stacking, iOS / Android bars,
      keyboard, safe areas, zoom, print), each HAVE / PARTIAL / GAP → `scroll-and-position/04-sticky-fixed-exhaustive.md`,
      gaps here as SP-…
    - `[ ]` **Hover effects — the user's two links, EVERY item** (2026-10-02 session 1427d547):
      https://webflow.com/made-in-webflow/hover%20effect · https://www.awwwards.com/inspiration/hover-effect ·
      https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/ — every
      listing page, each item opened and its live hover measured (what changes, on what, touch / keyboard equivalent),
      combined with `motion/04-hover-focus.md`
    - `[x]` **Sticky / fixed exhaustive (mine)** — `scroll-and-position/04-sticky-fixed-exhaustive.md` (SF-1…SF-21),
      2026-10-02. Crawl counts: fixed header on 16.3% of pages, sticky 5.2%, sticky sidebar 4.0%. Proposed MUST: SF-1 Tab
      lands under a fixed BOTTOM bar (only `scroll-padding-top` is set; WCAG F110) · SF-2 a fixed bottom bar hides the
      page end · SF-3 print: fixed blocks repeat on every printed sheet · SF-4 bars that let go on SHORT screens (WCAG
      C34) · SF-5 the page audit measures how much screen held bars take · SF-8 `capturesFixed` misses hover / entrance
      transforms, glass Accordion items and Advanced CSS (a fixed block inside them scrolls away). DECIDE: SF-7 stacking
      cards · SF-10 RTL pins · SF-13 glass cost · SF-14 short page footer (lean MUST) · SF-15 two-row header, row 2
      sticks · SF-16 bottom bars while typing. CHECK: SF-6 · SF-9 · SF-11 Opera Mini · SF-12 iOS 26. LATER: SF-17…SF-21.
      **NOT READ (open):** Baymard (paywall), CSSWG #865 thread, Mozilla 1732817, the real sites it names (to be measured)
    - `[ ]` **BUG LEDGER — the research TOOLS (RULE V)**
      - `[ ]` R-1 · `aw-measure.js` page weight wrong on a re-run (29 KB, "-0") — the persistent profile served from
        CACHE; fix: cache disabled per window (CDP `Network.setCacheDisabled`)
      - `[ ]` R-2 · `cp-tag.js` read CodePen's "verify you are human" page as "no more pens" (hover stopped at 96,
        reduced-motion at 0) and then crashed on the challenge's navigation; fix: detect the check, PAUSE and ask the
        user to tick it once in the visible window (no automated bypass), retry, 2 windows + random pauses on CodePen
      - `[x]` R-3 · `src-list.js` gave up on one Webflow page timeout; fix: 4 retries per page — DONE (checked in the code 2026-10-06: four tries per page, `scripts/research/src-list.js` line 15, `186dec5`)
      - `[ ]` R-4 · `aw-list.js` crashed at Animation page 185 (connection dropped) and LOST 184 pages — it saved only at
        the end; fix: `src-list.js` saves after every page and resumes
      - `[ ]` R-5 · an Awwwards INSPIRATION item has no "Visit site" of its own — recorded as "null" (a false miss); fix:
        follow its `/sites/` page to the live site, keep the item's video (the recording of the effect)
      - `[ ]` R-6 · One Page Love's list picked up menu pages ("free-templates", "sections"); fix: filtered (149 items)
      - `[ ]` R-7 · a RESUMED listing stopped at once (pages it already held "added nothing"); fix: the end is a page
        with NO items, not no NEW items
      - `[ ]` R-8 · running every source at once (~24 windows) ran the machine out of memory (2 GB free of 15.6):
        gallery pages and screenshots timed out and each failure was RECORDED AS DONE (a false negative); fix: a failed
        item is retried (3 tries) and re-run on restart, and ONE measuring process at a time (6 windows) + CodePen (2+2)
      - `[ ]` R-9 · frames per second read 2–6 on a 330 KB page: with six windows open Chrome slows the frames of covered
        windows (and my DOM snapshots blocked the first try) — a FALSE number; fix: fps is no longer recorded, long
        tasks are kept, smoothness gets its own one-window pass
    - `[x]` **LEDGER VERIFIED IN CODE 2026-10-02** (`educo-research/reading/ledger-verify.md`; SP-4 and N1 re-checked
      by me): **22 REAL · 3 NOT A BUG · 3 CAN'T TELL without a browser.** NOT A BUG (latent — nothing published sets
      it): MR-17 · CE-7 · HV-21. CAN'T TELL (headed check written in the file): NEW-B3 · NEW-B2 · NEW-C1. Same root:
      SA-1 = SP-4 · EX-10 fixed with EX-2/EX-3 · MR-9 ⊂ EX-2/EX-6 · MR-16 ⊂ MR-4 · NEW-B2 ⊂ MR-3. **REAL, worst for
      users first:** SP-4/SA-1 rounded or clipped section writes `overflow: hidden` (`box-export.ts:393`,
      `BoxCanvas.tsx:3029`) — pins and reveals inside it die; fix `overflow: clip` · MR-4 the auto pager has no Pause ·
      MR-5 an auto-dismiss alert cannot be paused by touch · EX-3 dismissing an alert drops focus to `<body>` · MR-2
      Solid / Glass bar stays see-through under reduced motion / no scroll timelines · MR-6 hover not gated by
      `(hover: hover)` · SH-7 focus rings vanish in forced colours · SF-8 `capturesFixed` misses hover / entrance /
      arrival transforms · ST-1 sloped edge shows the page colour (the guide says otherwise) · NEW-A1 swipe past the
      pager's end fires BACK · MR-16 focus on pager dots does not stop it · CE-19 mobile spinner · MR-3 condense / glass
      cost every frame · AM-1 `animate-in` undefined (114 files, 211 uses) · minor: EX-6 · EX-5 · EX-10 · MR-9 ·
      video 315px · HV-17. **NEW, found while verifying:** `[ ]` N1/N2 the alert timer's `go()` never clears the old
      timer (`box-model.ts:2034`) — mouse-leave + focus-out leave TWO timers, the alert vanishes while being read ·
      `[ ]` **N9 · VERIFIED by me:** `--eu-color-surface-2` is used 20 times in `lib/` (accordion / navbar hovers,
      the "Soft surface" background…) but defined ONLY in the editor's `app/globals.css` — never in the exported token
      sheet, so those hovers do nothing on a PUBLISHED page while the canvas shows them (canvas ≠ export) ·
      `[ ]` **N10 · VERIFIED by me:** `box-model.ts:984` exports `letter-spacing` in px (rule 16) ·
      `[ ]` N3 a stagger gives children 11+ no delay — they arrive first · `[ ]` N4 the web PageLoader / InPageSpinner
      not reduced-motion gated, not announced, hard-coded hex · `[ ]` N5 pager arrows are links, not buttons · `[ ]` N6
      every video iframe is titled "Video" · CAN'T TELL: N7 alert × contrast · N8 a link in a reveal block focusable
      while nearly transparent
    - `[ ]` **BUG LEDGER — more defects in what SHIPS reported by the redo (to verify in code first)**
      - `[ ]` SH-7 · focus rings drawn only with `box-shadow` after `outline: none` (`components.ts:49,320,345,349`) —
        they vanish in forced-colours (Windows high contrast); no `forced-colors` rule anywhere
      - `[ ]` the video block's default height is `315px` (`box-export.ts:157`) — a stored pixel (rule 16)
      - `[ ]` NEW-A1 · the pager strip has no `overscroll-behavior-x: contain` — swiping past its end can fire the
        phone's BACK gesture
      - `[ ]` EX-10 · a leaving element can still be clicked and focused (make it `inert` when the exit starts)
      - `[ ]` MR-16 · the pager's auto-advance restarts on its own when focus leaves, focus on its dots / arrows does not
        stop it, a reduced-motion change while open is ignored
      - `[ ]` MR-17 · the global reduced-motion rule does not set `animation-iteration-count: 1` — a loop would flash
      - `[ ]` **AM-1 · VERIFIED 2026-10-02 (by me, not only reported):** the `animate-in` / `slide-in-from-*` /
        `fade-in` classes are used in 114 files (211 times) but NOTHING defines them — no plugin in `globals.css` or
        `package.json`, zero `.animate-in` rules in the built CSS — so every Modal, PageLoader and toast entrance in
        the Educo app silently does nothing. (Plus, reported by the same research, to verify: the native app has no
        reduced-motion handling, Reanimated installed but unused, 1 of 192 Pressables gives press feedback, toasts
        not announced, the web Modal never moves focus, drag handles that cannot drag, no offline state — AM-2…AM-27
        in `motion/09-app-motion.md`)
      - `[ ]` CE-7 · an invalid input is shown by colour only (WCAG 1.4.1)
      - `[ ]` CE-19 · the app's spinner loops with no reduced-motion check and no accessible label
      - `[ ]` HV-17 · `.eu-btn:active { translateY(1px) }` — a stored pixel (rule 16)
      - `[ ]` HV-21 · a focusable child sits at `opacity: 0` (revealed on hover) — keyboard focus lands on something
        invisible (WCAG 2.4.7). (HV-15 = SH-7 and HV-18 = MR-6: same bugs, found twice)
      - `[ ]` NEW-B3 · the pager's off-screen pages stay in the Tab order (no `inert` anywhere in the pager) — keyboard
        users tab into slides they cannot see (WCAG 2.4.3 / 2.4.7)
      - `[ ]` NEW-B2 · a style applied while a bar is stuck must change paint only, or the bar flickers between stuck
        and unstuck — check every `pinArrival`
      - `[ ]` NEW-C1 · scroll effects are switched on by `@supports (animation-timeline…)` alone (`interactions.ts:242`,
        `box-model.ts:6362`) — a half-built engine passes and plays them with the wrong timing; add `and
        (animation-range: 0% 100%)`
    - `[x]` **Redo results so far** — `06-motion-rules.md` +9 gaps MR-16…24 (Material 3 read via its content endpoint) · — AUDIT 2026-10-06: results in `186dec5`; R-1 closed (`fe320f5`)
      `07-shadows.md` SH-1…12 (79 demos) · `05-entrance-exit.md` 62 sources, 213 demos, EX-9…19 · reading cluster A
      (MDN, ~95 sources, 129 demos, NEW-A1…A8) · cluster C (Bramus + scroll-driven-animations.style: 141 posts, every
      demo page, 235 demos, NEW-C1/C2) · cluster E (Codrops: 123 articles + the 1,139-entry demo index + the
      StickySections repo, 249 demos, NEW-E1…E11 — read through the r.jina.ai reader proxy over Codrops' WordPress API
      because tympanus.net answers 403; TOLD the user) · `03-page-transitions.md` (~230 pages, 348 demos, PT-12…20) —
      outputs copied to `educo-research/reading/` · cluster B (Chrome + web.dev via their sitemaps: 47 sources,
      177 demos, NEW-B1…B8; the full scroll-triggered action list — `play-once` closes SA-2's CSS route). The chain
      dropped to 4 windows 2026-10-02 04:11 (0.7 GB free with 6) · `04-hover-focus.md` (~55 sources + the code of 82
      Codrops hover / button / link / cursor / tooltip repos — 0 of 77 handle reduced motion; 320 demos; HV-15…28).
      · cluster F (Polypane · Josh Comeau · Shadeed · Kevin Powell · Apple HIG · Material component docs · divider
      generators · freefrontend: ~75 sources, 287 demos, NEW-F1…F9; F7 the "puzzle" divider explains ST-1 and its fix).
      **RESEARCH RULE added 2026-10-02:** no identity spoofing (cluster F tried a Googlebot user agent on a site that
      refused it — not a route we use); a source that refuses stays NOT READ with the reason, or is read in the real
      browser the way a person reads it. **And never turn the sandbox off** (an app-motion sub-agent ran `curl` with
      the sandbox disabled on its own — TOLD the user). · `09-app-motion.md` (Material 3 · 17 Apple HIG pages · Fluent
      · Carbon · Atlassian · Polaris · React Navigation 7 · expo-router · all 96 Reanimated 4 pages · gesture-handler ·
      Moti · FLIP · Next view transitions; 62 demos; AM-1…27). Waiting: cluster D, component effects
    - `[x]` **THE MOTION & EFFECTS LIBRARY — one library for EVERYTHING (the user, 2026-10-02: "make sure everything we — AUDIT 2026-10-06: `motion/library/1…11-*.md` (`186dec5`)
      collect is something we can use for everything… the website builder and any application we develop… so we
      don't have to redo it")** — `docs/web-anatomy/motion/LIBRARY.md` (index, 11 families, ONE entry shape: what a
      visitor sees · code · MEASURED timing → token · phone · reduced motion · accessibility · cost · how common ·
      examples · surfaces incl. React Native · HAVE/PARTIAL/GAP verified); memory `reference_motion_library.md`. Raw
      store OUTSIDE git, permanent: `C:\Users\eyite\educo-research\` (runs/ · shots/ · reading/ · chain.log) — the
      session scratchpad is cleaned, so nothing stays there. Added on the user's "is anything missing?" (my answer):
      - `[x]` the measurer captures, per item: load intro (0.7s + load shots, preloader cover) · TIMING (every
        duration / easing / property / delay in use + script eases) · keyboard focus look (4 Tab stops) · hover with a
        3-frame strip and its own timing · cursor followers · the MENU (open strip, Escape closes?, focus returns?,
        scroll lock) · page transition (+ focus and title after) · a REDUCED-MOTION pass (what still moves) · a PHONE
        pass (360×740, touch, Android UA, CPU 4×: held bars, scroll changes, long tasks, sideways overflow, the phone
        menu). Trialled on 6 sites 2026-10-02
      - `[~]` 35 more Awwwards collections (intro animations · CSS animations · animation · animation libraries · — AUDIT 2026-10-06: dropped by the user's "enough" (R-1, `fe320f5`)
        loading · parallax · horizontal scrolling · storytelling · filters & effects · drag · playful · menu · best of
        navigation · galleries & slideshows · forms · search · search filters · video / audio players · UI elements ·
        3D UI · cookie · layout · grid layout · hero · footers ×2 · about · contact · product · project · 404 · one-page
        · mobile UI · responsive · dark mode · then WebGL · three.js) — listing (`collections.log`), measured by the chain
      - `[x]` COMPONENT effects (uiverse galaxy — every element, by script · Animate.css · Animista · Motion examples · — AUDIT 2026-10-06: 08-component-effects (`186dec5`)
        Codrops · freefrontend · Material 3 / Apple components) → `motion/08-component-effects.md`, CE-…
      - `[x]` APPLICATION motion (Material 3 · Apple HIG · Fluent 2 · Carbon · Polaris · React Native Animated / — AUDIT 2026-10-06: 09-app-motion.md (`186dec5`)
        Reanimated / gesture-handler / Moti / React Navigation · web-app FLIP / View Transitions) → `motion/09-app-motion
        .md`, AM-…
      - `[ ]` SMOOTHNESS in its own one-window pass (foreground, 60 Hz, CPU 4×) on the shortlisted techniques — frames
        per second cannot be measured with six windows open (R-9)
      - `[ ]` CodePen pens through the full measurer too (their preview URL as a page) — `cp-tag.js` reads code + one
        scroll + one hover only
      - `[x]` MERGED 2026-10-02: the reading agents' demos → `own-scroll-demos` (435 sites) · `own-motion-demos` (533) ·
        `own-app-demos` (60) · `own-component-demos` (1,547) — into the chain; **R-10** about 4,714 of them were CodePen
        pens, which the site measurer would have measured as CodePen's page, not the pen → split into
        `pens-own.list.json`, read by `cp-tag.js list:` (queued after the tag run, `after-cp.sh`)
      - `[ ]` uiverse — 3,824 elements RENDERED LOCALLY from the cloned open-source repo (`educo-research/src/galaxy`),
        each hovered / clicked / focused with shots: every element opened and run, ~1s each, no network
        (`uiverse-elements.list.json` keeps the page URLs) — `scripts/research/uiverse-run.js`: each of the 3,802
        elements loaded alone (no network) and driven at rest · hover · press · keyboard focus · click · reduced
        motion, ::before / ::after included, a shot per state, accessible names counted → `educo-research/runs/
        uiverse.json` — RUNNING 2026-10-02. **R-11** (fixed): a closed browser made it record every remaining element
        as failed in a second; now it stops, and errored elements re-run on restart
      - `[x]` `motion/08-component-effects.md` (uiverse 3,802 parsed: transitions median 300 ms, 64% `transition: all`,
        1.3% style `:focus-visible`, 0.26% honour reduced motion, 69% of inputs unlabelled · Animate.css 98 · Animista
        662 · motion.dev 462 · Codrops 775 · freefrontend 209 collections · Material web source (menus / dialogs open
        500 ms, close 150 ms; focus ring 3 px + 2 px offset) · Apple HIG 20 pages; CE-1…20)
      - `[x]` the measurer skips a live site already measured under another source (`sameAs`)
      - `[x]` **PLAN CHANGED by the user 2026-10-02 ("do we need 25,000 items?") — NO.** What matters is the number of
        distinct techniques, not of sites. The USER'S OWN LINKS run in full (aw-insp · wf-hover · wf-page-transitions ·
        opl-drop-shadow · aw-coll-transitions · aw-coll-hovers; CodePen sticky-header 120/120 + fixed-position 24/24 —
        done); EVERYTHING ELSE runs in random order until SATURATED: 150 items in a row that add nothing new (library ·
        CSS feature · kind of scroll change · hover change · page-transition kind · menu behaviour · held kind · phone
        behaviour; for pens, the techniques in their full code) → a `.saturated.json` beside each run says where it
        stopped and what was known. `aw-measure.js` / `cp-tag.js --saturate=150`. ~1 day of machine time instead of 3–4
      - `[x]` uiverse — ALL 3,802 elements run locally, 2026-10-02 (`educo-research/runs/uiverse.json`)
      - `[x]` **THE USER'S GO (2026-10-02): (1) write the library while the runs finish, (2) verify the bug ledger in — AUDIT 2026-10-06: library and ledger done (`186dec5`)
        code** — nothing that needs the browser meanwhile (memory ~1 GB free). `scripts/research/aggregate.js` condenses
        every finished run into `docs/web-anatomy/research-runs/AGGREGATE.md` (regenerated, never edited; first pass:
        732 sites, uiverse 3,802, 17 CodePen tags — sticky 47% · fade on scroll 55% · median transition 350 ms · Escape
        closes the menu 76% · visible focus on 74% of Tab stops · 70% still move under reduced motion). Three agents
        write `motion/library/1…11-*.md` (entry shape, measured shares, builder status verified); one agent verifies
        every ledger line → `educo-research/reading/ledger-verify.md` (REAL / NOT A BUG / CAN'T TELL)
      - `[ ]` **R-16 · the PHONE pass never ran at 360px** — Playwright's own viewport overrode my CDP device override,
        so every "phone" figure was the desktop page (held elements median 1,425px wide; 138 of 179 phone menu buttons
        at the desktop x). Found by a library agent, CONFIRMED by me in the raw data. Fix: Playwright viewport first,
        mobile / touch / Android / CPU 4× over it, and the pass CHECKS `screen.width === 360` or records a failure; the
        page may still lay out wider — recorded as `pageWidth` / `forcedWider` (a real phone finding). Re-measured by
        `--patch=phone` on every source done before the fix (`educo-research/phone-patch.sh`; aw-insp re-run after,
        its patch started on the old code). Proven: koox.co.uk 360px, 12 held, the phone menu opens
      - `[ ]` **R-17 · "Escape closes the menu" counted menus that never OPENED** (76% → re-measure: two rules gave 47%
        and 69% on the old records, so they are not trusted). Fix: the probe records `didOpen`; Escape and focus return
        are judged only on a menu that opened; the desktop menu is re-measured in the same patch; the summary counts
        only fixed-probe menus
      - `[ ]` **R-18 · see-through full-screen layers counted as preloaders / overlays** (intro 69% → opaque 36%, gone
        by load 3%; overlay page transitions 27% + 9% → 10% + 3%). Fix: `opaque` per cover (background alpha > 0.5, a
        picture, or media)
      - `[ ]` **R-19 · summary lines counted more than their names** — "fixed bar with nav" 55% (any fixed element with
        a link) → FIXED TOP bar 32% · glass bar 7% → glass TOP bar 2% · marquee 24% (a word) → marquee @keyframes 9% ·
        animation-timeline 6% (a word) → a REAL scroll timeline in a rule 1%. `aggregate.js` definitions tightened
      - `[ ]` R-20 · my R-18 relabelling made a stray "spa" kind (19%), and its `//` comment mid-line cut the statement
        (the R-13 mistake again) — both fixed; AGGREGATE regenerated
      - `[x]` **Library files written** (`motion/library/`): 1-held (16) · 2-scroll (20) · 3-section-transition (14) ·
        4-page-screen-transition (14) · 5-entrance-exit (17) · 7-gesture (11) · 8-feedback-state (18) ·
        6-hover-focus-press (24) · 9-text (11) · 10-surface (16) · 11-rules (17 + THE TOKEN PROPOSAL: instant 70 · fast
        150 (today 120) · base 300 (today 200) · slow 400 (today 320) · slower 500 · page 300 · reveal 800 · loop 1500 ms;
        stagger 60 ms capped at 500; standard (.2,0,0,1) · enter (.23,1,.32,1) · exit (.4,0,1,1) · emphasized = Material's
        real `linear()` curve, today's overshoot renamed `overshoot`; springs as two `linear()` shapes + a bouncy one for
        playful sites only — FOR THE USER TO APPROVE). More corrections: the median transition is 300 ms per element
        (350 was per site) · the 74% "visible focus" counted any box-shadow as a ring · `.eu-tab` / `.eu-navbar` CSS
        ships in every page but nothing renders it · the web app's shared Button has no `active:` and `focus-visible:`
        appears in 0 files. Research claims the writers found WRONG: "39% of award sites use ScrollTrigger" (live: 9%)
        · Lenis 28% (live: 16%) · NEW-E2 "bottom bars do not stack" (they do, `box-model.ts:5744`, `:5840`) · "arrival
        distance 12 units" (it is `PIN_ARRIVAL_AFTER = 120`, `box-model.ts:6142`) · cluster F's `box-export.ts:359`
        `100svh` (a comment; the value is at `box-model.ts:5622`). Their phone / menu / intro numbers wait for the
        re-measure and the regenerated AGGREGATE — then each file's numbers are refreshed
      - `[ ]` R-15 · One Page Love: the link finder took a "Launch website" link (One Page Love's list of OTHER sites)
        or a sponsor for 53 items — they measured the wrong site. Fixed (the gallery's own "Visit website" first,
        "Launch" never); the run set aside (`runs/old-format/opl-drop-shadow.wrong-link.json`) and re-run. Checked the
        other sources: every item resolves to its own site
      - `[ ]` R-12 · `cp-tag.js` never retried an errored pen (2 in sticky-header) — fixed: errored pens re-run · R-13 ·
        my R-12 edit put a `//` comment mid-line and commented out `const have` — CodePen crashed at once; fixed and
        proven by a run (sticky-header re-read to 120/120)
      - `[x]` 37 Awwwards collections listed: 6,984 items
    - `[>]` **THE RUNS (2026-10-02, session 1427d547)** — every item opened by `aw-measure.js` (DOM: sticky / fixed
      elements; what changes on scroll and HOW, with a no-scroll control; hover on up to 8 elements + the `:hover` rules
      and whether they are gated by `(hover: hover)`; every box-shadow; the page transition; the CSS rules and script
      calls that do it, verbatim; four screenshots), one chain, smallest first → `docs/web-anatomy/research-runs/`:
      `[x]` aw-insp (hover-effect, interactive-shadow-parallax = koox.co.uk, petro's 8) 10/10 · `[x]` wf-hover 13/13 ·
      `[ ]` wf-page-transitions · `[ ]` opl-drop-shadow 149 · `[ ]` aw-coll-transitions 366 · `[ ]` aw-coll-hovers 466 ·
      `[ ]` aw-cat-transitions 3,875 · `[ ]` aw-cat-animation (re-listing, every page) · `[x]` getcssscan 95 shadows
      (DOM values) · `[>]` CodePen 28 tags, every pen opened (`cp-tag.js`) · `[ ]` own-research demo lists
      (`own-scroll-demos`, `own-motion-demos` — ELEVEN reading agents: scroll half A–F (MDN · Chrome/web.dev ·
      scroll-driven-animations.style/Bramus · CSS-Tricks/Smashing/Roselli · Codrops via RSS/GitHub/archive · blogs +
      Material/Apple) writing `scratchpad/A..F.md` + `.urls.json`; motion half writing `scratchpad/demos/pt|hv|ex|mr|sh
      .json` + 03–07 sections. When they land: MERGE + dedupe the URLs into the two lists, VERIFY every HAVE / PARTIAL /
      GAP claim by my own grep (the mimo agent's were wrong 3 times), renumber NEW-* → SF-22+ · ST-12+ · SA-15+ ·
      PT-12+ · HV-15+ · EX-9+ · MR-16+ · SH-1+, append "Added 2026-10-02 (redo)" sections) → the same chain ·
      `[x]` mimo glossary — 13 pages read in full (`scroll-and-position/README.md`); its three "gaps" were FALSE (a bad
      grep: `scroll-padding-top`, `--eu-pin-above` and the staggered entrance all exist) — corrected · then the distillation,
      item by item, by parallel agents reading slices of the results
    - `[ ]` **AUDIT — every link the user gave: was EVERY item opened, run and read? (the user, 2026-10-02: "you just
      can't intrude them and that's going to be a false positive")** — a link closes only when every item on every page
      was opened live and HOW it is done written per item (RULE R "every item is opened, run and read"):
      - `[ ]` CodePen sticky-header / fixed-position — 47 pens' code read (some cut), pages 2+ missed, NONE run → re-done
        by `cp-tag.js` list + read
      - `[ ]` Awwwards Transitions COLLECTION (366, `awwwards-motion-survey.md`) — code fingerprinted only, NEVER driven
        → re-run live with `aw-measure.js` (FALSE POSITIVE until then)
      - `[ ]` Awwwards "Sticky elements" / petro.design — petro measured live; its 8 linked elements → `aw-measure --extra`
      - `[ ]` mimo `position: sticky` — page read; its glossary links (animation, transition, viewport, z-index, grid,
        flexbox, padding, margins, header) not yet
      - `[ ]` Awwwards Animation + Transitions CATEGORIES — listing collecting; 6 sites trial-run
      - `[ ]` Webflow page-transitions · Webflow hover effect · Awwwards hover-effect · Awwwards hovers-cursors collection
        · getcssscan box-shadow · One Page Love drop-shadow — recorded, not started
      - `[ ]` the older sources from earlier sessions (the layout crawl, `LAYOUT_BENCHMARK.md`, the Advanced CSS course,
        the motion survey) — audited the same way; any that were listed but not opened item by item get an open line here
    - `[x]` **CodePen — "look through everything there, see exactly how people do it"** (the user, 2026-10-02 session — AUDIT 2026-10-06: R-1 change (4): 29 tag pages in docs/web-anatomy/codepen/
      1427d547), and "go INSIDE each and every pen" (the sticky-header / fixed-position pens were summarised, never run
      one by one). `scripts/research/cp-tag.js`: `list` walks every page of a tag (`?cursor=`), `read` opens EVERY pen
      LIVE in its full view, scrolls it, two screenshots, records its sticky / fixed elements and what changed, and saves
      its FULL html / css / js → `docs/web-anatomy/codepen/raw/<tag>.json`. Tags: sticky-header · fixed-position ·
      position-sticky · sticky · sticky-nav · sticky-sidebar · fixed-header · scroll-animation · scroll-driven-animations
      · animation-timeline · parallax · scrollytelling · horizontal-scroll · view-transitions · view-transition ·
      page-transition · section-divider · shape-divider · clip-path · hover-effect · hover · cursor · starting-style ·
      popover · dialog · marquee · stacking-cards · reduced-motion. Then a distillation pen by pen: HOW each is done
      → `docs/web-anatomy/codepen/` by technique, HAVE / PARTIAL / GAP
      - STATUS 2026-10-02 (session 1fc987ff, the user asked "is CodePen done?" — NO): the tag run ENDED at 16:52 having
        read ~4,800 pens, but with `--saturate=150`: parallax (stopped p149), clip-path (p85), hover (p59), hover-effect
        (p73), cursor (p63), marquee (p42) were CUT SHORT; pens-own stopped at 570 of 4,714; section-divider,
        shape-divider and stacking-cards listed 0 pens; sticky-nav was never run. NOTHING distilled yet (the folder
        holds only `raw/`)
      - `[~]` RESUMED, NO saturation — the user: "don't start from the beginning… grab everything". — AUDIT 2026-10-06: stopped at the user's "enough" (R-1, `fe320f5`)
        `educo-research/codepen-resume.sh` (a detached Git Bash process): every tag again, already-read pens skipped,
        then `list:pens-own` for the 4,144 not read. Logs: `educo-research/runs/codepen-resume.out` ·
        `pens-own-resume.out` · `chain.log` marks each end. Started 2026-10-02 ~17:58
      - `[ ]` section-divider / shape-divider / stacking-cards list 0 pens twice — try the tag names CodePen uses
        (divider · dividers · wave · svg-divider · stacked-cards · card-stack · stacking) once the resume ends
      - `[x]` HOW IT IS DONE, written AS EACH PEN IS READ (the user, 2026-10-02: "the code is right there… get everything
        together instead of getting them and then going back again"): `scripts/research/cp-how.js` reads a pen's own code
        and what it did when scrolled / hovered → `how` { summary, techniques (38 kinds: sticky, view() timelines, GSAP,
        IntersectionObserver, :has(), @starting-style…), the CSS rules that do it verbatim, the script calls }. `cp-tag.js`
        calls it on every pen it reads; the ~5,300 already read were given theirs from their saved code (no re-opening),
        and each tag has its page `docs/web-anatomy/codepen/<tag>.md` (techniques by count, then every pen with its how).
        Regenerate the pages after the run: `node scripts/research/cp-how.js docs/web-anatomy/codepen/raw`
      - `[x]` HAVE / PARTIAL / GAP against the builder, technique by technique, into the motion library — once the — AUDIT 2026-10-06: R-2 step 4 — every crawled technique is code and proven (`43fb21c`)
        reading ends (a judgement against our code, not a second read of CodePen)
    - `[x]` **Box shadows** (the user's links, 2026-10-02 session 1427d547: https://getcssscan.com/css-box-shadow-examples — AUDIT 2026-10-06: R-2 closed; library/10-surface.md
      · https://onepagelove.com/tag/drop-shadow — every page of the tag, each site's shadows measured live)
      — every example stored with its value; checked against the shadow tokens and Web Design Rule #5 (design
      foundation `02`). LATER (style, not layout) unless it shows a layout need
    - `[x]` **Section transitions + scroll animation (mine)** — `motion/01-section-transitions.md` (ST-1…ST-11),
      `motion/02-scroll-animation.md` (SA-1…SA-14), 2026-10-02. Proposed MUST: ST-5 overlap a card across a band edge
      (outer spacing cannot go below 0) · SA-4 reading-progress bar · CHECK→MUST: ST-1 a sloped / curved band edge shows
      the PAGE colour, not the next band (the guide says otherwise) · ST-3 the cut slices words / focus rings · SA-1
      reveal-on-scroll never plays inside a rounded / clipped box (`overflow: hidden`, same root as SP-4). DECIDE: ST-2
      ST-4 ST-7 ST-8 ST-10 · SA-2 SA-5 SA-8 SA-12. CHECK: SA-3 SA-13. LATER: ST-6 ST-9 ST-11 · SA-6 SA-7 SA-9 SA-10 SA-11
      SA-14. **NOT READ (open):** Codrops (403 to the fetcher), Apple HIG motion + Material 3 motion (need JS) → to read
      in real Chrome; Roselli / Paint API / curtain-footer / marquee sources read from summaries only
    - `[x]` **Entrance / exit + motion rules (mine)** — `motion/05-entrance-exit.md` (EX-1…EX-8), `motion/06-motion-rules.md`
      (MR-1…MR-15), 2026-10-02. Proposed DECIDE: EX-1 nothing can animate OUT · EX-4 accordion opens instantly · MR-1
      reduced motion swaps movement for a fade · MR-7 a visitor "Reduce motion" switch · MR-8 reduced-motion preview on
      the canvas · MR-11 `content-visibility` · MR-13 below-fold entrances play unseen. LATER: EX-7 · MR-10. CHECK: EX-8 ·
      MR-12 · MR-14 · MR-15. **NOT READ (open):** m3.material.io (JS), Polaris tokens (redirect), SCR40, PEAT
    - `[ ]` **BUG LEDGER — defects in what SHIPS, found by the motion research (RULE V: each fixed with a guard, or NOT A BUG
      with the measurement; to be verified in code + a headed check first — reported by a research agent, not yet seen)**
      - `[ ]` EX-2 · the alert's dismiss runs a hard-coded `.18s` + `setTimeout(180)`, not the motion tokens
      - `[ ]` EX-3 · dismissing an alert removes the focused close button — keyboard focus falls to `<body>`
      - `[ ]` EX-5 · the horizontal accordion animates `flex-grow` (a layout property); the panel widens empty first
      - `[ ]` EX-6 · a stagger of 90 ms × 10 children starts the last one after 810 ms — cap at ~500 ms
      - `[ ]` MR-2 · a pinned bar set to "solid" / "glass" never fills under reduced motion or in Firefox — words scroll
        under a see-through header
      - `[ ]` MR-3 · the `condense` and `glass` arrivals animate layout and blur on every scroll frame (jank on low-cost
        Android, RULE AF)
      - `[ ]` MR-4 · the pager's auto-advance has no visible Pause (WCAG 2.2.2)
      - `[ ]` MR-5 · auto-dismissing alerts have no visible way to stop the timer (WCAG 2.2.1 / 2.2.2)
      - `[ ]` MR-6 · hover effects are not gated by `(hover: hover)` — a tapped card stays lifted on a phone
      - `[ ]` MR-9 · motion tokens incomplete, three timings bypass them, `emphasized` still the overshoot curve
      - `[ ]` SA-1 · reveal-on-scroll inside a rounded / clipped box (`overflow: hidden`) — with SP-4
      - `[ ]` ST-1 · a sloped / curved band edge shows the page colour, not the next band (the guide says the next band)
    - `[x]` **MY OWN research (RULE RS), running in parallel 2026-10-02** — `docs/web-anatomy/motion/` 01 section — AUDIT 2026-10-06: motion/01–06 (`186dec5`)
      transitions (ST-…) · 02 scroll animation (SA-…) · 03 page transitions (PT-…) · 04 hover / focus (HV-…) · 05
      entrance / exit (EX-…) · 06 motion rules (MR-…); each EXTENDS `motion-effects.md` + `awwwards-motion-survey.md`,
      never redoes them; gaps come here when they land
    - `[ ]` **COMPLETENESS — what the links still hold that has NOT been read (audit, 2026-10-02, the user asked "have
      we missed anything?")** — none of these may be skipped:
      - `[ ]` CodePen sticky-header + fixed-position: confirm EVERY page of each tag was collected (compare with the
        tag's own count; the collector stopped after 3 / 5 pages), and re-read the pens whose code was cut at 6,000
        characters (`…truncated` in the raw JSON) in full
      - `[ ]` mimo: the glossary pages it links to — **animation**, **transition**, viewport, z-index, grid-layout,
        flexbox, padding, margins, header-tag — at least animation and transition in full (they are this topic)
      - `[ ]` the 8 Awwwards elements petro.design links to (Rosehip scroll · Studio Illicit horizontal scrolling ·
        Quechua 2025 lookbook · G.S scroll-based animations · Emma is Social work page · Melvin Winkeler homepage on
        scroll · Theatre of Memory infinite-scroll archive · Type One Ventures homepage animation) — each element's
        live site measured
      - `[ ]` Awwwards Animation: **ALL listing pages**, not only the first 8 (`aw-list.js` stops at page 8 — raise the
        cap until a page adds nothing), then EVERY site visited in detail (the item above)
    - `[ ]` **RESEARCH STILL TO DO on this topic (planned 2026-10-02 with the user)** — sticky / fixed is enough once
      the completeness list above is closed; the rest, each studied the same way (every link, every example):
      - `[ ]` **section transitions** — how one band hands over to the next: shape dividers (waves, angles, curves),
        overlaps, colour fades, sticky "stacking" sections, clip-path / mask wipes, scroll-snapped full-screen sections
      - `[ ]` **scroll animation** — reveal on scroll, parallax, CSS scroll-driven animations (`animation-timeline:
        scroll() / view()`), pinned "scrollytelling", horizontal-scroll sections, progress bars, marquees
      - `[ ]` **page transitions** — the View Transitions API (same-document and cross-document), Barba / Swup-style
        overlays, shared-element morphs
      - `[ ]` **hover / focus effects and micro-interactions** — the full family (lift, tilt, reveal, sweep, magnetic,
        image zoom, underline), with touch and keyboard equivalents
      - `[ ]` **entrance / exit animation in CSS today** — `@starting-style`, `transition-behavior: allow-discrete`,
        animating `display` / `<dialog>` / popover
      - `[ ]` **motion rules** — WCAG 2.3.3 + `prefers-reduced-motion`, motion tokens (durations, easings), and
        performance on low-cost Android (compositor-only properties, no heavy scroll listeners — RULE AF)
      - the user sends links for these; the session ALSO researches each on its own (MDN, web.dev / Chrome developers,
        CSS-Tricks, Codrops, CodePen tags, Awwwards categories, design-system motion guides) and stores it the same way
      - `[x]` **"ENOUGH" CHECKLIST (RULE RS)** — written 2026-10-02 (session 1427d547); **waiting for the user's — AUDIT 2026-10-06: signed; 1.1.5 FROZEN 2026-10-02; R-1 closed (`fe320f5`)
        sign-off** before 1.1.5 is frozen. "Covered" = the user's links run item by item AND my own research read in
        full AND written into the library with measured numbers and the builder's status verified in code.
        | Need | Covered? | Where | What is still open |
        |---|---|---|---|
        | Sticky — every use and trap | ✅ | `library/1-held.md` · `scroll-and-position/01`, `04` | phone figures (R-16 re-measure) |
        | Fixed — every use and trap | ✅ | `library/1-held.md` · `scroll-and-position/04` | phone figures (R-16) |
        | Section transitions (dividers, overlaps, stacking, wipes, snap) | ✅ | `library/3-section-transition.md` · `motion/01` | — |
        | Scroll animation (reveal, parallax, scroll-driven, scrollytelling, horizontal, marquee) | ✅ | `library/2-scroll.md` · `motion/02` | — |
        | Page / screen transitions (View Transitions, overlays, app screens) | ✅ | `library/4-…` · `motion/03`, `09` | — |
        | Hover / focus / press + touch and keyboard versions | ✅ | `library/6-…` · `motion/04` · uiverse 3,802 run | — |
        | Entrance / exit (@starting-style, dialog, popover, menus, toasts) | ✅ | `library/5-…` · `motion/05` | desktop menu figures (R-17 re-measure) |
        | Motion rules — tokens, reduced motion, performance, WCAG | ✅ | `library/11-rules.md` · `motion/06` | smoothness (fps) in its own one-window pass — LATER, not needed to freeze |
        | Shadows / surfaces | ✅ | `library/10-surface.md` · `motion/07` · getcssscan 95 | — |
        | Component effects (for the component rebuild) | ✅ | `library/6`, `8` · `motion/08` | — |
        | App motion — web app + React Native | ✅ | `library/4`, `7`, `8` · `motion/09` | — |
        | Text effects | ✅ | `library/9-text.md` | — |
        | The user's own layout list | ⬜ | — | **the user adds it, then FREEZES 1.1.5** |
        Background runs still refining percentages (collections · categories · demos · pens, each until saturated) do
        NOT block the sign-off: they change shares, not the list of techniques.
      - `[x]` **MOTION TOKENS — APPROVED by the user 2026-10-02** (`library/11-rules.md`): instant 70 · fast 150 · base
        300 · slow 400 · slower 500 · page 300 · reveal 800 · loop 1500 ms; stagger 60 ms capped at 500; easings standard
        (.2,0,0,1) · enter (.23,1,.32,1) · exit (.4,0,1,1) · emphasized = Material's `linear()` curve (today's overshoot
        → `overshoot`); springs as two `linear()` shapes + a bouncy one for playful sites only. To be BUILT in the fix
        batches (today: fast 120 · base 200 · slow 320)
      - `[ ]` **THE FIX ORDER — agreed with the user 2026-10-02:** (1) commit the research · (2) NEW SESSION · (3) finish
        F-1 (F1-k, gate, commit) · (4) Batch A — published-page motion safety: SP-4/SA-1 `overflow: clip` · MR-2 Solid /
        Glass bar · MR-6 `(hover: hover)` · SH-7 forced-colours rings · N9 `--eu-color-surface-2` · N10 letter-spacing px
        (+ the approved tokens) · (5) Batch B — pager + alerts: MR-4 Pause · MR-16 focus stops it · NEW-A1 overscroll ·
        N1 double timer · EX-3 focus after dismiss · MR-5 touch pause · (6) Batch C — the Educo app, its OWN branch: AM-1
        `animate-in` · N4 loaders · CE-19 mobile spinner · then the rest of the verified ledger by area
    - `[ ]` **SP CHECK — for the HEADED UAT** (15 lines in `01-codepen-sticky-fixed.md`): anchors / Tab / Page Down land
      below a fixed bar and a sticky header at every rung · `pinArrival` in Chromium, Firefox, WebKit, without
      `animation-timeline`, under reduced motion, `condense` never jumps · a pin + an entrance effect keep both · a
      transformed / glass ancestor capturing a fixed block (`capturesFixed`) · bars stacking at 360px when one wraps or
      is unpinned on the phone · a sticky sidebar under the header with room to travel · canvas = export for held blocks
      with zoom · held bars at 200% zoom / 150% text on 360×640 · `bgAttach: fixed` on iOS / low-end Android · a bottom
      bar + keyboard · `pinStackScript` re-measuring when late images change a bar's height
- `[x]` **My research of what is left** — to be added here (RULE R: the crawl tiers 95/99, `docs/LAYOUT_BENCHMARK.md`, — AUDIT 2026-10-06: overtaken: 1.1.5 frozen without it; R-3 (`ff5c53a`) and R-4 (`f25b6a6`) researched the grid, L-6 holds the innovative pages
  the innovative structures) before the list is frozen
- `[x]` **FROZEN** — the user approves the list; from then on nothing is added to the layout without the user's word — AUDIT 2026-10-06: signed by the user 2026-10-02 (1.1.5 header)

### 1.2 · The original queue (after the four tasks)

- `[ ]` **"Place here"** + **"Return to original position"** — approved plan — AUDIT 2026-10-06: PARTLY: putting a floated block back returns it to its own parent and place (E2-19, `979fc5d`); "Place here" itself not built
  https://claude.ai/artifact/M5bfZ5NtDiW9oYjZ6NPNqN, nothing built. On release offer "Keep floating" / "Place here"
- `[ ]` "Add a block inside" NESTS each click instead of adding a sibling — AUDIT 2026-10-06: still true (E2-20, 2026-10-06); the phone side is BATCH E-5
- `[ ]` "Side by side" creates an empty row that clicked tiles land AFTER, not inside — AUDIT 2026-10-06: still true (E2-20); its resize half E2-22 is in BATCH L-5
- `[ ]` A resize can leave a stale `alignSelf` on old saved pages (may need a migration) — AUDIT 2026-10-06: no migration yet; the same family as #42 → BATCH L-5

### 1.3 · The roadmap after the layout closes (in this order)

- `[x]` **Documentation site** — `docs-site/` on Docusaurus, the FIRST thing after the layout closes (RULE DOC) — AUDIT 2026-10-06: BUILT EARLY at the user's word: BATCH D-2 (`f437b5c`), D-3 (`af533ac`) — `docs-site/` over `docs/guide/`
- `[ ]` **Semantic layer** — decisions A1 · B1 · C1 made; plan https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ
  - `[ ]` `lang` per page and per block (RULE AF: languages are content) — AUDIT 2026-10-06: not built: the export writes `<html lang="en">`
- `[ ]` **Template feature** — gallery per RULE S; plan artifact for the user's approval first
- `[ ]` **Template library** — one original template per crawled site (~475); `docs/TEMPLATE_LIBRARY_PLAN.md`
- `[ ]` **Components, rebuilt one by one from scratch, every variation** — research first (RULE R); each row of
  `docs/COMPONENT_GAPS.md` is a child of this branch
  - `[~]` Navigation component — plan artifact claude.ai/code/artifact/986a870a-c2e0-43a3-89f3-f7a488be6c5c PARKED by
    the user (2026-09-28: layout only, no component questions during layout work)
  - `[ ]` Hamburger / overlay menu · Forms · Tabs · Steps · Tables · Pricing tables · Breadcrumbs · Pagination · Modal ·
    Logo strip · Tags · Inline links · Theme editor (personality) · Carousel · Calendar · News feed · Staff directory ·
    Map · Downloads · Search · Login panel · Newsletter sign-up · Social row
  - `[ ]` Image — rebuilt as a component; includes a FOCAL POINT on every picture (nine-point, like a background's position)
    used by every crop, and built for the phone / tablet app (`apps/mobile/`) in the same work (the user, 2026-10-06, G3d-1)
- `[ ]` **LLM website builder** — v1 deterministic composer → v2 a Claude call emitting the block model → v3 own
  fine-tuned open-weights model (never trained on Claude outputs)
- `[!]` **Builder parity roadmap, Phases 0–9** (memory `project_builder_parity_plan.md`) — Phase 0 done, Phase 1 in
  progress when last recorded; Phases 5–9 need a backend. Reconcile with this tree when the layout closes

## 2 · Risks mitigated by rule (RULE RK — `docs/RISKS.md`)

- `[ ]` **Pilot cohort** — ten real schools (Nigeria and Ghana first), recruited while the components are built
- `[ ]` **Distribution plan** with an owner and a date; the one-hour "show it once" path
- `[ ]` **Demo site** rebuilt from the sweep's own dressed pages, so what is shown is what is measured
- `[ ]` Adoption numbers reported beside the sweep numbers

## 3 · Developing countries first (RULE AF — `docs/DEVELOPING_COUNTRIES_FIRST.md`)

- `[x]` Low-cost phones (Tecno, Infinix, itel, Redmi) in the Preview device list — `bc89d68`
- `[ ]` Weight budget and Slow-3G profile → see 1.1.1 — AUDIT 2026-10-06: → BATCH L-6 (queued)
- `[ ]` Offline-first application layer · Paystack / Flutterwave · WhatsApp / SMS · cheap static hosting and local
  domains · second-language versions · templates from the region — each its own area, researched first

## 4 · The rest of Educo (the "original work" to go back to)

- `[ ]` **One engine for the whole of Educo** (RULE APP) — screens migrate to the shared block model and catalogue, one
  area at a time, as components land
- `[!]` **School-admin MVP audit** — punch-list in `docs/MVP_AUDIT.md` (memory `project_mvp_audit.md`)
  - `[ ]` **13 menu pages never built, hidden until they are** (S2-i, the user 2026-09-30): School Information, Branches,
    Academic Years, Sections, Departments, Subjects, Exams, Syllabus, Assignments, Dormitory, Transport, Settings →
    Schools & Branches, Settings → User Management. Building one = the page + deleting its line from `UNBUILT` in
    `components/layout/Sidebar.tsx`; list in `docs/MVP_AUDIT.md` → "Menu links with no page"
- `[!]` **Mobile Drive feature** — memory `project_drive_status.md`
- `[ ]` **Builder on phone and tablet** — a webview over the real export, inside the Educo app (rule 20); after the web — AUDIT 2026-10-06: the L-2 fixes for the app are BATCH M-1 (queued)
  builder is finished. Its first piece is queued as BATCH M-1 (the user, 2026-10-01: must be done, not now)
- `[?]` **What exactly is "the original work"?** Confirm with the user which of these it means before returning to it

---

## Session log

One entry per session, newest first. Written the moment the user says "new session" (or the context is about to run
out) — where the session STARTED FROM, where it GOT TO, and where the next one CONTINUES FROM.

### 2026-10-07 · session E-5c (the build) · branch `builder/phone-editing`
- **Started from:** session E-5b/E-5c's handover (`b71d6eb`), BATCH E-5c (2) THE BUILD (YOU ARE HERE), T1–T3 signed.
- **Got to:** **E-5c CLOSED** — a tablet (600–1023) edits at its own width 1:1 on its rung, the device following the window (turns
  included); the three African tablet sizes in the Preview and the UAT screens (73); the blocks sheet and More capped at 32rem and
  centred; and, by the user's two decisions mid-build, a tablet gets the phone's one-row bar + More (E5c-2) and the Inspector stays a
  tab below 1024 (E5c-4, reversing T3's "docked at ≥ 900"). The headed pass found five more: the finger's bar covered the block above
  (E5c-5 → the docked phone bar, research rec. 4), floats lost their grip (E5c-6), a float could leave the page (E5c-7), floats were
  measured from the content box and jumped (E5c-8, older than E-5c, a mouse too), a float's resize slid its top (E5c-9). HEADED UAT
  590 / 0 on the final build (`uat-e5c-headed.js`, 15 runs, six windows), test:fast 3,343 + the 2 chrome specs updated after it,
  vitest 4,445, eslint 0 / 105, docs:build. Docs: story §11, `website-builder.md`, research rec. 3 amended, `phone-editing.feature`.
- **Continue from:** **BATCH E-5d · The app** — T4–T8 DECIDED by the user at the end of this session (all as recommended: add `react-native-webview` 13.15.0 · a one-time code · native cache + local save · deep links first · edit from day one).
  Then its research gaps (none signed for the app's build beyond §2 E) and its HEADED checklist on both emulators (5554 tablet, 5556 phone).
  The pull request for `builder/phone-editing` is still the user's to open from the compare link when they ask.

### 2026-10-07 · session E-5b/E-5c · branch `builder/phone-editing` — HANDOVER (both held: the context is genuinely long — the whole of E-5b with 16 ledger lines, seven builds and seven headed passes, then the E-5c research — and the boundary is clean: everything committed, the research signed, nothing running, ports free; the next job, the tablet build, is heavy)
- **Started from:** session E-4/E-5a's handover (`3763c43`): BATCH E-5b.
- **Got to:** (1) **E-5b CLOSED** (`6ae39da`): a finger resizes and drags (`followGesture`: a mouse keeps mouse events, a finger
  pointer events + `pointercancel`); long-press lift (`armLift`: chip above the finger, kept on screen; `scrollNearEdges`); the grip
  for a finger where the bar sits by its block (none in a phone's docked bar — the user's decision on E5b-8); finger strips read
  from the drag; 44px hit areas OUTSIDE the block under every handle (`HIT_POS`, `CHROME_Z.handleHit`); two older bugs fixed
  (E5b-3 corner anchor + still press; E5b-16 the grid preview shrank the page mid-drag). HEADED 206 / 0 · vitest 4,442 ·
  test:fast 3,333 · docs:build. (2) **E-5c research SIGNED** (`c8857ee` + this entry): `docs/web-anatomy/tablet-and-app-editing.md`;
  the user waived their own sources for E-5c only; T1–T3 signed; T4–T8 (the app) recorded as `[?]` under E-5c, asked at E-5d.
- **Continue from:** **BATCH E-5c → change (2) THE BUILD** (a)–(f): its HEADED checklist first (RULE X), then T1 tablets edit at
  their own width 1:1 · T2 the three African sizes in `lib/preview-devices.ts` · T3 the capped centred sheet + the Inspector docked
  ≥ 900 · the finger re-measured on tablets · the story's §11. Then **BATCH E-5d · The app** — ask T4–T8 first.

### 2026-10-07 · session E-4/E-5a · branch `builder/phone-editing` — HANDOVER (the user: "please write a new prompt for the next session"; both held: the context is genuinely long — E-4, the merge, the E-5 research, the whole of E-5a with 19 ledger lines and two decisions — and the boundary is clean: everything committed at `75008d8` + this entry, nothing running, ports free)
- **Started from:** session E-3's handover (`e510976`): BATCH E-4 change (2).
- **Got to:** (1) **BATCH E-4 CLOSED** (`0c31896`): the Preview on every screen; `test:fast` runs all FOUR screens at 8 workers
  (3,272 → now 3,312, ~12.5 min). (2) **PR #7 MERGED** (`05c66ee`), `builder/editor-small-screens` deleted, `builder/phone-editing`
  cut. (3) **E-5 research SIGNED** (`docs/web-anatomy/phone-editing.md`: the user's Wix + one.com links read completely, mine across
  ten editors + WCAG / Apple / Android; D1–D6). (4) **E-5a (in BATCH E-5) CLOSED** (`75008d8`): a phone edits at its own width; the blocks
  sheet with Before / After / Inside / Start / End; ↑ ↓ arrows; ½ ⅓ widths; 44px on touch everywhere; the user's E5a-16 (one-row
  phone bar + More sheet) and E5a-7 (touch bar two rows at 1280, one from 1366); the toolbar docks at the bottom on a phone.
  HEADED 258 / 0; gate vitest 4,442 · test:fast 3,312 · docs:build.
- **Continue from:** **BATCH E-5b · A finger drags and resizes** (QUEUED → open it): E5a-1 — resize and drag listen to the MOUSE
  only (`BoxCanvas` `startResize` / `startResizeGridCell` / `startResizeAbsolute` / `startDrag`, document `mousemove`/`mouseup`), so
  a finger can do neither on any touch device; move them to POINTER events (capture, `pointercancel`), long-press to lift a block
  (500ms, a chip above the finger, an insertion line, auto-scroll), the grip offered to a finger again (it is `pointer-coarse:hidden`
  now), and E4-9 — drop strips ≥ 44px on touch. Then **BATCH E-5c** (the tablet 600–1023, then `apps/mobile/` as a webview).

### 2026-10-06 · session E-3 · branch `builder/editor-small-screens` — HANDOVER (the user: "give me the prompt for the new session"; both held: the context is genuinely long — the tree audit, a whole batch with 11 ledger lines, five builds, four headed passes, the new rule — and the boundary is clean: everything committed at `6042e79`, nothing running, ports free)
- **Started from:** session E-2's handover (`0bb6d77`): the tree audit, then BATCH E-3.
- **Got to:** (1) **the tree audit** (`4fcf59a`): 109 lines re-marked with evidence, its true count of what is left of the layout at
  the head of section 1.1; E-6 / SP-12b renamed; P-1 · P-2 · G-4 · P-3 · G-5 · G-6 given queued headings. (2) **BATCH E-3 CLOSED**
  (`889878b`): HEADED 297 / 0; real bugs E3-5 (a still tap goes through a PARENT's handle) · E3-7 (top bar one row 1280 – 1920) · E3-9 /
  10 / 11 (the shared Modal: Escape, the page's keys under a dialog, focus in and back); gate vitest 4,409 · test:fast 815.
  (3) **DONE IS DONE EVERYWHERE** (`8395e1f`), the user's rule: CLAUDE.md rule 7 + AFTER checklist; `staleLines()` in
  `tests/unit/task-tree-batches.test.ts`; 13 more stale lines closed. (4) **E3-3 decided** (the user took my recommendation) and built
  as **BATCH E-4 change (1)** (`6042e79`): the Inspector follows the width at every crossing of 64em; HEADED 66 / 0; gate vitest 4,418 ·
  test:fast 816.
- **Continue from:** **BATCH E-4 (OPEN, YOU ARE HERE)** → change (2): measure multipage-preview 5 · pager-hero 1 ·
  component-layout-invariants 1 on tablet-landscape / tablet-portrait / mobile-chrome (HEADLESS GATE, labelled), each a spec that
  assumes the desktop or a real bug, into LEDGER E-4 the moment it is found; add their checklist lines BEFORE the pass; then
  change (3) `scripts/test-fast.js` runs the tablet and phone projects; then the six-window headed pass (`uat-e4-headed.js`), docs,
  the gate, close E-4 (ticking every line that tracks it), then the pull request (the user opens it from the compare link).

### 2026-10-06 · session E-2 · branch `builder/editor-small-screens` — HANDOVER (the user: "let's hand over and move on to the new session"; both held: the context is genuinely long — a whole batch, 24 ledger lines, ~40 probes, three headed passes, the full gate — and the boundary is clean: everything committed at `979fc5d`, nothing running, ports free)
- **Started from:** session G-3d's handover (`9ded396`), BATCH E-2 (YOU ARE HERE), the 37 failing small-screen specs.
- **Got to:** **E-2 CLOSED** (`979fc5d`). Decided by the user: Full width is always the desktop page (75rem, shrunk to fit — twice,
  the second time with the measured desktop cost). 16 real bugs fixed with guards proven red (E2-2 · 4 · 7/12 · 8 · 11/23 · 13 ·
  14 · 15 · 16 · 17 · 18 · 19 · 21 · 24), 22 desktop specs moved to page px / the person's aim. Queued by the user: E2-20 adding
  blocks on a phone → BATCH E-5 (research first); E2-22 Side by side columns cannot be resized against each other → BATCH L-5
  (in #46's place, which E-2 closed). HEADED UAT `uat-e2-headed.js` 174 / 0; gate typecheck 0 · eslint 0 errors · vitest 4,405 ·
  test:fast 812 · docs:build SUCCESS.
- **Asked at the end (the user, "what is left for the layout task?"):** answered from the tree; many layout lines look stale
  (e.g. the Docusaurus site still listed under 1.3 though D-2 built it). The user: "yes, please do that" — the TREE AUDIT below.
- **Continue from:** (1) **THE TREE AUDIT** (read-only, short): every open line under 1.1 (1.1.1 Task 1 · 1.1.2–1.1.4 · 1.1.5 the
  frozen list) and 1.2 / 1.3, checked against the code (grep) and `git log`; a line that is DONE is closed with its commit or
  measurement, a stale one corrected, nothing deleted; then the user gets a TRUE count of what is left of the layout, grouped
  as the end-of-session answer was. (2) **BATCH E-3 (YOU ARE HERE)** — its HEADED checklist first, then spacing-gestures 12 ·
  masonry-builder 10 · canvas-zoom 3 · text-is-reachable 1 on tablet-landscape / tablet-portrait / mobile-chrome, each measured
  (a spec on screen px or a real bug — E-2 found both), and D3-32 (the top bar one row from 1280, labels collapsing to icons).
  Then E-4 (incl. E-1 (2): `test-fast.js` runs the tablet and phone projects), then E-5 (research first).

### 2026-10-06 · session G-3d · branches `builder/page-grid` → `builder/editor-small-screens` — HANDOVER (the user: "create a new branch, give me the next session"; both held: the context is genuinely long — a whole batch, three changes, four headed passes, the gate, the PR — and the boundary is clean: PR #6 merged, the new branch cut, nothing running, ports free)
- **Started from:** session 49087f08's handover (`99c6c7b`), BATCH G-3d (YOU ARE HERE), G3d-1 decided.
- **Got to:** **G-3d CLOSED** (`ec52b51`): (3) a 10rem floor per block of a page-grid row below the tablet rung (`BLOCK_FLOOR_REM`,
  `rowNarrowsAt`), (1) a lone block on its line takes the phone's whole line (`rowLinesAt`), (2) a picture alone in a block spanning
  rows fills it (`fillsRows`, `--bx-fill` on the block, "Fill the block's height" switch); a saved page byte-identical to `99c6c7b`.
  HEADED UAT `uat-g3d-headed.js` 91 / 0, regression 210 / 0, docs 36 / 0; gate typecheck 0 · eslint 0 errors · vitest 4,400 ·
  test:fast 807. Ledger G3d-2 … G3d-12 closed. **`builder/page-grid` pushed, PR #6 merged by the user (`7494a8e`), branch deleted;
  `builder/editor-small-screens` cut from that master.**
- **Continue from:** **BATCH E-2 (YOU ARE HERE)** on `builder/editor-small-screens`: write its HEADED checklist first, measure each of
  the 37 failing specs on tablet-landscape / tablet-portrait / mobile-chrome (a spec that assumes the desktop, or a real bug — fixed
  either way, mutation-proven), then its headed pass; then E-3 (incl. D3-32 top bar one row from 1280), then E-4 (incl. E-1 (2): the
  gate runs the tablet and phone projects). Traps: see the next-session prompt in the conversation; the older queued "BATCH E-1 · The
  empty-box hint" (~line 2523) is a different, unrelated batch with a colliding name.

### 2026-10-06 · session 49087f08 · branch `builder/page-grid` — HANDOVER (the user: "let's start a new session"; both held: the context is genuinely long — D-3 (2)'s four audits, 19 ledger lines, five artifacts, two headed passes, the G-3d map — and the boundary is clean: everything committed at `5bc1256`, nothing running, ports free)
- **Started from:** session ff5dbc77's handover (`5ac91fc`), BATCH D-3 change (2).
- **Got to:** **D-3 CLOSED** (`af533ac`): the Website Builder guide checked claim by claim against the code (40 corrections) and driven
  headed (slices I–N of `docs-shots-headed.js`), six pictures, the README index, the reference's control names GUARDED against the
  builder (D3-39), docs anchors checked (D3-46); five artifacts corrected and pointed at the docs site (Hub v36 · Layout System v20 ·
  Parity Audit v20 · page-grid plan v3 · Website Builder Guide v28). PRODUCT fixes: Accordion hint counts its 29 designs (D3-33), a
  gallery photo's ✕ visible on hover and touch (D3-44), the shared Modal's subtitle wraps (D3-47), docs tables scroll on phones
  (D3-48/49). Gate: typecheck 0 · eslint 0 errors · vitest 4,375 · test:fast 807; headed docs 36 / 0. Then **G-3d MAPPED** (`ad38abf`)
  and **G3d-1 DECIDED** by the user (`5bc1256`): centre crop now; the focal point goes to the Image component, web + app.
- **Continue from:** **BATCH G-3d (YOU ARE HERE)** — BDD first, then (3) the 10rem floor on each block's COLUMNS, (1) a lone block takes
  the phone's line, (2) a picture fills a block spanning rows (centre crop, `ponytail:`), the six-window headed pass with the Preview
  at all 70 screens at 100 / 150 / 200 %, the gate, then the story's §2 / §4 / §6¾ and the reference row rewritten, the two phone
  pictures retaken. Then E-2 → E-3 → E-4 on `builder/editor-small-screens`.
- **Next prompt:** given in the user's chat at this handover (2026-10-06).

### 2026-10-06 · session ff5dbc77 · branch `builder/page-grid` — HANDOVER (the user asked "new session or continue here?"; recommended once both held: the context is genuinely long — D3-1 and all of D-3 change (1) with 32 ledger lines, two product fixes, ~30 screenshots read, two full gates — and the boundary is clean: everything committed at `5423dde`, every server stopped)
- **Started from:** session 148707ee's handover (`0531c06`), BATCH D-3, D3-1 open for the user.
- **Got to:** D3-1 DONE (`51a2317` — the user: keep the 14px look; body sized once over the unchanged 15px root; D3-2: lowering the
  base would have shrunk every rem). **D-3 change (1) DONE** (`dfb0c36`): 19 pictures built through the UI in `docs/guide/img/`
  (`scripts/uat/docs-shots-headed.js`), the reference's tables rewritten from the code, 4 tips, eleven word/builder disagreements fixed;
  PRODUCT: Reset asks first and is undoable (D3-16), DeleteConfirmationModal a named alertdialog whose Escape works (D3-18/19); docs
  site Previous/Next stack at 200 % (D3-22); headed docs 24/24 at all 70 screens, Reset 56/56; gate green (vitest 4370, test:fast 807).
  The user decided D3-31 → G-3d change (3) (a 10rem floor per block on a phone) and D3-32 → E-3 (top bar one row from 1280) (`5423dde`).
- **Continue from:** **BATCH D-3 (YOU ARE HERE) → change (2)**: write its checklist lines first (U-lines under D-3), then the Website
  Builder Guide's non-layout parts (`docs/guide/website-builder.md`: content, components, themes, Preview, Page check, export) checked
  against the CODE and through the UI the way change (1) was (pictures where they help, same clean format), the README index, and the
  artifacts (Builder Hub · Layout System · Builder Parity Audit · the plan — read each with `Artifact action:"read"`, correct to what was
  built in G-1 … G-3c, E-1 and D-3, point them at the docs site); docs:build + docs guard; headed docs pass (`uat-d3-docs-headed.js`);
  close D-3 (every ledger line closed), commit. Then BATCH G-3d (3 changes), then E-2 → E-3 → E-4 on `builder/editor-small-screens`.
- **Next prompt (paste to start):** given in the user's chat at this handover (2026-10-06).

### 2026-10-06 · session 148707ee · branch `builder/page-grid` — HANDOVER (both held: the context was summarised once, and the boundary is clean — D-2 committed, nothing running; the user: "let's start a new session")
- **Started from:** session 22981e0a's handover — PR of `builder/layout-uat` merged (`1541d98`), `builder/page-grid` cut from master, BATCH D-2.
- **Got to:** **BATCH D-2 CLOSED** (`f437b5c`): `docs-site/` (Docusaurus 3.10.2 classic, `docs/guide/` as the single source, README.md
  excluded, the layout story at `/`); `docs/guide/layout-story.md` rewritten §1–§11 incl. the whole page grid; new
  `docs/guide/layout-reference.md` (every control by its panel name + shortcuts); `tests/unit/docs-guard.test.ts`; `npm run docs:build`
  / `docs:start`. The user looked at it and decided the typography: 15px body (below RULE DOCS' 16px — the user's call), fluid
  headings, line-height 1.75, callout cards, rounded tables/images; found D2-4 (too large) and D2-5 (the 72ch blank band) — both fixed.
  Scaffold leftovers removed.
  AFTER THE FIRST HANDOVER (`98d2bba`): the user asked that every docs size follow the reader's BROWSER text size (rem, WCAG 1.4.4) —
  it does; D2-7 fixed the two Docusaurus px font sizes (phone menu "Back", collapsible contents), measured with Chrome's real font-size
  preference at 12 / 16 / 24 (all text ×0.75 / ×1 / ×1.5). D3-1 found and OPEN, the user to decide: the base size is applied twice
  (Infima on `html` + `custom.css` on `body`) → body is 14.06px at a 16px browser, not 15.
- **Continue from:** **BATCH D-3 (YOU ARE HERE)** → D3-1 (ask the user: keep the 14px look or 15), then change (1) pictures and
  examples in the layout pages, then (2) the rest of the
  documentation; then BATCH G-3d; then E-2 → E-3 → E-4 on `builder/editor-small-screens` (unchanged from the 22981e0a entry below).
- **Next prompt (paste to start):** the full prompt is in the user's chat at the handover (2026-10-06); its short form: "Branch `builder/page-grid` at the handover commit. Read CLAUDE.md (RULE M Ponytail before AND after
  everything; RULE DOC / RULE DOCS; RULE Y build through the UI; RULE Z headed, six windows; RULE K), then `docs/TASK_TREE.md`: the
  newest SESSION LOG entry (148707ee), then BATCHES → D-2 (closed — its typography decisions and ledger D2-1…D2-6) and D-3 (open).
  DO, IN ORDER: (1) RULE K — check ports 3000/3100/3200/4000 are free; (2) D-3: write its HEADED checklist first; change (1): build
  the app (`next build`, `next start` on 3100, `node scripts/check-fresh-build.js` must print FRESH), build each layout-story scenario
  THROUGH THE UI and screenshot it (canvas + Preview, a phone and a desktop width where the scenario is about screens), save under
  `docs/guide/img/` (small PNG/WebP, resized to their shown width — RULE AF weight), embed with alt text in `layout-story.md` and the
  main panels in `layout-reference.md`, add `:::tip` callouts where a scenario has a trick; `npm run docs:build` + docs-guard; look at
  the site HEADED (`npm run docs:start` on 4000) at 375/768/1280/1536, light and dark, 200% text; stop every server after. Then
  change (2): the Website Builder Guide's non-layout parts, the README index, the artifacts corrected to what was built. Then close
  D-3, then BATCH G-3d (its own checklist; see the 22981e0a entry for its details). TRAPS: never `git checkout <file>` to undo; a closed
  batch must not hold an open ledger line (the batch guard fails); the docs-guard reads sidebar doc IDs as lowercase-hyphen strings;
  every docs size is rem — relative to the reader's browser text size, never px (WCAG 1.4.4, D2-7); settle D3-1 with the user first."

### 2026-10-05 · session 22981e0a · branch `builder/layout-uat` — HANDOVER (recommended once both held: the context is genuinely long — G-3b's (3) and (6), its whole final pass, all of E-1, about twenty six-window headed runs and five full gates — and the boundary is clean: everything committed, nothing running; the user agreed: "let's start a new session")
- **Started from:** session 3da81fad's handover — BATCH G-3b (3) Alt free, then (6) rows, then its final pass, then E-1.
- **Got to:** (1) **BATCH G-3b CLOSED** (`30eee12` (3) · `b97f839` (6) · `2515755` close): Alt free = the nearest lines + a free
  margin inside them (`freeInset`, % of the block's own columns, per screen); an Alt drag of a page-row block SLIDES it along its line
  (`slideFreeAt`), never floats it; "Rows tall" 1–6 per screen (the Grid block's `rowSpan` reused), placed as grid auto-placement
  places it (`rowLinesAt` with `x` / `cont`); the fit rule drops spans and free margins where it steps. Final pass ~300 headed checks
  0 failed; regression G-3c / G-3 / G-2 clean; 59 saved pages byte for byte (but the chosen empty-picture placeholder). Ledger
  G3b-15 … G3b-29 all closed (real: 16 · 18 · 19 · 23 · 24 · 27 · 28; 17 = 18's cause; the rest my tests). (2) **BATCH E-1 CLOSED**
  (`e69d4e3` · `aa1d91f` · `0dbf69a`): add-without-asking's 7 were the spec assuming the desktop; the headed pass found and fixed
  E1-7 (the Inspector tab's word 2.6:1), E1-8 (the canvas chrome drawn over the narrow-screen Inspector → `CHROME_Z.drawer` 9450),
  E1-9 (that z-index covered the header's menus when docked → class + CSS variable, `lg:z-auto`), E1-6 (my edit dropped G-3's header
  from this tree → the tree guard now fails on a named batch with no header). (3) THE USER'S DECISIONS: E-1 split by area — the
  gate's 76 browser specs on tablet / phone fail 70 in 14 specs → QUEUED E-2 (resizing and dropping, 37) · E-3 (the Inspector's
  controls on a narrow screen, 26) · E-4 (Preview and components, 7; E-1's (2) — the gate runs tablet + phone — switches on when E-4
  closes); "yes to both" → QUEUED BATCH G-3d (a lone half-width block takes the phone's whole line unless its width was set on the
  phone · a picture fills a block that spans rows, cover, with a switch).
- **MERGE (the user, 2026-10-05):** "push; I open the PR" — `builder/layout-uat` pushed with this handover; the user opens and
  merges the pull request on GitHub (`gh` is not installed here); the documentation gap is stated in it and fixed FIRST on the new
  branch (BATCH D-2 — then widened by the user: set up the Docusaurus site now and rewrite the documentation cleanly from the
  beginning, the layout first, and keep it updated with every batch).
- **Continue from:** **check the pull request is merged**, delete `builder/layout-uat` (local + remote) and cut `builder/page-grid`
  from the fresh master (rule 9), then **BATCH D-2 (docs)**, then **BATCH G-3d (YOU ARE HERE)**, then — on its own short branch
  `builder/editor-small-screens` — E-2 → E-3 → E-4, then the rest of the page-grid plan P-1 · P-2 · G-4 · P-3 ·
  G-5 · G-6 (see AC-37b), then L-5 · L-6 · S-3 · D-1, the frozen list 1.1.5, Tasks 2–4 (L-7 · L-8 · L-9), the re-sweep + the layout
  story → pull request.
- **Next prompt (paste to start):** "FIRST: check that the pull request of `builder/layout-uat` into `master` is merged (git fetch; `git log
  origin/master` holds this handover). If it is: `git switch master && git pull`, delete `builder/layout-uat` locally and on origin, and
  `git switch -c builder/page-grid` (rule 9). If it is not, stop and ask me. Then read CLAUDE.md (incl. RULE M — Ponytail, a BEFORE and AFTER step EVERY time, for everything: find out exactly what is needed, add nothing that was not asked for, the ladder YAGNI → reuse → stdlib → native → installed dep → one line → minimum; RULE DOC and the new RULE DOCS — the documentation is clean, complete and kept current, the Docusaurus way), then `docs/TASK_TREE.md`: this SESSION
  LOG entry, then YOU ARE HERE (AC-37b → BATCH D-2, then G-3d), then in BATCHES: D-2 (the Docusaurus site and the layout documented from the beginning — FIRST; the user: "rewrite everything … clean … follows docusaurus.io … then we update it as we go along"), D-3, G-3d
  (two changes, the user's decisions), G-3b
  (closed — its DESIGN paragraph and ledger G3b-15 … G3b-29), E-1 (closed — E1-5's measured 70 small-screen failures and E1-8/E1-9),
  and the queued E-2 / E-3 / E-4. Then read, in `lib/box-model.ts`: `rowLinesAt` (x / rows / cont), `pageRowCells`, `pageRowCSS`,
  `rowQueryCss` (the fit rule's steps, `floorWith`, `withoutRowSpans`), `fitScreens` / `fitStepAt`, `slideFreeAt`, `setFreeInset`;
  and the Image block's sizing (`imageSizing`). DO, IN ORDER: (1) RULE K — nothing on 3100 / 3200; (1b) BATCH D-2 — read `docs/DOCUSAURUS.md`, write D-2's checklist first, set up `docs-site/`
  (Docusaurus 3 classic, docs from `docs/guide/`), make it clean to read (the deck's typography, light + dark, measured), take the
  inventory, then rewrite the layout from the beginning as the story + the reference, add the guard, look at it HEADED; D-3 follows; (2) BATCH G-3d —
  write its HEADED
  checklist first; (1) a lone half-width block on a stepped phone line takes the whole line unless its width was set on the phone;
  (2) a picture alone in a block that spans 2+ rows fills its height (cover, focal point) with a "Fill the block's height" switch
  (RULE UI) — BDD first, unit guards mutation-proven, then a six-window headed pass (`scripts/uat/uat-g3b-headed.js` slices K and
  L are the starting point) with the Preview at all 70 screens at 100 / 150 / 200 %, full gate, close; (3) BATCH E-2: run its specs on
  tablet-landscape / tablet-portrait / mobile-chrome against `next start` (BASE_URL=http://localhost:3100), measure EACH failure
  (headed probe, screenshots read) — a spec assuming the desktop (the Inspector starts as its tab under 64em; the page is shown
  scaled when the blocks panel docks at 1024) or a real bug — fix either way, headed pass, gate. STANDING DECISIONS: the AC-37b plan,
  R-4's D1–D5, every decision in G-3b / G-3c / E-1's ledgers. NOT DONE: G-3d, E-2 … E-4, P-1 … G-6, the artifacts (plan
  https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN out of date · Builder Hub · Layout System · Parity Audit · Website Builder Guide)
  and the layout story for the page grid (RULE L) — now BATCH D-2, first on the new branch (the user's decision). TRAPS: NEVER `git checkout <file>` to undo — write the saved string back; write edit
  scripts with the Write tool or a quoted heredoc with no backslashes (sed and node -e mangle them; JS `replace` eats `### 2026-10-05 · session 3da81fad · branch `builder/layout-uat` — HANDOVER`); a JSX
  comment beside a single child breaks the parse; a "killed" serve notice is not the server dying — check the port; never vitest and
  Playwright at once; a headed UAT's test aim can be wrong (G3b-26 / 29 / 22) — read the screenshot before blaming the product."

### 2026-10-05 · session 3da81fad · branch `builder/layout-uat` — HANDOVER (recommended once both held: the context is genuinely long — G-3b's four changes and all of G-3c, about fifteen six-window headed passes, five full gates and twelve decisions of the user — and the boundary is clean: everything committed at `5274e18`, nothing running; the user agreed: "Yes. Let's move on to a new session")
- **Started from:** session 5da86722's handover — BATCH G-3b (the page as a real CSS grid) next.
- **Got to:** (1) **G-3b (1), (2), (4), (5) DONE** (`e70850a`, `e8d0d55`, `f4bacbc`): a row of the page is a CSS grid on the page's own
  lines (`isPageRow`, `pageRowTracks` — the same track count on every screen, `rowTrackCount`), G3-8 closed at 0.00px; the fit rule
  steps every line by span; "Space between columns" / "…rows"; From line · To line · Whole line · To the last line · Bleed in the
  Size section (`linesAt`, `setLinesAt`, `fullWidthAt`, `bleed`). (2) **BATCH G-3c CLOSED** (`825e102` + `5274e18`): the page's frame
  on all four sides from ONE emitter (`FRAME_CSS` / `frameCss`, `pageFrameEnds`, `frameRemAt`, `rowSideRemAt`). (3) Found and fixed:
  empty pictures published nothing (G3b-12, found by the user), the fit rule overrode a width set for a screen (G3b-11), every fluid
  label said "value ÷ 16 rem" (G3c-1, G3c-10), the panel stuck open after "Back to default" (G3c-11), two flaky Preview specs
  (G3b-7a/b), and a new headed slice I proves every palette block is SHOWN in the Preview. (4) THE USER'S DECISIONS: equal cards over
  exact lines (G3b-3) · split column / row gaps · the frame all round, 1 → 1.25 rem, adjustable to 0 · empty picture = the same box, a
  soft placeholder · a width set for a screen wins over the fit rule · fluid sliders say phone → wide · the frame before G-3b's end ·
  the 7 tablet / phone editor failures (G3c-13, present before G-3c) → BATCH E-1 after G-3b.
- **Continue from:** **BATCH G-3b (YOU ARE HERE) → change (3) Alt free → lines + margin**, then (6), then G-3b's final pass, then E-1.
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then `docs/TASK_TREE.md`:
  this SESSION LOG entry, then YOU ARE HERE (AC-37b → BATCH G-3b), then in BATCHES: G-3b (its changes, its HEADED UAT CHECKLIST U1–U9,
  its DESIGN paragraph and LEDGER G3b-1 … G3b-14), G-3c (closed — what the frame is and the ledger G3c-1 … G3c-13) and the queued E-1.
  Then read: `docs/web-anatomy/css-layout/07-map.md` §1 ("Free placement (Alt)": the drop point → the nearest lines + an offset as
  MARGIN inside the slot, never page x / y) and §2.A rows A6 / A7, `lib/page-grid.ts`, and in `lib/box-model.ts`: `isPageRow`,
  `rowLinesAt`, `pageRowCells`, `pageRowSides` / `pageRowMargin` (the equal shares as CSS of the frame), `linesAt` / `setLinesAt`,
  `frameCss`, `pageFrameEnds`; in `components/website/box/BoxCanvas.tsx`: `startResize` (`snapCols`, `snapEdgePx`, `slotSide` →
  `pageRowSlot(band, id, bp, pageRem)`, `freeWidth` written on an Alt drag). DO, IN ORDER: (1) RULE K — nothing on 3100 / 3200; (2) G-3b
  (3) ALT FREE: today an Alt drag writes a free share (`freeWidth`) that lands between lines; make it the nearest line PLUS a margin
  inside the slot (map §1), on every screen, so 'Line up with the grid' and the fit rule still work — BDD first, unit guards
  mutation-proven; (3) G-3b (6) ROWS: 'span N rows' for a block of a page row (the user: a gallery photo 2 rows tall, height still grows
  with its words) — grid rows on the page row, a control in the Size section beside 'Rows' (RULE UI), the phone falls back; (4) G-3b's
  FINAL headed pass: `scripts/uat/uat-g3b-headed.js` (slices A–I, nine windows) + new slices for (3) and (6), Preview at all 70
  screens at 100 / 150 / 200 %, regression G-3c / G-3 / G-2; (5) full gate (typecheck · eslint · vitest · test:fast); close G-3b; then
  (6) BATCH E-1. STANDING DECISIONS: the AC-37b plan, R-4's D1–D5, session 5da86722's six, and this session's (above). NOT DONE: G-3b
  (3), (6), final pass; E-1; the artifacts (the plan https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN — out of date, Builder Hub,
  Layout System, Parity Audit, Website Builder Guide) and the layout story (RULE L) for the page grid — before the PR. TRAPS: NEVER
  `git checkout <file>` to undo a mutation — it discarded ~150 lines of work once this session; write the saved string back (the
  `mutate*.js` pattern); write every edit script with the Write tool (heredocs and `node -e` mangle backslashes and turn `/c/…` paths
  into `C:\\c\\…`); in a headed script divide only RECTS by the canvas zoom, never computed styles (it bit G3c-5 twice); the
  Preview's `<main>` is `display: contents`; the page fills the window, so 'below the last block' is the page's bottom padding, not
  the white space; a Card / Button is never a 'bleeding section'; test:fast runs desktop-chrome only (E-1 changes that); a
  `NEXT_DIST_DIR=.next-b` build rewrites `tsconfig.json` (restore it), or build an old commit in a `git worktree` with a
  `node_modules` junction (remove the junction before the worktree)."
### 2026-10-04 · session 5da86722 · branch `builder/layout-uat` — HANDOVER (recommended once both held: the context is genuinely long — two batches (G-2, G-3), about a dozen six-window headed passes, three full gates and six decisions of the user — and the boundary is clean: everything committed at `d83939f`, nothing running; the user agreed: "yes")
- **Started from:** session 9fa0fee9's handover — BATCH G-2 next (layout guides + the page-grid panel).
- **Got to:** (1) **BATCH G-2 CLOSED** (`ca5eefe`): layout guides (switch · Shift G · right-click · Page settings), span chips, the
  page-grid panel (columns per screen, phones, row step, side space and gap for the site, a page's own grid, Reset), ledger
  G2-1 … G2-8; 134 headed checks. (2) **BATCH G-3 CLOSED** (`d83939f`): edge-to-edge columns (`rowSide`), column snap on resize
  (`snapEdgePx`, Shift half, Alt free), "Columns (of 12)" + Alt ← / →, "Rows: N", "Line up with the grid", guide lines drawn on
  whole screen pixels (`GuideLines`), half-lines only with Shift; ledger G3-1 … G3-12; 65 headed checks, G-2 as regression 128/0;
  gate typecheck 0 · eslint 0 errors · vitest 4,276 · test:fast 806/806. (3) THE USER'S DECISIONS this session (all in the tree):
  rows drawn with the columns, heights follow content, "span N rows" in G-3b · columns EDGE TO EDGE, the side space the outer
  blocks' default margin · the user's picture of the whole (choose columns and a row size, place by both, bleed, nest, float —
  a float pushes nothing, is pinned to lines, falls back on a phone) · G3-7 fixed now · G3-8 (a ~2px snap offset) carried to
  G-3b · half-lines only while Shift is held · nothing in the page is stored in px (rem / fr).
- **Continue from:** **BATCH G-3b · the page as a real CSS grid** (YOU ARE HERE) — open it in BATCHES, checklist first.
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE (AC-37b → next leaf BATCH G-3b), then in BATCHES the closed
  G-3 and G-2 entries (their ledgers say what the code does now), then the R-4 entry's BUILD BATCHES list: the QUEUED G-3b line,
  the user's decision 'columns EDGE TO EDGE' and THE USER'S PICTURE OF THE WHOLE just above it. Then read: the plan
  `docs/web-anatomy/page-grid/plan/page-grid-plan.html` (published https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN — it still
  shows rows off, a separate 'Grid…' button, dashed lines and strips outside the columns: correct it with the other artifacts before
  the PR), `docs/web-anatomy/css-layout/07-map.md` §2.A and §6.1 (D5), `lib/page-grid.ts`, and in `lib/box-model.ts`: `rowSide`,
  `spanAt` / `setSpan`, `lineUpWithGrid`, `gutterCSS`, `pageBandInset`, `gridBandOwnsGutter`, the fit rule (`rowNarrowsAt` /
  `rowQueryCss`). WHAT G-3b IS (≤ 6 changes): (1) a page-grid row EMITTED as a real CSS grid (D5) — `gridTemplate(cols)` per rung,
  columns edge to edge, each block `grid-column: span k` from its share, the side space the outer blocks' margin (rowSide), the gap
  as the grid's — canvas == export, saved pages byte-identical; this also closes G3-8 (a snapped edge exactly ON the drawn line);
  (2) start line / 'to the last line' / full / bleed / half-bleed per rung (map A1–A5, A15); (3) Alt free → lines + margin, never
  page x / y; (4) the fit rule for every block on the grid (proof rule 4, whole words); (5) the panel's 'Space between columns'
  (carried from G-2); (6) rows as real grid rows ('span N rows', the user's) — plus the nested-tree check G-3's slice F started.
  DO, IN ORDER: (1) RULE K — nothing on 3100 / 3200 / 3400; (2) open G-3b in BATCHES, ≤ 6 changes, the HEADED UAT CHECKLIST first
  (every change × the four editor themes × all 70 screens of `screens.js` × each state on / off × every entry point); (3) BDD first,
  every guard mutation-proven; (4) six-window headed UAT on a fresh production build (copy `scripts/uat/uat-g3-headed.js`: its
  `lineGaps` decodes the picture to measure lines), Preview at all 70 screens at 100 / 150 / 200 %; (5) full gate (~13 min:
  typecheck · eslint · vitest · test:fast); commit. STANDING DECISIONS: the AC-37b plan decisions, R-4's D1–D5, and this
  session's six above. NOT DONE: G-3b, P-1, P-2, G-4, P-3, G-5, G-6; the artifacts (plan, Builder Hub, Layout System, Parity
  Audit, Website Builder Guide) and the layout story (RULE L) for the page grid — before the PR. TRAPS: `lib/box-model.ts`,
  `lib/box-site.ts`, `BoxCanvas.tsx`, `page.tsx` are CRLF — edit with a script that normalises to LF and writes CRLF back, or the
  Edit tool; NEVER shell or heredoc text holding a backslash or an escaped quote (eaten four times this session — use the Write /
  Edit tool); bash `/tmp` is not node's `/tmp` (use the scratchpad); a `NEXT_DIST_DIR=.next-b` build rewrites `tsconfig.json`
  (restore it); a background `next start` reported 'failed 127' is the one I stopped; the snap works on the POINTER in
  `startResize` (`snapEdgePx`), never on the result; `GuideLines` measures `[data-layout-guides]` and draws in screen space; the
  header sits on `CHROME_Z.panel` (G2-6); Alt + arrows pass the Z1-j focus rule (G3-3); `rowSide` takes only LENGTH margins
  (G3-11)."

### 2026-10-04 · session 9fa0fee9 · branch `builder/layout-uat` — HANDOVER (recommended once both held: the context is genuinely long — R-4's completeness reading, the map and a 10,908-check proof, the user's signing with D1–D5, and all of P-0 with its probes and two UAT passes — and the boundary is clean: everything committed at `9018368`, the machine clean; the user agreed: "then we'll move on to the new session")
- **Started from:** session 87422eae's handover — BATCH R-4 with its reading done, the map next.
- **Got to:** (1) **BATCH R-4 CLOSED and SIGNED**: completeness closed (575 MDN properties in `css-layout/08`, the 16 sub-guides
  in 05 §7, Learn grid + 22 grid links in 02 §6, 15 flexbox links in 04 §7); THE MAP `css-layout/07-map.md` (six questions a
  person answers, ~110 rows, verdicts, plain words); the PROOF `scripts/research/css-layout-combos.js` (10,908 headed checks,
  0 failed, 8 rules it forced, 07 §4.1); the user's decisions **D1–D5** (07 §6.1 and the R-4 entry). (2) **BATCH P-0 CLOSED**
  (`9018368`): R4-1 … R4-5 fixed, 30/30 headed UAT at 70 screens + 8/8 editor-theme contrast, gate green.
- **Continue from:** **BATCH G-2 · layout guides + grid panel** (YOU ARE HERE) — open it in BATCHES, checklist first.
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE (AC-37b → next leaf BATCH G-2), then the R-4 entry in BATCHES
  (its signed checklist, decisions D1–D5 and the QUEUED build batches). Then read, in this order: the approved plan
  `docs/web-anatomy/page-grid/plan/page-grid-plan.html` (published https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN — its
  toolbar switch, Shift G, the page-grid panel and its ranges), the AC-37b decisions in section 1.1.5 of the tree, `lib/page-grid.ts`
  (columns per rung, span labels — G-1 built the maths, nothing draws it yet), and `docs/web-anatomy/css-layout/07-map.md` §1 and
  §6.1. WHAT G-2 IS (the user, in plain words: 'the grid becomes something a person can see and set'): (1) LAYOUT GUIDES — the
  page grid's column lines drawn over the canvas from the SAME template the page uses (never a second copy), shown while placing
  / dragging, a toolbar toggle + Shift G + a menu item keep them on, the side space drawn AS padding (edge to edge, decision 1),
  per screen (4 / 8 / 12 columns); (2) SPAN LABELS ('6 of 12') on the selected block; (3) THE GRID PANEL — columns, gap and side
  space PER SCREEN, one grid per SITE with a page opt-out (D4 of the plan), every block follows in ONE undo; keyboard and screen-
  reader reachable, all four editor themes. DO, IN ORDER: (1) RULE K — nothing on 3100 / 3200 / 3400 (a 'stopped' next start
  keeps serving: kill the port's PID); (2) open BATCH G-2 in BATCHES with ≤ 6 changes and its HEADED UAT CHECKLIST written first
  (every change × the editor's four themes × every screen of `scripts/uat/screens.js` × each state on / off × entry points:
  toolbar, Shift G, menu); (3) build through the UI, BDD first, guards mutation-proven; (4) six-window headed UAT on a fresh
  production build, the Preview at all 70 screens, the guides NEVER in the published page; (5) close G-2, then G-3 (page-grid
  sections EMITTED as a real CSS grid — D5 — lines per rung, Alt free, the fit rule for every block, nested-trees UAT). STANDING
  DECISIONS: the AC-37b plan decisions (edge to edge; equal lines on every rung; Alt free / Shift half-lines; free placement never
  breaks the page; one grid per site; readable width on) and R-4's D1–D5. NOT DONE: G-2 … G-6, P-1 … P-3; the published artifacts
  (Builder Hub, Layout System, Parity Audit, Website Builder Guide page) before the PR. TRAPS: Advanced CSS exists only on
  catalogue components (Content tab); bands are unselectable scaffolding — select the stack; H.select now names its own step;
  `makeRowBand` makes new ids each call (byte-compare ONE tree); theme colours are OKLCH (measure through a canvas); the 'Website
  theme' menu is the PAGE's theme — the editor's own is 'Change theme'; use the Edit tool, never shell sed, for anything with a
  backslash."

### 2026-10-04 · session 87422eae · branch `builder/layout-uat` — HANDOVER (the user asked "should we not do this in a new session?"; recommended once both held: the context is genuinely long — the plan with the user's decisions, all of G-1 with ~10 six-window headed passes and 17 ledger lines, and R-4's six readers — and the boundary is clean: G-1 committed `2f56caa`, R-4's reading stored and committed, the map is the heavy job next)
- **Started from:** session e9d19b5c's handover — AC-37b, the plan artifact with mockups.
- **Got to:** (1) **the PLAN** published and **APPROVED** with the user's decisions (https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN,
  source `docs/web-anatomy/page-grid/plan/page-grid-plan.html`): edge to edge (no fixed side margins — the side space is the
  row's padding), rows follow content, every block keeps default margin + padding, phone gap tested → 0.75rem, side ≈ 1rem,
  one grid per site, Alt = free / Shift = half-lines, free placement must never break the page, readable width on. (2) **BATCH
  G-1 CLOSED** (`2f56caa`): page-grid pages, new defaults, the row owns the side space, the fit rule as decided (EQUAL lines on
  every rung incl. the phone, words at their real fluid size + padding, the page's side space counted), drops beside the last
  column, RTL fixed, `lib/page-grid.ts`, site / page settings. HEADED six windows × 70 screens CLEAN; gate green (vitest 4,174 ·
  test:fast 806). (3) **THE USER'S RULE** (CLAUDE.md RULE Z + memory): every UAT checks the Preview at EVERY device and
  breakpoint from `scripts/uat/screens.js` (70 screens), guarded by `uat-screens.test.ts`. (4) **BATCH R-4 OPEN, READING DONE**:
  six readers stored `docs/web-anatomy/css-layout/01`–`06` (box alignment · grid guides · grid properties · flexbox · the CSS
  index layout half · the builder today: 15% fully reachable, 57% partly, 28% not at all). Ledger R4-1…R4-5 (bugs found by
  READING the code — measure each before fixing) and four completeness lines are OPEN.
- **Continue from:** **BATCH R-4 (YOU ARE HERE)** → close the open completeness lines → THE MAP → examples proven → the
  "enough" checklist for the user to sign → then the build batches it implies, and G-2.
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE — **AC-37b**, and **BATCH R-4** in BATCHES (its readers, its
  completeness lines, its ledger R4-1…R4-5). Then read `docs/web-anatomy/css-layout/06-builder-today.md` first (what the builder
  does today), then 01 · 03 · 04 · 02 · 05 (skim their completeness tables and trap lists). The user's question behind R-4: "a
  user should be able to position any component, any text, any information, wherever they want on the grid… with the margin
  and padding — study it so we can discuss and then mirror it". DO, IN ORDER: (1) RULE K — nothing on 3100 / 3200 / 3400;
  (2) the OPEN COMPLETENESS LINES (RULE R): MDN's `/Web/CSS` + `/Web/CSS/Reference` A–Z property index (cut off by the fetcher —
  fetch it in parts or from github.com/mdn/content), the 12 listed sub-guides of 05, the Learn grid module's examples, and the
  external on-topic links the flexbox / grid pages cite (CSS-Tricks guide etc.) — read, store, tick; (3) THE MAP (RULE MAP,
  `css-layout/07-map.md`): every grid / flex / alignment / positioning property × value → builder today (06) → GAP or HAVE, with
  CORE / LATER / AVOID and the reason (reflow, reading order, AF phones), and how each is offered to a person in plain words
  (RULE UI, live previews); (4) an EXAMPLE per CORE value (`css-layout/examples/`) and a COMBINATION proof in six headed windows
  across `scripts/uat/screens.js`; (5) the "enough" checklist in the tree for the USER TO SIGN, with the build batches it implies
  (≤ 6 changes each) — R4-1…R4-5 measured and fixed in the first of them unless the user says otherwise; (6) then G-2 (layout
  guides + grid panel). STANDING DECISIONS: everything in AC-37b's R-3 leaf and the plan's decisions (edge to edge; fit rule =
  equal lines on every rung; Alt free / Shift half-lines; free placement never breaks the page; one grid per site). NOT DONE: G-2
  … G-6; the published artifacts (Builder Hub, Layout System, Parity Audit) before the PR; L-5 · L-6 · E-1 · S-3 · D-1 queued.
  TRAPS: heredocs / sed / `node -e` eat backslashes → use the Edit tool for anything with `\`; node reads `/tmp` as `C:\tmp`
  (use the scratchpad path); files are CRLF — normalise before multi-line replaces and CHECK the edit applied; a 'killed'
  server notice is not proof — check the port; the WebFetch summariser invents examples — re-fetch as quotes or read mdn/content
  source; vitest and Playwright never together; read the full-page pictures, not only the numbers."

### 2026-10-03 → 04 · session e9d19b5c · branch `builder/layout-uat` — HANDOVER (the user asked "new session or continue?"; recommended: the context is genuinely long — the whole R-3 research area, hundreds of steps and >1,000 pictures read through agents — and the boundary is clean: research signed and committed, the plan with mockups next)
- **Started from:** session a51af34e's handover — AC-37b, a new area: ask for sources, research, sign, plan.
- **Got to:** **R-3 PAGE-GRID RESEARCH DONE AND SIGNED** by the user 2026-10-04 (`ff5c53a`, `4418202`). Sources:
  the user's Awwwards 12-column item + Dribbble search (all 35 / 42 items, every live site at 4 widths) · mine (builders,
  design systems, MDN) · the crawl (23,728 desktop rows; 300 pages re-measured at 768 / 375). `docs/web-anatomy/page-grid/`
  01–06 + the map `04-map.md` (24 axes). Examples proven in six headed windows: `examples/index.html` 972 / 972 ·
  `examples/combos.html` 261 / 261 (random counts × rows × widths × text). Runners: `scripts/research/grid-measure.js`,
  `grid-splits.js`, `grid-rungs.js`, `skeleton.js --widths`, `page-grid-examples.js`, `page-grid-combos.js`. LEDGER #1–#35 all
  closed (capture script, examples, checkers — none in the builder). **THE USER'S DECISIONS (all under R-3 in AC-37b):**
  6 columns on the phone · 12 from 600 px · FIT-BASED re-split on every rung (fewest equal columns whose words fit; never a
  staircase) · half-steps in the model, whole-column snap by default · page order + "picture first" switch · ZERO grid gap
  (blocks keep half the builder's spacing each side — `SPACE_DEFAULT` in `u()`) · the grid covers the whole width (margin |
  columns | margin, columns stop at ≈ 1280) and the whole page height · INVISIBLE in the editor, a "Layout guides" switch OFF
  by default, guides drawn FAINT (Chrome-overlay style) · an ADVANCED PANEL (columns, row step, gutter, margin) that every
  block follows automatically per rung (placements stored as SHARES) · BEST OF BOTH WORLDS: snap by default, FREE placement
  as today with Alt or a per-block switch, old pages untouched (+ optional "Line up with the grid"), the engine EXTENDED not
  replaced. The content minimum survives enlarged text via build-time `em` container queries (#24).
- **Continue from:** **AC-37b (YOU ARE HERE) → the plan artifact with mockups** (rule 13: plan → approval → build).
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE — **AC-37b · the page grid**, and every line under its
  **R-3** leaf (the user's decisions are there — build to them, do not re-ask). Research is DONE and SIGNED: read
  `docs/web-anatomy/page-grid/04-map.md` (the map, CORE / LATER / AVOID) and skim 05 / 06; open
  `docs/web-anatomy/page-grid/examples/index.html` and `combos.html` (press G for the guides) — they are the working reference.
  DO, IN ORDER: (1) RULE K — nothing running on 3100 / 3200 / 3400; (2) the PLAN ARTIFACT (load the artifact-design guidance via
  the Artifact quickstart, intent "other"): what the page grid is in plain words; how it sits on today's engine (`lib/box-model.ts`
  shares, `gutterCSS`, `SPACE_DEFAULT`, `u()`, the ladder, L-4's `gridNarrowsAt` / `rowQueryCss`) — extended, not replaced;
  MOCKUPS of a school page (hero · news cards · staff · stats · gallery · footer) at phone / tablet / desktop with the guides
  OFF and ON; the "Layout guides" switch; the advanced panel; free placement (Alt / switch); "Line up with the grid"; the Grid
  block mapped onto the page grid (3 across = 4 of 12; 5 across own columns); purpose picks (AC-37c); bleed / straddle /
  half-step (AC-37, AC-37a — the canvas interaction WITHOUT visible lines unless the switch is on); the THREE OPEN CHOICES shown
  side by side for the user to pick (row snap on / off · phone gap 11 vs 16 px · panel per site vs per page); the build in
  batches (≤ 6 changes each, RULE X) with their UAT checklists; RULE UI (every control in the builder), RULE L (story), RULE AF
  (360 px, weight); (3) publish it, get the user's APPROVAL; (4) only then build, batch by batch. NOT DONE: the published
  artifacts (Builder Hub, Layout System, Parity Audit) — before the PR. QUEUED after the page grid: L-5 · L-6 · E-1 · S-3 ·
  D-1 · the rest of 1.1.5 → PR → builder/layout-2 → Tasks 2–4 → re-sweep + story. TRAPS: a 'killed' notice is not proof —
  check the port · two CSS line-name groups may never touch (`[ce] [content-end]` silently drops the whole template — ledger
  #21) · heredocs / `node -e` eat backslashes → the Edit tool · vitest and Playwright never together · read the pictures, not
  only the numbers (#28's staircase was seen only in a picture) · a research run must never click a bare 'x' (Dribbble's X
  link — #19)."

### 2026-10-03 · session a51af34e · branch `builder/layout-uat` — HANDOVER (the user asked "new session or continue?"; recommended: the context is genuinely long — all of L-4 with four headed passes, two sweep re-runs, the gate and a dozen design decisions — and the boundary is clean: L-4 committed and closed, a heavy research job next)
- **Started from:** session 35640e85's handover — BATCH L-4 (c-8 · c-21 · grid picker).
- **Got to:** **BATCH L-4 CLOSED** (`7aa75e5`): c-8 grids and rows give up columns EVENLY rather than break a word
  (`longestWordRem`, `gridNarrowsAt` steps, `rowNarrowsAt` / `rowQueryCss`); picker 1–12 across (`gridForAcross`); c-21
  handles 2px outside (`mirrorFlushSides`); L4-f hug snap-back (`maxContentPx`, `HUG_SNAP_PX`); L4-o grids of 4+ keep their
  count; L4-s my regression fixed. HEADED pass 4 clean in six windows; the eight tier-99 L8 pages 0 errors; gate typecheck 0 ·
  eslint 0 errors · vitest 4,022 · test:fast 805. **The user's decisions:** the PAGE GRID next, before L-5 / L-6 (AC-37b) —
  "page grid" in code, "layout guides" in the builder, content decides the SPAN never the grid, every breakpoint / device /
  responsive rule followed; AC-37 placement at half-steps + bleed out of a section; AC-37c choose by PURPOSE (the builder picks
  flex or grid); L4-l + L4-n → L-5; L4-r → E-1 (new batch: the empty-box "+" is not a button); a LOGO in every test header (L-6)
  and a real Logo with the Navigation component plan (COMPONENT_GAPS).
- **Continue from:** **AC-37b (YOU ARE HERE)** — a NEW AREA, so RULE RS: ask the user for THEIR sources first, research both
  (RULE MAP), the "enough" checklist signed, then a plan artifact with mockups, approval, build.
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE — **AC-37b · the page grid** (section 1.1.5, with AC-37 /
  AC-37a / AC-37b / AC-37c beside it). The user decided 2026-10-03: the page grid comes RIGHT AFTER L-4 (closed, `7aa75e5`),
  BEFORE L-5, L-6 and the frozen list's placement items. What it is: ONE hidden grid per page (12 columns, halves, rows;
  proposed 4 on a phone · 8 tablet portrait · 12 from tablet landscape) — "page grid" in code, "layout guides" in the
  builder (shown while placing, a toggle keeps them on); the user's Grid block is MAPPED onto it (3 across = span 4 of 12; a
  count twelve does not divide keeps its own equal columns inside its span); CONTENT DECIDES THE SPAN, NEVER THE GRID
  (`longestWordRem` is the input); placement at half-steps and bleed out of a section (AC-37, canvas interaction AC-37a);
  choose by PURPOSE — Menu / Cards / Logos — and the builder picks flex or grid (AC-37c). Every breakpoint, device preset and
  responsive rule followed. DO, IN ORDER: (1) RULE K — nothing running on 3100 / 3200 / 3400; (2) say it is a NEW AREA and ASK
  the user for their sources (RULE RS) before researching; (3) research both — Nexter (`docs/web-anatomy/advanced-css/08-nexter.md`,
  `07-grid.md`), Webflow / Framer / Wix Studio page grids, Figma layout grids, subgrid (AC-36) — by RULE MAP (axes → an
  example per value → combinations proven in a browser → saturation); (4) the "enough" checklist in the tree, signed by the
  user; (5) a plan artifact with mockups → approval → build. NOT DONE: the published artifacts (Builder Hub, Layout System,
  Parity Audit) — before the PR. QUEUED after the page grid: L-5 (#42, #46, #82b/#83, #84, L4-l, L4-n) · L-6 (+ the logo in
  test headers) · E-1 · S-3 · D-1 · the rest of 1.1.5 → PR → `builder/layout-2` → Tasks 2–4 → re-sweep + story. TRAPS: a
  'killed' notice is not proof — check the port (it happened again this session) · a `//` comment inserted mid-line by a
  script eats the rest of the line — use `/* */` · vitest and Playwright never together · read the screenshots, not only the
  numbers (the picker's cut frame and the orphan Stat were only seen in pictures) · a palette TILE click adds AFTER the
  selection, never into a chosen box."

### 2026-10-03 · session 35640e85 · branch `builder/layout-uat` — HANDOVER (the user asked "should we start a new session"; recommended: the context is genuinely long — R-2 steps 4 → 7 with every proof re-run, two subagents, the phone pass — and the boundary is clean: everything committed, R-2 signed and closed, a heavy build next)
- **Started from:** session 6eaa0c27's handover — BATCH R-2 → step 4, the gap check; crawls still running.
- **Got to:** **R-2 CLOSED — the user SIGNED the "enough" checklist.** Step 4: `r2-gap.js` (71 techniques, 6,736 items) +
  `r2-census.js` (every property / function / SVG element in 4,131 pens) → ~50 values added AS CODE to `r2-axes.js`, 0 gaps;
  every proof re-run headed, identical twice (8 families painted, 0 invalid, honest distinct counts — the earlier ones were
  inflated, R2-27 — every repeat explained; stack 241 ablations, 9 clashes = V-10; nest 164 / 0; states 197 / 0). Crawls closed
  at measured saturation (CodePen tags, Grabient 927, Awwwards texture 220 on SURFACE). Step 5: the "Not yet" values; the TASTE
  set (33 picks, 85 screenshots, `area-v/taste-set.md`); 75 Dribbble picker designs (`picker-shots.json`). Step 6: the
  real-world pass (`realworld.json`): blur is the one real cost (default ≤ 12px), fixed full-page grain ~40% of frames, the rest
  free. Ledger R2-23 … R2-38 (crawler and proof faults — fixed and mutation-proven; R2-23, R2-38 not bugs, measured). User
  decisions: Mobbin skipped · Dribbble enough · the phone cost pass runs OFF-SCREEN headed (headless rejected by measurement;
  every other test stays headed) · **finish Task 1 FIRST** · blending / transitions / animation / overlay / shadow are NOT layout
  (AREA V, after) · sticky + floating need a gallery of variations (SP-12, layout part only). Commits `43fb21c` `e885c84` `4e307dc`
  + this handover.
- **Continue from:** **BATCH L-4 (YOU ARE HERE)** — write its UAT checklist first, then its changes (c-8 words broken across lines,
  c-21 edge handles over the last letter, the grid picker: any count up to 12). Then L-5 → L-6 (+ S-3, D-1) → the frozen layout
  list 1.1.5 (6 MUST · 19 BUILD · 9 CHECK · GROUP 3 SP-1 … SP-12) → pull request → `builder/layout-2`: Tasks 2–4 (L-7 · L-8 ·
  L-9) → one re-sweep + the layout story → Task 1 closed → AREA V (its first batch: colour & backgrounds, V-7 … V-13).
- **Next prompt (paste to start):** "Branch `builder/layout-uat` (last commit: this handover). Read CLAUDE.md, then
  `docs/TASK_TREE.md`: this SESSION LOG entry, then YOU ARE HERE — **BATCH L-4 · The decided layout changes**. The user decided
  2026-10-03: **finish Task 1 first**; blending, transitions, animation, overlays and shadows are NOT layout (AREA V, after).
  Task 1 still holds: L-4 (c-8 words broken across lines in narrow Stat columns · c-21 edge handles cover the last letter of a
  block that hugs its words · grid picker any count up to 12), L-5 (#42 Stats height round trip · #46 side-by-side spec on
  Tablet / Phone · #82b #83 width drift at 1366 · #84 fixed 14rem neighbour floor), L-6 (page-weight audit · Slow-3G profile ·
  the 19 innovative pages), S-3, D-1, then section 1.1.5 (FROZEN, signed 2026-10-02): 6 MUST + 19 BUILD + 9 CHECK + GROUP 3
  sticky/fixed SP-1 … SP-12 (SP-12: a GALLERY of sticky / floating variations a user picks and makes their own — settle which
  with the user when GROUP 3 opens). Then PR → `builder/layout-2` → Tasks 2–4 → re-sweep + story. DO, IN ORDER: (1) check
  nothing is running (ports 3100 / 3200 / 3400, node / chrome by profile — RULE K); (2) L-4: write the batch's UAT checklist
  FIRST (every change × theme × 375 / 768 / 1280+ × device presets × states), rebuild (`next build` + `next start` on 3100,
  `check-fresh-build.js` FRESH), reproduce each line THROUGH THE UI (RULE Y), fix, typecheck + the unit guard after every
  change, then ONE headed UAT pass in SIX windows (a `uat-l4-headed.js` script, never Playwright MCP alone), then the gate
  (typecheck · eslint · vitest · test:fast) and commit. TRAPS: a 'killed' notice is not proof — check the port · Git Bash
  rewrites `\\.` → `MSYS_NO_PATHCONV=1` · heredocs / `node -e` eat backslashes → the Edit tool · vitest and Playwright never
  together · `next build` into a second folder rewrites tsconfig.json → `git checkout` it · headed windows at scale 1, EXCEPT the
  real-world cost pass (scale 2 = the phone's real pixels, off-screen) · a size mismatch between screenshots is a measurement
  fault (R2-27) · read the screenshots, not only the numbers." · branch `builder/layout-uat` — HANDOVER (recommended and accepted: the context is genuinely long — L-3 closed + most of R-2's research and proofs — and the work is at a clean point, everything committed, the crawl running on its own; the next job, the gap check, is heavy)
- **Started from:** session 07c6c075's handover — BATCH L-3 → L3-p.
- **Got to:** **BATCH L-3 CLOSED** (`6d67d52`, `4de9d92`): L3-p / L3-b / L3-o were ONE bug — every resize start measured the
  block above with its children's grow off and "restored" `flex-grow` from a `var(--bx-gut)` shorthand (reads ""), breaking
  every dragged row's columns until a reload (guard `drag-keeps-flex.spec.ts`); c-11b the drag's room from the DRAWN line
  (guard `row-never-stores-over-100.spec.ts`); c-11a comment only (the user's choice); L3-t / L3-u / L3-w harness (headed
  windows at device scale 1; pagers reset instantly; the HOLE audit counts gutter margins). Gate: typecheck 0 · eslint 0
  errors · vitest 3,985 · test:fast 803; regression headed clean. **Rules added (all in CLAUDE.md, guarded):** RULE K (kill
  what is not in use; a "killed" notice is not proof) · RULE R "until saturated" for big listings + the user's test of
  enough · **RULE MAP** (map the axes → an example per value → prove combinations per family, ACROSS families, at EVERY
  LEVEL nested both ways, and every STATE / EFFECT / TRANSITION the same way, WCAG first → saturate, measured → taste /
  real world / people → then the USER can do it in the builder). **R-2 (RULE MAP), committed through `3fdb8c6`:** the axis
  map `docs/web-anatomy/area-v/AXIS-MAP.md` (7 families); `scripts/uat/r2-axes.js` (every axis as code) + `r2-combos.js`
  (specimens + 60 random combinations per family: valid · painted · visibly distinct) + `r2-stack.js` (40 cross-family
  blocks, 213 ablations: V-10 confirmed 9/9, the wrapper fix proven) + `r2-nest.js` (40 nested trees, cascade down 0
  failures, 0 clashes up) + `r2-states.js` (30 trees, real mouse + keyboard, 133 checks, 0 failed); sheets in
  `docs/web-anatomy/area-v/specimens/` (index.html opens them all). AREA V ledger **V-7 … V-13** (builder bugs and rules
  found: radial shape lost in the editor, stop alpha lost, gradient under a photo dropped, a shaped band's shadow clipped,
  shadow tokens unused, no contrast hint on a block's colours, own state must beat a driven one / no inline base where a
  state changes it). R-2 ledger R2-1 … R2-22 all closed (crawler and proof faults, each fixed and mutation-proven).
- **Continue from:** BATCH R-2 (YOU ARE HERE) → **step 4, the GAP CHECK**: when the crawl ends, compare everything it collected
  with the map; anything new is added AS CODE to `r2-axes.js` and every proof re-run; then step 5 (the AXIS-MAP "Not yet"
  values), step 6 (the real-world pass: 360px phone, Slow 3G), step 7 (the "enough" checklist to the user). STILL RUNNING
  at handover (13:30, detached, educo-research): CodePen `shadow` (cp-prof/1, pen 299, `--saturate=150`), Awwwards texture
  live sites (profile-aw2, 74 / 805, `--saturate=50`), the tool-site chain `r2-sites2.sh` (Dribbble search → Mobbin first page
  → Grabient resume). Stop each by its profile path when done (RULE K).

### 2026-10-03 · session 07c6c075 · branch `builder/layout-uat` — HANDOVER (the user asked; recommended: the context is genuinely long — the Divider pass with three fixes and four six-window runs, c-11c, L3-f, two page runs, the AREA V investigation, two new rules, 20 links; clean boundary — the gate green and everything committed, a heavy live-canvas hunt next)
- **Started from:** session f86b7fdf's handover — BATCH L-3 → L3-f.
- **Got to:** research chain STOPPED on the user's "stop it" (L3-j; 0.5 → 3.9 GB free). **c-11c BUILT** (decided B,
  `holdsWords` in `tabletPlaces` + audit L6). **R-23 / change 5 HEADED 6/6 CLEAN** — on the way: L3-l the thickness
  reached the page as px (now plain rem; my first fix used the fluid `u()` and the pass caught it), L3-r a thickness padded
  the Divider 28px in from the words (seen only in the screenshot), L3-s a 1px Divider could not be dropped under (now
  0.5rem above / below). **L3-c CLOSED**; **L3-f CLOSED as harness** (the canvas stayed on the slide that was typed into;
  pagers now go back to slide 1 before measuring). L3-n harness: the dresser sized rows at Wide, which never reaches
  Desktop. **L3-b REOPENED** (332's hole is back with 0 page errors). OPEN: L3-p / L3-b / L3-o (one live-canvas bug most
  likely: a wrapped cell at its 224px floor that a reload fixes) · L3-t (333 heights) · c-11b (359 stores 100.15%) ·
  c-11a (the USER decides). **AREA V** investigated (research + code) and reported; **RULE UI** written into CLAUDE.md
  (everything built is in the builder, easy to pick and to make your own — including what was built before: BATCH U-1);
  **R-2** has the user's 20 links. Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 3,985 · test:fast 793.
- **Continue from:** BATCH L-3 (YOU ARE HERE) → L3-p. **The user agreed the plan 2026-10-03 ("go with that"):** finish L-3 → R-2 research (20 links + mine, the user signs "enough") → AREA V batches (colour & backgrounds → section shapes & blending → shadows / overlays / effects → motion), each with its builder controls (RULE UI) → U-1 in the user's order.
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md (note the new RULE UI), then
  `docs/TASK_TREE.md` — YOU ARE HERE is BATCH L-3; read its ledger (L3-a … L3-t, c-11a/b/c) and AREA V, U-1, R-2 at the
  top. Do, in order: (1) **L3-p** — page 223 (and 332's L3-b, 359's L3-o, most likely the same bug): on the LIVE canvas a
  wrapped cell is drawn at its 224px floor (29.2% at 768) while the Preview — and the same tree RELOADED — fill its line.
  Not a cache, not a stray inline style (both checked). Reproduce it THROUGH THE UI in a main column beside a sidebar (the
  223 shape: words + 3 icon cells sized 70·10·10·10 at Desktop with `Builder.sizeColumns`), measuring in CANVAS px (÷ the
  canvas zoom — `probe-c11b.js --live` forgot it once), live vs reload; then the root fix with a guard RED first, then the
  three pages re-run. (2) **L3-t** — page 333: canvas ≠ Preview in HEIGHT (35–110px) after the stress. (3) **c-11b** — page
  359 stores 42.71 + 41.62 + 8.51 + 7.31 = 100.15%: find the drag that writes it (DEBUG=1 prints stored widths per drag).
  (4) **c-11a** — ASK THE USER (recommended: fix the stale comment only). (5) the checklist's regression line, then close
  L-3. THEN R-2's research with the user's 20 links + my own (RULE RS), never beside a test run. Standing: c-11c is B ·
  ST-7 = both Queue and Stack · motion tokens approved · RULE UI · AREA V order: L-3 → R-2 research → colour & backgrounds →
  section shapes & blending → shadows / overlays / effects → motion → U-1 in the user's order. Traps: a 'killed' notice is
  not the process dying (check the port) · vitest and Playwright never together, and the unit tests READ the tree — don't
  edit it during a gate · never edit engine source during a page run (the harness stops starting pages: L3-m) · building into a second folder makes `next build` REWRITE tsconfig.json (adds `.next-b/types`…) — `git checkout -- tsconfig.json` before a commit · build into
  a second folder (`NEXT_DIST_DIR=.next-b|.next-c`) and check it with `check-fresh-build.js <port>`; `BASE=` points the
  harness at it · measure the canvas in canvas px · read the screenshots (L3-r was invisible in every number) · use the
  Edit tool for backslashes / CRLF · a new spec goes in package.json AND scripts/test-fast.js · background runs get the
  2-hour limit · the YOU ARE HERE marker is plain text after the arrow."

### 2026-10-03 · session f86b7fdf · branch `builder/layout-uat` — HANDOVER (recommended and agreed: the context is genuinely long — R-1, L3-h, the whole #185 hunt and c-12b; clean boundary — everything committed, the gate green, c-11 engine work next)
- **Started from:** session 1fc987ff's handover — BATCH R-1 (research at full width), then L-3 (paused).
- **Got to:** **R-1 CLOSED** by the user's "enough" (`fe320f5`): machine measured (memory is the limit), CodePen at 6
  collectors and one Awwwards lane, then stopped — 1,212 new pens, ~391 sites, every one of the user's own links
  complete; step 4 (divider / dividers / wave, 137 pens), tag pages regenerated, HAVE / PARTIAL / GAP in
  `motion/library/3-section-transition.md`. Ledger R-21 (cp-tag ended a tag on a failed page — fixed, proven) · R-22
  (my lane mistake) · **R-23 the Divider published `<div aria-hidden>` — now `<hr>`** (`6f94ce7`, headed check is L-3
  change 5). **BATCH S-2 · Section transitions** queued (ST-5 overlap · ST-1 next-band colour · ST-4 wave/SVG edge ·
  moving wave · ST-7 stacked cards — the user: BOTH Queue and Stack, Queue the default). **L3-h / L3-g CLOSED** (`65704db`):
  the stressed 250px HOLE was the AUDIT (R-24, `flex-shrink: 0` blocks cannot shrink) — red 4/4 → green 4/4, proven both
  ways. **#185 FOUND AND FIXED at its root** (`cf614c8`): reproduced through the UI only with the CPU slowed 3× (it is a
  race); part 1 the canvas frame's ResizeObserver re-made on every key; part 2 every key committed the whole site
  (65–95 ms a key, 185–353 ms slowed, #185) → **c-12b BUILT as the user decided**: a burst of typing is one save and one
  Undo, words kept on blur / page hide / close / unmount → 8–9.5 ms a key, 22–28 ms slowed, the full stress 6/6 clean in
  six slowed windows. **L3-b CLOSED with it** (its live hole was #185's half-finished update). Guide + published guide
  artifact updated (`3e9cb46`). Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 3,980 · test:fast 793.
  My own slips, all fixed: a 1-hour limit killed a slowed run with no output; a shell edit failed silently and opened 12
  windows; a dev-server diagnosis never started (the dev server recompiles when the probe writes logs inside the repo).
- **Continue from:** BATCH L-3 (YOU ARE HERE) → L3-f.
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md, then `docs/TASK_TREE.md` — YOU ARE HERE
  is BATCH L-3 (5 changes); closed in it: L3-h, L3-g, L3-b, change 1 #185 and c-12b. Do, in order: (1) **L3-f** — page 141
  after the stress typing showed canvas ≠ Preview at all 5 rungs on 12 blocks whose SIZES match; inferred: typing into the
  rotating hero's hidden slides scrolls the pager on the canvas while the Preview opens on slide 1. MEASURE first (each
  block's left position and the pager's scrollLeft on both sides, through `scripts/uat/probe-l3-row.js` on
  `dressed99-out/page-141.final.site.json`) before calling it harness or product; NOTE the c-12b fix changed typing, so
  re-run the page first. (2) **The page-141 re-run for L3-c** through the UI on a fresh build (`uat-pages.js
  --plan=dressed99 --pages=141,329,332,333,34,43 --jobs=6 --stress`, ~43 min; six windows). (3) **c-11a** — the
  `packRowLines([70.04, 9.99, 10.14, 10.02])` guard RED first (a line that rounds to 100.4% must be one line, as its own
  comment says), then the fix; **c-11b** — find what stores rows over 100% and stop it; **c-11c (decided B)** — an icon
  cell does not count for the tablet rule, in `tabletPlaces` AND the audit's L6 check. (4) The batch's HEADED pass
  against its checklist (six windows, all themes, every rung, canvas AND Preview), including change 5: R-23 the Divider
  as `<hr>` — canvas == Preview, one line, no UA margin or inset border, style / thickness / colour in all 4 themes, a
  separator in the accessibility tree. Standing decisions: c-11c is B; S-2 queued after the layout and motion batches
  (ST-7 = both Queue and Stack). Traps: a 'killed' notice on a background shell is not the process dying (check the
  port); research never runs beside a UAT; vitest and Playwright never together; `test:fast` needs port 3100 free; build
  into `.next-b` (`NEXT_DIST_DIR`) and check it with `NEXT_DIST_DIR=.next-b node scripts/check-fresh-build.js 3200`; a
  slowed CPU (`--cpu=3` in the probes) finds races the normal speed hides; use the Edit tool, never `node -e` / shell
  replacements, for anything with backslashes or CRLF files; a new spec must be added to `package.json` AND
  `scripts/test-fast.js` (`test-scripts.test.ts` guards it); give background runs the 2-hour limit and print results as
  they happen; the YOU ARE HERE marker is plain text after the arrow."

### 2026-10-02 · session 1fc987ff · branch `builder/layout-uat` — HANDOVER (the user: "we start this in a new session"; context compacted once; clean boundary — L-3's testing finished, the gate green, everything committed)
- **Started from:** session ca50a336's handover — F1-k, the full gate and the F-1 commit still to do.
- **Got to:** F-1 CLOSED and committed (`e6a30d4`). BATCH L-3 opened with its checklist; the user decided c-12b ("go with
  your recommendation": measure first; a burst of typing = one Undo, saved when typing stops). L-3 ledger: L3-a #185 NOT
  REPRODUCED in 12 headed runs, 6 of them stressed (closed with the measurement, the sweep's page-error check is its
  guard) · L3-c the audit read a pager's hidden slides as words at the page edge — FIXED, guard red-first and
  mutation-proven · L3-d / L3-e harness: page errors keep stack + step, `--stress` forwarded, the final tree saved,
  phases named, the HOLE message carries each column's drawn width / flex / min-width · L3-i my own unbolded-marker
  slip — fixed. OPEN: L3-b (page 332 Tablet hole, live canvas only), L3-f / L3-g (page 141 after typing), L3-h (a 250px
  Mobile hole on 4 pages after the stress typing), c-11a/b/c not started. CodePen: the user asked "is it done?" — no:
  the tag run had stopped with `--saturate=150` (six tags cut short, article pens 570 of 4,714, four tags with 0 pens).
  Resumed without saturation, and the user's ask built in: `scripts/research/cp-how.js` writes HOW each pen is done
  while its code is in hand; ~5,300 pens given theirs from saved code; 26 tag pages in `docs/web-anatomy/codepen/`.
  NEW RULE (CLAUDE.md, RULE RS): research runs as wide as the machine allows, split by site, measured first, never
  beside a batch's testing, one job finished before the next. Research PAUSED for the stress run; servers 3100 / 3200
  stopped. Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 213 files · test:fast 789.
- **Continue from:** BATCH R-1 (YOU ARE HERE) — research at full width; then back to L-3 (paused, its open lines listed
  on its batch line).
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md, then `docs/TASK_TREE.md` — YOU ARE HERE
  is BATCH R-1 · Research at full width. Do R-1 in order: (1) measure the machine (CPU, free memory; no UAT, no
  `next start` running); (2) CodePen at 6 windows — three `cp-tag.js` collectors, each with its own COPY of the profile
  `prof-c` (path in `educo-research/codepen-resume.sh`) and its own share of the tags in that script, plus
  `list:docs/web-anatomy/research-runs/pens-own.list.json` (4,144 not read) split into its own collectors at the same
  time; NO `--saturate`; pens already read are skipped and every new pen gets its `how` from `cp-how.js`; step down if
  CodePen asks 'are you human' (the user ticks it once in that window); (3) the Awwwards chain
  `educo-research/chain.sh` restarted WITHOUT `--saturate` (it was on `aw-coll-animation-libraries-examples-inspiration`),
  and the other queued lists side by side, as wide as the machine allows; (4) the three 0-pen tags under CodePen's own
  names (divider, dividers, wave, svg-divider, stacked-cards, card-stack, stacking), then
  `node scripts/research/cp-how.js docs/web-anatomy/codepen/raw` to refresh the tag pages, then HAVE / PARTIAL / GAP
  against the builder. Report progress as numbers (pens read per tag, sites measured). When R-1 closes, back to BATCH
  L-3 (paused): L3-h first (one stressed page with the new HOLE details), then L3-b, L3-f, L3-g, the page-141 re-run for
  L3-c, then c-11a (`packRowLines([70.04, 9.99, 10.14, 10.02])` guard red first), c-11b, c-11c (decided B). Standing
  decisions: c-12b measure first, then a burst of typing = one Undo; c-11c B. Traps: a 'killed' notice on a background
  shell is not the process dying; research never runs beside a UAT; vitest and Playwright never together; the YOU ARE
  HERE marker is plain text after the arrow."

### 2026-10-02 · session 1427d547 · branch `builder/layout-uat` — HANDOVER (recommended and agreed: the context is very long — a full day of research, ~40 agents; clean boundary — research written, verified and committed, fixing next)
- **Started from:** 7af7f72 — the Awwwards Animation research about to run; F-1 paused, code uncommitted.
- **Got to:** the user found the earlier research was a false positive (listings walked, items never opened) → a new
  rule (RULE R: every item is opened, run and read) and a full REDO: every link the user gave measured item by item by
  `scripts/research/aw-measure.js` (DOM, timing, hover strips, menus, page transitions, reduced motion, phone) and
  `cp-tag.js` (every pen opened, run, its full code read); uiverse's 3,802 elements run locally; my own research by ~40
  reading agents (MDN, Chrome, Bramus, CSS-Tricks, Smashing, Codrops, design systems, React Native); everything kept
  ONCE for the builder, every component AND the Educo app in `docs/web-anatomy/motion/LIBRARY.md` + `library/1…11`
  (198 entries), raw data in `C:\Users\eyite\educo-research\` (outside git). The user stopped the 25,000-item plan:
  their own links in full, everything else until SATURATED. Bug ledger verified in code (22 real + new N1…N10). Motion
  tokens APPROVED. 20 bugs in my own research tools found and fixed (R-1…R-20) — the worst: the phone pass never ran at
  360px (R-16), menus that never opened counted as closing on Escape (R-17), see-through layers counted as preloaders
  (R-18); the library marks those numbers PENDING until the re-measure lands.
- **Continue from:** the "ENOUGH" CHECKLIST sign-off (1.1.5) → the user's layout list → FREEZE → F-1 → Batches A · B ·
  C. While working: regenerate `research-runs/AGGREGATE.md` (`node scripts/research/aggregate.js
  C:/Users/eyite/educo-research docs/web-anatomy/research-runs/AGGREGATE.md`) when the phone / menu re-measure ends,
  and refresh the library's PENDING numbers; move `docs/web-anatomy/codepen/raw/` (38 MB, git-ignored) into
  `educo-research/` once the CodePen run ends.

### 2026-10-02 · session ca50a336 · branch `builder/layout-uat` — HANDOVER (the user asked; recommended too: context compacted once and holding the whole course + 4 research sources; clean boundary — course finished, the Awwwards run not started)
- **Started from:** BATCH F-1 (YOU ARE HERE), from 6793d4b.
- **Got to:** (1) F-1: change (1) MEASURE — the W19 unused-space audit check; fixes A (components hug / fill), B
  (wrapped columns fill — the user's "fill after a wrap"), C (1rem menu gap on a phone); ledger F1-a…F1-j fixed or NOT A
  BUG, all headed-checked; F1-k OPEN (page 38 at Tablet: 3 holes + canvas ≠ Preview by 24px). NOTHING COMMITTED for
  F-1 — the code is in the working tree; the full gate has not run. (2) The user PAUSED F-1 to define the layout's end:
  the user's Advanced CSS course (Natours · how CSS works · Sass · responsive · Trillo/Flexbox · Grid · Nexter) stored
  lecture by lecture in `docs/web-anatomy/advanced-css/` (01–08 + README, 36 gaps AC-1…AC-36); **1.1.5 · LAYOUT —
  DEFINITION OF DONE** drafted in this tree (MUST 6 · DECIDE 20 · CHECK 9 · LATER). (3) Research the user asked for —
  section transitions · animation · sticky · fixed: CodePen sticky-header + fixed-position (47 pens, 22 techniques),
  mimo, petro.design → `docs/web-anatomy/scroll-and-position/`; gaps SP-1…SP-14 in 1.1.5 (SP-1 and SP-4 verified in the
  code). The Awwwards Animation listing collected (248 sites); its measuring script written, not run.
- **Continue from:** the Awwwards Animation research (1.1.5): add (a) which elements animate and how and (b) the page
  transition to `scripts/research/aw-measure.js`, run it in real Chrome, distil, put SP-15… into 1.1.5. Then: more
  links the user sends → the user's own layout list → my research of what is left → the user FREEZES 1.1.5 → back to
  F-1 (F1-k, gate, commit) and the queued batches.

### 2026-10-01 · session 4f2e9df1 · branch `builder/layout-uat` — HANDOVER (recommended: context long — all of L-2, 13 ledger lines, ~70 headed runs; clean boundary — committed, F-1 heavy next)

- **Started from:** `7e1a030`, BATCH L-2 not started.
- **Got to:** **L-2 CLOSED** (`2bcc73f`, tree `12ffcc3`): the canvas zoom is drawn with `transform` (laid out 1:1 like the
  Preview); a one-column band has no gutter; header/footer lines spread and centre (the user's decision); buttons no
  longer underlined; editable body text is a `<p>` and never wider than its block; #144 measured in Chromium, Firefox and
  WebKit, false warning gone; `check-fresh-build` compares with the build's START. Gate: typecheck 0 · eslint 0 errors ·
  vitest 3,932 · test:fast 757. DECIDED by the user: BATCH F-1 (the page uses its space) opened right after L-2, every fix
  in the shared engine with an enumerating guard; BATCH M-1 (the L-2 fixes in `apps/mobile/`) noted as a must, not now.
- **UNCOMMITTED:** nothing but run logs in `scripts/uat/logs/` (never committed).
- **Continue from:** BATCH F-1 (YOU ARE HERE): write its checklist, then change (1) MEASURE FIRST.
- **Not done, and said so:** M-1 not started (the user's word); S-3 still waits to be placed; the six-window 37-minute
  timeouts of 2026-09-30 remain unexplained.

### 2026-10-01 · session 80d91cf9 · branch `builder/layout-uat` — HANDOVER (recommended: two batches in context, clean boundary, L-2 heavy)

- **Started from:** `ff9471f`, BATCH L-1 at its last three steps, its code uncommitted.
- **Got to:** **L-1 CLOSED** (`509822a`, `d138a6d`): page 337 built 18 of 18 in six windows; L1-12…15 fixed (the page
  runner now refuses a stale server and reports a lost one); L1-13 PARKED by the user. **Z1-a, Z1-b** (a held block slid
  and an item ring sat off its item while the canvas was fitted) fixed `1550371`. **Z-1 CLOSED** (`70f0c21`): canvas zoom
  as approved; acceptance pages 334 and 12 BUILD; Z1-c…p closed (Z1-j: Delete on a focused toolbar button deleted the
  selected block — fixed). Gate at `70f0c21`: typecheck 0 · eslint 0 errors · vitest 3,923 · test:fast 748. DECIDED by
  the user: Tasks 2–4 → batches L-7/8/9 on a fresh `builder/layout-2` after the PR, before the re-sweep and the story;
  S-3 gains a "column too narrow for its words" warning; Z1-i accepted.
- **UNCOMMITTED:** nothing but run logs in `scripts/uat/logs/` (never committed).
- **Continue from:** BATCH L-2 (YOU ARE HERE): write its checklist first, then e-4 (the burger menu's "Contact" wraps on the
  canvas, not in the Preview — `probe-e0b.js --w=1920`), e-8, e-10, #144.
- **Not done, and said so:** the six-window 37-minute timeouts of 2026-09-30 remain unexplained; mobile has no canvas
  (rule 20); the published artifacts and the layout story come after L-9.

### 2026-09-30 · session 5b8cbbe1 · branch `builder/layout-uat` — HANDOVER (the user: "we'll stop here and continue later")

- **Started from:** `ec1fc5e`, BATCH L-1 not started.
- **Got to:** L-1 checklist written; its pages re-run in PARALLEL (27 of 31 built); the four that failed alone traced and
  resolved. PRODUCT fixes, each reproduced through the UI, guarded (mutation-proven) and seen in a HEADED UAT in 4 themes
  + Preview: **e-1** (a palette click with an Image grid cell selected put the block INSIDE the image — `paletteClickSlot`),
  **L1-3** (a sticky sidebar taller than the screen spilled over the page — clause 3b `min-height`), **L1-9** (a sticky
  header in a row became screen-tall — header/nav/footer excluded), **L1-7** (an empty box's "+" came and went under a
  still pointer and the browser cancelled the drop — editor hints take no pointer during a drag-in; acceptance: 5 of 5
  past the step). HARNESS fixes L1-0 · 1 · 5 · 6 · 8 · 10 · 11. L1-4 → Z-1 (page 12 joins 334). NEW RULE from the user:
  **SIX WINDOWS AT ALL TIMES WHILE TESTING** (CLAUDE.md RULE Z + guard + UAT doc + memory); rebuilds go to a second
  folder (`NEXT_DIST_DIR=.next-b`, port 3200+) so windows never empty. Gate: typecheck 0 · eslint 0 errors.
- **UNCOMMITTED (the code — the full gate has not run):** `.gitignore` · `app/website/box-demo/page.tsx` ·
  `components/website/box/BoxCanvas.tsx` · `eslint.config.mjs` · `lib/box-model.ts` · `next.config.ts` ·
  `scripts/check-fresh-build.js` · `scripts/uat/h.js` · `scripts/uat/pages.js` · `scripts/uat/uat-pages.js` ·
  `tests/e2e/pinning-holds.spec.ts` · `tests/unit/pinning.test.ts` · new: `tests/unit/palette-click-slot.test.ts` ·
  `tests/e2e/drop-into-empty.spec.ts` · `scripts/uat/probe-l1e1.js` · `probe-l1-sticky.js` · `probe-l1-header.js` ·
  `probe-l1-plus.js`. Committed at the handover: this tree, CLAUDE.md, UAT_EVERY_CHANGE.md, claude-md-rules.test.ts.
- **Continue from:** L-1's last three steps (YOU ARE HERE): 337 alone to completion → vitest in full + test:fast (stop any
  `next start` first; delete `.next-b` … `.next-e`) → commit the code → close L-1 → then Z-1 (research → plan artifact →
  approval), L-2 … L-6, D-1; S-3 when the user places it.
- **Not done, and said so:** the six-window batch's shared 37-minute timeouts (cause not found); the published artifacts
  (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 25f18c91 · branch `builder/layout-uat` — HANDOVER (recommended: long context, clean boundary, L-1 heavy)

- **Started from:** `ec8195c`, BATCH S-2 coded, its HEADED UAT not run.
- **Got to:** S-2 CLOSED (`60a2051`: S2-f components keep the page gutter via `pageBandInset`; S2-i dead sidebar links
  hidden, `UNBUILT`, the user's decision) and E-0 CLOSED (`78cc6ee`, `0ae9b5f`): E0-a audit L4 measures gutter-band
  columns · E0-b menu line longhand gap, no band gutter · E0-d harness clips to the Inspector · E0-e `@property --bx-gut`
  (a band holding a narrowing grid is a size container, `cqw` split the unit) · E0-g injected SVGs never pointer
  targets (a drop onto a re-rendered `<path>` was lost) · E0-h a host-stretched column's LAST block takes the spare
  height (the user's decision) · E0-f recorded → BATCH Z-1 canvas zoom. RULE Z "PARALLEL IS THE DEFAULT" written into
  CLAUDE.md, its guard, this tree, UAT_EVERY_CHANGE.md and memory (the user: "correct everywhere"). Gate at `0ae9b5f`:
  typecheck 0 · eslint 0 errors · vitest 3,903 · test:fast 737.
- **Continue from:** BATCH L-1 (YOU ARE HERE in BATCHES): write its checklist first, re-run its pages in PARALLEL
  (e-1 pages 2, 87, 142, 153, 227, 278, 385 + 337, which fails alone with and without E0-e), trace each drop/select
  failure through the UI with a real mouse drag, fix + guard; then Z-1, L-2 … L-6, D-1; S-3 when the user places it.
- **Not done, and said so:** the published artifacts (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 1fba35cf · branch `builder/layout-uat` — HANDOVER (recommended before the heavy S-2 UAT pass)

- **Started from:** `5ed8d5f`, BATCH S-2 open at change (5), nothing coded.
- **Got to:** `f848e43` + `1a513d7` + this tree update. **All five S-2 changes CODED, none yet SEEN in a headed UAT:**
  - (5) a block that paints its own box (component, Button, and the tree components Card/Quote/Stat/Badge/Rating) placed
    straight on the page gets 1rem above/below + 2rem gutter as a MARGIN outside it (`outerDefaults` / `outerSpaceCSS` /
    `sectionPlaceIn`, lib/box-model.ts); a column of a band 1rem above/below only; in a stack nothing. Shown by **Outer
    spacing** (the user's choice). (1) `component-breathing.spec.ts` ("never touch", the user's choice). (2)+(3) page-audit
    W7a/W7b as warnings + `page-audit-whitespace.spec.ts`. (4) old wording gone.
  - S-2 ledger: S2-a/b/d fixed and guarded; S2-c fixed in code, to be SEEN; S2-e NOT A BUG (measured).
  - Gate at `1a513d7`: typecheck 0 · eslint 0 errors · vitest 3,831 · test:fast 724 (640 + 68 + 16).
- **Continue from:** the S-2 HEADED UAT (YOU ARE HERE in BATCHES): write `scripts/uat/probe-s2.js` (build through the UI:
  Card · Button · Quote · Alert one under another on the page; the same four inside a Stack; a Button beside a Card in a
  row; two coloured Stacks one under the other; Outer spacing → 0, reload, Back to default; the Preview at 5 rungs with
  the page audit's W7a/W7b = nothing), run it in 4 themes side by side on a FRESH build, re-run `probe-spacing.js` and
  `probe-saved-page.js` (with a component added) as regression, tick the 8 checklist lines, close S-2 → E-0.
- **Not done, and said so:** the published artifacts and the story chapter for S-2 (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 30a96c03 · branch `builder/layout-uat` — HANDOVER (recommended: S-2 is heavy, the context is large)

- **Started from:** `56b19d8`, BATCH S-1 open at S1-a.
- **Got to:** `1cfcfc1` + this tree update. **BATCH S-1 CLOSED** — S1-a (the column GUTTER: 1rem across, 1rem down, the
  line still fits) and S1-b…S1-p (13 more lines, all fixed, see the S-1 ledger), every checklist line seen in a HEADED
  UAT (build u8hfywi0, 4 themes × 5 rungs, canvas + Preview, 124 checks each, 0 findings) plus `probe-saved-page.js`
  CLEAN and `probe-room-marquee.js` PASS. Gate at `1cfcfc1`: typecheck 0 · eslint 0 errors · vitest 3,794 · test:fast
  640. Story chapter "My words never touch an edge" added to `docs/guide/layout-story.md`.
  - The user DECIDED S-2 (5): section space (1rem) around every block placed straight on the page, components and buttons
    included, outside their painted box; never a per-block bottom margin. The S-2 checklist is written.
- **Continue from:** BATCH S-2 → change (5) (YOU ARE HERE), then (1) components breathe, (2)+(3) the audit checks, (4)
  the old wording → ONE HEADED UAT for S-2 → close it → E-0.
- **Not done, and said so:** the published artifacts (end of Task 1); the mobile app has no builder canvas (rule 20).

### 2026-09-30 · session 3c675738 · branch `builder/layout-uat` — HANDOVER (the user moved to a new session to keep the cost down)

- **Started from:** `5414975`, the tier-99 re-run triaged, nothing running.
- **Got to:**
  - e-2/e-3 re-run alone, STOPPED by the user at 3 of 14 (build OvtY9uAA): page 68 was the machine; pages 145 and 393
    still fail alone → BATCH E-0. #42 and #46 found (transcript c7a3c172) and written out in full.
  - **Working method changed by the user:** RULE X is ONE UAT PASS PER BATCH (one area, ≤ 6 changes, checklist first,
    one open at a time) — the BATCHES section at the top of this file, guarded by `task-tree-batches.test.ts`; the tree
    is the Bible for every request; every handover ends with the next session's prompt; say when to hand over.
    All in `CLAUDE.md` with guard lines.
  - **SPACE BY DEFAULT built** (batch S-1): `spaced` mark on new blocks, `spaceDefaults` / `sectionContent` /
    `leafPaddingCSS` / `padSide` / `gapOf` in `lib/box-model.ts`, one decision for canvas and export; inspector shows
    "Default · size" + Back to default, inner spacing on every element (c-23), bulk reads the real padding (c-24),
    controls in REAL rem (S1-b). The user's values: gutter 2rem, section 1rem, bar 1rem, stack 1rem, columns 1rem,
    inner 1.5rem, plain box 0. Guard `tests/unit/space-by-default.test.ts`.
  - S-1 HEADED UAT run twice (4 themes × 5 rungs, canvas + Preview, `scripts/uat/probe-spacing.js`): 69 checks passed
    per theme; findings S1-a … S1-e in the S-1 ledger. The first run found BATCH L-1's first reliable e-1 repro.
  - Every carried-over item queued as a batch with its description (L-1 … L-6, D-1).
  - Gate at the handover commit: typecheck 0 · eslint 0 errors · vitest 3,784 · test:fast 640 — all green.
- **Continue from:** BATCH S-1 → **S1-a, the 1rem gap between columns side by side on the page** (engine: each column's
  width gives up its share of the gap so the line still fits; resize maths in % must keep working) → rebuild → ONE
  re-run of `probe-spacing.js` in 4 themes to close S1-a … S1-e and tick the S-1 checklist → close S-1 → S-2.
- **Not done, and said so:** the S-1 checklist is not ticked (it closes on the re-run); the column gap engine work;
  the mobile app has no builder canvas (rule 20); the published artifacts and the story are not updated (end of Task 1).

### 2026-09-29 → 30 · session 6c14c5c8 · branch `builder/layout-uat` — HANDOVER (the user stopped for the night)

- **Started from:** `66b6896`, the tier-99 re-run 4 minutes in.
- **Got to:** the re-run FINISHED and TRIAGED — 403 pages in 957 min; clean 17 → 356, not built 52 → 21; ten classes
  e-1 … e-10 in the ledger (1.1.1 → tier 99 → d). Read-only findings on c-6, c-11, c-12 in the tree. Rule 3 in `CLAUDE.md`
  REWRITTEN to "space by default, always overridable" for every element and component, guard updated and green
  (`claude-md-rules.test.ts`, 150 passed); scenarios in `box-builder-spacing.feature`. c-23, c-24 found by reading.
- **Decided by the user this session (each recorded under its line):** c-7 B · c-8 B · c-21 B · grid picker B (any
  count up to 12) · Tasks 2–4 = the original list · saved pages keep their spacing · the default spacing values ·
  c-11c B (an icon cell does not count for the tablet rule).
- **Continue from:** 1.1.1 → tier 99 → d → "re-run e-2 and e-3 alone first" (YOU ARE HERE) [SUPERSEDED 2026-09-30: parallel is the default, only a failure is re-run alone — RULE Z]. Then SPACE BY DEFAULT (the
  engine, the two audit checks, the old wording in six places, c-23, c-24), then e-1 · e-4 · e-5 · e-6 · e-7 and the
  rest, each at its root, guard red first, HEADED UAT, `--pages=`; then the four decided engine changes (c-7, c-8, c-21,
  grid picker) and c-11c.
- **Not done, and said so:** the full gate did NOT run at this commit (only the rules guard; no app code changed); the
  production server on 3100 was stopped; the mobile app has no builder canvas (rule 20); the published artifacts are
  still not updated.

### 2026-09-29 · session df7557b5 · branch `builder/layout-uat` — HANDOVER (the user asked for a new session, to bring the cost down)

- **Started from:** `919d731` with uncommitted work; the tier-99 sweep finished and untriaged.
- **Got to:** three commits pushed — `bc89d68` (the uncommitted work secured), `e4a16f6` (the tier-99 fixes), and the
  handover commit (the last harness fix and this tree). Gate at `e4a16f6`: typecheck 0 · eslint 0 errors · vitest 3,739 ·
  test:fast 640.
  - Tier 99 triaged: 403 pages, 688 min, 52 could not be built, 17 clean — 21 ledger lines (c-1 … c-21).
  - CLOSED, each with a guard that was red first and a headed UAT through the UI: c-1 Icon · c-2 List · c-4 could not
    select · c-5 drop over the toolbar · c-7 holes · c-8 words (harness half) · c-9 image slack · c-10 150% text ·
    c-13 · c-14 · c-15 handles · c-16 (not a bug) · c-17 grid rows · c-18 · c-19 · c-20 toolbar side.
  - 39 sweep pages re-run headed on fixed builds: 35 at 0 errors (the first run had 17 clean of 403).
  - The user's ORIGINAL Tasks 2–4 recovered and recorded (1.1.2 – 1.1.4); this tree created and made a rule.
- **Running when this was written:** the whole tier 99 again, on the fixed build (tree 1.1.1 → tier 99 → d).
- **Continue from:** tree 1.1.1 → tier 99 → d. If the run has finished, triage it and compare with the baseline; if it is
  still running, do nothing to `scripts/uat/` and take c-11, c-12 and c-6 by READING only, or wait.
- **Then, in order:** c-3 · c-6 · c-11 · c-12 → the RULE AF harness (page weight, Slow 3G) → the innovative plan (19 pages)
  → the 19 tier-95 failures → story and artifacts → gate → pull request to `master` → Tasks 2, 3, 4 → the original queue.
- **Added after the handover, same day:** the user asked that space is there BY DEFAULT (words never against an edge,
  always overridable) — tree 1.1.1 → "SPACE BY DEFAULT". It reverses rule 3 and means one more whole-tier sweep.
- **Decisions waiting on the user (none blocks the work):**
  1. c-7 — a column nobody sized, beside columns that were: keep its share (today), or take what is left of the line?
  2. c-8 — words in a grid cell narrower than the longest word: break the word (today), narrow the grid, or warn?
  3. c-21 — the edge handles cover the last letter of a block that hugs its words: leave, or draw them outside?
  4. a grid of five across is not in the picker (1 · 2 · 3 · 4 · 6 · 12): leave, or offer any count up to 12?
  5. which list is Tasks 2–4 — the original (wrapper dissolve · column outer-edge space · parity spec), as assumed?
  6. space by default: do pages already saved keep their spacing (recommended), or take the new defaults too?
- **Not done this session, and said so:** the mobile app (`apps/mobile/`) has no canvas, so none of this has a native
  counterpart (rule 20); the published artifacts (Builder Hub, Layout System, Parity Audit) were NOT updated — the guide
  and the story were. They are a line in 1.1.1 and must be done before the pull request.
