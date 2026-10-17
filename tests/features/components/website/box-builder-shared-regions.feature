Feature: One header and one footer for every page, and a page that fills the screen (BATCH LE-8 · PS-2 · PS-9)
  A school site has many pages and one top and one bottom. The header and the footer are edited once and are the
  same on every page — on the canvas, in the Preview, in the downloaded site and in the app's webview — so the menu
  is written once. A page shorter than the screen still ends with its footer at the bottom of the screen.

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

  Scenario: the shared menus are still menus on every page
    Given a shared header with four Links and a shared footer with three
    Then every page publishes "Main menu" and "Footer menu" as nav > ul > li > a

  Scenario: a page's meaning is the same on every screen
    When at Mobile I set a block's "What is this block?" to "Page header"
    Then it is published as the page's header on every screen

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
