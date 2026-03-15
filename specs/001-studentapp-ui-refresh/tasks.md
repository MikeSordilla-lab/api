# Tasks: StudentApp Responsive UI Refresh

**Input**: Design documents from `/specs/001-studentapp-ui-refresh/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)  
**Available design docs**: plan.md, spec.md  
**Missing optional docs**: research.md, data-model.md, contracts/, quickstart.md

**Tests**: Automated test tasks are not included because the specification does not explicitly request TDD or automated test creation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies and shared utilities needed by all stories.

- [X] T001 Add SweetAlert2 and mobile alert dependency entries in StudentApp/package.json
- [X] T002 Install/update dependencies and lockfile in StudentApp/package-lock.json
- [X] T003 [P] Create cross-platform alert helper module in StudentApp/utils/alerts.js
- [X] T004 [P] Create student API service module scaffold in StudentApp/services/studentApi.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core app plumbing required before user stories.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T005 Implement list/create/update/delete API wrappers against existing PHP endpoints in StudentApp/services/studentApi.js
- [X] T006 Refactor network calls in StudentApp/App.js to use StudentApp/services/studentApi.js
- [X] T007 Add unified request state flags (initial load, refresh, submit, error) in StudentApp/App.js
- [X] T008 [P] Create reusable modal container component for Student flow in StudentApp/components/StudentModal.js
- [X] T009 Integrate alert helper usage and normalized backend status checks in StudentApp/App.js

**Checkpoint**: Foundation ready; user stories can now be implemented independently.

---

## Phase 3: User Story 1 - Add Student Through Modal (Priority: P1) 🎯 MVP

**Goal**: Users can add students via modal with success feedback while keeping edit flow intact.

**Independent Test**: Open modal from main screen, submit valid data, observe success alert, modal closes, and new student appears in list.

### Implementation for User Story 1

- [X] T010 [US1] Add header action to open add-student modal in StudentApp/App.js
- [X] T011 [US1] Mount modal workflow and modal visibility state in StudentApp/App.js and StudentApp/components/StudentModal.js
- [X] T012 [US1] Extend form props for modal submit/cancel/disabled handling in StudentApp/components/StudentForm.js
- [X] T013 [US1] Wire create-student modal submit lifecycle (submit, success alert, close, clear, refresh) in StudentApp/App.js
- [X] T014 [P] [US1] Preserve inline edit workflow and harmonize labels/actions in StudentApp/App.js and StudentApp/components/StudentForm.js
- [X] T015 [US1] Implement create-failure handling that keeps modal open and preserves input in StudentApp/App.js and StudentApp/components/StudentForm.js

**Checkpoint**: User Story 1 is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 - Responsive Usability Across Web and Mobile (Priority: P2)

**Goal**: Improve readability, spacing, and interaction quality on both narrow mobile and wide web/tablet screens.

**Independent Test**: Complete list/add/edit/delete flows on phone-size and desktop-size viewports with no horizontal overflow and clear visual hierarchy.

### Implementation for User Story 2

- [X] T016 [US2] Add width-aware responsive container/layout logic in StudentApp/App.js
- [X] T017 [P] [US2] Normalize design tokens and shared primitives in StudentApp/theme/bootstrap.js
- [X] T018 [P] [US2] Refresh card styling, touch targets, and button sizing in StudentApp/components/StudentCard.js
- [X] T019 [US2] Improve form spacing, focus treatment, and validation readability in StudentApp/components/StudentForm.js
- [X] T020 [US2] Upgrade empty/loading/error state presentation and typography scaling in StudentApp/App.js

**Checkpoint**: User Story 2 is independently usable across web and mobile form factors.

---

## Phase 5: User Story 3 - Manually Refresh Student List (Priority: P3)

**Goal**: Users can manually fetch latest backend data with visible refresh progress.

**Independent Test**: Trigger refresh from header and confirm list updates with loading feedback and duplicate refresh prevention.

### Implementation for User Story 3

- [X] T021 [US3] Add manual refresh button/control to the top bar in StudentApp/App.js
- [X] T022 [US3] Implement refresh in-flight guard, disabled state, and user-visible refresh progress in StudentApp/App.js
- [X] T023 [US3] Ensure post-mutation refresh behavior is consistent for create/update/delete flows in StudentApp/App.js

**Checkpoint**: User Story 3 is independently testable and keeps displayed data fresh.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and validation across all stories.

- [ ] T024 [P] Document modal, refresh, and cross-platform alert behavior in README.md
- [ ] T025 Create manual validation guide and scenario checklist in specs/001-studentapp-ui-refresh/quickstart.md
- [ ] T026 Remove dead code/styles and verify StudentApp-only UI changes in StudentApp/App.js, StudentApp/components/StudentForm.js, and StudentApp/components/StudentCard.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP.
- **Phase 4 (US2)**: Depends on Phase 2; can run after or alongside US1 if staffed.
- **Phase 5 (US3)**: Depends on Phase 2; can run after or alongside US1/US2 if staffed.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational completion; recommended first for MVP.
- **US2 (P2)**: Independent after foundational completion; does not require US1 completion.
- **US3 (P3)**: Independent after foundational completion; benefits from shared request-state foundation.

### Suggested Completion Order

1. Setup + Foundational
2. US1 (MVP)
3. US2
4. US3
5. Polish

---

## Parallel Execution Examples

## Parallel Example: User Story 1

```bash
Task: T012 [US1] Extend form props for modal behavior in StudentApp/components/StudentForm.js
Task: T014 [US1] Preserve inline edit workflow labels/actions in StudentApp/App.js and StudentApp/components/StudentForm.js
```

## Parallel Example: User Story 2

```bash
Task: T017 [US2] Normalize design tokens in StudentApp/theme/bootstrap.js
Task: T018 [US2] Refresh card styling in StudentApp/components/StudentCard.js
```

## Parallel Example: User Story 3

```bash
Task: T021 [US3] Add manual refresh control in StudentApp/App.js
Task: T023 [US3] Ensure post-mutation refresh consistency in StudentApp/App.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate modal add flow end-to-end on web and mobile.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver US1 (modal add + success feedback).
2. Deliver US2 (responsive visual improvements).
3. Deliver US3 (manual refresh workflow).
4. Finish with polish and documentation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After foundation:
   - Developer A: US1 tasks
   - Developer B: US2 tasks
   - Developer C: US3 tasks
3. Merge and validate each story independently before polish.

---

## Notes

- `[P]` tasks are marked only where work can proceed in parallel without depending on unfinished tasks.
- `[US1]`, `[US2]`, and `[US3]` labels map each task to a specific story for independent delivery.
- All data operations remain on existing PHP endpoints; no backend implementation tasks are included.
