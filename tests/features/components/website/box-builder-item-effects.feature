Feature: Box Builder — an item reacts and arrives on its own
  As a school putting a list of announcements or a set of FAQs on a page
  I want each row to be able to respond to a pointer and to arrive in its own right
  So that a list reads as a set of things rather than one undifferentiated lump

  Background:
    Given a multi-item component — an accordion of questions, or a stack of alert messages
    And whatever the canvas shows is exactly what the exported site shows

  # ── RULE A: what a block can do, an item can do ──
  Scenario: An item carries the same named effects a whole block can
    Then a row or a message offers the same "Hover & focus" and "Entrance" choices a block offers
    And they come from the same catalogue and the same emitter
    # So a row's Lift IS the block's Lift. Two implementations would drift, and one of them would be wrong.

  Scenario: Hovering one row moves that row
    Given a row with the "Lift" hover effect
    When a visitor points at it
    Then that row lifts
    And the row next to it does not move
    And a keyboard user focusing it gets the same response

  Scenario: A row with no effect stays still
    When a visitor points at a row that has no hover effect
    Then nothing moves
    And the page ships no extra CSS for it at all

  Scenario: An item's entrance settles at its natural place
    Given a row with the "Rise up" entrance
    Then once it has arrived it is fully opaque and unmoved
    # The safety property the whole entrance system rests on: the animation runs FROM hidden TO the item's
    # natural look, so an item is simply present if the animation never runs — old browser, printer, reduced
    # motion. A reveal that hides content and needs something to run is how a page ends up blank.

  Scenario: An item's entrance does not stagger its own parts
    Then the title and the body of one item arrive together
    # An item is one thing. Its children are its parts, not a list.

  Scenario: The item needs a class of its own
    Given a row whose ONLY setting is a hover effect
    Then the markup still stamps that row's per-item class
    # The class used to be stamped only for styling overrides, so an effect-only row had no selector for its
    # rule to attach to — the CSS would have been emitted and matched nothing.

  Scenario: An item's entrance brings its keyframes with it
    Then the page carries the @keyframes the animation names
    # Keyframes are emitted once per page from the set of effects in use. An id that never reached that set
    # would animate to a name that does not exist, which is silently nothing.

  # ── Stagger ──
  Scenario: "One after another" staggers the ITEMS
    Given a component with an entrance and "bring the items in one after another"
    Then the first row arrives immediately and each following row waits a beat
    And the component as a whole does not animate
    # It used to: a component's block wrapper contains a <style> tag and the component itself, so `> *`
    # animated the whole thing as one lump and gave an invisible tag the first beat. The rows never staggered.

  Scenario: A plain container still staggers its blocks
    Given a section with an entrance and "bring the blocks inside in one after another"
    Then its direct children arrive one after another
    # `> *` is right there — that is what a container's children are.

  Scenario: The control is offered where it works
    Then "one after another" is offered for a container AND for a multi-item component
    # It was offered only for containers, so for a component it was both unreachable and wrong. Fixing the
    # emitter without offering the control would have left the capability invisible.
