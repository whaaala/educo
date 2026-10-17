---
title: The layout matrix — every capability × the six builders × the crawl × ours (BATCH RX-3)
---

# The layout matrix (BATCH RX-3, 2026-10-16)

One row per capability, merged from [00-capabilities.md](00-capabilities.md) (PS-1 … ED-6), the new rows of
[01-inventory.md](01-inventory.md), [baseline-webflow-wix.md](baseline-webflow-wix.md),
[baseline-framer-carrd.md](baseline-framer-carrd.md), [baseline-squarespace-wordpress.md](baseline-squarespace-wordpress.md),
and [02-ours-code.md](02-ours-code.md). **Verdicts are copied, never re-judged.** Each source numbered its own new rows,
so the same new ID meant different things in different files; new rows were deduplicated by MEANING and renumbered per
axis after the shared list's last number (source order: inventory → Webflow / Wix → Framer / Carrd → Squarespace /
WordPress). §2 maps every source ID to its final ID.

**Keys.** Builders: **H** HAS · **P** PARTLY · **N** NO · **?** the source that added the row did not cover that builder.
WF Webflow · WX Wix Studio · FR Framer · CA Carrd · SQ Squarespace 7.1 · WP WordPress block editor. **Crawl %** = share
of the 4,250 crawled pages (from 01); "—" = not measurable from the crawl, with the stored source's figure in brackets
where 01 gives one ("live" = of 741 live sites, AGGREGATE). **Tier** = first page-cover tier (80 / 95 / 99) with a page
showing it, as 01 states it; 80* = not stated, but the feature is on 100% of pages. **Basic?** = 01's "can a basic school
/ small-business site be built WITHOUT it" ("—" = 01 has no row). **Ours** = 02's code claim (shared-list rows only; the
claim is not a measurement, see 03-ours-measured.md). **AC** = the frozen-list ids mapped in 01 §3.

## 1. The matrix (132 rows)

| ID | Capability | Crawl % | Tier | WF | WX | FR | CA | SQ | WP | H /6 | Basic? | Ours (code) | AC |
|----|-----------|---------|------|----|----|----|----|----|----|------|--------|-------------|----|
| PS-1 | Header · main · footer regions on every page | nav 82.4% · all three 19.4% | 80 | P | H | P | P | H | H | 3 | no | HAS | — |
| PS-2 | Shared header and footer (edit once) | — (90.4% of sites multi-page; same header on every page 62.3%) | — | H | H | H | H | H | H | 6 | no | GAP | — |
| PS-3 | Sidebar beside the main content | 8.3% | 95 | P | P | P | P | N | P | 0 | yes | HAS | — |
| PS-4 | Several pages, one navigation | — (median 9 pages a site) | — | H | H | H | P | H | H | 5 | no | PARTLY | — |
| PS-5 | Page templates / reusable sections | — | — | H | H | H | P | P | H | 4 | yes | GAP | — |
| PS-6 | Multi-row header (utility bar + main row), one row held | 28.6% | 80 | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| PS-7 | Header over the hero (transparent, solid once scrolled) | 20.5% | 95 | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| PS-8 | Menu collapses on narrow screens (toggle + drawer) | hamburger at 1440: 32.3% | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| PS-9 | Footer sits at the bottom of a short page | — | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| PS-10 | Announcement / alert bar above the header | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| PS-11 | Reusable block with per-copy content, variants, slots | — | — | H | P | ? | ? | ? | ? | 1 | — | — | — |
| PS-12 | In-page sections as "pages" (named views switched by a link) | — | — | ? | ? | N | H | ? | ? | 1 | — | — | — |
| PS-13 | Anchor points to scroll to (named, linkable, next / previous) | — | — | ? | ? | P | H | ? | ? | 1 | — | — | — |
| PS-14 | A page area shown / hidden per page (hide the header on one page) | — | — | ? | ? | ? | ? | H | H | 2 | — | — | — |
| PS-15 | Navigation overlay area (mobile menu as its own editable layout) | — | — | ? | ? | ? | ? | P | H | 1 | — | — | — |
| SB-1 | Stack full-width bands; add / reorder / delete | 100% | 80* | H | H | H | H | H | H | 6 | no | HAS | — |
| SB-2 | Background edge to edge, content in a centred width | contained 55.4% | 80 | H | H | H | P | H | H | 5 | no | HAS | AC-9 |
| SB-3 | Band of set height (auto · screen share · fixed) | — | — | H | H | H | P | H | H | 5 | yes | HAS | AC-3 |
| SB-4 | Content placed in a band vertically | — | — | H | H | H | H | H | H | 6 | yes | HAS | AC-5 |
| SB-5 | Shaped band edge; band overlapping the next | — (live: clip-path 43%, mask 32%) | — | P | H | P | N | P | N | 1 | yes | PARTLY | AC-1 · AC-10 |
| SB-6 | Inset section (narrower than the window, often a rounded card) | 44.9% | 80 | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| SB-7 | One block bleeds out of a contained section (full / half bleed) | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | AC-35 |
| SB-8 | Page frame (border round the whole page) | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | AC-2 |
| SB-9 | The page as a card over a full-screen background | — | — | ? | ? | P | H | ? | ? | 1 | — | — | — |
| SB-10 | Three named widths a block can choose: content · wide · full | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| SB-11 | Fixed (parallax) or repeated background on a band | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| SB-12 | Colour theme per section, shared by every section using it | — | — | ? | ? | ? | ? | H | P | 1 | — | — | — |
| RC-1 | Blocks side by side, any count | 2 across 87.6% | 80 | H | H | H | H | H | H | 6 | no | HAS | — |
| RC-2 | Column widths by share, changed by dragging | unequal row 73.5% | 80 | H | H | H | H | P | H | 5 | no | HAS | — |
| RC-3 | A column of a SET width beside shared ones | thin part ≤ 15%: 45.2% | 80 | H | H | H | P | P | H | 4 | yes | PARTLY | AC-30 |
| RC-4 | Columns stack on a phone, and in what order | — (06-rungs: phone 2-across stacks 48%) | — | H | H | H | H | P | P | 4 | no | HAS | — |
| RC-5 | Gap across and down, set by the user | — | — | H | H | H | H | H | H | 6 | no | HAS | — |
| RC-6 | Nesting at any depth | nested columns 30.8% | 80 | H | H | H | N | P | H | 4 | no | HAS | — |
| RC-7 | Change a container's kind without losing content | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| RC-8 | Columns of equal height (stretch) vs aligned top / middle / bottom | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| GR-1 | Grid of N columns that wraps on smaller screens | display: grid 55.1% | 80 | H | H | H | N | P | H | 4 | no | HAS | AC-37c |
| GR-2 | Auto-fit grid (as many as fit a minimum width) | — (live: container queries 4%) | — | H | P | H | N | N | H | 3 | yes | PARTLY (engine-only) | AC-33 |
| GR-3 | Block spanning several columns / rows | — (proxy: unequal tracks 23.9%) | — | H | H | H | N | H | H | 5 | yes | HAS | — |
| GR-4 | Placing on exact lines of a 12-column page grid | — (66.1% of ROWS on whole twelfths) | — | P | N | P | N | H | P | 1 | yes | HAS | AC-37 · AC-37b |
| GR-5 | Masonry | — | — | N | P | H | N | P | N | 1 | yes | HAS | — |
| GR-6 | Subgrid (parts line up across cards) | — | — | N | N | N | N | N | N | 0 | yes | GAP | AC-36 |
| GR-7 | Dense packing of mixed spans | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | AC-32 |
| GR-8 | Content in the outer margin (hanging number) | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| GR-9 | Rules / hairlines between cells instead of gaps | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| GR-10 | Last-row items stretch to fill instead of leaving a hole | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| FL-1 | Normal flow, top to bottom | 100% | 80* | H | P | H | H | P | H | 4 | no | HAS | — |
| FL-2 | A row that wraps | wrapped row / grid 32.4% | 80 | H | P | H | N | N | H | 3 | no | HAS | — |
| FL-3 | Text wrapping round a picture (float) | — | — | H | N | N | N | N | H | 2 | yes | GAP | AC-8 |
| FL-4 | Text in several columns | — | — | H | N | N | N | N | N | 1 | yes | GAP | AC-19 |
| FL-5 | Layers: one block over another (z-order) | parts > 110%: 29.6% (upper bound) | 80 | H | H | H | P | H | P | 4 | yes | HAS | AC-21 · AC-31 |
| FL-6 | Sideways-scrolling strip / slider row | — (live: scroll-snap 21%; marquee 14.8%, carousel 4.6% of pages) | — | P | H | ? | ? | ? | ? | 1 | yes | — | — |
| SZ-1 | Width: fill · hug · share · fixed | parts fill < 70%: 56.6% | 80 | H | H | H | P | P | H | 4 | no | HAS | — |
| SZ-2 | Height: hug · fill · fixed · screen share | — | — | H | H | H | P | P | P | 3 | no | HAS | AC-3 |
| SZ-3 | Min / max width and height | — | — | H | H | H | N | N | P | 3 | no | PARTLY | — |
| SZ-4 | Box of a chosen proportion (16:9, square) | — (video 19.5%) | — | H | P | H | P | H | H | 4 | no | PARTLY (engine-only) | AC-34 |
| SZ-5 | One site-wide content width | contained 55.4% | 80 | P | H | P | H | H | H | 4 | no | PARTLY (engine-only value) | AC-9 · AC-37b |
| SZ-6 | Fluid sizes (rem / clamp / %) that follow the reader's text size | — | — | H | P | P | P | P | H | 2 | no | HAS (engine) | — |
| SZ-7 | Readable width on a text block (≈ 65–75 characters) | — | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| SZ-8 | Dynamic viewport units (dvh / svh / lvh) | — | — | H | N | ? | ? | ? | ? | 1 | — | — | — |
| SZ-9 | Per-breakpoint "manual" switch leaving untouched fields automatic | — | — | ? | ? | P | H | ? | ? | 1 | — | — | — |
| SP-1 | Padding, all sides and each | — | — | H | H | H | H | P | H | 5 | no | HAS | — |
| SP-2 | Margin, incl. negative | — | — | H | H | P | H | N | H | 4 | no (margin) · yes (negative) | PARTLY | AC-10 |
| SP-3 | Gap inside a row / stack / grid | — | — | H | H | H | H | H | H | 6 | no | HAS | — |
| SP-4 | A spacing scale (tokens) | — | — | H | N | N | N | P | H | 2 | yes | PARTLY | — |
| SP-5 | Spacing seen and dragged on the canvas | — | — | P | H | P | N | P | P | 1 | yes | HAS | — |
| SP-6 | Vertical stagger / offset of a column | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| SP-7 | Lock users to the spacing scale (no free numbers) | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| AL-1 | Align children across and down | — | — | H | H | H | H | H | H | 6 | no | HAS | AC-27 |
| AL-2 | Spread children, incl. wrapped lines | — (hug rows 56.6%) | — | H | P | H | N | P | H | 3 | no | PARTLY | AC-25 · AC-26 |
| AL-3 | One child aligned differently (align-self) | — | — | H | H | P | P | N | P | 2 | yes | HAS | AC-27 |
| AL-4 | Text alignment | — | — | H | H | H | H | H | H | 6 | no | PARTLY | — |
| AL-5 | Baseline alignment | — | — | H | N | N | N | N | N | 1 | yes | GAP | AC-25 |
| AL-6 | Push one block to the far end (auto margin) | — | — | H | N | ? | ? | ? | ? | 1 | yes | — | AC-26 |
| PO-1 | Sticky header / sticky block | sticky / fixed header 21.5% | 80 | H | H | H | N | H | H | 5 | yes | HAS | — |
| PO-2 | Fixed element (back-to-top, chat, cookie bar) | cookie banner 6.8% · back-to-top 3.1% | 95 | H | H | H | N | N | N | 3 | yes | HAS | — |
| PO-3 | Floating / absolute block inside its parent | — (badge 62.6%, not all floating) | — | H | H | H | N | H | N | 4 | yes | HAS | AC-10 |
| PO-4 | Overlap into the next band | parts > 110%: 29.6% (upper bound) | 80 | P | P | H | N | N | P | 1 | yes | PARTLY | AC-10 · AC-37 |
| PO-5 | Free placement anywhere | — | — | N | H | P | N | P | N | 1 | yes | PARTLY | — |
| PO-6 | Pinned scroll section / stacking cards | sticky in a non-first section 17.2% (live: 17%) | 80 | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| PO-7 | Header that hides on scroll down (returns / shrinks) | — | — | ? | ? | ? | ? | H | N | 1 | yes | — | — |
| PO-8 | Overlays on the top layer (menu drawer, modal, cookie banner) | dialog 16.8% · cookie banner 6.8% | 80 | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| PO-9 | Pinned / sticky within its own section or parent (not the viewport) | — | — | N | H | ? | ? | H | N | 2 | — | — | — |
| PD-1 | Breakpoints the user can edit at | ≥ 3 breakpoints 85.1% | — | H | H | H | P | P | P | 3 | no | PARTLY | — |
| PD-2 | Hide / show a block per device | — (hamburger at 1440: 32.3%) | — | H | H | H | P | H | H | 5 | no | HAS | — |
| PD-3 | Change order per device | — | — | P | H | P | P | H | N | 2 | yes | HAS | — |
| PD-4 | Change size / columns / spacing per device | — (06-rungs: tablet keeps 2-across 59%) | — | H | H | H | H | P | P | 4 | no | HAS | AC-21 |
| PD-5 | Cascade to smaller sizes unless overridden | — | — | H | H | H | H | N | H | 5 | no | HAS | — |
| PD-6 | Preview at device sizes | — | — | H | H | H | H | H | H | 6 | no | HAS | — |
| PD-7 | Height / orientation aware (short screen, landscape phone) | — | — | ? | ? | ? | ? | ? | ? | 0 | no (once anything is held) | — | AC-3 |
| PD-8 | Sensible narrower-screen default with no setting (fit-based re-split) | — (06-rungs: rows of 4 / 5+ go to fewer 47–61%) | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| PD-9 | Component adapts to its own box (container queries) | — (live: 4%) | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| PD-10 | Print layout | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| PD-11 | All breakpoints on one canvas while editing | — | — | H | N | ? | ? | ? | ? | 1 | — | — | — |
| PD-12 | A separate hand-arranged phone layout (not a cascade) | — | — | ? | ? | ? | ? | H | N | 1 | — | — | — |
| PD-13 | Hidden without rendering at all vs hidden by CSS | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| MS-1 | Image cover / contain with a focal point | — | — | H | H | H | P | H | H | 5 | no | PARTLY | — |
| MS-2 | Image keeps its shape while loading | — | — | H | P | H | P | P | H | 3 | no | HAS | — |
| MS-3 | Responsive image files (srcset / sizes), lazy | — | — | H | P | H | P | H | H | 4 | no | HAS (srcset engine-only) | AC-22 |
| MS-4 | Video / embed by width and proportion | video 19.5% · map 2.0% | 80 | H | H | H | H | P | P | 4 | no | PARTLY | — |
| MS-5 | Background image / video on a section | — (single-block bands 31.1%) | — | H | H | H | H | H | H | 6 | no | PARTLY | AC-17 |
| MS-6 | Art direction: crop / focal point per device | — | — | P | H | ? | ? | ? | ? | 1 | yes | — | AC-22 |
| SE-1 | Landmarks published | header + main + footer 19.4% | 80 | H | P | P | N | N | H | 2 | no | HAS | — |
| SE-2 | Heading levels in order (one h1) | one h1 74.9% | 80 | H | H | P | P | P | P | 2 | no | HAS | — |
| SE-3 | Menus as nav > ul > li > a | nav 82.4% | 80 | H | P | N | N | N | H | 2 | no | PARTLY | — |
| SE-4 | Reading order follows visual order | — | — | P | P | H | H | N | P | 2 | no | PARTLY | — |
| SE-5 | Repeated landmarks named | 2+ nav 39.3% | 80 | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| SE-6 | Language and direction per page / block; RTL mirrors | no lang 15.8% · RTL 0% | — | ? | ? | ? | ? | ? | ? | 0 | no (lang) · yes (RTL in v1) | — | — |
| SE-7 | A repeated group exported as a list | cards 68.5% | 80 | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| AX-1 | Layout survives 200% text | — | — | H | N | P | P | N | P | 1 | no | HAS (engine) | — |
| AX-2 | Focus visible, skip link, keyboard order | — (live: :focus-visible 36%) | — | P | P | N | N | N | P | 0 | no | HAS | — |
| AX-3 | Reduced motion honoured by layout effects | — (live: reduced-motion query 23%) | — | H | H | N | N | N | N | 2 | no (once any effect exists) | PARTLY | — |
| AX-4 | Nothing overflows sideways at 320–360px | — | — | P | P | P | H | P | P | 1 | no | HAS (engine) | — |
| AX-5 | Focus and anchors never land under held bars | (sticky / fixed header 21.5%) | 80 | ? | ? | ? | ? | ? | ? | 0 | no (once anything is held) | — | — |
| AX-6 | Held bars take at most ~25–30% of the screen | — | — | ? | ? | ? | ? | ? | ? | 0 | yes | — | — |
| AX-7 | Colour-vision preview of the layout | — | — | H | N | ? | ? | ? | ? | 1 | — | — | — |
| SD-1 | Page weight budget, lightweight export | — | — | P | N | P | H | N | N | 1 | no | HAS (engine) | AC-23 |
| SD-2 | Lazy loading, no layout shift | — | — | H | P | H | P | P | H | 3 | no | HAS | — |
| SD-3 | A block hidden on a device costs nothing there | — | — | ? | ? | ? | ? | ? | ? | 0 | no | — | — |
| SD-4 | Works on old WebViews / proxy browsers | — | — | ? | ? | ? | ? | ? | ? | 0 | no | — | AC-23 |
| ED-1 | Drag and drop; undo / redo | — | — | H | H | H | H | H | H | 6 | no | HAS | — |
| ED-2 | Select parent / child; layers tree | — (depth ≥ 3: 26.5%) | — | H | H | H | H | P | H | 5 | no | PARTLY | — |
| ED-3 | Copy / paste / duplicate, incl. style | — | — | H | P | H | H | P | H | 4 | yes | PARTLY | — |
| ED-4 | Layout presets (ready sections, layouts) | — (six splits ≈ 57% of rows) | — | H | H | H | H | H | H | 6 | no (in practice) | PARTLY | AC-37c |
| ED-5 | Guides / rulers / snapping | — | — | P | P | H | N | H | N | 2 | yes | HAS | AC-29 · AC-37a · AC-37b |
| ED-6 | Layout-problems check | — | — | P | P | N | P | N | N | 0 | yes | PARTLY | AC-37a |
| ED-7 | Per-device override shown ("set here / inherited") with reset | — | — | ? | ? | H | N | ? | ? | 1 | yes | — | — |
| ED-8 | Locked page building for non-designers (approved blocks in set slots) | — | — | H | N | ? | ? | ? | ? | 1 | — | — | — |
| ED-9 | Custom CSS / classes on any block | — | — | H | H | ? | ? | ? | ? | 2 | — | — | — |
| ED-10 | Shared appearance styles linked across elements | — | — | ? | ? | H | H | ? | ? | 2 | — | — | — |
| ED-11 | Lock a block / pattern against moving or editing | — | — | ? | ? | ? | ? | N | H | 1 | — | — | — |
| ED-12 | Group selected blocks into a container in one action (and ungroup) | — | — | ? | ? | ? | ? | H | H | 2 | — | — | — |
| ED-13 | Several blocks selected, moved / resized / aligned together | — | — | ? | ? | ? | ? | H | P | 1 | — | — | — |

## 2. ID mapping — source file · source ID → final ID

Shared-list rows (PS-1 … ED-6) keep their IDs in every file and are not repeated here.

| Source file | Source ID | Final ID | Note |
|---|---|---|---|
| 01-inventory.md | AL-6 | AL-6 | merged: baseline-webflow-wix.md AL-6 |
| 01-inventory.md | AX-5 | AX-5 |  |
| 01-inventory.md | AX-6 | AX-6 |  |
| 01-inventory.md | ED-7 | ED-7 | merged: baseline-framer-carrd.md ED-7 |
| 01-inventory.md | FL-6 | FL-6 | merged: baseline-webflow-wix.md FL-6 |
| 01-inventory.md | GR-7 | GR-7 |  |
| 01-inventory.md | GR-8 | GR-8 |  |
| 01-inventory.md | GR-9 | GR-9 |  |
| 01-inventory.md | MS-6 | MS-6 | merged: baseline-webflow-wix.md MS-6 |
| 01-inventory.md | PD-7 | PD-7 |  |
| 01-inventory.md | PD-8 | PD-8 |  |
| 01-inventory.md | PD-9 | PD-9 |  |
| 01-inventory.md | PD-10 | PD-10 |  |
| 01-inventory.md | PO-6 | PO-6 |  |
| 01-inventory.md | PO-7 | PO-7 | merged: baseline-squarespace-wordpress.md PO-7 |
| 01-inventory.md | PO-8 | PO-8 |  |
| 01-inventory.md | PS-6 | PS-6 |  |
| 01-inventory.md | PS-7 | PS-7 |  |
| 01-inventory.md | PS-8 | PS-8 |  |
| 01-inventory.md | PS-9 | PS-9 |  |
| 01-inventory.md | PS-10 | PS-10 |  |
| 01-inventory.md | SB-6 | SB-6 |  |
| 01-inventory.md | SB-7 | SB-7 |  |
| 01-inventory.md | SB-8 | SB-8 |  |
| 01-inventory.md | SD-3 | SD-3 |  |
| 01-inventory.md | SD-4 | SD-4 |  |
| 01-inventory.md | SE-5 | SE-5 |  |
| 01-inventory.md | SE-6 | SE-6 |  |
| 01-inventory.md | SE-7 | SE-7 |  |
| 01-inventory.md | SP-6 | SP-6 |  |
| 01-inventory.md | SZ-7 | SZ-7 |  |
| baseline-webflow-wix.md | AL-6 | AL-6 | merged: 01-inventory.md AL-6 |
| baseline-webflow-wix.md | AX-5 | AX-7 ← |  |
| baseline-webflow-wix.md | ED-7 | ED-8 ← |  |
| baseline-webflow-wix.md | ED-8 | ED-9 ← |  |
| baseline-webflow-wix.md | FL-6 | FL-6 | merged: 01-inventory.md FL-6 |
| baseline-webflow-wix.md | MS-6 | MS-6 | merged: 01-inventory.md MS-6 |
| baseline-webflow-wix.md | PD-7 | PD-11 ← |  |
| baseline-webflow-wix.md | PO-6 | PO-9 ← | merged: baseline-squarespace-wordpress.md PO-6 |
| baseline-webflow-wix.md | PS-6 | PS-11 ← |  |
| baseline-webflow-wix.md | SZ-7 | SZ-8 ← |  |
| baseline-framer-carrd.md | ED-7 | ED-7 | merged: 01-inventory.md ED-7 |
| baseline-framer-carrd.md | ED-8 | ED-10 ← |  |
| baseline-framer-carrd.md | PS-6 | PS-12 ← |  |
| baseline-framer-carrd.md | PS-7 | PS-13 ← |  |
| baseline-framer-carrd.md | SB-6 | SB-9 ← |  |
| baseline-framer-carrd.md | SZ-7 | SZ-9 ← |  |
| baseline-squarespace-wordpress.md | ED-7 | ED-11 ← |  |
| baseline-squarespace-wordpress.md | ED-8 | ED-12 ← |  |
| baseline-squarespace-wordpress.md | ED-9 | ED-13 ← |  |
| baseline-squarespace-wordpress.md | GR-7 | GR-10 ← |  |
| baseline-squarespace-wordpress.md | PD-7 | PD-12 ← |  |
| baseline-squarespace-wordpress.md | PD-8 | PD-13 ← |  |
| baseline-squarespace-wordpress.md | PO-6 | PO-9 ← | merged: baseline-webflow-wix.md PO-6 |
| baseline-squarespace-wordpress.md | PO-7 | PO-7 | merged: 01-inventory.md PO-7 |
| baseline-squarespace-wordpress.md | PS-6 | PS-14 ← |  |
| baseline-squarespace-wordpress.md | PS-7 | PS-15 ← |  |
| baseline-squarespace-wordpress.md | RC-7 | RC-7 |  |
| baseline-squarespace-wordpress.md | RC-8 | RC-8 |  |
| baseline-squarespace-wordpress.md | SB-6 | SB-10 ← |  |
| baseline-squarespace-wordpress.md | SB-7 | SB-11 ← |  |
| baseline-squarespace-wordpress.md | SB-8 | SB-12 ← |  |
| baseline-squarespace-wordpress.md | SP-6 | SP-7 ← |  |

## 3. Agreement across the six builders

Only rows that all six sources judged count (the shared list, 75 rows); a new row judged by two
builders cannot reach 5 or 6.

- **All 6 HAVE (12):** PS-2 (Shared header and footer (edit once)) · SB-1 (Stack full-width bands; add / reorder / delete) · SB-4 (Content placed in a band vertically) · RC-1 (Blocks side by side, any count) · RC-5 (Gap across and down, set by the user) · SP-3 (Gap inside a row / stack / grid) · AL-1 (Align children across and down) · AL-4 (Text alignment) · PD-6 (Preview at device sizes) · MS-5 (Background image / video on a section) · ED-1 (Drag and drop; undo / redo) · ED-4 (Layout presets (ready sections, layouts))
- **5 of 6 HAVE (11):** PS-4 (Several pages, one navigation) · SB-2 (Background edge to edge, content in a centred width) · SB-3 (Band of set height (auto · screen share · fixed)) · RC-2 (Column widths by share, changed by dragging) · GR-3 (Block spanning several columns / rows) · SP-1 (Padding, all sides and each) · PO-1 (Sticky header / sticky block) · PD-2 (Hide / show a block per device) · PD-5 (Cascade to smaller sizes unless overridden) · MS-1 (Image cover / contain with a focal point) · ED-2 (Select parent / child; layers tree) — the one without: PS-4 Carrd P · SB-2 Carrd P · SB-3 Carrd P · RC-2 Squarespace P · GR-3 Carrd N · SP-1 Squarespace P · PO-1 Carrd N · PD-2 Carrd P · PD-5 Squarespace N · MS-1 Carrd P · ED-2 Squarespace P
- **Carrd HAS it — the floor (31):** PS-2 (Shared header and footer (edit once)) · PS-12 (In-page sections as "pages" (named views switched by a link)) · PS-13 (Anchor points to scroll to (named, linkable, next / previous)) · SB-1 (Stack full-width bands; add / reorder / delete) · SB-4 (Content placed in a band vertically) · SB-9 (The page as a card over a full-screen background) · RC-1 (Blocks side by side, any count) · RC-2 (Column widths by share, changed by dragging) · RC-4 (Columns stack on a phone, and in what order) · RC-5 (Gap across and down, set by the user) · FL-1 (Normal flow, top to bottom) · SZ-5 (One site-wide content width) · SZ-9 (Per-breakpoint "manual" switch leaving untouched fields automatic) · SP-1 (Padding, all sides and each) · SP-2 (Margin, incl. negative) · SP-3 (Gap inside a row / stack / grid) · AL-1 (Align children across and down) · AL-4 (Text alignment) · PD-4 (Change size / columns / spacing per device) · PD-5 (Cascade to smaller sizes unless overridden) · PD-6 (Preview at device sizes) · MS-4 (Video / embed by width and proportion) · MS-5 (Background image / video on a section) · SE-4 (Reading order follows visual order) · AX-4 (Nothing overflows sideways at 320–360px) · SD-1 (Page weight budget, lightweight export) · ED-1 (Drag and drop; undo / redo) · ED-2 (Select parent / child; layers tree) · ED-3 (Copy / paste / duplicate, incl. style) · ED-4 (Layout presets (ready sections, layouts)) · ED-10 (Shared appearance styles linked across elements)

## 4. Merges and near-misses (judged by meaning)

- **Merged (same meaning, different IDs):** FL-6 sideways strip (01 FL-6 = Webflow/Wix FL-6) · AL-6 auto margin (01 = Webflow/Wix
  AL-6) · MS-6 crop / focal point per device (01 = Webflow/Wix MS-6) · PO-7 header hides on scroll (01 PO-7 = Squarespace/WP PO-7)
  · PO-9 pinned within its own section (Webflow/Wix PO-6 = Squarespace/WP PO-6) · ED-7 per-device "overridden here" + reset
  (01 ED-7 = Framer/Carrd ED-7).
- **Kept apart (related, not the same):** PO-6 a held scroll SECTION vs PO-9 a block pinned inside its section · SB-6 inset
  section vs SB-9 the whole page as a card vs SB-8 page frame · SB-7 one block bleeding out vs SB-10 the three named widths ·
  PS-8 the menu collapsing vs PS-15 an editable overlay layout vs PO-8 the top layer · SD-3 hidden costs nothing vs PD-13
  not rendered vs hidden by CSS · ED-8 role-locked slots vs ED-11 a per-block lock · ED-9 custom CSS vs ED-10 linked styles
  vs SB-12 a section colour theme · RC-8 equal-height columns vs SZ-2 "fill" height · SZ-9 Auto / Manual per field vs ED-7
  the override mark vs PD-8 a no-setting default.

## 5. Source disagreements noticed (not resolved here)

- **[FIXED 2026-10-16, RX3-4 — 02 now states 45 · 24 · 6] 02's totals did not add up to its own table:** the header says 41 HAS · 31 PARTLY · 9 GAP (81), but the table has 75
  rows: 45 HAS · 24 PARTLY · 6 GAP (counting "HAS (engine)" as HAS and "PARTLY (engine-only)" as PARTLY).
- **Ours vs the builders on PS-2:** all six builders HAVE a shared header / footer; 02 claims GAP. PS-3: no builder has a
  sidebar region (0 / 6 H) while 02 claims HAS (built from rows / grids + an `aside` tag).
- **Wix RC-4:** the Wix help pages disagree with each other on how far the plain section grid changes per breakpoint
  (noted in baseline-webflow-wix.md; copied as H).
- **WordPress PD-4 / PD-5 / PD-1** rest on a July 2026 7.1 call for testing, not confirmed as shipped (baseline-squarespace-wordpress.md).
