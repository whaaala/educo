import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import FloatingTextToolbar from "@/components/shared/Whiteboard/FloatingTextToolbar";
import type { WhiteboardElement, Viewport } from "@/components/shared/Whiteboard/whiteboard-types";

function makeTextElement(
  overrides: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: "text-1",
    type: "text",
    x: 100,
    y: 100,
    width: 200,
    height: 30,
    text: "Hello",
    color: "#000000",
    strokeWidth: 1,
    opacity: 1,
    ...overrides,
  };
}

const defaultProps = {
  element: makeTextElement(),
  viewport: { x: 0, y: 0, zoom: 1 } as Viewport,
  activeFontFamily: "Inter" as const,
  activeFontSize: 16,
  activeFontWeight: "normal" as const,
  activeFontStyle: "normal" as const,
  activeTextDecoration: "none" as const,
  activeTextAlign: "left" as const,
  onFontFamilyChange: vi.fn(),
  onFontSizeChange: vi.fn(),
  onFontWeightToggle: vi.fn(),
  onFontStyleToggle: vi.fn(),
  onTextDecorationToggle: vi.fn(),
  onTextAlignChange: vi.fn(),
};

describe("FloatingTextToolbar", () => {
  it("renders without crashing", () => {
    const { container } = render(<FloatingTextToolbar {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("returns null when element has no bounding box", () => {
    const el = makeTextElement({ x: undefined, y: undefined });
    const { container } = render(
      <FloatingTextToolbar {...defaultProps} element={el} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("positions toolbar based on element position and viewport", () => {
    const { container } = render(<FloatingTextToolbar {...defaultProps} />);
    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toBeTruthy();
    expect(toolbar.style.transform).toBe("translateX(-50%)");
  });

  it("uses viewport zoom for positioning", () => {
    const viewport = { x: 50, y: 30, zoom: 2 } as Viewport;
    const { container } = render(
      <FloatingTextToolbar {...defaultProps} viewport={viewport} />
    );
    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toBeTruthy();
    // Toolbar should be positioned (element center * zoom + viewport.x)
    const left = parseFloat(toolbar.style.left);
    expect(left).toBeGreaterThan(0);
  });

  it("stops event propagation on pointerDown and mouseDown", () => {
    const { container } = render(<FloatingTextToolbar {...defaultProps} />);
    const toolbar = container.firstChild as HTMLElement;
    const pointerEvent = new Event("pointerdown", { bubbles: true });
    const stopSpy = vi.spyOn(pointerEvent, "stopPropagation");
    toolbar.dispatchEvent(pointerEvent);
    expect(stopSpy).toHaveBeenCalled();
  });
});
