#!/bin/bash

# LNReader Sync - APK Build Script
# Builds a release APK ready for signing

echo "🔨 Building LNReader Sync APK..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ Error: ANDROID_HOME not set${NC}"
    echo "Please set ANDROID_HOME environment variable"
    exit 1
fi

echo -e "${YELLOW}📱 ANDROID_HOME: $ANDROID_HOME${NC}"

# Step 1: Clean previous builds
echo -e "${YELLOW}1️⃣  Cleaning previous builds...${NC}"
cd android
./gradlew clean
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Clean failed${NC}"
    exit 1
fi
cd ..

# Step 2: Install dependencies
echo -e "${YELLOW}2️⃣  Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

# Step 3: Build release APK
echo -e "${YELLOW}3️⃣  Building release APK...${NC}"
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ APK build failed${NC}"
    exit 1
fi
cd ..

# Step 4: Locate APK
APK_PATH="android/app/build/outputs/apk/release/app-release-unsigned.apk"
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}❌ APK not found at $APK_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ APK built successfully!${NC}"
echo -e "${GREEN}📦 Location: $APK_PATH${NC}"
echo -e "${YELLOW}⚠️  Next step: Sign the APK using './sign-apk.sh'${NC}"
