# API Endpoint Contracts

**Feature**: `001-bootstrap-ui-redesign`  
**Provider**: PHP backend (`c:\xampp\htdocs\api\`)  
**Consumer**: React Native app (`StudentApp/App.js`)  
**Base URL**: `http://<LAN_IP>/api` (configured via `BASE_URL` constant in `App.js`)

> These endpoints are **read-only contracts** for this feature — no PHP backend
> changes are made. The redesign must not break any of these contracts.

---

## GET /students.php

**Purpose**: Fetch all students for the list view.

**Request**:

- Method: `GET`
- Headers: none required
- Body: none

**Response** (success):

```json
[
  {
    "id": "1",
    "firstname": "John",
    "lastname": "Doe",
    "ratings": "95",
    "last_update": "2026-03-08 10:00:00"
  }
]
```

**Response** (error):

```json
{ "status": "failed", "message": "Query failed." }
```

**HTTP Status**: Always 200 (status conveyed in body).

**Consumer usage**: Called on mount via `useEffect` and after every successful
create/update/delete to refresh the list.

---

## POST /create_student.php

**Purpose**: Insert a new student record.

**Request**:

- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "ratings": 88
}
```

**Validation (backend)**:

- Body must decode to a non-null object
- `firstname`, `lastname`, `ratings` must all be present

**Response** (success):

```json
{ "status": "ok", "message": "New student has been created." }
```

**Response** (error):

```json
{ "status": "failed", "message": "Error creating student." }
```

**Consumer usage**: Triggered by "Add Student" button tap after frontend validation
passes. Response `status`/`message` displayed via `Alert.alert`.

---

## POST /update_student.php

**Purpose**: Update an existing student's fields.

**Request**:

- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "id": 1,
  "firstname": "Jane",
  "lastname": "Smith",
  "ratings": 90
}
```

**Validation (backend)**:

- Body must decode to a non-null object
- All four fields (`id`, `firstname`, `lastname`, `ratings`) must be present

**Response** (success):

```json
{ "status": "ok", "message": "Student's information has been updated." }
```

**Response** (error):

```json
{ "status": "failed", "message": "Error updating student." }
```

**Consumer usage**: Triggered by "Update Student" button tap when `editingId` is
non-null. Response displayed via `Alert.alert`.

---

## POST /delete_student.php

**Purpose**: Delete a student record permanently.

**Request**:

- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:

```json
{ "id": 1 }
```

**Validation (backend)**:

- `id` must be non-null

**Response** (success):

```json
{ "status": "ok", "message": "Student information has been deleted." }
```

**Response** (error/invalid id)\*\*:

```json
{ "status": "failed", "message": "Invalid ID." }
```

**Consumer usage**: Triggered after the user confirms the delete confirmation
dialog. Response displayed via `Alert.alert`.

---

## Contract Invariants

All endpoints share these invariants that the React Native app MUST respect:

1. **Always POST with `Content-Type: application/json`** for write operations.
2. **Response envelope**: every mutation response has `status` (`"ok"` or
   `"failed"`) and `message` (human-readable string). Display both via
   `Alert.alert(data.status, data.message)`.
3. **`ratings` sent as integer** (use `parseInt` before JSON serialisation).
4. **CORS**: All endpoints allow `*` origin — no auth headers needed.
5. **HTTP only** (not HTTPS) — `app.json` `usesCleartextTraffic: true` already
   configured for Android.
