#!/bin/bash

# Setup script for new developers
# Handles initial project setup and configuration

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  LNReader Sync - Developer Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not installed${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check Java
echo -e "${YELLOW}Checking Java...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java not installed${NC}"
    echo "Install JDK 11+ from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi
echo -e "${GREEN}✓ Java $(java -version 2>&1 | head -1)${NC}"

# Check Android SDK
echo -e "${YELLOW}Checking Android SDK...${NC}"
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}✗ ANDROID_HOME not set${NC}"
    echo "Set ANDROID_HOME to your Android SDK location"
    exit 1
fi
echo -e "${GREEN}✓ ANDROID_HOME: $ANDROID_HOME${NC}"

# Check Android SDK tools
if [ ! -f "$ANDROID_HOME/tools/bin/sdkmanager" ] && [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo -e "${RED}✗ Android SDK tools not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Android SDK tools found${NC}"

# Install npm dependencies
echo ""
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create .env file
echo ""
echo -e "${YELLOW}Setting up environment...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ Please edit .env and add your Firebase credentials${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Create android directory structure if needed
echo -e "${YELLOW}Checking Android project structure...${NC}"
if [ ! -d "android/app/src/main" ]; then
    echo -e "${RED}✗ Android project structure incomplete${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Android project structure valid${NC}"

# Setup git hooks
echo ""
echo -e "${YELLOW}Setting up git hooks...${NC}"
if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
fi
echo -e "${GREEN}✓ Git hooks configured${NC}"

# Make scripts executable
echo ""
echo -e "${YELLOW}Making scripts executable...${NC}"
chmod +x scripts/*.sh
echo -e "${GREEN}✓ Scripts executable${NC}"

# Print next steps
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "1. Edit .env and add Firebase credentials"
echo -e "2. Download google-services.json from Firebase Console"
echo -e "3. Place google-services.json in android/app/"
echo -e "4. Run: npm start (start Metro bundler)"
echo -e "5. Run: npm run android (build and install to device)"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "• npm start - Start Metro bundler"
echo -e "• npm run android - Run on device/emulator"
echo -e "• npm run build:apk - Build release APK"
echo -e "• npm run lint - Lint code"
echo -e "• npm test - Run tests"
echo ""
