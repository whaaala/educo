---
title: Laying out a page — the story
sidebar_position: 1
slug: /
description: What a person wants on a page, what they do, what they see on every screen, and why the builder behaves as it does — scenario by scenario.
---

# Laying out a page — the story

This is the documentation you read first. It is not a manual and not a list of controls: it walks through what a
person wants on a page, what they do, what they see on every screen, and why the builder behaves as it does. The
reference guide ([Layout — reference](layout-reference)) has every control; this has the reasons and the examples.
It grows: every time an area of the layout is finished, its story is added here.

The one idea behind everything: **you build a page out of boxes, and every box knows how to behave on a phone, a
tablet and a desktop without you telling it.** You decide *what goes where*; the builder decides *how it fits*.

---

## 1. The three shapes, and the band

Maya is putting together the Year 6 page. She opens the Blocks panel and sees three ways to hold things:

- **Stack** — things one under another. A heading, then words, then a button.
- **Side by side** — things next to each other. A photo beside a paragraph.
- **Grid** — a table-like arrangement: three cards across, two rows of them.

They are the same block in three arrangements, so nothing is a dead end: a stack can hold a row, a row's column can
hold a stack, and a grid cell can hold either. Every layout on every real site we studied is made of these three,
nested. (That is not a guess: 4,147 crawled pages, every one of them describable this way.)

Underneath, every block you drop on the page sits in a **band** — a full-width strip. You never see bands, but they
are why "put this beside that" and "put this under that" always land where you point: beside means the same band, under
means a new one.

**Edge to edge, or a centred column.** Select a band and choose *Edge to edge* (the colour runs to the window's edges
and so does the content) or *Centred column* (the colour still runs edge to edge, but the content is held to a
comfortable reading width in the middle). Maya's hero is edge to edge; her body text is a centred column, because 68
characters a line is what people can read.

## 2. "I want a photo beside my words"

Maya drops a **Text** block into her section, types her paragraph, then drags an **Image** tile and drops it on the
right edge of the text. The builder makes a row of two columns: words on the left, photo on the right, each half the
width.

She wants the photo smaller. She clicks the text column, grabs its right edge and drags it right. The boundary between
the two moves, the words widen, the photo narrows — **the edge you grab is the only thing that moves; the far edges
stay where they are.** She lets go at 60 / 40.

Now the screens:

- **Desktop and laptop:** 60 / 40, as she set it.
- **Tablet:** still 60 / 40 — two columns fit comfortably.
- **Phone:** the photo drops under the words, each full width, because two columns on a 375px screen are two unreadable
  slivers. (On a page-grid page, a row of short things — four stats — may stay two across on a phone where their words
  fit; see §6¾.)

She did not set anything for the phone. She could: switch the device chip to Mobile and change the photo there, and
that choice would apply from the phone size down and nowhere else.

## 3. "Three cards across, that stack on a phone"

For the clubs, Maya wants three cards. She clicks **Grid**, sweeps *3 across, 1 down*, and gets three empty cells. She
drops a **Card** into each. The cells share the width equally; the cards grow to the tallest one so their buttons line
up.

- **Desktop, laptop:** three across.
- **Tablet (600–900px):** still three across — three cards at 250px each are perfectly readable, so the builder leaves
  them. (Four or more across *would* be rearranged to at most three a line on a tablet, as evenly as they can: 4 → 2 + 2,
  6 → 3 + 3.)
- **Phone:** one under another.

**The grid also watches its own box, not only the screen.** Later Maya puts a three-across grid of quotes *inside* the
middle card. That inner grid is now in a box a third of the page wide. On a laptop the screen has room for three
across, but the box does not — so the inner grid goes two across, and inside anything narrower than about 24rem it goes
to one. Nothing squeezes to a sliver, and no word is ever broken letter by letter.

**Any number across, and the numbers never break.** For the school's facts Maya sweeps *6 across* and drops a **Stat**
into each cell — "1,000+ pupils", "45 teachers"… On a wide screen there is room for all six, but beside the sidebar the
main column is narrower, and "1,000+" in big figures needs about 200px. So the grid gives up columns before it would ever
break the number — and it gives them up **evenly**: six become **3 + 3**, then **2 + 2 + 2**, never five with one left
alone underneath. A row of four Stats does the same (2 + 2).

**A small thing beside a tall one.** In "Meet the team" Maya puts a star icon in the first cell and a long quote in each
of the others. The star's cell is as tall as the quotes — the row stays lined up — but the star itself stays star-sized
at the top. She drags a **Text** from the blocks panel and lets go just under the star: it lands right there, one gap
below the star, in the same cell. The spare height of the cell goes to the last block, below its words, never into a hole
between the two.

## 4. "A sidebar that stays put"

The term-dates page has a long article and a short "In this section" list. Maya drops a Stack, puts the article in
it, then drops another Stack on its right edge for the sidebar, and drags the boundary to 70 / 30. She selects the
sidebar → Design → Placement → *Sticks when reached*, so it stays on screen while the article scrolls.

- **Desktop, laptop, tablet landscape:** article and sidebar side by side, the sidebar holding its place as you scroll.
- **Phone:** the sidebar goes under the article, full width.

Two things she marks under *Meaning*: the article column as **Main content**, the sidebar as **Sidebar**. That is what
makes the published page say `<main>` and `<aside>` to a screen reader; she never sees the tags.

## 5. Sizing by hand — and the one pixel of slack

When Maya sizes a column herself, that size is hers: "the size you drag is the size you get", and the builder never
quietly changes it. Two things protect that promise:

- **Nothing is drawn narrower than its longest word.** Drag a column to 3rem and it will still be as wide as the
  longest word in it, so words never break.
- **Every line that holds a hand-sized column has one pixel of slack.** A word that needed one pixel more than the
  column's share made the column one pixel wider, the row no longer fitted, and the neighbour dropped to the next
  line — a hole. The slack lives at the end of the line (the last column lends it), so no column changes size.

## 6. Hiding something on one device

The menu is a list of links on a desktop and a "☰ Menu" button on a phone. Maya selects the link list → *Per-device*
→ at the Mobile chip, ticks *Hidden on mobile*; then selects the button and hides it everywhere else.

**A hidden block is gone from that device — on the canvas as much as on the published page.** It takes no space and
moves nothing. When she needs the hidden menu back to edit it, the **Hidden** toggle beside the device chips draws it
faintly; click again and it is gone.

## 6½. "My words never touch an edge" — space by default

I drop a Heading on an empty page. Its words sit a gutter in from both edges (about 2rem; a little less on a phone),
with a little space above and below — I never set any of it. I drop three Stacks beside each other and colour them: a
**1rem gap** runs between them, the first still starts at the page's left edge and the last ends at its right, and all
three stay on one line.

Every one of these is mine to change, down to zero: select the block, open **Spacing**, and each control says
"Default · 2rem" until I move it, with **Back to default** to undo my change. A page I saved before these
defaults existed opens exactly as it was.

---

## 6¾. "The whole page is mine" — the page grid

*New pages from 4 October 2026.*

### What you see

Every page I add now sits on an invisible grid: twelve columns across from a tablet up, six on a phone, running from
one edge of the page to the other. I never see the grid itself. What I notice is that things line up: the photo in my
hero, the three cards under it and the stats under those all start and end on the same lines — about 1rem from the edges
of a phone and about 1.25rem on a wide screen.

The lines run gapless, edge to edge. The space between two blocks is centred on a line, not inside each block, so
**three cards side by side share one gap** (0.75rem on a phone, 1.5rem wide) rather than each carrying its own margin.

### Columns change per screen

The builder gives every screen its own column count:

| Screen | Default columns |
|--------|----------------|
| Phone (< 600px) | 6 |
| Tablet (600–900px) | 12 |
| Laptop (900–1200px) | 12 |
| Desktop (1200–1800px) | 12 |
| Wide (≥ 1800px) | 12 |

I can change any of these in **Page grid** (the grid icon in the toolbar). Adding more columns — say 16 for a fine
grid — divides the page into more, thinner slices. The blocks on the page keep their proportional share of the
column count.

### The guides

When I click a block, faint vertical lines appear across the canvas. Each line is a grid column boundary. A block
snaps to the nearest line when I drag its edge, so every edge lands on a line, not a pixel between two.

### Snapping and Shift-snap

Drag a block's edge and it snaps to the nearest column line. Hold **Shift** while dragging and it snaps to half-lines
too — the centre of a column. That lets me place a block that spans a column and a half, or a precise two-and-a-half.

**The far edge stays put.** When I drag a block's left edge right, its right edge does not move. When I drag the right
edge left, the left edge stays. This is "the edge you drag is the only edge that moves" — the same rule as resizing
any column, applied here to a block on the grid.

### Alt-drag: free inside the columns

Hold **Alt** while dropping a block (or dragging an existing block's edge) to place it freely instead of snapping to
lines. The block still "owns" the columns it lands on — its share of the grid's column count doesn't change — but
a margin inside its columns moves it to where you let go.

This is "Alt-free": the block covers the nearest columns and sits inside them with a margin. At every other screen
it keeps the same columns. A block in Alt mode shows "Free inside its columns (% of them)" Left / Right in the Size
section of the Inspector, with a **Back on the lines** button that snaps it back.

An **Alt-drag of a block's edge** runs the block's columns out to the nearest line beyond the pointer, with the
leftover distance as the free margin. So a small nudge adjusts the margin; a large drag extends to the next column
and adjusts the leftover.

An **Alt-drag of the whole block** (not an edge) **slides it** along its current line — between its neighbours, which
never move. The block does not lift to a free x / y position; it shifts left or right within the space the line has.

### "From line" and "To line"

Select a block and look at the **Size** section. Two controls appear: **From line** and **To line**. These are the
column lines where the block starts and ends — the same as dragging the edges, but typed as numbers.

Changing "From line" moves the left edge; the right edge stays. Changing "To line" moves the right edge; the left
edge stays. Both are per screen: set "From line 2" on Mobile and it applies only below 600px.

### Whole line, To the last line

**Whole line** makes a block span every column on its row — from line 1 to the last line on that screen. If I later
change the column count from 12 to 16, the block grows with it.

**To the last line** sets the block's right edge to the page's last column boundary on every screen. The block starts
where I placed its left edge; only its right end is pinned to the last line. It also adapts when the column count
changes.

### Bleed and half-bleed

A block can bleed past the page's side space to the page's physical edge, on either side or both:

- **Bleed left:** the block extends left to the edge of the page, ignoring the side space.
- **Bleed right:** same, on the right.
- **Bleed both:** edge to edge.

A block that bleeds on one side still keeps the side space on the other. A coloured band that bleeds both becomes a
true full-width stripe. These are also per screen: bleed on Desktop, not on Mobile.

**Half-bleed** (a block at the first or last column) means the block's outer edge sits at the page edge and the side
space is absorbed into its first/last column rather than appearing outside it.

### Space between columns and rows

Two controls in the **Page grid** panel:

- **Space between columns** (across): the gap between blocks side by side, from 0 to 4rem, default about 0.75–1.5rem
  depending on screen width. Guides and blocks move together when this changes.
- **Space between rows** (down): the gap between wrapped lines of a row, from 0 to 4rem, default same range.

Each has a **Back to default** button.

### Rows tall — spanning rows

A block in a page-grid row can be set to span multiple rows. Select it, go to **Size** → **Rows tall**, and pick 2
(or more). The block covers two row-heights; the blocks beside it each get their own row.

Where Maya has a gallery photo beside two short paragraphs, she sets the photo to "Rows tall 2". The photo covers the
height of both paragraph rows; the paragraphs sit one per row beside it. The photo's height still grows with its
words if any are inside — it doesn't force a fixed height.

**On a screen where the fit rule stacks the row** (words too tight to fit side by side), the span is automatically
dropped — the photo and the paragraphs each take their own line, the same as without the span.

### The frame

Every page-grid page has a **side space** around it — a little breathing room on all four edges. By default this is
`clamp(1rem, …, 1.25rem)`: 1rem on a small phone, gently growing to about 1.25rem on a wide screen. It applies to
the page's top and bottom as well as its sides.

- A coloured first or last section still bleeds to the page edge; only its content keeps the frame inside it.
- The frame is set in one place — **Side space** in the Page grid panel — and affects all four sides together.
- Set it to 0 and every block meets the page edge.

### How a row steps on a phone

When a row is too narrow for its blocks to fit side by side with readable text, the builder stacks them:

1. Four blocks of equal width at Desktop → two on one line, two on the next, on Tablet or a narrow phone.
2. Four blocks → one per line on a 360px phone.

This is the **fit rule**: every block's width is the minimum of its assigned share and the narrowest it can be while
keeping a readable word. When that minimum is wider than a single column, the builder gives the block its own line.

The stacking is always **even**: four become **2 + 2**, six become **3 + 3**, never five with one alone at the
bottom. Short words (stats, icons, tags) fit more across; long words step sooner.

**What about a lone half-width block on a phone?** If a block was set to half the page on Desktop and ends up alone
on its phone row, it now takes the whole line — there is no reason for a hole. A width you explicitly set on the
phone itself still wins over this widening.

### "The page uses its space" — nothing left empty that nobody chose

An Accordion, an Alert, a Card, a Quote all run the full width of the row they are in on every screen. A Badge, a
Stat, a Rating stay as wide as their content.

When a row is too narrow and the builder stacks it, each block on its own line fills that line. No half-width photo
with an empty half beside it. When Maya deletes the middle one of three columns, the other two close the gap.

**What she chooses always wins.** She drags the Accordion's right edge in and it keeps that width on every screen
and after a reload. She drags the outer edge of the last column to leave a margin on the right, and that space stays;
the column beside it does not grow into it.

### Pages saved before the page grid

Pages created before 4 October 2026 open exactly as they were. The page grid is new pages only; nothing about an
existing page changes.

---

## 7. Text and space: which one follows what

Two fluid units run the page, and they answer different questions.

- **Space follows the box.** A card's padding, a section's gap, the page gutter: each scales with the width of the box
  it is in. Every spacing value also carries a rem term, so a reader who has set a larger browser text size gets larger
  spacing too, not only larger words.
- **Type follows the page.** A heading is one size wherever it sits — in a sidebar, in a card, in a wide band. The
  page title is the biggest words on the page, the section headings next, and a card's title under them, regardless
  of how wide their boxes happen to be.

Every text size still has a floor in rem, so a caption never drops under the reader's own base size on a phone.

## 8. Colour that reads

Give a band a colour and its words, muted words, links and focus rings are recomputed to read against it — 7:1 for
words, 4.5:1 for the rest — keeping the band's own hue at a whisper. Links on the plain page use a readable link
colour: the brand, moved only as far as it needs to read on that theme's background and on a card. Maya never checks
a contrast number; the page is never below one.

## 9. Small things stay the size they look

Beside each club, Maya puts a small **Icon** in a narrow column, the words next to it, and a **List** of meeting days
underneath. Three things she can rely on:

- **An icon is exactly as big as it is drawn.** On a phone her star is 22px tall in the editor and 22px on the
  published page.
- **A list has the same space under every item in both.** Three items are 80px tall on a phone, in the editor and
  published alike.
- **When the reader makes their text bigger, a narrow icon column still fits.** At 150% browser text the icon grows
  with everything else and stays inside its column.

**In a grid, the editor never adds a row of its own.** When a row has columns left over, the editor offers them
("Add a block here"). When the grid has narrowed by its own box, its last row is always full, so nothing is offered.

**She can let go of a block anywhere the marker shows — even over the toolbar.** While anything is being dragged,
the toolbar and the handles step aside for the pointer, so the block lands where the dashed marker said it would.

## 10. What is published

Everything above becomes proper HTML5: `header`, `nav`, `main`, `aside`, `section`, `footer`; one `h1`; heading levels
that follow the page; a skip link for keyboard users. The canvas and the published page are the same layout to within
a pixel at every size — that is a rule with tests behind it, not an aspiration, and every sweep of real pages
re-measures it.

---

## 11. The editor on a tablet or phone

Maya opens the builder on her school's iPad. The canvas fills the screen; the Inspector hides as a narrow tab on the
right edge labelled **INSPECTOR**. She taps a block; the tab label changes to the block's name. She taps the tab and
the Inspector slides over the canvas from the right.

- **Escape** (or tapping outside the Inspector) closes it and returns her to the full-canvas view.
- The blocks panel floats over the canvas, same as on a large screen.
- All gestures — tap to select, drag to move, drag an edge to resize — work with touch. Dragging an edge on a tablet
  works the same as dragging on a desktop: the edge you touch is the only edge that moves.

On a phone the canvas is zoomed to fit the screen. Maya can zoom in to work on a narrow section, then zoom back out.
Every control in the Inspector is reachable by scrolling; Escape closes it.

**The inspector never covers the block she just tapped.** On narrow screens the inspector panel sits above the block's
z-order, so she can see the canvas while the inspector is open — she just cannot interact with the part of the canvas
behind it.

---

## What comes next

The reference page ([Layout — reference](layout-reference)) lists every control in the Layout panels by its exact
name and what it does. The Website Builder Guide ([Website Builder](website-builder)) covers content blocks, media,
components, themes, Preview, and export.
