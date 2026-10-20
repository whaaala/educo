Feature: A template is only a start — anything on it can be moved, nested, shifted, placed and re-tagged
  BATCH LE-15l (docs/TASK_TREE.md), RULE FOUNDATION ("A TEMPLATE IS ONLY A START"). The user, 2026-10-20: "if I select a
  template… can I really edit everything… move items around… shift it to the right, to the left… put another stack next to
  it… put another section inside the hero section… select the grid and see the whole page of the grid… component inside
  components can move to the left, to the right… for all of the components, all of the pages… going forward".
  Every page is MADE THROUGH THE UI (Add page → a template, or a section from the Sections tab). The lists are ENUMERATED
  from config/page-templates.json, config/sections/*.json and the component catalogue, never typed by hand, so a template,
  a section or a component added later is driven the day it appears.
  Guards: scripts/uat/uat-le15l-probe.js · scripts/uat/uat-le15l-emulator.js · tests/e2e/template-editable.spec.ts · tests/unit/leaf-meanings.test.ts · tests/unit/row-with-block.test.ts

  Background:
    Given a page made from a template, or a section added from the Sections tab, through the UI

  # ── Tier 1 · every page template, every kind of block on it, every gesture ──

  Scenario Outline: Any block of a template page moves <way> by <gesture>
    Given a <kind> on a page made from <template>
    When I move it <way> by <gesture>
    Then it is where I put it, everything else keeps its order, and nothing is lost or left empty
    And one Ctrl+Z puts it back
    And the Preview shows it where the canvas does
    Examples: every template × every kind of block on it × every way × every gesture, enumerated
      | template | kind                                                                                            | way                                               | gesture                                                             |
      | each     | section · stack · row · grid · grid cell · heading · text · button · picture · card · component | up · down · left · right                          | the grip dragged · the bar's arrows · the arrow keys · a finger     |
      | each     | the same                                                                                        | into another block · out of its block · to another section | the grip dragged · a finger                                          |

  Scenario Outline: Something new goes <where> a block of a template page
    Given a <kind> on a page made from <template>
    When I drop a <new> <where> it, from the Blocks panel, or by "Add a block inside"
    Then the <new> is there, the block keeps its content, and the two lay out as dropped (side by side stays side by side)
    And one Ctrl+Z takes it away
    Examples: enumerated
      | template | kind               | new                         | where                       |
      | each     | every kind above   | Stack · Text · Picture       | beside (left and right)     |
      | each     | every container    | Stack · Section · Grid       | inside                      |
      | each     | the hero           | a section from the library   | inside                      |

  Scenario: Two sections become one
    Given two sections next to each other on a template page
    When I move every block of the second into the first, and delete the empty second
    Then one section holds both, in the order I chose, and one Ctrl+Z at a time takes each step back

  Scenario Outline: Any block is shifted <way> inside its place
    Given a <kind> on a page made from <template>
    When I shift it <way> — by dragging its edge past what is inside it, by its alignment, or floating it free
    Then it moves <way> and stays inside its section, and the words say how far ("Space on the left · 2rem")
    Examples: enumerated
      | template | kind              | way                       |
      | each     | every kind above  | left · right · up · down  |

  Scenario Outline: Any block of a template page goes on the page grid
    Given a <kind> on a page made from <template>, and the page grid shown
    When I place it on the grid's columns, span it wider or narrower, and move it along them
    Then it covers the columns I chose, on the canvas and in the Preview, at every screen
    Examples: enumerated
      | template | kind                                 |
      | each     | every block whose parent is a grid, and a section set on the page grid |

  Scenario Outline: Any block of a template page takes another meaning
    Given a <kind> on a page made from <template>
    When I choose another answer in "What is this block?"
    Then the published page has the element that answer means (section · header · nav · main · article · aside · figure · footer · list)
    And the Page check still passes or says, in plain words, what to fix
    Examples: enumerated
      | template | kind              |
      | each     | every kind above  |

  # ── Tier 2 · every section of the library ──

  Scenario Outline: Every section from the library is ordinary blocks (<section>)
    Given the section <section> added from the Sections tab
    When I move one block inside it out of it, put a Stack beside another, move one up, and give the section another meaning
    Then each works as on a template page, and one Ctrl+Z at a time takes each back
    Examples: every one of config/sections/*.json, enumerated (267 on 2026-10-20)
      | section |
      | each    |

  # ── Tier 3 · every component, and the parts inside it ──

  Scenario Outline: A component and the parts inside it move (<component>)
    Given a <component> inside a section of a template page
    When I move the component left, right, up and down, into another block and beside another
    And I move a part inside it (an item, a button, a picture) up, down, left and right within it
    Then the component and its parts are where I put them, on the canvas and in the Preview
    Examples: every component of the catalogue, enumerated
      | component |
      | each      |

  # ── Every screen ──

  Scenario Outline: The same on <screen>
    When every scenario above is run on <screen>
    Then each gesture works there as it does on a desktop, and a change made on one screen stays on that screen where the builder says so
    Examples:
      | screen                                                    |
      | every width of scripts/uat/screens.js                     |
      | the app on a phone (a finger)                             |
      | the app on a tablet (a finger)                            |

  Scenario: Every gesture the probe cannot make is a ledger line
    When the probe has run
    Then it reports, per template, section and component, each gesture as worked or not with what it saw
    And every "not" is written in BATCH LE-15l's ledger before anything is fixed

  # ── What the probe found (BATCH LE-15l ledger), each reproduced by hand first ──

  Scenario: A Stack dropped beside a picture shares the line with the words beside it (LE15l-h)
    Given the School home's "A welcome from our head": a picture beside the head's words, on one line
    When I drop a Stack on the picture's right side
    Then the picture, the new Stack and the words are on one line, the picture keeps its width, and nothing goes under it
    And one Ctrl+Z takes the Stack away

  Scenario: Dragging a block to the edge of the window scrolls the page (LE15l-i)
    Given a block picked up by its grip with a mouse
    When I hold it near the bottom (or the top) of the canvas
    Then the page scrolls under it, faster the nearer the edge, and the drop line follows, so I can drop it anywhere on the page

  Scenario: A tall section's bar stays on screen (LE15l-p)
    Given a section taller than the window, selected while its top is at or above the top of the canvas
    Then its bar is on screen and nothing of the editor covers it — above the section if there is room, below it if its bottom is on screen, else pinned at the top of what I can see
    And each button on it works

  Scenario: A component's bar arrows move it, like any block (LE15l-s)
    Given an Accordion dropped into a section of a template page, selected
    When I press "Move up" on its bar
    Then it moves up past the block above it, exactly as the ↑ key does

  Scenario Outline: A <kind> takes another meaning, and the page publishes it (LE15l-g, decided by the user 2026-10-20: "the useful few")
    Given a <kind> on a page made from a template, selected
    When I open Meaning and choose "<choice>" in "What is this block?"
    Then the canvas and the published page both draw it as <element>
    And one Ctrl+Z puts the meaning back
    Examples:
      | kind    | choice                         | element                                   |
      | Text    | Paragraph                      | <p>                                       |
      | Text    | Quote                          | <blockquote>                              |
      | Text    | Small print                    | <p><small>                                |
      | Picture | Picture                        | <img>                                     |
      | Picture | Figure with a caption          | <figure> holding the <img> and a <figcaption> with the words I type |
      | List    | Bulleted                       | <ul>                                      |
      | List    | Numbered                       | <ol>                                      |
      | Button  | Link — goes to a page          | <a href>                                  |
      | Button  | Button — does something here   | <button type="button">                    |

  Scenario: An icon and a divider have one meaning, and say so
    When I select an icon or a divider
    Then Meaning is not offered, because each means one thing only (a picture of a symbol; a dividing line)

  Scenario: Selecting the page or a grid draws the page grid (LE15l-5; decided by the user 2026-10-20: "Show it while a grid is selected")
    Given a page made from a template, with "Show layout guides" off
    When I select the page or a grid (not every block placed on it: nearly all are, which would be "always on")
    Then the page grid's columns are drawn across the page
    When I select a heading instead
    Then they are gone again
    And with "Show layout guides" on they are drawn whatever is selected, as before

  Scenario: A Stack dropped beside the icon of a card goes beside it, as its drop line shows (LE15l-v)
    Given a quick-link card of the School home: an icon above its words, one under the other
    When I drop a Stack on the icon's right side, where the drop line stands beside the icon
    Then the icon and the new Stack are side by side, the card's words stay under them, and nothing gets space it did not have
    And one Ctrl+Z puts the card back
