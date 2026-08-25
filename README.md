# AssistMe

AssistMe is a mobile-first patient communication PWA. It provides large buttons for common needs, displays every request in English and Simplified Chinese, and can read either language aloud using the device browser's speech synthesis.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

The app stores caregiver category edits in the browser's local storage. The service worker caches the app shell and runtime assets so an installed app can continue working without an internet connection. Speech depends on the voices available on the device and is always optional.
