import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InPageSpinner from "@/components/shared/InPageSpinner";

describe("InPageSpinner — Visual / CSS", () => {
  describe("container", () => {
    it("has centered flex layout with min-height", () => {
      const { container } = render(<InPageSpinner />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("flex");
      expect(wrapper.className).toContain("items-center");
      expect(wrapper.className).toContain("justify-center");
      expect(wrapper.className).toContain("min-h-[400px]");
    });

    it("has fade-in animation", () => {
      const { container } = render(<InPageSpinner />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("animate-in");
      expect(wrapper.className).toContain("fade-in");
    });
  });

  describe("spinner theming", () => {
    it("has animated spin ring with theme colors", () => {
      const { container } = render(<InPageSpinner />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
      expect(spinner!.className).toContain("border-t-blue-600");
      expect(spinner!.className).toContain("dark:border-t-blue-400");
      expect(spinner!.className).toContain("midnight:border-t-cyan-400");
      expect(spinner!.className).toContain("purple:border-t-pink-400");
    });

    it("has background ring with theme colors", () => {
      const { container } = render(<InPageSpinner />);
      const bgRing = container.querySelector(".border-blue-100");
      expect(bgRing).toBeInTheDocument();
      expect(bgRing!.className).toContain("dark:border-blue-900/30");
    });
  });

  describe("text theming", () => {
    it("loading text has theme colors", () => {
      render(<InPageSpinner loadingText="Loading" />);
      const text = screen.getByText("Loading");
      expect(text.className).toContain("text-xl");
      expect(text.className).toContain("font-bold");
      expect(text.className).toContain("text-ink");
    });

    it("subtext has subdued colors", () => {
      render(<InPageSpinner />);
      const sub = screen.getByText("Please wait a moment...");
      expect(sub.className).toContain("text-sm");
      expect(sub.className).toContain("text-gray-500");
    });
  });
});
