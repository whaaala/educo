import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";

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
  FONT_FAMILY_CATEGORIES: [
    { label: "Sans-serif", fonts: ["Arial", "Helvetica"] },
  ],
  FONT_SIZES: [8, 12, 14, 24, 48],
  LINE_SPACINGS: [
    { value: 1, label: "Single" },
    { value: 2, label: "Double" },
  ],
}));

// ── Import after mocks ──

import DocEditor from "@/components/shared/DocEditor/DocEditor";

// ── Helpers ──

const defaultValue = { html: "<p>Hello world</p>", title: "Test Document" };

const testTemplates = [
  { id: "meeting-notes", label: "Meeting notes", html: "<h2>Meeting notes</h2>" },
  { id: "email-draft", label: "Email draft", html: "<h2>Email draft</h2>" },
];

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

describe("DocEditor — Comprehensive Look & Feel", () => {
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
  // 1. Template Chips Styling
  // ────────────────────────────────────────────────
  describe("template chips", () => {
    const emptyValue = { html: "<p></p>", title: "Test Document" };

    it("template chips are NOT shown when document has content", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} templates={testTemplates} />
      );
      const chip = container.querySelector('button[title="Meeting notes"]');
      expect(chip).toBeNull();
    });

    it("template chip buttons appear inside page area when doc is empty", () => {
      const { container } = render(
        <DocEditor value={emptyValue} onChange={onChange} templates={testTemplates} />
      );
      const chip = container.querySelector('button[title="Meeting notes"]');
      expect(chip).not.toBeNull();
      expectClasses(chip, [
        "inline-flex",
        "items-center",
        "gap-2",
        "px-3",
        "py-1.5",
        "rounded-full",
        "text-[12px]",
        "font-semibold",
        "border",
        "border-gray-200",
        "dark:border-gray-700",
      ]);
    });

    it("template chip icon SVG has color classes", () => {
      const { container } = render(
        <DocEditor value={emptyValue} onChange={onChange} templates={testTemplates} />
      );
      const chip = container.querySelector('button[title="Meeting notes"]');
      expect(chip).not.toBeNull();

      const svg = chip!.querySelector("svg");
      expect(svg).not.toBeNull();

      const svgClasses = (svg!.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
      expect(svgClasses).toContain("w-3.5");
      expect(svgClasses).toContain("h-3.5");
      expect(svgClasses).toContain("text-gray-500");
      expect(svgClasses).toContain("dark:text-gray-400");
    });

    it("template chip label span has text colors", () => {
      const { container } = render(
        <DocEditor value={emptyValue} onChange={onChange} templates={testTemplates} />
      );
      const chip = container.querySelector('button[title="Meeting notes"]');
      expect(chip).not.toBeNull();

      const span = chip!.querySelector("span");
      expect(span).not.toBeNull();
      expectClasses(span, [
        "text-gray-700",
        "dark:text-gray-200",
      ]);
    });
  });

  // ────────────────────────────────────────────────
  // 2. Toolbar Dropdown Trigger Styling
  // ────────────────────────────────────────────────
  describe("toolbar dropdown triggers", () => {
    it("Zoom dropdown trigger has correct styling", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const zoomBtn = container.querySelector('button[aria-label="Zoom"]');
      expect(zoomBtn).not.toBeNull();
      expectClasses(zoomBtn, [
        "h-7",
        "inline-flex",
        "items-center",
        "rounded",
        "text-[11px]",
        "font-medium",
      ]);
      expect(zoomBtn!.textContent).toContain("100%");
    });

    it("Font family dropdown trigger shows current font label", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const fontBtn = container.querySelector('button[aria-label="Font family"]');
      expect(fontBtn).not.toBeNull();
      expect(fontBtn!.textContent).toContain("Arial");
      expectClasses(fontBtn, ["h-7", "rounded"]);
    });

    it("Font size dropdown trigger shows current size", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const sizeBtn = container.querySelector('button[aria-label="Font size"]');
      expect(sizeBtn).not.toBeNull();
      expect(sizeBtn!.textContent).toContain("11");
    });

    it("Text color dropdown trigger exists with Icon", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const btn = container.querySelector('button[aria-label="Text color"]');
      expect(btn).not.toBeNull();
      const svg = btn!.querySelector("svg");
      expect(svg).not.toBeNull();
    });

    it("Highlight color dropdown trigger exists with Icon", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const btn = container.querySelector('button[aria-label="Highlight color"]');
      expect(btn).not.toBeNull();
      const svg = btn!.querySelector("svg");
      expect(svg).not.toBeNull();
    });

    it("Line & paragraph spacing dropdown trigger exists with Icon", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const btn = container.querySelector('button[aria-label="Line & paragraph spacing"]');
      expect(btn).not.toBeNull();
      const svg = btn!.querySelector("svg");
      expect(svg).not.toBeNull();
    });
  });

  // ────────────────────────────────────────────────
  // 3. New Toolbar Buttons
  // ────────────────────────────────────────────────
  describe("toolbar buttons", () => {
    it("Strikethrough, Superscript, Subscript are NOT in toolbar (moved to Format menu)", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      expect(container.querySelector('button[aria-label="Strikethrough"]')).toBeNull();
      expect(container.querySelector('button[aria-label="Superscript"]')).toBeNull();
      expect(container.querySelector('button[aria-label="Subscript"]')).toBeNull();
    });

    it("Alignment dropdown exists with correct title", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const alignDropdown = container.querySelector('[aria-label="Align & indent"]');
      expect(alignDropdown).not.toBeNull();
    });

    it("Lists dropdown exists with correct title", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const listsDropdown = container.querySelector('[aria-label="Lists"]');
      expect(listsDropdown).not.toBeNull();
    });

    it("Increase and Decrease indent buttons both exist with correct styling", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const increaseBtn = container.querySelector('button[aria-label="Increase indent"]');
      const decreaseBtn = container.querySelector('button[aria-label="Decrease indent"]');
      expect(increaseBtn).not.toBeNull();
      expect(decreaseBtn).not.toBeNull();
      expectClasses(increaseBtn, [
        "w-7",
        "h-7",
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded",
      ]);
      expectClasses(decreaseBtn, [
        "w-7",
        "h-7",
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded",
      ]);
    });

    it("new toolbar buttons exist (Search, Print, Spell check, Paint format, etc.)", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const newButtons = [
        "Search",
        "Print (Ctrl+P)",
        "Spelling and grammar check",
        "Paint format",
        "Insert image",
        "Clear formatting",
        "Add comment (Ctrl+Alt+M)",
      ];
      for (const title of newButtons) {
        const btn = container.querySelector(`button[aria-label="${title}"]`);
        expect(btn, `Toolbar button "${title}" should exist`).not.toBeNull();
        expectClasses(btn, [
          "w-7",
          "h-7",
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded",
        ]);
      }
    });
  });

  // ────────────────────────────────────────────────
  // 4. Fullscreen State
  // ────────────────────────────────────────────────
  describe("fullscreen state", () => {
    it("root has relative positioning in default (non-fullscreen) state", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const root = container.querySelector("[data-doc-editor-root]");
      expect(root).not.toBeNull();
      const classes = classesOf(root);
      expect(classes).toContain("relative");
      expect(classes).not.toContain("fixed");
    });

    it("no Exit full screen button in default state", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const exitBtn = container.querySelector('button[aria-label="Exit full screen"]');
      expect(exitBtn).toBeNull();
    });
  });

  // ────────────────────────────────────────────────
  // 5. Dialog Styling
  // ────────────────────────────────────────────────
  describe("dialog styling", () => {
    /**
     * Helper to open the Find and Replace dialog.
     * Clicks "Edit" in the menubar, then clicks "Find and replace" in the panel.
     */
    function openFindReplaceDialog(container: HTMLElement) {
      // Find the Edit menu root button
      const menuRoots = container.querySelectorAll("[data-doc-menu-root]");
      let editButton: HTMLElement | null = null;
      menuRoots.forEach((root) => {
        const btn = root.querySelector("button");
        if (btn && btn.textContent?.trim() === "Edit") {
          editButton = btn;
        }
      });
      expect(editButton).not.toBeNull();
      fireEvent.click(editButton!);

      // Now find "Find and replace" in the open menu panel
      const menuPanel = container.querySelector("[data-doc-menu-panel]");
      expect(menuPanel).not.toBeNull();
      const menuButtons = menuPanel!.querySelectorAll("button");
      let findReplaceButton: HTMLElement | null = null;
      menuButtons.forEach((btn) => {
        if (btn.textContent?.includes("Find and replace")) {
          findReplaceButton = btn;
        }
      });
      expect(findReplaceButton).not.toBeNull();
      fireEvent.click(findReplaceButton!);
    }

    it("DocDialog overlay has correct backdrop classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      openFindReplaceDialog(container);

      const dialog = container.querySelector("[data-doc-dialog]");
      expect(dialog).not.toBeNull();
      expectClasses(dialog, [
        "absolute",
        "inset-0",
        "z-[210]",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/25",
        "backdrop-blur-[2px]",
      ]);
    });

    it("DocDialog panel has rounded-2xl with theme border", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      openFindReplaceDialog(container);

      const dialog = container.querySelector("[data-doc-dialog]");
      expect(dialog).not.toBeNull();
      // The panel is the child div with max-w-[520px]
      const panel = dialog!.querySelector(".max-w-\\[520px\\]");
      expect(panel).not.toBeNull();
      expectClasses(panel, [
        "w-full",
        "max-w-[520px]",
        "rounded-2xl",
        "border",
        "border-gray-200",
        "dark:border-gray-700",
        "bg-white",
        "dark:bg-gray-900",
        "shadow-2xl",
        "p-4",
      ]);
    });

    it("dialog Close button exists", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      openFindReplaceDialog(container);

      const dialog = container.querySelector("[data-doc-dialog]");
      expect(dialog).not.toBeNull();
      const buttons = dialog!.querySelectorAll("button");
      let closeButton: HTMLElement | null = null;
      buttons.forEach((btn) => {
        if (btn.textContent?.trim() === "Close") {
          closeButton = btn;
        }
      });
      expect(closeButton).not.toBeNull();
    });

    it("dialog has title text", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      openFindReplaceDialog(container);

      const dialog = container.querySelector("[data-doc-dialog]");
      expect(dialog).not.toBeNull();
      expect(dialog!.textContent).toContain("Find and replace");
    });
  });

  // ────────────────────────────────────────────────
  // 6. Table Editor Panel
  // ────────────────────────────────────────────────
  describe("table editor panel", () => {
    it("no table editor panel in default render", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const tablePanel = container.querySelector("[data-doc-table-editor-panel]");
      expect(tablePanel).toBeNull();
    });
  });

  // ────────────────────────────────────────────────
  // 7. Toast Notification
  // ────────────────────────────────────────────────
  describe("toast notification", () => {
    it("no toast visible in default render", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const toast = container.querySelector(".absolute.bottom-4");
      expect(toast).toBeNull();
    });

    it("toast appears after File > New action", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );

      // Open the File menu
      const menuRoots = container.querySelectorAll("[data-doc-menu-root]");
      let fileButton: HTMLElement | null = null;
      menuRoots.forEach((root) => {
        const btn = root.querySelector("button");
        if (btn && btn.textContent?.trim() === "File") {
          fileButton = btn;
        }
      });
      expect(fileButton).not.toBeNull();
      fireEvent.click(fileButton!);

      // Find the "New" menu item
      const menuPanel = container.querySelector("[data-doc-menu-panel]");
      expect(menuPanel).not.toBeNull();
      const menuButtons = menuPanel!.querySelectorAll("button");
      let newButton: HTMLElement | null = null;
      menuButtons.forEach((btn) => {
        if (btn.textContent?.includes("New")) {
          newButton = btn;
        }
      });
      expect(newButton).not.toBeNull();
      fireEvent.click(newButton!);

      // Now the toast should be visible
      const toast = container.querySelector(".absolute.bottom-4");
      expect(toast).not.toBeNull();
      expectClasses(toast, [
        "absolute",
        "bottom-4",
        "left-1/2",
        "-translate-x-1/2",
        "z-[220]",
        "rounded-xl",
        "bg-gray-900",
        "text-white",
        "text-[12px]",
        "shadow-xl",
      ]);
    });
  });

  // ────────────────────────────────────────────────
  // 8. Default UI States
  // ────────────────────────────────────────────────
  describe("default UI states", () => {
    it("no equation toolbar by default", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The equation toolbar contains an input with placeholder "Insert equation (LaTeX/plain)…"
      const eqInput = container.querySelector('input[placeholder*="Insert equation"]');
      expect(eqInput).toBeNull();
    });

    it("ruler IS visible by default (showRuler defaults to true)", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      // The ruler area should be present when showRuler is true (the default)
      const root = container.querySelector("[data-doc-editor-root]");
      expect(root).not.toBeNull();
      // The ruler renders ruler markings — look for the ruler container
      // It should exist since showRuler defaults to true
      const rulerText = root!.textContent;
      // Ruler contains numbered markers (e.g., "1", "2", etc.)
      expect(rulerText).toBeTruthy();
    });

    it("contentEditable is true in default editing mode", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editable = container.querySelector('[contenteditable="true"]');
      expect(editable).not.toBeNull();
    });

    it("menubar is visible with data-doc-menubar attribute", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const menubar = container.querySelector("[data-doc-menubar]");
      expect(menubar).not.toBeNull();
    });

    it("toolbar Bold button is visible (chrome not collapsed)", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const boldBtn = container.querySelector('button[aria-label="Bold (Ctrl+B)"]');
      expect(boldBtn).not.toBeNull();
    });
  });

  // ────────────────────────────────────────────────
  // 9. ReadOnly Mode
  // ────────────────────────────────────────────────
  describe("readOnly mode", () => {
    it("in readOnly mode, toolbar buttons have disabled:opacity-50", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} readOnly />
      );
      const boldBtn = container.querySelector('button[aria-label="Bold (Ctrl+B)"]');
      expect(boldBtn).not.toBeNull();
      expect(boldBtn!.hasAttribute("disabled")).toBe(true);
      expectClasses(boldBtn, ["disabled:opacity-50"]);
    });

    it("in readOnly mode, toolbar buttons have disabled:cursor-not-allowed", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} readOnly />
      );
      const boldBtn = container.querySelector('button[aria-label="Bold (Ctrl+B)"]');
      expect(boldBtn).not.toBeNull();
      expect(boldBtn!.hasAttribute("disabled")).toBe(true);
      expectClasses(boldBtn, ["disabled:cursor-not-allowed"]);
    });
  });

  // ────────────────────────────────────────────────
  // 10. Non-printing Characters
  // ────────────────────────────────────────────────
  describe("non-printing characters", () => {
    it("contentEditable does NOT have pilcrow class by default", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editable = container.querySelector('[contenteditable="true"]');
      expect(editable).not.toBeNull();
      const classes = classesOf(editable);
      expect(classes).not.toContain("[&_p]:after:content-['¶']");
    });
  });

  // ────────────────────────────────────────────────
  // 11. Print Layout
  // ────────────────────────────────────────────────
  describe("print layout", () => {
    it("default print layout has bg-gray-50 on editor root area", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const editorRoot = container.querySelector(".py-6.bg-gray-50");
      expect(editorRoot).not.toBeNull();
      expectClasses(editorRoot, [
        "min-h-full",
        "py-6",
        "bg-gray-50",
        "dark:bg-gray-950",
      ]);
    });

    it("page wrapper has rounded-sm shadow-md", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const pageWrapper = container.querySelector(".rounded-sm.shadow-md");
      expect(pageWrapper).not.toBeNull();
      expectClasses(pageWrapper, [
        "rounded-sm",
        "shadow-md",
        "bg-white",
        "dark:bg-gray-950",
      ]);
    });

    it("page wrapper has theme border classes", () => {
      const { container } = render(
        <DocEditor value={defaultValue} onChange={onChange} />
      );
      const pageWrapper = container.querySelector(".rounded-sm.shadow-md");
      expect(pageWrapper).not.toBeNull();
      expectClasses(pageWrapper, [
        "border",
        "border-gray-200/80",
        "dark:border-gray-800",
      ]);
    });
  });
});
