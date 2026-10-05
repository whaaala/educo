# CSS Grid — every property, function and value (MDN, read 2026-10-04)

The complete reference layer for CSS Grid, read from MDN page by page. It EXTENDS what is already stored:

- `../advanced-css/07-grid.md` — the course's Grid section (terminology, `fr`, `repeat()`, line / named-line / area
  placement, explicit vs implicit grid, `dense`, content-sized tracks, `auto-fill` vs `auto-fit`) with the builder's
  `HAVE / PARTIAL / GAP` marks and the open lines AC-29 … AC-33. That file is correct and is not repeated here; this
  file points to it where it already covers a point.
- `../advanced-css/08-nexter.md` — a whole page on Grid (named-line page frame, full-bleed / half-bleed, nested grids,
  subgrid as a gap AC-35 / AC-36, `@supports`, the `grid-template` shorthand).

Gap and alignment properties belong to another file (links only): [`gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap) ·
[`row-gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/row-gap) ·
[`column-gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/column-gap) ·
[`justify-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-items) ·
[`align-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-items) ·
[`justify-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-self) ·
[`align-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-self) ·
[`justify-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content) ·
[`align-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-content) ·
[`place-*`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-items).

---

## 0. Completeness table

| # | URL | Read fully? | Notes |
|---|-----|-------------|-------|
| 1 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid (the user's link) | yes | constituents, every syntax form, values, formal definition, formal syntax, both examples, the "gutters are not reset" note, Baseline |
| 2 | …/Properties/grid-template | yes (2 fetches) | full formal syntax copied (it holds every track grammar production shared by the other track properties), both notes, values, examples |
| 3 | …/Properties/grid-template-columns | yes (3 fetches) | the verbatim formal-syntax copy was refused by the fetch tool; the grammar is IDENTICAL to the one copied from page 2 (same productions, `subgrid <line-name-list>?`). No masonry value on this page any more; no callouts |
| 4 | …/Properties/grid-template-rows | yes | same grammar as columns; example + try-it values |
| 5 | …/Properties/grid-template-areas | yes | values, rectangle rule, null-cell token, example |
| 6 | …/Properties/grid-auto-columns | yes | every value, note on `auto` stretching, formal syntax, example. Baseline date July 2020 (the multi-value track list) |
| 7 | …/Properties/grid-auto-rows | yes | same as 6; % treated as `auto` when block size is indefinite |
| 8 | …/Properties/grid-auto-flow | yes | values, sparse vs dense, example with HTML+CSS+JS |
| 9 | …/Properties/grid-area | yes | values, 1–4 value expansion, formal syntax, both examples |
| 10 | …/Properties/grid-row | yes (2 fetches) | values, examples; the page itself does not spell out the one-value rule in its Syntax section — taken from grid-area's page and the spec (see §6) |
| 11 | …/Properties/grid-column | yes | as grid-row |
| 12 | …/Properties/grid-row-start | yes | |
| 13 | …/Properties/grid-row-end | yes | |
| 14 | …/Properties/grid-column-start | yes | |
| 15 | …/Properties/grid-column-end | yes | |
| 16 | …/Properties/display | partly (grid parts on purpose) | grid / inline-grid / `block grid` / `inline grid` / **`grid-lanes` / `inline-grid-lanes`**, outer/inner types, formal definition, formal syntax, accessibility notes. Non-grid display values are listed only |
| 17 | …/Reference/Values/repeat | yes | all forms incl. `<name-repeat>` and the new gap-rule forms, auto-fill/auto-fit algorithm, the four restrictions, example |
| 18 | …/Reference/Values/minmax | yes | |
| 19 | …/Reference/Values/fit-content_function | yes | |
| 20 | …/Reference/Values/flex_value (`<flex>`, `fr`) | yes | short page |
| 21 | …/Guides/Grid_layout/Subgrid | yes | all seven examples, gaps, line names, no implicit grid |
| 22 | …/Guides/Grid_layout/Masonry_layout | **failed (404)** | the page no longer exists: masonry was renamed. Found the replacement through the Grid guide index → row 23 |
| 23 | …/Guides/Grid_layout/Grid_lanes (masonry = "grid lanes") | yes | experimental, `display: grid-lanes`, four examples |
| 24 | …/Guides/Grid_layout/Named_grid_lines | yes | named lines, implicit areas ↔ implicit lines, `name N`, `span N name` |
| 25 | …/Guides/Grid_layout/Auto-placement | yes | order of placement, anonymous items, multi-value auto tracks, limits |
| 26 | …/Guides/Grid_layout/Line-based_placement | yes | negative lines = explicit grid only, `span` on start, reversed start/end |
| 27 | …/Guides/Grid_layout (index) | yes (links only) | used to find rows 21–26 |

Not read (out of scope, links only): the gap and alignment pages above; Guides "Basic concepts", "Grid template
areas", "Box alignment", "Logical values and writing modes", "Accessibility", "Common grid layouts" — their points
are already in `07-grid.md` / `08-nexter.md` or are the other researcher's.

Two corrections MDN made since the course (and since `08-nexter.md` was written):
1. **Masonry is now "grid lanes"**: `display: grid-lanes` / `inline-grid-lanes` (CSS Grid Level 3), not the old
   `grid-template-rows: masonry`. The `masonry` keyword is gone from MDN's `grid-template-*` pages (§13).
2. **Subgrid is Baseline "widely available" since September 2023** (`08-nexter.md` already says shipped; this
   confirms MDN's date).

---

## 1. `display: grid` / `inline-grid` — how a grid container is made

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display
- **Initial:** `inline` · **Inherited:** no · **Applies to:** all elements · **Computed:** as specified, except for
  positioned / floating elements and the root · **Animation:** discrete (to/from `none` visible the whole time).
- **Formal syntax (grid parts):**
  ```
  display = [ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal>
          | <display-box> | <display-legacy> | grid-lanes | inline-grid-lanes | …
  <display-outside> = block | inline | run-in
  <display-inside>  = flow | flow-root | table | flex | grid | ruby
  <display-legacy>  = inline-block | inline-table | inline-flex | inline-grid
  ```
- **Values for grid:**
  - `grid` = `block grid` — a BLOCK-level box (outer type block) whose children are laid out by grid (inner type grid);
  - `inline-grid` = `inline grid` — the same container, but it sits in a line like a word (outer type inline);
  - `grid-lanes` / `inline-grid-lanes` — the masonry container (experimental, §13).
- **What becomes a grid item:** every in-flow DIRECT child, plus each run of loose text (an **anonymous grid item**
  — always auto-placed, cannot be styled). Grandchildren are not items unless their parent is itself a grid
  (nested) or a `subgrid` (§12). `display: contents` on a child promotes ITS children to items.
- **Ignored on grid items:** `float`, `vertical-align`, and `display: inline-block / table-cell` behaviour
  (`08-nexter.md`, the @supports section).
- **Example:**
  ```html
  <article class="g"><span>First</span><span>Second</span><span>Third</span></article>
  ```
  ```css
  .g { display: grid; }            /* same as display: block grid */
  .g span { padding: 10px; }       /* three rows, one per span: no template yet */
  ```
- **Traps:** `display: grid` alone changes little — one column, one implicit row per item. Changing a `<table>` (or
  list) to `display: grid` can drop its semantics from the accessibility tree in some browsers; `display: contents`
  is removed from the tree in some browsers (MDN accessibility notes).
- **Baseline:** `display` widely available (July 2015); the grid values since 2017.

---

## 2. `grid-template-columns`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns
- **Initial:** `none` · **Inherited:** no · **Applies to:** grid containers · **Percentages:** the inline size of the
  content area · **Computed:** as specified, relative lengths made absolute · **Animation:** simple list of length,
  percentage or calc (it animates only when both lists have the same number of tracks of interpolable sizes).
- **Formal syntax** (identical for `grid-template-rows`; productions copied from MDN's `grid-template` page):
  ```
  grid-template-columns = none | <track-list> | <auto-track-list> | subgrid <line-name-list>?

  <track-list>      = [ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?
  <auto-track-list> = [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?
                      <auto-repeat>
                      [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?
  <explicit-track-list> = [ <line-names>? <track-size> ]+ <line-names>?
  <line-name-list>  = [ <line-names> | <name-repeat> ]+
  <line-names>      = '[' <custom-ident>* ']'

  <track-size>      = <track-breadth> | minmax( <inflexible-breadth> , <track-breadth> )
                    | fit-content( <length-percentage [0,∞]> )
  <track-breadth>   = <length-percentage [0,∞]> | <flex [0,∞]> | min-content | max-content | auto
  <inflexible-breadth> = <length-percentage [0,∞]> | min-content | max-content | auto
  <fixed-size>      = <fixed-breadth> | minmax( <fixed-breadth> , <track-breadth> )
                    | minmax( <inflexible-breadth> , <fixed-breadth> )
  <fixed-breadth>   = <length-percentage [0,∞]>

  <track-repeat> = repeat( [ <integer [1,∞]> ] , [ <line-names>? <track-size> ]+ <line-names>? )
  <auto-repeat>  = repeat( [ auto-fill | auto-fit ] , [ <line-names>? <track-size> ]+ <line-names>? )
  <fixed-repeat> = repeat( [ <integer [1,∞]> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )
  <name-repeat>  = repeat( [ <integer [1,∞]> | auto-fill ] , <line-names>+ )
  ```
  (MDN's grammar now shows `<track-size>` inside `<auto-repeat>`; the spec text and MDN's `repeat()` prose still
  require every OTHER track in an auto-repeating list to be a `<fixed-size>` — see §16 restriction 3.)
- **Every value:**
  - `none` — no explicit grid; every column is implicit, sized by `grid-auto-columns`;
  - `[name …]` — names for the line at that position; several names in one bracket; `span` and `auto` are not allowed
    as names;
  - `<length>` — a fixed non-negative width (`20rem`);
  - `<percentage>` — of the container's inline size (the content box, **gaps not subtracted**);
  - `<flex>` (`1fr`) — a share of the space left over; alone it means `minmax(auto, <flex>)` (§14);
  - `max-content` — the widest item's width with no wrapping;
  - `min-content` — the widest item's narrowest width (its longest word);
  - `minmax(min, max)` — between two sizes (§15);
  - `auto` — as a max: the largest max-content; as a min: the largest item minimum (`min-width`), often min-content;
    alone ≈ `minmax(min-content, max-content)`; **only `auto` tracks are stretched** by `justify-content` /
    `align-content: normal | stretch`, so by default auto tracks share any leftover space;
  - `fit-content(<length-percentage>)` — content-sized but capped at the argument (§17);
  - `repeat(N | auto-fill | auto-fit, …)` — a repeated fragment (§16);
  - `subgrid [names]…` — take the parent's column tracks for the span this item covers (§12).
- **Example (MDN):**
  ```html
  <div id="grid"><div id="areaA">A</div><div id="areaB">B</div></div>
  ```
  ```css
  #grid { display: grid; width: 100%; grid-template-columns: 50px 1fr; }
  #areaA { background-color: lime; }  #areaB { background-color: yellow; }
  ```
  Try-it values on the page: `60px 60px` · `1fr 60px` · `1fr 2fr` · `8ch auto`.
- **Traps:** `1fr` is `minmax(auto, 1fr)` → a long word or a wide image widens its column (`07-grid.md`, "the `1fr`
  surprise"; the builder writes `minmax(0, 1fr)`). `%` ignores gaps, so `50% 50%` + a gap overflows. A `px` track does
  not grow with the reader's text size (rule 16: `rem`).
- **Baseline:** widely available since October 2017; `subgrid` since September 2023.

## 3. `grid-template-rows`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows
- Same initial (`none`), inheritance (no), applies-to (grid containers), computed value, animation and formal syntax
  as §2. **Percentages refer to the container's BLOCK size** — and when that height is not definite, a `%` row
  behaves as `auto`.
- **Example (MDN):**
  ```css
  #grid { display: grid; height: 100px; grid-template-columns: 1fr 1fr;
          grid-template-rows: 30px 1fr; grid-gap: 10px; }
  ```
  Try-it values: `auto` · `40px 4em 40px` · `1fr 2fr 1fr` · `3ch auto minmax(10px, 60px)`.
- **Traps:** `fr` rows need a container with a definite height, otherwise they act like `auto` (content height). Rows
  are usually best left to content (`auto`) or `minmax(<rem>, auto)` — a fixed row height clips or overflows text.
- **Baseline:** widely available since October 2017.

## 4. `grid-template-areas`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-areas
- **Initial:** `none` · **Inherited:** no · **Applies to:** grid containers · **Computed:** as specified ·
  **Animation:** discrete.
- **Formal syntax:** `grid-template-areas = none | <string>+`
- **Values:**
  - `none` — no named areas;
  - `<string>` — ONE STRING = ONE ROW; each whitespace-separated token = one column cell; the same name repeated across
    cells (in a row and in following rows) makes ONE area covering them; **every named area must be a filled
    rectangle**, or the whole declaration is invalid (dropped); every row must have the same number of cells;
  - **null cell token** — one or more dots (`.`, `...`) = an unnamed, empty cell.
- **Side effects:** each area `foo` creates implicit LINE names `foo-start` and `foo-end` on both axes (usable in
  `grid-row` / `grid-column`); conversely lines named `x-start` / `x-end` create an implicit AREA `x` usable in
  `grid-area: x` (Named_grid_lines guide).
- **Example (MDN):**
  ```html
  <div id="page"><header>Header</header><nav>Navigation</nav><main>Main area</main><footer>Footer</footer></div>
  ```
  ```css
  #page { display: grid; width: 100%; height: 250px;
          grid-template-areas: "head head" "nav  main" ".  foot";
          grid-template-rows: 50px 1fr 30px; grid-template-columns: 150px 1fr; }
  #page > header { grid-area: head; }  #page > nav { grid-area: nav; }
  #page > main   { grid-area: main; }  #page > footer { grid-area: foot; }
  ```
- **Traps:** an L-shaped or split area silently voids the whole template. The strings only NAME cells — track sizes
  still come from `grid-template-rows/columns` (or the `grid-template` form). A `.` cell is not protected: auto-placed
  items flow into it (`07-grid.md`). The text picture is visual only — the reading order is still the source order
  (WCAG 1.3.2).
- **Baseline:** widely available since October 2017.

## 5. `grid-template` (shorthand)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template
- **Constituents:** `grid-template-rows`, `grid-template-columns`, `grid-template-areas`.
- **Initial:** `none` for all three · **Inherited:** no · **Applies to:** grid containers · **Percentages:** the
  matching dimension of the content area · **Animation:** discrete for areas; simple list for rows/columns.
- **Formal syntax:**
  ```
  grid-template = none
                | [ <'grid-template-rows'> / <'grid-template-columns'> ]
                | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?
  ```
- **How it expands:**
  - `none` → rows `none`, columns `none`, areas `none`;
  - `R / C` → rows = R, columns = C, **areas reset to `none`**;
  - the ASCII-art form → areas = the strings; rows = the size after each string (**`auto` where missing**), with the
    `[names]` before/after each string spliced in as row-line names; columns = the list after `/`, or **`none`** if
    there is no slash.
- **Notes (MDN, verbatim in substance):** `repeat()` is NOT allowed in the ASCII-art form's track lists (rows and the
  `/` columns) because the tracks must line up one-to-one with the strings. `grid` accepts the same syntax but also
  resets the implicit-grid properties — use `grid` "to prevent these values from cascading in separately".
- **Examples:**
  ```css
  grid-template: 100px 1fr / 50px 1fr;
  grid-template: [line-name] 100px / [column-name1] 30% [column-name2] 70%;
  grid-template: fit-content(100px) / fit-content(40%);
  grid-template: "a a a" 20%  "b b b" auto;
  #page { display: grid; width: 100%; height: 200px;
    grid-template:
      [header-left] "head head" 30px [header-right]
      [main-left]   "nav  main" 1fr  [main-right]
      [footer-left] "nav  foot" 30px [footer-right]
      / 120px 1fr; }
  ```
  Try-it: `"a a a" 40px "b c c" 40px "b c c" 40px / 1fr 1fr 1fr` · `"b b a" auto "b b c" 2ch "b b c" 1em / 20% 20px
  1fr` · `"a a ." minmax(50px, auto) "a a ." 80px "b b c" auto / 2em 3em auto`.
- **Traps:** the order is ROWS / COLUMNS (opposite of what people expect from "x / y"). Writing `grid-template: R / C`
  wipes an areas template set earlier. In the ASCII-art form `[a] "…" [b]` — the name after a string names the line
  BELOW that row, and is merged with the name before the next string onto the same line.
- **Baseline:** widely available since October 2017.

## 6. `grid` (the user's link — the master shorthand)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid
- **Constituents:** `grid-template-rows`, `grid-template-columns`, `grid-template-areas`, `grid-auto-rows`,
  `grid-auto-columns`, `grid-auto-flow`. **Gutters (`gap`, `row-gap`, `column-gap`) are NOT reset** (MDN note), though
  the formal-definition table still lists their initial values.
- **Initial:** rows/columns/areas `none`, auto-rows/columns `auto`, auto-flow `row` · **Inherited:** no ·
  **Applies to:** grid containers · **Percentages:** the matching dimension of the content area · **Animation:** per
  longhand (track lists simple list; areas and flow discrete; auto tracks by computed value type).
- **Formal syntax:**
  ```
  grid = <'grid-template'>
       | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>?
       | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>
  ```
- **How it expands (every omitted part is RESET to initial):**
  | Written | rows | columns | areas | auto-rows | auto-columns | auto-flow |
  |---|---|---|---|---|---|---|
  | `grid: none` | none | none | none | auto | auto | row |
  | `grid: <grid-template form>` | from it | from it | from it | **auto** | **auto** | **row** |
  | `grid: R / auto-flow [dense] [AC]` | R | **none** | **none** | **auto** | AC or auto | `column [dense]` |
  | `grid: auto-flow [dense] [AR] / C` | **none** | C | **none** | AR or auto | **auto** | `row [dense]` |
  `auto-flow` is a keyword of the shorthand only — on the SIDE of the slash where it is written it picks the flow
  direction (left of the slash = rows are auto = `row` flow; right of the slash = `column` flow).
- **Examples:**
  ```css
  grid: "a" 100px "b" 1fr;
  grid: minmax(400px, min-content) / repeat(auto-fill, 50px);
  grid: 30% / auto-flow dense;
  grid: [line1] minmax(20em, max-content) / auto-flow dense 40%;
  grid: auto-flow dense 40% / [line1] minmax(20em, max-content);
  #container { display: grid; grid: repeat(2, 60px) / auto-flow 80px; } /* 2 fixed rows, columns added 80px each */
  ```
  Try-it: `auto-flow / 1fr 1fr 1fr` · `auto-flow dense / 40px 40px 1fr` · `repeat(3, 80px) / auto-flow`.
- **Traps:** one `grid:` line silently resets the five properties it does not mention — a later `grid: 1fr / 1fr`
  in a media query wipes `grid-auto-flow: dense` and an areas template set earlier. The gutters survive.
- **Baseline:** widely available since October 2017.

## 7. `grid-auto-columns`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-columns
- **Initial:** `auto` · **Inherited:** no · **Applies to:** grid containers · **Percentages:** the matching dimension
  of the content area · **Computed:** the percentage as specified or the absolute length · **Animation:** by computed
  value type.
- **Formal syntax:** `grid-auto-columns = <track-size>+` (no `repeat()`, no line names, no `subgrid`).
- **What it sizes:** IMPLICIT column tracks only — created when an item is placed past the explicit grid (e.g.
  `grid-column: 5` in a 3-column template) or when `grid-auto-flow: column` adds columns. Tracks sized in
  `grid-template-columns` are not affected.
- **Values:** `<length>` · `<percentage>` · `<flex>` · `max-content` · `min-content` · `minmax(min, max)` (`<flex>` only
  as the max; as a minimum a flex is treated as zero) · `fit-content(<length-percentage>)` · `auto`. **Several values
  = a repeating pattern**: `100px 200px` sizes implicit tracks 100, 200, 100, 200 … .
- **Example (MDN):**
  ```css
  #grid { height: 100px; display: grid; grid-template-areas: "a a"; gap: 10px; grid-auto-columns: 200px; }
  ```
- **Traps:** implicit tracks placed BEFORE the explicit grid (negative / named lines that do not exist) take the
  pattern counting backwards from the explicit grid. Negative line numbers never reach implicit tracks (§9).
- **Baseline:** widely available; MDN dates it July 2020 (the multiple-track-size form).

## 8. `grid-auto-rows`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-rows
- Same definition and grammar as §7 for rows. **`%` is of the container's block size; if that is indefinite, `%` acts
  as `auto`.**
- **Example (MDN):**
  ```css
  #grid { width: 200px; display: grid; grid-template-areas: "a a"; gap: 10px; grid-auto-rows: 100px; }
  ```
  Try-it: `auto` · `50px` · `min-content` · `minmax(30px, auto)` (with `grid-template-columns: 1fr 1fr`).
  Patterns (Auto-placement guide): `grid-auto-rows: minmax(100px, auto)` — at least 100px, grows with content;
  `grid-auto-rows: 100px 200px` — alternating.
- **Traps:** a fixed implicit row height (`100px`) clips longer content — prefer `minmax(<rem>, auto)`.
- **Baseline:** widely available (July 2020 per MDN).

## 9. `grid-auto-flow`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-flow
- **Initial:** `row` · **Inherited:** no · **Applies to:** grid containers · **Computed:** as specified ·
  **Animation:** discrete.
- **Formal syntax:** `grid-auto-flow = [ row | column ] || dense`
- **Values:**
  - `row` — fill each row in turn, adding rows as needed (the default; assumed if only `dense` is written);
  - `column` — fill each column in turn, adding columns;
  - `dense` — back-fill: later small items go into holes left earlier. Omitted = **sparse**: the cursor only moves
    forward, so items stay in order even if holes remain;
  - accepted: `row`, `column`, `dense`, `row dense`, `column dense`.
- **Order of placement (Auto-placement guide):** items with a definite position are placed FIRST; then items locked to
  a row (or column, in column flow); then the rest, in **order-modified document order** (`order`, then source).
  Auto items do not "wait" behind a placed item — they fill the earliest free cells.
- **Example (MDN):**
  ```css
  #grid { height: 200px; width: 200px; display: grid; gap: 10px;
          grid-template: repeat(4, 1fr) / repeat(2, 1fr); grid-auto-flow: column; }
  #item1 { grid-row-start: 3; }   #item4 { grid-column-start: 2; }
  ```
  ```js
  // the page's toggle
  grid.style.gridAutoFlow = (direction.value === "row" ? "row" : "column") + (dense.checked ? " dense" : "");
  ```
- **Traps:** `dense` breaks the match between what is seen and what a screen reader / Tab reads (WCAG 1.3.2, 2.4.3) —
  only for content whose order carries no meaning. `column` flow with no explicit rows makes ONE row and a horizontal
  overflow — set `grid-template-rows` (or a row count) first. Builder status: `dense` = GAP AC-32; `column` = GAP joined
  to AC-19 (`07-grid.md`).
- **Baseline:** widely available since October 2017.

## 10. Placement longhands — `grid-row-start`, `grid-row-end`, `grid-column-start`, `grid-column-end`

- **MDN:** …/grid-row-start · …/grid-row-end · …/grid-column-start · …/grid-column-end
- **Initial:** `auto` · **Inherited:** no · **Applies to:** grid items **and absolutely-positioned boxes whose
  containing block is a grid container** · **Computed:** as specified · **Animation:** discrete.
- **Formal syntax (all four):**
  ```
  <grid-line> = auto
              | <custom-ident>
              | [ [ <integer [-∞,-1]> | <integer [1,∞]> ] && <custom-ident>? ]
              | [ span && [ <integer [1,∞]> || <custom-ident> ] ]
  ```
- **Values:**
  - `auto` — contributes nothing: auto-placement, an automatic span, or the default span of 1;
  - `<custom-ident>` (`main`) — the first line named `main-start` (on a `-start` property) / `main-end` (on an `-end`
    property) if one exists — which is how `grid-row-start: foo` lands on area `foo`'s edge; otherwise treated as
    `1 main` (the first line literally named `main`). `span` and `auto` cannot be names;
  - `<integer> && <custom-ident>?` — the Nth line (`3`), or the Nth line with that name (`2 col`, word order free);
    negative counts back from the **end of the EXPLICIT grid**; `0` is invalid; if there are too few lines with that
    name, every implicit line is assumed to carry it;
  - `span && [ <integer> || <custom-ident> ]` — a span: `span 3` (3 tracks), `span col` (to the next line named
    `col`), `span 2 col`; the integer defaults to 1; 0 / negative invalid. On a START property the start edge is N lines
    back from the end edge; on an END property the end is N lines on from the start.
- **Rules from the spec / the Line-based guide:** a start line AFTER the end line is SWAPPED (MDN's negative-number
  example writes `grid-column-start: -1; grid-column-end: -2`); if both are `span`, the END span is ignored; if both
  are `auto` (or one is a span and the other auto) the item is auto-placed with that span; items placed onto the same
  cells OVERLAP (later in source on top, `z-index` reorders).
- **Example (MDN, shared by all four pages):**
  ```html
  <div class="wrapper"><div class="box1">One</div><div class="box2">Two</div><div class="box3">Three</div>
    <div class="box4">Four</div><div class="box5">Five</div></div>
  ```
  ```css
  .wrapper { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 100px; }
  .box1 { grid-column-start: 1; grid-column-end: 4; grid-row-start: 1; grid-row-end: 3; }
  .box2 { grid-column-start: 1; grid-row-start: 3; grid-row-end: 5; }
  ```
  Try-it (column-start): `auto` · `2` · `-1` · `span 2`.
- **Traps:** negative lines CANNOT reach implicit tracks — `1 / -1` spans only the explicit columns, and in a grid with
  NO explicit template (`none`, all implicit) `-1` is line 1. Line numbers follow the writing mode: in Arabic / Hebrew
  (RTL) line 1 is on the RIGHT (RULE AF — Arabic is in the language list). MDN calls the row edges "inline-start /
  -end" and column edges "block-start / -end" on these pages; it is the other way round (rows = block axis) — the
  Line-based guide gets it right.
- **Baseline:** widely available since October 2017.

## 11. Placement shorthands — `grid-row`, `grid-column`, `grid-area`

- **MDN:** …/grid-row · …/grid-column · …/grid-area
- **Initial:** all longhands `auto` · **Inherited:** no · **Applies to:** grid items and abs-pos boxes whose
  containing block is a grid container · **Computed:** as each longhand · **Animation:** discrete.
- **Formal syntax:**
  ```
  grid-row    = <grid-line> [ / <grid-line> ]?
  grid-column = <grid-line> [ / <grid-line> ]?
  grid-area   = <grid-line> [ / <grid-line> ]{0,3}
  ```
- **How they expand (what an omitted part becomes):**
  - `grid-row: A / B` → start A, end B. `grid-row: A` → start A; end = **A again if A is a lone `<custom-ident>`**
    (so `grid-row: main` covers area `main`), **otherwise `auto`** (so `grid-row: 2` = `2 / auto` = one track).
    `grid-column` the same.
  - `grid-area: a / b / c / d` = row-start / column-start / row-end / column-end (block-start, inline-start,
    block-end, inline-end — the reverse of the `margin` clock order).
  - three values: column-end = column-start if that is a lone custom-ident, else `auto`;
  - two values: row-end = row-start if custom-ident, else `auto`; column-end likewise from column-start;
  - one value: if a lone custom-ident, ALL FOUR take it (`grid-area: head`); otherwise the other three are `auto`.
- **Examples (MDN):**
  ```css
  /* grid-row */
  #grid { display: grid; height: 200px; grid-template-columns: 200px; grid-template-rows: repeat(6, 1fr); }
  #item2 { grid-row: 2 / 4; }   #item3 { grid-row: span 2 / 7; }   /* ends at 7, starts at 5 */
  /* grid-column */
  #grid { display: grid; height: 100px; grid-template-columns: repeat(6, 1fr); grid-template-rows: 100px; }
  #item2 { grid-column: 2 / 4; } #item3 { grid-column: span 2 / 7; }
  /* grid-area */
  .example-container { display: grid; grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(3, minmax(40px, auto)); grid-template-areas: "a a a" "b c c" "b c c"; }
  #example-element { grid-area: b; }          /* or a · c · 2 / 1 / 2 / 4 */
  #grid { display: grid; height: 100px; grid-template: repeat(4, 1fr) / 50px 100px; }
  #item1 { grid-area: 2 / 2 / auto / span 3; } /* spans 3 columns into the implicit grid */
  ```
  Syntax forms on the pages: `grid-row: 4 some-grid-area / 6` · `grid-row: 5 some-grid-area span` ·
  `grid-row: span some-grid-area / span some-other-grid-area` · `grid-area: 2 span / another-grid-area span`.
- **Traps:** `grid-area: 2 / 1 / 2 / 4` (MDN try-it) has row-start = row-end = 2 → treated as a span of 1, not zero.
  `grid-area` is easy to misorder; `grid-row` + `grid-column` are clearer (`07-grid.md`). `grid-area` on an item names
  NOTHING — areas are named only by `grid-template-areas` (or by `-start/-end` line names).
- **Baseline:** widely available since October 2017.

## 12. `subgrid` (value of `grid-template-columns` / `-rows`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid (+ the two template pages)
- **Syntax:** `grid-template-columns: subgrid <line-name-list>?` — e.g. `subgrid`, `subgrid [a] [b] [c]`,
  `subgrid repeat(2, [x]) [y]`, `subgrid repeat(auto-fill, [col])`.
- **What it does:** a grid item that is itself `display: grid` takes, in that axis, the parent's tracks it SPANS
  (spanning 5 parent columns → 5 columns of exactly those sizes). Its own items then size AND align against the parent.
- **Rules (MDN guide):**
  - one axis or both (`grid-template-columns: subgrid; grid-template-rows: subgrid`); the other axis can be a normal
    track list;
  - **gaps are inherited** from the parent and can be overridden on the subgrid (`row-gap: 0`); the subgrid's lines sit
    in the middle of the parent's gap;
  - **parent line names pass down**; the subgrid can ADD its own (`subgrid [sub-a] [sub-b] …`), added, not replacing;
  - **line numbers restart at 1** inside the subgrid (a component can be dropped anywhere on the page grid);
  - **no implicit tracks in a subgridded axis** — extra items pile into the last track. Fix: don't subgrid that axis,
    use `grid-auto-rows` (the new rows then do not line up with the parent);
  - content inside the subgrid still contributes to the parent's `auto` / content-sized tracks.
- **Example (MDN, both axes):**
  ```html
  <div class="grid"><div class="item"><div class="subitem"></div></div></div>
  ```
  ```css
  .grid { display: grid; grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(4, minmax(100px, auto)); }
  .item { display: grid; grid-column: 2 / 7; grid-row: 2 / 4;
          grid-template-columns: subgrid; grid-template-rows: subgrid; }
  .subitem { grid-column: 3 / 6; grid-row: 1 / 3; }
  ```
  Line-name example: parent `1fr 1fr 1fr [col-start] 1fr 1fr 1fr [col-end] 1fr 1fr 1fr`; item `grid-template-columns:
  subgrid [sub-a] [sub-b] [sub-c] [sub-d] [sub-e] [sub-f]`; children `grid-column: col-start / col-end` and
  `grid-column: sub-b / sub-d`.
- **Traps:** the subgrid item must itself have `display: grid` and an explicit SPAN in the parent; `subgrid` on an
  element that is not a grid item behaves as `none`. The card pattern (`grid-row: span 3; grid-template-rows: subgrid`)
  needs the parent to have rows the cards can span. Builder: GAP AC-36 (`08-nexter.md`).
- **Baseline:** widely available since September 2023.

## 13. Masonry → "grid lanes" (`display: grid-lanes`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_lanes (the old
  `…/Masonry_layout` URL is a 404).
- **What it is:** CSS Grid Level 3. One axis is a real grid (the "lanes", defined by `grid-template-columns` OR
  `grid-template-rows`); on the other axis items are STACKED, each into the lane with the most space (the shortest).
  The old proposal was `grid-template-rows: masonry` on a `display: grid` container; MDN no longer documents it.
- **Values:** `display: grid-lanes` (block-level) · `display: inline-grid-lanes` (inline-level).
- **Example (MDN):**
  ```css
  .grid { display: grid-lanes; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .span-2 { grid-column-end: span 2; }         /* spans two lanes, packed around */
  .positioned { grid-column: 2 / 4; }          /* definite items placed first, the rest packed round */
  .rows { display: grid-lanes; gap: 10px; grid-template-rows: repeat(3, 100px); } /* horizontal lanes */
  ```
- **Traps:** experimental, **not Baseline, "limited availability"** — not usable on the RULE AF audience's browsers
  without a fallback (a normal grid with `align-items: start` is the safe fallback). Visual order can drift from source
  order as items jump to the shortest lane. The builder's MASONRY is its own fine-row-unit grid (`aa6d32f`,
  `project_masonry_decision`), which works today.
- **Baseline:** none (experimental).

## 14. `<flex>` — the `fr` unit

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/flex_value
- **Syntax:** `<number>fr`, no space: `1fr`, `2.5fr`, `0.5fr`. Non-negative. Valid only in grid track sizes
  (`grid-template-*`, `grid-auto-*`, the max of `minmax()`); not a `<length>`, so **not usable in `calc()`** or as a
  `minmax()` minimum.
- **Meaning:** a share of the space LEFT after fixed / percentage / content tracks and gaps; `1fr 1fr 2.5fr 1.5fr` =
  6 shares.
- **Example (MDN):** `.grid { display: grid; grid-template-columns: 1fr 1fr 2.5fr 1.5fr; }`
- **Traps:** a lone `fr` = `minmax(auto, Nfr)` (content minimum — `07-grid.md`); fractions summing under 1
  (`0.2fr 0.3fr`) take only that fraction of the free space, leaving the rest empty (spec).
- **Baseline:** widely available since March 2017.

## 15. `minmax()`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax
- **Syntax:** `minmax(min, max)`; both accept `<length>`, `<percentage>`, `min-content`, `max-content`, `auto`; only
  MAX accepts `<flex>`. If max < min, max is ignored (= `min`). Used in `grid-template-columns/rows`,
  `grid-auto-columns/rows`.
- **Values:** `%` — of the container's inline size (columns) / block size (rows), treated as `auto` if that size
  depends on the tracks · `auto` as min = the largest item minimum (`min-width/height`); as max = like `max-content`
  but stretchable by `justify/align-content` · `min-content` / `max-content` — the item contributions.
- **Example (MDN):**
  ```css
  #container { display: grid;
    grid-template-columns: minmax(min-content, 300px) minmax(200px, 1fr) 150px; grid-gap: 5px; }
  ```
  Try-it: `minmax(20px, auto) 1fr 1fr` · `minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)` · `minmax(2ch, 10ch) 1fr 1fr`.
- **Traps:** `minmax(200px, 1fr)` overflows a container narrower than 200px — use `minmax(min(100%, 12rem), 1fr)`
  (`07-grid.md`, auto-fit section). `minmax(0, 1fr)` is how equal columns stay equal.
- **Baseline:** widely available since October 2017.

## 16. `repeat()`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat
- **Used in:** `grid-template-columns`, `grid-template-rows` (and, new, the gap-rule properties `row-rule`,
  `column-rule`, `rule` and their `-color/-style/-width` — the other researcher's area).
- **Forms:**
  - `<track-repeat>` `repeat(4, [col-start] minmax(100px, 1fr) [col-end])` — integer count, any track sizes;
  - `<auto-repeat>` `repeat(auto-fill | auto-fit, …)` — as many as fit;
  - `<fixed-repeat>` `repeat(4, 250px)` — integer count, fixed sizes only (required beside an auto-repeat);
  - `<name-repeat>` `repeat(5, [footer])`, `repeat(auto-fill, [header])` — names only, for `subgrid` line-name lists;
  - gap-rule forms `repeat(4, dashed)`, `repeat(auto, red, blue)` — not grid tracks.
- **`auto-fill`:** if the container has a definite (or max) size in that axis → the largest count ≥ 1 that does not
  overflow, treating each track at its MAX sizing function (or its min if the max is not definite), gaps included;
  if only a min size → the smallest count that fills it; otherwise 1. Empty repetitions stay (empty columns).
- **`auto-fit`:** the same count, then every EMPTY repeated track collapses to `0px` and the gutters beside it collapse
  — so `1fr` siblings take the room. (Empty = no in-flow item placed in or spanning it.)
- **Restrictions:** (1) several `repeat()`s are fine; (2) at most ONE auto-repeat per list; (3) with an auto-repeat,
  every other track must be fixed (`<fixed-size>` / `<fixed-repeat>`) — `repeat(auto-fill, 10px) repeat(2,
  minmax(min-content, max-content))` is invalid, and the auto-repeated track needs a definite min or max (so
  `repeat(auto-fit, 1fr)` and `repeat(auto-fill, auto)` are invalid); (4) no nesting.
- **Line names in repeat:** each repetition repeats its names. `repeat(4, [col1-start] 1fr [col2-start] 3fr)` =
  `[col1-start] 1fr [col2-start] 3fr [col1-start] 1fr [col2-start] 3fr …` (eight tracks, four lines of each name).
  Where one repetition ENDS with a name and the next BEGINS with one, both land on the same line:
  `repeat(2, [a] 1fr [b])` = `[a] 1fr [b a] 1fr [b]`. Address the Nth with `a 2` (§18). (The fetch tool's summary of
  the Named-lines guide showed this expansion with the `3fr` tracks dropped — written here from the grammar.)
- **Example (MDN):**
  ```css
  #container { display: grid; grid-template-columns: repeat(2, 50px 1fr) 100px; grid-gap: 5px; } /* 5 columns */
  ```
- **Traps:** a repeat inside the `grid-template` ASCII-art form is invalid (§5). `auto-fill` vs `auto-fit` look the
  same once there are enough items to fill every track — the difference shows only with FEW items. User agents floor
  an auto-repeated track to 1px to avoid an infinite count.
- **Baseline:** widely available since October 2017 (grid uses); the gap-rule uses are new.

## 17. `fit-content()`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/fit-content_function
- **Formula:** `min(max-content, max(auto, argument))` — content-sized (like `minmax(auto, max-content)`) but clamped
  at the argument once that exceeds the `auto` minimum. Not the same as the `fit-content` KEYWORD (no argument), which
  is NOT valid in grid tracks.
- **Used in:** `grid-template-columns/rows`, `grid-auto-columns/rows`; also `width`, `height`, `min-*`, `max-*`
  (support varies there).
- **Values:** `<length>` (`200px`, `30vw`, `100ch`) · `<percentage>` (of the container's inline size for columns, block
  size for rows).
- **Example (MDN):**
  ```css
  #container { display: grid; grid-template-columns: fit-content(300px) fit-content(300px) 1fr; grid-gap: 5px; }
  ```
  Try-it: `fit-content(8ch) fit-content(8ch) 1fr` · `fit-content(40%) fit-content(40%) 1fr`.
- **Traps:** a `fit-content()` track never shrinks below its content minimum (longest word); it is an `auto`-like
  track, so it is not stretched like `auto`.
- **Baseline:** widely available for grid tracks; varies for box sizing.

## 18. Named lines — the `<line-names>` syntax

- **Sources:** the template pages + https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Named_grid_lines
- `[name]` before/after any track; `[a b]` = two names on one line; names are `<custom-ident>` (unquoted; not `span`,
  `auto`); the same name may appear on many lines.
- Reference: `grid-column: content-start / content-end`; the Nth line of a name: `col-start 5`; span to a named line:
  `span 2 col1-start`.
- **Implicit areas from lines:** lines `main-start` + `main-end` on both axes → `grid-area: main` works with no areas
  template. **Implicit lines from areas:** area `hd` → `hd-start`, `hd-end` on both axes.
- **Example (MDN, a 12-column frame):**
  ```css
  .wrapper { display: grid; gap: 10px; grid-template-columns: repeat(12, [col-start] 1fr); }
  .main-header, .main-footer { grid-column: col-start / span 12; }
  .side1   { grid-column: col-start / span 3;    grid-row: 2; }
  .content { grid-column: col-start 4 / span 6;  grid-row: 2; }
  .side2   { grid-column: col-start 10 / span 3; grid-row: 2; }
  ```
- **Traps:** a name that does not exist does not fail — it is resolved as if every IMPLICIT line had that name, so the
  item lands in (and creates) implicit tracks far from where it was meant. Names are case-sensitive.

---

## 19. Value catalogue — one line and an example each

### Track sizes (any `grid-template-*` / `grid-auto-*` track)
| Kind | Meaning | Example |
|---|---|---|
| length | fixed size (use `rem`) | `grid-template-columns: 20rem 1fr` |
| percentage | of the container (inline for columns, block for rows), gaps not subtracted; `auto` if the size is indefinite | `25% 75%` |
| `fr` | share of the leftover space; alone = `minmax(auto, Nfr)` | `1fr 2fr 1fr` |
| `auto` | content-sized range, stretched by `justify/align-content` | `auto 1fr` (label column) |
| `min-content` | narrowest without overflow (longest word) | `min-content 1fr` |
| `max-content` | widest without wrapping | `max-content 1fr` |
| `minmax(a, b)` | between a and b; flex only in b | `minmax(12rem, 1fr)` |
| `fit-content(x)` | content-sized, capped at x | `fit-content(30ch) 1fr` |
| `repeat(N, …)` | N copies of a fragment (with names) | `repeat(3, minmax(0, 1fr))` |
| `repeat(auto-fill, …)` | as many as fit, empty tracks KEPT | `repeat(auto-fill, minmax(10rem, 1fr))` |
| `repeat(auto-fit, …)` | as many as fit, empty tracks COLLAPSED | `repeat(auto-fit, minmax(min(100%, 15rem), 1fr))` |
| `subgrid` | the parent's tracks for the spanned range | `grid-template-rows: subgrid` |
| `none` | no explicit tracks; all implicit | `grid-template-columns: none` |
| pattern (auto tracks) | repeating list of implicit sizes | `grid-auto-rows: minmax(6rem, auto) 12rem` |

### Placement (any of the four line properties)
| Kind | Meaning | Example |
|---|---|---|
| line number | the Nth line from the start | `grid-column: 2 / 4` |
| negative line | Nth from the END of the explicit grid | `grid-column: 1 / -1` |
| `span N` | N tracks from the other edge | `grid-column: 2 / span 3` · `grid-row: span 2 / 7` |
| named line | first line called that (or `x-start`/`x-end`) | `grid-column: content-start / content-end` |
| named line with index | the Nth line with that name | `grid-column: col-start 4 / col-start 10` |
| span to a named line | span until the Nth line with that name | `grid-column: col1-start 2 / span 2 col1-start` |
| area name | all four edges of an area (`-start`/`-end` lines) | `grid-area: main` |
| `auto` | auto-placement, span 1 | `grid-row: auto` |
| auto start + span | placed by the flow, sized by span | `grid-column: auto / span 2` |

### Auto-flow modes
| Mode | Meaning | Example |
|---|---|---|
| `row` | fill across, add rows (default) | `grid-auto-flow: row` |
| `column` | fill down, add columns | `grid-template-rows: repeat(4, auto); grid-auto-flow: column` |
| `row dense` / `dense` | across, back-filling holes | gallery with `span 2` tiles |
| `column dense` | down, back-filling holes | `grid-auto-flow: column dense` |
| shorthand form | `grid: auto-flow dense 10rem / repeat(3, 1fr)` | rows auto 10rem, dense |

---

## 20. What a builder must store to reproduce any of it

A minimal data model that can express EVERY value above (and emit `rem`/`%` per rule 16). Builder names are
suggestions; what exists today is in `07-grid.md` (`colStart` / `rowStart` / spans, `repeat(N, minmax(0, 1fr))`,
`GRID_MAX = 12`, per-rung `ResponsiveOverride`).

```ts
// ---- track sizes ----
type Breadth =
  | { kind: 'length'; rem: number }            // stored in rem, never px
  | { kind: 'percent'; value: number }
  | { kind: 'fr'; value: number }              // only valid as a max / alone
  | { kind: 'auto' } | { kind: 'min-content' } | { kind: 'max-content' };
type TrackSize =
  | { kind: 'breadth'; breadth: Breadth }
  | { kind: 'minmax'; min: Breadth /* not fr */; max: Breadth }
  | { kind: 'fit-content'; limit: { rem: number } | { percent: number } };
type TrackEntry =
  | { kind: 'track'; size: TrackSize; namesBefore?: string[] }
  | { kind: 'repeat'; count: number | 'auto-fill' | 'auto-fit';
      tracks: { size: TrackSize; namesBefore?: string[] }[]; namesAfter?: string[] };
type TrackList =
  | { kind: 'none' }
  | { kind: 'list'; entries: TrackEntry[]; namesAtEnd?: string[] }
  | { kind: 'subgrid'; lineNames?: (string[] | { repeat: number | 'auto-fill'; names: string[][] })[] };

// ---- container ----
interface GridContainer {
  display: 'grid' | 'inline-grid' | 'grid-lanes' | 'inline-grid-lanes';
  columns: TrackList;  rows: TrackList;
  areas?: (string | null)[][];      // matrix: rows × columns, null = '.'; validated: same width, rectangles
  autoColumns: TrackSize[];         // default [auto]; a list = repeating pattern
  autoRows: TrackSize[];
  autoFlow: { direction: 'row' | 'column'; dense: boolean };
  // gaps + alignment: the other researcher's file
}

// ---- item placement ----
type Line =
  | { kind: 'auto' }
  | { kind: 'line'; index: number /* ≠ 0, negative = from the explicit end */; name?: string }
  | { kind: 'name'; name: string }                     // resolves via name / name-start / name-end
  | { kind: 'span'; count: number /* ≥ 1 */; name?: string };
interface GridPlacement {
  rowStart: Line; rowEnd: Line; colStart: Line; colEnd: Line;  // or { area: string } as sugar
  zIndex?: number;                                           // overlaps
}
// Per rung: every field above may be overridden per breakpoint (the builder's ResponsiveOverride).
```

Rules the model must enforce or the export goes invalid / surprising:
1. `fr` never as a `minmax()` minimum; never in `calc()`.
2. At most one auto-repeat per list; with one, every other entry is fixed (length / % / minmax with a fixed side), and
   the auto-repeated size has a definite min or max.
3. No `repeat()` inside the ASCII-art `grid-template` form — the export should write longhands.
4. `areas`: every name a rectangle, every row the same length — validate on edit, or the browser drops the template.
5. Line index `0` and `span 0` are invalid; a missing name silently goes to implicit tracks — validate names exist.
6. `subgrid` only on an item that is a grid AND spans tracks in that axis; no implicit tracks there.
7. Writing the `grid` shorthand resets five properties — the export should write longhands.
8. Sizes stored in `rem` / `%` / `fr` / keywords only (rule 16; `px` never stored).

---

## 21. The traps that matter most (summary)

1. **`1fr` is `minmax(auto, 1fr)`** — content minimums make "equal" columns unequal; write `minmax(0, 1fr)`.
2. **Shorthands reset silently** — `grid` resets six longhands (not gaps), `grid-template: R / C` resets the areas;
   `grid-area: 2` leaves the end `auto`, `grid-area: main` sets all four.
3. **Negative lines and `1 / -1` reach only the EXPLICIT grid** — with no explicit template, `-1` is line 1; implicit
   tracks are unreachable by negatives.
4. **An invalid areas template (non-rectangle, uneven rows) or a misspelt line name fails silently** — the first drops
   the whole declaration, the second sends the item into new implicit tracks.
5. **Visual order ≠ reading order** with `dense`, explicit placement, `grid-auto-flow: column`, areas reshuffled per
   breakpoint and grid lanes — screen readers and Tab follow the source (WCAG 1.3.2 / 2.4.3); and line 1 is on the
   RIGHT in RTL languages.
Also: `auto-fill` vs `auto-fit` differ only when items are few; `%` tracks ignore gaps; `repeat(auto-fit, minmax(Xrem,
1fr))` overflows below X without `min(100%, X)`; subgrid makes no implicit tracks; masonry is now `display: grid-lanes`
and is not Baseline.
