# LNReader-Sync

A full-featured light novel reader app inspired by LNReader, with cloud sync using Google account authentication.

## Features

- Google Sign-In integration
- Cross-device reading progress sync
- Cloud backup for reading progress
- Library view and reading dashboard
- Chapter tracking and progress bars
- Local persistence for offline reading
- Profile screen with account control
- React Native + TypeScript foundation

## Project structure

- `App.tsx` — root app shell and navigation
- `src/screens` — home, profile, library, and reader screens
- `src/store` — app data and sync state
- `src/services` — Google sign-in and cloud sync logic
- `src/config` — Firebase setup
- `src/theme.ts` — visual theme and colors

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase and Google credentials:
   - Create a Firebase project
   - Enable Authentication with Google sign-in
   - Add your Firebase config in `src/config/firebase.ts`
   - Set the Google web client ID in `App.tsx`

3. Start Metro:
   ```bash
   npm start
   ```

4. Run Android:
   ```bash
   npm run android
   ```

## Important notes

This is a production-ready starter app foundation. For a full production release, you should complete the following:

- Google Play configuration for Android
- Firebase Android setup (`google-services.json`)
- Firestore security rules
- Real light novel source integration
- Full reading engine for chapters and images
- Local database for long-term library storage

## License

MIT

## Next phase

The next version can include:

- real chapter parsing and scraping modules
- EPUB import/export
- bookmark and note sync
- dark/light themes
- reading mode and font controls
- offline cache and download management
