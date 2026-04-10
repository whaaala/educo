# Accessibility Guide — WCAG 2.1 AA Compliance

All pages, features, and components MUST follow these guidelines.

## Keyboard Navigation
- Every interactive element reachable via Tab key
- Enter/Space activates buttons and links
- Escape closes dialogs, dropdowns, menus
- Arrow keys navigate within menus, tabs, dropdowns, tables
- Focus trap inside open modals/dialogs (Tab cycles within, not outside)
- Skip navigation link for main content
- No keyboard traps — user can always Tab away

## ARIA Attributes
- **Buttons**: `aria-label` if text isn't descriptive (icon-only buttons)
- **Inputs**: `<label>` with `htmlFor`, or `aria-label`/`aria-labelledby`
- **Errors**: `aria-describedby` linking input to error message, `aria-invalid="true"`
- **Dialogs**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title
- **Menus**: `role="menu"`, `role="menuitem"`, `aria-expanded`
- **Tabs**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`
- **Status messages**: `role="status"` or `aria-live="polite"` for toasts/notifications
- **Loading**: `aria-busy="true"`, `role="progressbar"` with `aria-valuenow`

## Color Contrast
- **Normal text**: minimum 4.5:1 contrast ratio against background
- **Large text (18px+ or 14px bold)**: minimum 3:1
- Applies to ALL available themes (light, dark, midnight, purple)
- Use https://webaim.org/resources/contrastchecker/ to verify
- Never convey information by color alone — add icons, text, or patterns

## Focus Indicators
- All focusable elements must have visible focus indicator
- Use `focus:ring-2 focus:ring-blue-500` (or theme-appropriate color)
- Focus indicator contrast: minimum 3:1 against adjacent colors
- Never use `outline: none` without an alternative focus style

## Images & Icons
- Informative images: descriptive `alt` text
- Decorative images/icons: `alt=""` or `aria-hidden="true"`
- SVG icons: `role="img"` with `aria-label`, or `aria-hidden="true"` if decorative
- Icon-only buttons: MUST have `aria-label` or `title`

## Forms
- Every input has a visible `<label>`
- Required fields: `required` attribute + visual indicator (asterisk)
- Error messages: visible, linked with `aria-describedby`, announced to screen readers
- Group related fields with `<fieldset>` and `<legend>`
- Auto-focus first field on dialog open

## Tables
- Use semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`
- Column headers with `scope="col"`, row headers with `scope="row"`
- Caption or `aria-label` describing the table
- Sortable columns: `aria-sort="ascending|descending|none"`

## Motion & Animation
- Respect `prefers-reduced-motion` — disable or simplify animations
- No auto-playing content that can't be paused
- No content that flashes more than 3 times per second

## Responsive Accessibility
- Touch targets: minimum 44x44px on mobile
- Zoom: page usable at 200% zoom
- Text resizable without loss of content
- No horizontal scrolling at 320px viewport width

## Testing
- Tab through every page — all interactive elements reachable
- Screen reader test (NVDA/VoiceOver) — all content announced correctly
- Color contrast check in all available themes
- Keyboard-only navigation test — complete workflows without mouse
