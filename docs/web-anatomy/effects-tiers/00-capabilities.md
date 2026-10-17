---
title: The effects and motion capabilities — the shared list (BATCH RX-4)
---

# The effects and motion capabilities — the shared list (BATCH RX-4, 2026-10-16)

One list, so every builder's baseline (`baseline-*.md`, step 2), the frequency on real sites and our own
HAS · PARTLY · GAP (step 3) line up row for row — the same shape as the layout audit
([../layout-tiers/00-capabilities.md](../layout-tiers/00-capabilities.md)). Each row is a capability a person building a
website might want; the ID is used everywhere in RX-4. A source that shows a capability this list lacks ADDS a row at
the end of its axis (with a new ID), never a note on the side.

**IDs are local to RX-4.** Some prefixes also name ledger lines in `docs/TASK_TREE.md` (the tree's `ST-1`, `HV-17`,
`SP-4`…). Where a row points at a ledger line, [01-inventory.md](01-inventory.md) names it with its batch
(e.g. "S-4: ST-1"), so the two never get confused.

Built only from research already stored: `motion/LIBRARY.md` + `motion/library/1…11`, `motion/01` · `03`,
`area-v/AXIS-MAP.md` + `taste-set.md`, `awwwards-motion-survey.md`, `motion-effects.md`, `codepen/*.md`,
`research-runs/AGGREGATE.md`.

| ID | Axis | Capability |
|----|------|-----------|
| PT-1 | Page transitions | Plain page load — the baseline every transition falls back to |
| PT-2 | Page transitions | Cross-fade between pages (cross-document View Transition, no script) |
| PT-3 | Page transitions | Directional slide between pages (forward one way, back the other) |
| PT-4 | Page transitions | Wipe / curtain / cover between pages (clip-path on the new page, or a cover layer) |
| PT-5 | Page transitions | Header and footer stay still while the page changes |
| PT-6 | Page transitions | Shared-element morph (a card's picture grows into the detail page) |
| PT-7 | Page transitions | An in-page change animated as a transition (tabs, filters, slides) |
| PT-8 | Page transitions | Fetch the next page early (prefetch / speculation rules) so the change feels instant |
| PT-9 | Page transitions | App screens: push / pop, tab fade-through, predictive back (`apps/mobile/`) |
| ST-1 | Section transitions / band edges | Sloped or curved band edge (top, bottom, both; depth; flip) |
| ST-2 | Section transitions / band edges | The cut shows the NEXT band's colour, not the page colour ("puzzle" divider) |
| ST-3 | Section transitions / band edges | A divider shape library: wave · zigzag · triangle / arrow · cloud · torn · scallop · drip |
| ST-4 | Section transitions / band edges | Layered translucent waves (2–3 stacked shapes) |
| ST-5 | Section transitions / band edges | Cards or a picture that hang over the boundary between two bands (overlap) |
| ST-6 | Section transitions / band edges | A moving edge: a drifting wave, or a divider that changes shape as you scroll |
| ST-7 | Section transitions / band edges | Full-screen sections that settle one at a time (page snap) |
| ST-8 | Section transitions / band edges | A scroll-linked wipe from one full-screen scene to the next (clip / mask) |
| ST-9 | Section transitions / band edges | Curtain-reveal footer (the page slides up to uncover it) |
| ST-10 | Section transitions / band edges | A shaped edge keeps its band's shadow / border (not clipped away) |
| BL-1 | Blending between bands | One band's colour fades into the next (gradient across the seam) |
| BL-2 | Blending between bands | One background shared across several bands (a continuous gradient / photo behind them) |
| BL-3 | Blending between bands | An overlay over a photo or band: flat · gradient scrim · direction · opacity |
| BL-4 | Blending between bands | An element blends with what is behind it (`mix-blend-mode`, e.g. words that invert) |
| BL-5 | Blending between bands | Background layers blend with each other (`background-blend-mode`) |
| BL-6 | Blending between bands | A mask fades a picture or a band's edge into what is behind (gradient / SVG mask) |
| BL-7 | Blending between bands | The page colour changes as each section arrives |
| BL-8 | Blending between bands | A held header / big title that changes colour over each band beneath |
| BL-9 | Blending between bands | Stay-behind hero: the next band slides up over a held picture |
| BL-10 | Blending between bands | Full-screen "windows" onto fixed pictures (clip-revealed fixed scenes) |
| BL-11 | Blending between bands | Glass: a frosted panel or bar over a band (`backdrop-filter`) |
| BG-1 | Backgrounds | Solid colour, with transparency |
| BG-2 | Backgrounds | Gradient: linear · radial · conic, stops, position, colour space |
| BG-3 | Backgrounds | Mesh / aurora (layered soft radial blobs) |
| BG-4 | Backgrounds | Photo: cover / contain, position, repeat |
| BG-5 | Backgrounds | A colour or gradient UNDER a photo, both kept |
| BG-6 | Backgrounds | Fixed background photo (stays while the page scrolls), with a phone fallback |
| BG-7 | Backgrounds | Background video (muted loop, poster frame) |
| BG-8 | Backgrounds | Pattern (CSS gradient / SVG pattern tiles) |
| BG-9 | Backgrounds | Grain / noise texture |
| BG-10 | Backgrounds | Moving background (gradient drift, angle turn, moving grain) |
| BG-11 | Backgrounds | WebGL / canvas / shader background |
| HV-1 | States | Hover: colour change (text, background) |
| HV-2 | States | Hover: lift / grow (the thing itself moves) |
| HV-3 | States | Hover: image zoom inside its frame |
| HV-4 | States | Hover: icon nudge / label roll / text swap |
| HV-5 | States | Hover: border / outline appears |
| HV-6 | States | Hover: underline grows |
| HV-7 | States | Hover: shadow grows (and shrinks on press) |
| HV-8 | States | Hover: fade / dim — including group hover (dim the others) |
| HV-9 | States | Hover: fill sweep (colour slides across) |
| HV-10 | States | Hover: reveal a caption or overlay |
| HV-11 | States | Hover: filter (brighten, grayscale → colour) |
| HV-12 | States | Cascade: a parent's hover drives its children (card hover moves its button and words); a child's own still works |
| HV-13 | States | Focus ring visible on every focusable thing |
| HV-14 | States | Keyboard twin of every hover (`:focus-visible`, `:has(:focus-visible)`) |
| HV-15 | States | Press feedback (`:active` — dip, shrink, state layer), ripple |
| HV-16 | States | Selected / current / open state styled (current page, chosen tab, open item) |
| HV-17 | States | Hand cursor on everything that acts |
| HV-18 | States | Direction-aware and proximity hover |
| EN-1 | Entrance / reveal | Reveal as it scrolls into view (fade · rise · zoom), once |
| EN-2 | Entrance / reveal | Entrance on page load (the hero arrives) |
| EN-3 | Entrance / reveal | One after another (stagger), capped |
| EN-4 | Entrance / reveal | Preloader / full-screen intro |
| EN-5 | Entrance / reveal | Entrance for things that appear later (`@starting-style`) |
| EN-6 | Entrance / reveal | Leaving before removal (exit animations) |
| EN-7 | Entrance / reveal | Menu opens and closes: overlay menu, drawer |
| EN-8 | Entrance / reveal | Dialog / popover / dropdown / tooltip open and close |
| EN-9 | Entrance / reveal | Accordion / details open and close |
| EN-10 | Entrance / reveal | Toast / alert arrives and is dismissed |
| EN-11 | Entrance / reveal | List items arrive, leave and move (FLIP) |
| SC-1 | Scroll-driven motion | Parallax — moves slower than the page |
| SC-2 | Scroll-driven motion | Layered parallax hero (several depths) |
| SC-3 | Scroll-driven motion | Scrubbed animation — transform / scale / rotate / fade tied to scroll |
| SC-4 | Scroll-driven motion | Reading / scroll progress bar |
| SC-5 | Scroll-driven motion | Section-linked nav highlight (scroll-spy) |
| SC-6 | Scroll-driven motion | Horizontal section driven by vertical scroll |
| SC-7 | Scroll-driven motion | Marquee / ticker (loops by itself) |
| SC-8 | Scroll-driven motion | Sideways swipe strip / carousel with snap |
| SC-9 | Scroll-driven motion | Auto-advancing carousel / pager (with Pause) |
| SC-10 | Scroll-driven motion | Picture grows from framed to full-bleed (clip reveal on scroll) |
| SC-11 | Scroll-driven motion | A line that draws itself (SVG stroke) |
| SC-12 | Scroll-driven motion | Smooth-scroll (inertia library) |
| PN-1 | Held / pinned | Header held at the top (fixed or sticky) |
| PN-2 | Held / pinned | See-through header that fills in after scrolling |
| PN-3 | Held / pinned | Header that shrinks, or hides on scroll down and shows on scroll up |
| PN-4 | Held / pinned | Pinned story scene (picture stays, steps change it) |
| PN-5 | Held / pinned | Stacking cards / sections (each slides over the last) |
| PN-6 | Held / pinned | Sticky sidebar / contents rail |
| PN-7 | Held / pinned | Floating corner widget (back to top, chat / WhatsApp button) |
| PN-8 | Held / pinned | Bottom bar on a phone (call to action, cookie bar) |
| PN-9 | Held / pinned | Styling a bar or section while it is stuck / snapped |
| TX-1 | Text effects | Line reveal (a heading rises line by line out of a mask) |
| TX-2 | Text effects | Word / letter stagger (split text) |
| TX-3 | Text effects | Words light up as you scroll |
| TX-4 | Text effects | Typewriter |
| TX-5 | Text effects | Rotating word (one word in a sentence cycles) |
| TX-6 | Text effects | Scramble / decode |
| TX-7 | Text effects | Letters roll on hover |
| TX-8 | Text effects | Gradient or shimmer text (`background-clip: text`) |
| TX-9 | Text effects | Outline text that fills (`-webkit-text-stroke`) |
| TX-10 | Text effects | Marker highlight sweeps behind words |
| TX-11 | Text effects | Variable-font weight / width animates |
| TX-12 | Text effects | Text shadow / halo that keeps words legible over a photo |
| CU-1 | Cursor / pointer | Custom cursor that follows the pointer |
| CU-2 | Cursor / pointer | Cursor that inverts over what is behind (blend) |
| CU-3 | Cursor / pointer | Magnetic button |
| CU-4 | Cursor / pointer | Spotlight / glow that follows the pointer |
| CU-5 | Cursor / pointer | Tilt / 3D card follows the pointer |
| MO-1 | Motion tokens | A duration scale (named steps) |
| MO-2 | Motion tokens | Easing curves by role (enter, exit, move, emphasised) |
| MO-3 | Motion tokens | Springs as `linear()` (and real springs on native) |
| MO-4 | Motion tokens | Stagger step and its cap |
| MO-5 | Motion tokens | Exit shorter than enter |
| MO-6 | Motion tokens | Per-effect duration / delay / easing / repeat a person can set |
| MO-7 | Motion tokens | One token set for the web export and the native app |
| A11Y-1 | Accessibility | Reduced motion: every effect swaps to a fade / still, never just strips |
| A11Y-2 | Accessibility | The global safety net (loops stop, one iteration) |
| A11Y-3 | Accessibility | Anything moving by itself > 5 s has a visible Pause (WCAG 2.2.2) |
| A11Y-4 | Accessibility | No flashing (WCAG 2.3.1) |
| A11Y-5 | Accessibility | Hover only where hover exists (`(hover: hover)`); nothing needs a hover on touch |
| A11Y-6 | Accessibility | Motion never hides meaning; a leaving / hidden thing is not focusable (`inert`) |
| A11Y-7 | Accessibility | Other preferences: reduced transparency, more contrast, forced colours |
| A11Y-8 | Accessibility | A visitor-facing motion switch on the page |
| A11Y-9 | Accessibility | Contrast held over effects (words over a photo, gradient, glass) |
| WT-1 | Weight / performance | No motion library by default (CSS first) — within RULE AF's 100 KB |
| WT-2 | Weight / performance | Compositor-only motion (transform / opacity), no layout animation |
| WT-3 | Weight / performance | Blur capped (glass ≤ 12px, few elements) |
| WT-4 | Weight / performance | Grain on bands, never a fixed full-page layer; moving textures opt-in |
| WT-5 | Weight / performance | `will-change` only in time; `content-visibility` for long pages |
| WT-6 | Weight / performance | Heavy media (video, WebGL) poster-first, lazy, off on Save-Data / phone |
| WT-7 | Weight / performance | Measured on a 360px low-cost phone, CPU slowed, Slow 3G |
| LD-1 | Loading (RX-5) | A thin progress bar while the next page loads |
| LD-2 | Loading (RX-5) | A blur-up or dominant-colour placeholder under every photo until it arrives |
| LD-3 | Loading (RX-5) | Skeletons for content that arrives late (feeds, lists) |
| LD-4 | Loading (RX-5) | The first band shown at once — nothing above the fold waits for script, fonts or below-the-fold media |
| LD-5 | Loading (RX-5) | A full-screen splash that hides the page until everything loads — OUT (on 3G it makes the wait longer) |
| MO-8 | Motion tokens (RX-5) | A gallery of looping ("ongoing") motions, each with a Pause |
| MO-9 | Motion tokens (RX-5) | An easing gallery: every family × in / out / in-out, springs, a curve editor |
