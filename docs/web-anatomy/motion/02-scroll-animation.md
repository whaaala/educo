# Scroll animation — reveal, parallax, scroll-driven timelines, pinned stories, progress, marquees

Researched 2026-10-02 (RULE R / RULE RS, the session's own research). This **extends**
[../motion-effects.md](../motion-effects.md) §2, §3, §6, §8, §9 and
[../scroll-and-position/](../scroll-and-position/README.md); section hand-overs are in
[01-section-transitions.md](01-section-transitions.md).

## What the existing files already hold (not redone here)

- `motion-effects.md` §8: the mechanics of `scroll()` / `view()`, range names, named timelines, `timeline-scope`,
  "declare `animation-timeline` after the shorthand", `@supports` gating; patterns A progress bar, B shrinking
  header, C section-linked nav highlight, E `scroll-state(stuck)`; the scroll-driven sticky heading; a short note on
  pinned scroll-telling and horizontal scroll; the sticky-block mapping table.
- `motion-effects.md` §4: reveal on scroll (+ IntersectionObserver fallback), stagger, text split, parallax ("never
  `background-attachment: fixed`"), smooth scroll (Lenis), marquee (2.2.2 pause button); §3 tokens; §6 rules;
  §9 Awwwards counts (ScrollTrigger 118/300, CSS timelines 22/300, IntersectionObserver 177/300).
- `scroll-and-position/01-codepen-sticky-fixed.md`: `pinArrival` (scroll-driven, verified), SP-1…SP-14.

**New here:** support state as of Oct 2026 (Safari 26, Firefox still flagged), **scroll-*triggered* animations**
(`animation-trigger` / `timeline-trigger`, Chrome 145), the full scroll-driven-animations.style demo set with the
technique of each, the e-commerce case-study numbers, timeline insets and the `entry`/`exit` vs `-crossing` clamp,
keyframes with range names, the `overflow: hidden` trap for `view()`, pure-CSS parallax (perspective) costs,
Apple's reduced-motion criteria, and a code audit of each technique.

## Sources and completeness

| Source | What it holds | Read |
|---|---|---|
| MDN *CSS scroll-driven animations* module page | reference list, guides, example | all sections |
| MDN guide *Timelines* | scroll/view, named/anonymous, `1ms` duration note, a11y | all sections |
| MDN guide *Timeline range names* | cover · contain · entry · exit · entry-crossing · exit-crossing, large-subject clamp | all sections |
| MDN guide *Timeline insets* | lengths vs %, `contain 25% contain 75%`, negative offsets | all sections |
| MDN `animation-timeline`, `scroll()`, `view()`, `animation-range`, `view-timeline`, `scroll-timeline`, `timeline-scope` | syntax, defaults, caveats, examples | all sections (compat tables are rendered by script: MDN says only "Limited availability / not Baseline"; versions taken from Chrome + search) |
| MDN `animation-range-start/-end`, `view-timeline-inset`, `scroll-timeline-axis/-name`, `ScrollTimeline`/`ViewTimeline` | longhands | **NOT READ separately** — covered by the shorthand pages |
| developer.chrome.com *Animate elements on scroll with scroll-driven animations* | concepts, JS `ScrollTimeline`/`ViewTimeline`, 6 demos, gotchas | all sections |
| developer.chrome.com *Scroll-driven animations case studies* (Tokopedia, redBus, Policybazaar, cards) | effects, CSS, numbers | all sections |
| developer.chrome.com *CSS scroll-triggered animations* (Chrome 145) | `animation-trigger`, `timeline-trigger`, `trigger-scope`, ranges | all sections; the linked spec action list **NOT READ** (only `play-forwards`/`play-backwards` shown) |
| developer.chrome.com *CSS scroll-state queries* (Chrome 133) | stuck · snapped · scrollable | all sections (7 CodePens **NOT OPENED**) |
| developer.chrome.com *Performant parallaxing* | scroll listeners vs `background-position` vs perspective; Safari quirks | all sections |
| scroll-driven-animations.style — **all 14 home-page demos + 4 tools** | progress bar · carousel step indicator · carousel with markers · reverse-scroll columns · cover→fixed header · image reveal · contact list · cover flow · window (parallax) carousel · stacking cards · horizontal section · 3D shoe explorer · shrinking header + shadow · scroll shadows | **code read:** progress bar, carousel with markers, reverse-scroll, cover→fixed header, image reveal, contact list, window carousel, stacking cards, horizontal section, shrinking header, scroll shadows (11). **Description only:** carousel step indicator, cover flow, 3D shoe explorer (3). Tools (4 visualisers) not opened — interactive. Video course, DevTools extension, polyfill repo **NOT READ** |
| Smashing Magazine *An Introduction To CSS Scroll-Driven Animations* (Dec 2024) | every demo, pitfalls table (`overflow: hidden`, absolute, layout props) | all sections |
| Builder.io *view-timeline* (sticky video wipe) | named timelines + `timeline-scope` + clip wipe | all sections |
| Keith Clark *Pure CSS Parallax Websites* | perspective/translateZ/scale formula, WebKit/iOS bugs | all sections |
| web.dev *prefers-reduced-motion* | which motion triggers vestibular symptoms; CSS/JS/`<link media>` fallbacks | all sections |
| Apple *Reduced Motion evaluation criteria* (App Store Connect) | depth/parallax, multi-axis, auto-advancing; dissolve replacements | all sections |
| Apple HIG *Motion* · Material 3 motion/transitions | — | **NOT READ — script-rendered, fetch returned only the title**; Material top-app-bar scroll behaviours known only from a search summary (pinned + elevation on scroll, exit-until-collapsed, enter-always) |
| CSS-Tricks *Pure CSS Horizontal Scrolling* | rotate(-90deg) trick + why not to | all sections + comments |
| CSS-Tricks forum *scroll down and then horizontal* | question only, no answer | read (empty) |
| CSS-Tricks *Bringing back parallax with scroll-driven animations* | — | **NOT FOUND** by search |
| Accessible marquee pattern (Fylgja, axe rules — search) | duplicate `aria-hidden`, pause button with `aria-pressed`, reduced motion | **search summary only** |
| Codrops sticky-section scroll demos | — | **NOT READ — HTTP 403** |

## Support today (Oct 2026)

| Feature | Chrome/Edge | Safari | Firefox | Baseline |
|---|---|---|---|---|
| `animation-timeline` `scroll()`/`view()`, `animation-range`, named timelines | 115+ | 26+ (threaded from 26.4) | **behind a flag** (still at 152, June 2026; Interop 2026 focus) | no |
| `timeline-scope` | 116+ | 26+ | flag | no |
| `animation-trigger` / `timeline-trigger` (scroll-*triggered*) | **145+** | no | no | no |
| `container-type: scroll-state` | 133+ | no | no | no |
| `prefers-reduced-motion` | 74+ | 10.1+ | 63+ | yes |

Consequence: every scroll-linked effect must be **complete without it** — `@supports` decides, and the resting
style is the content.

## The techniques

### S1. Reveal on scroll — *scrubbed* (scroll-driven) vs *played once* (scroll-triggered)
- **What:** a block fades/rises in as it comes into view.
- **Scrubbed:** `animation-timeline: view(); animation-range: entry 0% cover 28%` — progress follows the scroll and
  **reverses when scrolling back up**; stopping mid-range leaves the block half-faded.
- **Played once:** the reader crosses a line and a normal timed animation plays to the end.
  `timeline-trigger: --t view() entry 100% exit 0%; animation-trigger: --t play-forwards;` (Chrome 145+) — or an
  IntersectionObserver adding a class (177/300 award sites).
- **Range facts (new):** `entry`/`exit` are clamped to the scrollport for tall subjects; `entry-crossing` is not.
  Keyframes can carry range names: `@keyframes x { entry 0% {…} entry 100% {…} exit 0% {…} exit 100% {…} }` (in
  and out in one animation, the contact-list demo). Insets: `view(block 20% 20%)` or `contain 25% contain 75%`.
- **Gotcha (new, important):** `view()` tracks the **nearest scroll container**. An ancestor with
  `overflow: hidden` IS a scroll container; if it does not scroll, the timeline is **inactive** and the reveal
  never plays (Smashing pitfalls table: "switch to `overflow: clip`"). A pager strip (`overflow-x: auto`) is the
  nearest scroller of its pages on the block axis too.
- **Gotcha:** delays given in time on a progress timeline become proportions of the range — a time-based stagger
  must be checked, or the stagger done with offset ranges.
- **Reduced motion:** fade only, or nothing. **Cost:** compositor-only (opacity/transform); Tokopedia measured
  CPU while scrolling 50% → 2% after replacing JS. **A11y:** content never depends on the animation.
- **Common:** the most common scroll effect on every kind of site (card fly-ins across Tokopedia's whole funnel).

### S2. Reading-progress bar
- **What:** a thin bar at the top that fills as you read.
- **Build:** `html { scroll-timeline: --page block }` (or `scroll(root)`), bar `position: fixed; transform-origin: 0 50%;
  animation: grow auto linear; animation-timeline: --page` with `@keyframes grow { from { transform: scaleX(0) } }`.
  Never animate `width`. A range can stop it before the footer: `animation-range: 0% calc(100% - <footer>)`.
- **Without support:** hide the bar (`@supports not`) — an empty bar is misleading.
- **A11y:** decorative, `aria-hidden`; not motion that needs removal (it moves only with the reader's own scroll)
  but static under `reduce` is acceptable. **Cost:** ~10 lines of CSS. **Common:** LAYOUT_BENCHMARK C5 article
  page; blogs and long news posts.

### S3. Shrinking / condensing header, shadow on scroll
- Already HAVE (`pinArrival`, see table). New facts: Policybazaar shrinks comparison-table headers over `0 150px`;
  Tokopedia toggles a bar over `20px 70px`; Material's equivalents are "elevation on scroll", "exit until
  collapsed", "enter always" (= hide on scroll down, SP-2). The cover-card → fixed-header demo animates
  `height` and `font-size` (layout properties) — **avoid**: scale a wrapper instead.

### S4. Parallax
- **Kinds:** (a) `background-attachment: fixed` — repaints every frame on many Android GPUs, **ignored on iOS**;
  (b) pure-CSS perspective: scroller `perspective: 1px; overflow-y: auto`, layer `translateZ(-1px) scale(2)`
  (scale = 1 + (−z)/perspective) — composited, but makes the **body a nested scroller** (breaks sticky/fixed
  semantics, iOS momentum quirks, scaled images need 2× pixels); (c) scroll-driven: `animation-timeline: view();
  @keyframes { from { translate: 0 -10% } to { translate: 0 10% } }` on an image inside a clipped frame, or
  `object-position` sliding (window-carousel demo); (d) JS scroll listeners — skipped frames, jank (Chrome:
  "doesn't guarantee that parallaxing will keep in step").
- **Reduced motion:** **off entirely** — parallax is the first item on both web.dev's and Apple's vestibular lists
  ("depth simulation", "multi-speed motion").
- **Cost on 3G/low-end:** (c) is the only one that is both compositor-only and asset-neutral; never parallax text.
- **Common:** 39% of award sites use ScrollTrigger, mostly for parallax; common on school hero photos.

### S5. Pinned scrollytelling
- **What:** a picture or panel stays put while steps of text scroll past and change it.
- **Build:** tall section; sticky pane (`top: 0; height: 100svh`); each step `view-timeline: --step-n`; the wrapper
  `timeline-scope: --step-1, --step-2…`; the pane's layers animate on their step's timeline (Builder.io's Apple
  video wipe uses `animation-range: entry 0% contain 0%` on the *next* step).
- **Reduced motion:** cross-fades; or no pinning and each step shows its own image inline (best on phones).
- **A11y:** every step's content must also exist in reading order (the pane is a duplicate, `aria-hidden`).
- **Common:** product/storytelling pages; "our history" timelines on schools. LATER.

### S6. Horizontal-scroll section
- **Scroll-jacked:** section `height: 500vh; view-timeline: --pin`; sticky inner `100vh`, `overflow-x: hidden`;
  track `animation: move linear forwards; animation-timeline: --pin; animation-range: contain 0% contain 100%`,
  `@keyframes move { to { transform: translateX(calc(-100% + 100vw)) } }` (`100vw` includes the scrollbar — use
  `100%` of the sticky box).
- **Traps:** keyboard Tab into panel 5 does not scroll the page to it; at 360px the "500vh" is five screens of
  scrolling for nothing visible moving vertically; under `reduce` it must become a stack. The rotate(−90°) trick
  is broken on iOS and keyboard (CSS-Tricks) — never.
- **The native answer:** an `overflow-x` strip with `scroll-snap` that touch, trackpad and arrow keys drive.

### S7. Scroll-linked indicators (carousel markers, step indicator, scroll shadows)
- Markers: the strip `scroll-timeline: --carousel x`, the component `timeline-scope: --carousel`, marker *i*
  animates over `calc((i-1)*20%) calc(i*20% + 1px)`. Scroll shadows: sticky `::before/::after` gradients whose
  opacity runs on the container's own `scroll-timeline` over the first/last `1em–2em`. Both zero JS,
  decorative; the real state (`aria-current`) still needs script or real links.

### S8. Whole-page colour change as sections arrive
- Each section `view-timeline: --s-n`, `body { timeline-scope: … }`, the page background animates through each
  section's colour — or an IntersectionObserver writing a class. **A11y:** every band's text must pass contrast
  against **every** colour it can be shown over during the change. Common on agency sites, rare on schools.

### S9. Reverse-scrolling columns / multi-speed layouts
- Outer columns `animation-timeline: scroll(root block)` moving opposite to the page. Multi-speed motion — Apple
  lists it as a vestibular trigger; off under `reduce`. LATER at most.

### S10. Marquee / ticker
- Covered in `motion-effects.md` §4 (duplicate + `aria-hidden` + `inert`, translate 0 → −50%, **visible pause
  button**, static under `reduce`). New: the pause button's state via `aria-pressed` and its label switching
  "Pause"/"Play"; hover/focus pause alone fails on touch. Not scroll-linked; a time loop → **WCAG 2.2.2**.
- **Cost:** compositor-only; duplicating content doubles its DOM and images — keep it to text/logos.
- **Common:** logo strips and "news ticker"/announcement bars, including school sites (term-date notices).

## HAVE / PARTIAL / GAP against the builder (verified in code 2026-10-02)

| Technique | Status | Evidence |
|---|---|---|
| S1 entrance effects (fade, rise, drop, sideways, zoom, sharpen) | **HAVE** | `REVEAL_EFFECTS` `lib/interactions.ts:133`; field `revealEffect` `lib/box-model.ts:464`; items too (`itemEffectsCss` `interactions.ts:193`) |
| S1 on scroll (scrubbed) | **HAVE** | `revealScroll` `box-model.ts:466`; `revealCss` adds `@supports (animation-timeline: view()) { animation-timeline: view(); animation-range: entry 0% cover 28% }` (`interactions.ts:242`, `REVEAL_VIEW_RANGE` `:214`); unsupported browsers play it on load (base rule `:232`) |
| S1 played once (trigger) | **GAP** | no `animation-trigger`, no IntersectionObserver anywhere in `lib/` (grep 0) |
| S1 inside a rounded/clipped box or a pager | **PARTIAL — likely broken** | the export writes `overflow: hidden` for `clip` or any radius (`lib/box-export.ts:393`); the pager strip is `overflow-x: auto; overflow-y: hidden` (`box-model.ts:3507-3508`) — either becomes the `view()` scroller and does not scroll on the block axis → inactive timeline, no reveal |
| S1 stagger | **HAVE / CHECK** | `revealStagger` `box-model.ts:468`; 90 ms per child up to 10 (`interactions.ts:238`) — time delays on a `view()` timeline unverified |
| S1 entrance + pinned arrival together | **HAVE** | merged animation lists in `pinArrivalCss` (`box-model.ts:6342-6364`) |
| Reduced motion | **HAVE** | `animation:none` under `reduce` for reveals (`interactions.ts:246`) and arrivals (`box-model.ts:6366`); hover strips transforms (`interactions.ts:105-107`); canvas honours the OS setting (`BoxCanvas.tsx:3544-3551`). No in-editor "preview reduced motion" toggle (`motion-effects.md` §6 rule 2) — not found |
| Motion tokens | **HAVE** | `--eu-dur-*`, `--eu-ease-*` emitted `lib/educo-ui/tokens.ts:164-165`; reveals use them (`interactions.ts:212-213`) |
| S2 reading-progress bar | **GAP** | no `scroll(root)` progress element; only the alert's time-based progress (`box-model.ts:1686`) |
| S3 shrink / shadow / solid / glass on scroll | **HAVE** | `pinArrival` + `pinArrivalAfter` (`box-model.ts:423-425`), keyframes `:6262`, CSS `:6335-6366`, scroll-driven, `@supports`-gated, zero JS |
| S4 parallax — fixed background | **PARTIAL** | `bgAttach: "fixed"` (`box-model.ts:327`, emitted `:1035`, `:1138`; checkbox "Fixed background (parallax)" `BoxInspector.tsx:1317`) — no iOS / low-end / reduced-motion fallback (SP-11) |
| S4 parallax — scroll-driven image shift | **GAP** | no `view()` translate/`object-position` effect |
| S5 pinned scrollytelling | **PARTIAL** | the sticky pane exists (`pin` + `hold`, `pinCSS`, sticky child of a row gets travel); step-driven change GAP — no `view-timeline` / `timeline-scope` in `lib/` (grep 0) |
| S6 horizontal content | **HAVE (native)** / GAP (scroll-jacked) | pager = `x mandatory` snap strip, real links, keyboard, reduced-motion smooth scroll undone (`box-model.ts:3466-3521`, `pagerScript`); scroll-jacked horizontal section not built |
| S7 carousel markers / step indicator | **PARTIAL** | pager dots are real links with script-set state (`PagerNav`, `box-model.ts:3479`); no scroll-driven marker or progress |
| S7 scroll shadows | **GAP** | no scrollable box exists (SP-5) |
| S8 page colour change on scroll | **GAP** | — |
| S9 reverse columns | **GAP** | — (LATER) |
| S10 marquee / ticker | **GAP** | grep `marquee|ticker` 0 hits |
| `scroll-state()` stuck/snapped | **GAP** | 0 hits (also SP-3) |
| Smooth scroll (Lenis) | **GAP** | only `scroll-behavior: smooth` inside the pager (`box-model.ts:3512`) |

## Gap list

| Id | Plain description | Sort |
|---|---|---|
| **SA-1** | "Arrive when scrolled into view" probably never plays inside a rounded or clipped box, or inside a pager page, because `overflow: hidden` becomes the scroller `view()` watches. Check in a headed browser; the fix is the same `overflow: clip` change as SP-4. | **CHECK → MUST** |
| **SA-2** | Entrances are scrubbed: they run backwards when the reader scrolls up and can stop half-faded. Offer (or default to) "play once" — `animation-trigger` where supported, a few lines of IntersectionObserver elsewhere, content visible without either. | DECIDE |
| **SA-3** | "Arrive one after another" combined with "on scroll": check that the 90 ms delays really stagger on a scroll timeline; if not, stagger by offset ranges. | CHECK |
| **SA-4** | Reading-progress bar for long pages (news posts, policies): a pinned bar that fills with the page's scroll, pure CSS, hidden where unsupported, `aria-hidden`. | **MUST** |
| **SA-5** | Gentle parallax on a picture (moves ±10% inside its frame as it scrolls past), compositor-only, off under reduced motion; and make the existing fixed-background checkbox fall back on iPhones, low-end phones and reduced motion (SP-11). | DECIDE |
| **SA-6** | Pinned story: a picture that stays while steps scroll past and each step changes it (named view timelines + `timeline-scope`); on phones and under reduced motion each step shows its own picture inline. | LATER |
| **SA-7** | Horizontal-scroll section driven by vertical scrolling. The pager already gives the accessible native version; build the scroll-jacked one only if asked, and it must become a stack under reduced motion and on phones. | LATER |
| **SA-8** | Marquee / news ticker (logos, announcements) with a visible Pause/Play button (`aria-pressed`), duplicate copy hidden from assistive tech, static and wrapping under reduced motion (WCAG 2.2.2). | DECIDE |
| **SA-9** | Section-linked highlight in a sticky nav or table of contents (pattern C in `motion-effects.md` §8 + real `aria-current`). Belongs to the Navigation component (SP-12). | LATER |
| **SA-10** | Scroll-linked indicators for the pager (a progress line or markers driven by the strip's own scroll) and scroll shadows on a scrollable box (with SP-5). | LATER |
| **SA-11** | Whole-page background colour that changes as sections arrive, with contrast checked against every colour shown. | LATER |
| **SA-12** | "Preview reduced motion" switch in the editor so a teacher sees what a motion-sensitive visitor sees (`motion-effects.md` §6 rule 2; canvas only follows the OS today). | DECIDE |
| **SA-13** | Firefox (flagged) and older Safari: confirm entrances play on load, arrivals keep the resting look, and nothing is hidden — one headed run per engine. | CHECK |
| **SA-14** | Reverse/multi-speed columns and 3D cover-flow — award-site polish and vestibular triggers; not for the builder now. | LATER |
