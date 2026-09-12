@doc-editor
Feature: Doc Editor
  As a user of the Educo document editor
  I want to create and format documents with a rich text editor
  So that I can produce well-formatted content

  # ===================================================================
  # Page Load & Initial State
  # ===================================================================
  @page-load
  Scenario: Editor renders with title, toolbar, menubar, and page area
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the editor root should be visible
    And the document title input should be visible
    And the menubar should be visible
    And the Bold button should be visible
    And the editor area should be visible

  Scenario: Editor accepts text input and reflects it in HTML output
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the editor and types "Hello world"
    Then the HTML output should contain "Hello world"

  Scenario: Default title is 'Untitled document' on fresh load
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the title input should have the value "Untitled document"

  # ===================================================================
  # Text Formatting
  # ===================================================================
  @formatting
  Scenario: Bold applies <b> or <strong> tag to selected text
    Given the user navigates to the doc editor and types "bold text"
    And the user selects all text
    When the user clicks the Bold toolbar button
    Then the HTML output should contain a bold tag

  Scenario: Italic applies <i> or <em> tag to selected text
    Given the user navigates to the doc editor and types "italic text"
    And the user selects all text
    When the user clicks the Italic toolbar button
    Then the HTML output should contain an italic tag

  Scenario: Underline applies <u> tag to selected text
    Given the user navigates to the doc editor and types "underline text"
    And the user selects all text
    When the user clicks the Underline toolbar button
    Then the HTML output should contain a <u> tag

  Scenario: Strikethrough applies <strike>, <s>, or <del> tag to selected text
    Given the user navigates to the doc editor and types "strike text"
    And the user selects all text
    When the user clicks the Strikethrough toolbar button
    Then the HTML output should contain a strikethrough tag

  Scenario: Superscript applies <sup> tag to selected text
    Given the user navigates to the doc editor and types "super text"
    And the user selects all text
    When the user clicks the Superscript toolbar button
    Then the HTML output should contain a <sup> tag

  Scenario: Subscript applies <sub> tag to selected text
    Given the user navigates to the doc editor and types "sub text"
    And the user selects all text
    When the user clicks the Subscript toolbar button
    Then the HTML output should contain a <sub> tag

  # ===================================================================
  # New Toolbar Features
  # ===================================================================
  @toolbar
  Scenario: Font family dropdown opens and shows categories
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Font family dropdown
    Then the dropdown should show "Sans-serif" category
    And the dropdown should show "Serif" category
    And the dropdown should show "Monospace" category

  Scenario: Selecting a font applies font-family in HTML output
    Given the user navigates to the doc editor and types "font test"
    And the user selects all text
    When the user opens the font family dropdown and selects "Georgia"
    Then the HTML output should contain the Georgia font-family

  Scenario: Font size dropdown opens with presets
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Font size dropdown
    Then preset size option "12" should be visible
    And preset size option "24" should be visible
    And preset size option "48" should be visible

  Scenario: Text color picker opens with solid tab
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Text color button
    Then the TabbedColorPalette should show a "solid" tab

  Scenario: Highlight color picker opens
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Highlight color button
    Then the highlight picker should have a "Remove highlight" button

  Scenario: Line spacing dropdown shows Single and Double options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Line spacing button
    Then the "Single" option should be visible
    And the "Double" option should be visible

  Scenario: Zoom dropdown changes label to 150%
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the zoom dropdown and selects "150%"
    Then the zoom dropdown label should update to "150%"

  Scenario: Checklist inserts checkbox element
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks into the editor and clicks the Checklist button
    Then the HTML output should contain a checkbox

  Scenario: Indent increases indentation
    Given the user navigates to the doc editor and types "indented text"
    And the user selects all text
    When the user clicks the Increase indent button
    Then the HTML output should reflect increased indentation

  # ===================================================================
  # Menu System
  # ===================================================================
  @menu
  Scenario: File menu shows New, Open, Share, Download items
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the File menu label in the menubar
    Then the menu panel should be visible
    And "New" should be visible in the menu
    And "Open" should be visible in the menu
    And "Share" should be visible in the menu
    And "Download" should be visible in the menu

  Scenario: Edit menu shows Undo, Redo, Find and replace
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Edit menu
    Then the menu panel should be visible
    And "Undo" should be visible in the menu
    And "Redo" should be visible in the menu
    And "Find and replace" should be visible in the menu

  Scenario: View menu opens with menu panel visible
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the View menu
    Then the menu panel should be visible

  Scenario: Insert menu opens with menu panel visible
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the Insert menu
    Then the menu panel should be visible

  Scenario: Menu closes on outside click
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And the user has opened the File menu
    When the user clicks the editor area to close the menu
    Then the menu panel should no longer be visible

  # ===================================================================
  # Templates
  # ===================================================================
  @templates
  Scenario: Default template chips are visible on load
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the "Meeting notes" template chip should be visible
    And the "Email draft" template chip should be visible

  Scenario: Clicking Meeting notes template inserts content
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the "Meeting notes" template
    Then the HTML output should contain "Meeting notes"
    And the HTML output should contain "Attendees"

  # ===================================================================
  # Tables
  # ===================================================================
  @tables
  Scenario: Insert > Table shows submenu with grid picker
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the Insert menu and hovers over Table
    Then the submenu should contain the TableGridPicker

  # ===================================================================
  # Find & Replace
  # ===================================================================
  @find-replace
  Scenario: Find & Replace opens from Edit menu
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens Edit menu and clicks "Find and replace"
    Then the Find input should be visible

  Scenario: Find highlights text and replace all works
    Given the user navigates to the doc editor and types "foo bar foo"
    And the user opens the Find and Replace dialog
    When the user fills "foo" in the Find field
    And the user fills "baz" in the Replace field
    And the user clicks "Replace all"
    Then the HTML output should contain "baz"
    And the HTML output should not contain "foo"

  Scenario: Find next shows Found or Not found toast
    Given the user navigates to the doc editor and types "hello world"
    And the user opens the Find and Replace dialog
    When the user fills "hello" in the Find field
    And the user clicks "Find next"
    Then a "Found" toast should be visible

  # ===================================================================
  # Export
  # ===================================================================
  @export
  Scenario: File > Download shows format options
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens the File menu and hovers over Download
    Then "Web page (.html)" should be visible
    And "PDF document (.pdf)" should be visible

  # ===================================================================
  # Document Title
  # ===================================================================
  @title
  Scenario: Title input is editable
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user clicks the title and types "My Document"
    Then the title should reflect the value "My Document"

  Scenario: Default title is 'Untitled document'
    Given the user navigates to the doc editor test page "/doc-editor-test"
    Then the title input should have the value "Untitled document"

  # ===================================================================
  # Page Setup
  # ===================================================================
  @page-setup
  Scenario: File > Page setup opens dialog
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens File menu and clicks "Page setup"
    Then the Page setup dialog should be visible with "Paper size" option

  # ===================================================================
  # Fullscreen
  # ===================================================================
  @fullscreen
  Scenario: View > Full screen fills viewport with exit button
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the user opens View menu and clicks "Full screen"
    Then the "Exit full screen" button should appear

  Scenario: Pressing Escape exits fullscreen
    Given the user navigates to the doc editor test page "/doc-editor-test"
    And the user has entered fullscreen mode via View menu
    When the user presses Escape to exit fullscreen
    Then the "Exit full screen" button should no longer be visible

  # ===================================================================
  # Keyboard Shortcuts
  # ===================================================================
  @keyboard
  Scenario: Ctrl+B toggles bold
    Given the user navigates to the doc editor and types "kb bold"
    And the user selects all text
    When the user presses Ctrl+B
    Then the HTML output should contain a bold tag

  Scenario: Ctrl+I toggles italic
    Given the user navigates to the doc editor and types "kb italic"
    And the user selects all text
    When the user presses Ctrl+I
    Then the HTML output should contain an italic tag

  Scenario: Ctrl+U toggles underline
    Given the user navigates to the doc editor and types "kb underline"
    And the user selects all text
    When the user presses Ctrl+U
    Then the HTML output should contain a <u> tag

  Scenario: Ctrl+Z performs undo
    Given the user navigates to the doc editor and types "first "
    And the user types "second"
    When the user presses Ctrl+Z to undo the last typed word
    Then the content should have changed with some text removed

  # ===================================================================
  # Responsive
  # ===================================================================
  @responsive
  Scenario Outline: Editor renders and is visible at <viewport> (<width>x<height>)
    Given the viewport is set to <width>x<height>
    And the user navigates to the doc editor test page "/doc-editor-test"
    Then the editor root should be visible
    And the editor area should be visible

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  @responsive
  Scenario: On mobile toolbar wraps but Bold button is still visible
    Given the viewport is set to 375x812
    And the user navigates to the doc editor test page "/doc-editor-test"
    Then the Bold button should still be visible

  # ===================================================================
  # Themes
  # ===================================================================
  @theme
  Scenario Outline: Editor is visible in <theme> theme
    Given the user navigates to the doc editor test page "/doc-editor-test"
    When the "<theme>" theme is applied
    Then the editor root should be visible

    Examples:
      | theme    |
      | light    |
      | dark     |
      | midnight |
      | purple   |

  # ===================================================================
  # Visual Regression (Viewports)
  # ===================================================================
  @visual
  Scenario Outline: Screenshot matches at <viewport> viewport
    Given the viewport is set to <width>x<height>
    And the user navigates to the doc editor test page "/doc-editor-test"
    Then the editor root should be visible
    And the screenshot should match the baseline "doc-editor-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # ===================================================================
  # Visual Regression (Themes)
  # ===================================================================
  @visual @theme
  Scenario Outline: Screenshot matches in <theme> theme
    Given the viewport is set to 1280x720
    And the user navigates to the doc editor test page "/doc-editor-test"
    When the "<theme>" theme is applied
    Then the editor root should be visible
    And the screenshot should match the baseline "doc-editor-theme-<theme>.png"

    Examples:
      | theme    |
      | light    |
      | dark     |
      | midnight |
      | purple   |
