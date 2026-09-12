import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ConvertToVideoDialog from "@/components/shared/ConvertToVideoDialog";
import WhiteboardToolbar from "@/components/shared/Whiteboard/WhiteboardToolbar";

/**
 * A COMPONENT MUST SURVIVE ITS OWN TOGGLE.
 *
 * Both of these called a hook AFTER an early return — `useRef` after `if (!isOpen) return null`, and
 * `useCallback` after `if (readOnly) return null`. React compares hook COUNT against the previous render, so
 * the first render that takes the other branch throws "Rendered more hooks than during the previous render"
 * and the screen goes blank.
 *
 * Neither crashed in practice, and that is exactly what made them dangerous: the one caller mounted the
 * dialog conditionally and passed `isOpen={true}`, so the early return never ran. The bug was waiting for
 * someone to do the obvious thing and keep the component mounted while toggling the prop.
 *
 * `react-hooks/rules-of-hooks` catches the PATTERN anywhere in the repo, which is the stronger net. These
 * assert the SYMPTOM is gone — that the components actually withstand the toggle — which is the thing a
 * reader of the fix would want to know.
 */

const slides = [
  { id: "s1", content: "<h1>Welcome</h1>", background: "#ffffff" },
  { id: "s2", content: "<h1>Term dates</h1>", background: "#ffffff" },
];

const toolbarProps = {
  activeTool: "select" as const,
  onToolChange: vi.fn(),
  activeColor: "#111827",
  activeStrokeWidth: 2,
  activeFillColor: null,
  activeFontSize: 16,
  activeStickyColor: "#fef08a",
  activeFontFamily: "Inter" as const,
  activeFontWeight: "normal" as const,
  activeFontStyle: "normal" as const,
  activeTextDecoration: "none" as const,
  activeTextAlign: "left" as const,
  activeLineSpacing: 1.2,
  activeStrokeDash: "solid" as const,
  onColorChange: vi.fn(),
  onStrokeWidthChange: vi.fn(),
  onFillColorChange: vi.fn(),
  onFontSizeChange: vi.fn(),
  onStickyColorChange: vi.fn(),
  onFontFamilyChange: vi.fn(),
  onFontWeightToggle: vi.fn(),
  onFontStyleToggle: vi.fn(),
  onTextDecorationToggle: vi.fn(),
  onTextAlignChange: vi.fn(),
  onLineSpacingChange: vi.fn(),
  onStrokeDashChange: vi.fn(),
};

afterEach(cleanup);

describe("hook order survives a prop toggle", () => {
  it("ConvertToVideoDialog can be opened while it stays mounted", () => {
    const props = {
      onClose: vi.fn(), title: "Autumn assembly", slides,
      activeSlideIndex: 0, totalSlides: slides.length,
    };
    // Closed first — this is the render that takes the early return.
    const { rerender, queryByText } = render(<ConvertToVideoDialog isOpen={false} {...props} />);
    expect(queryByText(/Autumn assembly/i)).toBeNull();

    // …then opened, WITHOUT remounting. A hook below the early return would throw here.
    expect(() => rerender(<ConvertToVideoDialog isOpen {...props} />)).not.toThrow();
    expect(document.body.textContent).toContain("Autumn assembly");

    // …and closed again, which is the other direction of the same fault.
    expect(() => rerender(<ConvertToVideoDialog isOpen={false} {...props} />)).not.toThrow();
  });

  it("WhiteboardToolbar can be un-read-only while it stays mounted", () => {
    const { rerender, container } = render(<WhiteboardToolbar {...toolbarProps} readOnly />);
    expect(container.firstChild, "read-only renders nothing").toBeNull();

    expect(() => rerender(<WhiteboardToolbar {...toolbarProps} readOnly={false} />)).not.toThrow();
    expect(container.firstChild, "and then renders the toolbar").not.toBeNull();

    expect(() => rerender(<WhiteboardToolbar {...toolbarProps} readOnly />)).not.toThrow();
  });
});
