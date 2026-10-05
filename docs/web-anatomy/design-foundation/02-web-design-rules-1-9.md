# 02 — Layout fundamentals (end of Section 04) and Web Design Rules #1–#9 + the Website-Personalities Framework (theory slides, pages 63–221)

Source: Jonas Schmedtmann, *Build Responsive Real-World Websites with HTML and CSS* — "Slides for Theory
Lectures" (Omnifood project), 404 pages. This file distils pages 63–221: the remaining lectures of
Section 04 (Using Floats · box-sizing: border-box · A Flexbox Overview · A CSS Grid Overview, pp. 63–78) and
Section 05 "Web Design Rules and Framework" (pp. 80–221, continued past p. 221 in the deck — see the scope note).

**Update:** Web Design Rules #1–#8 (Typography, Colors, Images and Illustrations, Icons, Shadows,
Border-radius, Whitespace, Visual Hierarchy — text pp. 80–218) were added in a second pass, further down this
file, after the CSS Grid section. That pass was done **without slide images** (the PDF-page renderer was not
available in that session) — see its own tooling note before Rule #1.

Every statement below is the deck's own, with its page number in brackets. Anything added for clarity is
marked **Note:**. Each lecture ends with a **For the builder** list — what the slide means for Educo's
drag-and-drop builder, which exports HTML/CSS and is driven by design tokens.

**Scope note — where the page range cuts.** The assigned range ends at p. 221, which is the *second* slide of
lecture 25 (Web Design Rules #9: UX). The rest of Rule #9 (the UX goal, usability rules 1–7 and content
rules 8–11, pp. 222–233) and the whole of lecture 26 "The Website-Personalities Framework" (pp. 235–255) sit
*after* p. 221. Because this file was asked to cover Rule #9 and the Personalities framework, those pages are
distilled here as well, clearly headed **(pp. 222–255 — beyond the assigned range)** so the next part of this
distillation can skip them. Pages 222–255 were read from the extracted text and viewed where noted.

**How the slides were checked.** Every page in 63–221 was opened as an image (the deck was split into
single-page PDFs so each slide renders). Many slides are *builds*: the same slide repeated with one more
numbered point, or with a different real-site screenshot illustrating the same point. Where a slide's content
is only a screenshot of a real website used as an example, that is said and what it illustrates is described —
no claim is made about details the slide does not state.

Blank pages (no content — lecture/section dividers, file size 3.5 KB, verified): pp. 65, 68, 73, 79, 93, 108,
125, 148, 161, 174, 183, 198, 218.

---

## Section 04 (end) — Layouts: Floats, Flexbox and CSS Grid Fundamentals (pp. 63–78)

### Lecture 12 — Using Floats (pp. 63–64)

Lecture title slide (p. 63). One content slide, "Absolute positioning vs. floats" (p. 64), comparing three
columns:

- **Normal flow** (p. 64): default positioning; element is "in flow"; elements are simply laid out according
  to their order in the HTML code. Code box: "Default positioning — `position: relative`".
- **Absolute positioning** (p. 64): element is removed from the normal flow: "out of flow"; no impact on
  surrounding elements, might overlap them; we use `top`, `bottom`, `left`, or `right` to offset the element
  from its **relatively positioned container**. Code box: `position: absolute`.
- **Floats** (p. 64): element is removed from the normal flow: "out of flow" (marked **=** to absolute
  positioning); text and inline elements will wrap around the floated element (marked **≠** to absolute
  positioning); the container will **not** adjust its height to the element. Code box: `float: left`,
  `float: right`.

**For the builder**
- The builder's "free / floating" placement is the absolute-positioning column: out of flow, offset from a
  relatively positioned container, and able to overlap. A positioned child therefore needs its container to be
  a positioning context — the export must emit that, not rely on the canvas.
- Floats are not a layout tool the builder should emit for page structure: a floated child does not give its
  container height (p. 64). Wrapping text around an image is the one behaviour floats have that absolute
  positioning does not.

### Lecture 13 — box-sizing: border-box (pp. 66–67)

Title slide (p. 66). "The box model with box-sizing: border-box" (p. 67):

- Default model: final element width = right border + right padding + width + left padding + left border;
  final element height = top border + top padding + height + bottom padding + bottom border (p. 67).
- With `box-sizing: border-box` the diagram shows `width`/`height` spanning to the border, and the slide
  crosses out every border and padding term: **final element width = width**, **final element height =
  height** (p. 67).

**For the builder**
- The size a user drags must be the size they get: emit `box-sizing: border-box` globally so adding padding or
  a border to a block never changes its outer width/height.

### Lecture 14 — A Flexbox Overview (pp. 69–72)

Title slide (p. 69). "What is Flexbox?" (p. 70):

- Flexbox is a set of related CSS properties for **building 1-dimensional layouts**.
- The main idea behind flexbox is that empty space inside a container element can be **automatically
  divided** by its child elements.
- Flexbox makes it easy to automatically **align items to one another** inside a parent container, both
  horizontally and vertically.
- Flexbox solves common problems such as **vertical centering** and creating **equal-height columns**.
- Flexbox is perfect for **replacing floats**, allowing us to write fewer and cleaner HTML and CSS code.

"Flexbox terminology" (p. 71): flex container (`display: flex`), flex items, **main axis** (horizontal arrow),
**cross axis** (vertical arrow).

Property reference (p. 72) — defaults in bold on the slide:

| Flex **container** | Purpose (p. 72) |
|---|---|
| 1 `gap: 0 \| <length>` | To create **space between items**, without using `margin` |
| 2 `justify-content: flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | To align items along main axis (**horizontally**, by default) |
| 3 `align-items: stretch \| flex-start \| flex-end \| center \| baseline` | To align items along cross axis (**vertically**, by default) |
| 4 `flex-direction: row \| row-reverse \| column \| column-reverse` | To define which is the **main axis** |
| 5 `flex-wrap: nowrap \| wrap \| wrap-reverse` | To allow items to **wrap into a new line** if they are too large |
| 6 `align-content: stretch \| flex-start \| flex-end \| center \| space-between \| space-around` | Only applies when there are **multiple lines** (`flex-wrap: wrap`) |

| Flex **items** | Purpose (p. 72) |
|---|---|
| 1 `align-self: auto \| stretch \| flex-start \| flex-end \| center \| baseline` | To **overwrite** `align-items` for individual flex items |
| 2 `flex-grow: 0 \| <integer>` | To allow an element **to grow** (0 means no, 1+ means yes) |
| 3 `flex-shrink: 1 \| <integer>` | To allow an element **to shrink** (0 means no, 1+ means yes) |
| 4 `flex-basis: auto \| <length>` | To define an item's width, **instead of the `width` property** |
| 5 `flex: 0 1 auto \| <int> <int> <len>` | **Recommended** shorthand for flex-grow, -shrink, -basis |
| 6 `order: 0 \| <integer>` | Controls order of items. -1 makes item **first**, 1 makes it **last** |

**For the builder**
- A row/stack block is a flex container; its controls map one-to-one to p. 72: gap, justify (main axis),
  align (cross axis), direction, wrap, and per-child align-self / grow / shrink / basis / order.
- Spacing between children is `gap`, not margins (p. 72) — consistent with the builder's `gap: 0` default that
  the user raises deliberately.
- A child's width in a row should be emitted as `flex-basis` (via the `flex` shorthand, p. 72), not `width`.
- Equal-height columns and vertical centring come free from flexbox (p. 70); the builder should not need
  wrappers or JS for them.

### Lecture 15 — A CSS Grid Overview (pp. 74–78)

Title slide (p. 74). "What is CSS Grid?" (p. 75):

- CSS Grid is a set of CSS properties for **building 2-dimensional layouts**.
- The main idea behind CSS Grid is that we **divide a container element into rows and columns** that can be
  filled with its child elements.
- In two-dimensional contexts, CSS Grid allows us to write **less nested HTML** and **easier-to-read CSS**.
- CSS Grid is **not meant to replace flexbox**! Instead, they work perfectly together. Need a **1D** layout?
  Use flexbox. Need a **2D** layout? Use CSS Grid.

"Basic CSS Grid terminology" (p. 76): grid container (`display: grid`), grid items, **row axis** (horizontal),
**column axis** (vertical).

"More CSS Grid terminology" (p. 77): grid lines (numbered 1–4 across, 1–3 down in the example), gutters
(gaps), grid track/row, grid track/column, grid cell ("might be filled by a grid item or not").

Property reference (p. 78) — defaults in bold on the slide:

| Grid **container** | Purpose (p. 78) |
|---|---|
| 1 `grid-template-rows: <track size>*` / `grid-template-columns: <track size>*` | To establish the grid **row and column tracks**. One length unit for each track. Any unit can be used, new **fr** fills unused space |
| 2 `row-gap: 0 \| <length>` / `column-gap: 0 \| <length>` → `gap: 0 \| <length>` | To **create empty space** between tracks |
| 3 `justify-items: stretch \| start \| center \| end` / `align-items: stretch \| start \| center \| end` | To align items inside rows / columns (**horizontally** / **vertically**) |
| 4 `justify-content: start \| start \| center \| end \| ...` / `align-content: start \| ...` | To align entire **grid inside grid container**. Only applies if container is larger than the grid |

| Grid **items** | Purpose (p. 78) |
|---|---|
| 1 `grid-column: <start line> / <end line> \| span <number>` / `grid-row: ...` | To **place a grid item** into a specific cell, based on line numbers. `span` keyword can be used to span an item across more cells |
| 2 `justify-self: stretch \| start \| center \| end` / `align-self: ...` | To **overwrite** `justify-items` / `align-items` for single items |

"This list of CSS Grid properties is not exhaustive, but enough to get started." (p. 78)

**Note:** the slide prints `justify-content: start | start | center | end | ...` with "start" twice; reproduced
as printed.

**For the builder**
- The rule of thumb for which container a block becomes: 1D → flex (row/stack), 2D → grid (p. 75).
- Grid gaps are separate for rows and columns (p. 78) — the builder's "gap across / gap down" controls are
  exactly `column-gap` / `row-gap`, both defaulting to 0.
- Track sizes in `fr` fill unused space (p. 78); a cell's placement/span is `grid-column` / `grid-row` with
  line numbers or `span`.
- An empty grid cell is legitimate ("might be filled by a grid item or not", p. 77) — the builder must not
  treat an unfilled cell as an error.

---

## Section 05 — Web Design Rules #1–#8 (pp. 80–218)

**Tooling note for this part of the distillation:** the PDF-page-image renderer (`pdftoppm`/poppler) is not
installed in this environment, so no slide image could be opened for pp. 80–218 — every statement below comes
from the extracted text only. Where a slide is a numeric diagram (the type-scale ladder, the whitespace-px
diagram, the shadow-depth diagram) the numbers below are exactly what the text layer prints, but their
precise visual arrangement (which number sits on which sample) is marked **Note: not verified from the slide
image**. Page numbers are cited as "(text p. N)" throughout this section for the same reason. Rules build up
cumulatively slide-by-slide (each new slide repeats the previous numbered points and adds the next one); only
the final, cumulative wording of each numbered rule is kept here, once.

Section 05 title slides (pp. 80–84): "WEB DESIGN RULES AND FRAMEWORK", intro copy: **"Web designers create
the overall look and feel of a website"**; a "GOOD DESIGN" panel: *"Good web design makes users believe the
brand doesn't [cut short in the extracted text] / Everyone can learn [good web design]"*. An overview slide
(text p. 85) lists the rule set as two columns, of which only "1 Typography" and "6 Border-radius" survived
extraction cleanly — consistent with the gallery index (file 03, p. 261) which separately confirms the full
numbered set 1–10 (Typography, Colors, Images and Illustrations, Icons, Shadows, Border-radius, Whitespace,
Visual Hierarchy, UX, Elements and Components).

### Web Design Rule #1 — Typography (text pp. 95–107)

**"USE GOOD TYPEFACES"** (text pp. 95–98):
1. **Use only good and popular typefaces and play it safe** (text p. 97). A **SERIF** list is shown: Merriweather,
   Aleo, Playfair Display, Cormorant, Cardo, Lora. A "TOOLBOX" note points to the deck author's own resources
   page (jonas.io) for a full tool list.
2. **It's okay to use just one typeface per page! If you want more, limit to 2 typefaces** (text p. 97).
3. **Choose the right typeface according to your website personality** (text p. 97), by: (a) choosing the right
   personality for the website first (see the Personalities framework), (b) deciding between a serif and a
   sans-serif typeface, (c) experimenting with all the "good" typefaces (and others from Google Fonts) to see
   which fits the website's message — "this will come with experience" — and (d) continuing to try different
   typefaces while designing and building the page.

**"USE GOOD FONT SIZES AND WEIGHTS"** (text pp. 99–101):
4. **When choosing font sizes, limit your choices! Use a "type scale" tool or other pre-defined range**
   (text p. 99). The slide's own example is captioned **"Adapted from a Minor Third 1.2 type scale with base
   10px"** and shows a ladder of sizes tied to samples of text: **16px, 18px, 20px, 24px, 32px, 42px, 64px
   (weight 700), 85px (weight 700)** appear on the slide (text p. 100). **Note: not verified from the slide
   image** — the extracted text does not preserve which px value labels which specific sample line, only that
   these are the values present.
5. **Use a font size between 16px and 32px for "normal" text** (text p. 100).
6. **For long text (like a blog post), try a size of 20px or even bigger** (text p. 100).
7. **For headlines, you can go really big (50px+) and bold (600), depending on personality** (text p. 100).
8. **For any text, don't use a font weight under 400 (regular)** (text p. 100).

**"CREATE A GOOD READING EXPERIENCE"** (text pp. 102–107):
9. **Use less than 75 characters per line** (text p. 102). Sample line-length figures appear on the slide: 65,
   72, 95, 110, 112 characters (text p. 102) — shown as a spread of good and bad examples; **Note: not verified
   from the slide image** which of these are marked good vs. too long, beyond rule 9's "less than 75" cutoff.
10. **For normal-sized text, use a line height between 1.5 and 2. For big text, go below 1.5. The smaller or
    longer the text, the larger the line-height needs to be!** (text p. 103). Sample line-height values shown:
    1.2, 1.31, 1.5, 1.52, 2, 2.2 (text p. 103).
11. **Decrease letter spacing in headlines, if it looks unnatural** (this comes from experience) (text p. 104).
    A pixel pair "3.5px / 0px" appears beside this rule on the slide (text p. 104) — **Note: not verified from
    the slide image** what those two values are labelling.
12. **Experiment with all caps for short titles. Make them small and bold and decrease letter-spacing**
    (text p. 105). (An earlier build of the same slide says "increase letter-spacing"; the final, cumulative
    wording on the later slide says "decrease" — both are recorded here since the text layer shows both.)
13. **Usually, don't justify text** (text p. 106).
14. **Don't center long text blocks. Small blocks are fine** (text p. 107).

**For the builder**
- Font-size choices are a **type-scale token**, not a free px input: the builder's text styles should offer a
  small, named ladder (a Minor-Third-style scale is the deck's own example, base 10px) rather than an open
  number field (rule 4).
- Body text token range 16–32px (rule 5); a "long-form/article" text style defaults to ≥20px (rule 6); heading
  styles default to 50px+ and weight ≥600 (rule 7); no text style may go under weight 400 (rule 8).
- Line-length: a text/paragraph block's measure should be capped so it renders under ~75 characters per line
  at its default width (rule 9) — this is a container **max-width** constraint tied to the font-size token, not
  a fixed pixel.
- Line-height is a token that scales inversely with font size: ~1.5–2 for body sizes, dropping below 1.5 as
  size grows (rule 10) — the type-scale should carry a paired line-height per step, not one global value.
- Letter-spacing, all-caps, text-align (justify/center) should be per-style toggles on a text block, off by
  default per rules 11–14 (no justify, no centering of long blocks, decreased tracking only on short
  all-caps titles).
- Rule 3's own process (pick a personality → pick serif/sans → try Google Fonts) is exactly the seven-
  ingredient personality flow already documented in file 03 Part 2 — Typography is ingredient #1 of that list.

### Web Design Rule #2 — Colors (text pp. 109–124)

**"CHOOSE THE RIGHT COLOR"** (text pp. 109–115):
1. **Make the main color match your website's personality: colors convey meaning!** (text p. 109). The slide's
   own colour-meaning list: **Red** draws a lot of attention, symbolizes power, passion and excitement.
   **Orange** is less aggressive, conveys happiness, cheerfulness and creativity. **Yellow** means joy,
   brightness and intelligence. **Green** represents harmony, nature, growth and health. **Blue** is associated
   with peace, trustworthiness and professionalism. **Purple** conveys wealth, wisdom and magic. **Pink**
   represents romance, care and affection. **Brown** is associated with nature, durability and comfort.
   **Black** symbolizes power, elegance and minimalism, but also grief and sorrow.
2. **Use a good color tone! Don't choose a random tone or CSS named colors** (text p. 111). A "TOOLBOX" note
   points to a colour tool (no name captured in the text layer).

**"ESTABLISH A COLOR SYSTEM"** (text pp. 112–114):
3. **You need at least two types of colors in your color palette: a main color and a grey color** (text p. 112).
   Diagram: **MAIN · ACCENT · GREY** as the three palette roles, drawn as a "COLOR PALETTE" swatch group.
4. **With more experience, you can add more colors: accent (secondary) colors (use a tool)** (text p. 112).
5. **For diversity, create lighter and darker "versions" (tints and shades)** (text p. 113) — labelled
   **TINTS ("lighter")** and **SHADES ("darker")** either side of the palette swatches on the slide; a
   "TOOLBOX" note names **palleton.com**.

**"WHEN AND HOW TO USE COLORS"** (text pp. 115–117):
6. **Use your main color to draw attention to the most important elements on the page** (text p. 115).
7. **Use colors to add interesting accents or make entire components or sections stand out** (text p. 116).
8. **You can try to use your color strategically in images and illustrations** (text p. 117).

**"COLORS AND TYPOGRAPHY"** (text pp. 118–121):
9. **On dark colored backgrounds, try to use a tint of the background ("lighter version") for text** (text p. 118).
10. **Text should usually not be completely black. Lighten it up — it looks heavy and uninviting** (text p. 119).
11. **Don't make text too light! Use a tool to check contrast between text and background colors. Contrast
    ratio needs to be at least 4.5:1 for normal text and 3:1 for large text (18px+)** (text p. 120). Four
    sample ratios appear on the slide: **13:1, 5.1:1, 2.9:1, 2.9:1** (text p. 120) — **Note: not verified from
    the slide image** which sample pairs pass and which fail rule 11's 4.5:1/3:1 thresholds, beyond the two
    2.9:1 examples clearly falling under both.

**For the builder**
- The colour system is exactly **Main · Accent · Grey**, each with generated **tints and shades** (rules 3–5)
  — this matches the project's OKLCH token system (rule 17 in `CLAUDE.md`) almost exactly; a palette editor
  should default new palettes to that three-role structure, never a single flat swatch list.
- No raw CSS named colors and no ad-hoc random tone (rule 2) — the builder should only let a user pick from
  the generated palette (base + tints/shades) or start from a picked "main colour" that derives the rest.
  This is the deck's own justification for the project's "no hardcoded hex" rule.
  colour to draw attention (rules 6–7); everything else stays neutral/grey. Component "highlight" states
  (pricing-table featured plan, CTA sections) map to rule 7's "make entire components stand out."
- On a dark background, text colour should switch to a **tint of that background**, not pure white (rule 9);
  general body text should default to a dark **tint** rather than pure black (rule 10).
- Contrast must be **checked, not assumed** (rule 11, and `CLAUDE.md` rule 17's "Contrast is ASSERTED, not
  assumed") — **4.5:1 normal text / 3:1 large text (18px+)** are the exact thresholds to gate on, including
  text laid over a photo the user picked.

### Web Design Rule #3 — Images and Illustrations (text pp. 126–148)

**"USE GOOD IMAGES"** (text pp. 126–130):
1. **Different types of images: product photos, storytelling photos, illustrations, patterns** (text p. 126).
2. **Use images to support your website's message and story. So only use relevant images!** (text p. 127).
3. **Prefer original images. If not possible, use original-looking stock images (not generic ones!)** (text
   p. 128) — contrasted on the slide as "professional photographer" / "high-quality stock photo" vs. a
   "generic-looking stock photo." A "TOOLBOX" note: "Use images from here instead (for free)" — pointing to a
   free-stock-photo resource (no URL captured in the text layer).

**"USE IMAGES WELL"** (text pp. 130–132):
4. **Try to show real people to trigger user's emotions** (text p. 130).
5. **If necessary, crop images to fit your message** (text p. 131).
6. **Experiment combining photos, illustrations and patterns** (text p. 131).

**"HANDLING TEXT ON IMAGES"** (text pp. 132–133):
7. **Method #1 — Darken or brighten image (completely or partially, using a gradient)** (text p. 132).
8. **Method #2 — Position text into a neutral image area** (text p. 132).
9. **Method #3 — Put text in a box** (text p. 133).

**"SOME TECHNICAL DETAILS"** (text pp. 133–136):
10. **To account for high-res screens, make image dimensions 2x as big as their displayed size** (text
    p. 133). The slide defines **scale factor = actual pixels the screen contains / pixels represented on
    screen**; on "normal" screens scale factor is 1x (1 physical pixel = 1 design pixel), on high-res screens
    it is 2x or even 3x. Worked numeric example: a 300×300px visible area needs a 600×600px original image at
    2x (text p. 133); the counter-example shows a 300×300px original stretched to fill a 300×300px visible
    area at 1x looking "okay on low-res screen" but "blurry ... on high-res screen" when the original wasn't
    doubled (text p. 134).
11. **Compress images for a lower file size and better performance** (text p. 135). A "TOOLBOX" note points to
    a compression tool (no name captured in the text layer).
12. **When using multiple images side-by-side, make sure they have the exact same dimensions** (text p. 136).

**For the builder**
- The Image block's alt-text / caption / "purpose" metadata should distinguish product vs. storytelling vs.
  illustration vs. pattern (rule 1), so the palette and any future AI-fill can pick the right kind for a slot.
- An uploaded image should be checked against "generic stock" heuristics is out of scope, but the builder
  should default to **not** stretching/cropping an image in a way that looks generic — respecting the user's
  original crop (rule 3).
- The three text-over-image techniques (darken/brighten with gradient, neutral-area placement, boxed text)
  are exactly the three "text-over-image" presets an Image/Hero block should ship (rules 7–9).
- Export must **always emit images at ≥2x their displayed size** (or serve `srcset`/`2x` variants) — a bare
  1x export is the deck's own definition of a blurry image on high-res screens (rule 10). This is a concrete,
  numeric export requirement: displayed 300×300 needs a ≥600×600 source.
- Image compression is a build/export step, not optional (rule 11) — the exporter should run images through
  compression before publish.
- A repeated Gallery/row-of-images layout must keep every image at identical dimensions (rule 12) — this maps
  onto the Gallery component (B5) and a Grid-of-cards layout pattern (D2).

### Web Design Rule #4 — Icons (text pp. 149–161)

**"USE GOOD ICONS"** (text pp. 149–152):
1. **Use a good icon pack, there are tons of free and paid icon packs** (text p. 149). Named on the slide:
   **Phosphor icons**; a note that "you can just use emojis too."
2. **Use only one icon pack. Don't mix icons from different icon packs** (text p. 150) — illustrated by two
   icons captioned "This icon has a completely different style: filled and boxy/squared."
3. **Use SVG icons or icon fonts. Don't use bitmap image formats (.jpg and .png)!** (text p. 151) — contrasted
   as **BITMAP** ("regular images": JPG, PNG, GIF — "do not scale, become unsharp") vs. **VECTOR BASED** (SVG
   images and icon fonts — "scale indefinitely").
4. **Adjust to website personality! Roundness, weight and filled/outlined depend on typography** (text p. 152).

**"WHEN TO USE ICONS"** (text pp. 152–155):
5. **Use icons to provide visual assistance to text** (text p. 152).
6. **Use icons for product feature blocks** (text p. 153).
7. **Use icons associated with actions, and label them (unless there's no space or the icon is 100% clear)**
   (text p. 154) — a caption on the slide flags a bad example: "Some elements are text, others are unlabeled
   icons..."
8. **Use icons as bullet points** (text p. 155).

**"USE ICONS WELL"** (text pp. 155–158):
9. **To keep icons neutral, use the same color as text. To draw more attention, use a different color**
   (text p. 155).
10. **Don't confuse your users: icons need to make sense and fit the text or action!** (text p. 156).
11. **Don't make icons larger than what they were designed for. If needed, enclose them in a shape** (text
    p. 157) — captioned "Icons were designed for big use: lots of details, thin lines" (i.e. scaling a
    detailed icon down past its design size loses legibility; wrap it in a shape/badge instead of blowing it
    up or shrinking it raw).

**For the builder**
- Icon assets must be **SVG (or an icon font), never a raster bitmap** (rule 3) — this is already how the
  project's Component Registry treats icons (per memory: "icons = inline SVG currentColor + em sizing"),
  confirmed as a MUST-FOLLOW rule from the source deck, not just a project convention.
- A site/personality preset locks the icon set to **one pack** (rule 2) and one style (filled/outlined,
  rounded/boxy — matched to the typeface, rule 4); the icon palette in the builder should filter to the active
  pack, not offer every pack mixed together.
- Icon colour should default to `currentColor` (same as the surrounding text, rule 9), with an explicit accent
  colour as an opt-in override to draw attention — never a hardcoded icon colour.
- Any icon used as an action control (a button/link icon) needs a visible text label unless space truly
  doesn't allow it or the icon is unambiguous (rule 7) — this is an accessibility-relevant rule the builder's
  a11y checklist should assert on icon-only buttons (pair with an `aria-label` at minimum).
- An icon has a natural size; enlarging it should size it inside a badge/shape rather than stretching the
  glyph itself (rule 11) — the builder's icon control should offer a "badge" wrapper for large sizes rather
  than an unbounded font-size scale on the raw glyph.

### Web Design Rule #5 — Shadows (text pp. 162–174)

**"SOME CONCEPTS FIRST..."** (text pp. 162–163):
- **After an era of 100% flat design, we're now back to using shadows in UI design ("flat design 2.0")**
  (text p. 162) — a three-stage diagram: **SKEUOMORPHIC DESIGN → FLAT DESIGN (minimal) → FLAT DESIGN 2.0**
  ("still minimal, but brings back shadows and depth for better usability").
- **Shadow creates depth (3D): the more shadow, the further away from the interface the element is**
  (text p. 163). A "3D VIEW" / "FRONT VIEW" / "SIDE VIEW" diagram plots sample shadow sizes **2px, 6px, 12px,
  24px** against "distance from screen/interface" (text p. 163) — **Note: not verified from the slide image**
  exactly which px value the diagram assigns to which depth step, beyond the ascending order 2 → 6 → 12 → 24.
  A caption notes "shadow can be used on boxes and text."

**"USE SHADOWS WELL"** (text pp. 164–166):
1. **You don't have to use shadows! Only use them if it makes sense for the website personality** (text
   p. 164) — contrasted as "less shadows" for **Serious/Elegant** vs. "more shadows" for **Playful/Fun**
   (matching the personality tables in file 03 Part 2, which record shadows as "usually no shadows" for
   Serious/Elegant, Minimalist/Simple, Plain/Neutral and Bold/Confident, and "subtle"/"frequent" for
   Calm/Peaceful, Startup/Upbeat and Playful/Fun).
2. **Use shadows in small doses: don't add shadows to every element!** (text p. 165).
3. **Go light on shadows, don't make them too dark!** (text p. 166).

**"USE SHADOWS IN THE RIGHT SITUATION"** (text pp. 166–169):
4. **Use small shadows for smaller elements that should stand out (to draw attention)** (text p. 166).
5. **Use medium-sized shadows for larger areas that should stand out a bit more** (text p. 167).
6. **Use large shadows for elements that should really float above the interface** (text p. 168).
7. **Experiment with changing shadows on mouse interaction (click and hover)** (text p. 169) — captioned:
   "Normal → Hover: medium-sized shadow 'pulls' button closer to the user" and "→ Click: smaller shadow
   'pushes' button back into the interface."
8. **Bonus: Experiment with glows (colored shadows)** (text p. 169).

**For the builder**
- Shadows are a **token scale** with at least three named steps — small / medium / large (rules 4–6) — tied
  to element size and intended "elevation," not a free blur/spread input; this matches the project's shadow
  token requirement (`CLAUDE.md` rule 17).
- Shadow use is **opt-in per personality** (rule 1): the personality preset (file 03 Part 2) should set the
  shadow token to "off" for Serious/Elegant, Minimalist/Simple, Plain/Neutral, Bold/Confident, and to
  "subtle" for Calm/Peaceful/Startup/Upbeat/Playful/Fun, exactly as those tables already say.
- Interaction states (hover = shadow grows/"pulls forward", active/click = shadow shrinks/"pushes back", rule
  7) should be built into the Button/Card component's own hover/active styling, not left for the user to hand-
  author — pairs with the project's existing hover/focus effect system.
- A "glow" (a coloured shadow) is a named variant of the shadow token, not a separate control (rule 8).
- Rule 2–3 ("small doses", "go light") argue for the shadow token's default opacity/spread being conservative,
  with a stronger value requiring a deliberate opt-in (e.g. choosing the "large" step).

### Web Design Rule #6 — Border-radius (text pp. 175–183)

**"USE BORDER-RADIUS WELL"** (text pp. 175–182):
1. **Use border-radius to increase the playfulness and fun of the design, to make it less serious** (text
   p. 175) — contrasted as "less border-radius" for **Serious/Elegant** vs. "more border-radius" for
   **Playful/Fun**.
2. **Typefaces have a certain roundness: make sure that border-radius matches that roundness!** (text p. 176)
   — two examples: a very round typeface paired with lots of border-radius (buttons, icons, images), vs. a
   boxy/squared typeface where the designer still wanted some playfulness, so used a little border-radius.
3. **Use border-radius on buttons, images, around icons, standout sections and other elements** (text p. 177).

**For the builder**
- This is the deck's own source for the project's existing corner-radius rule ("nothing is rounded until
  someone asks... arrives only as part of a design somebody chose" — `CLAUDE.md` rule 3): the slide states
  outright that radius is a **personality dial** (serious → none, playful → a lot), not a universal default —
  exactly why the project forbids a default radius on new components.
- Radius should be a single token that can scale with the chosen typeface's own roundness (rule 2) — e.g. a
  personality preset pairing a rounded sans-serif should also raise the radius token, and a boxy/squared
  typeface should keep it low or zero.
- The applicable surfaces are explicit: buttons, images, icon badges, "standout" sections/cards (rule 3) — the
  builder's five radius controls (all-corners + 4 individual, per `CLAUDE.md` rule 3) apply to exactly these
  block types.

### Web Design Rule #7 — Whitespace (text pp. 184–198)

**"WHY WHITESPACE"** (text p. 184):
- **The right amount of whitespace makes designs look clean, modern and polished.**
- **Looks a lot more polished, like the design has space to breathe.**
- **Whitespace communicates how different pieces of information are related to one another.**
- **Whitespace implies invisible relationships between the elements of a layout.**

**"WHERE TO USE WHITESPACE"** (text pp. 185–189):
1. **Use tons of whitespace between sections** (text p. 185). Sample values shown on the build-up slides:
   **192px, 192px, 192px**, then **140px, 160px, 140px**, then **96px, 152px** (text pp. 185–187) — **Note: not
   verified from the slide image** exactly which section-gap each number labels; the values are large (~96–
   192px), consistent with "tons."
2. **Use a lot of whitespace between groups of elements** (text p. 186) — a smaller sample value **24px**
   appears alongside this rule (text p. 187).
3. **Use whitespace between elements** (text p. 188).
4. **Inside groups of elements, try to use whitespace instead of lines** (text p. 189).

**"HOW MUCH WHITESPACE"** (text pp. 189–198):
5. **The more some elements (or groups of elements) belong together, the closer they should be!** (text
   p. 189) — this is named **"The Law of Proximity"** on the slide, illustrated three ways: (a) no separation
   between elements is confusing, vs. a title and its text placed closer together because they belong
   together; (b) ambiguous spacing around form labels/inputs ("what field do labels belong to?!") vs. each
   label clearly grouped with its input; (c) a button placed closer to whichever text block it "belongs to."
6. **Start with a lot of whitespace, maybe even too much! Then remove whitespace from there** (text p. 193) —
   **"too much whitespace looks detached, too little looks too crammed"**, illustrated as "everything is
   detached" vs. "way too crammed and uninviting" vs. "just right, design can breathe."
7. **Match other design choices. If you have big text or big icons, you need more whitespace** (text p. 195)
   — "huge text, lots of whitespace" vs. "small text and images, less space."
8. **Try a hard rule, such as using multiples of 16px for all spacing** (text p. 196) — a sample value
   **96px** (a multiple of 16) appears on this slide.

**For the builder**
- This is the deck's direct source for the project's spacing rule ("Space by default, always overridable — words
  never touch an edge", `CLAUDE.md` rule 3, the user 2026-09-29, which REVERSED the earlier "never a default"): a
  2rem side gutter, 1rem around a section, 1rem gaps, 1.5rem inside a box with a visible edge, each overridable to
  0 and measured by the page audit (W7a/W7b). The slide's own "start with a
  lot, then remove" (rule 6) and "law of proximity" (rule 5) are exactly the reasoning a spacing-scale UI
  should encode — gaps between *sections* should default larger than gaps between *elements in a group*.
- The spacing **token scale should be built on a base unit (16px, rule 8)** — matches the project's rem-based
  spacing tokens; every spacing control should snap to that scale rather than accept an arbitrary number.
- Two clearly distinct whitespace tiers are named: **section-to-section** (rule 1, "tons," ~96–192px range)
  and **group-to-group / element-to-element** (rules 2–3, tighter, ~24px range) — the builder's gap controls
  for "outer spacing" (between stacked sections) vs. "inner gap" (between children in a row/stack) should
  default along that same large/small split, not one shared value.
- Rule 4 ("whitespace instead of lines" to group things) argues the builder should not add a divider/border
  by default when a user simply wants two blocks to read as related — offer whitespace as the first grouping
  tool, a rule/border as an explicit opt-in.
- Rule 7 (bigger text/icons need more surrounding space) means the spacing token used inside a block should
  scale with that block's own type-scale/icon-size step, not stay fixed while the content around it grows —
  consistent with the project's `rem`/`clamp()` unit rule (`CLAUDE.md` rule 16).

### Web Design Rule #8 — Visual Hierarchy (text pp. 199–218)

**"WHAT IS VISUAL HIERARCHY?"** (text pp. 199–202, repeated across three build-up slides with identical
wording):
- **Visual hierarchy is about establishing which elements of a design are the most important ones.**
- **Visual hierarchy is about drawing attention to these most important elements.**
- **Visual hierarchy is about defining a "path" for users, to guide them through the page.**
- **We use a combination of position, size, colors, spacing, borders, and shadows to establish a meaningful
  visual hierarchy between elements/components.**

**"VISUAL HIERARCHY FUNDAMENTALS"** (text pp. 203–205):
1. **Position important elements closer to the top of the page, where they get more attention** (text p. 203)
   — captioned: **"Attention flows down the page (and components)"**, with the most important title and the
   most important call-to-action both placed close to the top.
2. **Use images mindfully, as they draw a lot of attention (larger images get more attention)** (text p. 204).
3. **Whitespace creates separation, so use whitespace strategically to emphasize elements** (text p. 205).

**"VISUAL HIERARCHY FOR TEXT ELEMENTS"** (text pp. 206–214):
4. **For text elements, use font size, font weight, color, and whitespace to convey importance** (text p. 206).
   The build-up example contrasts a "confusing! no hierarchy at all" block against one built by "increasing
   font size, increasing font weight, lightening color of less-important text" — captioned **"Perfect!"**.
   Sample sizes on the slide: **40px, 20px, 20px, 20px, 14px, 14px, 12px** (text p. 207) — **Note: not
   verified from the slide image** exactly which line each size belongs to, beyond the pattern of one large
   heading size and several smaller, decreasing supporting sizes. A separate build of the same slide shows an
   "eye-catching background color" vs. a "nice and subtle background color to make content stand out" (text
   p. 210).
5. **What text elements to emphasize? Titles, sub-titles, links, buttons, data points, icons** — **"you can
   also de-emphasize less important text, like labels or secondary/additional information"** (text p. 211).
   The slide shows two annotated examples: a stats-style layout emphasizing icons/data-points/sub-titles
   while de-emphasizing labels and additional info; and an Instagram-style layout where the button is
   de-emphasized ("all focus is on photos") and a price uses a "very subtle button (focus is on prices)."

**"VISUAL HIERARCHY BETWEEN COMPONENTS"** (text pp. 214–218):
6. **Emphasize an important component using background color, shadow, or border (or multiple)** (text p. 214).
7. **Try emphasizing some component A over component B by de-emphasizing component B** (text p. 216) —
   captioned: "Component A has been made more prominent simply by de-emphasizing B."
8. **What components to emphasize? Testimonials, call-to-action sections, highlight sections, preview cards,
   forms, pricing tables, important rows/columns in tables, etc.** (text p. 217).

**For the builder**
- Visual-hierarchy controls are exactly the design tokens already planned: **position (top-of-page bias),
  size (type scale), color, spacing (whitespace scale), border and shadow (border/shadow tokens)** — the deck
  states these six as *the* mechanism (the opening statement), so the builder's "make this stand out" affordance
  on any block should be a bundle across these tokens, not a single "highlight" boolean.
- A hero/CTA layout preset should place the primary heading and primary button near the top of the page by
  default (rule 1) — matches file 03 Part 1's UX Rule 2 (make the CTA the most prominent element).
- Text styles need a de-emphasis variant (smaller size / lighter weight / muted color, rule 4) alongside the
  emphasis variants, for labels and secondary info — not just a ladder of "bigger is more important."
- A Pricing-table "highlighted plan," a testimonial card, a CTA section and a "featured" table row (rule 8)
  are the concrete list of components that need a first-class "emphasized" style variant (background colour
  + shadow + border, singly or combined, rule 6) — this is again the Pricing-table highlight already noted
  from file 03 Part 1's UX section, now generalized to every component in this list.
- Rule 7 (emphasize A by de-emphasizing B) means the builder should let a user dim/mute a sibling block, not
  only brighten the target block — an inverse lever on the same "emphasis" token.

---
