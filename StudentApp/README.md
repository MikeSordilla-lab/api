# StudentApp Frontend Notes

## Runtime API Configuration

Configure API endpoints in `app.json` under `expo.extra`:

```json
"extra": {
  "apiBaseUrl": "http://192.168.0.78/api",
  "apiBaseUrlWeb": "http://localhost/api"
}
```

- `apiBaseUrl` is used for native mobile sessions.
- `apiBaseUrlWeb` is used for web sessions when available.
- If config keys are missing, the app falls back to a safe default from `utils/config.js`.

## Current UX Features

- Modal add/edit flows with unsaved-change guard prompts.
- Search and sort controls for list navigation.
- Pull-to-refresh plus top-bar refresh action.
- Skeleton loading cards for initial load states.
- Retry action on list fetch failures.
- Temporary row highlight after successful update actions.
- Optimistic create/update/delete behavior with rollback on failure.

## Accessibility Coverage

Critical controls include accessibility labels and hints:

- Add student
- Refresh list
- Retry loading
- Search and sort controls
- Edit and delete actions
- Submit/cancel modal actions

## Development Commands

```bash
npm install
npx expo start --web
npx expo start
```

## Validation Reference

Use `../specs/main/quickstart.md` for the manual validation checklist.
