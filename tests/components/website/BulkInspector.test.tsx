import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BulkInspector from "@/components/website/box/BulkInspector";
import { DEFAULT_THEME } from "@/lib/site-storage";

function setup(overrides: Partial<Parameters<typeof BulkInspector>[0]> = {}) {
  const props = {
    count: 3, theme: DEFAULT_THEME,
    onStepWidth: vi.fn(), onStepHeight: vi.fn(), onPatch: vi.fn(),
    onDuplicate: vi.fn(), onDelete: vi.fn(), onFloatAll: vi.fn(),
    ...overrides,
  };
  render(<BulkInspector {...props} />);
  return props;
}

describe("BulkInspector (multi-select bulk edits)", () => {
  it("shows how many sections are selected", () => {
    setup({ count: 4 });
    expect(screen.getByText(/4 sections selected/)).toBeInTheDocument();
  });

  it("the quick steppers grow/shrink width & height for ALL selected", () => {
    const p = setup();
    fireEvent.click(screen.getByLabelText("Increase width"));
    expect(p.onStepWidth).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByLabelText("Decrease width"));
    expect(p.onStepWidth).toHaveBeenCalledWith(-1);
    fireEvent.click(screen.getByLabelText("Increase height"));
    expect(p.onStepHeight).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByLabelText("Decrease height"));
    expect(p.onStepHeight).toHaveBeenCalledWith(-1);
  });

  it("setting spacing / rounded corners / see-through patches ALL selected (plain labels)", () => {
    const p = setup();
    fireEvent.change(screen.getByLabelText("Outer spacing"), { target: { value: "40" } });
    expect(p.onPatch).toHaveBeenCalledWith({ margin: 40 });
    fireEvent.change(screen.getByLabelText("Inner spacing"), { target: { value: "8" } });
    expect(p.onPatch).toHaveBeenCalledWith({ padding: 8 });
    fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "12" } });
    expect(p.onPatch).toHaveBeenCalledWith({ radius: 12 });
    fireEvent.change(screen.getByLabelText("See-through"), { target: { value: "50" } });
    expect(p.onPatch).toHaveBeenCalledWith({ opacity: 50 });
  });

  it("bulk actions (float / duplicate / delete) fire their callbacks", () => {
    const p = setup();
    fireEvent.click(screen.getByRole("button", { name: /Float/ }));
    expect(p.onFloatAll).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Duplicate/ }));
    expect(p.onDuplicate).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Delete/ }));
    expect(p.onDelete).toHaveBeenCalled();
  });

  it("shows a Group action that combines all selected into one unit", () => {
    const onGroup = vi.fn();
    setup({ count: 3, onGroup });
    fireEvent.click(screen.getByRole("button", { name: /Group these 3/ }));
    expect(onGroup).toHaveBeenCalled();
  });

  it("hides the Group action when no onGroup handler is provided", () => {
    setup(); // no onGroup
    expect(screen.queryByRole("button", { name: /Group these/ })).not.toBeInTheDocument();
  });
});
