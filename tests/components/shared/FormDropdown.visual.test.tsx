import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FormDropdown from "@/components/shared/FormDropdown";

describe("FormDropdown — Visual / CSS", () => {
  const defaultProps = {
    label: "Color",
    value: "",
    onChange: vi.fn(),
    options: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
    ],
  };

  describe("label theming", () => {
    it("label has theme-responsive text colors", () => {
      render(<FormDropdown {...defaultProps} />);
      const label = screen.getByText("Color").closest("label")!;
      expect(label.className).toContain("text-gray-700");
      expect(label.className).toContain("dark:text-gray-300");
      expect(label.className).toContain("midnight:text-cyan-300");
      expect(label.className).toContain("purple:text-pink-300");
    });

    it("label has text-sm font-medium", () => {
      render(<FormDropdown {...defaultProps} />);
      const label = screen.getByText("Color").closest("label")!;
      expect(label.className).toContain("text-sm");
      expect(label.className).toContain("font-medium");
    });
  });

  describe("button theming", () => {
    it("dropdown button has theme backgrounds", () => {
      render(<FormDropdown {...defaultProps} />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-white");
      expect(btn.className).toContain("dark:bg-[#1a1d24]");
      expect(btn.className).toContain("midnight:bg-[#0a0e27]");
      expect(btn.className).toContain("purple:bg-[#1a0b2e]");
    });

    it("dropdown button has rounded-xl", () => {
      render(<FormDropdown {...defaultProps} />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("rounded-xl");
    });

    it("dropdown button has min-h-[46px]", () => {
      render(<FormDropdown {...defaultProps} />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("min-h-[46px]");
    });
  });

  describe("error state", () => {
    it("button has red border on error", () => {
      render(<FormDropdown {...defaultProps} error="Required" />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("border-red-500");
    });
  });

  describe("disabled state", () => {
    it("has opacity-50 cursor-not-allowed when disabled", () => {
      render(<FormDropdown {...defaultProps} disabled />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("opacity-50");
      expect(btn.className).toContain("cursor-not-allowed");
    });
  });

  describe("required indicator", () => {
    it("shows red asterisk when required", () => {
      render(<FormDropdown {...defaultProps} required />);
      const asterisk = screen.getByText("*");
      expect(asterisk.className).toContain("text-red-500");
    });
  });
});
