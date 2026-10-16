import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ActionMenuDropdown from "@/components/shared/ActionMenuDropdown";

/** A2-16 — the shared menu works by keyboard and for a screen reader, and opens over a bar along the bottom. */
const items = [{ id: "a", label: "Alpha", onClick: vi.fn() }, { id: "b", label: "Beta" }, { id: "c", label: "Gamma" }];
const open = (placement?: "below" | "above") => {
  render(<ActionMenuDropdown ariaLabel="More places" placement={placement} trigger={<button type="button">More</button>} items={items} />);
  act(() => { fireEvent.click(screen.getByRole("button", { name: "More" })); });
};

describe("ActionMenuDropdown (A2-16)", () => {
  it("is a named menu of menuitems, and opening puts focus on the first", () => {
    open();
    expect(screen.getByRole("menu", { name: "More places" })).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem").map((m) => m.textContent)).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Alpha" }));
  });
  it("the arrows walk the items and wrap; Home and End jump", () => {
    open(); const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" }); expect(document.activeElement?.textContent).toBe("Beta");
    fireEvent.keyDown(menu, { key: "ArrowUp" }); fireEvent.keyDown(menu, { key: "ArrowUp" }); expect(document.activeElement?.textContent).toBe("Gamma");
    fireEvent.keyDown(menu, { key: "Home" }); expect(document.activeElement?.textContent).toBe("Alpha");
    fireEvent.keyDown(menu, { key: "End" }); expect(document.activeElement?.textContent).toBe("Gamma");
  });
  it("Escape puts it away and gives focus back to the trigger", () => {
    open(); act(() => { fireEvent.keyDown(document, { key: "Escape" }); });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "More" }));
  });
  it("a press outside puts it away; an item runs and closes", () => {
    open(); act(() => { fireEvent.mouseDown(document.body); }); expect(screen.queryByRole("menu")).toBeNull();
    act(() => { fireEvent.click(screen.getByRole("button", { name: "More" })); });
    fireEvent.click(screen.getByRole("menuitem", { name: "Alpha" })); expect(items[0].onClick).toHaveBeenCalled(); expect(screen.queryByRole("menu")).toBeNull();
  });
  it("placement above opens over the trigger (a menu from a bar along the bottom)", () => {
    open("above"); expect(screen.getByRole("menu").className).toMatch(/bottom-full/);
  });
});
