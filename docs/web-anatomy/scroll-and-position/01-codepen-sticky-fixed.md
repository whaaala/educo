# Sticky, fixed and the scroll effects around them — distilled from 47 CodePen pens

Source: `raw/codepen-sticky-fixed.json` — 47 pens from the CodePen tags **sticky-header** (17) and
**fixed-position** (30), each read in full (code capped at 6,000 characters by the crawl). One entry per
**technique**, not per pen; duplicates are grouped. Captured 2026-10-01 (RULE R: stored once, extended later).

**How to read an entry.** *How it works* gives the essential CSS/JS. *Pitfalls* lists what the pens get wrong or
warn about. *Builder* says HAVE / PARTIAL / GAP, checked against the code (function names given), not guessed.
*Kind* says whether it is LAYOUT (an engine capability any block could use), COMPONENT (belongs to one component —
Navigation, Table, Docs sidebar, Modal) or MOTION.

**What the builder has today (checked 2026-10-01 in `lib/box-model.ts`, `lib/box-export.ts`, `lib/interactions.ts`):**

| Field / function | What it does |
|---|---|
| `pin?: "top"\|"bottom"\|"left"\|"right"` (+ corners via `PIN_EDGES`), `pinOffset` | The edge a block holds against. |
| `hold?: "sticky"\|"fixed"` | `sticky` (default) stays in the flow and lets go with its parent; `fixed` is held to the window, reserves no space. |
| `pinCSS()` | The one resolver. Clause 1 free position wins · 5 a fixed bar is given its width · 5b a fixed left/right rail is given full height (`top`+`bottom`) · 3 a sticky child of a row/grid gets `align-self:flex-start` so it has travel · 3b a sticky container in a row gets `min-height: calc(100dvh - offset)` (header/nav/footer excluded) · 6 vertical inset is `calc(var(--eu-pin-above,0rem) + offset)`. |
| `pinStackPass()` / `pinStackScript()` / `pinStackNeeded()` | Measures rendered bar heights and writes `--eu-pin-above` so several bars at one edge queue instead of overlapping; grouped per holder (`data-eu-pin-in`), fixed bars share the `"window"` group, a page-held sticky header also pushes a sticky sidebar below it. Shipped only when needed; re-runs on resize, load and `document.fonts.ready`. |
| `pinPaddingNeeded()` + the 2d branch of `pinStackPass` | Sets `scroll-padding-top` on the document = height of the **fixed** top stack, only when the page has a scroll target. **Sticky bars are deliberately excluded.** |
| `pinScope()` / `pinScopeWords()` → `PinScopeWords = "page"\|"row"\|{around}` | Tells the Inspector where a sticky block lets go. |
| `pinBlockedBy()` | Warns when a clipped/rounded ancestor (export writes `overflow:hidden` for `clip` or any radius, `box-export.ts:393`) makes a scroll container that kills sticky. |
| `capturesFixed()` / `fixedBlockedBy()` / `fixedContainerOf()` | Warns when an ancestor would capture a fixed block: only `rotate` (tilt) and the `glass` variant (`backdrop-filter`) are counted; `container-type` measured NOT to capture (#144). |
| `canvasFixedStyle` (around `box-model.ts:6157`) | The canvas cannot use real `fixed` (its frame is a size container), so it draws held blocks as `absolute`; the export keeps `fixed`. |
| `pagePinCover()` | A bar pinned to the page gets z-index one above the sticky tier and the page colour if it has none, so text cannot show through it. |
| `pinArrival?: "shadow"\|"solid"\|"glass"\|"rule"\|"condense"`, `pinArrivalAfter` (default 12 units ≈ 120px) | `pinArrivalCss()` + `pinArrivalKeyframes()`: a **scroll-driven CSS animation** — `animation-timeline: scroll()`, `animation-range: 0 <after>`, `animation-duration:auto`, inside `@supports (animation-timeline: scroll())`, off under `prefers-reduced-motion`. Zero JS. Merged with an entrance effect into one `animation-name` list. Timed from the **top of the scroller**, not from the moment the bar sticks. |
| `float?: {x,y,z}`, `position?: "flow"\|"absolute"`, `floatHoldCSS()` + `pinX/pinY` | A free-floating layer; with `pin` + `hold:"fixed"` it is held on screen at a measured rem position. |
| `bgAttach?: "fixed"` | `background-attachment: fixed` on a block (no touch/iOS fallback found). |
| `revealScroll` (`lib/interactions.ts`) | Entrance on `animation-timeline: view()`, range `entry 0% cover 28%`. |
| Not found anywhere in `lib/` | hide-on-scroll / scroll direction, `scroll-state()` queries, `scroll-margin-top` on targets, `overflow: clip`, `env(safe-area-inset-*)` / `viewport-fit=cover`, `overscroll-behavior`, a scrollable box (`max-height` + `overflow:auto`), a Table component, a Navigation component (placeholders only). |

---

## The techniques (22)

### 1. Sticky header, pure CSS
**Pens:** CSS: Sticky Header and Sidebar (https://codepen.io/iamsaief/pen/eYZRZPB) · header_02 (https://codepen.io/jtec_web/pen/emYJxRv) · Sticky Bits with Sticky Position support (https://codepen.io/yowainwright/pen/XKyLwz)

**How it works:** the bar stays in the flow and holds at the top once it reaches it. No JS.
```css
header.navigation { position: -webkit-sticky; position: sticky; top: 0; z-index: 999; }
```
header_02 makes a *round menu button* sticky by giving the sticky header a small width and pushing it right:
`position: sticky; top: 0; left: calc(100vw - 7rem); width: 85px`.

**Pitfalls:** needs a `top` (without one, sticky does nothing) · any ancestor with `overflow: hidden/auto/scroll`
becomes the scroll container and the bar stops sticking · the bar only holds while its **parent** is on screen, so a
header wrapped in a short `<div>` scrolls away with it · needs an opaque background and a z-index or content shows
through · `100vw` includes the desktop scrollbar, so `calc(100vw - 7rem)` pushes things sideways · the `-webkit-sticky`
prefix is dead (Safari 13+, 2019) · a sticky header covers anchor targets and focused links (see 18).
**Modern fact:** `overflow: clip` clips **without** making a scroll container, so sticky inside a clipped/rounded box
keeps working.

**Builder: HAVE** — `pin:"top"` + `hold:"sticky"` via `pinCSS`; `pinScope` says where it lets go; `pinBlockedBy`
warns when a clipped or rounded ancestor kills it. **But** the export writes `overflow:hidden` for `clip` or any radius
(`box-export.ts:393`), so rounding a section switches off a sticky child — `overflow: clip` would remove the conflict
instead of warning about it (SP-4). **Kind:** LAYOUT.

### 2. Fixed header and the space it needs
**Pens:** Modern Responsive Navigation Menu (https://codepen.io/priyamakes/pen/azdGRPL) · Modern Responsive Header with Scroll Effect (https://codepen.io/Kuldeep-Rajput-the-sasster/pen/RNWVbQo) · Sticky Header Layout (https://codepen.io/christianWiersgowski/pen/eYaYGjE) · Header (https://codepen.io/Behzad_ne_77/pen/wvzEGJr) · Css Layouting Position (https://codepen.io/dediindrawan/pen/jOzrVMw) · position: fixed; (https://codepen.io/seyedi/pen/mPxZYP) · Pumpkin Date Scones Recipe (https://codepen.io/emaresko/pen/kVxjLQ — a fixed image header) · Using JQuery to reserve space for fixed elements (https://codepen.io/KristinB/pen/azbGJq) · natural-sticky `reserveSpace` (https://codepen.io/kadykov/pen/YPyMyJJ)

**How it works:** `position: fixed; top: 0; left: 0; right: 0` (or `width: 100%`). It leaves the flow, so the page
starts underneath it; every pen then pays the space back by hand: `body/#body { padding-top: 50px }`,
`img { margin-top: 80px }`, `main { margin: 100px auto }`, `padding: 160px 0 0`. The jQuery pen clones each fixed
element and inserts the clone after it as an invisible placeholder (`position: static; visibility: hidden`) so the
flow keeps its height automatically; natural-sticky does the same with `reserveSpace: true`.

**Pitfalls:** the hand-typed padding is a guess — wrong when the bar's text wraps at 360px, when the font loads late,
or at 200% zoom, so the first heading hides under the bar · a cloned placeholder duplicates links and ids (screen
readers and `getElementById` see two) · `width:100%` plus `left/right` offsets overflows (see 21) · a fixed bar on a
360×640 phone permanently costs 10–15% of the screen.
**Modern fact:** in nearly every case a **sticky** header is the right answer: it reserves its own space, needs no
padding and no script. Fixed is for things that must never leave (a cookie bar, a chat button).

**Builder: PARTIAL** — `hold:"fixed"` exists (width/height given by `pinCSS` clauses 5/5b) and `scroll-padding-top`
covers *link landings*; flow space is not reserved for a fixed bar, by design (the Inspector's default is sticky,
which reserves it). Nothing measures and reserves space for a fixed top bar placed over the first section. **Kind:** LAYOUT.

### 3. A look that changes once the page has scrolled (shadow · solid · glass · shrink)
**Pens:** Modern Responsive Navigation Menu (shadow, https://codepen.io/priyamakes/pen/azdGRPL) · Modern Responsive Header with Scroll Effect (glass, https://codepen.io/Kuldeep-Rajput-the-sasster/pen/RNWVbQo) · Sticky Header Layout (shrink, https://codepen.io/christianWiersgowski/pen/eYaYGjE) · Sticky Header – Shrink & Opacity Effect (https://codepen.io/byKrissK/pen/rNoYaNP) · Natural Sticky Style On Scroll (https://codepen.io/kadykov/pen/XJXbYVX) · Smooth Sticky Header w/IntersectionObserver (https://codepen.io/mandynicole/pen/oNqbadb) · Feathered Background on Fixed Position Transparent div (https://codepen.io/romancandlethoughts/pen/jOrqxK)

**How it works (2015–2022 style):** a `scroll` listener toggles a class past a threshold, and CSS transitions do the rest:
```js
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 50));
```
```css
.header.scrolled { background: rgba(255,255,255,.8); backdrop-filter: blur(10px); box-shadow: …; }
header.sticky { background-color: rgba(0,0,0,.9); padding: 0; }   /* shrink + fade */
.header.small { padding: 10px 0; font-size: 80%; }
```
The feathered pen fakes a soft edge on a fixed translucent panel with a huge same-colour shadow:
`background: rgba(255,255,255,.8); box-shadow: 0 0 60px 45px rgba(255,255,255,.8)`.

**Pitfalls:** an unthrottled `scroll` listener runs on every frame — measurable jank on a low-cost Android · shrinking
`padding`/`font-size`/`height` reflows the page on every frame and, on a **sticky** (in-flow) bar, moves the content
under the reader; the IntersectionObserver pen documents the "flash of page background" above a header whose height
transition finishes before it reaches the top, fixed by animating a wrapper's `padding-top` instead of the children's
height — and its author has since **disabled the demo as janky in all browsers** · a transparent bar over a busy photo
fails contrast until it turns solid · `backdrop-filter` is expensive on cheap GPUs and makes the bar a containing
block for fixed children (see 19) · no pen honours `prefers-reduced-motion`.
**Modern fact:** this is pure CSS now — a scroll-driven animation (`animation-timeline: scroll()` with an
`animation-range`) needs no listener and runs off the main thread where supported.

**Builder: HAVE** — `pinArrival` (`shadow`/`solid`/`glass`/`rule`/`condense`) with `pinArrivalAfter`, emitted by
`pinArrivalCss` as a scroll-timeline animation inside `@supports`, off under reduced motion, keyframes once per page
(`pinArrivalKeyframes`); `condense` refuses to promise anything when the bar has no padding/min-height
(`pinArrivalHasEffect`) and floors at 48px. Unsupported browsers keep the resting look. The timing caveat is
technique 4. **Kind:** MOTION.

### 4. Knowing the moment a bar becomes "stuck"
**Pens:** Smooth Sticky Header w/IntersectionObserver (https://codepen.io/mandynicole/pen/oNqbadb) · Natural Sticky Header Events (https://codepen.io/kadykov/pen/RNrPyXV) · Natural Sticky Header Floating Events (https://codepen.io/kadykov/pen/ByjNVWP) · Stickybits Demo (https://codepen.io/yowainwright/pen/QdedaO) · fixed scroll navigation (https://codepen.io/tailofmoon/pen/VzXmpX)

**How it works:** CSS sticky has no "I am stuck" event, so:
- **Sentinel + IntersectionObserver** — an empty `<div class="sticky-target">` just above the bar; when it leaves the
  viewport, add `.stuck`: `new IntersectionObserver(es => es.forEach(e => wrap.classList.toggle('stuck', !e.isIntersecting))).observe(target)`.
  No scroll listener, cheap.
- **Library events** — natural-sticky fires a `natural-sticky` event with `detail.state` = `home | sticky | relative`;
  Stickybits adds `js-is-sticky` / `js-is-stuck` classes from a scroll listener.
- **Offset comparison** — `if (scrollTop >= nav.offsetTop) nav.classList.add('active')` (the Korean pen).

**Pitfalls:** offset comparisons go stale on resize, font load and images above the bar · a library for a class toggle
is weight on 3G.
**Modern fact:** `container-type: scroll-state` + `@container scroll-state(stuck: top) { … }` answers it in pure CSS
(Chromium only so far).

**Builder: PARTIAL** — `pinArrival` deliberately uses the page's `scroll()` timeline from 0 to `pinArrivalAfter`, not
`scroll-state(stuck:)` (comment on `pinArrivalCss`: Chromium-only, needs a wrapper). Correct for a bar at the top of the
page; **wrong for a bar that starts lower** (a nav under a hero, technique 8): its arrival is finished long before it
sticks (SP-3). **Kind:** MOTION.

### 5. Smart header — hide on scroll down, show on scroll up
**Pens:** Smart Fixed Header (https://codepen.io/gabalicious/pen/poyGpx) · Smart Fixed Header / HeadsUp (https://codepen.io/hkfoster/pen/nbMJwp) · Natural Sticky Header (https://codepen.io/kadykov/pen/emprNoY) · Natural Sticky Top Floating Button (https://codepen.io/kadykov/pen/YPyMyJJ)

**How it works:** a scroll listener compares `pageYOffset` with the previous value.
```js
// HeadsUp: throttled to 100ms; only after 300px; show again only when scrolling up faster than 20px, or at the bottom
if (pastDelay && goingDown) add('heads-up');
else if ((!goingDown && fastEnough && !rockBottom) || !pastDelay) remove('heads-up');
```
```css
.main-header { position: fixed; transform: translate3d(0,0,0); transition: .25s transform; }
.heads-up    { transform: translate3d(0,-6rem,0); }
```
The older pen animates `top` (`.slide-up { top: -6rem }`), which reflows. natural-sticky does the "browser URL bar"
variant: scrolling down, the header simply scrolls away with the page (state `relative`); scrolling up, it is pulled
back in **by the finger**, pixel for pixel (state `sticky`), and it can do the same for a floating button
(`reserveSpace: false`).

**Pitfalls:** must use `transform`, not `top` · needs a dead zone (sensitivity) or it flickers on small finger jitter ·
iOS rubber-banding gives negative scroll values (HeadsUp checks `newScrollY < 0`) · must reappear at the bottom of the
page and when anything inside it gets **keyboard focus** (`:focus-within`), or a Tab lands on an invisible link · a
`will-change`/`transform` on the header captures any fixed child (19) · reduced motion: snap, don't slide · a
listener on a cheap phone must be `passive` and rAF-throttled.
**Why it matters here:** on a 360×640 phone a permanent 56–64px bar is ~10% of the screen; hiding it while reading is
the single biggest win for small screens.

**Builder: GAP** — no hide-on-scroll, no scroll direction anywhere in `lib/` (SP-2). **Kind:** MOTION (on top of LAYOUT pin).

### 6. Several sticky bars stacked
**Pens:** CSS: Sticky Header and Sidebar (https://codepen.io/iamsaief/pen/eYZRZPB) · Smooth Sticky Header w/IntersectionObserver (https://codepen.io/mandynicole/pen/oNqbadb) · Sticky Bits (https://codepen.io/yowainwright/pen/XKyLwz)

**How it works:** two ways. (a) Put the bars **in one sticky wrapper** (`.sticky-wrapper > header + nav.breadcrumbs`)
so they move as one. (b) Let only the second bar stick (the "Black Lives Matter" strip scrolls away, the nav below it
sticks), or give the second bar `top:` = the first bar's height.

**Pitfalls:** a hard-coded `top: 60px` breaks the moment the first bar wraps to two lines · two sticky bars with the
same `top` simply cover each other · bars in different sections never meet and must not be offset.

**Builder: HAVE** — `pinStackPass` measures real heights and sets `--eu-pin-above` per group (`pinStackGroup`), page-held
bars push nested sticky ones (`outer()`), shipped only when `pinStackNeeded`, re-run on resize/load/fonts. **Kind:** LAYOUT.

### 7. Sticky sidebar / table of contents beside the content
**Pens:** CSS: Sticky Header and Sidebar (https://codepen.io/iamsaief/pen/eYZRZPB) · Sticky Header Layout (https://codepen.io/christianWiersgowski/pen/eYaYGjE) · Always-visible sidebar (https://codepen.io/tomhazledine/pen/LZvYJb) · Grid – Fix position until target is reached (https://codepen.io/antoniolee/pen/WNvJxdO)

**How it works (modern):** the list *inside* the grid column is sticky, under the header:
```css
main { display: grid; grid-template-columns: 1.3fr 4fr 1fr; }
aside > ol { position: sticky; top: 80px; }          /* 80px = the header */
.menu { position: sticky; top: 140px; height: 100vh; overflow-y: auto; }  /* a long menu scrolls itself */
```
**How it was done (2015 JS):** "Always-visible sidebar" switches the sidebar between normal, `.fixed` (with its
measured `left` and `width` written back) and `.fixedBottom` (absolute at container height − sidebar height) on every
scroll; "Fix position until target" pulls a fixed intro up with a negative `margin-top` once the footer arrives. Both
are what `sticky` inside the right parent does for free.

**Pitfalls:** a grid/flex row stretches the sidebar to the column's height, leaving it **zero travel** (fix:
`align-self: start`) · `top` must equal the header height, or the sidebar slides under the header · a sidebar taller
than the screen: with sticky its bottom is unreachable until the column ends — either give it
`max-height: 100dvh; overflow-y: auto` (then `overscroll-behavior: contain`) or let it grow and not stick · `100vh` on a
phone is taller than the visible area (`dvh`) · the JS versions recompute on resize and jump when they switch modes.

**Builder: HAVE / PARTIAL** — `pinCSS` clause 3 (`align-self:flex-start`), clause 3b (`min-height: calc(100dvh - offset)`,
header/nav/footer excluded), and `pinStackPass` puts the sidebar under a page-held header. A tall sidebar *grows* (L1-3)
rather than scrolling inside itself, so its lower part is only seen at the end of the row (SP-8). **Kind:** LAYOUT.

### 8. A bar that starts lower and sticks when it reaches the top
**Pens:** fixed scroll navigation (https://codepen.io/tailofmoon/pen/VzXmpX) · Scrolling Navigation (https://codepen.io/multanisadik/pen/NWxbEej) · Sticky Bits (https://codepen.io/yowainwright/pen/XKyLwz)

**How it works:** the nav sits at the bottom of the hero; JS compares `scrollTop` with its `offsetTop` and switches it
to `position: fixed; top: 0`. Scrolling Navigation also copies the container width onto the fixed bar
(`.css('width', containerWidth)`) and only does it above 1024px.

**Pitfalls:** the moment it becomes fixed it leaves the flow and **the content jumps up by the bar's height** (layout
shift) · the width is lost when it leaves its column · all of it is one `position: sticky; top: 0` on the nav, with the
nav's parent being the page.

**Builder: HAVE** for the position (sticky in its holder; `pinScope` says where it lets go). The *arrival look* is
timed from the top of the page, not from the moment this bar sticks (SP-3). **Kind:** LAYOUT.

### 9. Sticky inside a scrolling box — headers that push each other
**Pens:** Sticky Header (https://codepen.io/emreerdendev/pen/zYRQOaV) · CSS: Sticky Header Description List (https://codepen.io/iamsaief/pen/eYVjJjW) · Polyfill for CSS, Fixed – WIP (https://codepen.io/Unillu/pen/KVZqZW) · Scrollable Table (https://codepen.io/darquiza/pen/PwbOrBw)

**How it works:** the box scrolls (`max-height: 200px; overflow-y: auto`) and each group heading is
`position: sticky; top: 0` (`dt`, `h1`). When every heading is a direct sibling, the next one slides **over** the
previous; when each heading sits in its own group wrapper (`.content { position: relative }` in the polyfill pen), the
previous one is **pushed out** with its group — the "contacts list A / B / C" effect. The polyfill pen also sticks
horizontally (`left: 0` in an `overflow-x: scroll` row) and cancels the scroller's padding with `top: -5px`.

**Pitfalls:** the scroller is the sticky container — the heading never sticks to the page · overlapping siblings need a
solid background · padding on the scroller shifts the stuck position · a scroll box inside a scrolling page traps the
finger/wheel (use `overscroll-behavior: contain`, keep the box short) · a keyboard user needs the box to be focusable
(`tabindex="0"` + label) to scroll it.

**Builder: PARTIAL** — page-level "headings that hand over" work (pin a heading inside each section; `pinScope` returns
the section, `pinStackGroup` keeps sections apart). There is **no scrollable box** (a block with `max-height` +
`overflow:auto`), so nothing can stick inside one (SP-5). **Kind:** LAYOUT.

### 10. Sticky table header and first column
**Pen:** Scrollable Table (https://codepen.io/darquiza/pen/PwbOrBw)

**How it works:** pure CSS, no JS.
```css
.table-wrap { overflow: auto; max-height: 360px; }
thead th { position: sticky; top: 0; background: …; z-index: 1; }
td:first-child, th:first-child { position: sticky; left: 0; background: …; z-index: 1; }
thead th:first-child { z-index: 2; }   /* the corner sits above both */
```
**Pitfalls:** cells need an opaque background or rows show through · the corner cell needs the higher z-index · with
`border-collapse: collapse` the borders of sticky cells do not travel with them (use `separate` + `border-spacing:0`, or
draw the line with a box-shadow) · `min-width` on the table keeps columns readable at 360px and lets the wrapper scroll
sideways · the wrapper needs `tabindex="0"` and a label to be keyboard-scrollable.

**Builder: GAP** — there is no Table component (`BoxType` has none; not in `lib/educo-ui/registry.ts`) (SP-6).
**Kind:** COMPONENT (Table).

### 11. Docs layout — fixed sidebar navigation
**Pen:** Technical Documentation Template | Sidebar Navigation & Fixed Layout (https://codepen.io/karlhorning/pen/pxgybR)

**How it works:** below 960px the nav stacks above the content; from 960px:
`.grid { display: grid; grid-template-columns: 200px auto } #navbar { position: fixed; width: 200px; height: 100% }`,
`#main-doc { grid-column-start: 2; min-width: 0 }`, and 300px wide from 1080px.

**Pitfalls:** the fixed nav's width must be repeated in the grid track (two numbers that must agree) · a nav longer than
the screen needs `overflow-y: auto` · `body { min-width: 660px }` forces sideways scrolling on a phone · the modern form is
`position: sticky; top: 0; height: 100dvh; overflow-y: auto` in the grid track — one number, no `grid-column-start`
trick · in-page links need `scroll-margin`/`scroll-padding` only if a top bar exists.

**Builder: PARTIAL** — a left rail can be `pin:"left"` + `hold:"fixed"` (`pinCSS` clause 5/5b gives width and full height)
or sticky (clause 3b `min-height:100dvh`), switched per rung (`pinCSS(…, bp)`). No internal scrolling for a long nav list
(SP-8). The docs sidebar as a whole (active link, collapsible groups) is a COMPONENT gap (SP-12). **Kind:** LAYOUT + COMPONENT.

### 12. Hero held in place while the content scrolls over it
**Pens:** Creative Web Headers Practice (https://codepen.io/Milmon/pen/bGqyrP) · Fixed Position Images with Scrolling (https://codepen.io/j2made/pen/dPPYvv)

**How it works (pen):** `#top { position: fixed; height: 500px; background-image: … }`, and the article is
`position: absolute; top: 500px; z-index: 5; background: white` so it slides up over the image.

**Pitfalls:** absolute positioning takes the article out of the flow (the page has no real height; footer placement
breaks) · `500px` hero does not fit a 640px-tall phone with toolbars.
**Modern fact:** `position: sticky; top: 0; z-index: 0` on the hero and `position: relative; z-index: 1; background: …`
on what follows does the same with everything still in the flow.

**Builder: GAP** — a page-level pinned band is given `PAGE_Z.sticky + 1` and a background by `pagePinCover`, i.e. it is
always painted **above** what scrolls past; there is no "stay behind" choice (SP-7). **Kind:** LAYOUT.

### 13. Clip-revealed fixed layers — "windows" onto a fixed picture
**Pens:** CSS Scroll Reveal Sections (https://codepen.io/hexagoncircle/pen/PXVEVZ) · Windowed Scroll (https://codepen.io/jaredsmith/pen/wxxyyy) · scroll line (https://codepen.io/carlasboa/pen/oLKVMO)

**How it works:** CSS Scroll Reveal Sections is pure CSS — each 100vh section holds an inner box with
`position: absolute; overflow: hidden; clip: rect(0, auto, auto, 0)` (iOS: `clip-path: polygon(0 0,100% 0,100% 100%,0 100%)`)
and inside it a `position: fixed` full-screen figure and title. The clip on the ancestor cuts the fixed child down to the
section's rectangle, so as a section scrolls it reveals *its own* fixed image and headline — a wipe between full-screen
scenes, no JS. Windowed Scroll does it with JS: clones each `.window` into a fixed container and toggles `.stuck` by
scroll range. scroll line keeps two fixed panes and shrinks the top one's height to `viewportHeight - scrollTop` on every
scroll (a wipe), setting the document height by hand.

**Pitfalls:** the JS versions write layout on every scroll event (jank) and break on resize · `clip` is deprecated (the
pen keeps it for old Chrome); `clip-path: inset(0)` is the modern form · a full-screen image per section is heavy on
3G (lazy-load, size to the screen) · text over a photo needs a contrast floor · 100vh sections on phones.

**Builder: GAP** — `clip-path` exists only for band edges (`edgePoints`, sloped/curved); nothing makes a fixed layer
clipped to its section (SP-10). **Kind:** MOTION/LAYOUT, LATER.

### 14. Fixed background image ("parallax" lite)
**Pens:** Fixed Position Images with Scrolling (https://codepen.io/j2made/pen/dPPYvv) · Sticky Header – Shrink & Opacity Effect (https://codepen.io/byKrissK/pen/rNoYaNP)

**How it works:** `background-attachment: fixed; background-size: cover` on a section; the picture stays put while
the section moves over it.

**Pitfalls:** **iOS Safari ignores `background-attachment: fixed`** (falls back to `scroll`) and some Android browsers
repaint the whole layer on every scroll — the classic cause of scroll jank on cheap phones · with `fixed`,
`background-size: cover` sizes the image to the **viewport**, not the section, so the crop changes · a full-viewport
photo per section is heavy · text over it needs contrast.

**Builder: HAVE / PARTIAL** — `bgAttach:"fixed"` emits `background-attachment:fixed` on canvas and export
(`box-model.ts:1035`, `:1138`). No fallback for touch/iOS, no `(hover: none)` or `prefers-reduced-motion` switch-off
(SP-11). **Kind:** LAYOUT.

### 15. Centring a fixed floating panel (popup, notice)
**Pens:** Centering a Fixed Position div (https://codepen.io/merb/pen/LGbXxQ) · Feathered Background on Fixed Position Transparent div (https://codepen.io/romancandlethoughts/pen/jOrqxK)

**How it works:** `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50%`, toggled with
jQuery `fadeToggle`; the feathered pen uses the older `left: 50%; margin-left: -250px` with a fixed width.

**Pitfalls:** the `transform` makes the panel a containing block for any fixed child (19) and can blur text on
half-pixels · a panel taller than the screen cannot be scrolled (`max-height: 90dvh; overflow: auto`) · no focus move,
no Escape, no focus return, no `aria-modal` — not a dialog for a keyboard or screen-reader user · a fixed 500px width
overflows a 360px phone.
**Modern fact:** `position: fixed; inset: 0; margin: auto; width: fit-content; height: fit-content` centres without a
transform, and a real popup is `<dialog>`/`showModal()` (top layer, `::backdrop`, Escape and focus for free) or
`popover`.

**Builder: PARTIAL** — `floatHoldCSS` holds a floating block on screen at a measured rem `left/top` (`pinX/pinY`), and
`pin` can hold a corner; there is no "centre of the screen" anchor, and a popup belongs to a Modal/Dialog component
(SP-13). **Kind:** LAYOUT (anchor) + COMPONENT (Modal).

### 16. Floating corner button — back to top, chat, "apply now"
**Pens:** Natural Sticky Top Floating Button (https://codepen.io/kadykov/pen/YPyMyJJ) · Natural Sticky Header Floating Events (https://codepen.io/kadykov/pen/ByjNVWP) · header_02 (https://codepen.io/jtec_web/pen/emYJxRv) · CSS: Sticky Header and Sidebar (scroll-to-top, https://codepen.io/iamsaief/pen/eYZRZPB)

**How it works:** a round button `position: fixed; bottom/right` (or a sticky container with the button pushed to the
right); natural-sticky floats it with `reserveSpace: false` so it hides/returns with the header. Back to top:
`window.scroll({ top: 0, behavior: 'smooth' })`.

**Pitfalls:** covers content and other bars at 360px (a cookie bar and a chat bubble in the same corner) · needs a
≥48px tap target, a label, visible focus · `env(safe-area-inset-bottom)` on notched phones and the home indicator · smooth
scrolling ignores reduced motion unless undone · a "back to top" link to `#top` works with no JS at all.

**Builder: HAVE** — `pin` corner + `hold:"fixed"` (`pinCSS`: fixed takes both insets of a corner; width `auto` hugs the
button), `floatHoldCSS` for a free-floating one; smooth scroll undone for reduced motion (`box-model.ts:3510`). No
safe-area insets (SP-14). **Kind:** LAYOUT.

### 17. Off-canvas mobile menu as a fixed panel, with scroll lock
**Pens:** Modern Responsive Navigation Menu (https://codepen.io/priyamakes/pen/azdGRPL) · Modern Responsive Header with Scroll Effect (https://codepen.io/Kuldeep-Rajput-the-sasster/pen/RNWVbQo) · header_02 (https://codepen.io/jtec_web/pen/emYJxRv) · Hack for fixed position element… (push menu, https://codepen.io/krozzwu/pen/zvbzxb)

**How it works:** `.nav { position: fixed; top: 0; right: -100%; width: 70%; height: 100vh; transition: right .4s }`,
`.nav.open { right: 0 }`; body scroll is locked with `document.body.style.overflow = 'hidden'` or, pure CSS, a checkbox:
`body:has(input#modal_menu_flg:checked) { overflow: hidden }` with a full-screen `opacity: 0; pointer-events: none`
overlay that turns on. Closes on link click, outside click, resize past the breakpoint.

**Pitfalls:** the closed panel is still in the tab order (off-screen links take focus) — needs `visibility: hidden` or
`inert` · the checkbox hack has no `aria-expanded`, no button role, no Escape · `100vh` is taller than a phone's visible
area (`100dvh`) · `overflow: hidden` on body does not stop iOS from scrolling the page behind; `overscroll-behavior:
contain` on the panel does · animating `right` reflows; `transform: translateX` doesn't · the push-menu pen's
`transform` on the content captures every fixed element in it (19).

**Builder: GAP** — Navigation is a placeholder (RULE C, `docs/COMPONENT_GAPS.md`); no scroll lock, no `overscroll-behavior`
anywhere in `lib/` (SP-12). **Kind:** COMPONENT (Navigation).

### 18. Scroll-spy sub-navigation and where an anchor lands
**Pens:** Scrolling Navigation (https://codepen.io/multanisadik/pen/NWxbEej) · Sticky Header – Shrink & Opacity Effect (https://codepen.io/byKrissK/pen/rNoYaNP) · CSS: Sticky Header and Sidebar (https://codepen.io/iamsaief/pen/eYZRZPB)

**How it works:** jQuery animates `scrollTop` to `section.offset().top - 55` (55 = the bar) on click, and on every scroll
marks the tab whose section top is `<= scrollTop + 60` as `.active`. The others use plain `#anchor` links with
`html { scroll-behavior: smooth }` — and their sections land **under** the fixed header.

**Pitfalls:** magic numbers (55, 60) that must match the bar · anchors and **keyboard focus** land under a sticky/fixed
header (WCAG 2.4.11 Focus Not Obscured) · `scroll-behavior: smooth` must be undone for reduced motion.
**Modern fact:** `scroll-padding-top: <bar height>` on the scroller (or `scroll-margin-top` on targets) fixes every
browser-driven scroll — fragment links, `scrollIntoView`, Tab focus, Page Down. Active-link highlighting is an
IntersectionObserver job (or the new CSS `scroll-target-group` / `:target-current` in Chromium), not a scroll listener.

**Builder: PARTIAL** — `pinStackPass` sets `scroll-padding-top` = the **fixed** top stack, when `pinPaddingNeeded`.
A **sticky** header held by the page is excluded on purpose ("covers the top only while stuck"), but a page-scope sticky
header is stuck for every target below the hero — so every anchor and focus scroll lands under it (SP-1). No scroll-spy
(SP-12). **Kind:** LAYOUT (offset) + COMPONENT (scroll-spy).

### 19. The transform-parent trap — a fixed child that stops being fixed
**Pens:** Hack for fixed position element has parent that has transform value (https://codepen.io/krozzwu/pen/zvbzxb) · Fixed position with transform: translate parent (https://codepen.io/isaiahmg/pen/wBxmmP) · Beware translate3d and fixed positioning (https://codepen.io/markdebeer/pen/nooOxL)

**How it works:** a `position: fixed` element is measured against the viewport **unless an ancestor has `transform`,
`perspective`, `filter`, `backdrop-filter`, `contain: paint/layout`, or `will-change` naming one of those** — then that
ancestor is its containing block and it scrolls with it. Beware translate3d shows it with a bare
`transform: translate3d(0,0,0)` (the old "GPU hack"). Workarounds in the pens: toggle the transform off when the menu is
closed (`.transform-none { transform: none !important }`); or give up on fixed and fake it with `position: absolute`
inside an inner `overflow: auto` scroller so the "fixed" box sits outside what scrolls.

**Pitfalls:** nothing errors — the bar just scrolls away · the trigger is usually a *visual* effect someone added far
above (a tilt, a glass panel, an entrance animation that leaves `transform` behind, a hover lift, a `will-change`).

**Builder: HAVE / PARTIAL** — `capturesFixed` + `fixedBlockedBy` warn for `rotate` and the glass variant, and the canvas
draws the same. Not counted: entrance animations (`animation-fill-mode: both` keeps the final `transform` on the
ancestor), hover effects that transform, and a **glass pin arrival** (`backdrop-filter` on the bar itself captures fixed
children such as a dropdown inside it) — see CHECK list. **Kind:** LAYOUT.

### 20. Mobile browser bugs — keyboard, scroll chaining, toolbars
**Pens:** Fix for position:fixed on iPhone/iOS Safari (https://codepen.io/thdoan/pen/JWYQeN) · Scrolling fixed position elements (https://codepen.io/SandraArato/pen/PqEoVJ) · chrome dev tool fixed position error (https://codepen.io/salzz4u/pen/bpPmXO)

**How it works:** old iOS broke fixed bars when the on-screen keyboard opened; the fix switches the bar to `absolute`
at `top = scrollTop` on input focus (after a 100ms delay) and keeps updating it on scroll until blur. The iOS 8.3 pen
tests whether scrolling inside a fixed overlay scrolls the page behind (it did; `-webkit-overflow-scrolling: touch` and
`body { overflow: hidden }` were the workarounds). The Chrome 50 devtools pen is an old emulator bug (an `img` with
`z-index:-1` made a fixed element render as absolute).

**Pitfalls (still real today):** a bar fixed to the **bottom** can sit over the focused input when the keyboard opens on
Android; the viewport meta `interactive-widget=resizes-content` and the `visualViewport` API are the modern levers ·
scroll chaining from a fixed panel to the page → `overscroll-behavior: contain` · `vh` vs `dvh`/`svh` with collapsing
toolbars · devtools emulation is not a phone — test on a real low-cost Android.

**Builder: PARTIAL** — `dvh` is used for sidebars (clause 3b); the export's viewport meta is
`width=device-width, initial-scale=1` only; no `overscroll-behavior`, no keyboard handling (CHECK + SP-12/SP-14).
**Kind:** LAYOUT.

### 21. Out-of-flow sizing, overlap and z-index traps
**Pens:** Untitled (https://codepen.io/brittneykernan/pen/GRYozq) · Fixed overlapping (https://codepen.io/DiegoVillasenor/pen/wMoPdV) · Css Layouting Position (https://codepen.io/dediindrawan/pen/jOzrVMw)

**How it works / what they show:** `position: fixed; left: 30px; right: 30px; width: 100%` — width wins and the bar
overflows the right edge ("take this off"). Fixed overlapping: a fixed box inside a floated 200px sidebar keeps its
200px but is no longer bounded by the column; an absolute child of it with `right: -40px` hangs over the centre column,
and the centre column's negative z-index puts it behind. The fixed header pen needs `z-index: 9999` to stay above an
image.

**Pitfalls:** a fixed block gets no width from its column (must be given one, or `left/right` with no `width`) ·
z-index arms races (9999, 99999) instead of a scale · negative z-index sends content under the page background.

**Builder: HAVE** — `pinCSS` clause 5 gives a fixed block its stored width (0px-wide bar measured before), 5b its height;
z-index tiers from `PAGE_Z`; `pagePinCover` lifts the page's bar one step. **Kind:** LAYOUT.

### 22. Polyfills and libraries for sticky/fixed
**Pens:** Stickybits Demo (https://codepen.io/yowainwright/pen/QdedaO) · Sticky Bits with Sticky Position support (https://codepen.io/yowainwright/pen/XKyLwz) · Polyfill for CSS, Fixed – WIP (Modernizr `csspositionsticky`, https://codepen.io/Unillu/pen/KVZqZW) · IE6 FIXED POSITION EXPRESSION (https://codepen.io/soberdash/pen/WbXxmj) · the natural-sticky pens (https://codepen.io/kadykov/pen/XJXbYVX, …/ByjNVWP, …/RNrPyXV, …/YPyMyJJ, …/emprNoY) · HeadsUp (https://codepen.io/hkfoster/pen/nbMJwp)

**How it works:** feature-test `position: sticky` (create an element, set every prefixed value, read it back); if missing,
wrap the element in a placeholder of its height and switch it to `fixed` from a scroll listener (Stickybits,
StickyBits, the Modernizr fallback with hand-computed absolute offsets). IE6 used a CSS `expression()` re-evaluating
`scrollTop` constantly. natural-sticky (an npm module loaded from esm.sh) and HeadsUp add behaviours CSS still lacks
(technique 5).

**Pitfalls:** sticky has been universal since Safari 13 / 2019 — the polyfills are now pure weight and scroll-listener
cost · loading a module from a CDN at run time is another round trip on 3G and a third-party dependency for a header.

**Builder: HAVE (by not needing them)** — pinning is pure CSS; the only script is `pinStackScript`, inlined and shipped only
when `pinStackNeeded`. If hide-on-scroll (SP-2) is built, it should be a few lines inlined the same way, not a library.
**Kind:** LAYOUT.

---

## GAP list

| # | Name · what a person would want to build · why it matters | Kind | Priority |
|---|---|---|---|
| SP-1 | **Anchor and focus offset for a sticky page header** · "a sticky header and a 'Term dates' link that lands on the heading, not under the bar" · `scroll-padding-top` is set only for FIXED bars (`pinPaddingNeeded`); a page-scope sticky header is stuck for every target below the hero, so links and Tab focus land under it (WCAG 2.4.11). Use the stuck stack height, or `scroll-margin-top` on targets. | LAYOUT | MUST |
| SP-2 | **Hide on scroll down, show on scroll up** · "a header that gets out of the way while reading on a phone" · reclaims ~10% of a 360×640 screen; must reappear on focus-within, at page bottom, and snap under reduced motion; a few inlined lines (passive, rAF) or `scroll-state(scrolled:)` where supported. | MOTION | DECIDE (lean MUST for phones) |
| SP-3 | **Arrival timed to the moment the bar sticks** · "a nav under the hero that turns solid when it reaches the top" · `pinArrival` runs on the page's `scroll()` from 0, so a bar that starts lower has finished arriving before it sticks; a `view()` exit range or `scroll-state(stuck:)` with fallback fixes it. | MOTION | DECIDE |
| SP-4 | **Clip without killing sticky** · "a rounded section with a sticky sidebar inside" · export writes `overflow:hidden` for clip/radius (`box-export.ts:393`), which makes a scroll container; `overflow: clip` clips the same (and follows the radius) without breaking sticky — turns a warning (`pinBlockedBy`) into a non-problem. | LAYOUT | MUST |
| SP-5 | **Scrollable box** · "a news list or term-dates list that scrolls inside a fixed-height card, with sticky group headings" · no `max-height` + `overflow:auto` box exists, so technique 9 cannot be built; needs `tabindex`, label, `overscroll-behavior: contain`. | LAYOUT | DECIDE |
| SP-6 | **Table with sticky header row and first column** · "a fees or timetable table that scrolls sideways on a phone and keeps its headings" · there is no Table component at all; sticky `th`, corner z-index, separate borders, keyboard-scrollable wrapper. | COMPONENT | MUST (when the Table is built) |
| SP-7 | **Stay-behind layer (content scrolls over the hero)** · "the hero photo stays while the next section slides up over it" · `pagePinCover` always puts a page-pinned band above what scrolls past; needs a "behind" choice (sticky + lower z, following band opaque). | LAYOUT | DECIDE |
| SP-8 | **Tall sticky sidebar / long rail scrolls inside itself** · "a docs/TOC rail with 30 links that stays beside the article" · a tall sidebar grows (L1-3) and its lower links are reachable only at the end of the row; option `max-height: calc(100dvh - top); overflow-y: auto; overscroll-behavior: contain`. | LAYOUT | DECIDE |
| SP-9 | **Fixed-bar flow space** · "a fixed header over the first section that does not hide the first heading" · nothing reserves space for a fixed top bar (sticky does); measured padding on the first section from the same pass that sets `scroll-padding-top`, or steer users to sticky. | LAYOUT | LATER |
| SP-10 | **Clip-revealed fixed scenes** · "full-screen photo chapters that wipe into each other as you scroll" · pure CSS (clipped ancestor + fixed child), no JS; heavy images must be lazy and sized. | MOTION | LATER |
| SP-11 | **Fixed-background fallback** · "a locked background photo that still looks right on an iPhone and a cheap Android" · `bgAttach:"fixed"` is ignored on iOS and janks on low-end GPUs; switch to `scroll` under `(hover: none)` / reduced motion, or use the SP-10 technique. | LAYOUT | DECIDE |
| SP-12 | **Navigation component behaviours** · "a phone menu that slides in, a docs sidebar with the current section highlighted" · off-canvas panel with `inert`/`visibility`, `aria-expanded`, Escape, focus return, scroll lock + `overscroll-behavior: contain`, `dvh`; scroll-spy via IntersectionObserver. | COMPONENT | MUST (when Navigation is built) |
| SP-13 | **Centre-of-screen anchor and a real dialog** · "a notice or 'Apply now' popup in the middle of the screen" · `floatHoldCSS`/`pin` hold corners and measured positions only; centring should be `inset:0; margin:auto` (no transform) and a popup a `<dialog>` component. | COMPONENT | LATER |
| SP-14 | **Safe-area and keyboard awareness for held bars** · "a bottom 'Call the school' bar on a notched phone that is not covered by the home indicator or the keyboard" · no `env(safe-area-inset-*)`, no `viewport-fit=cover`, no `interactive-widget` in the export's viewport meta. | LAYOUT | DECIDE |

## CHECK list (claimed, to verify in a headed browser)

1. A **fixed** top bar: a `#anchor` link, a cross-page `page.html#anchor`, Tab focus and Page Down all land **below** it,
   at every rung, after a resize and after the web fonts load (`scroll-padding-top` from `pinStackPass`).
2. A **sticky** page header (the default): the same four — expected to fail today (SP-1).
3. `pinArrival` in Chromium, Firefox and WebKit: each of the five looks completes over `pinArrivalAfter`; where
   `animation-timeline` is unsupported the bar keeps its resting look; reduced motion shows the resting look; `condense`
   on a sticky (in-flow) bar does not shift the page under the reader or oscillate near the threshold.
4. A pinned bar *with* an entrance effect keeps both (the merged `animation-name` list).
5. **Fixed capture not warned today:** a fixed block inside a section that has an entrance effect (`fill-mode: both`
   leaves a `transform`), inside a block with a transforming hover effect while hovered, and inside a bar whose arrival is
   `glass` (`backdrop-filter`) — does it stay on screen? If not, `capturesFixed` must count these.
6. Two, three bars at one edge stack (`--eu-pin-above`) at every rung, including when one wraps to two lines at 360px
   and when one bar's pin is switched off at the phone rung; two sticky bars in sibling sections are **not** offset.
7. A sticky sidebar beside a long column: holds under the page header (not under it by 0px), keeps travel
   (`align-self`), short sidebar = screen height, tall sidebar never overlaps the next section.
8. Rounding or clipping a section with a sticky child: the Inspector names the blocker (`pinBlockedBy`) on canvas, and the
   export behaves the same.
9. A fixed full-width bar and a fixed left rail have width/height (clauses 5/5b) and cause **no horizontal overflow at
   360px**; a corner button hugs its content.
10. A corner button and a bottom bar in the same corner: do they stack or collide (both join the bottom stack)?
11. Canvas = export for held blocks (`canvasFixedStyle` draws `absolute`), including with canvas zoom (Z-1) on.
12. On a 360×640 phone at 200% zoom / 150% text, held bars do not take so much height that content is unreadable
    (WCAG 1.4.10); `pagePinCover` gives a colourless page header an opaque background with 4.5:1 text.
13. `bgAttach:"fixed"` on iOS Safari and a low-cost Android (Tecno/Infinix class): what renders, and is scrolling smooth?
14. A bottom-held bar on Android Chrome while a form field near the bottom is focused: is the field covered by the bar
    or the keyboard?
15. `pinStackScript` re-runs after late images change a bar's height (only `resize`, `load` and fonts are listened to).

## Not relevant
Chess With CSS Positioning (https://codepen.io/malekz/pen/yRoJXR) — absolute-positioned chess squares, no sticky/fixed
or scrolling. (The recipe pen and the old browser-bug pens were kept above: each shows a fixed-position lesson.)
