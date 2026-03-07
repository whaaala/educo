import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import ViewToggle from "@/components/shared/ViewToggle";

describe("ViewToggle — Visual / CSS", () => {
  describe("container theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const toggle = container.firstChild as HTMLElement;
      expect(toggle.className).toContain("bg-white");
      expect(toggle.className).toContain("dark:bg-gray-800");
      expect(toggle.className).toContain("midnight:bg-gray-900");
      expect(toggle.className).toContain("purple:bg-gray-900");
    });

    it("has border with theme colors", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const toggle = container.firstChild as HTMLElement;
      expect(toggle.className).toContain("border");
      expect(toggle.className).toContain("border-gray-300");
      expect(toggle.className).toContain("dark:border-gray-600");
    });

    it("has rounded-lg and shadow-sm", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const toggle = container.firstChild as HTMLElement;
      expect(toggle.className).toContain("rounded-lg");
      expect(toggle.className).toContain("shadow-sm");
    });
  });

  describe("active indicator slider", () => {
    it("slider has gradient background", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const slider = container.querySelector(".bg-gradient-to-br");
      expect(slider).toBeInTheDocument();
      expect(slider!.className).toContain("from-blue-600");
      expect(slider!.className).toContain("to-blue-700");
    });
  });

  describe("icon styling", () => {
    it("active icon has white text", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      // Lucide SVGs need getAttribute("class") in jsdom
      const listBtn = container.querySelector('[aria-label="List view"]')!;
      const svg = listBtn.querySelector("svg")!;
      const cls = svg.getAttribute("class")!;
      expect(cls).toContain("text-white");
    });

    it("inactive icon has gray text", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const gridBtn = container.querySelector('[aria-label="Grid view"]')!;
      const svg = gridBtn.querySelector("svg")!;
      const cls = svg.getAttribute("class")!;
      expect(cls).toContain("text-gray-600");
      expect(cls).toContain("dark:text-gray-400");
    });

    it("icons have responsive sizing", () => {
      const { container } = render(
        <ViewToggle viewMode="list" onViewModeChange={vi.fn()} />
      );

      const svg = container.querySelector("svg")!;
      const cls = svg.getAttribute("class")!;
      expect(cls).toContain("w-3.5");
      expect(cls).toContain("h-3.5");
      expect(cls).toContain("sm:w-4");
      expect(cls).toContain("sm:h-4");
    });
  });
});
