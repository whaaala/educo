import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "@/components/shared/Button";

describe("Button — Visual / CSS", () => {
  // ─── Variant colors ──────────────────────────
  describe("variant styling", () => {
    it("primary variant has purple background", () => {
      render(<Button variant="primary">Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("bg-purple-600");
      expect(btn.className).toContain("hover:bg-purple-700");
      expect(btn.className).toContain("text-white");
    });

    it("primary variant has dark theme class", () => {
      render(<Button variant="primary">Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("dark:bg-purple-500");
      expect(btn.className).toContain("dark:hover:bg-purple-600");
    });

    it("secondary variant has neutral background", () => {
      render(<Button variant="secondary">Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("bg-neutral-600");
      expect(btn.className).toContain("hover:bg-neutral-700");
      expect(btn.className).toContain("text-white");
    });

    it("danger variant has red background", () => {
      render(<Button variant="danger">Delete</Button>);
      const btn = screen.getByText("Delete");
      expect(btn.className).toContain("bg-red-600");
      expect(btn.className).toContain("hover:bg-red-700");
    });
  });

  // ─── Size variants ───────────────────────────
  describe("size styling", () => {
    it("sm size has smaller padding", () => {
      render(<Button size="sm">Small</Button>);
      const btn = screen.getByText("Small");
      expect(btn.className).toContain("px-3");
      expect(btn.className).toContain("py-1.5");
      expect(btn.className).toContain("text-sm");
    });

    it("md size has medium padding", () => {
      render(<Button size="md">Medium</Button>);
      const btn = screen.getByText("Medium");
      expect(btn.className).toContain("px-4");
      expect(btn.className).toContain("py-2");
    });

    it("lg size has larger padding", () => {
      render(<Button size="lg">Large</Button>);
      const btn = screen.getByText("Large");
      expect(btn.className).toContain("px-6");
      expect(btn.className).toContain("py-3");
    });
  });

  // ─── State classes ───────────────────────────
  describe("state classes", () => {
    it("has focus ring classes", () => {
      render(<Button>Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("focus:outline-none");
      expect(btn.className).toContain("focus:ring-2");
      expect(btn.className).toContain("focus:ring-offset-2");
    });

    it("disabled state has opacity and cursor classes", () => {
      render(<Button disabled>Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("disabled:opacity-50");
      expect(btn.className).toContain("disabled:cursor-not-allowed");
    });

    it("has rounded-lg border radius", () => {
      render(<Button>Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("rounded-lg");
    });

    it("has inline-flex layout with centered content", () => {
      render(<Button>Click</Button>);
      const btn = screen.getByText("Click");
      expect(btn.className).toContain("inline-flex");
      expect(btn.className).toContain("items-center");
      expect(btn.className).toContain("justify-center");
    });
  });

  // ─── Loading state ───────────────────────────
  describe("loading state", () => {
    it("shows spinner with animate-spin class", () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });
});
