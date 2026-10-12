# LNReader Sync Web App

This repository has been converted from the original React Native app into a web-first React + Vite app designed for browser use while preserving the same LNReader Sync concept.

## Features

- Google sign-in ready through Firebase
- Email/password auth ready through Firebase
- Library dashboard for saved titles
- Reading progress tracking
- Note-taking panel for each title
- Local persistence for offline browsing
- Firestore sync support when Firebase is configured
- PWA support for installability and offline shell caching

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

This app expects Firebase Authentication with Google sign-in enabled, and supports email/password authentication as an additional option.

## Offline / PWA notes

- The app includes a basic service worker for shell caching.
- Firestore persistence is enabled when Firebase is configured.
- The app can install as a PWA on supported browsers.
- Initial sign-in requires a network connection; after sign-in, the session is cached and offline reads/writes can continue when the browser has access to local persistence.

## Notes

- If Firebase is not configured, the app still loads and uses local browser storage as a fallback.
- The original Android app logic can be adapted to this web app in later stages for deeper chapter source integrations and advanced sync features.
