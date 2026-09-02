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
