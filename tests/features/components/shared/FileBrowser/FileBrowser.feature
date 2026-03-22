Feature: File Browser Component (Google Drive-style)
  As a developer
  I want a reusable Google Drive-style file browser component
  So that any page can display a browsable file/folder hierarchy with consistent UX

  Background:
    Given the FileBrowser component is rendered with items and navigation data

  # ── Layout Structure ──

  Scenario: Component has a two-panel layout with left sidebar and main content
    When the component renders
    Then a left navigation panel should appear with drive sections
    And the main content area should show files and folders

  Scenario: Left sidebar shows navigation sections
    Then the sidebar should contain clickable items:
      | icon      | label          |
      | Home      | Home           |
      | HardDrive | My Drive       |
      | Users     | Shared with me |
      | Clock     | Recent         |
      | Star      | Starred        |
      | Trash     | Bin            |
    And "My Drive" should be highlighted as the active item
    And a storage usage indicator should appear at the bottom

  # ── Filter Chips ──

  Scenario: Filter chips appear below the title
    Then I should see filter chip buttons: "Type", "Modified"
    And each chip should have a dropdown chevron icon

  Scenario: Type filter dropdown shows file type options
    When I click the "Type" filter chip
    Then a dropdown should appear with options:
      | icon         | label          |
      | Folder       | Folders        |
      | FileText     | Documents      |
      | Presentation | Presentations  |
      | Table2       | Spreadsheets   |
      | Image        | Photos & images|
    When I select "Documents"
    Then only document files should be visible
    And the "Type" chip should show as active with the selected filter

  Scenario: Modified filter dropdown shows date range options
    When I click the "Modified" filter chip
    Then a dropdown should appear with options:
      | label           |
      | Today           |
      | Last 7 days     |
      | Last 30 days    |
      | This year       |

  # ── View Modes ──

  Scenario: Grid view shows Google Drive-style file cards with preview area
    Given the view mode is "grid"
    Then each file card should have:
      | element       | description                                    |
      | title bar     | colored type icon + file name + more menu       |
      | preview area  | large preview region below the title bar        |
    And the title bar color should match the file type

  Scenario: List view shows a table with column headers
    Given the view mode is "list"
    Then a table header row should display: "Name", "Owner", "Date modified", "File size"
    And each file row should show: type icon, name, owner avatar + name, date, size, more menu
    And rows should have hover highlight

  Scenario: View mode toggle has list and grid buttons
    Then the view toggle should show a list icon and grid icon
    And the active view should be visually highlighted

  # ── Content Display ──

  Scenario: Folders and files display together in one unified view
    Given items include folders and files
    Then folders should appear first, then files
    And there should NOT be separate "Folders" and "Files" section headers

  Scenario: Suggested section shows at root level
    Given I am at the root "My Drive" view
    And there are recent files
    Then a "Suggested" section should appear above the main file list
    And it should show the most recently modified files as horizontal cards

  # ── Search & Breadcrumb ──

  Scenario: Search filters items by name using SearchBar component
    Given items include "Report", "Budget", "Notes"
    When I type "Rep" into the search bar
    Then only "Report" should be visible

  Scenario: Breadcrumb shows current location
    Given I have navigated into "Documents"
    Then the title area should show "Documents" with a back/breadcrumb path

  # ── Context Menu ──

  Scenario: More menu on each item shows actions
    When I click the three-dot menu on a file
    Then a dropdown should appear with: "Rename", "Move to", "Delete"

  # ── Sidebar Navigation ──

  Scenario: Clicking sidebar items changes the view
    When I click "Recent" in the sidebar
    Then onSidebarNavigate should be called with "recent"
    When I click "Starred" in the sidebar
    Then onSidebarNavigate should be called with "starred"

  # ── Storage Indicator ──

  Scenario: Storage usage shown at bottom of sidebar
    Given the user has used 20.1 MB of 100 MB
    Then the sidebar bottom should show "20.1 MB of 100 MB used"
    And a progress bar should indicate the usage percentage

  # ── UI / Look and Feel ──

  @visual
  Scenario: Grid view cards match Google Drive style
    Then file cards should have a light gray background in the preview area
    And the title bar should be at the top with the type-colored icon
    And cards should have subtle rounded corners and borders
    And hover should show a light blue border

  @visual
  Scenario: List view matches Google Drive style
    Then rows should alternate with subtle hover backgrounds
    And the Name column should have a sort indicator arrow
    And owner should show an avatar circle + name

  @visual
  Scenario: Left sidebar has clean minimal styling
    Then the sidebar should have a white/light background
    And active items should have a highlighted background
    And icons should be consistently sized and colored

  @responsive
  Scenario: Layout adapts to screen size
    When the viewport is 375px wide
    Then the left sidebar should be hidden
    And the grid should show 1-2 columns
    When the viewport is 768px wide
    Then the sidebar should be visible
    And the grid should show 3 columns
    When the viewport is 1280px wide
    Then the grid should show 5 columns
