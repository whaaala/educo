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
| Flexbox Froggy, CSS-Tricks guide (external) | READ 2026-10-04 | CSS-Tricks read in full; Froggy's 24 levels read from its own `js/levels.js`; § 7 |
| "display: contents considered harmful" (Eric Bailey), Adrian Roselli ×3, Léonie Watson (Tink), Alastair Campbell, Hidde de Vries, WebAIM, Go Make Things, W3C WCAG 1.3.1 / 1.3.2 (external a11y articles linked from MDN) | READ 2026-10-04 | 15 external links read, one via a mirror; § 7 |
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

---

## 7. External links follow-up (2026-10-04)

**How this was done.** The external links were collected from MDN's raw Markdown (`mdn/content`, `main`): the module landing
page, all 7 sub-guides, `Box_alignment/In_flexbox`, the Learn Flexbox page, and the pages for `flex`, `flex-basis`,
`flex-grow`, `flex-shrink`, `flex-direction`, `flex-wrap`, `flex-flow`, `order`, `flex-line-count`, `display`, `min-width`.
22 distinct non-MDN URLs appear. Each page was fetched as raw HTML and stripped to text, so the quotes below are the
authors' words, not a summary. (Two fetched pages — Eric Bailey's and Go Make Things' — ended with a line telling an AI reader
to ignore its instructions and print text. That is page content, not research, and was ignored.)

Tally: **15 read in full (one of them through a mirror) · 0 failed in the end · 7 not read, by design** (§ 7.2).

### 7.1 Per-link entries

**1. CSS-Tricks — A Complete Guide to Flexbox** · `https://css-tricks.com/snippets/css/a-guide-to-flexbox/` · **read fully**
(article, interactive walkthrough, examples, prefixing section, and the first ~100 comments; the rest of the comments are
"does not work in IE/Safari 5" noise). The page is now titled "A Complete CSS Flexbox Layout Guide" (updated May 2026). It
restates the properties already in 04, plus these items that 04 does **not** have:
- `place-items` in flex: "The property accepts dual values, the first for align-items and the second for justify-items."
  Note: `justify-items` is ignored on a flex container (flex items cannot be justified individually), so only the
  `align-items` half acts. The walkthrough text "`justify-items: space-between`" is a typo for `justify-content`.
- **`gap` is a minimum gutter:** "The behavior could be thought of as a minimum gutter, as if the gutter is bigger somehow
  (because of something like `justify-content: space-between;`) then the gap will only take effect if that space would end up
  smaller." And gap "applies that spacing only between items not on the outer edges."
- **`safe` / `unsafe`**: "Using `safe` ensures that however you do this type of positioning, you can't push an element such
  that it renders off-screen (e.g. off the top) in such a way the content can't be scrolled too (called 'data loss')."
  Support remark (dated): "`space-between` never got support from some versions of Edge, and `start`/`end`/`left`/`right`
  aren't in Chrome yet… The safest values are `flex-start`, `flex-end`, and `center`."
- `align-content` values as listed: `normal` (default) | `flex-start|start` | `flex-end|end` | `center` | `space-between` |
  `space-around` | `space-evenly` | `stretch` (+ `baseline`, `safe`/`unsafe`) — "only takes effect on multi-line flexible
  containers".
- `flex` with one number: "that changes the flex-basis to `0%`, so it's like setting `flex-grow: 5; flex-shrink: 1;
  flex-basis: 0%;`", and "It is recommended that you use this shorthand property rather than set the individual properties."
  On basis: "If set to `0`, the extra space around content isn't factored in. If set to `auto`, the extra space is distributed
  based on its `flex-grow` value."
- `float`, `clear` and `vertical-align` "have no effect on a flex item"; "CSS columns have no effect on a flex container."
- **Robin Rendle's plain-English trio** (quoted): "`flex-grow`: Sets the item's maximum size. `flex-shrink`: Sets the item's
  minimum size. `flex-basis`: Represents the item's 'ideal' size." (Loose, but it is the wording people remember.)
- **Perfect centring:** `.parent { display:flex } .child { margin:auto }` — "a margin set to auto in a flex container absorb
  extra space. So setting a margin of auto will make the item perfectly centered in both axes." (04 § 5 has the single-axis
  `margin-right: auto` push; this is the both-axes form.)
- Three worked patterns with code: (a) six fixed-size items `flex-flow: row wrap; justify-content: space-around`; (b) a nav that
  is `flex-end` on large, `space-around` at <= 800px, `flex-direction: column` at <= 500px; (c) the **mobile-first holy
  grail**: `.wrapper{display:flex; flex-flow:row wrap} .wrapper > *{flex:1 100%}`, `.aside{flex:1 auto}` at >= 600px, then at
  >= 800px `.main{flex:3 0px}` with `.aside-1{order:1} .main{order:2} .aside-2{order:3} .footer{order:4}`. **Trap:** that pattern
  reorders with `order`, so reading order and visual order differ (see 7.1 #3-#6).
- Walkthrough on `gap` vs padding: "No extra padding. And notice how the spacing is automatically calculated and accounted for
  in the layout so nothing overflows the container edges."
- The guide's own accessibility note: "Assistive technologies, like screen readers, will announce the items in the original
  order. In other words, the reversal is visual rather than structural."
- Comment-thread bugs (old, but the shape of real failures): Safari 7 — "When using the flex-shorthand… without specifying the
  third parameter (-webkit-flex-basis), Safari will compute the value 0px and wrapping… is not going to work. In order for
  Safari to wrap… flex-basis must be auto"; a rounding error where "a combination of screen width and element width might
  sometimes mean you only get two columns on a line instead of three" (percent bases + gaps); and "regardless of project I
  always… fail to get it work and it's just random guessing which particular element needs a 'min-height: 0' or a 'height:
  100%'" — nested full-height panes need `min-height: 0` at every level (the column twin of 04 § 4.2).
- The "Flexbox Tricks" list (adaptive photo layout, balancing on a pivot, flexbox + text-ellipsis, alignment-shifting wrapping,
  product page layout, truncated text, flexbox + absolute positioning, filling the last row) is single-technique CSS-Tricks
  posts; "filling the last row" is the lonely-last-item problem already solved in 04 § 4.3. Not followed further.

**2. Flexbox Froggy** · `https://flexboxfroggy.com/` · **read fully, from its own data.** The page is a JS game and its HTML
shell has no lesson text, so the 24 levels were read from the site's `js/levels.js` (`name`, English `instructions`, `solution`,
`board`, `classes`); `docs.js` and `messages.js` were fetched. The game itself was not clicked through. Board letters: g green,
y yellow, r red frogs.

| # | Name | Solution CSS | Teaches / the lesson text |
|---|---|---|---|
| 1 | justify-content 1 | `justify-content: flex-end` | value list: flex-start, flex-end, center, space-between, space-around |
| 2 | justify-content 2 | `center` | two frogs |
| 3 | justify-content 3 | `space-around` | three frogs, "lots of space all around" |
| 4 | justify-content 4 | `space-between` | lilypads on the edges |
| 5 | align-items 1 | `align-items: flex-end` | vertical axis: flex-start, flex-end, center, baseline, stretch |
| 6 | align-items 2 | `justify-content: center; align-items: center` | centring = both axes |
| 7 | align-items 3 | `justify-content: space-around; align-items: flex-end` | the two combine |
| 8 | flex-direction 1 | `flex-direction: row-reverse` | row, row-reverse, column, column-reverse |
| 9 | flex-direction 2 | `flex-direction: column` | |
| 10 | flex-direction 3 | `row-reverse` + `justify-content: flex-end` | "when you set the direction to a reversed row or column, start and end are also reversed" |
| 11 | flex-direction 4 | `column` + `justify-content: flex-end` | "when the flex direction is a column, justify-content changes to the vertical and align-items to the horizontal" |
| 12 | flex-direction 5 | `column-reverse` + `justify-content: space-between` | |
| 13 | flex-direction 6 | `row-reverse` + `justify-content: center` + `align-items: flex-end` | three properties together |
| 14 | order 1 | `.yellow { order: 2 }` | "By default, items have a value of 0… positive or negative integer" |
| 15 | order 2 | `.red { order: -1 }` | negative order sends an item first |
| 16 | align-self 1 | `.yellow { align-self: flex-end }` (container has `align-items: flex-start`) | per-item override |
| 17 | align-self 2 | `align-self: flex-end` + `order: 2` | order + align-self |
| 18 | flex-wrap 1 | `flex-wrap: wrap` | nowrap, wrap, wrap-reverse |
| 19 | flex-wrap 2 | `flex-direction: column; flex-wrap: wrap` | three columns of 5 |
| 20 | flex-flow 1 | `flex-flow: column wrap` | the shorthand |
| 21 | align-content 1 | `align-content: flex-start` (container pre-wrapped) | "align-content determines the spacing between lines, while align-items determines how the items as a whole are aligned within the container. When there is only one line, align-content has no effect." |
| 22 | align-content 2 | `align-content: flex-end` | |
| 23 | align-content 3 | `flex-direction: column-reverse; align-content: center` | |
| 24 | align-content 4 | `column-reverse` + `wrap-reverse` + `align-content: space-between` + `justify-content: center` | final: all eight properties |

What Froggy adds to 04: a ready **lesson order** for a teacher-facing explainer (justify-content, align-items, direction, order,
align-self, wrap, flow, align-content). What it does **not** teach, so it is no substitute for 04: `flex-grow` / `flex-shrink` /
`flex-basis` / `flex`, `gap`, `min-width: auto`, `margin: auto`, `space-evenly`, and any accessibility caveat on `order` or
`*-reverse` (it teaches reordering with no warning). Its `justify-content` list has five values (no `space-evenly`).

**3. Leonie Watson (Tink) — Flexbox & the keyboard navigation disconnect** ·
`https://tink.uk/flexbox-the-keyboard-navigation-disconnect/` (4 Feb 2016) · **read fully.**
- The problem: DOM order 1-2-3 with `order: 3/2/1` shows 3-2-1; "When you use the tab key to move through the content, there is
  a disconnect between the visual order and the keyboard navigation (DOM) order."
- **Two code-level fixes, both rejected, with the reason.** `tabindex="3/2/1"`: "tabindex is scoped to the document. … The
  three items with tabindex would be the first three things on the page to receive keyboard focus, irrespective of their overall
  location… you can use tabindex to solve the flexbox disconnect, but only by pushing the problem up to the document level."
  `aria-flowto`: "it complicates rather than simplifies the problem" and it has "extremely poor accessibility support. …only Jaws
  with Firefox, or Narrator with Edge and IE, has support."
- **Browser behaviour then:** "Firefox realigns the tab order to match the visual order (based on the order property)… this
  behaviour is considered to be an implementation bug because it's contrary to the FlexBox specification." Even so, "screen
  readers that use a virtual buffer will also present the content in DOM order."
- Her stance: the spec's "don't use it" recommendation is "unacceptable"; the fix has to be in the browser / accessibility tree.
- New for 04: never use positive `tabindex` or `aria-flowto` to "repair" a reordered flex row. (04 § 2.5 only says the
  disconnect exists.)

**4. Adrian Roselli — Source Order Matters** · `https://adrianroselli.com/2015/09/source-order-matters.html` (2015, updated
24 Jun 2026) · **read fully** (post + every update).
- Names the normative hooks: "technique C27, making the DOM order match the visual order… applies specifically to Success
  Criterion 1.3.2 (Meaningful Sequence) and Success Criterion 2.4.3 (Focus Order). Each of these is Level A".
- Takeaway: "Code your pages so the HTML source linearizes well and the content makes sense without styles. When you do add
  visual styles, try to get them to conform to the source order as much as possible."
- **The platform fix exists but is not usable yet: `reading-flow`.** Timeline from the updates: CSS Display draft proposed
  `layout-order` / `reading-order` (Dec 2022); Chrome's "Solving the CSS layout and source order disconnect" (Apr 2023);
  `reading-order-items` prototype (Feb 2024); "As of 13 June 2024, `reading-order-items` is now `reading-flow`"; "These two
  properties only work in the context of flex and grid. They do nothing for floats or absolute positioning." June 2026: "With no
  support, nor seemingly interest, from Mozilla and WebKit for `reading-flow`…" so it cannot be relied on.
- Test tools: his "Reading Order Bookmarklet" (2019) and the Edge 86 / Chromium "Source order viewer" devtools experiment.
- Related: WebAIM "Flexbox and the Screen Reader Experience" (2022); Matuzovic "The Dark Side of the Grid"; Rachel Andrew "Grid,
  content re-ordering and accessibility" and "Masonry and reading order"; Matuzovic (June 2026) "Your Grid Lanes will likely fail
  WCAG 2.4.3" — masonry / grid-lanes carries the same risk.

**5. Adrian Roselli — HTML Source Order vs CSS Display Order** ·
`https://adrianroselli.com/2015/10/html-source-order-vs-css-display-order.html` · **read fully.**
- The same disconnect exists for **flex, grid, float and absolute position**, each with a CodePen: "the source order versus
  display order discussion is not unique to CSS Flexbox."
- His two rules, quoted: "If you are using CSS Flexbox, don't use order, as that can be a can of worms. Whether or not you have
  access to a screen reader, you can at least test your page with the keyboard by tabbing through."
- **Firefox history (dated browser bug):** Firefox 41 followed flex `order` for Tab; the bug "to apply Flexbox order to the
  accessibility tree was just closed in favor of the bug stating order should not affect tabbing order"; Bugzilla 812687
  (Apr 2017): "you won't see any changes to current behavior in Firefox 54". Per Jules Ernst, Firefox followed the declaration
  but NVDA did not, even paired with Firefox. A 2014 proposal to make `order` affect "the default traversal order of sequential
  navigation modes" was never adopted.
- **`display: flex` on a `<table>` destroys its semantics** (Feb 2018): "using CSS flex on an HTML table will override its
  native semantics and render it essentially useless to a screen reader. Do not do it." (NVDA no longer announced a table,
  headers were not announced.) Follow-up post: "Tables, CSS Display Properties, and ARIA".

**6. Alastair Campbell — The responsive order conflict for keyboard focus** ·
`https://alastairc.uk/blog/2017/06/the-responsive-order-conflict/` · **read fully.** This is the one that matters for a
**responsive** builder: even a developer who tries to keep focus order logical cannot, because layout order is chosen per
breakpoint but focus order is fixed in the DOM.
- Example 1: header, content, live-block, footer. Desktop wants content left / live-block right (keyboard order content then
  live block); a phone wants the live block first, so "It pings up and down the page, making it very difficult to anticipate
  the next focus point or understand your place in the page." Example 2: a "meta" nav (your-account) top-right on desktop but
  under the hamburger on a phone.
- Affected: "VoiceOver on iOS (with some vision), or switch access, and probably other keyboard-equivalent inputs" — not only
  desktop keyboard users, so it applies to the phone-first audience.
- Filament Group quote: of "A) dynamically adapting our HTML source order for every breakpoint, B) sending different HTML
  sources to each client, or C) renumbering the tabindex attributes… we emphatically choose option D) 'Nope'"; they could only
  mitigate with navigational cues and skip links.
- Conclusion: "It has to be solved by the browsers." Counter-point: Bootstrap's docs want the table of contents before the
  content in source — "the exception that proves the rule".

**7. CSS-Tricks — `flex-grow` is weird. Or is it?** (Manuel Matuzovic, 26 Dec 2015) · `https://css-tricks.com/flex-grow-is-weird/`
· **read fully** (article + the first ~25 comments). The worked arithmetic with content present, which 04 § 4.1 states abstractly:
- The mistake: a 2:1 `flex-grow` on two **empty** items gives 600/300 of 900px and looks like a ratio of widths. With content,
  "the element with `flex-grow` set to 1 is actually bigger than the element with `flex-grow` set to 2."
- The rule, quoted: "`flex-grow` will take the remaining space and divide it by the total amount of flex grow values. The
  resulting quotient is multiplied by the respective flex-grow value and the result is added to each child elements initial
  width." Numbers: 900 - 99 - 623 = 178; 178 / 3 = 59.33; 99 + 2 x 59.33 = 218px, 623 + 59.33 = 682px.
- With `flex-basis` 400 and 200: 900 - 600 = 300; 300 / 3 = 100, so 600 and 300. "If box-sizing was set to border-box, you
  would only work with the flex-basis and margin values… because the padding is already included"; margins are subtracted from
  the free space.
- "If an element has flex-grow set to 3 it does not mean that it's 3 times bigger… but it means that it gets 3 times more pixels
  added to its initial width than the other element."
- Shorthand trap: the spec encourages `flex` over `flex-grow`, "But be careful! If you just use `flex: 1;` some of the above
  examples won't work anymore" — keep the content-based start with `flex: 2 1 auto`. (Confirms 04 § 3.1 on basis `0` vs `auto`.)
- Comments: the "holy grail" 150px sidebars squash ("You will find that your 150px aside columns do not remain at 150px but
  squash when the middle column has more content. You need to set flex-shrink to zero."); `flex-basis` acts along the main axis
  whatever the direction while `width` is horizontal only (Igor Karavaev); `flex: 2` / `flex: 1` (basis 0) gives true
  proportional widths whatever the content.

**8. Eric Bailey — `display: contents` considered harmful** (25 May 2023) ·
`https://ericwbailey.design/published/display-contents-considered-harmful/` · **read fully, via a mirror.** That domain did not
resolve (DNS failure) from this machine; the same post was read at
`https://ericwbailey.website/published/display-contents-considered-harmful/`.
- Position: "I don't think we as an industry can use `display: contents` with confidence… I now view the declaration as
  predictably unpredictable." It prevents "buttons from being announced as buttons, tables as being announced and navigated as
  tables, lists as being announced and navigated as lists". Browsers fixed it, then regressed ("I counted sixteen updates about
  how `display: contents`' behavior had regressed in a way that was inaccessible"); "there's no console error or visual
  indication that things are amiss." Update: Safari 17 (18 Sep 2023) claimed it had fixed "our remaining accessibility issues
  with `display: contents`". Buttons and headings, however, are still broken.

**9. Adrian Roselli — Display: Contents Is Not a CSS Reset** ·
`https://adrianroselli.com/2018/05/display-contents-is-not-a-css-reset.html` (2018, updated 31 Jul 2025) · **read fully**
(body, special-case list, bug log, tweets, and the dated updates up to 2022; the 2024-2025 updates were skimmed). MDN cites
it from the flex/`display` pages.
- Do not use `display: contents` to strip list/heading margins. "Today browsers will take an element with `display: contents`
  and drop it from the accessibility tree", and ARIA added back does not help (Chrome 66 showed "Accessibility node not exposed"
  for `h2`, `table`, `ul`, `button`). A `tabindex="0"` button with a key handler "is dead to keyboard users".
- **Spec special cases, quoted from CSS Display 3:** `display: contents` "behaves as `display: none`" for `br, wbr, meter,
  progress, canvas, embed, object, audio, iframe, img, video, frame, frameset, input, textarea, select`; `legend` reacts
  normally; `button`, `details`, `fieldset` "don't have any special behavior; `display: contents` simply removes their principal
  box". "It removes it from the CSS box tree too" (Tab Atkins): a `display: contents` child is **not** a flex item; its own
  `order`, `flex`, background, border stop applying and its children become the container's items.
- The only use he accepts (Amelia Bellamy-Royds): "to remove extra divs that you added for your fallback layout but don't need
  for your grid layout. Do not use—yet—on semantic elements: `<ul>`, `<nav>`, `<button>`, `<header>`, etc". A better reset:
  "`all: initial`" (James Steinbach).
- Bug log (dated): Firefox 1455357 fixed in 62 for lists only; Firefox 1500958 (buttons) fixed June 2019; Chromium 835455 closed
  fixed March 2021; Safari reported fixed in 16 but "it is not fixed" (Roselli, 5 Jul 2022). CSSWG #2632 (can a `display:
  contents` element be focused?) closed "out of scope".

**10. Hidde de Vries — More accessible markup with `display: contents`** ·
`https://hidde.blog/more-accessible-markup-with-display-contents/` (2018, updated 2022) · **read fully.**
- The legitimate use: in grid (and flex) "only direct children of that element become grid items", so grand-children such as the
  `<li>`s of a `<ul>` cannot be placed. Instead of flattening the markup (losing "list, 3 items", Reader mode, print), put
  `display: contents` on the `<ul>` so its `<li>`s join the parent's layout.
- The spec sentence that makes the accessibility behaviour a bug: "The `display` property has no effect on an element's
  semantics… its purpose is to allow designers freedom to change the layout behavior of an element without affecting the
  underlying document semantics."
- Results: Firefox 61 "text leaf" (fixed 62, Aug 2018); Chrome 66 "accessibility node not exposed" (fixed Chrome 89, Mar 2021);
  Safari "no accessibility information" (WebKit 185679 / 237834; fixed in 16, disputed by Roselli Jul 2022).

**11. Go Make Things — Hidden content for better a11y** (Apr 2016) ·
`https://gomakethings.com/articles/hidden-content-for-better-a11y/` · **read fully.** MDN cites it from `display: none`. The
recipe for **visually-hidden** text: the `.screen-reader` class (`border:0; clip:rect(0 0 0 0); height:1px; margin:-1px;
overflow:hidden; padding:0; position:absolute; white-space:nowrap; width:1px`), a focusable variant on `:active/:focus`
restoring `clip:auto; height:auto; margin:0; overflow:visible; position:static; white-space:normal; width:auto`, **skip links**
(`<a href="#main">`), the Chrome workaround `tabindex="-1"` on `<main>` (plus `.tabindex:focus{outline:none}`) so focus really
moves, hidden `<label>`s, and `tabindex="-1"` to drop decorative heading-anchor links from the tab order. Also: "One of the
biggest accessibility issues I see on websites is the removal of :focus styling from links."

**12. WebAIM — Invisible Content Just for Screen Reader Users** ·
`https://webaim.org/techniques/css/invisiblecontent/` (updated Sep 2020) · **read fully.** MDN cites it from `display: none`.
- Hiding techniques compared: `display:none` / `visibility:hidden` hide from everyone; the `hidden` attribute = `display:none`;
  `width:0`, `height:0`, `font-size:0` "may result in search engine penalties"; `text-indent:-10000px` is readable but a
  focusable element inside "would be focusable, but not visible"; the **recommended** `.sr-only` (absolute, `left:-10000px`,
  1x1px, `overflow:hidden`) and the modern `clip: rect(1px,1px,1px,1px); clip-path: inset(50%); height:1px; width:1px;
  margin:-1px; overflow:hidden; padding:0; position:absolute`.
- "Navigable elements, such as links and form controls, should not be hidden off-screen" unless shown on focus. Use judiciously:
  "what they see and what they hear should typically be in harmony."
- Skip link: hidden until `:focus`; WebAIM animates it in with a CSS transition because "the sudden appearance of a link that
  was previously invisible will be unexpected and could potentially confuse the sighted keyboard user."

**13. W3C — Understanding SC 1.3.2 Meaningful Sequence (WCAG 2.2)** ·
`https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence` · **read fully.** The normative rule behind every `order` /
`*-reverse` warning: "When the sequence in which content is presented affects its meaning, a correct reading sequence can be
programmatically determined." Two nuances 04 lacked: (a) "A sequence is meaningful if the order of content in the sequence
cannot be changed without affecting its meaning… Tables and ordered lists are meaningful sequences, but unordered lists are
not"; (b) "Providing a particular linear order is only required where it affects meaning. There may be more than one order that
is 'correct'… Only one correct order needs to be provided." So moving a nav beside `main` is allowed; reordering recipe steps,
numbered content or a table is not. Techniques: C6, **C27 (making the DOM order match the visual order)**, G57; failures F32 /
F33 / F34 (white-space layout), F49 (layout table that does not make sense linearized), **F1 (changing the meaning of content
by positioning it with CSS)**.

**14. W3C — Understanding SC 1.3.2 (WCAG 2.0 version)** ·
`https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html` · **read fully.** Same text; its
examples are worth keeping: "CSS is used to position a navigation bar, the main story on a page, and a side story. The visual
presentation of the sections does not match the programmatically determined order, but the meaning of the page does not depend
on the order of the sections" (an allowed reorder).

**15. W3C — Understanding SC 1.3.1 Info and Relationships (WCAG 2.0)** ·
`https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-programmatic.html` · **read fully.** Cited from
`display`. The rule: "Information, structure, and relationships conveyed through presentation can be programmatically
determined or are available in text." For flex: a restyle must not remove the structure a list, heading or table carries
(techniques G115 semantic elements, G140 separating structure from presentation, H51 table markup, ARIA11 landmarks).

### 7.2 Links in the MDN pages that were NOT read, and why

| URL | Why not |
|---|---|
| `drafts.csswg.org/css-flexbox/`, `/css-flexbox-2/`, `/css-flexbox-1/#visibility-collapse` | spec index pages for what MDN documents (MDN is the stored reference); `visibility: collapse` is already in § 2.7 |
| `drafts.csswg.org/css-display/#unbox`, `#valdef-display-contents` | spec text for `display: contents`; its content is quoted through Roselli (#9) and MDN |
| `drafts.csswg.org/css-speech/` | speech media; off-topic for layout |
| `scrimba.com/learn-html-and-css-c0p/~017?via=mdn` | sponsored video-course link in MDN's Learn page; not documentation |
| `mdn.github.io/shared-assets/images/examples/balloon.jpg` | an image asset used in MDN's live examples |

### 7.3 New for the builder (what 04-flexbox.md did NOT have)

1. **Reorder only what is not focusable, or restructure the source.** `order`, `*-reverse` and any per-breakpoint reorder keep Tab
   and reading order in the DOM (Watson, Roselli, Campbell, WCAG 1.3.2 + 2.4.3). The fixes people try — positive `tabindex`,
   `aria-flowto` — are rejected by the evidence; `reading-flow` (the CSS answer) is not in Firefox or Safari. The page audit
   should compare visual vs DOM order for any block holding a link, button or input and flag it. Moving a nav against `main` is
   allowed (WCAG: "the meaning of the page does not depend on the order of the sections"); reordering steps, numbered lists or
   tables is not.
2. **A per-breakpoint reorder is the exact conflict Campbell describes** (live-block first on phone, last on desktop). The
   builder's "order on a phone" control (Trillo note) needs this warning in its UI.
3. **Never put `display: flex` / `grid` on a table**; a Table component stays `display: table` (NVDA stops announcing it).
4. **`display: contents` only on a pure, non-semantic wrapper `div`**; never on `ul`, `nav`, `button`, `table`, headings or
   `header`. A `display: contents` child is not a flex item (its `order`/`flex`/background stop applying; its children become the items).
5. **`gap` is a minimum gutter, between items only**, and `place-items` / `justify-items` do nothing on a flex container.
6. **`flex-grow` is a share of the leftover, not a ratio of widths** (worked numbers, #7). `flex: N` (basis 0) gives true
   proportions; `flex: N 1 auto` keeps content size. A column-ratio control must say which it means.
7. **Fixed-width sidebars need `flex-shrink: 0`** (or a `min-width`), and nested full-height panes need `min-height: 0` at every level.
8. **`margin: auto` on an item centres it on both axes.**
9. **Visually-hidden text recipe** (clip + clip-path + 1px box, a focusable variant, a skip link with `tabindex="-1"` on `main`)
   for hidden labels and skip-to-content; never hide a focusable element off-screen without a `:focus` reveal.
10. **Froggy's order is a ready lesson sequence** for the guide (RULE L); it omits grow / shrink / basis / gap, which the guide
    must cover from 04.
11. **Masonry / grid-lanes inherit the same reading-order risk** (Matuzovic 2026) — relevant to the builder's masonry block.
