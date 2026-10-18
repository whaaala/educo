---
title: Our builder, measured through the UI (BATCH RX-3, step 3b)
---

# Our builder: what a person can really do (BATCH RX-3 step 3b, 2026-10-16)

**Run label: HEADED UAT.** Every state was built through the UI (RULE Y): palette tiles clicked or dragged, blocks
selected, Inspector controls used. `localStorage` was only **read**, to report what got stored. Each row was then read in
the real **Preview**, the iframe of the export, as computed CSS and elements. The per-device rows (RC-4, PD-\*, GR-1,
AX-4, PS-3, SE-4) were swept across all 55 widths of `scripts/uat/screens.js`. For a few rows the published site itself
was used: Export, then `page-weight.js` serving the zip, then a fresh browser.

- **Build:** `FRESH: port 3100 serves build HPjv8Hqf8J3Z-BPEFiMSQ, and no source is newer` (`node scripts/check-fresh-build.js`).
- **Script:** `scripts/uat/uat-rx3-headed.js` runs six slices A–F, one headed Chromium window each. Screenshots are in
  `scripts/uat/rx3/`; run 1 is kept in `scripts/uat/rx3/run1/`. Logs are `scripts/uat/logs/rx3-run1.out` … `rx3-run6.out`.
- **Windows used:**
  - Runs 1 and 2: six headed windows in parallel, A–F.
  - Run 3: three windows (A, C, F), re-running the slices whose probes had harness errors.
  - Runs 4–6: one window (C).
  - Four single-window follow-ups: `rx3/recon.js`, `rx3/probe-sbs.js`, `rx3/probe-followup.js`, `rx3/probe-followup2.js`.
  - Free memory was 3.5–4.9 GB. No window crashed. No page errors or console errors were logged in any run.
- **Harness errors that were mine, not the product's, and were fixed before the result was taken:**
  - I typed px values into side fields that take rem.
  - I picked the row *band* instead of the Side-by-side row.
  - The "+" next to the page tabs adds a page at once. I expected a dialog.
  - Following a link in the Preview moved the editor to that page.
- **Measurement caveat (follow-up 2):** in the 55-width sweeps, the widths 599 / 1199 / 1599 can be drawn up to about
  15 px wider. That is how the window is resized around the Preview. The rung edges were therefore re-measured at exact
  page widths. Phone overrides stop at 599 and are gone at 600. Laptop overrides stop at 1199. Wide overrides start at
  1600. These are correct.

**Totals, the 75 shared rows: 44 HAS · 24 PARTLY · 7 GAP** (claimed 45 · 24 · 6). Three rows disagree with the code
claim: **SB-4** (HAS → PARTLY), **PD-3** (HAS → GAP) and **SP-2** (PARTLY → HAS).
**The 12 matrix rows** (no claim): 7 HAS · 3 PARTLY · 2 GAP. **All 87 rows: 51 HAS · 27 PARTLY · 9 GAP.**

## The shared rows (02-ours-code.md)

| ID | Code claim | MEASURED | Evidence (what was seen; screenshot in `scripts/uat/rx3/`) | Agrees? |
|---|---|---|---|---|
| PS-1 | HAS | **HAS** | Meaning → "Page header" / "Page footer" set. Preview landmarks are `header, main, footer`. `main.eu-main` holds the middle band and not the header. (PS-1-editor, PS-1-preview) | yes |
| PS-2 | GAP | **GAP** | Page settings → Duplicate, then the header text was edited on the copy. Stored: `Home: Header ONE · Home copy: Header TWO`. Nothing is shared. | yes |
| PS-3 | HAS | **HAS** | Grid → "Sidebar left · 4 · 8" gives 2 cells (spans 4/8). Meaning → Sidebar exports `<aside>`. Stacked at 320–599; beside at 33 % from 600 to 5120. (PS-3-preview-1280 / -375) | yes |
| PS-4 | PARTLY | **PARTLY** | The "+" adds an empty "Page 2" at once: no name, no header, no dialog. Link → "…or jump to a page" stores `page:…` and exports `href="page-2.html"`. Clicking it in the Preview opens Page 2. The menu still has to be copied by hand. | yes |
| PS-5 | GAP | **GAP** | Page settings, the block ⋮ menu (Float on top · Move · Duplicate · Copy · Cut · Paste · Delete) and the palette were searched. No symbol, global section, saved section or template. | yes |
| SB-1 | HAS | **HAS** | "Add a band" ×2: root children 0 → 1 → 2. Toolbar "Move up": index 1 → 0. ⋮ "Move to bottom" works ("Move to top" is disabled on the first band). Delete: 2 → 1. | yes |
| SB-2 | HAS | **HAS** | "Centred column" adds `eu-band--contained`. The column starts at 352 px at 1920 and at 672 px at 2560 (a 76rem column), and is full width at 375. (SB-2-preview-1920) | yes |
| SB-3 | HAS | **HAS** | "Full screen" stores `screenHeight:"full"`. Preview min-height equals the window at 375×667, 1280×800 and 1920×1080. "Band height" slider is present. | yes |
| SB-4 | HAS | **PARTLY** | Direction Top-to-bottom; "Position blocks" offers Start / Center / End / Spread out / Even gaps. The CSS is emitted (`justify-content: flex-end` / `space-between`), but the blocks stay at the top: 0 px above the first, 745 px below the last. The **last block carries `flex-grow: 1`**. Same on a fresh, non-centred band (SB-4b), on the canvas and in the Preview. (SB-4b-editor, SB-4b-preview) | **no**: the control does nothing in a Stack band (Bug 1) |
| SB-5 | PARTLY | **PARTLY** | Edge shapes: Straight / Slope right / Slope left / Curve out / Curve in, with no wave. Curve out + depth 20 gives a `clip-path: polygon(…)`. A typed outer spacing of −2.5 (rem) lands on the block (margin-bottom −45.6 px). The band's margin stays 0, so the band does not overlap the next one. | yes |
| RC-1 | HAS | **HAS** | The "Side by side" tile makes an **empty** row. The toolbar "+" → Stack adds blocks. Preview: `flex-direction: row`, both on one line. (probe-sbs.js) | yes |
| RC-2 | HAS | **HAS** | A right-edge drag shows "6 of 12 · phone 3 of 6" live and stores 50 %. Width "½" stores 50 %. Preview at 1280: 640 / 640 / 427 px. (RC-2-drag-label) | yes |
| RC-3 | PARTLY | **PARTLY** | Custom "12rem" on a page-row column stores 12rem. The Inspector says "drawn as an equal share for now". Drawn at 188 / 384 / 640 / 960 px at 375 / 768 / 1280 / 1920, never 192 px. | yes |
| RC-4 | HAS | **HAS** | An untouched row of three (made by dropping beside) is 3 lines at 320–619 and 1 line from 692 up. No sideways scroll at any of the 55 widths. The "Order" field is offered, but see PD-3. (RC-4-preview-375 / -768) | yes (stacking) |
| RC-5 | HAS | **HAS** | "Space between blocks" 32 on a row stores `gap:32`. Exports `gap: calc(var(--box-u) * 3.2)`, which is 36.48 px at 1280. | yes |
| RC-6 | HAS | **HAS** | A Stack band, then "Add a block inside", then a Stack dropped in twice, then a Text: 4 levels. Exported each inside the one before. | yes |
| GR-1 | HAS | **HAS** | Grid "4 across, 2 down" makes 8 cells. "Columns" offers Halves … Twelve, and there is a "Columns in the row" slider. Sweep: 1 track at 320–599, 2 tracks at 600–839, 12 tracks (2 rows) at 840–5120. | yes |
| GR-2 | PARTLY (engine-only) | **PARTLY** | Every section of the grid's Inspector was opened. There is no minimum-card-width control. The floor shows only as the track drops in the GR-1 sweep. | yes |
| GR-3 | HAS | **HAS** | "Columns wide" 2 and "Rows tall" 2 store colSpan/rowSpan 2. Preview: `grid-column: span 2`, `grid-row: span 2`. | yes |
| GR-4 | HAS | **HAS** | "Start at column" 3 and "Start at row" 2 export `grid-column-start: 3` and `grid-row-start: 2`. "Layout guides" toggles (aria-pressed true). (GR-4-guides) | yes |
| GR-5 | HAS | **HAS** | "Row heights" Even / Follow the picture: `grid-auto-rows` goes from `minmax(min-content,1fr)` to `minmax(8px,auto)` with 8 px tracks. "Measure on the page" adds the `__euMasonry` script. | yes |
| GR-6 | GAP | **GAP** | A cell's Inspector was opened in full. There is no subgrid or "share the parent's columns". | yes |
| FL-1 | HAS | **HAS** | A Stack exports `display:flex; flex-direction:column`. | yes |
| FL-2 | HAS | **HAS** | "Let blocks wrap to a new line" exports `flex-wrap: wrap`. `align-content` is fixed at `stretch`. | yes |
| FL-3 | GAP | **GAP** | No wrap-text or float control on an Image. Typing `float: left` into Advanced CSS exports it, but it has no effect inside a flex column. | yes |
| FL-4 | GAP | **GAP** | No text-columns control. Advanced CSS `column-count: 2` exports on a `display:flex` block. | yes |
| FL-5 | HAS | **HAS** | Placement → Floating exports `position:absolute`. "Bring to front" moves z 1 → 2 (Preview `z-index:2`). At 375 the block returns to the flow (`relative`). Alt+F on a selected Text switches Placement to Floating (follow-up 2). (FL-5-editor, FL-5-preview-375) | yes |
| SZ-1 | HAS | **HAS** | Width ½ gives 640 px in a 1280 band. Custom 10rem gives 160 px. Fit / Full / ½ / ⅓ / Custom are offered. | yes |
| SZ-2 | HAS | **HAS** | Height "12rem" gives 192 px in the Preview. A bottom-edge drag of +60 takes the canvas height from 20 to 80 px and stores `minHeight`. (SZ-2-editor) | yes |
| SZ-3 | PARTLY | **PARTLY** | The Size section has Width, Height, "At least rows tall" and "Trim to size". No min/max width and no max height. | yes |
| SZ-4 | PARTLY (engine-only) | **PARTLY** | No aspect-ratio control on an Image or a Video. The Video "16:9" preset stores `height:315px` (see RX3-2). | yes |
| SZ-5 | PARTLY (engine-only) | **PARTLY** | "Centred column" is fixed at `--eu-measure: 76rem`. Page grid → "Side space (padding)" 48 gives 96 px of band padding at 1280. No control for the column's own width. (SZ-5-page-grid) | yes |
| SZ-6 | HAS (engine) | **HAS** | "Base size (px)" 10 → 14 changes `--box-u` from `clamp(0.4375rem, 0.3125rem+0.5cqw, 0.875rem)` to `clamp(0.6125rem, …, 1.225rem)`. A padded block goes from 27.36 to 38.30 px. Text size is unchanged, because the type scale is not tied to Base size. | yes |
| SP-1 | HAS | **HAS** | "Inner spacing" 24 gives 27.36 px a side. Typing 2.5 into the "Top" field gives 45.6 px. Exported `calc(var(--box-u) * n)`. A Button has no Inner spacing. The side fields are **rem with no unit shown** (Bug 5). | yes |
| SP-2 | PARTLY | **HAS** | Typing −1.5 into "Outer spacing top" (a field with `min=0`) stores −24 and exports `margin-top:-27.36px`. A negative margin is reachable from the UI. | **no**: negative margin exists, through a side field whose min says it should not |
| SP-3 | HAS | **HAS** | A Stack's "Space between blocks" 20 gives `row-gap 22.8px`. | yes |
| SP-4 | PARTLY | **PARTLY** | The canvas handle steps on the scale (arrow key 0 → 4 → 8). The fields take free values: 0.8125 rem was stored as 13. | yes |
| SP-5 | HAS | **HAS** | A selected Text shows 8 handles ("Inner space, top" … "Outer space, left", each labelled in rem). Double-clicking one sets it to 0. (SP-5-handles) | yes |
| AL-1 | HAS | **HAS** | "Line up (across)" offers Fill / Start / Center / End. Center exports `align-items:center`. | yes |
| AL-2 | PARTLY | **PARTLY** | A row offers Start / Center / End / Spread out / Even gaps (exports `space-around`). No "evenly". A grid offers only Fill the cell / Left / Center / Right. | yes |
| AL-3 | HAS | **HAS** | In a half-screen band, a Text set to "Bottom right" sits 0 px from the bottom and 55 px from the right (the band's side padding). | yes |
| AL-4 | PARTLY | **PARTLY** | Align left / center / right; "center" reaches the inner `<p>` (`text-align:center`). There is no Justify. | yes |
| AL-5 | GAP | **GAP** | "Line up" offers Fill / Start / Center / End. No baseline. | yes |
| PO-1 | HAS | **HAS** | "Sticks when reached" offers "Held against" Top / Bottom and "Distance from the edge". The wrapper is exported `position:sticky`. Scrolled 300 px into the band, it holds at top 0. (PO-1-preview-scrolled) | yes |
| PO-2 | HAS | **HAS** | "Floats on screen" offers 6 corner choices and "Keep its space instead". Exports `position:fixed`. It stays at top 0 at scroll 900 and at 1800. | yes |
| PO-3 | HAS | **HAS** | "Left %" 30 and "Top %" 20 export `left:30%; top:20%`. Measured 30 % / 20 % of the band. | yes |
| PO-4 | PARTLY | **PARTLY** | Typing "Top %" 110 draws it at 902–929, below its 0–820 band (overflow visible). It can hang over the next band, but only by typing a number past 100. No "overlap the next band" control. (PO-4-preview) | yes |
| PO-5 | PARTLY | **PARTLY** | "Drag to move" shows a guide line while dragging and stores left 50 / top 27.8. Dragged 720 px down, it is clamped to top 98.4 % inside the same band. | yes |
| PD-1 | PARTLY | **PARTLY** | The Mobile chip shows a 375 px canvas and the banner "Editing Phone — size & layout only change here…". The breakpoints cannot be edited (config, by design). (PD-1-mobile) | yes |
| PD-2 | HAS | **HAS** | "Hidden on mobile" is hidden at 320–599 and shown from 600 (exact edge: follow-up 2). | yes |
| PD-3 | HAS | **GAP** | Mobile chip → "Order" −1 stores `responsive.phone.order:-1`. The base "Order" 5 stores and exports `order:5`. But blocks in a band (`onPageGrid`) are **drawn in tree order at all 55 widths**, with both the override and the base value. | **no**: Order has no visible effect (Bug 2) |
| PD-4 | HAS | **HAS** | Mobile chip → Inner spacing 40 stores `{phone:{padding:40}}`: 28 px at 320–598, 0 from 600. "Reset phone changes to default" clears it. Floating is still offered at Mobile. | yes |
| PD-5 | HAS | **HAS** | A Laptop override applies below 1200 and cascades down to the phone. A Wide override applies only from 1600. The Desktop chip edits the base, which every width inherits. | yes |
| PD-6 | HAS | **HAS** | Preview screen size has 70 entries. A phone gives a 320×568 page. Rotate gives 568×320. A typed width of 500 gives 500×320. Zoom offers Fit / 50–200 %. (PD-6-preset, PD-6-rotated) | yes |
| MS-1 | PARTLY | **PARTLY** | An image is always `object-fit: cover`. At Height 10rem it is cropped to 1280×160. "Show the whole picture" puts it back to 1280×853 and ignores the Height. No focal point and no contain. | yes |
| MS-2 | HAS | **HAS** | `width="1200" height="800"`, `max-width:100%`, drawn 375 wide at 375. | yes |
| MS-3 | HAS (srcset engine-only) | **HAS** | The export has `srcset` 480/960/full. `sizes="100vw"` for the eager image and `"auto, 100vw"` for lazy. `loading=lazy` is the default; "Load straight away" gives `eager`. There is no `fetchpriority`. The inline Preview uses a `data:` URL without srcset. | yes |
| MS-4 | PARTLY | **PARTLY** | "Video link", a Height field, and the presets 16:9 / Portrait / Rounded. No ratio control. See RX3-2. | yes |
| MS-5 | PARTLY | **PARTLY** | Upload, Fit (cover / contain / original / stretch), Position (9), Repeat (6), Fixed and Tint all reach the Preview (`contain`, `50% 0%`, `repeat`, `fixed`). No background video. (MS-5-preview) | yes |
| SE-1 | HAS | **HAS** | "What is this block?" offers 13 meanings. Exported: Article → `article`, Sidebar → `aside`, Menu → `nav`, List → `ul`. **Section → `div`** when the section has no heading; Page check reports this under "Fixed for you: A section needs a heading". | yes |
| SE-2 | HAS | **HAS** | "Heading level" offers Automatic and 1–6. With an H1 on the page, Level 3 exports `<h3>` (follow-up 1). As the only heading on a page, Level 3 is promoted to `<h1>` and Page check reports it. | yes |
| SE-3 | PARTLY | **PARTLY** | Menu > Stack (List) > Link exports `nav > div > ul > li > div > a`. Menu > Link with no List gives no `ul`. | yes |
| SE-4 | PARTLY | **PARTLY** | No warning about order anywhere: Inspector and Page check. Order itself does nothing (PD-3), so the visual and reading order never split here. | yes (different reason) |
| AX-1 | HAS (engine) | **HAS** | `--box-u` is rem-floored. Base size scales spacing (SZ-6). | yes |
| AX-2 | HAS | **HAS** | The first Tab reaches the "Skip to content" link `a.eu-skip[href="#main"]` with a 2 px solid outline. The next Tab reaches a link with a 2 px solid `rgb(79,70,229)` outline. (AX-2-preview-tab1 / -tab2) | yes |
| AX-3 | PARTLY | **PARTLY** | "Fade in entrance" plays `eu-reveal-fade 0.32s`. Under `prefers-reduced-motion: reduce` there is no animation, so the entrance is honoured. Parallax is not (RX3-1). | yes |
| AX-4 | HAS (engine) | **HAS** | No sideways scroll at all 55 widths. `overflow-x: clip` on html and body. Page check offers "Add space at the sides". | yes |
| SD-1 | HAS (engine) | **HAS** | Export → served → weighed at 360. Without a video: HTML+CSS+JS **5.1 KB**, first view **64.4 KB**, Slow 3G paint 4.2 s. With one YouTube video: **993.5 KB / 1,145.8 KB**, both over budget (Bug 7). No weight readout in the editor. | yes |
| SD-2 | HAS | **HAS** | `loading="lazy"` and `width`/`height` by default. | yes |
| ED-1 | HAS | **HAS** | Click and drag add blocks (9 → 13). Ctrl+Z → 11, Ctrl+Y → 13. "B" opens the blocks panel. "/" focuses "Search blocks". (ED-1-shortcuts) | yes |
| ED-2 | PARTLY | **PARTLY** | No layers tree and no breadcrumb. The Inspector shows "Editing: Text". A marquee from the canvas corner selected nothing in this probe, so marquee is not confirmed. | yes |
| ED-3 | PARTLY | **PARTLY** | On a selected Divider: Ctrl+D 17 → 18, Ctrl+C / Ctrl+V → 19. The ⋮ menu has Duplicate / Copy / Cut / Paste. No copy-style or paste-style. | yes |
| ED-4 | PARTLY | **PARTLY** | 8 uneven grid splits. Hero and Rotating hero tiles. Plain / Card / Outline / Tinted styles. No section or page library: "+ page" adds an empty page. | yes |
| ED-5 | HAS | **HAS** | Shift+G toggles guides false → true → false. No rulers. (ED-5-guides) | yes |
| ED-6 | PARTLY | **PARTLY** | "Page check, 2 to do" opens Needs your words (picture description, words at the edge) and Fixed for you. There is no overflow check. | yes |
| ED-7 | PARTLY | **PARTLY** | (row added 2026-10-18, LE14-1) Only the whole block's "Reset phone changes". After BATCH LE-14, HEADED (`uat-le14-headed.js` H5): "Set here" beside Rounded corners and See-through on the phone, "From Tablet portrait" for a tablet value, its reset one undo step, the Per-device list. | yes |
| ED-12 | PARTLY | **PARTLY** | (row added 2026-10-18, LE14-1) Measured through the UI (`probe-le14-group.js`): Ctrl+G made Text · [floating group, gap 12] · Heading · Heading, each Heading 100 %. After BATCH LE-14, HEADED H1: Heading · Heading · Text kept, every block within 1 px, Ctrl+Shift+G gives back the same tree. | yes |
| ED-13 | PARTLY | **PARTLY** | (row added 2026-10-18, LE14-1) Marquee only. After BATCH LE-14, HEADED H2: Shift-click adds and takes out, two Headings in a Stack picked without it, "Rounded corners: Mixed", ↓ moves both. | yes |

## The matrix rows (04-matrix.md: no code claim)

| ID | MEASURED | Evidence |
|---|---|---|
| PS-6 | **PARTLY** | A two-row header (a "Page header" band holding a utility Stack and a main Stack) can be built. "Sticks when reached" on the main row only holds inside its own header band: scrolled 800 px, util −757 and main −733, so it is gone. Making the whole header sticky works (util −24, main 0), but then both rows stick. You cannot keep just one row. (PS-6-preview-row-sticky, PS-6-preview-header-sticky) |
| PS-9 | **GAP** | A short page with a "Page footer" band: the footer ends at 48 px of a 667 px window at 375 and at 55 of 800 at 1280. It floats mid-screen, and there is no control to keep it at the bottom. (PS-9-preview-375 / -1280) |
| PS-13 | **HAS** | Content → "Bookmark name" "Contact us" is stored as `contact-us` and exported as `id="contact-us"`. A Link typed `#contact-us` exports `href="#contact-us"`. On the exported site the click sets `#target` in follow-up 1, and in E the jump scrolled the target to the top. |
| SB-6 | **HAS** | An inset section works both ways: (a) a Centred-column band holding a Stack with "Card style"; (b) the band itself set to Centred column + Card style. Both draw 352–1568 of 1935 at 1920 and 19–356 of 390 at 375, with background, radius 16 px and a shadow. (SB-6-preview-1920) |
| RC-8 | **HAS** | The row's "Line up" Fill / Start / Center / End against a short tinted column beside a tall one. Fill gives the short column 82 px, the same as the tall one (stretch). Start gives 27 px at +0, Center 27 px at +27, End 27 px at +55. (RC-8-preview-fill) |
| SZ-7 | **HAS** | A 950-character paragraph in an Edge-to-edge band. Characters per line: 38 at 375, 64 at 1280, 64 at 1920 and 64 at 2560. The paragraph is capped at `max-width: 716.8px` (44.8 rem). (SZ-7-preview-1920) |
| AX-5 | **GAP** | The export has `scroll-padding-top: 24px` and the target has `scroll-margin-top: 0`. With a sticky header 320 px tall, the #anchor jump puts the target top at 258, **under** the header. Tab focus on a Button far down lands at 282–320, also under it. Neither follows the header's real height. (AX-5-preview-anchor, AX-5-preview-tab) |
| SE-5 | **HAS** | Four unnamed Menu blocks are exported with automatic names `aria-label="Menu 2" … "Menu 5"`. Page check lists them under "Fixed for you". The Meaning section has "Name (read out by screen readers)". The numbering starts at 2 when there is no "Main menu" (Bug 8). |
| SE-6 | **PARTLY** | `<html lang="en">`, with no `dir` and no `[lang]` in the body. There is no language control in Page settings or on a block. |
| SD-3 | **HAS** | A picture hidden on Mobile, exported and opened at 375: the image is `display:none` and `loading=lazy`, and its file was **not** requested. The only image request was the other, visible picture's 480w file. Not tested: a hidden picture that is also "Load straight away" would download. |
| ED-7 | **PARTLY** | At the Tablet chip, Inner spacing 30 and Width ½ were set. There is no per-control "set here / inherited" mark (no aria or title mark, no words). There is only the banner and the "Reset tablet portrait changes to default" link. (ED-7-tablet-inspector) |
| PO-9 | **HAS** | A sticky Text inside a full-screen section holds at top 0 at +200, +500 and +650. At +1000 it leaves with the section's bottom: sticky bottom −27, section bottom −27. It stops at the end of its section. (PO-9-preview-past-section) |

## RX3-1: "Fixed (parallax scroll)" under reduced motion: **BUG CONFIRMED**

- **Probe:** a band, then Background → Upload an image (wide.jpg) → "Fixed (parallax scroll)" ticked.
- **Editor canvas:** `background-attachment: fixed`.
- **Preview, no-preference:** `fixed`.
- **Preview, reduced motion:** after `page.emulateMedia({ reducedMotion: 'reduce' })`, `matchMedia('(prefers-reduced-motion: reduce)').matches` is true, and the block is **still `fixed`**. It is also still `fixed` at 375×667 under reduce.
- **Why:** the export's only reduced-motion rule is
  `.eu-root *, … { animation-duration:.01ms !important; transition-duration:.01ms !important; scroll-behavior:auto !important; }`.
  Nothing resets `background-attachment`.
- **Screenshot:** RX3-1-preview-reduced.

## RX3-2: the Video "16:9" preset: **BUG CONFIRMED**

- **Probe:** Video tile → "16:9" style → Video URL set.
- **Stored:** `{"height":"315px","width":"100%"}`. The Inspector's Height field reads `315px`, a pixel value stored by a preset.
- **Exported rule:** `height:315px`, with no `aspect-ratio`.
- **Canvas:** 375×315 at Mobile, 896×221 drawn at Desktop.

| Preview width | Box drawn | Ratio (16:9 = 1.778) |
|---|---|---|
| 375 | 375×315 | 1.19 |
| 768 | 768×315 | 2.44 |
| 1280 | 1280×315 | 4.06 |
| 1920 | 1920×315 | 6.10 |

The box does not keep 16:9 at any width, and the height is a stored pixel, which breaks rule 16.
Screenshots: RX3-2-editor, RX3-2-preview-375, RX3-2-preview-1280.

## Other bugs found (numbered, with repro)

1. **"Position blocks" does nothing in a Stack band (SB-4).**
   - Repro: add a Stack and drop two Texts into it. Arrange → Full screen → Top-to-bottom → Position blocks "End" (or Spread out).
   - Seen: the blocks stay at the top, on the canvas and in the Preview. The export has `justify-content:flex-end`, but the last block computes `flex-grow:1`, so there is no free space to distribute.
2. **"Order" has no visible effect on blocks in a band (PD-3 / SE-4 / RC-4).**
   - Repro: add a band with three Texts. Mobile chip → select the third → Position → Order −1. Or, at Full width, Order 5 on the second.
   - Seen: stored as `responsive.phone.order:-1` / `order:5`, and `order:5` is computed in the Preview. The blocks are still drawn in tree order at all 55 widths.
   - Likely cause: the blocks sit on the page grid (`onPageGrid:true`) with explicit placement, so `order` is ignored. The control is offered anyway.
3. **RX3-1:** a parallax background ignores `prefers-reduced-motion` (above).
4. **RX3-2:** the Video 16:9 preset is a fixed 315 px height, not a ratio (above).
5. **The spacing side fields are rem with no unit shown, and accept negatives below their `min=0` (SP-1 / SP-2).**
   - Repro: Spacing → set the "Inner spacing" slider (its scale reads like px, 0–96), then type 40 into "Top".
   - Seen: 40 rem is stored (`paddingTop:640`), and the Preview draws 729.6 px of padding.
   - Also: typing −24 into "Outer spacing top" stores −384 (−24 rem) and pulls the block over the one above.
   - The placeholder ("1.5") is the only clue that the unit is rem.
6. **#anchor jumps and Tab focus land under a sticky header (AX-5).**
   - Repro: a sticky Page header; a Bookmark far down; a Link to it in the header.
   - Seen: the target lands 62 px under the header. The export has `scroll-padding-top: 24px`, which is fixed and does not follow the header's height.
7. **One YouTube video blows the weight budget (RULE AF).**
   - Repro: add the Video block with a YouTube link, then Export and open at 360.
   - Seen: HTML + CSS + JS goes from 5.1 KB to 993.5 KB compressed, and the first view from 64.4 KB to 1,145.8 KB. The budgets are 100 / 500 KB.
   - Cause: the player's JavaScript loads on first view. There is no click-to-load facade.
8. **Automatic menu names start at "Menu 2" (SE-5).**
   - Repro: four unnamed Menus in the main content.
   - Seen: `aria-label` "Menu 2", "Menu 3", "Menu 4", "Menu 5". No "Menu 1" or "Main menu" exists. Minor.
9. **Observations, not bugs:**
   - Following a page link inside the Preview switches the editor's active page. After "Exit preview" the editor was on Page 2 (PS-4).
   - The "+" beside the page tabs adds an unnamed empty "Page 2" with no dialog or layouts. `AddPageModal`'s "Choose a layout" templates are not reachable from this builder.
   - "Show the whole picture" overrides a Height set on the image (MS-1).
   - In run 1, Ctrl+V on a selected Text pasted the OS clipboard's words *into* the Text. Clicking a Text puts its caret in it. On a Divider, Ctrl+C / Ctrl+V copied the block.

No crash, no page error, and no console error in any of the six slices across the six runs.
