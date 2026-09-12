# Full Internationalization (i18n) Plan

## Overview
Full UI translation of the entire Educo application across all platforms (desktop, mobile, tablet) so that every text string — menus, tooltips, buttons, labels, messages, errors — displays in the user's selected language.

## Recommended Stack

### Desktop (Next.js)
- **Library**: `next-intl` — built for Next.js App Router, supports server & client components
- **Translation files**: JSON per language in `messages/` directory
- **URL strategy**: `/en/dashboard`, `/fr/dashboard` (locale prefix) OR cookie-based

### Mobile (React Native/Expo)
- **Library**: `i18next` + `react-i18next` — most popular RN i18n solution
- **Translation files**: JSON per language in `apps/mobile/locales/`
- **Detection**: Device locale → user preference → fallback to English

## File Structure
```
messages/                          # Desktop translations
├── en.json                        # English (base/fallback)
├── fr.json                        # French
├── de.json                        # German
├── es.json                        # Spanish
├── pt.json                        # Portuguese
├── ar.json                        # Arabic (RTL)
├── yo.json                        # Yoruba
├── ig.json                        # Igbo
├── ha.json                        # Hausa
└── ...

apps/mobile/locales/               # Mobile translations
├── en.json
├── fr.json
└── ...
```

## Translation Key Structure
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "close": "Close",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading..."
  },
  "nav": {
    "dashboard": "Dashboard",
    "schoolManagement": "School Management",
    "peoples": "Peoples",
    "academic": "Academic",
    "settings": "Settings"
  },
  "slideEditor": {
    "file": "File",
    "edit": "Edit",
    "view": "View",
    "insert": "Insert",
    "format": "Format",
    "slide": "Slide",
    "arrange": "Arrange",
    "tools": "Tools",
    "help": "Help",
    "untitledPresentation": "Untitled Presentation",
    "clickToAddTitle": "Click to add title",
    "clickToAddSubtitle": "Click to add subtitle",
    "newSlide": "New slide",
    "duplicateSlide": "Duplicate slide",
    "deleteSlide": "Delete slide"
  },
  "drive": {
    "myDrive": "My Drive",
    "sharedWithMe": "Shared with me",
    "recent": "Recent",
    "starred": "Starred",
    "bin": "Bin",
    "searchPlaceholder": "Search files and folders..."
  },
  "permissions": {
    "actionRestricted": "Action Restricted",
    "copyDisabled": "Copy is disabled by the document owner.",
    "printDisabled": "Printing is disabled by the document owner.",
    "downloadDisabled": "Downloading is disabled by the document owner.",
    "requestPermission": "Request Permission",
    "editPermissions": "Edit Permissions"
  }
}
```

## Implementation Phases

### Phase 1: Setup & Infrastructure (1-2 days)
- Install `next-intl` for desktop, `i18next` for mobile
- Configure middleware for locale detection
- Create base English translation file with ALL strings
- Create `useTranslation` hook wrapper for consistent API
- Add language switcher to Settings page and header

### Phase 2: Core Layout (2-3 days)
- Translate sidebar navigation (all menu items)
- Translate header (search, notifications, user menu)
- Translate common components (buttons, modals, dialogs)
- Translate error messages and loading states

### Phase 3: Feature Pages (3-5 days)
- Dashboard
- Students, Parents, Personnel pages
- Classes, Subjects, Exams
- Finance, Library, Transport
- Settings pages

### Phase 4: Editors (2-3 days)
- Slide Editor (menus, toolbar tooltips, dialogs)
- Document Editor
- All shared editor components

### Phase 5: Mobile App (2-3 days)
- Drive screen (section pills, search, file items, action sheet)
- All mobile modals and dialogs
- Bottom tab bar
- Page headers

### Phase 6: RTL Support (1-2 days)
- Arabic, Hebrew layout mirroring
- CSS `dir="rtl"` support
- Flex direction reversal
- Icon mirroring where needed

### Phase 7: Testing & QA (2-3 days)
- Visual testing of every page in each language
- RTL layout verification
- Text overflow checks (German/Russian text is longer)
- Mobile responsive checks with longer text
- BDD feature files for i18n scenarios

## Languages to Support (Priority Order)
1. **English** (default/fallback)
2. **French** (West Africa, international)
3. **Yoruba** (Nigeria)
4. **Igbo** (Nigeria)
5. **Hausa** (Nigeria/West Africa)
6. **Arabic** (RTL, North Africa/Middle East)
7. **Spanish** (international)
8. **Portuguese** (international)
9. **German** (international)
10. **Swahili** (East Africa)
11. **Chinese** (international)
12. **Hindi** (international)

## Estimated Total Effort
- **Desktop**: ~8-12 days
- **Mobile**: ~4-6 days
- **Translation**: ~2-3 days per language (can be parallelized)
- **Testing**: ~3-5 days

## How Language Selection Works
1. User opens Settings → Language
2. Selects preferred language
3. Saved to user profile (localStorage for demo, API for production)
4. All UI text switches immediately
5. Persists across sessions
6. Header shows current language flag/code

## Notes
- The "Slide Language" feature (already implemented) handles slide content translation separately from UI language
- RTL languages need careful CSS work — use logical properties (`margin-inline-start` instead of `margin-left`)
- Some text expands significantly in translation (German ~30% longer than English) — test all layouts
