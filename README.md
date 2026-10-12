# LNReader Sync Web App

This repository has been converted from the original React Native app into a web-first React + Vite app designed for browser use while preserving the same LNReader Sync concept.

## Features

- Google sign-in ready through Firebase
- Library dashboard for saved titles
- Reading progress tracking
- Note-taking panel for each title
- Local persistence for offline browsing
- Firestore sync support when Firebase is configured

## Quick start

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in the Firebase values in `.env`.

3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

The app will run on `http://localhost:3000`.

## Production build

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Firebase setup

Use the same values from your Firebase project:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

This app expects Firebase Authentication with Google sign-in enabled.

## Notes

- If Firebase is not configured, the app still loads and uses local browser storage as a fallback.
- The original Android app logic can be adapted to this web app in later stages for deeper chapter source integrations and advanced sync features.
