# Web motion, transitions and effects: a reference catalogue

This is a catalogue of the motion a school website builder should offer. It is written for Educo
(`lib/interactions.ts`, `lib/educo-ui/tokens.ts`). For each effect it records what it is, how the platform
builds it, which tokens to use, what it costs, and the accessibility rules.

**Category legend:** HOVER · FOCUS · ENTRANCE · SCROLL · PAGE · AMBIENT · FEEDBACK.

**Evidence.** §9 comes from all 366 items in the Awwwards *Transitions* collection and the 62 newest sites in
the Awwwards *Animation* category. Each live site's shipped code was fingerprinted, and 8 sites were also
driven in a real browser with and without reduced motion. The per-item table is in
[awwwards-motion-survey.md](awwwards-motion-survey.md).

Compiled 2026-09-27.

---

## 1. Sources

| Topic | URL |
|---|---|
| Transitions · Animations · `@keyframes` | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions · …/CSS_animations · …/@keyframes |
| Easing functions | https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function |
| Scroll-driven animations · range names | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations · …/Guides/Scroll-driven_animations/Timeline_range_names |
| Scroll-driven (Chrome) | https://developer.chrome.com/docs/css-ui/scroll-driven-animations |
| Scroll-driven sticky heading | https://css-tricks.com/scroll-driven-sticky-heading/ |
| View Transitions | https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API · https://developer.mozilla.org/en-US/blog/view-transitions-beginner-guide/ · https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:active-view-transition-type |
| `prefers-reduced-motion` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion |
| Performance | https://web.dev/articles/animations-guide · https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count |
| Material 3 motion (tokens) | https://m3.material.io/styles/motion/overview · https://unpkg.com/@material/web/tokens/versions/v0_192/_md-sys-motion.scss |
| Carbon motion (tokens) | https://carbondesignsystem.com/elements/motion/overview/ · https://unpkg.com/@carbon/motion/lib/index.js |
| WCAG 2.2.2 · 2.3.1 · 2.3.3 | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html · …/three-flashes-or-below-threshold.html · …/animation-from-interactions.html |
| Lenis | https://github.com/darkroomengineering/lenis |
| Awwwards | https://www.awwwards.com/awwwards/collections/transitions/ · https://www.awwwards.com/websites/animation/ |

---

## 2. Platform primitives

- **`transition`** runs on a state change such as `:hover`, `:focus-visible` or a class. It suits hover,
  focus and feedback.
  - `@starting-style` together with `transition-behavior: allow-discrete` animates first render and
    `display` changes. That gives an entrance with no keyframes.
- **`@keyframes` + `animation`** is for multi-step or looping motion.
  - Use `fill-mode: both` so the first frame holds through a stagger delay.
- **Easing**
  - `cubic-bezier()`. The y value may overshoot.
  - `linear(…stops)` gives springs and bounces in pure CSS.
  - `steps()` gives discrete frames.
  - Keyword curves: `ease` = (.25,.1,.25,1), `ease-out` = (0,0,.58,1), `ease-in-out` = (.42,0,.58,1).
- **Scroll-driven animations** run a normal animation on a scroll timeline instead of time, off the main
  thread. See §8.
- **View Transitions** snapshot two states and animate between them, within a page or across pages. See §7.
- **WAAPI** (`el.animate()`) is the same engine with a JS handle. It also accepts `ScrollTimeline` and
  `ViewTimeline`.
- **Performance** (web.dev)
  - Animate only `transform` and `opacity`. `filter` is acceptable on small elements.
  - `top`, `left`, `width`, `height` and `margin` cause layout. `box-shadow` and `background` cause paint.
  - Apply `will-change` just in time and remove it afterwards.
  - Find jank with DevTools: the Performance panel, Paint Flashing and Layers.
  - Never write styles from a `scroll` listener.

### Accessibility baseline

| SC | Level | Rule |
|---|---|---|
| **2.2.2 Pause, Stop, Hide** | A | Anything that **starts automatically, moves for more than 5 s and sits beside other content** needs pause/stop/hide, or must stop within 5 s. Auto-updating content (tickers, auto carousels) needs a control however long it runs. |
| **2.3.1 Three Flashes** | A | No more than 3 flashes in any second, unless below the general and red thresholds. The small-area limit is about **341 × 256 CSS px**. |
| **2.3.3 Animation from Interactions** | AAA | Interaction-triggered motion can be switched off unless it is essential. Opacity, colour and blur that do not change perceived size or position are *not* motion. |

`prefers-reduced-motion: reduce` does **not** mean "no animation". MDN says to replace scaling, panning and
large movement with gentler fades.

---

## 3. Proposed token set

The references first:

- **Material 3**
  - Durations: short 50–200 ms, medium 250–400 ms, long 450–600 ms, extra-long 700–1000 ms, in 50/100 ms
    steps.
  - Easings: `standard` (.2,0,0,1), `standard-decelerate` (0,0,0,1), `standard-accelerate` (.3,0,1,1),
    `emphasized-decelerate` (.05,.7,.1,1), `emphasized-accelerate` (.3,0,.8,.15), `legacy` (.4,0,.2,1).
- **Carbon**
  - Durations: 70 / 110 / 150 / 240 / 400 / 700 ms.
  - Easings:

    | Easing | Productive | Expressive |
    |---|---|---|
    | standard | (.2,0,.38,.9) | (.4,.14,.3,1) |
    | entrance | (0,0,.38,.9) | (0,0,.3,1) |
    | exit | (.2,0,1,.9) | (.4,.14,1,1) |

Both systems agree on three rules: **enter decelerates and exit accelerates**, exits are shorter, and
duration grows with distance.

Award sites (§9) lean harder on strong ease-outs: easeOutExpo (.19,1,.22,1) and (.16,1,.3,1), and
easeOutQuint (.22,1,.36,1), at 0.8–1.2 s for reveals and 0.2–0.4 s for hover.

```css
:root {
  --eu-dur-instant: 70ms;  --eu-dur-fast: 120ms;  --eu-dur-base: 200ms;   /* toggles · colour/focus · hover */
  --eu-dur-slow: 320ms;    --eu-dur-slower: 500ms;                         /* menus, accordions · sections, modals */
  --eu-dur-reveal: 800ms;  --eu-dur-page: 400ms;  --eu-dur-stagger: 60ms;  /* hero/text reveal · page change · per item */
  --eu-ease-standard:   cubic-bezier(0.2, 0, 0, 1);      /* M3 standard: state changes */
  --eu-ease-out:        cubic-bezier(0, 0, 0.2, 1);      /* entrances */
  --eu-ease-in:         cubic-bezier(0.4, 0, 1, 1);      /* exits */
  --eu-ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);    /* start and end at rest */
  --eu-ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1); /* M3 emphasized-decelerate */
  --eu-ease-expo-out:   cubic-bezier(0.16, 1, 0.3, 1);   /* the award-site reveal curve */
  --eu-ease-overshoot:  cubic-bezier(0.2, 0, 0, 1.2);    /* small playful pop */
  --eu-ease-spring: linear(0, 0.035 2.1%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.077, 1.149 27.3%,
                           1.163, 1.154 36.5%, 1.036 49.1%, 0.977, 0.973 67.9%, 1.003 85.1%, 1);
}
@media (prefers-reduced-motion: reduce) { :root { --eu-dur-stagger: 0ms; --eu-dur-reveal: var(--eu-dur-base); } }
```

**Rules for the tokens:**

- An exit takes about 0.75 × the entrance duration.
- A stagger is capped at about 8 items, or 500 ms in total.
- Anything scroll-linked uses `linear`.
- Durations are time, not length, so the units hierarchy does not apply to them.

**Naming note.** Educo's existing `emphasized` is (.2,0,0,1.2). That curve overshoots and is *not* Material's
emphasized. Rename it to `overshoot`, as above.

---

## 4. The catalogue

The "seen" counts come from §9. **T** is the number of Transitions-collection titles that name the effect
(out of 366). **S** is the number of the 300 live sites whose code contains the library or feature.

**Hover lift / grow / press — HOVER + FOCUS**

- **Look:** a card rises `translateY(-.25rem)`, grows `scale(1.03)`, or presses to `scale(.98)`.
- **Build:** a transition on `transform`.
  - Trigger on `:hover` **and** `:focus-visible` (or `:focus-within` for a card that contains a link).
  - Gate with `@media (hover:hover)` so touch doesn't stick.
- **Tokens:** `base` + `standard`; press uses `instant`.
- **Performance:** fade a pre-drawn shadow on `::after` rather than animating `box-shadow`.
- **Reduced motion:** keep the colour and shadow, drop the translate and scale.

**Glow / outline / brighten / colour — HOVER · FOCUS · FEEDBACK**

- **Build:** transitions on colour, `outline-color` or `filter`, with `fast` + `standard`.
- **Performance:** paint only, which is fine at control size.
- **Accessibility:** not motion under 2.3.3. Focus contrast must still pass in every theme.

**Tilt / 3D card, magnetic button, custom cursor — HOVER** (T 16 hover/cursor titles)

- **Build:** JS `pointermove` writes `--rx`/`--ry` or a translate inside rAF. A custom cursor is lerped
  (0.15–0.2 per frame) with `pointer-events:none`.
- **Tokens:** returns use `slow` + `spring`.
- **Accessibility:**
  - Off under `reduce` and `(pointer:coarse)`.
  - Cap tilt at about 8°.
  - Never hide the system cursor without an equivalent.
  - The cursor element is `aria-hidden`.

**Image zoom / Ken Burns — HOVER · AMBIENT**

- **Build:**
  - Hover zoom: `scale(1.06)` inside `overflow:clip`, with `slower` + `expo-out`.
  - Ken Burns: `@keyframes` scale/translate over 12–20 s, `alternate`.
- **Accessibility:** Ken Burns is auto-play longer than 5 s, so under 2.2.2 it must either run once and stop
  or have a pause control. Show it static under `reduce`.

**Fade / rise / slide / zoom / blur entrance — ENTRANCE**

- **Build:**
  1. On first render: `@starting-style`.
  2. In view: `animation-timeline: view(); animation-range: entry 0% cover 30%`.
  3. Where `@supports not (animation-timeline: view())`: an IntersectionObserver fallback. It was found in
     177 of 300 live sites.
- **Tokens:** `slower` + `out`; the hero uses `reveal` + `expo-out`.
- **Accessibility:**
  - Fade only under `reduce`.
  - **The hidden `from` state lives only inside the supported or observed branch**, so content never
    depends on JS to appear.
- Educo's `REVEAL_EFFECTS` already uses `entry 0% cover 28%`.

**Staggered entrance — ENTRANCE**

- **Build:** `animation-delay: calc(var(--i) * var(--eu-dur-stagger))`, with `--i` emitted by the exporter.
  For scroll-linked stagger, offset each `animation-range` instead.
- **Accessibility:** stagger 0 under `reduce`. Order follows the DOM and reading order.

**Text split / line / word / char reveal — ENTRANCE · SCROLL** (S: SplitText-type libraries in 98/300; T 10)

- **Build:**
  - Split at export into spans inside `overflow:clip` line masks.
  - Animate `translateY(100%) → 0` with a 30–60 ms stagger.
  - The scroll "fill" variant drives colour or opacity per word with `view()`.
- **Accessibility:**
  - Keep the real string accessible (parent `aria-label` or visually-hidden text), with the spans
    `aria-hidden`.
  - Never split body copy.
  - Static under `reduce`.

**Typewriter — ENTRANCE · AMBIENT**

- **Build:** `steps(N)` on `clip-path: inset()`, or JS for cycling phrases.
- **Tokens:** 40–80 ms per character.
- **Accessibility:**
  - The full text is in the accessible name.
  - The caret blink stops within 5 s.
  - A cycling typewriter is auto-updating content and needs a pause control.

**Counter roll-up — ENTRANCE · FEEDBACK**

- **Build:** IntersectionObserver plus a rAF tween, or CSS `@property --n {syntax:'<integer>'}` with
  `counter-reset`.
- **Tokens:** 1–2 s, `out`.
- **Layout:** reserve the width with `tabular-nums`.
- **Accessibility:** the final value is in the DOM from the start. Instant under `reduce`.

**Parallax — SCROLL**

- **Build:** a `view()` timeline on `translate`, about ±10–15%. Never `background-attachment: fixed`: it
  repaints, and iOS ignores it.
- **Accessibility:** **the classic vestibular trigger.** Turn it off entirely under `reduce`, and never
  parallax text people must read.

**Progress bar, sticky scroll-telling, horizontal scroll, sticky heading — SCROLL** — see §8.

**Smooth scroll (Lenis / Locomotive) — SCROLL** (S: 98/300 sites, 85 Lenis)

- **Build:**
  - Lenis wraps native scroll (`lerp` 0.1), keeping sticky, anchors and accessibility.
  - CSS `scroll-behavior:smooth` covers anchor jumps only; guard it with `no-preference`.
- **Reduced motion:** Lenis turns smoothing off under `reduce` by default. Measured on cuberto.com: the
  `lenis-smooth` class was removed and the wheel jumped instantly.
- **Builder guidance:** offer it as a site-level opt-in.

**Marquee / ticker — AMBIENT**

- **Build:**
  - Duplicate the content once (the copy `aria-hidden` + `inert`) and translate `0 → -50%` linearly.
  - Pause on `:hover` and `:focus-within`.
- **Accessibility:** **2.2.2 applies directly.**
  - A visible Pause/Play button is required; hover-pause alone does not satisfy it.
  - Static and wrapping under `reduce`.

**Auto carousel / slideshow — AMBIENT · FEEDBACK** (T 49 image/gallery/slideshow titles)

- **Build:** a cross-fade or mask wipe between slides.
- **Timing:** dwell ≥ 5 s; the change itself `slower` + `in-out`.
- **Accessibility:**
  - A pause control (2.2.2).
  - Stop on hover, focus or any interaction.
  - No auto-advance under `reduce`.

**Loader / skeleton / intro curtain — FEEDBACK · PAGE** (T 10 loader/intro; S: Lottie in 59/300)

- **Build:** a spinner (rotate), a shimmer (`::after` translate), and a curtain wipe (`clip-path` or
  `translateY(-100%)`) at `reveal` + `in`.
- **Accessibility:**
  - `role="status"` / `aria-busy`.
  - Static under `reduce`.
  - **Never hold content longer than the real load.**

**Page transitions — PAGE** (T ≥ 64 page/project titles, plus up to 164 titled only "Transition"; S: 108/300 ship a page-transition library or View Transitions)

- **Build:**
  - Cross-fade, slide, mask wipe or shared-element morph.
  - The zero-JS route is the View Transitions API (§7).
  - The award sites mostly use Barba (50), Swup (12), Highway (4), or View Transitions (48 referenced).
- **Tokens:** `page` (300–400 ms), `standard`.
- **Accessibility:** focus lands on the new `<main>` or `h1`. Plain navigation under `reduce`.

**Mask / clip wipe — PAGE · ENTRANCE** (T 48: radial, diagonal, blind, bar, dot, concentric, split)

- **Build:** animate `clip-path: circle()/inset()/polygon()` on a colour curtain or on the incoming page (as a
  VT `::view-transition-new` animation).
- **Tokens:** `slower`–`reveal` with `expo-out` or `in-out`.
- **Performance:** clip-path is composited in modern Chromium.
- **Accessibility:** a large wipe is motion; use a cross-fade under `reduce`. A full-screen colour flip must
  not repeat 3 or more times a second (2.3.1).

**Colour-field transition — PAGE · AMBIENT** (T 25)

- **What:** a solid or gradient panel sweeps across between states.
- **Build:** a mask wipe on a themed token colour.
- **Accessibility:** check contrast of any text shown over it.

**Overlay menu open — FEEDBACK** (T 42 menu/nav titles, the second-largest named group)

- **Build:**
  - A full-screen panel entering by clip-path or translate, with links staggered in.
  - Use `<dialog>` or `popover` with `@starting-style` + `allow-discrete` for the entry and exit.
- **Tokens:** open `slow`–`slower` + `expo-out`; close at 0.75 ×.
- **Accessibility:**
  - Focus trapped inside and returned on close.
  - `aria-expanded`; Escape closes it.
  - Fade only under `reduce`.

**Accordion / disclosure — FEEDBACK**

- **Build:** `<details>` + `::details-content` with `interpolate-size: allow-keywords`, or
  `grid-template-rows: 0fr → 1fr`.
- **Tokens:** `slow` + `standard`.
- **Accessibility:** instant under `reduce`.

**Ripple / success tick / shake — FEEDBACK**

- **Build:** a pseudo-element `scale` + fade at the pointer coordinates; SVG `stroke-dashoffset` for the
  tick; 3–4 `translateX` keyframes for the shake.
- **Accessibility:** never motion-only. The error text is linked with `aria-describedby`, and success is
  announced with `role="status"`.

**Shader distortion (smoke, liquid, pixel, glitch, blur) — PAGE · HOVER · AMBIENT** (T 37; S: WebGL in 112/300, three.js 91, PIXI 11)

- **Build:** a WebGL canvas behind or over the content, animating a displacement or noise uniform across
  two textures.
- **Performance:** the heaviest item here.
  - Lazy-load it and cap DPR at 1.5–2.
  - Pause when off-screen or the tab is hidden.
  - A static poster image is the LCP element.
- **Accessibility:**
  - `aria-hidden`.
  - A pause control if it runs more than 5 s.
  - **Glitch and pixel effects are the likeliest to breach 2.3.1**, so cap flicker below 3 Hz.
  - A poster under `reduce`.
- **Builder guidance:** curated presets only, never arbitrary shaders.

**3D flip / zoom / spin / tunnel — PAGE** (T 28)

- **Build:** CSS `perspective` + `rotateY` for a page flip; `scale` for zoom-through; WebGL for tunnels.
- **Accessibility:** this is the strongest vestibular motion in the set; cross-fade under `reduce`.

**Animated gradient / grain — AMBIENT**

- **Build:** animate a typed `@property --angle`, or transform an oversize gradient layer. Grain is a static
  SVG `feTurbulence` tile.
- **Accessibility:**
  - Keep luminance swings small (2.3.1).
  - Pause under `reduce`.
  - Check contrast against the worst frame.

**Glassmorphism — AMBIENT (treatment)**

- **Build:** `backdrop-filter: blur(1rem) saturate(1.4)`, with an opaque `@supports` fallback.
- **Performance:** expensive, so keep it to small or fixed surfaces.
- **Accessibility:** tint enough to keep 4.5:1. Honour `prefers-reduced-transparency` and `forced-colors`.

**Focus ring transition — FOCUS**

- **Build:** transition `outline-offset` with `fast` + `out`.
- **Accessibility:** the ring appears **immediately**, and the animation only embellishes it.

---

## 5. Summary matrix

| Effect | Category | CSS-only? | Moves (needs reduce fallback) | 2.2.2 control |
|---|---|---|---|---|
| Lift / grow / press | HOVER, FOCUS | yes | yes | – |
| Glow / colour / focus ring | HOVER, FOCUS, FEEDBACK | yes | no | – |
| Tilt / magnetic / cursor | HOVER | no | yes | – |
| Zoom / Ken Burns | HOVER, AMBIENT | yes | yes | Ken Burns > 5 s |
| Entrance / stagger | ENTRANCE | yes (`@starting-style`, `view()`) | yes (fade: no) | – |
| Text split / typewriter / counter | ENTRANCE, SCROLL | mostly | yes / yes / no | cycling typewriter |
| Parallax / progress / sticky / horizontal | SCROLL | yes | yes (progress: minor) | – |
| Smooth scroll | SCROLL | anchors only | yes | – |
| Marquee / auto carousel | AMBIENT | partly | yes | **yes** |
| Loader / curtain | FEEDBACK, PAGE | yes | yes | if > 5 s |
| Page transition / mask wipe / colour field | PAGE | yes (§7) | yes | – |
| Overlay menu / accordion / ripple | FEEDBACK | yes | minor | – |
| Shader / WebGL / 3D flip | PAGE, AMBIENT | no | yes | **yes** if looping |
| Gradient / grain / glass | AMBIENT | yes | low | if moving > 5 s |

---

## 6. Rules the builder should enforce by construction

1. **Every effect is data** carrying `category`, `moves`, `loops` and a `reduced` variant. The **exporter**
   decides the media-query wrapping, not the author.
2. Moving effects are emitted under `(prefers-reduced-motion: no-preference)`, and their reduced variant
   under `reduce`. The canvas gets a "preview reduced motion" toggle, so the canvas matches the export.
3. Looping or auto-playing effects get an accessible Pause/Play control in the export, or stop within 5 s.
   Hover-pause is never the control.
4. There are no flashing presets. Any user-set rate is validated against 3 per second and the
   341 × 256 CSS px area.
5. Scroll, entrance and ambient presets use only compositor properties.
6. Content never depends on motion: the hidden `from` state lives only inside `@supports` or the observer.
7. Hover effects also fire on `:focus-visible`, and are gated by `(hover:hover)`.
8. CSS-only effects are free to offer. JS-backed ones (tilt, Lenis, WebGL) load lazily, and only on pages
   that use them.

---

## 7. View Transitions

The API snapshots the old state, applies the change, and animates between the old and new snapshots. It works
in two modes:

- **Same-document (SPA), level 1:** `document.startViewTransition(() => updateDOM())`, or
  `startViewTransition({ update, types: ['forwards'] })`. It returns a `ViewTransition` with
  `ready` / `finished` promises.
- **Cross-document (MPA), level 2:** needs **no JS**. Put `@view-transition { navigation: auto; }` in the
  CSS of **both** pages. It works for same-origin navigations only. Unsupported browsers simply navigate,
  which is progressive enhancement for free.

**Naming**

- `view-transition-name: hero` pairs one element across the old and new states. Each name **must be unique
  on the page**, or the transition is skipped.
- `view-transition-class: card` styles many named elements with one rule.
- `view-transition-scope` (MDN) isolates a subtree.

**The pseudo-element tree.** Each named element gets its own group; `root` is the whole page.

```
::view-transition
└─ ::view-transition-group(name)          ← animates size and position (the morph)
   └─ ::view-transition-image-pair(name)  ← isolation: blend old and new
      ├─ ::view-transition-old(name)      ← static screenshot, default: fade out
      └─ ::view-transition-new(name)      ← live new state, default: fade in (mix-blend-mode: plus-lighter)
```

**Types** label a transition, so the CSS can pick an animation.

- Set them with `startViewTransition({types})`, with `@view-transition { navigation:auto; types: slide; }`,
  or in `pageswap` / `pagereveal` via `e.viewTransition.types.add('backwards')`.
- Match them with `html:active-view-transition-type(forwards)`. A comma-separated list means OR; chaining
  the selectors means AND.
- MDN lists this as Baseline 2026.

**Support** (MDN blog):

| Level | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Level 1 (same-document) | yes | yes | 144+ |
| Level 2 (cross-document) | 126+ | 18.2+ | in progress |

### Copy-ready patterns for the exported site

The export is static, so each pattern below is pure CSS.

```css
/* 0 · Opt in on every exported page, only when motion is welcome */
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}

/* 1 · Fade (the default cross-fade, retimed to the tokens) */
::view-transition-old(root), ::view-transition-new(root) {
  animation-duration: var(--eu-dur-page); animation-timing-function: var(--eu-ease-standard);
}

/* 2 · Slide: new page in from the right, old page out to the left */
@keyframes eu-out-left { to   { transform: translateX(-30%); opacity: 0; } }
@keyframes eu-in-right { from { transform: translateX(30%);  opacity: 0; } }
html:active-view-transition-type(forwards)::view-transition-old(root) { animation: eu-out-left var(--eu-dur-page) var(--eu-ease-in) both; }
html:active-view-transition-type(forwards)::view-transition-new(root) { animation: eu-in-right var(--eu-dur-page) var(--eu-ease-out) both; }
/* the type comes from @view-transition { navigation:auto; types: forwards; } per page, or a 3-line pagereveal script for back/forward */

/* 3 · Shared-element morph: news card → article page */
/* list page:    <img class="card-img" style="view-transition-name: news-42"> (unique per card) */
/* article page: <img class="hero-img" style="view-transition-name: news-42">                     */
.card-img, .hero-img { view-transition-class: news-image; }
::view-transition-group(*.news-image) { animation-duration: var(--eu-dur-slower); animation-timing-function: var(--eu-ease-emphasized); }
::view-transition-old(*.news-image), ::view-transition-new(*.news-image) { height: 100%; object-fit: cover; } /* keep aspect while morphing */

/* 4 · Mask-wipe page change (the most common award-site kind, §9) */
@keyframes eu-wipe { from { clip-path: circle(0 at 50% 50%); } to { clip-path: circle(75% at 50% 50%); } }
::view-transition-old(root) { animation: none; }
::view-transition-new(root) { animation: eu-wipe var(--eu-dur-reveal) var(--eu-ease-expo-out); }

/* 5 · Keep the header still while the page changes */
.site-header { view-transition-name: site-header; }
::view-transition-group(site-header) { animation: none; }
```

**Notes for Educo's exporter**

- The exporter already knows which list card links to which detail page. It can emit a matching
  `view-transition-name` on both, for example `news-<id>` on the card image and on the article hero, with no
  JS at all.
- Reduced motion is handled by rule 0: users who ask for it get plain navigation.
- Only a few morphs per page. Each name is a snapshot, and too many cost memory.
- A direction-aware slide (back versus forward) needs the small `pagereveal` script, or plain CSS types per
  section.
- Keep durations ≤ 400 ms, because the new page cannot be used until the transition ends.
- Focus behaves as in a normal navigation.
- The canvas cannot preview a cross-document transition. The builder's Preview (real export, two pages)
  can, so it belongs in the Preview UAT.

---

## 8. Scroll-driven & sticky

**Mechanics**

- `animation-timeline: scroll(root|nearest|self, block|inline)` tracks the scroller's progress.
- `animation-timeline: view()` tracks an element crossing its scrollport.
- `animation-range` picks the segment, using the range names:
  - `cover`: from first pixel in to last pixel out (the default).
  - `contain`: while the element is fully inside.
  - `entry` / `exit`: while it crosses in or out.
  - `entry-crossing` / `exit-crossing`: while it crosses the end or start edge.
  - Offsets work too, e.g. `entry 0% cover 30%`.
- **Named timelines:** `scroll-timeline: --page` or `view-timeline: --step1` on the source element, then
  `animation-timeline: --step1` on any element. When the two are not ancestor and descendant, hoist the
  name with `timeline-scope: --step1` on a common ancestor.
- Declare `animation-timeline` **after** the `animation` shorthand, because the shorthand resets it.
- Use `linear` easing, because the scroll is the clock.
- **Support:** Chrome/Edge 115+ and Safari 26+; Firefox behind a flag.
- Always gate with `@supports (animation-timeline: scroll())`.
- On the award sites, only 22 of 300 live sites use CSS scroll timelines; 118 still use GSAP ScrollTrigger.
  The platform now covers most of what ScrollTrigger is used for.

### The scroll-driven sticky heading (CSS-Tricks)

**What it looks like.** A single `position: sticky` heading sits at the top. As you scroll through the
sections, it *types out* each section's title ("Primary Colors" → "Red Power" → …).

**How it works**

- `::after { content: '' }` is animated with `animation-timing-function: step-end` on
  `animation-timeline: scroll()`.
- Its keyframes change the discrete `content` property about 1% per character: deleting the old title, then
  typing the new one.
- The real headings stay in each section, visually hidden (`.srOnly`). The sticky copy is
  `aria-hidden="true"`, so screen readers get proper headings.
- The whole effect sits inside
  `@media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: scroll()) { … } }`, and
  the sticky heading is `display: none` outside it. **Fallback, reduced motion and accessibility are
  therefore the same branch**: without support, users see normal headings.
- A debugging aid: a registered `@property --scroll-position` with `steps(100)` on `scroll()`, printed with
  `counter()`, shows the percentage where each keyframe should sit.

**Gotchas**

- The percentages are magic numbers tied to page length, so it suits static pages.
- `content` does not interpolate.
- **Improvement for a builder:** replace the magic numbers with **named `view-timeline`s per section plus
  `timeline-scope`**, so each title swap is tied to its own section, not to a page percentage.

### Related patterns worth storing

```css
@media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: scroll()) {

  /* A · Reading progress bar (in a pinned bar) */
  .eu-progress { transform-origin: 0 50%; animation: eu-grow linear both; animation-timeline: scroll(root); }
  @keyframes eu-grow { from { transform: scaleX(0); } }

  /* B · Shrinking sticky header: full size at top, compact after 12rem of scroll */
  .eu-sticky-header { position: sticky; top: 0; animation: eu-shrink linear both;
                      animation-timeline: scroll(root); animation-range: 0 12rem; }
  @keyframes eu-shrink { to { padding-block: .5rem; box-shadow: var(--eu-shadow-md); } }

  /* C · Section-linked nav highlight: each section publishes a timeline the pinned nav reads */
  body { timeline-scope: --s-about, --s-news; }
  #about { view-timeline: --s-about; }   #news { view-timeline: --s-news; }
  .nav a[href="#about"] { animation: eu-current linear both; animation-timeline: --s-about; animation-range: contain; }
  .nav a[href="#news"]  { animation: eu-current linear both; animation-timeline: --s-news;  animation-range: contain; }
  @keyframes eu-current { 0%, 100% { color: var(--eu-color-primary-700); text-decoration-line: underline; } }

  /* D · Reveal on scroll: see the entrance entry in §4 */
}}

/* E · Stuck-state styling: style a sticky block only while it is stuck (scroll-state container queries, Chromium 133+) */
.eu-sticky { position: sticky; top: 0; container-type: scroll-state; }
@container scroll-state(stuck: top) { .eu-sticky > * { box-shadow: var(--eu-shadow-md); background: var(--eu-surface); } }
```

- **Pattern C:** the highlight is also conveyed by an underline, not by colour alone. Give the link the real
  `aria-current` state with a tiny IntersectionObserver.
- **Pattern E:** this is not motion, so it needs no reduced-motion guard. Browsers without support simply do
  not apply the style.

### Pinned scroll-telling and horizontal scroll

- **Pinned scroll-telling:** a sticky pane inside a tall parent (`height: calc(var(--steps) * 100svh)`).
  Each step's `view-timeline` drives the pane through `timeline-scope`.
- **Horizontal scroll:** a sticky track animating `translateX` over `animation-range: contain` of its tall
  parent.
  - Prefer a native `overflow-x` scroller with `scroll-snap`, which keyboard and touch users can drive.
  - With a transform track, `scrollIntoView` panels on focus.
- **Under `reduce`:** keep sticky layout that is purely positional, swap stepped visuals with fades, and let
  the horizontal section become a vertical stack.

### How this maps to Educo's sticky block ("Sticks when reached") and pinned bars

| Pattern | Applies to sticky block | Applies to pinned bar | Note |
|---|---|---|---|
| E Stuck-state styling | **yes** — shadow or background only while stuck | yes | no motion; best first addition |
| B Shrinking header | **yes** (top-stuck header) | yes | `animation-range: 0 <rem>` |
| A Progress bar | as a child of the sticky block | **yes** | decorative, `aria-hidden` |
| Sticky heading swap | **yes** (a sticky title block over sections) | – | needs visually-hidden real headings |
| C Nav highlight | if the nav is sticky | **yes** | needs `timeline-scope` on the page root |
| Pinned scroll-telling | **yes** (a sticky pane beside a stack of steps) | – | tall parent sized in `svh` |
| Horizontal scroll | – | – | a section type of its own |

---

## 9. Awwwards evidence: the Transitions collection and the Animation category

### Method

**Sources read on 2026-09-27**

- The **Transitions collection**: 12 pages, **366 items**, 343 distinct sites, 8 listed with no URL.
- The **Animation category**: pages 1–2, the **62 newest sites**, including three Sites of the Day from
  September 2026 (Meer Mohsin, Sobha Privy Collection, Noho).
- Awwwards pages were requested one at a time.

**Fingerprinting.** Each site was fetched once: its HTML plus up to 12 linked JS/CSS files. The code was
searched for libraries, platform features, `prefers-reduced-motion`, and the most frequent easings.
**300 of the 405 sites were reachable.** The rest are dead: many collection items date from 2014–2019.

**Browser measurement.** Eight sites were then driven in Playwright, with reduced motion off and then on. The
measures were running animations, computed transition durations and easings, and scroll behaviour.

**Limits**

- A fingerprint shows what the code *contains*, not what a visitor sees.
- Framework runtimes (Framer, Next.js) can bundle View Transitions or Lenis strings unused. Those counts are
  upper bounds.
- "Kind" comes from the item title. 164 titles say only "Transition"; the demo videos were not watched, so
  those 164 are left unclassified. Awwwards files most of them under page transitions, but that is not
  verified here.

### Transitions collection — kinds by title (366 items)

| What changes | Items | How it is done | Items |
|---|---|---|---|
| Page / project to page | 64 (+ 164 untitled "Transition") | Mask / clip wipe (radial, diagonal, blind, bar, dot, split) | 48 |
| Image / gallery / slideshow / product | 49 | Shader distortion (smoke, liquid, pixel, glitch, blur, blob) | 37 |
| Menu / overlay navigation | 42 | 3D flip / zoom / spin / tunnel | 28 |
| 3D / WebGL scene | 35 | Colour field / gradient | 25 |
| Scroll-linked | 22 | SVG / type morph | 3 |
| Hover / cursor / click / drag | 16 | | |
| Loader / intro / enter | 10 | | |
| Text / typography | 10 | | |

### Both sets combined — technique found in shipped code (300 live sites)

| Technique | Sites | Share | Catalogue entry |
|---|---|---|---|
| JS tween engine (GSAP 159, anime 3, Motion 9) | 169 | 56% | all time-based effects |
| IntersectionObserver (reveal / lazy triggers) | 177 | 59% | entrance fallback |
| GSAP ScrollTrigger (scroll-linked) | 118 | 39% | §8; parallax |
| WebGL (three.js 91, PIXI 11, OGL 1) | 112 | 37% | shader distortion, WebGL background |
| Page-transition library or View Transitions (Barba 50, VT 48, Swup 12, Highway 4) | 108 | 36% | page transitions, §7 |
| Text splitting (SplitText / SplitType / Splitting) | 98 | 33% | text split reveal |
| Smooth scroll (Lenis 85, Locomotive 14) | 98 | 33% | smooth scroll |
| Lottie / Rive (loaders, icons, micro-interactions) | 60 | 20% | loader, feedback |
| CSS scroll timelines (`animation-timeline`, `ScrollTimeline`) | 22 | 7% | §8 |
| `prefers-reduced-motion` present in code | 116 | **39%** | §2 |

**Reduced-motion support has improved sharply.** The 2026 Animation category ships a reduced-motion query in
**47 of 60** sites (78%), against 69 of 240 (29%) in the mostly older Transitions collection. View
Transitions show the same shift: 30 of 60 new sites reference them, against 18 of 240 older sites.

**Most frequent easings found.** Counts are sites where the curve is among that site's 3 most frequent
easings, out of 300 live sites.

| Curve | Name | Sites |
|---|---|---|
| GSAP `power1.inOut` / `power2.out` / `power3.out` / `power2.inOut` / `expo.out` | GSAP eases | 48 / 47 / 34 / 28 / 22 |
| `cubic-bezier(.4,0,.2,1)` | M3 legacy / Tailwind | 47 |
| `(.19,1,.22,1)` · `(.16,1,.3,1)` | easeOutExpo | 24 · 16 |
| `(.22,1,.36,1)` | easeOutQuint | 20 |
| `(.215,.61,.355,1)` · `(.645,.045,.355,1)` | easeOutCubic · easeInOutCubic | 24 · 20 |
| `(1,0,0,1)` · `(.77,0,.175,1)` | expo in-out | 22 · 13 |

The `--eu-ease-expo-out` token in §3 comes from this.

### Measured in a browser (Playwright, reduced motion off → on)

| Site (source) | What it is | Built with | Timing read from computed styles | Under `reduce` |
|---|---|---|---|---|
| cydstumpel.nl (Transitions: "Default page transition") | page transition + reveals | **Swup in native View Transitions mode** (`swup-native`), Lenis, GSAP | 0.3–0.4 s, `cubic-bezier(.25,1,.5,1)` | 61 reduced-motion rules; running animations **79 → 30**. Honoured |
| cuberto.com (Transitions: "Interactive Transition") | hover, magnetic cursor, reveals | Lenis, GSAP | 1.2 s and 0.4–0.8 s, `cubic-bezier(.16,1,.3,1)` | Lenis drops smoothing, scroll jumps instantly. Partly honoured |
| meermohsin.me (Animation, SOTD 26 Sep 2026) | WebGL hero, split-text reveals | GSAP + ScrollTrigger + SplitText, Lenis, three.js | 0.3–0.45 s, `ease` and `(.22,1,.36,1)` | no query in code; same 45 animations run. **Not honoured** |
| noho.ink (Animation, SOTD 18 Sep 2026) | WebGL-driven scenes | Webflow, Lenis, canvas | no CSS transitions (all JS) | unchanged. Not honoured |
| blueyard.com (Transitions: "Enter transition") | intro and enter | canvas, CSS | 0.4–0.5 s, `cubic-bezier(0,0,0,1)` and `(.33,0,.2,1)` | unchanged |
| magnetism.fr (Transitions: "sticky cursor menu") | magnetic cursor, menu | Lenis | 0.5 s, `(.19,1,.22,1)` | one reduced-motion rule; transitions unchanged |
| zajno.com (Transitions: "Scroll and transitions") | scroll scenes | canvas | 0.25 s, `(.215,.61,.355,1)` | unchanged |
| superlist.com (Transitions: "Smoothly loading") | loading transition | Framer | 0.2 s, `(.44,0,.56,1)` | unchanged |

### What this means for the builder

1. **Page transitions and mask wipes are the core of the collection.** The platform can now deliver both
   with zero JS: cross-document View Transitions plus `clip-path` keyframes (§7 patterns 1–4). Offer those
   before anything that needs a library.
2. **Overlay-menu transitions are the second-largest named kind** (42). Build them on `<dialog>` or
   `popover` with `@starting-style`.
3. **Text splitting (33%) and smooth scroll (33%) are common across the whole set.** Both can be done
   accessibly: split at export with an accessible label, and Lenis as an opt-in that honours reduced motion.
4. **WebGL and shader distortion is a third of the sample.** It is out of scope for a school builder beyond a
   few curated, pausable presets with a poster fallback.
5. **Most award sites still ignore reduced motion**, including both September 2026 SOTDs measured. Educo
   should do better *by construction* (§6 rule 2), rather than copying what the award sites do.
