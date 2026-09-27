import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
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
