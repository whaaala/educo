# The Design Foundation — MUST-FOLLOW checklist (RULE F)

The user's course deck (`theory-lectures-v2-BEST.pdf`, Schmedtmann HTML & CSS) is the foundation for how
**everything** in the builder is designed and built. This page is the checklist; the full distillation with every
page reference is in the four files below. **Before building or changing anything, check it against this list.**
A place where the builder does not follow it is a ledger line, fixed like a bug.

| File | Covers |
|---|---|
| [01-foundations.md](01-foundations.md) | HTML/CSS fundamentals, box model, positioning, flexbox, grid |
| [02-web-design-rules-1-9.md](02-web-design-rules-1-9.md) | Layouts; Web Design Rules #1 Typography · #2 Colours · #3 Images · #4 Icons · #5 Shadows · #6 Border-radius · #7 Whitespace · #8 Visual hierarchy |
| [03-components-and-layout-patterns.md](03-components-and-layout-patterns.md) | #9 UX rules · the 7 website personalities · #10 elements, components, section components, layout patterns |
| [04-process-and-responsive.md](04-process-and-responsive.md) | The 7 steps to a great website · responsive design · media queries · breakpoints |
| [../media-performance.md](../media-performance.md) | Images, lazy loading, video, fonts, privacy, performance budgets (researched separately, same standing) |

Page numbers below are the deck's text pages ("p.").

## Typography (#1)
- Use a **pre-defined type scale** — never pick sizes freely (p. 99).
- Body text 16–32px; long-form reading ≥ 20px; headings large (50px+) and weight 600+ (p. 100).
- Never a font weight below 400 for text (p. 100).
- **Under 75 characters per line** (p. 102).
- Line-height 1.5–2 for normal text; below 1.5 for large headings (p. 103).
- Don't justify text; don't centre long blocks of text (pp. 106–107).
- **One typeface per page, two at most** (p. 97).

## Colour (#2)
- A palette is **main + accent + greys**, with generated **tints and shades** — never named CSS colours or random tones (pp. 111–113).
- **Contrast ≥ 4.5:1** for normal text, **≥ 3:1** for large text (p. 120) — asserted, never assumed.
- On a dark background use a tint of it for text, not pure white; body text is a dark tint, not pure black (pp. 118–119).

## Images and illustrations (#3) — plus lazy loading and performance
- Prefer original images over generic stock (p. 128).
- Serve images at **2× their displayed size** for high-resolution screens, **compressed** (pp. 133, 135).
- Images side by side in a row share the same dimensions (p. 136).
- From `media-performance.md`: every image has `width`/`height` or `aspect-ratio` (no layout jump); **lazy-load everything below the fold, but never the main (LCP) image** — that one is `eager` + `fetchpriority="high"`; AVIF → WebP → JPEG via `<picture>`; alt text per WCAG 1.1.1; LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms; no third-party requests on load.

## Icons (#4)
- **SVG only** (or an icon font) — never bitmap icons (p. 151).
- **One icon pack** per site (p. 150); icon colour is `currentColor` by default (p. 155).
- Icon-only buttons get a label unless their meaning is truly obvious (p. 154).

## Shadows (#5)
- A **three-step scale — small / medium / large** — tied to elevation (pp. 166–168).
- Off by default for Serious/Elegant, Minimalist, Plain and Bold personalities; subtle for Calm, Startup and Playful (p. 164 + personalities).

## Border-radius (#6)
- A **personality choice, never a default**: none for serious, lots for playful (p. 175) — matches Core Rule 3 ("nothing is rounded until someone asks").
- Match the chosen typeface's own roundness (p. 176).

## Whitespace (#7)
- **Lots of space between sections** (≈ 96–192px), less within a group (≈ 24px) (pp. 185–187).
- **Law of proximity**: closer means more related (p. 189).
- Start with too much space, then remove (p. 193); spacing comes from a scale based on multiples of 16px (p. 196).

## Visual hierarchy (#8)
- Hierarchy comes from **position, size, colour, spacing, borders and shadows, combined** (p. 199).
- The most important things go near the top (p. 203).
- De-emphasise secondary text and components — don't only emphasise the primary (pp. 206, 211, 214, 216).

## UX and personalities (#9, framework)
- The UX rules for usability and content in [03](03-components-and-layout-patterns.md) (pp. 222–233).
- **Seven website personalities** (serious/elegant · minimalist/simple · plain/neutral · bold/confident · calm/peaceful · startup/upbeat · playful/fun), each fixing typography, colours, images, icons, shadows, radius and layout; bold, calm and playful traits can be **injected** onto any base personality (pp. 236–255).

## Components and layout patterns (#10)
- Build from **elements → components → section components → layout patterns**, each from the one below (component-based, building on top).
- The full named list is the checklist table in [03](03-components-and-layout-patterns.md). **Open gap:** those gallery slides are pictures, so their entries still need checking against the slide images (see below).

## The 7 steps to a great website
- **Define → Plan → Sketch → Design & build → Test & optimise → Launch → Maintain** (pp. 353–360).
- Testing includes **real mobile devices**, not only browser tools (p. 358).

## Responsive design
- The **four ingredients**: fluid layouts (%, vw/vh, `max-width` not fixed `width`), **rem units** not px, flexible images (% + `max-width`), media queries (p. 371) — matches Core Rule 16.
- **Desktop-first**: the cascade shrinks from desktop with `max-width` queries (p. 372) — matches Core Rule 18 (`base` is desktop).
- Breakpoints: device-based = bad; round numbers like 600 / 900 / 1200 = good; **where your own design breaks = best** (pp. 402–404) — our rungs are 600 / 900 / 1200 / 1800.

## Open — to verify against the slide images
The last pass could read only the slides' text (no image renderer was available), so these still need a look at the
pictures, at low cost, when one is: the type-scale values (p. 99), the whitespace pixel scale (pp. 185–196), the
shadow values (pp. 166–168), the Z/F reading patterns and asymmetry slides (pp. 199–217), and **the whole components
and layout-patterns gallery** (pp. 262–350), whose entries are named and paged but described generically.
