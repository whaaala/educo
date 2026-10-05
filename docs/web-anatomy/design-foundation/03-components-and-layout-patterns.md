# 03 — UX rules, website personalities, elements and components (deck pp. 222–350)

Source: Jonas Schmedtmann, *Build Responsive Real-World Websites with HTML and CSS* — theory-lecture slides
(Omnifood project). This file distils **pages 222–300** of the 404-page deck. Every page was rendered to an
image and looked at; exact wording comes from the slide text.

Note on scope: pages 222–300 do **not** reach Section C (section components), Section D (layout patterns),
"Switching flex-direction to column" or "Vertical centering with absolute position and transform" — those
come after p. 300. What pp. 222–300 actually contain is:
- the end of the UX lecture — UX goals and UX rules 1–11 (pp. 222–233);
- the **Website Personalities Framework** (pp. 235–255);
- **Web Design Rules #10 Part I — Elements and Components**: the overview and gallery index (pp. 257–261,
  which *names* every Section C item and Section D layout pattern), **A Elements 1–5** (pp. 262–267) and
  **B Components 1–18** (pp. 268–300).

Section C and D items appear in this file only as names from the index (p. 261); their anatomy belongs to
the file covering pp. 301 onwards.

The component slides are **galleries of real-site screenshots with no explanatory text** beyond the
title. The anatomy written under each one is what the screenshots show — it is description of the slide,
not outside knowledge. "For the builder" lines are recommendations derived from those slides.

---

## Part 1 — UX: goals and rules (pp. 222–233)

### UX design guiding principle: goals (p. 222)
- A website or application **exists for a reason**: a **user** has a goal for **visiting** it, and a
  **business** has a goal for **creating** it.
- Venn diagram: USER GOALS (example: *designing websites faster*) and BUSINESS GOALS (example: *selling
  design kits for design tools*). **Good UX design aligns the user's goals with the business' goals.**
- UX example: a three-card pricing table — "for Sketch" $48, "for Figma" $48, "for Teams" from $78, each a
  tick-list of features and a full-width button ("Buy for Sketch", "Buy for Figma", "Choose Your License");
  the Teams card is inverted to a dark background. **Highlighting an option in the product pricing table**
  helps the **user** decide faster what is the best option, and helps the **business** maximize revenue.
- **For the builder:** the Pricing-table block (B17) should support marking one plan as highlighted.

### UX rules for usability (pp. 223–229)
1. **Don't design complicated layouts. Don't reinvent the wheel. Use patterns that users know** (p. 223).
   Bad: arngren.net — a page crammed edge to edge with product photos, coloured link text and prices in
   no structure. Good: Amazon — dark header with search, a nav strip, a hero banner ("Block distractions",
   Sony headphones), a left "Department" link list, and a "Shop by Category" grid of product images with
   captions.
2. **Make your call-to-action the most prominent element, and make the text descriptive** (p. 224). Bad:
   a booking card (€106 / night, check-in/checkout/guests fields, price breakdown, total) where "Reserve"
   is only bold text in the top-right corner. Good: the same card with a full-width red–pink gradient
   "Reserve" button directly under the inputs and "You won't be charged yet" beneath it.
3. **Use blue text and underlined text only for links!** (p. 225). Good: an article header ("Inaugural
   Address by President Joseph R. Biden, Jr.") whose small blue uppercase meta line "JANUARY 20, 2021 •
   SPEECHES AND REMARKS" is a link (hand cursor). Bad: the same with "United States" underlined in blue in
   the body text — **"Looks 100% like a link, but isn't one!"**
4. **Animations should have a purpose and be fast: between 200 and 500 ms** (p. 226). The same Grammarly
   Business hero (heading, paragraph, green button, photo) labelled **2000 ms** (bad) and **400 ms** (good).
5. **In forms, align labels and fields in a single vertical line, to make the form easier to scan**
   (p. 227). "Contact support": label "Question" above a select, "Tell us more—how can we help?" above a
   textarea, "Your email address" (with an info icon) above an input, then a "Send email" button — all on
   one left edge, marked with a red downward arrow.
6. **Offer users good feedback for all actions: form errors, form success, etc.** *[web apps]* (p. 228).
   The same form with each field bordered red and a red message with a warning-triangle icon under each
   ("Please choose a question to help us better assist you.", "Please tell us more about your question.",
   "Please enter a valid email address for us to contact you.").
7. **Place action buttons where they will create an effect (law of locality)** *[web apps]* (p. 229). A
   dark to-do list "Today": good — "+ Add task" at the bottom of the list, where the new task appears;
   bad — "+ Add task" in the top-right corner above the heading.

### UX rules for website content (pp. 230–233)
8. **Use a descriptive, keyword-focused headline on your main page. Don't be vague or fancy!** (p. 230).
   Good: "The AI assistant that grows your money." · "Automate banner production in minutes" · "Greenlight
   makes it easy to leave feedback on any website." · "The All-In-One Toolkit for Working Remotely."
   Vague: "Join the solar energy revolution" · "The way you work is evolving. Is your hiring software?" ·
   "Meaningful Insights Without the Click of a Button." · "Is design growing your product?"
9. **Only include relevant information, efficiently! Cut out fluff and make the content 100% clear**
   (p. 231). Good: Basecamp's page ("The All-In-One Toolkit for Working Remotely.", short intro, one yellow
   CTA, an annotated product screenshot, "One place, not all over the place.", "We literally wrote the book
   on working remotely.") and avocode's page ("Save time working with design files", email + button, logo
   row, then alternating screenshot / text rows).
10. **Use simple words! Avoid technical jargon and "smart-sounding" words** (p. 232). Good: "Everything you
    need to grow online." / "Simple tools for your big ideas. Start your free website trial today, no credit
    card required." · "The only VPN you'll ever need" / one plain sentence · "The modern way to build for the
    web" / "Webflow empowers designers to build professional, custom websites in a completely visual canvas
    with no code."
11. **Break up long text with sub-headings, images, block quotes, bullet points, etc.** (p. 233). A blog
    post "90% of Startups Fail": a bar-chart image ("Top 20 Reasons Startups Fail") with its source link,
    a short quoted line with a left rule, an indented larger pull quote ("So to put it bluntly, most of
    startups fail because they build something nobody wants. Wow!"), paragraphs with bold phrases, a
    "Conclusion" sub-heading and a three-item bullet list.

Note: p. 234 is a blank slide.

**For the builder (Part 1):**
- Rule 1 → the palette should lead with the known patterns listed below (components, layout presets), not
  free-form arrangements.
- Rule 2 → a Button needs a clear primary variant for the one main CTA; hero / CTA presets should make it
  the most prominent element; placeholder labels should be descriptive ("Reserve", "Send email"), never
  "Click here".
- Rule 3 → text styles should not offer blue/underlined decoration for non-link text by default; underline
  belongs to links.
- Rule 4 → motion presets (hover, entrance) default to **200–500 ms**; nothing longer by default.
- Rule 5 → a Form's default layout is **label above field, one left edge**, submit button on the same edge.
- Rule 6 → every form field has an error state (red border + message with an icon under the field) and the
  form has a success state.
- Rule 7 → an "add item" control sits where the item will appear (for the builder's own UI as well).
- Rules 8–10 → hero placeholder copy is a descriptive headline plus one plain sentence, not a slogan.
- Rule 11 → an article/long-text block makes sub-headings, images with caption/source, block quotes, pull
  quotes and bullet lists one click away.

---

## Part 2 — The Website Personalities Framework (pp. 235–255)

p. 235 is the lecture title slide: Section "Web design rules and framework", lecture "The
website-personalities-framework".

### The framework (pp. 236–237)
- **100s of well-designed sites deconstructed** → distilled into **countless web design rules** (the ones
  just learned) and into **7 website personalities**. **"Rules should be applied according to selected
  website personality"** (p. 236).
- Process (p. 237): *How do you want website to appear to users? What "vibe" do you want to transmit?* →
  **Choose one of the website personalities accordingly** → **Apply personality traits to each design
  ingredient**: **Typography · Colors · Images · Icons · Shadows · Border-radius · Layout**.
- **The 7 personalities:** 1 Serious/Elegant · 2 Minimalist/Simple · 3 Plain/Neutral · 4 Bold/Confident ·
  5 Calm/Peaceful · 6 Startup/Upbeat · 7 Playful/Fun.
- **For the builder:** a personality is a natural **site-level design preset**: one choice sets all seven
  ingredients (font pairing, palette, image treatment, icon style, shadow token, radius token, default
  layout tendency). This fits the project rule that rounding arrives only "as part of a design somebody
  chose" — here it would arrive with Calm, Startup or Playful.

Each personality slide lists Overview · Industries, then the seven ingredients ("Web design ingredients
we learned about"), with a real site on the right; the next slide shows three more example sites.

### Personality 01 — Serious/Elegant (pp. 238–239)
| Ingredient | Trait |
|---|---|
| Overview | Design for luxury and elegance, based on **thin serif typefaces**, **golden or pastel colors**, and big high-quality images |
| Industries | Real estate, high fashion, jewelry, luxury products or services |
| Typography | Serif typefaces (especially in headings), light font weight, small body font size |
| Colors | Gold, pastel colors, black, dark blue or grey |
| Images | Big, high-quality images are used to feature elegant and expensive products |
| Icons | Usually no icons, but thin icons and lines may be used |
| Shadows | Usually no shadows |
| Border-radius | Usually no border-radius |
| Layout | A creative and experimental layout is quite common |

Example (p. 238): Rino & Pelle — tiny spaced-caps logo and nav, a thin monogram, a large thin serif headline
mixing uppercase and italic ("LUXURIOUS *and* CONTEMPORARY APPEAL — *for* EVERY WOMAN"), a row of fashion
photos of different heights, then "Autumn — Winter 2020" in thin serif beside overlapping photos and a
muted square "Lookbook" button. More examples (p. 239): Slovenský Dom (serif headings, gold accents, big
house photo, thin line icons), Château de Versailles (serif caps, thin line drawings of the estate, dark
band of artworks), Fetching Fields (serif headings, pale backgrounds, big product photography).

### Personality 02 — Minimalist/Simple (pp. 240–241)
| Ingredient | Trait |
|---|---|
| Overview | Focusses on the essential text content, using small or medium-sized sans-serif black text, lines, and few images and icons |
| Industries | Fashion, portfolios, minimalism companies, software startups |
| Typography | Boxy/squared sans-serif typefaces, small body font sizes |
| Colors | Usually black or dark grey, on pure white background. Usually just one color throughout the design |
| Images | Few images, which can be used to add some color to the design. Usually no illustrations, but if, than just black |
| Icons | Usually no icons, but small simple black icons may be used |
| Shadows | Usually no shadows |
| Border-radius | Usually no border-radius |
| Layout | Simple layout, a narrow one-column layout is quite common |

Example (p. 240): Ark-Shelter — dark photo hero with a short bold white headline ("New way of living.");
a white strip of three numbered links ("Nr. 01 Live in ark", "Nr. 02 Work in an ark", "Nr. 03 Relax in an
ark"); a small label "What's Ark-Shelter?" beside a bold paragraph; two small-text columns; an underlined
link. More examples (p. 241): Clippings (black sans headline, black pill button, furniture photos), exyte
(black line illustrations, centred text, square black button), a designer portfolio (serif headline on
white, thin line icons in one accent colour).

### Personality 03 — Plain/Neutral (pp. 242–243)
| Ingredient | Trait |
|---|---|
| Overview | Design that gets out of the way by using **very neutral and small typefaces**, and a boxy, structured, and condensed layout |
| Industries | Well-established corporations, companies that don't want to make an impact through design |
| Typography | Neutral-looking sans-serif typefaces are used, and text is usually small and doesn't have visual impact |
| Colors | Safe colors are employed, nothing too bright or to washed-out. Blues and blacks are common |
| Images | Images are frequently used, but usually in a small format |
| Icons | Usually no icons, but simple icons may be used |
| Shadows | Usually no shadows |
| Border-radius | Usually no border-radius |
| Layout | Structured and condensed layout, with lots of boxes and rows |

Example (p. 242): IBM — blue event banner; "Inside IBM" row of four image cards (italic label, image, short
text, blue arrow link); a band of arrow-link columns ("Technologies", "Business needs") with a video card;
"Explore product trials and offers" row of four product-screenshot cards. More examples (p. 243):
Microsoft (row of small icon links, rows of four image cards, a dark feature band), Porsche (a 3×2 grid of
model tiles with two buttons each, a carousel of cars), Design Builders (navy band with image cards, a
"News & Events" row).

### Personality 04 — Bold/Confident (pp. 244–245)
| Ingredient | Trait |
|---|---|
| Overview | Design that makes an impact, by featuring **big and bold typography**, paired with confident use of **big colored blocks** |
| Industries | Digital agencies, software startups, travel, "strong" companies |
| Typography | Boxy/squared sans-serif typefaces, big and bold typography, especially headings. Uppercase headings are common |
| Colors | Usually multiple bright colors. Big color blocks/sections are used to draw attention |
| Images | Lots of big images are usually displayed |
| Icons | Usually no icons |
| Shadows | Usually no shadows |
| Border-radius | Usually no border-radius |
| Layout | All kinds of layouts, no particular tendencies |

Example (p. 244): JUDY — a bright orange hero with a huge heavy uppercase headline ("PREPARE FOR WHAT YOU
CAN'T PREDICT."), a square black "Shop our kits" button and product photos; a strip of three press quotes
over publication logos (People, The New York Times, GMA); a full-width yellow block "SHOP OUR KITS" with a
row of products (name, price, square black "Add To Cart"). More examples (p. 245): Dover (bold navy
headline, full-width coloured testimonial blocks), an agency ("Our growth expertise, your passion." — huge
red/white type on black, then a cream block, then a red block "the impact of many."), Squarespace (big
bold headlines "Create a website." / "Sell online." over big images).

### Personality 05 — Calm/Peaceful (pp. 246–247)
| Ingredient | Trait |
|---|---|
| Overview | For products and services that care about the consumer, which is transmitted by **calming pastel colors** and **soft serif headings** |
| Industries | Healthcare, all products with focus on consumer well-being |
| Typography | Soft serif typefaces frequently used for headings, but sans-serif headings might be used too (e.g for software products) |
| Colors | Pastel/washed-out colors: light oranges, yellows, browns, greens, blues |
| Images | Images and illustrations are usual, matching calm color palette |
| Icons | Icons are quite frequent |
| Shadows | Usually no shadows, but might be used sparingly |
| Border-radius | Some border-radius is usual |
| Layout | All kinds of layouts, no particular tendencies |

Example (p. 246): feals — soft beige photo hero, white serif headline ("Finally, a better way to feel
better."), pale orange button; a strip of five press quotes over logos with "5000+ 5-star reviews" in the
middle; a cream section "Feel balanced." with a row of three photos, each with a small round icon badge on
its bottom edge, a small uppercase label and a serif line. More examples (p. 247): care/of (serif
headline, three small icon columns), MNDFL (arched sage block, organic illustration blobs, serif headings),
donut (serif headings on peach, 3D illustrations in rounded badges, phone mock-ups).

### Personality 06 — Startup/Upbeat (pp. 248–249)
| Ingredient | Trait |
|---|---|
| Overview | Widely used in startups, featuring **medium-sized** sans-serif typefaces, **light-grey backgrounds**, and rounded elements |
| Industries | Software startups, and other modern-looking companies |
| Typography | Medium-sized headings (not too large), usually one sans-serif typeface in whole design. Tendency for lighter text colors |
| Colors | Blues, greens and purples are widely used. Lots of light backgrounds (mainly gray), gradients are also common |
| Images | Images or illustrations are always used. 3D illustrations are modern. Sometimes patterns and shapes add visual details |
| Icons | Icons are very frequent |
| Shadows | Subtle shadows are frequent. Glows are becoming modern |
| Border-radius | Border-radius is very common |
| Layout | Rows of cards and Z-patterns are usual, as well as animations |

Example (p. 248): Stripe Connect — medium headline ("Payments for platforms and marketplaces"), paragraph,
a rounded "Start now ›" button + "Contact sales ›" link, a rounded phone UI with shadow; a diagonal blue
gradient band; a two-row logo grid; "How it works" label + heading + a row of four small icon-headed
columns; then a text-left / form-screenshot-right row. More examples (p. 249): a design studio (light
grey, rounded app mock-ups, email + button hero, icon feature list), Grammarly Business (row of four round
icon feature columns), Linear (dark, centred headline, glowing announcement pill, purple button, logo grid,
row of three rounded dark cards).

### Personality 07 — Playful/Fun (pp. 250–251)
| Ingredient | Trait |
|---|---|
| Overview | **Colorful and round** designs, fueled by **creative elements** like hand-drawn icons or illustrations, animations, and fun language |
| Industries | Child products, animal products, food |
| Typography | Round and creative (e.g. handwritten) sans-serif typefaces are frequent. Centered text is more common |
| Colors | Multiple colors are frequently used to design a colorful layout, all over backgrounds and text |
| Images | Images, hand-drawn (or 3D) illustrations, and geometric shapes and patterns are all very frequently used |
| Icons | Icons are very frequent, many times in a hand-drawn style |
| Shadows | Subtle shadows are quite common, but not always used |
| Border-radius | Border-radius is very common |
| Layout | All kinds of layouts, no particular tendencies |

Example (p. 250): minidil (a language school) — orange/pink organic-blob hero with a child photo, a white
pill button with an arrow and carousel dots; a boy with a laptop over coloured circles beside a heading, a
two-column list of rounded icon badges and a blue pill button; an events block of rounded dark photo cards
with title and date over the image. More examples (p. 251): Real Thread (blue hero, hand-drawn scribbles
and blobs, a small floating card), Honk (a mosaic of pastel rounded cards, each a big icon or word and a
short title — "hey / Live Typing", "No Send Button", "No Chat History", "Just Honk"), A Pup Above (bright
orange/green/yellow colour blocks, heavy uppercase headlines, a row of product tiles each on a different
colour, a circular photo with hand-written labels).

### Advanced: combining playfulness and boldness (pp. 252–255)
- The map (p. 252): a horizontal axis **SERIOUS → PLAYFUL** carrying Serious/Elegant, Minimalist/Simple,
  Plain/Neutral, Startup/Upbeat, Playful/Fun; a vertical axis **CALM (bottom) → BOLD (top)** with a
  Bold/Confident band above and a Calm/Peaceful band below. Double arrows from each of the five up to Bold
  and down to Calm: **"INJECT SOME PERSONALITY TRAITS"**.
  - **More (towards BOLD):** boxy/squared sans-serif typefaces · big and bold typography · bright/flashy
    colors.
  - **More (towards CALM):** headings using soft serif typefaces · pastel/washed-out colors · illustrations.
  - **More (towards PLAYFUL):** colorful · rounded corners, typography and icons · shadows · illustrations.
- Worked examples, each labelled base personality + injected traits (arrows point to where each trait is):
  - hitchd — **Minimalist/Simple** base + **Bold/Confident** traits: *big and bold typography* ("Guests
    fund your honeymoon. Beautiful. Fast. Simple.") and *big color blocks* (dark and navy full-width
    sections) (p. 253).
  - Vercel — **Startup/Upbeat** base + **Bold/Confident** traits: *very boxy typeface*, *big and bold
    typography* ("Develop. Preview. Ship.") (p. 253).
  - drip — **Bold/Confident** base + **Playful/Fun** traits: *irregular round design elements* (a navy
    banner with wavy edges showing "$1,002,632,467"), *hand-drawn icons and patterns* (blobby icon badges,
    a dot pattern) (p. 254).
  - Wealthfront — **Bold/Confident** base + **Calm/Peaceful** traits: *headings using soft serif
    typefaces* ("Finances, simplified.", "Upgrade your banking.", "Invest your savings."), *illustrations in
    calming pastel colors* (p. 254).
  - SECFI — **Startup/Upbeat** base + **Calm/Peaceful** traits: *headings using soft serif typefaces*
    ("Make the most of your options", "Pay for… your options"), *illustrations in calming pastel colors*
    (mountain, desk, person in chair) (p. 255).
  - Mine — **Startup/Upbeat** base + **Calm/Peaceful** traits: *headings using soft serif typefaces* ("The
    Future of Data Ownership"), *illustrations* (black-and-white ostriches, line drawings in cards) (p. 255).

**For the builder (Part 2):**
- Offer the **7 personalities as a site-level design preset**, shown as seven live previews (the project's
  Design Gallery), each setting the seven ingredients from the tables above.
- Offer **Bold · Calm · Playful as independent trait dials** on top of the chosen personality — the deck
  presents them as axes you inject, not exclusive choices (this matches the project's RULE T: variations
  combine as axes).
- Defaults that follow from the tables: shadows and radius are **off** for Serious/Elegant,
  Minimalist/Simple, Plain/Neutral and Bold/Confident; Calm/Peaceful switches on *some* radius; Startup/
  Upbeat and Playful/Fun switch on radius (very common) and subtle shadows. Default layout tendency:
  Minimalist → narrow one column; Plain/Neutral → boxes and rows; Startup/Upbeat → rows of cards +
  Z-pattern; Serious/Elegant → creative/experimental; the rest → no tendency.

---

## Part 3 — Components and layout patterns: overview (pp. 256–261)

Note: p. 256 is blank; p. 257 is the divider "Section 06 — Components and layout patterns"; p. 258 is the
lecture title slide "Web design rules #10 - Part 1: Elements and components".

### From elements to webpage (pp. 259–260)
**Elements → Components → (PATTERNS) → Layouts → Webpage** (p. 259), shown with MindJournal:
- *Elements:* a bold heading ("With you every step of the way."), a paragraph, a dark pill "LEARN MORE"
  button, a photo (hands holding a notebook).
- *Component:* those four combined — text block on the left, photo on the right.
- *Layout:* that component repeated three times with text and photo **alternating sides** (the first one
  outlined with a red dashed box) — "With you every step of the way.", "More than just a notebook.",
  "Designed and built for you."
- *Webpage:* the full page — hero image with headline and button, a logo strip, a centred intro, the
  alternating layout (outlined again), then a grid of small icons with captions.

The three steps (p. 260):
1. Use **common elements** and **components** to convey your website's information.
2. Combine components into layouts using **common layout patterns**.
3. Assemble different **layout areas** into a complete, final page.

**For the builder:** this is the builder's own hierarchy — element blocks → component blocks built from
elements → layout presets arranging components → page. The palette should be organised in those tiers,
and a layout preset must be made of real, editable component blocks (the alternating rows in the example
are one component repeated, not a flattened picture).

### Gallery index (p. 261)
| A Elements | B Components | C Section components | D Layout patterns |
|---|---|---|---|
| 1. Text | 1. Breadcrumbs | 1. Navigation | 1. Row of boxes or cards |
| 2. Buttons | 2. Pagination | 2. Hero section | 2. Grid of boxes or cards |
| 3. Images | 3. Alert and status bars | 3. Footer | 3. Z-pattern |
| 4. Input elements | 4. Statistics | 4. Call-to-action section | 4. F-Pattern |
| 5. Tags | 5. Gallery | 5. Feature row | 5. Single-column |
| | 6. Feature box | | 6. Sidebar |
| | 7. Preview and profile cards | | 7. Multi-column/magazine |
| | 8. Accordion | | 8. Asymmetry/Experimental |
| | 9. Tabs | | |
| | 10. Carousel | | |
| | 11. Customer testimonials | | |
| | 12. Customer logos | | |
| | 13. Featured-in logos | | |
| | 14. Steps | | |
| | 15. Forms | | |
| | 16. Tables | | |
| | 17. Pricing tables | | |
| | 18. Modal windows | | |

A red "This lecture" arrow points at **A Elements** and **B Components**; C and D are Part 2 (after p. 300).

---

## Part 4 — A: Elements (pp. 262–267)

**Tooling note:** the PDF-page-image renderer (`pdftoppm`/poppler) is not installed in this environment, so no
slide image could be opened for pp. 262–350 (this covers Parts 4–7 below). These slides are, per the deck's
own pattern already established in Part 3, **galleries of real-site screenshots with a title only** — the
extracted text layer confirms this: every page in this range prints nothing but the repeated numbered title
(e.g. "01 TEXT A ELEMENTS"), except for two short annotation labels on the Navigation and Grid-pattern slides,
quoted where they occur. Because no example or anatomy detail could be read off an image this pass, each
entry below is limited to: its name, its page range (accurately computed from the deck's own page-break
markers), and — clearly marked as **not slide content** — the standard, generic definition of that UI pattern,
offered only so the "For the builder" notes have something concrete to hang off. **A follow-up pass with a
working PDF renderer should open these pages and replace the generic definitions with what the screenshots
actually show**, the way Parts 1–3 of this file and file 02 do.

| # | Element | Page(s) |
|---|---|---|
| 1 | Text | p. 262 |
| 2 | Buttons | pp. 263–264 |
| 3 | Images | pp. 264–265 |
| 4 | Input elements | pp. 265–266 |
| 5 | Tags | pp. 266–267 |

Generic definitions (not slide content, no text/anatomy was extractable for these titles):
1. **Text** — the base heading/paragraph/label/caption styles a design system provides.
2. **Buttons** — primary/secondary/tertiary/ghost/icon button styles and their states.
3. **Images** — plain, framed, rounded, and captioned image treatments.
4. **Input elements** — text inputs, selects, checkboxes, radios, switches, textareas.
5. **Tags** — small pill/badge labels used for categories, statuses or filters.

**For the builder**
- These five are the **atomic layer** the project already has as shared components (`Button`, `FormInput`,
  `FormDropdown`, `CustomDropdown` — `components/shared/`) and Text/Tag primitives in the builder's own
  element palette — this section of the deck is the source naming that exact atomic tier ("A Elements") that
  every Component (tier B) and Section component (tier C) is built from.
- Given the gap above, before adding or restyling any of these five atoms, re-open pp. 262–267 with a working
  renderer to check for rules this pass missed.

---

## Part 5 — B: Components (pp. 267–302)

Eighteen components, continuing the numbering already indexed at p. 261 (file 03 Part 3). Component 18
(Modal windows) was already distilled in `04-process-and-responsive.md` (pp. 301–302), from the same
screenshot-gallery pattern but with visible example content described from the extracted text (four modal
screenshots were legible as text — see that file). Components 1–17 below have **no legible example content**
in the extracted text (title only, repeated per build-up slide) — same tooling caveat as Part 4 applies.

| # | Component | Page(s) |
|---|---|---|
| 1 | Breadcrumbs | pp. 267–268 |
| 2 | Pagination | pp. 268–269 |
| 3 | Alert and status bars | pp. 269–270 |
| 4 | Statistics | pp. 270–271 |
| 5 | Gallery | pp. 271–273 |
| 6 | Feature box | pp. 273–275 |
| 7 | Preview and profile cards | pp. 275–278 |
| 8 | Accordion | pp. 278–280 |
| 9 | Tabs | pp. 280–282 |
| 10 | Carousel | pp. 282–284 |
| 11 | Customer testimonials | pp. 284–287 |
| 12 | Customer logos | pp. 287–289 |
| 13 | Featured-in logos | pp. 289–290 |
| 14 | Steps | pp. 290–292 |
| 15 | Forms | pp. 292–295 |
| 16 | Tables | pp. 295–297 |
| 17 | Pricing tables | pp. 297–299 |
| 18 | Modal windows | pp. 299–302 (distilled in file 04) |

Generic definitions (not slide content — see tooling note in Part 4):
1. **Breadcrumbs** — a horizontal trail of ancestor-page links showing the user's location in the site hierarchy.
2. **Pagination** — numbered/prev-next controls for paging through a long list or result set.
3. **Alert and status bars** — a banner (success/warning/error/info) surfaced at the top of a page or inline.
4. **Statistics** — a row of large numbers with short labels ("10,000+ users").
5. **Gallery** — a grid or masonry set of images, usually opening a lightbox on click.
6. **Feature box** — an icon (or small image) + heading + short text, usually repeated in a row or grid.
7. **Preview and profile cards** — a card combining an avatar/image, name/title, and short text or stats.
8. **Accordion** — a vertically stacked list of headers that expand/collapse to reveal body content.
9. **Tabs** — a horizontal set of labelled panels, one visible at a time.
10. **Carousel** — a horizontally paged/sliding set of slides with next/prev controls and often dots.
11. **Customer testimonials** — a quote, an avatar, a name/role, sometimes a star rating.
12. **Customer logos** — a row/grid of client or partner logos ("as seen with").
13. **Featured-in logos** — a row of press/publication logos ("as featured in").
14. **Steps** — a numbered horizontal or vertical sequence explaining a process ("How it works").
15. **Forms** — labelled input groups with a submit action (see file 02 Part 1, UX rules 5–6, for the form
    layout and error/success-feedback rules already distilled from this same deck).
16. **Tables** — rows/columns of data, with a header row and often striping or a highlighted row.
17. **Pricing tables** — a row of plan cards (name, price, feature tick-list, CTA button), one often
    highlighted (see file 02 Part 1's UX example, "Highlighting an option in the product pricing table").
18. **Modal windows** — see file 04 (pp. 301–302) for the four distilled examples and the design already
    recorded there.

**For the builder**
- This is the **B Components tier** of the deck's own hierarchy (Elements → Components → (Layouts, via
  patterns) → Webpage, file 03 Part 3, p. 259): every one of these 18 names should exist as a component block
  in the builder's palette, built from the A-tier elements above, with full CRUD per item (RULE B in
  `CLAUDE.md` rule 13) and a Design Gallery of visible variations (RULE S/T).
- Components 8 (Accordion) and 10 (Carousel) already have deep-dive build lectures distilled separately (the
  flex-direction-column and absolute-position-transform lectures, both in file 04, pp. 303–304 and 305–307) —
  those are the concrete CSS mechanics for exactly these two components.
- Component 17 (Pricing tables) already has its "highlight one plan" requirement recorded from file 02's UX
  section; component 15 (Forms) already has its label/field alignment and error/success-feedback rules
  recorded there too — both are Rule A (capability parity) precedents: a capability found for one component
  (highlighting, error states) is the baseline for every applicable component in this list.
- As with Part 4, this list should be revisited with a working PDF renderer to confirm each component's actual
  on-slide anatomy before it is treated as final.

---

## Part 6 — C: Section Components (pp. 310–336)

| # | Section component | Page(s) |
|---|---|---|
| 1 | Navigation | pp. 310–317 |
| 2 | Hero section | pp. 317–325 |
| 3 | Footer | pp. 325–328 |
| 4 | Call-to-action section | pp. 328–332 |
| 5 | Feature row | pp. 332–336 |

Two short annotations survived extraction on the Navigation slides (pp. 316–317, the last build-up slides of
that item): **"OVERLAYS"** and **"SECONDARY NAVIGATION"** — naming two navigation variants (an overlay/off-
canvas menu, and a secondary nav strip below the primary one) the gallery evidently shows, though their visual
detail is not recoverable from text alone (**Note: not verified from the slide image**). No other C-tier item
has any extractable annotation beyond its repeated title.

Generic definitions (not slide content — see tooling note in Part 4):
1. **Navigation** — the site's primary header nav (logo, links, CTA button), plus overlay/mobile and
   secondary-nav variants per the annotations above.
2. **Hero section** — the first full-width section of a page: headline, sub-text, one or two CTAs, and
   usually an image/illustration.
3. **Footer** — the closing full-width section: link columns, legal text, social icons, sometimes a newsletter
   signup.
4. **Call-to-action section** — a focused band whose only job is to drive one action (heading + button).
5. **Feature row** — a repeating text+image (or icon) row, usually alternating sides (the exact pattern
   already shown worked-through in file 03 Part 3's "MindJournal" example, p. 259).

**For the builder**
- This is the **C tier**: whole page regions built from B-tier components. Every Educo site-builder template
  needs, at minimum, these five region types as first-class section presets: Navigation (with overlay and
  secondary-nav variants), Hero, Footer, CTA section, Feature row.
- The Feature-row "alternating sides" behaviour was already fully worked through with a live example in file
  03 Part 3 (p. 259: "With you every step of the way." / "More than just a notebook." / "Designed and built
  for you.") — that example IS this section component; treat the two as the same requirement.

---

## Part 7 — D: Layout Patterns (pp. 336–350)

| # | Layout pattern | Page(s) |
|---|---|---|
| 1 | Row of boxes or cards | pp. 336–337 |
| 2 | Grid of boxes or cards | pp. 337–340 |
| 3 | Z-pattern | pp. 340–342 |
| 4 | F-pattern | pp. 342–344 |
| 5 | Single-column | pp. 344–345 |
| 6 | Sidebar | pp. 345–347 |
| 7 | Multi-column/magazine | pp. 347–348 |
| 8 | Asymmetry/Experimental | pp. 348–350 |

**"Aside: nesting patterns in components"** (pp. 339–340) is the one D-tier slide with an extractable diagram
label: it shows a **Feature row section component** built with a **Grid pattern** beside another **Feature row
section component** built with a **Row pattern**, i.e. the same C-tier section component (Feature row) can
internally use either D-tier pattern (Grid or Row) — patterns nest *inside* section components, they are not
mutually exclusive with them. **Note: not verified from the slide image** beyond that labelled relationship.

Generic definitions (not slide content — see tooling note in Part 4):
1. **Row of boxes or cards** — a single horizontal row of equal-width cards (flexbox, 1D — see file 02's
   Flexbox lecture, p. 69–72).
2. **Grid of boxes or cards** — a 2D grid of cards that wraps to further rows (CSS Grid — file 02, p. 74–78).
3. **Z-pattern** — content laid out so the eye travels top-left → top-right → bottom-left → bottom-right,
   used for pages with few, sequential focal points (landing pages).
4. **F-pattern** — content weighted to the left edge with decreasing width toward the bottom, matching how
   users scan text-heavy pages (articles, search results).
5. **Single-column** — one centred content column, no side-by-side layout at all.
6. **Sidebar** — a narrow fixed-width column beside a wide main column (docs sites, dashboards, blogs).
7. **Multi-column/magazine** — several asymmetric content columns on one page, editorial-style.
8. **Asymmetry/Experimental** — deliberately unequal, off-grid placement for a distinctive, art-directed page.

**For the builder**
- This is the **D tier**: how B/C-tier components are arranged into a page region. Patterns 1–2 map directly
  onto the builder's existing Row (flex) and Grid containers (file 02's Flexbox/Grid lectures); a "Feature
  row" section-component preset should be offered in **both** a Row and a Grid variant, exactly as the nesting
  aside (pp. 339–340) shows — pattern choice is a property of how the section is built, not a different
  component.
- Z-pattern and F-pattern are **reading-order guidance for placing existing components**, not new containers —
  the builder's page-level "layout preset" gallery should offer them as a *placement guide* overlay (or a
  starter template whose components are already arranged Z/F-wise) rather than a new block type.
- Sidebar and Multi-column/magazine are two-and-more-column page-level structures the builder's Grid container
  already supports; they belong in the page-template gallery (a "docs layout", a "blog/magazine layout") built
  from ordinary Grid + Row blocks, not as a bespoke component.
- Given the tooling gap noted above, this Part (4–7) is the top candidate to revisit once a PDF renderer is
  available, particularly the Z/F-pattern and Asymmetry slides, which are exactly the kind of diagram this
  distillation's own rules say must be checked against the image, not inferred from a title.

---

## Component and pattern gallery — checklist table (pp. 259–350)

| Name | Kind | Page(s) |
|---|---|---|
| Text | A Element | p. 262 |
| Buttons | A Element | pp. 263–264 |
| Images | A Element | pp. 264–265 |
| Input elements | A Element | pp. 265–266 |
| Tags | A Element | pp. 266–267 |
| Breadcrumbs | B Component | pp. 267–268 |
| Pagination | B Component | pp. 268–269 |
| Alert and status bars | B Component | pp. 269–270 |
| Statistics | B Component | pp. 270–271 |
| Gallery | B Component | pp. 271–273 |
| Feature box | B Component | pp. 273–275 |
| Preview and profile cards | B Component | pp. 275–278 |
| Accordion | B Component | pp. 278–280 (+ mechanics pp. 303–304) |
| Tabs | B Component | pp. 280–282 |
| Carousel | B Component | pp. 282–284 (+ mechanics pp. 305–307) |
| Customer testimonials | B Component | pp. 284–287 |
| Customer logos | B Component | pp. 287–289 |
| Featured-in logos | B Component | pp. 289–290 |
| Steps | B Component | pp. 290–292 |
| Forms | B Component | pp. 292–295 |
| Tables | B Component | pp. 295–297 |
| Pricing tables | B Component | pp. 297–299 |
| Modal windows | B Component | pp. 299–302 |
| Navigation | C Section component | pp. 310–317 |
| Hero section | C Section component | pp. 317–325 |
| Footer | C Section component | pp. 325–328 |
| Call-to-action section | C Section component | pp. 328–332 |
| Feature row | C Section component | pp. 332–336 |
| Row of boxes or cards | D Layout pattern | pp. 336–337 |
| Grid of boxes or cards | D Layout pattern | pp. 337–340 |
| Z-pattern | D Layout pattern | pp. 340–342 |
| F-pattern | D Layout pattern | pp. 342–344 |
| Single-column | D Layout pattern | pp. 344–345 |
| Sidebar | D Layout pattern | pp. 345–347 |
| Multi-column/magazine | D Layout pattern | pp. 347–348 |
| Asymmetry/Experimental | D Layout pattern | pp. 348–350 |

The deck's Section 06 ends at p. 350 (p. 350–352 is the divider into "Section 07 — Omnifood Project Setup and
Desktop Version", distilled in `04-process-and-responsive.md`).
