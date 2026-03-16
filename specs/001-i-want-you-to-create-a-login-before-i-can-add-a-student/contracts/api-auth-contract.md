# Contract: Authentication and Create Guard

## Scope

Defines API additions and behavior changes required to enforce login before creating a student.

## Existing Endpoints (Compatibility)

- `GET /students.php`: unchanged
- `POST /update_student.php`: unchanged for this feature
- `POST /delete_student.php`: unchanged for this feature

## New Endpoints

### POST /login.php

Purpose: Authenticate user and start session.

Request Body:

```json
{
  "username": "string",
  "password": "string"
}
```

Success Response (200):

```json
{
  "status": "ok",
  "message": "Login successful."
}
```

Failure Response (401 or 400):

```json
{
  "status": "failed",
  "message": "Invalid username or password."
}
```

Notes:

- Session cookie is set by server on success.
- Supports preflight `OPTIONS` and CORS headers.

### POST /logout.php

Purpose: End current session.

Request Body: none

Success Response (200):

```json
{
  "status": "ok",
  "message": "Logged out successfully."
}
```

### GET /me.php

Purpose: Retrieve current authentication status.

Success Response (200, authenticated):

```json
{
  "status": "ok",
  "authenticated": true,
  "user": {
    "username": "admin"
  },
  "message": "Authenticated."
}
```

Unauthenticated Response (200):

```json
{
  "status": "failed",
  "authenticated": false,
  "message": "Not authenticated."
}
```

## Changed Endpoint Behavior

### POST /create_student.php

New Requirement: Request must be authenticated by valid session before create logic executes.

Unauthenticated Response (401):

```json
{
  "status": "failed",
  "message": "Unauthorized. Please log in first."
}
```

Authenticated Behavior:

- Existing create payload and success/failure response envelope remain unchanged.

## Frontend Request Contract

- Auth-related requests use `credentials: include`.
- Guarded create request uses `credentials: include`.
- Frontend should call `GET /me.php` to restore auth state on app load.
- On 401 from guarded create, frontend must route user to login and show clear message.

## Non-Goals in This Feature

- No signup/register endpoint.
- No password reset flow.
- No multi-role authorization model.
- No database user table changes.
