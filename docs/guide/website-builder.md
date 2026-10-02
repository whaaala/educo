---
title: Website Builder — reference guide
sidebar_position: 2
description: Every control of the website builder, by section — read the layout story first.
---

# Website Builder Guide

Build and maintain your school's public website by dragging blocks onto a page — no code. This is the same idea as Wix, Canva or WordPress's block editor, but tuned for a school and wired into Educo's themes and design system.

**Who it's for:** teachers and administrators who need to keep the school site up to date (term dates, news, staff, admissions) without waiting on a developer.

**Where it lives:** open the builder at `/website/box-demo`. Your work saves automatically to your browser as you go.

---

## 1. Your first win — put a welcome message on the homepage (2 minutes)

1. Open the builder. You start on a **blank page** called *Home*.
2. In the left **Blocks** panel, click **Heading**. Pick **Display** in the little style menu that appears.
3. The heading lands on the page and is selected. It reads *New heading* — click it and type **"Welcome to Riverside Primary"**.
4. Click **Text** in the Blocks panel → **Lead**. Type a sentence: *"A happy, curious place to learn — right in the heart of town."*
5. Click **Preview** (top bar) to see exactly what a visitor will see. Click **Exit preview** to return.

**You now have:** a headline and intro on your homepage, saved automatically. Everything below builds on this.

---

## 2. The workspace at a glance

| Area | What it does |
|------|--------------|
| **Blocks panel** (floating) | Everything you can add: Layout, Text, Media, and Components. Open it from the **Blocks** launcher at the canvas's top-left (or press **B**); it floats over the canvas so your page keeps its full width. **Search** to filter, use the **category tabs** to jump, then click a block to add it (or drag it onto the page). Close it with the ✕, Esc, or by clicking the launcher again. |
| **Canvas** (middle) | Your page. Click a block to select it; its controls appear on the right. |
| **Inspector** (right) | Every setting for the selected block, in three tabs: **Design**, **Content**, **Per‑device**. Collapse it (the ⟩ button in its header) to give the canvas more room, and reopen it from the slim rail on the right. |
| **Top bar** | Pages, **Add a band**, Undo/Redo, **Preview**, **Export**, **Reset**, the device switcher, and **Base size**. |

**Flow by default, float for free.** New blocks join the normal page flow (they stack and reflow responsively). When you want to place something freely on top, you switch a block to **Floating** — see §7.

---

## 3. The building blocks

### Layout

**Stack, Side by side and Grid are the same block in three arrangements.** You don't have to choose
correctly up front: select any of them, open **Arrange as**, and switch. A stack becomes a row becomes a
grid with one click, and whatever is inside comes with it. They're named for what they do to the blocks you
put in them — down the page, across the page, or both at once.

Separately, the **+ Add a band** button at the top of the screen adds a *tinted, full-width, padded strip*
across the page — the visible "Admissions" bar sort of thing. That's a different result from the **Stack**
tile, which gives you a plain transparent box. (Both used to be called "Section", which is why this note
exists.)

| Block | Use it for |
|-------|-----------|
| **Stack** | Blocks one under the other, down the page. A plain box you fill with anything. |
| **Side by side** | Blocks in a row, across the page — they wrap onto the next line on small screens. |
| **Grid** | Across *and* down, picked the way you insert a table: sweep **how many across × how many down**. Uneven splits (sidebar, feature + two) sit underneath. Feature cards, staff photos, an article beside a sidebar. |
| **Spacer** | Adjustable vertical breathing room. |
| **Divider** | A dividing line (solid, dashed, dotted, thick). |
| **Hero** | One photograph filling the screen, with your headline over it. |
| **Rotating hero** | Several full‑screen photographs in turn, each with its own words. |

### Text
| Block | Use it for |
|-------|-----------|
| **Heading** | Titles. Styles: Display, Title, Subtitle, Eyebrow. |
| **Text** | Paragraphs. Styles: Body, Lead, Caption, Quote. |
| **Button** | A call to action with a link (a page or a web address). |
| **List** | Bulleted or numbered lists. |

### Media
**Image**, **Photo gallery**, **Slider**, **Video** (YouTube/Vimeo/MP4), **Icon** (searchable symbol), **Embed** (paste an iframe/HTML).

**Every block publishes the box it is drawn in.** An Icon, a List and a Divider are exactly as big on the published page as in the editor, at every screen size — an icon 22px tall on a phone is 22px published, and a list keeps the same space under each item. They are never padded out to the minimum size an *empty* box is given so that you can grab it.

### Photo gallery — many photographs at once

The Image block adds **one** picture. **Photo gallery** adds a whole set in a single step, and it's the block to reach for when you're putting up sports day, the fete or an open day.

Blocks → **Photo gallery**. A short setup opens and asks four things:

| | |
|---|---|
| **Choose photos** | One file dialog, **as many photographs as you like** — pick the whole folder. Each appears as a thumbnail as it's added, and you can drop any of them before committing. |
| **How many across** | 2, 3, 4 or 6. These are the counts that divide the twelve exactly, so the row is always even. |
| **Row heights** | **Even** for tidy rows of equal height, or **Follow the picture** so photographs of different shapes stagger instead of being cropped. Both are shown as little pictures rather than named. |
| **Space between** | Starts at none. Sweep it and watch the preview — whatever you choose is what arrives. |

Then **Add gallery of 12** (or however many), and it lands.

**What lands is an ordinary grid.** That's deliberate and it's the whole point: each photograph sits in a real cell, so you can put a caption under one, give another a background, drag a cell's edge to make one picture wider than the rest, nest a whole layout inside one, or change the columns afterwards. Every control in §10c works on it, because it *is* one of those. A gallery isn't a special sealed block you can only fill with pictures.

**Descriptions start from your file names.** A file called `sports day 1.jpg` arrives described as "sports day 1" — a starting point to improve in the Content tab, not a caption the builder invented. Blank descriptions are the commonest accessibility miss on a school site, so it's better to start with something true.

> **Your photographs are resized as they come in.** A picture straight off a phone is around 1.2 MB, and a browser only keeps about 5 MB of your site — so a dozen of them at full size would not fit at all, and the page would quietly stop saving. Each one is stored with its longest edge at **1600 pixels**, which is larger than anywhere it's ever shown and far kinder to a parent loading the page on mobile data. If your browser's storage ever does fill up, the editor now tells you plainly instead of failing in silence — **export your site straight away** if you see that message.

### Show one at a time — sliders, and the rest

Any box can show its blocks **one at a time** instead of all at once. Select the box → **Design → Arrange** → tick **Show one at a time**.

Each block inside becomes a **page** that fills the box. Visitors swipe between them on a phone or a trackpad, and — once they've tabbed to it — move one page per arrow key. **None of that puts any code on your site.**

**Every page is an ordinary box**, and that's the whole point of doing it this way. One page can be a photograph, the next a headline over a photograph, the next a three-column layout with a button in it. Everything else in the Inspector still works inside a page, because a page *is* just a box.

| Control | What it does |
|---|---|
| **Moving between them** | **Dots** (the default), **Arrows**, **Both**, or **None** — leave it on None and visitors swipe or use the keyboard. |
| **Move on its own every** | Starts at **off**. Slide it right and it advances by itself. |

Three things happen automatically and are worth knowing:

- **The dots are real links.** Each page has its own address, so you can link straight to one from anywhere else on your site. If you give a page a **Bookmark** in the Content tab, that's the address used.
- **It holds still while somebody's reading it.** If it moves on its own, hovering it or tabbing into it stops it until they leave. Something that keeps moving while you're trying to read it isn't just annoying — it's an accessibility failure.
- **A visitor who's asked their device for less motion never sees it move**, and the sliding isn't animated for them either.

> **Nothing is added to your site unless it's needed.** Set *Moving between them* to **None** with no auto-advance and the published page contains **no JavaScript at all** — it's pure CSS. Dots or auto-advance add one small script.

### Slider, Hero and Rotating hero

Three tiles that set all of the above up for you, so you don't have to know the mode exists.

| Tile | Where | What you get |
|---|---|---|
| **Slider** | Media | Your photographs, one at a time, with dots. Choose them in one dialog, pick how visitors move between them, and whether it advances on its own. |
| **Hero** | Layout | One photograph filling the screen with your headline over it. |
| **Rotating hero** | Layout | Several of those in turn — each page its own full screen, its own photograph, its own words. |

**Your words stay readable whatever photograph you choose.** A hero lays a dark wash over the picture before the headline goes on top. That isn't decoration: white text on a bright photograph is unreadable, and you pick the photograph, not us. The wash is strong enough that white text clears the WCAG AA contrast bar **even over a pure white photograph** — and it's an ordinary Background overlay, so you can change or remove it with the control that's already there.

Everything the tiles make is ordinary blocks. Edit the second hero's headline by clicking it on the canvas; add a button to one slide and not the others; drag a slide's edge. There's nothing to convert and nothing special about them.

**Photographs** — select an Image block and open the **Content** tab:

- **Describe this image** — what the picture shows, read aloud to visitors who cannot see it and used by search engines. Leave it blank only when the picture is purely decorative (a divider, a texture).
- **Load straight away** — off by default, which is right for anything below the fold. Turn it on for a picture at the very top of the page, or the top of the page opens briefly empty.
- **Show the whole picture (don't crop it)** — appears once you have uploaded a photograph, because the builder then knows what shape it is. Ticked, the block takes the photograph's own proportions; unticked, it is cropped to the **Height** you set in the Design tab. Cropping is often what you want for a neat row of equal cards — this is the choice, not an accident.

The builder measures a photograph when you upload it and tells the browser its size up front, so **the space is reserved before the picture arrives**. Without that, text jumps down the page as each photo loads and readers lose their place — the single most irritating thing a photo-heavy site can do.

> **Your photograph arrives at its own shape now, whichever way you added it.** Until recently an Image block
> came with a fixed height already on it, so a tall or square picture added *from the Blocks panel* was
> cropped to a letterbox — while the same picture *dragged* onto the page came out correctly. Two routes, two
> results, and the common one was wrong. A picture's shape is now taken from the picture; a height you set
> yourself still crops, exactly as before.

### Components (design‑system pieces)
These are ready‑made, themed pieces. **Each one is a fully editable tree** — click any inner part (a card's title, its button, a rating's star) and you get that part's full controls.

| Component | What it is |
|-----------|-----------|
| **Accordion** | Expandable Q&A / FAQ. **29 designs** plus six settings that combine with any of them; edit each item inline. |
| **Alert** | One message that matters — closure notice, open day, fees deadline. **23 designs**, six severities, four forms (inline · banner · callout · toast), and up to two action buttons. |
| **Card** | Image + heading + text + button — the classic content card. |
| **Quote** | A testimonial with an author line. |
| **Stat** | A big number + label (e.g. "1,000+ Happy families"). |
| **Badge** | A small pill label (e.g. "New", "Open day"). |
| **Rating** | A row of stars. |

> **Tip:** a component "is its own box" — there's no extra wrapper around it. Click straight into any inner piece to style it.

---

## 4. Business scenarios (follow along)

### Scenario A — Publish the term dates as an FAQ
**Goal:** parents can quickly find term dates and key info.
1. Blocks → **Accordion**. It arrives with three starter Q&A items.
2. On the canvas, click the first question and type *"When does the Autumn term start?"*; click its answer and type the date.
3. In the **inspector → Content**, click **Add item** for each extra question; drag to reorder; tick **Open by default** on the most important one.
4. In **Design**, pick one of the 54 accordion looks that matches your site.
5. **Preview** → click a question; it expands. Done.

### Scenario B — A "Why choose us" strip of three cards
**Goal:** three selling points with icons and a link each.
1. Blocks → **Grid** → **3 across**.
2. Into each column, add a **Card**.
3. Click each card's **heading** and type the point ("Small classes"); click the **body** and describe it; click the **button** and set its **Link** to the relevant page.
4. Want the heading centred? Select just that heading → **Content position** or **Text align** → centre. Only that heading changes.

### Scenario C — An eye‑catching admissions banner
**Goal:** a coloured band with a headline and an "Apply now" button.
1. Blocks → **Stack**. In the inspector give it a **Background** colour (or image) and some **Inner spacing**.
2. Into the section add a **Heading** ("Admissions open for September") and a **Button** ("Apply now").
3. Select the button → set its **Link** to your application page, tick **Open in a new tab** if it's external.

### Scenario D — Show off results with a Stat and a Rating
1. Blocks → **Stat**. Click the big number, type "98%"; click the label, type "pass rate".
2. Blocks → **Rating**. Recolour or resize any single star by clicking it.

---

## 5. Editing a block — the Inspector

Select any block and its settings appear on the right, in three tabs.

### Design tab
- **Placement** — *In the layout* vs *Floating*, **Lock position & size**, and (when floating) **Front/back order**. See §7.
- **Size** — **Width** (Fit = hug the content, Full = fill the row, Custom = a % or px), **Position in row** (Left / Centre / Right / Spread), **Content position** (a 3×3 grid — where the content sits inside the block when it's bigger than its content), **Height**, and **Trim to size**.
- **Spacing** — **Inner spacing** (padding, inside the block) and **Outer spacing** (margin, around it).
- **Outline & effects** — rounded corners (all or per‑corner), border, shadow, tilt, **See-through** (below).
- **Background** — a colour (with a full OKLCH picker, eyedropper, and *None* for transparent) or a background image.
- **Typography** — font, size, weight, capitalisation, line/letter spacing (cascades into the block's text).
- **Advanced CSS** — extra CSS declarations for power users (safely sanitised).

#### See-through — the box fades, not what's in it

Set **See-through** on a section, a grid or a cell and the page shows through **that box** — its background, its border. Everything inside it stays exactly as solid as it was: the cards, the headings, the photographs.

That holds at every depth. A cell inside a see-through grid is solid; a heading inside that cell is solid. Make one cell see-through on its own and only that cell fades — its own contents are protected in just the same way.

When you *do* want the whole thing to fade together, tick **Fade what's inside too**. It appears as soon as you set a See-through value, and applies from that box down and nowhere else.

It works for a **background image** too, not just a colour: fade a photo hero and the photo softens while the headline and button on top of it stay perfectly crisp.

> **Why this needs saying:** in CSS, fading an element fades everything inside it, and there is no setting a child can use to escape. So "make this box see-through" is applied to the box's own paint instead — alpha in the colour, and for a photograph a layer of its own behind the content. Your contents keep their real colours, and the published page does exactly what the canvas showed you.

### Content tab
The content that changes per block type — a Button's text + link, a Text's copy, a List's items, an Accordion's items, an Image's source, a Card's title/body/button, and so on.

### Per‑device tab
Overrides that apply only on the current device size (see §8).

> **Rule of thumb:** *Design* = how it looks; *Content* = what it says; *Per‑device* = how it changes on phones/tablets.

---

## 6. Sizing, hugging and positioning content

- **Words, buttons and small things hug their content.** A short heading, a button, a link, a Stat, a Badge or a Rating is exactly as wide (and tall) as its content — no empty box stretched around it, whether the block sits in the layout or floats freely.
- **Components and columns use the page's width.** An Accordion, an Alert, a Card or a Quote fills the line it is dropped on, so an FAQ is as wide as the page instead of hugging its questions. Columns you dropped side by side and never resized take what is left of their line: when a screen is too narrow for both and one moves down, it fills the line it moves to, and when you delete one of three, the other two close the gap. A width you set yourself — by dragging an edge, or with **Custom** — is always kept, and a space you open by dragging the outer edge of a line stays where you made it. Switch **Width** to **Fit** to make a component hug, **Full** to fill the row, or **Custom** for an exact size.
- **A resized block is exactly the size you set.** Drag an edge or type a Width/Height and the block occupies precisely that — the box *is* the space it takes, never a larger invisible wrapper.
- **Resize from any edge.** Drag any edge or corner handle. The grabbed edge moves; the opposite edge stays put. You can grow a block from the **top** edge too.
- **Stays put while scrolling.** Select any block that sits in the layout — a section, a stack, a grid, a heading, a button, an image or a component — then **Design** → **Placement** → *Stays put while scrolling*. Each way is shown as a small picture of the page before and after a scroll. Two ways, and they're genuinely different:
  - **Sticks when reached** — it scrolls with the page until it reaches the top of the window, then holds there. It keeps its own place in the layout, so it hides nothing until you scroll. Right for a header, and for a **side rail**: pin a narrow column beside taller content and it follows the reader down. Held against **Top** or **Bottom**.
  - **Floats on screen** — it is lifted off the page and always visible at the edge or corner you pick, from the moment the page opens. Nothing keeps its space, so the page runs underneath it. Right for a cookie bar, a back-to-top button or a chat bubble. Held against any **edge** or any **corner**.
  The line under the control tells you **where this block lets go**: a block placed straight on the page holds *for the rest of the page*; one inside a Stack, a Grid or a row of blocks names what it leaves with. A bar that **floats** against the top or bottom also says what it covers — the top of your page, or your footer — and offers **Keep its space instead**, which switches it to the way that keeps its place.
  **A block you placed freely can hold on screen too.** Float a stack, drag it where you want it, then choose **Floats on screen** — it holds exactly there, however far the page scrolls, and it doesn't jump when you choose it. *Sticks when reached* isn't offered for a floating block and the Inspector says why: that one holds a block against the place it occupies in the page, and a freely placed block has given that place up. Put it back **In the layout** to use it.
  **When it takes hold.** Once a block is pinned you can choose what it *becomes* as the page moves under it — each shown as a picture of the bar before and after a scroll: **Shadow** (lifts off the page), **Solid** (a see-through bar fills in), **Glass** (frosted, with the page showing through), **Rule** (a hairline underneath) or **Condense** (it gets shorter). **Nothing** is the default. *Takes hold over* sets how much scrolling it takes, 120px by default. Condense needs something to condense — a height or inner spacing of its own — and the Inspector says so when there is none. A reader who prefers reduced motion simply sees the resting look; the block is still pinned.
  **Two bars at the same edge sit under one another.** Set a second block to **Floats on screen** at the same
  edge and it lands *below* the first, not on top of it — a header and an announcement bar, or a cookie notice
  and a back-to-top button. Each keeps its own height, and the one nearest the edge is the first of them down
  the page (at the bottom, the last). It used to be that three bands all set to stay on screen pinned to the
  same place and covered each other, so two of the three were simply invisible — each doing exactly what it was
  told. The page now measures how much bar is already there, so they queue instead.

  **And it works for *Sticks when reached* too**, with one sensible difference: those bars queue only behind
  bars they can actually meet. Two of them **in the same box** — side by side in a Stack, or a header and an
  announcement bar both dropped on the page — do cover each other, so they queue. Two in **different sections**
  never share a screen at all: the first lets go exactly as the second arrives, so neither is moved. Nothing is
  shifted to avoid a collision that cannot happen.

  Both take a *distance from the edge*, and both are **per device**: turn pinning off for phones on the **Per-device** tab and it stays off there, on every reload. If something is stopping it working, the Inspector says so and **names the block**: a block that clips its contents (which includes simply having rounded corners) stops anything inside from holding its place, and a block that's been **tilted** — or a component, or the glass Alert — makes its own frame, so anything fixed inside holds against that instead of the window.
- **The handles stay on the block, all the way.** However far you drag, the eight handles and the little toolbar ride with the edge you're moving — they never come adrift and leave you dragging a block whose handles are sitting somewhere else on the page.
- **The top and bottom edges don't move each other.** Drag the bottom and the top stays put; drag the top and the bottom stays put. Where there's nothing left to give — a block already at the very top of the page, or a row above that has run out of room — the edge simply stops. It never grows out of the far side to make up for it.
- **Two blocks that touch share the boundary between them.** Drag the **top** edge of a block and the block above gives back — or takes up — exactly what you gave, so the two stay flush and **no white space is ever left between them**. Shorten the last stack on a page and the one above it grows to meet it, by itself. It works the same whether the two are in one band or each in its own. If the block above is already only as tall as what's inside it, there's nothing to give and the edge stops there. This is the vertical version of how a grid cell's edge already behaves — the boundary belongs to both blocks, not to whichever one you happen to be holding.
- **A slider always shows you the real number.** If a block has ended up taller than the height slider's own range — easily done by dragging its bottom edge down a few times — the slider stretches to reach it instead of parking at the end and pretending. That matters because the handle sitting at the far right used to look identical whether the block was 45rem or 115rem, and nudging it would have silently snapped the real height down.
- **A boundary that meets several stacks moves all of them.** Two stacks side by side aren't separate as far as an edge is concerned — they share the band they sit in, and the band is what the edge below them belongs to. So dragging that edge moves the band, both stacks, *and* the rows inside either of them. Nothing is left hanging: you won't get the boundary closing neatly on one side while a gap opens under the last row of the column next to it. There's no grouping to switch on — putting two stacks on the same line is what groups them.
- **A stack next to another still has whatever is above it.** A stack with a neighbour beside it behaves exactly like one on its own: drag its **top** edge up and the band above gives way, its neighbour comes along, and it stays inside its own band. It never lifts out and floats over the header above it.
- **Space you deliberately left is spent first, and never thrown away.** If you've given a block outer spacing above it, dragging its top edge *up* closes that space before it takes anything from the block above — free space costs the neighbour nothing. Dragging *down* hands the room to the block above and leaves your spacing exactly as you set it.
- **A block you drop takes the room it lands in.** Drop a Stack into a section or a grid cell that has height to spare and it fills it, rather than sitting as a small sliver with the rest of the space empty underneath. Where there's no room to take — a grid nobody has given a height to — it arrives at a comfortable default size instead. A height **you** set is never overruled by either.
- **A resized block is one shape.** When you make a button, card, badge or any block bigger, the block *itself* grows to fill the new size — there's never a second empty shape left behind at the old size. Its content re‑positions inside it automatically (a resized button centres its label).
- **Content position.** When a block is bigger than its content (e.g. you made a badge tall), use the **3×3 Content position** grid to place the content — top‑left, centre, bottom‑right, etc. Works for every block, elements and components alike.
- **Position in row.** To left/centre/right‑align a hugging block within its row, use **Position in row**. **Spread** shares the
  row out: the first block at the left edge, the last at the right edge, the rest evenly between.
- **A page header or footer spreads by itself.** Give a block the meaning **Page header** (or **Page footer**) and its
  line of two or more blocks is set to **Spread** and centred on one line — the logo at the left edge, the menu between,
  the button at the right edge — so a wide screen is never left empty on the right. It is an ordinary setting: pick
  **Left** in **Position in row** and it stays where you put it. Lines you aligned yourself are never changed.
- **A block you add is always big enough to see.** An empty block has nothing inside to hold it open, so it takes a small minimum size until you put something in it or size it yourself. This matters most when you add several blocks into a stack you have already given a height to: they no longer share that height until each one is a sliver — the stack grows a little instead, and every block stays large enough to click and to drag by its handles. A size **you** set is always honoured, however small; the minimum only applies where you have not said.

---

## 7. Free placement — Floating, Grouping and Locking

Sometimes you want to place things freely (overlap a badge on an image, arrange a little cluster).

- **Float a block:** select it → **Placement → Floating** (or **Alt+F**). Now drag it anywhere; arrow keys nudge it. On phones a floating block automatically drops back into a clean stack, so your layout never breaks.
- **Floating a box takes its contents with it.** Float a grid and every cell goes too, keeping the arrangement it already had — you are moving the whole thing, not scattering it. None of the children become floating in their own right, so they still behave as a grid inside their new position.
- **Returning it puts everything back.** Switch a floated box back to *In the layout* and it lands exactly where it started, cells and all — and nothing else on the page is altered, including the height you set on the section around it. Floating and returning is a round trip, never an edit.
- **Or float just one piece.** Float a single cell and only that cell leaves the flow; its siblings and the grid around them do not move.
- **Group blocks (like slides):** marquee‑select several blocks (drag a box around them on empty canvas), then **Group these N** (or **Ctrl+G**). The group moves and locks as one unit; its contents still reflow responsively. **Ungroup** with **Ctrl+Shift+G** or the block's ⋮ menu.
- **Lock position & size:** select a block → **Lock position & size** (or **Ctrl+L**). It can't be moved or resized by accident, but its content and colours stay editable. Unlock the same way.
- **Copy, paste & place a whole group:** select a group and **Ctrl+C**, then **Ctrl+V**. The whole group copies as one unit — every component inside it, with fresh identities (the copy is independent of the original). The pasted copy lands **slightly offset** so it doesn't hide the original, stays **floating and selected**, so you can immediately **drag it or arrow‑nudge it** into the exact position you want. (Copy/paste works the same for any single block.)

> Newly‑added and pasted blocks are **auto‑selected**, so a copy dropped behind a floating one is never "lost".

---

## 8. Making it look right on every device

The builder is responsive by design, and you can fine‑tune per size.

1. Use the **device switcher** (top‑right) to view **Mobile (375)**, **Tablet (768)**, **Laptop (1024)**, **Desktop (1280)**, **Wide (1920)** or **Full**. Each one sits in a different size band, so switching between them always shows you a genuinely different layout rather than the same one twice.
2. Any edit you make while a device is selected is saved as a **per‑device override** — it only applies at that size (and cascades down). The base (desktop) design is never disturbed.
3. On narrow screens, side‑by‑side items **stack automatically** and nothing forces a horizontal scrollbar.

**Base size** (top bar) sets the rem base everything scales from — bump it up and the whole page scales proportionally while staying readable.

### Everything scales with the screen — except below what can be read

Your text, your spacing and your pictures all follow the width of the screen, so a page looks deliberate on
a phone and on a 27‑inch monitor rather than being the same layout squeezed. Text grows from **16px** on a
phone to about **22px** on a large desktop, and every other size — headings, buttons, captions — is a
proportion of that one value, so they scale together and keep their relationship to each other.

> **16px is a floor, not a size.** Spacing *should* close up on a narrow screen; text should not, and for a
> while it did — body copy came out at **11.2px on every phone** and a button label at under 10px, because
> the reading size was following the same unit as the gaps. It now stops at `1rem` and grows from there.
> That floor is in `rem`, so a reader who has set a larger text size in their own browser still gets it.

**A photograph keeps its own proportions at every width.** A 4:3 picture is 4:3 on a 320px phone and on a 4K
monitor — only its size changes — and it never runs off the side of the screen. If you want it cropped to a
shape of your own, set a **Height** and that is what you get.

**The builder's own toolbar follows the same rule.** Narrow the window and the top bar **wraps onto more
rows** rather than pushing Preview, Export and the device chips off the side. Every control stays on the
screen at any width, and at desktop sizes it is the single row it always was.

---

## 9. Themes, colours and accessibility

**Two independent themes — pick each freely:**
- **Website theme** (top bar, the 🎨 *Purple Dream / Light / Dark / Midnight* picker) — the theme of the **site you're building**. It re‑skins the **canvas, all its content, and the export** so you can design, say, a Purple site. It's **saved with your site**.
- **Editor theme** (the sun/moon picker beside it) — how the **builder UI itself** looks while you work. It never changes your website; design a Light site in a Dark editor if you like.

- Colours come from the site's **design tokens** (an OKLCH colour system) — pick from themed swatches, a spectrum, a hex field, or the eyedropper. There are **no hardcoded colours**, so switching the Website theme re‑skins everything consistently.
- Colour fields show a **WCAG contrast** readout so text stays legible.
- **Text follows the page, space follows the box.** A heading is one size wherever it sits — in a sidebar, a card or a
  wide band — so the page's hierarchy holds; a card's padding still tightens in a narrow column. (Decided 2026‑09‑28.)
- **Links read on every Website theme.** A link's colour is your brand colour, moved lighter or darker only as far as it needs to read (4.5:1) on that theme's page and on a card — on Light the brand is used as it is; on Dark, Midnight and Purple it is lifted so a menu is legible. A link inside a coloured band takes the band's own link colour instead.
- Every control is keyboard‑accessible and labelled.

---

## 10. Multiple pages, Preview and Export

- **Pages:** use the Pages control (top‑left) to add pages, rename them, set the **Home** page, and duplicate. Buttons can **link to a page** so your nav works.
- **Preview:** a true, isolated preview of the exported site — **one real page at a time**, not every page stacked together. Switch devices inside preview, and click your own nav to walk from page to page exactly as a visitor will.
- **It opens at the size of your own screen.** The page fills your whole window — the same width *and* height a visitor on your monitor gets — with no frame, no padding and no rounded corners around it. The bar floats *over* the page rather than sitting above it, so it costs the preview no height.
- **The controls step aside when you say so — never on their own.** Press **Hide** (or **H**) and the bar slides away for an unobstructed look; a small **Controls** handle stays at the top to bring it back, and **H** works from anywhere, including after you've clicked the page you're previewing. The bar used to hide itself on a timer and again whenever the pointer left it — which meant choosing a device made the whole strip vanish before you could rotate it. It doesn't do that any more.
- **Pick a device to see one.** A phone or tablet from the menu is shown at its real size, framed like a device sitting on a surface — which is right for a device and wrong for "show me my site".
- **Sweep the width to find your breakpoints.** Drag **either edge** of the preview: the page narrows from both sides and stays centred, and the readout names the width and the rung it lands on — *1024 px · Tablet landscape*. Keep going and you can walk it down to a phone. Double‑click an edge to get the whole window back.
- **Pick a screen by name.** The preview bar works like a browser's device mode. The **size** menu lists this site's own five screen sizes (Mobile, Tablet, Laptop, Desktop, Wide) and then **sixty real devices**, grouped: iPhone · Android phones · Foldables · Tablets · Laptops · Monitors — each at its true size, named with its generation and its dimensions (*iPhone SE (3rd gen) — 375 × 667*). **Responsive** just fills the window.
- **Width and height are both real, and both editable.** Type any numbers you like into the two boxes and the page is laid out at exactly that; the menu then says *Custom*. Height matters as much as width — a hero built to be "one screen tall" is a different thing on a 667px iPhone SE than on a 1080px desktop.
- **Rotate** turns the screen on its side. Rotating back lands on precisely the numbers you started from.
- **Zoom** is yours: *Fit to window* shrinks a big screen until it fits, or pick 50–200% and it's obeyed exactly. Zoom past the window and the preview scrolls — every part of the page stays reachable.
- **A band you coloured and left empty is the same size on the page as on the canvas.** An empty band — including one holding a box or a grid you haven't filled yet — keeps its visible height when published, so a coloured strip at the top of your page is still there when a visitor arrives. A height you set yourself always wins over that, and a band with something in it takes its height from the content as usual.
- **A page shorter than the screen ends in its own colour.** If your content doesn't fill a visitor's window, the space below it takes the colour of the band your page ends on — so a dark footer simply runs to the bottom instead of stopping against a slab of white that looks like an empty block you never added. **Nothing is stretched and nothing is inserted:** your layout is untouched, it costs no height, there's no setting to find, and on any page taller than the screen you'll never see it at all.
- **The one known difference from the canvas — a desktop scrollbar.** On a desktop browser that shows a classic scrollbar, the Preview's page is about 15px narrower than the canvas, so a block's share of the width can differ by up to about **0.4%**. That is expected and accepted; our checks allow up to **0.6%** for it. Anything larger between the canvas and the Preview is a bug — please report it.
- **Previewing changes nothing.** Choosing a screen to look at doesn't touch your canvas or which per‑device layer you're editing; that stays with the editor's own device switcher in the top bar. Looking is not editing.
- **The size you pick is the size the page really gets.** Choose *Wide* and the page is laid out at a genuine 1920 × 1080, so it picks the layout a 1920px screen gets — even when your own screen is smaller. It's scaled down to fit and the bar states both numbers (e.g. `1920 px · 73%`). It's never cut off, and never quietly re-laid out at your screen's size instead.
- **Nothing is added on top of your page.** The preview shows what you designed and only that. Earlier versions prepended a navigation bar of their own; it's gone, from the preview *and* the exported site. To let visitors move between pages, build your own header and set a block's link to **another page** — it resolves to the right file when you export. While you're in the preview, the page tabs in the toolbar walk you around the site without touching the design.
- **Export:** downloads your site as a **ZIP of real pages** — `index.html` for the home page and one `.html` per page, plus a shared `styles.css`.

### What you get in the ZIP, and why it's built that way

| | |
|---|---|
| **One file per page** | Each page has its own address, so it can be found, bookmarked, shared and printed on its own. Your home page is `index.html`, which is what every web host looks for. |
| **Links are relative** | Unzip it onto a laptop, a USB stick or a web host and every link still works. Nothing assumes a domain. |
| **One shared `styles.css`** | A visitor downloads it once, then it is cached — every page after the first arrives faster. |
| **Each page carries only the styles it uses** | A term‑dates page of text and a table doesn't download the accordion, the alert or the rating — and a page with one accordion doesn't download the other twenty‑eight accordion designs either. A page of text ends up around 1.4 KB; a busy page with an alert, an accordion, a card and a photo, around 10 KB. |
| **The next page is already on its way** | While a visitor reads one page, the browser quietly fetches the others in the background. Clicking a link then feels instant. |

**Your fonts travel with the site.** The typefaces you chose are built into `styles.css` itself, so the published site looks exactly like the one you designed. They are *not* loaded from Google: that would mean every visitor's IP address is sent to a third party, which is a data-protection question no school should be handed without being asked. Nothing is fetched from anywhere else either — no scripts, no trackers — so the site works offline, opens from a USB stick, and there is nothing to break later.

---

## 10b. Bands: edge to edge, or a centred column

Every top-level block sits in a full‑width band across the page. Select it → **Design** tab → **Arrange** → **Content width**:

- **Edge to edge** — the band and its content run the full width of the page. Right for a photo strip or a colour banner.
- **Centred column** — the **background still spans the whole page**, but the words sit in a centred column. Right for almost everything else.

That second one is the setting that makes a page look professionally made. A heading stretched across a 27‑inch monitor is genuinely hard to read — the eye loses its place coming back to the start of the next line — so the text is capped at a comfortable measure that **widens by one step** as the screen grows: a phone gets the full width less a margin, a tablet ~34rem, a large tablet ~52rem, a desktop ~68rem, a very large screen ~76rem.

On a phone the column always keeps a margin, so text never touches the edge of the screen.

### Putting a block beside one, or underneath it

When a block does not fill the width of its band, there is empty space beside it — and you can drop something into it. As you drag, the insertion line tells you which you are about to get, and it is worth learning the two shapes:

- **A vertical line** means **side by side**. The new block takes the space that was free; the block already there **keeps the width you gave it**. Nothing is resized to make room.
- **A horizontal line** means **its own line**. Dropping below a side‑by‑side band creates a **new full‑width band underneath it**, leaving the band above untouched.

The whole empty area is a target, not just the edge — aim anywhere in the gap. And if you change your mind, **Ctrl+Z** puts it back.

---

## 10c. Grid — laying a page out like a table

Most page layouts are a row split into parts: a wide article beside a narrow sidebar, three cards across, a photo next to some words. In the Blocks panel that's **Grid**.

### Pick the shape, don't do the sums

Click **Grid** and you get a little grid. Sweep across it — *4 across, 3 down* — and click. You get twelve empty cells arranged exactly like that, the same way you'd insert a table in a word processor. Underneath the picker are the uneven shapes a sweep can't express: **Sidebar left · 4 · 8**, **Sidebar right · 8 · 4**, **Feature + two · 6 · 3 · 3**, **Wide + narrow · 7 · 5**.

**Dragging Grid asks the same question.** Drop the tile where you want the layout and the picker opens right there. Dragging says *where* the layout goes; it doesn't say what the layout *is*, so nothing is added to the page until you've chosen a shape — and pressing Escape (or clicking away) leaves the page exactly as it was.

### Twelve columns underneath

Every row is really **twelve columns**, and each block takes a number of them. Twelve because it divides evenly by 2, 3, 4 and 6 — so halves, thirds, quarters and sixths all come out exact.

You never have to think in twelfths. Select a block and the **Grid cell** panel offers the names — **Full, Half, Third, Two‑thirds, Quarter, Three‑quarters** — with the raw number underneath if you want it. Pick a Half inside a row of thirds and the row quietly re‑cuts itself to twelve so it can express one; nothing on the page moves.

| Control | What it does |
|---|---|
| **Width** | How much of the row this block takes — by name, or 1–12 |
| **Start at column** | Leave columns empty before it (an offset) |
| **Rows tall** / **Start at row** | The same two things going down, so a block can straddle rows |
| **Line up (across)** | Where the block sits inside its own cell |

### Drag a cell's edge

Select a cell and drag its edge. It behaves like a table: **the boundary between two cells is shared**, so widening one narrows its neighbour and the row stays put — nothing else on the page jumps. Keep going and the neighbour stops shrinking once it's too narrow to read and **wraps to the next row**, letting the cell you're dragging reach the full width of the page.

**And it comes back.** A wrapped neighbour keeps the width it had — wrapping moves it, it doesn't resize it — so when you drag the cell back in, the neighbour returns to the row and widens by exactly what you gave up. Drag out and back and you land precisely where you started. The row always adds up to the full twelve.

**The edge you grab is the only one that moves** — on all four sides. Drag the **left** edge and the cell before yours gives up exactly that much room while your right edge stays put; drag the **right** edge and your left edge stays put. When the cell next to you has no more room to give, yours simply stops growing rather than sliding out of its far side.

Dragging the **bottom** edge sets that **whole row's height**, so the row grows as one and the page grows with it. Dragging the **top** edge moves the boundary between your row and the one above: that row gives back exactly what yours takes, so your bottom edge doesn't budge. If the row above is already only as tall as the things inside it, there's nothing to give and the edge stays where it is — nothing is pushed down the page to make room.

**A drag is one gesture.** The canvas shows the result as you drag, letting go commits exactly what you were being shown, and one **Ctrl+Z** puts the whole drag back — not one frame of it.

### How small a box can go

**An empty box shrinks to almost nothing.** The *"Empty — drag a block in"* message is a hint for you, not content on the page, so it never sets a floor — drag the bottom edge all the way up and the box follows.

A box you haven't sized yet stands about **8rem** tall so you can see it, click it and drop into it — the same height the published page gives an empty coloured box. That's an offer, not a rule: the moment you set a height, your height is what you get, on the canvas and in the published page.

**A box with something in it stops where its content stops.** One line of text shrinks to about one line — the content sets the limit, not a number the builder picked. And empty boxes *inside* a box you've sized never hold it open: squeeze a section holding an empty grid and the grid comes with it.

### Empty space is allowed

If a row has columns left over, hover it (or select something in it) and an **Add a block here** target appears, exactly the width of the gap. It's hidden the rest of the time — empty space in a layout is a legitimate choice, not a mistake to be corrected.

### Grids inside grids

A cell is just a container, so **anything you can do to the page you can do inside a cell** — including adding another Grid block with its own columns and rows, as deep as you like. Each one carries its own spacing: **Space between blocks**, plus **Space across** and **Space down** separately when a row wants more air between its columns than between its rows, and Inner/Outer spacing per side.

**All three are sliders.** Spacing is something you judge by eye, so you sweep it and watch the canvas rather than typing a number and looking. Space across and Space down start out *matching* Space between blocks — sweep one and it takes on a value of its own, and the line underneath offers it straight back to matching whenever you want it. A whole sweep is **one Ctrl+Z**, however many times the slider ticked on the way.

Grids start **full width with no padding**, at every level. Spacing is something you add, not something you have to find and remove.

### Row heights — even, or following the picture

A row normally gives every block in it **the same height**: whatever the tallest one needs. That is right for a row of cards, and wrong for a row of photographs — a tall portrait forces everything beside it to stretch, and the wide ones get cropped to match.

Select the grid, open **Arrange**, and you'll find **Row heights**:

| | |
|---|---|
| **Even** | Every block in a row is the same height. This is what every page has always done — nothing changes if you never touch it. |
| **Follow the picture** | Each block is as tall as what's inside it, and the one below fills the first gap that opens up. Photographs of different shapes sit together without any of them being cropped. |

**Everything else keeps working.** Column widths, offsets, order, per‑device settings, corners, spacing, backgrounds — none of it changes. This is a setting on the row, not a different kind of block, which is why you can turn it on and off freely.

**Your blocks still read in the order you put them in.** Left to right, then down — so a caption that says "1, 2, 3" still says 1, 2, 3, and someone using a screen reader hears them in that order too. (The usual trick for this effect runs the content *down* each column instead, which reads wrongly for anything numbered or newest‑first. This doesn't.)

**Spacing.** **Space down** is the air beneath each block; **Space across** separates the columns. They're independent, as they are on any row.

**On a phone** the row stacks into one column, exactly as any row does. There's nothing to stagger with a single column.

#### When your blocks aren't photographs

The builder knows how tall a photograph will be — it measures every picture when you add it. It cannot know how tall a card or a caption will be until the page is actually open in someone's browser, so it assumes a sensible shape and the spacing comes out a little loose.

For those, tick **Measure on the page**. A small script measures the real heights once the page loads and sets the spacing exactly, then does it again when the window is resized, when the fonts arrive and as each photograph loads.

It's off by default because your published pages carry **no JavaScript at all** unless you ask for some. And it only ever improves things: with scripting switched off, the page still staggers and still never crops — the spacing is just less exact.

### On a phone

A twelve‑column row **stacks to one column on a phone** and to two on a tablet held upright, with each block keeping its share of the width — so three cards become three full‑width cards rather than three unreadable slivers. If you want something different, pick the device at the top of the screen and set **Columns** there; the row then does what you said from that size down.

**If you placed the cells yourself, the placement is released when the row narrows.** *Start at column* and *Start at row* are written in the wide row's twelve columns, and there is nowhere to put "column 9" in a row that now has one. So at those sizes the cells simply **flow** — one after another, in the order you added them, wrapping onto new rows — and each keeps its share of the width as above. You will see three hand‑placed cells go two‑up on a tablet and fully stacked on a phone, the same as any other row.

> It used to try to keep them where you put them, which sounds better and is not: two cells rescaled into the same column are both drawn, one on top of the other, and the one underneath looks like it was deleted.

**A grid inside something narrow narrows by its own box, too.** Put a three‑across grid inside a sidebar, a column, or another grid's cell, and it goes to two across once its *own* box is narrower than three readable cells (about 36rem), and to one column below about 24rem — on a desktop as much as on a tablet, because what matters is the room the grid actually has, not the size of the screen. A grid the full width of the page never notices this rule (the page has room); a grid you gave a column count for a device keeps your number.

> Before this, a three‑quote grid nested in the middle cell of a three‑cell grid drew each quote 85px wide on a tablet and broke every word letter by letter — the screen had room for three across, the cell did not.

**Setting Columns for a device works the same way.** Your *Start at column* was written in the twelve-column row's units, so it's released there too and the cells flow. If you want an exact placement at that size, set **Start at column** on the cell *while that device is picked* — then it's read in that row's own units and honoured exactly.

Everything in this section is per‑device. Setting **Order** on a phone is what puts the photo above the words there and beside them on a desktop.

---

## 10d. Styling a box and everything in it

Select any container — a section, a grid cell — and open **Text style (everything inside)** on the Design tab.

Whatever you set there — font, colour, size, boldness, line spacing, alignment — **everything inside follows**: headings, paragraphs, lists, buttons and components alike. Style one block on its own afterwards and that block keeps its own look; the box only supplies what a block hasn't decided for itself.

Text size is proportional, not flat: making a cell's text bigger scales its heading and its body together, keeping the heading larger than the body rather than collapsing them to one size.

Backgrounds, borders, corners and padding stay with the box itself — they're the box's own shape rather than something its contents inherit.

---

## 10g. Sloped and curved section edges

Bands don't have to meet in a straight line. Select one → **Design → Arrange → Edge shape**, and pick a shape for its **top** and its **bottom** independently:

- **Straight** — the default
- **Slope right** / **Slope left** — a diagonal cut
- **Curve out** / **Curve in** — an arch, bulging outward or scooped inward

**Edge depth** controls how far the shape cuts, as a percentage of the section's height. It's capped, so a shape can never swallow the whole band.

Each choice shows you the shape rather than naming it, so you pick a picture.

Two things worth knowing:

- **The shape cuts the background; it doesn't move your content.** A sloped section is exactly as tall as it was — so text stays where you put it and nothing reflows when you change the shape.
- **It's the section underneath that shows through.** A slope on the bottom of a blue section reveals whatever comes next, so the effect reads best between two sections of different colours.

---

## 10f. A section that fills the screen

Select a section → **Design → Arrange → Screen height**:

- **Fit content** — as tall as whatever is inside it. The default.
- **Half screen** — half the visitor's screen.
- **Full screen** — a hero exactly one screen tall, the thing people mean by "make the front page look like a proper website".

It's a **minimum, not a fixed height**. If the words inside outgrow the screen the section gets taller rather than hiding them — so a long headline on a small phone still reads in full.

Two things it handles for you. It uses the *conservative* measure of screen height, so a full-screen section always fits on arrival rather than being pushed under the phone's address bar. And because it's a floor, a section that's still empty while you're building it stays full height instead of collapsing to nothing.

---

## 10e. Putting a block where you want it

Select any block and open **Position** on the Design tab. You get nine squares — top-left, top-centre, top-right, and so on down to bottom-right. Click one and the block goes there. Click the same one again to let it sit wherever the layout puts it.

It **moves only that block**; its neighbours stay exactly where they were.

The nine squares mean the same thing wherever you use them, which is the point — a section, a row, a grid cell, at any depth. Underneath, the builder works out which CSS a given parent needs (that answer changes depending on whether the parent stacks top-to-bottom or side-by-side, which is not something you should have to think about).

**One thing worth knowing about grids.** Inside a grid, a block is positioned within **its own cell**. If you want to move it across the whole row instead, change how many columns it takes or which column it starts at — that's what those controls are for.

If you'd rather place something completely freely, use **Placement → Floating** and drag it anywhere. That lifts it out of the layout onto its own layer.

### Selecting the box you mean

Click a block and you select the **outermost** box you clicked into — usually the cell. Click again to go one level deeper, and again to reach the text. **Escape** steps back out. This is why a cell is easy to hit even when it's full of content.

---

## 11. Keyboard shortcuts

| Action | Shortcut |
|--------|----------|
| **Edit the selected block's text** | **Enter** or **F2** (the caret lands at the end, so you carry on typing) |
| Undo / Redo | Ctrl+Z / Ctrl+Y |
| Copy / Cut / Paste | Ctrl+C / Ctrl+X / Ctrl+V |
| Duplicate | Ctrl+D |
| Delete | Delete / Backspace |
| Nudge / reorder | Arrow keys |
| Float ⇄ flow | Alt+F |
| Group / Ungroup | Ctrl+G / Ctrl+Shift+G |
| Lock / Unlock | Ctrl+L |
| Bring forward / to front (floating) | Ctrl+] / Ctrl+Shift+] |
| Send backward / to back (floating) | Ctrl+[ / Ctrl+Shift+[ |
| Open / close the Blocks panel | B |
| Open Blocks panel + focus search | / |
| Step out of the selected block (then deselect) | Escape |

---

## 12. Component guide — Accordion

The **Accordion** is a stack of expandable panels (FAQ, term dates, policies, help topics). It's built on native `<details>`/`<summary>`, so it's **zero‑JavaScript**, works in the exported site, and is **keyboard‑ and screen‑reader‑accessible out of the box**.

**Add one:** Blocks panel → **Accordion**. You'll be asked what it's for, and it arrives ready to edit.

### Pick a design, then fine‑tune it

Select the accordion → **Content** tab. You'll see two things:

**1. Design — 29 looks, shown as live previews.** Not names in a list: each tile renders a real miniature accordion, so you pick what you can see. Two families:
- **Signature (24)** — Boxed (the default), Horizontal, Solid panel, Index tile, Big number, Ring step, Chat bubble, Q&A, Callout, Float, Folder tabs, Editorial, Menu pills, Enclosed card, Dark glossy, Two‑column, Quote, Glass, Timeline, Alternating, Colour stripe, Spotlight, Folded corner, Split (media panel).
- **Quiet & minimal (5)** — Ghost, Line, Minimal, Underline, Soft.

**2. Fine tuning — six settings that combine with *any* design.** This is the important part: they're **independent**, so "Timeline" *and* "Numbered" *and* "Compact" can all be true at once.

| Setting | What it changes | Choices |
|---------|-----------------|---------|
| **Indicator** | The marker that says a row opens | Chevron · Arrow · Plus circle · Tag dot · Switch · On the left |
| **Frame** | How each row is framed | Outline · Elevated · Dashed · Pill · Square |
| **Rhythm** | Spacing and separators between rows | Flush · Separated · Divided · Zebra · Rail |
| **Open colour** | What an open row looks like | Filled · Accent edge · Brand header · Body tint · Gradient · Gradient bars |
| **Numbering** | Row numbers | Numbered · Stepper |
| **Density** | Room per row | Large · Compact |

The panel shows **how many you've changed** and gives you one **Reset** to put them all back. A changed setting is marked with a dot as well as a colour, so it reads without relying on colour alone.

> **Why it's built this way:** these used to be mixed into one list of 54 "designs", which meant picking Timeline *replaced* Numbered instead of combining with it. Splitting them means the gallery only contains things that genuinely look different, and the combinations you actually want are reachable.

### Everything else

**Full CRUD on every item.** Title, Body, optional Meta (a right‑aligned price or badge), an Image thumbnail, a Number/badge, and **Open by default**. Add, remove, reorder (▲/▼) and replace any item — the last one can't be removed, so it's never empty. Click a panel's title or body **directly on the canvas** to edit in place.

**Numbers you control.** Numbered designs count `01, 02, 03…` automatically; type your own value in an item's **Number/badge** field to override just that one.

**Style each item's Header and Content — no CSS needed.** Text colour, fill, font, size, **weight, letter spacing, capitals, corner radius, padding, border**, alignment, and free **Move ← → / ↑ ↓** nudging in rem. These win over the chosen design, so one item can look completely different — a highlighted "featured" row, for instance.

**Move an item freely.** Toggle **"Move freely"** on any item to lift it out of the stack and place it exactly where you want — drag on the canvas or type X/Y. It stays inside the accordion's box, and on phones it returns to the normal stack so the page stays readable.

**One open, or many.** By default one panel opens at a time; tick **"Allow more than one open at once"** to change that.

**Expand / Collapse all (optional).** Adds two buttons above the panels. This is the one feature that adds a *tiny* opt‑in script to your exported site — the accordion is fully usable without it.

---

## 13. Component guide — Alert

The **Alert** carries one message that matters: a closure notice, an open day, a fees deadline, a "we've moved" banner. It's a **single message** by design — a list of notifications is a different thing, and mixing the two makes both worse.

**Add one:** Blocks panel → **Alert**. You'll be asked what it's for — **Information · Success · Warning · Error · Announcement bar · Docs callout** — and it arrives already looking like that job, rather than as a blank you have to configure.

### Severity — what kind of message it is

Six: **Information · Success · Warning · Danger · Neutral · Brand**. The severity chooses the colour, the default icon, *and* how a screen reader announces it — warnings and errors interrupt, the rest wait their turn. Nothing depends on colour alone.

### Form — where it sits

| Form | Where it appears |
|------|------------------|
| **Inline** | In the flow, next to what it refers to |
| **Banner** | Edge to edge across a section |
| **Callout** | A persistent note that loads with the page |
| **Toast** | Floats in a **corner** — pick top‑left, top‑right, bottom‑left or bottom‑right |

### Design — 23 looks, and six things that combine with them

Same shape as the Accordion. **Design** is a visual gallery in four families:
- **Filled & tinted (6)** — Soft, Solid, Gradient, Duotone, Inset, Quiet
- **Outlined & ruled (7)** — Outline, Framed, Left accent, Top accent, Underline, Bracket, Striped edge
- **Raised & layered (5)** — Card, Elevated, Hard shadow, Glass, Sticky note
- **Shaped & characterful (5)** — Icon panel, Ribbon, Ticket, Speech bubble, Terminal

**Fine tuning** — six independent settings: **Shape** (6) · **Border** (8) · **Icon** (8) · **Density** (3) · **Emphasis** (5) · **Layout** (6). Every one combines with every design.

### Actions — buttons and links on the message

Add up to **two** actions ("Read the letter", "Pay now", "Book a place"). Each has:
- **Label**, and where it **goes to** — a web address, a bookmark on the page, or another page
- **Style** — Filled, Outlined, or a Text link with an arrow
- **Open in a new tab**
- Full styling: colour, fill, font, size, weight, spacing, capitals, corners, padding, border, and free placement anywhere in the alert

**Where they sit:** under the message, or on the right. On a phone they always stack underneath, so a button is never pushed off the side.

> A **toast** takes only **one** action. A message that hides itself is the worst place to put a decision, and two buttons in a corner is how people miss both.

### Behaviour — all optional, all off by default

- **Dismiss (×)** — lets a visitor close it
- **Hide itself after N seconds** — shows a countdown bar, and **pauses while a visitor hovers or tabs into it**, so nobody loses a message mid‑read
- **Stay dismissed on the next visit** — remembers, per visitor

Leave all three off and the exported alert contains **no JavaScript at all**.

### Everything else

The message's **title, body, icon, meta and image** are each individually stylable, positionable and freely placeable — the same controls as the Accordion's items, plus per‑item Advanced CSS.

---

## 14. Movement — hover, entrance and arrival

Every block on the page — a section, a component, a button, an image — can be given movement. It's all **pure CSS**: nothing is added to your exported site, and what you see while editing is what a visitor gets.

Select any block → **Design** tab → **Outline & effects**.

### Hover & focus — how it reacts

Eight effects, shown as previews: **Lift · Grow · Press · Glow · Outline · Brighten · Soften**, and None.

Each one also applies when a visitor **tabs to it with a keyboard**, and to a card when a button *inside* it takes focus — so someone not using a mouse gets the same feedback.

### Entrance — how it arrives

Eight effects: **Fade in · Rise up · Drop down · From the left · From the right · Zoom in · Sharpen**, and None.

Two options go with them:
- **Play when it scrolls into view** — instead of on load
- **Bring the blocks inside in one after another** — the contents arrive in sequence rather than together. On a section, that's its blocks: a row of three cards rising one after the other as a visitor scrolls to it. On a component that holds a list — an accordion of questions, a stack of alert messages — it's the **rows**, so the list reads as a set of things rather than one lump.

### Movement on a single row

The same two choices are offered **per item** on a component that holds a list. Select the accordion or the alert → **Content** tab → open a row → **Hover & focus** and **Entrance**.

They're the same effects, from the same catalogue — a row's Lift *is* a block's Lift. Use them to make one FAQ row respond on its own, or to have a single urgent message rise in while the rest of the stack sits still.

One difference worth knowing: an item's entrance never staggers its own parts. A row's title and body arrive together, because an item is one thing — its title and body are its parts, not a list.

### Two promises

**Nothing can hide your content.** Every entrance animates *from* hidden *to* the block's normal appearance — so if the animation never runs (an old browser, a printer, a slow connection), the content is simply there. An animation can never leave a page blank.

**Reduced motion is respected.** A visitor whose device asks for less motion gets the meaning without the movement — a Lift keeps its shadow, an entrance shows the content immediately.

---

## 14b. Pages everyone can use — meaning, headings and the Page check

Your page is published as proper HTML5, however you built it — you do not need to know what that means.

- **The main part of the page is found for you.** Mark your top band **Page header** and your last band **Page footer**
  (select it → Design → **Meaning** → *What is this block?*) and everything between becomes the page's main content.
  Mark nothing and the whole page is the main content. A **Skip to content** link is added for keyboard users — it is
  invisible until someone presses Tab.
- **Headings follow the page.** The first heading of your content is the page's title (level 1), later ones level 2, and
  a heading inside a **Section** or **Article / card** sits one level below. You can set a level by hand under
  **Meaning → Heading level**; the size is separate, under Text.
- **A card's title is never the page's title.** A card, a quote, a sidebar or a menu is a self‑contained piece, so its
  heading titles that piece, not the page. If your content opens with a row of cards, the first heading *outside* them
  becomes the title; a page whose content is only cards is titled by the school's name in the header. And when the title
  heads a section, the cards inside that section sit one level under it (2), not two — no level is skipped.
- **Cards and quotes are already right** — a Card is published as an article, a Quote as a figure.
- **The Page check** (toolbar) shows a number when something needs *your* words: a picture with no description
  ("Describe this picture for people who can't see it" — type it right there, or choose *It's only decoration*), or a
  button with no words. Everything else is fixed for you and listed under *Fixed for you*.

## 14c. Sizing columns, and working on a smaller screen

- **A column you size yourself can be as narrow as you like** (down to about 3rem) — a 10/90 label column, six logos
  across. Columns you never sized keep a comfortable minimum so they wrap neatly. **On a phone every row stacks**, one
  column under another, so nothing is ever squeezed.
- **Rows of four or more columns** — a logo strip, four courses, a five-column footer — **stay one row on a desktop,
  a laptop and a wide screen**. **On a tablet** they rearrange by themselves to at most three per line, as evenly as
  they can: 4 → 2 + 2, 5 → 3 + 2, 6 → 3 + 3, 7 → 3 + 2 + 2. Each column keeps its proportions within its line, so a
  narrow column stays narrow beside a wide one. Want something else on the tablet? Switch the editor to **Tablet** and
  size a column there — what you set on a device always wins, and the desktop is untouched.
- **Widening a block never makes it jump.** Pull it until its neighbour no longer fits, and the neighbour moves to the
  next line while your block stops exactly where you let go. Drag back and everything comes home.
- **On a smaller screen the page is shrunk to fit.** Choose Desktop 1280 on a laptop and the page is shown smaller
  (the zoom reads *Fit · 83%*) so all of it sits beside the panels — it is still laid out, and published, at full size.
  Everything you drag is still exact.
- **Zoom in when something is too small to work on.** A thin column, a small icon cell, a divider: press **+** beside
  the screen sizes, or pick a size from the zoom menu (Fit, 50–400%, or *Zoom to selection*). The page is drawn larger
  and scrolls both ways; hold **Space** (or the middle mouse button) and drag to move around it. Zoom only changes how
  big the page is drawn for you — what you drop, select and drag is stored exactly as at 100%, and the published page
  never changes.
  - Keyboard, with the pointer on the page: **Ctrl +** / **Ctrl −** step in and out, **Ctrl 0** is 100%, **Shift 1**
    fits the page, **Shift 2** zooms to the selected block. **Ctrl + scroll** (or a pinch) zooms round the spot under
    the pointer; scrolling alone still scrolls.
  - Over the panels and the Inspector, Ctrl + and Ctrl − are your browser's own zoom, so you can still make the whole
    builder bigger.
  - The handles and toolbars stay the same size at every zoom, so their buttons are always easy to hit.
  - The zoom you pick is remembered for each screen size on this computer; a screen size you never zoomed opens fitted.
    It is never saved into your site.
- **The Add-a-block panel sits beside the page** on a laptop and up, so nothing is ever hidden under it. It stays open
  while you work; close it with its ✕, **Esc** or **B**. On a phone it floats over the page and the Inspector slides in
  from the side.

## 15. Tips, gotchas & FAQ

- **"There's an empty container/row wrapping my block."** There isn't — the structural row and the page itself are invisible scaffolding: they're never selectable and never highlight on hover, so nothing empty appears around your block. Click your block (or anywhere in its row) and you select the block itself; the only highlight you see is the block's own selection box, hugging its content.
- **"Dragging my block made it full-width."** Fixed — moving a hugging (**Fit**) block in the layout keeps it hugging wherever it lands. Only a block you've set to **Full** or **Custom** fills the row. (Nothing changes its width just by being moved.)
- **"My block box is bigger than its content."** With **Width → Fit** a block always hugs its content exactly (in the layout and when floating) — no empty stretched box. If you *want* a larger box (e.g. a tall badge), size it with **Width/Height** and use **Content position** to place the content inside it.
- **"The page shows two sections I didn't add."** That's old saved data. Click **Reset** for a clean, blank page.
- **"Text size / bold / colour didn't change my component."** Make sure you selected the exact inner piece (the card's *title*, not the card). Each piece is edited on its own.
- **"I clicked a text block, started typing, and nothing appeared."** Fixed. Clicking a text block selects the band around it first — that is the drill‑down rule, and it is deliberate — but for a short while the editor read that as "you did not mean to be in this text" and took the cursor away a fraction of a second after the click. Click and type; the words land. The same fix cured its opposite: clicking the empty part of a box used to leave the cursor stranded in whatever text was nearest, and while it sat there **every keyboard shortcut silently did nothing** — Delete, `Ctrl+D`, the arrows, all of them.
- **"I clicked the first word of a heading and got something else."** Fixed, twice over. The **Blocks** launcher used to float over the top‑left corner of the page, so the first word of the first block opened the panel instead of taking the cursor — the canvas now reserves the button its own gutter, so it sits beside the page rather than on it. And the **resize handles** straddle a block's edge, which is where you grab to resize; because a block starts with no padding, its first letters sit under the left handle. A *drag* on a handle still resizes, but a *click* now goes through to the text under the pointer, with the cursor landing on the letter you actually aimed at.
- **"I can't get into the text without a mouse."** Fixed — select the block and press **Enter** (or **F2**). The cursor lands at the end of the existing words so you carry on typing; **Escape** steps back out.
- **"Resizing a stack leaves gaps I didn't ask for."** Fixed, and the rule is now simple: **dragging an edge that touches another stack moves that stack** — it gives or takes the room and the two stay together, whichever side you drag from, horizontally or vertically. A space only ever opens at an **outer edge**: the far left when nothing is to its left, the far right, the top, the bottom. That's the one case with no neighbour to share the boundary with, and it's deliberate. One case used to break the row outright: dragging the **left edge of the leftmost stack** pushed its neighbour onto a second line, because the gap was stored as a fixed size while the widths beside it are percentages, so the row added up to slightly more than 100%. The gap is now a share of the row like everything else, so it adds up exactly at any width and scales with the page.
- **"I made the stack I just dropped shorter and the one below it stayed where it was."** Fixed. A block you drop into empty space is set to **take the space that's there** — and when you then drag it shorter, that instruction now stands down, so the block below rides up to meet it and the room you freed collects at the **bottom of that column**, ready to build on. Blocks follow each other; leftover pools at the end.
- **"I shrank a stack from the top and now I can't drop anything into the space above it."** Fixed. Dragging a block's **top** edge down leaves empty space above it — and that space was a *margin*, which isn't a box, so there was nothing there to drop into. Dropping there did add a block, but the gap came along with your stack into the new arrangement, so the space stayed empty **and** your stack moved down. Now the newcomer **fills that space** and your block stays anchored where its bottom edge was. This works wherever you've made room — above a block, below a short one, or beside a narrowed one.
- **"I deleted one of my side-by-side blocks and now there's a gap I can't close."** Fixed. The deleted block's share of the row used to be left behind, so the row stopped filling its width — and dragging couldn't recover it, because dragging moves the boundary *between* two blocks and keeps their total the same. The freed width is now shared out **in proportion**: 20% / 20% / 60% becomes 25% / 75%, so the blocks keep the relationship you gave them and the row is full again. Stacked blocks and grids are untouched — they don't share a width that way.
- **"I widened a stack until its neighbour dropped below, dragged it back — and the page never came back."** Fixed. Once the neighbour had wrapped onto the next line the builder stopped recognising it as the block beside yours, so narrowing handed the width to nobody and the pair ended up 224 / 712 instead of 512 / 512. The neighbour is now always the next block in your layout, wherever it happens to be drawn. **Drag out and back and you land exactly where you started**, however many times you do it.
- **"I narrowed a stack and an empty space opened at the end of the line, with the other stack sitting underneath."** Fixed. As you narrow, the stack that wrapped below **comes back up as soon as it fits** and takes the rest of the line — it never leaves a hole beside you that it could have filled.
- **"I dropped a fourth block beside three others and it jumped onto a new line, leaving a big empty space."** Fixed. A block dropped onto a full line now takes **an equal share of that line** — two become thirds, three become quarters — and the blocks already there keep their proportions. The shares can never add up to more than the line, so nothing wraps and nothing leaves a hole. A block that hugs its content, such as a **Stat**, takes a share too when the line is full; where there is room it still hugs.
- **"A block that dropped onto its own line wouldn't get narrower."** Fixed. A block pushed onto a line by itself still **fills that line** — until you drag its edge yourself. From then on it's the size you dragged.
- **"My header stays at the top, but the sidebar slid under it and the page's words showed through the logo."** Fixed. A bar that stays at the top of the page now covers what scrolls beneath it — it takes the page's own colour when you have not given it one — and a sidebar that sticks while the article scrolls stops **below** the header instead of under it.
- **"I clicked a block and pressed Delete, and nothing happened."** Fixed. Clicking a block now gives it the keyboard, even straight after you clicked a button such as a screen size in the toolbar — Delete, the arrow keys and the shortcuts act on the block you picked.
- **"Four links side by side took two lines on a phone."** Fixed. On a phone, links in a line sit 1rem apart (2rem on larger screens), and links dropped straight on the page share one gutter at the line's ends instead of each carrying its own. A space you choose with **Space across** is kept on every screen.
- **"My Badge became a bar across the whole page."** Fixed. A Badge, a Stat and a Rating keep their own small size wherever they are dropped, on every screen.
- **"I set my sidebar to stay on screen and it shrank to a stub."** Fixed, for both ways of staying put. A **sidebar now fills the height of the screen** — a Stack sitting beside a column of content, whether you chose *Floats on screen* or *Sticks when reached*. (With *Floats on screen* the block is lifted out of the page, so nothing gives it a size any more: that's why a bar held at the **top** has to be given its width, and the same had never been done for a rail held at the **left** or **right**. With *Sticks when reached* it can't be as tall as the column beside it — a block with no room to travel can never stick — but it can be as tall as the screen, which is what a sidebar is.) A block held at a **corner** still hugs its contents (a chat bubble isn't a sidebar), a **button or heading** in a row is never stretched, and a height you set yourself always wins.
- **"My menu links jump to the right place, but the heading is hidden under the bar."** Fixed. A bar set to **Floats on screen** reserves no space, so the page runs underneath it — and the browser still thinks the top of the page is the very top, above anything you can see. Links now land the section *below* the bar, and the amount is the bar's real height, so it stays right when the bar's text wraps onto a second line or when two bars are stacked. This works in **Preview** as well as on the published site: in-page links used to do nothing at all in the preview, which was the one place you'd try them.
- **Everything saves automatically** to your browser. **Reset** wipes the current site back to a blank page — use it deliberately.

---

*This page is living documentation — if the builder changed and this didn't, please flag it.*
