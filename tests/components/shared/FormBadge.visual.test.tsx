import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FormBadge from "@/components/shared/FormBadge";

describe("FormBadge — Visual / CSS", () => {
  describe("label theming", () => {
    it("label has theme text colors", () => {
      render(<FormBadge label="Status" icon={<span>!</span>} value="" />);
      const label = screen.getByText("Status");
      const labelContainer = label.closest("label")!;
      expect(labelContainer.className).toContain("text-gray-700");
      expect(labelContainer.className).toContain("dark:text-gray-300");
      expect(labelContainer.className).toContain("midnight:text-cyan-300");
      expect(labelContainer.className).toContain("purple:text-pink-300");
    });

    it("label is text-sm font-medium", () => {
      render(<FormBadge label="Status" icon={<span>!</span>} value="" />);
      const label = screen.getByText("Status").closest("label")!;
      expect(label.className).toContain("text-sm");
      expect(label.className).toContain("font-medium");
    });
  });

  describe("container theming", () => {
    it("badge container has theme backgrounds", () => {
      const { container } = render(
        <FormBadge label="Status" icon={<span>!</span>} value="" />
      );
      const badgeContainer = container.querySelector(".h-\\[46px\\]");
      expect(badgeContainer).toBeInTheDocument();
      expect(badgeContainer!.className).toContain("bg-white");
      expect(badgeContainer!.className).toContain("dark:bg-[#1a1d24]");
      expect(badgeContainer!.className).toContain("midnight:bg-[#0a0e27]");
      expect(badgeContainer!.className).toContain("purple:bg-[#1a0b2e]");
    });

    it("badge container has rounded-xl border", () => {
      const { container } = render(
        <FormBadge label="Status" icon={<span>!</span>} value="" />
      );
      const badgeContainer = container.querySelector(".rounded-xl");
      expect(badgeContainer).toBeInTheDocument();
    });
  });

  describe("placeholder state", () => {
    it("shows placeholder with italic style when no value", () => {
      render(<FormBadge label="Status" icon={<span>!</span>} value="" placeholder="Not set" />);
      const placeholder = screen.getByText("Not set");
      expect(placeholder.className).toContain("italic");
      expect(placeholder.className).toContain("text-gray-400/70");
    });
  });

  describe("error state", () => {
    it("has red border on error", () => {
      const { container } = render(
        <FormBadge label="Status" icon={<span>!</span>} value="" error="Required" />
      );
      const badgeContainer = container.querySelector(".border-red-500");
      expect(badgeContainer).toBeInTheDocument();
    });
  });
});
