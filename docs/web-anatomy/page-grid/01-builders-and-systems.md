# The page grid — how builders and design systems do it (RULE MAP, step 1)

Research for **AC-37b, the page grid**: ONE hidden column grid per page (proposed **4 columns on a phone, 8 on a tablet
portrait, 12 from tablet landscape up**, placement at **half-columns**), **layout guides** shown while placing, blocks
**spanning N columns**, **content deciding the span** (never narrower than its longest word), **bleed** out of a section
(full / half / popout / overlapping the section above or below), and nested components on the page's lines through
**`subgrid`**. Collected 2026-10-03.

**Builds on, never redoes:** [`../advanced-css/07-grid.md`](../advanced-css/07-grid.md) (every Grid property, `fr`,
`minmax(0, 1fr)`, auto-fit, `dense`, named lines / areas; gaps AC-29 … AC-33) and
[`../advanced-css/08-nexter.md`](../advanced-css/08-nexter.md) (the centred 8-column page with `1fr` side tracks,
full-bleed and **half-bleed** by named lines — AC-35; `subgrid` — AC-36; `aspect-ratio` rows — AC-34). Those two files
are the CSS foundation; this one adds **what the builders and design systems DO with it** — the product decisions.

Status vocabulary as in the README: `HAVE` · `PARTIAL` · `GAP`. "Builder" below = the Educo website builder.

## Sources (tag → URL) — every claim below carries its tag

| Tag | Source (read in full unless noted) |
|---|---|
| WF-grid | Webflow Help, *Grid* — https://help.webflow.com/hc/en-us/articles/33961365794451-Grid |
| WF-areas | Webflow Help, *Grid areas* — https://help.webflow.com/hc/en-us/articles/33961389959059-Grid-areas |
| WF-qs | Webflow Help, *Quick Stack* — https://help.webflow.com/hc/en-us/articles/33961314138643-Quick-Stack |
| WF-vs | Webflow Help, *Flexbox vs grid vs Quick Stack* — https://help.webflow.com/hc/en-us/articles/33961242149395-Flexbox-vs-grid-vs-Quick-Stack |
| WF-lay | Webflow Help, *Building web layouts* — https://help.webflow.com/hc/en-us/articles/33961378749715-Building-web-layouts |
| WF-cont | Webflow Help, *Container* — https://help.webflow.com/hc/en-us/articles/33961334198931-Container |
| WF-fr | Webflow Help, *Fractional unit overview* — https://help.webflow.com/hc/en-us/articles/33961332938899-Fractional-unit-overview |
| WF-bp | Webflow Help, *Breakpoints overview* — https://help.webflow.com/hc/en-us/articles/33961300305811-Breakpoints-overview |
| WF-fk | Webflow Flowkit grid classes — https://developers.webflow.com/flowkit/v1.0.0/structure/grid |
| FR-api | Framer plugin API, `GridLayout` + `FrameNode` grid traits — https://www.framer.com/developers/reference/plugins-type-grid-layout · https://www.framer.com/developers/reference/plugins-frame-node |
| FR-guides | Framer Help, *Adding a layout grid* — https://www.framer.com/help/articles/layout-grids/ |
| FR-svg | Framer Academy, *Stacks vs grids* — https://www.framer.com/academy/lessons/framer-fundamentals-stacks-vs-grids |
| FR-bp | Framer Academy, *Breakpoints* — https://www.framer.com/academy/lessons/framer-fundamentals-breakpoints |
| FR-pos | Framer Academy, *Positioning modes* — https://www.framer.com/academy/lessons/layer-positioning-modes-in-framer |
| FR-fluid | Framer Academy, *Designing fluid layouts* — https://www.framer.com/academy/lessons/framer-fundamentals-designing-fluid-layouts |
| FR-tpl | Framer Help, *Layout templates* — https://www.framer.com/help/articles/using-layout-templates/ |
| FR-blog | Framer blog, *Design responsive websites* — https://www.framer.com/blog/design-responsive-websites/ |
| WX-sg | Wix Studio, *Customizing a section grid* — https://support.wix.com/en/article/studio-editor-customizing-a-section-grid |
| WX-adv | Wix Studio, *Advanced CSS grid* — https://support.wix.com/en/article/studio-editor-working-with-an-advanced-css-grid |
| WX-fg | Wix Studio, *Flexbox- vs grid-based tools* — https://support.wix.com/en/article/studio-editor-choosing-between-flexbox-based-and-grid-based-tools |
| WX-dock | Wix Studio, *Docking, margins and padding* — https://support.wix.com/en/article/studio-editor-working-with-docking-margins-and-padding · *Positioning elements* — https://support.wix.com/en/article/studio-editor-positioning-elements |
| WX-size | Wix Studio, *Setting the size of your elements* — https://support.wix.com/en/article/studio-editor-setting-the-size-of-your-elements |
| WX-bp | Wix Studio, *Designing across breakpoints* — https://support.wix.com/en/article/studio-editor-designing-across-breakpoints · *Managing breakpoints* — https://support.wix.com/en/article/studio-editor-managing-breakpoints |
| WX-max | Wix Studio, *Setting the site's max width* — https://support.wix.com/en/article/studio-editor-setting-the-sites-max-width |
| WX-ruler | Wix Studio, *Request: rulers and guides* — https://support.wix.com/en/article/studio-editor-request-rulers-and-guides |
| WX-dg | Wix *Design Guides* add-on — https://support.wix.com/en/article/wix-apps-design-guides |
| WX-lg | Wix Harmony, *Layout guides* — https://support.wix.com/en/article/wix-harmony-editor-working-with-layout-guides |
| WX-acad | Wix Studio Academy, *Creating a layout with section grid* — https://www.wix.com/studio/academy/tutorials/creating-layout-with-section-grid |
| FG-guides | Figma Help, *Create layout guides* — https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-guides |
| FG-cons | Figma Help, *Combine layout guides and constraints* — https://help.figma.com/hc/en-us/articles/360039957934-Combine-layout-guides-and-constraints |
| FG-gal | Figma Help, *Use the grid auto layout flow* — https://help.figma.com/hc/en-us/articles/31289469907863-Use-the-grid-auto-layout-flow |
| FG-api | Figma plugin API, `LayoutGrid` and `gridColumnSizes` — https://developers.figma.com/docs/plugins/api/LayoutGrid/ · https://developers.figma.com/docs/plugins/api/properties/nodes-gridcolumnsizes |
| FG-sites | Figma Help, *Add or delete breakpoints* (Figma Sites) — https://help.figma.com/hc/en-us/articles/31242797809815 |
| MDC | Material Components Web layout grid — https://github.com/material-components/material-components-web/blob/master/packages/mdc-layout-grid/README.md and its `_variables.scss` |
| M2 | Material Design 2, *Responsive layout grid* — https://m2.material.io/design/layout/responsive-layout-grid.html (JS-rendered; the breakpoint table taken from search-result quotations of that page, cross-checked against MDC) |
| M3 | Android, *Window size classes* — https://developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes ; M3 margins / spacers from the SAP Fiori-for-Android mirror of the M3 guidance (search result; m3.material.io itself is JS-rendered and returned nothing) |
| BS | Bootstrap 5.3 — grid https://getbootstrap.com/docs/5.3/layout/grid/ · gutters …/gutters/ · columns …/columns/ · containers …/containers/ · CSS grid …/css-grid/ |
| TW | Tailwind — https://tailwindcss.com/docs/grid-template-columns · https://tailwindcss.com/docs/grid-column |
| GOV | GOV.UK Design System, *Layout* — https://design-system.service.gov.uk/styles/layout/ + source `govuk-frontend` (`settings/_measurements.scss`, `settings/_media-queries.scss`, `helpers/_grid.scss`, `helpers/_width-container.scss`, `objects/_grid.mixin.scss`) |
| MDN-sub | MDN, *Subgrid* — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid (+ browser-compat-data `grid-template-columns.subgrid`) |
| MDN-names | MDN, *Grid layout using named grid lines* — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_using_named_grid_lines |
| MDN-fit | MDN, `fit-content()` — https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content_function |
| MDN-wm | MDN, *Grids, logical values and writing modes* — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grids_logical_values_and_writing_modes |
| MDN-rf | MDN, `reading-flow` — https://developer.mozilla.org/en-US/docs/Web/CSS/reading-flow (+ browser-compat-data) |
| MDN-cq | MDN, *Container size and style queries* — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries |
| JC | Josh W. Comeau, *Full-Bleed Layout Using CSS Grid* — https://www.joshwcomeau.com/css/full-bleed/ |
| RM | Ryan Mulligan, *Layout Breakouts with CSS Grid* — https://ryanmulligan.dev/blog/layout-breakouts/ |

---

## The axes at a glance

| # | Axis | Values found (→ detail below) |
|---|---|---|
| A1 | Column count per breakpoint | fixed 12 everywhere · 4/8/12 · capped per breakpoint (12/6/4/4) · auto-fit (count from a min width) · free count per grid |
| A2 | Breakpoint widths & cascade | desktop-base cascading both ways · desktop-down · mobile-up `min-width` · window size classes · user-defined |
| A3 | Outer margin / content width | fixed margin + fluid body · fluid margin + fixed body (alternating) · max-width container + auto margins · `minmax(gut, 1fr)` side tracks · site max width with per-section opt-out · safe-area aware |
| A4 | Gutter | fixed px per breakpoint · constant rem · token scale (XXS–XXL) · fluid `clamp()` · separate across / down · gutter-as-track |
| A5 | Column width | fluid `fr` / `minmax(0,1fr)` · % · fixed (72px) · `minmax(min, max)` · content (`min-content` / `max-content` / `fit-content()`) |
| A6 | Grid alignment in its frame | stretch · centre · left / right (start / end) · top / bottom for row guides |
| A7 | Placement unit | auto-flow cell · whole column (span + start) · named fraction (⅔ / ⅓) · named area · free offset / docking · half-column (no source has it natively) |
| A8 | Span rules | explicit span · span "all" / `1 / -1` · negative lines (`3 / -3`) · auto-fit min · content minimum · wrap when the sum exceeds the count · default span |
| A9 | Row model | auto (content) · fixed · `fr` in a fixed-height band · min/max · fit-to-screen · baseline grid · subgrid rows |
| A10 | Bleed | full · popout / feature (named breakout lines) · half-bleed · overlap into the neighbour section · overlap inside one cell |
| A11 | Nesting | independent grid · nested with same counts, no margins (MDC) · re-declared count (Bootstrap) · `subgrid` (columns / rows / both) · flex inside a cell |
| A12 | Guides in the editor | always / on drag / toggled / per breakpoint; colour + opacity; labels; snap lines; edit-mode overlay with track headers |
| A13 | Mapping a block's "N across" to the grid | presets (Quick Stack, section-grid layouts) · `row-cols-*` · default span 4 · grid picker · auto-fit |
| A14 | Per-breakpoint overrides | what can change per breakpoint vs what is global (structure, order, content) |
| A15 | Accessibility & reading order | source order is the reading order · `order` / placement / `dense` / areas move pixels only · `reading-flow` (Chrome-only) · logical lines in RTL · reflow at 320px |

---

## A1 — Column count per breakpoint

| Value | How it is made | Who |
|---|---|---|
| **12 at every breakpoint**, columns fall to full width below a tier | `.row > .col-md-6` = `flex: 0 0 auto; width: 50%` from 768px up, 100% below; `$grid-columns: 12` | BS (flex grid); Webflow Flowkit desktop 1–12 [WF-fk] |
| **4 / 8 / 12** (phone / tablet / desktop) | MDC: `$columns: (desktop: 12, tablet: 8, phone: 4)` with `$breakpoints: (desktop: 840px, tablet: 600px, phone: 0px)`; `.mdc-layout-grid__inner { grid-template-columns: repeat(var(--mdc-layout-grid-columns), minmax(0, 1fr)) }` per breakpoint | MDC, M2 (0–599: 4 · 600–904: 8 · ≥905: 12) [M2]; the common Figma practice of a 12/8/4 guide per frame (search-result tutorials, not Figma's own docs) |
| **Capped per breakpoint** | Flowkit: desktop 1–12, tablet 1–6, mobile landscape 1–4, mobile portrait 1–4 columns, class `Grid Layout [Breakpoint] [Count] Column Grid` [WF-fk] | Webflow Flowkit |
| **Two-column system by fractions** | `.govuk-grid-column-two-thirds { width: 66.67%; float: left }` from `tablet` (641px) up, `width: 100%` below [GOV] | GOV.UK |
| **Free count per grid**, changed per breakpoint by hand | Webflow: "remove columns on smaller breakpoints"; it fails if a manually placed or spanning child sits in the removed column [WF-grid]. Wix section grid: different rows × columns per breakpoint only in the *advanced* grid [WX-sg] [WX-adv]. Framer: `gridColumnCount` per breakpoint [FR-api] [FR-blog]. Figma: grid picker "Number of columns" per frame [FG-gal] | Webflow, Wix, Framer, Figma |
| **Auto-fit / auto-fill** (count follows a minimum width) | `grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr))`. Webflow: delete all but one column and row, set its min/max, tick *Auto-fit* [WF-grid]. Framer: `gridColumnWidthType: "minmax"` + `gridColumnMinWidth` [FR-api]; "set gaps and minimum column widths from the parent" [FR-svg] | Webflow, Framer (07-grid: AC-33) |

**For our design:** the page grid is a **fixed count per rung** (it is the page's coordinate system, so it cannot be
auto-fit); auto-fit stays the right tool for a *component's own* card grid (AC-33). Note Webflow's failure mode: reducing
the count at a breakpoint is blocked by children placed in the removed columns — our engine must **re-derive placement
per rung** rather than let the person delete columns.

## A2 — Breakpoint widths and the cascade

| System | Widths | Cascade |
|---|---|---|
| Webflow [WF-bp] | Desktop = base; Tablet ≤991 · Mobile landscape ≤767 · Mobile portrait ≤479; optional 1280 / 1440 / 1920 (`min-width`) | **Both ways from desktop**: down to smaller, up to larger; "once you override a style, it no longer inherits"; a larger breakpoint, once added, cannot be removed |
| Framer [FR-bp] [FR-blog] | Desktop (primary) / Tablet / Phone; defaults widely quoted as 1200 / 810 / 390 (search results); "the width shown on the canvas is also the **minimum** viewport width at which that breakpoint becomes active" | Others inherit from the primary; override per breakpoint; "add a breakpoint when the layout starts to fail, rather than by habit" |
| Wix Studio [WX-bp] | Desktop ≥1001 · Tablet 751–1000 · Mobile 320–750; up to 6 per page | **Desktop down**: "changes on smaller breakpoints don't affect larger breakpoints" |
| Figma Sites [FG-sites] | Desktop 1280 (primary) · Tablet 800 · Mobile 375 · custom | Primary cascades to the others |
| Bootstrap [BS] | xs <576 · sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400 | **Mobile-first** `min-width` (`col-md-6` applies from md up) |
| MDC [MDC] | phone 0 · tablet 600 · desktop 840 | mobile-first |
| M3 / Android [M3] | Compact <600 · Medium 600–839 · Expanded 840–1199 · Large 1200–1599 · Extra-large ≥1600 (dp = CSS px); height classes <480 / 480–899 / ≥900 | "Optimize compact first" |
| GOV.UK [GOV] | mobile 320 · tablet 641 · desktop 769 | mobile-first, columns stack below `tablet` |
| Builder (rule 18) | phone · 600 · 900 · 1200 · 1800, in `em`; `base` IS desktop | desktop-down, `wide` branches up — **the same model as Webflow** |

**For our design:** our rungs 600 / 900 / 1200 sit almost exactly on M3's 600 / 840 / 1200 (M3's own data: <600 = 99.96%
of phones in portrait; 600–839 = 93.73% of tablets in portrait; 840–1199 = 97.22% of tablets in landscape [M3]). So the
proposed counts change on the same lines Material changes them. Use `em` media queries (rule 18) or, for nested
contexts, container queries (A11).

## A3 — Outer margin and the content width

| Value | How it is made | Who |
|---|---|---|
| **Fixed margin, fluid body** | `padding-inline: 16px` (phone) / `32px` (tablet); body = the rest | M2 0–599 (16) and 600–904 (32) [M2]; MDC margins `phone 16 · tablet 16 · desktop 24px` [MDC]; M3 margins 16dp compact, 24dp medium/expanded [M3] |
| **Fluid margin, fixed body** (the two alternate up the ladder) | `max-width: 840px; margin-inline: auto` at 905–1239; margin 200 fixed at 1240–1439; body 1040 fixed at ≥1440 [M2] | M2 |
| **Max-width container + auto margins** | `.container { width: 100%; padding-inline: calc(var(--bs-gutter-x) * .5); margin-inline: auto; max-width: 540/720/960/1140/1320px }` per tier; `.container-fluid` = 100%; `.container-md` = 100% until md [BS]. Webflow container: `max-width: 940px` desktop, `728px` tablet, full width on mobile, `margin: 0 auto` [WF-cont] | Bootstrap, Webflow |
| **Gutter, then centred past the page width** | `max-width: 960px; margin-inline: 15px` → `30px` from tablet → `auto` once the viewport > 960 + 2×30 (= the "1020px" the docs page quotes) [GOV] | GOV.UK |
| **Safe-area aware margin** | `margin-left: max(15px, calc(15px + env(safe-area-inset-left)))` inside `@supports (margin: max(calc(0px)))` [GOV] | GOV.UK (notches, rounded corners — a phone in landscape) |
| **Side TRACKS with a floor** (margin is part of the grid) | `grid-template-columns: [full-start] minmax(var(--gut), 1fr) [content-start] min(75rem, 100% - 2*var(--gut)) [content-end] minmax(var(--gut), 1fr) [full-end]` — RM uses `--full: minmax(var(--gap), 1fr)` and `--content: min(50ch, 100% - var(--gap) * 2)` [RM]; JC uses `1fr min(42rem, 100%) 1fr` [JC]; Nexter `minmax(6rem, 1fr)` (08) | Mulligan, Comeau, Nexter |
| **Site max width with per-section opt-out** | Wix: default max width **1600px** for all sections (must be >1001px); beyond it "sections stop expanding and fixed margins appear"; toggle *Apply max width* per section / page / site; new sections get it by default [WX-max] | Wix Studio |
| **Margin set on the guide, not the page** | Figma *Stretch* guide: `Margin` = space between the outer columns and the frame [FG-guides]; Framer guides: margins + width per breakpoint [FR-guides]; Wix Design Guides: margin + gutter + count [WX-dg] | Figma, Framer, Wix |

**For our design:** the side-tracks form is the only one where **bleed is a placement** (A10) rather than a different
container, and where the margin floor is measured by the same engine as the columns. It replaces today's per-band
`bandGutter` / `pageBandInset` arithmetic (where a `calc(100% ± gut)` rounding left a menu one 1/64 px short — see the
comment at `lib/box-model.ts` `bandGutter`). Content max width: Bootstrap 1320px, M2 1040px, Webflow 940px, GOV.UK 960px,
Wix 1600px — a reading page wants the M2/GOV.UK end; a marketing page the Bootstrap end. Make it a **site token**
(AC-9), in `rem`.

## A4 — Gutter

| Value | How it is made | Who |
|---|---|---|
| **Fixed px per breakpoint** | MDC `$default-gutter: (desktop: 24px, tablet: 16px, phone: 16px)`, overridable at runtime by `--mdc-layout-grid-gutter-<device>` [MDC] | MDC |
| **Constant rem** | `$grid-gutter-width: 1.5rem` → `.row { margin-inline: calc(-.5 * var(--bs-gutter-x)) } .row > * { padding-inline: calc(.5 * var(--bs-gutter-x)) }`; CSS-grid mode: `gap: var(--bs-gap, 1.5rem)` [BS] | Bootstrap |
| **Doubles at a breakpoint** | `$govuk-gutter: 30px; $govuk-gutter-half: 15px`; columns `padding: 0 15px`, row `margin: 0 -15px` [GOV] | GOV.UK |
| **Token scale** | `Grid Layout Grid Gap XXS … XXL` combo classes [WF-fk] | Webflow Flowkit |
| **Fluid** | `--gap: clamp(1rem, 6vw, 3rem)` [RM] — note: no `rem` in the ideal term (our rule 16 requires `clamp(1rem, .5rem + 2vw, 2rem)`) | Mulligan |
| **Across ≠ down** | `gx-*` / `gy-*` [BS]; Webflow gap lock icon, unlocked = separate [WF-grid] [WF-qs]; Figma *Gap between rows* / *columns* [FG-gal]; Wix horizontal / vertical gap [WX-sg] | all |
| **Dragged on the canvas** | Webflow Quick Stack: "hovering over the gap between 2 cells, and clicking and dragging" (both if locked, one axis if unlocked) [WF-qs] | Webflow |
| **Spacer between panes** | 24dp, may carry a drag handle to resize panes [M3] | M3 |
| **Gutter as a TRACK** (so a column's half-line is exact) | `repeat(N-1, [c] minmax(0,1fr) [m] minmax(0,1fr) [ce] var(--gap)) [c] minmax(0,1fr) [m] minmax(0,1fr) [ce]; column-gap: 0` — derived here, see A7 | — (our proposal) |

**Lesson:** the gutter is the one thing every system lets grow with the screen (MDC 16→24, GOV.UK 15→30, M3 16→24). Our
rule 16 does that continuously: `--gap: clamp(1rem, .75rem + 1vw, 1.5rem)`.

## A5 — Column width

| Value | How it is made | Who |
|---|---|---|
| **Equal shares that never blow open** | `repeat(12, minmax(0, 1fr))` — "to ensure columns are equally sized and don't overflow" [TW]; `.mdc-layout-grid__inner` the same [MDC] | Tailwind, MDC, builder (07) |
| **`fr` that can be resized by dragging** | Webflow: drag the column header on canvas or type a size; `px/em/rem/fr`, min/max (`min 200px, max auto`) [WF-grid]; "the FR unit automatically calculates row and column space while adjusting for gaps" [WF-fr]. Figma: dragging a track edge sets it **Fixed**; *Fill container* = `fr`; *Hug contents* = auto; typing `Auto` = `1fr` [FG-gal]; `GridTrackSize` is `FLEX` or `FIXED` [FG-api] | Webflow, Figma |
| **%** | `govuk-grid-column-one-third { width: 33.33% }` [GOV]; Bootstrap `.col-4 { width: 33.33333333% }` [BS]; Wix advanced grid `%` [WX-adv] | GOV.UK, Bootstrap, Wix |
| **Fixed width columns** | `.mdc-layout-grid--fixed-column-width`: 72px columns on all devices, the grid aligned left/right/centre [MDC]; Framer `gridColumnWidthType: "fixed"` + `gridColumnWidth` [FR-api]; Figma fixed-type guides (`Width`, `Offset`) [FG-guides] | MDC, Framer, Figma |
| **Bounded** | Wix: `Min/max` — "max 1fr … minimum 380 pixels so it doesn't get any smaller" [WX-acad]; Nexter `repeat(8, minmax(min-content, 14rem))` (08) | Wix, Nexter |
| **Content-sized** | `max-content`, `min-content` (= longest word), `fit-content(300px)` = `min(max-content, max(auto, 300px))` [MDN-fit]; Wix "Min/Max content … prevents rows/columns from getting smaller than the minimum content" and `max-c` width [WX-adv] [WX-size]; Bootstrap `.col-md-auto` "variable width content" [BS] | Wix, Bootstrap, CSS |
| **Viewport / calc** | Wix `vw`/`vh` tracks and a *Calculation* formula [WX-adv] | Wix |

A useful measurement: at 1200px with a 24px gutter and 32px margins, a 12-column column is `(1136 − 11×24) / 12 ≈ 72.7px`
— exactly MDC's fixed column width. On a 360px phone (16px margins, 16px gutter, 4 columns) a column is `(328 − 48) / 4 =
70px`; at 600px (8 columns) ≈ 46px; at 900px (12 columns) ≈ 48px. **The two tablet rungs are where columns are
narrowest** — the place the content-minimum rule (A8) will bite first.

## A6 — Alignment of the grid in its frame

| Value | How | Who |
|---|---|---|
| **Stretch** | columns fill the frame minus margins; `alignment: 'STRETCH'`, only Stretch has *Margin* and *Gutter* [FG-guides] [FG-api] | Figma (and every fluid grid) |
| **Centre** | fixed-width columns centred; `alignment: 'CENTER'` ignores `offset` [FG-api]; MDC fixed-column-width grid centred by default | Figma, MDC |
| **Left / right (start / end)** | `alignment: 'MIN' / 'MAX'` + `offset` from that side [FG-api]; `.mdc-layout-grid--align-left / --align-right` [MDC] | Figma, MDC |
| **Top / centre / bottom (row guides)** | row guide types Top / Center / Bottom / Stretch [FG-guides] | Figma |
| **Constraints follow the guide** | with a *Stretch* guide, an object's constraints are relative to its nearest column; with a *fixed* guide, relative to the frame [FG-cons] | Figma |

**For our design:** the page grid is always **stretch inside a centred content box** (A3). Start/end alignment only
matters for a component with fixed-width tracks (AC-30). Figma's constraint rule is worth copying for snapping: a block
dropped on the page grid remembers **lines**, not pixels.

## A7 — Placement unit

| Value | How it is made | Who |
|---|---|---|
| **Auto-flow, next free cell** | default `grid-auto-flow: row`; Webflow "every new grid child will populate an individual grid cell … left to right"; direction horizontal / vertical [WF-grid]; Figma "automatic positioning" — deleting a child makes siblings refill [FG-gal] | all |
| **Manual (pinned) cell** | Webflow: Shift-drag into the grid or *Position: Manual*; "manually-placed grid children remain in their designated grid cell" [WF-grid]. Figma: *Toggle automatic positioning* off "to preserve empty cells" [FG-gal] | Webflow, Figma |
| **Whole column start + span** | `.g-col-4.g-start-6` → `grid-column: 6 / span 4` [BS]; `col-start-3 col-span-6` [TW]; `.offset-md-3` (= `margin-left: 25%`) in the flex grid [BS]; MDC `--span-<n>-<device>` | Bootstrap, Tailwind, MDC |
| **Named fraction** | `govuk-grid-column-two-thirds-from-desktop` [GOV] | GOV.UK |
| **Named area** | Webflow areas drawn on the canvas, children *Position: Area*, an area layout reused through the class [WF-areas]; `grid-template-areas` | Webflow, CSS |
| **Free offset inside a cell (docking)** | Wix: every element auto-docks to the **top** and the **nearer of left/right** of its parent (section, container, stack, cell); manual dock top / bottom / left / right / centre + margins in `px*` [WX-dock] | Wix Studio |
| **Absolute** | Framer: absolute layers pin to the parent Frame's edges — "badges, decorative artwork" [FR-pos] | Framer |
| **Half-column** | **No source offers it natively.** Every system places on whole columns, cells or free pixels | — |

**How half-columns can be made** (our proposal, derived from MDN-names + RM):

```css
/* one rung (12 columns); the engine writes literal counts per rung — no calc() in repeat() needed */
.eu-page {
  --gut: clamp(1rem, .5rem + 2.5vw, 2.5rem);   /* outer margin floor */
  --gap: clamp(1rem, .75rem + 1vw, 1.5rem);    /* gutter */
  display: grid;
  column-gap: 0;                               /* gutters are tracks, so a half-line is exact */
  grid-template-columns:
    [full-start] minmax(var(--gut), 1fr)
    [content-start] repeat(11, [c] minmax(0, 1fr) [m] minmax(0, 1fr) [ce] var(--gap))
    [c] minmax(0, 1fr) [m] minmax(0, 1fr) [ce content-end]
    minmax(var(--gut), 1fr) [full-end];
}
/* whole columns 3–6:  */ .a { grid-column: c 3 / ce 6; }
/* start at half of 3: */ .b { grid-column: m 3 / ce 6; }
```

`c n` = the n-th column's start line, `m n` = its middle, `ce n` = its end (MDN-names: repeated names are counted,
`col-start 7`). With `column-gap` the halves of one column would be split by a gutter; making the gutter its own track
keeps `m n` at the true centre. The alternative — a doubled grid (24 tracks) with the gap — puts a gutter inside every
column and makes a half-line land on a gutter edge, not the column centre.

**Lesson:** half-placement is an Educo addition. Keep it a **snapping option, not the default**: whole columns default,
half-lines only when the person drops there (with the guide showing it) — otherwise every page gets ragged.

## A8 — Span rules

| Value | How it is made | Who |
|---|---|---|
| **Explicit span** | `grid-column: span 4 / span 4` (`col-span-4`) [TW]; Framer `gridItemColumnSpan`, `gridItemRowSpan` [FR-api]; Figma *Column span* / *Row span* — the child must be *Fill container*, then resize until it snaps to a cell edge [FG-gal]; Webflow drag to span or type start/end [WF-grid] | all |
| **All columns** | `col-span-full` = `grid-column: 1 / -1` [TW]; Framer span `"all"` [FR-api] | Tailwind, Framer |
| **Relative to the end** | Webflow: navbar `1 / -1`; footer row `-1 / -1`; **centred main content `3 / -3`** — "if you remove columns on smaller breakpoints, the child will remain centered" [WF-grid] | Webflow |
| **Default span** | MDC: a cell with no span class spans **4** [MDC] → 1 across on a phone (4), 2 on a tablet (8), 3 on desktop (12) with no per-device setting | MDC |
| **Wrap when the line is full** | `.col-9` + `.col-4` = 13 > 12 → the 4 wraps "as a unit" [BS]; Figma creates rows/columns or moves obstructing objects [FG-gal] | Bootstrap, Figma |
| **Minimum width → count** | `repeat(auto-fit, minmax(min(100%, X), 1fr))` [WF-grid] [FR-api] | Webflow, Framer |
| **Content minimum** | CSS: a grid item's `min-width: auto` keeps it ≥ its min-content in an `auto`/`1fr` track, but **not** in `minmax(0,1fr)` (07). Bootstrap `.col-auto`; Wix "min-content" tracks [WX-adv] | partial everywhere; nobody derives a span from the content |
| **Merge cells** | Wix: Shift-select + *Merge* — "merges the grid cells on all breakpoints" [WX-sg]; Webflow Quick Stack merge left/right/up/down, "the content of the cell you're merging into will be removed" [WF-qs] | Wix, Webflow |

**Content decides the span — how our engine can do it** (no source does this; it is the user's requirement):

1. Measure each block's **min-content inline size in `em`** (its longest unbreakable word, plus its own padding) — in
   `em`, so a reader's 150% text size raises it (WCAG 1.4.4).
2. For each rung, take the rung's **narrowest** width (its lower bound, e.g. 600px for tablet portrait, 360px for a
   phone — RULE AF), compute that rung's column width `w` and gutter `g`.
3. `minSpan = ceil((minContent + g) / (w + g))`; the block's span at that rung is `max(asked, minSpan)`, capped at the
   column count; a row whose spans no longer fit **wraps** (Bootstrap's rule) — never squeezes.
4. Emit `overflow-wrap: normal` for words (the builder already chose "words never break", commit `7aa75e5`) so the
   measure and the page agree; keep `minmax(0, 1fr)` so nothing ELSE widens a track.

```css
/* what the engine emits for a block whose longest word needs 2 columns on a phone */
.blk-17 { grid-column: c 1 / ce 2; }                        /* phone: span 2 of 4, asked 1 */
@media (min-width: 37.5em) { .blk-17 { grid-column: c 3 / ce 4; } }  /* tablet: asked span 2 of 8 */
```

## A9 — Row model

| Value | How it is made | Who |
|---|---|---|
| **Auto rows (content)** | `grid-auto-rows: auto`; Webflow Quick Stack "each row's size is set to auto" [WF-qs]; Figma *Number of rows: Auto* — empty rows removed [FG-gal]; Framer `gridRowHeightType: "auto"` [FR-api] | all |
| **Fit** | Framer `gridRowHeightType: "fit"` [FR-api] | Framer |
| **Fixed** | Framer `"fixed"` + `gridRowHeight` [FR-api]; Wix px* rows on *Scale proportionally* / *Fixed height* sections [WX-sg] | Framer, Wix |
| **Min, grows with content** | Webflow `min 200px / max auto` [WF-grid]; `minmax(12.5rem, auto)` | Webflow |
| **Share of a fixed-height band** | Wix `%` rows on *Fit to screen* sections (100vh) [WX-sg] [WX-size]; Nexter `1fr` rows in an `80vh` hero (08) | Wix |
| **Baseline grid** | M2 8dp baseline, 4dp for type (the M2 page — not readable, quoted in search results); Figma row / uniform guides [FG-guides] | Material, Figma |
| **Subgrid rows** | card title / text / button aligned across cards: `.card { grid-row: span 3; grid-template-rows: subgrid }` (08: AC-36) [MDN-sub] | CSS |

**For our design:** the page grid is a **column** grid; rows are each section's own (auto). Do NOT make page-level rows
(only the overlap technique in A10-c would want them). Webflow and Wix tie row units to the section's height mode — our
equivalent is the band height choice (AC-3).

## A10 — Bleed

| Value | How it is made | Who |
|---|---|---|
| **a. Full-bleed** | `.full { grid-column: full }` (named lines from A3) [RM]; `grid-column: 1 / -1` [JC]; in container systems: a section outside the container — Webflow "sections are full-width by default … a container inside keeps content centred" [WF-cont]; Wix: exclude the section from max width [WX-max]; Bootstrap: "drop the `.container` and add `.mx-0` to `.row`" [BS] | all |
| **b. Popout / feature** (a little wider than the text column) | `[full-start] minmax(var(--gap),1fr) [feature-start] minmax(0,5rem) [popout-start] minmax(0,2rem) [content-start] min(50ch, 100% - var(--gap)*2) [content-end] minmax(0,2rem) [popout-end] minmax(0,5rem) [feature-end] minmax(var(--gap),1fr) [full-end]`; `.popout { grid-column: popout }` — the popout / feature tracks **collapse to 0** on a narrow screen [RM] | Mulligan |
| **c. Half-bleed** (one side to the window edge, the inner edge on the content grid) | `grid-column: full-start / ce 6` beside `c 7 / full-end` (Nexter's `full-start / col-end 6`, 08 — AC-35) | Nexter; **none of the four builders** |
| **d. Overlap into the neighbour section** | (i) `margin-block-start: calc(-1 * var(--lap)); position: relative; z-index: 1` — `position` is needed because block backgrounds paint before ALL inline content in a stacking context, so the previous section's words would draw over the card's background; the section BELOW paints after and covers it unless the card is positioned with a higher `z-index`; (ii) `translate: 0 50%` straddles an edge but leaves its old space (Nexter's name label, 08); (iii) both sections as items of ONE grid, the card `grid-row: 1 / 3` — exact, responsive, no magic number, but the card must be a child of that grid, not of either section | CSS; Webflow manual children "automatically overlap when they intersect" + Navigator / z-index order [WF-grid]; Framer absolute layers for overlap [FR-pos]; Figma free frames |
| **e. Overlap inside one cell / area** | two items given the same area overlap, later on top, `z-index` to reorder [WF-areas] [WF-grid] (07: AC-31) | Webflow |

**What breaks bleed:** `overflow: hidden` on the section (use `overflow: clip` only where intended); `max-width` on an
intermediate wrapper (a band that is not on the page grid — hence subgrid, A11); a negative margin larger than the gap
on a phone (reset the overlap per rung, or scale it with `clamp()` down to 0). RTL: use logical properties
(`margin-block-start`, `inset-inline-start`); grid lines are already logical (A15).

**Lesson:** the builders offer **full or contained** per section and **free overlap** via absolute/manual placement;
none offers half-bleed or popout as a choice. With named lines all five are ONE property (`grid-column`) on the same
grid — that is the differentiator, and it keeps bleed responsive (no absolute positioning, no pixel offsets).

## A11 — Nesting

| Value | How it is made | Who |
|---|---|---|
| **Independent grid in a cell** | Webflow: add a structure element (div) as the grid child, then Cmd/Ctrl-drag elements into it [WF-grid]; Figma nested auto layout frames, each with its own padding/gap [FG-gal] | Webflow, Figma, Framer |
| **Nested grid, same counts, no margins** | "Nested grids have 12 columns on desktop, 8 on tablet and 4 on phone … use the same gutter size as their parents, but margins are not re-introduced" [MDC] — the nested 12 are NOT the page's 12 | MDC |
| **Nested row re-declares 12** | `.col-sm-9 > .row > .col-8` [BS]; CSS-grid mode: a nested `.grid` inherits `--bs-columns` unless overridden (`style="--bs-columns: 12"`) [BS] | Bootstrap |
| **Flex inside the cell** | Webflow Quick Stack cells are vertical flex divs; "can add padding but not margin to a Quick Stack cell" [WF-qs] [WF-lay]; Wix stacks / flexboxes inside cells [WX-fg] | Webflow, Wix |
| **Subgrid (columns)** | `.section { grid-column: full; display: grid; grid-template-columns: subgrid; }` — the parent's tracks AND **line names** pass through (`c 3`, `content-start` still work inside); line numbers restart at 1; gaps are inherited and overridable; extra names can be added: `subgrid [a] [b]` [MDN-sub] | CSS; Tailwind `grid-cols-subgrid` [TW]; none of the four builders expose it |
| **Subgrid (rows)** | aligned card parts (AC-36) [MDN-sub] | CSS |

**Subgrid caveats that shape our design** [MDN-sub]:
- **No implicit tracks in a subgridded axis** — a section that subgrids columns cannot auto-create columns; fine for the
  page grid (columns are fixed per rung), but rows of an auto-flowing list must NOT be subgridded (keep
  `grid-auto-rows`).
- A subgrid must **span** the lines it wants: the section spans `full`, a card spans `c 2 / ce 5`, and its children use
  the page names; a component that does not span whole page columns cannot subgrid meaningfully → independent grid.
- **Support:** Chrome/Edge 117, Firefox 71, Safari 16 (browser-compat-data), Baseline "widely available" since
  September 2023 [MDN-sub]; Samsung Internet and Android WebView follow Chromium 117. AC-23's audience check still
  applies: the fallback (`grid-template-columns: repeat(N, minmax(0,1fr))` written before the `subgrid` line, inside
  `@supports not (grid-template-columns: subgrid)`) puts children on the section's own equal columns — the same look
  minus cross-section alignment.
- **Container queries + the page grid:** an `inline-size` container **loses its intrinsic inline size** [MDN-cq] — fine
  for a section spanning fixed lines; never put `container-type` on a block whose span is decided by its content
  (A8), or the measure is 0. Container queries are for a *component* adapting inside the span it was given
  (`@container (inline-size < 30em)`), the page grid itself responds to the viewport rungs.

## A12 — How guides are SHOWN in the editor

| What | Webflow | Framer | Wix Studio / Harmony | Figma |
|---|---|---|---|---|
| Kind | grid **edit mode** overlay: row/column headers on the canvas, "plus" on hover to add an area, drag headers to resize, drag a handle to reorder [WF-grid] [WF-areas] | layout grid **guides** (columns or rows) per breakpoint: type, gap, margins, width [FR-guides] | section grid cells always drawn; Harmony layout guides: **Columns / Blocks / Dots** with count, margins, gaps, colour, opacity [WX-lg]; Studio itself has **no rulers or guides** — use the *Design Guides* add-on (rows / columns / cells, gutter, margin, colour, opacity) [WX-ruler] [WX-dg] | **layout guides**: uniform grid, columns, rows; several per frame; default red `#FF0000` at 10% [FG-guides] |
| When visible | while in edit mode | "Show Guides" in the View menu — **only when a breakpoint is selected** [FR-guides] | Harmony: **Always** or **On drag only** [WX-lg] | toggled for the whole file with **Shift G**, per guide with the eye icon; "layout guides will still work, even when they aren't visible" [FG-guides] |
| Snapping | to cells / areas | to the guides | **green snap lines** when an element aligns with a guide [WX-lg] | constraints follow the nearest column of a Stretch guide [FG-cons]; grid children snap to cell edges when resized [FG-gal] |
| Published? | n/a (grid is real CSS) | "do not appear on your published site" [FR-guides] | "only visible in the editor" [WX-lg] [WX-dg] | design-only |
| Reuse | grid-area layouts reused through the class "act similarly to components" [WF-areas] | per-breakpoint settings | site-wide settings [WX-lg] | **layout guide styles** [FG-guides] |
| Labels | track sizes on headers | — | — | track size label on the blue pill [FG-gal] |

**For our design:** combine the best: **on drag + while a block is selected** (Wix "on drag only", Webflow edit mode),
a **toggle with a shortcut** (Figma Shift+G — pick a free key, e.g. `Ctrl+'`, and show it in the menu per rule 2),
**per-rung** guides (Framer), **green snap lines** at column and half-column lines (Wix), the **span label** on the
block while dragging ("6 of 12 · 3 of 8 · 4 of 4" — none of the tools shows the other rungs' result; ours can, because
it derives them), the shaded **margin** and the **bleed zones** outside `content` (so full / half-bleed are drop
targets). Guides must pass contrast in every theme (a 10% red tint does not meet 3:1 for non-text — use a token colour
for the line, the tint only for fill).

## A13 — Mapping a block's "N across" onto the grid

| Mechanism | What it does | Who |
|---|---|---|
| **Presets** | Quick Stack: 1 · 2 · 3 · 4 columns · 2+1 · 1+2 · 2×2 · formatted 2×2 (spans 2+1 / 1+2); 20px gap; columns `1fr`, rows `auto`; recommended "for most layouts" [WF-qs] [WF-vs] [WF-lay] | Webflow |
| **Section grid layouts** | Rows / Columns / Collage …; changing layout "will not move your elements"; max **16 cells**; split horizontally / vertically, merge, swap content [WX-sg] | Wix |
| **Row columns** | `.row-cols-1 .row-cols-sm-2 .row-cols-md-4` sets the per-tier count of equal children [BS] | Bootstrap |
| **Default span** | span 4 → 1/2/3 across on 4/8/12 automatically [MDC] | MDC |
| **Grid picker** | interactive rows × columns selector [FG-gal]; the builder's table picker (07) | Figma, builder |
| **Auto rows at smaller breakpoints** | Quick Stack: below desktop the rows field becomes "Auto" and is filled from the column count to fit the cells; per-breakpoint cell span and order (first / last / custom) [WF-qs] | Webflow |

**The divisibility table** (equal blocks, whole columns; † = not exact, needs a rule):

| Across on desktop | 12 cols (span) | 8 cols | 4 cols |
|---|---|---|---|
| 1 | 12 | 8 | 4 |
| 2 | 6 | 4 (2 across) | 4 (1 across) or 2 (2 across if content fits) |
| 3 | 4 | † 2 across of span 4 + a 3rd wrapping; or an independent `repeat(3,1fr)` | 4 (1 across) |
| 4 | 3 | 2 (4 across) or 4 (2 across) | 2 (2 across) or 4 |
| 6 | 2 | † 4 across of 2 + wrap, or 2 across of 4 | 2 (2 across) or 1 (4 across — tiny) |

**For our design:** derive each rung's spans from the desktop span **by ratio** (`span × cols / 12`), round to whole
columns, then apply the content minimum (A8) and wrap. The † cases (3 and 6 across on 8 columns) are the honest cost of
4/8/12 (see the comparison below): offer the person the two outcomes in the inspector at that rung, default to **2
across**, which is also what Material's default span 4 produces.

## A14 — Per-breakpoint overrides (what can change where)

| | Per breakpoint | Global (all breakpoints) |
|---|---|---|
| Webflow [WF-bp] [WF-grid] | every Style-panel value; grid child position / span / order / alignment ("grid child settings apply only to the selected element", pink = this breakpoint, orange = inherited); grid areas repositioned / resized per breakpoint [WF-areas]; display none | element hierarchy and order ("you can't reorder elements for a specific breakpoint by moving them around" — except grid / flex order); content; element settings; **Grid editing and Quick Stack options set by content editors** |
| Wix Studio [WX-bp] [WX-sg] [WX-dock] | position, size, docking within the same parent, visibility, design; advanced-grid rows / columns | reparenting ("moving elements between parents"), data, deletion; **section-grid cell merges**; switching to advanced grid is one-way ("not possible to switch back") |
| Framer [FR-bp] [FR-guides] | type size, stack direction, gap, padding, width, visibility, grid settings, guides | structure (one page, inherited layouts) |
| Builder today | `ResponsiveOverride` covers `colStart` / `rowStart` / spans / order per rung (07) | the tree |

**Lessons:** (1) Webflow's "you cannot reorder by dragging at a breakpoint" and Wix's "reparenting is global" are the
same rule our model already has (one tree) — keep it; placement is per rung, structure is not. (2) Wix's one-way
*advanced grid* switch is a trap to avoid: the page grid must never be a mode a person cannot leave. (3) Webflow's
colour-coded "set here / inherited" labels are the right inspector pattern for per-rung spans.

## A15 — Accessibility and reading order with placement

- **Source order is the reading and Tab order.** Webflow on `dense`: "This can be bad for accessibility, as it only
  alters where items display, not where they appear in the page's source" [WF-grid]; on areas: "their position in the
  document order doesn't change … move the explicit grid children in the Navigator to be the order you want users to
  read" [WF-areas]. WCAG 1.3.2 (meaningful sequence), 2.4.3 (focus order).
- **`reading-flow`** (`grid-rows` · `grid-columns` · `grid-order` · `source-order` + `reading-order` on children) makes
  Tab and screen readers follow the visual grid order [MDN-rf] — **Chrome 137 only, marked experimental**
  (browser-compat-data, 2026-10). Not a basis for the export yet; could be added as progressive enhancement later.
- **Rule for the engine:** placement may only move a block **within its row band** visually; a placement that would put a
  later block visually before an earlier one at any rung is flagged by the page audit (the 07 note), and on a phone
  (4 columns) the default is source order.
- **RTL:** "line 1 is the start line and line -1 is the end line, no matter which writing mode you are in" — the same
  `grid-column: c 3 / ce 6` mirrors in Arabic with no extra CSS [MDN-wm]; half-bleed `full-start / ce 6` becomes
  right-bleeding automatically. Bleed overlaps must use logical properties (RULE AF: Arabic is on the language list).
- **Reflow (WCAG 1.4.10)** at 320 CSS px and **text at 200% / 150%** (1.4.4): `rem` gutters and `em` content minimums
  mean larger text → fewer columns fit → spans grow / rows wrap, never sideways scroll. MDC's px gutters and
  Bootstrap's px breakpoints do not do this; ours must (rule 16).

---

## The proposed 4 / 8 / 12 per rung, compared

| Rung (builder) | Proposed | Material (M2 / MDC / M3) | Bootstrap | Webflow Flowkit | Wix / Framer / Figma |
|---|---|---|---|---|---|
| phone < 600 | **4** | 4 (0–599) | 12, but `.col-*` defaults to 100%; `.col-6` = 2 across | 1–4 | free per grid |
| tablet portrait 600–899 | **8** | 8 (600–904 M2; 600–839 MDC/M3) | 12 (sm 576 / md 768) | 1–6 | free |
| tablet landscape 900–1199 | **12** | 12 (≥905 M2; ≥840 MDC) | 12 (lg 992) | 1–12 | free |
| desktop 1200–1799 | **12** | 12 | 12 (xl 1200) | 1–12 | free |
| big desktop ≥ 1800 | **12** | 12, body fixed 1040 | 12 (xxl 1400, container 1320) | 1–12 | Wix max width 1600 |

**What 4/8/12 gets right:** it is Material's own ladder, its boundaries land within 60px of ours, its columns stay a
usable 46–73px wide at every rung (A5), and a span of 4 naturally gives 1 → 2 → 3 across (MDC's default). 12 on a
360px phone would make 22px columns — every block would need its content-minimum override, and the guides would be noise.

**What it costs:** 3-across and 6-across cannot be exact on 8 columns (A13 †). Bootstrap avoids this by keeping 12
everywhere and letting phones collapse to 100%; Webflow Flowkit caps tablet at 6 (which loses 4-across instead).

**Recommendation:** keep **4 / 8 / 12** as the page grid and the visible guides — it is the best-evidenced ladder and
it matches our rungs. Handle the † cases with two rules rather than a different count: (1) a 3- or 6-across row at
8 columns defaults to **2-across (span 4)** with the last item spanning the full width or centred, chosen in the
inspector; (2) a row that must stay 3-across at tablet becomes an **independent equal grid** (`repeat(3, minmax(0,1fr))`
aligned to `content-start / content-end`, not subgridded) — outer edges still on the page lines, inner lines its own.
Store placement **per rung in that rung's units** (whole columns, half-lines optional), derived by ratio from desktop
until the person overrides it; the content minimum (A8) is applied after the ratio, always.

---

## The five most important lessons for our page grid

1. **Make the margin and the bleed part of the grid** — named side tracks `[full-start] minmax(var(--gut),1fr)
   [content-start] … [content-end] minmax(var(--gut),1fr) [full-end]` (RM, JC, Nexter). Then full, popout, half-bleed
   and "stay in the content" are all just `grid-column`, responsive and RTL-correct for free — something none of
   Webflow, Framer, Wix or Figma offers as a choice (they have "contained or full-width section" plus free overlap).
2. **Lines, not pixels, are what a block remembers** (Figma's stretch-guide constraints, Webflow manual placement,
   `grid-column: c 3 / ce 6`). Store per-rung line placement; derive narrower rungs by ratio + content minimum; never
   let a person "delete columns" at a rung (Webflow's failure mode when placed children sit in them).
3. **Content decides the minimum, the person decides the rest** — no builder does this; it is our requirement and it
   needs an engine step: min-content in `em` at the rung's narrowest width → `minSpan` → wrap, never squeeze, never
   break words. It is what makes 150% text and a 360px phone safe by construction.
4. **Guides are a placement aid, shown when placing, snapping to lines, per rung, and never in the published page**
   (Wix "on drag only" + green snap lines, Figma Shift+G toggle, Framer per-breakpoint guides) — plus what only we can
   show: the span label for every rung at once and the bleed zones as drop targets.
5. **Subgrid for page-aligned nesting, an independent grid for everything else** — subgrid passes the page's named
   lines into sections and cards (Baseline since 2023), but has no implicit tracks and needs a whole-column span; a
   component that doesn't sit on whole page columns, or a 3-across row on 8 columns, gets its own grid aligned to the
   content edges. Reading order stays source order (reading-flow is Chrome-only); avoid one-way modes (Wix advanced
   grid) and keep structure global, placement per rung (Webflow, Wix).

---

## Could not read (and why)

| Source | Why | What was used instead |
|---|---|---|
| m3.material.io (layout, spacing, window size classes) | client-rendered; fetch returned only the title | developer.android.com window size classes (full) + M3 margins / spacer from a mirrored search result |
| m2.material.io *Responsive layout grid* | client-rendered | the MDC source (`_variables.scss`, README) + the M2 table as quoted in search results |
| Webflow University video lessons (*Span grid content*, *Flexbox vs grid vs Quick Stack*) | video only, page marked "no longer maintained" | the Webflow Help Center articles, fetched in full through its public article API |
| webflow.com/grid | response header overflow | Help Center *Grid* article |
| Framer — a dedicated grid help article | none exists; Academy lesson pages hold only summaries (the lessons are video) | Framer plugin API `GridLayout` / `FrameNode` traits (the canonical list of grid properties) |
| Framer *Masonry* update page | timed out | — (masonry is already covered in the builder, `aa6d32f`) |
| Wix *Editor X: Using grids* | 404 (retired) | Wix Studio section-grid and advanced-grid articles |
| uxdesign.cc *Figma's new grid* | 403 | Figma Help *Use the grid auto layout flow* (full) |
| Wix Studio rulers and guides | not a source failure: the feature **does not exist** in Studio [WX-ruler] | Design Guides add-on, Harmony layout guides |

Not visited (by design, this file's scope): live sites built with each tool, measured in a browser — the next step of
RULE MAP (an example per value, then combinations proven in the browser) builds them.
