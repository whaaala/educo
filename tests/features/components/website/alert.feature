Feature: Alert component (Educo UI)
  A SINGLE-MESSAGE notice — icon + title + body (+ meta, image) — in 6 severities and 7 treatments.
  Scope decision (2026-09-05): the Alert is strictly one message. It is NOT a stack/notification list, so it
  has no add / duplicate / delete / reorder and no on-canvas item toolbar. Its message still has editable,
  individually styleable PARTS, so it keeps per-part styling, per-item CSS, positioning and four-sided spacing.
  Component 2 of the builder.

  Background:
    Given the Alert is a single clean component added from the Blocks palette
    And it renders one .eu-alert row inside .eu-alert-stack, from one shared function for canvas AND export
    And every colour is a design token so it re-themes in all 4 themes and passes WCAG

  # ── A single message, not a list ──
  Scenario: The Alert shows exactly one message
    Then only the first message is rendered, however many the document happens to store
    And the inspector offers no Add, Remove or Reorder for it
    And no on-canvas item toolbar appears when I click the message
    And an older document holding several messages is not rewritten — the extras simply stop showing

  # ── Editing the message ──
  Scenario: Every part of the message is editable
    Then I can edit the title and body directly on the canvas by clicking the text
    And I can edit title, body, meta, image + alt, and the icon (from the IconPicker) in the inspector
    And I can set the icon's colour, size, align and free-move (rem)
    And I can point-and-click style the Title and Message parts (text · fill · font · size · align · move)
    And I can set the message's spacing on all four sides — space inside (padding) and space around (margin)
    And I can write "More CSS" targeting title/body/icon/meta/media

  # ── The inspector mirrors the Accordion ──
  Scenario: Inspector look, feel and functionality mirror the Accordion
    Then the Content tab shows a Design gallery (tap-to-apply treatments), an Items editor, and per-item styling
    And Component colours, Typography and Advanced CSS sections apply to the whole component
    And accordion-only controls (Expand-all, Search, FAQ schema, Open-by-default, float/group) are hidden for the Alert

  # ── Severity (intent) ──
  Scenario Outline: Six severities set an accent + a default icon + the ARIA role
    When I set the Alert severity to "<severity>"
    Then every item carries "eu-alert--<severity>" and shows the default "<severity>" icon unless overridden
    And danger/warning announce with role="alert" (assertive); the rest with role="status" (polite)
    Examples:
      | severity |
      | info     |
      | success  |
      | warning  |
      | danger   |
      | neutral  |
      | brand    |

  # ── Style treatments (design gallery = variants) ──
  Scenario Outline: Treatments restyle the whole stack from one accent var
    When I pick the "<treatment>" design
    Then every item renders in that treatment, reading the severity accent from --al-c
    Examples:
      | treatment   |
      | Soft        |
      | Solid       |
      | Outline     |
      | Left accent |
      | Top accent  |
      | Card        |
      | Glass       |

  # ── Form factor + ask-on-add ──
  Scenario: The form factor is chosen up front and editable after
    Given adding an Alert asks how to display it (form × severity × treatment)
    When I set the form factor to inline, banner, callout or toast
    Then the stack carries "eu-alert-stack--<form>" and lays out accordingly

  # ── Dismiss (reusable, zero-JS default) ──
  Scenario: Dismiss is opt-in and self-contained
    Given a plain alert ships zero JavaScript
    When I enable "Show a dismiss (×) button on each"
    Then each item gets a × button with data-eu-dismiss
    And the export adds ONE small guarded script that fades + removes an alert on click (reusable primitive)

  # ── Parity: canvas / preview / export ──
  Scenario: One shared render, everywhere
    Then the same renderAlertHTML output drives the canvas, the Preview and the exported HTML
    And the export is fully self-contained (inline SVG icons, tokened colours, no external assets)
