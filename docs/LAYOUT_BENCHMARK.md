# Layout Benchmark — the page structures the builder is tested against

> **CLAUDE.md RULE Q:** the structures a layout sweep builds come from THIS catalogue, built through the UI,
> simple → medium → extremely complicated. A structure real sites use that the builder cannot build is a gap to
> record here and raise — never a case to skip.

- **Part 1** — the general catalogue: named whole-page layouts, section patterns and page types (researched
  2026-09-26 from web.dev, MDN, Nielsen Norman Group, Smashing Magazine, the Tailwind UI section taxonomy and
  school-website sources).
- **Part 2** — the real-site benchmark: **https://www.awwwards.com/**, every category with equal weight, plus similar
  showcases (SiteInspire, Godly, Land-book, Lapa Ninja, One Page Love, CSS Design Awards, Webflow/Framer
  showcases, real school sites). *Being studied — added when the study completes.*
- **Part 3** — coverage: which patterns the sweep builds today, which it cannot yet, and why.

## Notation

`P` page · `B1..Bn` bands top → bottom, full width · `ROW(n: shares)` one row of n columns, shares in % ·
`GRID(c×r)` c columns by r rows, `a:2×1` = cell a spans 2 cols × 1 row · `STACK[…]` vertical stack inside a
column · a column may hold a nested `ROW(…)`.
Components `{heading} {text} {button} {image} {card} {stat} {quote} {icon} {form} {logo} {nav} {map} {video}`.
Position `[sticky] [fixed] [float] [overlay]`. Breakpoints `T` tablet 768 · `M` phone 375. ★ = among the most common.

---

## Part 1 — General catalogue

Sources: web.dev/articles/one-line-layouts · developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook ·
nngroup.com/articles/f-shaped-pattern-reading-web-content · figma.com/resource-library/website-layout-ideas ·
toptal.com/designers/ui/web-layout-best-practices · vanseodesign.com/web-design/3-design-layouts ·
tailwindcss.com/plus/ui-blocks/marketing (taxonomy; category pages are behind a login, counts from search snippets) ·
smashingmagazine.com/2023/05/sticky-menus-ux-guidelines · setproduct.com/blog/bento-grid-layout-design-guide ·
finalsite.com (school homepage elements) · schoolwebmasters.com · elevationweb.org (school website examples).
Flowbite's block pages returned nothing usable.

### A) Whole-page layouts

| # | Pattern | Tree | T / M |
|---|---|---|---|
| A1 ★ | Single column / pancake | header `ROW(2: 30/70)` → one centred column `STACK[heading,text,image,text…]` → footer (sticky to bottom on short pages) | unchanged; nav → hamburger at M |
| A2 ★ | Sidebar right | header → `ROW(2: 70/30)` [main STACK \| aside STACK[card widgets] (maybe sticky)] → footer | T 65/35 or stack · M stack, aside after, sticky dropped |
| A3 ★ | Sidebar left | header → `ROW(2: 25/75)` [sidenav [sticky] \| main] | T 30/70 or drawer · M toggle/accordion above |
| A4 | Holy grail | header(3) → `ROW(3: 20/60/20)` → footer(3) (= `GRID(3×3)`) | T 25/75, right aside below · M one column: header, main, left, right, footer |
| A5 ★ | Card grid (auto-fit) | intro band → `GRID(3–4×n)` of `card(STACK[image,heading,text,button])` → pagination | T 2 cols · M 1 |
| A6 | Masonry | `GRID(3–4 cols)` uneven heights | T 2 · M 1–2 |
| A7 ★ | Bento | `GRID(4×3)`: a:2×2, b:2×1, c:1×1, d:1×1, e:2×1 or 4×1 | T 2 cols, anchor spans · M 1, anchor first |
| A8 ★ | Zig-zag | bands `ROW(2: 50/50 or 60/40)`, image/text alternating sides | T 2 or stack · **M image ALWAYS first** (mirrored bands reorder) |
| A9 ★ | Split screen | one 100vh band `ROW(2: 50/50)` [image full-bleed \| STACK[heading,text,form]]; 40/60, 33/67 | T 50/50 or stack · M stack, image → banner |
| A10 | Full-screen sections | bands at 100vh, bg image/video, centred STACK [overlay]; optional snap + [fixed] dot-nav | height → min-height; dot-nav hidden |
| A11 | Magazine | multi-row header → `GRID(12×2)`: lead a:8×2, b:4×1, c:4×1 → `ROW(3)` cards → `ROW(2: 67/33)` [list \| most-read aside] | T lead full then 2 · M 1, lead first |
| A12 | Asymmetric / broken grid | `ROW(2: 58/42)`, image overlapping next band [float], card overlapping image | T overlaps reduced · M removed, stacked |
| A13 | Z-pattern | `ROW(2)` [logo \| nav/button] → hero → `ROW(2)` [text \| button] | single column |
| A14 | F-pattern | wide top bar → `ROW(2: 70/30)` list STACK left | M 1 col |
| A15 | Media object | `ROW(2: auto/1fr)` [thumb \| STACK[heading,text]] repeated | M side by side smaller, or stack |
| A16 | Dashboard shell | `ROW(2: ~240px/1fr)` [sidebar [fixed/sticky] \| STACK[topbar [sticky] ROW(3), GRID(4×1) stat, GRID(12): chart 8 + list 4, table 12]] | T icon rail · M drawer / bottom tab bar [fixed], stats 2×2 → 1 |
| A17 | Grid wrapper / breakout | ~65ch column, some blocks break out full width | all full width |
| A18 | Side-scrolling | band `ROW(n)` overflowing with scroll-snap | M same + peek |

### B) Section patterns

**Headers** — B1 ★ navbar `ROW(3: 20/60/20)` [logo \| nav \| button] often [sticky] (T hamburger · M `ROW(2)`) ·
B2 logo left / links right `ROW(2: 25/75)` · B3 multi-row header: utility `ROW(2)` → main `ROW(2)` → optional sub-nav;
often only row 2 sticky, or hides on scroll down (M utility row folds into the drawer) · B4 announcement bar above
the header (school closures) · B5 mega menu `GRID(4×1)` of STACK[heading, links] + promo card (M accordion) ·
B6 transparent header [overlay] over the hero, solid once sticky.

**Heroes** — B7 ★ centred STACK [eyebrow, heading, text, `ROW(2)` buttons, image] (M buttons full width) ·
B8 ★ split `ROW(2: 50/50 | 60/40)` [copy \| image] (M stack) · B9 hero with form `ROW(2: 60/40)` [copy \| card+form] ·
B10 full-bleed image/video 70–100vh with STACK [overlay] · B11 hero slider · B12 hero + quick-link tiles `ROW(4–6)`
pulled up over the hero [float] (T 3×2 · M 2×3, overlap removed).

**Trust / content** — B13 ★ logo strip `ROW(5–6)` (T 3×2 · M 2×3) · B14 ★ feature grid `GRID(3×1 | 2×2 | 4×1 | 3×2)`
(T 2 · M 1) · B15 feature list + image `ROW(2)` [STACK[heading, GRID(2×3)] \| image] · B16 ★ stats `ROW(3–4)` stat, or
`ROW(2)` [image \| GRID(2×2) stat] (T/M 2×2) · B17 ★ testimonials: `GRID(3×1)` quote cards / single large / carousel /
masonry wall · B18 ★ pricing `ROW(2|3|4)` cards, middle featured, optional comparison table (T 2+1 or scroll · M 1) ·
B19 ★ FAQ: centred accordion / `ROW(2: 33/67)` / `GRID(2×n)` · B20 ★ CTA: centred band / `ROW(2: 67/33)` / image split ·
B21 team `GRID(4×n)` portrait cards (T 3–2 · M 2 → 1) · B22 blog list: `GRID(3)` / `ROW(2: 60/40)` featured + list /
`ROW(2: 70/30)` with sticky aside · B23 events list: STACK of `ROW(2: 15/85)` [date badge \| details] ·
B24 calendar `GRID(7×5–6)` (M → list) · B25 contact + map `ROW(2: 50/50)` · B26 newsletter `ROW(2: 60/40)` ·
B27 long text + image `ROW(2)` · B28 gallery `GRID(4×2)` a:2×2 · B29 tabs → panel `ROW(2)` ·
B30 ★ footer: `ROW(4–6)` [brand 30% \| link columns] → newsletter → bottom bar `ROW(2)` (T brand full then `GRID(3×n)` ·
M `GRID(2×n)`, bottom bar stacks) · B31 floating: back-to-top [fixed], chat bubble [fixed], cookie banner [fixed],
phone-only sticky CTA bar, sticky in-page sub-nav.

### C) Page types (ordered sections)

- **C1 landing** — B1[sticky] · B8 · B13 · B14(3) · A8 ×3 · B16 · B17 · B18(3) · B19 · B20 · B30
- **C2 school homepage** — B4 alert · B3 multi-row header (row 2 sticky) · B10/B11 hero + CTA · B12 quick-link tiles ·
  welcome `ROW(2: 40/60)` [portrait \| quote+text+button] · B16 stats · `ROW(2: 67/33)` [news cards \| events] ·
  B14 or A7 bento · B28 gallery · B17 · B13 accreditation logos · B20 admissions CTA · B25 · B30 + B31 phone "Apply" bar.
  M: quick links directly under the hero; news and events stack (events often first).
- **C3 about** — B1 · B7 · B27 · B16 · timeline (A8) · B14(3–4) · B21 · B20 · B30
- **C4 blog index** — B1 · B7 + filter row · B22 featured · A2 [`GRID(2×n)` cards \| sticky aside] · pagination · B26 · B30
- **C5 article** — B1[sticky] + progress bar [fixed] · header STACK · A17 body, optional `ROW(2: 75/25)` sticky TOC · share · author card · related `GRID(3)` · B30
- **C6 product / pricing** — B1 · B7 · B18 · comparison table · B13 · B17 · B19 · B20 · B30
- **C7 contact** — B1 · B7 · B25 · `GRID(3)` office cards · B19 · B30
- **C8 portfolio** — B1 · B7 · filter tabs · A6 or A5 · detail A10/A17 · B20 · B30
- **C9 events** — B1 · view toggle + filters · B24 (M → B23) or `ROW(2: 25/75)` · detail `ROW(2: 67/33)` [description \| sticky date card] · B30
- **C10 dashboard** — A16 · stats `GRID(4)` · `GRID(12)` chart 8 + activity 4 · table 12
- **C11 admissions** — B3 · B8 · steps `ROW(4)` · key dates B23 · fees table · B19 · B9 enquiry · B30
- **C12 staff directory** — B3 · search/filter row · B21 · B30

### Cross-cutting responsive rules to assert

1. Wrapping by width: 4 equal → 2 at T → 1 at M; 3 → 2 (or 3) → 1; 6 → 3 → 2.
2. Asymmetric shares (60/40, 67/33, 70/30, 25/75) stack at M; at T either keep the ratio or stack — test both.
3. Reordering at M: zig-zag image first; asides after main; hero form after copy; school quick links move up.
4. Hidden at M: nav links (hamburger), utility bar, dot-nav, sidebars → drawers, calendar grid → list, decorative overlaps.
5. Spanning cells: 2×2 → 2×1 at T → 1×1 at M; the anchor keeps first position.
6. Sticky/fixed: header sticky at every size but compacted; a sticky sidebar drops to static when stacked; fixed CTA
   bars only at M; floating overlaps resolve to normal flow at M.
7. Height: 100vh → min-height at M; full-bleed media keeps its aspect ratio.

---

## Part 2 — Real-site benchmark (awwwards.com and similar)

*Being studied (2026-09-26). Every category with equal weight — e-commerce, corporate, agencies, portfolio,
architecture, fashion, food, real estate, technology, culture & education and the rest — and every page type.*

---

## Part 3 — Coverage

| Tier | Built by the sweep today (through the UI) | Source pattern |
|---|---|---|
| Simple | 2/3/4 equal columns in one band; stack beside card | B14, B13, B16 |
| Medium | uneven 3 columns; a row inside a stack; two bands; mixed components | A2-like, B22, B16 |
| Complicated | row in a row; row in a grid cell; 6-deep nesting; 5 mixed that wrap | A11, A7 |
| Page | Landing (P1), Blog (P2: content column of 3 beside a sidebar of 2), Magazine (P3: nested rows + 2×2 grid with content), Stress (P4) | C1, C4/A2, A11, — |

**Not yet exercised** (next): holy grail A4, bento spans A7, zig-zag reorder at M (A8), sticky sidebar in a row (A2),
dashboard shell A16, multi-row sticky header B3, overlap/float patterns A12/B12, footer 5–6 columns B30, school
homepage C2 end to end.
