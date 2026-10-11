# LNReader Sync - Quick Setup & Build Guide

## 🚀 Quick Start (Copy & Paste)

### 1. Initial Setup (First Time Only)

```bash
# Clone repository
git clone https://github.com/Joshjay274/LNReader-Sync.git
cd LNReader-Sync

# Make scripts executable
chmod +x scripts/*.sh

# Install dependencies
npm install
```

### 2. Firebase Setup

```bash
# Run Firebase setup helper
bash scripts/firebase-setup.sh
```

Then:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Add Android app (package: `com.lnreadersync`)
4. Download `google-services.json`
5. Place in: `android/app/google-services.json`
6. Enable Google Sign-In in Authentication

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your Firebase credentials
nano .env
```

### 4. Connect Device

```bash
# Enable USB debugging on your Android device
# Then connect via USB

# Verify connection
adb devices
```

### 5. Build & Install

```bash
# Full automated build, sign, and install
bash scripts/local-build.sh
```

That's it! The app should now be running on your device.

## 📱 What Happens

The `local-build.sh` script will:
1. ✅ Check all prerequisites (Node, Java, Android SDK)
2. ✅ Verify Firebase configuration
3. ✅ Detect connected devices
4. ✅ Install npm dependencies
5. ✅ Clean previous builds
6. ✅ Build release APK
7. ✅ Create keystore (if needed)
8. ✅ Sign APK
9. ✅ Install to device
10. ✅ Launch app
11. ✅ Show logs

## 🔧 Useful Commands

```bash
# View app logs
adb logcat | grep com.lnreadersync

# Clear app data
adb shell pm clear com.lnreadersync

# Uninstall app
adb uninstall com.lnreadersync

# Install APK manually
bash scripts/quick-install.sh app-release.apk

# Start dev server only
npm start

# Run on device (debug)
npm run android
```

## ✅ After Build

The app is now on your device! Here's what to do:

1. **Test thoroughly**
   - Create account with Google
   - Add books to library
   - Test reading progress sync
   - Test bookmarks and notes
   - Test offline mode
   - Test settings changes

2. **Ready to publish?**
   - Review RELEASE_CHECKLIST.md
   - Build final release
   - Upload to Play Store
   - Monitor reviews and crashes

3. **Keep for future releases**
   - Never delete `lnreader-key.keystore`
   - This file is needed for all future updates

## 🐛 Troubleshooting

### Device Not Detected

```bash
# Check if ADB sees device
adb devices

# If no devices shown:
# 1. Enable USB debugging on phone: Settings > Developer Options > USB Debugging
# 2. Unplug and replug USB cable
# 3. Grant USB debugging permission on phone
# 4. Try: adb kill-server && adb start-server
```

### Build Fails

```bash
# Clean and retry
bash scripts/cleanup.sh
npm install
bash scripts/local-build.sh
```

### Firebase Configuration Missing

```bash
# You need google-services.json in android/app/
# Download from Firebase Console:
# 1. Go to Firebase Console
# 2. Select your project
# 3. Add Android app if not exists
# 4. Download google-services.json
# 5. Place in android/app/
```

### APK Install Fails

```bash
# Make sure you have enough storage
adb shell df

# Uninstall previous version
adb uninstall com.lnreadersync

# Try install again
adb install -r app-release.apk
```

## 📊 Build Time

Typical build times:
- First build: 5-10 minutes
- Subsequent builds: 2-5 minutes
- Incremental (debug): 30-60 seconds

## 💾 File Sizes

- APK size: ~30-50 MB
- Dependencies: ~500 MB (node_modules)
- Keystore: ~2 KB (keep this safe!)

## 🔐 Important Files

Never commit to git:
- `lnreader-key.keystore` - Release signing key
- `.env` - Environment variables
- `android/app/google-services.json` - Firebase config
- `node_modules/` - Dependencies

## 📚 More Information

- Build guide: `COMPLETE_BUILD_GUIDE.md`
- Development: `DEVELOPMENT.md`
- Release: `RELEASE_CHECKLIST.md`
- Setup details: `FINAL_SETUP.md`

## ✨ Next Steps

1. ✅ Test app on your device
2. ✅ Review features
3. ✅ Check RELEASE_CHECKLIST.md
4. ✅ Prepare for Play Store (if ready)
5. ✅ Plan features for v1.1

## 🆘 Need Help?

1. Check guides in repo
2. Review error messages
3. Check Android Studio Logcat
4. Search Stack Overflow
5. Open GitHub issue

## 🎉 Success!

If you've run `bash scripts/local-build.sh` successfully, congratulations! 🎉

Your LNReader Sync app is now running on your device. The APK file (`app-release.apk`) is ready for:
- Installation on other devices
- Upload to Google Play Store
- Distribution to beta testers

Enjoy! 🚀
