---
title: The layout's tiers — Must · Should · Nice · Great (BATCH RX-3, SIGNED 2026-10-17)
---

# The layout's tiers (BATCH RX-3, 2026-10-16) — for the user to SIGN

**The question** (the user, 2026-10-16): "make sure this is definitely a must-have… I don't want us to do must-haves and then
find out that we're missing stuff." **The answer:** the signed essentials (LE-1 … LE-7) were **not** complete. Two Must-haves
were missing (a header and footer shared by every page; a short page's footer at the bottom of the screen), two essential
Should-haves were missing (a reading-order warning; "where am I" in nested blocks), and the measurement found **thirteen bugs**
in what we already have (RX3-1 … RX3-15) — twelve are fixed in RX-3, now (the user's standing rule), and the thirteenth (RX3-15) is the missing footer, LE-8.

## How this was decided

- **The inventory:** 132 layout capabilities (`layout-tiers/04-matrix.md`), from the stored research (4,250 crawled pages,
  `01-inventory.md`) and six builders' documentation (Webflow, Wix Studio, Framer, Carrd, Squarespace, the WordPress block
  editor — `baseline-*.md`).
- **Ours, measured:** 87 rows driven through the UI in HEADED windows on a fresh production build, every per-device row at all
  55 widths of `scripts/uat/screens.js` (`03-ours-measured.md`): **51 HAS · 27 PARTLY · 9 GAP**. Where the code's claim
  (`02-ours-code.md`) and the measurement disagreed, the measurement won (SB-4, PD-3, SP-2).
- **The tiers** (RULE TIERS): **Must** — a person building a basic school or business site meets it at once, or the result is
  wrong (inaccessible, broken on a phone, over the RULE AF budget). Signals: 5–6 of 6 builders have it, Carrd (the floor) has
  it, ≥ ~50 % of real pages use it, or WCAG / RULE AF require it. **Should** — most sites need it; *essential* ones are done
  now. **Nice** / **Great** — mapped into batches and done after components.

## MUST — 52 capabilities

| ID | Capability | Why Must | Ours (measured) | Where |
|---|---|---|---|---|
| PS-1 | header · main · footer regions | landmarks, WCAG | HAS | — |
| **PS-2** | **one header and one footer shared by every page — edit once** | **all 6 builders**, Carrd too; 90 % of sites are multi-page | **GAP** | **NEW → LE-8** |
| PS-4 | several pages, one navigation | 5 / 6 builders; median 9 pages a site | PARTLY (menu copied by hand) | closes with PS-2 → LE-8 |
| PS-8 | the menu collapses on a phone | every site with more than ~4 links | — | components → CP-1 (Hamburger / overlay menu) |
| **PS-9** | **a short page's footer sits at the bottom of the screen** | a footer floating mid-screen looks broken | **GAP** (619 px short at 375) | **NEW → LE-8** (RX3-15) |
| SB-1 · SB-2 · SB-4 | bands stacked; background edge to edge with centred content; content placed down a band | 6 / 6 builders | HAS · HAS · PARTLY (RX3-5) | RX3-5 fixed in RX-3 |
| RC-1 · RC-2 · RC-4 · RC-5 · RC-6 | side by side; shares by dragging; stacks on a phone; gaps; nesting | 6 / 6 · 5 / 6; rows of 2 on 88 % of pages | HAS | — |
| GR-1 | a grid that wraps to fewer columns | 55 % of pages use grid | HAS | — |
| FL-1 | normal top-to-bottom flow | 100 % | HAS | — |
| SZ-1 · SZ-2 · SZ-6 · SZ-7 | width; height; fluid rem sizes; a readable line length | design rules #1, rule 16 | HAS (≈ 64 characters a line at 1920) | — |
| SP-1 · SP-2 · SP-3 | inner space; outer space; gaps | 6 / 6 · Carrd | HAS (RX3-7: the side fields) | RX3-7 fixed in RX-3 |
| AL-1 · AL-4 | line up children; text left / centre / right | 6 / 6 | HAS | — |
| PD-1 · PD-2 · PD-4 · PD-5 · PD-6 · PD-8 · PD-9 | edit per screen; hide per device; size per device; the cascade; preview; a sensible narrower default; a block adapts to its own box | 5–6 / 6; 85 % of pages have ≥ 3 breakpoints | HAS | — |
| MS-2 | a picture keeps its shape while it loads | no layout shift | HAS | LE-2 adds the catalogue guard |
| MS-3 | each picture sent at the size each screen needs | RULE AF | HAS, `sizes` not from the layout | LE-5 |
| MS-4 | video by width and proportion | 19.5 % of pages | PARTLY (RX3-2, RX3-9) | LE-1 + RX3-2 / RX3-9 fixed in RX-3 |
| MS-5 | a background picture on a band | 6 / 6 | HAS (video: Nice) | — |
| SE-1 · SE-2 · SE-3 · SE-5 | landmarks; heading order; menus as lists; repeated landmarks named | WCAG 1.3.1 / 2.4 | HAS · HAS · PARTLY · HAS | SE-3 → LE-2 |
| SE-6 | `lang` on every page (and per block) | RULE AF: languages are content | PARTLY (always `en`) | → SM-1 (semantic layer), already batched |
| AX-1 · AX-2 · AX-4 | 200 % text; focus and skip link; nothing sideways at 320–360 | WCAG 1.4.4 / 2.4.7 / 1.4.10 | HAS | — |
| AX-3 | reduced motion honoured | WCAG 2.3.3 | PARTLY (RX3-1) | RX3-1 fixed in RX-3 |
| **AX-5** | **a link to a section, or Tab, never lands under a sticky header** | WCAG 2.4.11; a sticky header is on 21.5 % of pages | **GAP** (RX3-8) | **RX3-8 fixed in RX-3** |
| SD-1 · SD-2 · SD-3 | weight budget; lazy, no shift; a hidden picture costs nothing | RULE AF | HAS (RX3-9: one video breaks the budget) | RX3-9 fixed in RX-3 |
| ED-1 · ED-6 | drag, drop, undo; a check for layout problems | 6 / 6; RULE D | HAS · PARTLY | ED-6 → LE-1 |
| ED-4 | ready-made sections and layouts | 6 / 6 | PARTLY (grid layouts only) | the section library → T-1 (templates); the grid layouts are HAS |
| PO-8 | overlays: menu drawer, modal, cookie bar | 16.8 % of pages have a dialog | — | components → CP-1 (Modal, overlay menu) |

## SHOULD — essential (done with the Musts) · 23

| ID | Capability | Ours (measured) | Where |
|---|---|---|---|
| PS-3 · PS-13 | a sidebar; a link to a section on the same page ("Bookmark name") | HAS · HAS | — |
| SB-3 · SB-6 | a band of a set height (full / half screen); an inset section | HAS | — |
| RC-3 · SZ-5 | a column of a set width; one site-wide content width | PARTLY | LE-3 |
| RC-8 · GR-3 · FL-2 · FL-5 | equal-height columns; a block spanning cells; a wrapping row; one block over another | HAS | — |
| AL-2 · AL-3 | spread with even spacing incl. wrapped lines; one block aligned on its own (incl. stretch) | PARTLY · HAS | LE-4 |
| PO-1 · PO-2 · PO-3 · PO-9 | sticky; fixed; floating in its parent; sticky only within its section | HAS | — |
| **PD-3** | **order per device** | **GAP** — stored, never drawn on the page grid (RX3-6) | **RX3-6 fixed in RX-3** |
| **SE-4** | **a warning when the order on a screen no longer matches the reading order** (WCAG 1.3.2 / 2.4.3 — matters once PD-3 works) | PARTLY | **NEW → LE-9** |
| SE-7 | a repeated group published as a list ("List") | HAS | — |
| **ED-2** | **"where am I": the selected block's parents shown and clickable** (5 / 6 builders; 26.5 % of pages nest 3+ deep) | PARTLY (Escape only) | **NEW → LE-10** (the full layers tree: Nice, L-20) |
| ED-3 · ED-5 | copy / paste / duplicate; guides and snapping | HAS | — |
| MS-1 | a picture's focal point and fit | PARTLY | components → CP-1 (the Image rebuild has the focal point) |

## SHOULD — later · NICE · GREAT (all mapped — RULE LB)

- **Should, later:** ED-7 a "set here / inherited" mark on each control (→ L-20) · SP-4 the spacing sliders on the scale (→ L-19)
  · PS-6 one row of a two-row header sticky (→ L-18) · SD-4 the browser baseline for the audience's phones (AC-23, → L-11;
  **decision D2**).
- **Nice — already held by a batch:** SB-5 band edges (S-4 / L-10) · SB-7 bleed (AC-35) · GR-2 a minimum card width (AC-33) ·
  GR-5 masonry (HAS) · GR-6 subgrid (AC-36) · GR-7 dense packing (AC-32) · FL-3 text round a picture (AC-8) · FL-4 text in
  columns (AC-19) · FL-6 a sideways strip (CP-1, Slider) · SP-2 negative space (AC-10) · AL-5 baseline (AC-25) · AL-6 push to
  the far end (AC-26) · PO-4 overlap the next band (AC-10) · PO-5 free placement · PO-6 pinned / stacked sections (L-15) · PD-7
  height-aware (AC-3) · MS-5 a background video (AC-17) · MS-6 art direction (AC-22) · SZ-4 a box of a chosen proportion
  (AC-34, **decision D1**) · PS-5 symbols / templates (T-1) · PS-15 the phone menu as its own layout (CP-1).
- **Nice — NEW batches:** **L-18** the header and the page frame (PS-6, PS-7 a header over the hero, PS-10 an announcement
  bar, PS-14 hide the header on one page, PO-7 a header that hides on scroll, AX-6 held bars at most a quarter of the screen) ·
  **L-19** widths, grids and spacing (SB-10 content / wide / full, GR-9 hairlines between cells, GR-10 the last row fills,
  SZ-3 min / max width, SP-4, SP-6 a staggered column) · **L-20** editing (RC-7 change a container's kind, ED-3 copy / paste a
  style, ED-7, ED-12 group / ungroup, ED-13 move several together, the full layers tree).
- **Great — NEW batches:** **L-21** (PS-11 component variants / slots, PS-12 sections as views, SB-9 the page as a card, GR-8
  content in the outer margin, SZ-9 an Auto / Manual switch per field, SP-7 lock to the scale) · **L-22** (PD-11 every screen
  on one canvas, AX-7 a colour-vision preview, ED-8 locked page-building for editors, ED-10 linked styles, ED-11 lock a block;
  and PD-10 a print layout, Nice) · SB-8 a page frame (AC-2).
- **Not for us:** PD-12 a separate hand-arranged phone layout (Squarespace) — it breaks the cascade every other builder and
  rule 18 use, and doubles every edit · PD-13 is SD-3 (HAS).

## The reconcile

| Batch | Tier | Changes | What |
|---|---|---|---|
| RX-3 (now) | Must / Should bugs | 12 bugs | RX3-1 · 2 · 5 · 6 · 7 · 8 · 9 · 10 · 11 fixed; RX3-12 · 13 · 14 measured, then fixed or closed with the measurement (RX3-15 is PS-9, LE-8) |
| **LE-8 NEW** | Must | 2 | one header and footer for every page (PS-2, closes PS-4's hand-copied menu) · the footer at the bottom of a short page (PS-9) |
| **LE-9 NEW** | Should (essential) | 1 | Page check: the order on a screen differs from the reading order (SE-4) |
| **LE-10 NEW** | Should (essential) | 1 | the selected block's parents, shown and clickable (ED-2) |
| LE-1 … LE-7 | as signed | 22 | unchanged; LE-7 also re-sweeps LE-8 … LE-10 |
| **Total essentials** | | **26 changes + 12 bugs** | was 22 changes |

**Estimate, redone:** the signed plan was 22 changes over 2–3 days; the essentials are now 26 changes, LE-8's shared header and
footer the largest (a new piece of the site model, the export and the app's webview), plus the 12 RX-3 bugs —
**about 4–5 working days** to a merged pull request, then components.

## Decisions — SIGNED by the user, 2026-10-17

The user chose the recommendation on all four: **D1 Nice, later · D2 an essential Should, a line in LE-7 · D3 waits for CP-1 · D4 the tiers signed** (Must 52 · essential Should 23 · the rest mapped).


- **D1 · SZ-4 — a "proportion" control for any block (16:9, square)?** Recommended: **Nice, later (AC-34)** — LE-1 sizes the
  video by its width and LE-2 makes every picture keep its shape, which covers the cases a basic site meets.
- **D2 · SD-4 — the browser baseline for the audience's phones (AC-23)?** Recommended: **make it an essential Should, one
  line in LE-7's re-sweep** — the export uses container queries, `svh` and `:has()`; a Tecno / itel phone on an old WebView or
  Opera Mini must still get a readable page (RULE AF).
- **D3 · MS-1 — an image's focal point waits for the Image component (CP-1), straight after the essentials?** Recommended: yes.
- **D4 · sign the tiers above** (Must 52 · essential Should 23 · the rest mapped), or move any line.
