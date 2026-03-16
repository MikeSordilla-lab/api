# Research: Login Required Before Student Creation

## Decision 1: Authentication Mechanism

- Decision: Use PHP native session authentication with server-managed session state.
- Rationale: This is the lowest-complexity option in a thin PHP/XAMPP setup, supports immediate logout invalidation, and avoids adding token parsing logic to all endpoints.
- Alternatives considered:
  - JWT bearer tokens: rejected for this phase due to additional signing/validation complexity and weaker immediate revocation behavior.
  - Client-only gate (UI-only login): rejected because it cannot securely protect `create_student.php` from direct calls.

## Decision 2: Credential Source

- Decision: Use a single configured admin credential pair from server configuration for Phase 1 (no new user table).
- Rationale: Constitution constraints discourage new schema changes for this scope, and the requested capability is access gating before add-student, not user management.
- Alternatives considered:
  - Add `users` table: rejected for this feature scope and would require constitution/schema expansion.
  - Hardcode credentials directly in endpoint body: rejected in favor of centralized config constants for safer maintenance.

## Decision 3: Authorization Scope

- Decision: Require authentication for `create_student.php` only; leave read/update/delete behavior unchanged in this feature.
- Rationale: The request specifically states login is required before adding students. Limiting scope minimizes regression risk.
- Alternatives considered:
  - Protect all mutation endpoints now: rejected as out-of-scope expansion.
  - Protect all endpoints including read: rejected as unnecessary for stated requirement.

## Decision 4: Minimal Auth Endpoints

- Decision: Add three thin endpoints: `login.php`, `logout.php`, and `me.php`.
- Rationale: This gives a complete session lifecycle for frontend UX (sign in, sign out, restore session state) while keeping backend scripts simple.
- Alternatives considered:
  - Login-only endpoint without `me.php`: rejected because frontend would need implicit assumptions after refresh.
  - Login + logout only with local client cache: rejected because server session status still needs a verification endpoint.

## Decision 5: Unauthorized Response Contract

- Decision: Return consistent JSON envelope with `status="failed"`, clear message, and HTTP 401 for unauthorized create attempts.
- Rationale: Aligns with existing API response style while adding standard HTTP semantics for client handling.
- Alternatives considered:
  - Return HTTP 200 with failed status: rejected because it weakens transport-level error handling.
  - Return plain text unauthorized message: rejected due to contract inconsistency.

## Decision 6: Frontend Session Gating Behavior

- Decision: On app start and before create submission, check auth state via `me.php`; show login UI when unauthenticated.
- Rationale: Prevents accidental create attempts and supports clear, predictable user flow.
- Alternatives considered:
  - Check only once on app mount: rejected because session may expire later.
  - Attempt create first and react to 401 only: rejected as poorer user experience.

## Decision 7: CORS + Credential Handling

- Decision: Use credentialed fetch requests (`credentials: include`) for auth endpoints and guarded create flow, with explicit allowed origin in CORS headers.
- Rationale: Required for browser-based session cookies and consistent behavior across Expo web/mobile.
- Alternatives considered:
  - Keep wildcard CORS (`*`) with cookies: rejected because browsers block credentialed requests with wildcard origins.
  - Move to Authorization headers only: rejected since session-cookie approach is selected for simplicity.
