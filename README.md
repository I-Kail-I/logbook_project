# Logbook Mobile App

Logbook is an Expo + React Native mobile application for recording daily work activities, tracking productivity, and exporting activity reports to PDF.

## Features

- Daily logbook creation and activity history
- Dashboard with activity cards and quick navigation
- Calendar-based logbook browsing
- Print preview and PDF sharing
- Bilingual interface (Bahasa Indonesia and English)
- Dark mode and high contrast mode
- Accessibility settings:
  - Font family: Inter, Roboto, Open Sans, System
  - Font size: Small, Normal, Large, Extra Large
  - Reduced motion support
- Pull-to-refresh on Dashboard and Logbook with haptic feedback
- Local settings persistence with AsyncStorage

## Screenshots / Recordings

- `docs/screenshots/login.png` (placeholder)
- `docs/screenshots/dashboard.png` (placeholder)
- `docs/screenshots/logbook.png` (placeholder)
- `docs/screenshots/settings-accessibility.png` (placeholder)
- `docs/recordings/refresh-demo.mp4` (placeholder)

## Tech Stack

- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- Expo modules: `expo-font`, `expo-notifications`, `expo-print`, `expo-sharing`, `expo-haptics`

## Architecture Overview

Top-level structure:

- `app/` - route-based screens (`expo-router`)
- `components/` - reusable UI components
- `contexts/` - global app state (settings, font)
- `constants/` - theme, translations, typography helpers
- `hooks/` - reusable behavior hooks (animations, etc.)
- `utils/` - utility logic (e.g., refresh handler)
- `assets/` - images and fonts

## Installation and Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (optional, via `npx expo ...`)

### Install

```bash
npm install
```

### Run the app

```bash
npm run start
```

Then open on:

- Android emulator/device
- iOS simulator/device
- Expo Go
- Web (`npm run web`)

## Development Guide

### Common scripts

- `npm run start` - run dev server
- `npm run android` - run on Android
- `npm run ios` - run on iOS
- `npm run web` - run web version
- `npm run lint` - run linter
- `npm run test` - run unit tests
- `npm run test:ci` - run tests with coverage

### Localization

- Translation keys live in `constants/translations.ts`.
- Add values for both `id` and `en` locales for every new key.

### Theming and accessibility

- Color tokens are defined in `constants/theme.ts`.
- Settings state is managed in `contexts/SettingsContext.tsx`.
- Global font behavior is provided by `contexts/FontContext.tsx`.

## Testing

The project uses Jest with `jest-expo`.

- Test config: `jest.config.js`
- Test setup: `jest.setup.ts`
- Example coverage:
  - Theme contrast behavior
  - Typography font mapping/scaling
  - Pull-to-refresh timing and completion flow

Run:

```bash
npm run test
```

## Contributing

1. Fork and create a feature branch.
2. Keep pull requests focused and small.
3. Ensure lint and tests pass before opening a PR.
4. Use clear commit messages (`feat:`, `fix:`, `docs:`, `test:`).
5. Include screenshots/recordings for UI changes.

## Production Notes

- Configure push notification credentials before release.
- Replace placeholder/mock data with API integration.
- Add real media assets in the screenshots/recordings paths.
