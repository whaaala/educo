# 07 — THE MAP: every grid / flex / alignment / placement property × value → the builder

RULE MAP step 1 for BATCH R-4 (2026-10-04). It answers the user's question behind R-4: *"a user should be able to
position any component, any text, any information, wherever they want on the grid… with the margin and padding —
study it so we can discuss and then mirror it."*

**Built from:** 01 (box alignment) · 02 (grid guides) · 03 (grid properties) · 04 (flexbox) · 05 (the rest of CSS
layout, and the ranking of ways to place a box) · 06 (what the builder does today, read from the code at `2f56caa`) ·
`page-grid/04-map.md` and the AC-37b decisions (edge to edge, equal lines on every rung, Alt = free / Shift = half-lines,
free placement never breaks the page, one grid per site, readable width on). 08 (the A–Z property index) is checked
against this map in §7.

**How to read a row**
- **Today** — `HAVE` (a person can choose it, per screen) · `PART` (some values, indirect, or every screen at once) ·
  `ENGINE` (the engine emits it, nobody can choose it — a RULE UI gap) · `GAP` (not possible).
- **Verdict** — `CORE` (built in the batches this map implies) · `LATER` (worth having, not needed for "place
  anything anywhere"; parked with its reason) · `AVOID` (never offered: it breaks reflow, reading order, enlarged text
  or RTL — the reason is the rule) · `AUTO` (the builder does it for the person; no control).
- **Offered as** — the plain words a person sees (RULE UI: ready-made choices as live previews, then "make your own").
  Every CORE row is **per screen** (rule 18) unless it says otherwise.

**One fact from the code that shapes §2.A (read 2026-10-04 at `ff75658`):** G-1's page grid is COLUMN MATHS on the
existing flex row bands — a block's place is a SHARE (`width %`) plus a `%` left margin, snapped to the page grid's
lines (`lib/page-grid.ts`, `markPageGrid` / `SPACE_GRID` in `lib/box-model.ts`). Only the Grid block emits
`grid-column` / `grid-row`. Shares on a flex band can express A1, A2 and A15, but NOT "to the last line" that survives a
column-count change (A3), bleed over the padding (A4, A5) without negative margins, two blocks in one cell (I1), or a
nested block on the page's lines (J1). That is question 5 in §6.

---

## 1. The model a person is given — six questions, in order

A person never sees a CSS property. They answer six questions about a block, in this order; each question is one
panel section, and each answer is one or more rows of the map. The order is 05 §4's ranking: the higher the
question, the more of reflow, enlarged text and reading order the page gets for free.

| # | The question | What answers it (CSS) | Map |
|---|---|---|---|
| Q1 | **Where in the page does it come?** (before / after which block) | source order in the tree (drag to move); `order` per screen only for a visual swap | §2.F |
| Q2 | **Which columns does it cover?** (from line … to line …, or "N columns wide") | the page grid: `grid-column` start / end / span, incl. "to the last line"; rows follow the content | §2.A |
| Q3 | **Where does it sit inside that space?** (left / middle / right / fill × top / middle / bottom / fill) | `justify-self` + `align-self` (grid), auto margins + `align-self` (flex) | §2.C |
| Q4 | **How much room around and inside it?** | `margin` (incl. "push to the far end" = `auto`), `padding`, the container's `gap` | §2.G |
| Q5 | **How big may it get?** (shape, smallest, largest, readable width) | `aspect-ratio`, `min-/max-inline-size`, `max-width: Nch` | §2.H |
| Q6 | **Does it leave the flow?** (layer over a neighbour · float in its parent · stick · stay on screen) | overlap in a grid cell + `z-index` · `position: absolute` with logical insets · `sticky` · `fixed` | §2.I |

And for a CONTAINER (a section, a row, a Grid block, a card) three more:

| # | The question | What answers it | Map |
|---|---|---|---|
| C1 | **How are its blocks arranged?** (stacked · side by side · on a grid) | `display` flex / grid, `flex-direction`, `flex-wrap`, the Grid block's tracks | §2.B, §2.E |
| C2 | **How do they line up together?** (top / middle / bottom / text lines / fill; spread out) | `align-items` (incl. `baseline`), `justify-content` / `align-content` distribution | §2.C, §2.D |
| C3 | **Do nested blocks reuse the page's lines?** | `subgrid` | §2.J |

**Free placement (Alt)** answers Q2 + Q3 + Q4 at once: the drop point is turned into the nearest column lines (Q2)
plus an inner offset as MARGIN inside that slot (Q4) — never page x / y coordinates (05 §4: free x / y must resolve to
"grid cell + offset", or the page breaks at the first other width). So "anywhere" is honest at every screen, and it
never overlaps (decision 5) unless the person chooses Q6.

---

## 2. The map

### 2.A Placement on the page grid (Q2)

| # | Property · value | What it does | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|---|
| A1 | `grid-column: <start> / span <n>` | from a line, N columns wide | HAVE (`colStart`, `colSpan`, per screen) | CORE | the core of the page grid (G-3) | drag either edge to a line; "From column [3] · [6] wide" |
| A2 | `grid-column: <start> / <end>` (an END line) | from line to line | GAP (span only) | CORE | a person thinks "from here to there"; edge-anchored drag (rule 19) moves ONE line — storing the end keeps the other fixed by definition | the same drag; "to line [9]" |
| A3 | `grid-column: <n> / -1` (to the LAST line) | to the end whatever the count | GAP | CORE | the page grid's count changes per screen (4 / 8 / 12); "to the end" must survive it (03 trap 3: needs the explicit grid — the page grid has one) | "Reach the right edge" (and left, by start 1) |
| A4 | `grid-column: 1 / -1` (full width / bleed) | every column, over the side padding | PART (`span 12`, not bleed) | CORE | decision 1: bleed = start on the first line / end on the last, over the padding | "Full width" · "Bleed to the edge" (live previews) |
| A5 | half-bleed (from a content line to the page edge) | picture to one edge, words on the grid | GAP | CORE | in the approved plan (hero half-bleed) — needs named / outer lines (A9) | "Bleed left" · "Bleed right" |
| A6 | `grid-row: <start> / span <n>` | rows tall | HAVE (Grid block only) | CORE | a tall card beside two short ones (bento) | drag the bottom edge; "[2] rows tall" |
| A7 | `grid-row: … / -1` | to the last row | GAP | AVOID | rows follow the content (decision 2): there is no explicit row grid, so `-1` = line 1 (03 trap 3) — use span | — |
| A8 | `grid-area: <name>` + `grid-template-areas` | draw the page as a picture of names | GAP | AVOID as storage · CORE as PRESETS | all-or-nothing validity (02 T7), names collide with lines (T5), reshuffling areas per screen breaks reading order (T11). Every area layout is reachable with A1–A6 per screen, which never goes invalid | "Page layouts": header / sidebar / main / footer as one-click live previews that SET A1–A6 per screen |
| A9 | named lines (`[content-start]`, `[full-start]`…) | lines with names | GAP | AUTO | the engine names the lines it needs (content / full / half-bleed, Nexter `08`); a person never types a name (T5) | (behind A4 / A5) |
| A10 | negative line numbers other than −1 (`-2`, `-3`) | count from the end | GAP | AUTO | stored only when "keep N columns from the right" is what the drag meant (rare); the engine may emit them, no control | — |
| A11 | `span <n> / <end>` (span upward / leftward from a line) | anchored at the end | GAP | AUTO | what an edge drag on the LEFT edge means when the right edge is the anchor (rule 19) | (the drag) |
| A12 | implicit columns (placing past the last line) | the grid grows sideways | — | AVOID | 02 T2: clamp start + span to the count, every screen (G-1 does) | — |
| A13 | `grid-auto-flow: dense` | back-fill holes | GAP | LATER | order-free content only (a picture gallery), T10 / T11; offered on the Grid block when its items are all pictures | "Fill the gaps" (pictures only) |
| A14 | `grid-auto-flow: column` | fill down, then across | ENGINE (pager) | AVOID | reading order across ≠ down; the pager keeps it as engine-only | — |
| A15 | Half-lines (Shift) | a block starts on the middle of a column | HAVE in the plan (G-3) | CORE | decision 5: Shift = half-lines — the page grid's 24 lines inside 12 | hold Shift while dragging |

### 2.B Tracks — the shape of a grid (C1)

The PAGE grid's tracks are decided (equal columns on every rung, edge to edge, G-1). These rows are for the **Grid
block** (a grid inside a section) and the inner grid of a card.

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| B1 | `repeat(N, minmax(0, 1fr))` — N equal columns | HAVE (1–12) | CORE | already; T1-safe | "Columns: 2 · 3 · 4 · 6 · 12" previews |
| B2 | unequal shares `1fr 3fr` / `minmax(0,1fr) minmax(0,3fr)` | PART (as spans of 12) | CORE (as spans) | spans of the page grid express every share twelve divides; storing `fr` lists too would be a second model | "Splits: ⅓ + ⅔ · ¼ + ¾ · ⅔ + ⅓ …" (the G-4 gallery) |
| B3 | `repeat(auto-fit, minmax(min(100%, X), 1fr))` — "as many as fit, each at least X" | ENGINE (container-query narrowing, `CELL_MIN_REM = 12`) | CORE | the most-used responsive card grid on real sites; a person cannot set X today (06 engine-only #1) | "Cards fit: each at least [16] rem" (a ruler preview) |
| B4 | `auto-fill` vs `auto-fit` | GAP | CORE (one switch) | 1–2 items: stretch across (fit) or keep card size (fill) — T9, visibly different (RULE T) | "When there are few: stretch them · keep their size" |
| B5 | fixed track + fluid (`16rem minmax(0,1fr)`) — a sidebar of a set width | GAP | LATER | the page grid gives a sidebar a SPAN, which reflows by rung; a rem-fixed sidebar is a second sizing idea. Revisit if the pilot schools ask | — |
| B6 | `minmax(a, b)` sidebar between two sizes | GAP | LATER | as B5 | — |
| B7 | `fit-content(X)` / `auto` / `max-content` tracks (label column, image column) | GAP | LATER | a "label · value" list (02 #28) is a component's job (definition list), not the layout's | — |
| B8 | `grid-template-rows` explicit sizes | ENGINE (drag a cell taller) | AVOID as a control | rows follow the content (decision 2); a set row height cuts words at 150% text (WCAG 1.4.4) | — |
| B9 | `grid-auto-rows: minmax(<rem>, auto)` (rows at least X) | PART (Even / Follow the picture) | LATER | an even-height bento wants it; "Even" covers most | "Row height: fit content · even · at least [8] rem" |
| B10 | `grid-auto-columns` | ENGINE (pager) | AVOID | implicit columns are prevented (A12) | — |
| B11 | `display: grid-lanes` (masonry) | ENGINE (emulated) | LATER | Safari 26.4 only (T13); the emulation stays, real lanes inside `@supports` when Baseline | (existing "Follow the picture") |
| B12 | more than 12 columns on a Grid block | GAP | AVOID | the page grid is 12 (24 half-lines); a Grid block maps onto it (AC-37b NAMES) | — |

### 2.C Alignment of one block, and of all blocks together (Q3, C2)

The six alignment properties, by axis. "Across" = the inline axis (left ↔ right in English, mirrored in Arabic);
"down" = the block axis. The panel speaks in those two words only, and the engine picks the property that moves that
axis in the container the block is in (01 §2.1) — so the R4-4 label bug cannot recur.

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| C1 | `justify-self` start / center / end (grid child) | HAVE (two controls — R4-2) | CORE | one control only | "Across: Start · Middle · End · Fill" |
| C2 | `justify-self: stretch` (grid child) | HAVE (cell "Fill"), lost when a square is picked (R4-2) | CORE | fill one axis while placing on the other — 3×3 cannot (06 place-self) | the same row, "Fill" |
| C3 | across in a FLEX row: `margin-inline-start: auto` / both auto | HAVE (via the nine-point control) | CORE | CSS ignores `justify-self` in flex (01, 04 trap 5); auto margins are right | the same "Across" row — the engine writes auto margins |
| C4 | `align-self` start / center / end | HAVE (nine-point) | CORE | | "Down: Top · Middle · Bottom · Fill" |
| C5 | `align-self: stretch` explicitly | ENGINE (set by resize, no control) | CORE | 06 engine-only #9 | "Down: Fill" |
| C6 | `align-self: baseline` / `last baseline` | GAP | LATER (on the block) | rare on one block; CORE on the container (C9) | — |
| C7 | container `justify-items` start / center / end / stretch (grid) | HAVE | CORE | | container "Across: …" (the default for its blocks) |
| C8 | container `align-items` start / center / end / stretch | HAVE (mislabelled — R4-4) | CORE | relabel by axis | container "Down: …" |
| C9 | container `align-items: baseline` / `last baseline` | GAP | CORE | price + unit, heading + link, label + field lined up on their TEXT (01 §5, AC-25) — visibly different from "Top" when sizes differ | container "Down: Text lines up" |
| C10 | `safe` (`safe center`, `safe end`) | GAP | AUTO | centred content wider than a 360px phone loses its START side (01 §2.7); the engine writes `safe` on every centre / end it emits, with a plain fallback first for old WebViews (RULE AF) | — |
| C11 | physical `left` / `right` values | — | AVOID | breaks RTL (Arabic, RULE AF); `start` / `end` everywhere (04 trap 4, 02 T16) | — |
| C12 | `place-self` / `place-items` shorthands | (longhands) | AUTO | the export writes longhands (T18) | — |
| C13 | `justify-self` / `justify-items` on a flex container | — | AVOID | does nothing (01) | — |
| C14 | `align-content: center` on a plain block (2024+, no flex) | GAP | LATER | the zero-wrapper vertical centre of a band; the band is already flex, so nothing to gain today | — |
| C15 | abspos `place-self` (2025+) | GAP | LATER | Safari 26 only; I6 uses logical insets meanwhile | — |

### 2.D Distribution — spreading blocks and lines (C2)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| D1 | `justify-content` start / center / end (flex) | HAVE (`flex-start` / `flex-end`) | CORE | export `start` / `end` for RTL (04 check c) — to be MEASURED | "Spread: Packed at the start · Middle · End" |
| D2 | `space-between` / `space-around` | HAVE | CORE | | "Space between · Space around" |
| D3 | `space-evenly` | GAP | CORE | AC-25; visibly different from around (equal gaps at the edges too) | "Even spacing" |
| D4 | `justify-content` on a GRID container (a small grid of fixed tracks centred in a band) | GAP | LATER | our tracks are `1fr` — nothing to distribute (01: "-content often has nothing to distribute"); only matters with B5 | — |
| D5 | `align-content` (flex, wrapped lines): start / center / end / space-between / space-evenly | ENGINE (always `stretch`) | CORE | wrapped tag lists, logo walls, button groups in a TALL band: pack them top / middle / spread (06 engine-only #4) | container "Wrapped lines: Top · Middle · Bottom · Spread" (shown only when wrap is on AND the box has a height — otherwise it does nothing, 04 trap 5) |
| D6 | `align-content` on a grid (rows inside a taller grid) | GAP | LATER | rows follow content; a grid taller than its rows needs a set height (B8 avoided) | — |
| D7 | `stretch` / `normal` distribution | HAVE (default) | AUTO | | — |

### 2.E Flex flow (C1)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| E1 | `flex-direction: row` / `column` | HAVE | CORE | | "Side by side · Stacked" |
| E2 | `row-reverse` / `column-reverse` | GAP | AVOID | reverses what is SEEN, not what is read or tabbed (WCAG 1.3.2 / 2.4.3, 04 trap 4); "picture on the right on desktop, first on the phone" is done by Q1 + `order` per screen (F2) or the page grid (A1 per screen) | — |
| E3 | `flex-wrap: wrap` / `nowrap` | HAVE (forced `wrap` on a row band) | CORE | a nowrap row overflows a 360px phone (05 rank 2) — `nowrap` only for a menu bar that scrolls on purpose | "Let blocks wrap" (on by default) |
| E4 | `wrap-reverse` | GAP | AVOID | as E2 | — |
| E5 | `flex-grow` ratios (2 : 1) | PART (0 / 1) | LATER | in a page-grid section the share is the SPAN; in a free row Width % gives any share | — |
| E6 | `flex-shrink: 0` (keep its size: logo, avatar) | PART (Width "Fit" = `0 0 auto`) | CORE (as words) | "Fit" already means it; label it so | Width "Fit its content (never squeezed)" |
| E7 | `flex-basis` independent of width | PART | LATER | | — |
| E8 | `min-width: 0` on every fill item | ENGINE (floors; "Trim to size") | AUTO — to be MEASURED | 04 trap 1: a long word / URL overflows a 360px phone without it; check every fill emits it (or `overflow-wrap: anywhere` on its words) | — |
| E9 | the last line's lonely item stretching | ENGINE (14rem floors) | AUTO | 04 trap 3; `flex-flow: … balance` as an `@supports` enhancement LATER (experimental) | — |
| E10 | `display: inline-flex` / `inline-grid` | GAP | AVOID for blocks | a block is a box in a layout, never inline in a sentence; components (badges, icon + label) use it internally | — |

### 2.F Order (Q1)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| F1 | source order (the tree) | HAVE (drag to move) | CORE | the reading order IS the visual order by default (T11): a move a person means is a move in the tree | drag the block; Move up / Move down (Alt + ↑ / ↓) |
| F2 | `order` per screen | HAVE | CORE, with a WARNING | the one allowed visual swap: "picture first on phones" (plan). WCAG 1.3.2 needs the reading order kept only where it carries meaning (04 §7). That makes moving a picture fine, but not numbered steps, a list or a table. Swapping a block that holds a link, button or field is the "responsive order conflict" that affects switch-access and iOS VoiceOver users (04 §7: Campbell, Watson). Positive `tabindex` and `aria-flowto` are rejected fixes. The page check compares the order on screen with the order in the page for any block holding a link, button or field | "On this screen show it: first · last · at position [n]" + a warning when the block can be tabbed to |
| F4 | `display: flex` / `grid` on a `<table>`, or `display: contents` on anything but a plain wrapper | — | AVOID | either one strips the semantics a screen reader relies on (04 §7: Roselli, Bailey) | — |
| F3 | `reading-flow` / `reading-order` (new: makes Tab follow the visual order) | GAP | LATER | Chrome 137+ only; when Baseline, the engine adds it wherever F2 is used | — |

### 2.G Spacing (Q4)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| G1 | `margin` per side, ≥ 0, fluid rem, default on | HAVE | CORE | rule 3 (space by default) | "Outer spacing" all / each side, "Default · 1rem", back to default |
| G2 | `margin: auto` on one side — "push to the far end" | PART (`push` stored, no control; auto via the nine-point) | CORE | logo left / links right, split nav, card button to the bottom (`margin-block-start: auto`) — the most common placement idiom on real sites (01 §5, 04 §5) | "Push: to the end of the row · to the bottom of the card" |
| G3 | negative margin | GAP (min 0) | AVOID as a control | overlap in the flow; covers words at 150% text and on phones; every honest overlap is I1 (layer in a grid cell) or I5 (float in the parent). Overlapping avatars are a component's own CSS | — |
| G4 | `margin-left: %` (from an edge drag) | ENGINE (`marginLeftPct`, shown nowhere) | CORE (shown) | 06 engine-only #8: the control shows a length while a % wins | the Outer spacing field shows "12%" when that is what is stored, and can clear it |
| G5 | `padding` per side, fluid rem, default on | HAVE | CORE | | "Inner spacing" |
| G6 | `gap` / `row-gap` / `column-gap` | HAVE | CORE | gap is row FIRST in the shorthand (T6) — the export writes longhands | "Space between blocks · across · down" |
| G7 | logical sides (`margin-inline-start`…) | ENGINE (physical names today) | AUTO — to be MEASURED | RTL (Arabic, RULE AF): a "left" margin must become the start margin; check the export | (the panel says Start / End only on an RTL page) |
| G8 | `margin-trim` | GAP | LATER | Safari only | — |

### 2.H Size limits (Q5)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| H1 | `aspect-ratio` on any block | ENGINE (images only, own shape) | CORE | 16:9 video card, square tile, 4:5 portrait — real sites everywhere; with `min-height: auto` words still grow (no clipping) | "Shape: Free · Square · 4:3 · 16:9 · 3:4 · 4:5 · the picture's own" (live previews) |
| H2 | `max-inline-size: Nch` — readable width on text | PART (band "Centred column" only; G-1 readable width on for text by default) | CORE | decision 6 (~75 characters, Rule #1.9); per block, not only per band | "Readable width: on (≈ 65 ch) · wider · off" |
| H3 | `max-width` (rem / %) on any block | ENGINE (`100%` everywhere) | CORE | "never wider than [40] rem", e.g. a form or a quote | "Largest width: [ ] rem · %" |
| H4 | `min-width` | ENGINE (floors) | LATER | the fit rule already widens the span when words need it (content decides the span); a hand min-width fights it | — |
| H5 | `max-height` | GAP | AVOID | cuts words at 150% text (1.4.4) unless it scrolls; a scroll area is a component (carousel, table) | — |
| H6 | `height` / `min-height` in rem / svh | HAVE (free text accepts px — R4-5) | CORE | `min-height` only: a band at least half the screen grows with its words; px rejected (R4-5) | "Height: fit content · half the screen · full screen · at least [ ] rem" |
| H7 | `min-content` / `max-content` / `fit-content` by name | PART (Fit) | AUTO | Width "Fit" is `fit-content` in words | — |
| H8 | `box-sizing: border-box` | ENGINE | AUTO | | — |

### 2.I Leaving the flow (Q6)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| I1 | two blocks in the SAME grid cell (same lines) + `z-index` — a caption over a picture, a card straddling a band | GAP | CORE | 05 rank 3: the safe way to layer — both stay in the flow, the cell grows to the taller one, nothing is covered by surprise; plan G-5 "straddle" | drag a block onto another's lines with "Layer over"; Front / back per screen |
| I2 | `z-index` for blocks in the flow | GAP | CORE (with I1 only) | layering only means something where blocks overlap | Bring forward · Send back |
| I3 | `position: relative` + small offset (nudge) | GAP | LATER | rank 4: an optical tweak; free placement (Alt) uses margin, never this. If added: em, capped at 1em, never on words | — |
| I4 | `position: absolute` in the parent ("Floating") with `left` / `top` % | HAVE (every screen at once — R4-3) | CORE | decoration and short labels only; parent grows padding to hold it | "Floating in its box" |
| I5 | anchor a floating block by ANY edge: `inset-inline-end` / `inset-block-end` | GAP (left / top only) | CORE | a badge in the top-RIGHT corner must stay there as the card narrows; logical so it mirrors in Arabic | the nine-square picker for "Held to: top-left … bottom-right" + distance in rem |
| I6 | `inset: 0` — fill the parent (an overlay, a full-cover link) | GAP | CORE | overlays (AREA V) and "the whole card is a link" | "Cover the whole box" |
| I7 | `position: sticky` | HAVE | CORE | | "Sticks when reached" |
| I8 | `position: fixed` | HAVE | CORE | | "Stays on screen" |
| I9 | anchor positioning (`anchor-name`, `position-anchor`, `position-area`) | GAP | LATER | tooltips, menus, a note attached to a picture — component work; needs a fallback (05 rank 8) | — |
| I10 | `transform: translate` as placement | ENGINE (canvas only) | AVOID | it moves pixels only: the block is read and focused where it was, and nothing makes room (05 rank 9) | — |
| I11 | `float` + `shape-outside` (words around a picture) | GAP | LATER | AC-8; editorial pages; must turn off below ~30rem | — |
| I12 | `columns` (multi-column text) | GAP | LATER | AC-19 | — |

### 2.J Nesting (C3)

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| J1 | `grid-template-columns: subgrid` — a card / Grid block on the PAGE's lines | GAP | CORE | AC-36 / G-4: a Grid block inside a section uses the page lines; Baseline 2023, with a `@supports not` fallback for old WebViews (T12) | automatic for a Grid block on the page grid; "Use the page lines" switch |
| J2 | `grid-template-rows: subgrid` — card titles / texts / buttons line up across a row | GAP | CORE | the most-asked card-row fix (02 #35, 01 §5) | Cards row: "Line up titles and buttons" |
| J3 | `display: contents` | GAP | AVOID | drops the box and has dropped semantics (T15) | — |
| J4 | `display: block` / `flow-root` for a container | GAP | LATER | every container is flex or grid; a "just a block" container has no use the person can see | — |

### 2.K The container's own display (C1)

`display: flex` (stack / row) and `grid` (Grid block, page grid) — HAVE · CORE. `none` per screen — HAVE · CORE
("Hidden on this screen"). Everything else in `display` — AVOID / LATER as above (E10, J3, J4).

---

## 3. What this adds up to

**CORE (to build):** A1–A6, A15 · B1–B4 · C1–C5, C7–C9 · D1–D3, D5 · E1, E3, E6 · F1, F2 · G1, G2, G4–G6 · H1–H3, H6 ·
I1, I2, I4–I8 · J1, J2 · K. Of those, **new to the builder** (GAP / ENGINE today → a control):

1. **End lines, "to the last line", full bleed and half-bleed** (A2–A5) — the page grid's placement.
2. **Page layouts as presets** (A8) that set lines per screen — never `grid-template-areas`.
3. **"Cards fit, each at least X" + fill / fit** (B3, B4).
4. **One alignment control per axis with Fill** (C1–C5) — replaces the nine-point + the two "Line up" controls (fixes R4-2, R4-4).
5. **Text lines up (baseline)** (C9) and **Even spacing** (D3), **wrapped lines Top / Middle / Bottom / Spread** (D5).
6. **Push to the end / to the bottom** (G2) and the stored `%` margin shown (G4).
7. **Shape (aspect-ratio)**, **readable width per block**, **largest width** (H1–H3).
8. **Layer over in the same cell** (I1, I2), **floating held by any corner** (I5), **cover the whole box** (I6).
9. **Subgrid**: Grid blocks on the page lines (J1), card rows lined up (J2).

**AUTO (the engine does it; measured, never a control):** A9–A11 · C10 (`safe`) · C12 · E8 (`min-width: 0`) · E9 ·
G7 (logical sides) · H7, H8 · the export writes longhands only.

**AVOID (never offered — the reason is the rule):** A7, A12, A14 · B8, B10, B12 · C11, C13 · E2, E4, E10 · G3 · H5 ·
I10 · J3.

**LATER (parked with a reason):** A13 · B5–B7, B9, B11 · C6, C14, C15 · D4, D6 · E5, E7, E9's `balance` · F3 · G8 · H4 ·
I3, I9, I11, I12 · J4.

---

## 4. Combinations with the page grid, margin and padding (RULE MAP step 3 — what the proof must build)

Each axis below is independent; the proof (`scripts/research/css-layout-combos.js`) draws random combinations of one
value from each, on `examples/combos.html`, at every screen of `scripts/uat/screens.js` and at 100 / 150 / 200 % text,
in six headed windows. For every combination it asserts:

1. **It draws where it says** — the block's slot (box + its margins) starts and ends on the lines it was given
   (A1–A5, per rung), and inside the slot it sits where Q3 says (start / middle / end / fill, both axes, RTL mirrored).
2. **It never breaks the page** — no sideways scroll; no two blocks overlap unless the combination chose I1 / I4;
   no words cut (`scrollWidth`), at 150 % and 200 % text too.
3. **It is visibly different** (RULE T) — each value of each axis, changed alone, moves at least one box by ≥ 4 px
   compared with the combination without it (or the check says why it cannot here, e.g. D5 with one line).
4. **The order is the reading order** — DOM order = Tab order; a visual swap (F2) is reported, not failed.

| Axis | Values drawn |
|---|---|
| placement (Q2) | span n from line s · s to e · s to the last line · full width · bleed · half-bleed left / right · half-line start |
| across (Q3) | start · middle · end · fill |
| down (Q3) | top · middle · bottom · fill · (container) text lines up |
| outer spacing (Q4) | default · 0 · 2rem one side · push to the end · push to the bottom |
| inner spacing | default · 0 · 2rem |
| size (Q5) | free · square · 16:9 · readable width · largest 20rem |
| layer (Q6) | in the flow · layered over its neighbour in the same cell · floating held top-right · cover the whole box |
| container | stacked · side by side wrapping (spread · even · wrapped lines middle) · Grid block cards fit ≥ 14rem (fill / fit) · card row on subgrid |
| page | LTR · RTL (`dir="rtl"`) |
| screen | every entry of `screens.js` (70) |
| text size | 100 · 150 · 200 % |

### 4.1 The proof — results (2026-10-04, HEADED, six windows)

`node scripts/research/css-layout-combos.js --n=420 --seed=<7|11|23>` runs on `examples/combos.html`, a dressed school
page: a header with its links pushed to the end, a hero holding the SUBJECT block and a partner card, a container
section, a fees row lined up on the text, and a footer. In RTL the page is in Arabic. Each seed runs the 68 single values
(every value of every axis alone, at 1280 and 360) plus 420 random combinations over all 70 screens of `screens.js`, at
100 / 150 / 200 % text. Logs are in `scripts/uat/logs/r4-combos-final-s*.out`.
- **Final: 10,908 checks, 0 failed.** Two values cannot show here, and that is measured: a readable width or a 20rem cap
  is wider than a 360px phone. Six WARNINGS, all a person's own 2rem inner space breaking a word on a phone at 200 %
  text.
- **Mutation-proven:** Across "Middle" wired to `end` (5 failures) · a floating block held by physical `right` instead
  of the logical end (4) · the fit rule switched off (48) · the floating fallback switched off (32).
- **Screenshots read:** RTL phone layered, floating with fallback, bleed, subgrid cards.

**Rules the proof FORCED. Each was found by a failure, then fixed and re-run. The build must implement them; they are
not optional:**
1. **Cover fills its area whatever else is set.** Box alignment applies to an absolute box too (01 §3), so Down: Top
   shrank an inset-0 overlay, and a cap or a shape shrank it as well. When Cover is on, the panel greys out alignment,
   shape and caps.
2. **A shape always fills across and never fills down.** With Down: Fill, or Across not Fill, `aspect-ratio` takes the
   width from the height, and the block ran up to 4,539px wide on a phone. The words may still make it taller (no
   clipping).
3. **An absolute block on the grid writes BOTH lines in each axis.** An `auto` line of an absolutely positioned grid
   child is the container's padding edge, not the track, so the cover ran 32px past its row.
4. **The fit rule applies to EVERY block, and tests whole words.** `overflow-wrap: anywhere` hides an overflow by cutting
   the word ("Welco / me"), so the fit test measures with normal wrapping. The block plus its margins must also fit
   between its lines. A bleed grows toward the content; nothing else may grow over the side space. A neighbour whose
   words do not fit beside it takes its own row (the row wraps, never squeezes). Both blocks of a layered pair must fit.
5. **A floating block with words falls back into the flow on a screen where its words do not fit its area** (05 rank
   5), measured after its neighbours have settled.
6. **Default inner space is fluid** (`clamp(0.75rem, 0.5rem + 2cqi, 1.5rem)`). A fixed 1.5rem became 48px a side at 200 %
   text and broke words on 320–414px phones. A person's own fixed space gets a page-check WARNING, not a block.
7. **An RTL page is a page in its language, and every text block takes `dir="auto"`.** English sentences on an RTL page
   put the full stop on the wrong side (L4).
8. **Layering over a block that has WORDS covers them.** That is the choice working as asked, but the page check must
   warn when a layer covers words and not only a picture (I1, G-5).

**Nested (RULE MAP "at every level"):** a section → a Grid block → a card → a button: the card is placed with A + C, its
button pushed to the bottom (G2), the card row on subgrid (J2), the section's padding at default / 0. A parent must not
clip a child's floating badge (I5) or its layer (I1).

---

## 5. Checks this map carries into the build (MEASURE in a browser first — RULE V)

These came out of READING (01 §6, 04 §6, 06); each is measured before it becomes a ledger line or closes as NOT A BUG:

- **E8** — does every Fill block (and every column-direction fill) get `min-width: 0` / `min-height: 0`, so a 30-character
  URL in a 360px card wraps instead of pushing the page sideways?
- **D1 / C11 / G7** — on a page with `dir="rtl"`, does the export use `start` / `end` and logical sides, so "push to the
  end" and "held top-right" mirror?
- **C10** — does a centred row wider than a 360px phone lose its first item off the left edge today?
- The five open ledger lines **R4-1 … R4-5** (tree, BATCH R-4).

---

## 6. Open questions for the user (to settle when signing the "enough" checklist)

1. **Page layouts (A8)** — offer header / sidebar / main / footer as one-click presets that set lines per screen
   (recommended), rather than a "draw your areas" editor?
2. **Negative margins (G3)** — never offered; overlap only by layering in a cell (I1) or floating (I4)? (recommended)
3. **A fixed-width sidebar (B5)** — LATER, since a page-grid span already reflows by screen? (recommended)
4. **The alignment control (C1–C5)** — replace the nine squares with two rows "Across · Down", each with Fill
   (recommended — the nine squares cannot say "fill across, middle down")?
5. **How the page grid is EMITTED** — a page-grid section becomes a real CSS grid (`grid-template-columns` with the
   page's lines, each block placed by `grid-column`, per screen) instead of shares on a flex band? Recommended: it is
   the only way to get A3–A5, I1 and J1, and the Grid block already works this way. Pages saved before keep their
   bands (a mode, never a migration — the AC-37b decision). The examples in `examples/` are written this way so the
   proof answers whether it holds at every screen.

---

## 7. Checked against the A–Z property index (08)

08 lists MDN's 575 properties: 304 are layout in a generous reading, 213 were already stored and the other 91 were read
for 08. Every one of the 304 is either a row in §2 or in one of the groups below. Five of them, plus one finding from
05 §7, become rows in the map:

| # | Property · value | Today | Verdict | Why | Offered as |
|---|---|---|---|---|---|
| L1 | logical sizing — `inline-size`, `min-/max-inline-size`, `min-/max-block-size` | physical `width` / `height` | AUTO — to be MEASURED with G7 | 05 §7.1: flex and grid already align in inline / block terms, so a physical width mixed in breaks in RTL and vertical writing; H1–H6 are emitted logically | — |
| L2 | `scroll-margin-block-start` / `scroll-padding-block-start` | GAP | AUTO | a sticky header (I7) covers the heading a link jumps to (05 rank 6, WCAG 2.4.11); the engine sets the page's scroll padding to the header's height whenever a header sticks | — |
| L3 | `env(safe-area-inset-*, fallback)` on blocks held to the screen edge | GAP | AUTO | 05 §7.10: a block that stays on screen (I8) at offset 0 sits under a phone's notch; always written with a fallback, because without one the whole declaration is dropped | — |
| L4 | the `dir` attribute, never CSS `direction` | (to be checked) | AUTO | 05 §7.1: direction is content, so it must survive with CSS switched off; a page or block in Arabic gets `dir="rtl"` (RULE AF languages) | the page / block language setting |
| L5 | `overflow: clip`, not `hidden`, where something is cut on purpose | (to be checked) | AUTO | 05 §7.13: `hidden` makes a scroll container, and that kills `sticky` (I7) inside it; `clip` does not | — |
| L6 | `field-sizing: content` | GAP | LATER | a form field that grows with what is typed belongs to the form component, not the layout | — |

**Not part of placing a block, with the reason:**
- **Borders, `border-*-width`, `border-image-*`, the `corner-*-shape` family** — what a box looks like, not where it
  goes. They belong to AREA V and to rule 3's radius controls.
- **Gap decorations (`column-rule-*`, `row-rule-*`, `rule-*`)** — lines drawn in the gaps. Experimental, AREA V,
  LATER.
- **Scroll snap and scrolling (`scroll-snap-*`, `scroll-margin-*` apart from L2, `scrollbar-*`, `overscroll-*`,
  `scroll-initial-target`)** — belong to the pager and carousel components, which are already stored in `advanced-css/07`
  and `scroll-and-position`.
- **Text flow (`white-space-collapse`, `text-wrap-mode`, `word-break`, `hyphens`, `tab-size`, `ruby-*`…)** — typography.
  The one rule placement relies on, that words wrap instead of cutting (`overflow-wrap: anywhere`), is E8's.
- **`contain-intrinsic-*`, `content-visibility`** — speed and weight on low-cost phones (RULE AF budget), not placement.
  They go to the AF performance work.
- **Multi-column and fragmentation (`columns`, `column-*`, `break-*`, the deprecated `page-break-*`)** — I12 is LATER,
  print is not this area, and the deprecated `page-break-*` aliases are never emitted.
- **Legacy and non-standard properties (`box-align`, `box-flex`, `box-orient`, `box-pack`… and `-moz-`/`-webkit-`-only
  ones)** — AVOID: they are never emitted.
- **Motion path and `zoom`** — never used to place a block (05 rank table).

So the map covers all 304 layout properties. Placing a block needs the rows in §2 and L1–L5; everything else above goes
to AREA V, to a component, to the AF performance work, or is never emitted.
