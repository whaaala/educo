import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const menuBarSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideMenuBar.tsx"),
  "utf-8"
);

const fileMenuSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/EditorFileMenu.tsx"),
  "utf-8"
);

const editorMenusSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/EditorMenus.tsx"),
  "utf-8"
);

const editMenuSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/EditorEditMenu.tsx"),
  "utf-8"
);

const viewMenuSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/EditorViewMenu.tsx"),
  "utf-8"
);

// Combined source for checking items that span multiple files
const combinedMenuSource = menuBarSource + fileMenuSource;
// Combined source including edit menu for items in the shared component
const combinedEditMenuSource = menuBarSource + editMenuSource;
// Combined source including view menu for items that moved to the shared component
const combinedViewMenuSource = menuBarSource + viewMenuSource;

const slideEditorSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideEditor.tsx"),
  "utf-8"
);

describe("SlideMenuBar — Complete Menu System", () => {
  describe("Menu structure", () => {
    it("has all 9 top-level menus", () => {
      const menus = ["file", "edit", "view", "insert", "format", "slide", "arrange", "tools", "help"];
      for (const m of menus) {
        expect(menuBarSource).toContain(`id: "${m}"`);
      }
    });

    it("renders menu labels", () => {
      const labels = ["File", "Edit", "View", "Insert", "Format", "Slide", "Arrange", "Tools", "Help"];
      for (const l of labels) {
        expect(menuBarSource).toContain(`label: "${l}"`);
      }
    });
  });

  describe("File menu", () => {
    it("uses fileMenuConfig for shared File menu", () => {
      expect(menuBarSource).toContain("fileMenuConfig");
      expect(combinedMenuSource).toContain("EditorFileMenu");
    });

    it("has New with submenu", () => {
      expect(combinedMenuSource).toContain('"Presentation"');
      expect(menuBarSource).toContain('"From template gallery"');
    });

    it("has Open with Ctrl+O shortcut", () => {
      expect(combinedMenuSource).toContain('"Open"');
      expect(combinedMenuSource).toContain('"Ctrl+O"');
    });

    it("has Import slides", () => {
      expect(menuBarSource).toContain('"Import slides"');
    });

    it("has Make a copy with Entire/Selected submenu", () => {
      expect(menuBarSource).toContain('"Entire presentation"');
      expect(menuBarSource).toContain('"Selected slides"');
    });

    it("has Share with submenu", () => {
      expect(combinedMenuSource).toContain('"Share with others"');
      expect(combinedMenuSource).toContain('"Publish"');
    });

    it("has Download item", () => {
      expect(combinedMenuSource).toContain('"Download"');
    });

    it("has Rename, Move to bin, Page setup, Print", () => {
      expect(combinedMenuSource).toContain('"Rename"');
      expect(combinedMenuSource).toContain('"Move to bin"');
      expect(combinedMenuSource).toContain('"Page setup"');
      expect(combinedMenuSource).toContain('"Print"');
    });
  });

  describe("Edit menu", () => {
    it("has all standard editing commands", () => {
      const items = ["Undo", "Redo", "Cut", "Copy", "Paste", "Paste without formatting", "Select all", "Delete", "Duplicate", "Find and replace"];
      for (const item of items) {
        expect(combinedEditMenuSource).toContain(`"${item}"`);
      }
    });

    it("has correct keyboard shortcuts", () => {
      expect(combinedEditMenuSource).toContain('"Ctrl+Z"');
      expect(combinedEditMenuSource).toContain('"Ctrl+Y"');
      expect(combinedEditMenuSource).toContain('"Ctrl+D"');
      expect(combinedEditMenuSource).toContain('"Ctrl+H"');
    });
  });

  describe("View menu", () => {
    it("has Mode submenu with Editing, Suggesting, Viewing", () => {
      expect(menuBarSource).toContain('"Editing"');
      expect(menuBarSource).toContain('"Suggesting"');
      expect(menuBarSource).toContain('"Viewing"');
    });

    it("has Slideshow with Ctrl+F5", () => {
      expect(menuBarSource).toContain('"Slideshow"');
      expect(menuBarSource).toContain('"Ctrl+F5"');
    });

    it("has Guides submenu", () => {
      expect(menuBarSource).toContain('"Show guides"');
      expect(menuBarSource).toContain('"Add vertical guide"');
      expect(menuBarSource).toContain('"Add horizontal guide"');
    });

    it("has Zoom submenu with Fit and percentages", () => {
      // Zoom config is in the menu bar, rendering is in EditorViewMenu
      expect(combinedViewMenuSource).toContain('"Fit"');
      expect(menuBarSource).toContain("50,");
      expect(menuBarSource).toContain("200");
    });
  });

  describe("Insert menu", () => {
    it("has Image submenu with 5 sources", () => {
      expect(menuBarSource).toContain('"Upload from computer"');
      expect(menuBarSource).toContain('"Search the web"');
      expect(menuBarSource).toContain('"By URL"');
    });

    it("has Shape submenu", () => {
      expect(menuBarSource).toContain('"Shapes"');
      expect(menuBarSource).toContain('"Arrows"');
      expect(menuBarSource).toContain('"Callouts"');
      expect(menuBarSource).toContain('"Equation"');
    });

    it("has Diagram submenu with 6 types", () => {
      const types = ["Grid", "Hierarchy", "Timeline", "Process", "Relationship", "Cycle"];
      for (const t of types) {
        expect(menuBarSource).toContain(`"${t}"`);
      }
    });

    it("has Line submenu with connector types", () => {
      expect(menuBarSource).toContain('"Elbow connector"');
      expect(menuBarSource).toContain('"Curved connector"');
      expect(menuBarSource).toContain('"Polyline"');
      expect(menuBarSource).toContain('"Scribble"');
    });

    it("has Text box, Word art, Comment, New slide", () => {
      expect(menuBarSource).toContain('"Text box"');
      expect(menuBarSource).toContain('"Word art"');
      expect(menuBarSource).toContain('"Comment"');
      expect(menuBarSource).toContain('"New slide"');
    });
  });

  describe("Format menu", () => {
    it("has Text submenu with capitalization", () => {
      expect(menuBarSource).toContain('"UPPERCASE"');
      expect(menuBarSource).toContain('"lowercase"');
      expect(menuBarSource).toContain('"Title Case"');
    });

    it("has Align & indent with line spacing", () => {
      expect(menuBarSource).toContain('"Line spacing"');
      expect(menuBarSource).toContain('"Single"');
      expect(menuBarSource).toContain('"Double"');
      expect(menuBarSource).toContain('"Custom"');
    });

    it("has Lists submenu", () => {
      expect(menuBarSource).toContain('"Numbered list"');
      expect(menuBarSource).toContain('"Bulleted list"');
      expect(menuBarSource).toContain('"Checklist"');
    });

    it("has Borders & lines submenu", () => {
      expect(menuBarSource).toContain('"Border weight"');
      expect(menuBarSource).toContain('"Border dash"');
      expect(menuBarSource).toContain('"Border color"');
    });

    it("has Format options and Clear formatting", () => {
      expect(menuBarSource).toContain('"Format options"');
      expect(menuBarSource).toContain('"Clear formatting"');
    });
  });

  describe("Slide menu", () => {
    it("has all slide management items", () => {
      expect(menuBarSource).toContain('"New slide"');
      expect(menuBarSource).toContain('"Duplicate slide"');
      expect(menuBarSource).toContain('"Delete slide"');
      expect(menuBarSource).toContain('"Skip slide"');
    });

    it("has Move slide submenu with 4 directions", () => {
      expect(menuBarSource).toContain('"Move to beginning"');
      expect(menuBarSource).toContain('"Move up"');
      expect(menuBarSource).toContain('"Move down"');
      expect(menuBarSource).toContain('"Move to end"');
    });

    it("has Apply layout with 5 options", () => {
      expect(menuBarSource).toContain('"Title Slide"');
      expect(menuBarSource).toContain('"Section Header"');
      expect(menuBarSource).toContain('"Title and Body"');
      expect(menuBarSource).toContain('"Two Columns"');
      expect(menuBarSource).toContain('"Blank"');
    });

    it("has Change background, Transitions, Edit theme", () => {
      expect(menuBarSource).toContain('"Change background"');
      expect(menuBarSource).toContain('"Transitions"');
      expect(menuBarSource).toContain('"Edit theme"');
    });
  });

  describe("Arrange menu", () => {
    it("has Order submenu with shortcuts", () => {
      expect(menuBarSource).toContain('"Bring to front"');
      expect(menuBarSource).toContain('"Send to back"');
      expect(menuBarSource).toContain("Ctrl+Shift+↑");
      expect(menuBarSource).toContain("Ctrl+Shift+↓");
    });

    it("has Align submenu with 6 options", () => {
      const aligns = ["Left", "Center", "Right", "Top", "Middle", "Bottom"];
      for (const a of aligns) {
        expect(menuBarSource).toContain(`"${a}"`);
      }
    });

    it("has Distribute and Center on page", () => {
      expect(menuBarSource).toContain('"Horizontally"');
      expect(menuBarSource).toContain('"Vertically"');
    });

    it("has Rotate submenu", () => {
      expect(menuBarSource).toContain('"Rotate clockwise 90°"');
      expect(menuBarSource).toContain('"Flip horizontally"');
      expect(menuBarSource).toContain('"Flip vertically"');
    });

    it("has Group and Ungroup with shortcuts", () => {
      expect(menuBarSource).toContain('"Group"');
      expect(menuBarSource).toContain('"Ungroup"');
      expect(menuBarSource).toContain('"Ctrl+G"');
      expect(menuBarSource).toContain('"Ctrl+Alt+G"');
    });
  });

  describe("Tools menu", () => {
    it("has Spelling, Explore, Dictionary", () => {
      expect(menuBarSource).toContain('"Spell check"');
      expect(menuBarSource).toContain('"Explore"');
      expect(menuBarSource).toContain('"Dictionary"');
    });

    it("has Voice type speaker notes", () => {
      expect(menuBarSource).toContain('"Voice type speaker notes"');
    });

    it("has Accessibility settings", () => {
      expect(menuBarSource).toContain('"Accessibility settings"');
    });
  });

  describe("Help menu", () => {
    it("has Search the menus and Keyboard shortcuts", () => {
      expect(menuBarSource).toContain('"Search the menus"');
      expect(menuBarSource).toContain('"Keyboard shortcuts"');
    });
  });

  describe("Action wiring in SlideEditor", () => {
    it("SlideEditor imports and renders SlideMenuBar", () => {
      expect(slideEditorSource).toContain('import SlideMenuBar');
      expect(slideEditorSource).toContain('<SlideMenuBar');
    });

    it("wires slide:new action to addSlide", () => {
      expect(slideEditorSource).toContain('"slide:new"');
      expect(slideEditorSource).toContain("addSlide()");
    });

    it("wires slide:duplicate action", () => {
      expect(slideEditorSource).toContain('"slide:duplicate"');
      expect(slideEditorSource).toContain("duplicateSlide()");
    });

    it("wires view:slideshow action", () => {
      expect(slideEditorSource).toContain('"view:slideshow"');
      expect(slideEditorSource).toContain("setIsPresenting(true)");
    });

    it("wires format actions to execCommand", () => {
      expect(slideEditorSource).toContain('"format:bold"');
      expect(slideEditorSource).toContain('document.execCommand("bold")');
    });
  });

  describe("Glassmorphism UI", () => {
    it("dropdowns use backdrop-blur", () => {
      expect(editorMenusSource).toContain("backdrop-blur-xl");
      expect(editorMenusSource).toContain("bg-white/95");
    });

    it("submenus use glassmorphism", () => {
      // Both the main dropdown and submenus should have blur in EditorMenus
      const blurCount = (editorMenusSource.match(/backdrop-blur-xl/g) || []).length;
      expect(blurCount).toBeGreaterThanOrEqual(2);
    });
  });
});
