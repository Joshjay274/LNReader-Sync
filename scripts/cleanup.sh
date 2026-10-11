#!/bin/bash

# Cleanup script to remove build artifacts and cache

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Cleaning build artifacts...${NC}"

# Clean npm
rm -rf node_modules
rm -f package-lock.json

# Clean Android
cd android
./gradlew clean
cd ..

# Clean Metro cache
rm -rf /tmp/metro-bundler-cache
rm -rf ~/.metro

echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""
echo "To reinstall dependencies, run:"
echo -e "${GREEN}npm install${NC}"
echo -e "${GREEN}npm start${NC}"
