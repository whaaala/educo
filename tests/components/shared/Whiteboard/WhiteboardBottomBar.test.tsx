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

describe("WhiteboardBottomBar", () => {
  it("renders undo and redo buttons", () => {
    render(<WhiteboardBottomBar {...defaultProps} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)")).toBeInTheDocument();
    expect(screen.getByTitle("Redo (Ctrl+Y)")).toBeInTheDocument();
  });

  it("disables undo when canUndo is false", () => {
    render(<WhiteboardBottomBar {...defaultProps} canUndo={false} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)")).toBeDisabled();
  });

  it("disables redo when canRedo is false", () => {
    render(<WhiteboardBottomBar {...defaultProps} canRedo={false} />);
    expect(screen.getByTitle("Redo (Ctrl+Y)")).toBeDisabled();
  });

  it("calls onUndo when undo button is clicked", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<WhiteboardBottomBar {...defaultProps} onUndo={onUndo} />);
    await user.click(screen.getByTitle("Undo (Ctrl+Z)"));
    expect(onUndo).toHaveBeenCalled();
  });

  it("calls onRedo when redo button is clicked", async () => {
    const user = userEvent.setup();
    const onRedo = vi.fn();
    render(<WhiteboardBottomBar {...defaultProps} onRedo={onRedo} />);
    await user.click(screen.getByTitle("Redo (Ctrl+Y)"));
    expect(onRedo).toHaveBeenCalled();
  });

  it("displays current zoom percentage", () => {
    render(
      <WhiteboardBottomBar
        {...defaultProps}
        viewport={{ x: 0, y: 0, zoom: 1.5 }}
      />
    );
    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  it("calls onZoomIn when zoom in button is clicked", async () => {
    const user = userEvent.setup();
    const onZoomIn = vi.fn();
    render(<WhiteboardBottomBar {...defaultProps} onZoomIn={onZoomIn} />);
    await user.click(screen.getByTitle("Zoom in"));
    expect(onZoomIn).toHaveBeenCalled();
  });

  it("calls onZoomOut when zoom out button is clicked", async () => {
    const user = userEvent.setup();
    const onZoomOut = vi.fn();
    render(<WhiteboardBottomBar {...defaultProps} onZoomOut={onZoomOut} />);
    await user.click(screen.getByTitle("Zoom out"));
    expect(onZoomOut).toHaveBeenCalled();
  });

  it("disables zoom out at minimum zoom", () => {
    render(
      <WhiteboardBottomBar
        {...defaultProps}
        viewport={{ x: 0, y: 0, zoom: 0.1 }}
      />
    );
    expect(screen.getByTitle("Zoom out")).toBeDisabled();
  });

  it("disables zoom in at maximum zoom", () => {
    render(
      <WhiteboardBottomBar
        {...defaultProps}
        viewport={{ x: 0, y: 0, zoom: 5 }}
      />
    );
    expect(screen.getByTitle("Zoom in")).toBeDisabled();
  });

  it("calls onFitToScreen when fit button is clicked", async () => {
    const user = userEvent.setup();
    const onFitToScreen = vi.fn();
    render(
      <WhiteboardBottomBar
        {...defaultProps}
        onFitToScreen={onFitToScreen}
      />
    );
    // Two "Fit to screen" buttons: zoom percentage + maximize icon; click the first
    const fitButtons = screen.getAllByTitle("Fit to screen");
    await user.click(fitButtons[0]);
    expect(onFitToScreen).toHaveBeenCalled();
  });

  it("shows clear all button", () => {
    render(<WhiteboardBottomBar {...defaultProps} />);
    expect(screen.getByTitle("Clear all")).toBeInTheDocument();
  });

  it("shows confirmation dialog when clear all is clicked", async () => {
    const user = userEvent.setup();
    render(<WhiteboardBottomBar {...defaultProps} />);
    await user.click(screen.getByTitle("Clear all"));
    expect(screen.getByText("Clear all elements?")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("calls onClearAll when clear is confirmed", async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    render(<WhiteboardBottomBar {...defaultProps} onClearAll={onClearAll} />);
    await user.click(screen.getByTitle("Clear all"));
    await user.click(screen.getByText("Clear"));
    expect(onClearAll).toHaveBeenCalled();
  });

  it("dismisses confirmation when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<WhiteboardBottomBar {...defaultProps} />);
    await user.click(screen.getByTitle("Clear all"));
    expect(screen.getByText("Clear all elements?")).toBeInTheDocument();
    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Clear all elements?")).not.toBeInTheDocument();
  });

  it("hides undo/redo and clear when readOnly", () => {
    render(<WhiteboardBottomBar {...defaultProps} readOnly />);
    expect(screen.queryByTitle("Undo (Ctrl+Z)")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Redo (Ctrl+Y)")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Clear all")).not.toBeInTheDocument();
  });

  it("still shows zoom controls when readOnly", () => {
    render(<WhiteboardBottomBar {...defaultProps} readOnly />);
    expect(screen.getByTitle("Zoom in")).toBeInTheDocument();
    expect(screen.getByTitle("Zoom out")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
