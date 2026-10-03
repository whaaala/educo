import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { EditableText } from "@/components/website/sections/SectionKit";

/**
 * Behaviours: tests/features/components/website/box-builder-layout.feature —
 * "Text wraps at the same place on the canvas and on the published page".
 *
 * The editable span carried `px-1 -mx-1`: the negative margins kept its OUTER width right, but the text inside had 8px
 * less room, so near the edge of a narrow column it wrapped a line sooner than the published page — a stat measured
 * 57px on the canvas and 35px published (found by the Preview check, 2026-09-27). The hover/focus ring is a
 * box-shadow, which draws outside the box, so the span needs no padding at all.
 */
describe("EditableText gives its text exactly the room the published page does", () => {
  afterEach(cleanup);

  it("the editable span has NO horizontal padding (and no margins cancelling one)", () => {
    const { container } = render(<EditableText value="1,000+" editable onChange={() => {}} placeholder="Heading" />);
    const span = container.querySelector<HTMLElement>("[contenteditable]")!;
    expect(span).not.toBeNull();
    const cls = span.className.split(/\s+/);
    for (const c of ["px-1", "-mx-1", "px-0.5", "pl-1", "pr-1"]) expect(cls, `editable text carries "${c}"`).not.toContain(c);
    // …and still shows a ring on hover / focus — it is a box-shadow, not a padding.
    expect(span.className).toMatch(/focus:shadow-/);
  });
});

describe("Escape is the way out of the words (#87)", () => {
  afterEach(cleanup);
  it("Escape leaves the text, keeps what was typed, and does not travel on to the canvas", () => {
    const seen: string[] = []; const outer = (e: KeyboardEvent) => seen.push(e.key);
    document.addEventListener("keydown", outer);
    let v = "Hello";
    const { container } = render(<EditableText value={v} editable onChange={(x) => { v = x; }} />);
    const span = container.querySelector<HTMLElement>("[contenteditable]")!;
    span.focus(); expect(document.activeElement).toBe(span);
    span.textContent = "Hello there"; fireEvent.input(span);
    fireEvent.keyDown(span, { key: "Escape" });
    expect(document.activeElement, "the caret has left the text").not.toBe(span);
    expect(v).toBe("Hello there");
    // The canvas's own Escape steps OUT a level — it must not also fire, or one press would do both.
    expect(seen).not.toContain("Escape");
    document.removeEventListener("keydown", outer);
  });
});

describe("clicking words inside a link edits them — it never follows the link (#105)", () => {
  afterEach(cleanup);
  it("a click on editable words inside <a href> is not allowed to navigate", () => {
    const { container } = render(<a href="https://example.org/x"><EditableText value="Apply now" editable onChange={() => {}} /></a>);
    const span = container.querySelector<HTMLElement>("[contenteditable]")!;
    // fireEvent returns false when the default action was prevented — here, following the link away from the editor
    expect(fireEvent.click(span)).toBe(false);
  });
  it("on the published page (not editable) the words are plain and the link works as a link", () => {
    const { container } = render(<a href="https://example.org/x"><EditableText value="Apply now" editable={false} /></a>);
    expect(container.querySelector("[contenteditable]")).toBeNull();
  });
});

/** c-12b (decided by the user 2026-10-02): a burst of typing is ONE step — the site hears about it when typing pauses or
 *  the words are left, never once per key. Measured first: per-key commits cost 65–95 ms a key and crashed a slowed CPU
 *  with React #185. The browser half (saves, Undo, a reload mid-burst) is tests/e2e/typing-is-one-step.spec.ts. */
describe("a burst of typing is one step (c-12b)", () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });
  it("no onChange while typing; ONE, with the final words, once typing pauses", () => {
    vi.useFakeTimers(); const onChange = vi.fn();
    const { container } = render(<EditableText value="Hi" editable onChange={onChange} />);
    const span = container.querySelector<HTMLElement>("[contenteditable]")!; span.focus();
    for (const t of ["Hi t", "Hi th", "Hi the", "Hi there"]) { span.textContent = t; fireEvent.input(span); vi.advanceTimersByTime(100); }
    expect(onChange, "mid-burst").not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(onChange).toHaveBeenCalledTimes(1); expect(onChange).toHaveBeenCalledWith("Hi there");
  });
  it("leaving the words sends them at once, and only once", () => {
    vi.useFakeTimers(); const onChange = vi.fn();
    const { container } = render(<EditableText value="Hi" editable onChange={onChange} />);
    const span = container.querySelector<HTMLElement>("[contenteditable]")!; span.focus();
    span.textContent = "Hi you"; fireEvent.input(span); fireEvent.blur(span);
    expect(onChange).toHaveBeenCalledWith("Hi you");
    vi.advanceTimersByTime(1000); expect(onChange).toHaveBeenCalledTimes(1);
  });
});
