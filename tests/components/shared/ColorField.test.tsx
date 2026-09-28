import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("shows a WCAG contrast badge when contrastBg is given", () => {
    render(<ColorField label="Text" value="#0f172a" onChange={vi.fn()} contrastBg="#ffffff" />);
    expect(screen.getByText(/:1$/)).toBeInTheDocument(); // ratio like 17.85:1
    expect(screen.getByText("AAA")).toBeInTheDocument(); // dark on white passes AAA
    expect(screen.queryByText("Fix contrast")).not.toBeInTheDocument(); // passing → no fix
  });

  it("offers a one-click accessible fix when contrast fails", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Muted" value="#9ca3af" onChange={onChange} contrastBg="#ffffff" />); // grey on white fails
    expect(screen.getByText("Fail")).toBeInTheDocument();
    const fix = screen.getByRole("button", { name: /Fix/i });
    await user.click(fix);
    expect(onChange).toHaveBeenCalledTimes(1);
    // the fixed colour must actually clear AA against white
    const fixed = onChange.mock.calls[0][0] as string;
    const { contrastRatio } = await import("@/lib/educo-ui/color");
    expect(contrastRatio(fixed, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("ColorField — a colour belongs to what it was typed for (#89)", () => {
  it("after Enter, a later blur commits nothing to whatever the field shows next", () => {
    const first = vi.fn(), next = vi.fn();
    const { rerender } = render(<ColorField label="Brand" value="#000000" onChange={first} />);
    const hex = screen.getByLabelText("Brand hex value");
    fireEvent.change(hex, { target: { value: "#1e3a8a" } }); fireEvent.keyDown(hex, { key: "Enter" });
    expect(first).toHaveBeenCalledWith("#1e3a8a");
    rerender(<ColorField label="Brand" value="#000000" onChange={next} />); fireEvent.blur(hex);
    expect(next).not.toHaveBeenCalled();
  });
  it("typed, not committed, then the field shows something else: it goes where it was typed", () => {
    const first = vi.fn(), next = vi.fn();
    const { rerender } = render(<ColorField label="Brand" value="#000000" onChange={first} />);
    const hex = screen.getByLabelText("Brand hex value");
    fireEvent.change(hex, { target: { value: "#1e3a8a" } });
    rerender(<ColorField label="Brand" value="#000000" onChange={next} />); fireEvent.blur(hex);
    expect(next).not.toHaveBeenCalled(); expect(first).toHaveBeenCalledWith("#1e3a8a");
  });
});
