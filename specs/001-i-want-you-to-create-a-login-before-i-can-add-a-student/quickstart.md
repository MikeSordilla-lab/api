# Quickstart: Validate Login Before Student Creation

## Preconditions

- Apache and MySQL are running in XAMPP.
- Existing API is available under local base URL.
- Expo app dependencies are installed in `StudentApp/`.
- Auth defaults are configured (`admin` / `admin123`) or overridden via environment variables.

## Run

1. Start the frontend app:
   - `cd StudentApp`
   - `npx expo start --web`
2. Ensure backend files are served from `c:/xampp/htdocs/api/`.

## Validation Scenarios

### 0. Auth Endpoint Contract Sanity

1. `POST /login.php` with valid credentials.
2. `GET /me.php` after login.
3. `POST /logout.php`.
4. `GET /me.php` after logout.

Expected:

- Login returns `status=ok` and establishes session.
- Me endpoint reports `authenticated=true` after login and `authenticated=false` after logout.

### 1. Unauthenticated User Cannot Add Student

1. Open app in fresh session (not logged in).
2. Attempt to open add-student flow and submit data.
3. Verify user is prompted to log in and create action is blocked.

Expected:

- UI shows login prompt/screen.
- API create attempt without auth returns failed unauthorized response.

### 2. Valid Login Enables Add Student

1. Enter valid configured credentials.
2. Submit login.
3. Add a student with valid form data.

Expected:

- Login response status is ok.
- Add-student operation succeeds and returns existing success envelope.

### 3. Invalid Login Is Rejected

1. Enter invalid credentials.
2. Submit login.

Expected:

- Login response status is failed.
- User remains unauthenticated and cannot add student.

### 4. Session Persists During Navigation

1. Log in successfully.
2. Navigate around app and return to add-student action.

Expected:

- User remains authenticated until logout/session expiry.

### 5. Logout Removes Add Access

1. While authenticated, run logout action.
2. Attempt to add a student again.

Expected:

- Access is blocked and login is required again.

### 6. Expired/Invalid Session Recovery

1. Invalidate session (e.g., restart server/session timeout).
2. Attempt create flow.

Expected:

- `create_student.php` returns unauthorized.
- UI guides user back to login and resumes intended flow after successful sign-in.

## Regression Checks

1. `GET /students.php` still returns student list.
2. `POST /update_student.php` and `POST /delete_student.php` behavior remains unchanged in this feature.
3. Existing student form validation still applies.

## Completion Criteria

- All six validation scenarios pass.
- Unauthorized create attempts are blocked 100% of the time.
- No schema migrations or new database tables are introduced.

## Implementation Validation Record

- Date: 2026-03-15
- Completed checks:
  - Added auth/session endpoints and helper files.
  - Added create-student authorization gate with HTTP 401 handling.
  - Added frontend login gate, logout, session bootstrap, and session-expired recovery handling.
  - API scenario verification executed:
    - `POST /login.php` valid credential: HTTP 200, `status=ok`.
    - `GET /me.php` after login: `authenticated=true`.
    - `POST /logout.php`: HTTP 200.
    - `GET /me.php` after logout: `authenticated=false`.
    - Invalid login credential: HTTP 401.
    - Unauthenticated create attempt: HTTP 401 with failed status/message.
    - Authenticated create attempt (session cookie): HTTP 200 with success status/message.
    - Regression endpoint responses: `students.php`, `update_student.php`, `delete_student.php` all returned HTTP 200 during smoke checks.
  - Frontend lint/error diagnostics: no static editor errors reported in updated React Native files.

- Pending manual checks:
  - Interactive Expo UI walkthrough for scenarios 1-6 (modal flow, add-button gate behavior, and re-login continuation UX) still requires human validation in browser/device session.
