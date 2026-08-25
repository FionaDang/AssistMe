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

## Test caregiver summon

1. Open AssistMe on both devices while online.
2. Open **Settings** on both devices and enter the same **Connection code**. The first device generates the code.
3. On the caregiver device, enable **Receive caregiver alerts on this device** and allow browser notifications.
4. On the caregiver device, press **Test alert sound** once. This gives the browser permission to play a later background alert sound.
5. On the patient device, close Settings and tap **Summon caregiver**.
6. The caregiver device should play the alert tone, show an in-app alert, and, when permitted, show a browser notification.

Browsers can block background audio until the caregiver has interacted with the page. Keep the caregiver page or installed app open while waiting for summons.

The prototype uses ntfy.sh as a public relay and sends only the generic message “The patient is asking for help.” It does not send the patient's name, medical details, or selected request. The connection code is a shared topic rather than secure authentication, so this is for development/testing only. A production release should use a private authenticated backend with access control, TLS, rate limiting, audit logging, and a privacy/compliance review.
