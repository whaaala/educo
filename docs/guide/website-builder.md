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
- **Outline & effects** — rounded corners (all or per‑corner), border, shadow, tilt, see‑through (opacity).
- **Background** — a colour (with a full OKLCH picker, eyedropper, and *None* for transparent) or a background image.
- **Typography** — font, size, weight, capitalisation, line/letter spacing (cascades into the block's text).
- **Advanced CSS** — extra CSS declarations for power users (safely sanitised).

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
| **Each page carries only the styles it uses** | A term‑dates page of text and a table doesn't download the accordion, the alert or the rating. In practice this is around a 90% cut in styling for a simple page. |

There is **still nothing external** — no fonts, scripts or trackers fetched from anywhere else — so the site works offline and there is nothing to break later.

---

## 10b. Sections: edge to edge, or a centred column

Every section sits in a full‑width band across the page. Select the section → **Design** tab → **Arrange** → **Content width**:

- **Edge to edge** — the section and its content run the full width of the page. Right for a photo strip or a colour banner.
- **Centred column** — the **background still spans the whole page**, but the words sit in a centred column. Right for almost everything else.

That second one is the setting that makes a page look professionally made. A heading stretched across a 27‑inch monitor is genuinely hard to read — the eye loses its place coming back to the start of the next line — so the text is capped at a comfortable measure that **widens by one step** as the screen grows: a phone gets the full width less a margin, a tablet ~34rem, a large tablet ~52rem, a desktop ~68rem, a very large screen ~76rem.

On a phone the column always keeps a margin, so text never touches the edge of the screen.

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
| Deselect | Escape |

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
- **Bring the blocks inside in one after another** — on a section, its children arrive in sequence. This is how you get a row of three cards rising one after the other as a visitor scrolls to it.

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
