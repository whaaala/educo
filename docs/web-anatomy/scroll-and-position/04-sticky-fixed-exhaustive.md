# Sticky and fixed — every use, every mechanic, every trap (exhaustive pass)

Asked by the user on 2026-10-02: *"do a lot of excessive research on sticky position… for any situation, anything on a
website, and also fixed position on any component, anything on a website."* This file **extends**
[01-codepen-sticky-fixed.md](01-codepen-sticky-fixed.md) (22 techniques, gaps **SP-1…SP-14**, CHECK 1–15) and
[motion-effects.md §8](../motion-effects.md) (scroll-driven + sticky patterns A–E). It does not repeat them: where a
point is already there it is referenced by its id. New gaps are **SF-1…SF-21** (sticky/fixed exhaustive).
Captured 2026-10-02. Builder checked against the working tree on branch `builder/layout-uat` (uncommitted edits
included), by reading the code — no build, test or browser was run for this pass.

## What is new compared with 01 / motion-effects §8

1. **Measured frequency from our own crawl** (`docs/layout-benchmark/pages.tsv`, 4,250 pages, 490 sites): headers
   `fixed` on **694 pages (16.3%)**, `sticky` on **220 (5.2%)**, sticky sidebars on **171 (4.0%)**; 1,922 of 21,719
   sections (8.8%) hold something sticky; listed components: dialog on 714 pages, cookie banner 291, back-to-top 133,
   table 44. Of the fixed headers, **476 are transparent** (over the hero). A header that turns fixed only after
   scrolling reads `relative` in the crawl, so fixed/sticky headers are an **under-count**.
2. **Bottom bars are owed scroll padding too** (WCAG 2.4.11's own sticky-footer example, F110) — the engine says they
   are not (SF-1), and a fixed bottom bar hides the end of the page (SF-2).
3. **Print** repeats fixed boxes on every printed page (spec + MDN); the export's print CSS does nothing about held
   blocks (SF-3).
4. **WCAG 1.4.10 technique C34** un-fixes bars by available **height**, which the per-width rungs cannot express (SF-4);
   no audit measures how much of the screen held bars take (SF-5).
5. **Containing-block list re-verified on MDN (2026):** `transform`, `translate`, `scale`, `rotate`, `perspective`,
   `filter`, `backdrop-filter`, `contain: layout|paint|strict|content`, `content-visibility: auto`, and `will-change`
   naming any of these. **`container-type` no longer does** (CSSWG resolution, Chrome 129) — matching the repo's #144.
   The builder emits `transform` and `filter` from hover and entrance effects that `capturesFixed` does not count (SF-8),
   and two code comments still say `container-type` captures (SF-9).
6. **Sticky siblings always queue**, so the very common **stacking cards** effect cannot be built (SF-7). The
   **two-tier header with only row 2 sticky** needs a negative offset the Inspector forbids (SF-15).
7. **Support as of today:** `scroll-state()` queries are Chromium-only but **include Chrome Android 154+ and Samsung
   Internet 29+** (caniuse 71.7% global), which covers most of the people RULE AF builds for. That changes the weight of
   SP-2 and SP-3 (see "Re-weighing"). `scroll-state(scrolled:)` arrived in Chrome 144. **Anchor positioning is
   Baseline** (Chrome 125, Safari 26, Firefox 147, January 2026).
8. **iOS 26 Safari:** `theme-color` dropped; the toolbar tint is sampled from fixed/sticky boxes near the viewport edge
   (WebKit bug 301756); fixed content is not drawn below the floating bottom bar (Apple forums 800798) (SF-12).
9. **Opera Mini (extreme mode)** supports neither `fixed` nor `sticky` (caniuse) — it is still used in Nigeria and Ghana
   (SF-11).
10. **The top layer** (`<dialog>.showModal()`, `popover`, fullscreen, the customisable `<select>` picker) sits above every
    `z-index` and is never captured by a transformed ancestor — the right home for overlays (SF-18).

## Sources and completeness

| # | Source | Status | Notes |
|---|---|---|---|
| 1 | MDN `position` (https://developer.mozilla.org/en-US/docs/Web/CSS/position) | READ | sticky/fixed definitions, containing block exceptions, print, a11y (zoom, repaint), "See also" links |
| 2 | MDN Containing block | READ | the full capture list (absolute + fixed), browser note on `perspective`/`filter` |
| 3 | MDN Stacking context | READ | all 12 conditions incl. `container-type: size/inline-size`, top layer, `fill-mode: forwards` |
| 4 | MDN Top layer (glossary) | READ | dialog, popover, fullscreen, customisable select picker; `::backdrop` |
| 5 | MDN `scroll-padding` | READ | anchors, `scrollIntoView`, focus scrolling, snap; vs `scroll-margin`; Baseline 2021 |
| 6 | MDN Container scroll-state queries | READ | `stuck`, `scrolled`, `scrollable`, `snapped` + examples (back-to-top, directional bars) |
| 7 | MDN VisualViewport | READ | layout vs visual viewport, pinch zoom, keyboard, hide-bar-at-scale example |
| 8 | MDN `env()` | READ | safe-area, safe-area-max, keyboard-inset, titlebar, viewport segments |
| 9 | MDN `overflow` | READ | `clip` vs `hidden` (scroll container, focus, BFC), two-value rule |
| 10 | MDN viewport `<meta>` | READ | `viewport-fit`, `interactive-widget`, zoom warning |
| 11 | MDN viewport units | NOT READ directly | covered by web.dev (#14) which is the fuller text; the MDN length page was not opened |
| 12 | CSS Positioned Layout 3 (https://drafts.csswg.org/css-position-3/) | READ (sticky + fixed sections) | sticky view rectangle, both insets, box taller than scrollport, fixed = layout viewport (dynamic size), paged media replicates fixed |
| 13 | developer.chrome.com — scroll-state queries | READ | + its links: spec, explainer, Ahmad Shadeed, utilitybend — **links NOT READ** (the MDN page #6 and Una #16 covered the content) |
| 14 | web.dev — viewport units | READ | l/s/d units, throttled `dvh`, keyboard not counted |
| 15 | developer.chrome.com — viewport resize behaviour (`interactive-widget`) | READ | Chrome 108 default change; demo + explainer links NOT READ (same content) |
| 16 | una.im — `scroll-state(scrolled)` | READ | hide-on-scroll header, Chrome 144 |
| 17 | developer.chrome.com — anchor positioning API | READ | requirements, `position-visibility`, fallbacks |
| 18 | caniuse — `css-sticky`, `css-fixed`, `wf-container-scroll-state-queries` | READ | Opera Mini none for both; UC 15.5 ok; KaiOS 3 ok |
| 19 | CSS-Tricks — Dealing with overflow and position: sticky | READ | restructure + JS scroll sync (no `clip`) |
| 20 | CSS-Tricks — Position sticky and table headers | READ (+ comments) | sticky `th`, multi-row, border-collapse trap, wrapper overflow |
| 21 | CSS-Tricks — position: sticky (2016) | READ | progressive-enhancement framing only; dated |
| 22 | Polypane — Getting stuck: all the ways position: sticky can fail | READ | six failure modes |
| 23 | Smashing — Sticky menus UX guidelines (2023) | READ | five-item limit, keyboard 60%, partially persistent, alternatives |
| 24 | Nielsen Norman Group — Sticky headers | READ | five guidelines, 300–400 ms |
| 25 | NN/g — Back-to-top | READ | 4-screen rule, lower right, label |
| 26 | WCAG 2.2 Understanding 2.4.11 | READ | sticky footer + cookie banner examples, C43, F110 |
| 27 | WCAG 2.2 Understanding 1.4.10 | READ | fixed regions at zoom, C34 |
| 28 | WCAG technique C34 / failure F110 | READ | |
| 29 | **Baymard** (sticky add-to-cart, sticky filters) | **NOT READ** | the article page returned only a paywall headline; Baymard's findings are behind Premium. Numbers found by search are from **third-party A/B blogs** (easyappsecom, cleancommit, blendcommerce), not Baymard — quoted below as such, unverified |
| 30 | WebKit bug 301756 + benfrain.com (iOS 26 tint) + Apple forums 800798 | READ | |
| 31 | CSSWG issue #865 (sticky in overflow parents), mailing-list copy | READ (one message) | no resolution; the GitHub thread itself NOT READ |
| 32 | CSSWG — container-type no longer forces layout containment | READ via search summary + dev.to note (Chrome 129) | the issue thread itself NOT READ |
| 33 | scroll-driven-animations.style — stacking cards | READ | CSS version |
| 34 | Mozilla bug 1732817 (backdrop-filter scroll jank on low-end Android) | search summary only — NOT opened | |
| 35 | Opera forums on Opera Mini CSS | search summary only | Presto/Opera 12-class CSS in extreme mode |

**Real-site examples** below marked *(measured)* were measured live before (petro.design in 01); the others are
well-known instances of the pattern named from experience, **not measured in this pass** — they are pointers for the
dressed sweep, not evidence.

---

## 1 · The use catalogue

Columns: **Uses** — sticky (S) / fixed (F) / top layer (T). **Freq** — crawl count where we have one, else H/M/L from the
sources. **Builder** — HAVE / PARTIAL / GAP with the reason (code refs in §3).

| # | Use | Example | Uses | Minimal CSS / JS | Phone behaviour | Accessibility | Freq | Builder |
|---|---|---|---|---|---|---|---|---|
| U1 | Plain page header | MDN, most school sites | S (or F) | `header{position:sticky;top:0;z-index:…;background:…}` | keep ≤ 56px; consider un-pin by height (SF-4) | anchor + focus offset (SP-1); opaque (NN/g) | header fixed 16.3%, sticky 5.2% | HAVE (`pin:"top"`) |
| U2 | Shrinking header | Apple local nav, many agencies | S + scroll timeline | motion-effects §8 B; `pinArrival:"condense"` | must not shift content under the reader (CHECK 3) | quick, not "stalker" (NN/g) | M | HAVE (condense) |
| U3 | Hide on scroll down, show on scroll up | Medium, CB2 (Smashing) | S/F + JS or `scroll-state(scrolled:)` | Una: `@container scroll-state(scrolled: bottom){translate:0 -100%}` on `html{container-type:scroll-state}` | reclaims ~10% of 360×640 | must show on focus-within; 300–400 ms; reduced motion snaps | M | GAP **SP-2** |
| U4 | Transparent → solid header | 476 crawl pages (fixed/sticky + transparent) | F/S + scroll timeline or `stuck` | `pinArrival:"solid"`; or `@container scroll-state(stuck: top)` | iOS 26 samples its toolbar tint from it (SF-12) | contrast must hold in BOTH states over the photo | **H** | HAVE (timed from page top — **SP-3**) |
| U5 | Two-tier header, only row 2 sticky | school homepages (benchmark C2/B3), BBC | S with **negative top** | `header{position:sticky;top:calc(-1 * var(--utility-h))}` | utility row scrolls away | one landmark kept | M | GAP **SF-15** |
| U6 | Sticky section sub-nav / tab bar under the header | Apple product pages, Wikipedia sticky header | S stacked under S | second bar's `top` = first bar's height | ≤ 5 items or overflow menu (Smashing) | `aria-current` on the active tab | M | HAVE (`--eu-pin-above` stacking) |
| U7 | In-page TOC / scroll-spy rail | MDN, Stripe docs, GOV.UK guides | S in a row | `aside{position:sticky;top:…;align-self:start;max-height:calc(100dvh - top);overflow:auto}` | drops to static/accordion above content | real links, `aria-current`; rail scrollable by keyboard | sticky sidebar 4.0% | PARTIAL — rail holds (clause 3/3b); long rail **SP-8**; scroll-spy **SP-12** |
| U8 | Sticky sidebar / filter panel | blogs, shops | S in a row | as U7 | phone: filter becomes a sticky "Filter & sort" bar or drawer | — | 4.0% | HAVE |
| U9 | Sticky product summary / buy box beside long details | shops, course pages, event detail (benchmark C9 "sticky date card") | S in a row | as U7 | becomes U10 on phones | — | M | HAVE |
| U10 | Mobile sticky CTA / bottom action bar ("Apply now", "Call the school", "Add to cart") | Jumia, most shops | S bottom or F bottom | `position:fixed;inset-inline:0;bottom:0;padding-bottom:calc(1rem + env(safe-area-inset-bottom))` | keyboard (SP-14), safe area (SP-14), end of page hidden (SF-2) | focus scroll offset at bottom (SF-1) | third-party A/B: ~50% of shops; +7.9% conversion (unverified, not Baymard) | PARTIAL — `pin:"bottom"` holds; SF-1, SF-2, SP-14 open |
| U11 | Mobile bottom tab bar (app-like) | Instagram web, dashboards (benchmark A16) | F bottom | `nav{position:fixed;bottom:0;…}` + body padding | ≤ 5 items; safe area | `nav` landmark, `aria-current` | L on sites, H in apps | GAP **SF-21** (component) |
| U12 | Sticky table header row / first column / both | fees, timetables | S on `th` | `thead th{position:sticky;top:0}` · `th[scope=row]{position:sticky;left:0}` · corner z-index · `border-collapse:separate` | scroll wrapper is the scroller; header sticks to the wrapper, not the page | wrapper `tabindex=0`, `role=region`, label | table on 44 pages | GAP **SP-6** |
| U13 | Sticky list group headings (A–Z, months of events) | iOS Contacts, MDN example | S per group | each heading sticky inside its own group block → they hand over | — | headings stay real `h2/h3` | L | HAVE (each group a Stack → separate holders hand over, measured in 2e) |
| U14 | Sticky footer (A) — footer at the bottom of a short page | every site template | layout, not position | `body{min-height:100svh;display:flex;flex-direction:column} main{flex:1}` | — | — | H (benchmark A1) | GAP **SF-14** |
| U15 | Sticky footer (B) — bar held at the bottom | cookie bars, app footers | S/F bottom | `position:sticky;bottom:0` | as U10 | F110 | M | PARTIAL (as U10) |
| U16 | Sticky form submit bar | long admission forms | S bottom inside the form | `.actions{position:sticky;bottom:0}` | hide while typing (SF-16) — keyboard takes up to 60% (Smashing) | must not cover the focused field | L | LATER (Form component) |
| U17 | Stacking cards / stacking sections | agency sites, Apple, many Framer sites | S siblings, same top, overlap | each card sticky `top:1rem`; optional `view()` scale (scroll-driven-animations.style) | fine | reduced motion: no scale | M (in 8.8% of sections with sticky) | GAP **SF-7** |
| U18 | Pinned scrollytelling scene | news features, product launches | S pane in a tall parent | parent `height:calc(var(--steps) * 100svh)`; pane `position:sticky;top:0;height:100svh` | `svh`, not `vh` | content readable without the animation | L | PARTIAL — sticky full-screen pane buildable (`screenHeight`, `combineMinHeight` uses `svh`); step timeline is MOTION §8 |
| U19 | Sticky media beside scrolling text | portfolios, case studies | S in a row | as U7 with an image | stacks on phones | alt text | M | HAVE |
| U20 | Reading-progress bar | articles (benchmark C5) | F/S + `scroll(root)` | motion-effects §8 A | — | `aria-hidden`, decorative | L | PARTIAL (a pinned bar can hold it; no progress block) |
| U21 | Announcement / alert banner above the header | school closures | S top, stacked | first bar in the top stack | dismissible | `role=status`/`region`, not obscuring focus | M | HAVE (stacking + Alert banner form) |
| U22 | Back-to-top button | 133 crawl pages; GOV.UK | F corner | `position:fixed;inset-block-end:1rem;inset-inline-end:1rem` | appear after ~4 screens (NN/g) — `scroll-state(scrollable: top)` | labelled "Back to top" | 3.1% | PARTIAL — fixed corner HAVE; show-when-useful **SF-17** |
| U23 | Chat / WhatsApp widget | very common in Africa (WhatsApp click-to-chat) | F corner | as U22 | must clear the bottom bar and safe area | keyboard reachable, not covering focus | H in region (not crawled) | HAVE (fixed corner); collision with bottom bar = CHECK 10 |
| U24 | Cookie / consent banner | 291 crawl pages | F bottom (better: top layer) | `<div popover=manual>` or fixed bottom | short; safe area | must not obscure focus (2.4.11 example) — SF-1 | 6.8% | PARTIAL (a fixed bar); top-layer form **SF-18** |
| U25 | Toasts / snackbars | Material, Gmail | F corner | `alertToastCss` | width `min(24rem, 100% - 2rem)` | `role=status` | M | HAVE (Alert toast, logical insets) |
| U26 | Floating action button (FAB) | Gmail mobile web | F corner | as U22 | above bottom bar | label | L | HAVE (fixed corner button) |
| U27 | Modal / dialog + backdrop | 714 crawl pages | **T** | `<dialog>` + `showModal()`; `::backdrop` | `dvh`, scroll lock, `overscroll-behavior:contain` | focus trap is native; Escape | 16.8% | GAP **SP-13** (+ SF-18) |
| U28 | Off-canvas drawer / fullscreen menu overlay | almost every mobile nav | T or F | `popover` / `dialog`, or fixed + `inert` page | `dvh`; scroll lock | `aria-expanded`, Escape, focus return | **H** | GAP **SP-12** (+ SF-18) |
| U29 | Fixed background / parallax layer | Framer/Webflow heroes | F layer or `background-attachment:fixed` | `bgAttach:"fixed"` | ignored on iOS; janks on low-end GPUs | reduced motion | M | PARTIAL **SP-11**, scenes **SP-10** |
| U30 | Fixed video background | agency heroes | F + `<video muted playsinline>` | data-heavy on 3G (RULE AF) | pause control (WCAG 2.2.2) | L | GAP (no video background; out of scope here) |
| U31 | Fixed side dot navigation (full-screen sections) | benchmark A10 | F right rail | `position:fixed;inset-inline-end:1rem;top:50%;translate:0 -50%` | hidden on phones | links with labels | L | PARTIAL — fixed right rail HAVE (clause 5b stretches it full height unless a height is set); dots + scroll-spy = SP-12 |
| U32 | Fixed social / share rail | news, blogs | F left/right | as U31 | moves to a bottom bar or inline | — | L | HAVE |
| U33 | Custom cursor | petro.design *(measured)* | F + `mix-blend-mode` | 16px dot following pointer | none on touch | must not hide the real pointer | L | out of scope (01 §3: LATER at most) |
| U34 | Preloader | award sites | F full-screen | removed on `load` | **harmful on 3G** — hides content that already arrived | must not trap focus | L on schools | not to build (RULE AF) |
| U35 | Page-transition overlay | award sites | F full-screen or View Transitions | `@view-transition{navigation:auto}` replaces it | — | reduced motion | L | outside sticky/fixed — see motion-effects |
| U36 | Fixed watermark / frame borders | portfolios | F, `pointer-events:none` | four fixed edges | eats screen on phones | decorative `aria-hidden` | L | HAVE (fixed blocks) |
| U37 | Sticky/fixed in print | any page printed (term dates!) | — | `@media print{… position:static}` | — | — | every printed page | GAP **SF-3** |
| U38 | Sticky/fixed in email | newsletters | — | **not supported** by email clients: lay out in flow | — | — | — | not applicable (no email export) |

## 2 · Mechanics and traps

Each is verified against MDN/spec (source number in brackets). "Builder" says what the engine does about it.

### 2.1 Fixed: the containing block [1, 2, 12]
- Fixed boxes are measured against the **layout viewport** (spec: its size matches the *dynamic* viewport), so they do
  not move when the document scrolls. In paged media they are measured against **each page's page area — so they
  repeat on every printed page** [12, 1].
- **An ancestor captures them** (becomes their containing block, so they scroll with it) when it has `transform`,
  `translate`, `scale`, `rotate`, `perspective`, `filter`, `backdrop-filter`, `contain: layout|paint|strict|content`,
  `content-visibility: auto`, or `will-change` naming one of those [2]. MDN warns of browser inconsistencies for
  `perspective` and `filter` [2].
- **Not `container-type`** any more: the CSSWG resolved that it forces an independent formatting context, not layout
  containment (shipped Chrome 129) [32]. It does still create a **stacking context** (`size`/`inline-size`) [3].
- **MDN's own performance advice is a trap:** it suggests `will-change: transform` on fixed/sticky boxes to cut
  repaint [1] — but that makes the bar the containing block of every fixed descendant (a dropdown, a toast inside it).
  The builder emits no `will-change` — keep it that way.
- Builder: `capturesFixed` counts `rotate` and the `glass` variant only (`box-model.ts:6406-6413`). It misses the
  builder's own hover effects and entrance effects (SF-8).

### 2.2 Sticky: the scrollport and the constraint rectangle [1, 12, 22]
- Insets are measured from the **scrollport of the nearest scroll container with a matching scrollable axis** — the
  *sticky view rectangle* [12]. It sticks to the nearest ancestor with a scrolling *mechanism* (`overflow` `hidden`,
  `scroll`, `auto`, `overlay`) **even if that ancestor never actually scrolls** [1, 18].
- **At least one inset must be non-`auto`** on the axis, or sticky behaves as `relative` [1].
- It moves **only within its containing block** (its parent): a parent no taller than the sticky box gives it no
  travel [22]. In flex/grid the default `align-items: stretch` makes the child as tall as the line → zero travel; fix with
  `align-self: start` [22]. Builder: clause 3 writes `align-self:flex-start` (`box-model.ts:6085-6086`) — HAVE.
- **Both `top` and `bottom` set:** when the rectangle gets smaller than the box, the end inset is reduced (can go
  negative) so the rectangle is at least the box's size [12]. A **sticky box taller than the scrollport** therefore
  scrolls through instead of holding (spec example: 200px box, 100px scrollport, `top:20px` → bottom inset −120px)
  [12]. Polypane's fix for a tall sticky rail: `max-height` + `overflow-y:auto` [22] = **SP-8**.
- **`overflow-x: hidden` on both `html` and `body`** kills every sticky element on the page [31]; `overflow: clip` clips
  without making a scroll container [9]. Builder: `SITE_CHROME_CSS` writes `hidden` with an `@supports
  (overflow-x:clip)` upgrade to `clip` (`box-export.ts:864-866`) — HAVE. Inside the page, clip/radius still writes
  `overflow:hidden` (`box-export.ts:393`) — **SP-4**, still current.
- `overflow: clip` side effects [9]: no programmatic scroll, and **focusable content clipped by it cannot be scrolled into
  view by Tab** — fine for decoration, a trap if something focusable is clipped. And in the two-value form, `clip`
  behaves as `hidden` when the other axis is not `visible`/`clip` [9].
- **Tables:** `th` can be sticky; old engines could not stick `thead`/`tr` (Chromium TablesNG and Firefox can); with
  `border-collapse: collapse` the borders do not travel with the sticky cell — use `separate` + `border-spacing:0` [20].
  An `overflow-x:auto` wrapper (needed for sideways scroll on a phone) becomes the scroller, so the header sticks to the
  wrapper's top, not the page's [19, 20]. → **SP-6**.

### 2.3 Stacking, z-index and the top layer [3, 4]
- `position: fixed` and `sticky` **always** create a stacking context [1, 3]: a dropdown inside a sticky header can
  never rise above something outside the header with a higher z. Other context makers the builder emits: `opacity<1`,
  `isolation:isolate` (paint layers), transforms, filters, `backdrop-filter`, `container-type` [3].
- An animation with `fill-mode: forwards` that animated a context-making property keeps the context afterwards [3].
- **The top layer** (modal `<dialog>`, `popover`, fullscreen, customisable `<select>` picker) paints above every
  stacking context regardless of `z-index`, and its boxes use the initial containing block [4, 12] — so it also
  escapes a transformed ancestor. This is the robust home for menus, cookie banners and modals (SF-18).
- Builder: `PAGE_Z` tiers (`lib/educo-ui/stacking.ts:34`), ceiling 998, `pagePinCover` lifts a page bar one step
  (`box-model.ts:4809`) — HAVE.

### 2.4 Viewport units and mobile toolbars [14, 12]
- `lvh` (toolbars retracted), `svh` (expanded), `dvh` (actual, clamped between them). Supported Chrome 108, Firefox 101,
  Safari 15.4 [14]. `dvh` updates are **throttled**, not 60 fps [14]. **The on-screen keyboard does not change any
  viewport unit** [14]. No viewport unit counts the scrollbar [14].
- Builder: full-screen sections use `svh` (`combineMinHeight`, `box-model.ts:5621-5622`); a sticky sidebar uses
  `calc(100dvh - offset)` (`box-model.ts:6122`). Both are the right choices.

### 2.5 The on-screen keyboard [15, 7, 8, 10]
- Since **Chrome 108 on Android the default is `resizes-visual`**: only the visual viewport shrinks, so a fixed bottom bar
  stays at the layout-viewport bottom — **behind the keyboard, not over the field** [15]. `resizes-content` (the old
  default) shrinks both, so the bar rides up above the keyboard and can cover the focused field. `overlays-content`
  resizes nothing (pair with `env(keyboard-inset-*)` via the VirtualKeyboard API) [15, 8].
- So the default is safer than 01/SP-14 implied; the remaining risk is a bar that **does** ride up (iOS, or someone
  setting `resizes-content`), and the header + bottom bar + keyboard leaving almost no room (Smashing: keyboard up to
  60%) — SF-16.

### 2.6 Safe areas and notched phones [8, 10, 30]
- `env(safe-area-inset-*)` is 0 unless the page opts in with `viewport-fit=cover` [10, 8]. Pattern:
  `padding-bottom: calc(1rem + env(safe-area-inset-bottom))` [8].
- **iOS 26 Safari:** fixed content is **not drawn below** the floating bottom toolbar [30]; and the toolbar "forehead"
  and "chin" colours are taken from fixed/sticky boxes near the viewport edges ("solid background colour extension"),
  `theme-color` no longer used [30]. A transparent or glass bar gives a mismatched tint. → **SP-14** + SF-12.
- Builder: viewport meta is `width=device-width, initial-scale=1` (`box-export.ts:903`) — no `viewport-fit` (SP-14).

### 2.7 Pinch zoom and the visual viewport [7]
- Pinch zoom shrinks the **visual** viewport; fixed boxes stay on the **layout** viewport, so when zoomed in they can sit
  off-screen or cover a large share of what is visible. MDN's example hides a bottom bar when
  `visualViewport.scale > 1.3` [7]. → SF-20 (LATER).

### 2.8 Zoom, reflow and focus [26, 27, 28]
- **1.4.10 Reflow:** at 320 CSS px wide (400% zoom on 1280) fixed regions "significantly reduce available space";
  technique **C34** un-fixes them with `@media (min-height: 480px){header{position:sticky}}` — by **height** [27, 28].
- **2.4.11 Focus Not Obscured (AA):** a focused control must not be *entirely* hidden by author content; the
  sticky-**footer** example is solved with scroll padding, the cookie-banner example fails unless it is modal or padded
  [26]. **F110:** tab forward and backward; any focused item completely hidden by a sticky header/footer fails [28].
  2.4.12 (AAA) asks for no overlap at all.
- **Text zoom:** MDN — absolutely/fixed positioned boxes must not obscure content when text is enlarged [1].

### 2.9 Anchors and focus scrolling [5]
- `scroll-padding` on the scroll container (the root for the page) shifts the *optimal viewing region* used by fragment
  navigation, `scrollIntoView`, focus scrolling and snap; `scroll-margin` does the same per target [5]. Baseline 2021.
- Builder: `pinStackPass` sets `scroll-padding-top` = the **fixed** top stack (`box-model.ts:5868-5874`); sticky
  excluded (SP-1); **bottom never** — "a bottom stack covers the end of the page, where nothing is scrolled TO"
  (`box-model.ts:5858-5859`). That reasoning holds for fragment links but **not for focus**: tabbing forward scrolls each
  newly focused control to the *bottom* edge, under a fixed bottom bar (F110's sticky-footer case) → SF-1.

### 2.10 Print [1, 12]
- Fixed boxes print at the same spot on **every page** [1, 12]: a fixed header covers the top of every printed page, a
  chat bubble and back-to-top print on every page. Sticky boxes print where they sit in the flow.
- Builder: the print block (`lib/educo-ui/base.ts:133-138`) handles colours, breaks and link URLs, nothing about held
  blocks → SF-3.

### 2.11 Right-to-left
- Physical `left`/`right` do not mirror in `dir="rtl"`; logical `inset-inline-start/end` do. Builder: `pinCSS` writes
  physical edges (`box-model.ts:6062-6063`); the toast already uses logical insets (`box-model.ts:1950-1953`) → SF-10.

### 2.12 Detecting "stuck" [6, 13, 16, 18]
- **CSS:** `container-type: scroll-state` on the sticky box; its **descendants** query `@container scroll-state(stuck:
  top)` (the container cannot style itself) [6, 13]. Chrome/Edge 133+, **Chrome Android 154+, Samsung Internet 29+**,
  no Safari/Firefox — 71.7% [18]. `scrolled:` (last direction) Chrome 144 [16]; `scrollable: top` drives a back-to-top
  with zero JS [6]. Unsupported browsers ignore the block → safe progressive enhancement.
- **JS fallback:** an IntersectionObserver on a 1px sentinel placed just above the sticky box (`rootMargin` = minus the
  top inset); when it leaves, the box is stuck. A few lines, passive.
- Builder: arrival uses `scroll()` from the page top (`box-model.ts:6325-6334`) — **SP-3**.

### 2.13 Anchor positioning [17]
- `anchor-name` / `position-anchor` / `position-area` / `@position-try` / `position-visibility: anchors-visible`.
  Needs the positioned box to be `absolute` or `fixed`. Baseline January 2026 (Chrome 125, Safari 26, Firefox 147).
- Uses here: a dropdown or mega-menu hanging under a sticky nav item, a tooltip on a fixed button — without measuring
  in JS, and flipping when there is no room. Not a replacement for the bars themselves → SF-19 (LATER, Navigation).

### 2.14 Performance on low-cost Android [1, 34]
- Every held box must be repainted/composited each scroll frame; heavy content in it can drop below 60 fps — MDN calls
  this an accessibility issue for people with motion sensitivity [1].
- `backdrop-filter` on a bar that is on screen for the whole scroll re-blurs what passes under it every frame; reports
  of jank on low-end Android (Moto G5 class) [34]. The `glass` arrival does exactly this → SF-13.
- `background-attachment: fixed` forces repaints on scroll and is ignored on iOS → **SP-11**.
- Scroll listeners: use `passive` + `requestAnimationFrame` (the builder's `pinStackScript` already uses rAF and no scroll
  listener at all — `box-model.ts:5886-5897`).

### 2.15 Old and proxy browsers [18, 35]
- **Opera Mini extreme** renders on the server with Presto-era CSS: **no `position: fixed`, no `sticky`** [18]. A fixed
  chat button or back-to-top falls into the flow **where it sits in the DOM**; a fixed header simply sits at the top.
  UC Browser 15.5 and KaiOS 3 support both [18]. → SF-11.

---

## 3 · HAVE / PARTIAL / GAP — engine check (read 2026-10-02)

| Area | Status | Where |
|---|---|---|
| Sticky with threshold, edges, offset | HAVE | `pinCSS` `box-model.ts:5994`; fields `pin`/`pinOffset`/`hold` `box-model.ts:398-415`; Inspector hold picker `BoxInspector.tsx:734-773` |
| Flex/grid stretch → no travel | HAVE | clause 3 `box-model.ts:6085-6086` |
| Sticky sidebar at screen height | HAVE | clause 3b `box-model.ts:6119-6124` (`100dvh`) |
| Fixed width / full-height rail | HAVE | clauses 5 / 5b `box-model.ts:6018-6040` |
| Several bars at one edge | HAVE (but always queues — SF-7) | `pinStackAttr` `box-model.ts:5719-5744`, `pinStackPass` `5783`, `pinStackNeeded` `5935` |
| Anchor offset for fixed top bars | HAVE | `box-model.ts:5868-5874` |
| …for sticky top bars / bottom bars | GAP | SP-1 / SF-1 |
| Body overflow not killing sticky | HAVE | `box-export.ts:864-866` (`clip` upgrade) |
| Clip/radius inside the page | GAP | SP-4, `box-export.ts:393` |
| Warn: clipped ancestor kills sticky | HAVE | `pinBlockedBy` `box-model.ts:6528` |
| Warn: ancestor captures fixed | PARTIAL | `capturesFixed` `box-model.ts:6406` — misses hover/entrance/filter (SF-8) |
| Page bar covers what scrolls under it | HAVE | `pagePinCover` `box-model.ts:4809` |
| Arrival looks (shadow/solid/glass/rule/condense) | HAVE (timing SP-3, glass cost SF-13) | `pinArrivalCss` `box-model.ts:6334` |
| Floated block held on screen | HAVE | `floatHoldCSS` `box-model.ts:6240` |
| Canvas simulation of fixed | HAVE (rationale out of date — SF-9) | `canvasFixedStyle` `box-model.ts:6175`, comment `6160-6166` |
| Toast in a corner | HAVE | `alertToastCss` `box-model.ts:1943` |
| Full-screen sections in `svh` | HAVE | `combineMinHeight` `box-model.ts:5621` |
| `background-attachment: fixed` | PARTIAL | `bgAttach` `box-model.ts:327, 1035, 1138` — SP-11 |
| Viewport meta / safe area / keyboard | GAP | `box-export.ts:903` — SP-14 |
| Print of held blocks | GAP | `base.ts:133` — SF-3 |
| Un-pin per width rung | HAVE | per-rung `pin` (phone off) `box-model.ts:2842` area |
| Un-pin per available height | GAP | SF-4 |
| Audit of held-bar share / focus obscured | GAP | `scripts/uat/page-audit.js:39` only *excludes* pinned blocks — SF-5, SF-6 |
| Negative offset (partial stick) | GAP | `pinOffset` Range min 0, `BoxInspector.tsx:796` — SF-15 |
| Logical (RTL) pin edges | GAP | SF-10 |
| Short-page footer at the bottom | GAP | no `min-height` on body/page, `box-export.ts:864-866` — SF-14 |
| `will-change` emitted | HAVE (none emitted — keep it) | grep: no `will-change` in `lib/box-*.ts` |
| Table / Navigation / Dialog / Form components | GAP | SP-6 / SP-12 / SP-13 / U16 |

## 4 · Re-weighing existing gaps (no new ids)

- **SP-2 hide-on-scroll** and **SP-3 arrival timed to stick:** `scroll-state()` runs on Chrome Android 154+ and Samsung
  Internet 29+ — most of the phones RULE AF targets. A CSS-only `stuck`/`scrolled` path with an unchanged fallback
  (Safari/Firefox see the resting bar) is now a real option for both, with an IntersectionObserver sentinel only if
  Safari parity is wanted.
- **SP-4:** still current at `box-export.ts:393`. Note the `clip` focus trap (§2.2): clipping is only safe where nothing
  focusable is cut off.
- **SP-14:** Chrome's default since 108 (`resizes-visual`) keeps a fixed bottom bar *behind* the keyboard — do **not**
  switch to `resizes-content` without SF-16. Add iOS 26 (bars not drawn below its bottom toolbar) to the CHECK.
- **SP-13:** prefer the top layer (`<dialog>`, `popover`) over fixed + z-index (SF-18).
- **CHECK 5 in 01** is now confirmed in code and promoted to SF-8.

## 5 · New gaps — SF list

| # | Plain line ("what a person would want") · why | Sort |
|---|---|---|
| SF-1 | **Tab never lands under a bottom bar** — "a fixed 'Apply now' bar, and I can still see the link I tabbed to". `pinStackPass` gives `scroll-padding-top` only and says the bottom is owed nothing (`box-model.ts:5859-5874`); WCAG 2.4.11's own sticky-footer example and F110 say it is. Set `scroll-padding-bottom` = fixed bottom stack from the same pass. | MUST |
| SF-2 | **The end of the page is not hidden by a fixed bottom bar** — "my footer's last links are not under the Call bar". A fixed bar reserves no space; pad the page end by the measured bottom stack (the bottom mirror of SP-9, and on phones the commoner case). | MUST |
| SF-3 | **Printing a page prints it once** — "I print Term Dates and the header is not on every sheet". Fixed boxes repeat per page and cover content; `@media print`: held blocks → `position: static`, fixed corner widgets (chat, back-to-top, toast, cookie) → `display: none`. | MUST |
| SF-4 | **Bars let go when the screen is short** — "on a phone turned sideways, or zoomed 400%, I can still read". Pins are per width rung only; WCAG C34 un-pins by height (`@media (min-height: …)`). Emit pins inside a height condition (default ≈ 30em) or offer a "short screens" rung. | MUST |
| SF-5 | **The audit measures how much screen held bars take** — total held height at 360×640, 640×360 and 1280×720/400% ≤ a budget (≈ 25–30%, NN/g + Smashing); a finding when over. `page-audit.js:39` only excludes pinned blocks. | MUST (audit line) |
| SF-6 | **Focus-not-obscured walk** — UAT line: on every page with a held bar, Tab forward and Shift+Tab back through every control at every rung (F110); none fully hidden; repeat with a bottom bar, a cookie banner and a chat bubble. | CHECK |
| SF-7 | **Stacking cards** — "each card stops under the last and the next slides over it". Sticky siblings in one holder always queue under each other (`pinStackAttr` `box-model.ts:5725-5744`), so overlap is impossible and tall cards are pushed off-screen. Needs a per-holder "queue / overlap" choice (overlap = same top, optional small step). | DECIDE |
| SF-8 | **Every effect that captures fixed is counted** — "I added a hover lift to the section and my chat button scrolled away". `capturesFixed` counts rotate + glass only (`box-model.ts:6406-6413`); the builder also emits `transform` (hover lift/grow/press, entrance rise/drop/slide/zoom — `lib/interactions.ts:44-48, 136-140`), `filter` (hover brighten, entrance sharpen — `:54, :141`), `backdrop-filter` on glass Accordion items (`lib/educo-ui/components.ts:436`), and anything typed in Advanced CSS. Count them (hover/entrance: warn, or write the effect on an inner wrapper). | MUST |
| SF-9 | **Code comments say `container-type` captures fixed** (`box-model.ts:5794, 6160-6166, 6471`) while `capturesFixed` and #144 say it does not (CSSWG, Chrome 129). Correct the comments; measure whether the canvas could now use real `fixed` instead of `canvasFixedStyle` (the frame may still capture for another reason, e.g. canvas zoom transform). | CHECK |
| SF-10 | **Left/right rails mirror in Arabic** — pins write physical `left`/`right` (`box-model.ts:6062-6063`); offer start/end (logical insets) so a `dir="rtl"` page mirrors, as the toast already does. | DECIDE |
| SF-11 | **Opera Mini** — UAT line: a page with a fixed header, a fixed chat button, a back-to-top and a bottom CTA opened in Opera Mini extreme (no fixed, no sticky): where does each land, is anything duplicated or in the middle of content? Fixed widgets should sit last in the DOM. | CHECK |
| SF-12 | **iOS 26 Safari** — UAT line: transparent/glass page header and a bottom bar on iOS 26: toolbar tint matches, bottom bar not cut by the floating toolbar, cookie banner/modal does not recolour the chrome wrongly. | CHECK |
| SF-13 | **Glass on cheap phones** — the `glass` arrival keeps `backdrop-filter` running for the whole scroll; measure frame rate on a Tecno/Infinix-class phone; if it janks, fall back to the solid look on coarse pointers / low-end. | DECIDE (+CHECK) |
| SF-14 | **Footer at the bottom of a short page** — "my Contact page's footer is not floating mid-screen". No `min-height` on the page body (`box-export.ts:864-866`); `body{min-height:100svh}` + main grows (flex or grid). | DECIDE (lean MUST) |
| SF-15 | **Two-row header where only the menu row stays** — the classic negative-top sticky header (`top: -<row 1 height>`), keeping one `<header>` landmark. `pinOffset` cannot go below 0 (`BoxInspector.tsx:796`); measured by `pinStackPass` like the stack. | DECIDE |
| SF-16 | **Bottom bars step aside while typing on a phone** — header + bottom bar + keyboard leave no room (Smashing: keyboard up to 60%); hide bottom-held bars while a text field has focus on coarse pointers (`:has(:focus)` rule, no JS). | DECIDE |
| SF-17 | **Back-to-top that appears when useful** — after ~4 screens, lower right, labelled (NN/g); `html{container-type:scroll-state}` + `scroll-state(scrollable: top)` shows it with zero JS on Chromium, always visible elsewhere. | LATER (component) |
| SF-18 | **Overlays on the top layer** — cookie banner (`popover=manual`), mobile menu (`popover`), modal (`<dialog>`) escape every z-index and every captured frame; build those components on it, not fixed + z-index. | LATER (component) |
| SF-19 | **Menus hanging off a sticky nav** — dropdowns/tooltips placed with anchor positioning (Baseline 2026), `position-try` flips and `anchors-visible`. | LATER (Navigation) |
| SF-20 | **Pinch zoom** — hide or shrink held bars while `visualViewport.scale` > ~1.3 (MDN pattern). | LATER |
| SF-21 | **Mobile bottom tab bar** — app-like ≤ 5-item `nav` fixed at the bottom with safe area, `aria-current`, page padding (SF-2). | LATER (Navigation) |
