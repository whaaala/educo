import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CompactField from "@/components/shared/CompactField";
import CompactSelect from "@/components/shared/CompactSelect";
import CompactTextarea from "@/components/shared/CompactTextarea";

describe("Compact inspector atoms", () => {
  it("CompactField renders a labelled input and reports changes as strings", () => {
    const onChange = vi.fn();
    render(<CompactField label="Height" value="auto" onChange={onChange} placeholder="auto, 300px" />);
    const input = screen.getByLabelText("Height");
    expect(input).toHaveValue("auto");
    fireEvent.change(input, { target: { value: "300px" } });
    expect(onChange).toHaveBeenCalledWith("300px");
  });

  it("CompactField supports a bare (label-less) input via ariaLabel and number type", () => {
    const onChange = vi.fn();
    render(<CompactField ariaLabel="Top spacing" type="number" value={4} onChange={onChange} center />);
    fireEvent.change(screen.getByLabelText("Top spacing"), { target: { value: "8" } });
    expect(onChange).toHaveBeenCalledWith("8");
  });

  it("CompactSelect is a custom (non-native) dropdown: opens a listbox and reports the chosen value", () => {
    const onChange = vi.fn();
    render(<CompactSelect label="Boldness" value="400" onChange={onChange} options={[{ value: "400", label: "Normal" }, { value: "700", label: "Bold" }]} />);
    const trigger = screen.getByLabelText("Boldness"); // the combobox button
    expect(trigger.tagName).toBe("BUTTON");            // NOT a native <select>
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Bold" }));
    expect(onChange).toHaveBeenCalledWith("700");
  });

  it("CompactSelect renders grouped options with headers", () => {
    const onChange = vi.fn();
    render(<CompactSelect label="Design" value="" onChange={onChange} optionGroups={[{ group: "G1", items: [{ value: "", label: "Boxed" }, { value: "--panel", label: "Panel" }] }]} />);
    fireEvent.click(screen.getByLabelText("Design"));
    expect(screen.getByText("G1")).toBeInTheDocument();               // group header
    expect(screen.getByRole("option", { name: "Panel" })).toBeInTheDocument();
  });

  it("CompactTextarea reports edits", () => {
    const onChange = vi.fn();
    render(<CompactTextarea label="Custom CSS" value="" onChange={onChange} rows={3} />);
    fireEvent.change(screen.getByLabelText("Custom CSS"), { target: { value: "color: red;" } });
    expect(onChange).toHaveBeenCalledWith("color: red;");
  });
});
