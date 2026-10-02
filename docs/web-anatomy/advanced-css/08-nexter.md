# Nexter — a whole page laid out with CSS Grid (the Grid project)

Advanced CSS and Sass, the Grid project ("Nexter", a home-buying company). Distilled from the transcripts the user
shared on 2026-10-01. Marked against the builder: `HAVE` · `PARTIAL` · `GAP` (README).

## The overall layout, part 1 — the parts, the markup, the row tracks

**Eight parts of the page:** a **sidebar** down the whole left side, top to bottom · the **header** (hero) · the top
three **realtors** beside it on the right · the **features** · a **story** in two halves (the **pictures** left, the
**content** right, different backgrounds) · the **homes** for sale · a **gallery** (a typical Grid use) · the **footer**.

**Markup:** `body.container` is the ONE grid container; every part is a direct child, a grid item:
`div.sidebar`, `header.header`, `div.realtors`, `section.features`, `div.story__pictures`, `div.story__content`,
`section.homes`, `section.gallery`, `footer.footer`. The story's two halves are BEM elements of a `story` block that
has NO element of its own — legal, and necessary: to be grid items they must be children of the grid, not of a wrapper.
Each part gets a temporary background colour (some final: the sidebar primary, the realtors the dark-blue secondary,
the story content light grey, homes and footer dark).

**The row tracks** — chosen per CONTENT, never a fixed pixel height:
- row 1 (header + realtors): **`80vh`** — a share of the window's height (shrinks with the window);
- row 2 (features): **`min-content`** (or `auto`, the default — the same here): as tall as its content, growing with it;
- row 3 (the story): **`40vw`** — a share of the window's WIDTH, so the band keeps its proportions as the window narrows;
- rows 4–6 (homes, gallery, footer): content-sized again → `grid-template-rows: 80vh min-content 40vw
  repeat(3, min-content)`.
- "Think responsive from the start": sizes that follow the content or the window, not media queries patching fixed
  pixels later. The columns — "a lot more complex" — and the placement are the next lecture.

**For the builder:**
- **the page as ONE grid** (every band a grid item, a sidebar spanning ALL rows beside them) → the builder's page is a
  STACK of bands, each band its own layout. A sidebar the whole height of the page beside every band is buildable as a
  row of [sidebar | stack of bands] (and a sticky sidebar exists — F1-b), but then the bands inside the stack no longer
  run the full width of the page, and a band cannot choose per band whether it sits beside the sidebar or under it. To
  confirm with the next lecture's columns, where Nexter's bands use the full-bleed / centred-column technique;
- **two halves of one section as separate cells, each with its own background** (the story) → `HAVE`: a row or a
  two-cell grid, each cell with its background, no extra wrapper needed;
- **rows sized by content** (`min-content` / `auto`) → `HAVE` (the default: height from content);
- **a row a share of the window height** (`80vh`) → **AC-3** (the builder offers *half* / *full* screen only — 80% is
  the same gap: any share of the screen height, with `svh`/`dvh` so a phone's browser bar does not cut it);
- **a band whose height is a share of the WIDTH** (`40vw` — a picture band that keeps its proportions as the window
  narrows) → `GAP`: `aspect-ratio` is written only for a picture's own shape (`imageSizing`, from the file's size); a
  BOX with a chosen ratio (16:9 hero, 2:1 story band, square tiles) holding a background picture and content cannot be
  set. With rule 16 the right unit is `aspect-ratio` on the box (it follows the box's own width, not the window's —
  `40vw` is wrong inside anything narrower than the window), and a minimum height so text inside never overflows on a
  phone. **AC-34.**

## The overall layout, part 2 — the column tracks: a centred 8-column grid, full-bleed, and half-bleed

**Building the column template step by step:**
1. `repeat(8, 1fr)` — eight equal columns over the whole window (a design grid like Bootstrap's 12; "not strictly
   needed here, but widely used");
2. the content should stay a fixed width, CENTRED: ~1140px / 8 ≈ `14rem` a column — fixed, so it does not adapt; then
   **`repeat(8, minmax(min-content, 14rem))`** — at most 14rem, shrinking down to the content's minimum;
3. the **sidebar** column first: `8rem`;
4. **a `1fr` column each side** of the eight, taking the remaining space — the eight centred between the sidebar and the
   window edge (`margin: 0 auto` or `justify-content` would not do it with a sidebar, and would not allow the next
   point);
5. those side columns make **FULL-BLEED sections** possible: a section can run from the sidebar to the window edge
   while others stay in the centred eight — "a trend in web design";
6. **named lines:** `[sidebar-start] 8rem [sidebar-end full-start] minmax(6rem, 1fr) [center-start] repeat(8,
   [col-start] minmax(min-content, 14rem) [col-end]) [center-end] minmax(6rem, 1fr) [full-end]` — the side columns
   became **`minmax(6rem, 1fr)`** at the end, so the content never touches the sidebar or the window edge: the eight
   columns shrink instead.

**Placing the parts** (only the columns are named — "in an overall layout the columns matter; rows can just fit the
content"):
- sidebar: `sidebar-start / sidebar-end`, rows `1 / -1` (the whole height);
- features and homes: `center-start / center-end` (the centred eight);
- gallery and footer: `full-start / full-end` (full-bleed);
- **header `full-start / col-end 6`, realtors `col-start 7 / full-end`** — six of the eight columns for the header, two
  for the realtors, each BLEEDING to its outer edge;
- **story pictures `full-start / col-end 4`, story content `col-start 5 / full-end`** — split on the CENTRE line of the
  eight: the two halves bleed to the edges while their inner edges sit on the content grid.

**For the builder:**
- **a centred content width with full-bleed backgrounds** → `HAVE`: a band's background runs edge to edge while its
  content keeps the contained inset (`bandGutter`, `pageBandInset`); **one site-wide content width** is **AC-9**;
- **a minimum gutter that never collapses** (`minmax(6rem, 1fr)`) → `HAVE`: space by default — the side gutter is a
  floor in `rem` with a fluid term, measured by the page audit (no words closer than the gutter floor to the edge);
- **some sections full-bleed, others centred, on one page** → `HAVE` per band (*contained* / *full width* content);
- **a sidebar the whole height of the page beside every section** → `HAVE` as a row of [sidebar | stack of bands]:
  bands inside the stack run from the sidebar to the window edge (= `full-start / full-end`), and the sidebar can pin
  (F1-b); part 1's doubt closes here. Whether it collapses sensibly on a phone (Nexter makes it a top bar later) is the
  sidebar → top-bar line of Trillo responsive part 1;
- **HALF-BLEED: one part bleeds to the window edge while its INNER edge lines up with the centred content** (the header
  to `col-end 6` beside the realtors; the story picture to the left edge with the text starting on the content grid's
  centre line) → `GAP`: a band is either contained (both sides inset) or full width (both sides bleed); a two-cell row
  across a full-width band splits the WINDOW in half, so the text cell's words start at the window's centre plus a
  gutter, not on the content column — and they drift from the content edge of the sections above and below as the
  window widens. One of the commonest editorial and landing-page patterns in the crawl (picture bleeding off one side,
  text aligned to the page). **AC-35** — the content grid as named lines on every band (Nexter's template), so any cell
  can start or end at "the edge" or "the content edge".

## The features section, part 1 — a grid inside a grid, (no) subgrid, the content

- **Six features in a 3 × 2 grid.** Emmet `.feature{Feature $}*6` writes six numbered placeholders.
- **A grid item can be a grid container too** (as a flex item can be a flex container): `.features { display: grid;
  grid-template-columns: repeat(3, 1fr) }` — rows not defined at all (`auto auto` is what happens anyway; every item
  lands in the IMPLICIT grid, dotted lines in Firefox — "works just the same").
- **Subgrid** — then only in the Level 2 draft: a nested grid whose tracks SNAP to the parent's (a feature column
  spanning exactly two of the page's eight columns). Not available in 2018, so the inner columns are made by hand.
  *(Today, 2026: `grid-template-columns: subgrid` / `grid-template-rows: subgrid` ship in every current engine —
  Chrome/Edge 117+, Firefox 71+, Safari 16+.)*
- The section: `margin: 15rem 0`, `gap: 6rem`; the testing styles (padding, big font, colours) removed.
- **Each feature:** an SVG icon from a sprite (`<svg class="feature__icon"><use xlink:href="img/sprite.svg#icon-global">`
  — icon-global, -trophy, -map-pin, -key, -presentation, -lock), an **`h4.heading-4`** (a REUSABLE heading style, not
  part of the feature block) and a `p.feature__text`; texts of DIFFERENT lengths on purpose (it matters later). The
  heading hierarchy is set for the page: h1 the hero title, h2 / h3 section titles, h4 these small headings.

**For the builder:**
- a grid nested in a grid cell → `HAVE` (any container nests in any other: grids in cells in stacks in rows, the
  "complicated tier" of RULE Q);
- a section of three-across features with generous space → `HAVE` (a grid block, gap and section space from the tokens);
- the heading LEVEL chosen by the page's outline, its LOOK by a reusable style → `HAVE` (decision B1: heading levels
  follow the page; the visual size is a separate text style);
- icons → `HAVE` (inline SVG with `currentColor`, em-sized — `feedback_phase1_responsive_themed`);
- **subgrid** → `GAP` (checked: `subgrid` appears nowhere in `lib/` or `components/`). Two uses that real pages need:
  (1) **columns**: a nested grid's cells lining up with the page's content columns (Nexter's case, and AC-35's
  half-bleed in a nested box); (2) **rows — the bigger one for a builder**: a row of CARDS whose titles, texts and buttons
  line up ACROSS the cards even when the texts differ in length (`grid-row: span 3; grid-template-rows: subgrid` on each
  card). Today each card is its own box, so a two-line title pushes that card's text and button lower than its
  neighbours'. **AC-36.**

## The features section, part 2 — styling, a three-cell grid per feature, `align-items: start`, auto-fit

- **Files:** each section has its own Sass file; the reusable `.feature` component lives beside `.features` because they
  are closely related, though it is independent of it.
- **Styles:** text `1.7rem`; icon `fill: var(--color-primary)` (gold), `4.5rem` square; the headings `.heading-1…4`
  share `font-family: var(--font-display)` (Josefin Sans) and weight 400 through a **Sass placeholder + `@extend`**
  (`%heading`; an extend copies the SELECTORS into one rule — a mixin copies the DECLARATIONS into each). `heading-4`
  `1.9rem` with **modifiers** `--light` (grey-light-1, on dark sections) and `--dark` (grey-dark-1) — one heading style,
  two colours.
- **Each feature is itself a grid** (a grid in a grid in a grid): `grid-template-columns: min-content 1fr` (the icon
  column as wide as the icon — change the icon's size and the column follows), rows left to the content; the icon
  **`grid-row: 1 / span 2`** — beside the heading AND the text, so the first row is not stretched to the icon's height.
  **`-1` did not work:** it means the last line of the EXPLICIT grid, and with no rows defined there is none — use
  `span 2`. Gaps `1.5rem` (rows) and `2.5rem` (columns); the icon nudged up `translateY(-1rem)` to line its centre up
  with the heading (optical alignment, by eye).
- **Uneven texts:** a feature with three lines sat in a row as tall as its four-line neighbour, and STRETCHED to fill it
  (`align-items` defaults to `stretch`); **`align-items: start`** on `.features` lets each feature be its own height
  at the top of its cell (`end` / `center` shown and rejected).
- **Responsive, no media query:** `grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr))` — 3 across → 2 → 1 as
  the window narrows, each feature at least 25rem; `align-items: start` matters even more then.
- "Grid is not only for big layouts": any two-dimensional piece, however small — Flexbox here would need margins to
  space the heading from the text.

**For the builder:**
- a heading style with light / dark variants → `HAVE`: text styles are separate from colour, and colours come from
  tokens; on a dark band the text uses the on-colour token (contrast asserted, rule 17);
- **the "media object"** — an icon beside a heading and its text → `HAVE` as a row [icon | stack(heading, text)], the
  icon column as wide as the icon (it hugs); the course's single three-cell grid needs no inner stack, the builder's
  needs one group — both publish fine;
- **optical nudges** (`translateY(-1rem)` to line an icon up by eye) → `PARTIAL`: a block can be placed at the start /
  centre / end of its line; a small offset is a FLOAT's job today. A *nudge* on a block in the flow — a translate that
  moves the picture without moving anything else — is a minor control for the layout DoD to consider (with negative
  spacing, AC-10);
- items aligned at the top of their cells instead of stretched → `HAVE` (per block *Place: top*); with a background on
  each feature the difference shows, and the grid-wide setting is the "to confirm" line of the item-alignment lecture;
- **`repeat(auto-fit, minmax(25rem, 1fr))`** → **AC-33** again — the course uses it as the DEFAULT for a features grid,
  the most common section on a school site; the builder steps a fixed count at window rungs instead.

## The story section, part 1 — the content side: headings, a button, spacing utilities, centring with Flexbox OR Grid

- **Markup:** `h3.heading-3` "Happy Customers" ABOVE `h2.heading-2.heading-2--dark` "“The best decision of our lives”"
  (curly quotes with `&ldquo;` / `&rdquo;`), `p.story__text`, `button.btn` "Find your own home". Reusable styles
  (`heading-*`, `btn`) are named for themselves; the text is named for the block.
- **Styles:** the content box padding `6rem 12rem`; `heading-2` `4rem` italic (the 400 italic loaded from Google
  Fonts), `line-height: 1` (the body's 1.6 opened big gaps in a large heading), light / dark modifiers like `heading-4`;
  `heading-3` `1.6rem`, gold, uppercase; the text `1.5rem` italic.
- **The button** (in typography): gold background, white text, `border: none; border-radius: 0` (buttons come rounded
  by default), the display font, `1.5rem`, uppercase, padding `1.8rem 3rem`, `cursor: pointer`, on hover the darker
  gold, `transition: background-color .2s` (it first failed for a missing `s`).
- **Spacing:** NOT hard-coded on the reusable headings (the right margin here is wrong elsewhere) — **utility classes**
  `.mb-sm` 2rem · `.mb-md` 3rem · `.mb-lg` · `.mb-hg` (the project may grow); the non-reusable text gets its own
  `margin-bottom: 4rem`. A nod to **Atomic CSS** (pages styled only with small single-purpose classes) — useful in
  places, too much as the whole method.
- **Centring the content vertically in its cell:** a ONE-dimensional stack, so Flexbox: `display: flex;
  flex-direction: column; justify-content: center` — the button then stretched across (`align-items: stretch`) →
  `align-items: flex-start`. **Or Grid:** `display: grid; align-content: center; justify-items: start` — three lines
  instead of four, kept, though Grid for a one-dimensional layout is "a bit counter-intuitive".
- The side padding as **`8vw`** instead of `12rem`, so it shrinks with the window ("a really helpful unit").

**For the builder:**
- **a small label ABOVE the section heading** (an "eyebrow": "Happy Customers" over "The best decision of our lives")
  → the course marks it `h3` before `h2` — that BREAKS the outline (a lower-level heading before its parent). The
  builder's semantic auto-correct (decision B1/C1) should catch it, and the eyebrow should publish as a styled `p` (or
  inside an `hgroup` with the heading — the WHATWG pattern for a heading plus its subtitle / kicker, stored in
  `docs/web-anatomy/html-semantics.md`). To confirm the audit flags an `h3` before its `h2` — a common mistake a
  teacher will make the same way. (Related: **AC-4**, one heading in two styled lines.)
- `line-height: 1` for big headings → `HAVE` in the type scale (headings take a tighter line height than body text —
  Rule #1 of the deck);
- the button → the Button component (radius from `radiusCSS`: square until a design asks for rounding — the builder's
  default matches the course's `border-radius: 0`); transition a NAMED property (the Trillo lesson);
- **spacing utilities vs. a margin on a reusable element** → `HAVE`, and better: the space BETWEEN blocks is the
  container's gap and a block's own outer spacing is per block, so a heading carries no margin that is wrong somewhere
  else (space by default, always overridable);
- **content centred vertically in its cell, the button keeping its own width** → `HAVE`: *Content position* (middle)
  on the cell; and a BUTTON block hugs by itself — checked: `childStyle` gives every non-container block with an auto
  cross size ("Fit") `align-self: start` instead of the parent's stretch ("HUG, don't stretch… a short heading /
  button"), which also closes the Trillo user-reviews "to check" line for button blocks (`HUGS_BY_NATURE` is only for
  COMPONENTS that hug: stat / badge / rating);
- side padding that shrinks with the window → `HAVE`: inner spacing is fluid (`clamp(rem + vw)`), better than a bare
  `8vw` because it keeps a `rem` floor and follows the reader's text size (rule 16).

## The story section, part 2 — two overlapping pictures placed on a 6 × 6 grid

- **Markup:** `img.story__img--1` (a couple with their new house) and `img.story__img--2` (the house), both
  `width: 100%` (images always get a % width so they stay flexible).
- **The pictures box is a 6 × 6 grid** (`repeat(6, 1fr)` both ways) — so a picture can take 4/6 of it (two thirds) with
  one sixth free each side.
- **Image 1:** `grid-row: 2 / 6; grid-column: 2 / 6`. It did NOT fill its area: **images keep their intrinsic aspect
  ratio** (a `div` would fill the whole area) — so `align-items: center` on the grid centres each picture in its area
  (the small one too).
- **Image 2:** `grid-row: 4 / 6; grid-column: 4 / 7` — from the middle out to the right edge, **`width: 115%`** so it
  runs PAST the pictures box into the content half next to it (a `scale()` would grow it from its centre, needing a
  `transform-origin`), and **`z-index: 20`** so it sits on top of the neighbouring item.
- **Shadows:** `0 2rem 5rem rgba(black, .1)`, the overlapping one `.2` (it sits on the light content side).
- **Background:** `background-image: linear-gradient(rgba(primary, .5), rgba(primary, .5)), url(../img/back.jpg)` — a
  gradient from a colour to THE SAME colour is a flat translucent tint over the photo, so it fits the colour scheme.
- Absolute positioning could have done it; the grid keeps it in the flow.

**For the builder:**
- pictures that keep their own proportions → `HAVE` (`imageSizing`: `aspect-ratio` from the file's size, height auto),
  centred or placed in their cell per block; a picture made to FILL its cell instead is its *fit* (cover / contain);
- **a section background picture with a brand-colour tint** → `HAVE` (a band's picture background with an overlay in a
  token colour and strength);
- shadows → `HAVE` (the shadow tokens; the overlap needs the stronger one — a design-system detail);
- **two pictures overlapping inside a grid, the front one running out of its own section into the next one, on top** →
  **AC-31** (two blocks layered in one grid area, in the flow) plus a new edge to it: a block that **overflows its cell
  across into the NEIGHBOURING cell** (`width: 115%` + `z-index`) — today the builder keeps a block inside its cell, or
  floats it. The "collage" pattern (AC-21: the Natours composition; this one) is common on landing pages; on a phone it
  must fall back to the pictures stacked or the tidy one alone, never an overflow off the screen (RULE AF / RULE Q).

## The homes section, part 1 — six cards in an auto-fit grid, and the card's content

- **The grid:** `.homes { display: grid; grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr)); gap: 7rem;
  margin: 15rem 0 }` — the features' responsive trick again; each `.home` card light grey.
- **Each card's content:** `img.home__img` (house-1 … 6), an SVG **like** heart (`svg.home__like`, `icon-heart-full` — to
  add the home to a wish list), `h5.home__name` (a NON-reusable heading for this block only), four details —
  `div.home__location` / `__rooms` / `__area` / `__price`, each an icon (map-pin, profile-male, expand, key) + a `p`
  (no element classes inside: `.home__location svg` and `.home__location p` are enough) — and `button.btn` "Contact
  realtor" (the reused button). Six homes: Beautiful Family House (USA, 5 rooms, 325 m², $1,200,000) · Modern Glass
  Villa (Canada, 6, 450, $2,750,000) · Cozy Country House (UK, 4, 250, $850,000) · Large Rustic Villa (Portugal, 6, 480,
  $1,950,000) · Majestic Palace House (Germany, 18, 4,230, …) · Modern Family Apartment (Italy, 3, 180, $600,000).
- First styles: images `width: 100%`; the detail icons `fill: var(--color-primary)`, `2rem` square. Laying the card
  out is the next lecture.
- *(Two slips in the lecture: the "2" of m² was written with `<sub>`, which LOWERS it — a superscript is `<sup>`, or
  the character `²`; and the heading jumps to `h5` for the card name.)*

**For the builder:**
- the card grid → **AC-33** (the third time the course uses auto-fit as the default for a grid of cards);
- **the property / listing card** (picture, a like / save toggle, a title, an icon-and-value details list, a call to
  action) → the **Card component** with a "details list" part and a toggle action — component area,
  `docs/COMPONENT_GAPS.md`. When built, from the research: the heart is a real `<button>` with an accessible name
  ("Save Beautiful Family House") and `aria-pressed`, never a bare SVG; the details are a **`dl`** (term + value) or a
  list, the icons `aria-hidden`; units written `m²` (a superscript, never `<sub>`), prices in the visitor's currency
  format (RULE AF: ₦ / GH₵ and local grouping);
- **heading level for a card title** → `HAVE` by decision B1: the level follows the page outline (here an `h3` under the
  section's `h2`), never a free `h5`; the look comes from the text style;
- **a detail row of icon + text without inner classes** → `HAVE`: icon + text in a row, each its own block.

## The homes section, part 2 — the card laid out with Grid: overlaps, self-alignment, uneven gaps, Flexbox inside

- **The card is a two-column grid** (`repeat(2, 1fr)`, rows implicit): the picture, the name and the button
  (`.home__btn` added beside `.btn`) span `1 / -1`; the four details fill the cells two by two.
- **The heart ON the picture:** placed in the picture's own cell — `grid-row: 1 / 2; grid-column: 2 / 3` — and the
  picture must be pinned to row 1 too (auto-placement never stacks items, it pushed the picture down); `z-index` 1 on the
  picture, 2 on the heart; **`justify-self: end`** pushes it right, `margin: 1rem` off the corner; the icon a bit bigger.
- **The name label across the bottom edge of the picture:** display font, `1.6rem`, centred, padding `1.25rem`, dark
  blue, white text, weight 400; `width: 80%` + `justify-self: center`; placed in row 1 OVER the picture (a row of its
  own would leave a half-empty row), `align-self: end` (not `bottom`) to sit at the picture's foot, then
  **`transform: translateY(50%)`** — half its own height — so it straddles the edge.
- **Uneven gaps:** `row-gap: 3.5rem`, but the label's overhang ate into the first gap; **a single gap cannot be sized on
  its own** (all row gaps are equal), so the first two details get `margin-top: 2.5rem` (rejected: making one row taller).
- **The details:** `1.5rem` (inherited by the text), `margin-left: 2rem`; each one **`display: flex; align-items:
  center`** (Flexbox for small one-line alignment — "always the easiest"), the icon `margin-right: 1rem` because
  "Flexbox has no gap" — *(since 2021 it has: `gap` works in Flexbox in every current engine.)*

**For the builder:**
- the card's internal layout → the **Card component** (picture, a toggle in its corner, a label straddling the picture's
  edge, a two-across details list, a full-width action) — component area; each technique it uses mapped here:
- **a block in the picture's corner, on top** (the heart) and **a label straddling the picture's bottom edge** → in the
  page layout these are **AC-31** (layered in one area) and **negative spacing / nudge** (AC-10: a translate by half its
  own height); inside the Card component they are parts the component positions itself;
- `justify-self` / `align-self` for one item → `HAVE` (*Place in the cell* per block: start / centre / end);
- **one gap bigger than the others** → `HAVE`, and without the course's workaround: a block's own outer spacing (margin)
  is per block and per side, on top of the container's gap — and the "pass" is visible as a control;
- **icon + text side by side, centred, a gap between** → `HAVE`: a row with *Line up: centre* and a GAP (the builder
  writes `gap` for flex rows too — what the course could only wish for in 2018).

## The gallery, part 1 — a mosaic on a fine grid, `object-fit: cover`

- **A gallery that SHOWS its grid:** pictures of different shapes and sizes (portrait, square, wide, large) all aligned
  to one underlying grid — "extremely difficult without CSS Grid".
- **Choosing the tracks:** start from the SMALLEST picture — one column wide and one row high is the unit; bigger
  pictures span several (2 × 2, 4, 6, 9 cells). More tracks = more variety of shapes. Found by experiment (10 × 10 →
  8 × 8 → **8 columns × 7 rows**).
- `grid-template-columns: repeat(8, 1fr)`; `grid-template-rows: repeat(7, 5vw)` — the rows in **`vw`** so every cell
  keeps its proportions as the window narrows (the alternative: a fixed height for the whole gallery row and `1fr`
  rows).
- `gap: 1.5rem` and **`padding: 1.5rem`** — the gap is only BETWEEN tracks, so the padding gives the same gutter
  round the outside.
- **Images do not fill grid areas** (their intrinsic aspect ratio again; huge files even blew the grid to 2000px wide
  in Firefox until a `width: 100%`). The fix: each picture in a **`figure.gallery__item`** (the figure is the grid
  item) and the image **`width: 100%; height: 100%; object-fit: cover; display: block`** — `object-fit: cover` crops the
  picture to fill its box like `background-size: cover`, and it only works when BOTH width and height are set
  ("half an hour" lost on that); `block` removes the inline gap under it.
- Item 1: `grid-row: 1 / span 2; grid-column: 1 / span 2` — exactly its area. The rest in part 2.

**For the builder:**
- **a picture that fills its cell, cropped** → `HAVE`: a picture's *fit* (cover / contain) with width and height set by
  the engine, block-level, published as `figure` (+ `figcaption` when there is a caption);
- **gap inside, the same gutter outside** → `HAVE` (a container's inner spacing and gap from the same tokens);
- **a mosaic of mixed spans on a fine grid** (8 × 7) → `PARTIAL`: column spans and row spans on up to twelve columns
  exist; the MASONRY variation (`aa6d32f`) handles equal-width columns of varying height; but a mosaic needs rows of a
  FIXED height that scales with the width, so a 2 × 2 cell is always a square — rows today are content-sized with an
  optional `rem` minimum. That is **AC-34** (a box / track with a chosen proportion — the row unit as an aspect ratio of
  the column, not `vw`, so it follows the gallery's OWN width) — widened to grid rows. Holes left by the spans are
  **AC-32** (`dense`). On a phone the mosaic must reflow (fewer columns, spans clamped) rather than shrink to postage
  stamps — part of the same decision (RULE AF: a 360px screen).

## The gallery, part 2 — placing all fourteen pictures

- **Markup in one Emmet line:** `(figure.gallery__item.gallery__item--$>img.gallery__img[src="img/gal-$.jpeg"
  alt="Gallery image $"])*14` — attributes in square brackets, `$` numbering the class, the file and the alt text.
- **The placements** (row / column, from the Firefox line numbers): 1 `1 / span 2 · 1 / span 2` · 2 `1 / span 3 ·
  3 / span 3` · 3 `1 / span 2 · 6 / 7` · 4 `1 / span 2 · 7 / -1` · 5 `3 / span 3 · 1 / span 2` · 6 `4 / span 2 ·
  3 / span 2` · 7 `4 / 5 · 5 / 6` · 8 `3 / 4 · 6 / 8` (approx.) · 9 `3 / span 3 · 8 / -1` · 10 `6 / span 2 · 1 / 2` ·
  11 `6 / 8 · 2 / 4` · 12 `6 / 8 · 4 / 5` · 13 `5 / span 3 · 5 / span 3` · 14 `6 / span 2 · 8 / -1`. Every cell of the
  8 × 7 grid is covered — "boring, but a thousand times worse without Grid".
- **Without `object-fit`:** pictures at their own proportions overflow and overlap their areas (a mess); with
  `height: 100%` but no `object-fit` they fill the areas but STRETCH (distorted faces and houses); `object-fit: cover`
  fills AND keeps the proportions, cropping the excess.

**For the builder:**
- placing fourteen pictures by line numbers is exactly the work the builder exists to remove: a person drops pictures
  into a grid and drags each one's edges to span cells — but a mosaic like this one needs the grid's row unit to be a
  fixed proportion (**AC-34**), spans on BOTH axes (`HAVE`), no holes (**AC-32** or careful spans) and a phone fallback;
- a ready-made **mosaic gallery** (a few layouts of mixed spans to choose from, the pictures dropped in) belongs in the
  **Gallery component** with its variations (RULE S: shown as live previews), so nobody places fourteen cells by hand —
  component area, built on the layout features above;
- **never distort a picture** → `HAVE`: the builder never sets a picture's width and height without its *fit* (cover /
  contain) or its own `aspect-ratio`; the stretched-photo case cannot be produced. Worth a guard in the catalogue
  enumeration if one does not exist (every picture path emits either `aspect-ratio` or `object-fit`) — to check when the
  layout DoD is written.

## The footer — a link list in an auto-fit grid, a centred copyright line

- **Markup:** `ul.nav` (first written as a `nav` — an `li` must sit in a `ul`/`ol`) of `li.nav__item > a.nav__link`:
  Find your dream home · Request proposal · Download home planner · Submit your property · Come work with us; then
  `p.copyright`. The footer gets padding.
- **The links side by side — with GRID, though it is one-dimensional:** "Flexbox has no gap" (margin-right on all but
  the last), Grid has: `display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 2rem;
  align-items: center` — six across → three by two → one column, no media query (`20rem` first; it broke too early).
- **Links:** `:link, :visited` `1.4rem`, white, no underline, display font, uppercase, centred, `display: block;
  padding: 1.5rem`; on `:hover, :active` a background of **white at a tiny alpha** (a slightly lighter blue on the dark
  footer) and a small `translateY` lift, `transition: all .2s`.
- **Copyright:** `1.4rem`, grey-light-2, `margin-top: 6rem`, centred, `width: 70%` + `margin: 0 auto` to centre the
  narrower block.

**For the builder:**
- a footer of links that reflows → `HAVE` as a wrapping row of Link blocks (menu lines keep their gap, 1rem on a phone —
  F-1) — and with **AC-33** it could be the course's auto-fit grid of equal cells; to confirm in the UAT that a footer
  link list publishes as **`nav` > `ul` > `li` > `a`** (a list of links is a list — the semantics research; the
  course itself had to fix `nav > li`);
- **a translucent highlight on hover** → the hover effects (*Brighten*); a tint of white at an alpha is
  `color-mix(in oklch, white 8%, transparent)` from tokens — motion area;
- a narrower block centred in the band → `HAVE` (a width + *Place: centre*, written as auto margins);
- small, light, centred legal text → `HAVE` (a text style + the on-dark colour token, contrast asserted — light grey on
  dark blue must pass 4.5:1, rule 17).

## The sidebar — a menu ("burger") button drawn with pseudo-elements, centred with Flexbox

- `button.nav-btn` (empty, and inert — "just so something is in here"): `border: none; border-radius: 0`, a white bar
  `2px` × `4.5rem`; `::before` and `::after` the same bars (`content: ""; display: block`), moved
  `translateY(-1.5rem)` and `+1.5rem` → three lines. A semicolon inside parentheses broke the Sass build; the top bar was
  off the page until `margin-top: 4rem`.
- Centred across the sidebar with **Flexbox** (`display: flex; justify-content: center` — "great for very small
  alignment"); the lower bar nudged to `1.3rem` because the two offsets did not look equal (optical correction).

**For the builder:**
- **the menu button** → the **Navigation component** (`docs/COMPONENT_GAPS.md`): a real `<button>` with an accessible
  name ("Menu"), `aria-expanded`, `aria-controls` the menu it opens, keyboard and focus handling, the bars as
  `aria-hidden` decoration — the course's button is inert and nameless, which a screen reader announces as just
  "button". The Trillo / Natours burger → X animation (stored in 01 / 04) is its motion;
- centring one small thing in a narrow column → `HAVE` (*Place: centre*);
- **a vertical sidebar band** holding the brand / menu, the whole page height → `HAVE` as the row [sidebar | stack]
  (layout part 2), and it must become a TOP bar on a phone (the Trillo responsive part 1 line) — Nexter's responsive
  lecture will show its version.

## The header (hero), part 1 — vertical spacing by ROW TRACKS, a max-content column centred

- **Markup:** `img.header__logo` · `h3.heading-3` "Your own home" · `h1.heading-1` "The ultimate personal freedom" ·
  `button.btn.header__btn` "View our properties" · `div.header__seenon-text` "As seen on" · `div.header__seenon-logos`
  with four press logos (BBC, Forbes, TechCrunch, Business Insider — **social proof**, the way startups do it).
- **Styles:** `heading-1` `4.5rem`, almost white, `line-height: 1`; the press logos all **`height: 2.5rem`** (equal
  HEIGHT, not equal width — equal widths would give uneven heights side by side); the brand logo `3rem` high; the
  header `background-image: linear-gradient(rgba(secondary, .93), rgba(secondary, .93)), url(hero.jpeg)`, `cover`,
  `center`.
- **Spacing the stack with the GRID, not margins:** the header is a grid whose ROWS are the spacing —
  `grid-template-rows: 1fr min-content 6rem 1fr min-content` (approximately: logo row `1fr` takes the free space,
  heading rows content-sized, a `6rem` row as a bigger "gap" after the heading, `1fr` after the button, the as-seen-on
  rows content-sized), `row-gap: 1.5rem`. `fr` ROWS work here because the container has a definite height (the page
  grid's `80vh` row). One gap cannot be sized alone, so a taller ROW makes the bigger space.
- The button stretched across its `1fr` row → `.header__btn { align-self: start; justify-self: start }`.
- `padding: 8rem`, `padding-top: 4rem`; the logo `justify-self: center`.
- **Centring the group but keeping its items left-aligned:** one column `grid-template-columns: max-content`
  (`min-content` squeezed the heading to its longest word) + `justify-content: center` — the column is as wide as the
  widest line and sits in the middle of the header; inside it everything starts at the left.

**For the builder:**
- equal-height logos → `HAVE` (a picture's height in `rem`, width auto from its proportions); a **logo strip** ("As seen
  on", partners, accreditations — very common on school sites: exam boards, inspectorates) is a COMPONENT with that
  rule built in — `docs/COMPONENT_GAPS.md`;
- a hero picture with a strong brand-colour overlay → `HAVE` (band background + overlay strength); contrast of the white
  heading over it is asserted (rule 17: text over a photograph);
- **flexible space between particular blocks of a fixed-height hero** (logo pinned to the top, the message in the
  middle, the press strip at the bottom; more space after the heading than between the others) → `PARTIAL`: *Content
  position* puts the WHOLE group top / middle / bottom, a block's outer spacing gives fixed extra space, but a space
  that GROWS to fill (the `1fr` rows) does not exist — the *spacer* block is a fixed height (`remLen(48)`). This is
  **AC-26** (push to the bottom / distribute in a stack) — widened: "push" (auto margin, `space-between`) or a growing
  spacer, inside a band of chosen height;
- **a group as wide as its widest line, centred, its items left-aligned** (`max-content` + `justify-content: center`)
  → `PARTIAL / to confirm`: a stack can be given a width and placed in the centre, and its children start left; a stack
  whose width is its CONTENT's widest line ("Fit" on a container) is the thing to check — containers stretch by default
  (`childStyle`: "Containers keep stretching").

## The header, part 2 — the logos row, a dimmed look, a "line — text — line" divider from pseudo-elements

- **Logos:** `.header__seenon-logos { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 3rem;
  justify-items: center }` (Grid again for the gap); the logos dimmed with **`filter: brightness(70%)`** so they read
  as quiet grey like the text, not shouting white.
- **"— As seen on —":** the element has only TEXT, yet it is made a grid: **text is a grid item, and so are `::before`
  and `::after`**. The text `1.6rem`, grey-light-1; the pseudo-elements `content: ""; display: block; height: 1px;
  background-color: currentColor` (the line follows the text colour). Three items in ROWS by default →
  `grid-template-columns: 1fr max-content 1fr` (`min-content` broke the words onto two lines), `column-gap: 1.5rem`,
  `align-items: center` — two lines growing either side of the words.
- **The payoff of the `fr` rows:** changing the window HEIGHT, only the `1fr` rows grow and shrink — the logo stays at
  the top, the press strip at the bottom, the message in the middle: "dynamic vertical spacing".

**For the builder:**
- a row of logos of equal height, equally spaced, centred → `HAVE` (a grid of picture blocks, `Place: centre`) — and
  the Logo strip component noted in part 1;
- dimmed logos → **AC-16** (image filters as a resting look);
- **a divider with a label in the middle** ("As seen on", "or", a year in a timeline) → the **Divider block** has no
  label today — a variation of it (a centred label, lines either side in `currentColor`, the label a real text node,
  the lines decoration) — component / element variation; the layout already allows text + two flexible lines in a row;
- the dynamic vertical spacing → **AC-26** (growing space in a fixed-height band), as part 1.

## The realtors — a small people list centred in its panel, spacing in `vh`

- **Markup:** `h3.heading-3` "Top 3 Realtors" OUTSIDE the grid, then `div.realtors__list` (the grid — unlike the header,
  the panel itself is not the grid because the title must not be a grid item) holding pairs of `img.realtors__img` +
  `div.realtors__details` (`h4.heading-4.heading-4--light` name + `p.realtors__sold`): Erik Feinman 245 houses sold ·
  Kim Brown 212 · Toby Ramsey 198.
- **Styles:** photos `7rem`, `border-radius: 50%`, `display: block`; the list `grid-template-columns: min-content
  max-content` (the photo column as wide as the photo, the text column as wide as its longest line, no breaks),
  `column-gap: 2rem`, **`row-gap: 5vh`** — spacing that shrinks with the window HEIGHT, so on a very tall screen the
  small list does not sit in a sea of space; `align-items: center`; "sold" uppercase, grey-light-2,
  `margin-top: -3px` (a negative margin, instead of a transform, to tuck it under the name).
- **Centring the whole thing in the panel with Grid:** the panel `padding: 3rem; display: grid; align-content: center;
  justify-content: center; row-gap: 2rem; justify-items: center` — two rows (title, list); `justify-items: center`
  moves only the title, because the list's width IS the track's width.
- The page is designed; some parts are responsive already, the rest needs media queries (next lectures).

**For the builder:**
- a list of people (round photo, name, a figure) → `HAVE` as rows of picture + text stack (a picture's radius from
  `radiusCSS`, 50% for round), and a **People / Team list** is a component worth having (staff, prefects, governors on a
  school site) — `docs/COMPONENT_GAPS.md`;
- a panel whose content is centred both ways → `HAVE` (*Content position: middle centre*);
- **spacing that follows the window HEIGHT** (`5vh`) → `GAP (minor)`: the builder's fluid spacing follows the width
  (`clamp(rem + vw)`), and on a short, wide screen (a laptop at 1366 × 768, a landscape phone) vertical space should
  shrink first. Belongs with **AC-3** (sizes as a share of the screen height, with `svh` / `dvh`) — one decision about
  height-aware sizing, with `clamp()` floors so a phone in landscape never collapses the spacing to nothing;
- `margin-top: -3px` → negative spacing (**AC-10**), the third time in the course.

## Responsive Nexter, part 1 — no overflow first, then 1200px and 1000px: the sidebar becomes a top bar

(Back in Chrome for its responsive device view; Grid behaves the same in current Chrome and Firefox.)
- **Overflow first:** narrowing the window, the header's content spilled over everything — the press logos had a FIXED
  `height: 2.5rem`, so they could not shrink, and the header's one column was `max-content`, so it could not either.
  Fixes: logos **`max-height: 2.5rem; max-width: 100%`** (the size is now a ceiling); the column
  **`minmax(min-content, max-content)`**; logos `align-items: center`; the heading row **`minmax(6rem, min-content)`**
  (at least 6rem, taller when the heading wraps). Everything flexible before any media query.
- **Breakpoints where the design breaks**, as `em` Sass variables (desktop-first, `max-width`):
  - **≤1200px (`75em`)**: the root font size 62.5% → **50%** — every rem shrinks (1rem = 8px), buying space;
  - **≤1000px (`62.5em`)**: the sidebar is wasted width → **redefine the page grid**: drop the first column (the
    template now starts at `full-start`) and ADD a first row (`6rem`); the sidebar `grid-column: 1 / -1; grid-row: 1 / 2`
    — a top bar; its button `justify-content: flex-end; align-items: center`, `margin: 0 3rem 0 0`; some spacing
    reduced.
- **Why named lines pay off:** removing a column renumbers every line; items placed by NAME (`full-start`,
  `center-start`, `col-start 7`) did not need touching; rows were not named because the source order already matches
  them.

**For the builder:**
- **nothing overflows when the window narrows** → `HAVE` by rule: media are `max-width: 100%` (rule 16, flexible
  media), heights are floors not caps (RULE O in `childStyle`: a self-painting block's height is a `min-height`), the
  `minmax(0, 1fr)` columns wrap long words, and the page audit measures sideways overflow at every rung (RULE Q);
- the root font-size trick → deliberately not adopted (lecture 05; Trillo responsive part 1): the reader's text size is
  the root;
- **the sidebar → top bar at a breakpoint** → `HAVE` in the model as per-rung overrides (the row [sidebar | stack] turns
  to a column; the sidebar's own content turns to a row, its button pushed to the end) — the same inspector "to
  confirm" line as Trillo's; the builder never renumbers anything a person placed, because placement is stored per
  block and resolved per rung — the problem named lines solve does not arise.

## Responsive Nexter, part 2 — 800px and 600px: the hero fills the screen under the bar, sections restack

- Most of the page needs nothing (the auto-fit grids reflow by themselves); the header, the realtors and the story break
  around 720px → a breakpoint at **800px (`50em`)**, checked in 100px steps:
  - **the page grid:** a new row for the realtors under the header; the header row **`calc(100vh - 6rem)`** — exactly
    one screen under the 6rem top bar (`100vh` alone left the next section a bar's height too low); `calc()` works in
    track lists; the story's `40vw` row becomes `min-content` — then ALL the rows after the first two can be left to
    the implicit grid, sized by content;
  - header and realtors `grid-column: 1 / -1` (full width, stacked);
  - **the realtors side by side:** `grid-template-columns: repeat(3, min-content max-content)` — `repeat()` can repeat
    SEVERAL tracks: six columns, photo + text three times;
  - **the story stacked, text FIRST:** both halves `1 / -1`; the content placed explicitly in row 5 (rows counted by
    hand) so it comes before the pictures; the pictures box `padding` and its 6 × 6 placements redone (picture 1
    `1 / -1` rows and columns `1 / 4`, `height: 100%`; picture 2 `width: 100%` instead of `115%`), and the missing
    `background-size: cover` added.
- **600px (`37.5em`):** the header padding `8rem → 5rem`; the realtors back to one per line
  (`min-content max-content`). "About 100 lines of media queries" for the whole page — thanks to Grid.

**For the builder:**
- **a hero exactly one screen tall UNDER a pinned header** (`calc(100vh - bar)`) → **AC-3** (screen-height sizing)
  sharpened: *Full screen* should subtract a sticky / pinned header's height (the engine knows it — `pinStackPass`
  writes `--eu-pin-above`), and use `svh` / `dvh` so a phone's browser bar does not hide the bottom of the hero — to
  check what *Full screen* writes today;
- **a section restacked at a rung with a different order** (text before pictures on a phone) → `HAVE` in the model
  (`order` and placement per rung; a phone stacks to one column) — and the builder's default should already be the
  SOURCE order, which is the accessible one (WCAG 1.3.2): a person who wants the pictures first on a phone moves them,
  not the other way round;
- **a row of people that becomes a list on a phone** → `HAVE` (a row that wraps / stacks; a grid stepping its count per
  rung);
- **a collage re-arranged for narrow screens** → **AC-31** / AC-21: the overlap must give way to a simple arrangement
  on a phone, per rung;
- rows sized by content everywhere except the hero → `HAVE` (the builder's default; only a band given a screen share
  differs).

## Browser support for Grid — progressive enhancement with `@supports`

- **caniuse (end of 2017):** ~77% of users; every current Edge, Firefox, Chrome, Safari, iOS Safari, Chrome for Android,
  Samsung Internet; old IE has an unusable early spec (not even worth prefixing); old Edge and old Safari lack it.
  Whether to use it "depends on the audience" — technical users yes, others not without a fallback.
- **Progressive enhancement:** build with old methods first, then layer Grid on top when supported — the features
  example: `float: left; width: 33.333%; margin-bottom: 6rem` as the base, then `@supports (display: grid) { …grid…;
  width: auto; margin-bottom: 0 }` — the fallback's width and margins must be RESET inside the query (floats need no
  reset: **Grid and Flexbox ignore `float`, `display: inline-block`, `display: table-cell` and `vertical-align` on their
  items**). The course is "not a huge fan": duplicate work, and the page looks different per browser.

**For the builder:**
- Grid support now (2026) is universal in every engine that low-cost Android phones ship (Chrome / WebView, Samsung
  Internet, Opera, UC's Chromium base) — Grid itself needs no fallback. **AC-23** stands for the NEWER features the
  export relies on (container queries, `oklch()`, `color-mix()`, `@property`, `:has()`, `subgrid` once used), checked
  against the real audience (RULE AF), with the course's rule kept: a fallback must be **reset inside** the query (the
  `background-image: none` / `width: auto` lesson);
- a builder can do what a hand-coder will not: the fallback is GENERATED, not duplicated by hand — so where AC-23 finds
  a feature the audience lacks, the export can write a simpler, readable layout outside the `@supports` for free (a
  single column is a perfectly good page on any browser).

## Final considerations — the build, `grid-template`, what Grid was missing

- **The build:** Autoprefixer adds NO prefixes to Grid properties — the only prefixed Grid ever was old IE's unusable
  early spec, so prefixing is off by default.
- **`grid-template: <rows> / <columns>`** — the shorthand (rows first); "confusing", so the course never uses it (and
  it fought a complex named-line template, then a missing semicolon).
- **What Grid lacked in 2017–18:** (1) **subgrid** — a nested grid snapping to its parent's tracks ("coming");
  (2) **individual gaps** — a different gap between lines 2 and 3; (3) **row / column selectors** — no way to select
  "the second column", "every even row" or "all odd columns" of a grid.

**For the builder:**
- no Grid prefixes → `HAVE` (the export writes none, and AC-23's minifier needs none for Grid);
- the `grid-template` shorthand → irrelevant (the export writes the longhands; readable is not a goal for generated
  CSS, correct is);
- **subgrid** → shipped everywhere since 2023 — **AC-36**;
- **one gap different from the others** → `HAVE` in the builder's terms: a block's own outer spacing per side on top of
  the container's gap (the Nexter card's workaround is a control here);
- **style by grid row or column** ("every other row tinted", "the first column bold", zebra cards) → `GAP (minor)` in
  CSS still (`:nth-child` counts items, not rows — it breaks the moment spans or a different column count change the
  rows), but the BUILDER knows each block's row and column at every rung (`gridRowTracks`, placements), so it could
  emit the classes itself. Recorded for the Table / Grid component and the layout DoD: decide whether it is needed.
