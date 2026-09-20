import { describe, it, expect } from "vitest";
import { shouldTakeMirrorBox, type MirrorBox, type MirrorChase } from "@/lib/box-model";

/**
 * THE SELECTION CHROME'S MEASURE LOOP IS BOUNDED — WITHOUT LOSING THE BLOCK.
 *
 * The editor mirrors a selected block's rectangle so its toolbar and handles sit on it, and it re-measures
 * after every render, because a block's geometry changes without any prop changing (a longer heading, a
 * reflow, a drag in progress). That is a cycle: measure → setState → render → measure.
 *
 * "Maximum update depth exceeded" came out of that cycle, was reported, was fixed, and came back — so the
 * chase was given a budget, and these rules are that budget. THE PURE RULE IS THE ONLY HONEST GUARD
 * AVAILABLE FOR THAT HALF: the browser condition has resisted every attempt to reproduce, including a
 * resize driven at 120 events/sec with deliberate sub-pixel jitter, which this project's own notes say is
 * the way to provoke what Playwright's rate-limited mouse cannot.
 *
 * ── THE COST OF GETTING THE BUDGET WRONG, WHICH THIS FILE NOW ALSO MEASURES ─────────────────────────
 *
 * A bound that cannot tell a runaway from a user is not a bound, it is a bug. The first version compared
 * each measurement against the rectangle the chrome was DISPLAYING, and it broke resizing outright: the
 * handles stopped following after about 130ms of dragging and never came back, stranded hundreds of pixels
 * from the block. Reported from a live session with a screenshot.
 *
 * Two faults, and BOTH are driven here as the real loop runs them:
 *   · a drag commits a tree per frame, so it produces exactly ONE quiet frame per move — and the rule
 *     demanded two before it would restore the budget, so a drag never restored it at all;
 *   · once abandoned, the displayed rectangle is stale by definition and can never match a block that is
 *     still moving, so no settle was detectable and the freeze was permanent.
 *
 * The lesson that outlives the bug: the old "keeps genuinely moving is followed indefinitely" test passed
 * the whole time, because it hand-fed TWO quiet frames per move that the real loop never produces. A guard
 * that models the wrong loop cannot fail. Every drag test below is driven through `runLoop`, which models
 * the commit → measure → setState → measure shape the component actually has.
 */

const box = (over: Partial<MirrorBox> = {}): MirrorBox => ({ left: 0, top: 0, width: 100, height: 50, ...over });
const MAX = 8;
const fresh = (): MirrorChase => ({ churn: 0, seen: null });

/**
 * The component's loop, as a driver: feed it the stream of measurements the browser would return, and it
 * reports what the chrome ended up displaying and how many updates that cost.
 *
 * `quietAfterTake` is the shape of the real thing: taking a measurement calls setState, which renders,
 * which measures again — and that second measurement is the layout holding still. A drag gets exactly one
 * of those per move; a layout arguing with itself gets none, because it has changed again by then.
 */
function runLoop(stream: MirrorBox[], opts: { quietAfterTake?: boolean } = {}) {
  let state = fresh();
  let shown: MirrorBox | null = null;
  let takes = 0;
  for (const next of stream) {
    const v = shouldTakeMirrorBox(shown, next, state, MAX);
    state = v.state;
    if (!v.take) continue;
    shown = next;
    takes++;
    if (opts.quietAfterTake) {
      // setState → render → measure again. Nothing else has happened, so the browser returns the same rect.
      const echo = shouldTakeMirrorBox(shown, next, state, MAX);
      state = echo.state;
    }
  }
  return { shown, takes, state };
}

describe("shouldTakeMirrorBox", () => {
  it("takes the first measurement, when there is nothing to compare against", () => {
    const v = shouldTakeMirrorBox(null, box(), fresh(), MAX);
    expect(v.take, "a selected block must get its chrome immediately").toBe(true);
    expect(v.state.churn).toBe(1);
  });

  it("ignores a measurement within half a pixel of what is already drawn", () => {
    const v = shouldTakeMirrorBox(box(), box({ top: 0.3, width: 100.4 }), { churn: 5, seen: box() }, MAX);
    expect(v.take, "sub-pixel noise is not movement").toBe(false);
  });

  it("takes a real move, and spends one from the budget", () => {
    const v = shouldTakeMirrorBox(box(), box({ top: 40 }), { churn: 3, seen: box() }, MAX);
    expect(v.take).toBe(true);
    expect(v.state.churn).toBe(4);
  });

  it("restores the budget on ONE quiet frame — the shape a real drag produces", () => {
    // The layout gave the same answer twice running. That is a settle, and it is all a drag ever offers:
    // demanding two meant the budget was never given back during a resize, and the handles stopped dead.
    const v = shouldTakeMirrorBox(box(), box(), { churn: 5, seen: box() }, MAX);
    expect(v.state.churn, "the layout held still, so the chase starts over").toBe(0);
  });

  it("STOPS once the budget is gone on a layout that keeps changing", () => {
    const v = shouldTakeMirrorBox(box(), box({ top: 40 }), { churn: MAX, seen: box({ top: 20 }) }, MAX);
    expect(v.take, "an unsettled layout is abandoned rather than chased forever").toBe(false);
    expect(v.state.churn, "and it stays abandoned while it keeps changing").toBe(MAX);
    expect(v.state.seen, "but the layout is still WATCHED — this is the way back").toEqual(box({ top: 40 }));
  });

  it("COMES BACK the moment an abandoned layout holds still", () => {
    /**
     * The half of the bug that stranded the handles for good. With the chase abandoned and the chrome
     * showing a stale rectangle, the layout settles on a new one: the mirror must land on it.
     *
     * The old rule could not, and could never: it asked whether the measurement matched what it was
     * DISPLAYING, which after an abandonment is precisely the rectangle the block has left behind.
     */
    const stale = box({ width: 940 });
    const now = box({ width: 388 });
    const seenOnce = shouldTakeMirrorBox(stale, now, { churn: MAX, seen: box({ width: 500 }) }, MAX);
    expect(seenOnce.take, "first sight of it: still moving as far as anyone knows").toBe(false);
    const again = shouldTakeMirrorBox(stale, now, seenOnce.state, MAX);
    expect(again.take, "same answer twice — the layout has settled, so the chrome catches up").toBe(true);
    expect(again.state.churn, "and the budget is whole again").toBe(0);
  });

  it("follows a 300-frame drag to the end — every move, no cap", () => {
    // THE REGRESSION, at full length. Driven through the real loop shape rather than hand-fed quiet frames:
    // one commit per mousemove, and the single echo measurement that setState causes.
    const stream = Array.from({ length: 300 }, (_, i) => box({ width: 900 - i * 2 }));
    const { shown, takes } = runLoop(stream, { quietAfterTake: true });
    expect(takes, "every genuine move was followed").toBe(300);
    expect(shown, "and the chrome ended on the block, not 500px behind it").toEqual(box({ width: 302 }));
  });

  it("an ALTERNATING oscillation terminates — the case that defeated the one-frame rule's first draft", () => {
    /**
     * A layout arguing with itself: the answer flips between two values and NEVER repeats. There is no
     * echo frame, because by the time the mirror re-measures the value has changed again — which is
     * exactly what tells it apart from a drag.
     */
    const stream = Array.from({ length: 1000 }, (_, i) => box({ height: i % 2 ? 50 : 62 }));
    const { takes } = runLoop(stream);
    expect(takes, "a thousand unsettled frames cost at most the budget").toBeLessThanOrEqual(MAX);
  });

  it("a DRIFTING layout terminates too — a fresh value every frame, never the same one twice", () => {
    // The nastier shape: no repeats at all, so nothing can ever read as a settle. It must still stop.
    const stream = Array.from({ length: 1000 }, (_, i) => box({ height: 50 + i * 0.6 }));
    const { takes } = runLoop(stream);
    expect(takes, "bounded by the budget however inventive the disagreement").toBeLessThanOrEqual(MAX);
  });

  it("…and picks the block back up when the drift finally stops", () => {
    // The two halves together, in one stream: runaway, abandonment, then a layout that settles and is
    // followed again. This is what makes the bound cosmetic rather than a trap.
    const drift = Array.from({ length: 40 }, (_, i) => box({ height: 50 + i * 0.6 }));
    const rest = Array.from({ length: 4 }, () => box({ height: 120 }));
    const { shown, takes } = runLoop([...drift, ...rest]);
    expect(takes, "the runaway was cut short").toBeLessThanOrEqual(MAX + 1);
    expect(shown, "and the chrome is on the block once it holds still").toEqual(box({ height: 120 }));
  });
});
