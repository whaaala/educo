Feature: Slide Editor Menu Bar
  Complete menu system for the Presentation Slide Editor with
  File, Edit, View, Insert, Format, Slide, Arrange, Tools, and Help menus.

  # ──────────────────────────────────────────────────
  # Menu Bar Structure
  # ──────────────────────────────────────────────────

  Scenario: Menu bar renders all 9 top-level menus
    Given the slide editor is loaded
    Then the menu bar should display: File, Edit, View, Insert, Format, Slide, Arrange, Tools, Help

  Scenario: Clicking a menu opens its dropdown
    When the user clicks "File"
    Then the File dropdown should appear with glassmorphism styling
    And clicking another menu should close File and open the new one

  Scenario: Clicking outside closes the menu
    Given the File menu is open
    When the user clicks outside the menu
    Then the dropdown should close

  # ──────────────────────────────────────────────────
  # File Menu
  # ──────────────────────────────────────────────────

  Scenario: File menu has all required items
    When the File menu is open
    Then it should contain: New (submenu), Open, Import slides, Make a copy (submenu),
      Share (submenu), Download (submenu), Rename, Move to bin, Page setup,
      Print preview, Print

  Scenario: File > New has Presentation and From template gallery
    When hovering over File > New
    Then a submenu should show "Presentation" and "From template gallery"

  Scenario: File > Download has all export formats
    When hovering over File > Download
    Then it should show: .pptx, .odp, .pdf, .txt, JPEG, PNG, SVG options

  # ──────────────────────────────────────────────────
  # Edit Menu
  # ──────────────────────────────────────────────────

  Scenario: Edit menu has standard editing commands
    When the Edit menu is open
    Then it should contain: Undo, Redo, Cut, Copy, Paste, Paste without formatting,
      Select all, Delete, Duplicate, Find and replace
    And Undo should show shortcut "Ctrl+Z"
    And Duplicate should show shortcut "Ctrl+D"

  # ──────────────────────────────────────────────────
  # View Menu
  # ──────────────────────────────────────────────────

  Scenario: View menu has mode, slideshow, and zoom options
    When the View menu is open
    Then it should contain: Mode (submenu), Slideshow, Motion, Theme builder,
      Grid view, Show ruler, Guides (submenu), Snap to (submenu),
      Show filmstrip, Zoom (submenu), Full screen

  Scenario: View > Mode has Editing, Commenting, Viewing
    When hovering over View > Mode
    Then the submenu should show Editing, Commenting, and Viewing

  Scenario: View > Zoom has Fit and percentage options
    When hovering over View > Zoom
    Then it should show: Fit, 50%, 75%, 100%, 150%, 200%

  # ──────────────────────────────────────────────────
  # Insert Menu
  # ──────────────────────────────────────────────────

  Scenario: Insert menu has all insertable elements
    When the Insert menu is open
    Then it should contain: Image (submenu), Shape (submenu), Table,
      Diagram (submenu), Chart (submenu), Text box, Word art,
      Line (submenu), Comment, New slide

  Scenario: Insert > Shape has Shapes, Arrows, Callouts, Equation
    When hovering over Insert > Shape
    Then the submenu should show Shapes, Arrows, Callouts, Equation

  Scenario: Insert > Line has connector types
    When hovering over Insert > Line
    Then it should show: Line, Arrow, Elbow connector, Curved connector,
      Curve, Polyline, Scribble

  # ──────────────────────────────────────────────────
  # Format Menu (Context-Aware)
  # ──────────────────────────────────────────────────

  Scenario: Format menu has text, alignment, and border options
    When the Format menu is open
    Then it should contain: Text (submenu), Align & indent (submenu),
      Lists (submenu), Borders & lines (submenu), Format options, Clear formatting

  Scenario: Format > Text has capitalization options
    When hovering over Format > Text
    Then it should include: Bold, Italic, Underline, Strikethrough,
      Superscript, Subscript, Increase/Decrease font size,
      UPPERCASE, lowercase, Title Case

  Scenario: Format > Align & indent > Line spacing
    When hovering Format > Align & indent > Line spacing
    Then it should show: Single, 1.15, 1.5, Double, Custom

  # ──────────────────────────────────────────────────
  # Slide Menu
  # ──────────────────────────────────────────────────

  Scenario: Slide menu has slide management options
    When the Slide menu is open
    Then it should contain: New slide, Duplicate slide, Delete slide,
      Skip slide, Move slide (submenu), Change background,
      Apply layout (submenu), Transitions, Edit theme

  Scenario: Slide > Apply layout has 5 layouts
    When hovering over Slide > Apply layout
    Then it should show: Title Slide, Section Header, Title and Body,
      Two Columns, Blank

  Scenario: Slide > Move slide has 4 directions
    When hovering over Slide > Move slide
    Then it should show: Move to beginning, Move up, Move down, Move to end

  # ──────────────────────────────────────────────────
  # Arrange Menu
  # ──────────────────────────────────────────────────

  Scenario: Arrange menu has ordering and alignment
    When the Arrange menu is open
    Then it should contain: Order (submenu), Align (submenu),
      Distribute (submenu), Center on page (submenu),
      Rotate (submenu), Group, Ungroup

  Scenario: Arrange > Order has front/back options with shortcuts
    When hovering over Arrange > Order
    Then "Bring to front" should show "Ctrl+Shift+↑"
    And "Send to back" should show "Ctrl+Shift+↓"

  Scenario: Arrange > Align has 6 alignment options
    When hovering over Arrange > Align
    Then it should show: Left, Center, Right, Top, Middle, Bottom

  # ──────────────────────────────────────────────────
  # Tools Menu
  # ──────────────────────────────────────────────────

  Scenario: Tools menu has spelling, explore, and accessibility
    When the Tools menu is open
    Then it should contain: Spelling (submenu), Explore, Linked objects,
      Dictionary, Voice type speaker notes, Accessibility settings

  # ──────────────────────────────────────────────────
  # Help Menu
  # ──────────────────────────────────────────────────

  Scenario: Help menu has search and shortcuts
    When the Help menu is open
    Then it should contain: Search the menus, Keyboard shortcuts,
      Training, Updates

  # ──────────────────────────────────────────────────
  # Action Wiring
  # ──────────────────────────────────────────────────

  Scenario: Menu actions trigger correct editor operations
    When the user clicks Slide > New slide
    Then a new slide should be added
    When the user clicks Slide > Duplicate slide
    Then the current slide should be duplicated
    When the user clicks View > Slideshow
    Then the slideshow should start

  Scenario: Format actions use execCommand
    When the user clicks Format > Text > Bold
    Then document.execCommand("bold") should be called
    When the user clicks Format > Clear formatting
    Then document.execCommand("removeFormat") should be called
