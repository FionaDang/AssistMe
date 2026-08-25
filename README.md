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

## Categories and reconnect behavior

Caregivers can create a category from Settings by entering its English and Chinese names. New requests can then be added inside that category. Caregiver mode and the connection code are stored locally, and the summon listener reconnects when the device returns online or the app becomes visible again.

The current browser relay cannot wake a phone that is fully powered off, and an open web page cannot guarantee sound while iOS has suspended it. True powered-off/closed-app alerts require Web Push or a native push service backed by a private server. The current version supports notifications while the caregiver app/page is available and reconnects after the device wakes; push delivery is the next production architecture step.

## Two-device MVP option

For a small test with two devices, a custom backend is not necessary. Use the current ntfy relay. On the caregiver device, install the ntfy app, subscribe to the notification topic shown in AssistMe Settings (for example, `assistme-a1b2c3d4`), and enable its sound notifications. Use the same connection code in AssistMe on both devices. The patient can then summon from AssistMe while the caregiver receives the ntfy notification even when the AssistMe page is closed.

This MVP topic is public and should not contain names, medical details, or selected requests. It is only for testing. Replace it with authenticated Web Push before real patient use.

AssistMe's browser notification permission is only for the caregiver page while it is available. For closed-app iPhone notifications in this MVP, install the ntfy app on the caregiver iPhone, subscribe to the topic shown in AssistMe Settings, and enable ntfy sound notifications. The **Open notification setup** button opens the topic page to make that setup easier.
