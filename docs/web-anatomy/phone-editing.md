# Editing a website ON A PHONE — research for BATCH E-5

Captured 2026-10-06. Research for BATCH E-5 (adding and placing blocks on a phone). Extends, never redoes,
[`editor-zoom.md`](editor-zoom.md) (desktop canvas zoom in Figma · Canva · Webflow · Framer) and the touch floor in
[`components.md`](components.md). Two researches, done in parallel and combined here (RULE RS):

- **The user's sources** — the Wix mobile editor and the one.com Mobile view editor, each read completely with every on-topic
  link inside them (31 pages; list in §7).
- **Mine** — editing ON a phone in Wix (app), Squarespace, Shopify, WordPress, Notion, Canva, Framer, Google Sites, Webflow,
  Carrd; WCAG, Apple, Android and the touch research (50 pages; list in §7).

Anything not confirmed by a source is marked **inference**.

---

## 1. The problem, measured in our builder (BATCH E-4, 2026-10-06)

On a 393px phone the editor shows the 1200px Desktop page drawn at **22 %**. A block is a few pixels tall, its toolbar is bigger
than it, the drop strips are 25 % of a block's drawn height (**9px** on a 37px block — E4-9), and the open blocks panel covers
the whole canvas, so a block cannot be dragged beside, under or into another (E2-20). Every invariant holds in page px — the
editor is correct to its model and unusable by a finger (E4-14).

## 2. Two different things called "mobile editing"

| | What it is | Who |
|---|---|---|
| **A. A desktop tool for the PHONE LAYOUT** | On a computer, switch the canvas to the phone and change how the site looks there | Wix "Switch to mobile" (Ctrl/Cmd+J) · one.com Mobile view (Ctrl/Cmd+J) · Squarespace Fluid Engine "Mobile View" · Framer breakpoints · Webflow breakpoints · Carrd "Mobile View" |
| **B. Editing ON A PHONE** | The person holds a phone and changes their site | Wix app / phone browser · Squarespace app and phone browser · Shopify app · WordPress app · Notion · Canva · Carrd (beta) |

**Our builder already has A** — the five-rung ladder (rule 18), the Mobile device on the canvas, hide per device, per-rung
values. E-5 is about **B**. The user's two sources are both A; they set what B must keep (below), and show B is rare.

### What A teaches (the user's sources)
- **The phone layout starts as an automatic version of desktop, and edits made for the phone never change desktop.** Wix: "Changes
  to your desktop site affect your mobile site, while changes to your mobile site do not affect your desktop site." one.com:
  "Changes you make in the Mobile view editor don't affect your site's desktop version." — our rung cascade already works this way.
- **Hide, not delete.** Both: hide on mobile → a "Hidden" list → show again (Wix "Hidden on Mobile" panel; one.com "Hidden
  elements" with **+**). Wix: pressing Delete on mobile HIDES; deleting is a desktop act.
- **Order is the phone's own.** one.com is a single column: drag up/down, or **arrows** on the right. Wix: sections "Move section
  down / Move section up" in "Zoom Out & Reorder", or drag.
- **Per-phone text size and alignment** (one.com **A- / A+**, alignment, **Tx** reset; Wix size, colour, alignment).
- **Phone-only additions are few and specific** (Wix): quick action bar at the bottom, back-to-top, welcome screen, mobile menu
  design, header that freezes / disappears; one.com: "Lock to bottom" for footer parts, fixed header.
- **one.com adds nothing and resizes nothing on the phone layout** — the simplest model that works.

## 3. What B looks like — product by product (mine)

| Product | Canvas on the phone | Add | Place / move | Resize | Verdict |
|---|---|---|---|---|---|
| **Wix app** | the live site (inference: phone width) | ✗ "Adding new elements or sections" not possible | ✗ "Moving or resizing elements" not possible | ✗ | content only: tap → plain questions "What does it say?" · "What does it link to?" · "What's in the image?"; edits apply to both layouts; **Undo**, More → **Publish**. New sites on a phone go through an AI chat or a template |
| **Squarespace app** | the page | ✗ "not possible to add or rearrange blocks" | ✗ | ✗ | content only. Phone **browser**: "Delete and rearrange sections", gallery images; ✗ "Adding page sections" |
| **Shopify app** | store preview + a **Sections list** | in the LIST: "Tap Sections, then tap Add section", pick, "Add"; "Tap Add block" | "Tap and hold the drag handle and then drag" — in the list; ••• → Hide / Remove | — | builds by LIST, not on the canvas |
| **WordPress app** | native blocks at the phone's width, one column | **⊕ "Add block"** → picker in a **bottom sheet** (search, tabs); goes AFTER the selected block; **long-press ⊕** → "Add To Beginning · Add Block Before · Replace Current Block · Add Block After · Add To End"; empty group → "ADD BLOCK HERE" | **↑ / ↓ arrows** in the block toolbar (← / → inside a row); long-press the mover → "Move to top / bottom"; **long-press drag** (500ms Android / 450ms iOS, haptic, a chip 32px above the finger, an insertion line, auto-scroll at edges); **drag is OFF with a screen reader — the arrows are the route** | — | the richest real phone builder |
| **Notion** | the page at phone width | toolbar above the keyboard → **+** → full block menu; inserted **at the cursor** | indent / un-indent; tablets: tap-and-hold, drag to a side for columns | — | cursor is the insertion point |
| **Canva** | the whole fixed-size design, fitted, **pinch-to-zoom** | **+** → elements | free drag, corner handles; double-tap into frames | handles | works because designs are free-form at a fixed size; websites get an automatic mobile layout, no mobile mode |
| **Framer** | — | — | On-Page Editing 2.0: reorder sublines, cards, sections on the live page | — | phone = CMS + on-page content; the Designer is not a phone tool |
| **Carrd** | the site | "Add Element" → **added to the END**, then drag (a green bar shows the side) | drag before / after | — | "still somewhat beta-ish… we recommend using the builder on desktop" |
| **Google Sites** | — | — | — | — | "When you edit your site, you must use a computer." |
| **Webflow** | — | — | — | — | Designer needs a mouse and ≥ 1268px (search snippet; the page answered 403). Forum: browsers "have hard time differentiating a drag and a scroll" |

**No product lets a person drag nested blocks onto a zoomed-out desktop page on a phone** — which is exactly what ours offers
today. The ones that really build on a phone (WordPress, Notion, Shopify) share three things: content at the **phone's own width**,
insertion at a **chosen point or in a list**, moving by **arrows or long-press drag**, the picker in a **sheet**. The rest stop at
content edits.

## 4. Finger sizes

| Source | Number |
|---|---|
| WCAG 2.2 **2.5.8 Target Size (Minimum), AA** | **24 × 24 CSS px**, or spaced so 24px circles do not overlap; exceptions: Spacing · Equivalent · Inline · User Agent Control · Essential |
| WCAG 2.2 **2.5.5 Target Size (Enhanced), AAA** | **44 × 44 CSS px** |
| WCAG 2.2 **2.5.7 Dragging Movements, AA** (inference: from the standard, not re-fetched here) | every drag must also be possible with a **single pointer without dragging** — arrows, a menu, tap-tap |
| Apple HIG (iOS / iPadOS) | default **44 × 44 pt**, minimum 28 × 28 |
| Android accessibility | **48 × 48 dp, 8dp apart** (~9mm) |
| NN/g | **1 × 1 cm** minimum; fingertip 1.6–2cm |
| Hoober (1,333 observations) | one hand 49 %; people are **most accurate in the CENTRE** (targets 7mm apart there), edges need **10–12mm**; key actions in the middle half–two-thirds |

At 22 % a 200px block is ~44px — **every block on our phone canvas is one finger wide**, and a 9px drop strip fails even AA.

## 5. THE MAP (RULE MAP) — the axes of phone editing, every value, who does it

| Axis | Values (who) |
|---|---|
| **1. What the phone canvas shows** | (a) the Desktop page zoomed to fit — **ours today**, Canva for fixed designs · (b) **the page at the phone's own width, 1:1** — WordPress, Notion, Wix app, Shopify preview · (c) (b) plus pinch-to-zoom |
| **2. What a phone may change** | (a) content only — Wix, Squarespace app, Framer · (b) content + order + hide — one.com-style, Squarespace browser · (c) building: add, place, nest — WordPress, Shopify, Notion |
| **3. Which rung an edit lands on** | content (words, pictures, links) → every rung (Wix: "reflect on both") · layout (order, hide, size) → the phone only (Wix / one.com / Squarespace) — **our cascade already does this** |
| **4. How a block is picked** | full-screen list · **bottom sheet, partial height, search** (WordPress; NN/g: keep it partial, Close + handle, Back closes) · side panel (desktop) |
| **5. Where a new block goes** | **after the selected block** (WordPress) · a menu: Before / After / Inside / Start / End (WordPress long-press ⊕) · **"Add block here" inside an empty box** (WordPress) · at the cursor (Notion) · at the end, then move (Carrd) · in a list (Shopify) |
| **6. How a block is moved** | **↑ ↓ (← → in a row) arrows** + "Move to top / bottom" (WordPress, one.com, Squarespace) · **long-press drag** with a lifted chip, an insertion line, auto-scroll (WordPress, Shopify list) · free drag (Canva — free-form only) |
| **7. How it is selected and set** | tap to select · a contextual toolbar · settings in a sheet · plain questions ("What does it say?") |
| **8. How it is resized** | not at all (Wix app, one.com) · presets (inference: Full · ½ · ⅓ · Fit) · handles (Canva, desktop tools) |
| **9. Finger floor** | ≥ 24px AA with spacing · **44px AAA / Apple** · 48dp Android |
| **10. The non-drag route** | arrows / menus for every drag (WCAG 2.5.7; WordPress turns drag off for screen readers) |

## 6. Compared — the user's research and mine

- **Overlap:** both say the phone layout is DERIVED from desktop and phone-only changes stay on the phone; both reorder by
  **arrows or drag**; both hide instead of delete; both keep the rest (pages, content) shared.
- **Only in the user's sources:** the depth of a desktop phone-layout tool (per-phone text size and alignment, lock to bottom,
  quick action bar, back-to-top, phone-only animations, the Hidden list) — most of which our rungs already hold.
- **Only in mine:** how a phone actually BUILDS (WordPress, Shopify, Notion), the insertion rules, long-press drag, the bottom sheet,
  the finger numbers, and the fact that most builders refuse building on a phone.
- **The tablet and the app** (the first gap below) are researched in [tablet-and-app-editing.md](tablet-and-app-editing.md) (BATCH E-5c, 2026-10-07).
- **Missing from both (gaps):** Canva's phone gestures (its Mobile tabs did not load); Webflow's own page (403); how a **tablet**
  (768 / 1024) should edit — between a phone and a desktop; how our editor feels on a real low-cost Android (RULE AF) — measured
  only once it is built; real teachers using it (the pilot, RULE RK).

## 7. Completeness

**The user's sources (all read in full):** one.com 360002274197 · 360000552657 · 360000545598 · 360000752637 · 360000452778 ·
Wix: getting-started-with-the-mobile-editor · about-the-mobile-editor · adding-and-customizing-mobile-only-elements ·
customizing-your-mobile-menu · changing-the-page-background-on-your-mobile-site · welcome-screen · back-to-top-button ·
video-backgrounds · managing-your-pages-in-the-mobile-editor · mobile-tools (category) · hidden-elements · text · animation-and-
scroll-effects · managing-sections · quick-action-bar · about-the-mobile-version · collapsible-text · header-and-footer ·
cropping-mobile-image-background · updating-your-mobile-menu · **editing-your-site-on-your-mobile-device** · request-additional-
supported-elements · using-the-mobile-editor-tools · pinned-elements · request-locking-your-mobile-site · using-the-editor-toolbar.
**On topic, not read (left open):** Wix browser-theme-colour · switching to the new quick action bar · managing / customizing a
quick action bar · shape dividers on mobile · mobile-menu characters workaround · drop-down arrow colour · supported browsers ·
Wix Owner app overview.

**Mine:** W3C 2.5.8 + 2.5.5 Understanding · Apple HIG accessibility (JSON) · Android accessibility 7101858 · UXmatters 2013/02,
2013/11, 2017/07 · NN/g touch-target-size, bottom-sheet · Wix editing-on-mobile, creating-a-new-site-from-your-phone ·
Squarespace 360002093708, 214199477, 46306741295757, 206545667 · Canva add-elements, resize-and-crop, glow-up-variantb,
navigate-canva-mobile-app, responsive-website-issues, moving-elements, finding-and-arranging-layers, pinch-to-zoom,
start-designing-from-your-phone · Google Sites 6372874 · Framer breakpoints, mobile-friendly-cms, on-page-editing,
on-page-editing-2.0 · Shopify mobile-online-store, sections-and-blocks, features-overview, customizing-sections · WordPress
add-content-blocks, 2020 mobile block editor, Jetpack redesigned editor, make 2022-05-31, gutenberg PR 18564, gutenberg v17
`inserter/index.native.js`, `inserter/menu.native.js`, `block-draggable/index.native.js`, `block-mover/index.native.js` ·
Notion workspaces-on-mobile, writing-and-editing-basics, block-basics, releases 2021-12-23, 2022-07-20 · Carrd docs, building,
basics, overview, using-mobile-view, troubleshooting.
**Not read:** Webflow breakpoints + Designer intro (403) · Material m2/m3 (render by script; Android help used) · Canva Mobile tabs ·
Webflow forum thread (redirected).

## 8. The user's sources — the last on-topic links (read 2026-10-06, closes RULE R for them)

Read in full: Wix browser-theme-colour · switching to the new quick action bar · managing a QAB · customizing a QAB · shape
dividers on mobile · mobile-menu characters (workaround) · mobile-menu drop-down arrow colour · supported browsers and OS · the
Wix owner app overview. What they ADD:

- **Phone editing, again: content only.** "basic edits—like updating text, images, or links—using the Wix app or from a mobile
  browser… Advanced site editing is available from a desktop." Apps added on a phone still need "desktop to complete setup".
- **A per-element link between desktop and phone, three states:** linked (desktop edits flow down) · customised for the phone
  (desktop edits stop) · deleted on desktop (gone on the phone too). "None" removes it on the phone only. — our per-rung values
  behave the same (a phone value stops inheriting; the node itself is shared).
- **Phone-only site features** (for the component work, not the editor): a Quick Action Bar — horizontal at the bottom, or
  vertical on the left / right with "Closed" and "Open" states; icons only or with labels (labels "can improve… accessibility");
  custom actions to anchors / URLs. **Traps not to copy:** deleting the bar throws away every action's details; an old and a new
  bar with no migration between them; the phone menu's submenu "Arrow" colour can match its box and hide the subpages (a contrast
  check we enforce); special characters misplaced in the phone menu, unfixed since 2022 (test accented and right-to-left labels).
- **Selection:** in Wix's mobile editor one click selects a strip, a double-click a section — ours already drills inward by clicks.
- **Tablets get the DESKTOP site in Wix**; only phones get the phone layout. Supported: iOS / iPadOS 16+, Android 10+, features
  that are Baseline "widely available" (30 months in every core browser). Wix asks editors to keep browser zoom at 100 % — an
  accessibility weakness we do not copy (rule 16: the editor works at 200 % text).
