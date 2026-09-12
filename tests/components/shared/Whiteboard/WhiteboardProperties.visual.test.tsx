import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WhiteboardProperties from "@/components/shared/Whiteboard/WhiteboardProperties";

const defaultProps = {
  activeTool: "pen" as const,
  activeColor: "#000000",
  activeStrokeWidth: 2,
  activeFontSize: 16,
  activeStickyColor: "#fef08a",
  activeFillColor: null as string | null,
  onColorChange: vi.fn(),
  onStrokeWidthChange: vi.fn(),
  onFontSizeChange: vi.fn(),
  onStickyColorChange: vi.fn(),
  onFillColorChange: vi.fn(),
};

describe("WhiteboardProperties — Visual / CSS", () => {
  // ─── Panel container ─────────────────────────
  describe("panel container theming", () => {
    it("has correct light theme background and border", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("bg-white");
      expect(panel.className).toContain("border-r");
      expect(panel.className).toContain("border-line");
    });

    it("has dark theme classes", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("dark:bg-[#1a1d24]");
      expect(panel.className).toContain("border-line");
    });

    it("has midnight theme classes", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("midnight:bg-[#0f1729]");
      expect(panel.className).toContain("border-line");
    });

    it("has purple theme classes", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("purple:bg-[#2a1a3e]");
      expect(panel.className).toContain("border-line");
    });

    it("has flex column layout with 60px width", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("flex");
      expect(panel.className).toContain("flex-col");
      expect(panel.className).toContain("w-[60px]");
      expect(panel.className).toContain("items-center");
    });

    it("has shadow and padding", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} />
      );
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("shadow-sm");
      expect(panel.className).toContain("p-3");
      expect(panel.className).toContain("gap-3");
    });
  });

  // ─── Section labels ──────────────────────────
  describe("section label typography", () => {
    it("Color label has uppercase, tracking-wider, and tiny font", () => {
      render(<WhiteboardProperties {...defaultProps} />);
      const label = screen.getByText("Color");
      expect(label.className).toContain("text-[9px]");
      expect(label.className).toContain("font-bold");
      expect(label.className).toContain("uppercase");
      expect(label.className).toContain("tracking-wider");
    });

    it("Color label has theme text colors", () => {
      render(<WhiteboardProperties {...defaultProps} />);
      const label = screen.getByText("Color");
      expect(label.className).toContain("text-gray-400");
      expect(label.className).toContain("dark:text-gray-500");
      expect(label.className).toContain("midnight:text-cyan-400/50");
      expect(label.className).toContain("purple:text-pink-400/50");
    });

    it("Size label has same styling as Color label", () => {
      render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
      const sizeLabel = screen.getByText("Size");
      expect(sizeLabel.className).toContain("text-[9px]");
      expect(sizeLabel.className).toContain("font-bold");
      expect(sizeLabel.className).toContain("uppercase");
    });
  });

  // ─── Stroke width buttons ────────────────────
  describe("stroke width button styling", () => {
    it("active stroke width has blue highlight background", () => {
      render(
        <WhiteboardProperties
          {...defaultProps}
          activeTool="pen"
          activeStrokeWidth={4}
        />
      );
      const btn = screen.getByTitle("4px");
      expect(btn.className).toContain("bg-blue-100");
      expect(btn.className).toContain("dark:bg-blue-900/30");
      expect(btn.className).toContain("midnight:bg-cyan-900/30");
      expect(btn.className).toContain("purple:bg-pink-900/30");
    });

    it("inactive stroke width has hover background", () => {
      render(
        <WhiteboardProperties
          {...defaultProps}
          activeTool="pen"
          activeStrokeWidth={4}
        />
      );
      const btn = screen.getByTitle("2px"); // Not the active one
      expect(btn.className).toContain("hover:bg-gray-100");
      expect(btn.className).toContain("dark:hover:bg-[#22262e]");
    });

    it("stroke width buttons are 7x7 rounded-lg", () => {
      render(
        <WhiteboardProperties {...defaultProps} activeTool="pen" />
      );
      const btn = screen.getByTitle("2px");
      expect(btn.className).toContain("w-7");
      expect(btn.className).toContain("h-7");
      expect(btn.className).toContain("rounded-lg");
    });

    it("stroke width indicator dot has theme colors", () => {
      const { container } = render(
        <WhiteboardProperties {...defaultProps} activeTool="pen" />
      );
      const dots = container.querySelectorAll(".rounded-full");
      expect(dots.length).toBeGreaterThan(0);
      const dot = dots[0] as HTMLElement;
      expect(dot.className).toContain("bg-gray-700");
      expect(dot.className).toContain("dark:bg-gray-300");
      expect(dot.className).toContain("midnight:bg-cyan-300");
      expect(dot.className).toContain("purple:bg-pink-300");
    });
  });

  // ─── Font size buttons ───────────────────────
  describe("font size button styling", () => {
    it("active font size has blue highlight with theme colors", () => {
      render(
        <WhiteboardProperties
          {...defaultProps}
          activeTool="text"
          activeFontSize={16}
        />
      );
      const btn = screen.getByTitle("16px");
      expect(btn.className).toContain("bg-blue-100");
      expect(btn.className).toContain("text-blue-600");
      expect(btn.className).toContain("dark:bg-blue-900/30");
      expect(btn.className).toContain("dark:text-blue-400");
      expect(btn.className).toContain("midnight:bg-cyan-900/30");
      expect(btn.className).toContain("midnight:text-cyan-400");
      expect(btn.className).toContain("purple:bg-pink-900/30");
      expect(btn.className).toContain("purple:text-pink-400");
    });

    it("inactive font size has gray text", () => {
      render(
        <WhiteboardProperties
          {...defaultProps}
          activeTool="text"
          activeFontSize={16}
        />
      );
      const btn = screen.getByTitle("12px");
      expect(btn.className).toContain("text-muted");
    });

    it("font size buttons show size number as text content", () => {
      render(
        <WhiteboardProperties {...defaultProps} activeTool="text" />
      );
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("16")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("28")).toBeInTheDocument();
      expect(screen.getByText("36")).toBeInTheDocument();
    });
  });
});
