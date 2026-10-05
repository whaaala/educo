# 08 · Component effects — the motion and micro-interactions of UI components

Research for the Educo website builder **and** the Educo application (web and `apps/mobile/`). Compiled 2026-10-02.
Family: mostly **6 Hover / focus / press** and **8 Feedback / state**, with component openings from **5 Entrance / exit**
(see [LIBRARY.md](LIBRARY.md)). Every entry below is in the library's entry shape.

**What this file adds, and what it does not repeat.** [04-hover-focus.md](04-hover-focus.md) owns generic hover/focus
effects (lift, grow, image zoom, underline grow, colour sweep, icon nudge, magnetic, ripple-vs-state-layer, hover cards)
and HV-1…HV-14. [05-entrance-exit.md](05-entrance-exit.md) owns how anything opens and closes (`@starting-style`,
`allow-discrete`, `overlay`, `<dialog>`/popover, `::details-content`) and EX-1…EX-8. [07-shadows.md](07-shadows.md) owns
elevation, hover shadow and focus-ring-in-forced-colours (SH-1…SH-12). [06-motion-rules.md](06-motion-rules.md) owns the
tokens, reduced motion and performance (MR-1…MR-24). Here: **what each component does when it moves**, with numbers
**measured across every element of each source** (scripts below), the accessibility traps the galleries fall into, the
builder audit, and gaps **CE-1…CE-20**.

---

## Sources and completeness

Scripts and raw data live outside git in `C:\Users\eyite\educo-research\src\` (cloned repos, `raw/`, `*.json`).
No browser was used (memory full) — every count is from source code or a site's own data feed; the live-page pass
uses the demo list (last section).

| Source | What it holds | Items | Read | NOT READ (reason) |
|---|---|---|---|---|
| **uiverse.io → GitHub `uiverse-io/galaxy`** (MIT, © 2023 Uiverse.io; HEAD `adbd2ad`, 2024-09-02 — the repo is the site's automatic archive) | 11 category folders, one HTML+CSS file per element | **3,802** (Buttons 1,231 · Cards 726 · loaders 718 · Toggle-switches 260 · Inputs 226 · Forms 180 · Checkboxes 171 · Patterns 103 · Radio-buttons 102 · Tooltips 62 · Notifications 23) | **3,802 / 3,802 parsed** by `uiverse-measure.js` (every `<style>` block, every transition/animation declaration, every `@keyframes`, selectors, markup) → `uiverse-stats.json` | Elements published on uiverse.io after 2024-09-02 are not in the archive (the site claims more; the repo stops there). 375 elements are Tailwind-only (no `<style>`): their state classes are counted, their durations are not (Tailwind defaults 150 ms). 33 files have neither. |
| **Animate.css** (GitHub `animate-css/animate.css`, `source/`) | 16 groups of keyframes, `_vars.css`, `_base.css` | **98 animations** | **98 / 98** parsed by `animatecss-measure.js` (keyframe properties, duration overrides, easings, reduced-motion block) | – |
| **Animista** (`animista.net/animista.json`, the catalogue the app itself loads) | 6 categories → 75 groups → variations with duration, easing, iteration | **662 variations** | **662 / 662** (duration, easing, iteration, per group) | The generated keyframe CSS itself (built client-side by the app's JS) — only names, timings and easings were read. |
| **Motion examples** (`examples.motion.dev` index + every `motion.dev/examples/<slug>` page) | 462 example pages (JS · React · Vue variants of 244 effects) | **462** | **462 / 462** pages fetched by `motion-crawl.js`: title, description, "built with", and the code where public — **214 pages / 134 effects with source**, spring and timing values parsed | **248 pages (110 effects) are Motion+ paid**: description and live demo only, source NOT READ (paywall). |
| **Codrops** (`tympanus.net/codrops/wp-json/wp/v2/…` — the WordPress API; HTML/RSS return 403/410) | posts + `web_demo` + `sketches` for tags button, form, input, checkbox, tooltip, dropdown, tabs, accordion, modal, loading, preloader, menu, carousel, slider, link, icon, hover, gooey, elastic, overlay + category *UI Interactions & Animations Roundups* | **775** (422 articles · 343 web demos · 10 sketches); counts match the tag totals | **775 / 775** full article text + every demo link (`codrops-crawl.js`) | Demo source on tympanus.net/Development (not fetched: 403 to scripts) → in the demo list. GitHub org listing NOT READ: API rate limit exhausted (60/h, shared). |
| **freefrontend.com** — 209 collections relevant to these components (css-/javascript-/react-/tailwind-/vue-/bootstrap- buttons, toggle-switches, checkboxes, radios, inputs, forms, validation, cards, tooltips, dropdowns, select-boxes, tabs, tab-bars, accordions, modals, notifications, toasts, loaders, spinners, preloaders, skeletons, progress bars/steps/indicators, badges, tags, counters, avatars, carousels, sliders, range sliders, pagination, menus, hamburger/menu icons, mega/off-canvas/fullscreen menus, ratings, like buttons, ripple, hover, staggered, ui-micro-interaction, mouse-interaction) | listing pages, 20 cards each | **362 pages · 4,825 cards · 3,938 unique items** | **every page of every collection** (`ff-crawl.js`; both the 2025+ and the pre-2024 card formats): title, description, technologies, browsers, source link | The pens themselves (3,284 on CodePen) — CodePen answers scripts with a Cloudflare challenge (403), so their CSS was NOT READ → in the demo list for the browser pass. Collections left out as off-topic: tables, pricing, recipe/movie/credit cards, file upload, login/contact/subscribe/checkout forms, layout switchers. |
| **Material 3** — `material-components/material-web` source (tokens `versions/latest`, component SCSS/TS) | system motion tokens (16 durations, 9 easings, 6 springs), state-layer opacities, focus ring, and the motion of switch, checkbox, radio, ripple, tabs, menu, dialog, progress, field, slider, focus ring | 20 component docs, all motion code | **all of it** | m3.material.io pages: rendered by JS, the fetch returns only the title — the source is the authority instead (and closes 04's "focus-ring thickness not confirmed": **3 px, offset 2 px, inner −3 px**). |
| **Apple HIG** (JSON data endpoints) | toggles, buttons, progress indicators, sheets, alerts, menus, popovers, segmented controls, tab bars, feedback, loading, pickers, sliders, text fields, page controls, notifications, disclosure controls, playing haptics, motion | **20 pages** | **20 / 20** in full | "badges" endpoint returned no content (8 bytes). |

---

## 1. What every source says, measured

### 1.1 uiverse — 3,802 elements, every CSS file parsed

| Category | Elements | Transition | Keyframes | Infinite | `:hover` | `:active` | `:focus-visible` | `:checked` | reduced motion | `(hover:hover)` | Transition median (IQR) ms | Most common | Animation median (IQR) ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Buttons | 1231 | 84% | 23% | 17% | 90% | 39% | 27 | 20 | 3 | 1 | 300 (250–500) | 300 ms ×749 | 1000 (500–3000) |
| Cards | 726 | 66% | 25% | 23% | 76% | 9% | 2 | 10 | 2 | 0 | 300 (300–500) | 300 ms ×360 | 2500 (1000–5000) |
| Checkboxes | 171 | 83% | 27% | 1% | 33% | 13% | 2 | 170 | 1 | 0 | 300 (200–400) | 300 ms ×101 | 400 (300–600) |
| Forms | 180 | 65% | 9% | 7% | 82% | 16% | 8 | 15 | 0 | 0 | 300 (200–400) | 300 ms ×81 | 1500 (1000–3000) |
| Inputs | 226 | 69% | 12% | 9% | 39% | 8% | 2 | 8 | 0 | 0 | 300 (300–500) | 300 ms ×164 | 2000 (700–4000) |
| Loaders | 718 | 6% | 97% | 99% | 2% | 0% | 0 | 0 | 1 | 0 | – | – | 2000 (1000–3200) |
| Notifications | 23 | 39% | 100% | 78% | 57% | 4% | 0 | 0 | 0 | 0 | 800 (500–2000) | 500 ms | 2000 (1000–4000) |
| Patterns | 103 | 0% | 3% | 5% | 0% | 0% | 0 | 0 | 0 | 0 | – | – | 4000 |
| Radio-buttons | 102 | 88% | 26% | 17% | 59% | 7% | 2 | 98 | 0 | 0 | 300 (200–400) | 300 ms ×63 | 1500 (600–4000) |
| Toggle-switches | 260 | 92% | 14% | 5% | 13% | 9% | 6 | 252 | 2 | 1 | 300 (300–400) | **400 ms ×183** | 500 (300–2000) |
| Tooltips | 62 | 95% | 24% | 11% | 100% | 6% | 2 | 3 | 1 | 0 | 300 (300–300) | 300 ms ×105 | 650 (500–1200) |

Across all 3,802: **5,658 transition durations, median 300 ms (IQR 250–500, p90 600)**; the five values 300 · 500 · 200 ·
400 · 1000 ms cover 79 %. **2,764 animation durations, median 2,000 ms (IQR 1,000–3,200)** — almost all loaders and
decorative loops. Easing: **59 % plain `ease`** (2,235 by default + 1,104 written), `ease-in-out` 950, `ease-out` 285,
`linear` 200, `ease-in` 146; the first named curve, `cubic-bezier(.23,1,.32,1)` (easeOutQuint), only 112. Overshoot
curves (back/spring-like, e.g. `cubic-bezier(.68,-.55,.265,1.55)`) in 115 elements. **`transition: all` in 3,606 of the
transition parts (64 %)**. What moves: `transform` in 2,754 elements, a box-shadow change on a state in 1,295, `filter`
454, **a layout property animated (width/height/top/left/padding/margin/max-height) in 309**, 3D in 267, clip-path 119,
backdrop-filter 116, SVG stroke draw 102, `@property`/conic 72.

**Accessibility, measured (the gallery is a gallery of looks, not of components):**

| Category | div/span "button" | `outline:none` with no focus style left | input with no label | checkbox/radio hidden with `display:none` | any `aria-`/`role` | px font-size | hex colour |
|---|---|---|---|---|---|---|---|
| Buttons | 41 | 125 | 4 | 3 | 38 | 48% | 74% |
| Cards | 19 | 26 | 10 | 3 | 29 | 36% | 72% |
| Checkboxes | 1 | 10 | 11 | **40 (23 %)** | 3 | 38% | 77% |
| Forms | 6 | 31 | 74 | 2 | 6 | 43% | 67% |
| Inputs | 2 | 28 | **155 (69 %)** | 4 | 14 | 40% | 73% |
| Loaders | 4 | 0 | 0 | 0 | **6 (0.8 %)** | 9% | 74% |
| Radio-buttons | 12 | 10 | 14 | **27 (26 %)** | 4 | 44% | 79% |
| Toggle-switches | 11 | 15 | 17 | **49 (19 %)** | 10 | 40% | 80% |
| Tooltips | 6 | 1 | 2 | 0 | 3 | 58% | 74% |

Only **51 of 3,802 (1.3 %)** style `:focus-visible`, **10 (0.26 %)** honour `prefers-reduced-motion`, **2** gate hover
with `(hover:hover)`. Loaders announce themselves (`role="status"`/`aria-live`/`aria-busy`/progressbar) in **3 of 718**.
Tooltips: 62/62 open on hover, **0** on keyboard focus, **0** use `role="tooltip"`; 36 toggle `visibility`. Toggles: of
those that move the thumb in a `:checked` rule, **290 use `transform`, 101 use `left`/`right`/`margin-left`** (a layout
property); 5 put `role="switch"` in the markup and the best of them (`Mohammad-Rahme-576_weak-deer-13`) puts it on the
`<label>` with a frozen `aria-checked="false"` while a real checkbox sits inside — double, wrong semantics. A hidden
input is hidden accessibly (`opacity:0` / `appearance:none`) in 249 + 127 elements. Inputs: floating label in 57,
`:placeholder-shown` in 27, `:valid`/`:invalid` in 59, a shake keyframe in 26.
*Method limits: regex classification; "input with no label" counts a wrapping `<label>` or `aria-label` as labelled;
a `div` with "btn" in its class but a `<button>` elsewhere in the file is not counted.*

### 1.2 Animate.css — 98 animations
Default **1 s** (`--animate-duration`), 0.75 s for bounceIn/bounceOut/flipOutX/Y, 1.3 s heartBeat, 2 s hinge; modifiers
`faster` ½ · `fast` ×0.8 · `slow` ×2 · `slower` ×3. Groups: attention seekers 13 (bounce, flash, pulse, rubberBand,
**shakeX** — the validation shake, ±10 px translateX ×5, **headShake**, swing, tada, wobble, jello, heartBeat), back in/out
8, bounce in/out 10, fade in/out 26, flip 5, lightspeed 4, rotate in/out 10, slide in/out 8 (with `visibility`), specials
4, zoom in/out 10. Every one animates only `transform`/`opacity` (+`visibility` on slides). Its reduced-motion block is
the reference this project lacks: `animation-duration: 1ms; transition-duration: 1ms; **animation-iteration-count: 1**`,
and `[class*='Out'] { opacity: 0 }` so an exit ends hidden (see MR-17).

### 1.3 Animista — 662 variations
Median duration **0.5 s** (IQR 0.45–0.65). Easings: easeOutQuad 244, easeInQuad 77, easeInOutQuad 61, `ease` 51, linear 46.
Entrances 0.4–0.7 s ease-out, exits 0.45–0.6 s ease-in, attention 0.3–0.9 s (vibrate, shake 0.7–0.8 s, jello, wobble,
pulsate, blink), basic transforms 0.4–0.5 s, text 0.5–1.2 s, background 2–8 s (ken-burns 5 s). Infinite only in vibrate,
flicker, pulsate, color-change.

### 1.4 Motion examples — 462 pages / 244 effects
Component-relevant effects (each in JS/React/Vue): button press (`press()` springs stiffness 500–1000), hold-to-confirm,
**copy button** (icon swap + blur + pathLength tick), **multi-state badge** (processing → success → error), add-to-basket,
**dots-morph button**, rolling-text button (the only component example that reads `useReducedMotion`), floating action
button, radial menu, create button; **switch / checkbox / radio / tabs / toggle-group / tooltip / toast / progress /
select / dropdown / context menu / dialog / accordion** built on Base UI and Radix (Plus, source not read); smooth tabs and
tab-select (one indicator moved with a shared `layoutId`), accordion with `height:auto`, modal on `<dialog>`, family
dialog, sheet modal (drag to dismiss), command palette, toast stack (3D stack), notifications list/stack, characters
remaining (spring), loaders (circle spinner 1.5 s, jumping dots 0.8 s, three-dots pulse 1.2 s, ripple, line reveal, fill
text, progress bar, path drawing), **skeleton shimmer → content**, number counter / price switcher / trend (AnimateNumber,
Plus), carousels (13, Plus), swipe actions, card stack, todo list, tilt card, bobble hover.
**Measured from the 214 pages with source:** spring stiffness median **200** (IQR 100–700, n 68), damping median **22**
(18–30, n 57), `bounce` median **0.24** (0.2–0.3, n 46); durations median **0.6 s** (0.3–1 s, n 179). Only **7 of 462**
pages reference reduced motion, **21** use `whileTap`/`press`, **1** `whileFocus`.

### 1.5 Codrops — 775 items
The component articles are mostly 2010–2017 inspiration sets (Inspiration for Text Input Effects 2015, Tab Styles 2014,
Dialog Effects 2014, Nifty Modal Window Effects 2013, Animated Checkboxes and Radio Buttons with SVG 2013, Playful Little
Tooltip Ideas 2017, Morphing Buttons Concept 2014, Particle Effects for Buttons 2018, Magnetic Buttons 2020, Ideas for CSS
Button Hover Animations 2021, How to Implement and Style the Dialog Element 2021, Dynamic Tooltip Reveal Animations 2023).
Of the 422 articles, 151 use CSS transitions/keyframes, 112 SVG, 37 WebGL, 32 GSAP; **24 mention ARIA/accessibility, 2
reduced motion**. Durations quoted in article text: median **300 ms** (IQR 200–400, n 322). The 343 web demos (GSAP
showcase pens, Codrops demos) are in the demo list.

### 1.6 freefrontend — 3,938 unique items in 209 collections
By component: buttons 578 · loaders/progress 474 · cards 458 · menus/hamburgers 435 · carousels/sliders 401 · inputs/forms
260 · toggles 189 · hover/ripple 155 · accordions 126 · tabs 121 · modals 108 · checkboxes 107 · badges/counters 95 ·
radios 87 · toasts/notifications 86 · dropdowns 85 · pagination 48 · avatars 39 · ratings 39 · tooltips 32 ·
micro-interaction 24 (+130 more in the micro-interaction collection's other families). From the descriptions: 878 need
JavaScript (173 GSAP), 571 say pure CSS, 298 SVG, 303 mention accessibility/keyboard/ARIA, **7 mention reduced motion**,
57 `:has()`, 30 `@property`, 22 popover/anchor positioning, 9 view transitions, 6 `@starting-style`. Hosts: CodePen
3,284, tailwindcomponents 222, bbbootstrap 75, bootsnipp 68, colorlib 47, uiverse 24, GitHub 21, tympanus 11.

### 1.7 Material 3 (material-web source) — the one design system whose component motion is fully specified
- **Tokens:** durations short1–4 **50/100/150/200**, medium1–4 **250/300/350/400**, long1–4 **450/500/550/600**, extra-long
  700–1000 ms. Easings: standard `(.2,0,0,1)`, standard-accelerate `(.3,0,1,1)`, standard-decelerate `(0,0,0,1)`,
  emphasized-decelerate `(.05,.7,.1,1)`, emphasized-accelerate `(.3,0,.8,.15)`, legacy `(.4,0,.2,1)`. Springs: spatial
  (moves things) damping 0.9 with stiffness fast 1400 / default 700 / slow 300; effects (colour, opacity) damping 1 with
  3800 / 1600 / 800 — **effects never overshoot**.
- **State layers:** hover **0.08**, focus 0.10 (latest) / 0.12 (v0_192), pressed 0.10 / 0.12, dragged 0.16, disabled 0.38.
- **Focus ring:** thickness **3 px**, outer offset **2 px**, inner −3 px; it "grows" in 25 % of `long4` (600 ms) and settles in
  75 %, `emphasized`; `animation: none` under `prefers-reduced-motion`.
- **Ripple:** touch delay **150 ms** (so a scroll is not a press), press grows **450 ms**, minimum visible press **225 ms**,
  starts at 0.2 scale, fades out **375 ms** linear; soft edge 35 % of the container.
- **Switch:** handle position **300 ms with overshoot** `cubic-bezier(.175,.885,.32,1.275)`; handle size 250 ms standard;
  track colour **67 ms linear**; icon 167 ms. **Checkbox:** mark enters 350 ms emphasized-decelerate, exits 150 ms
  emphasized-accelerate; opacity 50 ms linear. **Radio:** inner circle grows 300 ms; fill 50 ms linear.
- **Tabs:** one indicator animated between tabs with WAAPI, **250 ms emphasized**. **Menu:** opens 500 ms emphasized with
  items fading in 250 ms staggered inside it; closes **150 ms** emphasized-accelerate (items 50 ms). **Dialog:** opens
  500 ms emphasized (scrim 500 ms linear, content fades 50 ms after 100 ms delay), closes 150 ms accelerate.
- **Field:** floating label **150 ms** standard (`short3`); supporting content enters after a short delay so the label can
  move first. **Linear progress:** determinate 250 ms `(.4,0,.6,1)`; indeterminate 2 s loop. **Circular:** 1,333 ms arc.
- **Forced colours:** switch, radio, ripple, chips, field, progress, slider all have `@media (forced-colors: active)`
  rules (system colours `ButtonText`, `Highlight`). Reduced motion: focus ring, slider label, tabs.

### 1.8 Apple HIG
"**Always include a press state for a custom button.** Without a press state, a button can feel unresponsive." ·
Buttons can show an activity indicator inside while an action completes. · Progress indicators are transient;
determinate fills leading→trailing (circular clockwise); use indeterminate only when the time is unknown. · "In situations
where content needs a second or two to load, it's better to display a loading indicator than a blank screen"; prefer
placeholders that are replaced as content arrives. · Toggles: "Make sure the visual differences in a toggle's state are
obvious. Avoid relying solely on different colors." · Popovers: animate a size change so it does not look like a new
popover replaced the old one. · Page controls: "Avoid animating page transitions during scrubbing… Use the animated
scrolling transition only for tapping." · Feedback: match the significance of the information to how it is delivered;
give it in more than one way (colour, text, sound, haptics) so it survives silence, looking away and VoiceOver.

---

## 2. Ground rules for every component effect (distilled; the motion rules themselves are in 06)

1. **One press, one hover, one focus, per component, from tokens.** Hover and focus look the same (04 §1); press is
   instant (`--eu-dur-instant` 70 ms — HIG "always a press state"; Material press 10–12 %); hover is gated by
   `(hover:hover)` (MR-6); focus is a ring, never only a shadow (SH-7).
2. **State changes 150–300 ms, openings 200–500 ms, exits ~60–75 % of the entrance** (Material dialog/menu 500/150, checkbox
   350/150; uiverse median 300; Animista entrances 0.5, exits 0.45–0.6). Anything over 500 ms on a control is slow.
3. **Animate `transform` and `opacity`; move a thumb, an indicator or a mark with `transform`**, never `left`/`width`
   (101 uiverse toggles do).
4. **Never `transition: all`** (64 % of uiverse transitions) — name the properties, or a theme change animates the whole
   page and layout properties sneak in.
5. **The real control stays real and focusable:** `<button>`, `<input type="checkbox">` (hidden with `appearance:none`
   or `opacity:0`, never `display:none`), labels linked, `aria-expanded`/`aria-pressed`/`aria-checked` updated by the
   browser, not frozen in markup.
6. **Feedback is never colour alone and never motion alone** (HIG feedback; WCAG 1.4.1): a tick, a word, an icon, a
   live-region message carry the meaning; motion is the emphasis.
7. **Loops need a stop:** an infinite animation must be paused when hidden, stopped under reduce (and MR-17 fixed first),
   and a loader needs a name (`role="status"`/`aria-busy`/progressbar with a label).
8. **Reduce = the end state, instantly or with a short fade;** springs become the no-overshoot effects curve (MR-19).

---

## 3. Entries, by component

### CE.btn-press · Button press, hover and focus
- Family 6 · trigger hover | focus | press
- A visitor sees the button darken slightly under the mouse, get a clear ring when tabbed to, and dip a hair when pressed.
- How: state layer, not a new colour per variant —
  `.btn{position:relative;transition:transform var(--eu-dur-instant) var(--eu-ease-standard), background-color var(--eu-dur-fast) var(--eu-ease-standard)}`
  `.btn::before{content:"";position:absolute;inset:0;border-radius:inherit;background:currentColor;opacity:0;transition:opacity var(--eu-dur-fast)}`
  `@media (hover:hover){.btn:hover::before{opacity:.08}}` `.btn:focus-visible::before{opacity:.1}` `.btn:active::before{opacity:.12}`
  `.btn:active{transform:translateY(.0625rem) scale(.98)}`. Technique: opacity + transform.
- Timing: uiverse button transitions median 300 ms (IQR 250–500) — too slow for a press; Material state layer
  `short`, press visible ≥ 225 ms; HIG press state required → hover `fast` 120 ms, press `instant` 70 ms in, `fast` out.
- Phone: `:active` is the only feedback a finger sees — kept; hover gated off. Cost ≈ 0.
- Reduced motion: keep the state-layer opacity, drop the `transform`.
- Accessibility: 2.4.7 / 2.4.11 focus visible; 2.5.2 act on release; 1.4.11 ring ≥ 3:1; a real `<button>`/`<a>` (41
  uiverse "buttons" are `div`/`span`).
- Cost: compositor; no `box-shadow` animation.
- How common: `:hover` in 90 % of 1,231 uiverse buttons, `:active` in 39 %, `:focus-visible` in 2 % (27). freefrontend
  buttons 578 items.
- Examples: material-web `button` (`https://material-web.dev/components/button/`); uiverse `Allyhere/strong-pug-22`
  (focus-visible + reduced motion, `https://uiverse.io/Allyhere/strong-pug-22`); motion.dev `js-press`
  (`https://examples.motion.dev/js/press`). Shots: none yet (browser pass pending).
- Surfaces: Button block, Card action, Alert actions, every component button · Educo web app buttons · native:
  `Pressable` with `pressed` style + `Animated.spring` scale 0.97 (BottomTabBar already does 0.85 in 80 ms).
- Builder status: **PARTIAL** — `.eu-btn` has hover per variant (`lib/educo-ui/components.ts:21-27`) and `:active`
  `translateY(1px)` (`:18`) but hover is not gated (0 hits for `hover: *hover` in `lib/`), the press is in px, and the
  **Button block itself exports an inline-styled `<a>` with no class** (`lib/box-export.ts:141-145`), so none of it
  applies (HV-3). Only the Card action gets `.eu-btn` (`lib/educo-ui/registry.ts:84`).
- Gap id: CE-1, CE-2 (+ HV-1, HV-2, HV-3, MR-6).

### CE.btn-state · Button loading → success / error (and morph)
- Family 8 · trigger state (after click)
- The button keeps its size, its label is replaced by a small spinner while the form sends, then a tick and "Sent" for
  a moment, then it returns (or shows "Try again").
- How: `aria-busy="true"` + `aria-disabled="true"` on the button (not `disabled`, which drops focus); width held
  (`min-inline-size` set from the measured width or a grid stack of label/spinner/tick in one cell, swapped by
  `opacity`); the result announced by a separate `role="status"` region ("Message sent"). Tick drawn by
  `stroke-dashoffset` (pathLength=1). Morph-to-circle versions (Codrops "Morphing Buttons Concept", motion.dev
  `dots-morph-button`) animate width — avoid, or use `clip-path`/`scale`.
- Timing: spinner loop 0.8–1 s linear; swap 150–200 ms; success held 1.5–2 s; tick draw 300–350 ms (Material checkbox
  350). motion.dev `multi-state-badge`, `copy-button` follow the same pattern.
- Phone: kept; it is the only proof a slow 3G submission is happening (RULE AF) — and must also say "Saved offline, will
  send" when queued.
- Reduced motion: spinner → static "Sending…" text or a slow opacity pulse; tick appears without drawing.
- Accessibility: 4.1.3 status messages via live region; focus stays on the button; no colour-only success/error.
- Cost: tiny; SVG stroke animation is paint on a 1 rem box.
- How common: uiverse — 0 buttons use `aria-busy`; freefrontend "micro-interaction loading button" family (24);
  HIG buttons page recommends it.
- Examples: motion.dev `multi-state-badge` (`https://examples.motion.dev/react/multi-state-badge`), `copy-button`
  (`https://examples.motion.dev/react/copy-button`), freefrontend "Micro-Interaction Loading Button". Shots: pending.
- Surfaces: form submit (application layer), newsletter, contact · Educo app: pay fees, send message · native: same
  states with `ActivityIndicator` + `accessibilityState={{busy:true}}` + `AccessibilityInfo.announceForAccessibility`.
- Builder status: **GAP** — no form or submit exists in the export (0 hits `aria-busy`/`aria-live`/`role="status"` in
  `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/`; alerts use `role="status"` statically,
  `lib/box-model.ts:1687`).
- Gap id: CE-3.

### CE.copy · Copy-to-clipboard feedback
- Family 8 · trigger click
- The copy icon turns into a tick and the word "Copied" for about two seconds.
- How: `navigator.clipboard.writeText()`; icon swap by `opacity`/`scale`; the word in a live region; revert after 2 s.
- Timing: swap 150 ms; hold 1.5–2 s (motion.dev copy-button: blur swap + pathLength tick).
- Phone: kept (sharing a phone number, a bank account for fees — RULE AF). Reduced: no blur/scale, swap only.
- Accessibility: 4.1.3 announce "Copied"; button name stays "Copy …".
- Cost: none. How common: motion.dev 3 pages; freefrontend a handful; uiverse 0 (search: no clipboard script exists —
  uiverse is CSS-only, 0 elements with `<script>`).
- Surfaces: builder (copy link, copy embed) · Educo app (account number, reference) · native `expo-clipboard` + toast.
- Builder status: **GAP** (0 hits `clipboard` in the engine/design system). Gap id: CE-15.

### CE.switch · Toggle switch
- Family 8 · trigger click | key (Space)
- The knob slides across and the track fills with the brand colour; a small icon or "On/Off" makes the state readable.
- How: `<input type="checkbox" role="switch">` (or `<button role="switch" aria-checked>`), styled with
  `appearance:none`; thumb on `::before` moved with `transform: translateX(calc(var(--track) - var(--thumb) - 2*var(--pad)))`;
  track colour `background-color`. Safari 17.4+ also has `<input type="checkbox" switch>` (progressive). An icon/text
  inside the thumb or beside it for "not colour alone" (HIG).
- Timing: uiverse median 300 ms, **400 ms most common (183/260 — copied from one tutorial)**; Material position 300 ms
  with overshoot, colour 67 ms linear; Base UI/Radix examples spring → `--eu-dur-base` 200 ms, `--eu-ease-overshoot` for
  position only, colour `fast` linear.
- Phone: kept; target ≥ 24 px (2.5.8), the whole label row is the hit area.
- Reduced motion: position jumps, colour changes (no overshoot).
- Accessibility: 4.1.2 name/role/state (the browser does it with a real input); 1.4.1 + 1.4.11 track/thumb 3:1;
  forced colours (Material uses `ButtonText`); focus ring on the switch, not hidden with the input (49 uiverse switches
  hide the input with `display:none` — keyboard cannot reach them).
- Cost: compositor (transform) + one small repaint.
- How common: uiverse 260; freefrontend 189 (8 collections); Material, HIG, motion.dev Base/Radix switch.
- Examples: material-web switch (`https://material-web.dev/components/switch/`); uiverse `Admin12121/strong-penguin-65`
  (role=switch + focus-visible); motion.dev `react-radix-switch`. Shots: pending.
- Surfaces: future Form/Settings component, cookie/consent, theme switch, accordion "switch" indicator · Educo app
  settings · native `Switch` (OS-drawn, already accessible).
- Builder status: **GAP** for a real switch (0 hits `role="switch"`, `type="checkbox"`). The accordion's "switch" look is
  an indicator only and animates `box-shadow` (`lib/educo-ui/components.ts:410-412`).
- Gap id: CE-4.

### CE.check · Checkbox and radio
- Family 8 · trigger click | key
- The box fills and a tick draws itself in; a radio's inner dot grows.
- How: native input with `appearance:none` and a border; tick = SVG `path` with `pathLength="1"`, `stroke-dasharray:1;
  stroke-dashoffset:1` → `0` on `:checked`; radio dot = `::before` `scale(0)` → `scale(1)`; indeterminate = a bar.
- Timing: uiverse checkboxes median 300 ms (IQR 200–400), animations 400 ms; Material mark 350 ms in / 150 ms out, radio
  300 ms → tick `slow` 320 ms `ease-out`, uncheck `fast` 120 ms.
- Phone: kept; label is the target.
- Reduced: tick appears whole (no draw).
- Accessibility: name from `<label>` (11 uiverse checkboxes and 14 radios have none); never `display:none` the input
  (40 + 27 do); group with `<fieldset><legend>`; arrow keys inside a radio group come free with native radios.
- Cost: SVG stroke = paint on a tiny box.
- How common: uiverse 171 + 102 (stroke draw in 23 checkboxes); freefrontend 107 + 87; Codrops "Animated Checkboxes and
  Radio Buttons with SVG" (2013); motion.dev Base/Radix checkbox ("path line animation for the tick").
- Examples: material-web checkbox, radio; uiverse `cbolson/calm-wasp-75`; Codrops 2013 demo. Shots: pending.
- Surfaces: forms, filters, to-do lists, consent · Educo app forms · native: custom `Pressable` + Reanimated tick, or
  community checkbox with `accessibilityRole="checkbox"`.
- Builder status: **GAP** (0 hits `type="checkbox"` / `type="radio"`). Gap id: CE-5.

### CE.field · Input focus, floating label, validation
- Family 6 + 8 · trigger focus | input | state (invalid)
- The label rises above the field as you type, the border turns the brand colour; a wrong entry shows a red border, an
  icon and a line of text saying what to fix (optionally one small shake).
- How: label floats on `:focus-within`/`:not(:placeholder-shown)` (placeholder must be `" "`), `transform: translateY(-…)
  scale(.85)` from `transform-origin: left`; error shown on **`:user-invalid`** (only after the user has interacted —
  `:invalid` fires on load, 59 uiverse fields do this) or on `[aria-invalid="true"]` set by script, with the message
  linked by `aria-describedby`. Shake: `translateX` ±0.25 rem, 3 cycles in 300 ms (Animate.css `shakeX` is 1 s, ±10 px —
  too long), only after submit.
- Timing: Material label 150 ms standard; uiverse inputs median 300 ms → `fast`–`base`.
- Phone: kept; on Android the keyboard opens — keep the field visible (`scroll-margin`), never animate the field's height.
- Reduced: label moves instantly; no shake (message + icon carry it).
- Accessibility: visible `<label>` (155 of 226 uiverse inputs have none — placeholder as label fails 3.3.2); 3.3.1 error
  identified in text; 1.4.1 not colour alone; 2.3.3 shake is motion; focus ring ≥ 3:1 (SH-7: today a shadow only).
- Cost: transform on one label; negligible.
- How common: uiverse floating label 57, validation 59, shake 26; Codrops "Inspiration for Text Input Effects" (2015, 2
  sets); freefrontend inputs/forms 260; Material field.
- Examples: material-web text-field (`https://material-web.dev/components/text-field/`); Codrops
  `http://tympanus.net/Development/TextInputEffects/`; motion.dev `characters-remaining` (spring counter). Shots: pending.
- Surfaces: future Form component, accordion search box (`lib/box-export.ts:249`), Educo app forms · native `TextInput`
  + Reanimated label, `accessibilityHint` for errors.
- Builder status: **PARTIAL** — design-system CSS for `.eu-input/.eu-field/.eu-label/.eu-error` exists
  (`lib/educo-ui/components.ts:43-54`) but **no renderer emits these classes** (grep outside `components.ts`: 0 hits);
  invalid state is a border colour only (`:50`, colour alone); focus ring is `outline:none` + shadow (`:49`, SH-7). No
  floating label, no `:user-invalid`.
- Gap id: CE-6, CE-7.

### CE.card · Card hover, flip and expand
- Family 6 · trigger hover | focus | click
- (Lift, shadow, image zoom, reveal caption → **04 §2.1, 2.2, 2.4, 2.7; 07 §2.10** — not repeated.) New here: **flip**
  (front/back) and **expand into a detail view**.
- How: flip = two faces, `transform: rotateY(180deg)` with `backface-visibility:hidden` and `perspective` on the parent
  (45 uiverse elements) — only on click/Enter with `aria-pressed`, both faces in the DOM, back face `inert` when hidden;
  expand = shared-element morph (motion.dev `app-store`, `modal-shared-layout`) or a View Transition (`view-transition-name`
  on the card and the opened view, 03-page-transitions).
- Timing: uiverse cards 300 ms (300–500); flip 400–600 ms `ease-in-out` → `slower`; expand `--eu-dur-page` 400 ms.
- Phone: hover-flip is unusable on touch — click only; 3D flip is costly on low-end GPUs — swap for a crossfade.
- Reduced: crossfade faces, no rotation; expand → instant/fade.
- Accessibility: never hide content on the back face from keyboard/screen reader without a control; 2.3.3.
- Cost: 3D layer per card; avoid on grids of 30.
- How common: uiverse cards 726 (`:hover` 76 %, flip 19, 3D 68); freefrontend flip-cards + card hover 458.
- Examples: freefrontend css-flip-cards; motion.dev `app-store` (`https://examples.motion.dev/react/app-store`);
  Codrops "Morphing Buttons Concept". Shots: pending.
- Surfaces: Card component, staff/teacher cards, course cards · Educo app (child card → detail) · native shared-element
  transition (Reanimated `sharedTransitionTag`).
- Builder status: **GAP** for flip/expand (0 hits `backface-visibility`, `view-transition-name` in the engine; 03 records
  the View Transition gap). Gap id: CE-16 (LATER).

### CE.tooltip · Tooltip / toggletip
- Family 5 + 6 · trigger hover | focus | click
- A small label fades in next to an icon after a short pause, and again when the icon is tabbed to; Escape hides it.
- How: **04 §2.14 and HV-12** own the mechanism (`popover="hint"` + `interestfor`, click-to-open fallback). Motion:
  `opacity` + `translate` 0.25 rem towards the anchor, entrance with `@starting-style` (05 §1), exit faster.
- Timing: uiverse tooltips 300 ms (IQR 300–300), 36 use `visibility`; motion.dev/Radix tooltip spring; `interest-delay`
  0.25 s in / 0.15 s out → `fast` 120 ms fade after a 250 ms delay.
- Phone: no hover → toggletip (tap) or the text shown inline.
- Reduced: fade only. Accessibility: 1.4.13 (dismissible, hoverable, persistent) — **0 of 62 uiverse tooltips open on
  focus**; `role="tooltip"` used by 0. Cost: tiny.
- How common: uiverse 62, freefrontend 32, Codrops 9 posts. Examples: Codrops "Playful Little Tooltip Ideas"
  (`https://tympanus.net/codrops/2017/05/31/playful-little-tooltip-ideas/`), uiverse `Mohammad-Rahme-576/hard-starfish-64`
  (focus-visible + reduced motion), motion.dev `react-radix-tooltip`. Shots: pending.
- Surfaces: icon buttons in the builder, glossary terms, form help · Educo app help icons · native: long-press +
  `accessibilityHint`.
- Builder status: **GAP** (0 hits `tooltip`, `popover`). Gap id: HV-12 (not duplicated).

### CE.menu · Dropdown, select and context menu
- Family 5 · trigger click | key (Enter, Space, ArrowDown)
- The list unfolds from under its button, items fading in one after another; it folds away faster when closed.
- How: popover (or `<dialog>` for a menu sheet on phones) anchored with CSS anchor positioning where supported; open =
  `opacity` + `scale(.95)` → 1 from the top edge (`transform-origin` at the anchor), items stagger ≤ 30 ms each; close =
  opacity only. `aria-expanded` on the trigger; roving focus / `aria-activedescendant`.
- Timing: **Material menu 500 ms emphasized open (items 250 ms each inside it), 150 ms close** — the asymmetry is the rule;
  motion.dev mega-menu/dropdown springs → open `slow` 320 ms, close `fast` 120 ms, items step 20–30 ms.
- Phone: becomes a bottom sheet or full-width list; a native `<select>` is better than any custom one on Android.
- Reduced: opacity only. Accessibility: APG menu-button/listbox keyboard; focus returns to the trigger; Escape closes.
- Cost: compositor. How common: freefrontend dropdowns/select 85, menus 435; Codrops dropdown 14; motion.dev Radix/Base
  dropdown, select, context menu.
- Examples: material-web menu (`https://material-web.dev/components/menu/`); Codrops "Simple Effects for Drop-Down Lists"
  (`http://tympanus.net/Development/SimpleDropDownEffects/`); motion.dev `react-context-menu` (safe-zone cone). Shots: pending.
- Surfaces: nav dropdown, language switcher (RULE AF), builder menus · Educo app pickers · native modal picker / ActionSheet.
- Builder status: **GAP** (0 hits `popover`, `aria-expanded` in the export; `aria-expanded` exists only in editor chrome
  `components/website/box/*.tsx`). Motion recorded in EX-7. Gap id: EX-7 (+ CE-14 for the menu trigger).

### CE.tabs · Tabs and segmented control — indicator slide
- Family 8 · trigger click | key (arrows)
- The underline (or pill) glides from the old tab to the new one and the panel crossfades.
- How: **one** indicator element moved with `transform: translateX() scaleX()` (set from the selected tab's
  `offsetLeft/width` as custom properties) — or, with no script, CSS anchor positioning (`anchor-name` on the selected
  tab, `left: anchor(left); right: anchor(right)` with a transition, Chromium 125+). Panel: `opacity` 0 → 1 with
  `@starting-style`; direction-aware slide only if cheap (motion.dev smooth-tabs). Material animates the indicator from
  the previous tab's geometry with WAAPI.
- Timing: **Material 250 ms emphasized**; motion.dev `layoutId` spring → `base` 200–250 ms `--eu-ease-standard`.
- Phone: tabs scroll horizontally; indicator still slides; swipe between panels is optional (gesture family).
- Reduced: indicator jumps; panel swaps. Accessibility: APG tabs (`role="tablist/tab/tabpanel"`, `aria-selected`, roving
  tabindex, arrow keys); selection not shown by colour alone (the bar is the cue).
- Cost: compositor (transform); anchor positioning has no script. How common: freefrontend tabs + tab bars 121, Codrops
  "Tab Styles Inspiration" (2014), motion.dev tab-select, smooth-tabs, Base/Radix tabs, toggle-group.
- Examples: material-web tabs (`https://material-web.dev/components/tabs/`); Codrops
  `https://tympanus.net/codrops/2014/09/02/tab-styles-inspiration/`; motion.dev `react-tab-select`. Shots: pending.
- Surfaces: Tabs component (term dates by year group, fees by term), pricing monthly/yearly · Educo app segmented controls ·
  native: segmented control / Reanimated indicator (BottomTabBar already springs its icons).
- Builder status: **GAP** (0 hits `role="tab"`). Gap id: CE-8.

### CE.accordion · Accordion
- Owned by **05 §6 and EX-4 / EX-5** (open animation with `::details-content` and `interpolate-size`; the horizontal
  variant's `flex-grow`). Component-specific additions: the indicator rotates (chevron −135°, arrow 180°, `+`→`−`) in
  `base` 200 ms — **HAVE** (`lib/educo-ui/components.ts:322-323, 363-374`); reduced motion **HAVE** (`:332`); header
  hover not gated by `(hover:hover)` (`:318`) → CE-1. Material/Radix/Base examples animate height with springs (Plus).

### CE.dialog · Modal, drawer and bottom sheet
- Family 5 + 7 · trigger click | gesture (drag down)
- A dialog fades and rises into the centre over a dimmed page; a drawer slides in from its side; on a phone a sheet slides
  up from the bottom and can be dragged down to close.
- How: **05 §4 / EX-7** own open/close (`<dialog>`, `::backdrop`, `@starting-style`, `overlay`). New here: **sheet drag** —
  pointer events with capture on a visible handle, `translateY` follows the finger, release past 30 % of height or a
  fast flick closes, otherwise springs back; always **also** a Close button (2.5.7 dragging alternative) and Escape.
- Timing: Material dialog 500 ms emphasized in / 150 ms out; motion.dev sheet-modal spring; HIG sheets → open `slower`
  500 ms `--eu-ease-emphasized`, close `fast`–`base` `--eu-ease-in`; spring-back stiffness ~700/damping 0.9 (Material
  spatial default).
- Phone: the sheet IS the phone form; keep it ≤ 90 vh, content scrolls inside, background `inert`.
- Reduced: fade only, no slide; drag still works (it is direct manipulation, not animation).
- Accessibility: focus moved in and returned; `inert` page; 2.5.7; 2.1.2 no trap except the modal itself.
- Cost: compositor; backdrop blur is not (MR-18).
- How common: freefrontend modals 108 + off-canvas/fullscreen menus; Codrops "Nifty Modal Window Effects" (2013),
  "Inspiration for Dialog Effects" (2014); motion.dev modal (`<dialog>`), family-dialog, sheet-modal, Radix/Base dialog.
- Examples: material-web dialog; Codrops `https://tympanus.net/codrops/2021/10/06/how-to-implement-and-style-the-dialog-element/`;
  motion.dev `react-sheet-modal`. Shots: pending.
- Surfaces: lightbox, menu overlay, cookie notice · Educo app — every bottom sheet (child switcher, filters) · native:
  `@gorhom/bottom-sheet`-style with Reanimated + gesture handler (not installed today).
- Builder status: **GAP** (0 hits `<dialog`, `showModal`). Gap id: EX-7 (open/close), CE-9 (sheet drag).

### CE.toast · Toast / snackbar
- Family 5 + 8 · trigger state
- A short message slides in from its corner, stays a few seconds (longer if hovered or focused), and slides away; several
  stack.
- How: a fixed region (`role="status"` for info, `role="alert"` only for errors) that exists **before** the message is
  inserted, so screen readers announce it; enter `translateY(100%)`/`translateX` + opacity from its corner with
  `@starting-style`; exit faster; stacking with `translateY(calc(var(--i) * -0.5rem)) scale(calc(1 - var(--i) * .05))`
  (motion.dev toast-stack). Pause the timer on hover and focus (2.2.1 — the builder already does).
- Timing: uiverse notifications 500–800 ms (too slow); motion.dev Radix/Base toast spring
  → enter `slow` 320 ms `--eu-ease-out`, exit `base` 200 ms `--eu-ease-in`; display ≥ 5 s + 1 s per 10 words.
- Phone: full-width at the bottom, above the home bar (`env(safe-area-inset-bottom)`); swipe to dismiss + a close button.
- Reduced: fade, no slide. Accessibility: 4.1.3; 2.2.1 adjustable time (MR-5); focus never stolen.
- Cost: compositor. How common: uiverse 23 notifications (78 % infinite loops — decorative), freefrontend toasts 86,
  motion.dev 5 (toast-stack, notifications-stack/list, Radix/Base toast).
- Examples: motion.dev `react-toast-stack`, `react-notifications-stack`; freefrontend javascript-toast-messages. Shots: pending.
- Surfaces: Alert "toast" form · Educo app ("Payment received") · native toast with `AccessibilityInfo.announceForAccessibility`.
- Builder status: **PARTIAL** — toast placement exists (`lib/box-model.ts:1943-1960`, fixed corner), timer with
  pause-on-hover/focus and countdown bar (`lib/box-model.ts:2027-2037`; `lib/educo-ui/components.ts:271-287` with a
  reduced-motion rule); **no entrance**, the exit is the hard-coded `.18s` (EX-2) and the live role is on markup present
  at load (`lib/box-model.ts:1687, 1695`), which is read in page order rather than announced.
- Gap id: CE-10 (+ EX-1, EX-2, EX-3, MR-5).

### CE.loader · Spinner, dots, skeleton, progress
- Family 8 · trigger state | time
- While content loads, grey placeholder shapes in the layout of the page shimmer gently (skeleton), or a ring turns, or a
  bar fills; they are replaced by the content as it arrives.
- How: **skeleton** = blocks at the final size (no layout shift) with a `::after` gradient moved by
  `transform: translateX(-100%→100%)` (not `background-position`, which repaints — 136 uiverse keyframes animate it);
  **spinner** = one element `rotate` linear, or an SVG arc (`stroke-dasharray`) — 930 uiverse loader keyframes use
  `transform`, but 114 loaders animate width/height/top/left; **determinate progress** = `<progress>` or `role=
  "progressbar"` with `aria-valuenow`, bar fill by `transform: scaleX(var(--p))`; **indeterminate** only when time is
  unknown (HIG). Show nothing for the first ~300–500 ms (most loads finish) then the indicator for at least ~500 ms
  (no flash).
- Timing: uiverse loaders median **2 s** per cycle (IQR 1–3.2 s), 99 % infinite; Material circular 1,333 ms, linear
  indeterminate 2 s, determinate step 250 ms; motion.dev spinner 1.5 s, dots 0.8–1.2 s; skeleton shimmer 1.5–2 s →
  `--eu-dur-loop` ≈ 1.5 s (a new token, MR-9/MR-23).
- Phone: skeletons are the **right** answer on 3G (RULE AF): the layout is there in the first bytes; pause loops when
  `document.hidden`.
- Reduced motion: skeleton static (or opacity pulse ≥ 2 s); spinner → static icon + "Loading…" text; progress fills
  without easing. **Requires MR-17** (`animation-iteration-count:1` in the global reduce rule) or a looping spinner
  strobes.
- Accessibility: `role="status"` + `aria-busy="true"` on the region being loaded, a text name ("Loading results");
  progressbar with name and value; **3 of 718 uiverse loaders have any of this**; 2.2.2 pause for anything > 5 s.
- Cost: a transform loop is compositor-only; `background-position`/`box-shadow` loops (72 uiverse) repaint every frame.
- How common: uiverse 718, freefrontend loaders/spinners/skeletons/progress 474, Codrops preloaders 17, motion.dev 9.
- Examples: material-web progress (`https://material-web.dev/components/progress/`); motion.dev `react-skeleton-shimmer`
  (`https://examples.motion.dev/react/skeleton-shimmer`); uiverse `VashonG/spicy-crab-68` (the one loader with reduced
  motion). Shots: pending.
- Surfaces: published pages rarely need one (static HTML); forms, search, embeds, the builder's own loads (PageLoader /
  InPageSpinner — Core Rule 3) · Educo app lists · native `ActivityIndicator`.
- Builder status: **GAP** in the export (0 hits spinner, skeleton, shimmer, progressbar, `aria-busy`). **Native app:
  `apps/mobile/components/ui/Spinner.tsx:34-53` loops a 1 s rotation and an 800 ms pulse forever with no reduce-motion
  check and no `accessibilityRole`/`accessibilityLabel` (grep: 0 hits)** — a defect.
- Gap id: CE-11, CE-19 (native), MR-17 (prerequisite).

### CE.count · Counter, stat and badge change
- Family 8 · trigger scroll (in view) | state
- A big number counts up when it comes into view; a notification badge pops in and its number rolls when it changes.
- How: count-up = digits animated from 0 with `@property --n {syntax:'<integer>'}` + `counter-reset: n var(--n)` (no
  script, Chromium/Safari/Firefox 128+) or a short rAF loop; the **real number is in the DOM from the start** (the
  animated copy is `aria-hidden`), `font-variant-numeric: tabular-nums` so the width does not jitter; badge appear =
  `scale(0)`→1 with a small overshoot; number change = vertical roll (motion.dev AnimateNumber).
- Timing: count-up 800–1,200 ms `--eu-ease-out` (decelerating to the value); badge pop 150–200 ms overshoot.
- Phone: kept; start only when in view (`animation-timeline: view()` or IntersectionObserver).
- Reduced: show the final number. Accessibility: screen reader must never hear "0"; no live region on a decorative count.
- Cost: `@property` integer animation is main-thread paint of a few glyphs — fine for a handful.
- How common: freefrontend counters/badges 95; motion.dev number-counter, price-switcher, engagement-stats, trend (Plus).
- Examples: motion.dev `react-number-counter` (`https://examples.motion.dev/react/number-counter`); freefrontend
  css-animated-counters. Shots: pending.
- Surfaces: Stat component ("1,200 pupils"), Badge · Educo app unread counts · native Reanimated text / `react-native-
  animated-numbers`-style.
- Builder status: **GAP** — Stat renders a static value (`lib/educo-ui/registry.ts:113`); Badge static
  (`lib/educo-ui/components.ts:56-63`). `tabular-nums` is used only on the accordion meta (`:453`).
- Gap id: CE-12.

### CE.avatar · Avatar and avatar group
- Family 6 · trigger hover | focus
- In a row of overlapping faces, the hovered one comes forward; an online dot pulses once.
- How: overlap with negative `margin-inline-start`; hover/focus = `translateY(-.25rem)` + `z-index`; status dot is a
  sibling with a text alternative; group "+5" as a link. Timing `fast` 120 ms. Reduced: no lift. Accessibility: each
  avatar has an `alt` with the name; status not colour alone. Cost: tiny. How common: freefrontend avatars 39.
- Surfaces: staff lists, testimonials, Educo app (child switcher already animates — `apps/mobile/components/ui/
  ChildSwitcher.tsx`, `ProfileAvatar.tsx`).
- Builder status: **GAP** (only a round media variant on the accordion, `lib/educo-ui/components.ts:518`). Gap id: CE-17 (LATER).

### CE.carousel · Carousel, slider and pagination dots
- Family 2 + 7 · trigger click | swipe | time
- Slides move sideways when a dot or arrow is pressed or the strip is swiped; the active dot grows into a pill.
- How: CSS scroll-snap strip (already the builder's pager); active dot = `scale`/`width` → prefer `scaleX` on a pill
  pseudo; arrows = buttons; the slide change animates only on tap, **not while scrubbing** (HIG page controls). Range
  slider thumb: native `<input type="range">` styled via `::-webkit-slider-thumb`/`::-moz-range-thumb`, value label on
  focus (Material slider label 0 ms under reduce).
- Timing: smooth scroll ≈ 300–500 ms browser-defined; dot `base` 200 ms; autoplay ≥ 5 s per slide with a visible pause.
- Phone: swipe is native with scroll-snap; no JS gesture library needed.
- Reduced: `behavior:'auto'` (instant) — **HAVE**. Accessibility: 2.2.2 pause control (MR-4/MR-16), slides labelled
  "n of m", dots are links/buttons with names.
- Cost: compositor scroll. How common: freefrontend carousels/sliders 401, pagination 48; motion.dev 13 carousel
  examples (Plus); Codrops carousel 28, slider 70.
- Examples: motion.dev `react-carousel-pagination-scaling`; freefrontend css-carousels. Shots: pending.
- Surfaces: pager/carousel block, gallery, testimonials · Educo app onboarding · native `FlatList` paging.
- Builder status: **HAVE** (pager on scroll-snap, `lib/box-model.ts:3466` ff.; export `lib/box-export.ts:571`; reduced
  motion `lib/box-model.ts:3621`) with **PARTIAL** autoplay controls (MR-4, MR-16 — not repeated). Pagination of lists:
  **GAP** (0 hits `pagination`). Gap id: MR-4/MR-16; CE-18 (pagination, LATER).

### CE.burger · Hamburger → close morph
- Family 6 + 8 · trigger click
- The three lines of the menu button fold into an X as the menu opens, and back when it closes.
- How: `<button aria-expanded aria-controls aria-label="Menu">` with three spans or one SVG; `[aria-expanded="true"]`
  rotates the outer bars ±45° and fades the middle (`transform`/`opacity`), or SVG path morph; the **visible word
  "Menu"** beside it helps first-time and older users. Timing `base` 200–300 ms; Codrops "Animating an SVG Menu Icon with
  Segment". Reduced: swap instantly. Accessibility: the state is in `aria-expanded`, not the icon; Escape closes; focus
  moves into the menu. Cost: compositor.
- How common: freefrontend hamburger/menu icons + mobile menus (part of 435); uiverse checkboxes tagged "hamburger" (9 —
  built on a checkbox, wrong role).
- Surfaces: Navigation component (header on phones — RULE AF 360 px) · Educo web app header.
- Builder status: **GAP** — no menu toggle in the export (0 hits `aria-expanded`/hamburger in `lib/`); the Navigation
  component is a recorded component gap (`docs/COMPONENT_GAPS.md`). Gap id: CE-14.

### CE.rating · Rating and like / heart burst
- Family 8 · trigger click | hover
- Stars light up to the one under the pointer; a heart fills and gives off a small burst when liked.
- How: rating input = radio group (`<fieldset>` + 5 radios), hover preview by `:has(:hover)` sibling logic, value shown
  in text; like = `<button aria-pressed>`, fill `scale` 0→1.2→1 (overshoot 300 ms), burst = `::before/::after` dots
  `scale`+`opacity` 400–600 ms, `aria-hidden`. Reduced: fill only. Accessibility: name "Like (12)"; count announced
  politely. Cost: tiny.
- How common: uiverse like/heart 37 elements; freefrontend ratings 39 + like buttons; motion.dev confetti.
- Surfaces: testimonials (display), Educo app reactions (application layer).
- Builder status: rating **HAVE (display only)** — `role="img"` with a text label (`lib/educo-ui/registry.ts:131-143`);
  interactive rating / like: **GAP**. Gap id: CE-15 (with copy), LATER.

---

## 4. Timing table — measured → token

| Component moment | Measured (source) | Token |
|---|---|---|
| Press in | Material state layer, HIG; uiverse `:active` 39 % | `--eu-dur-instant` 70 ms, `--eu-ease-standard` (MR-9 adds it) |
| Hover / focus colour | uiverse median 300 (too slow), Material short | `--eu-dur-fast` 120 ms |
| Switch thumb / radio dot / tick | Material 300 / 300 / 350; uiverse 300–400 | `--eu-dur-base` 200 ms (+ `--eu-ease-overshoot` on position only) – tick `--eu-dur-slow` 320 ms |
| Uncheck / close / exit | Material 150 | `--eu-dur-fast` 120 ms, `--eu-ease-in` |
| Floating label | Material 150 | `--eu-dur-fast` |
| Tab indicator | Material 250 emphasized | `--eu-dur-base`, `--eu-ease-standard` |
| Menu / dropdown open | Material 500, items 250 staggered | `--eu-dur-slow` 320 ms, items `--eu-dur-stagger` (cap per MR-20) |
| Dialog / sheet open | Material 500 emphasized | `--eu-dur-slower` 500 ms, `--eu-ease-emphasized` (renamed per MR-9) |
| Toast in / out | motion.dev springs; uiverse 500–800 | `--eu-dur-slow` / `--eu-dur-base` |
| Count-up | — | `--eu-dur-reveal` 800 ms, `--eu-ease-out` |
| Loader cycle | uiverse 2 s, Material 1.33–2 s, motion.dev 0.8–1.5 s | new `--eu-dur-loop` 1.5 s |
| Spring (native and JS) | motion.dev stiffness 200 (100–700), damping 22, bounce 0.24; Material spatial 700/0.9 | one "spatial" and one "effects" spring per MR-23 |

---

## 5. The builder today — HAVE / PARTIAL / GAP (verified by grep, twice, 2026-10-02)

Searched `lib/box-model.ts`, `lib/box-export.ts`, `lib/interactions.ts`, `lib/educo-ui/*.ts` (generated icon/photo maps
excluded); second pass for each GAP with alternative spellings and across `components/website/` to separate editor
chrome from the export.

| Component effect | Status | Evidence |
|---|---|---|
| Button states (design system `.eu-btn`) | **PARTIAL** | hover per variant `lib/educo-ui/components.ts:21-27`, `:active` `translateY(1px)` `:18`, disabled `:19`; used only by the Card action `lib/educo-ui/registry.ts:84` |
| Button **block** states | **GAP** | inline-styled `<a>`, no class `lib/box-export.ts:141-145`; base transition list only `lib/educo-ui/base.ts:130` (HV-3) |
| Hover gated by `(hover:hover)` | **GAP** | 0 hits `hover: *hover` in `lib/`; 22 `:hover` rules in `lib/educo-ui/components.ts` |
| Focus ring | **HAVE** (2 px-equivalent rem ring) | `lib/educo-ui/base.ts:107-108`; Material uses 3 px + 2 px offset |
| Motion tokens | **PARTIAL** | `lib/educo-ui/tokens.ts:47-53` (fast 120 · base 200 · slow 320 · slower 500; no instant/loop; `emphasized` overshoots) |
| Global reduced motion | **PARTIAL** | `lib/educo-ui/base.ts:145-147` — no `animation-iteration-count:1` (MR-17) |
| Loading / success button, aria-busy | **GAP** | 0 hits `aria-busy`, `aria-live`, `role="status"` outside the alert (`lib/box-model.ts:1687`) |
| Switch | **GAP** | 0 hits `role="switch"`, `type="checkbox"`; accordion "switch" indicator only `lib/educo-ui/components.ts:410-412` |
| Checkbox / radio | **GAP** | 0 hits `type="checkbox"`, `type="radio"` |
| Input states | **PARTIAL (unused)** | CSS `lib/educo-ui/components.ts:43-54` — no renderer emits `.eu-input/.eu-field` (0 hits outside the file); invalid = colour only `:50`; focus = shadow after `outline:none` `:49` |
| Floating label / `:user-invalid` / shake | **GAP** | 0 hits `placeholder-shown`, `user-invalid`, `shake` |
| Card flip / expand | **GAP** | 0 hits `backface-visibility`, `view-transition-name` |
| Tooltip | **GAP** | 0 hits `tooltip`, `popover` (HV-12) |
| Dropdown / menu / hamburger | **GAP** | 0 hits `aria-expanded` in `lib/` (editor chrome only, `components/website/box/*.tsx`) |
| Tabs indicator | **GAP** | 0 hits `role="tab"` |
| Accordion indicator + reduce | **HAVE** | `lib/educo-ui/components.ts:322-323, 332, 363-374`; open/close animation GAP (EX-4) |
| Dialog / sheet | **GAP** | 0 hits `<dialog`, `showModal` (EX-7) |
| Toast | **PARTIAL** | placement `lib/box-model.ts:1943-1960`; timer + pause `:2027-2037`; countdown `lib/educo-ui/components.ts:271-287`; no entrance; exit `.18s` inline `lib/box-model.ts:2027` (EX-2) |
| Loaders / skeleton / progress | **GAP** | 0 hits spinner, skeleton, shimmer, `<progress`, `progressbar` |
| Count-up / badge change | **GAP** | Stat static `lib/educo-ui/registry.ts:113`; Badge static `lib/educo-ui/components.ts:56-63` |
| Carousel dots / arrows | **HAVE** (+ MR-4/16) | `lib/box-model.ts:3466`, `:3621`; `lib/box-export.ts:571` |
| Pagination, avatar group, like, copy | **GAP** | 0 hits `pagination`, `avatar` (except `components.ts:518` media variant), `clipboard`, `heart` |
| Rating | **HAVE (display)** | `lib/educo-ui/registry.ts:131-143` |
| `forced-colors` for any control | **GAP** | 0 hits (SH-7) |
| Native app spinner | **GAP (defect)** | `apps/mobile/components/ui/Spinner.tsx:34-53` infinite loops; 0 hits `accessibilityRole`/`accessibilityLabel` in the file; 0 hits `ReduceMotion`/`isReduceMotionEnabled`/`useReducedMotion` in `apps/mobile` (excl. node_modules); Reanimated 4.1 installed `apps/mobile/package.json:45` but the 8 animating files use RN `Animated` |

---

## 6. Gap list

| Id | Plain description | Sort |
|---|---|---|
| **CE-1** | The design system's own hover rules (`.eu-btn` variants, accordion header, every `:hover` in `components.ts`) are not inside `@media (hover:hover)`, so a tapped button or header stays "hovered" on a phone. Same fix as HV-1/MR-6, applied to `lib/educo-ui/components.ts` too. | **MUST** |
| **CE-2** | Button press is `translateY(1px)` (a pixel in exported CSS, Core Rule 16) and exists only on `.eu-btn`. Use `translateY(.0625rem) scale(.98)` + a 12 % state layer at an `instant` token, on every button (Button block via HV-3, Card action, Alert actions). | **MUST** |
| **CE-3** | Buttons that send something need loading → success/error states: width held, `aria-busy`, a status message in a live region, tick drawn, offline-queued wording (RULE AF). Build with the Form / application layer. | **DECIDE** (with the application layer) |
| **CE-4** | Switch component: real `<input type="checkbox" role="switch">`, thumb moved by `transform`, `base` + overshoot on position only, an on/off cue that is not colour, forced-colours styles, never `display:none` on the input. | **LATER** (component; rules recorded) |
| **CE-5** | Checkbox and radio: native inputs with `appearance:none`, tick by `stroke-dashoffset` (`slow` in, `fast` out), `<fieldset>/<legend>`, never `display:none`. | **LATER** (Form component) |
| **CE-6** | Text field: visible label that floats (`fast`), errors on `:user-invalid`/`aria-invalid` with text + icon linked by `aria-describedby`, optional ≤ 300 ms shake only after submit and never under reduce. | **LATER** (Form component) |
| **CE-7** | `.eu-input[aria-invalid]` shows the error by border colour only (`components.ts:50`) — fails 1.4.1 the day a form uses it. Add an icon / thicker border and require `.eu-error` text. | **MUST** (cheap; before any form ships) |
| **CE-8** | Tabs: one indicator moved by `transform` (or anchor positioning), `base` 200–250 ms, panel crossfade, APG keyboard. | **LATER** (Tabs component) |
| **CE-9** | Bottom sheet on phones: drag handle with pointer capture, close past 30 % or on a flick, spring back, always a Close button and Escape (2.5.7). | **LATER** (with EX-7 dialogs) |
| **CE-10** | The toast form has placement and a timer but no entrance; it should slide/fade in from its corner (`slow`, ease-out), leave faster, and be inserted into a live region that already exists so it is announced. | **DECIDE** (whether toasts appear on load or on an event) |
| **CE-11** | Loaders: skeleton (transform shimmer, final sizes), spinner, determinate/indeterminate progress, each named (`role="status"`, `aria-busy`, progressbar value), shown only after ~400 ms and for ≥ 500 ms, paused when hidden, static under reduce. Needs MR-17 first. Add `--eu-dur-loop`. | **LATER** (component) — MR-17 **MUST** first |
| **CE-12** | Stat count-up on view with the real number in the DOM, `tabular-nums`, final value under reduce; badge pop on change. | **DECIDE** |
| **CE-13** | State layers as tokens (`--eu-state-hover .08`, `--eu-state-focus .10`, `--eu-state-press .12`, `--eu-state-drag .16`) drawn with one `::before` + `currentColor`, so every component's hover/press is one rule in every theme instead of per-variant colours. | **DECIDE** |
| **CE-14** | Menu button / hamburger → X morph with `aria-expanded`, a visible "Menu" word, Escape and focus management — part of the Navigation component. | **LATER** (Navigation component, needs approval) |
| **CE-15** | Copy-to-clipboard, like, interactive rating: `aria-pressed`, a live "Copied"/count message, decorative burst `aria-hidden`, reduce = state change only. | **LATER** (application layer) |
| **CE-16** | Card flip (click only, both faces reachable, crossfade on phones/reduce) and card → detail expand via View Transitions. | **LATER** |
| **CE-17** | Avatar group lift and status dot (name in `alt`, status not colour alone). | **LATER** |
| **CE-18** | Pagination for long lists (news, events): numbered links, current page by `aria-current`, no animation needed beyond the state layer. | **LATER** |
| **CE-19** | Native app: `Spinner.tsx` loops forever with no reduce-motion check and no accessibility role/label, and no file in `apps/mobile` reads the OS reduce-motion setting. Add `accessibilityRole="progressbar"` + label, and `AccessibilityInfo.isReduceMotionEnabled()` (or Reanimated `useReducedMotion`) to every animation (spinner → static, springs → timing). Hand to 09-app-motion (AM). | **MUST** (defect) |
| **CE-20** | UAT lines for every component effect as it is built: keyboard only; touch at 360 px (no stuck hover, press visible); reduced motion on (end state, no loop); forced colours on (ring and state visible); all four themes; Slow 3G for loaders and toasts; a screen reader hears state changes (switch, busy, toast, copied). | **CHECK** |

---

## 7. Demo list for the browser pass

`docs/web-anatomy/research-runs/own-component-demos.list.json` — **8,720 live URLs**, deduplicated: uiverse element
pages 3,802 · freefrontend sources 3,794 (CodePen pens and other demo hosts) · Codrops demos and web demos 566 · motion.dev
example demos 462 · Animista group pages 75 · material-web component pages 20 · animate.style 1. Built by
`C:\Users\eyite\educo-research\src\build-demos.js` from the crawl files; links from Codrops article bodies on
`*.github.io` were dropped (mostly icon-font and unrelated links), so a few genuine github.io demos linked only from old
articles may be missing — they remain in `codrops-posts.json`.
