# The page grid — what designers draw (Dribbble shots, RULE MAP step 5: taste)

Source: `C:\Users\eyite\educo-research\grid\r3-v2.json`, records whose `item` contains `dribbble.com` and that have a
non-empty `shotImages` array, taken as they stood at the start of this pass: **21 records, 102 images, every image
opened.** Images live in `C:\Users\eyite\educo-research\grid\shots-v2\` and are cited by their `-imgN` suffix.
These are **designs (Figma/PSD mockups), not live sites**: what they show is intent, not CSS. Axis names (A1–A15)
are those of [01-builders-and-systems.md](01-builders-and-systems.md).

Every record's `text` is Dribbble's boilerplate ("X designed by Y. Connect with them on Dribbble…"), so **no
designer described their grid in words**; the only grid statements are the ones drawn on the images (3 records).
Many shots carry the Dribbble "Start a Project Brief" banner and, in tall ones, Dribbble's own menu over part of the
page; neither hides anything that changes a reading below unless noted.

Items processed (21):

1. https://dribbble.com/shots/9097693-Freebie-1200px-12-Columns-Grid-PSD
2. https://dribbble.com/shots/24784508-Website-with-12-Column-Grid-System
3. https://dribbble.com/shots/2114936--PSD-Bootstrap-12-columns-grid-for-artboards
4. https://dribbble.com/shots/26979419-Editorial-Longread-Design-Kingdom-of-Norway
5. https://dribbble.com/shots/24074422-Minimal-blog-post-Untitled-UI
6. https://dribbble.com/shots/25396424-Website-Grid-System
7. https://dribbble.com/shots/26661884-Mental-Health-Clinic-Web-Design-Bloom
8. https://dribbble.com/shots/26809973-12-Column-Layout-F1-Hero-Section
9. https://dribbble.com/shots/26673111-Healthcare-Website-Design
10. https://dribbble.com/shots/27044825-Education-app-design
11. https://dribbble.com/shots/26268108-Education-App-Design-Concept
12. https://dribbble.com/shots/26683195-MySales-CRM-Dashboard-Tablet-Version
13. https://dribbble.com/shots/27724737-Bruno-Larvol-Founder-Personal-Brand-Portfolio-Website-Design
14. https://dribbble.com/shots/27724831-Havis-Industrial-Equipment-Manufacturer-B2B-Website-Design
15. https://dribbble.com/shots/26572109-AspiroFit-Branding-Design-System-UXUI-CRO
16. https://dribbble.com/shots/27724756-RVWA-Nonprofit-Membership-Organization-Website-Design
17. https://dribbble.com/shots/26451261-Neon-Planet-404-Ledger-style-Error-Page
18. https://dribbble.com/shots/26739614-Mobilin-Landing-Page-Car-Used
19. https://dribbble.com/shots/27046172-HelloUI-Design-System-for-SaaS-Enterprise-Products
20. https://dribbble.com/shots/27649708-Mental-Health-Clinic-Web-Design
21. https://dribbble.com/shots/26585586-Plantify-Website-E-Commerce-Plant

Spans below are estimated from the drawn overlay where there is one, otherwise by measuring the block against the
content width and rounding to twelfths (±1 column).

---

## Per shot

### 1. Freebie — 1200px 12 Columns Grid PSD (Cuneyt Erkol) — 1 image
- **img1** — 12 dark-blue column bands drawn over the whole artboard (1200px container, centred; gutters narrow,
  roughly ¼ of a column). Magazine block: **lead photo + headline 8 of 12**, **side list 4 of 12** with three stories,
  each **thumbnail 1 + text 3** inside the 4 (a nested split on the same lines). Title block centred over the middle
  6. One grid through the whole artboard. No bleed, no mobile.

### 2. Website with 12-Column Grid System (Sekar Station) — 2 images
- **img1** (overlay on) / **img2** (same, overlay off) — 12 pink columns, outer margin ≈ 2.5% each side, gutter ≈ ¼
  column. **Heading cols 1–5** (left), **tagline starts col 7** (2 columns wide, top-aligned with heading, empty col 6
  between); two artwork cards **3 + 3 at cols 7–9 and 10–12**; two stats **3 + 3 at cols 1–3 and 4–6** at the bottom.
  So the hero is a **6 | 6 split, each half subdivided 3 + 3**, with the heading floating free in the top-left half.
  The pair of images shows the designer's own check: the overlay on, then off, same layout.

### 3. [PSD] Bootstrap 12 columns grid for artboards (Andrii Klenin) — 1 image
- **img1** — a teaching diagram, not a page: rows of light-blue blocks **12×1, 6×2, 4×3, 3×4, 2×6, 1×12** (the
  equal divisors of 12). Confirms the vocabulary designers carry: only the divisors of 12, all equal.

### 4. Editorial Longread — Kingdom of Norway (Komkano) — 6 images
- **img1** — hero is a photo card **inset from the viewport with rounded corners** (the photo also continues blurred
  behind it — a "frame inside a bleed"). Heading + intro start col 2 and span ~4; two stats (5.6 million / Oslo) side by
  side ~3 + 3; nav right-aligned in the last 1–2 columns.
- **img2** — the overlay: **12 pink columns** over a longread page. The headline "Ja / vi elsker / dette / landet ." is
  a **staircase**: each line starts **one column further right** (offset starts as typography). Photos span ~6 of 12
  on the left; body text a **narrow 3–4 column measure** beside them; an "interesting facts" block whose heading is
  split across two lines aligned to different columns. Numbers ("01") hang at the end of a column.
- **img3** — desktop with overlay over the hero, plus a **mobile version** with a single red guide: on the phone the
  photos become full-width "img" placeholders, and the **body text sits in an indented column** (starts ~⅓ in, not at
  the margin) — the editorial offset survives on the phone as an indent, not a column.
- **img4** — angled montage of the long page: alternating photo-left/text-right bands, photos ~5–6 of 12.
- **img5** — hero on a desktop monitor (same as img1).
- **img6** — a Viking-boat photo **bleeds to the left page edge** while the text beside it stays on the grid
  (half-bleed); a quote band; the staircase heading again; a second device overlapping the page (presentation, not
  layout).

### 5. Minimal blog post — Untitled UI (Jordan Hughes) — 4 images
- **img1** — **12 pink columns** inside a 1280-ish browser; also **horizontal guides** marking each section's top and
  bottom. Headline **centred, 8 of 12 (cols 3–10)**; hero illustration **12 of 12** (full content width, not bleed);
  author left / tags right on the same row.
- **img2** — desktop + **mobile side by side**: below the hero the article is **TOC cols 1–4, empty col 5, body
  cols 6–12 (7)** — an asymmetric 4 + 7 with a **one-column gap used as space**. On the phone (one column, ~16px
  margins): heading left-aligned instead of centred, hero image full width, and the **TOC is gone** (hidden, not
  stacked).
- **img3** — end of article + footer: footer is a dark card **slightly wider than the content box** (it pokes past the
  grid margin) but its six link lists sit **2 + 2 + 2 + 2 + 2 + 2** on the grid inside it.
- **img4** — full page: TOC + newsletter in cols 1–4 for the whole article, images inside the body column only.

### 6. Website Grid System (Giorgi Amiranashvili) — 1 image
- **img1** — the most exact spec of the set, drawn with red dimension lines: **84px column, 32px gutter, 280px
  outer margin** (a 1920 artboard: 12 × 84 + 11 × 32 = 1360 + 2 × 280 = 1920). Stats **4 × 3 columns (316px each =
  3 × 84 + 2 × 32)**; "Our Values / Our Strategy" cards **6 + 6 (664px = 6 × 84 + 5 × 32)**; heading in the first 3.
  Dark columns tinted over the page. One grid through the page; a hairline under the nav spans exactly the 12.

### 7. Mental Health Clinic Web Design — Bloom (Phenomenon Studio) — 4 images
- **img1** — collage of desktop sections, every section a **rounded card inset on a purple page** (the "section as
  card" model: the section has a margin and radius, content has its own inner gutter). Specialists **4 + 4 + 4**,
  blog cards 2-up, stats 2-up; hero text centred.
- **img2** — tilted **phone screens**: everything single column; stats stacked; chips wrap; testimonial is a carousel.
- **img3** — doctor hero: **two equal cards 6 + 6** (text card / photo card) inside a white frame card; three stats
  inside the text card, 3 across.
- **img4** — four phone screens: the photo goes **above** the text; the 2 × 3 info grid stays 2 across on the phone;
  publications become a one-up carousel with dots. No overlay anywhere in this shot.

### 8. 12 Column Layout — F1 Hero Section (Rama Dharma) — 2 images
- **img1** (colour) / **img2** (grey with **12 columns drawn over a full-bleed photo**) — margin ≈ 2.5%, gutter ≈ ⅕
  column. The photo is the whole hero; content is placed by column: giant "4 / 6" numerals **2 cols (1–2)**, stat list
  **col 3**, name + paragraph **cols 1–4** at the bottom, four bottom links **one column each, cols 5–8**, nav
  **cols 8–12** right-aligned, info column **col 12** (right-aligned text that runs into col 11), race card
  **cols 10–12**. Many blocks are **one column wide** — a dense, single-column-span composition only a 12-grid with
  a big photo can carry.

### 9. Healthcare Website Design — Sehat (10am Space) — 6 images
- **img1** — full desktop: eyebrow cols 1–3, **hero heading starts col 7** (right half, 5 cols); hero photo **inset,
  full content width, rounded**; four service cards **3 + 3 + 3 + 3 that overlap the photo's bottom edge** (half on
  the photo, half below — overlap into the next section); text/illustration **6 + 6**; gallery **big photo 9 + three
  stacked thumbnails 3**; text 5 + FAQ 6 (col 7 start); app CTA band with a **stacked-cards edge** (offset copies
  behind it).
- **img2** — illustration cols 1–6, text cols 7–11.  **img3** — text cols 1–5, illustration 7–12 (mirrored).
- **img4** — the four cards alone: 3 + 3 + 3 + 3, first one highlighted with a stacked-paper edge.
- **img5** — colour swatches over leaves — not about grids.  **img6** — testimonial card + CTA card side by side,
  ~5 + 7.

### 10. Education app design (Mostafizur Rahaman) — 4 images
- **img1** — three phone screens: one column, ~16px margins, every card full width; inside cards, **3 stats across**
  and a **7-bar chart** — the phone's inner grids are 3 and 7, not 4.
- **img2**, **img3** — one screen each held in a hand (same content). **img4** — faded/blank frame (the slide's
  fade-in captured); readable, nothing on it. Not about page grids beyond "phone = one column".

### 11. Education App Design Concept — Mindnest (Saiful Ahmed) — 3 images
- **img1**, **img2** — phone screens (onboarding, course list, course detail): one column, chips scroll sideways,
  cards full width. **img3** — a "Let's Talk" hero with **horizontal baseline/cap-height guides** drawn under each
  line of the headline and a selected button with resize handles — type alignment, not columns.

### 12. MySales — CRM Dashboard Tablet Version (Novelino Jonathan) — 12 images
- **img1, img3, img9, img10, img11, img12** — **tablet landscape**: a fixed icon rail (≈ 40px) outside the grid, then
  a 12-column content area: KPI cards **3 + 3 + 3 + 3**; chart **8** + country list **4**; table **12**.
- **img4** — kanban: three lanes **each 3 of 12, leaving the last 3 empty** (lanes have a fixed width; the row is not
  stretched to fill).
- **img6, img11** — **tablet portrait**: chart **8** + three KPI cards stacked in the **4**; kanban 4 lanes **3 each**.
  So on portrait the designer kept 12 columns and changed what goes in them (stack the KPIs in the side column).
- **img8** — integration cards **4 + 4 + 4**, the last row has **2 cards and an empty third slot** (orphans keep their
  span; they do not grow).
- **img2** — style tile (fonts, colours) under Dribbble's menu — not about grids. **img5, img7** — faded frames, the
  table/donut layouts still visible (KPIs 4×3, chart 8 + donut 4, table 12).

### 13. Bruno Larvol — Personal Brand (WhiteLabel IQ) — 6 images
- **img1** — hero: text cols 2–5, round portrait centred over the right half with a decorative circle behind and
  overlapping the heading's area (layered overlap); next band: text 6 + cap image 4 (right).
- **img2** — **bento**: tall photo (≈ 4 of 12, two rows high) + quote card (8) on row 1; name card (4) + cap card (4,
  two rows) + a **marquee strip spanning 8** on row 2. Uneven row heights; cells span rows.
- **img3** — full page + **mobile + tablet**: mobile puts the portrait **above** the name, centred text; **tablet
  keeps the two-column hero** (text | photo) — the split survives at tablet width. Projects list: logo 3 | text 5 |
  image 3 rows.
- **img4** — style tile, not about grids.
- **img5** — a **construction grid drawn with measured tracks**, not 12 equal columns: **120 | 395 | 240 | 410 | 240
  | 395 | 120** (= 1920, symmetric), with horizontal lines too. The portrait circle sits on the 410 centre track and
  spills over both 240s; the heading spans the left 395 + part of the 240. A **ratio/track grid**, not a column count.
- **img6** — horizontal accordion: one open panel ~55% + three closed panels with **vertical text**, each ~⅛.

### 14. Havis — Industrial B2B (WhiteLabel IQ) — 6 images
- **img4** — the spec page: **"12 columns grid – 30px gutter, 72px margin", columns labelled 87px** (12 × 87 + 11 ×
  30 + 2 × 72 = 1518 — the numbers do not add up to 1440 or 1920; the drawing is approximate). Pink columns.
- **img1** — desktop on a device: hero photo **inside the content width** with the header above; industries **4 × 2
  rows of icon+label (3 + 3 + 3 + 3)**; products **3 + 3 + 3 + 3**.
- **img5** — desktop page: product cards **3 + 3 + 3 + 3**; compatibility box **12** (inset card); "Discontinued /
  Kiosks" **6 + 6** separated by a hairline; footer **logo 2–3 + four lists** + subscribe.
- **img6** — **mobile**: product cards **one per row, full width**, image on top. Nothing hidden that is visible.
- **img2**, **img3** — typography and colour pages, not about grids (the typography page itself is a 5 | 7 split).

### 15. AspiroFit — Branding / Design System / UXUI (Preston Lewis) — 7 images
- **img1, img3** (dark), **img5, img7** (light, same layout) — editorial: headline lines with **different start
  columns** (line 1 col 1, line 3 indented ~2 cols, "SMART / TRACKING / FOR YOU" stepped back to the right);
  the **product image overlaps the headline** (image layered over type); small labels at cols 1 / 5–6 / 12; **visible
  dashed vertical guides kept in the design as decoration** (exposed grid lines); "ALWAYS ON FITNESS" with small
  photos overlapping its letters; footer wordmark **ASPIROFIT spanning the full width edge to edge** (type bleed).
- **img2, img6** — the page cut into tiles (presentation). **img4** — laptop mockup. No mobile view; no overlay.

### 16. RVWA — Nonprofit Membership (WhiteLabel IQ) — 6 images
- **img6** — the spec, drawn at the top: **"GRID SYSTEM – 12 columns grid": 1440px content inside a 1920 artboard,
  30px gutter, 92px column, 240px margin** (12 × 92 + 11 × 30 = 1434 ≈ 1440). Desktop page: heading cols 1–5, **photo
  collage cols 7–12 with photos overlapping each other and off the columns**; "FUEL YOUR CAREER" heading **runs over
  the edge of a photo**; "Support to learn and grow" band **starts at the page edge and stops at ~col 8** (a
  **half-bleed band**) with three portrait photos **hanging below the band** (overlap out of the band); event poster
  cols 1–4 with a portrait **overlapping its corner**, text cols 6–9; "A network of real women" heading cols 1–4,
  images cols 6–10; testimonial photo + offset portrait. **Mobile** (right): single column; the **collage is kept, just
  smaller** (not unstacked into a list); cards stacked; footer stacked.
- **img1** — laptop mockup of the hero (collage 6 of 12, gradient band below with text 5 | 5).
- **img2** — tablet mockup, portrait: still two columns in the hero.
- **img3, img4, img5** — case-study pages with **dashed vertical guides in the background** (≈ 4 visible lines), blog
  cards and type specimens hanging on them; img5's "Support" band and photos overlapping its bottom edge again.

### 17. Neon Planet 404 — Ledger-style (Ilias Bikbulatov) — 1 image
- **img1** — centred 404 page with nav row; nothing about columns. Not about grids.

### 18. Mobilin — Used-car landing (Novelino Jonathan) — 12 images
- **img1, img7, img8, img9, img10** — desktop: hero photo **inset with rounded corners**, heading cols 1–6, tagline
  cols 9–11 bottom-aligned with it, search card **12 (inset 1 col each side ≈ cols 1–12 inside the photo)** sitting
  in the hero's lower part; a **full-bleed photo band** ("It's time to upgrade…") edge to edge of the browser; features
  **4 + 4 + 4**; **16 brand logos in one row** (one equal cell each — a 16-across strip, off the 12 grid); car types
  **3 + 3 + 3 + 3**; promo photo cards 4 + 4 + 4; FAQ **image 4 + accordion 8**; testimonial **image 5 starting col 2
  + quote 5**; app band **12, rounded, with phone images running off its right edge** (bleed out of the card); CTA
  photo band 12; footer heading 6 + address 3 (right).
- **img4, img5** — tilted page montages (img5 faded). **img6** — blank grey frame (transition capture). **img11,
  img12** — iMac mockups. **img2, img3** — style tile / mockups under Dribbble's menu, not about grids. No mobile.

### 19. HelloUI Design System (thedan.design) — 7 images
- **img1** — cover with abstract grid shapes; **img2** — variables table; **img3–img7** — component docs pages
  (button, menu, input, date picker, table, modal, alert), each a **light | dark playground split 50 / 50**. Component
  documentation, not page layout; tagged but nothing about the page grid beyond the 6 + 6 doc split.

### 20. Mental Health Clinic Web Design — Well-ness (Rejoanul Haque) — 3 images
- **img1** — desktop: hero photo inside a frame with **faint guide lines drawn over it at thirds** (and one horizontal)
  — a 3-column hero grid; "About yoga" label cols 1–3 + five logos cols 5–12; video image **10 of 12 (cols 2–11)**;
  "10+" stat cols 1–3 + paragraph cols 5–12; services card 6 + photo 6; programs: one wide card (~5) + three smaller
  (~2–3); section headers **title left (6) + description right (4, cols 9–12)** repeatedly.
- **img2** — full page: testimonial on a **full-bleed dark band** with a giant faded word "REVIEW SERIES" behind;
  blog **3 + 3 + 3 + 3**; a ticker strip; footer giant wordmark **WELL-FIT** spanning ~half; footer links spread
  evenly across 12.
- **img3** — "Let's Collaborate": giant heading cols 1–7, **intro text placed in the gap to the right of "Let's"**
  (cols 5–8, interlocking with the heading's ragged edge), portrait card cols 11–12; bottom row three items at start /
  centre / end; hairlines run **full bleed**. No mobile in this record.

### 21. Plantify — Plant e-commerce (Novelino Jonathan) — 12 images
- **img1, img3, img4, img5** — desktop: utility bar + nav full width; hero heading **starts col 2** (indented one
  column from the search card's edge), plant image cols 9–11 **rising above the hero's top**; search card **12,
  overlapping the hero's bottom edge**; **full-bleed fern band**; "Shop by Rooms" **4 + 4 + 4** (img7: a 2-row
  mosaic of mixed sizes).
- **img7, img8, img9, img10, img11, img12** — the long page (9–12 are near-identical scroll crops): **about photo
  bleeds to the left page edge** (half-bleed) with text from col 7; categories **5 across** and products **5 across**
  (2.4 columns each — **not expressible on 12**); a product grid with **a promo tile ("50% off") taking one cell**;
  "Exclusive discounts" card **12** with the man photo breaking its top edge; testimonial image 4 + quote 6; why-us
  **3 + 3 + 3 + 3**; Instagram **bento** (tall 1-row-span cells beside 2-up stacked cells: 3 | 2 | 2 | 3 with rows
  spanned); FAQ image 4 + accordion 8; app band 12 with phones; footer 4 + 2 + 2 + 2 + 2.
- **img2** — style tile under Dribbble's menu; **img6** — faded "Desktop View" frame. Not about grids. No mobile.

---

## SUMMARY

### (1) Column counts, margins, gutters seen
| What | Count of records | Where |
|---|---|---|
| **12 columns** drawn | **8** | over a page: #1, #2, #4, #5, #6, #8 (6) · as a spec drawing: #14, #16 (2) · plus #3, a diagram of the divisors of 12 |
| Stated in px on the image | **3** | #6: col 84 · gutter 32 · margin 280 (1920) · #14: col 87 · gutter 30 · margin 72 · #16: col 92 · gutter 30 · margin 240, content 1440 in 1920 |
| Thirds guide on a hero (3 columns) | 1 | #20 img1 |
| Measured-track construction grid (not equal columns) | 1 | #13 img5: 120 · 395 · 240 · 410 · 240 · 395 · 120 |
| Dashed guide lines kept **as decoration** | 2 | #15 (AspiroFit), #16 img3–5 |
| Horizontal section / baseline guides | 2 | #5 (section tops/bottoms), #11 img3 (cap/baseline) |
| Phone = single column, ~16px margin | every phone shown (#4, #5, #7, #10, #11, #13, #14, #16) | no designer drew a 4-column phone grid |
| Tablet kept at 12 (landscape and portrait) | 1 | #12 |

Gutter-to-column ratio where measurable: **0.33–0.38** (30/87, 30/92, 32/84); drawn overlays without numbers look
narrower (≈ ¼–⅕). Outer margins split into two families: **wide fixed margins on a 1920 artboard** (240–280px, i.e.
a ~1360–1440 content box) and **narrow ~2.5% margins** (#2, #8) where the content fills the frame.

### (2) Most common span patterns (counted across all sections seen)
| Pattern | Times | Typical use |
|---|---|---|
| **3 + 3 + 3 + 3** (4 across) | 12 | stats, service/product cards, KPIs, blog, why-us |
| **6 + 6** | 9 | text/image split, two cards, two CTAs |
| **4 + 4 + 4** (3 across) | 8 | features, specialists, categories, integrations |
| **8 + 4** (or 4 + 8) | 7 | chart + list, accordion beside image, lead story + list |
| **5 + 6/7 with an empty column** (asymmetric split) | 6 | #5 TOC 4 + gap + body 7, #9 text 5 + FAQ from col 7, #20 3 + gap + 8 |
| **heading in one half, text starting col 7** | 4 | #2, #9, #20, #21 |
| **one-column-wide items** | 2 records, many items | #8 (stats, links, info column), #1 thumbnails |
| **centred 8 of 12 (cols 3–10)** | 2 | headlines (#5), video (#20 uses 10 of 12) |
| **offset start (col 2, col 7)** | 5 | Plantify hero col 2, testimonial col 2, Sehat hero col 7, Norway intro col 2 |
| **staircase starts per line** | 2 | #4 img2, #15 headlines |
| **5 across / 16 across** | 2 | #21 categories + products (5), #18 brand strip (16) — neither fits 12 |
| **bento with row spans** | 3 | #13 img2, #21 Instagram + Rooms |

### (3) Values not in 01's axis list (new axis values)
- **A3 — "section as an inset card"**: every section is a rounded box with its own outer margin on a coloured page
  (#7, #9 hero, #18 hero, #4 hero) — a third margin layer between page margin and content gutter.
- **A3 — artboard numbers**: 1920 artboard with 240–280px fixed margins (≈ 1360–1440 content) is the common
  designer default; our max-width should land in that band.
- **A5/A7 — measured-track grids** (#13): unequal, symmetric tracks (120 · 395 · 240 · 410 · 240 · 395 · 120) instead
  of N equal columns. A "track template" value for A5.
- **A7 — staircase placement**: successive lines/blocks start one column further in (#4, #15). Expressible as per-line
  start offsets; a typography feature more than a block feature.
- **A8 — counts that do not divide 12**: 5 across (#21, twice) and 16 across (#18). A row of N equal items must be
  allowed to ignore the 12 lines (auto-fit/equal-fraction), which 01's A13 already hints at; record **5** and **16**
  as observed values.
- **A8 — orphans keep their span**: a last row of 2 in a 3-across grid leaves the third slot empty (#12 img8), and
  kanban lanes stay 3 wide leaving columns empty (#12 img4). "Fill the row" is not the designers' default.
- **A8 — the empty column as space**: a deliberate one-column gap between TOC and body (#5) or heading and text (#2,
  #20). The gap is a placement choice, not a gutter.
- **A10 — overlap across a section edge**: cards half on the hero photo and half below (#9), search card overlapping
  the hero's bottom (#21), photos hanging out of a band (#16), a product image rising above the hero top (#21), phones
  running off a card's edge (#18). Common enough (5 records) to be a first-class bleed value: **"straddle the edge"**.
- **A10 — half-bleed band** (a coloured band from the page edge to a column line, #16) and **half-bleed photo**
  (#4 img6, #21 about) — both observed.
- **A10 — type bleed**: a wordmark spanning edge to edge (#15, #20). And **image over text** (layered overlap inside
  one section: #13 hero, #15, #16 "FUEL YOUR CAREER").
- **A10 — "frame inside a bleed"**: the photo bleeds behind, blurred, while an inset rounded copy sits on the grid
  (#4 img1).
- **A12 — guides kept visible on the published design** (#15, #16): dashed column lines as decoration. A "show
  guides on the page" style option, separate from editor guides.
- **A12 — horizontal guides** for section boundaries and baselines (#5, #11).

### (4) Bleed and overlap patterns
1. **Full-bleed photo band** between contained sections (#18, #21, #20 dark testimonial band) — the most common.
2. **Inset rounded hero** (photo inside the content width with a radius) — 5 records (#4, #7, #9, #18, #20). Designers
   now prefer this to a true full-bleed hero.
3. **Straddling a section edge** (cards/search/photos half in, half out) — 5 records (#9, #16, #18, #21 ×2).
4. **Half-bleed** (one side to the page edge, the other on a column line) — #4, #16, #21.
5. **Layered overlap inside a section** (image over heading, photo collage, portrait over a poster's corner) — #13,
   #15, #16.
6. **Box slightly wider than the grid** (footer card in #5) — the box pokes into the margin, its content stays on the
   columns.

### (5) How mobile / tablet versions treat the grid
- **Phone: one column, always** (8 records show one). No designer drew a 4-column phone grid; inner grids on the phone
  are chosen per component (3 stats, 7 bars, 2 × 3 info, chips that wrap or scroll).
- **What moves**: the photo goes **above** the text (#7, #13); centred headings become left-aligned (#5); a sidebar
  TOC is **hidden** rather than stacked (#5); groups of cards become **carousels with dots** (#7) or a stack (#14);
  a collage is **kept, smaller** rather than unstacked (#16).
- **Editorial offset survives as an indent** on the phone (#4 img3) — the column offset becomes a left indent.
- **Tablet keeps the two-column split** (#13 img3, #16 img2) and a dashboard tablet keeps **all 12 columns** in both
  orientations, rearranging blocks instead (#12: portrait stacks the KPIs into the 4-column side slot).

### (6) The five most useful lessons for our page grid
1. **12 columns with "3 · 4 · 6 · 8" spans covers almost everything designers draw**: 3 + 3 + 3 + 3, 6 + 6, 4 + 4 + 4
   and 8 + 4 account for ~36 of the ~50 sections measured. Make those four the one-click choices; everything else is
   a drag.
2. **Bleed is mostly "straddle" and "inset", not "edge to edge"**: inset rounded heroes and blocks overlapping a
   section edge each appear in 5 records; true full-bleed is mostly photo bands. Our A10 needs a "straddle the edge
   by N" placement (negative margin into the neighbour) and the inset-card section, not just `full`.
3. **Empty columns and offset starts are design, not mistakes**: a one-column gap between TOC and body, a heading
   starting col 2 or col 7, a staircase of lines. The grid must let a block start on any line and keep the gap —
   never auto-close it — and orphans in the last row keep their span.
4. **Not every row is twelfths**: 5-across and 16-across strips appear. A row of N equal items should be an
   equal-fraction (auto-fit) row that sits inside the 12-grid's content box, while blocks still snap to the 12 lines.
5. **Phones are one column; tablets keep the split**: drop to one column on the phone with per-component inner grids,
   photo above text, hide-or-carousel for secondary material; at tablet keep two-column splits and rearrange (stack
   side blocks into the side column) rather than reducing to 8 — evidence that **4 / 8 on phone / tablet portrait is a
   builder convenience, not what designers draw**, so the 8-column rung must map 6 + 6 → 4 + 4 and 8 + 4 → 5 + 3
   cleanly or fall back to keeping 12.

## Could not read
None. All 102 images opened. Four were blank or faded frames captured mid-transition (#10 img4, #12 img5 and img7
faded but legible, #18 img6 blank grey, #21 img6 faded "Desktop View"); noted where they appear.

---

## The other 21 shots (full-resolution capture, v3)

Source: `C:\Users\eyite\educo-research\grid\r3-v3-dr.json` (42 Dribbble records). Taken: the **21 records whose `item`
is not in the list at the top of this file**. Images are in `C:\Users\eyite\educo-research\grid\shots-v3\`, cited by
their `-imgN` suffix. **Every image was opened: 122 images from 20 records, plus one gallery frame for the 21st record
(D#40), which has no `shotImages`.** Read 2026-10-03, session e9d19b5c. Numbering goes on from the first 21:
D#22 … D#42. The axis names are those of [04-map.md](04-map.md) (A1–A24).

Before the details, three facts about this batch:
- **Only 9 of the 21 are web pages or web apps:** D#22, D#23, D#24, D#30, D#33, D#34, D#36, D#39 and D#42.
- **The rest are not web pages:**
  - 6 slide decks (16:9): D#25, D#26, D#27, D#28, D#32 and D#37;
  - 2 printed pieces: D#29 (a brochure) and D#35 (a poster);
  - 2 app dashboards: D#31 and D#38 (D#36 is a dashboard too, laid out like a web page);
  - 1 brand video: D#40 (only its first frame was captured);
  - 1 cover: D#41.
  The decks still have a grid (column starts repeat from slide to slide), so they are read for placement. They are not
  read for responsive behaviour.
- **No designer drew a column overlay on a page.** Only two drew a grid at all:
  - D#36 printed its specification on a colophon page;
  - D#40 drew column lines on brand formats.
- **No phone version appears in the whole batch.** The one non-desktop version is the Plantify tablet (D#42).

Spans are measured against the content width and rounded to twelfths (±1 column). Where no width is stated, "flush"
means flush to the page or slide edge.

### Per shot

#### D#22. Fernly (Violet Arther) — 2 images
- **img1**: presentation board: the landing hero in a frame + two side cards (an app screen; three care icons stacked). Hero: logo left, nav centred, CTA right; heading + lede + buttons + "trust row" (2 store icons + 2 stats) in the left ~6 of 12; phone illustration with a leaf blob ~cols 8–11. Hero split 6 | 6, text left. No overlay; the phone is the APP, not a phone version of the site.
- **img2**: same hero inside a browser frame. Nothing new: 6 + 6 hero.

#### D#23. Bun & Bite (ROY'Z_VISUALS) — 4 images
- **img1**: hero text cols 1–6 (heading runs slightly into 7); burger photo cols 7–12 **cut by the right page edge**, with a red blob behind it that runs to the top and right edges (half-bleed image + half-bleed shape); "$7.99" price sticker straddles the blob edge; tomatoes bleed off the left page edge (decoration in the margin). Feature row **4 across 3+3+3+3 separated by vertical hairlines** (no cards). A yellow quarter-circle bleeds off the bottom-left corner.
- **img2**: second hero variant (same 6 | 6, burger + red blob cut by the right and top edges, onion rings and a yellow blob bleeding at the edges). "Pick Your Craving": the section's content box is **narrower than the hero's** — heading and cards start at ~15% while the hero text starts at ~8% (two left edges on one page, i.e. this section is inset ~1 column each side: cards **4+4+4 inside cols 2–11**).
- **img3**: hero alone: eyebrow with a short rule, text cols 1–6, burger on a red blob cols 7–12 cut by the right edge. Nothing new.
- **img4 (long page)**: cards 4+4+4 (here on the same left edge as the heading); **About band: photo cols 1–5 bleeding to the LEFT page edge and filling the band's full height** (half-bleed photo, top and bottom flush with the band) + text cols 7–11 with a **2×2 icon grid** (6 + 6 inside the half); "Why choose us" **full-bleed dark band**: text 4–5 + 2×2 features in cols 7–12; a tomato **straddles the dark band's right page edge** (cut by the page edge). Locations: text 4 + photo card + list (inset card on the right, cut by the capture).

#### D#24. ROZIT — Dark Tech Hero (ROY'Z_VISUALS) — 3 images
- **img1**: dark hero: text cols 1–6; device scene (laptop + phone overlapping it + floating UI cards) cols 6–12; the "UI Components" floating card **runs past col 12 to the page's right edge** (cut); a green triangle shape bleeds from the left edge behind the text. Logo strip: label + rule cols 1–4, **five wordmarks spread evenly over cols 5–12** (5 across inside an 8-span, off the 12 lines).
- **img2**: variant: device scene cols 6–12 **cut at the right edge and stopping on the hero's bottom line**; numbered callouts "02 Design Systems" and "03 Development & Launch" **sit in the right outer margin** past the content edge (content in the margin, A21). Logo strip as img1.
- **img3 (long page)**: services **3+3+3+3** outlined cards; selected work **4+4+4**; "Our approach" **4 steps 3+3+3+3 with arrow connectors running across the gutters**; why-us: circle + layered cards collage cols 1–5 + text cols 7–12 with **4 stats across inside the 6** (1.5 each, hairline separators); CTA band = inset rounded card 12 (cut by the capture). One left edge through the page.

#### D#25. Brand Portfolio Presentation Template (North Peak) — 11 images (16:9 slide deck, 1920×1080 per its own feature list)
- **img1**: three slides. Cover: barcode + "Personal LINDA DOE / BRAND PORTFOLIO" cols 1–7; two small photos (≈ 1.5 each) at cols 5–7 top and a tall portrait cols 9–12; "[PREPARED]" starts col 5, "[CONNECT FOR]" starts col 9 — **the text columns start on the same lines as the photos above them** (blocks aligned across rows on shared column lines). Footer band full width: name | company | "P/1" with a rule | brand, on the same lines. Intro slide: photo 2 at cols 1–2, text cols 4–7, photo cols 8–12 cut by the slide's right/bottom crop.
- **img2**: angled montage of ~10 slides (Introduction, About us with a black panel, Services, Our works, Studio X…). Presentation; nothing measurable.
- **img3**: laptop mockup + a feature list ("1920x1080 (16:9)", "MasterSlides layout"). Not about grids.
- **img4**: Resume: heading "RESUME" **laid over a photo** (type over image, centred cols 4–7); four list columns **2 + 2 + 4 + 3 separated by vertical hairlines** (unequal, rules instead of gaps). Services: "SER-VICES" cols 1–3, photo cols 4–7, then a **vertical hairline** and a list column cols 9–12 whose thumbnails **hang at the slide's right edge**. Client's: **a vertical hairline at ~col 7 and a horizontal hairline under the heading** (cross rules dividing the slide into zones); two photos 2 + 2 in the left zone; in the right zone the two portraits sit at **different heights** (one high cols 10–11, one low cols 8–9 — a stagger). Archive: numbers in col 2–3 + entries cols 4–12 on hairline rows; a photo strip along the bottom, cut by the slide edges.
- **img5**: grid of 9 slides (cover, introduction, design index, about us with a black panel and a photo cut by the slide's top-right corner, resume, Studio X, services, client's, our works). Our works: text block cols 5–10, two photos 2+2 bottom-left, a photo **cut by the right edge**; "OUR / AND PORT…" heading cut by the right edge.
- **img6**: 6 slides larger. **Design index: two columns of entries mirrored** — left entries thumb→text at cols 3–6, right entries text→thumb at cols 9–12. **About us: a black panel cols 5–12 running to the slide's right edge**, with the eye photo **straddling the panel's top edge and the slide's top/right edges**; a photo cols 3–4 straddling the panel's left edge. Studio X: photo cols 1–3 flush to the left edge and the footer band, text cols 6–9, photo cols 11–12.
- **img7**: Services + Client's enlarged (as img4): confirms the Client's cross rules (vertical rule at the slide's ~62%, horizontal rule under the heading running across the left zone only) and the staggered portraits in the right zone.
- **img8**: Our works: text cols 2–6 top-left; photos 2 + 2 bottom-left (cols 1–2, 3–4) and two tall photos cols 6–8 / 9–12 top-right — **a diagonal checkerboard of text and photos**; heading bottom-right. Website redesign: text 3 at cols 1–3 + **black panel cols 5–12 running to the right edge** with list rows on hairlines and thumbnails **alternating left / right** (zig-zag inside a panel). Studio X2: **rotated vertical text** (col 2) beside a photo cols 3–4; text cols 5–8; two stacked photos cols 9–10 with an **offset black frame behind them** (an outline box shifted off the photo). Studio X3: right-aligned heading + text cols 6–10, photo cols 11–12 **flush to the right, top and bottom slide edges** (half-bleed, full height).
- **img9**: Archive: **photo full-bleed behind the slide; a white content card cols 1–6 sitting on the photo flush to the slide's top-left** (card over a bleed). Announcement: a black field cols 1–5 flush to the top/left edges; a photo **straddles the black field's right edge**; the word **ANNOUNCEMENT crosses the black/light boundary, white on black and black on light** (type crossing a colour-field edge). Testimonial: heading cols 1–4, **vertical hairline at col 5**, items 01 / 02 split by a horizontal hairline (cross rules). Get in touch: giant heading over the full content width, then **[PREPARED] at col 5 and [CONNECT FOR] at col 9 — the same starts as on the cover** (one grid through the deck).
- **img10**: cover + Get-in-touch enlarged: [PREPARED] and [CONNECT FOR] start on the same two lines on both slides, under the photos' left edges. Confirms img9.
- **img11**: overview of all 16 slides. Nothing new.
- No overlay drawn, no mobile.

#### D#26. Creative Brief Campaign Presentation (North Peak) — 11 images (16:9 slides)
- **img1**: dark cover: "CAMPAIGN" cols 1–9; a **white card cols 5–12 overlaps the bottom of the word** (card over type); "PRESENTATION" set to **fill the full content width** (type fit to width); condition note + prepared cols 1–4; footer rule + labels. Second slide: "…THE / …ONE IDEA / AT A TIME" giant words **spread so that each word starts on a column line, with wide gaps between words**; photos at cols 1–2 and 3–6; a **tinted square behind the text block, offset** from it (cols 7–8).
- **img2**: angled montage of ~12 slides (Content list, The brand, Brief history with a **rotated vertical title**, Edition (32), Products, Target audience with a **hairline table**, Deliverable). Presentation; nothing measurable.
- **img3**: laptop + feature list. Not about grids.
- **img4**: light cover: tinted panel cols 5–12 sits **under the bottom of "CAMPAIGN"** (type over panel); "PRESENTATION" in a pale tint filling the content width. Index slide: label cols 1–2, **numbers in their own narrow column** (col 3), items cols 4–7, second list (07–09) at cols 9–12 with a photo below it.
- **img5**: The brand: heading cols 3–7, photo cols 3–7 below it, and the "TRANSFORMING…" text **overlapping the photo's left edge and running off the slide's left edge** (crop of the slide); a tinted panel cols 9–12 with three items. Content list: numbers + items cols 4–8 and 10–12, a hairline under them, photo cols 1–2 + "CONTENT LIST" heading; a portrait cols 10–12 **cut by the right edge**. The campaign: "THE CAM-/PAIGN" heading with a photo **tucked under "PAIGN"** (interlocking heading and photo); six stats **2 across × 3 rows, each a number column + a text column**, on horizontal hairlines. Target audience: a **4-column hairline table** under a photo + text.
- **img6**: 9 slides. Brief history: a **tinted panel cols 1–4 from the slide's top edge** with a **rotated vertical title**, months + years + text on hairline rows cols 5–12. Products: photo mosaic (two stacked + one large) cols 1–4, heading cols 4–12; **a tinted band across the lower 40% from the left edge to ~col 10** with the photos **straddling its top edge** (half-bleed band + straddle). Edition: heading with a **vertical rule at its right end**. Target audience: photo cols 9–12 flush to the right, top and bottom edges. Reference: tinted panel the full slide width under a heading cut by the right edge.
- **img7**: 6 slides, same layouts larger. Confirms img5–img6 (stats 2 × 3 with number columns; the tinted band with photos straddling its top edge).
- **img8**: Target audience: photo + text, a 4-column hairline table, heading — all in cols 1–8; photo cols 9–12 **flush to the right, top and bottom edges** (half-bleed, full height). Reference: heading starts col 4 (after a pill label in cols 1–2); **a tinted band across the middle running the full slide width**, with item columns 4 + 4 at cols 1–4 / 5–8 and a dark card cols 9–12 that **straddles the band's top and bottom edges**.
- **img9**: Build the feature: giant words "BUILD THE / … / AT A TIME" **each word starting on a column line, gaps between words**; photos 2 + 4 + a tinted square behind an arrow + text (offset). Our team: five portraits in a **2-wide mosaic** cols 1–3 **flush to the slide's left/top/bottom edges**, names list + text right on hairlines. Mood board: **a dark panel cols 1–5 flush to the top-left corner**; four small photos **scattered at free positions** (CP-1 … CP-4 at different heights and columns — a collage, not on rows); "04." item on a hairline. Deliverable: 3 timeline columns **3 + 3 + 3** (cols 1–9) + photo 3.
- **img10**: Competition: three cards of **decreasing width, ≈ 5 + 4 + 3**, each with a header row; tints light → mid → dark (unequal spans in one row, not a core split). Timeline: "TIMELINE" **letter-spaced to fill cols 4–12**; a dark panel **9** with three columns separated by vertical hairlines + three stacked photos **3** (9 + 3).
- **img11**: overview of all 16 slides. Nothing new.
- No overlay drawn, no mobile.

#### D#27. Minimal Design Portfolio Template — green "AURA" (North Peak) — 12 images (16:9 slides)
- **img1**: dark cover: photo cols 8–12 **flush to the slide's top and right edges**; a dark notch cut into the photo's lower-left so that "DESIGN" sits **half on the photo area** (type over a cut-out); "TRANSFORM FOR YOUR / PROJECT UI / UX." **spread so each word starts on a column line**. Resume slide: a pale green panel from ~col 5 to the right edge holding the content, plus a band along the bottom (L-shaped tint).
- **img2**: angled montage (Resume, /01 divider, Skill & expertise, cover, Capabilities, Meet our team with a **diagonal green band crossing the cards**, a quote slide). Presentation; nothing measurable.
- **img3**: laptop + feature list (light cover; "DESIGN" lettering overlapping the photo). Not about grids.
- **img4**: team slide: four members **3+3+3+3, with one slot replaced by a green "1.5K CLIENT FEEDBACK" stat card** (a stat tile occupying a card slot); Design process: 2 × 2 photo mosaic cols 1–4 + heading; dark cover as img1.
- **img5**: 9 slides. Index: entries 01/–07/ in **2 columns 6 + 6 inside cols 2–12 on hairlines**, a photo **cut by the left edge**. Resume: photo + name cols 1–4, pale green panel from ~col 5 to the right edge with an inner white card. **/01 divider: a dark inset panel split by a vertical hairline (~col 7) and a horizontal hairline** (rules as structure). Skill & expertise: photo cols 1–3 **flush to the left and bottom edges**, a pale green tint band behind the heading, bars, a dark card cols 8–12. Capabilities: two photos at **different heights** (left one higher, right one lower — stagger), words "TRANSFORMING EXCEPTIONAL…" **spread across three columns**. Quote: a pale green panel from ~col 3 to the right edge, flush top/bottom. Gallery: 2 small stacked + 1 tall (bento).
- **img6**: cover light/dark; "DESIGN" **overlaps the photo** (letters over the image). Art photography (dark): photo cols 1–4, heading "ART / PHOTOGRAPHY" with a vertical rule, **its second line running over the photo's right edge** (type straddling an image edge); meta cols 5–7; small photo cols 10–12 top; text cols 8–12. Editorial design: photo cols 1–3 + text cols 4–12, heading below.
- **img7**: 6 slides. Index: **rotated vertical "INDEX."** in col 1, photo cols 2–4, entries **2 columns** on hairlines. Resume: pale green L-shaped panel. **/01 Team members: dark inset panel with a vertical hairline at ~col 5 and a horizontal hairline across the right part** (rules as structure). **Meet our team: four columns 3+3+3+3 divided by vertical hairlines, a green band running across all four columns behind the names** (one band crossing several cells), photos at the bottom. Skill & expertise: photo cols 1–2 flush left/bottom. **/02 Capabilities: a green inset panel with the same rule pattern as /01.**
- **img8**: Capabilities overview: photo cols 1–4 high, photo cols 5–8 **lower** (stagger), heading lines **stepped** ("CAPABILITIES / OVERVIEW." second line indented), "TRANSFORMING … THINKING," **justified across 3 columns** under the first photo; items on hairlines cols 9–12. Design process: mosaic (2 small stacked + 1 square) cols 1–4, heading cols 5–9, then **three steps 3 + 3 + 3 starting at col 4** — nothing under cols 1–3 below the mosaic (offset start / empty columns).
- **img9**: /03 Our works divider (dark inset panel, same rule pattern). Quote: pale green panel from ~col 3 to the right edge, flush top/bottom, with a small photo **straddling the panel's left edge**. **Our services: a green strip cols 1–1.5 flush to the left/top/bottom edges** (a narrow half-bleed strip); a **2 × 2 service grid with a vertical and a horizontal hairline crossing** (rules instead of gaps). Branding design: text 5 | vertical hairline | two images 3.5 + 3.5.
- **img10**: 6 project slides. A photo 6 with a **small photo overlapping its bottom-left corner**; **a green panel cols 1–6 flush to the left/top/bottom edges with a photo straddling its right edge**; Editorial design: small photo + text top, tall photo cols 9–12; Web design: small photo + large photo at **different heights**; mosaic of 2 stacked + 1 large; Art photography (dark) as img6.
- **img11**: **bento: row 1 = 4 + 8, row 2 = 4 + text 4 + 4** (the second row's split does not share the first row's middle line); then a photo panel ~10 of 12 + a **rotated vertical caption** in the last column.
- **img12**: /04 Testimonial divider (green inset panel, rules). **Client testimonial: four slots 3+3+3+3, the third a green "1.5K CLIENT FEEDBACK" stat card spanning the full card height** (a stat tile in a card slot, again). **Client list: pale green panel from ~col 4 to the right edge (flush top), a portrait straddling the panel's left edge**, list on hairlines inside the panel, "CLIENT LIST." heading bottom-left. Best of luck: a script "B" overlapping the heading; words spread on column lines; photo cols 9–11.
- No overlay drawn, no mobile.

#### D#28. Minimal Design Portfolio Template — red "AURA" (North Peak) — 11 images (16:9 slides)
- **img1**: cover: header rule across the content width; photo cols 1–5, [KEYWORD] col 6–7, [CONDITION NOTE] cols 8–12, [PREPARED] under it; hairlines split the right part into rows; "Brand" cols 1–5, socials cols 6–12; **"PROPOSAL." runs past the slide's right edge** (type bleeding off the edge). Second slide: text 2 columns + three photos 2 + 2 + 2 at cols 7–12; **"STRATEGIES" letter-spaced to the full content width**.
- **img2**: angled montage (About us with a red panel, Problem, Team members photo grid, Timeline gantt, a red Moods slide). Presentation; nothing measurable.
- **img3**: laptop + feature list (red cover; "PROPOSAL." cut by the screen edge). Not about grids.
- **img4**: three covers (light, dark with a red "Brand"): same column starts on each; "PROPOSAL." again **cut by the right edge**; "STRATEGIES" letter-spaced across the content width under three photos 2 + 2 + 2.
- **img5**: Index: numbers col 6, items right-aligned ending col 9, then **a vertical hairline at ~col 10 running the full slide height** splitting off a tinted side panel cols 10–12 (photos + note) — rule + side panel. About us: photo cols 9–12 **flush to the right edge**, a red box under it **flush to the bottom edge**; "ABOUT US" **crosses onto the photo** (type over image); two text columns 3 + 3 at cols 1–3 / 5–7.
- **img6**: 6 slides. Case study: photo cols 1–2 **flush to the top-left corner**, a **vertical hairline at the slide's centre** (6 | 6), photos and text placed on both halves at different heights. **.Problem: vertical hairlines at ~col 3 and ~col 8 split the slide into three unequal zones (≈ 3 | 5 | 4)**, a horizontal hairline in the middle zone; a dark box bottom-right **flush to the right/bottom edges**. **Our solution: "OUR" and "SOLUTION" set apart so the second word starts on the centre line**; a tinted band across the lower 40% full width; a vertical hairline at the centre. Objective: photo cols 8–12 **flush to the top/right/bottom edges** with a white card **straddling the photo's left edge**; four captions 2 × 2 on hairlines with dots. **.The numbers: three stats 3 + 3 + 3 with a red band across their tops, a dark column cols 10–12 flush to the right/bottom edges with rotated text.** The steps: photo cols 1–3, **a dark band across the lower 40% from ~col 4 to the right edge** with 3 steps 3 + 3 + 3 starting col 4.
- **img7**: **Team members: a vertical hairline at the centre (6 | 6)**; seven photos in the left half placed **4 across, then 3 with the gaps kept** (an orphan row keeping its slot widths); seven text items 4 across in the right half; a dark box **flush to the right/bottom edges**. Strategies: text 6 + 6, three photos **2 + 2 + 2**, letter-spaced "STRATEGIES" across the full width. Product budget: dark photo panel 12 with two cards **3 + 3 centred**. **Timeline: a Gantt chart whose four weeks are drawn as vertical hairlines (columns as visible structure)**, bars spanning across them; photo cols 10–12.
- **img8**: Testimonial (dark): heading + text cols 1–7; photo cols 8–12 **flush to the top/right/bottom edges** (half-bleed, full height). Moods (red): four photos **at free positions and different heights**, one with an **offset white box behind it**.
- **img9**: overview of all 20 slides, incl. **four colour variants of the cover with identical placement** and "THANKS." letter-spaced to the full width. Nothing new.
- **img10**: dark cover + Thanks: "PROPOSAL." **cut by the right edge**; Thanks slide: contact rows on hairlines cols 6–12, [KEYWORD] / [CONDITION NOTE] at the same starts as the cover.
- **img11**: crops of Our solution (the second word on the centre line, a tinted lower band, a centre hairline), Objective, Team members, Product budget, Timeline (week columns as hairlines), Overview (text card + photos + "OVERVIEW" heading), Problem. Confirms img6–img7.
- No overlay drawn, no mobile.

#### D#29. TD Homebuyer Guide (Ali Bakhit) — 9 images (a printed brochure: portrait pages and spreads)
- **img1**: cover. A photo sits inside the page margins with soft faded edges; the title is below it.
- **img2**: a spread.
  - Left page: one text column with a photo across the full measure.
  - Right page (contents): a dark vertical strip (≈ 2 of 12) holding the numbers, beside a light panel (≈ 10) holding
    the items. This is a **2 | 10 split with hanging numbers**.
- **img3–img5**: single-column pages, with a photo or a table across the full measure.
- **img6**: checklist spread, one text column per page.
- **img7**: a rates table plus photos.
- **img8**: two QR codes side by side (≈ 6 + 6 inside the measure); a photo; a contact page.
- **img9**: a back page that is one photo inside the margins.
- **Verdict:** print, with one column and margins. The only split is the 2 | 10 contents page. Not about a web grid.

#### D#30. Nordic — Minimal Furniture eCommerce (S M Sadik) — 3 images
- **img1**: home.
  - The hero photo is **full-bleed with no radius**, and the hero text sits over its left 4 columns.
  - A trust row of 4 items, **3+3+3+3**.
  - Shop by category is **5 across** (2.4 columns each, off the 12 lines).
  - "You may also like" is 4 across.
- **img1**: search results.
  - **A filter sidebar of 3 + a vertical hairline + results in 9**, with 3 cards per row.
  - The last row holds **one card that keeps its span, leaving the other slots empty** (orphans keep their span).
  - Footer: logo 3 + link lists.
- **img2**: checkout.
  - A form of ≈ 8 + an order-summary card of 4, separated by a hairline.
  - **The fields inside the 8 split 6 + 6, then run full width, then split 4 + 4 + 4** (a nested split on the same
    lines).
  - Thank-you page: a **centred column of 6 (cols 4–9)**, with a 3 + 3 split inside it.
- **img3**: a presentation of 9 screens.
  - The listing page: sidebar + 3 across.
  - The product page: images 6 (a large image + 3 thumbnails, 2+2+2) + details 6.
  - The shot says "fully responsive", but **no phone screen is shown**.

#### D#31. Participant Management for Clinical Trials (Jonno Witts) — 1 image
- **img1**: an app dashboard (2017).
  - A fixed navigation rail sits **outside** the content.
  - A row of 4 info cards of unequal widths (≈ 2.5 / 3 / 3 / 2).
  - A **personal-info card in the right column spans every row** beside the cards, a timeline and a table (a row span).
- **Verdict:** app UI. Nothing beyond A9 row spans and A19 edge chrome.

#### D#32. Pitch Deck Presentation Template (North Peak) — 11 images (16:9 slides)
- **img1**: the cover.
  - "PITCH" spans cols 1–3 and "DECK" cols 4–12; a script word overlaps both.
  - **The photo starts exactly under the D of DECK**: blocks are aligned to the edges of the type.
  - The barcode is in col 7 and a black text box in cols 8–12.
  - A light variant has the same placement.
- **img2**: angled montage. **img3**: laptop + feature list. Neither is about grids.
- **img4**: Team: **left pair (cols 1–2, 3–4) set lower, right pair (cols 9–10, 11–12) set higher, cols 5–8 empty**
  (a stagger and an empty middle). Market: 2 × 2 items (icon 1 + text 3 each, with hairlines) in cols 1–8 + a chart in
  cols 9–12.
- **img5**: Index: a photo in cols 9–12 **flush to the top/right edges and down to the footer band**, with the "2028"
  numerals **straddling the photo's left edge**.
- **img6**:
  - **Problem:** a tinted panel cols 3–12, flush to the right and bottom edges, holding 3 + 3 + 3, with big outlined
    numerals **clipped by the panel's top**.
  - **Solution:** a phone mock-up straddling an orange block that is flush to the edges.
  - **SWOT:** a **black panel cols 5–9 flush to the top and bottom edges**, a vertical band between two contained
    columns.
  - **Overview:** a heading crossing a photo.
- **img7**: Price plans **4 + 4 + 4**, each split 2 + 2 inside. Showcase: a photo cols 1–7 flush left/top/bottom, with
  the heading laid over it.
- **img8**:
  - **Case study:** "CASE" white on the photo and "STUDY" black on the page (the heading crosses the bleed edge).
  - **Target:** a bento of stat tiles (4 + 3 / 4 + 3) + a photo cols 9–12 flush at the bottom.
  - **Chart:** six month columns drawn as gridlines.
- **img9**:
  - **Timeline:** vertical hairlines at ≈ cols 5, 7, 9 and 11 + one at the right edge, and a horizontal rule running to
    the slide edge. The **columns are drawn as structure**.
  - **Competitors:** **4 + 4 + 4, the middle card raised** (stagger).
- **img10**:
  - **Investment:** a heading cols 1–5, a photo cols 6–8, two stacked stat cards cols 9–12, then 3 + 3 text under a rule.
  - **Next steps:** the words "NEXT Q/A STEPS" **spread so each word starts on a column line**.
- **img11**: overview of 20 slides. Nothing new.

#### D#33. Daily UI #061 — Redeem Coupon & Order Review (Ghyalpo Lama) — 2 images
- **img1**: checkout. An order list in cols 1–7 + a rounded summary card in cols 8–12 (**7 + 5**). One grid.
- **img2**: a zoomed crop of the same. Nothing new.

#### D#34. Indigo Power — Really Good Energy Homepage (Rahat Khondokar) — 5 images
- **img1**: hero on a laptop.
  - A full-bleed utility bar.
  - Text cols 1–6 + a rounded photo cols 7–12.
  - A **decorative circle behind the photo reaches into the text column**, and a dot straddles the photo's edge
    (layers).
- **img2**: the old site beside the new one. In the new one:
  - the hero is 6 + 6;
  - a **full-bleed stats band holds 3 stats, 4 + 4 + 4, divided by vertical hairlines** (no cards);
  - a **testimonial bento: row 1 ≈ 7 + 5, row 2 ≈ 5 + 7.** The second row's split does not share the first row's line.
- **img3**: a zoomed hero. Nothing new.
- **img4**:
  - **Steps:** 3 across inside an inset ≈ 10.
  - **"For Business":** an **inset rounded dark card (12)** holding text 6 + a photo 5 inside its padding.
  - **The testimonial bento measured:** the row-1 edge sits at ≈ 59% and the row-2 edge at ≈ 49%.
- **img5**: the full page.
  - The stats band again.
  - **Heading cols 1–6 + paragraph cols 7–10** (heading left, text right, narrower).
  - Cards 4 + 4 + 4.
  - Text 6 + photo 5, with a circle and a dot straddling the photo.
  - One left edge through the page. No phone version.

#### D#35. AMIRA THE MIRACLE — Media Kit (Ali Bakhit) — 4 images
- **img1**: a printed poster. A polaroid photo 4 + text 8; performance 4 + collaboration 8; heart-shaped photos
  straddling a rectangle photo's top edge.
- **img2**: a zoom of img1. **img3**: the poster on an easel. **img4**: a tilted close-up.
- **Verdict:** print; 4 + 8 throughout. Nothing for the web grid.

#### D#36. Halberd & Cie. (Oddur Sigurdsson) — 6 images (a banking web app set like a newspaper)
- **img1 / img2** (img2 is img1 without the device frame):
  - A masthead row ("VOL VII · NO 247") with a hairline.
  - A big figure in cols 1–6 + a period selector in cols 10–12.
  - **The chart runs the full content width, but its plot starts ≈ ½ column in, with the y-axis labels hanging in that
    ½ column.**
  - **Three lists 4 + 4 + 4** with hairline rows.
  - A footnote row ("FOLIO 01 OF 05 · END OF PAGE"): print conventions on a web page.
- **img3**: Activity (content 144–1456 of a 1600 frame).
  - A ledger list ≈ 7 + a detail panel ≈ 5 (**7 + 5**).
  - Date groups appear as **tinted full-width sub-header rows** inside the list.
- **img4**: Counterparty.
  - **Six stats 2+2+2+2+2+2.**
  - A **12-month bar chart whose 12 bars each sit on one page column** (pitch ≈ 110 px × 12 ≈ the content width). The
    data's 12 months are the 12 columns.
  - An invoice table ≈ 8 + side info ≈ 4.
- **img5**: Compose a wire. A form card 8 (a label column inside) + a summary 4.
- **img6**: **the colophon. The designer states the grid in the design:**
  - "12 columns · 40px gutter · Container 1408 px max · Margin 48 px outer · Baseline 8 px grid · Rule 0.6 px hairline",
    drawn as a 12-column diagram;
  - "Hairlines, not borders. Air, not shadow."
  - The page itself splits **Type ≈ 5 · Color ≈ 4 · Grid ≈ 3** (5 + 4 + 3).
  - Inside the 5 are five weight samples, 5 across; inside the 4 are 5 swatches across (each block keeps its own count
    inside its span).
  - **Measured:** column ≈ 80.7 px and gutter 40 px give a **gutter/column ratio of 0.50**, wider than the 0.33–0.38 of
    the first 21. The container is 1408 px = 88 rem; the margin is 48 px = 3 rem.
- No phone or tablet version.

#### D#37. NovaPay — Digital Banking Pitch Deck (Mahfuz Jayed) — 10 images (16:9 slides)
- **img1**: cover. A photo panel cols 1–4.5 (37.5%), **flush top/left/bottom**; text from col 6. This is a half-bleed
  whose inner edge falls on a half-column.
- **img2**: Problem, cards **4 + 4 + 4**. **img3**: Solution, image 8 + steps 4.
- **img4**: Market, text 6 + diagram card 6. **img5**: features 2 × 2 (6 + 6).
- **img6**: a donut + legend in cols 1–6 + three stacked cards in cols 7–12.
- **img7**: a dashboard image cols 1–4.5 flush left/top/bottom + stacked stats.
- **img8**: team **4 + 4 + 4**.
- **img9**: chart 6 + unit economics 6, with 3 + 3 inside.
- **img10**: a photo cols 1–4.5 flush + a tinted table in cols 6–12 (6 + 6, then 12).
- No column overlay, no phone version.

#### D#38. Finora — Modern Fintech Banking Dashboard (Adib Rahman) — 1 image
- **img1**: an app dashboard.
  - A fixed sidebar sits outside the content.
  - **Content 9 + a right rail 3 whose cards span every row.**
  - Inside the 9, the split changes from row to row: 5.5 + 4.5, then 6 + 5, then 5 + 6. The rows do not share lines.
- No phone version.

#### D#39. Vegantree — Vegan Recipe & Food Blog (Xpartui) — 3 images
- **img1**, the left half of the page:
  - **Hero:** heading cols 1–5 + intro cols 7–11 (**empty col 6**).
  - **A bento on 4 equal columns (3+3+3+3)** in which each column is a stack of cells of different heights, so the
    cells **end at different heights** (a column-masonry bento):
    - a photo spans 2 columns;
    - a quote card spans 2 rows;
    - one column holds three short feature chips;
    - a tomato illustration straddles the bento's top-right corner.
  - **About:** text 5 + three features 5 (cols 8–12) with hairlines.
  - **Mission:** an **inset rounded tinted section**, with an egg illustration **straddling its top edge**.
- **img1**, the right half of the page:
  - Recipe cards **3+3+3+3** and nutritionist cards **3+3+3+3**.
  - **Journal:** an inset card with a header 4 + text 4 + a button 2.
  - **A featured card 12 whose photo 5 is flush to the card's top, right and bottom edges.**
- **img2**: identical to img1.
- **img3**: the same page in a **dark theme. The layout does not change between themes.**
- No phone version.

#### D#40. Strategic Grid Design — Pickle (Habitat Brand) — 0 `shotImages`; 1 gallery frame read
- The shot is a video (`.mp4`), so the capture holds no `shotImages`. The only frame on disk,
  `…-26092628-Strategic-Grid-Design-Pickle-gallery.jpg`, was read.
- It shows **four brand formats, each with its own column lines**: a landscape of ≈ 12 columns, a portrait marked
  "6", a narrow portrait marked "4" and a tall one with 3. The logo is re-placed on each.
- That is **"the column count follows the size of the format"**: A1's ladder, or A2's container query, applied to
  print and brand formats.
- **Not seen:** the rest of the video.

#### D#41. PASTICHE — Minimal Furniture E-commerce (Ekaterina Goltiaeva) — 1 image
- **img1**: a presentation cover. A photo is flush top/left/bottom over the left ≈ 73%. A **white framed card (photo +
  caption) sits inset on top of the bleeding photo** (the "frame inside a bleed" of D#4). A side panel holds ≈ 27%.
- **Verdict:** a cover only. Nothing about columns.

#### D#42. Plantify — Tablet Version (Novelino Jonathan) — 12 images (the tablet version of D#21)
- **img1, img6, img7**: **tablet landscape** (iPad Safari).
  - The desktop structure is kept: a full-bleed utility bar, hero text cols 1–7 + a plant image cols 8–12 rising above
    the hero's top.
  - **The search card still straddles the hero's bottom edge at tablet**, so the straddle is not reset at this rung.
  - The fern band stays full-bleed.
  - The side margin is ≈ 7.5% of the width, a larger share than on desktop.
- **img2**: style tile. Not about grids.
- **img3, img4**: the Plants page, a **filter sidebar (≈ 4 of 12) + products 2 across**; "Shop by rooms" 3 across.
- **img5**: tilted montage. Nothing new.
- **img8**: **the products go from 5 across (desktop D#21) to 4 across**. The "50% off" promo tile, which took one cell
  on desktop, **spans 2 rows at tablet**. Discount cards 6 + 6.
- **img9, img10, img12**:
  - **"Why choose us" becomes 3 across with prev/next arrows (a carousel)**, where desktop showed 3+3+3+3.
  - **A product row becomes a sideways strip with a scroll-progress bar.**
  - **The Instagram bento has unequal columns ≈ 3.5 | 3 | 3 | 1.5**: two stacked cells, one tall cell, one tall cell,
    two stacked narrow cells.
- **img11** (the full tablet page, 753 × 3360):
  - About: a photo cols 1–5 flush top-left + text cols 7–12.
  - **Categories stay 5 across at tablet.**
  - A full-bleed discount band with plants **cut by both page edges**.
  - Deals 4 across with the promo row-span.
  - Testimonial 6 + 6; FAQ **image 4 + accordion 8, kept at tablet**.
  - Dribbble's menu hides part of the deals section.
- No phone version in this record.

### Summary of the 21

**(1) Columns, margins, gutters**
- **Overlays drawn on a page: 0 of 21.** Grid statements drawn at all: 2.
  - D#36 states 12 columns · 40 px gutter · 1408 px container · 48 px margin · 8 px baseline · 0.6 px rule.
  - D#40 draws a column count that follows the format: 12 / 6 / 4 / 3.
- **Gutter/column ratio:** D#36 is 0.50. That widens the range measured in the first 21 (0.33–0.38) to **0.33–0.50**.
- **Container:** D#36's 1408 px = 88 rem. That is above our 80 rem default and inside the 1360–1440 band designers use.
- **Visible column rules as structure** are the most repeated idea in this batch: D#25, D#27, D#28 and D#32 (Gantt
  weeks, zone dividers, cross rules), and D#23, D#24, D#34 and D#36 (hairlines between stats and list rows).

**(2) Spans**

| Pattern | Shots |
|---|---|
| 3+3+3+3 | D#23, D#24, D#27, D#30, D#39 (×4) |
| 4+4+4 | D#23, D#24, D#32, D#34 (×2), D#36, D#37 (×2) |
| 6+6 | D#22, D#30, D#34, D#37 (×3), D#42 |
| 8+4 / 4+8 | D#30, D#36 (×2), D#37, D#42 |
| 7+5 | D#33, D#36 |
| 9+3 | D#26, D#30, D#38 |

Off the core list:
- 5 + 4 + 3 (D#36, and ≈ 5+4+3 cards in D#26);
- 2+2+2+2+2+2 (D#36);
- 5 across (D#30, D#42);
- 4.5 + 7.5 (D#37);
- rows in one bento with different splits (D#27, D#34, D#38).

**(3) Placement**
- **Offset start / empty column:** D#27 (steps from col 4), D#32 (cols 5–8 empty), D#39 (empty col 6) and D#34.
- **Stagger:** D#25, D#27, D#32 (×2) and D#28.
- **Orphans keep their span:** D#30 (results) and D#28 (a team row of 3 under 4).
- **Words of one heading placed on column lines with gaps:** D#26, D#27, D#28 and D#32.

**(4) Bleed and overlap**
- **Half-bleed (flush to one or three page edges, the inner edge on a line):** the most common pattern in the decks
  (≈ 20 slides) and on the web pages D#23 and D#24.
- **Straddle:** D#26, D#27, D#32, D#34, D#39 and D#42 (kept at tablet).
- **Inset rounded section:** D#34 and D#39.
- **Type over image, or across a field edge:** D#25, D#27, D#28 and D#32.
- **Type off the edge:** D#28.
- **A frame inside a bleed:** D#41.
- **Media flush inside its card:** D#39.

**(5) Tablet / phone**
- **No phone versions.**
- At tablet, D#42 does the following:
  - keeps the hero split and the straddle;
  - keeps 5 across for categories;
  - drops products from 5 to 4 across;
  - turns one row into a carousel and another into a scroll strip;
  - gives a promo tile a row-span;
  - keeps the 4 + 8 FAQ.
- This agrees with 03's finding that **tablets keep the split**. It adds that a tablet changes counts and strips per
  component, never by halving the page grid.

### Saturation, counted honestly (against 04-map.md)

For each shot: did it add (a) a new AXIS, (b) a new VALUE inside an existing axis, (c) a new CORE-worthy value?

| Shot | (a) axis | (b) value | (c) CORE | What |
|---|---|---|---|---|
| D#22 Fernly | – | – | – | 6+6 hero |
| D#23 Bun & Bite | – | – | – | half-bleed image, hairline 3+3+3+3, an inset 10 section (two left edges = A3 "several margin systems", already AVOID) |
| D#24 ROZIT | – | **1** | – | **A20: connectors (arrows) drawn across the gutters between steps** (LATER) |
| D#25 Brand Portfolio | – | **1** | – | **A18: a heading that crosses a colour-field edge, changing colour on each side** (mix-blend or two clipped copies; LATER) |
| D#26 Creative Brief | – | **1** | – | **A16: the words of one line distributed so each starts on a column line** (LATER; typography) |
| D#27 AURA green | – | **1** | – | **A20: a tint band on one row track running behind every cell of the row** (LATER) |
| D#28 AURA red | – | – | – | rules as zones, orphans keep span, type off the edge |
| D#29 TD Guide | – | – | – | print, one column |
| D#30 Nordic | – | – | – | sidebar 3 + 9, nested 6+6 / 4+4+4, orphan keeps span, 5 across |
| D#31 Participant | – | – | – | row-spanning side card, rail outside the grid |
| D#32 Pitch Deck | – | – | – | stagger + empty middle, rules as structure, words on lines (already counted at D#26) |
| D#33 Daily UI | – | – | – | 7+5 |
| D#34 Indigo Power | – | – | – | hairline stats, independent bento rows, inset card |
| D#35 AMIRA | – | – | – | print, 4+8 |
| D#36 Halberd & Cie | – | – | – | numbers only: gutter/column 0.50, a container of 88 rem (data points for A3 / A4, no new kind of value); a chart on page columns = A11's nested split on the same lines |
| D#37 NovaPay | – | – | – | 4.5 half-bleed, core splits |
| D#38 Finora | – | – | – | right rail spanning rows, per-row splits |
| D#39 Vegantree | – | – | – | column-masonry bento (A9), inset section, straddle |
| D#40 Pickle | – | – | – | count follows the format (A1 / A2) |
| D#41 PASTICHE | – | – | – | frame inside a bleed (A10, already there) |
| D#42 Plantify tablet | – | – | – | per-rung count, strip and carousel at tablet, straddle kept (A14 / A22 / A23 values, applied at the tablet rung) |

**Counts:**
- **(a) New axes: 0 of 21.**
- **(b) Shots that added a new value: 4 of 21 (19%)**, one value each, all decoration or typography.
- **(c) New CORE-worthy values: 0 of 21.**

**What the 4 new values are:** all four are LATER and none touches the page grid's structure.
- The gutter connector and the row-track tint extend A20.
- The colour-inverting heading extends A18.
- The word-per-column heading extends A16.

**Longest run with no new axis and no new CORE value: all 21 shots (D#22 → D#42).** Joined to the items 04 already
counted (≈ 34 since the last new axis at Awwwards #22), that is **≈ 55 consecutive items with no new axis**. Within
the batch, the longest run that added nothing at all, not even a value, is **15 shots (D#28 → D#42)**.

**The rate of new values keeps falling:**
- ≈ 100% per item on Awwwards;
- ≈ 38% on the first 21 Dribbble shots;
- **19% on these 21, and 0% over the last 15.**

**Against 04's proposed stop rule** ("the 21 unread Dribbble shots plus G9 / G10 add no new axis and no new CORE value,
over a run of ≥ 30 items"): **the Dribbble half is met.**
- 21 shots, 0 new axes, 0 new CORE values, and the run is now ≈ 55 items.
- G9 / G10 are data checks, not taste reading, and stay open.

**Caveat on what this batch can say:** 12 of the 21 are decks, print, apps, a video or a cover, and none shows a phone.
So it saturates **placement and bleed on desktop**. It adds **no evidence for Q1 / Q2 (phone counts)**. That evidence
still has to come from G10 (re-measuring the crawl at 768 / 375) and from real devices.

### Could not read (v3)
- **Unreadable images: none.** All 122 `shotImages` were opened.
- **D#40 (Pickle) has no `shotImages`** because the shot is a video. Its one gallery frame was read; the rest of the
  video was not captured and is not seen.
- **Partly hidden:** D#42 img11 has Dribbble's menu over part of the page.
- **Duplicate captures:** D#39 img2 is identical to img1.
- **Cropped or zoomed repeats:** D#33 img2 and D#34 img3. All are noted where they appear.

### D#40 Strategic Grid Design — Pickle (Habitat) · re-read after the video capture (ledger #34)
The shot is a 5-second VIDEO; the first capture took only its listing frame. Three frames now read
(`…-Pickle-img1/2/3.jpg`, at 0 s · 2 s · 4 s): a brand GRID SYSTEM — each format (poster, square, banner, tall card,
small card) is divided into its OWN column count, written on it: **12 · 6 · 4 · 3 · 3 · 2**; the columns are split by
hairlines with **no gap**; the brand word sits on the first column(s) and the count at the bottom-left. One idea, every
size: a format's width decides how many columns divide it. For the page grid this is direct support for (a) the column
count chosen PER SIZE (the user's Q1, 6 / 12, and the advanced panel's count) and (b) a ZERO-GAP divider whose columns
are separated by lines, the space being the content's own (the user's gap decision, 2026-10-03). Adds no new axis.
