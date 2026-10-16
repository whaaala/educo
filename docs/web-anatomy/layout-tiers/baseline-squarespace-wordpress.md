---
title: Baseline — Squarespace (7.1, Fluid Engine) and the WordPress block editor (BATCH RX-3)
---

# Baseline — Squarespace 7.1 (Fluid Engine) and the WordPress block editor (BATCH RX-3, 2026-10-16)

What each product gives a person for LAYOUT, row for row against
[`00-capabilities.md`](00-capabilities.md). Read from official documentation only (support.squarespace.com,
wordpress.org/documentation, developer.wordpress.org, make.wordpress.org dev notes), 2026-10-16. WordPress means core
(no plugins) with a block theme in the Site Editor, WordPress 7.0 / 7.1 docs as published on that date.

**Builds on, does not redo:** [`../page-grid/01-builders-and-systems.md`](../page-grid/01-builders-and-systems.md) covers
Webflow, Framer, Wix and the design systems for the page grid (axes A1–A15). It does **not** cover Squarespace or
WordPress (searched 2026-10-16: no mention), so nothing here repeats it; where the two products answer one of its axes
(column count, span, bleed, guides) the row says so.

Cells read **HAS · PARTLY · NO — control — how**. "Not documented" means the official docs do not say; it is not a
measured NO.

## Sources (tag → URL)

| Tag | Source |
|---|---|
| SQ-fe | Edit your site with Fluid Engine — https://support.squarespace.com/hc/en-us/articles/6421525446541 |
| SQ-mob | Design mobile page layouts in Fluid Engine — https://support.squarespace.com/hc/en-us/articles/46306741295757 |
| SQ-sec | Style page sections — https://support.squarespace.com/hc/en-us/articles/46489938125965 |
| SQ-ps | Page sections — https://support.squarespace.com/hc/en-us/articles/360027987711 |
| SQ-move | Moving blocks to customize layouts — https://support.squarespace.com/hc/en-us/articles/206543987 |
| SQ-size | Resizing blocks — https://support.squarespace.com/hc/en-us/articles/206543647 |
| SQ-stk | Create multi-block layouts with Stacks — https://support.squarespace.com/hc/en-us/articles/46663474488205 |
| SQ-pin | Pin blocks in Fluid Engine — https://support.squarespace.com/hc/en-us/articles/41657869929741 |
| SQ-hdr | Build your site header — https://support.squarespace.com/hc/en-us/articles/360000667707 |
| SQ-ftr | Edit your site's footer — https://support.squarespace.com/hc/en-us/articles/205816028 |
| SQ-auto | Auto layouts — https://support.squarespace.com/hc/en-us/articles/360057763852 |
| SQ-img | Image blocks · Using focal points — https://support.squarespace.com/hc/en-us/articles/205814528 · https://support.squarespace.com/hc/en-us/articles/205826028 |
| SQ-resp | Responsive design — https://support.squarespace.com/hc/en-us/articles/115003287447 |
| SQ-dev | How will my site appear on mobile devices · Device view — https://support.squarespace.com/hc/en-us/articles/205815398 · https://support.squarespace.com/hc/en-us/articles/206545667 |
| SQ-blank | Removing blank space (Site Margin, Page Width (Max)) — https://support.squarespace.com/hc/en-us/articles/207230568 |
| SQ-fin | Finish Layer features — https://support.squarespace.com/hc/en-us/articles/47427542388621 |
| WP-group | Group block — https://wordpress.org/documentation/article/group-block/ |
| WP-row | Row block — https://wordpress.org/documentation/article/row-block/ |
| WP-stack | Stack block — https://wordpress.org/documentation/article/stack-block/ |
| WP-grid | Grid block — https://wordpress.org/documentation/article/grid-block/ |
| WP-gridtype | Grid layout type (6.6 dev note: Auto/Manual, Column span / Row span) — https://make.wordpress.org/core/2024/06/18/grid-layout-type/ |
| WP-cols | Columns block — https://wordpress.org/documentation/article/columns-block/ |
| WP-cover | Cover block — https://wordpress.org/documentation/article/cover-block/ |
| WP-img | Image block — https://wordpress.org/documentation/article/image-block/ |
| WP-lay | Layout settings overview — https://wordpress.org/documentation/article/layout-settings-overview/ |
| WP-dim | Dimension settings overview — https://wordpress.org/documentation/article/dimension-controls-overview/ |
| WP-tp | Template Part block — https://wordpress.org/documentation/article/template-part-block/ |
| WP-pat | Synced Patterns — https://wordpress.org/documentation/article/reusable-blocks/ |
| WP-tj-lay | theme.json layout (contentSize / wideSize) — https://developer.wordpress.org/themes/global-settings-and-styles/settings/layout/ |
| WP-tj-sp | theme.json spacing (spacingScale, spacingSizes, blockGap) — https://developer.wordpress.org/themes/global-settings-and-styles/settings/spacing/ |
| WP-vis | Block Visibility in WordPress 7.0 — https://make.wordpress.org/core/2026/03/15/block-visibility-in-wordpress-7-0/ |
| WP-resp | Call for testing: Responsive Styling (7.1) — https://make.wordpress.org/test/2026/07/03/call-for-testing-responsive-styling/ |
| WP-prev | New editor preview options (5.5) — https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/ |
| WP-a11y | WordPress accessibility coding standards / handbook (general) — https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/ |

## The table

| ID | Squarespace 7.1 (Fluid Engine) | WordPress block editor (block theme) |
|----|-------------------------------|--------------------------------------|
| PS-1 | HAS — site header + page sections + site footer — every page is header · sections · footer; header can be hidden per page ("Show Header") [SQ-hdr, SQ-ftr] | HAS — templates of Template Parts — a template is Header part · content · Footer part; HTML Element can be `header`/`main`/`footer` [WP-tp, WP-group] |
| PS-2 | HAS — Header / Footer editors — one header and one footer shown on all pages; footer takes Fluid Engine sections [SQ-hdr, SQ-ftr] | HAS — Template Part (area Header / Footer) — "Edit original" once, every template updates [WP-tp] |
| PS-3 | NO — no sidebar region in 7.1; only a side-by-side layout built inside a section by hand (blog sidebar was a 7.0 template feature) [SQ-fe; not documented for 7.1] | PARTLY — Row / Columns in a template + General template part — built by hand; no dedicated sidebar area (classic widget areas can be imported into a part) [WP-tp, WP-cols] |
| PS-4 | HAS — Pages panel + navigation — each page its own sections, one header nav [SQ-ps, SQ-hdr] | HAS — Templates (per page type / per page) + Navigation block [WP-tp] |
| PS-5 | PARTLY — Saved sections (heart icon) — reuse a section as a copy, NOT linked; no page templates [SQ-ps] | HAS — Synced Patterns (edit once, updates everywhere; "Detach") + unsynced patterns + Templates [WP-pat] |
| SB-1 | HAS — Add Section, ↑/↓ arrows, duplicate, trash [SQ-ps] | HAS — any Group / Cover as a band; drag handle, Move up/down, List View [WP-group] |
| SB-2 | HAS — Inset content within Page Width (Max); background Full Bleed or Inset [SQ-sec, SQ-blank] | HAS — Full width band + "Inner blocks use content width" (contentSize / wideSize) [WP-lay, WP-tj-lay] |
| SB-3 | HAS — Fill Screen + Height (Small/Medium/Large/custom) and Row Count; drag the blue arrow at the section's bottom-right [SQ-sec] | HAS — Minimum height (px/%/em/rem/vw/vh); Cover "Toggle full height"; drag the Cover's bottom edge [WP-dim, WP-cover] |
| SB-4 | HAS — Alignment Top / Center / Bottom (with Fill Screen) [SQ-sec] | HAS — Cover "Change content position" (3×3); Row/Stack vertical alignment [WP-cover, WP-row] |
| SB-5 | PARTLY — Divider (shape, stroke, thickness) on a section's bottom edge; overlap into the next band NO (blocks stay in their section) [SQ-sec] | NO — no shaped edges in core; overlap only via negative margin (custom value) [WP-dim; shapes not documented] |
| RC-1 | HAS — free blocks on the grid side by side; Stacks group them [SQ-move, SQ-stk] | HAS — Row (fit/fill children) and Columns (1–6) [WP-row, WP-cols] |
| RC-2 | PARTLY — width by dragging a block's handles across grid columns; no share presets [SQ-size] | HAS — Columns presets 100 · 50/50 · 33/66 …, Column width in % (or px/em/rem/vw) [WP-cols] |
| RC-3 | PARTLY — a block spanning N grid columns (grid is fluid, so a "set width" is a share) [SQ-size] | HAS — Row child Width: Fixed / Max beside Fill children; Column width in px/rem [WP-row, WP-cols] |
| RC-4 | PARTLY — mobile is a SEPARATE hand-arranged layout; order with ↑/↓ arrows in Mobile View; new blocks auto-placed "as closely as possible" [SQ-mob] | PARTLY — Columns "Stack on mobile" (on by default), Row "Allow to wrap"; stacking ORDER cannot be changed [WP-cols, WP-lay] |
| RC-5 | HAS — section Gap (none / preset / custom, across and down separately); Stack Gap (Fill or px, drag the gap handle) [SQ-sec, SQ-stk] | HAS — Block spacing (horizontal + vertical on Columns/Grid) [WP-dim] |
| RC-6 | PARTLY — Stacks nest 3 levels deep, 2–30 blocks each; blocks cannot nest otherwise [SQ-stk] | HAS — any container in any container, unlimited [WP-group] |
| GR-1 | PARTLY — the section IS a grid (column count fixed by the product, not documented on support pages); no "card grid" block except Auto layouts / gallery sections [SQ-fe, SQ-auto] | HAS — Grid: Max. columns + Min. column width → wraps 4→3→2→1 [WP-grid] |
| GR-2 | NO — the grid does not reflow; mobile is a separate layout [SQ-mob] | HAS — Grid Min. column width (auto-fill/auto-fit) + "Fill available space" [WP-grid, WP-lay] |
| GR-3 | HAS — a block covers any rectangle of cells (drag handles) [SQ-size] | HAS — Column span / Row span on a Grid child, drag handles on canvas (Manual mode) [WP-gridtype] |
| GR-4 | HAS — drop on grid lines; G shows the grid [SQ-fe, SQ-move] | PARTLY — Manual mode pins a start position by dragging across cells; no 12-col page grid [WP-gridtype] |
| GR-5 | PARTLY — gallery sections only (Masonry gallery layout); not for arbitrary blocks [not read in full] | NO — not in core (Gallery block is rows) |
| GR-6 | NO | NO — no subgrid |
| FL-1 | PARTLY — Stacks (vertical); free grid otherwise, nothing "flows" [SQ-stk] | HAS — the default document flow; Stack block [WP-stack] |
| FL-2 | NO — not documented for Stacks [SQ-stk] | HAS — "Allow to wrap to multiple lines" (on by default) [WP-lay] |
| FL-3 | NO — Fluid Engine places blocks; no text wrap round an image | HAS — Image Align left / right wraps the paragraph [WP-img] |
| FL-4 | NO | NO — not in core blocks (custom CSS only) |
| FL-5 | HAS — overlap anywhere; Move Forward / Move Backward; Layers panel drag order [SQ-move] | PARTLY — Cover block (text over image / video); no free z-order [WP-cover] |
| SZ-1 | PARTLY — width = the cells a block covers; no hug [SQ-size] | HAS — Row/Stack child Width: Fit · Fill · Max · Fixed; Column width [WP-row] |
| SZ-2 | PARTLY — height = cells covered; Form blocks hug content [SQ-size] | PARTLY — Minimum height; Stack child height controls (Fit/Fill) not documented in detail [WP-dim, WP-stack] |
| SZ-3 | NO (site-wide Page Width (Max) only) [SQ-blank] | PARTLY — Min height; Max width on Row children; no min-width/max-height [WP-dim, WP-row] |
| SZ-4 | HAS — Image Design shape ratios 1:1, 2:3, 3:2 … [SQ-img] | HAS — Aspect ratio on Image and Cover [WP-img, WP-cover] |
| SZ-5 | HAS — Site Styles: Page Width (Max) + Site Margin [SQ-blank] | HAS — theme.json contentSize / wideSize, editable in Styles → Layout [WP-tj-lay] |
| SZ-6 | PARTLY — grid is fluid, headings shrink to fit; units not user-chosen [SQ-resp, SQ-dev] | HAS — px/%/em/rem/vw/vh in every field; fluid clamp() spacing presets and fluid type in theme.json [WP-dim, WP-tj-sp] |
| SP-1 | PARTLY — section padding only via Fill Screen/Height; Stack padding not documented; blocks have no padding [SQ-sec, SQ-stk] | HAS — Padding, linked or per side (Top/Right/Bottom/Left/Custom) [WP-dim] |
| SP-2 | NO — no margin (space is empty grid cells) | HAS — Margin per side; negative values by typing a custom value [WP-dim] |
| SP-3 | HAS — section Gap; Stack Gap [SQ-sec, SQ-stk] | HAS — Block spacing [WP-dim] |
| SP-4 | PARTLY — Gap presets (small/medium/large) [SQ-sec] | HAS — spacing presets from spacingScale (7 steps, ×1.5, rem) or spacingSizes; customSpacingSize:false locks to the scale [WP-tj-sp] |
| SP-5 | PARTLY — Stack gaps dragged on canvas (Ctrl/Cmd one gap) [SQ-stk] | PARTLY — margin/padding previewed as a blue box while changing; not draggable [WP-dim] |
| AL-1 | HAS — content alignment icons inside a block; Align Group for several selected blocks [SQ-move] | HAS — Justification Left/Center/Right (Stretch on vertical); vertical Top/Middle/Bottom/Stretch to fill [WP-lay, WP-row] |
| AL-2 | PARTLY — Stack Gap "Fill" spreads as far apart as possible [SQ-stk] | HAS — Space between (Row justification, Stack vertical) [WP-row, WP-stack] |
| AL-3 | NO (each block is placed by itself, so not needed) | PARTLY — a Column's own vertical alignment inside Columns [WP-cols] |
| AL-4 | HAS — text alignment in Text blocks | HAS — paragraph/heading align toolbar |
| AL-5 | NO | NO |
| PO-1 | HAS — header "Fixed position" Basic / Scroll back; Pin blocks (top/center/bottom + Offset) sticky within their section [SQ-hdr, SQ-pin] | HAS — Position: Sticky on top-level Group/Row/Stack/Grid only [WP-group] |
| PO-2 | NO — not offered for blocks (pins stay inside their section) [SQ-pin] | NO — Position has Default / Sticky only [WP-row] |
| PO-3 | HAS — any block anywhere on the grid, over others [SQ-move] | NO — not in core |
| PO-4 | NO — blocks are confined to their section | PARTLY — negative margin [WP-dim] |
| PO-5 | PARTLY — free placement but snapped to the grid cells [SQ-move] | NO |
| PD-1 | PARTLY — two layouts, desktop + mobile; tablet shows one of them; widths not documented [SQ-mob, SQ-dev] | PARTLY — Desktop / Tablet / Mobile, fixed breakpoints in 7.0; configurable breakpoints promised for 7.1 [WP-vis, WP-resp] |
| PD-2 | HAS — Layers → eye icon hides a block "at this browser size" (repeat per size) [SQ-mob] | HAS — Hide / Show → per Desktop / Tablet / Mobile (7.0), hidden by CSS [WP-vis] |
| PD-3 | HAS — Mobile View ↑/↓ arrows reorder [SQ-mob] | NO — not documented |
| PD-4 | PARTLY — every size/position on mobile; Row Count is the only section style that differs; some blocks have mobile Design settings [SQ-mob, SQ-sec] | PARTLY — Responsive editing (7.1): inspector styles (font size, colour, spacing) per viewport; toolbar alignment and column count apply to all [WP-resp] |
| PD-5 | NO — the two layouts are independent; desktop moves never carry over [SQ-mob] | HAS (7.1) — desktop-first: a Desktop value carries down unless overridden [WP-resp] |
| PD-6 | HAS — Device view / Mobile View icon [SQ-dev] | HAS — Preview dropdown Desktop / Tablet / Mobile [WP-prev] |
| MS-1 | HAS — Fit / Fill + Focal point [SQ-img] | HAS — Scale Cover / Contain + Focal point (Image and Cover) [WP-img, WP-cover] |
| MS-2 | PARTLY — shape ratios; layout-shift behaviour not documented [SQ-img] | HAS — core writes width/height; Aspect ratio [WP-img] |
| MS-3 | HAS — up to seven widths stored, the best chosen per screen (automatic) [SQ-resp] | HAS — srcset/sizes and loading="lazy" by core (automatic); Resolution picker [WP-img] |
| MS-4 | PARTLY — Video block sized by its grid cells | PARTLY — Video/Embed block; Embed aspect ratio from the provider |
| MS-5 | HAS — section background image / video / art, Full Bleed or Inset [SQ-sec] | HAS — Background image (+ Cover video, Fixed background, Repeated background) [WP-cover, WP-group] |
| SE-1 | NO — not chosen by the user; not documented | HAS — HTML Element (div, header, main, section, article, aside, footer) on Group/Row/Stack/Grid/Cover [WP-group] |
| SE-2 | PARTLY — Heading 1–4 styles chosen per paragraph; one-h1 not enforced | PARTLY — heading level per Heading block; not enforced |
| SE-3 | NO — not documented | HAS — Navigation block publishes a `nav` with a list of links |
| SE-4 | NO — free placement; mobile order can be set but DOM order not documented | PARTLY — visual order = document order (except Grid Manual placement) |
| AX-1 | NO — not documented | PARTLY — rem / clamp values available; not checked by the editor [WP-tj-sp] |
| AX-2 | NO — not documented | PARTLY — keyboard-operable editor, skip link in block themes [WP-a11y] |
| AX-3 | NO — not documented | NO — not documented |
| AX-4 | PARTLY — mobile layout is hand-built for the phone [SQ-mob] | PARTLY — wrapping / stack on mobile defaults; not checked |
| SD-1 | NO — "no more than 20 sections" / "60 blocks" advice only [SQ-ps, SQ-pin] | NO — not documented |
| SD-2 | PARTLY — responsive images automatic [SQ-resp] | HAS — lazy loading + width/height automatic [WP-img] |
| ED-1 | HAS — drag and drop on the grid; Undo [SQ-move, SQ-fe] | HAS — drag (six dots), Move up/down, Undo/Redo [WP-row] |
| ED-2 | PARTLY — Layers panel (per section, flat; double-click into Stacks) [SQ-move, SQ-stk] | HAS — List View (Document Overview) tree; "Select parent" toolbar icon [WP-lay] |
| ED-3 | PARTLY — duplicate section; Ctrl+A select all blocks; style copy not documented [SQ-ps, SQ-move] | HAS — Copy / Duplicate / Paste, Ctrl+G to group; Copy styles / Paste styles in More options [WP-group] |
| ED-4 | HAS — Add Section → categories of prebuilt layouts; Auto layouts [SQ-ps, SQ-auto] | HAS — Patterns (theme + Pattern Directory), Columns variations [WP-pat, WP-cols] |
| ED-5 | HAS — grid shown while dragging (G to keep it); yellow match-size indicators; Ctrl/Cmd symmetric resize [SQ-fe, SQ-size] | NO — no guides/snapping (Grid Manual mode shows cells) [WP-gridtype] |
| ED-6 | NO | NO |

## New rows (capabilities these two have that the list lacks)

| New ID | Axis | Capability | Squarespace | WordPress |
|----|------|-----------|-------------|-----------|
| PS-6 | Page structure | A page area shown/hidden per page (hide the header on one page) | HAS — "Show Header" off in page settings [SQ-hdr] | HAS — a template without the part, per page [WP-tp] |
| PS-7 | Page structure | A navigation overlay area (the mobile menu as its own editable layout) | PARTLY — Menu Icon style + line thickness only [SQ-hdr] | HAS — Template Part area "Navigation Overlay" [WP-tp] |
| SB-6 | Sections / bands | Three named widths a block can choose: content · wide · full | NO (Inset / Full only) | HAS — Align None / Wide width / Full width from contentSize / wideSize [WP-group, WP-tj-lay] |
| SB-7 | Sections / bands | Fixed (parallax) or repeated background on a band | NO — not documented | HAS — Fixed background, Repeated background [WP-cover] |
| SB-8 | Sections / bands | A colour theme per section, shared by every section using it | HAS — Colors tab "Color theme" [SQ-sec] | PARTLY — block Styles (Style 1–5) from the theme [WP-group] |
| RC-7 | Rows and columns | Change a container's kind without losing its content (row ⇄ stack ⇄ grid ⇄ columns) | NO | HAS — Transform to Group / Row / Stack / Grid / Columns / Cover [WP-grid, WP-row] |
| RC-8 | Rows and columns | Columns of equal height (stretch to fill) vs aligned top/middle/bottom | NO | HAS — Column "Stretch to fill" default [WP-cols] |
| GR-7 | Grids | Last-row items stretch to fill instead of leaving a hole | NO | HAS — Grid "Fill available space" [WP-grid] |
| PO-6 | Positioning | Sticky WITHIN its own section (pinned while the section scrolls), with an offset and top/center/bottom | HAS — Pin blocks [SQ-pin] | NO — Sticky is to the viewport, top level only [WP-group] |
| PO-7 | Positioning | A header that hides on scroll down and returns on scroll up | HAS — Fixed position "Scroll back" [SQ-hdr] | NO — not in core |
| PD-7 | Per-device | A completely separate hand-arranged phone layout (not a cascade) | HAS — Mobile View layout [SQ-mob] | NO |
| PD-8 | Per-device | Hidden per device without rendering at all vs hidden by CSS | NO | HAS — blockVisibility false (not rendered) vs viewport (CSS) [WP-vis] |
| SP-6 | Spacing | Lock users to the spacing scale (no free numbers) | NO | HAS — customSpacingSize: false [WP-tj-sp] |
| ED-7 | Editing | Lock a block / pattern against moving or editing | NO — not documented | HAS — Lock in More options; locked synced patterns [WP-pat] |
| ED-8 | Editing | Group several selected blocks into a container in one action (and ungroup) | HAS — "Stack Blocks" [SQ-stk] | HAS — Ctrl+G, Ungroup [WP-group, WP-cols] |
| ED-9 | Editing | Several blocks selected, then moved / resized / aligned together | HAS — drag-select, Align Group [SQ-move, SQ-size] | PARTLY — Shift-select, move together; no shared resize [WP-group] |

## What a beginner meets in the first hour

**Squarespace.** Picks a template; every page is already header · sections · footer. "Add Section" offers a gallery of
ready layouts by category, so a first page is made by choosing, not building. Inside a section the blocks drop on a
visible grid, snap, overlap freely and resize by corner handles — direct and forgiving. The first surprise: the phone
layout is separate, so a desktop rearrangement does not reach the phone, and every page has to be laid out twice (or
left to the automatic first guess). The second: a block cannot leave its section, and there is no margin — space is
empty cells.

**WordPress.** Opens the Site Editor and meets three things at once: templates, template parts and the page. Blocks
are a document flow; layout is containers (Group, Row, Stack, Grid, Columns, Cover) chosen from the inserter or typed
as `/row`. The first hour is spent on width: None / Wide / Full and "Inner blocks use content width" — the most-reported
stumbling block in the docs and tutorials. Settings live in a sidebar of collapsed panels behind three-dot menus
(Wrapping, Content width, Fill available space), and nested blocks are reached through List View or the "select
parent" icon. Patterns are the quick win; responsive control is limited to Stack on mobile, wrap, Hide per device and
(7.1) Responsive editing.

## Could not read (and why)

- **Squarespace Fluid Engine column counts and the mobile breakpoint width** — not stated on any support.squarespace.com
  page read (the 12-column numbers in SQ-move are the classic editor's). Third-party figures were not used.
- **Squarespace Stack direction, wrap, padding and item widths** — SQ-stk names "Layout" but does not list its options.
- **Squarespace semantics and accessibility of published layout** (landmarks, heading order, reading order, reduced
  motion for pins) — not covered by the help center.
- **Squarespace gallery masonry** (GR-5) — gallery-section article listed but not read in full.
- **WordPress 7.1 status** — Responsive editing (PD-4/PD-5) and configurable breakpoints are from the July 2026 call for
  testing; whether they shipped as described in 7.1 was not confirmed. The Group/Grid/Row docs already carry 7.1
  updates (September 2026), but none of them mentions per-viewport styles.
- **WordPress breakpoint pixel values for Hide per device** — the 7.0 dev note says "fixed breakpoints" without numbers.
- **WordPress Stack child height controls** — the Row doc shows the width set (Fit/Fill/Max/Fixed); the Stack doc does
  not list its own.
- **WordPress negative margin** — the Dimension overview documents custom values but not whether negatives are
  accepted in the UI; marked as "by typing a custom value" from general practice, unmeasured.
- **SE-3, AX-2, SD-2 for WordPress** rest on core behaviour known from the handbook rather than a page read in full here.
