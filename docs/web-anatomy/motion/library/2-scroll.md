# Family 2 · Scroll — reveal, parallax, scroll-driven, scrollytelling, horizontal, progress, marquee, snap

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per **technique**, in the library's entry shape.
Written 2026-10-02 from the measured runs and the reading notes; builder status re-verified by grep of
`lib/box-model.ts`, `lib/box-export.ts`, `lib/interactions.ts` on the working tree of `builder/layout-uat` the same day.
Full-screen **section** snapping and wipes between sections are Family 3; held bars are Family 1.

**Numbers.** Same two sources as [1-held.md](1-held.md): **AGGREGATE** (live sites, desktop 1440 + phone 360 at CPU 4×,
**n = 732**) and a **recount** of the same `runs/*.json` with stricter definitions, deduplicated by site URL (**n = 763**),
both measured 2026-10-02. CodePen shares are per tag from AGGREGATE. The runs are still adding sites.
**The phone pass is invalid** (the 360 px emulation never took effect — held elements on it are 1,425 px wide at the
median), so no phone figure from the runs is used: any measured phone share is "re-measure pending (R-16)". The **Phone**
lines below come from the reading notes and platform rules. AGGREGATE's "intro cover 69%" and page-transition overlay
shares are inflated by see-through layers and are not used.

**What the runs measure on scroll.** The crawler scrolls each site twice and records every element whose transform,
opacity, scale, rotation, clip or filter changed, with its `moveRatio` (how far it moved ÷ how far the page moved) and
its computed transition/animation timing. Under reduced motion it repeats the scroll. So "scroll:fade 55%" means 55% of
sites had at least one element whose opacity changed while scrolling — a reveal, a fading hero, or a header.

**Timing measured on scroll-changed elements** (recount, n = 5,831 elements on 333 sites that expose a CSS timing):
duration **median 970 ms** (p25 400, p75 2,200); easing `linear` 2,252 · `ease` 2,142 · `ease-in-out` 429 ·
`cubic-bezier(.215,.61,.355,1)` 202 · `cubic-bezier(.19,1,.22,1)` 195 · `ease-out` 191. Across all elements, transitions
have a median of **350 ms** and the single most common animation duration is **12,000 ms** (531 elements — loops and
marquees) (AGGREGATE). GSAP scripts' most common eases: `"none"` (scrubbed, 885) · `power2.inOut` 679 · `power3.out` 579 ·
`expo.out` 556.

**Tokens today** (`lib/educo-ui/tokens.ts:47-53`): `--eu-dur-fast` 120 · `base` 200 · `slow` 320 · `slower` 500 ms;
`standard`, `in`, `out`, `in-out`, `emphasized` (an overshoot). Proposed (MR-9 / motion-effects §3, not built):
`--eu-dur-reveal` 800 ms, `--eu-ease-expo-out (.16,1,.3,1)`, `--eu-dur-stagger`. **Anything scrubbed by scroll uses
`linear`: the scroll is the clock.**

**Reduced motion, as measured.** **70%** of sites still move on scroll with reduced motion on (AGGREGATE, n = 732); only
**25%** mention `prefers-reduced-motion` in CSS — and of the sites that do, **72% still move** (114 / 158, recount).

## Most used first

| # | Technique | How common (measured 2026-10-02) |
|---|---|---|
| S1 | Reveal as it comes into view (scrubbed) | something translates on scroll **66%**, fades **55%**, scales **35%** (AGGREGATE, n = 732) |
| S13 | Marquee / ticker / anything that loops by itself | moves with no scroll **51%** (carousels, loaders, marquees); marquee-named translate keyframes **6%** (47 / 763) |
| S4 | Parallax — moves slower than the page | **23%** (172 / 732) have an element moving 0.1–0.9 of the scroll; median ratio **0.15** |
| S9 | Sideways swipe strip with snap | `scroll-snap-type` **21%** (154 / 732); horizontal snap **16%** (124 / 763) |
| S2 | Played once when reached (triggered) | IntersectionObserver was in 59% of 300 award sites (2026-09-27 fingerprint); `animation-trigger` 0 |
| S18 | Smooth-scroll library | Lenis **16%** · Locomotive **4%** (AGGREGATE) |
| S7 | Pinned story (picture stays, steps change it) | pinned scroll section **17%** (Family 1, H10) |
| S3 | One after another (stagger) | split headings **19%** (AGGREGATE) — the text form; card stagger not separable |
| S8 | Horizontal section driven by vertical scroll | a ≥ 3-screen-wide track moving on scroll **7%** (50 / 763) |
| S5 | Fixed background photo (`background-attachment: fixed`) | not separable; CodePen `parallax` (890 pens): fixed 26% |
| S15 | Picture grows from framed to full-bleed | `clip-path` changes on scroll **5%** (36 / 732) |
| S11 | Scroll-linked indicators (carousel progress, scroll shadows) | not separable |
| S12 | Section-linked nav highlight (scroll-spy) | not separable; `scroll-target-group` 0 in shipped CSS |
| S10 | Reading-progress bar | thin fixed bar ≤ 8 px **1%** (7 / 763) |
| S14 | Page colour changes as sections arrive | not separable (Awwwards titles name it) |
| S17 | Words light up as you read | not separable |
| S16 | Line that draws itself | not separable |
| S6 | Layered parallax hero | inside S4 |
| S19 | Multi-speed / reverse columns, 3D scroll | `scroll:rotate` 26% includes it; not separable |
| S20 | Scroll-scrubbed video / image sequence | not separable — rejected for weight |
| — | Native scroll-driven CSS at all | `animation-timeline` text **6%** (47 / 732) — but only **≥ 4 of 763** use a real `scroll()` / `view()` / named timeline (see Corrections) |

---

### S1 · A block that fades or rises into place as it comes into view (scrubbed by scroll)
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — cards and pictures slide up a little and fade in as they reach the screen.
- **How it is done** — CSS scroll-driven, no script, **gated so the resting state is the content**:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @supports ((animation-timeline: view()) and (animation-range: 0% 100%)) {
      .card { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% cover 28%; } } }
  @keyframes rise { from { opacity: 0; translate: 0 1.5rem; } }
  ```
  `animation-timeline` after the shorthand (it resets it); `both` fill so the start state applies before the range
  (Josh Comeau); the timeline follows the **untransformed** box. **Trap:** `view()` tracks the nearest scroll container —
  an ancestor with `overflow: hidden` (rounded/clipped boxes, the pager strip) becomes that container, the timeline is
  inactive and the reveal never plays (`overflow: clip` fixes it, SA-1). Range-keyed keyframes give in **and** out in one
  animation: `entry 0% {…} entry 100%, exit 0% {…} exit 100% {…}` (NEW-A8).
- **Timing** — measured on scroll-changed elements **median 970 ms** (p25 400, p75 2,200; n = 5,831 on 333 sites);
  award reveals 0.8–1.2 s on expo-out (`(.19,1,.22,1)` 195, `(.16,1,.3,1)`; motion-effects §9). Scrubbed → `linear` over a
  range; time-played → proposed `--eu-dur-reveal` (800 ms) + `--eu-ease-expo-out`. The builder's own fallback is `.55s`
  (`lib/interactions.ts:212`) while its `slow` token is 320 ms (MR-9).
- **Phone** — kept (compositor-only `opacity` + `translate`); Tokopedia measured CPU while scrolling 50% → 2% after
  moving from JS to CSS. Never on the first screen: an entrance on the hero delays LCP (MR-12, NEW-D7).
- **Reduced motion** — must become a **fade with no movement** (or nothing): "swap, don't strip" (MR-1). What sites do:
  70% still move (AGGREGATE); David Bushell's "Death to scroll fade" (2026) argues for none at all.
- **Accessibility** — content never depends on the animation; the start state must not hide content if CSS/JS fails
  (Scott Jehl's self-destructing `@keyframes hideBriefly` for JS reveals); 2.3.3.
- **Cost** — compositor-only; zero JS; ~3 lines per effect.
- **How common** — at least one element translates on scroll on **66%**, fades on **55%**, scales on **35%**, rotates on
  **26%**, clips on **5%**, filters on **5%** (AGGREGATE, measured 2026-10-02, n = 732). CodePen `scroll-animation`
  (171 pens): keyframes 40%, scroll listener 27%, IntersectionObserver 13%, `animation-timeline` 17%, `view()` 15%.
- **Examples** — oasiscannabis.co ("Scroll-triggered animation", aw-coll-transitions, slug
  `oasis-cannabis-scroll-triggered-animation`) · pittoridicinema.it (`scroll-triggered-transition-in-single-page-site`) ·
  cydstumpel.nl (real `view(y)` reveal: `.webmention--reply { animation-timeline: view(y); animation-range: entry }`) ·
  scroll-driven-animations.style "image reveal" + "contact list" demos · Codrops "A Practical Introduction to
  Scroll-Driven Animations with CSS scroll() and view()" (2024-01).
- **Surfaces** — builder layout (any block, any item); every component's items (`itemEffectsCss`); Educo web app (lists
  of news, cards); React Native: reanimated `entering={FadeInDown}` layout animations or an `onViewableItemsChanged`
  trigger — RN has no scroll-scrubbed CSS.
- **Builder status** — **HAVE**: seven entrances `REVEAL_EFFECTS` `lib/interactions.ts:133-142`; per block
  `revealEffect` / `revealScroll` `lib/box-model.ts:464-466` and per item `:112-114`; `revealCss` writes
  `animation-timeline: view(); animation-range: entry 0% cover 28%` inside `@supports (animation-timeline: view())`
  (`lib/interactions.ts:214`, `:241-243`), on-load fallback otherwise (`:232`), `animation:none` under reduce (`:246`).
  **PARTIAL**: gate omits `animation-range` (NEW-C1); reduce strips instead of fading (MR-1); likely inactive inside a
  rounded box or a pager page because the export writes `overflow: hidden` (`lib/box-export.ts:393`) and the strip is
  `overflowY: "hidden"` (`lib/box-model.ts:3508`) (SA-1).
- **Gap ids** — SA-1 · SA-2 · NEW-C1 · MR-1 · MR-12 · MR-13 · NEW-D7 · NEW-A8 · SA-13.

### S2 · A block that plays its entrance once when reached (scroll-triggered, not scrubbed)
- **Family** Scroll · **trigger** scroll (crossing a line), then time
- **What a visitor sees** — the same rise-and-fade, but it plays to the end on its own and never runs backwards when
  they scroll up.
- **How it is done** — three routes, the resting style visible in all three:
  ```css
  /* Chromium 145/146 — CSS only */
  .card { timeline-trigger: --t view() contain / cover; trigger-scope: --t;
          animation: rise var(--eu-dur-reveal) var(--eu-ease-expo-out) both; animation-trigger: --t play-once none; }
  @supports not (animation-trigger: none) { /* ~20 lines of IntersectionObserver add .in and unobserve */ }
  ```
  Or Bramus's `runOnce`: `commitStyles(); cancel()` on `animationend` of the scrubbed version (any SDA browser).
  Rule of thumb (CSS-Tricks 2026): **scroll-driven for continuous effects, triggers for discrete reveals**.
- **Timing** — time-based: 0.3–0.6 s (`.35s ease-in-out` in the Chrome form demo; `.6s ease-out` CSS-Tricks); Telha
  Clarke's GSAP title reveal 1.2 s `expo.out` stagger .1 → `--eu-dur-slower`/proposed `reveal`, `out` / expo-out.
- **Phone** — kept; IntersectionObserver is cheap (no scroll listener).
- **Reduced motion** — plays as a fade or is simply present.
- **Accessibility** — never gate content behind the script (self-destructing hidden state); 2.3.3.
- **Cost** — Chromium: zero JS; elsewhere ~20 lines.
- **How common** — `animation-trigger` in shipped CSS: **0** (AGGREGATE has no line; recount found none). IntersectionObserver
  was found in **177 of 300** live award sites in the 2026-09-27 fingerprint (motion-effects §9) — the common
  "play once" route. CodePen `scroll-animation`: IntersectionObserver 13% (171 pens).
- **Examples** — web.dev pens `jEqJvjB`, `vEGPVeO`, `azNMRPg` (form sections) · bramus `gbrEzGJ` (fly-in text) ·
  Bramus `runOnce` pen `MWZmJpd` · scroll-driven-animations.style `/demos/image-reveal/css/scroll-triggered`.
- **Surfaces** — builder (an "only once" choice on the entrance); components; Educo web app; React Native: reanimated
  `entering` animations are already "play once".
- **Builder status** — **GAP**: 0 hits for `animation-trigger`, `timeline-trigger`, `IntersectionObserver` in the three
  files; every scroll entrance is scrubbed.
- **Gap ids** — SA-2 (mechanism: NEW-B7) · NEW-D7.

### S3 · Items that arrive one after another (stagger)
- **Family** Scroll / Entrance · **trigger** load or scroll
- **What a visitor sees** — three cards rise in left to right, each a beat after the last.
- **How it is done** — on a **time** animation, `animation-delay` per child; on a **scroll** timeline delays become
  proportions of the range, so stagger by **range offset** instead (Baseline-timeline demo: each +3%):
  `animation-range: entry calc(var(--i) * 4%) cover calc(30% + var(--i) * 4%)`. Cap it: Carbon 20 ms steps, whole
  sequence ≤ 500 ms; `transition-delay: calc(min(sibling-index(), 10) * 100ms)` where `sibling-index()` exists.
- **Timing** — Carbon 20 ms · Fluent "short offsets" · award GSAP `stagger: .1` → proposed `--eu-dur-stagger` (60 ms),
  total ≤ 500 ms.
- **Phone** — kept.
- **Reduced motion** — stagger 0.
- **Accessibility** — the last item must not arrive so late that a reader thinks the list ended.
- **Cost** — cheap; one `:nth-child` rule per step.
- **How common** — split headings (letters/words in spans) **19%** (140 / 732, AGGREGATE) — the text form of stagger;
  `lib:split` 8%. Card stagger is not separable in the runs.
- **Examples** — scroll-driven-animations.style `/demos/baseline-newly-available/css/` (stagger by range offset) ·
  Codrops "Staggered (3D) Grid Animations with Scroll-Triggered Effects" · Codrops "Connected Grid Layout Animation".
- **Surfaces** — builder ("arrive one after another"); list and grid components; Educo web app; React Native:
  `entering={FadeInDown.delay(i * 60)}`.
- **Builder status** — **HAVE / PARTIAL**: `revealStagger` `lib/box-model.ts:468`; 90 ms per child up to the 10th
  (`lib/interactions.ts:238`) = 810 ms of delay before a 320–550 ms reveal; time delays are emitted on a `view()`
  timeline too, unverified (SA-3).
- **Gap ids** — SA-3 · MR-20.

### S4 · Parallax — a picture that moves slower than the page
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — the photo inside a frame drifts a little as it passes, giving depth.
- **How it is done** — the only form that is both compositor-only and asset-neutral (02 S4c):
  ```css
  .frame { overflow: clip; }
  @media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: view()) {
    .frame img { scale: 1.2; animation: drift linear both; animation-timeline: view(); } } }
  @keyframes drift { from { translate: 0 -8%; } to { translate: 0 8%; } }
  ```
  Avoid: `background-attachment: fixed` (S5), the perspective/`translateZ` trick (makes `body` a nested scroller, breaks
  sticky and fixed), JS scroll listeners (skipped frames), and `top`/`background-position` keyframes (main thread).
- **Timing** — scrubbed, `linear`. Measured speed: elements that move a fraction of the scroll do so at a **median ratio
  of 0.15** (p25 0.09, p75 0.34; n = 597 elements, recount) — i.e. ±8–10% drift, as above. → no duration token.
- **Phone** — kept as a small drift; the real cost on 3G is the 1.2× larger image. Codrops' heavy versions disable it on
  touch.
- **Reduced motion** — **off entirely**: parallax is first on web.dev's, Apple's and Mercado Libre's vestibular lists.
  Real sites: **41 of 42** sites with image parallax still move it under reduced motion (recount).
- **Accessibility** — never parallax text; 2.3.3.
- **Cost** — compositor-only; zero JS.
- **How common** — an element moving 0.1–0.9 of the scroll on **23%** (172 / 732, AGGREGATE, measured 2026-10-02); an
  **image** doing so on **6%** (42 / 763, recount). CodePen `parallax` (890 pens): fixed 26%, keyframes 20%, scroll
  listener 16%, GSAP 14%, `animation-timeline` 2%. GSAP ScrollTrigger on **9%** of live sites (68 / 732).
- **Examples** — restaurant-amici.com (`transition`-titled item, aw-coll-transitions) · elementis.co
  (`page-transition-elementis`) · backstage.bonjovi.com (`image-gallery-component-backstage-with-bon-jovi`) ·
  scroll-driven-animations.style "Window Carousel" (`/demos/parallax-carousel/`) · CSS-Tricks "Bringing Back Parallax
  With Scroll-Driven CSS Animations" (2025-08, 3 pens — note it animates `top`).
- **Surfaces** — builder (a "gentle depth" choice on an image or a band picture); Image / Hero components; Educo web app:
  none wanted; React Native: `interpolate(scrollY)` → `translateY` on the image (reanimated), off when
  `useReducedMotion()`.
- **Builder status** — **GAP** for the `view()` drift (no `view()` translate anywhere; the only `view()` is the entrance,
  `lib/interactions.ts:242`). **PARTIAL** via S5's fixed background.
- **Gap ids** — SA-5 · SP-11 · NEW-F9.

### S5 · A fixed background photo ("parallax lite", `background-attachment: fixed`)
- **Family** Scroll / Held · **trigger** scroll
- **What a visitor sees** — the section is a window onto a photo that stays still while the section moves over it.
- **How it is done** — `background-attachment: fixed; background-size: cover`. Sizes the image to the **viewport**, not
  the section. **Ignored on iOS Safari** and repaints every frame on many Android GPUs. The phone-safe form: a separate
  `position: fixed; inset: 0; z-index: -1` layer inside a `clip-path: inset(0)` section (CSS-Tricks fix; SP-10's
  technique).
- **Timing** — none (no animation).
- **Phone** — **swap** to `scroll` under `(hover: none)`, `(pointer: coarse)` or reduced motion.
- **Reduced motion** — `background-attachment: scroll`.
- **Accessibility** — text over a full-bleed photo: contrast asserted (Core Rule 17).
- **Cost** — main-thread repaint per frame on Android; nothing on iOS (ignored).
- **How common** — not separable in the runs. freefrontend lists 20 "fixed background" pens; CodePen `parallax` tag:
  fixed 26% (890 pens).
- **Examples** — Codrops "Fixed Background Scrolling Layout" (https://tympanus.net/Blueprints/ScrollingLayout/) ·
  CodePen "Fixed Position Images with Scrolling" (https://codepen.io/j2made/pen/dPPYvv) · CSS-Tricks "The Fixed
  Background Attachment Hack" (bokand url-bar demo).
- **Surfaces** — builder layout (band background); Hero component; React Native: none (a static `ImageBackground`).
- **Builder status** — **PARTIAL**: `bgAttach?: "fixed"` `lib/box-model.ts:327`, emitted on canvas `:1035` and export
  `:1138` with no phone, iOS or reduced-motion fallback.
- **Gap ids** — SP-11 · SA-5 · SP-10.

### S6 · A layered parallax hero (several layers at different speeds)
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — mountains, sun and the title move at different speeds as the page starts to scroll.
- **How it is done** — layers stacked in one grid cell, each on `scroll()` with its own speed (Kevin Powell's repo):
  ```css
  .hero > * { grid-area: stack; animation: plx linear both; animation-timeline: scroll(); animation-range: 0 100svh; }
  @keyframes plx { to { translate: 0 calc(var(--speed) * 10%); } }
  ```
  The band after it needs `position: relative` and its own background (layers otherwise run over it).
- **Timing** — scrubbed, linear.
- **Phone** — **drop** or reduce to one layer: several full-width image layers are the 3G cost.
- **Reduced motion** — off (multi-speed motion is an Apple-listed trigger).
- **Accessibility** — decorative layers `aria-hidden`; the title stays a real heading.
- **Cost** — compositor; image weight.
- **How common** — inside S4's 23%; not separable.
- **Examples** — Kevin Powell https://github.com/kevin-powell/css-parallax (style.css) · freefrontend HejChristian
  `VYwEVPO` (multi-layer `view()` parallax) · Firewatch header (named in Bramus's 2021 use cases).
- **Surfaces** — builder (Hero preset, LATER); React Native: none planned.
- **Builder status** — **GAP** (no `scroll()` layer animation; the only `scroll()` is the pin arrival,
  `lib/box-model.ts:6355`).
- **Gap ids** — NEW-F9 · SA-14.

### S7 · A pinned story — the picture stays while the steps scroll past and change it
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — a large image holds still; as each paragraph scrolls by, the image changes to match.
- **How it is done** — the sticky stage of Family 1 H10 + one named view timeline per step, hoisted:
  ```css
  .story { timeline-scope: --s1, --s2, --s3; }
  .step:nth-child(1) { view-timeline: --s1; } /* … */
  .pane img:nth-child(2) { animation: show linear both; animation-timeline: --s2; animation-range: entry 0% contain 0%; }
  ```
  A sticky element's **own** `view()` stalls while it is stuck — drive it from a non-sticky wrapper or the next step's
  timeline (Codrops StickySections translated). GSAP `scrub: 1–2.5` smoothing has no CSS equivalent (deliberately out).
- **Timing** — scrubbed, linear; scene lengths 2–4 screens (Family 1 H10 numbers).
- **Phone** — **swap**: each step shows its own picture inline (the pane is a duplicate). "Heavy JS scrollytelling gates
  phones" (The Spark, Codrops 2026).
- **Reduced motion** — cross-fades, or the inline layout.
- **Accessibility** — the pane is `aria-hidden`; every step's content exists in reading order.
- **Cost** — compositor if the swaps are opacity; image weight per step.
- **How common** — pinned scroll section **17%** (128 / 732, AGGREGATE, measured 2026-10-02); CodePen `scrollytelling`
  (16 pens): sticky 38%, rAF 38%, scroll listener 25%.
- **Examples** — tuxkarma.co (`webgl-mouse-interaction-tux-karma-foundation`, 9 sticky / 4 tall pins) · Codrops "Building a
  Scroll-Driven 3D Cube Gallery in Webflow" (500 vh sticky stage) · Builder.io Apple-style sticky video wipe · bramus
  `ZYWPRbr` ("Meet the monsters").
- **Surfaces** — builder ("Story" section, LATER); "Our history" / Timeline component; Educo web app: onboarding; React
  Native: a paged `FlatList`.
- **Builder status** — **PARTIAL**: the sticky pane exists (`pin` + `hold`, `pinCSS` `lib/box-model.ts:5994`); no
  `view-timeline` / `timeline-scope` (0 hits in the three files).
- **Gap ids** — SA-6 · ST-9.

### S8 · A horizontal section driven by vertical scrolling
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — scrolling down, a row of panels slides sideways instead.
- **How it is done** — tall section + sticky inner + a track translated on the section's timeline:
  ```css
  .h-section { height: 500svh; view-timeline: --h; }
  .h-stage   { position: sticky; top: 0; height: 100svh; overflow-x: clip; }
  .h-track   { animation: slide linear both; animation-timeline: --h; animation-range: contain 0% contain 100%; }
  @keyframes slide { to { translate: calc(-100% + 100cqw) 0; } }
  ```
  The native answer is S9 (a real sideways scroller). Never the `rotate(-90deg)` trick.
- **Timing** — scrubbed, linear.
- **Phone** — **swap** to a stack or a native swipe strip; 500 svh of scrolling for nothing vertical is hostile at 360 px.
- **Reduced motion** — becomes a vertical stack.
- **Accessibility** — Tab into panel 5 does not scroll the page to it; `scrollIntoView` on focus is required.
- **Cost** — compositor.
- **How common** — a track ≥ 3 screens wide moving on scroll on **7%** (50 / 763, recount, measured 2026-10-02). CodePen
  `horizontal-scroll` (91 pens): jQuery 32%, fixed 21%, snap 12%, GSAP 8%.
- **Examples** — seasoned.koto.studio (`page-flip-seasoned`, 22,741 px track) · marioroudil.com (`list-transition-mario-roudil`) ·
  mew.xyz (`transition-mew`) · scroll-driven-animations.style "horizontal section" demo · Codrops "Horizontal Smooth Scroll
  Layouts" (2020).
- **Surfaces** — builder (LATER, only if asked — SA-7); React Native: a horizontal `FlatList` (native).
- **Builder status** — **GAP** (scroll-jacked form); the native pager is HAVE (S9).
- **Gap ids** — SA-7.

### S9 · A sideways swipe strip that snaps to each card or page (carousel / pager)
- **Family** Scroll · **trigger** swipe, wheel, arrow keys
- **What a visitor sees** — a row of cards they swipe through; each lands neatly in place.
- **How it is done** —
  ```css
  .strip { display: grid; grid-auto-flow: column; grid-auto-columns: 100%; overflow-x: auto;
           scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
  .strip > * { scroll-snap-align: start; scroll-snap-stop: always; }
  ```
  Chromium 135+: `::scroll-button()` and `::scroll-marker` give real buttons and tablist markers with no script;
  `interactivity: inert` on off-screen slides (NEW-A7). `overscroll-behavior-x: contain` stops a swipe past the last slide
  from triggering browser back (NEW-A1 / NEW-B4).
- **Timing** — snap animation is the browser's; dot/arrow `scrollTo({behavior: "smooth"})`; auto-advance 5–7 s per
  slide if at all (Baymard).
- **Phone** — the reason it exists. **Never auto-advance on touch** (Baymard: 31% get it wrong).
- **Reduced motion** — `scroll-behavior: auto`; no auto-advance.
- **Accessibility** — 2.2.2: a visible Stop/Start button, first in the carousel, label changes, never restarts by itself
  (MR-4, MR-16); `aria-live` off while rotating; markers need names (`content: "" / attr(data-label)`).
- **Cost** — native scroll; a few lines of script for the current dot.
- **How common** — `scroll-snap-type` in CSS **21%** (154 / 732, AGGREGATE); horizontal snap **16%** (124 / 763),
  y/both `mandatory` anywhere **11%** (84 / 763) (recount, measured 2026-10-02); Swiper **9%** (68 / 732).
- **Examples** — chrome.dev/carousel (23 JS-free demos) · restaurant-amici.com (`hover-buttons-amici`, snap) ·
  theqream.com (snap) · madebyon.com (snap + real timelines) · web.dev "Building a media scroller".
- **Surfaces** — builder layout (pager on any container); Gallery, Testimonials components; Educo web app (dashboards);
  React Native: `FlatList` `horizontal` + `pagingEnabled` / `snapToInterval` (already used,
  `apps/mobile/app/(tabs)/index.tsx:595`, `:1110`).
- **Builder status** — **HAVE**: `pagerStripCss` `lib/box-model.ts:3501-3515` (`x mandatory`, smooth undone under reduce),
  slides `scroll-snap-stop: always` `:3521`, real-link nav, `pagerWire` reads reduced motion once `:3621`, auto-advance
  `pagerAuto` `:247` pauses on hover/focus `:3661-3668`, carousel roles `lib/box-export.ts:571`. **GAP**: no
  `overscroll-behavior` (0 hits), no Stop button, restarts on `focusout` (`:3667`), runs on touch, no `inert`.
- **Gap ids** — NEW-A1 / NEW-B4 · NEW-B3 / NEW-A7 · NEW-B5 / NEW-C2 · NEW-A4 / NEW-B6 · MR-4 · MR-16 · NEW-D8 · NEW-D6.

### S10 · A reading-progress bar
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — a thin line along the top fills as they read a long article.
- **How it is done** —
  ```css
  @supports (animation-timeline: scroll()) {
    .progress { position: fixed; inset-inline: 0; top: 0; height: .25rem; transform-origin: 0 50%;
                animation: grow linear both; animation-timeline: scroll(root); } }
  @supports not (animation-timeline: scroll()) { .progress { display: none; } }   /* an empty bar misleads */
  @keyframes grow { from { scale: 0 1; } }
  ```
  Never animate `width`. Stop before the footer: `animation-range: 0% calc(100% - <footer>)`.
- **Timing** — scrubbed, linear.
- **Phone** — kept (one composited `scale`).
- **Reduced motion** — acceptable as is (it moves only with the reader's own scroll); WebKit's guide calls it fine.
- **Accessibility** — decorative, `aria-hidden`.
- **Cost** — ~10 lines; compositor; the scroll-listener version janks under a busy main thread (Chrome case study).
- **How common** — a fixed bar ≤ 8 px tall and ≥ 200 px wide on **1%** (7 / 763, recount, measured 2026-10-02).
- **Examples** — steviaplease.me (`steviaplease-navigation-page-transitions-stevia-please-`) · monogrid.com/project/oakley-project-2075 ·
  enpowertrading.co.za ("3D Homepage / Scroll interaction / Progress bar") · scroll-driven-animations.style
  `/demos/progress-bar/css/` · WebKit "A guide to scroll-driven animations with just CSS".
- **Surfaces** — builder (a block inside a pinned bar); Article / News component; Educo web app (policies, long
  reports); React Native: `scrollY / (contentHeight - viewport)` → `scaleX`.
- **Builder status** — **GAP**: no `scroll(root)` progress element (0 hits); only the alert's time-based progress.
- **Gap ids** — SA-4.

### S11 · Scroll-linked indicators: carousel progress, "more this way" shadows
- **Family** Scroll · **trigger** scroll of a box
- **What a visitor sees** — a line under a slider shows how far along they are; a soft shadow at the edge of a scrolling
  box shows there is more.
- **How it is done** — carousel step indicator on the strip's **named** timeline (an absolutely positioned bar skips its
  scroller parent — the containing-block lookup trap): `.strip { scroll-timeline: --strip inline }` +
  `.bar { animation: grow linear both; animation-timeline: --strip; }`. Scroll shadows (Kevin Hamer 2025):
  ```css
  @property --l { syntax: "<length>"; inherits: false; initial-value: 0; }
  .scroller { mask: linear-gradient(to right, #0000, #000 var(--l) calc(100% - var(--r)), #0000);
              animation: fade linear both; animation-timeline: scroll(self inline); }
  ```
  A scroll timeline with nothing to scroll is inactive, so the shadow appears only when needed.
- **Timing** — scrubbed, linear.
- **Phone** — kept (helps: phone scrollbars are hidden).
- **Reduced motion** — keep (not motion).
- **Accessibility** — the real state ("slide 2 of 5", `aria-current`) still needs text.
- **Cost** — the `@property` mask is main-thread per frame (custom properties never composite).
- **How common** — not separable in the runs.
- **Examples** — scroll-driven-animations.style `/demos/horizontal-carousel/css/` (step indicator) and `scroll-shadows` ·
  CSS-Tricks "Modern Scroll Shadows Using Scroll-Driven Animations" · web.dev pen `OPLZWBj`.
- **Surfaces** — pager; Table / scrollable box (SP-5); Educo web app tables; React Native: `ScrollView` indicator props.
- **Builder status** — **PARTIAL**: pager dots are script-driven links (`lib/box-model.ts:3600-3670`); no scroll-linked
  indicator, no scrollable box.
- **Gap ids** — SA-10 · SP-5 · NEW-C2.

### S12 · The menu link for the part you are reading lights up (scroll-spy)
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — in a sticky contents list, the current section's link is underlined.
- **How it is done** — two lines on Chromium 140+, the browser also sets `aria-current`:
  ```css
  .toc ol { scroll-target-group: auto; }
  .toc a:target-current { color: var(--eu-color-primary-700); text-decoration-line: underline; }
  ```
  Cross-browser: per-section `view-timeline` + `timeline-scope` driving each link (motion-effects §8 pattern C), or an
  IntersectionObserver writing `aria-current`.
- **Timing** — colour change ~0.5 s (Una) → `--eu-dur-slower`; or instant.
- **Phone** — the contents list usually collapses above the article; keep the highlight in a sticky sub-menu.
- **Reduced motion** — keep (colour + underline).
- **Accessibility** — not colour alone (underline); real `aria-current`.
- **Cost** — zero JS on Chromium.
- **How common** — not separable; `scroll-target-group` 0 in shipped CSS (recount).
- **Examples** — una pens `VYvmQJX`, `dPYXKVe`, `zxvoWZd` · chrome.dev/carousel/vertical/scroll-spy · Codrops
  "Building a Scrollable and Draggable Timeline with GSAP" (year marker) · MDN / GOV.UK guides.
- **Surfaces** — Navigation / Docs sidebar component; Educo web app (long settings pages); React Native: section list
  index highlight.
- **Builder status** — **GAP**: 0 hits for `scroll-target-group`, `timeline-scope`, `IntersectionObserver`.
- **Gap ids** — SA-9 · NEW-A6 · SP-12.

### S13 · A marquee or ticker that moves by itself (logos, announcements)
- **Family** Scroll / time loop · **trigger** time
- **What a visitor sees** — a row of logos (or "Term starts 8 January…") drifting sideways for ever.
- **How it is done** — translate a duplicated track, never a layout property (Fylgja / Smashing):
  ```html
  <section aria-labelledby="partners"><h2 id="partners">Our partners</h2>
    <div class="marquee"><ul role="list">…</ul><ul role="list" aria-hidden="true" inert>…</ul></div>
    <button type="button" aria-pressed="false">Pause</button></section>
  ```
  ```css
  @media (prefers-reduced-motion: no-preference) {
    .marquee > ul { animation: slide var(--marquee-duration) linear infinite; } }
  @keyframes slide { to { translate: calc(-100% - var(--gap)) 0; } }
  .marquee:has(~ [aria-pressed="true"]) > ul { animation-play-state: paused; }
  ```
  `inert` (not only `aria-hidden`) on the copy when it holds links; pause while off-screen (IO) to save battery.
- **Timing** — the most common animation duration on live sites is **12 s** (531 elements, AGGREGATE); sites with
  marquee-named keyframes run their animations at a **median 8 s** (p75 30 s, recount); duration grows with item count;
  `linear`.
- **Phone** — kept, slow; one transformed track. Hover-pause alone does not exist on touch.
- **Reduced motion** — **does not start**: a static, wrapping row or a horizontally scrollable region. Real sites:
  **36 of 47** with marquee keyframes still move under reduced motion (77%, recount); none of Codrops' marquees has a pause.
- **Accessibility** — **WCAG 2.2.2**: anything moving > 5 s beside other content needs a keyboard-operable pause that
  does not restart by itself; F16 failure otherwise.
- **Cost** — compositor; duplicated DOM (keep to text/logos).
- **How common** — "moves with no scroll" (carousels, loaders, marquees) **51%** (373 / 732, AGGREGATE); the word
  `marquee|ticker` in CSS **24%** (174 / 732, a text match — class names); keyframes named marquee/ticker/scroll/loop that
  translate by −50/−100% **6%** (47 / 763, recount, measured 2026-10-02).
- **Examples** — labs.chaingpt.org/portfolio (`inner-page-transition-chaingpt-labs`) · petragarmon.com/en ·
  studio.playgoals.com (`horizontal-drag-navigation`) · Fylgja marquee https://fylgja.dev/ui/sliders/marquee/ · Kevin
  Powell pen https://codepen.io/kevinpowell/pen/BavVLra (checks reduced motion before duplicating).
- **Surfaces** — builder (Logo strip / News ticker component); Educo web app (announcements); React Native: reanimated
  `withRepeat(withTiming(...))` on a duplicated row, off when `useReducedMotion()`.
- **Builder status** — **GAP**: 0 hits for `marquee` / `ticker`; the engine has no `infinite` animation (06 R2).
- **Gap ids** — SA-8 · MR-17 (a loop under the global `.01ms` reduce rule would strobe) · MR-4.

### S14 · The whole page changes colour as each section arrives
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — the page background turns from cream to deep blue as the "Our values" section scrolls in.
- **How it is done** — each section `view-timeline: --s-n`, `body { timeline-scope: … }`, the page background animates on
  each timeline; or an IntersectionObserver setting `data-theme` on `<body>` with a colour `transition`. Animate a **token
  custom property**, not a literal colour, or a theme switch mid-page breaks (Josh Comeau).
- **Timing** — class-toggle forms 0.6–1 s colour transitions (Codrops Background Shift); scrubbed forms linear.
- **Phone** — kept (cheap).
- **Reduced motion** — colour is not motion — keep, or switch instantly.
- **Accessibility** — every band's text must pass contrast against **every** colour it can be shown over during the
  change.
- **Cost** — a background colour animation is main-thread paint per frame.
- **How common** — not separable in the runs; the Awwwards Transitions collection files 25 of 366 items as "colour field
  / gradient" (motion-effects §9).
- **Examples** — kathememorial.com ("Scroll-triggered color transition", `scroll-triggered-color-transition-kathe-kollwitz-memori`) ·
  bolden.nl ("Colour transition", aw-coll-transitions) · Codrops "Background Shift Animation with CSS Blend Modes"
  (https://tympanus.net/Development/BackgroundShift/) · Codrops "On-Scroll Morphing Background Shapes".
- **Surfaces** — builder (a page option, LATER); Educo web app: none; React Native: background interpolated from scroll.
- **Builder status** — **GAP**: no `view-timeline`/`timeline-scope` (0 hits).
- **Gap ids** — SA-11 · NEW-E5.

### S15 · A picture that grows from a framed card to full-bleed as you scroll
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — the photo starts inset with rounded corners and opens out to the screen edges.
- **How it is done** —
  ```css
  @keyframes open { from { clip-path: inset(8% 12% round 1.5rem); } to { clip-path: inset(0 round 0); } }
  .hero-media { animation: open linear both; animation-timeline: view(); animation-range: entry 100% cover 50%; }
  ```
  `inset()` ↔ `inset()` always interpolates (MDN basic-shape rules); the resting state is full-bleed.
- **Timing** — scrubbed, linear.
- **Phone** — kept; `clip-path` animation is composited in Chromium, paint elsewhere.
- **Reduced motion** — full-bleed, still.
- **Accessibility** — decorative; `alt` on the picture.
- **Cost** — low.
- **How common** — `clip-path` changes while scrolling on **5%** (36 / 732, AGGREGATE); `clip-path: inset(` rules on
  **25%** (189 / 763, recount, any use).
- **Examples** — theartofdocumentary.com and nodcoding.com (clip changes on scroll, aw-coll-transitions) · Codrops
  "Thumbnail to Full Width Image Animation" · Codrops "On-Scroll Expanding Image Animation within Typography" · Codrops
  "From Shader Uniforms to Clip-Path Wipes" (next-project un-clip).
- **Surfaces** — builder (Image / Hero effect); Educo web app: none; React Native: animated `borderRadius` + scale.
- **Builder status** — **GAP** (no clip animation; `clip-path` is used only for static band edges, `bandEdgeCSS`
  `lib/box-model.ts:6614`).
- **Gap ids** — NEW-E4 · ST-9.

### S16 · A line that draws itself as you scroll (route, timeline spine)
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — the line of "our journey" draws down the page alongside the dates.
- **How it is done** — `stroke-dasharray: 1; stroke-dashoffset: 1` on a `pathLength="1"` SVG path, animated to 0 on
  `view()` (or a named section timeline); a dot can ride it with `offset-path` + `offset-distance`. The Baseline-timeline
  demo does the spine with `clip-path` instead.
- **Timing** — scrubbed, linear.
- **Phone** — kept (one small inline SVG).
- **Reduced motion** — fully drawn, still.
- **Accessibility** — decorative; the dates are real text.
- **Cost** — `stroke-dashoffset` is paint, small area.
- **How common** — not separable.
- **Examples** — scroll-driven-animations.style `/demos/baseline-newly-available/css/` · Codrops "Creating Scroll-Driven
  SVG Map Animations with GSAP" (2026-05) · Codrops "Animated Map Path for Interactive Storytelling" (2015).
- **Surfaces** — Timeline / "Our history" component; React Native: `react-native-svg` `strokeDashoffset` (not installed).
- **Builder status** — **GAP** (0 hits `stroke-dash`, `offset-path`).
- **Gap ids** — NEW-E3.

### S17 · Words that light up as you read (scrubbed text fill / highlight)
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — a big quote whose words fill with colour as it passes, or a marker sweep under a key phrase.
- **How it is done** — `background-clip: text` gradient (inline element so it wraps) or a highlight `background-size:
  0 → 100%`, on `view()` with `animation-range: entry 100% cover 40%`.
- **Timing** — scrubbed, linear.
- **Phone** — kept.
- **Reduced motion** — fully coloured, still.
- **Accessibility** — contrast measured on the **unlit** colour too; meaning not carried by colour alone.
- **Cost** — paint.
- **How common** — not separable; split headings 19% (S3).
- **Examples** — Codrops "Some On-Scroll Text Highlight Animations" (2024-04) · jh3y "Sticky text reveal" (EaavNVr) ·
  Kevin Powell "text reveal on scroll" (shop.boox.com clone).
- **Surfaces** — Quote / Heading effect, LATER.
- **Builder status** — **GAP**.
- **Gap ids** — NEW-F8 · NEW-E6.

### S18 · Smooth-scroll libraries (Lenis, Locomotive, ScrollSmoother) — recorded so it is never shipped
- **Family** Scroll · **trigger** wheel / touch
- **What a visitor sees** — the page glides with a lag after the wheel stops.
- **How it is done** — a script takes over the wheel (and sometimes touch), animating the scroll position itself.
- **Timing** — Lenis `lerp .1–.2`; no CSS equivalent.
- **Phone** — Horeca disabled Lenis on phones because it glitched; ScrollSmoother `normalizeScroll` hijacks touch.
- **Reduced motion** — Lenis drops smoothing (cuberto measured); most sites keep it.
- **Accessibility** — breaks find-in-page, anchors, keyboard paging and native momentum; 2.1.1.
- **Cost** — main-thread every frame; weight.
- **How common** — Lenis **16%** (119 / 732), Locomotive **4%** (29 / 732) (AGGREGATE, measured 2026-10-02); recount 18%
  (141 / 763) have either. 52 of Codrops' 123 scroll articles name one; 7 of 123 mention reduced motion.
- **Examples** — cuberto.com · meermohsin.me · noho.ink (all Lenis, motion-effects §9) · Codrops "The Never Ending Story".
- **Surfaces** — none.
- **Builder status** — **HAVE (by absence)**: the export ships no smooth-scroll script; `scroll-behavior: smooth` only on
  the pager strip (`lib/box-model.ts:3513`), undone under reduce in the shared sheet. Unguarded.
- **Gap ids** — NEW-E7 (a guard test).

### S19 · Multi-speed and reverse columns, 3D scroll effects — recorded, not built
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — the middle column scrolls up while the outer ones scroll down; cards tilt in 3D as they pass.
- **How it is done** — columns on `scroll(root)` / `view()` with opposite `translate` ranges, only above ~50 rem wide
  (CSS-Tricks 2026); "elastic lag" is time-based smoothing and cannot be done in CSS.
- **Timing** — scrubbed.
- **Phone** — dropped.
- **Reduced motion** — off (multi-direction motion is an Apple-listed trigger).
- **Accessibility** — vestibular.
- **Cost** — many large transformed images.
- **How common** — something rotates on scroll on **26%** (AGGREGATE) — includes these; not separable.
- **Examples** — Codrops "Alternate Column Scroll Animation" · "Elastic Grid Scroll" · scroll-driven-animations.style
  reverse-scroll demo.
- **Surfaces** — none now.
- **Builder status** — **GAP** (by choice).
- **Gap ids** — SA-14.

### S20 · Scroll-scrubbed video or image sequence — recorded and rejected
- **Family** Scroll · **trigger** scroll
- **What a visitor sees** — an object turns or a film plays forward as they scroll.
- **How it is done** — hundreds of frames swapped by scroll progress (Trionn 371 WebP, OPTIKKA 880 on mobile), or
  `video.currentTime` from a rAF loop. A CSS `steps()` sprite on a scroll timeline is possible but heavy.
- **Phone** — tens of MB; fails RULE AF's 500 KB first view.
- **Reduced motion** — poster image.
- **Cost** — very high.
- **How common** — not separable.
- **Examples** — Codrops "Creating Smooth Scroll-Synchronized Animation for OPTIKKA" · Codrops "The Architecture Behind
  Trionn".
- **Surfaces** — none; offer a poster + click-to-play video instead.
- **Builder status** — not to build.
- **Gap ids** — NEW-E8.

---

## Corrections found while verifying (2026-10-02)

1. **"39% of award sites use ScrollTrigger, mostly for parallax"** (02 S4, from the 2026-09-27 fingerprint of 300
   sites) — the live run measures GSAP ScrollTrigger on **9%** (68 / 732), GSAP on 17%, Lenis on **16%** (motion-effects
   §9 had 85 / 300 = 28%). The earlier count fingerprinted code bundles; the live run detects what loads. Use the live
   numbers.
2. **`css:animTimeline` 6% overstates scroll-driven CSS.** Most hits are framework longhand resets
   (`animation-timeline: ;` in Shopify / WordPress component CSS). In the captured rules only **4 of 763** sites use a
   real `scroll()`, `view()` or named timeline (shopify.com/editions/summer2024, madebyon.com, cydstumpel.nl,
   xofestival.nl).
3. **`css:marquee` 24% is a text match** for "marquee|ticker" in any CSS (class names); translate keyframes that loop a
   marquee-named animation are on 6%.
4. **Builder gates** — confirmed as the clusters said: both `@supports` gates test `animation-timeline` alone
   (`lib/interactions.ts:242`, `lib/box-model.ts:6362`), and the arrival writes `animation-duration: auto`
   (`lib/box-model.ts:6352`).
