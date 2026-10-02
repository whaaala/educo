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
