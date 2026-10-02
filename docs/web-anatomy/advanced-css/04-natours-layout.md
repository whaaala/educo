# Natours — building the page: responsive design and layout (section 4)

Advanced CSS and Sass, the section where the rest of the Natours page is built. Distilled from the transcripts the user
shared on 2026-10-01. This is the part of the course that bears most directly on the LAYOUT's definition of done.

## Lecture — the four principles of responsive design; the three layout methods

**Responsive design** = a page that adjusts its layout and visual style to any screen size — the whole device or just the
browser window — so it is usable on every kind of device. Four principles:

1. **Fluid layouts** — boxes adapt to the viewport width: **percentages, not pixels**, for everything that should change
   with the window; usually **`max-width`** rather than `width`.
2. **Responsive units** — **rem, not px**, for most lengths, so the whole page scales up or down from one setting.
3. **Flexible images** — images do NOT scale like text on their own; give them % dimensions and `max-width` so they fit
   every viewport.
4. **Media queries** — change styles at chosen viewport widths (**breakpoints**): different versions of the site per kind
   of device. Useless ALONE — the layout must be fluid, the units responsive and the images flexible from the start.

**Three ways to lay out a page** (all fully supported today):
- **floats** — boxes placed side by side with `float`; the OLD way, being replaced — still taught here (and built as a
  custom float grid in the next lecture) because the project's focus is other modern CSS, and because a working
  developer maintains older code full of float layouts;
- **Flexbox** — the modern way for ONE-dimensional layouts (a row) — the course's second project;
- **CSS Grid** — the modern way for TWO-dimensional layouts (whole pages, complex components) — the third project.

**For the builder — `HAVE`, all four principles, plus the one the course predates:**
- fluid: column widths in `%` of their line, `max-width: 100%`; auto-fit grids that STACK on narrow screens;
- units: rem first, % relative to the parent, px only for a 1px hairline (rule 16, guarded by
  `units-not-pixels.test.ts`);
- flexible media: images sized by `%` + `aspect-ratio` + rem, `max-width: 100%`, width/height set so nothing jumps;
- breakpoints: the five-rung ladder (rule 18 — phone · tablet portrait 600 · tablet landscape 900 · desktop 1200 · big
  desktop 1800, in `em`), `base` = desktop, cascading to narrower screens;
- **container queries** — a block adapts to ITS OWN box, not the viewport (rule 16's fourth ingredient) — which media
  queries cannot do, and which a builder needs: the same block sits in a full-width band or a 30% sidebar.
Layout methods: rows and stacks are **Flexbox**, the twelve-column grid is **CSS Grid**; the builder never lays out with
floats (and so never needs a clearfix). Text wrapping round a floated picture — the one thing floats still do that the
others cannot — is gap AC-8.

## Lecture — building a float grid (rows, columns, gutters, `calc`, `:not`, attribute selectors)

**What a grid is:** a design system that divides the available width into equal parts — halves, thirds, quarters — and
combinations (1/3 + 2/3; 1/4 + 1/4 + 2/4; 1/4 + 3/4), with a CONSTANT space between columns, the **gutter**. Columns
always sit in a **row**. The same logic extends to 6, 8, 12 columns. Classes: `.row`, `.col-1-of-2`, `.col-1-of-3`,
`.col-2-of-3`, `.col-1-of-4`, `.col-2-of-4`, `.col-3-of-4`. Filed under `layout/_grid.scss`.

**The row:** `max-width: $grid-width` (`114rem` = the common 1140px) — `max-width`, not `width`, so on a narrower screen it
takes 100% instead of overflowing; `margin: 0 auto` centres it (equal automatic left and right margins); a vertical gutter
between rows, `$gutter-vertical: 8rem`, on every row **`&:not(:last-child)`** — `:not()` selects everything EXCEPT what
it holds, so the last row has no space under it. All three are variables: one change resizes every grid on the site
(`$gutter-horizontal: 6rem`).

**The columns:** `float: left` and `margin-right: $gutter-horizontal` on every column `&:not(:last-child)`; widths by
**`calc()`**: `col-1-of-2 = (100% − gutter) / 2`, `col-1-of-3 = (100% − 2·gutter) / 3`, `col-1-of-4 = (100% − 3·gutter) / 4`;
a spanning column = n single columns + the (n−1) gutters inside it: `col-2-of-3 = 2·(1-of-3) + gutter`,
`col-2-of-4 = 2·(1-of-4) + gutter`, `col-3-of-4 = 3·(1-of-4) + 2·gutter`.
- **`calc()` vs Sass arithmetic:** `calc` MIXES units (`100% − 6rem`) because it runs in the BROWSER at layout time, when %
  and rem are known; Sass arithmetic runs at compile time and cannot mix them. A Sass variable inside `calc` needs
  interpolation: `#{$gutter-horizontal}`.
- **Attribute selector** for the shared column rules: `[class^="col-"]` (class STARTS WITH `col-`); also `*=` (contains),
  `$=` (ends with), `=` (exactly) — and e.g. `a[target="_blank"]` for links that open a new tab.
- The floated columns collapse the row → a **clearfix MIXIN** (`@mixin clearfix { &::after { content:""; display:table;
  clear:both } }`, `@include clearfix` in `.row`).

**For the builder — `HAVE`, every part, by the modern route:**
- the grid → the **twelve-column grid** (CSS Grid), with the table picker on top (1 · 2 · 3 · 4 · 6 · 12 across — "any
  count up to 12" is decided, L-4) and per-cell spans (a cell 2 of 3 or 3 of 4 wide is a span); rows of columns side by
  side are flex rows whose SHARES are percentages of the line;
- the gutter → `gap` / the band GUTTER (S1-a, `gutterCSS`: 1rem across, each column gives up one gap) — the same arithmetic
  as the lecture's `calc`, emitted as `calc((100% − m%) × share − gap)` (`tabletBasis`), and constant at every width;
- the vertical gutter → the stack / grid gap down (1rem by default, S-1);
- `:not(:last-child)` margins → not needed: `gap` puts space only BETWEEN items, never after the last;
- the centred `max-width` row → a band's *contained* width (the content held to a max width and centred) — see AC-9
  below for the one thing the lecture's version does that needs confirming;
- floats + clearfix → never: Flexbox and Grid do not collapse their parent.

**To confirm (AC-9):** a site-wide CONTENT WIDTH — every section's content held to one `max-width` (1140px) and centred,
the background still edge to edge, set ONCE and changed in one place. The builder has a contained band inset; whether it
is one page-wide setting (like `$grid-width`) or per band is to be checked for the definition of done.

## Lecture — the About section, part 1: section styles, gradient text, skew, utility classes

**Think first (think → build → architect):** the section breaks down into TYPOGRAPHY (a secondary heading, smaller
headings, paragraphs → `_typography`), a COMPONENT (a secondary, text-style button; the image composition — three photos
where the hovered one comes forward — a reusable module in its own file), the GRID (two columns) and the SECTION's own
style (a light grey band) → `pages/_home`, because no other page will have this section.

**Markup:** `<header>` · `<main>` (the main part of the page, for search engines and screen readers) · later `<footer>`.
(Emmet: `.test` + Tab → `<div class="test">`, `section.section-about` → the element with its class.)

**The section:** `background-color: $color-grey-light-1` (`#f7f7f7`, a very subtle contrast to white); `padding: 25rem 0`;
and **`margin-top: -20vh`** — the hero is 95vh tall and its slope ends at 75vh on the right, so the 20vh wedge under the
slope showed WHITE; pulling the next section up by exactly that difference puts the grey band UNDER the slope, so the
slope reads as a boundary between two coloured sections. (The big padding then keeps the content clear of the slope.)

**Gradient text (`.heading-secondary`):** 3.5rem, uppercase, 700; `display: inline-block` (so the background ends where
the words end); `background-image: linear-gradient(to right, $color-primary-light, $color-primary-dark)`;
`-webkit-background-clip: text` (the background is painted only where the text is) and `color: transparent` (so the
gradient shows through the letters).

**Hover with several transforms at once:** `transform: skewY(2deg) skewX(15deg) scale(1.1)` + `text-shadow: .5rem 1rem 2rem
rgba($color-black, .2)` + `letter-spacing` change, with `transition: all .2s`. (`skew` slants along an axis; transforms
combine in one declaration.) A tiny `letter-spacing: 2px` stays in px — it rounds to the same either way.

**Utility classes:** single-purpose, reusable classes — `.u-center-text { text-align:center }` around the inline-block
heading; `.u-margin-bottom-8 { margin-bottom: 8rem }` under it. WHY a utility rather than a margin on the heading: the
heading is a reusable block, and the space after it differs in each place it is used — a margin baked into the block
would make it depend on where it sits. The space belongs to the PLACE, not to the component.

**For the builder:**
- section background, padding, `<main>` → `HAVE` (a coloured band; Inner spacing; the automatic `<main>`, decision A1);
- the space-belongs-to-the-place principle → `HAVE` — Outer spacing per block, set where it is used, the component's
  own design untouched (S-2 (5): a component's space is OUTSIDE its painted box, set per placement);
- centring an inline-block heading → `HAVE` — text alignment / *Position in row*;
- skew + scale + shadow hover → motion area (AC-6/7 family), not layout;
- **gradient-filled text → GAP (AC-11)** — no `background-clip: text` option; a typography/style effect, not layout;
- **a section tucked UNDER the previous section's sloped edge → GAP to confirm (AC-10)** — `edgeBottom` clips the hero
  and what shows through the cut is the PAGE background (the course's white wedge); the next band does not move up beneath
  it. Real sites do this constantly (a slanted hero over a coloured band). A layout question.

## Lecture — the About section, part 2: tertiary headings, paragraphs, named spacing, the text button

**Typography:** `.heading-tertiary` (h3: `$default-font-size`, 700, uppercase) and `.paragraph` (`$default-font-size`,
`&:not(:last-child) { margin-bottom: 3rem }` — space BETWEEN paragraphs, none after the last). Use the real content when
there is any; Lorem ipsum (Emmet `lorem`) only as a stand-in.

**Utility classes NAMED, not numbered:** `.u-margin-bottom-small` (1.5rem), `-medium` (4rem), `-big` (8rem) — a name that
says the number (`-2`, `-8`) is an inline style in disguise; a name survives changing the value (small became 1.5rem
without touching the markup).

**One default font size:** `$default-font-size: 1.6rem`, used by paragraphs, h3, buttons — the client asks for bigger
text, ONE value changes everywhere. (Not the same thing as the 62.5% root, which defines what 1rem is.)

**DevTools → Computed** shows every property's final value — set, inherited, or initial (lecture 8c) — useful to confirm
rem became the px you expected.

**The text button `.btn-text`** (in `components/_button`, beside `.btn`): an `<a>` with `&rarr;` (an HTML entity; a
reference: CSS-Tricks' HTML entity list) — primary-green text, `inline-block`, no underline, its OWN underline as
`border-bottom: 1px solid` with `padding: 3px` (so the line sits a little below the words — impossible with
`text-decoration`); hover fills it (green background, white text, shadow `0 1rem 2rem rgba(black, .15)`,
`translateY(-2px)`), active presses it back (`translateY(0)`, smaller shadow), `transition: all .2s`. Tiny lengths (1px,
3px) stay px — they round to the same at any text size.

**For the builder:**
- paragraph spacing → `HAVE` — a stack's gap puts space only between blocks (no last-child margin);
- named spacing steps → `HAVE` — the spacing token scale (`--eu-space-*`) and "Default · size" in the inspector; the
  values are tokens, not numbers typed into a block;
- one default size → `HAVE` — the type scale's body size token; the theme changes it in one place;
- the text button → `PARTIAL`, component area — a Link styled as a button exists, and the Button has designs; a
  "text button with its own underline that fills on hover" is a VARIATION of the Button component (RULE S/T, built with
  the components), not layout;
- 1px/3px kept in px → `HAVE` — the rule-16 hairline exception, the same reasoning.
No layout gap.

## Lecture — the About section, part 3: the overlapping photo composition

**A component of its own** (`components/_composition`): `div.composition` holding three
`img.composition__photo.composition__photo--p1/p2/p3` — BEM's block, element, and a MODIFIER per photo because each sits
in a different place. (Emmet: `.composition>img.composition__photo.composition__photo--p1*3`.)

**Overlapping photos, placed by percentages:** every photo `position:absolute; width:55%`, a shadow
(`0 1.5rem 4rem rgba(black,.4)`), a small radius; the `.composition` is `position:relative` so it is their reference box.
`--p1 { left:0; top:-2rem }` (a little above the text's first line), `--p2 { right:0; top:2rem }`,
`--p3 { left:20%; top:10rem }`. Widths and offsets in % so the composition SCALES with its column (flexible images,
responsive principle 3).

**Hover:** the hovered photo `transform: scale(1.05) translateY(-.5rem)`, a bigger darker shadow, `z-index: 20` over the
others' 10 (it comes to the FRONT), `transition: all .2s`; and a ring with a GAP between it and the photo:
**`outline: 1.5rem solid $color-primary` + `outline-offset: 2rem`** — an outline can stand off the element, a border
cannot.

**The other photos shrink — a one-line selector:** `.composition:hover .composition__photo:not(:hover) { transform:
scale(.95) }` — "when the GROUP is hovered, every photo in it that is NOT hovered". It reacts as soon as the pointer enters
any photo.

**For the builder:**
- overlapping photos in a box → `HAVE` — Floating blocks inside a section, placed against it, in % (free positions are
  stored as %, rule 16), with a layer order (front / back);
- the hovered one coming to the FRONT → `PARTIAL` — a floating block has a fixed layer; "raise on hover" is not an option;
- ring with a gap (`outline-offset`) on hover → `PARTIAL` — the *Outline* hover effect exists; whether it can stand OFF the
  block is to be checked — style/motion area;
- **siblings react when one is hovered (a group hover: the others shrink / fade) → GAP (AC-12)** — interactions are per
  block today; a "when any item of this group is hovered, the rest …" effect does not exist. Motion/interaction area, not
  layout.

## Lecture — the Features section: an icon font, feature boxes, a skewed section, the direct-child selector

**An icon font** (Linea basic, linea.io): a font whose glyphs are icons — VECTORS, so they stay sharp at any zoom, unlike
PNG icons; the downloaded CSS loads the font in four formats (for every browser) and gives one class per icon:
`<i class="feature-box__icon icon-basic-world"></i>` (`<i>` by convention — it once meant italic, not "icon"). Because the
icon IS text it is sized with `font-size: 6rem` and can take the gradient-text trick (`background-clip: text`).
SVG icons — better still — come in the next project.

**Markup:** `section.section-features > .row > .col-1-of-4 > .feature-box` (×4: Explore the world · Meet nature · Find your
way · Live a healthier life), each box = icon + `h3.heading-tertiary` (reused) + `p.feature-box__text`. A **box INSIDE the
column**, rather than styling the column: the grid's code stays untouched — no scaling, padding or hover on grid columns;
anything like that goes on a box placed in them.

**The section:** `padding: 20rem 0` (generous white space is the modern look); the hero's background recipe again —
`linear-gradient(to right bottom, rgba(light,.8), rgba(dark,.8)), url(nat-4.jpg)`, `background-size: cover`.

**The feature box** (`components/_feature-box`): `background-color: rgba($color-white, .8)` (translucent white over the
photo), `font-size: 1.5rem` (the paragraph INHERITS it — no rule needed on the text), `padding: 2.5rem`, centred text,
a SMALL `border-radius` (3px — small reads modern, large reads dated here), a shadow; hover `transform: translateY(-1.5rem)
scale(1.03)` with `transition: transform .3s` (name the one property animated).

**The skewed section — a second way, without `clip-path`:** `transform: skewY(-7deg)` on the WHOLE section (the angle chosen
to match the hero's slope by eye), then **`& > * { transform: skewY(7deg) }`** to straighten its content again;
`margin-top: -10rem` to close the white gap the skew opens above it (by trial: −9 showed white). The **direct-child
selector `>`** matters: `& *` would skew EVERY descendant again (content skewed twice or three times over); `& > *` only the
direct children (here, the `.row`). The background photo is skewed too — unnoticeable.

**For the builder:**
- icons → `HAVE`, better than an icon font: inline SVG with `currentColor` and `em` sizing (memory
  `feedback_phase1_responsive_themed.md`) — no font download (RULE AF weight), each icon sharp, sized and coloured like text;
  a gradient-filled icon is AC-11;
- feature boxes in four columns → `HAVE` — a Card (or a styled Stack) in each of four grid cells / columns, and the
  "style a box in the cell, not the cell" lesson is how the builder is used (a cell is the slot, the card the content);
- translucent box over a photo band → `HAVE` (a background colour with transparency over a section photo + overlay);
- hover lift + grow → `HAVE` (*Lift*, *Grow*);
- **a section slanted at BOTH edges, parallel** → `HAVE` by the clip-path route — `edgeTop` and `edgeBottom` both
  `slope-left` (or `-right`) give the same parallelogram band without transforming the content; the skew trick is not
  needed;
- **pulled up over the previous section** (`margin-top: -10rem` so the slant overlaps the band above) → AC-10 again — the
  section-overlaps-the-one-before question.

## Lecture — the Tours section, part 1: the rotating (flip) card

**The section:** `section.section-tours` = the light-grey band again (same background and padding as About) +
`.u-center-text > h2.heading-secondary` (reused) + a row of THREE `.col-1-of-3`, a `.card` in each (the column untouched);
`margin-top: -10rem` (pulled up under the skewed Features band) and, for now, a big bottom padding.

**The flip:** the card turns 180° about the Y axis on hover, showing its back.
- `.card { perspective: 150rem; -moz-perspective: 150rem; position: relative; height: 50rem }` — **perspective goes on
  the PARENT** of the element that rotates; the lower the value the more dramatic the 3D (15rem is wild, very large is
  flat); without it the turn looks flat, with it the card seems to swing toward you.
- Two children, `.card__side.card__side--front` and `.card__side.card__side--back`, both `position:absolute; top:0;
  left:0; width:100%; height:50rem; backface-visibility: hidden` (each side is invisible from behind) and
  `transition: all .8s ease` (the default timing would be linear… the course says; `ease` reads smoother).
- The back STARTS turned: `--back { transform: rotateY(180deg) }`; on **`.card:hover`** the front goes to
  `rotateY(-180deg)` and the back to `rotateY(0)` — the hover is on the CARD (the block), not on a side.
- Both sides absolute → the card's height COLLAPSES (like floats, but no clearfix exists for absolute) → the card and the
  sides are given the same explicit height (`50rem`).

**The back's colour:** a gradient per card — three modifiers `--back-1/-2/-3`, each `background-image:
linear-gradient(to right bottom, light, dark)` in a new pair of brand colours: `$color-secondary-light/-dark`
(`#ffb900` → orange) and `$color-tertiary-light/-dark` (blue → pink), the green pair in the middle. (Palettes from design
inspiration sites — the course's resources page.) Front: white. Both: `border-radius: 3px`, shadow
`0 1.5rem 4rem rgba(black,.15)` — and the advice to turn repeated shadows into a few shadow VARIABLES.

**For the builder:**
- the band, the heading, three cards in three columns → `HAVE`;
- brand colour pairs as gradients → `HAVE` — the OKLCH scales of each brand colour (`-50 … -900`) give the light/dark pairs;
  shadows are already tokens (`--eu-shadow-*`, the radius/shadow scales);
- **a FLIP card (front + back, turns on hover with perspective, back face hidden) → GAP (AC-13)** — a COMPONENT with two
  faces; the builder's Card has one face. Component area (`docs/COMPONENT_GAPS.md`), not layout; it must also offer a
  keyboard / touch way to see the back (hover alone fails on phones and for keyboard users — the research's ARIA rules);
- equal-height cards in a row → `HAVE` without fixed heights: a row stretches its columns to the tallest (`align-items:
  stretch`), so the course's collapse problem does not arise.

## Lecture — the Tours section, part 2: the card's front (blend modes, clipped picture, the two-line heading, the list)

**A fix first:** the front must turn to `rotateY(-180deg)`, not `180deg`, so front and back rotate the SAME way and the
card reads as one object turning (slow the transition to 8s to see such a thing).

**The front has three parts** — BEM keeps them elements of the BLOCK, not of the side: `.card__picture.card__picture--1`,
`h4.card__heading` (an `h4` — after h1, h2, h3: SEMANTIC markup, a heading tag for a heading), `.card__details`.

**The picture as a CSS BACKGROUND** (an empty `div` holding `&nbsp;`), so it can be BLENDED:
`background-image: linear-gradient(to right bottom, $color-secondary-light, $color-secondary-dark), url(../img/nat-5.jpg)`
+ **`background-blend-mode: screen`** — the gradient and the photo mix like layers in Photoshop (`multiply`, `overlay`,
`color`, `soft-light`… — try them in DevTools); `background-size: cover` on every picture, `height: 23rem` (an empty box
needs one). The card gets **`overflow: hidden`** so the picture does not poke out of the card's rounded corners. The
picture's bottom is cut on a slant: `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)` (+ `-webkit-clip-path` first);
`clip-path` also takes `circle()` / `ellipse()` (used later). Neither blend modes nor clip-path worked in IE/old Edge.
Free photos: unsplash.com.

**The heading OVER the picture:** `position:absolute; top:12rem; right:2rem; text-align:right`; 2.8rem, weight 300,
uppercase, white, `width: 75%`. Its words sit in `span.card__heading-span.card__heading-span--1` with a translucent
gradient (`rgba(light, .85)` → `rgba(dark, .85)`), `padding: 1rem 1.5rem` — and **`box-decoration-break: clone`**
(`-webkit-` too): when the span WRAPS onto two lines, each line gets its own full padding and background, as if two
separate labels, instead of one box broken in half (no padding where the line breaks).

**The details list:** `ul` (no BEM class on each `li` — the block selector `.card__details ul li` is enough here),
`list-style: none`, `width: 80%`, centred with `margin: 0 auto`, `padding: 3rem`; each `li` centred, 1.5rem, padding, and a
`1px solid $color-grey-light-2` line under every item `:not(:last-child)`.

**For the builder:**
- picture + gradient overlay → `HAVE` (`bgImage` + `bgOverlay`); **blend modes → GAP (AC-14)**: no blend control — the
  overlay is painted over the photo, never mixed with it (`screen`, `multiply`, `overlay`…). Style area;
- rounded card clipping its picture → `HAVE` (*Trim to size* / clip on the card);
- **a slanted cut on a picture or any box, not only a band's edge → PARTIAL (AC-1 family)** — `edgeTop`/`edgeBottom`
  belong to sections; a picture inside a card cannot take one. Shape/mask area;
- heading laid over a picture, right-aligned → `HAVE` (a Floating block placed against the card, or the hero's content
  position);
- **a highlighted heading whose background and padding repeat on every wrapped line (`box-decoration-break: clone`) →
  GAP (AC-15)** — typography/style area; it matters on a phone, where such a label wraps;
- a centred list narrower than its card with lines between items → `PARTIAL` — a List block exists; dividers between its
  items and a narrower centred width (Outer spacing / max width) to be checked in the List component's variations.
No layout gap.

## Lecture — the Tours section, part 3: the card's back, the other two cards, the section's button

**The back's call to action** `.card__cta`: the absolute-centre method again (`top:50%; left:50%;
transform: translate(-50%,-50%)`), `width: 90%` (an absolute box shrinks to its content — without a width the button's
words broke onto several lines), `text-align:center`; inside it `.card__price-box` (centred, `margin-bottom: 8rem`,
`color: white` — inherited by both paragraphs) with `p.card__price-only` ("Only", 1.4rem, uppercase) and
`p.card__price-value` ("$297", **6rem at weight 100** — very large type reads best THIN), then `a.btn.btn--white` "Book
now". Naming every element is the hard part of BEM; any clear name will do.

**Cards 2 and 3** are copies with their modifiers (`--2` green / primary, `--3` blue-pink / tertiary), their own photos
(`nat-6`, `nat-7`) and content (The Forest Hiker · The Snow Adventure; $497 · $897) — COMPONENT reuse: a page listing every
tour would reuse the same card.

**The section's button** under the cards: `div.u-center-text.u-margin-top-huge > a.btn.btn--green` "Discover all tours" — a
new modifier `.btn--green` (primary green, white text) and new utilities `.u-margin-top-big` / `-huge` (10rem): the space
above the button belongs to this PLACE, not to the button. A shadow can make an 8rem space LOOK larger than another 8rem
space — adjust by eye. Section bottom padding reduced to 15rem.

**A browser trap:** in Chrome, `clip-path` on the picture BROKE the card's `overflow: hidden`, so its top corners were no
longer rounded → the picture gets its own `border-top-left-radius` / `border-top-right-radius: 3px`. (About 160 lines of
Sass for the card component.)

**For the builder:**
- a call-to-action box centred in a card, a price set large and thin, a button → `HAVE` (*Content position* centre/middle,
  type size and weight per block, the Button);
- content set to a % width so a button never breaks its words → `HAVE`, and a column too narrow for its words is S-3's
  planned warning (c-8 in L-4: the grid gives up columns rather than break words);
- modifiers per card / reusing the card → `HAVE` (designs, duplicate);
- space above the button set where it is used → `HAVE` (Outer spacing);
- the `clip-path` + rounded-corner trap → a canvas = Preview check to remember when AC-1 (a slanted cut on a picture)
  is built: clip the picture AND round its own corners.
No new gap (the flip card is AC-13).

## Lecture — the Stories section, part 1: text flowing round a circle (`shape-outside`), a skewed card

**The section:** `section.section-stories` (padding 15rem 0; a temporary grey background — a background VIDEO comes later)
+ the centred `h2` + a `.row` used WITHOUT columns — simply as the centred, max-width container with the row's bottom
margin — holding a `.story` component.

**The story card** (`components/_story`): `width: 75%; margin: 0 auto` (a block centred in a block), white, `padding: 6rem`
(9rem on the left), shadow `0 3rem 6rem rgba(black,.1)`, `border-radius: 3px`, `font-size: $default-font-size` (inherited
by the paragraph). Inside: **`figure.story__shape`** (semantic: an IMAGE with a CAPTION — `figure` + `figcaption`, the
caption being the customer's name) and `div.story__text` (`h3.heading-tertiary.u-margin-bottom-small` + a paragraph).

**Text flowing round a circle:** the shape is `width:15rem; height:15rem; float:left` and
**`shape-outside: circle(50% at 50% 50%)`** (radius 50% of the box = 7.5rem; centre in the middle) — the text wraps round
the CIRCLE, not the square box. `shape-outside` only works on a FLOATED element with a set width AND height (Chrome and
Safari, `-webkit-` in Safari, at the time). To make the box LOOK round as well: `clip-path: circle(50% at 50% 50%)`. The
photo inside fills the circle with `height: 100%` (it is wider than tall — `width: 100%` would leave a gap). Move a float
with `transform: translateX(-3rem)`, not margins (and widen the padding to make room).

**The skewed card:** `transform: skewX(-12deg)` on the story, and its two children skewed BACK (`skewX(12deg)`) so the
text and photo stand straight — the shape needs `transform: translateX(-3rem) skewX(12deg)` in ONE declaration, because a
second `transform` on the same element REPLACES the first (one `transform` per element in 2017; individual `translate`,
`rotate` and `scale` properties now exist in CSS and combine independently).

**For the builder:**
- the card centred at 75% with padding and a shadow → `HAVE`; `figure` + `figcaption` for a captioned picture → to check
  in the Image block's semantics (`docs/web-anatomy/html-semantics.md` — a caption option);
- **words flowing round a picture — and round its SHAPE (a circle) → GAP, AC-8 widened**: no float, no `shape-outside`;
  a picture sits BESIDE text in a column, never inside the text's flow. Layout DoD;
- **a slanted (parallelogram) CARD with straight content inside → PARTIAL (AC-1 family)** — sections can slope at their
  edges; a card / box cannot skew. Shape area;
- a round photo → `HAVE` (radius 50% with the five radius controls, or a circle mask).

## Lecture — the Stories section, part 2: the caption that rises, the photo that blurs (`filter`)

**The caption** `figcaption.story__caption` (the customer's name) sits exactly over the photo: `position:absolute;
top:50%; left:50%` in the `position:relative` shape; white, uppercase, 1.7rem, centred. Resting:
`transform: translate(-50%, 20%); opacity: 0` (below centre, invisible); on **`.story:hover`** →
`translate(-50%, -50%); opacity: 1` — it rises into the middle and fades in; `transition: all .5s`;
`backface-visibility: hidden` cures the 1px jump at the end. Keep the SAME transform function list in both states
(`translate(x, y)` → `translate(x, y)`), or the animation goes wrong.

**The photo zooms OUT and blurs on hover:** resting `transform: translateX(-4rem) scale(1.4)` (also re-centres the person
in the circle; `backface-visibility: hidden` fixes a cropping glitch), hover → `translateX(-4rem) scale(1)` plus
**`filter: blur(3px) brightness(80%)`**. `filter` offers `blur`, `brightness` (<100% darker, >100% brighter),
`contrast`, `grayscale`, `hue-rotate(deg)`, `opacity`, `saturate`, `sepia` — try them live in DevTools (`:hov` →
force `:hover`).

**Then:** a second story (Jack Wilson) — the same component reused — and `a.btn-text` "Read all stories →" under them.

**For the builder:**
- a caption laid over a picture, revealed on hover → `PARTIAL` — a block can float over a picture; "appear on the
  parent's hover" is a group-hover interaction (AC-12 family);
- the picture zooming / blurring / darkening on hover → `PARTIAL` — hover effects include *Grow* and *Soften*; image
  FILTERS (blur, brightness, grayscale…) as a resting look or a hover look → AC-16 (style/motion area);
- reusing the story card → `HAVE` (duplicate; a component).
No layout gap.

## Lecture — the Stories section, part 3: a background video (`<video>`, `object-fit`)

**Markup** — a container INSIDE the section holding the video, its own component (`components/_bg-video`, reusable):
`div.bg-video > video.bg-video__content[autoplay muted loop] > source[src=img/video.mp4][type=video/mp4] +
source[src=img/video.webm][type=video/webm]` + a fallback sentence ("Your browser is not supported!") shown only if no
source plays. Two FORMATS so every modern browser finds one. `autoplay` is acceptable ONLY because the video is `muted`
(and it must `loop` to keep going). Free background videos: coverr.co (they come in both formats).

**Styles:**
- `.bg-video { position:absolute; top:0; left:0; height:100%; width:100%; z-index:-1; opacity:.15; overflow:hidden }`
  — exactly the size of the section (`.section-stories { position:relative }`), BEHIND everything (negative z-index), very
  faint; the section's own background colour removed so the video shows;
- `.bg-video__content { height:100%; width:100%; object-fit: cover }` — **`object-fit`** does for an ELEMENT (video,
  img) what `background-size` does for a background: `cover` fills the box keeping the aspect ratio and crops the excess
  (`fill` stretches it out of proportion; `contain` fits it whole, leaving bars); `overflow:hidden` crops what spills.
- the story card's white becomes `rgba($color-white, .6)` — translucency on the BACKGROUND only (`opacity` would fade the
  words too).

**For the builder:**
- **a video as a section's background → GAP (AC-17)** — a Video block exists, a section background is a colour, a
  picture, a gradient or a pattern, never a video. A real-site pattern (heroes, testimonial bands) and a LAYOUT-adjacent
  one (a band's background); with RULE AF's limits: muted, a poster frame, no autoplay on Save-Data / slow connections,
  a reduced-motion stop, and weight counted in the page budget;
- `object-fit: cover` for pictures in a box → `HAVE` (the Image block crops to its box with `object-fit: cover`,
  `box-model.ts` ~4032);
- a translucent card background (colour with alpha, not `opacity`) → `HAVE`.

## Lecture — the Booking section, part 1: the box, the "solid-colour gradient", the form's markup

**Split by reuse:** the FORM (its groups, inputs, labels, radio buttons, button) is a reusable COMPONENT
(`components/_form`) — a contact form elsewhere would reuse it; the BOX it sits in here (a full-width card with a photo
and a slanted white panel) is unique to the home page → `pages/_home`. `section.section-book` (padding 15rem 0; the green
gradient as background) > `.row` > `.book` > `.book__form` (`width: 50%; padding: 6rem`) > `form.form`.

**The box:** `background-image: url(nat-10.jpg); background-size: 100%` (100% = as wide as the box — like `cover` here;
smaller percentages TILE the image), `border-radius: 3px` (the course suggests a radius VARIABLE — consistency), a shadow a
little darker (`.2`) because the background is already dark.

**The "solid-colour gradient"** — a hard edge made by a gradient instead of `clip-path`:
`linear-gradient(105deg, rgba($color-white, .9) 0%, rgba($color-white, .9) 50%, transparent 50%), url(nat-10.jpg)`.
- An ANGLE instead of a keyword: `90deg` runs left → right; `105deg` tilts the line;
- COLOUR STOPS: a colour at a position (`0%`, `50%`…); between two stops the colour blends;
- TWO STOPS AT THE SAME POSITION make no blend at all — a SHARP line: white up to 50%, transparent from 50% → a
  translucent white panel on the left with a SLANTED edge, the photo visible on the right. (`transparent` is a valid
  colour.) Simpler than `clip-path` where the shape is a straight division; a cut-away wedge still needs `clip-path`.

**The form's markup:** `form.form[action="#"]` (the `action` is where it would be sent; this one only gets styled) holding
`h2.heading-secondary.u-margin-bottom-medium` "Start booking now" (no `u-center-text` here) and `.form__group`s, each an
`input.form__input` + `label.form__label`:
- `<input type="text" placeholder="Full name" id="name" required>` + `<label for="name">Full name</label>` — `for` = the
  input's `id`: clicking the label focuses the input (and screen readers announce it);
- `type="email"` — the browser checks it is an email address; `required` — the form cannot be sent empty.

**For the builder:**
- a gradient section → `HAVE`; a card with a photo → `HAVE`;
- **a translucent panel with a SLANTED inner edge over a photo** (the hard-stop gradient) → `PARTIAL` — an overlay can be a
  raw CSS gradient (`isCssBg`), so the look is reachable, but no control offers "a split at an angle with a sharp edge";
  part of the background/overlay controls (style area), close to AC-1's slanted cuts;
- **the form** → a COMPONENT GAP already recorded (Forms, `docs/COMPONENT_GAPS.md`; RULE AF: forms that queue offline);
  the course's anatomy — label tied to its input by `for`/`id`, `required`, `type="email"` — is the accessibility floor it
  must meet (`docs/web-anatomy/components.md`).

## Lecture — the Booking section, part 2: styling the inputs (focus, `:invalid`, placeholder, the floating label)

**The input** (`components/_form`): `font-size: 1.5rem; padding: 1.5rem 2rem` (MORE on the sides than top/bottom — a field
or button looks right that way); `border-radius: 2px` (smaller element, smaller radius); `background: rgba(white, .5)`;
`border: none`; `width: 90%; display: block`. **Form fields do not inherit type** — set `font-family: inherit` and
`color: inherit` on them. Groups spaced with `.form__group:not(:last-child) { margin-bottom: 2rem }`.

**Focus, done accessibly:** `:focus { outline: none }` removes the browser's ring — but keyboard users must SEE which field
has focus, so it is REPLACED, never just removed: `box-shadow: 0 1rem 2rem rgba(black, .1)` and
`border-bottom: 3px solid $color-primary`. A `3px solid transparent` bottom border in the resting state stops the field
jumping by 3px when focus adds it.

**The placeholder:** `&::-webkit-input-placeholder { color: $color-grey-dark-2 }` (a pseudo-ELEMENT — `::` — because the
placeholder is a thing on the page; `:focus` is a pseudo-CLASS, a state). Light grey placeholder, dark typed text.

**Validation styling:** the browser checks `type="email"` and `required`; CSS reads it with **`:invalid`** / `:valid`.
`&:focus:invalid { border-bottom: 3px solid $color-secondary-dark }` — orange while a FOCUSED field is wrong, green once
right (only while focused, so an untouched form is not shouted at).

**The floating label — pure CSS:** the label (1.2rem, bold, `margin-left: 2rem` to line up with the typed text,
`margin-top: .7rem`, `display: block`, `transition: all .3s`) is hidden while the field is empty and drops into view
below it once something is typed: `.form__input:placeholder-shown + .form__label { opacity: 0; visibility: hidden;
transform: translateY(-4rem) }`.
- **`:placeholder-shown`** = the field is empty (its placeholder showing);
- **`+` the ADJACENT sibling selector** — the element immediately after; **`~` the GENERAL sibling selector** — any later
  sibling. A sibling can only be selected if it comes AFTER — so the markup is `input` THEN `label` (the label goes after
  the input for this to work);
- `opacity: 0` animates; `visibility: hidden` removes it properly — use both (visibility alone cannot fade).

**For the builder:** all FORM component territory (Forms gap, `docs/COMPONENT_GAPS.md`). What it must carry over, from this
lecture: inputs inherit the theme's type; a focus style that is REPLACED, never removed (WCAG 2.4.7 — the research's
component rules), stable size between states; validation shown on the focused field with a message, not by colour alone
(WCAG 1.4.1 — the orange/green border needs words beside it); the floating label is acceptable ONLY while a real `<label>`
stays tied to the input (`for`/`id`) — a placeholder is never the only label. No layout gap.

## Lecture — the Booking section, part 3: custom radio buttons, the submit button, `!important` in utilities

**Radio markup:** a `.form__group` with two `.form__radio-group`s, each `input.form__radio-input[type=radio][id=small]
[name=size]` + `label.form__radio-label[for=small]` "Small tour group" holding an empty `span.form__radio-button`. Radios
that share a `name` form ONE group (choosing one unchecks the other); the `for`/`id` link means a click on the LABEL checks
the input even when the input is hidden — which is the whole trick.

**The custom button (native radios cannot be styled):** the span is the outer ring — `height:3rem; width:3rem; border:5px
solid $color-primary; border-radius:50%; display:inline-block; position:absolute; left:0; top:-.4rem` inside a
`position:relative` label with `padding-left: 4.5rem`, `cursor: pointer`; its **`::after`** is the inner dot —
`content:""; display:block; height:1.3rem; width:1.3rem; border-radius:50%; background:$color-primary`, centred with
`top:50%; left:50%; transform:translate(-50%,-50%)`, `opacity:0; transition: opacity .2s`. The selector that switches it on:
**`.form__radio-input:checked ~ .form__radio-label .form__radio-button::after { opacity: 1 }`** — `:checked` on the input,
the SIBLING label (`~` or `+`), its CHILD span, the span's `::after`. Then `.form__radio-input { display: none }`. Checkboxes
work the same way. The two groups sit side by side as `inline-block` at `width: 49%` (50% wrapped, because of the space
between inline-blocks).

**The submit button:** a real `<button class="btn btn--green">Next step &rarr;</button>` — a form needs a BUTTON to
submit (a link cannot). `.btn` styles were scoped to `&:link, &:visited`, which a `<button>` never matches — so the rules
move to the plain `.btn` too, with `border: none; cursor: pointer`. Its focus ring is not removed but REPLACED:
`&:focus { outline: none; [the :active look] }`.

**`!important` belongs in UTILITY classes:** `.u-margin-bottom-medium` lost to `.form__group:not(:last-child)` (more
specific) — a utility exists to WIN wherever it is placed, so utilities carry `!important` (the one place the course
endorses it). Also: a `transition: all .3s` on the input animates its focus/validation border.

**For the builder:** FORM component territory again — custom-drawn radio and checkbox controls that keep the native input
for function and accessibility (hidden visually, not with `display:none`, which removes it from keyboard use and screen
readers in some browsers — the research's ARIA rules: use a visually-hidden pattern instead), a real `<button
type="submit">`, focus replaced not removed. The `!important`-in-utilities lesson does not apply: the builder emits no
utility classes — a per-block setting IS the block's own rule. No layout gap.

## Lecture — the footer

**Markup:** `<footer class="footer">` (outside `<main>` — the footer is not the main content; every element still gets a
class, BEM) > `.footer__logo-box > img.footer__logo` (the large green logo) + a `.row` of two `.col-1-of-2`: left
`.footer__navigation > ul.footer__list > li.footer__item > a.footer__link` ×5 (Company · Contact us · Careers · Privacy
policy · Terms) — a navigation is a list of links; right `p.footer__copyright` with inline `footer__link`s and `&copy;`.

**Styles** (`layout/_footer` — a LAYOUT part, like the header): `background-color: $color-grey-dark-3` (`#333`), less
padding than the content sections (`10rem 0`) and a smaller font size — the footer matters less, so it gets less space;
`color: $color-grey-light-1` on the footer so the copyright INHERITS it (white on dark is avoided: a light grey reads
softer). Logo: `width: 15rem`, centred by `text-align: center` on its box (an `img` is inline — it centres like text),
`margin-bottom: 8rem`. List: `list-style: none`; items `display: inline-block` side by side, `margin-right: 1.5rem` on
`:not(:last-child)`; links light grey, no underline, uppercase, `inline-block`, `transition: all .2s`; hover/active —
`color: $color-primary`, a shadow `0 1rem 2rem rgba(black,.4)`, `transform: rotate(5deg) scale(1.3)` and a background in
the footer's own colour (so the enlarged link covers its neighbour instead of overlapping it transparently).
`.footer__navigation` and `.footer__copyright` each `border-top: 1px solid $color-grey-dark`, `padding-top: 2rem`; the
navigation `display: inline-block` so its line is only as long as the links; the copyright `width: 80%; float: right` so
the two halves look balanced.

**For the builder:**
- a dark footer band, a centred logo, a row of two columns, links side by side, a copyright line → `HAVE` (the dresser's
  footer is exactly this structure: a band with columns of Link blocks; `<footer>` landmark, footer lines spread — L-2);
- type and colour set once on the footer and inherited → `HAVE` (typography cascades from any container);
- a line ABOVE a group, only as long as its content (`inline-block` + `border-top`) → `PARTIAL` — borders per side exist
  on a box; a box that hugs its content does it; to confirm in the UAT pass;
- a column's content shorter and pushed to one side for balance (`width: 80%; float: right`) → `HAVE` (width + *Position
  in row*);
- the rotating, scaling link hover → motion area (AC-6 family). No layout gap.

## Lecture — the full-screen navigation, part 1: the parts, `position: fixed`, the radial circle, the sweeping link hover

**How it behaves:** a round button stays in the top-right corner while the page scrolls; hovering spreads its three lines;
clicking turns them into an X while a green CIRCLE behind the button grows to fill the whole screen and a list of five
big links slides in from the left, centred; clicking again reverses it.

**The checkbox hack (introduced here, finished next lecture):** a hidden `<input type="checkbox">` + a `<label>` tied to it
(the round button — a click on the label toggles the checkbox, as with the radio buttons) + CSS that reveals the menu when
the checkbox is `:checked`. No JavaScript.

**Markup** (the first thing in `<body>`, `layout/_navigation`): `div.navigation > input.navigation__checkbox#navi-toggle +
label.navigation__button[for=navi-toggle] + div.navigation__background (&nbsp;) + nav.navigation__nav > ul.navigation__list
> li.navigation__item > a.navigation__link` ×5 (About Natours · Your benefits · Popular tours · Stories · Book now), each
link starting with a small number in a `span` ("01") — a plain `span` with no class: "rules are meant to be broken
sometimes", when a class would be overkill.

**Styles:**
- `.navigation__background`: a 6rem circle (`border-radius: 50%`), **`position: fixed`** (like absolute, but it stays put
  while the page SCROLLS; placed against the viewport) `top: 6.5rem; right: 6.5rem`, **`background-image:
  radial-gradient($color-primary-light, $color-primary-dark)`** (a radial gradient spreads from the CENTRE outward; a
  linear one goes side to side), `z-index: 1000`; when the menu opens it will be `transform: scale(80)` (50 does not cover
  a big screen) — the circle growing IS the effect;
- `.navigation__button`: a WHITE 7rem circle, fixed at `top: 6rem; right: 6rem` (1rem bigger and .5rem further out, so it
  fully COVERS the green circle at rest), `z-index: 2000` (always on top);
- `.navigation__checkbox { display: none }`;
- `.navigation__nav`: `position: fixed; top: 0; right: 0; height: 100vh; width: 100%; z-index: 1500` (above the circle,
  below the button) — a full-screen box whose only job is to centre the list in it;
- `.navigation__list`: the absolute-centre method (`top/left: 50%` + `translate(-50%,-50%)` — the course suggests a
  `@mixin` for it, it recurs so often), `list-style: none`, `text-align: center`; items `margin: 1rem`;
- `.navigation__link:link, :visited`: `display: inline-block` (so padding and transforms work on a link — the transition
  did nothing until this), 3rem, weight 300, white, uppercase, no underline, `padding: 1rem 2rem`, `span { margin-right:
  1.5rem; display: inline-block }`;
- **the sweeping hover — an ANIMATED solid-colour gradient:** `background-image: linear-gradient(120deg, transparent 0%,
  transparent 50%, $color-white 50%); background-size: 220%` (twice the link's width — only the transparent half shows;
  220 not 200 because the 120° slant needs the margin) + `transition: all .4s`; on `:hover, :active` →
  `background-position: 100%` (the gradient slides left: the WHITE half sweeps in behind the words with a slanted leading
  edge), `color: $color-primary`, `transform: translateX(1rem)`.

**For the builder:**
- a button fixed in a corner → `HAVE` (*Floats on screen* — `fixed`, with the pin stacking of F1-b);
- **the whole full-screen menu** (a burger that opens an overlay with the links, closes again, traps focus while open) →
  the NAVIGATION COMPONENT GAP already recorded (`docs/COMPONENT_GAPS.md`, "hamburger / overlay menu"; the user's
  Navigation plan comes first). The research is clear the checkbox hack is NOT how it should be built: the button must be a
  real `<button aria-expanded aria-controls>`, Escape must close it, focus must move into the menu and back (WCAG 2.1.2,
  2.4.3) — a few lines of script, progressive enhancement over a plain list of links;
- radial gradients → `PARTIAL` (a raw CSS gradient is accepted as a background; no control offers radial);
- **the sweeping fill on hover** (an animated hard-edged gradient) → GAP (AC-18), motion area. No layout gap.

## Lecture — the full-screen navigation, part 2: the checkbox hack made to work, `cubic-bezier` timing

**Hidden at rest:** `.navigation__nav { opacity: 0; width: 0 }` — `opacity: 0` alone left the links INVISIBLE BUT CLICKABLE
(the pointer turned to a hand over them); `width: 0` removes them. The button gets a subtle shadow
(`0 1rem 3rem rgba(black, .1)`).

**The hack:** `.navigation__checkbox:checked ~ .navigation__background { transform: scale(80) }` and
`.navigation__checkbox:checked ~ .navigation__nav { opacity: 1; width: 100% }` — `:checked` on the hidden checkbox, then the
GENERAL sibling `~` (the background is not the input's immediate neighbour, so `+` would miss it).

**Animating it:** `transition: transform .8s cubic-bezier(.86, 0, .07, 1)` on the background (only the property that
moves); `transition: all .8s cubic-bezier(.68, -.55, .265, 1.55)` on the nav. The list gets `width: 100%`; because the nav's
width grows from 0 at the right edge, the centred list slides in from the side — an accidental but welcome motion, kept
(the nav anchored `left: 0`).

**Custom easing — `cubic-bezier(x1, y1, x2, y2)`:** an easing function says how much of the change happens over time; the
built-ins are `ease`, `ease-in` (slow start), `ease-out` (slow end), `ease-in-out`. Four numbers draw any curve — tools:
easings.net (named curves with their numbers) and cubic-bezier.com (drag the curve, compare it with a built-in). The
first curve starts gently and then rushes; the second has y values OUTSIDE 0–1 ("this curve contains values out of
range") — it OVERSHOOTS and comes back (here the width briefly reaches ~105%), a springy feel.

**For the builder:**
- the menu itself → the Navigation component gap (as part 1 records: real `<button aria-expanded>`, not the checkbox hack;
  hidden items removed from the tab order, which `width: 0` / `opacity: 0` does NOT do — `visibility: hidden` or `inert`
  is needed, or keyboard users tab into invisible links);
- **custom easing curves, including overshooting ones** → AC-6 (motion: easing per effect); the builder's motion tokens
  (`docs/web-anatomy/motion-effects.md`) are where named curves live, each with a reduced-motion fallback;
- "animate only the property that changes" → `HAVE` (the builder's effects animate `transform` / `opacity` only). No
  layout gap.

## Lecture — the full-screen navigation, part 3: the burger icon that becomes an X; `transform-origin`

**Three lines from one element:** `span.navigation__icon` (inside the button label) is the middle line; its `::before` and
`::after` are the top and bottom lines. All three: `width: 3rem; height: 2px` (2px stays px — a hairline should not grow),
dark grey, `display: inline-block`; the pseudo-elements `content: ""; position: absolute; left: 0` (the span is
`position: relative`), `top: -.8rem` and `top: .8rem`. Centred in the round button with `text-align: center` and
`margin-top: 3.5rem` on the icon; `cursor: pointer` on the button.

**Hover:** `.navigation__button:hover .navigation__icon::before { top: -1rem }` / `::after { top: 1rem }` — the lines
spread; `transition: all .2s` (top/absolute instead of translate: "different tools do the same job").

**Open → an X:** `.navigation__checkbox:checked + .navigation__button .navigation__icon { background-color: transparent }`
(the middle line vanishes — its SIZE kept, because the other two are positioned from it), and its `::before` →
`top: 0; transform: rotate(135deg)`, `::after` → `top: 0; transform: rotate(-135deg)` (back to the middle and crossed;
135° = 180 − 45, three-quarters of the way round, which looks livelier than a plain 45° turn). `+` works here — the button
IS the checkbox's immediate sibling. Found by experimenting: "that is the reality".

**`transform-origin`** — the point a transform turns or scales AROUND; default the centre; `right` makes the right end the
pivot, `left` the left end. Not needed here, but the tool for "rotate exactly where I want".

**For the builder:** part of the Navigation component (the burger button's open/closed icon — with `aria-expanded` saying
which, and a text label for screen readers since the icon alone says nothing); a 2px line staying px is rule 16's hairline
exception. No layout gap. **This completes Natours' sections; the popup comes next.**

## Lecture — the popup, part 1: a fixed dark overlay, equal-height columns with `display: table`, text columns, hyphenation

**What it is:** clicking a card's "Book now" darkens the page and brings in a centred white box, ABOVE everything (even the
navigation button), staying put while the page scrolls. Markup at the very end of `<body>` (it belongs to no section):
`div.popup > div.popup__content > div.popup__left (two img.popup__img) + div.popup__right (h2.heading-secondary
"Start booking now", h3.heading-tertiary "Important – Please read these terms before booking" (`&ndash;`),
p.popup__text, a.btn.btn--green "Book now")`. (The course notes that a real site would not make people read terms first —
the page exists to show CSS, not to convert.)

**The overlay:** `.popup { height: 100vh; width: 100%; position: fixed; top: 0; left: 0; background: rgba($color-black, .8);
z-index: 9999 }`. **The box:** `width: 75%`, white, shadow `0 2rem 4rem rgba(black,.2)`, `border-radius: 3px`,
`overflow: hidden` (the photos inside respect the rounded corners), centred with a new **mixin** —
`@mixin absCenter { position:absolute; top:50%; left:50%; transform: translate(-50%,-50%) }`, `@include absCenter` (the
course had written those four lines five times).

**Two columns of EQUAL height, content centred vertically:** floats gave the left (photos) and right (text) parts
different heights. Instead fake a TABLE: `.popup__content { display: table }`, `.popup__left, .popup__right { display:
table-cell; vertical-align: middle }` with widths `33.333333%` / `66.6666667%` — the browser gives table cells one height,
and `vertical-align: middle` (also `top`, `bottom`) centres the right side's content in it. (No `<table>` markup — only its
display.) Images: `display: block; width: 100%`. Right side `padding: 3rem 5rem`.

**Text for print-like reading:** `.popup__text { font-size: 1.4rem; margin-bottom: 4rem; column-count: 2; column-gap: 4rem;
column-rule: 1px solid $color-grey-light-2; hyphens: auto }`.
- **CSS columns** flow ONE text into several columns, balancing their heights (the default gap is `1em` = the element's
  font size — 14px here); `column-rule` draws a line between columns (like a border, placed by the browser).
- **`hyphens: auto`** breaks long words at the right place with a hyphen as space runs out (selecting the word still
  selects both halves); it needs the page's LANGUAGE — `<html lang="en">` — to know the rules; `manual` only breaks where
  `&shy;` marks it. Together, columns and hyphenation bring magazine and newspaper layout to the web.
- Prefixes (`-moz-`, `-ms-`, `-webkit-`) were needed then — but write them with **Autoprefixer**, not by hand (a later
  lecture).

**For the builder:**
- **a modal / popup** (overlay + box, opened from a button, closed by Escape, focus held inside) → a COMPONENT GAP (Dialog —
  `docs/COMPONENT_GAPS.md`; the research's dialog rules: `<dialog>` with `showModal()`, `aria-labelledby`, focus returned);
- two parts side by side with equal height and centred content → `HAVE`, the modern way: a row stretches its columns to the
  tallest and *Content position* centres within each — `display: table` is not needed;
- **a text flowing in COLUMNS (`column-count`, gap, rule) → GAP (AC-19)** — the builder's columns are separate blocks; one
  long text cannot flow from one column into the next. Typography/layout-adjacent; useful for long reads, newsletters;
- **automatic hyphenation (`hyphens: auto`, with the page / block language) → GAP (AC-20)** — narrow columns on phones break
  long words badly today (c-8 in L-4 is about exactly that); RULE AF makes languages content (`lang` per page and per
  block), so hyphenation would follow each block's language. Typography area, close to L-4.

## Lecture — the popup, part 2: opening and closing with `:target`; the zoom-in

**Anchors and the target:** a link `href="#section-tours"` jumps to the element with `id="section-tours"` and puts
`#section-tours` in the URL — that element is now the **target**, and the CSS pseudo-class **`:target`** matches it.
(Ids are unique: one target at a time.)

**Hidden, then shown:** `display: none` cannot be ANIMATED (it has no in-between values), so the popup rests at
`opacity: 0; visibility: hidden` (opacity alone would leave it present and clickable), and `.popup:target { opacity: 1;
visibility: visible }` with `transition: all .3s`. The three "Book now" buttons on the cards get `href="#popup"`, the
popup `id="popup"`.

**Closing:** `a.popup__close[href="#section-tours"]` with `&times;` (an ×) — clicking it makes the TOURS SECTION the target,
so the popup stops being one and returns to hidden (and the page sits at the tours). Styles: `position: absolute; top:
2.5rem; right: 2.5rem` (against `.popup__content`, which is already positioned by the mixin), `font-size: 3rem`,
`line-height: 1` (text has its line height — the × box was far taller than the glyph), no underline, `inline-block`, grey;
hover → primary green.

**The zoom-in:** the box rests at `opacity: 0; transform: translate(-50%, -50%) scale(.25)` and
`.popup:target .popup__content` goes to `opacity: 1; transform: translate(-50%, -50%) scale(1)`, with
`transition: all .4s .2s` (the second time is the DELAY — the dark overlay comes first, the box follows). The translate must
be REPEATED with the scale: a second `transform` declaration replaces the mixin's one (the same lesson as the story shape).
"Now try it on a phone — it is a disaster" → the next section makes Natours responsive.

**For the builder:** the Dialog component again (component gap). The research, not the course, sets how it is built:
`:target` popups change the URL and the scroll position, leave focus behind the overlay and cannot trap it; the native
`<dialog>` with `showModal()` gives the backdrop (`::backdrop`), Escape to close, a focus trap and focus return for free —
the pure-CSS trick is a 2017 workaround to know, not to copy. "Animate visibility with opacity + visibility, never display"
is how the builder's effects already work. No layout gap. **The Natours page is complete; the course's next section is
responsive design — the part that bears most on the layout.**
