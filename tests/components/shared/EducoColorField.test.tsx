import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EducoColorField from "@/components/shared/EducoColorField";

describe("EducoColorField — OKLCH palette colour control", () => {
  it("shows the current hex and commits a typed value", () => {
    const onChange = vi.fn();
    render(<EducoColorField label="Brand" value="#4f46e5" onChange={onChange} />);
    const hex = screen.getByLabelText("Brand hex value");
    expect(hex).toHaveValue("#4f46e5");
    fireEvent.change(hex, { target: { value: "#ff0088" } });
    fireEvent.blur(hex);
    expect(onChange).toHaveBeenCalledWith("#ff0088");
  });

  it("opens the palette popover and picks an OKLCH spectrum swatch", () => {
    const onChange = vi.fn();
    render(<EducoColorField label="Accent" value="#000000" onChange={onChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accent palette" }));
    const dialog = screen.getByRole("dialog", { name: "Accent palette" });
    expect(dialog).toBeInTheDocument();
    // a spectrum swatch (title "<Hue> <shade> · <hex>") applies its hex
    const swatch = screen.getAllByTitle(/Blue 500 ·/i)[0];
    fireEvent.click(swatch);
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/));
  });

  it("offers a 'None (transparent)' choice only when onClear is given", () => {
    const onChange = vi.fn(); const onClear = vi.fn();
    const { rerender } = render(<EducoColorField label="Background" value="#eef2ff" onChange={onChange} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: "Background swatch" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear Background — no colour" }));
    expect(onClear).toHaveBeenCalled();

    rerender(<EducoColorField label="Brand" value="#000000" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Brand swatch" }));
    expect(screen.queryByRole("button", { name: /no colour/i })).not.toBeInTheDocument();
  });

  it("surfaces a WCAG ratio + fix when contrastBg is given and contrast is low", () => {
    const onChange = vi.fn();
    render(<EducoColorField label="Text" value="#eeeeee" onChange={onChange} contrastBg="#ffffff" />);
    expect(screen.getByText(/WCAG/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Fix contrast/i }));
    expect(onChange).toHaveBeenCalled();
  });
});

describe("a colour belongs to the block it was typed for (#89)", () => {
  // Measured through the UI: a colour typed for a stack (Enter), then a click on a heading — the heading was painted too.
  // The click moves the selection first, the Inspector re-renders for the heading, and only THEN does the hex box
  // lose focus: its blur committed the stack's colour through the heading's onChange.
  it("after Enter, a later blur commits nothing — not even to the next block the field is showing", () => {
    const forStack = vi.fn(), forHeading = vi.fn();
    const { rerender } = render(<EducoColorField ariaLabel="Background colour" value="" onChange={forStack} />);
    const hex = screen.getByLabelText("Background colour hex value");
    fireEvent.change(hex, { target: { value: "#1e3a8a" } });
    fireEvent.keyDown(hex, { key: "Enter" });
    expect(forStack).toHaveBeenCalledWith("#1e3a8a");
    rerender(<EducoColorField ariaLabel="Background colour" value="" onChange={forHeading} />); // the heading is selected now
    fireEvent.blur(hex);
    expect(forHeading).not.toHaveBeenCalled();
  });
  it("typed but not yet committed, then another block selected: it goes to the block it was typed FOR", () => {
    const forStack = vi.fn(), forHeading = vi.fn();
    const { rerender } = render(<EducoColorField ariaLabel="Background colour" value="" onChange={forStack} />);
    const hex = screen.getByLabelText("Background colour hex value");
    fireEvent.change(hex, { target: { value: "#1e3a8a" } });
    rerender(<EducoColorField ariaLabel="Background colour" value="" onChange={forHeading} />);
    fireEvent.blur(hex);
    expect(forHeading).not.toHaveBeenCalled();
    expect(forStack).toHaveBeenCalledWith("#1e3a8a");
  });
});
