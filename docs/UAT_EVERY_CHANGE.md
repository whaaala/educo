# RULE X — See it yourself first

> **Every change, however small, is driven in the real UI in a real browser from the user's point of view
> — in ONE pass per BATCH of related changes (one area, at most 6), its checklist written first, before the
> next batch opens.** Changed by the user 2026-09-30 from "one pass per change": the same coverage, one build
> and one browser session instead of one per change, and the pass sees the changes TOGETHER.

Asked for directly, and for a reason that is written all over this project's history:

> "It seems like I'm always the one telling you what the issue is, and then you're always checking it and
> see it's not wrong. So let's make this a rule. It's a must rule."

That is an accurate description of what kept happening. Look at the bugs in
[FIX_WHAT_YOU_FIND.md](FIX_WHAT_YOU_FIND.md) and at the ones recorded in the layout work: the floated block
that scrolled away, the gap above the flush bar, the size that was not restored on unfloat, the block that
disappeared on the second float, the preview that did not fill the screen, the bars that vanish at a
breakpoint. Every single one was **found by the user, in the UI, and only then reproduced by me**. In every
case the unit tests were green and the typecheck was clean at the moment the user hit it.

A passing test suite and a working feature are different claims. This rule closes the gap between them.

---

## The rule

### 1. One batch, one UAT pass — checklist first

The batches are the BATCHES section of [TASK_TREE.md](TASK_TREE.md): one area each, **at most 6 changes**, one
open at a time. Before the pass, write the checklist — every change × every combination (section 3). After every
change, typecheck and its unit guard (seconds). Then one headed pass on a fresh production build ticks every line
with what was seen. The limits are what keep the old failure away: "batching them and looking once at the end"
meant ten unrelated changes and no list; a small, related batch with a written list still tells you which change
did it, and the combination you never tried is on the list because it was enumerated, not remembered.

### 2. It is the REAL app, not a fixture

Drive `localhost:3000` (or the relevant app) through the actual controls — click the button, drag the
handle, open the menu, choose the preset. A hand-built fixture proves the resolver works; it does not prove
the **builder makes that shape**. Guards must run in the shape the builder produces — the same reason a
hand-built two-cell row hid the grid-cell resize bug for months.

### 3. Every combination, not one sample

For the one thing you just changed, go through every combination it can appear in:

| Axis | What to cover |
|---|---|
| Themes | light · dark · midnight · purple |
| Web widths | 375 · 768 · 1280+ — **and the widths in between**, swept, not sampled |
| Devices | the presets in `lib/preview-devices.ts`, phone → monitor, both orientations |
| Entry points | menu item · toolbar button · keyboard shortcut · right-click · drag |
| State | each toggle ON and OFF, empty and full, first use and after a reload |
| Repetition | do it **twice and three times** — the float bug only appeared on the second cycle |

Try to break it. A change that survives one careful look and nothing else has not been tested; it has been
glanced at.

### 4. Say what you drove and what you saw

The report names the actions and the observations — "dragged the right grip from 1536 to 375, the three top
bands stayed put at every width, measured" — not "verified working". A claim with no measurement behind it
is the thing this rule replaced.

### 5. A bug found during UAT is RULE V's problem immediately

It goes into the BUG LEDGER the moment you see it, and it is fixed in the same change with a
mutation-proven guard. See [FIX_WHAT_YOU_FIND.md](FIX_WHAT_YOU_FIND.md).

---

## How, in practice

- **Playwright MCP** for exploring and for looking: navigate, click, drag, screenshot, read computed style.
  It is a real Chrome, so what it shows is what a visitor gets.
- **In parallel, always** (CLAUDE.md RULE Z, the user 2026-09-30): a pass, a sweep or a re-run opens as many visible
  windows as the machine takes (`--jobs=6`, probes side by side with `--pos=`). Only a case that FAILED in parallel is
  re-run alone, to tell load from a bug — "alone" in an older note means that, never "one at a time for everything".
  Never run vitest while these windows are open (rule 15).
- **Seed the page, drive the UI.** Writing `educo_box_site_v1` into `localStorage` gets you to the state in
  one step, but the *interaction under test* is still performed through the real controls.
- **Measure, don't reason.** Read `getBoundingClientRect()` and `getComputedStyle()` rather than arguing
  from the spec. The grid pin scope was reasoned out from the CSS Grid spec and was wrong; one measurement
  settled it.
- **Then write the guard**, so the pass you just did by hand runs forever: a `.spec.ts` in `tests/e2e/`,
  registered in `scripts/test-fast.js` and in `test:invariants:rest`.

UAT is not a substitute for the guard, and the guard is not a substitute for UAT. The guard stops a fixed
bug coming back. UAT is what finds the one nobody has thought to guard yet — which is every bug, once.
