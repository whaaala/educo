# Fix what you find — and the ledger that makes it stick

> **The rule:** a bug you find is a bug you FIX, in the same change, with a mutation-proven guard.
> No severity threshold. No "pre-existing". No "out of scope". No "noted for later".
> It includes **bugs in tests** — a guard that cannot fail reports safety that does not exist.

This is one of the project's oldest rules and it is broken the same way every time: not by deciding
to skip a fix, but by *narrating* one. "I'll note that rather than change it now." "Worth making
robust." "Standing gap." The bug is then real, known, written down — and shipped.

## Why the rule exists

A bug you found is the cheapest bug you will ever fix. You have the repro in front of you, the file
open, and the reason in your head. Every one of those three decays within the hour and is gone by
the next session. The next person meets it as a mystery, from a user, on a live school website.

And a *known* bug carried forward is worse than an unknown one: it has been seen, judged survivable,
and written into a document that makes it look managed. Outstanding is for **unbuilt features**,
never for defects.

## The mechanism: a bug ledger

Discipline failed here twice in one day, so the rule is not left to discipline.

**The moment you find a bug, write it down in the session's reply as a numbered ledger line** —
before you decide anything about it. Not in a memory file, not in a commit message: in the visible
working notes, where it cannot be forgotten and the user can see it too.

```
BUG LEDGER
  1. Replace pill renders on every image, not just the selected one   → OPEN
  2. Dropping photos from the desktop does nothing (drop handler)     → OPEN
  3. alert-actions.spec.ts flakes under --workers=4                   → OPEN
```

**Before saying a change is done, every line must read FIXED** — each with a guard, each
mutation-proven. A line that genuinely is not a defect is closed as `NOT A BUG` with the
measurement that shows it (see the selection-height case below). A line you are *choosing* not to
fix is not a decision you get to make on your own: say so to the user explicitly, in the reply, and
let them decide.

## What counts as a bug

- Wrong behaviour, obviously.
- **Canvas ≠ export**, in either direction. The editor lying to the user is the worse one.
- **A control that does nothing**, or does something the panel does not say.
- **A guard that cannot fail.** If mutating the fix leaves the test green, the test is the bug.
- **A flaky test.** It trains everyone to re-run instead of read, which is how a real failure gets
  waved through.
- **Dead or unreachable code and UI** — it is a promise the product cannot keep.
- **Something you noticed in a screenshot.** Looking at the result is a test; what it finds is a
  finding.

## The three cases that produced this document (2026-09-12)

**1 · "I'll note it rather than change it now."** The Replace pill rendered on *every* image in the
builder, so a twelve-photograph gallery arrived with twelve dark pills sitting on top of the
photographs — the thing being designed covered by the tool for changing it. It was spotted in a
screenshot, described in the reply, and left. Cost to fix once found: one conditional.

**2 · Named to the user, then dropped.** Dragging photographs from the desktop onto the canvas did
nothing at all, silently — the drop handler returned early unless the drag carried a palette tile,
and `dragover` never called `preventDefault()` so no drop event ever fired. This was explicitly
reported to the user as one of the two reasons galleries were painful, and then not fixed in the
change that fixed the other one.

**3 · Written into memory as future work.** A flaky spec was recorded as "worth making robust". That
is the exact shape the rule forbids: a defect, seen and catalogued, shipped.

## And the other direction: do not "fix" what is not broken

The same day, a report that *"the selected area isn't the exact height of the box"* was investigated
and **measured to be correct** in every configuration — grid, cell, masonry on and off, gap 0 and 16.
What the user was seeing was an Even grid row being as tall as its tallest cell, which is what an
even grid is. Closing a ledger line as NOT A BUG requires the measurement, not an opinion — but it is
a legitimate close, and inventing a change to look responsive would have been its own defect.

Related: `MEMORY.md` → *Fix What You Find (RULE V)*, *Clean Code Always (RULE W)*,
*Exhaustive Testing*.
