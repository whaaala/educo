import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BlocksPanel from "@/components/website/box/BlocksPanel";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("BlocksPanel (drag-from insert palette)", () => {
  it("lists blocks (grouped) with plain names, incl. Spacer + composite components", () => {
    render(<BlocksPanel />);
    for (const name of ["Section", "Columns", "Spacer", "Text", "Image", "Video", "Icon", "Divider", "Card", "Quote", "Stat", "Badge", "Rating"]) {
      expect(screen.getByLabelText(new RegExp(`Add ${name}`))).toBeInTheDocument();
    }
    for (const group of ["Layout", "Media", "Components"]) { // (Text group header shares its name with the Text block)
      expect(screen.getByText(group)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Text").length).toBeGreaterThanOrEqual(2); // group header + block label
  });

  it("a composite block (no variations) adds directly on click", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} />);
    fireEvent.click(screen.getByLabelText(/Add Card/));
    expect(onPick).toHaveBeenCalledWith("card"); // no style flyout for composites
  });

  it("a chip is draggable and sets the palette block type on drag start", () => {
    const setData = vi.fn();
    const onDragKind = vi.fn();
    render(<BlocksPanel onDragKind={onDragKind} />);
    const chip = screen.getByLabelText(/Add Text/);
    fireEvent.dragStart(chip, { dataTransfer: { setData, effectAllowed: "" } });
    expect(setData).toHaveBeenCalledWith("application/x-box-block", "text");
    expect(onDragKind).toHaveBeenCalledWith("text");
  });

  it("clicking a chip opens a PORTALED style-variation picker (never clipped) and adds with that variation", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} />);
    fireEvent.click(screen.getByLabelText(/Add Button/));
    expect(screen.getByText("Add Button as…")).toBeInTheDocument();     // flyout opened (in a body portal)
    expect(screen.getByRole("menu", { name: "Add Button" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitem", { name: "Outline" }));
    expect(onPick).toHaveBeenCalledWith("button", expect.objectContaining({ borderWidth: expect.any(Number) }));
  });

  it("choosing 'Default' in the picker adds the plain block", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} />);
    fireEvent.click(screen.getByLabelText(/Add Heading/));
    fireEvent.click(screen.getByRole("menuitem", { name: "Default" }));
    expect(onPick).toHaveBeenCalledWith("heading");
  });

  it("can be collapsed via the hide button", () => {
    const onCollapse = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onCollapse={onCollapse} />);
    fireEvent.click(screen.getByLabelText("Hide blocks panel"));
    expect(onCollapse).toHaveBeenCalled();
  });
});
