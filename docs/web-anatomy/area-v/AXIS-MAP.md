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
| Picker controls | spectrum square · hue strip · alpha strip · wheel · sliders (L C H) · text entry per notation · eyedropper · swatches · recent | canvas / gradients for the spectrum, pointer + keys on the thumb | partial ✅ (no alpha strip, no entry other than hex) | MAP |

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

**Not yet in the proof** (in the tables above, still to add as code before "enough"): colour — 4/8-digit hex,
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
