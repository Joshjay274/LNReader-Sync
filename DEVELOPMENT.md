# LNReader Sync Development Guide

## Project Structure

```
LNReader-Sync/
├── android/                    # Native Android code
│   ├── app/
│   │   ├── build.gradle       # App-level build config
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── AndroidManifest.xml
│   │   │   │   ├── java/     # Java/Kotlin code
│   │   │   │   └── res/      # Android resources
│   │   │   └── debug/
│   │   └── google-services.json  # Firebase config (not in repo)
│   └── build.gradle           # Project-level build config
├── src/                       # React Native TypeScript code
│   ├── screens/              # Screen components
│   ├── components/           # Reusable components
│   ├── services/             # Business logic
│   ├── store/                # State management (Zustand)
│   ├── config/               # Configuration files
│   ├── theme.ts              # Theming
│   └── types.ts              # TypeScript types
├── scripts/                   # Build and utility scripts
├── App.tsx                    # Root app component
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── .env.example               # Environment template
├── COMPLETE_BUILD_GUIDE.md    # Build instructions
└── README.md                  # Project documentation
```

## Development Workflow

### 1. Setup

```bash
bash scripts/setup-dev.sh
```

### 2. Start Development

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on device
npm run android
```

### 3. Make Changes

- Edit TypeScript files in `src/`
- Changes hot-reload automatically
- Test thoroughly

### 4. Commit

```bash
npm run lint
npm run format
git commit -m "feat: describe your change"
```

## Key Technologies

- **React Native 0.73**: Cross-platform mobile
- **TypeScript**: Type safety
- **Zustand**: State management
- **Firebase**: Backend services
- **React Navigation**: Navigation
- **Firestore**: Database
- **Google Sign-In**: Authentication

## Common Tasks

### Add a New Screen

1. Create file: `src/screens/NewScreen.tsx`
2. Add navigation in `App.tsx`
3. Update types if needed

### Add State Management

1. Update store in `src/store/useAppStore.ts`
2. Add types to `src/types.ts`
3. Use hook: `const { data } = useAuthStore()`

### Add Firebase Collection

1. Add to `firestore.rules`
2. Add security rules
3. Create sync methods in `src/services/syncService.ts`
4. Add to store

### Build Release APK

```bash
bash scripts/complete-build.sh
```

## Code Style

- Use TypeScript for all code
- No `any` types
- Use functional components
- Use hooks for state
- Keep components < 300 lines
- Extract reusable logic

## Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Debugging

### Chrome DevTools

1. Shake device
2. Select "Debug"
3. Opens chrome://localhost:8081/debugger-ui

### React Native Debugger

```bash
# Install
brew install react-native-debugger

# Launch
react-native-debugger
```

### Android Logcat

```bash
adb logcat

# Filter by tag
adb logcat | grep "ReactNative"
```

## Performance Tips

1. Use `React.memo` for expensive components
2. Use `useMemo` for expensive computations
3. Use `useCallback` for event handlers
4. Lazy load screens with `@react-navigation/lazy"`
5. Use FlatList for long lists
6. Optimize images

## Security Best Practices

1. Never commit `.env` files
2. Never commit keystores
3. Validate all user input
4. Use HTTPS for all API calls
5. Don't store sensitive data in AsyncStorage
6. Use Firebase security rules
7. Restrict API keys

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Android Docs](https://developer.android.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## Getting Help

1. Check documentation in repo
2. Search GitHub issues
3. Check Stack Overflow
4. File a new GitHub issue

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request
6. Wait for review

## License

MIT
