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
