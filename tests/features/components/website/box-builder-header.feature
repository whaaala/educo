Feature: The header, best-grade (BATCH LE-11 · PS-6 · PS-7 · PO-7/PN-3 · PS-10 · PS-14 · AX-6)
  A school's header does more than sit at the top: it gets out of the way while you read, it can lie over the first
  photo, its top bar can scroll away while the menu stays, it can carry an announcement, it can be left off one page —
  and it never covers so much of a small screen that the page cannot be read.

  Scenario Outline: a held header that gets out of the way when you scroll down
    Given a Page header that "Sticks when reached"
    When I set "When you scroll down" to "<choice>"
    And a visitor scrolls down past it
    Then the header is <state>
    When the visitor scrolls up, or tabs into it, or reaches the end of the page
    Then the header is back

    Examples:
      | choice      | state                |
      | Slides away | moved off the screen |
      | Fades out   | faded out            |

  Scenario: with reduced motion the header goes and comes without moving
    Given a header that slides away
    And the visitor's system asks for reduced motion
    Then it disappears and reappears with no slide

  Scenario: a header over the first section
    Given a held Page header
    When I tick "Over the first section"
    Then the first section starts at the very top of the page, under the header
    And "When it takes hold" becomes "Solid", so the header's words stay readable once it is held

  Scenario: a two-row header keeps only its menu row on screen
    Given a Page header with a top bar and a menu row
    When I tick "Keep only the last row on screen"
    And a visitor scrolls down
    Then the top bar has scrolled away and the menu row is held at the top

  Scenario: an announcement bar on every page
    Given a shared Page header
    When I press "Add an announcement bar"
    Then an announcement bar is the header's first row, on every page
    And a visitor can close it, and it stays closed on the other pages

  Scenario: the header left off one page
    Given a shared Page header on three pages
    When on "Page 2" I untick "Show the header on this page" in Page settings
    Then "Page 2" has no header, and the other pages still have it
    When the header is changed on "Home" and I tick it again on "Page 2"
    Then "Page 2" has the changed header

  Scenario: held bars never cover more than a quarter of a small screen
    Given a held header and a held bottom bar that together are taller than a quarter of a 360 × 640 phone
    When I open the Page check
    Then it warns that the held bars cover too much of the screen, naming them, with Show me
