@doc-editor @comprehensive
Feature: Doc Editor Comprehensive
  As a user of the Educo document editor
  I want full coverage of all editor features including menus, toolbars, dialogs, and state
  So that every aspect of the document editor works correctly

  # ===================================================================
  # Section 1: Core Architecture & Layout
  # ===================================================================
  @architecture
  Scenario: Editor has correct layered structure from top to bottom
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the title should be above the menubar
    And the menubar should be above the toolbar
    And the toolbar should be above the editor area

  Scenario: Title bar contains document title input
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the document title input should be visible

  Scenario: Editor canvas area has overflow scrolling
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the editor should have an overflow-scrolling container

  @responsive
  Scenario: Toolbar wraps on narrow viewport
    Given the viewport is set to 500x800
    And the user navigates to the doc editor test page "/doc-editor-test"
    Then toolbar buttons should wrap to different lines with different Y values

  Scenario: data-doc-editor-root attribute exists
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the editor root data attribute should be present and visible

  # ===================================================================
  # Section 2: File Menu Deep
  # ===================================================================
  @file-menu
  Scenario: File > New resets document
    Given the user navigates to the doc editor and types "Some content to clear"
    When the user clicks File > New
    Then a "New document created" toast should appear
    And the title should be reset to "Untitled document"

  Scenario: File > Make a copy shows toast
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Make a copy
    Then a "Copy created" toast should appear

  Scenario: File > Share submenu shows 5 items
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and hovers over Share
    Then "Open share panel" should be visible in the submenu
    And "Copy as HTML" should be visible in the submenu
    And "Copy as Markdown" should be visible in the submenu
    And "Copy as Text" should be visible in the submenu
    And "Copy as JSON" should be visible in the submenu

  Scenario: File > Share > Open share panel opens dialog
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Share > Open share panel
    Then the share dialog should be visible
    And the dialog title should say "Share"

  Scenario: File > Share > Copy as HTML shows clipboard toast
    Given clipboard write permission is granted
    And the user navigates to the doc editor and types "Copy test"
    When the user clicks File > Share > Copy as HTML
    Then a toast should appear confirming the copy

  Scenario: File > Email submenu shows 2 items
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and hovers over Email
    Then "Email this document" should be visible in the submenu
    And "Copy email-ready text" should be visible in the submenu

  Scenario: File > Download shows all 9 format options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and hovers over Download
    Then "Microsoft Word (.doc)" should be visible
    And "PDF document (.pdf)" should be visible
    And "OpenDocument format (.odt)" should be visible
    And "Plain text (.txt)" should be visible
    And "Rich Text Format (.rtf)" should be visible
    And "Web page (.html)" should be visible
    And "EPUB publication (.epub)" should be visible
    And "Markdown (.md)" should be visible
    And "JSON (.json)" should be visible

  Scenario: File > Rename focuses title input
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Rename
    Then the title input should be focused

  Scenario: File > Move to bin shows toast
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Move to bin
    Then a toast should appear confirming the action

  Scenario: File > Version history submenu shows Save and View
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and hovers over Version history
    Then "Save version" should be visible in the submenu
    And "View versions" should be visible in the submenu

  Scenario: File > Version history > Save version shows toast
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Version history > Save version
    Then a "Version saved" toast should appear

  Scenario: File > Version history > View versions opens dialog
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And a version has been saved
    When the user clicks File > Version history > View versions
    Then the version history dialog should be visible
    And the dialog should show "Version history" title

  Scenario: File > Language submenu has search input and languages
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and hovers over Language
    Then a search input should be visible
    And at least one language should be listed

  Scenario: File > Details opens details dialog
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Details
    Then the details dialog should be visible
    And the dialog should show "Title:" label

  Scenario: File > Security limitations opens dialog
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks File > Security limitations
    Then the security dialog should be visible
    And the dialog should show "Browser security" text

  # ===================================================================
  # Section 3: Edit Menu Deep
  # ===================================================================
  @edit-menu
  Scenario: Edit menu shows all items with shortcut labels
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Edit menu
    Then "Undo" should be visible in the menu
    And "Redo" should be visible in the menu
    And "Cut" should be visible in the menu
    And "Copy" should be visible in the menu
    And "Paste" should be visible in the menu
    And "Paste without formatting" should be visible in the menu
    And "Select all" should be visible in the menu
    And "Delete" should be visible in the menu
    And "Find and replace" should be visible in the menu
    And shortcut labels "Ctrl+Z", "Ctrl+Y", and "Ctrl+H" should be displayed

  Scenario: Edit > Undo reverses last action via menu
    Given the user navigates to the doc editor and types "hello"
    When the user clicks Edit > Undo
    Then the content should have changed

  Scenario: Edit > Redo re-applies via menu
    Given the user navigates to the doc editor and types "redo test"
    And the user has undone via Edit menu
    When the user clicks Edit > Redo
    Then the content should be re-applied

  Scenario: Edit > Select all selects content via menu
    Given the user navigates to the doc editor and types "test text"
    When the user clicks Edit > Select all
    And the user applies bold via toolbar to verify selection
    Then the HTML output should contain bold formatting on the selected text

  Scenario: Edit > Cut removes selected text via menu
    Given the user navigates to the doc editor and types "hello"
    And the user selects all text
    When the user clicks Edit > Cut
    Then the content should have been removed

  Scenario: Edit > Delete removes selected text
    Given the user navigates to the doc editor and types "hello"
    And the user selects all text
    When the user clicks Edit > Delete
    Then the content should have been removed

  # ===================================================================
  # Section 4: View Menu Deep
  # ===================================================================
  @view-menu
  Scenario: View > Mode submenu shows Editing, Suggesting, Viewing
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens View menu and hovers over Mode
    Then "Editing" mode option should be visible
    And "Suggesting" mode option should be visible
    And "Viewing" mode option should be visible

  Scenario: View > Mode > Suggesting changes mode and shows toast
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Mode > Suggesting
    Then the mode should change to "Suggesting"

  Scenario: View > Mode > Viewing disables editing
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Mode > Viewing
    Then the mode indicator should say "Viewing"
    And the editor should be non-editable with contenteditable set to "false"

  Scenario: View > Comments toggles comments panel
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Comments
    Then the comments panel should be visible with "Comments UI is ready"
    When the user clicks View > Comments again
    Then the comments panel should toggle off

  Scenario: View > Show print layout toggles layout
    Given the user navigates to the doc editor test page with print layout ON by default
    And "Page 1" label is visible
    When the user clicks View > Show print layout to toggle it off
    Then "Page 1" label should disappear

  Scenario: View > Show ruler toggles ruler
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Show ruler
    Then the ruler indicator should appear
    When the user clicks View > Show ruler again
    Then the ruler should toggle off

  Scenario: View > Show equation toolbar toggles
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Show equation toolbar
    Then the equation input should be visible
    When the user clicks View > Show equation toolbar again
    Then the equation toolbar should toggle off

  Scenario: View > Show non-printing characters toggles
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Show non-printing characters
    Then the toggle should work without error

  # ===================================================================
  # Section 5: Insert Menu Deep
  # ===================================================================
  @insert-menu
  Scenario: Insert > Image submenu shows 6 upload options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Image
    Then "Upload from computer" should be visible
    And "Search the web" should be visible
    And "Drive" should be visible
    And "Photos" should be visible
    And "Camera" should be visible
    And "By URL" should be visible

  Scenario: Insert > Building blocks submenu shows items
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Building blocks
    Then "Meeting notes" should be visible in the submenu
    And "Email draft" should be visible in the submenu

  Scenario: Insert > Building blocks > Meeting notes inserts template
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks Insert > Building blocks > Meeting notes
    Then the HTML output should contain "Meeting notes"

  Scenario: Insert > Smart chips submenu shows chip types
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Smart chips
    Then "Date" chip type should be visible
    And "People" chip type should be visible
    And "File" chip type should be visible
    And "Place" chip type should be visible

  Scenario: Insert > Smart chips > Date inserts date chip
    Given the user navigates to the doc editor and clicks into the editor
    When the user clicks Insert > Smart chips > Date
    Then the HTML output should contain a year pattern

  Scenario: Insert > eSignature inserts signature block
    Given the user navigates to the doc editor and clicks into the editor
    When the user clicks Insert > eSignature
    Then the HTML output should contain "signature"

  Scenario: Insert > Link menu item shows Ctrl+K shortcut
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Insert menu
    Then the Link item should be visible
    And the "Ctrl+K" shortcut label should be visible

  Scenario: Insert > Drawing inserts placeholder
    Given the user navigates to the doc editor and clicks into the editor
    When the user clicks Insert > Drawing
    Then the HTML output should contain a drawing placeholder

  Scenario: Insert > Chart submenu shows chart types
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Chart
    Then "Bar" chart type should be visible
    And "Column" chart type should be visible
    And "Line" chart type should be visible
    And "Pie" chart type should be visible

  Scenario: Insert > Chart > Bar inserts SVG chart
    Given the user navigates to the doc editor and clicks into the editor
    When the user clicks Insert > Chart > Bar
    Then the HTML output should contain an SVG element

  Scenario: Insert > Symbols submenu shows options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Symbols
    Then "Emoji" option should be visible
    And "Special characters" option should be visible
    And "Equation" option should be visible

  Scenario: Insert > Horizontal line inserts hr element
    Given the user navigates to the doc editor and clicks into the editor
    When the user clicks Insert > Horizontal line
    Then the HTML output should contain an <hr element

  Scenario: Insert > Break submenu shows break types
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Break
    Then "Page break" option should be visible
    And "Column break" option should be visible
    And "Ctrl+Enter" shortcut should be visible

  Scenario: Insert > Bookmark inserts bookmark
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And a dialog handler is set up to accept "intro"
    And the user clicks into the editor
    When the user clicks Insert > Bookmark
    Then the HTML output should contain the bookmark

  Scenario: Insert > Page elements submenu shows items
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Page elements
    Then "Table of contents" should be visible
    And "Header" should be visible
    And "Footer" should be visible
    And "Watermark" should be visible

  Scenario: Insert > Tab inserts tab space
    Given the user navigates to the doc editor and types "before"
    When the user clicks Insert > Tab
    Then the HTML output should contain a tab space character

  # ===================================================================
  # Section 6: Functional State Machine
  # ===================================================================
  @state
  Scenario: Zoom level persists across changes
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user changes zoom to "150%"
    Then the zoom button should show "150%"
    When the user changes zoom to "75%"
    Then the zoom button should show "75%"

  Scenario: Font family dropdown updates after selection
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And the default font is "Arial"
    And the user types and selects text
    When the user selects "Helvetica" from the font dropdown
    Then the font button should show "Helvetica"

  Scenario: Font size dropdown updates after selection
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And the default font size is "14"
    And the user types and selects text
    When the user selects size "24" from the size dropdown
    Then the size button should show "24"

  Scenario: Document mode cycling: editing to suggesting to viewing
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user switches to Suggesting mode
    Then the mode should be "Suggesting"
    When the user switches to Viewing mode
    Then the editor should be non-editable

  Scenario: Comments toggle shows and hides panel
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Comments to show the panel
    Then the comments panel should be visible with "Comments UI is ready"
    When the user clicks View > Comments again to hide the panel
    Then the comments panel should be hidden

  Scenario: Print layout toggle changes editor background
    Given the user navigates to the doc editor with print layout ON by default
    And "Page 1" label is visible
    When the user clicks View > Show print layout to toggle it off
    Then "Page 1" label should disappear

  Scenario: Ruler toggle shows and hides ruler
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Show ruler to show the ruler
    Then the ruler should be visible
    When the user clicks View > Show ruler again to hide it
    Then the ruler should be hidden

  Scenario: Non-printing characters toggle
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks View > Show non-printing characters
    Then the toggle action should complete without error

  # ===================================================================
  # Section 7: Keyboard Shortcuts - Extended
  # ===================================================================
  @keyboard
  Scenario: Ctrl+Y performs redo
    Given the user navigates to the doc editor and types "hello"
    And the user undoes the action with Ctrl+Z
    When the user presses Ctrl+Y to redo
    Then the content should be re-applied

  Scenario: Ctrl+A selects all and bold applies to everything
    Given the user navigates to the doc editor and types "hello world"
    When the user presses Ctrl+A to select all
    And the user presses Ctrl+B to bold
    Then the HTML output should contain bold formatting

  Scenario: Escape closes open menu
    Given the user navigates to the doc editor and opens the File menu
    When the user presses Escape
    Then the menu panel should be closed

  Scenario: Edit menu displays Ctrl+Z shortcut label
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Edit menu
    Then the "Ctrl+Z" shortcut label should be visible

  Scenario: Edit menu displays Ctrl+H shortcut label
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Edit menu
    Then the "Ctrl+H" shortcut label should be visible

  Scenario: Insert menu displays Ctrl+K shortcut label
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Insert menu
    Then the "Ctrl+K" shortcut label should be visible

  Scenario: View menu displays Ctrl+Shift+P shortcut label
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the View menu
    Then the "Ctrl+Shift+P" shortcut label should be visible

  Scenario: Insert > Break shows Ctrl+Enter shortcut
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Break
    Then the "Ctrl+Enter" shortcut label should be visible

  # ===================================================================
  # Section 8: Complex UI Components
  # ===================================================================
  @tables @complex-ui
  Scenario: Table grid picker appears when hovering Insert > Table
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Insert menu and hovers over Table
    Then the submenu panel with the grid picker should be visible

  Scenario: Table grid picker click inserts table
    Given the user navigates to the doc editor and clicks into the editor
    When the user inserts a table via the menu grid picker
    Then the HTML output should contain a table element

  Scenario: Clicking inserted table opens table editor panel
    Given the user navigates to the doc editor and inserts a table
    When the user clicks on the table widget in the editor
    Then the table editor panel should be visible

  Scenario: Table editor shows insert/delete row/column buttons
    Given the user navigates to the doc editor and inserts a table
    When the user clicks on the table to open the editor
    Then the table editor panel should be visible
    And "Insert row below" button should be visible
    And "Delete row" button should be visible

  Scenario: Table editor can insert a row
    Given the user navigates to the doc editor and inserts a table
    And the user opens the table editor panel
    When the user clicks the "Insert row below" button
    Then a row should be inserted

  Scenario: Table editor can delete a row
    Given the user navigates to the doc editor and inserts a table
    And the user opens the table editor panel
    When the user clicks the "Delete row" button
    Then a row should be deleted

  Scenario: Table editor can toggle header row
    Given the user navigates to the doc editor and inserts a table
    And the user opens the table editor panel
    When the user clicks the "Toggle header row" button
    Then the header row should toggle

  Scenario: Table editor delete table removes it
    Given the user navigates to the doc editor and inserts a table
    And the user opens the table editor panel
    When the user clicks the "Delete table" button
    Then a "Table deleted" toast should appear
    And the HTML output should no longer contain a table

  @equation
  Scenario: Equation toolbar shows and accepts input
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user enables the equation toolbar via View menu
    Then the equation input should be visible
    When the user types "E=mc^2" in the equation input
    Then the input should accept the equation text

  @version-history
  Scenario: Version history: save and view versions
    Given the user navigates to the doc editor and types "Version test content"
    When the user saves a version via File > Version history > Save version
    Then a "Version saved" toast should appear
    When the user opens the version history dialog
    Then the version history dialog should be visible

  # ===================================================================
  # Section 9: Find & Replace - Advanced
  # ===================================================================
  @find-replace
  Scenario: Replace single occurrence works
    Given the user navigates to the doc editor and types "apple banana apple"
    And the user opens the Find and Replace dialog
    And the user fills "apple" in the Find field
    And the user fills "orange" in the Replace field
    When the user finds the next occurrence and replaces it
    Then the HTML output should contain "orange"

  Scenario: Close button closes find dialog
    Given the user navigates to the doc editor and opens Find and Replace
    And the Find input is visible
    When the user clicks the "Close" button
    Then the find dialog should be closed

  Scenario: Find not found shows Not found toast
    Given the user navigates to the doc editor and types "hello"
    And the user opens Find and Replace
    When the user searches for "xyz" and clicks Find next
    Then a "Not found" toast should appear

  Scenario: Find next navigates through occurrences
    Given the user navigates to the doc editor and types "cat dog cat"
    And the user opens Find and Replace
    And the user fills "cat" in the Find field
    When the user clicks Find next
    Then a "Found" toast should appear
    When the user clicks Find next again
    Then a "Found" toast should still appear

  # ===================================================================
  # Section 10: Dialogs & Panels
  # ===================================================================
  @dialogs
  Scenario: Share dialog shows copy format buttons
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the share dialog via File > Share > Open share panel
    Then the share dialog should be visible with "Share" title
    And "Copy HTML" button should be visible
    And "Copy Markdown" button should be visible

  Scenario: Details dialog shows document metadata
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the details dialog via File > Details
    Then the details dialog should show "Title:" label
    And the details dialog should show "Characters:" label

  Scenario: Security dialog shows limitation info
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the security dialog via File > Security limitations
    Then the security dialog should show "Security limitations" text

  Scenario: Page setup dialog shows paper size, margins, and apply-to options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the page setup dialog via File > Page setup
    Then "Paper size" should be visible
    And "Margins (centimetres)" should be visible
    And "Pages" should be visible
    And "Pageless" should be visible
    And "Apply to" should be visible
    And "This tab" should be visible

  Scenario: Page setup dialog color picker opens inline and stays open
    Given the user navigates to the doc editor and opens the page setup dialog
    When the user clicks the Page colour toggle button
    Then the inline color grid should appear with "Default" label
    And the "Custom" hex row should be visible

  Scenario: Page setup dialog has data-doc-header and data-doc-toolbar
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the data-doc-header attribute should be present
    And the data-doc-toolbar attribute should be present
    And the data-doc-page-label attribute should be present

  Scenario: Version history dialog lists saved entries
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And a version has been saved
    When the user opens the versions dialog via File > Version history > View versions
    Then the version history dialog should be visible with at least one entry

  Scenario: Language search filters languages
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And the user opens File > Language submenu
    When the user types "Fren" in the language search input
    Then "French" should be visible in the filtered results
