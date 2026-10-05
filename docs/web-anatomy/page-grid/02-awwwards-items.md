# Page grid · the user's Awwwards link and its related items (R-3)

Source: the user's link https://www.awwwards.com/inspiration/grow-section-12-column-layout-thirdweb-studio-1, its 3
sibling items, 7 related items, and their on-topic related items one level down. Measured by
`scripts/research/grid-measure.js` (pass 2, `C:\Users\eyite\educo-research\grid\r3-v2.json`, pictures in `shots-v2\`).
Every picture of every record is opened and read; axis names are those of [01](01-builders-and-systems.md) (A1–A15).

> Status: group 0 (records 0–6) read in full; groups 1–4 being read. Known capture blind spots (ledger #12): lazy /
> scroll-animated content missing in some live captures, one cookie dialog left open (streetartnews).

## Group 0 — records 0–6 (4 distinct sites; 18 of 18 images read)

### #0 About us section — thirdweb.studio/about.html
- Not a CSS grid: Bootstrap `container-fluid` + flex + offsets. Edges sit on a 12-column half-step only 25–56% of the time.
- Fluid 24 px margin (21 on the phone); content 1377 at 1440.
- 1440: heading left half, paragraph right half from ≈6/12 · team photos a horizontal strip bleeding off BOTH edges
  (a carousel, not cells) · #hashtags staggered deliberately off-grid · "Our values" text 5/12 | image 5/12.
- Phone: text stacks to 1 column · the photo strip stays a horizontal scroll with the next photo peeking · hashtags HIDDEN.
- Axes: A1 effectively halves · A3 fluid margin · A7 free offset · A8 half/half · A10 full-bleed strip · A14 hides + stacks.
- New values: A10 *carousel strip bleeding off both edges, clipped mid-item* · A7 *staggered word cloud*.
- For a teacher: "two columns, then a photo strip" = a staff page. The off-grid tag cloud would confuse snapping.

### #1 Grow section — 12 column layout — thirdweb.studio/
- Tagged "bootstrap, 12column"; edges cluster at 0 · 4.1 · 6.1 · 8.1 of 12 — a rough 12 skeleton, on a half-step 25–50%.
- Awwwards image: an ornament band of 8 line-drawn tiles (an 8-module rhythm, NOT 12), heading ≈5/12 offset 1 column,
  then tabs ≈3 | image ≈3 | text ≈3 with gaps. Live 1440: the ornament bleeds full width, cut at the right.
- Hand measurement (this session): the three parts are 393 px each of a 1194 px box = 4 of 12; the heading starts at 67 px
  while the row starts at 115 px — NOT on the same line.
- Phone: tabs, then text; the IMAGE IS DROPPED; the ornament cropped; projects become 1-column cards.
- New value: A10 *a decorative band on its own module count, independent of the content grid*.
- For a teacher: "tabs | picture | details" = a programmes / courses row.

### #2 Bento grid — punchline.be (Webflow)
- A grid PER SECTION (14 at 1440), named by RATIO: `heading_4-7` (430 | 753, gap 96), `heading_7-4` (mirror), `card_list`
  2×1fr gap 20, `bento_component` 2 columns gap 16 with spans `span 1` · `1/3` (full) · `2/3`.
- Margin ≈5% fluid: 80 px at 1440 (content 1280) · 51 at 1024 · 38 at 768 · 19 at 375.
- Image: text ≈5/12 | pink stat tile ≈6/12; then photo ≈3 | lavender stat tile ≈6 | photo ≈3 — rounded tiles in a card.
- 768: 2 columns (bento c2 with a full span) · 375: everything 1 column; the logo strip keeps horizontal scroll.
- New value: A7 *an 11-unit ratio split (4 : 7)* — not twelfths (≈4.4 / 7.6 of 12).
- For a teacher: splits named by ratio ("4-7", "7-4" = a third and two thirds) read well; a bento of stat tiles and
  photos suits school facts ("100% pass rate"); mirrored splits alternating down the page are an easy pattern.

### #3 Navbar menu — thirdweb.studio/ (same page as #1, #4)
- Image: a full-screen menu overlay in 3 equal columns (4 of 12 each) divided by full-height hairlines that bleed above
  the frame — Home | About | Contact, each with a sub-list; "Contact" overflows its column and is cut at the edge.
- Live: the overlay is closed in the captures; on the phone the inline links hide and only "Menu" remains.
- New values: *visible column rules as design* · *type allowed to overflow its column*.
- For a teacher: a 3-column menu (Pages | Social | Contact) is a clear school pattern; text past the column would confuse.

### #4 Projects layout — thirdweb.studio/
- Image: a 2-column staggered portfolio — cards ≈6/12, gap ≈20, margin ≈33; the right column STARTS LOWER (offset),
  heights differ → a masonry rhythm. Live 1440 rendered black (lazy, ledger #12). Phone: 1 column of full-width cards.
- New value: A7 *a vertical offset of a whole column (staggered start)*.
- For a teacher: a 2-up gallery that stacks on the phone = the commonest news / events pattern.

### #5 Street Art News magazine layout — streetartnews.net
- Many section grids (23 at 1440): `news-stage` main + rail `972px 300px` gap 34 (spans `1/-1`, `2/auto`) · each article
  card is its own 2-column grid (text | image) · picks 4 columns (gap 20 / 27) · artists 5 · browse 3 · fresh-rail 4.
- Container margin ≈4%: 59 at 1440 · 32 at 1024 · 24 at 768 · 16 at 375.
- 1440: hero text card ≈4/12 beside image ≈8/12 · 4-up "Just published" · 5-up artists · list ≈9/12 + "Most viewed" ≈3/12.
- Phone: the rail DISAPPEARS · picks / browse to 1 column, fresh-rail keeps 2 · the artist strip scrolls · card image
  moves ABOVE the text. The Awwwards image shows an older design than the live site.
- New value: A5 *a fixed-px sidebar track beside a fluid main (972 / 300)*.
- For a teacher: main column + sidebar = the school news page; 9 + 3 maps cleanly onto 12.

### #6 Typography composition — arthursimonini.com
- ONE section template reused in every section → behaves page-wide: `home__section` 6 columns at 1440 and 1024
  (6 × 220, gap 15) · 4 at 768 (gap 10) · 3 at 375 (gap 10); gaps from CSS vars `--margin-md` / `--margin-lg`;
  `repeat(n, minmax(0,1fr))`, mobile-up `min-width` queries (576 / 900).
- 1440: marquee type bleeding off the right · a track list of hairline rows with the time pinned in a narrow column
  (`150px auto 47px`) · a poster wall, posters span 1 of 6 with DELIBERATE EMPTY CELLS · a timeline whose years are placed
  diagonally across the 6 columns (explicit `grid-column`, not auto-flow) · an expanding detail panel spanning 3 of 6.
- Phone: KEEPS 3 columns — posters 3-up, years alternate column 1 / 3.
- New values: A7 *deliberate empty cells / sparse explicit placement* · A1 *a 6-column page grid (half of 12)*.
- For a teacher: a photo wall that stays 3-up on the phone is a great gallery; empty cells read as "something is missing".

## Group 1 — records 7–13 (7 distinct sites; 40 of 40 images read)

### #7 Layout — dobrynow.pl/aktualnosci (news archive)
- Bootstrap 12 inside a `.container`: news cards `col-lg-4` (3 across) at 1440 / 1024 → `col-md-6` (2) at 768 → `col-12`
  (1) at 375, in source order. Gutter ≈24 between cards; outer margin 64 → 32 → 8. Footer re-declares `col-md-3` /
  `col-lg-5 / 7`. A gallery page uses `grid-template-areas` (3 columns, an image spanning 2 rows → 2 columns under 575).
- No bleed; whole columns only. For a teacher: exactly the school news grid, 3 → 2 → 1.

### #8 One page scroll layout — timbrack.de
- No grid: one large image per project placed off-centre (≈1/9–7/9) with a huge black word overlapping its corner; a
  rotated "study work" label in the LEFT MARGIN. 75 px margin; a dark full-width band.
- Phone: OVERFLOWS sideways (scrollWidth 1005 at 768 and 375) — the giant type does not scale. A cautionary example:
  fixed type breaks phones; the builder's fluid type is the answer.
- New value: *content placed in the outer margin (a rotated side label)*.

### #9 Special characters — pp-fragment.com
- Several independent grids sharing ONE gutter token `--grid-gutter` (20 → 18.75 → 17.5): intro 2 × `minmax(0,1fr)`
  (`span 2` for the large intro), controls / fonts / languages 4, push 3, a glyph matrix 13 / 9 / 7.
- The intro column narrows its measure with `padding-right: 25%` without leaving the grid; the glyph dropdown breaks
  out with `width: var(--container-width)` + a `calc(50vw - …)` padding.
- Phone: most grids 1 column, two KEEP 2; the fonts grid is HIDDEN (`u-hide@to-small`); no overflow.
- New values: *hide a whole grid at a rung* · *inner padding as a % of the track to narrow the measure* · *a fill matrix
  with a fixed count per rung*.

### #10 Project portfolio — saintlouvent.com/print
- The live page is now a 404 (all 16 live shots are "404 Not Found") — measurements void (ledger #13).
- The Awwwards image: a staggered asymmetric gallery — pictures of different sizes starting at ≈ columns 1 · 4 · 7–8 · 10
  of an implied 12, at DIFFERENT HEIGHTS, some running to the page edge on one side (half-bleed), captions beneath.
- New value: A9 *vertical offset / stagger within a row*. For a teacher: an art-department gallery.

### #11 Text on a grid — klimov.agency
- The Awwwards frames (an older design): the column grid DRAWN on the page with dot markers at each line (≈6 columns), a
  vertical nav on the left, social links on the right, a counter ("02 / 04 / 06") bleeding off the left edge.
- Live: percentage-named columns `col-24 / 31 / 45 / 55 / 56 / 76 / 100` (a % of the width, not twelfths); margin 36 → 15.
  The 1440 capture is blank (intro never ran). Phone: 1 column.
- New values: *percentage-named columns* · *grid lines shown as decoration on the PUBLISHED page* (A12 covers the editor only).

### #12 Grid setup — punchline.be/wat-we-doen
- Webflow; content box 1280 max (80 margin) → 922 → 691 → 338. Splits named by ratio of 11: `heading_4-7` / `heading_7-4`
  (gap 96); services: heading in the left 4 of 11, two cards in a NESTED 2-column grid in the right 7; then 4 cards
  across (305 each, gap 20) at full width; heading row bottom-aligned. Two gap families: 96 between big columns, 20
  between cards. Logo strip a marquee bleeding both edges.
- 768: the 4 cards → 2, hero → 1 · 375: everything 1 column, the gap between stacked cards GROWS to 56.
- New values: *an 11-unit split (4 + 7)* · *a row gap that grows when the row stacks on the phone*.
- For a teacher: "heading takes 4, content takes 7, then a row of 4" — an "our subjects" page could copy it.

### #13 Website layout — digivalet.com
- Webflow; 1280 container. Grids share no count: `1fr 1fr` gap 96 · `2fr 3fr` (464 / 696) gap 120 with a nested 2 × 2 ·
  4 × 272 gap 64 · `1.25fr 1fr` · a centred 720 title.
- Hotels 4 across with ALTERNATE COLUMNS PUSHED DOWN (`.hotel-column.lower-part`); a collage of room photos bleeding both
  edges; a strip of 5 × 380 px cards that runs past the container and scrolls sideways — and keeps scrolling on the phone.
- Phone: everything 1 column (8 tall hotel cards = a very long scroll — "keep 2 across on the phone" would help).
- New values: *a staggered column offset* · *a fixed-track sideways-scroll strip that keeps its tracks on the phone*.

## Group 2 — records 14–20 (45 of 45 images read)

> Three live sites are NOT the design on Awwwards: #14 (the domain now hosts another blog), #15 (redesigned, a pop-up over
> both shots), #17 (the link is the Codrops article, not the demo). Their notes come from the Awwwards images.

### #14 Page layouts — Erwin Hines, Directory of Work
- Image: ONE 12-column grid for the page, its halves two 6-column zones split by a visible vertical rule. Left: heading ≈5,
  paragraphs ≈5.5, a meta row of three ≈2-column labels. Right: an inset image ≈6. Info page: portrait 4 from column 1,
  columns 5–6 EMPTY on purpose, text from the midline (column 7) spanning 6, an awards list right-aligned on the edge.
- New value: *a divider drawn on a grid line*. For a teacher: "picture left, words from the middle line" is very teachable.

### #15 Typography on a grid — eccarchitectural.co.nz
- Image (older design): the logo starts at the midline (column 7, ≈3 wide); nav on a red hairline over columns 1–6; labels
  HANG from red vertical rules on columns 1 and 4; a full-height red tab fixed at the right edge, OUTSIDE the grid; a photo
  half-bleeding to the right. Live (redesign): intro ≈5/12, four product tiles 3/12 each; phone 1 column.
- New values: *a fixed edge tab outside the grid* · *grid lines drawn as visible rules*.

### #16 Typographic layout — emotivefeels.com
- 1440: a 6 | 6 hero (image | words), then full-bleed gradient bands, one word each at the margin; an illustration crosses
  three bands (overlap into neighbours). REAL sideways overflow at 1440 (scrollWidth 1482).
- Phone: words first, the hero image HIDDEN; media revealed on hover at desktop becomes an inline block on touch.
- New value: *hover-revealed media that becomes inline content on a touch screen*.

### #17 Layout with reveal animations — Codrops (article page measured, not the demo)
- Image: huge stacked words from ≈column 2 with an index "03" hanging in the margin; rotated thumbnails placed freely.
- Live article: header `130px 1fr auto` gap 5vw · content `1fr 360px` with named areas · padding `clamp(1rem, 5vw, 4rem)`.
- The card grid goes 2 → 1 → 2 → 1 across 1440 → 1024 → 768 → 375: a FIXED 360 px sidebar squeezes the main column until it
  drops below. New value: *a non-monotonic count caused by a fixed sibling track* — rules must follow the box, not the window.

### #18 Breaking the grid — cafelapetitereine.ch
- A one-screen poster, absolutely positioned: the photo spans ≈4.3–8 of 12 (not even on half-steps); vertical
  (`writing-mode`) text for hours and address; 8 px margin.
- Phone: the same composition crammed — title clipped, text over the photo, badge cut: NO REFLOW (fails WCAG 1.4.10).
- New value: *vertical text blocks as layout elements*. For a teacher: an anti-pattern for a school site.

### #19 Portfolio — Hervé Baillargeon (Locomotive)
- `--grid-columns: 7` under 700 px, `14` from 700; gutter 1 → 1.25rem; margin 1.25rem; `repeat(var(--grid-columns), 1fr)`.
- Desktop: two title lists centred on ≈4 and ≈10 of 14; navigation DOCKED to the left / right edges mid-height. Phone: one
  merged list; the edge navigation moves into a top bar (repositioned, not stacked).
- New value: *an odd base count doubled at desktop (7 → 14)* — half-steps on the phone become whole columns on desktop:
  our "half-column" idea done by doubling.

### #20 Journal layout — weareheavy.com
- Tailwind. Header `grid-cols-12`, no gap: logo span 4, middle from column 5 span 3, menu `span 3 / 13`; hero "Journal"
  `1/-1`, intro `7 / span 6` (1440) → `6 / span 7` (1024). The journal is a SEPARATE 8-column grid, gap 16.
- Card spans by POSITION, `nth-child(11n + k)` at ≥ 1280: rows 4 · 2 · 2 / 2 · 4 · 2 / 2 · 2 · 2 · 2 / 2 · 4 · 2 (of 8);
  768–1279 every card 4 of 8 (2 across); phone 8 of 8.
- New value: *spans assigned by position in a repeating pattern* — an automatic magazine rhythm. For a teacher: a
  ready-made "news grid" that picks big and small cards by itself.

## Group 3 — records 21–27 (58 of 58 images read)

### #21 Layout — AC Visa Center (visacenter.chipsa.design)
- `--grid-columns: 22` at 1440 / 1024 / 768 → `12` at 375 (and on a LANDSCAPE phone up to 900 px); gap 10; margin 20 → 12;
  re-declared on every component from the same variables = effectively one page grid.
- Every band repeats one header pattern on the SAME columns: counter 3/6 · title 11/16 · big number 16/-1 — rhythm.
- Bleed: full-bleed hero and bands, a photo half-bleeding to the left, a pill-shaped mask over a band.
- Phone: stacks; stats keep 3 across (4 of 12 each); the footer card keeps 2.
- New values: *a 22 / 12 ladder* · *an orientation breakpoint*.

### #22 Clean layout — videinfra.com
- Bootstrap-like 12 used as HALVES through the whole page: "label left, content right" (6 | 6) in every band; the left
  label is STICKY beside the scrolling right column. Full-bleed hero video; the wordmark spans the full content width.
- Phone: 1 column, REORDERED — the "Learn more" pill moves below the paragraph.
- New value: *a sticky cell (a position behaviour per cell)*. For a teacher: "label left, content right" is very usable.

### #23 Horizontal visible grid — carusihr.com
- No column grid: HORIZONTAL row lines every ≈150 px drawn as decoration; a full-screen slider with bars on row lines
  bleeding off one page edge. Phone: the lines and bars disappear; slider with dots; headings clipped mid-animation.
- New value: *row guides published as decoration*.

### #24 Homepage grid layout — gregorylalle.com
- Tailwind `grid-cols-16` (gap 10) at 1440 / 1024 / 768 → `grid-cols-6` at 375; margin 20; one `.grid-w` reused by header,
  images and footer = a page-wide grid. Items placed by explicit `col-start` + `span`; 16 columns contain 12's half-steps.
- Phone: KEEPS two regions on 6 columns — images in columns 1–3, the project list in 4–6. Does not stack.
- (Capture: live-1440 caught only the preloader — ledger #12.) New value: *a 16 / 6 ladder*.

### #25 Custom layout — enlitia.com (Webflow)
- Section frame `minmax(60px, auto) minmax(200px, 1240px) minmax(60px, auto)` — the margins ARE tracks (96 → 60 → 40 → 20);
  the frame drawn with ruled lines. Stat rows: a wide ⅔ cell and a narrow ⅓ cell alternating sides (zig-zag); gap 0,
  borders instead.
- Phone: 1 column, the narrow illustration cells HIDDEN, alignment right → left.
- New value: *rules (borders) instead of a gap*. For a teacher: "big number + small picture" rows suit school results.

### #26 Content layout — pp-fragment.com (same site as #9; adds)
- Body text as TWO columns nested inside the right half; "4 cuts / 9 styles / 581 glyphs" as a STAIRCASE of offsets;
  the staggered indent is kept on the phone.
- New value: *a staircase / per-line offset as intentional placement*.

### #27 Bento grids — eddie.eco
- `.l-grid` reused per section: 24 columns at 1440 · 18 at 1024 · 12 at 768 · 2 at 375; gap 20 (10 for the phone bento);
  margin 40 → 25 → 15. Spans: hero `3 / span 6`, `span 8`; bento 13 + 11; list `3 / span 9` + `13 / span 10`; a case study
  `2 / -2` (inset one column each side). Cards: `repeat(var(--cards-grid-columns, 2), …)` → 4 from 768, children
  `span var(--cards-grid-element-span, 2)`; `:only-child { grid-column: 1 / -1 }`.
- Bento rows choose their own splits (widths do not line up across rows). A full-bleed video band OVERLAPS the cards above
  and below it. Phone: hero cards become a sideways-scroll strip; the rest 1 column.
- New values: *a 24 / 18 / 12 / 2 ladder* · *a lone child takes the full span automatically* · *rows that choose their own
  split*.

## Group 4 — records 28–34 (89 of 89 images read)

> Live pages that are not the design: #30 and #34 are 404s (32 shots of error pages, measurements void — ledger #13);
> #29's domain now serves another site (Prelumen); #32 at 1440 was caught on its loader, #33 below the fold never rendered
> (ledger #12). Their notes come from the Awwwards images.

### #28 PP Fragment layout — pp-fragment.com (third record of this site; adds)
- A persistent side rail (`--sidebar-width`) SHIFTS the grid's origin; the "push" block is centred ≈9 of 12, full at 768.
- New values: *a side rail that moves the grid origin* · *a stagger inside a 2-column pair*.

### #29 Normform — normform.art (live is now Prelumen)
- Image: a ¼ info column beside a 4 × 4 mosaic of square tiles with ZERO gutter.
- Live: `.grid--12 { repeat(12, 1fr); gap: 5vw }` at every width — and below 768 the gap is 0 and every child `1 / -1`: it
  KEEPS 12 tracks and forces every child full-span instead of reducing the count. Cards 4 / 4 / 4; "label 2 | list 10"
  news rows, each row re-declaring its own 12 inside the 10; utility `repeat(auto-fit, minmax(min(300px, 100%), 1fr))`.
- New values: *a gutter in vw* · *keep the tracks, force the full span on the phone* · *a zero-gutter tile mosaic*.
- For a teacher: "label 2 | list 10" is the school news list.

### #30 Project grid — igorsokoltsov.com (live a 404; image + CSS rules)
- Image: a Swiss TABLE grid, 5 bands of 20% with visible hairline cell borders, no gutter: header © 2 | Cases | About |
  Contact; image columns 1–4 beside a social-links cell in 5; label | value rows (1 + 3). CSS: ≤ 767 → 4 × `minmax(0.25rem, 1fr)`.
- New values: *published cell borders as the style* · *a 5-column layout* · *label | value rows*. For a teacher: a fact sheet.

### #31 Adaptive layout — wearebright.studio
- Bootstrap rows inside a TWO-PANEL shell: content 75% | a black "See work" panel 25% that SCROLLS ON ITS OWN; clicking a
  project ANIMATES the split (50 / 50 → ≈85 / 15). Awards table 3 columns; giant wordmark full panel width.
- Phone: 1 column; the work panel hidden off-canvas; the awards table KEEPS its 3 columns; the marquee clips.
- New values: *an independently scrolling panel column* · *a split ratio that changes on interaction* · *a table that keeps
  its columns on the phone*.

### #32 Landing page — aquadev.site
- No grid: a staggered stack of headline lines (indents ≈1.9 and ≈3 of 12); giant project words with an image card
  overlapping them, alternating sides; fixed edge chrome (a vertical "Sound off", a corner menu).
- Phone: the giant words are CLIPPED at the right (`overflow: hidden` — content lost, no scroll). A trap.
- New values: *type larger than the screen, clipped* · *fixed edge chrome outside the grid* · *image / text alternating per item*.

### #33 Juliet agency — wearejuliet.com
- A `.container`, no page grid: a hanging index ("01") in the margin left of a huge title; a full-width image; a dark
  sideways-scroll carousel cut at both edges; a 3-column footer.
- Phone: the hanging index is kept; forced justification spreads words widely (reads poorly); marquee pills clip.
- New values: *a hanging index outside the text edge* · *a sideways-scroll track section*. For a teacher: the numbered
  project list = "Our programmes".

### #34 Art direction and photography — saintlouvent.com/photography (live a 404; recording only)
- One screen: nav top-left, caption pinned bottom-left, ONE portrait image centred at ≈4.5 → 7.5 of 12 — **3 columns
  starting on a HALF-COLUMN** — and a vertical filmstrip of thumbnails ≈9.2 → 10.7 scrolling continuously, synced to the hero.
- New values: *half-column placement in the wild* · *corner-pinned captions* · *a fit-to-screen layout with its own rail*.
- For a teacher: "one big photo + a thumbnail rail" = the school photo album.

## Re-read after the fixed capture (v3)

Source: `C:\Users\eyite\educo-research\grid\r3-v3-aw.json` and `shots-v3\` (one picture per screen as a visitor scrolls,
1440 and 375). 13 records re-read, plus #35 Ceram, which is new. **260 images opened, all of them readable.** Some
captures are still partly blind, and each entry says where.
Widths 768 and 1024 come from the measurements only (there are no pictures at those widths). Spans are in 12ths of the
content box unless another unit is named.

### Thirdweb — one live page read for #1 Grow, #3 Navbar and #4 Projects; #0 About read separately
- **The home page (1440), section by section:**
  1. Fixed transparent header. Body text runs under it and collides with the links.
  2. Hero: a stepped headline with a phone photo on the right.
  3. Four client logos spread space-between across 116–1309.
  4. "What is Web3 studio?": text 116–655 | a line drawing 775–1310 (halves of the inset frame), with a glow bleeding
     off the right edge.
  5. Projects.
  6. The ornament band.
  7. "How we can help grow".
  8. An About collage.
  9. Footer: brand block 0–6/12, link columns starting at 6/12 and 8/12, and a vertical "Back to top" rail.
- **Three different left edges on one page:**
  - 24 px gutter: header, footer, hashtags.
  - 40 px: the projects grid.
  - ≈8 vw: the text frame. It sits at 116 at 1440, 84 at 1024 and 60 at 768, so it lands at 0.79/12, not on a column line.
- **No grid in the markup:** only `container-fluid` ×2, with no `row`, no `col-*` and no CSS grid. The "bootstrap,
  12column" tags are not backed by the markup.
- **The page overflows sideways at both widths:** scrollWidth is 15 px over at 1440 and 10 px over at 375. The cause is
  probably a `100vw` element (the ornament band).
- **#1 Grow, corrections:**
  - The row is **three 4/12 slots**: tabs at 0–4, image at 4.1–7.25, text at 8.06–11.96. It is not ≈3 | 3 | 3. The
    image is only ≈3.2/12 wide and left-aligned inside its 4/12 slot.
  - The heading starts at x≈70, which is **46 px LEFT of the 116 text line**: a hanging, outdented heading. In m1 it is
    aligned with the text instead, so it may be mid-animation in the capture.
  - The ornament is a **fixed 200 px tile module** at 1440 (7 tiles plus a 25 px sliver, two rows, the second sparse),
    not 8 tiles. m1 is 1600 px wide, which is why it shows 8. At 375 the whole drawing **scales** to tiles of ≈125 px
    rather than cropping at a fixed size.
  - Phone changes the earlier note missed:
    - the hero photo moves ABOVE the headline;
    - logos go from 4 across to 2×2;
    - the About collage photos are all hidden;
    - the footer link columns are hidden;
    - the header turns into a solid black bar.
  - The About collage photos (≈2/12, 3/12 and 2/12) **move on scroll** (parallax), independently of the text.
- **#4 Projects, now that it renders:**
  - Two columns of cards, **exactly 6/12 each**: 660 px, **gap 25, margin 40 on both sides** (40–700 | 725–1385). The
    earlier "gap ≈20, margin ≈33" was wrong.
  - **"The right column starts lower" is WRONG:** both columns start at y=783.
  - It is a **balanced masonry**:
    - left column: three landscape cards (426 + 404 + 349 = ≈1229);
    - right column: one tall card plus one other (788 + 414 = ≈1227);
    - the two columns end flush, within about 2 px.
  - Only 5 featured cards are shown, while the nav badge says 24 projects.
  - **Phone stacks column by column:** all the left column's cards, then the right's. That means two column wrappers,
    not one interleaved list.
  - Cards keep their aspect ratio on the phone (328 wide, 16 px margin).
  - **Titles and tags are shown under each card only on the phone.** At 1440 they are hidden (probably revealed on
    hover).
- **#3 Navbar:**
  - The live header has **5 centred inline links** (Projects carries a "24" count badge, and Career is added), not the
    3 of the overlay.
  - The overlay is never open in any capture, so the 3 × 4/12 columns with column rules and the type running past its
    column remain **image-only and unverified**.
  - The overlay's sub-lists repeat the footer's link columns.
  - On the phone, only "Menu" remains and the header gains a solid background.
- **#0 About (about.html), corrections:**
  - The paragraph starts at 673 px, **≈5.6/12**, not on the half line.
  - "Content 1377" is the outer container. The body actually sits in the **116–1310 inset frame**.
  - The team strip is a **scroll-linked sideways drift**, not a carousel. It bleeds off one edge at a time, which is why
    the earlier capture seemed to show both.
  - The hashtags are **not off-grid**. They form a regular **3 + 2 brick**: a 551 px pitch with row 2 shifted half a
    pitch, anchored on the 24 gutter.
  - "Our values" is two equal halves of the frame (≈540 each, gap 115). It is followed by a **mirrored "Vision" row**,
    which the earlier note missed: together they make a zig-zag.
  - On the phone, both rows read text first, so the desktop Vision row is visually reversed (`row-reverse` / `order`).
  - The "Central Europe, Slovakia" subtitle shown in m1 is gone from the live page.
  - No sideways overflow.
- **New values:**
  - *Several margin systems on one page* (gutter 24 · section 40 · frame 8 vw).
  - *A hanging, outdented heading.*
  - *A narrow item inside a wider slot.*
  - *A stepped headline* (lines flush left or right-aligned to one edge), kept on the phone.
  - *A balanced 2-column masonry.*
  - *Column-major stacking on the phone.*
  - *A caption shown only when stacked.*
  - *A decorative tile band on its own fixed module, which scales on the phone.*
  - *A parallax photo collage that is dropped on the phone.*
  - *A scroll-linked drift strip.*
  - *Brick-offset type rows.*
  - *A zig-zag whose phone order resets to text first.*
  - *A header background that changes per rung.*
  - *A vertical "back to top" rail in the footer.*

### #2 Bento grid — punchline.be (home)
- **The bento is a 12-column grid** at 1024 and wider: `repeat(12, 1fr)`, gap 16, tracks of 92 px at 1440 and 62 px at
  1024. Its 5 children span **6 | 6** and then **3 | 6 | 3**.
  - The earlier "2 columns with spans 1 · 1/3 · 2/3" is only the **768 override**.
  - "Text ≈5/12 | pink ≈6/12" is wrong: it is exactly 6 | 6, and the text simply does not fill its cell.
- **Three kinds of cell:**
  - **Untiled text:** the eyebrow, h2 and 2 buttons sit directly on the page. The first cell is not a tile.
  - **Colour stat tiles:**
    - Pink: a paragraph at the top and the stat at the bottom (space-between).
    - Lavender: the stat only, bottom-left, with the top empty.
  - **Photos:** span 3 each, 308 px wide.
- Row 2 is equal height (≈383). All tiles share one radius (≈16).
- The photos scale or slide in on scroll: s7 caught them smaller.
- **"Rounded tiles in a card" is wrong.** The white card is Awwwards' m1 presentation mock-up, with older photos. Live,
  the bento sits straight on the page.
- **Phone:** one column in DOM order, gap 16. The photos stay tall portraits (≈338 × 400), while the text and stat tiles
  shrink to their content (lavender ≈215 tall).
- **Missed sections:**
  - **Sticky stacked cards**, `heading_7-4`: three big cards in the 7 fr side, with a **scroll-driven active colour**.
    The lavender is a state: on the phone all three are pink. On the phone the heading comes FIRST, the reverse of the
    desktop order.
  - **CTA:** `repeat(auto-fit, minmax(24rem, 1fr))`. At 1440 it computes 630 | 630 | **0**, so an empty collapsed
    track is left. It is 1 column from 768.
  - **Footer:** 192 | 944 with a nested 3-column menu, gap 144.
- **Other corrections:**
  - The `heading_4-7` / `heading_7-4` grids **stop being grids below ≈991** and simply stack.
  - The logo strip is an auto-running **marquee with overflow hidden** (scrollW = vw), not a sideways scroll.
- **Equal-height cards with flexible media:** in the services pair the titles end on one line (y 690) while the photos
  end at different heights (468 and 533). The media absorbs the difference in text length.
- **Confirmed:** `heading_4-7` 430 | 753, gap 96, and its mirror; `card_list` 2 × 1fr, gap 20; margins 80 / 51 / 38 /
  19. The margin is **5% of the viewport, capped by a 1280 max width**: 5% of 1440 would be 72, but the cap gives 80.
- **New values:**
  - *A 12-column bento of 6|6 / 3|6|3.*
  - *Bento cell kinds* (untiled text · stat tile · photo), with *photos that keep their aspect on the phone while tiles
    collapse to their content.*
  - *An auto-fit track that collapses to empty on wide screens.*
  - *A desktop vs phone order swap.*
  - *Sticky stacked cards with an active state.*
  - *Equal-height cards with flexible media.*
  - *A fluid % margin capped by a max width.*

### #12 Grid setup — punchline.be/wat-we-doen
- **Missed: the hero is a 7 : 5 split**, `hero_component` (690.7 | 493.3, gap 96).
  - The photo is rounded on its **top corners only** and sits flush on the band's bottom edge (it bleeds to the section
    edge).
  - At 768 it becomes 1 column with gap 80.
  - On the phone the photo is a **narrower, centred image** (≈240 of 338, about 71%), and still flush at the bottom.
- **Services:**
  - The cards alternate a **photo** and a pale **tile holding only an emoji**.
  - The 4 × 305 row has unequal media heights, but its **titles all end on one line**: equal-height cards whose media
    flexes.
  - On the phone the media becomes a fixed box (≈338 × 383).
- **At 1024 the "4 × 1fr" row is UNEQUAL** (206 / 228 / 222 / 206): `1fr` is `minmax(auto, 1fr)`, so the long headings
  push their columns wider.
- **The gap that grows to 56 on the phone does so only for the services lists** (class `gap-large-landscape`). The
  portfolio list keeps 18.
- The gaps are **Webflow responsive variables**, which step per breakpoint rather than using a fluid `clamp()`:
  - `gap-large`: 96 at 1024 and wider, 80 at 768.
  - `gap-small`: 20, or 18 on the phone.
- The phone footer switches to **centred text**.
- **Confirmed:** the 4 : 7 split with a nested 2-column grid in the 7; content width 1280 → 922 → 691 → 338; 4 cards
  → 2 at 768; a bottom-aligned heading row.
- **New values:**
  - *A 7 : 5 hero split.*
  - *Media bleeding to the section edge with only some corners rounded.*
  - *`1fr` min-content blow-out at an intermediate width.*
  - *A gap that changes on the phone only, per list.*
  - *Gap tokens that step per breakpoint.*

### #5 Street Art News — streetartnews.net (no consent box this time)
- **The page at 1440, in order:**
  1. A 970 px ad leaderboard above the header.
  2. A two-bar header.
  3. The masthead, with a row of 9 "Explore" chips.
  4. The hero, spanning `1/-1`: a dark text panel 59–556 (**≈4.6/12**) | the image (**≈7.4/12**). That is a ≈38 / 62
     split, not 4 | 8.
  5. "Just published", the `fresh-rail`: 4 × 313, gap 18, with **hairline dividers between tiles**.
  6. The artist strip: 5 × 252, gap 12.
  7. Ad rows.
  8. The `news-stage`: `972px 300px`, gap 34.
     - Main column: a ONE-column stream. Each story is its own grid, text | image ≈ **49 / 51** (`467.5px 481.5px`,
       gap 23).
     - **Ad rows spanning `1/-1` inside the stream**, every 6–8 stories.
     - Rail: "Most viewed", whose rows are a tiny `31px 259px` grid (number | text). Below it, **a sticky 300 px ad**
       that stays ≈82 px from the top.
- **Corrections:**
  - "23 grids" should be **36**: 24 of them are story cards, because more of the lazy stream loaded.
  - "Fresh-rail 4" and "4-up Just published" are **the same section**, not two.
  - **"The rail DISAPPEARS on the phone" is WRONG.** From 1024 down the stage stops being a grid, and the rail **drops
    BELOW the stream, capped at 700 px wide** (full width, 328, at 375).
  - The story card is 2 columns at 768 and 1024, and becomes 1 column only at 375.
  - On the phone the **hero** image moves above its text, not only the card images.
- **Columns per width:**

  | Grid | 1440 | 1024 | 768 | 375 |
  |---|---|---|---|---|
  | fresh-rail | 4 | 4 | 2 | 2 |
  | artists | 5 | 5 | — | sideways scroll |
  | picks | 4 | 4 | 4 | 1 |
  | browse | 3 | 3 | 3 | 1 |

  - Picks and browse are measured but **still not photographed**: both captures end inside "The latest".
  - Margins: 59 / 32 / 24 / 16.
  - Nothing bleeds. At 375 the chips, the search box and the ads are clipped on the right.
- **Stylesheet rules this page does not use:** `.lead-grid 1.75fr .85fr`, `.story-grid repeat(3)` (overridden to 1
  column), and `.article-layout 1fr 230px` (the article pages). Breakpoints are 1100 / 920 / 680.
- The Awwwards m1 shows a different, light 2019 concept: a tall portrait hero beside a vertical strip of 5 thumbnails.
- **New values:**
  - *A rail that drops under the main column, capped at a max width* (not full width, not hidden).
  - *A sticky item inside a grid column.*
  - *In-stream rows that span all columns, repeated.*
  - *A ranked list whose rows are a tiny 2-track grid.*
  - *Hairline dividers instead of a gap.*

### #11 Text on a grid — klimov.agency (the 1440 capture is no longer blank)
- **A three-line frame shared by the whole page.** The lines sit at 36 · 368 · 796 px (0 · 2.94 · 6.74 of 12, i.e.
  24.5 / 31.6 / 43.9%). The header (logo, "Discover", "Inspirations"), the intro, every tile and the footer start on
  these lines.
- **Tiles: starts snap to the grid, ends are free.**
  - Each tile starts on one of the 3 lines. Its right edge falls wherever its width puts it: widths of 6.2 / 5.3 / 6.6
    / 6.5 / 6.0 / 4.7 / 3.2 of 12.
  - Each tile is a % column nested inside a % column (col-55 / 56 / 76 inside a parent).
  - The right-hand partner sits **100–200 px lower** than its left partner: a staggered zig-zag with large white space.
- **768 and 1024 keep the same 3-line frame** (≈25% / ≈57%). Only the phone goes to 1 column.
- **The gutter is a constant 36 px from 768 to 1440**, and 15 on the phone.
- **No CSS grid at all:** flex rows of percentage-named columns.
- The header is fixed and transparent on desktop. On the phone it is a "Menu" button that scrolls away.
- **Phone hides content:** the closing paragraph, "Find out more", Location, New Business and "Top" are all hidden.
- **The m1 concept, corrected:**
  - **5 bays of ≈150 px plus 2 outer rails** (a vertical nav on the left, social links on the right), with 6 tick marks.
    Not "≈6 columns".
  - The counter is **"NN / 12"**, a slide index; 02 / 04 / 06 are just the three sampled frames. It is clipped at the
    content line.
  - Also in m1:
    - a background split about 50/50 that is **not on a grid line**;
    - the title **overlapping** the image across a column line;
    - a blue CTA hanging off the image's bottom-left corner.
- **New values:**
  - *Starts snapped, ends free.*
  - *A vertical stagger between partners in a row.*
  - *Widths made by nesting percentages.*
  - *Nav items placed on the page's column lines.*
  - *A gutter that does not change with width.*
  - *Whole content blocks hidden on the phone.*
  - *A background split off the grid.*
  - *An element hanging off a block's corner.*

### #15 Typography on a grid — eccarchitectural.co.nz (the pop-up is STILL there)
- **The capture was not fixed for this site:**
  - A newsletter pop-up covers all 18 live shots: x 545–895 at 1440, and ≈85% of each phone screen.
  - The hero slider is still black.
  - The 1440 page reads through the dimmed overlay. **The phone is mostly unreadable**: only the headers, centred
    section titles and footer edges show.
- **What the live redesign shows (1440):**
  - No grid and no framework (flex). **Margin = gap ≈1.18 vw**: 17 px at 1440, 12 at 1024.
  - Product tiles: 4 × 339, gap 17 = **3/12 each** (confirmed).
  - **Missed by the earlier note:**
    - a **full-bleed marquee band** of huge serif brand names, clipped at both viewport edges, ignoring the grid and the
      margins;
    - a **fixed "ecc" logo** pinned top-left that content scrolls under;
    - a feature pair of **halves**;
    - a brand spotlight: a title in the left half with a **2×2 group of tiles** in the right half. The title hangs off an
      em-dash rule;
    - a project story: **photo 9/12 | text 3/12**;
    - 4 project tiles at 3/12;
    - a "Showrooms" footer in **7 equal columns** (1/7, which does not divide into 12).
  - The intro's true width is hidden by the pop-up, so "≈5/12" is **unconfirmed**.
- **Phone:** 1 column with 16 px margins and centred headings. **768 is also 1 column** (32 px margins).
- **The older design (m1), corrected:**
  - The logo starts at **2/3** of the measure and is 1/3 wide, not "column 7, ≈3 wide". It has a red bar above it.
  - The nav hairline runs 0 → 2/3. The nav labels sit on **1/8 steps**.
  - The second label rule is at **3/8 = 4.5/12**. The page mixes eighths and thirds, so it fits a **24-column grid**,
    not 12.
  - The photo runs past the content edge to the red tab, which is fixed outside the grid (confirmed).
- **New values:**
  - *A section-to-section count change* (quarters → 7 equal columns).
  - *Margin = gap in vw.*
  - *Display headings with an em-dash hanging indent.*
  - *A 24-column (eighths + thirds) composition.*

### #24 Homepage grid layout — gregorylalle.com (the real home page, no preloader)
- **The CSS:** `.grid-w { repeat(6, minmax(0,1fr)); column-gap: 1rem; padding-inline: var(--padding-container) }`,
  becoming 16 columns at ≥ 768. It is shared by the header, a second `.grid-w` and 10 `.home-images.grid-w` rows
  (10 projects × 6 images).
- **THREE layouts, not two.** An `xl` breakpoint (1200) re-places the items:
  - **≥ 1200:**
    - 6 thumbnails per row, each span 2 (2/16 = 1/8, 166 px): columns 1–2 and 3–4, then a jump to **column 9**, then
      9–16.
    - So columns **5–8 are an empty corridor**: a row is 4/16 · 4/16 empty · 8/16.
    - A **position: fixed layer** is aligned to the same grid by its own `.grid-w`. It holds a huge "Works," title over
      columns 1–5 (drawn ON TOP of the scrolling rows) and the index list in column 6, inside the corridor.
  - **768–1199:** the images stack one per row in the left 8/16. The list sits in columns 11–16 (the right 3/8).
  - **375:** 6 columns. Images in columns 1–3 (the left half), stacked. The index is **fixed at the bottom right** in
    columns 4–6. No title and no numbers.
- **Thumbnails mix aspects:** 166 × 104 landscape, 166 × 166 square and 166 × 219 portrait. They are top-aligned with
  ragged bottoms (not masonry).
- **Project numbers sit in leftover cells,** at different columns, alternately left- and right-aligned to a column
  edge.
- **Scroll-spy:** an arrow marks the active project in the list (it did not update on the phone). A progress bar grows
  on the right edge (the left edge on the phone).
- **"16 contains 12's half-steps" is wrong as stated.** 12's half-steps are 24ths. Only the EVEN 16th lines (= 8ths)
  fall on them, and 16ths and 12ths share only the quarter lines. The high on12half (0.86) comes from every span being 2.
- **The gap and margin are 1 rem and 2 rem on a fluid root:** 9.62 and 19.24 at 375, 10 and 20 from 768.
- m1 is an older 8-project version of the site.
- **New values:**
  - *An empty corridor made by an explicit col-start.*
  - *A fixed overlay aligned to the page grid by sharing its class.*
  - *A third layout at an xl rung.*
  - *Mixed aspects top-aligned in a row.*
  - *Labels and numbers placed in leftover cells.*
  - *A fluid root rem.*

### #32 Landing page — aquadev.site (the hero rendered this time)
- **Measured:** no grid. The margin is **≈5 vw, capped at 72**: 20 at 375, 44 at 768, 72 at 1024 and 1440. on12half
  is 0.29–0.47. No sideways scroll at any width.
- **Hero:** stepped lines indented at ≈1.7 and ≈3.3 of 12 (the earlier estimate was close), plus a tagline hanging off
  the end of the last line.
- **Projects:**
  - The giant names are **broken mid-word across two lines** (DREA/LABS, IMPAC/T2024…).
  - A portrait card (504 wide, ≈4.2/12) sits **ON TOP of the word, hiding letters** (z-order, not clipping). It
    alternates between ≈5.4–9.6 and ≈2.3–6.5 of 12.
  - The description sits on the far side and **breaks the page margin**: it reaches x 1383 on the right (past 1356) and
    starts at x 45 on the left (inside the 72 margin).
- **Missed sections:**
  - Section headers repeat one pattern: label + a **partial rule** (to ≈8.2/12) + a link at the right edge.
  - The intro paragraph's text **fills grey → black on scroll**.
  - **SERVICES** alternates left- and right-ALIGNED two-line titles.
  - CONTACT and a footer (seen at 375 only; the 1440 capture still stops at Services).
- **Phone:**
  - **Yes, the type still clips.** Glyphs are cut at x 340, the content-box edge, so the 20 px margin is kept and the
    letters are lost.
  - The cards shrink to ≈35% wide and keep alternating. The descriptions drop below the word at full width.
  - The intro is fully justified with wide gaps.
  - The 375 hero frame was blank (the reveal never fired), so **the phone hero is still unseen**.
- The fixed chrome has no background, so content overprints the logo and the clock.
- **m3 is a project DETAIL page**, with the only real column structure on the site: a 3-point top row, then a 50 / 50
  split with the title and text on the left and a square image filling the right half to the margin.
- **New values:**
  - *A display word broken by syllable.*
  - *An image layered over type, hiding glyphs.*
  - *A text block that breaks the page margin.*
  - *Alternating alignment, not position, for stacked headings.*
  - *A partial-width rule beside a section label.*
  - *Clipping at the content box, not the viewport.*

### #33 Juliet — wearejuliet.com (below the fold rendered this time)
- **The earlier note mixed in an OLD version of the site from the Awwwards video.** The live page has **no dark
  sideways carousel** and **no 3-column footer**. The footer is ONE space-between row at 1440 and a **centred stack** on
  the phone.
- **The container:** `container` ×5, with **% padding (≈2%) and no max width**. Content is 1384 px wide at 1440; the
  gutters are 30 / 27 / 30 / 8. No CSS grid.
- **The index is not in the margin.** It sits **on the container edge** (x 30, and 8 on the phone, the same x as the
  image), and the **title is indented past it** by ≈60 px (≈0.5/12), or 32 px on the phone.
- **The images are inset to the container** (30 px each side), not full width (fullBleedMedia = 0).
- **Desktop scroll behaviour:**
  - **The title sticks while the image collapses on scroll** (the CFL image shrinks to a 35 px strip). This does not
    happen on the phone.
  - The page background **swaps light → black → light** with scroll.
  - The about text has a line-mask reveal, caught mid-reveal in 1440 s7.
- **Other details:**
  - "RECENT WORKS" is right-aligned to ≈11/12, with a tall vertical rule.
  - The meta row is space-between (tagline | services). **The services half is dropped on the phone.**
  - **Forced justification with wide gaps is used at 1440 too**, not only on the phone.
  - **The marquee text inside pills clips at every width.**
- **New values:**
  - *% padding with no max width.*
  - *The index on the edge, the title indented past it.*
  - *A sticky title over a collapsing image* (desktop only).
  - *A scroll-triggered page background swap.*
  - *A meta row whose right half is dropped on the phone.*
  - *A footer row that becomes a centred stack.*

### #35 Grid layout — Ceram Studio, ceram.studio/en/archives (NEW; tags Collections, Jobs, Directory)
- **The live site is gone. Discard every live number.**
  - At 1440 and 768 the domain is a parked "Directory Index" page (a centred list of 5 ad links). That is why it
    measures margin 440 at 1440 and 104 at 768, with no grids.
  - At 375 it redirects to an AliExpress product page. **The scrollW of 1430 and the `col-lg-30 / col-sm-60` classes
    belong to AliExpress**, not to Ceram.
  - At 1024 only YouTube player rules were found.
  - This entry therefore comes from the Awwwards media alone. m1, m2 and m3 are the same frame in three colour modes
    (white, cream, pale green).
- **The grid (measured on m1, 1492 px wide):**
  - **4 equal columns of 329 (3/12 each), gutter 25 (≈1.7%), outer margin 50 (≈3.4%)**.
  - The header logo sits on column 1's left edge and the burger ends on column 4's right edge. The nav links float over
    the right half and do not snap to the columns.
- **Placement:**
  - One card per cell, always 3/12, with **a deliberate empty cell in every row that moves diagonally**: row 1 fills
    columns 1, 2 and 4; row 2 fills columns 1, 3 and 4. A small "SCROLL" cue sits at the edge of one hole.
  - **The images in a row have mixed ratios:** 329 × 258 landscape beside 329 × 343 near-square. Tops align per row,
    while the captions (tag + year, e.g. "MENORAL (2021)", plus a two-line caption) and the bottoms are ragged.
  - Row 2 starts on one shared top line.
- **Layering:** a giant outlined word "ARCHIVES" sits BEHIND the cards, stretched exactly across the content width
  (margin to margin) and tinted to the colour mode. Nothing bleeds past the margins, and no column lines are drawn.
- **The colour modes change only the page tint and the watermark.** The grid stays the same.
- **Phone:** unknown, because the media does not show it and the site is dead.
- **Technique, from the picture:** an even 4-column grid with **explicit column placement per card** (the holes are
  left, not auto-filled), an image ratio set per card, and a background text layer sized to the grid's content width.
- **New values:**
  - *A diagonal empty cell* (the hole moves one column per row).
  - *Mixed image ratios in a row, top-aligned.*
  - *A grid-width watermark word behind the cells.*
  - *Colour modes that leave the grid untouched.*
  - **A research failure case:** a domain parked or redirected since the award. Live measurements must be discarded when
    the page is not the site.
- **For a teacher:** a "Past projects" or "Year groups" archive with 4 photo cards per row and one gap left on purpose,
  moving across, behind a huge faint "ARCHIVE" or school-name word. It reads as curated, not crammed. On a phone it
  would most likely stack to 1–2 columns and drop the gaps (the source does not show this).

### What v3 changes in the summary below
- **Grids that turned out to be real, not nominal:**
  - Punchline's bento is a real **12** (6|6 / 3|6|3).
  - Lallé has **three** rungs: 6 / 16 / 16-xl.
  - ECC's old design is a **24** (eighths + thirds).
  - Klimov keeps a **3-line % frame down to 768**.
- **Corrections to the phone behaviour noted earlier:**
  - The Street Art News rail is **not hidden**: it drops under the stream, capped at 700.
  - Thirdweb **reorders** (media first) and **stacks column by column**.
  - Punchline **swaps order** in the sticky-card section.
  - Aqua Dev's type **still clips**, at the content box.
- **Not confirmed live:** Juliet's carousel and 3-column footer, and Thirdweb's 3-column overlay with column rules. Both
  are image-only (the Juliet ones come from an older version of the site).
- **Still blind:**
  - ECC: the pop-up is in every shot.
  - Aqua Dev: the phone hero and the 1440 contact and footer.
  - Street Art News: the picks and browse grids.
  - Ceram: dead.
- **New axis values added by v3:**
  - balanced masonry and column-major phone stacking;
  - starts snapped, ends free;
  - an empty corridor holding a fixed overlay that shares the page grid;
  - a diagonal empty cell;
  - mixed aspects top-aligned in a row;
  - equal-height cards with flexible media;
  - an auto-fit track that collapses to empty;
  - `1fr` min-content blow-out;
  - a gap that steps per breakpoint or per list;
  - a 7 : 5 split;
  - a rail that drops under the main column at a max width;
  - sticky items in a column;
  - in-stream full-span rows;
  - several margin systems on one page;
  - a fluid root rem;
  - % padding with no max width;
  - a grid-width watermark.

## Across all 35 records

> Corrected after the v3 re-read (the section above): Punchline's bento is a real 12-column grid; Thirdweb has no
> Bootstrap columns at all; Street Art News drops its rail UNDER the stream on the phone rather than hiding it; Klimov runs
> on a 3-line % frame; Juliet and Aqua Dev are containers with no column grid (not "no structure"); Ceram's live domain is
> parked (image only).

**How the page is gridded** (35 records, 26 distinct live designs):
- **One page-wide grid (one system reused in every section)** — Arthur Simonini 6 / 4 / 3 · AC Visa 22 / 12 · Videinfra
  12 as halves · Grégory Lallé 16 / 6 (three layouts: an xl rung re-places items) · Eddie 24 / 18 / 12 / 2 · Hervé
  Baillargeon 14 / 7 · Normform/Prelumen 12 (kept, full-span on the phone) · Klimov's 3-line % frame · Erwin Hines 12
  (image) · Saint Louvent 12 (image) · Ceram 4 × 3/12 (image). Few are "12 everywhere".
- **A grid per section / component** — Punchline (a real 12 in the bento + ratio splits 4-7 / 7-4 / 7-5), Digivalet,
  Street Art News (36 grids), PP Fragment, Enlitia, Codrops, Weareheavy (12 header + 8 journal), Dobrynow / Bright
  (Bootstrap rows).
- **Containers, no column grid** — Thirdweb (flex, three different left edges), Juliet (% padding, no max width), Aqua Dev.
- **No grid at all** — Tim Brack, Café la Petite Reine, CarusiHR, Emotive Feels.

**Phone behaviour:** most stack to 1 column, but a clear minority KEEP A REDUCED GRID — 3 (Simonini), 2 regions on 6
(Lallé), 3 stats on 12 (AC Visa), 2 for tables / lists (PP Fragment, Bright, Digivalet strip). A sidebar may DROP UNDER
the main column (Street Art News) or be HIDDEN (Bright's work panel); decorative cells, a whole grid or the hero picture
are often hidden. Masonry stacks column by column (Thirdweb). Four sites break on the phone (Tim Brack overflows, Petite
Reine crams, Aqua Dev clips type, CarusiHR clips mid-animation) — what the builder must prevent.

**Half-column placement:** seen in the wild only twice (Saint Louvent 4.5 → 7.5; Hervé Baillargeon's 7 → 14 doubling does it
structurally, as does Lallé's 16). Most "off-grid" placement is free offset, staggers and staircases.

**Bleed:** full-bleed bands and marquee / carousel strips are everywhere; half-bleed to one edge (AC Visa, ECC, Saint
Louvent); OVERLAP into the neighbouring section (Eddie's video band, Emotive's illustration, Enlitia's card).

**Not seen at all:** `subgrid`; named grid lines (other than `grid-template-areas`).

**New axis values for the map** (beyond 01): non-12 page counts and ladders (6/4/3 · 22/12 · 16/6 · 24/18/12/2 · 14/7 · 5)
· ratio splits of 11 (4 : 7) · percentage-named columns · keep the tracks and force full span on the phone · hide a whole
grid / cell / sidebar at a rung · vertical stagger (per column, per block, per line) · deliberate empty cells · sticky
cells and independently scrolling panels · spans by position (`nth-child`) · a lone child takes the full span · a row gap
that grows when stacked · rules instead of gaps · grid lines published as decoration · content in the outer margin
(hanging index, rotated label, edge tabs) · sideways-scroll strips that keep their tracks · a non-monotonic count caused by
a fixed sibling track (→ container, not viewport) · an orientation breakpoint.

### Group 0 — what it shows
- None of the 4 sites uses a true page-wide 12-column grid: Bootstrap is nominal; real grids are 2 · 3 · 4 · 5 · 6 columns
  per section. No half-column placement. No subgrid, no named lines.
- Bleed is always a strip (marquee, carousel, ornament), never a picture popping out of a column.
- Phone: mostly 1 column; #6 keeps 3, #5 keeps 2 for some grids; media and sidebars are HIDDEN at the phone.
