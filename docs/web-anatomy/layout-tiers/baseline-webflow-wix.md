---
title: Layout baseline — Webflow and Wix Studio (BATCH RX-3)
---

# Layout baseline — Webflow and Wix Studio (BATCH RX-3, 2026-10-16)

What each builder gives a person for LAYOUT, row by row of the shared list
[`00-capabilities.md`](00-capabilities.md). Cell format: **HAS / PARTLY / NO — the control as the builder names it — how
it works**, then the source tag(s).

**Builds on, never redoes:** [`../page-grid/01-builders-and-systems.md`](../page-grid/01-builders-and-systems.md)
(grids, Quick Stack, grid areas, `fr`, containers, breakpoints and cascade, Wix section grid / advanced grid / docking /
sizing / max width / rulers). Where a row is already answered there, the cell cites it as **[PG-01 Ax]** and adds only
what is new. Webflow articles were read in full through the Help Center's public article API
(`help.webflow.com/api/v2/help_center/en-us/articles/<id>.json`; the HTML pages answer 403 to a fetch). Wix articles
were read through WebFetch.

**Classic Wix vs Wix Studio** (noted where it differs): classic Wix Editor is **free absolute placement** on a fixed
980px-wide stage with a separate mobile editor, pins with "Pin to screen" on an offset grid, and has rulers and guides
that elements snap to [WXC-pin] [WXC-ruler]. Wix Studio replaced that with sections + grids + docking + stacks and
per-breakpoint editing; Studio has **no** rulers or guides [WX-ruler].

## Sources (tag → URL)

Tags from PG-01 are reused unchanged (WF-grid, WF-areas, WF-qs, WF-vs, WF-lay, WF-cont, WF-fr, WF-bp, WX-sg, WX-adv,
WX-fg, WX-dock, WX-size, WX-bp, WX-max, WX-ruler, WX-dg). New ones:

| Tag | Source |
|---|---|
| WF-pos | Webflow Help, *CSS position properties* — https://help.webflow.com/hc/en-us/articles/33961228002963 |
| WF-size | *CSS width and height* (units, min/max, aspect ratio, overflow, object-fit, float) — https://help.webflow.com/hc/en-us/articles/33961381659411 |
| WF-sp | *Spacing (margin and padding)* — https://help.webflow.com/hc/en-us/articles/33961243177875 |
| WF-disp | *Display settings* — https://help.webflow.com/hc/en-us/articles/33961293279763 |
| WF-flex | *Flexbox* — https://help.webflow.com/hc/en-us/articles/33961260795155 |
| WF-align | *Align box overview* — https://help.webflow.com/hc/en-us/articles/33961238138643 |
| WF-box | *Use the Box element for structure and layout* — https://help.webflow.com/hc/en-us/articles/56390650242195 |
| WF-add | *The Add panel* — https://help.webflow.com/hc/en-us/articles/33961270096659 |
| WF-cols | *Text columns* — https://help.webflow.com/hc/en-us/articles/33961259668883 |
| WF-hide | *Hide elements on different breakpoints* — https://help.webflow.com/hc/en-us/articles/33961243793427 |
| WF-comp | *Components overview* · *Nest components* · *Slots* — https://help.webflow.com/hc/en-us/articles/33961303934611 · …/33961263318675 · …/33961195339923 |
| WF-tpl | *Create static page templates* · *Page building* (Page slot, Marketer role) — https://help.webflow.com/hc/en-us/articles/33961218842387 · …/33961210206483 |
| WF-pages | *Pages panel overview* — https://help.webflow.com/hc/en-us/articles/33961360067987 |
| WF-var | *Variables* — https://help.webflow.com/hc/en-us/articles/33961268146323 |
| WF-lib | *Libraries* · *Starter Library* — https://help.webflow.com/hc/en-us/articles/33961343551763 · …/33961353022739 |
| WF-nav | *Navigator* — https://help.webflow.com/hc/en-us/articles/33961320786451 |
| WF-copy | *Copy and paste between sites* — https://help.webflow.com/hc/en-us/articles/33961319728403 |
| WF-canvas | *Canvas settings* (rulers, guides, X-ray, Vision / Text zoom preview) — https://help.webflow.com/hc/en-us/articles/33961230930579 |
| WF-zoom | *Text zoom preview tool* — https://help.webflow.com/hc/en-us/articles/42466375397011 |
| WF-expand | *Expand canvas to see all breakpoints at once* — https://help.webflow.com/hc/en-us/articles/54857752965139 |
| WF-keys | *Keyboard shortcuts* — https://help.webflow.com/hc/en-us/articles/33961359609875 |
| WF-img | *Image* (loading Lazy/Eager/Auto) · *Responsive images* — https://help.webflow.com/hc/en-us/articles/33961290329235 · …/33961378697107 |
| WF-bg | *Background styles* (cover/contain, fixed, background video) — https://help.webflow.com/hc/en-us/articles/33961278898323 |
| WF-vid | *Video* — https://help.webflow.com/hc/en-us/articles/33961304305427 |
| WF-vu | *Small, large, and dynamic viewport units* — https://help.webflow.com/hc/en-us/articles/33961380247443 |
| WF-sem | *Semantic HTML5 tags* — https://help.webflow.com/hc/en-us/articles/33961369965715 (via search summary) |
| WF-audit | *Intro to the Audit panel* — https://help.webflow.com/hc/en-us/articles/33961313088531 (via search summary) |
| WF-a11y | *Accessible elements in Webflow* · *Troubleshoot smooth scroll and reduced motion* — https://help.webflow.com/hc/en-us/articles/33961346219923 · …/33961403269907 |
| WF-body | *Body element* — https://help.webflow.com/hc/en-us/articles/33961406833939 |
| WF-hs | *Horizontal scrolling* — https://help.webflow.com/hc/en-us/articles/33961273565843 |
| WX-sticky | Wix Studio, *Creating sticky elements and sections* — https://support.wix.com/en/article/studio-editor-creating-sticky-elements-and-sections |
| WX-pin | *Pinning elements and sections* — https://support.wix.com/en/article/studio-editor-pinning-elements-and-sections (via search summary) · *Request: pinning an element to all site pages* — https://support.wix.com/en/article/studio-editor-request-pinning-an-element-to-all-site-pages |
| WX-stack | *About Stack* — https://support.wix.com/en/article/studio-editor-about-stack |
| WX-flexbox | *Adding and setting up flexboxes* — https://support.wix.com/en/article/studio-editor-adding-and-setting-up-flexboxes (via search summary) |
| WX-pos | *Positioning elements* — https://support.wix.com/en/article/studio-editor-positioning-elements |
| WX-glob | *Using global sections* — https://support.wix.com/en/article/studio-editor-using-global-sections (via search summary) |
| WX-sec | *Adding and managing sections* — https://support.wix.com/en/article/studio-editor-adding-and-managing-sections |
| WX-layers | *Using the Layers panel* — https://support.wix.com/en/article/studio-editor-using-the-layers-panel |
| WX-img | *Editing and customizing images* — https://support.wix.com/en/article/studio-editor-editing-and-customizing-images |
| WX-shape | *Adding and customizing shape dividers* — https://support.wix.com/en/article/studio-editor-adding-and-customizing-shape-dividers (via search summary) |
| WX-keys | *Keyboard shortcuts* — https://support.wix.com/en/article/studio-editor-keyboard-shortcuts |
| WX-a11y | *Accessibility: preparing your site structure* — https://support.wix.com/en/article/accessibility-preparing-your-site-structure · *Accessibility: reducing motion* — https://support.wix.com/en/article/accessibility-reducing-motion (via search summary) |
| WX-css | *About CSS editing* (global.css, custom classes) — https://support.wix.com/en/article/editor-x-about-css-editing (via search summary) |
| WX-wrap | *Request: images inside text boxes (text wrapping)* — https://support.wix.com/en/article/wix-editor-request-adding-images-inside-text-boxes-text-wrapping |
| WX-eng | Wix Engineering, *The story of making Wix accessible* — https://www.wix.engineering/post/the-story-of-making-wix-accessible (search summary; not official help) |
| WXC-pin | Classic Wix, *Pinning elements to the screen* — https://support.wix.com/en/article/wix-editor-pinning-elements-to-the-screen |
| WXC-ruler | Classic Wix, *About rulers and guides* — https://support.wix.com/en/article/about-rulers-and-guides |

## The table

| ID | Webflow | Wix Studio |
|---|---|---|
| PS-1 | PARTLY — Box tag Header / Main / Footer — nothing is made for you: a page starts as an empty Body; you add Boxes and set their tag [WF-box] [WF-body] | HAS — header · page · footer — every Studio site starts with a global header and footer; the page sits between them [WX-glob] |
| PS-2 | HAS — Components — a navbar / footer turned into a component, edited once, updates every instance; you place it on each page yourself [WF-comp] | HAS — Global sections (Set as Global → Header / Section / Footer) — header and footer global by default; Layers shows global sections in green [WX-glob] [WX-layers] |
| PS-3 | PARTLY — Grid / Quick Stack + Box tag Aside — a sidebar is a grid or flex column you build; no sidebar region [WF-qs] [WF-sem] | PARTLY — section grid Columns layout — a sidebar is a section-grid column; no sidebar region; landmark tag not documented [WX-sg] |
| PS-4 | HAS — Pages panel, folders, Navbar element — each page its own Body; menu is the Navbar component [WF-pages] [WF-add] | HAS — Pages, global header menu — each page its own sections between the global header/footer [WX-sec] [WX-glob] |
| PS-5 | HAS — Static page templates (up to 40), Components, Libraries, Page slot — a new page inherits a template's design; Page slots are where non-designers drop approved components [WF-tpl] [WF-lib] | HAS — Global sections; Assets (saved sections / containers) — any section can be made global; saved items reused across pages [WX-glob] [WX-sec] |
| SB-1 | HAS — Box with Section tag; Navigator drag — sections stack in the Body; reorder in Navigator (Z) [WF-box] [WF-nav] | HAS — + Add Section, Move Up / Move Down, Delete — sections stack; reorder from More Actions or Layers [WX-sec] [WX-layers] |
| SB-2 | HAS — Section (100% wide) + Container (max-width 940 / 728, auto margins) — the legacy pair; with Box you style the inner Box yourself [WF-box] [WF-cont] | HAS — Site max width (1600 default) + Apply max width per section — background full-bleed, content capped [WX-max] |
| SB-3 | HAS — Height / Min height in px, %, vh, dvh/svh/lvh — "set min height 100vh" taught as the hero pattern [WF-size] [WF-vu] | HAS — section height: Fit to screen (100vh, reducible) · Fixed height · auto (content) — px heights discouraged [WX-size] |
| SB-4 | HAS — Display Flex + Align box — make the section flex, align children top / centre / bottom [WF-align] [WF-flex] | HAS — Docking (Top · Center · Bottom) in the section / cell — each element docks inside its cell [WX-dock] |
| SB-5 | PARTLY — no divider control; negative margin / absolute for overlap — a shaped edge needs an SVG or custom code [WF-sp] [WF-pos] | HAS — Shape Dividers (Top / Bottom: height, colour, opacity, layers); overlap via negative margins in a stack or a Pinned section, which overlaps the next by default [WX-shape] [WX-stack] [WX-pin] |
| RC-1 | HAS — Quick Stack presets 1–4 columns, Grid, Flex (H Flex) [PG-01 A13] | HAS — section grid Columns, horizontal Stack, Flexbox "Columns" display [PG-01 A13] [WX-fg] |
| RC-2 | HAS — fr columns, drag the column header or type; legacy Columns element "proportions add up to 12" [PG-01 A5] [WF-box] | HAS — drag gridlines; fr / % / min-max in advanced grid [PG-01 A5] |
| RC-3 | HAS — a px / rem track beside fr tracks [WF-grid] | HAS — advanced grid mixes px with fr; px (Fixed) behaviour on an element [WX-adv] [WX-size] |
| RC-4 | HAS — Quick Stack rows go Auto below desktop, per-breakpoint cell span and order; flex Wrap; legacy Columns "display vertically on breakpoint" [PG-01 A13] [WF-box] | HAS — section grid re-flows rows/columns at smaller breakpoints; Stack / Flexbox item order per breakpoint (the help pages disagree on how far the plain section grid can be changed per breakpoint — advanced grid always can) [WX-fg] [WX-sg] |
| RC-5 | HAS — Gap (row / column, lockable), dragged on canvas in Quick Stack [PG-01 A4] | HAS — horizontal / vertical gap in Layout; stack spacing dragged [WX-sg] [WX-stack] |
| RC-6 | HAS — any Box inside any cell, components nest [WF-grid] [WF-comp] | HAS — containers / stacks / flexboxes / grids inside cells; moving to another parent is global, not per breakpoint [WX-fg] [WX-dock] |
| GR-1 | HAS — Grid with a column count per breakpoint [PG-01 A1] | HAS — advanced grid per breakpoint; Repeater / Flexbox wrap items [PG-01 A1] [WX-fg] |
| GR-2 | HAS — Auto-fit (one column + row, min/max, tick Auto-fit) [PG-01 A1] | PARTLY — Flexbox / Repeater "items wrap to fit every screen"; no min-card-width auto-fit control documented [WX-fg] |
| GR-3 | HAS — drag to span, start/end, Grid areas [PG-01 A8] | HAS — Merge cells (all breakpoints), advanced grid spans [PG-01 A8] |
| GR-4 | PARTLY — Guides (Line / Filled, Shift+G) are a visual overlay only; each grid is its own [WF-canvas] [PG-01 A12] | NO — no page grid, no guides in Studio (Design Guides add-on draws one) [PG-01 A12] |
| GR-5 | NO — not native (custom code) | PARTLY — Flexbox "Mosaic" display; gallery apps [WX-fg] |
| GR-6 | NO — no subgrid [PG-01 A11] | NO — no subgrid [PG-01 A11] |
| FL-1 | HAS — Display Block (the default flow) [WF-disp] | PARTLY — normal flow only inside a vertical Stack; elements otherwise dock in their parent (free position) [WX-stack] [WX-pos] |
| FL-2 | HAS — Wrap (Wrap down / up, reverse, columns) [WF-flex] | PARTLY — Flexbox wraps automatically; Stack wrap not documented [WX-fg] [WX-stack] |
| FL-3 | HAS — Float left / right / none [WF-size] | NO — "images cannot be placed inside text boxes with text wrapping"; workarounds only [WX-wrap] |
| FL-4 | HAS — Typography › Columns: count, gap (0 default), divider, child spans all [WF-cols] | NO — not found for Studio |
| FL-5 | HAS — Z-index on any non-static element; Navigator reaches buried ones [WF-pos] [WF-nav] | HAS — layer order in Layers (higher = in front), Arrange / bring to front shortcuts; Sticky "Keep in front" [WX-layers] [WX-keys] [WX-sticky] |
| SZ-1 | HAS — Width auto / px / % / em / rem / vw / ch / fr [WF-size] | HAS — responsive behaviour: Stretch · Hug · Relative width · Fixed · Scale proportionally; units px* · px · % · vw · max-c · Calculation [WX-size] |
| SZ-2 | HAS — Height auto / px / % / vh / dvh [WF-size] [WF-vu] | HAS — Auto · px* · vh · Fit to screen [WX-size] |
| SZ-3 | HAS — Min / Max width and height [WF-size] | HAS — min / max in advanced size settings [WX-size] |
| SZ-4 | HAS — Size › Ratio presets + custom [WF-size] | PARTLY — Lock aspect ratio on media/shapes only; Scale proportionally [WX-size] |
| SZ-5 | PARTLY — the Container class (940/728) edited once, or a size variable [WF-box] [WF-var] | HAS — Site max width, one setting, per-section opt-out [WX-max] |
| SZ-6 | HAS — rem / em / vw / ch, clamp() in variables, Text zoom preview [WF-size] [WF-var] [WF-zoom] | PARTLY — px* scales with the canvas width, not the reader's text size; vw and Calculation available [WX-size] |
| SP-1 | HAS — drag the padding control; Alt = opposite sides, Shift = all sides [WF-sp] | HAS — padding per side, Horizontal, Vertical; drag it on the canvas [WX-dock] |
| SP-2 | HAS — margin per side, negative, auto ("Center element") [WF-sp] | HAS — margins = distance from the parent's docked edges, negative allowed [WX-dock] |
| SP-3 | HAS — Gap in Flex / Grid / Quick Stack [WF-flex] | HAS — gaps in grid; stack spacing [WX-sg] [WX-stack] |
| SP-4 | HAS — Size variables for margin, padding, gap (also clamp) [WF-var] | NO — theme variables cover colours and fonts; no spacing tokens documented [WX-css] |
| SP-5 | PARTLY — X-ray mode shows margin/padding on hover; dragging is in the Style panel, gaps on canvas only in Quick Stack [WF-canvas] [WF-qs] | HAS — hover the padding on canvas and drag; stack gaps dragged [WX-dock] [WX-stack] |
| AL-1 | HAS — Align box (9 cells, Ctrl-click = space between / stretch) [WF-align] | HAS — Docking + Align to center; alignment icons for multi-select [WX-pos] |
| AL-2 | HAS — Space between / around, for wrapped lines too [WF-flex] | PARTLY — not documented for stacks; Flexbox distributes itself [WX-stack] [WX-fg] |
| AL-3 | HAS — Flex child › Alignment (6 options) [WF-flex] | HAS — each element docks on its own [WX-dock] |
| AL-4 | HAS — Typography alignment | HAS — text alignment in the text panel |
| AL-5 | HAS — Baseline (flex align) [WF-flex] | NO — not found |
| PO-1 | HAS — Position Sticky + top offset; fails under overflow:hidden / set-height parents [WF-pos] | HAS — Position type Sticky: Stick to Top / Bottom / both, Offset, Keep in front [WX-sticky] |
| PO-2 | HAS — Position Fixed with preset corners [WF-pos] | HAS — Position type Pinned → Page; only on the page you edit (no site-wide pin) [WX-pin] |
| PO-3 | HAS — Position Absolute in a relative parent; presets (top-left … full) [WF-pos] | HAS — every element is docked to its parent's edges with margins — badges are the default model [WX-dock] |
| PO-4 | PARTLY — negative margin or absolute; no named control [WF-sp] [WF-pos] | PARTLY — negative margins in a stack, negative Y, pinned section overlap [WX-stack] [WX-pos] [WX-pin] |
| PO-5 | NO — flow layout; only absolute offsets | HAS — drag anywhere inside a section / cell, per breakpoint, auto-docks (classic Wix: fully free on a fixed stage) [WX-pos] |
| PD-1 | HAS — Desktop base, 991 / 767 / 479, optional 1280 / 1440 / 1920 [PG-01 A2] | HAS — 1001 / 750 / 320, up to 6 custom per page [PG-01 A2] |
| PD-2 | HAS — Display: None at a breakpoint (removes from a11y tree) [WF-hide] [WF-disp] | HAS — More Actions › Hide (current breakpoint); unhide only in Layers [WX-layers] |
| PD-3 | PARTLY — Order (First / Last / custom) for flex and grid children only; tree order is global [WF-flex] [PG-01 A14] | HAS — drag within the same parent per breakpoint; stack / flexbox order; "Use Section Order on All Breakpoints" [WX-pos] [WX-layers] |
| PD-4 | HAS — every Style value per breakpoint [PG-01 A14] | HAS — position, size, docking, design per breakpoint [PG-01 A14] |
| PD-5 | HAS — desktop cascades down AND up; override stops inheriting [PG-01 A2] | HAS — desktop cascades down only [PG-01 A2] |
| PD-6 | HAS — Preview mode; Expand canvas (all breakpoints side by side) [WF-keys] [WF-expand] | HAS — Preview (Ctrl+Alt+P); breakpoint bar [WX-keys] |
| MS-1 | HAS — Object fit + position; background Cover / Contain + position [WF-size] [WF-bg] | HAS — Display mode: Fill / Fit to bounding box / Keep image ratio; Focal Point per breakpoint (auto on faces) [WX-img] |
| MS-2 | HAS — width/height in Image settings, Ratio [WF-img] [WF-size] | PARTLY — Keep image ratio; not documented how the published page reserves space [WX-img] |
| MS-3 | HAS — srcset/sizes generated on upload; Loading Lazy / Eager / Auto [WF-img] | PARTLY — not documented in the pages read |
| MS-4 | HAS — Video element (embed), Ratio [WF-vid] [WF-size] | HAS — video players with Lock aspect ratio [WX-size] |
| MS-5 | HAS — Backgrounds: image, gradient, overlay, Fixed; Background Video element [WF-bg] | HAS — section background image / video ("Change the background") [WX-sec] |
| SE-1 | HAS — Box tag: Div, Header, Footer, Nav, Main, Section, Article, Aside … [WF-box] [WF-sem] | PARTLY — header/footer as global sections; a landmark tag for containers is not documented; ARIA needs dev mode [WX-glob] [WX-a11y] |
| SE-2 | HAS — heading elements H1–H6; Audit panel flags skipped levels [WF-audit] | HAS — text tag in SEO & Accessibility; Accessibility Wizard fixes heading order [WX-a11y] |
| SE-3 | HAS — Navbar element (predefined nav tag), List element [WF-sem] [WF-add] | PARTLY — menu element; markup not documented |
| SE-4 | PARTLY — source = Navigator order; help warns that reverse / order / dense break it [WF-flex] [PG-01 A15] | PARTLY — "content is read by the DOM order"; Layers reorder moves the page; sticky Keep in front avoids a DOM move [WX-a11y] [WX-sticky] |
| AX-1 | HAS — Text zoom preview (9 / 24 / 32px) in Canvas settings [WF-zoom] | NO — no preview; px* defaults ignore text size |
| AX-2 | PARTLY — focus styles you must set (Tabs, Dropdown, Navbar); skip link not built in [WF-a11y] | PARTLY — built-in skip-to-content and landmarks per Wix engineering, not in help [WX-eng] |
| AX-3 | HAS — smooth scroll and GSAP honour reduced motion [WF-a11y] | HAS — Reduced Motion stops animations / videos [WX-a11y] |
| AX-4 | PARTLY — help warns about horizontal scroll from the Body; no guard [WF-body] | PARTLY — Mobile breakpoint floor 320; no guard [WX-bp] |
| SD-1 | PARTLY — Code export (Shift+E); no budget | NO — no export, no budget shown |
| SD-2 | HAS — Lazy loading option, width/height [WF-img] | PARTLY — not documented in the pages read |
| ED-1 | HAS — Add panel drag, Ctrl+Z / Shift+Ctrl+Z [WF-add] [WF-keys] | HAS — Add Elements drag, Ctrl+Z / Ctrl+Y [WX-keys] |
| ED-2 | HAS — Navigator (Z), breadcrumb bar [WF-nav] [WF-body] | HAS — Layers (Ctrl+L), Layer Selection: Parent first / Child first, Ctrl+click child [WX-layers] [WX-keys] |
| ED-3 | HAS — Copy / paste even across sites (styles, interactions kept), Ctrl+D; style reuse via classes [WF-copy] [WF-keys] | PARTLY — Copy / Paste / Duplicate (Ctrl+D, Alt-drag); paste-design not in Studio docs [WX-keys] |
| ED-4 | HAS — Add panel › Layouts (Starter Library), Quick Stack presets, Marketplace [WF-lib] [WF-qs] | HAS — Sections / Wireframes presets, section grid layouts (Rows, Columns, Collage) [WX-sec] [WX-sg] |
| ED-5 | PARTLY — Rulers (Shift+R), Guides (Shift+G), Show element edges, X-ray; no snapping in flow [WF-canvas] | PARTLY — no rulers/guides; snaps to grid lines / docking; Shift-drag straight lines (classic Wix has rulers + guides with snap) [WX-ruler] [WX-keys] [WXC-ruler] |
| ED-6 | PARTLY — Audit panel: alt text, link text, heading levels, duplicate IDs — not layout [WF-audit] | PARTLY — Accessibility Wizard: headings — not layout [WX-a11y] |

## New rows (capabilities the shared list lacks)

| ID | Capability | Webflow | Wix Studio |
|---|---|---|---|
| PS-6 | A reusable block with per-copy content, variants and slots | HAS — Component properties, variants, Slots (restrictable to chosen components) [WF-comp] | PARTLY — global sections are identical everywhere; no per-instance content found |
| FL-6 | A row that scrolls sideways / slider row (overflow-x) | PARTLY — Overflow hidden/scroll/auto; "horizontal scrolling" is a scroll interaction [WF-size] [WF-hs] | HAS — Flexbox "Slider" display, per breakpoint [WX-fg] |
| AL-6 | Push one item to the far end (auto margin) | HAS — margin Auto, "Center element" button [WF-sp] | NO — not found |
| SZ-7 | Dynamic viewport units (dvh / svh / lvh) so a full-screen band fits under mobile toolbars | HAS [WF-vu] | NO — vh only [WX-size] |
| PO-6 | Pinned within a parent or a section (not only the viewport) | NO — Fixed is viewport-only | HAS — Pinned → Container / Cell · Section · Page; one pinned section per page [WX-pin] |
| PD-7 | All breakpoints on one canvas while editing | HAS — Expand canvas [WF-expand] | NO — one breakpoint at a time |
| MS-6 | Crop and focal point set per breakpoint | PARTLY — object-position per breakpoint, no focal-point tool [WF-size] | HAS — Crop + Focal Point per breakpoint [WX-img] |
| AX-5 | Colour-vision preview of the layout | HAS — Vision preview [WF-canvas] | NO — not found |
| ED-7 | Locked page building for non-designers (only approved blocks in set places) | HAS — Page slot + Marketer role, restricted slots [WF-tpl] [WF-comp] | NO — not found |
| ED-8 | Custom CSS / classes on any block | HAS — classes, Custom CSS properties [WF-var] | HAS — global.css + Custom classes (overrides the Inspector) [WX-css] |

## The first hour (defaults and presets a beginner meets)

**Webflow.** Blank canvas = one Body. The Add panel's Structure now has **Box · Quick Stack · Page Slot**; Box (2026)
replaces Section, Container, Columns, Grid, V/H Flex, which stay working on old sites but are hidden [WF-box] [WF-add].
A Box arrives with no padding; legacy Section had no padding; legacy Container 940 / 728px. The **Layouts** tab
(Starter Library) gives navbars, heroes, footers [WF-lib]. Quick Stack presets 1–4 columns with a 20px gap [WF-qs].
Spacing unit defaults to **px** [WF-sp]. Desktop is the base; 991 / 767 / 479 below [WF-bp]. Navigator on Z, guides
on Shift+G, rulers on Shift+R [WF-keys] [WF-canvas].

**Wix Studio.** A site starts with a **global header and footer** [WX-glob]. A new section has a one-cell grid
("Blank") [WX-sg] and gets the **1600px site max width** [WX-max]. Dropped elements **auto-dock** to the top and the
nearer side, with **px\*** (scale) units [WX-dock]. Most elements default to **Scale proportionally**; horizontal
stacks to **Hug** [WX-size]. Breakpoints ≥1001 / 751–1000 / 320–750 [WX-bp]. An element added at a smaller breakpoint
is **hidden on the larger ones** [WX-layers]. Start pages from **Sections / Wireframes** presets [WX-sec].

## Could not read (and why)

| Source | Why | Used instead |
|---|---|---|
| help.webflow.com HTML pages | 403 to a fetch | the Help Center's public article API (full text) |
| Webflow *Semantic HTML5 tags*, *Audit panel* | not pulled through the API in this pass | search-result summaries of the same articles; the Box article lists the tags in full |
| Wix *Pinning elements and sections*, *Global sections*, *Shape dividers*, *Flexboxes* | read only via search-result summaries | marked "(via search summary)" in the sources |
| Wix Studio landmark tags for containers / sections | no Wix help page found that says which tags a container can take | marked PARTLY; to be checked in the editor |
| Wix Studio image delivery (srcset, lazy loading, CLS) | not in the image article; no Studio help page found | MS-3 / SD-2 marked PARTLY (unverified) |
| Wix Studio text columns, baseline alignment, auto margin | no help page found | marked NO (not found), to be checked in the editor |
| Wix Studio keyboard table (layering keys) | the table is garbled (Ctrl+↑ listed for two actions) | Editor X page shows Ctrl+Shift+↑/↓ for front/back |
