# Responsive design — Natours made responsive (section 5)

Advanced CSS and Sass, the section that makes the Natours page work on every screen. Distilled from the transcripts the
user shared on 2026-10-01. Of the whole course this is the section closest to the builder's LAYOUT engine.

## Lecture — mobile-first vs desktop-first; choosing breakpoints

**Desktop-first:** write the CSS for LARGE screens first, then **`max-width`** media queries shrink it for smaller ones
(the traditional way, easier to learn — Natours was built like this). **Mobile-first:** write the CSS for SMALL screens
first, then **`min-width`** queries grow it for larger ones — and with it a PHILOSOPHY: reduce the site to its essentials,
smaller and faster, content before decoration.

**How the two query types read** (on a 0 → ∞ width line with breakpoints at 600, 900, 1200):
- `max-width: 600px` = "the viewport is ≤ 600px" — applies from 0 up to 600; `max-width: 900px` from 0 up to 900 … A
  500px phone matches BOTH; queries add NO specificity, so when they set the same property the one LATER in the code wins
  — which is why media queries go at the END, ordered large → small in desktop-first;
- `min-width: 600px` = "the viewport is ≥ 600px" — applies from 600 to ∞; mobile-first queries keep AWAY from the small-
  screen base, ordered small → large.
- A media query only OVERRIDES the parts that change; everything else still applies from the base.

**Mobile-first — pros and cons:** for a world that is more and more mobile; constraints force content first. But the desktop
version can feel empty, designing big gives more creative freedom, clients expect to see a desktop prototype, and some
audiences mostly use computers. Whatever is chosen: **keep BOTH in mind from the start — never one as an afterthought.**

**Choosing breakpoints — bad, good, perfect:**
- **bad:** the widths of popular devices (usually Apple's) — optimises for one device, ignores the rest, not future-proof;
- **good:** group the most-used screen widths (StatCounter) and put breakpoints BETWEEN the groups — the course's choice:
  **phone 0–600 · tablet portrait 600–900 · tablet landscape 900–1200 · desktop 1200–1800 · big desktop 1800+** (the last
  optional, for something special on huge screens);
- **perfect:** ignore devices; start at one size, widen (or narrow) the window, and add a breakpoint wherever the DESIGN
  breaks — hard without some predefined points, which is why the course uses the good way.
Devices (iPhone, iPad, MacBook) are for TESTING, not for breakpoints.

**For the builder — `HAVE`, and it is the same ladder:**
- rule 18's five rungs are EXACTLY these breakpoints: phone · tablet portrait 600 · tablet landscape 900 · desktop 1200 ·
  big desktop 1800, written in `em` (37.5em, 56.25em, 75em, 112.5em — so they follow the reader's text size, which the
  course does in the next lecture);
- the MODEL is desktop-first like Natours — `base` IS desktop and the cascade runs to narrower screens, `wide` branches
  off — because a person builds a page on a desktop canvas; the EXPORT writes it mobile-first (`BP_ORDER`, phone first,
  `@media (min-width: …em)` ranges), so a phone downloads its own rules first. Both directions, as the course advises;
- "the perfect way" is what **container queries** give a builder: a block changes when ITS OWN box gets too narrow for it,
  wherever it sits — the design decides, not a device (rule 16). Plus the auto-fit grids that stack when the space runs out;
- testing on devices, not designing for them → the sweeps' device list (phones incl. Tecno / Infinix / itel at 360px,
  RULE AF; tablets both ways; laptops; the user's 1536×864; wide), every rung and both sides of every breakpoint.
No gap.

## Lecture — a media-query manager mixin (`@content`, `@if`); queries in `em`; scaling the whole page from the root

**One big media-query file vs queries inside each selector:** Sass lets a `@media` sit INSIDE a selector
(`.story { @media (max-width: 600px) { width: 50% } }` compiles to a normal query around that rule) — many small queries
are fine. But writing the numbers everywhere means changing them everywhere when a breakpoint moves.

**The media-query manager** — one mixin, breakpoints by NAME:
```scss
@mixin respond($breakpoint) {
  @if $breakpoint == phone      { @media (max-width: 37.5em)  { @content }; }  // 600px
  @if $breakpoint == tab-port   { @media (max-width: 56.25em) { @content }; }  // 900px
  @if $breakpoint == tab-land   { @media (max-width: 75em)    { @content }; }  // 1200px
  @if $breakpoint == big-desktop{ @media (min-width: 112.5em) { @content }; }  // 1800px
}
```
used as `@include respond(tab-port) { font-size: 50%; }`. **`@content`** passes a whole BLOCK of declarations into a mixin
(not just values); **`@if`** picks the query by the name passed in. The desktop styles (1200–1800px) are the base, outside
any query; three `max-width` queries go down, one `min-width` query goes up.

**Queries in `em`, not px, not rem:** a px query ignores the reader's browser text size; inside a media query `em` and `rem`
are NOT affected by the page's root `font-size` — 1em is always the BROWSER's size (16px by default, 20px if the reader
chose 20) — so `em` queries move with the reader's setting; `rem` misbehaves in some browsers, so `em`. 600/16 = 37.5em,
900/16 = 56.25em, 1200/16 = 75em, 1800/16 = 112.5em.

**The payoff of rem everywhere — scale the whole layout from ONE value:** `html { font-size: 62.5% }` (1rem = 10px) becomes
`@include respond(tab-land) { font-size: 56.25% }` (1rem = 9px), `@include respond(tab-port) { font-size: 50% }` (8px —
a phone matches this query too, so a separate phone rule is unnecessary) and `@include respond(big-desktop) { font-size:
75% }` (12px): every rem length shrinks or grows with it (a 4rem padding: 40 → 32px on a tablet). Not the whole job, but a
huge head start.

**ORDER matters:** a 500px window matches both `max-width: 900` and `max-width: 1200`; queries add no specificity, so the
LATER rule wins — in desktop-first, write the LARGER query FIRST and the smaller after (the course got it backwards first
and the tablet size did not apply). DevTools' device toolbar to test (not resizing the window).

**For the builder:**
- named breakpoints, one place to change them → `HAVE` (the rung names and `RUNG_CASCADE`; the export's `@media` ranges are
  generated, never typed);
- queries in `em` → `HAVE` (37.5em · 56.25em · 75em · 112.5em — the same four numbers);
- order → `HAVE` by construction: the export is mobile-first, `min-width` ranges written phone → wide, each overriding the
  one before;
- **scaling everything with the screen:** the builder does NOT shrink the root at a breakpoint (the reader's 16px stays the
  root, never touched) — instead the base spacing unit is FLUID: `--box-u` is a `clamp(…rem + …cqw…)`, so spacing grows and
  shrinks smoothly with the box rather than jumping at a breakpoint, and the type scale steps per rung. Same goal, smoother,
  and per box. No gap.

## Lecture — writing the media queries, part 1: base, typography, grid, header, navigation, footer

**Why the order again:** at 700px both `max-width: 1200` and `max-width: 900` match; the LATER rule wins, so the 900 query
(closer to 700) must come after the 1200 one — reversed, the tablet-landscape size would leak into portrait. Mobile-first is
the mirror: smallest first.

**The order of work:** base + typography → general layout (header, footer, navigation) + the grid → page layout →
components. The root font-size scaling already does most of the work; the rest are small adjustments. DevTools shows the
page's media queries as bars above the device toolbar (blue `max-width`, orange `min-width`) — click one to jump to it.
Adjust in the browser first, then test on real devices.

**Adjustments made:**
- **the page frame** (`body { padding: 3rem }`) removed at tab-port (≤ 900px) — small screens need every pixel;
- **headings:** the primary heading's huge letter-spacing cut on phones (3.5rem → 1rem, and the sub line → .5rem; size 6 →
  5rem) — on a 300px screen the spaced-out word would not fit; the secondary heading 3.5 → 3rem (tab-port) → 2.5rem (phone);
- **the grid at tab-port (≤ 900px):** every column `width: 100% !important` and `margin-right: 0` — columns become stacked
  rows, a single-column page (what mobile layouts usually are); each column then `margin-bottom: $gutter-vertical-small`
  (6rem), the rows' spacing too; the row's `max-width` drops from 114rem to **50rem** (a single column 114rem wide reads
  badly) and the row gets `padding: 0 3rem` so content never touches the screen edge;
- **the header's slope** at phone: the clip point 75vh → 85vh (the same polygon on a narrow screen became too steep);
- **the navigation button** moves closer to the corner (6 → 4rem at tab-port, 3rem at phone), its background circle with it;
- **the footer:** less padding (8rem); the navigation and the copyright each `width: 100%`, centred, the copyright
  `float: none`.

**For the builder:**
- removing the page frame on narrow screens → part of AC-2 (if a frame is built, it is per rung);
- headings tightened per screen → `HAVE` (the type scale steps per rung; letter-spacing is a per-rung setting);
- **columns stacking at the TABLET, not only the phone:** the builder stacks every column on a PHONE (#75) and puts at most
  THREE across on a tablet held upright (#78 — L-3's e-6 / c-11 are about that rule); the course stacks everything already
  at 900px. Two defensible choices — recorded, not a gap;
- a single column held to a READABLE WIDTH on a tablet (`max-width: 50rem`) → `PARTIAL` — the design foundation's
  "lines under ~75 characters" is measured by the page audit (T13) and the paragraph measure is capped; a whole stacked
  column centred at a max width is AC-9's content-width question;
- side gutters so words never touch the edge on small screens → `HAVE` (S-1, measured by W7a);
- a section's sloped edge changed per screen → `HAVE` (every style setting has per-rung overrides, `responsive`);
- the fixed button moved per screen → `HAVE` (pin offsets per rung). No new gap.

## Lecture — writing the media queries, part 2: section spacing, spacing utilities, the photo composition, feature boxes

(A sideways-scroll seen at the end of part 1 was a DevTools display bug — toggling the device toolbar off and on cleared it.
Measure before blaming the code.)

- **Section padding cut at tab-port** (≤ 900px), every section by the same amount: about 25 → 20rem, features 20 → 15 →
  10rem, tours 25 → 20, stories 15 → 10rem (the tours band keeps more because its slanted edge needs room to look natural).
  Space proportional to the screen; the dividing line between two slanted sections stays visually centred.
- **The spacing UTILITIES get their own media queries:** `.u-margin-bottom-big` 8 → 5rem, `-medium` 4 → 3rem at tab-port
  (with `!important`, as the utilities have) — one change tightens every place they are used.
- **The overlapping photo composition** becomes a ROW of three at tab-port: each photo `float: left; position: relative;
  width: 33.33333%`, a lighter shadow, `top/left: 0` undone; then some character back — the middle one the largest and
  ON TOP (`scale(1.3)`, `z-index: 100`), its neighbours `scale(1.2)` / `scale(1.1)`, nudged up or down by `top: ±1rem`. The
  hover effect is irrelevant on touch screens.
- **Feature boxes:** less padding at tab-port, the icon's bottom margin 0.
- "Not 100% polished — a real project is tested much harder, on real devices": the course fixes the MAJOR problems only.

**For the builder:**
- section space smaller on smaller screens → `HAVE` (the section space and gutters are FLUID tokens — they shrink with the
  box continuously instead of three hand-written steps), and per-rung overrides for anything chosen by hand;
- **overlapping floating photos that become a ROW on a narrow screen** → `PARTIAL` — floating blocks can be repositioned and
  resized per rung (per-rung overrides), and "stack / reflow floating blocks on a phone" exists (`floatStacksOnMobile`);
  the course's "become a row of three on a tablet, middle one forward" is reachable by hand, one rung at a time — a
  one-gesture "arrange as a row on small screens" is not offered. Layout area, minor: recorded as AC-21.

## Lecture — writing the media queries, part 3: tours, stories, booking — and "hover does not exist on touch"

**The flip card is REWRITTEN for touch** (≤ 900px): on a touch screen there is no hover, so the back (price + "Book now")
would only appear on a tap — unacceptable. One big `@include respond(tab-port)` at the END of `_card.scss` (copy the
rules, keep only what changes): no `perspective`; `height: auto` on the card and both sides (the fixed height existed only
to stack two absolute sides); sides `position: relative`; the back NOT rotated (`transform: rotateY(0)`), and no rotation
on hover — so the card becomes front, then back, one under the other, always visible. The back's CTA: `position: relative;
top: 0; left: 0; transform: none; width: 100%` (no more centring trick), less margin, `padding: 7rem 4rem 4rem 4rem` and a
slanted top edge `clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%)`; the rounded corners, white background and the
shadow move from the SIDES to the CARD (one object now); the details list's padding reduced; the price a little smaller.

**Stories:** at tab-port the card `width: 100%` and less padding (4rem / 7rem); at **phone** the skew is undone —
`transform: skewX(0)` on the card AND repeated in the shape's combined transform (`translateX(-3rem) skewX(0)` — a second
transform would replace the first). The parallelogram is a desktop flourish; a phone gets a plain card.

**Booking:** at tab-land the white panel's hard stop moves 50% → 65% and `.book__form` widens to 65%; the photo switches from
`background-size: 100%` (fits the WIDTH only) to **`cover`** (fills the box at any shape — `100%` and `cover` are NOT the
same); a leftover test `height` removed. At tab-port the gradient becomes solid white (`to right, white 0%, white 100%`) and
the form is 100% wide — the photo disappears behind it. The radio groups stack (`width: 100%`, a bottom margin); the inputs
100% wide.

**Testing:** fix the major problems in DevTools, then test on REAL devices; Sizzy shows a page on many devices at once. (The
course leaves making the POPUP responsive as an exercise.)

**For the builder:**
- **hover-only content is a defect on touch screens** → the builder's rule already: an effect may decorate on hover, never
  HIDE content that only hover reveals (keyboard and touch must reach everything — WCAG 2.1.1 / 1.4.13); AC-12/13's group
  hover and flip card must offer a tap/focus path, and the flip card's narrow-screen form is "both faces visible, stacked";
- a decorative skew or slant undone on a phone → `HAVE` (per-rung overrides of edges; a skewed card is AC-1's family);
- a hard-stop panel that widens and turns solid on smaller screens → part of the slanted-panel item (Booking part 1);
- `cover` vs `100%` → `HAVE` (`bgSize: cover` is the builder's default for photos);
- stacking a form's options on small screens → Form component. No new gap.

## Lecture — responsive images: why, and the three cases

**Flexible images** (they scale with the window — done) are not **responsive images**. Responsive images serve the RIGHT
FILE to each screen and device, so nobody downloads a picture far bigger than they need — a performance and a fairness
question: a 1MB hero is fine on a desktop and wrong on a phone with a slow or expensive data plan ("as developers we have a
responsibility here"); send the big file to the big screen and a small one to the small screen. Few developers take it
seriously.

**Three cases, three solutions:**
1. **Resolution switching** — the SAME picture, a smaller file for a smaller screen;
2. **Density switching** — a special case: what matters is not the screen's size but its PIXEL DENSITY. A low-resolution
   ("1x") screen uses one device pixel per CSS pixel; a high-resolution ("2x", retina, every modern phone) screen uses two —
   a picture shown 100px tall needs 200 real pixels to look sharp, so a 2x screen gets a file with double the resolution;
3. **Art direction** — a DIFFERENT picture for a different screen: a crop that keeps the important detail (the subject
   stays the same size, the surroundings are cut), or another image altogether.
Resolution and density switching = the same image at different sizes; art direction = a different image. They use
different HTML / CSS (next lectures).

**For the builder:** the builder's research already covers this in depth — `docs/web-anatomy/media-performance.md` §1.2
(`srcset` with `w` descriptors + `sizes`, `x` descriptors for density, `<picture>` for formats and art direction, AVIF /
WebP), and RULE AF makes it a requirement: "images resized to their shown width, `width`/`height` set, lazy below the fold",
a first view ≤ 500 KB on a 360px phone on Slow 3G — measured in BATCH L-6. Today a photo is downscaled ONCE on upload
(`importPhoto`) and published as a single file: **no `srcset`, no density variants, no art-directed crops → GAP (AC-22)**,
the heaviest-weight item for RULE AF; it belongs with L-6's page-weight audit (it is what that audit will measure).

## Lecture — responsive images in HTML, part 1: density switching (`srcset` + `x`) and art direction (`<picture>`)

**Density switching on the footer logo:** two files of the same logo — `logo-green-1x.png` (150px wide, the size it is
SHOWN: 15rem) and `logo-green-2x.png` (300px, double, for 2x screens). `<img srcset="img/logo-green-1x.png 1x,
img/logo-green-2x.png 2x" alt="Full logo">` — `srcset` instead of `src`, each file with a **density descriptor** (`1x`,
`2x`); the BROWSER picks the one that suits the screen. DevTools shows the "current source" on hover; seeing the 1x choice
needs a low-density screen — the rest is trusting the markup is right.

**Art direction with `<picture>`:** a smaller, simpler logo on phones —
```html
<picture class="footer__logo">
  <source srcset="img/logo-green-small-1x.png 1x, img/logo-green-small-2x.png 2x" media="(max-width: 37.5em)">
  <img srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x" alt="Full logo" class="footer__logo">
</picture>
```
- `<picture>` holds zero or more `<source>` then exactly ONE `<img>` (the fallback, and the element that is actually shown
  and styled — `alt` lives on it);
- a `<source>`'s **`media`** attribute takes a MEDIA QUERY (the same 37.5em as the CSS): when it matches, that source's
  `srcset` is used — this time the browser is TOLD, not given a choice (art direction);
- each `srcset` inside does density switching as well — both techniques combined. More `<source>`s could add more breakpoints.
Next: resolution switching (`w` descriptors + `sizes`) on the About section's three photos.

**For the builder:** AC-22 (responsive images) — these are the exact elements the export should write: `srcset` with
densities for logos and icons-as-images, `<picture>` + `<source media>` for an art-directed crop per rung (the builder
already has per-rung image overrides as data; publishing them as `<source media>` instead of CSS `display` swaps is the
efficient form — a hidden `<img>` is still downloaded). Alt text stays on the `<img>`.

## Lecture — responsive images in HTML, part 2: resolution switching (`srcset` + `w` + `sizes`)

**Testing densities:** DevTools' device toolbar → "add device pixel ratio" simulates 1x / 2x / 3x screens; the image's
`currentSrc` (Properties panel) shows the file chosen. Chrome is unreliable here (cached choices stick) — reload, toggle,
and trust correct markup.

**Resolution switching — the browser CHOOSES** (vs art direction, where it is told):
```html
<img srcset="img/nat-1.jpg 300w, img/nat-1-large.jpg 1000w"
     sizes="(max-width: 56.25em) 20vw, (max-width: 37.5em) 30vw, 300px"
     alt="Photo 1" class="composition__photo composition__photo--p1"
     src="img/nat-1-large.jpg">
```
- **`w` width descriptors** tell the browser each file's real width (300px, 1000px) WITHOUT downloading it;
- **`sizes`** tells it how wide the image will be SHOWN: a list of conditions (media queries) with a width, in order, plus a
  DEFAULT last (`300px` — measured in DevTools: the photo is ~300px on the desktop, ~171px ≈ 20vw at 900px, ~30vw at 600px).
  More conditions = a better choice. (The course's order puts 900 before 600 — the browser takes the FIRST that matches,
  so for a 500px screen the 900 rule wins; listing the narrower condition first is the correct form.)
- knowing its own viewport width and pixel density, the browser computes the pixels it needs and picks the smallest file
  that is enough — **resolution AND density switching in one**;
- **`src`** stays as a fallback for browsers that do not understand `srcset` (also added to the footer logo).
The challenge: make every image on the page responsive — "your users will appreciate the extra mile, especially on a phone
with a slow data connection. Don't leave responsive images as an afterthought."

**For the builder:** AC-22 again, and this is the form it should take for EVERY photo block: the upload already knows the
original's size (`imgW`/`imgH`), so it can produce a ladder of widths (e.g. 360 · 640 · 960 · 1280 · 1920) in AVIF/WebP +
a JPEG fallback, and the export can write `sizes` FROM THE LAYOUT, which it knows exactly — a block's share of its line at
each rung (the same numbers the engine already computes for `flex-basis`) — so `sizes` is accurate rather than measured by
hand. That makes it a layout-engine job as much as a media one. `width`/`height` attributes and `loading="lazy"` below the
fold come with it (RULE AF).

## Lecture — responsive images in CSS: resolution media queries, combined conditions

**Background images are chosen with MEDIA QUERIES** — and a query can test more than the width: **`min-resolution:
192dpi`** (the Apple retina density, the usual 2x reference) matches high-density screens. The hero (`.header`) loads
`hero-small.jpg` (1200px wide — enough at 1x, especially under an 80% gradient) by DEFAULT, and the 2000px `hero.jpg` only
when it pays:
```scss
@media (min-resolution: 192dpi) and (min-width: 37.5em),   // a 2x screen wider than 600px…
       (min-width: 125em) {                               // …or any screen wider than 2000px
  background-image: linear-gradient(…), url(../img/hero.jpg);
}
```
- **`and`** combines conditions (BOTH must match): a phone ≤ 600px is 2x but needs only 600 × 2 = 1200 real pixels — the
  small file is already enough, so the big one is not sent;
- **`,`** means OR: a wide 1x screen (≥ 2000px) needs the big file too — one rule instead of two copies;
- `min-` queries read like `min-width`: "at least"; written in `em` (37.5em, 125em) like every query. (A temporary test
  colour on the gradient made the switch VISIBLE while testing — a trick worth keeping.)
The `sizes` conditions in the HTML were converted to `em` as well (37.5em, 56.25em). The challenge: do the same for every
background image.

**For the builder:** AC-22 covers background images as well — a section photo is a CSS background, so its ladder of sizes
belongs in the export's per-rung `@media` ranges (`image-set()` with `1x`/`2x` or width-based files, chosen by the rung's
width and `min-resolution`) — the engine already writes a rule per rung for every block, so the right file per rung is a
natural extension. A gradient/overlay over a photo lowers the resolution needed (the course's own observation) — worth
using when choosing the ladder.

## Lecture — browser support: graceful degradation with feature queries (`@supports`); `backdrop-filter`

**Many of the course's properties were experimental** and worked only in the newest browsers. Check **caniuse.com** before
using a property in production. If an older browser lacks it, use **graceful degradation**: the full experience where it is
supported, a simpler adapted version where it is not.

**Feature queries:** `@supports (property: value) or (-webkit-property: value) { … }` — the block applies only where the
browser understands that declaration (a VALUE is required; any valid one, e.g. `clip-path: polygon(0 0)`). `and`, `or`,
`not` combine tests like media queries. Write the simple version OUTSIDE, the enhanced one INSIDE.

**Applied:**
- **`backdrop-filter: blur(10px)`** (blurs what is BEHIND an element — then Safari only, `-webkit-` too): the popup overlay
  becomes `rgba(black, .3)` + blur inside `@supports (backdrop-filter …) or (-webkit-backdrop-filter …)`, the dark
  `rgba(black, .8)` everywhere else. (Other backdrop filters: `brightness`, `invert`, `sepia`… — `filter` acts on the element,
  `backdrop-filter` on what is behind it.)
- **Safari needed `-webkit-backface-visibility`** (caniuse shows prefix needs per version) and did not understand
  `min-resolution` — so the hero query gained `(-webkit-min-device-pixel-ratio: 2) and (min-width: 37.5em)` as a THIRD
  alternative. Most iPhone and iPad users are on Safari.
- **An old Firefox without `clip-path`:** the header is `85vh` by default and `95vh` only inside `@supports (clip-path …)`
  (without the slant, a shorter hero shows the page continues); the story's round photo uses `border-radius: 50%` +
  `overflow: hidden` by default, and `clip-path: circle()` + `shape-outside` + `border-radius: none` only inside the feature
  query. The challenge: the same for every new property (e.g. gradient text → plain green text where `background-clip:
  text` is missing).

**For the builder:**
- **feature queries → `HAVE`, used where the engine relies on something new:** `@supports (overflow-x: clip)` keeps the page
  from scrolling sideways without breaking sticky, falling back to `hidden` below Safari 16 (`box-export.ts` ~849–866);
  `@supports (animation-timeline: scroll())` wraps scroll-driven effects (`box-model.ts` ~6362); the glass design uses
  `-webkit-backdrop-filter` beside `backdrop-filter`;
- **graceful degradation is RULE AF's case, not an afterthought:** the low-cost Android phones RULE AF targets (Tecno,
  Infinix, itel) often run an OLD WebView or a data-saving browser (Opera Mini's extreme mode, UC Browser, Phoenix) where
  container queries, `clamp()`, `color-mix()`, `oklch()`, `:has()` or `@property` may be missing. The engine leans on
  several of these. **AC-23: a baseline / fallback audit** — which features the export depends on, the oldest browsers the
  target users run (measured, not guessed), and a degraded-but-readable page for them (`@supports` fallbacks: a stacked
  single column, system colours, no fluid terms). Belongs with L-6 (Africa-first measurements).

## Lecture — a build process with npm scripts: compile → concatenate → prefix → compress

**A build process** = the tasks run automatically when a product (or a feature) is finished, producing the final files
ready to deploy. Natours' four steps, each an npm script in `package.json`:
1. `"compile:sass": "node-sass sass/main.scss css/style.comp.css"` (the old watching script renamed `watch:sass`);
2. `"concat:css": "concat -o css/style.concat.css css/icon-font.css css/style.comp.css"` — **concatenation**: two CSS files
   become one = one HTTP request instead of two (package `concat`; npmjs.com shows each package's usage);
3. `"prefix:css": "postcss --use autoprefixer -b 'last 10 versions' css/style.concat.css -o css/style.prefix.css"` —
   **Autoprefixer** (via `postcss-cli`) adds the `-webkit-`, `-moz-`… prefixes the target browsers need, from caniuse data,
   so nobody writes prefixes by hand;
4. `"compress:css": "node-sass css/style.prefix.css css/style.css --output-style compressed"` — whitespace and comments
   removed: **109 KB → 33 KB** (~70% less).
`"build:css": "npm-run-all compile:sass concat:css prefix:css compress:css"` runs them in SEQUENCE; the development workflow
`"start": "npm-run-all --parallel devserver watch:sass"` runs the watcher and live-server TOGETHER from one command
(`npm-run-all` works on Mac, Windows and Linux). The final file keeps the name `style.css`, so the HTML does not change
between development and production. Reusable on every project: copy the scripts and the dev dependencies.

**For the builder:** the export IS a build step — it generates ONE shared stylesheet per site plus each page's rules (already
"concatenated"), and the build of the app itself (`next build`) runs PostCSS/Autoprefixer on the APP's CSS. But the CSS the
export GENERATES as strings is neither autoprefixed nor minified — prefixes are written by hand where known (e.g.
`-webkit-backdrop-filter`), and the output keeps its spacing. Both belong to AC-23 and L-6: (1) run the generated sheet
through Autoprefixer against a browser list that includes the low-cost Android WebViews RULE AF targets; (2) minify it and
serve it compressed — measured against the ≤ 100 KB code budget per page.

## Lecture — finishing Natours: `::selection`, `only screen`, the viewport meta, `(hover: none)`, what CSS alone cannot do

- **`::selection { background-color: $color-primary; color: $color-white }`** — selected text in the brand's colours, a
  small personal touch.
- **`@media only screen and (max-width: …)`** — best practice: the queries apply to SCREENS only (not, e.g., when printing).
  Added to every query (the mixin and the header's hand-written one).
- **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`** — without it, responsive design does NOT
  work: a phone renders the page at the width of its widest element (or ~980px) and zooms out; with it the page is laid out
  at the device's width.
- **Touch is not a screen width — `(hover: none)`:** the flip card's "always show the back" layout was keyed to ≤ 900px, but
  an iPad Pro or a landscape tablet is wide AND cannot hover → the back (price, Book now) stayed hidden. The query becomes
  `@media only screen and (max-width: 56.25em), only screen and (hover: none)` — written out by hand, since the mixin takes
  one condition. `(hover: hover)` is the opposite. DevTools' device type (desktop / mobile / touch) tests it.
- **Limits of CSS alone:** the navigation's links do not scroll to their section or close the menu, and the popup does not
  close on a click outside it — real behaviour needs JavaScript; the pure-CSS versions only show how far CSS reaches.
- **Real-world habits:** COMMENT the code generously (for yourself later and for the next developer); use far more
  variables (all margins, z-indexes, font sizes) than the course did; run the build (`npm run build:css`) before deploying.
Next: project 2, Trillo — Flexbox.

**For the builder:**
- `::selection` → `HAVE` (`.eu-root ::selection` in the theme's primary tint, `lib/educo-ui/base.ts` ~109);
- the viewport meta → `HAVE` (every exported page, `box-export.ts` ~903);
- print → `HAVE` (a `@media print` block in the base layer, ~133); the export's rung queries are not marked `screen` —
  harmless while the print block resets what matters, to confirm when the print styles are next touched;
- **interaction keyed to INPUT, not width → GAP (AC-24):** the builder's hover effects carry no `(hover: hover)` guard, so on
  a touch screen a tap can leave a block stuck in its hover look ("sticky hover"), and anything a hover reveals must be
  reachable without one (the flip card, the group hover, AC-12/13). Wrap hover effects in `@media (hover: hover) and
  (pointer: fine)`; key any "show what hover would show" layout to `(hover: none)`, never to a width. Motion/interaction
  area, but it decides what a tablet shows;
- "comment the code, use variables everywhere" → the project's practice (tokens for every value, the engine's long
  comments recording WHY). No layout gap.
