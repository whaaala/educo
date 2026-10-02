---
title: Laying out a page — the story
sidebar_position: 1
description: What a person wants on a page, what they do, what they see on every screen, and why the builder behaves as it does — scenario by scenario.
---

# Laying out a page — the story

This is the documentation you read first. It is not a manual and not a list of controls: it walks through what a
person wants on a page, what they do, what they see on every screen, and why the builder behaves as it does. The
reference guide ([website-builder.md](website-builder.md)) has every control; this has the reasons and the examples.
It grows: every time an area of the layout is finished, its story is added here (RULE L in `CLAUDE.md`).

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
- **Phone:** the photo drops under the words, each full width. Every row does this on a phone, because two columns
  on a 375px screen are two unreadable slivers.

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
to one. Nothing squeezes to a sliver, and no word is ever broken letter by letter. (Before this rule, exactly that
happened: three quotes 85px wide, "ev / er / yt / hi / ng".)

**A small thing beside a tall one.** In "Meet the team" Maya puts a star icon in the first cell and a long quote in each
of the others. The star's cell is as tall as the quotes — the row stays lined up — but the star itself stays star-sized
at the top. She drags a **Text** from the blocks panel and lets go just under the star: it lands right there, one gap
below the star, in the same cell. The spare height of the cell goes to the last block, below its words, never into a hole
between the two — so when she later drags the edge of the band below further down, the last coloured row of a column
stretches to meet it too. (A cell holding just one Card is different on purpose: the Card grows to the row's height, so a row of
Cards keeps its buttons in line.)

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
- **Every line that holds a hand-sized column has one pixel of slack.** Why: a word that needed one pixel more than
  the column's share made the column one pixel wider, the row no longer fitted, and the neighbour dropped to the next
  line — a hole. Worse, the editor and the published page rendered that pixel differently, so only one of them
  wrapped. The slack lives at the end of the line (the last column lends it), so no column changes size — the size you
  drag is still the size you get — and a hair never wraps a neighbour; a word that is genuinely too wide still does,
  and that is right.

## 6. Hiding something on one device

The menu is a list of links on a desktop and a "☰ Menu" button on a phone. Maya selects the link list → *Per-device*
→ at the Mobile chip, ticks *Hidden on mobile*; then selects the button and hides it everywhere else.

**A hidden block is gone from that device — on the canvas as much as on the published page.** It takes no space and
moves nothing, so the header that is one line on the phone site is one line on the phone canvas too. When she needs
the hidden menu back to edit it, the **Hidden** toggle beside the device chips draws it faintly; click again and it
is gone.

## 6½. "My words never touch an edge" — space by default

I drop a Heading on an empty page. Its words sit a gutter in from both edges (about 2rem; a little less on a phone),
with a little space above and below — I never set any of it. I drop three Stacks beside each other and colour them: a
**1rem gap** runs between them, the first still starts at the page's left edge and the last ends at its right, and all
three stay on one line — each column quietly gave up a share of the gap so the line still fits. On a phone they stack,
1rem apart. A box I colour or give a border keeps its words 1.5rem in from its edge; a plain box adds nothing, because
there is no edge to keep away from.

Every one of these is mine to change, down to zero: select the block, open **Spacing**, and each control says
"Default · 2rem" (real rem) until I move it, with **Back to default** to undo my change. A page I saved before these
defaults existed opens exactly as it was; only what I add from now on arrives with the space.

**Cards, buttons and notices breathe too.** I drop a Card, then a Button, a Quote and an Alert under it. None of them
touches the next: there is 1rem above and below each, *outside* its coloured box, so the box itself stays exactly as
the design drew it and the selection outline sits on it. They keep the same 2rem gutter from both edges of the page as
my words do — a Button never sits against the left edge. Put the same four inside one Stack and the Stack's own gap
spaces them instead, never both. Two coloured Stacks one under the other still meet edge to edge: a section paints the
page, it is not a box on it. A Card's space shows under **Spacing → Outer spacing** ("Default · 1rem"); set it to 0 and
the Card sits against its neighbours — and the page edge — on the canvas and in the Preview, and stays that way after a
reload until I press **Back to default**.

Behind the scenes, every page the builder is tested on is measured for this: words closer than 1rem to the page edge,
words touching the edge of their coloured box, or two sections whose words are closer than 1rem, are each reported as
a warning. (The **Page check** button in the editor does not show these yet.)

## 6¾. "The page uses its space" — nothing left empty that nobody chose

Maya's FAQ page has a heading and an **Accordion** of questions. She drops the Accordion under the heading and it runs
the full width of the page, the same as the heading above it — on a phone, a tablet and a wide screen. (It used to hug
its questions and leave the right half of the page empty.) An **Alert**, a **Card** and a **Quote** do the same. A
**Badge**, a **Stat** and a **Rating** stay small: a "New" pill is as wide as "New", wherever she drops it.

On the admissions page she drops two Stacks side by side — a photo and the words beside it — and never resizes them.
On a tablet held upright, the line is too narrow for both, so the words move under the photo. Each one then fills the
line it is on: no half-width photo with an empty half beside it. When she deletes the middle one of three columns, the
other two close the gap.

What she chooses always wins. She drags the Accordion's right edge in, and it keeps that width on every screen and after
a reload. She drags the outer edge of the last column inward to leave a margin on the right, and that space stays where
she made it; the column beside it does not grow into it.

Her pager — four links, "Previous · 1 · 2 · Next" — sits on one line on a phone: links in a line are 1rem apart there
and 2rem on bigger screens. Links she drops straight on the page share one gutter at the ends of their line rather than
each carrying its own.

Her term-dates page has a header that stays at the top and a sidebar that sticks while the article scrolls. The header
covers what scrolls beneath it — it takes the page's colour when she has not given it one — and the sidebar stops
**below** the header, never under it.

## 7. Text and space: which one follows what

Two fluid units run the page, and they answer different questions.

- **Space follows the box.** A card's padding, a section's gap, the page gutter: each scales with the width of the box
  it is in, so a card in a narrow column tightens itself. Every one of these also carries a rem term, so a reader who
  has set a larger browser text size gets larger spacing too, not only larger words.
- **Type follows the page.** A heading is one size wherever it sits — in a sidebar, in a card, in a wide band. That is
  what hierarchy means: the page title is the biggest words on the page, the section headings next, and a card's title
  under them, regardless of how wide their boxes happen to be. (Before this, a section heading in a 30% sidebar drew
  smaller than a card title in a wide band, and the page read backwards.)

Every text size still has a floor in rem, so a caption never drops under the reader's own base size on a phone.

## 8. Colour that reads

Give a band a colour and its words, muted words, links and focus rings are recomputed to read against it — 7:1 for
words, 4.5:1 for the rest — keeping the band's own hue at a whisper. Links on the plain page use a readable link
colour: the brand, moved only as far as it needs to read on that theme's background and on a card. On the Light theme
that is the brand itself; on Dark, Midnight and Purple it is lifted. Maya never checks a contrast number; the page is
never below one.

## 9. Small things stay the size they look

Beside each club, Maya puts a small **Icon** in a narrow column, the words next to it, and a **List** of meeting days
underneath. Three things she can rely on:

- **An icon is exactly as big as it is drawn — no invisible box around it.** On a phone her star is 22px tall in the
  editor and 22px on the published page. (It used to publish inside a 40px box: the builder counted an Icon, a List and
  a Divider as "empty boxes" because they hold no words or picture, and gave them the floor that keeps an empty box
  big enough to grab.)
- **A list has the same space under every item in both.** Three items are 80px tall on a phone, in the editor and
  published alike.
- **When the reader makes their text bigger, a narrow icon column still fits.** At 150% browser text the icon grows
  with everything else and stays inside its column.

**In a grid, the editor never adds a row of its own.** When a row has columns left over, the editor offers them
("Add a block here"). When the grid has narrowed by its own box, its last row is always full, so nothing is offered —
and the grid has the same rows, the same heights, as the published page.

**She can let go of a block anywhere the marker shows — even over the toolbar.** The toolbar of the block she has
selected hangs just under it, which is over the next line of the page. When Maya drags a Stack from the panel and lets
go "just under this heading", she is letting go on that toolbar. While anything is being dragged, the toolbar and the
handles step aside for the pointer, so the block lands on the page where the dashed marker said it would. (It used to
land nowhere: the marker showed, and nothing was added.)

**The toolbar keeps to the side that has room.** Near the top of the page there is no room above a block, so its
toolbar hangs below it. That is re-decided whenever the page changes size — opening the blocks panel, choosing another
screen — not only when the block is selected, so the toolbar never sticks out over the top of the page.

**The handles follow the block when she changes screen size.** Maya selects a block and clicks Mobile, then Tablet,
then Desktop to check it. The page glides to each width, and the toolbar and the eight handles glide with the block
and come to rest on it.

## 10. What is published

Everything above becomes proper HTML5: `header`, `nav`, `main`, `aside`, `section`, `footer`; one `h1`; heading levels
that follow the page (a card's title is never the page's title; nothing skips a level); a skip link for keyboard
users. The canvas and the published page are the same layout to within a pixel at every size — that is a rule with
tests behind it, not an aspiration, and every sweep of real pages re-measures it.

---

## The ladder of screens (for reference)

| Rung | From | What changes |
|---|---|---|
| Phone | 0 | every row stacks; grids go to one column; hand-sized columns take the full line |
| Tablet portrait | 600px (37.5em) | rows of four or more go to at most three a line; a grid whose cells would be under 12rem goes to two |
| Tablet landscape | 900px (56.25em) | rows and grids as designed |
| Desktop | 1200px (75em) | the design as built — this is the base |
| Big desktop | 1800px (112.5em) | wider measure; nothing rearranges |

A choice made at one rung applies from that rung *down* (tablet → phone) and never up; the desktop is the base and is
never touched by a phone edit.

## What this story covers so far

Tier 80 of the crawled structures (70 dressed pages, swept three times), and the four decisions of 2026-09-28: the one
pixel of slack, hidden blocks leaving the canvas, type following the page, and the spacing tokens carrying a rem term.
Tiers 95 and 99 and the shapes beyond the crawl are being swept; their stories are added here as they close.

From the tier-99 sweep (403 dressed pages, 2026-09-29), so far: small blocks publish at the size they are drawn
(section 9), a narrowed grid has the same rows in the editor and on the page, the handles follow a change of
screen size, a block can be let go over the selected block's toolbar, and the toolbar re-chooses its side when the page
is refitted.

Space by default (2026-09-30): words, sections, columns, coloured boxes, and every component and button placed on the
page keep their space (section 6½), measured in the Preview at every screen size in all four themes.

The page uses its space (2026-10-01, section 6¾): measured by the page audit's unused-space check over tier 80 (64 dressed
pages, every screen size and both sides of every breakpoint), fixed by class, and driven through the editor in all four
themes.

**What a real page asked for that the builder does not offer yet** (recorded, not skipped): a grid of *five* across —
the picker offers 1, 2, 3, 4, 6 and 12, the counts twelve columns divide into. Today Maya takes six and deletes a cell.
