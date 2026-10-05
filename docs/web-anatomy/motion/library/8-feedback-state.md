# Family 8 · Feedback / state

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per technique, in the library's entry shape. Written
2026-10-02 from the measured runs ([AGGREGATE](../../research-runs/AGGREGATE.md) — the uiverse table is every one of
its 3,802 elements run locally), [08-component-effects](../08-component-effects.md) (uiverse CSS parsed, Animate.css,
Animista, motion.dev, Material source, HIG), [09-app-motion](../09-app-motion.md), [06-motion-rules](../06-motion-rules.md).
Every builder / app status line was grepped again on 2026-10-02.

**Tokens today** (`lib/educo-ui/tokens.ts:47-52`): `--eu-dur-fast` 120 · `base` 200 · `slow` 320 · `slower` 500;
`standard` · `in` · `out` · `in-out` · `emphasized` (overshoot (.2,0,0,1.2)). *(proposed)*: `--eu-dur-instant` 70 ms
(MR-9), `--eu-dur-loop` 1.5 s (CE-11), `--eu-ease-overshoot` (rename of `emphasized`, MR-9), state-layer opacities
`--eu-state-hover .08 / focus .10 / press .12 / drag .16` (CE-13).

**Two rules every entry follows.** (1) Feedback is never colour alone and never motion alone (WCAG 1.4.1, HIG): a word,
an icon, a tick or a live-region message carries the meaning; motion is emphasis. (2) A loop must stop: paused when
hidden, stopped under reduced motion — **except a busy indicator, which keeps turning or becomes a still "Loading…"
label** (Atlassian, Apple "a stationary indicator looks stalled").

## Most used first — measured 2026-10-02

| Technique | Measured share | Source / n | Entry |
|---|---|---|---|
| Loader / spinner (looping) | **718 of 3,802** uiverse elements (19 %) — 97 % animate at rest, **97 % keep running under reduced motion**, 3 of 718 announce themselves | uiverse, n 3,802 | F8.1 |
| Something keeps moving with no scroll (carousel, marquee, loop) | 373 / 732 sites (**51 %**); most common animation duration on live sites **12 s** (531 elements — marquees and loops) | live sites | F8.1, F8.17 |
| Press feedback (button dips / changes on press) | uiverse buttons: press changes transform in 351, shadow 201 of 1,231; `:active` in 39 % | uiverse | F8.9 |
| Toggle switch | 260 uiverse (unnamed **88 %**, keyboard-reachable 61 %, visible focus 58 %); click changes background 110, thumb `::before` transform 92 | uiverse | F8.6 |
| Checkbox / radio tick | 171 + 102 uiverse (unnamed 80 % / 44 %) | uiverse | F8.7 |
| Field states / validation | 226 inputs + 180 forms uiverse (input no label 69 %; shake keyframe 26) | uiverse | F8.8 |
| Notification / toast feedback | 23 uiverse (96 % animate at rest) | uiverse | Family 5 F5.12 |
| Lottie (animated icons, loaders) | 24 / 732 sites (3 %) | live sites | F8.1 |
| Skeletons, progress, count-up, copy, optimistic, offline, haptics | not counted by the runs; every system documents them | M3, HIG, Carbon, Fluent, Polaris, Atlassian | F8.2–F8.16 |

**What changes on a click across all of uiverse (n 3,802):** transform, shadow, background, border and colour lead in
every category; toggles change background (110) and a pseudo-element transform (92); checkboxes change background (55)
and an `::after` transform (44). 64 % of uiverse transitions are written `transition: all`.

---

## Entries

### F8.1 · Spinner (indeterminate loop)
- Family 8 · trigger state (waiting) | time
- **What a visitor sees** — a small ring turns while something loads, with a word saying what.
- **How it is done** — one element rotated linear, or an SVG arc with `stroke-dasharray`; a name for assistive tech:
  ```html
  <div role="status" aria-live="polite"><svg class="eu-spin" aria-hidden="true">…</svg><span>Loading fees…</span></div>
  ```
  ```css
  .eu-spin{animation:eu-spin var(--eu-dur-loop,1.5s) linear infinite} @keyframes eu-spin{to{rotate:1turn}}
  @media (prefers-reduced-motion:reduce){.eu-spin{animation-duration:3s}}  /* keep turning, slower — or hide and keep the text */
  ```
- **Timing** — uiverse loaders median **2 s** per cycle (IQR 1–3.2 s), 99 % infinite; Material circular 1,333 ms;
  motion.dev spinner 1.5 s; Polaris uses `linear` for spinners. → `--eu-dur-loop` *(proposed)* 1.5 s, `linear`.
- **Phone** — kept (transform loop is compositor-only); pause when `document.hidden`; one spinner per page (Atlassian).
- **Reduced motion** — keeps turning (Atlassian, Apple) or becomes a still icon + text. **Not** the 0.01 ms ×1 freeze
  that today's global rules apply.
- **Accessibility** — `role="status"`/`aria-busy` on the region; the label names the process; 2.2.2 pause for > 5 s;
  3 of 718 uiverse loaders have any of this.
- **Cost** — compositor for `rotate`; 114 uiverse loaders animate width/height/top/left and 72 `background-position` /
  `box-shadow` (repaint every frame).
- **How common** — uiverse 718; freefrontend loaders/spinners/skeletons/progress 474; Lottie 3 % of sites.
- **Examples** — material-web progress (circular) · uiverse `VashonG/spicy-crab-68` (the one loader with reduced
  motion) · motion.dev circle spinner · Atlassian spinner.
- **Surfaces** — builder (forms, embeds — rarely) · Educo web app (`PageLoader`, `InPageSpinner`, `PageSpinner`) · RN
  `ActivityIndicator` / custom Spinner.
- **Builder / app status** — builder **GAP** (0 hits spinner/`aria-busy` in `lib/`). Web **PARTIAL**:
  `components/shared/PageLoader.tsx:21`, `InPageSpinner.tsx:17`, `PageSpinner.tsx:28` `animate-spin` with no
  `role`/`aria` in any of the three; `app/globals.css:134-136` reduce rule sets `animation-duration:.01ms;
  animation-iteration-count:1`, which **freezes** every spinner (looks stalled); builder base rule
  (`lib/educo-ui/base.ts:145-146`) has no iteration-count, so a loop would **strobe**. RN **PARTIAL (defect)**:
  `apps/mobile/components/ui/Spinner.tsx:34-53` 1,000 ms rotation + 800 ms pulse loops, 0 accessibility props, no
  reduce check; root loader `apps/mobile/app/_layout.tsx:47` literal `#3b82f6`.
- **Gap id** — CE-11, CE-19, MR-17, AM-5, AM-15.

### F8.2 · Skeleton (grey shapes where content will be)
- Family 8 · trigger state (waiting)
- **What a visitor sees** — grey blocks in the shape of the page shimmer gently, then the real content fades in over them.
- **How it is done** — blocks at the final size (no layout shift) with one shimmer moved by `transform`, not
  `background-position`; `aria-busy="true"` on the region:
  ```css
  .eu-skel{position:relative;overflow:hidden;background:var(--eu-color-surface-2)}
  .eu-skel::after{content:"";position:absolute;inset:0;translate:-100% 0;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--eu-color-surface) 60%,transparent),transparent);animation:eu-shimmer var(--eu-dur-loop,1.5s) linear infinite}
  @keyframes eu-shimmer{to{translate:100% 0}} @media (prefers-reduced-motion:reduce){.eu-skel::after{animation:none}}
  ```
- **Timing** — shimmer 1.5–2 s (motion.dev, Fluent "in sync", M3); content fades in `--eu-dur-base`.
- **Phone** — **the right answer on 3G** (the layout is there in the first bytes; Wroblewski); one shared animation,
  not one per bone (Reanimated ≤ 100 rule).
- **Reduced motion** — static grey blocks.
- **Accessibility** — `aria-busy` then a polite "loaded"; never steal focus when content lands (Fluent).
- **Cost** — compositor if `transform`. **How common** — 136 uiverse keyframes animate `background-position` (the
  repaint version); freefrontend skeletons in 474 loaders.
- **Examples** — motion.dev `react-skeleton-shimmer` · moti.fyi/examples/skeleton (pattern only) · Fluent Skeleton · M3
  skeleton loaders.
- **Surfaces** — Educo web app (every list / dashboard), RN lists · builder: n/a (static HTML is the content).
- **App status** — web **PARTIAL**: one hand-written skeleton file found by `Skeleton` grep
  (`app/parents/meetings/[id]/loading.tsx`); `app/globals.css:692` `@keyframes shimmer`; no shared component. RN **GAP**.
- **Gap id** — AM-13, CE-11.

### F8.3 · Determinate progress bar
- Family 8 · trigger state (progress)
- **What a visitor sees** — a bar fills from left to right with "3 of 10 files".
- **How it is done** — `<progress>` or `role="progressbar"` with `aria-valuenow/min/max` and a label; fill by
  `transform: scaleX(var(--p))` from the inline start, never `width`.
- **Timing** — Material determinate step 250 ms `(.4,0,.6,1)`; never goes backwards; switch indeterminate →
  determinate, never back (Apple, M3). → `--eu-dur-base` per step.
- **Phone** — kept; > 5 s waits need it (M3, Carbon) with Cancel.
- **Reduced motion** — fills in steps without easing.
- **Accessibility** — name + value; text alternative "3 of 10".
- **Cost** — compositor with `scaleX`; repaint/layout with `width`.
- **How common** — freefrontend progress (in 474); Material, Carbon, Apple.
- **Examples** — material-web linear progress · Carbon progress bar · HIG progress indicators.
- **Surfaces** — web app uploads, forms · RN uploads · builder: file upload in the editor.
- **App status** — web **PARTIAL**: `components/shared/UploadProgress.tsx:105-106`, `:130-131` animate `width` with
  `transition-all`, no `role="progressbar"` in the file; `components/shared/FormWizard.tsx:49`, `:117` same.
  RN **PARTIAL**: `apps/mobile/components/ui/ProgressBar.tsx` 0 accessibility props, not animated.
- **Gap id** — AM-5, AM-14, CE-11.

### F8.4 · The waiting ladder (show nothing, then a loader, then progress)
- Family 8 · trigger state (time)
- **What a visitor sees** — a quick load shows nothing at all; a slower one shows a skeleton or spinner; a long one a
  bar with words.
- **How it is done** — a show-delay and a minimum show time around any indicator:
  `setTimeout(show, 300)`; once shown keep it ≥ 500 ms; label from ~3 s; determinate past ~5 s.
- **Timing (merged)** — nothing under 200 ms (M3) / 500 ms (Polaris) / 1 s (Fluent, Atlassian, NN/g); skeleton or
  spinner to ~5 s; text from 3 s (Fluent, Carbon); bar past 5–10 s; inline "done" held 1.5 s (Carbon).
- **Phone** — the ladder matters most on 3G, where every wait is longer.
- **Reduced motion** — same ladder, static indicators.
- **Accessibility** — 2.2.1 is not triggered; announce the end politely.
- **Cost** — none. **How common** — every system.
- **Examples** — M3 loading indicator · Carbon loading pattern · NN/g response times.
- **Surfaces** — web app, RN.
- **App status** — **GAP**: `PageLoader.tsx:17` and `InPageSpinner.tsx:13` render at once (no delay).
- **Gap id** — AM-14.

### F8.5 · Button: sending → done / failed
- Family 8 · trigger state (after click)
- **What a visitor sees** — the button keeps its size, shows a small spinner while sending, then a tick and "Sent",
  then returns (or "Try again"); offline it says "Saved — will send when online".
- **How it is done** — `aria-busy="true"` + `aria-disabled="true"` (not `disabled`, which drops focus); label, spinner
  and tick stacked in one grid cell and swapped by `opacity`; tick by `stroke-dashoffset` (`pathLength="1"`); result in
  a separate `role="status"`.
- **Timing** — swap 150–200 ms; spinner 0.8–1 s linear; tick draw 300–350 ms (Material checkbox 350); success held
  1.5–2 s. → swap `--eu-dur-fast`, tick `--eu-dur-slow`.
- **Phone** — kept: the only proof a slow submission is happening (RULE AF).
- **Reduced motion** — still "Sending…" text; tick appears whole.
- **Accessibility** — 4.1.3 via the live region; focus stays on the button; not colour alone.
- **Cost** — tiny. **How common** — uiverse buttons with `aria-busy`: 0 of 1,231; motion.dev `multi-state-badge`,
  `copy-button`; HIG buttons.
- **Examples** — motion.dev multi-state-badge · freefrontend "Micro-Interaction Loading Button" · Carbon inline loading.
- **Surfaces** — builder forms (application layer) · web app pay / send / save · RN (ActivityIndicator in buttons).
- **Builder / app status** — builder **GAP** (no form submit; 0 `aria-busy`). RN **PARTIAL**: button spinners with
  literal `#ffffff` (`apps/mobile/app/report-details.tsx:719`, `:939`; `:494` uses the theme colour).
- **Gap id** — CE-3, AM-24.

### F8.6 · Toggle switch flips
- Family 8 · trigger click | key (Space)
- **What a visitor sees** — the knob slides across, the track fills with the brand colour, and an "On" / tick makes
  the state readable without colour.
- **How it is done** — a real `<input type="checkbox" role="switch">` with `appearance:none`; thumb moved by
  `transform`, track by `background-color`; Safari 17.4+ `<input type="checkbox" switch>`.
- **Timing** — uiverse median 300 ms, **400 ms most common (183 / 260 — one tutorial copied)**; Material handle 300 ms
  with overshoot `(.175,.885,.32,1.275)`, track colour 67 ms linear. → thumb `--eu-dur-base` + overshoot *(proposed
  name)*, colour `--eu-dur-fast` linear.
- **Phone** — kept; whole label row is the target (≥ 24 px, 2.5.8). RN: OS `Switch` (already accessible).
- **Reduced motion** — thumb jumps, colour changes, no overshoot.
- **Accessibility** — name/role/state from the real input; 3:1 track/thumb; forced-colours rules; uiverse: 88 %
  unnamed, 49 hide the input with `display:none` (keyboard cannot reach them).
- **Cost** — compositor + one small repaint (101 uiverse toggles move the thumb with `left` — layout).
- **How common** — uiverse 260; freefrontend 189.
- **Examples** — material-web switch · uiverse `Admin12121/strong-penguin-65` (role=switch + focus-visible) · motion.dev
  `react-radix-switch`.
- **Surfaces** — builder forms / consent · web app settings · RN `Switch`.
- **Builder status** — **GAP** (0 `role="switch"` / `type="checkbox"` in `lib/`).
- **Gap id** — CE-4.

### F8.7 · Checkbox tick and radio dot
- Family 8 · trigger click | key
- **What a visitor sees** — the box fills and a tick draws itself; a radio's dot grows.
- **How it is done** — native inputs with `appearance:none`; tick = SVG path `stroke-dashoffset:1 → 0` on `:checked`;
  radio = `::before` `scale(0) → 1`.
- **Timing** — uiverse checkboxes 300 ms (IQR 200–400); Material mark 350 in / 150 out, radio 300. → tick
  `--eu-dur-slow` `--eu-ease-out`, uncheck `--eu-dur-fast`.
- **Phone** — kept; the label is the target. **Reduced motion** — tick appears whole.
- **Accessibility** — `<label>` always (uiverse: 80 % of checkboxes unnamed); never `display:none` on the input;
  `<fieldset><legend>`.
- **Cost** — paint on a tiny box. **How common** — uiverse 171 + 102; freefrontend 107 + 87.
- **Examples** — material-web checkbox, radio · uiverse `cbolson/calm-wasp-75` · Codrops "Animated Checkboxes and Radio
  Buttons with SVG" (2013).
- **Surfaces** — forms, filters, to-dos · RN `accessibilityRole="checkbox"`.
- **Builder status** — **GAP** (0 `type="checkbox"|"radio"` in `lib/`).
- **Gap id** — CE-5.

### F8.8 · Field: focus, floating label, error
- Family 8 (+6) · trigger focus | input | state
- **What a visitor sees** — the label rises above the field when typing; a wrong entry gets a red border, an icon and
  a line saying what to fix (optionally one small shake after submit).
- **How it is done** — label floats on `:focus-within` / `:not(:placeholder-shown)` with `transform`; error on
  `:user-invalid` or `[aria-invalid="true"]`, message linked by `aria-describedby`; shake `translateX ±.25rem` × 3 in
  300 ms (Animate.css `shakeX` is 1 s ±10 px — too long).
- **Timing** — Material label 150 ms standard. → `--eu-dur-fast`.
- **Phone** — keep the field visible above the keyboard (`scroll-margin`); never animate the field's height.
- **Reduced motion** — label moves at once; no shake.
- **Accessibility** — visible label (uiverse: 69 % of inputs have none); 3.3.1 error in text; not colour alone.
- **Cost** — negligible. **How common** — uiverse floating label 57, validation 59 (`:invalid` fires on load), shake 26.
- **Examples** — material-web text-field · Codrops "Inspiration for Text Input Effects" ·
  motion.dev `characters-remaining`.
- **Surfaces** — builder forms · web app forms (`FormWizard`) · RN `TextInput`.
- **Builder status** — **PARTIAL (unused)**: `.eu-input/.eu-field/.eu-error` CSS in `lib/educo-ui/components.ts:43-54`,
  invalid = border colour only (`:50`), focus = shadow after `outline:none` (`:49`); no renderer emits them (per 08 §5).
- **Gap id** — CE-6, CE-7.

### F8.9 · Press feedback: state layer and ripple
- Family 8 (+6) · trigger press
- **What a visitor sees** — the moment a finger touches a button or row, it darkens slightly or a ripple spreads from
  the finger.
- **How it is done** — web: one `::before` state layer with `currentColor` at the press opacity, plus a tiny dip:
  `.btn:active{transform:translateY(.0625rem) scale(.98)} .btn:active::before{opacity:var(--eu-state-press,.12)}`.
  Native: `Pressable android_ripple={{color: token}}` + `style={({pressed}) => pressed && {opacity:.85}}` for iOS.
- **Timing** — Material ripple: touch delay 150 ms, grows 450 ms, min visible 225 ms, fades 375 ms; state layers
  8 / 10 / 10–12 / 16 %. → press in `--eu-dur-instant` *(proposed)* 70 ms, out `--eu-dur-fast`.
- **Phone** — the only feedback a finger sees; native ripple costs zero JS per frame.
- **Reduced motion** — keep colour / ripple, drop scale.
- **Accessibility** — targets 48 dp / 44 pt; focus visible on tablets with keyboards.
- **Cost** — none. **How common** — uiverse `:active` in 39 % of buttons; press transform 351 / 1,231.
- **Examples** — material-web ripple · gesture-handler `pressable` example · uiverse `Allyhere/strong-pug-22`.
- **Surfaces** — every button and row: builder, web app, RN.
- **Builder / app status** — builder **PARTIAL**: `.eu-btn:active{transform:translateY(1px)}` (`lib/educo-ui/components.ts:18`, a pixel), applied only to the Card action (`lib/educo-ui/registry.ts:84`); the Button block exports an unclassed `<a>` (HV-3).
  RN **GAP**: 192 `<Pressable` in `apps/mobile/app` + `components`, 1 with a pressed style
  (`components/drive/DriveActionSheet.tsx:127`), 0 `android_ripple`; BottomTabBar press 0.85 in 80 ms
  (`components/ui/BottomTabBar.tsx:240-241`).
- **Gap id** — CE-1, CE-2, CE-13, AM-4.

### F8.10 · Number counts up / badge changes
- Family 8 · trigger scroll (in view) | state
- **What a visitor sees** — "1,200 pupils" counts up when it comes into view; a notification badge pops in and its
  number rolls when it changes.
- **How it is done** — the real number is in the DOM from the start; the animated copy is `aria-hidden`:
  `@property --n{syntax:'<integer>';inherits:false;initial-value:0}` + `counter-reset:n var(--n)` animated on a
  `view()` timeline; `font-variant-numeric: tabular-nums`; badge `scale(0) → 1` with a small overshoot.
- **Timing** — count-up 800–1,200 ms ease-out; badge pop 150–200 ms. → `--eu-dur-slower` … `--eu-dur-reveal`
  *(proposed)* with `--eu-ease-out`.
- **Phone** — kept for a handful; start only when in view.
- **Reduced motion** — show the final number.
- **Accessibility** — a screen reader must never hear "0"; no live region on a decorative count.
- **Cost** — main-thread paint of a few glyphs. **How common** — freefrontend counters/badges 95; motion.dev AnimateNumber (paid).
- **Examples** — motion.dev `react-number-counter` · freefrontend CSS animated counters · Codrops "Animated Number
  Counter"-style roundups.
- **Surfaces** — builder Stat, Badge · web app unread counts · RN Reanimated text.
- **Builder status** — **GAP**: Stat renders a static value (`lib/educo-ui/registry.ts:113`); Badge static (`lib/educo-ui/components.ts:57-58`).
- **Gap id** — CE-12.

### F8.11 · "Copied" feedback
- Family 8 · trigger click
- **What a visitor sees** — the copy icon turns into a tick and the word "Copied" for about two seconds.
- **How it is done** — `navigator.clipboard.writeText()`; icon swap by `opacity`/`scale`; the word in a live region.
- **Timing** — swap 150 ms, hold 1.5–2 s. → `--eu-dur-fast`.
- **Phone** — kept (bank account numbers for fees, phone numbers — RULE AF). **Reduced motion** — swap only.
- **Accessibility** — 4.1.3 "Copied"; the button's name stays "Copy …".
- **Cost** — none. **How common** — motion.dev 3 pages; uiverse 0 (CSS-only gallery).
- **Examples** — motion.dev `copy-button`.
- **Surfaces** — builder (copy link) · web app (reference numbers) · RN `expo-clipboard` + toast.
- **Builder status** — **GAP** (0 `clipboard` in `lib/*.ts`, `lib/educo-ui/*.ts` outside the generated icon maps).
- **Gap id** — CE-15.

### F8.12 · It looks done at once (optimistic update)
- Family 8 · trigger state
- **What a visitor sees** — ticking "present" marks it immediately; if saving fails it quietly goes back and offers Retry.
- **How it is done** — React 19 `useOptimistic` inside `startTransition` (reverts by itself); native local state +
  rollback; offline → queue and say "will send when online".
- **Timing** — acknowledge < 100 ms; report failure ≤ ~2 s; only for simple binary actions with ≥ 97 % success, never
  payments (Mishunov). Rollback: a short fade back + inline error.
- **Phone** — hides 3G latency — the biggest felt speed-up on a slow network.
- **Reduced motion** — n/a. **Accessibility** — failure announced (`role="alert"`); control keeps focus.
- **Cost** — 0 KB. **How common** — Polaris, React.
- **Examples** — React `useOptimistic` docs · Smashing "True Lies of Optimistic UIs".
- **Surfaces** — web app (attendance, read/unread) · RN.
- **App status** — **GAP**: 0 hits `useOptimistic` in `app/ components/ lib/`.
- **Gap id** — AM-16.

### F8.13 · Offline, empty and error states
- Family 8 · trigger state
- **What a visitor sees** — "No messages yet" with a button to write one; on no signal a calm bar slides down: "You're
  offline — showing what was saved on <date>".
- **How it is done** — empty: static (image with empty alt, a title, one action). Offline: `online`/`offline` events
  + `navigator.onLine` (web), NetInfo (native, not installed); a banner from the top edge, polite announcement.
- **Timing** — banner in `--eu-dur-base`, out `--eu-dur-fast`.
- **Phone** — central to RULE AF (power and signal drop).
- **Reduced motion** — appears without sliding.
- **Accessibility** — polite live region; colour + icon + text; never "Error 329347".
- **Cost** — NetInfo module on native. **How common** — Carbon, Atlassian, Polaris, NN/g.
- **Examples** — Carbon empty-state pattern · M3 banners · NN/g error messages.
- **Surfaces** — web app · RN · builder export (offline-first pages, RULE AF).
- **App status** — empty **HAVE (static)**: `components/pages/components/EmptyState.tsx`, `apps/mobile/components/drive/DriveEmptyState.tsx` (files exist); offline **GAP**: 0 hits `navigator.onLine|'online'`
  in `app/ components/ lib/`.
- **Gap id** — AM-17.

### F8.14 · Haptic tick
- Family 8 · trigger state | gesture
- **What a visitor feels** — a light tick when a toggle flips or a drag drops; a distinct double buzz on an error.
- **How it is done** — expo-haptics (not installed): Android `performAndroidHapticsAsync(AndroidHaptics.Confirm|Reject|Toggle_On…)`
  (no permission, follows system setting); iOS `selectionAsync`, `notificationAsync`. Web `navigator.vibrate(15)`
  (Android Chrome only, no iOS).
- **Timing** — short and discrete. **Phone** — cheap; weak motors on budget phones — never the only signal.
- **Reduced motion** — separate setting; offer an in-app off switch.
- **Accessibility** — always paired with a visual (and spoken where useful) signal.
- **Cost** — one Expo module (needs approval). **How common** — Apple, Android system UI.
- **Examples** — HIG playing haptics · Expo haptics docs.
- **Surfaces** — RN.
- **App status** — **GAP**: expo-haptics not in `apps/mobile/node_modules`; 0 hits `Vibration|Haptics`.
- **Gap id** — AM-26.

### F8.15 · Time-left bar on a message that closes itself
- Family 8 · trigger time
- **What a visitor sees** — a thin bar under an alert shrinks to show how long until it closes; it stops while the
  pointer or focus is on the alert.
- **How it is done** — pure CSS `transform: scaleX(1 → 0)` linear over the auto-dismiss time, paused with
  `animation-play-state` when hovered / focused.
- **Timing** — the dismiss time (≥ 5 s); linear.
- **Phone** — kept (compositor). **Reduced motion** — static bar (information kept, not moved).
- **Accessibility** — 2.2.1 needs a way to turn the limit off / extend it, not only pause on hover.
- **Cost** — compositor. **How common** — uiverse notifications (some), Atlassian flags.
- **Examples** — Atlaskit flag auto-dismiss · builder Alert.
- **Surfaces** — builder Alert / toast.
- **Builder status** — **HAVE**: `@keyframes eu-alert-countdown` scaleX (`lib/educo-ui/components.ts:278-282`),
  reduce rule (`:284`); pause on hover/focus (`lib/box-model.ts:2036-2037`). **PARTIAL**: no "keep open" control.
- **Gap id** — MR-5.

### F8.16 · Tab indicator slides to the chosen tab
- Family 8 · trigger click | key (arrows)
- **What a visitor sees** — the underline glides from the old tab to the new one and the panel crossfades.
- **How it is done** — one indicator moved with `transform: translateX() scaleX()` from the selected tab's geometry,
  or CSS anchor positioning (`anchor-name` on the selected tab, `left: anchor(left); right: anchor(right)` with a
  transition, Chromium 125+).
- **Timing** — Material 250 ms emphasized. → `--eu-dur-base` `--eu-ease-standard`.
- **Phone** — kept; tabs scroll sideways. **Reduced motion** — indicator jumps.
- **Accessibility** — APG tabs (`role="tablist/tab/tabpanel"`, `aria-selected`, arrow keys); the bar, not colour alone.
- **Cost** — compositor. **How common** — freefrontend tabs 121; Codrops "Tab Styles Inspiration".
- **Examples** — material-web tabs · motion.dev `react-tab-select` · Codrops tab styles (2014).
- **Surfaces** — builder Tabs · web app segmented controls · RN tab bar / segmented.
- **Builder status** — **GAP** (0 `role="tab"` in `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/components.ts`, `registry.ts`).
- **Gap id** — CE-8.

### F8.17 · Menu button turns into a cross
- Family 8 · trigger click
- **What a visitor sees** — the three lines fold into an X as the menu opens, and back when it closes.
- **How it is done** — `<button aria-expanded aria-controls>` with three spans; `[aria-expanded="true"]` rotates the
  outer bars ±45° and fades the middle; a visible word "Menu" beside it.
- **Timing** — 200–300 ms. → `--eu-dur-base`.
- **Phone** — kept (the phone header). **Reduced motion** — instant swap.
- **Accessibility** — state in `aria-expanded` (present on only 52 % of the 75 opened menus measured); Escape closes.
- **Cost** — compositor. **How common** — 24 % of sites have a menu button (n 732); freefrontend hamburger icons in 435.
- **Examples** — Codrops "Animating an SVG Menu Icon with Segment" · shopify.com/editions menu · keikku.health menu.
- **Surfaces** — builder Navigation · web app header.
- **Builder status** — **GAP** (0 `aria-expanded` in `lib/`).
- **Gap id** — CE-14.

### F8.18 · Like / rating burst
- Family 8 · trigger click | hover
- **What a visitor sees** — stars light up to the one under the pointer; a heart fills with a small burst when liked.
- **How it is done** — rating = radio group; like = `<button aria-pressed>` with fill `scale 0 → 1.2 → 1` and
  decorative `::before/::after` dots `aria-hidden`.
- **Timing** — fill 300 ms overshoot, burst 400–600 ms. → `--eu-dur-slow`.
- **Phone** — kept, small. **Reduced motion** — fill only.
- **Accessibility** — name "Like (12)", count announced politely.
- **Cost** — tiny. **How common** — uiverse like/heart 37; freefrontend ratings 39.
- **Examples** — motion.dev confetti · freefrontend like buttons.
- **Surfaces** — testimonials (display) · Educo app reactions.
- **Builder status** — rating **HAVE (display only)**: `role="img"` with a text label (`lib/educo-ui/registry.ts:131`, `:141`);
  interactive **GAP**.
- **Gap id** — CE-15.

---

## Gap ids this family feeds
CE-1 … CE-15, CE-19 (08) · MR-5, MR-9, MR-17 (06) · AM-4, AM-5, AM-13, AM-14, AM-15, AM-16, AM-17, AM-24, AM-26 (09).
No new gap ids proposed.
