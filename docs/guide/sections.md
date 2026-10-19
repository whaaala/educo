---
title: Ready-made sections, your own sections and page templates
sidebar_position: 2
description: Add a finished section in one click, keep sections of your own to use again, edit one section once for every page, and start a new page from a template.
---

# Ready-made sections, your own sections and page templates

A page is a stack of **sections**: a header, a welcome, a few bands of words and pictures, a footer. You can build each one
block by block (the [layout story](./layout-story.md) shows how), or start from one that is already made and change it to
suit your school. This page is about starting from something made.

## "I want a welcome at the top of the home page"

Mr Boateng opens the **Add** panel (the **+** at the top left, or the **B** key) and chooses the **Sections** tab. The panel
shows the kinds of section as a row of chips: **Headers 8 · Hero / Welcome 36 · Footers 19 · Blank 1 · Our story 16 · Text 8 ·
Features / Services 20 · Spotlight / zig-zag 17 · Stats 8 · CTA / Banner 17**, each with how many it holds, under small
headings (Navigation, Opening, Story, Showing, People and trust, Action). He taps
**Hero / Welcome**.

![The Sections tab: the chips, Wireframe or Designed, the Finish, and the welcome sections drawn as they will look](./img/guide-sections-tab.webp)

Every tile is the real section, drawn small: what you see on the tile is what the page will show. He clicks **Words beside a
picture**. The section appears under the one he was working on, as a whole band of the page, and it is selected so he can
see it at once. If nothing was selected, it goes at the end of the page, above the footer.

- **Click** a tile, or **Tab** to it and press **Enter**, or **tap** it on a phone or tablet.
- **Drag** a tile onto the page to put it somewhere else: a line shows where it will land, between two sections. A section
  never lands inside another block.
- **Ctrl+Z** takes it away again in one step.

## "Plain, or finished?"

At the top of the tab, **Wireframe | Designed** chooses how the tiles look:

- **Wireframe** shows the structure only: grey picture boxes and words like "Title goes here". It is for when you know what
  you want to write and will choose the look yourself.
- **Designed** shows a finished look, with real school words and photographs of African schools, ready to change.

With **Designed**, the **Finish** chooses one of seven looks. Each one is a different personality for the whole page:

| Finish | What it feels like |
|---|---|
| Serious | Light, elegant headings, spaced capitals, no rounded corners, dark bands instead of colour |
| Minimalist | Black on white, small and exact, no colour blocks |
| Plain | Neutral and structured, small type, thin borders |
| Bold | Big heavy capitals and blocks of the school colour |
| Calm | Soft colours, gentle headings, rounded corners and pictures |
| Startup | Light grey bands, rounded cards with a soft shadow |
| Playful | Heavy round headings, very rounded corners, lots of colour |

Every finish uses your website's theme (Light, Dark, Midnight or Purple), so a section always matches the rest of your site.
The typeface is your site's too: choose it once in **Page settings → Site fonts**.

![The same welcome sections in the Bold finish](./img/guide-sections-finish.webp)

## "Our story, what we offer, our numbers, and a call to come and see us"

A section is a band of the page you are on, never a page. That is why the kinds are named as sections (**Our story**, not
"About"): the About *page* is something you make with **Add a page**, from a template. The top of the Sections tab says so,
and its **Add a page** button opens that dialog.

Under the welcome, most school pages tell the same few things. Mrs Okafor builds her About page from them, one tile at a
time:

- **Our story** (16): the school's story beside a photo, a word from the head, a big statement on the school colour, a card of
  words on a full photo, four numbered pictures of the campus.
- **Text** (8): words with nothing else to say: an introduction beside three points, a title beside two paragraphs, a list
  of links for parents, nine subjects with an icon each.
- **Features / Services** (20): what the school offers, as cards with a photo, icon cards, numbered points, a checkerboard
  of words and photos, or four points beside a photo.
- **Spotlight / zig-zag** (17): a picture beside words, and rows that swap sides as you read down the page.
- **Stats** (8): the school in numbers, on a band, over a photo, or beside a picture.
- **CTA / Banner** (17): the invitation at the end of a page: "Book a tour", "Apply now", a one-line notice, an offer
  beside a picture.

![The Sections tab: the line that sends a whole page to Add a page, Wireframe or Designed, the Finish, and the kinds of section under their groups](./img/guide-sections-tab-groups.webp)

She does not set anything for phones; each kind already does what good school sites do on a small screen:

- **A zig-zag puts the picture first on a phone**, whichever side it sits on a computer. The words still read in the same
  order, so a screen reader hears the heading first.
- **Cards go three across on a computer, two on a tablet, and one under another on a phone.** A row of cards is never
  more than the design asks for, so six cards are two rows of three on a big screen, not four and two.
- **Four numbers are two by two** on a phone and a tablet held upright, and one row from a tablet held sideways.
- **A button beside some words goes under them on a phone**, the full width, easy to tap.
- **A column that takes part of the row fills the whole line on a phone**, so nothing is left ragged at the right.

![A spotlight on a 375 px phone: the picture first, then its words](./img/guide-sections-spotlight-phone.webp)

## "Now I want to change it"

Once it is on the page, a ready-made section is ordinary blocks. Click any word to change it, pick another photograph,
change a colour, a corner, a shadow or an effect, add a block or take one away. Nothing is locked.

It arrives with the space its design gives it, around the words and between the blocks. When you select it, that space is
drawn on the page with its size, and you can set it to anything on the scale, down to nothing.

A designed section also moves a little as a visitor scrolls to it, and its buttons answer the pointer and the keyboard. A
visitor whose phone or computer asks for less motion sees it still, all at once.

## "On a very wide screen, the welcome is taller than the window"

A welcome with a picture beside its words grows with the screen. On a very wide one — a monitor five thousand pixels
across — a picture half the page wide would be two thousand pixels tall, and the words beside it would sit below the
window. So every picture in a ready-made welcome is at most **three quarters of the screen's height** (`75svh`). On a
laptop or an ordinary desktop the picture is shorter than that anyway and keeps its own shape; the limit only does
something on a screen that is very wide for its height, or a phone held sideways. The picture is then cropped from the
centre, never squashed.

![A welcome on a 5,143-pixel-wide screen: the words and the cropped picture both inside an 820-pixel window](./img/guide-sections-wide-hero.webp)

It is an ordinary **Max height** on the picture, so it is yours: select the picture and you will find `75svh` in the
Inspector under **Limits**. Type `50svh` for a shorter picture, a length such as `30rem`, or clear it to let the picture
keep its own shape however big the screen. **Ctrl+Z** undoes it. A Max height you type on any picture of your own works
the same way.

## "I wrote my words, and now I want another look"

You added a welcome in **Calm**, typed your own title and put in a photo of your own pupils, and now the page wants to feel
bolder. Select the section and, in the Inspector, choose another **Finish**: **Bold**, any of the seven, or the
**Wireframe**. You can also press **Ctrl+Alt+F**, which moves to the next finish each time you press it.

![A welcome given the Bold finish after it was added, with the Finish in the Inspector](./img/guide-sections-refinish.webp)

The look changes, as if you had added the section in that finish: the type, colours, corners, shadows and motion. **What you
made stays as you left it**: your words, your photos, your links and any block you added. What you never touched follows
the finish, so a section added as a Wireframe gets the designed words and photos when you give it a finish, and gets the
placeholders back if you choose the Wireframe again.

- A colour or shadow you added where the finish puts none, such as a background on a plain column, stays too.
- Over a photo of your own, the words stay white and the photo keeps its shade, even in the Wireframe.
- **Ctrl+Z** puts the whole section back in its old finish in one step.
- A global section changes on every page that has it.
- The Finish appears only for a ready-made section. A section you built from blocks is already your own design.

## "A new header for every page"

The **Headers** and **Footers** tiles work a little differently, because a site has one header and one footer, shown on
every page. Choosing one asks **"Replace the header on every page?"** **Replace** puts it on every page at once; **Cancel**
changes nothing; **Ctrl+Z** brings the old one back everywhere.

On a phone, a header's menu is one line that slides sideways, so every link can be reached and the header stays short.

## "I built a lovely band and want it again"

Select the section, then **Save as my section** in the Inspector (or press **Ctrl+Alt+S**) and give it a name. It appears in
the Sections tab under **My sections**, and it is there in every site you build. Adding it gives you a copy: changing the copy
on one page never changes the saved one or any other copy.

Under each of your sections are **Rename** and **Delete**. Deleting asks first, and pages that already use it keep their copy.

## "The admissions banner should be the same on every page"

Some sections should be the same wherever they appear, such as an admissions banner or a note about term dates. Select the
section and choose **Make global** in the Inspector (or press **Ctrl+Alt+G**), then give it a name.

![A global section: marked on the page and in Layers with its name](./img/guide-sections-global.webp)

A global section is marked on the page by a green outline and the label **Global · its name**, and in **Layers** by a globe
and its name. Add it to other pages from **Global sections** in the Sections tab; a page can hold it more than once.

**Change it on any page and every copy changes, on every page.** The first time, a note says how many pages the change
reaches. **Ctrl+Z** undoes it everywhere at once.

- **Detach this copy** (in the Inspector) makes one copy ordinary, so you can change it on its own. Ctrl+Z straight after
  attaches it again.
- **Stop being global** (in Global sections) asks first, then leaves every copy where it is, as an ordinary section.

The published website is plain pages: nothing links the copies once the site is online.

## "A new page that looks like the others"

The **+** beside the page tabs opens **Add a page**. Type the page's name, then choose where it starts:

- **Blank page**: an empty page with your site's header and footer.
- **Duplicate**: a copy of the page you are on.
- **A page template**, drawn as it will look, in the wireframe or any finish: **School home**, **Landing page** or
  **Open day**. More templates arrive as more kinds of section are added.
- **My templates**: any page you have saved. In **Page settings**, **Save page as template** keeps the page you are on (up
  to 40), and **Rename** and **Delete** are under each one.

![Add a page: the name, Blank, Duplicate and the templates](./img/guide-sections-add-page.webp)

A page made from a template is a copy. It takes your site's own header and footer, so the new page belongs with the rest.

## Reference

| What | Where | Keys |
|---|---|---|
| The ready-made sections | Add panel → **Sections** | **B** opens the panel, **/** searches |
| Add a section | Click or tap a tile; **Enter** on a focused tile; drag a tile onto the page | **Ctrl+Z** undoes |
| Plain or finished | **Wireframe \| Designed** at the top of the tab | |
| The look | **Finish**: Serious · Minimalist · Plain · Bold · Calm · Startup · Playful | |
| The kinds of section | Headers · Hero / Welcome · Footers · Blank · Our story · Text · Features / Services · Spotlight / zig-zag · Stats · CTA / Banner | |
| On a phone | Pictures before their words in a zig-zag · cards one under another · numbers two by two · a button under its words | Nothing to set |
| A welcome's picture on a very wide screen | At most 75 % of the screen's height, cropped; select the picture → Inspector → **Limits** → **Max height** (`75svh`) to change or clear it | **Ctrl+Z** undoes |
| Another look for a section on the page | Select it → Inspector → **Finish**: Wireframe or one of the seven | **Ctrl+Alt+F** next finish · **Ctrl+Z** undoes |
| Keep a section | Inspector → **Save as my section** | **Ctrl+Alt+S** |
| Your sections | Sections tab → **My sections**: add, **Rename**, **Delete** | |
| A section the same everywhere | Inspector → **Make global** | **Ctrl+Alt+G** |
| One copy on its own | Inspector → **Detach this copy** | **Ctrl+Z** re-attaches |
| No longer global | Sections tab → **Global sections** → **Stop being global** | |
| A new page | **+** beside the page tabs → **Add a page**, or **Add a page** at the top of the Sections tab | |
| Keep a page as a template | **Page settings** → **Save page as template** | |
| Which page the visitor is on | The menu marks it with a heavier underline, and tells a screen reader | |

Some sections stand in for a part the builder does not have yet: a form, a map, a strip of logos, a video. Their tiles say
**placeholder: form** (or map, logo strip, video, counter), and they are built from ordinary blocks until that part arrives.
