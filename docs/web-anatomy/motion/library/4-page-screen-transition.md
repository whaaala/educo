# Family 4 · Page / screen transition

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per technique, in the library's entry shape. Written
2026-10-02 from the measured runs ([AGGREGATE](../../research-runs/AGGREGATE.md), raw records in
`C:\Users\eyite\educo-research\runs\*.json`, screenshots in `…\shots\<source>\`), the research files
[03-page-transitions](../03-page-transitions.md), [06-motion-rules](../06-motion-rules.md),
[09-app-motion](../09-app-motion.md), [motion-effects §7 / §9](../../motion-effects.md), and the reading notes
(`educo-research\reading\B.md`, `E.md`). Every builder / app status line was grepped again on 2026-10-02.

**Tokens today** (`lib/educo-ui/tokens.ts:47-52`): `--eu-dur-fast` 120 ms · `base` 200 · `slow` 320 · `slower` 500;
`--eu-ease-standard` (.2,0,0,1) · `in` (.4,0,1,1) · `out` (0,0,.2,1) · `in-out` (.4,0,.2,1) · `emphasized`
(.2,0,0,1.2, an overshoot — rename proposed in MR-9). Tokens marked *(proposed)* do not exist yet: `--eu-dur-page`
(PT-3), `--eu-dur-instant` (MR-9).

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) · re-measured n = 678 (this file)

What happened when the measuring script clicked the first visible same-site link on each site (desktop 1440).

| Kind (what a visitor sees) | AGGREGATE share (n 732) | Re-measured from raw records (n 678) | Entry |
|---|---|---|---|
| No same-site link to follow (one-page site or only external links) | 30 % | 180 (27 %) | — |
| Single-page app, a full-screen layer covers the swap ("spa + overlay") | 27 % | 203 (30 %) — but only **88 (13 %)** have a layer that is opaque or actually moves; **115 (17 %)** are a transparent fixed layer that never changes (a cursor layer, a canvas) | F4.5 |
| Plain full page load, nothing animates | 18 % | 123 (18 %) | F4.1 |
| Single-page app swaps content with no cover ("spa swap") | 10 % | 66 (10 %) | F4.6 |
| Page is covered before it leaves, then a full load ("full load + overlay") | 9 % | 65 (10 %) — **24 (4 %)** real, 41 transparent static layers | F4.7 |
| Link click did not navigate (menu toggle, modal, JS link) | 4 % | 31 (5 %) | — |
| Same-document View Transition ran | 1 % | 7 (1.0 %) | F4.10 / F4.5 |
| Cross-document View Transition ran | 0 % | 3 (0.4 %) | F4.2 |

Other measured lines: View Transitions written in the site's CSS **44 / 732 (6 %)**, cross-document opt-in 8 (1 %);
Barba 59 (8 %), Swup 11 (2 %); CodePen tags `page-transition` 43 pens (fixed layer 47 %, GSAP 16 %, VT 2 %),
`view-transition(s)` 40 pens (VT in 88 %). Of the 112 sites whose overlay really moves, **26 (23 %)** mention
`prefers-reduced-motion` anywhere in their CSS.

**Where focus lands after a client-side (SPA) navigation** (n 276 SPA clicks): `<body>` 139, still on the clicked
link 112, a button 15, an `h1` **1**. Routers almost never move focus to the new content.

**App screens (not measured on live sites — from the systems):** stack push/pop is every platform's default (M3,
HIG, Polaris "deeper = right to left"); top-level tabs fade through (M3, Fluent); predictive back on Android 14+.

---

## Entries

### F4.1 · Plain page load (the baseline every transition falls back to)
- Family 4 · trigger navigation
- **What a visitor sees** — the old page disappears and the new one appears; nothing moves.
- **How it is done** — an `<a href>` to another HTML file. Nothing else.
- **Timing** — the network's: measured page `load` median **2.9 s** (n 678, cache off, desktop). No token.
- **Phone** — the only kind that costs nothing extra on a 360 px Android on 3G.
- **Reduced motion** — already still.
- **Accessibility** — the browser moves focus to the top of the new document and the screen reader reads the new
  `<title>`; back, forward, bfcache and scroll restoration all work. This is the bar every other entry must match.
- **Cost** — none. **How common** — 18 % of measured sites (n 732), plus the fallback of every VT site.
- **Examples** — shopify.com/editions/summer2024 (aw-coll-hovers, `awwwards-com-inspiration-shopify-summer-24-edition-hero-animation-shopify-editio-6-transition.jpg`) · treebytree.earth · vault49.com · superlist.com (`awwwards-com-inspiration-superlist-smoothly-loading-transition-6-transition.jpg`).
- **Surfaces** — builder export (every page) · Educo web app (hard navigations) · RN: n/a.
- **Builder status** — **HAVE**: one HTML file per page, shared stylesheet, own `<title>`, skip target
  (`lib/box-export.ts:790` `renderSiteFiles`, `:696`, `:904`, `:492` `id="main" tabindex="-1"`).
- **Gap id** — none (the reference).

### F4.2 · Cross-document cross-fade (View Transition, zero JavaScript)
- Family 4 · trigger navigation
- **What a visitor sees** — on clicking to another page of the same site, the old page fades into the new one.
- **How it is done** — `view-transition` (browser snapshots). The opt-in goes in a tiny inline `<style>` at the very
  start of `<head>`, before the stylesheet link (Chrome may check before a large stylesheet loads — vtbag), and the
  pseudo-element rules go **unscoped** (never under `.eu-root`):
  ```html
  <style>@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}}</style>
  ```
  ```css
  ::view-transition-group(root){animation-duration:var(--eu-dur-page,300ms);animation-timing-function:var(--eu-ease-standard)}
  @media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
  ```
  Runs only for same-origin push / replace / back-forward from a click (not reload, not a typed URL), main frame
  only, skipped if the new page has not rendered in **4 s**. All pseudo-element styling comes from the page you
  arrive on.
- **Timing** — UA default 250 ms. Measured: the 3 sites that ran one had no readable duration (the run cannot read
  pseudo-elements); Next.js guide 150 ms out + 210 ms in; live sites' transition median 350 ms, mode 300 ms (n 732).
  → `--eu-dur-page` *(proposed)* 300 ms, `--eu-ease-standard`; keep ≤ 400 ms (the page takes no input meanwhile).
- **Phone** — **kept** (fade only). Snapshots are textures; the root fade is opacity only (compositor). The real cost
  is the wait: the old page stays frozen until the new one can render; over 4 s on 3G the animation is dropped and
  the page simply appears. Samsung Internet (to v30), Opera Mini, UC: no support → plain load.
- **Reduced motion** — none (opt-in lives inside `no-preference`, plus the `reduce` guard). A fade is not motion
  under 2.3.3, but the guard is still the policy here because `lib/educo-ui/base.ts:145-146` does not reach
  `::view-transition-*` on `<html>`. Real sites: 2 of the 3 cross-document sites had no reduced-motion rule.
- **Accessibility** — native navigation: focus to document start, new title announced, nothing to rebuild. 2.3.3
  (fade is not motion); keep ≤ 400 ms so input is not swallowed.
- **Cost** — ~60 bytes per page, no script, no library.
- **How common** — ran on 3 of 678 measured sites (0.4 %); cross-document opt-in present on 8 / 732 (1 %); motion-effects
  §9 fingerprint: VT referenced by 30 of 60 newest Awwwards Animation sites (code presence, upper bound).
- **Examples** — filayyyy.com (aw-coll-transitions, `awwwards-com-inspiration-page-transition-filayyyy-1-6-transition.jpg`) ·
  multi-page-transition.webflow.io (wf-page-transitions, `webflow-com-made-in-webflow-website-multi-page-transition-6-transition.jpg`) ·
  candelaivanhoe.com.au (`webflow-com-made-in-webflow-website-candelaivanhoe-6-transition.jpg`) ·
  view-transitions.chrome.dev (demo site).
- **Surfaces** — builder layout (site setting) · Educo web app: n/a while on Next 15 (see F4.12) · RN: n/a.
- **Builder status** — **GAP**: 0 hits for `@view-transition|view-transition-name|startViewTransition|pagereveal|pageswap`
  in `lib/ components/ app/ apps/mobile/` (grep 2026-10-02). Precondition **HAVE** (F4.1). The Preview is a `srcdoc`
  iframe and cannot show it (`lib/box-export.ts:892-896` comment / `pageDocument`).
- **Gap id** — PT-1, PT-2, PT-3, PT-6, PT-7, PT-12, PT-18, PT-19.

### F4.3 · Directional slide between pages (types, back = reverse)
- Family 4 · trigger navigation
- **What a visitor sees** — going forward, the new page slides in from the right; pressing Back, it slides the other way.
- **How it is done** — `view-transition` types. Zero-JS form: each page declares how it arrives,
  `@view-transition{navigation:auto;types:slide}`, matched with `html:active-view-transition-type(slide)`. Direction
  needs a ~400-byte classic `<head>` script reading `navigation.activation.from/entry` in `pagereveal` and adding
  `forward`/`backward` (Chrome "stack navigator", vtbag Turn-Signal).
  ```css
  @keyframes eu-out-l{to{translate:-30% 0;opacity:0}} @keyframes eu-in-r{from{translate:30% 0;opacity:0}}
  html:active-view-transition-type(forward)::view-transition-old(root){animation:eu-out-l var(--eu-dur-page) var(--eu-ease-in) both}
  html:active-view-transition-type(forward)::view-transition-new(root){animation:eu-in-r var(--eu-dur-page) var(--eu-ease-out) both}
  ```
- **Timing** — Next.js guide: exit 150 ms ease-out, enter 210 ms after 150 ms, offset 60 px (→ 3.75 rem); MDC shared
  axis 30 dp; Material: exit shorter than enter. → out `--eu-dur-fast`/`--eu-ease-in`, in `--eu-dur-page` *(proposed)*/`--eu-ease-out`.
- **Phone** — **swapped to the fade** by default (PT-16): a root slide is still compositor-only, but a full-screen
  slide is the biggest vestibular trigger (Val Head) and the phone screen is all of it; optionally gate with
  `@media (min-width:48rem){@view-transition{navigation:auto;types:slide}}`.
- **Reduced motion** — fade or nothing (Apple: replace x/y movement with fades).
- **Accessibility** — as F4.2; never name tall blocks (`main`) or a scrolled-away header, or they "fly" (F4.9).
- **Cost** — CSS plus an optional 400-byte script. **How common** — part of the 10 VT runs measured; types used in
  CSS-Tricks / Chrome demos; no separate live-site count.
- **Examples** — view-transitions.chrome.dev/pagination/spa-types/ · Bramus Turn-Signal demo (vtbag.dev) · MDN blog
  "View transitions: a beginner's guide" (per-page stylesheets) · cydstumpel.nl (Swup native VT, `awwwards-com-inspiration-default-page-transition-cyd-stumpel-portfolio-2025-6-transition.jpg`).
- **Surfaces** — builder layout (preset) · RN: native stack push already slides (F4.12).
- **Builder status** — **GAP** (as F4.2). The exporter already knows page order (`orderedPages`,
  `lib/box-export.ts:727`) and each page has its own `<style>` for a per-page type.
- **Gap id** — PT-4, PT-13, PT-14, PT-16.

### F4.4 · Wipe / curtain between pages (clip-path on the new page)
- Family 4 · trigger navigation
- **What a visitor sees** — the new page is revealed by a growing circle, a bar or a diagonal edge sweeping across.
- **How it is done** — `clip-path` keyframes on the root pseudo-element (no library):
  ```css
  @keyframes eu-wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}
  ::view-transition-old(root){animation:none} ::view-transition-new(root){animation:eu-wipe var(--eu-dur-slower) var(--eu-ease-out)}
  ```
  The award-site version is a coloured overlay div driven by GSAP + Barba (F4.5).
- **Timing** — measured overlay layers on real-overlay sites: transition-duration median **500 ms** (p25 300, p75
  800; 539 values from 112 sites); motion-effects §9: 48 of 366 Transitions-collection items are mask/clip wipes.
  → `--eu-dur-slower` 500 ms, `--eu-ease-out` (expo-out family is the most frequent named curve:
  (.19,1,.22,1) ×3,114, (.16,1,.3,1) ×1,070 elements).
- **Phone** — **swapped to the fade** (full-screen, and `clip-path` animation of a full-viewport texture repaints on
  some low-DPI GPUs); keep it for ≥ 48 rem screens.
- **Reduced motion** — fade. A full-screen wipe is "large area" motion (Val Head trigger 1).
- **Accessibility** — 2.3.3; ≤ 500 ms; never a flashing colour (2.3.1).
- **Cost** — compositor for `clip-path: inset()` in Chromium; ~100 bytes.
- **How common** — 48 / 366 collection items by title (§9); clip-path present in **43 %** of live sites' CSS (n 732),
  `clip-path` CodePen tag 476 pens.
- **Examples** — gianlucagradogna.com/through-this-lens (layer `clip-path: inset(...)`, `awwwards-com-inspiration-hover-image-effect-gianluca-gradogna-portfolio-6-transition.jpg`) ·
  findworkhappiness.com (menu `clip-path: circle(0 at …)`, `…-mask-reveal-the-search-for-work-happiness-menu-150.jpg`) ·
  labs.chaingpt.org (column-wipe loader reused for page transitions, Codrops case study; `awwwards-com-inspiration-webgl-footer-chaingpt-labs-6-transition.jpg`) ·
  Codrops "From Shader Uniforms to Clip-Path Wipes" (2026-05-06).
- **Surfaces** — builder layout (preset "Wipe") · RN: none (native stack only).
- **Builder status** — **GAP** (no view-transition code; grep above).
- **Gap id** — PT-4, PT-16.

### F4.5 · Overlay router curtain (Barba / Swup: cover, swap, uncover)
- Family 4 · trigger navigation
- **What a visitor sees** — a coloured panel slides or fades over the page, the content changes underneath, and
  the panel leaves to show the new page — the URL changes but the page never reloads.
- **How it is done** — script: intercept same-site clicks, `fetch` the next page, play a leave animation on a fixed
  overlay, swap the `data-barba="container"` / `#swup`, play an enter animation, `history.pushState`. Swup
  `native: true` hands the animation to same-document View Transitions.
- **Timing** — measured overlay layers median **500 ms** (p25 300, p75 800, n 539 values / 112 sites); GSAP eases on
  live sites: `power2.inOut` ×679, `power3.out` ×579, `expo.out` ×556. Barba aborts a page that takes > 2 s.
  → total ≤ `--eu-dur-slower` + `--eu-dur-fast`.
- **Phone** — **dropped** for Educo: a router and GSAP add 30–70 KB of script to every page (RULE AF budget 100 KB).
- **Reduced motion** — Swup a11y plugin `respectReducedMotion`; Barba has nothing. Measured: 26 of 113 real-overlay
  sites mention reduced motion at all.
- **Accessibility** — the browser no longer navigates, so it no longer moves focus or announces. Measured on 276 SPA
  clicks: focus ended on `<body>` (139) or stayed on the clicked link (112); **1** moved it to the new `h1`. The
  minimum a router must rebuild (Swup a11y plugin): `aria-live` "Navigated to {title}", focus to the new `h1`/`main`,
  title update, scroll reset, reduced motion. The overlay itself must be `inert`/`aria-hidden`.
- **Cost** — Barba ≈ 7 KB gz + GSAP; analytics page views by hand; Barba does not load the next page's `<head>` styles
  (an Educo page's per-page `<style>` would arrive missing — `lib/box-export.ts:803`).
- **How common** — the most common *animated* kind: 13 % real (88 / 678), 27–30 % counting static layers; Barba
  8 %, Swup 2 % (n 732).
- **Examples** — duten.com (`.s__overlay`, 0.6 s linear, `awwwards-com-inspiration-texture-hover-reveal-duten-6-transition.jpg`) ·
  duck.school/en (`.loader` translateY, `awwwards-com-inspiration-duck-rain-interaction-6-transition.jpg`) ·
  gianlucagradogna.com · cydstumpel.nl (Swup native VT, 61 reduced-motion rules — the good one).
- **Surfaces** — not for the builder export; Educo web app: Next.js routing instead (F4.12).
- **Builder status** — **not wanted** (03 §1.4, §4.13): decision recorded, nothing to build.
- **Gap id** — PT-11 (decided: do not ship).

### F4.6 · SPA content swap (no cover)
- Family 4 · trigger navigation
- **What a visitor sees** — the header stays; the page content changes in place, sometimes with a quick fade.
- **How it is done** — client-side router (Next.js `<Link>`, Nuxt, Astro ClientRouter); optional fade on the
  content container or React `<ViewTransition>`.
- **Timing** — the 66 measured swaps showed no cover; Polaris: no staggered animation during navigation. → `--eu-dur-fast`
  fade out / `--eu-dur-base` fade in if any.
- **Phone** — kept; nothing to pay beyond the framework.
- **Reduced motion** — instant swap.
- **Accessibility** — the same focus / announce gap as F4.5 (focus on body or the old link); route announcer
  required (Next.js ships one). 2.4.3 focus order.
- **Cost** — the framework's. **How common** — 10 % (n 732); Next 10 %, Nuxt 10 % of sites.
- **Examples** — accordion.net.au/work (`awwwards-com-inspiration-autoplay-video-on-hover-accordion-6-transition.jpg`) ·
  buttermax.net (`awwwards-com-inspiration-reactive-cursor-1-6-transition.jpg`) · fiddle.digital · alectear.com.
- **Surfaces** — Educo web app (every route change under `app/`) · builder export: n/a (static).
- **Builder / app status** — Educo web app **HAVE (no motion)**: Next.js App Router, `next` 15.1.3 / `react` 19.2.0
  (`package.json:64`, `:66`); no route transition (0 VT hits).
- **Gap id** — AM-18.

### F4.7 · Cover before leaving, reveal on arrival (MPA overlay)
- Family 4 · trigger navigation
- **What a visitor sees** — on click a panel covers the page; the next page loads normally and its panel slides away.
- **How it is done** — a click handler plays an exit animation on a fixed overlay, then sets `location.href`; the new
  page starts covered and uncovers on `load`. Webflow interactions do this out of the box.
- **Timing** — measured on 24 real cases: overlay timings 0.15–0.6 s (e.g. brewdistrict24 0.3 s ease, gritz.it
  0.15 s ease-in-out). → `--eu-dur-slow` cover, `--eu-dur-slower` reveal.
- **Phone** — **dropped**: it adds the animation time to every navigation on top of a 3G load, and a script failure
  can leave the page covered.
- **Reduced motion** — skip the cover.
- **Accessibility** — the overlay must not hold focus or be read; when the reveal waits on `load`, content is hidden
  longer (2.2.2 is not triggered, but it is a delay with nothing to read). Prefer F4.2/F4.4, which do the same look
  natively.
- **Cost** — script + delay on every navigation. **How common** — 9 % counted, **4 % real** (24 / 678).
- **Examples** — brewdistrict24.com (`awwwards-com-inspiration-product-switch-brewdistrict24-6-transition.jpg`) ·
  stooff.com (`…-hover-interaction-projects-stooff-interior-projects-6-transition.jpg`) · zdl.studio/hr
  (`…-zdl-studio-hover-transition-effect-6-transition.jpg`) · invisiblenorth.com/work.
- **Surfaces** — none recommended. **Builder status** — **not wanted** (F4.2/F4.4 replace it).
- **Gap id** — PT-11 (same decision).

### F4.8 · Shared-element morph (card picture grows into the detail page)
- Family 4 · trigger navigation
- **What a visitor sees** — the picture on a news card flies and grows into the big picture at the top of the
  article, and shrinks back on Back.
- **How it is done** — `view-transition-name` unique per item on both pages + `view-transition-class` for one rule;
  `object-fit: cover` on old/new to keep the aspect:
  ```css
  .card-img,.hero-img{view-transition-class:news-image}
  ::view-transition-group(*.news-image){animation-duration:var(--eu-dur-slower);animation-timing-function:var(--eu-ease-standard)}
  ::view-transition-old(*.news-image),::view-transition-new(*.news-image){height:100%;object-fit:cover}
  ```
  App: React `<ViewTransition name share>` (React 19.3); native Reanimated `sharedTransitionTag` (≥ 4.2, flag).
- **Timing** — Next guide morph 400 ms; MDC container transform 300 / 250 ms. → `--eu-dur-slower` max, standard curve.
- **Phone** — **swapped to the fade** on narrow screens: every group animates `width`/`height` on the main thread
  (Bramus), and each name is a GPU texture; name just in time, a handful per page.
- **Reduced motion** — crossfade (M3: disable shape morphing; Reanimated skips shared transitions).
- **Accessibility** — focus as a real navigation; the morph must not delay focus.
- **Cost** — one snapshot per named element. **How common** — Codrops "Large Image to Content Page Transition",
  "Thumbnail to Full Width"; motion.dev `app-store`; no live-site count (the run clicked the first link only).
- **Examples** — view-transitions.chrome.dev/cards/spa/ · astro-shop-ten.vercel.app (Codrops Astro shop) ·
  motion.dev/examples/react-app-store · tympanus.net/codrops/2022/08/03/large-image-to-content-page-transition/.
- **Surfaces** — builder (collections: news → article, staff → profile) · Educo web app (child card → profile) · RN later.
- **Builder / app status** — **GAP** everywhere (0 VT hits; 0 hits for `collection` in `lib/box-model.ts`);
  RN Reanimated 4.1.6 installed (`apps/mobile/node_modules/react-native-reanimated/package.json`) — no shared transitions in 4.1.
- **Gap id** — PT-9, CE-16, AM-23.

### F4.9 · Header and footer stay still while the page changes
- Family 4 · trigger navigation
- **What a visitor sees** — only the content changes; the menu bar does not blink or slide.
- **How it is done** — name the bar and cancel its animation; name it only while it is in view, so a scrolled-away
  header does not fly in:
  ```css
  @keyframes eu-vt-name{from,to{view-transition-name:site-header}}
  header{view-transition-name:none;animation:eu-vt-name linear both;animation-timeline:view()}
  ::view-transition-group(site-header){animation:none}
  ```
  Never name `main` or tall sections (pseudo-smooth-scrolling).
- **Timing** — none (held). **Phone** — kept; one extra texture.
- **Reduced motion** — nothing moves anyway. **Accessibility** — no change.
- **Cost** — one snapshot. **How common** — held nav bar is everywhere: fixed nav bar on **55 %**, sticky nav 7 % of
  live sites (n 732); persistent header is the point of every router (F4.5).
- **Examples** — view-transitions.chrome.dev/scrolling/offscreen-elements/with-fix-manual/ · vtbag.dev
  pseudo-smooth-scrolling · cydstumpel.nl.
- **Surfaces** — builder (header/footer bands) · web app layout shells already persist (App Router layouts).
- **Builder status** — **GAP** (no naming). Bars are identifiable: pinned bars carry `data-eu-pin`
  (`lib/box-export.ts:538`).
- **Gap id** — PT-15.

### F4.10 · In-page state change animated as a transition (tabs, filters, slides)
- Family 4 · trigger click | state
- **What a visitor sees** — choosing another tab or filter, the old content cross-fades or slides into the new one
  instead of jumping.
- **How it is done** — same-document VT, element-scoped where available so the rest of the page keeps working:
  ```js
  const run = (el, update) => (el.startViewTransition ?? document.startViewTransition)
    ? (el.startViewTransition ? el.startViewTransition(update) : document.startViewTransition(update)) : update();
  ```
  Baseline (Oct 2025) for document scope; `el.startViewTransition()` Chrome 147.
- **Timing** — UA 250 ms; Material tab indicator 250 ms emphasized. → `--eu-dur-base`.
- **Phone** — kept as a fade; a document-scoped transition paints over pinned bars and swallows taps for its
  duration — use element scope or an instant change.
- **Reduced motion** — instant. **Accessibility** — the script must move focus if the focused element is replaced;
  `aria-selected`/`aria-controls` carry the state.
- **Cost** — no library. **How common** — 7 same-document VT runs / 678; VT in 6 % of sites' CSS.
- **Examples** — daveholloway.uk/what-is-a-brand (`awwwards-com-inspiration-article-header-with-fluid-mouse-distortion-transition-d-6-transition.jpg`) ·
  cuberto.com (`awwwards-com-inspiration-cubertos-interactive-transition-6-transition.jpg`) · view-transitions.chrome.dev ·
  Chrome element-scoped VT doc demos.
- **Surfaces** — builder components (pager, tabs, accordion, filtered lists) · web app lists (see Family 5 F5.15).
- **Builder status** — **GAP** (0 hits). The pager is scroll-snap with `scrollTo({behavior})` (`lib/box-model.ts:3466`,
  `:3625`) — HAVE for its own slide, no VT.
- **Gap id** — PT-10, PT-17.

### F4.11 · Fetch the next page early (prefetch / speculation rules)
- Family 4 · trigger navigation (hover / viewport)
- **What a visitor sees** — the next page opens almost instantly, so any transition starts at once.
- **How it is done** — `<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>`
  (Chrome/Edge/Samsung; off under Save-Data and battery saver); `<link rel="prefetch">` as the Firefox path.
- **Timing** — moderate = 200 ms hover / pointerdown on desktop, viewport heuristics on mobile. No token.
- **Phone** — **kept, at `moderate`**: fetches only what is about to be tapped and stops under Data Saver (RULE AF —
  data is paid per MB). Never `prerender` by default.
- **Reduced motion** — n/a. **Accessibility** — n/a (speed is accessibility: keeps a VT under its 4 s limit).
- **Cost** — bytes of pages not visited; measure wastage (PT-20).
- **How common** — not measured by the run; Barba prefetches on hover by default, Swup preload plugin on touchstart.
- **Examples** — Chrome "Prerender pages" demos · swup preload plugin docs · barba `@barba/prefetch`.
- **Surfaces** — builder export · web app (Next.js `<Link>` prefetches by default).
- **Builder status** — **PARTIAL**: every sibling page is prefetched on every page view, `<link rel="prefetch">`
  (`lib/box-export.ts:879-882` `prefetchLinks`, used at `:803`) — ignores Save-Data, does nothing on iOS; **GAP** for
  speculation rules (0 hits).
- **Gap id** — PT-5, PT-20.

### F4.12 · App: going deeper and coming back (stack push / pop)
- Family 4 · trigger navigation
- **What a visitor sees** — tapping "Payment history" slides the new screen in from the right; Back slides it away.
- **How it is done** — native: expo-router `<Stack>` (react-native-screens native stack), `animation: 'default'`;
  web: React `<ViewTransition enter/exit>` keyed by `transitionTypes` (needs React 19.3 + Next ≥ 16.3).
- **Timing** — Android: system-owned (scaled by the animator setting; `animationDuration` is iOS-only); MDC shared
  axis 30 dp, `motionDurationLong1`. Web → `--eu-dur-page` *(proposed)*.
- **Phone** — native transitions run off the JS thread: cheap on low-cost Android. Tablet: same stack, wider screens.
- **Reduced motion** — native stack honours Android "Remove animations" with no code; iOS Reduce Motion is **not**
  read by React Navigation → pass `animation: 'fade'|'none'` from our own hook.
- **Accessibility** — focus to the new screen title; hardware back and swipe-back both work (F4.14).
- **Cost** — none native; 0 KB web. **How common** — every platform default (M3, HIG, Polaris).
- **Examples** — view-transitions.chrome.dev/pagination/spa-types/ · react-view-transitions-demo.labs.vercel.dev · MDC catalogue.
- **Surfaces** — Educo web app · React Native (React Navigation native stack via expo-router).
- **App status** — native **HAVE (default)**: `apps/mobile/app/_layout.tsx:83-90` Stack, `presentation: 'card'`, no
  `animation` set; reduce-motion hook **GAP** (0 hits `isReduceMotionEnabled|ReduceMotion` in `apps/mobile/app`,
  `components`). Web **GAP** (Next 15.1.3 / React 19.2.0, `package.json:64`, `:66`).
- **Gap id** — AM-18, AM-2, AM-25.

### F4.13 · App: switching main tabs (fade through)
- Family 4 · trigger navigation (tab press)
- **What a visitor sees** — tapping Fees in the bottom bar: the old tab fades out quickly and Fees fades in. Nothing slides.
- **How it is done** — `<Tabs screenOptions={{ animation: 'fade' }}>` (bottom-tabs 7.9: `none` · `fade` · `shift`,
  150 ms each); web: crossfade or nothing. A slide is wrong here: it implies swiping, which clashes with carousels
  and swipe rows (M3).
- **Timing** — MDC fade-through: outgoing gone by 35 %, incoming from scale 0.92; bottom-tabs fade 150 ms; Fluent
  "quick fade". → `--eu-dur-fast`–`base`.
- **Phone** — opacity only; keep the first frame of a lazily mounted tab light.
- **Reduced motion** — a fade is already the reduced form; instant under "Remove animations".
- **Accessibility** — tab items `accessibilityRole="tab"`, `accessibilityState={{selected}}`, a label; re-tap scrolls
  to top; keep each tab's scroll state; never hide the bar while a screen reader is on.
- **Cost** — none. **How common** — M3, Fluent, HIG tab bars.
- **Examples** — MDC `MaterialFadeThrough` · bottom-tabs `SceneStyleInterpolators.forFade` · M3 transitions page.
- **Surfaces** — React Native (bottom bar), Educo web app (sidebar sections).
- **App status** — native **PARTIAL**: `apps/mobile/app/(tabs)/_layout.tsx:5-16` no `animation` (so none); custom bar
  navigates with `router.push` (`apps/mobile/components/ui/BottomTabBar.tsx:253`), springs icons (`:220-229`, dead
  branch `toValue: isActive ? 1 : 1` at `:221`), **0** accessibility props in the file. `@react-navigation/bottom-tabs`
  7.9.0 installed.
- **Gap id** — AM-11, AM-12, AM-5.

### F4.14 · App: back gesture and predictive back
- Family 4 (+7) · trigger gesture | key (Android back)
- **What a visitor sees** — swiping from the screen edge (or pressing Back) peeks the previous screen and shrinks the
  current one before it goes; letting go early cancels.
- **How it is done** — Android 14+ predictive back: opt-in `android.predictiveBackGestureEnabled` in Expo SDK 54
  app config; the system animates (scale 100 → 90 %, fade-through at 35 %). iOS: native-stack edge swipe. Web: the
  browser's own swipe — check `NavigateEvent.hasUAVisualTransition` so a VT does not animate twice.
- **Timing** — follows the finger; release uses the system curve. No token.
- **Phone** — native, free. **Reduced motion** — the system's.
- **Accessibility** — every modal / sheet must handle the back request (`onRequestClose`), or Back leaves the screen.
- **Cost** — none. **How common** — Android default from 15; HIG swipe-back.
- **Examples** — developer.android.com predictive back guide + design page.
- **Surfaces** — React Native (Android), web export (browser swipe-back).
- **App status** — **GAP**: 0 hits for `predictiveBack` in `apps/mobile/app.json` (opt-in not set).
- **Gap id** — AM-25 (UAT line); PT-7 (web double-animation check).

---

## Gap ids this family feeds
PT-1 … PT-20 (03-page-transitions) · AM-2, AM-5, AM-11, AM-12, AM-18, AM-23, AM-25 (09-app-motion) · CE-16 (08).
No new gap ids are proposed here.
