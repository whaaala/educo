# CSS Grid (the Grid section)

Advanced CSS and Sass, the CSS Grid section. Distilled from the transcripts the user shared on 2026-10-01. Each
technique is marked against the builder: `HAVE` · `PARTIAL` · `GAP` (README).

## What CSS Grid is — the mindset and the terminology

**What:** a two-dimensional layout system native to CSS — rows AND columns at once — "a whole new mindset" for layout,
CSS and even markup. It works WITH Flexbox: **Grid for two-dimensional layouts (the page / app frame), Flexbox for
one-dimensional ones (a line of items inside)**. With native grids, frameworks like Bootstrap are no longer needed: "CSS
is now the framework itself", and a layout is no longer bound to a fixed **12-column** system.

**Terminology:**
- **grid container** — `display: grid`; its direct children are the **grid items**;
- **row axis** (x, horizontal) and **column axis** (y, vertical) — FIXED, unlike Flexbox's main / cross axes, which turn
  with `flex-direction`;
- **grid lines** — the horizontal and vertical lines dividing the grid, numbered automatically from 1 to
  (columns + 1) and (rows + 1);
- **gutter** — the space between tracks; the row gutter and the column gutter can differ;
- **track** — the space between two adjacent lines: a **row** (horizontal) or a **column** (vertical);
- **grid area** — the space between any two vertical and two horizontal lines; a **grid cell** is the smallest area
  (between ADJACENT lines both ways).

**The properties (a reference, explained in the lectures that follow):**
- container — `grid-template-rows` / `-columns` / `-areas` (shorthand `grid-template`), `row-gap` / `column-gap` /
  `gap`, `justify-items`, `align-items`, `justify-content`, `align-content`, `grid-auto-rows` / `-columns` /
  `-flow` (all of it: the `grid` shorthand);
- item — `grid-row-start` / `-end` and `grid-column-start` / `-end` (shorthands `grid-row`, `grid-column`,
  `grid-area`), `justify-self`, `align-self`, `order`.

**For the builder:**
- Grid + Flexbox together → `HAVE`: two engines, a `grid` layout and flex rows / stacks; the dressed pages already use
  Grid for the frame and Flexbox inside (the Trillo wrap-up's split);
- **the "12 columns" point** → the builder keeps a twelve-column grid UNDERNEATH (precise spans, a shared boundary that
  resizes like a table cell — `feedback_twelve_columns`) with a table picker on top, so a person picks "3 across" rather
  than spans. Whether ANY track list can be expressed — unequal named tracks (`2fr 1fr`), tracks that are not
  divisions of twelve (5 or 7 columns), `minmax()` / `auto` / content-sized tracks — is **to confirm lecture by lecture**
  as each one is stored;
- separate row and column gutters → `HAVE` (*Space across* and *Space down* on every container);
- grid lines, areas, cells → the vocabulary the inspector and the story (RULE L) should use consistently; cells are
  selectable and resizable today (click the box, click again to go inside).

## The first grid — `display: grid`, template rows / columns, gaps, the Firefox grid inspector

**The demo (CodePen, Firefox):** a `.container` with six `.item.item--1 … --6` (Emmet: `.item.item--$*6` numbers them),
each a number and a colour name; the container `#eee`, `1000px` wide, `margin: 30px auto`; items `padding: 20px`,
`30px` sans-serif, white, one built-in colour each (orangered, yellowgreen, blueviolet, palevioletred, royalblue,
goldenrod).
- `display: grid` alone changes nothing visible — no rows or columns are defined yet;
- **`grid-template-rows: 150px 150px`** — two rows, one value per row (its height); **`grid-template-columns: 150px
  150px 150px`** — three columns (its width): six items laid out 3 × 2 **with no wrapper per row** (the float way needed
  one wrapper per line of three);
- **gutters:** `grid-row-gap: 30px`, `grid-column-gap: 30px` (they may differ), or both at once with `grid-gap: 30px`
  (today's names: `row-gap`, `column-gap`, `gap` — the `grid-` prefix is the old spelling, still accepted);
- **Firefox's grid inspector** (the Layout tab): an overlay of the grid on the page, with **line numbers** (1–4 for the
  columns, 1–3 for the rows) and the gaps drawn — the course's reason to use Firefox for this section.

**For the builder:**
- a grid of items with no row wrappers → `HAVE`: a grid block's children flow into its cells; the builder never wraps a
  line of cells in an extra box (the agreed layout rule "no wrappers unless grouped");
- **fixed pixel tracks** (`150px`) → deliberately not stored (rule 16): column widths are shares of the container
  (twelfths, `%`/`fr`), row heights come from the content with an optional minimum in `rem`; the demo's look is
  reachable, its units are not;
- row gap ≠ column gap → `HAVE` (*Space across* / *Space down*, from the spacing tokens, fluid, `0` allowed);
- the modern **`gap` / `row-gap` / `column-gap`** → `HAVE`: checked 2026-10-01, `grid-gap` / `gridGap` appears nowhere
  in `lib/box-model.ts` or `lib/box-export.ts`;
- **seeing the grid while editing** (the inspector overlay: tracks, gaps, line numbers) → `PARTIAL / to confirm`: the
  canvas outlines cells and shows the resize boundary of a selected cell; a full overlay of the tracks and gaps while a
  grid is selected — what Firefox gives a developer — is what a person placing blocks in a grid needs too. **AC-29**,
  editor (not the published page).

## Sizing tracks — `repeat()` and the fractional unit `fr`

- **`repeat(count, size)`** writes many equal tracks at once: `repeat(2, 150px)` = `150px 150px`; it mixes with other
  tracks: `repeat(2, 150px) 300px`.
- **`fr`, the fractional unit** — new with Grid: a fraction of the **free** space left after the fixed tracks and the
  gaps. `150px 150px 1fr` — the last column takes all that remains (Grid's answer to Flexbox's `flex: 1`);
  `repeat(3, 1fr)` — three equal columns; `1fr 2fr 1fr` — the free space in four parts, the middle gets two (235 / 470 /
  235px in the 1000px demo); `1fr 3fr 1fr` — five parts; `3fr 3fr 1fr` and so on.
- **Any unit mixes in:** `50% 1fr 1fr` — the 50% is of the WHOLE container and **ignores the gaps** (500px of 1000), so
  a bigger gap only narrows the `fr` columns; the `fr` tracks then share what is left by their numbers.
- **`fr` for rows** works the same once the container has a height (`height: 1000px` + `repeat(2, 1fr)` fills it) —
  "more useful on the columns".
- Items are placed **automatically in source order** so far; placing them by hand is next.

**For the builder (checked in `lib/box-model.ts`, 2026-10-01):**
- equal columns → `HAVE`: a grid block writes `grid-template-columns: repeat(N, minmax(0, 1fr))` (`minmax(0, …)` so long
  content cannot blow a track open — stronger than a bare `1fr`), any N from 1 to **`GRID_MAX` = 12**, so 5 or 7
  columns are possible; per rung the count steps down (1 on a phone unless set, capped by cell width on a tablet);
- **unequal shares** (`1fr 2fr 1fr`, `2fr 1fr`) → `HAVE` by SPAN: the same proportions are cells spanning 1 · 2 · 1 of
  four tracks, or 8 · 4 of twelve; unlike the course's `%`, a span includes the gaps it crosses, so 50% stays half;
- **row tracks** → `HAVE`: rows are written from the content (`gridRowTracks`: `auto` or an even share per row), and a
  row can have a minimum height in `rem`;
- **a fixed or content-sized track BESIDE fluid ones** (`20rem 1fr` — a sidebar of a set width and a main area that
  takes the rest; `auto 1fr` — a label column as wide as its longest label; `150px 150px 1fr`) → `PARTIAL`: in a flex
  ROW it is `HAVE` (one block at a set width, the other *Fill*); in a GRID every track is a share of the whole, so a
  column that keeps its width while the others flex cannot be made. **AC-30.**

## Placing items on the grid — by line numbers

- By default the **automatic placement algorithm** lays items out in SOURCE order, cell by cell.
- An item is placed into a cell by the LINES around it: `grid-row-start: 2; grid-row-end: 3; grid-column-start: 2;
  grid-column-end: 3` puts item 1 in the middle cell of row 2 — the others flow round it, still in source order.
  Setting only the row moves it to that row at once.
- **Shorthands:** `grid-row: 2 / 3`, `grid-column: 2 / 3`; and **`grid-area: row-start / col-start / row-end /
  col-end`** (all four in one — "a bit confusing", the course prefers the two-property form).
- Item 5 → `grid-row: 1 / 2; grid-column: 3 / 4`; item 6 → `grid-row: 1 / 2; grid-column: 2 / 3` (the exercise).
- Line numbers from the Firefox inspector make this easy (Chrome had no line numbers then).
- Next: **spanning** several cells — "without that, grids wouldn't make much sense".

**For the builder (checked in `lib/box-model.ts`):**
- auto-placement in source order → `HAVE` (the default; blocks flow into the next cell);
- **placing a block in a chosen cell** → `HAVE` in the model: a grid child stores **`colStart`** ("1-based track to begin
  at, undefined = auto-place after the previous") and **`rowStart`** ("1-based row, undefined = auto-place"), with spans
  (`rowSpan`, the column span); the builder writes the CSS, the person drags a block into a cell or resizes it — no line
  numbers to learn. What the UAT must cover: a block dropped into an EMPTY cell AHEAD of others (the course's item 1 in
  the middle with the rest flowing round), and how that placement steps down per rung (on a phone a single column
  ignores the placed column — the order a phone reader gets is then the source order, which is the accessible answer);
- **a visual order that differs from the source order** (item 1 placed in the middle cell, item 5 top-right) → the same
  WCAG 1.3.2 / 2.4.3 caution as `order` (Trillo responsive part 2): screen readers and Tab follow the source; the page
  audit can flag a placed block that lands far from its reading position.

## Spanning cells — an end line further away, `span`, `-1`, and items that overlap

- **Three ways to span:** (1) an end line further away — `grid-column: 2 / 4` covers two cells; (2) the **`span`**
  keyword — `grid-column: 1 / span 2` ("better": the size, not the line, is what you mean); (3) **`-1`, the last line** —
  `grid-column: 2 / -1` runs to the end whatever the column count, so changing the start or the number of columns never
  needs a second edit. All three work for rows.
- **The implicit grid:** when spans leave more items than cells, Grid ADDS tracks (here a new row) — named later. A span
  past the last line (`span 3` from line 2) creates an empty IMPLICIT column — avoid it; `-1` cannot.
- **Collisions:** an item placed where another was explicitly placed moves on to the next free place — unless its row is
  placed too; then BOTH sit in the same cell and **overlap** (the later one on top). `z-index: 10` brings the other to
  the front. Several items in one cell is deliberate and common: galleries, layered pictures and text.
- Item 5 → `grid-row: 1 / 3` spans two rows.

**For the builder:**
- spanning columns and rows → `HAVE`: a cell is widened or deepened by dragging its edge (a shared boundary, rule 19),
  stored as a span (`rowSpan`, the column span) — the person never meets line numbers;
- **"to the end", whatever the column count** (`-1`) → `HAVE` in effect: spans are re-tracked when the column count
  changes (`retrackGrid`, onto twelve where needed), and per rung a phone stacks everything to one column; to confirm in
  the UAT that a full-width cell STAYS full width when the count is changed from 3 to 4 (the case `-1` exists for);
- the implicit grid → `HAVE`: rows are generated from the content (`gridRowTracks`), never an empty column — a span is
  clamped to the track count;
- **two blocks deliberately in the SAME cell, layered** (a caption over a picture, a picture overlapping its neighbour
  in a gallery or a collage) → `PARTIAL`: a picture BEHIND content is a cell's background (colour / picture / gradient /
  pattern), and a block can be FLOATED (absolute, with a layer order) inside a cell; but two blocks in the flow sharing
  one grid area — the CSS that keeps the layout responsive, unlike a float — cannot be made. **AC-31.**

## Placing items by NAMED lines

(The demo has become a small page: a header across the top, four boxes, a main area with a sidebar on the right, a
footer — the lecture before this one, building it, was not among the transcripts.)
- **Naming a line:** square brackets in the track list — `grid-template-rows: [header-start] 100px [header-end
  box-start] 200px [box-end main-start] 400px [main-end footer-start] 100px [footer-end]`. Best practice: name the
  CONTENT of the track and say start / end. **A line can carry several names** (`header-end box-start` is one line).
- **Using them:** exactly like numbers — `grid-row: box-start / main-end`.
- **Names inside `repeat()`** make a **named set of lines**: `repeat(3, [col-start] 1fr [col-end]) 200px [grid-end]` —
  three columns, each starting at `col-start` and ending at `col-end`; the clashing names are told apart by a number:
  `col-start 1`, `col-end 1` (= `col-start 2`), … `col-end 3`. The header `col-start 1 / grid-end`, the sidebar
  `col-end 3 / grid-end`, the main area `col-start 1 / col-end 3`, the footer `col-start 1 / grid-end`.
- "In professional layouts we always name the lines" — the next lecture shows a third method.

**For the builder:**
- named lines are an AUTHORING convenience for a person writing CSS; in the builder nobody writes lines — placement is
  stored per block (`colStart` / `rowStart` + spans) and written out by the export. Nothing to adopt for the editor;
- the published CSS is generated, so readable line names would only help someone reading the export — not a goal
  (one flat class per block, lecture 9). No gap;
- the layout itself — header across, main + a fixed-width sidebar, footer across — is the most common page frame in the
  crawl: `HAVE` as bands (header / main row / footer), and as a GRID it needs **AC-30** (the sidebar's fixed `200px`
  track beside `1fr` tracks).

## Placing items by NAMED AREAS — `grid-template-areas`

- **The template:** one string per row, one name per cell — a TEXT PICTURE of the layout:
  ```
  grid-template-areas: "head head head head"
                       "box  box  box  side"
                       "main main main side"
                       "foot foot foot foot";
  ```
  Short names, because they repeat. **Every cell must be named** (16 for a 4 × 4 grid) or the whole template is ignored.
- **Placing:** `grid-area: head` (no quotes) — the item fills every cell with that name; the sidebar `side`, `main`,
  `foot`. Unplaced items (the boxes) are still auto-placed.
- **An empty cell is a dot** `.` — but auto-placed items flow INTO it, so to really keep it empty the neighbours must be
  placed too: the three boxes named `box-1 box-2 box-3` and placed one by one (one name for three cells would make ONE
  area). A header can share its row with a deliberate empty cell.
- **The philosophy:** layout FIRST (draw it), then name the items — unlike line numbers / names, where each item is
  positioned by thinking about lines. Areas suit small layouts (4 × 4, 5 × 5); for a large one (12–15 columns, many rows)
  named LINES are more practical.
- The three methods: line numbers · line names · area names.

**For the builder:**
- "layout first, then put things in it" is already how a person builds: draw the grid (the table picker), then drop
  blocks into cells and drag their edges — the editor IS the text picture, so nothing to write. `HAVE` in spirit; the
  export writes numbers and spans, not areas;
- **a deliberately empty cell** → to confirm: placing a block at a later `colStart` leaves the cells before it empty, so
  the model can express it; whether a person can MAKE and keep an empty cell through the UI (move a block one cell
  along, leaving a hole, and have later blocks not flow back into it) is a UAT line — the course's own trap;
- **the whole arrangement redrawn per screen size** — the strength areas are known for: one `grid-template-areas` per
  breakpoint moves header / main / sidebar / footer around without touching the HTML. The builder's equivalent is
  per-rung overrides of placement and span (`ResponsiveOverride` covers `colStart` / `rowStart` / spans) plus the
  automatic one-column stack on a phone → `HAVE` in the model; the inspector's per-rung placement is part of the same
  "to confirm" line as direction and order;
- areas would help ONE reader: the LLM composer (RULE APP) could emit a layout as an area picture — a compact, checkable
  description — which the engine turns into placements. A design note for the composer, not a layout gap.

## Explicit and implicit grids — `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`

**The demo:** eight items ("Modern · CSS · with · Flexbox · and · Grid · is · great") in a 1000px container,
`grid-template-rows: repeat(2, 150px)`, `grid-template-columns: repeat(2, 1fr)`, `grid-gap: 30px`.
- The 2 × 2 tracks written in the template are the **explicit grid**; the four items that do not fit get tracks ADDED
  for them automatically — the **implicit grid** (in Firefox: a solid outline round the explicit grid, dashed lines
  inside it, dotted lines in the implicit part).
- **`grid-auto-rows: 80px`** sizes the added rows (the explicit ones stay 150px).
- **`grid-auto-flow`** decides WHERE the extra items go: `row` (the default) fills row by row and adds rows;
  **`column`** fills column by column — "Modern" then "CSS" BELOW it — and adds columns, sized by
  **`grid-auto-columns: .5fr`** (half an `fr` of the explicit ones; `grid-auto-rows` then no longer matters).
- **Why it matters:** when the number of items is not known in advance — content loaded from a server, 10 or 12 or 20
  items — the added tracks are still styled, so the grid looks right whatever arrives.

**For the builder:**
- a grid that grows as blocks are added → `HAVE`: the builder writes the row tracks from the content
  (`gridRowTracks` — one entry per line of cells, `auto` or an even share) and never needs an implicit grid to rescue it;
- **one height for every row, however many there are** (`grid-auto-rows`) → `HAVE` in effect: a minimum row height in
  `rem`, applied to the grid's rows; equal-height cells come from the row stretching by default;
- **a data-bound grid of unknown length** (news, events, staff, a gallery fed from records — RULE APP's application
  layer) → the auto-row pattern is exactly what that list component must emit: one template for a card, `repeat(...)`
  columns, rows added as records arrive, an empty state and a loading state. A design note for the data-bound list
  component, not a layout gap;
- **`grid-auto-flow: column` — fill DOWN, then across** (an A–Z directory, a staff list read top to bottom per column,
  or a sideways strip that adds columns) → `GAP` for the reading order: the builder's grids fill across. Joins **AC-19**
  (one content flowing through columns) — the same reader's need, solved there by `columns` or here by
  `grid-auto-flow: column` with a set number of rows; the sideways strip is the scroll-snap pager the builder already
  measured (`reference_scroll_snap_pager`).

## Aligning items INSIDE their cells or areas — `align-items`, `justify-items`, `align-self`, `justify-self`

(Back to `grid-auto-flow: row`; item 4 crimson, `grid-row: 2 / span 3`; item 7 `grid-column: 1 / -1` — the
auto-placement moved item 4 to the first column and added a fourth implicit row.)
- **`align-items`** on the grid container aligns every item VERTICALLY (column axis) inside its cell or area:
  `stretch` (the DEFAULT — why items fill their cells), `start`, `center`, `end`. A spanned item is aligned inside its
  whole AREA (item 4 centred in three rows).
- **`justify-items`** — the same HORIZONTALLY (row axis): `stretch` default, `start`, `center`, `end`. Flexbox has no
  equivalent (it is one-dimensional); together they centre an item both ways in its area.
- **`align-self` / `justify-self`** on one item override the container's setting for that item only (item 4
  `align-self: start; justify-self: start` → top-left of its area).
- Next: aligning whole TRACKS inside the container.

**For the builder:**
- **per-block placement inside its cell** → `HAVE`: *Place in the cell* writes `justify-self` across and `align-self`
  down for a grid child (`placeCSS` — "a GRID cell: both axes belong to the child. Simple."), start / centre / end each;
  doing nothing leaves the default STRETCH, so a block fills its cell;
- **one setting for ALL the blocks of a grid** (`align-items` / `justify-items` on the container) → `PARTIAL / to
  confirm`: the builder sets placement per block; a grid-wide "line everything up at the top / centre" control saves a
  person setting it on every cell — to check what *Line up* on a selected grid writes, in the UAT;
- `stretch` for ONE block when the grid's others are centred → the same as **AC-27** (per-block placement offers start /
  centre / end only), now for grids as well as rows.

## Aligning whole TRACKS inside the container — `justify-content`, `align-content`; filling holes with `dense`

(Columns `repeat(2, 200px)`, rows `100px`, the container `1000px × 1000px` — the tracks now leave empty space in it.)
- **`justify-content`** moves the whole set of column tracks HORIZONTALLY inside the container: `start`, `center`,
  `end`, `space-between`, `space-around`, `space-evenly` — exactly Flexbox's values.
- **`align-content`** does the same for the row tracks VERTICALLY. Both `center` → the grid sits in the middle of its
  container.
- **The naming logic:** `…-items` / `…-self` align ITEMS inside their cells; `…-content` aligns the TRACKS inside the
  container; `align-…` is always vertical (column axis), `justify-…` always horizontal (row axis).
- **Holes:** item 6 (`grid-row: span 2`) left an empty cell, because auto-placement keeps SOURCE order and never goes
  back. **`grid-auto-flow: row dense`** back-fills holes with later items — a packed grid with no gaps, useful for image
  galleries of mixed sizes (at the price of the visual order no longer following the source).

**For the builder:**
- aligning the tracks → rarely needed: the builder's tracks are `minmax(0, 1fr)` shares and always fill the width, so
  there is no spare width to distribute. It matters only beside **AC-30** (fixed-width tracks) — a set of fixed-width
  cards centred in a wide band — and vertically with **AC-25** (`align-content` in a band of fixed height). No new gap;
  both lines note it;
- **`dense` packing** → `GAP` (checked: the export never writes `dense`): a grid of mixed spans — a gallery with a few
  wide or tall pictures, a "bento" grid of feature tiles — leaves holes where the next block does not fit. The builder's
  MASONRY (a fine row unit, `aa6d32f`) solves the vertical case for equal-width columns; mixed column spans with
  back-filling do not exist. With the reading-order caution (WCAG 1.3.2): `dense` only for content whose order does not
  carry meaning (pictures, tiles), never for text that is read in sequence. **AC-32.**

## Content-sized tracks — `max-content`, `min-content`, `minmax()`

(Eight coloured items again; rows `repeat(2, 150px)`, the rest in the implicit grid.)
- **`max-content`** — the track is as wide as its content WITHOUT any line break: `max-content 1fr 1fr max-content`; a
  long sentence in the last cell made that column huge and left the `1fr` columns the rest.
- **`min-content`** — as narrow as the content allows WITHOUT overflowing sideways: the width of its LONGEST WORD
  ("awesome"); the text then wraps onto many lines and overflowed the fixed `150px` row — fixed by `min-content` on the
  rows too (the row grows to fit).
- **`minmax(min, max)`** keeps a track between two sizes, whatever happens:
  - rows `minmax(150px, min-content)` — at least 150px, taller when the content needs it (shrinks back when the text is
    removed);
  - columns `minmax(200px, 300px) repeat(3, 1fr)` with the container at `90%`: the first column is 300px while there is
    room, shrinks with the window, and never goes below 200px (the grid then overflows rather than squeeze it);
  - `minmax(200px, 50%)` — half the container until half is less than 200px;
  - `minmax(200px, 1fr)` — an equal share until that share would be under 200px, then fixed at 200px.
- **The `1fr` surprise:** three `1fr` columns came out DIFFERENT widths in a narrow container — because **`1fr` is
  never smaller than its content's min-content** (it is really `minmax(auto, 1fr)`), so a column with a long word stays
  wider. Not a bug: the specification.

**For the builder:**
- **the `1fr` surprise** → `HAVE`, already solved: the builder writes `minmax(0, 1fr)`, so equal columns STAY equal
  however long a word is; the long word wraps instead of widening its column — checked: `.eu-root { overflow-wrap:
  break-word }` (and on `h1–h4`) in `lib/educo-ui/base.ts`, so a word longer than its cell breaks rather than overflows.
  This is the right trade for a builder (a teacher's long word must not wreck a three-card row) and should be in the
  story (RULE L) as the reason columns stay even;
- **a row that is at least X but grows with its content** (`minmax(150px, min-content)` / `auto`) → `HAVE`: a block's
  *minimum height* in `rem`, height `auto` otherwise — content never overflows a fixed height in the builder;
- **content-sized columns** (`max-content` — a label column, a button column as wide as its words; `min-content`) and
  **bounded columns** (`minmax(200px, 300px)`, `minmax(12rem, 1fr)` — a sidebar between two sizes) → **AC-30**
  (widened: fixed, content-sized and BOUNDED tracks beside fluid ones). In a flex row today a block can have a min / max
  width; in a grid it cannot. `minmax(<rem>, 1fr)` is also the heart of the auto-fit grid — the next lecture.

## `auto-fill`, `auto-fit` and the responsive grid with no media query

(Rows back to 150px, the container back to 1000px.)
- **`repeat(auto-fill, 100px)`** — instead of a count: as many 100px tracks as FIT the container — 10 (1000 / 100),
  though there are only eight items; the two spare tracks stay, empty.
- **`repeat(auto-fit, 100px)`** — creates the same 10 tracks (the last line is still 11) but **collapses the empty ones
  to 0 width**, so the free space is left over at the end, ready to be taken.
- **`repeat(auto-fit, minmax(100px, 1fr))`** — the columns GROW to share that free space; with the container at `90%`,
  shrinking the window drops a column whenever another 100px no longer fits (8 → 7 → … ); with `minmax(200px, 1fr)`:
  5 → 4 → 3 → 2 → 1 columns as the window narrows, each always at least 200px, and the extra items flow onto new rows,
  sized by `grid-auto-rows: 150px`. **A fully responsive grid without one media query** — "a huge trick".
- That covers almost all of Grid; the next section is a whole project built with it.

**For the builder (checked, 2026-10-01):**
- the trick is in the codebase — but only INSIDE one component: the Accordion's grid variation writes
  `repeat(auto-fit, minmax(min(100%, 15rem), 1fr))` (`lib/educo-ui/components.ts`), the improved form: `min(100%, 15rem)`
  so a column never demands more than the container has — the course's `minmax(200px, 1fr)` OVERFLOWS a container
  narrower than 200px (it showed exactly that: "the grid doesn't even fit anymore");
- the builder's own GRID blocks do not use it: they write a fixed count, `repeat(N, minmax(0, 1fr))`, and step it down
  at the RUNGS (`gridColumnsAt`: one column on a phone unless set, a cap by cell width on an upright tablet) — so the
  columns change with the WINDOW at five fixed widths, not with the grid's OWN width wherever it sits. Rule 16's first
  ingredient says "fluid layouts — intrinsic auto-fit grids that STACK on narrow", and a grid inside a sidebar or a
  half-width column today keeps its desktop count until the window crosses a rung. **AC-33 — an "as many as fit, each at
  least X rem" grid** (auto-fit + `minmax(min(100%, X rem), 1fr)`), offered beside "exactly N across"; the layout DoD
  must decide whether it becomes the DEFAULT for card / gallery grids (rule 16 says it should) with the fixed count kept
  for pages already saved. It interacts with spans (a span of 2 in an auto-fit grid of unknown count) — part of the
  decision.
