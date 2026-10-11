# LNReader Sync - Final Production Build Instructions

## Quick Start (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/Joshjay274/LNReader-Sync.git
cd LNReader-Sync

# 2. Run setup
bash scripts/setup-dev.sh

# 3. Configure Firebase
bash scripts/firebase-setup.sh

# 4. Download google-services.json from Firebase
# Place in: android/app/google-services.json

# 5. Build and install
bash scripts/complete-build.sh

# 6. Install to device
bash scripts/install-apk.sh
```

## Detailed Setup

### Step 1: Prerequisites

Ensure you have:
- Node.js 16+ installed
- Java JDK 11+ installed
- Android SDK with API 30+
- Android device or emulator
- Git installed

```bash
# Verify installations
node --version    # Should be v16+
java -version     # Should be 11+
adb version       # Should show Android Debug Bridge
```

### Step 2: Environment Setup

Set up Android environment variables:

**macOS/Linux:**
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

**Windows (PowerShell as Admin):**
```powershell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$HOME\AppData\Local\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("Path", "$([Environment]::GetEnvironmentVariable('Path', 'User'));$([Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User'))\platform-tools", "User")
```

### Step 3: Clone and Setup

```bash
# Clone repository
git clone https://github.com/Joshjay274/LNReader-Sync.git
cd LNReader-Sync

# Install dependencies
npm install

# Make scripts executable
chmod +x scripts/*.sh
```

### Step 4: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "LNReader Sync"
3. Add Android app:
   - Package: `com.lnreadersync`
   - Download `google-services.json`
   - Place in `android/app/google-services.json`
4. Enable Authentication → Google Sign-In
5. Create Firestore Database (Production mode)

### Step 5: Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit and add your Firebase credentials
nano .env
```

Fill in all Firebase values from Firebase Console.

### Step 6: Build Debug APK

```bash
# Start Metro bundler
npm start

# In another terminal
npm run android
```

This builds and installs debug APK to connected device.

### Step 7: Build Release APK

```bash
# Automated build, sign, and install
bash scripts/complete-build.sh
```

Or manually:

```bash
# Build
cd android && ./gradlew assembleRelease && cd ..

# Create keystore (first time only)
keytool -genkey -v -keystore lnreader-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias lnreader

# Sign
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore lnreader-key.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk lnreader

# Align
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk app-release.apk

# Install
adb install -r app-release.apk
```

## Testing

```bash
# Test on device
./scripts/test.sh

# Run linting
npm run lint

# Type check
npm run typecheck

# Run unit tests
npm test
```

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
bash scripts/cleanup.sh
npm install
bash scripts/complete-build.sh
```

### Firebase Connection Issues

1. Verify `google-services.json` is in `android/app/`
2. Check Firebase Console settings
3. Verify API keys in `.env`
4. Check internet connection

### APK Installation Fails

```bash
# Uninstall first
adb uninstall com.lnreadersync

# Check device storage
adb shell df

# Try again
adb install -r app-release.apk
```

## Play Store Submission

1. Create [Google Play Developer Account](https://play.google.com/console)
2. Create app listing
3. Upload signed APK
4. Fill store listing details
5. Set content rating
6. Submit for review

Review typically takes 2-4 hours.

## APK File

After build completes:
- Release APK: `app-release.apk`
- Size: ~30-50MB
- Ready to install: `adb install -r app-release.apk`
- Ready to upload: Upload to Play Store Console

## Important

⚠️ **Never commit:**
- `.env` files with real credentials
- `lnreader-key.keystore` files
- `google-services.json` files

✅ **Always:**
- Test on real device
- Test offline functionality
- Test sync features
- Test all screens
- Verify all permissions
- Check app size
- Monitor crash reports

## Commands Summary

| Command | Purpose |
|---------|----------|
| `npm start` | Start Metro bundler |
| `npm run android` | Build and run debug |
| `npm run build:apk` | Build release APK |
| `npm run sign:apk` | Sign APK |
| `npm run install:apk` | Install to device |
| `npm run lint` | Check code style |
| `npm run format` | Format code |
| `npm test` | Run tests |
| `bash scripts/complete-build.sh` | Full build pipeline |
| `bash scripts/setup-dev.sh` | Initial setup |
| `bash scripts/firebase-setup.sh` | Firebase setup help |

## Next Steps

1. ✅ Complete setup above
2. ✅ Test app on device
3. ✅ Review RELEASE_CHECKLIST.md
4. ✅ Build release APK
5. ✅ Upload to Play Store
6. ✅ Monitor reviews and crashes
7. ✅ Plan next update

## Support

For issues:
- Check COMPLETE_BUILD_GUIDE.md
- Check DEVELOPMENT.md
- Review Firebase documentation
- Check React Native docs
- Open GitHub issue

## License

MIT - See LICENSE file for details
