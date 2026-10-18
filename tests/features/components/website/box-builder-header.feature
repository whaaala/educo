Feature: The header, best-grade (BATCH LE-11 · PS-6 · PS-7 · PO-7/PN-3 · PS-10 · PS-14 · AX-6)
  A school's header does more than sit at the top: it gets out of the way while you read, it can lie over the first
  photo, its top bar can scroll away while the menu stays, it can carry an announcement, it can be left off one page —
  and it never covers so much of a small screen that the page cannot be read.
  Guards: tests/unit/header-best.test.ts

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

  Scenario: a header left off its only page is still the site's header
    Given a site of one page whose shared header I left off that page
    When I add a page with "+"
    Then the new page arrives with the header
    When I tick "Show the header on this page" again on the first page
    Then the first page has its header back

  Scenario: the page carries the header's script only when it needs one
    Given a held Page header that does nothing but stick
    Then the published page has no header script
    When the header slides or fades away, lies over the first section, or keeps only its last row
    Then the published page carries the header script

  Scenario: a header held only on a phone still gets out of the way there
    Given a Page header with no hold on the desktop, and "Sticks when reached" set while editing Mobile
    When I set it to slide away and to lie over the first section
    Then on a phone it slides away and lies over the first section, as a header held everywhere does

  Scenario: the announcement bar is a row of its own above a Side by side header
    Given a Page header whose logo and links are Side by side, centred, with space between them
    When I press "Add an announcement bar"
    Then the bar is the header's first row, and below it the logo and links are still one line, centred, with the same space
    And the block is still the shared Page header, held at the top

  Scenario: a header offers "Add an announcement bar" only while it has none
    Given a Page header that already holds an announcement bar, on its own or on a line of its own
    Then "Add an announcement bar" is not offered again

  Scenario: the section under a header that lies over it keeps its words clear of the header
    Given a held Page header ticked "Over the first section", and a hero section after it with a background
    Then the hero's words start below the header, its own top space added to the header's height
    And the hero's background still runs up under the header
    And the section after the hero, or a hero under a header that does not lie over it, gets no added space

  Scenario: Before the header and After the footer stay inside the page's content
    Given a page with a header, two sections and a footer
    When I add a block "Before" the header
    Then it lands just under the header
    When I add a block "After" the footer
    Then it lands just above the footer
    And Before and After a section in the content put the block exactly there

  Scenario: held bars never cover more than a quarter of a small screen
    Given a held header and a held bottom bar that together are taller than a quarter of a 360 × 640 phone
    When I open the Page check
    Then it warns that the held bars cover too much of the screen, naming them, with Show me
    But held bars at or under a quarter of the screen are fine
    And the top rows of a header that scroll away are not counted
