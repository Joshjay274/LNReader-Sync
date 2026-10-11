# APK Build Troubleshooting Guide

## Common Issues & Solutions

### 1. "ANDROID_HOME not set"

**Problem:** Build fails immediately with ANDROID_HOME error

**Solution:**

**macOS/Linux:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell
source ~/.zshrc
```

**Windows (PowerShell):**
```powershell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$HOME\AppData\Local\Android\Sdk", "User")
```

### 2. "No connected devices"

**Problem:** Script says no devices found

**Solution:**
1. Enable USB Debugging on your Android device:
   - Settings > About Phone > Tap Build Number 7 times
   - Back to Settings > Developer Options > USB Debugging ON
2. Connect via USB cable
3. Grant USB debugging permission popup on phone
4. Verify: `adb devices`

If still not working:
```bash
# Restart ADB
adb kill-server
adb start-server
adb devices
```

### 3. "google-services.json not found"

**Problem:** Build fails at Firebase configuration step

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create new one)
3. Click "Add App" > Android
4. Enter package name: `com.lnreadersync`
5. Download `google-services.json`
6. Place in: `android/app/google-services.json`

### 4. "gradlew: command not found"

**Problem:** Gradle wrapper script not found

**Solution:**
```bash
# The gradlew file should be in android/
# If missing, you have a corrupted repo

# Try:
git status  # Check what's wrong
git pull    # Update repo

# If still missing:
cd android
chmod +x gradlew
cd ..
```

### 5. "BUILD FAILED" during APK build

**Problem:** Gradle build compilation fails

**Possible solutions:**

```bash
# 1. Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
cd ..

# 2. Update Gradle
cd android
./gradlew wrapper --gradle-version 8.0.2
cd ..

# 3. Clear cache
rm -rf ~/.gradle/caches

# 4. Check for Java issues
java -version  # Should be 11+
which java
```

### 6. "Keystore password incorrect"

**Problem:** Can't sign APK because keystore password is wrong

**Solution:**
If you have the keystore file but forgot password, you need to create a new one:

```bash
# Backup old keystore (if keeping it)
mv lnreader-key.keystore lnreader-key.keystore.old

# Create new keystore
keytool -genkey -v -keystore lnreader-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias lnreader

# Then rebuild
bash scripts/local-build.sh
```

⚠️ WARNING: Creating new keystore means:
- Can't update existing Play Store app
- Need to create new Play Store listing
- Old app version won't be recognized as update

### 7. "Not enough storage on device"

**Problem:** Installation fails, not enough space

**Solution:**
```bash
# Check device storage
adb shell df

# Clear app cache
adb shell pm clear com.lnreadersync

# Clear Play Store cache
adb shell pm clear com.android.vending

# Delete unnecessary apps on device
# Or clear Downloads folder
```

### 8. "App crashes on launch"

**Problem:** APK installs but app crashes immediately

**Debug:**
```bash
# View crash logs
adb logcat | grep com.lnreadersync

# Or use logcat from Android Studio:
# Android Studio > View > Tool Windows > Logcat

# Look for:
# - Firebase initialization errors
# - Missing permissions
# - Google Play Services errors
# - Native code crashes
```

**Common causes:**
- Missing `google-services.json`
- Invalid Firebase configuration
- Google Play Services not installed
- Missing permissions in AndroidManifest.xml

### 9. "npm install fails"

**Problem:** Dependency installation errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If still failing, check Node.js version
node --version  # Should be 16+
npm --version   # Should be 8+

# Update npm
npm install -g npm@latest
```

### 10. "Sync or Firebase not working"

**Problem:** App installs but Firebase sync fails

**Debug:**
```bash
# Check logs for Firebase errors
adb logcat | grep -i firebase

# Verify credentials in .env file
echo $FIREBASE_API_KEY
echo $FIREBASE_PROJECT_ID

# Check Firebase Console:
# 1. Authentication enabled?
# 2. Google Sign-In provider enabled?
# 3. Firestore Database created?
# 4. Security rules deployed?
```

### 11. "Zipalign command not found"

**Problem:** APK optimization fails

**Solution:**
```bash
# zipalign is part of Android SDK
# Usually at: $ANDROID_HOME/build-tools/VERSION/zipalign

# Add to PATH
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0/

# Or find it
find $ANDROID_HOME -name zipalign
```

### 12. "JarsignER not found"

**Problem:** APK signing fails

**Solution:**
```bash
# jarsigner is part of Java JDK
# Should be in: $JAVA_HOME/bin/

# Verify Java installation
which jarsigner

# Or update PATH
export PATH=$PATH:$(dirname $(which java))/../bin
```

## Performance Issues

### Build takes too long

```bash
# Enable parallel builds
export org.gradle.parallel=true
export org.gradle.workers.max=8

# Or add to android/gradle.properties
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.workers.max=8" >> android/gradle.properties
```

### APK too large

```bash
# Enable ProGuard/R8 minification (already enabled)
# Already set in build.gradle:
# minifyEnabled true
# shrinkResources true

# Check APK contents
unzip -l app-release.apk | head -30
```

## Getting Help

If you're stuck:

1. **Check the error message** - usually tells you exactly what's wrong
2. **Search the error online** - most issues are well documented
3. **Check documentation:**
   - `COMPLETE_BUILD_GUIDE.md`
   - `DEVELOPMENT.md`
   - `FINAL_SETUP.md`
4. **Review logs:**
   ```bash
   adb logcat > build.log
   # Then search build.log for errors
   ```
5. **File GitHub issue** - include error message and device info

## Quick Reference

| Issue | Command |
|-------|----------|
| No device | `adb devices -l` |
| View logs | `adb logcat \| grep com.lnreadersync` |
| Clear app | `adb shell pm clear com.lnreadersync` |
| Uninstall | `adb uninstall com.lnreadersync` |
| Clean build | `cd android && ./gradlew clean && cd ..` |
| Check Java | `java -version` |
| Check Android SDK | `ls $ANDROID_HOME` |
| Restart ADB | `adb kill-server && adb start-server` |

## Before Opening an Issue

Include:
- Device model and Android version
- Error message (full output)
- Steps to reproduce
- What you've already tried
- OS and tool versions (java, node, npm)

## Still Stuck?

- Check Android Studio Logcat
- Use Android Device Monitor
- Enable debugging in Settings > System > About Phone
- Check Firebase Console for errors
- Verify all permissions in AndroidManifest.xml
