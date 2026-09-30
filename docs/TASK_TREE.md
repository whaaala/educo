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

Last updated: **2026-09-29**, session df7557b5, branch `builder/layout-uat`.

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
          lock or load); re-run them alone first. = c-6
        - `[ ]` e-3 · not built: **the drag never reached the canvas, twice** — 4 (idx 23, 334, 335, 337; three in a
          row) · and 1 "cannot drop into m-2a: only 0px visible" (idx 336). Same clustering: re-run alone first
        - `[ ]` e-4 · **canvas≠Preview (R11)** — 13 pages, 37 findings, every screen size; 6 pages carry most of it
          (idx 109, 141): headings, links and buttons 0.4–3.6% narrower in the Preview, text wrapping to other heights
          (−24 … +10px); 4 containers 122–198px shorter at Wide. = c-3, reopened
        - `[ ]` e-5 · **React #185** — 9 pages (was 2). = c-12
        - `[ ]` e-6 · **Tablet: 4 columns on one line** — 8 pages, 142 findings (was 3). = c-11
        - `[ ]` e-7 · **Words broken across lines** — 4 pages, 58 ("1,000+" in 165px Stat columns). = c-8 (decided B)
        - `[ ]` e-8 · canvas≠Preview on a component 20–24px taller in the Preview — 2 pages (idx 209 and one more)
        - `[ ]` e-9 · HOLE at the end of a line — 2 pages (idx 210 at Wide 228px; one at Mobile). = c-7 (decided B)
        - `[ ]` e-10 · canvas≠Preview on one block 28px taller — 1 page (idx 272)
        - `[ ]` **NEXT: re-run e-2 and e-3 alone first** (idx 23, 68, 145, 334–337, 393, 396–401) on a FRESH build —
          a failure that goes away alone was the machine, one that stays is a bug **← YOU ARE HERE**
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
    - `[ ]` Engine, from the spacing tokens (rem + cqw), in BOTH engines by one emitter: a side gutter for every
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
      Chromium 145; check Safari 16 before removing the canvas mirror)
    - `[ ]` #127b the stat number "1,000+" breaks in a 10% column (joins c-8)
    - `[ ]` #82b · #83 (1366 width round trips drift) · #84 (left-edge resize uses a fixed 14rem neighbour floor)
    - `[ ]` previewcheck B30 / P4 (harness: drop / select)
    - `[?]` #46 and #42 — could not be identified anywhere; ask the user what they were
    - `[!]` the slide-image check (Sonnet) — named in the 2026-09-28 handover, status unknown
  - `[ ]` **Story additions** in `docs/guide/layout-story.md` for everything above (RULE L)
  - `[ ]` Artifacts and guide updated in the same change (Builder Hub · Layout System · Parity Audit · Semantic plan ·
    `docs/guide/website-builder.md`)
  - `[ ]` Gate → commit → **pull request to `master`** → delete the branch (rule 9)
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
- `[!]` **Mobile Drive feature** — memory `project_drive_status.md`
- `[ ]` **Builder on phone and tablet** — a webview over the real export, inside the Educo app (rule 20); after the web
  builder is finished
- `[?]` **What exactly is "the original work"?** Confirm with the user which of these it means before returning to it

---

## Session log

One entry per session, newest first. Written the moment the user says "new session" (or the context is about to run
out) — where the session STARTED FROM, where it GOT TO, and where the next one CONTINUES FROM.

### 2026-09-29 → 30 · session 6c14c5c8 · branch `builder/layout-uat` — HANDOVER (the user stopped for the night)

- **Started from:** `66b6896`, the tier-99 re-run 4 minutes in.
- **Got to:** the re-run FINISHED and TRIAGED — 403 pages in 957 min; clean 17 → 356, not built 52 → 21; ten classes
  e-1 … e-10 in the ledger (1.1.1 → tier 99 → d). Read-only findings on c-6, c-11, c-12 in the tree. Rule 3 in `CLAUDE.md`
  REWRITTEN to "space by default, always overridable" for every element and component, guard updated and green
  (`claude-md-rules.test.ts`, 150 passed); scenarios in `box-builder-spacing.feature`. c-23, c-24 found by reading.
- **Decided by the user this session (each recorded under its line):** c-7 B · c-8 B · c-21 B · grid picker B (any
  count up to 12) · Tasks 2–4 = the original list · saved pages keep their spacing · the default spacing values ·
  c-11c B (an icon cell does not count for the tablet rule).
- **Continue from:** 1.1.1 → tier 99 → d → "re-run e-2 and e-3 alone first" (YOU ARE HERE). Then SPACE BY DEFAULT (the
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
