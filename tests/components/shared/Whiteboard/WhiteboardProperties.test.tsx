import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("WhiteboardProperties", () => {
  it("returns null for select tool", () => {
    const { container } = render(
      <WhiteboardProperties {...defaultProps} activeTool="select" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null for eraser tool", () => {
    const { container } = render(
      <WhiteboardProperties {...defaultProps} activeTool="eraser" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null for hand tool", () => {
    const { container } = render(
      <WhiteboardProperties {...defaultProps} activeTool="hand" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows Color label for pen tool", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("shows Size label for stroke width tools", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.getByText("Size")).toBeInTheDocument();
  });

  it("shows Font label for text tool", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="text" />);
    expect(screen.getByText("Font")).toBeInTheDocument();
  });

  it("does not show Font label for non-text tools", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.queryByText("Font")).not.toBeInTheDocument();
  });

  it("shows Note label for sticky tool", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="sticky" />);
    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  it("does not show Note label for non-sticky tools", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.queryByText("Note")).not.toBeInTheDocument();
  });

  it("shows Fill label for fill-compatible tools", () => {
    render(
      <WhiteboardProperties {...defaultProps} activeTool="rectangle" />
    );
    expect(screen.getByText("Fill")).toBeInTheDocument();
  });

  it("does not show Fill label for non-fill tools", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.queryByText("Fill")).not.toBeInTheDocument();
  });

  it("shows stroke width buttons with title attributes", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="pen" />);
    expect(screen.getByTitle("2px")).toBeInTheDocument();
    expect(screen.getByTitle("4px")).toBeInTheDocument();
    expect(screen.getByTitle("6px")).toBeInTheDocument();
    expect(screen.getByTitle("8px")).toBeInTheDocument();
    expect(screen.getByTitle("12px")).toBeInTheDocument();
  });

  it("shows font size buttons for text tool", () => {
    render(<WhiteboardProperties {...defaultProps} activeTool="text" />);
    expect(screen.getByTitle("12px")).toBeInTheDocument();
    expect(screen.getByTitle("16px")).toBeInTheDocument();
    expect(screen.getByTitle("20px")).toBeInTheDocument();
    expect(screen.getByTitle("28px")).toBeInTheDocument();
    expect(screen.getByTitle("36px")).toBeInTheDocument();
  });

  it("calls onStrokeWidthChange when a stroke width is clicked", async () => {
    const user = userEvent.setup();
    const onStrokeWidthChange = vi.fn();
    render(
      <WhiteboardProperties
        {...defaultProps}
        activeTool="pen"
        onStrokeWidthChange={onStrokeWidthChange}
      />
    );
    await user.click(screen.getByTitle("4px"));
    expect(onStrokeWidthChange).toHaveBeenCalledWith(4);
  });

  it("calls onFontSizeChange when a font size is clicked", async () => {
    const user = userEvent.setup();
    const onFontSizeChange = vi.fn();
    render(
      <WhiteboardProperties
        {...defaultProps}
        activeTool="text"
        onFontSizeChange={onFontSizeChange}
      />
    );
    await user.click(screen.getByTitle("28px"));
    expect(onFontSizeChange).toHaveBeenCalledWith(28);
  });
});
