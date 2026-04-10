# Shared Components Reference

Always check these before creating new UI elements.

## Buttons
- `Button` (`components/shared/Button.tsx`) — primary/secondary/outline/ghost/danger variants, all themed
- `FormButton` (`components/shared/FormButton.tsx`) — gradient form submit button

## Form Fields
- `FormInput` (`components/shared/FormInput.tsx`) — text/number/email/date/time with icons, validation
- `FormDropdown` (`components/shared/FormDropdown.tsx`) — dropdown with label, icon, error states
- `CustomDropdown` (`components/shared/CustomDropdown.tsx`) — compact dropdown, blue/purple variants
- `SearchableDropdown` (`components/shared/SearchableDropdown.tsx`) — async search dropdown
- `FormTextarea` (`components/shared/FormTextarea.tsx`) — textarea with attachments, char count
- `TagInput` (`components/shared/TagInput.tsx`) — tag input with suggestions

## Color Pickers
- `ColorPickerPopover` — popover with trigger, solid/gradient/text modes
- `ColorGrid` — inline color swatch grid
- `TabbedColorPalette` — solid/gradient/glossy tabs
- All from `components/shared/ColorPalettePicker.tsx`

## Dialogs & Modals
- `EditorDialog` (`components/shared/EditorDialogs.tsx`) — editor-specific dialog
- `Modal` (`components/shared/Modal.tsx`) — general purpose modal
- `ShareDialog` (`components/shared/ShareDialog.tsx`) — sharing UI
- `DownloadDialog`, `EmailDialog`, `PublishDialog` — action dialogs

## Data Display
- `DataTable` (`components/shared/DataTable.tsx`) — sortable, paginated table
- `ResponsiveListTable` (`components/shared/ResponsiveListTable.tsx`) — responsive wrapper
- `FileCardGrid` (`components/shared/FileCardGrid.tsx`) — file/folder card grid

## Layout
- `PageLoader` / `InPageSpinner` — loading states
- `Tooltip` (`components/shared/Tooltip.tsx`) — hover tooltips
- `FormSection` (`components/shared/FormSection.tsx`) — collapsible form sections
