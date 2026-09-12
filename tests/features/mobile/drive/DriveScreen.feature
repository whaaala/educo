Feature: Mobile Drive Screen
  As a teacher using the mobile app
  I want a file manager to browse, organize, and access my files
  So that I can manage my drive on any device

  Background:
    Given I am logged in as an authenticated teacher
    And the Drive screen is accessible from the app navigation

  # ── Navigation & Layout ──

  Scenario: Mobile layout shows section pills and search
    Given I am on a mobile device (width < 768px)
    When I open the Drive screen
    Then I should see section pills: "Home", "My Drive", "Shared with me", "Recent", "Starred", "Bin"
    And I should see a search bar with placeholder "Search files and folders..."
    And I should see a view toggle for list and grid modes
    And the default view mode should be "list"

  Scenario: Tablet layout shows sidebar and grid view
    Given I am on a tablet device (width >= 768px)
    When I open the Drive screen
    Then I should see a sidebar with navigation sections
    And the sidebar should show a "Drive" title with an icon
    And the sidebar should show a storage usage indicator
    And the default view mode should be "grid"
    And the content area should show a search bar

  Scenario: Switching sections on mobile via pills
    When I tap the "Starred" pill
    Then the active pill should highlight with the primary color
    And I should see only starred items
    And the search query should be cleared

  Scenario: Switching sections on tablet via sidebar
    When I tap "Recent" in the sidebar
    Then the "Recent" section should be highlighted
    And I should see only recent items

  # ── Folder Navigation ──

  Scenario: Tapping a folder navigates into it
    Given I am on the Home section
    When I tap on the "Documents" folder
    Then I should see the contents of the Documents folder
    And breadcrumbs should show "My Drive > Documents"

  Scenario: Breadcrumb navigation allows going back
    Given I am inside "My Drive > Documents"
    When I tap "My Drive" in the breadcrumbs
    Then I should return to the root My Drive view

  Scenario: Back button navigates up the folder stack
    Given I am inside "My Drive > Documents"
    When I press the back button
    Then I should return to the root My Drive view

  Scenario: Back button from root exits the Drive screen
    Given I am at the root of the Drive
    When I press the back button
    Then I should navigate back to the previous screen

  # ── File Display ──

  Scenario: Grid view displays file cards with colored previews
    When I switch to grid view
    Then each file card should show a colored preview header matching the file type
    And each card should show the file name, type label, size, and date
    And folder cards should show item count instead of size

  Scenario: List view displays file rows
    When I switch to list view
    Then each file row should show a colored icon, name, type label, size, and date
    And each row should have a three-dot menu button

  Scenario: Mobile grid uses 2 columns
    Given I am on a mobile device
    When I switch to grid view
    Then files should display in 2 columns

  Scenario: Tablet grid uses 3 columns
    Given I am on a tablet device
    When I am in grid view
    Then files should display in 3 columns

  # ── Search ──

  Scenario: Searching filters items by name
    Given I am viewing files
    When I type "Budget" in the search bar
    Then only items matching "Budget" should be visible

  Scenario: Searching filters items by owner
    When I type "Chidi" in the search bar
    Then only items owned by "Mr. Chidi Okafor" should be visible

  Scenario: Empty search results show message
    When I type "nonexistent" in the search bar
    Then I should see "No results found"

  # ── File Type Icons ──

  Scenario Outline: File type icons match file extensions
    Given a file named "<filename>" exists
    When it is displayed in the drive
    Then it should show the "<icon>" icon with "<color>" color
    And the type label should be "<label>"

    Examples:
      | filename           | icon          | color   | label       |
      | report.pdf         | document-text | #dc2626 | PDF         |
      | notes.docx         | document-text | #2563eb | Document    |
      | data.xlsx          | grid          | #059669 | Spreadsheet |
      | slides.pptx        | easel         | #ea580c | Slides      |
      | video.mp4          | videocam      | #dc2626 | Video       |
      | photo.jpg          | image         | #7c3aed | Image       |
      | memo.txt           | document      | #6366f1 | Text        |

  # ── Starred Items ──

  Scenario: Starred items show star indicator
    Given a file is starred
    When it is displayed in grid view
    Then it should show a star badge on the card
    When it is displayed in list view
    Then it should show a star icon next to the name

  # ── Owner Display ──

  Scenario: Shared files show owner information
    Given a file is owned by "Mrs. Nkechi Eze"
    When it is displayed
    Then it should show the owner name

  # ── Empty States ──

  Scenario Outline: Empty state messages per section
    Given the "<section>" section has no items
    When I navigate to the "<section>" section
    Then I should see "<title>" as the empty state title
    And I should see "<subtitle>" as the subtitle

    Examples:
      | section | title                   | subtitle                                    |
      | recent  | No recent files         | Files you open or edit will appear here      |
      | starred | No starred items        | Star important files and folders for quick access |
      | shared  | Nothing shared with you | Files shared with you will appear here       |
      | bin     | Bin is empty            | Items you delete will appear here            |

  # ── FAB Button ──

  Scenario: FAB button creates new folder
    When I tap the floating action button (+)
    Then the new folder modal should appear
    When I type "Archive" and tap Create
    Then a new "Archive" folder should be created in the current directory

  # ── Responsive ──

  @responsive
  Scenario: Tablet sidebar shows storage indicator
    Given I am on a tablet
    Then the sidebar should show storage usage
    And it should display "58.4 MB of 200 MB used"

  @responsive
  Scenario: Tablet content has proper top padding
    Given I am on a tablet
    Then the sidebar and header should have adequate top padding (48px)
    And the content should not be flush against the status bar
