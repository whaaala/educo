---
title: The layout inventory — every capability, its values and how often real pages use it (BATCH RX-3)
---

# The layout inventory (BATCH RX-3 step 1 + the frequency half of step 3, 2026-10-16)

One row per capability of [00-capabilities.md](00-capabilities.md), plus the rows the stored research shows the list
lacked (§2). Built ONLY from research already in the repo — no new browsing. Frequency is MEASURED from the crawl where
the crawl records it; otherwise the row says "not measurable from the crawl" and names the stored source that speaks to it.

## 0. The data and the method

| Dataset | What it holds | n |
|---|---|---|
| `docs/layout-benchmark/pages.tsv` | one line per crawled page: landmarks · h1 · header (position + transparent + rows) · hamburger · sidebars (side, width %, sticky) · components · breakpoints · `layout` (each section: width `full` / `contained` / `inset`, its rows / grids with part widths, nested shares, wrapped lines, `sticky`) | **4,250 pages, 490 sites** (Framer 1,679 · Webflow 1,362 · awwwards 1,209), **21,719 sections, 23,728 rows / grids** |
| `scripts/uat/page-cover.json` | the pages chosen to cover the structures, by tier | **552** (tier 80: 14 · tier 95: 135 · tier 99: 403) |
| `docs/web-anatomy/research-runs/AGGREGATE.md` | CSS features and held (sticky / fixed) behaviour measured on live sites | **741 sites** |
| `docs/web-anatomy/page-grid/05-crawl-splits.md`, `06-rungs.md` | row splits in twelfths (desktop 1440); what a row does at 768 and 375 | 23,728 rows; 300 pages re-measured |

**Counting script:** a node script (session scratchpad, `inventory-count.js`, not committed — re-runnable from the two files
above) parses `pages.tsv` and `page-cover.json`. Definitions: a row is *unequal* when its largest and smallest part differ
by more than 8 points (the ±8 bucket `STRUCTURES.md` uses); *thin part* = a 2-part row with a part ≤ 15%; *hug* = a row
whose parts fill < 70% of it; *> 110%* = parts that add up to more than the row (overlap, bleed or a sideways strip);
*nested* = a row with inner shares `(..)`; *wrapped* = `xN`; depth = `{}` nesting. **First tier** = the lowest
page-cover tier (80 → 95 → 99) in which at least one page shows the feature.

**Limits (stated once):** the crawl measured desktop 1440 only (per-device behaviour comes from `06-rungs.md`); "header"
was measured on 2,581 pages (the rest had no header element the crawler recognised); "transparent" counts any header
whose own background is transparent, in flow or not; a hamburger was detected at 1440, i.e. a menu that is a toggle
even on desktop; `lang` had no RTL page at all (a blind spot of the crawl, not proof RTL is unneeded); education is thin
(137 pages in the culture-education / school category, 12 admissions pages).

### 0.1 The numbers

| Feature (page has …) | Pages | Share of 4,250 | First tier | t80 /14 | t95 /135 | t99 /403 |
|---|---|---|---|---|---|---|
| a row / grid of 2 | 3,722 | 87.6% | 80 | 13 | 129 | 376 |
| a `nav` landmark | 3,504 | 82.4% | 80 | 12 | 118 | 328 |
| ≥ 3 media-query breakpoints | 3,616 | 85.1% | n/a | | | |
| exactly one `h1` | 3,184 | 74.9% | 80 | 7 | 107 | 311 |
| a row of UNEQUAL shares | 3,125 | 73.5% | 80 | 13 | 124 | 388 |
| cards (component) | 2,911 | 68.5% | 80 | 9 | 91 | 310 |
| a full-width section | 2,870 | 67.5% | 80 | 8 | 98 | 287 |
| a row whose parts fill < 70% (hug / spread) | 2,406 | 56.6% | 80 | 7 | 88 | 305 |
| a contained section (background edge to edge, content centred) | 2,353 | 55.4% | 80 | 9 | 90 | 250 |
| any `display: grid` | 2,342 | 55.1% | 80 | 9 | 100 | 298 |
| forms | 2,286 | 53.8% | 80 | 7 | 74 | 211 |
| a row / grid of 3 | 2,249 | 52.9% | 80 | 9 | 102 | 320 |
| a `footer` landmark | 2,514 | 59.2% | 80 | 7 | 84 | 269 |
| a thin part beside a wide one (≤ 15% in a 2-row) | 1,919 | 45.2% | 80 | 13 | 81 | 231 |
| full AND contained / inset sections on one page | 1,908 | 44.9% | 80 | 6 | 74 | 221 |
| an inset section (narrower than the window) | 1,907 | 44.9% | 80 | 6 | 54 | 218 |
| a 2+ row header | 1,215 | 28.6% | 80 | 7 | 39 | 114 |
| 2+ `nav` landmarks | 1,669 | 39.3% | 80 | 7 | 56 | 144 |
| a `main` landmark | 1,653 | 38.9% | 80 | 6 | 41 | 180 |
| accordion | 1,626 | 38.3% | 80 | 7 | 60 | 130 |
| a grid of 3 or 4 | 1,621 | 38.1% | 80 | 7 | 69 | 231 |
| a row with mixed lines (`+stack`) | 1,531 | 36.0% | 80 | 2 | 58 | 211 |
| a `header` landmark | 1,502 | 35.3% | 80 | 5 | 51 | 180 |
| a wrapped row / grid (2+ lines) | 1,376 | 32.4% | 80 | 5 | 47 | 224 |
| a hamburger (at 1440) | 1,372 | 32.3% | n/a | | | |
| a section that is a single block (picture band) | 1,322 | 31.1% | 80 | 3 | 41 | 143 |
| a grid of 3 | 1,318 | 31.0% | 80 | 4 | 59 | 203 |
| nested columns inside a column | 1,307 | 30.8% | 80 | 3 | 59 | 149 |
| a section with something sticky inside | 1,291 | 30.4% | 80 | 5 | 52 | 141 |
| a row / grid of 4 | 1,273 | 30.0% | 80 | 7 | 54 | 210 |
| a row whose parts total > 110% | 1,259 | 29.6% | 80 | 6 | 32 | 138 |
| stack nesting depth ≥ 3 | 1,128 | 26.5% | 80 | 9 | 46 | 161 |
| a row / grid of 5+ | 1,088 | 25.6% | 80 | 6 | 48 | 191 |
| a grid with unequal tracks | 1,015 | 23.9% | 80 | 3 | 62 | 174 |
| a sticky or fixed header | 914 | 21.5% (35.4% of measured headers) | 80 | 2 | 33 | 82 |
| a header OVER the content (fixed / absolute + transparent) | 870 | 20.5% | 95 | 0 | 25 | 77 |
| video | 827 | 19.5% | 80 | 6 | 22 | 99 |
| something sticky in a NON-first section | 733 | 17.2% | 80 | 4 | 25 | 105 |
| dialog | 714 | 16.8% | 80 | 2 | 19 | 62 |
| a fixed header | 694 | 16.3% | 95 | 0 | 23 | 66 |
| marquee | 629 | 14.8% | 80 | 2 | 16 | 91 |
| no `h1` | 555 | 13.1% | 80 | 5 | 13 | 44 |
| a grid of 4 | 558 | 13.1% | 80 | 3 | 22 | 79 |
| no media-query breakpoint | 539 | 12.7% | n/a | | | |
| a sidebar | 351 | 8.3% | **95** | 0 | 13 | 33 |
| a sticky header (`position: sticky`) | 220 | 5.2% | 80 | 2 | 10 | 16 |
| header + main + footer landmarks, all three | 826 | 19.4% | 80 | 3 | 27 | 105 |
| no landmark at all | 404 | 9.5% | 80 | 1 | 10 | 25 |
| stack nesting depth ≥ 4 | 305 | 7.2% | 80 | 1 | 17 | 46 |
| cookie banner | 291 | 6.8% | 95 | 0 | 11 | 39 |
| pagination | 263 | 6.2% | 80 | 2 | 5 | 33 |
| an `aside` landmark | 255 | 6.0% | 80 | 2 | 5 | 23 |
| sidebar on the left / right | 241 / 178 | 5.7% / 4.2% | 95 | 0 | 11 / 5 | 24 / 19 |
| tabs | 229 | 5.4% | 80 | 1 | 10 | 24 |
| search · breadcrumb · carousel | 210 · 209 · 195 | 4.9% · 4.9% · 4.6% | 80 · 95 · 80 | | | |
| a sticky sidebar | 171 | 4.0% | 95 | 0 | 7 | 17 |
| back-to-top | 133 | 3.1% | 95 | 0 | 3 | 12 |
| map · table | 87 · 44 | 2.0% · 1.0% | 95 | | | |
| no `lang` · non-English `lang` · RTL `lang` | 670 · 186 · 0 | 15.8% · 4.4% · 0% | n/a | | | |

**Whole-crawl:** sections per page median **4**, p90 **11**. Section widths: inset 8,032 (37%) · contained 7,288 (34%) ·
full 6,399 (29%); 1,922 sections (8.8%) hold something sticky. Rows / grids 23,728: grid 6,522 (27%) · unequal 12,447
(52%) · wrapped 2,237 (9%) · nested 1,604 · hug 5,591 · > 110% 1,752. Sites: 443 of 490 (90.4%) have 2+ pages, median
**9 pages** a site; on those, the header descriptor is identical on every page in 62.3% and a `footer` landmark is on
every page in 43.1% (a lower bound — a footer often is not a landmark). Sidebar width (n = 550): median **25%**, p25 21%,
p75 30%. Page types: other 1,112 · home 485 · legal 345 · blog-index 317 · about 313 · contact 311 · article 303 ·
services 191 · case-study 153 · work-index 120 · listing 107 · pricing 78 · faq 77 · events 67 · careers 63 · product 61 ·
team 58 · booking 50 · cart 27 · admissions 12. **Education pages (137):** sticky / fixed header 44 (32%) · 2+ row header
48 (35%) · sidebar 13 (9.5%) · `aside` 13 · breadcrumb 2.
**Live sites (AGGREGATE, 741):** any fixed element 85% · fixed top bar with links 36% · any sticky element 23% · sticky top
bar 3% · pinned scroll section (sticky in a parent ≥ 1.8 screens) 17% · scroll-snap 21% · clip-path 43% · mask 32% ·
backdrop-filter 40% · reduced-motion query 23% · `:focus-visible` 36% · `(hover: hover)` 24% · container queries 4% ·
anchor positioning 8%.
**Per device (06-rungs, 300 pages):** tablet 768 — 2 across keeps 59% / stacks 28%; 3+ across goes to fewer ≈ 45%.
Phone 375 — 2 across keeps 45% / stacks 48%; 3 across fewer 39% / stacks 41%; 4 across fewer 47% / stacks 38%; 5+ across
fewer 61% / stacks 21%.

---

## 1. The inventory — one row per capability of 00

"Basic site?" = can a basic school / small-business site (home · about · news · events · contact · admissions) be built
WITHOUT it.

| ID | Capability | Values (the axis) | How often real pages use it | Source(s) | Basic site without it? |
|----|-----------|-------------------|-----------------------------|-----------|------------------------|
| PS-1 | Header · main · footer regions | header · main · footer (+ nav, aside) | nav 82.4% · footer 59.2% · main 38.9% · header landmark 35.3% (a header element 60.7%) · all three 19.4% · none 9.5%; tier 80 | pages.tsv; html-semantics §3; regions-and-education §0 | **no** — every page needs them (and the skip link targets `main`) |
| PS-2 | A shared header and footer | one header / footer for every page · per-page override | 90.4% of sites are multi-page (median 9 pages); identical header on every page in 62.3% of them; footer on every page ≥ 43.1% | pages.tsv; regions §3 (NN/g: "keep it identical on every page") | **no** — editing nine headers by hand drifts |
| PS-3 | A sidebar beside the main content | left · right · width (median 25%, 21–30%) · sticky or not · on the phone: after the main / a disclosure above | 8.3% of pages (left 5.7 · right 4.2 · sticky 4.0%); `aside` 6.0%; first tier **95**; education 9.5% | pages.tsv; regions §4 (aside, sticky TOC, filter panel); LAYOUT_BENCHMARK A2/A3; deck pattern 6 | **yes** — never in tier 80; but SEND / policy pages want a sticky TOC (Should) |
| PS-4 | Several pages, one navigation | pages · menu · page types | median 9 pages a site; 20 page types (home, legal, blog, about, contact, article… admissions) | pages.tsv; regions §5.5–5.6 (school site map, 7 top items) | **no** |
| PS-5 | Page templates / reusable sections | a saved section · a symbol (edited once, used many) · a page template | not measurable from the crawl | LAYOUT_BENCHMARK C1–C12 (page types are sequences of the same sections); regions §5.5 (page types the builder needs as templates) | **yes** — copy / paste stands in (but see ED-4) |
| SB-1 | Stack full-width bands | add · reorder · delete | 100% of pages; median 4, p90 11 sections a page | STRUCTURES.md (21,719 sections) | **no** |
| SB-2 | Background edge to edge, content in a centred width | full (content to the edges) · contained (bg full, content centred) · mixed on one page | contained on 55.4% of pages (34% of sections); full on 67.5% (29%); both on one page 44.9%; tier 80 | pages.tsv `layout`; page-grid 04 A3 / A10 | **no** — without it lines run past ~75 characters on a wide screen (Rule #1.9) |
| SB-3 | A band of set height | auto · a share of the screen (100 / 80 / 50 svh, "minus the header") · at least N rem | not measurable (the crawl kept no heights) | LAYOUT_BENCHMARK A10, B10 (70–100vh hero); AC-3; css-layout 07 H6 | **yes** — auto works; a full-screen hero is a Should |
| SB-4 | Content placed in a band vertically | top · middle · bottom · 40% from the top (AC-5) | not measurable | AC-5; LAYOUT_BENCHMARK B10 | **yes** — only matters once SB-3 is set |
| SB-5 | A shaped band edge; a band tucked under / over the next | slope · wave · curve · cut on a screen-height measure (AC-1) · pulled up by the edge's depth (AC-10) | not measurable from pages.tsv; clip-path on 43% and mask on 32% of 741 live sites (any use, not only edges) | AGGREGATE; advanced-css AC-1 / AC-10; LAYOUT_BENCHMARK A12 | **yes** |
| RC-1 | Blocks side by side, any count | 2 · 3 · 4 · 5 · 6+ | 2: 87.6% · 3: 52.9% · 4: 30.0% · 5+: 25.6% of pages; parts per row 2 → 15,207 · 3 → 4,713 · 4 → 1,958 · 5 → 637 · 6 → 366 rows; tier 80 | pages.tsv; 05-crawl-splits | **no** |
| RC-2 | Column widths by share, dragged | the six core splits 6+6 (20.7% of rows) · 4+4+4 (9.8%) · 3+3+3+3 (4.5%) · 4+8 (6.6%) · 5+7 (6.7%) · 3+9 (4.4%) ≈ 57% · the rest | an unequal row on 73.5% of pages; 52% of all rows unequal; tier 80 | 05-crawl-splits; STRUCTURES.md (40/60, 60/40, 30/70, 70/30 in the top 7 shapes) | **no** |
| RC-3 | A column of a SET width beside shared ones | fixed rem · content-sized (`max-content`) · bounded (`minmax(12rem, 20rem)`) | a thin part (≤ 15%) beside a wide one on 45.2% of pages — mostly an icon / number beside words (05 point 4); sidebars median 25% | pages.tsv; 05-crawl-splits; AC-30; L6-4 | **yes** — a share and "hug" stand in (it is the real fix behind L6-4, Should) |
| RC-4 | Columns stack on a phone, and in what order | stack · fewer across · keep · order (media first, aside after) | phone: 2 across stacks 48% / keeps 45%; 4 across fewer 47% / stacks 38%; order swap seen on ≈ 4 sites + 2 designs | 06-rungs; page-grid 04 A15 / A22; LAYOUT_BENCHMARK cross-cutting 1–3 | **no** |
| RC-5 | Gap across and down | column-gap · row-gap · page gutter vs card gap · grows when stacked | not measurable (gaps folded into the parts) | page-grid 04 A4 | **no** |
| RC-6 | Nesting at any depth | row in a column in a row · grid in a cell | nested columns on 30.8% of pages (1,604 rows); stack depth ≥ 3 26.5%, ≥ 4 7.2%; tier 80 | pages.tsv; STRUCTURES.md ("row of 2 +nested columns" #16 shape) | **no** |
| GR-1 | A grid of N columns that wraps | 2 · 3 · 4 across, fewer per device | `display: grid` 55.1% of pages; grid of 3 31.0%, of 4 13.1%; wrapped rows / grids 32.4%; tier 80 | pages.tsv; STRUCTURES.md; LAYOUT_BENCHMARK A5 ★ | **no** — news, staff, events cards |
| GR-2 | Auto-fit: as many as fit a minimum width | min width in rem · fill / fit | not measurable (auto-fit not recorded); container queries on 4% of live sites | AC-33; page-grid 04 A1 / A13 (Webflow, Framer) | **yes** — GR-1 with per-device counts stands in; it is rule 16's first ingredient |
| GR-3 | A block spanning columns / rows | column span · row span · bento anchor | not measurable directly; a grid of unequal tracks on 23.9% of pages (proxy) | LAYOUT_BENCHMARK A7 ★ bento, B28; page-grid 04 A9 | **yes** — Should (featured news card) |
| GR-4 | Placing on exact lines of a 12-column page grid | start · end · span · offset start · empty column · to the last line | 66.1% of rows land on whole twelfths; offset start 5 designs + 4 sites | 05-crawl-splits; page-grid 04 A7 / A17; AC-37b | **yes** — shares cover it; lining up across sections is the gain |
| GR-5 | Masonry | balanced columns · phone order | not measurable | LAYOUT_BENCHMARK A6; page-grid 04 A9 (shipped `aa6d32f`) | **yes** |
| GR-6 | Subgrid: parts line up across cards | rows (title / text / button) · columns on the page lines | not measurable; 0 of 26 live designs in page-grid 02 used it | AC-36; css-layout 07 J1 / J2 | **yes** — cards look ragged (Should) |
| FL-1 | Normal flow, top to bottom | — | 100%: plain stack 17.3% of sections, stack with rows inside 41.3% | STRUCTURES.md | **no** |
| FL-2 | A row that wraps | wrap · no wrap · how wrapped lines align | wrapped row / grid 32.4% of pages (9% of rows); mixed lines 36.0% | pages.tsv | **no** — logos, tags, buttons |
| FL-3 | Text wrapping round a picture | float start / end · round its shape · off below ~30 rem | not measurable | AC-8; css-layout 07 I11 | **yes** |
| FL-4 | Text in several columns | 2 · 3 columns · a list in two columns · A–Z read down | not measurable | AC-19; css-layout 07 I12 | **yes** |
| FL-5 | Layers: one block over another | same grid area + z-order · text over a photo · collage | parts totalling > 110% on 29.6% of pages (overlap / bleed / strip, upper bound); header over the content 20.5% | pages.tsv; AC-31; page-grid 04 A18 | **yes** — a band's background photo (MS-5) gives text over a photo |
| SZ-1 | Width: fill · hug · share · fixed | fill · hug · share · fixed rem | rows whose parts fill < 70% (content-sized) on 56.6% of pages (5,591 rows) | pages.tsv; css-layout 07 H7 | **no** |
| SZ-2 | Height: hug · fill · fixed · screen share | hug · fill (equal heights) · at least N rem · svh | not measurable | css-layout 07 H6; AC-3 | **no** — equal-height cards need fill |
| SZ-3 | Min / max width and height | largest width (rem / %) · min width · no max-height (WCAG) | not measurable | css-layout 07 H3–H5 | **no** — a form or a quote needs a largest width |
| SZ-4 | A box of a chosen proportion | free · 1:1 · 4:3 · 16:9 · 3:4 · 4:5 · 2:1 | not measurable; video on 19.5% of pages (16:9 boxes) | AC-34; css-layout 07 H1 | **no** — video, square staff portraits |
| SZ-5 | One site-wide content width | max ≈ 80 rem · fluid side margin · safe-area | contained sections on 55.4% of pages; live content widths 1194–1280 px | page-grid 04 A3; AC-9 | **no** |
| SZ-6 | Fluid sizes (rem / clamp / %) | rem first · % of the parent · clamp with a rem ideal | not measurable from the crawl | rule 16; deck 04 (four ingredients); page-grid 04 A4 | **no** — WCAG 1.4.4 and every phone |
| SP-1 | Padding, all sides and each | all · each side · per device | not measurable | spacing-overlay.md; rule 3 | **no** |
| SP-2 | Margin, incl. negative | all · each side · auto · negative (pull up) | not measurable | AC-10 (R-4 D2 chose no negative-margin control); css-layout 07 G | **no** for margin · **yes** for negative |
| SP-3 | Gap inside a row / stack / grid | across · down | not measurable | page-grid 04 A4 | **no** |
| SP-4 | A spacing scale | tokens on a 16 px-based scale | not measurable | rule 17; Rule #1.7 (deck) | **yes** — free rem works; tokens keep a site consistent |
| SP-5 | Spacing seen and dragged on the canvas | shaded bands · labels · drag | not measurable (editor) | spacing-overlay.md; BATCH E-6 | **yes** |
| AL-1 | Align children across and down | start · centre · end · fill | not measurable | css-layout 07 §2.C; AC-27 | **no** |
| AL-2 | Spread children incl. wrapped lines | between · around · evenly · wrapped lines top / middle / bottom / spread | not measurable; hug rows (56.6%) are the rows spread or packed | AC-25 / AC-26; css-layout 07 §2.D | **no** — nav and logo rows |
| AL-3 | One child aligned differently | align-self start · centre · end · stretch | not measurable | AC-27 | **yes** |
| AL-4 | Text alignment | start · centre · end · justify, per device | not measurable | page-grid 04 A22 (centred → left on the phone) | **no** |
| AL-5 | Baseline alignment | first baseline | not measurable | AC-25 (menus, price rows) | **yes** |
| PO-1 | Sticky header / block | header · sidebar · a cell ("label left, content right") · threshold · scope | sticky / fixed header 21.5% of pages (35.4% of measured headers; education 32%); sticky inside a section 30.4%, in a non-first section 17.2%; sticky sidebar 4.0%; live: any sticky 23%, fixed top bar with links 36% | pages.tsv; AGGREGATE; scroll-and-position README / 04; regions §1.5 | **yes** — but it is the most common held behaviour (Should) |
| PO-2 | A fixed element | back-to-top · chat · cookie bar · phone-only bottom CTA bar (reserving its room, SF-2) | cookie banner 6.8%, back-to-top 3.1% of pages (first tier 95); live: any fixed element 85% | pages.tsv; AGGREGATE; scroll-and-position 04 SF-2 / SF-17 / SF-21; LAYOUT_BENCHMARK B31 | **yes** — a cookie / consent bar may be required by law |
| PO-3 | Floating in its parent | held by any corner · half outside the edge · cover the whole box | not measurable; badge component on 62.6% of pages (not all floating) | css-layout 07 I4–I6; AC-10 / AC-21 | **yes** |
| PO-4 | Overlap into the next band | straddle a section edge · tiles pulled up over the hero | > 110% rows 29.6% (upper bound); straddle 5 designs + 3 sites | page-grid 04 A10; LAYOUT_BENCHMARK A12 / B12; AC-37 / ST-5 | **yes** |
| PO-5 | Free placement anywhere | drop point → nearest lines + margin | not measurable | css-layout 07 §1 (free x / y must resolve to cell + offset); page-grid 04 A7 (AVOID) | **yes** |
| PD-1 | Breakpoints to edit at | phone · 600 · 840 · 1200 · 1600 (config/layout.json) | ≥ 3 breakpoints 85.1%, ≥ 5 70.9%, none 12.7% of pages | pages.tsv; deck 04 (600 / 900 / 1200 "GOOD"); rule 18 | **no** |
| PD-2 | Hide / show per device | hidden on a rung | hamburger even at 1440 on 32.3% of pages; hiding on the phone on ≈ 8 of 26 live designs | pages.tsv; page-grid 04 A22; LAYOUT_BENCHMARK cross-cutting 4 | **no** — the menu and desktop decoration |
| PD-3 | Change order per device | order per rung | not measured in the crawl; ≈ 4 sites + 2 designs | page-grid 04 A15 (Q5); LAYOUT_BENCHMARK A8 (zig-zag image first) | **yes** — source order is the safe default |
| PD-4 | Change size / columns / spacing per device | per-rung override | tablet keeps 2-across 59%; 3+ across goes to fewer ≈ 45% | 06-rungs | **no** |
| PD-5 | Cascade to smaller sizes unless overridden | base = desktop, cascade narrower; wide branches up | not measurable | rule 18; deck 04 (desktop-first) | **no** |
| PD-6 | Preview at device sizes | device presets | not measurable (editor) | lib/preview-devices.ts; RULE Z | **no** |
| MS-1 | Cover / contain with a focal point | cover · contain · focal point | not measurable | media-performance §1.4 / §2, checklist 8 | **no** |
| MS-2 | No shift while loading | width / height or aspect-ratio | not measurable | media-performance §6 (CLS ≤ 0.1), checklist 1; html-semantics check 31 | **no** |
| MS-3 | Responsive files, lazy below the fold | srcset + sizes from the layout · lazy · first image eager + high priority | not measurable | AC-22; media-performance §1.2 / §1.5, checklist 3–6 | **no** — RULE AF (≤ 100 KB LCP image on a 360 px phone) |
| MS-4 | Video / embed by width and proportion | video · YouTube / map facade with its ratio | video 19.5%, map 2.0% of pages | pages.tsv; media-performance §3–4 | **no** — a contact map, a school video |
| MS-5 | Background image / video on a section | photo · video (muted, poster) · colour under it · scrim | not measurable (single-block bands 31.1% are likely picture bands) | AC-17; media-performance §2; LAYOUT_BENCHMARK B10 | **no** — the hero photo |
| SE-1 | Landmarks published | header · nav · main · aside · section · footer | all three of header / main / footer only 19.4%; none 9.5% | pages.tsv; html-semantics §3 / §6 | **no** |
| SE-2 | Heading levels, one h1 | one h1 · no skipped level | one h1 74.9%; none 13.1%; several 12.0% | pages.tsv; html-semantics §4 | **no** |
| SE-3 | Menus as nav > ul > li > a | — | a `nav` on 82.4% of pages | pages.tsv; html-semantics §4 | **no** |
| SE-4 | Reading order follows the visual order | source order · explicit per-rung swap flagged | not measurable | page-grid 04 A15 (WCAG 1.3.2 / 2.4.3) | **no** |
| AX-1 | Survives 200% text | rem gutters, em content minimum | not measurable; failures named (Tim Brack, Petite Reine, Aqua Dev, CarusiHR) | page-grid 04 A15; rule 16 | **no** |
| AX-2 | Focus visible, skip link, keyboard order | — | `:focus-visible` on 36% of live sites | AGGREGATE; html-semantics check 22; regions §0 | **no** |
| AX-3 | Reduced motion honoured | — | reduced-motion query on 23% of live sites | AGGREGATE; regions §1.6 | **no** once any effect exists |
| AX-4 | Nothing overflows at 320–360 px | — | not measurable (desktop crawl) | page-grid 04 A15 / A22; RULE AF | **no** |
| SD-1 | Page weight budget | HTML ≤ 30 KB · CSS ≤ 14 KB · JS ≤ 20 KB · LCP image ≤ 100 KB · 0 third-party | not measurable from the crawl | media-performance §6; RULE AF | **no** |
| SD-2 | Lazy loading, no CLS | — | not measurable | media-performance §1.5 / §6 | **no** |
| ED-1 | Drag and drop; undo / redo | — | not measurable (editor) | builders baseline (RX-3) | **no** |
| ED-2 | Parent / child, layers tree | — | not measurable; nesting depth ≥ 3 on 26.5% of pages makes it needed | pages.tsv | **no** |
| ED-3 | Copy / paste / duplicate, incl. style | — | not measurable | — | **yes** |
| ED-4 | Layout presets | ready sections · page templates · splits gallery · choose by purpose (AC-37c) | not measurable; six splits ≈ 57% of rows (05) | 05-crawl-splits; deck Part 7 (patterns as presets); regions §5.5 | **no** in practice — a non-technical teacher (RULE RK one-hour path) |
| ED-5 | Guides, rulers, snapping | snap to columns · "Show layout guides" (off by default) | not measurable | page-grid 04 A12; AC-29 / AC-37a | **yes** |
| ED-6 | A layout-problems check | overflow · cramped columns · covered words · focus obscured | not measurable | AC-37a; html-semantics §6; scroll 04 SF-5 | **yes** |

---

## 2. NEW rows — what the stored research shows that 00 lacked

| ID | Capability | Values | How often real pages use it | Source(s) | Basic site without it? |
|----|-----------|--------|-----------------------------|-----------|------------------------|
| PS-6 | A multi-row header (utility bar + main row), only one row held | 1 · 2 · 3 rows; which row sticks (SF-15) | 2+ row header on 28.6% of pages, education 35%; tier 80 | pages.tsv; regions §1.3 ("the default for schools"); LAYOUT_BENCHMARK B3; scroll 04 SF-15 | **yes** — but it is the school default (phone, portals, translate) |
| PS-7 | A header over the hero (transparent, solid once scrolled) | over · in flow; scrim; contrast asserted | fixed / absolute + transparent 20.5% of pages; first tier 95 | pages.tsv; regions §1.4; LAYOUT_BENCHMARK B6 | **yes** |
| PS-8 | The menu collapses on narrow screens | visible links · toggle + drawer / accordion; the rung it collapses at | hamburger on 32.3% of pages even at 1440 (more on phones) | pages.tsv; regions §1.1 / §2.4 | **no** — seven school menu items do not fit a 360 px phone |
| PS-9 | The footer sits at the bottom of a short page | body min-height 100svh | not measurable; legal 345 + contact 311 pages are typically short | scroll 04 SF-14 | **no** — a footer floating mid-screen looks broken |
| PS-10 | An announcement / alert bar above the header | on · off · dismissible · per page | not measurable (badge 62.6% is not this) | LAYOUT_BENCHMARK B4 / C2 (school closures); regions §1.3; deck "Alert and status bars" | **yes** — a band stands in; schools need it on closure days (Should) |
| SB-6 | An INSET section (narrower than the window, often a rounded card) | inset by side space · radius | inset sections on 44.9% of pages (37% of all sections) — the commonest width | pages.tsv; page-grid 04 A3 / A10 | **yes** |
| SB-7 | One block bleeds out of a contained section | full-bleed · half-bleed (inner edge on a column line) | not measurable; ≥ 10 sites full-bleed, ≈ 4 sites + 3 designs half-bleed | page-grid 04 A10; AC-35 (built `f4bacbc`) | **yes** |
| SB-8 | A page frame (border round the whole page) | width · off on narrow screens | not measurable | AC-2 | **yes** |
| GR-7 | Dense packing of mixed spans | dense on / off (only where order carries no meaning) | not measurable | AC-32 | **yes** |
| GR-8 | Content in the outer margin (a hanging number) | margin track placement | not measurable; ≤ 3 sites | page-grid 04 A21 | **yes** |
| GR-9 | Rules / hairlines between cells instead of gaps | column rule · row rule · cell borders | not measurable; ≈ 6 sites + 2 designs | page-grid 04 A20 | **yes** |
| FL-6 | A sideways-scrolling strip that keeps its tracks | scroll-snap strip · peek on the phone · (marquee is motion) | scroll-snap on 21% of live sites; marquee 14.8%, carousel 4.6% of pages; > 110% rows 29.6% include strips | AGGREGATE; pages.tsv; page-grid 04 A23; LAYOUT_BENCHMARK A18 | **yes** — wrapping stands in |
| SZ-7 | Readable width on a text block (≈ 65–75 characters) | on (≈ 65 ch) · wider · off | not measurable; the paragraph measure was found at 76–99 characters (#86) | css-layout 07 H2; deck Rule #1.9; page-grid 04 A3 (2% padding failure) | **no** — Rule #1.9 |
| SP-6 | Vertical stagger / offset of a column | a column starts lower; collapses on the phone | not measurable; ≈ 4 sites + 2 designs | page-grid 04 A16 | **yes** |
| AL-6 | Push one block to the far end (auto margin) | to the end · to the bottom (a card's button, a sidebar's last line) | not measurable | AC-26; css-layout 07 G2 | **yes** — Should (card buttons line up) |
| PO-6 | A pinned scroll section / stacking cards | a section held while its content moves · cards stacking | 17% of live sites (sticky in a parent ≥ 1.8 screens); sticky in a non-first section 17.2% of pages | AGGREGATE; pages.tsv; scroll 04 SF-7 | **yes** |
| PO-7 | A header that hides on scroll down / shrinks | always · hide on down · shrink | not measurable | regions §1.6 / §1.7 | **yes** |
| PO-8 | Overlays on the top layer (menu drawer, modal, cookie banner) | dialog · popover · inert page behind | dialog 16.8%, cookie banner 6.8% of pages | pages.tsv; scroll 04 SF-18; html-semantics §5 | **no** — the phone menu drawer (PS-8) is one |
| PD-7 | Height / orientation aware | held bars let go on a short screen; spacing shrinks; landscape phone | not measurable | page-grid 04 A2 (gap G5); scroll 04 SF-4; AC-3 | **no** once anything is held (WCAG reflow on a sideways phone) |
| PD-8 | A sensible narrower-screen default with no setting (fit-based re-split) | 4 → 2 → 1 by what fits; stack last | phones go to FEWER across 47–61% for rows of 4 / 5+ | 06-rungs; page-grid 04 A22 (decided 2026-10-04) | **no** — a teacher will not set every rung |
| PD-9 | A component adapts to its own box (container queries) | container inline size | container queries on 4% of live sites | AGGREGATE; rule 16; page-grid 04 A2 | **no** per rule 16 (a card grid in a half column) |
| PD-10 | Print layout | held bars let go, printed once | not measurable | scroll 04 SF-3 (term dates printed) | **yes** |
| MS-6 | Art direction: a different crop / focal point per device | focal point per rung · `<picture>` crop | not measurable | AC-22; media-performance §2 | **yes** |
| SE-5 | Repeated landmarks named | "Main", "Footer", "Breadcrumb", "In this section" | 2+ `nav` on 39.3% of pages | pages.tsv; html-semantics §3 / §6 check 5 | **no** — APG / WCAG |
| SE-6 | Language and direction per page and block; layout mirrors in RTL | `lang` · `dir` · logical start / end | no `lang` 15.8%; non-English 4.4%; RTL 0 (crawl blind spot) | pages.tsv; RULE AF; page-grid 04 A15; scroll 04 SF-10 | **no** for `lang` (WCAG 3.1.1) · **yes** for RTL in v1 |
| SE-7 | A repeated group exported as a list | cards / links as `ul` | cards on 68.5% of pages | pages.tsv; html-semantics §6 check 19 | **no** |
| AX-5 | Focus and anchors never land under held bars | scroll-padding top AND bottom | (sticky / fixed header 21.5%) | regions §1.5 / §2.8; scroll README; scroll 04 SF-1 / SF-6 | **no** once anything is held (WCAG 2.4.11) |
| AX-6 | Held bars take at most ~25–30% of the screen | measured at 360 × 640 and 640 × 360 | not measurable | scroll 04 SF-5 | **yes** |
| SD-3 | A block hidden on a device costs nothing there | no download of a hidden picture | not measurable | page-grid 04 A22 (gap G7); RULE AF | **no** — RULE AF data budget |
| SD-4 | Works on old WebViews and proxy browsers | `@supports` fallbacks · Opera Mini · minified CSS | not measurable | AC-23; scroll 04 SF-11; html-semantics check 33 | **no** — RULE AF low-cost phones |
| ED-7 | "Set here / inherited" shown per device in the inspector | per rung | not measurable (editor) | page-grid 04 A14 | **yes** |

---

## 3. The frozen list (AC-1 … AC-37) mapped onto IDs

- AC-1 → SB-5 (edge on a screen-height measure) · AC-2 → **SB-8** · AC-3 → SB-3, SZ-2, PD-7 · AC-5 → SB-4
- AC-8 → FL-3 · AC-9 → SZ-5 (+ SB-2) · AC-10 → SP-2 (negative), PO-3 (half outside), PO-4, SB-5 (tucked under)
- AC-17 → MS-5 · AC-19 → FL-4 · AC-21 → FL-5 + PD-4 (the phone fallback) · AC-22 → MS-3 + **MS-6**
- AC-23 → **SD-4** (and SD-1) · AC-25 → AL-2 + AL-5 · AC-26 → AL-2 + **AL-6** · AC-27 → AL-3 (and AL-1 Fill)
- AC-29 → ED-5 · AC-30 → RC-3 · AC-31 → FL-5 · AC-32 → **GR-7** · AC-33 → GR-2 · AC-34 → SZ-4
- AC-35 → **SB-7** · AC-36 → GR-6 · AC-37 → GR-4 + PO-4 (spilling out) · AC-37a → ED-5 + ED-6 · AC-37b → GR-4 + SZ-5 + ED-5 ·
  AC-37c → ED-4 (choose by purpose) + GR-1
- Not layout (no ID): AC-4 (two-line heading — the text component; touches SE-2) · AC-6 / AC-7 / AC-12 / AC-18 / AC-24
  (motion, BATCH VB-6) · AC-11 / AC-14 / AC-15 / AC-16 / AC-20 / AC-28 (style / typography, VB-6) · AC-13 (component, CP-1)
