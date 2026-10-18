Feature: A picker closes when its button scrolls away, never on the scroll that brought it into view (A1-5)
  The Inspector's pickers (a font, a background, an icon, a colour, a menu of actions) close when the page scrolls.
  The scroll that brings a control into view arrives a moment after the click that opened it, and used to close the
  list at once: the first click did nothing. A picker now closes only when a scroll has MOVED its button.
  Guards: tests/unit/scroll-away.test.ts

  Scenario: The scroll that arrives just after opening leaves the list open
    Given I open a picker whose button had to scroll into view
    When the scroll arrives and the button has not moved
    Then the list stays open

  Scenario: Scrolling the button away closes the list
    Given an open picker
    When I scroll the page and the button moves
    Then the list closes, once

  Scenario: Scrolling inside the list never closes it
    Given an open picker with a long list
    When I scroll inside the list, even after the button has moved
    Then the list stays open
