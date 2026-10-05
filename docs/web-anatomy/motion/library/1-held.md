# Family 1 · Held — sticky, fixed, pinned scenes, bars that change on scroll

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per **technique**, in the library's entry shape.
Written 2026-10-02 from the measured runs and the reading notes; builder status re-verified by grep of
`lib/box-model.ts`, `lib/box-export.ts`, `lib/interactions.ts` on the working tree of `builder/layout-uat` the same day.

**How to read the numbers.** Every share is labelled with its run. Two sources are used:
- **AGGREGATE** — `docs/web-anatomy/research-runs/AGGREGATE.md`, live sites measured on desktop 1440 + phone 360
  (CPU 4×), **n = 732**, measured 2026-10-02. Its lines are taken verbatim.
- **Recount** — the same `C:\Users\eyite\educo-research\runs\*.json` re-read for this family with stricter definitions
  (e.g. "a full-width bar at the very top that contains links", not "any fixed element with a link"), deduplicated by
  site URL, **n = 763**, measured 2026-10-02. The script is kept in the session scratchpad; the definitions are given
  beside each number. Where the two disagree, both are shown and the reason is said (see "Corrections" at the end).
- CodePen shares are from the per-tag table in AGGREGATE (every pen opened and run).

The runs are still adding sites; every number is "measured 2026-10-02, n = …".

**No phone numbers.** The 360 px phone emulation of the runs never took effect (held elements on the "phone" pass are
1,425 px wide at the median — confirmed in the raw data), so **every "phone:" figure in AGGREGATE and in the recount is
invalid**. Where an entry would give a measured phone share it says **"phone: re-measure pending (R-16)"**. The
**Phone** lines below are from the reading notes and the platform rules, not from the runs. Likewise "intro: full-screen
cover 69%" in AGGREGATE counted see-through layers (opaque covers are 271 of 720 = 38%), and the page-transition overlay
shares are inflated the same way — none of those is used here.

**Shots.** Each awwwards example has frames in `C:\Users\eyite\educo-research\shots\<source>\`, named
`awwwards-com-inspiration-<slug>-00-intro-0.7s.jpg` (load) and `…-7-reduced.jpg` (reduced motion on); the
`…-8-phone-top.jpg` frame was taken at desktop width (see above) and is not a phone view. Only the `<slug>` is given below.

**Tokens today** (`lib/educo-ui/tokens.ts:47-53`): `--eu-dur-fast` 120 ms · `base` 200 · `slow` 320 · `slower` 500;
easings `standard (.2,0,0,1)` · `in` · `out` · `in-out` · `emphasized (.2,0,0,1.2)` (an overshoot, MR-9). "Proposed"
tokens are the MR-9 / motion-effects §3 set, not yet built.

## Most used first

| # | Technique | How common (measured 2026-10-02) |
|---|---|---|
| H1 | Header held at the top (fixed or sticky) | full-width fixed top bar with links **32%** · sticky **3%** (recount, n = 763); "fixed bar with the navigation" **55%** (AGGREGATE, n = 732 — any fixed element containing a link) |
| H2 | See-through header that fills in after scrolling | **77%** of held top bars are transparent at rest (206 / 269, recount) |
| H14 | Fixed full-screen layer behind or over the page | with an **opaque** background **31%** (251 / 807); any, including see-through layers, 58% (440 / 763) — an upper bound |
| H11 | Bottom bar on a phone (call-to-action, cookie bar) | cookie / consent element held **20%** (149 / 763, desktop) · phone bottom bar: re-measure pending (R-16) |
| H10 | Pinned scene — sticky inside a tall parent | **17%** (128 / 732, AGGREGATE); GSAP pin-spacer **4%** (28 / 732) |
| H12 | Floating corner widget (back to top, chat, FAB) | desktop **11%** (84 / 763) · phone: re-measure pending (R-16) |
| H6 | Header that changes colour over each band (blend / blockers) | any held element with a blend mode **10%** (80 / 763) |
| H9 | Sticky sidebar / contents rail / buy box | full-height side rail **3%** (21 / 763); crawl: sticky sidebars on 4.0% of 4,250 pages |
| H8 | Several bars stacked at one edge | not separately measured — it is how H1 + an announcement bar behave |
| H4 | Header that shrinks after scrolling | not separable in the runs; held-header transitions median **400 ms** (n = 140 rules) |
| H3 | Frosted-glass bar | glass **top** bar **1%** (7 / 763); "glass held element" **7%** (AGGREGATE — includes menus and overlays) |
| H5 | Hide on scroll down, show on scroll up | not detectable by the runs (see entry); CodePen fixed-header: jQuery 45%, scroll listener 9% (97 pens) |
| H13 | Sticky headings that hand over / style while stuck | `scroll-state` in CSS: **1** site of 763 |
| H15 | Fixed side dot navigation | inside the 3% side-rail count |
| H7 | Two-row header, only the menu row stays | not measured (needs the negative-offset rule) |
| H16 | Sticky table header and first column | crawl: tables on 44 of 4,250 pages |

---

### H1 · A header held at the top of the screen (sticky or fixed)
- **Family** Held · **trigger** scroll (position only, no animation)
- **What a visitor sees** — the logo and menu stay at the top while the page scrolls under them.
- **How it is done** — prefer **sticky**: it stays in the flow, so it reserves its own space and needs no script.
  ```css
  header { position: sticky; top: 0; z-index: var(--sticky); background: var(--surface); }
  html   { scroll-padding-top: <measured bar height>; }   /* links and Tab never land under it (WCAG 2.4.11) */
  ```
  Fixed (`position: fixed; inset-inline: 0; top: 0`) leaves the flow, so the page must pay the space back — every
  CodePen in the fixed-header tag does it with a guessed `padding-top`, which breaks when the bar wraps at 360 px
  (01-codepen §2). Only-if-it-fits form (WCAG C34): `@media (min-height: 30em) { header { position: sticky } }`.
- **Timing** — none; it is position, not motion. → no token.
- **Phone** — kept, but it costs screen: a 56–64 px bar is ~10% of a 360 × 640 phone (01-codepen §5); keep it ≤ 56 px
  and let go on short screens (SF-4). Measured phone bar height and held-bar share: re-measure pending (R-16).
- **Reduced motion** — nothing to change (no motion).
- **Accessibility** — 2.4.11 Focus Not Obscured (anchor and Tab landings), 1.4.10 Reflow at 400% zoom (un-pin by
  height, C34), opaque background so text never shows through, one `<header>` landmark.
- **Cost** — compositor-cheap; repainted each scroll frame only if it holds heavy content. No library.
- **How common** — full-width fixed top bar with links **32%**, sticky **3%** (recount, measured 2026-10-02, n = 763);
  "any fixed element" **83%** and "fixed bar with the navigation" **55%** (AGGREGATE, n = 732). Desktop bar height
  median **88 px** (p25 70, p75 110, n = 280 bars). Layout crawl (4,250 pages of 490 general sites): fixed header
  16.3%, sticky 5.2%. CodePen `sticky-header` (128 pens): fixed 68%, jQuery 48%, sticky 21%; `fixed-header` (97): fixed
  56%, jQuery 45%.
- **Examples** — theartofdocumentary.com (aw-coll-transitions, fixed 81 px, slug `page-transition-art-of-documentary`) ·
  elementis.co (fixed 115 px, `page-transition-elementis`) · hellokuya.co (aw-coll-hovers, **sticky** 103 px,
  `interactive-logo-kuya`) · madebyon.com (sticky 70 px, `on-design-minded-tech-cursor-interaction-ui-animation`) ·
  petro.design (Awwwards "Sticky elements", measured in 01: fixed 64 px with its background on a separate layer).
- **Surfaces** — builder layout: a band or block with `pin: "top"`; components: Navigation (placeholder today);
  Educo web app: the app header; React Native: `stickyHeaderIndices` on a `ScrollView` / `FlatList`, or a header outside
  the scroller with `react-native-safe-area-context` (installed, `apps/mobile/package.json:46`).
- **Builder status** — **HAVE**: `pin` / `hold` fields `lib/box-model.ts:398`, `:415`; resolver `pinCSS`
  `:5994` (sticky by default, `position: fixed ? "fixed" : "sticky"` `:6003`); page bar covers what scrolls under it,
  `pagePinCover` `:4809`; `scroll-padding-top` written for **fixed** bars only `:5868-5873`. **GAP**: sticky bars get no
  scroll padding (SP-1); no un-pin by height (SF-4); viewport meta has no `viewport-fit` (`lib/box-export.ts:903`, SP-14).
- **Gap ids** — SP-1 · SF-4 · SF-5 · SF-6 · SF-11 (Opera Mini) · SF-12 (iOS 26 tint) · SP-14 · NEW-D2 (full-screen hero
  should be `100svh` minus the held bar; today `combineMinHeight` gives a plain `100svh`, `lib/box-model.ts:5622`).

### H2 · A see-through header over the photo that fills in once you scroll ("arrival")
- **Family** Held · **trigger** scroll
- **What a visitor sees** — the menu floats over the hero photo with no background; after a little scrolling it
  gains a colour, a shadow or a hairline so the words stay readable over the content.
- **How it is done** — pure CSS on a scroll timeline (no listener):
  ```css
  @supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
    header { animation: fill linear both; animation-timeline: scroll(); animation-range: 0 7.5rem; } }
  @keyframes fill { to { background-color: var(--surface); box-shadow: var(--shadow-md); } }
  ```
  For a bar that starts lower (under the hero) the right trigger is "stuck", not "page top":
  `container-type: scroll-state` on the bar + `@container scroll-state(stuck: top) { > * { … } }` (Chromium 133+), or a
  1 px IntersectionObserver sentinel. A stuck style may **only paint** (colour, shadow): changing size inside `stuck`
  un-sticks it and flickers (CSSWG explainer, NEW-B2). Josh Comeau's background-on-its-own-layer pattern (petro.design)
  lets the fill change without touching the links.
- **Timing** — scrubbed by scroll, so the easing is **linear** and the "duration" is a distance: the builder uses
  120 px (7.5 rem, Elementor's distance). Where sites use a class toggle instead, held-header transitions measured
  **median 400 ms** (p25 300, p75 600, n = 140 rules on held header/nav selectors, recount) on `opacity`,
  `transform`, `color`, `background-color` → `--eu-dur-slow` (320 ms) with `--eu-ease-standard`.
- **Phone** — kept; a colour/shadow fill is cheap. A transparent bar over a busy photo fails contrast until it fills.
- **Reduced motion** — a colour change is not motion (2.3.3); it should still switch, **stepped**. Today the builder
  removes the animation, so a "solid" bar stays see-through under reduce and in Firefox (MR-2). Real sites: 70% of
  sites still move on scroll with reduced motion on (AGGREGATE).
- **Accessibility** — text contrast must pass in **both** states over the actual photo (Core Rule 17); 2.4.11.
- **Cost** — `background-color` / `box-shadow` animate on the main thread every scroll frame (paint, not composite —
  NEW-B8, MR-3); cheap enough for a 7.5 rem range, but not free on a Helio-G99-class phone.
- **How common** — **77%** of held top bars are transparent at rest (206 / 269, recount, measured 2026-10-02,
  n = 763); layout crawl: 476 of the fixed headers are transparent over the hero. `scroll-state` in shipped CSS:
  1 site of 763 (cydstumpel.nl).
- **Examples** — mew.xyz (fixed 88 px transparent, `transition-mew`) · petragarmon.com/en (68 px, `page-transitions-desktop-petra-garmon`) ·
  warhol-arts.webflow.io (75 px, `titcket-page-warhol-arts`) · CodePen "Natural Sticky Style On Scroll"
  (https://codepen.io/kadykov/pen/XJXbYVX) · web.dev pen `GgKdryj` (shadow when stuck).
- **Surfaces** — builder layout (any pinned block); Navigation component; Educo web app header; React Native: an
  `Animated.View` whose opacity/elevation is interpolated from `useAnimatedScrollHandler` (reanimated 4.1 is
  installed) — Material's `liftOnScroll` is the same idea.
- **Builder status** — **HAVE**: `pinArrival` `lib/box-model.ts:423`, distance `PIN_ARRIVAL_AFTER = 120` `:6142`
  (converted to rem by `scrollLen` `:6154`), keyframes `:6262-6271`, emitter `pinArrivalCss` `:6334-6367` on
  `animation-timeline: scroll()` `:6362-6364`, reduced motion `animation:none` `:6366`, merged with an entrance into
  one `animation-name` list `:6350-6356`. **PARTIAL**: gate tests `animation-timeline` only (NEW-C1);
  `animation-duration: auto` where Firefox wants non-zero (NEW-A5); timed from the page top, not from the moment it
  sticks (SP-3); `solid` starts from `transparent` so it never fills under reduce or without timelines (MR-2).
- **Gap ids** — SP-3 · MR-2 · MR-3 · NEW-C1 · NEW-A5 · NEW-B2 · NEW-B8.

### H3 · A frosted-glass bar
- **Family** Held · **trigger** scroll (or always on)
- **What a visitor sees** — the header is a milky pane; the page blurs as it passes underneath.
- **How it is done** — `backdrop-filter: blur(…)` on a semi-opaque background. The better form (Josh Comeau) puts the
  blur on a child 200% tall, cut back with `mask-image`, so colours just below the bar are sampled and the top edge
  does not flicker:
  ```css
  .backdrop { position: absolute; inset: 0; height: 200%; pointer-events: none;
    backdrop-filter: blur(1rem); mask-image: linear-gradient(to bottom, black 0 50%, transparent 50% 100%); }
  ```
- **Timing** — a blur that fades in follows H2 (scrubbed, linear); most glass bars are simply always on.
  Measured blur radii on glass top bars: 3, 5, 8 (×2), 12, 16, 20 px — median **8 px** (n = 7) → 0.5 rem.
- **Phone** — **swap**: a live full-width blur on every scroll frame janks low-end Android (SF-13, Mozilla bug 1732817);
  show the solid look on coarse pointers or under `prefers-reduced-transparency`.
- **Reduced motion** — fading the blur in is not needed; `prefers-reduced-transparency: reduce` → solid (MR-18).
- **Accessibility** — text over a blur of an unknown photo: contrast must be checked against the darkest and lightest
  content that can pass under it; a semi-opaque background ("thicker glass") is what makes it pass.
- **Cost** — paint-heavy, not compositor-only; `backdrop-filter` also makes the bar a **containing block for fixed
  children** (a dropdown inside it stops being fixed — SF-8).
- **How common** — glass on a **top bar**: **1%** (7 / 763, recount, measured 2026-10-02); "glass (backdrop-filter)
  bar" **7%** (51 / 732, AGGREGATE — counts any blurred held element, mostly menus and overlays); `backdrop-filter`
  anywhere in CSS **40%** (294 / 732).
- **Examples** — rblln.fr (fixed 72 px, `blur(8px)`, slug `trail-effect`) · ochi.design (66 px, `blur(5px)`,
  `animated-eyes-follow-mouse-cursor`) · mariodragicevic.com (57 px, `blur(8px)`, `photography-portfolio-transition-mario-dragicevic`) ·
  ruya.digital (66 px, `blur(12px)`, `ruya-digital-gradients-in-hover-and-transitions`) · oiw.no (104 px, `blur(3px)`,
  `overlay-menu-transition-oslo-innovation-week`).
- **Surfaces** — builder layout (arrival `glass`); Alert and Accordion components already have a glass design; Educo web
  app; React Native: `expo-blur` `BlurView` (not installed — a dependency decision) or a semi-opaque surface.
- **Builder status** — **HAVE / PARTIAL**: `glass` arrival keyframes animate `backdrop-filter: blur(0 → 0.6rem)` on the
  bar itself, `lib/box-model.ts:6268-6269`; no `mask-image` (0 hits in the three files); not counted by
  `capturesFixed` (which counts `rotate` and the `glass` **variant** only, `:6411-6412`); no reduced-transparency rule.
- **Gap ids** — SF-13 · MR-18 · NEW-F3 · SF-8.

### H4 · A header that shrinks after you start scrolling ("condense")
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a tall header with a big logo becomes a slim bar once the page moves.
- **How it is done** — the right way scales a **wrapper** (`scale`, `translate`) or reveals a compact copy, so nothing
  in the flow moves:
  ```css
  .bar-inner { animation: slim linear both; animation-timeline: scroll(); animation-range: 0 9rem; transform-origin: top; }
  @keyframes slim { to { scale: 1 .7; } }
  ```
  The common way animates `height` / `padding` / `font-size` (Policybazaar over `0 150px`, Tokopedia `height 0 → 48`
  over `20px 70px`) — layout on every scroll frame, and on an in-flow sticky bar it moves the text under the reader and
  suppresses scroll anchoring (NEW-A3). The no-JS two-bar trick (CSS-Tricks 2021): outer `sticky; top: -50px` around an
  inner `sticky; top: 0`.
- **Timing** — scrubbed, linear, over a distance (CSS-Tricks 300 px; Policybazaar 150 px); class-toggle versions
  measured at **400 ms median** (see H2) → `--eu-dur-slow`.
- **Phone** — kept, with a floor: a bar on a phone lives between 48 and 56 px; the builder floors at 48.
- **Reduced motion** — the resting (tall) look, or a stepped switch; Codrops' 2013 shrinking header and every pen read
  ignore reduced motion.
- **Accessibility** — must not move focus targets under the pointer; text inside must not shrink below the readable size.
- **Cost** — `scale` = compositor; `height`/`padding`/`min-height` = layout every frame (MR-3).
- **How common** — not separable in the runs (a shrink is a class change on a held bar). Sources: Material's
  "exit until collapsed" and Apple's large title that collapses are the app-platform default.
- **Examples** — Codrops "On-Scroll Animated Header" (https://tympanus.net/Blueprints/AnimatedHeader/) · CodePen "Sticky
  Header – Shrink & Opacity Effect" (https://codepen.io/byKrissK/pen/rNoYaNP) · scroll-driven-animations.style
  "shrinking header + shadow" demo · CSS-Tricks "Shrinking header on scroll without JavaScript".
- **Surfaces** — builder layout (arrival `condense`); Navigation; Educo web app; React Native: interpolate header height
  → use `transform: [{ scaleY }]` from `useAnimatedScrollHandler`, as Material's Compose `exitUntilCollapsed`.
- **Builder status** — **PARTIAL**: `condense` arrival exists (`lib/box-model.ts:6270-6271`) and refuses to promise
  anything without padding/min-height (`pinArrivalHasEffect` `:6288-6292`), floor 48 px (`:6314`) — but it animates
  `padding-block` and `min-height` (layout).
- **Gap ids** — MR-3 · NEW-B8 · NEW-A3 · SF-15 (the two-bar form needs a negative offset).

### H5 · A header that hides when you scroll down and comes back when you scroll up
- **Family** Held · **trigger** scroll direction
- **What a visitor sees** — reading down, the bar slides away; the moment they scroll up a little, it returns.
- **How it is done** — zero-JS on Chromium 144+ (Bramus / Una), focus guard included:
  ```css
  html { container-type: scroll-state; }
  header { transition: translate .32s var(--eu-ease-standard);
    @container scroll-state(scrolled: bottom) { &:not(:focus-within) { translate: 0 -100%; } } }
  @media (prefers-reduced-motion: reduce) { header { transition: none; } }
  ```
  Elsewhere the bar simply stays (correct fallback — `scrolled` support cannot even be feature-tested in CSS). The JS
  form: passive scroll listener, rAF, a dead zone (HeadsUp: only after 300 px, show when scrolling up > 20 px), never
  half-shown (Material `snap`, NEW-F6). Must animate `transform`, never `top`.
- **Timing** — 250 ms (HeadsUp, Bramus demo), NN/g 300–400 ms → `--eu-dur-slow` (320 ms), standard easing.
- **Phone** — **this is the phone's best friend**: a permanent 56–64 px bar is ~10% of a 360 × 640 screen.
- **Reduced motion** — snap in and out (no slide). Real sites: not measurable here (see "How common").
- **Accessibility** — must come back on keyboard focus (`:focus-within`), at the page bottom, and never hide while a
  menu inside it is open; keyboard scrolling counts as a relative scroll (WPT).
- **Cost** — compositor-only `translate`; the CSS form has no listener at all.
- **How common** — **not detectable by the runs**: the class that hides the bar lives in a rule the crawler does not
  keep (0 matches in the held-bar rules). CodePen `fixed-header` (97 pens, measured 2026-10-02): scroll listener 9%,
  jQuery 45% — the hide/show pens are in that group. Platforms: Material `enterAlways`, Apple tab-bar minimise.
- **Examples** — Bramus pen https://codepen.io/bramus/pen/qEboVXG · web.dev pen https://codepen.io/web-dot-dev/pen/MYbeKeq ·
  HeadsUp https://codepen.io/hkfoster/pen/nbMJwp · Smart Fixed Header https://codepen.io/gabalicious/pen/poyGpx.
- **Surfaces** — builder layout (an option on a pinned top bar); Navigation; Educo web app; React Native: diffClamp of
  the scroll offset driving `translateY` (reanimated), the app-platform standard.
- **Builder status** — **GAP**: no scroll direction and no `scroll-state` rule anywhere (`scroll-state` appears once in
  `lib/box-model.ts`, in the comment at `:6325`); 0 hits in `box-export.ts` and `interactions.ts`.
- **Gap ids** — SP-2 · NEW-F6 · (U3 acceptance: `:not(:focus-within)`).

### H6 · A header (or big title) that changes colour to suit the band beneath it
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a white menu over the dark hero turns dark over the light content, exactly at the band edge.
- **How it is done** — three routes. (a) **`mix-blend-mode: difference`** on a fixed white bar (inverts what is under it;
  contrast uncontrolled). (b) **Blockers** (Josh Comeau): each band carries a `position: sticky; top: 0;
  height: var(--header-height)` strip in its own colour behind a transparent fixed header — no JS, but every band needs
  header-height of free space at its top. (c) Per-band named `view-timeline`s + `timeline-scope` on the root driving the
  header's colour custom properties (NEW-D3), or an IntersectionObserver writing `data-theme` (Smashing 2021).
- **Timing** — switches at the boundary; class-toggle versions 300–600 ms (H2 numbers) → `--eu-dur-slow`.
- **Phone** — kept (cheap); blend modes cost a little compositing.
- **Reduced motion** — colour is not motion; keep it, stepped.
- **Accessibility** — the header text must pass 4.5:1 against **every** band it can sit over; route (a) cannot promise
  that (difference blend over mid-grey fails). Keyframed colours do not follow a mid-page theme switch (Josh) — animate a
  token custom property.
- **Cost** — (a) blend = compositing per frame; (b) zero JS; (c) main-thread colour per frame.
- **How common** — a held element with a blend mode on **10%** of sites (80 / 763, recount, measured 2026-10-02;
  modes: difference, exclusion, multiply, darken, screen, lighten, color-dodge); `mix-blend-mode` anywhere **41%**
  (300 / 732, AGGREGATE).
- **Examples** — accordion.net.au/work (fixed 64 px top bar, `difference`, slug `autoplay-video-on-hover-accordion`) ·
  radiance.family (73 px, `difference`, `interactive-letters-on-the-main-screen-radiance-team`) · saisei-sbj.webflow.io
  (90 px, `difference`, `page-transition-saisei-architecture`) · backstage.bonjovi.com (46 px, `exclusion`,
  `image-gallery-component-backstage-with-bon-jovi`) · Codrops "Context-Aware Animations for Fixed Elements"
  (https://tympanus.net/Development/ContextAwareLogoAnimationScroll).
- **Surfaces** — builder layout (a pinned header option); Navigation; Educo web app (sticky section headers in long
  pages); React Native: header colour from the visible section index (`onViewableItemsChanged`).
- **Builder status** — **GAP**: no blend on held bars, no blocker, no `view-timeline`/`timeline-scope` (0 hits in all three
  files); `pagePinCover` paints a colourless page bar the page's own colour instead (`lib/box-model.ts:4809-4813`).
- **Gap ids** — NEW-F2 · NEW-D3 · NEW-E5 · NEW-D5 (the big sticky title variant).

### H7 · A two-row header where only the menu row stays
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a thin top strip (phone number, "Apply now") scrolls away; the main menu row stays.
- **How it is done** — one `<header>`, sticky with a **negative** top equal to the first row's height:
  `header { position: sticky; top: calc(-1 * var(--utility-h)); }` (the CSS-Tricks no-JS shrinking header is the same
  mechanism with fixed heights — measure the row instead).
- **Timing** — none (position).
- **Phone** — kept; the strip is often hidden on phones anyway.
- **Reduced motion** — n/a.
- **Accessibility** — one landmark; the scrolled-away row's links stay reachable by Tab (they scroll back into view).
- **Cost** — none.
- **How common** — not measured by the runs; benchmark school homepages C2/B3 and BBC (04, U5).
- **Examples** — CSS-Tricks "How to create a shrinking header on scroll without JavaScript" (2021, 2 pens) · BBC.co.uk
  (named in 04, not measured).
- **Surfaces** — builder layout; Navigation; Educo web app; React Native: the strip as a list header, the menu as the
  sticky header index.
- **Builder status** — **GAP**: "Distance from the edge" Range is `min={0}` (`components/website/box/BoxInspector.tsx:796`);
  `pinCSS` writes `calc(var(--eu-pin-above, 0rem) + offset)` (`lib/box-model.ts:6059`) and would accept a negative.
- **Gap ids** — SF-15.

### H8 · Several bars stacked at one edge (announcement + header + sub-menu)
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a closure notice above the header and a sub-menu below it, all held, never overlapping.
- **How it is done** — each bar's `top` = the measured height of the bars above it (never a typed number: it breaks when
  a bar wraps at 360 px); or one sticky wrapper holding them all.
- **Timing** — none.
- **Phone** — kept, but this is where the ~25–30% screen budget (NN/g, Smashing; SF-5) is blown; drop the sub-menu on
  phones.
- **Reduced motion** — n/a.
- **Accessibility** — `scroll-padding-top` must equal the whole stack; announcement bar `role="status"` or a region.
- **Cost** — one measuring pass on resize/load/fonts.
- **How common** — not separately measured.
- **Examples** — CodePen "CSS: Sticky Header and Sidebar" (https://codepen.io/iamsaief/pen/eYZRZPB) · Apple product
  pages (sticky local nav under the global nav) · Wikipedia sticky header.
- **Surfaces** — builder layout; Alert banner component; Educo web app; React Native: a single header component holding
  both rows.
- **Builder status** — **HAVE**: `pinStackAttr` `lib/box-model.ts:5719-5745` (top **and** bottom), `pinStackPass`
  `:5783` queues per holder (`data-eu-pin-in`, `:5819`) and writes `--eu-pin-above` `:5843`, bottom stacks counted upward
  (`members.slice().reverse()`, `:5840`), script shipped only when needed (`pinStackNeeded` `:5935`, export
  `lib/box-export.ts:668`). Note: sibling sticky bars always **queue** — overlap (stacking cards) is impossible (SF-7).
- **Gap ids** — SF-7 (queue vs overlap) · SP-1 · SF-1.

### H9 · A sticky sidebar, contents rail or buy box beside long content
- **Family** Held · **trigger** scroll
- **What a visitor sees** — the "On this page" list (or the price and "Apply" button) stays beside the article.
- **How it is done** —
  ```css
  aside { position: sticky; top: calc(var(--held-top) + 1rem); align-self: start;
          max-height: calc(100dvh - var(--held-top) - 2rem); overflow-y: auto; overscroll-behavior: contain; }
  ```
  `align-self: start` is the whole fix for "my sticky sidebar does not stick" in grid/flex (stretched = zero travel).
  Active-link highlighting: `scroll-target-group: auto` + `:target-current` (Chromium 140, the browser writes
  `aria-current`), IntersectionObserver elsewhere.
- **Timing** — none for the hold; highlight colour change ~500 ms in Una's demo → `--eu-dur-slower` or `base`.
- **Phone** — **swapped**: stacks above the content (or becomes a bottom "Filter" bar / an accordion).
- **Reduced motion** — n/a (smooth-scroll to anchors must be instant under reduce).
- **Accessibility** — real links; a rail that scrolls itself must be keyboard-scrollable; a rail taller than the screen
  must not hide its last links (NEW-D1).
- **Cost** — none; `dvh` relayouts on toolbar change (use it for the cap only).
- **How common** — full-height side rail with links **3%** (21 / 763, recount, measured 2026-10-02); sticky elements sit in
  parents **2.2 screens** tall at the median (p75 4.6, p90 7.1, n = 409 sticky elements). Layout crawl: sticky sidebars on
  4.0% of 4,250 pages. CodePen `sticky-sidebar` (22 pens): jQuery 59%, sticky 32%.
- **Examples** — chaingpt.org (`webgl-robot-interaction-chaingpt-blockchain-ai`) · stooff.com (`hover-interaction-projects`) ·
  CSS-Tricks "A Dynamically-Sized Sticky Sidebar" · Una's scroll-spy pens https://codepen.io/una/pen/VYvmQJX · MDN docs pages.
- **Surfaces** — builder layout (sticky child of a row); Docs sidebar / TOC component; Educo web app (settings and report
  pages); React Native: tablet master–detail (`isTablet`) — the list is its own scroller, not sticky.
- **Builder status** — **HAVE**: clause 3 `alignSelf = "flex-start"` `lib/box-model.ts:6085-6086`; clause 3b
  `min-height: calc(100dvh - offset)` for a sticky container in a row `:6119-6123`; the page header pushes the rail down
  (`outer()` in `pinStackPass` `:5835`). **GAP**: a tall rail grows instead of scrolling itself (SP-8); no scroll-spy
  (0 hits `scroll-target-group`, `IntersectionObserver`).
- **Gap ids** — SP-8 · NEW-D1 · SA-9 · NEW-A6 · SP-12.

### H10 · A pinned scene — a panel that stays while a tall section scrolls past it
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a picture or panel stops and fills the screen while several screens of scrolling change
  what is in it (steps, images, numbers), then it lets go.
- **How it is done** — a tall wrapper (its height **is** the scroll length) and a sticky stage:
  ```css
  .scene { height: calc(var(--steps) * 100svh); }
  .stage { position: sticky; top: 0; height: 100svh; }
  ```
  What changes inside is Family 2 (S7). GSAP's `pin: true` does the same with a `.pin-spacer`; Horeca (Codrops 2026)
  replaced GSAP pin with CSS sticky per wrapper.
- **Timing** — none for the hold; the scene length measured in screens: sticky parents **2.2 screens** median (p75 4.6),
  GSAP pin-spacers **2 screens** median (p75 3.9, n = 28 sites).
- **Phone** — kept as layout, but each step should also exist inline; `svh`, never `vh` or `dvh` (toolbar jumps).
- **Reduced motion** — keep the hold (it is positional); swap what changes inside for cross-fades or show steps inline.
- **Accessibility** — the stage must fit one screen at 400% zoom or it hides content (un-pin when short, SF-4); the pane is
  often a duplicate and should be `aria-hidden` with the steps in reading order.
- **Cost** — sticky is free; the cost is what animates inside.
- **How common** — "pinned scroll section (sticky in a parent ≥ 1.8 screens)" **17%** (128 / 732, AGGREGATE, measured
  2026-10-02); recount 15% (115 / 763), median 2 pinned sections per such site; GSAP pin-spacer **4%** (28 / 732).
  CodePen `scrollytelling` (16 pens): sticky 38%, fixed 69%.
- **Examples** — cydstumpel.nl (2 tall pins, `default-page-transition-cyd-stumpel-portfolio-2025`) · tuxkarma.co
  (9 sticky, 4 tall pins, `gradient-text-selection-favicon-tux-karma-foundation`) · backstage.bonjovi.com (16 sticky,
  7 tall pins) · monogrid.com/project/oakley-project-2075 (`scroll-project-transition-monogrid-com`) · Codrops "Sticky
  Grid Scroll" (2026-03).
- **Surfaces** — builder layout (a tall band + a sticky full-screen pane); Story / Timeline component ("our history");
  Educo web app: onboarding; React Native: a paged `FlatList` (`pagingEnabled`) — not a pinned scroller.
- **Builder status** — **PARTIAL**: the pane is buildable (sticky child, `screenHeight: "full"` → `100svh`,
  `lib/box-model.ts:375`, `:5622`; sticky container in a row gets screen height `:6122`); nothing changes it step by step
  (0 hits `view-timeline`, `timeline-scope`).
- **Gap ids** — SA-6 · SF-4 · NEW-D2.

### H11 · A bar held at the bottom of a phone (call-to-action, cookie bar, bottom tabs)
- **Family** Held · **trigger** scroll (position)
- **What a visitor sees** — "Apply now · Call the school" (or "We use cookies") stays at the bottom of the phone screen.
- **How it is done** —
  ```css
  .cta { position: fixed; inset-inline: 0; bottom: 0;
         padding-bottom: calc(1rem + env(safe-area-inset-bottom)); }   /* needs viewport-fit=cover */
  html { scroll-padding-bottom: <bar height>; }                       /* Tab never lands under it (F110) */
  main { padding-bottom: <bar height>; }                              /* the page end is reachable */
  ```
  Cookie banner: better on the top layer (`<div popover="manual">`); a stable inset for banners is
  `env(safe-area-max-inset-bottom, env(safe-area-inset-bottom))` (Polypane, NEW-F4).
- **Timing** — slide-in on load 200–300 ms if animated → `--eu-dur-base`/`slow`, `out` easing.
- **Phone** — this **is** the phone pattern. Since Chrome 108 Android the keyboard resizes only the visual viewport, so a
  fixed bottom bar sits **behind** the keyboard; `interactive-widget=resizes-content` makes it ride above (good for an
  action bar, wrong for bottom tabs — NEW-B1). Hide bottom bars while typing (SF-16).
- **Reduced motion** — no slide; appear.
- **Accessibility** — WCAG 2.4.11's own sticky-footer example: focus must not be hidden under it (scroll-padding-bottom);
  a cookie banner fails unless modal or padded; ≥ 48 px targets.
- **Cost** — compositor-cheap. iOS 26 does not draw fixed content below its floating toolbar (SF-12).
- **How common** — a held cookie / consent element on **20%** of sites (149 / 763, recount on the desktop pass, measured
  2026-10-02); phone bottom bar: re-measure pending (R-16). Layout crawl: cookie banner 291 / 4,250 pages (6.8%).
  Third-party A/B blogs claim ~50% of shops use a sticky add-to-cart (unverified, not Baymard).
- **Examples** — seasoned.koto.studio (Cookiebot bar fixed bottom, `page-flip-seasoned`) · Jumia /
  most shops (04 U10, not measured) · ebidel chatbox demo (overscroll) https://ebidel.github.io/demos/chatbox.html ·
  viewport-resize demo https://viewport-resize-behavior.netlify.app/.
- **Surfaces** — builder layout (`pin: "bottom"`); Cookie banner, Call bar components; Educo web app (mobile web); React
  Native: a view outside the `ScrollView` + `useSafeAreaInsets()` (safe-area-context installed), `KeyboardAvoidingView`
  only for action bars.
- **Builder status** — **PARTIAL**: `pin: "bottom"` holds and bottom bars stack upward (`lib/box-model.ts:5840`), but
  "a bottom stack … is not owed any" scroll padding (`:5859-5860`, code path `edge === "top"` only `:5866`); no
  page-end padding; no `viewport-fit` / `interactive-widget` in the meta (`lib/box-export.ts:903`); `safe-area` 0 hits.
- **Gap ids** — SF-1 · SF-2 · SF-16 · SP-14 · NEW-B1 · NEW-F4 · SF-18 · SF-21 (bottom tab bar).

### H12 · A floating corner widget (back to top, chat, WhatsApp, floating action button)
- **Family** Held · **trigger** scroll (position; sometimes appears after scrolling)
- **What a visitor sees** — a round button in the bottom corner that is always there (or appears after a few screens).
- **How it is done** — logical insets so it mirrors in Arabic, primary action first in the DOM (web.dev FAB):
  ```css
  .fab { position: fixed; inset-block-end: max(1rem, env(safe-area-inset-bottom)); inset-inline-end: 1rem; }
  html { container-type: scroll-state; }      /* back-to-top only when useful, Chromium, zero JS */
  @container not scroll-state(scrollable: top) { .to-top { translate: 0 calc(100% + 1rem); } }
  ```
  Back to top needs no script: `<a href="#top">`.
- **Timing** — appear/disappear 200 ms → `--eu-dur-base`.
- **Phone** — kept; must clear the bottom bar (H11) and the home indicator; collisions with a cookie bar are common.
- **Reduced motion** — appear without sliding; smooth scroll to top becomes instant.
- **Accessibility** — a label ("Back to top"), ≥ 48 px, visible focus, keyboard reachable, never covering the focused
  element; NN/g: offer back-to-top only after ~4 screens.
- **Cost** — none.
- **How common** — a fixed element ≤ 120 × 120 px in the lower part of the desktop screen on **11%** (84 / 763, recount,
  measured 2026-10-02); phone: re-measure pending (R-16). Layout crawl: back-to-top 133 / 4,250 pages (3.1%).
- **Examples** — stabondar.com (`home-page-projects-section-stas-bondar-25`) · snackwithbenefits.com
  (`mouse-movement`-titled item) · theqream.com (`main-page-mascot-mouse-interaction-qream-design-agency-`) · web.dev FAB
  https://gui-challenges.web.app/FAB/dist/ · web.dev pen `OPLZWBj` (return-to-top on scroll-state).
- **Surfaces** — builder layout (corner pin + `hold: "fixed"`, or a floated block held on screen); WhatsApp / chat
  component (common in Nigeria and Ghana); Educo web app (help button); React Native: absolutely positioned `Pressable`
  above the tab bar with safe-area insets.
- **Builder status** — **HAVE**: corner pins via `PIN_EDGES` and fixed hold (`pinCSS` `lib/box-model.ts:5994`), a floating
  block held on screen `floatHoldCSS` `:6240`. **GAP**: physical `left`/`right` only (logical insets in the toast but not in
  pins, SF-10); no "appear after N screens" (SF-17); no safe area (SP-14).
- **Gap ids** — SF-17 · SF-10 · SP-14 · SF-2 · SF-3 (prints on every page).

### H13 · Sticky headings that hand over, and styling a block only while it is stuck
- **Family** Held · **trigger** scroll
- **What a visitor sees** — in a long list of events, the month heading stays at the top until the next month pushes it
  away; the stuck heading gets a shadow or tint.
- **How it is done** — each heading sticky **inside its own group** (`section > h2 { position: sticky; top: 0 }`), so the
  next group's heading pushes it out. Stuck-only styling:
  ```css
  .group-head { position: sticky; top: 0; container-type: scroll-state; }
  @container scroll-state(stuck: top) { .group-head > * { box-shadow: var(--shadow-sm); } }
  ```
  Paint only (no size change inside `stuck` — flicker, NEW-B2). Pre-Chromium-133 fallback: IntersectionObserver sentinel.
- **Timing** — shadow transition 300 ms in the Chrome demo → `--eu-dur-slow`.
- **Phone** — kept (cheap).
- **Reduced motion** — not motion; keep.
- **Accessibility** — headings stay real `h2`/`h3`; nothing conveyed by the tint alone.
- **Cost** — none; `scroll-state` is snapshotted once per frame.
- **How common** — `scroll-state` in shipped CSS: **1** site of 763 (cydstumpel.nl, recount, measured 2026-10-02);
  `css:scrollState` 1 / 732 (AGGREGATE). The hand-over itself is not separately measured.
- **Examples** — MDN live sample `List_with_sticky_headings` (position page) · web.dev pens `pvzVRaK` (stuck alphabet
  header), `GgKdryj` · chrome.dev/carousel/vertical/stack (stuck tint) · cydstumpel.nl.
- **Surfaces** — builder layout (pin a heading inside each section); Calendar / News list components; Educo web app
  (Messages, Fees by month); React Native: `SectionList` with `stickySectionHeadersEnabled`.
- **Builder status** — **HAVE** (hand-over): sticky holders per section are grouped separately (`pinStackPass`
  `lib/box-model.ts:5817-5822`; "two sticky bars in different sections → they hand over", comment `:5735`). **GAP**
  (stuck-only styling): no `scroll-state` rule; arrivals are timed from the page top (SP-3).
- **Gap ids** — SP-3 · ST-11 · NEW-B2 · SP-5 (no scrollable box to stick inside).

### H14 · A fixed full-screen layer behind or above the page (canvas, frame, watermark)
- **Family** Held · **trigger** none / scroll
- **What a visitor sees** — a background (gradient, 3D scene, grain, frame lines) that never moves while the content
  scrolls over it.
- **How it is done** — `position: fixed; inset: 0; z-index: -1; pointer-events: none` behind content (CSS-Tricks's fix
  for `background-attachment: fixed` on phones), or `aria-hidden` decorative frames on all four edges.
- **Timing** — none (the layer's own animation belongs to other families).
- **Phone** — kept if it is a flat image; WebGL layers are a large part of why award sites weigh 2.9 MB at the median
  (AGGREGATE weight median 2,951 KB; only 23% ≤ 1 MB) — drop for RULE AF.
- **Reduced motion** — the layer is still; any animation in it stops.
- **Accessibility** — decorative (`aria-hidden`), `pointer-events: none`; contrast of content over it.
- **Cost** — a transform/filter on **any ancestor** captures it (it scrolls away): SF-8. Prints on every page: SF-3.
- **How common** — a fixed element covering the whole desktop screen with an **opaque** background on **31%** (251 / 807,
  recount re-run later on 2026-10-02 as the runs grew); counting see-through layers too it was 58% (440 / 763) — the same
  flaw that inflated AGGREGATE's "intro cover 69%", so treat 58% as an upper bound. Many are WebGL canvases (`lib:three`
  58%, `lib:canvas` 36% in AGGREGATE), menus and intro covers rather than decorative backgrounds.
- **Examples** — seasoned.koto.studio (`main` fixed 1425 × 900) · Codrops "Crafting Scroll Based Animations in Three.js"
  (fixed canvas behind 100vh sections) · Codrops "Rock the Stage" · Codrops "Reflection Scroll Effect" (fixed shaded
  overlay, `pointer-events: none`).
- **Surfaces** — builder layout (a fixed block); Background component; Educo web app (none wanted); React Native:
  `ImageBackground` outside the scroller.
- **Builder status** — **HAVE / PARTIAL**: fixed blocks exist (`hold: "fixed"`), the canvas simulates them as `absolute`
  (`canvasFixedStyle` `lib/box-model.ts:6175`); capture warning counts tilt + glass variant only (`capturesFixed`
  `:6406-6413`) — hover and entrance transforms (`lib/interactions.ts:135-141`) are not counted.
- **Gap ids** — SF-8 · SF-9 · SF-3.

### H15 · Fixed side dot navigation for full-screen sections
- **Family** Held · **trigger** scroll
- **What a visitor sees** — a column of dots on the right edge, one per section, the current one filled.
- **How it is done** — `nav { position: fixed; inset-inline-end: 1rem; top: 50%; translate: 0 -50%; }`; real
  `<a href="#section">` links; current dot by `scroll-target-group: auto` + `:target-current` (Chromium 140) or a
  per-section `view-timeline` + `timeline-scope`, IntersectionObserver elsewhere.
- **Timing** — dot fill 200–300 ms → `--eu-dur-base`.
- **Phone** — **dropped** (hidden) on phones.
- **Reduced motion** — smooth jump becomes instant.
- **Accessibility** — every dot needs a text label ("Section 3" is not one), `aria-current`, ≥ 24 px target (2.5.8).
- **Cost** — none.
- **How common** — inside the full-height side-rail count, **3%** (21 / 763, recount, measured 2026-10-02).
- **Examples** — Codrops "Fixed Background Scrolling Layout" (https://tympanus.net/Blueprints/ScrollingLayout/) ·
  kffein.com/en/contact (`kffein-ui-microinteraction-on-contact-page`) · youssrirahman.com (`hover-interaction`).
- **Surfaces** — builder layout (fixed right rail); Navigation (scroll-spy); Educo web app: rarely; React Native: page
  indicator of a paged list.
- **Builder status** — **PARTIAL**: a fixed right rail is given full height (`pinCSS` clause 5b, `lib/box-model.ts`
  near `:6018-6040`); no current-section state (0 hits `scroll-target-group`, `view-timeline`).
- **Gap ids** — SA-9 · NEW-A6 · SP-12.

### H16 · A table whose header row and first column stay visible
- **Family** Held · **trigger** scroll (both axes)
- **What a visitor sees** — on a phone, a fees or timetable table scrolls sideways and down; the day names and the
  class names never leave.
- **How it is done** —
  ```css
  .table-wrap { overflow: auto clip; }            /* single-axis scroller: header sticks to the PAGE (Chromium 156) */
  thead th { position: sticky; top: 0; z-index: 1; background: var(--surface); }
  tbody th { position: sticky; inset-inline-start: 0; background: var(--surface); }
  thead th:first-child { z-index: 2; }
  table { border-collapse: separate; border-spacing: 0; }
  ```
  Elsewhere: a height-limited wrapper (`overflow: auto; max-height`) — the header sticks to the wrapper.
- **Timing** — none.
- **Phone** — the reason it exists.
- **Reduced motion** — n/a.
- **Accessibility** — wrapper `tabindex="0"`, `role="region"`, a label; real `th scope`; never combine with scroll snap
  (Roselli: snap + sticky hides the caption and first lines).
- **Cost** — none.
- **How common** — layout crawl: tables on 44 of 4,250 pages; not measured in the motion runs.
- **Examples** — CodePen "Scrollable Table" (https://codepen.io/darquiza/pen/PwbOrBw) · Chris Coyier pen `yLVNErX` · web.dev
  pen `VYmjePe` (sticky per axis) · Codrops "Sticky Table Headers & Columns" (2014 jQuery — what not to do).
- **Surfaces** — Table component; Educo web app (Fees, Reports, Timetable); React Native: a horizontal `ScrollView` per
  row synced to a header (or a native grid library).
- **Builder status** — **GAP**: no Table component (`BoxType` has none).
- **Gap ids** — SP-6 · SP-5.

---

## Checks that apply to every held block (not techniques — the traps)

| Trap | Where it bites | Builder today | Gap |
|---|---|---|---|
| An ancestor with `transform`, `filter`, `backdrop-filter`, `perspective`, `contain` or `will-change` makes a fixed child scroll away | hover lifts, entrances (`animation-fill-mode: both` keeps the transform), glass | counts tilt + glass variant only, `lib/box-model.ts:6411-6412` | SF-8 |
| `overflow: hidden` on an ancestor kills sticky (and `view()` timelines) | rounded or clipped sections | export writes `hidden` for clip or radius, `lib/box-export.ts:393`; page chrome upgrades to `clip`, `:864-866` | SP-4 · SA-1 |
| Fixed boxes print on every page | Term dates printed | nothing in the export's print rules | SF-3 |
| Opera Mini (extreme) has neither fixed nor sticky | Nigeria, Ghana | — | SF-11 |
| Physical left/right do not mirror in RTL | Arabic pages | `pinCSS` writes physical edges | SF-10 |
| Held bars take the screen at 400% zoom / landscape phone | 1.4.10 | pins are per width rung only | SF-4 · SF-5 |

## Corrections found while verifying (2026-10-02)

1. **AGGREGATE's held lines are broader than their names.** "fixed bar with the navigation" (55%) counts any fixed
   element containing a link (cookie banners, open menus, CTA buttons); a full-width top bar with links is **32%**.
   "glass (backdrop-filter) bar" (7%) counts any blurred held element; a glass **top bar** is **1%**.
2. **Codrops cluster E, NEW-E2** says the builder's stack might not count upward for bottom bars. It does:
   `pinStackAttr` returns `"bottom"` (`lib/box-model.ts:5744`) and `pinStackPass` orders a bottom stack upward
   (`:5840`). It still needs a browser check, but it is not a code gap.
3. **01-codepen** describes `pinArrivalAfter` as "default 12 units ≈ 120px". The constant is `PIN_ARRIVAL_AFTER = 120`
   **px**, converted with `remLen` (`lib/box-model.ts:6142`, `:6154`) — 7.5 rem, not 12 builder units.
4. **Cluster F** cites `lib/box-export.ts:359` as where `100svh` is emitted; that line is a comment. The value comes from
   `combineMinHeight` (`lib/box-model.ts:5622`).
