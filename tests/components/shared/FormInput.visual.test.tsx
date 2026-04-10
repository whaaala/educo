import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FormInput from "@/components/shared/FormInput";

describe("FormInput — Visual / CSS", () => {
  const defaultProps = { label: "Name", value: "", onChange: vi.fn() };

  describe("label theming", () => {
    it("label has theme-responsive text colors", () => {
      render(<FormInput {...defaultProps} />);
      const label = screen.getByText("Name").closest("label")!;
      expect(label.className).toContain("text-gray-700");
      expect(label.className).toContain("dark:text-gray-300");
      expect(label.className).toContain("midnight:text-cyan-300");
      expect(label.className).toContain("purple:text-pink-300");
    });

    it("label has text-sm font-medium", () => {
      render(<FormInput {...defaultProps} />);
      const label = screen.getByText("Name").closest("label")!;
      expect(label.className).toContain("text-sm");
      expect(label.className).toContain("font-medium");
    });

    it("required asterisk has red color", () => {
      render(<FormInput {...defaultProps} required />);
      const asterisk = screen.getByText("*");
      expect(asterisk.className).toContain("text-red-500");
      expect(asterisk.className).toContain("dark:text-red-400");
    });
  });

  describe("input theming", () => {
    it("input has theme-responsive backgrounds", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("bg-white");
      expect(input.className).toContain("dark:bg-[#1a1d24]");
      expect(input.className).toContain("midnight:bg-[#0a0e27]");
      expect(input.className).toContain("purple:bg-[#1a0b2e]");
    });

    it("input has theme-responsive text colors", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("text-gray-900");
      expect(input.className).toContain("dark:text-white");
      expect(input.className).toContain("midnight:text-cyan-50");
      expect(input.className).toContain("purple:text-pink-50");
    });

    it("input has rounded-xl border", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("rounded-xl");
      expect(input.className).toContain("border");
    });

    it("input has h-[46px] fixed height", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("h-[46px]");
    });
  });

  describe("error state", () => {
    it("input has red border on error", () => {
      const { container } = render(<FormInput {...defaultProps} error="Required" />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("border-red-500");
    });

    it("input has normal border without error", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("border-gray-300");
    });
  });

  describe("disabled state", () => {
    it("has opacity-50 when disabled", () => {
      const { container } = render(<FormInput {...defaultProps} disabled />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain("opacity-50");
      expect(input.className).toContain("cursor-not-allowed");
    });
  });

  describe("icon background theming", () => {
    it("icon bg has theme colors", () => {
      const { container } = render(<FormInput {...defaultProps} />);
      const iconBg = container.querySelector(".opacity-70");
      expect(iconBg).toBeInTheDocument();
    });
  });
});
