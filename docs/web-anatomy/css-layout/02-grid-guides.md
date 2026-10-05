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
| 19 | /en-US/docs/Learn_web_development/Core/CSS_layout/Grids (the Learn module, linked from the guides) | yes (follow-up 2026-10-04) | raw source `learn_web_development/core/css_layout/grids/index.md` read in full, every live example transcribed in §6.1. New: "`fr` shares AVAILABLE space"; "gaps cannot be `fr`"; the five rules of `grid-template-areas`; goals 46–48 in §3. |
| 19b | /en-US/docs/Learn_web_development/Core/CSS_layout/Test_your_skills/Grid | yes | raw source `test_your_skills/grid/index.md`: 4 tasks, every published solution recorded in §6.1. Goals 49, 50. |
| 20 | /en-US/docs/Web/CSS/How_to/Layout_cookbook/Media_objects (linked from Grid template areas) | yes | `fit-content(200px)` image track |
| 21 | browser-compat-data: `display.grid-lanes`, `display.contents`, `grid-template-columns.subgrid`, `grid-template-rows` | yes | support numbers below |
| — | Not followed (off-topic or covered elsewhere): property reference pages (`grid-template-columns`, `grid-column-start`, `align-items` … — another researcher), Flexbox / Multicol / Writing-modes / Logical-properties / Media-queries guides, Box alignment overview, the Containing-block guide, the CSSWG spec itself (quoted only where MDN quotes it; §6.2 adds the two sections MDN links). The external links the guides cite WERE followed — see §6.2. | — | Listed so nothing is silently skipped. |
| 22 | External links of the grid guides + CSS-Tricks complete guide + Grid Garden (28 levels) | see §6.2 | follow-up 2026-10-04: 22 links listed; 12 read fully, 3 partly, 6 not readable (videos / interactive embed), 1 not followed. Per-link table in §6.2. |

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
| 46 | A page frame on a 12-column grid by line numbers (header full, sidebar 3 columns, main 9) | `repeat(12, 1fr); gap: …;` + `header { grid-column: 1 / 13; grid-row: 1 } main { grid-column: 4 / 13; grid-row: 2 } aside { grid-column: 1 / 4; grid-row: 2 } footer { grid-column: 1 / 13; grid-row: 3 }` (Learn "Grid frameworks") |
| 47 | A nested grid that keeps the parent's gap, with rows in a ratio (one big article, two small) | `main { grid-area: content; display: grid; grid-template-rows: 4fr 3fr 3fr; gap: inherit; }` (Learn "Nesting grids") |
| 48 | A nested block that takes the parent's COLUMNS but has its OWN row ratio | `.sub { grid-column: 1 / 4; grid-row: 2 / 4; display: grid; gap: inherit; grid-template-columns: subgrid; grid-template-rows: 2fr 1fr; }` (Learn "subgrid"; the parent has 4 columns) |
| 49 | Make the FIRST item sit on top of an overlapping later one without moving it in the source | `.first { z-index: 1; }` or `.first { order: 1; }` — Learn's skills-test solution offers both (`order` also changes auto-placement order: T10) |
| 50 | A photo card: picture fills the top, chips wrap and centre underneath | `.card { display: grid; grid-template-rows: 200px min-content; } .card > img { width: 100%; height: 100%; object-fit: cover; } .tags { display: flex; flex-wrap: wrap; justify-content: center; }` (Learn skills test 4: the card is a grid because it aligns in two directions, the chip list is flex because it only runs in a row) |
| 51 | Everything BUT the last column / start counting from the right | `.i { grid-column: 1 / -2; }` (end line −2 = one line before the last) · `.i { grid-column-start: -3; }` (Grid Garden levels 5, 6; `-1` = last line of the EXPLICIT grid, T3) |
| 52 | Rows and columns in ONE declaration (rows first, then `/`, then columns) | `.g { grid-template: 60% 1fr / 200px 1fr; }` · `grid-template: 1fr 50px / 20% 1fr;` (Grid Garden levels 27, 28; a `%` row needs a definite height, T17) |
| 53 | Move an item earlier / later in auto-placement order | `.i { order: -1; }` (earlier than the 0 default) · `.i { order: 2; }` (later) — visual only, T11 (Grid Garden levels 18, 19) |
| 54 | Fixed edge strips with a flexible middle, or mixed units | `grid-template-columns: 50px 1fr 1fr 1fr 50px;` · `75px 3fr 2fr` · `100px 3em 40%` (Grid Garden levels 22–25; fixed tracks are served first, `fr` shares what is LEFT) |
| 55 | Equal-height three columns, main content FIRST in the source, nav shown on the left | `.c { display: grid; grid-template-columns: 8em auto 8em; grid-template-rows: 3em auto auto auto 3em; } header { grid-column: 1 / 4 } nav { grid-row: 2 / 5; grid-column: 1 } article { grid-row: 2 / 5; grid-column: 2 } aside { grid-row: 2 / 5; grid-column: 3 } footer { grid-column: 1 / 4; grid-row: 5 }` (Codrops "Holy Grail"; the spec's own version: `grid: "h h h" "a b c" "f f f"; grid-template-columns: auto 1fr 20%;` + `min-width: 12em` on main and aside) |
| 56 | Navigation BETWEEN header and content, while the source has main first | `body { display: grid; grid: "header header" "nav nav" "content sidebar" "footer footer"; grid-template-columns: 1fr 25%; }` — every name must be given to an item with `grid-area` (T22) |
| 57 | Collapse the whole page frame to one column on a phone, main before nav | desktop `grid-template-areas: "header header header" "nav article ads" "footer footer footer"; grid-template-columns: 20% 1fr 15%;` → `@media (max-width: 575px) { grid-template-areas: "header" "article" "ads" "nav" "footer"; grid-template-columns: 1fr; }` (Quackit layouts 1–10; the phone order puts `article` before `nav`, which matches reading order only if the source has `article` first) |
| 58 | A tall hero row, then equal rows (a mosaic with a few spans) | `grid-template-rows: 50vh repeat(4, 1fr); grid-template-columns: repeat(4, 1fr); gap: …;` + `grid-column: span 4` on the hero, `grid-row: span 4 / 2 / 3` on tall tiles (Quackit layouts 11–12, written with `nth-child`; a builder stores the span on the block instead; `vh`/`px` become `%`/`rem` per rule 16) |
| 59 | Several items stacked in ONE multi-cell area, each at a different corner of it | `.a, .b, .c { grid-row: 1 / span 2; grid-column: 1 / span 2; max-width: 150px; }` + `.a { align-self: start } .b { justify-self: center; align-self: center } .c { justify-self: end; align-self: end }` (Codrops: with a self-alignment the item shrinks to its content instead of stretching; later items paint on top without `z-index`) |
| 60 | A deliberately "uneven" grid (items sitting at different heights in their cells) | equal columns, auto rows, then a different `align-self` (`start`/`center`/`end`) on chosen items (Codrops, "Cicada principle": a prime-number `nth-child` pattern looks random) — a taste option, stored per block |
| 61 | A short sidebar beside a long main with free space under the sidebar | `main { grid-row: 2 / 5; }` while the sidebar takes only row 2 (Grid by Example pattern: "By stretching the main content area over multiple rows we can have space available in the sidebar") |
| 62 | Percentage tracks AND percentage gaps | `.g { width: 90%; grid-template-columns: repeat(6, 10%); gap: 2%; }` — six 10% tracks + five 2% gutters = 100%; the ROW gap is `0` unless the grid has a height (GBE example 36, T19) |
| 63 | A subgrid with its own padding or margin that still lines up with the parent | `.sub { grid-template-columns: subgrid; padding: …; }` — the padding/margin eats into the FIRST and LAST spanned tracks, which become narrower; everything still lines up with the parent's tracks (GBE subgrid examples 8, 9) |
| 64 | Spread fixed-size tracks across the container | `justify-content: space-between` / `space-around` / `space-evenly` (and `align-content`) — the extra space is added on top of the gap, and spanning items grow with it (T14) |
| 65 | Animate a gap or the track sizes | `.g { transition: gap .3s; }` — `gap`/`row-gap`/`column-gap` animate in every browser CSS-Tricks tested; `grid-template-columns`/`-rows` only in Firefox 66+ there (and only between lists of the same length, see 03) |
| 66 | Align to the end without pushing content off an edge you cannot scroll to | `align-items: safe end;` (`safe` = "try to align like this, but not if it means aligning an item such that it moves into inaccessible overflow area"; `unsafe` allows it) |

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

---

## 6. Completeness follow-up (2026-10-04)

Two lines were open: (a) the Learn "CSS grid layout" module's examples were skimmed, (b) the external links the guides
cite were listed, not read. Both are closed here. Method: MDN pages as **raw Markdown** from `mdn/content`
(`files/en-us/learn_web_development/core/css_layout/grids/index.md`, `…/test_your_skills/grid/index.md`, and every file
under `files/en-us/web/css/guides/grid_layout/` plus `…/guides/box_alignment/in_grid_layout/`); external pages by
`curl` where it reaches the host, otherwise the Wayback Machine or a fetch-and-extract tool (said per link). New goals
are rows **46–66** of the §3 table above; new traps are **T19–T28** below.

### 6.1 The Learn examples (module page + "Test your skills")

The module page has 14 live samples (the `hidden` blocks are only the demo styling). Seven items, one `div` each, in
`.container`; `.container > div` is a bordered box. **"In 02 §3?"** names the row that already holds the CSS.

| # | Goal (the page's words, shortened) | Exact CSS | In 02 §3? |
|---|---|---|---|
| L1 | `display: grid` alone: "a one column grid, so your items will continue to display one below the other" | `.container { display: grid; }` | yes (basic concept, 2.1) |
| L2 | Three fixed columns: "any length unit or percentage" | `.container { display: grid; grid-template-columns: 200px 200px 200px; }` | yes (#3) |
| L3 | Three flexible, equal columns | `grid-template-columns: 1fr 1fr 1fr;` | yes (#1) |
| L4 | Proportional columns: first gets 2 shares. "You can mix `fr` units with fixed-length units … the space needed for the fixed tracks is used up first". NOTE: "The `fr` unit distributes _available_ space, not _all_ space … if one of your tracks has something large inside it, there will be less free space to share." | `grid-template-columns: 2fr 1fr 1fr;` | yes (#2, T1) |
| L5 | Gaps: `column-gap`, `row-gap`, `gap`. "These gaps can be any length unit or percentage, but not an `fr` unit." | `grid-template-columns: 2fr 1fr 1fr; gap: 20px;` | yes (#33, T6) |
| L6 | Repeat a track list: "The first value … specifies the number of times … the second value is a track listing, which may be one or more tracks" | `grid-template-columns: repeat(3, 1fr); gap: 20px;` | yes (#1) |
| L7 | Implicit rows get a size. "**Explicit grid** is created using `grid-template-columns` or `grid-template-rows`. **Implicit grid** extends the defined explicit grid when content is placed outside of that grid … By default, tracks created in the implicit grid are `auto`-sized" | `grid-template-columns: repeat(3, 1fr); grid-auto-rows: 100px; gap: 20px;` | yes (#24/#25 family, T2) |
| L8 | Rows at least 50px, growing with content ("you never really know how tall something is going to be"). "the expansion happens right along the row" | `grid-auto-rows: minmax(50px, auto);` | yes (#24) |
| L9 | As many columns as fit: "`auto-fit` … `minmax()` with a minimum … and a maximum of `1fr`" | `grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));` | yes (#18, which adds `min(100%, …)`; Learn's form overflows below 230px, T9) |
| L10 | Place by lines. Start: auto-placement puts header, main, aside, footer in four cells of `1fr 3fr`, "the header is taking up `1fr` (one quarter)". Then: header and footer `1 / 3` | `.container { display: grid; grid-template-columns: 1fr 3fr; gap: 20px; } header { grid-column: 1 / 3; grid-row: 1; } main { grid-column: 2; grid-row: 2; } aside { grid-column: 1; grid-row: 2; } footer { grid-column: 1 / 3; grid-row: 3; }`. NOTE: "You can also use the value `-1` to target the end column or row line … lines count always from the edges of the explicit grid, not the implicit grid." | yes (#2, #6, #9, T3) |
| L11 | Same layout by name | `grid-template-areas: "header header" "sidebar content" "footer footer"; grid-template-columns: 1fr 3fr; gap: 20px;` + `header { grid-area: header } main { grid-area: content } aside { grid-area: sidebar } footer { grid-area: footer }`. Five rules: "every cell … filled · to span two cells, repeat the name · empty cell = `.` · areas must be rectangular (no L) · areas can't be repeated in different locations". | yes (#15, T7) |
| L12 | Nested grid inside the content area: one large article on top, two small. "While we're using only one column in the nested grid, we can define the rows to be split in a 4:3:3 ratio" | `main { grid-area: content; display: grid; grid-template-rows: 4fr 3fr 3fr; gap: inherit; } article { padding: 10px; border: 2px solid rebeccapurple; border-radius: 5px; }` | **NEW → #47** (`gap: inherit` was not stored) |
| L13 | Subgrid that spans several parent columns/rows, with its own rows: "We've added `subgrid` to inherit the parent grid's column tracks while adding a different layout for the rows" | `.container { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(1, 1fr); gap: 10px; } .subgrid { grid-column: 1 / 4; grid-row: 2 / 4; display: grid; gap: inherit; grid-template-columns: subgrid; grid-template-rows: 2fr 1fr; }` | **NEW → #48** (#34 / 2.11 cover subgrid columns, not the mixed form) |
| L14 | "Grid frameworks": the frame placed on a 12-column grid | `.container { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; } header { grid-column: 1 / 13; grid-row: 1; } main { grid-column: 4 / 13; grid-row: 2; } aside { grid-column: 1 / 4; grid-row: 2; } footer { grid-column: 1 / 13; grid-row: 3; }` | **NEW → #46** (#20 has the system, not the whole frame) |

The page also embeds a YouTube video (`KOvGeFUHAC0`) and a Scrimba interactive lesson "Your first grid"; neither is text
(see 6.2). Its "See also" lists CSS-Tricks and Grid Garden (both read, 6.2).

**"Test your skills: CSS grids" — four tasks, all solutions published:**

| Task | Goal | Published solution | In 02 §3? |
|---|---|---|---|
| 1 | Four children auto-placed in three equal columns with a `20px` gap between column and row tracks; then add more children and watch the default | `.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }` | yes (#1, #33) |
| 2 | Two items, each spanning several tracks, the second overlays the first. Grid: `1fr ×4` columns, `100px ×3` rows, `gap: 10px`. **Bonus:** show the first on top "without changing the order of items in the source" | `.item1 { grid-column: 1 / 4; grid-row: 1 / 3; } .item2 { grid-column: 2 / 5; grid-row: 2 / 4; }`. Bonus: "`order` … `.item1 { order: 1; }`" and "Another valid solution is to use `z-index`: `.item1 { z-index: 1; }`" | overlap yes (#13); bonus **NEW → #49** |
| 3 | Four items by name, grid `1fr 2fr`, `gap: 20px`, one empty cell. "Possible areas of confusion would be not realizing you should place a `.` to leave a cell empty, or that you should repeat the name to cause an element to span more than one track" | `grid-template-areas: "aa aa" "bb cc" ". dd";` with `.one { grid-area: aa } .two { grid-area: bb } .three { grid-area: cc } .four { grid-area: dd }` | yes (#14, #15) |
| 4 | Grid **and** flexbox: four cards in three columns (`10px` gap), each card = image (`200px`, `object-fit: cover`) over a chip list. "The `<ul>` needs to be a flex container as tags … are not lined up in columns, only in rows"; "You may try to use flexbox on the container and restrict the cards with percentage values" (the page says that is the wrong tool) | `.container { display: grid; gap: 10px; grid-template-columns: 1fr 1fr 1fr; } .tags { display: flex; flex-wrap: wrap; justify-content: center; }` on a start of `.card { display: grid; grid-template-rows: 200px min-content; } .card > img { width: 100%; height: 100%; object-fit: cover; }` | **NEW → #50** |

### 6.2 External links the grid guides cite, plus CSS-Tricks and Grid Garden

How the list was made: every `http(s)` link that is not on `developer.mozilla.org` (and not the MDN demo images) in the
raw Markdown of the 13 guides + `In_grid_layout` — 18 link lines, 17 distinct URLs (index 5, Accessibility 5, Common_grid_layouts 3,
Subgrid 3, Auto-placement 2; Grid by Example and CSS-Tricks repeat). Added: the Learn page's video and Scrimba embed, the
Firefox page's Jen Simmons link, CSS-Tricks' old snippet URL (same guide) — 20 URLs, 22 table rows below because Grid by
Example is split into home / patterns / examples. Pages `Basic_concepts`, `Line-based_placement`,
`Named_grid_lines`, `Grid_template_areas`, `Box_alignment`, `Logical_values`, `Relationship_with_other_layout_methods`,
`Grid_lanes` and `In_grid_layout` have **no** external link.

| # | URL | Read | Anything NOT already in 02 / 03 |
|---|-----|------|----------------------------------|
| A | https://css-tricks.com/complete-guide-css-grid-layout/ (old `/snippets/css/complete-guide-grid/` is the same guide) | fully — fetch-and-extract (host refuses `curl`); every property section | `grid-template` "doesn't reset the implicit grid properties (`grid-auto-columns`, `grid-auto-rows`, and `grid-auto-flow`) … it's recommended to use the `grid` property" (T25). `grid`: "You can only specify the explicit or the implicit grid properties in a single `grid` declaration"; forms `grid: auto-flow dense 100px / 1fr 2fr` ≡ `grid-auto-flow: row dense; grid-auto-rows: 100px; grid-template-columns: 1fr 2fr` and `grid: 100px 300px / auto-flow 200px` ≡ rows `100px 300px; grid-auto-flow: column; grid-auto-columns: 200px`. `safe`/`unsafe` alignment keywords (goal #66). `auto` "lose[s] the fight in sizing against `fr` units when allocating the remaining space". `fr` vs `%`: "if you added padding to those percentage-based columns, now you've broken 100% width". `gap` "could be thought of as a minimum gutter" (a larger `space-between` space wins). `dense` "only changes the visual order … bad for accessibility" (= T11). Animation table (goal #65). Browser versions. The page writes `place-items`/`place-content` values as `<align> / <value>` but its own example is `place-self: center stretch` — **space-separated is the form to emit** (T26). Masonry: "in the process of defining an official approach" (= 2.12). |
| B | https://cssgridgarden.com/ | fully — the game's own `js/levels.js` (all 28 levels, instructions + solutions) read with `curl`; the page itself is an interactive app | See the 28-level table below. Goals #51–#54. |
| C | https://gridbyexample.com/ (home) | fully | Index only: nav (Start Here, Examples, Patterns, Video, Resources), "GridBugs!" repo `rachelandrew/gridbugs`, Grid AMA repo `rachelandrew/cssgrid-ama`, newsletter csslayout.news. No technique. |
| D | https://gridbyexample.com/patterns/ and its 6 pattern pages | partly — page texts read through the Wayback Machine; the CodePen code each embeds was not opened | Six patterns: header · 2 col · footer; the same responsive; the same with "negative space" (goal #61); "as many as will fit" in a centre panel; the same with some items spanning two rows; media objects (areas, nested, flippable). Quotes: columns "a minimum of 200 pixels and a maximum of 1fr", rows "a minimum of 100 pixels tall but expand … so the rows have a max of auto" (= #18 + #24). Fallbacks: "uses floats and Feature Queries" / "uses Flexbox, we need to constrain the items … We don't get the tall items in flex layout" (T27). |
| E | https://gridbyexample.com/examples/ (37 examples + 9 subgrid examples) | partly — all 46 titles read; bodies of examples 36, 37 and subgrid 1–9 read (Wayback) | #62, #63, T19, T21 below. Subgrid 2-2: "the parent grid row containing the subgrid will grow to be large enough to contain the content (assuming it has an `auto` or other content-based size)"; 2-5: extra items "are forced into the last row"; 2-4: subgrid inherits the gap, `row-gap: 0` overrides. Titles with no new fact beyond MDN: defining a grid, line-based shorthands, named lines, `repeat`, explicit/implicit, areas, "No clearing required", media-query redefinition, source independence, layering, "a grid item as a new positioning context", auto-placement, `grid-auto-flow: column`, mixed placed/auto items, `auto-fill`, nested grid, implicit named lines, `order`, the four `*-items/*-self`, `minmax` in `auto-fill`, `minmax` + spans, `auto-fill` + named lines, aligning the grid, `space-around`/`space-between`, multiple tracks in `auto-fill`. |
| F | https://www.quackit.com/css/grid/examples/css_grid_website_layout_examples.cfm | fully — the index lists 12 layouts; each layout's code read from its scratchpad URL | Goals #57, #58. Layouts 1–10 are one `body` grid of five named areas (`header`, `nav`, `article`, `ads`, `footer`), 80px / 1fr / 70px rows, `20% 1fr 15%` or `20% 1fr`, `10px` row/column gap, `height: 100vh`, and ONE phone rule at `max-width: 575px` with the same stack for all ten. Layouts 11–12: a `#grid` of `repeat(5, 1fr)` rows × `repeat(4, 1fr)` columns (12: `50vh repeat(4, 1fr)` rows) with `span` on `:nth-child` items. Area arrangements seen: `"header header header" "nav article ads" "nav footer footer"` · `"…" "article nav ads" "footer footer footer"` · `"header header ads" "nav article article" "nav footer footer"` · `"header header" "nav article" "ads article" "ads footer"`. |
| G | https://tympanus.net/codrops/css_reference/grid/ | fully — through the Wayback Machine (live host returns 403) | Goals #55, #56, #59, #60; T22, T23, T27. Also stored nowhere before: **the invalid-line rules** ("If a grid item's end line comes before its start line, then the start and end lines will be swapped. If the start line and end line are the same, the end line will be ignored"; `start: span 3; end: span 2` → "the one applied on the end line will be ignored"; `span [foo]` alone → `span 1`) — 03 has the swap, not the other two. `grid-auto-columns: 50px 75px` is a **repeating list** for implicit tracks, and once implicit tracks exist, un-placed items "fill up accordingly". Implicit empty rows "will have a height of 0". Gutters "do not appear on the edges". `grid` "also resets any gutter properties set earlier in the cascade" (it lists 8 sub-properties, including `grid-column-gap`/`grid-row-gap` — Codrops' 2017 wording; T8 stays right for the auto-* ones). Skip-link remark: with grid the main content can come first in the source and the navigation be placed visually above. Notes "grid placement only affects visual presentation". |
| H | https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html | fully (`curl`) | Not CSS — the **overlay** every builder should copy for its own grid editing: a toggle per grid ("Overlay grid"), "Display line numbers" (on by default), "Display area names" (on by default), "Extend lines infinitely" (lines run to the viewport edge), a per-grid colour, a "mini grid view" whose hover highlights the same area on the overlay with its size/row/column, a subgrid indented under its parent (and the parent's lines shown when the subgrid is ticked). Preferences "persisted across page loads for each separate page". |
| I | https://mozilladevelopers.github.io/playground/css-grid | fully — intro + 9 lessons (`curl`): terminology, first grid, DevTools, `fr`, mixing units, position, basic layout, template areas, named lines, learn more | No new CSS. Quotes worth keeping: "`grid-template-columns: 10px repeat(2, 1fr)`" — `repeat()` "for just part of the track listing"; mixed `100px 30% 1fr` (and the `2fr` variant: "a 3rd column that is `2fr` and occupies 2/3 of the remaining space"); named lines `[main-start sidebar-start] 200px [sidebar-end content-start] 1fr …` and `grid-column: main-start / main-end`. Lesson 3 describes the Layout panel above (H). |
| J | https://tink.uk/flexbox-the-keyboard-navigation-disconnect/ (2016) | fully — fetch-and-extract | The only fixes available to authors are bad: `tabindex` "is scoped to the document" (solving the local problem hijacks the whole page's tab order); `aria-flowto` "complicates rather than simplifies" and has "extremely poor accessibility support". Conclusion: "the only viable way … is in the browser … and the accessibility tree". For a builder: do not try to repair a visual/DOM mismatch with `tabindex` or ARIA — keep them equal (T11). |
| K | https://css-tricks.com/grid-content-re-ordering-and-accessibility/ (2019) | fully — fetch-and-extract | Quoted: "If the visual order and the DOM order don't match, it can irritate and confuse users up to a point where the experience is so bad that the site is unusable" (Matuzovic); Rachel Andrew: "We need to provide a way to allow the tab and reading order to follow the visual order." Culprits listed: `order`, column flows, `row-reverse`, absolute positioning. Same message as T11; no new rule. |
| L | https://adrianroselli.com/2018/05/display-contents-is-not-a-css-reset.html | fully — fetch-and-extract; the CodePen demo was not run | T20 below (what breaks, per browser, with dates; last advice July 2025). |
| M | https://github.com/w3c/csswg-drafts/issues/796 (Auto-placement guide's "an issue raised about this") | partly — GitHub returns 403 to the direct fetch; the extract says: title "[css-grid] Auto-placement aligning to a named line", **Closed — Accepted by CSSWG Resolution**, labels "Needs Edits" and `css-grid-3` (the Masonry/lanes level); the comment thread itself was not read | The guide says CSS cannot yet "auto-place items against the next line named n"; this request was accepted for Level 3 (the same level as grid lanes, 2.12). Nothing to build now. |
| N | https://drafts.csswg.org/css-grid/#order-accessibility | fully (`curl`, spec text) | Confirms 2.9 word for word. Not stored before: the **authoring-tool paragraph** — tools "must reorder the underlying document source and not use `order` or grid-placement properties to perform reordering unless the author has explicitly indicated that the underlying document order … should be out-of-sync"; the conforming design it describes is "drag-and-drop arrangement … by simultaneously reordering the DOM layer", and, if different visual arrangements per screen size are wanted, "tie the smallest screen size's arrangement to the underlying DOM order" and rearrange only in the other ranges; "a tool that only ever used the grid-placement properties to handle drag-and-drop grid rearrangement … would be non-conformant". Its own page-frame example: `grid: "h h h" "a b c" "f f f"; grid-template-columns: auto 1fr 20%;` (goal #55). |
| O | https://drafts.csswg.org/css-grid/#auto-placement-algo (§8.5) | fully (`curl`, spec text, through the sparse and dense branches) | T23 and T24 below. |
| P | https://www.youtube.com/watch?v=KOvGeFUHAC0 (Learn page video) | **failed** — video, no transcript fetched | — |
| Q | Scrimba "Your first grid" (`scrimba.com/learn-css-grid-c02k/~01`, Learn page) | **failed** — interactive embed | — |
| R | https://www.youtube.com/watch?v=spxT2CmHoPk (Léonie Watson, Accessibility remix) | **failed** — video | The same argument as J is in her article, which was read. |
| S | https://www.youtube.com/watch?v=gmQlK3kRft4 (forms with subgrid, 2019) | **failed** — video | The subject (forms on subgrid) is goal #35 / #28. |
| T | https://www.youtube.com/watch?v=lLnFtK1LNu4 (card layouts with subgrid, 2019) | **failed** — video | Goal #35. |
| U | https://www.youtube.com/watch?v=vxOj7CaWiPU (Hello subgrid!, CSSConf.eu 2019) | **failed** — video | — |
| V | https://labs.jensimmons.com/ (cited by the Firefox page, H, not by MDN) | not followed — a gallery of Jen Simmons' layout experiments, not a reference page; open line if a taste pass wants it | — |

(Not in the list because MDN's guides do not cite them: the Codrops page links Manuel Rego's articles and Igalia's
examples; not followed.)

**Grid Garden — all 28 levels** (instructions in English, the game's own solution). The game teaches only item placement
and track sizing; the first 19 never define the grid (the garden is a fixed `5 × 20%` grid).

| Lvl | Name | Goal (the game's words, shortened) | Solution CSS |
|---|---|---|---|
| 1 | grid-column-start 1 | "water only the areas that have carrots": start at the 3rd vertical line | `grid-column-start: 3;` |
| 2 | grid-column-start 2 | weeds start at the 5th vertical line | `grid-column-start: 5;` |
| 3 | grid-column-end 1 | "When `grid-column-start` is used alone … the grid item by default will span exactly one column"; carrots from line 1 to 4 (start is 1) | `grid-column-end: 4;` |
| 4 | grid-column-end 2 | "you might assume that the end value has to be greater than the start value. But this turns out not the case!" (start 5) | `grid-column-end: 2;` (any value below 5) |
| 5 | grid-column-end 3 | negative values "to count grid lines from the right"; `-1` "the first grid line from the right" (start 1) | `grid-column-end: -2;` |
| 6 | grid-column-start 3 | start set to a negative value | `grid-column-start: -3;` |
| 7 | grid-column-end 4 | "define it based on your desired column width using the `span` keyword. Keep in mind that `span` only works with positive values" (start 2) | `grid-column-end: span 2;` |
| 8 | grid-column-end 5 | `span` again (start 1) | `grid-column-end: span 5;` |
| 9 | grid-column-start 4 | `span` with the START: width "relative to the end position" (end is 6) | `grid-column-start: span 3;` |
| 10 | grid-column 1 | "`grid-column` is a shorthand … separated by a slash" | `grid-column: 4 / 6;` |
| 11 | grid-column 2 | the shorthand, "the `span` keyword also works" | `grid-column: 2 / 5;` |
| 12 | grid-row-start 1 | "you can easily position items in two dimensions" | `grid-row-start: 3;` |
| 13 | grid-row-start 2 | `grid-row` shorthand | `grid-row: 3 / 6;` |
| 14 | grid-column-row 1 | both at once | `grid-column: 2; grid-row: 5;` |
| 15 | grid-column-row 2 | both, spanning larger areas | `grid-column: 2 / 6; grid-row: 1 / 6;` |
| 16 | grid-area 1 | "`grid-area` accepts four values separated by slashes: `grid-row-start`, `grid-column-start`, `grid-row-end`, followed by `grid-column-end`" (= T4) | `grid-area: 1 / 2 / 4 / 6;` |
| 17 | grid-area 2 | "How about multiple items? You can overlap them without any trouble." A second area covering the unwatered carrots (first is `1 / 4 / 6 / 5`) | `grid-area: 2 / 3 / 5 / 6;` |
| 18 | order 1 | "grid items aren't explicitly placed … automatically placed according to their order in the source code. We can override this using the `order` property … By default, all grid items have an order of 0, but this can be set to any positive or negative value, similar to `z-index`" | `order: 2;` |
| 19 | order 2 | water and poison alternate; "Set the order of the poisons to remedy this" | `order: -1;` |
| 20 | grid-template-columns 1 | "you can set the grid up in other ways": two columns | `grid-template-columns: 50% 50%;` |
| 21 | grid-template-columns 2 | the `repeat` function: eight columns of 12.5% | `grid-template-columns: repeat(8, 12.5%);` |
| 22 | grid-template-columns 4 | "length units like pixels and ems. You can even mix different units together" | `grid-template-columns: 100px 3em 40%;` |
| 23 | grid-template-columns 5 | "Each `fr` unit allocates one share of the available space": 1/6 weeds, 5/6 carrots | `grid-template-columns: 1fr 5fr;` |
| 24 | grid-template-columns 3 | "any other columns set with `fr` will divvy up the space that's left over": 50px / three `fr` / 50px | `grid-template-columns: 50px 1fr 1fr 1fr 50px;` |
| 25 | grid-template-columns 6 | 75px column, then 3/5 and 2/5 of the rest | `grid-template-columns: 75px 3fr 2fr;` |
| 26 | grid-template-rows 1 | "works much the same as `grid-template-columns`": "water all but the top 50 pixels of your garden … the water is set to fill only your 5th row, so you'll need to create 5 rows in total" | `grid-template-rows: 1fr 100px;` — the text and the stored answer do not obviously agree (two explicit rows, the item in row 5): **not verified, do not copy** |
| 27 | grid-template 1 | "`grid-template` is a shorthand … `grid-template: 50% 50% / 200px;` will create … two rows that are 50% each, and one column that is 200 pixels wide" | `grid-template: 60% 1fr / 200px 1fr;` |
| 28 | grid-template 2 | a 50px path at the bottom, the left 20% weeds | `grid-template: 1fr 50px / 20% 1fr;` |

Every Grid Garden goal is already a row of §3 (#6–#11, #25–#26) except those added as #51–#54. The game never teaches
`gap`, `minmax`, `auto-fit`, areas, alignment or subgrid.

**New traps found (continuing T1–T18):**

**T19 — A percentage row gap needs a height.** `gap: 2%` on a grid with no height: "the row gap resolves to 0. If we
give the grid a height, there is something for 2% to be a percentage of" (GBE example 36). Codrops (2017) says gap
percentages are "of the parent's container width" — the example shows the row gap does not work that way; measure before
emitting `%` for a ROW gap. Column gaps in `%` are safe.

**T20 — `display: contents` and the accessibility tree** (Roselli, last advice July 2025): browsers "take an element with
`display: contents` and drop it from the accessibility tree" — affected: buttons, links, form controls, lists
(`ul`/`ol`), tables, headings, `nav`, `header`, `details`, web components. Chrome fixed it (issue closed March 2021);
Firefox fixed it in 62 "with limitations; initially only worked for lists"; Safari "repeatedly promised fixes (15.4, 16)
but remained broken as of July 2022; still problematic in web components as of November 2024". "Browsers have fixed and
regressed `display: contents` repeatedly." His rules: avoid it on interactive or focusable elements, avoid it in web
components, skip it for tables, lists and headings, and test regularly. It is "not a CSS reset". (T15 said never on a
landmark, list, button or heading — this is the evidence.)

**T21 — Subgrid padding and margin are subtracted from the first and last tracks** (GBE subgrid 8, 9): the tracks get
narrower, the items still line up with the parent. A card that gets inner padding while on subgrid rows loses height in
its first and last row, not extra height around it.

**T22 — Every name in `grid-template-areas` must be given to an item.** Codrops' own example defines `"content sidebar"`
but only styles `header`, `nav`, `footer` with `grid-area`; `main` and `aside` land in the two cells by auto-placement,
by accident. A generator that emits a name without an item using it, or an item without its name, is relying on that.

**T23 — Implicit tracks are added at the START as well as the end, and an unplaced item's span can add columns** (spec
§8.5): "add columns to the beginning and end of the implicit grid as necessary to accommodate" items with a definite column;
"If the largest column span among all the items without a definite column position is larger than the width of the
implicit grid, add columns to the end". The spec's example: `repeat(5, 100px)` with `grid-column: 4 / span 3` needs
**6 columns** ("ends on line 7"). A lone `span 3` on a 2-column grid creates a third column (T2 extended).

**T24 — Sparse placement has a cursor that only goes forward; dense restarts it** (spec §8.5). Items with a definite
column position: the cursor's column is set to that column; "If this is less than the previous column position of the
cursor, increment the row position by 1" — so a column-locked item can jump to the next row even when an earlier row has
room. Auto items: the cursor advances until the item does not overlap an occupied cell or it would overflow the implicit
columns, then wraps to the next row. With `dense`, **every** item restarts from the start-most row and column. The
algorithm "works with the grid items in **order-modified** document order, not their original document order"; text
runs become anonymous items first. Takeaway for a builder: a hole is always explained by this cursor; `dense` is the only
backfill, and it reorders reading.

**T25 — `grid-template` and `grid` differ in what they reset.** CSS-Tricks: `grid-template` leaves the implicit
properties alone; `grid` sets all six and "you can only specify the explicit or the implicit grid properties in a single
`grid` declaration". Codrops (2017) adds that `grid` resets gutters too. Emit longhands (T8) and the question disappears.

**T26 — `place-*` shorthands take space-separated values** (`place-self: center stretch`, `place-items: center`). The
CSS-Tricks summary prints them with a slash; the example below it does not. A generator that copies the slash form emits
an invalid declaration.

**T27 — Fallbacks: the old layout comes first, `@supports (display: grid)` overrides it** (GBE patterns: floats and
"Feature Queries"; flex fallback needs items constrained "to get the appearance of two-dimensional alignment" and "We
don't get the tall items in flex layout"). Codrops: grid in Chrome 57+/Firefox 52+/Safari 10.1+/Edge 16+; IE 10/11 have
only the old `-ms-` syntax ("functionality that is not supported"). For Android WebViews below Chrome 57 (RULE AF) a
single-column block fallback is the realistic one — the content stacks and stays readable.

**T28 — A Learn example is not production CSS.** Learn's `repeat(auto-fit, minmax(230px, 1fr))` overflows a container
narrower than 230px (T9); its pixel values (`200px`, `20px`, `100px`) are teaching values. Keep the *goal*, convert the CSS
per rule 16.

**What the follow-up closes.** Learn module examples: 14 + 4 tasks, all recorded, 5 new goals (#46–#50). External links:
22 listed, 12 read fully, 3 partly (GBE patterns bodies, GBE examples bodies, issue 796 thread), 6 not readable (5
videos + the Scrimba embed), 1 not followed (Jen Simmons labs). Grid Garden: 28/28 levels, from the game's own source.
Totals: goals #46–#66 (21 new rows), traps T19–T28 (10), and the Firefox grid-overlay feature list for the builder's own
grid editor (RULE UI).
