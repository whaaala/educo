import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadMoreButton from "@/components/shared/LoadMoreButton";

describe("LoadMoreButton — Visual / CSS", () => {
  describe("button theming", () => {
    it("has blue background with all theme variants", () => {
      render(<LoadMoreButton onClick={vi.fn()} />);
      const btn = screen.getByText("Load More").closest("button")!;
      expect(btn.className).toContain("bg-blue-600");
      expect(btn.className).toContain("dark:bg-blue-500");
      expect(btn.className).toContain("midnight:bg-cyan-600");
      expect(btn.className).toContain("purple:bg-pink-600");
    });

    it("has hover variants for all themes", () => {
      render(<LoadMoreButton onClick={vi.fn()} />);
      const btn = screen.getByText("Load More").closest("button")!;
      expect(btn.className).toContain("hover:bg-blue-700");
      expect(btn.className).toContain("dark:hover:bg-blue-600");
      expect(btn.className).toContain("midnight:hover:bg-cyan-700");
      expect(btn.className).toContain("purple:hover:bg-pink-700");
    });

    it("has white text and shadow", () => {
      render(<LoadMoreButton onClick={vi.fn()} />);
      const btn = screen.getByText("Load More").closest("button")!;
      expect(btn.className).toContain("text-white");
      expect(btn.className).toContain("shadow-md");
    });
  });

  describe("layout", () => {
    it("has rounded-lg flex layout", () => {
      render(<LoadMoreButton onClick={vi.fn()} />);
      const btn = screen.getByText("Load More").closest("button")!;
      expect(btn.className).toContain("rounded-lg");
      expect(btn.className).toContain("flex");
      expect(btn.className).toContain("items-center");
    });

    it("container centers the button", () => {
      const { container } = render(<LoadMoreButton onClick={vi.fn()} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("flex");
      expect(wrapper.className).toContain("justify-center");
    });
  });

  describe("disabled state", () => {
    it("has disabled:opacity-50", () => {
      render(<LoadMoreButton onClick={vi.fn()} disabled />);
      const btn = screen.getByText("Load More").closest("button")!;
      expect(btn.className).toContain("disabled:opacity-50");
      expect(btn.className).toContain("disabled:cursor-not-allowed");
    });
  });

  describe("loading state", () => {
    it("shows spinner with animate-spin", () => {
      const { container } = render(<LoadMoreButton onClick={vi.fn()} isLoading />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });
});
