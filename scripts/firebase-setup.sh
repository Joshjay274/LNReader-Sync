#!/bin/bash

# Firebase Setup Script
# Helps configure Firebase for the project

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Firebase Setup for LNReader Sync${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Firebase Configuration Steps:${NC}"
echo ""
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo ""
echo "2. Create a new project:"
echo "   • Project name: LNReader Sync"
echo "   • Google Analytics: Enable (optional)"
echo ""
echo "3. Add Android app:"
echo "   • Package name: com.lnreadersync"
echo "   • App nickname: LNReader Sync"
echo ""
echo "4. Download google-services.json"
echo "   • Save to: android/app/google-services.json"
echo ""
echo "5. Enable Authentication:"
echo "   • Go to Build > Authentication"
echo "   • Sign-in method: Enable Google"
echo ""
echo "6. Create Firestore Database:"
echo "   • Go to Build > Firestore Database"
echo "   • Mode: Start in production mode"
echo "   • Location: Choose your region"
echo ""
echo "7. Get Firebase Credentials:"
echo "   • Go to Project Settings"
echo "   • Copy Web API configuration"
echo ""
echo "8. Get Google Sign-In Credentials:"
echo "   • Go to Google Cloud Console"
echo "   • Create OAuth 2.0 credentials"
echo "   • Type: Android"
echo "   • Add your app's SHA-1 fingerprint"
echo ""

echo -e "${YELLOW}Finding your app's SHA-1 fingerprint:${NC}"
echo ""
echo "Run this command:"
echo -e "${GREEN}keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android${NC}"
echo ""
echo "Copy the SHA-1 value and add to Google Cloud Console."
echo ""

echo -e "${YELLOW}Update your .env file with:${NC}"
echo ""
echo "FIREBASE_API_KEY=<from Firebase Console>"
echo "FIREBASE_AUTH_DOMAIN=<from Firebase Console>"
echo "FIREBASE_PROJECT_ID=<from Firebase Console>"
echo "FIREBASE_STORAGE_BUCKET=<from Firebase Console>"
echo "FIREBASE_MESSAGING_SENDER_ID=<from Firebase Console>"
echo "FIREBASE_APP_ID=<from Firebase Console>"
echo "GOOGLE_WEB_CLIENT_ID=<from Google Cloud Console>"
echo "GOOGLE_ANDROID_CLIENT_ID=<from Google Cloud Console>"
echo ""

echo -e "${GREEN}After completing setup, run:${NC}"
echo -e "${GREEN}npm start${NC} - to start the development server"
echo -e "${GREEN}npm run android${NC} - to build and run on device"
echo ""
