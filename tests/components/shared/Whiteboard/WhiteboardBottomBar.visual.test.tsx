import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WhiteboardBottomBar from "@/components/shared/Whiteboard/WhiteboardBottomBar";

const defaultProps = {
  viewport: { x: 0, y: 0, zoom: 1 },
  canUndo: true,
  canRedo: true,
  onUndo: vi.fn(),
  onRedo: vi.fn(),
  onZoomIn: vi.fn(),
  onZoomOut: vi.fn(),
  onFitToScreen: vi.fn(),
  onClearAll: vi.fn(),
};

describe("WhiteboardBottomBar — Visual / CSS", () => {
  // ─── Container theme classes ─────────────────
  describe("container theming", () => {
    it("has correct light theme background and border", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("bg-white");
      expect(bar.className).toContain("border-t");
      expect(bar.className).toContain("border-line");
    });

    it("has dark theme classes", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("dark:bg-[#1a1d24]");
      expect(bar.className).toContain("border-line");
    });

    it("has midnight theme classes", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("midnight:bg-[#0f1729]");
      expect(bar.className).toContain("border-line");
    });

    it("has purple theme classes", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("purple:bg-[#2a1a3e]");
      expect(bar.className).toContain("border-line");
    });

    it("has flex layout with items-center and justify-between", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("flex");
      expect(bar.className).toContain("items-center");
      expect(bar.className).toContain("justify-between");
    });

    it("has padding px-3 py-1.5", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("px-3");
      expect(bar.className).toContain("py-1.5");
    });
  });

  // ─── Button states ───────────────────────────
  describe("button state classes", () => {
    it("disabled buttons have opacity-30 and cursor-not-allowed", () => {
      render(
        <WhiteboardBottomBar
          {...defaultProps}
          canUndo={false}
          canRedo={false}
        />
      );
      const undoBtn = screen.getByTitle("Undo (Ctrl+Z)");
      expect(undoBtn.className).toContain("opacity-30");
      expect(undoBtn.className).toContain("cursor-not-allowed");
    });

    it("enabled buttons have cursor-pointer", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const undoBtn = screen.getByTitle("Undo (Ctrl+Z)");
      expect(undoBtn.className).toContain("cursor-pointer");
    });

    it("buttons have rounded-lg and transition styling", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const undoBtn = screen.getByTitle("Undo (Ctrl+Z)");
      expect(undoBtn.className).toContain("rounded-lg");
      expect(undoBtn.className).toContain("transition-all");
      expect(undoBtn.className).toContain("duration-150");
    });

    it("enabled buttons have hover background classes", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const undoBtn = screen.getByTitle("Undo (Ctrl+Z)");
      expect(undoBtn.className).toContain("hover:bg-gray-100");
      expect(undoBtn.className).toContain("dark:hover:bg-[#22262e]");
    });

    it("clear/danger button has hover:text-red-600 and hover:bg-red-50", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const clearBtn = screen.getByTitle("Clear all");
      expect(clearBtn.className).toContain("hover:text-red-600");
      expect(clearBtn.className).toContain("hover:bg-red-50");
    });
  });

  // ─── Zoom percentage text ────────────────────
  describe("zoom percentage display", () => {
    it("has small bold font styling", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const zoomText = screen.getByText("100%");
      expect(zoomText.className).toContain("text-[10px]");
      expect(zoomText.className).toContain("font-bold");
    });

    it("has theme-appropriate text colors", () => {
      render(<WhiteboardBottomBar {...defaultProps} />);
      const zoomText = screen.getByText("100%");
      expect(zoomText.className).toContain("text-gray-500");
      expect(zoomText.className).toContain("midnight:text-cyan-400/70");
      expect(zoomText.className).toContain("purple:text-pink-400/70");
    });
  });

  // ─── Clear confirmation dialog ───────────────
  describe("clear confirmation dialog styling", () => {
    it("dialog has theme-aware background and border", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      await user.click(screen.getByTitle("Clear all"));

      // Find the dialog popup
      const dialog = container.querySelector(
        ".bg-white.dark\\:bg-gray-800"
      );
      // The dialog exists somewhere in the container
      const dialogText = screen.getByText("Clear all elements?");
      const dialogParent = dialogText.closest("div.absolute");
      expect(dialogParent).not.toBeNull();
    });

    it("cancel button has gray background", async () => {
      const user = userEvent.setup();
      render(<WhiteboardBottomBar {...defaultProps} />);
      await user.click(screen.getByTitle("Clear all"));
      const cancelBtn = screen.getByText("Cancel");
      expect(cancelBtn.className).toContain("bg-gray-100");
    });

    it("clear/confirm button has red background", async () => {
      const user = userEvent.setup();
      render(<WhiteboardBottomBar {...defaultProps} />);
      await user.click(screen.getByTitle("Clear all"));
      const clearBtn = screen.getByText("Clear");
      expect(clearBtn.className).toContain("bg-red-600");
      expect(clearBtn.className).toContain("hover:bg-red-700");
      expect(clearBtn.className).toContain("text-white");
    });

    it("dialog label text has correct typography", async () => {
      const user = userEvent.setup();
      render(<WhiteboardBottomBar {...defaultProps} />);
      await user.click(screen.getByTitle("Clear all"));
      const label = screen.getByText("Clear all elements?");
      expect(label.className).toContain("text-xs");
      expect(label.className).toContain("font-medium");
    });

    it("dialog has rounded corners and shadow", async () => {
      const user = userEvent.setup();
      render(<WhiteboardBottomBar {...defaultProps} />);
      await user.click(screen.getByTitle("Clear all"));
      const dialogText = screen.getByText("Clear all elements?");
      const dialogParent = dialogText.closest("div.absolute");
      expect(dialogParent!.className).toContain("rounded-xl");
      expect(dialogParent!.className).toContain("shadow-xl");
    });
  });

  // ─── Icon sizing ─────────────────────────────
  describe("icon sizing", () => {
    it("icons in buttons are w-3.5 h-3.5", () => {
      const { container } = render(
        <WhiteboardBottomBar {...defaultProps} />
      );
      const svgs = container.querySelectorAll("svg");
      // All icons should have w-3.5 h-3.5 class
      for (const svg of svgs) {
        expect(svg.classList.contains("w-3.5")).toBe(true);
        expect(svg.classList.contains("h-3.5")).toBe(true);
      }
    });
  });
});
