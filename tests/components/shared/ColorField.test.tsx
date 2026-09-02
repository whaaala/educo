import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorField from "@/components/shared/ColorField";

describe("ColorField", () => {
  it("renders the label and current hex value", () => {
    render(<ColorField label="Primary" value="#4f46e5" onChange={vi.fn()} />);
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByLabelText("Primary hex value")).toHaveValue("#4f46e5");
  });

  it("commits a valid hex on blur (normalised, lowercased)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Brand" value="#000000" onChange={onChange} />);
    const input = screen.getByLabelText("Brand hex value");
    await user.clear(input);
    await user.type(input, "#ABCABC");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith("#abcabc");
  });

  it("expands 3-digit shorthand", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Brand" value="#000000" onChange={onChange} />);
    const input = screen.getByLabelText("Brand hex value");
    await user.clear(input);
    await user.type(input, "#0af");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith("#00aaff");
  });

  it("reverts an invalid hex without calling onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Brand" value="#123456" onChange={onChange} />);
    const input = screen.getByLabelText("Brand hex value");
    await user.clear(input);
    await user.type(input, "nonsense");
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("#123456");
  });

  it("exposes the native colour picker with an accessible name", () => {
    render(<ColorField label="Accent" value="#7c3aed" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Accent colour picker")).toHaveAttribute("type", "color");
  });

  it("shows help text and marks required", () => {
    render(<ColorField label="Primary" value="#fff" onChange={vi.fn()} required helpText="Pick a brand colour" />);
    expect(screen.getByText("Pick a brand colour")).toBeInTheDocument();
  });
});
