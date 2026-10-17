---
title: The layout capabilities — the shared list (BATCH RX-3)
---

# The layout capabilities — the shared list (BATCH RX-3, 2026-10-16)

One list, so every builder's baseline (`baseline-*.md`), the crawl's frequency and our own HAVE · PARTLY · GAP line up row
for row. Each row is a capability a person building a website might need; the ID is used everywhere in RX-3. A source
that shows a capability this list lacks ADDS a row at the end of its axis (with a new ID), never a note on the side.

| ID | Axis | Capability |
|----|------|-----------|
| PS-1 | Page structure | Header · main · footer regions on every page |
| PS-2 | Page structure | A header shared by every page (edit once) and a footer shared by every page |
| PS-3 | Page structure | A sidebar beside the main content (left or right) |
| PS-4 | Page structure | Several pages, each with its own layout, one navigation between them |
| PS-5 | Page structure | Page templates / reusable sections ("symbols", "global sections") |
| SB-1 | Sections / bands | Stack full-width sections (bands) top to bottom, add / reorder / delete |
| SB-2 | Sections / bands | A band's background runs edge to edge while its content sits in a centred content width |
| SB-3 | Sections / bands | A band of set height: auto · a share of the screen height (full screen, half) · a fixed size |
| SB-4 | Sections / bands | Content placed in a band vertically (top · middle · bottom) |
| SB-5 | Sections / bands | A shaped band edge (slope, wave) and a band overlapping the next |
| RC-1 | Rows and columns | Blocks side by side in a row, any count (2 · 3 · 4 …) |
| RC-2 | Rows and columns | Column widths by share (50/50, 33/67, 25/75) and changed by dragging |
| RC-3 | Rows and columns | A column of a SET width beside columns that share the rest (sidebar, logo) |
| RC-4 | Rows and columns | Columns stack on a phone (and the order they stack in) |
| RC-5 | Rows and columns | Gap between columns and between rows, set by the user |
| RC-6 | Rows and columns | Nesting: a row in a column in a row (any depth) |
| GR-1 | Grids | A grid of N columns (cards, gallery) that wraps to fewer columns on smaller screens |
| GR-2 | Grids | Auto-fit grid: as many columns as fit a minimum card width |
| GR-3 | Grids | A block spanning several columns / rows of a grid |
| GR-4 | Grids | Placing a block on exact grid lines (12-column page grid) |
| GR-5 | Grids | Masonry / uneven-height cards packed |
| GR-6 | Grids | Items line up across cards (subgrid: titles, buttons aligned) |
| FL-1 | Flow and stacking | Blocks stack top to bottom in a column (the normal flow) |
| FL-2 | Flow and stacking | A row that wraps onto more lines when it runs out of room |
| FL-3 | Flow and stacking | Text wrapping round a picture (float) |
| FL-4 | Flow and stacking | Text in several columns (CSS columns) |
| FL-5 | Flow and stacking | Layers: one block over another (z-order), e.g. text over a photo |
| SZ-1 | Sizing | Width: fill · hug content · a share · a fixed size |
| SZ-2 | Sizing | Height: hug · fill · a fixed size · a share of the screen |
| SZ-3 | Sizing | Minimum and maximum width / height |
| SZ-4 | Sizing | A box of a chosen proportion (16:9, square) |
| SZ-5 | Sizing | One site-wide content width, set in one place |
| SZ-6 | Sizing | Fluid sizes that scale with the screen (clamp / rem / %) and the reader's text size |
| SP-1 | Spacing | Padding: all sides and each side |
| SP-2 | Spacing | Margin: all sides and each side, including negative (pull a section up) |
| SP-3 | Spacing | Gap inside a row / stack / grid |
| SP-4 | Spacing | A spacing scale (tokens) instead of free numbers |
| SP-5 | Spacing | Spacing seen and dragged on the canvas |
| AL-1 | Alignment | Align a block's children across and down (start · centre · end · fill) |
| AL-2 | Alignment | Spread children (space between / around / evenly), including wrapped lines |
| AL-3 | Alignment | One child aligned differently from its siblings (align-self) |
| AL-4 | Alignment | Text alignment (left · centre · right · justify) |
| AL-5 | Alignment | Baseline alignment of text across a row |
| PO-1 | Positioning | A sticky header / sticky block |
| PO-2 | Positioning | A fixed element (back-to-top, chat button, cookie bar) |
| PO-3 | Positioning | A floating / absolutely placed block inside its parent (badge on a card) |
| PO-4 | Positioning | Overlap: a picture or card crossing into the next band |
| PO-5 | Positioning | Free placement (drag anywhere, Wix-classic style) |
| PD-1 | Per-device | Breakpoints the user can edit at (phone · tablet · desktop …) |
| PD-2 | Per-device | Hide / show a block per device |
| PD-3 | Per-device | Change order per device |
| PD-4 | Per-device | Change size / columns / spacing per device |
| PD-5 | Per-device | A change at one size cascades to smaller sizes unless overridden |
| PD-6 | Per-device | Preview at device sizes before publishing |
| MS-1 | Media sizing | An image fills its box, cropped (cover) or fitted (contain), with a focal point |
| MS-2 | Media sizing | Image keeps its shape while loading (width/height or aspect-ratio) |
| MS-3 | Media sizing | Responsive image files (srcset / sizes), lazy below the fold |
| MS-4 | Media sizing | Video / embed sized by width and proportion |
| MS-5 | Media sizing | Background image / video on a section |
| SE-1 | Semantics | Header / nav / main / aside / section / footer landmarks published |
| SE-2 | Semantics | Heading levels in order (one h1) |
| SE-3 | Semantics | Menus as `nav > ul > li > a` |
| SE-4 | Semantics | The reading order follows the visual order (or is set) |
| AX-1 | Accessibility | Layout survives 200% text / browser text size |
| AX-2 | Accessibility | Focus visible, skip link, keyboard order |
| AX-3 | Accessibility | Reduced motion honoured by layout effects (sticky/parallax) |
| AX-4 | Accessibility | Nothing overflows sideways at 320–360px |
| SD-1 | Speed | Page weight / performance budget, lightweight export |
| SD-2 | Speed | Lazy loading and no layout shift (CLS) |
| ED-1 | Editing | Drag and drop to add / move blocks; undo / redo |
| ED-2 | Editing | Select parent / child, a layers (navigator) tree |
| ED-3 | Editing | Copy / paste / duplicate a block and its style |
| ED-4 | Editing | Layout presets (ready-made sections and layouts) |
| ED-5 | Editing | Guides / rulers / snapping while placing |
| ED-6 | Editing | A check that warns about layout problems (overflow, cramped columns) |
