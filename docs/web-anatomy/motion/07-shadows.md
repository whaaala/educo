# 07 · Shadows — elevation, layered and coloured shadows, dark mode, text and drop shadows, performance

**Added 2026-10-02 (redo).** Box shadows done properly: how a realistic shadow is built (layers, one light source,
colour that matches the backdrop), elevation scales compared across nine design systems, glows and inset shadows,
what happens to shadows in dark mode and in Windows forced-colours mode, `text-shadow` and `filter: drop-shadow()`,
and what animating a shadow costs on a low-cost Android phone. Each technique is marked against the builder
(HAVE / PARTIAL / GAP) with file:line evidence from grep. Gaps are numbered **SH-n**.

**This extends, and does not repeat:**
- [../design-foundation/02-web-design-rules-1-9.md](../design-foundation/02-web-design-rules-1-9.md) § "Web Design
  Rule #5 — Shadows" (deck pp. 162–174): shadows are optional and personality-driven; small doses; go light;
  small / medium / large by element size; grow on hover, shrink on click; glows. The README checklist repeats the
  three-step scale and the personality defaults.
- [04-hover-focus.md](04-hover-focus.md) §2.2 "Shadow grow" and gap **HV-4** (the Lift shadow colour is hardcoded;
  fade a pre-drawn shadow instead of animating `box-shadow`). SH gaps below link to HV-4 and do not restate it.

**The earlier collected data, summarised (the "false positive"):**
- `research-runs/getcssscan-box-shadows.json` — 104 entries scraped from getcssscan.com's examples page (the page
  says 95; numbering runs #0–#103). 36 use one layer, 47 two, 21 three to nine. 15 use `inset`. 16 use a
  `0 0 0 Npx` spread ring as a border. 32 are tinted (not grey). 17 have a blur of 50px or more. Credited sources
  include Stripe, Material, Tailwind, Airbnb, Sketch, GitHub, Shopify, Trello, Tobias Ahlin. It is a value list
  only: no card size, no backdrop, no dark mode. Useful as a vocabulary, not as a rule.
- `research-runs/opl-drop-shadow.list.json` / `.measured.json` — **not shadow data.** The 149 URLs are One Page
  Love's site navigation and award pages (WordPress themes, OG generator, API…), not a "drop shadow" tag. Only 26
  were measured, 13 returned data, and the measurer recorded sticky / fixed / scroll-timeline / view-transition /
  clip / snap / reduced-motion — never shadows. Zero mention `drop-shadow`; three mention `box-shadow` (one of them
  a browser-extension overlay). This run proves nothing about shadows and should not be cited.

---

## Sources and completeness

| Source | What it holds | Read | Not read (why) / route |
|---|---|---|---|
| Josh Comeau, "Designing Beautiful Shadows in CSS" | one light source; offset/blur/opacity vs elevation; layered shadows; colour-matched shadows; drop-shadow vs box-shadow; perf note | all | inline playgrounds are React widgets inside the article, no separate URLs |
| Josh Comeau, Shadow Palette Generator + "Introducing the Shadow Palette Generator" | controls (oomph, crispy, light position, resolution, background, tint), output `--shadow-color` + low/medium/high | all | the generator's live output is for the browser pass (in the demo list) |
| Tobias Ahlin, "Smoother & sharper shadows with layered box-shadows" | 5 layered recipes (smooth, sharp, diffuse, dreamy, shorter, longer) with values | all | – |
| Tobias Ahlin, "How to animate box-shadow with silky smooth performance" + its demo page | `::after` pre-drawn shadow, fade `opacity`; Don't / Do demo | all | – |
| shadows.brumm.af (Philipp Brumm) | the original layered-shadow generator | **NOT READ** | offline (curl returns no response); web.archive.org blocked for WebFetch and timed out via curl. Read its successor **smoothshadows.com** instead: source `library.js` + `app.js` read (presets: soft / sharp × vertical / tilted × 4–32px, 5 layers, opacity 0.1; credits brumm + Ahlin) |
| Philipp Brumm article | – | **NOT READ** | no article found by search; only the tool is cited everywhere |
| MDN `box-shadow` | syntax, layer order (first on top), blur definition, interpolation as a shadow list, inset/outset pairs are uninterpolable, follows border-radius, Baseline 2015 | all | – |
| MDN `text-shadow` | syntax, no spread, multiple, a11y note, Baseline 2015 | all | – |
| MDN `drop-shadow()` | syntax, no spread / inset, follows alpha, chainable, Baseline 2016 | all | – |
| MDN Box-shadow generator | interactive: layers, inset, reorder, `::before`/`::after` | all (description) | live tool is in the demo list |
| MDN `@media (forced-colors)` | `box-shadow` and `text-shadow` forced to `none`; use a border | all | – |
| CSS-Tricks almanac `box-shadow`, `text-shadow`, `drop-shadow()` | syntax, one-side shadow with negative spread, multiple, pens | all + every embedded pen id collected | – |
| CSS-Tricks "Getting Deep into Shadows" | light source, layered, tone, drop vs box, inset, text, neumorphism, perf, a11y | all + 15 pens collected | material.io links inside are JS-only (see Material row) |
| CSS-Tricks "Neumorphism and CSS" | dual light/dark shadow recipe; contrast criticism | all + 7 pens | the three uxdesign.cc (Medium) critiques: 403 |
| CSS-Tricks "Breaking CSS box-shadow vs drop-shadow" | drop-shadow blur ≈ 2× box-shadow blur; PNG / bubble demos | all + 7 pens | – |
| CSS-Tricks "Make a smooth shadow, friend" | Chris Coyier's layered pen | all | – |
| yuanchuan, "Multiple drop shadows" | chained `drop-shadow()` = 2ⁿ − 1 shadows | all | – |
| Smashing, "A few interesting ways to use CSS shadows for more than depth" (2023) | inset-overlay hover, shadow of a shadow, transparent text with text-shadow | all + 8 pens | – |
| Smashing, "Claymorphism" (2022) | 1 outer + 2 inset recipe; clay.css | all + 2 pens | – |
| Smashing older CSS3 articles (2009–2010) | rgba shadows on any background | titles only | superseded; nothing beyond MDN |
| "Every Layout" | – | **NOT READ** | no shadow chapter (it is a layout book) |
| Material 2 elevation (MDC Web source) | umbra / penumbra / ambient maps for 0–24dp, opacities .20 / .14 / .12; transition 280ms | all of `_elevation-theme.scss` + README | m2.material.io pages are JS-only (WebFetch got only a title) → read GitHub source instead |
| Material 2 dark theme | white overlay that grows with elevation | formula read from `ElevationOverlayProvider.java` (material-components-android): alpha = (4.5·ln(dp+1) + 2) % | m2.material.io dark-theme page JS-only |
| Material 3 elevation (material-web source) | levels 0–5 built from two layers on `::before`/`::after`, opacities .3 / .15 | `elevation/internal/_elevation.scss` all | `tokens/.../_md-sys-elevation.scss` path 404s on main; m3.material.io JS-only. Tonal (surface-container) elevation in dark mode taken from the source + search, not from the page |
| Apple HIG (JSON endpoint) — Materials, Dark Mode, Color | base vs elevated backgrounds in dark mode; 35% dimming layer behind clear glass; `shadowColor` | all three JSON pages, text extracted | "depth" page does not exist (HTML 404) |
| Carbon | single `0 2px 6px $shadow`; `$shadow` .3 light → .8 dark; layers by colour | `_box-shadow.scss` + `@carbon/themes` generated SCSS | carbondesignsystem.com layering page 404 at the guessed URL; source used instead |
| Atlassian elevation page + `@atlaskit/tokens` light/dark theme files | sunken / default / raised / overlay; pair surface with shadow; dark = lighter surfaces + stronger shadow + 1px light ring | all | – |
| Polaris (`polaris-tokens/src/themes/base/shadow.ts`) | shadow-0…600, bevel, inset, per-button shadows | all | `token-groups/shadow.ts` path no longer exists |
| Fluent 2 elevation page + `fluentui` tokens source | shadow2…64 = ambient + key; dark doubles opacity; brand shadow | all | – |
| Tailwind v4 `theme.css` | `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`, `--text-shadow-*` | all shadow lines | – |
| Radix Themes `tokens/shadow.css` | shadow-1…6, each with a 1px ring; separate dark set | all | – |
| Open Props `props.shadows.js` | `--shadow-color` + `--shadow-strength` (1% light, 25% dark); shadow-1…6, inner, text | all | – |
| Refactoring UI (Schoger) | "two shadows: a soft one and a tight one"; light from above | search snippets only | **NOT READ** — Medium 403; scribe.rip and freedium mirrors returned nothing. Values quoted below are marked secondary |
| getcssscan box-shadow examples | the 95/104 examples | page + earlier JSON | – |
| dev.to "7 CSS shadow generators" | list of generators | all | – |
| web.dev "Stick to compositor-only properties and manage layer count" | only transform + opacity skip paint; layers cost memory on phones | all | – |
| WCAG 2.2 Understanding 1.4.11 Non-text Contrast | a boundary is not required when the control has text; adjacent-colour rule; gradients / borders | all | – |

---

## 1. Ground rules (apply to every technique)

- **Depth means distance.** More offset and more blur = further from the page. Opacity goes *down* as the element
  rises (Josh Comeau; Material key/ambient). The deck says the same in three sizes (Rule #5).
- **One light source per page.** Every shadow keeps the same x : y ratio (Comeau: y ≈ 2 × x; most systems use
  x = 0, light straight above).
- **Two parts make it real:** a tight, darker "contact" shadow near the edge, and a wide, faint "ambient" one
  (Material umbra/penumbra/ambient, Fluent key + ambient, Refactoring UI's two shadows).
- **Shadow is never the only boundary.** WCAG 1.4.11 does not require a boundary on a control that has text, but
  `box-shadow` is forced to `none` in forced-colours mode (MDN), and a faint shadow on a dark page is invisible. A
  card that must read as a card also needs a border, a 1px ring, or a surface colour change (Radix puts a 1px ring
  in every level; Atlassian adds one in dark mode).
- **Shadows repaint.** Only `transform` and `opacity` skip paint (web.dev). A blur is a Gaussian per pixel; its
  cost grows with blur radius × area × layers. Never animate the shadow itself on a grid of cards.

---

## 2. Techniques

### 2.1 Layered ("smooth") shadows — Added 2026-10-02 (redo)
What: several comma-separated shadows whose offset and blur double each step (Ahlin), so the falloff looks like a
real penumbra instead of one grey smear.

```css
:root { --eu-shadow-color: oklch(0.25 0.02 var(--eu-neutral-hue, 260)); }
.card { box-shadow:
  0 0.0625rem 0.0625rem oklch(from var(--eu-shadow-color) l c h / 0.075),
  0 0.125rem  0.125rem  oklch(from var(--eu-shadow-color) l c h / 0.075),
  0 0.25rem   0.25rem   oklch(from var(--eu-shadow-color) l c h / 0.075),
  0 0.5rem    0.5rem    oklch(from var(--eu-shadow-color) l c h / 0.075); }
```
- Variants by alpha: **sharp** = alpha falls as layers widen (.25 → .05); **diffuse** = alpha rises (.08 → .20);
  **dreamy** = blur doubles faster than offset (Ahlin). smoothshadows.com uses 5 layers at total opacity 0.1.
- Support: universal. Relative colour `oklch(from …)` is Baseline 2024; a `color-mix(in oklab, var(--c) N%,
  transparent)` fallback works everywhere the builder already uses `color-mix`.
- Low-end cost: each layer is a separate blur. 2–3 layers on a card is fine; 5–8 layers on 30 cards costs real
  paint time on a Tecno/itel-class phone. Keep the scale at **≤ 3 layers** for anything that repeats.
- A11y: none by itself; see 2.6 / 2.9.
- Builder: **PARTIAL** — the scale already has two layers per step (`lib/educo-ui/tokens.ts:87-92`), no third
  ambient layer. Acceptable under the cost budget; see SH-3.

### 2.2 Elevation scale (tokens) — Added 2026-10-02 (redo)
What: a small set of named steps tied to *what the element is* (card, dropdown, dialog), not a free blur slider.

Comparison — the light-theme value of each system's low / middle / high step (px as published):

| System | Low (card, button) | Middle (dropdown, popover) | High (dialog, modal) | Dark mode |
|---|---|---|---|---|
| **Educo now** (`tokens.ts:88-91`, rem shown as px) | sm `0 1 2 /.08, 0 1 1 /.06` | md `0 4 8 /.10, 0 2 4 /.06` · lg `0 12 24 /.12, 0 4 8 /.08` | xl `0 24 48 /.18, 0 8 16 /.10` | **same values** |
| Material 2 (1 / 8 / 24 dp) | `0 2 1 -1 /.2, 0 1 1 0 /.14, 0 1 3 0 /.12` | `0 5 5 -3 /.2, 0 8 10 1 /.14, 0 3 14 2 /.12` | `0 11 15 -7 /.2, 0 24 38 3 /.14, 0 9 46 8 /.12` | white overlay (4.5·ln(dp+1)+2)%: 1dp 5%, 8dp 12%, 24dp 16.5% |
| Material 3 (level 1 / 3 / 5) | `0 1 2 /.3` + `0 1 3 1 /.15` | `0 1 3 /.3` + `0 4 8 3 /.15` | `0 4 4 /.3` + `0 8 12 6 /.15` | tonal surface roles carry depth |
| Tailwind v4 (sm / lg / 2xl) | `0 1 3 0 /.1, 0 1 2 -1 /.1` | `0 10 15 -3 /.1, 0 4 6 -4 /.1` | `0 25 50 -12 /.25` | same values |
| Fluent 2 (shadow4 / 16 / 64) | `0 0 2 /.12, 0 2 4 /.14` | `0 0 2 /.12, 0 8 16 /.14` | `0 0 8 /.12, 0 32 64 /.14` | opacities doubled (.24 / .28) |
| Polaris (100 / 400 / 600) | `0 1 0 0 rgba(26,26,26,.07)` | `0 8 16 -4 /.22` | `0 20 20 -8 /.28` | – (light only in base) |
| Atlassian (raised / overlay) | `0 1 1 #1E1F2140, 0 0 1 #1E1F214F` | `0 8 12 #1E1F2126, 0 0 1 #1E1F214F` | (overlay is top) | raised `…80` (50%); overlay adds `0 0 0 1px #BDBDBD1F` ring; surfaces lighten #1F1F21 → #242528 → #2B2C2F |
| Carbon | `0 2 6 rgba(0,0,0,.3)` (one value for every floating layer) | same | same | `.3` → `.8`; layers by colour |
| Radix Themes (2 / 4 / 6) | ring `0 0 0 1 gray-a3` + 4 small layers | ring + `0 8 40 black-a1, 0 12 32 -16 gray-a3` | ring + `0 12 60, 0 16 64, 0 16 36 -20` | separate set: ring `gray-a6`, black alphas ×2–3 |
| Open Props (2 / 4 / 6) | 2 layers, strength 1%+3–5% | 6 layers | 7 layers to `0 100 80 -2` | `--shadow-strength` 1% → 25%, colour `220 40% 2%` |
| Refactoring UI (secondary) | button `0 1 3 /.2` | dropdown `0 4 6 /.1` | modal `0 15 35 /.2` | – |

What the table says:
- Everyone uses **two or more layers**, a **negative spread** on the large steps (keeps the shadow under the box,
  not around it), and **3–6 named steps**. Educo's four steps sit between Tailwind and Fluent. Good.
- **Every system with a dark theme changes the shadow there** — stronger alpha (Fluent ×2, Carbon .3→.8, Atlassian
  25%→50%, Open Props 1%→25%) and/or lighter surfaces as elevation rises (Atlassian, Apple "base vs elevated",
  Material overlay / tonal). Educo does neither (SH-2).
- Radix and Atlassian put a **1px ring** into the shadow itself, so the edge survives on any background.

Builder: **HAVE** a single source scale (`tokens.ts:87-92`, re-exported `lib/box-model.ts:2890`), emitted as
`--eu-shadow-*` (`tokens.ts:163`), chosen per block in the Inspector (`BoxInspector.tsx:58`, `:1223-1224`), stored as
`shadow?: "sm"|"md"|"lg"|"xl"` (`box-model.ts:320`). **PARTIAL** in how it is emitted: blocks get the literal value
inline (`box-model.ts:1131`, `lib/box-export.ts:86`), not `var(--eu-shadow-*)`, so a theme cannot retune a block's
shadow (SH-4).

### 2.3 Shadow colour: tinted, not black — Added 2026-10-02 (redo)
What: pure black at low alpha greys out a coloured backdrop. Use the backdrop's hue at low chroma and low
lightness (Comeau; Open Props `--shadow-color`; the palette generator's "tint shadow").
```css
:root { --eu-shadow-color: oklch(0.3 0.03 var(--eu-neutral-hue)); --eu-shadow-strength: 1; }
.band--brand { --eu-shadow-color: oklch(from var(--eu-color-brand) 0.3 0.06 h); }  /* re-tint on a coloured band */
```
- Support: OKLCH Baseline 2023; relative colour 2024; `color-mix` fallback.
- Cost: none.
- Builder: **GAP** — every step is `rgba(0,0,0,…)` (`tokens.ts:88-91`); hardcoded shadow colours also at
  `lib/interactions.ts:44` (HV-4), `box-model.ts:6250` (`ARRIVE_SHADOW`), `box-model.ts:3559`, and the editor preview
  `BoxInspector.tsx:386`. The token module already builds a brand-tinted neutral ramp (`tokens.ts:94-97`
  `neutralRamp`) that a shadow colour could come from. **SH-1.**

### 2.4 Shadows in dark mode — Added 2026-10-02 (redo)
What: on a near-black page a black shadow has almost nothing to darken. Two fixes, used together:
1. **Stronger shadow** — raise alpha 2–25× (table above). One variable does it:
   `--eu-shadow-strength: 1` light / `3` dark, multiplied into each layer's alpha.
2. **Lighter surface as it rises** — raised / overlay surfaces get a lighter background (Atlassian
   `surface-raised` / `surface-overlay`; Apple "elevated" colours; Material overlay alpha (4.5·ln(dp+1)+2)%).
   `background: color-mix(in oklab, var(--eu-color-surface), white calc(var(--lvl) * 3%))`.
- Plus a 1px light ring on overlays (Atlassian `#BDBDBD1F`), so the edge reads.
- Cost: none. A11y: the lighter surface must keep text contrast ≥ 4.5:1 (measure, Core Rule 17).
- Builder: **GAP** — one scale for every theme (`tokens.ts:145`, `:163`); only `bg` and `surface` colour tokens
  exist (`tokens.ts:155`), no raised / overlay surface. **SH-2.**

### 2.5 Coloured shadows and glows — Added 2026-10-02 (redo)
What: a shadow in the element's own hue (a brand button that glows), or a zero-offset ring.
```css
.btn--glow { box-shadow: 0 0.5rem 1.5rem -0.5rem color-mix(in oklab, var(--eu-color-brand) 55%, transparent); }
.ring      { box-shadow: 0 0 0 0.25rem color-mix(in oklab, var(--eu-color-brand) 32%, transparent); }
```
- Deck Rule #5.8 and the Startup personality ("glows are becoming modern").
- A11y: a glow is decoration; it never carries focus or state on its own.
- Builder: **PARTIAL** — Glow exists only as a hover effect (`lib/interactions.ts:49-50`) and component states
  (`lib/educo-ui/components.ts:587`); the per-block shadow choice has no glow (`BoxInspector.tsx:58`). The deck
  note asks for glow as a named variant of the shadow token. **SH-10.**

### 2.6 Inset shadows (sunken, pressed, inner ring) — Added 2026-10-02 (redo)
What: `inset` draws inside the padding box: wells, pressed buttons, inner borders that do not change layout.
```css
.well    { box-shadow: inset 0 0.125rem 0.25rem oklch(from var(--eu-shadow-color) l c h / .12); }
.pressed { box-shadow: inset 0 0.1875rem 0 oklch(from var(--eu-shadow-color) l c h / .25); }
```
- **Trap:** a list of outer shadows cannot transition to a list with `inset` — the change is instant (MDN
  "uninterpolable"). Put the inset on a pseudo-element or pad both lists to the same shape.
- Tailwind v4 has `--inset-shadow-*`; Polaris `shadow-inset-100/200`, `shadow-bevel-100`; Open Props
  `--inner-shadow-0…4` with a highlight.
- Builder: **PARTIAL** — used inside components (`components.ts:170` alert "inset", `:392`, `:411-412`), not
  offered per block. **SH-11.**

### 2.7 Neumorphism and claymorphism — Added 2026-10-02 (redo)
What: element and parent share one colour; a light shadow top-left and a dark one bottom-right (neumorphism), or
one outer + two inset (clay: `8px 8px 16px /.25, inset -8px -8px 12px /.25, inset 8px 8px 12px #fff6`).
- A11y: CSS-Tricks and the uxdesign critiques — the boundary is only a soft shadow, so it fails low-vision users
  and vanishes in forced colours. Usable only with a real border or text inside, never for an input or a toggle
  state.
- Builder: **GAP, by choice** — not offered; if ever offered, only as a playful personality preset with a border.
  No SH number (no decision needed now).

### 2.8 `filter: drop-shadow()` — Added 2026-10-02 (redo)
What: a shadow that follows the alpha of what is drawn — a transparent PNG cut-out, an SVG icon, a speech bubble
with a tail, a `clip-path` shape. `box-shadow` draws the rectangle.
```css
.cutout { filter: drop-shadow(0 0.25rem 0.375rem oklch(from var(--eu-shadow-color) l c h / .2)); }
```
- No spread, no inset. The third length is a **standard deviation**, so the same number is about **twice as
  blurry** as a `box-shadow` blur (CSS-Tricks, MDN) — a token must be halved, not copied.
- Chained `drop-shadow()`s compound: n functions draw 2ⁿ − 1 shadows (yuanchuan). Use one.
- Cost: a filter re-rasterises the element; it may get its own layer. Fine on a few images, not on a gallery of 40.
- Tailwind v4 keeps a separate `--drop-shadow-*` scale for exactly this reason.
- Builder: **GAP** — 0 hits for `drop-shadow` in `lib/` and `components/website/`. An image block with a
  transparent PNG + the Shadow control draws a rectangle. **SH-9.**

### 2.9 `text-shadow` — Added 2026-10-02 (redo)
What: shadows on glyphs. Two real uses: (a) legibility of words over a photo (a soft dark halo), (b) display
effects (long shadow, outline, emboss, transparent text that shows only its shadow — Smashing 2023).
```css
.on-photo { text-shadow: 0 0.0625rem 0.125rem oklch(0 0 0 / .45), 0 0 0.75rem oklch(0 0 0 / .35); }
```
- A11y: a halo helps but **does not count** toward a measured 4.5:1 unless the contrast is measured against the
  colour the halo actually produces behind the glyph; the safer rule is a scrim (overlay) for contrast and the halo
  as a bonus. `text-shadow` is forced to `none` in forced colours, which is fine because the background image is
  removed too.
- Cost: cheap for headings; avoid big blurs on long paragraphs.
- Tokens elsewhere: Tailwind v4 `--text-shadow-2xs…lg`; Open Props `--text-shadow-1…6`.
- Builder: **GAP** — 0 hits for `text-shadow` / `textShadow` in `lib/` and `components/website/`. Words over a
  user's photo (Core Rule 17 "contrast over a photograph") have no halo option. **SH-8.**

### 2.10 Shadow on interaction (hover lifts, press sinks) — Added 2026-10-02 (redo)
What: deck Rule #5.7 — hover = a bigger shadow "pulls it closer", click = a smaller one "pushes it back".
The right way to *build* it is one step up / one step down **from the block's own resting shadow**.
```css
.card { --lvl-rest: var(--eu-shadow-sm); --lvl-hover: var(--eu-shadow-lg); box-shadow: var(--lvl-rest); }
.card:hover, .card:focus-visible { box-shadow: var(--lvl-hover); }
.card:active { box-shadow: var(--eu-shadow-sm); transform: translateY(0.0625rem); }
```
- Builder: **PARTIAL.** Lift sets one fixed shadow `0 0.75rem 1.5rem -0.75rem rgba(0,0,0,.32)`
  (`lib/interactions.ts:43-44`) and **replaces** whatever the block had: a block set to `xl` (`0 1.5rem 3rem`)
  *loses* depth on hover. Glow (`:49-50`) replaces the resting shadow with a ring, so an elevated card goes flat
  while hovered. Press (`:47`) moves but leaves the shadow. Components do this right in places
  (`components.ts:385-386` sm → md; `:532-533` sm → xl). **SH-5.** (HV-4 already covers the hardcoded colour.)

### 2.11 Animating shadows cheaply — Added 2026-10-02 (redo)
What: draw the big shadow once on `::after`, keep it at `opacity: 0`, fade it in; move the element with
`transform`. Only opacity and transform skip paint (web.dev, Ahlin).
```css
.card { position: relative; transition: transform var(--eu-dur-fast) var(--eu-ease-standard); }
.card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  box-shadow: var(--eu-shadow-lg); opacity: 0; transition: opacity var(--eu-dur-fast) var(--eu-ease-standard); }
.card:hover::after, .card:focus-visible::after { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .card { transition: none; } }   /* keep the shadow, drop the move */
```
- Material 3 web builds every level from two pseudo-elements the same way (`::before` .3 + `::after` .15).
- Caution: `will-change` on every card creates a layer per card — on a 2–3 GB phone this costs more than it saves
  (web.dev). Promote only while hovered, or not at all.
- Builder: **PARTIAL** — `box-shadow` itself is transitioned in `interactions.ts:43,49`, `components.ts:16`
  (buttons), `:47` (inputs), `:385-386`, `:532-533` (accordion), `lib/educo-ui/base.ts:130` (every link and
  button). Small elements are fine; the accordion and card grids are where it costs. HV-4 (perf part) covers
  `interactions.ts`; **SH-6** covers the component CSS.

### 2.12 Shadows, focus rings and forced colours — Added 2026-10-02 (redo)
What: in Windows High Contrast / forced-colours mode `box-shadow` is forced to `none` (MDN). A focus indicator
drawn *only* with `box-shadow` after `outline: none` disappears for exactly the users who need it most.
```css
.eu-input:focus-visible { outline: 0.125rem solid transparent; outline-offset: 0.125rem;   /* becomes visible in forced colours */
  box-shadow: 0 0 0 0.1875rem var(--eu-focus-ring); }
@media (forced-colors: active) { .eu-card { border-color: CanvasText; } }
```
- WCAG 1.4.11 also asks the ring itself to reach 3:1 against what is next to it.
- Builder: **GAP (a defect).** `components.ts:49` (inputs / selects / textareas), `:320` (accordion header),
  `:345` (accordion search), `:349` (accordion controls) all set `outline: none` and draw focus only with
  `box-shadow`. 0 hits for `forced-colors` anywhere in `lib/`, `components/`, `app/`. The input ring uses
  `--eu-color-primary-100`, a very light tint, whose 3:1 against white is not measured. Cards keep a 1px border
  (`components.ts:35`), so their boundary survives. **SH-7.**

### 2.13 Personality decides whether there is a shadow at all
Deck Rule #5.1 and the personality tables: off for Serious, Minimalist, Plain, Bold; subtle for Calm, Startup,
Playful. Builder: **GAP** — no personality preset exists in `lib/` yet (grep "personalit" in `lib/` = 0), so no
shadow default follows one. Tracked with the personality work (RULE P), not here; noted so it is not lost
(**SH-12**).

---

## 3. The builder today — HAVE / PARTIAL / GAP (verified by grep, 2026-10-02)

| Capability | Status | Evidence |
|---|---|---|
| One elevation scale, four steps, rem | **HAVE** | `lib/educo-ui/tokens.ts:87-92`; re-export `lib/box-model.ts:2890` |
| Emitted as CSS variables | **HAVE** | `tokens.ts:145`, `:163` (`--eu-shadow-sm…xl`) |
| Per-block shadow choice (None / Soft / Medium / Strong / Bold) | **HAVE** | `components/website/box/BoxInspector.tsx:58`, `:1223-1224`; `box-model.ts:320` |
| Block shadow reads the variable | **PARTIAL** — literal value inline | `box-model.ts:1131`; `lib/box-export.ts:86` |
| Layered (≥ 2 layers) | **HAVE** (2 layers) | `tokens.ts:88-91` |
| Shadow colour token / tinted / OKLCH | **GAP** | `tokens.ts:88-91` all `rgba(0,0,0,…)`; also `interactions.ts:44`, `box-model.ts:6250`, `box-model.ts:3559`, `BoxInspector.tsx:386` |
| Dark-theme shadow strength | **GAP** | same scale for every theme, `tokens.ts:145` |
| Raised / overlay surface tokens | **GAP** | only `bg`, `surface` at `tokens.ts:155` |
| Glow as a shadow-token variant | **PARTIAL** | hover only `interactions.ts:49-50`; component `components.ts:587` |
| Inset per block | **PARTIAL** | components only `components.ts:170`, `:392`, `:411-412` |
| Hard (offset, 0-blur) shadow | **PARTIAL** | alert "Hard shadow" `components.ts:174`, `lib/educo-ui/alerts.ts:50` |
| `filter: drop-shadow()` | **GAP** | 0 hits in `lib/`, `components/website/` |
| `text-shadow` | **GAP** | 0 hits in `lib/`, `components/website/` |
| Hover grows from the resting shadow | **PARTIAL** | Lift/Glow replace it: `interactions.ts:43-50`; good example `components.ts:385-386` |
| Shadow kept under reduced motion | **HAVE** | `interactions.ts:105` comment + rule (see 04 §3) |
| Animate opacity of a pre-drawn shadow | **GAP** | `box-shadow` transitioned at `interactions.ts:43,49`, `components.ts:16,47,385,532`, `base.ts:130` |
| Forced-colours fallback / focus not shadow-only | **GAP (defect)** | `outline:none` + box-shadow focus at `components.ts:49,320,345,349`; 0 `forced-colors` hits |
| Card boundary not shadow-only | **HAVE** | `.eu-card` has `border:1px solid var(--eu-color-border)` (`components.ts:35`) |
| Shadow default follows personality | **GAP** | no personality preset in `lib/` |

---

## 4. Gap list

| Id | Gap | Priority |
|---|---|---|
| **SH-1** | Shadow colour is hardcoded black `rgba` in the scale and in five other places. Add `--eu-shadow-color` (OKLCH, from the neutral ramp's hue) and build every layer from it; re-tint on coloured bands. | **MUST** (Core Rule 17) |
| **SH-2** | Dark themes use the light-theme shadows. Add `--eu-shadow-strength` (×3 or so in dark / midnight / purple) and raised / overlay surface tokens that lighten with elevation, plus a 1px light ring on overlays. Measure text contrast on the lighter surfaces. | **MUST** (all themes) |
| **SH-3** | Scale is two layers; the systems that look best use 3–6. Consider a third ambient layer on `lg` / `xl` only, staying ≤ 3 layers for cost on low-end phones. | LATER |
| **SH-4** | Blocks get the literal shadow inline instead of `var(--eu-shadow-*)`, so a theme (SH-1, SH-2) cannot reach them. Emit the variable in both canvas and export. | **MUST** (prerequisite of SH-1/2) |
| **SH-5** | Lift and Glow replace the block's resting shadow; a block at `xl` loses depth on hover, and Glow flattens an elevated card. Make hover = one step up from the resting level (and glow layered on top); Press = one step down. | **MUST** (deck Rule #5.7) |
| **SH-6** | Components transition `box-shadow` directly (accordion, buttons, inputs, all links). Fade a pre-drawn `::after` shadow on the large ones (accordion items, cards). Extends HV-4. | LATER |
| **SH-7** | Focus indicators drawn only with `box-shadow` after `outline: none` vanish in forced colours; no `forced-colors` rule anywhere; input ring contrast (primary-100) not measured. Add a transparent outline under every shadow ring and measure 3:1. | **MUST — defect** (WCAG 2.4.7 / 1.4.11) |
| **SH-8** | No `text-shadow` option or token for words over a photo or for display type. Add a small `--eu-text-shadow-*` scale and a "legible on photo" halo, with contrast still met by a scrim. | SHOULD |
| **SH-9** | No `filter: drop-shadow()`: an image with transparency or an icon gets a rectangle. Offer the shadow as `drop-shadow` on image / icon / shaped blocks, with tokens halved for the σ blur, one function only. | SHOULD |
| **SH-10** | No glow in the per-block shadow choice; the deck asks for glow as a named variant of the shadow token. | SHOULD |
| **SH-11** | No inset ("sunken") option per block, though components use it. Add one `inset` step (wells, pressed). | LATER |
| **SH-12** | Shadow default does not follow a website personality, because personalities are not built yet. Track with RULE P. | with RULE P |

Demo URLs for the browser pass (generators, pens, design-system pages): 79, in the session scratchpad
`demos/sh.json`.
