# Family 3 · Section transition — dividers, overlaps, stacking, wipes, colour hand-overs

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per **technique**, in the library's entry shape.
Written 2026-10-02 from the measured runs and the reading notes; builder status re-verified by grep of
`lib/box-model.ts`, `lib/box-export.ts`, `lib/interactions.ts` on the working tree of `builder/layout-uat` the same day.
How one band hands over to the next. Scroll-linked motion inside a section is Family 2; held bars are Family 1.

**Numbers.** Same two sources as [1-held.md](1-held.md): **AGGREGATE** (live sites, n = 732) and a **recount** of the same
`runs/*.json` deduplicated by site URL (n = 763), both measured 2026-10-02; CodePen shares per tag from AGGREGATE; the
Awwwards Transitions collection classified by item title (366 items, motion-effects §9, 2026-09-27). Section shapes are
hard for a crawler to tell from any other `clip-path`, so several shares below are **upper bounds** ("any use") and are
labelled so. The runs are still adding sites. **No phone figure from the runs is used** — the 360 px phone pass never
took effect (re-measure pending, R-16); the **Phone** lines come from the reading notes and platform rules.

**Tokens.** Static shapes have no timing. Wipes and stacks that are scrubbed by scroll use `linear` (the scroll is the
clock). Time-played hand-overs use `--eu-dur-slower` (500 ms) or the proposed `--eu-dur-reveal` (800 ms) with
`--eu-ease-standard` / proposed `--eu-ease-expo-out`. Award-site wipes run 0.8–1.2 s on expo-out (motion-effects §3, §9).

**Reduced motion, as measured.** 70% of sites still move on scroll with reduced motion on (AGGREGATE, n = 732). Of the
Codrops StickySections repo (15 stacking demos) and the 123 Codrops scroll articles, the repo has **no**
`prefers-reduced-motion` and 7 articles mention it.

## Most used first

| # | Technique | How common (measured 2026-10-02) |
|---|---|---|
| T1 | Sloped or curved band edge | `clip-path` anywhere **43%** (318 / 732, upper bound); the builder's own default divider family |
| T4 | Cards that hang over the band boundary (overlap) | not separable; a template staple (LAYOUT_BENCHMARK A12/B12) |
| T3 | Waves, zigzags, triangles (SVG / mask / `shape()`) | `mask` anywhere **32%** (237 / 732, upper bound) |
| T9 | Wipe from one scene to the next as you scroll | `clip-path` changes while scrolling **5%** (36 / 732); Awwwards Transitions: mask/clip wipes **48 of 366** items (titles) |
| T6 | Stacking sections / cards that pile on each other | 3 + tall sticky elements on one page **4%** (34 / 763) |
| T11 | Full-screen sections that snap | y/both `mandatory` snap anywhere **11%** (84 / 763) — mostly carousels and decks |
| T5 | Colour fades into the next band | not separable; Awwwards "colour field / gradient" **25 of 366** items |
| T7 | Stay-behind hero (next band slides over it) | not separable |
| T8 | Curtain-reveal footer | not separable |
| T2 | The next band's colour fills the cut ("puzzle" divider) | not separable |
| T10 | Clip-revealed fixed scenes (pure CSS "windows") | not separable |
| T13 | A divider that changes shape as you scroll | not separable |
| T14 | Big sticky title that flips colour over a split band | held element with a blend mode **10%** (Family 1 H6) |
| T12 | Style the section that is currently snapped / stuck | `scroll-state` **1** site of 763 |

---

### T1 · A sloped or curved edge on a band
- **Family** Section transition · **trigger** none (static)
- **What a visitor sees** — the bottom of the blue hero runs on a diagonal (or an arch) instead of a straight line.
- **How it is done** — one `clip-path: polygon()` on the band, with the **angle kept constant** at every width by giving
  the depth in the band's own width, not as a % of its height (Kilian Valkhof, 9elements):
  ```css
  .band { container-type: inline-size;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 6cqi));
          padding-block-end: calc(6cqi + var(--space)); }   /* words never sit in the cut */
  ```
  Words, focus rings, shadows **and clicks** in the clipped-off area are gone (spec: no pointer events outside the clip),
  so padding = depth (or `tan(α) · width / 2` for a skewed pseudo, 9elements). `clip-path` creates a stacking context.
- **Timing** — none (static).
- **Phone** — kept; with a %-of-height depth a tall phone band gets a much deeper cut than desktop (ST-2).
- **Reduced motion** — n/a.
- **Accessibility** — nothing focusable or legible inside the cut (ST-3); the divider is decoration.
- **Cost** — zero bytes, zero JS; Baseline since 2020.
- **How common** — `clip-path` in CSS on **43%** of live sites (318 / 732, AGGREGATE — any use, an upper bound);
  CodePen `clip-path` tag 476 pens. Template builders (Elementor, Divi, Webflow) all ship it.
- **Examples** — CodyHouse "Diagonal Containers" (https://codyhouse.co/blog/post/css-diagonal-containers) · Kilian
  Valkhof angled-edges demo (https://nigelotoole.github.io/angled-edges) · 9elements "Create Diagonal Layouts Like It's 2020" ·
  Stripe's skewed bands (CSS-Tricks "Creating Non-Rectangular Headers").
- **Surfaces** — builder layout (band edge picture); Hero / Footer components; Educo web app: none; React Native:
  `react-native-svg` shape or a rotated view (static).
- **Builder status** — **HAVE / PARTIAL**: four shapes `BandEdge` `lib/box-model.ts:133`, fields `:383-386`, one polygon
  for both edges `bandEdgeCSS` `:6614-6623` with points from `edgePoints` `:6588`, same helper on canvas and export
  (`lib/box-export.ts:88`). The depth is a **% of the band's height** (`edgeDepth` clamped 0–50, `:6616`) and no padding is
  added for it.
- **Gap ids** — ST-2 · ST-3.

### T2 · The next band's colour fills the cut (complementary "puzzle" dividers)
- **Family** Section transition · **trigger** none
- **What a visitor sees** — the blue band's diagonal meets the white band below with no stripe of page colour in between.
- **How it is done** — a plain clip shows whatever is **behind** band A (the page), not band B. Three fixes: (a) cut
  **both** neighbours with complementary shapes and pull the second up by the depth (Temani Afif):
  ```css
  :root { --size: 3rem; --gap: 0rem; }
  .a { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--size))); }
  .b { clip-path: polygon(0 0, 100% var(--size), 100% 100%, 0 100%); margin-top: calc(var(--gap) - var(--size)); }
  ```
  (b) clip a pseudo-element extended into both neighbours (CodyHouse); (c) an SVG or mask divider drawn inside A in B's
  colour (shapedivider.app's model). `--gap` > 0 gives a deliberate thin line.
- **Timing** — none.
- **Phone** — kept.
- **Reduced motion** — n/a.
- **Accessibility** — as T1.
- **Cost** — zero.
- **How common** — not separable in the runs.
- **Examples** — freeCodeCamp "How to Create a Section Divider Using CSS" (Temani Afif) · css-generators.com/section-divider ·
  css-tip pen `t_afif/eYPpYPB` · CodyHouse diagonal hero.
- **Surfaces** — builder layout (band edge option "meet the next band"); Educo web app: none.
- **Builder status** — **GAP**: the band keeps its height and nothing overlaps it ("The band keeps its full height: the
  shape CUTS the background", `lib/box-model.ts:6608-6610`), so the wedge shows the page; the guide says otherwise
  (01, ST-1 — still to be confirmed headed).
- **Gap ids** — ST-1 · NEW-F7.

### T3 · Waves, zigzags, triangles, arrows, clouds — the divider shape library
- **Family** Section transition · **trigger** none
- **What a visitor sees** — a wavy or zigzag line between two bands.
- **How it is done** — three routes, all one emitter: `mask` with two `radial-gradient`s for a wave whose size is a length
  (Afif; Baseline Dec 2023); `conic-gradient` mask for zigzag; `clip-path: shape()` for organic waves in `%`/`rem`
  (Baseline 2026, needs a `polygon()` fallback first); or an inline SVG with `preserveAspectRatio="none"`.
  ```css
  .wavy { --s: 1.6rem; --p: .8; --R: calc(var(--s) * sqrt(var(--p) * var(--p) + 1)) at 50%;
    mask: radial-gradient(var(--R) calc(100% - var(--s) * (1 + var(--p))), #000 99%, #0000 101%) calc(50% - 2 * var(--s)) 0 / calc(4 * var(--s)),
          radial-gradient(var(--R) calc(100% + var(--s) * var(--p)), #0000 99%, #000 101%) 50% calc(-1 * var(--s)) / calc(4 * var(--s)) repeat-x; }
  ```
  shapedivider.app's set (from its bundle): Waves, Waves Opacity, Curve, Curve Asymmetrical, Triangle, Triangle
  Asymmetrical, Tilt, Arrow, Split, Book — with flip, invert and **a separate height per desktop / tablet / phone**.
- **Timing** — none.
- **Phone** — kept; use near-hard stops (98%) to avoid jaggies.
- **Reduced motion** — n/a.
- **Accessibility** — SVG dividers `aria-hidden="true"`.
- **Cost** — CSS forms are bytes; an inline SVG 0.5–2 KB; no images. The Paint API route is Chrome-only — rejected.
- **How common** — `mask` in CSS on **32%** of live sites (237 / 732, AGGREGATE — any use, upper bound); freefrontend
  lists 18 CSS dividers and 7 CSS waves (every item opened).
- **Examples** — css-generators.com/wavy-shapes and /wavy-divider · shapedivider.app · CSS-Tricks "Fancy CSS Borders Using
  Masks" · freefrontend "CSS Dividers" (https://freefrontend.com/css-dividers/).
- **Surfaces** — builder layout (more band-edge pictures); Educo web app: none; React Native: `react-native-svg` path.
- **Builder status** — **GAP**: only the four `BandEdge` values (`lib/box-model.ts:133`); 0 hits for `mask-image` and
  `shape(` in the three files.
- **Gap ids** — ST-4 · ST-2.

### T4 · Cards that hang over the boundary between two bands (overlap)
- **Family** Section transition · **trigger** none
- **What a visitor sees** — three feature cards start inside the hero photo and hang down into the white band below.
- **How it is done** — negative top outer spacing on the card row (or the next band), set per screen size, lifted in
  z-order:
  ```css
  .cards { margin-block-start: calc(-1 * clamp(0rem, -1rem + 4cqi, 2.5rem)); position: relative; z-index: 1; }
  ```
  Educative's spec: 20 px overlap at tablet, 40 px at desktop, **0 on phones** (stacked). Only a negative margin on the
  **inline-end** side causes sideways overflow; clip any bleed with `overflow-x: clip`, never `hidden` (Shadeed).
- **Timing** — none.
- **Phone** — **dropped** (0 overlap when stacked).
- **Reduced motion** — n/a.
- **Accessibility** — reading and focus order stay DOM order; the last line of the band above must not be covered (reserve
  its padding); a focused element must not sit under the overlapping card (2.4.11).
- **Cost** — none.
- **How common** — not separable in the runs; a template staple (LAYOUT_BENCHMARK A12/B12), exposed as a negative-margin
  field by page builders (GemPages).
- **Examples** — Educative "Overlapping Hero and Feature Cards" (problem page; solution behind login) · GemPages "Add
  negative margin" help · freeCodeCamp puzzle dividers (the negative margin is the same mechanism).
- **Surfaces** — builder layout (outer spacing below zero, per rung); Card rows; Educo web app (dashboard header cards);
  React Native: negative `marginTop` on the first card row (static).
- **Builder status** — **GAP**: outer spacing controls are `min={0}` (`components/website/box/BoxInspector.tsx:228`, `:240`);
  only a floating layer (`position: "absolute"`, `lib/box-model.ts:439`) or a shared grid area overlaps, inside one band.
- **Gap ids** — ST-5.

### T5 · One band's colour fades into the next
- **Family** Section transition · **trigger** none
- **What a visitor sees** — no hard line: the cream band melts into the blue one.
- **How it is done** — `background: linear-gradient(to bottom, var(--a) 70%, var(--b))` on A with B's colour **read from
  the neighbour** and kept in sync; or `mask-image: linear-gradient(black 80%, transparent)` on A over B. The
  scroll-linked whole-page variant is Family 2 S14.
- **Timing** — none (static).
- **Phone** — kept.
- **Reduced motion** — n/a.
- **Accessibility** — text contrast against **both** ends of the gradient.
- **Cost** — free.
- **How common** — not separable; the Awwwards Transitions collection files **25 of 366** items as "colour field /
  gradient" (by title, 2026-09-27).
- **Examples** — ruya.digital ("Gradients in Hover and Transitions", slug `ruya-digital-gradients-in-hover-and-transitions`) ·
  bolden.nl ("Colour transition", aw-coll-transitions) · Codrops "Smooth Panel Scroll Effects".
- **Surfaces** — builder layout (band background "fade into the next band"); Educo web app: none.
- **Builder status** — **PARTIAL**: gradient backgrounds `background: "gradient:#a:#b"` (`lib/box-model.ts:322`); nothing
  reads the neighbour's colour.
- **Gap ids** — ST-6.

### T6 · Stacking sections or cards — each one slides over and covers the last
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — "Our values" cards: each new card slides up and covers the previous one, which stays put and
  shrinks back a little.
- **How it is done** — sibling `position: sticky` items with the **same** top (or a small step for a peeking pile),
  later ones higher in z, each opaque. The "covered" look on a timeline that keeps moving — never the stuck element's own
  `view()`, which stalls while it is stuck (Codrops StickySections, translated):
  ```css
  .stack > .card { position: sticky; top: calc(var(--held-top) + var(--i) * 1rem); }
  .stack { timeline-scope: --c2, --c3, --c4; }
  .card:nth-child(2) { view-timeline: --c2; }
  .card:nth-child(1) > .inner { animation: back linear both; animation-timeline: --c2; animation-range: entry 0% entry 100%; }
  @keyframes back { to { scale: .95; opacity: .6; } }
  ```
  Codrops' 15 exit looks are combinable axes (RULE T): scale back · darken · round the corners · blur · tilt · shrink to
  a corner · collapse · flip away · slide off. Compositor-safe: `scale`, `opacity`, `translate`; `filter: brightness()`
  and `blur()` on a 100 svh layer are heavy (NEW-E1).
- **Timing** — scrubbed, linear; each exit over one screen (`end: '+=100%'` in every Codrops demo).
- **Phone** — the pile is free (sticky); keep only `scale`/`opacity` exits. Each card at most one screen tall, or its
  bottom is never readable.
- **Reduced motion** — keep the pile (positional), drop the scale/darken.
- **Accessibility** — covered cards' links are still in the tab order **under** the next card (2.4.11): they must leave
  the tab order while covered (`inert` / `interactivity: inert`); not for sections taller than the screen.
- **Cost** — sticky is free; the look is compositor-only if kept to scale/opacity.
- **How common** — three or more sticky elements at least half a screen tall on one page: **4%** (34 / 763, recount,
  measured 2026-10-02). 1,922 of 21,719 crawled sections (8.8%) hold something sticky (layout crawl). CodePen `sticky`
  (585 pens): sticky 60%.
- **Examples** — stabondar.com (3 tall sticky, `home-page-projects-section-stas-bondar-25`) · danielgamble.com.au
  (`strategy-interaction-daniel-gamble-portfolio`) · Codrops StickySections (https://tympanus.net/Development/StickySections/,
  index2…index15) · scroll-driven-animations.style `/demos/stacking-cards/css/` · chrome.dev/carousel/vertical/stack.
- **Surfaces** — builder layout (a container's "stack, don't queue" choice); Values / Steps / Testimonials components;
  Educo web app: onboarding cards; React Native: an animated card stack (reanimated), not sticky.
- **Builder status** — **GAP (and a conflict)**: sibling sticky items **queue** below each other by design (`pinStackAttr`
  `lib/box-model.ts:5719-5745`, `--eu-pin-above` `:5843`, comment `:5735`), so overlap is impossible; no exit look (0 hits
  `view-timeline` / `timeline-scope`).
- **Gap ids** — ST-7 · SF-7 · NEW-E1.

### T7 · The hero stays behind while the next band slides up over it
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — the hero photo holds still and the white content rises over it like a sheet of paper.
- **How it is done** — `.hero { position: sticky; top: 0; z-index: 0 }` and the next band
  `position: relative; z-index: 1; background: var(--surface)` (opaque). Everything stays in the flow (the old pens used
  `position: fixed` + an absolutely placed article, which broke the page height).
- **Timing** — none (position); an optional darken of the hero is scrubbed, linear.
- **Phone** — kept; the hero must fit `100svh`.
- **Reduced motion** — n/a (positional).
- **Accessibility** — the covered hero's links are behind, not focusable unseen while in view — acceptable.
- **Cost** — none.
- **How common** — not separable in the runs.
- **Examples** — CodePen "Creative Web Headers Practice" (https://codepen.io/Milmon/pen/bGqyrP) · CodePen "Fixed Position
  Images with Scrolling" (https://codepen.io/j2made/pen/dPPYvv) · Codrops "Smooth Panel Scroll Effects".
- **Surfaces** — builder layout (a "behind" choice for a pinned band); Hero component.
- **Builder status** — **GAP**: a page-pinned band is always put **above** what scrolls past (`pagePinCover`
  `lib/box-model.ts:4809-4813`, z `PAGE_Z.sticky + 1`), with no "behind" choice.
- **Gap ids** — SP-7.

### T8 · The page slides up to uncover a footer waiting underneath (curtain-reveal footer)
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — at the end, the page lifts like a curtain and the footer is revealed below it.
- **How it is done** — no magic numbers (Chris Coyier, Andy Bell):
  ```css
  main   { position: relative; z-index: 1; background: var(--surface); }
  footer { position: sticky; bottom: 0; z-index: 0; }
  main   { transform: translate3d(0,0,0); }   /* Safari z-index glitch when scrolling back up (Piccalilli) */
  ```
  Only when the footer is **shorter than the screen**, or its top is unreachable.
- **Timing** — none (position).
- **Phone** — kept only if the footer fits a 360 × 640 screen; usually it does not → drop.
- **Reduced motion** — n/a.
- **Accessibility** — a footer taller than the screen must never be sticky.
- **Cost** — none. (The `translate3d` makes `main` a containing block for fixed children — SF-8.)
- **How common** — not separable.
- **Examples** — set.studio and themarkup.org (named by Piccalilli / CSS-Tricks) · Chris Coyier pen `oNXZJzj` · Codrops "From
  Shader Uniforms to Clip-Path Wipes" (next-project panel at the end).
- **Surfaces** — builder layout (a footer option); Footer component.
- **Builder status** — **GAP** (no "behind" layering; see T7).
- **Gap ids** — ST-8 · SP-7.

### T9 · A wipe from one full-screen scene to the next as you scroll (clip or mask, scroll-linked)
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — the next photo is revealed by a sweeping edge (from the bottom, a circle, blinds) rather than
  simply scrolling in.
- **How it is done** — a sticky media stack; each layer's `clip-path: inset()` animates on the **next** section's named
  view timeline (Builder.io's Apple wipe):
  ```css
  .scenes { timeline-scope: --s2, --s3; }
  .step-2 { view-timeline: --s2; }
  .layer-1 { animation: wipe linear both; animation-timeline: --s2; animation-range: entry 0% contain 0%; }
  @keyframes wipe { to { clip-path: inset(0 0 100% 0); } }
  ```
  `inset()` ↔ `inset()` always interpolates; polygons need equal point counts. Blinds and columns: a
  `repeating-linear-gradient` mask on the same timeline. Random-grid wipes need per-cell elements (not pure CSS).
- **Timing** — scrubbed, linear (Codrops' GSAP versions add `scrub: 2–2.5` smoothing — no CSS equivalent, deliberately).
  Time-played wipes on award sites: 0.8–1.2 s, expo-out.
- **Phone** — swap to plain stacked sections or a cross-fade; one full-screen image per scene must be lazy and sized
  (RULE AF).
- **Reduced motion** — cross-fade instead of the sweep, or plain stacked sections (a full-screen wipe is a large moving
  area — Val Head's trigger 1).
- **Accessibility** — real text in each scene, in reading order; the pinned stage must fit at 400% zoom (SF-4).
- **Cost** — `clip-path` animation is composited in Chromium, paint elsewhere; SVG-rect wipes (80–200 rects) repaint on
  the main thread.
- **How common** — `clip-path` changes while scrolling on **5%** (36 / 732, AGGREGATE, measured 2026-10-02); Awwwards
  Transitions collection: mask / clip wipes **48 of 366** items (by title — mostly page transitions, Family 4). CodePen
  `clip-path` (476 pens): 52% move on scroll.
- **Examples** — cydstumpel.nl (clip on scroll + a real `animation-timeline: --page-title` underline) ·
  theartofdocumentary.com (`page-transition-art-of-documentary`) · photoyoshi.com (`gallery-takamitsu-motoyoshi`) · Codrops "SVG
  Mask Transitions on Scroll" (https://tympanus.net/Tutorials/SVGMaskScrollTransition/) · chrome.dev/carousel/horizontal/video
  (`clip-path` keyed to `entry` / `exit`).
- **Surfaces** — builder layout ("Story" section, LATER); Gallery; React Native: none (a paged list with a cross-fade).
- **Builder status** — **GAP**: `clip-path` is used only for static band edges (`bandEdgeCSS` `lib/box-model.ts:6614`); no
  clip animation, no `view-timeline` / `timeline-scope` (0 hits).
- **Gap ids** — ST-9 · SP-10 · SA-6.

### T10 · Full-screen "windows" onto fixed pictures (clip-revealed fixed scenes, no timeline)
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — each chapter's photo and title stay put while the chapter edge slides over the previous one,
  like looking through a moving window.
- **How it is done** — pure CSS, no animation: each section has an inner box with `position: absolute; inset: 0;
  clip-path: inset(0)` (old: `clip: rect(0, auto, auto, 0)`), and inside it a **`position: fixed`** full-screen figure.
  The clip on the ancestor cuts the fixed child to the section's rectangle. Also the phone-safe replacement for
  `background-attachment: fixed` (Family 2 S5).
- **Timing** — none.
- **Phone** — kept (works on iOS, unlike `background-attachment: fixed`); full-screen images are the cost.
- **Reduced motion** — positional only; acceptable, or plain sections.
- **Accessibility** — text over photos needs a contrast floor; 100 vh sections on phones → `svh`.
- **Cost** — compositor; image weight.
- **How common** — not separable in the runs.
- **Examples** — CodePen "CSS Scroll Reveal Sections" (https://codepen.io/hexagoncircle/pen/PXVEVZ) · CodePen "Windowed Scroll"
  (https://codepen.io/jaredsmith/pen/wxxyyy) · Codrops "Fixed Background Scrolling Layout".
- **Surfaces** — builder layout (LATER); Hero / chapters.
- **Builder status** — **GAP**: nothing clips a fixed layer to its section; a clipped ancestor is written as
  `overflow: hidden` (`lib/box-export.ts:393`) — and a fixed child inside a transformed/filtered ancestor is captured.
- **Gap ids** — SP-10 · SP-11.

### T11 · Full-screen sections that settle one at a time (page snap)
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — each section fills the window and the page comes to rest on one section at a time.
- **How it is done** —
  ```css
  html { scroll-snap-type: y proximity; scroll-padding-top: var(--held-top); }   /* on html, not body */
  .band { scroll-snap-align: start; min-height: 100svh; }                          /* svh — dvh pages snap glitchily */
  ```
  **Never `mandatory` on a reading page**: at 150% text or 400% zoom a section is taller than the screen and its middle
  becomes unreachable (MDN, web.dev, Roselli). Never combine with sticky children (Chrome bug 835301, Roselli). Switch off
  when any section is taller than the screen; below ~120ch the CSS-Tricks slide deck stacks instead.
- **Timing** — the browser's snap animation (not controllable); `scroll-behavior: smooth` off under reduce.
- **Phone** — `proximity` only, off when content is tall; GSAP Observer-style one-gesture paging is scroll-jacking —
  rejected.
- **Reduced motion** — snapping is not animation; smooth programmatic scroll becomes instant.
- **Accessibility** — 1.4.4 / 1.4.10 / 1.4.12 at 200% text and with text spacing; keyboard Space / Shift+Space land on
  section edges.
- **Cost** — native.
- **How common** — y/both `mandatory` snap anywhere **11%** (84 / 763, recount, measured 2026-10-02 — most are decks,
  carousels and slideshows, not reading pages); `scroll-snap-type` anywhere **21%** (154 / 732, AGGREGATE). No captured rule
  put page-level y snap on `html`/`body` (0 / 763).
- **Examples** — Codrops "Fullscreen Scrolling Slideshow" (https://tympanus.net/Development/FullscreenScroll/) · Bramus pen
  `GRJGyGE` (full-page snap) · web.dev pen `dPbeNqY` (snapped section animates its title) · Codrops "The Never Ending
  Story" (Lenis snap — the JS form, rejected).
- **Surfaces** — builder layout (a page option, DECIDE); Slides / Story pages; React Native: `pagingEnabled` vertical
  `FlatList`.
- **Builder status** — **PARTIAL**: full-screen bands `screenHeight` `lib/box-model.ts:375` → `100svh` / `50svh` (`:5622`);
  page snapping **GAP** — scroll snap exists only in the pager (`pagerStripCss` `:3501-3515`, `x mandatory`).
- **Gap ids** — ST-10.

### T12 · Styling the section that is snapped or stuck right now
- **Family** Section transition · **trigger** scroll state
- **What a visitor sees** — the section in focus is full colour; its neighbours are dimmed; the stuck card is tinted.
- **How it is done** — `container-type: scroll-state` on the snap target; descendants query
  `@container scroll-state(snapped: y)` / `(stuck: top)` (Chromium 133+; elsewhere no style — safe). Paint only. Snapped
  matches **during** the gesture (`scrollsnapchanging` timing).
- **Timing** — 300–500 ms opacity/colour transitions in the Chrome demos → `--eu-dur-slow`.
- **Phone** — kept (Chrome Android 154+, Samsung Internet 29+ — most of the phones RULE AF targets).
- **Reduced motion** — keep (opacity/colour); drop scale-ups.
- **Accessibility** — dimmed neighbours must still pass contrast if readable; nothing conveyed by dimming alone.
- **Cost** — once per frame, cheap.
- **How common** — `scroll-state` in shipped CSS on **1** site of 763 (cydstumpel.nl, recount, measured 2026-10-02).
- **Examples** — web.dev pens `NPKMdBX` (snapped testimonial boosted), `XJrqpBG` (caption on snapped card), `dPbeNqY` ·
  chrome.dev/carousel/horizontal/series (unsnapped items greyscale).
- **Surfaces** — builder (pager pages, snapped sections); Testimonials; React Native: `onViewableItemsChanged` state.
- **Builder status** — **GAP**: `scroll-state` appears only in a comment (`lib/box-model.ts:6325`).
- **Gap ids** — ST-11 · NEW-B2.

### T13 · A divider that changes shape as you scroll past it
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — the flat line under a photo bends into a wave as the next band arrives.
- **How it is done** — `clip-path: polygon()` (or `shape()`) with the **same point count** at both ends on a `view()`
  timeline; SVG path `d` morphs (Codrops) need equal commands and are weaker outside Chromium.
- **Timing** — scrubbed, linear (Codrops: `start 'top bottom'`, `end 'bottom top'`).
- **Phone** — kept (small).
- **Reduced motion** — the resting shape, still.
- **Accessibility** — decorative.
- **Cost** — repaint of the divider area.
- **How common** — not separable.
- **Examples** — Codrops "How to Animate SVG Shapes on Scroll" (https://tympanus.net/Tutorials/OnScrollPathAnimations/) ·
  Codrops "On-Scroll Shape Morph Animations" (https://tympanus.net/Development/OnScrollShapeMorph) · Codrops "On-Scroll
  Morphing Background Shapes" (2017).
- **Surfaces** — builder (band edge, LATER).
- **Builder status** — **GAP** (edges are static).
- **Gap ids** — NEW-E10 · ST-4.

### T14 · A big sticky title that flips colour as the band beneath changes from dark to light
- **Family** Section transition · **trigger** scroll
- **What a visitor sees** — a large heading stays put while a dark band gives way to a light one; the heading inverts at
  the seam.
- **How it is done** — `.title { position: sticky; top: 1.25rem; mix-blend-mode: difference; }` over a band whose
  background is `linear-gradient(to bottom, var(--dark) 50%, var(--light) 50%)` (CSS-Tricks "Raise the Curtains"). A
  transform on the container cancels the blend; the blend also inverts images. Controlled alternative: two stacked copies,
  each clipped to its half (contrast asserted).
- **Timing** — none (it switches at the seam).
- **Phone** — kept.
- **Reduced motion** — n/a.
- **Accessibility** — `difference` gives uncontrolled contrast (Core Rule 17) — use the clipped-copies form.
- **Cost** — compositing for the blend.
- **How common** — a held element with a blend mode on **10%** (80 / 763, recount) — mostly headers and cursors.
- **Examples** — CSS-Tricks "How to Make a 'Raise the Curtains' Effect" (wundermobility live) · saisei-sbj.webflow.io
  (`difference` header) · Codrops "Background Shift Animation with CSS Blend Modes".
- **Surfaces** — builder (LATER); Hero title.
- **Builder status** — **GAP** (no blend on held blocks).
- **Gap ids** — NEW-D5 · NEW-F2.

---

## Corrections found while verifying (2026-10-02)

1. **"Common: the most common divider family"** (01 T1) cannot be measured from the runs: `clip-path` is on 43% of live
   sites but almost all of it is image masks, menus and page-transition covers; a section-like selector with a
   `clip-path: polygon` rule was found on only 9 of 763 sites. The share above is labelled as an upper bound.
2. **Codrops cluster E** says StickySections' 15 exits are "YES pure CSS for all 15"; true for the look, but demos 1, 2,
   6, 8 and 12 animate `filter` (brightness / contrast / blur) on full-screen layers — main-thread paint on every frame,
   which RULE AF rules out on low-cost phones. Only the scale / opacity / translate looks are recommended (T6).
3. **01 T2's claim** that the guide describes the cut wrongly is consistent with the code (`lib/box-model.ts:6608-6610`:
   the band keeps its height; nothing pulls the next band under the cut); still to be confirmed in a headed browser.

## Added 2026-10-02 (R-1) — CodePen `divider` · `dividers` · `wave`, 137 pens opened, run and read

The 0-pen tags (`section-divider`, `shape-divider`, `stacking-cards`) retried under the names CodePen uses. Read until
the user's "enough": `dividers` to its end (11), `divider` 75 (page 7), `wave` 51 (page 6); `svg-divider`,
`stacked-cards`, `card-stack`, `stacking` not reached (the run resumes). Pages: `codepen/divider.md`, `dividers.md`,
`wave.md`. How they are made, in pens of 137: `::before` / `::after` shape 64 · SVG `<path>` 21 · keyframed moving wave 20
· `<hr>` 13 · canvas 16 · border triangle 9 · `clip-path: polygon` 7 · `mask` 6.

| Need | Builder | Evidence (checked 2026-10-02) |
|---|---|---|
| Straight / angled / curved band edge | **HAVE** | `BandEdge` four shapes `lib/box-model.ts:133`, fields `:383-384` |
| Wave / SVG-path edge (the most-used shape after pseudo-elements) | **GAP** | only the four `BandEdge` values; 0 `mask-image` in `box-model.ts` / `box-export.ts` (ST-4) |
| Edge that overlaps the next band | **GAP** | the band keeps its height, outer spacing `min={0}` `BoxInspector.tsx:228`, `:240` (ST-1 · ST-5) |
| Moving (keyframed) wave | **GAP** | edges are static; needs the reduced-motion fallback (MR rules) |
| A rule between blocks (`<hr>`) | **HAVE** (R-23) | the Divider block now publishes `<hr>` — it was `<div aria-hidden>` until 2026-10-02 (`box-export.ts:158`) |
| Stacked cards (sticky, each over the last) | **GAP** | sibling sticky items QUEUE below each other by design, `pinStackAttr` `lib/box-model.ts:5740` (ST-7) |
