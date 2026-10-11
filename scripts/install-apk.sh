#!/bin/bash

# LNReader Sync - APK Installation Script
# Installs the signed APK to a connected device or emulator

echo "📱 Installing LNReader Sync APK..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APK_FILE="${1:-app-release.apk}"

# Check if APK exists
if [ ! -f "$APK_FILE" ]; then
    echo -e "${RED}❌ APK file not found: $APK_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}Checking connected devices...${NC}"
adb devices

echo -e "${YELLOW}Installing APK...${NC}"
adb install -r "$APK_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ APK installed successfully!${NC}"
echo -e "${YELLOW}🚀 Starting app...${NC}"
adb shell am start -n com.lnreadersync/com.lnreadersync.MainActivity

echo -e "${GREEN}✅ App launched!${NC}"
