# Scroll & position — sticky, fixed, section transitions, scroll animation (RULE R)

Research the user asked for on 2026-10-01: **section transitions · animation · `position: sticky` · `position: fixed`** —
"mainly for layout", components second. The user sends links, each a different way of doing it; every link (and the
links inside it) is studied, stored here distilled, and every technique marked against the builder: `HAVE` · `PARTIAL`
· `GAP`. The gaps go into the layout definition of done, `docs/TASK_TREE.md` → 1.1.5 → "Section transitions ·
animation · sticky · fixed".

## Sources

| # | Source | File | What it is |
|---|---|---|---|
| 1 | https://codepen.io/tag/sticky-header (all pages) + https://codepen.io/tag/fixed-position (all pages) | [01-codepen-sticky-fixed.md](01-codepen-sticky-fixed.md), raw code in [raw/codepen-sticky-fixed.json](raw/codepen-sticky-fixed.json) | 47 pens (17 + 30), HTML / CSS / JS read from each pen's editor |
| 2 | https://mimo.org/glossary/css/position-sticky | below | a reference page on `position: sticky` |
| 3 | https://www.awwwards.com/inspiration/sticky-elements-petro-design (+ the live site https://petro.design/) | below | an Awwwards "element" (a video) and the live site, measured |

## 2 · mimo — `position: sticky`, the reference

- **What it is:** a hybrid of `relative` and `fixed` — the element stays in the flow until a THRESHOLD (`top`, `bottom`,
  `left` or `right`) is reached while scrolling, then holds there — but only **inside its containing block**: when the
  parent's bottom passes, it scrolls away with it (unlike `fixed`, which is tied to the viewport). It sticks within its
  **nearest scrollable ancestor**.
- **Uses:** a header / navbar (`top: 0; z-index; background`), a sidebar (`top: 20px`, filter panels), **table headers**
  (`thead th { position: sticky; top: 0 }`), **horizontal stickiness** (`left: 0` for a first column / a dashboard's
  row headers), in a grid (`1fr 3fr` with a sticky sidebar), with a transition when a class marks it active.
- **Why it does not stick:** (1) no threshold (`top: 0` is required); (2) an ancestor with `overflow: hidden | scroll |
  auto` (it then sticks inside THAT box, which does not scroll); (3) the parent is not taller than the sticky element
  (no room to travel). A `z-index` is usually needed or later content paints over it.
- **When not to use it:** in containers of unpredictable height, across several parents, too many sticky elements at
  once (clutter), where an old-browser fallback is critical.
- **Accessibility:** a sticky header must not cover form fields, buttons or the focused element when tabbing; check it at
  every screen size.

**For the builder:** a pinned block (`pin: top | bottom | left | right`) IS `position: sticky` with its threshold, and
its scope (`page` / `row` / around a block) is the containing block — `HAVE`. The three "why it does not stick" causes
are the engine's job, not the person's: a pin must never sit inside a clipping ancestor or a parent no taller than
itself without the editor saying so (CHECK). Layering is handled (`pinStackPass`, `pagePinCover` gives a pinned page band
its own layer and background — F1-b). Sticky TABLE headers and first columns belong to the Table component. The
focus / anchor rule is a CHECK: `scroll-padding-top` equal to the pinned bars' height (`--eu-pin-above`), so a link to
`#section` or a tabbed-to control never lands under the header (WCAG 2.4.11 Focus Not Obscured).

## 3 · petro.design — the Awwwards "Sticky elements"

The Awwwards entry is a short video (tags: sticky header · sticky footer · fixed header · sticky navigation · fixed
navigation · scroll). Measured on the live site (a Framer build), at five scroll depths of a 10,763px page:
- **The header is `position: fixed`, `top: 0`, 64px, full width, `z-index: 10`**, transparent itself, with a SEPARATE
  fixed layer behind it (`z-index: 9`, a solid near-black `rgb(10,15,16)` child) — the bar's background is its own layer,
  so it can be shown, faded or slid independently of the links (the "transparent → solid" pattern without touching the
  menu). Logo left, INDEX · PROJECTS · ABOUT ME right; it never changes position while scrolling.
- **A custom cursor:** a 16px `position: fixed` dot (`z-index: 13`) following the pointer with **`mix-blend-mode:
  difference`** (it inverts whatever is under it).
- No `position: sticky` elements on the home page; the "sticky" look is fixed bars over scrolling content.
- Related Awwwards elements linked from the page (to study with the other Awwwards links): scroll — Rosehip ·
  horizontal scrolling page — Studio Illicit · scroll overview — Quechua 2025 lookbook · scroll-based animations — G.S ·
  work page — Emma is Social · homepage on scroll — Melvin Winkeler · infinite-scroll photo archive — Theatre of Memory ·
  homepage animation — Type One Ventures.

**For the builder:** a fixed header over content → `HAVE` as a pinned page band (sticky behaves the same at the top of
the page and does not need the space reserved by hand); a bar background on its OWN layer that appears on scroll →
`HAVE` as `pinArrival` (`solid`, `glass`, `shadow`, `rule`, `condense`), to confirm it changes only the background, not
the links; a custom cursor with a blend mode → MOTION / effect, not layout (and a cursor that hides the real pointer is
an accessibility risk — LATER at most).

## mimo glossary pages (read in full 2026-10-02)

Every page linked from the `position: sticky` page (9) plus the motion links found inside animation and transition (3)
was fetched and read; the fetch tool returns a distilled copy, so a page's own long-tail wording may be fuller than below.
Marks (HAVE / PARTIAL / GAP) are verified by grep of `lib/box-model.ts` and `lib/box-export.ts`.

**animation** (/css/animation) — `@keyframes` plus `animation-name/duration/timing-function/delay/iteration-count/direction/fill-mode/play-state`.
Examples: button hover pulse (scale 1→1.1→1), spinner (rotate, `1s linear infinite`), fade-in, rotate icon, scale-up on hover,
background-colour cycle (`4s infinite alternate`), move-and-fade (`translateY(-20px)`+opacity), stagger by `animation-delay`,
iteration count `3`, `alternate`, `animation-play-state: paused`, JS `style.animation = "shake 0.5s"`, Animate.css via CDN.
Tips: animate `transform`/`opacity`, not width/height; `will-change`; animation = sequences/loops, transition = A to B.
Builder: entrances and keyframes HAVE (`pinArrivalKeyframes`, box-export.ts:12, 585-588); layout-property animation is refused
(`LAYOUT_ANIMATION_PROPS`, box-model.ts:1255-1315) — HAVE, matches the "transform/opacity only" tip. Animate.css from a CDN conflicts with RULE AF weight budget (not wanted).

**transition** (/css/transition) — shorthand `property duration timing-function delay`. Examples: width hover, button colour,
accordion via `max-height: 0 -> 200px`, progress bar width, nav-menu height, modal and gallery opacity, multiple properties,
`cubic-bezier(0.25,0.1,0.25,1)`, delay, `transitionend` event in JS. The page animates `height`/`max-height`/`width`: layout
properties, which the builder deliberately refuses (box-model.ts:1315); an accordion should use grid-rows or transform/opacity (PARTIAL: refusal HAVE, accordion technique not verified).

**animation-keyframes** — 0%–100% steps, `slideIn` from `translateX(-100%)`; multi-property; stagger with `nth-child` + delay;
`infinite` loops; avoid animating width/height/top; limit concurrent animations on mobile. Same mapping as animation. Staggered delay: HAVE (corrected 2026-10-02) — a container's entrance can apply to its children, each a beat later
(`box-model.ts:467`); its length is EX-6 (90 ms × 10 children = 810 ms, cap it).

**transform-property** — translate / scale / rotate / skew / matrix; chaining; `transform-origin`, `perspective`; GPU-accelerated;
does not reflow neighbours; a transformed element creates a stacking context and a containing block for fixed children (relevant to pins, see z-index).

**hover** (/css/hover) — `:hover` for links, buttons, images (opacity / filter), cards (scale / shadow); pair with `transition`;
pair hover with `:focus` for keyboard users; never hide essential information behind hover; touch devices do not hover reliably;
inline elements need `inline-block`. Builder: named hover + focus effects exist (project memory "Interactions"); hover-only content stays a CHECK.

**viewport** — `vh vw vmin vmax`; `<meta name="viewport" content="width=device-width, initial-scale=1.0">`; `100vh` is wrong on
mobile (address bar) — the page suggests a JS `window.innerHeight` workaround; `clamp(2rem, 5vw, 4rem)`; full-screen hero; sticky footer via flex.
Builder: HAVE and better — full-screen is `100svh` / `50svh` (box-model.ts:5613-5622), no JS. Page text in bare `vw` is rejected (RULE 16: rem in the ideal term).

**z-index** — only on positioned elements; negative values go behind; conventional scale (header 500, dropdown 1000, modal 9999);
`opacity<1`, `transform`, `filter` create stacking contexts, so a child cannot escape its parent's layer.
Builder: HAVE — a named scale `PAGE_Z` (`behind`, `raised`, `sticky`, `toast`; box-model.ts:1074, 1956, 4813), `clampPageZ`, `floatZIndex` (box-export.ts:395); not the 9999 habit.

**grid-layout** — two-dimensional; `display:grid`, `grid-template-rows/columns`, `1fr`, `repeat()`, `minmax()`, `place-items: center`,
`grid-column`/`grid-row` spans, gaps; fewer media queries. Builder: HAVE — twelve-track grid `repeat(n, minmax(0,1fr))` (box-model.ts:3385, 5045), rows `minmax(min-content,1fr)` (5089), masonry rows.
Sticky sidebar in `1fr 3fr` (from the sticky page) is the pin scope case — HAVE.

**flexbox** — one axis; `justify-content`, `align-items`, `flex-direction`, `flex: 1`, `flex-grow/shrink/basis`, `order`, `align-self`;
centring; "flexbox for components, grid for page layout". Builder: HAVE — rows/stacks are flex; `alignSelf` is on the node (box-model.ts:207). `order` not exposed (not verified further).

**padding** — inner space; one to four values (T / H / B, clockwise); `%` is relative to container width; media queries to adjust.
Builder: per-side padding and gap with defaults per the space-by-default rule (see CLAUDE.md rule 3); stored in rem. Not re-grepped here.

**margin** — outer space; logical properties (`margin-block/inline-*`); `margin: 0 auto` centring; vertical margin COLLAPSE
(20px + 20px = 20px); negative margins for overlap/badges; not inherited. Builder: `margin-inline`/`margin-block` are in the animated-layout deny list (box-model.ts:1259); collapse is avoided by flex/grid gaps (flex/grid margins never collapse). Per-side margin controls exist per CLAUDE.md rule 3 (not re-grepped).

**header-tag** (/html/header-tag) — `<header>` is introductory content (logo, heading, nav) for the page OR a section/article; several
allowed per document; not `<head>`; no main content or forms inside. Builder: semantic `header` tag handled by the semantics pass (see `docs/web-anatomy/html-semantics.md`).

### What matters for layout / sticky / motion (new on top of section 2)
- **`scroll-padding-top` for pinned bars: PARTIAL (corrected 2026-10-02 — the agent's first grep missed it).** It IS
  set, for bars held to the WINDOW (`box-model.ts:5872`), and `--eu-pin-above` exists (`box-model.ts:5780`). The gap is
  the STICKY header once stuck (SP-1) and the fixed BOTTOM bar (SF-1) — already in 1.1.5.
- A transform, filter or `opacity<1` on an ancestor creates a stacking context and a containing block for fixed children: a `fixed` pin inside such a block will not be viewport-fixed. The pin CHECK in section 2 should include it.
- `100vh` vs `svh`: HAVE and ahead of mimo.

### Completeness
| Page | Status |
|---|---|
| /css/position-sticky | READ (links list taken from it) |
| /css/animation | READ |
| /css/transition | READ |
| /css/viewport | READ |
| /css/z-index | READ |
| /css/grid-layout | READ |
| /css/flexbox | READ |
| /css/padding | READ |
| /css/margin | READ |
| /html/header-tag | READ |
| /css/animation-keyframes | READ (link from animation + transition) |
| /css/transform-property | READ (link from animation + transition) |
| /css/hover | READ (link from transition) |
| /glossary/css, /html/buttons, /html/links, /html/images, /glossary/javascript | NOT READ — general topic pages, not motion |
