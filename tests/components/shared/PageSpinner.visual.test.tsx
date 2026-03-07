import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageSpinner from "@/components/shared/PageSpinner";

describe("PageSpinner — Visual / CSS", () => {
  describe("container layout", () => {
    it("has centered flex layout with min-height", () => {
      const { container } = render(<PageSpinner />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("flex");
      expect(wrapper.className).toContain("flex-col");
      expect(wrapper.className).toContain("items-center");
      expect(wrapper.className).toContain("justify-center");
      expect(wrapper.className).toContain("min-h-[400px]");
    });
  });

  describe("spinner theming", () => {
    it("spinner has theme colors", () => {
      const { container } = render(<PageSpinner />);

      // Lucide SVGs use getAttribute("class") in jsdom
      const spinner = container.querySelector("svg")!;
      const cls = spinner.getAttribute("class")!;
      expect(cls).toContain("animate-spin");
      expect(cls).toContain("text-blue-600");
      expect(cls).toContain("dark:text-blue-400");
      expect(cls).toContain("midnight:text-cyan-400");
      expect(cls).toContain("purple:text-pink-400");
    });

    it("pulsing background has theme colors", () => {
      const { container } = render(<PageSpinner />);

      const pulse = container.querySelector(".animate-pulse.rounded-full");
      expect(pulse).toBeInTheDocument();
      expect(pulse!.className).toContain("bg-blue-100");
      expect(pulse!.className).toContain("dark:bg-blue-900/20");
    });
  });

  describe("size variants", () => {
    it("sm spinner is w-8 h-8", () => {
      const { container } = render(<PageSpinner size="sm" />);

      const spinner = container.querySelector("svg")!;
      const cls = spinner.getAttribute("class")!;
      expect(cls).toContain("w-8");
      expect(cls).toContain("h-8");
    });

    it("md spinner is w-12 h-12", () => {
      const { container } = render(<PageSpinner size="md" />);

      const spinner = container.querySelector("svg")!;
      const cls = spinner.getAttribute("class")!;
      expect(cls).toContain("w-12");
      expect(cls).toContain("h-12");
    });

    it("lg spinner is w-16 h-16", () => {
      const { container } = render(<PageSpinner size="lg" />);

      const spinner = container.querySelector("svg")!;
      const cls = spinner.getAttribute("class")!;
      expect(cls).toContain("w-16");
      expect(cls).toContain("h-16");
    });
  });

  describe("message theming", () => {
    it("message has theme text colors", () => {
      render(<PageSpinner message="Loading..." />);

      const msg = screen.getByText("Loading...");
      expect(msg.className).toContain("text-gray-600");
      expect(msg.className).toContain("dark:text-gray-400");
      expect(msg.className).toContain("midnight:text-cyan-300");
      expect(msg.className).toContain("purple:text-pink-300");
    });
  });
});
