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

  Scenario: Strikethrough, Superscript, Subscript are not in the toolbar
    Then the "Strikethrough" button should not be present in the toolbar
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

  Scenario: Toast appears after File > New action
    When the File menu is opened
    And the "New" menu item is clicked
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

  Scenario: Move to bin is not in the File menu
    When the File menu is opened
    Then "Move to bin" should not appear in the menu items

  Scenario: File menu contains expected core items
    When the File menu is opened
    Then the File menu should contain "New"
    And the File menu should contain "Open"
    And the File menu should contain "Make a copy"
    And the File menu should contain "Rename"
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
