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

When adding a request, either the English or Chinese field may be left blank. If the device is online, AssistMe first tries an online translation service for better results, then falls back to its built-in offline phrase list. The form clearly indicates that text may be sent to the translation service. When offline, common phrases translate automatically; unknown phrases must be entered manually so an unsafe or incorrect patient-facing translation is never invented.
