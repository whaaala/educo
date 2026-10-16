---
title: Our builder — what the code claims, per capability (BATCH RX-3, step 3a)
---

# Our builder — what the CODE claims (BATCH RX-3 step 3a, read at `3939f90`, 2026-10-16)

**A claim, not a measurement.** Read from the code only; every row is then MEASURED through the UI, headed, on a fresh
production build (`03-ours-measured.md`), and where the two disagree the measurement wins. Totals as claimed, counted from the
table below (75 rows): 45 HAS · 24 PARTLY · 6 GAP (RX3-4: an earlier "41 · 31 · 9" was not counted); engine-only (RULE UI gaps): GR-2, SZ-4, SZ-5, MS-3, AX-1, AX-4.

Keys: BI `components/website/box/BoxInspector.tsx` · BC `BoxCanvas.tsx` · BP `BlocksPanel.tsx` · GLM `GridLayoutMenu.tsx` ·
PGP `PageGridPanel.tsx` · PC `PageCheck.tsx` · UI `ui.tsx` · PG `app/website/box-demo/page.tsx` · BM `lib/box-model.ts` ·
BX `lib/box-export.ts` · SEM `lib/semantics.ts` · PR `lib/box-presets.ts` · BS `lib/box-site.ts`. Per-screen storage: every
patch goes to the edited screen's override except content keys (`patchAt`, PG:722-729). Device chips: "Mobile (375px)" …
"Full width" (PG:77-83). Inspector tabs "Design" · "Content" · "Per-device" (BI:681).

**`css-layout/06-builder-today.md` is out of date in seven places** (RX3-3): Advanced CSS per screen now published
(`overridesByRung` BX:351) · "Position in row" per screen (BM:2898) · the container's "Line up (down)" label in a row / grid
(BI:1055) · the grid cell's "Line up (across)" clears the nine squares (BI:1096) · Width has "½" / "⅓" (BI:214) · typed px →
rem (`typedLength` BM:4409) · "Show the whole picture" writes rem (BI:1479).

| ID | Claim | UI entry point (labels, file:line) | Export evidence | Notes |
|---|---|---|---|---|
| PS-1 | HAS | Design → "Meaning" → "What is this block?" — "Page header" / "Main content" / "Page footer" (BI:689-695, SEM:28-34) | automatic `<main class="eu-main">` (BX:591-594); tag from `sem.tag` (BX:533) | header / footer tagged by hand, main automatic |
| PS-2 | GAP | none; Page settings "Duplicate" copies a page with no link (PG:1323, BS:92) | each page its own tree (BX:840-849) | no shared header / footer |
| PS-3 | HAS | "Side by side" + edge drag, or Grid → "Sidebar left · 4 · 8" (PR:112-113); "Meaning" → "Sidebar" | `<aside>` (BX:533) | stacks on a phone; no fixed width (RC-3) |
| PS-4 | PARTLY | "Add page" · page tabs · "Page settings" (PG:1309-1314); Link → "…or jump to a page" (BI:1454) | one HTML per page (BX:745, 836); `page:` links (BX:109); prefetch (BX:925) | the menu copied by hand onto every page |
| PS-5 | GAP | none | — | no symbols / global sections / templates |
| SB-1 | HAS | "Add a band" (PG:1377); "Move up" / "Move down" (BC:4269); ⋮ "Move to top" / "Move to bottom" / "Delete"; ↑ ↓ Del | root children → sections (BX:589) | — |
| SB-2 | HAS | "Arrange" → "Content width": "Edge to edge" / "Centred column" (BI:907-910) | `eu-band--contained` (BM:2038, BX:586) | every screen (BI:911) |
| SB-3 | HAS | "Screen height": "Fit content" / "Half screen" / "Full screen" (BI:922-925); "Band height" (BI:1342); Size → "Height" (BI:1204) | `min-height` svh (BM:6648) | a floor |
| SB-4 | HAS | "Direction" "Top-to-bottom" → "Position blocks" Start / Center / End / Spread out / Even gaps (BI:1047-1049); nine squares (BI:1117) | `justify-content` (BM:3081, 6109) | — |
| SB-5 | PARTLY | "Edge shape" Slope / Curve, "Edge depth" (BI:935-957) | `clip-path` (BM:7660) | no wave; no band overlapping the next (no negative margin) |
| RC-1 | HAS | "Side by side" (BP:79); Grid sweep (GLM:37); "Add a block inside this one" (BC:4251) | flex row / grid repeat (BM:6046, 6104) | — |
| RC-2 | HAS | edge drag "8 of 12 · phone 4 of 6" (BC:1029); Width Fit / Full / ½ / ⅓ / Custom (BI:214); "From line" / "To line" | `flex-basis` (BM:4941); tracks (BM:5584) | per screen |
| RC-3 | PARTLY | Width → "Custom" rem (BI:215) | flex-basis in a nested row | on a page row "a fixed width (rem) is drawn as an equal share for now" (BI:216) → LE-3 |
| RC-4 | HAS | automatic; "Order" per device (BI:1136) | mobile-first `@media` (BX:636); 10rem floor (BM:3684) | `order` can split visual and reading order (SE-4) |
| RC-5 | HAS | "Space between blocks" / "Space across" / "Space down" (BI:1056-1066); page grid gaps (PGP:135) | `gap` (BM:5148) | per screen |
| RC-6 | HAS | "Add inside" (BC:4299, BI:646, BP:279) | recursive (BX:590) | any depth, container queries |
| GR-1 | HAS | "Grid" → "Choose a layout"; "Columns" Halves … Twelve; "Columns in the row" 1–12 (BI:989-1002) | `repeat(N)` (BM:6046); `gridQueryCss` (BM:3595) | re-cut only at Desktop |
| GR-2 | PARTLY (engine-only) | no minimum-card-width control | `CELL_MIN_REM = 12` (BM:3245) | RULE UI gap |
| GR-3 | HAS | "Columns wide" / "Rows tall" (BI:1074-1086); "Rows tall" on page rows (BI:1167) | `span n` | hidden in masonry |
| GR-4 | HAS | "Start at column" / "Start at row"; "From line" / "To line" / "Whole line" / "To the last line"; "Layout guides" | `grid-column` (lib/page-grid.ts:84) | — |
| GR-5 | HAS | "Row heights": "Even" / "Follow the picture"; "Measure on the page" (BI:1018-1031) | `grid-auto-rows` + script (BM:6090, BX:600) | stacks on a phone |
| GR-6 | GAP | none | `align-items: stretch` only | no subgrid (AC-36) |
| FL-1 | HAS | "Stack" (BP:78) | `flex-direction: column` | — |
| FL-2 | HAS | "Let blocks wrap to a new line" (BI:1050) | `flex-wrap` | `align-content` fixed at stretch (BM:6136) |
| FL-3 | GAP | none | no `float` | AC-8 |
| FL-4 | GAP | none (Advanced CSS only) | no `column-count` | AC-19 |
| FL-5 | HAS | "Placement" "Floating" (BI:725); Alt+F; "Send to back" … "Bring to front" (BI:744-749), Ctrl+[ ] ; "Tint over background" | absolute + z-index (BX:438) | order every screen; floats return to the flow on a phone |
| SZ-1 | HAS | Width Fit / Full / ½ / ⅓ / Custom | `flexForWidth` | per screen |
| SZ-2 | HAS | "Height" field; "Screen height"; bottom-edge drag; "At least rows tall" | `height` / `min-height` | no named "Fill" height |
| SZ-3 | PARTLY | min height only | engine floors (BX:432) | no min/max width, no max height |
| SZ-4 | PARTLY (engine-only) | images: "Show the whole picture"; Video "16:9" preset = `315px` (PR:68) | `aspect-ratio` on images (BM:4452) | no ratio control (AC-34); RX3-2 |
| SZ-5 | PARTLY (engine-only value) | "Centred column"; Page grid "Side space (padding)" (PGP:172) | `--eu-measure` (lib/educo-ui/layout.ts:92) | the width is fixed in config → LE-3 (AC-9) |
| SZ-6 | HAS (engine) | "Base size (px)" (PG:1288) | `--box-u` clamp (BM:5014); em breakpoints | — |
| SP-1 | HAS | "Inner spacing" + Top / Right / Bottom / Left (BI:1244); canvas handles (BC:591) | `paddingCSS` | Button: none (BI:1244) |
| SP-2 | PARTLY | "Outer spacing" four sides (BI:1245); canvas handles | `marginCSS` | no negative margin (AC-10) |
| SP-3 | HAS | gap controls | `gapCSS` | — |
| SP-4 | PARTLY | canvas handles step on the scale (BM:5430) | — | sliders take free numbers |
| SP-5 | HAS | handles; Shift / Alt / dbl-click / keys (BC:536-667) | editor only | — |
| AL-1 | HAS | "Line up (across)" / "(down)" Fill / Start / Center / End (BI:1055); grid "Position blocks" (BI:1010) | `align-items` / `justify-*` | — |
| AL-2 | PARTLY | "Spread out" / "Even gaps"; "Position in row" → "Spread" | `space-between` / `-around` | no `space-evenly`; wrapped lines not distributable; not on a grid (AC-25 → LE-4) |
| AL-3 | HAS | nine squares (BI:1117); cell "Line up (across)" | `placeCSS` (BM:7693) | no single-block stretch / baseline (AC-27 → LE-4) |
| AL-4 | PARTLY | "Align left / center / right" (BI:588) | `text-align` | no justify |
| AL-5 | GAP | none | no `baseline` | AC-25 |
| PO-1 | HAS | "Stays put while scrolling" → "Sticks when reached", "Held against", "Distance from the edge", "When it takes hold" (BI:792-832) | `position: sticky` (BM:7026) | per screen |
| PO-2 | HAS | "Floats on screen", corners ↖ ↗ ↙ ↘, "Keep its space instead" (BI:801-880) | `position: fixed` (BM:7286) | — |
| PO-3 | HAS | "Floating", "Left %" / "Top %" (BI:739); "Drag to move" | absolute % | left / top only; flow on a phone |
| PO-4 | PARTLY | only by dragging a Floating block past its parent | absolute + overflow visible | no "overlap the next band" (AC-10) |
| PO-5 | PARTLY | Floating + drag, snapping guides (BC:1848) | absolute % | inside the parent only |
| PD-1 | PARTLY | device chips; banner "Editing <screen> — size & layout only change here…" (BI:653) | `@media` em | the breakpoints fixed in config (by design, rule 18) |
| PD-2 | HAS | "Per-device" → "Hidden everywhere" / "Hidden on <screen>" (BI:1941); "Show hidden blocks" | `display:none` (BX:452) | — |
| PD-3 | HAS | device → "Order" (BI:1136) | `order` per `@media` | — |
| PD-4 | HAS | any control with a chip selected; "Reset <screen> changes to default" (BI:654) | `diffStyle` (BX:510) | not per screen: Floating · Front/back · Content width · re-cutting columns |
| PD-5 | HAS | automatic | `RUNG_CASCADE` (BM:177) | Wide inherits Desktop |
| PD-6 | HAS | "Preview" → screen size, width, height, zoom, rotate (PG:1006-1058) | real export (BX:794) | — |
| MS-1 | PARTLY | image always cover; "Show the whole picture"; "Fill the block's height"; backgrounds Fit / Position (BI:1364) | `object-fit: cover` (BX:166) | no contain / focal point for an image |
| MS-2 | HAS | automatic | `width`/`height` + `aspect-ratio` | — |
| MS-3 | HAS (srcset engine-only) | "Load straight away" (BI:1471) | `loading`, `srcset` 480/960, `sizes="auto, 100vw"` (BX:995-1013) | `sizes` not from the layout (AC-22 → LE-5) |
| MS-4 | PARTLY | "Video" → "Video link"; "Height"; presets in px | `height: …||315px` (BX:168) | LE-1; RX3-2 |
| MS-5 | PARTLY | "Background" library / upload / Fit / Position / Repeat / "Fixed (parallax scroll)" / tint (BI:1337-1405) | `background-*` | no background video (AC-17) |
| SE-1 | HAS | "What is this block?" header / menu / main / section / article / sidebar / footer / list (SEM:26-38) | real tags + `aria-label` | — |
| SE-2 | HAS | "Heading level" Automatic / Level 1 … (BI:712); Page check "Make it level N" | `<h1-6>` | — |
| SE-3 | PARTLY | "Menu" with a "List" of "Link" blocks inside | `nav > ul > li` | not automatic → LE-2 |
| SE-4 | PARTLY | tree order via Move up / down / left / right | DOM order | `order` can split visual / reading order with no warning |
| AX-1 | HAS (engine) | "Base size (px)" | rem-floored units | — |
| AX-2 | HAS | automatic | skip link, `#main`, `:focus-visible` | — |
| AX-3 | PARTLY | "Entrance", pager auto-move | reduced-motion rules (lib/educo-ui/base.ts:145) | "Fixed (parallax scroll)" has no reduced-motion check (RX3-1) |
| AX-4 | HAS (engine) | Page check "Add space at the sides" | `max-width:100%`, `overflow-x: clip` | — |
| SD-1 | HAS (engine) | "Export" → site.zip | shared CSS, per-page component CSS, self-hosted fonts | no budget readout in the UI (page-weight.js is a test tool) |
| SD-2 | HAS | "Load straight away" | lazy + width/height | — |
| ED-1 | HAS | palette tiles, "Drag to move", long press, Undo / Redo, B, / | — | — |
| ED-2 | PARTLY | click inside, Escape out, marquee, "Editing: <type>" | — | no layers tree, no breadcrumb |
| ED-3 | PARTLY | Duplicate / Copy / Cut / Paste (Ctrl+D/C/X/V) | — | no copy-style / paste-style |
| ED-4 | PARTLY | "Choose a layout" + uneven splits; Hero / Rotating hero / Gallery / Slider; Card / Outline / Tinted | ordinary trees | no section / page library |
| ED-5 | HAS | "Layout guides" (Shift+G), snapping (Shift half-lines, Alt free), float guides | editor only | no rulers |
| ED-6 | PARTLY | "Page check" + badge; words-at-edge, words-too-tight; Inspector warnings | — | no overflow / cramped-column check outside page rows (S-3 → LE-1) |
