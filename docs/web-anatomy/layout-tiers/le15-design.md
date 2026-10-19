---
title: LE-15 design — ready-made sections, saved sections, global sections, pages from a template (for the user to sign)
---

# LE-15 design (2026-10-19) — FOR THE USER TO SIGN before any `.feature`

Covers ED-4+ (2): the section gallery, and PS-5: (1) save a section, (2) a global section, (3) a new page from a template.
Sources: `baseline-le15-sections.md` (§1 the counts, §5 PS-5), `LAYOUT_BENCHMARK.md` (B1–B31, C1–C12),
`docs/layout-benchmark/STRUCTURES.md`, `section-kinds.tsv` (partial), `research-archive.md`, and the 241 Wix Studio tiles
stored under `educo-uat-harness/builders/wix-studio/add/`.

## 1. The bar (RULE BEST)

| Builder | Ready-made sections in the editor | Save · global · page template |
|---|---|---|
| **Wix Studio** (the leader, counted in the product) | **241**: 139 designed in 14 categories and 102 wireframes in 10 categories (24 categories), plus 13 design kits | Save as Asset · Set as Global (green in Layers, Detach) · designed pages, no "save page as template" |
| Webflow (public figure) | 34 in 9 categories; no CTA, FAQ or contact category | components (Unlink Instance) · up to 40 static page templates (copies) |
| Framer (counted in the product) | 0 (its AI agent and the Marketplace instead) | components + Library · 14 page templates · layout templates with a content slot |

## 2. What the builder has today (measured 2026-10-19)

- **No** section gallery, **no** saved sections and **no** page templates in the box builder (`/website/box-demo`). The "Add"
  panel (`BlocksPanel.tsx`) adds single blocks. Its only section-sized tiles are Hero and Rotating hero.
- **To reuse (RULE M, rung 2):**
  - `NodeThumb` in `DesignGallery.tsx` already draws a live preview of any block tree (RULE S).
  - `heroSection`, `photoGallery`, `photoSlider`, `tableGrid` and `blockForKind` (`lib/box-presets.ts`) already build sections.
  - The 7 catalogue components (accordion, alert, card, quote, stat, badge, rating) already exist.
  - `syncSharedRegions` (`lib/box-site.ts:122`) already keeps a LINKED header and footer the same on every page. A global
    section is the same mechanism, generalised to any section.
  - `addPage` and `duplicatePage` already exist (`lib/box-site.ts`).
- The legacy builder (`lib/site-storage.ts`) has 9 section types, 6 page templates and `AddPageModal`. That builder is
  being left behind, so these are read for their school copy only. No code is carried over.
- The phone and tablet app opens the same editor in a webview (`apps/mobile/lib/site-editor.ts`). What is built here
  reaches the app. The only app work is touch: a tap inserts where a mouse would drag.

## 3. The "enough" checklist (RULE RS / RULE MAP)

| # | What the design needs | Status |
|---|---|---|
| 1 | The leader's count, by category, measured in the product | COVERED: Wix Studio 241 in 24 categories; Framer 0; Webflow 34 (public; no account, accepted) |
| 2 | What a section of each category looks like, at taste level | COVERED: all 241 Wix tiles stored as pictures; the Awwwards / Framer / Webflow archive |
| 3 | The structures each category uses, and their phone reflow | COVERED: B1–B31 with tablet and phone rules; 348 structures in `STRUCTURES.md`. The per-kind phone shape follows from `SECTION_KINDS.md` when the archive pass ends; it refines the defaults and does not block the design |
| 4 | Which kinds real sites use, and how often (the mix) | COVERED (partial, 10,663 sections so far): header 923 · footer 487 · hero 414 · contact 164 · features 149 · gallery 134 · pricing 119 · blog 119 · CTA 115 · stats 88 · testimonials 63 · logos 49 · team 47 · FAQ 45 · newsletter 40 · events 24 |
| 5 | The school sections the leaders lack | COVERED: FAQ · pricing / fees · events · admissions · stats · contact · news (C2, C9, C11, `COMPONENT_GAPS.md`) |
| 6 | Save, global and page-template behaviour in each leader | COVERED: §5 of the baseline, exact UI words |
| 7 | The axes of a section: category × structure × finish × theme × personality, plus interaction | COVERED: §4 below |
| 8 | Components a section needs that the builder lacks | KNOWN GAPS (RULE C: a clearly marked placeholder, listed in `COMPONENT_GAPS.md`): forms (contact, newsletter, enquiry) · map · calendar · real pricing and fee tables · logo strip · tabs. A section that uses one says so on its tile ("placeholder: form") |
| 9 | Pictures for designed sections | NOT COVERED: the project holds no stock pictures. **Decision D6** |
| 10 | Accessibility per section | COVERED by the rules already in force: each section publishes `<section aria-labelledby>` (header / footer as landmarks); heading levels follow the page (semantic-pages decision); contrast is asserted in all four themes |
| 11 | RULE AF (weight, 360px, slow 3G) | COVERED by the rules already in force: pictures sized to their width and lazy below the fold; each section's weight printed by the sweep |

## 4. ED-4+ (2) — the section gallery

**The axes (RULE T: they combine rather than replace):**
1. **Category.** 27 categories: every Wix category plus the school ones (table below).
2. **Layout.** The structure within a category, e.g. split 50/50, centred, full-bleed, with a form, with tiles.
3. **Finish.**
   - **Wireframe:** neutral tokens, "Title goes here" copy and grey picture boxes, as Wix does.
   - **Designed:** the same tree with a finish applied: colours, type pairing, radius, shadow, background and real school copy.
4. **Personality** (RULE P): 7 finishes, one per personality (serious · minimalist · plain · bold · calm · startup · playful).
   - A designed tile shows the personality that suits its category best.
   - The **"Finish" chooser** at the top of the gallery re-draws every tile in another personality, so 302 layouts × 7
     finishes can all be seen before inserting.
5. **Theme.** Light, dark, midnight and purple come from tokens, so a section follows the site's theme with no copies.

**The count, by layouts.** A finish or a theme is never counted as another section.

| Group | Categories (layouts) | Wix equivalent |
|---|---|---|
| Navigation | Headers 8 (B1–B6, announcement bar B4) · Footers 19 (B30) | Headers 7 · Footers 12 + 7 |
| Opening | Hero / Welcome 36 (B7–B12) · Blank 1 | Welcome 16 · Hero 20 · Blank 1 |
| Story | About 16 · Text 8 · Features / Services 20 (B14–B15) · Spotlight / zig-zag 17 (A8) | About · Text · Services · Spotlight |
| Showing | Cards 21 · Programmes / Products 12 · Gallery / Collage 14 (B28, A6, A7) · Slideshow 7 | Cards · Products · Projects + Collage · Slideshow |
| People and trust | Team 10 (B21) · Testimonials 8 (B17) · Logos / Clients 8 (B13) · Stats 8 (B16) | Team · Testimonials · Clients |
| Action | CTA / Banner 17 (B20) · Contact 8 (B25) · Newsletter 4 (B26) | Banner 10 + 7 · Business Info |
| School | FAQ 8 (B19) · Pricing / Fees 8 (B18) · Events 8 (B23–B24) · Admissions steps 6 (C11) · News 8 (B22) · List 5 | List 5 |
| Interactive | Hover 10 · Click 7 (tabs, accordion, reveal) | Hover 10 · Click 7 |
| **Total** | **302 layouts in 27 categories**, each in wireframe AND designed: 604 tiles before personalities | 241 |

**The user's conditions on D1 (signed 2026-10-19):**
- **(a) Motion included.** Every designed section carries its entrance and hover effects from what the builder has now:
  the Inspector's Entrance and Hover galleries, and the sticky, pinned, scroll-snap and slider behaviour. Reduced motion
  gives a still version, and every hover has a keyboard focus and touch equivalent. The Interactive categories (Hover 10 ·
  Click 7) are built on it. As each effects batch (VE-1 … VE-13) lands, the gallery's sections are updated with it in the
  same change.
- **(b) The best out there, measured.**
  - **The reference:** each designed section is made against its kind in the award-site archive (`section-kinds.tsv`:
    its shapes, look and motion) and the Wix tile.
  - **The audit:** each is checked by `page-audit.js` on the design rules (type 16–32px, line length, spacing scale,
    contrast 4.5:1, at most two families) and by RULE P (one personality per finish).
  - **The look:** each one is checked HEADED at every width of `screens.js`, with canvas == Preview.
  - **Below the bar:** a section that falls short is a ledger line, not a tile.
- **(c) Everything editable.**
  - **Ordinary blocks:** an inserted section is ordinary blocks. Every word, picture, colour, space, radius, border,
    shadow, effect and per-device setting can be changed with the controls that already exist, and blocks can be added,
    moved or deleted inside it.
  - **Guarded:** a guard enumerates every section in `config/sections/` and fails on any node the Inspector cannot
    select or edit.

**How a person uses it:**
- **Opening it.** The "Add" panel gains a **Sections** group: categories down the side, a gallery of live tiles (`NodeThumb`, RULE S).
- **Controls.** Wireframe | Designed, and the Finish (personality) chooser. Search finds sections by name and category.
- **Inserting.** A click or Enter inserts the section after the selected section, or at the end of the page; a drag
  drops it where it is let go. On touch, a tap inserts. The keyboard reaches every tile.
- **How it is stored.** It goes through the same add pipeline as any block (the tree a user would build, RULE Y). Once in,
  it is ordinary blocks: every word, picture, space, radius and per-device setting can be changed. Nothing about it is special.
- **Responsive.** Each layout carries its tablet and phone reflow from its B-pattern (e.g. zig-zag puts the picture first
  on a phone; four logos go 2 × 2). It is checked at every width of `screens.js`, with canvas == Preview.
- **Data, not code (RULE CFG).** Every section is a JSON tree in `config/sections/<category>.json`. The finishes are in
  `config/section-finishes.json` and the copy in `config/section-copy.json` (translatable, RULE AF). Adding a section is a
  config edit. A guard enumerates the config and fails on any section that does not build, overflow-check or contrast-check.

## 5. PS-5 — save, global, page from a template

**(1) Save a section to reuse** (the leader: Wix "Save as Asset"):
- **How you save it:** right-click a section, or use the Inspector or `Ctrl+Alt+S` → **"Save as my section"** → a name.
- **Where it appears:** in the gallery under **My sections**, as a live tile. Rename and delete are there too (full CRUD, Rule B).
- **What is saved:** a COPY. Changing it later changes nothing already placed.
- **Scope (D4):** saved for every site on this account. The cap (250, as Squarespace) lives in `config/sections.json`.

**(2) A global section, edited once** (the leader: Wix "Set as Global"):
- **Making one:** "Make global" on a section, then a name. Header and footer are already global by `syncSharedRegions`;
  this generalises it to any section.
- **Placing it:** a **Global sections** list in the gallery: "Add to this page", "Used on N pages".
- **Editing it (D3):** in place on any page; the edit reaches every page at once.
- **How it is marked:** in Layers and on the canvas by **colour AND an icon and the label "Global · <name>"** (never
  colour alone, WCAG 1.4.1). Before the first edit of a global section on a page, a one-line notice says "This changes N pages".
- **Detaching:** **"Detach"** makes it an ordinary copy on this page. Undo re-attaches it.
- **Published output:** each page gets plain HTML; nothing is linked at run time.

**(3) A new page from a template** (Webflow: up to 40 · Framer: 14):
- **The Add page dialog:** Blank · Duplicate this page · **Page templates**, shown as live page tiles.
- **12 built-in templates,** composed from the gallery's sections:
  - school home C2
  - landing C1
  - about C3
  - news index C4
  - article C5
  - fees / pricing C6
  - contact C7
  - gallery C8
  - events C9
  - admissions C11
  - staff directory C12
  - FAQ
- **Each is offered in two finishes:** wireframe and designed.
- **Saving your own:** **"Save page as template"** saves a page; your own are capped at 40, as Webflow, in config.
- **What a new page is:** a COPY (as Webflow and Squarespace). It takes the site's header, footer and global sections as linked.
  Framer-style linked layout templates (a content slot) → **Nice**, later.

**Keyboard (rule 2), all in config:**

| Shortcut | Action |
|---|---|
| `Ctrl+Alt+S` | save section |
| `Ctrl+Alt+G` | make global (`Ctrl+G` is already Group) |
| `/` | in the Add panel, search |
| Enter | insert the focused tile |

## 6. The batches (RULE X: at most 6 changes each; RULE PROGRESS)

302 layouts do not fit one batch. Proposed:

| Batch | Changes |
|---|---|
| **LE-15** | (1) the design (this) · (2) the gallery engine, the Sections panel, the finishes, and Headers + Hero + Footers + Blank (64 layouts, the most-used kinds) · (3) PS-5 save · (4) PS-5 global · (5) PS-5 page templates (the 12 arrive as their sections do; the mechanism and "save page as template" now) · LE15-27 the menu marks the current page |
| **LE-15b** | About · Text · Features · Spotlight · Stats · CTA (86) |
| **LE-15c** | Cards · Programmes · Gallery · Slideshow · Team · Testimonials (72) |
| **LE-15d** | Logos · List · Contact · FAQ · Pricing · News (45) |
| **LE-15e** | Events · Admissions · Newsletter · Hover · Click (35), and the 12 page templates complete |

**What this adds to the area:** 4 batches, 23 changes. The layout essentials go from 14 of 67 changes left (21 %) to
37 of 90 left (41 %).

## 7. Decisions — SIGNED BY THE USER 2026-10-19

| | Signed |
|---|---|
| D1 | 302 layouts in 27 categories, each with its transitions and effects, at award-site quality, everything editable (§4) |
| D2 | Wireframe + designed; the 7 personality finishes |
| D3 | In place: one edit updates every page. A global section can be placed several times on one page. Detach edits just that one. Everything inside it (blocks, components) is editable |
| D4 | My sections in every site of the account, each shown as a live preview before it is used; the site's Preview before publishing |
| D5 | Designed padding from the spacing tokens, drawn, adjustable to any value including zero |
| D6 | About 40 free-licence photos, recorded with their licence, developing countries first (RULE AF); no drawn-shape alternative. The Image / Photo component stays with the components work (CP-n) |
| D7 | LE-15, then LE-15b … LE-15e |
| D8 | Nice, later: BATCH L-24 |

The recommendations as proposed:

| | Decision | Recommended |
|---|---|---|
| D1 | The count | **302 layouts in 27 categories** (every Wix category + the school ones), counted by layout, never by finish. The alternative is exactly 241 |
| D2 | Wireframe + designed | **The same tree, two finishes**, plus the personality chooser (7 finishes) |
| D3 | Editing a global section | **In place, everywhere at once**, with the "changes N pages" notice; Detach makes a copy |
| D4 | Where "My sections" lives | **Every site on this account**. The alternative is this site only |
| D5 | Space inside a ready-made section | **It carries its designed padding and gap**, like a chosen Card or preset carries its radius. This is a design someone picked, so "no space unless you add it" is not broken. The space is drawn on the canvas and adjustable to zero. The alternative is to arrive with none (a section with no padding looks broken). The space rule has changed twice, so this is asked, not assumed |
| D6 | Pictures for designed sections | **A small CC0 set** in `public/sections/` (≈ 40 photos of schools, people and buildings, WebP, ≤ 40 KB each at 800 px, `srcset` + lazy). The alternative is illustrations / duotone shapes only (lighter, less real) |
| D7 | The batch split | **LE-15 + LE-15b … e** as in §6 |
| D8 | A shared page FRAME with a content slot (Framer's layout templates: e.g. a side menu designed once beside every page's own content) | **Nice**, later; Must covers copies + shared header / footer + global sections. NOT the linking of pages to each other: that is built (pages, "…or jump to a page" links published as `about.html`, the shared header and footer of LE-8) and Must; its one gap is LE15-27 |

**LE15-27 (found 2026-10-19, answering the user's question on linked pages):** the published menu never marks the page the
visitor is on. `hrefFor` (`lib/box-export.ts:111`) turns `page:<id>` into the page's file, but nothing sets
`aria-current="page"` or a visible "current" look on the link to the page being rendered. Webflow, Wix and Framer all do this.
→ BATCH LE-15, Must.
