Feature: Hover, focus and entrance effects on a block (Interactions 1a and 1b)
  Any block can carry a named hover-and-focus effect and an entrance (lib/interactions.ts). Effects cost nothing when
  none is chosen, use tokens only, honour reduced motion and never leave a page blank. Typed-in CSS may not animate a
  property that forces layout.
  Guards: tests/unit/interactions.test.ts

  # ── Hover & focus ──
  Scenario: No effect chosen, nothing shipped
    When a block has no hover effect, or one that does not exist
    Then no CSS is written for it, and the published page has no hover rule

  Scenario: A keyboard user gets what a pointer user gets
    Given a block with the "Lift" hover effect
    Then the same look appears on hover, on keyboard focus, and when a control inside it takes focus
    And each of those is its own rule, so a browser without one selector still shows the others
    And every part of the look outranks the block's own resting style

  Scenario: Reduced motion calms the movement but keeps the feedback
    Given a visitor who asks for reduced motion
    Then a moving effect stops moving
    And a glow keeps its fade, only its press is calmed

  Scenario: The hover catalogue is clean
    Then no hover effect writes its own colour
    And the first choice is "no effect", and no two effects share an id or a name

  Scenario: Each block on the page gets its own effect, and the published page carries it
    Given a block with "Lift" holding one block with no effect and one with "Glow"
    Then the lifting and glowing blocks each get their own rule and the plain one gets none
    And the exported page carries the effect

  # ── Entrances ──
  Scenario: No entrance chosen, nothing shipped
    Then a block with no entrance, or one that does not exist, writes nothing, and the page carries no entrance

  Scenario: An entrance never hides the content
    Given a block with the "Fade in" entrance
    Then the hiding lives only in the animation's starting point, so if it does not run the block is simply there
    And each animation is written once per page however many blocks use it

  Scenario: A scroll entrance still arrives without the script
    Given a block whose entrance waits until it scrolls into view
    Then it is held only by a class the page's script adds, and plays on load without it

  Scenario: "One after another" brings in the children a beat apart
    Then each child starts a beat after the one before, and the container itself does not animate

  Scenario: Reduced motion removes every entrance
    Then for a visitor who asks for reduced motion, no entrance plays at all

  Scenario: The entrance catalogue is clean, and the published page carries the entrance
    Then no entrance writes its own colour, the first choice is "no entrance", ids are unique and every animation is named for Educo
    And the exported page carries the entrance and its animation

  # ── Typed-in CSS ──
  Scenario: Typed-in CSS may not animate the layout
    When a person types a transition on width, height, top, a margin, padding, font size or flex basis, or on "all"
    Then it is refused
    But a transition on transform, opacity, filter, shadow or colours is allowed
    And an ordinary width or padding is left alone — only animating it is refused
