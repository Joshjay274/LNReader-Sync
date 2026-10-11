# Android Build Guide for LNReader Sync

## Prerequisites

- Node.js 16+ and npm
- Java Development Kit (JDK) 11+
- Android SDK (API 30+)
- Android Studio (optional but recommended)
- Gradle

## Step 1: Setup Android Development Environment

```bash
# Install Java
java -version

# Install Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Step 2: Configure Firebase for Android

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Add Android app to your project
4. Download `google-services.json`
5. Place it in `android/app/google-services.json`

## Step 3: Update Android Configuration Files

### android/build.gradle

```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

### android/app/build.gradle

```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.firebase:firebase-analytics'
  implementation 'com.google.firebase:firebase-auth'
  implementation 'com.google.firebase:firebase-firestore'
  implementation 'com.google.android.gms:play-services-auth:20.4.0'
}
```

## Step 4: Environment Variables

Create `.env` file in root:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
```

## Step 5: Build APK

### Debug APK

```bash
# Clean previous builds
cd android
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK

```bash
# Create keystore (run once)
keytool -genkey -v -keystore lnreader-key.keystore -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

## Step 6: Sign Release APK

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore lnreader-key.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  alias_name

# Align APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## Step 7: Install and Test

```bash
# Install debug APK to device/emulator
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Run tests
npm test

# Start app on connected device
npm run android
```

## Step 8: Upload to Play Store

1. Create Google Play Developer account ($25 one-time fee)
2. Create new app listing
3. Upload signed APK
4. Configure store listing (screenshots, description, etc.)
5. Submit for review

## Troubleshooting

### Build Fails

```bash
# Clear Gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm run android
```

### Firebase Not Initializing

- Verify `google-services.json` is in `android/app/`
- Check Firebase Console for correct app registration
- Verify API keys in `.env`

### APK Installation Fails

```bash
# Uninstall previous version
adb uninstall com.lnreadersync

# Install again
adb install -r path/to/app-debug.apk
```

## Release Checklist

- [ ] Firebase configured and tested
- [ ] Google Sign-In working
- [ ] Reading progress sync tested
- [ ] Bookmarks and notes sync tested
- [ ] Offline functionality working
- [ ] App icons and splash screen set
- [ ] App name and description updated
- [ ] Version bumped
- [ ] Release APK built and signed
- [ ] Privacy policy and terms created
- [ ] Screenshots taken for Play Store
- [ ] App submitted for review

## Next Steps

After successful build:

1. Test on multiple devices
2. Get user feedback
3. Implement real light novel sources
4. Add more features (EPUB support, offline download, etc.)
5. Publish to Play Store
