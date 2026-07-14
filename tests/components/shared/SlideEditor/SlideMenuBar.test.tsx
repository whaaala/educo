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

const slideChartSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideChart.tsx"),
  "utf-8"
);

const slideStorageSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../lib/slide-storage.ts"),
  "utf-8"
);

// The reusable Chart now lives in components/shared/Chart and is consumed by the
// slide editor AND the work document. SlideChart.tsx is just a thin slide adapter.
const chartSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/Chart/Chart.tsx"),
  "utf-8"
);
const chartEditorSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/shared/Chart/ChartEditor.tsx"),
  "utf-8"
);
const chartTypesSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../lib/chart/types.ts"),
  "utf-8"
);
const paletteSource = fs.readFileSync(
  path.resolve(__dirname, "../../../../lib/chart/palette.ts"),
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
      // Objects are packed into free space, then appended in a single update
      expect(slideEditorSource).toMatch(/objects: \[\.\.\.currentObjects, \.\.\.fitted\]/);
    });

    // A long submenu (e.g. the 19 chart types) must fit the viewport — height-capped,
    // scrollable, with a top/bottom margin — not run off the bottom of the screen.
    it("supports inserting audio & video that play in the editor and slideshow", () => {
      const insertMenuSource = fs.readFileSync(
        path.resolve(__dirname, "../../../../components/shared/EditorInsertMenu.tsx"), "utf-8");
      // Insert menu offers Audio + Video (upload / by URL)
      expect(insertMenuSource).toContain('label: "Audio"');
      expect(insertMenuSource).toContain('label: "Video"');
      expect(insertMenuSource).toContain("insert:audioUpload");
      expect(insertMenuSource).toContain("insert:videoUrl");
      // Presentation enables it
      const menuBarSource = fs.readFileSync(
        path.resolve(__dirname, "../../../../components/shared/SlideEditor/SlideMenuBar.tsx"), "utf-8");
      expect(menuBarSource).toContain("showAudioVideo: true");
      // Handlers wired (upload + url)
      expect(slideEditorSource).toMatch(/insert:audioUpload|insert:videoUpload/);
      expect(slideEditorSource).toContain("createMediaObj(");
      // Rendered as real media elements in the canvas + preview
      expect(slideCanvasSource).toMatch(/obj\.type === "media"/);
      expect(slideCanvasSource).toMatch(/<audio|<video/);
      expect(slideEditorSource).toMatch(/obj\.type === "media"/);
      // Model has the media object type
      expect(slideStorageSource).toContain("export interface MediaObject");
      expect(slideStorageSource).toContain("export function createMediaObj");
    });

    it("keeps a long submenu inside the viewport (scrollable, with margins)", () => {
      const viewMenusSource = fs.readFileSync(
        path.resolve(__dirname, "../../../../components/shared/EditorViewMenus.tsx"), "utf-8");
      // The inner scroller's height is capped to the viewport directly (robust, not a Tailwind calc no-op)
      expect(viewMenusSource).toContain("data-submenu-scroll");
      expect(viewMenusSource).toMatch(/scroller\.style\.maxHeight = `\$\{Math\.max\(120, window\.innerHeight - MARGIN \* 2\)\}px`/);
      // A clearly visible top & bottom margin; never runs off-screen
      expect(viewMenusSource).toContain("const MARGIN = 24");
      expect(viewMenusSource).toMatch(/top = window\.innerHeight - ph - MARGIN/);
      expect(viewMenusSource).toMatch(/if \(top < MARGIN\) top = MARGIN/);
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
    it("wires context-menu Cut/Copy/Paste to a SHARED clipboard usable everywhere", () => {
      expect(slideCanvasSource).toContain("const copyObjects = useCallback");
      expect(slideCanvasSource).toContain("const cutObjects = useCallback");
      expect(slideCanvasSource).toContain("const pasteObjects = useCallback");
      expect(slideCanvasSource).toContain("action: () => cutObjects(objId)");
      expect(slideCanvasSource).toContain("action: () => copyObjects(objId)");
      expect(slideCanvasSource).toContain("action: () => pasteObjects()");
      // One module-level clipboard shared by the canvas, the keyboard and the Edit menu
      const clipSource = fs.readFileSync(
        path.resolve(__dirname, "../../../../components/shared/SlideEditor/slide-clipboard.ts"), "utf-8");
      expect(clipSource).toContain("export function setSlideClipboard");
      expect(clipSource).toContain("export function getSlideClipboard");
      expect(clipSource).toContain("export function packIntoFreeSpace");
      expect(slideCanvasSource).toContain("setSlideClipboard(copied");
      expect(slideCanvasSource).toContain("getSlideClipboard()");
      // The keyboard handler and the Edit menu use the SAME shared clipboard (not a private ref)
      expect(slideEditorSource).toContain("getSlideClipboard()");
      expect(slideEditorSource).toContain("setSlideClipboard(sel)");
      expect(slideEditorSource).not.toContain("objectClipboardRef");
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

    // Selecting multiple objects shows ONE group bounding box whose handles scale every
    // selected object together (enlarge/shrink), instead of per-object handles.
    it("supports resizing all multi-selected objects together via a group box", () => {
      expect(slideCanvasSource).toContain("const startGroupResize = useCallback");
      // A single group box with handles is rendered for multi-select
      expect(slideCanvasSource).toMatch(/allSelectedIds\.size > 1 && \(\(\) => \{/);
      expect(slideCanvasSource).toContain("startGroupResize(e, dir)");
      // Per-object resize handles are suppressed during multi-select
      expect(slideCanvasSource).toContain("allSelectedIds.size <= 1 && HANDLES.map");
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

    // Insert > Chart creates ONE editable chart object via the generic "insert:chart:<type>"
    // action covering all 19 types (plus the legacy fixed-type actions), so it moves/resizes
    // as a unit and its data/labels/percentages can be edited.
    it("inserts a single editable chart object per chart type", () => {
      // Generic intercept + helper handles every type
      expect(slideEditorSource).toMatch(/action\.startsWith\("insert:chart:"\)/);
      expect(slideEditorSource).toContain("insertChart(action.slice");
      expect(slideEditorSource).toContain("createChartObj(chartType");
      // Legacy fixed-type actions still map
      expect(slideEditorSource).toMatch(/"insert:chartBar": "bar"/);
      expect(slideEditorSource).toMatch(/"insert:chartPie": "pie"/);
      // The old shape-collection chart code must be gone
      expect(slideEditorSource).not.toMatch(/createShapeObj\("rect", \{ x: axisX/);
      expect(slideEditorSource).not.toContain('"pie-slice-1", "pie-slice-2", "pie-slice-3", "pie-slice-4"');
    });

    // The insert menu offers the full catalogue of chart types.
    it("offers all 19 chart types in the insert menu", () => {
      const insertMenuSource = fs.readFileSync(
        path.resolve(__dirname, "../../../../components/shared/EditorInsertMenu.tsx"), "utf-8");
      for (const t of ["column", "bar", "groupedBar", "stackedBar", "histogram", "line",
        "multiLine", "area", "stackedArea", "combo", "pie", "donut", "radialBar", "gauge",
        "waffle", "funnel", "radar", "scatter", "bubble"]) {
        expect(insertMenuSource).toContain(`insert:chart:${t}`);
      }
    });

    it("defines an editable ChartSpec / ChartObject data model with all 19 types", () => {
      // Single source of truth for the reusable chart model
      expect(chartTypesSource).toContain("export interface ChartSpec");
      expect(chartTypesSource).toContain("export type ChartType");
      for (const t of ['"groupedBar"', '"stackedBar"', '"multiLine"', '"stackedArea"',
        '"combo"', '"radialBar"', '"waffle"', '"scatter"', '"bubble"', '"funnel"', '"radar"', '"gauge"', '"histogram"']) {
        expect(chartTypesSource).toContain(t);
      }
      expect(chartTypesSource).toContain("export function defaultChartData");
      expect(chartTypesSource).toContain("export function defaultChartOptions");
      // Slide ChartObject composes the spec + positioning, and seeds per-type defaults
      expect(slideStorageSource).toContain("export interface ChartObject extends SlideObjectBase, ChartSpec");
      expect(slideStorageSource).toMatch(/createChartObj\(chartType: ChartType/);
      expect(slideStorageSource).toContain("defaultChartData(chartType)");
      expect(slideStorageSource).toMatch(/\| ChartObject\b/);
      expect(slideStorageSource).toMatch(/"table" \| "chart"/);
    });

    it("renders the chart object and opens its data editor on double-click", () => {
      // The reusable Chart + ChartEditor do the work; SlideChart is a thin adapter
      expect(chartSource).toContain("export default function Chart");
      expect(chartEditorSource).toContain("export default function ChartEditor");
      expect(chartEditorSource).toMatch(/\+ Add /);
      expect(chartSource).toMatch(/threeD/);
      expect(slideChartSource).toContain("export default function SlideChart");
      expect(slideChartSource).toContain("export function SlideChartEditor");
      expect(slideChartSource).toContain("<Chart");
      expect(slideChartSource).toContain("<ChartEditor");
      // Wired into the canvas: rendered as one object, double-click opens the editor
      expect(slideCanvasSource).toContain("<SlideChart");
      expect(slideCanvasSource).toContain('obj.type === "chart" && canEdit) setEditingTextId(obj.id)');
      expect(slideCanvasSource).toContain("<SlideChartEditor");
      // Also rendered in the thumbnail / presentation preview, not just the editor
      expect(slideEditorSource).toContain('obj.type === "chart" && <SlideChart obj={obj} />');
    });

    it("makes chart text fully editable — content, free-drag, font (whole + per-label) and axes", () => {
      // Data model: per-label overrides, whole-chart font, Y-axis override, custom labels
      expect(chartTypesSource).toContain("export interface ChartLabelOverride");
      expect(chartTypesSource).toContain("export interface ChartTextStyle");
      expect(chartTypesSource).toMatch(/font\?: ChartTextStyle/);
      expect(chartTypesSource).toMatch(/labels\?: Record<string, ChartLabelOverride>/);
      expect(chartTypesSource).toMatch(/yMin\?: number/);
      expect(chartTypesSource).toMatch(/customLabel\?: string/);
      // Free-drag of any label + per-label format toolbar (in the reusable renderer)
      expect(chartSource).toContain("const startLabelDrag");
      expect(chartSource).toContain("data-chart-label");
      expect(chartSource).toContain("<TextFormatToolbar");
      // Whole-chart font + Y-axis controls in the panel, plus token-based custom labels
      expect(chartEditorSource).toContain("Font (all labels)");
      expect(chartEditorSource).toContain("Y-axis (blank = auto)");
      expect(chartEditorSource).toMatch(/\{percent\}/);
      // Chart is interactive only when selected (single object)
      expect(slideCanvasSource).toMatch(/editing=\{isSelected && canEdit && !drawingMode && allSelectedIds\.size <= 1\}/);
    });

    it("renders charts with a logical viewBox so they scale uniformly (editor + thumbnails)", () => {
      // One SVG with an aspect-matched viewBox. The chart surface is transparent so it
      // blends with the slide/document; grid/label colours come from the theme tokens.
      expect(slideChartSource).toMatch(/const chartAspect = .*obj\.width.*SLIDE_ASPECT/);
      expect(chartSource).toContain('viewBox={`0 0 ${VW} ${VH}`}');
      expect(chartSource).toContain('background: "transparent"');
      expect(chartSource).toContain("chartTheme(theme)");
      // No measured-pixel ResizeObserver approach
      expect(chartSource).not.toContain("new ResizeObserver");
    });

    it("respects the app theme — grid/axis/label colours come from theme tokens", () => {
      // Palette exposes per-surface token sets; the renderer takes a `theme` prop.
      expect(paletteSource).toContain("export function chartTheme");
      for (const k of ['"dark"', '"midnight"', '"purple"']) expect(paletteSource).toContain(k);
      expect(chartSource).toMatch(/theme\?: ChartThemeName/);
      // Single-accent palette (tints/shades), not a rainbow
      expect(paletteSource).toContain("export function categorical");
      expect(paletteSource).toContain("export function mono");
    });

    it("keeps the editor panel open when its fields are clicked (portal event bubbling)", () => {
      // The panel portals to <body>; React bubbles its events to the canvas click-to-deselect
      // handler, so it must stop click/mousedown/pointerdown from escaping.
      expect(chartEditorSource).toContain("onClick={(e) => e.stopPropagation()}");
      expect(chartEditorSource).toContain("onMouseDown={(e) => e.stopPropagation()}");
      expect(chartEditorSource).toContain("onPointerDown={(e) => e.stopPropagation()}");
    });

    it("keeps the editor panel inside the viewport on every screen size", () => {
      // width clamps to the viewport and left/top are clamped into view
      expect(chartEditorSource).toMatch(/panelW = Math\.min\(300, vw - 16\)/);
      expect(chartEditorSource).toMatch(/left = Math\.max\(8, Math\.min\(left, vw - panelW - 8\)\)/);
      expect(chartEditorSource).toMatch(/maxHeight: maxH/);
    });

    it("labels axes by orientation — horizontal bars put categories on the Y axis", () => {
      // Editor data header is orientation-aware
      expect(chartEditorSource).toContain('type === "bar" ? "Data (Y axis)" : "Data (X axis)"');
      // The horizontal bar renderer draws a real bottom X axis + value gridlines that honour the toggles
      expect(chartSource).toMatch(/spec\.showGrid && vTicks\.map/);
      expect(chartSource).toMatch(/spec\.showAxes && <line x1=\{x0\} y1=\{y1\} x2=\{x1\} y2=\{y1\}/);
      expect(chartSource).toContain("const scaleX = (v: number) => x0");
    });

    it("lets the title/subtitle be positioned anywhere and uses the shared font picker", () => {
      // Title/subtitle block placement (h + v) is part of the model and honoured by the renderer
      expect(chartTypesSource).toMatch(/titleAlign\?: "left" \| "center" \| "right"/);
      expect(chartTypesSource).toMatch(/titleVAlign\?: "top" \| "middle" \| "bottom"/);
      expect(chartSource).toContain("spec.titleAlign");
      expect(chartSource).toContain("spec.titleVAlign");
      // Editor exposes 3 horizontal + 3 vertical position buttons
      expect(chartEditorSource).toContain("titleAlign: a");
      expect(chartEditorSource).toContain("titleVAlign: v");
      expect(chartEditorSource).toMatch(/\["left", "center", "right"\]/);
      expect(chartEditorSource).toMatch(/\["top", "middle", "bottom"\]/);
      // Font family/size use the SAME shared CustomDropdown + FONT_OPTIONS as the rest of the app
      expect(chartEditorSource).toContain("import CustomDropdown from");
      expect(chartEditorSource).toContain('import { FONT_OPTIONS } from "@/components/shared/TextFormatToolbar"');
      expect(chartEditorSource).toContain("options={FONT_OPTIONS}");
      expect(chartEditorSource).not.toContain("<select aria-label=\"Chart font family\"");
      // Any label can also be aligned/sized/coloured via the shared TextFormatToolbar
      expect(chartSource).toContain("showAlign showVerticalAlign");
      expect(chartSource).toContain("onAlignChange={(v) => setLabelMeta(selected, { align: v })}");
    });

    it("applies an optional 3D mode to EVERY chart type", () => {
      // One depth system (extrudes for bars, tilt for pie, spheres/shadow for line/scatter)
      // shared by all renderers via D3 / dep3 / sphere / shadow3D.
      expect(chartSource).toContain("const D3 = !!spec.threeD");
      expect(chartSource).toContain("const dep3 =");
      expect(chartSource).toContain("const sphere =");
      expect(chartSource).toContain("shadow3D");
      // The extruded-bar helper is reused across the bar-family renderers
      expect(chartSource).toContain("const vBar3D =");
      // Every renderer references the 3D depth/shadow/sphere (not just a few)
      const threeDHits = (chartSource.match(/\b(dep3|D3|shadow3D|sphere\()\b/g) || []).length;
      expect(threeDHits).toBeGreaterThan(20);
      // Legend for circular charts is a vertical list to the side (not dumped at the bottom)
      expect(chartSource).toContain('legendSide: "right" | "bottom" | null');
    });

    // Inserting fits the object into FREE SPACE on the current slide (shrinking if needed);
    // only when the page is genuinely full does it overflow onto a new slide.
    it("packs inserts into free space, overflowing to a new slide only when full", () => {
      expect(slideEditorSource).toContain("const placeInFreeSpace = useCallback");
      expect(slideEditorSource).toContain("const isLayoutPlaceholder = useCallback");
      // addObjectsToSlide tries to pack into free space; null result → new slide
      expect(slideEditorSource).toMatch(/const fitted = onTitleSlide \? null : placeInFreeSpace\(objs\)/);
      expect(slideEditorSource).toMatch(/if \(fitted\)/);
      // The packing helper shrinks-to-fit and is shared with paste
      expect(slideEditorSource).toContain("packIntoFreeSpace(objs, content, area)");
      // The new-slide creation is deferred out of the menu click so it doesn't orphan
      // the menu portal and swallow the next action.
      expect(slideEditorSource).toMatch(/requestAnimationFrame\(\(\) => \{[\s\S]*?ns\.splice\(curIdx \+ 1, 0, newSlide\)/);
    });

    // The presentation title page keeps to itself — inserting content while on it starts a
    // new slide instead of dropping the content on top of the title.
    it("redirects inserts off the bare title slide onto a new slide", () => {
      expect(slideEditorSource).toContain("const isBareTitleSlide = useCallback");
      expect(slideEditorSource).toContain("const onTitleSlide = isBareTitleSlide();");
      expect(slideEditorSource).toMatch(/onTitleSlide \? null : placeInFreeSpace/);
      expect(slideEditorSource).toMatch(/the title page stays on its own/);
    });

    // Copy/paste works across slides and entry points (keyboard, Edit menu, right-click),
    // and pasted objects land in free space.
    it("pastes via a shared clipboard into free space, across slides", () => {
      // Keyboard Ctrl+C/X/V use the shared clipboard and route paste through addObjectsToSlide
      expect(slideEditorSource).toMatch(/e\.key === "v"/);
      expect(slideEditorSource).toContain("addObjectsToSlideRef.current(fresh)");
      // Edit menu paste re-ids and packs into free space
      expect(slideEditorSource).toMatch(/case "edit:paste":[\s\S]*?addObjectsToSlide\(fresh\)/);
      // Context-menu paste packs into free space too (offset fallback)
      expect(slideCanvasSource).toContain("packIntoFreeSpace(fresh, content");
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

  describe("Draw tool — pen controls & stroke persistence", () => {
    it("Draw toolbar button migrates the slide to canvas mode when activated", () => {
      // On a legacy/blank slide SlideCanvas is not mounted, so drawing has nothing to
      // capture the drag. Entering draw mode must migrate first.
      expect(slideEditorSource).toMatch(/if \(!drawingMode\) migrateSlideToObjects\(\); setDrawingMode/);
    });

    it("renders a drawing controls bar (colour + width + Done) while drawing", () => {
      expect(slideEditorSource).toContain("{drawingMode && (");
      expect(slideEditorSource).toContain("Pen colour ${c}");
      expect(slideEditorSource).toContain("Pen width ${w}");
    });

    it("offers preset colours and a custom colour picker", () => {
      expect(slideEditorSource).toContain('"#ef4444"');
      expect(slideEditorSource).toContain("setDrawingColor(c)");
      expect(slideEditorSource).toMatch(/type="color"[^>]*onChange=\{e => setDrawingColor/);
    });

    it("offers multiple pen widths", () => {
      expect(slideEditorSource).toContain("[2, 4, 8].map");
      expect(slideEditorSource).toContain("setDrawingWidth(w)");
    });

    it("keeps a completed stroke on the CURRENT slide (never overflows to a new one)", () => {
      // A freeform drawing spans the whole page; routing it through free-space packing
      // would push it to a new slide. handleDrawingComplete must append directly.
      // Scope precisely to the function body (from its declaration to the useCallback deps close).
      const start = slideEditorSource.indexOf("const handleDrawingComplete");
      const fn = slideEditorSource.slice(start, slideEditorSource.indexOf("}, [", start));
      expect(fn).toContain("updateCurrentSlide({ objects: [...currentObjects, obj]");
      // It must NOT use the packing/overflow path (addObjectToSlide) for drawings.
      expect(fn).not.toContain("addObjectToSlide");
      // ...and must NOT auto-exit draw mode (so multiple strokes can be drawn).
      expect(fn).not.toContain("setDrawingMode(false)");
    });

    it("SlideCanvas captures the completed path via a ref (not stale state)", () => {
      // Reading the live path from state in endDrawing loses fast/batched strokes.
      expect(slideCanvasSource).toContain("drawPathRef");
      expect(slideCanvasSource).toMatch(/if \(drawPathRef\.current\.length > 10\) onDrawingComplete/);
    });
  });

  describe("Toolbar dropdowns are not clipped by the collapsible wrapper", () => {
    it("the collapsible menu+toolbar wrapper uses overflow-visible when expanded", () => {
      // Regression: an unconditional overflow-hidden clipped the Insert image / shape
      // dropdown panels (they hang below the toolbar), so they opened but stayed invisible
      // behind the slide — reading as 'clicking the icon does nothing'.
      expect(slideEditorSource).toContain('headerCollapsed ? "overflow-hidden" : "overflow-visible"');
      // It must NOT unconditionally clip the wrapper.
      expect(slideEditorSource).not.toContain('className="overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0"');
    });

    it("the Insert image toolbar control is a dropdown (upload / by URL), not a bare picker", () => {
      expect(slideEditorSource).toContain('title="Insert image" Icon={ImageIcon} isOpen={showImageDropdown}');
      expect(slideEditorSource).toContain("Upload from computer");
      expect(slideEditorSource).toContain("By URL");
    });

    it("image upload uses a PERSISTENT hidden input opened via a native <label htmlFor>", () => {
      // A dynamically-created input clicked while the dropdown unmounts loses its user gesture in
      // some browsers, so the native picker silently never opens ('clicking does nothing'). A
      // <label htmlFor> opens the picker as the click's DEFAULT action — bulletproof.
      expect(slideEditorSource).toContain("imageInputRef = useRef");
      expect(slideEditorSource).toContain('<input id="educo-image-upload-input" ref={imageInputRef} type="file" accept="image/*"');
      expect(slideEditorSource).toContain('htmlFor="educo-image-upload-input"');
    });

    it("uploaded images are sized to their natural aspect ratio", () => {
      expect(slideEditorSource).toContain("const insertImageFile = useCallback");
      expect(slideEditorSource).toContain("probe.naturalWidth");
    });
  });

  describe("Shapes — full picker, visible lines, undistorted, tidy", () => {
    it("the toolbar Shape button opens the SAME full ShapePickerDialog as the Insert menu", () => {
      // Previously a hardcoded 6-shape mini-grid; now the full categorised picker.
      expect(slideEditorSource).toContain('title="Insert shape" Icon={Shapes} onClick={() => setShowShapePickerDialog("shapes")}');
      expect(slideEditorSource).not.toContain('["rect", "Rectangle"], ["circle", "Circle"]');
    });

    it("inserted shapes are aspect-corrected so squares/circles are not squashed", () => {
      // On a 16:9 slide, equal width/height % makes a wide box that distorts round shapes.
      expect(slideEditorSource).toContain("const W = 20, H = Math.round(W * 16 / 9)");
    });

    it("line/stroke shapes render in the fill colour (the Line shape is no longer invisible)", () => {
      // ShapeSVG must map stroke=currentColor to the fill, not to 'none'.
      expect(slideCanvasSource).toContain('.replace(/stroke="currentColor"/g, `stroke="${fill}"`)');
      expect(slideCanvasSource).not.toContain('stroke="${hasStroke ? stroke : "none"}"');
    });

    it("images default to objectFit 'contain' so nothing is cropped on resize", () => {
      expect(slideCanvasSource).toContain('(obj.objectFit || "contain")');
      expect(slideStorageSource).toContain('objectFit: "contain"');
    });
  });
});
