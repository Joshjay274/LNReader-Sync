#!/bin/bash

# Complete APK Build and Release Script for LNReader Sync
# This script handles the entire build, sign, and release process

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  LNReader Sync - Complete APK Build & Release${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Step 1: Environment checks
echo -e "${YELLOW}[1/8] Checking environment...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java found${NC}"

if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}✗ ANDROID_HOME not set${NC}"
    exit 1
fi
echo -e "${GREEN}✓ ANDROID_HOME: $ANDROID_HOME${NC}"

# Step 2: Check Firebase configuration
echo -e "${YELLOW}[2/8] Checking Firebase configuration...${NC}"

if [ ! -f "android/app/google-services.json" ]; then
    echo -e "${RED}✗ google-services.json not found${NC}"
    echo "Please download from Firebase Console and place at android/app/google-services.json"
    exit 1
fi
echo -e "${GREEN}✓ google-services.json found${NC}"

# Step 3: Check environment variables
echo -e "${YELLOW}[3/8] Checking environment variables...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please fill in your Firebase credentials in .env${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env file found${NC}"

# Step 4: Clean and install dependencies
echo -e "${YELLOW}[4/8] Installing dependencies...${NC}"
cd android
./gradlew clean
cd ..
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Build release APK
echo -e "${YELLOW}[5/8] Building release APK...${NC}"
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ APK build failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Release APK built${NC}"

# Step 6: Check for keystore
echo -e "${YELLOW}[6/8] Checking keystore...${NC}"

KEYSTORE_FILE="lnreader-key.keystore"
if [ ! -f "$KEYSTORE_FILE" ]; then
    echo -e "${YELLOW}⚠ Keystore not found. Creating new keystore...${NC}"
    keytool -genkey -v -keystore "$KEYSTORE_FILE" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -alias lnreader
    echo -e "${GREEN}✓ Keystore created${NC}"
else
    echo -e "${GREEN}✓ Keystore found${NC}"
fi

# Step 7: Sign APK
echo -e "${YELLOW}[7/8] Signing APK...${NC}"

UNSIGNED_APK="android/app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED_APK="app-release.apk"

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore "$KEYSTORE_FILE" \
    "$UNSIGNED_APK" lnreader

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ APK signing failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ APK signed${NC}"

# Step 8: Align and finalize
echo -e "${YELLOW}[8/8] Optimizing APK...${NC}"
zipalign -v 4 "$UNSIGNED_APK" "$SIGNED_APK"
echo -e "${GREEN}✓ APK optimized${NC}"

# Final summary
echo -e ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ APK Build Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "${BLUE}APK File:${NC} $(pwd)/$SIGNED_APK"
echo -e "${BLUE}Size:${NC} $(du -h $SIGNED_APK | cut -f1)"
echo -e ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Install on device: adb install -r $SIGNED_APK"
echo -e "2. Test the app thoroughly"
echo -e "3. Upload to Play Store: https://play.google.com/console"
echo -e ""
