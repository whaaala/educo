import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

// ── Module-level mocks (hoisted by vitest) ──

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

vi.mock("@/components/shared/ColorPalettePicker", () => ({
  ColorGrid: () => null,
  TabbedColorPalette: () => null,
  SOLID_COLORS: [],
  TEXT_COLORS_MATRIX: [],
  TEXT_GRADIENT_COLORS: [],
  GLOSSY_COLORS: [],
  BORDER_COLORS: [],
  CELL_BG_COLORS: [],
  colorToCSS: (c: string) => c,
}));

vi.mock("@/components/shared/Whiteboard/whiteboard-types", () => ({
  FONT_FAMILY_CATEGORIES: [],
  FONT_SIZES: [],
}));

// ── Import after mocks ──

import DocEditor from "@/components/shared/DocEditor/DocEditor";

// ── Helpers ──

const defaultValue = { html: "<p>Hello world</p>", title: "Test Document" };

/** Splits a className string into individual classes for checking. */
function classesOf(el: Element | null): string[] {
  if (!el) return [];
  const raw = el.getAttribute("class") ?? "";
  return raw.split(/\s+/).filter(Boolean);
}

/** Assert that every class in `expected` is present in the element's class list. */
function expectClasses(el: Element | null, expected: string[]) {
  const classes = classesOf(el);
  for (const cls of expected) {
    expect(classes, `Expected class "${cls}" on <${el?.tagName.toLowerCase()}>`).toContain(cls);
  }
}

// ── Test suite ──

describe("DocEditor — Visual / CSS", () => {
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();

    // Mock browser APIs that DocEditor uses internally
    // @ts-expect-error — execCommand is deprecated but used by the component
    document.execCommand = vi.fn();

    Object.defineProperty(window, "getSelection", {
      writable: true,
      value: vi.fn(() => ({
        rangeCount: 0,
        removeAllRanges: vi.fn(),
        getRangeAt: vi.fn(),
        addRange: vi.fn(),
        toString: () => "",
      })),
    });
  });

  // ────────────────────────────────────────────────
  // 1. Root container
  // ────────────────────────────────────────────────
  describe("root container", () => {
    it("has flex column layout with rounded border", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const root = container.querySelector("[data-doc-editor-root]");
      expect(root).not.toBeNull();
      expectClasses(root, [
        "flex",
        "flex-col",
        "w-full",
        "rounded-xl",
      ]);
    });

    it("has light and dark theme border classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const root = container.querySelector("[data-doc-editor-root]");
      expectClasses(root, [
        "border",
        "border-gray-200",
        "dark:border-gray-700",
        "midnight:border-cyan-500/20",
        "purple:border-pink-500/20",
      ]);
    });

    it("has theme background classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const root = container.querySelector("[data-doc-editor-root]");
      expectClasses(root, [
        "bg-white",
        "dark:bg-gray-900",
        "midnight:bg-[#0d1526]",
        "purple:bg-[#1f1035]",
      ]);
    });

    it("has shadow-sm class", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const root = container.querySelector("[data-doc-editor-root]");
      expectClasses(root, ["shadow-sm"]);
    });
  });

  // ────────────────────────────────────────────────
  // 2. Header row
  // ────────────────────────────────────────────────
  describe("header row", () => {
    it("has header theming with border-b and backdrop-blur", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The header row is a div with border-b that contains the title input
      const titleInput = container.querySelector('[aria-label="Document title"]');
      expect(titleInput).not.toBeNull();
      // Walk up to the header wrapper (has border-b and backdrop-blur)
      const headerRow = titleInput!.closest(".border-b");
      expect(headerRow).not.toBeNull();
      expectClasses(headerRow, [
        "px-4",
        "pt-3",
        "pb-2",
        "border-b",
        "border-gray-100",
        "dark:border-gray-800",
        "midnight:border-cyan-500/10",
        "purple:border-pink-500/10",
        "bg-white/70",
        "dark:bg-gray-900/40",
        "midnight:bg-[#0d1526]/60",
        "purple:bg-[#1f1035]/60",
        "backdrop-blur",
      ]);
    });

    it("doc icon has blue background with rounded-xl", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The doc icon is a div with w-9 h-9 inside the header
      const iconDiv = container.querySelector(".bg-blue-600.w-9.h-9");
      expect(iconDiv).not.toBeNull();
      expectClasses(iconDiv, [
        "w-9",
        "h-9",
        "rounded-xl",
        "bg-blue-600",
        "flex",
        "items-center",
        "justify-center",
        "text-white",
        "shadow-sm",
      ]);
    });

    it("title input has transparent background and theme text colors", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const titleInput = container.querySelector('[aria-label="Document title"]');
      expect(titleInput).not.toBeNull();
      expectClasses(titleInput, [
        "bg-transparent",
        "text-[18px]",
        "font-semibold",
        "text-gray-800",
        "dark:text-gray-100",
        "midnight:text-cyan-50",
        "purple:text-pink-50",
      ]);
    });
  });

  // ────────────────────────────────────────────────
  // 3. Menubar
  // ────────────────────────────────────────────────
  describe("menubar", () => {
    it("has theme text colors and proper font size", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const menubar = container.querySelector("[data-doc-menubar]");
      expect(menubar).not.toBeNull();
      expectClasses(menubar, [
        "text-[13px]",
        "text-gray-700",
        "dark:text-gray-200",
      ]);
    });

    it("menu root buttons have correct layout and hover classes when inactive", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // MenuRoot wraps each menu ("File", "Edit", etc.) in a div[data-doc-menu-root]
      const menuRoots = container.querySelectorAll("[data-doc-menu-root]");
      expect(menuRoots.length).toBeGreaterThanOrEqual(4); // File, Edit, View, Insert

      // Each menu root has a button child with px-2 py-1 styling
      const firstMenuButton = menuRoots[0]?.querySelector("button");
      expect(firstMenuButton).not.toBeNull();
      expectClasses(firstMenuButton, [
        "px-2",
        "py-1",
        "rounded-md",
        "transition-colors",
        "cursor-pointer",
      ]);

      // When no menu is open (default), the button should have inactive hover classes
      expectClasses(firstMenuButton, [
        "hover:bg-gray-100/70",
        "dark:hover:bg-gray-800/60",
        "midnight:hover:bg-cyan-500/8",
        "purple:hover:bg-pink-500/8",
      ]);
    });
  });

  // ────────────────────────────────────────────────
  // 4. Toolbar
  // ────────────────────────────────────────────────
  describe("toolbar", () => {
    it("toolbar buttons have theme borders and backgrounds", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const boldBtn = container.querySelector('[title="Bold"]');
      expect(boldBtn).not.toBeNull();
      expectClasses(boldBtn, [
        "w-8",
        "h-8",
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-lg",
        "border",
        "border-gray-200",
        "dark:border-gray-700",
        "midnight:border-cyan-500/20",
        "purple:border-pink-500/20",
        "bg-white/60",
        "dark:bg-gray-800/50",
        "midnight:bg-[#111827]/60",
        "purple:bg-[#2a1447]/60",
        "hover:bg-gray-50",
        "dark:hover:bg-gray-800",
        "midnight:hover:bg-cyan-500/10",
        "purple:hover:bg-pink-500/10",
        "transition-colors",
        "cursor-pointer",
      ]);
    });

    it("all standard toolbar buttons render with correct classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );

      const toolbarButtonTitles = [
        "Undo",
        "Redo",
        "Bold",
        "Italic",
        "Underline",
        "Bulleted list",
        "Numbered list",
        "Align left",
        "Align center",
        "Align right",
        "Insert link",
      ];

      for (const title of toolbarButtonTitles) {
        const btn = container.querySelector(`[title="${title}"]`);
        expect(btn, `Toolbar button "${title}" should exist`).not.toBeNull();
        expectClasses(btn, [
          "w-8",
          "h-8",
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-lg",
        ]);
      }
    });

    it("toolbar button icons have theme color classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const boldBtn = container.querySelector('[title="Bold"]');
      expect(boldBtn).not.toBeNull();

      // Icon is the first child SVG inside the button
      const iconSvg = boldBtn!.querySelector("svg");
      expect(iconSvg).not.toBeNull();

      // Lucide SVGs in jsdom: use getAttribute("class") instead of .className
      const iconClasses = (iconSvg!.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
      expect(iconClasses).toContain("w-4");
      expect(iconClasses).toContain("h-4");
      expect(iconClasses).toContain("text-gray-600");
      expect(iconClasses).toContain("dark:text-gray-200");
      expect(iconClasses).toContain("midnight:text-cyan-100");
      expect(iconClasses).toContain("purple:text-pink-100");
    });

    it("toolbar dividers have theme colors", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // ToolbarDivider is a div with w-px h-6 between toolbar groups
      // Find dividers in the toolbar area (inside px-3 pt-3 pb-2)
      const root = container.querySelector("[data-doc-editor-root]");
      expect(root).not.toBeNull();

      // ToolbarDividers are w-px h-6 divs with mx-1
      const dividers = root!.querySelectorAll(".w-px.h-6.mx-1");
      expect(dividers.length).toBeGreaterThanOrEqual(1);

      const firstDivider = dividers[0];
      expectClasses(firstDivider, [
        "w-px",
        "h-6",
        "bg-gray-200",
        "dark:bg-gray-700",
        "midnight:bg-cyan-500/15",
        "purple:bg-pink-500/15",
        "mx-1",
      ]);
    });

    it("heading button has theme styling with correct text size", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const headingBtn = container.querySelector('[title="Heading"]');
      expect(headingBtn).not.toBeNull();
      expectClasses(headingBtn, [
        "px-2.5",
        "h-8",
        "rounded-lg",
        "text-[11px]",
        "font-bold",
        "border",
        "border-gray-200",
        "dark:border-gray-700",
        "midnight:border-cyan-500/20",
        "purple:border-pink-500/20",
        "bg-white/60",
        "dark:bg-gray-800/50",
        "midnight:bg-[#111827]/60",
        "purple:bg-[#2a1447]/60",
        "hover:bg-gray-50",
        "dark:hover:bg-gray-800",
        "midnight:hover:bg-cyan-500/10",
        "purple:hover:bg-pink-500/10",
        "transition-colors",
        "cursor-pointer",
      ]);
      // Content should be "H"
      expect(headingBtn!.textContent?.trim()).toBe("H");
    });

    it("paragraph (Normal text) button has theme styling", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const paraBtn = container.querySelector('[title="Normal text"]');
      expect(paraBtn).not.toBeNull();
      expectClasses(paraBtn, [
        "px-2.5",
        "h-8",
        "rounded-lg",
        "text-[11px]",
        "font-bold",
        "border",
        "border-gray-200",
        "dark:border-gray-700",
        "midnight:border-cyan-500/20",
        "purple:border-pink-500/20",
        "bg-white/60",
        "dark:bg-gray-800/50",
        "midnight:bg-[#111827]/60",
        "purple:bg-[#2a1447]/60",
        "hover:bg-gray-50",
        "dark:hover:bg-gray-800",
        "midnight:hover:bg-cyan-500/10",
        "purple:hover:bg-pink-500/10",
        "transition-colors",
        "cursor-pointer",
      ]);
      // Content should be "P"
      expect(paraBtn!.textContent?.trim()).toBe("P");
    });
  });

  // ────────────────────────────────────────────────
  // 5. Page surface (editor area)
  // ────────────────────────────────────────────────
  describe("page surface", () => {
    it("editor area has print layout background (default showPrintLayout=true)", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The editor root div (ref=editorRootRef) wraps the pages.
      // It has the print-layout background classes when showPrintLayout is true (default).
      // Find the div with min-h-full and py-6 and bg-gray-50
      const editorRoot = container.querySelector(".py-6.bg-gray-50");
      expect(editorRoot).not.toBeNull();
      expectClasses(editorRoot, [
        "min-h-full",
        "py-6",
        "bg-gray-50",
        "dark:bg-gray-950",
        "midnight:bg-[#06101f]",
        "purple:bg-[#12061f]",
      ]);
    });

    it("page wrapper has theme backgrounds and borders with rounded shadow", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The page wrapper div has: w-full rounded-2xl shadow-md
      const pageWrapper = container.querySelector(".rounded-2xl.shadow-md");
      expect(pageWrapper).not.toBeNull();
      expectClasses(pageWrapper, [
        "w-full",
        "rounded-2xl",
        "shadow-md",
        "bg-white",
        "dark:bg-gray-950",
        "midnight:bg-[#0b1220]",
        "purple:bg-[#170a27]",
        "border",
        "border-gray-200/80",
        "dark:border-gray-800",
        "midnight:border-cyan-500/10",
        "purple:border-pink-500/10",
      ]);
    });

    it("content editable area has theme text colors", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The contentEditable div has outline-none overflow-hidden relative
      // and text-[14px] leading-6
      const editableArea = container.querySelector('[contenteditable="true"]');
      expect(editableArea).not.toBeNull();
      expectClasses(editableArea, [
        "outline-none",
        "overflow-hidden",
        "relative",
        "text-[14px]",
        "leading-6",
        "text-gray-800",
        "dark:text-gray-100",
        "midnight:text-cyan-50",
        "purple:text-pink-50",
      ]);
    });

    it("content editable area has theme selection colors", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editableArea = container.querySelector('[contenteditable="true"]');
      expect(editableArea).not.toBeNull();
      expectClasses(editableArea, [
        "selection:bg-blue-200/60",
        "dark:selection:bg-blue-500/25",
        "midnight:selection:bg-cyan-500/20",
        "purple:selection:bg-pink-500/20",
      ]);
    });

    it("content editable area has typography classes for headings and lists", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editableArea = container.querySelector('[contenteditable="true"]');
      expect(editableArea).not.toBeNull();
      expectClasses(editableArea, [
        "[&_h2]:text-[20px]",
        "[&_h2]:leading-7",
        "[&_h2]:font-bold",
        "[&_h2]:mt-6",
        "[&_h2]:mb-3",
        "[&_p]:my-2",
        "[&_ul]:list-disc",
        "[&_ul]:pl-6",
        "[&_ul]:my-3",
        "[&_ol]:list-decimal",
        "[&_ol]:pl-6",
        "[&_ol]:my-3",
      ]);
    });

    it("content editable area has link styling classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editableArea = container.querySelector('[contenteditable="true"]');
      expect(editableArea).not.toBeNull();
      expectClasses(editableArea, [
        "[&_a]:text-blue-600",
        "dark:[&_a]:text-blue-400",
        "[&_a]:underline",
      ]);
    });

    it("content editable area has cursor-text when editable", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editableArea = container.querySelector('[contenteditable="true"]');
      expect(editableArea).not.toBeNull();
      expectClasses(editableArea, ["cursor-text"]);
    });
  });
});
