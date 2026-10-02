# Family 11 · Rules — motion tokens, reduced motion, performance, accessibility

Part of the [Motion & Effects Library](../LIBRARY.md). **Every other family points here for its token.** One entry per
rule, in the library's entry shape (the "trigger" of a rule is *setting* or *n/a*). Written 2026-10-02 from the measured
runs ([AGGREGATE](../../research-runs/AGGREGATE.md); raw records `C:\Users\eyite\educo-research\runs\*.json`; the
`aggregate.json` "examples"), the research files [06-motion-rules](../06-motion-rules.md),
[08-component-effects](../08-component-effects.md) §1.7 / §4, [09-app-motion](../09-app-motion.md) (A-22, A-23),
[motion-effects §2–3, §6](../../motion-effects.md), [DEVELOPING_COUNTRIES_FIRST](../../../DEVELOPING_COUNTRIES_FIRST.md),
the reading notes `educo-research\reading\D.md` (reduced motion, Smashing / Val Head) and the demo list
`reading\demos\mr.json` (36 URLs). Every `file:line` below was grepped again on 2026-10-02 on branch
`builder/layout-uat` (working tree, uncommitted edits included).

**Two numbers in this file are re-measured, not copied** (script in the session scratchpad, reading the same raw
records the aggregate reads; the runs folder was being re-written while this was done, so the recount saw **n = 678**
sites where the aggregate saw 732):
- the **element-weighted** transition median is **300 ms** (IQR 250–500, p90 800; 84,910 elements). The aggregate's
  "median 350 ms" is the median of the *distinct duration values per site* (5,012 site×value pairs), not of elements —
  it over-weights rare long values. Both are true; **300 ms is the one a visitor meets**.
- on the 758 hovered elements that carry their own transition, the median is **300 ms** (IQR 200–450); **2,154 of
  2,912 hovered elements (74 %) change with no transition on the element itself** (an instant switch, or the motion
  lives on a child).

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) · 3,802 uiverse elements · 17 CodePen tags

| What sites actually do with motion timing and safety | Measured share | n | Entry |
|---|---|---|---|
| Transition durations used (elements) | 300 ms 25,292 (30 %) · 200 ms 12,911 · 400 ms 8,911 · 600 ms 8,743 · 500 ms 8,671 · 100 ms 3,633 · 250 ms 3,626 · 800 ms 3,249 · 1 s 2,848 · 150 ms 2,657 · 350 ms 2,312 | 84,910 elements | 11.1 |
| uiverse transition duration median | **300 ms** (IQR 250–500, p90 600); 300·500·200·400·1000 cover 79 % | 5,658 declarations | 11.1 |
| Easings used (elements) | `ease` 40,904 (the browser default — nobody chose it) · `ease-in-out` 9,768 · `linear` 3,422 · easeOutCubic (.215,.61,.355,1) 3,334 · Material legacy (.4,0,.2,1) 3,312 · `ease-out` 3,311 · easeOutExpo (.19,1,.22,1) 3,114 · easeInOutQuad 2,742 · easeInOutCubic 2,526 · easeOutQuint (.23,1,.32,1) 1,564 · easeOutQuart (.25,1,.5,1) 1,453 · (.16,1,.3,1) 1,070 | 732 sites | 11.2 |
| GSAP eases (script) | `none` 885 · power2.inOut 679 · power3.out 579 · expo.out 556 · power2.out 552 · power3.inOut 376 | 125 GSAP sites (17 %) | 11.2 |
| `linear()` easing written in CSS | 12 (2 %) | 732 | 11.3 |
| Animation durations (keyframes) | 12 s 531 (marquees) · 800 ms 408 · 2.5 s 278 · 600 ms 247 · 1 s 245 · 2 s 232 | 732 | 11.1, 11.9 |
| CSS mentions `prefers-reduced-motion` | **25 %** (181) | 732 | 11.6 |
| Still moves on scroll when the visitor asked for reduced motion | **70 %** | 732 | 11.6 |
| uiverse elements that run under reduced motion | Buttons 8 % · Cards 18 % · loaders **97 %** · Notifications 96 % | 3,802 | 11.6, 11.7 |
| Hover rules gated by `(hover: hover)` / `(pointer: fine)` | 23 % of all sites (171); **30 %** of the sites that have any `:hover` rule (161 / 542, recount) — a stylesheet count on the desktop run, not a phone test (phone: re-measure pending, R-16) | 732 / 542 | → 6.19 |
| Tab stops with an outline or shadow while focused | **74 %** | ~2,400 stops | → 6.15 |
| Something moves with no scroll (carousel, marquee, loop) | 51 % (373) | 732 | 11.9 |
| **Opaque** full-screen cover still on screen at 0.7 s (preloader / intro) | **38 %** (corrected 2026-10-02; the aggregate's 69 % counted see-through layers) | 732 | 11.13 |
| Page weight (median) · pages ≤ 1 MB | **2,951 KB** · 23 % | 732 | 11.13 |
| Long tasks while scrolling — desktop (median) | 0 ms | 732 | 11.11 |
| Long tasks / anything at 360 px | **phone: re-measure pending (R-16)** — the 360 px emulation did not take effect in the runs | — | 11.11 |
| three.js / canvas · GSAP · Lenis | 58 % · 17 % · 16 % | 732 | 11.13 |

Award-showcase sites are the sample (awwwards Hovers and Transitions collections, Webflow showcases): they lean
heavier and slower than a school site should. The tokens below take their **timings** (what a visitor is used to) and the
design systems' **rules** (what is safe), never the award sites' weight.

---

## The proposed token set (the answer this file exists to give)

```css
:root {
  /* DURATIONS — time, not length: the units hierarchy (Core Rule 16) does not apply */
  --eu-dur-instant: 70ms;   /* press in, state layer on press                       (NEW) */
  --eu-dur-fast:    150ms;  /* hover / focus colour, small exits, floating label    (was 120ms) */
  --eu-dur-base:    300ms;  /* a control moving: lift, toggle thumb, tab indicator  (was 200ms) */
  --eu-dur-slow:    400ms;  /* menus, accordions, toasts, small entrances           (was 320ms) */
  --eu-dur-slower:  500ms;  /* dialogs, sheets, section entrances                   (kept) */
  --eu-dur-page:    300ms;  /* page / screen change (PT-3: ≈300, ≤400)              (NEW) */
  --eu-dur-reveal:  800ms;  /* hero / heading text reveal                           (NEW) */
  --eu-dur-loop:    1500ms; /* one cycle of a busy indicator                        (NEW, CE-11) */
  --eu-dur-stagger: 60ms;   /* per item                                             (NEW, EX-6) */
  --eu-stagger-cap: 500ms;  /* the whole sequence, whatever the item count          (NEW, MR-20) */

  /* EASINGS — role names; the old names stay as aliases so nothing that reads them breaks */
  --eu-ease-standard:   cubic-bezier(0.2, 0, 0, 1);    /* begins and ends on screen (M3 standard; kept) */
  --eu-ease-out:        cubic-bezier(0.23, 1, 0.32, 1); /* ENTER — decelerates (easeOutQuint; was (0,0,.2,1)) */
  --eu-ease-in:         cubic-bezier(0.4, 0, 1, 1);     /* EXIT — accelerates (kept) */
  --eu-ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);   /* system-moved, starts and ends at rest (kept) */
  --eu-ease-enter: var(--eu-ease-out);  --eu-ease-exit: var(--eu-ease-in);
  --eu-ease-emphasized: linear(0 0%, 0.021 5%, 0.093 10%, 0.192 13.3%, 0.273 15%, 0.403 16.7%, 0.542 18.3%,
                               0.636 20%, 0.719 22.5%, 0.773 25%, 0.84 30%, 0.912 40%, 0.951 50%, 0.973 60%,
                               0.995 80%, 1 100%);           /* M3 emphasized, the true two-segment curve (was an overshoot) */
  --eu-ease-overshoot:  cubic-bezier(0.2, 0, 0, 1.2);   /* the OLD "emphasized", renamed — playful personality only */
  --eu-ease-spring:         linear(0, 0.088, 0.264, 0.45, 0.613, 0.74, 0.833, 0.898, 0.94, 0.967, 0.984, 0.993, 1); /* spatial, ζ 0.9 */
  --eu-ease-spring-effects: linear(0, 0.157, 0.411, 0.623, 0.771, 0.866, 0.923, 0.957, 0.976, 0.987, 0.993, 0.996, 1); /* colour/opacity, ζ 1 */
  --eu-ease-spring-bouncy:  linear(0, 0.145, 0.436, 0.721, 0.93, 1.048, 1.092, 1.089, 1.065, 1.036, 1.013, 0.999,
                                   0.992, 0.991, 0.993, 0.996, 1);   /* ζ 0.6, 9.5 % overshoot — playful only, re-sample at 40+ stops */
}
@media (prefers-reduced-motion: reduce) {
  :root { --eu-dur-stagger: 0ms; --eu-dur-reveal: var(--eu-dur-fast);
          --eu-ease-spring: var(--eu-ease-spring-effects); --eu-ease-spring-bouncy: var(--eu-ease-spring-effects);
          --eu-ease-overshoot: var(--eu-ease-standard); }
}
```

**In one line:** instant 70 · fast 150 · base 300 · slow 400 · slower 500 · page 300 · reveal 800 · loop 1500 ms ·
stagger 60 ms capped at 500 ms · standard (.2,0,0,1) · enter (.23,1,.32,1) · exit (.4,0,1,1) · in-out (.4,0,.2,1) ·
emphasized = M3 `linear()` · springs = two `linear()` shapes (spatial ζ 0.9, effects ζ 1) + bouncy ζ 0.6 for playful only ·
exits ≤ 0.75 × their entrance, rounded down to a token.

**Why these values (the evidence for each):**

| Token | Measured on the web | Systems | Decision |
|---|---|---|---|
| instant 70 | 100 ms is the shortest common value (3,633 elements); press is rarely measured | Carbon fast-01 70 · Fluent ultraFast 50 · M3 short1–2 50/100 · Atlassian 50/100 · Comeau press 34 | 70: every system has a step here; we have none |
| fast 150 | 150 ms ×2,657; hover colour on award sites p25 = 200 | M3 short3 150 · Fluent fast 150 · Carbon moderate-01 150 · Atlassian 150 · Polaris 150 · M3 field label 150 | **150 — 120 is in no system** |
| base 300 | **element median 300** (85k); uiverse median 300; hovered-element median 300 | M3 medium2 300 = "standard" · Fluent slow 300 · M3 switch thumb 300 | 300: the one value the web, the galleries and Material agree on |
| slow 400 | 400 ms ×8,911 | M3 medium4 400 / emphasized-decelerate enter 400 · Fluent slower 400 · Carbon slow-01 400 | 400 |
| slower 500 | 500 ms ×8,671 | M3 long2 500 (dialog, menu) · Polaris max 500 · Fluent ultraSlow 500 | 500 (kept) |
| page 300 | page transitions not timed by the runs (03 / PT-3) | Next.js guide 150 + 210 · M3 standard 300 | 300 (≤ 400) |
| reveal 800 | keyframe 800 ms ×408 (second only to 12 s marquees); award reveals 0.8–1.2 s | — | 800, hero and heading only |
| stagger 60 / cap 500 | — | Carbon 20 ms, sequence ≤ 500 ms · Fluent "short offsets" · motion-effects 60 | 60 per item, total ≤ 500 |
| enter (.23,1,.32,1) | the only named curve in **both** the live top 12 (1,564) **and** uiverse (112); easeOut-family curves are 5 of the live top 12 | M3 emphasized-decelerate (.05,.7,.1,1) · Atlassian bold (0,.4,0,1) | (.23,1,.32,1): measured, strong, no overshoot |
| exit (.4,0,1,1) | ease-in is not in the live top 12 (exits are rare as transitions) | M3 legacy-accelerate · Polaris ease-in (.42,0,1,1) | kept |
| standard / in-out | (.4,0,.2,1) is #5 live (3,312) | M3 standard (.2,0,0,1) | both kept |

### Where today's tokens differ (grepped 2026-10-02)

| Today | File:line | Proposed |
|---|---|---|
| `fast 120ms · base 200ms · slow 320ms · slower 500ms` — 4 durations | `lib/educo-ui/tokens.ts:47` | 150 · 300 · 400 · 500, plus instant / page / reveal / loop / stagger / cap |
| `standard (.2,0,0,1) · in (.4,0,1,1) · out (0,0,.2,1) · in-out (.4,0,.2,1) · emphasized (.2,0,0,1.2)` | `lib/educo-ui/tokens.ts:49-53` | `out` → (.23,1,.32,1); `emphasized` → M3 `linear()`; the old curve becomes `overshoot`; add `enter`/`exit` aliases and three springs |
| `emphasized` is a 20 % overshoot, not Material's emphasized | `lib/educo-ui/tokens.ts:52` | rename (MR-9) |
| Emitted as `--eu-dur-*` / `--eu-ease-*` | `lib/educo-ui/tokens.ts:164-165` | same emitter, more keys |
| **`--eu-ease-in`, `--eu-ease-out`, `--eu-ease-in-out`, `--eu-ease-emphasized`, `--eu-dur-slower` are read by nothing** — grep `var(--eu-ease-…)` in `lib/`: 29 × `standard`, 0 × the rest; durations: 14 × `base`, 13 × `fast`, 2 × `slow`, 0 × `slower` | `lib/**/*.ts` | changing their values is therefore safe today |
| Hover fallback `.18s` when tokens are missing | `lib/interactions.ts:35` | `var(--eu-dur-base, 300ms)` |
| Entrance fallback `.55s` (token `slow` is 320) | `lib/interactions.ts:212` | `var(--eu-dur-slow, 400ms)` |
| Stagger 90 ms × 9 steps = 810 ms before the 10th item | `lib/interactions.ts:238` | `min(i × 60, 500) ms` (MR-20 / EX-6) |
| Toast dismiss `opacity .18s, transform .18s` + `setTimeout(180)` inline | `lib/box-model.ts:2027` | `--eu-dur-fast` + `--eu-ease-in` |
| Global reduce sets `.01ms` durations but **no `animation-iteration-count: 1`** | `lib/educo-ui/base.ts:145-147` | add it (MR-17); the Educo **web app** already has it (`app/globals.css:134-136`) |
| Canvas copy of the global reduce rule, same omission | `components/website/box/BoxCanvas.tsx:3551` | same fix |
| Native literals: spinner 1000 / 800 ms, dropdown 200 ms, tab bar friction 5 / tension 100, 80 ms, friction 3 / tension 200 | `apps/mobile/components/ui/Spinner.tsx:37,47,53` · `FormDropdown.tsx:74` · `BottomTabBar.tsx:220-249` | the same tokens as numbers (11.15, AM-24) |

### Reduced-motion mapping, per family (what `reduce` turns each family into)

| Family | Under `prefers-reduced-motion: reduce` (and the visitor switch, 11.8) | Kept |
|---|---|---|
| 1 Held | bars still stick; "arrival" switches **stepped** (no scrubbed animation), never left see-through (MR-2) | position |
| 2 Scroll | parallax, scrubbed transforms, smooth scroll, marquee: **off**; scroll-linked fades become instant | content where it ends |
| 3 Section transition | wipes and overlaps become cuts or a ≤ `fast` fade | colours |
| 4 Page / screen | cross-fade ≤ `fast`, or plain navigation | focus moves to the new `h1`/`main` |
| 5 Entrance / exit | movement → **fade at `fast`** ("swap, don't strip"; MR-1); stagger 0 | dialogs/menus still open and close |
| 6 Hover / focus / press | transforms dropped; colour, shadow, outline, state layer **kept** | the whole focus ring |
| 7 Gesture | content follows the finger 1:1 (Apple: "track gestures"); no fling/bounce after release | the gesture itself |
| 8 Feedback / state | loops stop **except a busy indicator** (Apple, Atlassian — see 11.7); counters show the final value | ticks, words, status text |
| 9 Text | split / typed / scrambled text shown whole and still | the text |
| 10 Surface | glass → solid under `prefers-reduced-transparency` (MR-18); animated blur off | shadows, colours |
| 11 Tokens | `--eu-dur-stagger: 0`; springs → the effects curve (no overshoot); `overshoot` → `standard` | durations of fades |

---

### 11.1 · The duration scale
- Family 11 · trigger n/a (applies to every transition and animation)
- **What a visitor sees** — things react at a speed that feels "instant" for a press, "quick" for a hover and
  "unhurried" for a dialog — the same speed for the same kind of change everywhere on the site and in the app.
- **How it is done** — the `--eu-dur-*` custom properties above, emitted by `tokensToCss`; every rule reads
  `var(--eu-dur-…)`, never a literal. Durations grow with the area that moves (Carbon / IBM `getDuration`; M3: fast for
  small components, default for partial-screen, slow for full-screen).
- **Timing** — measured: element median 300 ms (IQR 250–500, n 84,910); hovered elements 300 ms (IQR 200–450, n 758);
  uiverse 300 ms (IQR 250–500, n 5,658); Animista median 500 ms (n 662); motion.dev 600 ms (n 179). → the scale above.
- **Phone** — kept; durations are not shortened on phones (a 90–120 Hz budget phone renders the same time in more
  frames). Long durations on low-cost phones are not the risk — non-compositor properties are (11.11).
- **Reduced motion** — fades keep their duration (≤ `fast`); movement is swapped (11.6).
- **Accessibility** — 2.2.2: nothing that runs > 5 s by itself without a pause (11.9). Never make a person wait for an
  animation to finish before they can act (Apple HIG Motion).
- **Cost** — none. **How common** — every design system has a named scale (M3 16 steps, Fluent 8, Polaris 12, Carbon 6,
  Atlassian 6); 0 of the 77 Codrops demos and 2 % of uiverse elements read any token (hex/px everywhere, 08 §1.1).
- **Examples** — material-web `tokens/versions/v0_192/_md-sys-motion.scss`; `@fluentui/tokens` `durations.ts`;
  Polaris `polaris-tokens/src/themes/base/motion.ts`; IBM motion generator `https://ibm.github.io/motion/` (mr.json).
- **Surfaces** — builder canvas and export (one emitter) · every component · Educo web app (Tailwind `duration-*` today,
  not tokens) · React Native: `Animated.timing({duration})` / Reanimated `withTiming({duration})` with the same numbers.
- **Builder status** — **PARTIAL**: 4 durations at `lib/educo-ui/tokens.ts:47`, emitted at `:164`; literals bypass them
  at `lib/interactions.ts:35`, `:212`, `:238`, `lib/box-model.ts:2027`.
- **Gap id** — MR-9, MR-23 (values above), **MR-25** (new: the five unread ease/duration tokens and the literal
  fallbacks are fixed in the same change, so the scale has one reader per token).

### 11.2 · Easing curves (cubic-bezier) by role
- Family 11 · trigger n/a
- **What a visitor sees** — things arriving slow down into place; things leaving speed up and go; things that move
  across the screen start and stop gently. Nothing moves at a robotic constant speed except a spinner or a scroll-linked
  effect.
- **How it is done** — five role names: `standard` (state change that begins and ends on screen), `out`/`enter`
  (decelerate in), `in`/`exit` (accelerate out), `in-out` (system-moved), `emphasized` (big, important moves: dialogs,
  sheets, page). `linear` only for scroll-linked effects and loops. One or two properties per transition (Atlassian).
- **Timing** — measured: plain `ease` is on 40,904 elements (it is the default — authors who choose a curve choose a
  strong ease-out: easeOutCubic 3,334, easeOutExpo 3,114, easeOutQuint 1,564, easeOutQuart 1,453); GSAP power2/3 and
  expo `.out`/`.inOut`. uiverse: 59 % plain `ease`; first named curve (.23,1,.32,1) ×112. → the table above.
- **Phone** — kept; a curve costs nothing.
- **Reduced motion** — the overshoot curves (`overshoot`, `spring-bouncy`) map to `standard` / the effects spring.
- **Accessibility** — 2.3.3: overshoot and bounce are motion; never on transitions that happen often (M3).
- **Cost** — none. **How common** — 732 / 732 sites use at least one easing; 2 % write `linear()`.
- **Examples** — easings.net presets (the live top 12 are its quart/quint/expo/cubic); Atlassian motion overview;
  Carbon productive/expressive curves; `https://easingwizard.com/` (mr.json).
- **Surfaces** — all · RN: `Easing.bezier(x1,y1,x2,y2)` is a 1:1 map of `cubic-bezier`; Reanimated `Easing.bezier`.
- **Builder status** — **PARTIAL**: 5 curves at `lib/educo-ui/tokens.ts:49-53`; only `standard` is read
  (29 × `var(--eu-ease-standard`; 0 × the others); `emphasized` (`:52`) is an overshoot.
- **Gap id** — MR-9, MR-23, MR-25.

### 11.3 · Springs as `linear()` (and as real springs on native)
- Family 11 · trigger n/a
- **What a visitor sees** — a toggle, a sheet or a card settles into place like a physical object, with at most a
  hair of overshoot; a playful site may bounce a little.
- **How it is done** — M3's six spring tokens are **two shapes × the duration scale** (06 §4): spatial ζ 0.9 (curve A)
  and effects ζ 1 (curve B). Expressive ζ 0.6 (9.5 % overshoot) is the third, playful-only shape. In CSS, `linear()`
  with the stops above (Baseline Dec 2023; Chrome 113, Firefox 112, Safari 17.2); `@supports not (transition-timing-
  function: linear(0,1))` falls back to `--eu-ease-out`. On native, a real spring: Reanimated
  `withSpring(v, { dampingRatio: 0.9, duration: 300 })`.
- **Timing** — M3 web conversion: spatial 350 / 500 / 750 ms, effects 150 / 200 / 300 ms; motion.dev examples (n 68):
  stiffness median 200, damping 22, bounce 0.24. → spatial spring at `base`/`slow`, effects spring at `fast`/`base`.
- **Phone** — kept (a curve). Native springs run on the UI thread in Reanimated.
- **Reduced motion** — "tighten springs" (Apple): spatial and bouncy → the effects shape, which never overshoots (MR-19).
- **Accessibility** — 2.3.3; bounce is a vestibular trigger when large.
- **Cost** — none in CSS; a 13–17-stop `linear()` is ~200 bytes, emitted once in `:root`.
- **How common** — `linear()` in 12 / 732 sites (2 %); springs in 68 of 214 motion.dev examples with source; M3
  "uses springs when possible" since May 2025.
- **Examples** — `https://linear-easing-generator.netlify.app/` (Jake Archibald; "Material emphasized" preset);
  Josh Comeau "Springs and bounces in native CSS"; Jetpack Compose `StandardMotionTokens.kt`; `whimsy.joshwcomeau.com`.
- **Surfaces** — all; native via Reanimated (installed, `apps/mobile/package.json:45`, unused: 0 imports).
- **Builder status** — **GAP**: grep `linear(` in `lib/`: 0.
- **Gap id** — MR-19, MR-23.

### 11.4 · Stagger, and its cap
- Family 11 · trigger load | scroll
- **What a visitor sees** — a row of cards or the words of a heading arrive one after another, quickly; the last one
  is never left waiting.
- **How it is done** — `animation-delay: min(calc(var(--i) * var(--eu-dur-stagger)), var(--eu-stagger-cap))` with
  `--i` emitted by the exporter (one custom property per item instead of nine `:nth-child` rules). For text split into
  n letters: step = `min(var(--eu-dur-stagger), cap / n)`.
- **Timing** — Carbon: 20 ms steps, sequence ≤ 500 ms; Fluent "short offsets"; text reveals 30–60 ms per word or
  letter (motion-effects §4) → 60 ms per item, 500 ms total.
- **Phone** — kept; each item is a compositor animation.
- **Reduced motion** — `--eu-dur-stagger: 0` (everything arrives together, as a fade).
- **Accessibility** — order follows the DOM / reading order; content never waits on the stagger to be readable by a
  screen reader (it is in the DOM from the start).
- **Cost** — style calculation: one rule per item instead of nine `:nth-child()` selectors per block (06 R4).
- **How common** — uiverse / Codrops staggers are per-letter (not counted); GSAP `stagger` is in the award sites'
  scripts (not counted separately by the runs).
- **Examples** — Carbon choreography page; M3 menu (items fade in 250 ms staggered inside a 500 ms open);
  `https://codepen.io/jh3y/pen/yLGOaLG` (mr.json).
- **Surfaces** — entrances (5), text (9), dashboards in the app (A-19, 20 ms / 500 ms) · RN: Reanimated
  `entering={FadeIn.delay(i * 60)}` capped the same way.
- **Builder status** — **PARTIAL**: stagger exists, uncapped, 90 ms × 9 `nth-child` rules (`lib/interactions.ts:234-239`).
- **Gap id** — MR-20, EX-6.

### 11.5 · Exit shorter than enter
- Family 11 · trigger state
- **What a visitor sees** — a menu or dialog opens with a little ceremony and closes briskly.
- **How it is done** — the exit uses the next shorter token and the exit curve: open `slower` + `enter`, close `base`
  + `exit`; open `slow`, close `base`/`fast`. Rule: exit ≤ 0.75 × entrance, rounded down to a token.
- **Timing** — M3 dialog 500 / 150, menu 500 / 150, checkbox 350 / 150; Atlassian "exits 50–100 ms shorter";
  Animista entrances 0.4–0.7 s, exits 0.45–0.6 s.
- **Phone** — kept. **Reduced motion** — both become a `fast` fade.
- **Accessibility** — focus moves and the screen reader is told at the **start** of the exit, never after it (Atlassian).
- **Cost** — none. **How common** — every system; live sites not measurable (the runs do not close things).
- **Examples** — material-web dialog / menu source; Atlassian "Applying motion".
- **Surfaces** — dialogs, menus, toasts, tooltips, sheets (5 / 8) · RN `Modal` / Reanimated `exiting`.
- **Builder status** — **GAP**: no exit token; the only exit (toast dismiss) is a literal `.18s` (`lib/box-model.ts:2027`).
- **Gap id** — MR-9.

### 11.6 · Reduced motion: swap, don't strip
- Family 11 · trigger setting (`prefers-reduced-motion: reduce`, Android "Remove animations", the visitor switch 11.8)
- **What a visitor sees** — with Reduce Motion on, nothing slides, zooms, tilts or parallaxes; things still appear and
  disappear (by a short fade) and every hover, focus and press still shows.
- **How it is done** — **no-motion-first**: moving effects are written inside `@media (prefers-reduced-motion:
  no-preference)`, so an unknown browser gets none (Tatiana Mac, Smashing). The exporter decides the wrapping, never
  the author (motion-effects §6 rule 1). Per family: the mapping table above. JS animations ask
  `matchMedia('(prefers-reduced-motion: no-preference)')` **and listen for `change`** (SCR40).
- **Timing** — the replacement fade ≤ `--eu-dur-fast`.
- **Phone** — on Android the only switch is "Remove animations" (`TRANSITION_ANIMATION_SCALE` = 0); Chrome reports it
  as `reduce`. Shared and low-cost phones rarely have it set — hence 11.8.
- **Accessibility** — WCAG 2.3.3 (AAA; C39, SCR40). Apple's triggers: parallax, animated blur, multi-axis or
  multi-speed motion, spinning, large objects flying in, auto-advancing carousels, oscillation near 0.2 Hz.
- **Cost** — none; it removes work.
- **How common** — **25 %** of live sites mention the query; **70 %** still move on scroll when it is on; 0 of 77 Codrops
  demos, 10 of 3,802 uiverse elements, 7 of 462 motion.dev pages handle it.
- **Examples** — sites with gating + `:focus-visible` + reduced motion together: keikku.health, madebyanalogue.co.uk/studio,
  14islands.com, theqream.com, fitsole.shop/about (aw-coll-hovers); Lenis turns smoothing off by itself (measured on
  cuberto.com); `https://googlechrome.github.io/samples/prefers-reduced-motion/` (mr.json).
- **Surfaces** — all · RN: `AccessibilityInfo.isReduceMotionEnabled()` + `reduceMotionChanged` (live); Reanimated
  `ReduceMotion.System` (default on `withTiming`/`withSpring`).
- **Builder status** — **PARTIAL**: strip, not swap — hover drops transforms (`lib/interactions.ts:106-108`, good),
  entrances `animation:none` (`:246`), arrival `animation:none` (`lib/box-model.ts:6366`), the pager reads the setting
  once and never listens (`lib/box-model.ts:3621`). Native: **GAP** (0 hits for `isReduceMotionEnabled` /
  `useReducedMotion` / `ReduceMotion` in `apps/mobile`).
- **Gap id** — MR-1, MR-16, MR-19, AM-2.

### 11.7 · The global safety net (stop loops, don't speed them up)
- Family 11 · trigger setting
- **What a visitor sees** — with Reduce Motion on, an animation the builder did not anticipate (user CSS, a future
  preset) stops on its last frame instead of flickering.
- **How it is done** —
  ```css
  @media (prefers-reduced-motion: reduce), (update: slow) {
    .eu-root *, .eu-root *::before, .eu-root *::after {
      animation-duration: .01ms !important; animation-iteration-count: 1 !important;
      transition-duration: .01ms !important; scroll-behavior: auto !important; } }
  .eu-root [role="progressbar"], .eu-root [aria-busy="true"] .eu-spinner { animation-duration: var(--eu-dur-loop) !important;
    animation-iteration-count: infinite !important; }   /* a busy spinner keeps turning (Apple, Atlassian) */
  ```
- **Timing** — n/a. **Phone** — kept; `(update: slow)` also covers e-ink and very slow screens.
- **Reduced motion** — this is the rule.
- **Accessibility** — without `iteration-count: 1`, an infinite animation cycles every 0.01 ms and shows a random frame
  per paint — a strobe, a 2.3.1 risk. A busy indicator that freezes "looks stalled" (Apple).
- **Cost** — none. **How common** — Animate.css ships exactly this block (08 §1.2); the Educo web app has it.
- **Examples** — Animate.css `source/_base.css`; Smashing "Respecting users' motion preferences"; Educo
  `app/globals.css:134-136`.
- **Surfaces** — builder export and canvas · Educo web app (has it; but it freezes `animate-spin`, AM-15).
- **Builder status** — **PARTIAL**: `lib/educo-ui/base.ts:145-147` and `components/website/box/BoxCanvas.tsx:3551`
  set durations only. No infinite animation exists in the engine today (grep `infinite` in `lib/interactions.ts`,
  `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/`: 0 hits), so this is latent until user CSS or a loader adds one.
- **Gap id** — MR-17, AM-15.

### 11.8 · A visitor-facing motion switch
- Family 11 · trigger click (setting on the site)
- **What a visitor sees** — a "Reduce motion" button in the footer or accessibility menu; pressing it stills the site and
  it stays stilled on every page.
- **How it is done** — `<button type="button" data-eu-motion-toggle aria-pressed="false">Reduce motion</button>`;
  moving effects are emitted under `no-preference` **and** `:root:not([data-eu-motion="reduce"])`; a few lines set the
  attribute from `localStorage` (try/catch) before first paint (06 §3).
- **Timing** — n/a. **Phone** — the main audience: shared and low-cost phones rarely have the OS setting turned on.
- **Reduced motion** — seeded from the OS setting; the site choice can only reduce further.
- **Accessibility** — WCAG 2.3.3 Example 1; the button is a real toggle (`aria-pressed`), reachable, labelled.
- **Cost** — ~0.3 KB script. **How common** — rare on live sites (not counted by the runs); Greg Tarnoff's prototype
  `https://codepen.io/gregtarnoff/pen/JoMxpK` and Michelle Barker's `--playState` pens (mr.json).
- **Surfaces** — builder export (site setting) · Educo web app (settings) · RN: an in-app switch that overrides
  `isReduceMotionEnabled` for the app only.
- **Builder status** — **GAP** (0 hits for a site-level motion setting in `lib/`).
- **Gap id** — MR-7.

### 11.9 · Anything that moves by itself for more than 5 s gets a visible Pause
- Family 11 · trigger time
- **What a visitor sees** — beside every carousel, marquee, ticker, Ken Burns photo, cycling headline or video
  background, a Pause button that stays paused.
- **How it is done** — a real `<button>` whose **label changes** ("Stop slide rotation" / "Start slide rotation"), first
  focusable thing in the component; rotation stops on hover and when focus enters and does **not** resume when focus
  leaves; `aria-live="off"` while moving, `"polite"` when stopped (WAI carousel tutorial, APG). Or the content runs once
  and stops within 5 s.
- **Timing** — the 5-second rule (2.2.2); auto-updating content needs the control with no 5-s allowance.
- **Phone** — the button is the only control a finger has (hover-pause does nothing on touch).
- **Reduced motion** — never starts.
- **Accessibility** — 2.2.2 (A; G4, G186, SCR33; failure F16 when it restarts by itself), 2.2.1 for time limits.
- **Cost** — none. **How common** — **51 %** of live sites move something with no scroll (373 / 732); the 12 s marquee
  is the single most common animation duration (531).
- **Examples** — WAI carousel working example and APG carousel-1 / carousel-2 (mr.json); W3C SCR33 scroll-pause example.
- **Surfaces** — pager, future marquee / carousel / ticker / video background; toasts (2.2.1) · Educo app carousels.
- **Builder status** — **GAP**: the pager pauses on hover/focus only and restarts on `focusout`
  (`lib/box-model.ts:3657-3669`; see 06 R1); the alert timer has no visible stop (`lib/box-model.ts:2020-2035`).
- **Gap id** — MR-4, MR-5, MR-16.

### 11.10 · No flashing
- Family 11 · trigger any
- **What a visitor sees** — nothing on the page flashes or flickers.
- **How it is done** — no flashing presets exist; any user-set rate is validated against ≤ 3 flashes a second and the
  341 × 256 CSS px area; glitch / pixel effects cap flicker below 3 Hz; uploaded GIFs that loop longer than 5 s get a still
  frame under `reduce` (`<picture><source media="(prefers-reduced-motion: reduce)">`).
- **Timing** — ≤ 3 Hz. **Phone** — same. **Reduced motion** — still frame.
- **Accessibility** — 2.3.1 (A), 2.3.2 (AAA). A builder cannot measure every frame a user uploads, so the safe rule is
  "no flashing presets at all".
- **Cost** — none. **How common** — not measured by the runs.
- **Examples** — W3C G19, G176; PEAT.
- **Surfaces** — all.
- **Builder status** — **HAVE** (by absence): no blink / flash keyframes (grep `blink|flash|flicker`, case-insensitive,
  in `lib/interactions.ts`, `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/`: 0).
  Uploaded GIFs: **CHECK** (MR-21).
- **Gap id** — MR-21.

### 11.11 · Compositor-only motion, measured on a low-cost Android
- Family 11 · trigger any
- **What a visitor sees** — on a Tecno / itel / Samsung A-class phone, motion is smooth or absent — never a stutter
  that makes the page feel broken.
- **How it is done** — animate only `transform` (incl. `translate`/`scale`/`rotate`) and `opacity`. `filter`,
  `backdrop-filter`, `box-shadow`, `clip-path` (outside Chromium) and colour repaint every frame: fine on a button, never
  on a grid of cards or a whole bar. Never a layout property (`width`, `height`, `top`, `padding`, `flex-grow`). Never
  `transition: all` (64 % of uiverse transitions) — name the properties. No styles written from a `scroll` /
  `touchmove` handler; read geometry before writing (06 §5).
- **Timing** — the frame budget: 16.7 ms at 60 Hz, **8.3 ms at 90–120 Hz** (many budget phones); 3–4 ms of JS per frame.
- **Phone** — the reason for this rule. The 2026 baseline phone (Galaxy A24 class) is ~9× slower single-core than an
  iPhone; Nigeria P75 network 3.1 Mbps / 190 ms RTT.
- **Reduced motion** — n/a. **Accessibility** — INP ≤ 200 ms: JS tweens on tap are an INP risk, CSS transitions are not.
- **Cost** — this is the cost rule. **How common** — phone: re-measure pending (R-16) — the runs' 360 px emulation did
  not take effect, so no phone long-task figure is cited. Desktop: median long-task time while scrolling **0 ms** (n 732);
  the award sites' cost is **weight** (11.13), not scroll jank on a fast machine.
- **Examples** — web.dev "Stick to compositor-only properties"; Margelo "Chasing a phantom jump" (2026; 85 % janky frames
  at 120 Hz from a fixed per-frame cost); `https://infrequently.org/2024/01/performance-inequality-gap-2024/chart/`.
- **Surfaces** — all · RN: `useNativeDriver: true` (Animated) or Reanimated worklets; ≤ ~100 animating components at
  once on low-cost Android (Reanimated guide).
- **Builder status** — **PARTIAL**: user CSS refuses layout-property animation (`lib/box-model.ts:1255-1273`); the
  built-in `condense` arrival animates `padding-block` + `min-height` and `glass` animates `backdrop-filter` per scroll
  frame (`lib/box-model.ts:6263-6271`); horizontal accordion transitions `flex-grow` (`lib/educo-ui/components.ts:468`);
  Lift / Glow animate `box-shadow` (`lib/interactions.ts:43-50`).
- **Gap id** — MR-3, MR-22, SH-6, EX-5.

### 11.12 · Layers: `will-change` only in time, `content-visibility` for long pages
- Family 11 · trigger n/a
- **What a visitor sees** — a long school page opens fast and scrolls without the phone heating up.
- **How it is done** — no `will-change` in a stylesheet for many elements (each layer costs GPU memory and upload);
  set it just before an animation and remove it after, or not at all. Long below-the-fold sections:
  `content-visibility: auto; contain-intrinsic-size: auto 40rem` (web.dev demo 232 → 30 ms first render).
- **Timing** — n/a. **Phone** — 2–3 GB phones are where layer memory runs out first.
- **Reduced motion** — n/a. **Accessibility** — check anchors, find-in-page and the pin stack still work with
  `content-visibility` (MR-11).
- **Cost** — this is a cost rule. **How common** — not counted by the runs.
- **Examples** — web.dev `content-visibility`; MDN "CSS and JavaScript animation performance".
- **Surfaces** — builder export · Educo web app long lists.
- **Builder status** — `will-change`: **HAVE** (none emitted; one comment `lib/box-model.ts:6385`);
  `content-visibility`: **GAP** (0 hits).
- **Gap id** — MR-11.

### 11.13 · Weight before motion (no motion library by default)
- Family 11 · trigger load
- **What a visitor sees** — the page arrives on 3G in seconds, not after a spinner.
- **How it is done** — every effect in the catalogue is CSS. A JS effect (tilt, magnetic, smooth scroll, split text, WebGL)
  loads lazily, only on a page that uses it, and only when `no-preference` and `(pointer: fine)` say it can run
  (`matchMedia` before the `import()` — a data saving, D.md / Smashing). No GSAP, Lenis or three.js in the default export.
  An intro or preloader never holds content longer than the real load, and never hides the LCP element (MR-12).
- **Timing** — first band within 5 s on Slow 3G (RULE AF rule 2).
- **Phone** — the reason: HTML + CSS + JS ≤ 100 KB compressed per page, first view ≤ 500 KB (RULE AF rule 1).
- **Reduced motion** — the library is never fetched.
- **Accessibility** — a preloader that blocks interaction while content could be used fails 2.2.2's spirit.
- **Cost** — measured on the award sites: **median page 2,951 KB**, only **23 %** under 1 MB; three.js / canvas on 58 %,
  GSAP 17 %, Lenis 16 %, an **opaque** full-screen cover still showing at 0.7 s on **38 %** (corrected; see the table).
- **How common** — see cost.
- **Examples (of what not to copy)** — the sites with an opaque full-screen intro cover (aggregate "intro" line, opaque
  covers only — 38 %).
- **Surfaces** — builder export (weight audit, page report) · Educo web app (no motion library installed; keep it so).
- **Builder status** — **HAVE**: the exported motion is pure CSS (`lib/interactions.ts:12-13`); scripts are emitted only
  when a feature needs them (pager, pin stack, alert). Weight audit line: per RULE AF.
- **Gap id** — MR-12, MR-13 (and the RULE AF weight audit).

### 11.14 · Other user preferences: transparency, contrast, forced colours
- Family 11 · trigger setting
- **What a visitor sees** — with "Reduce transparency" on, glass becomes solid; with "Increase contrast", focus rings get
  thicker; in Windows High Contrast, every ring and boundary is still visible.
- **How it is done** — `@media (prefers-reduced-transparency: reduce)` → solid surface instead of `backdrop-filter`;
  `@media (prefers-contrast: more)` → thicker / dotted ring (Carbon); `@media (forced-colors: active)` → system colours
  (`CanvasText`, `Highlight`); every ring keeps an `outline` (a `box-shadow` ring is forced to `none`).
- **Timing** — n/a. **Phone** — glass is the heaviest paint on a cheap GPU; removing it helps those phones most.
- **Reduced motion** — separate preferences, same treatment: honour each.
- **Accessibility** — 1.4.11, 2.4.7 (F78), 1.4.3.
- **Cost** — none. **How common** — not counted on live sites; M3 web ships `forced-colors` rules for switch, radio,
  ripple, field, progress, slider.
- **Examples** — Carbon `_focus-outline.scss`; `@atlaskit/focus-ring`; Chrome DevTools "Emulate CSS media features".
- **Surfaces** — all · RN: `AccessibilityInfo.isReduceTransparencyEnabled()` (iOS), `isHighTextContrastEnabled` (Android).
- **Builder status** — **GAP**: grep `forced-colors`, `prefers-contrast`, `reduced-transparency` in `lib/`: 0 each.
- **Gap id** — MR-18, HV-15, HV-19, SH-7.

### 11.15 · One token set for web and native
- Family 11 · trigger n/a
- **What a visitor sees** — the Educo app on a phone feels like the school's website: the same speeds, the same curves.
- **How it is done** — export the motion tokens from `lib/educo-ui/tokens.ts` as plain numbers (`{ fast: 150, … }`,
  `{ out: [0.23, 1, 0.32, 1], … }`), import them in `apps/mobile` through the `@core` alias; `Easing.bezier(...EASE.out)`;
  springs as Reanimated `{ dampingRatio, duration }`; one live reduce-motion hook (09 A-22).
- **Timing** — the scale above. **Phone** — the native app *is* the phone surface; `Pressable` `android_ripple` is the
  cheapest press feedback (→ 6.17).
- **Reduced motion** — `isReduceMotionEnabled` + `reduceMotionChanged` (live); Reanimated's `useReducedMotion()` reads
  once at start only.
- **Accessibility** — as 11.6. **Cost** — none.
- **How common** — M3, Fluent and Carbon each ship one token set across platforms.
- **Examples** — Reanimated `docs/device/useReducedMotion`; M3 Compose `MotionScheme.kt`.
- **Surfaces** — Educo web app · React Native app (phone and tablet) · builder.
- **Builder status** — **GAP** in the app: literals at `apps/mobile/components/ui/Spinner.tsx:37,47,53`,
  `FormDropdown.tsx:74`, `BottomTabBar.tsx:220-249`; Reanimated `~4.1.1` declared (`apps/mobile/package.json:45`), 0 imports.
- **Gap id** — AM-24, AM-2, AM-20.

### 11.16 · Motion never hides or delays meaning
- Family 11 · trigger any
- **What a visitor sees** — the error message, the new page's heading and the hero photo are there at once; motion only
  decorates their arrival.
- **How it is done** — move focus and announce at the **start** of an animation; errors and confirmations are never held
  behind an entrance; the hidden `from` state of an entrance lives only inside the supported / observed branch, so
  content never depends on CSS or JS running (`lib/interactions.ts` "from hidden to natural" rule); the LCP element gets
  no entrance longer than `fast`, fade only; feedback is never motion alone (a word, an icon, a status message).
- **Timing** — ≤ `fast` on the LCP element. **Phone** — Slow 3G + 4× CPU is where a held hero costs seconds.
- **Reduced motion** — content simply present.
- **Accessibility** — 1.4.1, 4.1.3 (status messages), 2.4.3 focus order.
- **Cost** — none. **How common** — not counted directly; 38 % of the award sites still cover the page with an opaque
  layer at 0.7 s (corrected figure).
- **Examples** — Atlassian "Applying motion"; Apple HIG Feedback ("several channels").
- **Surfaces** — all.
- **Builder status** — **HAVE** for the from-state rule (`lib/interactions.ts:119-123`, `:232` `both` fill on a natural
  resting style); **CHECK** for the LCP rule (an entrance can be put on the hero band today).
- **Gap id** — MR-12, MR-13.

### 11.17 · How motion is tested (so the numbers mean something)
- Family 11 · trigger n/a
- **What a visitor sees** — nothing; this is the method that keeps the rest true.
- **How it is done** — every preset driven at 360 px with 4× CPU throttle in a headed browser; frames read in the
  DevTools Performance frames track (never a screen recording — `adb screenrecord` caps near 45 fps and hides jank); a
  second run with the screen at 60 Hz to separate a fixed per-frame cost from the animation's own; reduced motion
  ON / OFF; forced colours ON; all four themes; Slow 3G for anything that loads.
- **Timing / Phone / Reduced motion** — the matrix above. **Accessibility** — C39's three-step test.
- **Cost** — n/a. **How common** — n/a.
- **Examples** — Margelo 2026 method; MR-14, MR-15, MR-24 UAT lines.
- **Surfaces** — builder (headed UAT, RULE Z) · both emulators for the app (AM-25).
- **Builder status** — **GAP** (no motion line in `scripts/uat/page-audit.js` yet).
- **Gap id** — MR-14, MR-15, MR-24, AM-25.

---

## New gap ids raised in this file

| Id | Plain description | Sort |
|---|---|---|
| **MR-25** | Five motion tokens are emitted but read by nothing (`--eu-ease-in`, `-out`, `-in-out`, `-emphasized`, `--eu-dur-slower`), while literals bypass the scale (`lib/interactions.ts:35` `.18s`, `:212` `.55s`, `:238` 90 ms, `lib/box-model.ts:2027` `.18s`/180 ms). Adopt the token set above and route every literal through it in the same change, so each token has a reader and no literal remains. | MUST (with MR-9) |
| **MR-26** | The re-measured element-weighted transition median is 300 ms, not the aggregate's 350 ms (a per-site distinct-value median). `scripts/research/aggregate.js` should print both, labelled, so later readers do not take the per-site figure as "what a visitor sees". | CHECK (research tooling) |
