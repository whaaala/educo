---
title: Layout — reference
sidebar_position: 2
description: Every layout control in the builder — its exact panel name, what it does, its keyboard shortcut, and where to find it.
---

# Layout — reference

This is the control-by-control reference for the builder's layout panels. For scenarios and explanations see
[Layout — the story](/).

Controls are grouped by where they live. A control that appears in more than one block type is described once and
cross-referenced.

---

## Top bar

| Control | What it does | Shortcut |
|---------|-------------|---------|
| **+ Add a band** | Adds a full-width coloured band at the bottom of the page; you can drag it to any position after. | — |
| **Undo** | Reverses the last change. | Ctrl / Cmd Z |
| **Redo** | Re-applies the last undone change. | Ctrl / Cmd Y |
| **Preview** | Opens the real published page at the current screen width. Close it with **Exit preview** or Escape. | — |
| **Export** | Downloads the built site as a folder of HTML, CSS and assets. | — |
| **Reset** | Clears the page and starts from blank. | — |
| **Device chips** (Mobile · Tablet · Laptop · Desktop · Wide · Full width) | Switches the canvas to that screen width. Settings you change at that width apply only below (or above) it. | — |
| **Base size** | The width in pixels that the canvas is zoomed to fit on your screen. | — |
| **Page grid** icon | Opens the Page grid panel (see below). | — |
| **Page check** icon | Shows warnings: pictures missing a description, lines too tight for words, heading levels out of order. | — |
| **Blocks** launcher | Opens or closes the floating Blocks panel. | **B** |

---

## Blocks panel

| Section | Block | What it makes |
|---------|-------|--------------|
| **Layout** | Stack | Things one under another. |
| | Side by side | Things in a row. |
| | Grid | Things across and down, sized like a table insert (sweep across × down). |
| | Spacer | Adjustable blank space. |
| | Divider | A horizontal rule (solid, dashed, dotted). |
| | Hero | One full-screen photograph with headline. |
| | Rotating hero | Several full-screen photographs in turn. |
| **Text** | Heading | Titles — Display, Title, Subtitle, Eyebrow styles. |
| | Text | Paragraphs — Body, Lead, Caption, Quote styles. |
| | Button | A call-to-action link. |
| | List | Bulleted or numbered. |
| **Media** | Image | One photograph or image. |
| | Photo gallery | Many photographs at once, set up in one dialog. |
| | Slider | Photographs shown one at a time with dots. |
| | Video | YouTube, Vimeo, or MP4. |
| | Icon | A searchable symbol (inline SVG). |
| | Embed | Raw iframe or HTML pasted in. |
| **Components** | Accordion | Expandable Q&A. |
| | Alert | One urgent message (closure notice, open day…). |
| | Card | Image + heading + text + button. |
| | Quote | Testimonial with author. |
| | Stat | Big number + label. |
| | Badge | Small pill label. |
| | Rating | Star rating display. |
| | Pricing | Pricing plan card. |

---

## Block toolbar

Appears just above (or below) the selected block.

| Button | What it does | Shortcut |
|--------|-------------|---------|
| Block name (e.g. "Stack") | Opens the Inspector for this block. | Click anywhere on the block |
| **↑ Move up** | Moves the block one position earlier in its container. | — |
| **↓ Move down** | Moves the block one position later in its container. | — |
| **⊕** (plus) | Opens a menu: **Add a block after** (adds a sibling below), **Add a block inside** (nests inside this block). | — |
| **⧉ Duplicate** | Makes an identical copy directly below. | Ctrl / Cmd D |
| **✕ Delete** | Removes the block and its children. | Delete / Backspace |
| **⋯** | More: Wrap in a Stack, Float / Stick, Meaning (semantic role). | — |

---

## Inspector — Design tab

### Arrange as (Stack / Side by side / Grid only)

| Control | What it does |
|---------|-------------|
| **Stack / Side by side / Grid** | Switches the container between the three arrangements without losing its children. |
| **Show one at a time** | Turns any container into a pager — children become pages, visitors swipe between them. |

### Size (every block)

| Control | What it does | Notes |
|---------|-------------|-------|
| **Width** | The block's share of its row, as a fraction (e.g. 3 of 6) or a fixed rem value. Drag the block's left or right edge to change it; the opposite edge stays fixed. | Per screen |
| **From line** (page-grid rows) | The column line where the block starts. Changing this moves the left edge; the right edge stays. | Per screen |
| **To line** (page-grid rows) | The column line where the block ends. Changing this moves the right edge; the left edge stays. | Per screen |
| **Whole line** (page-grid rows) | Spans every column on the current screen. Adapts if the column count changes. | Per screen |
| **To the last line** (page-grid rows) | Sets the right edge to the last column boundary, from wherever the left edge is. Adapts with column count. | Per screen |
| **Bleed to page edge** (page-grid rows): Off · Left · Right · Both | Extends the block past the page's side space to the page's physical edge on that side. | Per screen |
| **Free inside its columns (% of them)** Left / Right (Alt-drag) | Fine position within the block's columns, as a percentage. Appears after an Alt-drag. | Per screen |
| **Back on the lines** (Alt-drag) | Snaps a free-positioned block back to its column boundaries. Clears the left / right margins. | — |
| **Rows tall** (page-grid rows) | How many grid rows this block spans. 1 is the default; 2 or more makes it cover multiple rows. | Per screen |
| **Height** | A minimum height for the block, in rem or px. Not available on all block types. | Per screen |
| **Minimum rows tall** (bands) | For a page-grid page's outer band — the band is at least this many row-heights tall. | Per screen |

### Placement

| Control | What it does |
|---------|-------------|
| **In the flow (default)** | The block participates in the page's normal layout. |
| **Floating** | The block is lifted above the flow; you drag it to any x / y position. Other blocks ignore it. |
| **Sticks when reached** | The block stays on screen as the user scrolls past it (position: sticky). Works in rows and stacks. |

### Meaning (semantic role)

| Control | What it does |
|---------|-------------|
| **Page header** | Wraps the block in `<header>`. |
| **Navigation** | Wraps the block in `<nav>`. |
| **Main content** | Wraps the block in `<main>`. |
| **Sidebar** | Wraps the block in `<aside>`. |
| **Page footer** | Wraps the block in `<footer>`. |
| **Heading level** | For Heading blocks — the h1 / h2 / h3 / h4 level in the published HTML. |

### Spacing

| Control | What it does | Notes |
|---------|-------------|-------|
| **Gap between blocks** | The space between children inside this container, across and down. Drag the slider or type a value. Default is about 1rem. | Per screen |
| **Space between columns** (page-grid rows) | The gap between blocks side by side in a page-grid row (across). | Per screen |
| **Space between rows** (page-grid rows) | The gap between wrapped lines of a page-grid row (down). | Per screen |
| **Inner spacing (padding)** | Space between the block's edge and its content, all sides at once or each side separately. Shows "Default · …rem" and a **Back to default** button. | Per screen |
| **Outer spacing (margin)** | Space outside the block's edge, all sides at once or each side separately. Shows "Default · …rem" and a **Back to default** button. | Per screen |

*Every spacing control that shows "Default · …rem" means the value is the builder's default and can be returned to it
with **Back to default**. The default is never zero unless you set it to zero.*

### Background

| Control | What it does |
|---------|-------------|
| **Colour** | Fills the block with a solid colour from the site's design tokens (or a custom hex / OKLCH value). |
| **Gradient** | A gradient between two or more colours, with direction. |
| **Image** | An uploaded photograph or pattern as a background. |
| **Overlay** | A semi-transparent colour layer over a background image (to keep words readable). Strength: 0–100%. |
| **Pattern / Grain** | A noise or grid texture over the background. |
| **Edge shape** | The block's top or bottom edge is given a wave, diagonal, or other decorative shape. |

### Shadow, Border, Radius

| Control | What it does |
|---------|-------------|
| **Shadow** | Adds a drop shadow: size, blur, spread, colour. |
| **Border** | A visible outline: width, style, colour. |
| **Corner radius** | Rounds one or all corners independently, in rem. |

---

## Inspector — Content tab

(Available on Text, Heading, Button, Image, List, and component blocks.)

| Control | What it does |
|---------|-------------|
| **Text / Label** | The editable text for this block. Click the block on the canvas to edit inline instead. |
| **Link** | For Button and Heading — the URL the block links to (a page name, or a full URL). |
| **Describe this image** | The alt text for an Image block. Read aloud to users who cannot see it. |
| **Load straight away** | Turns off lazy loading for an Image — use only for images at the very top of the page. |
| **Show the whole picture (don't crop it)** | Ticked: the block takes the photograph's own proportions. Unticked: crops to the Height you set. |
| **Fill the block's height** | For an Image inside a block that spans multiple rows (Rows tall ≥ 2): the picture fills the block's full height, cropped to its focal point. A **switch** in the Content tab; on by default for a solo picture in a spanning block. |
| **Bookmark** | An anchor name — the block can be linked to directly using `#bookmark`. |

---

## Inspector — Per-device tab

| Control | What it does |
|---------|-------------|
| **Hidden on this screen** | The block is completely absent at the selected device chip's width — no space, no content in the HTML. |
| Device chip selector | Shows which screen's settings you are editing. Values set here apply from that width down (or up for Wide). |

---

## Page grid panel

Opened with the **Page grid** icon in the toolbar (the grid of squares).

| Control | What it does | Notes |
|---------|-------------|-------|
| **Columns** per screen | The number of column divisions on each device. Default 12 for tablet and up, 6 for phone. | Per screen |
| **Side space** (frame) | Breathing room on all four page edges. Default: `clamp(1rem, …, 1.25rem)` — 1rem on a phone, gently growing to 1.25rem wide. Setting it to 0 puts every block against the page edge. | Single value, all four sides |
| **Space between columns** | Gap between blocks side by side in page-grid rows (across). Default ~0.75–1.5rem. **Back to default** restores it. | Per screen |
| **Space between rows** | Gap between wrapped lines in page-grid rows (down). Same defaults. **Back to default** restores it. | Per screen |

---

## Keyboard shortcuts (complete list for layout)

| Key | What it does |
|-----|-------------|
| **B** | Open / close the Blocks panel |
| **Ctrl / Cmd Z** | Undo |
| **Ctrl / Cmd Y** | Redo |
| **Ctrl / Cmd D** | Duplicate selected block |
| **Delete / Backspace** | Delete selected block |
| **Escape** | Deselect; close panel / inspector (on tablet) |
| **Tab** | Move focus to the next interactive element |
| **Shift + drag edge** | Snap to half-column lines (page-grid rows) |
| **Alt + drop / drag edge** | Free-position inside columns (page-grid rows) |
| **Arrow keys** (block selected) | Nudge a floating block 1px; reorder in the flow 1 step |
| **F11** | Full-screen the canvas |

---

## How controls change per screen

Many controls are **per screen**: the value you set at Desktop applies to Desktop only; the value at Mobile applies
to Mobile only. The cascade works like CSS: a value set at a wider screen applies to narrower screens too, unless
you override it at that narrower screen.

The device chip in the top bar shows which screen you are editing. The Inspector labels a control "(per screen)"
when it supports this. Controls without that label apply to all screens equally.

---

*See also:* [Layout — the story](/) for scenarios and explanations · [Website Builder](website-builder) for
content blocks, media, components, themes, Preview and export.
