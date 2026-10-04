# MDN CSS index — everything that POSITIONS or LAYS OUT a box (beyond grid, flex, box alignment)

Research for the user's goal (2026-10-04): *"position any component, any text, any information, wherever they want on
the page… with margin and padding."* Source: the user's link https://developer.mozilla.org/en-US/docs/Web/CSS and the
68-module list it leads to (`/Web/CSS/Guides`). Grid, flexbox and box alignment are covered by the sibling files in this
folder; this file covers **every other way CSS places a box**, and says what the repo already stores (RULE R: extend,
never redo).

Method note: pages were read with WebFetch (a fetch plus a summarising model). Where a summary disagreed with the MDN
reference pages read in the same pass, or with the spec, the correct statement is used and the disagreement is listed in
§6 "Corrections" so nobody trusts the wrong line later.

---

## 1. Completeness table

| # | URL (developer.mozilla.org/en-US/docs/…) | Read | Notes |
|---|---|---|---|
| 1 | `Web/CSS` (the user's link) | partly | the first fetch failed (output overflow); the re-fetch returned headings + the guide list + the reference sections. The A–Z property index on this page was not listed (it is the same set as the module pages below). |
| 2 | `Web/CSS/Reference` | partly | the section structure and guide links; the A–Z index was truncated by the fetcher |
| 3 | `Web/CSS/Guides` | fully | **the 68 modules** — §2 |
| 4 | `Web/CSS/Guides/Positioned_layout` | fully | |
| 5 | `…/Positioned_layout/Understanding_z-index` | fully | |
| 6 | `…/Positioned_layout/Stacking_without_z-index` | fully | |
| 7 | `…/Positioned_layout/Stacking_floating_elements` | fully | |
| 8 | `…/Positioned_layout/Using_z-index` | fully | |
| 9 | `…/Positioned_layout/Stacking_context` | fully | the full list of what creates one |
| 10 | `Learn_web_development/Core/CSS_layout/Positioning` | fully | |
| 11 | `Web/CSS/Reference/Properties/position` | fully | sticky's exact rule; a11y note |
| 12 | `Web/CSS/Guides/Display` | fully | |
| 13 | `…/Display/Multi-keyword_syntax` | fully | |
| 14 | `…/Display/Block_and_inline_layout` | fully | |
| 15 | `…/Display/Flow_layout_and_overflow` | fully | |
| 16 | `…/Display/Flow_layout_and_writing_modes` | fully | |
| 17 | `…/Display/Formatting_contexts` | fully | |
| 18 | `…/Display/In_flow_and_out_of_flow` | fully | |
| 19 | `…/Display/Containing_block` | fully | |
| 20 | `…/Display/Block_formatting_context` | fully | |
| 21 | `…/Display/Visual_formatting_model` | fully | |
| 22 | `Web/CSS/Guides/Box_model` | fully | |
| 23 | `…/Box_model/Margin_collapsing` | fully | |
| 24 | `Web/CSS/Guides/Box_sizing` | fully | |
| 25 | `…/Box_sizing/Aspect_ratios` | fully | |
| 26 | `Web/CSS/Guides/Logical_properties_and_values` | fully | |
| 27 | `…/Logical_properties_and_values/Floating_and_positioning` | fully | |
| 28 | `…/Logical_properties_and_values/Margins_borders_padding` | fully | |
| 29 | `Web/CSS/Guides/Writing_modes` | fully | |
| 30 | `Web/CSS/Guides/Anchor_positioning` | fully | |
| 31 | `…/Anchor_positioning/Using` | fully | |
| 32 | `…/Anchor_positioning/Try_options_hiding` | fully | |
| 33 | `…/Anchor_positioning/Anchored_container_queries` | fully | |
| 34 | `Web/CSS/Guides/Overflow` | fully | |
| 35 | `…/Overflow/Carousels` | fully | |
| 36 | `Web/CSS/Guides/Containment` | fully | |
| 37 | `…/Containment/Container_queries` | fully | |
| 38 | `…/Containment/Container_size_and_style_queries` | fully | |
| 39 | `…/Containment/Using` | fully | |
| 40 | `Web/CSS/Guides/Multicol_layout` | fully | |
| 41 | `…/Multicol_layout/Basic_concepts` | fully | |
| 42 | `…/Multicol_layout/Using` | fully | |
| 43 | `…/Multicol_layout/Styling_columns` | fully | |
| 44 | `…/Multicol_layout/Spanning_balancing_columns` | fully | |
| 45 | `…/Multicol_layout/Handling_overflow` | fully | |
| 46 | `…/Multicol_layout/Handling_content_breaks` | fully | |
| 47 | `Learn_web_development/Core/CSS_layout/Floats` | fully | MDN has no "floats" module; floats live in Learn + Display + Positioned layout |
| 48 | `Web/CSS/Guides/Shapes` | fully | |
| 49 | `…/Shapes/Overview` | fully | |
| 50 | `…/Shapes/Using_shape-outside` | fully | |
| 51 | `Web/CSS/Guides/Transforms` | fully | |
| 52 | `…/Transforms/Using` | fully | |
| 53 | `Web/CSS/Guides/Images` | fully | |
| 54 | `…/Images/Replaced_element_properties` | fully | object-fit / object-position |
| 55 | `Web/CSS/Guides/Scroll_snap` | fully | |
| 56 | `…/Scroll_snap/Basic_concepts` | fully | |
| 57 | `Web/CSS/Guides/Table` | fully | |
| 58 | `Web/CSS/Guides/Viewport` | fully | |
| 59 | `…/CSSOM_view/Viewport_concepts` | fully | |
| 60 | `Web/CSS/Guides/CSSOM_view` | fully | JS-side, for the editor's measurements |
| 61 | `Web/CSS/Guides/Environment_variables` | fully | safe-area insets |
| 62 | `Web/CSS/Guides/Inline_layout` | fully | |
| 63 | `…/Inline_layout/Inline_formatting_context` | fully | |
| 64 | `Web/CSS/Guides/Fragmentation` | fully | |
| 65 | `Web/CSS/Guides/Motion_path` | fully | |
| 66 | `Web/CSS/Guides/Gaps` | fully | gap decorations (row/column rules) |
| 67 | `Web/CSS/Guides/Overscroll_behavior` | fully | |
| 68 | `Web/CSS/Guides/Scroll_anchoring` | fully | |
| 69 | `Web/CSS/Guides/Round_display` | fully | short page; no browser support |
| 70 | `Web/CSS/Guides/Media_queries` | fully | |
| 71 | `Web/CSS/Guides/Paged_media` | fully | |

**Linked sub-guides:** all 16 pages that were listed here as open lines (Logical properties Basic concepts + Sizing · Shapes From_images + Shape_generator · Writing modes systems + vertical controls · scroll-snap events · scroll anchoring · object-view-box · environment variables · Media queries Using / Testing / Using_for_accessibility / Printing · Learn Overflow · CSSOM View coordinate systems) are now read fully in §7 (#72-#87). None failed; none changes §4's ranking.
**Out of scope here on purpose:** the Flexbox, Grid and Box-alignment module pages (sibling researchers).

**Totals: 87 URLs fetched (71 first pass + 16 sub-guides in §7) — 85 read fully, 2 partly (#1, #2), 0 left failed** (#1 failed once and was re-fetched).

---

## 2. The 68 modules MDN lists, with the layout column

"Layout" = the module changes WHERE a box sits, HOW BIG it is, or WHAT it sits on top of. Path prefix:
`https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/`.

| # | Module | Path | Layout? | Why |
|---|---|---|---|---|
| 1 | Anchor positioning | `Anchor_positioning` | **yes** | tethers a box to another box |
| 2 | Animations | `Animations` | no | changes values over time (can animate position, but places nothing itself) |
| 3 | Backgrounds and borders | `Backgrounds_and_borders` | no | paint; `border-width` adds to the box but is covered by Box model |
| 4 | Basic user interface | `Basic_user_interface` | no | cursor, outline, resize, accent-color |
| 5 | Borders and box decorations | `Borders_and_box_decorations` | no | paint |
| 6 | Box alignment | `Box_alignment` | yes — *sibling file* | justify/align/place, gaps |
| 7 | Box model | `Box_model` | **yes** | margin, padding, margin collapsing |
| 8 | Box sizing | `Box_sizing` | **yes** | width/height/min/max, intrinsic sizes, aspect-ratio |
| 9 | Cascading and inheritance | `Cascade` | no | which value wins |
| 10 | Color adjustment | `Color_adjustment` | no | forced colours, color-scheme |
| 11 | Colors | `Colors` | no | paint |
| 12 | Compositing and blending | `Compositing_and_blending` | no (side effect) | `isolation`/`mix-blend-mode` create stacking contexts — noted under Positioned layout |
| 13 | Conditional rules | `Conditional_rules` | partly | `@supports` / `@container` / `@media` decide WHICH layout applies; covered via Media queries + Containment |
| 14 | Containment | `Containment` | **yes** | `contain`, container queries, `cq*` units, containing block side effects |
| 15 | Counter styles | `Counter_styles` | no | list markers |
| 16 | Custom functions and mixins | `Custom_functions_and_mixins` | no | authoring |
| 17 | Custom highlight API | `Custom_highlight_API` | no | text highlights |
| 18 | Custom properties | `Cascading_variables` | no | variables (the builder's tokens use them) |
| 19 | Display | `Display` | **yes** | box generation, flow, flow-root, contents, containing block, formatting contexts |
| 20 | Easing functions | `Easing_functions` | no | timing |
| 21 | Environment variables | `Environment_variables` | **yes (edge)** | `env(safe-area-inset-*)` keeps fixed/edge boxes clear of notches |
| 22 | Filter effects | `Filter_effects` | no (side effect) | `filter` makes a containing block + stacking context — noted under Positioned layout |
| 23 | Flexible box layout | `Flexible_box_layout` | yes — *sibling file* | |
| 24 | Font loading | `Font_loading` | no | |
| 25 | Fonts | `Fonts` | no | |
| 26 | Fragmentation | `Fragmentation` | **yes (columns/print)** | where a box breaks between columns/pages |
| 27 | Gaps | `Gaps` | yes — *shared with sibling files* | `gap`, row/column rules for flex, grid, multicol |
| 28 | Generated content | `Generated_content` | no | `::before`/`::after` content (they are boxes, positioned by the rest) |
| 29 | Grid layout | `Grid_layout` | yes — *sibling file* | |
| 30 | Images | `Images` | **yes (inside a box)** | `object-fit` / `object-position` place a picture inside its box |
| 31 | Inline layout | `Inline_layout` | **yes** | line boxes, `vertical-align`, `line-height`, `text-box-trim` |
| 32 | Lists and counters | `Lists` | no | |
| 33 | Logical properties and values | `Logical_properties_and_values` | **yes** | flow-relative margin/padding/inset/size |
| 34 | Masking | `Masking` | no (side effect) | `clip-path`/`mask` make stacking contexts; clip, never place |
| 35 | Media queries | `Media_queries` | **yes (conditional)** | which layout applies at which viewport |
| 36 | Motion path | `Motion_path` | **yes (visual)** | `offset-path` places a box along a path |
| 37 | Multi-column layout | `Multicol_layout` | **yes** | one flow in N columns |
| 38 | Namespaces | `Namespaces` | no | |
| 39 | Nesting | `Nesting` | no | |
| 40 | Overflow | `Overflow` | **yes** | scroll containers, clipping — decides sticky's scope |
| 41 | Overscroll behavior | `Overscroll_behavior` | no (behaviour) | scroll chaining only |
| 42 | Paged media | `Paged_media` | partly | `@page` margins/size — print only |
| 43 | Positioned layout | `Positioned_layout` | **yes** | position, inset, z-index, stacking |
| 44 | Properties and values API | `Properties_and_values_API` | no | `@property` |
| 45 | Pseudo-elements | `Pseudo-elements` | no | |
| 46 | Round display | `Round_display` | yes in principle | `shape-inside`, `border-boundary` — no browser supports it |
| 47 | Ruby layout | `Ruby_layout` | no (niche) | annotation above CJK text |
| 48 | Scoping | `Scoping` | no | |
| 49 | Scroll anchoring | `Scroll_anchoring` | no (behaviour) | keeps the view still when content above changes |
| 50 | Scroll snap | `Scroll_snap` | **yes** | where a scroll container comes to rest |
| 51 | Scroll-driven animations | `Scroll-driven_animations` | no | motion, stored in `../motion/` |
| 52 | Scrollbars styling | `Scrollbars_styling` | no | |
| 53 | Selectors | `Selectors` | no | |
| 54 | Shadow parts | `Shadow_parts` | no | |
| 55 | Shapes | `Shapes` | **yes** | `shape-outside` — words wrap a shape |
| 56 | Syntax | `Syntax` | no | |
| 57 | Table | `Table` | **yes (data only)** | table layout algorithm |
| 58 | Text | `Text` | no (one edge) | `text-align` places inline content in its line — noted under Inline layout |
| 59 | Text decoration | `Text_decoration` | no | |
| 60 | Transforms | `Transforms` | **yes (visual)** | `translate` etc. move the painted box without moving the layout box |
| 61 | Transitions | `Transitions` | no | |
| 62 | Values and units | `Values_and_units` | no (but rule 16) | units are how every length above is written |
| 63 | View transitions | `View_transitions` | no | motion |
| 64 | Viewport | `Viewport` | **yes** | the initial containing block, `vw/svh/dvh`, `zoom` |
| 65 | Will change | `Will_change` | no (side effect) | can create a containing block / stacking context |
| 66 | Writing modes | `Writing_modes` | **yes** | which way block and inline run |
| 67 | CSSOM view | `CSSOM_view` | no (JS) | how the editor measures boxes |
| 68 | WebXR DOM overlays | `WebXR_DOM_overlays` | no | |

**Layout modules handled in this file (24):** Anchor positioning · Box model · Box sizing · Containment · Display (flow,
BFC, floats, containing block) · Environment variables · Fragmentation · Gaps (decorations) · Images (object-fit) ·
Inline layout · Logical properties · Media queries · Motion path · Multi-column · Overflow · Paged media (brief) ·
Positioned layout (incl. sticky, stacking) · Round display (brief) · Scroll snap · Shapes · Table · Transforms ·
Viewport · Writing modes.

---

## 3. Per layout module

Legend for the last line of each module: **COVERED** (where) · **PARTLY** (what is missing) · **NOT STORED**.
"Stored" means distilled in `docs/web-anatomy/` (not counting raw CodePen JSON dumps under `codepen/raw/`, which hold code
but no explanation). A CSS coverage map of the 68 modules exists only in **auto-memory**
(`memory/project_css_coverage.md`, 2026-09-02, framework layers Have/Partial/Missing) — it is not a repo doc, has no
per-property traps, and is now two months stale; this file is the repo copy for the layout half.

### 3.1 Positioned layout — `position`, insets, `z-index`, stacking

**In plain words.** Every box starts in normal flow (`static`). `position` lets you either *nudge* it where it is
(`relative`), *lift it out* and pin it to an ancestor (`absolute`), pin it to the screen (`fixed`), or let it ride the
flow until it reaches a line and then hold (`sticky`). The insets (`top/right/bottom/left`, `inset-*`) say where.
`z-index` says what paints on top — but only within the same **stacking context**.

| Property | What it does for placing a box | Values | Trap |
|---|---|---|---|
| `position` | picks the scheme | `static` · `relative` · `absolute` · `fixed` · `sticky` | `static` ignores insets and `z-index` |
| `top` `right` `bottom` `left` | offset from the containing block's edge (or, for `relative`, from its own flow spot) | length · % · `auto` · `anchor()` · `anchor-size()` | `%` of top/bottom resolves against the containing block's HEIGHT; `relative` + `top: 30px` moves it DOWN and leaves its old space reserved |
| `inset` | shorthand for all four | 1–4 values, physical order | the 4-value form is PHYSICAL, not logical |
| `inset-block` / `inset-inline` (+ `-start`/`-end`) | logical insets | as above | flip with `dir="rtl"` / vertical writing — the physical ones do not |
| `z-index` | order on the z axis inside the current stacking context | integer · `auto` | needs a non-static position (or a flex/grid item); a child can NEVER rise above its parent's stacking context, whatever number it has |
| `overlay` | UA-only: keeps a closing popover/dialog in the top layer during its exit transition | `none` · `auto` | authors only list it in `transition`; cannot be set |
| (`float` / `clear`) | see 3.5 | | `float` is ignored on `absolute`/`fixed` boxes |

**Containing block (where `%` and insets resolve):**
`static/relative/sticky` → content box of the nearest block container · `absolute` → **padding box** of the nearest
non-static ancestor (else the initial containing block) · `fixed` → the viewport (page area in print). **Any ancestor with
`transform`, `translate`, `rotate`, `scale`, `perspective`, `filter`, `backdrop-filter`, `contain: layout|paint|strict|content`,
`container-type` (size/inline-size), `content-visibility: auto`, or `will-change` naming one of these becomes the
containing block for `absolute` AND `fixed` descendants** — a "fixed" bar inside a tilted card scrolls with the card.

**Sticky, exactly.** Behaves as `relative` until its threshold (at least one inset must be non-`auto`) is reached in the
**nearest ancestor that is a scroll container** (`overflow` `hidden`, `scroll`, `auto`, `overlay` — not `clip`), then holds
until the far edge of its containing block pushes it away. It never leaves its parent. Breaks when: no threshold · an
ancestor has `overflow: hidden/auto` (it sticks inside THAT box, which may not scroll) · the parent is no taller than it ·
in a flex/grid row it is stretched to full height (`align-self: start` fixes that).

**Default paint order (no z-index), bottom → top:** root background → non-positioned blocks in source order → floats →
inline content of non-positioned blocks → positioned boxes in source order (`z-index: auto/0`) → positive z-index. Negative
z-index sits under the in-flow blocks of its stacking context.

**What creates a stacking context (full MDN list):** the root · `absolute`/`relative` with `z-index` ≠ `auto` · `fixed` and
`sticky` always · a flex or grid item with `z-index` ≠ `auto` · `container-type: size|inline-size` · `opacity` < 1 ·
`mix-blend-mode` ≠ `normal` · `transform`/`scale`/`rotate`/`translate` ≠ `none` · `filter`/`backdrop-filter` ≠ `none` ·
`clip-path`/`mask`/`mask-image`/`mask-border` ≠ `none` · `perspective` ≠ `none` · `isolation: isolate` · `will-change` naming
any of these · `contain: layout|paint|strict|content` · top-layer elements and their `::backdrop` · an element whose
animation holds any of these with `fill-mode: forwards`.

**Minimal working example — a badge on the corner of a card, the most useful positioned technique:**
```css
.card  { position: relative; }                       /* makes the card the containing block */
.badge { position: absolute; inset-block-start: 0; inset-inline-end: 0;
         translate: 25% -25%; z-index: 1; }          /* sits on the corner, flips in RTL */
```

**Stored:** **PARTLY.** `advanced-css/02-how-css-works.md` lecture 8e (positioning schemes, stacking contexts, the
transform-captures-fixed trap #144), `scroll-and-position/README.md` (sticky's three failure causes, z-index, `PAGE_Z`),
`scroll-and-position/01` + `04` (sticky/fixed patterns, exhaustive), `page-grid/04-map.md` A18–A19 (layers and sticky per
cell). **Missing:** the full stacking-context list (above), the full containing-block list (container-type,
content-visibility, will-change, backdrop-filter), `%`-insets-resolve-against-height, `overlay`, logical insets as the
builder's emitted form.

### 3.2 Display — box generation, normal flow, formatting contexts, `flow-root`, `contents`

**In plain words.** `display` has two halves: OUTSIDE (does the box sit on its own line — `block` — or in a line of text —
`inline`) and INSIDE (how its children are laid out — `flow`, `flow-root`, `flex`, `grid`, `table`, `ruby`). Normal flow
is the default inside: blocks stack in the block direction, inline boxes fill lines. A **block formatting context (BFC)** is
a sealed room: floats inside stay inside, floats outside do not come in, and margins do not collapse through its walls.

| Property / value | Placement effect | Trap |
|---|---|---|
| `display: block` / `inline` / `inline-block` | own line vs in a text line vs in a line with a full box model | inline boxes ignore `width`/`height` and vertical margins |
| multi-keyword `display: inline flex`, `block flow-root` … | explicit outer + inner | not every pair is valid; one keyword fills the other half (`block` → `block flow`, `flex` → `block flex`) |
| `display: flow-root` | makes a BFC with no side effects | the clean way to contain floats / stop margin collapse (better than `overflow: hidden`, which clips shadows) |
| `display: contents` | the element's own box disappears; its children join the parent's layout | the box's background/padding/border vanish; historically removed the element's ROLE from the accessibility tree on some elements (buttons, headings, tables) — never use it on interactive or semantic containers |
| `display: none` | no box at all | removed from the accessibility tree too |
| `visibility: hidden` / `collapse` | box keeps its space, not painted | `collapse` only means something on table rows/columns (and flex items) |
| `order` | changes VISUAL order in flex/grid | does not change reading or tab order (WCAG 1.3.2 / 2.4.3) |
| `reading-flow` / `reading-order` | NEW: lets reading/tab order follow the visual flex/grid order | check support before relying on it |

**What makes a BFC:** root · floats · `absolute`/`fixed` · `inline-block` · table cells/captions · flex and grid ITEMS ·
`overflow` other than `visible`/`clip` · `display: flow-root` · `contain: layout|content|paint` · `container-type` not
`normal` · multicol containers · `column-span: all`.

**In flow vs out of flow:** floats, `absolute`, `fixed` (and the root) are out of flow — the space they would take closes
up and nothing else responds to them. `relative` and `sticky` stay in flow (their space is kept).

**Inline formatting context:** inline boxes laid along lines; horizontal padding/border/margin push neighbours, vertical
padding/border paint but do NOT push lines apart; a split inline box has no margin/border at the split (unless
`box-decoration-break: clone`); floats shorten the line boxes beside them.

**Example — contain a floated picture without clearfix:**
```css
.story { display: flow-root; }       /* the background now wraps the float, margins stop collapsing through */
.story img { float: inline-start; inline-size: 40%; margin-inline-end: 1rem; }
```

**Stored:** **PARTLY.** `advanced-css/02` lecture 8e (box types, positioning schemes). **Missing:** multi-keyword syntax,
`flow-root`, the BFC list, `display: contents` and its a11y trap, `reading-flow`, inline formatting context rules. (No
curated file mentions `flow-root` or `display: contents`.)

### 3.3 Box model — margin, padding, margin collapsing

**In plain words.** Content → padding (inside the border, painted by the background) → border → margin (outside, never
painted). Margin is how a box is pushed away from its neighbours or pushed to one side (`margin-inline-start: auto` sends
it to the far end of a flex row; `margin-inline: auto` centres a block with a width).

| Property | Placement effect | Values | Trap |
|---|---|---|---|
| `margin` + `-top/-right/-bottom/-left` | space outside; `auto` absorbs free space | length · % · `auto` · negative | `%` margins (top and bottom too) resolve against the containing block's WIDTH; negative margin pulls neighbours over the box |
| `padding` + sides | space inside, painted | length · % (≥ 0) | `%` again of the WIDTH; no `auto`, no negatives |
| `margin-trim` | trims child margins at the container's edges | `none` · `block` · `inline` · `block-start`… | Safari only — do not rely on it |
| logical `margin-block/-inline(-start/-end)`, `padding-block/-inline…` | flow-relative versions | | the 1–4-value `margin`/`padding` shorthands stay PHYSICAL |

**Margin collapsing (vertical only, block layout only):** (1) adjacent siblings — the gap is the LARGER margin, not the sum;
(2) a parent and its first/last in-flow child — the child's margin leaks out of the parent unless the parent has border,
padding, inline content, clearance, (bottom:) a `height`/`min-height`, or is a BFC; (3) an empty block — its own top and
bottom collapse. Mixed signs: largest positive + most negative. **Never collapses:** floats, absolute boxes, flex and grid
items/containers, anything across a BFC wall, inline-blocks.

**Example — space that never collapses or leaks (what a builder should emit):**
```css
.stack { display: flex; flex-direction: column; gap: var(--space-4); }  /* gap: no collapse, no leak */
.block { padding: var(--space-3); margin-block: 0; }                    /* margin only where the user sets one */
```

**Stored:** **PARTLY.** `scroll-and-position/README.md` (mimo margin/padding: collapse, `0 auto`, negative margins; the
builder avoids collapse via gaps), `advanced-css/02` (box model, border-box, fill area), `design-foundation/01`.
**Missing:** the three collapse cases and the exact list of what stops them, `%` margins/padding resolving against
WIDTH, `margin-trim`.

### 3.4 Box sizing — width/height, min/max, intrinsic sizes, `aspect-ratio`, `box-sizing`

| Property | Placement effect | Values | Trap |
|---|---|---|---|
| `width` / `height` (logical `inline-size` / `block-size`) | the box's size | length · % · `auto` · `min-content` · `max-content` · `fit-content` · `fit-content(<len>)` · `stretch` | `height: %` needs a parent with a definite height, else it acts as `auto`; a set `height` is what makes text overflow when enlarged (WCAG 1.4.4) — prefer `min-height` |
| `min-*` / `max-*` | floor and ceiling | same + `none` | flex/grid items default to `min-width: auto` (= min-content) — a long word or image stops them shrinking; `min-width: 0` releases it |
| `box-sizing` | whether width includes padding+border | `content-box` (default) · `border-box` | the builder resets to `border-box` |
| `aspect-ratio` | preferred ratio when at least one dimension is `auto` | `auto` · `<ratio>` · `auto <ratio>` | ignored when both dimensions are set; content taller than the ratio grows the box unless `min-height: 0` + `overflow` |
| `contain-intrinsic-size` (+ `-width/-height/-block-size/-inline-size`) | size a box claims while its content is skipped | `none` · length · `auto <length>` | only meaningful with size containment / `content-visibility: auto` |
| `interpolate-size` | allows transitions to/from `auto`, `fit-content` | `numeric-only` · `allow-keywords` | new; motion territory |
| `frame-sizing`, `min-intrinsic-sizing` | spec only | — | no browser support |

**Intrinsic sizes in plain words:** `min-content` = as narrow as the longest word/image; `max-content` = as wide as the text
on one line; `fit-content` = `max-content` but never wider than the space (`min(max-content, max(min-content, available))`).
`stretch` = fill the containing block (margin-box).

**Example — a "hug the content but never overflow" button and a fluid media box:**
```css
.btn   { inline-size: fit-content; max-inline-size: 100%; }
.media { inline-size: 100%; aspect-ratio: 16 / 9; }
.media > img { inline-size: 100%; block-size: 100%; object-fit: cover; }
```

**Stored:** **PARTLY.** `aspect-ratio`, `box-sizing`, `min-content` appear in `advanced-css/04/07/08`, `page-grid/01/04`;
`fit-content` in `page-grid/01/04`, `motion/05`; `contain-intrinsic-*` in `motion/06`. **Missing:** a single reference of
the sizing keywords with the flex/grid `min-width: auto` trap, `stretch`, aspect-ratio's "one dimension must be auto"
and overflow rules.

### 3.5 Floats (Display + Positioned layout + Learn)

**In plain words.** A float leaves the flow and slides to the start or end of its line; the text that follows wraps
around it. Its proper use today is a picture with words flowing beside and under it — never page columns.

| Property | Effect | Values | Trap |
|---|---|---|---|
| `float` | pushes the box to a side, lines wrap round it | `none` · `left` · `right` · `inline-start` · `inline-end` | the parent does not grow to hold it (needs `flow-root`); a float inside a flex/grid ITEM works, a float that IS a flex/grid item is ignored |
| `clear` | starts the box below earlier floats | `none` · `left` · `right` · `both` · `inline-start` · `inline-end` | only clears floats in the same BFC |

**Example:** see 3.2 (`float: inline-start` inside a `flow-root` story).

**Stored:** **PARTLY.** `advanced-css/02` (scheme), `advanced-css/03/04` (float grid + clearfix, historic), and
`advanced-css/README.md` **AC-8 — "text wrapping round a picture" is a recorded GAP**. **Missing:** logical float values,
`flow-root` as the modern clear, float stacking layer.

### 3.6 Shapes — `shape-outside`

**In plain words.** A floated box can tell the text to wrap a circle, ellipse, polygon or the opaque part of an image
instead of its rectangle.

| Property | Effect | Values | Trap |
|---|---|---|---|
| `shape-outside` | the wrap outline | `none` · `margin-box` (default ref) · `border-box` · `padding-box` · `content-box` · `circle()` · `ellipse()` · `inset()` · `polygon()` · `path()` · `rect()` · `xywh()` · `shape()` · `url()` image · a gradient | **only on floats**; clipped to the margin box (a circle moved towards the text gets square edges); image shapes need CORS; it does not clip the picture — pair with `clip-path` |
| `shape-margin` | gap between the outline and the words | length · % | |
| `shape-image-threshold` | alpha cut-off for image/gradient shapes | 0–1 | |
| `shape-inside`, `shape-padding` | spec only | — | no browser support |

**Example:**
```css
.portrait { float: inline-start; inline-size: min(40%, 14rem); aspect-ratio: 1;
            shape-outside: circle(50%); clip-path: circle(50%); shape-margin: 1rem; }
@container (inline-size < 30rem) { .portrait { float: none; inline-size: 100%; } } /* never wrap a sliver of text */
```

**Stored:** **PARTLY.** `advanced-css/04` (Natours Stories: text round a circle), `area-v/AXIS-MAP.md` (shape-outside as
a section-shape value, 19 pens), AC-8 GAP. **Missing:** reference boxes, margin-box clipping, image threshold, the narrow-
screen fallback.

### 3.7 Logical properties and values

**In plain words.** Instead of top/right/bottom/left say block-start/inline-end…, so the same layout flips correctly for
Arabic (RTL, RULE AF languages) and vertical text.

Groups: sizing (`inline-size`, `block-size`, `min-/max-…`) · margin (`margin-block`, `margin-inline`, `-start`, `-end`) ·
padding (same) · border (`border-block`, `border-inline`, with `-color/-style/-width`) · radius
(`border-start-start-radius`, `-start-end-`, `-end-start-`, `-end-end-`) · inset (`inset-block`, `inset-inline`, …) ·
`float`/`clear: inline-start | inline-end` · `text-align: start | end` · `overflow-block/-inline` ·
`overscroll-behavior-block/-inline` · `scroll-margin-*`/`scroll-padding-*` logical.

**Trap:** the multi-value shorthands `margin`, `padding`, `inset`, `border-width`, `border-radius` stay physical; only
the `-block`/`-inline` forms flip. A builder storing "left padding" must emit `padding-inline-start`.

**Example:** `.note { margin-inline-start: auto; padding-inline: 1rem 0.5rem; border-inline-start: 0.25rem solid; }`

**Stored:** **PARTLY.** `scroll-and-position/README.md`, `page-grid/01` and `page-grid/04` use `margin-inline` and
logical insets; the memory coverage map says the base sheet uses them. **Missing:** the full mapping, the
physical-shorthand trap, logical radius names, a statement that the export emits logical properties everywhere (to check
in code).

### 3.8 Writing modes

| Property | Effect | Values | Trap |
|---|---|---|---|
| `writing-mode` | which way lines and blocks run | `horizontal-tb` · `vertical-rl` · `vertical-lr` · `sideways-rl` · `sideways-lr` | physical `width`/`margin-left` mean different things in vertical mode — use logical; replaced elements (images) do not rotate |
| `direction` | inline base direction | `ltr` · `rtl` | use the HTML `dir` attribute, not CSS `direction` |
| `text-orientation` | glyph orientation in vertical text | `mixed` · `upright` · `sideways` | |
| `text-combine-upright` | tate-chu-yoko (digits upright) | `none` · `all` · `digits <n>` | |
| `unicode-bidi` | bidi algorithm control | `normal` · `embed` · `isolate` · `bidi-override` · `isolate-override` · `plaintext` | prefer `dir` / `<bdi>` / `<bdo>` in HTML |

**Example (a rotated side label, the one design use):** `.tab { writing-mode: vertical-rl; rotate: 180deg; }` — and keep
it decorative or duplicated in normal text: vertical English is hard to read, and page-grid A21 already marks it AVOID on
phones.

**Stored:** **PARTLY.** `page-grid/02` and `page-grid/04` A21 (vertical side labels, AVOID). **Missing:** the property
reference, the `dir`-not-`direction` rule, RTL support as a RULE AF requirement (Arabic is in the language list).

### 3.9 Overflow

**In plain words.** What happens when content is bigger than its box: shown, clipped, or scrolled. Any value except
`visible`/`clip` turns the box into a **scroll container** — which also becomes the box `sticky` sticks inside, and a BFC.

| Property | Effect | Values | Trap |
|---|---|---|---|
| `overflow` (`-x`, `-y`, `-block`, `-inline`) | clip/scroll behaviour | `visible` · `hidden` · `clip` · `scroll` · `auto` · `overlay` (legacy alias of auto) | `hidden` is still scrollable by script and focus, and captures sticky children; `clip` is not a scroll container (sticky still works against the outer scroller); mixing `visible` on one axis with non-visible on the other turns `visible` into `auto` |
| `overflow-clip-margin` | lets `clip` paint a little outside | length (+ box) | only with `overflow: clip` |
| `scrollbar-gutter` | reserves the scrollbar's space | `auto` · `stable` · `stable both-edges` | stops the page shifting sideways when a scrollbar appears |
| `text-overflow` | ellipsis for clipped single-line text | `clip` · `ellipsis` | needs `overflow: hidden` + `white-space: nowrap` |
| `line-clamp` (`-webkit-line-clamp`) | cuts text after N lines | integer | hides content — the full text must be reachable (a "more" link or tooltip) |
| `scroll-behavior` | smooth programmatic scroll | `auto` · `smooth` | not reduced-motion aware by itself |
| carousel pseudo-elements `::scroll-button()`, `::scroll-marker`, `::scroll-marker-group`, `::column`, `:target-current` | CSS-only carousel controls | — | new (Chromium); progressive enhancement only |

**Example — the only safe inner scroller:** `.table-wrap { overflow-x: auto; overscroll-behavior-inline: contain; }`
(sideways scroll for a wide DATA table is allowed by WCAG 1.4.10; a whole page is not).

**Stored:** **PARTLY.** `overflow: clip`, `scrollbar-gutter` in `motion/02–05` and `motion/library`; sticky-vs-overflow in
`scroll-and-position/README.md`. **Missing:** the scroll-container definition, `hidden` vs `clip` for sticky, the
visible/auto coercion, `overflow-clip-margin`, CSS carousel pseudo-elements.

### 3.10 Containment and container queries

**In plain words.** `contain` tells the browser a subtree is independent (faster, but with side effects); a
**container query** lets a block change its own layout by the width of the box it sits in, not the screen — exactly
what a builder needs, because the same block can sit in a full-width band or a narrow sidebar.

| Property / rule | Effect | Values | Trap |
|---|---|---|---|
| `contain` | isolate layout/paint/size/style | `none` · `size` · `inline-size` · `layout` · `paint` · `style` · `content` (= layout paint style) · `strict` (all) | `layout`/`paint` make a containing block for fixed children and a stacking context; `paint` clips overflow; `size` with no `contain-intrinsic-size` collapses to 0 |
| `content-visibility` | skip rendering off-screen content | `visible` · `auto` · `hidden` | `auto` needs `contain-intrinsic-size: auto <len>` or the scrollbar jumps; it also makes the box a containing block |
| `container-type` | makes a query container | `normal` · `inline-size` · `size` · (`scroll-state`, `anchored`) | `inline-size`/`size` apply size containment: the container's own size can no longer come from its children in that axis (a shrink-wrapped box collapses); also a stacking context and containing block |
| `container-name` / `container` | name it (`container: card / inline-size`) | idents | an element can have several names |
| `@container` | the query | `(width > 30rem)`, `(orientation: …)`, `(aspect-ratio …)`, `style(--x: y)`, `scroll-state(stuck: top)`, `anchored(fallback: …)` | a container cannot query ITSELF — style its children |
| units `cqw` `cqh` `cqi` `cqb` `cqmin` `cqmax` | % of the nearest container | | with no container they fall back to small-viewport units; rule 16 wants a `rem` in the ideal term of any fluid `clamp()` |

**Example:**
```css
.band   { container: band / inline-size; }
.split  { display: grid; gap: var(--space-4); }
@container band (inline-size > 40rem) { .split { grid-template-columns: 1fr 1fr; } }
```

**Stored:** **PARTLY.** `container-type`/`@container` appear in `motion/01–02`, `motion/library`, `codepen/sticky.md`,
`advanced-css/02`; `content-visibility` in `motion/05–06`; the builder uses `cqw` (rule 16). **Missing:** the side
effects list (size containment collapse, containing block, stacking context), style and scroll-state and anchored
queries, `contain` values.

### 3.11 Multi-column layout

**In plain words.** ONE run of text flows down column 1, then column 2… like a newspaper. Different from grid (separate
boxes in cells). It is the only CSS way to have one paragraph continue into the next column, and the only native masonry-
like flow for cards (items read DOWN each column).

| Property | Effect | Values | Trap |
|---|---|---|---|
| `column-width` | ideal minimum column width — the responsive one | length | columns grow wider than it; one column below it |
| `column-count` | number (a MAXIMUM when width is also set) | integer · `auto` | count alone squeezes columns on a phone |
| `columns` | shorthand | `12em` · `3` · `3 12em` | |
| `column-gap` | gap, default `1em` (0 in flex/grid) | length · % · `normal` | |
| `column-rule(-width/-style/-color)` | line in the gap, takes no space | border-like | |
| `column-span` | heading across all columns | `none` · `all` | only all-or-nothing; makes a BFC; ancestors' borders/backgrounds can look odd |
| `column-fill` | balance or fill in order | `balance` · `balance-all` · `auto` | `auto` only matters with a set height |
| `column-height`, `column-wrap` | NEW (Level 2): rows of columns that wrap | length · `auto`/`wrap`/`nowrap` | check support |
| `break-before/after/inside`, `orphans`, `widows` | see Fragmentation | | |

**Traps:** with a fixed height, extra columns overflow SIDEWAYS (horizontal scroll — fails WCAG 1.4.10); reading down a
tall column then scrolling back up to the next is miserable on short screens (MDN suggests only applying columns when
`@media (height >= …)`); individual columns cannot be styled; images need `max-width: 100%`; WCAG 1.4.8 (doubled text must
not need scrolling).

**Example:**
```css
.article-body { columns: 2 22rem; column-gap: var(--space-6); column-rule: 1px solid var(--line); }
.article-body h2 { column-span: all; }
.article-body figure { break-inside: avoid; }
```

**Stored:** **PARTLY.** `advanced-css/04` (Natours popup `column-count: 2`), `advanced-css/README.md` **AC-19 — one text
flowing through columns is a recorded GAP**; `page-grid/03` mentions `column-span`. **Missing:** width-vs-count rules,
balancing, overflow-sideways trap, Level-2 `column-wrap`, columns-as-masonry reading order.

### 3.12 Fragmentation (and paged media, briefly)

`break-before` / `break-after` (`auto` · `avoid` · `avoid-page` · `avoid-column` · `page` · `left` · `right` · `recto` ·
`verso` · `column`), `break-inside` (`auto` · `avoid` · `avoid-page` · `avoid-column`), `orphans`, `widows` (only in
columns/pages), `box-decoration-break` (`slice` · `clone` — repeat padding/border on each fragment, also on wrapped inline
text). **Trap:** `avoid` is a request, not a guarantee. Paged media: `@page { size; margin }`, `:first/:left/:right`,
margin boxes (`@top-center`) — print only. **Stored:** **PARTLY** — `box-decoration-break` in `advanced-css/04`; break
properties only in raw CodePen dumps. Print is listed as Missing in the memory coverage map. **NOT STORED:** the break
values, `@page`.

### 3.13 Inline layout (and text alignment)

| Property | Effect | Trap |
|---|---|---|
| `vertical-align` | aligns an inline/inline-block/table-cell in its line (`baseline` · `top` · `middle` · `bottom` · `text-top` · `text-bottom` · `sub` · `super` · length · %) | no effect on blocks; `middle` is the x-height, not the box centre; the gap under an inline image is the baseline — `display: block` or `vertical-align: middle` removes it |
| `line-height` | height of line boxes; spaces lines | unitless numbers inherit correctly; a fixed length clips enlarged text |
| `text-align` (Text module) | places inline content in the line (`start` · `end` · `center` · `justify`) | `left/right` do not flip in RTL |
| `text-box-trim` / `text-box-edge` / `text-box` | trims the empty space above cap height and below baseline so a heading lines up exactly with a box edge | new (Chromium/Safari) — progressive |
| `initial-letter` | drop cap | partial support |
| `alignment-baseline`, `baseline-shift`, `dominant-baseline`, `baseline-source` | SVG/advanced baselines | |

**Stored:** **PARTLY** — `vertical-align` in `advanced-css/04/08`. **Missing:** `text-box-trim` (directly useful for "the
words sit exactly on the line"), the inline-image gap trap.

### 3.14 Transforms (as visual positioning)

**In plain words.** A transform moves, turns or scales the PAINTED box; the layout box stays where it was. Neighbours do
not move, so it is perfect for animation and for small optical nudges (centring with `translate: -50% -50%`), and wrong for
real placement.

| Property | Effect | Trap |
|---|---|---|
| `translate` / `rotate` / `scale` (individual) | move/turn/size; % of the box's OWN size | independent properties compose in a fixed order (translate → rotate → scale), easier for a builder than one `transform` list |
| `transform` | a list of functions (`translate()`, `rotate()`, `scale()`, `skew()`, `matrix()`, 3D) | order matters; replaces any earlier `transform` (two effects writing `transform` erase each other) |
| `transform-origin` | the pivot | default centre |
| `transform-box` | reference box (`content-box` · `border-box` · `fill-box` · `stroke-box` · `view-box`) | SVG mostly |
| `transform-style`, `perspective`, `perspective-origin`, `backface-visibility` | 3D | `perspective` also creates a containing block |

**Traps:** no reflow — a translated box can cover other content and nothing makes room; it creates a stacking context AND a
containing block for `fixed` children (#144); transformed overflow can create scrollbars; non-replaced inline boxes cannot
be transformed; text inside can blur at fractional offsets.

**Stored:** **COVERED** for the effect side — `advanced-css/01/04/06/08` (translate, transform-origin, 3D flip card,
skew), `motion/` library (transforms in animation), `advanced-css/02` (#144 containing block). **Missing:** only the
"transform is never placement" rule for the builder (§4) and individual-property composition order.

### 3.15 Images — `object-fit`, `object-position` (placing a picture inside its box)

`object-fit`: `fill` (default, distorts) · `contain` · `cover` · `none` · `scale-down`. `object-position`: like
`background-position` (keywords, %, lengths) — the focal point of a cropped photo. `object-view-box: inset(…)` crops/zooms
(new). **Trap:** no effect on `iframe`/`embed`; the box needs a size (or `aspect-ratio`) for `cover` to crop.
**Stored:** **COVERED** — `area-v/AXIS-MAP.md` and census (object-fit/position as axes), `advanced-css/04/08`, many motion
files. Missing only `object-view-box`.

### 3.16 Scroll snap

Container: `scroll-snap-type` (`none` · `x|y|block|inline|both` + `mandatory|proximity`), `scroll-padding(-*)` (inset of the
snap area — also where anchor links and focus land under a sticky header). Children: `scroll-snap-align`
(`none|start|center|end`, block then inline), `scroll-snap-stop` (`normal|always`), `scroll-margin(-*)`. Events
`scrollsnapchange`, `scrollsnapchanging`. **Traps:** `mandatory` on a container whose items are taller than the viewport
makes content unreachable — use `proximity` or keep items ≤ the viewport; snapping a whole page fights keyboard and
assistive tech; `scroll-padding-top` = header height is the WCAG 2.4.11 fix.
**Stored:** **COVERED** — `advanced-css/07`, `area-v/census`, `scroll-and-position/README.md` (`scroll-padding-top` for
pinned bars, partly built), `reference_scroll_snap_pager` memory, many codepen notes. Missing: the snap events.

### 3.17 Anchor positioning

**In plain words.** Name a box as an anchor; any `absolute`/`fixed` box can then sit beside it, size to it, and flip to the
other side when it would leave the screen — tooltips, menus, labels, callouts, a "note pinned to this picture" — without
JavaScript, and without being in the same parent.

| Property / function | Effect | Values | Trap |
|---|---|---|---|
| `anchor-name` | names a box as an anchor | `none` · `--name`(s) | duplicate names: the LAST in source order wins unless scoped |
| `anchor-scope` | limits name visibility to a subtree | `none` · `all` · `--names` | needed for repeated components (each card's own tooltip) |
| `position-anchor` | the default anchor of a positioned box | `auto` · `--name` | the box must be `absolute` or `fixed`; implicit anchors come from `popovertarget` / `commandfor` and customizable `<select>` |
| `position-area` | place on a 3×3 grid around the anchor | `top` · `bottom left` · `top span-right` · `block-end span-all` · `center` · logical forms | default size is max-content; centred areas take the anchor's width |
| `anchor()` | an edge of the anchor in an inset | `anchor(--a bottom)` · `start/end/self-start/self-end/center` · % · fallback | only valid in inset properties, and only on the matching axis |
| `anchor-size()` | the anchor's size in a size/inset/margin | `width/height/block/inline/self-*` | |
| `justify-self` / `align-self: anchor-center` | centre on the anchor | | |
| `position-try-fallbacks` | alternatives when it overflows | `flip-block` · `flip-inline` · `flip-start` · any `position-area` · `--custom` | |
| `position-try-order` | which fallback first | `normal` · `most-width` · `most-height` · `most-block-size` · `most-inline-size` | |
| `position-try` | shorthand | | |
| `@position-try --x { … }` | a named fallback | insets, margins, sizes, self-alignment, `position-area`, `position-anchor` | |
| `position-visibility` | hide when… | `always` · `anchors-visible` · `no-overflow` | |
| `container-type: anchored` + `@container anchored(fallback: flip-block)` | restyle per active fallback (flip the arrow) | | styles descendants only |

**Traps:** the anchor must be rendered (not `display: none`) and laid out before the positioned box; association
(`position-anchor`) ≠ positioning (`anchor()` can name other anchors); the positioned box is out of flow — it must not hide
content the user needs, and it is NOT keyboard-related to its anchor unless it is a popover/`commandfor` relation
(reading order still follows the DOM); support is new (Baseline 2026 per the stored research) — keep a non-anchored
fallback.

**Example:**
```css
.figure     { anchor-name: --pic; anchor-scope: --pic; }
.figure .note { position: absolute; position-anchor: --pic;
                position-area: block-end span-inline-end;
                position-try-fallbacks: flip-block, flip-inline;
                margin: var(--space-2); max-inline-size: 20rem; }
```

**Stored:** **PARTLY.** `scroll-and-position/04-sticky-fixed-exhaustive.md` §2.13 (properties named; SF-19 menus off a
sticky nav, LATER), `codepen/popover.md` / `hover.md` / `dialog.md` (examples), `motion/08`. **Missing:** `anchor-scope`
(needed for repeated components), `anchor-size()`, the `position-area` grid, try-order values, anchored container
queries, the use of anchors for free placement (§4).

### 3.18 Motion path

`offset-path` (`path()`, `ray()`, basic shapes, `url()`), `offset-distance` (0–100%), `offset-rotate` (`auto` · angle),
`offset-anchor`, `offset-position`, `offset`. Places a box along a curve — visual only, like transforms (no reflow,
stacking context). **Stored:** **PARTLY** — appears in motion/codepen notes as animation; no reference. A placement use (a
badge on an arc) is decorative only.

### 3.19 Table

`table-layout` (`auto` · `fixed` — fixed is faster and obeys set column widths), `border-collapse`, `border-spacing`,
`caption-side`, `empty-cells`, `vertical-align` in cells; `display: table`, `table-row`, `table-cell`, `table-caption`,
`table-row-group`, `table-header-group`, `table-footer-group`, `table-column(-group)`, `inline-table`. **Trap:** tables
for page layout are an accessibility failure; `display: table` on non-table markup is a legacy equal-height trick (grid
does it now). **Stored:** **PARTLY** — `display: table` in `advanced-css/04/08` (Natours popup equal heights);
`table-layout` NOT stored; sticky table headers are flagged for the Table component in `scroll-and-position/README.md`.

### 3.20 Viewport, environment variables, media queries

- **Viewport:** the layout viewport is the initial containing block for `fixed` and `vw/vh`; the visual viewport is what
  is on screen (pinch-zoom, keyboard). Units: `vw vh vi vb vmin vmax` and the `s` / `l` / `d` families (`svh` smallest,
  `lvh` largest, `dvh` live with the address bar). `zoom` property (now standard). **Traps:** under pinch-zoom `fixed` boxes
  stay glued to the layout viewport and can sit off-screen; `100vh` on phones is taller than the visible area (use `svh`/
  `dvh`); `100vw` includes the scrollbar → sideways scroll; never block zoom in the meta tag.
- **Environment variables:** `env(safe-area-inset-top|right|bottom|left, fallback)`, `safe-area-max-inset-*`,
  `keyboard-inset-*`, `titlebar-area-*`, `viewport-segment-*`. Needs `viewport-fit=cover`. Pad fixed bars with them on
  notched phones.
- **Media queries:** `@media (width >= 40em)`, `height`, `aspect-ratio`, `orientation`, `hover`, `pointer`,
  `prefers-reduced-motion`, `resolution`; range syntax; `device-*` features are deprecated. Use `em` breakpoints (they follow
  the user's text size) — the builder's ladder is in `em` (rule 18).

**Stored:** **PARTLY.** `svh` heroes and `100vh` vs `svh` in `scroll-and-position/README.md`; media queries in
`advanced-css/05` (ladder, `em`), `design-foundation/04`. **NOT STORED:** `env(safe-area-*)` (memory map says Missing),
layout-vs-visual viewport and fixed-under-zoom, `zoom`.

### 3.21 Gaps (decorations), overscroll, scroll anchoring, round display (brief)

- **Gaps:** `gap`, `row-gap`, `column-gap` for flex, grid, multicol; NEW gap decorations `row-rule`, `column-rule`, `rule`,
  `*-rule-break`, `*-rule-inset` — lines between cells without borders. **Stored:** PARTLY — `page-grid/04` A20 records
  `column-rule`/`row-rule` as gap G2; the new `rule-*` family is NOT STORED.
- **Overscroll:** `overscroll-behavior(-x/-y/-block/-inline)`: `auto|contain|none` — stops a scroll inside a panel chaining
  to the page. Behaviour, not placement. **Stored:** in memory map only.
- **Scroll anchoring:** `overflow-anchor: auto|none` — the browser keeps the view still when something above grows (e.g. a
  late image). Free for builders who set image sizes. **NOT STORED.**
- **Round display:** `shape-inside`, `border-boundary`, `@media (shape: round)` — no browser support. Nothing to build.

---

## 4. Ways to put a box exactly where you want it — ranked for a page builder

Ranking principle: a person says "put this here"; the builder must turn that into the mechanism that **survives every
screen width (reflow at 320 CSS px, WCAG 1.4.10), enlarged text (200%, WCAG 1.4.4, and 150% browser text in RULE Q),
keeps reading and tab order = visual order (WCAG 1.3.2, 2.4.3), and never covers content (2.4.11 focus not obscured)**.
The higher the mechanism, the more of that it gets for free.

| Rank | Mechanism | Right when | Breaks responsiveness / a11y when | Enlarged text |
|---|---|---|---|---|
| 1 | **Normal flow + margin / padding / gap** (the order of blocks + space around them) | always the default: stacks of blocks, words, sections. "Move it" = change its ORDER; "push it" = margin/padding (logical, rem); "push it to the far end" = `margin-inline-start: auto` in a row | almost never; only fixed heights or huge fixed margins (a 20rem left margin leaves no room at 320px — use `%`/`clamp` or `max()` caps) | grows naturally; everything below moves down. Best behaviour of all |
| 2 | **Flex** (rows/stacks with `gap`, `justify/align`, `flex-wrap`) | items in ONE direction that should wrap: nav links, button groups, a picture beside words | `order` / `row-reverse` change what you SEE but not what is READ or TABBED; `nowrap` rows overflow sideways at 320px | wraps to more lines; a `min-width: auto` item can refuse to shrink — emit `min-width: 0` |
| 3 | **Grid placement** (the page grid: column start/span, rows, named areas) | anything aligned to columns; "put it in columns 3–8"; overlapping two blocks in ONE cell (same area + `z-index`) is the safe way to layer | placing items in a visual order unlike the DOM (`grid-area` shuffles, `dense`) breaks reading order; fixed column tracks don't reflow — the builder's per-rung spans must collapse to 1 column below 600 | rows grow with content (`minmax(min-content, auto)`); cells don't overlap unless deliberately layered |
| 4 | **`position: relative` + small inset nudge** | an optical tweak of a few rem (a badge lifted 0.25rem, an outdented quote mark); also to make a box the containing block | large offsets leave a hole where it was and overlap neighbours; at 320px the nudged box can leave the screen | the nudge stays the same while text grows — fine for small values, risky for big ones; use `em` so it scales with the text |
| 5 | **`position: absolute` inside a positioned parent** (the "Floating" block in the builder: a badge on a card, a caption on a photo, a decorative shape) | decoration and small labels pinned to a corner or edge OF ITS OWN PARENT, with insets in `%` or `rem` | it is out of flow: the parent does not grow for it, so with enlarged text or a narrow screen it COVERS words; in the DOM it may be read in a surprising place. Rules: parent gets `position: relative` + enough padding to hold it; content boxes (with words) are never absolute — only decoration or short labels; check overlap at every rung (the page audit's overlap check) | does NOT reflow — the classic 1.4.4 failure. Size it in `em`, cap with `max-inline-size`, and on narrow rungs fall back to flow (`position: static`) |
| 6 | **`position: sticky`** (the builder's "Sticks when reached" / pin) | headers, a sidebar beside long content, a label column, section titles | dies inside an `overflow` ancestor or a short parent; a sticky header covers focused controls and anchor targets (needs `scroll-padding-top`); several stuck bars eat the screen on a landscape phone (1.4.10: content area too small) — unpin below a height/width | a stuck header grows with text and covers MORE content — cap its height, or unstick when `(max-height: …)` |
| 7 | **`position: fixed`** ("Floats on screen": chat button, cookie bar, back-to-top) | small, dismissible, edge controls; full-screen overlays (better: `<dialog>` / popover in the top layer) | covers content at every scroll position; under pinch-zoom it sticks to the layout viewport and can vanish; an ancestor with transform/filter/contain/container-type silently turns it into "absolute" (#144); notches need `env(safe-area-inset-*)` | grows over more content — keep tiny and dismissible; never put reading content in it |
| 8 | **Anchor positioning** (tethered to another block: tooltip, menu, callout on a picture, a note beside a word) | relationships: "this note belongs to that picture"; the browser keeps it attached and flips it on the edge (`position-try-fallbacks`) | out of flow (same overlap risk as 5); keyboard/reading relation only via popover/`commandfor`/`aria-describedby`; needs `anchor-scope` in repeated components; new — needs a fallback (`@supports not (anchor-name: --a)` → flow) | follows the anchor as it grows; flips when space runs out — better than 5 for anything attached to content |
| 9 | **Transform `translate`** | animation, and visual centring (`translate: -50% -50%`) of something already positioned; optical nudges in motion | nothing makes room — overlaps; makes a stacking context and a containing block (#144); it is NOT a placement tool: a "moved" block is still read and focused where it was | does not track text growth (except `%` of its own size); fine for motion, wrong for layout |
| 10 | **Float + `shape-outside`** | words flowing beside and under a picture, optionally round its shape (AC-8) — editorial pages | at 320px a float leaves a one-word sliver of text — turn it off with a container query below ~30rem; text order is fine (the float is in the DOM where it is) | text reflows around it naturally; a float sized in `%` stays proportional |
| — | Multi-column | one long text in newspaper columns (AC-19) | sideways overflow with a set height; long column reading on short screens | columns refill; with `column-width` they drop to one on a phone |
| — | Motion path, `writing-mode` side labels, `display: table`, tables for layout | decorative only / data only | vertical labels unreadable on phones; layout tables fail a11y | — |

**What this means for the builder's "put it wherever I want" promise.** The honest model is not one free-for-all canvas but
a ladder the inspector exposes in this order: (1) order + spacing (margin/padding/gap, each side, rem) — already the
builder's rule 3; (2) align within the row/stack/cell; (3) place on the page grid (column start/span — AC-37b, being built);
(4) "nudge" (relative, small, em); (5) "layer over" — overlap in a grid cell or absolute within the parent, decoration only,
with the overlap audit; (6) "stick" / "float on screen" (sticky/fixed — exists as pins); (7) "attach to another block"
(anchor positioning — NOT in the builder yet). Free x/y dragging should resolve to rungs 3–5 (grid cell + offset), never to
raw `absolute` page coordinates, or the page breaks at the first other screen width.

---

## 5. Stored-research status summary — layout modules

| Module | Status | Where / what is missing |
|---|---|---|
| Positioned layout (position, insets, z-index, stacking) | PARTLY | `advanced-css/02`, `scroll-and-position/*`, `page-grid/04` A18–A19 · missing full stacking-context and containing-block lists, logical insets |
| Sticky | COVERED | `scroll-and-position/01`, `04`, README (exhaustive) · missing only `overflow: clip` vs `hidden` |
| Display / normal flow / BFC / formatting contexts | PARTLY | `advanced-css/02` 8e · missing multi-keyword, `flow-root`, BFC list, `display: contents` a11y trap, `reading-flow`, IFC rules |
| Box model (margin, padding, collapsing) | PARTLY | `scroll-and-position/README`, `advanced-css/02`, `design-foundation/01` · missing the three collapse cases, `%` of width, `margin-trim` |
| Box sizing (intrinsic sizes, aspect-ratio, min/max) | PARTLY | scattered (`advanced-css`, `page-grid`) · missing a reference + flex/grid `min-width: auto` trap, `stretch` |
| Floats | PARTLY | `advanced-css/02–04` (historic float grid), AC-8 GAP · missing logical floats, flow-root clearing |
| Shapes | PARTLY | `advanced-css/04`, `area-v/AXIS-MAP` · missing reference boxes, clipping, narrow fallback |
| Logical properties | PARTLY | used in `page-grid`, `scroll-and-position` · missing mapping + physical-shorthand trap |
| Writing modes | PARTLY | `page-grid/02,04` (side labels AVOID) · missing reference, `dir` rule, RTL as RULE AF |
| Overflow | PARTLY | `motion/*`, `scroll-and-position` · missing scroll-container definition, coercion, carousel pseudo-elements |
| Containment & container queries | PARTLY | `motion/*`, `advanced-css/02` · missing side effects, style/scroll-state/anchored queries |
| Multi-column | PARTLY | `advanced-css/04`, AC-19 GAP · missing reference and traps |
| Fragmentation / paged media | **NOT STORED** (only `box-decoration-break`) | break values, orphans/widows, `@page` |
| Inline layout | PARTLY | `vertical-align` only · missing `text-box-trim`, `line-height` traps |
| Transforms (visual positioning) | COVERED | `advanced-css/*`, `motion/*`, #144 |
| Images (object-fit/position) | COVERED | `area-v`, `advanced-css` · missing `object-view-box` |
| Scroll snap | COVERED | `advanced-css/07`, `scroll-and-position`, codepen · missing events |
| Anchor positioning | PARTLY | `scroll-and-position/04` §2.13, `codepen/popover/hover/dialog` · missing `anchor-scope`, `anchor-size()`, area grid, try-order, anchored queries |
| Motion path | PARTLY (as motion only) | codepen/motion notes |
| Table layout | PARTLY | `display: table` trick only · `table-layout` missing |
| Viewport units / layout vs visual viewport | PARTLY | `svh` in `scroll-and-position` · fixed-under-zoom, `zoom` missing |
| Environment variables (safe-area) | COVERED | §3.20 + §7.10 (`env()` rules, fallbacks, every defined variable, sticky-footer pattern) |
| Media queries | COVERED | `advanced-css/05`, `design-foundation/04` |
| Gaps + gap decorations | PARTLY | `page-grid/04` A20 (G2) · new `rule-*` family missing |
| Scroll anchoring (`overflow-anchor`) | COVERED | §7.8 (default on, `auto`/`none`, no opt-back-in, suppression triggers) |
| Overscroll behaviour | **NOT STORED** in repo (memory map only) | |
| Round display | **NOT STORED** | no browser support — nothing to build |

---

## 6. Corrections to the fetched summaries (so nobody inherits a wrong line)

1. One summary said "any `position: absolute/fixed` element creates a stacking context". MDN's Stacking-context page:
   `absolute`/`relative` only **with `z-index` ≠ `auto`**; `fixed` and `sticky` always. Used the latter.
2. The Anchor-positioning landing summary showed an HTML `anchor="…"` / `position-anchor="…"` attribute example. The
   `anchor` attribute is **non-standard** (the Using page says so); there is no `position-anchor` HTML attribute.
   Implicit anchors come from `popovertarget`/`commandfor` and customizable `<select>`.
3. The Table summary listed `display: table-body`; the real value is `table-row-group`.
4. The Viewport summary said `vw/vh` are relative to the *visual* viewport; MDN's Viewport-concepts page says the
   **layout** viewport. Used the latter.
5. The `position` reference summary said `relative` creates a stacking context only with `z-index`, and that
   `absolute` "always" does — the second half is wrong (see 1).
6. The Transforms landing said transform lists apply "left-to-right"; the Using page says "right-to-left". Both describe
   the same maths (the rightmost function acts on the element first, i.e. read left to right as coordinate-space
   changes); the builder should use the individual `translate`/`rotate`/`scale` properties and avoid the question.

---

## 7. The linked sub-guides (read 2026-10-04)

Closes the "Linked but NOT read" line of §1. Each page was read **from MDN's own source** — the raw Markdown at
`raw.githubusercontent.com/mdn/content/main/files/en-us/<lowercased path>/index.md` (HTTP 200 on all 16) — not from a
summariser. Examples below are given in `rem` (16px base); MDN's own demos use px and are quoted as such only where the
number is the point. Every entry: URL · read · key facts · traps for a tool that GENERATES CSS · what it means for the builder
(a pointer, not a decision). Statements marked "not on the page" are mine, not MDN's.

| # | Page (under `developer.mozilla.org/en-US/docs/…`) | Read |
|---|---|---|
| 72 | `Web/CSS/Guides/Logical_properties_and_values/Basic_concepts` | fully |
| 73 | `Web/CSS/Guides/Logical_properties_and_values/Sizing` | fully |
| 74 | `Web/CSS/Guides/Shapes/From_images` | fully |
| 75 | `Web/CSS/Guides/Shapes/Shape_generator` | fully (the page is only a description of an interactive tool; the tool's own JS was not run) |
| 76 | `Web/CSS/Guides/Writing_modes/Writing_mode_systems` | fully |
| 77 | `Web/CSS/Guides/Writing_modes/Vertical_controls` | fully (prose read; the ~10 live-demo code blocks only set `writing-mode` / `direction` and were skimmed, not transcribed) |
| 78 | `Web/CSS/Guides/Scroll_snap/Using_scroll_snap_events` | fully |
| 79 | `Web/CSS/Guides/Scroll_anchoring/Overview` | fully |
| 80 | `Web/CSS/Guides/Images/Using_object-view-box` | fully (the pan demo's code is hidden live-sample source; the prose says it varies only the `x` of `xywh()`) |
| 81 | `Web/CSS/Guides/Environment_variables/Using` | fully |
| 82 | `Web/CSS/Guides/Media_queries/Using` | fully |
| 83 | `Web/CSS/Guides/Media_queries/Testing` | fully |
| 84 | `Web/CSS/Guides/Media_queries/Using_for_accessibility` (MDN's page is named *Using_for_accessibility*, not "a11y") | fully |
| 85 | `Web/CSS/Guides/Media_queries/Printing` | fully |
| 86 | `Learn_web_development/Core/Styling_basics/Overflow` | fully |
| 87 | `Web/API/CSSOM_view_API/Coordinate_systems` | fully |

### 7.1 Logical properties — Basic concepts (#72)
- **Facts.** The module maps physical properties (width/height, top/left/right/bottom) to flow-relative ones
  (start/end, inline/block). **Inline dimension** = the way a line of text runs (horizontal in English *and* Arabic, vertical in
  a vertical writing mode); **block dimension** = the way paragraphs stack (vertical in English/Arabic, horizontal in vertical
  modes). Flexbox and grid already align in these terms: `justify-self: start` is inline-start, `align-self: start` is
  block-start, so alignment survives a change of writing mode. MDN's demo: a grid with a *physical* `width` and
  `writing-mode: vertical-rl` looks different, because the width is a horizontal measure; with `inline-size` it behaves the
  same in every mode.
- **Traps.** Mixing physical sizes (`width`) with flow-relative alignment in one component gives a layout that is right in
  English and broken in a translated or vertical page. Arabic is horizontal RTL: the inline *direction* flips, the inline
  *dimension* stays horizontal.
- **Builder.** Emit sizes, spacing and alignment as logical properties by default so one stored layout serves LTR, RTL (RULE AF)
  and any vertical mode; keep a physical value only where the thing must not follow the text.

### 7.2 Logical properties — Sizing (#73)
- **Facts.** In `horizontal-tb`: `inline-size`=`width`, `block-size`=`height`, `min-inline-size`/`min-block-size`=`min-width`/
  `min-height`, `max-inline-size`/`max-block-size`=`max-width`/`max-height`. In a vertical mode `inline-size` maps to `height`.
  MDN: a design may use both kinds — some features should stay physical whatever the mode. `resize` also has logical keywords
  `inline` and `block` (`both` is neutral).
- **Traps.** `width: 12.5rem; height: 6.25rem` does not rotate in a vertical page, while `inline-size`/`block-size` rotate with
  the text; pick deliberately per property, never mix by accident.
- **Builder.** The size a person drags on the grid is an inline/block size; the exporter chooses the logical form (feeds §4's
  ranking and RULE Q's RTL combinations).

### 7.3 Shapes from images (#74)
- **Facts.** `shape-outside: url(image-with-alpha)` makes text wrap along the image's non-transparent pixels;
  `shape-image-threshold` (0.0 default = the area must be fully transparent to be excluded, 1.0 = fully opaque) sets which alpha
  counts; `shape-margin` pushes text away from the shape. The element must be **floated** (`float: left`) — MDN floats a
  `::before` with `content: ""` and a size to shape text without showing any image (the shape is independent of the displayed
  image). A CSS **gradient is also an image**, so `shape-outside: linear-gradient(to bottom right, rebeccapurple, transparent)`
  with a threshold works, and the same value can be shown as `background-image` or left undisplayed.
- **Traps.** The image **must be CORS-compatible** (CDN images need the right headers; opening the file from disk without a
  server fails) — otherwise the shape is ignored and only DevTools tells you. Wrap shaping only exists on floats, and a
  fixed-size shaped float on a 320px phone leaves no room for words: not on the page, but the narrow rung must drop the float.
  MDN's sizes (e.g. 400×300) are px — a generator must emit `rem`/`%`.
- **Builder.** A "text flows around the cut-out photo" option needs: float, same-origin or CORS-headed image, a threshold control,
  and a narrow-screen fallback to a normal stacked image (RULE AF: a second PNG just for the shape is bytes).

### 7.4 Shape generator (#75)
- **Facts.** A tool page that outputs coordinates for: the `coords` attribute of `<area>`, CSS `inset()`, `xywh()`, `rect()`,
  `circle()`, `polygon()`, and SVG `<rect>`/`<circle>`/`<polygon>`. You upload an image, choose a shape type, click points; it
  prints the three syntaxes. The page states no browser rules.
- **Traps.** None beyond the list of `<basic-shape>` functions.
- **Builder.** Confirms the set of basic shapes a "shape" control must cover (`inset`, `xywh`, `rect`, `circle`, `polygon`);
  `xywh()` takes a position + size like a grid placement (also used in §7.9).

### 7.5 Writing mode systems (#76)
- **Facts.** *Inline base direction* (set by `direction`, plus `unicode-bidi` and the text's own directionality) orders content
  on a line; *block flow direction* (set by `writing-mode`) is how blocks and lines stack. Latin/Slavic: LTR inline, top-to-bottom
  block. Arabic-based scripts (Arabic, Persian, Urdu, Hebrew, Kurdish, Syriac…): RTL inline, top-to-bottom block. Han scripts:
  often horizontal LTR online; traditionally vertical, top-to-bottom inline, **right-to-left** block (`vertical-rl`). Mongolian:
  vertical with **left-to-right** block (`vertical-lr`). Rules MDN gives: use the HTML **`dir` attribute** (and `<bdo>`) for
  direction rather than the CSS `direction` property, "because browsers can turn off CSS styling"; use `writing-mode` +
  `text-orientation` for vertical (`:lang(ja){writing-mode:vertical-rl;text-orientation:mixed}`,
  `:lang(mn-Mong){writing-mode:vertical-lr;…}`). `dir="auto"` lets the text decide. Mixed modes on one page are normal (Latin digits
  inside Arabic text; magazines).
- **Traps.** A generator that sets direction only in CSS loses it with styles off; `lang` + `dir` per page and per block (RULE AF
  "languages are content"). Not on the page, but follows from logical placement: in a `dir="rtl"` page grid column 1 sits on the right.
- **Builder.** Store language and direction per page/block and emit `lang`/`dir` attributes; test every grid placement with
  `dir="rtl"` (RULE Q matrix); vertical text is a rare option, not a default.

### 7.6 Vertical form controls (#77)
- **Facts.** `writing-mode: vertical-lr|vertical-rl` makes `<input type="range">`, `<progress>`, `<meter>`, `<select>`,
  `<button>`, `<textarea>` and text inputs vertical; Latin text inside is rotated 90 degrees, natively vertical scripts are not.
  `vertical-lr`: later lines appear to the right; `vertical-rl`: to the left. `direction: ltr` draws top→bottom, `rtl` bottom→top
  (a vertical slider with `ltr` has its lowest value at the top). **A `transform` rotation is the wrong tool:** it puts the control
  in its own layer and other content gets overlapped; `writing-mode` is the reliable one. Support: the property is old but
  *vertical form controls only gained full browser support in 2024*; older engines used non-standard `appearance: slider-vertical`
  (Chrome/Safari) or `orient="vertical"` (Firefox), and those only work on range inputs. `sideways-lr/rl` are experimental. MDN's own
  note: add a `<label>` to every control (its demos omit it).
- **Traps.** Low-cost Android WebViews lag: a vertical slider may render horizontal, so keep the control usable horizontally.
  Rotating with `transform` breaks layout.
- **Builder.** Not needed for the first grid release; if a vertical slider/progress is ever offered, use `writing-mode`, label it,
  and provide a horizontal fallback.

### 7.7 Scroll snap events (#78)
- **Facts.** Two events on a scroll container (and on `Document` / `Window` if `scroll-snap-type` is set on `<html>`):
  `scrollsnapchanging` fires *during* a gesture for the **pending** target (it can fire several times, and only for the target
  snapping will probably rest on — not for every target passed over); `scrollsnapchange` fires **when the gesture ends and a new
  target is selected**, just before `scrollend`. Both carry a `SnapEvent` with `snapTargetBlock` and `snapTargetInline` (element or
  `null`): a block-only snap axis leaves `snapTargetInline` `null`, an inline-only one the reverse, `both` gives both; which one
  changes also depends on the writing mode. Demos use `scroll-snap-type: block mandatory` and `both mandatory`,
  `scroll-snap-align: center`, a 7-column `repeat(7, 1fr)` grid as a two-axis scroller, and classes (`pending`, `select-section`)
  to restyle targets; animation by transition or `@keyframes`.
- **Traps.** MDN's own 2D snippet dereferences `event.snapTargetInline.id` and `snapTargetBlock.id` unguarded — that throws if one
  is `null` (and its second log message names the block target); guard for `null`. The events are new (MDN's see-also article is
  from 2024; support not listed on the page): treat as progressive enhancement — the snapping itself needs no JS. Restyling on
  events must respect `prefers-reduced-motion` (§7.13).
- **Builder.** A carousel/pager that highlights the current slide (dots, "2 of 5") can use `scrollsnapchange` with a
  scroll-position fallback; do not depend on it in older WebViews.

### 7.8 Scroll anchoring (#79)
- **Facts.** On by default: when content above the viewport changes size (late-loading images), the browser adjusts the scroll
  position so what you are reading stays put. Opt out with `overflow-anchor: none` (only values `auto`/`none`) on `body` or any
  container; **a descendant of an opted-out area cannot opt back in.** *Suppression triggers* — a change to the computed value of
  `top/left/right/bottom`, `margin`/`padding`, any width/height-related property, `transform`/`translate`/`scale`/`rotate` on the
  anchor node or an ancestor, or a `position` change anywhere inside the scroll container, suppresses anchoring. Debug: Firefox
  `layout.css.scroll-anchoring.enabled` and `.highlight` in `about:config`; a `scroll` listener that does not compensate is the
  usual culprit. Feature-detect with `@supports (overflow-anchor: auto)`.
- **Traps.** Animating size/margin/transform of something above the reader (an accordion, a sliding banner) turns anchoring
  off for that case, so the page can jump. Media with no intrinsic `width`/`height` causes the very jump anchoring then has to
  hide (not on the page; follows from its description).
- **Builder.** Always write `width`/`height` (or `aspect-ratio`) on media (already RULE AF); never turn anchoring off globally;
  only a deliberate "pin this block" needs `overflow-anchor: none`. Updates §5.

### 7.9 `object-view-box` (#80)
- **Facts.** Defines a rectangle inside a replaced element (`<img>`, video, svg) to display — crop, zoom and pan **without
  distorting**, because the viewbox is scaled to the element's size (its *extrinsic* size; the file's size is *intrinsic*). More
  flexible than `object-fit`, which only fits the whole content inside the box. Written with a `<basic-shape>`; MDN uses
  `xywh(500px 30px 150px 150px)` (x y width height). Smaller viewbox = zoom in, larger = zoom out; changing only `x`/`y` pans. Keep
  the viewbox aspect ratio equal to the element's, or the image stretches (MDN: same ratio ⇒ "neither scaled nor distorted").
- **Traps.** The lengths inside `xywh()` are measured in the **file's own pixels** (intrinsic area), not page units — the one
  place a px-like number is correct, and a generator must say so rather than convert it to `rem`. Browser support is not on the
  page: check before relying on it; `object-fit` + `object-position` cover the common crop.
- **Builder.** A "focal point / crop" control for photos on a grid cell: `object-fit: cover` + `object-position` (percent) is the
  safe default; `object-view-box` only as an enhancement.

### 7.10 Environment variables — Using (#81)
- **Facts.** `env()` reads **read-only, globally-scoped, user-agent-defined, case-sensitive** variables (custom properties are
  element-scoped and mutable). `env(<name>, <fallback>)`; a fallback is "generally recommended" and may contain commas; an unknown
  name uses the fallback; **no fallback and an unknown name makes the declaration invalid at computed-value time**. Usable anywhere
  a value is, including media-query rules and inside custom-property values. Defined: `preferred-text-scale` (e.g. 2 when
  `text-size-adjust: auto` would double the text), `safe-area-inset-top|right|bottom|left` (0 on rectangular unobstructed
  viewports), `safe-area-max-inset-*` (static maximum, when dynamic UI is retracted), `viewport-segment-*` (only on foldables with
  2+ segments), and from the Window Controls Overlay API `titlebar-area-x|y|width|height`, and `keyboard-inset-*` (VirtualKeyboard
  API). Names are physical (no logical equivalents). MDN's pattern: a sticky footer with
  `padding-bottom: calc(1em + env(safe-area-inset-bottom, 1em))`. Developer-defined env variables: not defined yet.
- **Traps.** Edge-pinned blocks (header, bottom bar, floating button) at offset `0` collide with notches and rounded corners;
  omitting the fallback can invalidate the whole declaration; `safe-area-inset-*` changes with dynamic bars, `-max-` does not. Not on
  the page: a browser may need the viewport meta `viewport-fit=cover` before insets are non-zero — verify before relying on it.
- **Builder.** For any block pinned to a viewport edge, add the inset to its offset/padding with a fallback; complements the
  `100svh` guidance in §3.20. Updates §5.

### 7.11 Media queries — Using (#82)
- **Facts.** A query = optional media type (`all` default, `print`, `screen`; other types deprecated) + media features in
  parentheses + logical operators `and`, `not`, `or` (limited), `only` (no effect in modern browsers); comma = OR. Queries are
  case-insensitive. Range features can be written `min-/max-` or in range syntax: `(width >= 30em)`, `(30em <= width <= 50em)`,
  `<` / `>` for exclusive. A feature written with no value is true unless its value is `0`/`none`. Features that don't apply to the
  device are false. Features include `hover`, `any-hover`, `pointer`, `any-pointer`, `orientation`, `prefers-reduced-motion`,
  `prefers-contrast`, `prefers-color-scheme`, `forced-colors`, `display-mode`, `device-posture`, `overflow-inline|block`, `scripting`,
  `update`, `resolution`; `device-width/height/aspect-ratio` are deprecated. `or` cannot sit at the same level as `and`/`not`
  (use parentheses). `not` negates only its own query (up to the comma); a query starting with a media type cannot be parenthesised,
  one made only of features must be. A `<link media>` stylesheet **still downloads** when the query is false (at lower priority).
- **Traps.** Write breakpoints in `em` (MDN's examples use `30em`/`50em`): a px query ignores the reader's text size (not on the
  page; the project's em rungs, CLAUDE.md rule 18, already follow this). Hover-only reveals belong inside `@media (hover: hover)`;
  touch phones answer `hover: none`. Per-breakpoint `<link media>` sheets cost requests on 3G (RULE AF) — inline one stylesheet.
- **Builder.** The generator uses range syntax with `em`; interactions gated by `hover`/`pointer`/`prefers-reduced-motion`;
  breakpoints are per rung (rule 18), not per device.

### 7.12 Media queries — Testing programmatically (#83)
- **Facts.** `window.matchMedia(query)` returns a `MediaQueryList`; `.matches` is the current result; instead of polling,
  `addEventListener("change", handler)` (the handler receives a `MediaQueryListEvent` with `.matches` and `.media`);
  `removeEventListener("change", …)` stops it. MDN: call the handler once at start, otherwise the code may assume the wrong state
  (e.g. portrait when it is landscape).
- **Traps.** Re-subscribing the listener on every render misses events (see the listener-churn note in memory); register once,
  with a ref.
- **Builder.** The editor's rung switch and any JS that must know the rung read the same queries as the CSS, so canvas == export.

### 7.13 Media queries — Using for accessibility (#84)
- **Facts.** `prefers-reduced-motion` has two values: `no-preference` and `reduce`. MDN: it does **not** mean "remove all
  animation" (`* { animation: none !important }` is the wrong reading); users expect *motion* animations — including
  interaction-triggered ones — to stop unless essential to function or to the information (WCAG "Animation from Interactions").
  Example: `@media (prefers-reduced-motion: reduce) { .animation { animation: none; } }`. See-also: `prefers-contrast`,
  `prefers-reduced-transparency`, `prefers-color-scheme`, `inverted-colors`. Reasons given: vestibular disorders, epilepsy,
  migraine, scotopic sensitivity, ADHD, and also low battery / low-end devices.
- **Traps.** A sticky/parallax/scroll-driven placement effect is exactly the motion affected; the replacement must still convey
  the content (a static position).
- **Builder.** Every animated or scroll-linked block ships a `reduce` branch; this is the RULE MAP "reduced-motion honoured" test.

### 7.14 Media queries — Printing (#85)
- **Facts.** Use `<link rel="stylesheet" media="print" href="print.css">` or `@media print { … }` (MDN's example hides
  `#header, #footer, #nav` with `display: none !important`); `@page` sets page size, orientation and margins for all or some pages;
  `beforeprint` / `afterprint` window events let the UI adapt; `window.print()` and a hidden iframe can print an external page.
- **Traps.** Not on the page: a grid placement built for 1280px will print across page breaks and fixed/sticky bars can repeat or
  overlap. A separate print `<link>` is a request on 3G (RULE AF) — prefer an inline `@media print` block.
- **Builder.** Low priority: one small `@media print` that drops navigation, shows blocks in source order as a single column, and
  avoids breaking inside a block (fragmentation is **NOT STORED**, §5).

### 7.15 Overflow (Learn) (#86)
- **Facts.** Overflow = too much content for a box. CSS does not hide it by default ("data loss" would go unnoticed — a
  disappeared Submit button); with a fixed `width`/`height` "CSS trusts you". Restricting the **block** dimension is the problematic
  one for text (more text than designed for, or the user enlarged the font). Values: `visible` (default), `clip` (cuts at the border
  edge, not a scroll container; `overflow-clip-margin` moves the edge outward), `auto` (scrollbar only when needed), `scroll` (bar
  always shown on systems with visible bars; MDN says `auto` + `scrollbar-gutter: stable` is usually a better fit to avoid layout
  shift), `hidden` (cuts like `clip` **but is still a scroll container** — content can be scrolled by JS or by tabbing to a
  focusable item). Per axis: `overflow-x` / `overflow-y`, or two values (`overflow: clip auto`). **Coercion:** `clip` is the only
  value that may be combined with `visible` on the other axis; if one axis is a scrolling value (`auto`, `scroll`, `hidden`) and the
  other `visible`, the `visible` computes to `auto` (`overflow: hidden visible` behaves as `hidden auto`). For long words use
  `word-break` / `overflow-wrap`, not `overflow-x`. MDN: "Test designs with large and small amounts of content. Increase and
  decrease font sizes by at least two increments." Use `clip` most of the time; `hidden` only when scrollability is needed.
- **Traps.** Never emit a fixed block-size on a text block; use `min-block-size` (200% text, 320px reflow). `overflow: hidden` on a
  wrapper silently makes it a scroll container — content tabbed to off-screen scrolls into view unseen; `clip` does not (the
  sticky-containing-block consequence is in §3 / `scroll-and-position/04`). Old fixed-height-container layouts are the classic
  source of overlap.
- **Builder.** Default `visible`; offer `clip` for "crop to the shape" (media, rounded corners) and `auto` for "scrolling box";
  never `hidden` by default. A block whose content outgrows its cell must grow, not clip.

### 7.16 CSSOM View — Coordinate systems (#87)
- **Facts.** Origin is top-left, x grows right, y grows **down**; the z-axis (`z-index`) points toward the viewer. Four systems that
  differ only in origin: **offset** (`offsetX/Y`, the target's *padding edge*), **viewport / client** (`clientX/Y`, top-left of the
  viewport; scrolling changes a point's client coordinates), **page** (`pageX/Y`, top-left of the whole document; stable under
  scroll unless layout changes), **screen** (`screenX/Y`, the user's screen; changes if the window moves or the display changes).
  `Touch` has client/page/screen coordinates (no offset). `transform` can change the definition of these systems.
- **Traps.** A drag-to-place tool that mixes `clientX` with a page offset drifts by the scroll amount. Coordinates are CSS px —
  convert to `%`/`rem`/track lines before storing (rules 16, AF). A transformed ancestor makes `offset*` and
  `getBoundingClientRect()` disagree about what is "inside" (MDN notes transforms can redefine the systems).
- **Builder.** Pointer-driven placement: read `clientX/Y` against the grid container's `getBoundingClientRect()` (viewport
  system), never page or screen; snap to grid lines and store tracks/lines, not pixels.

### 7.17 What §7 changes for positioning blocks on a grid
1. **Think in inline/block, not left/right** (7.1, 7.2, 7.5): store placement as grid lines/areas and sizes as `inline-size` /
   `block-size`; `dir="rtl"` (an HTML attribute, 7.5) then mirrors the grid for Arabic with no second layout.
2. **Never fix a block's height** (7.15): fixed block size clips or overlaps text at 200% text and 320px; use `min-block-size` /
   `auto` rows, and `clip` only where cropping is the point.
3. **Pointer placement uses the viewport coordinate system and stores tracks, not pixels** (7.16).
4. **Edge-pinned blocks add `env(safe-area-inset-*, fallback)`** (7.10), and **size/margin/transform animation above the reader
   suppresses scroll anchoring** (7.8) — two things a generated page can get wrong without any test failing.
5. **Breakpoints in `em`, hover/motion gated by media features, a `reduce` branch for every effect** (7.11–7.13).
