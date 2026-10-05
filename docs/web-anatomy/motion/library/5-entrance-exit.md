# Family 5 · Entrance / exit

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per technique, in the library's entry shape. Written
2026-10-02 from the measured runs ([AGGREGATE](../../research-runs/AGGREGATE.md); raw records in
`C:\Users\eyite\educo-research\runs\*.json`; screenshots in `…\shots\<source>\`), the research files
[05-entrance-exit](../05-entrance-exit.md), [06-motion-rules](../06-motion-rules.md),
[08-component-effects](../08-component-effects.md), [09-app-motion](../09-app-motion.md) and
[motion-effects §9](../../motion-effects.md). Every builder / app status line was grepped again on 2026-10-02.

**Tokens today** (`lib/educo-ui/tokens.ts:47-52`): `--eu-dur-fast` 120 ms · `base` 200 · `slow` 320 · `slower` 500;
easings `standard` · `in` · `out` · `in-out` · `emphasized` (overshoot). *(proposed)* = not in the token file yet:
`--eu-dur-instant` 70 ms, `--eu-dur-stagger`, `--eu-dur-reveal` (MR-9 / EX-6).

**The asymmetry rule (Material, measured in material-web source):** menu and dialog **open 500 ms emphasized,
close 150 ms accelerate**; checkbox mark 350 in / 150 out. Every system agrees: enter decelerates, exit accelerates
and is shorter (Atlassian 50–100 ms shorter; Material exits "require less attention"). Educo mapping: open
`--eu-dur-slow`–`slower` + `--eu-ease-out`, close `--eu-dur-fast` + `--eu-ease-in`.

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) unless marked; re-measures n = 678 / 75

| Technique | Measured share | Entry |
|---|---|---|
| Keyframe animation of any kind in the CSS | 610 / 732 (**83 %**) | F5.2 |
| Something fades / moves as the page scrolls (reveal on appear is the common case) | translate 66 % · fade 55 % · scale 35 % | F5.3 |
| IntersectionObserver in the shipped code (reveal triggers) | 177 / 300 (**59 %**, motion-effects §9 fingerprint) | F5.3 |
| Full-screen cover at 0.7 s ("preloader / intro") | AGGREGATE **69 %** — re-measured: an *opaque* full cover 233 / 678 (34 %), one with a loader-like class name 139 (21 %), one that is gone or changed by `load` **54 (8 %)** | F5.1 |
| Desktop menu button found | 175 / 732 (24 %) | F5.7 |
| Split headings (letters / words in spans) | 140 / 732 (19 %) | F5.2 (and Family 9) |
| Menu that visibly opened when clicked | 75 of 170 menus re-measured | F5.7 |
| Lottie (loaders, icon intros) | 24 / 732 (3 %) | F5.1 |
| `@starting-style` in the CSS | 9 / 732 (**1 %**) | F5.5 |
| uiverse tooltips (all open on hover, **0 of 62** on keyboard focus) | 62 of 3,802 elements | F5.11 |
| uiverse notifications (78 % loop forever) | 23 of 3,802 | F5.12 |

**Menus, re-measured from the raw records (n 75 menus that visibly opened after a click):** Escape closed it **35
(47 %)** · focus returned to the button 56 (75 % — mostly because focus never left it) · focus moved into the menu
**14 (19 %)** · page scroll locked 29 (39 %) · `aria-expanded` present 39 (52 %) · the button is a real `<button>`
41 (55 %) · still changing between 150 and 400 ms after the click 32 (43 %), still changing after 400 ms 19 (25 %) ·
panel transition, where one was readable, median **400 ms** (p25 300, p75 700, n 22).

**Phone menu data — not usable.** The AGGREGATE line "phone: menu button found 176 (24 %)" was meant to be measured at
360 px. In the raw records the phone pass did not take effect: held elements on "phone" have a median width of
**1,440 px**, 133 of 170 "phone" menu buttons sit at x > 360 px, and 134 are at exactly the same x as on desktop. The
phone menu numbers are the desktop numbers measured twice. Phone behaviour below is therefore taken from the
systems (M3, HIG) and the reading, not from the run.

---

## Entries

### F5.1 · Preloader / full-screen intro
- Family 5 · trigger load
- **What a visitor sees** — a full-screen panel (a logo, a counter, a bar) covers the site while it loads, then
  lifts or wipes away to show the page.
- **How it is done** — a fixed full-viewport div above the page, removed on `load` with a transform / clip-path
  exit; often GSAP + a counter, sometimes Lottie. CSS-only version:
  ```css
  .eu-intro{position:fixed;inset:0;z-index:100;background:var(--eu-color-surface);animation:eu-intro-out var(--eu-dur-slower) var(--eu-ease-in) .2s both}
  @keyframes eu-intro-out{to{translate:0 -100%;visibility:hidden}}
  @media (prefers-reduced-motion:reduce){.eu-intro{display:none}}
  ```
- **Timing** — measured `load` median 2.9 s (n 678, desktop, cache off); the 54 real intros ranged from 2.3 s
  (claytoncotterell) to 15.5 s (chaingpt.org) before the page showed. GSAP `expo.inOut`/`power4.inOut` on exits.
  → exit `--eu-dur-slower`; total intro must never exceed the load it hides.
- **Phone** — **dropped**. On 3G (Nigeria P75 3.1 Mbps / 190 ms RTT) it hides content that has already arrived and
  delays LCP; a skeleton (Family 8 F8.2) shows the layout from the first bytes instead.
- **Reduced motion** — no intro at all (Apple: "no animated intro"); measured sites: of 732, only 25 % mention
  `prefers-reduced-motion` anywhere.
- **Accessibility** — 2.2.2 (a moving intro beside nothing else is exempt only if nothing can be done meanwhile);
  the cover must be `aria-hidden` and must not take focus; content must be readable to a screen reader at once.
- **Cost** — holds LCP; a counter or Lottie adds 30–250 KB. **How common** — 8 % real (54 / 678) to 21 % (loader-named
  opaque cover); AGGREGATE's 69 % is mostly transparent fixed layers (see the WRONG note at the end).
- **Examples** — vivalalabia.com (`awwwards-com-inspiration-3d-object-interaction-viva-la-labia-00-intro-0.7s.jpg`) ·
  buttermax.net (`awwwards-com-inspiration-reactive-cursor-1-00-intro-0.7s.jpg`) · chaingpt.org (`.page-loader`,
  `awwwards-com-inspiration-webgl-robot-interaction-chaingpt-blockchain-ai-00-intro-0.7s.jpg`) · treebytree.earth ·
  blueyard.com ("Enter transition", 0.4–0.5 s `cubic-bezier(0,0,0,1)`, motion-effects §9).
- **Surfaces** — builder: not offered (decision below) · Educo web app: `PageLoader` is a full-screen cover · RN:
  splash screen (F5.17).
- **Builder status** — **HAVE (none, correctly)**: no intro/preloader in `lib/` (grep `preloader|intro` 0 hits in
  `lib/interactions.ts`). Web app: `components/shared/PageLoader.tsx:17` full-screen `fixed inset-0` cover with an
  `animate-in fade-in` class that produces no CSS (no plugin; `animate-in` defined nowhere in `app/globals.css`).
- **Gap id** — MR-12 (LCP), AM-1, AM-14. New line proposed: none — the builder should keep not shipping one.

### F5.2 · Entrance on load (fade, rise, zoom… when the page opens)
- Family 5 · trigger load
- **What a visitor sees** — the heading and pictures of the first screen fade and rise into place as the page opens.
- **How it is done** — a keyframe with only a `from`, played once, never hiding content outside the animation:
  ```css
  @keyframes eu-reveal-rise{from{opacity:0;transform:translateY(1.5rem)}}
  .bx-x{animation:eu-reveal-rise var(--eu-dur-slow) var(--eu-ease-out) backwards}
  @media (prefers-reduced-motion:reduce){.bx-x{animation-name:eu-reveal-fade}}  /* swap, don't strip */
  ```
- **Timing** — live-site animation durations: 800 ms (408 elements), 600 (247), 1,000 (245), 500 (144) (n 732);
  Animista entrances 0.4–0.7 s ease-out (662 variations); uiverse transitions median 300 ms. → `--eu-dur-slow` 320 ms
  for blocks, ≤ `--eu-dur-base` on the hero / LCP element; `--eu-ease-out` (most frequent named curves are
  ease-out-cubic (.215,.61,.355,1) ×3,334 and expo-out (.19,1,.22,1) ×3,114 elements).
- **Phone** — **kept** (opacity + transform, compositor). Never on the LCP element longer than `base`.
- **Reduced motion** — fade only (≤ `base`), not nothing (06 §2). Real sites: 70 % of the 732 still moved on scroll
  with reduced motion on.
- **Accessibility** — content never hidden waiting for an animation; split text keeps an accessible label (Family 9).
- **Cost** — compositor; `filter: blur` ("Sharpen") repaints. **How common** — keyframes in 83 % of sites; split
  headings 19 %.
- **Examples** — meermohsin.me (SOTD, 0.3–0.45 s, no reduced motion, motion-effects §9) · cydstumpel.nl (0.3–0.4 s
  `cubic-bezier(.25,1,.5,1)`, honours reduce) · Animate.css `fadeInUp` (1 s default) · Animista `fade-in-bottom`.
- **Surfaces** — builder (every block: "Entrance") · Educo web app (dashboards, F5.4) · RN Reanimated `entering={FadeInDown}`.
- **Builder status** — **HAVE**: `REVEAL_EFFECTS` fade · rise · drop · from-left · from-right · zoom · sharpen
  (`lib/interactions.ts:133-142`), `revealCss` (`:216`) emits `animation … both` (`:232`); **PARTIAL**: duration
  fallback `.55s` (`:212`), `both` fill can swallow a later transition exit (EX-11), reduce = `animation:none` (`:246`).
  RN: **GAP** — Reanimated installed (4.1.6) but 0 hits for `entering=|withTiming|withSpring` in `apps/mobile/app`, `components`.
- **Gap id** — MR-1, MR-12, EX-11, AM-20.

### F5.3 · Reveal when it scrolls into view
- Family 5 (+2) · trigger scroll
- **What a visitor sees** — each section fades and rises as it comes onto the screen.
- **How it is done** — three ways, each with a different feel:
  - *scroll-driven* (`animation-timeline: view()`, progress follows the scrollbar, rewinds on scroll-up) —
    `@supports (animation-timeline:view()){.bx-x{animation-timeline:view();animation-range:entry 0% cover 28%}}`;
  - *scroll-triggered* (`timeline-trigger` + `animation-trigger: play-forwards`, Chrome 146 only) — plays once like
    IntersectionObserver, no script;
  - *IntersectionObserver* adding a class (works everywhere, 59 % of award sites ship IO).
- **Timing** — scroll-driven has no duration (range instead); triggered/IO: as F5.2. Codrops reveals: GSAP
  `expo.out` 1.2 s, stagger .1, `start: 'top 90%', once: true`. → `--eu-dur-slow`, `--eu-ease-out`.
- **Phone** — **kept** for compositor properties; scroll-driven CSS stays off the main thread only for opacity /
  transform (06 §5 rule 2).
- **Reduced motion** — fade or none; never tie movement to scroll under `reduce`.
- **Accessibility** — content present in the DOM and readable without scrolling; find-in-page must reach it.
- **Cost** — CSS: none; IO: tiny script; GSAP ScrollTrigger ~25 KB. **How common** — scroll translate 66 %, fade
  55 % (n 732); `animation-timeline` in 6 % of sites' CSS; CodePen `scroll-animation` 171 pens (IO 13 %, timeline 17 %).
- **Examples** — scroll-driven-animations.style demos · Chrome "scroll-triggered animations" pens (7) · Codrops
  "A Practical Introduction to Scroll-Driven Animations" (Adam Argyle) · cydstumpel.nl.
- **Surfaces** — builder (Entrance → "when it comes into view") · web app long pages · RN: `onViewableItemsChanged` +
  Reanimated `entering`.
- **Builder status** — **HAVE / PARTIAL**: `@supports (animation-timeline: view())` branch (`lib/interactions.ts:242`);
  without support it plays on load; rewinds on scroll-up; no play-once option.
- **Gap id** — EX-16, EX-17, MR-13; SA-1/SA-2 (Family 2).

### F5.4 · One after another (stagger)
- Family 5 · trigger load | scroll
- **What a visitor sees** — the cards of a row arrive one after another instead of all at once.
- **How it is done** — `transition-delay`/`animation-delay` per item; one rule with `sibling-index()`:
  `animation-delay:calc(min(sibling-index(),8) * var(--eu-dur-stagger,40ms))` (Chrome 138, Safari 26.2, Firefox 154;
  elsewhere items arrive together — acceptable).
- **Timing** — Carbon: 20 ms steps, whole sequence ≤ 500 ms; Fluent "short offsets"; Codrops/GSAP stagger .05–.1 s.
  → `--eu-dur-stagger` *(proposed)* 40 ms, capped so the last item starts ≤ 300 ms.
- **Phone** — kept; ≤ 100 animated items at once on low-end Android (Reanimated guide).
- **Reduced motion** — 0 stagger, everything at once.
- **Accessibility** — no content held back; Polaris: no stagger during navigation.
- **Cost** — style calc per `:nth-child` rule (9 per block today). **How common** — GSAP stagger common in Codrops
  articles; no live-site count (the run did not separate it).
- **Examples** — Carbon motion choreography · Fluent `Stagger` presence · Bramus `sibling-index()` pen ·
  Codrops "Image Stack Intro Animation".
- **Surfaces** — builder (accordion items, card rows) · web dashboard (`components/shared/DashboardPage.tsx`) · RN
  `FadeIn.delay(i*20)` capped.
- **Builder status** — **PARTIAL**: nine `:nth-child` rules × 90 ms (`lib/interactions.ts:238`) → the 10th item starts
  810 ms late. Web app / RN: **GAP** (no stagger).
- **Gap id** — EX-6, MR-20, AM-19.

### F5.5 · Entrance for things that appear later (`@starting-style`)
- Family 5 · trigger state
- **What a visitor sees** — a message, a menu or a newly added row fades in instead of popping.
- **How it is done** — a transition with a "from" for first render; must come after the normal rule:
  ```css
  .eu-note{opacity:1;translate:0 0;transition:opacity var(--eu-dur-slow) var(--eu-ease-out),translate var(--eu-dur-slow) var(--eu-ease-out)}
  @starting-style{.eu-note{opacity:0;translate:0 .5rem}}
  ```
  Baseline 2024 (Chrome 117, Firefox 129, Safari 17.5). No support → appears at once.
- **Timing** — as F5.2; transitions are interruptible (reverse smoothly), keyframes restart.
- **Phone** — kept (compositor). **Reduced motion** — keep opacity, drop translate.
- **Accessibility** — announce inserted content through a live region that already exists.
- **Cost** — none. **How common** — 9 / 732 sites (1 %); freefrontend 6 items mention it.
- **Examples** — web.dev "Now in Baseline: animating entry effects" pen · nerdy.dev "starting-style everything" ·
  Bramus "yellow fade" · cydstumpel.nl, cuberto.com (both ship it).
- **Surfaces** — builder components (alert, toast, menu, filtered items) · web app (replaces the dead `animate-in`).
- **Builder status** — **GAP**: 0 hits for `@starting-style` in `lib/`, `components/website/`.
- **Gap id** — EX-1, AM-1.

### F5.6 · Leaving before removal (exit animations)
- Family 5 · trigger state | click
- **What a visitor sees** — a closed message fades and slips away; the content under it closes the gap.
- **How it is done** — animate `display` with `allow-discrete` (or a keyframe ending in `display:none`), make the
  leaving element `inert` at once, then remove it when its animations settle:
  ```css
  .eu-leaving{opacity:0;translate:0 .5rem;display:none;pointer-events:none;
    transition:opacity var(--eu-dur-fast) var(--eu-ease-in),translate var(--eu-dur-fast) var(--eu-ease-in),display var(--eu-dur-fast) allow-discrete}
  ```
  ```js
  el.inert = true; el.classList.add('eu-leaving');
  await Promise.allSettled(el.getAnimations().map(a => a.finished)); el.remove();
  ```
- **Timing** — exits ~0.6–0.75× the entrance (Material 150 vs 500; Animista exits 0.45–0.6 s); → `--eu-dur-fast` 120 ms, `--eu-ease-in`.
- **Phone** — kept. Firefox does not transition `display` → instant hide (fine).
- **Reduced motion** — instant; the empty `getAnimations()` list resolves at once.
- **Accessibility** — move focus to a sensible next target **before** removal (next alert, region heading);
  announce if it matters; `inert` at exit start (a leaving element still takes clicks and Tab).
- **Cost** — none. **How common** — exits are rare on live sites (not separable in the run); Animate.css has 26 fade
  in/out, Animista exits 0.45–0.6 s.
- **Examples** — MDN `Animation.finished` · Adam Argyle GUI toast / dialog · Frontend Masters "In-N-Out" 1–3.
- **Surfaces** — builder (alert dismiss, toast, filtered items) · web app (row delete) · RN Reanimated `exiting={FadeOut}`.
- **Builder status** — **PARTIAL**: alert dismiss writes inline `transition='opacity .18s,transform .18s'` and
  `setTimeout(remove,180)` (`lib/box-model.ts:2027`) — literal duration, no focus move, no `inert`; no exit model in
  `REVEAL_EFFECTS` (`lib/interactions.ts:133-142`).
- **Gap id** — EX-1, EX-2, EX-3, EX-10.

### F5.7 · Full-screen overlay menu (open / close)
- Family 5 · trigger click | key (Enter, Space, Escape)
- **What a visitor sees** — the menu button turns into a cross and a full-screen panel slides, fades or wipes in with
  the links; closing reverses it faster.
- **How it is done** — a real `<dialog>` (modal) or `popover`, so Esc, the Android back button and TalkBack's back
  gesture close it:
  ```css
  .eu-menu{opacity:0;translate:0 -1rem;transition:opacity var(--eu-dur-fast) var(--eu-ease-in),translate var(--eu-dur-fast) var(--eu-ease-in),
    display var(--eu-dur-fast) allow-discrete,overlay var(--eu-dur-fast) allow-discrete}
  .eu-menu[open]{opacity:1;translate:0 0;transition-duration:var(--eu-dur-slow);transition-timing-function:var(--eu-ease-out)}
  @starting-style{.eu-menu[open]{opacity:0;translate:0 -1rem}}
  html:has(.eu-menu:modal){overflow:hidden;scrollbar-gutter:stable}
  ```
  Use `dialog[open]`, not `dialog:open` (Safari < 26.5).
- **Timing** — measured panels median **400 ms** (n 22); 43 % of opened menus still moving at 150–400 ms, 25 % after
  400 ms; shopify.com/editions 0.3 s `cubic-bezier(.4,0,.2,1)`, vault49.com 0.3 s ease. Material menu 500 ms open /
  150 ms close. → open `--eu-dur-slow` 320 ms `--eu-ease-out`, close `--eu-dur-fast` 120 ms `--eu-ease-in`; links
  stagger ≤ 30 ms.
- **Phone** — **kept** — on a 360 px phone the menu *is* the navigation; slide from the edge it lives on, flat tint not
  blur behind it. (Phone run data unusable — see the top note.)
- **Reduced motion** — fade only, no slide or wipe.
- **Accessibility** — measured gaps on live sites (n 75 opened): Escape closes only 47 %, focus moved in 19 %, page
  locked 39 %, `aria-expanded` 52 %, real `<button>` 55 %. Required: `<button aria-expanded aria-controls>` with a
  visible "Menu" word, focus into the panel at the **start** of the animation, Escape / back closes, focus returns to
  the button, page behind inert and locked.
- **Cost** — compositor; `backdrop-filter` blur behind is paint-heavy on low-cost GPUs.
- **How common** — menu button on 24 % of desktop sites (n 732); motion-effects §9: overlay menus are the
  second-largest named kind in the Transitions collection (42 / 366).
- **Examples** — shopify.com/editions/summer2024 (`…-shopify-editio-menu-400.jpg`) · vault49.com
  (`awwwards-com-inspiration-follow-mouse-cursor-vault49-menu-400.jpg`) · findworkhappiness.com (circle clip-path,
  `…-mask-reveal-the-search-for-work-happiness-menu-150.jpg`) · keikku.health (`…-keikku-next-gen-stethoscope-menu-400.jpg`) ·
  web.dev GUI challenge sidenav.
- **Surfaces** — builder Navigation component (header on phones) · Educo web app mobile header · RN: drawer / modal screen.
- **Builder status** — **GAP**: 0 hits for `<dialog|showModal|popover|aria-expanded` in `lib/` (the only `popover`
  in `components/website/` is editor chrome, `components/website/HeaderInspector.tsx:22`). Navigation is a recorded
  component gap.
- **Gap id** — EX-7, EX-9, EX-10, EX-15, EX-18, CE-14.

### F5.8 · Dropdown / popover menu (anchored)
- Family 5 · trigger click | key (Enter, Space, ArrowDown)
- **What a visitor sees** — a short list unfolds just under its button and folds away faster.
- **How it is done** — `popover` (+ `popovertarget`, zero JS) anchored with CSS anchor positioning where supported;
  `opacity` + `scale(.95)` from the anchor edge; `overlay` in the transition list so the exit keeps its anchor.
- **Timing** — Material menu 500 ms open, items 250 ms staggered, 150 ms close; uiverse tooltip/menu 300 ms. →
  open `--eu-dur-slow`, close `--eu-dur-fast`, item step ≤ 30 ms.
- **Phone** — **swapped**: a bottom sheet or a native `<select>` (better than any custom one on Android).
- **Reduced motion** — opacity only.
- **Accessibility** — APG menu-button / listbox keys; Escape closes; focus returns; light dismiss (`popover=auto`).
- **Cost** — compositor. **How common** — anchor positioning in 8 % of sites' CSS (n 732); freefrontend dropdowns 85,
  menus 435.
- **Examples** — material-web menu · Codrops "Simple Effects for Drop-Down Lists" ·
  motion.dev `react-context-menu` · Chrome anchor-positioning pens (10).
- **Surfaces** — builder nav dropdown, language switcher · web app: many shared dropdowns · RN modal picker.
- **Builder / app status** — builder **GAP** (0 `popover` in `lib/`). Web app **HAVE (no motion audit)**:
  `components/shared/CustomDropdown.tsx`, `FormDropdown.tsx`, `ActionsDropdown.tsx` and others exist. RN
  **PARTIAL**: `apps/mobile/components/ui/FormDropdown.tsx:104`, `:119` `LayoutAnimation.configureNext`.
- **Gap id** — EX-7, CE-14, AM-3.

### F5.9 · Modal dialog (open / close)
- Family 5 · trigger click
- **What a visitor sees** — the page dims and a box fades and rises (95 → 100 %) into the centre; closing is quicker.
- **How it is done** — `<dialog>` + `showModal()` (or `command="show-modal"`), `::backdrop` fading, `@starting-style`,
  `display`/`overlay` `allow-discrete` — 05 §4 code. The platform makes the page inert, moves focus in, returns it on
  close, and handles Escape / Android back.
- **Timing** — Material dialog 500 ms emphasized open (scrim 500 linear) / 150 ms close; MDC fade 150 / 75 ms; Fluent
  150 / 250 ms; Atlassian scale 95 → 100 %. → open `--eu-dur-slower` (sheet) or `--eu-dur-slow` (small dialog),
  `--eu-ease-out`; close `--eu-dur-fast`, `--eu-ease-in`.
- **Phone** — kept; flat token scrim, never `backdrop-filter` over the whole viewport.
- **Reduced motion** — fade only (no scale, no rise).
- **Accessibility** — focus to the first control (Adam: put `autofocus` on Cancel) at the start; visible Close;
  `closedby="any"` not in Safari — keep the button; never stack dialogs.
- **Cost** — compositor; full-screen blur = repaint every frame on low-DPI Android.
- **How common** — freefrontend modals 108; Codrops "Nifty Modal Window Effects", "Dialog Effects"; the run did not
  open dialogs.
- **Examples** — material-web dialog · web.dev GUI challenge dialog (`gui-challenges.web.app/dialog/dist/`) ·
  Codrops "How to Implement and Style the Dialog Element" (2021) · Atlaskit modal.
- **Surfaces** — builder lightbox / modal / cookie notice · Educo web app (`components/shared/Modal.tsx`) · RN `Modal`.
- **Builder / app status** — builder **GAP** (0 `<dialog`/`showModal`). Web app **PARTIAL**:
  `components/shared/Modal.tsx:72` overlay `backdrop-blur-sm animate-in fade-in`, `:76` panel `animate-in zoom-in-95
  slide-in-from-bottom-4` — **classes that produce no CSS** (no `tailwindcss-animate` / `tw-animate-css` in
  `node_modules`, none defined in `app/globals.css`; `animate-in` used in 114 files), so it appears instantly;
  `:86-88` three blurred `animate-pulse` blobs loop forever; only Escape handled (`:38-46`), no focus move / trap /
  return. RN **PARTIAL**: `apps/mobile/components/ui/Modal.tsx:76-77` `animationType="slide"` + `transparent`; fades
  at `InfoModal.tsx:127`, `Tooltip.tsx:158`, `ChildSwitcher.tsx:148`, `:292`; 0 accessibility props in `Modal.tsx`.
- **Gap id** — EX-7, EX-9, EX-18, AM-1, AM-7, AM-8.

### F5.10 · Drawer / side sheet (off-canvas)
- Family 5 (+7) · trigger click | gesture
- **What a visitor sees** — a panel slides in from the side; the page behind dims.
- **How it is done** — `<dialog>` positioned at an edge with `translate: -100% 0` → `0`; no-script form: `:target`
  sidenav (GUI challenge) with `visibility` delayed only on the way out. Phone swipe-to-close: Family 7 F7.4.
- **Timing** — M3 side sheet ~ sheet timings (500 decelerate / 200 accelerate). → `--eu-dur-slower` in, `--eu-dur-base` out.
- **Phone** — kept as the phone menu pattern; on tablet M3 swaps a bottom sheet for a side sheet.
- **Reduced motion** — fade (GUI challenge sets 1 ms). **Accessibility** — as F5.9; closed drawer out of the tab order.
- **Cost** — compositor. **How common** — freefrontend off-canvas/fullscreen menus (part of 435); orkestra.ca
  `.offcanvas` layer measured.
- **Examples** — gui-challenges.web.app/sidenav/dist/ · M3 side sheets · orkestra.ca.
- **Surfaces** — builder nav · web app sidebars · RN drawer (not installed).
- **Builder status** — **GAP** (0 `:target`/dialog drawer in `lib/`).
- **Gap id** — EX-7, EX-15.

### F5.11 · Tooltip (show after a pause, hide at once)
- Family 5 (+6) · trigger hover | focus
- **What a visitor sees** — a small label fades in beside an icon after a short pause, also when the icon is tabbed
  to; it goes when the pointer or focus leaves, or on Escape.
- **How it is done** — `popover="hint"` (+ `interestfor`, Chrome 142) or a script toggle; show with
  `transition-delay` only on the shown state; `pointer-events:none` on the tip.
- **Timing** — uiverse tooltips 300 ms (IQR 300–300); web.dev / Jake: ~200 ms delay in, instant out. → show
  `--eu-dur-fast` after a 200–250 ms delay, hide 0.
- **Phone** — **swapped** to a toggletip (tap) or inline text; no hover on touch.
- **Reduced motion** — fade only. **Accessibility** — 1.4.13 dismissible / hoverable / persistent; an icon button
  is *named* by `aria-labelledby`, not only described; **0 of 62** uiverse tooltips open on focus, 0 use `role="tooltip"`.
- **Cost** — tiny. **How common** — uiverse 62, freefrontend 32.
- **Examples** — Codrops "Playful Little Tooltip Ideas" · argyleink gui-challenges tooltips · Scott O'Hara `a11y_tooltips`.
- **Surfaces** — builder icon buttons · web app · RN long-press + `accessibilityHint`.
- **Builder / app status** — builder **GAP**. Web app **PARTIAL**: `components/shared/Tooltip.tsx:13` delay 300 ms,
  `:119` `transition-opacity duration-200`, no `role`/`aria` in the file. RN `components/ui/Tooltip.tsx:158` RN Modal fade.
- **Gap id** — EX-19, HV-12.

### F5.12 · Toast / snackbar (in, stay, out)
- Family 5 (+8) · trigger state
- **What a visitor sees** — "Payment recorded" rises from the bottom corner, stays a few seconds (longer while
  hovered or focused), and slips away; several stack.
- **How it is done** — one fixed `role="status"` region present **before** messages are inserted; enter
  `translateY` + fade with `@starting-style`; exit faster; stack with FLIP on the group (GUI challenge toast).
- **Timing** — uiverse notifications 500–800 ms (too slow); MDC slide 250 / fade 150 / out 75 ms. Display: M3 4–10 s,
  Polaris 5 s (10 s with action), Fluent 7 s, Atlassian 8 s. → in `--eu-dur-slow` `--eu-ease-out`, out
  `--eu-dur-base` `--eu-ease-in`; ≥ 5 s, never auto-dismiss with an action.
- **Phone** — full width at the bottom, above the safe area / tab bar; swipe to dismiss + a Close button.
- **Reduced motion** — fade, no slide; MDC turns animation off when a screen reader is on.
- **Accessibility** — 4.1.3 status messages; 2.2.1 adjustable time; never the only place critical information
  appears; action reachable before timeout.
- **Cost** — compositor. **How common** — uiverse 23 (78 % loop forever); freefrontend toasts 86.
- **Examples** — gui-challenges.web.app/toast/dist/ · motion.dev `react-toast-stack` · Atlaskit `flag` examples.
- **Surfaces** — builder Alert "toast" form · Educo web app · RN (needs `announceForAccessibility`).
- **Builder / app status** — builder **PARTIAL**: toast is `position:fixed` at a corner (`lib/box-model.ts:1944-1956`),
  one action allowed (`:1650`), timer pauses on hover/focus (`:2036-2037`), countdown bar with reduce rule
  (`lib/educo-ui/components.ts:271-284`); **no entrance**, exit `.18s` literal (`lib/box-model.ts:2027`); role on markup
  present at load (`:1687`). Web app **PARTIAL** — three copies with no live region: `components/shared/ShareDialog.tsx:172`
  (2.5 s), `components/shared/DocEditor/DocEditor.tsx:2328` (2.4 s), `components/shared/SlideEditor/SlideEditor.tsx:995`
  (2.0 s). RN **GAP** (0 hits `Toast|Snackbar|announceForAccessibility`).
- **Gap id** — CE-10, EX-12, EX-13, EX-14, MR-5, AM-6.

### F5.13 · Alert dismissed (close button)
- Family 5 · trigger click
- **What a visitor sees** — pressing × on a notice fades it out; the page closes the gap.
- **How it is done** — F5.6's exit + focus moved to the next alert or the region heading before removal; optional
  height collapse (`interpolate-size`, Chromium) or grid `0fr`.
- **Timing** — → `--eu-dur-fast` `--eu-ease-in`. **Phone** — kept. **Reduced motion** — instant removal.
- **Accessibility** — focus never drops to `<body>`; "Message dismissed" via a status region if it matters.
- **Cost** — none. **How common** — not separable in the run.
- **Examples** — Adam Argyle GUI toast removal · MDN `Animation.finished` sample.
- **Surfaces** — builder Alert · web app banners.
- **Builder status** — **PARTIAL** (`lib/box-model.ts:2027` — literal 180 ms, `setTimeout`, no focus move).
- **Gap id** — EX-2, EX-3, EX-10.

### F5.14 · Accordion / details open and close
- Family 5 · trigger click | key
- **What a visitor sees** — a question opens to show its answer, which grows and fades in; it folds away when closed.
- **How it is done** — native `<details>` with `::details-content` (Baseline 2025) fading, plus height under
  `interpolate-size` (Chromium) inside `no-preference`:
  ```css
  @media (prefers-reduced-motion:no-preference){:root{interpolate-size:allow-keywords}}
  details::details-content{opacity:0;block-size:0;overflow-y:clip;transition:opacity var(--eu-dur-slow),block-size var(--eu-dur-slow),content-visibility var(--eu-dur-slow) allow-discrete}
  details[open]::details-content{opacity:1;block-size:auto}
  ```
- **Timing** — Material / Radix use springs; → `--eu-dur-slow` `--eu-ease-standard`; indicator rotate `--eu-dur-base`.
- **Phone** — **fade kept, height optional**: height is a layout animation on the main thread — one small region at
  a time.
- **Reduced motion** — fade only (or instant). **Accessibility** — `<summary>` is the only control; find-in-page and
  `#fragment` still open it.
- **Cost** — layout per frame for the height part. **How common** — freefrontend accordions 126.
- **Examples** — Chrome "More options for styling details" pens (8) · Piccalilli `interpolate-size` pens ·
  web-dot-dev pen XWvBZNo (horizontal accordion).
- **Surfaces** — builder Accordion · web app FAQ / settings · RN `LayoutAnimation` today.
- **Builder status** — **PARTIAL**: native `<details>`, indicator rotates (`lib/educo-ui/components.ts:322`), reduce
  rule (`:332`); open/close itself instant (0 hits `details-content`); horizontal variant transitions `flex-grow`
  (`:468`) while content appears at once. RN: `LayoutAnimation` at `apps/mobile/app/reports.tsx:293`, `:741`,
  `app/(tabs)/fees.tsx:534`, `app/payment-history.tsx:625`, `:1273`.
- **Gap id** — EX-4, EX-5, AM-3, AM-20.

### F5.15 · List items arrive, leave and move (FLIP)
- Family 5 · trigger state
- **What a visitor sees** — a new message slides in and the rows below glide down; a deleted row fades and the rest
  close up; sorting re-orders smoothly.
- **How it is done** — web: same-document VT as browser-native FLIP,
  `li{view-transition-name:match-element;view-transition-class:item}` + `document.startViewTransition(update)`;
  or WAAPI FLIP by hand. Native: Reanimated `<Animated.FlatList itemLayoutAnimation={LinearTransition}
  skipEnteringExitingAnimations>` with rows `entering={FadeIn}` / `exiting={FadeOut}`.
- **Timing** — Reanimated presets 300 ms; Next guide move 400 ms; AutoAnimate 250 ms. → `--eu-dur-base`–`slow`, standard curve.
- **Phone** — ≤ 100 animated rows at once; transform/opacity only.
- **Reduced motion** — rows appear / vanish at once; announce instead.
- **Accessibility** — live region "Added / Removed"; keep focus on the moved item or move it to the neighbour.
- **Cost** — 0 KB (VT, Reanimated installed). **How common** — not measurable by the run; every system documents it.
- **Examples** — view-transitions.chrome.dev/cards/spa-auto/ · auto-animate.formkit.com · motion.dev
  `react-reorder-items` · Paul Lewis "FLIP your animations".
- **Surfaces** — builder filtered lists (later) · web app DataTable / lists · RN fees, reports, messages, Drive.
- **App status** — web **PARTIAL**: hand keyframes `sortFadeSlideFromBottom` … `fadeSlideUp` (`app/globals.css:437-517`),
  no FLIP. RN **PARTIAL**: `LayoutAnimation` (see F5.14) with five no-op `UIManager.setLayoutAnimationEnabledExperimental`
  calls (e.g. `apps/mobile/components/ui/ChildSwitcher.tsx:19-20`, `FormDropdown.tsx:19-20`).
- **Gap id** — AM-19, AM-3, AM-20, PT-10.

### F5.16 · Dashboard arrives in order (progressive load)
- Family 5 · trigger load
- **What a visitor sees** — the frame appears at once, then the numbers, then the charts, each fading up, all within
  half a second.
- **How it is done** — Carbon order shell → static → data → images → actions → charts; F5.4 stagger capped; skip on revisit.
- **Timing** — 20 ms steps, ≤ 500 ms total (Carbon). → `--eu-dur-stagger` *(proposed)*.
- **Phone** — skip entirely on revisit (`skipEntering`). **Reduced motion** — everything at once.
- **Accessibility** — nothing hidden waiting. **Cost** — Reanimated (installed). **How common** — Carbon, Fluent.
- **Examples** — Carbon choreography · Fluent Stagger · Reanimated `FadeIn.delay`.
- **Surfaces** — web `components/shared/DashboardPage.tsx` · RN `app/(tabs)/index.tsx`.
- **App status** — **GAP** on both (no stagger).
- **Gap id** — AM-19.

### F5.17 · App launch (splash → first screen)
- Family 5 · trigger load
- **What a visitor sees** — the app opens on a screen that looks like its first page, then fills in.
- **How it is done** — `expo-splash-screen` held until fonts load, then `hideAsync()`; launch screen matches the first
  screen and theme (Apple), not a logo show.
- **Timing** — "a couple of seconds" at most (Apple). **Phone** — fonts and bundle size dominate on low-cost Android.
- **Reduced motion** — no animated intro. **Accessibility** — nothing to read is held back.
- **Cost** — —. **How common** — HIG launching.
- **Examples** — HIG "Launching" · Expo splash screen docs.
- **Surfaces** — RN.
- **App status** — **PARTIAL**: `apps/mobile/app/_layout.tsx:21` `preventAutoHideAsync`, `:40` `hideAsync`, `:47`
  `ActivityIndicator` with literal `#3b82f6` on a white screen in every theme.
- **Gap id** — AM-5, AM-24, AM-27.

---

## Research claims found WRONG while verifying (raw records re-read 2026-10-02)
1. **"Menu: Escape closes it 76 %"** — counts 95 menus that never visibly opened (Escape "closed" nothing). Among the
   75 that opened: **47 %**.
2. **"Intro: full-screen cover at 0.7 s — 69 %"** — the test counts any element covering > 80 % of the screen,
   including transparent cursor layers and canvases. Opaque cover: 34 %; loader-named: 21 %; gone or changed by
   `load`: **8 %**.
3. **"Phone: menu button found 24 %"** (and every `phone:` line) — the 360 px emulation was not in effect in most
   records (median held width 1,440 px; 134 of 170 phone menu buttons at the same x as desktop).

## Gap ids this family feeds
EX-1 … EX-19 (05) · MR-1, MR-5, MR-12, MR-13, MR-20 (06) · CE-10, CE-14 (08) · AM-1, AM-3, AM-5, AM-6, AM-7, AM-8,
AM-14, AM-19, AM-20, AM-24, AM-27 (09) · PT-10 · HV-12. No new gap ids proposed.
