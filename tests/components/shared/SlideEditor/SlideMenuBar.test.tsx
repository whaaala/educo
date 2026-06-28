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

const insertMenuSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/EditorInsertMenu.tsx"),
  "utf-8"
);

// Combined source for checking items that span multiple files
const combinedMenuSource = menuBarSource + fileMenuSource;
// Combined source including edit menu for items in the shared component
const combinedEditMenuSource = menuBarSource + editMenuSource;
// Combined source including view menu for items that moved to the shared component
const combinedViewMenuSource = menuBarSource + viewMenuSource;
// Combined source including insert menu
const combinedInsertMenuSource = menuBarSource + insertMenuSource;

const slideEditorSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideEditor.tsx"),
  "utf-8"
);

const slideCanvasSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideCanvas.tsx"),
  "utf-8"
);

const shapesSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/shapes.ts"),
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
      expect(combinedInsertMenuSource).toContain('"Upload from computer"');
      expect(combinedInsertMenuSource).toContain('"Search the web"');
      expect(combinedInsertMenuSource).toContain('"By URL"');
    });

    it("has Shape submenu", () => {
      expect(combinedInsertMenuSource).toContain('"Shapes"');
      expect(combinedInsertMenuSource).toContain('"Arrows"');
      expect(combinedInsertMenuSource).toContain('"Callouts"');
      expect(combinedInsertMenuSource).toContain('"Equation"');
    });

    it("has Diagram submenu with 6 types", () => {
      const types = ["Grid", "Hierarchy", "Timeline", "Process", "Relationship", "Cycle"];
      for (const t of types) {
        expect(combinedInsertMenuSource).toContain(`"${t}"`);
      }
    });

    it("has Line submenu with connector types", () => {
      expect(combinedInsertMenuSource).toContain('"Elbow connector"');
      expect(combinedInsertMenuSource).toContain('"Curved connector"');
      expect(combinedInsertMenuSource).toContain('"Polyline"');
      expect(combinedInsertMenuSource).toContain('"Scribble"');
    });

    it("has Text box, Word art, Comment, New slide", () => {
      expect(combinedInsertMenuSource).toContain('"Text box"');
      expect(combinedInsertMenuSource).toContain('"Word art"');
      expect(combinedInsertMenuSource).toContain('"Comment"');
      expect(combinedInsertMenuSource).toContain('"New slide"');
    });
  });

  // Regression: double-click-to-edit shape text + multi-node diagram insert
  describe("Diagram & shape-text editing regressions", () => {
    // ShapeSVG injects its shape via dangerouslySetInnerHTML. If it re-renders on
    // every selection change, the injected node is remounted between mousedown and
    // mouseup, so the browser never fires click/dblclick and double-click-to-edit
    // silently fails. Memoizing ShapeSVG prevents the remount.
    it("memoizes ShapeSVG so selection re-renders don't remount its injected node", () => {
      expect(slideCanvasSource).toMatch(/const ShapeSVG = React\.memo\(/);
    });

    it("still enters shape text edit mode on double-click", () => {
      expect(slideCanvasSource).toContain('obj.type === "shape" && canEdit) setEditingTextId(obj.id)');
    });

    // Inserting a multi-node diagram by calling addObjectToSlide in a loop loses all
    // but the last node (each call reads the same stale objects snapshot). The batch
    // helper appends every node in a single state update.
    it("provides a batch addObjectsToSlide helper for multi-node inserts", () => {
      expect(slideEditorSource).toContain("const addObjectsToSlide = useCallback");
      expect(slideEditorSource).toMatch(/objects: \[\.\.\.currentObjects, \.\.\.objs\]/);
    });

    it("inserts Grid / Hierarchy / Chart diagrams via the batch helper, not a loop", () => {
      // Grid uses .map(...) passed to addObjectsToSlide
      expect(slideEditorSource).toMatch(/addObjectsToSlide\(\[0,1,2,3\]\.map/);
      // Hierarchy builds an array of all four nodes
      expect(slideEditorSource).toContain('text: "Main"');
      expect(slideEditorSource).toContain('text: "Branch A"');
      expect(slideEditorSource).toContain('text: "Branch B"');
      // None of the diagram/chart handlers should add nodes via a forEach loop anymore
      expect(slideEditorSource).not.toMatch(/forEach\(\(i\) => addObjectToSlide/);
      expect(slideEditorSource).not.toMatch(/forEach\(\(h, i\) => addObjectToSlide/);
    });

    // The editing contentEditable and the non-editing view element are both <div>
    // at the same JSX position. Without distinct keys, React reuses the DOM node, so
    // the one-time `__shapeInit`/`__tbInit` flag persists and the text fails to reload
    // on the second edit session (the box appears empty).
    it("gives shape edit/view nodes distinct keys so text reloads on re-edit", () => {
      expect(slideCanvasSource).toContain("key={`shape-edit-${obj.id}`}");
      expect(slideCanvasSource).toContain("key={`shape-view-${obj.id}`}");
    });

    it("gives textbox edit/view nodes distinct keys so content reloads on re-edit", () => {
      expect(slideCanvasSource).toContain("key={`tb-edit-${obj.id}`}");
      expect(slideCanvasSource).toContain("key={`tb-view-${obj.id}`}");
    });

    // The object right-click context menu: Cut/Copy/Paste must do something (they
    // used to be `() => {}` no-ops), and the Rotate/Align/Centre submenus must be
    // positioned next to their item, not flashed into the top-left corner.
    it("wires context-menu Cut/Copy/Paste to real clipboard actions", () => {
      expect(slideCanvasSource).toContain("const clipboardRef = useRef");
      expect(slideCanvasSource).toContain("const copyObjects = useCallback");
      expect(slideCanvasSource).toContain("const cutObjects = useCallback");
      expect(slideCanvasSource).toContain("const pasteObjects = useCallback");
      expect(slideCanvasSource).toContain("action: () => cutObjects(objId)");
      expect(slideCanvasSource).toContain("action: () => copyObjects(objId)");
      expect(slideCanvasSource).toContain("action: () => pasteObjects()");
      // The old no-op placeholders must be gone
      expect(slideCanvasSource).not.toContain('label: "Cut", shortcut: "Ctrl+X", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="12" r="2.5"/><circle cx="11" cy="12" r="2.5"/><line x1="5" y1="9.5" x2="11" y2="3"/><line x1="11" y1="9.5" x2="5" y2="3"/></svg>, action: () => {} }');
    });

    it("positions context-menu submenus via measured state, not a null-ref top-left fallback", () => {
      expect(slideCanvasSource).toContain("const [subStyle, setSubStyle]");
      expect(slideCanvasSource).toMatch(/useLayoutEffect\(\(\) => \{[\s\S]*?setSubStyle\(/);
      // Only render the submenu once it has been positioned
      expect(slideCanvasSource).toContain("isOpen && subStyle && typeof document");
      // The old fallback that put the submenu at (0,0) must be gone
      expect(slideCanvasSource).not.toContain("if (!el) return { top: 0, left: 0 };");
    });

    it("keeps a submenu open across the hover gap and opens it rightward", () => {
      // Close is delayed so the cursor can travel onto the (portalled) submenu
      expect(slideCanvasSource).toContain("const scheduleSubmenuClose = useCallback");
      expect(slideCanvasSource).toContain("const openSubmenuNow = useCallback");
      expect(slideCanvasSource).toContain("onMouseLeave={onScheduleClose}");
      expect(slideCanvasSource).toContain("onMouseEnter={() => onOpen(item.submenu!)}");
      // The context menu reserves submenu width on the right so submenus open rightward
      expect(slideCanvasSource).toContain("const menuW = 220, submenuW = 234;");
      expect(slideCanvasSource).toMatch(/menuLeft = window\.innerWidth - menuW - submenuW - 8/);
    });

    // Shape text uses grid + alignContent (matching textboxes) so vertical alignment
    // and the caret behave correctly — including a centered caret in an empty box.
    it("uses grid + alignContent for shape text vertical alignment", () => {
      expect(slideCanvasSource).toMatch(/alignContent: \(obj as ShapeObject\)\.textVerticalAlign/);
    });

    // The rectangle shapes must (nearly) fill their bounding box. With a large vertical
    // inset (the old 5,15,90,70) the visible box is shorter than the text overlay, so
    // top/bottom-aligned text spilled outside the box and got clipped.
    it("rectangle shapes fill their bounding box so aligned text stays inside", () => {
      expect(shapesSource).toContain('"rect":              { label: "Rectangle", category: "shapes", svg: rect(2, 2, 96, 96, 0) }');
      expect(shapesSource).toContain('rect(2, 2, 96, 96, 10)');
      // The old clipped geometry must be gone
      expect(shapesSource).not.toContain('rect(5, 15, 90, 70, 0)');
    });

    // Inserted diagrams/charts must fit on the slide with margins. getContentArea
    // previously could return the full slide (y:5, h:90), so a 2-row grid reached
    // ~93% — flush against the bottom edge and overflowing visually.
    it("getContentArea reserves side/top/bottom margins so diagrams fit on the slide", () => {
      expect(slideEditorSource).toContain("const BOTTOM = 92;");
      expect(slideEditorSource).toContain("const SIDE = 8;");
      // The old full-slide default must be gone
      expect(slideEditorSource).not.toContain("return { x: 5, y: 5, w: 90, h: 90 };");
      expect(slideEditorSource).not.toContain("h: 95 - titleBottom");
    });

    // Each diagram type must produce its OWN distinct layout. Previously Timeline,
    // Process, Relationship and Cycle all fell through to the Hierarchy case and
    // rendered the identical Main/Branch A/Branch B layout.
    it("gives each diagram type a distinct layout, not a shared Hierarchy fallthrough", () => {
      // Five separate case bodies, no shared fallthrough
      expect(slideEditorSource).toContain('case "insert:diagramHierarchy": {');
      expect(slideEditorSource).toContain('case "insert:diagramTimeline": {');
      expect(slideEditorSource).toContain('case "insert:diagramProcess": {');
      expect(slideEditorSource).toContain('case "insert:diagramRelationship": {');
      expect(slideEditorSource).toContain('case "insert:diagramCycle": {');
      // Each builds its own labels
      expect(slideEditorSource).toContain('text: "Main"');        // Hierarchy
      expect(slideEditorSource).toContain('text: `Step ${i + 1}`'); // Timeline / Process
      expect(slideEditorSource).toContain('text: "Concept A"');   // Relationship
      expect(slideEditorSource).toMatch(/text: "Stage 1"/);       // Cycle
      // The old combined fallthrough must be gone
      expect(slideEditorSource).not.toMatch(/case "insert:diagramHierarchy": case "insert:diagramTimeline":/);
    });

    // When the current slide is full, inserting an object should create a new slide
    // and place it there instead of overlapping/overflowing existing content.
    it("auto-overflows inserted objects onto a new slide when the current one is full", () => {
      expect(slideEditorSource).toContain("const fitsOnCurrentSlide = useCallback");
      expect(slideEditorSource).toContain("const isLayoutPlaceholder = useCallback");
      // addObjectsToSlide branches on fit and creates a new slide otherwise
      expect(slideEditorSource).toMatch(/if \(fitsOnCurrentSlide\(objs\)\)/);
      // The new-slide creation is deferred out of the menu click so it doesn't orphan
      // the menu portal and swallow the next action.
      expect(slideEditorSource).toMatch(/requestAnimationFrame\(\(\) => \{[\s\S]*?ns\.splice\(curIdx \+ 1, 0, newSlide\)/);
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
