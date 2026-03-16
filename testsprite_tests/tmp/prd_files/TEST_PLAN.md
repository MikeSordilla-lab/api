# Student App Test Plan

Date: 2026-03-16
Owner: QA/Developer
Version: 1.0

## 1. Objective

Validate that the PHP API and React Native app provide reliable authentication, student CRUD operations, and the expected UX/accessibility behavior without regressions.

## 2. Scope

In scope:

- API auth endpoints: `login.php`, `logout.php`, `me.php`
- Student endpoints: `students.php`, `create_student.php`, `update_student.php`, `delete_student.php`
- Mobile app flows in `StudentApp/`:
  - login/logout
  - list loading/error/retry/empty state
  - add/edit/delete student
  - search/sort
  - pull-to-refresh
  - unsaved changes guard
  - optimistic updates and rollback
  - accessibility labels and focus behavior

Out of scope:

- Load/stress testing at production scale
- Penetration/security testing beyond basic auth/session behavior
- App store packaging/signing validation

## 3. Test Environment

Backend:

- Windows + XAMPP (Apache + MySQL)
- Database: `student`
- API base URL: `http://localhost/api`

Mobile:

- Node.js 18+
- Expo CLI / Expo Go
- Android and/or iOS emulator (or physical device)

Test data:

- Seed at least 5 student records for list, search, and sort tests.
- Ensure one environment with an empty table for empty-state tests.

## 4. Entry and Exit Criteria

Entry criteria:

- API reachable from browser/Postman
- DB schema present and connection valid
- Mobile app runs and can reach API

Exit criteria:

- All P1 and P2 test cases pass
- No open Critical/High defects
- Any Medium defects have documented workaround and approval

## 5. Test Types

- Smoke tests
- Functional API tests
- End-to-end UI tests (manual)
- Negative tests
- Regression tests
- Basic accessibility checks

## 6. Risks and Mitigations

- Risk: Local network/API URL mismatch for mobile.
  - Mitigation: Verify `app.json` URL and test both local IP + localhost web mode.
- Risk: Optimistic UI masks server failures.
  - Mitigation: Run forced-failure tests and verify rollback.
- Risk: Session timeout behavior differs by environment.
  - Mitigation: Validate with reduced timeout in test config.

## 7. Detailed Test Cases

### 7.1 Smoke Tests (P1)

| ID     | Scenario           | Steps                                            | Expected Result                         |
| ------ | ------------------ | ------------------------------------------------ | --------------------------------------- |
| SMK-01 | API list reachable | Open `GET /students.php`                         | Returns JSON array or valid empty array |
| SMK-02 | App boots          | Launch Expo app                                  | Home/login screen renders without crash |
| SMK-03 | Auth guard active  | Call `POST /create_student.php` while logged out | HTTP 401 and auth error response        |
| SMK-04 | Login works        | Login using default credential                   | Session is created; user can proceed    |

### 7.2 Authentication Tests (P1)

| ID      | Scenario           | Steps                                               | Expected Result                     |
| ------- | ------------------ | --------------------------------------------------- | ----------------------------------- |
| AUTH-01 | Valid login        | POST valid username/password                        | Success status + active session     |
| AUTH-02 | Invalid password   | POST valid user + wrong password                    | Failure status and no session       |
| AUTH-03 | Missing fields     | POST missing username/password                      | Validation failure                  |
| AUTH-04 | Session check      | GET `me.php` after login                            | Authenticated user/session response |
| AUTH-05 | Logout             | POST `logout.php` after login                       | Session destroyed; success response |
| AUTH-06 | Post-logout access | Call create endpoint after logout                   | HTTP 401                            |
| AUTH-07 | Timeout            | Stay idle beyond timeout, then call create endpoint | HTTP 401/session expired            |

### 7.3 Student CRUD API Tests (P1)

| ID     | Scenario               | Steps                                          | Expected Result                                                       |
| ------ | ---------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| API-01 | List students          | GET `students.php`                             | Array with expected fields (`id`, `firstname`, `lastname`, `ratings`) |
| API-02 | Create valid student   | POST create with valid payload (authenticated) | `status=ok`; new record exists                                        |
| API-03 | Create invalid student | POST create with missing/invalid field         | `status=failed` with message                                          |
| API-04 | Update valid student   | POST update existing ID                        | `status=ok`; record changed                                           |
| API-05 | Update missing ID      | POST update unknown ID                         | `status=failed`                                                       |
| API-06 | Delete valid student   | POST delete existing ID                        | `status=ok`; record removed                                           |
| API-07 | Delete missing ID      | POST delete unknown ID                         | `status=failed`                                                       |

### 7.4 UI Functional Tests (P1/P2)

| ID    | Scenario                  | Steps                              | Expected Result                                     |
| ----- | ------------------------- | ---------------------------------- | --------------------------------------------------- |
| UI-01 | Empty state CTA           | Ensure no records, open app list   | Empty state appears; CTA opens add modal            |
| UI-02 | Skeleton loading          | Throttle/slow API and refresh list | Skeleton placeholders visible while loading         |
| UI-03 | Retry state               | Force list API failure             | Error + retry button shown in-place                 |
| UI-04 | Add student modal flow    | Add valid student from modal       | Student appears in list; success feedback           |
| UI-05 | Edit student flow         | Edit an existing student           | Updated values shown; row highlight visible briefly |
| UI-06 | Delete student flow       | Delete existing student            | Student removed with feedback                       |
| UI-07 | Search                    | Enter query matching one student   | List filters immediately to matching results        |
| UI-08 | Sort                      | Change sort criteria/order         | List order updates deterministically                |
| UI-09 | Search + sort composition | Apply search then sort             | Results remain filtered and correctly sorted        |
| UI-10 | Pull-to-refresh (mobile)  | Pull list downward on mobile       | Refresh indicator shows; list refreshes             |
| UI-11 | Unsaved changes guard     | Edit form, attempt close           | Confirmation prompt appears before discard          |
| UI-12 | Cancel discard            | In guard dialog, cancel close      | Modal stays open with values intact                 |
| UI-13 | Confirm discard           | In guard dialog, confirm close     | Modal closes and form resets                        |

### 7.5 Optimistic Update and Rollback Tests (P1)

| ID     | Scenario                   | Steps                                       | Expected Result                                    |
| ------ | -------------------------- | ------------------------------------------- | -------------------------------------------------- |
| OPT-01 | Optimistic create success  | Add student with normal API                 | Row appears immediately and remains after response |
| OPT-02 | Optimistic create rollback | Force create API failure after local insert | Temporary row is removed/rolled back; error shown  |
| OPT-03 | Optimistic update rollback | Force update failure after local change     | Original row values restored; error shown          |
| OPT-04 | Optimistic delete rollback | Force delete failure after local removal    | Row reappears; error shown                         |

### 7.6 Accessibility and UX Consistency Tests (P2)

| ID      | Scenario                   | Steps                                                              | Expected Result                                   |
| ------- | -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| A11Y-01 | Labels on critical actions | Inspect add/edit/delete/refresh/retry/submit/cancel/close controls | All controls have meaningful accessibility labels |
| A11Y-02 | Focus visibility           | Navigate with keyboard/web focus                                   | Clear visible focus style on interactive controls |
| A11Y-03 | Icon consistency           | Compare list + modal actions                                       | Icons and wording are consistent                  |

### 7.7 Negative and Edge Case Tests (P2)

| ID     | Scenario                        | Steps                                      | Expected Result                                 |
| ------ | ------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| NEG-01 | Rapid retry taps                | Tap retry repeatedly during active request | Single in-flight request handling; no crash     |
| NEG-02 | Whitespace-only form changes    | Enter spaces only and close modal          | Guard behavior follows trimmed dirty-state rule |
| NEG-03 | Sort during refresh             | Change sort while pull-to-refresh active   | No crash; final list sorted correctly           |
| NEG-04 | Highlighted row deleted quickly | Update/create then delete same row         | UI remains stable; no stale highlight artifacts |

## 8. Defect Severity Guide

- Critical: Data loss, crash loop, auth bypass, app unusable
- High: Core feature broken (login, create, update, delete)
- Medium: UX behavior mismatch with workaround
- Low: Minor visual/content/accessibility issue with low impact

## 9. Suggested Execution Order

1. Smoke tests
2. Authentication
3. CRUD API
4. Core UI flows
5. Optimistic rollback and edge cases
6. Accessibility and consistency pass
7. Regression rerun of Smoke + P1 cases

## 10. Deliverables

- Test execution report (pass/fail per case)
- Defect log with severity and reproduction steps
- Sign-off note confirming exit criteria
