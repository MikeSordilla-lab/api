<!--
SYNC IMPACT REPORT
==================
Version change: (new) → 1.0.0
Added sections:
  - Core Principles (I–V defined)
  - Technology Stack
  - Development Workflow
  - Governance
Templates reviewed:
  - .specify/templates/plan-template.md         ✅ aligned (Mobile + API structure applies)
  - .specify/templates/spec-template.md         ✅ aligned (CRUD user stories pattern applies)
  - .specify/templates/tasks-template.md        ✅ aligned (Phase 2 foundational DB tasks apply)
Deferred TODOs: None
-->

# StudentApp Constitution

## Core Principles

### I. Minimal PHP Backend (NON-NEGOTIABLE)

The PHP files (`create_student.php`, `update_student.php`, `delete_student.php`,
`students.php`, `db.php`) MUST remain thin REST API endpoint scripts.

- Each PHP file MUST handle exactly one resource operation (create, read, update, delete).
- PHP files MUST NOT be refactored into classes or frameworks unless explicitly required.
- All PHP endpoints MUST return JSON with a consistent `status`/`message` envelope.
- All database queries MUST use prepared statements (`$stmt->bind_param`) to prevent
  SQL injection.
- CORS headers MUST be set on every PHP endpoint to allow the React Native client.

### II. React Native Frontend

All user interface logic MUST reside in the `StudentApp/` React Native project.

- State management MUST use React hooks (`useState`, `useEffect`); no external
  state libraries unless a feature explicitly demands it.
- All API calls MUST go through `fetch` targeting the `BASE_URL` constant defined
  in `App.js`; the base URL MUST be the only place the server address is configured.
- UI feedback for every async operation (create, update, delete) MUST be delivered
  via `Alert.alert` with the server's `status` and `message` values.

### III. Stable Database Schema

The MySQL `student` database and `student_list` table are the single source of truth.

- Schema changes MUST be backward compatible (add columns; do not rename or drop
  without a migration plan).
- The `last_update` timestamp MUST be maintained by the PHP backend on every
  write operation.
- `ratings` MUST be stored as an integer; the frontend MUST parse it with
  `parseInt` before sending.

### IV. Simple CRUD Operations

Every feature MUST map directly to one of: Create, Read, Update, or Delete on the
`student_list` table.

- New features MUST NOT introduce additional database tables without updating this
  constitution first.
- Business logic MUST stay minimal: validate input, execute query, return result.
- No caching layers or background jobs MUST be introduced without explicit approval.

### V. Input Validation

Both layers MUST validate before any database operation is attempted.

- **Frontend**: All form fields (firstname, lastname, ratings) MUST be checked for
  non-empty values before the request is sent; `ratings` MUST parse to a valid integer.
- **Backend**: PHP endpoints MUST check that decoded JSON is not `null`/empty and
  that required fields are present; missing or null IDs MUST return a `failed` status
  immediately.

## Technology Stack

This project uses a fixed, local-first stack running on XAMPP:

| Layer    | Technology                   | Notes                                   |
| -------- | ---------------------------- | --------------------------------------- |
| Frontend | React Native (Expo)          | Single-file `App.js` component          |
| Backend  | PHP 8+ scripts               | Plain scripts, no MVC framework         |
| Database | MySQL via XAMPP              | Port 3307, database `student`           |
| Server   | Apache via XAMPP (localhost) | `htdocs/api/` serves PHP endpoints      |
| Dev OS   | Windows (XAMPP)              | Paths and port config are Windows-local |

No external backend frameworks (Laravel, Slim, etc.) MUST be introduced without
amending this constitution.

## Development Workflow

1. **Backend changes**: Edit PHP files in `c:\xampp\htdocs\api\`; changes take effect
   immediately (no build step). Validate by calling the endpoint directly.
2. **Frontend changes**: Run the Expo dev server from `StudentApp/` (`npx expo start`);
   test on a device/emulator connected to the same LAN as the XAMPP server.
3. **Database changes**: Apply via phpMyAdmin or MySQL CLI; document any schema change
   as a comment at the top of `db.php`.
4. **Feature additions**: Follow spec → plan → tasks workflow using speckit commands
   before writing code.
5. **Code review gate**: Every change MUST satisfy all five Core Principles before
   being considered complete.

## Governance

This constitution supersedes all other development practices for the StudentApp project.

- Amendments require updating this file with an incremented version, a rationale
  comment, and a new `Last Amended` date.
- **Versioning policy**:
  - MAJOR: Principle removed or fundamentally redefined; tech stack replacement.
  - MINOR: New principle or section added; new mandatory constraint introduced.
  - PATCH: Wording clarification, typo fix, non-semantic refinement.
- All speckit plan/spec/task documents MUST reference this constitution version.
- Complexity MUST be justified against the Simplicity clause of Principle IV before
  any non-CRUD feature is approved.

**Version**: 1.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08
