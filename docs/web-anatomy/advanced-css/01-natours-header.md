# Natours — the header (lectures 1–6, 11)

Advanced CSS and Sass, project 1 (Natours, a tour company landing page). Distilled from the transcripts the user shared on
2026-10-01. `HAVE` / `PARTIAL` / `GAP` = what the builder can do today (see [README](README.md)).

## Lecture 1 — reset, project fonts, the hero background and `clip-path`

**Reset.** `* { margin:0; padding:0; box-sizing:border-box }` — start clean; `border-box` so padding and border are not
added to a box's width/height. The course drops Normalize.css: browsers are consistent enough now.
→ `HAVE` — the export's base layer resets and uses `border-box`.

**Project-wide type on `body`, not on `*`.** Font family, weight (400), size, line-height (1.7) and text colour are set
once on `body` and reach every element by INHERITANCE (font properties inherit; `padding` does not). Setting them on
`*` is the anti-pattern. The course's 16px is replaced later "by a better technique" (rem — later lectures).
→ `HAVE` — the theme's type tokens sit on the page root and cascade (typography cascades from any container).

**Hero background in layers.** One `background-image` with TWO layers, the first painted on top:
`linear-gradient(to right bottom, rgba(light, .8), rgba(dark, .8)), url(hero.jpg)`.
- Direction keywords: `to right`, `to bottom`, `to right bottom` (corner to corner).
- `rgba(…, .8)` so the photo shows through.
- `background-size: cover` (fills the box whatever its shape); `background-position: top` keeps the TOP of the photo
  when the box gets shorter (`bottom`, `center` keep those parts).
→ `HAVE` — photo + `bgOverlay` (a colour or a gradient), `bgSize`, `bgPosition`.

**A hero most of a screen high.** `height: 95vh` — 95% of the viewport, leaving a sliver of the next section.
→ `PARTIAL` (AC-3) — `screenHeight` offers half / full (a floor, `svh`); no 95%.

**A frame round the whole page.** `body { padding: 30px }` — a white border on every side of the site.
→ `GAP` to confirm (AC-2).

**`clip-path: polygon(…)`** — the visible region as points, clockwise from the top left, each `x y` measured from the
element's top-left corner, in % of the element (or any length). The hero wedge:
`polygon(0 0, 100% 0, 100% 75vh, 0 100%)` — the right side cut at 75% of the SCREEN height, the left at the bottom,
so the slope follows the window. A triangle: `polygon(50% 0, 100% 100%, 0 100%)`. Tool: Clippy (bennettfeely.com/clippy).
→ `PARTIAL` (AC-1) — `edgeTop` / `edgeBottom` (slope left/right, curve in/out) with `edgeDepth` as a % of the band's own
height, one `clip-path`; not on a screen measure, and no free polygon (a triangle, an arrow) — a shape/mask feature,
not layout.

## Lecture 2 — the logo and the primary heading; centring anything

**A logo in the corner.** The `<img>` sits in a `div.logo-box`, positioned `absolute; top:40px; left:40px` against the
header, which is `position: relative` (the reference for top/left is the nearest positioned ancestor). Size the image by
its HEIGHT (35px) and let the width follow. `alt` describes it.
→ `HAVE` — a block "Floating" inside a section, placed against that section; image height with auto width.

**One `h1`, two lines styled apart.** The page's single `h1` holds the whole title ("Outdoors / is where life happens"),
split into `span.heading-primary--main` and `span.heading-primary--sub`, each `display:block` (a block takes the full
width and breaks the line). White, `text-transform: uppercase`; main 60px / weight 400 / `letter-spacing: 35px`, sub 20px
/ weight 700 / `letter-spacing: 17.4px`. Reason given: the h1 is the most important heading for search engines, so the
WHOLE title belongs in it, not only "Outdoors".
→ `GAP` (AC-4) — a Heading is one run of words with one style; two Heading blocks make two headings. Wanted: one heading
with parts (lines) styled separately. Uppercase and letter-spacing per block are `HAVE`.

**Centring a box exactly — the classic.** `position:absolute; top:50%; left:50%; transform:translate(-50%, -50%)`.
`top`/`left` % are of the PARENT; `translate` % are of the ELEMENT ITSELF, so the box's centre lands on the parent's
centre at every width and height. The course then sets `top: 40%` so the box sits optically higher above the slanted
edge. The box (`.text-box`) wraps the heading and the button so they centre together.
→ `PARTIAL` (AC-5) — *Content position* (3×3: top / middle / bottom × left / centre / right) centres a section's content
with flexbox at every size; no "40% from the top" optical position. (Flexbox centring is the modern equivalent of the
translate trick; the result is what is judged.)

## Lecture 3 — CSS animations: `@keyframes` and `animation`

**Two kinds of motion.** (1) `transition` — animate a property change on an event (hover); (2) `@keyframes` + `animation`
— a named sequence that plays on load, on hover, or repeatedly.

**`@keyframes moveInLeft`** — `0% { opacity:0; transform:translateX(-100px) }`, `80% { transform:translateX(10px) }`,
`100% { opacity:1; transform:translate(0) }`. The 80% step OVERSHOOTS the end and settles back — the small bounce that
makes it feel physical. `moveInRight` mirrors the signs. Any percentage can be a step.

**Animate only `opacity` and `transform`** — the two properties browsers animate cheaply (compositor, no layout).

**Properties.** `animation-name`, `animation-duration` (the two required), `animation-delay`, `animation-iteration-count`,
`animation-timing-function` (`ease`, `ease-in` slow start, `ease-out` slow end, `cubic-bezier(…)` custom — later).
Shorthand: `animation: moveInRight 1s ease-out`. The same keyframes can be reused anywhere, e.g. on `:hover`.

**The shake fix.** A small jump at the end of a transform animation is cured with `backface-visibility: hidden` on the
animated element (why it works is not known; it does).

→ `HAVE` — named entrances per block and per item (`REVEAL_EFFECTS`: fade, rise, drop, from the left, from the right,
zoom, sharpen), on load or when scrolled into view, children one beat apart, opacity + transform only, a reduced-motion
fallback. `PARTIAL` (AC-6) — no overshoot-and-settle step, no per-block delay or repeat count, no custom easing control.
Motion, not layout — recorded for the motion area.

## Lecture 4 — the button: pseudo-classes, `transition`, lift and press

**Markup.** `<a href="#" class="btn btn--white">Discover our tours</a>` — a LINK styled as a button (it goes somewhere).
`btn` holds what every button shares, `btn--white` / `btn--green` only the colour (a modifier class).

**Pseudo-classes = a state of the selector.** `:link`, `:visited` (styled the same, so a visited button does not turn
purple), `:hover`, `:active` (while pressed); also `:last-child` and others. Uppercase, no underline, padding
`15px 40px` (two values: top/bottom, left/right), `border-radius: 100px` (a pill — any large number).

**Inline-block.** A link is inline; `display: inline-block` makes padding, width and height work while it still sits in a
line of text — so `text-align: center` on its box centres it (no positioning needed). Space under the heading:
`margin-bottom: 60px` on the heading.

**Lift on hover, press on click.** `:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.2) }`;
`:active { transform: translateY(-1px); box-shadow: 0 5px 10px rgba(0,0,0,.2) }` — closer to the page: smaller offset,
less blur. Both are measured from the RESTING state. `box-shadow: x y blur colour` — more blur reads as further away.

**`transition` goes on the RESTING state** (`transition: all .2s`), and the hover/active values animate to and from it.

→ `HAVE` — the Button block (a link when it has a destination), pill radius through the five radius controls,
`HOVER_EFFECTS` Lift / Grow / Press / Glow / Outline / Brighten / Soften, and a pressed state (`.eu-btn:active` 1px
down). Centred in its line through *Position in row*.

## Lecture 5 — the `::after` pseudo-element: a halo that grows and fades; `animation-fill-mode`

**`::after`** adds a virtual last CHILD of the element, styled like any element. It shows only with `content` set (here
`""`) and a `display`. As a child it can take `height:100%; width:100%` of the button — the same size and radius — sit
`position:absolute; top:0; left:0` against the button (which becomes `position:relative`), and go BEHIND it with
`z-index:-1`. Colour per modifier: `.btn--white::after { background:#fff }`.

**The halo.** `.btn::after { transition: all .4s }`; `.btn:hover::after { transform: scaleX(1.4) scaleY(1.6); opacity:0 }`
— on hover the copy behind grows and fades out, as if the button rings outward; it comes back when the pointer leaves.
`scale()`, `scaleX()`, `scaleY()` like `translate`.

**The button's own entrance, later than the heading.** `@keyframes moveInBottom` (from `translateY(30px)`, opacity 0)
applied only to this button with a third class `btn--animated`:
`animation: moveInBottom .5s ease-out .75s` (name, duration, timing, DELAY). With a delay the button showed in place
before it started — `animation-fill-mode: backwards` applies the 0% styles during the delay.

→ `PARTIAL` (AC-7) — no "halo / ring outward" hover effect; per-block entrance delay is AC-6. The export's entrances
already set `animation-fill-mode` (`box-model.ts` ~6364). Motion area, not layout.

## Lecture 6 — the three pillars of good HTML and CSS

1. **Responsive design** — one site that works on every screen and device: fluid layouts, media queries, responsive
   images, the right UNITS for font sizes and dimensions, and a desktop-first or mobile-first strategy.
   → the project's rules 16 (rem/%, container queries) and 18 (the five-rung ladder, `base` is desktop).
2. **Maintainable and scalable code** — clean, understandable, reusable, ready to grow: a CSS ARCHITECTURE (how files
   are organised, how classes are named, how the markup is structured — a later lecture).
   → RULE M (Ponytail) and one engine for both surfaces; class naming is the export's job (`bx-<id>`, `eu-*`).
3. **Web performance** — fewer HTTP requests, less code, compressed code, a preprocessor; above all FEWER and SMALLER
   images, compressed — images are most of a page's weight.
   → RULE AF's weight budget (≤ 100 KB code, ≤ 500 KB first view at 360px), measured in BATCH L-6.

## Lecture 11 — every px to rem, and the 62.5% root

**Why:** to change EVERY measurement on the page with ONE setting — the root font size — e.g. smaller at a phone
breakpoint, larger on a big screen — instead of hundreds of lines of media queries. Every length in `rem` follows the root.

**How:**
1. Root font size so that **1rem = 10px**: then every px value divided by 10 is its rem (30px → `3rem`, 17.4px → `1.74rem`).
   Body text, which was 16px, becomes `1.6rem`. Write `.5rem`, not `0.5rem` (a style habit).
2. **Never set the root in px.** `html { font-size: 10px }` overrides the reader's browser text size (people with poor
   sight raise it). Use a **percentage of the browser's default**: `html { font-size: 62.5% }` = 10px at the default 16px,
   12.5px at 20px, 13.75px at 22px — the whole design grows with the reader's setting.
3. Use **rem, not em**, for lengths: em depends on each parent's font size and the arithmetic becomes unmanageable.
4. Tidy the reset with inheritance: `* , *::before, *::after { margin:0; padding:0; box-sizing: inherit }` and
   `body { box-sizing: border-box }` — pseudo-elements get the same box model (the button's `::after` needed it), and a
   plugin can change `box-sizing` once for its subtree.

(rem is unsupported below IE9 — irrelevant today.)

**For the builder — `HAVE`, by a route that keeps the reader in charge:** the builder never changes the root font size at
all (the reader's 16px — or 24px — stays the root). Its base unit is a variable, `--box-u: 0.625rem` — exactly the
course's "1 unit = 10px at the default", expressed as a rem so it still follows the reader — and every stored length is
emitted as `calc(var(--box-u) * n)` or a rem (`u()`, `remLen()`; rule 16). The ONE-SETTING-SCALES-EVERYTHING idea is
there twice: the reader's text size (the 150% check on every swept page), and the fluid `clamp(…rem + …cqw…)` term in
`--box-u` that scales spacing with the box instead of a media query per breakpoint. The reset already covers `::before`
/ `::after` (`.eu-root *, *::before, *::after { box-sizing: border-box }`).
