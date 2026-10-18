Feature: Link addresses — tidied, checked, and never dangerous
  When a person types a link into the editors' link dialog, the address is tidied into one that works, checked before it
  is accepted, refused when it could run script, and shown back in a short readable form.
  Guards: tests/unit/link-utils.test.ts

  Scenario Outline: A typed address is tidied into one that works
    When I type "<typed>" as a link
    Then the link goes to "<goes to>"

    Examples:
      | typed               | goes to                    |
      | educo.com           | https://educo.com          |
      | www.educo.com/path  | https://www.educo.com/path |
      | http://x.com        | http://x.com               |
      | mailto:a@b.com      | mailto:a@b.com             |
      | tel:+123            | tel:+123                   |
      | teacher@educo.edu   | mailto:teacher@educo.edu   |
      | /students           | /students                  |
      | #section            | #section                   |

  Scenario: Spaces round an address are trimmed, and a blank address is no link
    When I type " educo.com " with spaces round it
    Then the link goes to "https://educo.com"
    When I leave the address empty or type only spaces
    Then there is no address, it is not accepted, and nothing is linked

  Scenario: An address that could run script is refused
    When I type a "javascript:", "data:" or "vbscript:" address — in capitals, broken by a new line, or with spaces
    Then it is refused as dangerous
    But ordinary web and e-mail addresses are allowed

  Scenario: Only real addresses are accepted
    Then a web address, a full address with a path and a query, an e-mail, a page path, a #bookmark and a local address are accepted
    And words that are not an address are not

  Scenario: A link is shown back in a short readable form
    Given the link "https://www.educo.com/students/?tab=1"
    Then it is shown as "educo.com/students"
    And a very long link is cut to the room there is and ends with "…"
    And an empty link shows nothing

  Scenario: Something counts as linked only when it goes somewhere
    Then an address, or a target in the same document, counts as a link
    But nothing, or an address of only spaces, does not
