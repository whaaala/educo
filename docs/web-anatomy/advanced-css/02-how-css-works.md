# How CSS works behind the scenes (section 2)

Advanced CSS and Sass, the conceptual section. Distilled from the transcripts the user shared on 2026-10-01. Each part
says what it means for the builder, which GENERATES the CSS a browser runs this way.

## Lecture 7 — what happens to CSS when a page loads

1. The browser loads the HTML and **parses** it, line by line, into the **DOM** (Document Object Model): the document as
   a family tree of parents, children and siblings.
2. While parsing it finds the stylesheets in `<head>`, loads them and **parses the CSS** in two steps:
   - **the cascade** resolves conflicting declarations (next lecture);
   - **final values are processed** — e.g. a margin of 50% turned into pixels. Relative units can only be computed ON
     THE USER'S DEVICE, because 50% of a phone is not 50% of a wide screen.
3. The result is stored as the **CSSOM** (CSS Object Model), a tree like the DOM.
4. DOM + CSSOM = the **render tree**.
5. The **visual formatting model** lays the render tree out — box model, floats, positioning (a later lecture).
6. The page is **painted** to the screen.

**For the builder:** the export is plain HTML + one stylesheet the browser parses this way, so everything it emits is
judged by what this pipeline does with it on the visitor's device:
- every relative length (`%`, `rem`, `cqw`, `clamp()`) is computed at step 2 on the visitor's screen — which is WHY the
  builder stores rem/% and never a pixel (rule 16): the same page is right at 360px and at 1920px;
- stylesheets in `<head>` block rendering until parsed — another reason for RULE AF's small CSS budget
  (≤ 100 KB code per page) on slow networks.

## Lecture 8 — the cascade and specificity

**Terms.** A RULE = a selector + a declaration block; a DECLARATION = a property + its **declared value**.

**The cascade** combines every stylesheet and resolves conflicts when more than one rule sets the same property on an
element. Sources: **author** (the site's CSS), **user** (e.g. the reader's chosen font size), **user agent** (browser
defaults — a link is blue and underlined). The winner is decided, in order, by:

1. **Importance (source)**, most important first: user `!important` · author `!important` · author · user · browser.
2. **Specificity** of the selector, counted per category, compared left to right:
   `(inline, IDs, classes + pseudo-classes + attributes, elements + pseudo-elements)`.
   `.button` = 0,0,1,0 · `nav#nav div.pull-right .button` = 0,1,2,2 · `a` = 0,0,0,1 · `#nav a.button:hover` = 0,1,2,1
   → the 0,1,2,2 rule wins. The universal selector `*` is 0,0,0,0.
3. **Source order** — on a full tie, the LAST declaration written wins.

The winning value is the **cascaded value**.

**Rules of thumb from the lecture:** `!important` only as a last resort (look at specificity first); inline styles beat
any stylesheet; one ID beats any number of classes, one class beats any number of elements; rely on specificity rather
than order, so rearranging the CSS does not change the page — EXCEPT a third-party sheet (a reset), which must come
FIRST so the site's own sheet can override it.

**For the builder** (its traps are recorded in memory `reference_css_cascade_traps.md`):
- the CANVAS writes inline styles (highest specificity) while the EXPORT writes one class per block (`.bx-<id>`) — the
  same resolver feeds both, but a rule meant to override must account for that: container-query rules carry
  `!important` precisely because the canvas is inline (`box-model.ts` ~3334);
- unlayered CSS in `globals.css` beats every Tailwind utility (Tailwind v4 puts utilities in `@layer`) — cascade
  LAYERS sit above specificity in today's cascade, a step the 2017 course predates;
- the export orders its stylesheet base → components → per-block rules → per-rung `@media` / `@container`, so a later,
  equally specific per-device rule wins by source order — the one place the builder deliberately relies on order.

## Lecture 8b — specificity in practice (a CodePen)

Four rules colour one button: `.button`, `a`, `body div.pull-right nav#nav a.button` (or similar), and
`#nav a.button:hover`. Two lessons:
- **`!important` beats specificity** — even `a { … !important }`, about the weakest selector there is, wins. Needing it is
  a sign the CSS should be restructured, not patched.
- **A `:hover` rule must be AT LEAST as specific as the rule it overrides.** The pseudo-class counts as one class, but the
  resting rule had two more ELEMENT selectors, so the hover never applied — the button did not turn yellow. Copying the
  resting selector and adding `:hover` made it win. "My hover does nothing" in a complex navigation is usually this.

**For the builder:** every hover / focus effect is emitted as the block's own class plus the pseudo-class
(`.bx-<id>:hover`), one step more specific than its resting rule, and on the CANVAS — where resting styles are INLINE and
beat any stylesheet — an interaction has to be written so it still shows (the "two canvas ≠ export traps" in memory
`feedback_interactions.md`). Same lesson, and the reason the interaction guards drive the hover in a browser rather than
reading the CSS.

## Lecture 8c — how values are processed; the units

**Six steps from what is written to what is drawn** (example: `p { width:100px }`, `.amazing { width:66% }` in a 280px
section):
1. **declared** — every value written for the property (100px, 66%);
2. **cascaded** — the cascade's winner (66%: the class is more specific);
3. **specified** — if nothing was cascaded: the INHERITED value for an inheriting property, otherwise the property's
   **initial value** (`padding: 0`);
4. **computed** — relative units turned into px where they can be (so they can be INHERITED), keywords resolved
   (`orange`, `bolder`); a % width stays a % here;
5. **used** — values that need the LAYOUT are resolved (66% of 280px = 184.8px);
6. **actual** — rounded to what the device can draw (185px).

Every property on every element HAS a value, written or not: the cascaded one, else inherited (font properties), else
the initial value. The page's root font size, unwritten, is the browser's **16px** — a user-agent value, and the one a
reader changes when they set a larger text size.

**The units — what each is measured against:**

| Unit | For a FONT size | For a LENGTH (width, padding, margin…) |
|---|---|---|
| `%` | the PARENT's font size (`150%` of 16px = 24px) | the PARENT's **WIDTH** — vertical padding and margin too (10% of a 1000px parent = 100px) |
| `em` | the PARENT's font size (`3em` × 24px = 72px) | the element's OWN font size (`2em` × 24px = 48px) |
| `rem` | the ROOT font size (`1.5rem` × 16px = 24px) | the ROOT font size (`10rem` = 160px) |
| `vh` / `vw` | 1% of the viewport height / width | 1% of the viewport height / width (`90vh`, `80vw`) |

Why size LENGTHS in em/rem: change one font size and every length that depends on it follows — the whole layout scales
together (the project does this later).

**For the builder** — this lecture is the reasoning behind rule 16's hierarchy, and the builder already follows it:
- **rem first** for type, spacing, radii, shadows, heights — so a reader's 16px → 24px (step 3's user-agent value)
  grows the whole page; the 150% text check (WCAG 1.4.4) proves it on every swept page;
- **% where relative to the PARENT** — column widths, and line gaps as a share of the line (`marginLeftPct`), because a %
  margin is measured on the parent's WIDTH and so adds up with the widths at every size;
- **em inside components** — a component's text and parts are `em`, so its size follows the font size set on its
  wrapper (the inspector's size control);
- **viewport units** — the builder uses `svh` (the small viewport, stable when a phone's toolbar hides) for screen-high
  sections, and container units (`cqw`) rather than `vw` for fluid terms, so a block adapts to ITS box (rule 16);
- **px only for a 1px hairline** — every other px is computed on the visitor's device (step 4–6), never stored.

## Lecture 8d — inheritance

**Inheritance passes a property's value from a parent to its children** — but only when NOBODY (author, user or browser)
gave the child a value. For each property on each element: a cascaded value? use it. Otherwise, is the property
inherited? → take the parent's **COMPUTED value**; if not → the property's **initial value**.

- **What is inherited is the computed value, not the declared one.** `line-height: 150%` on a 20px parent is inherited as
  **30px** — a 25px child gets 30px, not 150% of 25px. (A UNITLESS line-height, `1.5`, inherits as the ratio.)
- **Text properties inherit** (font family, size, weight, colour, line-height, letter-spacing…); **box properties do not**
  (margin, padding, border, width…) — a section's margin on every child would make no sense.
- `inherit` forces a property to inherit; `initial` resets it to its initial value.
- Inheritance means less code and code that is easier to maintain: set type once on a parent.

**For the builder:** typography cascades from any container (memory `feedback_twelve_columns.md`) — set on a section, it
reaches every block inside unless a block sets its own. Its line-heights are **unitless** tokens (`--eu-leading-*`: 1.15,
1.3, 1.5, 1.7), so a heading and the body text under one container each keep their own proportion — the 30px trap above
cannot happen. Spacing, borders and radii are per block and never inherited, as the lecture says they should be.

## Lecture 8e — the visual formatting model (the rendering phase)

The algorithm that turns every element of the render tree into a BOX and lays the boxes out. It weighs: the **box model**
(dimensions), the **box type** (block / inline / inline-block), the **positioning scheme** (normal flow, floats,
absolute), **stacking contexts**, the other elements in the tree (parents, siblings), and outside facts (viewport size,
image dimensions).

**The box model.** Content (text, images; `width`/`height`) → **padding** (space inside the box) → **border** → **margin**
(space OUTSIDE, between boxes). The **fill area** — where `background-color` / `background-image` paint — is content +
padding + border, never the margin. Default sizing (`content-box`): the drawn width = left border + left padding + width
+ right padding + right border (height 100px + 20px padding top and bottom = 140px). With **`box-sizing: border-box`** the
width/height you set IS the drawn size and padding/border eat into the content instead.

**Box types** (set by `display`):
- **block** (`block`, and `flex`, `list-item`, `table`…) — takes 100% of the parent's width, breaks the line before and
  after, stacks vertically; `p`, `div` by default;
- **inline** (`inline`) — only as wide as its content, no line breaks, sits in a line of text; `width`/`height` do NOT
  apply and only HORIZONTAL padding and margin do;
- **inline-block** — inline on the outside (content-wide, no line breaks), block inside (the full box model applies).

**Positioning schemes:**
- **normal flow** — no float, not absolute (`position: relative` is still normal flow): boxes in source order;
- **floats** — taken out of the flow and pushed left/right until they touch the container or another float; text and
  inline content wrap round them; the container does NOT grow to hold them (clearfix needed);
- **absolute / fixed** — out of the flow, no effect on anything around them, may overlap; placed with `top` / `right` /
  `bottom` / `left` against the nearest POSITIONED ancestor (fixed: against the viewport).

**Stacking contexts** decide what paints over what: layers in a stack, higher layers over lower ones. `z-index` on a
positioned element creates one — but so do `opacity` < 1, any `transform`, `filter`, and other properties. That is why
"the z-index does nothing" sometimes: the element is trapped in a stacking context its parent made.

**For the builder — each of these is a rule it already lives by, several learned through bugs:**
- **box model** — `border-box` everywhere (reset covers `::before`/`::after`); the selection outline sits on the PAINTED
  box and outer spacing is a MARGIN outside it (S-2 (5)), exactly the fill-area / margin split above;
- **box types** — blocks are laid out with flexbox and grid (block-level boxes); a Button and a Link hug their content as
  inline-level things do;
- **positioning** — *In the layout* = normal flow; *Floating* = `absolute` against its section; *Floats on screen* =
  `fixed`; *Sticks when reached* = `sticky`. The builder never uses `float` for layout; text wrapping round a picture is
  not offered (a possible GAP to note — AC-8);
- **stacking** — one z scale for the whole page (`lib/educo-ui/stacking.ts`, `PAGE_Z`: sticky 30, toast 60…). The
  lecture's trap is live in two places: (1) F1-b (2026-10-01) — a sticky header and a sticky sidebar at the SAME z (30)
  painted in source order, so the sidebar covered the header; fixed by raising the page's bar one step (`pagePinCover`);
  (2) a `transform` or `filter` on an ancestor (a tilt, the glass design, an entrance mid-play) also becomes the
  CONTAINING BLOCK of a `fixed` descendant — measured as #144 (`capturesFixed` in `box-model.ts`) — the positioning
  cousin of the stacking-context trap.

## Lecture 9 — CSS architecture: think, build, architect

**THINK — component-driven design.** Before writing code, divide the page into **components**: the building blocks of
the interface, held together by the page's overall layout. A component is **reusable** (across the project and across
projects — a library) and **independent** (it does not depend on its parent; it works anywhere on the page). Related:
Brad Frost's atomic design (atoms → molecules → organisms).
→ the project's RULE C (elements → components → section components → layout patterns → pages) and RULE APP (one
catalogue for the builder and the Educo app); independence is what the enumerating guards assert (a component dropped
anywhere behaves the same — F-1's catalogue guard is one).

**BUILD — consistent class naming with BEM** (Block Element Modifier):
- **block** — a standalone component, meaningful on its own (`.recipe`, `.btn`); blocks may nest;
- **element** — a part of a block with no meaning alone, named after its block (`.recipe__info`, `.recipe__stats`);
- **modifier** — a flag for a different version of a block or element (`.btn--round`).
Every selector is ONE class, never nested, so specificity stays low and flat (lecture 8) — the main reason BEM keeps CSS
maintainable. The markup reads as a map of how its parts relate.
→ `HAVE` — the component CSS is BEM (`eu-accordion__item`, `eu-accordion__header`, `eu-btn`, variant suffixes such as
`--raised`), and every block carries one class `bx-<id>`; nobody types class names in the builder.

**ARCHITECT — files and folders: the 7-1 pattern** (Hugo Giraudel): seven folders of partial Sass files, one main file
importing them into one compiled stylesheet. `base/` (project-wide definitions) · `components/` (one file per component) ·
`layout/` (the overall layout) · `pages/` (page-specific) · `themes/` (visual themes) · `abstracts/` (variables, mixins —
output nothing) · `vendors/` (third-party). Use only the folders a project needs.
→ the builder's equivalent is its CSS layers: tokens (`abstracts` + `themes`), base, layout (the engine's resolvers),
components (the catalogue), per-page block rules — see memory `project_css_coverage.md`; the export compiles them into one
shared stylesheet plus each page's own rules.

## Lecture 10 — the Natours header converted to BEM

How the classes are decided, applied to the header built in lectures 1–5:
- **block** `header` — a standalone component; its parts are ELEMENTS named after it: `header__logo-box`, `header__logo`,
  `header__text-box` (each only makes sense inside this header, at this size, with this image);
- **block** `heading-primary` — the h1 could be reused on a page without this header, so it stands alone; its two lines
  are MODIFIERS, `heading-primary--main` and `heading-primary--sub` (different versions of the same block);
- **block** `btn` — reused across the page; `btn--white` and `btn--animated` are modifiers (flags).
The rule of thumb it teaches: ask "would this make sense anywhere else?" — yes → a block; no → an element of the block
it lives in; "a different version of something" → a modifier.

→ For the builder this is the same question its catalogue answers: a CATALOGUE component is a block (usable anywhere,
RULE C); the parts inside a component are its items (elements); variants / designs are modifiers (RULE S/T, the design
gallery). The two-line heading (AC-4) would be a heading block with two styled parts — exactly BEM's block + modifiers.
