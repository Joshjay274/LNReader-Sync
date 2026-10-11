#!/bin/bash

# Quick APK installation script
# Use this to install the already-built APK to your device

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APK_FILE="${1:-app-release.apk}"

echo -e "${BLUE}LNReader Sync - APK Installer${NC}"
echo ""

# Check if APK exists
if [ ! -f "$APK_FILE" ]; then
    echo -e "${RED}✗ APK file not found: $APK_FILE${NC}"
    echo "Usage: bash scripts/quick-install.sh [apk-file]"
    echo "Example: bash scripts/quick-install.sh app-release.apk"
    exit 1
fi

echo -e "${YELLOW}APK File:${NC} $APK_FILE"
echo -e "${YELLOW}Size:${NC} $(du -h $APK_FILE | cut -f1)"
echo ""

# Check devices
echo -e "${YELLOW}Connected devices:${NC}"
adb devices -l
echo ""

# Check for existing app
if adb shell pm list packages | grep -q "com.lnreadersync"; then
    echo -e "${YELLOW}Existing app found, removing...${NC}"
    adb uninstall com.lnreadersync
fi

# Install
echo -e "${YELLOW}Installing APK...${NC}"
adb install -r "$APK_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ APK installed successfully${NC}"
echo ""

# Launch
echo -e "${YELLOW}Launching app...${NC}"
adb shell am start -n com.lnreadersync/com.lnreadersync.MainActivity

echo -e "${GREEN}✓ Done!${NC}"
echo ""
echo -e "${BLUE}View logs:${NC} adb logcat | grep com.lnreadersync"
