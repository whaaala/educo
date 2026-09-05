Feature: Alert component (Educo UI)
  A multi-item message component — a stack of alerts (icon + title + body + meta + image), one item = a
  single alert, many = a notification list. It MIRRORS the Accordion: it reuses the same item data (accItems),
  the same item helpers, and the same rich per-item editor, so every item is edited exactly like an accordion
  item (Rule F). Component 2 of the builder.

  Background:
    Given the Alert is a single clean multi-item component added from the Blocks palette
    And it reuses the Accordion's items (accItems) + helpers, rendered as a stack of .eu-alert rows
    And every colour is a design token so it re-themes in all 4 themes and passes WCAG

  # ── Full item CRUD (Rule F) — mirrors the Accordion, recursively ──
  Scenario: CRUD on every alert item, and every nested sub-item
    Then I can Add an alert, Remove one (min-guard keeps at least one), and Reorder ▲▼
    And for EACH item I can edit: title, body (rich), meta, image + alt, and icon (from the IconPicker)
    And per item I can set the icon's colour, size, align and free-move (rem)
    And per item I can point-and-click style the Title and Message parts (text · fill · font · size · align · move)
    And per item I can write "More CSS" targeting title/body/icon/meta/media
    And each item can hold NESTED sub-items that get the SAME full editor, recursively — nothing is read-only

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
