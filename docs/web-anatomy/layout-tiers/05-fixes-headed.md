---
title: RX-3 fixes, checked headed (U1 … U9)
---

# RX-3 fixes: the HEADED UAT of the checklist U1 … U9 (2026-10-16)

**Run label: HEADED UAT.** Every state was built through the UI: palette tiles, drops, the toolbar "+", Inspector
controls, the page tabs and the editor's own theme switch. `localStorage` was only read, to report what got stored. The
results come from the real Preview (the iframe of the export) and, for U3's weight, from the exported site served and
opened at 360.

- **Build:** `FRESH: port 3100 serves build Ttqp93NuCB3z-r4qmViIK, and no source is newer`.
- **Script:** `scripts/uat/uat-rx3-fixes-headed.js`, six headed windows in parallel (W1 … W6). It reuses the helpers of
  `uat-rx3-headed.js`.
- **Re-check:** `scripts/uat/rx3fix/probe-recheck.js`, one headed window, for the three places where the first pass's
  own measurement was in doubt (U4 at 375, U6's button, U7's Side by side).
- **Screenshots and JSON:** `scripts/uat/rx3fix/`. Log: `scripts/uat/logs/rx3fix-run1.out`.
- **Errors:** no page errors and no console errors in any window. All browsers were closed afterwards.

**Result: 8 PASS · 1 FAIL** (U7, the Side by side half). U6 first failed on my selector and passes on the re-check.

| U | Fix | Result | Measurement | Screenshots (`scripts/uat/rx3fix/`) |
|---|---|---|---|---|
| U1 | RX3-1 | **PASS** | Canvas: `background-attachment` is `fixed`, and `scroll` under emulated `reducedMotion: reduce`. Preview at 375 and 1280: `fixed`, and `scroll` under reduce (`matchMedia` true). | U1-canvas-reduce, U1-preview-1280-reduce |
| U2 | RX3-2 | **PASS** | A new Video stores no height, only `width:100%`. The box is 16:9 at **55 / 55** widths of `screens.js`. Canvas == Preview at the five rungs: 375×210.9, 768×432, 1024×576, 1280×720, 1920×1080. "Portrait" stores `ratio 9 / 16, width 20rem` and draws 320×568.9 (0.563) at 1280 and at 375. A typed Height "20rem" wins: 320 px tall. See bug 2 for the width. | U2-canvas, U2-preview-375, U2-preview-1280, U2-preview-portrait-375 |
| U3 | RX3-9 | **PASS** | Before a click there were **0** requests to `youtube.com/embed`; only the still `i.ytimg.com/…/hqdefault.jpg` loads. The link reads "Play the video" and holds no iframe. A click gives a player `…/embed/aqz-KE-bpKQ?autoplay=1` that **has focus**. Tab reaches the link (2 px solid ring), and Enter gives a playing iframe with focus. Exported page with one YouTube video, at 360: **HTML+CSS+JS 5.8 KB, first view 85 KB** (budgets 100 / 500), Slow-3G paint 4.16 s, CLS 0. Play mark: white triangle on `rgb(15,23,42)` at 0.85 opacity, contrast **17.85** in all four editor themes. | U3-preview-before, U3-preview-after-click, U3-preview-focused, U3-playmark-{Light,Dark,Midnight,Purple} |
| U4 | RX3-7 | **PASS** | Typing "40" into Inner top stores **96** (the field shows 6). Typing "-1.5" into Outer top stores **0**. The caption "Each side in rem · 1rem is 16px at the default text size" is visible, and is the `aria-describedby` of the four fields. Its contrast is the same at 1280 and 375 (re-check: theme set at 1280, then the window narrowed): Light 4.84, Dark 6.48, Midnight 6.8, Purple 8.96. Its size is **9 px** (bug 4). | U4-caption-1280-{theme}, U4-inspector-1280-*, recheck-U4-375-{theme} |
| U5 | RX3-10 | **PASS** | Two body Menus: Page check "Fixed for you" says "Menu 1" and "Menu 2", exported `aria-label="Menu 1"` and `"Menu 2"`. With a Page header holding a Menu, moved to the top: "Main menu" (in the `header`), then "Menu 2" and "Menu 3". | U5-body-menus, U5-with-header |
| U6 | RX3-17/18 | **PASS** (re-check) | Quote: the export says `border:0.188rem solid …`; drawn 3 px, and **6 px** with the Preview root at 200 %. Outline Button: the border is inline on the `<a>` as `border:0.125rem solid #4f46e5`; drawn 2 px, and **4 px** at 200 %. The first pass's "FAIL" came from my CSS search only looking at stylesheet rules. | U6-preview-100, U6-preview-200 |
| U7 | RX3-5 + RX3-19 | **FAIL** (the Side by side half) | **The Stack band passes.** Full screen, Top-to-bottom; space above / between / below at 1280, the same on canvas and Preview: End 765 / 0 / 0, Spread out 0 / 765 / 0, Even gaps 191 / 383 / 191, Center 383 / 0 / 383. It held at **all 55 widths**. **The Side by side fails.** A Text and a Button added with the toolbar "+" are stored `width: 50%` each and drawn 0..640 and 640..1280 of 1280. "End" and "Spread out" therefore move nothing (bug 1). Once both are set to Width "Fit", End moves them to 967..1176 and 1176..1280. | U7-canvas-{End,Spreadout,Evengaps,Center}, U7-preview-*-1280, recheck-U7-sbs-End-as-added, recheck-U7-sbs-End-after-Fit |
| U8 | RX3-6 + RX3-20 | **PASS** | Mobile chip → Order −1 on a band's third Text stores `responsive.phone.order:-1`. Canvas: drawn first at Mobile, back in tree order at Tablet and Desktop. Preview at exact page widths: first at 375 and **599**, back in place at **600**, 768 and 1280. Page row of three with the third first at Laptop, Preview at 1024: drawn left edges 0 / 341 / 683, widths 341 / 342 / 341. These are identical to an untouched twin row, with every margin 0: no gap missing and no extra indent. | U8-canvas-mobile, U8-preview-375, U8-preview-1024-row |
| U9 | RX3-8 | **PASS** | Sticky Page header with Height 20rem, so `scroll-padding-top` is **320px**, its real height. Following the header Link `#far` lands the target at 722 (1280) and 605 (375), below the header bottom of 320. Tab to the Button far down puts it at 749 (1280) and 629 (375), not under the header. | U9-editor, U9-preview-anchor-{1280,375}, U9-preview-tab-{1280,375} |

## New bugs found

1. **RX3-19 is not closed: a Side by side's blocks fill it, so "Position blocks" cannot move them.**
   - Repro: Side by side tile → toolbar "+" → Text, then "+" → Button. Select the row → Arrange → Position blocks "End"
     (or "Spread out").
   - Seen: each block is stored `width: "50%"` and drawn as half the row. End emits `justify-content:flex-end`, but
     nothing moves (Preview 0..640 / 640..1280 of 1280; canvas the same proportions).
   - Workaround measured: set both blocks to Width "Fit" and End then works (967..1176 / 1176..1280).
2. **Switching a Video from "Portrait" back to "16:9" seems to keep Portrait's `width: 20rem`.**
   - Repro: a Video → Portrait → 16:9 → Size → Height "20rem".
   - Seen: the box is **320 × 320 at 1280 and at 375**. It is 320 tall as typed, but also only 320 wide, which is
     Portrait's width.
   - The 16:9 preset patches `height` and `ratio` but not `width`. Not isolated: I did not measure 16:9 alone right after
     Portrait.
3. **The video's still picture has no `width` / `height`.** `page-weight.js` reports "W3 a picture without width /
   height (https://i.ytimg.com/vi/…)". Nothing jumps, because the still is absolutely placed in a box that already has
   its ratio (CLS 0), but the page's own weight check flags it.
4. **The rem caption is 9 px (0.5625rem).** Its contrast passes in all four themes (4.84 … 8.96), but 9 px is far below the
   deck's body-size rule. Minor; a design call.

## Re-check 2 (HEADED UAT, build `TuGd-wFnuAErd3svBhwh0`, FRESH)

Three headed windows ran in parallel (V, C, O) with `scripts/uat/uat-rx3-recheck2-headed.js`. Everything was built
through the UI. I re-ran window O once, alone (`--only=O`), to add the drawn order and the row's top edges to the
measurement. No page errors and no console errors. Screenshots are `scripts/uat/rx3fix/re2-*`; logs are
`scripts/uat/logs/rx3fix-recheck2*.out`.

| Line | Result | Measurement | Screenshots |
|---|---|---|---|
| RX3-23 (bug 2 above) | **PASS** | Video → Portrait → 16:9 stores `width:100%, ratio 16 / 9, height auto`. Canvas and Preview are the same: 375×210.9 at 375 and 1280×720 at 1280, both full width. Then Height "20rem" stores `height:20rem, width:100%`: 375×320 and 1280×320 on canvas and Preview. | re2-16x9-canvas, re2-16x9-preview-375 / -1280, re2-16x9-h20-* |
| RX3-24 (bug 3 above) | **PASS** | The exported still is `<img src="https://i.ytimg.com/vi/…/hqdefault.jpg" width="480" height="360" … loading="lazy">`. `page-weight.js` at 360 reports no findings: HTML+CSS+JS 5.5 KB, first view 84.6 KB, Slow-3G paint 4.12 s, CLS 0. | — |
| RX3-25 (bug 4 above) | **PASS** | The caption is **11px** and keeps the same contrast at editor widths 1280 and 375: Light 4.84, Dark 6.48, Midnight 6.8, Purple 8.96. The theme was set at 1366, then the window narrowed. | re2-caption-{1280,375}-{Light,Dark,Midnight,Purple}, re2-inspector-{1280,375}-Dark |
| RX3-21 | **REPORTED** | See below. | re2-pagecheck-laptop, re2-preview-1024 |

**RX3-21 in detail.** I built a page row of three. The third column holds the unbroken word
"Pneumonoultramicroscopicsilicovolcanoconiosisxxxx…", and has Order −1 at the Laptop chip (stored
`responsive.tabletLandscape.order:-1`).

- **Canvas at Laptop:** the row stacks, and the third column is drawn first (top 88, then 131 and 153).
- **Preview at 1024:** the same order. The third column is at the top with `order:-1`, then "First column", then "Second
  column". Each is 0..1024 wide. Nothing overflows (`scrollWidth` 1024 / 1024) and there is no sideways scroll.
- **Page check at Laptop ("1 to do"):** its only item is "Words on this page touch its left or right edge… Add space at
  the sides". It does not raise a cramped-column or overflow item for the long word, because the row stacks instead.
- **Errors:** none on the page or in the console.

Nothing new was found. All Playwright browsers were closed.

## Re-check 3 (HEADED UAT, build `Q913aojQPJYnj6AHsbr9T`, FRESH)

I ran `uat-rx3-recheck2-headed.js --headed` (three windows: V, C, O) at the same time as `scripts/uat/rx3fix/probe-rx3-28.js`
(one window, run twice: once with the spacing on the inner Stack, once with `ON_BAND=1`). Everything was built through
the UI. No page errors and no console errors. Logs are `scripts/uat/logs/rx3fix-recheck3.out`, `rx3-28.out` and
`rx3-28-band.out`.

### 1 · RX3-23 at every width of `screens.js`

| Line | Result | Measurement |
|---|---|---|
| RX3-23a | **PASS: 0 widths fail** | After Video → Portrait → 16:9, the box is full width and 16:9 at all 55 Preview widths, from 320×180 to 5120×2880. Canvas == Preview at 375 (375×210.9) and at 1280 (1280×720). |
| RX3-23b | **PASS: 0 widths fail** | After Height "20rem", the box is full width and 320 px tall at all 55 widths. Canvas == Preview at 375 and at 1280. |

RX3-24, RX3-25 and RX3-21 ran again in the same pass with the same results as Re-check 2.

### 2 · RX3-28: does a Centred column override the section's own left / right inner spacing?

I built a Stack band set to Arrange → Content width "Centred column". I typed **3** into "Inner spacing left" and
**0.5** into "Inner spacing right". Both fields keep their values, stored as `paddingLeft:48, paddingRight:8`.

| Where the 3 / 0.5 was set | Band | Canvas at Desktop: padding L / R | Preview 1280: padding L / R · text starts at | Preview 1920: padding L / R · text starts at |
|---|---|---|---|---|
| **The band's one section** (the band-level Stack a person selects) | Centred column | **96 / 96 px**, symmetric; the canvas shading shows 96 on both sides | **96 / 96 px** · x = 96 | **352 / 352 px** · x = 352 |
| Same | Edge to edge | 54.72 / 9.12 px | 54.72 / 9.12 px · x = 55 | 67.2 / 11.2 px · x = 67 |
| A Stack **inside** that section | Centred column | 54.72 / 9.12 px | 54.72 / 9.12 px · text 55 px inside it (x = 151) | 67.2 / 11.2 px · x = 419 |
| Same | Edge to edge | 54.72 / 9.12 px | 54.72 / 9.12 px · x = 55 | 67.2 / 11.2 px · x = 67 |

Screenshots in `scripts/uat/rx3fix/`: `re3b-centred-canvas-desktop.png` and `re3b-edge-canvas-desktop.png` (the pair:
symmetric shading against 3 / 0.5), plus `re3b-*-preview-{1280,1920}.png` and `re3-*` for the inner Stack. The Preview
pictures show the top of the page under the Preview bar, so the numbers above are the evidence.

**Verdict: BUG.**

- **The left and right fields are ignored on a Centred column's section.** On the band's one section, the L6-2 rule
  `padding-inline: max(gutter, (100% − measure)/2) !important` replaces the person's left and right inner spacing: 3rem
  and 0.5rem become 96 / 96 px at 1280 and 352 / 352 px at 1920. This happens on the canvas and in the Preview alike.
  The fields still show 3 and 0.5, and the stored values are kept.
- **It works everywhere else.** The same values are honoured at Edge to edge, and on any Stack nested inside the section.
- **A smaller finding:** the honoured values are not the "1rem = 16 px" the new caption promises. 3rem draws 54.72 px at
  1280 and 67.2 px at 1920, and 0.5rem draws 9.12 / 11.2 px, because inner spacing is emitted as
  `calc(var(--box-u) * n)`, a fluid unit. So the caption "Each side in rem · 1rem is 16px at the default text size" is
  only exact where `--box-u` is 1.6 px.

Browsers were closed afterwards (0 Playwright Chromium processes).

## Re-check 4 (HEADED UAT, build `yBaLUS0eawxUhK1Um1xFv`, FRESH, 2026-10-17)

I ran `scripts/uat/rx3fix/probe-rx3-28b.js` in four headed windows in parallel (A, B, C, D). At the same time I re-ran
`probe-rx3-28.js` with `ON_BAND=1` in a fifth window. Everything was built through the UI, including a background
`#dde4ff` on the section so its colour can be seen. No page errors and no console errors. Logs:
`scripts/uat/logs/rx3fix-recheck4.out` and `rx3-28-band-r4.out`. Data: `scripts/uat/rx3fix/results-recheck4.json`.

The windows were:

- **A:** a Centred column, its section with left 3 / right 0.5.
- **B:** the same with no side spacing.
- **C:** Edge to edge with left 3 / right 0.5.
- **D:** the caption.

The check is that **A = B + C**: the centring plus the person's own space, at every width of `screens.js`.

| Line | Result | Measurement |
|---|---|---|
| RX3-28 · Centred column + 3 / 0.5 | **PASS** | A's left and right padding equal B + C within 1 px at **all 55 widths**. The text starts exactly at the left padding, and the colour runs 0 px from both page edges. At 375: 52.84 / 24.84 = (19.25 + 33.6) / (19.25 + 5.6). At 1280: **150.72 / 105.11** = (96 + 54.72) / (96 + 9.12). At 1920: **419.19 / 363.19** = (352 + 67.2) / (352 + 11.2). The canvas at Desktop matches: 150.72 / 105.11, text at 150.7. Canvas == Preview at the five rungs. The original probe agrees: 150.719 / 105.109 at 1280, 419.188 / 363.188 at 1920. |
| RX3-28 · Centred column, no side spacing | **PASS** | Unchanged: 96 / 96 at 1280, 352 / 352 at 1920, 19.25 / 19.25 at 375. The colour is edge to edge. Canvas == Preview at the five rungs. |
| RX3-28 · Edge to edge + 3 / 0.5 | **PASS** | Honoured: 54.72 / 9.12 at 1280, 67.2 / 11.2 at 1920, 33.6 / 5.6 at 375. Canvas == Preview at the five rungs. |
| Caption "Each side in rem, sized for a laptop — it grows a little on wide screens and closes up on a phone" | **PASS** | Visible, 11 px, and the `aria-describedby` of the 4 side fields, at editor widths 1280 and 375. Contrast: Light 4.84 · Dark 6.48 · Midnight 6.8 · Purple 8.96, the same at both widths. |

**Screenshots** in `scripts/uat/rx3fix/`:

- `re4-A-centred-3-0.5-canvas-1280.png`: the shading is now wider on the left than on the right, and the colour fills
  the band.
- `re4-B-centred-none-canvas-1280.png` and `re4-C-edge-3-0.5-canvas-1280.png`.
- `re4-caption-{1280,375}-{Light,Dark,Midnight,Purple}.png`.
- The `re4-*-preview-*.png` shots show only the top of the page under the Preview's own bar, where this single short band
  sits. The measured numbers are the evidence for the Preview.

Nothing new was found. All Playwright browsers were closed.
