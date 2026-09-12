#!/bin/bash

# Educo Mobile App - Start Emulators Script
# This script starts both mobile and tablet emulators, installs the app, and launches it

ANDROID_SDK="C:/Users/eyite/AppData/Local/Android/Sdk"
ADB="$ANDROID_SDK/platform-tools/adb"
EMULATOR="$ANDROID_SDK/emulator/emulator"
APP_DIR="c:/Users/eyite/educo/apps/mobile"
APK_PATH="$APP_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

echo "🚀 Starting Educo Mobile Development Environment..."

# Start emulators if not already running
echo "📱 Checking emulators..."
DEVICES=$($ADB devices | grep "emulator" | wc -l)

if [ "$DEVICES" -lt 2 ]; then
    echo "Starting emulators..."
    $EMULATOR -avd Pixel &
    $EMULATOR -avd Pixel_Tablet &
    echo "⏳ Waiting for emulators to boot (60 seconds)..."
    sleep 60
fi

# Wait for devices to be ready
$ADB wait-for-device

# Set up reverse ports for Metro
echo "🔌 Setting up port forwarding..."
$ADB -s emulator-5554 reverse tcp:8081 tcp:8081 2>/dev/null
$ADB -s emulator-5556 reverse tcp:8081 tcp:8081 2>/dev/null

# Check if APK exists
if [ -f "$APK_PATH" ]; then
    echo "📦 Installing app on emulators..."
    $ADB -s emulator-5554 install -r "$APK_PATH" 2>/dev/null &
    $ADB -s emulator-5556 install -r "$APK_PATH" 2>/dev/null &
    wait
    echo "✅ App installed!"
else
    echo "⚠️  APK not found. Run 'npx expo run:android' first to build."
fi

# Start Metro bundler
echo "🎯 Starting Metro bundler..."
cd "$APP_DIR"
npx expo start --dev-client &

sleep 10

# Launch the app on both emulators
echo "🚀 Launching app..."
$ADB -s emulator-5554 shell am start -n com.anonymous.educomobile/.MainActivity 2>/dev/null
$ADB -s emulator-5556 shell am start -n com.anonymous.educomobile/.MainActivity 2>/dev/null

echo ""
echo "✅ Done! Both emulators should now be running the Educo app."
echo "📝 Metro bundler is running at http://localhost:8081"
