import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FormTextarea from "@/components/shared/FormTextarea";

describe("FormTextarea — Visual / CSS", () => {
  const defaultProps = { label: "Description", value: "", onChange: vi.fn() };

  describe("label theming", () => {
    it("label has theme-responsive text colors", () => {
      render(<FormTextarea {...defaultProps} />);
      const label = screen.getByText("Description").closest("label")!;
      expect(label.className).toContain("text-gray-700");
      expect(label.className).toContain("dark:text-gray-300");
      expect(label.className).toContain("midnight:text-cyan-300");
      expect(label.className).toContain("purple:text-pink-300");
    });

    it("label has text-sm font-medium", () => {
      render(<FormTextarea {...defaultProps} />);
      const label = screen.getByText("Description").closest("label")!;
      expect(label.className).toContain("text-sm");
      expect(label.className).toContain("font-medium");
    });
  });

  describe("textarea container theming", () => {
    it("container has theme backgrounds", () => {
      const { container } = render(<FormTextarea {...defaultProps} />);
      const wrapper = container.querySelector(".rounded-xl.border");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper!.className).toContain("bg-surface");
    });

    it("container has rounded-xl border", () => {
      const { container } = render(<FormTextarea {...defaultProps} />);
      const wrapper = container.querySelector(".rounded-xl.border");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("textarea element", () => {
    it("textarea has transparent background", () => {
      const { container } = render(<FormTextarea {...defaultProps} />);
      const textarea = container.querySelector("textarea")!;
      expect(textarea.className).toContain("bg-transparent");
    });

    it("textarea has theme text colors", () => {
      const { container } = render(<FormTextarea {...defaultProps} />);
      const textarea = container.querySelector("textarea")!;
      expect(textarea.className).toContain("text-ink");
    });
  });

  describe("error state", () => {
    it("container has red border on error", () => {
      const { container } = render(<FormTextarea {...defaultProps} error="Too short" />);
      const wrapper = container.querySelector(".border-red-500");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("optional indicator", () => {
    it("shows optional label text", () => {
      render(<FormTextarea {...defaultProps} optional />);
      const optional = screen.getByText("(Optional)");
      expect(optional.className).toContain("text-xs");
      expect(optional.className).toContain("text-gray-400");
    });
  });
});
