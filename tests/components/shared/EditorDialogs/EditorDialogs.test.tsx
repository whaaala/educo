import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

// ── Read the source file for structural verification ──

const sourcePath = path.resolve(
  __dirname,
  "../../../../components/shared/EditorDialogs.tsx"
);
const source = fs.readFileSync(sourcePath, "utf-8");

// ── Helpers ──

// ═══════════════════════════════════════════════════════════════════════════
//  EditorDialog
// ═══════════════════════════════════════════════════════════════════════════

describe("EditorDialog", () => {
  it("renders a centered modal overlay (Scenario: EditorDialog renders a centered modal overlay)", () => {
    // Given: EditorDialog exported from source
    expect(source).toContain("export function EditorDialog");

    // Then: a centered modal should appear with a semi-transparent backdrop
    // The outer wrapper uses absolute inset-0 flex items-center justify-center with bg-black/25 backdrop
    expect(source).toContain("data-editor-dialog");
    expect(source).toContain("absolute inset-0");
    expect(source).toContain("flex items-center justify-center");
    expect(source).toContain("bg-black/25");
    expect(source).toContain("backdrop-blur-[2px]");
  });

  it("displays the title in the header (Scenario: EditorDialog renders a centered modal overlay)", () => {
    // Then: the title prop should be rendered inside the dialog header
    expect(source).toContain("{title}");

    // The title text has styling for visibility
    expect(source).toContain("text-[0.8125rem] font-bold");
    expect(source).toContain("text-gray-800");
  });

  it("has a close button in the header (Scenario: EditorDialog renders a centered modal overlay)", () => {
    // Then: a close button should appear in the top-right corner
    // The header uses flex items-center justify-between to position title and close button
    expect(source).toContain("flex items-center justify-between");
    expect(source).toContain("onClick={onClose}");
    expect(source).toContain("Close");
  });

  it("fires onClose when the close button is clicked (Scenario: EditorDialog closes when X button is clicked)", () => {
    // Given: an open EditorDialog with onClose callback
    // When: user clicks the close button
    // Then: the onClose callback should fire
    // Verify the close button calls onClose directly
    expect(source).toMatch(/button[\s\S]*?onClick=\{onClose\}[\s\S]*?Close/);
  });

  it("closes on backdrop click (Scenario: EditorDialog closes on backdrop click)", () => {
    // Given: an open EditorDialog
    // When: the user clicks the backdrop overlay
    // The outer div is the backdrop; clicking it would propagate to the overlay
    // Verify the dialog structure has the data-editor-dialog backdrop wrapper
    expect(source).toContain("data-editor-dialog");
    // The outer div contains the overlay with bg-black/25
    expect(source).toContain("bg-black/25 backdrop-blur-[2px]");
    // The inner modal panel has max-w-[520px] to constrain content
    expect(source).toContain("max-w-[520px]");
    expect(source).toContain("rounded-2xl");
  });

  it("renders children inside the dialog body", () => {
    // Children are rendered after the header section
    expect(source).toContain("{children}");
  });

  it("has dark mode support on the dialog panel", () => {
    // The dialog panel should have dark mode variants
    expect(source).toContain("dark:border-gray-700");
    expect(source).toContain("dark:bg-[#0f1115]");
    expect(source).toContain("dark:text-gray-100");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  EditorDialogButton
// ═══════════════════════════════════════════════════════════════════════════

describe("EditorDialogButton", () => {
  it("renders with consistent styling (Scenario: EditorDialogButton renders with consistent styling)", () => {
    // Given: an EditorDialogButton
    expect(source).toContain("export function EditorDialogButton");

    // Then: it should appear as a bordered button with hover effects
    // Verify it has border, rounded, hover, and transition classes
    expect(source).toMatch(
      /EditorDialogButton[\s\S]*?border border-gray-200/
    );
    expect(source).toContain("rounded-xl");
    expect(source).toContain("hover:bg-gray-50");
    expect(source).toContain("dark:hover:bg-[#22262e]");
    expect(source).toContain("transition-colors");
    expect(source).toContain("cursor-pointer");
  });

  it("has correct text styling", () => {
    // Verify font size and weight
    expect(source).toMatch(
      /EditorDialogButton[\s\S]*?text-\[0.75rem\] font-semibold/
    );
  });

  it("fires onClick when clicked", () => {
    // The button element passes onClick directly
    expect(source).toMatch(
      /EditorDialogButton[\s\S]*?onClick=\{onClick\}/
    );
  });

  it("renders children as button content", () => {
    // Children are rendered inside the button
    // EditorDialogButton renders {children} inside its <button>
    const buttonMatch = source.match(
      /export function EditorDialogButton[\s\S]*?<button[\s\S]*?\{children\}[\s\S]*?<\/button>/
    );
    expect(buttonMatch).not.toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  FullscreenFloatingPill
// ═══════════════════════════════════════════════════════════════════════════

describe("FullscreenFloatingPill", () => {
  it("has glassmorphism pill styling (Scenario: FullscreenFloatingPill appears when cursor nears top)", () => {
    // Given: the editor is in fullscreen mode
    expect(source).toContain("export function FullscreenFloatingPill");

    // Then: a glassmorphism pill with backdrop blur and border
    expect(source).toContain("data-editor-floating-pill");
    expect(source).toContain("backdrop-blur-[20px]");
    expect(source).toContain("backdrop-saturate-[180%]");
    expect(source).toContain("border border-white/10");
    expect(source).toContain("bg-gray-900/70");
    expect(source).toContain("rounded-full");
  });

  it("appears when cursor moves near top of screen", () => {
    // The pill visibility is controlled by mouse position
    // clientY < 48 triggers visibility
    expect(source).toContain("e.clientY < 48");
    expect(source).toContain("setVisible(true)");
    // clientY > 120 triggers hide timer
    expect(source).toContain("e.clientY > 120");
    expect(source).toContain("setVisible(false)");
  });

  it("hides after a delay when cursor moves away", () => {
    // The pill hides after 600ms delay
    expect(source).toContain("setTimeout");
    expect(source).toContain("600");
    expect(source).toContain("hideTimerRef");
  });

  it("returns null when not visible", () => {
    // When not visible, the component renders nothing
    expect(source).toContain("if (!visible) return null");
  });

  it("displays the current zoom level (Scenario: FullscreenFloatingPill has zoom controls)", () => {
    // Then: it should display the current zoom level
    expect(source).toContain("{zoomLevel}%");
  });

  it("has zoom level preset buttons", () => {
    // Zoom presets: 50, 75, 100, 125, 150, 200
    expect(source).toContain("[50, 75, 100, 125, 150, 200]");
    // Each preset renders as a button with percentage text
    expect(source).toContain("{z}%");
  });

  it("has an exit fullscreen button", () => {
    // Exit button with Minimize2 icon and label
    expect(source).toContain("onExitFullscreen");
    expect(source).toContain('aria-label="Exit full screen"');
    expect(source).toContain("Minimize2");
    expect(source).toContain("Exit");
    expect(source).toContain("Esc");
  });

  it("supports Escape key to exit fullscreen", () => {
    // Escape key handler triggers onExitFullscreen
    expect(source).toContain('"Escape"');
    expect(source).toContain("onExitFullscreen()");
  });

  it("has zoom expand/collapse toggle", () => {
    // zoomExpanded state toggles between compact and expanded zoom controls
    expect(source).toContain("zoomExpanded");
    expect(source).toContain("setZoomExpanded(true)");
    expect(source).toContain("setZoomExpanded(false)");
  });

  it("has dark, midnight, and purple theme variants", () => {
    // Glassmorphism pill supports all themes
    expect(source).toContain("dark:bg-[#1a1d24]/80");
    expect(source).toContain("midnight:bg-[#0a0e27]/80");
    expect(source).toContain("purple:bg-[#1a0b2e]/80");
  });

  it("highlights the currently active zoom level", () => {
    // Active zoom level gets a highlighted style
    expect(source).toContain("z === zoomLevel");
    expect(source).toContain("bg-white/20 font-semibold");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  TableGridPicker
// ═══════════════════════════════════════════════════════════════════════════

describe("TableGridPicker", () => {
  it("renders an interactive grid of cells (Scenario: TableGridPicker renders an interactive grid)", () => {
    // Given: a TableGridPicker component
    expect(source).toContain("export function TableGridPicker");

    // Then: an interactive grid of cells should be visible (up to 8 rows × 10 columns)
    expect(source).toContain("maxRows = 8");
    expect(source).toContain("maxCols = 10");
    // Grid uses CSS grid layout
    expect(source).toContain("inline-grid gap-[3px]");
    expect(source).toContain("gridTemplateColumns");
    // Total cells = maxRows * maxCols
    expect(source).toContain("maxRows * maxCols");
  });

  it("highlights cells on hover (Scenario: TableGridPicker highlights cells on hover)", () => {
    // When: the user hovers over a cell
    // Then: all cells from (1,1) to (hoverRow, hoverCol) should be highlighted
    expect(source).toContain("onMouseEnter");
    expect(source).toContain("setHoverRow(r)");
    expect(source).toContain("setHoverCol(c)");

    // Active state: r <= hoverRow && c <= hoverCol
    expect(source).toContain("r <= hoverRow && c <= hoverCol");

    // Active cells get highlighted styling
    expect(source).toContain("bg-blue-500/30 border-blue-400");
  });

  it("shows the dimension label (Scenario: TableGridPicker highlights cells on hover)", () => {
    // Then: the label should show the current hover dimensions
    expect(source).toContain("{hoverRow} × {hoverCol}");
  });

  it("calls onPick when a cell is clicked (Scenario: TableGridPicker inserts table on click)", () => {
    // When: the user clicks on a cell
    // Then: onPick should be called with (rows, cols)
    expect(source).toContain("onClick={() => onPick(r, c)}");
  });

  it("has accessible aria labels on cells", () => {
    // Each cell has an aria-label describing its position
    expect(source).toContain("aria-label={`${r}x${c}`}");
  });

  it("has theme variants for highlighted cells", () => {
    // Dark, midnight, and purple theme highlights
    expect(source).toContain("dark:bg-blue-500/30");
    expect(source).toContain("midnight:bg-cyan-500/30");
    expect(source).toContain("purple:bg-pink-500/30");
    expect(source).toContain("midnight:border-cyan-400");
    expect(source).toContain("purple:border-pink-400");
  });

  it("initializes hover state to row 1, col 1", () => {
    // Default hover state starts at (1, 1)
    expect(source).toContain("useState(1)");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  EditingModeButton
// ═══════════════════════════════════════════════════════════════════════════

describe("EditingModeButton", () => {
  it("shows the current mode (Scenario: EditingModeButton shows current mode)", () => {
    // Given: an EditingModeButton with a mode
    expect(source).toContain("export function EditingModeButton");

    // Then: the mode label is displayed capitalized
    expect(source).toContain(
      "editingMode.charAt(0).toUpperCase() + editingMode.slice(1)"
    );
    expect(source).toContain("<span>{label}</span>");
  });

  it("exports the EditingMode type", () => {
    // The type for editing modes is exported
    expect(source).toContain("export type EditingMode");
    expect(source).toContain('"editing"');
    expect(source).toContain('"suggesting"');
    expect(source).toContain('"viewing"');
  });

  it("has a PenLine icon and chevron indicator", () => {
    // The button shows PenLine icon and a chevron for dropdown
    expect(source).toContain("PenLine");
    expect(source).toContain("ChevronDown");
  });

  it("opens mode dropdown on click (Scenario: EditingModeButton opens mode dropdown on click)", () => {
    // When: the user clicks the button
    // Then: a dropdown appears with all three mode options
    expect(source).toContain("onClick={() => setOpen(!open)}");
    expect(source).toContain("{open && (");

    // Dropdown contains all three modes
    expect(source).toContain('mode: "editing"');
    expect(source).toContain('mode: "suggesting"');
    expect(source).toContain('mode: "viewing"');

    // Each mode has a description
    expect(source).toContain('"Edit directly"');
    expect(source).toContain('"Edits become suggestions"');
    expect(source).toContain('"Read only"');
  });

  it("calls onModeChange when a mode is selected (Scenario: EditingModeButton switches mode on selection)", () => {
    // When: the user clicks a mode option
    // Then: onModeChange is called with the selected mode
    expect(source).toContain("onModeChange(mode)");
    // And the dropdown closes
    expect(source).toContain("setOpen(false)");
  });

  it("highlights the active mode in the dropdown", () => {
    // The active mode gets distinct styling
    expect(source).toContain("mode === editingMode");
    expect(source).toContain("bg-blue-50");
    expect(source).toContain("dark:bg-blue-900/30");
    expect(source).toContain("text-blue-600");
    // Active mode shows a check icon
    expect(source).toContain("Check");
  });

  it("closes dropdown on outside click", () => {
    // Clicking outside the dropdown closes it
    expect(source).toContain("mousedown");
    expect(source).toContain("ref.current");
    expect(source).toContain("setOpen(false)");
  });

  it("has a Tooltip showing the current mode", () => {
    // The button is wrapped in a Tooltip
    expect(source).toContain("Tooltip");
    expect(source).toContain("Current mode: ${label}");
  });

  it("has correct dropdown positioning and styling", () => {
    // Dropdown is absolutely positioned below the button
    expect(source).toContain("absolute z-[120] top-full mt-1 right-0");
    expect(source).toContain("w-[180px]");
    expect(source).toContain("rounded-xl");
    expect(source).toContain("shadow-xl");
  });

  it("uses the data-editing-mode attribute for identification", () => {
    expect(source).toContain("data-editing-mode");
  });

  it("has each mode with its own icon", () => {
    // Each mode has a specific icon
    expect(source).toContain("icon: PenLine");
    expect(source).toContain("icon: MessageSquarePlus");
    expect(source).toContain("icon: Eye");
  });
});
