import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import ItemCrudLayer from "@/components/website/box/ItemCrudLayer";

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
