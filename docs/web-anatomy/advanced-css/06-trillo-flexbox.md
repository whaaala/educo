# Trillo — Flexbox (project 2)

Advanced CSS and Sass, project 2 (Trillo, a hotel-booking app layout), built with Flexbox. Distilled from the transcripts the
user shared on 2026-10-01. The builder's rows and stacks ARE Flexbox, so this is the course section closest to its engine:
every property below is mapped to the control that sets it.

## Lecture — Flexbox: the philosophy and every property (a cheat sheet)

**What it is:** a CSS3 module that aligns elements to one another, in any direction and order, and changes that easily
(e.g. per screen) — even WITHOUT knowing their sizes, because the CONTAINER expands and shrinks its items to use the
available space. It replaces float layouts with less, more readable code; it shines in ONE-dimensional layouts (a row or a
column); two-dimensional page layouts are CSS Grid's job.

**The vocabulary:** `display: flex` makes a **flex container** (`inline-flex`: one that behaves like an inline element —
rarely used); its DIRECT children are **flex items**; they are laid out along the **main axis**; the perpendicular one is
the **cross axis**. Alignment properties differ by axis — know which is which, especially after changing the direction.

**On the container:**
| Property | Values (first = default) | What it does |
|---|---|---|
| `flex-direction` | `row` · `row-reverse` · `column` · `column-reverse` | which way the main axis runs |
| `flex-wrap` | `nowrap` · `wrap` · `wrap-reverse` | whether items wrap onto new lines when they do not fit |
| `justify-content` | `flex-start` · `flex-end` · `center` · `space-between` · `space-around` · `space-evenly` | alignment along the MAIN axis |
| `align-items` | `stretch` · `flex-start` · `flex-end` · `center` · `baseline` | alignment along the CROSS axis |
| `align-content` | `stretch` · `flex-start` · `flex-end` · `center` · `space-between` · `space-around` | how several LINES sit on the cross axis when there is spare space (only with more than one line) |

**On the items:**
| Property | Values (first = default) | What it does |
|---|---|---|
| `align-self` | `auto` · `stretch` · `flex-start` · `flex-end` · `center` · `baseline` | one item's own cross-axis alignment |
| `order` | `0` · any integer | the item's position in the line (useful to reorder for small screens) |
| `flex-grow` | `0` · number | how much it may GROW into spare space |
| `flex-shrink` | `1` · number | how much it may SHRINK when space is short |
| `flex-basis` | `auto` · a length | its starting size along the main axis |
| `flex` | `0 1 auto` · `grow shrink basis` | the shorthand — the one to use |

**For the builder — `HAVE`, nearly property for property (the engine's resolvers write them; nobody types them):**
- container: `display: flex` on every Stack and row band; **direction** = Stack (column) vs Row / a band (row); **wrap** = a
  row band wraps (`flex-wrap: wrap`) so columns drop a line when they do not fit (the HOLE / F-1 work is about that);
  **justify** = *Position in row* (left · centre · right · Spread) and the header/footer lines' spread; **align-items** =
  *Content position* and `align: stretch` on bands (equal-height columns); **align-content** = `stretch` on bands;
- items: **align-self** = a block's own vertical placement, and set by the edge-anchored resize to pin the far edge;
  **order** = per-rung reordering on a phone; **grow / shrink / basis** = the WIDTH a block was given — `fill` →
  `1 1 0%`, `auto` → `0 0 auto`, a share → `0 1 <share>` with grow 1 where nobody chose the space (F-1 B, F1-j); the floor
  is `min-width` (14rem, a hand-sized column's longest word, 100% on a phone);
- `gap` (newer than the course's Flexbox, supported everywhere now) replaces the margin tricks for gutters;
- `inline-flex` → not used (blocks are block-level).
No gap: the course's Flexbox is the builder's engine. What the project adds is in the lectures that follow.

## Lecture — Flexbox in practice, part 1: the container — `flex-direction`, `justify-content`, `align-items`

A CodePen demo: `.container` (grey, padded) holding five `.item`s (pink boxes with big white numbers).
- **`display: flex`** alone puts the items side by side — no floats, no clearfix.
- **`flex-direction`:** `row` (default, left → right), `row-reverse` (the main axis runs right → left: 5 4 3 2 1),
  `column` (stacked top → bottom), `column-reverse` (bottom → top). Switching to `column` on a small screen is the obvious
  responsive use.
- **`justify-content`** (the MAIN axis): `center` packs the items in the middle (the space between them is still their own
  margins); `space-between` spreads the free space evenly BETWEEN items (none at the ends); `space-around` gives every item
  the same space on BOTH sides (so the gaps between items are double the ends); `space-evenly` makes every gap — ends included
  — equal; `flex-start` (default), `flex-end`. Flexbox recomputes it as the window changes.
- **`align-items`** (the CROSS axis — visible once one item is taller, e.g. 200px): `stretch` (default — every item grows to
  the tallest's height), `center`, `flex-start`, `flex-end`, `baseline` (the TEXT of every item sits on one line, whatever its
  font size).
- **After `flex-direction: column` the axes swap:** `align-items` now moves the items left / right, and `justify-content`
  (with a tall container) spreads them top → bottom. Always know which axis is which.
`flex-wrap` and `align-content` come later.

**For the builder:**
- direction row / column / reversed → `HAVE` (Row vs Stack; reversing is per-rung reordering);
- `justify-content` → `FlexJustify = start · center · end · between · around` (*Position in row*: left, centre, right,
  Spread) — **`space-evenly` is not offered**;
- `align-items` → `FlexAlign = start · center · end · stretch` — **`baseline` is not offered** (lining up the TEXT of items of
  different sizes — a heading beside small text, a price beside its unit; real-site layouts use it in navigation lines and
  pricing);
- AC-25 (layout, minor): **add `space-evenly` to a line's distribution and `baseline` to its cross alignment** — both
  one-word values in the resolver, both appear in real pages' menus, toolbars and price rows.

## Lecture — Flexbox in practice, part 2: the items (transcript received only up to `align-self` — rest to come)

- **`align-self`** overrides the container's `align-items` for ONE item: with the line centred, item 4 alone at
  `flex-end`, `flex-start`, or `stretch` (it grows to the line's full cross size — "pretty useful, used later in the course").

**For the builder:** `HAVE` — `alignSelf?: "flex-start" | "flex-end" | "center" | "stretch"` on every block (a block's own
vertical placement in its line; also written by the edge-anchored resize to keep the far edge still).

## Lecture — Flexbox in practice, part 3: many items — `flex-wrap` and `align-content`

- With ten items in one line they CRAMP, and past a point OVERFLOW the container. **`flex-wrap: wrap`** (default `nowrap`)
  moves the items that no longer fit onto a NEW LINE; narrower → more lines (responsive use). (Item 3, which had `flex: 1`
  from part 2, took a whole line for itself.)
- **`align-content`** aligns the LINES (not the items) along the cross axis when the container has spare space — visible
  with a tall container (1000px): `stretch` (default — the lines share the space; it stretches the lines, not the items, so
  it looks much like `space-between`), `flex-start` (all lines at the top), `flex-end`, `center`, `space-around`,
  `space-between`. Like `align-items`, but for whole lines.
That completes the course's Flexbox basics; next, the Trillo project.

**For the builder:**
- `flex-wrap: wrap` → `HAVE` — every row band wraps, so columns drop a line instead of overflowing (with floors: 14rem, a
  hand-sized column's longest word, 100% on a phone); the HOLE work (c-7, F-1 B, F1-j) is about what a wrapped line does
  with its leftover space — the course's "item 3 took a whole line" is F-1 B's "a column alone on its line fills it";
- `align-content` → `HAVE` as `stretch` on bands; the other values matter only when a container has a FIXED height taller
  than its lines (a band set to a screen height holding several wrapped lines) — then "lines packed to the top / centred"
  is a real choice. Folded into AC-25 (a line's distribution options), minor.

## Lecture — the Trillo project: what it is, the set-up

**Trillo** — a fictional all-in-one booking APP (hotel · flight · car · tour on one platform); the course codes its
INTERFACE, not its functionality: a header bar (logo · search · bookmarks · chat · the user), a side navigation (hotel /
flight / car rental / tours — with a hover effect), and a hotel page (a photo gallery, name and stars, an overview list of
features, customer reviews on the right, a booking call-to-action with a hover effect). Focus: FLEXBOX, plus SVG icons and
animations — built as a modern, good-looking app worth showing.

**Set-up:** the starter files (HTML skeleton with the title and the Open Sans font, `sass/main.scss` with the colour
variables, images); `package.json` copied from Natours and trimmed: `start` (live-server + `watch:sass`) for development,
`build:css` = compile → prefix → compress (no concatenation — no icon-font CSS this time). **`node_modules` is never copied
or shared**: copy `package.json`, run `npm install` to get the packages, then `npm run start`. A first rule (reset +
background colour) checks the pipeline works.

**For the builder:** an APP layout — header bar, side navigation, a content area with a main column and a side column — is
the shape RULE APP is about (the block model is the app model: Educo's screens are built from the same blocks). The
page-region structure (header / nav / main / aside) is `HAVE`; a side navigation that stays put beside scrolling content is
a sticky / floating column (`HAVE`, F1-b's stacking applies). No gap yet — the project's lectures follow.

## Lecture — Trillo's base settings: a small architecture, the reset, and CSS CUSTOM PROPERTIES

**Architecture, scaled to the project:** three partials — `_base.scss`, `_layout.scss`, `_components.scss` — imported into
`main.scss`. (Not the full 7-1: a small app needs only these.)

**The base:** `html { box-sizing: border-box; font-size: 62.5% }` + `*, *::before, *::after { margin: 0; padding: 0;
box-sizing: inherit }`; `body { font-family: 'Open Sans', sans-serif; font-weight: 400; line-height: 1.6; color:
var(--color-grey-dark-2) }` and the app's background — `background-image: linear-gradient(to right bottom,
var(--color-primary-light), var(--color-primary-dark)); background-size: cover; background-repeat: no-repeat;
min-height: 100vh` (a background on a short body REPEATS by default — `no-repeat`; `min-height`, not `height`, so the page can
grow past the screen).

**CSS custom properties ("CSS variables") instead of Sass variables:**
- declared with a double dash inside a scope — usually **`:root`** (like `html`, but more specific: the global parent, so
  every element can use them): `:root { --color-primary: #eb2f64; --color-primary-light: #ff3366; --color-primary-dark:
  #ba265d; --color-grey-light-1: #faf9f9; … --color-grey-dark-2: #777; … }`; read with **`var(--color-primary)`**;
- why, over Sass variables: no preprocessor needed; they can be changed by JavaScript and edited live in DevTools; easier in
  `calc()`; and above all they **CASCADE and are INHERITED** — a variable set on an element applies to it and its children,
  so a theme or a component can override it locally. (A missing `;` broke every declaration after it — a reminder that a
  custom property is an ordinary declaration.)

**For the builder:** `HAVE` — the whole token system is custom properties: `--eu-color-*` (OKLCH), `--eu-space-*`,
`--eu-leading-*`, `--eu-shadow-*`, set on the page root and overridable per section (a coloured band re-scopes its colour
variables — `bandScheme`), plus the engine's own (`--box-u`, `--box-t`, `--bx-gut`, registered with `@property` where the
browser must treat them as lengths — E0-e). Their cascade is exactly why switchable themes work without recompiling. The
page background as a gradient covering at least the screen → `HAVE` (the page background; `min-height` on the page root).
No gap.

## Lecture — Trillo's overall layout: the container, the header, and a sidebar + main line with Flexbox

**Think first:** one big CONTAINER centred in the viewport holds everything; inside it a HEADER (logo · search · user
navigation) and, below, the CONTENT: a SIDEBAR on the left (the navigation + a small legal line) and the HOTEL VIEW on the
right (everything about the hotel). Markup with landmark elements:
`div.container > header.header + div.content > (nav.sidebar + main.hotel-view)` — `nav` because the sidebar is mainly a
navigation; `main` because the hotel view is the main content; `div.content` exists only to hold the two side by side.

**Styles:**
- `.container { max-width: 120rem; margin: 8rem auto; background-color: var(--color-grey-light-2); box-shadow:
  var(--shadow-dark) }` — 1200px when there is room, 100% when there is not (`max-width`), centred (`auto` sides); a custom
  property can hold ANY value, not only colours: `--shadow-dark: 0 2rem 6rem rgba(0,0,0,.3)` (a temporary `min-height` to see
  it while building);
- `.header { height: 7rem; background-color: #fff; border-bottom: var(--color-grey-light-2) }`;
- **`.content { display: flex }`** — the flex container; the sidebar and the hotel view are its items, SIDE BY SIDE at once;
- **`.sidebar { flex: 0 0 18%; background-color: var(--color-grey-dark-1) }`** — no grow, no shrink, a basis of 18% (a % shrinks
  with its parent anyway, so `shrink: 0` is safe here; with a px basis allowing shrink would be wiser);
- **`.hotel-view { flex: 1; background-color: #fff }`** — `flex: 1` = grow into ALL the space left: the remaining 82%.
"No floats, no clearfix, no hacks — three lines: `display: flex`, `flex: 0 0 18%`, `flex: 1`."

**For the builder:**
- the app frame — a centred, max-width container with a shadow on a coloured page → `HAVE` as a contained band / a box with
  a max width (and AC-9 asks whether that width is ONE page-wide setting);
- header + a two-part line, a fixed-share side column and a main column that takes the rest → `HAVE`: a row band of two
  columns at 18 / 82 (or the sidebar sized by hand and the main column left to fill — exactly F-1 B's "a column nobody sized
  takes what is left"); `nav` and `main` landmarks via *Meaning* (decision A1: an automatic `<main>`);
- `flex: 0 0 18%` vs `flex: 1` — the same two flex values the engine writes for a sized share and a `fill` block.
No gap.

## Lecture — the header, part 1: markup, and SVG icons from a sprite instead of an icon font

**Three components in the header:** the LOGO (`img.logo`), the SEARCH (`form.search[action="#"] >
input.search__input[placeholder="Search hotels"] + button.search__button > svg.search__icon`) and the USER NAVIGATION
(`nav.user-nav > div.user-nav__icon-box` ×2 — bookmarks and chat, each an SVG + a `span.user-nav__notification` count
(7, 13) — `+ div.user-nav__user > img.user-nav__user-photo + span.user-nav__user-name`). BEM throughout.

**Why SVG, not an icon font:** an icon font is a HACK (images drawn as letters); it fails more often than expected (a blank
square on screen); screen readers try to read the glyphs. **SVG** = Scalable Vector Graphics, vector images written as
code — sharp at every size, and colourable from CSS.
- **IcoMoon** (icomoon.io): pick icons from free libraries (the course uses *Entypo+*, 10 icons), "Generate SVG", choose SVG
  only, download → `symbol-defs.svg` is a **SPRITE**: ONE file holding every icon as a `<symbol>` (one HTTP request instead of
  ten), plus a demo page listing their ids. Copied in as `img/sprite.svg`.
- **Using one:** `<svg class="search__icon"><use xlink:href="img/sprite.svg#icon-magnifying-glass"></use></svg>` — `<use>`
  references a symbol by `#id` inside the sprite. An external sprite like this only loads over HTTP (a web server, not
  `file://`).
- **Sizing:** an SVG is sized with `width` and `height` alone (`2rem`; the user-nav icons `2.25rem`) — far easier to place
  than font glyphs. The user photo: `height: 3.75rem; border-radius: 50%`. (All these small pieces go in one
  `_components.scss`, separated by comment banners — architecture is not this project's focus.)

**For the builder:** `HAVE`, and in the better form — icons are INLINE SVG (each `<svg>` written into the page with
`fill: currentColor`, sized in `em`; memory `feedback_phase1_responsive_themed.md`): no font to fail, no extra request, no
cross-origin `<use>` restriction, coloured by the text colour. A SPRITE (`<symbol>` + `<use href="#id">` in the page) would
cut repeated icon markup on icon-heavy pages — a page-weight refinement for L-6, not a gap. Decorative icons get
`aria-hidden="true"`; an icon that is the only content of a button needs an accessible name (the search button here has
none — the research's rule).

## Lecture — the header, part 2: aligning it with Flexbox; nested flex; the search field; colouring an SVG with `fill`

**The header line:** `.header { display: flex; justify-content: space-between; align-items: center; font-size: 1.4rem }` —
logo left, search in the middle, user navigation right (`space-between` — "maybe the most useful value of all";
`space-around` put too much space at the ends: small end spaces are done with margins, `.logo { margin-left: 3rem }`), and
everything VERTICALLY CENTRED in the 7rem bar by one declaration (no margin-top guessing). A font size set on the header is
inherited by its parts.

**The search:** `.search { flex: 0 0 40%; display: flex; align-items: center; justify-content: center }` — a FLEX ITEM that
is also a FLEX CONTAINER (nested Flexbox) to centre the input and its button.
- `.search__input`: `font-family: inherit; font-size: inherit; color: inherit` (form fields inherit nothing), grey
  background, no border, `padding: .7rem 2rem`, `border-radius: 100px` (a pill), `width: 90%`, `margin-right: -3.25rem` (the
  button overlaps the field's end), `transition: all .2s`; `&:focus { outline: none; width: 100%; background-color:
  var(--color-grey-light-3) }` — it GROWS to the full 40% and darkens when focused;
  `&::-webkit-input-placeholder { font-weight: 100; color: var(--color-grey-light-4) }`;
- `.search__button`: no border, the field's background, `&:focus { outline: none }`, `&:active { transform: translateY(2px) }`;
  `.search__input:focus + .search__button { background-color: var(--color-grey-light-3) }` (adjacent sibling: the button
  matches the focused field);
- **`.search__icon { fill: var(--color-grey-dark-3) }`** — an SVG used from a sprite takes its colour from CSS `fill`.

**For the builder:**
- a header line spread with every item vertically centred → `HAVE` (L-2's spread header lines, `align-items: center`);
- nested lines (an item that lays out its own content) → `HAVE` (a Stack or band inside a column);
- the search field (grows on focus, icon button over its end, placeholder styling) → a FORM / Search component (component
  gap); NOTE for that component: `outline: none` on the button is removed without a replacement here — the builder's rule is
  "replace focus, never remove it" (WCAG 2.4.7);
- SVG colour from CSS → `HAVE` (inline SVG with `fill: currentColor`, so the block's text colour paints it). No gap.

## Lecture — the header, part 3: the user navigation — `align-self: stretch`, four levels of Flexbox, a badge

**The three parts side by side and centred:** `.user-nav { display: flex; align-items: center }` — a flex item that is a flex
container again.

**Hover areas the full height of the bar:** `.user-nav > * { padding: 0 2rem; cursor: pointer; height: 100%; display: flex;
align-items: center }` and `> *:hover { background-color: var(--color-grey-light-2) }` (`> *` = every direct child — the two
icon boxes and the user — in one selector). The hover first covered only the content's height because the HEADER centres
its items; **`.user-nav { align-self: stretch }`** overrides that for this one item, so the navigation spans the bar's full
height, and its children (`height: 100%`) do too. Each child is itself a flex container that centres its icon or photo and
name vertically — the header, the user navigation, each box, and (below) the badge: **four levels of flex containers**,
"just how Flexbox works".

**The icons:** `.user-nav__icon { height: 2.25rem; width: 2.25rem; fill: var(--color-grey-dark-2) }`.

**The notification badge over an icon** — the one thing Flexbox does NOT do (place exactly on top of something): ABSOLUTE
positioning — `.user-nav__icon-box { position: relative }` (on the box; it misbehaved on the SVG itself) and
`.user-nav__notification { position: absolute; top: 1.5rem; right: 1.1rem; font-size: .8rem; height: 1.75rem; width:
1.75rem; border-radius: 50%; background-color: var(--color-primary); color: #fff }`. Its number centred with **Flexbox on
TEXT**: `display: flex; justify-content: center; align-items: center` — Flexbox centres a bare text node too.

**The user:** `.user-nav__user-photo { margin-right: 1rem }`; spacing balanced by eye against the other end.

**For the builder:**
- one item of a line stretched to the line's full height while the others stay centred → `HAVE` (`alignSelf: stretch`);
- hover areas that fill a bar → hover effects apply to the block's own box; a nav item as tall as its bar needs that item
  stretched — reachable;
- nesting lines inside lines, four deep → `HAVE` (stacks and bands nest without limit);
- **a badge pinned to the corner of an icon or button** (a count, "New", a dot) → `PARTIAL` — a block can float over another
  inside a section, placed in %; a badge belongs to the component catalogue (Badge — the course's notification count is a
  numbered dot); the anatomy note: a count needs text for screen readers ("7 new bookmarks"), not a bare number.
No layout gap.

## Lecture — the sidebar, part 1: the side navigation's markup, the legal line, `flex-direction: column` + `space-between`

**Markup:** `nav.sidebar > ul.side-nav > li.side-nav__item` ×4, each `a.side-nav__link > svg.side-nav__icon (use
#icon-home / #icon-aircraft-take-off / #icon-key / #icon-map) + span` (Hotel · Flight · Car rental · Tours) — all from the
ONE sprite file (one HTTP request); then `div.legal` "&copy; 2017 by trillo. All rights reserved." (`.legal { font-size:
1.2rem; text-align: center; padding: 2.5rem; color: var(--color-grey-light-4) }` — a light grey that contrasts with the dark
sidebar). Icons sized as squares: `width: 1.75rem; height: 1.75rem`.

**Equal heights for free:** making the hotel view tall (a temporary `height: 80rem`) made the sidebar exactly as tall — the
content line's `align-items` defaults to `stretch`, so the two columns always match, with no code.

**Pushing the legal line to the BOTTOM of the sidebar:** `.sidebar { display: flex; flex-direction: column; justify-content:
space-between }` — with the main axis turned DOWN, `justify-content` now works top → bottom, and `space-between` puts the
navigation at the top and the legal line at the bottom, all the spare height between them (`space-around` would put half
the space above and below each). "A technique to keep in mind": turn the axis, then justify along it.

**For the builder:**
- side navigation of icon + text links → the Navigation component (a vertical variant — the component gap); the icons from
  inline SVG → `HAVE`;
- columns of a line as tall as each other → `HAVE` (`align-items: stretch` on bands — equal-height columns);
- **one block at the top of a column and another pushed to the BOTTOM** (a sidebar's navigation and its footer line; a card's
  text and its button aligned at the bottom across a row of cards) → `PARTIAL` — a Stack's main-axis distribution
  (`justify: between`) exists in the model (`FlexJustify`), but whether the inspector offers it for a STACK (vertical) as
  plainly as *Position in row* does for a row is to confirm; it is one of the commonest real layout needs (aligned card
  buttons). Recorded as AC-26 (layout): "push to the bottom" for a stack.

## Lecture — the sidebar, part 2: the side navigation's links, `currentColor`, and a staged hover (`scaleY` then width)

**Links:** `.side-nav { font-size: 1.4rem; list-style: none; margin-top: 3.5rem }`; `.side-nav__link:link, :visited { color:
var(--color-grey-light-1); text-decoration: none; text-transform: uppercase; display: block; padding: 1.5rem 3rem; display:
flex; align-items: center; position: relative; z-index: 10 }` (a very light grey reads better than white on a dark
background; flex + `align-items: center` lines the icon and the word up exactly); items spaced with `:not(:last-child) {
margin-bottom: .5rem }`.

**`currentColor`:** `.side-nav__icon { width: 1.75rem; height: 1.75rem; margin-right: 2rem; fill: currentColor }` — the
icon takes whatever colour its element has; change the link's colour (on hover, say) and the icon follows with no extra
rule. "Really well supported — I don't know why more people don't use it."

**The staged hover — a bar that grows UP AND DOWN from the middle, then sweeps across:**
`.side-nav__item { position: relative }` and `.side-nav__item::before { content: ""; position: absolute; top: 0; left: 0;
height: 100%; width: 3px; background-color: var(--color-primary); transform: scaleY(0); transition: transform .2s,
width .4s cubic-bezier(1, 0, 0, 1) .2s, background-color .1s }` → `.side-nav__item:hover::before,
.side-nav__item--active::before { transform: scaleY(1); width: 100% }`;
`.side-nav__item:active::before { background-color: var(--color-primary-light) }`.
- **`scaleY`** scales along the vertical axis only, from the **`transform-origin`** (default the centre — so the bar grows
  out from the middle; `top` / `bottom` change where it starts);
- **ONE `transition`, different settings PER PROPERTY**: the transform first (.2s), the width AFTER it (a .2s DELAY, .4s, a
  `cubic-bezier(1, 0, 0, 1)` — slow, very fast, slow: "snappy and modern"), the background colour quickly (.1s) — staged
  animation without keyframes;
- the link `position: relative; z-index: 10` so the words stay ABOVE the growing bar (`z-index` needs a position);
- an `--active` modifier on the current page's item shows the same state permanently; `:active` (while pressed) brightens it.

**For the builder:**
- icons coloured by their text → `HAVE` (inline SVG `fill: currentColor` — the course's recommendation is the builder's
  default);
- the current page shown in a navigation (an "active" state) → part of the Navigation component (with `aria-current="page"`,
  which the research requires — colour alone does not say "you are here", WCAG 1.4.1);
- the staged bar-then-fill hover (per-property timing, delays, custom easing) → motion area — AC-18 (the sweeping fill) and
  AC-6 (custom easing and delays). No layout gap.

## The hotel overview, part 1 — the gallery and the overview line

**The gallery:** three photos side by side. Each `img` sits in a `figure` (so it can take a `figcaption` later);
`.gallery { display: flex }` puts the figures in a row; each photo has `width: 100%` (it fills its figure, and the three
share the line evenly) and `display: block` — an image is INLINE by default and leaves a small gap below it, like the
space under a line of text.

**The overview line:** the hotel name (`h1` "Hotel Las Palmas"), the stars (five SVG icons), the location (an icon plus an
inline button) and the rating (8.6, "429 votes") in one `.overview { display: flex }` line. Icons are
`1.75rem` square with `fill: var(--color-primary)`. The stars and location must sit TOGETHER, with the free space between
the location and nothing else — so:
- `justify-content: space-between` is rejected: it spreads ALL the gaps;
- `flex: 1` on the stars is rejected: it STRETCHES the element itself, so a hover or a background would cover the whole
  empty space;
- **`margin-right: auto` on the stars** is the answer: an auto margin takes all the free space on that side, pushing every
  item after it to the far end — "a very powerful trick in flexbox".

**For the builder:**
- the gallery → `HAVE`: a row of three picture blocks sharing the line, pictures are block-level with `max-width: 100%`
  (rule 16, flexible media), published as `figure` where a caption exists (`docs/web-anatomy/html-semantics.md`);
- the auto-margin push → `HAVE`: *Place in the line* is exactly this — `placeCSS` (`lib/box-model.ts`) writes an
  **auto margin**, never the parent's `justify-content`, so ONE block moves and its siblings stay; *start* on the stars is
  `margin-right: auto` and pushes everything after it to the end, *end* on the location is the same result from the
  other side. Filling the space instead is the separate *Fill* width (the rejected `flex: 1`) — both exist and mean
  different things, as the lecture says they should.

## The hotel overview, part 2 — centring the line, the inline button, a pulse, a stretched rating

- **A 1px bottom border** under the header and the overview (the lecture's own bug: `border-bottom` given a colour but no
  width or style draws nothing — all three are needed).
- **`align-items: center`** on the overview: the name, stars, location and rating centred on the cross axis in one line;
  they stay centred when the heading grows.
- **The heading:** `2.25rem`, weight 300 (big but light), `uppercase`, `letter-spacing: 1px`, padding `1.5rem 3rem`.
- **The stars' gap:** SVGs are inline, so their container has a little space under them (like text descenders) and the
  line looks off-centre. Setting `font-size`/`line-height: 0` would work; simpler is **`display: flex` on the container** —
  the icons become flex items, the gap is gone, and the container is exactly as tall as the stars.
- **An inline button** (a new component, `.btn-inline`): no border, `color: var(--color-primary)`, **`font-size: inherit`**
  (it takes the size of wherever it is placed — modular), `border-bottom: 1px solid currentColor` (the hover only changes
  `color` and the line follows), `padding-bottom: 2px`, `inline-block`, **`background-color: transparent`** (it sits on
  grey here, on white elsewhere), `cursor: pointer`, `transition: all .2s`.
- **A focus pulse:** `:focus { outline: none; animation: pulsate 1s infinite }`, with `@keyframes pulsate` going
  scale 1 / no shadow → at 50% `scale(1.05)` + `box-shadow: 0 1rem 4rem rgba(black,.25)` → back. `infinite` repeats it for
  as long as the button has focus. (Removing the outline with nothing as strong in its place fails WCAG 2.4.7 for anyone
  who cannot see motion — the research's focus floor keeps a visible ring.)
- **The location:** `font-size: 1.2rem` on the parent (the inline button inherits it), `display: flex; align-items: center`
  for icon + button, the icon `margin-right: .5rem`.
- **The rating box:** primary background, white text, `margin-left: 3rem`; the average `2.25rem` light, the count
  `.8rem` uppercase; padding `0 2.25rem` only. It must run the FULL HEIGHT of the line while its siblings stay centred —
  **`align-self: stretch`** overrides the parent's `align-items: center` for that one item. Inside, the two numbers are
  centred both ways with `display: flex; flex-direction: column; justify-content: center; align-items: center`, and pulled
  closer with **`margin-bottom: -3px`** on the first.

**For the builder:**
- the hairline border → `HAVE` (a border per block and per side; 1px is the one px rule 16 allows);
- centring a line on the cross axis → `HAVE` (*Line up* on the row: start / centre / end / stretch);
- the heading's weight, case and letter-spacing → typography controls (`letterSpacing` is stored; weight and case are
  text styles) — not layout;
- the stars' inline gap → the builder's icons are inline SVG at `em` size (`feedback_phase1_responsive_themed`); a row of
  icons is a flex line of blocks, so the gap does not arise — to be confirmed by the page audit's overlap/centring check,
  not assumed;
- the inline button (inherit size, `currentColor` underline, transparent background) → a variation of the **Button
  component** ("text / link button") — component area, `docs/COMPONENT_GAPS.md`;
- the infinite pulse on focus → motion area, AC-6 (repeat) — with the visible-focus floor kept;
- **`align-self: stretch` for ONE block** → `GAP`: *Place in the line* offers start / centre / end per block
  (`SELF_CSS`), and *stretch* exists only for the whole line — a rating panel the full height of a centred line cannot
  be built. **AC-27.**
- the column of two centred numbers → `HAVE` (a stack with its content centred both ways);
- **`margin-bottom: -3px`** to pull two lines closer → `PARTIAL`: a margin can go negative only by dragging a top edge
  upward; there is no "tighten" (negative) value in the spacing controls. Joins AC-10 (pulling a section up over the
  one before) as one decision: **negative spacing**.

## The hotel description, part 1 — the detail layout (two columns, one gap everywhere)

The grey **detail** box under the overview holds two columns: the **description** (left) and the **user reviews**
(right). Filed in the LAYOUT file, not components — it arranges, it is not a reusable piece.
- `.detail { display: flex }` puts them side by side; `.description { flex: 0 0 60%; margin-right: 4.5rem }` (no grow, no
  shrink, a 60% basis — with a % basis the other two are set to 0) and `.user-reviews { flex: 1 }` takes what is left.
- `.detail { padding: 4.5rem }` — the SAME value as the gap, so the space above, at the sides and between the boxes is
  one measure; grey background; the bottom line.
- The repeated border becomes a custom property, `--line: 1px solid var(--color-grey-light-2)` (a variable holding a
  variable works), used by the header, the overview and the detail; the shadow too, `--shadow-light: 0 2rem 5rem
  rgba(black,.06)`, reused later by the review boxes.
- `.description`: white, `--shadow-light`, padding `3rem`, `font-size: 1.4rem` set ONCE on the box for everything in it.
- The reviews column is as tall as the description without asking — `align-items` defaults to `stretch`.
- Content: two paragraphs, a `ul.list` of eight features (Close to the beach · Breakfast included · Free airport shuttle ·
  Free wifi in all rooms · Air conditioning and heating · Pets allowed · We speak all languages · Perfect for families),
  and a **recommend** panel (a count line and four friends' photos) — reusable components, named so.
- The test height on the hotel view (`80rem`) is removed: **the content defines the height**.

**For the builder:**
- 60% + the rest, with a gap → `HAVE`: a row of two blocks, one at a hand-set 60% share, the other *Fill*; the gap is
  the row's *Space across* (a gap, not a margin on one child, so it disappears when they stack on a phone);
- padding equal to the gap → `HAVE`: inner spacing and the gap come from the same spacing tokens (space by default);
- tokens for the line and the soft shadow → `HAVE`: border colour and the shadow scale are `--eu-*` tokens (rule 17), the
  hairline is the one px allowed (rule 16);
- one font size set on a container, inherited by everything in it → `HAVE`: typography cascades from any container
  (`feedback_twelve_columns`);
- equal-height columns for free → `HAVE` (rows stretch by default);
- height from content, never a fixed test height → `HAVE` (*auto* height is the default).
No gap.

## The hotel description, part 2 — paragraphs, a two-column wrapped list, mask icons, the recommend line

- **Paragraph spacing:** `margin-bottom: 2rem` on every paragraph but the last — and `:not(:last-of-type)`, not
  `:not(:last-child)`: the second paragraph is not the last CHILD (the list follows), but it is the last of its TYPE.
- **The list:** `list-style: none`, `margin: 3rem 0`, `padding: 3rem 0`, `border-top` and `border-bottom: var(--line)`.
  `display: flex` alone crams eight items into one line; **`flex-wrap: wrap`** lets them break onto new lines, but each
  line then holds a different number of items of different widths; **`flex: 0 0 50%`** on each item makes TWO equal
  columns (100% / 2), items `margin-bottom: .7rem`. "The first real use of `flex-wrap`."
- **The bullet icon, in CSS:** a `::before` on each item (`content: ""; display: inline-block; width/height: 1rem;
  margin-right: .7rem`). One SVG file, not the sprite (in CSS a single file is easier, and only one icon is needed).
  - as a `background-image` (`background-size: cover`) it works but its COLOUR cannot be changed — the old-browser
    fallback;
  - **a mask** is the modern way: `background-color: var(--color-primary)` paints the square, `-webkit-mask-image:
    url(chevron.svg)` / `mask-image` lets it show only where the icon is, `mask-size: cover` (like `background-size`)
    fits the icon to the box. A later lecture switches between the two with a feature query (`@supports`).
- **The recommend line:** `font-size: 1.3rem`, a lighter text colour (the count in dark grey). Friends' photos `4rem`
  square, `border-radius: 50%`; their container `display: flex` (side by side); **overlapping** with
  `margin-right: -1.5rem` on all but the last (`:not(:last-child)`); a `3px solid white` ring (the container's background)
  makes them look stacked; **`box-sizing: content-box`** on the photos so the ring is ADDED outside the 4rem rather than
  shrinking the picture (the global `border-box` is right almost everywhere, not here). `align-items: center` on the line
  and **`margin-right: auto`** on the count push the photos to the far right — the same trick as the overview.

**For the builder:**
- spacing between paragraphs but not after the last → `HAVE`, and more simply: a stack's GAP is only BETWEEN blocks, so
  there is no last-margin to remove (the `last-of-type` trap cannot happen);
- the bordered, padded list band → `HAVE` (top/bottom border, inner spacing, outer spacing, from tokens);
- **eight features in two equal columns** → `PARTIAL`: as eight blocks in a two-cell-wide grid or a wrapping row at
  50% — `HAVE`, and it stacks on a phone; as ONE semantic `ul` whose items flow into two columns — not possible, a list is
  one run of text. Joins **AC-19** (one text in several columns) as one decision;
- **a custom, coloured list marker** (an icon instead of the bullet, in a token colour) → `GAP`: the builder's icons are
  blocks (inline SVG, `currentColor`), not list markers; the modern route is a `::marker` or a masked `::before` in the
  token colour, with a plain-bullet fallback. **AC-28** — typography / the List component;
- the `@supports` mask fallback → **AC-23** (the browser baseline);
- **overlapping round avatars with a ring** (a "friends who recommend" / "attending" stack) → a COMPONENT ("avatar
  group", `docs/COMPONENT_GAPS.md`); the overlap itself is **negative spacing** (AC-10 / the overview's `-3px`);
- `box-sizing: content-box` for one element → not exposed and not needed: the builder's rings are `outline` /
  `box-shadow`, which never shrink the picture (lecture 4's `outline-offset` ring);
- the push to the far right → `HAVE` (*Place in the line*: start on the count).

## The user reviews — `figure` + `blockquote`, the user line, a decorative quote mark, the "Show all" button

**Markup:** each review is a `figure.review` — a figure is not only for pictures, it is any self-contained piece with a
caption — holding a **`blockquote.review__text`** (a review IS a quotation) and a **`figcaption.review__user`**: the
photo, a `review__user-box` (name "Nick Smith", date "Feb 23rd, 2017" as two paragraphs) and the rating (7.8). A second
review: Mary Thomas, Sep 13th, 2017, 9.3.

**Style:**
- the review: white, `--shadow-light`, padding `3rem`, `margin-bottom: 3.5rem`; the photo `4.5rem`, round;
- the `1.4rem` font size moved UP to `.detail`, the parent of both columns, instead of being set on each;
- the user line (the lecture's challenge): `display: flex; align-items: center` on the figcaption; the text
  `margin-bottom: 2rem`; **`margin-right: auto` on the user box** pushes the rating to the far right; photo
  `margin-right: 1.5rem`; name `1.1rem`, weight 600, uppercase, `margin-bottom: .4rem`; date `1rem`, grey; rating in the
  primary colour, `2.2rem`, light weight;
- **the big quote mark** is decoration, so it lives in CSS, not the HTML: `.review::before { content: "\201C" }` (in CSS a
  symbol is written by its ISO/Unicode number, not its HTML entity name), `position: absolute` (the review `relative`),
  `top: -2.75rem; left: -1rem`, `font-size: 20rem`, `line-height: 1` (the glyph's own line box was huge), the browser's
  `sans-serif` (the page font's quote looked wrong), a light grey; it overflowed and covered the text, fixed by
  **`overflow: hidden`** on the review and **`z-index: 1`** on the mark with `position: relative; z-index: 10` on the
  text — z-index only works on a positioned element;
- **"Show all"** after the reviews: the `btn-inline` from the overview, with the arrow `&rarr;` in a `span` so it can move
  on its own: `span { margin-left: 3px; transition: margin-left .2s }` → `:hover span { margin-left: 8px }`. A
  `transition: all` on the span made the colour change WAIT for the movement — transition only the property that moves;
- **centring the button:** `text-align: center` on the container is rejected (it is INHERITED — every review's text
  would centre); instead `.user-reviews { display: flex; flex-direction: column; align-items: center }`. With only
  `column`, the button STRETCHED full width (its bottom line ran edge to edge) — `align-items` defaults to `stretch` on
  the cross axis, which is now horizontal.

**For the builder:**
- a review as `figure` + `blockquote` + `figcaption` → the **Quote / Testimonial component** (registry: Quote) must
  publish exactly this structure (`docs/web-anatomy/html-semantics.md`, RULE R) — component area, to verify when the
  component is rebuilt;
- the type size set once on the common parent → `HAVE` (typography cascades from any container);
- the user line with the rating pushed right → `HAVE` (a row, centred, *Place in the line: start* on the name box);
- **a decorative glyph behind the text, clipped by its box** → `PARTIAL`: a text block can be FLOATED (absolute) inside
  a box and layered, but whether the box clips it (`overflow: hidden`) and whether the glyph is hidden from screen
  readers (`aria-hidden`, it is decoration) is not a plain choice — belongs to the Quote component as a variation
  ("with a quote mark"), not a layout feature;
- the arrow that moves on hover → the Button component's "text / link button" variation + motion area (and the lesson
  for the resolvers: **transition named properties, never `all`**);
- centring ONE block across a stack without centring its text → `HAVE`: *Place in the line: centre* writes an auto
  margin on that block only; text alignment is its own control and is not touched;
- the stretch-by-default trap → the builder's F-1 rule: components fill their line except the ones that HUG by nature
  (stat, badge, rating); **a link-style button in a stack should hug, not stretch** — to check in the next sweep.

## The call to action — a centred band and the sliding two-label button

**The section:** `div.cta` after the detail: padding `3.5rem 0`, `text-align: center` (centres the heading AND the
button at once — here the inheritance is wanted, unlike the reviews); `h2.cta__book-now` "Good news! We have 4 free rooms
for your selected dates!", `1.5rem`, weight 300, uppercase, `margin-bottom: 2.5rem`.

**The button** (`.btn`, a component): `1.5rem`, no border, weight 300, uppercase, a pill radius (`100px`),
`background-image: linear-gradient(to right, var(--color-primary-light), var(--color-primary-dark))`, white text,
`position: relative; overflow: hidden; cursor: pointer`. Inside, two spans:
- `.btn__visible` "Book now" — `inline-block`, `padding: 2rem 7.5rem`: its padding DEFINES the button's size;
- `.btn__invisible` "Only 4 rooms left" — `position: absolute; left: 0; top: -100%` (minus its OWN height: it waits just
  above the button), `width/height: 100%` of the button, padding `2rem 0` only (the side padding pushed "left" out of the
  box); hidden by the button's **`overflow: hidden`**;
- on `:hover`: the invisible label to `top: 0`, the visible one `transform: translateY(100%)` — both slide DOWN, the new
  label in, the old one out; `transition: all .2s` on `> *` (both children, written once); the gradient flips to
  `to left`. **A gradient does not transition** (a background image cannot be interpolated) — the flip is instant, hidden
  by the motion;
- `:focus`: `outline: none; animation: pulsate 1s infinite` (the overview's pulse — "please click me").
- A Sass slip in the lecture: `&:hover &__visible` nested wrongly compiled to a selector that matched nothing; the hover
  rules belong inside `&:hover { … }`.
- Not responsive yet — the next lectures add the media queries.

**For the builder:**
- a centred CTA band (heading + button) → `HAVE`: a band with its content centred (the CTA band of every dressed page,
  RULE E); centring through *Place* / content alignment rather than inherited `text-align`, so text blocks inside keep
  their own alignment;
- the pill, gradient-filled button → the **Button component** (a pill radius via `radiusCSS`, a gradient from the OKLCH
  primary scale);
- **the sliding two-label hover** → a Button variation + motion area (AC-6 / AC-7 family). Three rules from the research
  it must meet when built: the second label is information revealed ONLY on hover, so a touch or keyboard user never sees
  it (AC-24 — show it on `(hover: none)` or on focus too); a screen reader reads BOTH spans, so the accessible name must be
  set deliberately; the slide falls back to an instant swap under `prefers-reduced-motion`;
- the gradient that cannot transition → for the resolvers: a gradient stop registered with `@property` as a `<color>`
  CAN transition (the export already lists `@property` in AC-23's baseline);
- the infinite focus pulse → AC-6, with a visible focus ring kept (WCAG 2.4.7).
No layout gap.

## Trillo responsive, part 1 — breakpoints where the design breaks; the sidebar becomes a top bar

**The strategy:** desktop-first (`max-width` queries), and this time the breakpoints are put **where the design starts to
break** — the "perfect" way of lecture 05 — keeping 600 / 900 / 1200 in mind only where something actually breaks.
Written as plain `@media only screen and (max-width: …)` queries in `em` (no mixin this time). The widths are **Sass
variables** (`$bp-largest: 75em` = 1200px, `$bp-large: 68.75em` = 1100px, `$bp-medium: 56.25em` = 900px, `$bp-small:
37.5em` = 600px) because **a CSS custom property cannot be used inside a media query condition** — custom properties for
values, Sass variables for breakpoints.

- **≤1200px** (the container's own `max-width: 120rem`): the framed look goes — `.container { margin: 0 }` (it had
  `8rem auto` with the pink page showing round it); the container now touches the viewport.
- **≤1100px:** the root font size drops from 62.5% to **50%** (1rem = 8px), shrinking everything sized in rem at once —
  the Natours technique. Side effect: `max-width: 120rem` is now only 960px and the pink sides came back, so the container
  gets `max-width: 100%; width: 100%`. The overlapping friends' photos wrapped at one width — fixed without a query by a
  bigger negative margin (`-2rem`), and later by making their container `display: flex` (flex items never wrap unless
  told to).
- **≤900px:** the content line (`sidebar` + `hotel-view`) turns from `row` to **`flex-direction: column`** — the side
  navigation goes ON TOP, full width, and the hotel view gets the whole width below it. The side nav itself becomes
  `display: flex` (its four items side by side), `margin: 0`, each item **`flex: 1`** (four equal shares of the width),
  links `justify-content: center`, padding `2rem`; the legal line `display: none`. Then less white space for the
  narrower screen: detail padding `4.5 → 3rem`, description padding `3 → 2rem` and its gap `4.5 → 3rem` (kept equal to
  the detail padding), review padding `2rem` and margin `3rem`, overview/CTA padding `3.5 → 2.5rem`.
- **600px** is next (the following lecture).

**For the builder:**
- breakpoints → the builder has the fixed ladder of **five rungs** (rule 18: 600 · 900 · 1200 · 1800, in `em`, `base` is
  desktop) PLUS **container queries** for components (rule 16), which is what "where the design breaks" means for a
  reusable block: it adapts to ITS OWN width, wherever it is placed. `HAVE`. The Sass-variable point does not arise —
  the export writes the `em` values itself;
- the framed page that loses its frame on narrow screens → **AC-2** (the page frame): if it is built, it switches off at
  a rung like everything else (any property is overridable per rung — `ResponsiveOverride` is the whole block minus id /
  type / children);
- **shrinking the root font size at a breakpoint** → deliberately NOT adopted (lecture 05's decision stands): the root
  is the READER's text size (WCAG 1.4.4, the 150% check in RULE Q); the builder scales type and spacing with fluid
  `clamp(rem + vw)` instead, so nothing needs a root change and the `120rem → 960px` trap cannot happen;
- **a sidebar that becomes a top bar** (row → column for the page, column → row of equal items for the nav, the legal
  line hidden) → `HAVE` in the model: direction, widths (*Fill* = `flex: 1`), alignment and *hide on this device* are all
  per-rung overrides. Whether the inspector offers *direction* at a rung as plainly as *hide* is **to confirm in the
  UAT** — the sidebar → top-bar switch is one of the commonest responsive moves in the crawl;
- less padding on narrower screens → `HAVE`, and mostly automatic: the spacing tokens are fluid, so padding and gaps
  already shrink between rungs without a query; a per-rung override is there for the rest;
- avatars that must never wrap → `HAVE`: a row only wraps where the builder lets its line wrap.

## Trillo responsive, part 2 — 600px and 500px: stacking, icon above label, `order`, a wrapped header

- **≤600px:** the detail line (description + reviews) is a column now; the description's `margin-right` (the gap) goes to
  0 and a `margin-bottom: 3rem` takes its place — the later query wins over the 900px one (same specificity, later in
  the source). "Future proof": nothing below needs touching again.
- **The side-nav items run out of room** (~535px, "Car rental" no longer fits): each link — already a flex container —
  gets **`flex-direction: column`**, the icon ABOVE the label; the icon's `margin-right` (which had pushed it off-centre)
  becomes 0 with `margin-bottom: .7rem`, and the icon shrinks to `1.5rem`. "Row → column is the biggest advantage of
  flexbox for responsive design."
- **The overview, smaller:** heading `1.8rem`, padding `1.25rem 2rem` (the padding is what sets the line's height), the
  rating padding `0 1.5rem`, the average `1.8rem`, the count `.5rem`.
- **≤500px (`$bp-smallest: 31.25em`), the header:** logo · search · user nav is too cramped. The search moves to the
  END with **`order: 1`** (every item's default `order` is 0, so 1 sorts it last), the header gets **`flex-wrap: wrap`**,
  and the search **`flex: 0 0 100%`** so it must take a line of its own — wrapping then starts exactly at 500px rather
  than whenever the items happen to run out of room. The header grows to `11rem` high, and **`align-content:
  space-around`** spreads the two lines in it (center packs them together, space-between pushes them to the edges,
  flex-start / flex-end to one side). The search gets the background on the whole form, so the rounded input sits
  cleanly.
- Device check: iPad portrait/landscape good, iPad Pro leaves empty space, iPhone and Galaxy "not 100% perfect" — left as
  an exercise.

**For the builder:**
- a row that stacks with its gap following → `HAVE`, and the lecture's two-declaration fix is not needed: the space
  between is a GAP, so when the row stacks it is between the blocks vertically by itself (and every saved page keeps its
  own rung overrides);
- **icon above the label at one rung** → `HAVE` in the model (direction is a per-rung override, the same "to confirm in
  the inspector" line as the sidebar → top bar of part 1);
- smaller heading and padding on a phone → `HAVE`, mostly automatic through the fluid type and spacing tokens (rule 16:
  `clamp(rem + vw)`); a per-rung override is there for the rest;
- **`order`** → `HAVE` in the model: `BoxNode.order` ("sequence position, lower first", both engines), overridable per
  rung. Two things to keep: the inspector should offer it at a rung (to confirm, with the direction line), and **visual
  order must not contradict reading/tab order** (WCAG 1.3.2 / 2.4.3) — moving the search after the user nav is harmless,
  moving a heading below its text is not; the page audit could flag an order that reverses a heading and its content;
- **one block forced onto its own line at a rung** (`flex: 0 0 100%` + wrap) → `HAVE`: a width of 100% at that rung on a
  row whose line wraps;
- **`align-content` between the wrapped lines of a fixed-height header** → **AC-25** (already listed: the engine writes
  `alignContent: stretch` and offers no choice);
- leaving phones "not 100% perfect" → not acceptable here: RULE AF puts 360px phones FIRST, and every page is swept at
  every rung and device preset (RULE Q) — the course's exercise is the builder's definition of done.

## Trillo wrap-up — browser support, the mask feature query, the build, Grid + Flexbox, five challenges

- **Support (caniuse, 2017):** ~89% of users had unprefixed Flexbox; IE 10/11 partial, old Android stock browser only the
  old "box" spec with no wrapping. Use it if dropping the oldest IE is acceptable for the audience — layout is
  fundamental, so a browser without it gets a mess (Trillo with Flexbox switched off: usable, but terrible).
- **The mask fallback, done:** `@supports (-webkit-mask-image: url()) or (mask-image: url()) { … mask rules …;
  background-image: none }` — the `background-image` icon stays outside as the fallback (black, its colour cannot change),
  and INSIDE the query it must be cancelled, or the black background image shows through the mask (Chrome showed a black
  icon until `background-image: none` was added). Always test the prefixed AND unprefixed property.
- **The build** (compile → prefix → compress): 500 lines became 667 after Autoprefixer (`-ms-flexbox`, `-webkit-box`,
  `-ms-flex-pack: justify` for the oldest implementations); 13 KB → 14 KB compressed — the prefixes cost more than the
  minifier saved.
- **Grid + Flexbox:** the overall app layout would suit **CSS Grid**; modern practice is Grid for the page / app frame
  and Flexbox for the components and details inside it.
- **Five challenges:** a user menu on hovering the user name; a messages menu on the chat icon; search suggestions while
  typing; a gallery caption shown with a hover effect; fully responsive below 500px (+ responsive images).

**For the builder:**
- support → **AC-23** (the browser baseline): the same judgement, made by MEASURING the real audience — RULE AF's
  low-cost Android phones and their WebViews, not 2017 IE. Flexbox and Grid are safe there today; the newer features the
  export leans on (container queries, `oklch()`, `color-mix()`, `@property`, `:has()`) are the ones to check, each with a
  fallback inside or outside an `@supports` the way the lecture shows — and **the fallback must be cancelled inside the
  query** (the `background-image: none` lesson), which a fallback guard can test;
- the build → Autoprefixer is no longer worth its weight for Flexbox (the prefixes add bytes for browsers no one in the
  target audience uses); minification of the GENERATED CSS still is (RULE AF's 100 KB budget) — already in AC-23;
- Grid for the frame, Flexbox inside → `HAVE`: the builder has both engines (grid with twelve columns, flex rows and
  stacks), and the dressed pages use exactly that split;
- the challenges → components, recorded where they belong: dropdown menus (user / messages) = the Navigation / Menu
  component; search suggestions = a combobox component (ARIA combobox pattern in `docs/web-anatomy/`); a gallery caption
  revealed on hover = the Gallery component, which must also show the caption on touch and focus (AC-24); below 500px =
  RULE AF, already the builder's floor (360px).
