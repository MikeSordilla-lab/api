# Implementation Plan: Bootstrap UI Redesign

**Branch**: `001-bootstrap-ui-redesign` | **Date**: 2026-03-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-bootstrap-ui-redesign/spec.md`
**Constitution**: `.specify/memory/constitution.md` v1.0.0

## Summary

Replace all custom `StyleSheet` rules in `StudentApp/App.js` with Bootstrap 5
design-token equivalents, giving the app Bootstrap's visual language (primary
blue, danger red, card shadows, focus rings) without adding new runtime
dependencies. A thin `theme/bootstrap.js` constants file captures Bootstrap 5's
design tokens; the main component becomes cleaner and purely declarative. PHP
backend is untouched throughout.

## Technical Context

**Language/Version**: JavaScript (React 19.2.0) / React Native 0.83.2 / Expo SDK ~55.0.4  
**Primary Dependencies**: expo ~55.0.4, react-native 0.83.2, react-native-web ^0.21.0 — no new dependencies required  
**Storage**: N/A for this feature (data layer unchanged: MySQL via XAMPP, PHP 8+, port 3307)  
**Testing**: Manual visual testing via Expo Go (Android/iOS) and `expo start --web` (browser)  
**Target Platform**: Android + iOS + Web (react-native-web already installed)  
**Project Type**: Mobile app (Expo managed workflow, single-screen CRUD)  
**Performance Goals**: 60 fps scroll on the student list; UI tap response < 100ms  
**Constraints**: React 19 compatibility (rules out most RN UI component libs); zero new npm dependencies; `StyleSheet` remains the styling API; single-source `BASE_URL`  
**Scale/Scope**: 1 screen, 4 CRUD operations, 1 form, 1 list

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                    | Check                                                                        | Result  |
| ---------------------------- | ---------------------------------------------------------------------------- | ------- |
| I — Minimal PHP Backend      | No PHP files modified                                                        | ✅ PASS |
| II — React Native Frontend   | Only App.js UI layer changes; hooks, BASE_URL, Alert.alert all preserved     | ✅ PASS |
| III — Stable Database Schema | No schema changes; last_update and ratings handling unchanged                | ✅ PASS |
| IV — Simple CRUD             | Pure UI redesign; no new operations or tables                                | ✅ PASS |
| V — Input Validation         | Frontend validation preserved and strengthened; backend validation unchanged | ✅ PASS |

**Gate status**: ✅ All principles satisfied — proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-bootstrap-ui-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-endpoints.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created by /speckit.plan)
```

### Source Code

```text
StudentApp/
├── App.js                   # Main component — replace StyleSheet with Bootstrap theme
├── theme/
│   └── bootstrap.js         # Bootstrap 5 design tokens (colors, spacing, radius, shadow)
├── components/
│   ├── StudentCard.js        # Bootstrap card row with Edit/Delete buttons
│   └── StudentForm.js        # Bootstrap form with inputs and submit/cancel buttons
├── app.json
├── index.js
└── package.json             # No new dependencies added

api/                         # PHP backend — NOT modified
├── students.php
├── create_student.php
├── update_student.php
├── delete_student.php
└── db.php
```

**Structure Decision**: Mobile + API layout. The React Native app gains a
`theme/` folder for Bootstrap design tokens and a `components/` folder for
extracted Bootstrap-styled primitives. The PHP `api/` layer is read-only for
this feature.

## Constitution Check (Post-Design)

_Re-checked after Phase 1._

| Principle                    | Post-Design Status                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| I — Minimal PHP Backend      | ✅ No PHP changes in scope                                                                                         |
| II — React Native Frontend   | ✅ hooks preserved; no state library added; Alert.alert preserved; BASE_URL unchanged                              |
| III — Stable Database Schema | ✅ No schema changes                                                                                               |
| IV — Simple CRUD             | ✅ Only styling; no new business logic; complexity justified by Bootstrap token extraction (single constants file) |
| V — Input Validation         | ✅ Validation logic preserved verbatim                                                                             |

## Complexity Tracking

No constitution violations to justify. The `theme/bootstrap.js` extraction adds
one file but reduces complexity in App.js — net zero or net reduction in total
lines. Component extraction follows React best practices and is within scope of
Principle IV (minimal business logic) since components carry only presentation
logic.

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
