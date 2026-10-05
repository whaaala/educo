# Family 9 · Text — split, reveal, typing, scramble

Part of the [Motion & Effects Library](../LIBRARY.md). Words that move: headings that rise line by line, words that
light up as you scroll, typed and scrambled text, text that fills with colour. One entry per technique, in the library's
entry shape; timings name the tokens of [11-rules](11-rules.md) (`reveal` 800 ms, `stagger` 60 ms capped at 500 ms,
`out` = (.23,1,.32,1) — proposed there). Written 2026-10-02 from the measured runs
([AGGREGATE](../../research-runs/AGGREGATE.md), raw records in `C:\Users\eyite\educo-research\runs\*.json`),
[motion-effects §4](../../motion-effects.md) (text split, typewriter, counter), [02-scroll-animation](../02-scroll-animation.md),
[06-motion-rules](../06-motion-rules.md), [08-component-effects](../08-component-effects.md) §1.3 (Animista text group),
and the reading notes `educo-research\reading\E.md` (Codrops case studies: ChainGPT Labs, Horeca, Flim, 3D Cube Gallery,
Scrolling Letters, Text Repetition, Glowing Text Marquee, Organic Text Distortion) and `F.md` (CodePen text pens).
Every `file:line` was grepped again on 2026-10-02.

**What the runs can and cannot say about text.** `aw-measure.js:210` counts, per site, the `h1`/`h2` headings that
contain **more than 6** `span`/`div` descendants (a heading split into words or letters). It cannot tell *how* the
spans move. Typewriter and scramble effects live in scripts, and the runs store only a **sample of JS lines**, not
whole scripts — so their counts below are lower bounds, labelled as such. Counters / number roll-ups belong to family
8 (Feedback), text marquees to family 2 (Scroll), the label roll on a button to family 6 (6.5).

## Most used first — measured 2026-10-02, n = 732 live sites (AGGREGATE) · re-count n = 698

| Technique (what a visitor sees) | Measured | n | Entry |
|---|---|---|---|
| A heading split into words or letters (h1/h2 with > 6 spans) | **19 %** (140) | 732 | 9.1, 9.2 |
| — of those, sites with 1–2 split headings · 3–5 · 6 or more | 86 · 28 · 23 (re-count, 137 sites) | 698 | — |
| A split-text library or inline `SplitText` / `SplitType` / `splitting` (any script URL containing "split" also counts — an upper bound) | 8 % (59); only 24 of 58 also have a split heading when measured | 732 / 698 | 9.1, 9.2 |
| GSAP on the page (what drives most split reveals) | 17 % (125); top eases `power3.out` 579 · `expo.out` 556 · `power2.out` 552 | 732 | 9.1 |
| Keyframe animation durations (all kinds): 800 ms is the second most common after 12 s marquees | 800 ms × 408 · 600 ms × 247 · 1 s × 245 | 732 | 9.1 |
| Scroll-driven CSS (`animation-timeline`) — the zero-JS route for scroll-filled words | 6 % (47); `view()` 4 % (29) | 732 | 9.3 |
| CodePen `animation-timeline` tag — pens using `view()` | 41 % of 93 pens | 93 | 9.3 |
| Typewriter / typed text (`typewriter`, `typed.js`, `typeit`, "typing") in sampled JS / CSS | ≥ 3 sites (lower bound) | 680 | 9.4, 9.5 |
| Scramble / shuffle text (`ScrambleText`, "scrambl", "shuffle") in sampled JS / CSS | ≥ 4 sites (lower bound) | 680 | 9.6 |
| `steps(` in sampled keyframes (typewriter, sprite) · `-webkit-text-stroke` | ≥ 10 · ≥ 6 (lower bounds) | 680 | 9.4, 9.9 |
| Award "Transitions" collection titles naming text effects | 10 of 366 (motion-effects §4) | 366 | — |
| Animista text group durations | 0.5–1.2 s | 662 variations | 9.1 |

**Builder today, in one line** — the Heading and Text blocks export one inline-styled `<h*>` / `<p>`
(`lib/box-export.ts:137-138`); a whole block can arrive (fade / rise / drop / slide / zoom / sharpen,
`lib/interactions.ts:133-142`) and a container can stagger its **children** (`:234-239`), but nothing splits text into
lines, words or letters: grep `split`, `typewriter`, `scramble`, `steps(`, `background-clip: text`, `text-stroke`,
`font-variation` in `lib/interactions.ts`, `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/`: **0**. Headings are
`text-wrap: balance` (`lib/box-model.ts:2978`, `lib/educo-ui/base.ts:74`) — which any line split must respect.

---

### 9.1 · Line reveal (a heading rises line by line out of a mask)
- Family 9 · trigger load | scroll
- **What a visitor sees** — the big heading's lines slide up into view one after another, as if from behind a ledge.
- **How it is done** — split the heading into **lines** after layout (the line breaks depend on width and on
  `text-wrap: balance`), each line wrapped in an `overflow: clip` mask; the inner span animates
  `translateY(100%) → 0`. GSAP `SplitText({ type: "lines", mask: "lines", autoSplit: true })` re-splits on resize and font
  load (Flim case study). Zero-JS approximation: split at **export** into the lines the author sees is impossible
  (widths differ by device) — so the CSS route splits into **words** (9.2) and lets them wrap; a true line reveal needs a
  small script that measures lines, run after fonts load, re-run on resize. Real text stays one string for assistive
  tech: the heading keeps its text, the visual copy is `aria-hidden`, or the heading gets `aria-label`.
- **Timing** — award reveals 0.8–1.2 s, `expo.out` / `power3.out`, 60–120 ms between lines; Animista text 0.5–1.2 s →
  `reveal` (800 ms) + `out`, line step = `stagger`, total ≤ `stagger-cap`.
- **Phone** — kept but cheaper: fewer lines, shorter (`slower`); the script is the cost — on a 360 px phone a heading
  wraps to more lines, each a layer. Never on the LCP heading longer than `fast` (11.16).
- **Reduced motion** — the heading is simply there (no split at all: the script never runs).
- **Accessibility** — `aria-hidden` spans read letter by letter or not at all otherwise; never split body copy; keep
  the heading's level and text for the outline; 2.3.3.
- **Cost** — JS (~5–15 KB for a split library; GSAP + SplitText ≈ 100 KB in the Horeca case study), a re-split on
  resize, a layer per line.
- **How common** — split headings on **19 %** of award sites (n 732); GSAP 17 %.
- **Examples** — labs.chaingpt.org (split heading, split library; Codrops case study "ChainGPT Labs") · accordion.net.au/work
  (split + library, aggregate example) · ochi.design, vitaarchitecture.com (many split headings, re-count) · Codrops
  "A Site for Sore Eyes … Flim" (SplitText lines + mask) · Codrops "Building Horeca" (SplitText + ScrollTrigger).
- **Surfaces** — Heading block (hero, section titles) · Card titles: no · Educo web app: no (app headings must not move) ·
  RN: Reanimated per-line `entering` only for an onboarding screen.
- **Builder status** — **PARTIAL**: the whole heading block can rise / fade (`lib/interactions.ts:136`) and play on scroll
  (`:241-243`); no line split.
- **Gap id** — **TX-1** (new).

### 9.2 · Word / letter stagger (each word or letter arrives a beat apart)
- Family 9 · trigger load | scroll
- **What a visitor sees** — the words of a headline pop in one after another (or the letters ripple in).
- **How it is done** — at export, the heading's text is split into `<span class="w" aria-hidden="true">` words (letters
  only for a short display word), each with `style="--i:N"`; the heading keeps the real text in an `aria-label` (or a
  visually-hidden copy). `.w{display:inline-block;animation:eu-reveal-rise var(--eu-dur-slow) var(--eu-ease-out) both;
  animation-delay:min(calc(var(--i)*var(--eu-dur-stagger)),var(--eu-stagger-cap))}`; on scroll with
  `animation-timeline: view()` under `@supports`. Words keep their spaces (`white-space: pre` on the space or a real
  space between spans); letters break shaping in Arabic and other joined scripts — **words only** there (RULE AF).
- **Timing** — 30–60 ms per word or letter (motion-effects §4), whole heading ≤ 500 ms of delay → `slow` per word +
  `stagger` 60 ms (letters: `min(60ms, 500ms / n)`), `out`.
- **Phone** — kept for words (each a compositor animation); letters only for ≤ ~12-character display words.
- **Reduced motion** — `--eu-dur-stagger: 0` and no movement: the heading appears whole, or with one `fast` fade.
- **Accessibility** — one accessible name; `aria-hidden` spans; the split never applies to body text, links or buttons
  (a link split into letters is announced as one word only if the name is kept).
- **Cost** — CSS only if split at export (more DOM: a 10-word heading = 10 spans); no script.
- **How common** — counted inside the 19 % split headings; Codrops "Scrolling Letters Animation" (Charming.js +
  anime.js); motion.dev text examples; Webflow Interactions "SplitText mask by word with stagger" (3D Cube Gallery case study).
- **Examples** — invisiblenorth.com/work (25 split headings) · Codrops ScrollingLettersAnimation
  (`https://tympanus.net/Development/ScrollingLettersAnimation/`) · Codrops "Building a Scroll-Driven 3D Cube Gallery in
  Webflow" · stabondar.com (`text-words` cursor follower, aggregate cursor example).
- **Surfaces** — Heading block · RN: Reanimated `entering={FadeInUp.delay(i*60)}` per word, onboarding only.
- **Builder status** — **PARTIAL**: stagger exists for a container's **children** (`lib/interactions.ts:228-239`, 90 ms
  steps, uncapped) — never for the words of one heading.
- **Gap id** — **TX-2** (new), MR-20.

### 9.3 · Words light up as you scroll (scroll-filled text)
- Family 9 · trigger scroll
- **What a visitor sees** — a paragraph starts pale; as you scroll, its words darken one by one, as if being read aloud.
- **How it is done** — split into word spans at export; each word animates `opacity: .25 → 1` (or `color`) on
  `animation-timeline: view()` with a staggered `animation-range` (`entry calc(var(--i) * 2%) cover 40%`); or one
  gradient fill: `background: linear-gradient(90deg, currentColor 50%, var(--muted) 0) 100% / 200%;
  background-clip: text; animation-timeline: view()` moving `background-position` (jh3y pens). Without
  `animation-timeline` support the text is simply full colour (`@supports`).
- **Timing** — scroll-linked: `linear`, no duration.
- **Phone** — kept: compositor `opacity` on `view()` runs off the main thread; the gradient variant repaints a text box per
  frame — fine for one heading, not a long paragraph.
- **Reduced motion** — full colour at once (it is not motion in 2.3.3 terms when only opacity changes, but it is
  scroll-driven and makes text unreadable until scrolled: show it whole).
- **Accessibility** — the pale state must still meet **4.5:1**, or text is unreadable when the page is printed, zoomed or
  frozen mid-scroll; 1.4.3.
- **Cost** — CSS; more DOM for the word variant.
- **How common** — scroll-driven CSS on 6 % of award sites; CodePen `animation-timeline` 93 pens (41 % `view()`),
  `scroll-driven-animations` 26 pens; jh3y "scrubbed gradient / stroke fills" (ExGXLBb, MYgBprZ), jlengstorf bGzBwRm,
  gayane wvNXyYR (F.md).
- **Examples** — `https://codepen.io/jh3y/pen/ExGXLBb` · `https://codepen.io/jlengstorf/pen/bGzBwRm` · Bramus scroll-driven
  animations course notes (D.md) · Codrops "Building Horeca" (word fill on scrub).
- **Surfaces** — Heading / Text block in a hero or "about" band · RN: no.
- **Builder status** — **GAP** (no per-word timeline; block-level `view()` exists at `lib/interactions.ts:241-243`).
- **Gap id** — **TX-3** (new).

### 9.4 · Typewriter (letters appear as if typed)
- Family 9 · trigger load | scroll
- **What a visitor sees** — a line of text types itself out, with a blinking caret at the end.
- **How it is done** — one line, monospace or fixed width: `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` (or `width:
  0 → Nch`) with `animation-timing-function: steps(N)`; the caret is a `border-inline-end` or `::after` that blinks with
  `steps(1)` and **stops within 5 s** (2.2.2). Multi-line or proportional fonts need JS.
- **Timing** — 40–80 ms per character (motion-effects §4) → `steps(N)` over N × 60 ms; caret 1 s cycle, ≤ 5 cycles.
- **Phone** — kept (CSS); the text must fit one line at 360 px or it is clipped — use only for short lines.
- **Reduced motion** — the full line, no caret.
- **Accessibility** — the whole string is in the DOM from the start (clip-path only hides it visually), so screen
  readers read it once; the blinking caret is 2.2.2 (stop within 5 s) and never a flash (2.3.1).
- **Cost** — CSS, no layers beyond one. **How common** — ≥ 3 award sites in sampled code (lower bound); `steps(` in ≥ 10.
- **Examples** — CSS-Tricks almanac `steps()`; Animista text group; Codrops "Organic Text Distortion" (line splitting
  for comparison).
- **Surfaces** — Heading / Text block (short tagline) · Educo web app: no · RN: no.
- **Builder status** — **GAP**.
- **Gap id** — **TX-4** (new).

### 9.5 · Rotating word (one word in a sentence cycles)
- Family 9 · trigger time
- **What a visitor sees** — "We teach *science* / *music* / *sport*" — the last word changes every few seconds.
- **How it is done** — all the words in the DOM, stacked in one inline grid cell; each fades / slides in turn with a
  CSS keyframe loop (`animation-delay` per word) or a tiny script; the sentence's accessible text lists them
  ("science, music and sport") so it is not read mid-cycle.
- **Timing** — dwell ≥ 2 s per word, change `slow` + `out`.
- **Phone** — kept (compositor).
- **Reduced motion** — does not cycle: the full list is shown as plain text.
- **Accessibility** — **auto-updating content: needs a visible Pause** with no 5-second allowance (2.2.2, 11.9); no
  `aria-live` on it (it would announce every change).
- **Cost** — CSS. **How common** — counted with 9.4 (lower bound); a staple of school and SaaS heroes.
- **Examples** — motion-effects §4 "cycling typewriter"; WAI carousel pattern for the pause rule.
- **Surfaces** — Heading block (hero) · RN: no.
- **Builder status** — **GAP**.
- **Gap id** — **TX-5** (new), MR-4 (pause control rule).

### 9.6 · Scramble / decode (random characters settle into the word)
- Family 9 · trigger load | hover | scroll
- **What a visitor sees** — a word flickers through random letters before settling into the real one, like a code
  breaking.
- **How it is done** — JS: each frame, unresolved positions show a random glyph from a set; positions resolve left to
  right over the duration (GSAP `ScrambleText`, cbolson's unscramble pens); the real text is in the DOM and the
  scrambled copy is `aria-hidden`.
- **Timing** — 0.6–1.2 s total; ≤ 20 glyph changes a second.
- **Phone** — kept only if cheap: one short word; JS writes text every frame (layout + paint).
- **Reduced motion** — the word, still.
- **Accessibility** — rapid character changes can read as **flashing**: cap the rate and the area (2.3.1), run once, never
  loop; screen readers must get the real word (the scrambled node is `aria-hidden`).
- **Cost** — JS per frame (text layout); highest of this family.
- **How common** — ≥ 4 award sites in sampled code (lower bound); ChainGPT Labs ("headings flicker / scramble in").
- **Examples** — Codrops "Case Study: ChainGPT Labs" (GSAP ScrambleText) · `https://codepen.io/cbolson/pen/xbOgxwp` ·
  `https://codepen.io/cbolson/pen/NPrrpzJ` (F.md).
- **Surfaces** — bold / playful personality headings only (RULE P); not in the default school catalogue · RN: no.
- **Builder status** — **GAP by choice**.
- **Gap id** — **TX-7** (new, LATER).

### 9.7 · Letters roll on hover
- Family 9 · trigger hover | focus
- **What a visitor sees** — moving the mouse onto a menu word makes its letters roll up one after another and return.
- **How it is done** — the label technique of **6.5** with a per-letter `transition-delay: calc(var(--i) * 20ms)`; the
  visible copy and the hover copy are both `aria-hidden` spans inside a link whose name is the plain word.
- **Timing** — `base` per letter, 20–30 ms steps, `out`.
- **Phone** — dropped (hover gated). **Reduced motion** — instant colour change instead.
- **Accessibility** — as 6.5 (no `content: attr()` copies).
- **Cost** — compositor, one span per letter. **How common** — inside the 19 % split headings (hover variants on award
  menus; Codrops 3DLettersMenuHover, LineTextHoverAnimations).
- **Examples** — Codrops 3DLettersMenuHover (hv.json) · fiddle.digital "Work" link (`awwwards-com-inspiration-canvas-grid-fiddle-digital-design-agency-h0-250.jpg`).
- **Surfaces** — navigation links, Button labels · RN: no.
- **Builder status** — **GAP**.
- **Gap id** — **TX-6** (new; shared with HV-24 / 6.5).

### 9.8 · Gradient or shimmer text
- Family 9 · trigger none (static) | time (shimmer) | scroll
- **What a visitor sees** — a heading filled with a brand-to-accent gradient; in the moving version a highlight glides
  across the letters.
- **How it is done** — `background: linear-gradient(90deg, var(--eu-color-primary-500), var(--eu-color-accent-500));
  -webkit-background-clip: text; background-clip: text; color: transparent;` with a solid `color` fallback under
  `@supports not (background-clip: text)` and in `forced-colors`; the shimmer animates `background-position` (paint) once,
  not forever.
- **Timing** — shimmer once at `reveal`; looping shimmer only with a pause (2.2.2).
- **Phone** — static gradient: free; animated: a repaint per frame of the text box — once only.
- **Reduced motion** — static gradient.
- **Accessibility** — contrast must hold at the **lightest** stop of the gradient against the background (4.5:1, or 3:1
  for large text); in forced colours `background-clip: text` text can vanish — keep `color` set and override there.
- **Cost** — paint. **How common** — not counted by the runs (0 matches in sampled CSS for `background-clip: text` —
  sampling, not absence); common on SaaS heroes and "Startup" personality sites.
- **Examples** — tuxkarma.co/en "Gradient Text Selection & Favicon" (aggregate example — a gradient on selected text, the nearest measured case) · jh3y `MYgBprZ` (gradient fill
  on scroll) · Codrops "Creating a Glowing Text Marquee Animation" (letters as a window onto a moving coloured layer).
- **Surfaces** — Heading block (hero), Stat numbers · RN: `MaskedView` + `LinearGradient` (two Expo modules — needs
  approval; static only).
- **Builder status** — **GAP** (gradient backgrounds exist for boxes, `lib/educo-ui/backgrounds.ts`, not clipped to text).
- **Gap id** — **TX-8** (new).

### 9.9 · Outline text that fills
- Family 9 · trigger hover | scroll | none
- **What a visitor sees** — a huge word drawn only as an outline; it fills with colour on hover or as you scroll past.
- **How it is done** — `-webkit-text-stroke: .0625rem currentColor; color: transparent` (a hairline stroke is the one
  place a 1px value is a hairline — express it as `.0625rem` so it scales); fill by a `background-clip: text` sweep
  (9.8) or by stacking a filled copy (`aria-hidden`) under a `clip-path` that opens.
- **Timing** — hover `base`; scroll `linear`.
- **Phone** — gated for hover; a scroll fill is fine.
- **Reduced motion** — show it filled.
- **Accessibility** — outline-only text is low contrast by nature: decorative display words only, with the real
  information elsewhere; 1.4.3 applies to the outline if it carries meaning.
- **Cost** — paint. **How common** — `-webkit-text-stroke` in ≥ 6 sites' sampled CSS (lower bound); Codrops "On-Scroll
  Text Repetition Animation" (outline copies on `view()`).
- **Examples** — Codrops "On-Scroll Text Repetition Animation" (2022) · jh3y stroke-fill pens (F.md).
- **Surfaces** — Heading block (display) · RN: no.
- **Builder status** — **GAP**.
- **Gap id** — **TX-9** (new, LATER).

### 9.10 · Marker highlight sweeps behind words
- Family 9 · trigger scroll | load
- **What a visitor sees** — a yellow (brand) highlighter stroke draws itself behind a key phrase as it comes into view.
- **How it is done** — the phrase is a `<mark>` (semantic: "highlighted for relevance"); `background:
  linear-gradient(var(--eu-color-accent-200) 0 0) left 0 bottom .1em / 0% .45em no-repeat` → `100% .45em` on
  `view()` or on load; `box-decoration-break: clone` so it follows line wraps.
- **Timing** — `slow` + `out`, after the heading's own reveal.
- **Phone** — kept (one paint, small area).
- **Reduced motion** — the highlight is simply there.
- **Accessibility** — the highlighted text must keep 4.5:1 against the highlight colour in all four themes; `<mark>` is
  announced by some screen readers — use it only where emphasis is meant.
- **Cost** — paint, tiny. **How common** — not counted by the runs; frequent on education and SaaS landing pages.
- **Examples** — CSS-Tricks "4 ways to animate the colour of a text link" (background-size technique, 04 §5.8);
  Temani Afif image / text decorations (CSS-Tricks).
- **Surfaces** — Text / Heading block (an inline "highlight" style on a run of text) · Educo web app: no · RN: no.
- **Builder status** — **GAP** (no inline run styling for a marker; rich text supports `<b>`/`<i>`-level marks via
  `richBody`, `lib/box-model.ts:1444`).
- **Gap id** — **TX-10** (new, DECIDE).

### 9.11 · Variable-font weight or width animates
- Family 9 · trigger hover | scroll
- **What a visitor sees** — a word swells from thin to bold under the mouse or as it scrolls.
- **How it is done** — `font-variation-settings: "wght" 300 → 800` (or `font-weight` with a variable font) in a transition
  or on `view()`; only with a variable font file.
- **Timing** — hover `base`; scroll `linear`.
- **Phone** — the cost is the **font file**: a variable font with a full weight axis is larger than two static weights
  — against RULE AF's "two families, subset" budget.
- **Reduced motion** — static weight.
- **Accessibility** — a weight change shifts the width of the line (layout) unless a width axis compensates; never on
  body text.
- **Cost** — layout + paint per frame (text re-shapes); font bytes. **How common** — not counted; award typographic sites.
- **Examples** — alectear.com/lettering "Hover interaction" (aggregate example, hover + `(hover:hover)` gated).
- **Surfaces** — display headings only, playful / bold personality · RN: no.
- **Builder status** — **GAP by choice** (fonts are requested at static weights 400 / 700 only, `lib/educo-ui/font-embed.ts:52`).
- **Gap id** — none (recorded so it is not proposed without the weight budget).

---

## New gap ids raised in this file (text family — prefix TX, new)

| Id | Plain description | Sort |
|---|---|---|
| **TX-1** | Line reveal for a Heading: split into lines after fonts load and after `text-wrap: balance`, masks per line, one accessible name, re-split on resize; lazy script only on pages that use it; off under reduced motion; never longer than `fast` on the LCP heading. | DECIDE |
| **TX-2** | Word stagger for a Heading, split **at export** (CSS only): word spans `aria-hidden` with `--i`, the heading keeps its text as the accessible name; words only for joined scripts (Arabic); stagger 60 ms capped at 500 ms. | DECIDE (the cheapest of the text reveals) |
| **TX-3** | Scroll-filled words (`view()` per word or a gradient fill), with the pale state still ≥ 4.5:1 and full colour where `animation-timeline` is unsupported or reduced motion is on. | LATER |
| **TX-4** | Typewriter for one short line (`steps()` on `clip-path`), caret stops within 5 s, full text in the DOM. | LATER |
| **TX-5** | Rotating word in a hero with a visible Pause, all words in the accessible text, still under reduced motion. | LATER |
| **TX-6** | Letter / label roll on hover (6.5 / 9.7) with `aria-hidden` copies — never `content: attr()`. | LATER (shared with HV-24) |
| **TX-7** | Scramble text — playful personality only, once, rate-capped, `aria-hidden` scramble node. | LATER (by choice) |
| **TX-8** | Gradient text on a Heading (static first), contrast measured at the lightest stop, a solid `color` fallback and a `forced-colors` override. | DECIDE |
| **TX-9** | Outline text that fills (decorative display words only). | LATER |
| **TX-10** | A "highlight" inline style (`<mark>` + background-size sweep), contrast checked in four themes. | DECIDE |
