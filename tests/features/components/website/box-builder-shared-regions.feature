Feature: One header and one footer for every page, and a page that fills the screen (BATCH LE-8 · PS-2 · PS-9)
  A school site has many pages and one top and one bottom. The header and the footer are edited once and are the
  same on every page — on the canvas, in the Preview, in the downloaded site and in the app's webview — so the menu
  is written once. A page shorter than the screen still ends with its footer at the bottom of the screen.
  Guards: tests/unit/shared-regions.test.ts

  Background:
    Given a site with the pages "Home", "Page 2" and "Page 3" added with "+"

  Scenario: a block made the Page header is on every page
    When on "Home" I set a block's "What is this block?" to "Page header"
    Then "On every page" is on
    And "Page 2" and "Page 3" begin with the same header

  Scenario: the header is edited once
    Given the shared header holds four Links
    When on "Page 3" I change a link's words
    Then "Home" and "Page 2" show the new words, on the canvas, in the Preview and in the downloaded site

  Scenario: deleting the shared footer deletes it everywhere, and one undo brings it back everywhere
    Given a shared footer
    When I delete it on "Page 2"
    Then no page has the footer
    When I press Ctrl+Z
    Then every page has the footer again

  Scenario: a page added later arrives with the header and the footer
    Given a shared header and a shared footer
    When I add a page with "+"
    Then the new page begins with the header and ends with the footer

  Scenario: turning "On every page" off leaves every page its own copy
    Given a shared header
    When on "Page 2" I turn "On every page" off
    Then every page still has the header
    And changing it on "Page 2" changes no other page

  Scenario: a header that is not on every page is that page's alone
    Given "Home" has a header and a footer with "On every page" off
    Then "Page 2" and "Page 3" arrived with no header and no footer
    And changing the header's words on "Home" changes no other page

  Scenario: turning "On every page" on makes this page's header the one on every page
    Given "Home" has a header with "On every page" off, and "Page 2" has a header of its own
    When on "Home" I turn "On every page" on
    Then every page has the header from "Home", and the header "Page 2" had is gone

  Scenario: a shared header made something else on one page leaves the other pages their header
    Given a shared header
    When on "Page 2" I change its "What is this block?" to "Section"
    Then "Home" and "Page 3" still have their Page header
    And only deleting the shared header takes it off every page

  Scenario: deleting the shared footer leaves the header alone
    Given a shared header and a shared footer
    When I delete the footer on "Page 2"
    Then every page still has the header

  Scenario: a duplicated page keeps the shared header
    Given a shared header
    When I duplicate "Home"
    Then the copy has the header, still "On every page"

  Scenario: pages can be put in a different order
    When I press "Move later" on "Home"
    Then the pages read "Page 2", "Home", "Page 3"
    When I press "Move earlier" on "Page 3"
    Then it swaps with the page before it
    And the first page cannot move earlier, nor the last page later
    And the home page stays the home page, and every page keeps the shared header

  Scenario: "End" and "Start" put a block in the page's content, never outside its header and footer
    Given a page with a header, two sections and a footer
    When I add a block at the "End", with nothing selected or with a block in a section selected
    Then it lands just above the footer
    When I add a block at the "Start"
    Then it lands just under the header
    And on a page with neither a header nor a footer, End and Start are the very end and the very start

  Scenario: a link to a page that was deleted is named by the Page check
    Given a header with a Link and a Button to a page that was deleted, and a Link to "Home"
    When I open the Page check
    Then it names the Link and the Button to the deleted page — they would publish as a dead "#" — and not the Link to "Home"

  Scenario: the shared menus are still menus on every page
    Given a shared header with four Links and a shared footer with three
    Then every page publishes "Main menu" and "Footer menu" as nav > ul > li > a

  Scenario: a page's meaning is the same on every screen
    When at Mobile I set a block's "What is this block?" to "Page header"
    Then it is published as the page's header on every screen
    And a heading's level, a landmark's name and "On every page" are likewise one setting for every screen

  Scenario Outline: a short page's footer sits at the bottom of the screen
    Given a page with a header, one short section and a footer
    When I open the Preview at <width>
    Then the footer's bottom is the screen's bottom
    And a page taller than the screen gets no added space

    Examples:
      | width |
      | 360   |
      | 375   |
      | 768   |
      | 1280  |
      | 1920  |

  Scenario: only a page that ends with a footer is stretched, and only the footer moves
    Given a page with a header and one short section but no footer
    Then the page is not stretched to the screen and nothing moves
    Given a page with a header, a section and a footer
    Then only the footer is pushed down, never the section above it

  Scenario: a top space I gave the footer is mine
    Given a short page whose footer I gave a top outer space
    Then that space is kept, not replaced by the push to the bottom
