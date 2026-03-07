import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "@/components/shared/PageLoader";

describe("PageLoader — Visual / CSS", () => {
  describe("container theming", () => {
    it("has fixed inset-0 fullscreen overlay", () => {
      const { container } = render(<PageLoader isLoading />);

      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("fixed");
      expect(overlay.className).toContain("inset-0");
      expect(overlay.className).toContain("z-50");
    });

    it("has theme backgrounds", () => {
      const { container } = render(<PageLoader isLoading />);

      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("bg-white");
      expect(overlay.className).toContain("dark:bg-gray-900");
      expect(overlay.className).toContain("midnight:bg-gray-950");
      expect(overlay.className).toContain("purple:bg-gray-950");
    });

    it("has centered flex layout", () => {
      const { container } = render(<PageLoader isLoading />);

      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("flex");
      expect(overlay.className).toContain("items-center");
      expect(overlay.className).toContain("justify-center");
    });

    it("has fade-in animation", () => {
      const { container } = render(<PageLoader isLoading />);

      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("animate-in");
      expect(overlay.className).toContain("fade-in");
    });
  });

  describe("spinner theming", () => {
    it("has animated spin ring", () => {
      const { container } = render(<PageLoader isLoading />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
      expect(spinner!.className).toContain("border-t-blue-600");
      expect(spinner!.className).toContain("dark:border-t-blue-400");
      expect(spinner!.className).toContain("midnight:border-t-cyan-400");
      expect(spinner!.className).toContain("purple:border-t-pink-400");
    });
  });

  describe("text theming", () => {
    it("loading text has theme colors", () => {
      render(<PageLoader isLoading loadingText="Loading" />);

      const text = screen.getByText("Loading");
      expect(text.className).toContain("text-xl");
      expect(text.className).toContain("font-bold");
      expect(text.className).toContain("text-gray-900");
      expect(text.className).toContain("dark:text-white");
      expect(text.className).toContain("midnight:text-cyan-50");
      expect(text.className).toContain("purple:text-pink-50");
    });

    it("subtext has subdued theme colors", () => {
      render(<PageLoader isLoading />);

      const sub = screen.getByText("Please wait a moment...");
      expect(sub.className).toContain("text-sm");
      expect(sub.className).toContain("text-gray-500");
      expect(sub.className).toContain("dark:text-gray-400");
    });
  });
});
