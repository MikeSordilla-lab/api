# Contract: UI-API and Interaction Contract

## Scope

Defines frontend interaction expectations and confirms backend API contract remains unchanged.

## Backend API Contract (Unchanged)

Base URL: configured in frontend runtime config.

Endpoints:

- `GET /students.php`
- `POST /create_student.php`
- `POST /update_student.php`
- `POST /delete_student.php`

Response Envelope:

- mutation responses include:
  - `status`: `ok | failed`
  - `message`: string
- list response remains array of student records

Compatibility Requirement:

- No endpoint shape or payload key changes are introduced by this feature.

## Frontend Interaction Contract

### Loading and Retry

- During initial or refresh loads, list area must render loading indicator/skeleton state.
- On fetch failure, retry action must be available in-context.

### Empty State

- If visible list is empty and not loading, empty-state CTA must open Add Student modal.

### Search and Sort

- Search filters current loaded list client-side.
- Sort applies deterministic order over currently loaded list.
- Search + sort must be composable.

### Modal Guard

- Closing add/edit modal with dirty form state must prompt discard confirmation.
- Confirm discard closes modal and resets form state.
- Cancel discard keeps modal open with intact values.

### Optimistic Mutations

- Create/update/delete may update list immediately.
- On backend failure, list must rollback to last consistent state and show error feedback.

### Accessibility

- Critical controls must expose accessibility labels:
  - add, edit, delete, refresh, retry, submit, cancel, close modal
- Focus-visible style must be present for interactive controls where supported.
