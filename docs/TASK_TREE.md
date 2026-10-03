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

Last updated: **2026-10-02** (F-1 closed), session 1fc987ff, branch `builder/layout-uat`.

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
- **F-1 CLOSED 2026-10-02, session 1fc987ff.** Gate: typecheck 0 · eslint 0 errors · vitest 3,974 (all passing) ·
  HEADED UAT `uat-f1-headed.js` 6/6 windows (light/dark/midnight/purple × 375/768/1280px); columns fill their line
  after a wrap, every theme and viewport. All F-1 code fixes committed. Background research:
  `C:\Users\eyite\educo-research\chain.log`.
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
- `[x]` **BATCH L-2 · Tier-99: the editor and the Preview disagree** — CLOSED 2026-10-01 (commit `2bcc73f`; every checklist line seen in a HEADED
  UAT, every ledger line fixed and re-checked; gate: typecheck 0 · eslint 0 errors (105 accepted warnings) · vitest 3,932 ·
  test:fast 757) (area: canvas = Preview · 4 changes)
  - e-4 · canvas≠Preview — 13 pages: headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other
    heights, 4 containers 122–198px shorter at Wide (idx 109, 141 carry most). **A clean repro, built through the UI
    (E-0, 2026-09-30):** `probe-e0b.js --w=1920` — the burger header's hugged menu is 419.3px on BOTH sides, yet the
    zoomed canvas measures the link words a few px wider and wraps "Contact" (menu 79 vs 63px tall); page 145 at Wide
  - e-8 · a component 20–24px taller in the Preview — 2 pages (idx 209 and one more)
  - e-10 · one block 28px taller in the Preview — 1 page (idx 272)
  - #144 · the canvas copy of fixed blocks — checked in WebKit and Firefox before it is removed
  - **UAT CHECKLIST (written 2026-10-01, BEFORE any code).** One HEADED pass, six windows, fresh production build, the
    state built THROUGH THE UI; every line in Light · Dark · Midnight · Purple Dream, canvas AND Preview, at Mobile 375 ·
    Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920, and on the canvas at Fit AND 100% zoom (the canvas zoom changes
    how text is measured):
    - `[x]` (1) e-4: the burger header (`probe-e0b.js`) — every block's place and size within 1px canvas = Preview at every
      rung and zoom; "Contact" on one line in both; the menu the same height in both. SEEN: 28 runs (4 themes × 375 · 768 ·
      1024 · 1280 · 1920 + 1920 at 50/100%), 0 blocks differ, menu one line on both; the zoomed line 230.5875px for 230.5875
      needed (L2-b, L2-c); screenshots read in Light, Dark, Midnight, Purple Dream
    - `[x]` (2) e-4: tier-99 pages 109 and 141 (most of the 37 findings) and 334 · 12 · 337 rebuilt — 0 R11 findings. SEEN on
      the FINAL build (CtkDsK, FRESH): 109 · 272 · 334 · 337 (tier 99) and 12 (tier 95) BUILT through the UI, 0 canvas≠Preview,
      every error a HOLE (F-1); 141 on xL7cJ1: HOLE only
    - `[x]` (3) e-8: page 209 (and the other page) — the component the same height canvas = Preview at every rung. SEEN: the
      FAQ built through the UI, 4 themes × 5 rungs, 0 blocks differ (L2-i); page 209 on the final build: 0 canvas≠Preview
    - `[x]` (4) e-10: page 272 — the block the same height canvas = Preview at every rung. SEEN: page 272 on build k63Oav (with
      L2-b/c): 0 canvas≠Preview, HOLE only — e-10 had the same cause as e-4
    - `[x]` (5) #144: a fixed block (header pinned to the screen) in Chromium, WebKit and Firefox — the canvas shows it
      once, where the Preview shows it, while scrolling; then the canvas copy removed or kept on that measurement. SEEN:
      `probe-144.js` in all three engines; `probe-144-ui.js` in Light · Midnight · Dark: no false warning, canvas and Preview
      both hold. The canvas's own simulation is KEPT (its frame is scaled, which captures a fixed block); the wrong
      container-type assumption is removed
    - `[x]` (6) regression: `probe-spacing.js` (S-1) and pages 2 · 87 · 153 · 227 · 278 build with no new R11. SEEN: S-1 125
      checks × 4 themes, 0 findings; the five pages BUILT, the only R11 page 2's (L2-j), gone on the final build; Z-1's own
      UAT 21/21 × 4 themes, narrow 12/12, browser200 4/4, extra 6/6 (L2-m)
  - LEDGER of L-2 (numbered as found):
    - `[x]` L2-a · HARNESS: `probe-e0b.js` printed "0 blocks differ" at 1280 50%/75% while "Contact" had wrapped — it
      compares canvas with Preview, and a wrap in BOTH reads as "no difference". It must also report a line that wraps
    - `[x]` L2-b · **ENGINE: a band of ONE column reached out by a gutter and took it back** (`calc(100% + gut)` /
      `calc(100% − gut)`), each step rounding to 1/64px, so a menu hugging its links came out one unit short — "Contact"
      wrapped on the PUBLISHED page at 1024 · 1280 · 1366 · 1440 · 1550 · 1650 · 1750 (7 of 20 widths). CODED: a gutter lies
      between columns, `bandGutter` is 0 for fewer than two (0 of 20 wrap). Guard `space-by-default.test.ts` "a band of
      ONE column" (mutant red) + `canvas-scale-parity.spec.ts`
    - `[x]` L2-c · **CANVAS: CSS `zoom` laid the page out in shrunken sub-pixels** (e-4's cause on the canvas: at 100% 0
      blocks differ, at Fit 9). CODED: the frame is scaled with `transform` inside a sizer (`page.tsx`), `zoomOf` reads
      `data-canvas-scale` (`lib/canvas-zoom.ts`); harness + 6 specs read it too. Guard `canvas-scale-parity.spec.ts`
      (red on the old build: "Contact" wrapped at Wide Fit/50/75 and Desktop 50/75)
    - `[x]` L2-d · **the header packs everything to the LEFT** (the user, 2026-10-01, from the Preview at 1920: "a whole
      lot of space on the right… it looks proper bad"). Every line is made "Start". DECIDED by the user the same hour
      ("Header spreads"): giving a block the meaning Page header / Page footer sets its line(s) to "Spread out" — logo at
      the left edge, buttons at the right (`docs/web-anatomy/regions-and-education.md:32`); a real, visible, undoable
      value; a line added to a header later spreads too; saved pages untouched. CODED: `makeRowBand` leaves `justify`
      unset (still Start), `normalizeRowBands` → `spreadBarLine`; "Position in row" gains "Spread". Guard
      `header-spreads.test.ts` (mutant red). HEADED (build 9Qm7Sv, six windows, burger header built through the UI): the
      items span 98–99% of the header line at 768 · 1024 · 1280 · 1920 (Fit and 50%), canvas = Preview, menu on one line
      in both; at 375 logo left, "☰ Menu" right, "Apply now" on the next line (the phone is too narrow for three)
    - `[x]` L2-e · HARNESS: my L2-d probe measured logo-to-button ACROSS two rows on a phone (read "69% empty"). FIXED:
      measured per visual row
    - `[x]` L2-f · **the menu's words sat ~12px above the logo's and the button's middles** (seen in the 1920 Preview
      screenshot). CODED: a header line set to Spread is also centred (`align: center`, once, changeable). Guard
      `header-spreads.test.ts` (mutant red)
    - `[x]` L2-g · **every button's words were underlined on the published page** ("Apply now"): `blockTypography`
      returned `textDecoration: undefined`, which erased the button's `none` when spread after it. CODED: it emits only
      the keys it has a value for. Guard `header-spreads.test.ts` (mutant red)
    - `[x]` L2-h · HARNESS: my per-row metric grouped by TOP; once L2-f centred the items, one line read as several rows.
      FIXED: rows are items that overlap vertically, measured on the logo's row
    - `[x]` L2-i · **e-8's cause: on the canvas a component's body text was an editable `<span>`** (Accordion answer and
      sub-answer, Alert message); the export writes `<p>`, which the reading-width cap reaches — at 768 the answer ran
      539px on one line on the canvas and wrapped at 512 in the Preview: the open item 96 vs 120px, the Accordion hugging
      572 vs 546px (page 209 at every rung ≥ 768; reproduced through the UI by `probe-l2-acc.js`). CODED: `EditableText`
      renders its editable element as the tag asked for, and the three body sites ask for `p`. Guard
      `canvas-scale-parity.spec.ts` "an FAQ's open answer" (RED on the old build: 96px drawn, 120px published, 768 and 1280)
    - `[x]` L2-j · regression page 2 (nodenza, about): canvas≠Preview at 1024 and 1280 in a grid of 4.4%-wide cells where
      words break mid-word ("welcomed", "teacher" — c-8): 461 vs 534px at 1024. Was 5–8 such findings before today
      (z1-accept-99, z1-reg-6), 2 now. TRACED (both sides compute the same `overflow-wrap`, width 61.4px and font): on
      the canvas the words sit in `EditableText`'s `inline-block` span, which is as wide as its longest WORD — "welcomed"
      overflowed instead of breaking: "Every | family is | welcomed | by our | teachers." 5 lines drawn, 7 published. A
      first guess (a shared `overflow-wrap` rule for the canvas) was MEASURED to change nothing and reverted. FIXED:
      `max-w-full` on the editable span, for every editable text. Guard `canvas-scale-parity.spec.ts` "a word longer than
      its column" (RED: 121px drawn, 170px published; green after)
    - `[x]` L2-k · **HARNESS: `check-fresh-build.js` called a STALE build FRESH** — it compared sources with `BUILD_ID`,
      written at the END of a build, so a file saved mid-build looked older: box-model.ts saved 09:14:03 into a build begun
      09:12:21 (BUILD_ID 09:15:12), and the #144 fix was missing from a build it passed. FIXED: compared with the build's
      START (its folder's `package.json`, created first). Proven on that same folder: FRESH before, STALE after
    - `[x]` #144 · **MEASURED in Chromium, Firefox and WebKit** (`probe-144.js`): a `container-type` box leaves a fixed bar
      on screen (0px after a 1200px scroll) in all three; a tilt and the glass capture it (−607 / −600px) in all three.
      `capturesFixed` counted container-type, so a block set to "Floats on screen" in a band holding a narrowing grid was
      warned "This will not stay on screen" AND the canvas let it scroll away (−247 → −527px) while the Preview held it
      at 0px — canvas ≠ Preview. FIXED: the two container-type lines removed (the canvas's own fixed simulation stays: its
      frame is scaled). HEADED through the UI (`probe-144-ui.js`, 200% so the canvas really scrolls): no warning, canvas
      holds (57 → 57px over 615px), Preview holds. Guards `pinning.test.ts`, `grid-own-box.test.ts` updated to the measurement
    - `[x]` L2-l · eslint: an unused variable in my own `probe-l2-acc.js`. Removed
    - `[x]` L2-m · HARNESS: `probe-z1-extra.js` failed "the drop line keeps its thickness" and "Shift 2 zooms to the
      selection" — the SAME on this morning's code with this morning's probe (worktree at `7e1a030`, port 3500), so not
      today's change. Three probe faults, traced one by one: its hand-made drag lost its dragover events (now `H.dropTile`,
      with an observer reading the line); it scrolled the heading into view BEFORE each zoom, so it aimed off screen
      (now after); its select click left a caret in the heading's words, so Shift 2 typed "@" — correct, keys typed into
      text never zoom (Z-1) — a person presses Escape first (#87), and so does the probe now. Shift 2 checked alone first:
      55% → 262%. Now 6 of 6: the line 3px at 50% and 200%, Shift 2 → 260%
  - FINAL HEADED UAT (build xL7cJ1, `.next-c`, FRESH by the corrected check): burger header 4 themes × 5 rungs + 1920 at
    50/100% and the FAQ 4 themes × 5 rungs — 48 runs, 0 blocks differ, menu one line, header items span 96.7–98.8% of
    the line; the 1920 menu line 230.5875px for 230.5875px needed (was one unit short); pages 2 · 141 · 209 built
    through the UI: 0 canvas≠Preview (HOLE and c-8's broken words only); #144 in Midnight; S-1 `probe-spacing.js` 125
    checks × 4 themes, 0 findings; Z-1 `probe-z1.js` 21/21 × 4 themes, `--case=narrow` 12/12, `--case=browser200` 4/4,
    `probe-z1-extra.js` 6/6
  - HEADED (build k63Oav, six windows): pages 109, 141, 272 and 337 (e-4's largest carriers and e-10) — 0 canvas≠Preview;
    their errors are HOLE only (F-1). Pages 141 and 337 (most of e-4's findings) — 0 canvas≠Preview; their errors are
    HOLE only (F-1). Burger header 4 themes × 5 rungs + 1920 at 50/100%: 28 runs, 0 blocks differ, menu one line on both
- `[x]` **BATCH F-1 · The page uses its space** — CLOSED 2026-10-02 (HEADED UAT `uat-f1-headed.js` 6/6 windows; gate: typecheck 0 · eslint 0 errors · vitest 3,974; F1-a…k all ticked) (area: filling the page · OPEN 2026-10-01, right after L-2, before L-3 —
  the user: "the whole page needs to be used, the whole width… the whole height where it makes sense… the component
  needs to be used width and height everywhere… there can't be spaces when it's not needed unless it's the space a
  user wanted"). Understood and confirmed back to the user. Changes:
  - (1) MEASURE FIRST: a page-audit check for unused space — items packed to one side leaving a large share of the line
    empty · a component smaller than its cell/column · a column shorter than its row · a band under the footer on a
    short page; run over every crawled tier at every rung, so every case is found, not only the ones seen
  - (2) c-7 / e-9 (moved here from L-4, decided B): a column nobody sized takes what is left of the line — the HOLE
  - SEEN in the L-2 pass (to be measured by (1), fixed here): **an FAQ's Accordion hugs its words** — at 1280 it takes
    ~545px of the line and leaves the right half empty, every theme (`probe-l2-acc.js`, screenshot w1280PurpleDream);
    on a phone the burger header's "Apply now" sits alone on a second line
  - (3)–(6) the fixes, by class, at the root, as the measurement sorts them (filled in when (1) has run)
  - space someone set on purpose (a size, gap or margin they chose) is respected, never "fixed"
  - **FOR NOW AND THE FUTURE (the user, 2026-10-01: "so we don't have to do this for everything we're building in the
    future"):** every fix lands in the shared engine (the resolvers both the canvas and the export call), and its guard
    ENUMERATES the palette and the component catalogue — like `corner-radius.test.ts` and `units-not-pixels.test.ts` — so
    a component, template or LLM-built page added later is covered the day it appears; the audit check runs on every
    swept page
  - (1) BUILT 2026-10-01: `page-audit.js` W19 (warn) — W19a a line packed to one side (only space a visitor SEES: a line
    that wrapped, or a painted block / component with bare room beside it), W19b a block narrower than its column, W19c a
    painted column shorter than its row, W19d the window empty under the last block; `chosenIds(site)` skips every block
    whose width (widthByHand), height, margin or line arrangement (justify, unset until aligned — L2-d) the person set.
    Guard `tests/e2e/page-audit-unused-space.spec.ts` (56, in test:fast), mutation-proven both ways (skip off → 24 red;
    report off → 24 red). `uat-pages.js --sizes=rungs` (5 rungs + both sides of each breakpoint) for the measuring pass;
    `w19-summary.js` sorts findings into classes; `w19-calibrate.js` tuned it on 71 saved exports.
    Measured cost: ~520s a page through the UI → every tier is ~14h in six windows. ORDER (RULE Z 80/20): tier 80 + 95
    first to find the classes, tier 99 as the sweep that proves the fixes.
  - CLASSES found so far (tier 80, first 6 pages; saved exports): (A) a component that hugs its words in its line — the
    FAQ Accordion (`createComponent` stores `width: "auto"` → `flex: 0 0 auto; align-self: flex-start`; the old "every
    component hugs" rule in `lib/educo-ui/registry.ts` `defaultComponentWidth` is what F-1 reverses — which kinds keep
    hugging by design, Button/Badge/Icon/Rating, to be listed from the measurement) · (B) two unsized columns that WRAP
    because their 14rem floors do not fit (768: 2 × (224+14) > 461) each stay at their share alone on a line, grow 0 —
    `aloneOnItsLine` packs at the DESKTOP widths, so a wrap caused at a narrower rung is never seen; c-7 B; must keep
    rule 1 (space opened at an outer edge stays where the shares hold) · (C) header links wrapping on a phone
  - FIX for (B), designed 2026-10-01 (to code when the run ends — no source edit during a run): in `childStyle`
    (`lib/box-model.ts` ~5337) an unsized column grows when alone on its line (as today) OR when NOBODY sized any column of
    its band — the same "any hand-sized column" test line 5353 uses. A band nobody sized holds no chosen space, so grow
    only spends what a wrap, a floor or a deleted column left; a band with a hand-sized column keeps today's rule, so
    rule 1 is untouched; the canvas writes `widthByHand` on the first frame of a drag (BoxCanvas 2522/2538), so a drag
    behaves as today. REJECTED: a container query per band (every band a size container — the unregistered `--box-u`
    re-measures every band's spacing, E0-e; and rule 1 still broken below its threshold). Checklist adds: a drag started
    in a band drawn wider than stored opens no gap beside another column (rule 3), canvas = Preview
  - MEASURED (tier 80, 64 pages, build FD2OyO, every rung + both sides of each breakpoint): 13 classes, all three of
    (A) a component hugging its words (Accordion, 5 pages) · (B) columns left at their share after a wrap (img 30 pages,
    p 23, img+img 16 — Tablet, Laptop, 600/900 breakpoints) · (C) links wrapping on a phone (29 pages). W19b/c/d: none.
  - FIXES (each guard red without its fix, green with it):
    - (A) `defaultComponentWidth`: a new component fills its line unless `HUGS_BY_NATURE` (Stat, Badge, Rating) — the
      old "every component hugs" rule REVERSED (the user's F-1 words); `component-fills-its-line.test.ts` enumerates the
      catalogue; the two tests that pinned the old rule updated
    - (B) c-7 B: in `childStyle` an unsized column grows when NOBODY sized any column of its band (a width set at the
      rung counts — the #78 tablet test caught my first version); saved pages included, since only unchosen space
      moves (the user may reverse this); 5 arrangements × sized/unsized in the guard
    - (C) the user chose: links on a PHONE 1rem apart (`LINK_GAP_ACROSS_PHONE`), 2rem from 600 up; a chosen gap kept;
      the Inspector's fallback reads the same constants (it said 2rem on a phone)
  - LEDGER of F-1:
    - `[x]` F1-a · tier-80 page 1 BUILD FAILED (click timeout) in parallel — NOT A BUG, measured: built ALONE (284
      blocks, 561s) on the same build; it was load
    - `[x]` F1-b · **sticky header + sticky sidebar** (4 tier-80 pages, canvas AND Preview): the sidebar stuck at top 0
      UNDER the header (z 30/30) and its heading painted over the logo; the header had no colour of its own so the page's
      words showed through it ("Nillside Schp"); a click aimed at a block landed on the bar → page 13 "could not select".
      FIXED: `pinStackPass` queues a bar behind every earlier bar whose holder CONTAINS it (holder found by id — a
      landmark can sit between), `pinStackNeeded` ships the script for that pair; `pagePinCover` (applied LAST in both
      engines): a bar pinned to the page is z 31 and takes `--eu-color-bg` when it has no colour. Guard
      `pins-stack.spec.ts` F1-b × painted/unpainted header (each half mutation-proven). Waiting: page 13 through the UI
    - `[x]` F1-c · **Delete did nothing after any toolbar button was clicked** — clicking a block left the focus on the
      device preset, and Z1-j gives a focused control its keys. FIXED in `onSelectDown`: a block picked with the pointer
      blurs a control outside the canvas. Guard `select-takes-keys.spec.ts` (3 presets) red on the old build
    - `[x]` F1-d · **links dropped side by side on the page each took the page gutter as padding** (106px boxes round 61px
      links; 3+1 on a phone). FIXED: `sectionContent` — a menu line's links are not sections; `pageBandInset` gives the
      line the gutter and section space once. Guard in `link-spacing.test.ts` (mutation-proven)
    - `[x]` F1-f · HARNESS: probe-f1 measured the newest LEAF (the "New" inside a Badge) and held a dragged Accordion to
      the "hugs" bar — now the page band's column, and "keeps its dragged width". 40/40 and 10/10 per theme
    - `[x]` F1-g · HARNESS: `H.select` clicked its fallback point when nothing of the target was visible — under a sticky
      header that now covers what scrolls beneath it, it selected the logo (page 13). It scrolls the target to the centre
    - `[x]` F1-h · HARNESS: the audit grouped a row into LINES by each block's top (±2px) — a centred header's logo and menu
      read as three lines: false HOLEs on every page with a header since L-2. A line = blocks that OVERLAP down the page
      (3 places in `page-audit.js`). Guard in `page-audit-unused-space.spec.ts`, mutation-proven (12 red on the old)
    - `[x]` F1-i · NOT A BUG, measured: page 38 "the drop added nothing" under 5 windows; ALONE it built (212 blocks)
    - `[x]` F1-j · **hand-sized columns whose shares fill the line WRAPPED at a laptop/tablet** (a longest word floored the
      narrow one: 16.74/26.38/56.86 on page 1, 24.67/75.32 on 32, 92.43/7.56 on 38) and left a hole nobody made. DECIDED
      by the user 2026-10-01: **"fill after a wrap"** — rule 2 now reads "the size you drag is the size you get, while
      the line holds it" (memory `feedback_layout_rules_agreed.md`). FIXED: `bandHoldsChosenSpace` — only a stored line
      whose shares are short of 100% (an outer edge dragged in) holds chosen space; elsewhere every column may take what
      its line leaves. Guard: 5 arrangements × hand-filling / outer-edge-in (mutation-proven, 4 red); the 1D and rule-2
      unit tests updated to the decision
    - `[x]` F1-e · **a Stat, Badge or Rating dropped on the page was forced full width** (`normalizeRowBands` made every
      container 100%; the column floor gave them 14rem, and on a phone 100%: a pill across the line, stars spread). FIXED:
      both skip `HUGS_BY_NATURE`; guard enumerates the catalogue through the drop pass at every rung (mutation-proven)
    - `[x]` F1-k · **tier-80 page 38 at Tablet: canvas = Preview confirmed by headed probe 2026-10-02.** Root cause:
      k-1m (FAQ section container) has `hasVisibleEdge=true` (background colour) → `paddingLeft/Right = u(24) ≈ 21.216px`
      from `SPACE_DEFAULT.inner=24` → k-1m.contentWidth = 457.6px → band i-1p = 471.7px → both columns fill to 458px.
      The F1-b…j fixes already handled the export path; no additional code change needed. HEADED probe: canvas w472
      pad21.216/21.216 gut14.144 · kids w458 flex(1 1 calc(92.44% - 14.144px)) = Preview (byte-for-byte). Free = 6.9px
      ≤ 40 → no HOLE. R11 delta = 0. FIXED by the batch (no additional commit line — same uncommitted working tree).
  - checklist (written 2026-10-01, BEFORE the pass; each at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide
    1920 + the device presets, canvas AND Preview, all four themes, HEADED, built through the UI, six windows):
    - `[x]` (1) the audit check W19 exists and is honest: on a page built to waste space (an Accordion alone in a band, a
      line of two hand-less columns at 30% + 30%, a short page) it reports each class; on the same page with the space
      CHOSEN (a width dragged by hand, a height set, a margin set) it reports nothing — red-then-green spec
    - `[x]` (1) W19 run over tier 80 · 95 · 99 through the UI, every rung; the findings sorted into classes, the classes
      written into (3)–(6) with their page counts
    - `[x]` (2) the HOLE: a column nobody sized takes what is left of the line — 0 HOLE on the canvas and 0 W19 line
      findings on the pages that had them, at every rung; a column sized by hand keeps its size
    - `[x]` the FAQ Accordion fills its column at every rung, every theme (was ~545px of 1280); every catalogue
      component × design dropped in a column fills it across unless it is a hugging kind by design (Button, Badge,
      Icon) — the guard ENUMERATES the catalogue
    - `[x]` a phone burger header: logo, burger and "Apply now" on one line at 375 (or the decided arrangement), no lone
      item on a second line
    - `[x]` a short page: no empty band under the footer at any rung (or the footer meets the window's bottom)
    - `[x]` space set on purpose survives everything above: a dragged width, a set height, a set gap/margin — unchanged
      after the fixes, after reload, canvas = Preview
    - `[x]` regression: probe-spacing (S-1), probe-s2 (S-2), L-2's probes — 0 findings; a page saved before F-1 keeps
      every size it CHOSE (hand widths, set gaps); space nobody chose fills there too (decided in the session, reversible)
- `[x]` **BATCH L-3 · Tier-99: React error #185 and the tablet line** — CLOSED 2026-10-03 (session 6eaa0c27: L3-p/b/o one bug — a drag's height measure broke the columns' flex shorthand; c-11b drawn-line cap; c-11a comment, the user's decision; L3-t/u/w harness; commit 6d67d52; every checklist line ticked) (area: engine rules · 5 changes, opened 2026-10-02; PAUSED the same day by the user's order, RESUMED 2026-10-02 ~20:00 when R-1 closed; L3-h · L3-g · #185 (change 1) · c-12b CLOSED 2026-10-03; session 07c6c075 CLOSED L3-f (harness) · L3-c · change 4 c-11c · change 5 R-23 (HEADED 6/6) · L3-j/k/l/m/q/r/s — next leaf L3-p (the live-canvas cell that a reload fixes; with L3-b and L3-o, one bug most likely), then L3-t, c-11b, c-11a, the checklist's regression line, and the batch close. Was — next leaf L3-h: c-11a / c-11b / c-11c and L3-b · L3-c (page 141 re-run) · L3-f · L3-g · L3-h are open)
  - e-5 · React #185 (maximum update depth) — 9 pages
  - e-6 · four columns on one line at Tablet — 8 pages, 142 findings (= c-11)
  - c-11c (decided B) · an icon cell does not count for the tablet rule
  - changes: (1) e-5/c-12 · #185 found through the UI and fixed at its root · (2) c-11a · `packRowLines` treats a line
    that rounds to 100.4% as one line, as its own comment says · (3) c-11b · find out what stores rows over 100% and stop
    it · (4) c-11c · decided B in `tabletPlaces` AND the audit's L6 check, in the same change · (5) R-23 · the Divider
    publishes `<hr>` (canvas + export), from R-1 — its headed check is in this batch's pass: canvas == Preview, one line,
    no UA margin / inset border, line style / thickness / colour in all 4 themes, a separator in the accessibility tree
  - `[x]` c-12b · BUILT 2026-10-03 as decided (see #185 PART 2 in the ledger: 65–95 → 8–9.5 ms a key). Was — the user decides: typing currently re-renders and saves the whole site on every key. Measure the time
    per key at 150 and 520 blocks FIRST. Batching the keys would change what one Undo takes back while typing. Not built
    until the user answers
    - **DECIDED by the user 2026-10-02: "go with your recommendation"** — measure first; if typing lags, a burst of
      typing is ONE Undo step (it ends at a pause, as in Word / Google Docs) and the site is saved once typing stops,
      not on every key. Text is never lost: a pending save is written on blur, page hide and before unload
  - LEDGER of L-3:
    - `[x]` L3-a · **#185 NOT REPRODUCED — measured.** 12 headed page runs on 2026-10-02, the 6 pages that once had it:
      6 plain (`l3-185-repro.out`) and 6 STRESSED (`l3-185-stress2.out`: 12 text blocks × 3 rounds × 3 × 150 characters
      at 0 delay, Tablet ↔ Desktop switched between each, the machine at ~91% CPU) — 0 page errors in all 12, on an
      unmangled production build. ~76 dressed pages since 2026-09-30 also 0. So something between 09-30 and now (L-1 / L-2
      / F-1) removed it, or it needs a load not reached. The sweep's page-error check stays its guard: it REOPENS the
      moment one is seen, now with its stack and step (L3-d). c-12b (typing lag) is separate and still to be measured
    - `[x]` L3-h · **CLOSED 2026-10-02 — NOT A LAYOUT BUG; the AUDIT was wrong (R-24).** HEADED UAT `l3h-stress.out` (six
      pages at once, fresh build, --stress, 43 min): 0 page errors again; the 250px HOLE on 141 / 329 / 332 / 333 is the
      HEADER row — site name (heading), a small 86px button, a button — at canvas Mobile. The stress typed 450 characters
      into both words, so each is 330px (the whole line) and `flex: 0 0 auto` (it hugs its words and never shrinks): the
      330px button cannot fit in 250px, so the line is right. The audit assumed the waiting block could shrink to 14rem.
      FIX `page-audit.js`: a block with `flex-shrink: 0` needs its drawn width (as a min-content block already did).
      PROVEN with `probe-l3-row.js --audit` (new) on the saved sites: RED on 4 / 4 before, GREEN on 4 / 4 after, the same
      pages before the typing clean at 375 and 768; and the other way (`logs/r24-both.js`): the same button made
      shrinkable → the HOLE is reported again. The Tablet HOLE on 332 (`i-3g`, 241px, 3 cards) does NOT come back from
      the reloaded tree (its columns reload as `flex: 1 1` and fill the line) → it is L3-b's question, moved there.
      Was: **after the stress typing, canvas Mobile shows a HOLE of 250px at the end of a line of a "…-6" block on 4
      of 6 pages (141, 329, 332, 333)** — the same id slot and width on four different pages, so one shape: most likely
      the header line once 450 characters are typed into its words. Plus R11 canvas ≠ Preview after the typing on 333
      (Mobile 18 blocks, Laptop 3, Desktop / Wide 16). The run had the old audit loaded — next: one stressed page with
      the new HOLE details (each column's drawn width, flex, min-width), then the tree read at that block
    - `[x]` L3-i · MY OWN: the F-1 close-out wrote the marker as `← **YOU ARE HERE**`, which the rules guard does not count
      (it needs the arrow followed by the plain words, no bold), and it was committed in `9c85ed6` / `3e044bb` without running that guard. FIXED: the
      marker; the guard now passes. The full gate runs before every commit from here (rule 15)
    - (was) L3-a · **#185 did not come back** — the 6 pages that had it (dressed99 141, 329, 332, 333, 34, 43), re-run in 6
      headed windows on an unmangled production build (`.next-b`, 3200): 0 page errors. Last seen in the 2026-09-30 sweep;
      ~76 dressed pages since, 0. Being stress-tested (`uat-pages.js --stress`: 3 × 150 characters typed with no delay
      into 12 text blocks, 3 rounds, Tablet ↔ Desktop switched between each) before anything is closed
    - `[x]` **#185 PART 2 + c-12b BUILT AND PROVEN, 2026-10-03.** The observer fix alone did NOT end it: on the fixed build #185
      came from the typing path (`onInput → onText → commit`). A stand-in devtools hook showed the last 60 commits before
      it were each a FULL builder re-render (page, canvas, 112 block views, Inspector…) — every key committed the whole
      site and wrote all of it to storage. MEASURED (c-12b's "measure first", `scripts/uat/probe-c12b.js`, six headed
      windows, pages built through the UI): 65 / 84 / 95 ms a key at 135 / 294 / 355 blocks; 185 / 279 / 353 ms with the
      CPU slowed 3×, and #185 in all three slowed windows after 150 characters. BUILT as decided: `EditableText` keeps the
      words while typing and sends them once typing pauses (400 ms) or the words could be lost (blur / Escape / Enter,
      page hidden or closed with `flushSync`, unmount). AFTER: **8.1 / 9.0 / 9.5 ms a key; 25.6 / 22.0 / 28.3 ms slowed 3×;
      0 errors.** Guards: `tests/e2e/typing-is-one-step.spec.ts` (≤ 2 saves for 40 keys — RED 41 · one Undo takes the burst —
      RED one letter · a reload mid-burst keeps the words), `EditableText.test.tsx` (pause / blur, fake timers),
      `inline-editing.test.tsx` updated (the edit arrives on blur); scenario in `box-builder-layout.feature`. HEADED UAT
      (`logs/c12b-stress-*.out`): the full stress — 450 characters into each of 12 blocks, Tablet ↔ Desktop between them,
      then Mobile / Tablet / Laptop / a reload — in six windows with the CPU slowed 3×, which crashed EVERY window before:
      **6 / 6 clean, 0 page errors**, and page 332's card row identical to the untouched control (three 380px columns,
      grow on) → **L3-b CLOSED: its live HOLE was #185's half-finished update, not a grow rule**
    - `[x]` **#185 PART 1 — the frame observer, 2026-10-02 ~23:00.** CPU slowed 3× (`probe-l3b.js --cpu=3`) reproduces it in every
      stressed window on the unmangled build: **13 of 13 thrown from ONE place**, the canvas frame's ResizeObserver
      (`app/website/box-demo/page.tsx`). Instrumented: the same 6,216px reported 30 times running, zoom 0.83 and room 740px
      unchanged — not growth, not a bounce. Its effect depended on `site`, which changes on EVERY key, so every key made a
      new observer and each one reported (and set state) once; fast typing on a slow CPU stacked them past React's 50.
      FIX: re-made only when the frame appears (`frameReady`, `preview`), and a report that changes < 0.5px sets nothing.
      GUARD `tests/e2e/frame-observer-stays.spec.ts` RED on the old code (observers grew with typing), GREEN on the fix;
      scenario in `box-builder-layout.feature`. HEADED proof: the same six throttled windows on the fixed build
      (`logs/l3-185-fixed-*.out`) — RUNNING
    - `[x]` **#185 REPRODUCED THROUGH THE UI, 2026-10-02 ~21:30** (`scripts/uat/probe-l3b.js`, `logs/l3b-probe.out`): page
      332's tree from BEFORE the words, then the stress typing through the UI, six headed windows: **4 / 4 full-stress
      variants hit React #185** (stress → Tablet · → Mobile → Tablet · → reload → Mobile → Tablet · → Laptop → Tablet);
      the control and ONE round of typing did not. After it, the card row is drawn for the wrong screen (gap term 14.144
      → 18.24 / 11.2 / 16.192px, cards 210–253px instead of 380) — so L3-b's live hole is most likely #185's half-finished
      update, not a grow rule. Next: the same run on an UNMANGLED build (`next build --no-mangling` → `.next-b`, 3200) for
      the stack, then the root fix (change 1, e-5/c-12a), then L3-b re-measured
    - `[x]` L3-b · CLOSED 2026-10-03 with #185 (above): after the fix the live row equals the reloaded one in 6 / 6 stressed windows. Was: **page 332 (noma careers) at canvas Tablet: a 241px HOLE, and canvas ≠ Preview at Tablet and Laptop on
      29 blocks** (a row of card · words · card at 33.33% each: 224px on the canvas, the line filled in the Preview).
      Reloading the tree saved BEFORE the words were typed gives canvas = Preview at 768 and 1024 — so it is in the tree
      after the words, or in the live canvas. The harness now saves that tree too (`page-N.final.site.json`).
      MEASURED 2026-10-02: the FINAL tree reloaded is also canvas = Preview at 768 and 1024, opened at Tablet or after
      Mobile (`probe-l3-row.js --tree=final.site --before=375`) — every column 458px at 768. In both runs the LIVE canvas
      drew the column at its 224px floor (R11 29.2% of 768) with 241px free. So it is live state, not the tree. The HOLE
      message now carries each column's drawn width, `flex` and `min-width`; the next run says which input was stale
    - `[x]` L3-e · HARNESS: `uat-pages.js --stress` did nothing — the parent hands its pages only `--sizes=`, so the first
      stress run (`l3-185-stress.out`) ran no stress phase (`stressed` empty on all 6). FIXED: `--stress` is forwarded;
      re-run as `l3-185-stress2.out`
    - `[x]` L3-c re-run · HEADED (`logs/l3f-stress.out`, 6 windows, --stress, .next-c FRESH, 19 min): 0 page errors on all
      6 pages (#185 stays fixed); page 141 has no W7a left → L3-c CLOSED
    - `[x]` L3-b CLOSED AGAIN 2026-10-03 with L3-p (332: no Tablet HOLE, no R11 in `l3p-fixed` / `c11b-fixed`). REOPENED 2026-10-03: the same run shows page 332's 241px HOLE at canvas Tablet with 0 page errors — the
      close rested on `probe-l3b.js`, not on the page run. Diagnostic re-run `logs/l3f-diag.out`
    - `[x]` L3-f · CLOSED 2026-10-03 — HARNESS, measured (`logs/l3f-diag.out`, R11 now prints left): on the LIVE canvas the
      rotating hero's slides sat at left -200% vs 0% in the Preview — the typing into slide 3 left the canvas ON slide 3
      (right for an editor), the Preview opens on slide 1 (right for a visitor). Which slide shows is view state, not
      layout: `uat-pages.js` now puts every canvas pager back to slide 1 before measuring (and logs it). Re-run to confirm
      with the next page run
    - `[x]` L3-p · CLOSED 2026-10-03 on the headed re-runs (`l3p-fixed.out`, `c11b-fixed.out`: 223 0 errors). **ROOT FOUND AND FIXED 2026-10-03 (with L3-b and L3-o — one bug).** Reproduced THROUGH THE UI with NO
      stress: `probe-l3p-build.js` (new) builds a dressed page with the Dresser, then diffs every block's computed flex
      live vs reloaded — 21 / 34 / 28 / 26 blocks differ on 223 / 333 / 359 / 382 (`logs/l3p-build.out`), every column of
      a dragged row at grow 0 live, 1 reloaded; the R11 detail (`uat-pages.js` now prints the canvas's flex / min-width /
      inline style) showed `flex-shrink: ; flex-basis: ;` in their style. CAUSE: `naturalHeightOf` (every resize start,
      on the block ABOVE the edge) turns its children's grow off and "restores" `flex-grow` read with
      `getPropertyValue` — but a column's `flex` is a shorthand holding `var(--bx-gut)` (`gutterCSS`), which is not
      split into longhands, so it read "" and REMOVED it, breaking the shorthand; React never rewrites an unchanged
      prop, so it stayed until a reload. (`probe-l3p.js`, a row on its own, and `probe-l3b.js` from a reloaded tree
      never reached it: no block under the row / no live drags.) FIX: put back the whole `style` attribute (and the grid
      drag's `put`/`restore` the same — ledger 3). GUARD `tests/e2e/drag-keeps-flex.spec.ts` (6 cases): RED 3/3 "block
      under the row" on the old build (all three columns broken), GREEN 6/6 on the fix (.next-b, 3200, FRESH); scenario
      outline in `box-builder-layout.feature`; in package.json + test-fast.js. HEADED re-run of the six pages:
      `logs/l3p-fixed.out`. Was: page 223 (live canvas): the wrapped 4th cell drawn at its 224px floor (29.2% at 768) vs filling its
      line in the Preview (54.1%) at Tablet → Wide. The final tree RELOADED gives canvas == Preview (416px both at 768) —
      live state, like L3-b and probably L3-o (359). Not a cache (the canvas recomputes `childStyle` each render) and not
      a stray inline style (the row drag writes none). `probe-c11b.js --live` did not reproduce it on a fresh full-width
      row — its first "DIFFERENT" was my measurement (screen px, the canvas zoom changed on reload: every ratio 1.75)
    - `[x]` L3-t · CLOSED 2026-10-03 — HARNESS, measured: the headed windows ran at Windows' display scaling, so a 390px window measured 390.40 and the Preview's page 375.2 against the canvas's exact 375; 0.2px wrapped a 1,408-character quote two lines fewer (57px; source found by `probe-l3t.js`, traced by `logs/l3t-chain.js` / `l3t-anc.js` to `html` itself). FIX `h.js`: `--force-device-scale-factor=1` + `deviceScaleFactor: 1`. PROVEN: 333 at 375, 22 blocks differ → 0; `html` 390.40 → 390.00. Was: page 333 after the stress: canvas ≠ Preview in HEIGHT (≈35–110px) at Mobile · Laptop · Desktop · Wide
      (2026-10-03: 333 had 34 blocks drawn un-grown live by L3-p — re-measured on the fixed build before anything else)
    - `[x]` L3-u · HARNESS (proven: 141 0 errors, its reset logged, `c11b-fixed.out`) (found 2026-10-03, `l3p-pages.out`): page 141 at Mobile — the pager's slides at -16.9% vs 0%
      AFTER L3-f's reset. A pager is `scroll-behavior: smooth`, so `scrollLeft = 0` ANIMATES and 300 ms later it was 83%
      home. FIXED: `scrollTo({ left: 0, behavior: 'instant' })` in `uat-pages.js`; proven by page 141 in the next run
    - `[x]` L3-v · MY OWN, the same hazard as L3-p one edit away: the grid drag's preview `put`/`restore` remembered
      each property with `getPropertyValue` — FIXED with L3-p (the whole `style` attribute); grid specs run in the gate
    - `[x]` L3-x · GUARD BUG (found closing L-3): `task-tree-batches.test.ts` read the indented lines of ANY top-level
      item after a batch (AREA V) as that batch's, so closing L-3 failed on AREA V's open work. FIXED: another top-level
      item ends the batch; new case "an AREA's open lines under a closed batch are not the batch's"; MUTATION-PROVEN (the
      fix removed → the real tree and the new case red; restored → 8/8)
    - `[x]` L3-y · MY OWN: a stray `git stash push`/`pop` in that mutation check popped an OLD stash (`feature/teacher`)
      onto `app/website/box-demo/page.tsx` as a conflict. Undone: the file restored from HEAD (it held no uncommitted work);
      the stash entry is still in the list, untouched (5 entries). No stash commands in checks from here
    - `[x]` L3-w · AUDIT (found 2026-10-03 on the fixed build): the canvas HOLE check ignored the GUTTER — since S1-a it is
      half a gutter of margin on each column, while the check added the band's `column-gap` (0px). Page 359 at 1024: a
      224px column "could come up" into 234px, needing 240. FIXED in `page-audit.js` (the waiting column's margins + the
      last column's right margin). PROVEN both ways (`logs/l3p-audit-both.js`, 359's saved site): old audit HOLE → new
      none; the same row made into a REAL hole (middle 100px, waiting column 400px basis) → reported by both (305px)
    - FIXED-BUILD HEADED RE-RUN (`logs/l3p-fixed.out`, 6 windows, stressed, .next-b FRESH): 223 4 → 0 errors · 141 1 → 0
      (L3-u) · 332 R11 + Tablet HOLE → gone · 359 R11 (40 blocks) → gone · 333 4 R11 → 1 (Mobile heights, L3-t) · 382 1 →
      1. The HOLEs left: 359 Laptop (L3-w, false) · 332 Wide (a row stored 145%, the recorded GAP "30 · 10 · 25 wraps
      at Desktop" — no HOLE on the new audit) · 359 Tablet and 382 Wide = c-11b (rows stored 100.15 / 100.01: the last
      icon cell drops to a line of its own)
    - `[x]` c-11b · **FOUND, FIXED, GUARDED 2026-10-03 — HEADED `logs/c11b-fixed.out`: 0 rows stored 100–101% on 6 pages, 359 and 382 0 errors.** DEBUG=1 live builds
      (`logs/c11b-debug.out`, 4 windows): every over-100 row is the dresser's gesture — widen the first two until the 4th
      wraps, then NARROW the third so the 4th comes back (359: 100.15 · 382: 100.01). The drag gives the dragged column and
      its followers `room = maxW − startLeftPx`, from where it is DRAWN, while the columns before it keep their STORED
      shares; and the line before it already stored 100.01 (42.71 + 41.62 + 15.68), DRAWN as one line (#131's one-pixel
      slack) while `packRowLines` called its third column wrapped — so a cap from the stored packing found nothing before it
      (my first fix: measured, did nothing, 100.15 again). FIX (`BoxCanvas` flow drag): the room is capped at 100 − the
      stored shares of the blocks before it on its DRAWN line. PINNED (RULE Y, after the UI repro):
      `probe-c11b-pin.js` + `tests/e2e/row-never-stores-over-100.spec.ts` on 359's own saved site (fixture
      `c11b-page359.site.json`, the row put back as before the third drag): RED 100.15 / 100.15 / 100.16 on the old build,
      GREEN 4/4 (99.99) on the fix; a drag too short to make room still leaves the 4th below (122.21, by design). Scenario
      in `box-builder-layout.feature`. The UI-built version of the spec could not fail on either build (its icon cells
      kept a 113px floor, the 4th never came back) — a guard that cannot fail, replaced (ledger 5, RULE V)
    - `[x]` (closed with L3-f above — the pager reset in the harness; its instant form L3-u) L3-f MEASURED 2026-10-03: the reloaded final tree has NOTHING scrolled on either side (no scrollLeft / scrollTop
      > 0) and the flagged blocks are the rotating hero's slides at the same places — so either the LIVE canvas was
      scrolled after the typing, or it is the audit. R11 compares LEFT too and never printed it: the harness now prints
      `left c vs p` and logs every box scrolled sideways on the live canvas (`uat-pages.js`); re-run `logs/l3f-diag.out`.
      Was: page 141 after the stress typing: canvas ≠ Preview at all 5 rungs on 12 blocks whose SIZES match
      (100%×3708 vs 100%×3708…). INFERRED: typing into the rotating hero's hidden slides scrolls the pager on the canvas,
      while the Preview opens on slide 1 — so the comparison reads positions inside a scrolled pager. To be MEASURED
      (the blocks' left positions, the pager's scrollLeft on both sides) before calling it harness or product
    - `[x]` L3-g · CLOSED 2026-10-02 with L3-h / R-24: ids are new on every run; `gx-6` is the same HEADER row (the same "-6" slot, the same 250px) — the re-run with the new audit showed only that row at 141 Mobile, and R-24 explained it. Was: page 141 at canvas Mobile: HOLE 250px at the end of a line of gx-6 — a second LIVE-canvas hole, like
      L3-b. The run had the old audit loaded, so no column details; the next run of it carries them
    - `[x]` (closed by "L3-c re-run" above: page 141 has no W7a left) L3-c · page 141: 71 × W7a "headings closer than 1rem to the page edge" at -295px / -670px — "Welcome to our
      school 2 / 3", the rotating hero's slides that are off screen. HARNESS: W7a measured a run's rect, not what a reader
      sees of it; a waiting slide that starts inside the window (-153px) is cut by the pager's own box. FIXED in
      `page-audit.js`: the run is clipped by every box that cuts its overflow, and skipped when nothing is left. Guard
      `page-audit-whitespace.spec.ts` "a pager's slides…" at 375/768/1280/1920 — red on the old audit (3 runs flagged),
      red with the skip disabled, 55/55 audit specs green. Waiting: page 141 re-run through the UI on the fixed audit
    - `[x]` L3-j · CLOSED 2026-10-03 on the user's "stop it": chain + measurer stopped, nothing research left running,
      free memory 0.5 → 3.9 GB (aw-coll-menu resumes when the Navigation component's research starts). Was: research still RUNNING after R-1 closed — `educo-research/r1-aw.sh 1 2`
      (PID 40232) moved on to `aw-measure.js aw-coll-menu` at 04:21, beside L-3's testing (RULE RS forbids it). The
      session was NOT permitted to stop it → the user's call: stop it (it resumes) before the six-window runs
    - `[x]` L3-k · MY OWN: ran one vitest file (4 s) while `c11-measure` (Playwright) ran — rule 15. Its timings are checked
      for contention before anything is trusted from it; no vitest again until a browser run ends
    - `[x]` c-11a · CLOSED 2026-10-03 — comment corrected (`box-model.ts`, packRowLines header), no behaviour change, box-model 221/221. **DECIDED by the user 2026-10-03: "Fix the comment only"** (asked with this session's measurement: #131's
      one-pixel slack draws a line stored at 100.01 as ONE line while `packRowLines` calls it two; 100.4 the browser wraps,
      as `packRowLines` says; c-11b stops drags writing such rows). To do: the stale sentence at `box-model.ts` 4379
      ("a hair over 100 is still one line — … round to 100.4 …") corrected; no behaviour change. Was — **THE USER DECIDES:** the handed-over step said "a line that rounds to 100.4% must be one line, as its own
      comment says"; the measurement says a browser WRAPS it (#69), so making the model call it one line would make the
      model disagree with every page it draws. Recommended: fix the stale COMMENT only (no behaviour change) and stop rows
      being stored over 100% (c-11b). MEASURED FIRST, 2026-10-03: the premise contradicts #69 (`box-model.test.ts` "a line breaks exactly where
      a BROWSER breaks it" — 50.3 + 50.1 is two lines) and the gutter arithmetic (each slot = its stored share of the widened
      band, so 100.19% overflows → 3 + 1, which `packRowLines` already says). The top comment ("a hair over 100 is still one
      line") is the stale part. Being measured on pages 223 / 359 / 382 rebuilt through the UI (`logs/c11-measure.out`)
    - `[x]` (superseded: c-11b CLOSED 2026-10-03 — the writer was the narrow-the-third drag, see the c-11b line above) c-11b · `probe-c11b.js` (new): a row of words + 3 icon cells built through the UI, dragged by the harness's own
      `sizeColumns` to 6 share sets → all store ≤ 100% (99.91–99.98). A plain drag is not the writer; next: the rebuilt trees
    - `[x]` c-11c · BUILT (decided B) + HEADED in `uat-l3-headed.js` 6/6 (the 8 e-6 pages: checklist line (4), with the batch close): `holdsWords` in `tabletPlaces` + the audit's L6 check (a cell of icons only does not
      count; ≥ 2 cells with words or a card). Guard in `box-model.test.ts` RED before, GREEN after (221/221).
      Scenario Outline in `box-builder-layout.feature`. Typecheck 0. HEADED check → `uat-l3-headed.js` (the ticks row)
    - `[x]` L3-l · the Divider's THICKNESS reached the page as px (2–20px) on the canvas AND the export — rule 16; the units
      guard only ever saw the default. FIXED: `dividerThickness()` in `box-model.ts`, called by both — PLAIN rem (`remLen`),
      1px stays a hairline. My first fix used the fluid `u()`: the headed pass measured 12px drawn as 8px on a phone and
      16.8px on Wide → plain rem. Guard `units-not-pixels.test.ts` RED (19 values) → GREEN, + "12 → 0.75rem"
    - `[x]` L3-q · MY OWN (the headed script): the Thickness slider is on the Content tab (the script never chose it), and a
      row dropped "under" a cell lands INSIDE that cell — both fixed; a failed window now saves a screenshot
    - `[x]` L3-r · a Divider with a thickness set was PADDED 27.36px each side (`hasVisibleEdge` read its `borderWidth` as a
      box border), so its line started 28px in from the words — seen only in the SCREENSHOT, every number passed. FIXED
      in `hasVisibleEdge`. Guard `space-by-default.test.ts` RED (24 each side) → GREEN; the headed check "line level with
      the heading" RED on the old build (10 findings in each of 6 windows, 17–34px) → GREEN
    - `[x]` L3-s · exposed by L3-r: a 1–2px Divider is a 3–6px box — "cannot drop under" in 2 of 6 windows (a fresh Divider
      was always so). FIXED: a Divider breathes ABOVE and BELOW only (half a stack gap, 0.5rem; sides 0 — new blocks only,
      saved pages keep theirs, the user can set 0). Guard in `space-by-default.test.ts`
    - `[x]` **R-23 / change 5 HEADED UAT — CLOSED 2026-10-03** (`uat-l3-headed.js`, 6 windows, .next-c on 3400, FRESH):
      Light 1 · Purple Dream 2 · Dark 4 · Midnight 8 · Light 12 · Dark 20px — 6/6 CLEAN at 375 · 768 · 1024 · 1280 · 1920,
      canvas AND Preview: `<hr>` with role separator (accessibility tree on both), margin 0, side borders none, the
      thickness asked, the theme's colour, canvas == Preview, the line level with the words, 0 page errors; the ticks row
      one line at Tablet (c-11c) and four cells of words 2 + 2 (#78). Screenshots read (`logs/uat-l3/`)
    - `[x]` L3-n · HARNESS (FIXED + re-run `l3n-223.out`: the rows are now dragged; they still wrap at Desktop by #102, recorded as a GAP): `c11-measure` (pages 223/359/382, 0 errors on 223) did NOT size page 223's four ticks rows — "on
      one line at no screen size". MEASURED (`probe-l3-row.js --band=murv1fmb-2k`): at Desktop 24.99·24.99·25·25.02 wraps
      3 + 1 on canvas AND Preview, because the words cell's longest word is 157px against a 137px share (#102, by design);
      at Wide the row was 70.93·10.01·5.69·13.36 — the dresser had sized it at WIDE, which branches off (rule 18), so the
      desktop never got the widths. FIX `build-page.js sizeColumns`: widen to Desktop only; a still-wrapped row is dragged
      anyway (as a person would), a gap only if it wraps after. So c-11b/c-11a's "0 over 100%" on 223 proved nothing yet —
      re-run `logs/l3n-223.out` on the fresh `.next-b` build
    - `[x]` L3-o · CLOSED 2026-10-03: its R11 was L3-p, its Tablet HOLE c-11b, its Laptop HOLE the audit (L3-w) — 359 0 errors in `c11b-fixed.out`. Was: page 359 (`c11-measure`): HOLE 96px at canvas Tablet (row 0-59, a 54.44% column 243px) and R11 canvas ≠
      Preview at Tablet / Laptop on 40 blocks (heights 5478 vs 5251). Re-run with 223; then measured like L3-b
    - `[x]` L3-d · HARNESS (c-12c): a page error kept only its first line, with no step — `h.js` now keeps the stack and
      `page.__step`, `uat-pages.js` writes them as `pageErrors` and names its phases (pictures, words, canvas audit per
      preset, Preview)
  - checklist (written 2026-10-02, BEFORE the pass; HEADED, six windows, built through the UI, canvas AND Preview,
    all four themes, Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920 + the device presets):
    - `[x]` (1) c-12a: #185 reproduced through the UI (a long page, 3 × 150 characters typed, repeated), with the full
      stack and the step it happened on kept. The guard spec is RED first (a `pageerror` matching #185 fails it) — SEEN:
      `probe-l3b.js` 4/4 stressed variants hit #185; `frame-observer-stays.spec.ts` + `typing-is-one-step.spec.ts` red→green
    - `[x]` (1) c-12c: the harness keeps a page error's whole stack and the step it happened on (`h.js`, `uat-pages.js`) — L3-d
    - `[x]` (1) after the fix: 0 #185 on all 9 e-5 pages (+ idx 34, 43, tier-95 page 0, tier-80 page 26), run in
      parallel; typing still works, Undo still works and the text survives a reload — SEEN: `l3f-stress.out`,
      `c12b-stress-*.out` (6/6, CPU ×3), and 2026-10-03 `l3p-pages` / `l3p-fixed` / `c11b-fixed` (18 stressed page runs, 0 page errors)
    - `[x]` (2) SUPERSEDED by the user's c-11a decision 2026-10-03 ("fix the comment only" — no packing change, so no packing guard); the second half — each column's flex the same on canvas and Preview at 768 — SEEN: `drag-keeps-flex.spec.ts` + `l3p-fixed` / `c11b-fixed` (0 R11 width findings). Was: guard `packRowLines([70.04, 9.99, 10.14, 10.02])` is red before the fix and green after;
      at 768, each column's computed `flex` and `margin-right` read the same on the canvas and in the Preview
    - `[x]` (3) the rows that store more than 100% are counted in fresh trees; what writes them is found through the UI
      (a drag or the dresser) and fixed, with a guard — SEEN 2026-10-03: the dresser's narrow-the-third drag (DEBUG=1),
      fixed (drawn-line cap), `row-never-stores-over-100.spec.ts` red→green; `c11b-fixed.out`: 0 rows stored 100–101% on 6 pages
    - `[x]` (4) a line of three icon cells + one cell of words at Tablet stays on one line; two cells of words + two
      icon cells are rearranged. The engine and the audit agree on every one of the 8 e-6 pages (0 L6 findings left
      that the engine does not act on) — SEEN: `uat-l3-headed.js` 6/6 (c-11c)
    - `[x]` regression — HEADED 2026-10-03, six windows, fresh `.next-c` (lNMRuyfu): probe-spacing Light 125/125 · Dark 125/125, probe-s2 Midnight 132/132 · Purple Dream 132/132, probe-l2-acc 0 blocks differ at 768, probe-saved-page CLEAN; F-1's guards in the green gate (test:fast 803); screenshots read (`probe-s2-out/Midnight/preview-1024.png`, `probe-l2-acc-out/w768-canvas.png`). Was: F-1's guards, probe-spacing, probe-s2 and L-2's probes show 0 findings; a page saved before L-3
      keeps its widths
- `[>]` **AREA V · THE PAGE COMES ALIVE — blending, effects, motion, colour, for EVERY block** (the user, 2026-10-03, after
  L-3 is nearly done: "how a layout blending into each other… transition… animation… scrolling… moving between sections…
  each section being a straight line horizontal, we can have it in any shape… background colour, gradient, switches,
  effect, transition, animation… the user being able to select anything… a user can create their own colour… not only for
  the layout… components… elements like text field"). STEP 1 (now): INVESTIGATE what we have — research AND code — and
  report back what I understand; nothing built until the user confirms. Folds in: S-2 (section transitions, queued), the
  motion Batches A / B, R-2 (the CSS property side: backgrounds, gradients, colour). Applies to sections, components and
  elements alike (RULE A capability parity)
  - `[x]` STEP 1 investigation 2026-10-03: two read-only readers (research + code), reported to the user
  - `[ ]` **RULE UI (the user, 2026-10-03 — now in CLAUDE.md):** everything built is in the builder, easy to select AND
    make your own. Part of AREA V: (a) every V family ships with its control, presets + "make your own"; (b) an AUDIT of
    what is ALREADY built for capabilities with no control or a control the export ignores — known so far: per-device
    backgrounds (banner says "size & layout only", V-5) · Advanced CSS offered only on components · the legacy
    `gradient:` only from the bulk inspector · motion tokens internal only · image / overlay controls on a Button the
    export drops (V-1)
  - `[?]` the user's three answers: understanding right? · the order? · named effects only, or free sliders too?
    (RULE UI answers the third in part: ready-made AND make-your-own)
  - LEDGER of V (found by the code reader, NOT yet verified — each measured before it is called a bug):
    - `[ ]` V-1 · a Button's export reads only `background` — a gradient / image set on it (`bgImage`) is dropped (`box-export.ts:144`), while the Inspector offers it
    - `[ ]` V-2 · components drop `bgOverlay` (`componentBoxCss` has none)
    - `[ ]` V-3 · a legacy `gradient:#a:#b` value is written raw by `componentBoxCss` — invalid CSS on a component
    - `[ ]` V-4 · "Tint over background" uses a 6-digit-hex-only field — no alpha, so the tint is opaque; its `mode="both"` is ignored
    - `[ ]` V-5 · the per-device banner says "size & layout only change here", but `patchAt` stores EVERY non-content key per device (backgrounds too)
    - `[ ]` V-6 · `REVEAL_DUR` falls back to .55s (`interactions.ts:212`) against the 320ms "slow" token
    - FOUND 2026-10-03 by the R-2 inventory (read in the code — each is REPRODUCED through the UI first, then fixed with
      a guard red first, in AREA V's first batch, colour & backgrounds; RULE V):
    - `[ ]` V-7 · the GradientEditor writes `radial-gradient(circle at 50% 50% …)` / `conic … at 50% 50%` whatever it was
      given (`GradientEditor.tsx:80-81`) — editing a radial preset silently drops its shape and position
    - `[ ]` V-8 · a gradient STOP edited in the GradientEditor goes through the hex-only colour field — its alpha is lost
    - `[ ]` V-9 · a gradient BASE fill is dropped whenever a photo / `bgImage` is set (`box-model.ts:1028`)
    - `[ ]` V-10 · a band's SHADOW is clipped away by its own edge shape (the edge's `clip-path`)
    - `[ ]` V-11 · the shadow scale is emitted as LITERAL values (`box-model.ts:1131`, `box-export.ts:86`) while the
      `--eu-shadow-*` tokens are emitted unused (`tokens.ts:163`) — a theme can never restyle shadows (Core Rule 17)
    - `[ ]` V-13 · (found by the R-2 states proof) VERIFY the builder keeps two rules: (a) a block's OWN hover / focus / press beats a
      state driven from its parent (parent-driven rules at zero specificity, `:where`), and (b) no base look is INLINE where a
      state may change it (an inline background beats every `:hover` rule) — the canvas draws with inline styles, so the
      existing interactions (`lib/interactions.ts`) are checked first; any that lose are bugs, fixed with a guard red first
    - `[ ]` V-12 · the contrast hint shows only on component colour tokens (`BoxInspector.tsx:1786-1792`), never on a
      block's own text / background colour — RULE 4 / 17 ("contrast is ASSERTED") on the commonest case
- `[ ]` **BATCH U-1 · Surface what is ALREADY built (RULE UI, the user 2026-10-03: "this rule must also follow existing
  stuff that we've done… something a user has to create")** (QUEUED; area: builder controls). Step 1: an AUDIT —
  every field the engine reads (`BoxNode` in `lib/box-model.ts`, presets, components, interactions) set against the
  Inspector / palette control that reaches it, for every block kind: no control · a control hidden or misleading · a
  control the export ignores · presets only with no "make your own". Step 2: the user sees the list and orders it; then
  batches of ≤ 6 by area, each HEADED-tested through the UI. Known so far: V-1 · V-5 · Advanced CSS on components only ·
  legacy `gradient:` only from the bulk inspector · motion tokens internal only
- `[>]` **BATCH R-2 · Everything an element can be styled and do — the full property set** ← YOU ARE HERE (next leaf: step 7 — the "enough" checklist to the user to SIGN; steps 1–6 done, session 35640e85) (QUEUED 2026-10-03, the user:
  "typography, types, utilities, background colour… transition… all of the exhaustive stuff an HTML element on a page
  might need"). Motion / events / elements are covered and signed (R-1, `html-semantics.md`, `dom-element-api.md`); the
  CSS PROPERTY side has no signed "enough" checklist: the CSS coverage map (memory `project_css_coverage`, MDN's 68
  modules) is from 2026-09-02, lists several Missing, and was never re-checked against today's builder. RULE RS: the
  user's sources + my own, every property family checked against what the builder emits, then an "enough" checklist
  signed by the user. Starts AFTER L-3 closes (one job at a time)
  - `[?]` **WAITING FOR THE USER'S LINKS** — the user, 2026-10-03: "I'm going to give you my own list of websites to look
    at… this afternoon". Their list + my own sources (MDN backgrounds / gradients / blend modes / filters / shadows,
    colour-picker patterns) run side by side (RULE RS), every link read completely (RULE R), in parallel windows —
    never beside an L-3 test run. Scope: gradients · overlays · shadows (incl. gradient / glow) · box effects · colour
    picker and the user's own colours · section shapes and blending
    - THE USER'S LINKS (completeness list, RULE R — each read completely before it is marked done):
      - `[x]` https://webgradients.com/ — **2026-10-03: 661 pages read (every gradient page), 0 errors** — (2026-10-03) — every gradient on it, each opened and its CSS read (stops, angles,
        type), how each is made, which the builder can already draw (GradientEditor: linear / radial / conic, stops,
        angle) and which it cannot; plus the site's own UI for picking and copying a gradient (a reference for RULE UI)
      - `[x]` https://uigradients.com/ — **2026-10-03: all 377 gradients (one page holds the whole collection)** — (2026-10-03) — every gradient in its collection (all of them, not a first page),
        each one's colours and direction, how its picker / browse / copy UI works, compared with webgradients
      - `[x]` https://grabient.com/ — **2026-10-03: SATURATED — 927 pages, 13 gradient techniques, last new at page 533, then 393 in a row with none (a generator: its palettes never end)** — (2026-10-03) — its gradient generator: every control it offers (how a user makes
        their own), every preset, the CSS it emits
      - `[x]` https://cssgradient.io/ — **2026-10-03: 23 pages (generator + every on-topic guide), queue empty** — (2026-10-03) — the generator (types, stops, angle, positions, colour input) AND
        every page it links to on the topic (its gradient guides / swatches / tools), each read completely
      - `[>]` https://webflow.com/made-in-webflow/overlay — **27 listed; re-measuring with the SURFACE recorded (R2-26)** — (2026-10-03) — EVERY project in the listing (all pages / all
        "load more"), each opened and run live (hover, scroll, click), its overlay technique read and written down item
        by item: what sits on top (colour / gradient / image / blur / blend), when it appears, how it animates
      - `[x]` https://www.convertflow.com/campaigns/popup-overlay-examples — **2026-10-03: 18 pages, queue empty; the modal pattern proven in r2-states (click · dim + blur backdrop · focus in · Escape · focus back)** — (2026-10-03) — every popup / overlay example on
        the page and every example page it links to: its trigger (on load, on scroll, exit intent, a click), how it
        enters and leaves, the backdrop (dim, blur, colour), how it is closed (button, Escape, outside click), focus and
        accessibility, and how it behaves on a phone. NOTE: a popup is a COMPONENT (a modal / dialog) — it feeds the
        component rebuild and needs the user's approval before it is built (rule 13)
      - `[x]` https://mobbin.com/explore/web/ui-elements/full-screen-overlay — **SKIPPED by the user 2026-10-03 · NEEDS AN ACCOUNT: the first page shows ~40 screens, then "Log in or join for free to continue browsing" — the user decides (never a workaround)** — (2026-10-03) — every full-screen overlay
        screen in the collection (all of it, scrolled to the end): what it covers, what it holds (menu, search, video,
        form), how it opens / closes, its backdrop. CHECK FIRST: Mobbin usually needs a signed-in account to show more
        than a preview — if it does, the user is asked for access (never a workaround) and the line stays open
      - `[x]` https://webflow.com/made-in-webflow/shadow — **2026-10-03: all 7 measured live, surface recorded (R2-26 re-measure)** — (2026-10-03) — EVERY project in the listing (all pages / all
        "load more"), each opened and run live, its shadows read from the code item by item: box / drop / text / inset,
        layered, coloured or gradient (glow), soft vs hard, how a shadow changes on hover or scroll — compared with the
        builder's elevation scale and `library/10-surface.md` (HAVE / PARTIAL / GAP)
      - `[x]` https://codepen.io/Syed-Faraz-Ahmad/pen/PoXbeqq — **2026-10-03: run and read in full (pens-r2-single)** — (2026-10-03) — run live, its HTML / CSS / JS read in FULL
        (never cut), how the effect is made written down step by step, what a builder control for it would need
      - `[x]` https://codepen.io/tag/shadow — **2026-10-03: SATURATED at page 63 — 326 pens with full code, 150 in a row added nothing** — (2026-10-03) — NOT collected before (checked: no shadow tag in
        `docs/web-anatomy/codepen/`; only getcssscan's 95 box-shadows in `research-runs/`). EVERY listing page to the end
        with `cp-tag.js` (it resumes, R-21 fixed), every pen opened and its code read in full, how-it-is-done per pen via
        `cp-how.js`, saturation measured; in parallel collectors, never beside a UAT
      - `[x]` https://codepen.io/tag/overlay — **2026-10-03: SATURATED at page 84 — 501 pens** — (2026-10-03) — NOT collected before (checked: nothing named overlay in
        `docs/web-anatomy/codepen/`). Same method as the shadow tag: every page, every pen run and read in full, how each
        overlay is made (colour / gradient / image / blur / blend, on hover, on scroll, full screen)
      - `[x]` https://dribbble.com/tags/colorpicker — **ENOUGH, the user 2026-10-03 · 2026-10-03: the listing + 98 shots read and every screenshot OPENED (picker
        controls per shot + patterns: `area-v/picker-shots.json`); 18 "shots" were captcha pages saved before R2-24 (R2-36) —
        removed and re-crawled, 17 recovered; 1 + 21 queued shots NOT read: Dribbble shows Human Verification again (stepped
        down) — retried later, never worked around** — (2026-10-03) — EVERY shot in the tag (scrolled to the end), each opened
        (its full images, and video where it has one): the colour picker's layout and controls — spectrum / wheel /
        sliders, hex / RGB / HSL / OKLCH entry, transparency, eyedropper, saved and brand swatches, gradient stops,
        contrast hints — written down per shot, then the patterns that repeat. Designs, not code: it decides what the
        builder's picker should LOOK and FEEL like (RULE UI), compared with today's `EducoColorField`
      - `[x]` https://dribbble.com/search/color-picker — **ENOUGH, the user 2026-10-03 · BLOCKED: Dribbble answers "Human Verification" from page 13 — stepped down (RULE RS, R2-24); 21 search pages read, no shot reached; the tag above covers the same designs** — (2026-10-03) — every result to the end, the same per-shot notes;
        shots already read from the tag above are recognised and not read twice (only new ones added)
      - `[x]` https://codepen.io/tag/colorpicker — **2026-10-03: read to the end — 182 pens** — (2026-10-03) — every page, every pen run and its code read in full: how a
        working picker is BUILT (canvas / gradients for the spectrum, pointer + keyboard on the thumb, colour maths
        HSV ↔ RGB ↔ OKLCH, alpha, the native EyeDropper API, accessibility of sliders) — the code side of Dribbble's designs
      - `[x]` https://www.magnific.com/free-photos-vectors/website-divider-shapes — **2026-10-03: 548 pages (listing + items, depth-limited, R2-19); shape families tallied — scallop · drip · mountain · brush added to the map** — (2026-10-03) — every divider shape in the
        listing (all pages): the shape family (wave, curve, tilt, zigzag, layered, torn, blob), single vs stacked layers,
        how it would be drawn (SVG path / clip-path / mask), which the builder's 4 `BandEdge` shapes already cover. Check
        the licence before anything is reused: the shapes are STUDIED, our own are drawn (RULE R, never copied)
      - `[x]` https://codepen.io/tag/divider — **2026-10-03: read to the end — 86 pens (+ dividers 11)** — (2026-10-03) — PARTLY collected in R-1 (step 4: 75 pens, stopped at the
        user's "enough"; `cp-tag.js` RESUMES): finish every page, read every new pen in full, then `cp-how.js`
      - `[x]` https://codepen.io/tag/frosted-glass — **2026-10-03: read to the end — 36 pens** — (2026-10-03) — every page, every pen run and read in full: how the glass is
        made (`backdrop-filter: blur()` + saturation, a translucent fill, a light border / highlight, noise), its fallback
        where `backdrop-filter` is missing, its contrast over a busy photo, and its cost on a low-cost Android (RULE AF)
      - `[>]` https://webflow.com/made-in-webflow/glassmorphism — **47 listed; re-measuring with the SURFACE recorded (R2-26)** — (2026-10-03) — EVERY project in the listing, each opened and
        run live: where the glass sits (header, cards, modal, hero panel), what is behind it, blur strength, border /
        highlight, how it moves on scroll or hover — the real-site side of the frosted-glass pens
      - `[>]` https://www.awwwards.com/websites/texture/ — **805 listed; re-measuring with the SURFACE recorded (R2-26), --saturate=50** — (2026-10-03) — EVERY site in the category (all pages), each live
        site visited and measured with `aw-measure.js` (it resumes): what the texture is (grain / noise, paper, fabric,
        pattern, an image), how it is made (SVG `feTurbulence`, a tiled image, CSS gradients, canvas), where it sits
        (whole page, a band, behind text), whether it moves, and its weight on a 360px phone on 3G (RULE AF)
      - `[x]` https://codepen.io/tag/texture — **2026-10-03: SATURATED at page 54 — 319 pens** — (2026-10-03) — every page, every pen run and its code read in full: how each
        texture is BUILT (SVG `feTurbulence` grain, CSS gradient patterns, a tiled image, canvas noise), how it is layered
        over colour or a photo (opacity, blend mode), its weight — the code side of the Awwwards texture sites
      - `[x]` https://codepen.io/tag/curves — **2026-10-03: read to the end — 77 pens** — (2026-10-03, link 21, sent during L3-p) — every listing page to the end, every
        pen opened, run live and its code read in FULL: how each curve is BUILT (SVG path / `clip-path` / `border-radius`
        ellipses / masks / canvas), whether it is a section edge, a divider, a background shape or a moving line, how it
        responds to width, and its weight — feeds AREA V's "section shapes & blending" batch beside the divider and wave
        tags (R-1). In parallel collectors, never beside a UAT
    - **THE METHOD, INSIDE EVERY LINK (the user, 2026-10-03, during wave 1: "click inside each link… we want to study
      everything that each of this item has in each of this link").** A listing is only the way in:
      - CodePen tags → every pen on every page OPENED and RUN (scrolled, hovered, screenshotted), its FULL html / css / js
        saved and read, how it is made written per pen (`cp-tag.js` + `cp-how.js`)
      - galleries (Webflow showcases, Awwwards) → every item listed (`src-list.js`), then EACH item opened, its "Visit"
        followed to the LIVE site, and that site met as a visitor does — loaded, scrolled, hovered, clicked, desktop and
        phone — the overlay / shadow / glass / texture read from its own code (`aw-measure.js`)
      - tool / collection sites (webgradients, uiGradients, Grabient, cssgradient.io, ConvertFlow, Dribbble, Magnific,
        Mobbin) → every ITEM opened (each gradient, example, shot, shape) AND every on-topic link inside the site followed
        and read; each site gets a completeness list here (what it holds · what is read) and is never marked read on its
        front page or thumbnails
    - **DECIDED by the user 2026-10-03: research "until saturated"** — and the test of enough, in their words: "until we
      understand what that thing is… the gist of virtually any variations that we want and we can do it — then we stop".
      Written into RULE R (CLAUDE.md, guarded). Small sources complete; CodePen tags `--saturate=150`, Awwwards texture
      `--saturate=50`; the stopping points recorded here with their numbers. Running from 10:39: `r2-saturate.sh` +
      `r2-sites.sh` (6 windows, 6.1 GB free at start)
    - **THE ORDER TO "ENOUGH" (RULE MAP, agreed with the user 2026-10-03):** `[x]` 1 the axis map (`area-v/AXIS-MAP.md`) ·
      `[x]` 2 a specimen per value · `[x]` 3a combinations per family proven · `[x]` 3b ACROSS families on one block — 40 stacks, 213 ablations, 0 invalid, 10 clashes all explained (V-10 9/9,
      fixed by a wrapper drop-shadow, proven; a white pattern × multiply is a no-op) — `r2-stack.js`, `specimens/stack.html` · `[x]` 3c EVERY LEVEL, NESTED (section → card → button → text): 40 trees, 161 ablations, 0 invalid, cascade-down 0
      failures, 0 clashes, 2 named no-ops — `r2-nest.js`, `specimens/nest.html` · `[x]` 3d STATES / EFFECTS / TRANSITIONS at
      every level, both ways, WCAG first: 30 trees, 133 checks, 0 failed (real mouse + keyboard; focus ring; reduce motion) —
      `r2-states.js`; two builder rules found (own state beats a driven one; no inline base where a state changes it) · `[x]` 4 the crawl's GAP CHECK (`43fb21c`) —
      r2-gap.js 71 techniques over 6,736 items + r2-census.js (every property / function / SVG element in 4,131 pens): ~50
      values added AS CODE, 0 gaps left (cross-fade: 0 uses); every proof re-run headed and identical twice: 8 families painted,
      0 invalid, honest distinct counts with every repeat explained · stack 241 ablations, 9 clashes = V-10 · nest 164, 0
      clashes · states 197 checks, 0 failed · `[x]` 5 the AXIS-MAP "Not yet" values — added with step 4 (4/8-digit hex,
      currentColor, transparent, to-corner, image-set, background-clip, hover / scroll overlays, dark shadow scale, glass
      fallback, moving grain, path() / shape(), scroll-linked edge); the picker CONTROLS are a UI → AREA V's build, designs read
      (75 pickers, `picker-shots.json`) · `[x]` 6 the real-world pass — 17 effects × 3 runs on a 360 × 640 DPR-2 phone, CPU ×6, Slow 3G,
      software drawing, off-screen headed window (`specimens/realworld.json`, AXIS-MAP step 6): blur is the one real cost (glass on
      every card 4px 108 · 12px 93 · 24px 76 fps; one glass header 126), a FIXED full-page grain 87 fps, moving grain / SVG
      displacement ~3 ms raster per frame; gradients, overlays, shadows, shaped edges free; every page 5–11 KB, first paint ≤ 620 ms;
      CONTROL 16 fps / 36 long frames · `[ ]` 7 the
      "enough" checklist to the user — then AREA V builds it so a USER can do every combination (RULE MAP 6)
    - **THE "ENOUGH" CHECKLIST (RULE MAP, step 7) — `[?]` WAITING FOR THE USER TO SIGN** (written 2026-10-03, session 35640e85).
      Each line covered / not covered, with its evidence; the build of AREA V starts only after the user signs.
      - `[x]` 1 MAP — 7 families broken into axes and values, each with how it is made: colour 6 axes · 33 values · gradients 9 · 31
        · backgrounds 8 · 25 · overlays 5 · 20 · shadows 9 · 29 · glass / filters / blend 10 · 49 · textures 11 · 37 · section
        shapes 11 · 51 — `AXIS-MAP.md`, `scripts/uat/r2-axes.js`
      - `[x]` 2 AN EXAMPLE PER VALUE — 275 specimens, all painted, 0 invalid — `specimens/<family>.html`
      - `[x]` 3a COMBINATIONS PER FAMILY — 60 random each, all valid; honest distinct counts with every repeat explained (named
        no-op or dependent axis) — `proof.json`
      - `[x]` 3b ACROSS FAMILIES — 40 stacked blocks, 241 ablations, 0 invalid, 9 clashes = all V-10 (a builder bug for AREA V)
      - `[x]` 3c EVERY LEVEL, NESTED, BOTH WAYS — 40 trees, 164 ablations, cascade down 0 failures, 0 clashes up
      - `[x]` 3d STATES / EFFECTS / TRANSITIONS, WCAG FIRST — 197 checks, 0 failed (hover, press, pointer-following, scroll-linked,
        modal backdrop, focus ring ≥ 3px, reduced motion)
      - `[x]` 4 SATURATION, MEASURED — every CodePen tag saturated (150 in a row) or read to the end; Grabient 927 (last new at 533);
        Awwwards texture 220 on SURFACE (50 in a row, 37 known); gap scan 6,736 items + census of 4,131 pens → 0 gaps
      - `[x]` 5a TASTE — 33 hand-picked best-in-class examples across the 7 families, 85 screenshots opened (`area-v/taste-set.md`);
        two spot-checked by me (Kiawah scrim, HAUS grain — matched to the stored CSS); 8 learnings for the builder
      - `[x]` 5b REAL WORLD — 17 effects on a 360px DPR-2 phone, CPU ×6, Slow 3G (`realworld.json`): blur is the one real cost
        (default ≤ 12px, warn above, few elements); fixed full-page grain costs ~40% of frames; moving grain / displacement opt-in;
        the rest free; pages 5–11 KB, first paint ≤ 620 ms
      - `[ ]` 5c PEOPLE — the pilot schools (RULE RK): not possible before something is built; comes with AREA V's first batch
      - `[ ]` 6 THE USER CAN DO IT — the BUILD itself (RULE MAP 6, RULE UI): AREA V's batches, first colour & backgrounds incl.
        V-7 … V-13, each axis as live previews + "make your own", re-proven through the UI and in Preview
      - Open by the user's decision: Mobbin (skipped), Dribbble search + 22 tag shots (enough). Builder bugs found, fixed in AREA V:
        V-1 … V-13 (V-10 confirmed again on the new edge methods)
    - LEDGER of R-2:
      - `[x]` R2-1 · `aw-measure.js` followed Made in Webflow's "Clone" button (`dashboard/sites/new…unauthSignup`, a
        sign-up page) — 12 of 12 overlay items recorded `noLiveSite`, unmeasured. FIXED: the item's own `*.webflow.io`
        site (a link or its description); the Awwwards-only `/sites/` fallback kept to Awwwards. SEEN: items 1–10 now
        measured on their live sites (476 KB, 3,858 KB…); the 12 bad records removed so they are re-measured
      - `[x]` R2-2 · `site-read.js` (new) read 1 page of uiGradients / Grabient / cssgradient.io / webgradients: Git Bash
        rewrote `\.` in the include pattern into `/.`, so no inner link matched. FIXED: `MSYS_NO_PATHCONV=1` in the
        runner. SEEN: webgradients now opens every gradient's own page (`/gradient/033-…`, 41 read in the first minutes)
      - `[x]` R2-4…R2-13 · MY OWN, the RULE MAP proof (`scripts/uat/r2-axes.js` + `r2-combos.js`), each found by READING the
        sheets and fixed: R2-4 shape bands drew nothing (no width in a centring stage) · R2-5 "painted" = differs from an
        empty stage passed blank sheets → ≥ 2 colours inside the stage · R2-6 `url("…")` inside a `style="…"` attribute
        ended the attribute (every mask, the glass grain) → single quotes · R2-7 shadow on the stage fell outside the
        picture → on a card · R2-8 one-in-97 pixel sampling missed thin letters / 1px lines → every pixel · R2-9 gradient
        text on a positioned child → on the words · R2-10 wave layers inside the band were invisible → behind it, peeking
        out · R2-11 the mask edge was mirrored vs clip-path / SVG → 1 − f · R2-12 "repeating" did not repeat → stops in a 20%
        period (hard edges kept hard) · R2-13 "distinct" by hash → ≥ 0.6% of pixels moved > 8/255; and whole-number keys
        reordered by JavaScript made the colour base 25% → labels with units, an explicit visible base per family.
        Every check MUTATION-PROVEN (blank bands → 0/28 painted; invisible layers → same look)
      - `[x]` R2-15 · the per-family proof checked only each stage's OWN style, never the elements inside it (glass card,
        shape bands, gradient words) → every element, a `-webkit-` fallback beside its standard form accepted
      - `[x]` R2-16 · the stack's band filled 70% of the WIDTH (in a row flexbox `flex: 0 0 70%` is a width) → fills it
      - `[x]` R2-17 · shots taken before a data-URI texture / photo decoded differed from finished ones → retaken until two
        consecutive shots match
      - `[x]` R2-18 · ablations compared tiles at DIFFERENT sheet positions — sub-pixel anti-aliasing read as a change, so 8
        of the 9 V-10 clashes were missed (one measured 0.00% alone) → rendered in ONE stage: 9 / 9 found
      - `[x]` R2-19 · `site-read.js` followed Magnific's "related vectors" for ever (747 pages, off the topic) → `--depth` and
        `--listing` (a listing's own pages stay at depth 0, its items depth 1); the drifted read kept aside in educo-research
      - `[x]` R2-20 · `cp-tag.js` read the `--saturate=150` flag as a TAG too (an empty listing each run — harmless, confusing)
        → flags filtered out; and collector A's restart died on a profile still locked by the window stopped earlier, with
        no notice — re-run, reading `shadow` from pen 166 (a restart is checked for its first pens, not assumed)
      - `[x]` R2-21 · the states proof read the button's "rest" with the mouse still on it (which hovers the card too) → every
        DOWN check failed falsely → rest is read with the mouse away
      - `[x]` R2-22 · the states demo wrote base looks INLINE, so the card's tint and the button's gradient-swap hovers could never
        show → base looks in the stylesheet (and the lesson is V-13 for the builder)
      - `[x]` R2-14 · `site-read.js` died on one write Windows had locked (`UNKNOWN: open`) after 661 pages of webgradients →
        temp file + rename, retried; a failed save no longer ends the crawl
      - `[x]` R2-3 · MY OWN: wave 1 recorded bash PIDs that cannot stop Windows processes (collector D "killed" was still
        running). Every crawler is now stopped by its unique profile path, verified (RULE K)
      - `[x]` R2-23 · NOT A BUG (measured): webgradients and Grabient logs end in `UNKNOWN: open` crashes — both from 11:22 /
        12:12, BEFORE the R2-14 fix; the current `save()` retries and goes on (Magnific then saved 548 pages, 0 crashes), and
        both sites were resumed to completion (webgradients 661, Grabient 927)
      - `[x]` R2-24 · `site-read.js` kept crawling Dribbble search through "Human Verification" pages and SAVED them as data
        (21 of 42). FIXED: a challenge title stops the crawl (RULE RS: step down) and is never recorded; the 21 pages removed.
        Mutation-proven on a local challenge page: with the check 0 pages saved + "stepping down"; without it 2 recorded
      - `[x]` R2-25 · Dribbble tag stopped at 84 of ~800 queued with no DONE line and no note (the restarts at 10:29/10:39) —
        an unfinished crawl that looked finished; and it had no depth limit, so related shots drifted off the tag. FIXED:
        resumed with `--depth=1 --listing=tags/colorpicker` (depth written onto the 84 read pages) → DONE, 100 pages, 0 left
      - `[x]` R2-26 · `aw-measure.js` recorded MOTION only (sticky / fixed / timeline / clip / snap) — 78 Awwwards TEXTURE sites
        and all 81 Webflow overlay / shadow / glassmorphism sites held nothing about texture, overlay, glass or shadow. FIXED:
        `how.css.surface` (gradient / filter url / backdrop / blend / image-background / layered shadow rules),
        `surfaceDom` (SVG filter primitives in the page, canvases, the big backgrounds with size / repeat / blend / opacity),
        cssF `noiseSvg · gradient · filterUrl · blendMode` (which also feed saturation). Old records kept aside in
        educo-research/runs/*.motion-only.json; all four re-measured
      - `[x]` R2-27 · MY OWN, the proof: `diffRatio` called two pictures of DIFFERENT SIZES 100% different — 1fr columns beside
        a scrollbar (296 / 297px), rows at fractional y (160 / 161px) and a stage's own border (177px) — so same-look values
        read as distinct and every earlier "distinct" count could be inflated. FIXED: fixed 18rem columns, fixed caption height,
        `box-sizing: border-box` on the stage, and a size mismatch now THROWS (it stopped all six windows once — the proof it
        was real) instead of counting as "different". Every proof re-run
      - `[x]` R2-28 · MY OWN, the proof: sheets loaded on `about:blank`, an INSECURE context — Chrome 145 hides `paint()` and
        `CSS.paintWorklet` there (measured: about:blank supports=false, localhost supports=true), so a value every https
        page has read as invalid. FIXED: sheets served at http://localhost through Playwright's router (no server). Also a
        builder fact: `paint()` and the EyeDropper work only on a page served over HTTPS
      - `[x]` R2-29 · MY OWN, found by reading the look-alike groups (every repeat must be explained): (a) the overlay's blur strip on
        the WORDS had `inset: auto …` and no height — it drew nothing; (b) the dark-theme drop shadow put `filter` on the now-opaque
        stage, so the shadow fell outside the picture. FIXED (a height; the filter on a wrapper of the shape); groups re-read — every
        remaining repeat is a named no-op or a dependent axis
      - `[x]` R2-30 · MY OWN, the states proof: the scroller's moving SCROLLBAR THUMB passed the SCROLL check on its own (a guard that
        could not fail) and failed the reduced-motion check (20 false failures). FIXED: `scrollbar-width: none` in the measured stage.
        Mutation-proven: 197 checks 0 failed; scroll link removed → 20 SCROLL failures; pointer script + backdrop rule removed → 15
        POINTER + 1 MODAL failures
      - `[x]` R2-31 · MY OWN: sheet captions were not HTML-escaped — "svg <pattern>" was parsed as a tag (SEEN in the texture sheet
        as "texture.source.svg"). FIXED: `esc()`; the caption now holds `svg &lt;pattern&gt;`
      - `[x]` R2-32 · `npx eslint .` — 1 error: `site-read.js` resume loop destructured an unused `u`. FIXED (`Object.values`):
        0 errors (the 105 warnings are the documented exhaustive-deps category)
      - `[x]` R2-33 · `aw-measure.js`: when its BROWSER closed (free memory had fallen to 752 MB) it ran through the 765 queued
        texture sites in seconds, each recorded as failed, and printed `DONE 805` — a dead crawl that looked finished. FIXED: a
        closed browser stops the run at once with "BROWSER CLOSED … rerun to resume" (exit 2). Mutation-proven by killing its
        browser on purpose: stopped after 41 measured, no DONE; relaunched, it resumes
      - `[x]` R2-34 · `aw-measure.js` saturated on MOTION signatures (menus, page transitions, scroll libraries, hover) — on the
        texture category a new menu pattern kept resetting the streak (69 measured, streak 1: `menu:esc…`, `lib:lenis`,
        `pt:view-transition`), so "saturated" could never mean saturated on texture. FIXED: `--signature=surface` (SVG filter
        primitives · canvas · the kind of each big background: photo / tile / svg / gradient, tiled or single, blend, mix,
        translucent · the surface CSS features · conic / radial / repeating / layered / inset / text shadows in the rules).
        SEEN: after the restart no motion signature appears in `novel` (the first 12 sites: nothing new); the known set is written
        to `aw-texture.saturated.json` at saturation; the R-1 motion question is untouched (the flag is opt-in)
      - `[x]` R2-35 · MY OWN: the colour-picker tally (`r2-picker-tally.js`) read each Dribbble shot's WHOLE page text — the shot's
        palette as hex codes, "Download color palette", an agency ad — so "hex 71 · palette 71 · mobile 81" counted Dribbble's page
        frame. FIXED: only the title + the author's description (cut at "Get in touch" / "Hire a" / "More by") → hex 0, palette 5,
        mobile 12; 72 of 99 descriptions name no control at all — so the designs are read from the 100 screenshots
        (`area-v/picker-shots.json`, every image opened)
      - `[x]` R2-36 · the Dribbble TAG data held 18 "Human Verification" pages saved as shots by its first run (before R2-24) —
        my scrub after R2-24 cleaned the SEARCH file only, and I reported the tag "complete, 100 pages". Found by the subagent
        opening every screenshot. FIXED: removed (82 real pages left), re-crawled with the challenge stop → 17 recovered, then
        Dribbble challenged again and the crawl stepped down by itself (R2-24 seen working in the wild: nothing saved). Open
        remainder recorded on the link's line
      - `[x]` R2-37 · MY OWN, the real-world pass: every effect read **144 fps** (the monitor's refresh rate), FCP within noise —
        a guard that could not fail. The CPU throttle slows only the main thread; blur / shadow / grain are RASTER work, done free
        by a desktop GPU — exactly the cost a low-cost phone pays. FIXED: `--disable-gpu --disable-gpu-compositing` (software
        drawing) + the drawing WORK traced (raster + paint ms per scrolled frame, vs the baseline) + a deliberately heavy CONTROL.
        Proven: baseline 0.14 ms raster / 144 fps · glass 24px 0.48 ms / 96 fps · CONTROL 8.22 ms / 22.8 fps, a long frame
      - `[x]` R2-38 · NOT A BUG (measured) — the user asked, 2026-10-03: "where is the window and the content in it this large?".
        The real-world pass launches Chrome at `--force-device-scale-factor=2`; I first took it for the "headed windows at scale 1"
        trap and set 1 — then MEASURED: the page still reports devicePixelRatio 2, but the window draws half the phone's pixels and
        the cost collapses (CONTROL 13.68 → 0.75 ms raster per frame, 10.9 → 84 fps; glass 24px 48 → 111 fps). The large window
        IS a 720 × 1280 phone at its real density — what a low-cost Android draws. Reverted to 2, with the reason in the code. The
        scale-1 rule stands for the proof windows (r2-combos etc.), where pixels are compared, not costs
      - **DECIDED by the user 2026-10-03 (the big window covered their screen):** the real-world COST pass runs in a headed window
        placed OFF-SCREEN (`--window-position=-2600,0`, occlusion throttling and backgrounding switched off). HEADLESS was tried and
        REJECTED by measurement: capped at 60 fps and composited without a screen, it showed glass 24px at 60 fps where the real
        window shows 33–48 — it hides the main finding. Off-screen checked against the visible window (baseline 144 fps / 0.14 ms
        both; CONTROL 9.0 ms / 22.5 fps vs 8.22 ms / 22.8 fps). **Nothing else changes:** every other test, proof and UAT stays
        HEADED and visible (RULE Z), six windows; the user asked to be sure of that
    - **DECIDED by the user 2026-10-03:** Mobbin — SKIP (needs an account; the ~40 screens seen are kept, overlays are covered by
      Webflow 27 · CodePen 501 · ConvertFlow 18). Dribbble — ENOUGH as it is (75 picker designs read; the blocked search and the
      tag's last 22 shots are not chased)
    - WAVE 1 running 2026-10-03 10:26 (`educo-research/r2-wave1.sh`): CodePen shadow · overlay + frosted-glass +
      glassmorphism + backdrop-filter · colorpicker + texture + curves + noise + grain; lists wf-overlay (27) / wf-shadow /
      wf-glassmorphism / aw-texture; the single pen READ. Collector D (divider, gradient-text, gradient-border,
      mesh-gradient, blend-mode, mix-blend-mode) PAUSED at 0.8 GB free (RULE RS: stepped down) — restarts when memory allows
    - My own sources for the same scope (RULE RS), run beside the user's: MDN (background, gradients, mix-blend-mode,
      filter / backdrop-filter, box-shadow / drop-shadow / text-shadow, color functions, color-mix, relative colours,
      `@property` for animating gradients, clip-path / mask) · web.dev / Chrome developers · getwaves.io · shapedivider.app
      · haikei.app · css.glass · coolors.co / Adobe Color (palettes) · grain / noise and mesh gradients · gradient text and
      borders. GAPS the user was told about 2026-10-03 (glass and textures since sent). The user, 2026-10-03: "we have enough… or you're good on that?" → the rest is MY research, no more links needed: shape-divider tools, blend modes, palettes, gradient text / borders / animated gradients, mesh — from MDN and the tools listed above. Was: no link of theirs yet for section shapes / blending on real sites,
      glass / blur, textures, blend modes, palettes
- `[x]` **BATCH R-1 · Research at full width** — CLOSED 2026-10-02 ~20:00 by the user's "enough" (area: research runs · 4 changes, OPEN 2026-10-02 — the user: "once the
  testing is done… multiple browsers so we can do it faster… we start this in a NEW session"; the rule is in CLAUDE.md
  under RULE RS, "research runs as wide as the machine allows")
  - PAUSED 2026-10-02 ~18:45 for the L-3 stress run (the new rule: no research beside a batch's testing): the CodePen
    resume (`codepen-resume.sh`, it resumes) and the Awwwards chain (`educo-research/chain.sh`) — it had finished
    `aw-coll-about-page` (300) and was on `aw-coll-animation-libraries-examples-inspiration --saturate=150`. Restart the
    chain WITHOUT `--saturate` (the user: "grab everything"); `aw-measure.js` resumes from what it measured
  - `[x]` (1) MEASURED 2026-10-02 18:55, nothing running (no UAT, 3100/3200 free, no research): 16 logical cores at
    5% load, 3.6 GB free of 15.6 GB — MEMORY is the limit, not CPU. With the six CodePen collectors: 0.3 → 0.7–1.5 GB
    free, load 40–90%
  - `[>]` RUNNING (session f86b7fdf): `educo-research/r1-codepen.sh` — 3 tag collectors (A parallax sticky hover-effect
    dialog …, B clip-path hover sticky-header …, C cursor marquee + the step-4 names + the small tags) and 3 list
    collectors over `pens-own-s1..3.list.json` (1,382 / 1,381 / 1,381 = the 4,144 unread), profiles `cp-prof/1..6`
    (copies of prof-c). Shard outputs `raw/pens-own-sN.json` are MERGED into `pens-own.json` when they finish.
    `educo-research/r1-aw.sh <lane> <jobs>` — the Awwwards lists without `--saturate`, two lanes on alternate lists
    (`profile`, `profile-aw2`), lane 1 started at 2 jobs
  - STEPPED DOWN 19:08: collector C raised CodePen's human check 13 times in 6 minutes (walking listing pages of pens
    already read) → stopped; its tags (cursor marquee horizontal-scroll view-transitions page-transition
    scroll-driven-animations + the step-4 names) run when A or B finishes. Awwwards lane 2 NOT started: with five
    CodePen + one Awwwards lane at 2 jobs the machine reads 100% CPU, 0.8 GB free, and the list collectors fell from
    ~8 to ~1.5 pens a minute — the machine is the limit
  - `[x]` **THE USER'S DECISION, 2026-10-02 ~19:35: "we have enough" — the big runs STOPPED.** Estimate given: ~3–4 days
    at full width (Awwwards ~9,500 sites left at ~100/h; CodePen tags open-ended). The "enough" checklist already marks
    every need covered and says the runs "change shares, not the list of techniques"; six tags had saturated. What this
    session read before stopping: **1,212 new pens** (pens-own +1,016 → 1,586 / 4,714 · parallax 962 · clip-path 603 ·
    marquee 256 …) and **~391 Awwwards sites** checked (aw-coll-transitions 366/366 · animation-libraries 25/25 ·
    aw-coll-animation 8/243). Every run resumes if an area turns out thin. Kept to finish: the user's own aw-coll-hovers
    (4 left), the step-4 names (saturated at 150), the `sticky` re-walk that proves R-21
  - **Ledger (this session):**
    - `[x]` R-21 · `cp-tag.js` treated a listing page with no new pens as the END even when it failed to load after a
      human check — `sticky` ended at page 3 with 12 pens (585 read before). Fix: a page with no pen links is retried
      twice; END logs the link count. PROVEN: the `sticky` re-walk went past page 3 to page 98 and read pen 586 (new);
      `dividers` ended on a real end ("page 3 pens 11 links on the page 0" after the two retries). Re-walk then stopped
      (the user's "enough"). aw-coll-hovers 466/466 — every one of the user's own links is complete
    - `[x]` R-23 · the builder's Divider published `<div aria-hidden>` on the canvas AND the page, where the stored research
      (`html-semantics.md:132`) and MDN say `<hr>` (separator) — found while judging the divider pens. FIXED: `<hr>` in
      `box-export.ts:158` and `BoxCanvas.tsx` (UA margin / inset border reset), guard `box-export.test.ts` "a Divider
      publishes <hr>" RED on the old code, green on the new; BoxCanvas test selector updated; scenario in
      `box-builder-layout.feature`. HEADED check → BATCH L-3's pass (change 5)
    - `[x]` R-22 · MY OWN: `r1-aw.sh` gave the user's aw-coll-hovers (462/466) to lane 2, which was never started — a
      list on a lane that does not run is never read. Fix: run directly; `r1-aw.sh` retired with the runs
  - (2) CodePen at 6 windows: three `cp-tag.js` collectors, each with its own COPY of the cleared profile (`prof-c`) and
    its own share of the tags; `list:pens-own` (4,144 not read) split into its own collectors, running AT THE SAME TIME
    instead of after; step back down if CodePen starts asking "are you human"
  - (3) every other link at full width: `aw-measure.js --jobs=` raised as far as the machine allows (Awwwards items are
    separate sites), and the queued runs (wf-page-transitions, opl-drop-shadow, aw-coll-transitions, aw-coll-hovers,
    aw-cat-transitions, aw-cat-animation, the own demo lists) run side by side, not one after another
  - `[x]` (4) DONE 2026-10-02 (stopped at the user's "enough" — 137 pens: divider 75 · dividers 11 to its end · wave 51; svg-divider / stacked-cards / card-stack / stacking not reached, resumable); tag pages regenerated by `cp-how.js` (29 tags); judgement in `motion/library/3-section-transition.md` "Added 2026-10-02 (R-1)": band edges HAVE · wave / SVG edge GAP · overlap GAP · moving wave GAP · rule between blocks PARTIAL→fixed by R-23 · stacked cards GAP. Was: the three 0-pen CodePen tags under the names CodePen uses (divider · dividers · wave · svg-divider ·
    stacked-cards · card-stack · stacking); then the tag pages regenerated (`cp-how.js`) and the HAVE / PARTIAL / GAP
    judgement against the builder
- `[ ]` **BATCH S-2 · Section transitions** (area: band edges and held sections · 5 changes, queued 2026-10-02 by the
  user: "yes" — runs AFTER the layout batches L-3…L-7 and the agreed motion Batches A and B; research done in R-1,
  `motion/library/3-section-transition.md` "Added 2026-10-02 (R-1)")
  - ST-5 · a block can overlap a band edge (a card hanging across two bands): outer spacing may go below 0
  - ST-1 · a sloped / curved band edge shows the NEXT band's colour, as the guide says, not the page colour
  - ST-4 · wave and SVG-shape band edges beside the four `BandEdge` shapes (mask / clip-path, rem-sized, per rung)
  - NEW · a moving (keyframed) wave edge — still under `prefers-reduced-motion`, approved motion tokens
  - ST-7 · stacked cards — **DECIDED by the user 2026-10-02: BOTH behaviours, side by side** ("can we not do a and b
    together"): each held section chooses **Queue** (today's, one under another — stays the DEFAULT so no saved page
    changes) or **Stack** (each card slides over the last); switchable any time, canvas == export
- `[ ]` **BATCH L-4 · The decided layout changes** (area: rows and grids · 6 changes, queued)
  - c-7 (decided B) / e-9 · MOVED to BATCH F-1 (2026-10-01) — the HOLE at the end of a line is unused space
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
- `[ ]` **BATCH M-1 · The L-2 fixes in the phone and tablet app** (area: `apps/mobile/` · MUST BE DONE, NOT STARTED — the
  user, 2026-10-01: "Yes, I want something built in mobile for this, but… just have this noted that it must be done", so
  we do not get carried away). What it holds, to be planned when it opens (phone AND tablet, `isTablet`, Jest + both
  emulators): a school's site shown inside the Educo app as a WEBVIEW over the real export (rule 20), so the L-2 fixes
  arrive as they are — the header spread and centred, words and FAQ answers wrapping as published, "Floats on screen"
  holding — checked on emulator-5556 (phone) and 5554 (tablet) at their real widths; plus whatever native chrome the plan
  approves. Same item as section 4's "Builder on phone and tablet". WHEN: the user places it; the layout order below
  stands until then
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

### 1.1.5 · LAYOUT — DEFINITION OF DONE (**FROZEN 2026-10-02 — signed off by the user**)

**USER SIGN-OFF 2026-10-02:** every item in MUST, DECIDE and the sticky/fixed group (GROUP 3) is approved to BUILD.
The user: "I sign off on everything… let's have everything… all the stuff on the table." LATER items (motion,
typography, components) stay LATER and move to 1.3 when the layout closes. The "DECIDE" heading is kept for
history; all its items are now BUILD targets, not open questions.

The one list that says when the layout is finished. Sources: the user's Advanced CSS course (stored, technique by
technique, in `docs/web-anatomy/advanced-css/` — README's gap list AC-1…AC-36), the user's own list (to be added once
sent), and my research. Nothing on the layout is done until every line here is closed. LATER items move to 1.3.

**What the course taught us (2026-10-01, read this first):**
- The builder already does most of it RIGHT, often better than the 2018 course: rem not px, `gap` not margins (the
  course's "Flexbox has no gap" is out of date), `minmax(0, 1fr)` so a long word never widens a column, media never
  overflow, heights are floors not caps, placement stored per block (so nothing is renumbered when a rung changes the
  layout), the reader's text size is never overridden (the course's "root font-size 50% at a breakpoint" is rejected —
  WCAG 1.4.4).
- The real gaps are few and specific: the six under MUST. They are what modern real pages use most and the builder
  cannot build: auto-fit grids, half-bleed, subgrid, push / grow space, height-aware sizing, chosen proportions.
- Most of the course's effects are NOT layout (hover, flip cards, gradients, filters, component designs) — they wait
  for the component and motion work (LATER), so the layout list stays finite.
- Accessibility traps the course itself fell into, which the builder must guard: an `h3` eyebrow before its `h2`, a
  nameless icon-only button, `<sub>` for m², information shown only on hover, visual order that contradicts reading
  order (`order`, explicit grid placement, `dense`).

- `[ ]` **MUST — common on real pages, missing today**
  - `[ ]` AC-33 · **"as many as fit, each at least X rem" grids** — a card / feature / gallery grid adapts to its OWN
    width wherever it sits, no breakpoint (`repeat(auto-fit, minmax(min(100%, X rem), 1fr))`); today only the Accordion
    uses it, grid blocks step a fixed count at the window rungs. Decide whether it is the DEFAULT for card grids; saved
    pages keep their count; how spans behave in it
  - `[ ]` AC-35 · **half-bleed** — a picture runs off the window edge while the text beside it starts on the page's
    content column (Nexter's story / header); today a band is contained or full width, and a two-cell row splits the
    WINDOW, so the text drifts from the content edge
  - `[ ]` AC-36 · **subgrid** — titles, texts and buttons line up ACROSS a row of cards whatever the text lengths; and a
    nested grid's columns snap to the page's content columns. Ships in every current engine; never written today
  - `[ ]` AC-26 · **push / grow space in a stack** — `space-between` in a column (a sidebar's legal line at the bottom,
    card buttons at the bottom), and space that GROWS between particular blocks of a fixed-height band (a hero: logo
    top, message middle, press strip bottom); the spacer block is a fixed height today
  - `[ ]` AC-3 · **height-aware sizing** — any share of the screen height (80%, 95%), with `svh` / `dvh` for phone
    browser bars; *Full screen* UNDER a pinned header (`calc(100svh - bar)`); spacing that shrinks on SHORT screens;
    today `screenHeight` is half / full only
  - `[ ]` AC-34 · **a box with a chosen proportion** — 16:9 hero, 2:1 band, square tiles, and grid ROWS a proportion of
    the column width (a mosaic gallery); `aspect-ratio` today only for a picture's own shape
- `[ ]` **BUILD (was DECIDE — all approved by the user 2026-10-02)**
  - `[ ]` AC-30 · a fixed, content-sized or bounded GRID track beside fluid ones (`20rem 1fr`, `max-content 1fr`,
    `minmax(12rem, 18rem)`) — `HAVE` in a flex row, not in a grid
  - `[ ]` AC-31 · two blocks layered in ONE grid area in the flow (caption over picture, collage), and a block running
    out of its cell over the neighbour — with a simple phone fallback (with AC-21)
  - `[ ]` AC-21 · overlapping floating pictures that reflow into a row on narrow screens (the photo composition)
  - `[ ]` AC-32 · dense packing (`grid-auto-flow: dense`) for galleries / bento grids of mixed spans — only where order
    carries no meaning
  - `[ ]` AC-10 · **negative spacing and a nudge** — pull a section up over the one before, tuck a line closer, overlap
    avatars, an optical translate; today only by dragging a top edge
  - `[ ]` AC-27 · stretch ONE block to the full height of a line / cell whose others are centred
  - `[ ]` AC-25 · `space-evenly`, `baseline` alignment, and `align-content` for wrapped lines in a fixed-height band
  - `[ ]` AC-9 · ONE site-wide content width, set in one place (with AC-35)
  - `[ ]` AC-2 · a page frame (a border round the whole page, off on narrow screens)
  - `[ ]` AC-5 · content placed at 40% from the top rather than the exact middle
  - `[ ]` AC-1 · a hero edge cut on a screen-height measure, not a % of the band
  - `[ ]` AC-8 · text wrapping round a picture (float) and round its shape (`shape-outside`)
  - `[ ]` AC-17 · a background video for a section (with RULE AF weight limits)
  - `[ ]` AC-19 · one text flowing through several columns; one `ul` in two columns; blocks read DOWN each column then
    across (an A–Z directory)
  - `[ ]` AC-22 · responsive images — several sizes per photo (`srcset` + `sizes` computed from the layout), art
    direction (`<picture>`) (RULE AF / page weight)
  - `[ ]` AC-23 · browser baseline — the newer features the export uses checked against the real audience's phones,
    each with a fallback reset inside `@supports`; the generated CSS minified
  - `[ ]` AC-29 · see the grid while editing — an overlay of a selected grid's tracks and gaps on the canvas
  - `[ ]` AC-4 · one heading in two styled lines (main + sub) — or an `hgroup` with an eyebrow
  - `[ ]` style by grid row / column (zebra rows, a bold first column) — the builder knows each block's row and column
- `[ ]` **CHECK — lines for the next HEADED UAT, not features**
  - `[ ]` the inspector offers DIRECTION, ORDER and PLACEMENT at one rung as plainly as *hide* (a sidebar → top bar; icon
    above its label on a phone; text before pictures on a phone)
  - `[ ]` a deliberately EMPTY grid cell can be made through the UI and later blocks do not flow back into it
  - `[ ]` a full-width grid cell STAYS full width when the column count changes 3 → 4
  - `[ ]` one alignment for ALL blocks of a selected grid (what *Line up* writes on a grid)
  - `[ ]` a stack whose width is its content's widest line ("Fit" on a container), placed in the centre
  - `[ ]` the semantic audit flags an `h3` placed before its `h2` (an eyebrow) and offers the fix
  - `[ ]` a footer / menu list of links publishes as `nav > ul > li > a`
  - `[ ]` *Full screen* — what it writes today (`vh` or `svh`, minus a pinned header or not)
  - `[ ]` every picture path emits `aspect-ratio` or `object-fit` — a catalogue-enumerating guard so no photo can stretch
- `[ ]` **LATER — not layout; moved to 1.3 (components / motion / typography) when the layout closes**
  - `[ ]` motion: AC-6 easing / delay / repeat · AC-7 halo hover · AC-12 group hover · AC-18 sweeping fill · AC-24 hover
    keyed to input (`(hover: hover)`), reveal on touch and focus
  - `[ ]` style / typography: AC-11 gradient text · AC-14 blend modes · AC-15 `box-decoration-break` · AC-16 image
    filters · AC-20 hyphenation · AC-28 custom coloured list markers
  - `[ ]` components: AC-13 flip card · Button variations (inline / link button, sliding two-label) · Card (listing card,
    subgrid-aligned parts) · Quote / Testimonial (`figure` + `blockquote` + `figcaption`, quote mark) · Logo strip ·
    People / Team list · Avatar group · Divider with a label · Navigation menu button · Gallery (mosaic layouts) ·
    data-bound list (unknown length, empty / loading states)
- `[ ]` **The user's own layout list** — approved to add (user, 2026-10-02: "group four let's do that as well"); add line by line as the user sends them
  - `[>]` **Section transitions · animation · `position: sticky` · `position: fixed`** (the user, 2026-10-01: "mainly
    for layout", components second). The user sends links, each a different way of doing it. For EACH link: study it
    (and expand online, RULE R), store it distilled in `docs/web-anatomy/scroll-and-position/`, mark every technique
    HAVE / PARTIAL / GAP against the builder (pins, floats, `pinArrival`, entrances, the motion tokens and
    reduced-motion fallbacks already exist), and put every GAP into this list (MUST / DECIDE / CHECK / LATER) with its
    description. More links still coming from the user.
    - `[x]` Studied 2026-10-02: CodePen tags sticky-header + fixed-position (47 pens, 22 techniques —
      `scroll-and-position/01-codepen-sticky-fixed.md`), mimo `position: sticky`, Awwwards "Sticky elements" (petro.design
      measured) — `scroll-and-position/README.md`. Two findings VERIFIED in the code (not just reported)
    - `[ ]` SP-1 · **MUST · a sticky page header covers anchor targets and the focused control** — `scroll-padding-top`
      is set only for a FIXED bar (`pinPaddingNeeded`, deliberately); a sticky header that has stuck hides `#section`
      jumps and Tab focus below the hero (WCAG 2.4.11). Needs a padding that follows the stuck bars (`--eu-pin-above`)
    - `[ ]` SP-4 · **MUST · rounding or clipping a section silently kills every pin inside it** — the export writes
      `overflow: hidden` for `clip` or any radius (`box-export.ts` ~393); `overflow: clip` clips without breaking sticky.
      The editor must also say why a pin does not stick (`pinBlockedBy`)
    - `[ ]` SP-2 · DECIDE (leaning MUST for phones) · **hide on scroll down, show on scroll up** ("smart header") — gives
      back ~10% of a 360×640 screen; must reappear on focus and at the page end, snap under reduced motion, a few inlined
      lines, never a library
    - `[ ]` SP-3 · DECIDE · `pinArrival` timed to the moment the bar STICKS — it runs from scroll 0, so a nav that sticks
      lower down (under a hero) has finished its arrival before it sticks
    - `[ ]` SP-5 · DECIDE · a scrollable box (max-height + overflow auto) with sticky group headings inside
    - `[ ]` SP-7 · DECIDE · a stay-behind layer — content scrolls OVER a held hero (`pagePinCover` always paints the
      pinned band on top)
    - `[ ]` SP-8 · DECIDE · a tall sticky sidebar that scrolls inside itself (`max-height: 100dvh; overflow-y: auto;
      overscroll-behavior: contain`) instead of being cut off
    - `[ ]` SP-11 · DECIDE · a fallback for a fixed background picture (`bgAttach: "fixed"`) — iOS ignores it, low-end
      Android janks (RULE AF)
    - `[ ]` SP-14 · DECIDE · held bars aware of the phone's safe area and keyboard (`env(safe-area-inset-*)`,
      `interactive-widget`) — a bottom bar must not cover a focused field
    - `[ ]` SP-9 · LATER · flow space for a FIXED top bar so the first heading is not hidden (sticky reserves it already)
    - `[ ]` SP-10 · LATER (motion) · clip-revealed fixed scenes — a full-screen picture per section wiping into the next
    - `[ ]` SP-6 · LATER (component) · Table: a sticky header row and first column
    - `[ ]` SP-12 · LATER (component) · Navigation: off-canvas panel (inert, aria-expanded, Escape, focus return, scroll
      lock), active link following the scroll
    - `[ ]` SP-13 · LATER (component) · a real `<dialog>` popup, centred with `inset: 0; margin: auto`
    - `[>]` **Awwwards "Animation" category — EVERY site, in full detail** (the user, 2026-10-02: "go inside each
      website on that page… check exactly what the sticky element is, what the animation is, and what the transition
      is… get everything in full details, don't just get the first one"). https://www.awwwards.com/websites/animation/
      — the listing is COLLECTED: 248 sites from 8 pages, `scroll-and-position/raw/awwwards-animation-sites.json`
      (+ the 8 Awwwards elements petro.design links to, inside the script). The measuring script is WRITTEN, NOT RUN:
      `scripts/research/aw-measure.js <list> <out.json> <chrome-profile-dir>` — real Chrome (`channel: 'chrome'`,
      persistent profile; plain Playwright Chromium is blocked by Cloudflare on CodePen / Awwwards), 6 pages in
      parallel, resumable (skips what `out.json` has). Per site it records: the Awwwards title, tags, live URL; the
      libraries (GSAP, ScrollTrigger, Lenis, Locomotive, Barba, Swup, Three/WebGL, Framer, Webflow, Lottie, SplitText,
      Swiper, Next/Nuxt/Astro); CSS features (animation-timeline / view() / scroll(), view-transition, scroll-snap,
      sticky, fixed, clip-path, keyframes, prefers-reduced-motion, blend, backdrop-filter, marquee); every sticky /
      fixed element (what it is, where, how tall, its parent's height = a pinned scroll section); GSAP pin-spacers; how
      many elements change transform / opacity / clip-path over five scroll steps; page weight and requests.
      **STILL TO ADD before running:** (a) WHICH elements animate and HOW (translate / scale / rotate / fade / clip) —
      today only a count; (b) the PAGE TRANSITION — click an internal link, hook `document.startViewTransition`, sample a
      full-screen overlay for 1.5s. Then run it (≈15–20 min, six windows), then a subagent distils it into
      `scroll-and-position/02-awwwards-animation.md` by technique (sticky · scroll animation · section transition ·
      page transition), each HAVE / PARTIAL / GAP, and the gaps go here as SP-15…
    - `[>]` **Awwwards "Transitions" CATEGORY — EVERY site, in full detail** (the user's link, 2026-10-02 session
      1427d547: https://www.awwwards.com/websites/transitions/). NOT the same source as the Transitions COLLECTION
      already stored in `awwwards-motion-survey.md` (`/awwwards/collections/transitions/`, 366 items, fingerprinted
      from code only, never driven live). Same method as the Animation category: every listing page until one adds
      nothing → every site measured live by `aw-measure.js` (scroll changes + page transition) → distilled into
      `scroll-and-position/03-awwwards-transitions.md`, overlap with the collection marked, gaps here as SP-…
    - `[ ]` **Made in Webflow "page transitions" — EVERY project, in full detail** (the user's link, 2026-10-02 session
      1427d547: https://webflow.com/made-in-webflow/page-transitions). Every item of the listing (all pages / all "load
      more") → each project's live site measured by the same `aw-measure.js` page-transition probe (click an internal
      link, sample the overlay / view transition for 1.5s) → distilled with the Awwwards results, gaps here as SP-…
    - `[>]` **STICKY and FIXED — EXHAUSTIVE research, every situation, every component** (the user, 2026-10-02 session
      1427d547: "do a lot of excessive research on sticky position… for any situation… and also fixed position on any
      component, anything on a website"). SUPERSEDES "sticky / fixed is enough once its completeness list is closed".
      A catalogue of EVERY use of each on real pages and in every component (headers, sub-navs, tables, sidebars, TOCs,
      CTAs, bottom bars, chat / cookie / back-to-top, stacked cards, pinned scenes, modals, toasts, drawers…), every
      mechanic and trap (containing block, overflow, transform ancestors, z-index / stacking, iOS / Android bars,
      keyboard, safe areas, zoom, print), each HAVE / PARTIAL / GAP → `scroll-and-position/04-sticky-fixed-exhaustive.md`,
      gaps here as SP-…
    - `[ ]` **Hover effects — the user's two links, EVERY item** (2026-10-02 session 1427d547):
      https://webflow.com/made-in-webflow/hover%20effect · https://www.awwwards.com/inspiration/hover-effect ·
      https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/ — every
      listing page, each item opened and its live hover measured (what changes, on what, touch / keyboard equivalent),
      combined with `motion/04-hover-focus.md`
    - `[x]` **Sticky / fixed exhaustive (mine)** — `scroll-and-position/04-sticky-fixed-exhaustive.md` (SF-1…SF-21),
      2026-10-02. Crawl counts: fixed header on 16.3% of pages, sticky 5.2%, sticky sidebar 4.0%. Proposed MUST: SF-1 Tab
      lands under a fixed BOTTOM bar (only `scroll-padding-top` is set; WCAG F110) · SF-2 a fixed bottom bar hides the
      page end · SF-3 print: fixed blocks repeat on every printed sheet · SF-4 bars that let go on SHORT screens (WCAG
      C34) · SF-5 the page audit measures how much screen held bars take · SF-8 `capturesFixed` misses hover / entrance
      transforms, glass Accordion items and Advanced CSS (a fixed block inside them scrolls away). DECIDE: SF-7 stacking
      cards · SF-10 RTL pins · SF-13 glass cost · SF-14 short page footer (lean MUST) · SF-15 two-row header, row 2
      sticks · SF-16 bottom bars while typing. CHECK: SF-6 · SF-9 · SF-11 Opera Mini · SF-12 iOS 26. LATER: SF-17…SF-21.
      **NOT READ (open):** Baymard (paywall), CSSWG #865 thread, Mozilla 1732817, the real sites it names (to be measured)
    - `[ ]` **BUG LEDGER — the research TOOLS (RULE V)**
      - `[ ]` R-1 · `aw-measure.js` page weight wrong on a re-run (29 KB, "-0") — the persistent profile served from
        CACHE; fix: cache disabled per window (CDP `Network.setCacheDisabled`)
      - `[ ]` R-2 · `cp-tag.js` read CodePen's "verify you are human" page as "no more pens" (hover stopped at 96,
        reduced-motion at 0) and then crashed on the challenge's navigation; fix: detect the check, PAUSE and ask the
        user to tick it once in the visible window (no automated bypass), retry, 2 windows + random pauses on CodePen
      - `[ ]` R-3 · `src-list.js` gave up on one Webflow page timeout; fix: 4 retries per page
      - `[ ]` R-4 · `aw-list.js` crashed at Animation page 185 (connection dropped) and LOST 184 pages — it saved only at
        the end; fix: `src-list.js` saves after every page and resumes
      - `[ ]` R-5 · an Awwwards INSPIRATION item has no "Visit site" of its own — recorded as "null" (a false miss); fix:
        follow its `/sites/` page to the live site, keep the item's video (the recording of the effect)
      - `[ ]` R-6 · One Page Love's list picked up menu pages ("free-templates", "sections"); fix: filtered (149 items)
      - `[ ]` R-7 · a RESUMED listing stopped at once (pages it already held "added nothing"); fix: the end is a page
        with NO items, not no NEW items
      - `[ ]` R-8 · running every source at once (~24 windows) ran the machine out of memory (2 GB free of 15.6):
        gallery pages and screenshots timed out and each failure was RECORDED AS DONE (a false negative); fix: a failed
        item is retried (3 tries) and re-run on restart, and ONE measuring process at a time (6 windows) + CodePen (2+2)
      - `[ ]` R-9 · frames per second read 2–6 on a 330 KB page: with six windows open Chrome slows the frames of covered
        windows (and my DOM snapshots blocked the first try) — a FALSE number; fix: fps is no longer recorded, long
        tasks are kept, smoothness gets its own one-window pass
    - `[x]` **LEDGER VERIFIED IN CODE 2026-10-02** (`educo-research/reading/ledger-verify.md`; SP-4 and N1 re-checked
      by me): **22 REAL · 3 NOT A BUG · 3 CAN'T TELL without a browser.** NOT A BUG (latent — nothing published sets
      it): MR-17 · CE-7 · HV-21. CAN'T TELL (headed check written in the file): NEW-B3 · NEW-B2 · NEW-C1. Same root:
      SA-1 = SP-4 · EX-10 fixed with EX-2/EX-3 · MR-9 ⊂ EX-2/EX-6 · MR-16 ⊂ MR-4 · NEW-B2 ⊂ MR-3. **REAL, worst for
      users first:** SP-4/SA-1 rounded or clipped section writes `overflow: hidden` (`box-export.ts:393`,
      `BoxCanvas.tsx:3029`) — pins and reveals inside it die; fix `overflow: clip` · MR-4 the auto pager has no Pause ·
      MR-5 an auto-dismiss alert cannot be paused by touch · EX-3 dismissing an alert drops focus to `<body>` · MR-2
      Solid / Glass bar stays see-through under reduced motion / no scroll timelines · MR-6 hover not gated by
      `(hover: hover)` · SH-7 focus rings vanish in forced colours · SF-8 `capturesFixed` misses hover / entrance /
      arrival transforms · ST-1 sloped edge shows the page colour (the guide says otherwise) · NEW-A1 swipe past the
      pager's end fires BACK · MR-16 focus on pager dots does not stop it · CE-19 mobile spinner · MR-3 condense / glass
      cost every frame · AM-1 `animate-in` undefined (114 files, 211 uses) · minor: EX-6 · EX-5 · EX-10 · MR-9 ·
      video 315px · HV-17. **NEW, found while verifying:** `[ ]` N1/N2 the alert timer's `go()` never clears the old
      timer (`box-model.ts:2034`) — mouse-leave + focus-out leave TWO timers, the alert vanishes while being read ·
      `[ ]` **N9 · VERIFIED by me:** `--eu-color-surface-2` is used 20 times in `lib/` (accordion / navbar hovers,
      the "Soft surface" background…) but defined ONLY in the editor's `app/globals.css` — never in the exported token
      sheet, so those hovers do nothing on a PUBLISHED page while the canvas shows them (canvas ≠ export) ·
      `[ ]` **N10 · VERIFIED by me:** `box-model.ts:984` exports `letter-spacing` in px (rule 16) ·
      `[ ]` N3 a stagger gives children 11+ no delay — they arrive first · `[ ]` N4 the web PageLoader / InPageSpinner
      not reduced-motion gated, not announced, hard-coded hex · `[ ]` N5 pager arrows are links, not buttons · `[ ]` N6
      every video iframe is titled "Video" · CAN'T TELL: N7 alert × contrast · N8 a link in a reveal block focusable
      while nearly transparent
    - `[ ]` **BUG LEDGER — more defects in what SHIPS reported by the redo (to verify in code first)**
      - `[ ]` SH-7 · focus rings drawn only with `box-shadow` after `outline: none` (`components.ts:49,320,345,349`) —
        they vanish in forced-colours (Windows high contrast); no `forced-colors` rule anywhere
      - `[ ]` the video block's default height is `315px` (`box-export.ts:157`) — a stored pixel (rule 16)
      - `[ ]` NEW-A1 · the pager strip has no `overscroll-behavior-x: contain` — swiping past its end can fire the
        phone's BACK gesture
      - `[ ]` EX-10 · a leaving element can still be clicked and focused (make it `inert` when the exit starts)
      - `[ ]` MR-16 · the pager's auto-advance restarts on its own when focus leaves, focus on its dots / arrows does not
        stop it, a reduced-motion change while open is ignored
      - `[ ]` MR-17 · the global reduced-motion rule does not set `animation-iteration-count: 1` — a loop would flash
      - `[ ]` **AM-1 · VERIFIED 2026-10-02 (by me, not only reported):** the `animate-in` / `slide-in-from-*` /
        `fade-in` classes are used in 114 files (211 times) but NOTHING defines them — no plugin in `globals.css` or
        `package.json`, zero `.animate-in` rules in the built CSS — so every Modal, PageLoader and toast entrance in
        the Educo app silently does nothing. (Plus, reported by the same research, to verify: the native app has no
        reduced-motion handling, Reanimated installed but unused, 1 of 192 Pressables gives press feedback, toasts
        not announced, the web Modal never moves focus, drag handles that cannot drag, no offline state — AM-2…AM-27
        in `motion/09-app-motion.md`)
      - `[ ]` CE-7 · an invalid input is shown by colour only (WCAG 1.4.1)
      - `[ ]` CE-19 · the app's spinner loops with no reduced-motion check and no accessible label
      - `[ ]` HV-17 · `.eu-btn:active { translateY(1px) }` — a stored pixel (rule 16)
      - `[ ]` HV-21 · a focusable child sits at `opacity: 0` (revealed on hover) — keyboard focus lands on something
        invisible (WCAG 2.4.7). (HV-15 = SH-7 and HV-18 = MR-6: same bugs, found twice)
      - `[ ]` NEW-B3 · the pager's off-screen pages stay in the Tab order (no `inert` anywhere in the pager) — keyboard
        users tab into slides they cannot see (WCAG 2.4.3 / 2.4.7)
      - `[ ]` NEW-B2 · a style applied while a bar is stuck must change paint only, or the bar flickers between stuck
        and unstuck — check every `pinArrival`
      - `[ ]` NEW-C1 · scroll effects are switched on by `@supports (animation-timeline…)` alone (`interactions.ts:242`,
        `box-model.ts:6362`) — a half-built engine passes and plays them with the wrong timing; add `and
        (animation-range: 0% 100%)`
    - `[ ]` **Redo results so far** — `06-motion-rules.md` +9 gaps MR-16…24 (Material 3 read via its content endpoint) ·
      `07-shadows.md` SH-1…12 (79 demos) · `05-entrance-exit.md` 62 sources, 213 demos, EX-9…19 · reading cluster A
      (MDN, ~95 sources, 129 demos, NEW-A1…A8) · cluster C (Bramus + scroll-driven-animations.style: 141 posts, every
      demo page, 235 demos, NEW-C1/C2) · cluster E (Codrops: 123 articles + the 1,139-entry demo index + the
      StickySections repo, 249 demos, NEW-E1…E11 — read through the r.jina.ai reader proxy over Codrops' WordPress API
      because tympanus.net answers 403; TOLD the user) · `03-page-transitions.md` (~230 pages, 348 demos, PT-12…20) —
      outputs copied to `educo-research/reading/` · cluster B (Chrome + web.dev via their sitemaps: 47 sources,
      177 demos, NEW-B1…B8; the full scroll-triggered action list — `play-once` closes SA-2's CSS route). The chain
      dropped to 4 windows 2026-10-02 04:11 (0.7 GB free with 6) · `04-hover-focus.md` (~55 sources + the code of 82
      Codrops hover / button / link / cursor / tooltip repos — 0 of 77 handle reduced motion; 320 demos; HV-15…28).
      · cluster F (Polypane · Josh Comeau · Shadeed · Kevin Powell · Apple HIG · Material component docs · divider
      generators · freefrontend: ~75 sources, 287 demos, NEW-F1…F9; F7 the "puzzle" divider explains ST-1 and its fix).
      **RESEARCH RULE added 2026-10-02:** no identity spoofing (cluster F tried a Googlebot user agent on a site that
      refused it — not a route we use); a source that refuses stays NOT READ with the reason, or is read in the real
      browser the way a person reads it. **And never turn the sandbox off** (an app-motion sub-agent ran `curl` with
      the sandbox disabled on its own — TOLD the user). · `09-app-motion.md` (Material 3 · 17 Apple HIG pages · Fluent
      · Carbon · Atlassian · Polaris · React Navigation 7 · expo-router · all 96 Reanimated 4 pages · gesture-handler ·
      Moti · FLIP · Next view transitions; 62 demos; AM-1…27). Waiting: cluster D, component effects
    - `[>]` **THE MOTION & EFFECTS LIBRARY — one library for EVERYTHING (the user, 2026-10-02: "make sure everything we
      collect is something we can use for everything… the website builder and any application we develop… so we
      don't have to redo it")** — `docs/web-anatomy/motion/LIBRARY.md` (index, 11 families, ONE entry shape: what a
      visitor sees · code · MEASURED timing → token · phone · reduced motion · accessibility · cost · how common ·
      examples · surfaces incl. React Native · HAVE/PARTIAL/GAP verified); memory `reference_motion_library.md`. Raw
      store OUTSIDE git, permanent: `C:\Users\eyite\educo-research\` (runs/ · shots/ · reading/ · chain.log) — the
      session scratchpad is cleaned, so nothing stays there. Added on the user's "is anything missing?" (my answer):
      - `[x]` the measurer captures, per item: load intro (0.7s + load shots, preloader cover) · TIMING (every
        duration / easing / property / delay in use + script eases) · keyboard focus look (4 Tab stops) · hover with a
        3-frame strip and its own timing · cursor followers · the MENU (open strip, Escape closes?, focus returns?,
        scroll lock) · page transition (+ focus and title after) · a REDUCED-MOTION pass (what still moves) · a PHONE
        pass (360×740, touch, Android UA, CPU 4×: held bars, scroll changes, long tasks, sideways overflow, the phone
        menu). Trialled on 6 sites 2026-10-02
      - `[>]` 35 more Awwwards collections (intro animations · CSS animations · animation · animation libraries ·
        loading · parallax · horizontal scrolling · storytelling · filters & effects · drag · playful · menu · best of
        navigation · galleries & slideshows · forms · search · search filters · video / audio players · UI elements ·
        3D UI · cookie · layout · grid layout · hero · footers ×2 · about · contact · product · project · 404 · one-page
        · mobile UI · responsive · dark mode · then WebGL · three.js) — listing (`collections.log`), measured by the chain
      - `[>]` COMPONENT effects (uiverse galaxy — every element, by script · Animate.css · Animista · Motion examples ·
        Codrops · freefrontend · Material 3 / Apple components) → `motion/08-component-effects.md`, CE-…
      - `[>]` APPLICATION motion (Material 3 · Apple HIG · Fluent 2 · Carbon · Polaris · React Native Animated /
        Reanimated / gesture-handler / Moti / React Navigation · web-app FLIP / View Transitions) → `motion/09-app-motion
        .md`, AM-…
      - `[ ]` SMOOTHNESS in its own one-window pass (foreground, 60 Hz, CPU 4×) on the shortlisted techniques — frames
        per second cannot be measured with six windows open (R-9)
      - `[ ]` CodePen pens through the full measurer too (their preview URL as a page) — `cp-tag.js` reads code + one
        scroll + one hover only
      - `[x]` MERGED 2026-10-02: the reading agents' demos → `own-scroll-demos` (435 sites) · `own-motion-demos` (533) ·
        `own-app-demos` (60) · `own-component-demos` (1,547) — into the chain; **R-10** about 4,714 of them were CodePen
        pens, which the site measurer would have measured as CodePen's page, not the pen → split into
        `pens-own.list.json`, read by `cp-tag.js list:` (queued after the tag run, `after-cp.sh`)
      - `[ ]` uiverse — 3,824 elements RENDERED LOCALLY from the cloned open-source repo (`educo-research/src/galaxy`),
        each hovered / clicked / focused with shots: every element opened and run, ~1s each, no network
        (`uiverse-elements.list.json` keeps the page URLs) — `scripts/research/uiverse-run.js`: each of the 3,802
        elements loaded alone (no network) and driven at rest · hover · press · keyboard focus · click · reduced
        motion, ::before / ::after included, a shot per state, accessible names counted → `educo-research/runs/
        uiverse.json` — RUNNING 2026-10-02. **R-11** (fixed): a closed browser made it record every remaining element
        as failed in a second; now it stops, and errored elements re-run on restart
      - `[x]` `motion/08-component-effects.md` (uiverse 3,802 parsed: transitions median 300 ms, 64% `transition: all`,
        1.3% style `:focus-visible`, 0.26% honour reduced motion, 69% of inputs unlabelled · Animate.css 98 · Animista
        662 · motion.dev 462 · Codrops 775 · freefrontend 209 collections · Material web source (menus / dialogs open
        500 ms, close 150 ms; focus ring 3 px + 2 px offset) · Apple HIG 20 pages; CE-1…20)
      - `[x]` the measurer skips a live site already measured under another source (`sameAs`)
      - `[x]` **PLAN CHANGED by the user 2026-10-02 ("do we need 25,000 items?") — NO.** What matters is the number of
        distinct techniques, not of sites. The USER'S OWN LINKS run in full (aw-insp · wf-hover · wf-page-transitions ·
        opl-drop-shadow · aw-coll-transitions · aw-coll-hovers; CodePen sticky-header 120/120 + fixed-position 24/24 —
        done); EVERYTHING ELSE runs in random order until SATURATED: 150 items in a row that add nothing new (library ·
        CSS feature · kind of scroll change · hover change · page-transition kind · menu behaviour · held kind · phone
        behaviour; for pens, the techniques in their full code) → a `.saturated.json` beside each run says where it
        stopped and what was known. `aw-measure.js` / `cp-tag.js --saturate=150`. ~1 day of machine time instead of 3–4
      - `[x]` uiverse — ALL 3,802 elements run locally, 2026-10-02 (`educo-research/runs/uiverse.json`)
      - `[>]` **THE USER'S GO (2026-10-02): (1) write the library while the runs finish, (2) verify the bug ledger in
        code** — nothing that needs the browser meanwhile (memory ~1 GB free). `scripts/research/aggregate.js` condenses
        every finished run into `docs/web-anatomy/research-runs/AGGREGATE.md` (regenerated, never edited; first pass:
        732 sites, uiverse 3,802, 17 CodePen tags — sticky 47% · fade on scroll 55% · median transition 350 ms · Escape
        closes the menu 76% · visible focus on 74% of Tab stops · 70% still move under reduced motion). Three agents
        write `motion/library/1…11-*.md` (entry shape, measured shares, builder status verified); one agent verifies
        every ledger line → `educo-research/reading/ledger-verify.md` (REAL / NOT A BUG / CAN'T TELL)
      - `[ ]` **R-16 · the PHONE pass never ran at 360px** — Playwright's own viewport overrode my CDP device override,
        so every "phone" figure was the desktop page (held elements median 1,425px wide; 138 of 179 phone menu buttons
        at the desktop x). Found by a library agent, CONFIRMED by me in the raw data. Fix: Playwright viewport first,
        mobile / touch / Android / CPU 4× over it, and the pass CHECKS `screen.width === 360` or records a failure; the
        page may still lay out wider — recorded as `pageWidth` / `forcedWider` (a real phone finding). Re-measured by
        `--patch=phone` on every source done before the fix (`educo-research/phone-patch.sh`; aw-insp re-run after,
        its patch started on the old code). Proven: koox.co.uk 360px, 12 held, the phone menu opens
      - `[ ]` **R-17 · "Escape closes the menu" counted menus that never OPENED** (76% → re-measure: two rules gave 47%
        and 69% on the old records, so they are not trusted). Fix: the probe records `didOpen`; Escape and focus return
        are judged only on a menu that opened; the desktop menu is re-measured in the same patch; the summary counts
        only fixed-probe menus
      - `[ ]` **R-18 · see-through full-screen layers counted as preloaders / overlays** (intro 69% → opaque 36%, gone
        by load 3%; overlay page transitions 27% + 9% → 10% + 3%). Fix: `opaque` per cover (background alpha > 0.5, a
        picture, or media)
      - `[ ]` **R-19 · summary lines counted more than their names** — "fixed bar with nav" 55% (any fixed element with
        a link) → FIXED TOP bar 32% · glass bar 7% → glass TOP bar 2% · marquee 24% (a word) → marquee @keyframes 9% ·
        animation-timeline 6% (a word) → a REAL scroll timeline in a rule 1%. `aggregate.js` definitions tightened
      - `[ ]` R-20 · my R-18 relabelling made a stray "spa" kind (19%), and its `//` comment mid-line cut the statement
        (the R-13 mistake again) — both fixed; AGGREGATE regenerated
      - `[x]` **Library files written** (`motion/library/`): 1-held (16) · 2-scroll (20) · 3-section-transition (14) ·
        4-page-screen-transition (14) · 5-entrance-exit (17) · 7-gesture (11) · 8-feedback-state (18) ·
        6-hover-focus-press (24) · 9-text (11) · 10-surface (16) · 11-rules (17 + THE TOKEN PROPOSAL: instant 70 · fast
        150 (today 120) · base 300 (today 200) · slow 400 (today 320) · slower 500 · page 300 · reveal 800 · loop 1500 ms;
        stagger 60 ms capped at 500; standard (.2,0,0,1) · enter (.23,1,.32,1) · exit (.4,0,1,1) · emphasized = Material's
        real `linear()` curve, today's overshoot renamed `overshoot`; springs as two `linear()` shapes + a bouncy one for
        playful sites only — FOR THE USER TO APPROVE). More corrections: the median transition is 300 ms per element
        (350 was per site) · the 74% "visible focus" counted any box-shadow as a ring · `.eu-tab` / `.eu-navbar` CSS
        ships in every page but nothing renders it · the web app's shared Button has no `active:` and `focus-visible:`
        appears in 0 files. Research claims the writers found WRONG: "39% of award sites use ScrollTrigger" (live: 9%)
        · Lenis 28% (live: 16%) · NEW-E2 "bottom bars do not stack" (they do, `box-model.ts:5744`, `:5840`) · "arrival
        distance 12 units" (it is `PIN_ARRIVAL_AFTER = 120`, `box-model.ts:6142`) · cluster F's `box-export.ts:359`
        `100svh` (a comment; the value is at `box-model.ts:5622`). Their phone / menu / intro numbers wait for the
        re-measure and the regenerated AGGREGATE — then each file's numbers are refreshed
      - `[ ]` R-15 · One Page Love: the link finder took a "Launch website" link (One Page Love's list of OTHER sites)
        or a sponsor for 53 items — they measured the wrong site. Fixed (the gallery's own "Visit website" first,
        "Launch" never); the run set aside (`runs/old-format/opl-drop-shadow.wrong-link.json`) and re-run. Checked the
        other sources: every item resolves to its own site
      - `[ ]` R-12 · `cp-tag.js` never retried an errored pen (2 in sticky-header) — fixed: errored pens re-run · R-13 ·
        my R-12 edit put a `//` comment mid-line and commented out `const have` — CodePen crashed at once; fixed and
        proven by a run (sticky-header re-read to 120/120)
      - `[x]` 37 Awwwards collections listed: 6,984 items
    - `[>]` **THE RUNS (2026-10-02, session 1427d547)** — every item opened by `aw-measure.js` (DOM: sticky / fixed
      elements; what changes on scroll and HOW, with a no-scroll control; hover on up to 8 elements + the `:hover` rules
      and whether they are gated by `(hover: hover)`; every box-shadow; the page transition; the CSS rules and script
      calls that do it, verbatim; four screenshots), one chain, smallest first → `docs/web-anatomy/research-runs/`:
      `[x]` aw-insp (hover-effect, interactive-shadow-parallax = koox.co.uk, petro's 8) 10/10 · `[x]` wf-hover 13/13 ·
      `[ ]` wf-page-transitions · `[ ]` opl-drop-shadow 149 · `[ ]` aw-coll-transitions 366 · `[ ]` aw-coll-hovers 466 ·
      `[ ]` aw-cat-transitions 3,875 · `[ ]` aw-cat-animation (re-listing, every page) · `[x]` getcssscan 95 shadows
      (DOM values) · `[>]` CodePen 28 tags, every pen opened (`cp-tag.js`) · `[ ]` own-research demo lists
      (`own-scroll-demos`, `own-motion-demos` — ELEVEN reading agents: scroll half A–F (MDN · Chrome/web.dev ·
      scroll-driven-animations.style/Bramus · CSS-Tricks/Smashing/Roselli · Codrops via RSS/GitHub/archive · blogs +
      Material/Apple) writing `scratchpad/A..F.md` + `.urls.json`; motion half writing `scratchpad/demos/pt|hv|ex|mr|sh
      .json` + 03–07 sections. When they land: MERGE + dedupe the URLs into the two lists, VERIFY every HAVE / PARTIAL /
      GAP claim by my own grep (the mimo agent's were wrong 3 times), renumber NEW-* → SF-22+ · ST-12+ · SA-15+ ·
      PT-12+ · HV-15+ · EX-9+ · MR-16+ · SH-1+, append "Added 2026-10-02 (redo)" sections) → the same chain ·
      `[x]` mimo glossary — 13 pages read in full (`scroll-and-position/README.md`); its three "gaps" were FALSE (a bad
      grep: `scroll-padding-top`, `--eu-pin-above` and the staggered entrance all exist) — corrected · then the distillation,
      item by item, by parallel agents reading slices of the results
    - `[ ]` **AUDIT — every link the user gave: was EVERY item opened, run and read? (the user, 2026-10-02: "you just
      can't intrude them and that's going to be a false positive")** — a link closes only when every item on every page
      was opened live and HOW it is done written per item (RULE R "every item is opened, run and read"):
      - `[ ]` CodePen sticky-header / fixed-position — 47 pens' code read (some cut), pages 2+ missed, NONE run → re-done
        by `cp-tag.js` list + read
      - `[ ]` Awwwards Transitions COLLECTION (366, `awwwards-motion-survey.md`) — code fingerprinted only, NEVER driven
        → re-run live with `aw-measure.js` (FALSE POSITIVE until then)
      - `[ ]` Awwwards "Sticky elements" / petro.design — petro measured live; its 8 linked elements → `aw-measure --extra`
      - `[ ]` mimo `position: sticky` — page read; its glossary links (animation, transition, viewport, z-index, grid,
        flexbox, padding, margins, header) not yet
      - `[ ]` Awwwards Animation + Transitions CATEGORIES — listing collecting; 6 sites trial-run
      - `[ ]` Webflow page-transitions · Webflow hover effect · Awwwards hover-effect · Awwwards hovers-cursors collection
        · getcssscan box-shadow · One Page Love drop-shadow — recorded, not started
      - `[ ]` the older sources from earlier sessions (the layout crawl, `LAYOUT_BENCHMARK.md`, the Advanced CSS course,
        the motion survey) — audited the same way; any that were listed but not opened item by item get an open line here
    - `[>]` **CodePen — "look through everything there, see exactly how people do it"** (the user, 2026-10-02 session
      1427d547), and "go INSIDE each and every pen" (the sticky-header / fixed-position pens were summarised, never run
      one by one). `scripts/research/cp-tag.js`: `list` walks every page of a tag (`?cursor=`), `read` opens EVERY pen
      LIVE in its full view, scrolls it, two screenshots, records its sticky / fixed elements and what changed, and saves
      its FULL html / css / js → `docs/web-anatomy/codepen/raw/<tag>.json`. Tags: sticky-header · fixed-position ·
      position-sticky · sticky · sticky-nav · sticky-sidebar · fixed-header · scroll-animation · scroll-driven-animations
      · animation-timeline · parallax · scrollytelling · horizontal-scroll · view-transitions · view-transition ·
      page-transition · section-divider · shape-divider · clip-path · hover-effect · hover · cursor · starting-style ·
      popover · dialog · marquee · stacking-cards · reduced-motion. Then a distillation pen by pen: HOW each is done
      → `docs/web-anatomy/codepen/` by technique, HAVE / PARTIAL / GAP
      - STATUS 2026-10-02 (session 1fc987ff, the user asked "is CodePen done?" — NO): the tag run ENDED at 16:52 having
        read ~4,800 pens, but with `--saturate=150`: parallax (stopped p149), clip-path (p85), hover (p59), hover-effect
        (p73), cursor (p63), marquee (p42) were CUT SHORT; pens-own stopped at 570 of 4,714; section-divider,
        shape-divider and stacking-cards listed 0 pens; sticky-nav was never run. NOTHING distilled yet (the folder
        holds only `raw/`)
      - `[>]` RESUMED, NO saturation — the user: "don't start from the beginning… grab everything". 
        `educo-research/codepen-resume.sh` (a detached Git Bash process): every tag again, already-read pens skipped,
        then `list:pens-own` for the 4,144 not read. Logs: `educo-research/runs/codepen-resume.out` ·
        `pens-own-resume.out` · `chain.log` marks each end. Started 2026-10-02 ~17:58
      - `[ ]` section-divider / shape-divider / stacking-cards list 0 pens twice — try the tag names CodePen uses
        (divider · dividers · wave · svg-divider · stacked-cards · card-stack · stacking) once the resume ends
      - `[x]` HOW IT IS DONE, written AS EACH PEN IS READ (the user, 2026-10-02: "the code is right there… get everything
        together instead of getting them and then going back again"): `scripts/research/cp-how.js` reads a pen's own code
        and what it did when scrolled / hovered → `how` { summary, techniques (38 kinds: sticky, view() timelines, GSAP,
        IntersectionObserver, :has(), @starting-style…), the CSS rules that do it verbatim, the script calls }. `cp-tag.js`
        calls it on every pen it reads; the ~5,300 already read were given theirs from their saved code (no re-opening),
        and each tag has its page `docs/web-anatomy/codepen/<tag>.md` (techniques by count, then every pen with its how).
        Regenerate the pages after the run: `node scripts/research/cp-how.js docs/web-anatomy/codepen/raw`
      - `[ ]` HAVE / PARTIAL / GAP against the builder, technique by technique, into the motion library — once the
        reading ends (a judgement against our code, not a second read of CodePen)
    - `[ ]` **Box shadows** (the user's links, 2026-10-02 session 1427d547: https://getcssscan.com/css-box-shadow-examples
      · https://onepagelove.com/tag/drop-shadow — every page of the tag, each site's shadows measured live)
      — every example stored with its value; checked against the shadow tokens and Web Design Rule #5 (design
      foundation `02`). LATER (style, not layout) unless it shows a layout need
    - `[x]` **Section transitions + scroll animation (mine)** — `motion/01-section-transitions.md` (ST-1…ST-11),
      `motion/02-scroll-animation.md` (SA-1…SA-14), 2026-10-02. Proposed MUST: ST-5 overlap a card across a band edge
      (outer spacing cannot go below 0) · SA-4 reading-progress bar · CHECK→MUST: ST-1 a sloped / curved band edge shows
      the PAGE colour, not the next band (the guide says otherwise) · ST-3 the cut slices words / focus rings · SA-1
      reveal-on-scroll never plays inside a rounded / clipped box (`overflow: hidden`, same root as SP-4). DECIDE: ST-2
      ST-4 ST-7 ST-8 ST-10 · SA-2 SA-5 SA-8 SA-12. CHECK: SA-3 SA-13. LATER: ST-6 ST-9 ST-11 · SA-6 SA-7 SA-9 SA-10 SA-11
      SA-14. **NOT READ (open):** Codrops (403 to the fetcher), Apple HIG motion + Material 3 motion (need JS) → to read
      in real Chrome; Roselli / Paint API / curtain-footer / marquee sources read from summaries only
    - `[x]` **Entrance / exit + motion rules (mine)** — `motion/05-entrance-exit.md` (EX-1…EX-8), `motion/06-motion-rules.md`
      (MR-1…MR-15), 2026-10-02. Proposed DECIDE: EX-1 nothing can animate OUT · EX-4 accordion opens instantly · MR-1
      reduced motion swaps movement for a fade · MR-7 a visitor "Reduce motion" switch · MR-8 reduced-motion preview on
      the canvas · MR-11 `content-visibility` · MR-13 below-fold entrances play unseen. LATER: EX-7 · MR-10. CHECK: EX-8 ·
      MR-12 · MR-14 · MR-15. **NOT READ (open):** m3.material.io (JS), Polaris tokens (redirect), SCR40, PEAT
    - `[ ]` **BUG LEDGER — defects in what SHIPS, found by the motion research (RULE V: each fixed with a guard, or NOT A BUG
      with the measurement; to be verified in code + a headed check first — reported by a research agent, not yet seen)**
      - `[ ]` EX-2 · the alert's dismiss runs a hard-coded `.18s` + `setTimeout(180)`, not the motion tokens
      - `[ ]` EX-3 · dismissing an alert removes the focused close button — keyboard focus falls to `<body>`
      - `[ ]` EX-5 · the horizontal accordion animates `flex-grow` (a layout property); the panel widens empty first
      - `[ ]` EX-6 · a stagger of 90 ms × 10 children starts the last one after 810 ms — cap at ~500 ms
      - `[ ]` MR-2 · a pinned bar set to "solid" / "glass" never fills under reduced motion or in Firefox — words scroll
        under a see-through header
      - `[ ]` MR-3 · the `condense` and `glass` arrivals animate layout and blur on every scroll frame (jank on low-cost
        Android, RULE AF)
      - `[ ]` MR-4 · the pager's auto-advance has no visible Pause (WCAG 2.2.2)
      - `[ ]` MR-5 · auto-dismissing alerts have no visible way to stop the timer (WCAG 2.2.1 / 2.2.2)
      - `[ ]` MR-6 · hover effects are not gated by `(hover: hover)` — a tapped card stays lifted on a phone
      - `[ ]` MR-9 · motion tokens incomplete, three timings bypass them, `emphasized` still the overshoot curve
      - `[ ]` SA-1 · reveal-on-scroll inside a rounded / clipped box (`overflow: hidden`) — with SP-4
      - `[ ]` ST-1 · a sloped / curved band edge shows the page colour, not the next band (the guide says the next band)
    - `[>]` **MY OWN research (RULE RS), running in parallel 2026-10-02** — `docs/web-anatomy/motion/` 01 section
      transitions (ST-…) · 02 scroll animation (SA-…) · 03 page transitions (PT-…) · 04 hover / focus (HV-…) · 05
      entrance / exit (EX-…) · 06 motion rules (MR-…); each EXTENDS `motion-effects.md` + `awwwards-motion-survey.md`,
      never redoes them; gaps come here when they land
    - `[ ]` **COMPLETENESS — what the links still hold that has NOT been read (audit, 2026-10-02, the user asked "have
      we missed anything?")** — none of these may be skipped:
      - `[ ]` CodePen sticky-header + fixed-position: confirm EVERY page of each tag was collected (compare with the
        tag's own count; the collector stopped after 3 / 5 pages), and re-read the pens whose code was cut at 6,000
        characters (`…truncated` in the raw JSON) in full
      - `[ ]` mimo: the glossary pages it links to — **animation**, **transition**, viewport, z-index, grid-layout,
        flexbox, padding, margins, header-tag — at least animation and transition in full (they are this topic)
      - `[ ]` the 8 Awwwards elements petro.design links to (Rosehip scroll · Studio Illicit horizontal scrolling ·
        Quechua 2025 lookbook · G.S scroll-based animations · Emma is Social work page · Melvin Winkeler homepage on
        scroll · Theatre of Memory infinite-scroll archive · Type One Ventures homepage animation) — each element's
        live site measured
      - `[ ]` Awwwards Animation: **ALL listing pages**, not only the first 8 (`aw-list.js` stops at page 8 — raise the
        cap until a page adds nothing), then EVERY site visited in detail (the item above)
    - `[ ]` **RESEARCH STILL TO DO on this topic (planned 2026-10-02 with the user)** — sticky / fixed is enough once
      the completeness list above is closed; the rest, each studied the same way (every link, every example):
      - `[ ]` **section transitions** — how one band hands over to the next: shape dividers (waves, angles, curves),
        overlaps, colour fades, sticky "stacking" sections, clip-path / mask wipes, scroll-snapped full-screen sections
      - `[ ]` **scroll animation** — reveal on scroll, parallax, CSS scroll-driven animations (`animation-timeline:
        scroll() / view()`), pinned "scrollytelling", horizontal-scroll sections, progress bars, marquees
      - `[ ]` **page transitions** — the View Transitions API (same-document and cross-document), Barba / Swup-style
        overlays, shared-element morphs
      - `[ ]` **hover / focus effects and micro-interactions** — the full family (lift, tilt, reveal, sweep, magnetic,
        image zoom, underline), with touch and keyboard equivalents
      - `[ ]` **entrance / exit animation in CSS today** — `@starting-style`, `transition-behavior: allow-discrete`,
        animating `display` / `<dialog>` / popover
      - `[ ]` **motion rules** — WCAG 2.3.3 + `prefers-reduced-motion`, motion tokens (durations, easings), and
        performance on low-cost Android (compositor-only properties, no heavy scroll listeners — RULE AF)
      - the user sends links for these; the session ALSO researches each on its own (MDN, web.dev / Chrome developers,
        CSS-Tricks, Codrops, CodePen tags, Awwwards categories, design-system motion guides) and stores it the same way
      - `[>]` **"ENOUGH" CHECKLIST (RULE RS)** — written 2026-10-02 (session 1427d547); **waiting for the user's
        sign-off** before 1.1.5 is frozen. "Covered" = the user's links run item by item AND my own research read in
        full AND written into the library with measured numbers and the builder's status verified in code.
        | Need | Covered? | Where | What is still open |
        |---|---|---|---|
        | Sticky — every use and trap | ✅ | `library/1-held.md` · `scroll-and-position/01`, `04` | phone figures (R-16 re-measure) |
        | Fixed — every use and trap | ✅ | `library/1-held.md` · `scroll-and-position/04` | phone figures (R-16) |
        | Section transitions (dividers, overlaps, stacking, wipes, snap) | ✅ | `library/3-section-transition.md` · `motion/01` | — |
        | Scroll animation (reveal, parallax, scroll-driven, scrollytelling, horizontal, marquee) | ✅ | `library/2-scroll.md` · `motion/02` | — |
        | Page / screen transitions (View Transitions, overlays, app screens) | ✅ | `library/4-…` · `motion/03`, `09` | — |
        | Hover / focus / press + touch and keyboard versions | ✅ | `library/6-…` · `motion/04` · uiverse 3,802 run | — |
        | Entrance / exit (@starting-style, dialog, popover, menus, toasts) | ✅ | `library/5-…` · `motion/05` | desktop menu figures (R-17 re-measure) |
        | Motion rules — tokens, reduced motion, performance, WCAG | ✅ | `library/11-rules.md` · `motion/06` | smoothness (fps) in its own one-window pass — LATER, not needed to freeze |
        | Shadows / surfaces | ✅ | `library/10-surface.md` · `motion/07` · getcssscan 95 | — |
        | Component effects (for the component rebuild) | ✅ | `library/6`, `8` · `motion/08` | — |
        | App motion — web app + React Native | ✅ | `library/4`, `7`, `8` · `motion/09` | — |
        | Text effects | ✅ | `library/9-text.md` | — |
        | The user's own layout list | ⬜ | — | **the user adds it, then FREEZES 1.1.5** |
        Background runs still refining percentages (collections · categories · demos · pens, each until saturated) do
        NOT block the sign-off: they change shares, not the list of techniques.
      - `[x]` **MOTION TOKENS — APPROVED by the user 2026-10-02** (`library/11-rules.md`): instant 70 · fast 150 · base
        300 · slow 400 · slower 500 · page 300 · reveal 800 · loop 1500 ms; stagger 60 ms capped at 500; easings standard
        (.2,0,0,1) · enter (.23,1,.32,1) · exit (.4,0,1,1) · emphasized = Material's `linear()` curve (today's overshoot
        → `overshoot`); springs as two `linear()` shapes + a bouncy one for playful sites only. To be BUILT in the fix
        batches (today: fast 120 · base 200 · slow 320)
      - `[ ]` **THE FIX ORDER — agreed with the user 2026-10-02:** (1) commit the research · (2) NEW SESSION · (3) finish
        F-1 (F1-k, gate, commit) · (4) Batch A — published-page motion safety: SP-4/SA-1 `overflow: clip` · MR-2 Solid /
        Glass bar · MR-6 `(hover: hover)` · SH-7 forced-colours rings · N9 `--eu-color-surface-2` · N10 letter-spacing px
        (+ the approved tokens) · (5) Batch B — pager + alerts: MR-4 Pause · MR-16 focus stops it · NEW-A1 overscroll ·
        N1 double timer · EX-3 focus after dismiss · MR-5 touch pause · (6) Batch C — the Educo app, its OWN branch: AM-1
        `animate-in` · N4 loaders · CE-19 mobile spinner · then the rest of the verified ledger by area
    - `[ ]` **SP CHECK — for the HEADED UAT** (15 lines in `01-codepen-sticky-fixed.md`): anchors / Tab / Page Down land
      below a fixed bar and a sticky header at every rung · `pinArrival` in Chromium, Firefox, WebKit, without
      `animation-timeline`, under reduced motion, `condense` never jumps · a pin + an entrance effect keep both · a
      transformed / glass ancestor capturing a fixed block (`capturesFixed`) · bars stacking at 360px when one wraps or
      is unpinned on the phone · a sticky sidebar under the header with room to travel · canvas = export for held blocks
      with zoom · held bars at 200% zoom / 150% text on 360×640 · `bgAttach: fixed` on iOS / low-end Android · a bottom
      bar + keyboard · `pinStackScript` re-measuring when late images change a bar's height
- `[ ]` **My research of what is left** — to be added here (RULE R: the crawl tiers 95/99, `docs/LAYOUT_BENCHMARK.md`,
  the innovative structures) before the list is frozen
- `[ ]` **FROZEN** — the user approves the list; from then on nothing is added to the layout without the user's word

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
  builder is finished. Its first piece is queued as BATCH M-1 (the user, 2026-10-01: must be done, not now)
- `[?]` **What exactly is "the original work"?** Confirm with the user which of these it means before returning to it

---

## Session log

One entry per session, newest first. Written the moment the user says "new session" (or the context is about to run
out) — where the session STARTED FROM, where it GOT TO, and where the next one CONTINUES FROM.

### 2026-10-03 · session 6eaa0c27 · branch `builder/layout-uat` — HANDOVER (recommended and accepted: the context is genuinely long — L-3 closed + most of R-2's research and proofs — and the work is at a clean point, everything committed, the crawl running on its own; the next job, the gap check, is heavy)
- **Started from:** session 07c6c075's handover — BATCH L-3 → L3-p.
- **Got to:** **BATCH L-3 CLOSED** (`6d67d52`, `4de9d92`): L3-p / L3-b / L3-o were ONE bug — every resize start measured the
  block above with its children's grow off and "restored" `flex-grow` from a `var(--bx-gut)` shorthand (reads ""), breaking
  every dragged row's columns until a reload (guard `drag-keeps-flex.spec.ts`); c-11b the drag's room from the DRAWN line
  (guard `row-never-stores-over-100.spec.ts`); c-11a comment only (the user's choice); L3-t / L3-u / L3-w harness (headed
  windows at device scale 1; pagers reset instantly; the HOLE audit counts gutter margins). Gate: typecheck 0 · eslint 0
  errors · vitest 3,985 · test:fast 803; regression headed clean. **Rules added (all in CLAUDE.md, guarded):** RULE K (kill
  what is not in use; a "killed" notice is not proof) · RULE R "until saturated" for big listings + the user's test of
  enough · **RULE MAP** (map the axes → an example per value → prove combinations per family, ACROSS families, at EVERY
  LEVEL nested both ways, and every STATE / EFFECT / TRANSITION the same way, WCAG first → saturate, measured → taste /
  real world / people → then the USER can do it in the builder). **R-2 (RULE MAP), committed through `3fdb8c6`:** the axis
  map `docs/web-anatomy/area-v/AXIS-MAP.md` (7 families); `scripts/uat/r2-axes.js` (every axis as code) + `r2-combos.js`
  (specimens + 60 random combinations per family: valid · painted · visibly distinct) + `r2-stack.js` (40 cross-family
  blocks, 213 ablations: V-10 confirmed 9/9, the wrapper fix proven) + `r2-nest.js` (40 nested trees, cascade down 0
  failures, 0 clashes up) + `r2-states.js` (30 trees, real mouse + keyboard, 133 checks, 0 failed); sheets in
  `docs/web-anatomy/area-v/specimens/` (index.html opens them all). AREA V ledger **V-7 … V-13** (builder bugs and rules
  found: radial shape lost in the editor, stop alpha lost, gradient under a photo dropped, a shaped band's shadow clipped,
  shadow tokens unused, no contrast hint on a block's colours, own state must beat a driven one / no inline base where a
  state changes it). R-2 ledger R2-1 … R2-22 all closed (crawler and proof faults, each fixed and mutation-proven).
- **Continue from:** BATCH R-2 (YOU ARE HERE) → **step 4, the GAP CHECK**: when the crawl ends, compare everything it collected
  with the map; anything new is added AS CODE to `r2-axes.js` and every proof re-run; then step 5 (the AXIS-MAP "Not yet"
  values), step 6 (the real-world pass: 360px phone, Slow 3G), step 7 (the "enough" checklist to the user). STILL RUNNING
  at handover (13:30, detached, educo-research): CodePen `shadow` (cp-prof/1, pen 299, `--saturate=150`), Awwwards texture
  live sites (profile-aw2, 74 / 805, `--saturate=50`), the tool-site chain `r2-sites2.sh` (Dribbble search → Mobbin first page
  → Grabient resume). Stop each by its profile path when done (RULE K).

### 2026-10-03 · session 07c6c075 · branch `builder/layout-uat` — HANDOVER (the user asked; recommended: the context is genuinely long — the Divider pass with three fixes and four six-window runs, c-11c, L3-f, two page runs, the AREA V investigation, two new rules, 20 links; clean boundary — the gate green and everything committed, a heavy live-canvas hunt next)
- **Started from:** session f86b7fdf's handover — BATCH L-3 → L3-f.
- **Got to:** research chain STOPPED on the user's "stop it" (L3-j; 0.5 → 3.9 GB free). **c-11c BUILT** (decided B,
  `holdsWords` in `tabletPlaces` + audit L6). **R-23 / change 5 HEADED 6/6 CLEAN** — on the way: L3-l the thickness
  reached the page as px (now plain rem; my first fix used the fluid `u()` and the pass caught it), L3-r a thickness padded
  the Divider 28px in from the words (seen only in the screenshot), L3-s a 1px Divider could not be dropped under (now
  0.5rem above / below). **L3-c CLOSED**; **L3-f CLOSED as harness** (the canvas stayed on the slide that was typed into;
  pagers now go back to slide 1 before measuring). L3-n harness: the dresser sized rows at Wide, which never reaches
  Desktop. **L3-b REOPENED** (332's hole is back with 0 page errors). OPEN: L3-p / L3-b / L3-o (one live-canvas bug most
  likely: a wrapped cell at its 224px floor that a reload fixes) · L3-t (333 heights) · c-11b (359 stores 100.15%) ·
  c-11a (the USER decides). **AREA V** investigated (research + code) and reported; **RULE UI** written into CLAUDE.md
  (everything built is in the builder, easy to pick and to make your own — including what was built before: BATCH U-1);
  **R-2** has the user's 20 links. Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 3,985 · test:fast 793.
- **Continue from:** BATCH L-3 (YOU ARE HERE) → L3-p. **The user agreed the plan 2026-10-03 ("go with that"):** finish L-3 → R-2 research (20 links + mine, the user signs "enough") → AREA V batches (colour & backgrounds → section shapes & blending → shadows / overlays / effects → motion), each with its builder controls (RULE UI) → U-1 in the user's order.
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md (note the new RULE UI), then
  `docs/TASK_TREE.md` — YOU ARE HERE is BATCH L-3; read its ledger (L3-a … L3-t, c-11a/b/c) and AREA V, U-1, R-2 at the
  top. Do, in order: (1) **L3-p** — page 223 (and 332's L3-b, 359's L3-o, most likely the same bug): on the LIVE canvas a
  wrapped cell is drawn at its 224px floor (29.2% at 768) while the Preview — and the same tree RELOADED — fill its line.
  Not a cache, not a stray inline style (both checked). Reproduce it THROUGH THE UI in a main column beside a sidebar (the
  223 shape: words + 3 icon cells sized 70·10·10·10 at Desktop with `Builder.sizeColumns`), measuring in CANVAS px (÷ the
  canvas zoom — `probe-c11b.js --live` forgot it once), live vs reload; then the root fix with a guard RED first, then the
  three pages re-run. (2) **L3-t** — page 333: canvas ≠ Preview in HEIGHT (35–110px) after the stress. (3) **c-11b** — page
  359 stores 42.71 + 41.62 + 8.51 + 7.31 = 100.15%: find the drag that writes it (DEBUG=1 prints stored widths per drag).
  (4) **c-11a** — ASK THE USER (recommended: fix the stale comment only). (5) the checklist's regression line, then close
  L-3. THEN R-2's research with the user's 20 links + my own (RULE RS), never beside a test run. Standing: c-11c is B ·
  ST-7 = both Queue and Stack · motion tokens approved · RULE UI · AREA V order: L-3 → R-2 research → colour & backgrounds →
  section shapes & blending → shadows / overlays / effects → motion → U-1 in the user's order. Traps: a 'killed' notice is
  not the process dying (check the port) · vitest and Playwright never together, and the unit tests READ the tree — don't
  edit it during a gate · never edit engine source during a page run (the harness stops starting pages: L3-m) · building into a second folder makes `next build` REWRITE tsconfig.json (adds `.next-b/types`…) — `git checkout -- tsconfig.json` before a commit · build into
  a second folder (`NEXT_DIST_DIR=.next-b|.next-c`) and check it with `check-fresh-build.js <port>`; `BASE=` points the
  harness at it · measure the canvas in canvas px · read the screenshots (L3-r was invisible in every number) · use the
  Edit tool for backslashes / CRLF · a new spec goes in package.json AND scripts/test-fast.js · background runs get the
  2-hour limit · the YOU ARE HERE marker is plain text after the arrow."

### 2026-10-03 · session f86b7fdf · branch `builder/layout-uat` — HANDOVER (recommended and agreed: the context is genuinely long — R-1, L3-h, the whole #185 hunt and c-12b; clean boundary — everything committed, the gate green, c-11 engine work next)
- **Started from:** session 1fc987ff's handover — BATCH R-1 (research at full width), then L-3 (paused).
- **Got to:** **R-1 CLOSED** by the user's "enough" (`fe320f5`): machine measured (memory is the limit), CodePen at 6
  collectors and one Awwwards lane, then stopped — 1,212 new pens, ~391 sites, every one of the user's own links
  complete; step 4 (divider / dividers / wave, 137 pens), tag pages regenerated, HAVE / PARTIAL / GAP in
  `motion/library/3-section-transition.md`. Ledger R-21 (cp-tag ended a tag on a failed page — fixed, proven) · R-22
  (my lane mistake) · **R-23 the Divider published `<div aria-hidden>` — now `<hr>`** (`6f94ce7`, headed check is L-3
  change 5). **BATCH S-2 · Section transitions** queued (ST-5 overlap · ST-1 next-band colour · ST-4 wave/SVG edge ·
  moving wave · ST-7 stacked cards — the user: BOTH Queue and Stack, Queue the default). **L3-h / L3-g CLOSED** (`65704db`):
  the stressed 250px HOLE was the AUDIT (R-24, `flex-shrink: 0` blocks cannot shrink) — red 4/4 → green 4/4, proven both
  ways. **#185 FOUND AND FIXED at its root** (`cf614c8`): reproduced through the UI only with the CPU slowed 3× (it is a
  race); part 1 the canvas frame's ResizeObserver re-made on every key; part 2 every key committed the whole site
  (65–95 ms a key, 185–353 ms slowed, #185) → **c-12b BUILT as the user decided**: a burst of typing is one save and one
  Undo, words kept on blur / page hide / close / unmount → 8–9.5 ms a key, 22–28 ms slowed, the full stress 6/6 clean in
  six slowed windows. **L3-b CLOSED with it** (its live hole was #185's half-finished update). Guide + published guide
  artifact updated (`3e9cb46`). Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 3,980 · test:fast 793.
  My own slips, all fixed: a 1-hour limit killed a slowed run with no output; a shell edit failed silently and opened 12
  windows; a dev-server diagnosis never started (the dev server recompiles when the probe writes logs inside the repo).
- **Continue from:** BATCH L-3 (YOU ARE HERE) → L3-f.
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md, then `docs/TASK_TREE.md` — YOU ARE HERE
  is BATCH L-3 (5 changes); closed in it: L3-h, L3-g, L3-b, change 1 #185 and c-12b. Do, in order: (1) **L3-f** — page 141
  after the stress typing showed canvas ≠ Preview at all 5 rungs on 12 blocks whose SIZES match; inferred: typing into the
  rotating hero's hidden slides scrolls the pager on the canvas while the Preview opens on slide 1. MEASURE first (each
  block's left position and the pager's scrollLeft on both sides, through `scripts/uat/probe-l3-row.js` on
  `dressed99-out/page-141.final.site.json`) before calling it harness or product; NOTE the c-12b fix changed typing, so
  re-run the page first. (2) **The page-141 re-run for L3-c** through the UI on a fresh build (`uat-pages.js
  --plan=dressed99 --pages=141,329,332,333,34,43 --jobs=6 --stress`, ~43 min; six windows). (3) **c-11a** — the
  `packRowLines([70.04, 9.99, 10.14, 10.02])` guard RED first (a line that rounds to 100.4% must be one line, as its own
  comment says), then the fix; **c-11b** — find what stores rows over 100% and stop it; **c-11c (decided B)** — an icon
  cell does not count for the tablet rule, in `tabletPlaces` AND the audit's L6 check. (4) The batch's HEADED pass
  against its checklist (six windows, all themes, every rung, canvas AND Preview), including change 5: R-23 the Divider
  as `<hr>` — canvas == Preview, one line, no UA margin or inset border, style / thickness / colour in all 4 themes, a
  separator in the accessibility tree. Standing decisions: c-11c is B; S-2 queued after the layout and motion batches
  (ST-7 = both Queue and Stack). Traps: a 'killed' notice on a background shell is not the process dying (check the
  port); research never runs beside a UAT; vitest and Playwright never together; `test:fast` needs port 3100 free; build
  into `.next-b` (`NEXT_DIST_DIR`) and check it with `NEXT_DIST_DIR=.next-b node scripts/check-fresh-build.js 3200`; a
  slowed CPU (`--cpu=3` in the probes) finds races the normal speed hides; use the Edit tool, never `node -e` / shell
  replacements, for anything with backslashes or CRLF files; a new spec must be added to `package.json` AND
  `scripts/test-fast.js` (`test-scripts.test.ts` guards it); give background runs the 2-hour limit and print results as
  they happen; the YOU ARE HERE marker is plain text after the arrow."

### 2026-10-02 · session 1fc987ff · branch `builder/layout-uat` — HANDOVER (the user: "we start this in a new session"; context compacted once; clean boundary — L-3's testing finished, the gate green, everything committed)
- **Started from:** session ca50a336's handover — F1-k, the full gate and the F-1 commit still to do.
- **Got to:** F-1 CLOSED and committed (`e6a30d4`). BATCH L-3 opened with its checklist; the user decided c-12b ("go with
  your recommendation": measure first; a burst of typing = one Undo, saved when typing stops). L-3 ledger: L3-a #185 NOT
  REPRODUCED in 12 headed runs, 6 of them stressed (closed with the measurement, the sweep's page-error check is its
  guard) · L3-c the audit read a pager's hidden slides as words at the page edge — FIXED, guard red-first and
  mutation-proven · L3-d / L3-e harness: page errors keep stack + step, `--stress` forwarded, the final tree saved,
  phases named, the HOLE message carries each column's drawn width / flex / min-width · L3-i my own unbolded-marker
  slip — fixed. OPEN: L3-b (page 332 Tablet hole, live canvas only), L3-f / L3-g (page 141 after typing), L3-h (a 250px
  Mobile hole on 4 pages after the stress typing), c-11a/b/c not started. CodePen: the user asked "is it done?" — no:
  the tag run had stopped with `--saturate=150` (six tags cut short, article pens 570 of 4,714, four tags with 0 pens).
  Resumed without saturation, and the user's ask built in: `scripts/research/cp-how.js` writes HOW each pen is done
  while its code is in hand; ~5,300 pens given theirs from saved code; 26 tag pages in `docs/web-anatomy/codepen/`.
  NEW RULE (CLAUDE.md, RULE RS): research runs as wide as the machine allows, split by site, measured first, never
  beside a batch's testing, one job finished before the next. Research PAUSED for the stress run; servers 3100 / 3200
  stopped. Gate: typecheck 0 · eslint 0 errors (105 warnings) · vitest 213 files · test:fast 789.
- **Continue from:** BATCH R-1 (YOU ARE HERE) — research at full width; then back to L-3 (paused, its open lines listed
  on its batch line).
- **Next prompt (paste to start):** "Branch `builder/layout-uat`. Read CLAUDE.md, then `docs/TASK_TREE.md` — YOU ARE HERE
  is BATCH R-1 · Research at full width. Do R-1 in order: (1) measure the machine (CPU, free memory; no UAT, no
  `next start` running); (2) CodePen at 6 windows — three `cp-tag.js` collectors, each with its own COPY of the profile
  `prof-c` (path in `educo-research/codepen-resume.sh`) and its own share of the tags in that script, plus
  `list:docs/web-anatomy/research-runs/pens-own.list.json` (4,144 not read) split into its own collectors at the same
  time; NO `--saturate`; pens already read are skipped and every new pen gets its `how` from `cp-how.js`; step down if
  CodePen asks 'are you human' (the user ticks it once in that window); (3) the Awwwards chain
  `educo-research/chain.sh` restarted WITHOUT `--saturate` (it was on `aw-coll-animation-libraries-examples-inspiration`),
  and the other queued lists side by side, as wide as the machine allows; (4) the three 0-pen tags under CodePen's own
  names (divider, dividers, wave, svg-divider, stacked-cards, card-stack, stacking), then
  `node scripts/research/cp-how.js docs/web-anatomy/codepen/raw` to refresh the tag pages, then HAVE / PARTIAL / GAP
  against the builder. Report progress as numbers (pens read per tag, sites measured). When R-1 closes, back to BATCH
  L-3 (paused): L3-h first (one stressed page with the new HOLE details), then L3-b, L3-f, L3-g, the page-141 re-run for
  L3-c, then c-11a (`packRowLines([70.04, 9.99, 10.14, 10.02])` guard red first), c-11b, c-11c (decided B). Standing
  decisions: c-12b measure first, then a burst of typing = one Undo; c-11c B. Traps: a 'killed' notice on a background
  shell is not the process dying; research never runs beside a UAT; vitest and Playwright never together; the YOU ARE
  HERE marker is plain text after the arrow."

### 2026-10-02 · session 1427d547 · branch `builder/layout-uat` — HANDOVER (recommended and agreed: the context is very long — a full day of research, ~40 agents; clean boundary — research written, verified and committed, fixing next)
- **Started from:** 7af7f72 — the Awwwards Animation research about to run; F-1 paused, code uncommitted.
- **Got to:** the user found the earlier research was a false positive (listings walked, items never opened) → a new
  rule (RULE R: every item is opened, run and read) and a full REDO: every link the user gave measured item by item by
  `scripts/research/aw-measure.js` (DOM, timing, hover strips, menus, page transitions, reduced motion, phone) and
  `cp-tag.js` (every pen opened, run, its full code read); uiverse's 3,802 elements run locally; my own research by ~40
  reading agents (MDN, Chrome, Bramus, CSS-Tricks, Smashing, Codrops, design systems, React Native); everything kept
  ONCE for the builder, every component AND the Educo app in `docs/web-anatomy/motion/LIBRARY.md` + `library/1…11`
  (198 entries), raw data in `C:\Users\eyite\educo-research\` (outside git). The user stopped the 25,000-item plan:
  their own links in full, everything else until SATURATED. Bug ledger verified in code (22 real + new N1…N10). Motion
  tokens APPROVED. 20 bugs in my own research tools found and fixed (R-1…R-20) — the worst: the phone pass never ran at
  360px (R-16), menus that never opened counted as closing on Escape (R-17), see-through layers counted as preloaders
  (R-18); the library marks those numbers PENDING until the re-measure lands.
- **Continue from:** the "ENOUGH" CHECKLIST sign-off (1.1.5) → the user's layout list → FREEZE → F-1 → Batches A · B ·
  C. While working: regenerate `research-runs/AGGREGATE.md` (`node scripts/research/aggregate.js
  C:/Users/eyite/educo-research docs/web-anatomy/research-runs/AGGREGATE.md`) when the phone / menu re-measure ends,
  and refresh the library's PENDING numbers; move `docs/web-anatomy/codepen/raw/` (38 MB, git-ignored) into
  `educo-research/` once the CodePen run ends.

### 2026-10-02 · session ca50a336 · branch `builder/layout-uat` — HANDOVER (the user asked; recommended too: context compacted once and holding the whole course + 4 research sources; clean boundary — course finished, the Awwwards run not started)
- **Started from:** BATCH F-1 (YOU ARE HERE), from 6793d4b.
- **Got to:** (1) F-1: change (1) MEASURE — the W19 unused-space audit check; fixes A (components hug / fill), B
  (wrapped columns fill — the user's "fill after a wrap"), C (1rem menu gap on a phone); ledger F1-a…F1-j fixed or NOT A
  BUG, all headed-checked; F1-k OPEN (page 38 at Tablet: 3 holes + canvas ≠ Preview by 24px). NOTHING COMMITTED for
  F-1 — the code is in the working tree; the full gate has not run. (2) The user PAUSED F-1 to define the layout's end:
  the user's Advanced CSS course (Natours · how CSS works · Sass · responsive · Trillo/Flexbox · Grid · Nexter) stored
  lecture by lecture in `docs/web-anatomy/advanced-css/` (01–08 + README, 36 gaps AC-1…AC-36); **1.1.5 · LAYOUT —
  DEFINITION OF DONE** drafted in this tree (MUST 6 · DECIDE 20 · CHECK 9 · LATER). (3) Research the user asked for —
  section transitions · animation · sticky · fixed: CodePen sticky-header + fixed-position (47 pens, 22 techniques),
  mimo, petro.design → `docs/web-anatomy/scroll-and-position/`; gaps SP-1…SP-14 in 1.1.5 (SP-1 and SP-4 verified in the
  code). The Awwwards Animation listing collected (248 sites); its measuring script written, not run.
- **Continue from:** the Awwwards Animation research (1.1.5): add (a) which elements animate and how and (b) the page
  transition to `scripts/research/aw-measure.js`, run it in real Chrome, distil, put SP-15… into 1.1.5. Then: more
  links the user sends → the user's own layout list → my research of what is left → the user FREEZES 1.1.5 → back to
  F-1 (F1-k, gate, commit) and the queued batches.

### 2026-10-01 · session 4f2e9df1 · branch `builder/layout-uat` — HANDOVER (recommended: context long — all of L-2, 13 ledger lines, ~70 headed runs; clean boundary — committed, F-1 heavy next)

- **Started from:** `7e1a030`, BATCH L-2 not started.
- **Got to:** **L-2 CLOSED** (`2bcc73f`, tree `12ffcc3`): the canvas zoom is drawn with `transform` (laid out 1:1 like the
  Preview); a one-column band has no gutter; header/footer lines spread and centre (the user's decision); buttons no
  longer underlined; editable body text is a `<p>` and never wider than its block; #144 measured in Chromium, Firefox and
  WebKit, false warning gone; `check-fresh-build` compares with the build's START. Gate: typecheck 0 · eslint 0 errors ·
  vitest 3,932 · test:fast 757. DECIDED by the user: BATCH F-1 (the page uses its space) opened right after L-2, every fix
  in the shared engine with an enumerating guard; BATCH M-1 (the L-2 fixes in `apps/mobile/`) noted as a must, not now.
- **UNCOMMITTED:** nothing but run logs in `scripts/uat/logs/` (never committed).
- **Continue from:** BATCH F-1 (YOU ARE HERE): write its checklist, then change (1) MEASURE FIRST.
- **Not done, and said so:** M-1 not started (the user's word); S-3 still waits to be placed; the six-window 37-minute
  timeouts of 2026-09-30 remain unexplained.

### 2026-10-01 · session 80d91cf9 · branch `builder/layout-uat` — HANDOVER (recommended: two batches in context, clean boundary, L-2 heavy)

- **Started from:** `ff9471f`, BATCH L-1 at its last three steps, its code uncommitted.
- **Got to:** **L-1 CLOSED** (`509822a`, `d138a6d`): page 337 built 18 of 18 in six windows; L1-12…15 fixed (the page
  runner now refuses a stale server and reports a lost one); L1-13 PARKED by the user. **Z1-a, Z1-b** (a held block slid
  and an item ring sat off its item while the canvas was fitted) fixed `1550371`. **Z-1 CLOSED** (`70f0c21`): canvas zoom
  as approved; acceptance pages 334 and 12 BUILD; Z1-c…p closed (Z1-j: Delete on a focused toolbar button deleted the
  selected block — fixed). Gate at `70f0c21`: typecheck 0 · eslint 0 errors · vitest 3,923 · test:fast 748. DECIDED by
  the user: Tasks 2–4 → batches L-7/8/9 on a fresh `builder/layout-2` after the PR, before the re-sweep and the story;
  S-3 gains a "column too narrow for its words" warning; Z1-i accepted.
- **UNCOMMITTED:** nothing but run logs in `scripts/uat/logs/` (never committed).
- **Continue from:** BATCH L-2 (YOU ARE HERE): write its checklist first, then e-4 (the burger menu's "Contact" wraps on the
  canvas, not in the Preview — `probe-e0b.js --w=1920`), e-8, e-10, #144.
- **Not done, and said so:** the six-window 37-minute timeouts of 2026-09-30 remain unexplained; mobile has no canvas
  (rule 20); the published artifacts and the layout story come after L-9.

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
