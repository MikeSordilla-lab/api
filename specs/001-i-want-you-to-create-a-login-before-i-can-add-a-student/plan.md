# Implementation Plan: Login Required Before Student Creation

**Branch**: `001-i-want-you-to-create-a-login-before-i-can-add-a-student` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i-want-you-to-create-a-login-before-i-can-add-a-student/spec.md`

## Summary

Add a lightweight authentication layer so users must log in before they can add a student, while preserving the existing thin PHP CRUD API style. The selected approach is PHP session-based authentication with minimal new endpoints (`login.php`, `logout.php`, `me.php`) and authorization gating in `create_student.php`, plus a React Native login gate in `StudentApp/`.

## Technical Context

**Language/Version**: PHP 8+ scripts on XAMPP, JavaScript with React 19 / React Native 0.79 / Expo SDK 54  
**Primary Dependencies**: Native PHP sessions, MySQLi, Expo/React Native, existing frontend `fetch` service layer  
**Storage**: MySQL (`student.student_list`) for student data; PHP session storage for auth state; no new DB tables  
**Testing**: Manual end-to-end validation (Expo web/mobile + direct endpoint checks), regression on existing CRUD endpoints  
**Target Platform**: Local Apache/PHP on Windows (XAMPP) + Expo web/Android/iOS clients  
**Project Type**: Mobile + web frontend application with thin PHP API backend  
**Performance Goals**: Login status check resolves in under 1 second on local network; add-student guard adds negligible latency (<100ms local)  
**Constraints**: Keep backend scripts thin, preserve JSON response envelope, avoid new schema/tables, keep existing read/update/delete behavior unchanged unless later required  
**Scale/Scope**: Single-tenant local app usage (small team/classroom), one authentication gate for add-student flow

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Design Gate Review (Constitution v1.0.0)

- Principle I (Minimal PHP Backend): PASS. New auth endpoints remain thin scripts and retain JSON status/message envelope.
- Principle II (React Native Frontend): PASS. Login UI/state is implemented in `StudentApp/` and API calls remain through frontend services.
- Principle III (Stable Database Schema): PASS. No schema changes; no table additions.
- Principle IV (Simple CRUD Operations): PASS with note. Feature gates the existing Create flow and does not add non-CRUD business processing.
- Principle V (Input Validation): PASS. Login payload and create payload validation are both required.

Gate Decision: **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/001-i-want-you-to-create-a-login-before-i-can-add-a-student/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-auth-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
PHP API (repository root):
├── db.php
├── students.php
├── create_student.php
├── update_student.php
├── delete_student.php
├── login.php          # new
├── logout.php         # new
└── me.php             # new

StudentApp/
├── App.js
├── services/
│   └── studentApi.js
├── utils/
│   ├── config.js
│   └── alerts.js
└── components/
    ├── StudentForm.js
    └── StudentModal.js
```

**Structure Decision**: Keep the existing dual-structure architecture (thin PHP endpoint scripts + Expo React Native app). Add only minimal auth-specific files and service functions; no framework migration or directory reshaping.

## Phase 0: Research Summary

Research decisions are captured in [research.md](./research.md) covering:

- session-based auth vs token alternatives for this local XAMPP architecture
- endpoint contract shape for login/logout/me + unauthorized responses
- frontend gating and session revalidation behavior before create-student
- CORS and credential handling for Expo/web clients

## Phase 1: Design Outputs

- Data model: [data-model.md](./data-model.md)
- Contract: [contracts/api-auth-contract.md](./contracts/api-auth-contract.md)
- Validation guide: [quickstart.md](./quickstart.md)

### Post-Design Constitution Re-Check

- Principle I: PASS (auth logic remains minimal and script-based).
- Principle II: PASS (frontend remains source of UI/state and uses centralized API access).
- Principle III: PASS (no database schema changes).
- Principle IV: PASS (scope remains a guard around existing Create operation).
- Principle V: PASS (both auth and student creation input validation are explicit in contract/model).

Gate Decision after design: **PASS**

## Complexity Tracking

No constitution violations requiring justification.
