import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import ItemCrudLayer, { keepPlacementIfUnmoved, type Placement } from "@/components/website/box/ItemCrudLayer";

/**
 * The item toolbar must only ever offer actions that can actually act on the selected item — the project's
 * "no placeholder UI" rule. A single-item component (the common case for an Alert) therefore shows just add,
 * duplicate and close: reorder arrows would be no-ops and the bin is guarded so a component is never emptied.
 */
function renderLayer(opts: { count: number; index: number }) {
  const host = document.createElement("div");
  host.innerHTML = `<div data-eu-item="x">item</div>`;
  document.body.appendChild(host);
  const ref = createRef<HTMLElement>();
  (ref as { current: HTMLElement | null }).current = host;
  const handlers = {
    onAdd: vi.fn(), onDuplicate: vi.fn(), onDelete: vi.fn(),
    onMoveUp: vi.fn(), onMoveDown: vi.fn(), onDismiss: vi.fn(),
  };
  render(<ItemCrudLayer containerRef={ref} selected={{ id: "x" }} {...opts} {...handlers} />);
  return handlers;
}

const labels = () =>
  [...document.querySelectorAll('[role="toolbar"][aria-label="Edit this item"] button, [role="toolbar"] [role="button"]')]
    .map((b) => b.getAttribute("aria-label"));

/**
 * The placement effect runs after EVERY render by design (an item's size can change with no prop changing), so it
 * is only safe while `setPlace` keeps the SAME object when nothing moved. Drop that identity check and every render
 * schedules another — React's "Maximum update depth exceeded", a frozen editor. The source records that it looped
 * once already; nothing asserted it could not again until the build's lint warning was triaged (2026-09-26).
 */
describe("The toolbar's measuring effect cannot loop", () => {
  beforeEach(() => { cleanup(); document.body.innerHTML = ""; });

  const at = (top: number): Placement => ({ top, left: 10, width: 100, height: 40, barTop: top, barLeft: 120, side: "right" });

  it("nothing moved → the SAME object comes back, so React skips the re-render", () => {
    const prev = at(20);
    expect(keepPlacementIfUnmoved(prev, at(20))).toBe(prev);
    expect(keepPlacementIfUnmoved(prev, at(20.4))).toBe(prev);   // under half a pixel is not a move
  });

  it("something moved → the new placement is used", () => {
    const next = at(21);
    expect(keepPlacementIfUnmoved(at(20), next)).toBe(next);
    expect(keepPlacementIfUnmoved(null, next)).toBe(next);
    expect(keepPlacementIfUnmoved(at(20), null)).toBeNull();
  });

  it("rendering and re-rendering never runs away", () => {
    const errors: string[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a: unknown[]) => { errors.push(a.map(String).join(" ")); });
    try {
      const host = document.createElement("div");
      host.innerHTML = `<div data-eu-item="x">item</div>`;
      document.body.appendChild(host);
      const ref = createRef<HTMLElement>();
      (ref as { current: HTMLElement | null }).current = host;
      const props = { containerRef: ref, selected: { id: "x" }, count: 2, index: 0, onAdd: vi.fn(), onDuplicate: vi.fn(), onDelete: vi.fn(), onMoveUp: vi.fn(), onMoveDown: vi.fn(), onDismiss: vi.fn() };
      const { rerender } = render(<ItemCrudLayer {...props} />);
      for (let i = 0; i < 5; i++) rerender(<ItemCrudLayer {...props} index={i % 2} />);
    } finally { spy.mockRestore(); }
    expect(errors.filter((e) => /Maximum update depth/i.test(e))).toEqual([]);
  });
});

describe("The item toolbar offers only what can act", () => {
  beforeEach(() => { cleanup(); document.body.innerHTML = ""; });

  it("a lone item gets add + duplicate — no dead reorder arrows, no disabled bin", () => {
    renderLayer({ count: 1, index: 0 });
    const l = labels();
    expect(l).toContain("Add an item below this one");
    expect(l).toContain("Duplicate this item");
    expect(l).toContain("Close this item toolbar");
    expect(l).not.toContain("Move item up");
    expect(l).not.toContain("Move item down");
    expect(l).not.toContain("Delete this item"); // a component is never emptied of items
  });

  it("the FIRST of several can move down but not up, and can be deleted", () => {
    renderLayer({ count: 3, index: 0 });
    const l = labels();
    expect(l).not.toContain("Move item up");
    expect(l).toContain("Move item down");
    expect(l).toContain("Delete this item");
  });

  it("a MIDDLE item can move both ways", () => {
    renderLayer({ count: 3, index: 1 });
    expect(labels()).toEqual(expect.arrayContaining(["Move item up", "Move item down"]));
  });

  it("the LAST of several can move up but not down", () => {
    renderLayer({ count: 3, index: 2 });
    const l = labels();
    expect(l).toContain("Move item up");
    expect(l).not.toContain("Move item down");
  });

  it("every button it does show is wired to its action", () => {
    const h = renderLayer({ count: 3, index: 1 });
    for (const [label, fn] of [
      ["Move item up", h.onMoveUp], ["Move item down", h.onMoveDown],
      ["Add an item below this one", h.onAdd], ["Duplicate this item", h.onDuplicate],
      ["Delete this item", h.onDelete], ["Close this item toolbar", h.onDismiss],
    ] as const) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(fn, `${label} is wired`).toHaveBeenCalled();
    }
  });

  it("the toolbar can always be moved out of the way and closed", () => {
    renderLayer({ count: 1, index: 0 });
    expect(labels()).toContain("Move this toolbar");   // drag handle (arrow keys nudge it — RULE C)
    expect(labels()).toContain("Close this item toolbar");
  });
});
