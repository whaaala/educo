import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ActionButton from "@/components/shared/ActionButton";

describe("ActionButton — Visual / CSS", () => {
  describe("base classes", () => {
    it("has inline-flex font-medium layout", () => {
      render(<ActionButton>Click</ActionButton>);
      const btn = screen.getByText("Click").closest("button")!;
      expect(btn.className).toContain("inline-flex");
      expect(btn.className).toContain("font-medium");
      expect(btn.className).toContain("cursor-pointer");
    });

    it("has disabled styles", () => {
      render(<ActionButton disabled>Click</ActionButton>);
      const btn = screen.getByText("Click").closest("button")!;
      expect(btn.className).toContain("disabled:opacity-50");
      expect(btn.className).toContain("disabled:cursor-not-allowed");
    });
  });

  describe("blue primary variant", () => {
    it("has blue gradient", () => {
      render(<ActionButton color="blue" variant="primary">Go</ActionButton>);
      const btn = screen.getByText("Go").closest("button")!;
      expect(btn.className).toContain("from-blue-500");
      expect(btn.className).toContain("to-indigo-500");
      expect(btn.className).toContain("text-white");
    });
  });

  describe("blue secondary variant", () => {
    it("has blue-50 gradient background", () => {
      render(<ActionButton color="blue" variant="secondary">Go</ActionButton>);
      const btn = screen.getByText("Go").closest("button")!;
      expect(btn.className).toContain("from-blue-50");
      expect(btn.className).toContain("text-blue-700");
      expect(btn.className).toContain("dark:text-blue-300");
    });
  });

  describe("size variants", () => {
    it("sm size has px-3 py-1.5 text-xs rounded-lg", () => {
      render(<ActionButton size="sm">Small</ActionButton>);
      const btn = screen.getByText("Small").closest("button")!;
      expect(btn.className).toContain("px-3");
      expect(btn.className).toContain("py-1.5");
      expect(btn.className).toContain("text-xs");
      expect(btn.className).toContain("rounded-lg");
    });

    it("md size has px-4 py-2 rounded-xl", () => {
      render(<ActionButton size="md">Medium</ActionButton>);
      const btn = screen.getByText("Medium").closest("button")!;
      expect(btn.className).toContain("px-4");
      expect(btn.className).toContain("py-2");
      expect(btn.className).toContain("rounded-xl");
    });

    it("lg size has px-5 py-2.5 text-sm rounded-xl", () => {
      render(<ActionButton size="lg">Large</ActionButton>);
      const btn = screen.getByText("Large").closest("button")!;
      expect(btn.className).toContain("px-5");
      expect(btn.className).toContain("py-2.5");
      expect(btn.className).toContain("text-sm");
    });
  });

  describe("danger variant", () => {
    it("has red gradient", () => {
      render(<ActionButton variant="danger">Delete</ActionButton>);
      const btn = screen.getByText("Delete").closest("button")!;
      expect(btn.className).toContain("from-red-500");
      expect(btn.className).toContain("to-rose-500");
      expect(btn.className).toContain("text-white");
    });
  });
});
