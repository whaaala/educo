---
title: Baseline — what Framer and Carrd give a person for layout (BATCH RX-3)
---

# Baseline — Framer and Carrd, row by row of the shared list (BATCH RX-3, 2026-10-16)

Row IDs are those of [`00-capabilities.md`](00-capabilities.md). **Framer** is the designer-grade builder;
**Carrd** is the simple one-page builder, read here as the **minimum** a site builder offers. When even Carrd has
a capability, that is a strong **Must** signal.

**Builds on, never redoes:** [`../page-grid/01-builders-and-systems.md`](../page-grid/01-builders-and-systems.md)
already holds Framer's grid traits, breakpoints, guides, positioning modes and per-breakpoint overrides (its tags
`FR-api` `FR-guides` `FR-svg` `FR-bp` `FR-pos` `FR-fluid` `FR-tpl` `FR-blog` are re-used below). This file adds the
rows that doc does not cover, plus all of Carrd, which it never studied.

Cell format: **HAS / PARTLY / NO — control — how**.

## Sources (tag → URL)

| Tag | Source |
|---|---|
| FR-api · FR-guides · FR-svg · FR-bp · FR-pos · FR-fluid · FR-tpl · FR-blog | as listed in `../page-grid/01-builders-and-systems.md` § Sources |
| FR-size | Framer Academy, *Build layouts that resize correctly* — https://www.framer.com/academy/lessons/sizing-modes |
| FR-minmax | Framer Academy, *Min and max sizing* — https://www.framer.com/academy/lessons/framer-fundamentals-min-and-max-sizing |
| FR-fixed | Framer Academy, *Fixed and sticky positioning* — https://www.framer.com/academy/lessons/framer-fundamentals-fixed-and-sticky-positioning · Help, *Why can't I set an element to position Fixed?* — https://www.framer.com/help/articles/why-can-t-i-set-an-element-to-position-fixed/ |
| FR-ovr | Framer Updates, *February 2024* (override indicator, Reset Override) — https://www.framer.com/updates/february-update-2024 · Help, *Breakpoint preview disabled* — https://www.framer.com/help/articles/breakpoint-preview-disabled/ |
| FR-scale | Framer Help, *Setting up your Framer site for scale* — https://www.framer.com/help/articles/setting-up-your-framer-site-for-scale/ |
| FR-sect | Framer Updates, *Inserting Sections* — https://www.framer.com/updates/sections · Academy, *The insert panel* — https://www.framer.com/academy/lessons/framer-fundamentals-the-insert-panel · Help, *Using templates* — https://www.framer.com/help/articles/how-templates-work/ |
| FR-img | Framer Help, *How images are optimized* — https://www.framer.com/help/articles/how-are-images-optimized-in-framer/ · *Natively lazy-load images and videos* — https://www.framer.com/help/articles/how-to-natively-lazy-load-videos-or-images/ · Updates, *Fit Image* — https://www.framer.com/updates/fit-image |
| FR-hscroll | Framer Help, *Fix horizontal scrolling on mobile* — https://www.framer.com/help/articles/how-to-fix-horizontal-scrolling-issue-on-mobile/ |
| FR-perf | Framer Help, *Optimizing your site for speed* — https://www.framer.com/help/articles/site-optimization/ |
| CA-cols | Carrd Docs, *Organizing Elements into Columns* — https://carrd.com/docs/building/organizing-elements-into-columns |
| CA-page | Carrd Docs, *Styling the Page Element* · *Background Friendly* · *Background Overlap* — https://carrd.com/docs/building/styling-the-page-element · …/using-background-friendly-mode · …/using-background-overlap |
| CA-bg | Carrd Docs, *Background Element* — https://carrd.com/docs/building/background-element |
| CA-sect | Carrd Docs, *Using Sections* · *Creating a Section* · *Adding a Header* · *Adding a Footer* · *Section View* — https://carrd.com/docs/building/using-sections · …/setting-up-a-section · …/adding-a-header · …/adding-a-footer · …/using-section-view |
| CA-mob | Carrd Docs, *Optimizing Elements for Mobile* · *Using Mobile View* — https://carrd.com/docs/building/optimizing-elements-for-mobile · …/using-mobile-view |
| CA-adv | Carrd Docs, *Using Advanced Settings* (Pro Plus) — https://carrd.com/docs/building/using-advanced-settings |
| CA-basic | Carrd Docs, *Overview* · *Basics* · *Keyboard Shortcuts* · *Element Styles* · *Scroll Points* — https://carrd.com/docs/building/overview · …/basics · …/keyboard-shortcuts · …/using-element-styles · …/using-scroll-points |
| CA-tut | Third-party Carrd container tutorial, used for the Container panel's control names (the official docs do not list them) — https://parallaxaview.art/carrd-container/ · https://x.com/sweetcarrd/status/1350448752415354883 |
| CA-meas | **Measured 2026-10-16:** the published HTML/CSS of a live Carrd site (https://howtomakea.carrd.co/): `@media (max-width:)` at 1680 · 1280 · 980 · 736 · 480 · 360px; `html { font-size }` stepped in `pt` (13pt → 11pt); spacing in `rem`; 14 `<section>` and no `<header>`/`<nav>`/`<main>`/`<footer>` elements; images swapped in from `data-src` by script (no `loading="lazy"`, no `srcset`); 4 × `position: fixed` (modal/gallery UI only) |

## The table

| ID | Framer | Carrd |
|----|--------|-------|
| PS-1 | PARTLY — page = vertical Stack of sections — header / footer are sections you insert; nothing forces the three regions [FR-sect] [FR-tpl] | PARTLY — Header Marker / Footer Marker — only when the site uses Sections; otherwise one column of elements [CA-sect] |
| PS-2 | HAS — Layout templates — everything outside the content slot is shared by every page using the template; edit once [FR-tpl] | HAS — Header / Footer Marker — elements before the header marker or after the footer marker show on every section [CA-sect] |
| PS-3 | PARTLY — a horizontal Stack inside the template / page; can be hidden per page with a template variable [FR-tpl] | PARTLY — Page Style *Tall Box* positioned left or right gives a side panel over the background; no true sidebar beside main content [CA-page] |
| PS-4 | HAS — pages in the Pages panel, each with its own layout; shared navigation via a component or template [FR-tpl] [FR-scale] | PARTLY — one page; *Section Break* elements switched by `#name` links imitate pages [CA-sect] |
| PS-5 | HAS — Components (+ variants, variables), Layout templates, inserted Sections [FR-scale] [FR-tpl] [FR-sect] | PARTLY — Element Styles link the appearance of many elements to one style; no reusable section blocks [CA-basic] |
| SB-1 | HAS — Insert menu → Sections; drag in the Layers panel to reorder [FR-sect] | HAS — elements / Containers stacked top to bottom; drag to reorder (green bar shows the drop side), Delete / Clone in the panel [CA-basic] |
| SB-2 | HAS — section Frame at Fill width, inner Stack with a max width [FR-size] [FR-minmax] | PARTLY — Container *Width* + *Content Alignment*; a full-bleed background with a centred inner width is reached by the Page element at *Default* style and a Container width of *Max* [CA-tut] [CA-page] |
| SB-3 | HAS — height Fit Content · Fixed · Viewport (`vh`, e.g. 100vh hero) [FR-size] | PARTLY — Page *Wide Box* / *Tall Box* span the screen; Containers size to content [CA-page] |
| SB-4 | HAS — Stack alignment / distribution on the section [FR-api] | HAS — Page *Position* (centre, corner, edge; top · centre · bottom for Wide Box) [CA-page] |
| SB-5 | PARTLY — overlap via Absolute layers or negative values; shaped edges only as SVG / image layers [FR-pos] | NO — no shaped edges; *Background Overlap* is about the Page box over the site background, not band-over-band [CA-page] |
| RC-1 | HAS — horizontal Stack, any count [FR-svg] | HAS — Container *Type: Columns*, 2 to **5** columns [CA-cols] |
| RC-2 | HAS — Fill shares as `fr` (1fr / 2fr); drag on the canvas [FR-size] | HAS — column widths in %, minimum **20%** per column [CA-cols] |
| RC-3 | HAS — one child Fixed, siblings Fill [FR-size] | PARTLY — every column is a % share; no fixed-px column [CA-cols] |
| RC-4 | HAS — Stack direction changed per breakpoint; order follows the layer order [FR-bp] | HAS — columns stack automatically; Mobile *Manual* → *Layout: Stack* or **Stack Reverse** [CA-cols] [CA-tut] |
| RC-5 | HAS — `gap` on Stack; grid column / row gaps [FR-api] | HAS — *Gutters* between columns; *Content Spacing* between elements (also per mobile) [CA-tut] |
| RC-6 | HAS — Stacks and grids nest to any depth [FR-svg] | **NO** — a Container cannot sit inside a Container; one level only [CA-tut] |
| GR-1 | HAS — Grid layout, column count per breakpoint [FR-api] [FR-blog] | NO — no grid; up to 5 columns per Container (Gallery element aside) [CA-cols] |
| GR-2 | HAS — `gridColumnWidthType: minmax` + minimum column width [FR-api] [FR-svg] | NO |
| GR-3 | HAS — column span / row span, span "all" [FR-api] | NO |
| GR-4 | PARTLY — layout grid *guides* per breakpoint, design-only (not published) [FR-guides] | NO |
| GR-5 | HAS — Masonry (Framer update; see `01` "could not read") | NO |
| GR-6 | NO — no subgrid control found | NO |
| FL-1 | HAS — vertical Stack, Relative position [FR-pos] | HAS — the whole site is one vertical flow of elements [CA-basic] |
| FL-2 | HAS — Stack *Wrap* (`stackWrapEnabled`) [FR-api] | NO |
| FL-3 | NO — no text-around-image float | NO |
| FL-4 | NO — no CSS-columns control found | NO |
| FL-5 | HAS — Absolute layers over siblings; layer order in the Layers panel, `zIndex` [FR-pos] [FR-api] | PARTLY — only text over the site **Background** or a Container background image; no element-over-element [CA-bg] [CA-tut] |
| SZ-1 | HAS — width Fixed · Relative (%) · Fill (fr) · Fit Content [FR-size] | PARTLY — Container / element *Width* (a value or *Max*) [CA-tut] |
| SZ-2 | HAS — height Fixed · Fill · Fit Content · Viewport [FR-size] | PARTLY — content height; screen height only through Page style [CA-page] |
| SZ-3 | HAS — Min / Max width and height on any layer [FR-minmax] [FR-api] | NO — none exposed (custom CSS on Pro Plus) [CA-adv] |
| SZ-4 | HAS — `aspectRatio` on frames; *Fit Image* sizes a frame to its image [FR-api] [FR-img] | PARTLY — Image element keeps its image's shape; no ratio control found |
| SZ-5 | PARTLY — max width set on the template / section Stack, not a site setting [FR-tpl] | HAS — the Page element's *Width* is the one content width for the whole site [CA-page] |
| SZ-6 | PARTLY — Relative / Fill / Viewport units and per-breakpoint type; sizes otherwise in px [FR-size] [FR-fluid] | PARTLY — published in `rem`, root font-size stepped down at each breakpoint (automatic, not set by the user) [CA-meas] |
| SP-1 | HAS — Padding, all or per side [FR-api] | HAS — Container *Padding* (vertical / horizontal), also per mobile [CA-tut] |
| SP-2 | PARTLY — no margin; space comes from parent gap / padding, overlap from Absolute [FR-pos] | HAS — *Margins* on elements and Containers (mobile margins the docs' own example) [CA-tut] [CA-mob] |
| SP-3 | HAS — Gap [FR-api] | HAS — *Gutters* · *Content Spacing* · Page *Spacing* (0 removes the gap between Containers) [CA-tut] |
| SP-4 | NO — free numbers (styles exist for colour and text only) [FR-scale] | NO — free numbers |
| SP-5 | PARTLY — gap / padding handles on the canvas (stated in the interface tour, not a help article) | NO — panel numbers only |
| AL-1 | HAS — Stack alignment / distribution; grid item horizontal / vertical alignment [FR-api] | HAS — *Alignment* + *Content Alignment* (incl. *Auto-Center*) on Containers / columns [CA-tut] |
| AL-2 | HAS — Stack distribution (space between, etc.) [FR-api] | NO |
| AL-3 | PARTLY — per grid item alignment; for Stacks only by wrapping the child [FR-api] | PARTLY — each column carries its own alignment [CA-tut] |
| AL-4 | HAS — text alignment, per breakpoint | HAS — element *Alignment* (left / centre / right) |
| AL-5 | NO — not found | NO |
| PO-1 | HAS — *Sticky* position; stays while its parent section scrolls [FR-fixed] | NO — no sticky control (custom CSS only) [CA-adv] |
| PO-2 | HAS — *Fixed* position; only layers placed directly on the page [FR-fixed] | NO — `position: fixed` appears only in Carrd's own modal / gallery UI [CA-meas] |
| PO-3 | HAS — *Absolute*, pinned to the parent's edges, centre anchors [FR-pos] [FR-api] | NO |
| PO-4 | HAS — Absolute layer or relative overflow across a section [FR-pos] | NO |
| PO-5 | PARTLY — Absolute layers can be dragged anywhere inside their parent frame [FR-pos] | NO — flow only; drag reorders before / after [CA-basic] |
| PD-1 | HAS — Primary (Desktop) + Tablet + Phone, add / edit widths; defaults 1200 / 810 / 390 [FR-bp] (stored in `01` A10) | PARTLY — two views only: Desktop and **Mobile View**; the mobile rung is ≤736px, further steps (980 / 480 / 360) applied automatically [CA-mob] [CA-meas] |
| PD-2 | HAS — visibility per breakpoint [FR-bp] | PARTLY — visibility (hidden on mobile / desktop) in Advanced Settings, **Pro Plus only** [CA-adv] |
| PD-3 | PARTLY — Stack direction per breakpoint; layer order is shared [FR-bp] (`01` A14) | PARTLY — *Stack Reverse* on mobile only [CA-tut] |
| PD-4 | HAS — type, direction, gap, padding, width, grid settings per breakpoint [FR-bp] | HAS — Mobile *Manual* reveals mobile-only padding, gutters, margins, alignment, spacing; *Auto* fields stay auto [CA-mob] [CA-tut] |
| PD-5 | HAS — Primary flows down; a change at a smaller breakpoint becomes an override, shown with an indicator and *Reset Override* [FR-ovr] | HAS — desktop settings drive mobile unless the field is set manually; editing in Mobile View changes desktop too [CA-mob] |
| PD-6 | HAS — Preview at breakpoints (greyed out when the browser window is narrower) [FR-ovr] | HAS — Mobile View (cropped / expanded), Alt+1 / Alt+2 / Alt+3 [CA-mob] [CA-basic] |
| MS-1 | HAS — image Fill with positioning and scaling; crop keeps the focus as it resizes [FR-blog] [FR-img] | PARTLY — background image and Container background image positioning; no focal point found [CA-bg] |
| MS-2 | HAS — Fit Image / aspect ratio [FR-img] | PARTLY — placeholder SVG of the image's size before the real file loads [CA-meas] |
| MS-3 | HAS — automatic multiple sizes + `srcset`; `loading="lazy"` below ~1000px [FR-img] | PARTLY — lazy by script (`data-src`), no `srcset` [CA-meas] |
| MS-4 | HAS — video / embed frames sized like any layer | HAS — Video element, embeds / IFRAMEs (docs list) |
| MS-5 | HAS — background image / gradient on any frame [FR-api] | HAS — site Background: colour, gradient, image, video, slideshow; Container background image [CA-bg] [CA-tut] |
| SE-1 | PARTLY — an HTML tag can be chosen per frame (interface; not confirmed in a help article) | NO — publishes `<section>` and divs; no header / nav / main / footer [CA-meas] |
| SE-2 | PARTLY — heading tag set per text style [FR-scale] | PARTLY — Text element heading levels |
| SE-3 | NO — navigation is a component; no `nav > ul > li` guarantee found | NO |
| SE-4 | HAS — reading order = layer order | HAS — single flow, order = visual order |
| AX-1 | PARTLY — px sizes; breakpoint type styles [FR-fluid] | PARTLY — `rem` throughout [CA-meas] |
| AX-2 | NO — not found in help | NO — not found |
| AX-3 | NO — not found | NO — not found |
| AX-4 | PARTLY — a help article on fixing sideways scroll (min-width wider than the screen) [FR-hscroll] | HAS — single column flow + automatic mobile optimisation leave little to overflow [CA-mob] |
| SD-1 | PARTLY — speed guidance [FR-perf] | HAS — tiny one-page sites by design (measured page ~190 KB HTML incl. inline CSS) [CA-meas] |
| SD-2 | HAS — native lazy loading [FR-img] | PARTLY — script lazy load, placeholder sized [CA-meas] |
| ED-1 | HAS — drag, undo / redo | HAS — drag to move, Ctrl+Z / Ctrl+Shift+Z [CA-basic] |
| ED-2 | HAS — Layers panel | HAS — *Elements* panel (Alt+E), now shows visibility state [CA-basic] |
| ED-3 | HAS — copy / paste / duplicate | HAS — Ctrl+C / X / V, Ctrl+D clone (paste across sites in beta, not containers) [CA-basic] |
| ED-4 | HAS — Insert menu Sections (minimally styled) + site templates [FR-sect] | HAS — start from a template (300+ numbered templates in the changelog) [CA-basic] |
| ED-5 | HAS — layout grid guides, snapping [FR-guides] | NO |
| ED-6 | NO — nothing found | PARTLY — "Unfinished Elements" warning before publishing (missing images), not layout [CA-basic] |

## New rows (not on the shared list)

| ID | Axis | Capability | Framer | Carrd |
|----|------|-----------|--------|-------|
| PS-6 | Page structure | **In-page sections as "pages"** — one page split into named views switched by a link, with a transition | NO (separate pages) | HAS — *Section Break* + `#name` / `section:next` links, *On Section Change* animation [CA-sect] |
| PS-7 | Page structure | **Anchor points to scroll to** (named, linkable, next / previous) | PARTLY — scroll-to links to sections | HAS — *Scroll Point* control, `scrollpoint:next` … [CA-basic] |
| SB-6 | Sections / bands | **The page as a card over a full-screen background** (box / wide box / tall box, placed centre / corner / edge), stacked under the background on a phone | PARTLY — built by hand | HAS — Page *Style* + *Position*, *Background Friendly* mode on mobile [CA-page] |
| SZ-7 | Sizing | **A per-breakpoint "manual" switch that leaves untouched fields automatic** | PARTLY — per-property overrides [FR-ovr] | HAS — Mobile *Auto / Manual*, each field may stay *Auto* [CA-mob] |
| ED-7 | Editing | **Edit one breakpoint without moving the others, with a visible "overridden here" mark and reset** | HAS — override indicator + *Reset Override* [FR-ovr] | NO — Mobile View edits desktop too [CA-mob] |
| ED-8 | Editing | **Shared appearance styles linked across elements** (change once, all follow) | HAS — text and colour styles [FR-scale] | HAS — *Element Styles* [CA-basic] |

## What a beginner meets in the first hour

- **Framer:** you start from a template or a blank page at the Desktop primary breakpoint (1200, with Tablet 810 and
  Phone 390 widely quoted as the defaults [FR-bp]); you build with the Insert menu, which drops **pre-made, minimally
  styled sections** (headers, footers, common layouts) and zooms the page so you can stack them in one view [FR-sect].
  The page is already a vertical Stack. Sizing modes (Fixed / Relative / Fill / Fit) and Stack vs Grid are the first
  ideas you have to learn; positioning modes come right after [FR-size] [FR-svg] [FR-pos].
- **Carrd:** you pick one of ~300 templates or a blank site; the canvas is one column of elements over a Background,
  inside a Page element whose Style (Default / Box / Wide Box / Tall Box) and Position set the whole layout [CA-page].
  Columns are a Container switched to *Type: Columns* (two equal columns, add up to five, 20% minimum) [CA-cols].
  Mobile is **automatic**: nothing to set until you switch an element to *Manual* [CA-mob].

## What even Carrd has — the strong Must signals

Stacked bands with drag-reorder · a header and footer shared site-wide · side-by-side columns (2–5) with % widths that
**stack on a phone, with a reverse option** · gutters and spacing · padding and margins · alignment (block and text) ·
one site-wide content width · a full-screen background (image / video / gradient) · a phone view to edit and preview
in, with automatic mobile behaviour and per-field manual overrides · copy / paste / clone / undo with shortcuts · an
elements list · starting from templates. Carrd deliberately has **no** nesting, grid, sticky, fixed, absolute or
free placement, which shows those are not the floor; Framer has all of them.

## Could not read (and why)

| Source | Why | Used instead |
|---|---|---|
| Carrd Container element settings | no official doc page lists them (*Organizing Elements into Columns* covers only Type and widths) | the third-party tutorial [CA-tut] + the published CSS [CA-meas] |
| Carrd breakpoint widths | not documented | measured from one live site's CSS [CA-meas]; one site, so the 980 / 480 / 360 steps may vary by template |
| Carrd sub-pages at `/docs/building/using-sections/creating-a-section` etc. | those paths return a 7 KB not-found page; the real paths are flat (`/docs/building/setting-up-a-section`) | the flat paths, read in full |
| Framer Academy lessons (sizing, min / max, stacks vs grids) | the lessons are video; the page text is a summary without control names | property names from the plugin API [FR-api] |
| Framer per-breakpoint "hide" toggle location, the HTML-tag picker, gap / padding canvas handles | no help article found | marked PARTLY with the reason in the cell |
| Framer Wireframer / AI layout | no help page found in search | — |
