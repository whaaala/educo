# Area V — the taste set

**What this is.** The axis map (`AXIS-MAP.md`) says what the builder *can* make. This page says what *looks good*:
a small hand-picked set of best-in-class real examples for each of the seven surface families, chosen as a
designer would, against the design foundation (`../design-foundation/README.md` — colour #2, shadows #5,
whitespace #7, visual hierarchy #8, contrast ≥ 4.5:1). It is the "taste" half of RULE MAP step 5.

**How it was chosen.** Candidates were shortlisted from the stored data only where the surface data or the code
actually uses the family's technique: the live-site records (`research-runs/aw-texture.json`, `wf-overlay.json`,
`wf-shadow.json`, `wf-glassmorphism.json` — `surfaceDom.big[]` backgrounds and `how.css.surface` rules) and the
CodePen archive (`codepen/raw/*.json`). Each shortlisted item's screenshot was then **opened and looked at**
(`C:\Users\eyite\educo-research\shots\…`). Judged on restraint, legibility of the words over the effect, hierarchy,
whitespace, and whether the effect serves the content. Cookie walls, parked domains, blank frames and pens with
poor contrast were rejected. Live sites are preferred; a pen is used where it shows a technique best.
**85 screenshots opened**; 33 picks across 7 families (some examples serve two families and are listed in both).

Screenshot paths are relative to `C:\Users\eyite\educo-research\shots\`.

## 1. Colour & gradients

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| Ryan James Agency | http://www.ryanjamesagency.com/ | `aw-texture/awwwards-com-sites-ryan-james-agency-0-top.jpg` | Dark slate base + two faint radial glows (`radial-gradient(circle, rgba(255,248,85,.10), rgba(255,248,85,.04) 40%, transparent 70%)`) + one yellow accent on the main button only | Main + accent + greys (Rule #2): the glow is ≤ 10 % alpha so white text keeps full contrast, and the single accent colour carries the hierarchy. |
| Agnieszka Guzik ("This site is cooking") | https://agnieszkaguzik.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-agnieszkaguzik-0-top.jpg` | Corner mesh: four `radial-gradient(circle farthest-corner at 100% 150%, coral, transparent 50%)`-style layers from the brand tokens, centre left pale | Colours come from the palette tokens and the centre stays near-white, so dark teal body text sits on the calmest part — colour without hurting reading. |
| Animated Mesh Gradient (pen) | https://codepen.io/syahrizal/pen/raxevgv | `pens/mesh-gradient-raxevgv-0.jpg` | Pale pastel blobs behind a `filter: blur(10rem)` layer on white; near-black headline | The tints are so light (high L in OKLCH) that dark text passes contrast everywhere — a safe default "soft mesh" for light pages. |
| Typography: gradient text (pen) | https://codepen.io/Deckard/pen/bNENeJR | `pens/gradient-text-bNENeJR-0.jpg` | Dark base with three soft coloured `radial-gradient` pools + grain; headline uses `background-clip: text` gradient | Gradient spent on ONE element (the headline) over a quiet dark field — clear visual hierarchy (Rule #8). |

## 2. Backgrounds & photos with overlays

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| Kiawah Island | http://kiawahisland.com/ | `aw-texture/awwwards-com-sites-kiawah-island-0-top.jpg` | Full-bleed photo (`background-size: cover`) + bottom-only scrim: `linear-gradient(to top, navy ~.9, transparent ~45%)` behind the headline and search | The scrim darkens only where the words sit, so the sky stays luminous and the text still clears 4.5:1 — overlay serves the content, not the whole picture. |
| La Pièce / Le Bus Express | http://www.lapiece.com/ | `aw-texture/awwwards-com-sites-la-piece-0-top.jpg` | Video/photo under a deep navy scrim (~60 %), white display type, gold `linear-gradient` buttons; slanted bottom edge into the navy band below | One dominant overlay colour that is also the next section's colour, so the photo and the page read as one palette. |
| Quinta do Lago | https://www.quintadolago.com/ | `aw-texture/awwwards-com-sites-quinta-do-lago-0-top.jpg` | Background video + top-down dark gradient behind the nav + light overall darkening; white serif headline, solid white button | The top gradient guarantees nav legibility over any frame of the video; restraint — no tint, just luminance. |
| Glassmorphism Pricing Table | https://glassmorphism-pricing-table.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-glassmorphism-pricing-table-0-top.jpg` | Busy painterly photo tamed by `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(photo)` in ONE background declaration, plus a 200px noise tile | The flat 50 % black layer is the simplest reliable scrim — makes a loud photo usable as a backdrop for white text. |

## 3. Shadows

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| Subscription Pricing | https://subscription-pricing.webflow.io/ | `wf-shadow/webflow-com-made-in-webflow-website-subscription-pricing-0-top.jpg` | Tinted, offset, soft shadows per card: `box-shadow: 25px 25px 24px rgba(71,56,180,.25)` (blue), `rgba(226,134,192,.5)` (pink) | Shadow colour is a tint of the card's accent, not grey/black (Rule #5: shadows are subtle and coloured to match), and lifts the cards off a pale field. |
| Material elevation ladder (pen) | https://codepen.io/midvok/pen/ZYQqram | `pens/shadow-ZYQqram-0.jpg` | Five tokens `--shadow-z1…z5`, each two layers (`0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)` → larger) | A shadow SCALE, not free values — exactly how the builder's shadow tokens should be offered (small for cards, large only for things that float). |
| #40 Card Hover | https://040-100dwfix.webflow.io/ | `wf-shadow/webflow-com-made-in-webflow-website-040-100dwfix-0-top.jpg` | Hard offset, zero-blur shadow `~8px 8px 0 #000` on a 2px-bordered card | The "brutal/playful" personality's shadow (RULE P): no blur, one colour, deliberate — distinct from soft elevation. |
| Glow Button Shadow (webnomads) | https://webnomads-chart-cloneable-afd376164bfc7.webflow.io/ | `wf-shadow/webflow-com-made-in-webflow-website-webnomads-chart-cloneable-afd376164bfc7-0-top.jpg` | On dark: coloured glow instead of a drop shadow (`box-shadow: 0 0 …px` in the accent), card `0 4px 50px rgba(0,0,0,.25)` | On a dark ground a black shadow is invisible; a low-alpha accent glow does the same "lift" job. |

## 4. Glass, filters & blend modes

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| T.RICKS Glassmorphism | https://tricks-glassmorphism.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-tricks-glassmorphism-0-top.jpg` | ONE glass card (`backdrop-filter: blur(2em)`, translucent white fill, 1px light border) over a 3D object and two big `radial-gradient` colour pools | Glass only works when something colourful sits behind it — here it is a single hero object, and the headline sits on plain dark, not on the glass. |
| Matt Glass Effect | https://ad-matt-glass.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-ad-matt-glass-0-top.jpg` | Frosted panel over two blurred circles on a `linear-gradient(135deg, …)` base; a noise PNG tiled at `25% auto` on top | The noise makes the frost read as a material, and the dark panel keeps bold white type above 4.5:1. |
| MM—018 Glass Navigation Bar | https://glass-navigation.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-mm018-glass-navigation-bar-0-top.jpg` | Small pill nav: `backdrop-filter: blur(8px); background-color: #ffffff1a` over a dark photo; logo uses `mix-blend-mode: multiply` | Glass at small scale, on a functional element only — the calmest, most reusable form. |
| Entor Tech | https://entor-tech.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-entor-tech-0-top.jpg` | Header bar `backdrop-filter: blur(1rem) brightness(50%)` with a hairline border, on a near-black page lit by faint navy/teal radials | `brightness(50%)` inside the filter darkens whatever scrolls behind, so nav text stays legible over any content — glass with a contrast guarantee. |
| Mix Blend Mode | https://webflow.com/made-in-webflow/website/mix-blend-mode | `wf-overlay/webflow-com-made-in-webflow-website-mix-blend-mode-0-top.jpg` | Display word with `mix-blend-mode: difference` over a yellow/black blob — the letters invert per region | A blend mode that keeps the word readable on BOTH colours it crosses; used on one large word, never body text. |

## 5. Textures (grain, noise, patterns)

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| HAUS | http://www.madeinhaus.com/ | `aw-texture/awwwards-com-sites-haus-0-top.jpg` | Flat orange field + `::after` grain tile (`background-image: url(grain-tile.webp); opacity: .24; mix-blend-mode: soft-light; pointer-events: none`) | Grain at low strength over ONE flat colour gives warmth without noise in the type; one tiny tile is cheap (RULE AF). |
| Ryan James Agency (grid pattern) | http://www.ryanjamesagency.com/ | `aw-texture/awwwards-com-sites-ryan-james-agency-0-top.jpg` | Pure-CSS grid lines: `linear-gradient(rgba(255,255,255,.043) 1px, transparent 1px), linear-gradient(90deg, … 1px, transparent 1px)` at `72px 72px`, layer opacity .7 | A pattern at ~4 % alpha is felt, not seen — structure behind the words with zero image weight. |
| Noisy radial gradient card (pen) | https://codepen.io/vivitseng/pen/ZYLRaEb | `pens/noise-ZYLRaEb-0.jpg` | `radial-gradient(circle at 50% 100%, cream 20%, pink 40% 50%, pale 55%)` + SVG `filter: url(#noise)` (feTurbulence) dithering the colour edges | Noise softens a gradient band into a risograph look — texture that serves the colour, small and contained. |
| Noise over gradient (pen) | https://codepen.io/monzanifabio/pen/eYVNywy | `pens/noise-eYVNywy-0.jpg` | `background-image: url(noise.png), radial-gradient(at 40% 20%, …), radial-gradient(at 80% 0%, …)` — noise as the top layer of the same declaration | Grain removes the banding a smooth mesh gradient shows on cheap screens; one extra layer, no extra element. |
| Prizm Labs (paper) | https://prizmlabs.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-prizmlabs-2-scroll.jpg` | Section `background: url(paper BG.webp) cover` — a light paper texture under dark text | Paper under body copy works only when it is this light; it adds the playful personality (RULE P) without touching contrast. |

## 6. Section shapes (edges between sections)

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| Prizm Labs (torn edge) | https://prizmlabs.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-prizmlabs-2-scroll.jpg` | Purple band ends in a torn-paper edge image laid over the next, paper-textured section | A live site whose irregular edge matches its own texture and personality — the shape means something. |
| La Pièce (slant) | http://www.lapiece.com/ | `aw-texture/awwwards-com-sites-la-piece-0-top.jpg` | Hero photo cut by a shallow diagonal (about 2–3°) into the navy band that carries the tagline and CTA | A slant this shallow adds movement without wasting space or cropping the photo's subject. |
| SVG Section Divider — CodyHouse (pen) | https://codepen.io/codyhouse/pen/Powbyma | `pens/divider-Powbyma-0.jpg` | Inline SVG path (rough brush edge) at the boundary, filled with the next section's colour | Organic edge, small amplitude, generous whitespace on both sides (Rule #7). |
| Rounded Section Dividers (pen) | https://codepen.io/alexwright/pen/zYBWExe | `pens/divider-zYBWExe-1.jpg` | Only `border-top-right-radius` / `border-bottom-left-radius: 10rem` on alternating sections + a `::before` filler in the next colour; the image overlaps the edge (`margin-top: -10vw`) | Pure CSS, no SVG — maps straight onto our per-corner radius controls, and the overlapping image ties the sections together. |
| Wavy Responsive Footer (pen) | https://codepen.io/SpectacledCoder/pen/yLmrKPa | `pens/wave-yLmrKPa-0.jpg` | One low-amplitude SVG wave as a `background` data-URI, two tints of the same light blue | Tonal wave (tint on tint) — the gentlest shape, safe on any page and personality. |
| Shape-Divider (pen) | https://codepen.io/eyupucmaz/pen/wvMgBdr | `pens/divider-wvMgBdr-0.jpg` | White SVG chevron (`height: 80px`, `width: calc(100% + 1.3px)` against the sub-pixel seam; 60px on mobile) cut into the top of a photo band | Shows the two practical details: a tiny overdraw and a shorter shape on phones. |

## 7. States (hover / scroll on surfaces)

| Example | Where | Screenshot file | Technique | Why it is good |
|---|---|---|---|---|
| Kiawah Island — ghost button | http://kiawahisland.com/ | `aw-texture/awwwards-com-sites-kiawah-island-0-top.jpg` → hover `…-h0-650.jpg` | Outlined button over the photo fills solid navy with white text on hover (`color`, `background`, `border` change) | Unmistakable without movement, so reduced-motion safe, and both states pass contrast. |
| Pulpfingers — card lift | http://www.pulpfingers.com/ | `aw-texture/awwwards-com-sites-pulpfingers-0-top.jpg` → hover `…-h1-650.jpg` | Card `transform: translateY(…)` + larger `box-shadow`, `transition: all .2s ease-in-out` | The classic elevation state: rest = a low shadow token, hover = one step up the scale. |
| #40 Card Hover — press | https://040-100dwfix.webflow.io/ | `wf-shadow/webflow-com-made-in-webflow-website-040-100dwfix-0-top.jpg` → hover `…-h0-650.jpg` | Hard offset shadow collapses to zero as the card translates into it (`box-shadow, transform .6s`) | The inverse of the lift — the card "presses in"; pairs with the hard-shadow personality. |
| Prizm Labs — glass nav on scroll | https://prizmlabs.webflow.io/ | `wf-glassmorphism/webflow-com-made-in-webflow-website-prizmlabs-0-top.jpg` vs `…-2-scroll.jpg` | Sticky nav `backdrop-filter: blur(20px); background-color: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.2)` frosts whatever scrolls under it | A scroll state with no JS: the surface reacts to content through `backdrop-filter`, and the nav stays readable over every section. |
| Cursor-tracking glow cards (pen) | https://codepen.io/ahmodmusa/pen/raVXqZM | `pens/hover-effect-raVXqZM-1.jpg` | `.glow-spot { background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%); top: var(--gy); left: var(--gx) }` — JS writes the pointer position into custom properties | A ~15 % accent glow inside the card lights the surface without covering the words; degrades to a static card on touch. |

## What the builder should learn

1. **One effect per surface, one hero per page.** Every good pick spends glass, gradient text or a glow on ONE
   element (a card, a nav, a headline) over a quiet field; the rejects layered effects on everything.
2. **Darken only where the words are.** The best photo overlays are partial (bottom scrim, a gradient behind the
   nav) or one flat 50 % layer for loud photos — offer scrim position + strength, and assert contrast on the result.
3. **Effects live at low alpha.** Glows ≤ 10 %, grid patterns ~4 %, grain 0.2–0.3 with `soft-light`: felt, not
   seen. Defaults start there; the strength control goes up from them.
4. **Shadows are a scale and a colour, not free numbers.** z1–z5 elevation tokens, tinted from the surface's
   accent, a glow instead on dark backgrounds; the hard zero-blur offset is a separate personality choice.
5. **Glass needs a colourful backdrop and a contrast guarantee.** Allow it where something sits behind it, and
   build `brightness()` or a tinted fill into it so text stays legible over any content.
6. **Grain is the finisher for gradients.** One small noise tile as the top background layer kills banding and
   adds material — cheap enough for 3G (RULE AF).
7. **Section shapes are shallow and tonal.** Slants of 2–3°, low waves, rounded corners via the existing
   per-corner radius, filled with the NEXT section's colour; shorter on phones, with a 1px overdraw.
8. **States change colour or elevation first, motion second.** The strongest hovers (fill, lift, press, frost)
   read without animation, so `prefers-reduced-motion` loses nothing and touch screens need no hover.
