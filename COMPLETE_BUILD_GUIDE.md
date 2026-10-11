# Complete Setup and Build Instructions for LNReader Sync APK

## Prerequisites

Before you start, ensure you have:

- **Node.js** 16+ ([download](https://nodejs.org/))
- **Java Development Kit (JDK)** 11+ ([download](https://www.oracle.com/java/technologies/downloads/))
- **Android SDK** ([download Android Studio](https://developer.android.com/studio))
- **Android SDK API Level 30+**
- **Git** ([download](https://git-scm.com/))

## Step 1: Set Up Environment Variables

### macOS / Linux

Add to `~/.bash_profile` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Windows

1. Open System Properties → Environment Variables
2. Create new variable:
   - Name: `ANDROID_HOME`
   - Value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
3. Add to `PATH`:
   - `C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools`
   - `C:\Users\YourUsername\AppData\Local\Android\Sdk\tools`

## Step 2: Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/Joshjay274/LNReader-Sync.git
cd LNReader-Sync

# Install dependencies
npm install

# Make scripts executable (macOS/Linux)
chmod +x scripts/*.sh
```

## Step 3: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings
4. Click "Add App" → Android
5. Enter package name: `com.lnreadersync`
6. Download `google-services.json`
7. Place in: `android/app/google-services.json`

## Step 4: Configure Google Sign-In

1. In Firebase Console, go to Authentication → Sign-in method
2. Enable Google
3. Go to [Google Cloud Console](https://console.cloud.google.com/)
4. Create OAuth 2.0 Client IDs:
   - Web application (for backend)
   - Android (for mobile app)
5. For Android, add your app's SHA-1 fingerprint:

```bash
# Get debug SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

6. Update `.env` file:

```bash
cp .env.example .env
```

Fill in your values:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
```

## Step 5: Build Debug APK

```bash
# Start Metro bundler
npm start

# In another terminal, build and install
npm run android
```

Or build manually:

```bash
cd android
./gradlew assembleDebug
cd ..

# Install to device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Step 6: Create Keystore for Release

```bash
# Create keystore (run only once)
keytool -genkey -v -keystore lnreader-key.keystore \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias lnreader
```

You'll be prompted for:
- Keystore password (remember this!)
- Key password (can be same as keystore)
- Your name, organization, etc.

⚠️ **IMPORTANT**: Keep this keystore file safe. You'll need it to publish updates to Play Store.

## Step 7: Build Release APK

### Automated (using scripts):

```bash
# Build APK
bash scripts/build-apk.sh

# Sign APK
bash scripts/sign-apk.sh

# Install APK
bash scripts/install-apk.sh
```

### Manual:

```bash
# Build release APK
cd android
./gradlew assembleRelease
cd ..

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore lnreader-key.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  lnreader

# Align APK
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk app-release.apk
```

## Step 8: Test on Device/Emulator

```bash
# Check connected devices
adb devices

# Install and test
adb install -r app-release.apk

# Launch app
adb shell am start -n com.lnreadersync/com.lnreadersync.MainActivity

# View logs
adb logcat
```

## Step 9: Prepare for Play Store

1. Create [Google Play Developer Account](https://play.google.com/console) ($25 one-time fee)
2. Create new app listing
3. Fill in app details:
   - App name: "LNReader Sync"
   - Short description: "Read light novels anywhere, anytime with cloud sync"
   - Full description: Complete feature list
   - Privacy policy: Create and link
   - Screenshots: 2-8 for phone, 2-8 for tablet
   - Icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
4. Upload signed APK
5. Set content rating
6. Configure pricing (free/paid)
7. Submit for review

## APK File Locations

- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release Unsigned**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`
- **Release Signed**: `app-release.apk`

## Troubleshooting

### Build Fails

```bash
# Clear cache
cd android && ./gradlew clean && cd ..
npm install
npm start
```

### Firebase Not Initializing

- Ensure `google-services.json` is in `android/app/`
- Check Firebase Console for correct package name
- Verify API keys match `.env` file

### APK Won't Install

```bash
# Uninstall previous version
adb uninstall com.lnreadersync

# Try install again
adb install -r path/to/app.apk
```

### Gradle Issues

```bash
# Use specific Gradle version
cd android
./gradlew wrapper --gradle-version 8.0.2
cd ..
```

## Important Notes

- **Security**: Never commit `lnreader-key.keystore` or `.env` to version control
- **Versioning**: Update `versionCode` and `versionName` in `android/app/build.gradle` for each release
- **Testing**: Always test on real device before Play Store submission
- **Size**: Keep APK size under 100MB for best Play Store performance
- **Permissions**: Only request necessary permissions in `AndroidManifest.xml`

## Build Variants

You can create different build flavors:

```gradle
productFlavors {
    free {
        applicationIdSuffix ".free"
    }
    paid {
        applicationIdSuffix ".paid"
    }
}
```

Build specific variant:

```bash
cd android
./gradlew assembleFreeRelease
./gradlew assemblePaidRelease
cd ..
```

## Performance Optimization

1. **Enable ProGuard/R8**:
   ```gradle
   minifyEnabled true
   shrinkResources true
   ```

2. **Reduce APK Size**:
   - Use bundle format for Play Store
   - Remove unused resources
   - Optimize images

3. **Monitor Performance**:
   - Use Android Studio Profiler
   - Check battery usage
   - Test on low-end devices

## Next Steps After Building

1. ✅ Test thoroughly on multiple devices
2. ✅ Get user feedback
3. ✅ Implement real light novel sources
4. ✅ Add more features (EPUB support, offline download)
5. ✅ Publish to Play Store
6. ✅ Monitor crash reports and user reviews
7. ✅ Plan updates and new features

## Support

For issues:
- Check [React Native Docs](https://reactnative.dev/)
- Check [Firebase Docs](https://firebase.google.com/docs)
- Check [Android Docs](https://developer.android.com/docs)
- Open GitHub issue

## License

MIT - See LICENSE file
