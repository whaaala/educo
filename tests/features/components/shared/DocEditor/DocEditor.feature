Feature: DocEditor comprehensive look and feel verification
  The DocEditor component provides a rich document editing experience
  with themed styling, toolbar controls, menus, dialogs, and layout modes.

  Background:
    Given a DocEditor rendered with default content
    And the onChange callback is provided

  # ──────────────────────────────────────────────────
  # Template Chips Styling
  # ──────────────────────────────────────────────────

  Scenario: Template chips are hidden when document has content
    Given a DocEditor rendered with non-empty content and templates
    Then the template chip button should not be in the DOM

  Scenario: Template chip buttons appear when doc is empty
    Given a DocEditor rendered with empty content and templates
    Then the template chip button should be present
    And the chip should have inline-flex, rounded-full, text-[12px], font-semibold, and border classes

  Scenario: Template chip icon SVG has color classes
    Given a DocEditor rendered with empty content and templates
    And the template chip exists
    Then the SVG icon should have w-3.5, h-3.5, text-gray-500, and dark:text-gray-400 classes

  Scenario: Template chip label span has text colors
    Given a DocEditor rendered with empty content and templates
    And the template chip exists
    Then the label span should have text-gray-700 and dark:text-gray-200 classes

  # ──────────────────────────────────────────────────
  # Toolbar Dropdown Trigger Styling
  # ──────────────────────────────────────────────────

  Scenario: Zoom dropdown trigger has correct styling
    Then the Zoom dropdown button should have h-7, inline-flex, items-center, rounded, text-[11px], and font-medium classes
    And the Zoom dropdown should display "100%"

  Scenario: Font family dropdown trigger shows current font label
    Then the Font family dropdown should display "Arial"
    And it should have h-7 and rounded classes

  Scenario: Font size dropdown trigger shows current size
    Then the Font size dropdown should display "11"

  Scenario: Text color dropdown trigger exists with an icon
    Then the Text color button should exist
    And it should contain an SVG icon

  Scenario: Highlight color dropdown trigger exists with an icon
    Then the Highlight color button should exist
    And it should contain an SVG icon

  Scenario: Line and paragraph spacing dropdown trigger exists with an icon
    Then the Line and paragraph spacing button should exist
    And it should contain an SVG icon

  # ──────────────────────────────────────────────────
  # Toolbar Buttons
  # ──────────────────────────────────────────────────

  Scenario: Strikethrough is in the toolbar, Superscript and Subscript are not
    Then the "Strikethrough (Alt+Shift+5)" button should be present in the toolbar
    And the "Superscript" button should not be present in the toolbar
    And the "Subscript" button should not be present in the toolbar

  Scenario: Alignment dropdown exists in toolbar
    Then the "Align & indent" dropdown should be present

  Scenario: Lists dropdown exists in toolbar
    Then the "Lists" dropdown should be present

  Scenario: Increase and Decrease indent buttons exist with styling
    Then the "Increase indent" button should be present
    And the "Decrease indent" button should be present
    And both indent buttons should have w-7, h-7, inline-flex, items-center, justify-center, and rounded classes

  Scenario Outline: New toolbar buttons exist with correct styling
    Then the "<button_label>" toolbar button should exist
    And it should have w-7, h-7, inline-flex, items-center, justify-center, and rounded classes

    Examples:
      | button_label                  |
      | Search                        |
      | Print (Ctrl+P)                |
      | Spelling and grammar check    |
      | Paint format                  |
      | Insert image                  |
      | Clear formatting              |
      | Add comment (Ctrl+Alt+M)      |

  # ──────────────────────────────────────────────────
  # Fullscreen State
  # ──────────────────────────────────────────────────

  Scenario: Root has relative positioning in default state
    Then the root element should have "relative" positioning
    And the root element should not have "fixed" positioning

  Scenario: No Exit full screen button in default state
    Then the "Exit full screen" button should not be present

  # ──────────────────────────────────────────────────
  # Find & Replace Panel Styling
  # ──────────────────────────────────────────────────

  Scenario: Find/Replace floating panel has correct position and styling classes
    When the Find and Replace panel is opened via Edit menu
    Then the panel should have absolute, right-3, top-[92px], z-[150], w-[300px], rounded-2xl, border, backdrop-blur-md, shadow-xl, and p-3 classes

  Scenario: Find/Replace panel is non-blocking (no backdrop overlay)
    When the Find and Replace panel is opened via Edit menu
    Then the panel should NOT have inset-0 class
    And no blocking DocDialog overlay should exist

  Scenario: Find/Replace close button exists with aria-label
    When the Find and Replace panel is opened via Edit menu
    Then a close button with aria-label "Close find and replace" should exist

  Scenario: Find/Replace panel displays the title text
    When the Find and Replace panel is opened via Edit menu
    Then the panel should contain "Find and replace" title text

  Scenario: Find section groups input and Find next button together
    When the Find and Replace panel is opened via Edit menu
    Then the Find section should contain a "Find…" input
    And a "Find next" button grouped with it

  Scenario: Replace section groups input with Replace and Replace all buttons
    When the Find and Replace panel is opened via Edit menu
    Then the Replace section should contain a "Replace with…" input
    And "Replace" and "Replace all" buttons grouped with it

  Scenario: Find and Replace sections are separated by a divider
    When the Find and Replace panel is opened via Edit menu
    Then a visual divider should separate the Find section from the Replace section

  Scenario: Closing the panel clears highlights
    When the Find and Replace panel is opened via Edit menu
    And the user clicks the close button
    Then the panel should be removed from the DOM
    And no highlight marks should remain in the editor

  Scenario: Clicking outside the panel clears highlights
    Given the Find and Replace panel is open with active highlights
    When the user clicks on the editor content area (outside the panel)
    Then all highlight marks should be removed

  Scenario: Reopening the panel restores highlights for existing query
    Given the user previously searched for a word and closed the panel
    When the user reopens the Find and Replace panel
    Then the previous query should still be in the Find input
    And the first match should be highlighted automatically

  # ──────────────────────────────────────────────────
  # Table Editor Panel
  # ──────────────────────────────────────────────────

  Scenario: No table editor panel in default render
    Then the table editor panel should not be present

  # ──────────────────────────────────────────────────
  # Toast Notification
  # ──────────────────────────────────────────────────

  Scenario: No toast visible in default render
    Then no toast notification should be visible

  Scenario: Toast appears after File > New > Document action
    When the File menu is opened
    And the "New" submenu is opened
    And the "Document" submenu item is clicked
    Then the toast should be visible
    And the toast should have absolute, bottom-4, left-1/2, -translate-x-1/2, z-[220], rounded-xl, bg-gray-900, text-white, text-[12px], and shadow-xl classes

  # ──────────────────────────────────────────────────
  # Default UI States
  # ──────────────────────────────────────────────────

  Scenario: No equation toolbar by default
    Then the equation toolbar input should not be present

  Scenario: Ruler is visible by default
    Then the ruler area should be present

  Scenario: ContentEditable is true in default editing mode
    Then a contentEditable element should be present

  Scenario: Menubar is visible with data-doc-menubar attribute
    Then the menubar should be present

  Scenario: Header has data-doc-header attribute
    Then the header should be present

  Scenario: Toolbar has data-doc-toolbar attribute
    Then the toolbar should be present

  Scenario: Page label is present in print layout
    Then the page label should be present
    And the page label should contain "Page"

  Scenario: Toolbar Bold button is visible
    Then the "Bold (Ctrl+B)" button should be present

  # ──────────────────────────────────────────────────
  # ReadOnly Mode
  # ──────────────────────────────────────────────────

  Scenario: Toolbar buttons have disabled opacity in readOnly mode
    Given a DocEditor rendered in readOnly mode
    Then the "Bold (Ctrl+B)" button should be disabled
    And the "Bold (Ctrl+B)" button should have the "disabled:opacity-50" class

  Scenario: Toolbar buttons have disabled cursor in readOnly mode
    Given a DocEditor rendered in readOnly mode
    Then the "Bold (Ctrl+B)" button should be disabled
    And the "Bold (Ctrl+B)" button should have the "disabled:cursor-not-allowed" class

  # ──────────────────────────────────────────────────
  # Non-printing Characters
  # ──────────────────────────────────────────────────

  Scenario: ContentEditable does not have pilcrow class by default
    Then the editable area should not have the pilcrow pseudo-element class

  # ──────────────────────────────────────────────────
  # File Menu Items
  # ──────────────────────────────────────────────────

  Scenario: File menu contains expected core items including new additions
    When the File menu is opened
    Then the File menu should contain "New"
    And the File menu should contain "Open"
    And the File menu should contain "Make a copy"
    And the File menu should contain "Rename"
    And the File menu should contain "Move"
    And the File menu should contain "Add shortcut to Drive"
    And the File menu should contain "Move to trash"
    And the File menu should contain "Details"
    And the File menu should contain "Print"

  Scenario: File > Share submenu contains correct items
    When the File menu is opened
    And the "Share" submenu is hovered to reveal its items
    Then the submenu should contain "Share with others"
    And the submenu should contain "Publish"
    And the submenu should not contain "Publish to web"

  # ──────────────────────────────────────────────────
  # Menu Item Tooltips
  # ──────────────────────────────────────────────────

  Scenario: Menu items do not have native title attribute on label spans
    When the File menu is opened
    Then no span inside menu item buttons should have a title attribute

  Scenario Outline: Toolbar buttons use aria-label instead of title attribute
    Then the "<button_label>" button should have aria-label
    And the "<button_label>" button should not have a title attribute

    Examples:
      | button_label      |
      | Bold (Ctrl+B)     |
      | Italic (Ctrl+I)   |
      | Undo (Ctrl+Z)     |

  Scenario Outline: Toolbar dropdown buttons use aria-label instead of title attribute
    Then the "<dropdown_label>" dropdown should have aria-label
    And the "<dropdown_label>" dropdown should not have a title attribute

    Examples:
      | dropdown_label |
      | Zoom           |
      | Font family    |
      | Font size      |
      | Styles         |

  # ──────────────────────────────────────────────────
  # Publish Dialog
  # ──────────────────────────────────────────────────

  Scenario: Publish dialog opens when navigating File > Share > Publish
    When the File menu is opened
    And the "Share" submenu is hovered
    And the "Publish" button is clicked
    Then the Publish dialog should be open
    And the dialog should contain "Publish"

  Scenario: Publish dialog has Classes, Groups, and All Users tabs
    When the Publish dialog is opened via File > Share > Publish
    Then the dialog should contain "Classes"
    And the dialog should contain "Groups"
    And the dialog should contain "All Users"

  Scenario: Publish dialog has Attach to subject / session section
    When the Publish dialog is opened via File > Share > Publish
    Then the dialog should contain "Attach to subject / session"

  Scenario: Publish button is disabled when no scope is selected
    When the Publish dialog is opened via File > Share > Publish
    Then the Publish action button in the dialog footer should be disabled

  # ──────────────────────────────────────────────────
  # Version History
  # ──────────────────────────────────────────────────

  Scenario: Version history submenu contains expected items
    When the Version history submenu is opened via File menu
    Then "Save version" should be present
    And "View versions" should be present

  Scenario: View versions dialog shows empty state message
    When the Version history submenu is opened via File menu
    And "View versions" is clicked
    Then the dialog should show "No saved versions yet"
    And the dialog should mention "automatically"

  Scenario: Save version creates a version entry visible in the dialog
    When the Version history submenu is opened via File menu
    And "Save version" is clicked
    And the Version history submenu is opened again
    And "View versions" is clicked
    Then the dialog should show "Manual"
    And the dialog should show "Manual save"
    And the empty state message should not appear

  # ──────────────────────────────────────────────────
  # Print Layout
  # ──────────────────────────────────────────────────

  Scenario: Default print layout has correct background on editor root area
    Then the editor root area should have min-h-full, py-6, bg-gray-50, and dark:bg-gray-950 classes

  Scenario: Page wrapper has rounded shadow
    Then the page wrapper should have rounded-sm, shadow-md, bg-white, and dark:bg-gray-950 classes

  Scenario: Page wrapper has theme border classes
    Then the page wrapper should have border, border-gray-200/80, and dark:border-gray-800 classes

  # ══════════════════════════════════════════════════
  # Visual / CSS Styling Verification
  # ══════════════════════════════════════════════════

  # ──────────────────────────────────────────────────
  # Root Container
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Root has flex column layout with rounded border
    Then the root element should have flex, flex-col, w-full, and rounded-xl classes

  @visual
  Scenario: Root has light and dark theme border classes
    Then the root element should have border, border-gray-200, dark:border-gray-700, midnight:border-cyan-500/20, and purple:border-pink-500/20 classes

  @visual
  Scenario: Root has theme background classes
    Then the root element should have bg-white, dark:bg-gray-900, midnight:bg-[#0d1526], and purple:bg-[#1f1035] classes

  @visual
  Scenario: Root has shadow-sm class
    Then the root element should have the shadow-sm class

  # ──────────────────────────────────────────────────
  # Header Row
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Header has theming with border-b and backdrop-blur
    Given the document title input exists
    Then the header wrapper should have px-4, pt-3, pb-2, border-b, border-gray-100, dark:border-gray-800, midnight:border-cyan-500/10, purple:border-pink-500/10, bg-white/70, dark:bg-gray-900/40, midnight:bg-[#0d1526]/60, purple:bg-[#1f1035]/60, and backdrop-blur classes

  @visual
  Scenario: Doc icon has blue background with rounded-xl
    Then the doc icon should have w-9, h-9, rounded-xl, bg-blue-600, flex, items-center, justify-center, text-white, and shadow-sm classes

  @visual
  Scenario: Title input has transparent background and theme text colors
    Then the title input should have bg-transparent, text-[18px], font-semibold, text-gray-800, dark:text-gray-100, midnight:text-cyan-50, and purple:text-pink-50 classes

  # ──────────────────────────────────────────────────
  # Menubar
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Menubar has theme text colors and proper font size
    Then the menubar should have text-[13px], text-gray-700, and dark:text-gray-200 classes

  @visual
  Scenario: Menu root buttons have correct layout and hover classes when inactive
    Given at least 4 menu root elements exist
    Then the first menu button should have px-2, py-1, rounded-md, transition-colors, and cursor-pointer classes
    And it should have hover:bg-gray-100/70, dark:hover:bg-gray-800/60, midnight:hover:bg-cyan-500/8, and purple:hover:bg-pink-500/8 classes

  # ──────────────────────────────────────────────────
  # Toolbar
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Toolbar buttons have hover backgrounds and rounded corners
    Then the Bold button should have w-7, h-7, inline-flex, items-center, justify-center, rounded, hover:bg-gray-100, dark:hover:bg-gray-800, midnight:hover:bg-cyan-500/10, purple:hover:bg-pink-500/10, transition-colors, and cursor-pointer classes

  @visual
  Scenario Outline: All standard toolbar buttons render with correct classes
    Then the "<button_label>" button should exist
    And it should have w-7, h-7, inline-flex, items-center, justify-center, and rounded classes

    Examples:
      | button_label                  |
      | Undo (Ctrl+Z)                |
      | Redo (Ctrl+Y)                |
      | Bold (Ctrl+B)                |
      | Italic (Ctrl+I)              |
      | Underline (Ctrl+U)           |
      | Strikethrough (Alt+Shift+5)  |
      | Insert link (Ctrl+K)         |
      | Search                        |
      | Print (Ctrl+P)                |
      | Spelling and grammar check    |
      | Paint format                  |
      | Insert image                  |
      | Clear formatting              |
      | Add comment (Ctrl+Alt+M)      |

  @visual
  Scenario: Toolbar button icons have theme color classes
    Given the Bold button exists
    Then the SVG icon inside should have w-4, h-4, text-gray-600, dark:text-gray-200, midnight:text-cyan-100, and purple:text-pink-100 classes

  @visual
  Scenario: Toolbar dividers have theme colors
    Given at least one toolbar divider exists
    Then the first divider should have w-px, h-5, bg-gray-300, dark:bg-gray-600, midnight:bg-cyan-500/15, purple:bg-pink-500/15, and mx-0.5 classes

  @visual
  Scenario: Paragraph style dropdown has correct styling and shows Normal text
    Then the Styles dropdown should have h-7, inline-flex, items-center, rounded, text-[11px], and font-medium classes
    And the Styles dropdown should display "Normal text"

  # ──────────────────────────────────────────────────
  # Page Surface (Editor Area)
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Editor area has print layout background
    Then the editor root should have min-h-full, py-6, bg-gray-50, dark:bg-gray-950, midnight:bg-[#06101f], and purple:bg-[#12061f] classes

  @visual
  Scenario: Page wrapper has theme backgrounds and borders with rounded shadow
    Then the page wrapper should have w-full, rounded-sm, shadow-md, bg-white, dark:bg-gray-950, midnight:bg-[#0b1220], purple:bg-[#170a27], border, border-gray-200/80, dark:border-gray-800, midnight:border-cyan-500/10, and purple:border-pink-500/10 classes

  @visual
  Scenario: Content editable area has theme text colors
    Then the contentEditable area should have outline-none, overflow-hidden, relative, text-[14px], leading-6, text-gray-800, dark:text-gray-100, midnight:text-cyan-50, and purple:text-pink-50 classes

  @visual
  Scenario: Content editable area has theme selection colors
    Then the contentEditable area should have selection:bg-blue-200/60, dark:selection:bg-blue-500/25, midnight:selection:bg-cyan-500/20, and purple:selection:bg-pink-500/20 classes

  @visual
  Scenario: Content editable area has typography classes for headings and lists
    Then the contentEditable area should have [&_h2]:text-[20px], [&_h2]:leading-7, [&_h2]:font-bold, [&_h2]:mt-6, [&_h2]:mb-3, [&_p]:my-2, [&_ul]:list-disc, [&_ul]:pl-6, [&_ul]:my-3, [&_ol]:list-decimal, [&_ol]:pl-6, and [&_ol]:my-3 classes

  @visual
  Scenario: Content editable area has link styling classes
    Then the contentEditable area should have [&_a]:text-blue-600, dark:[&_a]:text-blue-400, and [&_a]:underline classes

  @visual
  Scenario: Content editable area has cursor-text when editable
    Then the contentEditable area should have the cursor-text class

  # ══════════════════════════════════════════════════
  # Functional / Behavioral Tests
  # ══════════════════════════════════════════════════

  # ──────────────────────────────────────────────────
  # Tab Management
  # ──────────────────────────────────────────────────

  Scenario: Create a new tab
    When the user creates a new tab
    Then a toast should show "New tab created"
    And the tab list should contain 2 tabs

  Scenario: Switch between tabs
    Given two tabs exist
    When the user switches to the second tab
    Then the second tab should be active

  Scenario: Delete a tab
    Given two tabs exist
    When the user deletes the second tab
    Then a toast should show "Tab deleted"
    And the tab list should contain 1 tab

  Scenario: Cannot delete the only tab
    Given only one tab exists
    When the user tries to delete it
    Then a toast should show "Cannot delete the only tab"
    And the tab list should still contain 1 tab

  Scenario: Duplicate a tab
    When the user duplicates the current tab
    Then a toast should show "Tab duplicated"
    And the tab list should contain 2 tabs

  # ──────────────────────────────────────────────────
  # Text Formatting Execution
  # ──────────────────────────────────────────────────

  Scenario: Bold formatting is applied
    Given text is selected in the editor
    When the user clicks the Bold button
    Then the selected text should be wrapped in bold formatting

  Scenario: Italic formatting is applied
    Given text is selected in the editor
    When the user clicks the Italic button
    Then the selected text should be wrapped in italic formatting

  Scenario: Underline formatting is applied
    Given text is selected in the editor
    When the user clicks the Underline button
    Then the selected text should be wrapped in underline formatting

  Scenario: Clear formatting removes all formatting
    Given formatted text is selected in the editor
    When the user clicks the Clear formatting button
    Then the text should have no formatting

  # ──────────────────────────────────────────────────
  # Font Changes
  # ──────────────────────────────────────────────────

  Scenario: Font family change updates the editor
    When the user selects "Georgia" from the font family dropdown
    Then the font family dropdown should display "Georgia"

  Scenario: Font size change updates the editor
    When the user selects "24" from the font size dropdown
    Then the font size dropdown should display "24"

  # ──────────────────────────────────────────────────
  # Line Spacing
  # ──────────────────────────────────────────────────

  Scenario: Line spacing change updates the editor
    When the user selects "Double" from the line spacing dropdown
    Then the line spacing should be applied to the content

  # ──────────────────────────────────────────────────
  # Zoom
  # ──────────────────────────────────────────────────

  Scenario: Zoom level updates the display
    When the user selects "150%" from the zoom dropdown
    Then the zoom dropdown should display "150%"
    And the editor content should be scaled accordingly

  # ──────────────────────────────────────────────────
  # Document Operations (File Menu)
  # ──────────────────────────────────────────────────

  Scenario: New document resets the editor
    When the user clicks File > New
    Then the editor content should be reset
    And a toast should show "New document created"

  Scenario: Make a copy opens in new tab
    When the user clicks File > Make a copy
    Then a toast should show "Copy opened in new tab"

  Scenario: Rename document
    When the user clicks File > Rename
    Then the title input should be focused for editing

  Scenario: Copy link to clipboard
    When the user clicks the Copy link button
    Then the link should be copied to clipboard

  # ──────────────────────────────────────────────────
  # Share & Copy Formats
  # ──────────────────────────────────────────────────

  Scenario Outline: Copy document as different formats
    When the user clicks File > Share > Copy as <format>
    Then a toast should show "Copied as <FORMAT>"

    Examples:
      | format   | FORMAT   |
      | html     | HTML     |
      | markdown | MARKDOWN |
      | text     | TEXT     |
      | json     | JSON     |

  # ──────────────────────────────────────────────────
  # Download Formats
  # ──────────────────────────────────────────────────

  Scenario Outline: Download document in different formats
    When the user clicks File > Download > <format>
    Then the download should be triggered for "<format>" format

    Examples:
      | format |
      | docx   |
      | pdf    |
      | odt    |
      | txt    |
      | rtf    |
      | html   |
      | epub   |
      | md     |
      | json   |

  # ──────────────────────────────────────────────────
  # Open File
  # ──────────────────────────────────────────────────

  Scenario: Open HTML file loads content into editor
    When the user opens an HTML file
    Then the editor content should contain the file HTML
    And a toast should show "Opened HTML"

  Scenario: Open JSON file loads content into editor
    When the user opens a valid JSON document file
    Then the editor content should be populated from JSON
    And a toast should show "Opened JSON document"

  Scenario: Open invalid JSON file shows error
    When the user opens an invalid JSON file
    Then a toast should show "Invalid JSON file"

  Scenario: Open Markdown file loads content
    When the user opens a Markdown file
    Then the editor content should be populated
    And a toast should show "Opened Markdown"

  Scenario: Open text file loads content
    When the user opens a plain text file
    Then the editor content should be populated
    And a toast should show "Opened text file"

  # ──────────────────────────────────────────────────
  # Translate Document
  # ──────────────────────────────────────────────────

  Scenario: Translate document shows translating toast
    Given the editor has text content
    When the user clicks Tools > Translate document and selects a language
    Then a toast should show "Translating… (may remove formatting)"

  Scenario: Translate empty document shows nothing to translate
    Given the editor is empty
    When the user tries to translate
    Then a toast should show "Nothing to translate"

  Scenario: Translate to same language shows already in that language
    Given the editor has content in English
    When the user tries to translate to English
    Then a toast should show "Already in that language"

  # ──────────────────────────────────────────────────
  # Insert Operations
  # ──────────────────────────────────────────────────

  Scenario: Insert horizontal line
    When the user clicks Insert > Horizontal line
    Then a horizontal rule should be inserted into the editor

  Scenario: Insert page break
    When the user clicks Insert > Break > Page break
    Then a page break should be inserted into the editor

  Scenario: Insert bookmark
    When the user clicks Insert > Bookmark
    Then a bookmark marker should be inserted into the editor

  Scenario: Insert table of contents
    When the user clicks Insert > Page elements > Table of contents
    Then a table of contents placeholder should be inserted

  Scenario: Insert table via grid picker
    When the user selects a 3x3 grid in the table picker
    Then a 3-row 3-column table should be inserted into the editor

  Scenario: Insert smart chip
    When the user clicks Insert > Smart chips > Date
    Then a date chip should be inserted into the editor

  # ──────────────────────────────────────────────────
  # Template Insertion
  # ──────────────────────────────────────────────────

  Scenario: Insert meeting notes template
    Given the editor is empty with templates available
    When the user clicks the "Meeting notes" template chip
    Then the editor should contain the meeting notes template HTML

  Scenario: Insert email draft template
    Given the editor is empty with templates available
    When the user clicks the "Email draft" template chip
    Then the editor should contain the email draft template HTML

  # ──────────────────────────────────────────────────
  # Table Widget Editor
  # ──────────────────────────────────────────────────

  Scenario: Open table widget editor on table click
    Given a table exists in the editor
    When the user clicks on the table
    Then the table editor panel should appear

  Scenario: Insert row above in table
    Given the table editor panel is open
    When the user clicks "Insert row above"
    Then a new row should be added above
    And a toast should show "Row added above"

  Scenario: Insert row below in table
    Given the table editor panel is open
    When the user clicks "Insert row below"
    Then a new row should be added below
    And a toast should show "Row added below"

  Scenario: Insert column left in table
    Given the table editor panel is open
    When the user clicks "Insert column left"
    Then a new column should be added to the left
    And a toast should show "Column added left"

  Scenario: Insert column right in table
    Given the table editor panel is open
    When the user clicks "Insert column right"
    Then a new column should be added to the right
    And a toast should show "Column added right"

  Scenario: Delete row from table
    Given the table editor panel is open
    When the user clicks "Delete row"
    Then the row should be removed
    And a toast should show "Row deleted"

  Scenario: Delete column from table
    Given the table editor panel is open
    When the user clicks "Delete column"
    Then the column should be removed
    And a toast should show "Column deleted"

  Scenario: Delete entire table
    Given the table editor panel is open
    When the user clicks "Delete table"
    Then the table should be removed from the editor
    And a toast should show "Table deleted"

  Scenario: Toggle header row in table
    Given the table editor panel is open
    When the user clicks "Toggle header row"
    Then the first row should be styled as a header
    And a toast should show "Header row toggled"

  Scenario: Toggle header column in table
    Given the table editor panel is open
    When the user clicks "Toggle header column"
    Then the first column should be styled as a header
    And a toast should show "Header column toggled"

  Scenario: Merge cells in table
    Given the table editor panel is open with cells selected
    When the user clicks "Merge cells"
    Then the selected cells should be merged
    And a toast should show "Cells merged"

  Scenario: Unmerge cell in table
    Given the table editor panel is open with a merged cell selected
    When the user clicks "Unmerge"
    Then the cell should be split back
    And a toast should show "Cell unmerged"

  Scenario: Move table up
    Given the table editor panel is open
    When the user clicks "Move table up"
    Then a toast should show "Table moved up"

  Scenario: Move table down
    Given the table editor panel is open
    When the user clicks "Move table down"
    Then a toast should show "Table moved down"

  # ──────────────────────────────────────────────────
  # Find and Replace (Floating Panel)
  # ──────────────────────────────────────────────────

  Scenario: Open Find and Replace floating panel
    When the user clicks Edit > Find and replace
    Then the Find and Replace floating panel should be visible
    And the panel should NOT block document interaction
    And it should contain a "Find…" input
    And it should contain a "Replace with…" input
    And it should contain "Find next", "Replace", and "Replace all" buttons

  Scenario: Find next highlights matching text in yellow
    Given the Find and Replace panel is open
    When the user types a query in the Find input
    And clicks "Find next"
    Then the matching text should be wrapped in a yellow highlight mark
    And the match count indicator should show current/total
    And the user should still be able to interact with the document

  Scenario: Replace highlights replaced text in green
    Given the Find and Replace panel is open
    When the user types a query in Find and a replacement in Replace
    And clicks "Replace"
    Then the first match should be replaced
    And the replaced text should be wrapped in a green highlight mark
    And the user should still be able to interact with the document

  Scenario: Replace all highlights all replaced text in green
    Given the Find and Replace panel is open
    When the user types a query in Find and a replacement in Replace
    And clicks "Replace all"
    Then all matching occurrences should be replaced
    And each replaced text should be wrapped in a green highlight mark
    And the user should still be able to interact with the document

  Scenario: Closing the panel clears all find/replace highlights
    Given the Find and Replace panel is open with active highlights
    When the user clicks the close button
    Then all highlight marks should be removed from the document
    And the panel should be removed

  # ──────────────────────────────────────────────────
  # View Toggles
  # ──────────────────────────────────────────────────

  Scenario: Toggle print layout
    When the user clicks View > Show print layout
    Then the layout should switch between pageless and print layout

  Scenario: Toggle ruler visibility
    When the user clicks View > Show ruler
    Then the ruler should be toggled visible or hidden

  Scenario: Toggle non-printing characters
    When the user clicks View > Show non-printing characters
    Then non-printing characters should be visible in the editor

  Scenario: Toggle equation toolbar
    When the user clicks View > Show equation toolbar
    Then the equation toolbar should appear below the main toolbar

  Scenario: Toggle comments panel
    When the user clicks View > Comments
    Then the comments panel should be toggled

  # ──────────────────────────────────────────────────
  # Mode Switching
  # ──────────────────────────────────────────────────

  Scenario: Switch to Suggesting mode
    When the user clicks View > Mode > Suggesting
    Then the editor should be in suggesting mode

  Scenario: Switch to Viewing mode
    When the user clicks View > Mode > Viewing
    Then the editor content should not be editable

  Scenario: Switch back to Editing mode
    When the user clicks View > Mode > Editing
    Then the editor content should be editable

  # ──────────────────────────────────────────────────
  # Page Setup Dialog
  # ──────────────────────────────────────────────────

  Scenario: Open Page Setup dialog
    When the user clicks File > Page setup
    Then the Page Setup dialog should be visible
    And it should have "Pages" and "Pageless" tabs

  Scenario: Change page orientation to Landscape
    Given the Page Setup dialog is open on the Pages tab
    When the user selects "Landscape" orientation
    And clicks Apply
    Then the page dimensions should update to landscape

  Scenario: Change page color
    Given the Page Setup dialog is open
    When the user selects a page color from the color picker
    And clicks Apply
    Then the page background should change to the selected color

  Scenario: Change margins
    Given the Page Setup dialog is open
    When the user changes the top margin to 2 inches
    And clicks Apply
    Then the page margins should update

  Scenario: Switch to Pageless mode
    Given the Page Setup dialog is open
    When the user clicks the Pageless tab
    And clicks Apply
    Then the editor should switch to pageless mode

  # ──────────────────────────────────────────────────
  # Paste Operations
  # ──────────────────────────────────────────────────

  Scenario: Paste without formatting strips formatting
    When the user clicks Edit > Paste without formatting
    Then the pasted content should have no formatting

  # ──────────────────────────────────────────────────
  # Keyboard Shortcuts
  # ──────────────────────────────────────────────────

  Scenario Outline: Keyboard shortcut triggers correct action
    When the user presses <shortcut>
    Then the <action> should be triggered

    Examples:
      | shortcut         | action              |
      | Ctrl+B           | bold formatting      |
      | Ctrl+I           | italic formatting    |
      | Ctrl+U           | underline formatting |
      | Ctrl+Z           | undo                 |
      | Ctrl+Y           | redo                 |
      | Ctrl+K           | insert link dialog   |
      | Ctrl+H           | find and replace     |
      | Ctrl+P           | print                |
      | Ctrl+Enter       | page break           |
      | Ctrl+\\          | clear formatting     |
      | Ctrl+Shift+P     | fullscreen toggle    |
      | Alt+Shift+5      | strikethrough        |
      | Ctrl+.           | superscript          |
      | Ctrl+,           | subscript            |

  # ──────────────────────────────────────────────────
  # Print
  # ──────────────────────────────────────────────────

  Scenario: Print triggers window.print
    When the user clicks the Print button
    Then window.print should be called

  # ──────────────────────────────────────────────────
  # Word Count
  # ──────────────────────────────────────────────────

  Scenario: Word count dialog shows document statistics
    When the user clicks Tools > Word count
    Then the word count dialog should display page count, word count, and character count

  # ──────────────────────────────────────────────────
  # Responsive Layout
  # ──────────────────────────────────────────────────

  @responsive
  Scenario: Header has responsive padding classes
    Given a DocEditor rendered at any viewport
    Then the header should have responsive padding (px-2 sm:px-4, pt-2 sm:pt-3, pb-1.5 sm:pb-2)

  @responsive
  Scenario: Header flex gap is responsive
    Given a DocEditor rendered at any viewport
    Then the header flex row should use gap-2 sm:gap-3

  @responsive
  Scenario: Doc icon has responsive sizing
    Given a DocEditor rendered at any viewport
    Then the doc icon should use w-7 h-7 on mobile and sm:w-9 sm:h-9 on larger screens

  @responsive
  Scenario: Title input has responsive text size and max-width
    Given a DocEditor rendered at any viewport
    Then the title input should use text-[14px] sm:text-[18px] and max-w-[180px] sm:max-w-[420px]

  @responsive
  Scenario: Share button has responsive padding and text size
    Given a DocEditor rendered at any viewport
    Then the share button should use px-2.5 sm:px-4 and text-[12px] sm:text-[13px]

  @responsive
  Scenario: Menubar has responsive gap and wrapping
    Given a DocEditor rendered at any viewport
    Then the menubar should use flex-wrap, gap-1 sm:gap-2, text-[12px] sm:text-[13px]
    And overflow must remain visible so dropdown menus can render outside

  @responsive
  Scenario: Toolbar has responsive padding
    Given a DocEditor rendered at any viewport
    Then the toolbar should use px-1.5 sm:px-3, pt-1.5 sm:pt-2
    And overflow must remain visible so toolbar dropdowns can render outside

  @responsive
  Scenario: Toolbar inner flex uses wrap for responsive layout
    Given a DocEditor rendered at any viewport
    Then the toolbar inner flex should use flex-wrap

  @responsive
  Scenario: Sidebar has overlay positioning classes for mobile
    Given a DocEditor with sidebar open
    Then the sidebar should use absolute md:relative positioning with z-[100] md:z-auto

  @responsive
  Scenario: Sidebar has a mobile backdrop overlay confined to content area
    Given a DocEditor with sidebar open
    Then an absolute backdrop overlay with bg-black/20 and md:hidden should be present
    And the backdrop should only cover the content area, not the header or toolbar

  @responsive
  Scenario: Page surface container has responsive padding
    Given a DocEditor rendered at any viewport
    Then the page surface should use px-1 sm:px-2 md:px-4 and pb-2 sm:pb-4

  @responsive
  Scenario: Print layout page wrapper has responsive structure
    Given a DocEditor in print layout mode
    Then the page wrapper should have w-full rounded-sm shadow-md

  @responsive
  Scenario: Print layout page gap is responsive
    Given a DocEditor in print layout mode
    Then the page gap should use gap-3 sm:gap-6

  @responsive
  Scenario: Print layout editor root has responsive padding
    Given a DocEditor in print layout mode
    Then the editor root should use py-3 sm:py-6

  @responsive
  Scenario: Sidebar auto-collapses on mobile viewport
    Given a DocEditor on a mobile viewport (< 768px)
    Then the sidebar should be collapsed by default

  @responsive
  Scenario: Page content margins reduce on small screens
    Given a DocEditor on a mobile viewport (< 640px)
    Then the contentEditable padding should be reduced to 16px via CSS media query

  # ──────────────────────────────────────────────────
  # View Menu — Complete Structure & Modernization
  # ──────────────────────────────────────────────────

  Scenario: View menu contains Mode submenu with Editing, Suggesting, Viewing
    Given a rendered DocEditor
    When the user opens the View menu
    Then a "Mode" item with submenu should be visible
    And the submenu should contain "Editing", "Suggesting", "Viewing" options
    And the current mode should be shown as a badge on the Mode item

  Scenario: Mode submenu descriptions explain each mode
    Given the View menu is open with Mode submenu expanded
    Then "Editing" should show description "Edit the document directly"
    And "Suggesting" should show description "Edits become suggestions"
    And "Viewing" should show description "Read or print the final document"

  Scenario: Print layout toggle exists in View menu
    Given a rendered DocEditor
    When the user opens the View menu
    Then a "Print layout" toggle with description "Page breaks, margins, headers/footers" should exist

  Scenario: Pageless toggle exists in View menu
    Given a rendered DocEditor
    When the user opens the View menu
    Then a "Pageless" toggle with description "Continuous scroll, wide content" should exist

  Scenario: Print layout and Pageless are mutually exclusive
    Given the View menu is open
    When the user toggles "Print layout" on
    Then the "Pageless" toggle should be off
    And vice versa

  Scenario Outline: Show toggle exists in View menu
    Given a rendered DocEditor
    When the user opens the View menu
    Then a "<toggle>" toggle should exist with an iOS-style pill switch

    Examples:
      | toggle                       |
      | Show ruler                   |
      | Show equation toolbar        |
      | Show non-printing characters |
      | Show outline                 |
      | Show comments                |
      | Show spelling suggestions    |
      | Show grammar suggestions     |

  Scenario: Show ruler toggle slides the ruler in with spring animation
    Given a rendered DocEditor with ruler hidden
    When the user toggles "Show ruler" on
    Then the ruler should appear with a 200ms spring slide-in animation
    And the ruler container should have data-doc-ruler-container attribute

  Scenario: Show outline opens sidebar outline with animation
    Given a rendered DocEditor with headings in the document
    When the user toggles "Show outline" on
    Then the outline panel should appear with data-doc-outline-panel attribute
    And the panel should slide in from the left with spring animation

  Scenario: Full screen item exists in View menu
    Given a rendered DocEditor
    When the user opens the View menu
    Then a "Full screen" item should exist with F11 shortcut
    And it should use the Maximize2 icon when not in fullscreen

  Scenario: Zoom submenu exists with all preset levels
    Given a rendered DocEditor
    When the user opens the View menu and expands the Zoom submenu
    Then the submenu should contain "Fit", "50%", "75%", "100%", "125%", "150%", "200%"

  @visual
  Scenario: View menu uses glassmorphism surface
    Given a rendered DocEditor
    When the user opens the View menu
    Then the menu panel should have the data-doc-view-menu-panel attribute
    And it should use backdrop-blur and backdrop-saturate for frosted glass
    And it should have ambient occlusion multi-layered shadows

  @visual
  Scenario: View menu toggles use iOS-style pill switches
    Given a rendered DocEditor
    When the user opens the View menu
    Then all toggle items should have role="switch" and aria-checked attribute
    And each toggle should render a pill switch with 38px width and 22px height
    And the switch knob should animate with 200ms transition

  @visual
  Scenario: View menu items use variable typography on hover
    Given the View menu is open
    Then menu items should have font-weight 420 by default
    And font-weight should increase to 520 on hover

  @visual
  Scenario: Active mode has context-aware visual feedback
    Given a rendered DocEditor in "Suggesting" mode
    When the user opens the View menu
    Then the Mode item should show an "Suggesting" badge
    And the badge should have an amber glow color

  Scenario: Full screen shows floating haptic pill menu at top
    Given a DocEditor in full screen mode
    When the user moves the cursor near the top of the screen (< 48px)
    Then a floating pill menu should appear with slide-down animation
    And it should show the current zoom level and an exit button
    And the pill should use glassmorphism surface styling

  Scenario: Full screen floating pill hides when cursor moves away
    Given the floating pill menu is visible in full screen
    When the user moves the cursor below 120px from the top
    Then the pill should hide after 600ms delay

  Scenario: Full screen exits via Escape key
    Given a DocEditor in full screen mode
    When the user presses the Escape key
    Then the editor should exit full screen mode

  Scenario: Full screen toggles via F11 key
    Given a rendered DocEditor
    When the user presses F11
    Then the editor should enter full screen mode
    When the user presses F11 again
    Then the editor should exit full screen mode

  @responsive
  Scenario: View menu shows as bottom sheet on mobile
    Given a DocEditor on a mobile viewport (< 768px)
    When the user opens the View menu
    Then the menu should render as a bottom sheet overlay
    And it should have a drag handle at the top
    And it should have the data-doc-view-bottom-sheet attribute

  @responsive
  Scenario: Desktop View menu renders as dropdown
    Given a DocEditor on a desktop viewport (> 1024px)
    When the user opens the View menu
    Then the menu should render as a dropdown below the menu bar

  Scenario: View menu WCAG compliance
    Given a rendered DocEditor
    When the user opens the View menu
    Then all toggle items should have min-height of 44px for touch targets
    And all toggles should have aria-label attributes
    And all toggles should have aria-checked reflecting their state

  Scenario: Spelling suggestions toggle controls contentEditable spellCheck
    Given a rendered DocEditor
    When the user toggles "Show spelling suggestions" off
    Then the contentEditable element should have spellCheck=false

  Scenario: Grammar suggestions toggle stores state
    Given a rendered DocEditor
    When the user toggles "Show grammar suggestions" off
    Then the grammar suggestions state should be false

  # ──────────────────────────────────────────────────
  # Document Commenting / Review System
  # ──────────────────────────────────────────────────

  Scenario: Comments panel shows empty state when no comments exist
    Given a rendered DocEditor with showComments toggled on
    Then the comments panel should be visible
    And it should display "No comments yet" empty state
    And the empty state should show a MessageCircle icon

  Scenario: Add comment toolbar button prompts text selection
    Given a rendered DocEditor with no text selected
    When the user clicks the "Add comment" toolbar button
    Then a toast message "Select text to add a comment" should appear

  Scenario: Add comment from text selection opens popover
    Given a rendered DocEditor with text content
    When the user selects text "Hello World" in the document
    And clicks the "Add comment" toolbar button
    Then a comment creation popover should appear near the selection
    And the popover should show the selected text excerpt
    And the popover should have a textarea for entering the comment
    And the popover should have Cancel and Comment buttons

  Scenario: Submitting a comment adds it to the comments panel
    Given a comment creation popover is open with selected text
    When the user types "This needs revision" in the comment textarea
    And presses Ctrl+Enter to submit
    Then the comment should appear in the comments panel
    And the comment card should show the author name and avatar
    And the comment card should show the selected text excerpt
    And the comment card should show the comment body

  Scenario: Comment card displays author avatar with initials fallback
    Given a comment exists from a user without an avatar
    Then the comment card should show initials in a colored circle
    And the initials should be derived from the author's first and last name

  Scenario: Click comment card scrolls to highlighted text
    Given a comment exists on text in the document
    When the user clicks on the comment card in the sidebar
    Then the document should scroll to the highlighted text area
    And a brief blue flash highlight should appear on the text

  Scenario: Comment highlights appear in document for open comments
    Given comments exist on the document
    And the comments panel is visible
    Then yellow highlight marks should appear on commented text
    And the active comment's highlight should be blue
    And hovering over a highlight should change its color

  Scenario: Owner can resolve a comment
    Given a comment exists on the document
    And the current user is the document owner
    When the user hovers over the comment card
    And clicks the more actions button
    Then a dropdown should show "Resolve" and "Reject" options
    When the user clicks "Resolve"
    Then the comment status should change to "resolved"
    And a "Resolved" badge should appear on the comment card
    And the comment should move to the "Resolved" section

  Scenario: Owner can reject a comment
    Given a comment exists on the document
    And the current user is the document owner
    When the user clicks "Reject" from the comment actions
    Then the comment status should change to "rejected"
    And a "Rejected" badge should appear on the comment card

  Scenario: Resolved/rejected comments can be reopened
    Given a resolved comment exists on the document
    When the user opens the actions menu on the resolved comment
    And clicks "Reopen"
    Then the comment should return to "open" status
    And it should move back to the open comments section

  Scenario: Reply to a comment creates a thread
    Given an open comment exists
    When the user clicks the "Reply" button on the comment card
    Then a reply textarea should appear
    When the user types "I agree, will fix" and clicks Reply
    Then the reply should appear in the comment thread
    And the reply should show the replier's name and avatar

  Scenario: @mention autocomplete in comment input
    Given a comment creation popover is open
    When the user types "@" in the comment textarea
    Then a mention autocomplete dropdown should appear
    And it should list available users with avatars
    When the user selects a user from the dropdown
    Then the @mention should be inserted into the textarea

  Scenario: @mention autocomplete in reply input
    Given a reply textarea is open on a comment
    When the user types "@Syl" in the reply textarea
    Then the mention dropdown should filter to matching users
    When the user clicks a user
    Then the full @mention should be inserted

  Scenario: @mentions are highlighted in comment text
    Given a comment contains "@Sylvia Thompson" in its text
    Then the mention should be rendered in blue text with font-semibold

  Scenario: Notifications sent when comment is added
    Given the user adds a comment on selected text
    Then a "document_comment" notification should be dispatched
    And the notification should include the commenter name and document title

  Scenario: Notifications sent for @mentions
    Given the user adds a comment mentioning "@James Brown"
    Then a "document_comment_mention" notification should be dispatched
    And the notification should have high priority
    And the targetUserId should match James Brown's user ID

  Scenario: Notification sent when comment is resolved
    Given the owner resolves a comment by another user
    Then a "document_comment_resolved" notification should be dispatched to the comment author

  Scenario: Notification sent when comment is rejected
    Given the owner rejects a comment by another user
    Then a "document_comment_rejected" notification should be dispatched to the comment author

  Scenario: Notification sent when reply is added
    Given a user replies to another user's comment
    Then a "document_comment_reply" notification should be dispatched to the original comment author

  Scenario: Keyboard shortcut Ctrl+Alt+M opens comment creation
    Given a rendered DocEditor with text selected
    When the user presses Ctrl+Alt+M
    Then the comment creation popover should open

  Scenario: Escape key closes comment popover
    Given the comment creation popover is open
    When the user presses Escape
    Then the popover should close without creating a comment

  Scenario: Comments panel can be closed
    Given the comments panel is visible
    When the user clicks the X close button on the panel
    Then the comments panel should close

  Scenario: Comments panel header shows open comment count
    Given 3 open comments and 2 resolved comments exist
    Then the comments panel header should show a badge with "3"

  @visual
  Scenario: Comment card visual styling
    Given a comment card is rendered
    Then it should have rounded-xl border and p-2.5 classes
    And the active card should have border-blue-300 and bg-blue-50/60
    And the inactive card should have border-gray-100

  @visual
  Scenario: Comment popover glassmorphism styling
    Given the comment creation popover is open
    Then it should have rounded-2xl, backdrop-blur-xl, and shadow-2xl classes
    And it should have the data-doc-comment-popover attribute for animations

  @visual
  Scenario: Comments panel slide-in animation
    Given the comments panel becomes visible
    Then it should have the data-doc-comments-panel attribute
    And the CSS should apply doc-comment-slide-in animation

  @visual
  Scenario: Resolved comment visual dimming
    Given a resolved comment is displayed
    Then the comment card should have opacity-70 class

  Scenario: Comments persist to localStorage
    Given comments have been added to the document
    Then they should be saved to localStorage under "educo_doc_comments"
    And reloading the editor should restore the comments

  Scenario: Comment deletion removes from list and localStorage
    Given a comment exists
    When the user deletes the comment
    Then it should be removed from the comments panel
    And it should be removed from localStorage

  Scenario: Show Comments toggle in View menu controls panel visibility
    Given a rendered DocEditor
    When the user opens the View menu
    And toggles "Show comments" on
    Then the comments panel should appear
    When the user toggles "Show comments" off
    Then the comments panel should disappear
    And comment highlights should be removed from the document

  # ──────────────────────────────────────────────────
  # Extension Layer: Comments Panel Enhancements
  # ──────────────────────────────────────────────────

  Scenario: Top-right comment icon opens/closes comments panel
    Given a rendered DocEditor
    Then a comment icon button should be visible near the Share button
    When the user clicks the comment icon
    Then the comments panel should open
    When the user clicks the comment icon again
    Then the comments panel should close

  Scenario: Comment icon shows unread badge
    Given 3 open comments exist on the document
    Then the comment icon should show a badge with "3"

  Scenario: Floating margin bubble appears on text selection
    Given a rendered DocEditor with text content
    When the user selects text in the document
    Then a floating blue bubble should appear in the right margin
    And clicking the bubble should open the comment creation popover

  Scenario: Comments panel has "For you" and "All comments" tabs
    Given the comments panel is open
    Then two tabs should be visible: "For you" and "All comments"
    And the "All comments" tab should be selected by default

  Scenario: "For you" tab filters to user-relevant comments
    Given comments exist mentioning the current user
    When the user clicks the "For you" tab
    Then only comments where the user is mentioned or is the author should be shown

  Scenario: "For you" tab shows badge for actionable items
    Given 2 open comments mention the current user
    Then the "For you" tab should show a badge with "2"

  Scenario: Filter controls for Open/Resolved/All types
    Given the comments panel is open
    Then filter buttons should show "Open", "Resolved", and "All types"
    And "Open" should be selected by default

  Scenario: Switching to Resolved filter shows only resolved comments
    Given open and resolved comments exist
    When the user clicks the "Resolved" filter
    Then only resolved/rejected comments should be shown

  Scenario: Reset filter button appears for non-default filters
    Given the comments panel is open
    When the user selects the "Resolved" filter
    Then a "Reset filter" link should appear
    When the user clicks "Reset filter"
    Then the filter should return to "Open"

  Scenario: Empty state for "For you" tab
    Given no comments mention the current user
    When the user selects the "For you" tab
    Then the panel should show "For you will list comments that need your attention"

  Scenario: Empty state for filtered results
    Given all comments are open
    When the user selects the "Resolved" filter
    Then the panel should show "No matching results"
    And a "Reset filter" button should be visible

  Scenario: "Add comment" button at bottom of panel
    Given the comments panel is open
    Then an "Add comment" button should be visible at the bottom
    When the user clicks "Add comment" with text selected
    Then the comment creation popover should open

  @visual
  Scenario: Comment panel tab styling
    Given the comments panel is open
    Then the active tab should have border-blue-500 and text-blue-600
    And the inactive tab should have border-transparent and text-gray-500

  @visual
  Scenario: Filter button styling with segmented control
    Given the comments panel is open
    Then the active filter should have bg-white shadow-sm
    And the inactive filter should have text-gray-500

  @visual
  Scenario: Floating margin bubble animation
    Given text is selected in the document
    Then the margin bubble should appear with a pop animation
    And the bubble should be a blue circle with shadow-lg

  @visual
  Scenario: Comment card glassmorphism hover effect
    Given comments are visible in the panel
    When the user hovers over a comment card
    Then the card border should glow with rgba(59, 130, 246, 0.2)

  # ──────────────────────────────────────────────────
  # Extension Layer: View Menu Mode Checkmarks
  # ──────────────────────────────────────────────────

  Scenario: Mode submenu shows check icon for active mode
    Given the View menu is open
    When the user opens the Mode submenu
    Then the active mode should show a Check icon (not just a dot)
    And inactive modes should show no icon

  # ──────────────────────────────────────────────────
  # Extension Layer: Micro-animations
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Equation toolbar slides in with animation
    Given the equation toolbar is hidden
    When the user toggles "Show equation toolbar" on
    Then the equation toolbar should slide down with a 200ms animation
    And it should have the data-doc-equation-toolbar attribute

  # ──────────────────────────────────────────────────
  # Comment Positioning & Spatial Logic
  # ──────────────────────────────────────────────────

  Scenario: Document canvas shifts left when comments sidebar opens
    Given a DocEditor with comments
    When the comments sidebar is open
    Then the page surface should have margin-right "mr-[356px]" class
    And the sidebar should be docked to the right edge with border-l

  Scenario: Document canvas re-centers when comments sidebar closes
    Given a DocEditor with comments sidebar open
    When the user closes the comments sidebar
    Then the page surface should not have the "mr-[356px]" class
    And the transition should be smooth with "transition-[margin]" class

  @responsive
  Scenario: Mobile bottom sheet replaces sidebar on small screens
    Given a DocEditor with comments on a mobile viewport
    When the comments panel is open
    Then on desktop (md+) a docked sidebar should appear
    And on mobile (<md) a bottom sheet should appear with rounded-t-2xl and drag handle

  Scenario: Auto-open sidebar when document has unresolved comments
    Given a DocEditor loaded with existing unresolved comments
    Then the comments sidebar should be open by default
    And the first comment should be highlighted and scrolled into view

  Scenario: Sidebar stays closed after manual dismissal
    Given a DocEditor with comments sidebar auto-opened
    When the user clicks the close button on the sidebar
    Then the sidebar should close
    And it should not re-open automatically until the user clicks a comment anchor or icon

  Scenario: Sidebar re-opens when user clicks comment icon after dismissal
    Given a DocEditor with comments sidebar manually dismissed
    When the user clicks the comments icon in the header
    Then the sidebar should open again
    And the manual dismissal state should be reset

  Scenario: Tab-specific comments filtering
    Given a DocEditor with multiple tabs containing comments
    When the user switches to a different tab
    Then only comments belonging to the current tab should be shown
    And comments without a tabId should appear on all tabs

  Scenario: Tab indicator badge on comment cards
    Given a comment that belongs to "Tab 2"
    When the comment is displayed in the sidebar
    Then it should show a tab indicator badge reading "Tab 2"
    And the badge should have rounded bg-gray-100 styling

  # ──────────────────────────────────────────────────
  # Bi-directional Focus Sync
  # ──────────────────────────────────────────────────

  Scenario: Click highlighted text to scroll sidebar to matching comment (Mode B)
    Given a DocEditor with highlighted comments and sidebar open
    When the user clicks on a comment highlight mark
    Then the sidebar should auto-scroll to the matching comment card
    And the comment card should show a temporary blue ring highlight
    And the comment card should have data-active="true"

  Scenario: Click highlighted text to scroll floating card into view (Mode A)
    Given a DocEditor with highlighted comments and floating cards visible
    When the user clicks on a comment highlight mark
    Then the floating card for that comment should scroll into view
    And the floating card should show a temporary blue ring highlight

  Scenario: Click highlighted text when no comments panel is open
    Given a DocEditor with highlighted comments but no comment panel visible
    When the user clicks on a comment highlight mark
    Then floating comments mode should activate
    And the matching floating card should scroll into view with a blue ring highlight

  Scenario: Click comment card to scroll document to highlighted text
    Given a DocEditor with comments in the sidebar
    When the user clicks on a comment card
    Then the document should scroll to the highlighted text
    And the text should flash with a blue highlight effect

  # ──────────────────────────────────────────────────
  # Resolved Comment Animation
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Resolved comment fades out with animation
    Given a comment card with status "open"
    When the owner resolves the comment
    Then the card should show data-resolved="true"
    And a CSS fade-out animation should play

  # ──────────────────────────────────────────────────
  # Global Close & Layout Reversion
  # ──────────────────────────────────────────────────

  Scenario: Close button shows collapse icon with tooltip
    Given a DocEditor with comments sidebar open
    Then the close button should show the PanelRightClose icon
    And it should have a tooltip "Close comments"

  Scenario: Empty document shows centered layout with no sidebar
    Given a DocEditor with no comments
    Then the document should be centered with no margin-right offset
    And the comments sidebar should not be visible

  # ──────────────────────────────────────────────────
  # Dual-State Comment System (Mode A/B)
  # ──────────────────────────────────────────────────

  Scenario: Mode A — Floating comment pills appear when sidebar is closed
    Given a DocEditor with comments and sidebar closed
    Then individual floating comment pills should appear in the right margin
    And each pill should show the author avatar and reply count
    And the pills should have data-doc-floating-pill attribute

  Scenario: Mode B — Sidebar open hides floating pills
    Given a DocEditor with floating comment pills visible
    When the user opens the comments sidebar
    Then the floating pills should disappear
    And the full comment sidebar should be visible

  Scenario: Closing sidebar restores floating pills
    Given a DocEditor with comments sidebar open
    When the user closes the sidebar
    Then floating comment pills should reappear in the margin
    And each pill should be positioned at its highlighted text

  Scenario: Floating pill expands on click to show full interaction
    Given a floating comment pill in the margin
    When the user clicks on the pill
    Then the pill should expand to show the full comment card
    And the expanded card should have reply input, resolve, and reject buttons

  Scenario: Reply within floating pill
    Given an expanded floating comment pill
    When the user types a reply and hits Enter
    Then the reply should be added to the comment thread
    And the pill reply count should update

  Scenario: Resolve within floating pill
    Given an expanded floating comment pill
    And the current user is the document owner
    When the user clicks Resolve in the pill's actions menu
    Then the comment should be resolved
    And the pill should be removed from the margin

  Scenario: Open in sidebar from floating pill
    Given an expanded floating comment pill
    When the user clicks the "Open in sidebar" button
    Then the sidebar should open with that comment highlighted
    And the floating pills should hide (Mode B)

  Scenario: Dismiss All floating comments
    Given floating comment pills are visible
    When the user clicks the "Dismiss all" button
    Then all floating pills should disappear
    And the document should re-center to full width
    And floating pills should not reappear until user clicks a comment anchor

  Scenario: Default state shows floating pills on load
    Given a DocEditor loaded with existing unresolved comments
    Then floating comment pills should be visible by default (Mode A)
    And the sidebar should not be open

  @visual
  Scenario: Floating pills have pill shape with glow border
    Given a floating comment pill is rendered
    Then it should have rounded-full border styling
    And on hover it should show a subtle blue glow shadow
    And it should use backdrop-blur for glassmorphism

  @visual
  Scenario: Cross-fade animation between Mode A and Mode B
    Given floating pills are visible (Mode A)
    When the user opens the sidebar (Mode B)
    Then the pills should fade out with a smooth animation
    And the sidebar should slide in from the right

  # ──────────────────────────────────────────────────
  # Comment Highlight Accuracy
  # ──────────────────────────────────────────────────

  Scenario: Comment highlight wraps only selected text, not the entire page
    Given a DocEditor with text "hello world" and a comment on "world"
    When comment highlights are applied
    Then only the text "world" should be wrapped in a highlight span
    And the span should have data-doc-comment-highlight attribute with the comment ID
    And the rest of the page content should not be inside the highlight span
    And the parent container (contentEditable div) should NOT have any highlight styles

  Scenario: getNodePath never returns empty string for text nodes
    Given a text node that is a direct child of the page element
    When getNodePath is called for that text node
    Then the returned path should not be an empty string

  Scenario: resolveNodePath returns null for empty path
    Given an empty string path
    When resolveNodePath is called
    Then it should return null, not the root element

  Scenario: Highlight resolves element nodes to text nodes
    Given a comment whose anchorPath resolves to an element node
    When applyCommentHighlights runs
    Then the highlight should drill into the first text node child
    And the span should only wrap the relevant text

  Scenario: Highlight uses span elements, not mark elements (new system)
    Given a DocEditor with comments
    When highlights are applied
    Then all highlights should be span[data-doc-comment-highlight] elements
    And no mark[data-doc-comment-highlight] elements should exist

  @visual
  Scenario: Active comment highlight uses soft indigo color
    Given a comment is active (selected by user)
    When highlights are rendered
    Then the active highlight span should have background rgba(99, 102, 241, 0.18)
    And the active highlight span should have border-bottom rgba(99, 102, 241, 0.5)

  @visual
  Scenario: Inactive comment highlight uses soft amber color
    Given a comment exists but is not active
    When highlights are rendered
    Then the inactive highlight span should have background rgba(251, 191, 36, 0.15)
    And the inactive highlight span should have border-bottom rgba(251, 191, 36, 0.4)

  Scenario: Highlight spans have transition for smooth color changes
    Given a highlight span exists
    Then it should have transition: background-color 0.2s, border-color 0.2s
    And cursor should be pointer

  Scenario: Clicking highlighted text when sidebar is closed opens floating cards
    Given the sidebar is closed and floating cards are dismissed
    When the user clicks on highlighted text
    Then floating comments should activate (showFloatingComments = true)
    And the matching floating card should receive a focus shadow effect

  Scenario: Clicking highlighted text when sidebar is open scrolls to sidebar card
    Given the sidebar is open with multiple comments
    When the user clicks on highlighted text for a specific comment
    Then the matching sidebar card should scroll into view
    And the card should show an indigo box-shadow focus indicator for 2 seconds

  @visual
  Scenario: Focus shadow on comment card uses indigo glow
    Given a comment card receives focus from text click
    Then the card should have boxShadow "0 0 0 2px rgba(99,102,241,0.5), 0 4px 12px rgba(99,102,241,0.15)"
    And the shadow should fade after 2 seconds

  # ──────────────────────────────────────────────────
  # @Mention Tagging System
  # ──────────────────────────────────────────────────

  Scenario: Typing @ in comment creation popover shows mention popover
    Given a comment creation popover is open with a textarea
    When the user types "@"
    Then a mention popover should appear above the textarea
    And it should show a list of mentionable users
    And the popover should have glassmorphism styling (backdrop-blur-xl, bg-white/80)

  Scenario: Mention popover filters users as user types
    Given the mention popover is open
    When the user types "@Syl"
    Then only users matching "Syl" should be displayed
    And "Sylvia Thompson" should be visible
    And "John Smith" should not be visible

  Scenario: Keyboard navigation in mention popover
    Given the mention popover is open showing multiple users
    When the user presses ArrowDown
    Then the next user should be highlighted
    When the user presses ArrowUp
    Then the previous user should be highlighted
    When the user presses Enter
    Then the highlighted user should be inserted as a mention

  Scenario: Selecting a mention inserts the user name with @ prefix
    Given the mention popover is open and the user selects "John Smith"
    Then the textarea should contain "@John Smith "
    And the mention popover should close
    And the cursor should be positioned after the inserted mention

  Scenario: Escape closes the mention popover without inserting
    Given the mention popover is open
    When the user presses Escape
    Then the mention popover should close
    And the textarea text should remain unchanged

  @visual
  Scenario: Mention popover has glassmorphism design
    Given the mention popover is displayed
    Then it should have backdrop-blur-xl class for glass effect
    And it should have bg-white/80 dark:bg-gray-900/80 for translucent background
    And it should have rounded-xl border with shadow-2xl
    And it should have role="listbox" for accessibility

  @visual
  Scenario: Highlighted user row in mention popover
    Given the mention popover is showing users
    Then the highlighted row should have bg-blue-50/80 background
    And the highlighted user name should be text-blue-700
    And an "Enter" hint label should appear on the highlighted row

  Scenario: @mention works in sidebar reply textarea (Mode B)
    Given the sidebar is open with a comment and the reply input is visible
    When the user types "@" in the reply textarea
    Then the mention popover should appear
    And selecting a user should insert the mention into the reply text

  Scenario: @mention works in floating pill reply textarea (Mode A)
    Given a floating pill is expanded with the reply input visible
    When the user types "@" in the floating pill reply textarea
    Then the mention popover should appear
    And selecting a user should insert the mention into the reply text

  @visual
  Scenario: Mentioned users display as blue pills in comment body
    Given a comment with text containing "@John Smith"
    Then the mention should render as a blue pill token
    And the pill should have rounded-full, bg-blue-100/80, text-blue-600 classes
    And the pill should contain an AtSign icon and the user name without @

  @visual
  Scenario: Mentioned users display as blue pills in reply text
    Given a reply with text containing "@Sylvia Thompson"
    Then the mention in the reply should render as a blue pill token
    And the pill should have data-mention-pill attribute

  Scenario: Mention popover does not block Enter for submitting comment
    Given the mention popover is NOT active
    When the user presses Ctrl+Enter in the textarea
    Then the comment should be submitted normally

  Scenario: Mention popover intercepts Enter when active
    Given the mention popover IS active with a highlighted user
    When the user presses Enter
    Then the highlighted user should be inserted as a mention
    And the comment should NOT be submitted

  @responsive
  Scenario: Mention popover positions correctly above textarea
    Given a textarea near the bottom of the screen
    When the mention popover opens
    Then it should appear above the textarea (bottom-full positioning)
    And it should not overflow outside the visible viewport

  # ──────────────────────────────────────────────────
  # Modernized Menu System (2026 Design)
  # ──────────────────────────────────────────────────

  @visual
  Scenario: All menus use glassmorphism ViewMenuPanel styling
    When the File menu is opened
    Then the menu panel should have glassmorphism classes (backdrop-blur, bg-white/80, rounded-2xl)
    And the menu items should have min-h-[44px] touch targets

  @visual
  Scenario Outline: Each menu uses modernized ViewMenuPanel
    When the "<menu>" menu is opened
    Then it should render a ViewMenuPanel with glassmorphism surface

    Examples:
      | menu       |
      | File       |
      | Edit       |
      | Insert     |
      | Format     |
      | Tools      |
      | Extensions |
      | Help       |

  # ──────────────────────────────────────────────────
  # File Menu — New Submenu
  # ──────────────────────────────────────────────────

  Scenario: File > New opens a submenu with document types
    When the File menu is opened
    And the "New" submenu is hovered
    Then the submenu should contain "Document"
    And the submenu should contain "Spreadsheet"
    And the submenu should contain "Presentation"
    And the submenu should contain "Form"
    And the submenu should contain "Drawing"

  Scenario: File > New > Document creates a new document
    When the user clicks File > New > Document
    Then the editor content should be reset
    And a toast should show "New document created"

  # ──────────────────────────────────────────────────
  # File Menu — New Items
  # ──────────────────────────────────────────────────

  Scenario: File > Move shows coming soon toast
    When the user clicks File > Move
    Then a toast should show "Move: coming soon"

  Scenario: File > Add shortcut to Drive shows confirmation
    When the user clicks File > Add shortcut to Drive
    Then a toast should show "Shortcut added to Drive"

  Scenario: File > Move to trash resets document
    When the user clicks File > Move to trash
    Then a toast should show "Document moved to trash"
    And the editor content should be reset

  # ──────────────────────────────────────────────────
  # Version History — Name Current Version
  # ──────────────────────────────────────────────────

  Scenario: File > Version history submenu includes Name current version
    When the Version history submenu is opened via File menu
    Then "Name current version" should be present
    And "Save version" should be present
    And "View versions" should be present

  # ──────────────────────────────────────────────────
  # Toolbar — Strikethrough Button
  # ──────────────────────────────────────────────────

  Scenario: Strikethrough button is present in the toolbar
    Then the "Strikethrough (Alt+Shift+5)" button should be present in the toolbar
    And it should be positioned after the Underline button

  Scenario: Strikethrough applies strikethrough formatting
    Given text is selected in the editor
    When the user clicks the Strikethrough button
    Then the selected text should have strikethrough formatting

  # ──────────────────────────────────────────────────
  # Responsive Toolbar — More Overflow Menu
  # ──────────────────────────────────────────────────

  @responsive
  Scenario: Alignment, spacing, lists, indent, and clear formatting are hidden on small screens
    Given the viewport is less than 1024px wide
    Then the Alignment dropdown should not be visible
    And the Line spacing dropdown should not be visible
    And the Lists dropdown should not be visible
    And the Indent buttons should not be visible
    And the Clear formatting button should not be visible

  @responsive
  Scenario: More button appears on small screens
    Given the viewport is less than 1024px wide
    Then a "More formatting options" button with an ellipsis icon should be visible

  @responsive
  Scenario: More dropdown contains alignment, spacing, lists, indent, and clear formatting
    Given the viewport is less than 1024px wide
    When the user clicks the More button
    Then a glassmorphism dropdown should appear
    And it should contain Alignment buttons (Left, Center, Right, Justify)
    And it should contain Spacing options (1, 1.15, 1.5, 2)
    And it should contain List buttons (Bulleted, Numbered) and Indent buttons
    And it should contain a "Clear formatting" option

  @responsive
  Scenario: Desktop viewport shows full toolbar without More button
    Given the viewport is 1024px or wider
    Then the Alignment dropdown should be visible
    And the Line spacing dropdown should be visible
    And the Lists dropdown should be visible
    And the More button should not be visible

  # ── Insert Image System ──

  Scenario: Insert Image submenu has all 6 paths
    Given the user opens the Insert menu
    When the user hovers over the "Image" submenu
    Then the submenu should contain "Upload from computer"
    And the submenu should contain "Search the web"
    And the submenu should contain "Drive"
    And the submenu should contain "Photos"
    And the submenu should contain "Camera"
    And the submenu should contain "By URL"

  Scenario: Insert Image submenu items have icons
    Given the user opens the Insert menu > Image submenu
    Then "Upload from computer" should have an Upload icon
    And "Search the web" should have a Search icon
    And "Drive" should have a HardDrive icon
    And "Photos" should have an ImagePlus icon
    And "Camera" should have a Camera icon
    And "By URL" should have a Link icon

  Scenario: By URL opens a glassmorphism modal instead of window.prompt
    Given the user opens Insert > Image > By URL
    Then a modal with a URL input field should appear
    And the modal should have "Insert" and "Cancel" buttons
    And window.prompt should not have been called

  Scenario: By URL modal shows image preview for valid URLs
    Given the user opens the By URL modal
    When the user types a valid image URL
    Then a preview of the image should appear below the input

  Scenario: By URL modal shows error for invalid URLs
    Given the user opens the By URL modal
    When the user types an invalid URL and clicks Insert
    Then an error message "Please enter a valid URL" should appear

  Scenario: By URL modal inserts image on Enter key
    Given the user opens the By URL modal
    When the user types a valid URL and presses Enter
    Then the image should be inserted into the editor
    And the modal should close

  Scenario: Search the web opens a sidebar panel
    Given the user opens Insert > Image > Search the web
    Then an image search sidebar should appear on the right
    And the sidebar should have a search input and search button
    And the sidebar should have a close button
    And the document should shift left to make room

  Scenario: Image search sidebar has quick action buttons
    Given the image search sidebar is open
    Then it should contain a "Paste image URL" button
    And it should contain an "Upload from computer instead" button

  Scenario: Upload from computer triggers file picker
    Given the user opens Insert > Image > Upload from computer
    Then the hidden file input should be clicked
    And the file picker should open for image selection

  Scenario: Camera triggers file capture input
    Given the user opens Insert > Image > Camera
    Then a file input with capture="environment" should be created
    And the file picker should open for camera capture

  Scenario: Drive shows toast and opens file picker as fallback
    Given the user opens Insert > Image > Drive
    Then a toast "Google Drive integration — opening file picker" should appear
    And the file picker should open as fallback

  Scenario: Photos shows toast and opens file picker as fallback
    Given the user opens Insert > Image > Photos
    Then a toast "Google Photos integration — opening file picker" should appear
    And the file picker should open as fallback

  Scenario: Drag and drop image onto editor canvas
    Given the user drags an image file from their desktop
    When the image is dropped onto the editor surface
    Then a loading spinner should appear
    And the image should be inserted as a base64 data URL
    And the loading spinner should disappear

  Scenario: Loading spinner appears during image insertion
    Given the user initiates an image upload
    Then a glassmorphism loading overlay should appear
    And it should contain a spinner and "Inserting image…" text
    And it should disappear when insertion completes

  Scenario: Clicking an image in the editor shows contextual toolbar
    Given an image is inserted in the editor
    When the user clicks on the image
    Then a contextual toolbar should float 10px above the image as a glassmorphism pill
    And the toolbar should have Image options, Replace, Crop, Rotate 90°, Reset, and Delete buttons

  Scenario: Image contextual toolbar — Image options button opens sidebar
    Given the user has selected an image
    When the user clicks "Image options" in the contextual toolbar
    Then an Image Options sidebar should appear on the right
    And it should have Size & Rotation, Text Wrapping, and Adjustments sections

  Scenario: Image contextual toolbar — Replace image
    Given the user has selected an image
    When the user clicks "Replace image" in the contextual toolbar
    Then a file picker should open
    And selecting a new file should replace the selected image's src

  Scenario: Image contextual toolbar — Reset image
    Given the user has selected an image with adjusted opacity and filters
    When the user clicks "Reset image" in the contextual toolbar
    Then the image's filter and opacity styles should be cleared
    And a toast "Image reset to original" should appear

  Scenario: Image contextual toolbar — Delete image
    Given the user has selected an image
    When the user clicks "Delete image" in the contextual toolbar
    Then the image should be removed from the editor
    And the contextual toolbar should disappear

  Scenario: Squircle resize handles appear on selected image
    Given an image is inserted in the editor
    When the user clicks on the image
    Then 8 squircle resize handles (12px, borderRadius 5px) should appear at corners and midpoints
    And a blue selection outline should surround the image

  Scenario: Resize handles maintain aspect ratio by default
    Given the user has selected an image with resize handles
    When the user drags a corner handle
    Then the image should resize while maintaining its aspect ratio

  Scenario: Shift key unlocks aspect ratio during resize
    Given the user has selected an image with resize handles
    When the user holds Shift and drags a corner handle
    Then the image should resize freely without aspect ratio lock

  Scenario: Snap-to-margins during resize
    Given the user has selected an image with resize handles
    When the user drags a corner handle and the image width is within 12px of the page width
    Then the image should snap to the full page width
    When the image width is within 12px of 50% of page width
    Then the image should snap to 50% of the page width

  @visual
  Scenario: Dimension tooltip appears during resize
    Given the user has selected an image with resize handles
    When the user starts dragging a resize handle
    Then a tooltip showing the current dimensions (e.g., "545 × 363 px") should appear near the cursor
    And the tooltip should update in real-time as the user drags
    When the user releases the mouse button
    Then the dimension tooltip should disappear

  @visual
  Scenario: Squircle resize handles have correct styling
    Given the user has selected an image
    Then the resize handles should be 12px squares with borderRadius 5px (squircle shape)
    And handles should have white fill with indigo border
    And handles should be positioned at all 8 points (4 corners + 4 midpoints)

  @visual
  Scenario: Image Options sidebar — Opacity slider
    Given the Image Options sidebar is open for a selected image
    When the user drags the Opacity slider to 50%
    Then the image's opacity should be 0.5
    And the slider label should show "50%"

  @visual
  Scenario: Image Options sidebar — Brightness slider
    Given the Image Options sidebar is open for a selected image
    When the user drags the Brightness slider to 150%
    Then the image should have a CSS filter with brightness(1.5)

  @visual
  Scenario: Image Options sidebar — Contrast slider
    Given the Image Options sidebar is open for a selected image
    When the user drags the Contrast slider to 75%
    Then the image should have a CSS filter with contrast(0.75)

  @visual
  Scenario: Image Options sidebar — Text wrapping buttons
    Given the Image Options sidebar is open for a selected image
    When the user clicks the "Left" text wrapping button
    Then the image should have float: left
    And appropriate margins should be applied

  @visual
  Scenario: Image Options sidebar — Size inputs
    Given the Image Options sidebar is open for a selected image
    When the user changes the Width input to 300
    Then the image width should be 300px

  @visual
  Scenario: Image Options sidebar — Reset all adjustments
    Given the Image Options sidebar is open with modified adjustments
    When the user clicks "Reset all adjustments"
    Then Opacity, Brightness, and Contrast should return to 100%
    And the image's filter and opacity styles should be cleared

  @visual
  Scenario: Image URL modal glassmorphism styling
    Given the By URL modal is open
    Then the modal should have backdrop-blur styling
    And it should have rounded-2xl corners
    And it should match the 2026 glassmorphism design language

  @visual
  Scenario: Image search sidebar glassmorphism styling
    Given the image search sidebar is open
    Then the sidebar should have backdrop-blur-xl styling
    And it should match the Comments sidebar visual style

  @visual
  Scenario: Image contextual toolbar glassmorphism styling
    Given an image is selected in the editor
    Then the contextual toolbar should have backdrop-blur-2xl styling
    And it should have rounded-full pill shape and shadow-2xl
    And the toolbar should be positioned 10px above the image

  @visual
  Scenario: Loading overlay glassmorphism styling
    Given an image is being inserted
    Then the loading overlay should have a frosted glass background
    And the spinner container should have rounded-2xl and shadow-2xl

  # ── Image Upload Format Support ──

  Scenario: File input accepts all modern image formats
    Given the DocEditor is rendered
    Then the hidden file input should have accept attribute containing:
      | extension |
      | .jpg      |
      | .jpeg     |
      | .png      |
      | .gif      |
      | .webp     |
      | .svg      |
      | .heic     |
      | .heif     |
      | .tiff     |
      | .bmp      |
      | .avif     |

  Scenario: Uploading a .webp file inserts an image tag
    Given the user selects a .webp file via the file picker
    Then a ghost placeholder with a loading spinner should appear
    And the placeholder should be replaced with an <img> tag
    And the img src should contain the base64 data URL of the .webp

  Scenario: Uploading an .svg file preserves vector quality
    Given the user selects an .svg file via the file picker
    Then the SVG should be inserted as a data URL without canvas conversion
    And the image should remain sharp at any zoom level

  Scenario: Uploading a .heic file triggers client-side conversion
    Given the user selects a .heic file via the file picker
    Then the system should attempt to convert it to PNG via canvas
    And if conversion fails, the error card should appear
    And the document should not crash

  Scenario: MIME type validation rejects disguised non-image files
    Given the user drops a file named "malicious.jpg" with MIME type "application/x-msdownload"
    Then the file should be rejected
    And a toast should show "Unsupported file type"

  Scenario: Files exceeding 25MB are rejected
    Given the user selects an image file larger than 25MB
    Then the file should be rejected
    And a toast should show "File is too large (max 25 MB)"

  Scenario: Ghost placeholder appears during image upload
    Given the user initiates an image file upload
    Then a dashed-border placeholder should appear at the cursor position
    And the placeholder should contain a spinning loader and filename text

  Scenario: Ghost placeholder replaced by image with smooth animation
    Given a ghost placeholder is showing during upload
    When the image finishes loading
    Then the placeholder should be replaced with the final <img> tag
    And the image should fade in with opacity 0→1
    And the image should scale up from 0.95→1.0

  Scenario: Error card appears when upload fails
    Given a ghost placeholder is showing during upload
    When the file read or conversion fails
    Then the placeholder should be replaced with a red error card
    And the error card should show "Failed to upload <filename>"
    And the error card should have a "Retry" button

  Scenario: Retry button re-attempts the upload
    Given an error card with a Retry button is showing
    When the user clicks "Retry"
    Then the error card should be replaced with a loading placeholder
    And the upload should be re-attempted

  Scenario: URL insertion shows ghost placeholder then final image
    Given the user inserts an image by URL
    Then a ghost placeholder should appear while the image loads
    And when the image loads successfully, it should fade in smoothly

  Scenario: URL insertion shows error when image fails to load
    Given the user inserts an invalid image URL
    Then a ghost placeholder should appear
    And when the image fails to load, an error card should replace it

  Scenario: Drag-and-drop rejects unsupported file types with toast
    Given the user drags a .txt file onto the editor
    When the file is dropped
    Then a glassmorphism toast should appear
    And the toast should explain which formats are accepted

  Scenario: Drag-and-drop accepts all supported image formats
    Given the user drags a .webp file onto the editor
    When the file is dropped
    Then the ghost placeholder upload flow should begin
    And the image should be inserted successfully

  Scenario: TIFF files are auto-converted to PNG for fast loading
    Given the user uploads a .tiff file
    Then the system should convert it to PNG via canvas
    And the inserted img src should be a PNG data URL

  Scenario: BMP files are auto-converted to PNG for fast loading
    Given the user uploads a .bmp file
    Then the system should convert it to PNG via canvas
    And the inserted img src should be a PNG data URL

  Scenario: Camera input accepts all modern image formats
    Given the user opens Insert > Image > Camera
    Then the temporary file input should have the expanded accept attribute
    And it should include .heic and .heif for iPhone captures

  # ──────────────────────────────────────────────────
  # Image Toolbar and Tools
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Selected image has Electric Indigo pulsating border
    Given the user clicks on an inserted image
    Then the selection outline should use border color #6366f1 (Electric Indigo)
    And it should have a pulsating box-shadow animation (image-select-pulse)

  @visual
  Scenario: Resize handles use indigo color scheme
    Given the user clicks on an inserted image
    Then the resize handles should have border-indigo-500 class
    And they should have hover:bg-indigo-50 class

  @visual
  Scenario: Image contextual toolbar has spring entrance animation
    Given the user clicks on an inserted image
    Then the toolbar should animate in with image-toolbar-spring keyframe
    And it should use cubic-bezier(0.34, 1.56, 0.64, 1) for overshoot bounce

  Scenario: Image contextual toolbar has Rotate 90° button
    Given the user clicks on an inserted image
    Then the toolbar should include a "Rotate 90°" button with aria-label "Rotate 90 degrees"
    When the user clicks Rotate 90°
    Then the image should have style transform: rotate(90deg)

  Scenario: Rotate tool cycles through 0/90/180/270 degrees
    Given the user has clicked Rotate 90° three times
    Then the image transform should be rotate(270deg)
    When the user clicks Rotate 90° again
    Then the image transform should be cleared (0°/360°)

  Scenario: Crop tool opens overlay with dark mask, grid, and 8 handles
    Given the user clicks the Crop button on the image toolbar
    Then a darkened overlay (rgba(0,0,0,0.55)) should appear outside the crop area
    And eight handles should be visible (4 corners: nw, ne, sw, se + 4 edges: n, s, w, e)
    And a rule-of-thirds grid should appear inside the crop area
    And corner L-bracket markers and edge midpoint bars should be visible
    And Apply and Cancel buttons should appear below the crop area

  Scenario: Crop applies canvas-based cropping to the image
    Given the user has opened the crop overlay
    When the user drags a corner handle to adjust the crop area
    And clicks "Apply"
    Then the image src should be replaced with a canvas-rendered cropped dataURL
    And the original src should be stored in data-original-src for undo
    And crop percentages should be stored as data-crop-top/left/width/height
    And the image display dimensions should match the cropped area proportions
    And the crop overlay should close

  Scenario: Crop cancel discards changes
    Given the user has opened the crop overlay
    When the user clicks "Cancel"
    Then the crop overlay should close
    And the image src should remain unchanged

  Scenario: Remove crop restores original image
    Given an image that has been cropped (has data-original-src attribute)
    When the user clicks "Remove crop" on the image toolbar
    Then the image src should be restored from data-original-src
    And the data-original-src attribute should be removed
    And the image should be restored to its original dimensions
    And a toast "Crop removed — image restored" should appear

  Scenario: Re-entering crop restores previous crop rect
    Given an image that has been cropped with specific dimensions
    When the user clicks the Crop button again
    Then the original image should be restored for re-cropping
    And the crop overlay should show with the previous crop area preserved
    And the user can adjust and re-apply the crop

  Scenario: Reset image clears all adjustments including rotation and crop
    Given an image with rotation, filters, and crop applied
    When the user clicks "Reset image" on the toolbar
    Then the original image src should be restored if cropped
    And the image style.transform, style.filter, style.opacity should all be cleared
    And imageOptions should reset to { opacity: 100, brightness: 100, contrast: 100 }
    And imageRotation should reset to 0

  Scenario: Selection UI clips to scroll container on scroll
    Given an image is selected in the editor
    When the user scrolls the editor content area
    Then the selection border and resize handles are clipped to the scroll container bounds
    And the image toolbar is clamped to remain within the visible scroll area
    And the toolbar hides entirely when the image is fully scrolled out of view
    And no selection UI elements overflow into the editor toolbar or menu bar area

  @visual
  Scenario: Drag-and-drop shows glassmorphism drop zone overlay
    Given the editor is in editing mode
    When the user drags a file over the editor
    Then a blurred glassmorphism overlay appears with a dashed indigo border
    And the border has a neon-pulse animation to guide the user
    And the overlay shows "Drop image here" text
    When the user drops the file or drags away
    Then the overlay disappears

  @visual
  Scenario: Newly inserted images have smooth fade-in animation
    Given the editor is in editing mode
    When an image is inserted via upload or drag-and-drop
    Then the image fades in with a 300ms ease-out animation
    And the image scales from 97% to 100% during the transition

  Scenario: Resize drag does not deselect image
    Given an image is selected with resize handles visible
    When the user drags a resize handle to change the image size
    Then the selection border and handles remain visible after the drag ends
    And the image dimensions update in real-time during the drag

  # ──────────────────────────────────────────────────
  # Image Options Panel with Thumbnail
  # ──────────────────────────────────────────────────

  Scenario: Image Options panel shows live thumbnail preview
    Given the user opens Image Options for a selected image
    Then the panel should contain a thumbnail <img> with the selected image's src
    And the thumbnail should have real-time CSS filters matching the Adjustments sliders

  Scenario: Thumbnail reflects opacity changes in real time
    Given the Image Options panel is open
    When the user moves the Opacity slider to 50%
    Then the thumbnail img should have style opacity: 0.5
    And the selected image in the editor should also have opacity: 0.5

  Scenario: Thumbnail reflects brightness and contrast in real time
    Given the Image Options panel is open
    When the user adjusts Brightness to 150% and Contrast to 80%
    Then the thumbnail should have filter: brightness(1.5) contrast(0.8)

  Scenario: Image Options panel has Rotation input
    Given the Image Options panel is open
    Then there should be a numeric input field labeled "Rotation"
    And it should accept values 0-359 in steps of 90
    When the user sets it to 180
    Then the image should have transform: rotate(180deg)

  Scenario: Reset all adjustments clears rotation and clip-path
    Given the Image Options panel is open with modified adjustments
    When the user clicks "Reset all adjustments"
    Then opacity, filter, transform, and clipPath should all be cleared
    And the rotation input should show 0

  # ──────────────────────────────────────────────────
  # Selection Save/Restore for Image Insertion
  # ──────────────────────────────────────────────────

  Scenario: Editor selection is saved before file picker opens
    Given the user has typed text and placed their cursor in the middle
    When they click Insert > Image > Upload from computer
    Then the current selection range should be saved to savedEditorRangeRef
    And the file picker should open

  Scenario: Editor selection is restored after file picker returns
    Given the user selected "Upload from computer" which saved the selection
    When the file picker dialog closes with a selected file
    Then restoreEditorSelection() should restore the saved range
    And exec("insertHTML") should insert the image at the original cursor position

  Scenario: Fallback cursor placement when no saved range exists
    Given no selection was saved (e.g. editor was not focused before upload)
    When an image is inserted
    Then the cursor should be placed at the end of the first page as fallback
    And the image should still be inserted successfully

  Scenario: Drag-and-drop preserves browser's drop cursor position
    Given the user drags an image file over the editor
    When they drop it at a specific location
    Then the browser's native drop cursor position should be used
    And restoreEditorSelection should NOT override it with a saved range

  # ──────────────────────────────────────────────────
  # Image Brightness/Contrast Closure Safety
  # ──────────────────────────────────────────────────

  Scenario: Brightness slider uses prev.contrast to avoid stale closure
    Given an image is selected and Image Options panel is open
    When the user adjusts the brightness slider
    Then the filter string should use the current contrast value from prev state
    And not a stale closure value

  Scenario: Contrast slider uses prev.brightness to avoid stale closure
    Given an image is selected and Image Options panel is open
    When the user adjusts the contrast slider
    Then the filter string should use the current brightness value from prev state
    And not a stale closure value

  # ──────────────────────────────────────────────────
  # Image Wrapper Containment
  # ──────────────────────────────────────────────────

  Scenario: Image wrapper paragraph does not clip content
    Given an image has been inserted into the editor
    Then the wrapper <p> element should not have overflow:hidden
    And the image should be fully visible within the page bounds

  Scenario: Image is inserted at cursor position
    Given the user has placed their cursor in the middle of a paragraph
    When they insert an image
    Then the image should appear at the cursor position
    And the cursor should move after the inserted image

  # ──────────────────────────────────────────────────
  # Paint Format Tool
  # ──────────────────────────────────────────────────

  Scenario: Paint Format captures and applies text formatting
    Given the user has selected bold, red text in the editor
    When they click the Paint Format button
    Then the paint format mode should activate with blue highlight
    When they select a different text range
    Then the captured formatting (bold, red) should be applied to the new selection
    And paint format mode should deactivate automatically

  Scenario: Paint Format can be toggled off before applying
    Given the paint format mode is active
    When the user clicks the Paint Format button again
    Then paint format mode should deactivate
    And no formatting should be applied

  # ──────────────────────────────────────────────────
  # Recently Used Fonts
  # ──────────────────────────────────────────────────

  Scenario: Recently Used Fonts section appears in font dropdown
    Given the user has previously selected fonts "Georgia" and "Courier New"
    When they open the Font Family dropdown
    Then a "Recently used" section should appear at the top
    And it should list "Georgia" and "Courier New"

  Scenario: Recently Used Fonts persist across sessions
    Given the user has selected font "Georgia"
    When the editor is reloaded
    Then the Recently Used section should still contain "Georgia"
    And the data should be read from localStorage key "doc-editor-recent-fonts"

  # ──────────────────────────────────────────────────
  # Expanded List Styles
  # ──────────────────────────────────────────────────

  Scenario: Bullet list offers 6 style options
    Given the user clicks the bullet list dropdown
    Then 6 bullet styles should be displayed in a grid
    And the styles should include disc, circle, square, dash, arrow, and star

  Scenario: Numbered list offers 6 style options
    Given the user clicks the numbered list dropdown
    Then 6 numbered styles should be displayed in a grid
    And the styles should include decimal, lower-alpha, upper-alpha, lower-roman, upper-roman, and lower-greek

  Scenario: Checklist offers 4 checkbox style options
    Given the user clicks the checklist dropdown
    Then 4 checklist styles should be displayed in a grid
    And the styles should include Standard, Filled, Circle, and Diamond

  # ──────────────────────────────────────────────────
  # Ghost Cursor for Image Drag-and-Drop
  # ──────────────────────────────────────────────────

  Scenario: Ghost cursor appears during image drag over editor
    Given the editor contains text content
    When the user drags an image over the editor area
    Then a blue vertical ghost cursor line should appear at the drag position
    And the ghost cursor should be 2px wide and 24px tall with an indigo glow

  Scenario: Ghost cursor disappears on drag leave or drop
    Given a ghost cursor is visible during drag
    When the user drops the image or drags out of the editor
    Then the ghost cursor should disappear immediately

  # ──────────────────────────────────────────────────
  # Canvas Drawing Module
  # ──────────────────────────────────────────────────

  Scenario: Drawing canvas opens from Insert > Drawing menu
    Given the user is in the document editor
    When they click Insert > Drawing
    Then a fullscreen Drawing canvas modal should appear
    And the toolbar should show Select, Line, Arrow, Rectangle, Ellipse, Polygon, Text Box, and Image tools

  Scenario: Drawing canvas opens from File > New > Drawing menu
    Given the user is in the document editor
    When they click File > New > Drawing
    Then the same Drawing canvas modal should appear

  Scenario: User draws shapes on the canvas
    Given the Drawing canvas modal is open
    When the user selects the Rectangle tool and drags on the canvas
    Then a rectangle shape should appear with fill and stroke colors
    And 8 resize handles and a rotation handle should be visible
    And the status bar should show "1 shape"

  Scenario: Save and Close inserts drawing as high-res image
    Given the Drawing canvas has one or more shapes
    When the user clicks "Save and Close"
    Then the canvas content should be exported as a 2x resolution PNG
    And the image should be inserted into the document at the cursor position
    And the modal should close
    And the inserted image should have data-doc-image attribute for selection

  Scenario: Cancel closes drawing canvas without inserting
    Given the Drawing canvas modal is open with shapes drawn
    When the user clicks "Cancel"
    Then the modal should close
    And no image should be inserted into the document
