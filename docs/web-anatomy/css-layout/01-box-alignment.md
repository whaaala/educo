# CSS Box Alignment — every property, every value, every layout mode

Research for the website builder (RULE R · RULE MAP step 1: the axes and their values). Source: MDN, read 2026-10-04,
plus MDN's own browser-compat-data (BCD, the data behind every MDN compatibility table) for exact versions.
This file EXTENDS what is already stored; where a stored file already covers a point correctly it is linked, not repeated:

- `docs/web-anatomy/advanced-css/06-trillo-flexbox.md` — flex `justify-content` / `align-items` / `align-content` /
  `align-self` as taught in the course, the auto-margin pattern (stars + `margin-right: auto`), axis swap after
  `flex-direction: column`, and the builder's `FlexJustify` / `FlexAlign` / `alignSelf` mapping and ledger line **AC-25**
  (`space-evenly` + `baseline` missing from the builder).
- `docs/web-anatomy/advanced-css/07-grid.md` — grid `align/justify-items`, `-self`, `-content` as taught, the
  "`-items`/`-self` align items, `-content` aligns tracks" naming logic, and *Place in the cell*.
- `docs/web-anatomy/page-grid/01-builders-and-systems.md` — axis A6 "alignment of the grid in its frame" (stretch /
  centre / start / end as Figma, MDC and Framer expose it).

**A note on method.** WebFetch returns the page through a small model. Where one pass added material that is not on the
page (an invented overflow example on the Overview, an invented "what works where" table on the block guide, invented
code samples on `<content-distribution>`), the page was fetched again with a quote-only prompt and only what the page
says is stored here. Those cases are marked in the table.

---

## 1. Completeness table

| # | URL | Read fully? | Notes |
|---|-----|-------------|-------|
| 1 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content | yes | user's link; all values, 3 examples, description per layout |
| 2 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-items | yes | user's link; incl. `legacy`, `anchor-center` |
| 3 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-self | yes | |
| 4 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-content | yes | incl. block/flex/grid/multicol demo |
| 5 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-items | yes | |
| 6 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-self | yes | |
| 7 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-content | yes | |
| 8 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-items | yes | |
| 9 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-self | yes | |
| 10 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap | yes | incl. percentage-gap examples |
| 11 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/row-gap | yes | |
| 12 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/column-gap | yes | |
| 13 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment (module landing) | yes | lists 9 properties, 5 data types, 6 terms, 5 guides |
| 14 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/Overview | yes (2 passes) | 1st pass invented an overflow code example; 2nd pass quoted the page — no such example exists |
| 15 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_flexbox | yes | |
| 16 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_grid_layout | yes | |
| 17 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_multi-column_layout | yes | short page, no code examples on it |
| 18 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_block_abspos_tables | yes (2 passes) | 1st pass invented a summary table; 2nd pass quoted the sentences. Its "no browser support in block layout" sentence is OUT OF DATE vs BCD (see §3) |
| 19 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Aligning_items | yes | linked from every property page |
| 20 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Box_alignment | yes | linked from the grid guide |
| 21 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/content-distribution | partly | definitions and fallbacks read; the code samples returned looked invented and are NOT stored |
| 22 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/content-position | yes | |
| 23 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/self-position | yes | |
| 24 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/baseline-position | yes | |
| 25 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/overflow-position | yes | |
| 26 | https://developer.mozilla.org/en-US/docs/Glossary/Alignment_Container | yes | |
| 27 | https://developer.mozilla.org/en-US/docs/Glossary/Alignment_Subject | yes | subject per layout mode |
| 28 | https://developer.mozilla.org/en-US/docs/Glossary/Fallback_Alignment | yes | |
| 29 | https://developer.mozilla.org/en-US/docs/Glossary/Main_Axis | yes | |
| 30 | https://developer.mozilla.org/en-US/docs/Glossary/Cross_Axis | yes | |
| 31 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Gaps (CSS gaps module) | yes | gap + gap-decoration (`rule-*`) property list |
| 32 | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Gaps/Defining_gaps | yes | percentage gaps in intrinsic sizing |
| 33 | BCD `css/properties/align-content.json` (github.com/mdn/browser-compat-data) | yes | block / multicol context versions |
| 34 | BCD `justify-content.json` | yes | |
| 35 | BCD `justify-self.json` | yes | block_context experimental, abspos context |
| 36 | BCD `justify-items.json` | yes | |
| 37 | BCD `align-self.json` | yes | |
| 38 | BCD `align-items.json` | yes | |
| 39 | BCD `gap.json` | yes | flex_context = Chrome 84 |
| — | Anchor positioning (`anchor-center` "Centering on the anchor") | not followed | off-topic for box alignment proper — belongs to anchor positioning research; the value is recorded here |
| — | `rule`, `row-rule`, `column-rule` property pages | not followed | gap DECORATIONS, a separate family (colour/line), listed in §4.12 only |
| — | `vertical-align`, `scroll-snap-align`, SVG `alignment-baseline` / `dominant-baseline` | not followed | named in "related concepts" but not box alignment |
| — | Flexbox / Grid / Multicol module guides beyond alignment | not followed | off-topic; covered by 06/07 and later files |

Pages failed: none. Pages partial: 1 (`<content-distribution>` — examples untrusted).

---

## 2. The model in plain words

### 2.1 Two axes, named by writing, not by screen

Alignment never says "top/left". It says **start / end** along two axes, so the same CSS works in English, Arabic and
vertical Japanese:

- **Inline axis** — the direction words run in a line (horizontal in English, right-to-left in Arabic). Properties
  starting **`justify-`** work on it.
- **Block axis** — the direction paragraphs stack (top to bottom in English). Properties starting **`align-`** work on it.

**Flexbox renames them.** A flex container has a **main axis** (the way `flex-direction` points) and a **cross axis**
(perpendicular). In flex, `justify-content` always works on the MAIN axis and `align-*` on the CROSS axis — so after
`flex-direction: column`, `justify-content` moves things vertically and `align-items` horizontally (06 covers this).
Grid never swaps: `justify-*` is always inline, `align-*` always block.

The only physical words allowed are **`left` / `right`**, and only in `justify-*` (they are excluded from
`<content-position>` / `<self-position>` because `align-*` cannot take them). On an axis that is not horizontal they
behave as `start`.

### 2.2 Subject and container

- **Alignment subject** = the thing being moved.
  - For `justify-self` / `align-self` (and `-items`, which just sets every child's `-self`): the item's **margin box**.
  - For `justify-content` / `align-content`, it depends on the layout:
    - block container (incl. table cells): the WHOLE content of the block, as one unit;
    - multicol: the column boxes;
    - flex: `justify-content` → the items in each flex line; `align-content` → the flex LINES (only multi-line);
    - grid: the TRACKS (columns for `justify-content`, rows for `align-content`); the space inserted between tracks is
      added to the gutters.
- **Alignment container** = the rectangle it is moved inside — usually the subject's containing block (a grid area for a
  grid item, the flex line for a flex item, the inset-modified containing block for an absolutely positioned box), in
  the writing mode of the box that establishes it.

### 2.3 Three families of property (the real axis of this module)

| Family | Properties | Set on | Moves | Grid | Flex | Block |
|---|---|---|---|---|---|---|
| **Content distribution** | `justify-content`, `align-content` (`place-content`) | the container | the whole group (tracks / lines / items-as-a-group) inside the container's free space | aligns TRACKS | justify: items on the main axis; align: LINES (wrap only) | `align-content` only — moves the whole content up/down |
| **Self alignment** | `justify-self`, `align-self` (`place-self`) | the item | one item inside its own alignment container | inside its grid area | `align-self` only; **`justify-self` IGNORED** | `justify-self` (spec; Chrome only, experimental); `align-self` does NOT apply |
| **Default alignment** | `justify-items`, `align-items` (`place-items`) | the container | sets the `auto` value of every child's `-self` | both work | `align-items` only; **`justify-items` IGNORED** | `justify-items` (same Chrome-only status) |

**Why flex ignores `justify-items` / `justify-self`:** flexbox lays the items out as ONE group on the main axis — it
adds their sizes, then hands the leftover to `justify-content`, which moves the group. There is no per-item slot to
align inside. On the cross axis each item does have its own room in the line, so `align-self` makes sense. To move ONE
flex item on the main axis, use an **auto margin**.

### 2.4 Three kinds of value

- **Positional**: `start`, `end`, `center`, `self-start`, `self-end`, `flex-start`, `flex-end`, `left`, `right`
  (+ `anchor-center` for anchor-positioned boxes). All logical except `left`/`right`.
- **Baseline**: `baseline` (= `first baseline`), `first baseline`, `last baseline`. Lines up the TEXT baselines of boxes
  in a shared row. Self-alignment does it by adding **margin outside** the boxes; content alignment (`align-content:
  baseline`) does it by adding **padding inside** them. Fallback when a box has no baseline-sharing group:
  `first baseline` → `safe self-start` (self) / `safe start` (content); `last baseline` → `safe self-end` / `safe end`.
- **Distributed** (`<content-distribution>`, only `-content` properties): `space-between`, `space-around`,
  `space-evenly`, `stretch`. They need free space; with none there is nothing to distribute. Each has a **fallback**
  used when it cannot apply (e.g. one subject):

  | value | one subject → | fallback |
  |---|---|---|
  | `space-between` | flush to start | `flex-start` (flex) / `start` — MDN's type page writes `safe flex-start` |
  | `space-around` | centred | `safe center` |
  | `space-evenly` | centred | `safe center` |
  | `stretch` | fills if it can grow | `flex-start` / `start` |

### 2.5 `normal`, `stretch` and `auto` — the defaults

- `-self: auto` means "take my parent's `-items`". On an absolutely positioned box, or a box with no parent, `auto`
  behaves as `normal`.
- `normal` means "whatever this layout mode does by default":

  | Mode | `align-self` / `align-items: normal` | `justify-self` / `justify-items: normal` |
  |---|---|---|
  | Grid item | like `stretch`, BUT `start` for boxes with an aspect ratio or intrinsic size (images) | same |
  | Flex item | `stretch` | ignored |
  | Block-level box | does not apply | `start` |
  | Abspos box | `stretch`, but `start` for replaced elements (img, video) | same |
  | Abspos static position | `stretch` | — |
  | Table cell | does not apply | ignored |

- `justify-content: normal` behaves as `stretch`; in flex `stretch` behaves as `flex-start` (main-axis growth is
  `flex-grow`'s job), so in flex `normal` = start. In multicol with a non-`auto` `column-width`, `normal` keeps the
  columns at that width instead of stretching.
- `align-content: normal` = "as if not set" (for flex lines that means `stretch`; for a block, content at the top).
- `stretch` on an item only grows an item whose size in that axis is **`auto`** — a set `height`/`width` cancels it,
  and it falls back to `flex-start` (or `self-start`/`self-end` if the container is baseline-aligned). It respects
  `max-width`/`max-height`. Content-distribution `stretch` grows auto-sized subjects **equally, not proportionally**.
- `justify-items` has initial value **`legacy`**: on its own it behaves like `normal`; `legacy left|right|center` is
  INHERITED by descendants whose `justify-self` is `auto` (the old `<center>`/`align` attribute behaviour). It is the
  only box-alignment value that inherits.

### 2.6 Auto margins

An `auto` margin swallows all free space on its side, and it is applied BEFORE alignment: `justify-content` only
distributes what is left after auto margins (and after `flex-grow`). So:
- Flex: `margin-left: auto` on one item pushes it and everything after it to the end (split navigation). A cross-axis
  `auto` margin makes `align-self` ignored for that item.
- Grid: `margin-left: auto` pushes an item to the end of its area; `margin-inline: auto` centres it.
- Block: `margin-inline: auto` on a box with a width centres it — the oldest centring method, still the block answer.
- Physical margins (`margin-left`) do not follow writing mode; use `margin-inline-start` for logical behaviour.

### 2.7 Overflow: `safe` and `unsafe`

When the subject is BIGGER than its container, `center`/`end` push part of it past the START edge — where no scrollbar
can reach it ("data loss"). `safe center` falls back to `start` in that case so everything stays reachable; `unsafe`
honours the alignment anyway. With neither keyword, the default is "a blend of the two" (MDN, `<overflow-position>`):
browsers mostly behave unsafe in visible overflow but keep scrollable content reachable. Only positional values take the
prefix (not distributed values, not baseline). Support: Chrome 115, Firefox 63, Safari 17.6 (before Chrome 115 it parsed
but did nothing).

### 2.8 Gap — fixed gutters between items, never around them

`gap` (`row-gap` + `column-gap`) puts a fixed space BETWEEN adjacent items/tracks/columns; never before the first or
after the last; margins and distributed alignment ADD to it (the visible space can be larger than the gap).
- **Grid:** each gutter acts as an extra fixed-size empty track; an item spanning 2 tracks of 100px with `gap: 10px` is
  210px. Collapsed tracks have no gutter.
- **Flex:** in a row container `column-gap` is between items and `row-gap` between wrapped lines; in a column container
  `row-gap` is between items and `column-gap` between lines. (Rule of thumb: `row-gap` is always the block-axis gap.)
- **Multicol:** `column-gap` between column boxes; default `normal` = **1em** (everywhere else `normal` = 0); `row-gap`
  only matters when `column-height` makes rows of columns. Space from `justify-content` is added to the column gaps.
- **Percentages** resolve against the container's content box in that axis — so `gap: 5%` on a 300×600 box is 30px
  between rows and 15px between columns (NOT equal). If the container's size is not definite (auto height), a % gap
  is treated as 0 while sizing: grid then overflows by the late gap; flex column % gaps resolve to 0.
- Old names `grid-gap`, `grid-row-gap`, `grid-column-gap` are aliases.

---

## 3. Support in BLOCK and ABSPOS layout — the newest part of the module

The MDN block guide still says "we do not currently have browser support for box alignment in block layout". BCD (the
compat data MDN itself publishes) says that is out of date:

| Feature | Chrome | Firefox | Safari | Status |
|---|---|---|---|---|
| `align-content` on block containers (`block_context`) | 123 | 125 | 17.4 | all three engines since April 2024 |
| `align-content` on multicol (`multicol_context`) | 123 | — | 17.4 | not in Firefox |
| `justify-self` / `justify-items` on block-level boxes (`block_context`) | 130 | — | — | experimental, Chrome only |
| `justify-self` / `align-self` on absolutely positioned boxes (`position_absolute_context`) | 122 | 134 | 26 | all three engines since Safari 26 (2025) |
| `anchor-center` | 125 | 147 | 26 | with anchor positioning |
| `gap` in flex (`flex_context`) | 84 | 63 | 14.1 | the late one: flex gap arrived in 2020–2021 |

What this means for a builder: **a block with a set height can centre its content vertically with just
`align-content: center`, no flex and no wrapper** — supported everywhere since 2024. Do not use `justify-self` on block
boxes yet (Chrome-only); use `margin-inline: auto`.

---

## 4. Property by property

Every property below: Inherited **no** · Computed value **as specified** · Animation type **discrete** (except the gaps,
which animate as length/percentage/calc). Global values `inherit` · `initial` · `revert` · `revert-layer` · `unset` apply
to all and are not repeated.

### 4.1 `justify-content`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content
- **Initial:** `normal` · **Applies to (MDN table):** flex containers — the description adds grid and multicol
  containers, and says it has NO effect on block containers (and table cells).
- **Syntax:** `normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]`
- **Values:**
  - `start` / `end` — packed flush to the start / end edge of the container on the axis.
  - `flex-start` / `flex-end` — packed to the flex container's main-start / main-end (these follow `row-reverse`);
    outside flex = `start` / `end`.
  - `center` — packed together in the middle.
  - `left` / `right` — packed to the physical left / right; on an axis not parallel to inline (flex column) = `start`.
  - `normal` — behaves as `stretch` (so as `start` in flex); multicol with non-`auto` `column-width` keeps that width.
  - `space-between` — equal space between neighbours, first and last flush to the edges; one item → at the start.
  - `space-around` — equal space between, half that space at each end; one item → centred.
  - `space-evenly` — every space equal, ends included; one item → centred.
  - `stretch` — auto-sized subjects grow EQUALLY to fill (respecting max sizes); in flex behaves as `flex-start`.
  - `safe <pos>` — if overflowing, align as `start`. `unsafe <pos>` — honour regardless.
  - No baseline values (`justify-content` takes no part in baseline alignment).
- **Grid:** distributes space between/around COLUMNS (tracks), not items — only when the grid is narrower than its
  container. Only `auto` tracks are stretched by `stretch`/`normal`; since an `auto` track already takes the remaining
  space, with any `auto` track there is usually nothing to distribute. Items that span tracks grow by the inserted space.
  Overflowing items do not change the column justification.
- **Flex:** distributes POSITIVE free space along the main axis, per line, after lengths and auto margins. If any item
  in the line has `flex-grow > 0`, there is no free space and it does nothing on that line.
- **Multicol:** values other than `normal`/`stretch` make the column boxes take their `column-width`, and the rest is
  distributed — added to `column-gap`.
- **Block / abspos:** no effect.
- **Example:**

  ```html
  <nav class="bar"><a href="#">Home</a><a href="#">News</a><a href="#">Contact</a></nav>
  ```
  ```css
  .bar { display: flex; justify-content: space-between; gap: 1rem; }
  /* grid: three 8rem columns spread across a wider box */
  .cols { display: grid; grid-template-columns: repeat(3, 8rem); justify-content: space-evenly; }
  ```
  MDN's own grid example: a 500px grid of three 80px columns has 260px free; `space-evenly` → 65px before, between and
  after each column.
- **Traps:** (1) `flex: 1` on any item disables it. (2) A grid whose tracks are `1fr` already fills, so it does nothing.
  (3) `space-between` with ONE item puts it at the start, while `space-around`/`space-evenly` centre it — a wrapped last
  line of a flex row behaves differently per value. (4) `safe center` is the correct choice for a centred row that might
  overflow on a phone (otherwise the first item is cut off and unscrollable).
- **Support:** Baseline widely available since September 2015. `space-evenly` Chrome 60 / Firefox 52 / Safari 11;
  `start`/`end` in flex Chrome 93 / Firefox 45 / Safari 15.4; `left`/`right` Chrome 93 / Firefox 52 / Safari 9;
  `safe`/`unsafe` Chrome 115 / Firefox 63 / Safari 17.6.

### 4.2 `align-content`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-content
- **Initial:** `normal` · **Applies to:** block containers, multi-column containers, flex containers (and grid).
- **Syntax:** `normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>`
- **Values:** `normal` (packed as if unset) · `start` · `center` · `end` · `flex-start` / `flex-end` (cross-start /
  cross-end in flex; else start/end) · `baseline` / `first baseline` / `last baseline` (fallback `start` / `end`) ·
  `space-between` · `space-around` · `space-evenly` · `stretch` (auto-sized subjects grow equally) · `safe` / `unsafe`.
  No `left` / `right`.
- **Grid:** aligns the ROW tracks on the block axis when the rows are shorter than the container (a fixed-height grid).
  `space-between` etc. make items that span rows TALLER (they absorb the inserted space).
- **Flex:** aligns the LINES on the cross axis. **No effect on a single-line container (`flex-wrap: nowrap`).**
  `normal` behaves as `stretch` — the lines share the extra height.
- **Block:** moves the block's whole content on the block axis (`center` = vertical centring inside a box with a
  height). Distributed values fall back (the content is ONE subject): `space-between` → start, `space-around` /
  `space-evenly` → centre. Supported Chrome 123 / Firefox 125 / Safari 17.4.
- **Multicol:** aligns the column boxes on the block axis (Chrome 123 / Safari 17.4; not Firefox).
- **Example:**

  ```html
  <section class="hero"><h1>Welcome</h1><p>Term starts 8 January.</p></section>
  ```
  ```css
  .hero { min-height: 60vh; align-content: center; } /* block layout, no flex, content centred vertically */
  .gallery { display: flex; flex-wrap: wrap; height: 30rem; align-content: space-between; }
  ```
- **Traps:** (1) Forgotten `flex-wrap: wrap` → no effect. (2) No free space (auto height) → no effect; it needs a
  container taller than its content. (3) In block layout distributed values silently become start/centre.
  (4) `last baseline` is parsed but has no effect in Chrome / Safari for `align-content` (BCD).
- **Support:** Baseline widely available since September 2015 (flex/grid); block context 2024 as above; `start`/`end`
  Chrome 93 / Firefox 45 / Safari 15.6; `safe`/`unsafe` Chrome 115 / Firefox 63 / Safari 17.6.

### 4.3 `justify-items`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-items
- **Initial:** `legacy` · **Applies to:** all elements.
- **Syntax:** `normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] |
  legacy | legacy && [ left | right | center ]`
- **Values:** `normal` (see §2.5) · `stretch` · `start` · `end` · `center` · `flex-start` / `flex-end` (= start / end
  outside flex) · `self-start` / `self-end` (flush to the side that is the ITEM's own start/end — differs when the item
  has a different `direction`/writing mode) · `left` / `right` · `anchor-center` (centre on the anchor, inline axis) ·
  `baseline` / `first baseline` / `last baseline` · `safe` / `unsafe` · `legacy` (+ `left|right|center`: inherited by
  descendants with `justify-self: auto`).
- **Grid:** sets every item's inline-axis alignment inside its grid area (default `normal` → stretch, images → start).
- **Flex:** **IGNORED.** Table cells: ignored.
- **Block:** aligns block children inside their containing block on the inline axis — Chrome 130 only, experimental.
- **Abspos:** aligns inside the containing block, accounting for the inset values.
- **Example:** `.cards { display: grid; grid-template-columns: 1fr 1fr; justify-items: center; }` — each card shrinks to
  its content width and sits in the middle of its column (MDN demo: `stretch` → `center` on hover).
- **Traps:** setting it on a flex container does nothing; `place-items: center` on a flex container only centres the
  cross axis.
- **Support:** Baseline widely available since July 2016 (grid Chrome 57 / Firefox 45 / Safari 10.1).

### 4.4 `justify-self`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-self
- **Initial:** `auto` · **Applies to:** block-level boxes, absolutely-positioned boxes, grid items.
- **Syntax:** `auto | <overflow-position>? [ normal | <self-position> | left | right ] | stretch | <baseline-position> |
  anchor-center`
- **Values:** `auto` (parent's `justify-items`; abspos / no parent → `normal`) · `normal` · `stretch` · `start` · `end` ·
  `center` · `flex-start` / `flex-end` · `self-start` / `self-end` · `left` / `right` · `anchor-center` · baseline values
  (fallback start / end) · `safe` / `unsafe`.
- **Grid:** aligns the item inside its grid area on the inline axis.
- **Flex:** **IGNORED** — use `margin-inline-start: auto` (push to end) or `margin-inline: auto`.
- **Block:** aligns inside the containing block on the inline axis — Chrome 130 only (experimental); not for floats or
  table cells.
- **Abspos:** aligns inside the inset-modified containing block (Chrome 122 / Firefox 134 / Safari 26).
- **Example:**

  ```css
  .grid { display: grid; grid-template-columns: 1fr 1fr; }
  .grid .cta { justify-self: end; }        /* the button hugs the right edge of its column */
  .badge { position: absolute; inset: 0; justify-self: center; align-self: start; } /* centred tab at the top */
  ```
- **Traps:** an item with a fixed width and `stretch` stays its width; an image defaults to `start`, not stretch.
- **Support:** Baseline widely available since October 2017.

### 4.5 `align-items`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-items
- **Initial:** `normal` · **Applies to:** all elements.
- **Syntax:** `normal | stretch | <baseline-position> | <overflow-position>? <self-position>`
- **Values:** `normal` · `stretch` (auto cross-size fills the line, respecting min/max; a sized item falls back to
  `flex-start`) · `center` (margin box centred in the line; if bigger than the container it overflows equally both
  ways) · `start` · `end` · `self-start` · `self-end` · `flex-start` · `flex-end` · `anchor-center` · `baseline` /
  `first baseline` / `last baseline` (the item with the largest distance from its cross-start margin edge to its
  baseline sits flush with the line's cross-start; the others line up to it) · `safe` / `unsafe`. No `left`/`right`.
- **Grid:** block-axis alignment of every item in its area.
- **Flex:** cross-axis alignment of every item in its line. Default stretch = equal-height columns (06).
- **Block / table cells:** does not apply.
- **Example:**

  ```css
  .card-row { display: flex; gap: 1rem; align-items: stretch; }   /* cards all as tall as the tallest */
  .price-row { display: flex; align-items: baseline; gap: .5rem; } /* "£40" big and "/term" small on one baseline */
  ```
- **Traps:** `stretch` needs an auto cross size — a `height` on items stops it; `center` on content bigger than the
  container clips the top unless `safe center`.
- **Support:** Baseline widely available since September 2015. `last baseline` in flex: Chrome 108 / Firefox 52 /
  Safari 16.2; `start`/`end` in flex Chrome 93 / Firefox 45 / Safari 15.4; `safe`/`unsafe` Chrome 115 / Firefox 63 /
  Safari 17.6.

### 4.6 `align-self`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-self
- **Initial:** `auto` · **Applies to:** flex items, grid items, absolutely-positioned boxes. **Computed:** `auto` stays
  `auto` on abspos; otherwise becomes the parent's `align-items` (minus `legacy`), or `start` with no parent.
- **Syntax:** `auto | <overflow-position>? [ normal | <self-position> ] | stretch | <baseline-position> | anchor-center`
- **Values:** as `align-items`, plus `auto`.
- **Grid:** the item inside its area, block axis. **Flex:** the item in its line, cross axis — **ignored if the item has
  an `auto` cross-axis margin.** **Block-level boxes (incl. floats) and table cells:** does not apply (there is more
  than one item in the block axis). **Abspos:** aligns in the inset-modified containing block; `normal` → stretch
  (replaced → start).
- **Example (MDN):**

  ```css
  section { display: flex; align-items: center; height: 120px; }
  div:nth-child(3) { align-self: flex-end; } /* items 1-2 centred, item 3 at the bottom */
  ```
- **Support:** Baseline widely available since September 2015; abspos context Chrome 122 / Firefox 134 / Safari 26.

### 4.7 `place-content` (shorthand: `align-content` + `justify-content`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-content
- **Initial:** `normal normal` · **Applies to:** multi-line flex containers (and grid / multicol / block via the
  longhands).
- **Syntax:** `<'align-content'> <'justify-content'>?` — FIRST value is BLOCK (align), second is INLINE (justify). One
  value → used for both, and the declaration is **invalid if that value is not valid for both** (e.g. `place-content:
  baseline` or `place-content: left` is dropped entirely).
- **Examples (MDN):** `place-content: flex-end center` on a wrapping 240×240 flex box (lines at the bottom, centred);
  `place-content: end space-between` on a grid of two 60px columns in a 220px box.
- **Trap:** order is align-then-justify (vertical-then-horizontal in English) — the reverse of `x y` habits.
- **Support:** Baseline widely available since January 2020.

### 4.8 `place-items` (shorthand: `align-items` + `justify-items`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-items
- **Initial:** `normal legacy` · **Applies to:** all elements.
- **Syntax:** `<'align-items'> <'justify-items'>?` — one value is used for both.
- **Grid:** `place-items: center` centres every item in its cell both ways. **Flex:** only the align half works
  (cross axis); the justify half is ignored — use `justify-content` for the main axis.
- **Example:** `.tile { display: grid; place-items: center; }` — the shortest "centre one thing" there is.
- **Support:** Baseline widely available since January 2020.

### 4.9 `place-self` (shorthand: `align-self` + `justify-self`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/place-self
- **Initial:** `auto auto` · **Applies to:** block-level boxes, absolutely-positioned boxes, grid items.
- **Syntax:** `<'align-self'> <'justify-self'>?`; one value → both. `anchor-center` centres on the anchor in both axes.
- **Example (MDN):** in a 2-column grid, `place-self: start center` (top, centred across), `center start` (middle,
  left), `end` (bottom-right).
- **In flex:** only the align half has an effect.
- **Support:** Baseline widely available since January 2020.

### 4.10 `gap` (shorthand: `row-gap` + `column-gap`)

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap
- **Initial:** `normal normal` · **Applies to:** multi-column elements, flex containers, grid containers ·
  **Percentages:** the container's content box in that axis · **Animation:** length / percentage / calc.
- **Syntax:** `<'row-gap'> <'column-gap'>?` — one value for both; two = row then column.
- **Values:** `normal` (1em in multicol, 0 elsewhere) · `<length>` (≥ 0; negative is invalid) · `<percentage>` ·
  `calc()` · `<line-width>` keywords `thin` / `medium` / `thick` (and `hairline` in the grammar).
- **Behaviour:** §2.8. Grid example: `grid-template: repeat(3, 1fr) / repeat(3, 1fr); gap: 20px 5px`. Flex example:
  `flex-wrap: wrap; gap: 20px 5px` → 20px between lines, 5px between items. Multicol: `column-count: 3; gap: 40px`.
- **Example:**

  ```css
  .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: clamp(1rem, .75rem + 1vw, 2rem); }
  ```
- **Traps:** a single `%` gives unequal row/column gaps on a non-square box; `%` gaps in an auto-height container are 0
  while sizing (grid then overflows); a gap is not a margin — it never appears at the outer edges, which is exactly why
  a stacked row on a phone loses its side gap cleanly (06, hotel detail).
- **Support:** Baseline widely available since October 2017 (grid). **Flex `gap`: Chrome 84 / Firefox 63 / Safari 14.1**
  — the reason old code still uses margins between flex items. Multicol Chrome 66 / Firefox 61 / Safari 14.1.

### 4.11 `row-gap` and `column-gap`

- **MDN:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/row-gap ·
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/column-gap
- **Initial:** `normal` · **Applies to:** multi-column elements, flex containers, grid containers · **Computed:**
  lengths absolute, `normal` → 0 except multicol.
- **Syntax:** `normal | <length-percentage [0,∞]> | <line-width>`.
- `row-gap` = gutter on the BLOCK axis (between rows); `%` against the content box's block size (0 if not definite).
  `column-gap` = gutter on the INLINE axis; `%` against the inline size. In grid, cyclic % resolve against 0 for intrinsic
  sizing and against the content box for layout.
- Gutters may hold a decoration (`row-rule`, `column-rule`, `rule`) drawn in the middle; it never changes the gap size.
- Old aliases: `grid-row-gap`, `grid-column-gap`.
- **Examples (MDN):** grid 240px tall, 3 rows, `row-gap: 5%` → 12px gaps, 72px rows. Grid 400px wide, 3 columns,
  `column-gap: 5%` → 20px. Multicol `column-gap: thin`.
- **Support:** `row-gap` Baseline since October 2017; `column-gap` since July 2015 (multicol first).

### 4.12 The gap-decoration family (listed, not researched here)

The CSS Gaps module also defines `rule` (+ `rule-width` / `-style` / `-color` / `-break` / `-visibility-items` /
`-overlap` / `-inset*`) and per-axis `row-rule-*` / `column-rule-*` (incl. inset caps and junctions): lines drawn in the
middle of gaps, animatable, never changing the gap. A separate axis (decoration, not alignment) — to research with the
borders/dividers family.

---

## 5. What a person can do with alignment

| Everyday goal | Grid | Flex |
|---|---|---|
| Centre one thing in its box, both ways | container `place-items: center` (or item `place-self: center`) | container `justify-content: center; align-items: center` (or item `margin: auto`) |
| Centre a block's content vertically with NO flex/grid | — | — · block: `align-content: center` on a box with a height (2024+) |
| Centre a fixed-width block horizontally in normal flow | — | — · block: `margin-inline: auto` |
| Push the button to the bottom of a card | card `display: grid; grid-template-rows: auto 1fr auto` (or subgrid across cards) | card `display: flex; flex-direction: column`; button `margin-top: auto` |
| Card buttons level across a row of cards | `grid-template-rows: subgrid` on cards spanning 3 rows (07 / page-grid AC-36) | each card as above + row `align-items: stretch` (default) |
| Equal-height columns | default (`normal` → stretch) | default (`align-items: normal` → stretch) |
| Stop items stretching to the row height | `align-items: start` | `align-items: flex-start` |
| Spread items with space only between | `justify-content: space-between` (tracks narrower than container) | `justify-content: space-between` |
| Spread items with equal space everywhere | `justify-content: space-evenly` | `justify-content: space-evenly` |
| Logo left, links right | two columns `1fr auto`, or `justify-self: end` on the links | `justify-content: space-between`, or `margin-left: auto` on the links |
| Split nav: three left, two right | — | `margin-inline-start: auto` on the 4th item |
| Align ONE item to the end | item `justify-self: end` (across) / `align-self: end` (down) | across (main): `margin-inline-start: auto`; down (cross): `align-self: flex-end` |
| Align ONE item differently from the rest | item `align-self` / `justify-self` | item `align-self` (cross only) |
| Keep text baselines level across columns (price + unit, label + input) | `align-items: baseline` (rows) / `last baseline` for bottoms | `align-items: baseline` (or `last baseline`) |
| A whole small grid centred in a wide band | `justify-content: center` (with fixed/`auto`-free tracks) | `justify-content: center` |
| Rows of a fixed-height grid pushed to the bottom | `align-content: end` | `align-content: flex-end` (needs `flex-wrap: wrap`) |
| Wrapped lines spread top-to-bottom | `align-content: space-between` | `align-content: space-between` + `flex-wrap: wrap` |
| Centre but never cut content off on a small phone | `place-items: safe center` | `justify-content: safe center` / `align-items: safe center` |
| Image in a cell not distorted | default (aspect-ratio boxes → `start`); set `justify-self/align-self: stretch` + `object-fit` only on purpose | `align-self: flex-start` or `align-items: center` |
| Same gutter between all items, none at edges | `gap` | `gap` (flex gap: Chrome 84+) |
| Different gutters across and down | `gap: <row> <column>` | `gap: <row> <column>` (row = between lines in a row container) |
| A badge pinned top-centre over a card | — · abspos: `position: absolute; inset: 0; place-self: start center` (2025+) or `left: 50%; translate: -50%` | same |
| Right-to-left page keeps working | use `start`/`end`, never `left`/`right` | use `start`/`end` / `flex-start`, never `left`/`right` |

---

## 6. For the builder (pointers, not decisions)

- Already known gap **AC-25**: the line's distribution lacks `space-evenly` and its cross alignment lacks `baseline`
  (06). This research adds the full value lists the controls should map to: distribution `start · center · end ·
  between · around · evenly`; cross `stretch · start · center · end · baseline · last baseline`.
- New candidates for the ledger/map (to confirm against the code before filing): `safe` centring for rows that can
  overflow at 360px (RULE AF); block-level `align-content: center` as the zero-wrapper way to centre a band's content
  vertically; container-level `align-items`/`justify-items` for a whole grid (07 says PARTIAL); abspos `place-self` for
  pinned badges once Safari 26 share is high enough.
- Never emit `justify-items`/`justify-self` on a flex container expecting an effect, nor `left`/`right` (breaks RTL —
  RULE AF languages incl. Arabic).
