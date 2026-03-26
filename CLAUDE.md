# Educo Project - Claude Code Instructions

## Loading the App on Android Emulators

When the user asks to load/start/run the app on the simulators/emulators, follow these steps:

### 1. Kill any existing Metro/Expo processes
```bash
taskkill //F //IM node.exe
```

### 2. Check connected emulators
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb devices
```
Expected devices: `emulator-5554` (Pixel Tablet API 35) and `emulator-5556` (Pixel API 36.0)

### 3. Start Expo dev server
```bash
cd /c/Users/eyite/educo/apps/mobile && npx expo start --clear
```
Run this in background and wait for it to start on port 8081.

### 4. Set up ADB port forwarding for both emulators
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 reverse tcp:8081 tcp:8081
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 reverse tcp:8081 tcp:8081
```

### 5. Launch the app on both emulators
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
```

### Troubleshooting

#### "Incompatible SDK version" Error
The project uses **Expo SDK 54**. If you see this error, install the correct Expo Go version:

1. Download SDK 54 compatible Expo Go (version **54.0.6**):
```bash
curl -L -o /c/Users/eyite/Downloads/expo-go-54.apk "https://github.com/expo/expo-go-releases/releases/download/Expo-Go-54.0.6/Expo-Go-54.0.6.apk"
```

2. Uninstall old Expo Go:
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 uninstall host.exp.exponent
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 uninstall host.exp.exponent
```

3. Install correct version:
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 install /c/Users/eyite/Downloads/expo-go-54.apk
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 install /c/Users/eyite/Downloads/expo-go-54.apk
```

#### Port 8081 already in use
Find and kill the process:
```bash
netstat -ano | findstr :8081
taskkill //F //PID <PID_NUMBER>
```

#### Expo Go not installed
The APK file should already be at `C:/Users/eyite/Downloads/expo-go-54.apk`. If not, download it using the curl command above.

## Project Structure

- **Mobile App**: `apps/mobile/` - React Native Expo app (SDK 54)
- **Emulators**:
  - Pixel Tablet API 35 (emulator-5554) - Tablet view
  - Pixel API 36.0 (emulator-5556) - Mobile view

## ADB Path
```
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb
```

## Mobile/Tablet Testing (MANDATORY)

**Every time a mobile or tablet feature is implemented or a bug is fixed in `apps/mobile/`**, you MUST:

1. **Start both Android emulators** (if not already running):
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel_Tablet -no-snapshot-load &
C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel -no-snapshot-load &
```

2. **Wait for both devices to come online**:
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb devices
```
Expected: `emulator-5554 device` (Pixel Tablet) and `emulator-5556 device` (Pixel phone)

3. **Start Expo dev server** (if not running):
```bash
cd /c/Users/eyite/educo/apps/mobile && npx expo start --clear
```

4. **Set up ADB port forwarding and launch on both**:
```bash
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 reverse tcp:8081 tcp:8081
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 reverse tcp:8081 tcp:8081
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
```

5. **ALWAYS double-check the app is actually loaded** — verify Metro bundler output shows "Android Bundled" for both devices. If Expo Go shows its home screen instead of the app, re-run the launch commands. Never assume the app loaded just because the intent was sent.

6. **ALWAYS verify after ANY code change** — After every edit, reload the app on BOTH emulators and confirm:
   - No red error screens (syntax errors, runtime crashes)
   - The UI renders correctly on both mobile and tablet
   - All functionalities work as expected
   - Never tell the user "all is fine" until you have verified the app loads and works on both devices

7. **Inform the user** so they can test on both devices themselves.

### Mobile BDD & Testing (MANDATORY)
**Every mobile/tablet feature or bug fix MUST include corresponding tests.** This follows the same BDD standard as the web app:

1. **Before coding**: Check if tests exist for the area being modified
2. **Feature files**: Create/update `.feature` files in `tests/features/mobile/` for mobile features
3. **Unit tests**: Create unit tests in `apps/mobile/__tests__/` using Jest + @testing-library/react-native
4. **After coding**: Run `cd apps/mobile && npx jest` and confirm all tests pass
5. **After tests pass**: Verify the feature works on BOTH emulators (mobile + tablet)

This is non-negotiable — no mobile code ships without tests and emulator verification.

### Mobile/Tablet Test Requirements (MANDATORY — ALL DEVICES)

**Every change to `apps/mobile/` MUST include tests covering BOTH mobile AND tablet behaviors.** This is non-negotiable.

#### Test Types Required:
1. **Unit Tests** (`apps/mobile/__tests__/`):
   - Test all helper functions, data mutations, and business logic
   - Test component rendering for BOTH `isTablet=true` and `isTablet=false`
   - Run with: `cd apps/mobile && npx jest`

2. **Component/UI Tests** (`apps/mobile/__tests__/`):
   - Test component renders correctly on mobile layout
   - Test component renders correctly on tablet layout
   - Test user interactions (tap, long-press, text input)
   - Test conditional rendering (e.g., sidebar on tablet, pills on mobile)
   - Test action callbacks fire correctly

3. **BDD Feature Files** (`tests/features/mobile/`):
   - Create separate `.feature` files for mobile-specific and tablet-specific behaviors
   - Include `@responsive` tagged scenarios for layout differences
   - Include E2E scenarios covering full user flows on both devices

4. **End-to-End Tests** (`tests/features/mobile/` with `@e2e` tag):
   - Cover full user workflows (create → edit → delete lifecycle)
   - Test navigation flows on both mobile and tablet
   - Test action sheet behavior (bottom sheet on mobile, centered dialog on tablet)
   - Test file preview for all file types

#### When to Run Tests:
- **After ANY code change** in `apps/mobile/`: Run `cd apps/mobile && npx jest`
- **After ANY new feature**: Write new tests BEFORE or ALONGSIDE the feature code
- **After ANY bug fix**: Add a test that reproduces the bug, then verify the fix
- **Before committing**: All tests must pass — never commit with failing tests

#### Mobile Test Structure:
```
apps/mobile/__tests__/
├── drive/
│   ├── driveMockData.test.ts      # Data helpers & mutations
│   ├── DriveSidebar.test.tsx       # Tablet sidebar component
│   ├── DriveBreadcrumbs.test.tsx   # Breadcrumb navigation
│   ├── DriveHeader.test.tsx        # Search & view toggle
│   ├── DriveEmptyState.test.tsx    # Empty state messages
│   └── DriveActionSheet.test.tsx   # File action sheet
└── [future feature tests]/

tests/features/mobile/
├── drive/
│   ├── DriveScreen.feature         # Mobile drive layout & navigation
│   ├── DriveActions.feature        # File CRUD actions
│   ├── DriveFilePreview.feature    # File preview screens
│   ├── DriveTablet.feature         # Tablet-specific layout & behavior
│   └── DriveE2E.feature            # End-to-end flows
└── [future feature files]/
```

### Available Emulators
- **Pixel Tablet** (`Pixel_Tablet` / `emulator-5554`) — Tablet view testing
- **Pixel** (`Pixel` / `emulator-5556`) — Mobile view testing

### Emulator Executable Path
```
C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator
```

## Component-Based Architecture (MANDATORY)

**All development MUST follow a component-based approach.** Every UI element should be thought of as a reusable component that receives data via props based on context. This applies to ALL platforms — desktop, mobile, tablet, and all screen sizes.

### Before Creating Any Component:
1. **Check if a reusable component already exists** — search `components/` directories first
2. **If it exists**: Use it. Pass different data/props based on context. Do NOT duplicate.
3. **If it doesn't exist**: Create it as a reusable component from the start.

### Component Design Rules:
1. **Every UI element is a component** — headers, search bars, cards, lists, buttons, modals, FABs, pills, breadcrumbs, empty states, etc.
2. **Components receive data via props** — never hardcode data inside components. All data flows from parent to child based on context.
3. **Components are reusable across contexts** — a file card component works in grid view, list view, search results, and starred items. A search bar works on mobile and tablet.
4. **Platform-aware via props** — use `isTablet`, `layout`, or similar props to adapt rendering. Do NOT create separate mobile/tablet versions of the same component.
5. **Wrap with `memo()`** — all components that receive stable props should be memoized to prevent unnecessary re-renders.
6. **Separate fixed from scrollable** — header/navigation components are fixed; only content areas scroll. Never nest scroll containers.

### Component Structure Pattern:
```
components/
├── ui/                    # Shared UI primitives (Button, Modal, PageHeader)
├── drive/                 # Drive feature components
│   ├── DriveSearchBar     # Search input + view toggle (reusable)
│   ├── DriveSectionPills  # Mobile section navigation (reusable)
│   ├── DriveContent       # Scrollable file list/grid (reusable)
│   ├── DriveFileItem      # Single file/folder card (reusable for list + grid)
│   ├── DriveSidebar       # Tablet sidebar (reusable)
│   ├── DriveBreadcrumbs   # Navigation breadcrumbs (reusable)
│   ├── DriveFAB           # Floating action button (reusable)
│   ├── DriveEmptyState    # Empty state message (reusable)
│   └── DriveScreen        # Screen compositor — composes the above
└── [feature]/             # Other features follow the same pattern
```

### When Implementing a New Feature:
1. **Think in components first** — break the design into distinct, reusable pieces
2. **Check existing components** — can any be reused or extended?
3. **Create component files** — one component per file, with clear props interface
4. **Compose in the screen** — the screen component only composes child components and manages state
5. **Test each component** — every component gets its own tests

---

## BDD Development Approach (MANDATORY)

**All development MUST follow Behavior-Driven Development (BDD) principles.** This applies to both implementation and testing.

### BDD for Development:
When implementing new features or modifying existing code:
1. **Think in behaviors first**: Define what the user/system should experience before writing code
2. **Write tests before or alongside code**: Tests describe the expected behavior using Given/When/Then
3. **Use descriptive naming**: Functions, components, and variables should reflect user-facing behavior
4. **Validate against acceptance criteria**: Each feature should map to testable behavioral scenarios

### BDD for Code Comments:
When adding inline comments to implementation code, prefer behavior-oriented language:
- Describe *what* and *why* (user behavior), not just *how* (technical detail)
- Example: `// Allow user to drag color without closing the picker` instead of `// Set flag to true`

---

## Testing Requirements (MANDATORY)

**Every code change MUST include corresponding test updates.** This is non-negotiable.

### Workflow for every implementation:
1. **Before coding**: Check if tests exist for the area being modified
   - Unit tests: `tests/components/` and `tests/unit/`
   - Visual tests: `*.visual.test.tsx` files
   - E2E tests: `tests/e2e/`
2. **If tests exist**: Update them to reflect the changes made
3. **If no tests exist**: Add full test coverage in the appropriate test suite
4. **After coding**: Run `npx vitest run` and confirm all tests pass

### What tests MUST cover:
- **Functionality**: Core logic, state changes, user interactions, event handlers
- **UI & Look and Feel**: CSS classes, styling, theme variants (dark/midnight/purple), visual structure
- **Responsiveness**: Layout behavior across screen sizes (mobile, tablet, desktop), breakpoint classes, flex/grid behavior, max-width/min-width constraints
- **Accessibility**: ARIA attributes, keyboard navigation, focus management
- **Edge cases**: Empty states, error states, boundary conditions

### Visual Verification (MANDATORY)
**All functional implementations MUST be visually checked and tested to confirm they work for end users.** This applies to every feature, component, or behavior change — not just UI-specific work. After implementing any functionality:
1. Run the dev server and manually verify the feature works visually in the browser
2. Check all visual states: default, hover, active, disabled, loading, error, empty
3. Verify across themes (light, dark, midnight, purple) when applicable
4. Verify responsive behavior on mobile/tablet/desktop viewports
5. Add visual regression tests (`*.visual.test.tsx`) for any new UI components or significant UI changes

### Gherkin `.feature` Files (MANDATORY — Single Source of Truth)

Every feature, component, or test area MUST have a corresponding `.feature` file in `tests/features/`. When modifying existing code, update the relevant `.feature` file alongside tests.

**Feature file structure:**
```
tests/features/
├── e2e/                    # E2E feature specs
├── components/             # Component feature specs
│   ├── shared/             # Shared component features
│   │   ├── DocEditor/
│   │   ├── Whiteboard/
│   │   ├── chat/
│   │   └── messages/
│   └── communication/      # Communication features
└── unit/                   # Unit test features
```

**Rules:**
- One `.feature` file per component/module (merge functional + visual tests into one file)
- Use standard Gherkin: `Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, `Scenario Outline`, `Examples`
- Tag visual/CSS scenarios with `@visual`, responsive with `@responsive`
- Feature file scenarios must match the test file scenarios 1:1
- When adding new tests, add the corresponding scenario to the `.feature` file first

### Test file locations:
- **Feature files**: `tests/features/` (Gherkin `.feature` specs)
- **DocEditor unit tests**: `tests/components/shared/DocEditor/DocEditor.comprehensive.test.tsx`
- **DocEditor visual tests**: `tests/components/shared/DocEditor/DocEditor.visual.test.tsx`
- **DocEditor e2e tests**: `tests/e2e/doc-editor.spec.ts` and `tests/e2e/doc-editor-comprehensive.spec.ts`
- **Shared components**: `tests/components/shared/`
- **Unit tests**: `tests/unit/`
