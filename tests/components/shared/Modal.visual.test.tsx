import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Modal from "@/components/shared/Modal";

// Mock Portal to render children inline
vi.mock("@/components/shared/Portal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("Modal — Visual / CSS", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    children: <p>Content</p>,
  };

  describe("backdrop", () => {
    it("has fixed overlay with blur and animation", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const backdrop = container.querySelector(".fixed.inset-0");
      expect(backdrop).toBeInTheDocument();
      expect(backdrop!.className).toContain("bg-black/60");
      expect(backdrop!.className).toContain("backdrop-blur-sm");
      expect(backdrop!.className).toContain("animate-in");
      expect(backdrop!.className).toContain("fade-in");
    });
  });

  describe("dialog theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const dialog = container.querySelector(".rounded-2xl.shadow-2xl");
      expect(dialog).toBeInTheDocument();
      expect(dialog!.className).toContain("bg-white");
      expect(dialog!.className).toContain("dark:bg-[#1a1d24]");
      expect(dialog!.className).toContain("midnight:bg-[#0a0e27]");
      expect(dialog!.className).toContain("purple:bg-[#1a0b2e]");
    });

    it("has rounded-2xl shadow-2xl", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const dialog = container.querySelector(".rounded-2xl");
      expect(dialog).toBeInTheDocument();
      expect(dialog!.className).toContain("shadow-2xl");
    });

    it("has zoom-in animation", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const dialog = container.querySelector(".rounded-2xl");
      expect(dialog!.className).toContain("animate-in");
      expect(dialog!.className).toContain("zoom-in-95");
    });
  });

  describe("max width variants", () => {
    it("default has max-w-4xl", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const dialog = container.querySelector(".rounded-2xl");
      expect(dialog!.className).toContain("max-w-4xl");
    });

    it("sm size has max-w-sm", () => {
      const { container } = render(<Modal {...defaultProps} maxWidth="sm" />);

      const dialog = container.querySelector(".rounded-2xl");
      expect(dialog!.className).toContain("max-w-sm");
    });

    it("lg size has max-w-lg", () => {
      const { container } = render(<Modal {...defaultProps} maxWidth="lg" />);

      const dialog = container.querySelector(".rounded-2xl");
      expect(dialog!.className).toContain("max-w-lg");
    });
  });

  describe("header theming", () => {
    it("title has gradient text", () => {
      render(<Modal {...defaultProps} />);

      const title = screen.getByText("Test Modal");
      expect(title.className).toContain("bg-clip-text");
      expect(title.className).toContain("text-transparent");
    });

    it("title has responsive text sizing", () => {
      render(<Modal {...defaultProps} />);

      const title = screen.getByText("Test Modal");
      expect(title.className).toContain("text-lg");
      expect(title.className).toContain("sm:text-xl");
      expect(title.className).toContain("font-bold");
    });
  });

  describe("close button", () => {
    it("has aria-label Close", () => {
      render(<Modal {...defaultProps} />);

      const closeBtn = screen.getByLabelText("Close");
      expect(closeBtn).toBeInTheDocument();
    });

    it("has rounded-xl hover background", () => {
      render(<Modal {...defaultProps} />);

      const closeBtn = screen.getByLabelText("Close");
      expect(closeBtn.className).toContain("rounded-xl");
      expect(closeBtn.className).toContain("hover:bg-white/60");
    });
  });

  describe("content area", () => {
    it("has responsive padding", () => {
      const { container } = render(<Modal {...defaultProps} />);

      const content = container.querySelector(".overflow-y-auto");
      expect(content).toBeInTheDocument();
      expect(content!.className).toContain("p-4");
      expect(content!.className).toContain("sm:p-6");
    });
  });

  describe("footer theming", () => {
    it("footer has theme border and background", () => {
      const { container } = render(
        <Modal {...defaultProps} footer={<button>Save</button>} />
      );

      const footer = container.querySelector(".border-t.border-gray-200");
      expect(footer).toBeInTheDocument();
      expect(footer!.className).toContain("bg-gray-50/50");
    });
  });
});
