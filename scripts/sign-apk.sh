#!/bin/bash

# LNReader Sync - APK Signing Script
# Signs the release APK with your keystore

echo "🔐 Signing LNReader Sync APK..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APK_PATH="android/app/build/outputs/apk/release/app-release-unsigned.apk"
KEYSTORE_PATH="lnreader-key.keystore"
OUTPUT_APK="app-release.apk"

# Check if unsigned APK exists
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}❌ Unsigned APK not found at $APK_PATH${NC}"
    echo "Run './build-apk.sh' first to build the APK"
    exit 1
fi

# Check if keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo -e "${YELLOW}🔑 Keystore not found. Creating new keystore...${NC}"
    echo -e "${BLUE}Enter details for your keystore:${NC}"
    
    keytool -genkey -v -keystore "$KEYSTORE_PATH" \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -alias lnreader
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Keystore creation failed${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}Signing APK with keystore...${NC}"

# Sign the APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore "$KEYSTORE_PATH" \
    "$APK_PATH" lnreader

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ APK signing failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Verifying signed APK...${NC}"
jarsigner -verify -verbose -certs "$APK_PATH"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ APK verification failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Optimizing APK with zipalign...${NC}"
zipalign -v 4 "$APK_PATH" "$OUTPUT_APK"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ APK optimization failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ APK signed and optimized successfully!${NC}"
echo -e "${GREEN}📦 Signed APK: $OUTPUT_APK${NC}"
echo -e "${GREEN}Size: $(du -h $OUTPUT_APK | cut -f1)${NC}"
echo -e "${YELLOW}📱 Install with: adb install -r $OUTPUT_APK${NC}"
