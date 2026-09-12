import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import SearchBar from "@/components/shared/SearchBar";

describe("SearchBar — Visual / CSS", () => {
  const defaultProps = { value: "", onChange: vi.fn() };

  describe("container theming", () => {
    it("has theme-responsive backgrounds", () => {
      const { container } = render(<SearchBar {...defaultProps} />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("bg-white");
      expect(bar.className).toContain("dark:bg-[#252930]");
      expect(bar.className).toContain("midnight:bg-[#0f1729]");
      expect(bar.className).toContain("purple:bg-[#2a1a3e]");
    });

    it("has rounded-lg border", () => {
      const { container } = render(<SearchBar {...defaultProps} />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("rounded-lg");
      expect(bar.className).toContain("border");
    });

    it("has flex items-center layout", () => {
      const { container } = render(<SearchBar {...defaultProps} />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("flex");
      expect(bar.className).toContain("items-center");
    });
  });

  describe("size variants", () => {
    it("sm size has h-8 and smaller padding", () => {
      const { container } = render(<SearchBar {...defaultProps} size="sm" />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("h-8");
    });

    it("md size has responsive h-9 sm:h-10", () => {
      const { container } = render(<SearchBar {...defaultProps} size="md" />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("h-9");
      expect(bar.className).toContain("sm:h-10");
    });

    it("lg size has responsive h-10 sm:h-12", () => {
      const { container } = render(<SearchBar {...defaultProps} size="lg" />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("h-10");
      expect(bar.className).toContain("sm:h-12");
    });
  });

  describe("full width", () => {
    it("has w-full when fullWidth is true", () => {
      const { container } = render(<SearchBar {...defaultProps} fullWidth />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("w-full");
    });

    it("has w-auto when fullWidth is false", () => {
      const { container } = render(<SearchBar {...defaultProps} />);

      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("w-auto");
    });
  });
});
