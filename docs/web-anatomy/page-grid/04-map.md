# The page grid — THE MAP (RULE MAP steps 1, 4 and 5 · AC-37b)

The map for **AC-37b, the page grid**. It merges the five sources below into one list of independent axes, each value
with how it is made, who uses it and a verdict. Then come the 80/20, the open questions for the user, the gaps and the
draft "enough" checklist. Written 2026-10-03 (session e9d19b5c).

| Source | What it gives | Limits |
|---|---|---|
| [01](01-builders-and-systems.md) | builders (Webflow, Framer, Wix Studio, Figma) + systems (Material, Bootstrap, Tailwind, GOV.UK) + MDN; axes A1–A15 | docs, not measured pages |
| [02](02-awwwards-items.md) | 35 Awwwards records (26 distinct live designs), measured at 1440 / 1024 / 768 / 375, **v3 corrections applied** | 4 dead or parked domains (image only); blind spots listed in 02 |
| [03](03-dribbble-shots.md) | 21 Dribbble designs, 102 images (intent, not CSS) | 21 more shots not yet read |
| [05](05-crawl-splits.md) | 23,728 rows on 4,250 crawled pages: the share of each split | **desktop only (1440)**; gaps folded into parts; nested rows counted |
| [07](../advanced-css/07-grid.md) · [08](../advanced-css/08-nexter.md) | every Grid property; Nexter's named-line page (full / half-bleed), subgrid; gaps AC-29 … AC-36 | a course, 2018 |

**Decisions already taken** (from `TASK_TREE.md` AC-37 / AC-37a / AC-37b / AC-37c; they are not reopened here):
- One hidden **page grid** — **invisible in the editor too** (the user, 2026-10-03): it works in the background; a
  "Show layout guides" switch, OFF by default, is the only way to see it.
- The Grid block is mapped onto it. A count that twelve does not divide keeps its own equal columns inside its span.
- **Content decides the span, never the grid.** The input is `longestWordRem` (`lib/box-model.ts:3370`).
- Half-steps are stored first; quarters can come later.
- Blocks can bleed out of a section.
- People choose by **purpose** (Menu / Cards / Logos) and the builder picks flex or grid.
- Rules that apply: rule 16 (rem / %, container queries) · rule 18 (`base` IS desktop; rungs 600 · 900 · 1200 · 1800, in `em`) · RULE AF (360 px phones).

**Verdicts:**
- **CORE** = must be in v1.
- **LATER** = keep the model able to do it, build after.
- **AVOID** = not offered, with the reason.

**Who:**
- `#n` = a 02 record.
- `D#n` = a 03 shot.
- Builder or system names come from 01.

---

## 1. Axes

### A1 — Column count per rung
| Value | How | Who | Verdict |
|---|---|---|---|
| 4 / 8 / 12 | `repeat(var(--cols), minmax(0,1fr))`, `--cols` 4 → 8 at 37.5em → 12 at 56.25em | Material (M2 / MDC / M3). No real site and no design in 02 / 03 uses it | **OPEN — Q1** |
| 12 at every rung, spans change | `--cols: 12` everywhere; the phone spans 12 | Bootstrap; Normform #29 (keeps 12, every child `1/-1` below 768); MySales D#12 (tablet keeps 12) | **OPEN — Q1** |
| A doubled or other ladder | `--cols` 6 → 12 (or 7 → 14, 16 → 6, 22 → 12, 24/18/12/2) | Simonini #6 6/4/3; Hervé #19 7/14; Lallé #24 6/16/16; AC Visa #21 12/22; Eddie #27 2/12/18/24 | **OPEN — Q1** (recommended 6 / 12) |
| A count from a minimum width (auto-fit) | `repeat(auto-fit, minmax(min(100%,15rem),1fr))` | Webflow, Framer; Normform utility; Punchline CTA | CORE for a **component's** grid (AC-33). AVOID for the page grid: it is the coordinate system, so its count must be known |
| Its own count per section, inside its span | `grid-column: content; display:grid; grid-template-columns: repeat(5,minmax(0,1fr))` | Punchline #2/#12, Digivalet #13, Street Art #5 (36 grids), Weareheavy #20 (journal 8) | CORE (already decided: "keeps its own equal columns") |
| A frame of % lines | `width: 31.6%` columns (Klimov #11) | Klimov | AVOID as a mode: half-steps on 12 come within ≤0.3 col |

### A2 — Breakpoints and the cascade
| Value | How | Who | Verdict |
|---|---|---|---|
| Desktop base, cascading to narrower; wide branches up | `@media (max-width: 74.99em)` … ; `(min-width: 112.5em)` | rule 18, Webflow | CORE (have) |
| Mobile-first `min-width` | `@media (min-width: 37.5em)` | Bootstrap, MDC, Simonini, Lallé | only an emit style. No choice for the person |
| A further re-placement at a wide rung | an override at 1800 (`wide`) | Lallé #24 (xl at 1200 re-places items) | CORE (it is the 5th rung) |
| Orientation / height aware | `@media (orientation: landscape) and (max-height: 30em)` keeps the phone grid | AC Visa #21 (phone grid up to 900 px landscape); M3 height classes | LATER — **gap G5** |
| Follows its container, not the window | `@container (inline-size < 40em)` | Codrops #17 (a fixed 360 px sibling makes the count go 2 → 1 → 2 → 1) | CORE for components inside a span (rule 16, AC-33). The page grid itself follows the viewport |

### A3 — Outer margin and content width
| Value | How | Who | Verdict |
|---|---|---|---|
| Margins are tracks, with named lines | `[full-start] minmax(var(--gut),1fr) [content-start] min(80rem,100% - 2*var(--gut)) [content-end] minmax(var(--gut),1fr) [full-end]` | Mulligan, Comeau, Nexter; Enlitia #25 (`minmax(60px,auto) minmax(200px,1240px) …`) | **CORE**: this is what makes bleed a placement |
| A max width plus a fluid margin floor | `--gut: clamp(1rem, .5rem + 2.5vw, 5rem)` | Punchline (5% capped by 1280), Aqua Dev (5vw cap 72), Street Art (4%), Bootstrap / Webflow containers | CORE (a site token, AC-9). Content max ≈ 80rem: Punchline / Digivalet 1280 · Enlitia 1240 · Thirdweb 1194 · designs 1360–1440 |
| A fixed px margin per rung | `padding-inline: 16px` → `24px` | MDC, M2 | AVOID (px — rule 16) |
| A section as an inset rounded card (a third margin layer) | band `margin-inline: var(--s)` + `radiusCSS` | D#7, D#9, D#18, D#4 hero, D#20 | CORE. Probably HAVE (band outer spacing + radius); **to confirm** |
| Margin equal to gap, in vw | `padding-inline: 1.18vw; gap: 1.18vw` | ECC #15 | AVOID (no rem term) |
| % padding with no max width | `padding-inline: 2%` | Juliet #33 | AVOID: lines run past ~75 characters at 1920 (Rule #1) |
| Several margin systems on one page | — | Thirdweb (24 · 40 · 8vw = three left edges) | AVOID: this is the misalignment the page grid exists to end |
| Safe-area aware | `max(var(--gut), env(safe-area-inset-left))` | GOV.UK | CORE (one line; a landscape phone has a notch) |
| A section opts out of the max width | `grid-column: full` | Wix, every site with full-bleed bands | CORE (per block, A10) |

### A4 — Gutter
| Value | How | Who | Verdict |
|---|---|---|---|
| Fluid, with rem in the ideal term | `--gap: clamp(1rem, .75rem + 1vw, 1.5rem)` | rule 16; MDC 16 → 24, GOV.UK 15 → 30 | CORE |
| Across ≠ down | `column-gap` / `row-gap` | all builders | CORE (have) |
| Two families: page gutter vs component gap | `--gap` vs `--gap-card` | Punchline 96 vs 20; Digivalet 96 / 120 / 64 | CORE (the page grid's gutter is a different token from a card grid's gap) |
| vw only | `gap: 5vw` | Normform #29 | AVOID (ignores the reader's text size) |
| Steps per breakpoint | Webflow variables 96 / 80, 20 / 18 | Punchline #12, MDC | the per-rung override does it; AVOID px |
| Grows when the row stacks on the phone | a per-rung `row-gap` override | Punchline services 20 → 56 | LATER (per-rung gap: **to confirm** it is reachable in the UI) |
| Zero gutter with rules or borders | `gap:0` + borders | Enlitia #25, Igor #30, Normform mosaic, Street Art hairlines | LATER → A20 |
| The gutter as its own track (internal) | `repeat(11,[c] minmax(0,1fr) [m] minmax(0,1fr) [ce] var(--gap)) …` | proposal in 01 A7 | CORE (engine only): keeps `m n` on the true centre of a column |

### A5 — Track width
| Value | How | Who | Verdict |
|---|---|---|---|
| Equal shares that never blow open | `minmax(0,1fr)` | Tailwind, MDC, builder | CORE (have) |
| Bare `1fr` (`minmax(auto,1fr)`) | `repeat(4,1fr)` | Punchline at 1024 (206 / 228 / 222 / 206) | AVOID: content widens one column; the content minimum does this job on purpose |
| Ratio splits (7:5, 4:7 of 11, 2fr 3fr, 38/62, 1.25fr 1fr) | stored as spans on 12 (or 24 halves) | Punchline ×3, Digivalet, Street Art hero; crawl "≈half" splits 13% | CORE as the nearest whole span. 05: these are content-sized rows, so whole columns are enough |
| A fixed or bounded side track beside a fluid one | `minmax(0,1fr) 18.75rem` / `minmax(12rem,20rem)` | Street Art 972 / 300, Codrops `1fr 360px`, Nexter | LATER (AC-30), inside a section's own grid, never in the page grid |
| Measured symmetric tracks | `7.5rem 1fr 15rem 1.04fr …` | Bruno D#13 | AVOID as a person-facing choice (comes within a column on 12) |
| Fixed column width, centred | `72px` columns | MDC option | AVOID (px) |
| Content-sized track | `max-content` / `fit-content(20rem)` | Wix, Bootstrap `col-auto` | LATER, only in components (a label column). The page grid gets content-awareness through the span (A8), not the track |

### A6 — How the grid sits in its frame
| Value | How | Who | Verdict |
|---|---|---|---|
| Stretched inside a centred content box | A3 side tracks | every fluid system | CORE |
| Start / centre / end with fixed tracks | `justify-content: center` | Figma, MDC | LATER (only with AC-30 fixed tracks) |

### A7 — Placement unit
| Value | How | Who | Verdict |
|---|---|---|---|
| Auto-flow into the next cell | default flow | all | CORE (have) |
| Whole-column start + span | `grid-column: c 3 / ce 6` | Bootstrap, Tailwind; Weareheavy `7 / span 6`; Lallé | CORE (have per rung: `colStart` / `colSpan`) |
| Offset start (col 2, col 7, the midline) | `grid-column: c 7 / ce 12` | D#2, D#9, D#20, D#21, D#4; Erwin Hines #14; Thirdweb text frame | CORE |
| An empty column used as space | an explicit start leaves the column empty | D#2, D#5 (TOC 4 + gap + body 7), D#20; Erwin Hines | CORE (falls out of explicit starts; it must survive edits — A17) |
| A narrow item inside a wider slot | `justify-self: start; max-inline-size: 80%` | Thirdweb image 3.2 inside a 4/12 slot; Klimov "starts snapped, ends free" | CORE (have: *Place in the cell*) |
| Half-column | `grid-column: m 3 / ce 6` on a 24-line template | Saint Louvent #34 (4.5 → 7.5); structurally Hervé 7 → 14, ECC m1 (24 = eighths + thirds); crawl: halves add 66.1 → 66.3% | in the model per AC-37; in the UI → **Q3** |
| Named areas | `grid-template-areas` | Dobrynow gallery; Webflow | AVOID in the editor (the canvas IS the picture; the export writes lines). LATER as the LLM composer's notation |
| Free offset / docking / absolute | `position:absolute; inset…` | Wix docking, Framer; Petite Reine #18 | AVOID for flowing content (no reflow, WCAG 1.4.10). Floats already exist |

### A8 — Span rules
| Value | How | Who | Verdict |
|---|---|---|---|
| Explicit span | `grid-column: span 4` | all | CORE (have) |
| Full width | `grid-column: content` / `1 / -1` | Tailwind, Framer; in-stream ad rows (Street Art) | CORE |
| Inset span (centred 8 or 10 of 12) | `grid-column: c 3 / ce 10` | D#5 headline 8/12, D#20 video 10/12, Eddie `2 / -2`, Webflow `3 / -3` | CORE |
| **Content minimum → min span** | `minSpan = ceil((wordRem·em + g)/(w + g))` at the rung's narrowest width | no builder; the user's rule; L-4 c-8 already narrows grids | **CORE** (decided) |
| Wrap when the sum is more than the count | the next item starts a new line | Bootstrap, Figma | CORE (never squeeze) |
| Counts twelve does not divide (5, 7, 16 across) | its own `repeat(5,minmax(0,1fr))` inside the span, or a wrapping flex line | Plantify D#21 ×2, Street Art artists 5, ECC showrooms 7, Mobilin D#18 16 logos; crawl 5-across 0.8%, 8-across 0.3% | CORE (decided; Logos = a flex line, AC-37c) |
| Orphans keep their span | the last row's items keep span 4 | MySales D#12 (lanes and cards leave the slot empty) | CORE default. **Gap G6:** the builder's behaviour is unchecked |
| A lone child takes the full span | `:only-child { grid-column: 1/-1 }` | Eddie #27 | LATER (an option) |
| Spans set by position (a magazine rhythm) | `:nth-child(11n+k) { grid-column: span 4 }` | Weareheavy #20 | LATER (a News / Gallery component preset) |
| Merge cells | — | Wix, Webflow | AVOID as its own operation (a span is a merge) |

### A9 — Rows
| Value | How | Who | Verdict |
|---|---|---|---|
| Rows sized by content (per section) | `grid-auto-rows: auto` | all | CORE (have) |
| Row spans in a bento | `grid-row: span 2` | Bruno D#13, Plantify D#21, Punchline | CORE (have `rowSpan`) |
| Mixed aspects, tops aligned, ragged bottoms | `align-items: start` | Lallé #24, Ceram #35 | CORE (have) |
| Equal-height cards whose media flexes so titles line up | `grid-row: span 3; grid-template-rows: subgrid` | Punchline ×2 | LATER (AC-36) |
| Balanced masonry | the builder's masonry (`aa6d32f`) | Thirdweb #4 | HAVE. Phone order → **gap G8** |
| Rows with a set proportion | `grid-auto-rows: …` with `aspect-ratio` | Nexter gallery | LATER (AC-34) |
| Page-level rows | rows on the page grid | — | AVOID: rows belong to each section; a straddle is solved by A10, not by page rows |
| Baseline grid | — | M2, D#11 | AVOID |

### A10 — Bleed and crossing edges
| Value | How | Who | Verdict |
|---|---|---|---|
| Full-bleed band | band background past `full`; content in `content` | ≥10 live designs (Thirdweb, Punchline, Digivalet, Emotive, AC Visa, Videinfra, Eddie, ECC, CarusiHR) + D#18 / #20 / #21 | CORE (have per band) |
| One block full-bleed inside a contained section | `grid-column: full` | Videinfra hero, Eddie video band, D#18 photo band | CORE |
| Half-bleed: one side to the window, the inner edge on a column line | `grid-column: full-start / ce 6` | AC Visa, ECC m1, Saint Louvent, Punchline hero (to the section's bottom edge), D#4, D#16 (band), D#21 | **CORE** (AC-35) |
| Straddling a section edge | `margin-block-start: calc(-1*var(--lap)); position:relative; z-index:1`, reset per rung | D#9, D#16, D#18, D#21 ×2; Eddie, Emotive, Enlitia | **CORE** (AC-37 / AC-10 / ST-5) |
| Inset rounded hero (within the content width) | `grid-column: content` + radius | D#4, D#7, D#9, D#18, D#20 | CORE (have) |
| Popout: a little wider than the text | `[popout-start] minmax(0,2rem)` lines | Mulligan; Untitled UI footer card D#5 | LATER (two extra named lines, collapsing to 0 on a phone) |
| Bleeding out of a card | the child `margin-inline-end: calc(-1*…)`, card `overflow: visible` | Mobilin D#18 phones, Plantify D#21 photo breaking the top edge | LATER (with AC-31) |
| Type bleed (a wordmark edge to edge) | `font-size: 18cqi` on a full-span block | AspiroFit D#15, Well-ness D#20, Videinfra wordmark | LATER (typography: fit-to-width type) |
| A frame inside a bleed (blurred copy behind) | backdrop layer | D#4 | LATER (surfaces, R-2) |
| Sideways strips | → A23 | | |

**What breaks bleed** (01): `overflow: hidden` on an ancestor; a `max-width` wrapper off the page grid; an overlap bigger than the phone's gap.

### A11 — Nesting
| Value | How | Who | Verdict |
|---|---|---|---|
| Each section re-declares the same template from one class / variables | `.band { display:grid; grid-template-columns: var(--page-cols) }` | AC Visa #21, Eddie #27, Lallé #24, Simonini #6, Thirdweb-less sites | **CORE** → **Q4** |
| Subgrid (columns) | `grid-column: c 2 / ce 9; display:grid; grid-template-columns: subgrid` | MDN (Baseline since 2023). **Not used by any site in 02** | LATER → Q4 (only where a nested container must sit on page lines) |
| A nested split on the same lines | thumb 1 + text 3 inside a span of 4 | D#1, Erwin Hines (halves into 6-column zones), Punchline (2 columns in the 7) | CORE as a requirement; by subgrid, or by writing the child spans in page units (Q4) |
| An independent grid in a cell | `display:grid` inside a cell | Webflow, Figma; Street Art story cards | CORE (have) |
| Flex inside a cell | `display:flex` | Webflow Quick Stack, Wix | CORE (have) |

### A12 — Layout guides in the editor
| Value | How | Who | Verdict |
|---|---|---|---|
| Shown while placing / dragging / selected, plus a shortcut toggle | an overlay drawn from the same template | Wix "on drag only", Webflow edit mode, Figma Shift+G | **AVOID — superseded by the user 2026-10-03**: the grid is invisible in the editor |
| Hidden; one "Show layout guides" switch, OFF by default | the same overlay, only when switched on | Figma (guides off until Shift+G) | **CORE (the user's decision, 2026-10-03)** |
| An advanced page-grid panel: column count, row step, gutter, margin — editable | `--cols`, `--row`, `--gap`, `--gut` tokens; placements stored as shares so a count change never moves a block | Webflow (grid panel), Figma (layout-grid settings), Framer (per-breakpoint guides) | **CORE (the user's decision, 2026-10-03)**; open: per site or per page, ranges |
| Per rung | the overlay re-drawn at the rung being edited | Framer | CORE |
| Snap lines at whole columns (halves when Q3 allows) | — | Wix (green snap lines), Figma constraints | CORE |
| A span label for every rung at once ("6 of 12 · 3 of 6 · …") | derived spans | nobody (only we can derive them) | CORE |
| The margin shaded; bleed zones as drop targets | the `full` tracks drawn | nobody | CORE |
| Token colour that passes 3:1 in every theme | line from a token; tint only as fill | Figma's 10% red fails | CORE |
| Horizontal guides (section edges, baselines) | — | D#5, D#11 | LATER |

### A13 — "N across" mapped onto the grid
| Value | How | Who | Verdict |
|---|---|---|---|
| One-click split patterns | 6+6 · 4+4+4 · 3+3+3+3 · 4+8 / 8+4 · 5+7 / 7+5 · 3+9 / 9+3 | 05 (≈57% of all rows), 03, Webflow Quick Stack | **CORE** |
| Choose by purpose | Menu → `nav > ul` flex line · Cards → grid · Logos → wrapping flex line · Photo beside words → page columns | AC-37c; 05: thin 1+11 / 0.5+11.5 splits (9%) are component insides | CORE (decided) |
| Derive narrower rungs by ratio, then the content minimum, then wrap | `span × cols(rung) / 12` → `max(asked, minSpan)` | 01 A13 | CORE |
| A per-rung count of equal children | `row-cols-md-2` | Bootstrap | CORE (per-rung override) |
| "As many as fit" | auto-fit | Webflow, Framer, Nexter | CORE for components (AC-33) |

### A14 — What changes per rung
| Value | How | Who | Verdict |
|---|---|---|---|
| Structure global, placement / span / order / visibility per rung | `ResponsiveOverride` | Webflow, Wix, Framer | CORE (have) |
| A one-way "advanced" mode | — | Wix advanced grid | AVOID (a person must always be able to leave a mode) |
| "Set here / inherited" shown per rung in the inspector | colour + label | Webflow pink / orange | CORE |

### A15 — Reading order and accessibility
| Value | How | Who | Verdict |
|---|---|---|---|
| Source order = reading and Tab order | no `dense`, no reordering by default | WCAG 1.3.2 / 2.4.3 | CORE |
| Order swapped on the phone (media first / heading first) | `order` per rung | Thirdweb hero, Street Art hero + cards, D#7, D#13; Punchline sticky section heading first | CORE as an explicit per-rung choice, flagged by the audit → **Q5** |
| Zig-zag mirrored on desktop, resetting to text first on the phone | the mirror made by PLACEMENT, not by source order | Thirdweb values / vision, D#9 img2 / 3 | CORE (falls out of placement) |
| `reading-flow` | `reading-flow: grid-rows` | Chrome 137 only | LATER (progressive) |
| RTL | logical lines (`c 3 / ce 6` mirrors itself) | MDN | CORE |
| Reflow at 320 px and text at 150 / 200% | rem gutters + em content minimum → spans grow, rows wrap | WCAG 1.4.4 / 1.4.10; failures: Tim Brack, Petite Reine, Aqua Dev, CarusiHR | CORE |

### A16 — Vertical stagger and offset (NEW)
| Value | How | Who | Verdict |
|---|---|---|---|
| A whole column starts lower | `.col:nth-child(even) { margin-block-start: var(--stagger) }` | Digivalet `.lower-part`, Saint Louvent m1 | LATER |
| The partner in a row sits lower (zig-zag) | `margin-block-start` on the second cell | Klimov 100–200 px | LATER |
| Staircase starts per line of a heading | each line `padding-inline-start: calc(n * var(--col))` | D#4, D#15, PP Fragment #26, Aqua Dev, Thirdweb stepped headline | LATER (typography); kept as an indent on the phone (D#4, #26) |
| Brick-offset rows | row 2 shifted by half a pitch | Thirdweb hashtags | AVOID (decoration) |

Rule for all of A16: offsets in rem from the one emitter, and on the phone they collapse to 0 or to an indent.

### A17 — Empty cells (NEW)
| Value | How | Who | Verdict |
|---|---|---|---|
| A deliberate empty cell or column | explicit `colStart` / `rowStart` on the neighbours too | Simonini posters, Erwin Hines cols 5–6, Lallé corridor 5–8, MySales lanes, Ceram | **CORE**: the hole must survive edits through the UI (07's trap) |
| A diagonal moving hole | per-card explicit columns | Ceram #35 | LATER (a gallery preset) |
| A corridor holding a fixed overlay | `position:fixed` layer on the page grid | Lallé | AVOID |
| Holes close on the phone (stack in order) | the stack ignores placed columns | — | CORE |

### A18 — Layers inside the grid (NEW; AC-31)
| Value | How | Who | Verdict |
|---|---|---|---|
| Two blocks in one area (image over type, title over image) | same `grid-area`, `z-index` | Aqua Dev (hides glyphs), D#13, D#15, D#16, Klimov m1 | LATER (AC-31) + the audit warns when it covers words |
| A watermark word behind the cells | `grid-column: content; grid-row: 1/-1; z-index:-1` | Ceram, D#20 | LATER |
| A collage with overlaps | Nexter's 6 × 6 inner grid | D#16 (kept smaller on the phone), D#13, Nexter | LATER (AC-21 / AC-31) |

### A19 — Position behaviour per cell (NEW)
| Value | How | Who | Verdict |
|---|---|---|---|
| A sticky cell (label left, content scrolls right) | `position: sticky; top: var(--eu-pin-above); align-self: start` | Videinfra #22, Street Art 300 px ad, Punchline sticky cards | **CORE**: "label left, content right" is very teachable; off on the phone. **Gap G4** |
| Sticky stacked cards with an active state | sticky + scroll-driven state | Punchline | LATER (motion area) |
| A panel that scrolls on its own | `overflow-y:auto; height:100dvh` | Bright #31 | AVOID: two scroll regions trap keyboard and touch; fails RULE AF phones |
| Fixed edge chrome outside the grid | `position:fixed` tab / rail | ECC tab, Aqua Dev, Hervé docked nav | AVOID in v1 (overprints content — Aqua Dev); Navigation component later |

### A20 — Decoration on the published page (NEW; A12 is the editor only)
| Value | How | Who | Verdict |
|---|---|---|---|
| Visible column rules / dashed guides | a background `repeating-linear-gradient` on the band, aligned to the tracks; or `column-rule` on a grid (CSS Gap Decorations) | Thirdweb overlay m1, Klimov m1, ECC m1, Erwin Hines divider, D#15, D#16 | LATER — **gap G2** |
| Horizontal row lines | the same, on rows | CarusiHR #23 | LATER |
| Cell borders / rules instead of a gap | `gap:0` + cell borders, or `row-rule` | Igor #30, Enlitia #25, Street Art hairlines, D#14 | LATER — G2 |
| A partial rule beside a section label | a Divider block with a span | Aqua Dev, ECC em-dash | LATER (a Divider variation) |

### A21 — Content in the outer margin (NEW)
| Value | How | Who | Verdict |
|---|---|---|---|
| A hanging index or number | `grid-column: full-start / content-start; justify-self: end` | Codrops "03", Norway D#4 "01"; Juliet puts it ON the edge with the title indented past it | LATER — **gap G3** (the margin track is only `--gut` wide on a phone) |
| An outdented heading (a little left of the text line) | `grid-column: m 0…`, i.e. half a column left of `content-start` | Thirdweb (46 px) | LATER (needs a half-line in the margin) |
| A rotated side label / edge tab | `writing-mode: vertical-rl` in the margin | Tim Brack, ECC | AVOID (fails on phones) |

### A22 — Phone strategy (NEW: what happens to a row below 600)
| Value | How | Who | Verdict |
|---|---|---|---|
| Stack to one column, in source order | every span = full | ≈22 of 26 live designs; every phone drawn in 03 (8 records); crawl phones: 2-across rows stack 48%, 4-across 38% | CORE as the LAST step of the fit-based re-split (below) — no longer the blanket default |
| Keep a reduced grid for a component (2–3 across) | span 3 of 6 / 2 of 6 at the phone rung | Simonini 3, AC Visa stats 3, Lallé 2 regions, PP Fragment 2, Bright table 3, Street Art fresh-rail 2, D#7 2 × 3, D#10 3 stats | CORE — falls out of the fit-based re-split |
| **Fit-based re-split (the user's decision 2026-10-04, from 06-rungs.md)** | the row becomes the most EQUAL columns whose words still fit: 4 → 2 → 1 | 300 crawled pages at 375: rows of 4 / 5+ go to FEWER across 47% / 61% (stack 38% / 21%) | **CORE default on every rung** (supersedes "stack, except by purpose") |
| Keep the tracks, force full span | `> * { grid-column: 1/-1 }` | Normform | AVOID as a mode: the same result as a stack |
| Hide a cell / a grid / the hero picture / a sidebar | `display:none` per rung | Thirdweb (×4), PP Fragment, Emotive, Enlitia, Klimov, Juliet, Bright, D#5 TOC (≈8) | CORE (have). **Gap G7:** a hidden picture must not download (RULE AF) |
| A sidebar that drops under the main column, capped | stack + `max-inline-size: 44rem` | Street Art (700 px) | CORE |
| A sideways strip or carousel | → A23 | Eddie hero cards, D#7, Digivalet strip, Street Art artists | LATER |
| A collage kept, only smaller | scale the composition | D#16 | LATER (AC-31) |
| An offset kept as an indent | `padding-inline-start` at the phone rung | D#4, PP Fragment | LATER (A16) |
| Media above the text | `order` per rung | Thirdweb, Street Art, D#7, D#13 | CORE → Q5 |
| Column-major stacking (masonry) | column wrappers | Thirdweb #4 | LATER — gap G8 |
| Centred becomes left-aligned / a row becomes a centred stack | per-rung text-align | D#5, Punchline footer, Juliet footer | CORE (per-rung override; **to confirm** text-align is per rung) |
| Breaks on the phone: overflow, cramming, clipped type | — | Tim Brack, Petite Reine, Aqua Dev, CarusiHR | AVOID, prevented by the content minimum + the page audit |

### A23 — Sideways strips (NEW)
| Value | How | Who | Verdict |
|---|---|---|---|
| A scroll-snap strip that keeps its tracks | `grid-auto-flow: column; grid-auto-columns: min(80%, 24rem); overflow-x:auto; scroll-snap-type: x mandatory` | Digivalet 5 × 380, Eddie phone, Street Art artists phone | LATER (the pager is already measured: `reference_scroll_snap_pager`) |
| An auto marquee, clipped | `@keyframes` translate | Punchline logos, ECC, Juliet pills (clip at every width) | AVOID as a default (content hidden, motion); LATER in the motion area with pause + reduced-motion |
| A scroll-linked drift | `animation-timeline: scroll()` | Thirdweb team strip | LATER (motion) |

### A24 — Layout driven by interaction (NEW, not the page grid)
Values seen:
- a parallax collage (Thirdweb);
- media revealed on hover that becomes inline on touch (Emotive);
- a split that animates on click (Bright);
- a background swap on scroll (Juliet);
- a sticky title over a collapsing image (Juliet).

Verdict: **out of scope for AC-37b**. They belong to the motion area (RULE MAP: states and transitions). The one thing the grid must guarantee is that each still lays out correctly with motion off.

---

## 2. Frequency — the 80/20

**Desktop splits (05, 23,728 rows, 1440 px only):**
- 66.1% of rows land on whole 12ths. Halves (24 tracks) give 66.3%; 6 columns 42.8%; 8 columns 38.3%; 4 columns 36.0%.
- 32 splits cover 80% of rows.

| Split | Crawl share | Designs (03, of ~50 sections) | Live sites (02, my tally from the notes) |
|---|---|---|---|
| 6 + 6 | **20.7%** | 9 | ≈8: Videinfra (every band), Punchline bento, Thirdweb halves, Erwin Hines, ECC, Emotive, Aqua Dev detail, Street Art story 49/51 |
| 4 + 4 + 4 | **9.8%** | 8 | ≈5: Dobrynow, Thirdweb grow, Street Art browse, Normform, Thirdweb menu (image) |
| 5 + 7 / 7 + 5 | 6.7% | (asymmetric 6) | Punchline hero 7:5 |
| 4 + 8 / 8 + 4 | 6.6% | 7 | D#1, D#12, D#18, D#21 |
| 3 + 3 + 3 + 3 | 4.5% | **12** | ≈6: Street Art fresh-rail / picks, ECC ×2, Punchline services, Digivalet hotels, Ceram |
| 3 + 9 / 9 + 3 | 4.4% | — | Street Art stage (972 / 300), ECC photo 9 / text 3, Normform 2 + 10 |
| "≈ half" (5.5 + 6.5, 4.5 + 7.5, 3.5 + 8.5) | 13% | — | content-sized rows (05 point 3) |
| Thin sides (1 + 11, 0.5 + 11.5, 2 + 10) | 9% | — | component insides (icon + words) |
| 5 / 6 / 8 across | 0.8 / 0.6 / 0.3% | 2 | Plantify, Street Art artists, Mobilin 16 |

**What covers most real use:**
- **The six core splits** (6+6, 4+4+4, 3+3+3+3, 4+8, 5+7, 3+9 and their mirrors) ≈ **57%** of rows. With the content-sized ≈half rows rounded to whole columns, ≈ 70%. These six are the one-click choices.
- **Sections:** 8,032 inset (a container) and 6,399 full-width (05). Both are common, so the page grid serves both from one template (`content` vs `full`).
- **Phone:** stacking to 1 column in source order is the default in ≈85% of live designs and in every drawn phone. Keeping 2–3 across happens for a COMPONENT (stats, a photo wall, a table, logos) in ≈7 of 26 live designs and 2 designs. Hiding happens in ≈8. Media moving above the text happens in ≈4 sites and 2 designs.
- **Bleed:**
  - full-bleed bands: ≥10 sites + 3 designs, the most common;
  - an inset rounded hero: 5 designs;
  - a straddle across a section edge: 5 designs + 3 sites;
  - half-bleed: ≈4 sites + 3 designs;
  - popout, type bleed and a frame inside a bleed: ≤2 each.
- **Offset starts and empty columns:**
  - offset start: 5 designs + 4 sites;
  - an empty column used as space: 3 designs + Erwin Hines;
  - a stagger: ≈4 sites + 2 designs.
- **Rare:**
  - true half-column placement: 1 site (Saint Louvent);
  - subgrid and named lines: 0 sites;
  - an independently scrolling panel: 1 site.

---

## 3. Open questions for the user

### Q1 — How many columns at each rung?

Three options:
- **4 / 8 / 12**: Material's ladder, the current proposal.
- **12 everywhere**, with the spans changing.
- **6 / 12 / 12 / 12 / 12**: phone 6, tablet portrait upward 12.

**Evidence for 4 / 8 / 12:**
- It is Material's ladder (01), and its widths land within 60 px of ours.
- Columns stay 46–73 px wide at every rung, so the guides are readable.

**Evidence against 4 / 8 / 12:**
- **No live site in 02 and no design in 03 uses 4 on a phone or 8 on a tablet.** The phone counts seen are 1 (most), 2, 3, 6, 7 and 12. The tablet counts seen are 4, 12, 14, 16 and 22.
- Designers draw 1 column on phones and keep the 12 or the split on tablets: D#12 keeps 12 in both orientations; D#13 and D#16 keep the two-column hero.
- Street Art keeps 4 and 3 across at 768.
- On 8, only 3 of the 6 core splits stay exact: 6+6, 3+3+3+3 and 3+9 (= 29.6 of the 57.1%, about half). 4+4+4 (9.8%), 4+8 and 5+7 do not.
- On 4, a phone cannot keep 3 across (stats, photo walls — Simonini, AC Visa, D#10).
- Caveat: **05 measures desktop only.** It shows that 12 is right at 1440. It cannot show what is right at 600 or 360. Those answers come from 02 and 03 only.

**Evidence for 6 / 12:**
- At tablet portrait, 12 keeps all six core splits exact.
- On the phone, 6 gives exactly the counts phones keep, 1 / 2 / 3 across. It is also how the doubling sites work (Lallé 6 → 16, Simonini 6, Hervé 7 → 14).
- The 4 / 8 / 12 ladder's own cost table (01 A13 †) disappears. The only inexact case left is 4 across on a 360 px phone, which nobody wants (columns ≈ 41 px).

**Cost of 6 / 12:**
- The tablet-portrait columns are narrow: ≈ 31 px at 600, half-steps ≈ 15 px. The guides are busier there.
- The content minimum will widen spans more often at 600. That is the rule working, not a fault.

**Recommendation:** use **6 on the phone and 12 from 600 up**.
- Halves are stored as 12 / 24 tracks.
- Narrower rungs are derived by ratio (`span × cols / 12`), then the content minimum is applied, then rows wrap.
- 4 / 8 / 12 stays as a guide style if Material alignment ever matters.

### Q2 — May a phone keep 2–3 columns?

**Evidence:**
- **Yes, for components:**
  - live sites: Simonini (3), AC Visa stats (3), Lallé (2 regions), PP Fragment (2), Bright table (3), Street Art fresh-rail (2);
  - designs: D#7 (2 × 3 info), D#10 (3 stats inside a card).
- **No, for page splits:** every drawn phone is 1 column, and ≈85% of sites stack.

**Recommendation:**
- The default is to stack in source order.
- Keeping 2–3 across is **on by purpose** for Stats, Logos, Gallery / photo wall and Table.
- It is **an option for any grid** ("keep N across on phones").
- In every case the content minimum at 360 px can veto it: if the words do not fit, it wraps and says so in the inspector.

### Q3 — Half-steps: keep them as planned, or defer?

**For:**
- They are already decided (AC-37).
- They are cheap once the template has 24 lines (the gutter-as-track template).
- Saint Louvent places a 3-column picture from 4.5; Hervé and ECC build them structurally.

**Against:**
- The crawl shows halves add almost nothing: **66.1 → 66.3%** of rows fit.
- The 13% "≈ half" rows are content-sized, not deliberate.
- Only 1 of 26 live designs places a block on a half-line.

**Recommendation:**
- **Keep halves in the model** (the stored placement and the 24-line template), as decided.
- In the UI, **snap to whole columns by default**. Half-lines appear only on a modifier (hold Alt while dragging) or through the Position panel.
- Do not build quarters.
- Spend the effort instead on offset starts, empty columns, half-bleed and the straddle, which real pages use far more.

### Q4 — One page grid via subgrid, or the same template re-declared by every section?

**Evidence:**
- **No real site in 02 uses subgrid or named lines.**
- The page-wide grids that exist (AC Visa, Eddie, Lallé, Simonini) **re-declare one class / one set of variables in every section**. That gives the same alignment as long as each section spans the full width with the same margins.
- Subgrid is still needed for a container nested inside a span that must keep page lines: D#1's thumb 1 + text 3 inside a 4, Erwin Hines' 6-column halves, Punchline's 2-in-7.

**Recommendation:**
- **Every band re-declares the page template** (full · content · c / m / ce lines) from the one emitter.
- Bleed and half-bleed are then placements inside each band, and nothing depends on subgrid.
- A nested container that the person places on page lines uses `subgrid`, with its own equal columns as the `@supports` fallback (AC-36).
- Before shipping, check that low-cost Android WebViews are ≥ Chromium 117 (AC-23).

### Q5 — Which comes first on a phone: the picture or the words?

**Evidence both ways:**
- **Picture first:** Thirdweb hero, Street Art hero and cards, D#7, D#13.
- **Words first:** Thirdweb's zig-zag rows (they reset to text first) and Punchline (heading first).

**Recommendation:**
- **Source order** is the default (WCAG 1.3.2).
- Desktop mirrors (zig-zags) are made by placement, never by reordering the source, so the phone reads consistently.
- Each split gets one switch, "On phones: picture first". It is written as `order` at the phone rung, and the page audit notes it.

### Smaller choices: defaults, unless you object
- Content max width **80rem** (1280).
- Page gutter `clamp(1rem, .75rem + 1vw, 1.5rem)` and margin floor `clamp(1rem, .5rem + 2.5vw, 5rem)`.
- Orphans keep their span (the last row is not stretched).
- A sticky cell is off on the phone.

---

## 4. Gaps

These are values the evidence shows that neither the stored research (01 / 07 / 08) nor the builder covers. Each says where research goes back.

| # | Gap | Where research goes back |
|---|---|---|
| G1 | **Vertical stagger / offsets** (A16). 08 has only the nudge (AC-10) | Read Digivalet's `.lower-part` and Klimov's CSS from the stored raw HTML. Compare `margin-block-start` vs `translate` vs a fine row grid for flow and reflow. Decide the phone behaviour (0 or an indent) |
| G2 | **Grid lines / rules on the published page** (A20); 01 A12 is the editor only | MDN + spec for **CSS Gap Decorations** (`column-rule` / `row-rule` on grid) and its 2026 support. The track-aligned `repeating-linear-gradient` method. `gap:0` + cell borders. Contrast in every theme |
| G3 | **Content in the outer margin** (A21): hanging index, outdented heading | How the `full-start / content-start` track holds it when the margin is 16 px on a 360 phone (Juliet moves it onto the edge and indents the title instead) |
| G4 | **A sticky cell inside a grid** (A19). The builder pins bands (F1-b), not cells | MDN sticky inside grid (`align-self:start`, ancestors' `overflow`). Videinfra's CSS from the raw HTML. How it meets `--eu-pin-above` |
| G5 | **Orientation / height-aware rung** (A2): a landscape phone (≈800 × 360) lands on tablet portrait | M3 height classes (01 has the numbers); `(max-height: 30em)` queries; one real-device check |
| G6 | **Orphans keep their span vs fill the row**, and a lone child at full span (A8) | Check what `lib/box-model.ts` does today, then decide (default: keep the span) |
| G7 | **Hidden on the phone must not download** (RULE AF) | Measure the export: does a `display:none` picture at 360 fetch? `loading=lazy` vs `<picture>` with a `media` source |
| G8 | **Phone order of masonry** (A9 / A22): column-major (Thirdweb) vs source order | Check the `aa6d32f` export on the phone. Decide which order is accessible |
| G9 | **How many real pages align ACROSS sections to one page-wide grid**. 05 measures splits per row, not shared lines between rows. The "my sources" line is still open | Extend `grid-splits.js` over `docs/layout-benchmark/` to test whether rows on one page share left edges |
| G10 | **Per-rung splits in the crawl**: 05 is 1440 only | Re-measure a sample of the crawl at 768 and 375 (the stored HTML can be re-rendered) to answer Q1 / Q2 from data, not from 26 sites |
| G11 | **Fit-to-width type** (type bleed, A10) | The typography area (cqi-sized type, the `text-fit` proposal). Not needed for v1 |

Already open elsewhere, so not new research: AC-30 (fixed tracks), AC-31 (layers), AC-33 (auto-fit), AC-34 (proportional rows), AC-36 (subgrid rows), AC-10 / ST-5 (the straddle).

---

## 5. The "enough" checklist (draft, RULE MAP) — for the user to sign

### Steps 1 and 4: map and saturation

| Axis | Research | Values with a CSS line |
|---|---|---|
| A1 count per rung | covered (decision Q1 open) | 6 / 6 |
| A2 breakpoints | covered; G5 open | 5 / 5 |
| A3 margin / content width | covered | 9 / 9 |
| A4 gutter | covered | 8 / 8 |
| A5 track width | covered | 7 / 7 |
| A6 frame alignment | covered | 2 / 2 |
| A7 placement unit | covered (Q3 open) | 8 / 8 |
| A8 span rules | covered; G6 open | 10 / 10 |
| A9 rows | covered; G8 open | 8 / 8 |
| A10 bleed | covered | 9 / 9 |
| A11 nesting | covered (Q4 open) | 5 / 5 |
| A12 guides | covered | 7 / 7 |
| A13 N across | covered | 5 / 5 |
| A14 per-rung changes | covered | 3 / 3 |
| A15 reading order | covered (Q5 open) | 6 / 6 |
| A16 stagger | **partly** (G1) | 4 / 4 |
| A17 empty cells | covered | 4 / 4 |
| A18 layers | covered via AC-31 | 3 / 3 |
| A19 position per cell | **partly** (G4) | 4 / 4 |
| A20 decoration | **not covered** (G2) | 4 / 4 (untested CSS) |
| A21 outer margin | **partly** (G3) | 3 / 3 |
| A22 phone strategy | covered; G7 and G10 open | 12 / 12 |
| A23 strips | covered (pager measured) | 3 / 3 |
| A24 interaction | out of scope (motion area) | — |

**Saturation, measured honestly from 02 / 03:**
- **New VALUES are not saturated.**
  - Awwwards: every group still added values. Group 0: 7 of 7 records; group 1: 6 of 7 (only #7 Dobrynow added none); groups 2–4: 21 of 21; the v3 re-read: 14 of 14 (≈17 new values).
  - Dribbble, against 01 + 02 together: ≈ 8 of 21 shots added a value not already seen (inset-card sections, measured tracks, orphans keep span, tablet keeps 12, a frame inside a bleed, 16 across, interlocking text, a collage kept smaller). That is a falling rate: ≈100% per item on Awwwards, ≈ 38% on Dribbble.
- **New AXES are nearly saturated.**
  - The last new axis (A19, sticky cells) first appeared at record #22.
  - After it, records #23–#35, the v3 re-read and all 21 Dribbble shots (≈ 34 items) added **no new axis**, only values inside existing ones.
  - A24 (interaction) appeared at #16 and again at #31; it is out of scope.
- **New CORE values are still arriving occasionally**: the inset-card section, orphans keep span and media-first on the phone all came from the later items.
- **Proposed stop rule for this area:** the 21 unread Dribbble shots plus G9 / G10 add no new axis and no new CORE value. The bar is a run of ≥ 30 items. CodePen's 150 suits a technique catalogue, not a layout skeleton.

### Steps 2, 3 and 6: still to do (nothing is built yet)

**Step 2: one example per value.** Each is a small HTML file in `docs/web-anatomy/page-grid/examples/`, proven in a browser:
- 0 of the ≈ 60 CORE / LATER values built.
- First the CORE set:
  - the side-track template with c / m / ce lines and the gutter as a track;
  - the six one-click splits;
  - the content-minimum span;
  - offset start and empty column;
  - full / half-bleed;
  - the straddle;
  - the sticky cell;
  - the phone keep-N;
  - hide;
  - picture first;
  - re-declared template vs subgrid.

**Step 3: combination proof.** Not run. To run, random combinations in six headed windows, Preview at 360 / 600 / 900 / 1200 / 1920 + device presets:
- (a) the six splits × 5 rungs × short / long words × 150% and 200% text × LTR / RTL;
- (b) bleed kind (full / half / straddle / inset card) × section background × neighbour section × phone;
- (c) **nested levels**: page grid → band → card grid (own count 5 / 7) → card → button. The page lines must stay true through subgrid and its fallback, and no parent may clip a straddle or a half-bleed (no `overflow:hidden` in the chain);
- (d) **across families on one block**: half-bleed + straddle + layer order + sticky + a surface (R-2 gradient / photo / shadow). An edge must not cut its own shadow; a straddle must stay above the next band;
- (e) the phone strategy × purpose (Stats / Logos / Gallery / Cards / Menu);
- (f) states: hover / focus inside a straddled card. Focus must stay visible over the neighbour section.

**Step 6: through the UI.** Not started. Every CORE value reachable in the builder (RULE UI / Y), the combination generator re-run by dragging, and canvas == export.

### Step 5: taste, real-world and people evidence

| Kind | Have | Missing |
|---|---|---|
| Taste | 35 Awwwards records + 21 Dribbble designs; the Material / Bootstrap / GOV.UK systems | the 21 unread Dribbble shots; **school sites** (none of the 56 items is a school website: D#10 / D#11 are apps); regional (Nigeria / Ghana) sites, RULE AF |
| Real-world | four phone failure cases (Tim Brack, Petite Reine, Aqua Dev, CarusiHR) as anti-patterns | a low-cost Android (Tecno / Infinix at 360 × 640) rendering the template; WebView version vs subgrid (AC-23); 150 / 200% text with content-decided spans; RTL (Arabic) placement + half-bleed; a screen-reader pass over offset / straddled layouts; G7's download check |
| People | — | the pilot schools: can a teacher read "layout guides", "6 of 12" and "picture first on phones"? Does the half-line modifier confuse? |
| Data | 05: 4,250 pages, desktop splits | per-rung splits (G10); cross-section alignment (G9) |

**Sign-off needed from the user:** Q1–Q5, the stop rule above, and whether G1 / G2 / G3 (stagger, published rules, margin content) are researched now or stay LATER.
