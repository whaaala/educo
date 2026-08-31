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

  it("setting margin / padding / radius / opacity patches ALL selected", () => {
    const p = setup();
    fireEvent.change(screen.getByLabelText("Margin all sides"), { target: { value: "40" } });
    expect(p.onPatch).toHaveBeenCalledWith({ margin: 40 });
    fireEvent.change(screen.getByLabelText("Padding all sides"), { target: { value: "8" } });
    expect(p.onPatch).toHaveBeenCalledWith({ padding: 8 });
    fireEvent.change(screen.getByLabelText("Corner radius"), { target: { value: "12" } });
    expect(p.onPatch).toHaveBeenCalledWith({ radius: 12 });
    fireEvent.change(screen.getByLabelText("Opacity"), { target: { value: "50" } });
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
});
