# Quick Start Commands

## Development

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android (requires device/emulator connected)
npm run android

# Run specific variant
npm run android:dev
```

## Building APK

```bash
# Quick build and install
npm run build:apk

# Sign the APK
npm run sign:apk

# Install to device
npm run install:apk
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck

# Run tests
npm test
```

## Android Studio Commands

```bash
# Open Android project in Android Studio
open -a "Android Studio" android/

# Build APK via Android Studio
Build > Build Bundles > Build APK

# Run on emulator
Run > Run 'app'
```

## Emulator

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd emulator_name

# Kill all emulators
adb emu kill all
```

## Device Management

```bash
# List connected devices
adb devices

# Clear app data
adb shell pm clear com.lnreadersync

# View logs
adb logcat

# Filter logs
adb logcat *:S ReactNative:V

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

## Debugging

```bash
# Chrome DevTools
# Shake device and select "Debug"
# Or use Flipper (https://fbflipper.com/)

# View native Android logs
adb logcat

# Forward port for debugging
adb forward tcp:8081 tcp:8081
```
