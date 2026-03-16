# Feature Specification: Login Required for Student Creation

**Feature Branch**: `001-i-want-you-to-create-a-login-before-i-can-add-a-student`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: User description: "i want you to create a login before i can add a student"

## Clarifications

### Session 2026-03-15

- Q: What credential source should be used for this phase? -> A: Single configured admin credential (no new DB table).
- Q: What authentication mechanism should be used? -> A: PHP session cookie authentication.
- Q: What HTTP status should be returned for unauthenticated create attempts? -> A: HTTP 401.
- Q: Which endpoints require login in this phase? -> A: Only `create_student.php`.
- Q: What is the session timeout policy? -> A: Session expires after 60 minutes of inactivity.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authenticate Before Access (Priority: P1)

As an authorized staff member, I can log in before reaching student management actions so only authorized users can add students.

**Why this priority**: Access control is required before any protected action and is the core value of this request.

**Independent Test**: Can be fully tested by trying to access student creation while logged out, then logging in and confirming access is granted.

**Acceptance Scenarios**:

1. **Given** a user is not logged in, **When** they try to access the add-student flow, **Then** they are redirected to login and cannot create a student.
2. **Given** a user submits valid login credentials, **When** authentication succeeds, **Then** the user is marked as logged in and can access add-student functionality.
3. **Given** a user submits invalid login credentials, **When** authentication fails, **Then** the user remains logged out and sees a clear error message.

---

### User Story 2 - Maintain Session During Work (Priority: P2)

As a logged-in staff member, I remain authenticated while working so I can add students without repeatedly logging in during an active session.

**Why this priority**: A stable authenticated session improves task completion and reduces interruption in data-entry workflows.

**Independent Test**: Can be tested by logging in once, navigating through student screens, and confirming the user stays authenticated until logout or session expiration.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they navigate between student pages, **Then** their authenticated state remains active.
2. **Given** a user chooses to log out, **When** logout completes, **Then** protected student actions are blocked until they log in again.

---

### User Story 3 - Recover from Expired Session (Priority: P3)

As a staff member whose session expires, I am asked to log in again before continuing student creation so security is preserved without confusion.

**Why this priority**: Session expiry is less frequent but important for secure behavior and predictable user experience.

**Independent Test**: Can be tested by ending an authenticated session and attempting to submit a new student, then verifying re-authentication is required.

**Acceptance Scenarios**:

1. **Given** a session is expired or invalid, **When** the user attempts to add a student, **Then** the system requires login before accepting the action.

### Edge Cases

- User tries to open the add-student endpoint directly via URL while logged out.
- User refreshes the page during login submission.
- User enters empty credentials.
- User session becomes invalid between opening and submitting the add-student form.
- User logs out in one browser tab while another tab still shows the add-student page.
- API receives unauthenticated create request and must return HTTP 401 plus a clear failure message.
- User remains idle for 60 minutes and then attempts to create a student.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST require authentication before any user can access add-student actions.
- **FR-002**: System MUST provide a login flow where users can submit credentials and receive success or failure feedback.
- **FR-003**: System MUST prevent student creation requests from unauthenticated users.
- **FR-003a**: System MUST use server-managed PHP session cookies to determine authenticated state.
- **FR-004**: System MUST keep authenticated users signed in during an active session.
- **FR-005**: System MUST provide a logout action that immediately removes access to add-student functionality.
- **FR-006**: System MUST handle expired or invalid sessions by requiring re-authentication before protected actions continue.
- **FR-007**: System MUST display clear, non-technical error messaging for failed login attempts.
- **FR-008**: System MUST preserve the user's intended destination so that after successful login they can continue the student-creation task.
- **FR-009**: System MUST return HTTP 401 with a failed-status JSON response when an unauthenticated request attempts student creation.
- **FR-010**: In this phase, authentication enforcement applies only to student creation (`create_student.php`); read, update, and delete endpoint auth changes are out of scope.
- **FR-011**: Authenticated sessions MUST expire after 60 minutes of inactivity and require login again before student creation.

### Key Entities _(include if feature involves data)_

- **User Account**: Represents a configured admin account allowed to access protected student management actions in this phase.
- **Authenticated Session**: Represents a time-bound logged-in state tied to a user account and used to authorize protected actions.
- **Access Attempt**: Represents a user request to reach protected resources and its outcome (allowed or denied).

## Assumptions

- The feature applies to users who add students through the existing student management interface.
- A standard username-and-password login uses one configured admin credential for this phase.
- Session cookie authentication is the required mechanism for this phase.
- Session timeout is 60 minutes of inactivity.
- Role differentiation beyond "authorized to add students" is out of scope for this request.
- Authentication hardening for update/delete/read endpoints is deferred to a future phase.
- Existing student creation behavior remains unchanged after authentication is satisfied.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated attempts to access add-student functionality are blocked.
- **SC-002**: At least 95% of authorized users successfully log in and reach add-student in under 60 seconds on first attempt.
- **SC-003**: At least 90% of failed login attempts result in users understanding what to do next, measured through usability testing or support feedback.
- **SC-004**: At least 95% of users who log out are unable to access add-student actions without logging in again.
- **SC-005**: 100% of sessions idle for 60 minutes require re-authentication before add-student requests are accepted.
