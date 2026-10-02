# Family 6 · Hover / focus / press

Part of the [Motion & Effects Library](../LIBRARY.md). Every pointer, keyboard and touch reaction, and cursors. One
entry per technique, in the library's entry shape. Timings name the tokens of [11-rules](11-rules.md) (instant 70 ·
fast 150 · base 300 · slow 400 ms, proposed there; today's values are fast 120 · base 200 · slow 320). Written
2026-10-02 from the measured runs ([AGGREGATE](../../research-runs/AGGREGATE.md); raw hover probes in
`C:\Users\eyite\educo-research\runs\aw-coll-hovers.json` and siblings; frame strips in `…\shots\<source>\`), the research
files [04-hover-focus](../04-hover-focus.md), [08-component-effects](../08-component-effects.md) (CE.btn-press,
CE.field, CE.card, CE.tooltip), [07-shadows](../07-shadows.md) §2.10–2.12, [09-app-motion](../09-app-motion.md) A-7,
[motion-effects §4 / §6](../../motion-effects.md), and the demo list `educo-research\reading\demos\hv.json` (320 URLs:
155 Codrops demo pages, 141 CodePens, WCAG / APG / MDN examples). Every `file:line` was grepped again on 2026-10-02.

**How the live sites were probed** (`scripts/research/aw-measure.js` `hoverProbe`): up to 8 visible links / buttons /
cards per site, the mouse moved onto each, the computed style of the element, its first 12 descendants and its parent
read before and after 650 ms. "Changed" = any of transform, opacity, colour, background, shadow, clip, filter, border,
underline differs. Press (`:active`) was **not** driven on live sites; uiverse elements were pressed and clicked.

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) · re-count n = 678 (raw records) · uiverse n = 3,802

| What changes when the pointer arrives | Sites where at least one probed element does it (n 678) | Share of hovered elements (n 3,143) | uiverse Buttons (n 1,231) | Entry |
|---|---|---|---|---|
| Something moves (transform, self or a child) | **37 %** (248) | child 10 % · self 4 % · parent 1 % | 36 % (445) | 6.2–6.5 |
| Text colour | **28 %** (192) | self 10 % · child 6 % | 19 % (235) | 6.1 |
| Border / outline line | **27 %** (180) | self 9 % · child 6 % | 19 % (239) | 6.6 |
| Opacity (fade or dim) | **23 %** (154) | self 4 % · child 4 % · parent 1 % | 9 % (113) | 6.7, 6.8 |
| Background colour / image | **20 %** (136) | self 6 % · child 1 % | 22 % (266) | 6.1, 6.10 |
| Underline appears / grows | 7 % (46) | 2 % | — | 6.9 |
| Shadow | 5 % (36) | 2 % | **24 %** (297) | 6.11 |
| Filter (brighten, grayscale) | 3 % (17) | < 1 % | — | 6.12 |
| Clip / mask reveal | 1 % (9) | < 1 % | — | 6.13 |
| *Any* visible change on ≥ 1 probed element | **68 %** (436 / 643 sites with probes) | — | 76 % | — |

| Focus, press, touch and cursor | Measured | n | Entry |
|---|---|---|---|
| Tab stops with an outline or shadow while focused | **74 %** (re-count 73 %: 1,786 / 2,431; 1,746 by `outline`, 144 by `box-shadow`) | 732 sites | 6.15 |
| Sites where **no** probed Tab stop shows a ring | **20 %** (128 / 632) | 632 | 6.15 |
| CSS mentions `:focus-visible` | 38 % (277) | 732 | 6.16 |
| Skip link is the first Tab stop | 6 % (46) | 732 | 6.15 |
| Hover rules gated by `(hover: hover)` / `(pointer: fine)` | 23 % of all sites (171); **30 %** of sites that have `:hover` rules (161 / 542) — counted in the stylesheets on the **desktop** run (a CSS count, not a phone test; phone behaviour: re-measure pending, R-16) | 732 / 542 | 6.19 |
| uiverse: `:focus-visible` styled · hover gated · reduced motion | **1.3 %** (51) · 0.05 % (2) · 0.26 % (10) | 3,802 | 6.15, 6.19 |
| uiverse Buttons that react to a press (`:active`) | 39 % have an `:active` rule; press changes transform in 29 % (351), shadow 16 % (201) | 1,231 | 6.17 |
| Hovered element shows the hand cursor | **85 %** (2,481 / 2,912) | 678 | 6.20 |
| A custom cursor follows the pointer · native cursor hidden | **17 %** (124) · 5 % (40) | 732 | 6.21 |
| Hover transition on the element itself: median · instant | **300 ms** (IQR 200–450, n 758) · **74 %** change with no own transition | 2,912 | all |
| Easing on hover transitions | `ease` 39 % (293 / 758) · `ease-in-out` 57 · (.4,0,.2,1) 54 · `linear` 51 · `ease-out` 46 · (.23,1,.32,1) 22 · (.19,1,.22,1) 22 | 758 | all |
| CodePen `hover-effect` tag | changed on hover 52 % · keyframes 32 % · rAF 16 % · reduced motion 9 % · `:focus-visible` 7 % | 56 pens | — |
| Codrops hover / button / link / cursor demos with reduced motion · with a hover media query (cursor only) | **0 / 77** · 11 / 77 | 77 repos | 6.19 |

**Builder today, in one line** — 8 named effects (None, Lift, Grow, Press, Glow, Outline, Brighten, Soften) on every
block and every component item (`lib/interactions.ts:41-57`, field `hoverEffect` `lib/box-model.ts:110, 462`), one
emitter for canvas and export (`lib/box-export.ts:501`, `components/website/box/BoxCanvas.tsx:3586`), keyboard twin
built in (`lib/interactions.ts:101`), reduced motion strips the movement (`:106-108`). **Not** gated by `(hover: hover)`,
**no** `:active` press in the catalogue, and the Button / Link blocks export inline-styled `<a>` with no class
(`lib/box-export.ts:140-145`), so the design system's button and link states never reach them.

---

### 6.1 · Colour change (text or background tint)
- Family 6 · trigger hover | focus
- **What a visitor sees** — a link or button changes colour (darker fill, brand-coloured text) when the mouse is on it
  or it is tabbed to.
- **How it is done** — `transition: color var(--eu-dur-fast) var(--eu-ease-standard), background-color …`; the hover
  colour from the theme ramp (`--eu-color-primary-600`) or a **state layer**: a `::before` filled with `currentColor` at
  8 % hover / 10 % focus / 12 % press (M3), so one rule works on every variant and every theme (CE-13).
- **Timing** — hovered elements: median 300 ms; Shopify Editions `color, background-color … 0.3s cubic-bezier(.4,0,.2,1)`;
  M3 state layer `short` → `fast` + `standard`.
- **Phone** — no hover; the same colour appears on `:active` (6.17). Gate the `:hover` rule (6.19).
- **Reduced motion** — kept (colour is not motion, 2.3.3).
- **Accessibility** — contrast ≥ 4.5:1 in **both** states and all four themes; never the only cue (1.4.1).
- **Cost** — paint, tiny on a control. **How common** — text colour on 28 %, background on 20 % of sites (n 678); the
  most common single change on hovered elements (self:color 10 %).
- **Examples** — warhol-arts.webflow.io nav link `color 0.35s ease` (`awwwards-com-inspiration-titcket-page-warhol-arts-h1-250.jpg`) ·
  shopify.com/editions/summer2024 (`…shopify-summer-24-edition-hero-animation-shopify-editio-h1-250.jpg`) · alectear.com
  logo `background-color 0.1s` (`awwwards-com-inspiration-landing-alec-tear-h0-250.jpg`) · buttermax.net `0.4s (.25,.46,.45,.94)`
  (`awwwards-com-inspiration-reactive-cursor-1-h2-250.jpg`).
- **Surfaces** — Button, Link, nav, Card action, accordion header, alert actions · Educo web app (Tailwind `hover:bg-*`) ·
  RN: `Pressable` `style={({pressed}) => …}`.
- **Builder status** — **PARTIAL**: design-system hovers exist (`lib/educo-ui/components.ts:21-27` buttons, `:118`, `:244`,
  `:318`, `:348`, `:612`, `:622`) but reach only the Card action (`lib/educo-ui/registry.ts:84`); the Button and Link
  blocks get nothing (`lib/box-export.ts:140-145`); no state-layer token. **And:** `:318`, `:348`, `:622` (accordion
  header, accordion controls, navbar link) hover to `var(--eu-color-surface-2)`, a variable the **export never defines**
  (`tokensToCss`, `lib/educo-ui/tokens.ts:150-166`, emits only `bg` / `surface`; it exists only in the editor app's
  `app/globals.css:68`) → on the published page the hover background is lost, on the canvas it shows the *editor's*
  grey (canvas ≠ export).
- **Gap id** — HV-3, CE-13, **HV-30** (new, below).

### 6.2 · Lift / grow (the thing itself moves)
- Family 6 · trigger hover | focus
- **What a visitor sees** — a card rises a little, or a button grows slightly, under the mouse.
- **How it is done** — `transform: translateY(-.25rem)` / `scale(1.03)` with a transition on `transform`; the shadow
  that goes with a lift is pre-drawn on `::after` and faded in (10.14), never an animated `box-shadow`.
- **Timing** — housecaptain.co `transform 0.3s cubic-bezier(0,.79,.27,1)`; uiverse 300 ms; hovered median 300 → `base`
  + `out` (enter).
- **Phone** — dropped (gated); on a tap the card would stay lifted ("sticky hover").
- **Reduced motion** — transform dropped; shadow / colour kept.
- **Accessibility** — same look on `:focus-visible` and `:has(:focus-visible)` (6.16).
- **Cost** — compositor; the shadow repaint is the cost (10.14). **How common** — self:transform 4 % of hovered
  elements; uiverse Buttons 36 %, Cards 36 % (261 / 726).
- **Examples** — housecaptain.co header button (`awwwards-com-inspiration-navigation-house-captain-h0-250.jpg`) ·
  innovations.vareximaging.com (`awwwards-com-inspiration-cursor-interaction-1-h0-250.jpg`) · Josh Comeau 3D pushable
  button (hover `translateY(-6px)` 250 ms) · uiverse `Allyhere/strong-pug-22`.
- **Surfaces** — any block, Card, Card action, accordion item (`--elevated`, `--float`) · Educo web app (`hover:-translate-y-*`)
  · RN: none (no hover); Reanimated scale on press instead.
- **Builder status** — **HAVE** Lift / Grow (`lib/interactions.ts:43-46`) with keyboard twin (`:101`) and reduce (`:106-108`);
  **PARTIAL**: ungated, Lift paints a literal `rgba(0,0,0,.32)` shadow (`:44`) that **replaces** the block's resting shadow.
- **Gap id** — HV-1, HV-4, SH-5, MR-22.

### 6.3 · Image zoom inside its frame
- Family 6 · trigger hover | focus
- **What a visitor sees** — the photo in a news or staff card zooms in gently while the card's edges stay put.
- **How it is done** — `.frame{overflow:clip}` `.frame img{transition:transform var(--eu-dur-slow) var(--eu-ease-out)}`
  `@media (hover:hover){.frame:hover img{transform:scale(1.06)}}` `.frame:has(:focus-visible) img{transform:scale(1.06)}`.
  The zoom targets the `<img>`, not the block wrapper.
- **Timing** — duten.com product card `opacity, transform 0.8s cubic-bezier(.23,1,.32,1)`; award sites 0.4–0.8 s → `slow`
  + `out`.
- **Phone** — dropped; the photo is fully visible anyway.
- **Reduced motion** — dropped.
- **Accessibility** — decoration only; the card's link carries the focus ring.
- **Cost** — compositor, but one large image layer per card: fine for a few, avoid on a 30-photo gallery.
- **How common** — the largest single hover kind: child:transform on **10 %** of hovered elements (aggregate), transform
  of a child on 248 sites' probes combined with 6.4 / 6.5.
- **Examples** — duten.com brushed-steel cards (`awwwards-com-inspiration-texture-hover-reveal-duten-h4-250.jpg`) ·
  warhol-arts.webflow.io card (`…titcket-page-warhol-arts-h0-250.jpg`) · Codrops HoverEffectIdeas (hv.json).
- **Surfaces** — Image block inside a Card or link, Card component media, gallery · Educo web app (course / child cards) · RN: n/a.
- **Builder status** — **GAP**: no effect targets a child `<img>`; the image exports bare (`lib/box-export.ts:151-155`).
- **Gap id** — HV-5.

### 6.4 · Icon nudge
- Family 6 · trigger hover | focus
- **What a visitor sees** — the arrow in "Read more →" slides a few millimetres towards where the link goes.
- **How it is done** — `.cta .icon{transition:transform var(--eu-dur-fast) var(--eu-ease-out)}`
  `@media (hover:hover){.cta:hover .icon{transform:translateX(.25rem)}}` `.cta:focus-visible .icon{…}`; mirrored with
  `:dir(rtl)` (Arabic, RULE AF).
- **Timing** — 150–250 ms on award sites → `fast` + `out`.
- **Phone** — dropped. **Reduced motion** — dropped (or kept: 0.25 rem is below Apple's trigger size; dropping is simpler).
- **Accessibility** — the icon is `aria-hidden`; the words carry the meaning.
- **Cost** — compositor, one small layer. **How common** — counted inside child:transform (10 % of hovered elements);
  Codrops ArrowNavigationStyles, IconHoverEffects.
- **Examples** — superevilgeniuscorp.com service links (`awwwards-com-inspiration-3d-cursor-interaction-super-evil-genius-corp-h2-250.jpg`) ·
  Codrops IconHoverEffects (hv.json).
- **Surfaces** — Button / Link blocks with an icon, Card action, navigation · Educo web app links · RN: n/a.
- **Builder status** — **GAP** (no effect addresses a child icon).
- **Gap id** — HV-7.

### 6.5 · Label roll / text swap
- Family 6 · trigger hover | focus
- **What a visitor sees** — a button's word rolls up and the same word rolls in from below (or a second word replaces it).
- **How it is done** — two copies in a 1-line mask: the visible label and an `aria-hidden="true"` copy below it, both
  `translateY(-100%)` on hover. **Never** the copy in CSS `content: attr(data-hover)` — screen readers read it twice
  (9 of Codrops' 21 Creative Link Effects do).
- **Timing** — 300–450 ms, strong ease-out (`(.19,1,.22,1)` on award sites) → `base` + `out`.
- **Phone** — dropped. **Reduced motion** — dropped (instant colour change instead).
- **Accessibility** — one accessible name; the copy is `aria-hidden`; RULE AF: text in a second language may be longer —
  the mask must size to the longest.
- **Cost** — compositor. **How common** — split / span labels appear in the 19 % of sites with split headings (9.x);
  Codrops ButtonHoverStyles, motion.dev "rolling-text button" (the only motion.dev component example that reads reduced motion).
- **Examples** — fiddle.digital "Work / See all" (`awwwards-com-inspiration-canvas-grid-fiddle-digital-design-agency-h0-250.jpg`) ·
  labs.chaingpt.org menu (`awwwards-com-inspiration-webgl-footer-chaingpt-labs-h1-250.jpg`) · motion.dev rolling-text button.
- **Surfaces** — Button block, nav links · Educo web app: not used · RN: n/a.
- **Builder status** — **GAP** (no text-swap effect; correct by absence on the double-read rule).
- **Gap id** — HV-24; **TX-6** (shared with 9.7).

### 6.6 · Border / outline appears
- Family 6 · trigger hover | focus
- **What a visitor sees** — a thin brand-coloured line appears around the card or button.
- **How it is done** — `outline: .125rem solid var(--eu-color-brand); outline-offset: .125rem` (no layout shift), or a
  `border-color` change on an element that already has a transparent border.
- **Timing** — `fast`, `standard`; claytoncotterell.com `color 0.4s cubic-bezier(0,0,.63,1)`.
- **Phone** — gated; same line on `:active` is optional.
- **Reduced motion** — kept.
- **Accessibility** — a hover outline must not look like the focus ring at rest (F78) — use it on hover only, and keep the
  focus ring visibly stronger; ≥ 3:1 against the background (1.4.11).
- **Cost** — paint, tiny. **How common** — border changes on **27 %** of sites; uiverse Buttons 19 %.
- **Examples** — warhol-arts.webflow.io nav (`…h1-250.jpg`) · claytoncotterell.com/overview (`awwwards-com-inspiration-project-rollovers-clayton-cotterell-h3-250.jpg`) ·
  fiddle.digital cookie link (`…h6-250.jpg`).
- **Surfaces** — any block, Card, outline button · Educo web app · RN: n/a.
- **Builder status** — **HAVE** Outline (`lib/interactions.ts:51-52`); `.eu-btn--outline:hover` (`lib/educo-ui/components.ts:25`).
- **Gap id** — HV-1 (gating only).

### 6.7 · Fade / soften on hover
- Family 6 · trigger hover | focus
- **What a visitor sees** — the hovered thing turns slightly see-through (or its overlay appears).
- **How it is done** — `opacity: .82` with `transition: opacity var(--eu-dur-fast)`.
- **Timing** — chaingpt.org `opacity 0.2s ease`; restaurant-amici.com `opacity 0.3s (.23,1,.32,1)` → `fast`.
- **Phone** — gated. **Reduced motion** — kept (opacity is not motion).
- **Accessibility** — a faded label can fall below 4.5:1 — fade pictures, not text.
- **Cost** — compositor. **How common** — opacity changes on 23 % of sites; in **51 %** of sites' sampled `:hover` rules.
- **Examples** — restaurant-amici.com cookie button (`awwwards-com-inspiration-hover-buttons-amici-h4-250.jpg`) ·
  chaingpt.org menu button (`awwwards-com-inspiration-webgl-robot-interaction-chaingpt-blockchain-ai-h7-250.jpg`).
- **Surfaces** — any block · Educo web app (`hover:opacity-*`) · RN: `TouchableOpacity`-style pressed opacity (6.17).
- **Builder status** — **HAVE** Soften (`lib/interactions.ts:55-56`), ungated.
- **Gap id** — HV-1.

### 6.8 · Group hover — dim the others
- Family 6 · trigger hover | focus
- **What a visitor sees** — pointing at one teacher's card makes the other cards fade back, so the chosen one stands out.
- **How it is done** — `.grid:has(> .card:hover) > .card:not(:hover){opacity:.6}` plus the `:has(:focus-visible)` twin,
  in its own rule (an unsupported `:has()` voids the whole rule); anchored narrowly with `>`.
- **Timing** — `fast`, `standard`.
- **Phone** — dropped (a tap must not dim the page). **Reduced motion** — kept (opacity).
- **Accessibility** — dim the **images**, never text below 4.5:1.
- **Cost** — opacity is compositor; `:has()` re-runs on DOM changes under the anchor — keep the anchor small.
- **How common** — parent:opacity on 1 % of hovered elements; `:has()` in **22 %** of sites' CSS (159 / 732).
- **Examples** — warhol-arts.webflow.io card grid (`…h0-250.jpg`, parent opacity) · kffein.com/en/contact
  (`awwwards-com-inspiration-kffein-contact-page-h3-250.jpg`) · madebyanalogue.co.uk/studio.
- **Surfaces** — grid of Cards / staff / courses · Educo web app dashboards · RN: n/a.
- **Builder status** — **GAP** (no group selector is emitted; `:has(` appears only in the keyboard twin, `lib/interactions.ts:101`).
- **Gap id** — HV-9.

### 6.9 · Underline grows (or thickens)
- Family 6 · trigger hover | focus
- **What a visitor sees** — under a menu link, a line draws itself from left to right.
- **How it is done** — one-line nav: a `::after` line `transform: scaleX(0 → 1)`, `transform-origin` left on enter and
  right on leave, different easing in and out (Codrops LineHoverStyles: `(.7,0,.2,1)` / `(.4,1,.8,1)`); links inside
  paragraphs: `background: linear-gradient(currentColor 0 0) left bottom / 0% .1em no-repeat` → `100% .1em` (wraps);
  cheapest: `text-decoration-thickness` change.
- **Timing** — gsoft.com `color 0.2s ease-out`; Codrops 300–500 ms → `base` + `out`.
- **Phone** — gated. **Reduced motion** — scaleX is small and decorative: show the full line at once.
- **Accessibility** — a link inside text must be distinguishable **at rest** by more than colour (1.4.1) — the grow is
  decoration, not the cue.
- **Cost** — compositor (scaleX) or paint (background-size), both tiny.
- **How common** — underline change on 7 % of sites; `text-decoration`/underline in **31 %** of sites' sampled hover rules.
- **Examples** — gsoft.com footer link (`awwwards-com-inspiration-gsoft-hover-effects-h1-250.jpg`) · neundex.com
  (`awwwards-com-inspiration-sketches-hover-neundex-portfolio-2023-h0-250.jpg`) · Codrops LineHoverStyles (15 styles) and
  CreativeLinkEffects (21), hv.json.
- **Surfaces** — Link block, navigation, footer · Educo web app (`hover:underline`) · RN: n/a.
- **Builder status** — **PARTIAL**: `.eu-link:hover{text-decoration-thickness:.125rem}` (`lib/educo-ui/components.ts:297`)
  but no renderer emits `.eu-link` — the Link block is inline-styled (`lib/box-export.ts:140`).
- **Gap id** — HV-6, HV-23, HV-3.

### 6.10 · Fill sweep (colour slides across)
- Family 6 · trigger hover | focus
- **What a visitor sees** — the button fills with colour from one side, and its text flips to white.
- **How it is done** — `background: linear-gradient(var(--eu-color-brand) 0 0) left / 0% 100% no-repeat` →
  `background-size: 100% 100%`; or the one-property sliding highlight `box-shadow: inset 6.25rem 0 0 0 c`; or a
  `::before` with `scaleX` (compositor).
- **Timing** — fiddle.digital `background-size 0.45s cubic-bezier(.22,.31,0,1)` → `base`–`slow` + `out`.
- **Phone** — `:active` instant fill. **Reduced motion** — instant fill (colour is not motion).
- **Accessibility** — check contrast at both ends **and the half-way frame** (text half on brand, half off).
- **Cost** — paint on small elements; prefer the `::before scaleX` version. **How common** — `background-size` in 2 % of
  sampled hover rules; uiverse Buttons `::before transform` on hover 12 % (149).
- **Examples** — fiddle.digital title link (`…canvas-grid-fiddle-digital-design-agency-h0-250.jpg`) · victor.work primary
  button (`awwwards-com-inspiration-color-change-transition-victor-work-folio-20-h5-250.jpg`) · Codrops ButtonHoverStyles (hv.json).
- **Surfaces** — Button, nav item · Educo web app: none · RN: n/a.
- **Builder status** — **GAP** (not in `HOVER_EFFECTS`).
- **Gap id** — HV-6.

### 6.11 · Shadow grows on hover, shrinks on press
- Family 6 · trigger hover | focus | press
- **What a visitor sees** — the card seems to come closer under the mouse and to sink when pressed.
- **How it is done** — one step up the elevation scale from the block's **own** resting shadow on hover, one step down on
  press (deck Rule #5.7); built as a pre-drawn `::after` whose opacity fades (10.14). Shadow look and tokens: 10.1.
- **Timing** — Google "OK, got it" `box-shadow 0.2s ease`; moooi.com `box-shadow 0.2s (.445,.05,.55,.95)` → `fast`.
- **Phone** — the press half is kept (`:active`). **Reduced motion** — kept (not motion).
- **Accessibility** — `box-shadow` is forced to `none` in forced colours: never the only state cue.
- **Cost** — an animated `box-shadow` repaints every frame — fine on a button, costly on a card grid.
- **How common** — shadow on 5 % of live sites, but **24 %** of uiverse Buttons and 19 % of Cards (hover) and 16 % of
  button presses.
- **Examples** — google.com/search/howsearchworks (`awwwards-com-inspiration-hover-search-through-time-1-h1-250.jpg`) ·
  vivalalabia.com (`awwwards-com-inspiration-3d-object-interaction-viva-la-labia-h0-250.jpg`) · Tobias Ahlin "animate
  box-shadow with silky smooth performance" (sh.json).
- **Surfaces** — Card, Button, accordion `--elevated` / `--float` · Educo web app (`hover:shadow-*`) · RN: n/a (no hover).
- **Builder status** — **PARTIAL**: Lift and Glow **replace** the resting shadow (`lib/interactions.ts:43-50`); the
  elevated accordion does it right, sm → md (`lib/educo-ui/components.ts:385-386`); nothing shrinks on press.
- **Gap id** — SH-5, SH-6, HV-4.

### 6.12 · Brighten / filter on hover
- Family 6 · trigger hover | focus
- **What a visitor sees** — a photo or button gets slightly brighter, or a grey photo turns to colour.
- **How it is done** — `filter: brightness(1.06) saturate(1.05)`; `grayscale(1) → grayscale(0)`.
- **Timing** — map.newworld.com `color, filter 0.35s ease-in-out`; roulete.webflow.io `filter 0.2s ease-in-out` → `fast`.
- **Phone** — gated. **Reduced motion** — kept (not motion; but no animated *blur*, Apple).
- **Accessibility** — a filter disappears in forced colours (fine: decoration).
- **Cost** — `filter` re-rasterises; fine on small elements, not on a gallery of 40.
- **How common** — 3 % of sites (self:filter < 1 % of hovered elements); filter in 9 % of sampled hover rules.
- **Examples** — map.newworld.com nav (`awwwards-com-inspiration-new-world-map-transition-h2-250.jpg`) · roulete.webflow.io
  logo (`webflow-com-made-in-webflow-website-roulete-free-webflow-template-h0-250.jpg`) · lironmoran-interiors.com
  "invert colour image hover".
- **Surfaces** — any block, Image, alert action · Educo web app · RN: n/a.
- **Builder status** — **HAVE** Brighten (`lib/interactions.ts:53-54`); alert action `filter: brightness(1.06)`
  (`lib/educo-ui/components.ts:243`); grayscale-to-colour **GAP**.
- **Gap id** — HV-1; grayscale → 10.11.

### 6.13 · Reveal on hover (caption or overlay)
- Family 6 · trigger hover | focus | (touch: shown)
- **What a visitor sees** — a caption slides up over a photo, or a coloured overlay with a title fades in.
- **How it is done** — the caption is always in the DOM; on `(hover: hover)` it is moved out and comes back on
  `:hover` / `:focus-within`; under `(hover: none)` it is **shown by default**; clip-path / mask reveals for the dramatic
  version. A focusable child is never left at `opacity: 0` (use `visibility` / `inert`).
- **Timing** — findworkhappiness.com `clip-path 0.65s cubic-bezier(.19,1,.22,1)` → `slow` + `out`.
- **Phone** — swapped: the caption is visible from the start.
- **Reduced motion** — fade, no slide.
- **Accessibility** — never hide real information (name, date, price) behind hover; if it is content, 1.4.13 (dismissible,
  hoverable, persistent). Codrops Caption Hover Effects fail 2.4.7 (invisible focusable links).
- **Cost** — compositor (transform) or Chromium-composited clip-path.
- **How common** — clip / mask on 1 % of sites' probes; clip-path in 43 % and mask in 32 % of sites' CSS overall (used
  far more for scroll and transitions than hover).
- **Examples** — findworkhappiness.com mask reveal (`awwwards-com-inspiration-mask-reveal-the-search-for-work-happiness-h6-250.jpg`) ·
  duck.school/en contact button (`awwwards-com-inspiration-duck-rain-interaction-h3-250.jpg`) · Codrops
  CaptionHoverEffects / GridItemHoverEffect (hv.json).
- **Surfaces** — gallery, Card with a photo, staff grid · Educo web app: none · RN: n/a (shown).
- **Builder status** — **GAP**.
- **Gap id** — HV-8, HV-21.

### 6.14 · Hover card / tooltip (hint on hover and focus)
- Family 6 · trigger hover | focus | (touch: long-press or tap)
- **What a visitor sees** — after a short pause on an icon or a name, a small card or label appears beside it; it stays
  while the mouse moves onto it; Escape closes it.
- **How it is done** — `<button interestfor="tip-1">` + `<div id="tip-1" popover="hint">` (Chromium 142+): the browser
  handles delay (`interest-delay: .25s .15s`), hover **and** keyboard focus, Escape, and pointer travel; fallback: a
  click-to-open `popover` (toggletip) that works everywhere. Entrance with `@starting-style` (family 5).
- **Timing** — 250 ms delay, `fast` fade, exit shorter; uiverse tooltips 300 ms (IQR 300–300).
- **Phone** — toggletip (tap) or the text inline. **Reduced motion** — fade only.
- **Accessibility** — 1.4.13 by construction; `role="tooltip"` / `aria-describedby`; **0 of 62 uiverse tooltips open on
  keyboard focus**, 0 use `role="tooltip"`.
- **Cost** — none (native). **How common** — uiverse 62, freefrontend 32, Codrops 9 posts; anchor positioning in 8 % of
  live sites' CSS (62).
- **Examples** — MDN "Using interest invokers"; `mfreed7/interestfor` polyfill test; Codrops "Playful Little Tooltip Ideas";
  uiverse `Mohammad-Rahme-576/hard-starfish-64`.
- **Surfaces** — future Tooltip / Hover-card component, glossary terms, icon buttons · Educo web app help icons · RN:
  long-press + `accessibilityHint`.
- **Builder status** — **GAP** (0 hits `tooltip`, `popover`, `interestfor` in `lib/`).
- **Gap id** — HV-12.

### 6.15 · The focus ring
- Family 6 · trigger focus (keyboard)
- **What a visitor sees** — pressing Tab, a clear ring jumps from link to link and button to button; clicking with a mouse
  does not leave a ring behind.
- **How it is done** — `:focus-visible{outline:.125rem solid var(--bx-focus, var(--eu-color-brand));outline-offset:.125rem}`
  `:focus:not(:focus-visible){outline:none}`; an `outline` (survives forced colours) — a `box-shadow` ring only **beside**
  a transparent outline; on photo or brand bands a two-colour ring (C40: two colours ≥ 9:1, each ≥ 2 px); grows with text
  (`rem` or `max(2px,.08em)`); sticky bars set `scroll-padding-top` so focus is never hidden under them (2.4.11).
- **Timing** — appears **at once**; an optional `outline-offset` grow at `fast` only embellishes it (M3 grows 25 % of 600 ms).
- **Phone** — Android with a keyboard, tablets with a keyboard case: same ring.
- **Reduced motion** — the ring stays; only its grow animation is dropped.
- **Accessibility** — 2.4.7 (AA), 2.4.11 (AA), 2.4.13 (AAA: ≥ 2 px perimeter, 3:1 change), 1.4.11 (3:1), F78.
- **Cost** — none. **How common** — **74 %** of live Tab stops show an outline or shadow (recount 73 %; 98 % of those by
  `outline`, many being the browser's own `auto` ring); on **20 %** of sites no probed stop showed any; skip link first on 6 %.
  *Caveat (measurement):* "visible" = an outline with width > 0 **or any non-`none` box-shadow** — a resting card shadow
  counts as a ring, and a focus shown only by colour counts as none.
- **Examples** — sites where every probed stop had a ring: restaurant-amici.com (dashed 2.4 px), alectear.com (solid
  1.6 px white), accordion.net.au / fiddle.digital / duten.com (browser `auto` ring) · skip link first: shopify.com/editions/summer2024,
  ideology.it, daveholloway.uk, fitsole.shop/about · Sara Soueidan's focus-indicator guide; `@atlaskit/focus-ring`.
- **Surfaces** — every focusable thing in builder export, canvas, Educo web app · RN: tablets with a keyboard get the
  platform focus highlight; `focusable` + a visible style on custom `Pressable`s.
- **Builder status** — **HAVE** the base ring (`lib/educo-ui/base.ts:107-108`), per-band colour `--bx-focus`, sticky
  `scroll-padding-top` (`lib/box-model.ts:5872`). **GAP (defect)**: inputs / select / textarea, accordion header, accordion
  search and controls set `outline:none` and draw focus with `box-shadow` only (`lib/educo-ui/components.ts:49, 320, 345,
  349`) → invisible in forced colours; input ring is a pale `primary-100` tint (3:1 unmeasured). **Educo web app — GAP
  (defect)**: the shared `Button` uses `focus:outline-none focus:ring-2` (`components/shared/Button.tsx:29`) — a
  `box-shadow` ring that shows on **mouse** click too and vanishes in forced colours; `focus:ring` in 79 files,
  `focus:outline-none` in 32, `focus-visible:` in **0** files under `components/shared` and `app`.
- **Gap id** — HV-15, HV-16, HV-19, HV-20, SH-7, **HV-29** (new, web app).

### 6.16 · Keyboard twin of every hover (`:focus-visible`, `:has(:focus-visible)`)
- Family 6 · trigger focus (keyboard)
- **What a visitor sees** — tabbing to a card's link lifts the card exactly as the mouse would.
- **How it is done** — the hover look is emitted on three **separate** rules: `X:hover`, `X:focus-visible`,
  `X:has(:focus-visible)` (so an unsupported `:has` drops only its own rule); `:focus-within` would also fire on mouse
  focus — `:has(:focus-visible)` does not.
- **Timing** — same token as the hover.
- **Phone** — n/a (no keyboard) — but this is the rule that stays **outside** the `(hover: hover)` gate.
- **Reduced motion** — as the hover.
- **Accessibility** — 2.4.7; hover-only affordances fail keyboard users; never make decorative boxes tabbable to get it.
- **Cost** — none. **How common** — `:focus-visible` in 38 % of live sites' CSS but only **1.3 %** of uiverse elements;
  Codrops: Creative Link Effects pairs every `:hover` with `:focus` (44 rules), Line Hover Styles 0 of 15.
- **Examples** — Codrops CreativeLinkEffects; keikku.health and 14islands.com (gating + `:focus-visible` + reduced motion);
  MDN `:focus-visible`.
- **Surfaces** — every hover effect, block and component item · Educo web app (Tailwind `focus:` today — 6.15).
- **Builder status** — **HAVE** (`lib/interactions.ts:98-103`; items share it via `itemEffectsCss`, `:192-195`).
- **Gap id** — none (the model to keep).

### 6.17 · Press feedback (`:active`, state layer, slight shrink)
- Family 6 · trigger press (finger down / mouse down / Space)
- **What a visitor sees** — the instant a finger touches a button, it darkens a little and dips, so the person knows the
  tap was received.
- **How it is done** — `.btn:active{transform:translateY(.0625rem) scale(.98)}` at `instant` in, `fast`–`base` out
  ("fast in, slow out"; Comeau press 34 ms, release 600 ms); a 12 % state layer (`::before` `currentColor`); visible ≥
  225 ms on a quick tap (M3); act on **release** (2.5.2). Once a real press exists, remove Android's grey flash on that
  element only (`-webkit-tap-highlight-color: transparent`). Native: `Pressable` `android_ripple={{color}}` +
  `style={({pressed}) => pressed && {opacity:.85}}`, optional Reanimated scale 0.97.
- **Timing** — M3 pressed layer 105 ms; Comeau 34 / 600 ms → `instant` in, `base` out, `standard`.
- **Phone** — **kept — it is the only feedback a phone sees.**
- **Reduced motion** — the shrink is dropped; the colour / state layer stays.
- **Accessibility** — HIG "always include a press state for a custom button"; Space / Enter fire `:active` on `<button>`;
  2.5.2 Pointer Cancellation; targets ≥ 24 × 24 CSS px (2.5.8) — 44 / 48 on native.
- **Cost** — compositor + a small paint. **How common** — uiverse Buttons: `:active` rule in **39 %**, press changes
  transform in 29 % and shadow in 16 %; live sites: not driven. Native Educo app: **1 of 192** `Pressable`s has a pressed
  style, **0** `android_ripple`.
- **Examples** — Josh Comeau 3D pushable button; material-web ripple / state layer source; motion.dev `js-press`;
  uiverse `Allyhere/strong-pug-22`.
- **Surfaces** — every button and tappable card; Educo web app (Tailwind `active:` in 57 files, **not** in the shared
  `Button.tsx`) · RN: shared pressable (AM-4).
- **Builder status** — **PARTIAL**: `.eu-btn:active{transform:translateY(1px)}` (`lib/educo-ui/components.ts:18`) — a
  pixel (Core Rule 16), only on `.eu-btn`; the catalogue's "Press" is a **hover** look (`lib/interactions.ts:47-48`);
  grep `:active` in `lib/interactions.ts`: 0; tap highlight: 0 hits in `lib/`. Native: **GAP** (192 `<Pressable`, 1 pressed
  style, 0 `android_ripple` in `apps/mobile`, grepped).
- **Gap id** — HV-2, HV-17, HV-22, HV-27, CE-2, AM-4.

### 6.18 · Ripple
- Family 6 · trigger press
- **What a visitor sees** — a circle of light spreads from where the finger touched.
- **How it is done** — web: JS reads the pointer position, a pseudo-element scales from it and fades (M3: wait 150 ms
  after touch-down so a scroll is not a press, grow 450 ms, min 225 ms, fade 375 ms; cancel on `pointercancel`); native
  Android: `android_ripple`, zero JS per frame.
- **Timing** — M3 numbers above → native only; on the web a state layer (6.17) gives the same "it registered" cue.
- **Phone** — the native ripple is the most familiar Android feedback and the cheapest.
- **Reduced motion** — kept (M3: ripple is feedback); off in forced colours (M3 does nothing there).
- **Accessibility** — never the only state signal.
- **Cost** — web: JS per press; native: none. **How common** — Material sites; freefrontend hover / ripple collection 155 items.
- **Examples** — material-web `ripple/internal/ripple.ts`; Codrops ClickEffects (19 tap animations).
- **Surfaces** — native app (yes) · Educo web app / builder (only if a Material-personality theme asks, RULE P).
- **Builder status** — **GAP by choice** (0 hits `ripple` in `lib/`).
- **Gap id** — HV-11, AM-4.

### 6.19 · Hover only where hover exists (`(hover: hover)` gate, sticky hover)
- Family 6 · trigger hover
- **What a visitor sees** — on a phone, a tapped card does **not** stay lifted after the finger leaves.
- **How it is done** — put every `:hover` rule inside `@media (hover: hover)`; leave the `:focus-visible` and
  `:has(:focus-visible)` rules **outside** it. Use `(hover: hover)` (the primary input), not `any-hover` (a tablet with a
  mouse in a drawer would turn sticky hover back on). Media queries decide **looks**, never event listeners — scripts use
  Pointer Events and `pointerType` per event.
- **Timing** — n/a.
- **Phone** — the reason for the rule.
- **Reduced motion** — independent.
- **Accessibility** — hover can never be the only way to anything (hybrids report `hover` while used by touch).
- **Cost** — none. **How common** — **23 %** of live sites (30 % of those with `:hover` rules); uiverse **2 of 3,802**;
  Codrops 11 of 77 have a pointer / hover query and it gates only the custom cursor. Tailwind v4 does it by default:
  the Educo web app's build wraps every `hover:` utility in `@media (hover:hover)` (verified in
  `.next/static/css/1bc715491a044250.css`, 9 such blocks).
- **Examples** — accordion.net.au/work, restaurant-amici.com, fiddle.digital, duten.com, alectear.com (aggregate
  examples); CSS-Tricks "Solving sticky hover states with @media (hover: hover)".
- **Surfaces** — builder export and canvas, design-system CSS · Educo web app (HAVE via Tailwind v4) · RN: n/a.
- **Builder status** — **GAP**: grep `hover: *hover` / `any-hover` / `pointer: *(fine|coarse)` in `lib/interactions.ts`,
  `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/`: **0**; the hover rule is emitted unconditionally
  (`lib/interactions.ts:101-103`); 24 `:hover` rules in `lib/educo-ui/components.ts` ungated.
- **Gap id** — HV-1, HV-18, CE-1, MR-6, HV-25.

### 6.20 · The pointer (hand) cursor on things that act
- Family 6 · trigger hover
- **What a visitor sees** — the mouse arrow turns into a hand over anything that does something.
- **How it is done** — links get it from the browser; `:is(button,[role=button],summary,label[for]){cursor:pointer}`;
  disabled → `not-allowed`; drag handles `grab` / `grabbing`; never `cursor: none` without an equivalent.
- **Timing** — instant. **Phone** — n/a. **Reduced motion** — n/a.
- **Accessibility** — a cue, not a requirement; never on non-interactive text.
- **Cost** — none. **How common** — **85 %** of hovered elements show the hand (2,481 / 2,912; the probe picks links and
  buttons).
- **Examples** — every site in the runs.
- **Surfaces** — builder export, Educo web app (`cursor-pointer` in the shared `Button`), builder chrome (drag handles).
- **Builder status** — **HAVE** (`lib/educo-ui/base.ts:111`; `.eu-btn` `lib/educo-ui/components.ts:15`, disabled `:19`).
- **Gap id** — none.

### 6.21 · Custom cursor that follows the pointer
- Family 6 · trigger hover (pointer move)
- **What a visitor sees** — a dot or ring trails the mouse and grows over links.
- **How it is done** — a fixed `aria-hidden` element with `pointer-events:none`, moved by `translate` in a rAF loop with
  lerp 0.15–0.2; started on the first `pointermove` of a mouse, stopped when settled; only under `(pointer: fine)` and
  `no-preference`; the system cursor is **never** hidden without an equivalent.
- **Timing** — lerp per frame, not a token; size change `fast`.
- **Phone** — dropped (no pointer). **Reduced motion** — dropped; system cursor.
- **Accessibility** — `cursor: none` hides the pointer from people who rely on its size / colour settings; 2.5.x not
  triggered (decoration).
- **Cost** — a forever rAF loop and a layer; JS. **How common** — **17 %** of live sites (124); native cursor hidden on
  5 % (40); of 220 followers measured, 205 normal blend, 10 `difference`.
- **Examples** — fiddle.digital (`string-cursor`) · vivalalabia.com · houseofdreamers.fr · stabondar.com · ryanstrzok.com
  (aggregate "cursor" examples) · Codrops AnimatedCustomCursor / GooeyCursor (hv.json).
- **Surfaces** — award-style portfolios only; **not** in the school catalogue by default (RULE P / RULE AF) · Educo web app: no · RN: n/a.
- **Builder status** — **GAP by choice**.
- **Gap id** — HV-10, HV-25.

### 6.22 · Magnetic button
- Family 6 · trigger hover (pointer near)
- **What a visitor sees** — as the mouse comes near, the button leans towards it; the label lags a little behind.
- **How it is done** — inside 0.7 × the button's width the button is pulled 0.3 × the pointer offset, smoothed lerp 0.1,
  label counter-moves 0.6× (Codrops `MagneticButtons` source); measure on `pointerenter`, never `getBoundingClientRect`
  per frame; loop stopped when settled.
- **Timing** — lerp; return `slow` + spring.
- **Phone** — dropped. **Reduced motion** — dropped.
- **Accessibility** — no magnetism on large elements (Apple); keyboard: none needed (decoration).
- **Cost** — JS rAF; the Codrops original runs forever on every page view and listens to `mousemove` only.
- **How common** — award sites (magnetism.fr, cuberto.com; survey §9); not counted separately.
- **Examples** — Codrops MagneticButtons (hv.json); cuberto.com.
- **Surfaces** — playful / bold personalities only, lazy JS · Educo web app: no · RN: n/a.
- **Builder status** — **GAP by choice**.
- **Gap id** — HV-10.

### 6.23 · Tilt / 3D card follows the pointer
- Family 6 · trigger hover (pointer move)
- **What a visitor sees** — a card tilts towards the mouse as if it were a physical object, with a glint of light.
- **How it is done** — `pointermove` → `--rx` / `--ry` in rAF; `transform: perspective(60rem) rotateX(var(--rx))
  rotateY(var(--ry))`, cap ≈ 8°; only `(hover:hover) and (pointer:fine)` and `no-preference`.
- **Timing** — follows the pointer; return `slow` + spring.
- **Phone** — dropped (a `deviceorientation` tilt would be 2.5.4 territory if it did anything). **Reduced motion** — dropped.
- **Accessibility** — multi-axis motion is an Apple vestibular trigger.
- **Cost** — compositor + JS; a 3D layer per card. **How common** — 3D in 267 uiverse elements (7 %); Codrops TiltHoverEffects.
- **Examples** — superevilgeniuscorp.com "3D cursor interaction" (`…super-evil-genius-corp-h2-250.jpg`) · Codrops
  TiltHoverEffects, ImageTiltEffect (hv.json) · motion.dev "tilt card".
- **Surfaces** — playful personality only · Educo web app: no · RN: no.
- **Builder status** — **GAP by choice** (a `rotate` exists, but static: `lib/box-export.ts:87`).
- **Gap id** — HV-10.

### 6.24 · Direction-aware and proximity hover
- Family 6 · trigger hover (pointer enter side / distance)
- **What a visitor sees** — an overlay slides in from the side the mouse entered; or a grid of dots grows as the mouse
  approaches.
- **How it is done** — CSS-only (four invisible edge triangles) or JS (`Math.atan2` of the entry point); proximity reads
  distance per pointer frame — measure once on `pointerenter`, not per frame.
- **Timing** — `base` + `out`.
- **Phone** — dropped (touch has no direction; show the overlay on tap or not at all). **Reduced motion** — fade.
- **Accessibility** — as 6.13.
- **Cost** — Codrops ProximityFeedback calls `getBoundingClientRect` on every `mousemove` — costly on a long page.
- **How common** — rare (Codrops DirectionAwareHoverEffect, ProximityFeedback; ribant.co "pointer-tracked panning").
- **Examples** — ribant.co/labs (`awwwards-com-inspiration-labs-gallery-with-pointer-tracked-panning-h1-250.jpg`) · Codrops
  DirectionAwareHoverEffect (hv.json) · CSS-Tricks "Direction-aware hover effects".
- **Surfaces** — portfolio galleries only.
- **Builder status** — **GAP by choice**.
- **Gap id** — HV-10, HV-25.

---

## New gap ids raised in this file

| Id | Plain description | Sort |
|---|---|---|
| **HV-29** | Educo **web app**: the shared `Button` draws focus with `focus:outline-none focus:ring-2` (`components/shared/Button.tsx:29`) — a `box-shadow` ring that also appears on mouse click and vanishes in Windows forced colours; `focus:ring` in 79 files, `focus:outline-none` in 32, `focus-visible:` in 0 (under `components/shared` and `app`). Switch the shared components to `focus-visible:` with a real outline (`outline-2 outline-offset-2`), so every screen that reuses them is fixed at once. | MUST — defect (2.4.7, F78) |
| **HV-30** | The accordion header, accordion controls and navbar link hover to `var(--eu-color-surface-2)` (`lib/educo-ui/components.ts:318, 348, 622`; also zebra / soft / bubble / folder / menu / alt fills at `:400, 402, 418, 438, 502, 509, 537, 565`), but `tokensToCss` never emits `--eu-color-surface-2` (`lib/educo-ui/tokens.ts:155`) — it exists only in the editor's `app/globals.css:68`. On the published page those hovers and fills resolve to nothing; on the canvas they show the editor's own grey whatever the site theme (canvas ≠ export). Emit `--eu-color-surface-2` from the site theme (e.g. the neutral ramp), and add the variable to the units / token guards. | MUST — defect |
| **CE-21** | `.eu-tab` / `.eu-tabs__*` (`lib/educo-ui/components.ts:609-615`) and `.eu-navbar__link` (`:622`) ship in every page's stylesheet but no renderer emits those classes (grep outside `components.ts`: 0). 08 recorded tabs as "0 hits `role="tab"`" — the CSS exists, unused. Either wire them to the Tabs / Navigation components or remove the bytes (RULE AF weight). The tab indicator, when wired, moves by `transform` (CE-8). | DECIDE |
