# CSS layout 04 — Flexbox (MDN, every guide and every property)

Read on 2026-10-04 from MDN (the user's two links first, then the Flexible box layout module, every guide it lists, every
flex property page, `display`, and the on-topic links inside them). This file EXTENDS
[`../advanced-css/06-trillo-flexbox.md`](../advanced-css/06-trillo-flexbox.md) — the Trillo course notes, which already
cover the vocabulary, the container/item cheat sheet, `align-self: stretch`, `margin-right: auto`, `flex: 0 0 18%` +
`flex: 1`, `order` on a phone, and `flex-wrap` + `flex: 0 0 50%` for a two-column list, each mapped to the builder. Where
that file is right, this one points to it instead of repeating it. What is NEW here: the sizing algorithm in numbers, the
automatic minimum size, `flex-basis: content` and the intrinsic keywords, `0` vs `0%`, `flex-wrap: balance` and
`flex-line-count`, `visibility: collapse`, `display: contents`, writing modes, `safe` alignment, and the accessibility rules
for reordering.

Alignment and gap properties (`justify-content`, `align-items`, `align-self`, `align-content`, `place-*`, `gap`) have their
own researcher/file; here they are explained only as they behave INSIDE a flex container.

---

## 1. Completeness table

| URL (developer.mozilla.org/en-US/docs/…) | Read fully? | Notes |
|---|---|---|
| Learn_web_development/Core/CSS_layout/Flexbox (user link) | yes | every section and example; § 2.1 |
| Web/CSS/Guides/Flexible_box_layout/Basic_concepts (user link) | yes | § 2.2 |
| Web/CSS/Guides/Flexible_box_layout (module landing) | yes | lists 12 properties incl. the new `flex-line-count`, 9 guides, related modules; § 2.0 |
| …/Flexible_box_layout/Relationship_with_other_layout_methods | yes | § 2.3 |
| …/Flexible_box_layout/Aligning_items | yes | § 2.4 |
| …/Flexible_box_layout/Ordering_items | yes | § 2.5 |
| …/Flexible_box_layout/Controlling_flex_item_ratios | yes | § 2.6 |
| …/Flexible_box_layout/Wrapping_items | yes | § 2.7 (includes `balance`, `flex-line-count`, `visibility: collapse`) |
| …/Flexible_box_layout/Use_cases | yes | § 2.8 |
| Web/CSS/Guides/Box_alignment/In_flexbox (listed as guide 9) | yes | § 2.9 |
| Web/CSS/Reference/Properties/flex | yes | § 3.1 |
| …/Properties/flex-basis | yes | § 3.2 |
| …/Properties/flex-grow | yes | § 3.3 |
| …/Properties/flex-shrink | yes | § 3.4 |
| …/Properties/flex-direction | yes | § 3.5 |
| …/Properties/flex-wrap | yes | § 3.6 |
| …/Properties/flex-flow | yes | § 3.7 |
| …/Properties/order | yes | § 3.8 |
| …/Properties/flex-line-count | yes | § 3.9 — experimental |
| …/Properties/display (flex, inline-flex, multi-keyword, contents, none) | partly — by design | read the flex-relevant parts in full (flex, inline-flex, `block flex`/`inline flex`, `contents`, `none`, accessibility, formal definition); the grid/table/list-item/ruby values belong to other files; § 3.10 |
| …/Properties/min-width (the `auto` value = automatic minimum size) | yes | § 3.11 / § 4 |
| Glossary/Flexbox | yes | a summary; nothing new beyond the property list |
| Learn page "Flexbox Froggy", CSS-Tricks guide (external) | not read | external, not MDN; outside this brief (the CSS-Tricks guide restates the same properties) |
| "display: contents considered harmful", Adrian Roselli, Léonie Watson (external a11y articles linked from MDN) | not read | external; their conclusion is quoted by MDN and recorded in §§ 2.3, 2.5, 3.5 |
| Alignment property pages (justify-content, align-items, align-self, align-content, gap…) | not read here | owned by the alignment/gap researcher, as instructed; their flex behaviour is taken from the flex guides |

Nothing else was skipped.

---

## 2. The guides

### 2.0 The module landing page — `/Web/CSS/Guides/Flexible_box_layout`

A box model "optimized for user interface design and the layout of items in one dimension": children of a flex container
can be laid out in any direction and can **flex** their sizes — grow into unused space or shrink to avoid overflow — and
both axes are easy to align.

- **Properties of the module (12):** `align-content`, `align-items`, `align-self`, `flex`, `flex-basis`, `flex-direction`,
  `flex-flow`, `flex-grow`, **`flex-line-count`** (new, experimental), `flex-shrink`, `flex-wrap`, `justify-content`.
- **From other modules:** `display` and `order` (CSS Display) · `justify-items`, `place-content`, `place-items` (Box
  Alignment) · `gap`, `row-gap`, `column-gap` (Gaps) · `aspect-ratio`, `min-content`, `max-content`, `fit-content` (Box
  Sizing).
- **Specs:** Flexible Box Layout Level 1 and **Level 2** (Level 2 adds `balance` and `flex-line-count`).
- Landing example: three items, `justify-content: space-between`; the tallest item sets the height of all (default
  `align-items: stretch`).

```html
<div class="box"><div>One</div><div>Two</div><div>Three <br />has <br />extra <br />text</div></div>
```
```css
.box { display: flex; justify-content: space-between; }
.box > * { padding: 1em; }
```

### 2.1 Learn: CSS layout — Flexbox (user link) — `/Learn_web_development/Core/CSS_layout/Flexbox`

**What it is for:** a one-dimensional layout for rows or columns, where items expand to fill space or shrink to fit. The
three problems it was made for: vertically centring a block in its parent; making all children share the width/height
equally whatever space there is; making every column of a multi-column layout the same height whatever its content.

**Concepts in plain words**
- `display: flex` on the PARENT makes it a **flex container**; its direct children become **flex items**. The container
  still behaves as a block on the page (`inline flex` / legacy `inline-flex` makes it sit inline).
- Two axes: the **main axis** (the way items are laid out; ends called *main start* / *main end*; an item's length on it is
  its *main size*) and the **cross axis** (perpendicular; *cross start* / *cross end*; *cross size*).
- Defaults alone give equal-height columns: three `article`s in a `section { display: flex }` sit side by side, all as tall
  as the tallest.
- `flex-direction: column` puts them back in a column; also `row-reverse`, `column-reverse`.
- **Wrapping:** five articles with `min-width: 400px` overflow a `nowrap` row; `flex-wrap: wrap` moves what does not fit to
  a new line, each line holding "as many as is sensible".
- **`flex-flow: row wrap`** = `flex-direction` + `flex-wrap`.
- **Flexible sizing:** `flex: 1` on every item = equal shares of the spare space "after padding and margin are set"; one
  item at `flex: 2` gets 2/4 when the others are 1 + 1. `flex: 1 100px` = each item first gets 100px, then the REST is shared
  1:1:2.
- **The shorthand** holds grow, shrink, basis; MDN advises against the longhands unless overriding something.
- **Alignment:** `align-items` (cross) default `normal`, which behaves as `stretch` in flex — that is why columns are equal
  height. `center` keeps intrinsic sizes and centres. Also `flex-start`/`self-start`/`start`, `flex-end`/`self-end`/`end`,
  `baseline` (first lines of text line up). `align-self` overrides it per item. `justify-content` (main) default `normal`
  = `start`; also `end`/`flex-end`, `left`/`right` (direction-dependent), `center`, `space-around`, `space-between`.
  **`justify-items` is ignored in flexbox.**
- **`order`:** default 0; higher appears later; equal values keep source order (values 2, 1, 1, 0 on four items show 4th,
  2nd, 3rd, 1st); negative values come first. **Tab order stays the source order** — reordering focusable items hurts
  keyboard users.
- **Nesting:** a flex item can itself be a flex container.

**Examples reduced to the minimum**

```html
<section><article>…</article><article>…</article><article>…</article></section>
```
```css
section { display: flex; }                 /* equal-height columns */
article { flex: 1 100px; }                 /* 100px each first, then share the rest */
article:nth-of-type(3) { flex: 2 100px; }  /* this one gets 2 shares of the rest */
```

```html
<div class="bar"><button>Smile</button><button>Laugh</button><button>Wink</button><button>Shrug</button><button>Blush</button></div>
```
```css
.bar { display: flex; height: 100px; align-items: center; justify-content: space-around; }
.bar button { width: 15%; }
.bar button:first-child { align-self: flex-end; }  /* one button to the bottom */
.bar button:last-child  { order: -1; }              /* visually first, still last in tab order */
```

Nested layout (the "complex" example):
```css
section { display: flex; }
article { flex: 1 170px; }
article:nth-of-type(3) { flex: 3 170px; display: flex; flex-flow: column; }
article:nth-of-type(3) div:first-child {
  flex: 1 100px; display: flex; flex-flow: row wrap; align-items: center; justify-content: space-around;
}
button { flex: 1 auto; margin: 5px; }      /* buttons fill each wrapped line */
```

**Traps:** the Learn page calls `flex-basis` "the minimum size". It is not: it is the STARTING size; with `flex-shrink: 1`
an item can go below it (down to its automatic minimum, § 4). The true floor is `min-width`/`min-height`.

### 2.2 Basic concepts of flexbox (user link) — `/Guides/Flexible_box_layout/Basic_concepts`

**Axes:** `flex-direction` sets the main axis — `row`/`row-reverse` run in the **inline** direction, `column`/`column-reverse`
in the **block** direction; the cross axis is perpendicular. Flexbox assumes no writing mode: it speaks of **start** and
**end**, not left/right. In English `row` starts at the left; in Arabic at the right; the cross start is the top in both.

**The container:** `display: flex` (= `block flex`) or `inline-flex` (= `inline flex`). Direct children become items.

**What the initial values do** (the most useful list on MDN):
- items in a row (`flex-direction: row`);
- items start at the main-start edge;
- items do NOT grow on the main axis but CAN shrink (`flex-grow: 0`, `flex-shrink: 1`);
- items STRETCH on the cross axis (`align-items: stretch` / `normal`);
- `flex-basis: auto` → the item's `width` (horizontal writing) or `height`; if that is `auto` too, the `content` size;
- one line (`flex-wrap: nowrap`) — items overflow if they cannot shrink enough.

**Multi-line:** with `flex-wrap: wrap`, treat **each line as its own flex container**: space is shared per line, with no
reference to other lines.

**Available space:** three 100px items in a 500px container need 300px; 200px is available, and by default it sits after
the last item. `flex-basis` decides the size an item is counted at; `flex-grow` shares positive space (all 1 → equal
shares; 2/1/1 → 2 parts of 4 to the first); `flex-shrink` removes space when it is short — a higher factor shrinks faster —
and **an item can only shrink to its `min-content` size**, which is why shrink looks less regular than grow. The factors
are ratios: `flex: 1 1 200px` with one at `flex: 2 1 200px` = `10 1 200px` with `20 1 200px`.

**Keyword shorthands:** `flex: initial` = `0 1 auto` · `flex: auto` = `1 1 auto` · `flex: none` = `0 0 auto` ·
`flex: <positive number>` = `<n> 1 0` (MDN's spec-accurate pages say `0%`, § 3.1).

**Alignment set on the container:** `align-items` (stretch · flex-start/start · flex-end/end · center · baseline · last
baseline), `justify-content` (flex-start · flex-end · start · end · left · right · normal · center · space-between ·
space-around · space-evenly · stretch), `justify-items` ignored, `place-items` sets only the align half in flex,
`place-content` = `align-content` + `justify-content` (`align-content` matters only when wrapping).

```html
<div class="box"><div>One</div><div>Two</div><div>Three <br />has <br />extra <br />text</div></div>
```
```css
.box { display: flex; }                                   /* initial behaviour */
.box { display: flex; flex-direction: row-reverse; }      /* reversed */
.box { width: 500px; display: flex; flex-wrap: wrap; } .box > * { width: 200px; }  /* wraps */
.box { width: 500px; display: flex; flex-flow: row wrap; }                          /* same, shorthand */
.box > * { flex: 1 1 auto; }                              /* grow from content size */
.box > * { flex: 1; }                                     /* equal widths */
.box { height: 130px; display: flex; align-items: flex-start; }
.box { display: flex; justify-content: flex-start; }
```

### 2.3 Relationship of flexbox to other layout methods — `/Guides/Flexible_box_layout/Relationship_with_other_layout_methods`

- **Box Alignment module:** the alignment properties are defined there for every layout; where it and the flexbox spec
  overlap, **Box Alignment wins**.
- **Writing modes:** flexbox follows `writing-mode` (`horizontal-tb`, `vertical-rl`, `vertical-lr`, `sideways-rl`,
  `sideways-lr`) — `row` runs along the inline direction whatever it is. Document language/direction belongs in HTML
  (`lang`, `dir` on `<html>`), not CSS, so it survives CSS not loading.
- **Floats and clearing do not apply to flex items**; `float` and `clear` are ignored, `vertical-align` has no effect (use
  flex alignment). A container of floats no longer collapses once it is `display: flex`.
- **Flex vs Grid:** flex is one-dimensional — wrapped lines are independent, so items in line 2 do not line up with line 1;
  sizing is set on the ITEMS. Grid is two-dimensional — tracks set on the CONTAINER, alignment kept across rows and
  columns. **Rule of thumb: if you are setting widths on flex items to make a wrapped row line up with the row above, you
  want Grid.** No fixed rule "flex for small, grid for big".

```css
/* flex: last line's items stretch */
.box { display: flex; flex-wrap: wrap; } .box > * { flex: 1 1 200px; }
/* grid: every cell the same column width */
.box { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, auto)); }
```

- **`display: contents`:** the element makes no box; its children take part in the parent's layout as if they were its
  children (so grandchildren become flex items, and the element's own background/border disappear; selectors like
  `.box > *` no longer match them).

```html
<div class="box"><div>One</div><div>Two</div>
  <div class="nested"><div>Sub-item 1</div><div>Sub-item 2</div></div></div>
```
```css
.box { display: flex; }
.nested { display: contents; }   /* Sub-items become flex items of .box */
```
**Accessibility warning (MDN):** some browsers wrongly drop an element with `display: contents` from the accessibility tree
(its descendants remain) — a `<ul>`, `<nav>`, `<button>` or heading loses its semantics. Never put it on a semantic or
interactive element.

### 2.4 Aligning items in a flex container — `/Guides/Flexible_box_layout/Aligning_items`

Properties: `justify-content` (main), `align-items` (cross, all items), `align-self` (cross, one item), `align-content`
(cross, the LINES), and `gap`/`row-gap`/`column-gap`.

**Values as listed for flex:**
- `justify-content`: flex-start · flex-end · start · end · left · right · center · space-between · space-around ·
  space-evenly · `stretch` (behaves as start in flex — items are not stretched; growth is `flex-grow`'s job) · `normal`
  (behaves as stretch → start).
- `align-items`: stretch (default) · flex-start · flex-end · start · end · center · baseline · first baseline · last
  baseline.
- `align-self`: the same + `auto` (take the container's `align-items`).
- `align-content`: flex-start · flex-end · start · end · center · space-between · space-around · space-evenly · stretch
  (default) · normal (= stretch) · baseline · first baseline · last baseline. **Only acts when there is more than one line
  and spare cross space.**

**Behaviour:**
- Centre anything: `display: flex; align-items: center; justify-content: center` — stays centred as either size changes.
- `stretch` only stretches items whose cross size is `auto` (an item with a set `height` keeps it).
- After `flex-direction: column` the cross axis is horizontal: `align-items` moves items left/right; `justify-content`
  needs a container height to do anything.
- `start`/`end` follow the writing mode; `flex-start`/`flex-end` follow the flex direction — with `row-reverse`,
  `flex-end` is the LEFT in English. With `direction: rtl`, `flex-end` is the left too.
- **Why no `justify-self`:** on the main axis items are handled as a GROUP (space is computed for all of them then
  distributed), so a per-item main-axis property would move every item after it as well. **Auto margins** do that job: an
  auto margin absorbs all free space on its side. `margin-left: auto` on item 4 of 5 pushes 4 and 5 right (split nav).
  Auto margins work on both axes (`margin-top: auto` in a column pushes an item to the bottom).
- **Gaps:** `column-gap` between items in a line, `row-gap` between lines (needs wrapping). Gaps sit only BETWEEN items —
  never before the first or after the last, never around the container edge.

```html
<div class="box"><div>One</div><div>Two</div><div>Three</div><div class="push">Four</div><div>Five</div></div>
```
```css
.box { display: flex; }
.push { margin-left: auto; }            /* Four and Five go right */
```
```css
/* lines spread through a tall wrapping container */
.box { width: 450px; height: 300px; display: flex; flex-wrap: wrap; align-content: space-between; }
.box > * { flex: 1 1 100px; }
/* one item stretches, one centres, the rest at the top */
.box { display: flex; align-items: flex-start; height: 200px; }
.box > *:first-child { align-self: stretch; }
.box .selected { align-self: center; }
/* gaps */
.box { display: flex; flex-wrap: wrap; row-gap: 10px; column-gap: 2em; } .box > * { flex: 1; }
```

**Trap (overflow + centring):** when an item is larger than its container, `justify-content: center` / `align-items:
center` push it out on BOTH sides, and the part past the start edge cannot be scrolled to (data loss). The Box Alignment
keyword `safe` (`align-items: safe center`) falls back to start when it would overflow; `margin: auto` also centres safely,
because auto margins never go negative. (The `safe`/`unsafe` keywords are on the alignment property pages.)

### 2.5 Ordering flex items — `/Guides/Flexible_box_layout/Ordering_items`

- **Reverse directions** (`row-reverse`, `column-reverse`) swap start and end — **only visually**; source order, tab order
  and speech order are unchanged. With links inside reversed items, Tab goes One → Two → Three while the screen shows
  Three Two One.
- **`order`** assigns ordinal groups: items sort by ascending `order`, ties keep source order; default 0; negatives allowed
  (`order: -1` = first without touching the rest).

```css
.box :nth-child(1) { order: 2; } .box :nth-child(2) { order: 3; } .box :nth-child(3) { order: 1; }
.box :nth-child(4) { order: 3; } .box :nth-child(5) { order: 1; }
/* shows 3, 5, 1, 2, 4 */
.active { order: -1; flex: 1 0 100%; }   /* in a wrapping row: the active item first, alone on its line */
```

- **The spec's rule (quoted by MDN):** authors **must not** use `order` or the `*-reverse` values as a substitute for
  correct source order — it can ruin accessibility. Keyboard focus jumps around; screen readers read source order.
  `order` also changes **paint order** (lower values painted first).
- **A legitimate use:** a news card whose date should LOOK above the heading but be READ after it:

```html
<div class="card"><h3>News item title</h3><div class="date">1 Nov 2017</div><p>Content…</p></div>
```
```css
.card { display: flex; flex-direction: column; }
.date { order: -1; text-align: right; }   /* seen first, read second — the heading stays first for AT */
```
- Guidelines: keep logical order = source order; test with the keyboard; keep the focus path sensible; use `order` only
  for visual tweaks that carry no meaning.

### 2.6 Controlling ratios of flex items along the main axis — `/Guides/Flexible_box_layout/Controlling_flex_item_ratios`

- **min-content** = the smallest an item can be: every soft wrap taken, the longest word is the width.
  **max-content** = the size with no wrapping at all.
- **Positive free space**: container bigger than the items' bases (500px container, three 100px items → +200px).
  **Negative free space**: the bases are too big (three 200px items in 500px → −100px).
- `flex-basis`: `auto` (the `width`/`height` if set, else the content's max-content size) · `content` (content size even if
  a width is set) · `0` (the item's own size is ignored when sharing) · a length or %.
- **`flex: 1 1 auto`**: items start at their content size and get equal EXTRA space — bigger items stay bigger.
  **`flex: 1 1 0`**: ALL the space is shared — same grow factor = same width, whatever the content.
- Grow factors 1, 1, 2 with basis 0: total 4, the third gets half.
- **`flex-shrink` is multiplied by the flex base size**: big items give up more pixels than small ones, so a small item is
  not crushed to 0 before a big one visibly shrinks; and **no item shrinks below its min-content**.
- Shrink factors 1, 0, 4 on three 200px items in 500px: the second never shrinks, the third shrinks about four times
  faster than the first.
- Without growing anything, free space can still be given away by `justify-content` or by auto margins.

```css
.box { width: 400px; display: flex; } .box > * { flex: 1 1 0; }        /* three equal widths */
.box { width: 500px; display: flex; } .box > * { flex: 0 0 auto; }
.box :first-child { width: 150px; }                                     /* basis auto takes the width */
.box { width: 500px; display: flex; } .box > * { width: 200px; }
.one { flex: 1 1 auto; } .two { flex: 1 0 auto; } .three { flex: 2 4 auto; }
```

MDN's checklist "what is the base size?": (1) basis auto + a width → the width; (2) basis auto, no width → the content size;
(3) basis a length/% → that value (and the item still cannot shrink below min-content); (4) basis 0 → the item's size does
not count in the sharing.

### 2.7 Mastering wrapping of flex items — `/Guides/Flexible_box_layout/Wrapping_items`

- `flex-wrap: wrap` (or `flex-flow: row wrap` / `column wrap`) lets items form new lines; `flex: 1 1 160px` items in 500px
  make lines that are then filled completely by growth. In a column with a fixed `height: 300px`, wrapping makes new
  COLUMNS.
- With `row-reverse` + `wrap`, items run right-to-left in each line, but the lines still stack top-to-bottom (only one
  axis is reversed; `wrap-reverse` reverses the lines).
- **Balanced wrapping (Level 2, new):** `flex-wrap: wrap balance` spreads items so the lines are as even as possible —
  ten 160px items in 500px become 3-3-2-2 instead of 3-3-3-1. **`flex-line-count: N`** sets a MINIMUM number of lines and
  only works with `balance` (5 → two per line for ten items). Guard with `@supports not (flex-wrap: balance)`.
- **One-dimensional:** each line is its own container; nothing lines up across lines; **a lone item on the last line with
  `flex-grow > 0` fills the whole line.** Grid (`repeat(auto-fill, minmax(160px, 1fr))`) keeps the last item in its cell.
- **Flex "grid systems":** `flex: 0 0 33.3333%` + wrap gives grid-like columns — but if you are setting widths on flex
  items, or adding empty items as spacers, **switch to Grid**.
- **Gutters:** `gap` (shorthand of `row-gap` + `column-gap`) — fixed space between adjacent items; margins, padding,
  `justify-content` and `align-content` also make space and combine with it.
- **`visibility: collapse` on a flex item:** removed from rendering but leaves a **strut** — its cross size is kept, so a
  single-line container keeps its height while its main size changes; a multi-line container may re-wrap. Full support
  only in Firefox; others may treat it as `hidden`. Compare `visibility: hidden` (invisible, keeps its space) and
  `display: none` (gone from layout, from counters, and transitions do not run).

```css
.box { width: 500px; display: flex; flex-wrap: wrap; gap: 10px; } .box > * { flex: 1 1 160px; }
.box { display: flex; flex-wrap: wrap balance; flex-line-count: 5; } /* experimental */
* { box-sizing: border-box; } .box > * { flex: 0 0 33.3333%; }       /* flex-as-grid: prefer Grid */
.collapse { visibility: collapse; }
```

### 2.8 Typical use cases of flexbox — `/Guides/Flexible_box_layout/Use_cases`

Flexbox is right for a collection of items in ONE dimension, or for controlling space between items. The recurring
choice: **put the spare space OUTSIDE the items (`justify-content`) or INSIDE them (`flex`)**.

1. **Navigation, space outside:** `nav ul { list-style: none; margin: 0; padding: 0; display: flex; justify-content:
   space-between; }` (or space-around / space-evenly / start / end / center); links `display: block`.
2. **Navigation, space inside:** `nav li { flex: auto; }` (grow from content: longer labels stay longer) or `flex: 1`
   (all equal).
3. **Split navigation:** `nav ul { display: flex; gap: 20px; } .push-right { margin-left: auto; }` — move the class to
   move the split.
4. **Centre an item:** `.box { height: 300px; display: flex; align-items: center; justify-content: center; }`. (Box
   Alignment also allows `align-content: center` on a block container with `margin: auto` on the child, without flex.)
5. **Card footer pushed down:** cards in a grid (equal heights), each card `display: flex; flex-direction: column`, the
   content `flex: 1 1 auto` → the footer sits at the bottom of every card.
6. **Media object:** `.media { display: flex; align-items: flex-start; } .media .content { flex: 1; } img { max-width:
   100%; display: block; }` — cap the image (`.image img { max-width: 100px }`), or share 1:1 (`flex: 1` on both), or grow
   from content (`flex: auto` on both), or 3:1; **flip** with `.flipped { flex-direction: row-reverse; }`.
7. **Form controls:** `.wrapper { display: flex; }` with `label`, `input[type=text] { flex: 1 1 auto; }`, submit button —
   the input takes the room, label and button keep their size. The basis of a form-component library.

```html
<div class="card"><div class="content"><p>Short.</p></div><footer>Card footer</footer></div>
```
```css
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.card { display: flex; flex-direction: column; }
.card .content { flex: 1 1 auto; }
```

```html
<form><div class="wrapper"><label for="t">Label</label><input id="t" type="text" /><input type="submit" value="Send" /></div></form>
```
```css
.wrapper { display: flex; }
.wrapper > input[type="text"] { flex: 1 1 auto; }
```

**Trap from the page itself:** the media-object `row-reverse` flip and the nav's visual order change nothing for keyboard
or screen reader — fine here because image/text order carries no meaning; not fine for a heading and its text.

### 2.9 Box alignment in flexbox — `/Guides/Box_alignment/In_flexbox`

The reference table, as MDN gives it:

| Property | Set on | Axis | Does |
|---|---|---|---|
| `justify-content` | container | main | distributes the items as a group |
| `align-items` | container | cross | aligns all items |
| `align-self` | item | cross | overrides `align-items` for one item |
| `align-content` | container | cross | aligns the LINES (wrapping containers) |
| `column-gap` | container | main | fixed gap between items |
| `row-gap` | container | cross | fixed gap between lines (needs `flex-wrap: wrap`) |
| `gap` | container | both | shorthand |
| `margin: auto` | item | both | absorbs free space — the per-item "justify-self" |

Ignored in flex: `justify-items`, `justify-self`. An auto-margined item still shrinks like any other when there is no
space. Example: `.box { display: flex; align-items: flex-start; justify-content: space-between; } .box :first-child {
align-self: center; }`.

---

## 3. The properties

### 3.1 `flex` (shorthand) — `/Reference/Properties/flex`
- **Initial:** `0 1 auto` · **Inherited:** no · **Applies to:** flex items, incl. in-flow pseudo-elements · **Animation:**
  grow/shrink as numbers, basis as length/%/calc · **Baseline:** widely available since 2015-09.
- **Syntax:** `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`.
- **Values / forms:**
  - `none` → `0 0 auto`: fully inflexible, sized by width/height.
  - `initial` → `0 1 auto`: does not grow, may shrink to its minimum. (Also a global keyword.)
  - `auto` → `1 1 auto`: grows and shrinks from its content/width size.
  - `<number>` e.g. `flex: 2` → `2 1 0%`: proportional to the number, basis 0%.
  - `<basis>` alone e.g. `flex: 10em` → `1 1 10em`; `flex: 30%`; `flex: min-content`.
  - two values `flex: 1 30px` → grow + basis (`1 1 30px`); `flex: 2 2` → grow + shrink (`2 2 0%`).
  - three values `flex: 2 2 10%`.
  - global: inherit, initial, revert, revert-layer, unset.
  - **When omitted inside the shorthand: grow → 1, shrink → 1, basis → 0%** — NOT the initial values (0, 1, auto).
- **Example:** `#flex-auto { flex: auto }` beside a default item: the auto item takes all the spare room; hide the other and
  it fills the container.
- **Traps:** `flex: 1` ≠ `flex-grow: 1` (the shorthand also sets basis 0% → equal widths; the longhand keeps basis auto →
  content-weighted widths). Items do not shrink below min-content by default — set `min-width`/`min-height` (§ 4).
  Negative numbers are invalid.

### 3.2 `flex-basis` — `/Reference/Properties/flex-basis`
- **Initial:** `auto` · **Inherited:** no · **Applies to:** flex items incl. in-flow pseudo-elements · **Percentages:** of
  the flex container's inner main size · **Animation:** length/%/calc · **Baseline:** widely available since 2015-09.
- **Syntax:** `content | <'width'>`. Sizes the content box unless `box-sizing` says otherwise.
- **Values:**
  - `auto` — use `width` (row) / `height` (column); if that is auto too, use `content`.
  - `content` — size from the content (the max-content size), even when a width is set.
  - `<length>` — `10em`, `3px`: that starting size.
  - `<percentage>` — of the container's main size; **if the container's size is indefinite, it behaves as `content`.**
  - `0` — an absolute zero: the item contributes nothing until it grows.
  - `max-content` — the intrinsic preferred width.
  - `min-content` — the intrinsic minimum width.
  - `fit-content` — the available space, clamped between min-content and max-content.
  - (the `<'width'>` grammar also admits `stretch`, `contain` and `anchor-size()`.)
- **Priority:** a non-`auto` `flex-basis` beats `width` (or `height` in a column).
- **`0` vs `0%`** (MDN example): in an `inline-flex` column with no set height, `flex-basis: 0` gives a section a start
  size of 0 (it grows to its `min-height: 200px`), while `flex-basis: 0%` resolves to `content` → 300px.

```css
.container { width: 40vw; display: inline-flex; flex-direction: column; }
section { overflow: auto; min-height: 200px; } .content { height: 300px; }
.basis-0 > * { flex-basis: 0; }        /* section starts at 0 → 200px */
.basis-0-percent > * { flex-basis: 0%; } /* indefinite % → content → 300px */
```
- **Traps:** MDN recommends the `flex` shorthand over setting the basis alone. `flex: 1` writes `0%`, so it inherits the
  indefinite-percentage behaviour in auto-height columns.

### 3.3 `flex-grow` — `/Reference/Properties/flex-grow`
- **Initial:** `0` · **Inherited:** no · **Applies to:** flex items · **Computed:** as specified · **Animation:** number ·
  **Baseline:** widely available since 2015-09.
- **Syntax:** `<number [0,∞]>`; `0` = never grows; any positive number is a RATIO (1, 88, 1.2 all equal when shared alike).
- **Meaning:** share of the line's **positive** free space, `factor / sum of factors`.
- **Worked example (MDN):** four 100px items in 700px, factors 0, 1, 2, 3 → free 300px, 6 units of 50px → 100, 150, 200,
  250px. Six items with 1,1,1,2,2,1 → each "1" gets 12.5% of the free space, each "2" 25%.
- **Traps:** grow adds to the BASIS, so with `basis: auto` the result is not proportional to the factor (MDN links
  "flex-grow is weird"); a sum of factors below 1 hands out only that fraction of the free space (spec — e.g. a single item
  at 0.5 takes half the spare room).

### 3.4 `flex-shrink` — `/Reference/Properties/flex-shrink`
- **Initial:** `1` · **Inherited:** no · **Applies to:** flex items · **Animation:** number · **Baseline:** widely available
  since 2015-09.
- **Syntax:** `<number [0,∞]>`; `0` = never shrinks (may overflow).
- **Meaning:** how the line's **negative** free space is removed; the factor is **multiplied by the flex base size**, so
  removal is proportional to size × factor. In the shorthand it is always the second number; a lone number is grow.
- **Example (MDN):** five 200px items in 500px (−500px), factors 1,1,1,1.5,2 (sum 6.5): reductions 76.92px, 115.38px,
  153.85px. (Equal bases here, so size weighting cancels out.)
- **Traps:** an item stops at its automatic minimum (min-content) — the excess is then taken from the others, and if
  every item is at its floor, the line overflows.

### 3.5 `flex-direction` — `/Reference/Properties/flex-direction`
- **Initial:** `row` · **Inherited:** no · **Applies to:** flex containers · **Animation:** discrete · **Baseline:** widely
  available since 2015-09.
- **Syntax:** `row | row-reverse | column | column-reverse`.
- **Values:**
  - `row` — main axis = the inline (text) direction; first item at inline-start; wrapped lines added at block-end.
  - `row-reverse` — as row, first item at inline-END; lines still added at block-end.
  - `column` — main axis = the block axis; first item at block-start; wrapped columns added at inline-end.
  - `column-reverse` — block axis from block-END upward; wrapped columns at inline-end.
  - `row`/`row-reverse` follow `dir`: with `dir="rtl"`, `row` runs right-to-left.
- **Example:** `#col-rev { flex-direction: column-reverse }` shows C B A bottom-up; `#row-rev` shows C B A from the right.
- **Accessibility (MDN):** the reverse values disconnect what is seen from DOM order; screen-reader and keyboard users get
  the DOM order — WCAG 1.3.2 Meaningful Sequence.
- **Trap:** set it through `flex-flow` with `flex-wrap`, says MDN; and `column-reverse` on a short container leaves the
  free space at the TOP.

### 3.6 `flex-wrap` — `/Reference/Properties/flex-wrap`
- **Initial:** `nowrap` · **Inherited:** no · **Applies to:** flex containers · **Animation:** discrete · **Baseline:**
  widely available since 2015-09 (except `balance`).
- **Syntax:** `nowrap | [ wrap | wrap-reverse ] || balance`.
- **Values:**
  - `nowrap` — one line; may overflow.
  - `wrap` — multiple lines, stacked from cross-start.
  - `wrap-reverse` — multiple lines stacked from cross-END (bottom-up in a row).
  - `balance` — lines made as even in length as possible (alone = `wrap balance`; with `nowrap` = invalid). Newer, limited
    support; pairs with `flex-line-count`.
- **Example:** three 300px items in a 897px container: wrap/nowrap fit in one line; with `width` shrinking, wrap breaks
  them, wrap-reverse puts the new line ABOVE.
- **Traps:** without `balance`, filling is greedy — the last line can be short and its growing items huge (§ 4.3).

### 3.7 `flex-flow` (shorthand) — `/Reference/Properties/flex-flow`
- **Initial:** `row nowrap` · **Inherited:** no · **Applies to:** flex containers · **Animation:** discrete · **Baseline:**
  widely available since 2015-09.
- **Syntax:** `<'flex-direction'> || <'flex-wrap'>` — either, both, any order: `row`, `wrap`, `column wrap`,
  `column-reverse wrap-reverse`, `wrap balance`, `column-reverse wrap balance`.
- **Example:** `ul { display: flex; width: 31em; gap: 1em; flex-flow: row-reverse wrap-reverse; }` — 24 words laid out
  backwards and bottom-up.
- **Trap:** writing only `flex-flow: wrap` RESETS direction to `row` (a shorthand resets what it omits).

### 3.8 `order` — `/Reference/Properties/order`
- **Initial:** `0` · **Inherited:** no · **Applies to:** flex items, grid items, and absolutely-positioned children of flex
  and grid containers · **Animation:** integer (discrete steps) · **Baseline:** widely available since 2015-09 · **Spec:**
  CSS Display 3.
- **Syntax:** `<integer>` (negative allowed) — the item's ordinal group; ascending, ties in source order. No effect unless
  the parent is a flex or grid container. Visual only: must not be used for speech media.
- **Example:** `<main>` holding `article`, `nav`, `aside` (in that source order) with `order: 2 / 1 / 3` → nav · article ·
  aside on screen, the article first in the source (good for reading).
- **Accessibility:** a disconnect between visual and DOM order — WCAG 1.3.2 and 2.4.3 Focus Order.

### 3.9 `flex-line-count` — `/Reference/Properties/flex-line-count` (EXPERIMENTAL)
- **Initial:** `1` · **Inherited:** no · **Applies to:** multi-line flex containers · **Animation:** number · **Spec:**
  Flexbox Level 2 · **Support:** experimental — check the compat table; guard with `@supports`.
- **Syntax:** `<integer [1,∞]>` — the MINIMUM number of lines balanced items are spread over.
- No effect without `balance` or without wrapping; if ≥ the item count, one item per line; if the items already need more
  lines than the value, it changes nothing.
- **Balanced two-column list without a height:** `ol { display: flex; gap: 10px 40px; flex-flow: column balance;
  flex-line-count: 2; }`.

### 3.10 `display: flex` / `inline-flex` — `/Reference/Properties/display`
- **Initial:** `inline` · **Inherited:** no · **Applies to:** all elements · **Animation:** discrete (to/from `none`:
  visible for the whole duration) · **Baseline:** widely available since 2015-07; the multi-keyword form follows the same
  status per MDN.
- **Values for flex:**
  - `flex` = `block flex` — a block-level box that lays out its children as flex items.
  - `inline-flex` = `inline flex` — an inline-level box (sits in a line of text, shrink-wraps) with flex inside.
  - A lone inner keyword defaults the outer to `block`. Fallback pattern: `display: inline-flex; display: inline flex;`.
  - `contents` — no box of its own; children join the parent's layout (accessibility bug: some browsers drop the element's
    semantics).
  - `none` — gone from layout AND from the accessibility tree (except content referenced by `aria-labelledby` /
    `aria-describedby`). To hide only visually use the visually-hidden technique.
- **Trap:** an `inline-flex` container used as an item (or a button) sits on the text baseline — it can leave a gap under it
  like an image does.

### 3.11 `min-width` / `min-height: auto` — the automatic minimum size — `/Reference/Properties/min-width`
- **Initial:** `auto` · **Inherited:** no · **Percentages:** of the containing block width.
- **`auto`:** `0` for block, inline, inline-block and table boxes; **for flex and grid items**, the *automatic minimum
  size*: the specified size suggestion (e.g. a set `width`), else a transferred size (an `aspect-ratio` with a definite
  height), else the **min-content** size — **and `0` if the item is a scroll container** (`overflow` other than `visible`/
  `clip`). `min-height: auto` does the same in a column.
- Other values: `<length>`, `<percentage>`, `max-content`, `min-content`, `fit-content`, `fit-content(<length-%>)`,
  `stretch` (margin box fills the containing block).
- See § 4.2 — this is the single most common flexbox bug.

---

## 4. The sizing algorithm in plain words

Spec order (Flexbox Level 1 § 9, as MDN's guides describe it):

1. **Flex base size** of each item from `flex-basis`: a length/% → that; `auto` → the `width`/`height`, else `content`
   (max-content); `0` → 0; `0%` with an indefinite container → content.
2. **Hypothetical main size** = the base size clamped by `min-*`/`max-*` (where `min-*: auto` = the automatic minimum).
3. **Lines:** with `nowrap`, one line. With `wrap`, items are collected **greedily in order-modified document order**: each
   item's outer hypothetical size (+ margins, + the `column-gap` before it) is added to the line until the next one would
   overflow; it then starts a new line. An item larger than the whole line gets a line to itself.
4. **Per line**, sum the outer base sizes: free space = line size − sum (− gaps).
   - Positive → **grow**: each item with `flex-grow > 0` receives `free × grow / Σgrow` (if Σgrow < 1, only
     `free × Σgrow` is handed out).
   - Negative → **shrink**: each item's *scaled shrink factor* = `flex-shrink × base size`; it loses
     `|free| × scaled / Σscaled`.
5. **Clamp and repeat:** any item that went past its `max-*` or below its `min-*` (including the automatic minimum) is
   frozen at that limit, the free space is recomputed from the remaining items, and step 4 runs again until nothing
   violates.
6. Cross sizes (stretch), then `justify-content`, auto margins and `align-*` place what is left.

### 4.1 Worked numeric examples

**Grow, `auto` vs `0`.** A 900px row, three items whose content (max-content) is 100, 200 and 300px.
- `flex: auto` (1 1 auto): bases 100 + 200 + 300 = 600; free = +300; each gets +100 → **200 / 300 / 400**. Content-weighted.
- `flex: 1` (1 1 0%): bases 0; free = +900; each gets 300 → **300 / 300 / 300** — *unless* an item's min-content is bigger
  than 300px (say a 340px unbreakable word): it is frozen at 340, the other two share 560 → **280 / 280 / 340**. "Equal
  columns" are only equal when no content is wider than a share.

**Shrink, with the min-content floor.** A 500px row; bases 300, 200, 100 (Σ600, free = −100); all `flex-shrink: 1`.
- Scaled factors 300, 200, 100 (Σ600) → losses 50, 33.33, 16.67 → **250 / 166.67 / 83.33**.
- Item 3's min-content is 95px (a long word): 83.33 < 95 → frozen at 95. Remaining: 500 − 95 = 405 for bases 300 + 200 →
  free −95, scaled 300:200 → losses 57 and 38 → **243 / 162 / 95** (sums to 500).
- If all three floors together exceeded 500px, nothing more can shrink and the row **overflows**.

### 4.2 Why text overflows a flex item, and `min-width: 0`

`min-width: auto` on a flex item means "never narrower than my min-content". A long URL, an email address, a `<pre>`/code
block, a wide table or image, or a `white-space: nowrap` title gives the item a large min-content, so the item refuses to
shrink and pushes past the container (on a 360px phone: a horizontal scrollbar). The same holds VERTICALLY in a column
(`min-height: auto`) — the classic "my scrollable panel won't scroll, it grows instead".

Fixes, in order of preference:
```css
.item { min-width: 0; }                 /* allow shrinking below min-content (row) */
.panel { min-height: 0; overflow: auto; } /* scrollable region inside a column */
.item { overflow: hidden; }             /* any non-visible overflow also makes the auto minimum 0 */
.item p { overflow-wrap: anywhere; }    /* then let long words actually break */
```
`min-width: 0` alone lets the BOX shrink; the words still need `overflow-wrap` to break, or they spill out visually.
Nested flex: every level of flex items between the container and the long word needs `min-width: 0`.

### 4.3 How wrapping decides lines, and the lonely last item

Line breaking is **greedy, using each item's hypothetical (base) size — not its final grown size**: fill a line in order
until the next item does not fit, then break. Growth happens afterwards, per line. Consequences:
- Ten `flex: 1 1 160px` items in 500px (with no gap): 3 fit (480), so lines of 3-3-3-**1**; the last item grows to the full
  500px — four times the width of the others.
- Lines can have different counts, and items in different lines do not line up (one-dimensional).
- Gaps count when fitting: 3 × 160 + 2 × 10 = 500 still fits in 500; a 12px gap would push the third item down.
- `flex: 1 1 0%` items in a wrapping row wrap LATE: each base is 0, so the hypothetical size is just the automatic
  minimum (min-content) — they break only when even their longest words no longer fit side by side, and with
  `min-width: 0` they never wrap at all. Wrapping is driven by the basis or `min-width`, so a wrapping row needs a real
  basis (e.g. `flex: 1 1 18rem`) or an explicit `min-width`.

Fixes for the last line: `flex-grow: 0` + a `max-width` on items; `flex-wrap: wrap balance` (experimental); or use Grid
`repeat(auto-fill, minmax(160px, 1fr))` so the last item keeps a column's width.

---

## 5. Everything a person could want to do with flex → the CSS

| Goal | CSS |
|---|---|
| Put things side by side | `.row { display: flex; gap: 1rem; }` |
| Stack them (column) | `.stack { display: flex; flex-direction: column; gap: 1rem; }` |
| Centre anything both ways | `.c { display: flex; align-items: center; justify-content: center; }` (or `.c > * { margin: auto }` — overflow-safe) |
| Equal-width columns | `.row > * { flex: 1; min-width: 0; }` |
| Equal-height columns | default — `align-items: stretch`; don't set a height on the items |
| Columns that share by content | `.row > * { flex: auto; }` |
| One fixed sidebar + fluid main | `.side { flex: 0 0 16rem; } .main { flex: 1; min-width: 0; }` |
| Sidebar as a % that never shrinks | `.side { flex: 0 0 18%; } .main { flex: 1; }` (Trillo, see 06) |
| Menu that wraps on narrow screens | `nav ul { display: flex; flex-wrap: wrap; gap: .5rem 1rem; list-style: none; padding: 0; }` |
| Menu items spread across | `ul { display: flex; justify-content: space-between; }` |
| Menu items fill the bar equally | `li { flex: 1; } a { display: block; text-align: center; }` |
| Push the last item to the right (split nav / logout) | `.last { margin-left: auto; }` (logical: `margin-inline-start: auto`) |
| Logo left, links right | `header { display: flex; align-items: center; } nav { margin-left: auto; }` |
| Put something at the bottom of a column (card button, sidebar footer) | `.card { display: flex; flex-direction: column; } .card .btn { margin-top: auto; }` |
| Cards whose buttons line up across a row | parent `display: flex` (stretch) or grid; each card as above (`margin-top: auto` on the button / `flex: 1` on the body) |
| Sticky footer (footer at the bottom of short pages) | `body { min-height: 100dvh; display: flex; flex-direction: column; margin: 0; } main { flex: 1; }` |
| Media object (image + text) | `.media { display: flex; align-items: flex-start; gap: 1rem; } .media img { flex: 0 0 auto; max-width: 6rem; } .media .body { flex: 1; min-width: 0; }` |
| Flip the media object | `.media.flipped { flex-direction: row-reverse; }` (meaningless order only) |
| Input that grows, label and button that don't | `.field { display: flex; } .field input { flex: 1 1 auto; min-width: 0; }` |
| Responsive cards that wrap, min width each | `.cards { display: flex; flex-wrap: wrap; gap: 1rem; } .card { flex: 1 1 18rem; }` (last line stretches — Grid if that is unwanted) |
| Cards that wrap but keep their width | `.card { flex: 0 1 18rem; }` + `justify-content: flex-start` |
| Row on desktop, stack on mobile | `.row { display: flex; flex-direction: column; } @media (min-width: 37.5em) { .row { flex-direction: row; } }` — or let it wrap: `flex-wrap: wrap` with `flex: 1 1 18rem` items, no query |
| Reorder on mobile (visual only) | `@media (max-width: 37.5em) { .promo { order: -1; } }` — never for headings/forms/focus order |
| Icon + label lined up | `a { display: inline-flex; align-items: center; gap: .5em; }` |
| Icon above label | `a { display: flex; flex-direction: column; align-items: center; }` |
| Baseline-align text of different sizes (price + unit, heading + link) | `.row { display: flex; align-items: baseline; gap: .5rem; }` |
| One item full height while others centred | `.row { align-items: center; } .tall { align-self: stretch; }` |
| Item alone on its own line in a wrapping row | `.full { flex: 0 0 100%; }` (or `flex-basis: 100%`) |
| Keep an item from shrinking (logo, avatar) | `.logo { flex-shrink: 0; }` (or `flex: none`) |
| Long text truncated with an ellipsis in a row | `.title { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }` |
| Scrollable middle pane in a full-height app | `.app { height: 100dvh; display: flex; flex-direction: column; } .pane { flex: 1; min-height: 0; overflow: auto; }` |
| Spread wrapped lines through a tall box | `.box { flex-wrap: wrap; align-content: space-between; }` (needs spare cross space) |
| Avatars overlapping in a row | `.avatars { display: flex; } .avatars > * + * { margin-left: -.75rem; }` (Trillo, see 06) |
| Balanced wrapped lines / balanced two columns | `flex-flow: row wrap balance;` / `flex-flow: column balance; flex-line-count: 2;` (experimental, `@supports`) |
| Make a wrapper's children join the parent row | `.wrapper { display: contents; }` — never on a semantic element |
| A flex container that sits inline in text | `display: inline-flex` |
| Free space between groups (A B ··· C D ··· E) | auto margins on C and E: `.c, .e { margin-left: auto; }` |

---

## 6. Traps for a tool that GENERATES flex CSS (the builder's resolvers)

1. **`min-width: auto` (min-content floor)** — every generated `flex: 1` / fill item needs `min-width: 0` (and `min-height:
   0` for column fill/scroll areas), or one long word/URL overflows a 360px phone. Pair with `overflow-wrap: anywhere` on
   text.
2. **Shorthand defaults differ from initial values** — `flex: 1` = `1 1 0%`, `flex-grow: 1` alone = `1 1 auto`, `flex:
   auto` = `1 1 auto`; equal shares need the basis 0. Emit the full three-value shorthand always, so nothing depends on
   what the shorthand fills in. And `0%` on an indefinite column resolves to content (`0` does not).
3. **Wrapping is decided by the basis, not the grown size** — a `flex: 1 1 0%` item in a wrapping row wraps only at its
   min-content (and never once `min-width: 0` is added — traps 1 and 3 collide); a wrapping
   row needs a real basis (rem) or a `min-width`; and the last line's lone item grows to full width (use Grid,
   `flex-grow: 0` + max-width, or balance).
4. **Visual order ≠ reading/focus order** — `order` and `*-reverse` only move pixels (WCAG 1.3.2 / 2.4.3); never reorder a
   heading after its text or a form field out of sequence; `flex-start` flips with `row-reverse` while `start` follows the
   writing mode (RTL languages, RULE AF).
5. **Alignment gotchas** — `justify-self`/`justify-items` do nothing in flex (use auto margins); `stretch` does nothing to
   an item with a set cross size or a cross auto margin (equal-height cards break if a height is written); `center` on
   overflowing content loses the start side (use `safe center` or `margin: auto`); `align-content` does nothing on a
   single line; `display: contents` can strip semantics.

**For the builder (pointers, no new decisions):** 06-trillo-flexbox.md already maps container/item properties, the
auto-margin *Place in the line*, `fill` → `1 1 0%`, the `min-width` floors and AC-25/26/27. This file's additions to
check against the resolvers: (a) is `min-width: 0` emitted on every *Fill* block whose content could be a long word, and
`min-height: 0` on column fills; (b) does the wrap of a row band rely on a basis/`min-width` (it does: 14rem floors) rather
than a `0%` basis; (c) `start`/`end` (writing-mode aware) vs `flex-start`/`flex-end` in the export, for `dir="rtl"` pages
(Arabic, RULE AF languages); (d) `wrap balance` as a progressive enhancement for the lone-last-item hole (c-7 / F-1 B).
