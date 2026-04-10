import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";

// ── Module-level mocks (hoisted by vitest) ──

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

// ── Import after mocks ──

import {
  ToolbarButton,
  ToolbarDivider,
  ToolbarDropdown,
} from "@/components/shared/EditorToolbar";

// ── Source code for structural verification ──

const SOURCE_PATH = path.resolve(
  __dirname,
  "../../../../components/shared/EditorToolbar.tsx"
);
const source = fs.readFileSync(SOURCE_PATH, "utf-8");

// ── Helpers ──

const DummyIcon = ({ className }: { className?: string }) => (
  <svg data-testid="dummy-icon" className={className} />
);

// ═══════════════════════════════════════════════════
// ToolbarButton
// ═══════════════════════════════════════════════════

describe("ToolbarButton", () => {
  // Scenario: ToolbarButton renders with icon and tooltip
  describe("renders with icon and tooltip", () => {
    it("should render the icon inside the button", () => {
      const { getByRole, getByTestId } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold (Ctrl+B)"
          onClick={() => {}}
        />
      );
      const button = getByRole("button", { name: "Bold (Ctrl+B)" });
      expect(button).toBeDefined();
      expect(getByTestId("dummy-icon")).toBeDefined();
    });

    it("should have the correct aria-label matching the title", () => {
      const { getByRole } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold (Ctrl+B)"
          onClick={() => {}}
        />
      );
      const button = getByRole("button", { name: "Bold (Ctrl+B)" });
      expect(button.getAttribute("aria-label")).toBe("Bold (Ctrl+B)");
    });

    it("should wrap the button in a Tooltip component (structural)", () => {
      expect(source).toContain("<Tooltip content={title}");
    });
  });

  // Scenario: ToolbarButton active state shows blue highlight
  describe("active state shows blue highlight", () => {
    it("should apply blue background classes when active is true", () => {
      const { getByRole } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold"
          onClick={() => {}}
          active={true}
        />
      );
      const button = getByRole("button", { name: "Bold" });
      expect(button.className).toContain("bg-blue-100");
      expect(button.className).toContain("ring-1");
      expect(button.className).toContain("ring-blue-400");
    });

    it("should apply blue text color to the icon when active", () => {
      const { getByTestId } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold"
          onClick={() => {}}
          active={true}
        />
      );
      const icon = getByTestId("dummy-icon");
      // SVG elements in jsdom use SVGAnimatedString for className;
      // getAttribute("class") reliably returns the string value.
      const cls = icon.getAttribute("class") ?? "";
      expect(cls).toContain("text-blue-600");
    });

    it("should also include dark mode blue classes when active (structural)", () => {
      expect(source).toContain("dark:bg-blue-900/40");
      expect(source).toContain("dark:text-blue-400");
    });

    it("should NOT apply blue background classes when active is false", () => {
      const { getByRole } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold"
          onClick={() => {}}
          active={false}
        />
      );
      const button = getByRole("button", { name: "Bold" });
      expect(button.className).not.toContain("bg-blue-100");
    });
  });

  // Scenario: ToolbarButton disabled state prevents interaction
  describe("disabled state prevents interaction", () => {
    it("should not fire onClick when disabled", () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold"
          onClick={handleClick}
          disabled={true}
        />
      );
      fireEvent.click(getByRole("button", { name: "Bold" }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should set the disabled attribute on the button element", () => {
      const { getByRole } = render(
        <ToolbarButton
          Icon={DummyIcon}
          title="Bold"
          onClick={() => {}}
          disabled={true}
        />
      );
      const button = getByRole("button", { name: "Bold" }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it("should have reduced opacity styling for disabled state (structural)", () => {
      expect(source).toContain("disabled:opacity-50");
      expect(source).toContain("disabled:cursor-not-allowed");
    });
  });
});

// ═══════════════════════════════════════════════════
// ToolbarDivider
// ═══════════════════════════════════════════════════

describe("ToolbarDivider", () => {
  // Scenario: ToolbarDivider renders as a vertical line
  describe("renders as a vertical line", () => {
    it("should render a div element", () => {
      const { container } = render(<ToolbarDivider />);
      const div = container.firstChild as HTMLElement;
      expect(div).toBeDefined();
      expect(div.tagName).toBe("DIV");
    });

    it("should have 1px width class for the vertical line", () => {
      const { container } = render(<ToolbarDivider />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).toContain("w-px");
    });

    it("should have height of h-5 (20px) and gray background", () => {
      const { container } = render(<ToolbarDivider />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).toContain("h-5");
      expect(div.className).toContain("bg-gray-300");
    });

    it("should include theme variant divider colors (structural)", () => {
      expect(source).toContain("dark:bg-[#2a2d35]");
      expect(source).toContain("midnight:bg-cyan-500/15");
      expect(source).toContain("purple:bg-pink-500/15");
    });
  });
});

// ═══════════════════════════════════════════════════
// ToolbarDropdown
// ═══════════════════════════════════════════════════

describe("ToolbarDropdown", () => {
  let onToggle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onToggle = vi.fn();
  });

  // Scenario: ToolbarDropdown opens panel on click
  describe("opens panel on click", () => {
    it("should call onToggle when the dropdown button is clicked", () => {
      const { getByRole } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={false}
          onToggle={onToggle}
        >
          <div>Menu content</div>
        </ToolbarDropdown>
      );
      fireEvent.click(getByRole("button", { name: "Font Family" }));
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should render children content when isOpen is true", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={true}
          onToggle={onToggle}
        >
          <div>Menu content</div>
        </ToolbarDropdown>
      );
      expect(getByText("Menu content")).toBeDefined();
    });

    it("should NOT render children content when isOpen is false", () => {
      const { queryByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={false}
          onToggle={onToggle}
        >
          <div>Menu content</div>
        </ToolbarDropdown>
      );
      expect(queryByText("Menu content")).toBeNull();
    });

    it("should have glassmorphism styling on the dropdown panel (structural)", () => {
      expect(source).toContain("backdrop-blur-xl");
      expect(source).toContain("bg-white/95");
      expect(source).toContain("shadow-xl");
      expect(source).toContain("rounded-xl");
    });

    it("should render the label text and chevron icon", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={false}
          onToggle={onToggle}
        >
          <div>Content</div>
        </ToolbarDropdown>
      );
      expect(getByText("Font")).toBeDefined();
    });

    it("should render the optional Icon when provided", () => {
      const { getByTestId } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          Icon={DummyIcon}
          isOpen={false}
          onToggle={onToggle}
        >
          <div>Content</div>
        </ToolbarDropdown>
      );
      expect(getByTestId("dummy-icon")).toBeDefined();
    });
  });

  // Scenario: ToolbarDropdown closes on outside click
  describe("closes on outside click", () => {
    it("should call onToggle when clicking outside the dropdown", () => {
      const { container } = render(
        <div>
          <ToolbarDropdown
            label="Font"
            title="Font Family"
            isOpen={true}
            onToggle={onToggle}
          >
            <div>Menu content</div>
          </ToolbarDropdown>
          <div data-testid="outside">Outside area</div>
        </div>
      );
      // Simulate mousedown outside the dropdown
      fireEvent.mouseDown(document.body);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should NOT call onToggle when clicking inside the dropdown", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={true}
          onToggle={onToggle}
        >
          <div>Menu content</div>
        </ToolbarDropdown>
      );
      fireEvent.mouseDown(getByText("Menu content"));
      expect(onToggle).not.toHaveBeenCalled();
    });

    it("should NOT close when isPickerOpen returns true", () => {
      const isPickerOpen = () => true;
      render(
        <div>
          <ToolbarDropdown
            label="Font"
            title="Font Family"
            isOpen={true}
            onToggle={onToggle}
            isPickerOpen={isPickerOpen}
          >
            <div>Menu content</div>
          </ToolbarDropdown>
          <div data-testid="outside">Outside area</div>
        </div>
      );
      fireEvent.mouseDown(document.body);
      expect(onToggle).not.toHaveBeenCalled();
    });

    it("should register and clean up mousedown listener (structural)", () => {
      expect(source).toContain('document.addEventListener("mousedown"');
      expect(source).toContain('document.removeEventListener("mousedown"');
    });
  });

  // Scenario: ToolbarDropdown respects alignment prop
  describe("respects alignment prop", () => {
    it("should apply right-0 class when align is 'right'", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={true}
          onToggle={onToggle}
          align="right"
        >
          <div>Panel content</div>
        </ToolbarDropdown>
      );
      const panel = getByText("Panel content").parentElement as HTMLElement;
      expect(panel.className).toContain("right-0");
      expect(panel.className).not.toContain("left-0");
    });

    it("should apply left-0 class when align is 'left' (default)", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={true}
          onToggle={onToggle}
          align="left"
        >
          <div>Panel content</div>
        </ToolbarDropdown>
      );
      const panel = getByText("Panel content").parentElement as HTMLElement;
      expect(panel.className).toContain("left-0");
      expect(panel.className).not.toContain("right-0");
    });

    it("should default to left alignment when align is not provided", () => {
      const { getByText } = render(
        <ToolbarDropdown
          label="Font"
          title="Font Family"
          isOpen={true}
          onToggle={onToggle}
        >
          <div>Panel content</div>
        </ToolbarDropdown>
      );
      const panel = getByText("Panel content").parentElement as HTMLElement;
      expect(panel.className).toContain("left-0");
    });
  });
});
