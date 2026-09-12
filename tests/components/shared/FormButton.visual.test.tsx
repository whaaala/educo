import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FormButton from "@/components/shared/FormButton";

describe("FormButton — Visual / CSS", () => {
  describe("base classes", () => {
    it("has rounded-xl and flex layout", () => {
      render(<FormButton>Submit</FormButton>);
      const btn = screen.getByText("Submit").closest("button")!;
      expect(btn.className).toContain("rounded-xl");
      expect(btn.className).toContain("flex");
      expect(btn.className).toContain("items-center");
      expect(btn.className).toContain("justify-center");
    });

    it("has responsive padding px-4 sm:px-6", () => {
      render(<FormButton>Submit</FormButton>);
      const btn = screen.getByText("Submit").closest("button")!;
      expect(btn.className).toContain("px-4");
      expect(btn.className).toContain("sm:px-6");
    });

    it("has text-sm font-semibold", () => {
      render(<FormButton>Submit</FormButton>);
      const btn = screen.getByText("Submit").closest("button")!;
      expect(btn.className).toContain("text-sm");
      expect(btn.className).toContain("font-semibold");
    });
  });

  describe("primary variant", () => {
    it("has gradient background with theme colors", () => {
      render(<FormButton variant="primary">Save</FormButton>);
      const btn = screen.getByText("Save").closest("button")!;
      expect(btn.className).toContain("from-blue-600");
      expect(btn.className).toContain("to-purple-600");
      expect(btn.className).toContain("text-white");
    });

    it("has dark theme gradient", () => {
      render(<FormButton variant="primary">Save</FormButton>);
      const btn = screen.getByText("Save").closest("button")!;
      expect(btn.className).toContain("dark:from-blue-500");
      expect(btn.className).toContain("dark:to-purple-500");
    });

    it("has midnight theme gradient", () => {
      render(<FormButton variant="primary">Save</FormButton>);
      const btn = screen.getByText("Save").closest("button")!;
      expect(btn.className).toContain("midnight:from-cyan-600");
    });
  });

  describe("secondary variant", () => {
    it("has border-2 outline style", () => {
      render(<FormButton variant="secondary">Cancel</FormButton>);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("border-2");
      expect(btn.className).toContain("border-gray-300");
      expect(btn.className).toContain("dark:border-gray-600");
    });

    it("has theme text colors", () => {
      render(<FormButton variant="secondary">Cancel</FormButton>);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("text-gray-700");
      expect(btn.className).toContain("dark:text-gray-300");
      expect(btn.className).toContain("midnight:text-cyan-300");
      expect(btn.className).toContain("purple:text-pink-300");
    });
  });

  describe("disabled state", () => {
    it("has opacity-50 cursor-not-allowed", () => {
      render(<FormButton disabled>Submit</FormButton>);
      const btn = screen.getByText("Submit").closest("button")!;
      expect(btn.className).toContain("opacity-50");
      expect(btn.className).toContain("cursor-not-allowed");
    });
  });
});
