Feature: The app's layout — screen classes, the navigation shell and list-detail (BATCH A-2)
  Every screen edge, place and word comes from config/layout.json, config/app-shell.json and config/sample-lists.json
  (RULE CFG). The same rules run on the web sample page (/app-preview/<role>) and in the Educo app (apps/mobile).

  Background:
    Given the rungs start at 600, 840, 1200 and 1600 px and the height classes at 480 and 900 px (config/layout.json)

  Scenario Outline: a window gets the navigation its class says
    When the window is <width> × <height>
    Then the navigation is a <shell>
    And a list and its detail show <panes> pane(s)

    Examples:
      | width | height | shell   | panes |
      | 360   | 800    | bar     | 1     |
      | 800   | 360    | bar     | 1     |
      | 599   | 960    | bar     | 1     |
      | 600   | 960    | rail    | 1     |
      | 839   | 1024   | rail    | 1     |
      | 1024  | 800    | rail    | 2     |
      | 840   | 479    | bar     | 2     |
      | 1199  | 900    | rail    | 2     |
      | 1200  | 900    | sidebar | 2     |

  Scenario: a bar holds at most five places; the rest go under More
    Given the teacher's seven places
    When the window is a phone
    Then the bar shows the first four places and "More"
    And "More" opens a menu of the other three, by keyboard too, and Escape gives focus back to "More"

  Scenario: the place you are on is marked
    When I open "Classes" and then one class inside it
    Then "Classes" is the current place in the bar, the rail or the sidebar

  Scenario: the arrows walk the places
    When I focus the first place and press the arrow along the shell
    Then focus moves to the next place, and from the last one wraps to the first

  Scenario: list-detail on a phone
    Given a phone
    When I tap a class in the list
    Then its detail opens at its own address, with Back
    And Back (the button, the browser's or Android's) returns to the list where I left it

  Scenario: list-detail from tablet landscape up
    Given a window 840 px or wider
    Then the list sits beside the detail of the first class
    And tapping another class swaps the detail without adding a history step

  Scenario: a detail address opened straight from a link
    When I paste the address of one class
    Then a phone shows that class with Back, and a wide window shows both panes with that class chosen

  Scenario: a resize keeps the open row
    Given a class is open at 1280 px
    When the window narrows to 375 px and widens again
    Then the same class stays open

  Scenario: nothing to show
    Then an empty list says "Nothing here yet." and an address for a row the list lacks says "That one is not in this list."

  Scenario: sample data says so
    Then every sample row carries "Sample", and the sample roles say "Sample data — not a school's real records."

  Scenario: the app follows a turn
    Given the Educo app on a tablet held upright
    When the tablet is turned on its side, and a phone is turned on its side
    Then the tablet keeps the rail and splits the list, and the phone keeps its bar and one pane — without a restart
