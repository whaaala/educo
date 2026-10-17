---
title: Our builder — effects & motion MEASURED through the UI (BATCH RX-4, step 3b)
---

# Our builder — effects & motion, MEASURED (BATCH RX-4 step 3b, 2026-10-17)

**Run label: HEADED UAT.** Every state was built through the UI (blocks panel, palette tiles, drops, Inspector controls —
`localStorage` only read, to report what got stored), on the fresh production build **-nTJUZu6UI4MiXNbHBjnS** served on
3100 (`check-fresh-build.js` printed FRESH). What a visitor gets was then read in the real **Preview** (the iframe of the export)
and in the builder's own **Export** (site.zip unzipped, served with gzip, opened in a second visible window) — with the real
mouse, the keyboard (Tab), a touch phone context (`hasTouch`, `isMobile`, 390 × 844), `reducedMotion: 'reduce'`, the mouse
wheel, `getAnimations()` and screenshot pixels.

- Script: [`scripts/uat/uat-rx4-headed.js`](../../../scripts/uat/uat-rx4-headed.js) — first pass `W1…W6` (six headed windows,
  run twice: run 1 found harness faults, run 2 after fixing them), second pass `--follow` `F1…F6` (six headed windows) and two
  single-window re-runs of a case that had failed in parallel (`F5` floating corner, `F7` pager arrows).
- Results: `scripts/uat/rx4/results-*.json` (run 2 + follow), `scripts/uat/rx4/run1/results-*.json` (run 1 — PN-2 Shadow / Solid /
  Rule, PN-8, WT-2/3 come from there), vocabulary of every Inspector: `scripts/uat/rx4/vocabulary.json`. Screenshots: `scripts/uat/rx4/`.
- "The claim" is [02-ours-code.md](02-ours-code.md); the shared list is [00-capabilities.md](00-capabilities.md). **The measurement wins.**
- GAP rows with "no control" were measured by the **vocabulary pass**: 24 of the 25 palette tiles added through the UI (the
  photo tiles through their "Choose photos" menu), every Inspector tab (Design · Content · Per-device) with every section opened,
  every gallery tile name and control label collected, plus the style menus and the toolbar, then searched for the capability's
  words (Grid's Inspector was collected in F6). A keyword hit was read by hand; all hits for GAP rows were unrelated words
  ("Fill" for HV-9, "Underline" text style for HV-6, "Caption" text style for HV-10, "Tilt" for CU-5).

## Totals

| | HAS | PARTLY | GAP |
|---|---|---|---|
| Code claim (02) | 27 | 38 | 66 |
| **Measured (03)** | **24** | **41** | **66** |

**Measured ≠ claimed on 7 rows:** ST-1 (HAS → PARTLY), EN-1 (HAS → PARTLY), SC-8 (HAS → PARTLY), HV-1 (PARTLY → GAP),
HV-15 (PARTLY → GAP), BL-9 (GAP → PARTLY), PN-5 (GAP → PARTLY). Several other rows agree on the verdict but correct a detail of
the claim (SC-9, WT-2, PN-7, BG-8) — said in the row.

## The table

| ID | Code claim | MEASURED | Evidence (what was seen; screenshot) | Agrees? |
|---|---|---|---|---|
| PT-1 | HAS | HAS | Export with two pages → `index.html` + `page-2.html` + `styles.css`, plain loads | yes |
| PT-2 | GAP | GAP | export scan: no `view-transition` anywhere; no page-transition words in any Inspector or the toolbar | yes |
| PT-3 | GAP | GAP | as PT-2 | yes |
| PT-4 | GAP | GAP | as PT-2 | yes |
| PT-5 | GAP | GAP | as PT-2 | yes |
| PT-6 | GAP | GAP | as PT-2 (no `view-transition-name`) | yes |
| PT-7 | PARTLY | PARTLY | pager strip `scroll-behavior: smooth`, auto-advance passes through 1003 → 1280, 2317 → 2560 (glides); no tab / filter transition; its arrows are drawn off the page (bug 1) | yes |
| PT-8 | HAS | HAS | `index.html` carries `<link rel="prefetch" href="page-2.html">` | yes |
| PT-9 | GAP | GAP | not a surface of the website builder; nothing to drive (not measured in `apps/mobile/`) | yes |
| ST-1 | HAS | **PARTLY** | Arrange offers Top / Bottom × Straight · Slope right · Slope left · Curve out · Curve in, Edge depth max 30; Slope right cuts correctly (ST-2-slope-cut.png). **Curve out draws nothing**: its `clip-path` points run past 100 % (93.75 % 101.14 % …), but nothing is painted outside the box — pixels inside the "bulge" are page white [255,255,255] without a shadow, and only the shadow shows there with one (ST-1-curve-out-no-shadow.png, V-10-shadow-curved.png) — bug 2 | **no** |
| ST-2 | GAP | GAP | dark band, Bottom "Slope right" 30 %, light band after it: the cut shows page white [255,255,255], not the next band [209,213,219] (ST-2-slope-cut.png) | yes |
| ST-3 | GAP | GAP | only the five edge shapes; no wave / zigzag / scallop… in any Inspector | yes |
| ST-4 | GAP | GAP | no layered shapes | yes |
| ST-5 | GAP | GAP | outer spacing typed −1.5 stores 0 (RX-3 U4, `scripts/uat/rx3fix/results-W1.json`); a Floating block "drags anywhere to overlap", but hanging across a band edge was not measured | yes |
| ST-6 | GAP | GAP | no moving edge | yes |
| ST-7 | GAP | GAP | no vertical page snap; "Show one at a time" is a sideways pager only | yes |
| ST-8 | GAP | GAP | none | yes |
| ST-9 | GAP | GAP | none | yes |
| ST-10 | GAP | GAP | = V-10: Shadow "Bold" — 30px below, near the left end: straight band [238,238,238] (shadow), curved band [255,255,255] (shadow cut away) | yes |
| BL-1 | PARTLY | PARTLY | gradient editor: Linear / Radial / Conic, "Gradient angle", "Colour N" swatches + positions, "Add colour"; no "fade into the next band" | yes |
| BL-2 | PARTLY | PARTLY | by hand only: the same photo with "Fixed (parallax scroll)" per band exports `background-attachment: fixed`; no shared-background control | yes |
| BL-3 | PARTLY | PARTLY | "Tint over background" can only be an opaque colour (V-4: a picked #374151 exports `linear-gradient(rgb(55,65,81)…)` over the photo; pixel [69,81,99], photo gone — V-4-tint-export.png). Hero ships a scrim `linear-gradient(rgba(0,0,0,.5) → .58 → .66)` (BL-3-hero.png) with no control for it | yes |
| BL-4 | PARTLY | PARTLY | Advanced CSS `mix-blend-mode: difference` → exported `difference`; no control ("blend" in no Inspector) | yes |
| BL-5 | PARTLY | PARTLY | Advanced CSS `background-blend-mode: multiply` → exported `multiply, multiply` | yes |
| BL-6 | PARTLY | PARTLY | Advanced CSS `mask-image: linear-gradient(black, transparent)` → exported | yes |
| BL-7 | GAP | GAP | none | yes |
| BL-8 | GAP | GAP | none | yes |
| BL-9 | GAP | **PARTLY** | by hand: two full-screen bands each "Sticks when reached" — scrolling 1884px, band 2 slides up and sits over band 1 (both top 0; PN-5-two-sticky-bands.png). A held hero + an opaque next band gives the stay-behind effect; no named control, and transparent bands simply overlap their words | **no** |
| BL-10 | GAP | GAP | none | yes |
| BL-11 | PARTLY | PARTLY | "Glass" arrival → `backdrop-filter: blur(9.6px)`, background at 72 % (BL-11-glass.png); Accordion and Alert "Glass" designs; Advanced CSS `backdrop-filter` accepted | yes |
| BG-1 | HAS | HAS | hex field refuses `#ff000080` and `rgba(…)` (nothing stored), palette has no alpha control (BG-1-palette.png); "None (transparent)" offered; "See-through" 50 % → band `rgba(255,0,0,.5)` with its Text still opaque | yes |
| BG-2 | PARTLY | PARTLY | library 137 gradients; Linear / Radial / Conic switch stores `radial-gradient(circle at 50% 50%…)` / `conic-gradient(from 135deg at 50% 50%…)`; Angle; no centre, colour space or repeating (BG-2-gradient-editor.png) | yes |
| BG-3 | HAS | HAS | library "Mesh" 33 items → stacked radials | yes |
| BG-4 | HAS | HAS | "Upload an image" → photo; Fit (Fill / Fit / Original / Stretch) → `contain` exported; Position; Repeat | yes |
| BG-5 | PARTLY | PARTLY | colour #d1d5db kept under the photo (exported `background-color`); a gradient chosen first is **replaced** by the photo (stored bgImage = the photo only) = V-9 | yes |
| BG-6 | PARTLY | PARTLY | "Fixed (parallax scroll)" → `fixed` at 1280 **and on a 375 touch phone** (no phone fallback); `scroll` under reduced motion (RX-3 U1) | yes |
| BG-7 | GAP | GAP | Video is a block; no video background | yes |
| BG-8 | HAS | HAS | "Patterns" 25, "Tile size" field, exported tiles (BG-8-pattern-export.png). Detail: the dot pattern opened "Edit gradient", not "Edit pattern CSS" | yes |
| BG-9 | GAP | GAP | no grain / noise | yes |
| BG-10 | GAP | GAP | no moving background; no `@keyframes` for one in the export | yes |
| BG-11 | GAP | GAP | none | yes |
| HV-1 | PARTLY | **GAP** | Link hovered with the real mouse: `rgb(79,70,229) underline` before and after — nothing changes (HV-1-link-hover.png); no colour-on-hover tile (gallery = None · Lift · Grow · Press · Glow · Outline · Brighten · Soften) | **no** |
| HV-2 | HAS | HAS | Lift: `translateY(-4px)` + shadow; Grow: `scale(1.03)`, 0.2 s (HV-Lift-hover.png, HV-Grow-hover.png) | yes |
| HV-3 | PARTLY | PARTLY | by hand: Stack "Trim to size" (overflow hidden) + image "Grow" → image drawn 1318 × 879 inside a 1280 × 853 frame (HV-3-image-grow.png); no zoom-in-frame effect | yes |
| HV-4 | GAP | GAP | none in the 8-tile gallery | yes |
| HV-5 | HAS | HAS | Outline: 2px solid brand outline; Glow: 4px brand ring | yes |
| HV-6 | GAP | GAP | only a static Underline text style | yes |
| HV-7 | PARTLY | PARTLY | Lift grows the shadow; mouse DOWN changes nothing (RX4-3) | yes |
| HV-8 | PARTLY | PARTLY | Soften → opacity .82; no dim-the-others | yes |
| HV-9 | GAP | GAP | none | yes |
| HV-10 | GAP | GAP | none | yes |
| HV-11 | PARTLY | PARTLY | Brighten → `brightness(1.06) saturate(1.05)`; no greyscale → colour | yes |
| HV-12 | PARTLY | PARTLY | band Lift + its Button Grow: pointer on the band → band −4px, button `none`; pointer on the button → band −4px AND button `scale(1.03)` (HV-12-*.png) — a child's own works, a parent's hover cannot drive it | yes |
| HV-13 | HAS | HAS | Tab: skip link 2px black ring, Button 2px solid rgb(79,70,229) (HV-14-button-focused.png); forced colours: ring still drawn (A11Y-7-forced-colors.png) | yes |
| HV-14 | HAS | HAS | the Lift Button lifts −3.9px on keyboard focus | yes |
| HV-15 | PARTLY | **GAP** | the export of a page with a Press Text, two Buttons and a Card holds **0 `:active` rules**; mouse down on "Press" changes nothing vs hover | **no** |
| HV-16 | PARTLY | PARTLY | pager dots: current `aria-current="true"` opacity 1, others .55; `aria-current` styling present in the CSS, nothing emits it for menus (not measured further) | yes |
| HV-17 | HAS | HAS | cursor: Button `pointer`, Link `pointer`, Text `auto` | yes |
| HV-18 | GAP | GAP | none | yes |
| EN-1 | HAS | **PARTLY** | Rise up + "Play when it scrolls into view" → a `ViewTimeline`, range `entry 0% cover 28%`; scrolling down it plays (op .32 → 1); **scrolling back up it plays backwards** to op 0 / progress 0 (RX4-1 below) — not "once" | **no** |
| EN-2 | HAS | HAS | on load: `eu-reveal-rise` on the document timeline, 320 ms, fill both | yes |
| EN-3 | HAS | HAS | Stack with three Texts, Fade in + "Bring the blocks inside in one after another": each child animates, delays 0 / 90 / 180 ms; rules to `nth-child(10)` (literals) | yes |
| EN-4 | GAP | GAP | none | yes |
| EN-5 | GAP | GAP | no `@starting-style` in the export | yes |
| EN-6 | PARTLY | PARTLY | Alert × dismiss fades (opacity 1 → .28 … over ~250 ms, measured frames); alerts only | yes |
| EN-7 | GAP | GAP | no menu / drawer component | yes |
| EN-8 | GAP | GAP | none | yes |
| EN-9 | PARTLY | PARTLY | Accordion row (native `<details>`): click closes 120 → 56px and opens 56 → 120px with **no frame between**; no `::details-content` / `interpolate-size` | yes |
| EN-10 | HAS | HAS | Alert → Content → "Alert form factor": Inline · Banner · Callout · **Toast (floats in a corner)** → 16px from right and bottom; "Hide itself after" 4 s → fades out at 4.0 s over ~160 ms; "Show a dismiss (×) button" → "Dismiss" (EN-10-toast.png) | yes |
| EN-11 | GAP | GAP | none | yes |
| SC-1 | PARTLY | PARTLY | backgrounds only ("Fixed (parallax scroll)"); no element parallax | yes |
| SC-2 | GAP | GAP | none | yes |
| SC-3 | PARTLY | PARTLY | no scrub control; the only scroll-tied motion a person reaches is the scroll entrance (a scrubbed `view()` timeline, EN-1) and the arrivals (a document `ScrollTimeline`) | yes |
| SC-4 | GAP | GAP | none | yes |
| SC-5 | GAP | GAP | "Bookmark name" only | yes |
| SC-6 | GAP | GAP | none | yes |
| SC-7 | GAP | GAP | none; no infinite animation in the export | yes |
| SC-8 | HAS | **PARTLY** | "Show one at a time" works as a strip (`scroll-snap-type: x mandatory`, smooth, swipe); Slider / Rotating hero tiles add a pager. **But its arrows and dots are drawn above the page** — at 1280 the nav sits at top −66px (arrows −66, dots −53), at 375 −69px: invisible, and a real click on "Show the next one" times out (SC-8-nav-1280.png, SC-8-canvas.png shows the dots above the band) — bug 1. Measured on a pager of Text blocks | **no** |
| SC-9 | PARTLY | PARTLY | "Move on its own every" 3 s → moves (0 → 1280 → 2560); mouse resting on it: stops; mouse gone: resumes; **reduced motion: does not move at all** (the claim's "still under reduced motion" is wrong); no visible Pause (RX4-5) | yes |
| SC-10 | GAP | GAP | none | yes |
| SC-11 | GAP | GAP | none | yes |
| SC-12 | GAP | GAP | none (deliberate) | yes |
| PN-1 | HAS | HAS | "Sticks when reached": scrolled 900px, header top 0 (sticky on its band wrapper) (PN-1-sticky-900.png) | yes |
| PN-2 | HAS | HAS | arrivals at scroll 500: Shadow → shadow, Solid → background, Glass → blur 9.6px + 72 % fill, Rule → 1px line, Condense → 182 → 128px (once a Band height is set) (PN-2-*-500.png, RX4-4-condensed.png) | yes |
| PN-3 | PARTLY | PARTLY | Condense shrinks; no hide-on-scroll-down words anywhere | yes |
| PN-4 | PARTLY | PARTLY | by hand: a "Sticks when reached" Text beside a 120rem Text holds at top 0 through 1500px (PN-6) — a scene can be built; no scene control | yes |
| PN-5 | GAP | **PARTLY** | two full-screen bands "Sticks when reached": band 2 slides over band 1 (top 0 / 0 at 1884px) — stacking sections by hand; no control, and without a background each band's words overlap the last's (PN-5-two-sticky-bands.png) | **no** |
| PN-6 | HAS | HAS | sticky Text beside a 120rem Text: top 0 / 0 / 0 / 0 at 0 / 400 / 900 / 1500px (PN-6-sticky-column.png) | yes |
| PN-7 | HAS | HAS | an in-layout Button, "Floats on screen", Held against ↘ (8 anchors offered): `fixed`, bottom 0, right edge, holds at scroll 0 and 1200 at 375 and 1280; no `safe-area-inset`. A FLOATED block gets no corner choice and misbehaves (bug 4) | yes |
| PN-8 | HAS | HAS | a band "Floats on screen · Bottom" set on the Mobile chip only: 375 `fixed` bottom 0; 599 / 600 / 1280 in flow (run 1) | yes |
| PN-9 | PARTLY | PARTLY | a second sticky bar one screen down with "Shadow": the shadow appears at scroll 60 (rgba .1) while the bar is still 920px down the page, not stuck — the arrival follows page scroll, not the stuck state (PN-9-before-stuck.png) | yes |
| TX-1 | GAP | GAP | none | yes |
| TX-2 | GAP | GAP | none (stagger is per block) | yes |
| TX-3 | GAP | GAP | none | yes |
| TX-4 | GAP | GAP | none | yes |
| TX-5 | GAP | GAP | none | yes |
| TX-6 | GAP | GAP | none | yes |
| TX-7 | GAP | GAP | none | yes |
| TX-8 | GAP | GAP | Advanced CSS `background-clip: text; color: transparent` on a Text: the block goes transparent but its inner `<p>` keeps `rgb(100,116,139)` — the gradient never shows (TX-8-gradient-text.png) | yes |
| TX-9 | PARTLY | PARTLY | Advanced CSS `-webkit-text-stroke: 1px red` reaches the `<p>` | yes |
| TX-10 | GAP | GAP | none | yes |
| TX-11 | GAP | GAP | none | yes |
| TX-12 | PARTLY | PARTLY | Advanced CSS `text-shadow` reaches the `<p>` | yes |
| CU-1 | GAP | GAP | none | yes |
| CU-2 | GAP | GAP | none | yes |
| CU-3 | GAP | GAP | none | yes |
| CU-4 | GAP | GAP | none | yes |
| CU-5 | GAP | GAP | only a static "Tilt" slider | yes |
| MO-1 | HAS (engine-only) | HAS (engine-only) | export `:root`: `--eu-dur-fast 120ms · base 200ms · slow 320ms · slower 500ms`; no control | yes |
| MO-2 | PARTLY (engine-only) | PARTLY | declared `--eu-ease-standard / in / out / in-out / emphasized`; every effect measured uses standard | yes |
| MO-3 | GAP | GAP | no `linear()` in the export | yes |
| MO-4 | PARTLY (engine-only) | PARTLY | 90 ms literal steps, children 2–10 | yes |
| MO-5 | GAP | GAP | no exit set; the only exits are the Alert fades | yes |
| MO-6 | GAP | GAP | no duration / delay / easing / repeat word in any Inspector | yes |
| MO-7 | GAP | GAP | not a surface of the website builder | yes |
| A11Y-1 | HAS | HAS | reduced motion: entrances 0 animations, opacity 1; Lift keeps its shadow, transform `none`, transition 0 s | yes |
| A11Y-2 | HAS | HAS | net in the export: `.eu-root *, ::before, ::after { animation-duration: .01ms; transition-duration: .01ms; scroll-behavior: auto; background-attachment: scroll }` under reduced motion; no `animation-iteration-count` (no loops exist) | yes |
| A11Y-3 | PARTLY | PARTLY | = SC-9 / RX4-5: pauses for a resting mouse, no visible Pause | yes |
| A11Y-4 | HAS | HAS | no `infinite`; the only keyframes besides the entrances / arrivals is `eu-alert-countdown` | yes |
| A11Y-5 | GAP | GAP | = RX4-2: no `(hover: hover)` gate; a tapped Lift block stays lifted | yes |
| A11Y-6 | PARTLY | PARTLY | entrances never hide content (reduced motion: all at opacity 1); pager slides carry no `inert` / `aria-hidden` — Tab from the top reaches the Button on slide 3 while slide 1 shows (A11Y-6-tab.png) | yes |
| A11Y-7 | PARTLY | PARTLY | skip link; forced colours keep the focus ring; no `prefers-contrast`, `prefers-reduced-transparency` or `forced-colors` rule in the export | yes |
| A11Y-8 | GAP | GAP | none | yes |
| A11Y-9 | PARTLY | PARTLY | a Text over an uploaded photo with no tint: Page check says nothing about contrast (A11Y-9-page-check.png) | yes |
| WT-1 | HAS | HAS | no external script; HTML + CSS + JS 11.5 KB compressed; first view 188.5 KB at 360px; Slow 3G first paint 4.16 s | yes |
| WT-2 | PARTLY | PARTLY | hover / entrances use transform, opacity, filter; Lift and Glow animate `box-shadow`; Condense animates `padding-block` + `min-height` (RX4-4). **Correction:** Advanced CSS does NOT refuse layout animation — `transition: height 1s, width 1s; animation: spin 1s infinite` was stored and exported, no message (run 1, WT-advanced-css.png) | yes |
| WT-3 | PARTLY | PARTLY | Glass presets 9.6px; Advanced CSS `backdrop-filter: blur(40px)` exported uncapped | yes |
| WT-4 | GAP | GAP | no grain at all | yes |
| WT-5 | GAP | GAP | no `will-change`, no `content-visibility` in the export | yes |
| WT-6 | PARTLY | PARTLY | a direct `.mp4` Video exports `<video src controls>` with no `preload` and no `poster`; nothing for Save-Data | yes |
| WT-7 | GAP | GAP | the weight tool measures Slow 3G at 360px but never motion on a slowed CPU | yes |

## The eight suspected defects — verdicts

1. **RX4-1 — CONFIRMED: the scroll entrance runs backwards.** Rise up + "Play when it scrolls into view", exported page at
   1280 × 800, mouse wheel 60px a step. Down: y60 op .32 (p .14) → y240 op 1. Up again: y216 op .99 → y156 .91 → y96 .68 → y36
   .02 → y0 op 0 (progress 0). The animation is a `ViewTimeline` (`animation-range: entry 0% cover 28%`), so it is scrubbed, not
   played once. Screens: `RX4-1-scrolling-down.png`, `RX4-1-scrolling-up.png`.
2. **RX4-2 — CONFIRMED: a tapped block stays in its hover look.** Touch phone 390 × 844 (`hover: none`, `pointer: coarse`
   both true). Lift Text before the tap `none`; right after `translateY(-4px)` + shadow; 1.5 s later with the finger gone still
   lifted; only a tap elsewhere clears it. The export has no `(hover: hover)` rule. `RX4-2-touch-after-tap.png`.
3. **RX4-3 — CONFIRMED: "Press" has no press.** Real mouse in the Preview: hover gives `matrix(.995,0,0,.995,0,2)`; holding
   the button down changes nothing further (no property differs between hover and `:active`, for all seven effects); the export
   has 0 `:active` rules. `HV-Press-hover.png`, `HV-Press-pressed.png`.
4. **RX4-4 — CONFIRMED: "Condense" animates layout.** Keyframes `eu-arrive-condense { from { padding-block; min-height } to
   { … } }` on a document ScrollTimeline; the bar goes 182 → 167 → 146 → 128px over 160px of scroll and the next band's top moves
   with it (142 → 87 → −14): the page reflows on every scroll frame. `RX4-4-condensed.png`. (Also bug 3 below.)
5. **RX4-5 — CONFIRMED: no visible Pause.** Pager with "Move on its own every" 3 s: moves every 3 s; visible controls are only
   "Show the previous one", "Show 1/2/3 of 3", "Show the next one" (and those are off-screen — bug 1). It does pause for a resting
   mouse and resumes when it leaves; under reduced motion it does not move at all. `RX4-5-slider-moving.png`, `SC-9-inspector.png`.
6. **V-4 — CONFIRMED: the tint cannot be see-through.** The field shows `#00000066` before anything is chosen, but nothing is
   stored; typing `#00000066` or `rgba(0,0,0,.4)` stores nothing; picking a swatch stores `#374151`, exported as an opaque layer
   over the photo — the pixel reads [69,81,99] and the photo is gone. No alpha control in the popover. `V-4-tint-picked.png`,
   `V-4-tint-export.png`.
7. **V-6 — CONFIRMED: entrances play 320 ms.** `getTiming().duration` 320 for all seven entrances; sampled frames: opacity
   leaves 0 at 29 ms and reaches 1 at 321 ms (≈ 292 ms visible). `--eu-dur-slow` on `:root` is `320ms`, so the `.55s` fallback in
   `REVEAL_DUR` never applies.
8. **V-10 — CONFIRMED: an edge shape cuts its band's shadow.** Shadow "Bold" on two dark bands; 30px below, 3 % from the left:
   straight [238,238,238] (shadow), Curve out [255,255,255] (cut). Only inside the clip polygon does any shadow remain.
   `V-10-shadow-straight.png`, `V-10-shadow-curved.png`.

## Other bugs found (numbered repros)

1. **The pager's arrows and dots are drawn above it, off the page.** Repro: Stack → three Texts → Arrange → "Show one at a
   time" → "Moving between them: Both" → Export (or Preview). At 1280 the nav row is at top −66px (arrows −66, dots −53); at 375 at
   −69px. Nothing is visible; a real click on "Show the next one" times out; only Tab reaches them. In the editor the dots also sit
   above the band (`SC-8-canvas.png`). Measured with Text slides (a short pager); a photo Slider was not measured.
2. **"Curve out" draws nothing.** Repro: band with a background colour → Arrange → Bottom edge "Curve out" → Export. The
   clip polygon reaches past 100 % of the box, but nothing is painted there: below the band the "curve" is page white; with a
   shadow it shows only a grey shadow-shaped bulge over the next band (`ST-1-curve-out-no-shadow.png`, `V-10-shadow-curved.png`).
3. **"Condense" says to set a height under Size, and ignores the one set there.** Repro: band → Size → Height "8rem" → Placement →
   "Sticks when reached" → "Condense": the panel says "this block has no height … Give it one under Size or Spacing", and no
   arrival is emitted (scroll 0 → 500: no change, run 1). Only Background → "Band height" (min-height) or inner spacing makes it work.
4. **A floated block set "Floats on screen" is pinned out of sight on desktop and not held on a phone.** Repro: tall band
   (150rem) → band → Button → Placement "Floating" → "Floats on screen" (no corner choice is offered) → Preview. At 1280 × 800 it is
   `fixed` at top 873px — below the 800px window, never seen; at 375 it is `position: relative` and scrolls away. The panel promises
   "It holds exactly where you placed it, on every screen" (`PN-7-floated-inspector.png`).
5. **A bar's arrival fires before the bar is stuck.** Repro: a second band one screen down → "Sticks when reached" → "Shadow".
   At scroll 60 the shadow is already 50 % in, while the bar is 920px down the page (= PN-9, measured above).
6. **The Link's built-in hover does nothing.** Repro: band → Link → Preview → hover: colour and underline identical
   (`rgb(79,70,229) underline` both) (= HV-1).

Not bugs, measured: EN-3 stagger works (delays 0 / 90 / 180 ms on the children); PN-6 sticky column holds; a slider under
reduced motion stays still.
