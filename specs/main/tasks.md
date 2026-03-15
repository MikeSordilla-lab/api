# Tasks: StudentApp UX Polish and Reliability Enhancements

**Input**: Design documents from `/specs/main/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Automated test tasks are not included because the specification does not explicitly request TDD or automated test creation.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare configuration and shared UI infrastructure for all stories.

- [x] T001 Add runtime API configuration keys for web/mobile environments in StudentApp/app.json
- [x] T002 Create centralized client config accessor for API base URL in StudentApp/utils/config.js
- [x] T003 [P] Add shared icon mapping and naming constants for action consistency in StudentApp/utils/icons.js
- [x] T004 [P] Add reusable skeleton style tokens and highlight animation values in StudentApp/theme/bootstrap.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core state and interaction plumbing required before story implementation.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [x] T005 Refactor student API service to consume externalized base URL config in StudentApp/services/studentApi.js
- [x] T006 Implement optimistic mutation helper with rollback support in StudentApp/utils/optimisticUpdates.js
- [x] T007 Integrate optimistic update pipeline hooks into CRUD flow orchestration in StudentApp/App.js
- [x] T008 [P] Add unified accessibility label helpers for critical controls in StudentApp/utils/accessibility.js
- [x] T009 [P] Add shared focus-visible style utilities for actionable components in StudentApp/theme/bootstrap.js

**Checkpoint**: Foundation complete; user stories can now be delivered independently.

---

## Phase 3: User Story 1 - Improve Feedback and Discoverability (Priority: P1) 🎯 MVP

**Goal**: Users quickly understand loading, empty, retry, and mutation-result states.

**Independent Test**: Trigger empty, loading, and fetch-failure states, then perform create/update and verify CTA, skeleton, retry, and row highlight behaviors.

### Implementation for User Story 1

- [x] T010 [US1] Add empty-state CTA button that opens add-student modal in StudentApp/App.js
- [x] T011 [US1] Implement list skeleton placeholders for initial and refresh loading states in StudentApp/App.js
- [x] T012 [US1] Add in-context retry UI and retry handler for fetch failures in StudentApp/App.js
- [x] T013 [US1] Add transient row highlight state after create/update success in StudentApp/App.js
- [x] T014 [P] [US1] Apply row highlight visual treatment in student row rendering styles in StudentApp/components/StudentCard.js
- [x] T015 [US1] Ensure loading/retry/empty states do not regress add/edit/delete flows in StudentApp/App.js

**Checkpoint**: User Story 1 is independently functional and demonstrable.

---

## Phase 4: User Story 2 - Improve Accessibility and Interaction Consistency (Priority: P2)

**Goal**: Critical interactions are accessible, focus-visible, and icon/label consistent.

**Independent Test**: Navigate with keyboard/focus traversal and assistive labels to perform add/edit/delete/refresh actions on web and mobile.

### Implementation for User Story 2

- [x] T016 [US2] Add accessibility labels/hints to critical top-bar and modal controls in StudentApp/App.js
- [x] T017 [P] [US2] Add accessibility labels/hints to form controls and submit/cancel actions in StudentApp/components/StudentForm.js
- [x] T018 [P] [US2] Add accessibility labels/hints to edit/delete row actions in StudentApp/components/StudentCard.js
- [x] T019 [US2] Apply focus-visible style utilities to interactive controls for supported platforms in StudentApp/App.js
- [x] T020 [US2] Standardize iconography and action copy across list cards, headers, and modals in StudentApp/App.js and StudentApp/components/StudentCard.js

**Checkpoint**: User Story 2 is independently usable and accessibility-improved.

---

## Phase 5: User Story 3 - Improve Data Navigation and Guardrails (Priority: P3)

**Goal**: Users can find data faster and avoid accidental loss while editing.

**Independent Test**: Use search/sort and pull-to-refresh, then attempt modal close with unsaved values to verify guard behavior.

### Implementation for User Story 3

- [x] T021 [US3] Add client-side search input and query state for student list in StudentApp/App.js
- [x] T022 [US3] Add sort control state and deterministic sort application in StudentApp/App.js
- [x] T023 [US3] Integrate search+sort pipeline into displayed list computation in StudentApp/App.js
- [x] T024 [US3] Add mobile pull-to-refresh integration for student list in StudentApp/App.js
- [x] T025 [US3] Implement dirty-form detection and unsaved-changes confirm prompt for add modal in StudentApp/App.js and StudentApp/components/StudentModal.js
- [x] T026 [US3] Implement dirty-form detection and unsaved-changes confirm prompt for edit modal in StudentApp/App.js and StudentApp/components/StudentModal.js

**Checkpoint**: User Story 3 is independently functional and protects user input.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and release validation.

- [x] T027 [P] Update user/developer notes for new UX capabilities and config behavior in README.md
- [x] T028 [P] Document API config setup and environment switching guidance in StudentApp/README.md
- [x] T029 Validate complete manual scenario checklist and results in specs/main/quickstart.md
- [x] T030 Final cleanup/refactor pass to remove dead branches and duplicate state logic in StudentApp/App.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; recommended MVP slice.
- **Phase 4 (US2)**: Depends on Phase 2; can run in parallel with US1 if staffed.
- **Phase 5 (US3)**: Depends on Phase 2; can run in parallel with US1/US2 if staffed.
- **Phase 6 (Polish)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational work; no dependency on other stories.
- **US2 (P2)**: Independent after foundational work; can ship separately.
- **US3 (P3)**: Independent after foundational work; can ship separately.

### Suggested Completion Order

1. Phase 1 + Phase 2
2. Phase 3 (US1 MVP)
3. Phase 4 (US2)
4. Phase 5 (US3)
5. Phase 6 (Polish)

---

## Parallel Execution Examples

## Parallel Example: User Story 1

```bash
Task: T013 [US1] Add transient row highlight state in StudentApp/App.js
Task: T014 [US1] Apply row highlight styles in StudentApp/components/StudentCard.js
```

## Parallel Example: User Story 2

```bash
Task: T017 [US2] Add accessibility labels in StudentApp/components/StudentForm.js
Task: T018 [US2] Add accessibility labels in StudentApp/components/StudentCard.js
```

## Parallel Example: User Story 3

```bash
Task: T021 [US3] Add search query state in StudentApp/App.js
Task: T024 [US3] Add pull-to-refresh integration in StudentApp/App.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate feedback/discoverability flows independently.
4. Ship/demo MVP.

### Incremental Delivery

1. Deliver US1 (feedback and discoverability).
2. Deliver US2 (accessibility and consistency).
3. Deliver US3 (search/sort/pull-to-refresh/guardrails).
4. Finalize cross-cutting polish and documentation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After Phase 2:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3
3. Merge per-story with independent validation before polish.

---

## Notes

- `[P]` tasks indicate no dependency on unfinished tasks in different files.
- Story labels map each task to one independently testable user story.
- Backend PHP files remain unchanged by design for this feature.
