import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * THE CARET IS CLEARED WHERE THE SELECTION CHANGES — never from an effect that watches it.
 *
 * Two bugs, one after the other, and the second was caused by the fix for the first:
 *
 *   1. Clicking a container selects it while the click also focuses a text block inside it, so the caret is
 *      stranded in a block nobody chose. The key handler refuses to act while focus is in editable text, so
 *      EVERY canvas shortcut silently stopped working — Alt+F, Delete, Ctrl+D, Ctrl+C, the arrows.
 *   2. The first fix was a `useEffect` watching the selection that called `blur()`. Blurring changes focus,
 *      which can change the selection, which re-ran the effect. Reported from a real page:
 *      "Maximum update depth exceeded … ChromeMirror.useEffect.measure".
 *
 * WHY THIS IS A SOURCE-LEVEL GUARD, AND WHY IT IS HONEST ABOUT THAT. The loop was NOT reproducible in a
 * fixture: the effect was put back deliberately and a browser guard clicking around the page stayed clean,
 * which is the same thing the comment on `ChromeMirror` records — "the browser condition that triggers the
 * runaway has resisted every attempt to reproduce". A behavioural guard that cannot fail is worse than none,
 * so the STRUCTURE is asserted instead: an effect that both watches the selection and moves focus is the
 * shape of the bug, and the shape is checkable even when the symptom is not.
 */

// Line endings normalised at the point of READING — guarded by `source-reading-tests.test.ts`.
const SRC = readFileSync(resolve(process.cwd(), "components/website/box/BoxCanvas.tsx"), "utf8").replace(/\r\n/g, "\n");

/** Every `useEffect(...)` call in the file, with its body and its dependency list. */
function effects(src: string): { body: string; deps: string }[] {
  const out: { body: string; deps: string }[] = [];
  let i = 0;
  while ((i = src.indexOf("useEffect(", i)) !== -1) {
    let depth = 0, end = i;
    for (let j = src.indexOf("(", i); j < src.length; j++) {
      const c = src[j];
      if (c === "(") depth++;
      else if (c === ")") { depth--; if (depth === 0) { end = j + 1; break; } }
    }
    const call = src.slice(i, end);
    const lastComma = call.lastIndexOf("}, [");
    out.push(lastComma === -1 ? { body: call, deps: "" } : { body: call.slice(0, lastComma), deps: call.slice(lastComma + 3) });
    i = end;
  }
  return out;
}

describe("clearing the caret cannot re-enter itself", () => {
  it("nothing that moves focus is REACTIVE — no effect with dependencies may blur", () => {
    /**
     * The rule is deliberately wider than the bug. The first version of this guard only flagged an effect
     * whose dependency list MENTIONED the selection, and a mutation that renamed the variable to `mutP`
     * sailed straight past it — a guard defeated by a rename is a guard that will be defeated.
     *
     * Any dependency at all is enough to make the shape dangerous: the effect re-runs when something
     * changes, and moving focus is exactly the kind of side effect that changes things. An effect with an
     * EMPTY list is a one-shot on mount and cannot chain, so it is left alone.
     */
    const offenders = effects(SRC)
      .filter((e) => /\.blur\s*\(/.test(e.body))
      .filter((e) => e.deps.replace(/\s/g, "") !== "[]);" && e.deps.replace(/\s/g, "") !== "[])");
    expect(offenders.map((o) => o.deps.slice(0, 60)), "an effect that re-runs and blurs is the crash").toEqual([]);
  });

  it("the browser's own caret placement is REFUSED, not cleaned up afterwards", () => {
    /**
     * Clicking empty space inside a box means "put the caret in the nearest text" to Chrome. Clearing up
     * after it cannot win: measured, the focus came back 17ms later — on mouseup — on the original span, with
     * no `.focus()` call and no Selection call in the trace, and one version of the cleanup left the caret
     * stranded permanently instead of briefly.
     *
     * So the handler must refuse the DEFAULT ACTION on `mousedown`, which is the only event whose default
     * that is. This asserts the three parts that make that safe, because dropping any one of them brings the
     * bug back in a different disguise:
     *   • `mousedown` in CAPTURE — `pointerdown` is too early to have a default worth refusing, and bubble is
     *     too late to beat the app's own handlers to it;
     *   • `preventDefault()` — the refusal itself;
     *   • a blur of whatever held the text, because refusing the default also refuses the blur it used to do.
     */
    const effect = SRC.slice(SRC.indexOf("const KEEPS_DEFAULT"), SRC.indexOf('document.addEventListener("mousedown"'));
    expect(effect, "the caret rule is no longer wired to mousedown in capture").not.toBe("");
    expect(SRC, "mousedown must be listened for in CAPTURE").toMatch(/addEventListener\("mousedown",\s*\w+,\s*true\)/);
    expect(effect, "without preventDefault the browser puts the caret back on mouseup").toMatch(/preventDefault\s*\(\s*\)/);
    expect(effect, "refusing the default also refuses the blur it used to do — so blur by hand").toMatch(/\.blur\s*\(\s*\)/);
    expect(effect, "a click aimed INTO the focused text must keep the caret").toMatch(/\.contains\(\s*target\s*\)/);
  });

  it("…and the clearing really does happen, in emitSelection", () => {
    // The other half: removing the effect must not remove the behaviour. `keyboard-survives-selection.spec.ts`
    // proves it works in a browser; this proves it is still WIRED where it cannot loop, so a later cleanup
    // cannot quietly delete it and leave that suite passing for the wrong reason.
    const emit = SRC.slice(SRC.indexOf("const emitSelection"), SRC.indexOf("const select ="));
    expect(emit, "emitSelection no longer clears the caret").toMatch(/\.blur\s*\(/);
    expect(emit, "and it must check the block the caret is in against the one being selected").toMatch(/data-box-id/);
  });
});
