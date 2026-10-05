# 06 · Motion rules — accessibility, tokens and performance on low-cost phones

The rules every animation in the builder and in an exported page obeys: WCAG 2.3.3, 2.2.2 and 2.3.1; what
`prefers-reduced-motion: reduce` should *mean*; a visitor-facing motion switch; motion tokens (durations, easings,
`linear()` springs) compared across design systems; and the cost of motion on a low-cost Android phone. Each rule is
marked against the builder (HAVE / PARTIAL / GAP) with file:line evidence. Gaps are numbered **MR-n**.

Compiled 2026-10-02. **This extends** [../motion-effects.md](../motion-effects.md), which already holds: a one-table
summary of 2.2.2 / 2.3.1 / 2.3.3 (§2), "reduce does not mean no animation" (§2), the Material 3 cubic-bezier and
duration tokens and the Carbon tokens (§3), a proposed `--eu-*` token set with a `linear()` spring (§3), the
compositor-only rule and "no styles from a scroll listener" (§2), and eight by-construction rules (§6).
**New here:** the WCAG Understanding pages and C39 read in full (what counts as motion, what "essential" means, what
a pause control must be); Apple's reduced-motion criteria; Atlassian and Polaris tokens; Material's **spring** tokens
with `linear()` equivalents computed from their physics; a visitor motion switch; low-end device numbers (Nigeria's
network, the 2026 baseline phone); the content-visibility / layer / layout-thrash costs; and a code-verified audit
that finds where the builder breaks its own rules.

---

## Sources and completeness

| Source | What it holds | Read | Not read (why) |
|---|---|---|---|
| W3C Understanding 2.3.3 Animation from Interactions | intent, motion vs not motion, "essential", benefits, examples, techniques C39 / SCR40 / Gx | all | – (SCR40 read in the redo, below) |
| W3C Technique C39 | description, two CSS forms, test procedure, expected result | all | – |
| W3C Understanding 2.2.2 Pause, Stop, Hide | intent, 5-second rule, moving vs auto-updating, essential, "in parallel", examples, techniques G4 G11 G152 G186 G187 SCR33 SCR22 SCR36, failures F16 F47 F50 F7 F4 | all | – (every technique and failure page read in the redo, below) |
| W3C Understanding 2.3.1 Three Flashes | intent, general and red flash, 341 × 256 area, testing (PEAT), G19 G176 G15 | all | PEAT tool itself |
| MDN `prefers-reduced-motion` | values, how to turn it on per OS, the dissolve example, compat, see-also | all | – (the header page read in the redo) |
| MDN `linear()` | syntax, stops, percentages, spring approximation, generator link, compat | all | – (generator opened in the redo; its URL is in the demo list) |
| MDN `navigator.preferences.reducedMotion` | experimental API to read / override the preference | all | compat table not shown in the page text |
| web.dev Rendering performance | pixel pipeline, 3 paths, 16.7 ms / ~10 ms budget, INP ≤ 200 ms | all | – |
| web.dev Animations guide · Why some animations are slow · Stick to compositor-only properties · Avoid layout thrashing · Debounce input handlers · content-visibility · prefers-reduced-motion | the 7 linked articles | all | – (the three remaining articles read in the redo) |
| Material Components Android `docs/theming/Motion.md` (raw GitHub) | the six spring tokens with damping and stiffness | spring section | – (m3.material.io read in the redo through its own content endpoint, below) |
| Apple HIG Motion (the page's JSON data) | best practices, feedback, platform considerations, visionOS rules incl. 0.2 Hz | all | – |
| Apple App Store "Reduced motion evaluation criteria" | triggers, required behaviour, acceptable replacements | all | – |
| Atlassian "Applying motion" | duration and easing tokens, enter vs exit, focus timing, low-end note | all | `motion/variables` component page (older API) |
| Shopify Polaris motion tokens | durations, eases | all (redo) | – (read from the Polaris source on GitHub in the redo, below) |
| IBM Carbon motion | durations and productive / expressive curves | not re-read: already stored in motion-effects §3 (RULE R: extend, never redo) | – |
| Alex Russell, "The Performance Inequality Gap, 2026" (infrequently.org) | baseline phone, P75 networks by country, budgets | all | earlier years of the series (superseded) |
| Search: low-end Android animation measurement | Margelo 2026 "Phantom jump" study (React Native / Skia, 120 Hz budget phone) | all (redo) | – (full text read through its `llms.txt`, below) |
| **Redo 2026-10-02 — sources below were read in full; route given where the normal page failed** | | | |
| W3C SCR40 | JS form of C39 (`matchMedia('(prefers-reduced-motion: no-preference)')`), 3-step test | all | – |
| W3C G4 · G11 · G152 · G186 · G187 · SCR22 · SCR33 · SCR36 | pause/restart, blink < 5 s, GIF cycles, a stop control, (obsolete) UA stop, scripted blink stop, scripted scroller with pause, expand moving text to static | all | – |
| W3C failures F16 · F47 · F50 · F7 · F4 | scroller without pause; `<blink>`; scripted blink > 5 s; plug-in blink; `text-decoration:blink` | all | – |
| W3C Understanding 2.2.1 Timing Adjustable | the six options (turn off, adjust ×10, extend with 20 s warning ×10, real-time, essential, 20 h) | all | – |
| WAI carousel tutorial (animations) + ARIA APG carousel pattern | stop/start button, label change, hover/focus pause, rotation control first in tab order, `aria-live` off while rotating | all | – |
| MDN `Sec-CH-Prefers-Reduced-Motion` | client hint, `Accept-CH` / `Critical-CH` / `Vary` flow, experimental | all | – |
| web.dev "Simplify paint complexity", "Optimize JS execution", "Reduce style calc scope" | paint areas, layers, rAF, 3–4 ms JS per frame, selector cost | all | – |
| web.dev `prefers-reduced-motion` (Thomas Steiner) | `<link media>`, `<picture>` per preference, `change` listener | all | – |
| MDN "CSS and JavaScript animation performance", "Animation performance and frame rate" | OMTA, cost classes of properties | all | – |
| Material 3 motion overview, easing-and-duration, transitions (m3.material.io) | physics system, expressive vs standard schemes, the **official web conversion table**, reduced-motion rules for transitions | all | page is script-rendered and web.archive.org is blocked for the fetch tool; **route:** the site's own content endpoint `m3.material.io/_dsm/content/m3/<carbonVersion>/<fileId>.json` (ids and version taken from its `main.*.js`) |
| material-web `tokens/versions/v0_192/_md-sys-motion.scss` | the 16 durations and 10 easings as shipped for the web | all | no spring tokens exist on the web package |
| Jetpack Compose `StandardMotionTokens.kt`, `ExpressiveMotionTokens.kt`, `MotionScheme.kt` (androidx on GitHub) | both spring sets with damping and stiffness | all | – |
| Shopify Polaris `polaris-tokens/src/themes/base/motion.ts` (GitHub) | 12 durations, 5 easings, 6 keyframes | all | `token-groups/motion.ts` path no longer exists; the file moved to `themes/base/` |
| Carbon motion overview + choreography | productive **and expressive** curves, stagger 20 ms, 500 ms total cap, Motion Generator | all | – |
| IBM `motion` package (GitHub README + `getDuration.js`, `config-constants.js`) | duration from distance and size; four moments | all | the demo site (URL in the demo list for the browser pass) |
| Fluent 2 motion page + `@fluentui/tokens` `durations.ts`, `curves.ts` (GitHub) | principles (page has no numbers) + all token values (source) | all | – |
| Atlassian motion overview | the four named curves (bold / practical), "reduce = off and instant" | all | – |
| Apple HIG Accessibility (JSON) | the reduce-motion list (tighten springs, track gestures, no z-axis, fades for x/y/z, no blur animation), Dim Flashing Lights | motion parts | – |
| GOV.UK Design System | no motion guidance page exists (site search 404, web search empty); **measured** instead: 0 `transition`, `animation`, `@keyframes` or `prefers-reduced-motion` in all 328 `.scss` files of `govuk-frontend` main | source measured | – |
| A List Apart, Val Head, "Designing safer web animation for motion sensitivity" | three triggers: relative size, mismatched direction/speed, distance covered | all | the trigger sites it names have no URLs |
| CSS-Tricks, Eric Bailey, "An introduction to the reduced motion media query" + "Reduced motion picture technique, take two" | static final frame; `<picture>` + animate-anyway button | all | – |
| Smashing, Michelle Barker, "Respecting users' motion preferences" | no-preference-first, `--playState`, toggle, video, `<picture>`, `update: slow` | all | – |
| Josh Comeau "Accessible animations in React" + "Springs and bounces in native CSS" | SSR default = reduced; 40–75 points for a bouncy `linear()`; interrupt caveat; `@supports` fallback | all | – |
| Chrome for Developers `linear()` article + Smashing (Jhey Tompkins) "The path to awesome CSS easing with linear()" + the generator page | syntax, support (Chrome/Edge 113, Firefox 112, Safari 17.2), generator presets | all | Jake Archibald has no separate article; the generator is his (repo `jakearchibald/linear-easing-generator`) |
| Tatiana Mac, "Taking a no-motion-first approach" | animations only inside `no-preference`; stylesheet with `media` | all | – |
| Chrome DevTools "Emulate CSS media features" | reduced-motion and **reduced-transparency** emulation | all | – |
| Alex Russell 2026 (re-opened for links only) | interactive budget calculator, CrUX vis | links | no animation numbers in the article |
| Margelo, "Chasing a phantom jump" (2026-06-24) | full: 120 Hz budget, compositing cost, 60 Hz diagnostic | all | read through `margelo.com/blog/…/llms.txt` |

---

## 1. What the WCAG rules actually require

**2.3.3 Animation from Interactions (AAA).** Motion *triggered by the visitor* (scroll, click, hover) can be switched
off unless essential. Motion is "steps between conditions to create the illusion of movement": moving into place,
changing size. **Not motion:** instant appearance, colour change, blur, and **opacity changes that do not alter
perceived size, shape or position**. "Essential" = removing it would fundamentally change the information *and* there
is no other conforming way. Sufficient: **C39** (`prefers-reduced-motion`), SCR40 (the same in JS), or a site setting
(Example 1 is a global toggle for parallax). C39's test: turn on reduced motion → each interaction-triggered motion
is either essential or suppressed.

**2.2.2 Pause, Stop, Hide (A).** Anything that **starts by itself, moves/blinks/scrolls for more than 5 s, and sits
beside other content** needs a pause, stop or hide. **Auto-updating** content needs one with **no** 5-second
allowance. The control must be **keyboard accessible**. A preloader that is the only thing on screen needs none — but
only if interaction truly cannot happen during it. Failures include F16 (scrolling content with no pause). Applies to
the whole page: one failing carousel fails the page.

**2.3.1 Three Flashes (A).** No more than 3 flashes a second, or the flashing area stays under the threshold:
**341 × 256 CSS px** (25 % of a 10° field at 1024 × 768). A flash = an opposing pair of ≥ 10 % luminance changes with
the darker below 0.80; red flashes are judged separately. Closer viewing or zoom makes "passing" content risky — so
for a builder the safe rule is **no flashing presets at all**.

**Apple (HIG + App Store criteria)** adds the clearest list of *triggers*: parallax, animated blur and depth of
field, multi-axis or multi-speed motion, spinning / vortex, large objects flying in or out, auto-advancing carousels,
and sustained oscillation near **0.2 Hz**. Replacements Apple accepts: **dissolve, highlight fade, colour shift**.
"Removing animations entirely can have a negative effect on usability and understandability." Also: let people
cancel motion — never make them wait for an animation.

## 2. What "reduce" should mean (the policy)

Put together (MDN, web.dev, Apple, WCAG's own definition):

| Kind of motion | Under `reduce` |
|---|---|
| Movement and scaling (rise, slide, zoom, parallax, page slides, 3D) | **replaced by a short fade** (≤ `base`), or removed if decorative |
| Opacity, colour, shadow, outline feedback (hover, focus, pressed, selected) | **kept** — not motion under 2.3.3 |
| Information carried by motion (a progress bar emptying, a countdown) | **kept as a static state** (the alert bar already does this) |
| Auto-playing / looping (carousel, marquee, Ken Burns, typewriter loop) | **does not start** |
| Smooth scrolling | **instant** |
| Stagger | **0** |

The rule is **swap, don't strip**: a visitor who asked for less motion still sees *that* something changed.

## 3. A visitor-facing motion switch

WCAG 2.3.3 Example 1 and Apple's "make motion optional" both point at a control on the site itself, for visitors who
never found the OS setting (common on shared and low-cost phones).

```html
<button type="button" data-eu-motion-toggle aria-pressed="false">Reduce motion</button>
```
```css
/* one switch, two sources: the OS preference OR the visitor's choice on this site */
@media (prefers-reduced-motion: reduce) { :root { --eu-motion: 0; } }
:root[data-eu-motion="reduce"] { --eu-motion: 0; }
```
- The exporter wraps moving effects in `@media (prefers-reduced-motion: no-preference)` **and**
  `:root:not([data-eu-motion="reduce"])`; one small script sets the attribute from `localStorage` (in `try/catch`)
  before first paint and flips `aria-pressed`.
- Off by default as an opt-in site setting; shown in the footer or the accessibility menu.
- `navigator.preferences.reducedMotion` (MDN, experimental, secure contexts) may one day let the page *override* the
  media query itself; until it is broadly shipped, the attribute is the portable way.

## 4. Motion tokens — what the systems agree on

| System | Short | Medium | Long | Enter easing | Exit easing |
|---|---|---|---|---|---|
| Material 3 (stored) | 50–200 ms | 250–400 | 450–1000 | emphasized-decelerate (.05,.7,.1,1) | emphasized-accelerate (.3,0,.8,.15) |
| Carbon (stored) | 70 / 110 | 150 / 240 | 400 / 700 | (0,0,.38,.9) | (.2,0,1,.9) |
| **Atlassian (new)** | 0 / 50 / 100 / 150 ("interactions") | 200 / 250 | 400 / 600 ("transitions") | out.practical (.4,1,.6,1) | in.practical; exits 50–100 ms shorter |
| **Polaris (new, partial)** | `--p-motion-duration-100` = 100 ms … | | | ease (.25,.1,.25,1) as the default | ease-in |
| Apple HIG (new) | no numbers for apps; "brief and precise"; games 30–60 fps | | | | |

**Agreement:** interactions 50–150 ms; things entering 200–400 ms; big or full-screen up to ~600 ms; **enter
decelerates, exit accelerates and is shorter**; one or two properties per transition (Atlassian); move focus and
announce at the **start** of an animation, never gate an error message behind an entrance.

**Springs (new).** Material's spring tokens (official, from Material Components Android):

| Token | Damping | Stiffness | Settles in* | `linear()` equivalent |
|---|---|---|---|---|
| FastSpatial | 0.9 | 1400 | ~155 ms | same curve A |
| DefaultSpatial | 0.9 | 700 | ~220 ms | same curve A |
| SlowSpatial | 0.9 | 300 | ~335 ms | same curve A |
| Fast / Default / SlowEffects | 1 | 3800 / 1600 / 800 | ~135 / 210 / 300 ms | same curve B |

\* computed from the spring equation (mass 1, settled within 0.2 %).

Curve A: `linear(0, 0.088, 0.264, 0.45, 0.613, 0.74, 0.833, 0.898, 0.94, 0.967, 0.984, 0.993, 1)`
Curve B: `linear(0, 0.157, 0.411, 0.623, 0.771, 0.866, 0.923, 0.957, 0.976, 0.987, 0.993, 0.996, 1)`

What this shows: at damping 0.9 a spring barely overshoots (< 0.2 %), and the stiffness only changes the
**duration**, not the shape. So Material's six springs are **two `linear()` curves × three durations** — which fits a
token system exactly (`--eu-ease-spring-spatial`, `--eu-ease-spring-effects` + the duration scale). `linear()` is
Baseline (Dec 2023). The bouncy `--eu-ease-spring` in motion-effects §3 is a separate, *playful* curve (RULE P: playful
personality only).

## 5. Performance on a low-cost Android phone

**The device and network.** The 2026 baseline phone is a Samsung Galaxy A24 4G class (Helio G99), single-core about
**9× slower than a current iPhone**. Nigeria's P75 network: **3.1 Mbps down, 190 ms round trip** (India 6.2 Mbps /
85 ms). DevTools' 4× CPU slowdown approximates a mid-range phone; a low-cost phone is worse. Many budget phones now
have **90–120 Hz** screens: the frame budget falls from 16.7 ms to **8.3 ms**, with a weak GPU and little memory
bandwidth.

**The rules that follow:**

1. **Animate only `transform` (incl. `translate`/`scale`/`rotate`) and `opacity`.** They run on the compositor thread
   and keep running while the main thread is busy. Everything else re-runs layout or paint each frame. `filter: blur`
   and `backdrop-filter` are paint-heavy on these GPUs — small elements only, never animated across a whole bar.
2. **Scroll-driven CSS animations stay off the main thread only for compositor properties.** A `view()`/`scroll()`
   animation of `padding`, `min-height` or `background-color` runs on the main thread every scroll frame.
3. **`will-change` is not free.** Each layer costs GPU memory and upload bandwidth; "do not promote elements
   unnecessarily". Add it just before an animation and remove it after; never in a stylesheet for many elements.
4. **No scroll / touchmove handlers that write styles.** Store the value; write in the next `requestAnimationFrame`;
   read all geometry before writing any (layout thrashing measured at 28 ms a frame in web.dev's example). Prefer
   IntersectionObserver, `scrollend` (114 / 109 / 26.2) or CSS scroll timelines.
5. **Skip work off-screen.** `content-visibility: auto` + `contain-intrinsic-size: auto <estimate>` skipped rendering
   for a 7× faster first render in web.dev's demo (232 → 30 ms); Chrome 85, Firefox 125, Safari 18 (`auto` value:
   Safari 26). It also stops off-screen entrances and loops from costing anything.
6. **INP.** An interaction must paint within 200 ms at P75. A JS handler taking 80 ms on a laptop takes ~320 ms on a
   mid-range phone. Motion that runs JS on tap (tweens, measuring) is an INP risk; CSS transitions are not.
7. **Entrances must not hold the LCP element hidden.** An opacity-0 start on the hero delays when it counts as painted.
   Never give the largest above-the-fold element an entrance longer than `base`.

---

## The builder today — HAVE / PARTIAL / GAP

| Rule | State | Evidence (file:line) | Note |
|---|---|---|---|
| Moving hover effects stripped under `reduce`, feedback kept | **HAVE** | `lib/interactions.ts:105-108` (`transform:none`, shadow and colour stay) | matches §2 |
| Hover also on keyboard focus | **HAVE** | `lib/interactions.ts:101` (`:hover`, `:focus-visible`, `:has(:focus-visible)`) | – |
| Hover gated by `(hover: hover)` so touch does not "stick" | **GAP** | no `hover:hover` anywhere in `lib/interactions.ts`, `lib/box-model.ts`, `lib/educo-ui/` | MR-6 |
| Entrance under `reduce` = fade, not nothing | **PARTIAL** | `lib/interactions.ts:245-246` → `animation:none`; `lib/box-model.ts:6366` same for arrival | MR-1 |
| Global reduce rule | **PARTIAL** | `lib/educo-ui/base.ts:145-147` sets every animation and transition to `.01ms` | colour and shadow feedback still changes, but instantly; every fade (including entrances and `@starting-style` ones) is removed, which §2 says to keep; MR-1 |
| Smooth scroll off under `reduce` | **HAVE** | `lib/educo-ui/base.ts:146` (`scroll-behavior:auto`), canvas copy `components/website/box/BoxCanvas.tsx:3544-3551`, pager JS `lib/box-model.ts:3621-3625` | – |
| Alert countdown keeps its information under `reduce` | **HAVE** | `lib/educo-ui/components.ts:283-286` (bar static at 30 %) | good model for §2 |
| Pinned "arrival" under `reduce` / without scroll timelines | **GAP** | `lib/box-model.ts:6362-6366`; keyframes `:6263-6271` start from `background-color: transparent` | under `reduce`, and in Firefox (no `animation-timeline`), a "solid" or "glass" bar never fills: page text scrolls under a see-through header. A colour change is not motion, so it may still switch (stepped). MR-2 |
| Arrival effects are compositor-only | **GAP** | `lib/box-model.ts:6263-6271`: `condense` animates `padding-block` + `min-height` (layout), `glass` animates `backdrop-filter` (heavy paint), `solid`/`shadow`/`rule` animate paint — all per scroll frame on the main thread | MR-3 |
| Auto-advance (pager) has a visible pause control | **GAP** | `lib/box-model.ts:3657-3669` — pauses on hover/focus only; never runs under `reduce` (good) | hover-pause is not the control 2.2.2 asks for; a touch user cannot pause it. MR-4 |
| Auto-dismiss alert (time limit) | **PARTIAL** | `lib/box-model.ts:2020-2035`, `lib/educo-ui/components.ts:272-281` — pauses on hover/focus | no visible pause / "keep open"; 2.2.1 wants turn off / adjust / extend. MR-5 |
| Visitor motion switch | **GAP** | 0 hits for a site-level motion setting | MR-7 |
| Canvas "preview reduced motion" toggle | **GAP** | not in `components/website/box/` (only the OS rule at `BoxCanvas.tsx:3544-3566`) | motion-effects §6 rule 2 asked for it. MR-8 |
| Motion tokens | **PARTIAL** | `lib/educo-ui/tokens.ts:47-53` — 4 durations, 5 easings; no instant, reveal, page, stagger; `emphasized` is still the overshoot curve (.2,0,0,1.2) | MR-9 |
| Hard-coded timings | **PARTIAL** | `lib/interactions.ts:212` fallback `.55s` (token `slow` is 320 ms), `:238` 90 ms stagger, `lib/box-model.ts:2025` `.18s` | MR-9 |
| Layout-property animation refused for user CSS | **HAVE** | `lib/box-model.ts:1255-1273`, `:1315` | but the built-in `condense` arrival and horizontal accordion break the same rule (MR-3, EX-5) |
| `will-change` | **HAVE** (none emitted) | only mentioned in a comment, `lib/box-model.ts:6385` | correct by default |
| Scroll listeners in exported scripts | **PARTIAL** | pager: `lib/box-model.ts:3654` (debounced 90 ms, writes dot opacity only); pin stack and masonry use resize/load + rAF only (`:3898-3900`, `:5891-5893`) | acceptable; MR-10 swaps the pager's for IntersectionObserver |
| Flashing presets | **HAVE** (none exist) | no blinking/flash keyframes in `lib/` | keep it so (RULE: no flashing presets) |
| `content-visibility` for long pages | **GAP** | 0 hits | MR-11 |
| Entrance on the LCP element | **CHECK** | `revealCss` plays any entrance on load, including the hero (`lib/interactions.ts:233`) | MR-12 |
| Entrances on below-the-fold blocks without "on scroll" | **PARTIAL** | same line — they play on load, unseen | wasted work and the effect is lost; MR-13 |

---

## Gap list (motion rules)

| Id | Plain description | Sort |
|---|---|---|
| **MR-1** | Under `reduce`, swap movement for a short fade instead of removing everything: entrances become `fade` at `base`; the global `.01ms` rule in `base.ts` is narrowed to movement so short opacity/colour transitions survive. | DECIDE (policy: "swap, don't strip" vs. today's "strip") |
| **MR-2** | A pinned bar's "solid"/"glass" arrival never fills under `reduce` or in Firefox, leaving text under a see-through header. Under `reduce` switch it with a stepped (non-moving) change; without scroll timelines give it its arrived background. | MUST |
| **MR-3** | Arrival effects animate layout (`condense`: padding, min-height) and heavy paint (`glass`: backdrop blur) on every scroll frame. Rebuild `condense` with `scale`/`translate` or a stepped change, and keep `glass` static once arrived. | MUST |
| **MR-4** | The pager's auto-advance has no visible, keyboard- and touch-operable Pause/Play button (2.2.2; hover-pause is not the control). | MUST |
| **MR-5** | Auto-dismissing alerts give no visible way to stop the timer (2.2.1 / 2.2.2): add a "keep open" or pause control, or require a minimum time. | MUST |
| **MR-6** | Hover effects are not gated by `@media (hover: hover)`, so on a phone a tapped card stays "lifted". Gate the `:hover` part; keep `:focus-visible`. | MUST |
| **MR-7** | No visitor-facing "Reduce motion" switch on the published site (2.3.3 Example 1). One button + `data-eu-motion` + a few lines of script. | DECIDE |
| **MR-8** | No "preview with reduced motion" toggle on the canvas, so an author cannot see what a reduced-motion visitor sees. | DECIDE |
| **MR-9** | Token set incomplete and partly bypassed: add instant / reveal / page / stagger durations, enter/exit easings, the two spring `linear()` curves; rename `emphasized` → `overshoot`; replace the hard-coded `.55s`, `90ms`, `.18s`. | MUST |
| **MR-10** | Replace the pager's scroll listener with IntersectionObserver (or `scrollend` where available) to mark the current dot. | LATER |
| **MR-11** | Offer `content-visibility: auto` + `contain-intrinsic-size: auto` on long below-the-fold sections, measured on a 360px phone at 4× CPU; check it never breaks anchors, find-in-page or the pin stack. | DECIDE |
| **MR-12** | An entrance on the hero/LCP element delays its paint: cap it at `base` and fade-only, or refuse an entrance on the first band. Measure LCP with and without on Slow 3G + 4× CPU. | CHECK |
| **MR-13** | Entrances on blocks below the fold play on load, unseen. Default them to "when it comes into view" (or emit `view()` automatically when the block is not in the first screen). | DECIDE |
| **MR-14** | UAT line: every motion preset at 360px with 4× CPU throttle and a 90/120 Hz profile — no dropped frames in the Performance panel for compositor effects; record the frame numbers in the page report (RULE AF measurement). | CHECK |
| **MR-15** | UAT line: turn on reduced motion (Android "Remove animations", Windows, macOS) and drive every effect — each one either fades, holds a static state, or does not start; nothing moves; nothing needed is lost (C39 test). | CHECK |

---

## Added 2026-10-02 (redo) — what the remaining sources teach

The first pass skimmed several sources and opened none of their demos. This redo reads each one in full (see the
table above) and collects every live demo in `scratchpad/demos/mr.json` (36 URLs) for the browser pass. Only new
knowledge is written here. Every builder claim was checked with grep and is cited by file:line.

### R1. The WCAG technique pages — what a pause control must actually do

- **G4 / F16 / SCR33 (the six-step test).** A pause control exists → pressing it stops the motion → **the motion
  does not start again by itself** → a restart control exists → pressing it → the motion **resumes from where it
  stopped**. If step 3 fails (it restarts by itself), the page fails 2.2.2 (F16).
- **G186.** The control must be accessible itself (name, contrast, keyboard). It goes **at the top of the page or
  next to the moving thing**.
- **SCR36.** For moving text there is a second valid answer: a button that **expands it into a static block**.
- **G11 / G152 / SCR22 / F50 / F7.** Blinking must stop within **5 s**. For a GIF: frames × frame time × loops
  ≤ 5 s (G152 gives the arithmetic). F47 (`<blink>`), F4 (`text-decoration: blink`) and G187 (the browser's Esc
  key stopping GIFs) are obsolete.
- **SCR40.** The JavaScript form of C39: `matchMedia('(prefers-reduced-motion: no-preference)')` decides whether a
  JS animation runs.
- **2.2.1 Timing Adjustable** (applies to the auto-dismissing alert, MR-5). One of these is required: **turn off**
  the limit before it starts · **adjust** it to at least 10× · **warn and extend**, with at least 20 s to respond
  and a simple action, at least 10 times. The exceptions are real-time, essential, and limits over 20 hours.

**Carousel rules (WAI tutorial and the ARIA APG carousel pattern):**
- A Stop/Start button whose **label changes** ("Stop slide rotation" / "Start slide rotation"). Change the
  label, never replace the button, or keyboard focus is lost.
- It is **the first focusable element inside the carousel**, before the slides.
- Rotation stops on hover and when keyboard focus enters. It **does not resume after focus leaves** unless the
  person presses Start.
- The slide wrapper has `aria-live="off"` while rotating and `"polite"` when stopped.
- Slides that are moving out get `aria-hidden="true"` until the move ends.

| Rule | State | Evidence | Gap |
|---|---|---|---|
| Rotation does not restart by itself after focus leaves | **GAP** | `lib/box-model.ts:3667` (`focusout → start`) | MR-16 |
| Focus on the pager's nav stops rotation | **GAP** | `lib/box-model.ts:3668` stops on `mouseenter` only; `nav` has no `focusin` | MR-16 |
| Live region off while rotating, polite when stopped | **GAP** | 0 hits for `aria-live` in `lib/interactions.ts`, `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/` | MR-16 |
| Visible Stop/Start button | **GAP** | already logged | MR-4 |
| Uploaded GIFs that loop longer than 5 s | **CHECK** | images are exported as given; nothing reads GIF frame data | MR-21 |
| Video does not autoplay and has controls | **HAVE** | `lib/box-export.ts:157` emits `<video … controls>` with no `autoplay` | – |

### R2. Reduced motion — techniques the first pass did not have

- **No-motion-first** (Tatiana Mac, Josh Comeau, Smashing). Write moving effects **only inside**
  `@media (prefers-reduced-motion: no-preference)`, so a browser that does not know the query gets no motion. The
  builder does the opposite: it adds motion, then removes it under `reduce` (`lib/interactions.ts:107`, `:246`,
  `lib/box-model.ts:6366`). Both pass C39, and no-motion-first is also shorter CSS. Folded into MR-1 (DECIDE).
- **A whole stylesheet by preference:**
  `<link rel="stylesheet" href="motion.css" media="(prefers-reduced-motion: no-preference)">`. The browser still
  downloads a stylesheet whose `media` does not match, at low priority. So this changes the order of loading, not
  the bytes.
- **Listen for changes.** `mq.addEventListener('change', …)` (web.dev). The pager reads the preference **once**
  (`lib/box-model.ts:3621`), so turning on Reduce Motion while the page is open does not stop it. MR-16.
- **Moving images.**
  `<picture><source srcset="still.png" media="(prefers-reduced-motion: reduce)"><img src="anim.gif" alt=""></picture>`,
  plus an optional "play anyway" button that removes the `source` (CSS-Tricks, "take two"). It also saves data.
  MR-21.
- **The global kill switch must stop loops, not speed them up.** The well-known reset sets
  `animation-iteration-count: 1` along with the tiny duration (Smashing). Ours sets only the durations
  (`lib/educo-ui/base.ts:146`). The engine has no `infinite` animation today (grep: 0 hits). But user CSS or a
  future preset could add one. Under `reduce` it would then cycle every 0.01 ms and show a random frame each
  paint: a strobe, the opposite of what the visitor asked for, and a 2.3.1 risk. MR-17.
- **`(update: slow)`** (Media Queries 4: e-ink and very slow screens) can join the same rule:
  `@media (prefers-reduced-motion: reduce), (update: slow)`. Cheap. DECIDE, inside MR-17.
- **`prefers-reduced-transparency: reduce`** (DevTools can emulate it from Chrome 118). The glass arrival and the
  glass Alert and Accordion use `backdrop-filter` (`lib/box-model.ts:6268`, `lib/educo-ui/components.ts:128`,
  `:436`) and never check this preference (0 hits). Under it, glass should become a solid surface. That also
  removes the heavy blur on the phones that most need it gone. MR-18.
- **Apple's reduce list (HIG Accessibility).** Tighten springs to cut bounce · keep motion tied to the person's
  gesture · no depth (z-axis) animation · **replace x / y / z movement with fades** · no animating into or out of
  a blur. "Tighten springs" maps directly onto our tokens: under `reduce`, a bouncy spatial spring swaps to the
  no-overshoot effects curve. MR-19.
- **React and server rendering.** Default to "reduced" on the server and switch after mount, so the first paint
  never moves (Josh Comeau). This matters for the canvas preview toggle (MR-8), not for the static export.
- **`Sec-CH-Prefers-Reduced-Motion`** is a client hint (`Accept-CH` + `Critical-CH` + `Vary`, experimental). It
  needs a server that changes its answer per visitor. The export is static, so it is **not used**. Recorded so
  nobody adds it later.
- **The two ends of the MR-1 decision, now measured.** "Strip": Atlassian says that "when reduced motion is
  active, motion is off and instant", and GOV.UK Frontend ships **no motion at all** (measured: 0 `transition`,
  `animation` or `@keyframes` in its 328 `.scss` files). "Swap": Apple, Material ("use subtle fades instead of
  sliding or scaling; disable parallax and shape morphing") and Fluent.
- **Vestibular triggers (Val Head, A List Apart).** (1) The size of the moving area compared with the screen: a
  full-screen wipe is risky, a small rotating button is not. (2) Direction or speed that does not match the
  scroll (parallax, scroll-jacking). (3) Large distance covered (big zooms). Label heavy-motion content so people
  can choose, and offer a site toggle (Greg Tarnoff's prototype is in the demo list). Feeds MR-7.

### R3. Motion tokens — exact values, now read from source

**Material 3 now uses springs** (the "motion physics system", May 2025). Easing + duration is the legacy system,
still used for screen transitions. There are two schemes. **Expressive** overshoots and is the default for most
products. **Standard** has minimal bounce and suits utilitarian products. Each scheme has fast / default / slow
× spatial / effects. *Spatial* moves position, rotation, size and corners. *Effects* animates colour and opacity
and **never overshoots**. Fast is for small components, default for partial-screen moves (sheets, rails), slow
for full-screen ones. The exact values differ by device class.

| Compose token | Standard (damping / stiffness) | Expressive (damping / stiffness) |
|---|---|---|
| Fast spatial | 0.9 / 1400 | **0.6 / 800** |
| Default spatial | 0.9 / 700 | **0.8 / 380** |
| Slow spatial | 0.9 / 300 | **0.8 / 200** |
| Fast / default / slow effects | 1 / 3800 · 1600 · 800 | same as standard |

Source: androidx `compose/material3/…/tokens/StandardMotionTokens.kt` and `ExpressiveMotionTokens.kt` (v0_14_0).

**Material's official web conversion** (m3.material.io, "Web: convert springs to curves"):

| Spring | cubic-bezier | Duration |
|---|---|---|
| Expressive fast spatial | (0.42, 1.67, 0.21, 0.90) | 350 ms |
| Expressive default spatial | (0.38, 1.21, 0.22, 1.00) | 500 ms |
| Expressive slow spatial | (0.39, 1.29, 0.35, 0.98) | 650 ms |
| Standard fast / default / slow spatial | (0.27, 1.06, 0.18, 1.00) | 350 / 500 / 750 ms |
| Fast / default / slow effects (both schemes) | (0.31, 0.94, 0.34, 1) · (0.34, 0.80, 0.34, 1) · (0.34, 0.88, 0.34, 1) | 150 / 200 / 300 ms |

Material says: "Use springs when possible, otherwise use curves that mimic the springs for animations **without
interruptions or gestures**." Its durations are longer than the physical settle times computed in §4
(155 / 220 / 335 ms at 0.2 %). Material picks a duration that *feels* finished, not the mathematical one. So the
tokens should **use Material's durations**, with our `linear()` shapes.

**Expressive springs as `linear()`.** Computed here from the spring equation (mass 1, 17 equal stops). Josh
Comeau warns that a bouncy curve needs **40–75** stops to look right, so these are a starting point, to be checked
by eye in the generator:

| Spring | Overshoot | Settles (0.2 %) | `linear()` |
|---|---|---|---|
| Expressive default / slow spatial (ζ 0.8) | 1.5 % | 412 / 567 ms | `linear(0, 0.096, 0.292, 0.5, 0.678, 0.812, 0.904, 0.962, 0.994, 1.009, 1.015, 1.015, 1.012, 1.009, 1.006, 1.004, 1)` |
| Expressive fast spatial (ζ 0.6) | 9.5 % | 348 ms | `linear(0, 0.145, 0.436, 0.721, 0.93, 1.048, 1.092, 1.089, 1.065, 1.036, 1.013, 0.999, 0.992, 0.991, 0.993, 0.996, 1)` |

So on the web, Material's whole spring system is **four shapes** × the duration scale: standard spatial (curve A
in §4), effects (curve B), expressive ζ 0.8, and expressive ζ 0.6. The ζ 0.6 shape is visibly bouncy. It belongs
to the playful personality only (RULE P), and under `reduce` it swaps to curve B (Apple: "tighten springs").

**Material "emphasized" in CSS.** Material says "CSS: N/A, use Standard as a fallback", because emphasized is a
two-segment path, not one cubic-bezier. `linear()` can carry it. Computed from the path
`M0,0 C.05,0 .133333,.06 .166666,.4 C.208333,.82 .25,1 1,1`:
`linear(0 0%, 0.021 5%, 0.093 10%, 0.192 13.3%, 0.273 15%, 0.403 16.7%, 0.542 18.3%, 0.636 20%, 0.719 22.5%, 0.773 25%, 0.84 30%, 0.912 40%, 0.951 50%, 0.973 60%, 0.995 80%, 1 100%)`.
The generator has "Material Design emphasized" as a preset; compare the two in the browser pass.
Material's suggested pairs: emphasized 500 ms (begins and ends on screen) · emphasized-decelerate 400 ms (enter)
· emphasized-accelerate 200 ms (exit) · standard 300 / 250 / 200 ms. Exits are shorter "because they require less
attention". Do not slowly cross-fade something over other content; if a fade is needed, keep it short.

**material-web** (`tokens/versions/v0_192/_md-sys-motion.scss`) ships only the legacy set. Durations: short1–4 =
50 / 100 / 150 / 200, medium1–4 = 250 / 300 / 350 / 400, long1–4 = 450 / 500 / 550 / 600, extra-long1–4 =
700 / 800 / 900 / 1000 ms. Easings: standard (0.2,0,0,1), standard-accelerate (0.3,0,1,1), standard-decelerate
(0,0,0,1), emphasized (0.2,0,0,1, the single-curve stand-in), emphasized-accelerate (0.3,0,0.8,0.15),
emphasized-decelerate (0.05,0.7,0.1,1), legacy (0.4,0,0.2,1), legacy-accelerate (0.4,0,1,1), legacy-decelerate
(0,0,0.2,1), linear. **No springs.**

**Polaris** (`polaris-tokens/src/themes/base/motion.ts`, the whole file). Durations: 0, then every 50 ms from 50
to 500, plus 5000 ms. Easings: `ease` (0.25,0.1,0.25,1), "a great default for any user interaction"; `ease-in`
(0.42,0,1,1), "use sparingly"; `ease-out` (0.19,0.91,0.38,1); `ease-in-out` (0.42,0,0.58,1), "for transitions
triggered by the system"; `linear`, "for continuous and mechanical animations, such as rotating spinners".
Keyframes: `bounce` (scale 1 → .85 → 1.05 → 1), `fade-in`, `pulse` (scale .85 → 2.5 while fading), `spin`,
`appear-above` and `appear-below` (translateY by `--p-space-100`, plus a fade).

**Fluent 2** (`@fluentui/tokens`). Durations: ultraFast 50 · faster 100 · fast 150 · normal 200 · gentle 250 ·
slow 300 · slower 400 · ultraSlow 500 ms. Curves: accelerateMax (0.9,0.1,1,0.2) · accelerateMid (1,0,1,1) ·
accelerateMin (0.8,0,0.78,1) · decelerateMax (0.1,0.9,0.2,1) · decelerateMid (0,0,0,1) · decelerateMin
(0.33,0,0.1,1) · easyEaseMax (0.8,0,0.2,1) · easyEase (0.33,0,0.67,1) · linear. The page adds: linear only for
rotation; stagger with short offsets; animate only the focused element; announce changes through live regions.

**Carbon** (new beyond motion-effects §3). **Expressive** curves: standard (0.4,0.14,0.3,1), entrance
(0,0,0.3,1), exit (0.4,0.14,1,1). Choreography: paths follow the grid and **never run diagonally**; stagger
**20 ms**; the whole sequence **within 500 ms**; order: shell → static body → dynamic content → primary action →
data visualisation. Duration grows with distance and size (the IBM Motion Generator). `@ibm/motion`'s
`getDuration(distance, size, property, mode)` uses a non-linear rule, so long moves are slightly faster per pixel.

**Atlassian** (overview page). Ease-out **bold** (0,0.4,0,1) for panel and flag entrances; ease-in-out bold
(0.4,0,0,1) for modal scaling; ease-in practical (0.6,0,0.8,0.6) for exits; ease-out practical (0.4,1,0.6,1) for
pop-ups and hover fades. Interactions take 50–150 ms, transitions 150–400 ms. Semantic tokens bundle duration,
curve and property (`motion.popup.enter`); they are still behind a feature flag.

**Against ours** (`lib/educo-ui/tokens.ts:47-53`). 120 / 200 / 320 / 500 ms sits inside every system's range.
Compared with all of them we are missing: an **exit** duration shorter than enter, a split between effects and
spatial motion, and spring shapes. `emphasized` (`tokens.ts:52`, (0.2,0,0,1.2)) is not Material's emphasized nor
any system's curve: it is a cubic that overshoots by 20 %. Already MR-9; the values above are what MR-9 should use.

**Stagger total.** The entrance stagger is 90 ms × up to 9 steps (`lib/interactions.ts:238`). The 10th item
starts 810 ms late and finishes at about 1.1 s with the 320 ms reveal (`REVEAL_DUR`, `lib/interactions.ts:212`).
Carbon caps the whole sequence at 500 ms with 20 ms steps; Fluent asks for short offsets. MR-20.

### R4. Performance — the three web.dev articles, MDN and Margelo

- **Paint.** Every property except `transform` and `opacity` repaints. Overlapping paint areas are **unioned**,
  so two small animations far apart can repaint most of the screen. A `box-shadow` costs much more to paint than a
  flat background. On high-DPI screens, fixed elements get their own layer automatically; on low-DPI screens
  (many cheap phones) they do not. Check with DevTools → Rendering → Paint flashing.
  - The "lift" and "glow" hover presets transition `box-shadow` (`lib/interactions.ts:43-44`, `:49-50`): a repaint
    on every frame of the hover. The cheap form is a pseudo-element that already has the shadow, with only its
    opacity animated. "Lift" also writes a literal `rgba(0,0,0,.32)` shadow colour (`lib/interactions.ts:44`),
    not a token (Core Rule 17). MR-22.
- **JavaScript.** Do visual work in `requestAnimationFrame`. Keep JS during an animation to **3–4 ms a frame**.
  Move heavy work to a Worker. Our scripts already do this (pin stack and masonry use rAF; see "The builder
  today").
- **Style calculation.** Cost ≈ number of elements × selectors to match; about half of Blink's style time is
  selector matching. Use simple class selectors and change as few elements as possible. Measure with the
  Performance panel's "Selector stats". The stagger emits 9 `:nth-child()` rules per block
  (`lib/interactions.ts:238`): fine for a few blocks; noted for MR-14's measurement.
- **MDN.** CSS animations of `transform` and `opacity` run off the main thread (OMTA) and beat a
  `requestAnimationFrame` loop on the same properties. For any other property, CSS and JS cost the same. Cost
  classes: geometry (`left`, `margin`, `font-size`) → layout + paint; `color` → paint; `transform` / `opacity` →
  composite only.
- **Margelo (2026; React Native + Skia on a sub-$100, 120 Hz Android phone).** "Smooth" is **frame cadence**, not
  the position curve. A correct spring still looks like it jumps if some frames miss **8.3 ms**. Before the fix,
  **85 %** of frames were janky at 120 Hz and **15 %** at 60 Hz, with no code change. So the cost was a **fixed
  per-frame cost** (GPU compositing of a texture), not the animation. `adb screenrecord` caps near 45 fps and
  **makes jank look smooth**: on a high-refresh phone, the eye is the ground truth. For our pages, the MR-14 UAT
  line must use the DevTools Performance frames track (or the phone itself), never a screen recording. It should
  also include a run with the screen forced to 60 Hz, to tell a fixed cost apart from the animation's own cost.
  The SurfaceView fix itself is native-only; it would matter to `apps/mobile/` only if that app drew with Skia (it
  does not today).

### Gap list — added 2026-10-02 (redo)

| Id | Plain description | Sort |
|---|---|---|
| **MR-16** | The pager's auto-advance breaks the carousel rules. It starts again by itself after focus leaves (`lib/box-model.ts:3667`). Focus on its dots or arrows does not stop it (`:3668` is mouse only). It reads the reduced-motion setting once and ignores later changes (`:3621`). It has no `aria-live` off/polite switch. Fix together with MR-4's Stop/Start button as the first control. | MUST |
| **MR-17** | The global reduce rule (`lib/educo-ui/base.ts:146`) shortens durations but does not set `animation-iteration-count: 1`, so any looping animation would strobe under `reduce`. Add it, and decide whether `(update: slow)` joins the same rule. | MUST |
| **MR-18** | Glass (backdrop blur) ignores `prefers-reduced-transparency: reduce`. The glass arrival (`lib/box-model.ts:6268`), glass Alert (`lib/educo-ui/components.ts:128`) and glass Accordion (`:436`) should become solid under it. | MUST |
| **MR-19** | Under `reduce`, bouncy or spring easing should become the no-overshoot effects curve (Apple: "tighten springs"; Material's effects springs never overshoot). Applies once MR-9 adds spring tokens. | MUST |
| **MR-20** | Cap the stagger. Today it adds up to 810 ms of delay before a 320 ms reveal (`lib/interactions.ts:238`, `:212`). Use a short step and a total cap (Carbon: 20 ms steps, 500 ms or less for the whole sequence). | DECIDE (step and cap values) |
| **MR-21** | Moving images: an uploaded animated GIF or WebP loops forever and is exported as it is. Offer a still frame for `reduce` through `<picture>` (with a "play" button), or warn when a GIF loops for longer than 5 s (G152). | DECIDE |
| **MR-22** | The "Lift" and "Glow" hover presets animate `box-shadow` (a repaint every frame), and "Lift" uses a literal `rgba(0,0,0,.32)` (`lib/interactions.ts:43-50`). Put the shadow on a pseudo-element and fade its opacity; take the colour from a shadow token. | MUST |
| **MR-23** | Motion token values. Adopt the measured set above: Material's web durations for the spring shapes; the two `linear()` curves of §4 plus the expressive ones (re-sampled at 40+ stops and checked by eye in the generator); Material emphasized as `linear()`; and an exit duration shorter than enter. Extends MR-9 with the values. | DECIDE (which system's numbers win where they differ) |
| **MR-24** | Fix the UAT method for MR-14: measure frames in the DevTools Performance panel (or by eye on the phone), never from a screen recording, and add a 60 Hz run to separate a fixed per-frame cost from the animation's own cost. | CHECK |
