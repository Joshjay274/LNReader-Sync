#!/bin/bash

# Test script for running app tests

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Running tests...${NC}"

# Run ESLint
echo -e "${YELLOW}[1/3] Running ESLint...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ESLint passed${NC}"
else
    echo -e "${RED}✗ ESLint failed${NC}"
    exit 1
fi

# Run TypeScript check
echo -e "${YELLOW}[2/3] Running TypeScript check...${NC}"
npm run typecheck
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript check passed${NC}"
else
    echo -e "${RED}✗ TypeScript check failed${NC}"
    exit 1
fi

# Run Jest tests
echo -e "${YELLOW}[3/3] Running Jest tests...${NC}"
npm test -- --passWithNoTests
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Jest tests passed${NC}"
else
    echo -e "${RED}✗ Jest tests failed${NC}"
    exit 1
fi

echo -e ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ All Tests Passed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
