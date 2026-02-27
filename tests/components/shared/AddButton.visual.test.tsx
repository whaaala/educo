import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AddButton from "@/components/shared/AddButton";

describe("AddButton — Visual / CSS", () => {
  describe("button theming", () => {
    it("has blue background with theme variants", () => {
      render(<AddButton label="Add Item" />);
      const btn = screen.getByText("Add Item").closest("button")!;
      expect(btn.className).toContain("bg-blue-600");
      expect(btn.className).toContain("hover:bg-blue-700");
      expect(btn.className).toContain("dark:bg-blue-500");
      expect(btn.className).toContain("dark:hover:bg-blue-600");
    });

    it("has midnight and purple theme colors", () => {
      render(<AddButton label="Add Item" />);
      const btn = screen.getByText("Add Item").closest("button")!;
      expect(btn.className).toContain("midnight:bg-cyan-600");
      expect(btn.className).toContain("purple:bg-pink-600");
    });

    it("has white text", () => {
      render(<AddButton label="Add Item" />);
      const btn = screen.getByText("Add Item").closest("button")!;
      expect(btn.className).toContain("text-white");
    });
  });

  describe("layout", () => {
    it("has flex centered layout", () => {
      render(<AddButton label="Add Item" />);
      const btn = screen.getByText("Add Item").closest("button")!;
      expect(btn.className).toContain("flex");
      expect(btn.className).toContain("items-center");
      expect(btn.className).toContain("justify-center");
    });

    it("has rounded-lg shadow-md", () => {
      render(<AddButton label="Add Item" />);
      const btn = screen.getByText("Add Item").closest("button")!;
      expect(btn.className).toContain("rounded-lg");
      expect(btn.className).toContain("shadow-md");
    });

    it("label has text-sm font-medium", () => {
      render(<AddButton label="Add Item" />);
      const span = screen.getByText("Add Item");
      expect(span.className).toContain("text-sm");
      expect(span.className).toContain("font-medium");
    });
  });
});
