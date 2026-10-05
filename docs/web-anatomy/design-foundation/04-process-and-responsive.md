# 04 — Components (end), Layout Patterns, the Website Process, and Responsive Design

Source: Jonas Schmedtmann, *Build Responsive Real-World Websites with HTML and CSS* — theory-lecture slides
(Omnifood project), pages 301–end. Page numbers follow the split PDF / `theory.txt` numbering (the deck
actually runs to p. 407; the last slides are "THE END!").

Notes marked **Note:** are clarifications by the distiller, not slide content. Where a slide image could not
be displayed and only the extracted text was used, it is said so explicitly.

**Status: complete to the end of the deck** (text p. 407, "THE END!"). Everything from p. 308 onward (the 7
Steps to a Great Website, the Omnifood-applied Define/Plan/Sketch lectures, Responsive Design Principles, the
Omnifood desktop-build lectures, How Media Queries Work, and How to Select Breakpoints) was added in a second
pass, done **without slide images** (the PDF-page renderer was unavailable in that session) — see the tooling
note above the "7 Steps" lecture.

---

## B. Components gallery (end) — 18. Modal windows (pp. 301–302)

The slide has no prose; it is four screenshots of real modal windows (p. 301):

- **"A Pup Above"** — a split modal: an image panel on the left (a dog in a grass-covered kennel, yellow
  backdrop), form panel on the right. Headline
  "SAVE 10% OFF YOUR FIRST ORDER", script sub-line "Tail wags guaranteed.", inputs "Email (required)" and
  "Phone Number" (with a country-flag select), a full-width green "REDEEM" button, small legal text below,
  a small close "×" top-right. The page behind is darkened.
- **Bank account** — "Open your bank account in just **5 minutes**" (the phrase "5 minutes" highlighted in
  green), labelled rows First Name / Last Name / Email Address, a green rounded "Next step →" button, a "×"
  top-right. The page behind is greyed out.
- **Rino&Pelle "Subscribe!"** — the modal's own background is a photo of a woman in a coat; body text offers a
  one-time 10% discount for the newsletter; an underlined "Email address" field and a full-width white
  "SIGN UP" button; a thin "×" top-right. The page behind is darkened.
- **Clearbit** — a dark navy modal: two small logos joined by "+", headline "See how you can grow with
  Clearbit", a sentence, an email input, a select ("Let us guess based on your email ;)"), a full-width blue
  "Get your Clearbit playbook" button, and a line of customer logos ("Powering the world's most advanced
  companies"); a round "×" at the top-right corner.

p. 302 is a blank separator slide.

**Note:** the slide states no rules; what the four examples visibly share is: page behind dimmed, a box above
the page, a close "×" at the top-right, a short headline, one to three inputs and one primary button.

### For the builder
- A Modal/pop-up component needs: a dimming backdrop, a box layered above the page, a close control at the
  top-right, and a content slot sized for headline + short form + one primary button (p. 301).
- Offer at least the designs the slide shows: plain single panel, split image | form, photo background, and a
  dark variant (p. 301).

---

## Lecture: Building an Accordion Component — Part 2 (pp. 303–304)

Section "Components and Layout Patterns" (title slide p. 303).

**Switching `flex-direction` to column** (p. 304). The slide shows:

```css
.accordion {
  display: flex;
  gap: 24px;
  flex-direction: column;   /* the added line, in bold */
}
```

The diagram stacks boxes 1, 2, 3 vertically; the **MAIN AXIS** arrow runs top → bottom and the **CROSS AXIS**
arrow runs left → right (p. 304). "With flex-direction set to column:" (p. 304)

- `align-items` aligns items **horizontally**, no longer vertically (p. 304).
- `justify-content` aligns items **vertically**, no longer horizontally (p. 304).
- `gap` acts like **margin-bottom**, no longer like margin-right (p. 304).

### For the builder
- A stack (column) and a row are one flex container with the main axis swapped; the alignment controls must
  follow the axis — in a column "align" is the horizontal control and "justify" the vertical one (p. 304).
- The gap control is the space between items along the main axis: vertical in a stack, horizontal in a row
  (p. 304).

---

## Lecture: Building a Carousel Component — Part 2 (pp. 305–307)

p. 305 is blank; p. 306 is the title slide (section "Components and Layout Patterns").

**Vertical centering with absolute position and transform** (p. 307). Code on the slide:

```css
.btn--left {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}

.carousel {
  position: relative;
}
```

The diagram: a pale container (the carousel) with an orange box (the button) against its left edge.
- `top: 50%` **= 50% of parent container's height** — the arrow runs from the container's top to its middle,
  and the box's *top edge* lands there (p. 307).
- `transform: translate(0, -50%)` **= 50% of actual element's height** — the box moves up by half its own
  height; a dashed outline shows where it sat before the transform (p. 307).
- The `0` in `translate(0, -50%)` is annotated "Ignoring the X (horizontal) value" (p. 307).
- The parent `.carousel` is `position: relative` (p. 307).

p. 308 is blank.

### For the builder
- An absolutely positioned child (carousel arrows, badges, overlaid buttons) needs its container as the
  positioning context (`position: relative`) (p. 307).
- "Centre vertically inside the parent" = `top: 50%` (of the parent) + `translate(0, -50%)` (of itself) —
  both percentages, so it stays centred whatever the parent's or element's height at any screen size (p. 307).

---

**Tooling note for the rest of this file:** the PDF-page-image renderer (`pdftoppm`/poppler) is not installed
in this environment, so no slide image could be opened for pp. 308–407 below — every statement comes from the
extracted text layer only, cited as "(text p. N)" using the deck's own page-break markers (accurately
recomputed against the established anchors already cited elsewhere in this distillation, e.g. p. 222, p. 258,
p. 301–302 above — those anchors line up exactly, so the numbering below is trustworthy even without images).
Section 07 ("Omnifood Project Setup and Desktop Version", divider pp. 350–352) opens with the process lecture
this file was asked to cover.

## Lecture: The 7 Steps to a Great Website (text pp. 353–360)

**"THE PROCESS BEHIND BUILDING A WEBSITE"** — seven numbered steps, each its own build-up slide restating the
full numbered list on the left (1 Define · 2 Plan · 3 Sketch · 4 Design and build · 5 Test and optimize ·
6 Launch · 7 Maintain and update) with the current step's detail on the right:

1. **Define the project** (text p. 354):
   - Define **WHO** the website is for — yourself, or a client of your agency/freelance business.
   - Define **WHAT** the website is for — i.e. define the **business** and **user** goals of the project (see
     the UX lecture, file 03 Part 1). Worked example on the slide: *business goal* — "Selling premium dog
     food"; *user goal* — "Finding high-quality dog food for a good price."
   - Define a **target audience** — "be really specific if possible and if it makes sense for your website
     (this can come from your client)." Example on the slide: *"Women, 20 to 40 years old, living in Europe,
     earning over €2000/month, with a passion for dogs."*
2. **Plan the project** (text p. 355):
   - Plan and gather website **content**: copy (text), images, videos, etc. — "content is usually provided by
     the client, but you can also help them produce and find some content (finding free images is easiest;
     charge extra if they want copy written)."
   - For bigger sites, **plan out the sitemap**: what pages the site needs, and how they relate to one another
     (content hierarchy).
   - Based on the content, **plan what sections each page needs** to convey the content's message, and in
     which order.
   - **Define the website personality** (see the Web Design Rules section, file 03 Part 2).
3. **Sketch layout and component ideas** (text p. 356):
   - Think about what components are needed, and how to use them in layout patterns (get inspiration from the
     web-design section — i.e. file 03 Parts 4–7 above).
   - Get ideas out of your head: sketch them with pen and paper, or with design software (e.g. Figma).
   - This is an **iterative process**: experiment with different components and layouts until arriving at a
     first good solution.
   - "You don't need to sketch everything, and don't make it perfect. At some point, you're ready to jump into
     HTML and CSS."
4. **Design and build website** (text pp. 356–357):
   - Use the decisions, content and sketches from steps 1–3 to design and build the website with HTML and CSS
     ("designing in the browser").
   - The layout and components selected in step 3 already exist; this step designs the actual **visual
     styles**.
   - Create the design based on the selected website personality, the design guidelines already taught (file
     02), and inspiration (file 03).
   - Use the client's existing branding wherever possible for design decisions: colors, typography, icons, etc.
5. **Test and optimize** (text p. 358):
   - Make sure the website works well in all major browsers (Chrome, Firefox, Safari, Edge, "maybe even old
     IE").
   - Test the website on **actual mobile devices**, not just in DevTools.
   - Optimize all images, in terms of dimensions and file size (see the Images lecture, file 02).
   - Fix simple accessibility problems (e.g. color-contrast issues).
   - Run the Lighthouse performance test in Chrome DevTools and try to fix reported issues.
   - Think about Search Engine Optimization (SEO).
6. **Launch the masterpiece** (text p. 359):
   - "Once all work is done, everything is perfect, and you got approval from your client (or yourself), it's
     time to share your masterpiece with the world!"
   - Upload the website files to a hosting platform — "there are countless platforms, we will use one with a
     free plan (Netlify)."
   - Choose and buy a great domain name: one that represents the brand well, is memorable and is easy to write.
7. **Maintain and keep updating the website** (text p. 360):
   - "Launching is not the end..."
   - Keep the website content updated over time — for a client, this can become a monthly maintenance contract
     (recurring revenue).
   - Install analytics software (e.g. Google Analytics or Fathom) to get statistics about website users; this
     may inform future changes to structure and content.
   - "A blog that is updated regularly is a good way to keep users coming back, and is also good for SEO."

### For the builder
- These 7 steps are the **project workflow the builder's own UI should mirror**: a site starts from a
  Define/Plan intake (goals + audience + content + sitemap + personality pick), moves into a Sketch/assemble
  phase using the component and layout-pattern gallery (file 03 Parts 4–7), then Design-and-build (styling
  tokens on top of the chosen structure), then a Test/Publish/Maintain loop.
- Step 4's own framing — "the layout and components were already selected in step 3; this step designs the
  visual styles" — is the deck's own justification for keeping **structure and style as separate passes**;
  the builder's own workflow (drop components → then theme/personality/token pass) already matches this.
- Step 5's checklist (cross-browser, **real mobile devices** not just DevTools, image optimization, contrast,
  Lighthouse, SEO) is a literal pre-publish checklist the builder's own "publish" flow could surface: contrast
  check (already required by `CLAUDE.md` rule 17), image compression (file 02 Images rule 11), and a
  Lighthouse-style pass.
- Step 7 (analytics + a regularly updated blog) argues the builder's site output should make adding an
  Analytics snippet and a Blog/News section components as easy as any other block — not an afterthought.

---

## Lecture: Defining and Planning the Project — Steps 1 and 2, applied to Omnifood (text pp. 362–365)

**"YOUR FIRST REAL WORLD PROJECT"** (text p. 362): the course's own worked example — "you were hired to
design and build a website for a fictional company called Omnifood," a startup using AI to create and deliver
custom healthy meal plans, who provided all website content in a `content.md` file.

**Step 1 — Define the project, applied** (text p. 363):
- **Who:** for a client.
- **What:** *business goal* — "Selling monthly food subscription"; *user goal* — "Eating well effortlessly,
  without spending a lot of time and money."
- **Target audience:** "Busy people who like technology, are interested in a healthy diet, and have a
  well-paying job."
- The provided content-file excerpt (quoted verbatim on the slide) frames Omnifood as "a technology company
  first, but with a major focus on consumer well-being through a healthy diet," using an AI-centric approach
  to build custom meal plans and partnering with restaurants/cooking partners to cook and deliver the meals,
  "packed up in a monthly subscription" with a choice of one or two meals per day.

**Step 2 — Plan the project, applied** (text pp. 364–365):
- **Sitemap:** "We will just build a one-page marketing website (oftentimes called a landing page), so no
  sitemap [is needed]."
- **Website personality:** "Based on the tech-centered target audience, as well as the actual product being
  sold, we will use the Startup/Upbeat personality. We might add some elements of the Calm/Peaceful
  personality, since the product is all about consumer well-being as well." (This is the deck's own worked
  example of the "combining playfulness and boldness" trait-injection method already distilled in file 03
  Part 2 — a Startup/Upbeat base with Calm/Peaceful traits injected, matching the SECFI/Mine examples there.)
- **Plan page sections** (heading only on this slide; the actual section list is given on the next lecture's
  slide, reproduced below).

### For the builder
- This worked example is a live demonstration of the exact "define → personality pick" flow recommended above:
  goals + audience were defined first, and the **personality choice was justified by both**, then a second
  personality's traits were consciously **injected** rather than switching personality outright — this is the
  deck's own proof that the builder's personality-preset UI needs the trait-injection dials (file 03 Part 2's
  "For the builder" note) working *in combination*, not as a single exclusive choice.
- "One-page marketing website, so no sitemap" is a legitimate site type the builder must support as a
  first-class starting template (a single long scrolling page built from section components), not force every
  site through a multi-page sitemap step.

---

## Lecture: Sketching Initial Layout Ideas — Step 3, applied to Omnifood (text pp. 365–368)

**"FIRST IDEAS AND SKETCH"** (text p. 367). The Omnifood page's planned section order, exactly as listed on
the slide:

1. Logo / Navigation
2. Hero
3. Featured in
4. How it works
5. Meals (and list of diets)
6. Testimonials + gallery
7. Pricing + features
8. CTA
9. Footer

**Note:** the slide shows this as a plain bullet list (a hand-sketch is described in the lecture title, but no
sketch drawing survived in the extracted text — **Note: not verified from the slide image**).

### For the builder
- This nine-section order is a directly reusable **"Marketing landing page" template preset** for the
  builder's own template gallery, built entirely from the tier-C section components already catalogued in
  file 03 Part 6 (Navigation, Hero, Feature row/Feature box for "How it works" and "Meals", Customer
  testimonials + Gallery, Pricing tables, Call-to-action section, Footer) plus one B-tier "Customer/Featured-in
  logos" component — every single section in this real worked example maps onto a component this
  distillation has already named and catalogued.

---

## Lecture: Responsive Design Principles (text pp. 368–373)

**"WHAT IS RESPONSIVE DESIGN?"** (text p. 370):
- **Responsive design** is "a design technique to make a webpage adjust its layout and visual style to any
  possible screen size (window or viewport size)."
- "In practice, this means that responsive design makes websites usable on all devices, such as desktop
  computers, tablets, and mobile phones."
- "It's a set of practices, not a separate technology. It's all just CSS!"
- A diagram labels the horizontal axis **"VIEWPORT WIDTH."**

**"RESPONSIVE DESIGN INGREDIENTS"** (text p. 371) — four ingredients, each its own quadrant on the slide:
1. **Fluid layouts** — "to allow the webpage to adapt to the current viewport width (or even height)."
   - "Use `%` (or `vh`/`vw`) unit instead of `px` for elements that should adapt to the viewport (usually
     layout)."
   - "Use `max-width` instead of `width`."
2. **Responsive units** — "use the `rem` unit instead of `px` for most lengths[;] to make it easy to scale the
   entire layout down (or up) automatically." *"Helpful trick: setting `1rem` to `10px` for easy
   calculations."*
3. **Flexible images** — "by default, images don't scale automatically as we change the viewport, so we need
   to fix that." "Always use `%` for image dimensions, together with the `max-width` property."
4. **Media queries** — "bring responsive sites to life! To change CSS styles on certain viewport widths
   (called breakpoints)." "We will learn how to use media queries and how to select breakpoints in the next
   section."

**"DESKTOP-FIRST VS. MOBILE-FIRST DEVELOPMENT"** (text p. 372):
- **Desktop first:** "Start writing CSS for the desktop: large screen. Then, media queries shrink design to
  smaller screens."
- **Mobile first:** "Start writing CSS for mobile devices: small screen. Then, media queries expand design to
  a large screen." "Forces us to reduce websites and apps to the absolute essentials."
- The deck's own choice, stated directly: **"We will do desktop-first in this project. It's easier to
  learn!"**

### For the builder
- These four ingredients are, almost verbatim, the project's own "Responsive Field Guide" (`CLAUDE.md` rule
  16): fluid layouts, `rem`/`em`-first units, flexible media, and (the project adds) container queries as a
  fifth, more modern ingredient the deck (2021-era) doesn't cover. This lecture is the deck's own primary
  source for that whole rule, not just an analogy to it.
- The deck's `1rem = 10px` convenience convention is worth exposing as a documented base in the builder's own
  type-scale/spacing token config, purely to make manual token arithmetic easier for anyone reading the
  exported CSS — the tokens themselves should still resolve through `remLen()` as the project's rule already
  requires.
- Flexible images ("always `%` + `max-width`") is the exact rule already recorded from file 02's Images
  lecture (rule 12, same-dimension siblings) and matches `CLAUDE.md` rule 16's "flexible media" ingredient —
  the same requirement recorded from two independent lectures in this deck.
- Media queries are named as *the* mechanism for breakpoints — this is the direct lead-in to the next lecture
  below (How Media Queries Work / How to Select Breakpoints), which supplies the actual numbers.
- **Desktop-first is the deck's own explicit choice** ("easier to learn"), which is notable against this
  project's five-rung responsive model (`CLAUDE.md` rule 18: **"`base` IS desktop... the cascade runs to
  NARROWER screens"**) — the project's own model already follows the deck's recommended direction, cascading
  down from a desktop base rather than up from mobile.

---

## Omnifood build lectures — desktop version (text pp. 373–400)

The rest of Section 07 is a sequence of **practical build-along lectures** — Building the Hero (p. 375),
Building the "How it Works" Section (p. 378), Building the "Featured In" Section (pp. 381–382, which restates
the same nine-section sitemap already quoted above), Building the Meals/Diets Section (pp. 384–388, whose
slide text repeats the flex-direction: column mechanics already distilled in the Accordion lecture above — the
extracted text is visibly garbled here, e.g. "amceaclor-datitonri{butes" for ".meal-attributes {", consistent
with two overlapping text layers on that slide rather than new content), Building the Testimonials/Gallery
Section (p. 388), Building the Pricing/Features Section (p. 391), Building the Call-to-Action Section (p. 394),
and Building the Footer (pp. 397–398). Each is a title-only slide in the extracted text, i.e. these are code
walk-throughs building the actual Omnifood HTML/CSS rather than design-rule lectures, so — consistent with
this file's scope (design *rules*, not the Omnifood code itself) — no rule content was extractable to
distil from them beyond what's already recorded above (the sitemap order, and the flex-direction/column
mechanics). **Note: not verified from the slide image** whether any of these carry a design rule the text
layer failed to capture; a future pass with a working renderer should check them specifically for that reason.

---

## Lecture: How Media Queries Work (text pp. 400–402)

Section 08 divider: "Omnifood Project — Responsive Web Design" (text p. 400).

**"HOW MEDIA QUERIES WORK WITH MAX-WIDTH"** (text p. 401):
- A media query's condition is phrased as a question: `@media (max-width: 600px)` asks **"is width <= 600px?"**
  and `@media (max-width: 1200px)` asks **"is width <= 1200px?"** — "maximum width at which the media query
  still applies."
- Code outside any media query always applies.
- Worked examples on the slide's number line (0px · 400px · 600px · 1000px · 1200px marked):
  - **At a viewport width of 400px**, CSS in *both* media queries applies (400 ≤ 600 and 400 ≤ 1200).
  - **At a viewport width of 1000px**, CSS from only the 1200px media query applies (1000 ≤ 1200, but
    1000 > 600).

### For the builder
- This is the deck's plain-language definition of a `max-width` media query: **"is the viewport ≤ this
  number?"** — confirming that with `max-width` queries, a narrower breakpoint's rules are additive on top of
  (and can override) a wider breakpoint's rules, exactly matching a desktop-first cascade (rule 18's `base` →
  narrower rungs).
- Rules written with no media query at all are the true baseline that always applies — the builder's `base`
  rung is exactly this "outside any media query" tier.

---

## Lecture: How to Select Breakpoints (text pp. 402–404)

**"STRATEGIES FOR SELECTING BREAKPOINTS"** (text pp. 402–404):
- **BAD — based on popular devices:** the slide lists device-width bands **300px–500px, 600px–900px,
  900px–1100px, >1200px** as the *wrong* way to choose breakpoints (chasing specific device widths).
- **GOOD — based on screen-width ranges:** generic round numbers **600px, 900px, 1200px** are given as the
  better, device-independent breakpoint set.
- **PERFECT — when the design breaks:** the best strategy of all, per the slide's own labelling — choose a
  breakpoint **at the exact width where your specific design starts to visually break down**, resizing the
  browser and watching for the failure point, rather than committing to any fixed list up front. The slide
  marks multiple "Design breaks" points along a resized-browser illustration to make this concrete.
- The slide ends **"THE END!"** (text p. 405) — the last content slide of the deck.

### For the builder
- The deck's own **best-practice ranking** is explicit and three-tiered: device-specific breakpoints are BAD,
  generic round-number breakpoints (600/900/1200px) are GOOD, and **content-driven breakpoints — wherever this
  specific design actually breaks — are PERFECT**. This directly validates the project's five-rung model
  (`CLAUDE.md` rule 18: phone · 600 · 900 · 1200 · 1800, in `em`) as sitting on the deck's own "GOOD" tier
  (round generic numbers, not device widths) — with the added instruction that **any individual component or
  page may still need its own extra, content-driven breakpoint** on top of the five shared rungs, per the
  "PERFECT" strategy.
- Since the shared rungs are the "GOOD" baseline and not automatically "PERFECT" for every layout, the
  builder's per-block responsive controls should let a user add a one-off breakpoint where *their* design
  specifically breaks — which is exactly what RULE Q's sweep-and-fix methodology (`CLAUDE.md`) already treats
  as the standard: find where a structure breaks, fix it, rather than trusting the shared rungs are always
  sufficient.
- The three named breakpoint values (600, 900, 1200) match this project's own five-rung ladder's middle three
  rungs almost exactly (600 tablet-portrait, 900 tablet-landscape, 1200 desktop) — confirming the project's
  ladder already follows the deck's "GOOD" strategy rather than inventing its own numbers.

---
