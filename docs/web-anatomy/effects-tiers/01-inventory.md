---
title: The effects and motion inventory — every capability, its values, how it is made and how often real sites use it (BATCH RX-4)
---

# The effects and motion inventory (BATCH RX-4 step 1, 2026-10-16)

One row per capability of [00-capabilities.md](00-capabilities.md). Built ONLY from research already in the repo — no
new browsing. Our own HAS · PARTLY · GAP is NOT here: it is step 3 (THE EVIDENCE), measured through the UI, headed.

## 0. The data

| Code | Source | n |
|---|---|---|
| **AGG** | `research-runs/AGGREGATE.md` — live sites, cache off, desktop 1440 + phone 360 (2026-10-02) | **741** sites |
| **LIB** | the recounts in `motion/library/1…11` (same runs, re-counted from raw records) | 732 / 763 / 678 |
| **AW300** | `motion-effects.md` §9 — code fingerprint of award sites (Transitions + Animation) | 300 sites |
| **AWT** | Awwwards "Transitions" collection, kind by title (`awwwards-motion-survey.md`, `motion-effects.md` §9) | 366 items |
| **UIV** | uiverse elements run locally (AGGREGATE) | 3,802 |
| **CP** | CodePen tags, every pen opened (`codepen/*.md`, AGGREGATE) | pens per tag |
| **CR** | the layout crawl (cited by the library) | 4,250 pages |
| **RW** | `area-v/AXIS-MAP.md` step 6 — 360 × 640 DPR 2, CPU ×6, Slow 3G | 17 effects × 3 runs |

**Frequency caveats.** A CSS-feature share (e.g. `mix-blend-mode` 42%) is "appears somewhere in the stylesheet" — an upper
bound on what a visitor sees. Award sites are heavier and showier than a school or business site, so a share here is a
ceiling for our users, not a floor. "n.s." = not separable in the runs.

**"Do without?"** = can a basic school / small-business site ship without it. **no** = it is missing in a way a visitor
or the person building meets at once (a candidate Must). **yes** = the page works and reads well without it.

**Batch** = the AREA V / layout batch in `docs/TASK_TREE.md` that already holds work on it (with the ledger line), or
**none**. VB-1 colour & backgrounds · VB-2 motion safety + tokens · VB-3 pager + alerts · VB-4 motion ledger rest ·
VB-5 Educo app motion · VB-6 effects LATER · S-4 section transitions · L-14 / L-15 sticky & fixed · G-5b overlap ·
RX-2 motion research still to do.

## PT · Page transitions (library family 4; `motion/03-page-transitions.md`; `codepen/page-transition.md` · `view-transition*.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| PT-1 | instant full load | nothing — the fallback | full load, nothing animates **24%** (AGG); 18% (LIB, n 678) | no — it IS the baseline, must stay fast | none (needs nothing) |
| PT-2 | cross-fade · duration | `@view-transition { navigation: auto }` + `::view-transition-old/new(root)` keyframes; 0 JS | VT CSS present **6%**, cross-document VT CSS **1%**, ran 0.4% (AGG/LIB); VT referenced by 30 of 60 newest Awwwards sites (AW300) | yes — but the cheapest "finished" feel; zero weight | RX-2 (page transitions research) |
| PT-3 | forward / back · axis | VT `types` (`:active-view-transition-type(back)`) + translate keyframes | inside the VT share (AGG 6%) | yes | RX-2 |
| PT-4 | clip wipe (radial, diagonal, blinds) · colour cover | `clip-path` keyframes on `::view-transition-new`, or a fixed cover layer (Barba / Swup) | spa + overlay **10%**, cover before leaving **3%** (AGG); real moving cover 13% + 4% (LIB); mask/clip wipes **48 of 366** (AWT); Barba 8%, Swup 1% (AGG) | yes | RX-2 |
| PT-5 | header / footer held | `view-transition-name: header` on the shared regions | n.s. | yes | none |
| PT-6 | card → detail morph | matching `view-transition-name` on both pages | n.s.; "page / project to page" 64 items (AWT) | yes | none |
| PT-7 | tabs · filters · slides | `document.startViewTransition()` around the DOM change | same-document VT ran **1%** (AGG) | yes | none |
| PT-8 | prefetch on hover · prerender | `<script type="speculationrules">` | n.s. | yes (helps 3G, RULE AF) | none |
| PT-9 | push / pop · fade-through · predictive back | React Navigation transitions (native) | every phone OS (library 4 F4.12–14) | no for the app (platform norm) | VB-5 |

## ST · Section transitions / band edges (family 3; `motion/01-section-transitions.md`; `area-v` §7; `codepen/divider*.md` · `wave.md` · `clip-path.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| ST-1 | slope · curve × top / bottom / both × depth 0–30% × flip | `clip-path: polygon()` / `path()` / `shape()` | `clip-path` anywhere **43%** (AGG, upper bound); CP clip-path 508 pens | yes — but a staple of school templates | S-4 (ST-4 shapes) |
| ST-2 | transparent cut · next band's colour | SVG divider whose fill = neighbour's background | n.s. | yes — but a slope that shows the PAGE colour looks broken | S-4: ST-1 |
| ST-3 | wave · zigzag · triangle · cloud · torn · scallop · drip · mountain · brush | inline SVG path, `mask-image`, `shape()` | `mask` anywhere **32%** (AGG, upper bound); Magnific 548 dividers (AXIS-MAP step 4) | yes | S-4: ST-4 |
| ST-4 | 1 · 2–3 translucent layers | several SVG paths / masks | n.s. | yes | S-4 (with ST-4) |
| ST-5 | none · overlap by N (rem) | negative margin + z-index, or a grid row shared by two bands | n.s.; template staple (LAYOUT_BENCHMARK A12/B12) | yes | G-5b (S-4: ST-5) |
| ST-6 | static · drifting · scroll-morphing | keyframes on the path; `animation-timeline: view()` | n.s. | yes | S-4 (moving wave) |
| ST-7 | off · proximity · mandatory | `scroll-snap-type: y mandatory` on the page | y mandatory snap **11%** (LIB, mostly carousels / decks) | yes | none |
| ST-8 | clip · mask wipe, scroll-linked | `clip-path` on `animation-timeline: view()` | clip-path changes while scrolling **5%** (LIB); 48 wipes of 366 (AWT) | yes | none |
| ST-9 | off · on | footer `position: sticky; bottom: 0` under a `main` with a background + z-index | n.s. | yes | none |
| ST-10 | — | `filter: drop-shadow` on a wrapper OUTSIDE the clip | the 9 clashes of 241 ablations were all this (AXIS-MAP 3b) | no once ST-1 ships — a shaped band otherwise loses its shadow | none (ledger V-10, unbatched) |

## BL · Sections and backgrounds blending into each other (family 3 T5/T7/T10/T14, family 10 10.10–10.12; `area-v` §3 · §5 · §7)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| BL-1 | hard edge · fade (length) | last stop of band A's gradient = band B's colour; or a gradient band between | "colour field / gradient" **25 of 366** (AWT); n.s. on live sites | yes — but the user named it a must (RX-4) | none |
| BL-2 | per band · shared across N bands | one background on the parent of several bands (or `background-attachment: fixed`) | n.s. | yes | none |
| BL-3 | flat · gradient scrim × direction (top/bottom/side/vignette) × opacity 0–100% | top `background` layer or `::before` | photo + scrim used by 3 of 4 taste picks in "photos with overlays" (taste-set); cost **free** (RW) | **no** — words over a hero photo are unreadable without it (A11Y-9) | VB-1 (V-2 overlay dropped on components, V-4 opaque tint) |
| BL-4 | 16 modes (multiply, screen, difference…) + `isolation` | `mix-blend-mode` | `mix-blend-mode` in CSS **42%** (AGG); held element with a blend **10%** (LIB) | yes | VB-6 (AC-14 blend modes) |
| BL-5 | 16 modes between layers | `background-blend-mode` | n.s. (inside the 42%) | yes | VB-6 (AC-14) |
| BL-6 | linear / radial fade · SVG shape | `mask-image: linear-gradient(black 70%, transparent)` | `mask` anywhere **32%** (AGG) | yes | none |
| BL-7 | colour per section, smooth hand-over | IntersectionObserver sets a body custom property; or `view()` timeline | n.s. (Awwwards titles name it) | yes | none |
| BL-8 | invert · swap per band | `mix-blend-mode: difference`, or blockers per band | held element with a blend **10%** (LIB H6 / T14) | yes | none |
| BL-9 | off · on | hero `position: sticky; top: 0` + next band higher `z-index` | n.s. | yes | L-15 (SP-7 stay-behind) |
| BL-10 | off · on | each band `clip-path: inset(0)` over a `position: fixed` picture | n.s. | yes | VB-6 (SP-10) |
| BL-11 | blur 4–24px × fill opacity × hairline | `backdrop-filter: blur() saturate()` + translucent fill + `@supports` fallback | `backdrop-filter` in CSS **40%** (AGG); glass TOP bar **2%** (AGG); RW: blur 12px on every card loses **⅓ of frames**, one glass bar is affordable | yes | VB-4 (MR-3 glass arrival); cap is WT-3 |

## BG · Backgrounds (`area-v/AXIS-MAP.md` §2 · §6; family 10)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| BG-1 | any colour, alpha 0–1, tokens | `background-color`, `oklch(… / a)` | universal | **no** | VB-1 (alpha: V-4, V-8) |
| BG-2 | linear · radial · conic × angle × position × stops × colour space × repeating | `linear-gradient(in oklch, …)` | 45-palette + 33 mesh presets in builder (AXIS-MAP); gradients cost **free** (RW) | yes — but very common in templates | VB-1 (V-8 stop alpha; AXIS-MAP V-7 radial position) |
| BG-3 | 2–4 blobs × blur × colours | stacked `radial-gradient`s, or blurred blobs | aurora = blurred blobs **90** pens (AXIS-MAP step 4); 2 taste picks | yes | none |
| BG-4 | cover · contain × 9 points × repeat | `background-image/size/position/repeat` | universal on heroes | **no** | VB-1 |
| BG-5 | colour / gradient under a photo | last layer of the `background` list | n.s. | yes — but a broken photo URL leaves a blank band without it | VB-1 (V-9 base dropped) |
| BG-6 | scroll · fixed · (iOS / low-end fallback) | `background-attachment: fixed` + `@supports` / touch fallback | CP parallax 890 pens: fixed 26% | yes | L-15 (SP-11 fallback) |
| BG-7 | muted loop · poster · pause | `<video autoplay muted loop playsinline poster>` | 1 taste pick (Quinta do Lago); n.s. | yes (heavy — RULE AF) | none |
| BG-8 | 25 patterns × tile size × colour | `repeating-*-gradient`, SVG `<pattern>` | SVG `<pattern>` 60 pens, halftone 63 (AXIS-MAP step 4); builder has 25 | yes | none |
| BG-9 | fractal / turbulence × grain size × strength 2–30% × blend | SVG `feTurbulence` data-URI tile | grain on a band **free**, on a fixed full-page layer **−40% frames** (RW) | yes | none |
| BG-10 | drift · angle turn · moving grain | `@property --a` + keyframes; `steps()` grain | moving grain `steps()` 39 pens; moving grain redraws every frame (RW) | yes | none |
| BG-11 | shader · particles · 3D | three.js / canvas | `lib:three` **59%**, canvas 38% (AGG) — award-site bias; WebGL 37% (AW300) | yes — out of scope beyond curated, pausable presets (`motion-effects.md` §9 point 4) | none |

## HV · Hover / focus / press / selected, at every level (family 6; `motion/04-hover-focus.md`; `codepen/hover*.md`)

Sites share = sites where ≥ 1 probed element does it (LIB, n 678); element share = of 3,143 hovered elements (AGG).
**Any visible hover change: 68% of sites** (LIB). Hover transition median **300 ms**, **74%** change with no own transition.

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| HV-1 | text · background × colour | `transition: color, background-color` | text colour **28%** sites, self 11% / child 6% of elements; background **20%** (LIB/AGG); UIV buttons 22% | **no** — links and buttons must show they act | VB-2 (MR-6 gate, tokens) |
| HV-2 | lift Y · scale × amount | `transform: translateY(-.25rem) scale(1.02)` | something moves **37%** sites (child 10%, self 4%); UIV buttons 36% | yes — but the common card cue | VB-2 (MR-6) |
| HV-3 | zoom 1.03–1.1 | `img { transition: transform }` inside `overflow: clip` | inside the 37% | yes | none |
| HV-4 | nudge · roll · swap | translate on the icon / two stacked labels | inside child:transform 10% | yes | none |
| HV-5 | appear · thicken · colour | `outline` / `box-shadow` ring / `border-color` | **27%** sites (self 10%, child 6%) | yes | none |
| HV-6 | grow from left / centre · thicken | `background-size` on a gradient underline, or `::after scaleX` | **7%** sites, 2% elements | yes | none |
| HV-7 | grow on hover · shrink on press | pre-drawn shadow on `::after`, fade its opacity (10.14) | **5%** sites; UIV buttons hover **24%**, press 16% | yes | VB-6 (AC-7 halo hover) |
| HV-8 | fade self · dim the others | `opacity`; `.group:has(:hover) > :not(:hover)` | opacity **23%** sites | yes | VB-6 (AC-12 group hover) |
| HV-9 | left→right · centre-out | `::before` `scaleX` / `background-position` sweep | UIV `::before transform` 149 of 1,231 buttons | yes | VB-6 (AC-18 sweeping fill) |
| HV-10 | caption · overlay · clip reveal | overlay `opacity` / `clip-path` on hover AND focus-within | clip/mask reveal **1%** sites | yes — and dangerous: content hidden until hover fails on touch (A11Y-5) | VB-4 (HV-21 focusable child at opacity 0) |
| HV-11 | brighten · grayscale → colour · blur | `filter` | **3%** sites | yes | VB-6 (AC-16 image filters) |
| HV-12 | parent drives children · child's own composes | `.card:hover .btn`, `:has()`; own rule beats inherited | parent:* ≤ 1% each, child:* 10% / 6% (AGG); `:has()` in CSS 22% | yes — but RULE MAP asks for it at every level | ledger V-13 (unbatched); VB-6 (AC-12) |
| HV-13 | outline width · offset · colour (token) | `:focus-visible { outline: 2px solid; outline-offset }` | Tab stops with a visible ring **74%**; sites with none **20%** (LIB) | **no** — WCAG 2.4.7 | VB-2 (SH-7 ring via box-shadow only) |
| HV-14 | every hover has a focus twin | `:is(:hover, :focus-visible)`, `:has(:focus-visible)` | `:focus-visible` in CSS **36%** (AGG); UIV styled 1.3% | **no** — keyboard users | VB-2 |
| HV-15 | dip · shrink · state layer · ripple | `:active { transform: scale(.97) }` | UIV buttons with `:active` **39%**, press transform 29% | yes — but cheap and expected on phones | VB-2 (HV-17 1px in px) |
| HV-16 | current page · chosen tab · open item | `[aria-current="page"]`, `[aria-selected]`, `[open]` styled | n.s. | **no** — "where am I" in the nav | none |
| HV-17 | pointer on links / buttons | `cursor: pointer` | hovered element shows the hand **85%** (LIB) | **no** (expected) | none |
| HV-18 | from the entry side · by distance | JS pointer position → custom property | n.s. (6.24) | yes | none |

## EN · Entrance / reveal (family 5; `motion/05-entrance-exit.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| EN-1 | fade · rise · zoom · blur × distance × once | IntersectionObserver adds a class, or `animation-timeline: view()` | translates on scroll **67%**, fades **55%**, scales 36% (AGG); IntersectionObserver **59%** (AW300); real `view()` ≤ 1% (AGG) | yes — but the single most common "alive" cue | VB-2 (V-6 REVEAL_DUR), VB-4 (NEW-C1 @supports) |
| EN-2 | fade · rise on load | `@keyframes` on first paint | `@keyframes` in CSS **83%** (AGG) | yes | VB-2 (tokens) |
| EN-3 | step 40–90 ms, capped ~500 ms | `animation-delay: calc(var(--i) * step)` | split headings 19% (text form; card stagger n.s.) | yes | VB-2 (EX-6 cap) |
| EN-4 | cover · counter · logo | full-screen fixed layer removed on load | OPAQUE full cover at 0.7 s **36%** (AGG), 34–38% (LIB); gone by load 3% | **yes** — and harmful on 3G (RULE AF) | none |
| EN-5 | fade / rise from `display: none` | `@starting-style` + `transition-behavior: allow-discrete` | **1%** (AGG) | yes | RX-2 (entrance research) |
| EN-6 | fade / slide out ≤ 0.75 × enter | exit class, then `transitionend` → remove | n.s. | yes | VB-3 (EX-10 inert while leaving) |
| EN-7 | overlay · drawer × side | `<dialog>` / `popover` + `@starting-style`; scroll lock; Esc; focus return | desktop menu button **24%** (AGG); phone menu opens **80%**; menu/overlay transitions **42 of 366** (AWT) | **no** — every phone needs its menu to open (component work) | none (Navigation component) |
| EN-8 | dialog · popover · dropdown · tooltip | `<dialog>`, `popover`, anchor positioning | anchor positioning 8% (AGG); UIV tooltips open on focus **0 of 62** | yes for effects — no for tooltips reachable by keyboard | none |
| EN-9 | height · fade | `<details>` + `interpolate-size: allow-keywords` / grid-rows trick | n.s. | yes | VB-4 (EX-5 flex-grow) |
| EN-10 | slide · fade × auto-dismiss + pause | live region + exit animation | UIV notifications 96% animate at rest | yes | VB-3 (EX-3, MR-5, N1/N2) |
| EN-11 | add · remove · reorder | FLIP / VT on list change | n.s. | yes | none |

## SC · Scroll-driven motion (family 2; `codepen/parallax.md` · `scroll-animation.md` · `scroll-driven-animations.md` · `horizontal-scroll.md` · `marquee.md` · `scrollytelling.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| SC-1 | speed 0.1–0.9 (median 0.15) | `animation-timeline: view()` translate; JS fallback | element moving 0.1–0.9 of the scroll **24%** (AGG); CP parallax **890** pens (the biggest tag) | yes | none (RX-2 research) |
| SC-2 | 2–4 layers | several layers at different speeds | inside SC-1 | yes | none |
| SC-3 | translate · scale · rotate · fade · clip · filter | `animation-timeline: scroll()/view()` + `animation-range` | scale 36%, rotate 27%, clip 4%, filter 4% (AGG); `animation-timeline` CSS 7%, REAL timeline 1% (AGG); GSAP ScrollTrigger 9% (AGG) / 39% (AW300) | yes | VB-4 (NEW-C1) |
| SC-4 | top bar · thin | `animation-timeline: scroll(root)` `scaleX` | thin fixed bar ≤ 8 px **1%** (LIB) | yes | none |
| SC-5 | link highlights its section | IntersectionObserver → `aria-current` | n.s. | yes (one-page sites want it) | none |
| SC-6 | track N screens wide | sticky parent + translateX on scroll | ≥ 3-screen track **7%** (LIB); CP horizontal-scroll 91 pens | yes | none |
| SC-7 | speed · direction · pause on hover | `@keyframes` translateX on a duplicated track | marquee CSS **25%**, named marquee keyframes 9% (AGG); 12 s is the most common animation duration (534) | yes — and needs Pause (A11Y-3) | none |
| SC-8 | snap mandatory / proximity × arrows × dots | `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain` | `scroll-snap` **21%** (AGG); horizontal snap 16% (LIB); Swiper 9% | yes — but galleries / testimonials use it widely | VB-3 (NEW-A1 overscroll, NEW-B3 inert) |
| SC-9 | interval · Pause · stop on focus | timer + visible Pause button | moves with no scroll (carousel / marquee / loop) **51%** (AGG) | yes — if present, Pause is a must | VB-3 (MR-4, MR-16) |
| SC-10 | inset → full bleed | `clip-path: inset()` on `view()` | clip-path changes on scroll **5%** (LIB) | yes | none |
| SC-11 | draw on view | `stroke-dashoffset` on `view()` | n.s. | yes | none |
| SC-12 | off · Lenis-style inertia | JS library | Lenis **16%**, Locomotive 4% (AGG); smooth scroll 33% (AW300) | **yes** — adds JS, fights native scroll; reduced motion | none |

## PN · Held / pinned scenes (family 1; `../scroll-and-position/`; `codepen/sticky*.md` · `fixed-*.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| PN-1 | sticky · fixed × top offset | `position: sticky; top: 0` (+ flow space if fixed) | FIXED top bar with links **36%**, sticky **3%** (AGG); any fixed element 85%; CP sticky 585 pens | **no** — expected by most visitors | L-14 (SP-9 flow space, SP-12 gallery) |
| PN-2 | transparent → solid / glass at N px | scroll-driven or IntersectionObserver class | **77%** of held top bars are see-through at rest (LIB H2) | yes — but the hero-over-photo norm | VB-2 (MR-2 never fills), L-14 (SP-3 pinArrival) |
| PN-3 | condense · hide down / show up | scroll direction listener → class (paint-only change) | header transitions median 400 ms (LIB); CP fixed-header jQuery 45% | yes — leaning MUST on phones (L-14 SP-2) | L-14 (SP-2), VB-4 (MR-3, NEW-B2) |
| PN-4 | pin length 1.8–N screens × steps | `position: sticky` inside a tall parent; steps by `view()` | pinned scroll section **17%**, GSAP pin-spacer 4% (AGG) | yes | none |
| PN-5 | queue · stack | sticky siblings each `top: 0` with rising z-index | 3+ tall sticky elements **4%** (LIB) | yes | L-15 (ST-7: Queue / Stack decided) |
| PN-6 | left / right × top offset × own scroll | `position: sticky; align-self: start; max-height; overflow: auto` | side rail **3%** (LIB); sticky sidebars 4.0% of 4,250 pages (CR) | yes | L-15 (SP-8) |
| PN-7 | back to top · chat · WhatsApp | `position: fixed; inset-block-end; inset-inline-end` | desktop **11%** (LIB) | yes — but a WhatsApp button is a regional norm (RULE AF) | none |
| PN-8 | CTA bar · cookie / consent | fixed bottom bar, safe-area inset | cookie / consent held **20%** (LIB) | yes — cookie notice is a legal / component question | none |
| PN-9 | stuck · snapped style | `container-type: scroll-state` / IntersectionObserver sentinel | `scroll-state` **1 site** of 763 (LIB) | yes | none |

## TX · Text effects (family 9)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| TX-1 | rise per line out of a mask | split by line at export, `overflow: clip` per line | inside split headings 19% (AGG) | yes | none |
| TX-2 | by word · letter × step | spans + `aria-label` on the parent | split headings **19%** (AGG); split library 8% (AGG), 33% (AW300) | yes | none |
| TX-3 | words fill as you read | `view()` timeline on `background-size` / colour | `view()` 4% (AGG); CP animation-timeline 41% of 93 pens use `view()` | yes | none |
| TX-4 | typed · cursor blink | `steps()` keyframes on width | ≥ 3 sites (LIB lower bound) | yes | none |
| TX-5 | cycle N words | keyframes / VT on a word | n.s. | yes | none |
| TX-6 | random chars settle | JS | ≥ 4 sites (LIB lower bound) | yes | none |
| TX-7 | letters roll | two stacked letter rows, translateY | n.s. | yes | none |
| TX-8 | gradient · shimmer | `background-clip: text` + gradient (+ moving position) | 1 taste pick; n.s. | yes | VB-6 (AC-11 gradient text) |
| TX-9 | outline · fill on hover / scroll | `-webkit-text-stroke` + clip | text-stroke **47** pens (AXIS-MAP step 4); ≥ 6 sites | yes | none |
| TX-10 | sweep behind words | `background-size` on a `<mark>` gradient | n.s. | yes | none |
| TX-11 | weight · width | `font-variation-settings` transition | n.s. | yes | none |
| TX-12 | halo · soft shadow | `text-shadow` | n.s.; taste picks rely on scrims instead (BL-3) | yes (BL-3 does the job) | none |

## CU · Cursor / pointer (family 6 6.21–6.24; `codepen/cursor.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| CU-1 | dot · ring · label × lag | fixed element moved by `pointermove` + rAF; native cursor kept | custom cursor **18%**, native hidden 6% (AGG); CP cursor tag (largest hover-side tag after hover) | **yes** — no use on touch, a11y risk if native hidden | none |
| CU-2 | difference · exclusion | `mix-blend-mode: difference` on the follower | 15 of 220 followers (LIB 10.12) | yes | none |
| CU-3 | pull strength · radius | pointer offset → `translate` on the button | n.s. (6.22) | yes | none |
| CU-4 | spotlight · glow · border light | JS sets `--x / --y`, `radial-gradient(at var(--x) var(--y))` | spotlight 30 pens; 91 set a custom property from JS (AXIS-MAP step 4); shadow follows pointer 48 | yes | none |
| CU-5 | tilt ° · glare | `perspective` + rotateX/Y from pointer | n.s. (6.23) | yes | none |

## MO · Motion tokens (family 11; `motion/06-motion-rules.md`; `motion-effects.md` §3)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| MO-1 | proposed 150 · 300 · 400 · 500 + instant / page / reveal / loop (today 120 · 200 · 320 · 500) | `--eu-dur-*` from `tokensToCss` | durations used: 300 ms **25,686** el., 200 ms 12,412, 400 ms 9,057; median **350 ms** (AGG); UIV median 300 ms | **no** — every effect needs one consistent clock | VB-2 (MR-9, V-6, EX-2) |
| MO-2 | standard · out (.23,1,.32,1) · in-out · emphasised | `--eu-ease-*` | `ease` 40,248 (unchosen default), ease-in-out 9,481, easeOutCubic 3,446, M3 legacy (.4,0,.2,1) 3,290 (AGG); GSAP power2/3.out, expo.out (AGG / AW300) | **no** | VB-2 (MR-9 `emphasized` overshoot) |
| MO-3 | spring presets | CSS `linear()`; native springs | `linear()` in CSS **1–2%** (AGG/LIB) | yes | VB-2 (MR-9) |
| MO-4 | step · cap ~500 ms | `--eu-stagger`, capped | n.s. | yes | VB-2 (EX-6) |
| MO-5 | exit ≤ 0.75 × enter | token rule | n.s. (11.5) | yes | VB-2 |
| MO-6 | duration · delay · easing · repeat per effect | Inspector fields writing tokens / overrides | n.s. | yes — presets first | VB-6 (AC-6) |
| MO-7 | one scale, web + native | shared token file read by both | 0 of 77 Codrops demos read a token (LIB 11) | **no** for Educo (RULE APP) | VB-5 (AM-1, native literals) |

## A11Y · Accessibility (family 11 11.6–11.16; `codepen/reduced-motion.md`)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| A11Y-1 | per family: fade · instant · still frame | `@media (prefers-reduced-motion: reduce)` per effect | CSS mentions it **23%**; still moves on scroll when asked not to **72%** (AGG); 47 of 60 newest Awwwards ship it (AW300) | **no** — WCAG 2.3.3, and Educo does it by construction | VB-2 |
| A11Y-2 | loops stop at 1 iteration | global reduce rule: `animation-iteration-count: 1` | UIV loaders run under reduce **97%** | **no** | VB-4 (MR-17) |
| A11Y-3 | visible Pause / stop | button + `animation-play-state` | moves with no scroll **51%** of sites (AGG) | **no** wherever something auto-moves (WCAG 2.2.2) | VB-3 (MR-4, MR-5) |
| A11Y-4 | ≤ 3 flashes / s | lint on keyframes | n.s. | **no** (WCAG 2.3.1) | none |
| A11Y-5 | hover gated · tap equivalent | `@media (hover: hover) and (pointer: fine)` | hover rules gated **23%** of sites, 30% of sites with `:hover` (AGG/LIB) | **no** — a tapped card stays lifted otherwise | VB-2 (MR-6) |
| A11Y-6 | `inert` while leaving / off-screen; nothing focusable at opacity 0 | `inert`, `visibility` | n.s. | **no** | VB-3 (EX-10, NEW-B3), VB-4 (HV-21) |
| A11Y-7 | reduced transparency · more contrast · forced colours | `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors` | n.s. | yes for the first two; **no** for forced colours (focus must survive) | VB-2 (SH-7) |
| A11Y-8 | on-page motion switch | a toggle that sets a root class | n.s. (11.8) | yes | none |
| A11Y-9 | 4.5 : 1 over photo / gradient / glass | measured contrast + scrim nudge | n.s.; 20% of sites show no focus ring at all (LIB) | **no** (WCAG 1.4.3) | VB-1 (V-12 contrast hint) |

## WT · Weight / performance (family 11 11.11–11.13; `area-v` step 6; RULE AF)

| ID | Values | How it is made | Frequency (source) | Do without? | Batch |
|---|---|---|---|---|---|
| WT-1 | CSS first; any library opt-in | export emits CSS + tiny inline JS only | GSAP **17%**, Lenis 16%, three 59% (AGG); median page **3,142 KB**, only **23% ≤ 1 MB** (AGG) | **no** — RULE AF's 100 KB budget | none (RULE AF guard) |
| WT-2 | transform · opacity only | lint the effect catalogue for layout properties | transitioned: opacity 21,976, transform 19,843, colour 11,837 (AGG); long tasks while scrolling median 0 ms (AGG) | **no** | VB-4 (EX-5, MR-3) |
| WT-3 | glass ≤ 12px default, warn above, few elements | Inspector cap + Page check warning | RW: blur 12px every card −⅓ frames, 24px −½; one glass bar OK | **no** once glass is offered | none |
| WT-4 | grain on band; moving texture opt-in, off under reduce | export rule | RW: fixed full-page grain −40% frames; moving grain 3.13 ms raster / frame | **no** once grain is offered | none |
| WT-5 | `will-change` in time · `content-visibility: auto` | added on start, removed on end | n.s. (11.12) | yes | none |
| WT-6 | poster-first · lazy · off on Save-Data / 360px | `preload="none"`, `prefers-reduced-data`, media queries | n.s. | **no** for video / WebGL backgrounds (RULE AF) | none |
| WT-7 | 360 × 640 DPR 2 · CPU ×6 · Slow 3G | `scripts/uat/r2-realworld.js` profile | phone sideways overflow at 360px **11%** of sites (AGG); phone figures re-measure pending R-16 | **no** — it is how every Must is checked | RX-1 (R-16 phone re-measure) |

## Summary

- **131 capabilities** across 13 axes (the layout list had 132).
- **Top by frequency on real sites (AGG, 741):** fixed element 85% · keyframes 83% · scroll translate 67% / fade 55% ·
  any hover change 68% (LIB) · hand cursor 85% (LIB) · focus ring 74% (LIB) · something auto-moves 51% · `clip-path` 43% ·
  `mix-blend-mode` 42% · `backdrop-filter` 40% · opaque intro cover 36% · fixed top bar with links 36% · `mask` 32% ·
  text colour on hover 28% · border on hover 27% · marquee CSS 25% · parallax 24% · page-transition overlays 13% (LIB) ·
  View Transitions 6%.
- **Already held by a batch:** BL-3/BG-1/BG-2/BG-4/BG-5 (VB-1) · MO-1…5, HV-1/2/13/14/15, A11Y-1/5/7, EN-1…3, PN-2 (VB-2) ·
  SC-8/9, EN-6/10, A11Y-3/6 (VB-3) · SC-3, EN-9, BL-11, PN-3, HV-10, A11Y-2, WT-2 (VB-4) · PT-9, MO-7 (VB-5) ·
  BL-4/5/10, HV-7/8/9/11/12, TX-8, MO-6 (VB-6) · ST-1…4/6 (S-4) · ST-5 (G-5b) · PN-1/3 (L-14) · BL-9, BG-6, PN-5/6 (L-15) ·
  PT-2…4, SC-1, EN-5 as research only (RX-2).
- **No batch at all:** PT-5…8 · ST-7…10 (ST-10 = ledger V-10, open with no batch) · BL-1, BL-2, BL-6, BL-7, BL-8 ·
  BG-3, BG-7…11 · HV-3…6, HV-16, HV-17, HV-18 · EN-4, EN-7, EN-8, EN-11 · SC-2, SC-4…7, SC-10…12 · PN-4, PN-7…9 ·
  TX-1…7, TX-9…12 · CU-1…5 · A11Y-4, A11Y-8 · WT-1, WT-3…6. Notably the user's named musts **page transitions** (PT-2…4
  only in research) and **bands blending into each other** (BL-1, BL-2, BL-6) have NO build batch yet.
