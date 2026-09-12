# Android Emulator Setup & Troubleshooting

## Paths
- ADB: `C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb`
- Emulator: `C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator`
- Expo Go APK: `C:/Users/eyite/Downloads/expo-go-54.apk`

## Emulators
- **Pixel Tablet** (`Pixel_Tablet` / `emulator-5554`) — Tablet view
- **Pixel** (`Pixel` / `emulator-5556`) — Mobile view

## Start Emulators
```bash
taskkill //F //IM node.exe
C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel_Tablet -no-snapshot-load &
C:/Users/eyite/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel -no-snapshot-load &
```

## Start Expo & Launch App
```bash
cd /c/Users/eyite/educo/apps/mobile && npx expo start --clear
# Then port forward + launch:
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 reverse tcp:8081 tcp:8081
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 reverse tcp:8081 tcp:8081
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb -s emulator-5556 shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
```

## Troubleshooting
- **Incompatible SDK**: Project uses Expo SDK 54. Install Expo Go 54.0.6 from `https://github.com/expo/expo-go-releases/releases/download/Expo-Go-54.0.6/Expo-Go-54.0.6.apk`
- **Port 8081 in use**: `netstat -ano | findstr :8081` then `taskkill //F //PID <PID>`
- **App not loading**: Re-run port forwarding + launch commands. Verify Metro shows "Android Bundled".
