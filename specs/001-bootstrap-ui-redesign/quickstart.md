# Quickstart: Bootstrap UI Redesign

**Feature**: `001-bootstrap-ui-redesign`  
**Branch**: `001-bootstrap-ui-redesign`  
**Date**: 2026-03-08

## Prerequisites

| Requirement | Version | Check                                         |
| ----------- | ------- | --------------------------------------------- |
| Node.js     | ≥ 18    | `node --version`                              |
| npm         | ≥ 9     | `npm --version`                               |
| Expo CLI    | via npx | `npx expo --version`                          |
| XAMPP       | any     | Start Apache + MySQL from XAMPP Control Panel |
| Expo Go     | latest  | Installed on Android/iOS device, same LAN     |

## 1. Start the XAMPP Backend

1. Open **XAMPP Control Panel**.
2. Click **Start** for **Apache** and **MySQL**.
3. Verify the backend is running:
   ```
   http://localhost/api/students.php
   ```
   You should see a JSON array (empty `[]` or populated).

## 2. Configure the Base URL

Open `StudentApp/App.js` and update `BASE_URL` to your machine's local IP:

```js
const BASE_URL = "http://192.168.X.X/api"; // replace with your LAN IP
```

Find your IP: run `ipconfig` on Windows; look for **IPv4 Address** under your
active network adapter.

> The device/emulator and the XAMPP machine must be on the same WiFi network.

## 3. Install Dependencies (no new deps for this feature)

```bash
cd StudentApp
npm install      # installs existing deps; no new packages added for this feature
```

## 4. Run the App

### Mobile (via Expo Go)

```bash
cd StudentApp
npx expo start
```

- Scan the QR code with **Expo Go** on Android.
- On iOS, scan with the Camera app or Expo Go.

### Android Emulator

```bash
npx expo start --android
```

### Web Browser

```bash
npx expo start --web
```

Opens at `http://localhost:8081` — uses `react-native-web` (already installed).

## 5. Verify Bootstrap Redesign

Walk through each user story:

| Check                | Steps                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **US1 — List**       | Open app → student list renders as white cards with shadow and visible Edit/Delete buttons                                     |
| **US2 — Add**        | Fill all fields → tap "Add Student" (blue primary button) → success alert → form clears                                        |
| **US2 — Validation** | Leave a field blank → tap "Add Student" → inline error appears; no request sent                                                |
| **US3 — Edit**       | Tap "Edit" (yellow warning button) on a card → form pre-fills, button label changes to "Update Student", Cancel button appears |
| **US3 — Cancel**     | While in edit mode, tap "Cancel" (grey secondary button) → form clears, returns to add mode                                    |
| **US4 — Delete**     | Tap "Delete" (red danger button) → confirmation dialog → confirm → card removed; cancel → no change                            |
| **Empty state**      | Delete all students → "No students yet. Add one above." message displays                                                       |

## 6. Troubleshooting

| Problem                              | Solution                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `Failed to fetch students`           | Check XAMPP Apache is running; verify `BASE_URL` IP; ensure device is on same WiFi |
| Network request blocked on Android   | Confirm `app.json` has `"usesCleartextTraffic": true` under `android` key          |
| White screen / JS error              | Run `npx expo start --clear` to clear the Metro cache                              |
| Expo Go shows "Something went wrong" | Check terminal for JS errors; ensure `npm install` completed                       |

## File Locations

| File                                   | Purpose                                       |
| -------------------------------------- | --------------------------------------------- |
| `StudentApp/App.js`                    | Main screen component (Bootstrap-themed)      |
| `StudentApp/theme/bootstrap.js`        | Bootstrap 5 design tokens                     |
| `StudentApp/components/StudentCard.js` | Bootstrap card component for each student row |
| `StudentApp/components/StudentForm.js` | Bootstrap form component                      |
| `c:\xampp\htdocs\api\*.php`            | PHP REST endpoints (not modified)             |
