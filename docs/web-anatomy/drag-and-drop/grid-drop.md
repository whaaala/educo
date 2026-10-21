# Dropping onto a grid — how the leaders snap a drag to columns and cells

Stored 2026-10-21 for BATCH LE-15n (6) ("a grid for every stack… the row and the grid is the way to drag and drop… even
if it's invisible… seamless" — the user). Extends `README.md` (how a drag stays smooth) and `../page-grid/` (the page
grid itself: 01-builders-and-systems A12, 04-map). Marks: **[doc]** an official help page / changelog; **[obs]** known
editor behaviour, not documented — re-check by hand before relying on it.

## What we had before this (stored + built)

- The page grid is real for side-by-side rows ON the page (`lib/page-grid.ts`, `pageRow`, `span k`), widths stored as
  shares; the Grid block has `colStart` / `colSpan` / `rowSpan`. A **Stack has no grid of its own**.
- Snapping exists for RESIZE only (`snapEdgePx`, a Grid cell's edge to its tracks); **no drop writes a column**
  (only a new Grid cell gets `newCellSpan`). A drop is an INDEX (`slotFromKids`, nearest centre).
- Guides: hidden by default (the user, 2026-10-03), Shift+G / the switch, and shown while the page or a grid is
  selected (LE15l-Q1, 2026-10-20); hidden while a block is dragged. A selected Grid block draws the PAGE's columns, not
  its own (AC-29, open).
- Drag feel (LE-15n): lifted copy ≤ 280 px, source 40 %, neighbours slide on ONE line (200 ms), FLIP glide 220 ms,
  hold still 600 ms = inside (LE15n-d2).

## The leaders

| | Grid drawn | Drop decided by | Neighbours | Nest vs reorder | Phone |
|---|---|---|---|---|---|
| **Squarespace Fluid Engine** | only WHILE dragging; G pins it [doc]; 24 cols desktop / 8 phone [doc] | top-left snaps to nearest cell; size snaps to whole cells [doc] | nothing — overlap allowed, rows grow at the bottom [doc/obs] | no nesting | its own 8-col layout [doc] |
| **Wix Studio** | grid lines on the canvas; cells light up under the drag [doc/obs] | docked to the closest vertical + horizontal lines [doc]; Inspector: click a cell to place [doc] | one item per cell, no overlap; drop on a filled cell swaps [doc] | moving to another parent changes all breakpoints, within one only this one [doc] | cascades desktop → narrower [doc] |
| **Webflow** | blue line / box [obs] | AUTO children: insertion index; **Shift-drag** = manual into the cell under the pointer; Alt-drag duplicates [doc] | auto children reflow [doc] | middle = inside, edge = beside [obs] | no touch editing |
| **Framer** | placeholder [obs] | insertion index in stacks and grids [obs] | siblings slide, animated (Motion `Reorder`) [doc] | drag out of bounds un-nests [obs] | — |
| **Figma grid auto layout (2025)** | blue line between tracks [doc] | AUTO: nearest the cursor, in layer order; or into an empty cell [doc] | siblings refill cells L→R, T→B; full → new row/column [doc]; auto off = empty cells kept [doc] | Ctrl = ignore auto layout [doc] | — |
| **Gutenberg Grid (manual, 18.7)** | cells [doc] | items fixed in cells, moved by drag; row/column typed too [doc] | stay | — | container queries [doc] |
| **Elementor Grid** | blue line [obs] | index; spans typed only [doc] | reflow | one widget per cell (nest a container) [doc] | — |

**Numbers (Atlassian Pragmatic DnD guidelines [doc]):** indicator a 2 px line with an 8 px end mark in the gap; source
at 0.4; preview ≤ 280 × 280; a drop target lights over 350 ms `cubic-bezier(0.15,1,0.3,1)` and only when a drop is
possible; after the drop the moved item flashes 700 ms; hover-to-expand 500 ms. General practice [obs]: transforms only,
FLIP 150–250 ms, measure at the start, once per frame, hysteresis ¼–½ a cell before the target changes.

## What the best share

1. **The grid shows only while dragging** (Squarespace, Wix) — the canvas stays clean otherwise; a key pins it.
2. **Two placements, said openly:** FLOW (the drop is an order; neighbours make room — Figma auto, Framer, Webflow
   auto) and FIXED (the drop is a cell; neighbours stay; empty cells kept — Squarespace, Wix docking, Webflow Shift,
   Gutenberg manual). One is the default, a toggle or a key gives the other.
3. **In FLOW nothing overlaps**: the carried block reserves its place; a full line grows a row rather than refusing.
4. **Every drag has a non-drag twin**: column / row / span typed (Wix, Figma, Gutenberg, Elementor), "Move" in a menu.
5. **Breakpoints separate**: within its parent a move is this screen's; to another parent, every screen's (Wix).

Best for "seamless": **Figma's auto grid** (nearest the cursor, siblings refill live, a full grid grows); simplest for
someone who knows nothing: **Squarespace** (grid drawn only while dragging, snap to cells). Combined: Figma's flow as
the default, Squarespace's grid-while-dragging look, Atlassian's indicator and timings.

## NOT stored yet (open)

Framer's and Wix's drag visuals are undocumented ([obs] only); Bricks / Breakdance not read; keyboard moves between
grid cells (Figma has none).

## Sources

support.squarespace.com/hc/articles/6421525446541 · squarekicker.com/blog/squarespace-fluid-engine ·
will-myers.com/articles/faqs-on-squarespaces-new-fluid-engine · bigcatcreative.com/blog/squarespace-customize-mobile ·
support.wix.com/en/article/editor-x-using-grids · support.wix.com/en/article/studio-editor-working-with-an-advanced-css-grid ·
support.wix.com/en/article/studio-editor-about-cells-and-grids · wix.com/studio/academy/lessons/stack ·
academy.markcopy.ai/episode/webflow-grid-2 (Webflow Academy "Grid 2.0") · discourse.webflow.com/t/moving-elements-on-the-grid/127227 ·
framer.com/academy/lessons/framer-fundamentals-stacks-and-relative-positioning · framer.com/docs/reorder/ ·
help.figma.com/hc/articles/31289469907863 · help.figma.com/hc/en-us/articles/360040451373 ·
elementor.com/help/create-a-grid-container/ · make.wordpress.org/core/2024/07/04/whats-new-in-gutenberg-18-7-03-july/ ·
atlassian.design/components/pragmatic-drag-and-drop/design-guidelines
