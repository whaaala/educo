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
