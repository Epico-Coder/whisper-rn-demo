# whisper-demo-v4

A small Expo + React Native demo for downloading Whisper models, switching between them, and running on-device transcription.

## Requirements

- Node.js and npm
- Android Studio with the Android SDK
- A physical Android device for testing

This project currently targets Android only. `whisper.rn` does not run in Expo Go, so you need a native Android build on a real device to test it.

## Run locally

```bash
npm install
npx expo prebuild
npx expo run:android
```

That installs native dependencies, builds the Android app, and launches it on your connected device.

## Demo

https://github.com/user-attachments/assets/082eb7e9-d089-4e98-964a-6679ac6fed75
