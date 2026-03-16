# Tasks: Login Required Before Student Creation

**Input**: Design documents from `/specs/001-i-want-you-to-create-a-login-before-i-can-add-a-student/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are not included because the specification does not explicitly request TDD or automated test creation; validation is driven by quickstart manual scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish auth-related scaffolding and configuration surfaces.

- [x] T001 Create authentication configuration constants in auth_config.php
- [x] T002 [P] Add secure session bootstrap helper in auth_session.php
- [x] T003 [P] Add authentication guard/helper functions in auth_guard.php
- [x] T004 [P] Add frontend auth API primitives in StudentApp/services/studentApi.js
- [x] T005 [P] Add frontend auth state helper utilities in StudentApp/utils/config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth plumbing that MUST be complete before implementing user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Wire credentialed CORS/session headers for auth routes in login.php
- [x] T007 [P] Add reusable unauthorized JSON response helper in auth_guard.php
- [x] T008 [P] Add 60-minute inactivity timeout enforcement in auth_session.php
- [x] T009 [P] Add frontend auth bootstrap state in StudentApp/App.js
- [x] T010 Define login form UI component structure in StudentApp/components/StudentForm.js

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Authenticate Before Access (Priority: P1) 🎯 MVP

**Goal**: User can log in and is required to authenticate before add-student actions are allowed.

**Independent Test**: While logged out, add-student is blocked and redirected to login; after valid login, add-student succeeds.

### Implementation for User Story 1

- [x] T011 [US1] Implement credential validation and session creation in login.php
- [x] T012 [US1] Implement `POST /login.php` contract responses in login.php
- [x] T013 [P] [US1] Add login request client method in StudentApp/services/studentApi.js
- [x] T014 [P] [US1] Build login form state and submit handlers in StudentApp/App.js
- [x] T015 [US1] Render login-first gate before add flow in StudentApp/App.js
- [x] T016 [US1] Prevent unauthenticated add modal open in StudentApp/App.js
- [x] T017 [US1] Display invalid credential error feedback in StudentApp/utils/alerts.js
- [x] T018 [US1] Gate create endpoint with auth guard and HTTP 401 in create_student.php

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Maintain Session During Work (Priority: P2)

**Goal**: Logged-in user remains authenticated across app navigation and can log out explicitly.

**Independent Test**: After one successful login, user can navigate and keep add access until logout; after logout, add access is blocked.

### Implementation for User Story 2

- [x] T019 [US2] Implement `GET /me.php` auth status endpoint in me.php
- [x] T020 [US2] Implement `POST /logout.php` session-destroy endpoint in logout.php
- [x] T021 [P] [US2] Add me/logout client methods in StudentApp/services/studentApi.js
- [x] T022 [US2] Restore auth state on app startup via `me.php` in StudentApp/App.js
- [x] T023 [US2] Add logout action and UI controls in StudentApp/App.js
- [x] T024 [US2] Block add-student actions immediately after logout in StudentApp/App.js

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Recover from Expired Session (Priority: P3)

**Goal**: After session inactivity timeout, user is prompted to log in again before creating students.

**Independent Test**: After 60 minutes inactivity (or forced expiry), create attempt returns 401 and UI redirects to login, then resumes create flow after successful re-auth.

### Implementation for User Story 3

- [x] T025 [US3] Apply last-activity refresh and expiry checks in auth_session.php
- [x] T026 [US3] Return standardized 401 unauthorized envelope on expired session in create_student.php
- [x] T027 [P] [US3] Handle create 401 by resetting auth state in StudentApp/App.js
- [x] T028 [US3] Preserve intended add-student destination through re-login in StudentApp/App.js
- [x] T029 [US3] Show session-expired re-authentication message in StudentApp/utils/alerts.js

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and manual verification across all stories.

- [x] T030 [P] Update auth endpoint usage and setup notes in README.md
- [x] T031 [P] Update feature quickstart validation notes in specs/001-i-want-you-to-create-a-login-before-i-can-add-a-student/quickstart.md
- [ ] T032 Verify all manual scenarios and regressions from quickstart in specs/001-i-want-you-to-create-a-login-before-i-can-add-a-student/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story Phases (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational; builds on session lifecycle but remains independently testable.
- **User Story 3 (P3)**: Starts after Foundational and benefits from US1/US2 session flow; independently testable via expiry scenario.

### Within Each User Story

- Backend endpoint contract and guard behavior before frontend integration logic.
- Service-layer API calls before UI interaction handlers that consume them.
- Error/feedback handling after core success path is in place.

### Story Completion Order

US1 -> US2 -> US3

---

## Parallel Execution Examples

### User Story 1

- Run T013 and T014 in parallel (different files: StudentApp/services/studentApi.js and StudentApp/App.js).
- Run T017 and T018 in parallel (different files: StudentApp/utils/alerts.js and create_student.php).

### User Story 2

- Run T019 and T020 in parallel (different files: me.php and logout.php).
- Run T021 and T023 in parallel (different files: StudentApp/services/studentApi.js and StudentApp/App.js).

### User Story 3

- Run T027 and T029 in parallel (different files: StudentApp/App.js and StudentApp/utils/alerts.js).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate independent test for US1 before proceeding.

### Incremental Delivery

1. Deliver US1 (auth gate before add-student) as MVP.
2. Deliver US2 (session restore + logout).
3. Deliver US3 (timeout recovery + re-login continuation).
4. Finish with Phase 6 polish/documentation.

### Parallel Team Strategy

1. Team aligns on Phase 1 and 2 together.
2. After foundation completion:
   - Developer A: backend auth endpoints/guards.
   - Developer B: frontend auth service/state wiring.
   - Developer C: UX messaging and validation/polish.

---

## Notes

- [P] tasks denote different files with no direct incomplete-task dependency.
- User story labels map every story-phase task to US1/US2/US3 for traceability.
- Each story is independently testable using criteria defined in its phase section.
