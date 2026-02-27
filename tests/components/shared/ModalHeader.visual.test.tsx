import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ModalHeader from "@/components/shared/ModalHeader";
import { Bell } from "lucide-react";

describe("ModalHeader — Visual / CSS", () => {
  const defaultProps = { title: "Alert", icon: Bell, onClose: vi.fn() };

  describe("blue variant", () => {
    it("has blue background", () => {
      const { container } = render(<ModalHeader {...defaultProps} variant="blue" />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("bg-blue-50");
      expect(header.className).toContain("dark:bg-blue-900/20");
      expect(header.className).toContain("midnight:bg-cyan-900/20");
      expect(header.className).toContain("purple:bg-pink-900/20");
    });

    it("has blue icon background", () => {
      const { container } = render(<ModalHeader {...defaultProps} variant="blue" />);
      const iconBg = container.querySelector(".rounded-full.flex");
      expect(iconBg).toBeInTheDocument();
      expect(iconBg!.className).toContain("bg-blue-500");
    });
  });

  describe("red variant", () => {
    it("has red background", () => {
      const { container } = render(<ModalHeader {...defaultProps} variant="red" />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("bg-red-50");
      expect(header.className).toContain("dark:bg-red-900/20");
    });
  });

  describe("layout", () => {
    it("has rounded-t-2xl and border-b", () => {
      const { container } = render(<ModalHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("rounded-t-2xl");
      expect(header.className).toContain("border-b");
    });

    it("has padding px-6 pt-4 pb-3", () => {
      const { container } = render(<ModalHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("px-6");
      expect(header.className).toContain("pt-4");
      expect(header.className).toContain("pb-3");
    });
  });

  describe("title styling", () => {
    it("title has theme text colors", () => {
      render(<ModalHeader {...defaultProps} />);
      const title = screen.getByText("Alert");
      expect(title.className).toContain("text-gray-900");
      expect(title.className).toContain("dark:text-white");
      expect(title.className).toContain("midnight:text-cyan-100");
      expect(title.className).toContain("purple:text-pink-100");
    });

    it("title has text-sm font-bold text-center", () => {
      render(<ModalHeader {...defaultProps} />);
      const title = screen.getByText("Alert");
      expect(title.className).toContain("text-sm");
      expect(title.className).toContain("font-bold");
      expect(title.className).toContain("text-center");
    });
  });

  describe("close button", () => {
    it("has aria-label", () => {
      render(<ModalHeader {...defaultProps} />);
      const closeBtn = screen.getByLabelText("Close modal");
      expect(closeBtn).toBeInTheDocument();
    });

    it("has absolute positioning", () => {
      render(<ModalHeader {...defaultProps} />);
      const closeBtn = screen.getByLabelText("Close modal");
      expect(closeBtn.className).toContain("absolute");
      expect(closeBtn.className).toContain("top-4");
      expect(closeBtn.className).toContain("right-4");
    });
  });
});
