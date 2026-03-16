# Data Model: Login Required Before Student Creation

## Entity: AuthCredentialInput

Represents login credentials submitted by the user.

Fields:

- `username`: string
- `password`: string

Validation Rules:

- Both fields are required and must be non-empty after trim.
- Empty or missing values return validation failure before authentication check.

State Transitions:

- draft -> submitted -> accepted | rejected

## Entity: AuthSession

Represents authenticated server-side session state.

Fields:

- `sessionId`: server-managed identifier (opaque to client)
- `isAuthenticated`: boolean
- `username`: string
- `createdAt`: timestamp
- `expiresAt`: timestamp

Validation Rules:

- `isAuthenticated` must be true only after successful credential verification.
- Expired or destroyed sessions must be treated as unauthenticated.

State Transitions:

- unauthenticated -> authenticated (login success)
- authenticated -> unauthenticated (logout)
- authenticated -> expired (timeout)
- expired -> authenticated (re-login)

## Entity: AuthStatusResponse

Represents frontend-consumable auth state from `me.php`.

Fields:

- `status`: `ok | failed`
- `authenticated`: boolean
- `user`: optional object with `username`
- `message`: string

Validation Rules:

- `authenticated=false` response must not include sensitive credential details.
- `status` and `message` are always present.

State Transitions:

- unknown -> authenticated | unauthenticated

## Entity: CreateStudentRequest (Guarded)

Represents create student payload when authorization is required.

Fields:

- `firstname`: string
- `lastname`: string
- `ratings`: integer

Validation Rules:

- Requires valid authenticated session before processing payload.
- Existing student field validation remains unchanged.

State Transitions:

- blocked (unauthenticated) -> rejected with 401
- allowed (authenticated) -> create success | create failure

## Entity: AccessAttempt

Represents an attempt to use protected create capability.

Fields:

- `endpoint`: `create_student.php`
- `authenticated`: boolean
- `outcome`: `allowed | denied`
- `reason`: string
- `timestamp`: datetime

Validation Rules:

- `outcome=denied` must map to an explicit message for UI handling.
- `reason` must not expose secret values.

State Transitions:

- requested -> denied (no/expired session)
- requested -> allowed -> completed
