# The task tree

Everything any session has said it will do, as ONE tree — so moving between sessions and contexts loses nothing.
**Read it at the start of every session. Update it in the same change as the work, and before the session ends.**

## How to use it

- **Find "YOU ARE HERE"** — the one branch being worked on. Work in progress is one branch (RULE RK).
- **A promise goes in the tree the moment it is made** ("I will…", "next…", "after this…"), under its parent, with the
  date and where it was said. A task nobody wrote down is a task that is lost at the next session.
- **Nothing is deleted.** A finished branch is marked done with its commit or measurement; a dropped one is marked
  dropped with who decided and why.
- **A branch closes only when all its children are closed**, or the user has decided otherwise.
- **The bug ledger is a branch**, not a separate list: each open class hangs under the work that found it.
- **"New session" is the signal.** The moment the user says it, the session writes its entry in the **Session log** at
  the bottom — started from, got to, continue from — moves YOU ARE HERE, and commits. Before anything else.
- **It reminds the user too.** Every session opens by saying where we were and what is still open, and asks: continue
  there, or leave it? A branch is only left on the user's word, and the tree says so.

| Mark | Meaning |
|---|---|
| `[x]` | Done — with the commit, test or measurement that shows it |
| `[>]` | In progress — **YOU ARE HERE** marks the exact leaf |
| `[ ]` | Not started |
| `[?]` | Needs the user's decision — never decided alone |
| `[~]` | Parked or dropped — with who decided, and why |
| `[!]` | Status not verified — check before relying on it |

Last updated: **2026-10-01** (Z-1 closed), session 80d91cf9, branch `builder/layout-uat`.

---

## BATCHES — one UAT pass per batch (RULE X, the user 2026-09-30)

One AREA per batch · **at most 6 changes** · **one batch `[>]` at a time**. New work is sorted here by the agent (same area
and room → the open batch; otherwise a queued batch for its area) and the reply says where it went. The checklist is
written BEFORE the pass; one HEADED UAT on a fresh production build ticks every line with what was seen; a batch is `[x]`
only when every line is ticked and every bug it found is fixed and re-checked. Guarded by
`tests/unit/task-tree-batches.test.ts`. Every item names what it IS in words, never a bare number.

- `[x]` **BATCH S-1 · Spacing — the engine and the inspector** — CLOSED 2026-09-30 (final HEADED UAT on build u8hfywi0, 4 themes, 124 checks each, 0 findings; gate: vitest 3,794 · eslint 0 · test:fast 640) (area: spacing · 6 changes) — tree 1.1.1 → SPACE BY DEFAULT
  - changes: (1) section gutter + section space · (2) header/footer bar 1rem · (3) coloured/bordered box 1.5rem, plain box 0
    · (4) gaps: stack 1rem, columns 1rem (a gutter, S1-a), grid both · (5) inspector shows "Default · size", Back to default, inner
    spacing on every element (c-23) · (6) bulk inspector reads the real padding (c-24)
  - LEDGER of the S-1 pass (first HEADED UAT 2026-09-30, build l-Q5HJ74r: 69 checks per theme, the same 11 findings in
    every theme; RE-RUN the same day on build eglndaoX, 4 themes × 5 rungs, canvas + Preview: **92 checks per theme, 0
    findings**):
    - `[x]` S1-a · **columns side by side at page level touched** — FIXED: a band's gap across is a GUTTER (`gutterCSS`,
      `bandGutter` in `lib/box-model.ts`): the band reaches half a gap past each side, each column gives up one gap from
      its share and takes half a gap each side, so a full line of shares fits exactly however many share it; 1rem DOWN too
      (the user, 2026-09-30); tablet basis `(100% − m%) × share − gap`; the canvas resize measures each column's SLOT.
      Bands made from now on only (`makeRowBand` without a gap); a saved band stored 0 and publishes byte for byte as it
      did. Seen: one line with a 14 · 16 · 18 · 22px gap at 768 · 1024 · 1280 · 1920, outer columns flush with the page
      edges, 11px apart down on a phone, canvas = Preview; a boundary dragged 73.2px grew the column 73.2px, outer edges
      still, gap unchanged. Guard `space-by-default.test.ts` "columns side by side" (the CSS EVALUATED, mutation-proven)
    - `[x]` S1-b · the Spacing controls showed stored px ÷ 10 as "rem" — REAL rem now; seen: "Default · 2rem"
    - `[x]` S1-c · HARNESS: computed padding divided by the zoom — seen: header bar 16 · 18 · 22px at 1024 · 1280 · 1920, canvas = Preview
    - `[x]` S1-d · HARNESS: shift-click for two blocks — the box is dragged; and it now ENCLOSES both (the Heading is wider
      than its Text, the box was drawn to the Text's edge and selected one). Seen: "Inner spacing: 0rem" for two
    - `[x]` S1-e · top space 4rem → 1rem — seen: section 18.2/36.5px at 1280 (1rem fluid), canvas = Preview
    - `[x]` S1-f · **my S1-a basis added the gap twice** (`W% × (100% + gap) − gap` where `%` is already the widened band)
      — the third column wrapped at every rung in the first re-run. FIXED; the old unit test had pinned the wrong STRING,
      so the guard now EVALUATES the CSS and sums the slots (red on the old formula, green now)
    - `[x]` S1-g · HARNESS: the gap-down floor was 12px while 1rem is fluid (11.2px on a phone) — now the stack gap's 10
    - `[x]` S1-h · **one drag was one undo step PER FRAME**: Ctrl+Z after a column resize undid 6 of 73px (predates S-1).
      FIXED: every canvas gesture (resize, free drag, floating resize) carries one merge key (`gesture:<time>`), and the
      page merges a gesture however long it is held. Seen: Ctrl+Z put the column back, 4 themes
    - `[x]` S1-i · **a box dragged from the grey space beside the page selected nothing** — the room around the page was
      outside the canvas, though the inspector says "drag a box on empty canvas". FIXED (`marqueeRoom`); seen through the
      UI: failed on build GyQCN, `probe-room-marquee.js` PASS on eglndaoX
    - `[x]` S1-j · the bulk inspector said "2 sections selected" for a Heading and a Text, and its line had no midnight /
      purple colour — now "2 blocks selected", all four themes; test + scenario updated
    - `[x]` S1-l · **the gate was misread**: `test:fast | tail` reported the PIPE's exit (0) while 7 width-round-trip tests
      had FAILED — the "7 failed" heading was cut off by the tail. Every gate run now writes its log and its own exit code
    - `[x]` S1-m · `width-round-trip.spec.ts` measured the old rule (columns touch, each exactly 1/n): it now measures each
      column's SLOT (its box plus the band's half gap each side) — the same definition the canvas resize uses — and asserts
      a gap ≥ 10px is drawn between them
    - `[x]` S1-n · **a left-edge round trip came home at 50.02% beside 50%** (100.02%: the line no longer added up) — the
      left edge re-measured its total in pixels, and a gap puts columns on fractional pixels. FIXED: closing gives back the
      STORED total (width + gap-margin), and the width is stored to two decimals; guarded by that spec (red → green)
    - `[x]` S1-o · **an Alert or a Quote at fit width ran 11px past a 375 phone's edge** (export-layout-invariants, 3
      tests): `max-width: 100%` of a widened band is the line PLUS a gap. FIXED: every column in a gutter band is capped at
      `calc(100% − gap)`; guard in `space-by-default.test.ts`; 640 browser tests green
    - `[x]` S1-p · **every picture background and quoted font stack was dropped from the published page** (predates S-1;
      found by the new picture-background box: canvas had it, Preview did not): the stylesheet rules were serialised for an
      ATTRIBUTE, `url(&quot;…&quot;)`, and a `<style>` block never decodes entities. FIXED: `styleString(css, "sheet")`
      keeps quotes and escapes `<` the CSS way; the old test that PINNED `&quot;` in the sheet is corrected; guard
      mutation-proven
    - `[x]` S1-k · **the checklist lines the probe did not drive** — now driven through the UI (seen below): a BORDERED box and a
      PICTURE-BACKGROUND box (only coloured + plain were built); 0 in the PREVIEW, after a RELOAD and at every size (only
      the canvas); ICON inner spacing (Heading, Text, Link, Image were); a page SAVED BEFORE space by default opened in the
      browser (unit guard only). `probe-spacing.js` extended + `probe-saved-page.js`; all four lines ticked below
  - checklist (each at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920, canvas AND Preview, all four
    themes) — ticked from the re-run on eglndaoX (Light · Dark · Midnight · Purple Dream, 92 checks each, 0 findings):
    - `[x]` a Heading dragged onto an empty page: every block's words ≥ the gutter floor from both page edges; no sideways
      scroll at any rung (heading 22px from the left at 375)
    - `[x]` two sections one under the other: section space above and below: 16 · 18 · 22px at 1024 · 1280 · 1920, canvas = Preview
    - `[x]` a header with a logo and four links: bar 16 · 18 · 22px above and below at 1024 · 1280 · 1920, gutter at both ends, links spaced
    - `[x]` a coloured section, a bordered box, a picture-background box: words 1.5rem from their edge; a plain box adds 0
      — coloured 17/22 · 27/36 · 34/45px in at 375 · 1280 · 1920; bordered 18/24 · 29/38 · 35/46; picture 17/22 · 27/36 ·
      34/45 (it reached the Preview only after S1-p); plain box 0
    - `[x]` a picture dropped on the page still reaches both edges (0 / 0px at every rung)
    - `[x]` a stack of three blocks (stack gap), a row of three columns (one line at 768–1920, see S1-a), a 3×2 grid
      (gap across and down) — the default gaps at every rung
    - `[x]` inspector: each control reads "Default · size"; set 0 → 0 on canvas and Preview, after reload, at every size;
      one side changed, the others keep the default; Back to default; Ctrl+Z; keyboard and screen-reader label — SEEN:
      "Default · 2rem", 0 → 0 on the canvas (by keyboard, Home, on the slider found by its accessible name), one side,
      Back to default, Ctrl+Z; a section set to 0 is still 0/0/0/0 after a reload and at every rung, canvas and Preview
    - `[x]` a Heading, Text, Link, Image and Icon each given inner spacing through the inspector (c-23) — each drew
      4/4/4/4px on the canvas after one step, then Ctrl+Z
    - `[x]` two blocks selected: the bulk slider shows what they have — "Inner spacing: 0rem" (c-24), from the grey room
    - `[x]` a page saved before this change opens exactly as it was; a block added to it arrives with the defaults —
      `probe-saved-page.js`: the saved columns still touch, padding still 0; a Stack added through the UI arrives 16/32px
    - `[x]` 150% browser text: the section space grows (18.1/36.2 → 22.1/44.2px at 1280); the exported CSS has no pixel spacing
- `[x]` **BATCH S-2 · Spacing — components breathe, the audit measures it** — CLOSED 2026-09-30 (HEADED UAT on build -BHdJe1L, 4 themes, 132 checks each, 0 findings; sidebar HEADED on EQ3zdB, 4 themes; gate: vitest 3,896 · eslint 0 errors · test:fast 724) (area: spacing · 5 changes)
  - (5) **blocks placed one under another touch** (asked by the user 2026-09-30, seen in the S-1 screenshots): a
    component or button placed straight on the page gets NONE of the section space (`leafPaddingCSS` skips self-painting
    blocks) and the page itself has gap 0, so a component sits against the one above/below it; coloured sections, a row
    of columns and a picture also meet with no space. The user suggests 0.5–0.8rem, "mostly bottom margin", stacks not
    included. **DECIDED by the user 2026-09-30 ("go with your recommendation"):** every block placed straight on the page —
    components and buttons included — gets the section space above and below, OUTSIDE its own painted box, so coloured
    sections still meet; **1rem**; a stack inside a stack is spaced by its parent's gap; never a per-block bottom margin.
    **CODED 2026-09-30, waiting for the S-2 UAT pass.** The user decided the same day: it is shown and overridden
    by **Outer spacing** ("Default · 1rem" for a block dropped on the page — the gutter is its band's, S2-f; Back to
    default); Inner spacing stays the component's own padding. Built
    as a MARGIN (`outerDefaults` / `outerSpaceCSS` / `sectionPlaceIn` in `lib/box-model.ts`, one call in the canvas and
    one in the export), so the selection outline stays on the painted box. It covers the `component` nodes, the Button
    AND the catalogue components built as trees (Card, Quote, Stat, Badge, Rating — they are containers with a
    `preset`, which the first version missed). Straight on the page: 1rem above/below + 2rem gutter each side, and a
    block stored at width 100% gives the side margins back (`calc(100% − 4rem)`); a column of a band: 1rem above/below
    only (the band's gutter spaces it across); in a stack: nothing. Guard `space-by-default.test.ts` "S-2 (5)" (75
    tests, red first, mutation-proven on the export line); scenarios added to `box-builder-spacing.feature`
  - LEDGER of S-2:
    - `[x]` S2-a · a component's Inner spacing read "Default · 1rem/2rem" on the page though nothing was drawn (its own
      padding is only drawn once set) — FIXED: a self-painting block's inner default is 0 (`spaceDefaults`); guarded
    - `[x]` S2-b · the Inner/Outer spacing side boxes had `dark:border-white/10` with no midnight / purple variant — FIXED
    - `[x]` S2-c · a Card built as a tree carried the section padding INSIDE its painted box — FIXED; SEEN in the S-2
      pass: the Card's words 28px in from its own edge at 1280 (its design's padding), the gutter outside it
    - `[x]` S2-f · **a component dropped on the page touched the page edges** (found by probe-s2 on build rLg4Bh, and by the
      user the same hour: "still hugging the far end on the left or on the right"): through the UI nothing is ever
      straight on the page — a drop lands as a column of a page BAND, whose gutter puts its outer columns flush with the
      edges, so the "page" branch of `outerDefaults` was unreachable and a Card / Quote / Alert sat 0 / 0px from the edges,
      a Button 0px from the left, at every rung, canvas and Preview. The old unit test built `root.children = [card]`, a
      shape the UI never makes. FIXED: `pageBandInset` — a band of the page holding a self-painting block (not a coloured
      section) keeps the 2rem gutter as its own padding, so the columns' gap arithmetic and the resize's slot measure are
      untouched; it steps aside once that block's Outer spacing across is set. One call in the canvas, one in the export.
      Guard: `space-by-default.test.ts` "S2-f" builds the UI's shape (page → band → component), 8 red with the inset off.
      SEEN (build -BHdJe1L, 4 themes): 22.4 / 36.5 / 44.8px from both edges at 375 / 1280 / 1920, canvas = Preview.
      ponytail: a coloured section sharing a band with a component is inset with it
    - `[x]` S2-g · HARNESS: probe-s2 read the band's half-gap side margins as Outer spacing and expected "Default · 2rem";
      a column's sides are the band's gutter, so it now checks top/bottom — the Outer spacing a band column shows is
      "Default · 1rem", which is what this checklist says. The feature file said 2rem too — corrected
    - `[x]` S2-h · two comments (BoxInspector 840, pinning-explained.spec 227) gave the reversed rule as the reason a
      floating bar reserves no space — reworded to the real reason; no behaviour changed
    - `[x]` S2-i · **the app's sidebar linked to 14 pages that do not exist** (`/attendance` and 13 never built), and the
      page prefetched them: two 404 console errors on every screen with the sidebar, which failed
      `side-by-side-resize.spec.ts` "no console error" in the full gate (24 of 24 under 8 workers; it had passed by timing).
      The guard now names the URL of a failed load. DECIDED by the user 2026-09-30: Attendance → `/students/attendance`,
      the 13 HIDDEN until built (`UNBUILT` in `Sidebar.tsx`, listed in `docs/MVP_AUDIT.md` and tree 4). Guard
      `sidebar-links.test.ts` (every menu link has a page; red on `/attendance`). SEEN (`probe-sidebar.js`, build EQ3zdB, 4 themes side by side, HEADED): no School Management group, Academic → Classes only, Management → Finance · Library, Attendance clicked → `/students/attendance`, 0 failed loads on `/`, that page and the builder; the resize guard 24 of 24 under 8 workers (was 0 of 24)
  - checklist (written 2026-09-30, BEFORE the pass; each at 375 · 768 · 1024 · 1280 · 1920, canvas AND Preview, 4 themes) —
    ticked from `probe-s2.js` on build -BHdJe1L (Light · Dark · Midnight · Purple Dream side by side, HEADED, built through
    the UI: 132 checks each, 0 findings; the first run on rLg4Bh found S2-f and S2-g):
    - `[x]` (5) a Card, a Button, a Quote and an Alert dropped one under another on the page: painted boxes 22.4 · 28.3 ·
      32.4 · 36.5 · 44.8px apart at 375 · 768 · 1024 · 1280 · 1920 (1rem each side, OUTSIDE the box); the gutter at both
      sides (after S2-f); two coloured Stacks meet (0.0px); selection outline on the painted box (Card, Alert)
    - `[x]` (5) the same four inside one Stack: 11.2 · 14.1 · 16.2 · 18.2 · 22.4px — the stack gap only, 0 margin above/below
    - `[x]` (5) the Card's Outer spacing: "Default · 1rem" → 0 → 0/0/0/0 on the canvas → still 0 after a reload → Back to
      default 16.2px above/below → Ctrl+Z back to 0; canvas = Preview within 4px at every rung
    - `[x]` (5) a page saved before this change opens exactly as it was; a Stack AND a Card added to it through the UI arrive
      with the defaults (the Card 32.4 / 32.4px from the edges, 16.2px under the block above), the saved sections untouched
    - `[x]` (1) every component in the catalogue × every design (68 tests, enumerated) — HEADED on -BHdJe1L, all green
    - `[x]` (2) the page audit: NOTHING on the UI-built default page at 5 rungs × 4 themes; on a section zeroed THROUGH
      THE INSPECTOR (probe-spacing) it reports W7a for the page edge and the coloured box; the seeded 0-gutter / 0-inner
      pages of `page-audit-whitespace.spec.ts` flagged too (HEADED, 16 tests)
    - `[x]` (3) W7b: nothing on the default page (5 rungs × 4 themes, UI-built); two sections with 0 space flagged — that
      page is SEEDED in the spec (HEADED), not built through the UI
    - `[x]` (4) the old wording: 0 hits in the four places; two more comments found and reworded (S2-h)
    - regression, HEADED on -BHdJe1L: `probe-spacing.js` (S-1) 124 checks × 4 themes, 0 findings
  - NOT BUILT, found while writing the story (an unbuilt feature, so queued, not a ledger line): the in-app **Page
    check** does not report W7a/W7b — only the sweep's `page-audit.js` does — though `box-builder-spacing.feature`
    "The Page check finds words too close to an edge" describes it. Queued as BATCH S-3 below
    - `[x]` S2-d · **every Stat design: the number sat 1.2px above its label** (the comma of "1,000+" on "Happy") —
      FIXED: the Stat's gap 0.25rem → 0.5rem; found by the new `component-breathing.spec.ts`
    - `[x]` S2-e · NOT A BUG, measured: sections stretched to share a short page's window in my test pages — the test
      helper `createRoot()` has a 600px floor; the app's page root (`emptyPageRoot`, `box-site.ts:37`) has none, and the
      published page measured 27px per Text on it. The audit spec builds on `emptyPageRoot`
  - CODED 2026-09-30 (waiting for the S-2 UAT pass), the user's decision the same day: **"never touch"** — each design
    keeps its own spacing; the floor is 0.25rem in the designs' fluid unit, not the page defaults:
    - (1) `tests/e2e/component-breathing.spec.ts`: every catalogue component × every design it offers (enumerated
      from the catalogue, 34 × 375/1280 = 68 tests), through the export — words ≥ 0.25rem from their visible box,
      words/icons of two parts ≥ 0.25rem apart. Red on S2-d; mutation-proven (Card padding 0 → red)
    - (2)+(3) `scripts/uat/page-audit.js` W7a (words < 1rem from the page edge; words touching their coloured box)
      and W7b (two sections' words < 1rem apart), as WARNINGS; `tests/e2e/page-audit-whitespace.spec.ts`: a
      default page reports nothing at 375 · 768 · 1280 · 1920, a 0 gutter / 0 inner / 0 section space each flagged
    - (4) the old wording rewritten in all four places; the two hits left (CLAUDE.md, this tree) describe the reversal
  - (1) a gap between a component's parts and padding from its own visible edge, the whole catalogue · (2) audit check:
    words closer than the gutter floor to the page or their coloured box's edge · (3) audit check: sections closer than
    the section floor · (4) the old "never a default" wording in the four places left (layout feature 347,
    `text-is-reachable.spec.ts` 34, design-foundation `02` 485, memory `feedback_radius_and_spacing.md`)
- **← YOU ARE HERE: BATCH L-2 (the editor and the Preview disagree)** — Z-1 CLOSED 2026-10-01 (canvas zoom; acceptance pages
  334 and 12 BUILD). L-1 closed earlier the same day. (E-0 closed 2026-09-30; S-3 queued)
- `[ ]` **BATCH S-3 · The editor's Page check warns about space** (area: Page check warnings · 2 changes, queued
  2026-09-30): (1) the in-app Page check reports words closer than 1rem to the page edge or touching their coloured box
  (W7a) and two sections closer than 1rem (W7b), as warnings, the way `page-audit.js` measures them — the scenario
  already exists · (2) **added by the user 2026-10-01:** a warning sign when a column is TOO NARROW FOR ITS WORDS — at
  any screen size, a column holding text narrower than its longest word — naming the column and the size, with a way to
  select it. The user asked: "if the columns are too tiny on screen for anyone to drop into… how are people going to be
  able to see what's in that column" when the site goes live. L-4's c-8 (decided B: the grid gives up columns rather
  than break words) fixes the published page; this tells the person building while they build
- `[x]` **BATCH E-0 · The build failures that stayed when run alone** — CLOSED 2026-09-30 (commits `78cc6ee`, `0ae9b5f`; gate: vitest 3,903 · eslint 0 errors · test:fast 737; E0-a…h ticked, E0-f recorded as a gap → Z-1) (area: sweep harness/drop) — the re-run of
  e-2/e-3 was STOPPED by the user at 3 of 14 (2026-09-30), on build OvtY9uAA, HEADED UAT:
  - page 68 (sonicdrive, blog index) — built, 0 errors ALONE → it was the machine
  - page 145 (soul-trane, about) — STILL FAILED alone on OvtY9uAA: a click timed out after 10 s. **Re-run alone
    2026-09-30 on EQ3zdB: it BUILDS (151 blocks)** — the click timeout is gone (not reproduced on a build with S-1/S-2) —
    but reported 81 errors, which gave E0-a/b/c. After their fixes, on W2q1ZFy1: 1 error, the e-4 case below
  - LEDGER of E-0:
    - `[x]` E0-a · HARNESS: `page-audit.js` L4 counted the S1-a gutter band's intended half-gap reach as "content spills
      out sideways" — 76 of page 145's 81 errors, and every page built since S-1. FIXED: a child reaching out with a
      negative side margin has its COLUMNS measured instead. Guard `tests/e2e/page-audit-spill.spec.ts` (a row of
      coloured columns in a section: no spill; a block really wider than its box: a spill), 4 red without the fix; in test:fast
    - `[x]` E0-b · **a menu's links were 18px apart on the canvas and 50px in the Preview** (page 145, every size ≥ 768:
      the menu, "Apply now" and the line shifted ~12%). Two faults, found by `probe-e0b.js` (the dresser's own burger
      header, built through the UI): (1) `linkLineGap` returned `gap: undefined` beside its longhands and React dropped
      both on the canvas (its inline style had no column-gap at all); (2) since S1-a a menu line was ALSO a band with a
      gutter, so every link took half a gap each side on top of its 2rem. FIXED: longhands only; `bandGutter` is 0 for a
      line of menu items (`isMenuLine`). Guard `space-by-default.test.ts` "E0-b" (both mutations red). SEEN: canvas =
      Preview, 0 blocks differ at 1280, links 2rem apart in both
    - `[x]` E0-c · the 96px HOLE at the end of the menu's line on the canvas at 1280 — the same fault as E0-b; gone with it
    - `[x]` E0-d · HARNESS: `h.js` `visibleRect` clipped a target to the blocks panel on the left but not to the Inspector
      on the right — page 393's drop "beside" was released on the Inspector's "Outline style" button. FIXED: clipped to
      `aside[aria-label="Inspector"]` too. (393 itself built on the next run; the clip is exercised by every page run)
    - `[x]` E0-e · **a column 4–7px wider than the section it sits in** (L4 on 4 tier-99 pages: 337, 393, 398, 399, 1024 →
      1920) — the ENGINE, found once the E0-a audit fix measured band columns: a band that holds a narrowing grid is a size
      container (`hostsNarrowingGrid`), and `--box-u` carries `0.5cqw`, so the band's reach read the section OUTSIDE it
      (16.07px) while its columns read the band itself (11.2px, the clamp's floor) — 5px out, never given back. FIXED at
      the root, the way `--box-t` was (#133): the band declares the gap ONCE as a registered length (`@property --bx-gut`,
      in `TYPE_UNIT_PROPERTY_CSS`, emitted by both engines), and the reach and every column's margin, basis, max- and
      min-width read `var(--bx-gut)`. Guard `page-audit-spill.spec.ts` "a row of columns inside a NARROW column" (a 6+6
      grid as the full-width column of a band in a 30% column): 2 red on the old CSS, green now; S1-a's evaluator in
      `space-by-default.test.ts` now substitutes `--bx-gut` and still sums every line of shares to the band exactly
  - **E-0 run 2026-09-30, in PARALLEL (6 windows, build W2q1ZF), the 11 pages not yet re-run:** 6 built (335, 337, 398,
    399, 400, 401), 5 failed (23, 336, 396: scroll timeout · 334: "only 3px visible" after the build had already gone
    wrong — a 40px Stack, overlapping headings · 397: "the canvas offered the drop and added nothing", = e-1). Their
    findings sorted: L4 spill → E0-e (fixed) · words broken ("afternoon", "welcomed", "1,000+") → c-8 / e-7 in L-4 ·
    HOLE → c-7 / e-9 in L-4 · canvas≠Preview → e-4 in L-2 · Tablet 4 columns → e-6 in L-3. Page 393's second run
    crashed mid-audit ("execution context was destroyed") under that load
  - `[x]` **CHECK asked by the user 2026-09-30** (DONE — answered by E0-g and E0-h below, HEADED 4 themes) (from a screenshot of the E-0 run: "Meet the team", four star icons each
    in a column as tall as the quotes beside it): a block dropped UNDER an icon in such a cell lands under it in the same
    column (not as a new grid cell), canvas and Preview, every rung; and a cell can be set to hug its content instead of
    stretching. Built through the UI after the runs finish; anything else → the E-0 ledger. Also noted: the harness fills
    a cell narrower than TEXT_MIN with an Icon, so a "team" section shows stars instead of photos — a realism limit of the
    dressed pages to record in the sweep report
  - **Run on build Sb_l4U (committed `78cc6ee`, gate: vitest 3,900 · eslint 0 errors · test:fast 736):** the spill is
    GONE everywhere (399: 34 → 1 error, 398: 32 → 13). ALONE, 23 · 336 · 396 · 393 BUILD (their parallel failures were
    load). STILL FAILING ALONE → bugs: **334** (the build goes wrong before "only 3px visible": a 40px Stack, headings
    over the menu) and **397** ("the canvas offered the drop and added nothing", into an icon cell = e-1). **337** failed
    in parallel with the same e-1 message (it built before) → to re-run alone. Every other finding is a queued class:
    words broken (c-8), HOLE (c-7), canvas≠Preview (e-4), Tablet 4 columns (e-6)
  - `[x]` E0-f · **a column too narrow on screen to drop into** (page 334, fails alone): its recipe is a 5-column row with
    4 hand-sized columns inside the 28% one, so in the editor window each is ~40px and the 4th Stack's target 3px; the
    builder obeys the sizes, and the canvas is always "Fitted to screen" — there is NO ZOOM, so no person could drop there
    either. DECIDED by the user 2026-09-30 ("go" on the recommendation): RECORDED AS A GAP here, and canvas zoom is
    built as its own batch — BATCH Z-1, queued straight after L-1 (a new feature, one area at a time, RULE RK)
  - `[x]` E0-g · **a block dropped just under an ICON: the drop was offered and NOTHING was added** — 4 of 4 through the UI
    (`probe-icon-cell.js`), and page 397's failure. MEASURED: no `drop` event reached the page; the element under the last
    `dragover` was the icon's `<path>`, and at `dragend` it was no longer in the page — React re-set the SVG markup while
    the drag passed over it, and the browser delivered the drop to the detached node. FIXED: an injected decorative SVG is
    never a pointer target (`pointer-events: none` on the icon block, the Alert's icon, the Accordion's icons); the pointer
    lands on the block's own box. SEEN: 4 themes, the Text in the icon's cell, the grid still 3 cells, canvas = Preview at
    every rung. Guard `tests/e2e/drop-under-icon.spec.ts` — a REAL mouse drag (a synthetic drop cannot show it)
  - `[x]` E0-h · **the spare height of a column stretched by its neighbour was SHARED between its blocks** — the Text
    landed 55px under the icon (its band grew to 73px around a 36px icon). DECIDED by the user 2026-09-30: "blocks at the
    top", then — when the gate showed it opened a hole at a column's foot after a shared edge is dragged
    (`resize-leaves-no-gap.spec.ts`, 66px) — "LAST BLOCK TAKES IT". FIXED (`hostFills`, `childStyle`): in a host-stretched
    column only the last block grows; a lone block still fills it (equal-height Cards); a height the user set shares as before. Guards: `space-by-default.test.ts` "E0-h" (red on
    the old rule), and `drop-under-icon.spec.ts` asserts one stack gap under the icon
  - `[x]` the user's icon-cell CHECK — answered by E0-g and E0-h above
  - **337** fails alone with and WITHOUT E0-e (bisected on a build with E0-e reverted: it failed at another drop step)
    → not a regression; its drop failures join e-1 / e-3 in L-1. **397** was E0-g
  - E-0 CLOSED 2026-09-30. Next: BATCH L-1
  - [SUPERSEDED — see "Run on build Sb_l4U" above: 393 BUILT alone, and every page below was re-run] page 393
    (elytetemplate, services) — STILL FAILS alone: the drag never reached the canvas, twice → a bug (e-3)
  - [SUPERSEDED, as above] not yet re-run: 23, 334, 335, 336, 337, 396, 397, 398, 399, 400, 401
- `[x]` **BATCH L-1 · Tier-99: blocks that would not drop or select** — CLOSED 2026-10-01 (commit `509822a`; gate:
  vitest 3,915 · eslint 0 errors · test:fast 739; page 337 18 of 18 in six windows; L1-13 parked on the user's word)
  (area: drop / select · 5 changes, OPENED 2026-09-30, session after 25f18c91)
  - **UAT CHECKLIST (written first).** Every run is a HEADED UAT on a FRESH production build, in PARALLEL (`--jobs=6`); a
    page re-runs ALONE only after it failed in parallel. Each failure that stays is reproduced through the UI with a REAL
    mouse drag (the `probe-e0g.js` / `probe-icon-cell.js` pattern), fixed at the root, guarded (red without the fix), and
    its fix seen in all 4 themes (Light · Dark · Midnight · Purple Dream) at 375 · 768 · 1280 · 1920, canvas = Preview
    - `[x]` L1-r1 · tier 99 (`--plan=dressed99`): 2, 87, 142, 153, 227, 278, 337, 385 — PARALLEL, build Uz_bd6Ge (FRESH),
      21 min: **7 of 8 BUILT, every one with 0 missed drags** (2 = c-22: 178 blocks · 337: 188). Their errors are all
      queued classes: HOLE + L8 broken words (L-4), R11 canvas≠Preview (L-2). FAILED: **142** (lexara 404) "could not
      select 2-29 (got w-1z)", then a click timeout → alone
    - `[x]` L1-r2 · tier 95 (`--plan=dressed95`), the 19 build failures: 12, 13, 26, 34, 40, 56, 71, 73, 74, 75, 76, 106,
      107, 109, 117, 118, 124, 133, 134 — PARALLEL, 40 min: **16 of 19 BUILT**. FAILED: **12** (muebles) "cannot drop into
      f-2g: only 15px of it is visible" · **109** (tarot) "could not select 8-17 (got none)" · **124** (patina) "the drag
      never reached the canvas, twice (after beside(s-7d,Card)) · released at (845,755) nothing" → all alone
    - `[x]` L1-r3 · tier 80 (`--plan=dressed`) page 38 (locallistingtemplate faqs) — BUILT, 212 blocks: the column selects
    - `[x]` L1-r4 · previewcheck `B30_footer_5col` and `P4_stress` — both `ok`
    - `[x]` L1-r5 · everything that failed in parallel, re-run alone — ALL FOUR FAILED ALONE TOO (bugs, not load): 142
      and 109 → L1-3 · 124 → L1-3 (+ L1-1) · 12 → L1-4 (Z-1)
    - `[x]` L1-r6 · (closed 2026-10-01: 337 built 18 of 18 in six windows, see L1-7) the 7 e-1 pages (2, 87, 153, 227, 278, 337, 385) on the fixed build (0D0EXS4f, 3 windows beside 3–4
      others AND a `next build`): 5 of 7 BUILT (87 · 153 · 227 · 278 · 385); 2 and 337 → L1-7. Page 2 then built 2 of 2
      on the same build with no build running; 337 in batch A
    - `[x]` L1-u · for each fix: the repro through the UI, before (fails) and after (works), 4 themes × 4 widths, and the
      Preview at every rung — e-1 (`probe-l1e1.js`, 0D0EXS4f), L1-3 (`probe-l1-sticky.js`, J7UBYmMI), L1-9
      (`probe-l1-header.js`, _nj0GR7K), L1-7 (`drop-into-empty.spec.ts` red on _nj0GR7K, green after; page 337 18 of 18
      on zQEc74E7), each recorded in its ledger line
    - `[x]` L1-g · gate, 2026-10-01 at the commit: **typecheck 0 · eslint 0 errors (105 warnings, the accepted
      category) · vitest 3,915 of 3,915 · test:fast 739 passed**. The first full vitest run found L1-15
    - `[x]` L1-11 · I BROKE THE LINT: the second build folders (`.next-b` … `.next-e`) were linted — 127,808 "errors", all
      build output. FIXED: `eslint.config.mjs` ignores `**/.next-*/**` (and `.gitignore` has `.next-*/`); then 3 unused
      variables in my own new probes, removed → eslint 0 errors
  - LEDGER of L-1:
    - `[x]` L1-0 · the tree said page 393 "STILL FAILS alone" and listed 11 pages "not yet re-run" after both had been
      settled (lines above) — FIXED: marked SUPERSEDED (a documentation defect, no code)
    - [SUPERSEDED — measured and fixed, see the `[x]` L1-1 line below] L1-1 · HARNESS (suspected): page 124 released a
      drop at y=755 in a 720px window, on nothing. To MEASURE on the alone re-run before any fix
    - `[x]` L1-12 · the tree held L1-1 twice, open here and closed below — FIXED: this line marked superseded
    - `[~]` L1-13 · **page 337 ALONE on a FRESH build (zQEc74E7, 2026-10-01) FAILED at a NEW step**, 26 blocks in, 159 s:
      `under(jq-r, Text)` — the drag was let go at (354,468), OUTSIDE the canvas (every last dragover "OUTSIDE-CANVAS
      NOT-accepted"), while the failure screenshot shows the target heading "Meet the team" at about x 400–580, y 345–380,
      the page ending at y 391. The aim did not match the heading. The harness now prints where `under` aimed
      (`page.__aim`); re-run in SIX windows to measure (alone it failed, so it is not load). Six windows: 6 of 6 went
      past that step and built (1 failure in 13 tries — intermittent). The harness now also records where the aimed block
      lay AT RELEASE. Then 6 more windows and 6 on a COLD server (testing "the first run after `next start`"): 18 of
      18 built — NOT REPRODUCED (1 in 19), the cold-server idea not confirmed. **PARKED by the user 2026-10-01 ("go" on
      the recommendation):** open, instrumented (aim + position at release), watched in every sweep from here; the
      next occurrence carries its measurement and reopens it as a ledger line of the batch that sees it
    - `[x]` L1-15 · **my new guard `drop-into-empty.spec.ts` was in neither browser suite list**, so nothing would ever
      have run it — caught by `test-scripts.test.ts` in the full vitest run. FIXED: added to `test:invariants:rest`
      (package.json) and `scripts/test-fast.js`; it ran green in test:fast
    - `[x]` L1-14 · **a background-limit notice on the shell that started `next start` was taken for the server dying**,
      and six good runs of 337 were stopped ~25 min in (2026-10-01). MEASURED: the server (pid 26828, started 03:27) kept
      serving the fresh build; only its shell wrapper was killed. FIXED: `uat-pages.js` refuses to start unless
      `check-fresh-build.js` says FRESH, checks again after EVERY page and, if the server is gone or stale, stops starting
      pages and says no failure since is a product finding (proven: no server on 3999 → "NOT RUN", exit 2; fresh 3100 →
      runs). Trap written in `docs/TESTING.md`; the server is started with the 2-hour background limit. The 37-minute
      shared timeouts of the last session remain UNEXPLAINED (the server-limit idea is unproven, withdrawn)
    - `[x]` L1-3 ROOT, FOUND AND FIXED: `pinCSS` clause 3b gave a sticky container in a row `height: calc(100dvh - …)` —
      a sidebar whose CONTENT is taller than the screen kept a screen-tall box and its content ran on below it, out of the
      row, over the next section and off the page's end. Reproduced through the UI (`probe-l1-sticky.js --tall=1`, 736px
      spilled at every scroll step; `--tall=0` and plain: 0), and measured on page 124 itself (the aside's computed height
      720px, sticky). FIXED: `min-height` (the larger of the user's and the screen's) — a short sidebar is still the
      screen's height and keeps its travel, a tall one holds its content. Guards: `pinning-holds.spec.ts` "a sidebar
      whose content is taller than the screen…" (red on `height`: "runs 600px past its own foot"; 8 green with the fix),
      `pinning.test.ts` clause 3b. **HEADED UAT, build J7UBYmMI (FRESH, `.next-c` on 3300), Light · Dark · Midnight ·
      Purple Dream:** canvas — the sidebar 1455px, 0px spilled, its row holds it at every scroll step; Preview at 375 · 768
      · 1280 · 1920 — its content stays above the next section, still sticky (screenshot
      `probe-l1-sticky-out/sticky-tall-Midnight/preview-768.png`). Regression: tier-95 page 13 (right-sticky) still
      builds. **Pages 142, 109 and 124 now BUILD** (136, 175 and 345 blocks) with L1-3 + L1-8 — all three failed alone all
      day; their remaining audit errors are the queued classes (L-2, L-4). Regression, tier 99 pages with a sticky header
      AND a sticky sidebar (13 · 28 · 31 · 46 · 61 · 76, build J7UBYmMI; 79 · 94 · 127, build _nj0GR7K) and tier-95 page 76:
      10 of 10 BUILT, every error R11 / HOLE / L8
    - `[x]` L1-7 · **CLOSED 2026-10-01: page 337 BUILT 6 of 6 in SIX headed windows side by side** on build zQEc74E7
      (FRESH): 188 blocks each, 66 Preview sizes, ~13 min each. Its 2 errors are queued classes: HOLE at Tablet (L-4),
      R11 canvas≠Preview at Wide — the burger menu wrapping "Contact", 79 vs 63px (= e-4, L-2). Pages 2 and 337 on the e-1 build: "offered the drop and added nothing (into, an empty Stack) · released
      at (740,5xx) on <svg>" — INTERMITTENT: page 2 built 2 of 3 on the same build; both failures ran beside a `next
      build`. NOT the "+" icon: 4 of 4 alone and 36 of 36 in six windows landed on it. 337 then BUILT in batch A (no
      build running) — and FAILED again on _nj0GR7K with no build running: `into(m-15, Text)`, released on the empty
      Stack's "Choose a block to add inside" button; m-15 is an empty Stack with a background and 24px padding. NOT
      LOAD. `probe-e0g.js` (that very shape, through the UI) in five windows: 15 of 15 landed. So 337 has something the
      probes lack. The harness now records the browser's `drop` / `dragend` events of every drag (target, detached,
      handled) and prints them on a lost drop. **MEASURED, 3 of 4 runs lost it the same way:** at the release point, pointer
      still — `dragover <div> accepted`, `dragenter <button>` (the empty box's "+"), `dragleave <div>`, `dragleave <button>`,
      and NO `dragover` after; the browser sent `dragend`, never `drop`. The editor's hint came and went under a still
      pointer, and the drop had no accepted target. FIXED (`BoxCanvas`): while a block is carried (`data-box-drag-in`) the
      empty box's hint and the grid's ghost cells take no pointer — where a drop lands is `computeDrop`'s, from canvas
      coordinates. Guard `tests/e2e/drop-into-empty.spec.ts` (a REAL drag held over the "+"): red on _nj0GR7K ("the
      pointer is on the empty box's hint (<path>)"), green on 6UEsvQW6. Acceptance: page 337 ×5 + page 2 on 6UEsvQW6 —
      **all five 337 runs went PAST the step that lost the drop** (≈155 blocks, the failures stopped at 40). Then ALL SIX
      windows timed out at the same moment ~37 min in (`scrollIntoViewIfNeeded` / click, 10 s) — page 2 after its build had
      finished, every run ~3× its usual time, no build running, 5 GB RAM free: a machine-wide slowdown, cause not found.
      Screenshot `dressed99-out/p337-build-fail.png` shows a healthy page. Page 337 re-run ALONE was STOPPED by the user's
      "stop here" before it finished. **Still to do: 337 alone to completion; then L1-7 closes**
    - `[x]` L1-8 · HARNESS: `visibleRect` clipped a target to the blocks panel and the Inspector but not to a PINNED block
      lying over it — so drops aimed under a stuck header or a sticky sidebar landed IN that block's row: a column beside
      the page header (page 124, which then made the header screen-tall), an Image and a column in the sidebar's row (109,
      124). FIXED (`h.js`): pinned blocks over the target are clipped away, as a person aims at the part left open.
      **Extended after batch A (page 109, on the L1-3 build):** a heading lying BEHIND the stuck header was not scrolled
      out from under it, and `under()` let go without checking anything was visible — so `under(heading, Stack)` dropped
      INTO the sticky header and the rest of the page was built inside it (a 2,746px header, the recording in
      `logs/p109-A.json`). FIXED: `visibleRect` scrolls a target clear of a stuck bar; `under()` throws "only w×h px
      visible" like `dropInto`, whose message now gives the height too (page 142's "only 778px visible" was 778 WIDE)
    - `[x]` L1-1 · HARNESS, measured: page 124 released at y=755 in a 720px window — the Card it aimed beside hung below
      the page's end (L1-3), and `visibleRect` never clamped to the window. FIXED: clamped; `dropBeside` reports "only
      w×h px visible" instead of letting go off screen
    - `[x]` L1-9 · ENGINE: a pinned HEADER / NAV / FOOTER sharing a row with a column got clause 3b's screen height (page
      124's header: 720px). FIXED: clause 3b skips a container whose meaning is header, nav or footer. Guard
      `pinning.test.ts` (3 cases, red without `!bar`, green with it). Reproduced through the UI first (`probe-l1-header.js`
      on the build without it: a 720px `<header>` around a 37px heading, canvas and Preview). **HEADED UAT, build
      _nj0GR7K (FRESH, `.next-d` on 3400), 4 themes:** the header 70px on the canvas, 50 · 61 · 78 · 96px in the Preview
      at 375 · 768 · 1280 · 1920 (screenshot `probe-l1-header-out/PurpleDream/canvas.png`)
    - `[x]` L1-10 · TEST BUG: `probe-l1-sticky.js`'s Preview check read the sidebar, scrolled, then read the next section,
      and reported the 200px scroll step as "~180px into the next section" at every width (the screenshot showed no
      overlap). FIXED: scroll first, then read both
    - `[x]` L1-3 (the report — root and fix in "L1-3 ROOT" above) · **page 142 (right-sticky sidebar): the sidebar lies ON TOP of the main content** — FAILS ALONE (31 min,
      "could not select g-29 (got n-1z)"). Screenshots `dressed99-out/p142-crash.png`, `p142-build-fail.png`: the main
      column's bands run the full width (x 118→1078) and the sticky sidebar's Card, picture and list (x 810→1033) are
      drawn over them, so a click on the covered part selects the sidebar. To trace: the build steps (the page's child
      run with DEBUG), then a small repro through the UI (`probe-l1-sticky.js`, sticky vs plain). **Tier-95 page 109**
      (tarot, right-sticky) FAILS ALONE the same way: "could not select o-17 (got none)", `dressed95-out/p109-build-fail.png`
      — the sidebar (x 904→1077) over a light section that runs 118→1078
    - `[x]` L1-4 · tier-95 **page 12** (muebles) FAILS ALONE (4 min): "cannot drop into q-2g: only 15px of it is visible".
      NOT A BUG of the engine — MEASURED from its recipe (`page-plan-95.json`[12]): a row of 8 hand-sized columns
      (15·10·10·15·**5**·10·20·5 %) inside the 70% main column, with rows inside those columns (e.g. 7 columns of 15%
      of a 5% column) — a few px each, which the builder obeys and nobody can drop into without zoom. = E0-f's class →
      **BATCH Z-1: page 12 joins page 334 as its acceptance test**
    - `[x]` L1-2 · **e-1 FOUND: a palette CLICK with an Image grid cell selected put the new block INSIDE the Image** — the
      S-1 repro, driven through the UI (`probe-l1e1.js`, build Uz_bd6Ge): the Image lands in the grid as a 7th cell, then
      a Stack tile CLICKED with it selected adds nothing, 3 of 3; a Stack DRAGGED under it lands, 3 of 3. It was never a
      drop. ROOT: `insertBlock` inserts INSIDE a selection whose parent is a grid ("a grid cell"), and an Image cell
      passed — the Stack became the image's child, which an image never draws. FIXED: `paletteClickSlot` (box-model),
      only a CONTAINER cell receives inside; a leaf cell gets the block after it, as the next cell. Guard
      `tests/unit/palette-click-slot.test.ts` — 2 red with `isContainer` removed, 5 green with it. **HEADED UAT, build
      0D0EXS4f (FRESH, `.next-b` on 3200):** Light · Dark · Midnight · Purple Dream, 3 tries each, 4 windows side by side —
      12 of 12 clicked Stacks are the grid cell right after the Image (235×198px), none inside it, 0 page errors
      (screenshot `probe-l1e1-out/Midnight/try-1-clicked-stack.png`); the Preview at 375 · 768 · 1280 · 1920: no block
      inside a picture, no sideways overflow. The 7 e-1 pages re-run on this build → see L1-r6
    - `[x]` L1-6 · HARNESS: after a tile CLICK that added nothing, the error said "the canvas offered the drop… released
      at (…)" — the previous DRAG's values, never cleared. That is why e-1 was read as a drop bug for two batches. FIXED:
      `clickTile` clears them and the error says "a click on the <tile> tile added nothing" (h.js, pages.js)
    - `[x]` L1-5 · HARNESS: a page whose image filling crashed after the build left a STALE tree file (page 142's was
      from 15:36), and a failed build saved no step and no fields beyond width. FIXED (`uat-pages.js`): the tree is
      written right after the build, the failed step is kept as `failedStep`, and the whole stored page as
      `page-<n>.site.json` on a failed build
  - (c-22 = tier-99 idx 2, already in e-1.)
  - e-1 · the canvas offered the drop and added nothing — 7 pages (idx 2, 87, 142, 153, 227, 278, 385). **A REPRO, 4 of 4
    windows (S-1 UAT 2026-09-30, build Ud1omUt2):** a 3×2 grid added after the 3rd column of a row; an Image clicked with
    the grid selected lands INSIDE the grid as a 7th cell; then a Stack clicked with that image selected is offered and
    added nothing (released at 1003,620 on the grid). Not yet shown to predate space by default — check on master first
  - c-22 · a page that built in the first run fails in the re-run (nodenza partners page: drop under a block added nothing)
  - page 38 of tier 80 · could not select the 2nd of 4 card columns
  - the 19 tier-95 build failures (could-not-select ×9 · drop-offered-nothing ×7 · barely visible ×1 · click timeout ×2)
  - previewcheck B30 / P4 · the harness's drop and select steps
- `[x]` **BATCH Z-1 · Canvas zoom** — CLOSED 2026-10-01 (gate: typecheck 0 · eslint 0 errors · vitest 3,923 · test:fast 748; HEADED UAT 4 themes 21/21, narrow 12/12, 200% browser 4/4; acceptance: tier-99 page 334 BUILT 443 blocks, tier-95 page 12 BUILT 242) (area: editor navigation · 6 changes, OPENED 2026-10-01; queued 2026-09-30 after L-1 — the user's "go" on
  E0-f): the canvas is always "Fitted to screen", so a hand-sized column ~40px wide (tier-99 page 334) cannot be dropped
  into, selected or resized by anyone. Zoom in / out / back to fit — buttons beside "Fitted to screen", Ctrl + / Ctrl − /
  Ctrl 0, Ctrl + scroll — with the page scrolling in both directions while zoomed, drops, selection, resize handles and
  the marquee all correct at every zoom, canvas = Preview unchanged. Research first (RULE R: how Figma, Canva, Webflow,
  Framer zoom), plan artifact, then build; tier-99 page 334 and tier-95 page 12 (L1-4), each re-run alone, are its
  acceptance tests
  - LEDGER of Z-1:
    - `[x]` Z1-a · **a block held on screen slid while the canvas was FITTED below 100%** — MEASURED through the UI
      (`probe-z1a.js`, six windows, one per device): 72px at Desktop (82%), 180px at Wide (55%) over a 400px scroll;
      0 at 100%. ROOT: `--canvas-scroll` / `--canvas-h` / `--canvas-top` / `--holder-top` were written in SCREEN px and
      used as lengths inside the zoomed frame. FIXED (`BoxCanvas.tsx`): divided by `zoomOf(host)`, and the page box is
      observed so a device switch re-writes them. Guard `float-pin.spec.ts` "HOLDS while the canvas is FITTED" — red
      without the fix ("travelled 168px at zoom 0.43"), 11 of 11 green with it; probe after: Desktop and Wide 0px
    - `[x]` Z1-c · NOT A BUG, measured: at Mobile the held block went back into the flow (`relative`, travelled the
      whole scroll) — the deliberate phone rule `floatStacksOnMobile` (`lib/box-model.ts:633`); the probe now labels it
    - `[x]` Z1-b · **an item's selection ring and toolbar were drawn off the item while fitted** — MEASURED through the
      UI (`probe-z1b.js`, an Accordion from the palette, six windows): at Wide (55%) the ring 142px narrower and 26px
      higher than its item, the toolbar ON the item; at Desktop (83%) 81px / 15px. FIXED (`ItemCrudLayer.tsx`): rects
      divided by the canvas zoom, the side choice compares screen space with the bar's screen size. Guard
      `item-ring-zoom.spec.ts` (built through the palette): red "-26, 0, -142, -14px at zoom 0.55", green with the fix;
      in both suite lists (L1-15's lesson). Probe after: 0/0/0/0 at every device, toolbar 4–8px beside the item
    - `[x]` Z1-d · (FIXED: the item toolbar is drawn at the inverse zoom and placed in screen px — SEEN 36px bar, 28px buttons, 36px handle at 25 · 50 · 100 · 200 · 400% in all four themes; the drop line 3px at 50% and 200%) **the editor's own chrome shrinks with the canvas**: at Wide (55%) the item toolbar's buttons are
      ~15px on screen — under the 24px target of WCAG 2.5.8 — and the block handles shrink the same way (screenshot
      `probe-z1b-Wide1920px.png`). The four editors researched keep chrome a constant size on screen. A DESIGN choice
      → in the Z-1 plan for the user's approval, built with the zoom
    - Z1-a and Z1-b COMMITTED `1550371` (gate: vitest 3,915 · test:fast 741)
    - `[x]` Z1-e · MY BUILD: the zoom's listeners never attached — the builder renders a loader first, and they were
      registered once, on that render, with no canvas. Found by the first-look probe (Ctrl+scroll did nothing). FIXED:
      attached when the canvas is there (`ready`), and again after the Preview (which replaces the editor) closes.
      Guarded by every key/wheel test in `canvas-zoom.spec.ts`
    - `[x]` Z1-f · two buttons named "Zoom in" once a block was selected — mine and the Inspector's hover EFFECT of that
      name; to a screen reader, two different actions with one name. FIXED: "Zoom canvas in" / "Zoom canvas out"
    - `[x]` Z1-g · MY BUILD: Space did not pan after a device was chosen — the device button kept focus and Space pressed
      it again. FIXED: only a button INSIDE the page keeps Space; otherwise Space pans and the button is not pressed (key
      down and up). Guard `canvas-zoom.spec.ts` "Space + drag pans" (red 400 → 550 expected, green)
    - `[x]` Z1-h · MY BUILD: "pointer on the canvas" came from enter/leave events, so over a selected block's handles
      (drawn in a layer outside the canvas) Ctrl + went to the BROWSER, and over the Blocks panel (floating on the canvas)
      it zoomed the CANVAS. FIXED: the pointer's position inside the canvas's rectangle, minus any dialog/menu over it.
      Guard "the shortcuts act on the canvas only while the pointer is on it" — red on the old build at the Blocks panel
    - `[x]` Z1-j · **with a block selected, the canvas took the keys of ANY focused control outside it** (predates Z-1;
      found by the UAT: Enter on the zoom readout opened nothing): Enter on a toolbar button edited the block's words
      instead of pressing it, Delete on a focused button DELETED the selected block, arrows moved it — WCAG 2.1.1 and lost
      work for a keyboard user. FIXED (`BoxCanvas.tsx` key handler): a focused control outside the page owns its keys.
      Guard `canvas-zoom.spec.ts` "a focused toolbar control keeps its own keys" — red on the old build (no menu), green
    - `[x]` Z1-k · MY Z1-j FIX WAS TOO BROAD: it also kept ESCAPE from the page when a control outside it had focus, so
      Escape no longer stepped out a level after an Inspector button was clicked — tier-99 page 153 (built in L-1) then
      failed "could not select b-57". NARROWED: a focused control keeps only the keys it uses (Enter, Space, arrows,
      Delete, Backspace, Home, End). SEEN on build .next-b: page 153 BUILT (230 blocks), with 87 · 227 · 278 · 2 in six windows; canvas-zoom.spec 7/7 (the Z1-j guard still red-proof on Enter and Delete)
    - `[x]` Z1-m · **the toolbar became TWO ROWS (93px) on a 1536px screen — the user's own** — found by the gate
      (`builder-chrome-fits.spec.ts`): the zoom group (187px) pushed the bar ~108px past one row. FIXED: the "Hidden" and
      "Base size" words show from 1700px (they were already hidden below 1024; the controls keep their names and
      tooltips), and the guard now lists the zoom controls among those that must be on screen. Not enough alone — re-measured 19px short (left 866px, right group 681 of 662). Then: an icon-only ToolBtn is `compact` (26px, over the 24px target) and the right group's gap 8 → 6px. SEEN: one row, 56px at 1536 (group 655 of 662), builder-chrome-fits + canvas-zoom 8/8, screenshot toolbar-1536-midnight
    - `[x]` Z1-n · TEST BUG: `canvas-zoom.spec.ts` "edge dragged at 200%" failed in the full run (30% → 30%): the handle
      was grabbed where it was drawn BEFORE the zoom — the handles are re-measured a frame later, and under load the test
      read them first. FIXED: it waits until the handle sits on the block's edge — passed in the next full run (747)
    - `[x]` Z1-p · the shared `ToolBtn`'s active and hover backgrounds had `dark:` with no `midnight:`/`purple:` (rule 5) — added; SEEN: the hovered + in Midnight
    - `[x]` Z1-o · eslint 2 errors — an unused variable in each of `probe-z1.js` and `probe-z1-extra.js`. Removed
    - `[x]` Z1-l · PROCESS: vitest (the tree guard, a few seconds) was run while pages 334 and 153 were still building
      in headed windows — the standing rule, broken a second time today. 334 built; 153's failure is re-run (Z1-k)
    - `[x]` Z1-i · a recorded limit — ACCEPTED by the user 2026-10-01 ("go ahead" on the recommendation: it only affects near-empty pages) (`ponytail:` in CanvasZoom.tsx): zooming round a point holds only as far as
      the page can scroll — a page shorter than the window grows downward from its top (33px off on a one-box page; ≤1px
      on a page that scrolls, measured). Design tools add empty room round the page; added only if users miss it
  - `[x]` research — `docs/web-anatomy/editor-zoom.md` (Figma, Canva, Webflow, Framer; + Wix Studio, Penpot; sources)
  - `[x]` **PLAN APPROVED by the user 2026-10-01** ("I approve the proposal as you've written it"; decision 2: "I will
    do what you recommend" — the plain wheel scrolls; 3 and 4 CONFIRMED by the user the same hour, "also do what you
    recommend": zoom remembered per device size in this browser, switching device goes back to Fit).
    Plan: https://claude.ai/artifact/REMMiWJU5ufUgnBs7cvqZH —
    controls beside the device buttons, Ctrl +/−/0 and Shift 0/1/2, Ctrl+scroll and pinch around the pointer, Space-drag
    pan, width and zoom kept separate, constant-size chrome (Z1-d), 25–400%, kept per device in the browser. Four
    decisions: approve · plain wheel · remember the zoom · switching device. **Revised 2026-10-01 at the user's word:**
    Ctrl +/− zoom the CANVAS only while the pointer or focus is inside it; everywhere else they stay the browser's own
    zoom (WCAG 1.4.4 for the builder itself), and the builder is checked usable at 200% browser zoom
  - THE SIX CHANGES: (1) controls − / readout-menu (Fit, 50, 75, 100, 150, 200, 400%, Zoom to selection) / + beside the
    device buttons, replacing the "Fitted to screen" badge · (2) keyboard inside the canvas: Ctrl +/− step 25…400%,
    Ctrl 0 and Shift 0 → 100%, Shift 1 → Fit, Shift 2 → the selection · (3) Ctrl+scroll and pinch zoom around the
    pointer; the plain wheel scrolls · (4) the zoomed page scrolls both ways; Space+drag and middle-drag pan · (5) the
    editor's chrome keeps its screen size at every zoom (Z1-d) · (6) the zoom kept per device in this browser; a device
    switch goes back to Fit
  - **UAT CHECKLIST (written 2026-10-01, BEFORE the build).** One HEADED pass, six windows, fresh production build;
    each line in Light · Dark · Midnight · Purple Dream, and at the devices it names:
    SEEN 2026-10-01 — HEADED UAT, six windows, build YfVTIQqT (`.next-c`, FRESH): `probe-z1.js` in Light · Dark · Midnight ·
    Purple Dream, 21 of 21 each (the first two runs' failures were all the probe's own — pan tolerance, the Blocks panel
    shut before a drop, a click left of a 2,292px item at 400% — except Z1-j, a real bug, fixed); `--case=narrow` 12/12;
    `--case=browser200` 4/4; `probe-z1-extra.js`; `canvas-zoom.spec.ts` 7/7 (HEADLESS GATE):
    - `[x]` (1) readout "Fit · 55%" → menu by keyboard (Enter opens it once Z1-j was fixed; Escape closes) → 150% chosen;
      + stops at 400% and − at 25% (disabled); names "Zoom canvas in/out", "Canvas zoom, …"; readout contrast 16.1 · 15.2 ·
      17.5 · 15.4 : 1; at 375 · 768 · 1280 the controls sit inside the window, no sideways scroll (screenshot narrow-375)
    - `[x]` (2) on the canvas Ctrl+ / Ctrl− / Ctrl 0 / Shift 1 → 200 · 150 · 100% · Fit; over the Inspector and over the
      Blocks panel the canvas did not change; over a selected block's handle it zooms (Z1-h); Shift 1 typed in a text block
      typed "!" and nothing zoomed; Shift 2 → 262% on the selected heading
    - `[x]` (3) Ctrl+scroll: the point under the pointer moved 0 and 1px (≤2 on a page that can scroll — Z1-i for a short
      one); the plain wheel scrolls; a two-finger pinch on a 1024×768 touch tablet 100% → 300%
    - `[x]` (4) at 400% all four page edges reachable (68 · 32 · 53 · 391px clear); Space+drag 101/82 for 100/80; middle-drag
      48 for 50; a space typed in a text block is a space (" zz")
    - `[x]` (5) item toolbar 36px, its buttons 28px, the resize handle 36px at 25 · 50 · 100 · 200 · 400% (were 15px
      buttons at 55%, Z1-d); the drop line 3px thick at 50% and at 200%. The block's floating toolbar is drawn in the same
      page-level layer as the handles (BoxCanvas portal), outside the zoom
    - `[x]` (6) Wide kept 150% after a reload, Mobile opened at Fit; the saved site holds no zoom (3,832–3,853 chars); the
      Preview has 0 elements with a CSS zoom
    - `[x]` (7) a block dropped into a stack landed at 50 · 100 · 200 · 400%, 4 of 4 in every theme; an edge dragged 120px
      at 200% stored the same width as 60px at 100% (within 0.5%), Ctrl+Z undid it in one step; a held block held at 200%
      (0px over 400px); the item ring on its item (Z1-b, item-ring-zoom.spec)
    - `[x]` (8) the Preview opened while zoomed: nothing in it zoomed; after closing it Ctrl 0 still worked (Z1-e)
    - `[x]` (9) 200% BROWSER zoom (760×450 CSS at 2×): the zoom controls inside the window, no sideways scroll, the Blocks
      panel opens 320×292 (screenshot browser200)
    - `[x]` ACCEPTANCE: tier-99 page 334 BUILT (443 blocks) and tier-95 page 12 BUILT (242 blocks), the harness zooming
      in to reach a thin column as a person would (`reach` in h.js, centring it both ways). Their errors are queued
      classes only: HOLE and broken words (L-4), canvas≠Preview at Wide (L-2). Regression: 2 · 87 · 142 · 153 · 227 ·
      278 · 337 · 385 · 109 all BUILT
- `[ ]` **BATCH L-2 · Tier-99: the editor and the Preview disagree** (area: canvas = Preview · 4 changes, queued)
  - e-4 · canvas≠Preview — 13 pages: headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other
    heights, 4 containers 122–198px shorter at Wide (idx 109, 141 carry most). **A clean repro, built through the UI
    (E-0, 2026-09-30):** `probe-e0b.js --w=1920` — the burger header's hugged menu is 419.3px on BOTH sides, yet the
    zoomed canvas measures the link words a few px wider and wraps "Contact" (menu 79 vs 63px tall); page 145 at Wide
  - e-8 · a component 20–24px taller in the Preview — 2 pages (idx 209 and one more)
  - e-10 · one block 28px taller in the Preview — 1 page (idx 272)
  - #144 · the canvas copy of fixed blocks — checked in WebKit and Firefox before it is removed
- `[ ]` **BATCH L-3 · Tier-99: React error #185 and the tablet line** (area: engine rules · 3 changes, queued)
  - e-5 · React #185 (maximum update depth) — 9 pages
  - e-6 · four columns on one line at Tablet — 8 pages, 142 findings (= c-11)
  - c-11c (decided B) · an icon cell does not count for the tablet rule
- `[ ]` **BATCH L-4 · The decided layout changes** (area: rows and grids · 6 changes, queued)
  - c-7 (decided B) / e-9 · a column nobody sized takes what is left of the line — the HOLE at the end of a line, 2 pages
  - c-8 (decided B) / e-7 / #127b · words broken across lines ("1,000+" in 165px Stat columns) — 4 pages, 58 findings
  - c-21 (decided B) · edge handles no longer cover the last letter of a block that hugs its words
  - grid picker (decided B) · any count of columns up to 12, not only 1 · 2 · 3 · 4 · 6 · 12
- `[ ]` **BATCH L-5 · Resize round trips** (area: resize · 5 changes, queued)
  - #42 · a Stats row's height does not come back after a top/bottom round trip
  - #46 · the side-by-side-resize spec failing 14 tests on Tablet and Phone — re-run and fix
  - #82b · #83 · width round trips drift at 1366
  - #84 · the left-edge resize uses a fixed 14rem neighbour floor
- `[ ]` **BATCH L-6 · Africa-first measurements and the innovative pages** (area: harness · 3 changes, queued)
  - page-weight audit in every page report (≤ 100 KB compressed, ≤ 500 KB first view at 360px, images sized and lazy,
    ≤ 2 font families) · Slow-3G profile (first band within 5 s) · the innovative plan (19 pages)
- `[ ]` **BATCH D-1 · A README a newcomer can start from** (area: documentation · 1 change, queued — asked by the user
  2026-09-30): the root `README.md` is still the create-next-app template. Replace it with how to install and run each
  app (web 3000, admin 3001, mobile), the project structure, how to test (vitest, test:fast, the UAT scripts, the
  production build on 3100), where the rules (`CLAUDE.md`), the task tree and the guide live. Short; links out
- `[ ]` **BATCH L-7 · Task 2: the wrapper dissolve** (area: layout wrappers · 1 change, queued 2026-10-01 — the user: "go
  with your recommendation") — tree 1.1.2: a band holding ONE block inside a column is dissolved; a band with a
  background, height or edge-to-edge setting is kept; a block directly in a stretched column must still shrink (V4 in
  `resize-leaves-no-gap.spec.ts`, which reverted the first attempt). On a FRESH branch `builder/layout-2` cut from
  `master` after L-1 … L-6 and D-1 are merged (rule 9: this branch is already long)
- `[ ]` **BATCH L-8 · Task 3: outer-edge space in a column** (area: resize · 1 change, queued 2026-10-01) — tree 1.1.3:
  when the parent is a COLUMN, shrinking a block opens a space at its outer edge that sticks. Branch `builder/layout-2`
- `[ ]` **BATCH L-9 · Task 4: the parity spec covers every arrangement** (area: canvas = Preview · 1 change, queued
  2026-10-01) — tree 1.1.4: `parity-every-arrangement.spec.ts` extended to grid cells, components, sticky, floating and
  fixed (neighbours of a floating/fixed block do not move), at every breakpoint. Branch `builder/layout-2`
- `[ ]` **ORDER, DECIDED by the user 2026-10-01:** L-1 … L-6 and D-1 on this branch → pull request to `master` → fresh
  branch `builder/layout-2` → L-7, L-8, L-9 → THEN the whole-tier re-sweep and the layout story (RULE L) ONCE, over all
  of it, so neither is done twice
- `[ ]` **Then, in order (after L-9):** the whole tier swept again (spacing changes every page) → the story and the published
  artifacts → the full gate → pull request to `master` → the original queue (1.2)

---

## 1 · Website builder (current focus — first product to release)

### 1.1 · The four tasks (the user's handoff note, 2026-09-26) — see memory `project_four_tasks.md`

- `[>]` **1.1.1 · TASK 1 — the layout** (grew from "width round trips"; branch `builder/layout-uat`)
  - `[x]` Width round trips in stored percentages — `2de0ef2`
  - `[x]` Semantic pages, real-screen editing, resize that comes home — `5345e80`
  - `[x]` Link blocks, band colour schemes, dressed pages (RULE E) — `c3e99cf`
  - `[x]` The four layout decisions 1D · 2A · 3A · 4A — `919d731`
  - `[x]` **Tier 80 dressed sweep** — 70 pages, fixes in `67f7f64`
    - `[ ]` page 38 "could not select" the 2nd of 4 card columns (same class as 1.1.1.c-11 below)
  - `[>]` **Tier 95 dressed sweep** — 135 pages swept, fixes in `919d731`
    - `[ ]` The 19 build failures re-run (could-not-select ×9 · drop-offered-nothing ×7 · barely visible ×1 · click
      timeout ×2) — same classes as tier 99, fixed there first
  - `[>]` **Tier 99 dressed sweep** — 403 pages in 688 min, 52 could not be built, 17 clean (2026-09-29)
    - `[x]` a · The log copied out of Temp → `scripts/uat/logs/sweep99.log`; baseline results kept in
      `scripts/uat/dressed99-baseline-out`
    - `[x]` b · Uncommitted work secured — gate green, `bc89d68` pushed
    - `[>]` c · **Triage and fix, class by class (the bug ledger of this sweep)** — counts are pages affected
      - `[x]` c-1 · **Icon taller in the Preview than on the canvas** (#143) — 185 pages, +18px phone … +6px wide.
        ROOT CAUSE: `isEmptyBox` counted a block that draws its own content (Icon, List, Divider) as an empty box, so
        it got the 2.5rem floor; the canvas then discarded the floor's height and the export kept it (7 of 11 block
        types disagreed). Fixed in `isEmptyBox` + `childStyle` + the canvas wrapper; guard enumerates every block type,
        mutation-proven ×3. HEADED UAT probe-t7 on build DM9hSozR: identical at all five rungs; sweep pages 21, 139, 86,
        63, 10 re-run headed: 5 errors → 0 each
      - `[x]` c-2 · **List shorter in the Preview** (#135) — 145 pages, −8 … −17px. Root cause: the canvas spaced its
        items, the export did not. Fixed with one shared `LIST_ITEM_GAP`, guard mutation-proven. HEADED UAT probe-t7 on
        build DM9hSozR: identical at all five rungs (80.4 · 82.6 · 84.9 · 95.7 · 117.6px); same five pages at 0 errors
      - `[ ]` c-3 · **Heading / text wraps differently in the Preview** — 77 pages at Tablet 768 (+33 / +50px), 28 at
        Desktop. #137 (page as a size container) is in `bc89d68`. Pages 139, 63, 10 carried it and are at 0 errors on
        the fresh build; the full re-run (d) closes it or reopens it
      - `[x]` c-4 · **Build failed: could not select a column** — 36 pages (incl. page 199). HARNESS. Measured on all 36:
        the click selected an ANCESTOR every time (its grid ×21, a stack ×13, nothing ×2). Logged click by click on
        pages 298, 37, 122: each click goes one box deeper, the column is SEVEN boxes down on a sidebar page, and the
        harness stopped at six. It clicks until it is there now (up to 16). Pages 298, 37, 122, 199, 266, 185 re-run
        headed: all six build, all six at 0 errors
        - `[x]` the harness's "come back" misfired once it existed: dragging back cannot restore a row whose neighbour
          dropped (page 33: a cell left 41px wide). It UNDOES the drag and tries one step less now
      - `[x]` c-5 · **Build failed: the canvas offered the drop and added nothing** — 15 pages (9 "under", 6 "into"),
        every one right after the hero. Screenshot p33-build-fail.png read: the first section's heading and text sit
        under it (the section has no background of its own, so it reads as one band with the header). The tree is right;
        the drop under the text was offered and added nothing. The selected heading's floating toolbar sits over that
        text. CONFIRMED through the UI (probe-t9): released on the toolbar, nothing is added (3 of 3); beside it, the
        block is (2 of 2). FIXED: while anything is dragged over the window the selection chrome lets the pointer
        through (`body[data-box-drag-in]`). Browser guard with a REAL pointer drag onto every control of the toolbar,
        red on the old build; HEADED UAT probe-t9 on build TylJ2DR6: 5 of 5 added, screenshot read.
        - `[x]` pages 219 and 249 failed for a SECOND cause, the harness's: they ask for a grid of 5 across and the
          picker offers 1 · 2 · 3 · 4 · 6 · 12 — it found no square, clicked nothing, and the picker sat open. It takes
          the next size up and deletes a cell now, and says so under GAPS. Pages 33, 163, 219, 249 re-run headed: all
          four BUILD; 33 and 163 at 0 errors, 219 and 249 at 1 each (canvas≠Preview at Wide, to look at)
        - `[?]` GAP, the user's decision: **a grid of five across cannot be chosen** (nor 5, 7, 8… — only what
          twelve divides into). A leave, take six and delete one · B let the picker offer any count up to 12 (a grid
          already stores its own column count)
          - `[ ]` **DECIDED by the user 2026-09-29: B** — the picker offers any count up to 12. Before building: drive
            how a cell resizes on a count twelve does not divide into (5, 7, 8, 9, 10, 11). Not started
      - `[x]` c-20 · **The toolbar kept the side it chose when the block was selected** — dock the blocks panel and the
        page is refitted to 77%, the block moves to within 36px of the top, and the bar stayed ABOVE it, over the top
        edge of the page. It re-measures on `transitionend` now. Browser guard, red on the old build, green on TylJ2DR6
      - `[?]` c-21 · **The right-edge handle covers the last letter of a selected block that hugs its words** ("What we
        offe", probe-t9 screenshots). The handles are centred ON the edge, so half of each lies inside the block. The
        user's decision — it moves every handle: A leave · B draw the edge handles outside the block · C fade a handle
        that lies over words. Recommended: B
        - `[ ]` **DECIDED by the user 2026-09-29: B** — the edge handles are drawn outside the block. The UAT drives a
          block flush against the page edge, where a handle has no room outside. Not started
      - `[ ]` c-6 · **Build failed: timeout** — 1 page (+2 click timeouts that also could not select)
        - READ ONLY, 2026-09-29. idx 38 (altamedfoundation.org/help_campaign): `scrollIntoViewIfNeeded` timed out
          after 10 s waiting for a palette tile, 209 blocks built; its screenshot shows the blocks panel CLOSED.
          INFERRED: a harness step closed the panel and did not reopen it — which step is not recorded (`__step` is
          not saved in the report; that is a gap in the harness to close). idx 234 and 327: "could not select", then a
          click timeout AFTER the build had failed (most likely the Upload click on a card squeezed to 45px) — the
          class c-4 fixed. No sign of the app hanging. The re-run says whether the three still fail
      - `[x]` c-7 · **HOLE at the end of a line at canvas Wide 1920** — 29 pages, 44 findings. Every such row stores
        widths summing over 100% (50 + 25 + 33.34). MEASURED (page 101 with step logging, probe-t8 --row --main=62):
        three columns need 3 × 14rem = 672px; in a 668px main column the third had ALREADY dropped to the next line when
        the dresser sized the first two. Dragging itself is sound — every probe on one line stores 100%.
        - `[x]` HARNESS: `sizeColumns` checks the whole line; a row that is not on one line is sized at the Desktop
          (then Wide) screen size, as a person would, and the count is in the report (`SIZING:`); a row no screen size
          holds on one line is left as dropped and listed under `GAPS`. Pages 6, 74, 101, 186, 36 re-run headed: 0 errors
        - `[x]` page 64 had c-8's cause (a Quote in a 111px column); 0 errors after the dresser's width-first change
        - `[?]` ENGINE, the user's decision: a person who DOES size two columns while the third is on the next line
          gets 50 + 25 + 33.34, and a hole on every wider screen. A keep as is (the size you drag is the size you get,
          and an unsized column keeps the share it was dropped with) · B a column nobody has sized by hand takes what
          is left of its line · C the editor warns when a line adds up to more than 100%. Recommended: B
          - `[ ]` **DECIDED by the user 2026-09-29: B** — a column nobody has sized by hand takes what is left of its
            line; under its floor it drops to the next line as today. Not started
      - `[ ]` c-8 · **Words broken across lines in the Preview** — 23 pages, 905 instances, column width median 77px.
        Text placed in a column narrower than its longest word ("1,000+", "everything", "description"). Measured:
        a Card in a grid cell 2 columns of 12 wide, inside a 70% main column (119px). Two halves:
        - `[x]` HARNESS: the dresser picked a column's content by its SHARE (< 12% → an Icon); it picks by the WIDTH the
          column has at 900px now (`fitTile`: under 6rem an Icon, under 150px words instead of a Card / Quote / Stat),
          and sets the section's width BEFORE filling it. Pages 148, 150, 159 re-run headed: 40, 18, 32 errors → 0.
          After the width-first change page 64 is at 0 errors; page 211 still breaks "1,000+" in a Stat at 900px
          (120px columns; the estimate said 150): the floor is 190px now, carrying that fifth. Page 211 re-run: 0 errors
        - `[?]` ENGINE, the user's decision: what a grid does when words are put in a cell narrower than the longest
          word — A break the word (today) · B narrow the grid by its narrowest cell that holds words · C leave it
          and have the Page check say so. (A row column is already never narrower than its longest word.)
          - `[ ]` **DECIDED by the user 2026-09-29: B** — the grid narrows by its narrowest cell that holds words;
            breaking the word stays as the last resort when one column cannot hold it. The largest of the decisions:
            read how the grid narrows by its own box before choosing how. Not started
      - `[x]` c-9 · **Image runs off the page by 1px** (#142) — 12 pages at 600–899px. Right edge lands at 769 on a
        768 page: decision 1D's −0.0625rem slack on the last column (1px, 1.5px at 150% text) plus sub-pixel rounding.
        The page does not scroll sideways (L1 is clean on all 12). NOT A BUG in the engine (measured: 1–2px on every one
        of the 12); the audit allows the slack + half a pixel now. Pages 24 and 290 re-run headed: 0 errors
      - `[x]` c-10 · **150% text: an Icon spills out of a 50–55px column and overlaps** — 9 pages spill, 5 overlap.
        Same root as c-1 (the floor's 2.5rem minimum width is 60px at 150%). Pages 119, 285, 378, 328, 254 re-run
        headed: no spill and no overlap left
      - `[ ]` c-11 · **Tablet: 4 columns on one line** (L6, #78) — 3 pages
        - READ ONLY, 2026-09-29 (the sweep was running; nothing driven yet). Pages idx 223 (5 rows), 359 (2 rows),
          382 (1 row, only at 800–876). MEASURED from the baseline trees: all 8 flagged rows store widths that add up
          to 100.01 – 100.19% (70.04 · 9.99 · 10.14 · 10.02); of 984 rows of four or more, the 965 that add up to
          100.001 or less are all clean, and the 8 are among the 19 that add up to more
        - `[ ]` c-11a · ENGINE, MEASURED in the file: `packRowLines` (`lib/box-model.ts` 4328) starts a new line at
          `> 100.001`, while its own comment (4306) says "percentages that round to 100.4 are meant to be a full
          line". INFERRED, to be driven: the stored packing says 3 + 1, so `tabletPlaces` finds no line of four and
          the #78 rule is skipped, while the browser draws all four on one line. Guard first:
          `packRowLines([70.04, 9.99, 10.14, 10.02])`, red before the fix; then HEADED UAT at 768 reading each
          column's computed `flex` and `margin-right`
        - `[ ]` c-11b · **Rows that store more than 100%** — 19 in the baseline, against "every probe on one line
          stores 100%" (c-7). Count them in the re-run's trees; if they are still there, find whether the drag or the
          dresser writes them, through the UI
        - `[?]` c-11c · The user's decision: **does a cell holding one icon count as a column for the tablet rule?**
          On all three pages the three narrow "columns" are single-icon cells of 8–10% beside the words (a table of
          ticks). A yes, four is four (today's check) · B a line of four is rearranged only when at least two of them
          hold words or a card. Asked, not assumed
          - `[ ]` **DECIDED by the user 2026-09-29: B** — a line of four is rearranged on a tablet only when at least
            two of its cells hold words or a card; a cell holding one icon does not count. The engine (`tabletPlaces`)
            and the audit's L6 check take the SAME rule, in the same change. Not started
      - `[ ]` c-12 · **React error #185** (max update depth, #134) — 2 pages (idx 34, 43)
        - READ ONLY, 2026-09-29. MEASURED: idx 34 is 522 blocks, idx 43 is 156; the editor survived and both audits
          finished; the two share nothing the other 401 lack (7 pages of the same recipe ran clean); the same error
          is in tier 95 (page 0) and tier 80 (page 26) on other recipes — so timing, not structure. No stack, step or
          screen size was recorded
        - INFERRED from the React 19.2 source and the code path, NOT reproduced: every keystroke is a synchronous
          commit of the whole site (`SectionKit.tsx` 49 → `BoxCanvas.tsx` 3323 → `commit` in `box-demo/page.tsx`
          260) followed by a save of the whole site to localStorage (230–242); the harness types 150 characters with
          no delay; more than 50 such commits while another update waits (the handles' next measurement, the scroll
          re-measure) and React throws #185 in the next `setState`. None of the canvas's measuring loops can reach it
          alone (default priority, frame budget)
        - `[ ]` c-12a · Reproduce through the UI (a long page, type 3 × 150 characters, repeated), full stack kept;
          guard red first: a `pageerror` matching #185 fails the spec
        - `[ ]` c-12b · **Typing re-renders and saves the whole site on every key** — beyond the error, this is what
          a teacher on a low-cost phone feels as lag on a long page (RULE AF). To be MEASURED (time per keystroke at
          150 and 520 blocks) before anything is changed. The fix changes what one Undo takes back while typing, so
          the user is asked first
        - `[ ]` c-12c · HARNESS: a page error keeps only its first line (`h.js` 11) and is attached once at the end
          (`uat-pages.js` 184), so neither the stack nor the step is known — same gap as c-6. After the sweep
      - `[x]` c-15 · **Selection handles stay at the previous screen size** — the page frame changes width by a 300ms
        transition with no render, so the handles were never re-measured (97…1107 around a block at 415…790). The
        mirror now follows `transitionrun` / `transitionend` of anything that holds the block. Guard in
        `chrome-follows-resize.spec.ts` (8 changes of size in a row): red on the old build (225px off), green on
        fxuGzvaE. HEADED UAT probe-t8, canvas-768 and canvas-375 read: handles on the block
      - `[x]` c-16 · NOT A BUG — the two purple bars in Preview are the Preview's OWN width grips
        (`app/website/box-demo/page.tsx` 992–998: `h-10 w-1.5 rounded-full bg-indigo-500/70`), and the canvas with
        its selection chrome is unmounted while Preview is open (`if (preview) return …`)
      - `[x]` c-17 · **A narrowed grid had a row more in the editor than on the page** — the editor's "Add a block
        here" offer took a cell of its own (Tablet: 3 rows of 116px drawn, 2 of 174px published). THREE causes, each
        found by re-running: (1) the offer ignored a grid narrowed by its OWN BOX → hidden inside the container query;
        (2) it counted `used % track`, as if cells packed tightly → `gridLeftoverAt` walks the rows; (3) it counted
        unstretched spans → counts `gridSpanAt`, the spans drawn. Unit guard (10 arrangements × rungs) and browser guard
        (1·3·8, 1·11, 11·1 × 4 sizes), each red before its fix. HEADED UAT probe-t8 on build hQOBKlr1: identical at all
        five rungs; sweep pages 285, 119, 378, 328 re-run headed: 0 errors
      - `[x]` c-19 · HARNESS: **the dresser drags past what the neighbour can give, then clicks the editor's offer.**
        In a narrow grid one column is under the 3rem hand floor, so the neighbour keeps its 6 columns and drops a row
        (stored 11 + 6, page 254); the free half-row offers "Add a block here" under the pointer and the next click
        meant to SELECT adds an empty cell (7 of 777 grids in the baseline). `sizeColumns` now looks, and brings the
        edge back until the neighbour is beside it again (counted per page as `cameBack`); `select` moves the pointer
        first and never clicks the offer. Page 254 re-run headed: 0 errors, the dresser came back 6 times, no stray
        cell in any of 13 grids
      - `[x]` c-18 · HARNESS: the sweep compared a 720px editor window with a 900px Preview window, so a row beside
        a sticky sidebar (one screen tall by design, `100dvh`) read as canvas≠Preview on every block (page 141).
        The rungs are compared in windows of the same height now; page 141 re-run headed: 4 errors → 0
      - `[x]` c-13 · Sweep header said "tier ≤ 80%" on a tier-99 run — names the plan now (`uat-pages.js`)
      - `[x]` c-14 · Two unit guards were wrong about what ships (base budget counted comments; scaffolding guard
        forbade the page's own size container) — both measure the shipped sheet now, mutation-proven, `bc89d68`
    - `[>]` d · **The whole tier re-run on the fixed build** — 39 affected pages re-run headed first, 35 of them at 0
      errors. The full run (403 pages, about 11.5 hours, no tokens spent) was STARTED 2026-09-29 on build wg5lR_xU:
      log `scripts/uat/logs/sweep99-rerun.log`, results `scripts/uat/dressed99-out`, the first run kept in
      `scripts/uat/dressed99-baseline-out`. **DO NOT edit `scripts/uat/*.js` while it runs.** When the log ends with
      "403 pages in N min": `node scripts/uat/triage.js scripts/uat/dressed99-out` and
      `node scripts/uat/triage-r11.js scripts/uat/dressed99-out`, compare with the baseline (17 clean, 52 not built),
      and put every class into this ledger — DONE 2026-09-30, see below
      - RE-STARTED 2026-09-29 11:05 (sweep pid 18896, server pid 8384 on 3100, six windows). Read at 11:09 by
        session 6c14c5c8: alive, 1 of 403 logged
      - `[x]` **FINISHED 2026-09-30 03:1x — 403 pages in 957 min.** Page 402 hung 45 min, was stopped and re-run alone
        (15 min, built, 0 errors). Every page a HEADED UAT on build wg5lR_xU (checked FRESH). Triage in
        `scripts/uat/logs/triage99-rerun.txt` and `triage99-rerun-r11.txt`. **Against the baseline:** clean 17 → **356**
        · built and audited 351 → **382** · not built 52 → **21** · pages with 0 errors **373**
      - The classes of the re-run, 80/20 (pages affected):
        - `[ ]` e-1 · not built: **the canvas offered the drop and added nothing** — 7 (idx 2, 87, 142, 153, 227, 278,
          385): "into" ×4, "under" ×2, "beside" ×1. = c-22, now 7 pages
        - `[ ]` e-2 · not built: **scroll / click timeouts** — 9 (idx 393, 396–401 scroll; 68, 145, 400 click). Six of
          the scroll timeouts are the LAST pages of the night, in a row — INFERRED the machine, not the page (screen
          lock or load); re-run them in PARALLEL, and only a page that fails there alone (RULE Z). = c-6
        - `[ ]` e-3 · not built: **the drag never reached the canvas, twice** — 4 (idx 23, 334, 335, 337; three in a
          row) · and 1 "cannot drop into m-2a: only 0px visible" (idx 336). Same clustering: re-run in PARALLEL, a failure there alone (RULE Z)
        - `[ ]` e-4 · **canvas≠Preview (R11)** — 13 pages, 37 findings, every screen size; 6 pages carry most of it
          (idx 109, 141): headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other heights
          (−24 … +10px); 4 containers 122–198px shorter at Wide. = c-3, reopened
        - `[ ]` e-5 · **React #185** — 9 pages (was 2). = c-12
        - `[ ]` e-6 · **Tablet: 4 columns on one line** — 8 pages, 142 findings (was 3). = c-11
        - `[ ]` e-7 · **Words broken across lines** — 4 pages, 58 ("1,000+" in 165px Stat columns). = c-8 (decided B)
        - `[ ]` e-8 · canvas≠Preview on a component 20–24px taller in the Preview — 2 pages (idx 209 and one more)
        - `[ ]` e-9 · HOLE at the end of a line — 2 pages (idx 210 at Wide 228px; one at Mobile). = c-7 (decided B)
        - `[ ]` e-10 · canvas≠Preview on one block 28px taller — 1 page (idx 272)
        - `[ ]` **Re-run e-2 and e-3** — in PARALLEL; only a page that fails there is re-run alone (RULE Z, the user 2026-09-30) (idx 23, 68, 145, 334–337, 393, 396–401) on a FRESH build —
          a failure that goes away alone was the machine, one that stays is a bug — STOPPED by the user at 3 of 14, the rest
          moved to BATCH E-0 (top of this file). **YOU ARE HERE is BATCH L-1** (S-1, S-2 and E-0 closed 2026-09-30)
        - NOT A BUG, expected: 379 pages warn "things need the user's words" (the dressed placeholders' empty text)
      - `[ ]` c-22 · **A page that BUILT in the baseline does not build on the fixed build** — the first page logged
        (nodenza.com/partners_ross_morton): baseline 182 blocks, 2 errors; re-run BUILD FAILED at 80 blocks, "the canvas
        offered the drop and added nothing (after: under(2-2h,tack))", released at (422,646) on a `<span>` in block
        2-2h. c-5's signature, but NOT on the toolbar. One page so far: a regression from c-5 / c-20, or a race — the
        finished run gives the count; then reproduced through the UI before it is called either
  - `[ ]` **SPACE BY DEFAULT — words never touch an edge** (the user, 2026-09-29: "I hope you are considering the margin
    and padding… some tests are very close to the edge… the user can override, but it is already considered")
    - MEASURED 2026-09-29: it was NOT considered. CLAUDE.md rule 3 says "Spacing is a decision, never a default"
      (`gap: 0`, `padding: 0`); a new section is edge to edge; the page audit has no check for words near an edge or
      for space between sections; design-foundation Rule #7 (96–192px between sections, ~24px within a group, a
      16px scale, pp. 185–196) is written down and not enforced
    - `[>]` BDD scenarios DRAFTED 2026-09-29 while the sweep runs (the user chose "A": read c-11, c-12, c-6 and
      draft this; nothing built or run): `tests/features/components/website/box-builder-spacing.feature`, uncommitted.
      The default VALUES and the saved-pages scenario wait on the user
    - `[?]` The user's decision: **the default values** — proposed from the tokens and deck Rule #7: side gutter
      1rem → 2rem · section space 2rem → 4rem a side (64 → 128px between two sections) · stack gap 1rem · column gap
      1.5rem · inner padding of a coloured or bordered box 1.5rem, 1rem in a narrow box
      - `[x]` **DECIDED by the user 2026-09-29: as proposed** ("I will go with your recommendation. For all of it.")
    - `[>]` Rule 3 REWRITTEN in CLAUDE.md 2026-09-29, at the user's word ("it should be for every element in every
      component and everything added on the layout… you should have added it as a rule"), with three lines in
      `tests/unit/claude-md-rules.test.ts`. NOT YET RUN — vitest waits for the sweep. Uncommitted
      - `[ ]` The old wording is still in: `GallerySetupMenu.tsx` 62 · `lib/box-presets.ts` 200 ·
        `box-builder-layout.feature` 347 · `tests/e2e/text-is-reachable.spec.ts` 34 (a guard that asserts a heading
        FLUSH against its box by default — it changes with the engine) · design-foundation `02` line 485 · memory
        `feedback_radius_and_spacing.md`. Each corrected in the same change as the engine
    - The user, 2026-09-29, watching the sweep: **"for the logo and the link at the very top it doesn't seem like the
      margin or padding is being considered"**. TRUE, and expected on this build: the sweep runs the build from
      BEFORE space by default, where a header is created with `padding: 0`. The header scenario is in the feature
      file; the whole tier is swept again after the engine change
    - `[ ]` c-23 · **A plain element cannot be given inner spacing.** MEASURED in the file: `BoxInspector.tsx` 1139
      offers "Inner spacing" only to a container or a component; a Heading, Text, Link, Button, Image or Icon gets
      outer spacing only (1140). Against the rule as the user states it (every element). To be confirmed through the
      UI, block by block, then fixed with the enumerated guard
    - `[ ]` c-24 · **The bulk inspector shows 1.5rem of inner spacing for blocks that have none.** MEASURED in the
      file: `BulkInspector.tsx` 62–63 falls back to `padding ?? 24` while blocks are created with 0 / unset. To be
      confirmed through the UI (select two blocks, read the slider, measure the blocks)
    - `[ ]` **Components breathe too** (the user 2026-09-30: "spacing within components by default… the text, the
      edges breathe… natural and slick"): a gap between a component's parts and inner padding from its own edge, from
      the same tokens, overridable to 0; measured across the whole catalogue in a browser, guard enumerates it. A
      component with no visible edge gets the gaps but no outer padding (told to the user; theirs to overrule)
    - `[x]` **DECIDED by the user 2026-09-30:** (1) a box with NO background and NO border keeps 0 inner padding — its
      edge cannot be seen, words line up, nested boxes do not narrow; it gets padding the moment it gets an edge ·
      (2) the page header and footer are BARS: 1rem above and below, the 2rem gutter at the sides (not 4rem) · (3) the
      phone gutter stays as built (~22px at 360, fluid through --box-u; 16px was offered) — confirmed 2026-09-30 · (4) the
      SECTION SPACE above and below is **1rem**, not 4rem ("the heading is too far from the top… 2rem is too much")
    - `[>]` Engine, from the spacing tokens (rem + cqw), in BOTH engines by one emitter — WRITTEN 2026-09-30, not yet
      tested: new blocks carry `spaced`; unset spacing reads `spaceDefaults` (`lib/box-model.ts`); `sectionContent`
      decides the gutter/section space the same way in the canvas and the export; `leafPaddingCSS` gives a plain
      element inner spacing (c-23); the inspector shows "Default · size" and "Back to default"; the bulk inspector reads
      the real padding (c-24). Typecheck 0: a side gutter for every
      section's content even when its background runs edge to edge (only pictures and backgrounds bleed) · space
      above and below a section · a gap between the blocks of a stack and the columns of a row · inner padding for
      any box that has a background or a border
    - `[ ]` Audit: two new checks on every page at every size — words within N px of the page edge or of the edge
      of the coloured box they sit in · space between sections under the floor
    - `[ ]` The dresser stops compensating (it sets "Centred column" to get an inset) once the default exists
    - `[ ]` Story and guide; then THE WHOLE TIER IS SWEPT AGAIN — every page's geometry changes
    - `[?]` The user's decision: pages already saved keep their spacing (defaults for NEW blocks only — recommended),
      or take the new defaults too?
      - `[x]` **DECIDED by the user 2026-09-29: saved pages KEEP their spacing**; the defaults are for new blocks
  - `[ ]` **RULE AF harness additions** (promised 2026-09-28)
    - `[ ]` Page-weight audit in every page report (HTML+CSS+JS ≤ 100 KB compressed · first view ≤ 500 KB at 360px ·
      images sized and lazy · ≤ 2 font families)
    - `[ ]` Slow-3G profile in the sweep and in `test:fast` (first band within 5 s)
  - `[ ]` **The innovative plan** — `--plan=dressedinnovative`, 19 pages
  - `[ ]` **Open engine lines carried from earlier sessions**
    - `[ ]` #144 `capturesFixed` / `fixedBlockedBy` still assume a size container captures a fixed block (false in
      Chromium 145; check Safari 16 before removing the canvas mirror). The user 2026-09-30: do NOT wait for a Mac —
      check it in Playwright's **WebKit** (Safari's engine, runs on Windows) now, and add WebKit and Firefox to the
      browser checks; a real Safari 16 only if WebKit and Chromium disagree
    - `[ ]` #127b the stat number "1,000+" breaks in a 10% column (joins c-8)
    - `[ ]` #82b · #83 (1366 width round trips drift) · #84 (left-edge resize uses a fixed 14rem neighbour floor)
    - `[ ]` previewcheck B30 / P4 (harness: drop / select)
    - `[ ]` **#42 · a Stats row's height does not come back after a top/bottom round trip** — drag a Stat's top or
      bottom edge out and back and the row stays taller. Suspected a stale `alignSelf`/`minHeight` stretch; never
      diagnosed. Re-check through the UI; fix at the root with a guard (joins the round-trip family, #82b · #83)
    - `[ ]` **#46 · the side-by-side-resize spec failed 14 tests on the Tablet and Phone Playwright projects** — marked
      "pre-existing" (the phone half was fixed as #48), left as "re-run after the matrix", never re-run. Re-run it
    - WHY THEY WERE LOST (found 2026-09-30 in the transcript of session c7a3c172, 2026-09-26): both were written only in
      replies and handovers, then carried forward as bare numbers until nobody knew what they meant. **From now on a
      ledger line in this tree always carries its one-line description, never a number alone.** Asked by the user:
      "why you got missed? We need to add it to our tree"
    - `[~]` the slide-image check (Sonnet) — named in the 2026-09-28 handover, status unknown. PARKED by the user
      2026-09-30: it belongs to the components, which are rebuilt one by one (1.3); the placeholder stands until then
  - `[ ]` **Story additions** in `docs/guide/layout-story.md` for everything above (RULE L)
  - `[ ]` Artifacts and guide updated in the same change (Builder Hub · Layout System · Parity Audit · Semantic plan ·
    `docs/guide/website-builder.md`)
  - `[ ]` Gate → commit → **pull request to `master`** → delete the branch (rule 9)
- `[ ]` **1.1.2 – 1.1.4 are BATCHES L-7 · L-8 · L-9** (BATCHES, decided 2026-10-01: before the re-sweep and the story)
- `[ ]` **1.1.2 · TASK 2 — put the wrapper dissolve back.** A band holding ONE block inside a column is dissolved; a
  band with a background, height or edge-to-edge setting is kept. Built once and reverted: a block directly in a
  stretched column could not be shrunk (V4 in `resize-leaves-no-gap.spec.ts`)
- `[ ]` **1.1.3 · TASK 3 — outer-edge space when the parent is a COLUMN**, so shrinking opens a space that sticks
- `[ ]` **1.1.4 · TASK 4 — extend `parity-every-arrangement.spec.ts`** to grid cells, components, sticky, floating and
  fixed (neighbours of a floating/fixed block do NOT move; their contents follow every rule), at all breakpoints.
  Today it covers Stack / Side by side / Grid only
- `[?]` **Which list is Tasks 2–4?** A 2026-09-28 session wrote a different one (semantic layer · template feature ·
  template library) and marked it "correct this if different"; never confirmed. The original above is assumed
  - `[x]` **CONFIRMED by the user 2026-09-29: the ORIGINAL list** — wrapper dissolve · column outer-edge space ·
    parity spec extended

### 1.2 · The original queue (after the four tasks)

- `[ ]` **"Place here"** + **"Return to original position"** — approved plan
  https://claude.ai/artifact/M5bfZ5NtDiW9oYjZ6NPNqN, nothing built. On release offer "Keep floating" / "Place here"
- `[ ]` "Add a block inside" NESTS each click instead of adding a sibling
- `[ ]` "Side by side" creates an empty row that clicked tiles land AFTER, not inside
- `[ ]` A resize can leave a stale `alignSelf` on old saved pages (may need a migration)

### 1.3 · The roadmap after the layout closes (in this order)

- `[ ]` **Documentation site** — `docs-site/` on Docusaurus, the FIRST thing after the layout closes (RULE DOC)
- `[ ]` **Semantic layer** — decisions A1 · B1 · C1 made; plan https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ
  - `[ ]` `lang` per page and per block (RULE AF: languages are content)
- `[ ]` **Template feature** — gallery per RULE S; plan artifact for the user's approval first
- `[ ]` **Template library** — one original template per crawled site (~475); `docs/TEMPLATE_LIBRARY_PLAN.md`
- `[ ]` **Components, rebuilt one by one from scratch, every variation** — research first (RULE R); each row of
  `docs/COMPONENT_GAPS.md` is a child of this branch
  - `[~]` Navigation component — plan artifact claude.ai/code/artifact/986a870a-c2e0-43a3-89f3-f7a488be6c5c PARKED by
    the user (2026-09-28: layout only, no component questions during layout work)
  - `[ ]` Hamburger / overlay menu · Forms · Tabs · Steps · Tables · Pricing tables · Breadcrumbs · Pagination · Modal ·
    Logo strip · Tags · Inline links · Theme editor (personality) · Carousel · Calendar · News feed · Staff directory ·
    Map · Downloads · Search · Login panel · Newsletter sign-up · Social row
- `[ ]` **LLM website builder** — v1 deterministic composer → v2 a Claude call emitting the block model → v3 own
  fine-tuned open-weights model (never trained on Claude outputs)
- `[!]` **Builder parity roadmap, Phases 0–9** (memory `project_builder_parity_plan.md`) — Phase 0 done, Phase 1 in
  progress when last recorded; Phases 5–9 need a backend. Reconcile with this tree when the layout closes

## 2 · Risks mitigated by rule (RULE RK — `docs/RISKS.md`)

- `[ ]` **Pilot cohort** — ten real schools (Nigeria and Ghana first), recruited while the components are built
- `[ ]` **Distribution plan** with an owner and a date; the one-hour "show it once" path
- `[ ]` **Demo site** rebuilt from the sweep's own dressed pages, so what is shown is what is measured
- `[ ]` Adoption numbers reported beside the sweep numbers

## 3 · Developing countries first (RULE AF — `docs/DEVELOPING_COUNTRIES_FIRST.md`)

- `[x]` Low-cost phones (Tecno, Infinix, itel, Redmi) in the Preview device list — `bc89d68`
- `[ ]` Weight budget and Slow-3G profile → see 1.1.1
- `[ ]` Offline-first application layer · Paystack / Flutterwave · WhatsApp / SMS · cheap static hosting and local
  domains · second-language versions · templates from the region — each its own area, researched first

## 4 · The rest of Educo (the "original work" to go back to)

- `[ ]` **One engine for the whole of Educo** (RULE APP) — screens migrate to the shared block model and catalogue, one
  area at a time, as components land
- `[!]` **School-admin MVP audit** — punch-list in `docs/MVP_AUDIT.md` (memory `project_mvp_audit.md`)
  - `[ ]` **13 menu pages never built, hidden until they are** (S2-i, the user 2026-09-30): School Information, Branches,
    Academic Years, Sections, Departments, Subjects, Exams, Syllabus, Assignments, Dormitory, Transport, Settings →
    Schools & Branches, Settings → User Management. Building one = the page + deleting its line from `UNBUILT` in
    `components/layout/Sidebar.tsx`; list in `docs/MVP_AUDIT.md` → "Menu links with no page"
- `[!]` **Mobile Drive feature** — memory `project_drive_status.md`
- `[ ]` **Builder on phone and tablet** — a webview over the real export, inside the Educo app (rule 20); after the web
  builder is finished
- `[?]` **What exactly is "the original work"?** Confirm with the user which of these it means before returning to it

---

## Session log

One entry per session, newest first. Written the moment the user says "new session" (or the context is about to run
out) — where the session STARTED FROM, where it GOT TO, and where the next one CONTINUES FROM.

### 2026-09-30 · session 5b8cbbe1 · branch `builder/layout-uat` — HANDOVER (the user: "we'll stop here and continue later")

- **Started from:** `ec1fc5e`, BATCH L-1 not started.
- **Got to:** L-1 checklist written; its pages re-run in PARALLEL (27 of 31 built); the four that failed alone traced and
  resolved. PRODUCT fixes, each reproduced through the UI, guarded (mutation-proven) and seen in a HEADED UAT in 4 themes
  + Preview: **e-1** (a palette click with an Image grid cell selected put the block INSIDE the image — `paletteClickSlot`),
  **L1-3** (a sticky sidebar taller than the screen spilled over the page — clause 3b `min-height`), **L1-9** (a sticky
  header in a row became screen-tall — header/nav/footer excluded), **L1-7** (an empty box's "+" came and went under a
  still pointer and the browser cancelled the drop — editor hints take no pointer during a drag-in; acceptance: 5 of 5
  past the step). HARNESS fixes L1-0 · 1 · 5 · 6 · 8 · 10 · 11. L1-4 → Z-1 (page 12 joins 334). NEW RULE from the user:
  **SIX WINDOWS AT ALL TIMES WHILE TESTING** (CLAUDE.md RULE Z + guard + UAT doc + memory); rebuilds go to a second
  folder (`NEXT_DIST_DIR=.next-b`, port 3200+) so windows never empty. Gate: typecheck 0 · eslint 0 errors.
- **UNCOMMITTED (the code — the full gate has not run):** `.gitignore` · `app/website/box-demo/page.tsx` ·
  `components/website/box/BoxCanvas.tsx` · `eslint.config.mjs` · `lib/box-model.ts` · `next.config.ts` ·
  `scripts/check-fresh-build.js` · `scripts/uat/h.js` · `scripts/uat/pages.js` · `scripts/uat/uat-pages.js` ·
  `tests/e2e/pinning-holds.spec.ts` · `tests/unit/pinning.test.ts` · new: `tests/unit/palette-click-slot.test.ts` ·
  `tests/e2e/drop-into-empty.spec.ts` · `scripts/uat/probe-l1e1.js` · `probe-l1-sticky.js` · `probe-l1-header.js` ·
  `probe-l1-plus.js`. Committed at the handover: this tree, CLAUDE.md, UAT_EVERY_CHANGE.md, claude-md-rules.test.ts.
- **Continue from:** L-1's last three steps (YOU ARE HERE): 337 alone to completion → vitest in full + test:fast (stop any
  `next start` first; delete `.next-b` … `.next-e`) → commit the code → close L-1 → then Z-1 (research → plan artifact →
  approval), L-2 … L-6, D-1; S-3 when the user places it.
- **Not done, and said so:** the six-window batch's shared 37-minute timeouts (cause not found); the published artifacts
  (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 25f18c91 · branch `builder/layout-uat` — HANDOVER (recommended: long context, clean boundary, L-1 heavy)

- **Started from:** `ec8195c`, BATCH S-2 coded, its HEADED UAT not run.
- **Got to:** S-2 CLOSED (`60a2051`: S2-f components keep the page gutter via `pageBandInset`; S2-i dead sidebar links
  hidden, `UNBUILT`, the user's decision) and E-0 CLOSED (`78cc6ee`, `0ae9b5f`): E0-a audit L4 measures gutter-band
  columns · E0-b menu line longhand gap, no band gutter · E0-d harness clips to the Inspector · E0-e `@property --bx-gut`
  (a band holding a narrowing grid is a size container, `cqw` split the unit) · E0-g injected SVGs never pointer
  targets (a drop onto a re-rendered `<path>` was lost) · E0-h a host-stretched column's LAST block takes the spare
  height (the user's decision) · E0-f recorded → BATCH Z-1 canvas zoom. RULE Z "PARALLEL IS THE DEFAULT" written into
  CLAUDE.md, its guard, this tree, UAT_EVERY_CHANGE.md and memory (the user: "correct everywhere"). Gate at `0ae9b5f`:
  typecheck 0 · eslint 0 errors · vitest 3,903 · test:fast 737.
- **Continue from:** BATCH L-1 (YOU ARE HERE in BATCHES): write its checklist first, re-run its pages in PARALLEL
  (e-1 pages 2, 87, 142, 153, 227, 278, 385 + 337, which fails alone with and without E0-e), trace each drop/select
  failure through the UI with a real mouse drag, fix + guard; then Z-1, L-2 … L-6, D-1; S-3 when the user places it.
- **Not done, and said so:** the published artifacts (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 1fba35cf · branch `builder/layout-uat` — HANDOVER (recommended before the heavy S-2 UAT pass)

- **Started from:** `5ed8d5f`, BATCH S-2 open at change (5), nothing coded.
- **Got to:** `f848e43` + `1a513d7` + this tree update. **All five S-2 changes CODED, none yet SEEN in a headed UAT:**
  - (5) a block that paints its own box (component, Button, and the tree components Card/Quote/Stat/Badge/Rating) placed
    straight on the page gets 1rem above/below + 2rem gutter as a MARGIN outside it (`outerDefaults` / `outerSpaceCSS` /
    `sectionPlaceIn`, lib/box-model.ts); a column of a band 1rem above/below only; in a stack nothing. Shown by **Outer
    spacing** (the user's choice). (1) `component-breathing.spec.ts` ("never touch", the user's choice). (2)+(3) page-audit
    W7a/W7b as warnings + `page-audit-whitespace.spec.ts`. (4) old wording gone.
  - S-2 ledger: S2-a/b/d fixed and guarded; S2-c fixed in code, to be SEEN; S2-e NOT A BUG (measured).
  - Gate at `1a513d7`: typecheck 0 · eslint 0 errors · vitest 3,831 · test:fast 724 (640 + 68 + 16).
- **Continue from:** the S-2 HEADED UAT (YOU ARE HERE in BATCHES): write `scripts/uat/probe-s2.js` (build through the UI:
  Card · Button · Quote · Alert one under another on the page; the same four inside a Stack; a Button beside a Card in a
  row; two coloured Stacks one under the other; Outer spacing → 0, reload, Back to default; the Preview at 5 rungs with
  the page audit's W7a/W7b = nothing), run it in 4 themes side by side on a FRESH build, re-run `probe-spacing.js` and
  `probe-saved-page.js` (with a component added) as regression, tick the 8 checklist lines, close S-2 → E-0.
- **Not done, and said so:** the published artifacts and the story chapter for S-2 (end of Task 1); mobile has no canvas (rule 20).

### 2026-09-30 · session 30a96c03 · branch `builder/layout-uat` — HANDOVER (recommended: S-2 is heavy, the context is large)

- **Started from:** `56b19d8`, BATCH S-1 open at S1-a.
- **Got to:** `1cfcfc1` + this tree update. **BATCH S-1 CLOSED** — S1-a (the column GUTTER: 1rem across, 1rem down, the
  line still fits) and S1-b…S1-p (13 more lines, all fixed, see the S-1 ledger), every checklist line seen in a HEADED
  UAT (build u8hfywi0, 4 themes × 5 rungs, canvas + Preview, 124 checks each, 0 findings) plus `probe-saved-page.js`
  CLEAN and `probe-room-marquee.js` PASS. Gate at `1cfcfc1`: typecheck 0 · eslint 0 errors · vitest 3,794 · test:fast
  640. Story chapter "My words never touch an edge" added to `docs/guide/layout-story.md`.
  - The user DECIDED S-2 (5): section space (1rem) around every block placed straight on the page, components and buttons
    included, outside their painted box; never a per-block bottom margin. The S-2 checklist is written.
- **Continue from:** BATCH S-2 → change (5) (YOU ARE HERE), then (1) components breathe, (2)+(3) the audit checks, (4)
  the old wording → ONE HEADED UAT for S-2 → close it → E-0.
- **Not done, and said so:** the published artifacts (end of Task 1); the mobile app has no builder canvas (rule 20).

### 2026-09-30 · session 3c675738 · branch `builder/layout-uat` — HANDOVER (the user moved to a new session to keep the cost down)

- **Started from:** `5414975`, the tier-99 re-run triaged, nothing running.
- **Got to:**
  - e-2/e-3 re-run alone, STOPPED by the user at 3 of 14 (build OvtY9uAA): page 68 was the machine; pages 145 and 393
    still fail alone → BATCH E-0. #42 and #46 found (transcript c7a3c172) and written out in full.
  - **Working method changed by the user:** RULE X is ONE UAT PASS PER BATCH (one area, ≤ 6 changes, checklist first,
    one open at a time) — the BATCHES section at the top of this file, guarded by `task-tree-batches.test.ts`; the tree
    is the Bible for every request; every handover ends with the next session's prompt; say when to hand over.
    All in `CLAUDE.md` with guard lines.
  - **SPACE BY DEFAULT built** (batch S-1): `spaced` mark on new blocks, `spaceDefaults` / `sectionContent` /
    `leafPaddingCSS` / `padSide` / `gapOf` in `lib/box-model.ts`, one decision for canvas and export; inspector shows
    "Default · size" + Back to default, inner spacing on every element (c-23), bulk reads the real padding (c-24),
    controls in REAL rem (S1-b). The user's values: gutter 2rem, section 1rem, bar 1rem, stack 1rem, columns 1rem,
    inner 1.5rem, plain box 0. Guard `tests/unit/space-by-default.test.ts`.
  - S-1 HEADED UAT run twice (4 themes × 5 rungs, canvas + Preview, `scripts/uat/probe-spacing.js`): 69 checks passed
    per theme; findings S1-a … S1-e in the S-1 ledger. The first run found BATCH L-1's first reliable e-1 repro.
  - Every carried-over item queued as a batch with its description (L-1 … L-6, D-1).
  - Gate at the handover commit: typecheck 0 · eslint 0 errors · vitest 3,784 · test:fast 640 — all green.
- **Continue from:** BATCH S-1 → **S1-a, the 1rem gap between columns side by side on the page** (engine: each column's
  width gives up its share of the gap so the line still fits; resize maths in % must keep working) → rebuild → ONE
  re-run of `probe-spacing.js` in 4 themes to close S1-a … S1-e and tick the S-1 checklist → close S-1 → S-2.
- **Not done, and said so:** the S-1 checklist is not ticked (it closes on the re-run); the column gap engine work;
  the mobile app has no builder canvas (rule 20); the published artifacts and the story are not updated (end of Task 1).

### 2026-09-29 → 30 · session 6c14c5c8 · branch `builder/layout-uat` — HANDOVER (the user stopped for the night)

- **Started from:** `66b6896`, the tier-99 re-run 4 minutes in.
- **Got to:** the re-run FINISHED and TRIAGED — 403 pages in 957 min; clean 17 → 356, not built 52 → 21; ten classes
  e-1 … e-10 in the ledger (1.1.1 → tier 99 → d). Read-only findings on c-6, c-11, c-12 in the tree. Rule 3 in `CLAUDE.md`
  REWRITTEN to "space by default, always overridable" for every element and component, guard updated and green
  (`claude-md-rules.test.ts`, 150 passed); scenarios in `box-builder-spacing.feature`. c-23, c-24 found by reading.
- **Decided by the user this session (each recorded under its line):** c-7 B · c-8 B · c-21 B · grid picker B (any
  count up to 12) · Tasks 2–4 = the original list · saved pages keep their spacing · the default spacing values ·
  c-11c B (an icon cell does not count for the tablet rule).
- **Continue from:** 1.1.1 → tier 99 → d → "re-run e-2 and e-3 alone first" (YOU ARE HERE) [SUPERSEDED 2026-09-30: parallel is the default, only a failure is re-run alone — RULE Z]. Then SPACE BY DEFAULT (the
  engine, the two audit checks, the old wording in six places, c-23, c-24), then e-1 · e-4 · e-5 · e-6 · e-7 and the
  rest, each at its root, guard red first, HEADED UAT, `--pages=`; then the four decided engine changes (c-7, c-8, c-21,
  grid picker) and c-11c.
- **Not done, and said so:** the full gate did NOT run at this commit (only the rules guard; no app code changed); the
  production server on 3100 was stopped; the mobile app has no builder canvas (rule 20); the published artifacts are
  still not updated.

### 2026-09-29 · session df7557b5 · branch `builder/layout-uat` — HANDOVER (the user asked for a new session, to bring the cost down)

- **Started from:** `919d731` with uncommitted work; the tier-99 sweep finished and untriaged.
- **Got to:** three commits pushed — `bc89d68` (the uncommitted work secured), `e4a16f6` (the tier-99 fixes), and the
  handover commit (the last harness fix and this tree). Gate at `e4a16f6`: typecheck 0 · eslint 0 errors · vitest 3,739 ·
  test:fast 640.
  - Tier 99 triaged: 403 pages, 688 min, 52 could not be built, 17 clean — 21 ledger lines (c-1 … c-21).
  - CLOSED, each with a guard that was red first and a headed UAT through the UI: c-1 Icon · c-2 List · c-4 could not
    select · c-5 drop over the toolbar · c-7 holes · c-8 words (harness half) · c-9 image slack · c-10 150% text ·
    c-13 · c-14 · c-15 handles · c-16 (not a bug) · c-17 grid rows · c-18 · c-19 · c-20 toolbar side.
  - 39 sweep pages re-run headed on fixed builds: 35 at 0 errors (the first run had 17 clean of 403).
  - The user's ORIGINAL Tasks 2–4 recovered and recorded (1.1.2 – 1.1.4); this tree created and made a rule.
- **Running when this was written:** the whole tier 99 again, on the fixed build (tree 1.1.1 → tier 99 → d).
- **Continue from:** tree 1.1.1 → tier 99 → d. If the run has finished, triage it and compare with the baseline; if it is
  still running, do nothing to `scripts/uat/` and take c-11, c-12 and c-6 by READING only, or wait.
- **Then, in order:** c-3 · c-6 · c-11 · c-12 → the RULE AF harness (page weight, Slow 3G) → the innovative plan (19 pages)
  → the 19 tier-95 failures → story and artifacts → gate → pull request to `master` → Tasks 2, 3, 4 → the original queue.
- **Added after the handover, same day:** the user asked that space is there BY DEFAULT (words never against an edge,
  always overridable) — tree 1.1.1 → "SPACE BY DEFAULT". It reverses rule 3 and means one more whole-tier sweep.
- **Decisions waiting on the user (none blocks the work):**
  1. c-7 — a column nobody sized, beside columns that were: keep its share (today), or take what is left of the line?
  2. c-8 — words in a grid cell narrower than the longest word: break the word (today), narrow the grid, or warn?
  3. c-21 — the edge handles cover the last letter of a block that hugs its words: leave, or draw them outside?
  4. a grid of five across is not in the picker (1 · 2 · 3 · 4 · 6 · 12): leave, or offer any count up to 12?
  5. which list is Tasks 2–4 — the original (wrapper dissolve · column outer-edge space · parity spec), as assumed?
  6. space by default: do pages already saved keep their spacing (recommended), or take the new defaults too?
- **Not done this session, and said so:** the mobile app (`apps/mobile/`) has no canvas, so none of this has a native
  counterpart (rule 20); the published artifacts (Builder Hub, Layout System, Parity Audit) were NOT updated — the guide
  and the story were. They are a line in 1.1.1 and must be done before the pull request.
