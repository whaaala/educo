import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

describe("ConfirmationModal — Visual / CSS", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Delete Item",
    message: "Are you sure?",
  };

  describe("backdrop", () => {
    it("has fixed overlay with blur", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} />);
      const backdrop = container.firstChild as HTMLElement;
      expect(backdrop.className).toContain("fixed");
      expect(backdrop.className).toContain("inset-0");
      expect(backdrop.className).toContain("bg-black/60");
      expect(backdrop.className).toContain("backdrop-blur-sm");
    });

    it("has fade-in animation", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} />);
      const backdrop = container.firstChild as HTMLElement;
      expect(backdrop.className).toContain("animate-in");
      expect(backdrop.className).toContain("fade-in");
    });
  });

  describe("dialog theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} />);
      const dialog = container.querySelector(".rounded-2xl")!;
      expect(dialog.className).toContain("bg-white");
      expect(dialog.className).toContain("dark:bg-[#1a1d23]");
      expect(dialog.className).toContain("midnight:bg-[#0f1729]");
      expect(dialog.className).toContain("purple:bg-[#2a1a3e]");
    });

    it("has rounded-2xl shadow-2xl", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} />);
      const dialog = container.querySelector(".rounded-2xl")!;
      expect(dialog.className).toContain("shadow-2xl");
      expect(dialog.className).toContain("max-w-md");
    });
  });

  describe("danger variant icon", () => {
    it("has red icon background", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} variant="danger" />);
      const iconBg = container.querySelector(".rounded-xl.flex");
      expect(iconBg).toBeInTheDocument();
      expect(iconBg!.className).toContain("bg-red-100");
      expect(iconBg!.className).toContain("dark:bg-red-900/30");
    });
  });

  describe("title theming", () => {
    it("has theme text colors", () => {
      render(<ConfirmationModal {...defaultProps} />);
      const title = screen.getByText("Delete Item");
      expect(title.className).toContain("text-gray-900");
      expect(title.className).toContain("dark:text-white");
      expect(title.className).toContain("midnight:text-cyan-50");
      expect(title.className).toContain("purple:text-pink-50");
    });
  });

  describe("buttons", () => {
    it("cancel button has theme styling", () => {
      render(<ConfirmationModal {...defaultProps} />);
      const cancel = screen.getByText("Cancel");
      expect(cancel.className).toContain("bg-white");
      expect(cancel.className).toContain("dark:bg-[#1a1d24]");
      expect(cancel.className).toContain("border");
      expect(cancel.className).toContain("rounded-lg");
    });

    it("confirm button has gradient", () => {
      render(<ConfirmationModal {...defaultProps} variant="danger" />);
      const confirm = screen.getByText("Confirm");
      expect(confirm.className).toContain("bg-gradient-to-r");
      expect(confirm.className).toContain("from-red-600");
      expect(confirm.className).toContain("text-white");
    });
  });

  describe("footer theming", () => {
    it("footer has theme background", () => {
      const { container } = render(<ConfirmationModal {...defaultProps} />);
      const footer = container.querySelector(".bg-gray-50\\/50");
      expect(footer).toBeInTheDocument();
    });
  });
});
