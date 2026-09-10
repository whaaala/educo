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
| **Top bar** | Pages, **Add section**, Undo/Redo, **Preview**, **Export**, **Reset**, the device switcher, and **Base size**. |

**Flow by default, float for free.** New blocks join the normal page flow (they stack and reflow responsively). When you want to place something freely on top, you switch a block to **Floating** — see §7.

---

## 3. The building blocks

### Layout
| Block | Use it for |
|-------|-----------|
| **Section** | A full‑width band of the page (e.g. a tinted "Admissions" strip). Deliberately visible chrome you fill with other blocks. |
| **Columns** | An equal‑column grid (2, 3, 4 columns) — great for feature cards or staff photos. |
| **Row** | Items sitting side‑by‑side that wrap on small screens. |
| **Spacer** | Adjustable vertical breathing room. |
| **Divider** | A dividing line (solid, dashed, dotted, thick). |

### Text
| Block | Use it for |
|-------|-----------|
| **Heading** | Titles. Styles: Display, Title, Subtitle, Eyebrow. |
| **Text** | Paragraphs. Styles: Body, Lead, Caption, Quote. |
| **Button** | A call to action with a link (a page or a web address). |
| **List** | Bulleted or numbered lists. |

### Media
**Image**, **Video** (YouTube/Vimeo/MP4), **Icon** (searchable symbol), **Embed** (paste an iframe/HTML).

**Photographs** — select an Image block and open the **Content** tab:

- **Describe this image** — what the picture shows, read aloud to visitors who cannot see it and used by search engines. Leave it blank only when the picture is purely decorative (a divider, a texture).
- **Load straight away** — off by default, which is right for anything below the fold. Turn it on for a picture at the very top of the page, or the top of the page opens briefly empty.
- **Show the whole picture (don't crop it)** — appears once you have uploaded a photograph, because the builder then knows what shape it is. Ticked, the block takes the photograph's own proportions; unticked, it is cropped to the **Height** you set in the Design tab. Cropping is often what you want for a neat row of equal cards — this is the choice, not an accident.

The builder measures a photograph when you upload it and tells the browser its size up front, so **the space is reserved before the picture arrives**. Without that, text jumps down the page as each photo loads and readers lose their place — the single most irritating thing a photo-heavy site can do.

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
1. Blocks → **Columns** → **3 columns**.
2. Into each column, add a **Card**.
3. Click each card's **heading** and type the point ("Small classes"); click the **body** and describe it; click the **button** and set its **Link** to the relevant page.
4. Want the heading centred? Select just that heading → **Content position** or **Text align** → centre. Only that heading changes.

### Scenario C — An eye‑catching admissions banner
**Goal:** a coloured band with a headline and an "Apply now" button.
1. Blocks → **Section**. In the inspector give it a **Background** colour (or image) and some **Inner spacing**.
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
- **Size** — **Width** (Fit = hug the content, Full = fill the row, Custom = a % or px), **Position in row** (Left / Centre / Right), **Content position** (a 3×3 grid — where the content sits inside the block when it's bigger than its content), **Height**, and **Trim to size**.
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

- **Blocks hug their content by default.** A short heading or a button is exactly as wide (and tall) as its content — no empty box stretched around it, whether the block sits in the layout or floats freely. Switch **Width** to **Full** to fill the row, or **Custom** for an exact size.
- **A resized block is exactly the size you set.** Drag an edge or type a Width/Height and the block occupies precisely that — the box *is* the space it takes, never a larger invisible wrapper.
- **Resize from any edge.** Drag any edge or corner handle. The grabbed edge moves; the opposite edge stays put. You can grow a block from the **top** edge too.
- **A resized block is one shape.** When you make a button, card, badge or any block bigger, the block *itself* grows to fill the new size — there's never a second empty shape left behind at the old size. Its content re‑positions inside it automatically (a resized button centres its label).
- **Content position.** When a block is bigger than its content (e.g. you made a badge tall), use the **3×3 Content position** grid to place the content — top‑left, centre, bottom‑right, etc. Works for every block, elements and components alike.
- **Position in row.** To left/centre/right‑align a hugging block within its row, use **Position in row**.

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

---

## 9. Themes, colours and accessibility

**Two independent themes — pick each freely:**
- **Website theme** (top bar, the 🎨 *Purple Dream / Light / Dark / Midnight* picker) — the theme of the **site you're building**. It re‑skins the **canvas, all its content, and the export** so you can design, say, a Purple site. It's **saved with your site**.
- **Editor theme** (the sun/moon picker beside it) — how the **builder UI itself** looks while you work. It never changes your website; design a Light site in a Dark editor if you like.

- Colours come from the site's **design tokens** (an OKLCH colour system) — pick from themed swatches, a spectrum, a hex field, or the eyedropper. There are **no hardcoded colours**, so switching the Website theme re‑skins everything consistently.
- Colour fields show a **WCAG contrast** readout so text stays legible.
- Every control is keyboard‑accessible and labelled.

---

## 10. Multiple pages, Preview and Export

- **Pages:** use the Pages control (top‑left) to add pages, rename them, set the **Home** page, and duplicate. Buttons can **link to a page** so your nav works.
- **Preview:** a true, isolated preview of the exported site — **one real page at a time**, not every page stacked together. Switch devices inside preview, and click your own nav to walk from page to page exactly as a visitor will.
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

## 10b. Sections: edge to edge, or a centred column

Every section sits in a full‑width band across the page. Select the section → **Design** tab → **Arrange** → **Content width**:

- **Edge to edge** — the section and its content run the full width of the page. Right for a photo strip or a colour banner.
- **Centred column** — the **background still spans the whole page**, but the words sit in a centred column. Right for almost everything else.

That second one is the setting that makes a page look professionally made. A heading stretched across a 27‑inch monitor is genuinely hard to read — the eye loses its place coming back to the start of the next line — so the text is capped at a comfortable measure that **widens by one step** as the screen grows: a phone gets the full width less a margin, a tablet ~34rem, a large tablet ~52rem, a desktop ~68rem, a very large screen ~76rem.

On a phone the column always keeps a margin, so text never touches the edge of the screen.

---

## 10c. Columns — laying a page out like a table

Most page layouts are a row split into parts: a wide article beside a narrow sidebar, three cards across, a photo next to some words. In the Blocks panel that's **Columns**.

### Pick the shape, don't do the sums

Click **Columns** and you get a little grid. Sweep across it — *4 across, 3 down* — and click. You get twelve empty cells arranged exactly like that, the same way you'd insert a table in a word processor. Underneath the picker are the uneven shapes a sweep can't express: **Sidebar left · 4 · 8**, **Sidebar right · 8 · 4**, **Feature + two · 6 · 3 · 3**, **Wide + narrow · 7 · 5**.

**Dragging Columns asks the same question.** Drop the tile where you want the layout and the picker opens right there. Dragging says *where* the layout goes; it doesn't say what the layout *is*, so nothing is added to the page until you've chosen a shape — and pressing Escape (or clicking away) leaves the page exactly as it was.

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

Dragging the top or bottom edge sets that **whole row's height**, so the row grows as one and the page grows with it.

### How small a box can go

**An empty box shrinks to almost nothing.** The *"Empty — drag a block in"* message is a hint for you, not content on the page, so it never sets a floor — drag the bottom edge all the way up and the box follows.

A box you haven't sized yet stands about **8rem** tall so you can see it, click it and drop into it — the same height the published page gives an empty coloured box. That's an offer, not a rule: the moment you set a height, your height is what you get, on the canvas and in the published page.

**A box with something in it stops where its content stops.** One line of text shrinks to about one line — the content sets the limit, not a number the builder picked. And empty boxes *inside* a box you've sized never hold it open: squeeze a section holding an empty grid and the grid comes with it.

### Empty space is allowed

If a row has columns left over, hover it (or select something in it) and an **Add a block here** target appears, exactly the width of the gap. It's hidden the rest of the time — empty space in a layout is a legitimate choice, not a mistake to be corrected.

### Grids inside grids

A cell is just a container, so **anything you can do to the page you can do inside a cell** — including adding another Columns block with its own columns and rows, as deep as you like. Each one carries its own spacing: **Space between blocks**, plus **Space across** and **Space down** separately when a row wants more air between its columns than between its rows, and Inner/Outer spacing per side.

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

Everything in this section is per‑device. Setting **Order** on a phone is what puts the photo above the words there and beside them on a desktop.

---

## 10d. Styling a box and everything in it

Select any container — a section, a grid cell — and open **Text style (everything inside)** on the Design tab.

Whatever you set there — font, colour, size, boldness, line spacing, alignment — **everything inside follows**: headings, paragraphs, lists, buttons and components alike. Style one block on its own afterwards and that block keeps its own look; the box only supplies what a block hasn't decided for itself.

Text size is proportional, not flat: making a cell's text bigger scales its heading and its body together, keeping the heading larger than the body rather than collapsing them to one size.

Backgrounds, borders, corners and padding stay with the box itself — they're the box's own shape rather than something its contents inherit.

---

## 10g. Sloped and curved section edges

Sections don't have to meet in a straight line. Select one → **Design → Arrange → Edge shape**, and pick a shape for its **top** and its **bottom** independently:

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

## 15. Tips, gotchas & FAQ

- **"There's an empty container/row wrapping my block."** There isn't — the structural row and the page itself are invisible scaffolding: they're never selectable and never highlight on hover, so nothing empty appears around your block. Click your block (or anywhere in its row) and you select the block itself; the only highlight you see is the block's own selection box, hugging its content.
- **"Dragging my block made it full-width."** Fixed — moving a hugging (**Fit**) block in the layout keeps it hugging wherever it lands. Only a block you've set to **Full** or **Custom** fills the row. (Nothing changes its width just by being moved.)
- **"My block box is bigger than its content."** With **Width → Fit** a block always hugs its content exactly (in the layout and when floating) — no empty stretched box. If you *want* a larger box (e.g. a tall badge), size it with **Width/Height** and use **Content position** to place the content inside it.
- **"The page shows two sections I didn't add."** That's old saved data. Click **Reset** for a clean, blank page.
- **"Text size / bold / colour didn't change my component."** Make sure you selected the exact inner piece (the card's *title*, not the card). Each piece is edited on its own.
- **Everything saves automatically** to your browser. **Reset** wipes the current site back to a blank page — use it deliberately.

---

*This page is living documentation — if the builder changed and this didn't, please flag it.*
