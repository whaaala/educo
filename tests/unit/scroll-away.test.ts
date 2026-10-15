import { describe, it, expect, vi } from "vitest";
import { closeOnScrollAway } from "@/lib/scroll-away";

/** A1-5: a popover closes on a scroll that MOVES its button, never on the one that brought it into view. */
describe("closeOnScrollAway", () => {
  const setup = () => {
    let top = 400;
    const anchor = document.createElement("button");
    anchor.getBoundingClientRect = () => ({ top } as DOMRect);
    const pop = document.createElement("div"); const inner = document.createElement("span"); pop.appendChild(inner);
    const close = vi.fn();
    const onScroll = closeOnScrollAway(() => anchor, () => pop, close);
    return { onScroll, close, inner, move: (t: number) => { top = t; } };
  };

  it("ignores the scroll that arrives after opening, while the button has not moved", () => {
    const { onScroll, close } = setup();
    onScroll({ target: document } as unknown as Event);
    expect(close).not.toHaveBeenCalled();
  });
  it("closes once a scroll has moved the button", () => {
    const { onScroll, close, move } = setup();
    move(250);
    onScroll({ target: document } as unknown as Event);
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("never closes for a scroll inside the popover itself", () => {
    const { onScroll, close, inner, move } = setup();
    move(250);
    onScroll({ target: inner } as unknown as Event);
    expect(close).not.toHaveBeenCalled();
  });
});
