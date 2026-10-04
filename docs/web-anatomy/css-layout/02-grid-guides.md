# CSS Grid Layout — the MDN guide, every page (RULE R / RULE MAP, step 1)

Read 2026-10-04 from MDN's **CSS grid layout** module page and every guide it links to. Every page was pulled as its
**raw Markdown source** from `github.com/mdn/content` (the exact text MDN renders), so no summariser stood between the
page and this file: every paragraph, every note and every example was read. The decorative demo styling MDN hides in
`css hidden` blocks (orange borders, padding) is left out of the examples below; everything that does layout is kept.

**What is already stored, and NOT repeated here** (one-line pointers where a topic overlaps):
- [`../advanced-css/07-grid.md`](../advanced-css/07-grid.md) — the course's Grid section: terminology, `fr`, `repeat()`,
  line numbers, `span`, `-1`, named lines, areas, explicit / implicit, `grid-auto-flow: column`, item and track alignment,
  `dense`, `min-content` / `max-content` / `minmax()`, the `1fr` = `minmax(auto, 1fr)` surprise, `auto-fill` vs
  `auto-fit`; and the builder's status for each (gaps AC-29 … AC-33).
- [`../advanced-css/08-nexter.md`](../advanced-css/08-nexter.md) — a whole page on named lines: full-bleed and half-bleed,
  nested grids, overlapping pictures on a fine grid, a mosaic gallery, `@supports`; gaps AC-34 … AC-36 (subgrid).
- [`../page-grid/01-builders-and-systems.md`](../page-grid/01-builders-and-systems.md) — how builders and design systems
  do a page grid (axes A1–A15), subgrid caveats, reading order.
- [`../page-grid/04-map.md`](../page-grid/04-map.md) — THE MAP for the page grid (axes A1–A24, the 80/20, open questions).

This file adds what those do not have: the MDN guides' exact rules and examples, the parts no earlier source covered
(absolute positioning in a grid, `display: contents`, anonymous items, "order-modified document order", how
auto-placement treats items placed on one axis only, `auto-fit`'s collapse rules and its forbidden combinations, the
subgrid gap / line-number / implicit-track rules, writing modes and `grid-area`'s value order, the spec's reordering
conformance rule, grid lanes (masonry)), then a goal → CSS list and the traps for a tool that GENERATES grid CSS.

---

## 1. Completeness table

| # | URL | Read fully? | Notes |
|---|-----|-------------|-------|
| 0 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout | yes | Module landing page: intro, one example, reference lists, 13 guide links, related modules, see-also. Read via WebFetch AND raw source. |
| 1 | …/Grid_layout/Basic_concepts | yes | raw source, 778 lines |
| 2 | …/Grid_layout/Relationship_with_other_layout_methods | yes | raw source (+ WebFetch cross-check) |
| 3 | …/Grid_layout/Line-based_placement | yes | raw source |
| 4 | …/Grid_layout/Grid_template_areas | yes | raw source (+ WebFetch cross-check) |
| 5 | …/Grid_layout/Named_grid_lines | yes | raw source |
| 6 | …/Grid_layout/Auto-placement | yes | raw source |
| 7 | …/Grid_layout/Box_alignment ("Aligning items in CSS grid layout") | yes | raw source |
| 8 | …/Grid_layout/Logical_values_and_writing_modes | yes | raw source |
| 9 | …/Grid_layout/Accessibility | yes | raw source |
| 10 | …/Grid_layout/Common_grid_layouts | yes | raw source |
| 11 | …/Grid_layout/Subgrid | yes | raw source + browser-compat-data |
| 12 | …/Grid_layout/Grid_lanes ("Grid lanes layout" — what the brief called *masonry layout*; MDN renamed it) | yes | raw source + browser-compat-data. Experimental. |
| 13 | …/Guides/Box_alignment/In_grid_layout | yes | raw source |
| 14 | …/Reference/Values/flex_value (`fr`) | yes | on-topic value page (short) |
| 15 | …/Reference/Values/repeat | yes (to "Formal syntax") | the `auto-fill` / `auto-fit` rules and the forbidden combinations are here and nowhere in the guides |
| 16 | …/Reference/Values/minmax | yes (to "Formal syntax") | `max < min` rule, `fr` only as max, `auto` as min / max |
| 17 | …/Reference/Values/fit-content_function | yes (to "Formal syntax") | |
| 18 | /en-US/docs/Glossary/Grid, Grid_Areas, Grid_Axis, Grid_Cell, Grid_Column, Grid_Container, Grid_Lines, Grid_Row, Grid_Tracks, Gutters | yes | 10 glossary entries; one statement on implicit lines discussed in Traps §T3 |
| 19 | /en-US/docs/Learn_web_development/Core/CSS_layout/Grids (the Learn module, linked from the guides) | partly | prose and notes read; its examples repeat the guides' (header / sidebar / footer, 12 columns) and were skimmed, not transcribed. New: "`fr` shares AVAILABLE space"; "gaps cannot be `fr`"; the five rules of `grid-template-areas`. |
| 20 | /en-US/docs/Web/CSS/How_to/Layout_cookbook/Media_objects (linked from Grid template areas) | yes | `fit-content(200px)` image track |
| 21 | browser-compat-data: `display.grid-lanes`, `display.contents`, `grid-template-columns.subgrid`, `grid-template-rows` | yes | support numbers below |
| — | Not followed (off-topic or covered elsewhere): property reference pages (`grid-template-columns`, `grid-column-start`, `align-items` … — another researcher), Flexbox / Multicol / Writing-modes / Logical-properties / Media-queries guides, Box alignment overview, the Containing-block guide, external links (Grid by Example, CSS-Tricks, Codrops, Firefox DevTools, CSS Grid Garden, Léonie Watson, Adrian Roselli, YouTube videos), the CSSWG spec itself (quoted only where MDN quotes it). | — | Listed so nothing is silently skipped. |

---

## 2. The guides, page by page

### 2.0 The module page — https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout

**Concepts.** Grid divides a page into major regions, or defines size / position / layering relationships between the
parts of a control. Like tables it aligns into columns and rows, but items can also **overlap and layer** like positioned
elements. The module's vocabulary: properties `grid-template-columns/-rows/-areas`, `grid-template`, `grid`,
`grid-auto-columns/-rows/-flow`, `grid-column-start/-end`, `grid-row-start/-end`, `grid-column`, `grid-row`, `grid-area`;
functions `repeat()`, `minmax()`, `fit-content()`; the `<flex>` type (`fr`). Related modules: Display (`display`,
`order`), Box Alignment (`align-*`, `justify-*`, `place-*`), Gaps (`gap`, `row-gap`, `column-gap`), Box Sizing
(`aspect-ratio`, `min-content`, `max-content`, `fit-content`). Spec: CSS Grid Layout Level 2.

**Example (minimal) — a 3-column grid, rows at least 100px, items placed by lines, overlapping:**
```html
<div class="wrapper">
  <div class="one">One</div><div class="two">Two</div><div class="three">Three</div>
  <div class="four">Four</div><div class="five">Five</div><div class="six">Six</div>
</div>
```
```css
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; grid-auto-rows: minmax(100px, auto); }
.one   { grid-column: 1 / 3; grid-row: 1; }
.two   { grid-column: 2 / 4; grid-row: 1 / 3; }   /* overlaps .one in column 2, row 1 */
.three { grid-column: 1;     grid-row: 2 / 5; }
.four  { grid-column: 3;     grid-row: 3; }
.five  { grid-column: 2;     grid-row: 4; }
.six   { grid-column: 3;     grid-row: 4; }
```
Note the overlap is a *feature*: `.one` and `.two` share a cell and the later one in source paints on top.

---

### 2.1 Basic concepts of grid layout — …/Grid_layout/Basic_concepts

Mostly covered by [07](../advanced-css/07-grid.md) (terminology, `fr`, `repeat()`, implicit grid, `minmax`, lines, span,
gaps, overlap with `z-index`). What MDN adds:

- **Five capabilities** listed as what grid IS: fixed and flexible track sizes · item placement (numbers, names, areas,
  plus an algorithm for unplaced items) · creation of additional tracks ("as many columns as fit") · alignment control ·
  control of overlapping content (`z-index`).
- **`display: inline-grid`** also makes a grid container (the container is inline-level). Only **direct children** become
  grid items. `display: grid` alone looks unchanged — a one-column grid is made.
- **You define TRACKS, the grid gives you LINES.** Three columns → four column lines.
- **Implicit tracks are `auto`-sized by default**: big enough for their content AND sharing remaining free space.
- **`minmax(100px, auto)`**: the `auto` max lets the row grow to its content's `max-content` while also sharing free space.
- **Repeat a pattern:** `repeat(5, 1fr 2fr)` = 10 tracks; part of a list: `20px repeat(6, 1fr) 20px` = 8 tracks.
- **Gaps** are taken out *before* `fr` space is shared; "for sizing they act like a regular track, but you cannot place
  anything into a gap" — "a thick, transparent line".
- **Grid areas must be rectangular** — no L shape.
- **Nested grid without subgrid** has NO relationship to the parent: it does not inherit `gap`, its lines do not align.

Examples (minimal):
```css
/* explicit columns, implicit rows sized */
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 200px; }
/* full-width item over 2 rows; second item 1 column × 2 rows; the rest auto-place */
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 100px; }
.box1 { grid-column: 1 / 4; grid-row: 1 / 3; }
.box2 { grid-column: 1;     grid-row: 3 / 5; }   /* end omitted = span 1 */
/* gaps: different across and down */
.wrapper { column-gap: 10px; row-gap: 1em; }      /* = gap: 1em 10px  (row first!) */
/* nested: independent vs subgrid */
.box1 { grid-column: 1 / 4; grid-row: 1 / 3; display: grid; grid-template-columns: repeat(3, 1fr); } /* own tracks */
.box1 { grid-column: 1 / 4; grid-row: 1 / 3; display: grid; grid-template-columns: subgrid; }        /* parent's */
/* overlap, then reorder the layers */
.box1 { grid-column: 1 / 4; grid-row: 1 / 3; z-index: 2; }
.box2 { grid-column: 1;     grid-row: 2 / 4; z-index: 1; }  /* without z-index box2 would be on top (later in source) */
```
**Traps:** a `z-index` on a grid item works **without `position`** (grid items, like flex items, honour `z-index`
directly). Without one, source order decides who is on top.

---

### 2.2 Relationship of grid layout to other layout methods — …/Relationship_with_other_layout_methods

**Concepts.**
- **One vs two dimensions.** Wrapped flex items form independent flex *lines*; the items on line 2 do not line up under
  line 1. When you want them to line up by row AND column → grid.
- **Content out vs layout in.** Flexbox: the items' sizes decide the spacing on each line. Grid: draw the layout, then
  put items in (or let auto-placement). Content-sized grid tracks change the *whole track*.
- **Rule of thumb:** "If you are using flexbox and find yourself disabling some of the flexibility" — e.g. setting a
  width on a flex item so it lines up with the row above — "you probably need grid."
- **Box alignment is shared**: `align-items`, `align-self`, `justify-content` … mean the same family of things in both.
  In grid, items align **inside their grid area**, not the container. `start`/`end` (grid) and `flex-start`/`flex-end`
  are synonyms in grid.
- **`fr` + `minmax()` + `auto-fill`/`auto-fit`** give grid the "as many as fit" behaviour of a wrapping flex row while
  keeping columns aligned.

Examples (minimal):
```css
/* flex: wrapped items share each line independently */
.wrapper { width: 500px; display: flex; flex-wrap: wrap; } .wrapper > div { flex: 1 1 150px; }
/* grid: same five items, strict columns, a hole at the end of row 2 */
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); }
/* alignment in grid: end by default, item 1 stretched, item 2 at start */
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); align-items: end; grid-auto-rows: 200px; }
.box1 { align-self: stretch; } .box2 { align-self: start; }
/* as many 200px tracks as fit (spare tracks stay, empty) */
.wrapper { display: grid; grid-template-columns: repeat(auto-fill, 200px); }
/* as many as fit, at least 200px, sharing the rest */
.wrapper { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
```

**Absolutely positioned items in a grid (NEW — not in 07/08):**
```css
/* 1. The grid container is the containing block: the item's offsets are measured from ITS GRID AREA */
.wrapper { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 20px; position: relative; }
.box3 { grid-column: 2 / 4; grid-row: 1 / 3; position: absolute; top: 40px; left: 40px; }
/* 2. A grid AREA as the containing block for something inside the item */
.box3 { grid-column: 2 / 4; grid-row: 1 / 3; position: relative; }
.abspos { position: absolute; top: 40px; left: 40px; }
```
Rules stated:
- An absolutely positioned grid item with a grid position takes **its grid area** as containing block (if the container
  is `position: relative`); without a grid position, the container's padding box.
- It is **out of flow**: auto-placed items flow into the same space; it does **not** create the implicit row it "spans
  to" (in the example it does not make row 3 exist).
- If the grid container is **not** positioned, the containing block is the nearest positioned ancestor (or the viewport);
  the item then takes no part in the grid at all.

**`display: contents` (NEW):** the element's own box disappears and its children "rise up a level" to become grid items
of the grandparent grid — an alternative to subgrid for flattening a wrapper.
```html
<div class="wrapper">
  <div class="box box1"><div class="nested">a</div><div class="nested">b</div><div class="nested">c</div></div>
  <div class="box box2">Two</div><div class="box box3">Three</div><div class="box box4">Four</div><div class="box box5">Five</div>
</div>
```
```css
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: minmax(100px, auto); }
.box1 { grid-column: 1 / 4; display: contents; }   /* box1's placement is now ignored; a, b, c auto-place */
```
**Traps:** with `display: contents` the wrapper's own placement, background, border and padding vanish (it has no box).
The Accessibility guide links Adrian Roselli's "`display: contents` is not a CSS reset" — historically browsers dropped the
element's semantics (a `<ul>` or `<button>` with `display: contents` lost its role). Use it only on role-less wrappers.

---

### 2.3 Grid layout using line-based placement — …/Line-based_placement

Covered in [07](../advanced-css/07-grid.md) (numbers, shorthands, `grid-area`, `span`, `-1`, overlap). What MDN adds:

- **Lines are indexed from 1 in the writing mode's direction** — in Arabic (RTL), line 1 is on the RIGHT.
- **Empty cells for free:** "the ability to have white space in our designs without any hacks" — place items and leave
  cells unplaced.
- **Default span is 1** — the end can be omitted in longhand and shorthand (`grid-column: 3`).
- **`grid-area: row-start / column-start / row-end / column-end`** — "the opposite of margin's order", because it is
  flow-relative: both STARTS (block-start, inline-start) then both ENDS (block-end, inline-end).
- **Negative numbers count from the end of the EXPLICIT grid only.** `-1` is the last line of the template, never the
  last implicit line.
- **Reversed start / end are fine**: `grid-column-start: -1; grid-column-end: -2` places in the last column (the example
  flips the whole layout by counting from the end).
- **Gaps** only between tracks, never at the container's outer edges. `gap: 1em 20px` → **row-gap first, column-gap
  second**. Anything starting at a line starts after the gap; "if you want gutters that act like tracks, define a track
  for that purpose".
- **`span` on the START side**: `grid-row-start: span 3; grid-row-end: 4` spans UPWARD from line 4 to line 1.
- Unplaced items still auto-place — "if something appears somewhere unexpected, check that you have set a position for it".
- Wrong start/end lines produce **unintended overlap**.

Examples (minimal):
```css
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 100px); }
.box1 { grid-column: 1;     grid-row: 1 / 4; }       /* longhand: grid-column-start: 1; grid-row-start: 1; grid-row-end: 4 */
.box2 { grid-column: 3;     grid-row: 1 / 3; }
.box3 { grid-column: 2;     grid-row: 1; }
.box4 { grid-column: 2 / 4; grid-row: 3; }
/* the same four with grid-area (row-start / col-start / row-end / col-end) */
.box1 { grid-area: 1 / 1 / 4 / 2; } .box2 { grid-area: 1 / 3 / 3 / 4; }
.box3 { grid-area: 1 / 2 / 2 / 3; } .box4 { grid-area: 3 / 2 / 4 / 4; }
/* the same with span */
.box1 { grid-column: 1; grid-row: 1 / span 3; } .box4 { grid-column: 2 / span 2; grid-row: 3; }
/* counting backwards: mirror of the above */
.box1 { grid-column-start: -1; grid-column-end: -2; grid-row-start: -1; grid-row-end: -4; }
/* stretch across the whole explicit grid */
.item { grid-column: 1 / -1; }
```

---

### 2.4 Grid template areas — …/Grid_template_areas

Covered in [07](../advanced-css/07-grid.md) (the ascii picture, `.` for empty, every cell named, per-breakpoint
redraw). What MDN adds:

- **Areas can be mixed with line placement** (method can be "used alone or in combination").
- **Several dots count as ONE cell** when not separated by whitespace — `...` is one empty cell; `. . .` three. Extra
  spaces only align the picture.
- **Invalid template → the whole property is ignored**: rows with different cell counts, or a non-rectangular area
  (L or T shape), or (Learn module) **the same name in two separate places**.
- **Name areas OUTSIDE media queries** (`.header { grid-area: hd }`), redraw only `grid-template-areas` /
  `grid-template-columns` inside them — so `main` is always `main`.
- **Small components too**, not only pages: the media object, flipped by redrawing the template.
- **Shorthands reset**: `grid-template` sets rows + columns + areas; `grid` also sets `grid-auto-rows`,
  `grid-auto-columns`, `grid-auto-flow`. Anything not written is reset to its initial value — "be aware that it may
  reset things you have applied elsewhere". MDN also warns they "quickly become difficult to read".

Examples (minimal):
```html
<div class="wrapper">
  <div class="header">Header</div><div class="sidebar">Sidebar</div>
  <div class="content">Content</div><div class="footer">Footer</div>
</div>
```
```css
.header { grid-area: hd; } .footer { grid-area: ft; } .content { grid-area: main; } .sidebar { grid-area: sd; }
.wrapper {
  display: grid; grid-auto-rows: minmax(100px, auto);
  grid-template-columns: 1fr;
  grid-template-areas: "hd" "main" "sd" "ft";                    /* phone: one column, source order */
}
@media (width >= 30em) {
  .wrapper {
    grid-template-columns: repeat(9, 1fr);
    grid-template-areas:
      "hd hd hd hd   hd   hd   hd   hd   hd"
      "sd sd sd main main main main main main"
      "sd sd sd ft   ft   ft   ft   ft   ft";                    /* sidebar runs down beside the footer */
  }
}
@media (width >= 60em) {
  .wrapper {
    grid-template-areas:
      "hd hd hd   hd   hd   hd   hd   hd hd"
      "sd sd main main main main main ft ft";                    /* footer becomes a right column */
  }
}
/* empty cells under the sidebar */
.wrapper { grid-template-areas: "hd hd hd hd hd hd hd hd hd" "sd sd sd main main main main main main" ". . . ft ft ft ft ft ft"; }
/* media object and its mirror */
.media         { display: grid; grid-template-columns: 1fr 3fr; grid-template-areas: "img content"; }
.media.flipped {                grid-template-columns: 3fr 1fr; grid-template-areas: "content img"; }
.media .image { grid-area: img; } .media .text { grid-area: content; }
/* all of it in one shorthand: area string + row size per row, then / column list */
.wrapper {
  display: grid;
  grid-template:
    "hd hd hd hd   hd   hd   hd   hd   hd"   minmax(100px, auto)
    "sd sd sd main main main main main main" minmax(100px, auto)
    "ft ft ft ft   ft   ft   ft   ft   ft"   minmax(100px, auto)
    / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
```
**Cookbook (Media objects, linked):** `grid-template-columns: fit-content(200px) 1fr` — the image track is as wide as a
small icon, but stops at 200px for a large photo (which then scales down with `img { max-width: 100% }`);
`grid-template-rows: 1fr auto` with areas `"image content" "image footer"` pushes the footer to the bottom; the grid is
only declared at `width >= 500px`, so on a phone the parts simply stack. A nested media object sits in the second track
(first when flipped).

---

### 2.5 Layout using named grid lines — …/Named_grid_lines

Named lines in brackets, several names per line, `repeat()` with names, `name N` — covered in
[07](../advanced-css/07-grid.md) and used heavily in [08](../advanced-css/08-nexter.md). What MDN adds:

- **Names are `<custom-ident>`s, unquoted**; avoid words from the spec — **never `span`** (also not `auto`, which is
  invalid as an ident here).
- **Implicit AREAS from named lines:** lines named `X-start` and `X-end` in BOTH axes create an area `X` you can use with
  `grid-area: X` — no `grid-template-areas` needed.
- **Implicit LINES from named areas:** every area `X` in `grid-template-areas` creates lines `X-start` and `X-end` in both
  axes. One line can carry two such names (`sd-end` = `main-start`).
- **Name collisions across `repeat()`:** `repeat(4, [col-start] 1fr [col-end])` writes adjacent names onto the same line
  (`[col-end col-start]`) — merged, exactly like listing two names.
- **`span N name`** spans to the N-th line OF THAT NAME: `grid-column: col1-start 2 / span 2 col1-start`.
- **Names keep media queries on the container**: redefine the track list per breakpoint, leave the items alone.
- **A 12-column "framework" needs no framework**: one declaration; the gap is subtracted before `fr` is shared, so no
  percentage arithmetic.

Examples (minimal):
```css
.wrapper {
  display: grid;
  grid-template-columns: [main-start] 1fr [content-start] 1fr [content-end] 1fr [main-end];
  grid-template-rows:    [main-start] 100px [content-start] 100px [content-end] 100px [main-end];
}
.box1 { grid-column-start: main-start;    grid-row-start: main-start; grid-row-end: main-end; }
.thing { grid-area: content; }        /* implicit area from content-start / content-end in both axes */

/* lines created by areas */
.wrapper { display: grid; grid-template-columns: repeat(9, 1fr); grid-auto-rows: minmax(100px, auto);
  grid-template-areas: "hd hd hd hd hd hd hd hd hd" "sd sd sd main main main main main main" "ft ft ft ft ft ft ft ft ft"; }
.overlay { z-index: 10; grid-column: main-start / main-end; grid-row: hd-start / ft-end; }  /* over header→footer */

/* twelve lines all called col-start */
.wrapper { display: grid; gap: 10px; grid-template-columns: repeat(12, [col-start] 1fr); }
.item1to5 { grid-column: col-start / col-start 5; }
.item7to9 { grid-column: col-start 7 / span 3; }
.main-header, .main-footer { grid-column: col-start / span 12; }
.side1   { grid-column: col-start    / span 3; grid-row: 2; }
.content { grid-column: col-start 4  / span 6; grid-row: 2; }
.side2   { grid-column: col-start 10 / span 3; grid-row: 2; }

/* a repeated PAIR of named tracks */
.wrapper { display: grid; grid-template-columns: repeat(6, [col1-start] 1fr [col2-start] 3fr); }
.item1 { grid-column: col1-start / col2-start 2; }
.item2 { grid-row: 2; grid-column: col1-start 2 / span 2 col1-start; }
```

---

### 2.6 Auto-placement in grid layout — …/Auto-placement

`grid-auto-rows`, `grid-auto-flow: column`, `dense` — covered in [07](../advanced-css/07-grid.md). What MDN adds:

- **Implicit rows are `auto`** — sized to their content "without causing an overflow".
- **`grid-auto-rows` takes a LIST that repeats**: `grid-auto-rows: 100px 200px` alternates 100 / 200 / 100 / 200 …;
  `grid-auto-columns: 300px 100px` the same for columns with `grid-auto-flow: column`.
- **"Order-modified document order":** unplaced items are placed in source order **as modified by `order`** — `order`
  changes auto-placement, not just painting.
- **Placed items go first.** The algorithm places every item with a definite position, THEN auto-places the rest; "the
  auto-placed items will place themselves before the placed items in DOM order, they don't start after the position of a
  placed item that comes before them" — a later item can land visually before an earlier placed one.
- **Spanning auto-placed items** (`grid-column-end: span 2; grid-row-end: span 2`) skip forward to the first place they
  fit — **leaving holes**; the cursor never goes back (sparse packing).
- **`dense`** goes back and fills holes with later items that fit; `grid-auto-flow: column dense` when flowing by column.
  "Tab order will still follow the document order." Fine for a photo gallery; **not** for a form ("you wouldn't want the
  labels and fields to become jumbled up").
- **Anonymous grid items:** loose text directly inside a grid container becomes an anonymous item — always auto-placed,
  cannot be targeted, may "show up somewhere unexpected".
- **Items fixed on ONE axis** (the definition-list example): `dt { grid-column: 1 }`, `dd { grid-column: 2 }` —
  auto-placement chooses the row, keeping terms left and definitions right however many of each there are.
- **What auto-placement cannot do (yet):** "target every other cell"; "place against the next line named *n*"
  (CSSWG issue #796).

Examples (minimal):
```css
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; grid-auto-rows: minmax(100px, auto); }
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; grid-auto-rows: 100px 200px; }
.wrapper { display: grid; grid-template-rows: repeat(3, 200px); gap: 10px; grid-auto-flow: column; grid-auto-columns: 300px 100px; }

/* placed items first, the rest flow round them */
.wrapper { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 100px; gap: 10px; }
.wrapper div:nth-child(2) { grid-column: 3;     grid-row: 2 / 4; }
.wrapper div:nth-child(5) { grid-column: 1 / 3; grid-row: 1 / 3; }
.wrapper div:nth-child(4n + 1) { grid-column-end: span 2; grid-row-end: span 2; }   /* holes appear */
.wrapper { grid-auto-flow: dense; }                                                   /* holes back-filled */

/* gallery: landscape photos span two columns, dense packing */
.wrapper { display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 10px; grid-auto-flow: dense; }
.wrapper li.landscape { grid-column-end: span 2; }
```
```html
<dl><dt>Mammals</dt><dd>Cat</dd><dd>Dog</dd><dd>Mouse</dd><dt>Birds</dt><dd>Pied Wagtail</dd><dd>Owl</dd><dt>Fish</dt><dd>Guppy</dd></dl>
```
```css
dl { display: grid; grid-template-columns: auto 1fr; max-width: 300px; }
dt { grid-column: 1; font-weight: bold; }
dd { grid-column: 2; }
```

---

### 2.7 Aligning items in CSS grid layout — …/Grid_layout/Box_alignment

Item and track alignment basics are in [07](../advanced-css/07-grid.md). What MDN adds:

- **Two axes, logical:** `align-*` = **block** axis, `justify-*` = **inline** axis (not "vertical/horizontal" — that is
  only true in horizontal writing).
- **Full value lists:** `align-items` / `align-self`: `normal` · `stretch` · `start` · `end` · `center` · `baseline` ·
  `first baseline` · `last baseline` · `auto` (self only). `justify-items` / `justify-self`: the same **plus `left`,
  `right`**. `align-content` / `justify-content` / `place-content`: `normal` · `start` · `end` · `center` · `stretch` ·
  `space-around` · `space-between` · `space-evenly` · `baseline` · `first baseline` · `last baseline` · (`justify-` only)
  `left` · `right`.
- **`normal` resolves to `stretch`** for grid items — **EXCEPT items with an intrinsic aspect ratio (images)**, which
  behave as `start` in both axes so they are not distorted.
- **`align-items: start` changes the item's height**: it is now its content's height, not the area's.
- **Shorthands:** `place-items` = `align-items` + `justify-items`; `place-self`; `place-content`.
- **Centre in an area:** `align-self: center; justify-self: center`.
- **Default track alignment is `start`** (tracks sit top-left in LTR when they are smaller than the container).
- **TRAP — distributed space grows spanning items:** with `align-content: space-between` (or `space-around`,
  `space-evenly`, `stretch`), an item spanning several tracks **also gets the space added between those tracks** — it
  becomes taller / wider. Use `*-self: start/end` on such items or make sure the content copes.
- **Auto margins align inside the area** too: `margin-left: auto` pushes an item to the right of its area (physical — it
  does not flip in RTL; use `margin-inline-start: auto`).
- **Writing modes:** in RTL, `justify-content: start` puts the tracks on the right.

Examples (minimal):
```css
.wrapper { display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; grid-auto-rows: 100px;
  grid-template-areas: "a a a a b b b b" "a a a a b b b b" "c c c c d d d d" "c c c c d d d d"; align-items: start; }
.item1 { grid-area: a; } .item2 { grid-area: b; align-self: start; }
.item3 { grid-area: c; align-self: end; } .item4 { grid-area: d; align-self: center; }
.item2 { justify-self: start; } .item3 { justify-self: end; } .item4 { justify-self: center; }
/* centre in an area */
.wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; grid-auto-rows: 200px; grid-template-areas: ". a a ." ". a a ."; }
.item1 { grid-area: a; align-self: center; justify-self: center; }
/* tracks smaller than the container */
.wrapper { display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px);
  height: 500px; width: 500px; gap: 10px; grid-template-areas: "a a b" "a a b" "c d d"; }
.wrapper { align-content: end; }
.wrapper { align-content: space-between; justify-content: space-around; }   /* spanning a, b, d grow */
.item1 { grid-area: a; margin-left: auto; }                                  /* pushed right inside its area */
```

### 2.7b Box alignment in grid layout — …/Guides/Box_alignment/In_grid_layout

Same subject from the Box Alignment side. Adds:
- **Initial values:** `align-items` / `justify-items` = `stretch` (spec value `normal`), `align-self` / `justify-self` =
  `auto` (= take the container's `*-items`).
- **Content alignment happens only when the tracks total less than the container.**
- **`grid-gap`, `grid-row-gap`, `grid-column-gap` are legacy aliases** of `gap`, `row-gap`, `column-gap` (moved to Box
  Alignment so flex and multicol can use them).
```css
.box { display: grid; grid-template-columns: 120px 120px 120px; align-items: start; justify-content: space-between; }
.box :first-child { align-self: center; }
```

---

### 2.8 Grids, logical values, and writing modes — …/Logical_values_and_writing_modes

**Entirely new to the store.**
- **Physical** properties (`left`, `top`, `margin-left`, `text-align: left`) assume a direction; under `direction: rtl`
  a `text-align: left` paragraph is wrong. **Logical** values (`start`, `end`, block, inline) do not.
- **`writing-mode`** values: `horizontal-tb` (default) · `vertical-rl` · `vertical-lr` · `sideways-rl` · `sideways-lr`.
  In a vertical mode the **inline axis runs down**, the block axis across: on a grid with `writing-mode: vertical-lr`,
  auto-placement fills top-to-bottom and adds tracks left-to-right; `align-self: start` now means LEFT.
- **Line 1 is always the start line and `-1` the end line, in every writing mode.** With `direction: rtl` on the grid,
  line 1 is on the right — the whole placement mirrors. For text this is usually wanted; where it is not (a fixed visual
  composition), MDN suggests **naming the lines**.
- **`grid-area`'s order** = row-start, column-start, row-end, column-end = in LTR **top, left, bottom, right** —
  counter-clockwise, the reverse of `margin`. Logic: "two starts, then two ends".
- **Creative mixed modes:** a sideways nav column inside an LTR grid.
- **Mixing logical grid with physical properties** (auto margins, `top/left` on an absolutely positioned item) — the
  physical parts do NOT flip; use logical equivalents (`margin-inline-start`, `inset-inline-start`).

Examples (minimal):
```css
.wrapper { writing-mode: vertical-lr; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 100px); gap: 10px; }
.item1 { grid-column: 1 / 4; align-self: start; }
.item2 { grid-column: 1 / 3; grid-row: 2 / 4; align-self: start; }
.item3 { grid-column: 3;     grid-row: 2 / 4; align-self: end; justify-self: end; }

.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 100px); gap: 10px; }
.item1 { grid-column: 1; } .item2 { grid-column: -1 / -3; } .item3 { grid-column: 1 / 3; grid-row: 2; }
.wrapper { direction: rtl; }        /* everything mirrors: line 1 is now on the right */

/* a vertical nav column */
.wrapper { display: grid; gap: 20px; grid-template-columns: 1fr auto; }
nav { writing-mode: vertical-lr; }
nav ul { list-style: none; margin: 0; padding: 1em; display: flex; justify-content: space-between; }
```

---

### 2.9 Grid layout and accessibility — …/Grid_layout/Accessibility

**Concepts (the spec's own words, quoted by MDN).**
- Grid can reorder by **line placement, template areas, `order`, and `grid-auto-flow: dense`** — all VISUAL only.
- "The `order` property and grid placement **do not affect ordering in non-visual media** (such as speech). Likewise,
  rearranging grid items visually **does not affect the default traversal order** of sequential navigation modes."
- **Conformance rule:** "Authors must use `order` and the grid-placement properties **only for visual, not logical,
  reordering** of content. Style sheets that use these features to perform logical reordering are **non-conforming**."
- **If the new position is the logical one, change the HTML source** instead.
- **Approach:** (1) start from a well-structured accessible source — it is usually the right order for the smallest
  screen too; (2) add a responsive grid on top (de-prioritised items can move to a desktop sidebar); **test by tabbing**:
  no jumps from top to bottom; (3) whenever grid relocates something, ask whether the source should move.
- **Markup flattening danger:** only direct children are grid items, so authors are tempted to remove semantic wrappers
  (`<ul>` → loose `<li>`s). Fix with **`subgrid`** (pass the grid down) or **`display: contents`** — not by deleting
  structure.

Example (minimal) — visually 4th, but first in Tab order:
```html
<div class="wrapper">
  <div class="box1"><a href="">One</a></div><div class="box2"><a href="">Two</a></div>
  <div class="box3"><a href="">Three</a></div><div class="box4"><a href="">Four</a></div><div class="box5"><a href="">Five</a></div>
</div>
```
```css
.wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 100px; }
.box1 { grid-column: 1; grid-row: 2; }
```
(Builder status of reading order: [04-map A15](../page-grid/04-map.md) and [01 A15](../page-grid/01-builders-and-systems.md).)

---

### 2.10 Realizing common layouts using grids — …/Common_grid_layouts

**Three ways to the same page** — areas, a named 12-column system, pure auto-placement.

**(a) 1 → 2 → 3 columns with areas** (mobile-first, source order kept at the narrowest size):
```html
<div class="wrapper">
  <header class="main-head">The header</header>
  <nav class="main-nav"><ul><li><a href="">Nav 1</a></li><li><a href="">Nav 2</a></li><li><a href="">Nav 3</a></li></ul></nav>
  <article class="content"><h1>Main article area</h1><p>…</p></article>
  <aside class="side">Sidebar</aside>
  <div class="ad">Advertising</div>
  <footer class="main-footer">The footer</footer>
</div>
```
```css
.main-head { grid-area: header; } .content { grid-area: content; } .main-nav { grid-area: nav; }
.side { grid-area: sidebar; } .ad { grid-area: ad; } .main-footer { grid-area: footer; }
.wrapper { display: grid; gap: 20px; grid-template-areas: "header" "nav" "content" "sidebar" "ad" "footer"; }
@media (width >= 500px) {
  .wrapper { grid-template-columns: 1fr 3fr;
    grid-template-areas: "header header" "nav nav" "sidebar content" "ad footer"; }
  nav ul { display: flex; justify-content: space-between; }
}
@media (width >= 700px) {
  .wrapper { grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas: "header header header" "nav content sidebar" "nav content ad" "footer footer footer"; }
  nav ul { flex-direction: column; }
}
```
(No columns declared at mobile size — one implicit column, rows created as needed.)

**(b) The same with a 12-column named grid; spans change per breakpoint, mobile placement inherited:**
```css
.wrapper { display: grid; grid-template-columns: repeat(12, [col-start] 1fr); gap: 20px; }
.wrapper > * { grid-column: col-start / span 12; }
@media (width >= 500px) {
  .side { grid-column: col-start / span 3; grid-row: 3; }
  .ad   { grid-column: col-start / span 3; grid-row: 4; }
  .content, .main-footer { grid-column: col-start 4 / span 9; }
}
@media (width >= 700px) {
  .main-nav { grid-column: col-start / span 2;    grid-row: 2 / 4; }
  .content  { grid-column: col-start 3 / span 8;  grid-row: 2 / 4; }
  .side     { grid-column: col-start 11 / span 2; grid-row: 2; }
  .ad       { grid-column: col-start 11 / span 2; grid-row: 3; }
  .main-footer { grid-column: col-start / span 12; }
}
/* demo of the system */
.item1 { grid-column: col-start / span 3; }
.item2 { grid-column: col-start 6 / span 4; grid-row: 1 / 3; }
.item3 { grid-column: col-start 2 / span 2; grid-row: 2; }
.item4 { grid-column: col-start 3 / -1; grid-row: 3; }
```
Points: no row wrappers needed (frameworks added them to stop items rising into the row above in old browsers — "now
moot"); white space is free; no "offset" classes — just a start line.

**(c) Product cards by auto-placement, no media query; flex inside each card; `dense` for wide cards:**
```html
<ul class="listing">
  <li><h2>Item One</h2><div class="body"><p>…</p></div><div class="cta"><a href="">Call to action!</a></div></li>
  <li class="wide"><h2>Item Three</h2><div class="body"><p>…</p><p>…</p><p>…</p></div><div class="cta"><a href="">Call to action!</a></div></li>
</ul>
```
```css
.listing { list-style: none; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); grid-auto-flow: dense; }
.listing li { display: flex; flex-direction: column; }
.listing .cta { margin-block-start: auto; }      /* the call to action sits at the bottom of every card */
.listing .wide { grid-column-end: span 2; }
```
Traps stated: a span-2 card leaves gaps at widths where two tracks are not free; `dense` fills them "only if your items do
not have a set order". Auto-placement + structural pseudo-classes (`:nth-child`) suits CMS output you cannot mark up.

---

### 2.11 Subgrid — …/Grid_layout/Subgrid

The two main uses (page-aligned nesting, aligned card parts) and the "no implicit tracks" caveat are already in
[01 A11](../page-grid/01-builders-and-systems.md) and [08 / AC-36](../advanced-css/08-nexter.md). The exact rules MDN gives:

- `grid-template-columns: subgrid` and/or `grid-template-rows: subgrid` on an item that is itself `display: grid`: the
  nested grid uses the **parent's tracks for the span it covers** (spans 5 columns → 5 subgrid columns).
- **Line numbers restart at 1 inside the subgrid** — so a component's internal placement is the same wherever it sits on
  the page.
- **Line NAMES pass down** from the parent (`col-start` still works inside), and the subgrid can **add its own**:
  `grid-template-columns: subgrid [sub-a] [sub-b] [sub-c] [sub-d] [sub-e] [sub-f]` (one bracket per line; they are added
  to the parent's).
- **Gaps are inherited**, and overridable on the subgrid (`row-gap: 0`). The subgrid's lines sit at the **centre** of
  the parent's gap; a smaller gap "gives the space back to the item", like a negative margin.
- **No implicit grid in a subgridded axis.** Items beyond the cells **pile into the last track** (spec behaviour). Remove
  `subgrid` on that axis and use `grid-auto-rows` to get implicit rows (which then no longer align to the parent).
- **Content still sizes tracks:** a subgrid item's content contributes to the PARENT's track sizes (auto rows grow for
  content in the main grid AND in the subgrid). That is what makes card titles line up.
- **Switching back is easy:** a subgrid behaves like a nested grid except for where its track sizes come from.
- **Support** (browser-compat-data): Chrome / Edge 117, Firefox 71, Safari 16 — Baseline since September 2023.

Examples (minimal):
```html
<div class="grid"><div class="item"><div class="subitem"></div></div></div>
```
```css
.grid { display: grid; grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(4, minmax(100px, auto)); }
/* columns from the parent, own rows */
.item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4; grid-template-columns: subgrid; grid-template-rows: repeat(3, 80px); }
.subitem { grid-column: 3 / 6; grid-row: 1 / 3; }     /* lines counted inside the subgrid */
/* rows from the parent, own columns */
.item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4; grid-template-columns: repeat(3, 1fr); grid-template-rows: subgrid; }
/* both */
.item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4; grid-template-columns: subgrid; grid-template-rows: subgrid; }
/* auto-placing an unknown number of children: subgrid the columns only */
.item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4; grid-template-columns: subgrid; grid-auto-rows: minmax(100px, auto); }
/* gap override */
.grid { gap: 20px; } .item { grid-template-columns: subgrid; grid-template-rows: subgrid; row-gap: 0; }
/* parent's named lines, and the subgrid's own */
.grid { display: grid; grid-template-columns: 1fr 1fr 1fr [col-start] 1fr 1fr 1fr [col-end] 1fr 1fr 1fr; gap: 20px; }
.item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4; grid-template-columns: subgrid [sub-a] [sub-b] [sub-c] [sub-d] [sub-e] [sub-f]; grid-template-rows: subgrid; }
.subitem  { grid-column: col-start / col-end; grid-row: 1 / 3; }
.subitem2 { grid-column: sub-b / sub-d;       grid-row: 1; }
```
The card pattern (not an example on this page, but its videos' subject; stored in 01/04):
`.card { grid-row: span 3; display: grid; grid-template-rows: subgrid; }` in a parent with `grid-auto-rows: auto`.

---

### 2.12 Grid lanes layout (masonry) — …/Grid_layout/Grid_lanes

**NEW. Experimental.** CSS Grid Level 3 defines **`display: grid-lanes`** and **`display: inline-grid-lanes`** (this
replaces the earlier draft syntax `grid-template-rows: masonry`, which no longer appears in MDN or its compat data).
- One axis is a **strict grid** (the tracks you declare), the other a **stacking axis**: each item goes into **the lane
  with the most room** (the shortest column) — "tightly packed, without strict tracks on the stacking axis".
- **Columns as lanes**: declare `grid-template-columns`; items stack down. **Rows as lanes**: declare
  `grid-template-rows`; items flow along the rows.
- On the grid axis everything is normal grid: `span` while auto-placed, and line-based positioning. **Items with a
  definite placement are placed BEFORE the lanes algorithm runs.**
- **Support** (browser-compat-data, 2026-10-04): **Safari 26.4 only**; Chrome, Edge and Firefox: not shipped. So a
  published page must not depend on it — progressive enhancement with `@supports (display: grid-lanes)` over a plain
  grid or the builder's existing masonry (`aa6d32f`).
- **Reading order:** "most room" placement means visual order follows item HEIGHTS, not source order — the same visual
  vs logical caution as `dense` (§2.9).

Examples (minimal):
```css
.grid { display: grid-lanes; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }  /* columns as lanes */
.grid { display: grid-lanes; gap: 10px; grid-template-rows: repeat(3, 100px); }                          /* rows as lanes */
.span-2 { grid-column-end: span 2; }                         /* spans two lanes, others pack round it */
.positioned { grid-column: 2 / 4; }                           /* placed first, then the lanes fill */
/* safe use today */
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr)); gap: 0.75rem; }
@supports (display: grid-lanes) { .gallery { display: grid-lanes; } }
```

---

### 2.13 The value pages the guides lean on (on-topic follow-ups)

**`fr` (`<flex>`):** a number + `fr` (`1fr`, `2.5fr`), a fraction of the **leftover** space; no space between number and
unit. **Learn module:** "`fr` distributes *available* space, not *all* space — a track with something large inside leaves
less to share"; **gaps cannot be `fr`**.

**`repeat()` — rules not in any guide:**
- `auto-fill`: the largest number of repetitions that does not overflow a container with a definite or **max** size;
  if it only has a **min** size, the fewest that meet it; with neither, **1**. A container with no constraint gets one
  repetition.
- `auto-fit` = `auto-fill`, then **empty repeated tracks collapse to 0 and the gutters on either side collapse** (all
  tracks can collapse). "Empty" = no in-flow item placed in or spanning it.
- **Only one auto-repeat per track list**, and it may be combined only with *fixed* sizes elsewhere:
  `repeat(auto-fill, 10px) repeat(2, minmax(min-content, max-content))` is **invalid**.
- **An auto-repeat track must have a fixed size somewhere**: `repeat(auto-fit, 1fr)` and `repeat(auto-fill, auto)` are
  **invalid**; `repeat(auto-fit, minmax(200px, 1fr))` is valid (fixed min). `minmax(min(100%, 15rem), 1fr)` is a fixed
  length too, hence valid.
- `repeat()` cannot be nested. Line names inside repeat produce repeated names (§2.5).
- `repeat(auto-fill, [name])` (names only) is the subgrid form.
- (New in 2026: `repeat()` also builds gap-decoration lists — `rule-color: repeat(2, green, orange)` — the CSS Gaps module.)

**`minmax(min, max)`:** `fr` is valid only as the **max**; **if max < min, max is ignored** (the track is `min`);
percentages resolve against the container and behave as `auto` if the container's size depends on its tracks; `auto` as
min = the largest `min-width`/`min-height` of the items (this is why `1fr` = `minmax(auto, 1fr)` cannot shrink below
content); `auto` as max = `max-content` but can stretch with `align/justify-content: normal|stretch`.
`minmax(0, 1fr)` is MDN's own example of equal columns that do not grow with content.

**`fit-content(limit)`:** = `minmax(auto, max-content)` clamped at `limit` — a track as wide as its content, never wider
than the limit (the media-object image column). Only the function form is valid in track lists, not the keyword.

**Glossary** (10 entries) — matches 07's vocabulary. Extra: the grid axis entry names the **inline axis** also "row axis /
main axis" and the **block axis** "column axis / cross axis"; "lines are also created in the implicit grid, however these
lines cannot be addressed by a number" — see Trap T3 for what that really means.

---

## 3. Everything a person could want to do with grid → the exact CSS

All assume `.g { display: grid; }`. Units are shown in `rem` where the builder would store them (rule 16).

| # | Goal | CSS |
|---|------|-----|
| 1 | N equal columns that stay equal whatever the content | `grid-template-columns: repeat(N, minmax(0, 1fr));` |
| 2 | Unequal shares (sidebar 1, main 3) | `grid-template-columns: 1fr 3fr;` (or `minmax(0,1fr) minmax(0,3fr)`) |
| 3 | A fixed sidebar + fluid main | `grid-template-columns: 16rem minmax(0, 1fr);` |
| 4 | A sidebar between two sizes | `grid-template-columns: minmax(12rem, 20rem) minmax(0, 1fr);` |
| 5 | A column as wide as its content, up to a limit (image, label) | `grid-template-columns: fit-content(12rem) 1fr;` / `auto 1fr` / `max-content 1fr` |
| 6 | Place an item at column 3, row 2 | `.i { grid-column: 3; grid-row: 2; }` (or `grid-area: 2 / 3;`) |
| 7 | Span 2 columns from wherever it lands | `.i { grid-column: span 2; }` |
| 8 | Span from column 2 to the end, whatever the count | `.i { grid-column: 2 / -1; }` |
| 9 | Full width | `.i { grid-column: 1 / -1; }` |
| 10 | Span upward from a line | `.i { grid-row: span 3 / 4; }` |
| 11 | All four lines at once | `.i { grid-area: 1 / 2 / 3 / 4; }` (row-start / col-start / row-end / col-end) |
| 12 | Overlap two items (caption over picture) | `.pic, .cap { grid-area: 1 / 1; } .cap { align-self: end; z-index: 1; }` |
| 13 | Partial overlap (collage) | `.a { grid-area: 1 / 1 / 3 / 3; } .b { grid-area: 2 / 2 / 4 / 4; z-index: 1; }` on a fine grid |
| 14 | Leave a cell empty (and keep it empty) | place the neighbours explicitly, or `grid-template-areas: "a . b";` with ALL items placed by name |
| 15 | Name areas and draw the page | `grid-template-areas: "hd hd" "sd main" "ft ft";` + `.x { grid-area: hd; }` |
| 16 | Move areas per breakpoint without touching HTML | redefine only `grid-template-areas` / `grid-template-columns` inside `@media` / `@container`; names declared outside |
| 17 | Mirror a component (image left ↔ right) | swap the area string and the track list: `"content img"` + `3fr 1fr` |
| 18 | As many cards as fit, each at least X | `grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));` |
| 19 | As many as fit, but keep empty tracks (cards don't stretch when few) | `repeat(auto-fill, minmax(min(100%, 15rem), 1fr))` |
| 20 | A 12-column page system | `grid-template-columns: repeat(12, [col-start] minmax(0, 1fr)); gap: …;` + `.x { grid-column: col-start 4 / span 6; }` |
| 21 | Centred content with full-bleed bands (named lines) | `grid-template-columns: [full-start] minmax(1rem, 1fr) [content-start] min(100% - 2rem, 70rem) [content-end] minmax(1rem, 1fr) [full-end];` `.g > * { grid-column: content; } .bleed { grid-column: full; }` (detail and half-bleed: [08](../advanced-css/08-nexter.md)) |
| 22 | An area from named lines without a template | lines `[x-start]` / `[x-end]` on both axes → `.i { grid-area: x; }` |
| 23 | Overlay spanning several named areas | `.overlay { grid-column: main-start / main-end; grid-row: hd-start / ft-end; z-index: 1; }` |
| 24 | Rows at least X, growing with content | `grid-auto-rows: minmax(6rem, auto);` |
| 25 | Alternating row heights | `grid-auto-rows: 6rem 12rem;` |
| 26 | Fill down then across (A–Z list in columns) | `grid-template-rows: repeat(5, auto); grid-auto-flow: column;` |
| 27 | Back-fill holes in a gallery of mixed spans | `grid-auto-flow: dense;` (order-free content only) |
| 28 | Labels left, values right, any number of each | `grid-template-columns: auto 1fr; dt { grid-column: 1 } dd { grid-column: 2 }` |
| 29 | Align every item to the top / centre of its cell | `align-items: start;` / `place-items: center;` |
| 30 | One item bottom-right of its area | `.i { place-self: end; }` (`align-self: end; justify-self: end`) |
| 31 | An image that fills its cell (not `start`-aligned by its ratio) | `.cell img { width: 100%; height: 100%; object-fit: cover; }` or `align-self: stretch; justify-self: stretch;` |
| 32 | Centre the whole grid of fixed tracks in a wide container | `justify-content: center; align-content: center;` (`place-content: center`) |
| 33 | Different gaps across and down | `gap: 2rem 1rem;` (row-gap FIRST) |
| 34 | Nested grid on the parent's columns | `.child { grid-column: 2 / 8; display: grid; grid-template-columns: subgrid; }` |
| 35 | Cards whose titles / texts / buttons line up across a row | parent `grid-template-columns: repeat(3, minmax(0,1fr)); grid-auto-rows: auto;` + `.card { grid-row: span 3; display: grid; grid-template-rows: subgrid; }` |
| 36 | A subgrid with its own tighter gap | `.child { grid-template-columns: subgrid; column-gap: 0; }` |
| 37 | Let a wrapper's children join the grid | `.wrapper-item { display: contents; }` (role-less wrappers only) or subgrid |
| 38 | Absolutely position something inside a grid area | `.area { position: relative; } .badge { position: absolute; inset-block-start: 1rem; inset-inline-start: 1rem; }` |
| 39 | Masonry (where supported) | `display: grid-lanes; grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));` inside `@supports` |
| 40 | RTL mirroring | nothing: `dir="rtl"` / `direction: rtl` mirrors line numbers and `start`/`end`; use logical margins/insets; name lines where a composition must NOT mirror |
| 41 | A vertical (sideways) column of links | `nav { writing-mode: vertical-lr; }` in an `auto` track |
| 42 | Push a card's button to its bottom | card `display: flex; flex-direction: column;` + `.cta { margin-block-start: auto; }` |
| 43 | Card wider for long content, holes filled | `.wide { grid-column-end: span 2; }` + `grid-auto-flow: dense` |
| 44 | A grid that adapts to ITS OWN box, not the window | redefine tracks in `@container (width >= 40rem) { … }` with `container-type: inline-size` on a wrapper |
| 45 | Inline-level grid (a grid that sits in a line of text) | `display: inline-grid;` |

---

## 4. Traps for a builder (what goes wrong when a TOOL writes grid CSS)

**T1 — `1fr` blowout.** `1fr` is `minmax(auto, 1fr)`: a track never shrinks below its content's min-content (a long
word, a wide image, a `<pre>`, a table, a nested grid with fixed tracks). Equal columns then come out unequal or overflow.
Always emit **`minmax(0, 1fr)`** (the builder already does — [07](../advanced-css/07-grid.md)) **and** give content a way
to fit (`overflow-wrap: break-word`, `min-width: 0` on nested flex/grid children, `max-width: 100%` on media). The same
applies to `fr` in subgrid parents and to `grid-auto-columns`.

**T2 — Implicit tracks appear silently.** Placing an item past the explicit grid (`grid-column: 5` in a 4-column grid,
`span 3` from line 3 of 4, a named line that does not exist) ADDS tracks, `auto`-sized by default (`grid-auto-columns`).
A tool must **clamp `start + span − 1` to the column count** and never emit a start beyond it. Rows are different:
implicit rows are the normal way a grid grows — set `grid-auto-rows` deliberately.

**T3 — Line numbers count from the EXPLICIT grid.** `-1` is the last line of `grid-template-*`, NOT the last implicit
line. In a grid with no `grid-template-rows`, `grid-row: 1 / -1` spans **one row only** (the explicit row grid is
empty, so line 1 = line −1 and the spec falls back to a span of 1). Full-height spans need explicit rows or `span N`. The glossary's "implicit lines cannot be
addressed by a number" means negative numbers cannot reach them; a positive number beyond the explicit grid CREATES them
(T2).

**T4 — `grid-area` value order.** `grid-area: a / b / c / d` = **row-start / column-start / row-end / column-end** —
counter-clockwise, not margin order. Omitted values copy from the start if it is a name, else `auto`. And **`grid-area:
foo`** (one ident) means a NAMED area — if no such area or `foo-start`/`foo-end` lines exist, the item lands in implicit
tracks. A generator must emit numbers or names it has verified exist.

**T5 — Named-line collisions and the `name N` index.** `repeat(4, [col-start] 1fr [col-end])` merges `col-end` and
`col-start` on shared lines; `col-start 3` is the third line WITH that name, not line 3. Areas create `X-start`/`X-end`
lines automatically, so an area called `main` collides with hand-written `[main-start]` lines. Never name anything `span`
or `auto`. Prefer one naming scheme per grid, generated, never mixed with hand-written names.

**T6 — Gap shorthand order.** `gap: A B` = **row-gap A, column-gap B**. Swapping them is invisible on square content and
wrong everywhere else. Gaps also cannot be `fr` and are not at the outer edges (outer space must come from padding).

**T7 — Template-areas validity is all-or-nothing.** Unequal cell counts per row, an L/T-shaped area, or the same name in
two separate places → **the whole `grid-template-areas` declaration is dropped**, silently. A tool generating areas must
validate rectangles and row lengths before emitting, and must keep area names declared outside media / container queries.

**T8 — Shorthands reset.** `grid` resets `grid-auto-flow`, `grid-auto-rows/-columns` (and `grid-template` resets areas);
emitting `grid:` in a breakpoint can silently undo a `dense` or an auto-row height set in the base rule. Emit longhands.

**T9 — `auto-fill`/`auto-fit` validity.** Only one auto-repeat per list; it needs a fixed size (`repeat(auto-fit, 1fr)`
is invalid → the whole declaration is dropped); it cannot sit beside intrinsic/flexible `repeat(N, …)` tracks. `minmax(Xpx,
1fr)` overflows a container narrower than X → use `minmax(min(100%, X), 1fr)`. `auto-fit` stretches 1–2 items across the
row (collapsed tracks); `auto-fill` keeps them card-sized — choose deliberately. In an auto-fit grid, `span 2` on a
1-column width creates an implicit column (T2): clamp spans per container width (container queries) or drop spans to 1.

**T10 — Auto-placement order surprises.** Placed items are placed first; auto items then fill from the top, so a later
item can appear BEFORE an earlier placed one. Items with only a column set (or only a row) are placed in a separate pass.
`order` changes auto-placement order. Loose text in a grid container becomes an anonymous item. Spans leave holes (sparse
packing) — a tool that lets a person resize one card to span 2 will create holes unless it also offers `dense` or
re-flows.

**T11 — Visual order ≠ reading order.** Line placement, areas, `order`, `dense` and grid lanes all move pixels only;
screen readers and Tab follow the DOM. The spec makes logical reordering by grid **non-conforming**. A builder must
(1) keep DOM order = the person's intended reading order, (2) when a person drags a block to a new visual position that
IS the logical one, **move it in the tree**, not by placement, (3) allow `dense` / grid lanes only for order-free content
(pictures, tiles) and say so, (4) audit: flag a block whose visual position is far from its source position (tab-jump).
On phones, the one-column stack in source order is the accessible default.

**T12 — Subgrid specifics.** No implicit tracks in a subgridded axis — extra children **pile into the last track**
(looks broken, no error). Lines renumber from 1 inside the subgrid; names pass through. The subgrid must SPAN the parent
tracks it wants. Gap inheritance can surprise (set the subgrid's gap explicitly). Support is Baseline 2023 (Chrome 117,
Firefox 71, Safari 16) — fine for publishing, with a `@supports not (grid-template-columns: subgrid)` fallback for very
old devices common on low-cost Androids running outdated WebViews (RULE AF).

**T13 — Grid lanes is not shippable alone.** `display: grid-lanes` works only in Safari 26.4 today; an unsupported
`display` value is dropped, leaving the element `display: block` (everything stacks). Always write a working `display:
grid` first and upgrade inside `@supports (display: grid-lanes)`.

**T14 — Alignment surprises.** Images (intrinsic ratio) default to `start`, not `stretch` — a picture in a cell does not
fill it unless told to. `align-items: start` makes items content-height (equal-height cards are lost). `align-content` /
`justify-content` distribution values also enlarge items that SPAN tracks. `left`/`right` and physical auto margins do not
flip in RTL.

**T15 — Absolute children and `display: contents`.** An absolutely positioned grid child takes no space, so auto-placed
items flow under it and the implicit rows it "spans" are not created. `display: contents` drops the element's box
(background, padding, placement) and has a history of dropping semantics — never on a landmark, list, button or heading.

**T16 — Writing modes.** Line 1 is the START edge: with `dir="rtl"` every generated placement mirrors (good for text,
maybe not for a fixed composition — use names or keep a composition in its own LTR container). In `vertical-*` modes,
`align` and `justify` swap their physical meaning. Generate logical properties (`inline`, `block`, `start`, `end`)
everywhere, never `left/right/top/bottom`, so a second-language page (RULE AF: Arabic) works unchanged.

**T17 — Percentages and `fr` in rows.** `fr` rows and percentage rows need a definite container height; otherwise
`%` rows behave as `auto` and `fr` rows share no free space. A builder should size rows with `auto` / `minmax(<rem>, auto)`
unless the band has a height.

**T18 — Legacy names.** Emit `gap`/`row-gap`/`column-gap`, not `grid-gap`; and `place-*` shorthands only where both axes
are meant to be the same.

---

## 5. The five things a builder must get right (summary)

1. **Columns that cannot blow out**: `minmax(0, 1fr)` tracks + content that can wrap/shrink; `min(100%, X)` inside every
   auto-fit minimum.
2. **Never create implicit columns by accident**: clamp every start and span to the explicit column count, at every
   breakpoint and container width; size implicit rows on purpose (`grid-auto-rows`).
3. **Reading order = DOM order**: visual placement, areas, `order`, `dense` and grid lanes never carry meaning; a move a
   person means logically is a move in the tree; audit tab jumps.
4. **Generate only VALID, longhand, logical CSS**: rectangular complete area templates, valid `repeat()` forms, `grid-area`
   in row/col/row/col order, `gap` row-first, no shorthands that reset, logical properties so RTL mirrors for free — a
   single invalid token drops the whole declaration silently.
5. **Nest on purpose**: subgrid where a nested block must sit on the parent's lines (with its no-implicit-tracks rule and
   a fallback), an independent grid everywhere else; grid lanes only as an `@supports` enhancement.
