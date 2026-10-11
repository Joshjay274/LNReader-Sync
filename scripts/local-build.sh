#!/bin/bash

# LNReader Sync - Local APK Build Script
# Complete end-to-end APK build process
# Run this script to build, sign, and prepare APK for installation

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Print colored header
print_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║     LNReader Sync - Local APK Build & Installation Tool       ║"
    echo "║                                                                ║"
    echo "║  This script will build a production-ready APK for your app   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print section header
print_section() {
    echo -e ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Print step
print_step() {
    echo -e "${YELLOW}[$1]${NC} $2"
}

# Print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_header

# ============================================================================
# STEP 1: ENVIRONMENT CHECKS
# ============================================================================

print_section "STEP 1: ENVIRONMENT CHECKS"

print_step "1/6" "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found"
    print_warning "Install from: https://nodejs.org/"
    exit 1
fi

print_step "2/6" "Checking Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -1)
    print_success "Java found: $JAVA_VERSION"
else
    print_error "Java not found"
    print_warning "Install JDK 11+ from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

print_step "3/6" "Checking Android SDK..."
if [ -z "$ANDROID_HOME" ]; then
    print_error "ANDROID_HOME not set"
    print_warning "Set ANDROID_HOME environment variable to your Android SDK path"
    exit 1
fi
print_success "ANDROID_HOME: $ANDROID_HOME"

print_step "4/6" "Checking Android tools..."
if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
    print_error "Android platform-tools not found"
    exit 1
fi
print_success "Android platform-tools found"

print_step "5/6" "Checking adb..."
if command -v adb &> /dev/null; then
    ADB_VERSION=$(adb version 2>&1 | head -1)
    print_success "adb found: $ADB_VERSION"
else
    print_error "adb not found"
    exit 1
fi

print_step "6/6" "Checking Git..."
if command -v git &> /dev/null; then
    print_success "Git found"
else
    print_warning "Git not found (optional)"
fi

# ============================================================================
# STEP 2: PROJECT CONFIGURATION CHECKS
# ============================================================================

print_section "STEP 2: PROJECT CONFIGURATION CHECKS"

print_step "1/3" "Checking Firebase configuration..."
if [ ! -f "android/app/google-services.json" ]; then
    print_error "google-services.json not found"
    print_warning "Download from Firebase Console: https://console.firebase.google.com/"
    print_warning "Save to: android/app/google-services.json"
    exit 1
fi
print_success "google-services.json found"

print_step "2/3" "Checking environment file..."
if [ ! -f ".env" ]; then
    print_warning ".env not found, creating from template..."
    if [ ! -f ".env.example" ]; then
        print_error ".env.example not found"
        exit 1
    fi
    cp .env.example .env
    print_warning "Please edit .env and add your Firebase credentials"
    print_warning "Then run this script again"
    nano .env
fi
print_success ".env file exists"

print_step "3/3" "Checking Android manifest..."
if [ ! -f "android/app/src/main/AndroidManifest.xml" ]; then
    print_error "AndroidManifest.xml not found"
    exit 1
fi
print_success "AndroidManifest.xml found"

# ============================================================================
# STEP 3: DEVICE CHECK
# ============================================================================

print_section "STEP 3: CHECKING CONNECTED DEVICES"

echo ""
echo -e "${YELLOW}Connected devices:${NC}"
adb devices -l
echo ""

print_warning "Make sure your device is connected and USB debugging is enabled"
echo -e "${CYAN}Press Enter to continue...${NC}"
read

DEVICE_COUNT=$(adb devices | grep -c "device$" || true)
if [ "$DEVICE_COUNT" -eq 0 ]; then
    print_error "No devices found"
    print_warning "Connect an Android device with USB debugging enabled"
    print_warning "Or start an Android emulator"
    exit 1
fi
print_success "Device found and ready"

# ============================================================================
# STEP 4: DEPENDENCIES INSTALLATION
# ============================================================================

print_section "STEP 4: INSTALLING DEPENDENCIES"

print_step "1/2" "Installing npm dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing... this may take a few minutes..."
    npm install
    print_success "npm dependencies installed"
else
    print_success "npm dependencies already installed"
fi

print_step "2/2" "Checking Gradle wrapper..."
if [ ! -f "android/gradlew" ]; then
    print_error "Gradle wrapper not found"
    exit 1
fi
print_success "Gradle wrapper found"

# ============================================================================
# STEP 5: CLEAN BUILD
# ============================================================================

print_section "STEP 5: CLEANING PREVIOUS BUILDS"

print_step "1/2" "Cleaning Gradle..."
cd android
echo "Cleaning... this may take a minute..."
./gradlew clean > /dev/null 2>&1
cd ..
print_success "Gradle cleaned"

print_step "2/2" "Cleaning Metro cache..."
rm -rf /tmp/metro-bundler-cache 2>/dev/null || true
rm -rf ~/.metro 2>/dev/null || true
print_success "Metro cache cleaned"

# ============================================================================
# STEP 6: BUILD RELEASE APK
# ============================================================================

print_section "STEP 6: BUILDING RELEASE APK"

print_step "1/1" "Building APK... this will take 3-5 minutes..."
echo ""
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    cd ..
    print_error "APK build failed"
    print_warning "Check the error messages above"
    exit 1
fi
cd ..
echo ""
print_success "APK built successfully"

# ============================================================================
# STEP 7: KEYSTORE MANAGEMENT
# ============================================================================

print_section "STEP 7: KEYSTORE SETUP"

KEYSTORE_FILE="lnreader-key.keystore"

if [ ! -f "$KEYSTORE_FILE" ]; then
    print_warning "Keystore not found"
    echo ""
    echo -e "${CYAN}A keystore is required to sign the APK.${NC}"
    echo -e "${CYAN}This file will be used for all future releases.${NC}"
    echo ""
    print_step "1/1" "Creating new keystore..."
    echo ""
    echo "Enter the following information:"
    echo ""
    
    keytool -genkey -v -keystore "$KEYSTORE_FILE" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -alias lnreader
    
    if [ $? -ne 0 ]; then
        print_error "Keystore creation failed"
        exit 1
    fi
    echo ""
    print_success "Keystore created: $KEYSTORE_FILE"
    print_warning "⚠ IMPORTANT: Keep this file safe! You need it for all future updates."
else
    print_success "Keystore found: $KEYSTORE_FILE"
fi

# ============================================================================
# STEP 8: SIGN APK
# ============================================================================

print_section "STEP 8: SIGNING APK"

UNSIGNED_APK="android/app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED_APK="app-release.apk"

if [ ! -f "$UNSIGNED_APK" ]; then
    print_error "Unsigned APK not found at $UNSIGNED_APK"
    exit 1
fi

print_step "1/3" "Signing APK..."
echo ""
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore "$KEYSTORE_FILE" \
    "$UNSIGNED_APK" lnreader

if [ $? -ne 0 ]; then
    print_error "APK signing failed"
    exit 1
fi
echo ""
print_success "APK signed"

print_step "2/3" "Verifying signature..."
jarsigner -verify -verbose -certs "$UNSIGNED_APK"
if [ $? -ne 0 ]; then
    print_error "APK verification failed"
    exit 1
fi
print_success "Signature verified"

print_step "3/3" "Optimizing APK with zipalign..."
zipalign -v 4 "$UNSIGNED_APK" "$SIGNED_APK"
if [ $? -ne 0 ]; then
    print_error "APK optimization failed"
    exit 1
fi
print_success "APK optimized"

# ============================================================================
# STEP 9: UNINSTALL EXISTING APP
# ============================================================================

print_section "STEP 9: PREPARING DEVICE"

print_step "1/2" "Checking for existing installation..."
if adb shell pm list packages | grep -q "com.lnreadersync"; then
    print_warning "Existing app found, removing..."
    adb uninstall com.lnreadersync
    print_success "Existing app removed"
else
    print_success "No existing app found"
fi

print_step "2/2" "Checking device storage..."
STORAGE=$(adb shell df /data | tail -1 | awk '{print $4}')
print_success "Available storage: $STORAGE KB"

# ============================================================================
# STEP 10: INSTALL APK
# ============================================================================

print_section "STEP 10: INSTALLING APK"

print_step "1/2" "Installing APK to device..."
echo ""
adb install -r "$SIGNED_APK"
if [ $? -ne 0 ]; then
    print_error "APK installation failed"
    print_warning "Make sure your device has enough storage"
    exit 1
fi
echo ""
print_success "APK installed successfully"

print_step "2/2" "Verifying installation..."
if adb shell pm list packages | grep -q "com.lnreadersync"; then
    print_success "App verified on device"
else
    print_error "App verification failed"
    exit 1
fi

# ============================================================================
# STEP 11: LAUNCH APP
# ============================================================================

print_section "STEP 11: LAUNCHING APP"

print_step "1/1" "Starting LNReader Sync..."
sleep 2
adb shell am start -n com.lnreadersync/com.lnreadersync.MainActivity

if [ $? -ne 0 ]; then
    print_warning "Could not auto-launch app"
    print_warning "Launch manually from your device"
else
    print_success "App launched on device"
fi

# ============================================================================
# STEP 12: SHOW LOGS
# ============================================================================

print_section "STEP 12: MONITORING APP"

echo ""
echo -e "${CYAN}Showing app logs (Press Ctrl+C to stop):${NC}"
echo ""
sleep 2
adb logcat | grep "com.lnreadersync\|ReactNative\|Firebase" &
LOGCAT_PID=$!

# Wait a bit then show summary
sleep 5
kill $LOGCAT_PID 2>/dev/null || true

# ============================================================================
# SUCCESS SUMMARY
# ============================================================================

print_section "✓ BUILD AND INSTALLATION COMPLETE!"

echo ""
echo -e "${GREEN}Summary:${NC}"
echo -e "${GREEN}  ✓ APK built successfully${NC}"
echo -e "${GREEN}  ✓ APK signed with keystore${NC}"
echo -e "${GREEN}  ✓ APK installed on device${NC}"
echo -e "${GREEN}  ✓ App launched${NC}"
echo ""

echo -e "${BLUE}APK File Information:${NC}"
echo -e "  📦 File: $(pwd)/$SIGNED_APK"
echo -e "  📊 Size: $(du -h $SIGNED_APK | cut -f1)"
echo -e "  🔐 Signed: Yes (Release)"
echo -e "  📱 Package: com.lnreadersync"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Test the app thoroughly on your device"
echo -e "  2. Review RELEASE_CHECKLIST.md for pre-release items"
echo -e "  3. Keep $KEYSTORE_FILE safe for future updates"
echo -e "  4. Upload $SIGNED_APK to Google Play Console when ready"
echo ""

echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  View logs:         adb logcat | grep com.lnreadersync"
echo -e "  Clear app data:    adb shell pm clear com.lnreadersync"
echo -e "  Uninstall app:     adb uninstall com.lnreadersync"
echo -e "  View app info:     adb shell dumpsys package com.lnreadersync"
echo ""

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  LNReader Sync is now running on your device!                 ║${NC}"
echo -e "${CYAN}║  Check your device screen for the app                          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
