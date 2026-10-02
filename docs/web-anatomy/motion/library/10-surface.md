# Family 10 · Surface — shadows, elevation, glass, blend, filters

Part of the [Motion & Effects Library](../LIBRARY.md). The static look that motion builds on: how far a surface sits
from the page, what it is made of (solid, glass, tinted), and how its picture is treated. One entry per technique, in the
library's entry shape; timings (only where a surface changes) name the tokens of [11-rules](11-rules.md). Written
2026-10-02 from the measured runs ([AGGREGATE](../../research-runs/AGGREGATE.md); raw `shadows` lists per site in
`C:\Users\eyite\educo-research\runs\*.json`; the 104 getcssscan examples in `runs\getcssscan-box-shadows.json`), the
research files [07-shadows](../07-shadows.md), [04-hover-focus](../04-hover-focus.md) §5.5, [06-motion-rules](../06-motion-rules.md)
R2 / R4, [08-component-effects](../08-component-effects.md) §1.1, [motion-effects §4](../../motion-effects.md)
(glassmorphism, grain), the reading notes `educo-research\reading\F.md` (Josh Comeau "Next-level frosted glass") and the
demo list `reading\demos\sh.json` (79 URLs: generators, pens, design-system pages). Every `file:line` was grepped again
on 2026-10-02.

**Re-measured here (raw records, n = 678 sites; the runs folder was being re-written, so n differs from the aggregate's
732).** Every distinct `box-shadow` value each site's probed elements carried: **273 sites (40 %)** show at least one
real shadow; **733 distinct values** — **1 layer 528 (72 %)**, 2 layers 110, 3 layers 43, 4 + layers 45 (many of those are
Tailwind's transparent `0 0 0 0` placeholder layers, not real depth); **inset 108 (15 %)**; **negative spread 162
(22 %)**; blur ≥ 40 px 107 (15 %); **tinted (not grey) 122 values (17 %) on 66 sites (10 %)**; the rest pure black / grey.

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) · re-count n = 678 · uiverse n = 3,802 · getcssscan n = 104

| Surface technique | Measured | n | Entry |
|---|---|---|---|
| `mix-blend-mode` somewhere in the CSS | **41 %** (300) | 732 | 10.12 |
| `backdrop-filter` somewhere in the CSS | **40 %** (294) | 732 | 10.10 |
| A real `box-shadow` on a probed element | **40 %** (273) | 678 | 10.1 |
| — single-layer · two-layer · three + | 72 % · 15 % · 12 % of 733 values | 733 values | 10.1 |
| — negative spread (shadow kept under the box) | 22 % of values | 733 | 10.1 |
| — inset | 15 % of values | 733 | 10.6 |
| — tinted, not grey | 17 % of values · 10 % of sites | 733 / 678 | 10.2 |
| Most used shadow values (sites) | `0 0 0 1px /.1 + 0 1px 3px /.1` (18, Tailwind ring+sm) · `0 0 5px grey` (17) · `0 32px 68px /.3` (16) · `0 0 18px /.2` (12) · `-3px -3px 5px -2px` grey (10, neumorphic) | 732 | 10.4, 10.1, 10.15 |
| uiverse: a shadow changes on a state | **34 %** (1,295) · Buttons hover 24 % · press 16 % · Cards hover 19 % | 3,802 | 10.14 |
| uiverse: `filter` · `backdrop-filter` used | 454 (12 %) · 116 (3 %) | 3,802 | 10.13, 10.10 |
| getcssscan examples: 1 / 2 / 3–9 layers · inset · `0 0 0 Npx` ring · tinted · blur ≥ 50 px | 36 / 47 / 21 · 15 · 16 · 32 · 17 | 104 | 10.1–10.6 |
| A glass (backdrop-filter) bar held on screen | 7 % (51) | 732 | 10.10 |
| A filter changes while scrolling · on hover | 5 % (33) · 3 % of sites' probes (17) | 732 / 678 | 10.13 |
| Custom cursor using a blend mode | 15 of 220 followers (10 `difference`) | 220 | 10.12 |

**Builder today, in one line** — a four-step, two-layer, rem elevation scale (`lib/educo-ui/tokens.ts:87-92`), emitted as
`--eu-shadow-sm…xl` (`:163`) but written into blocks as the **literal** value (`lib/box-model.ts:1131`,
`lib/box-export.ts:86`); every layer is `rgba(0,0,0,…)`; one scale for all themes; glass exists on the Alert and Accordion
and the pinned-bar arrival; a photo overlay exists (`bgOverlay`, `lib/box-model.ts:329`); no `drop-shadow`, `text-shadow`,
blend mode, image filter, `forced-colors`, `prefers-reduced-transparency` or `prefers-contrast` anywhere in `lib/`
(grep: 0 each).

---

### 10.1 · Elevation scale (layered shadows, named by what the thing is)
- Family 10 · trigger none (static); changes on hover / press → 6.11
- **What a visitor sees** — cards sit just above the page, menus a little higher, dialogs highest — consistently, so the
  eye reads what floats over what.
- **How it is done** — 3–5 named steps (card / dropdown / dialog), each **two or three layers** — a tight, darker
  contact shadow plus a wide, faint ambient one — with **negative spread** on the large steps; one light source (x = 0,
  y down); built from a shadow-colour token (10.2) and a strength (10.3); never more than 3 layers on anything that
  repeats (each layer is a separate blur on a low-cost GPU).
  ```css
  --eu-shadow-md: 0 .25rem .5rem -.125rem oklch(from var(--eu-shadow-color) l c h / calc(.10 * var(--eu-shadow-strength))),
                  0 .125rem .25rem  oklch(from var(--eu-shadow-color) l c h / calc(.06 * var(--eu-shadow-strength)));
  ```
- **Timing** — static; a change of step is 6.11 / 10.14 at `fast`.
- **Phone** — kept; ≤ 3 layers; large blurs on many cards are the paint cost (Tecno / itel class).
- **Reduced motion** — kept (a shadow is not motion).
- **Accessibility** — a shadow is never the only boundary (forced colours turns `box-shadow` off; on a dark page it is
  invisible): a card also has a border, a 1 px ring or a surface-colour change (10.4).
- **Cost** — paint once; repaint only when animated. **How common** — **40 %** of sites carry a real shadow; 72 % of values
  are a single layer (the web is simpler than the design systems: M2 three layers, M3 two, Radix ring + 4, Open Props up to 7).
- **Examples** — top live value `0 0 0 1px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.1)` (18 sites; Tailwind `ring` + `shadow-sm`) ·
  keikku.health and fpp.net (Tailwind layered) · getcssscan #14–#19 by Stripe (`0 50px 100px -20px rgba(50,50,93,.25),
  0 30px 60px -30px rgba(0,0,0,.3)`) · Tobias Ahlin layered recipes · `https://smoothshadows.com/` (sh.json).
- **Surfaces** — every block (Inspector "Shadow": None / Soft / Medium / Strong / Bold), Card (`--flat` / `--raised`), Alert
  toast, accordion `--elevated` / `--float` · Educo web app (Tailwind `shadow-*`) · RN: `elevation` (Android) +
  `shadowColor/Offset/Opacity/Radius` (iOS) — 124 such props in `apps/mobile`, **29 with a literal `shadowColor: '#000'`**.
- **Builder status** — **HAVE** the scale (`lib/educo-ui/tokens.ts:87-92`, re-exported `lib/box-model.ts:2890`), per-block
  choice (`components/website/box/BoxInspector.tsx:58`, field `lib/box-model.ts:320`); **PARTIAL**: emitted as literals
  (`lib/box-model.ts:1131`, `lib/box-export.ts:86`), so a theme cannot retune a block's shadow; two layers, no negative spread.
- **Gap id** — SH-3, SH-4.

### 10.2 · Tinted shadow colour
- Family 10 · trigger none
- **What a visitor sees** — on a coloured band, shadows look like part of the scene instead of grey smudges.
- **How it is done** — one `--eu-shadow-color` in OKLCH from the brand-tinted neutral ramp's hue at low chroma and low
  lightness; re-tinted on a coloured band (`oklch(from var(--eu-color-brand) .3 .06 h)`); `color-mix(in oklab, …)` fallback.
- **Timing** — static. **Phone** — free. **Reduced motion** — n/a.
- **Accessibility** — none by itself.
- **Cost** — none. **How common** — **17 %** of live shadow values are tinted (10 % of sites); **32 of 104** getcssscan
  examples (Stripe's `rgba(50,50,93,…)` the best known).
- **Examples** — baseone.uk (tinted blue / teal shadows, re-count) · snackwithbenefits.com product page
  (`rgba(17,23,156,.07) 0 -13px 50px 3px`) · getcssscan Stripe #14–#21 · Josh Comeau Shadow Palette Generator ("tint shadow").
- **Surfaces** — all shadows; Educo web app (Tailwind `shadow-<color>/<alpha>` possible, unused) · RN: `shadowColor` token.
- **Builder status** — **GAP**: every step is `rgba(0,0,0,…)` (`lib/educo-ui/tokens.ts:88-91`); hard-coded shadow colours
  also at `lib/interactions.ts:44` (Lift), `lib/box-model.ts:6250` (`ARRIVE_SHADOW`), `:3559` (pager dot ring),
  `components/website/box/BoxInspector.tsx:386` (preview). The neutral ramp that could feed it exists
  (`lib/educo-ui/tokens.ts:95-98`).
- **Gap id** — SH-1, HV-4.

### 10.3 · Shadows in dark themes (stronger shadow, lighter raised surface)
- Family 10 · trigger setting (theme)
- **What a visitor sees** — in the Dark, Midnight and Purple themes, cards still look raised.
- **How it is done** — `--eu-shadow-strength` ×1 light, ≈ ×3 dark (Fluent ×2, Carbon .3 → .8, Atlassian 25 % → 50 %,
  Open Props 1 % → 25 %); raised / overlay surfaces lighten with their level
  (`color-mix(in oklab, var(--eu-color-surface), white calc(var(--lvl) * 3%))`, M3 overlay, Atlassian, Apple "elevated");
  a 1 px light ring on overlays.
- **Timing** — static. **Phone** — free.
- **Reduced motion** — n/a.
- **Accessibility** — text on the lighter surface still ≥ 4.5:1 — measure in every theme (Core Rule 17).
- **Cost** — none. **How common** — every design system with a dark theme does one or both; live sites not split by theme.
- **Examples** — Atlassian `@atlaskit/tokens` dark theme; Fluent 2 shadow tokens; M2 `ElevationOverlayProvider`.
- **Surfaces** — all four builder themes · Educo web app (dark / midnight / purple use hand-picked surfaces, not a level
  rule) · RN: `useTheme` surfaces.
- **Builder status** — **GAP**: one scale for every theme (`lib/educo-ui/tokens.ts:145`, `:163`); only `bg` and `surface`
  colour tokens (`:155`).
- **Gap id** — SH-2.

### 10.4 · Hairline ring (a 1 px shadow ring that is a border without layout)
- Family 10 · trigger none
- **What a visitor sees** — a crisp thin edge around a card or input, even on a background of nearly the same colour.
- **How it is done** — `box-shadow: 0 0 0 .0625rem <colour>` as the first layer of the elevation shadow (Radix, Atlassian
  overlay, Tailwind `ring`), **plus** a real `border` (or `outline`) where the edge must survive forced colours.
- **Timing** — static; a focus ring is 6.15, never this.
- **Phone** — free.
- **Reduced motion** — n/a.
- **Accessibility** — in forced colours a shadow ring disappears — a card that must read as a card keeps a 1 px border
  (`border-color: CanvasText` there); a ring at rest must not look like the focus ring (F78).
- **Cost** — negligible. **How common** — the **most used live shadow** (18 sites) is ring + small shadow; 16 of 104
  getcssscan examples use a `0 0 0 Npx` spread ring.
- **Examples** — Tailwind `ring-1 ring-black/10 shadow-sm` sites (keikku.health, fpp.net, marqeta.com) · Radix Themes
  `tokens/shadow.css` · getcssscan #21 (Stripe ring + shadow).
- **Surfaces** — Card, inputs, menus, dialogs · Educo web app (`ring-*` widely) · RN: `borderWidth: StyleSheet.hairlineWidth`.
- **Builder status** — **HAVE** via border: `.eu-card` has `border: 1px solid var(--eu-color-border)`
  (`lib/educo-ui/components.ts:35`); per-block border width / colour / style (`lib/box-model.ts:317-319`); no ring layer in
  the scale.
- **Gap id** — SH-7 (forced colours), SH-2 (dark ring).

### 10.5 · Glow (a coloured, zero-offset shadow)
- Family 10 · trigger none | hover | state
- **What a visitor sees** — a brand-coloured halo around a button or the open accordion item.
- **How it is done** — `box-shadow: 0 .5rem 1.5rem -.5rem color-mix(in oklab, var(--eu-color-brand) 55%, transparent)` (lifted
  glow) or `0 0 0 .25rem color-mix(…32%…)` (ring glow); layered **on top of** the resting shadow, never replacing it.
- **Timing** — on hover `fast`.
- **Phone** — the static glow is kept; hover glow gated.
- **Reduced motion** — kept.
- **Accessibility** — decoration only; never the only state or focus cue (a glow is a `box-shadow` → gone in forced colours).
- **Cost** — paint. **How common** — `0 0 5px grey` (17 sites), `0 0 18px /.2` (12) and baseone.uk's brand glows are the
  zero-offset kind; deck Rule #5.8 and the Startup personality.
- **Examples** — baseone.uk (`rgba(68,138,255,.6) 0 0 22px -4px`) · mango-media.eu (OKLCH glow layers) · getcssscan glow examples.
- **Surfaces** — Button, Card, accordion `--spotlight` · Educo web app (midnight / purple themes use `shadow-cyan/pink`) · RN: iOS `shadowColor` brand.
- **Builder status** — **PARTIAL**: Glow is a hover effect only (`lib/interactions.ts:49-50`, and it replaces the resting
  shadow); accordion `--spotlight` open ring (`lib/educo-ui/components.ts:587`); not in the per-block Shadow choice
  (`components/website/box/BoxInspector.tsx:58`).
- **Gap id** — SH-10, SH-5.

### 10.6 · Inset shadow (sunken well, pressed, inner edge)
- Family 10 · trigger none | press
- **What a visitor sees** — a panel that looks pressed into the page, or a button that sinks when pressed.
- **How it is done** — `box-shadow: inset 0 .125rem .25rem oklch(from var(--eu-shadow-color) l c h / .12)`; an inner
  edge `inset 0 -.125rem 0 var(--eu-color-brand)` (the underline accordion). Trap: an outer shadow list cannot transition
  to an `inset` list — the change is instant; put the inset on a pseudo-element or pad both lists to the same shape.
- **Timing** — press `instant`.
- **Phone** — kept (a press state). **Reduced motion** — kept.
- **Accessibility** — as 10.4: not the only cue.
- **Cost** — paint. **How common** — **15 %** of live shadow values; 15 of 104 getcssscan; Polaris "pressed = inset shadow".
- **Examples** — Polaris `shadow-inset-100/200`, `shadow-bevel-100`; getcssscan #14 / #15 (Stripe outer + inset highlight).
- **Surfaces** — Alert `--inset`, accordion `--underline` / `--switch`, pressed buttons · RN: n/a (no inset shadows; a darker
  fill instead).
- **Builder status** — **PARTIAL**: inside components only (`lib/educo-ui/components.ts:170`, `:392`, `:411-412`); no per-block step.
- **Gap id** — SH-11.

### 10.7 · Hard offset shadow (no blur — the "sticker" / neo-brutalist look)
- Family 10 · trigger none | hover (offset grows) | press (offset closes)
- **What a visitor sees** — a card with a solid, sharp-edged shadow offset down-right, like a paper cut-out.
- **How it is done** — `box-shadow: .35rem .35rem 0 <colour>` (one layer) or stacked 1-px steps for a long shadow
  (madebyanalogue.co.uk: `1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 …`); hover moves the box `translate(-.125rem,-.125rem)`
  while the offset grows; press `translate(.35rem,.35rem)` with the offset to 0.
- **Timing** — press `instant`, release `base`.
- **Phone** — kept (press). **Reduced motion** — keep the shadow, drop the translate.
- **Accessibility** — needs a border too; the colour offset must not be the only boundary.
- **Cost** — no blur: the cheapest shadow to paint.
- **How common** — madebyanalogue.co.uk (re-count, stacked); the alert "Hard shadow" design; playful / bold personalities (RULE P).
- **Examples** — madebyanalogue.co.uk/studio (aggregate example) · Educo Alert `--shadowed`.
- **Surfaces** — Card, Button, Alert, playful templates · RN: iOS `shadowRadius: 0`; Android: an offset solid view behind.
- **Builder status** — **PARTIAL**: Alert "Hard shadow" (`lib/educo-ui/alerts.ts:50`, CSS `lib/educo-ui/components.ts:174`);
  not a per-block option.
- **Gap id** — **SH-13** (new, below).

### 10.8 · `filter: drop-shadow()` (a shadow that follows the shape)
- Family 10 · trigger none
- **What a visitor sees** — a cut-out photo (a transparent PNG of a student, a mascot) or an icon casts a shadow in its own
  outline, not a rectangle.
- **How it is done** — `filter: drop-shadow(0 .25rem .375rem oklch(from var(--eu-shadow-color) l c h / .2))`; one function
  only (n chained = 2ⁿ − 1 shadows); the blur value is a standard deviation — **halve** the box-shadow token's blur.
- **Timing** — static.
- **Phone** — a filter re-rasterises the element and may take a layer: fine on a few images, not a gallery of 40.
- **Reduced motion** — n/a. **Accessibility** — decoration.
- **Cost** — paint + possibly a layer. **How common** — not separable in the runs (filter on hover 3 %); Tailwind v4 keeps a
  separate `--drop-shadow-*` scale for this reason.
- **Examples** — CSS-Tricks "Breaking CSS box-shadow vs drop-shadow" pens (sh.json); MDN `drop-shadow()`.
- **Surfaces** — Image block (transparent PNG / SVG), icons, shaped bands (`clip-path`) · RN: n/a.
- **Builder status** — **GAP** (grep `drop-shadow` in `lib/`: 0) — an image with transparency + the Shadow control draws a rectangle.
- **Gap id** — SH-9.

### 10.9 · Text shadow (a halo that keeps words legible over a photo)
- Family 10 · trigger none
- **What a visitor sees** — white words over a busy photo stay readable.
- **How it is done** — `text-shadow: 0 .0625rem .125rem oklch(0 0 0 / .45), 0 0 .75rem oklch(0 0 0 / .35)` — as a **bonus**
  on top of a scrim (10.11), which is what actually carries the contrast.
- **Timing** — static. **Phone** — cheap for headings; avoid big blurs on paragraphs.
- **Reduced motion** — n/a.
- **Accessibility** — a halo does not count toward a measured 4.5:1 unless the colour behind the glyph is measured with it;
  in forced colours `text-shadow` is removed (so is the photo — fine).
- **Cost** — paint, small. **How common** — `text-shadow` in 8 sites' sampled hover rules (static uses not counted).
- **Examples** — Smashing "A few interesting ways to use CSS shadows" (2023); Tailwind v4 `--text-shadow-*`; Open Props `--text-shadow-1…6`.
- **Surfaces** — Heading / Text over an image band, hero · RN: `textShadowColor/Offset/Radius`.
- **Builder status** — **GAP** (grep `text-shadow` / `textShadow` in `lib/`: 0).
- **Gap id** — SH-8.

### 10.10 · Glass (frosted `backdrop-filter`)
- Family 10 · trigger none | scroll (bar turns to glass on arrival, family 1)
- **What a visitor sees** — a bar or card that blurs whatever passes behind it, like frosted glass.
- **How it is done** — `background: color-mix(in oklab, var(--eu-color-surface) 60–72%, transparent);
  -webkit-backdrop-filter: blur(.75rem) saturate(1.5); backdrop-filter: …` with an **opaque** `@supports not` fallback;
  "thicker glass" (Comeau): put the blur on an over-tall child so it samples what is *about* to pass under, and raise the
  tint for legibility. Never animate the blur radius (Apple: no animated blur; heavy paint per frame).
- **Timing** — static; an arrival switches stepped, not scrubbed (MR-3).
- **Phone** — the heaviest paint in this family on a cheap GPU: small or held surfaces only, never a full-screen layer.
- **Reduced motion** — `prefers-reduced-transparency: reduce` → a solid surface (MR-18).
- **Accessibility** — text on glass must reach 4.5:1 over the **worst** content that can pass behind it — tint enough;
  forced colours: the glass becomes the system background.
- **Cost** — high (blur of everything behind, per frame while anything behind moves). **How common** — `backdrop-filter` in
  **40 %** of award sites' CSS; a glass bar held on screen on **7 %** (51); uiverse 116 elements.
- **Examples** — ideology.it (fixed glass navbar) · rblln.fr (compact glass header) · radiance.family (menu backdrop with
  noise) · tuxkarma.co overlay blur (aggregate examples) · Josh Comeau "Next-level frosted glass with backdrop-filter" (F.md).
- **Surfaces** — pinned header arrival (family 1), Alert `--glass`, Accordion `--glass`, dialog scrims · Educo web app:
  `backdrop-blur-sm` on the shared Modal overlay (AM-7) · RN: `expo-blur` `BlurView` (not installed; a solid surface instead).
- **Builder status** — **PARTIAL**: Alert `--glass` (`lib/educo-ui/components.ts:128`), Accordion `--glass` (`:436`), arrival
  keyframes animate `backdrop-filter` from 0 to `blur(.6rem)` per scroll frame (`lib/box-model.ts:6268-6269`); no
  `@supports` fallback, no reduced-transparency branch.
- **Gap id** — MR-3, MR-18, AM-7.

### 10.11 · Scrim / overlay over a photo
- Family 10 · trigger none
- **What a visitor sees** — a photo band darkened (or tinted with the brand colour) just enough that the words on it read.
- **How it is done** — a gradient or solid layer between the image and the content:
  `background: linear-gradient(oklch(0 0 0 / .55), oklch(0 0 0 / .2)), url(photo) center / cover`; contrast is
  **measured** against the darkest and lightest photo pixels under the text (Core Rule 17).
- **Timing** — static. **Phone** — free (one background layer).
- **Reduced motion** — n/a.
- **Accessibility** — 1.4.3 over the photo the user chose; the overlay is the reliable way, the halo (10.9) a bonus.
- **Cost** — none. **How common** — not counted by the runs (it is part of `background`); standard on every hero builder.
- **Examples** — CSS-Tricks "Getting deep into shadows" (scrims); every awwwards hero over video.
- **Surfaces** — any box with a background image, hero bands, Card media · Educo web app: hero banners · RN: an absolutely
  positioned `View` with a token colour and opacity.
- **Builder status** — **HAVE**: `bgOverlay` "overlay drawn over the image … for readability" (`lib/box-model.ts:329`),
  composed by `backgroundCss` (`:1016`), faded with the box (`:858-866`), the same composer on canvas and export
  (`lib/box-export.ts:74-79`). Contrast over the photo: **CHECK** (Core Rule 17 asks it be asserted).
- **Gap id** — none new (contrast assertion belongs to the page audit).

### 10.12 · Blend modes (text or cursor that inverts over what is behind)
- Family 10 · trigger none | hover | scroll
- **What a visitor sees** — a fixed logo or custom cursor that turns white over dark sections and black over light ones;
  a duotone photo in the brand colours.
- **How it is done** — `mix-blend-mode: difference` on a white element (inverts whatever is behind); `isolation: isolate`
  on the section to stop it leaking; duotone: `background-blend-mode: multiply` / `screen` of the photo with a brand colour,
  or an SVG `feColorMatrix`.
- **Timing** — static (the effect changes as content moves behind it).
- **Phone** — `mix-blend-mode` forces the element and what is behind it into a separate composite — fine for one logo,
  costly for many.
- **Reduced motion** — n/a.
- **Accessibility** — `difference` produces **unpredictable contrast** (mid-grey on mid-grey is invisible); never for
  body text or a control's only label; forced colours ignores it.
- **Cost** — compositing. **How common** — **41 %** of award sites mention `mix-blend-mode` (300); of 220 measured cursor
  followers, 15 use a blend (10 `difference`).
- **Examples** — superevilgeniuscorp.com (22 blend rules) · fiddle.digital (13) · warhol-arts.webflow.io (9) · duten.com ·
  madebyanalogue.co.uk/studio (re-count) · lironmoran-interiors.com "invert colour image hover" (aggregate).
- **Surfaces** — fixed logo over bands, custom cursor, duotone image presets · RN: none.
- **Builder status** — **GAP** (grep `mix-blend`, `blend` in `lib/`: 0 apart from the Alert "Duotone" design, which is a
  two-colour gradient, not a blend: `lib/educo-ui/alerts.ts:34`, `lib/educo-ui/components.ts:178`); the isolation it would
  need exists (`lib/box-model.ts:1073`).
- **Gap id** — **SH-14** (new, below).

### 10.13 · Image filters (grayscale → colour, blur, brightness)
- Family 10 · trigger none | hover | scroll
- **What a visitor sees** — staff photos in black-and-white that come to colour under the mouse; a blurred background photo
  behind a form.
- **How it is done** — `filter: grayscale(1)` → `grayscale(0)` on hover (6.12); a static `blur(.5rem)` on a decorative
  background image (better: export a pre-blurred small image — RULE AF bytes and no runtime blur).
- **Timing** — hover `fast`; scroll-linked filters `linear` (rare, costly).
- **Phone** — static filters are re-rasterised once; an animated filter repaints every frame — not on a phone gallery.
- **Reduced motion** — kept as static; no animated blur (Apple).
- **Accessibility** — a grayscale photo still needs `alt`; colour is never the only cue.
- **Cost** — paint / layer. **How common** — filter on 3 % of hover probes; filter changes on scroll on **5 %** (33); uiverse 454.
- **Examples** — angellotorres.com "Blur effect on hover" (aggregate) · map.newworld.com (filter + colour on nav) ·
  Codrops ThumbHoverSVGFilter (hv.json).
- **Surfaces** — Image block, staff grid, background images · RN: no runtime filters (pre-processed images).
- **Builder status** — **PARTIAL**: Brighten hover (`lib/interactions.ts:53-54`) and the Sharpen entrance (blur → sharp,
  `:141`); no per-image filter setting.
- **Gap id** — **SH-15** (new, below).

### 10.14 · Animate a shadow cheaply (fade a pre-drawn one)
- Family 10 · trigger hover | press | state
- **What a visitor sees** — the same as 6.11 — but smooth on a cheap phone.
- **How it is done** — the target shadow is drawn once on `::after` at `opacity: 0` and faded in; the element moves with
  `transform`; `border-radius: inherit` on the pseudo; no `will-change` on every card.
  ```css
  .card{position:relative;transition:transform var(--eu-dur-fast) var(--eu-ease-standard)}
  .card::after{content:"";position:absolute;inset:0;border-radius:inherit;z-index:-1;box-shadow:var(--eu-shadow-lg);
    opacity:0;transition:opacity var(--eu-dur-fast) var(--eu-ease-standard)}
  @media (hover:hover){.card:hover::after{opacity:1}} .card:focus-visible::after{opacity:1}
  ```
- **Timing** — `fast`, `standard`.
- **Phone** — kept for press; the reason this entry exists.
- **Reduced motion** — keep the shadow change, drop the transform.
- **Accessibility** — as 6.11.
- **Cost** — compositor (opacity) instead of a repaint per frame. **How common** — uiverse changes a shadow on a state in
  **34 %** of elements, almost all by animating `box-shadow` directly; M3 web builds every elevation level from two
  pseudo-elements this way.
- **Examples** — Tobias Ahlin "How to animate box-shadow with silky smooth performance" + demo (sh.json); material-web
  `elevation/internal/_elevation.scss`.
- **Surfaces** — every hover effect that changes a shadow, accordion items, cards · Educo web app (`transition-shadow`
  today) · RN: animate `opacity` of a shadowed underlay.
- **Builder status** — **GAP**: `box-shadow` is transitioned directly in `lib/interactions.ts:43, 49`,
  `lib/educo-ui/components.ts:16` (buttons), `:47` (inputs), `:385` and `:532` (accordion), `lib/educo-ui/base.ts:130`
  (every link and button).
- **Gap id** — MR-22, SH-6, HV-4.

### 10.15 · Neumorphism / claymorphism (soft extruded surfaces)
- Family 10 · trigger none | press
- **What a visitor sees** — buttons and cards that look pushed out of (or into) the same-coloured page, lit from the top-left.
- **How it is done** — element and parent share one colour; a light shadow top-left and a dark one bottom-right
  (`-3px -3px 5px -2px` light + `3px 3px 5px` dark); clay = one outer + two inset.
- **Timing** — press `instant` (shadows swap to inset — an uninterpolable list, so instant anyway).
- **Phone** — cheap. **Reduced motion** — n/a.
- **Accessibility** — the boundary is only a soft shadow: fails low-vision users and vanishes in forced colours; never for
  an input or a toggle's state; only with a real border or text inside.
- **Cost** — paint. **How common** — the `-3px -3px 5px -2px rgb(199,197,199)` + `0 0 12px 2px` pair on **10 sites** each
  (among the top 6 live values); CSS-Tricks "Neumorphism and CSS", Smashing "Claymorphism".
- **Examples** — the 10 sites carrying `rgb(199,197,199) -3px -3px 5px -2px` (aggregate shadow list) · clay.css.
- **Surfaces** — none by default; a playful personality preset at most, with a border (RULE P).
- **Builder status** — **GAP by choice** (07 §2.7).
- **Gap id** — none (decision recorded in 07).

### 10.16 · Grain / noise texture
- Family 10 · trigger none
- **What a visitor sees** — a fine film-grain texture over a flat colour band, so it looks printed rather than digital.
- **How it is done** — a tiny static SVG `feTurbulence` tile (or a 2–4 KB PNG) as a background layer at low opacity;
  `pointer-events: none`; never animated per frame (an animated grain is a full-screen repaint and a 2.3.1 risk if it
  flickers).
- **Timing** — static.
- **Phone** — a static tile is cheap; an SVG filter rendered live over the viewport is not — rasterise it.
- **Reduced motion** — static (already).
- **Accessibility** — keep the grain's luminance swing small so text contrast still holds over it.
- **Cost** — a few KB. **How common** — not counted by the runs; radiance.family's glass menu uses a `bg-noise` class
  (re-count example).
- **Examples** — radiance.family (`menu-backdrop bg-noise`) · motion-effects §4 "grain".
- **Surfaces** — band backgrounds (a background preset) · RN: an `Image` tile.
- **Builder status** — **GAP** (no texture among the background presets in `lib/educo-ui/backgrounds.ts`; grep `noise`,
  `feTurbulence` in `lib/`: 0).
- **Gap id** — **SH-16** (new, LATER).

---

## New gap ids raised in this file

| Id | Plain description | Sort |
|---|---|---|
| **SH-13** | Hard offset shadow (no blur) as a per-block shadow option for playful / bold personalities, with press closing the offset; today only the Alert "Hard shadow" design has it (`lib/educo-ui/alerts.ts:50`). | LATER (with RULE P) |
| **SH-14** | Blend modes: a `difference` logo / cursor and duotone image presets, inside `isolation: isolate`, never on body text or a control's only label (contrast is unpredictable). | LATER (DECIDE whether at all) |
| **SH-15** | Per-image filters (grayscale, grayscale → colour on hover, static blur exported as a pre-blurred file, not a runtime filter). | DECIDE |
| **SH-16** | Grain / noise texture as a static background preset (a few KB, rasterised, low luminance swing). | LATER |
