import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NameLabel from "@/components/shared/NameLabel";

describe("NameLabel — Visual / CSS", () => {
  describe("base classes", () => {
    it("has dark background with theme variants", () => {
      render(<NameLabel name="John" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("bg-gray-900");
      expect(label.className).toContain("dark:bg-gray-800");
      expect(label.className).toContain("midnight:bg-gray-950");
      expect(label.className).toContain("purple:bg-gray-950");
    });

    it("has white text and font-medium", () => {
      render(<NameLabel name="John" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("text-white");
      expect(label.className).toContain("font-medium");
    });

    it("has rounded-lg shadow-md", () => {
      render(<NameLabel name="John" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("rounded-lg");
      expect(label.className).toContain("shadow-md");
    });

    it("has inline-block whitespace-nowrap", () => {
      render(<NameLabel name="John" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("inline-block");
      expect(label.className).toContain("whitespace-nowrap");
    });
  });

  describe("size variants", () => {
    it("compact has px-2 py-1 text-xs", () => {
      render(<NameLabel name="John" variant="compact" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("px-2");
      expect(label.className).toContain("py-1");
      expect(label.className).toContain("text-xs");
    });

    it("default has px-3 py-1.5 text-sm", () => {
      render(<NameLabel name="John" variant="default" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("px-3");
      expect(label.className).toContain("py-1.5");
      expect(label.className).toContain("text-sm");
    });

    it("large has px-4 py-2 text-base", () => {
      render(<NameLabel name="John" variant="large" />);

      const label = screen.getByText("John");
      expect(label.className).toContain("px-4");
      expect(label.className).toContain("py-2");
      expect(label.className).toContain("text-base");
    });
  });
});
