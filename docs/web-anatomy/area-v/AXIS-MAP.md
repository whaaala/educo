# AREA V — the axis map (RULE MAP, step 1)

> **What this is.** Every family the page's look is made of — colour, backgrounds & gradients, overlays, shadows, glass /
> filters / blend, textures, section shapes — broken into its independent **axes**, every **value** each axis takes, and
> **how it is made** in CSS / SVG. Any design a real site shows is a combination of these. When every axis here has a
> working example (step 2, `specimens/`) and random combinations are proven to build in a real browser (step 3,
> `scripts/uat/r2-combos.js`), we can make any combination — that is the "enough" test (CLAUDE.md, RULE MAP).
>
> **Sources.** MDN (the property pages named per axis) · the stored research (`motion/library/10-surface.md`,
> `motion/07-shadows.md`, `motion/library/3-section-transition.md`, `codepen/divider.md` · `wave.md` · `clip-path.md`,
> `design-foundation/`) · the R-2 crawl (`codepen/raw/*.json`, `research-runs/site-*.json`, `wf-*.json`) · the builder
> inventory of 2026-10-03. **Builder** column: ✅ control in the builder · ⚙️ engine only (no control — RULE UI gap) ·
> ❌ none. Bugs found are AREA V ledger lines V-1…V-12 in `docs/TASK_TREE.md`.
>
> **Status of each axis** is the last column: **MAP** (values known) → **EX** (an example per value stored) → **PROVEN**
> (inside the combination proof). Research is finished for a family when every axis reads PROVEN and the crawl's
> saturation run added no axis or value.

---

## 1 · Colour (MDN: `<color>`, `color-mix()`, relative colours, `EyeDropper`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Notation | hex 3/4/6/8 · `rgb()` · `hsl()` · `hwb()` · `oklch()` · `oklab()` · `lab()` · `lch()` · `color(display-p3 …)` · named · `currentColor` · `transparent` | the `<color>` value itself | hex only ✅ | MAP |
| Alpha | 0–1 on any notation · `/ a` · 8-digit hex | `oklch(70% .15 250 / .5)` | ❌ (only whole-box opacity) | MAP |
| Mixing | `color-mix(in <space>, a p%, b)` · spaces srgb / oklch / oklab / hsl, hue longer/shorter | MDN `color-mix()` | ⚙️ (`fadeColor`) | MAP |
| Relative colour | `oklch(from var(--brand) calc(l + .1) c h)` — lighter / darker / desaturated / alpha of a token | MDN relative colours | ❌ | MAP |
| Scale | main · accent · grey, each 50–950 tints and shades (design deck rule #2) | OKLCH ramp (`lib/educo-ui/color.ts`) | ✅ 45 palettes, spectrum | MAP |
| The user's own | saved swatches · recent · a brand set (name + value) · imported palette | stored list + picker section | ❌ | MAP |
| Contrast | WCAG ratio 4.5 / 3 · "fix it" nudge · over a photo (scrim) | `contrastRatio`, `nearestAccessibleColor` | ⚙️ tokens only (V-12) | MAP |
| Picker controls | spectrum square · hue strip · alpha strip · wheel · sliders (L C H) · text entry per notation · eyedropper · swatches · recent · pick from a photo · mode switch (dropdown) · old-vs-new compare · Solid / Gradient tabs · contrast hint | canvas / gradients for the spectrum, pointer + keys on the thumb | partial ✅ (no alpha strip, no entry other than hex) | MAP — designs read: 75 Dribbble pickers, every screenshot opened (`picker-shots.json`): square 24 · hue strip 24 · preset swatches 19 · hex 18 · from a photo 15 · alpha 12 · eyedropper 11 · saved swatches 10; NONE has OKLCH / LAB entry or a gradient-stops editor, 1 a contrast hint — where the builder can lead |

## 2 · Backgrounds & gradients (MDN: `background`, `<gradient>`, `background-clip`, `@property`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Gradient type | linear · radial · conic | `linear-gradient()` … | ✅ | MAP |
| Repeating | off · on | `repeating-*-gradient()` | ⚙️ presets / raw CSS | MAP |
| Direction | angle 0–360 · `to <side/corner>` | first argument | ✅ angle | MAP |
| Radial shape · size | circle · ellipse × closest-side · closest-corner · farthest-side · farthest-corner · a length | `radial-gradient(ellipse farthest-corner at …)` | ❌ editor overwrites (V-7) | MAP |
| Position | x y in % / keywords | `at 30% 20%` | ❌ (V-7) | MAP |
| Conic start | `from <angle>` | `conic-gradient(from 45deg at …)` | ❌ | MAP |
| Stops | count · colour (with alpha) · position · double position (hard edge) · hint | `red 0 20%, blue 20%` | ✅ count + % (alpha lost, V-8) | MAP |
| Interpolation | srgb · oklch · oklab · hue shorter/longer | `linear-gradient(in oklch, …)` | ❌ | MAP |
| Layers | 1…n gradients / images stacked | comma list in `background-image` | ⚙️ mesh presets (33), raw | MAP |
| Where it paints | background · text · border · mask | `background-clip: text` · `border-image` / padding-box + border-box trick · `mask-image` | background only ✅ | MAP |
| Motion | static · position drift · angle turn · stop shift | `@property --a {syntax:'<angle>'}` + keyframes / `background-position` | ❌ | MAP |
| Image | none · photo URL · upload · `image-set()` | `background-image: url()` | ✅ | MAP |
| Size | auto · cover · contain · length · % | `background-size` | ✅ (photo only) | MAP |
| Position | 9 points · x y | `background-position` | ✅ (photo only) | MAP |
| Repeat | repeat · no-repeat · x · y · space · round | `background-repeat` | ✅ (photo only) | MAP |
| Attachment | scroll · fixed · local | `background-attachment` | ✅ fixed | MAP |
| Origin / clip | border-box · padding-box · content-box · text | `background-origin`, `background-clip` | ❌ | MAP |
| Base + image together | colour or gradient under a photo | last layer of the stack | ❌ gradient dropped (V-9) | MAP |

## 3 · Overlays (MDN: `background` layers, `::before`, `backdrop-filter`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| What sits on top | flat colour · gradient scrim · pattern / texture · image · blur of what is behind | top `background` layer, or a `::before` / child layer | ✅ colour (opaque), ⚙️ gradient | MAP |
| Opacity | 0–100% | colour alpha / `opacity` | ❌ (V-4) | MAP |
| Scrim direction | top · bottom · left · right · radial vignette | gradient direction | ❌ | MAP |
| Blend with below | normal · multiply · screen · overlay · soft-light · … (16) | `background-blend-mode` / `mix-blend-mode` | ❌ | MAP |
| Scope | whole band · only the photo · behind the words | the layer's box | band ✅ | MAP |
| State | constant · on hover · on scroll | `:hover` / scroll-driven animation | ❌ | MAP |
| On components | — | `componentBoxCss` | ❌ dropped (V-2) | MAP |

## 4 · Shadows (MDN: `box-shadow`, `filter: drop-shadow()`, `text-shadow`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Kind | box · drop (follows the shape) · text | three properties | box ✅ | MAP |
| Offset x / y | any length, neg allowed | first two lengths | ❌ (scale only) | MAP |
| Blur | 0 (hard) … large | third length | ❌ | MAP |
| Spread | negative · 0 · positive (ring) | fourth length | ❌ | MAP |
| Colour | black / tinted by the surface / brand glow, with alpha | the colour | ❌ black only | MAP |
| Inset | out · in | `inset` | ❌ | MAP |
| Layers | 1 · 2 · 3+ (72% / 15% / 12% measured) | comma list | ✅ 2 in the scale | MAP |
| Character | elevation · ring · glow · hard offset · neumorphic · long shadow | recipes over the axes above | partial (hover glow) | MAP |
| Scale | 4–5 named steps, themed (dark theme lighter) | tokens `--eu-shadow-*` | ✅ 4 steps (literal — V-11) | MAP |
| State | constant · grows on hover / focus | transition on the property | ⚙️ hover effects | MAP |
| Survives a shaped edge | — | shadow on a wrapper outside the clip | ❌ clipped (V-10) | MAP |

## 5 · Glass, filters & blend modes (MDN: `backdrop-filter`, `filter`, `mix-blend-mode`, `background-blend-mode`, `isolation`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Backdrop function | blur · saturate · brightness · contrast · grayscale · hue-rotate · invert · sepia · opacity (combined) | `backdrop-filter: blur(12px) saturate(1.4)` | ⚙️ Alert / Accordion only | MAP |
| Element filter | the same list + `drop-shadow` + `url(#svg-filter)` | `filter` | ⚙️ hover / entrance only | MAP |
| Glass recipe | translucent fill · blur · light border / highlight · grain · shadow | the axes combined | ⚙️ components | MAP |
| Fallback | no `backdrop-filter` → a more opaque fill · reduced transparency | `@supports not (backdrop-filter: …)` · `prefers-reduced-transparency` | ❌ | MAP |
| Element blend | normal + 15 modes | `mix-blend-mode` (+ `isolation: isolate` on the parent) | ❌ | MAP |
| Layer blend | the same 16 between background layers | `background-blend-mode` | ❌ | MAP |
| Cost | blur radius × area on a low-cost phone (RULE AF) | measured in the real-world pass | — | MAP |

## 6 · Textures (MDN: SVG `<feTurbulence>`, `<filter>`, `background-repeat`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Source | noise / grain · CSS gradient pattern · tiled image · canvas | SVG `feTurbulence` as a data-URI tile · `repeating-*-gradient` · `url()` | patterns ✅ (25), image ✅ | MAP |
| Noise kind | fractalNoise · turbulence | `type` | ❌ | MAP |
| Grain size | baseFrequency 0.3–2 | `baseFrequency` | ❌ | MAP |
| Detail | numOctaves 1–6 | `numOctaves` | ❌ | MAP |
| Strength | opacity 2–30% | layer alpha | ❌ | MAP |
| Blend over below | normal · multiply · overlay · soft-light | `background-blend-mode` | ❌ | MAP |
| Tile size | length | `background-size` | ✅ patterns | MAP |
| Pattern colour | follows text colour · its own colour | `currentColor` vs a set colour | ✅ currentColor only | MAP |
| Where | page · band · card · behind words | the layer's box | ✅ any block | MAP |
| Moving | static · drifting | animated `background-position` | ❌ | MAP |

## 7 · Section shapes & blending (MDN: `clip-path`, `mask-image`, `<path>`, `shape()`)

| Axis | Values | How it is made | Builder | Status |
|---|---|---|---|---|
| Shape family | slope · curve · wave · zigzag · triangle / arrow · tilt · cloud · torn · blob · steps | polygon / path | slope ✅ · curve ✅ (4 shapes) | MAP |
| Method | `clip-path` polygon · `clip-path: path()` / `shape()` · inline SVG divider · `mask-image` (SVG / gradient) | per family | polygon ✅ | MAP |
| Edge | top · bottom · both | per edge | ✅ | MAP |
| Depth | 0–50% / a length | the shape's height | ✅ 0–30% | MAP |
| Flip / invert | horizontal flip · inverted (cut in vs out) | transform / path | ✅ via the 4 shapes | MAP |
| Layers | 1 · 2–3 stacked translucent waves | several SVG paths / masks | ❌ | MAP |
| Fill | transparent cut · the next band's colour | SVG fill = neighbour's background | ❌ | MAP |
| Overlap | none · the next band slides over (negative margin, z) | `margin-top: -x`, stacking | ❌ | MAP |
| Colour hand-over | hard edge · gradient fade into the next band | gradient across the seam | ⚙️ by hand | MAP |
| Responsive | stretches · keeps its proportion · gets shallower on a phone | `preserveAspectRatio="none"` · height in `vw` / `clamp()` | % depth ✅ | MAP |
| Motion | static · drifting wave · scroll-linked | keyframes on the path / `animation-timeline: view()` | ❌ | MAP |
| Shadow / border on the shape | — | `filter: drop-shadow` on a wrapper | ❌ clipped (V-10) | MAP |

---

## The proof so far (2026-10-03, Chrome 145, HEADED — `scripts/uat/r2-axes.js` + `r2-combos.js`, `specimens/proof.json`)

**Re-proven after the gap check (step 4), 2026-10-03, Chrome 145.0.7632.6, six headed windows.** The earlier "distinct"
counts were INFLATED by a measurement fault (R2-27: tiles 1px apart in size compared as 100% different); these are honest,
and every repeat is explained (`proof.json` → `alike`: the axes a look-alike group differs on, and what it shares).

| Family | Axes · values proven | Combinations possible | Specimens painted · invalid | 60 random combinations: valid · painted · distinct | Repeats explained by |
|---|---|---|---|---|---|
| Colour | 6 · 33 | 9,750 | 33/33 · 0 | 60 · 60 · 54 | transparent (a named no-op, 9) |
| Gradients | 9 · 31 | 43,200 | 31/31 · 0 | 60 · 60 · 48 | aurora takes only the stop COLOURS (dependent axes) |
| Backgrounds | 8 · 25 | 6,480 | 25/25 · 0 | 60 · 58 · 57 | a fixed picture against the window (named); a clip on a picture that never reaches the padding |
| Overlays | 5 · 20 | 720 | 20/20 · 0 | 60 · 60 · 50 | direction is a scrim's only, blend not a blur's (dependent); white × multiply, dark 20% × screen (named) |
| Shadows | 9 · 29 | 25,920 | 29/29 · 0 | 60 · 60 · 51 | reflection ignores x / blur / spread / colour / inset / layers (dependent) |
| Glass · filters · blend | 10 · 38 | 129,600 | 38/38 · 0 | 60 · 60 · 60 | — (fallback proven by emulation: blur(4px) → none) |
| Textures | 11 · 37 | 129,600 | 37/37 · 0 | 60 · 57 · 55 | ink × blend no-ops (named); axes a source does not use |
| Section shapes | 11 · 51 | 1,213,056 | 51/51 · 0 | 60 · 60 · 59 | an overlap that hides the edge, corners on a same-colour ground (named) |

**Across families** (`r2-stack.js`, with the new values): 40 blocks · 241 ablations · 0 invalid · 9 clashes, all V-10 (a box-shadow
on a shaped band — now also on `shape()`, scallop, torn); the wrapper shadow never vanished. **Every level, nested**
(`r2-nest.js`): 40 trees · 164 ablations · 0 invalid · cascade-down 0 failures · 0 clashes · 1 named no-op. **States**
(`r2-states.js`): 30 trees · **197 checks · 0 failed** — now with a pointer-following spotlight / shadow, a hover overlay that
fades in, scroll-linked overlay / edge (real wheel; nothing moves under reduced motion), and a modal `::backdrop` (click opens,
the page dims + blurs, focus moves inside, Escape closes, focus returns). Mutation-proven: no scroll link → 20 SCROLL failures;
no pointer script + no backdrop rule → 15 POINTER + 1 MODAL failures.

<details><summary>The first proof (before the gap check), kept for the record</summary>

| Family | Axes · values proven | Combinations possible | Specimens painted · visibly distinct | 60 random combinations: valid · painted · distinct |
|---|---|---|---|---|
| Colour | 4 · 24 | 1,000 | 24/24 · all (notation same **by design**) | 60 · 60 · 55 |
| Gradients | 9 · 28 | 19,440 | 28/28 · all | 60 · 60 · 60 |
| Backgrounds | 6 · 20 | 1,080 | 20/20 · all | 60 · 60 · 60 |
| Overlays | 5 · 19 | 576 | 19/19 · all | 60 · 60 · 54 |
| Shadows | 8 · 25 | 7,776 | 25/25 · all | 60 · 60 · 60 |
| Glass · filters · blend | 7 · 24 | 3,240 | 24/24 · all | 60 · 60 · 60 |
| Textures | 9 · 28 | 16,200 | 28/28 (1 a named no-op) · all | 60 · 59 · 57 |
| Section shapes | 9 · 28 | 7,776 | 28/28 · all (method, motion same **by design**) | 60 · 60 · 45 |

</details>

- **Valid** = every declaration accepted by the browser (`CSS.supports`); **painted** = at least two colours inside the stage;
  **visibly distinct** = ≥ 0.6% of pixels moved by > 8/255 (RULE T). Motion is proven separately: an animated demo must show
  different frames (it does, in every family that moves). Each check was **mutation-proven**: blank bands → "not painted"
  0/28; invisible wave layers → "same look"; a stage outline / hash comparison / one-in-97 sampling each let a broken
  demo pass before it was fixed (R-2 ledger R2-4 … R2-13).
- Repeats among random combinations are explained, not hidden: combinations that differ only in a by-design axis, in an
  axis that does not apply (direction on a flat tint, ink on noise), or a named no-op.
- **What the builder must know (found by the proof):** by-nature NO-OPS to steer users away from — light ink × multiply,
  dark ink × screen, an overlap deeper than the edge it covers (it hides the shape); DEPENDENT axes — a radial's shape /
  position, a scrim's direction, noise settings vs drawn patterns; and three ways to draw one edge (clip-path · mask · SVG)
  that must stay identical.

**ACROSS FAMILIES, ON ONE BLOCK (RULE MAP 3b — `scripts/uat/r2-stack.js`, `specimens/stack.html`, `stack-proof.json`).**
40 random hero blocks, each stacking a base (colour / linear / radial / conic) + photo + overlay (tint · scrim · pattern, with a
blend) + texture (grain · dots · stripes) + a shaped edge (clip-path or mask) + a band shadow + a glass or solid card with
its own shadow + a solid or gradient heading; every ingredient it uses ABLATED (rendered without it, in the same place):
**213 ablations · 0 invalid declarations · 10 clashes, all explained:**
- **9 / 9 — a box-shadow ON a shaped band vanishes** (the edge clips it): AREA V bug **V-10**, confirmed in every case. The
  same shadow as a `drop-shadow` on a WRAPPER never vanished — the fix is proven.
- **1 — a white pattern overlay with `multiply` draws nothing**: the by-nature no-op of textures, now seen across families.
Every other ingredient stayed visible on top of all the others. Measurement traps found and fixed on the way: shots taken
before a data-URI texture decoded (R2-17 — retaken until stable), and tiles compared at different sheet positions
(R2-18 — ablations rendered in ONE stage).

**EVERY LEVEL, NESTED, CASCADING BOTH WAYS (RULE MAP 3c — `scripts/uat/r2-nest.js`, `specimens/nest.html`, `nest-proof.json`).**
40 random trees in all four nestings (section → card → button → text ×9 · section → card → text ×11 · section → button →
text ×11 · section → text ×9), each level with its own mix, made the way THAT level needs (texture and gradient INSIDE the
letters via `background-clip: text`, a cut-corner button by `clip-path` with its shadow moved to a wrapper — the V-10 rule).
**161 ablations · 0 invalid · cascade DOWN 0 failures** (inherited text took the nearest level's colour and the section's
font every time) **· 0 clashes UP** (every ingredient at every level stays visible through its parents) · 2 named no-ops: a
tint the same colour as what shows through a glass card is invisible — the builder should warn when an overlay matches
what it covers.

**STATES, EFFECTS AND TRANSITIONS AT EVERY LEVEL (RULE MAP 3d — `scripts/uat/r2-states.js`, `specimens/states.html`).**
30 random trees (card hover: lift · glow · tint, and whether it DRIVES its button and words; button hover: darken · gradient
swap · grow, press, focus ring; words hover: underline · colour; timing: fast · slow · spring), driven with a REAL mouse and
keyboard: **133 checks, 0 failed** — the button's own hover shows inside a hovered card (UP), hovering only the card reaches
the button where it drives it (DOWN), press shows, **Tab always reaches the button with a ≥ 3px focus ring (WCAG 2.4.7)**,
and **with reduce-motion every transition is instant (WCAG 2.3.3)**. Two rules the BUILDER must keep, both found by the proof:
1. **A level's OWN state beats a state driven from above** — a parent-driven rule carries no specificity (`:where(…)`);
   without it the card's drive swallowed the button's own hover (mutation-proven: 4 failures come back).
2. **Base looks are never inline wherever a state may change them** — an inline background beat every `:hover` rule, so a
   card's tint and a button's gradient swap could never show.

## Step 4 — the gap check (2026-10-03): everything the crawl collected, against this map

**How:** `scripts/research/r2-gap.js` matches 71 named techniques across **6,449 items** (every R-2 CodePen pen with its full code,
every tool-site page's drawn styles, every live site's surface record) → `gap-check.json`; and, because a hand-written list omits
what nobody thought of, `scripts/research/r2-census.js` counts **every CSS property, function and SVG element** used by ≥ 8 of
**4,131 pens** (253 · 68 · 25) → `census.json`, read line by line against the tables above. **Result: 32 techniques + 9 from the
census were missing — every one is now a value in `scripts/uat/r2-axes.js` and inside the proof; 0 left** (`cross-fade()` has 0
uses in the crawl: not a gap).

| Family | Added (pens that use it) |
|---|---|
| Colour | `light-dark()` + `color-scheme` (6 + 42) · `accent-color` (39) · the native `<input type=color>` (85) · 4- / 8-digit hex · `currentColor` · `transparent` |
| Gradients & backgrounds | aurora = blurred blobs (90) · a ring by `mask-composite` (40) · `to <corner>` · `image-set()` · `background-clip` on its own |
| Overlays | a spotlight at the pointer (30; 91 set a custom property from JS) · hover overlay · scroll-linked overlay · modal `::backdrop` (9) |
| Shadows | reflection `-webkit-box-reflect` (3) · outline letters `-webkit-text-stroke` (47) · the dark-theme scale · a shadow that follows the pointer (48) |
| Glass · filters | SVG primitives: gooey (39), duotone `feComponentTransfer` (49), `feDisplacementMap` (96), `feMorphology` (33), lighting / emboss (43), `feBlend` (121), sharpen `feConvolveMatrix` (9), SVG shadow `feOffset`+`feMerge` (22) · liquid glass `backdrop-filter: url()` (9) · progressive blur (11) · `@supports` + `prefers-reduced-transparency` fallback |
| Textures | halftone (63) · a WebGL shader (270) · `paint()` worklet (6) · SVG `<pattern>` (60) · a raster pixel tile + `image-rendering: pixelated` (14) · moving grain `steps()` (39) |
| Section shapes | scallop · drip · mountain · brush (Magnific's 548 dividers) · `shape()` · `path()` (px) · SVG `<clipPath>` objectBoundingBox (48 + 25) · `ellipse()` / `circle()` (140) · `inset()` / `rect()` round (103 + 20) · border-radius blob (35) · a tiled-gradient mask (10) · a gradient-filled divider (43) · `corner-shape` squircle / scoop / notch / bevel (5) · words wrapping a shape, `shape-outside` (19) · a scroll-linked edge |

**What the proof taught the builder (by nature, measured — the builder steers users away or hides the axis):**
- `numOctaves` above 3 is finer than a pixel at every grain and tile offered (3 = 6, measured twice) → the control stops at 3.
- `background-blend-mode` blends only layers INSIDE a box: an overlay behind words blends with the photo only through `mix-blend-mode`.
- Gooey (and any alpha filter) does nothing on an opaque picture — it works on shapes and letters with see-through space around them.
- A filter or `drop-shadow` follows what is inside the element it is on — on an opaque box the shadow falls outside (V-10 again).
- `paint()` and the EyeDropper exist only on a page served over HTTPS (secure context: about:blank has neither).
- `path()` takes pixels and cannot stretch → the builder emits `shape()` (rule 16); `background-attachment: local` differs only on a box that scrolls; a fixed picture is placed against the window.
- Dependent axes: an aurora uses only the stops' colours; direction is a scrim's only; reflection ignores offset / blur / spread / colour.

**Saturation and coverage (the numbers, from the collectors' logs):** CodePen tags SATURATED at 150 in a row adding nothing —
shadow p63 (326 pens), overlay p84 (501), noise p86 (512), mix-blend-mode p68 (407), blend-mode p57 (337), glassmorphism p48 (287),
texture p54 (319), clip-path p85 (633); read to the end — backdrop-filter 132, colorpicker 182, curves 77, grain 34, divider 86 +
dividers 11, gradient-text 85, gradient-border 61, mesh-gradient 6, frosted-glass 36. Tool sites complete — webgradients 661 pages, uiGradients 377 gradients, cssgradient.io 23,
ConvertFlow 18, Magnific 548 (depth-limited), Dribbble tag 100; Grabient saturated: 927 pages, 13 gradient techniques, the last new
at page 533, then 393 in a row with none. Dribbble search: blocked by "Human Verification" (stepped down, R2-24). Mobbin: shows
~40 screens, then needs an account — waiting for the user.

**Not yet in the proof** (in the tables above, still to add as code before "enough") — *as of step 3; step 4 has added every item
below except the colour PICKER controls (a UI, proven in AREA V's build) and the real-world pass:* colour — 4/8-digit hex,
`currentColor`/`transparent`, the picker controls (a UI, proven in AREA V's build); gradients — `to <corner>` keywords,
`image-set()`, `background-clip` other than text; overlays — hover / scroll states; shadows — hover state, dark-theme scale;
glass — the `@supports` fallback and `prefers-reduced-transparency`; textures — moving grain; shapes — `clip-path: path()` /
`shape()`, scroll-linked motion. And the real-world pass (cost of blur / grain / shadows on a 360px phone, Slow 3G).

## What is left for "enough"

- **Step 2 — an example per value** (`specimens/<family>.html`): every value above as a small, labelled, working piece of
  code, opened in a browser.
- **Step 3 — the combination proof** (`scripts/uat/r2-combos.js`): per family, random combinations of the axes generated,
  rendered in six headed windows, each checked to draw and to differ from the others.
- **Saturation** (the crawl): each CodePen tag and the Awwwards texture category read in shuffled order until a measured
  run adds no technique; anything they show that is NOT in a table above becomes a new value or axis here.
- **Taste · real world · people** (RULE MAP 5): a hand-picked best-in-class set per family from the crawl; blur / grain /
  shadow cost measured on a 360px low-cost phone profile on Slow 3G; the pilot schools later.
