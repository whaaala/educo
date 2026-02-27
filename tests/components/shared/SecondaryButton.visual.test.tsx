import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SecondaryButton from "@/components/shared/SecondaryButton";

describe("SecondaryButton — Visual / CSS", () => {
  describe("button theming", () => {
    it("has theme-responsive backgrounds", () => {
      render(<SecondaryButton label="Cancel" />);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("bg-white");
      expect(btn.className).toContain("dark:bg-gray-800");
      expect(btn.className).toContain("midnight:bg-gray-800/80");
      expect(btn.className).toContain("purple:bg-gray-800/80");
    });

    it("has theme text colors", () => {
      render(<SecondaryButton label="Cancel" />);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("text-gray-700");
      expect(btn.className).toContain("dark:text-gray-300");
      expect(btn.className).toContain("midnight:text-cyan-300");
      expect(btn.className).toContain("purple:text-pink-300");
    });

    it("has border with theme colors", () => {
      render(<SecondaryButton label="Cancel" />);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("border");
      expect(btn.className).toContain("border-gray-200");
      expect(btn.className).toContain("dark:border-gray-700");
      expect(btn.className).toContain("midnight:border-cyan-500/20");
      expect(btn.className).toContain("purple:border-pink-500/20");
    });
  });

  describe("layout", () => {
    it("has rounded-lg flex layout", () => {
      render(<SecondaryButton label="Cancel" />);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("rounded-lg");
      expect(btn.className).toContain("flex");
      expect(btn.className).toContain("items-center");
    });

    it("has text-sm font-medium", () => {
      render(<SecondaryButton label="Cancel" />);
      const btn = screen.getByText("Cancel").closest("button")!;
      expect(btn.className).toContain("text-sm");
      expect(btn.className).toContain("font-medium");
    });
  });

  describe("mobile text hiding", () => {
    it("hides label on mobile with hidden sm:inline", () => {
      render(<SecondaryButton label="Cancel" hideTextOnMobile />);
      const span = screen.getByText("Cancel");
      expect(span.className).toContain("hidden");
      expect(span.className).toContain("sm:inline");
    });

    it("shows label on all sizes when hideTextOnMobile is false", () => {
      render(<SecondaryButton label="Cancel" hideTextOnMobile={false} />);
      const span = screen.getByText("Cancel");
      expect(span.className).not.toContain("hidden");
    });
  });
});
