# Section transitions — how one band hands over to the next

Researched 2026-10-02 (RULE R / RULE RS, the session's own research). This **extends**
[../motion-effects.md](../motion-effects.md), [../awwwards-motion-survey.md](../awwwards-motion-survey.md) and
[../scroll-and-position/](../scroll-and-position/README.md); it does not repeat them. Scroll-linked motion
(reveal, parallax, progress, pinned stories) is in [02-scroll-animation.md](02-scroll-animation.md).

## What the existing files already hold (not redone here)

- `motion-effects.md` §4 *Mask / clip wipe* — `clip-path` wipes as **page** transitions; §7 View Transitions
  between pages; §9 Awwwards counts (mask/clip wipe 48 of 366 Transitions items, colour field 25).
- `scroll-and-position/01-codepen-sticky-fixed.md` — technique 12 *hero held while content scrolls over it*
  (gap **SP-7**), 13 *clip-revealed fixed scenes* (gap **SP-10**), 14 *fixed background* (gap **SP-11**).
- `docs/LAYOUT_BENCHMARK.md` — A10 full-screen sections, A12/B12 overlap patterns (not yet exercised).

**New here:** shape dividers beyond slope/curve (SVG, `mask` waves, `shape()`), what the cut actually reveals,
overlap across a band boundary, colour hand-overs, sticky *stacking* sections, scroll-linked clip/mask wipes
**between sections** (not pages), full-screen scroll-snap sections, and a code audit of each.

## Sources and completeness

| Source | What it holds | Read |
|---|---|---|
| MDN `clip-path` (developer.mozilla.org/…/Properties/clip-path) | syntax, every basic shape, geometry boxes, animatability, stacking context | all sections |
| MDN `shape()` (…/Values/basic-shape/shape) | commands, units, vs `path()`, Baseline 2026 | all sections |
| MDN `mask` (…/Properties/mask) | longhands, alpha/luminance, Baseline Dec 2023 | all sections |
| MDN `scroll-snap-type` · `scroll-snap-align` · `scroll-snap-stop` | syntax, mandatory vs proximity, Baseline dates, re-snapping | all sections |
| web.dev *Well-controlled scrolling with CSS Scroll Snap* (web.dev/articles/css-scroll-snap) | properties, scroll-padding/margin, caveats | all sections |
| Adrian Roselli *Scroll Snap Challenges* (via search result summary) | zoom / keyboard / tall-content failures | **search summary only** — page not fetched |
| scroll-driven-animations.style *Stacking Cards* (CSS) | sticky + `view-timeline` + `exit-crossing` scale | full demo CSS |
| CSS-Tricks *Stacked Cards with Sticky Positioning and a Dash of Sass* (css-tricks.com/?p=318924) | sticky `top` per card, horizontal variant, a11y comment | all sections + comments summary |
| CSS-Tricks *How to Create Wavy Shapes & Patterns in CSS* (Temani Afif) | `mask` + two `radial-gradient`s, top/bottom/both, lines, patterns | all sections; the linked generator (css-generators.com/wavy-shapes) **NOT READ** (tool, no prose) |
| CSS-Tricks *Exploring the CSS Paint API: Rounding Shapes* | wavy dividers without SVG | **search summary only** |
| shapedivider.app | SVG divider generator: flip, invert, height, colour, absolute at top/bottom, 1px-gap fix | home page (tool; shape list not enumerated by the fetch) |
| CSS Separator Generator (codeshack.io), freefrontend dividers | 18 shapes: wave, curve, tilt, triangle, arrow, split, zigzag, clouds, mountains… | **search summary only** |
| Builder.io *view-timeline* (Apple-style sticky video wipe) | `clip-path: inset()` wipe per section on named view timelines + `timeline-scope` | all sections |
| Codrops *On-Scroll Animation Ideas for Sticky Sections* (2024-01) | sticky sections stacking / collapsing (GSAP) | **NOT READ — HTTP 403**; known only from search snippet |
| Curtain-reveal footer (piccalil.li, hongkiat, ryanseddon — search) | footer `sticky; bottom:0` behind `main` | **search summary only** |
| Overlapping hero + cards (educative/devpath, GemPages — search) | negative margin + z-index + `position: relative` | **search summary only** |
| Material 3 transitions · Apple HIG motion | — | **NOT READ — pages render with JS, fetch returned only the title.** Apple's *Reduced Motion evaluation criteria* (App Store Connect) WAS read — see 02 |

## The techniques

Each: **what** (plain words) · **build** · **support** · **reduced motion** · **cheap phone on 3G** ·
**accessibility** · **how common**.

### T1. Sloped / curved edge by `clip-path: polygon()`
- **What:** the band's top or bottom edge is cut on a diagonal or an arch.
- **Build:** `clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%)`; curves as many points.
- **Support:** Baseline widely available (Jan 2020). Creates a stacking context.
- **Reduced motion:** not motion.
- **Cost:** compositor-friendly, zero bytes of image, zero JS.
- **Accessibility traps:** `clip-path` clips **everything inside** — text, focus rings, box-shadows and anything
  floating past the edge. The words must sit clear of the cut (padding ≥ the depth).
- **Common:** the most common divider family on template-builder sites (Elementor, Divi, Webflow all ship it).

### T2. What shows through the cut — the neighbour's colour
- **What:** on real sites the wedge cut from band A is filled by **band B's colour**, so B appears to flow into A.
  A plain clip shows whatever is *behind* A — the page background — not B, because B starts *below* A.
- **Build (three ways):** (a) B pulls up under A: `margin-top: calc(-1 * depth)` on B and A above it in z
  order; (b) an SVG/`mask` divider drawn *inside* A at its bottom edge, filled with B's colour
  (shapedivider.app's model: `position:absolute; bottom:0; width:100%; line-height:0`, `transform: rotate(180deg)`
  to flip, nudge 1px to hide a seam); (c) the clip goes on B's **top** and B is pulled up under A.
- **Accessibility:** none special; a divider SVG is `aria-hidden="true"`.
- **Common:** universal wherever dividers are used.

### T3. Waves, zigzags, triangles, arrows, clouds — the shape library
- **What:** more pictures than slope and curve.
- **Build:**
  - `shape()` in `clip-path` — percentages, `rem` and `calc()`, curves and arcs; **Baseline 2026 (Feb 2026)**,
    so older phones need a `polygon()` fallback first in the cascade.
  - `mask` with two repeating `radial-gradient`s (Afif) — a responsive wave whose size is a length, not a % of
    the band; `mask` is Baseline Dec 2023.
  - Inline SVG divider with `preserveAspectRatio="none"` — the generator route; scales with width.
- **Cost:** CSS forms weigh bytes; an inline SVG ~0.5–2 KB; no images.
- **Common:** generators list ~18 shapes; wave, curve, tilt and triangle are the ones in templates.

### T4. A card or block pulled over the band boundary (overlap)
- **What:** feature cards that start inside the hero and hang into the next band; a photo straddling two bands.
- **Build:** `margin-top: -4rem; position: relative; z-index: 1` on the card row (or the next band); responsive
  depth per rung; never a pixel.
- **Accessibility traps:** reading and focus order stay DOM order (fine); the overlapped band's last line must
  not be covered — reserve its padding; a focused element must not sit under the overlapping card (WCAG 2.4.11).
- **Common:** very common (LAYOUT_BENCHMARK A12/B12; "hero + cards pulled up" is a template staple).

### T5. Colour hand-over (gradient into the next band)
- **What:** band A's background fades into band B's colour so there is no hard line.
- **Build:** `background: linear-gradient(to bottom, var(--a) 70%, var(--b))` on A, or a `mask-image:
  linear-gradient(black 80%, transparent)` on A over B's colour. Scroll-linked variant (the whole page
  background changes colour as sections arrive) is in 02 (SA-12).
- **Cost:** free. **Accessibility:** text contrast must hold against **both** ends of the gradient.
- **Common:** common on modern landing pages; uncommon on school sites.

### T6. Sticky stacking sections / cards (each one piles on the last)
- **What:** as you scroll, each section slides up and **covers** the one before, which stays put (optionally
  shrinking a little).
- **Build:** every item `position: sticky; top: 0` (or `top: calc(var(--i) * 1.25rem)` for a peeking stack —
  CSS-Tricks), later items higher in z. The scale-back version (scroll-driven-animations.style): the container has
  `view-timeline-name: --cards`; each item's **inner** box animates `scale` over
  `animation-range: exit-crossing calc((i-1)/n*100%) exit-crossing calc(i/n*100%)` — animate the inner box so the
  scroll length never changes.
- **Support:** sticky everywhere; the scaling needs `animation-timeline` (Chrome/Edge 115+, Safari 26+, Firefox
  behind a flag at v152) — without it the stack still works, only the shrink is missing.
- **Reduced motion:** keep the stacking (it is positional), drop the scale.
- **Cost:** sticky is compositor-cheap; each card needs an opaque background (overdraw is small).
- **Accessibility traps:** a covered card's links are still in the tab order but **hidden under the next card**
  — Tab lands on something invisible (2.4.11); a screen-reader user on a phone was called out in the CSS-Tricks
  comments. Each card must be at most one screen tall or its bottom is never readable.
- **Common:** frequent on award/agency/product sites (Codrops' 2024 demo set is built on it); rare on school
  sites; good for "Our values" / "Why choose us" lists.

### T7. Stay-behind hero and curtain-reveal footer
- **What:** the hero stays still while the next band slides over it; at the end, the page slides up to uncover
  a footer that was waiting underneath.
- **Build:** hero `position: sticky; top: 0; z-index: 0`, next band `position: relative; z-index: 1;` opaque
  background. Footer: `position: sticky; bottom: 0; z-index: 0` with `main` `position: relative; z-index: 1`.
- **Accessibility:** the hero's links are covered once passed — fine because they are behind, not focusable
  unseen *while in view*; a footer taller than the screen must never be sticky (its top is unreachable).
- **Builder:** already gap **SP-7** (hero); the footer variant is new here.

### T8. Clip / mask wipe between sections, scroll-linked
- **What:** the next section's picture is revealed by a wipe (from the bottom, a circle, a diagonal) as you
  scroll, rather than simply scrolling into view.
- **Build:** sticky media stack; each layer animates `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)` on the
  **next** section's named `view-timeline`, `animation-range: entry 0% contain 0%`, with `timeline-scope` on the
  wrapper (Builder.io). The CSS-only older form is SP-10 (fixed child inside a clipped section).
- **Support:** `animation-timeline` as above; `clip-path` animation is composited in Chromium.
- **Reduced motion:** cross-fade instead of the wipe, or plain stacked sections.
- **Cost:** compositor-only, but one full-screen image per scene — lazy, sized to the screen (RULE AF).
- **Common:** Apple product pages and award sites; uncommon on school sites. LATER.

### T9. Full-screen sections that snap
- **What:** each section fills the window and the page settles on one section at a time.
- **Build:** `html { scroll-snap-type: y proximity }` + `section { scroll-snap-align: start; min-height: 100svh }`.
- **Support:** Baseline widely available (snap-type Apr 2022, align Jan 2020, stop Jul 2022).
- **Accessibility traps (strong):** **never `mandatory` on the page.** With zoom or 150% text a section becomes
  taller than the screen and mandatory snap jumps past its middle — content cannot be reached by keyboard or
  wheel (Roselli; MDN; web.dev: "avoid mandatory snapping with widely-spaced elements"). `proximity` only, and
  only when every section fits; `scroll-padding-top` must equal the sticky header.
- **Reduced motion:** snapping is not animation, but `scroll-behavior: smooth` must be off under `reduce`
  (already handled for the pager).
- **Common:** LAYOUT_BENCHMARK A10; common on portfolio/product sites, rare on content-heavy school sites.

### T10. Stuck / snapped state styling (no motion)
- `container-type: scroll-state` + `@container scroll-state(snapped: y)` / `(stuck: top)` — Chrome 133+ only;
  style a section only while it is the snapped one. Progressive (no support = no style). Pattern E in
  `motion-effects.md` §8 already covers `stuck`; `snapped` is new.

## HAVE / PARTIAL / GAP against the builder (verified in code 2026-10-02)

| Technique | Status | Evidence |
|---|---|---|
| T1 slope / curve edge | **HAVE** | `BandEdge` type `lib/box-model.ts:133`; fields `edgeTop/edgeBottom/edgeDepth` `:383-386`; `bandEdgeCSS()` one `clip-path: polygon()` `:6614`; canvas and export share it (`lib/box-export.ts:88`); picture gallery in `BoxInspector.tsx:908-929` |
| T1 depth unit | **PARTIAL** | depth is a **% of the band's height** (`edgePoints`, `box-model.ts:6588`), so the angle changes with the band's height — a tall band on a phone gets a much deeper cut than the same band on desktop |
| T1 words clear of the cut | **PARTIAL** | the clip cuts content too; nothing raises the band's padding by the depth |
| T2 neighbour colour fills the cut | **GAP** | the band keeps its height and nothing overlaps it, so the wedge shows the parent/page background. `docs/guide/website-builder.md:522` says "it's the section underneath that shows through" — **not what the CSS does**; to be confirmed in a headed browser (ST-1) |
| T3 wave / zigzag / triangle / SVG dividers | **GAP** | only the four values of `BandEdge` |
| T4 overlap across a band boundary | **GAP** | outer spacing cannot go below 0 (`SideSpacing` slider and inputs `min={0}`, `BoxInspector.tsx:228`, `:240`); only a floating layer (`position:"absolute"`, `box-model.ts:439`) or a shared grid area (`colStart`/rows, `:337-345`) overlaps, and both stay inside one band |
| T5 gradient band | **PARTIAL** | `background: "gradient:#a:#b"` (`box-model.ts:322`, decoded `:837`); no "fade into the next band" choice that reads the neighbour's colour |
| T6 sticky stacking sections | **GAP** (and a conflict) | `pin` exists, but `pinStackPass()` (`box-model.ts:5783`, grouping `:5810-5823`) **queues** sticky siblings in one holder below each other via `--eu-pin-above`, which is the opposite of stacking them; no scale-back |
| T7 stay-behind hero / curtain footer | **GAP** | `pagePinCover()` (`box-model.ts:4809`, used `box-export.ts:410`) always puts a page-pinned band *above* what scrolls past — existing SP-7 |
| T8 scroll-linked wipe between sections | **GAP** | no `view-timeline`, `timeline-scope` or clip animation anywhere in `lib/` (grep: 0 hits) — extends SP-10 |
| T9 full-screen sections | **PARTIAL** | `screenHeight: "half"|"full"` floor (`box-model.ts:375`) HAVE; page-level snapping GAP (scroll-snap exists only inside the pager, `pagerStripCss` `box-model.ts:3502-3514`) |
| T10 `scroll-state(snapped)` | **GAP** | no `scroll-state` in `lib/` (also noted in 01-codepen) |
| Reduced motion for transitions | **HAVE** (where motion exists) | the shapes are static; the pager's smooth scroll is undone under `reduce` (`BoxCanvas.tsx:3544-3551`) |

## Gap list

| Id | Plain description | Sort |
|---|---|---|
| **ST-1** | A sloped/curved edge shows the page colour in the cut, not the next band's colour; the guide says otherwise. Check in a headed browser, then let the neighbour fill the cut (pull it up under the shape by the depth, or draw the divider in the neighbour's colour). | **CHECK → MUST** |
| **ST-2** | Edge depth is a % of the band's height, so the same slope is steep on a phone and flat on desktop; give the depth in `rem` (clamped, fluid) so the shape looks the same at every rung. | DECIDE |
| **ST-3** | The cut can slice through words, buttons and focus rings near the edge; add the depth to the band's padding on that side by default (space-by-default rule). | **CHECK → MUST** |
| **ST-4** | More divider pictures — wave, zigzag, triangle/arrow, tilt — drawn with `shape()`/`mask` (polygon fallback), still one emitter for canvas and export. | DECIDE |
| **ST-5** | Pull a block over the band boundary ("cards that hang off the hero"): a per-rung negative outer spacing on the top side, with z-order and a guard that it never covers the band above's words. | **MUST** |
| **ST-6** | "Fade into the next section": a gradient whose end colour is the next band's colour, kept in sync when either changes, contrast checked at both ends. | LATER |
| **ST-7** | Stacking sections: sibling bands that stick at the same top and pile on each other (optional peek offset, optional scale-back), instead of being queued below one another; inactive/hidden cards' links leave the tab order while covered. | DECIDE |
| **ST-8** | Curtain-reveal footer: the page slides up to uncover a footer waiting behind it (only when the footer fits on screen). Joins SP-7 (stay-behind hero) as one "behind" choice. | DECIDE |
| **ST-9** | Scroll-linked wipe from one full-screen scene to the next (clip-path on a named view timeline), cross-fade under reduced motion. Extends SP-10. | LATER |
| **ST-10** | Full-screen sections that settle one at a time: page-level `y proximity` snapping, never `mandatory`, switched off automatically when any section is taller than the screen. | DECIDE |
| **ST-11** | Style the section that is currently snapped / stuck (`scroll-state(snapped)`) — Chromium only, harmless elsewhere. | LATER |
