# 01 — Foundations (theory slides, pages 1–62)

Source: Jonas Schmedtmann, *Build Responsive Real-World Websites with HTML and CSS* — "Slides for Theory
Lectures" (Omnifood project), 404 pages. This file distils pages 1–62: Section 01 (Welcome and First Steps),
Section 02 (HTML Fundamentals), Section 03 (CSS Fundamentals) and the first lecture of Section 04 (Layouts:
Floats, Flexbox and CSS Grid Fundamentals — "The 3 Ways of Building Layouts").

Every statement below is the deck's own, with its page number in brackets. Anything added for clarity is
marked **Note:**. Each lecture ends with a **For the builder** list — what the slide means for Educo's
drag-and-drop builder, which exports HTML/CSS.

**Scope note:** the deck's table of contents (p. 2) lists "12 Using Floats", "13 box-sizing: border-box",
"14 A Flexbox Overview" and "15 A CSS Grid Overview" after "11 The 3 Ways of Building Layouts". In the page
range 1–62 only lecture 11 is present (pp. 58–61); the slides for lectures 12–15 begin after p. 62 and are
covered in the next part of this distillation. The "page layout vs. component layout" distinction *is* in this
range (p. 60).

Blank pages (no content, verified visually): pp. 3, 5, 10, 20, 25, 30, 35, 39, 42, 47, 52, 56, 62 — these are
section/lecture dividers.

---

## Deck front matter (pp. 1–2)

- Title slide: "Build Responsive Real-World Websites with HTML and CSS — Slides for Theory Lectures (don't skip
  them, they are super important)" (p. 1).
- Table of contents — the 36 theory lectures of the deck, in order (p. 2):
  1 A High-Level Overview of Web Development · 2 Watch Before You Start! · 3 Introduction to HTML ·
  4 Introduction to CSS · 5 Working With Colors · 6 CSS Theory #1: Conflicts Between Selectors ·
  7 CSS Theory #2: Inheritance and Universal Selector · 8 CSS Theory #3: The CSS Box Model ·
  9 CSS Theory #4: Types of Boxes · 10 CSS Theory #5: Absolute Positioning · 11 The 3 Ways of Building
  Layouts · 12 Using Floats · 13 box-sizing: border-box · 14 A Flexbox Overview · 15 A CSS Grid Overview ·
  16 Overview of Web Design and Website Personalities · 17 Web Design Rules #1: Typography ·
  18 Web Design Rules #2: Colors · 19 Web Design Rules #3: Images and Illustrations · 20 Web Design Rules #4:
  Icons · 21 Web Design Rules #5: Shadows · 22 Web Design Rules #6: Border-radius · 23 Web Design Rules #7:
  Whitespace · 24 Web Design Rules #8: Visual Hierarchy · 25 Web Design Rules #9: User Experience (UX) ·
  26 The Website-Personalities-Framework · 27 Web Design Rules #10 - I: Elements and Components ·
  28 Switching flex-direction to column · 29 Vertical center with absolute position and transform ·
  30 Web Design Rules #10 - II: Layout Patterns · 31 The 7 Steps to a Great Website · 32 Defining and
  Planning the Project (Steps 1 and 2) · 33 Sketching Initial Layout Ideas (Step 3) · 34 Responsive Design
  Principles · 35 How Media Queries Work · 36 How to Select Breakpoints.

---

## Section 01 — Welcome and First Steps (p. 4)

### Lecture 1 — A High-Level Overview of Web Development (pp. 6–9)

**Front-end vs. back-end development (pp. 7–8)**
- The browser sends a **request** to a **web server**, which sends back a **response** (p. 7).
- **Static website:** a website where files are simply sent to the browser as they are — `index.html`,
  `style.css`, `script.js`, `image.jpg` (p. 7). Example shown: `https://omnifood.dev` (the course project).
- HTML, CSS and JavaScript are "the 3 languages that browsers understand"; **front-end development** is "the
  process of writing" them (p. 7).
- **Dynamic website:** website files are "assembled" on the server (p. 8). Diagram: the web server works with an
  **APP** and a **DB** (database). Example shown: `https://udemy.com`.
- **Back-end development** uses back-end languages that run on **servers** — shown: Node.js, PHP, Python,
  "etc..." (p. 8).

**The 3 languages of the front-end (p. 9)** — shown as a Venn diagram of three overlapping circles:
- **HTML = CONTENT** → the **NOUNS**: `<p></p>` means "paragraph".
- **CSS = PRESENTATION** → the **ADJECTIVES**: `p {color: red}` means "the paragraph text is red".
- **JS = PROGRAMMING LANGUAGE: dynamic effects and web applications** → the **VERBS**: `p.hide();` means
  "hide the paragraph".

**For the builder**
- A builder that exports HTML/CSS produces a **static website** in the deck's sense (p. 7): the export must be
  a set of files that work when "simply sent to the browser as they are" — no server assembly required.
- Keep the three concerns separate in the export (p. 9): **content** in the HTML (nouns — what each block *is*),
  **presentation** in CSS (adjectives — how it looks), behaviour in JS only where there is a genuine dynamic
  effect (verbs). A block's look must not be baked into its markup.

### Lecture 2 — Watch Before You Start! (pp. 11–19)

Course-study advice, not technical content (pp. 12–19): don't get overwhelmed if it is your first time coding
(p. 12); code along — "You will learn ZERO HTML and CSS skills by just sitting and watching" (p. 13); take notes
on syntax, theory, everything (p. 14); try all coding challenges, watch the solution if stuck too long, rewatch
the relevant lectures and move on (p. 15); before leaving a section make sure you understand exactly what was
covered — review code, notes and projects (p. 16); with an error or question, try to solve it yourself first,
then check the Q&A, then ask a new question with a short description and code on codepen.io (p. 17); the course
was recorded on a Mac but works the same on Windows or Linux (p. 18); have fun, and if frustrated stop and come
back later (p. 19).

**For the builder**
- Nothing technical. (Note: included for completeness only.)

---

## Section 02 — HTML Fundamentals (p. 21)

### Lecture 3 — Introduction to HTML (pp. 22–24)

**What is HTML? (p. 23)**
- **H**yper**T**ext **M**arkup **L**anguage.
- HTML is a **markup language** that web developers use to **structure and describe the content** of a webpage
  (*not a programming language*).
- HTML consists of **elements** that describe different types of content: paragraphs, links, headings, images,
  video, etc.
- Web browsers understand HTML and **render HTML code as websites** (illustrated: HTML source in an editor →
  the rendered Omnifood page).

**Anatomy of an HTML element (p. 24)** — example `<p>HTML is a markup language</p>`; the whole thing is the
**element**:
- **Opening tag:** name of the element, wrapped in `<` and `>`.
- **Content:** content of the element — in this example text, "but it might be another element (**child
  element**)". Some elements have **no content** (e.g. `<img>`).
- **Closing tag:** same as the opening tag, but with a `/`. When the element has no content, it's omitted.

**For the builder**
- Each block the builder offers must map to an HTML **element that describes the kind of content it holds**
  (p. 23) — a heading block emits a heading element, a paragraph block a `<p>`, an image block an `<img>` —
  rather than a generic box that only *looks* like one.
- Blocks nest: an element's content "might be another element (child element)" (p. 24), so the exported tree
  must mirror the builder's parent/child tree.
- Empty (void) elements such as `<img>` must be emitted without a closing tag (p. 24).

---

## Section 03 — CSS Fundamentals (p. 26)

### Lecture 4 — Introduction to CSS (pp. 27–29)

**What is CSS? (p. 28)**
- **C**ascading **S**tyle **S**heets.
- CSS describes the **visual style and presentation** of the **content written in HTML**.
- CSS consists of countless **properties** that developers use to format the content: properties about font,
  text, spacing, layout, etc. (Illustrated: the unstyled Omnifood HTML → the styled page.)

**How we select and style elements — a CSS rule (p. 29)**
```css
h1 {
  color: blue;
  text-align: center;
  font-size: 20px;
}
```
- `h1` is the **selector**; everything in `{ }` is the **declaration block**.
- Each line such as `font-size: 20px;` is a **declaration / style**, made of a **property** (`font-size`) and a
  **value** (`20px`).

**For the builder**
- The export's CSS is a set of **rules**: a selector naming the block(s) plus a declaration block of
  property/value pairs (p. 29). Every styling control in the inspector corresponds to a CSS **property** and the
  value the user picks (p. 28).
- The unstyled → styled illustration (p. 28) is the separation the export must preserve: the HTML should still
  read as a sensible document with the stylesheet removed.


### Lecture 5 — Working With Colors (pp. 31–34)

**The RGB model (p. 32)**
- **RGB model:** every color can be represented by a combination of **RED, GREEN and BLUE**.
- Each of the 3 base colors can take a value between **0 and 255**, which leads to **16.8 million** different
  colors.
- Diagram (additive colour circles on black): R 255 G 0 B 0 = red; 0 255 0 = green; 0 0 255 = blue;
  255 255 0 = yellow; 255 0 255 = magenta; 0 255 255 = cyan; 255 255 255 = white; 0 0 0 = black.

**Defining colors in CSS (p. 33)**
1. **RGB / RGBA notation**
   - Regular RGB model: `rgb(0, 255, 255)`.
   - RGB with **transparency ("alpha")**: `rgba(0, 255, 255, 0.3)`.
2. **Hexadecimal notation**
   - Instead of using a scale from 0 to 255, we go from **0 to ff** (255 in hexadecimal numbers): `#00ffff`.
   - **Shorthand**, when all colors are identical pairs: `#0ff`.
- Worked example: `#f4b33f` = `rgb(244, 179, 63)`; `rgba(244, 179, 63, 0.7)` is shown overlapping a green box,
  which shows through it.
- **"In practice, we mostly use hexadecimal colors, and rgba when we need transparency."** (p. 33)
- The VS Code colour picker is shown as a tool for choosing values.

**Shades of grey (p. 34)**
- When colors in all 3 channels are the same, we get a **grey color**.
- There are **256 pure grays** to choose from.
- Examples: `rgb(0, 0, 0) / #000000 / #000`; `rgb(69, 69, 69) / #444444 / #444`; `rgb(183, 183, 183) / #b7b7b7`;
  `rgb(255, 255, 255) / #ffffff / #fff`.

**For the builder**
- Colour values reaching the export are one of these notations (p. 33); where the user sets opacity/transparency,
  the export needs an alpha-carrying form (`rgba`, per the deck) rather than a separate opacity on the whole
  block — the p. 33 example shows only the colour going translucent.
  Note: Educo's own token rule (CLAUDE.md rule 17) stores OKLCH tokens rather than hex; that is a project rule,
  not the deck's. The deck's principle that carries over is "one opaque form for solid colours, an alpha form
  when transparency is needed".
- A greys ramp is simply equal channels (p. 34) — a neutral palette can be generated rather than hand-picked.

### Lecture 6 — CSS Theory #1: Conflicts Between Selectors (pp. 36–38)

**Conflicting selectors and declarations (p. 37)** — example element
`<p id="author-text" class="author">Posted by Laura Jones on Monday, June 21st 2027</p>` targeted by three rules:
`.author { font-style: italic; font-size: 18px; }`, `#author-text { font-size: 20px; }` and
`p, li { font-family: sans-serif; color: #444444; font-size: 22px; }`.
- There are **multiple selectors** selecting the same element. Which one of them applies?
  **"All of them. All rules and properties are applied!"**
- But there are **conflicting** `font-size` declarations — is it 18px, 20px or 22px?

**Resolving conflicting declarations (p. 38)** — from highest to lowest priority:
- **5 — Declarations marked `!important`** (highest priority)
- ↓ no `!important`? → **4 — Inline style** (`style` attribute in HTML)
- ↓ no inline style? → **3 — ID (`#`) selector**
- ↓ no `#` selector? → **2 — Class (`.`) or pseudo-class (`:`) selector**
- ↓ no `.` or `:` selector? → **1 — Element selector** (`p`, `div`, `li`, etc.)
- ↓ no element selector? → **0 — Universal selector (`*`)** (lowest priority)
- At levels 3, 2 and 1: **Multiple? → the last selector in code applies** \*.
- In the example, there is an ID selector (`#author-text`), so for the conflicting `font-size` property this is the
  selector that applies (20px). The non-conflicting declarations (italic, sans-serif, #444444) still apply.
- \* "It's a bit more complicated in reality" (p. 38).

**For the builder**
- The export must be written so that the value the user set **wins predictably**. The deck's ladder (p. 38)
  means: a user's per-block style must not be silently beaten by a higher-priority layer — an inline `style`
  attribute (level 4) or an `!important` (level 5) in the builder's own base CSS would override anything the
  user sets at class level.
  Note: Educo's memory records exactly this trap (inline beats any stylesheet; unlayered CSS beats Tailwind
  utilities) in `reference_css_cascade_traps.md`.
- When two rules of equal priority target the same block, the **later one in the code wins** (p. 38) — so the
  export's rule order is significant: base/defaults first, per-block and per-breakpoint overrides after.
- Non-conflicting declarations from every matching rule all apply (p. 37): a block inherits everything from its
  shared class and only the conflicting properties are decided by priority.


### Lecture 7 — CSS Theory #2: Inheritance and the Universal Selector (pp. 40–41)

**How inheritance works (p. 41)** — example: `body { color: #444444; font-size: 16px; font-family: sans-serif;
border-top: 10px solid #1098ad; }` with `<nav>`, `<h1>` and `<p>` children.
- The **parent element** (`<body>`) passes its `color`, `font-size` and `font-family` down to `<nav>`, `<h1>` and
  `<p>`.
- **The `border` property does NOT get inherited** (the `border-top` on `body` stays on `body`).
- **Overriding inherited styles:** `h1 { color: #1098ad; font-size: 32px; text-transform: uppercase; }` — the h1's
  own `color` and `font-size` replace the inherited ones (shown struck through), while it still inherits
  `font-family: sans-serif`.
- **"Not all properties get inherited. It's mostly ones related to text:** `font-family`, `font-size`,
  `font-weight`, `font-style`, `color`, `line-height`, `letter-spacing`, `text-align`, `text-transform`,
  `text-shadow`, `list-style`, etc." (p. 41)
- Note: the universal selector (`*`) named in this lecture's title has no dedicated slide in this range; the only
  slide statement about it is its place at the bottom of the conflict ladder — "0 Universal selector (*)",
  lowest priority (p. 38).

**For the builder**
- **Typography belongs on the container and flows down** (p. 41): set text properties (font family, size,
  weight, style, colour, line-height, letter-spacing, alignment, transform, text-shadow, list-style) on a
  page/section/container and let children inherit them; a child sets its own value only to override.
  Note: Educo already has this rule ("typography cascades from any container", `feedback_twelve_columns.md`).
- **Box properties do not inherit** (p. 41): borders (and, per the box-model lecture, padding/margins/backgrounds)
  must be set per block — the export must not rely on them passing to children, and the inspector should not
  imply they do.
- Because inherited values are the lowest-effort way to style, the export should emit base text styles once on
  `body`/the page root rather than repeating them on every block.

### Lecture 8 — CSS Theory #3: The CSS Box Model (pp. 43–46)

**The CSS box model (p. 44)** — diagram: content (with **width** and **height**) → **padding** → **border** →
**margin** (dashed outer line). The border edge is labelled "**Visible part of element on the page**".
- **Content:** text, images, etc.
- **Border:** a line around the element, still **inside** of the element.
- **Padding:** invisible space around the content, **inside** of the element.
- **Margin:** space **outside** of the element, between elements.
- **Fill area:** area that gets filled with **background color** or **background image** — in the diagram it
  covers content + padding, up to the border.

**Analogy (p. 45)** — a framed picture on a wall: the drawing is the **content area**; the white mat around it is
the **padding**; the frame is the **border**; the wall space between the frame, the lamp above and the shelf below
is the **margin**.

**Element height and width calculation (p. 46)**
- **Final element width = left border + left padding + width + right padding + right border.**
- **Final element height = top border + top padding + height + bottom padding + bottom border.**
- We can specify all these values using CSS properties.
- **This is the default behavior, but we can change it.** (Note: the change is the later lecture
  "13 box-sizing: border-box", outside this page range.)
- Margin is not part of the final element size (the diagram draws it outside the measured box).

**For the builder**
- Every block has the same four layers (p. 44) and the inspector should expose them as distinct controls:
  **padding** (inner spacing, inside the fill), **border**, **margin** (outer spacing, between blocks), and a
  **background** that fills content + padding.
  Note: Educo's "inner spacing per side / outer spacing per side" controls are exactly padding and margin.
- A background colour or image paints **under the padding too** (p. 44) — to give content breathing room inside a
  coloured block, the builder must use padding, not margin.
- With the default model (p. 46), adding padding or a border to a block of a given width makes it **wider** than
  the width the user set. A builder where "the size you drag is the size you get" therefore needs the default
  changed (`box-sizing: border-box`, the deck's next-part lecture) — otherwise every padding change resizes the
  block.

### Lecture 9 — CSS Theory #4: Types of Boxes (pp. 48–51)

**Block-level elements (p. 49)**
- Elements are formatted visually as **blocks**.
- Elements occupy **100% of parent element's width, no matter the content**.
- Elements are **stacked vertically** by default, one after another.
- The box-model **applies as showed** earlier.
- **Default elements:** `body`, `main`, `header`, `footer`, `section`, `nav`, `aside`, `div`, `h1`–`h6`, `p`,
  `ul`, `ol`, `li`, etc. **With CSS:** `display: block`.
- Illustration: a blog post in which the heading, the "Posted by…" line, each paragraph, the sub-heading and
  each list item are outlined as full-width boxes stacked one under another.

**Inline elements (p. 50)**
- Occupies **only the space necessary for its content**.
- Causes **no line-breaks** after or before the element.
- Box model applies in a different way: **heights and widths do not apply**.
- **Paddings and margins are applied only horizontally** (left and right).
- **Default elements:** `a`, `img`, `strong`, `em`, `button`, etc. **With CSS:** `display: inline`.
- Illustration: in the same blog post, only the author image, the bold author name, the large image, the
  italic word "fundamental" and the "MDN Web Docs" link are outlined, each sitting within its line.

**Summary: inline, block-level and inline-block boxes (p. 51)**

| Block-level boxes | Inline-block boxes | Inline boxes |
|---|---|---|
| Elements formatted visually as blocks | Looks like **inline from the outside**, behaves like **block-level on the inside** | Occupies only content's space |
| 100% of parent's width | Occupies only content's space | Causes no line-breaks |
| Vertically, one after another | Causes no line-breaks | Box model is different: heights and widths do not apply |
| Box-model applies as showed | Box-model applies as showed | Paddings and margins only horizontal (left and right) |
| | `display: inline-block` | |

The slide's arrows show inline-block taking "occupies only content's space" and "causes no line-breaks" from
inline boxes, and "box-model applies as showed" from block-level boxes (p. 51).

**For the builder**
- A block dropped on the page is **block-level by default** (p. 49): full width of its parent, stacked under the
  previous one. That is the builder's normal-flow default and needs no layout CSS.
- Content blocks should emit the semantic block elements the deck lists (p. 49) — `header`, `footer`, `main`,
  `section`, `nav`, `aside`, `h1`–`h6`, `p`, `ul`/`ol`/`li` — with `div` only as the generic box.
- **Inline items ignore width, height and vertical padding/margin** (p. 50). Any item the user can size or pad
  that is inline by default — the deck lists `a`, `img`, `button` — must be exported as `inline-block` or `block`
  (p. 51), or the inspector control silently does nothing.
- **`inline-block`** (p. 51) is the tool for "sits in the line of text but can be sized and padded" — e.g. a
  button or badge inside a paragraph.

### Lecture 10 — CSS Theory #5: Absolute Positioning (pp. 53–55)

**Normal flow vs. absolute positioning (p. 54)**

| Normal flow | Absolute positioning |
|---|---|
| Default positioning | Element is removed from the normal flow: **"out of flow"** |
| Element is **"in flow"** | **No impact on surrounding elements, might overlap them** |
| Elements are simply laid out according to their order in the HTML code | We use `top`, `bottom`, `left`, or `right` to offset the element from its **relatively positioned container** |
| Code box: "Default positioning — `position: relative`" | `position: absolute` |

Note: the slide's code box pairs "Default positioning" with `position: relative`. (Outside knowledge, flagged so it
is not misread: CSS's initial value is `static`; `relative` is what the deck puts on the *container* so that it
becomes the reference box, p. 55.)

**Understanding absolute positioning (p. 55)**
```css
.container {
  position: relative;
  background-color: #f7e6c1;
}
.el {
  position: absolute;
  top: 100px;
  left: 200px;
  background-color: #f4b33f;
}
```
- Diagram: `.el` sits **100px** below the top edge and **200px** in from the left edge of `.container` — offsets
  are measured from the edges of the relatively positioned container.

**For the builder**
- **Free / floating placement = `position: absolute` on the block + `position: relative` on its container**
  (pp. 54–55). The export must emit `position: relative` on the parent of every absolutely positioned block, or
  its offsets are measured from some other box.
- An absolutely positioned block **has no impact on surrounding elements and might overlap them** (p. 54): its
  container will not make room for it and neighbours will not move. It is a layer, never the default for ordinary
  content, which stays in normal flow.
- In normal flow, elements are laid out "according to their order in the HTML code" (p. 54) — so the order of
  blocks in the builder's tree **is** the visual order; reordering blocks must reorder the HTML.
- The deck's offsets are in px (p. 55). Note: Educo's units rule (CLAUDE.md rule 16) requires `%` for free
  positions relative to the parent — a project rule layered on top, not the deck's.

---

## Section 04 — Layouts: Floats, Flexbox and CSS Grid Fundamentals (p. 57)

### Lecture 11 — The 3 Ways of Building Layouts (pp. 58–61)

**What does "layout" mean? (p. 59)**
- Layout is the way **text, images and other content is placed and arranged** on a webpage.
- Layout gives the page a **visual structure**, into which we place our content.
- **Building a layout:** arranging page elements into a visual structure, **instead of simply having them placed
  one after another (normal flow)**.
- Illustration: the "Clippings" homepage with its regions outlined — a nav bar across the top; a hero with a
  headline + buttons on the left and a photo on the right; a product-image collage beside a "Find furniture for
  every type of project" feature panel; a "We work with… Interior designers" heading beside a project photo card.

**Page layout vs. component layout (p. 60)**
- **Page layout** — the same outlined Clippings page: the arrangement of the page's big regions.
- **Component layout** — an arrow zooms into one region, the "Find furniture" panel: four features in a 2 × 2
  arrangement, each an **icon** beside a **title** with a **description** below ("650+ brands", "Trade pricing",
  "Source from anywhere", "Free samples"), every piece outlined.
- So layout happens at two levels: the page is laid out into regions, and each component lays out its own parts.

**The 3 ways of building layouts with CSS (p. 61)**
1. **Float layouts** — "The **old way of building layouts** of all sizes, using the `float` CSS property. Still
   used, but getting outdated fast." (Icon: three cells with arrows pushing left-to-right.)
2. **Flexbox** — "Modern way of laying out elements in a **1-dimensional row** without using floats. Perfect for
   **component layouts**." (Icon: three boxes on one horizontal arrow.)
3. **CSS Grid** — "For laying out element in a fully-fledged **2-dimensional grid**. Perfect for **page layouts
   and complex components**." (Icon: boxes across two rows and columns, arrow going right then down.)

**For the builder**
- Containers map onto the deck's two modern tools (p. 61): **items along one axis (a row or a stack) → flexbox**;
  **a two-dimensional arrangement (rows × columns, page regions) → CSS Grid**. Floats are not used to build
  layout — "getting outdated fast".
- Keep **page layout** and **component layout** as distinct levels (p. 60): sections/regions arranged by a
  page-level grid; each component (feature list, card, nav bar) arranges its own parts internally. A component's
  layout nested inside a page region is the normal case.
- With no layout applied, blocks fall back to **normal flow** — one after another (p. 59). Every other arrangement
  is a layout the user chose.

---

## Appendix — slides seen just past this range (pp. 63–70)

The part file for pp. 61–70 was opened in full. These slides belong to the next lectures (outside pages 1–62);
they are recorded here only because they were seen, and the next part of the distillation covers them properly.
Pages 62, 65 and 68 are blank; pp. 63, 66, 69 are lecture title slides.

- **Lecture 12 — Using Floats: "Absolute positioning vs. floats" (p. 64).** Three columns: normal flow and
  absolute positioning as on p. 54, plus **Floats** — element is removed from the normal flow: "out of flow"
  (marked "=" against absolute positioning); **text and inline elements will wrap around the floated element**
  (marked "≠"); **the container will not adjust its height to the element**. CSS: `float: left` / `float: right`.
- **Lecture 13 — box-sizing: border-box, "The box model with box-sizing: border-box" (p. 67).** After
  `box-sizing: border-box`, the width/height arrows span to the **border**; in "Final element width = right border
  + right padding + width + left padding + left border" every term except **width** is struck out, and likewise
  every term except **height** in the height formula — the final element size is exactly the width/height set.
- **Lecture 14 — A Flexbox Overview, "What is flexbox?" (p. 70).** Flexbox is a set of related **CSS properties**
  for **building 1-dimensional layouts**; the main idea is that **empty space inside a container element can be
  automatically divided by its child elements**; it makes it easy to automatically **align items to one another**
  inside a parent container, both horizontally and vertically; it solves common problems such as **vertical
  centering** and creating **equal-height columns**; it is perfect for **replacing floats**, allowing us to write
  fewer and cleaner HTML and CSS code.

**For the builder**
- `box-sizing: border-box` (p. 67) is what makes "the size you set is the size you get" hold once padding and
  borders are added — the export should apply it to every box (see lecture 8).
- A floated item's container does not grow to contain it (p. 64); the one job floats do that the other tools do
  not is letting text wrap around an element.
- Flexbox's "empty space divided by the children" and "align items to one another" (p. 70) are the behaviours a
  builder row/stack needs: distribute leftover space, align on both axes, equal-height columns.

