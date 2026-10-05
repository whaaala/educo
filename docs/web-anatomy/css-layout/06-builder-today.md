# 06 — What the builder can do with CSS layout TODAY

An audit of the code on branch `builder/layout-uat` at `2f56caa` (2026-10-04). It reads the code only; nothing
here was checked in a browser. For every grid, flexbox and box-alignment property it records what values the
builder can produce, where they are stored, where the canvas and the published page emit them, which Inspector
control (if any) lets a person choose them, and whether that choice can be made per screen size.

**Key files**
- Model and emitters: `lib/box-model.ts` (`BoxNode` 193–520; `ResponsiveOverride` 188; `containerStyleOf` 5293–5400;
  `childStyle` 5489–5832; `gutterCSS` 5837–5858; `gapCSS` 4896; `paddingCSS` 5088; `marginCSS` 5146; `placeCSS` 6917;
  `placeInSequence` 5874; `pinCSS` 6264; `gridColumnsAt` 3122; `gridRowTracks` 3591; `gridQueryCss` 3455;
  `pagerStripCss` 3677; `flexForWidth` 4689; `sizeToCSS` 4186; `imageSizing` 4210).
- Canvas: `components/website/box/BoxCanvas.tsx` (`wrapStyle` 3074–3138; container style 3248; element style 3427–3438;
  container queries 3653).
- Published page: `lib/box-export.ts` (`styleAt` 377–464; `RESET` 326–338; `diffStyle` 467; per-rung `@media` 595;
  container queries 528; advanced CSS 499–500).
- Inspector: `components/website/box/BoxInspector.tsx`; how a patch is stored per screen:
  `app/website/box-demo/page.tsx:615–623` (`patchAt`: every key except content keys goes to the current rung's
  override through `updateBoxResponsive`, `lib/box-model.ts:2851`).
- `lib/page-grid.ts` is **column maths only** (span/share/snap/labels). Nothing emits CSS from it and no UI uses it yet;
  the only import is a type in `lib/box-site.ts:7`. The `pageGrid` flag on the page root changes default spacing
  only (`SPACE_GRID`, `lib/box-model.ts:4926`).

**The two facts that shape every row below**
1. The canvas and the published page call the SAME emitters (`containerStyle`, `childStyle`, `marginCSS`,
   `placeCSS`, `pinCSS`, `gapCSS`), so they agree unless noted in the disagreements section.
2. Per screen size: any Inspector control that goes through `onPatch` is stored for the rung being edited. The
   controls that call a STRUCTURAL helper with `updateBox` (Position in row, Content width, re-cutting columns,
   Floating, layer order) write the base for every screen, whatever rung is selected.

"Per rung ✔" below means a person can set it differently for phone · tablet portrait · tablet landscape · desktop · wide.

---

## The table

| CSS property | values the builder can produce | stored in (BoxNode field, file:line) | emitted on the canvas (file:line) | emitted on the published page (file:line) | Inspector control (label, file:line) or "none" | per screen size? | GAP: what a person cannot do |
|---|---|---|---|---|---|---|---|
| `display` | `flex` (every container by default), `grid`, `none`; inner `flex` on an element with Content position or a self-painting block; pager strip `grid` | `layout` box-model.ts:198; `hidden` :474; `pager` :227 | containerStyleOf 5309 / 5365 via BoxCanvas 3248; hidden → not rendered BoxCanvas 3062; Content position BoxCanvas 3437 | styleAt box-export.ts:412 (container), 414 `display:none` for hidden, 460–462 Content position | "Arrange as" Free arrange / Grid (BoxInspector 960); "Hidden everywhere / on <rung>" (1848) | ✔ (layout and hidden are style keys) | No `block`, `inline-flex`, `inline-grid`, `inline-block`, `contents`, `flow-root`. A container is always flex or grid; cannot make a container "just a block". |
| `flex-direction` | `row`, `column` | `direction` :199 (`FlexDir` :122) | containerStyleOf 5366 | same emitter, box-export 412 | "Direction" Top-to-bottom / Side-by-side (1018) | ✔ | No `row-reverse` / `column-reverse` (order per rung is the only way to reverse). |
| `flex-wrap` | `wrap`, `nowrap` (a row band is ALWAYS `wrap`) | `wrap` :209 | containerStyleOf 5373 | same | checkbox "Let blocks wrap to a new line" (1021) | ✔ | No `wrap-reverse`; cannot turn wrapping OFF on a row band (forced, 5373). |
| `flex-flow` | never emitted as the shorthand; longhands only | — | — | — | none (longhands above) | n/a | Shorthand itself not needed; same limits as direction + wrap. |
| `flex-grow` | 0 or 1 only, derived: `1` for `fill`, a definite parent, a band column alone on its line or unsized; else `0` | derived from `width`/`height` tokens :332–333, `widthByHand` :280 | childStyle 5631–5636, flexForWidth 4689 | same emitter via styleAt 402 | indirect: "Width" Fit / Full / Custom (WidthControl 202) | ✔ (width is per rung) | Cannot set a grow factor (2:1 sharing), cannot say "grow" independently of width. |
| `flex-shrink` | always `1` except `0 0 auto` for Fit | derived | flexForWidth 4690–4705 | same | none (indirect via Width) | — | Cannot stop a block shrinking (`flex-shrink:0`) while keeping a width. |
| `flex-basis` | `0%` (Full), `auto` (Fit), the stored `%`/`px`/any length (Custom), `calc(% - gutter)` on banded columns, tablet basis | `width` :332 | flexForWidth 4689; gutterCSS 5849; tabletBasis 4682 | same | "Width" + "Custom width" free text "50% or 240px" (WidthControl 198–206); canvas edge drag writes `%` | ✔ | Basis is always the WIDTH; on a column-direction parent the main size is the HEIGHT token instead (5598). No independent basis. |
| `flex` (shorthand) | `1 1 auto`, `1 1 0%`, `0 0 auto`, `0/1 1 <len>` | derived | childStyle 5631 | same | none directly | ✔ (via width) | Only these four shapes. |
| `order` | any integer | `order` :350 | placeInSequence 5875 (childStyle 5528 / 5823) | same; RESET `order:0` box-export 335 | "Order" number (1103) in "Position" | ✔ | Fully reachable. (Not offered while a block is Floating, 1077.) |
| `justify-content` | flex: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`; element wrapper with Content position: start/center/end | `justify` :208 (`FlexJustify` :124); `contentY` :463 | containerStyleOf 5369 (JUSTIFY_CSS 2941) | same; box-export 462 | "Position blocks" (flex, 1020: Start/Center/End/Spread out/Even gaps); "Position in row" Left/Center/Right/Spread on a child, writes the PARENT's justify (1113 → alignInRow box-model 2759) | ✔ for "Position blocks"; ✘ "Position in row" (updateBox, base only) | No `space-evenly`; nothing on a GRID container (never emitted in the grid branch 5309–5362); no `stretch`/`normal`. |
| `justify-items` | `start`, `center`, `end`, `stretch` (grid only) | `justifyItems` :352 | containerStyleOf 5327 | same; RESET `normal` box-export 335 | "Position blocks" on a grid: Fill the cell / Left / Center / Right (981) | ✔ | No `baseline`, `self-start/end`, `legacy`. Effectively complete. |
| `justify-self` | `start`, `center`, `end`, `stretch` (grid child); also from the nine-point Position on a grid child | `justifySelf` :351; `placeX` :358 | childStyle 5525, placeCSS 6921–6922 | same; RESET `auto` box-export 335 | Grid cell "Line up (across)" Fill/Left/Center/Right (1063); "Where this block sits" nine squares (1085) | ✔ | Flex children cannot use it (CSS ignores it there — the nine-point control uses auto margins instead, correctly). Two controls write it; see bugs. |
| `align-content` | flex: always `stretch` (hard-coded); grid: never emitted (browser `normal`) | none | containerStyleOf 5396 | same | none | — | Cannot pack wrapped lines to the top/centre/bottom or spread them; cannot distribute grid rows inside a taller grid. |
| `align-items` | `flex-start`, `center`, `flex-end`, `stretch`; grid masonry forces `start`; element Content position | `align` :206 (`FlexAlign` :123); `contentX` :462 | containerStyleOf 5320 (grid) / 5368 (flex) | same; box-export 462 | "Line up (across)" Fill/Start/Center/End (1024) | ✔ | No `baseline` (text along a common baseline). Label says "across" but in a flex ROW and in a GRID this property is the DOWN axis — see bugs. |
| `align-self` | `flex-start`, `flex-end`, `center`, `stretch`; written by the nine-point Position and by edge-anchored resize; auto `flex-start` for elements that hug | `alignSelf` :207; `placeY`/`placeX` :358–359 | childStyle 5526, 5754, 5778–5781; placeCSS 6923 / 6928 | same; RESET `auto` box-export 335 | "Where this block sits" nine squares (1085) — only start/centre/end | ✔ | Cannot choose `stretch` or `baseline` for one block explicitly (stretch only by clearing). `alignSelf` itself has no control (set by resize). |
| `place-content` | never emitted | — | — | — | none | — | Not reachable (align-content + justify-content on a grid both missing). |
| `place-items` | via its longhands on a grid (`justify-items` + `align-items`) | as above | as above | as above | "Position blocks" + "Line up (across)" (981, 1024) | ✔ | Reachable only as two separate controls; no `baseline`. |
| `place-self` | via longhands from the nine-point Position (grid: justify-self + align-self; flex: align-self + auto margins) | `placeX`/`placeY` :358–359 | placeCSS 6917–6933, applied last in childStyle 5530 / 5826 | same | "Where this block sits" (1085) | ✔ | 3×3 only — no stretch on one axis while placing on the other. |
| `gap` | one length (fluid rem) when both axes agree | `gap` :200 | gapCSS 4896–4906 | same | "Space between blocks" slider 0–64 (1025) | ✔ | Fully reachable. |
| `row-gap` | fluid rem; masonry writes `0px` and spends the gap as row units; menu lists get `LINK_GAP_DOWN` | `gapY` :205 | gapCSS 4905; containerStyleOf 5318; listLinesGap 5281 | same; RESET `normal` box-export 338 | "Space down" slider (1035) | ✔ | Fully reachable. |
| `column-gap` | fluid rem; on a row band it becomes a GUTTER (`--bx-gut` + negative margins + `calc(% - gut)`), `column-gap:0` | `gapX` :204 | gapCSS 4901–4904; gutterCSS 5837–5858 | same | "Space across" slider (1034) | ✔ | Fully reachable. |
| `grid-template-columns` | `repeat(N, minmax(0, 1fr))`, N = 1–12; container queries narrow it to 2 / 1 (`!important`); pager `none` | `columns` :210; `GRID_MAX = 12` :3051 | containerStyleOf 5312 (gridColumnsAt 3122); gridQueryCss 3468 (BoxCanvas 3653) | same; box-export 528 | "Columns" Halves/Thirds/Quarters/Sixths/Twelve (970); "Columns in the row" 1–12 (973); "Choose a layout" table + uneven splits (GridLayoutMenu.tsx 33–43) | ✔ count per rung; ✘ re-cutting at a rung does not carry children (page.tsx 666) | Only equal `1fr` tracks. No fixed tracks (`200px 1fr`), no `auto`, no `minmax(16rem,1fr)`, no `auto-fit`/`auto-fill`, no named lines, no more than 12. Uneven splits are expressed as spans of 12. |
| `grid-template-rows` | engine-only: `auto` for a row whose cell was dragged taller, `minmax(min-content, 1fr)` for the others | none (derived from cells' `height`/`minHeight`) | containerStyleOf 5352 (gridRowTracks 3591) | same | none (indirect: dragging a cell's bottom edge) | ✔ (derived per rung) | Cannot state row sizes; cannot set an explicit row count; turned off as soon as any cell has `rowStart`/`rowSpan` (3597). |
| `grid-template-areas` | never | — | — | — | none | — | Not reachable: no named areas, so no "header / sidebar / main" templates that rearrange per screen by name. |
| `grid-template` | never | — | — | — | none | — | Not reachable. |
| `grid-auto-columns` | engine-only: `100%` on a pager strip | none | pagerStripCss 3681 | box-export 574 | none (Show one at a time, 937, turns it on) | — | Cannot size implicit columns. |
| `grid-auto-rows` | `minmax(min-content, 1fr)` (Even) or `minmax(<unit>rem, auto)` (masonry) | `rowFlow` :221 | containerStyleOf 5347 | same | "Row heights" Even / Follow the picture (990) | ✔ | Two values only; no `auto`, no fixed row height, no `min-content` packing. |
| `grid-auto-flow` | engine-only: `column` on the pager strip; otherwise browser default `row` | none | pagerStripCss 3680 | box-export 574 | none | — | No `dense` (back-filling holes), no `column` flow for an ordinary grid. |
| `grid-area` | never emitted as such; equivalent via `grid-column` + `grid-row` | — | — | — | none (via the four cell fields) | — | No named area placement. |
| `grid-row` (`-start`/`-end`) | `<start> / span <n>`, `span <n>`; masonry: computed `span <units>`; given up when the grid reflows at a narrow rung | `rowStart` :349; `rowSpan` :336 | childStyle 5508–5523 | same; RESET `auto` box-export 335 | "Rows tall" 1–12 (1055); "Start at row" (1060) — both hidden in masonry | ✔ | No end line, no negative lines (`-1`), no named lines. |
| `grid-column` (`-start`/`-end`) | `<start> / span <n>`, `span <n>`, re-fitted per rung; last cell of a short row stretched | `colStart` :344; `colSpan` :335 | childStyle 5497–5503; gridQueryCss 3464 | same; RESET `auto` box-export 335 | "Width in columns" fractions (ColumnFractions 75); "Columns wide" (1043); "Start at column" (1047); canvas cell edge drag | ✔ | No end line, no negative lines, so no "span to the last column" / full-bleed `1 / -1`. |
| `grid` (shorthand) | never | — | — | — | none | — | Not reachable. |
| `subgrid` | never | — | — | — | none | — | Cards in a row cannot line their titles/buttons up to shared rows; a nested grid cannot reuse the page's columns. |
| masonry | EMULATED: row track becomes a `rem` unit, each cell `grid-row: span <n>`; optional measuring script | `rowFlow` :221; `rowMeasure` :255 | containerStyleOf 5307–5347; childStyle 5508; masonryMeasureAttr BoxCanvas 3234 | same + masonryMeasureScript (imported box-export 14) | "Row heights" → Follow the picture (990); "Measure on the page" (1003) | ✔ (phone always stacks, isMasonry 3892) | Not CSS `masonry`/`grid-lanes` (not shipped by browsers); horizontal masonry not possible. Reasonable today. |
| `repeat()` / `minmax()` / `fit-content()` / `fr` / `auto-fit` / `auto-fill` | `repeat(N, minmax(0,1fr))` only; `minmax(min-content,1fr)` rows; `max()`/`min()` in floors | constants | 5312, 5347, 5352 | same | none | — | A person cannot write an intrinsic auto-fit grid ("as many 16rem cards as fit"). The engine does the equivalent itself with container queries (`gridQueryCss` 3455) — engine-only. |
| `margin` (incl. `auto`) | per side, fluid rem ≥ 0; `%` left margin from a drag; `auto` from the nine-point Position or `push`; negative half-gutter on banded columns; `-0.0625rem` slack | `margin`, `marginTop/Right/Bottom/Left` :260–261; `marginLeftPct` :274; `push` :353 | marginCSS 5146 via BoxCanvas 3080; placeCSS 6927–6929; gutterCSS 5844, 5855–5857; childStyle 5654; outerSpaceCSS 5019 | same: box-export 392, 418 | "Outer spacing" all sides + per side (1161) | ✔ | No negative margins (slider and fields min 0, BoxInspector ~228 / ~240) so no deliberate overlap in the flow; `auto` only via the nine-point control (`push` has no control at all). |
| `padding` | per side, fluid rem; defaults from SPACE_DEFAULT / SPACE_GRID | `padding`, `paddingTop…Left` :258–259 | paddingCSS 5088 (containerStyleOf 5353 / 5397), leafPaddingCSS 5105 (BoxCanvas 3081) | same: box-export 393, 412; pageBandInset 5043 | "Inner spacing" all sides + per side (1160; not for buttons) | ✔ | Fully reachable (button keeps its own design padding). |
| `position` | `relative` (default), `absolute` (Floating), `sticky`, `fixed` (Stays put while scrolling) | `position` :441; `pin` :389; `hold` :403 | wrapStyle BoxCanvas 3075; pinCSS 6273; fixed is SIMULATED as absolute on the canvas (canvasFixedStyle 6445, BoxCanvas 3153) | box-export 389; pinCSS real `fixed` | "Placement" In the layout / Floating (698); "Stays put while scrolling" Scrolls away / Sticks when reached / Floats on screen (765; floated: 732) | ✔ pin/hold; ✘ Floating itself (floatBox via commit, page.tsx 671, base only) | No `relative` offset (nudge a block a little without leaving the flow); Floating is relative to the parent only. |
| `inset` / `top` / `left` / `right` / `bottom` | Floating: `left`/`top` as % of the parent; pinned: the chosen edge(s) at `pinOffset`; fixed floated: `pinX`/`pinY` | `left`/`top` :454–455; `pinOffset` :391; `pinX`/`pinY` :437–438 | BoxCanvas 3091; pinCSS 6264+ | box-export 397; pinCSS | "Left %" / "Top %" (BoxInspector 709–712, floating only); "Held against" 2 or 8 anchors (783); "Distance from the edge" (796) | ✔ | Cannot anchor a floating block by its RIGHT or BOTTOM edge (so it does not stay at the right as the parent resizes); no `inset` stretch for an overlay that fills its parent. |
| `z-index` | floating: integer via layer buttons (clamped, floatZIndex); pinned: constant `PAGE_Z.sticky`; header cover `PAGE_Z.sticky + 1` | `zIndex` :456 | BoxCanvas 3091; pinCSS 6273 | box-export 397 | "Front/back order" Send to back / Back one / Forward one / Bring to front (714–722); same four in the canvas context menu (BoxCanvas 3539–3542) | ✘ (layer ops via commit, base only) | Blocks IN THE FLOW cannot be layered at all (negative margins also impossible, so overlap in flow is impossible); a pinned block's layer is fixed. |
| `transform: translate` (as positioning) | engine-only: `translate: 0 -100%` for a bottom-held fixed block on the canvas; `translate(0)` on the canvas page root; component ITEM parts can be moved in rem | component items `pos`, `iconDx/Dy` (lib/box-model.ts:1533, 1541, 1646) | canvasFixedStyle ~6488; BoxCanvas 3125 | component part CSS only | Component item "Move … ← → / ↑ ↓ (rem)" (BoxInspector 185–188) — components only | ✔ for item parts | A block cannot be nudged by translate. (`rotate` exists as "Tilt", 1226, but that is not positioning.) |
| `width` | `auto` (no width), `100%` (Full), any stored token (`50%`, `240px`, also `rem`/`calc` typed by hand), `calc(100% + gut)` on bands, `calc(100% - side space)` | `width` :332 | childStyle cross size 5768–5772; flex basis 5631; BoxCanvas 3091 (floating) | same | "Width" Fit / Full / Custom + free text (202–204); canvas edge drag | ✔ | Free text accepts `px`, which reaches the page as px (rule 16). No `min-content`/`max-content`/`fit-content()` choice by name. |
| `min-width` | engine-only floors: `min(100%, 14rem)`, `min-content`, `100%` on phone, `0`/`8rem` for clipped/empty | none | childStyle 5744–5806 | same | none ("Trim to size", 1153, sets `min-width:0` indirectly) | ✔ (derived) | A person cannot set a minimum width (e.g. "never narrower than 18rem before wrapping"). |
| `max-width` | engine-only: `100%` on every block; `calc(100% - gut)`; `none` on bands; `calc(100% - side space)` | none | BoxCanvas 3076; gutterCSS 5844 / 5852; outerSpaceCSS 5029 | box-export 390 | none (the band's "Content width → Centred column", 880, applies a fixed measure through the `eu-band--contained` class, box-model 2001 / lib/educo-ui/layout.ts 97) | Content width ✘ (setSectionWidth → updateBox, base only, page.tsx 1209) | Cannot set a readable measure (e.g. `max-width: 65ch`) on a heading, text or card; only on a page band, and only one fixed value. |
| `height` / `min-height` / `max-height` | `height`: any stored token (`auto`, `300px`, `40vh`, `100%`); `min-height`: Band height (rem), `50svh`/`100svh`, `max(own, svh)`, engine floors; `max-height`: never | `height` :333; `minHeight` :334; `screenHeight` :376 | childStyle 5527 (grid), 5770 (row cross); containerStyleOf 5361 / 5398 (combineMinHeight 5891); BoxCanvas 3433–3434 | same; box-export 450–457 | "Height" free text "auto, 300px or 40vh" (1120); "Band height" 0–720 (1258, containers); "Screen height" Fit content / Half / Full (894); "Show the whole picture" on images (~1395) | ✔ | No `max-height`; free text accepts px. |
| `aspect-ratio` | engine-only: `<imgW> / <imgH>` on an image with a measured size and no height | `imgW`/`imgH` :505–506 | BoxCanvas 4314 (imageSizing 4210) | box-export 155–157 | indirect: "Show the whole picture (don't crop it)" (~1395) | ✔ (height token per rung) | Cannot give ANY block a shape (16:9 video card, square tile, 4:5 portrait crop) — only "the photo's own shape" or a fixed height. |

---

## Values the builder emits but a person cannot choose (engine-only — RULE UI gaps)

Each of these is a real CSS capability already in the engine with no control, or with only an indirect one.

1. **Auto-fit-style narrowing of grids** — container queries rewrite `grid-template-columns` to 2 or 1 (`gridQueryCss`
   box-model.ts:3455–3475, canvas BoxCanvas.tsx:3653, export box-export.ts:528). A person cannot set the minimum cell
   width (`CELL_MIN_REM = 12`, box-model.ts:3105) or turn the narrowing off except by setting a column count at a rung.
2. **`grid-template-rows`** with `auto` vs `minmax(min-content,1fr)` per row (gridRowTracks 3591) — only via dragging.
3. **`grid-auto-flow: column` + `grid-auto-columns: 100%`** — only inside the pager strip (3680–3681).
4. **`align-content: stretch`** — hard-coded on every flex container (5396); never a choice.
5. **`flex` grow/shrink factors** — `1 1 auto`, `1 1 0%`, `0 0 auto`, `0|1 1 <basis>` decided by rules (5631–5636,
   flexForWidth 4689).
6. **`min-width` floors** — `min(100%, 14rem)`, `min-content`, `100%` on phone (5744–5806).
7. **`max-width`** — `100%`, gutter `calc()`s, the contained measure (BoxCanvas 3076, gutterCSS 5852, outerSpaceCSS 5029).
8. **`margin-left: <n>%`** (`marginLeftPct`, 274) — written only by an edge drag; the Outer spacing control shows the
   length field, not the % that wins over it (marginCSS 5154).
9. **`align-self`** as its own value (stretch / flex-start written by resize, 207) — no control shows or clears it.
10. **`push`** auto-margin idiom (353, placeInSequence 5876–5877) — read, never written by any control.
11. **`aspect-ratio`** — images only, from intrinsic size (imageSizing 4215).
12. **`translate`** — only the canvas's fixed-block simulation (~6488) and component item parts.
13. **`z-index`** for pinned blocks (`PAGE_Z.sticky`, pinCSS 6273) and for a header cover (pagePinCover 5065).
14. **Negative gutter margins** on banded rows (`calc(var(--bx-gut) * -0.5)`, gutterCSS 5843) — a person cannot make
    a negative margin of their own.

## Values a person can choose that the published page ignores (bugs)

1. **Advanced CSS set at a rung is dropped from the published page.** The export appends `overridesCss(r)` where
   `r = resolveResponsive(node, "base")` (box-export.ts:482, 499–500), so a component's Advanced CSS stored in a
   rung's override (every non-content key goes to the rung, page.tsx:615–623) is never published, while the canvas
   applies the resolved value inline (BoxCanvas.tsx:3050, 3137).
2. **Grid cell "Line up (across)" is silently overridden by the nine-point Position.** Both write `justify-self`
   (BoxInspector 1063 and 1085); `placeCSS` is applied last (box-model 5530), so once a square is picked the
   "Line up (across)" choice does nothing on the canvas or the page.
3. **"Position in row", "Content width", re-cutting columns, Floating and layer order ignore the selected device.**
   They call structural helpers through `commit(updateBox…)` (alignInRow 2762, setSectionWidth 2781, page.tsx
   666/671/674), so a person editing the Phone view changes every screen. The Per-device tab says "Size, spacing
   and layout you change now only apply here" (BoxInspector ~1847), which is not true for these.
4. **"Show the whole picture" unticked writes `height: "260px"`** (BoxInspector ~1395) and the Width/Height free
   text accepts `px`; `sizeToCSS` passes them through (4186–4190) so a stored pixel reaches the page — against rule 16.

(The flex "Position blocks" on a grid was the old instance of this class; it is fixed — the grid shows its own
`justify-items` control, 980–982.)

## Canvas vs published page disagreements visible in the code

1. **Fixed blocks** — published as real `position: fixed`; on the canvas simulated as `position: absolute` with
   scroll-tracking `calc()` and `translate: 0 -100%` (canvasFixedStyle 6445–6495, BoxCanvas 3153). Deliberate, but
   any nesting the simulation does not model (e.g. a transformed ancestor) can differ; `fixedBlockedBy` warns.
2. **Advanced CSS at wider rungs** — the canvas applies it inline, LAST, at every rung (BoxCanvas 3137); the export
   puts it only in the phone (unqualified) rule (box-export 500), so any property that the generated style changes at
   a wider rung (`grid-template-columns`, `flex-direction`, `gap`…) beats the Advanced CSS there on the published page
   but not on the canvas. Also bug 1 above.
3. **Container-query narrowing** uses `!important` (gridQueryCss 3466, 3468) in both renderers, so it also beats
   Advanced CSS on both — consistent, but a person's own `grid-template-columns` in Advanced CSS is overridden.
4. **Floating block `minHeight`** is emitted as a bare number → `px` in both (BoxCanvas 3091, box-export 397 via
   styleString 57–58): they agree, but it is a stored pixel on the page (rule 16).

No other disagreement is visible for the layout properties: both renderers call the same emitters.

## Labelling defect found while auditing

- **"Line up (across)" on a container (BoxInspector 1024) sets `align-items`**, which is the across axis only in a
  top-to-bottom stack. In a Side-by-side row and in a Grid it lines blocks up DOWN (vertically). The same label is
  used for the grid cell's genuinely-across `justify-self` (1063).

---

## Summary

46 rows (each line of the table, with `height/min-height/max-height` as one row).

| Reach | Count | % | Properties |
|---|---|---|---|
| **Fully reachable** (every useful value, per screen) | 7 | **15%** | order · justify-items · gap · row-gap · column-gap · padding · width |
| **Partly** (some values, indirect, or base-only) | 26 | **57%** | display · flex-direction · flex-wrap · flex-flow · flex-grow · flex-shrink · flex-basis · flex · justify-content · justify-self · align-items · align-self · place-items · place-self · grid-template-columns · grid-template-rows · grid-auto-rows · grid-area · grid-row · grid-column · masonry · margin · position · inset · z-index · height/min/max |
| **Not at all** | 13 | **28%** | align-content · place-content · grid-template-areas · grid-template · grid-auto-columns · grid-auto-flow · grid shorthand · subgrid · repeat()/minmax()/auto-fit track functions · min-width · max-width · aspect-ratio · translate |

The builder is strong on spacing, order and the twelve-column span/start model, all per screen size. It is weakest
on the GRID TEMPLATE itself (only equal `1fr` tracks; no areas, no intrinsic `auto-fit`, no subgrid, no `dense`), on
sizing limits (`min-width`, `max-width`, `max-height`, `aspect-ratio`), and on line/content distribution
(`align-content`, `space-evenly`, `baseline`).
