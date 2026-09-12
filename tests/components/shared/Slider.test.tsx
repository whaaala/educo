import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Slider from "@/components/shared/Slider";

describe("Slider", () => {
  it("renders the label and formatted value with a unit", () => {
    render(<Slider label="Corner radius" value={16} onChange={vi.fn()} unit="px" />);
    expect(screen.getByText("Corner radius")).toBeInTheDocument();
    expect(screen.getByText("16px")).toBeInTheDocument();
  });

  it("calls onChange with a number when moved", () => {
    const onChange = vi.fn();
    render(<Slider label="Opacity" value={50} onChange={onChange} min={0} max={100} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it("honours min/max/step attributes", () => {
    render(<Slider label="Size" value={4} onChange={vi.fn()} min={1} max={9} step={2} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "9");
    expect(slider).toHaveAttribute("step", "2");
  });

  it("supports a custom value formatter (overrides unit)", () => {
    render(<Slider label="Scale" value={2} onChange={vi.fn()} unit="px" formatValue={(v) => `×${v}`} />);
    expect(screen.getByText("×2")).toBeInTheDocument();
  });

  it("can hide the value readout", () => {
    render(<Slider label="Quiet" value={5} onChange={vi.fn()} showValue={false} unit="px" />);
    expect(screen.queryByText("5px")).not.toBeInTheDocument();
  });

  it("does not fire onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Off" value={5} onChange={onChange} disabled />);
    await user.click(screen.getByRole("slider"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
