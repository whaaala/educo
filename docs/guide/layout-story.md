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

## 9. What is published

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
