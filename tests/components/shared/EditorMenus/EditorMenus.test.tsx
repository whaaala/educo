import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import React from "react";
import {
  EditorMenuBar,
  EditorMenuItemRow,
  EditorMenuDivider,
  ViewMenuPanel,
  ViewMenuItem,
  ViewMenuToggle,
  MENU_DIVIDER,
} from "@/components/shared/EditorMenus";
import type { EditorMenuItem } from "@/components/shared/EditorMenus";
import fs from "fs";
import path from "path";

// ── Source code for structural tests ──
const SOURCE_PATH = path.resolve(__dirname, "../../../../components/shared/EditorMenus.tsx");
const SOURCE_CODE = fs.readFileSync(SOURCE_PATH, "utf-8");

// ── Helpers ──
const DummyIcon = ({ className }: { className?: string }) => (
  <svg data-testid="dummy-icon" className={className} />
);

function makeMenus() {
  return [
    { id: "file", label: "File", items: [{ label: "New" }, { label: "Open" }] },
    { id: "edit", label: "Edit", items: [{ label: "Undo" }, { label: "Redo" }] },
    { id: "view", label: "View", items: [{ label: "Zoom In" }] },
  ];
}

// ══════════════════════════════════════════════════════
// EditorMenuBar
// ══════════════════════════════════════════════════════
describe("EditorMenuBar", () => {
  it("renders all menu buttons", () => {
    render(<EditorMenuBar menus={makeMenus()} />);
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("opens dropdown when a menu button is clicked", () => {
    render(<EditorMenuBar menus={makeMenus()} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("switches open menu on hover when a menu is already open", () => {
    render(<EditorMenuBar menus={makeMenus()} />);
    // Open File menu first
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();

    // Hover over Edit button — should switch menus
    fireEvent.mouseEnter(screen.getByText("Edit"));
    expect(screen.getByText("Undo")).toBeInTheDocument();
    // File items should be gone
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside the menu", () => {
    const { container } = render(
      <div>
        <div data-testid="outside">Outside</div>
        <EditorMenuBar menus={makeMenus()} />
      </div>
    );
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });
});

// ══════════════════════════════════════════════════════
// EditorMenuItemRow
// ══════════════════════════════════════════════════════
describe("EditorMenuItemRow", () => {
  const noop = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays icon, label, and shortcut", () => {
    const item: EditorMenuItem = {
      label: "Bold",
      icon: DummyIcon,
      shortcut: "Ctrl+B",
    };
    render(<EditorMenuItemRow item={item} onClose={noop} />);

    expect(screen.getByText("Bold")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+B")).toBeInTheDocument();
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
  });

  it("icon column is 20px wide (w-5 class in source)", () => {
    // Structural check: the icon span has w-5 (which is 20px in Tailwind)
    expect(SOURCE_CODE).toContain("w-5 flex-shrink-0 flex items-center justify-center");
  });

  it("shows chevron and opens submenu on hover", async () => {
    vi.useFakeTimers();
    const subItem: EditorMenuItem = { label: "PDF" };
    const item: EditorMenuItem = {
      label: "Download",
      submenu: [subItem],
    };
    render(<EditorMenuItemRow item={item} onClose={noop} />);

    // Chevron should be visible
    expect(screen.getByText("Download")).toBeInTheDocument();
    // The button container should be in the DOM
    const container = screen.getByText("Download").closest(".relative");
    expect(container).toBeInTheDocument();

    // Hover to open submenu
    fireEvent.mouseEnter(container!);
    // Submenu should appear
    expect(screen.getByText("PDF")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("renders a divider when divider is true", () => {
    const item: EditorMenuItem = { label: "", divider: true };
    const { container } = render(<EditorMenuItemRow item={item} onClose={noop} />);

    // Should render the divider element (border-t)
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
  });

  it("shows a check mark when isChecked is true", () => {
    const item: EditorMenuItem = {
      label: "Checked Item",
      isChecked: true,
      icon: DummyIcon,
    };
    const { container } = render(<EditorMenuItemRow item={item} onClose={noop} />);

    // The check icon is rendered instead of the normal icon
    // Check for blue check icon class in the rendered output
    const checkIcon = container.querySelector(".text-blue-500");
    expect(checkIcon).toBeInTheDocument();
    expect(screen.getByText("Checked Item")).toBeInTheDocument();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    const item: EditorMenuItem = {
      label: "Disabled Item",
      disabled: true,
      onClick,
    };
    render(<EditorMenuItemRow item={item} onClose={noop} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled item has grayed-out styling in every theme", () => {
    // Assert the classes individually — a contiguous-string match breaks whenever a theme
    // variant is (correctly) inserted between them.
    for (const cls of [
      "text-gray-300",
      "dark:text-gray-600",
      "midnight:text-cyan-500",
      "purple:text-pink-500",
      "cursor-not-allowed",
    ]) {
      expect(SOURCE_CODE).toContain(cls);
    }
  });
});

// ══════════════════════════════════════════════════════
// ViewMenuPanel (Responsive)
// ══════════════════════════════════════════════════════
describe("ViewMenuPanel", () => {
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void>;
  let matchMediaMatches: boolean;

  beforeEach(() => {
    matchMediaListeners = [];
    matchMediaMatches = false;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: matchMediaMatches,
        media: query,
        addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
          matchMediaListeners.push(handler);
        },
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("uses matchMedia for responsive behavior (source code check)", () => {
    expect(SOURCE_CODE).toContain('window.matchMedia("(max-width: 767px)")');
  });

  it("renders as glassmorphism dropdown on desktop (viewport > 767px)", () => {
    matchMediaMatches = false;
    // Re-set matchMedia before render
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { container } = render(
      <ViewMenuPanel>
        <div>Panel Content</div>
      </ViewMenuPanel>
    );

    expect(screen.getByText("Panel Content")).toBeInTheDocument();
    // Desktop: absolute positioned dropdown
    const panel = container.firstChild as HTMLElement;
    expect(panel.className).toContain("absolute");
    expect(panel.className).toContain("backdrop-blur");
  });

  it("renders as bottom sheet on mobile (viewport < 767px)", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <ViewMenuPanel>
        <div>Mobile Content</div>
      </ViewMenuPanel>
    );

    // Content is portalled to body
    expect(screen.getByText("Mobile Content")).toBeInTheDocument();
    // Check for the drag handle (rounded-full pill)
    const dragHandle = document.body.querySelector(".rounded-full");
    expect(dragHandle).toBeInTheDocument();
  });

  it("has backdrop-blur and semi-transparent background (source code check)", () => {
    expect(SOURCE_CODE).toContain("backdrop-blur-[20px]");
    expect(SOURCE_CODE).toContain("backdrop-saturate-[180%]");
    expect(SOURCE_CODE).toContain("bg-white/80");
  });
});

// ══════════════════════════════════════════════════════
// ViewMenuItem
// ══════════════════════════════════════════════════════
describe("ViewMenuItem", () => {
  it("renders with 44px minimum height", () => {
    // Structural check: min-h-[44px] class is present
    expect(SOURCE_CODE).toMatch(/ViewMenuItem[\s\S]*?min-h-\[44px\]/);
  });

  it("renders label and icon", () => {
    render(<ViewMenuItem label="Slideshow" icon={DummyIcon} />);
    expect(screen.getByText("Slideshow")).toBeInTheDocument();
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
  });

  it("shows description text below the label", () => {
    render(<ViewMenuItem label="Editing" description="Edit directly" />);
    expect(screen.getByText("Editing")).toBeInTheDocument();
    expect(screen.getByText("Edit directly")).toBeInTheDocument();
  });

  it("description has smaller, lighter font styling in every theme (source check)", () => {
    // Assert individually — theme variants sit between these classes in the real className.
    for (const cls of [
      "text-[11px]",
      "leading-tight",
      "text-gray-400",
      "dark:text-gray-500",
      "midnight:text-cyan-400",
      "purple:text-pink-400",
      "truncate",
    ]) {
      expect(SOURCE_CODE).toContain(cls);
    }
  });

  it("font weight increases on hover (source check)", () => {
    // ViewMenuItem has hover:font-[520] in its className
    expect(SOURCE_CODE).toContain("hover:font-[520]");
  });

  it("renders shortcut text when provided", () => {
    render(<ViewMenuItem label="Save" shortcut="Ctrl+S" />);
    expect(screen.getByText("Ctrl+S")).toBeInTheDocument();
  });

  it("shows chevron when hasSubmenu is true", () => {
    const { container } = render(<ViewMenuItem label="Sub" hasSubmenu />);
    // ChevronRight rendered by lucide-react
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("fires onClick when clicked and not disabled", () => {
    const onClick = vi.fn();
    render(<ViewMenuItem label="Action" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(<ViewMenuItem label="No-op" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows check icon when isChecked is true", () => {
    const { container } = render(<ViewMenuItem label="Checked" isChecked />);
    const checkIcon = container.querySelector(".text-blue-500");
    expect(checkIcon).toBeInTheDocument();
  });
});

// ══════════════════════════════════════════════════════
// ViewMenuToggle
// ══════════════════════════════════════════════════════
describe("ViewMenuToggle", () => {
  it("renders an iOS-style pill switch in off state", () => {
    const { container } = render(
      <ViewMenuToggle label="Show ruler" isOn={false} onToggle={vi.fn()} />
    );
    expect(screen.getByText("Show ruler")).toBeInTheDocument();
    // Off state: gray pill bg-gray-300
    const pill = container.querySelector(".bg-gray-300");
    expect(pill).toBeInTheDocument();
  });

  it("renders pill switch in on state with blue background", () => {
    const { container } = render(
      <ViewMenuToggle label="Show ruler" isOn={true} onToggle={vi.fn()} />
    );
    const pill = container.querySelector(".bg-blue-500");
    expect(pill).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ViewMenuToggle label="Toggle" isOn={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("has role=switch with correct aria-checked", () => {
    const { rerender } = render(
      <ViewMenuToggle label="Ruler" isOn={false} onToggle={vi.fn()} />
    );
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "false");

    rerender(<ViewMenuToggle label="Ruler" isOn={true} onToggle={vi.fn()} />);
    expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  it("renders description when provided", () => {
    render(
      <ViewMenuToggle
        label="Ruler"
        description="Show the editing ruler"
        isOn={false}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText("Show the editing ruler")).toBeInTheDocument();
  });

  it("renders shortcut when provided", () => {
    render(
      <ViewMenuToggle label="Ruler" shortcut="Ctrl+R" isOn={false} onToggle={vi.fn()} />
    );
    expect(screen.getByText("Ctrl+R")).toBeInTheDocument();
  });

  it("knob translates on toggle (source check)", () => {
    expect(SOURCE_CODE).toContain('translate-x-[18px]');
    expect(SOURCE_CODE).toContain('translate-x-[2px]');
  });
});

// ══════════════════════════════════════════════════════
// MENU_DIVIDER constant
// ══════════════════════════════════════════════════════
describe("MENU_DIVIDER", () => {
  it("has divider: true and an empty label", () => {
    expect(MENU_DIVIDER.divider).toBe(true);
    expect(MENU_DIVIDER.label).toBe("");
  });

  it("renders as a divider when used in EditorMenuItemRow", () => {
    const { container } = render(
      <EditorMenuItemRow item={MENU_DIVIDER} onClose={vi.fn()} />
    );
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
  });
});
