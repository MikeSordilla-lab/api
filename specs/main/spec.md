# Feature Specification: StudentApp UX Polish and Reliability Enhancements

**Feature Branch**: `main`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: User description: "Extends T020 (empty-state CTA, skeletons, retry state, row highlight), extends T026 (accessibility labels, focus states, icon consistency cleanup), add Phase 6 tasks (search/sort, pull-to-refresh, unsaved changes guard), and add API config externalization + optimistic update strategy"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Improve Feedback and Discoverability (Priority: P1)

As a student-management user, I can understand system state quickly through stronger loading, empty, retry, and action-result feedback.

**Why this priority**: Better visibility of system state directly reduces user confusion and failed task attempts.

**Independent Test**: Trigger empty list, loading, and error conditions, then confirm CTA/retry/skeleton/row highlight behaviors appear correctly without affecting CRUD correctness.

**Acceptance Scenarios**:

1. **Given** there are no students, **When** I open the list, **Then** I see a clear empty state with a direct action to add a student.
2. **Given** data is loading, **When** the list renders, **Then** skeleton placeholders appear until data is ready.
3. **Given** loading fails, **When** the error is shown, **Then** I can retry from the same screen without restarting the app.
4. **Given** I add or update a student, **When** the list refreshes, **Then** the affected row is visually highlighted briefly.

---

### User Story 2 - Improve Accessibility and Interaction Consistency (Priority: P2)

As a keyboard, screen-reader, or touch user, I can operate all major actions consistently and confidently on web and mobile.

**Why this priority**: Accessibility and consistency improve task completion for all users and reduce usability regressions across platforms.

**Independent Test**: Navigate and operate add/edit/delete/refresh using accessibility labels and visible focus states; verify icon usage and action meanings remain consistent across screens.

**Acceptance Scenarios**:

1. **Given** I use assistive technology, **When** I focus actionable controls, **Then** each control has meaningful accessibility labels.
2. **Given** I navigate via keyboard or focus traversal, **When** focus changes, **Then** focus states are clearly visible and consistent.
3. **Given** I compare action affordances across list and modal views, **When** actions are shown, **Then** iconography and labels are consistent.

---

### User Story 3 - Improve Data Navigation and Guardrails (Priority: P3)

As a user managing many students, I can quickly find records, refresh naturally on mobile, and avoid accidental data loss while editing.

**Why this priority**: Search/sort and guardrails improve speed and trust for repeated daily workflows.

**Independent Test**: Apply search and sort, perform pull-to-refresh on mobile, and try closing dirty forms to verify unsaved-change confirmation behavior.

**Acceptance Scenarios**:

1. **Given** many students are listed, **When** I search or sort, **Then** matching and ordering updates immediately and predictably.
2. **Given** I use mobile, **When** I pull down on the list, **Then** refresh starts and completion feedback is visible.
3. **Given** I have unsaved changes in add/edit modal, **When** I attempt to close it, **Then** I receive a confirmation prompt before data is discarded.

---

### Edge Cases

- Retry action is triggered repeatedly while a request is already in progress.
- Search query yields zero matches while list data exists.
- Sort criteria changes while a refresh is active.
- Highlighted row is deleted shortly after update/create.
- Unsaved-changes guard appears when form values are only whitespace.
- Optimistic UI update fails due to backend error and must rollback cleanly.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide an empty-state call-to-action that opens the add-student flow.
- **FR-002**: The system MUST display list skeleton placeholders during loading states.
- **FR-003**: The system MUST provide an in-place retry action when student list loading fails.
- **FR-004**: The system MUST visually highlight newly added or updated student rows for a short duration.
- **FR-005**: The system MUST provide accessibility labels for all primary and destructive actions.
- **FR-006**: The system MUST provide clear visible focus states for interactive controls on supported platforms.
- **FR-007**: The system MUST use consistent action iconography and wording across list and modal experiences.
- **FR-008**: The system MUST support client-side search and sort for student records.
- **FR-009**: The system MUST support pull-to-refresh behavior on mobile list screens.
- **FR-010**: The system MUST warn users before closing add/edit modals when unsaved changes exist.
- **FR-011**: The system MUST externalize API base configuration from hardcoded source constants.
- **FR-012**: The system MUST support optimistic UI updates for create/update/delete with rollback on failure.
- **FR-013**: The system MUST preserve existing PHP endpoint contracts and keep backend scripts unchanged.

### Key Entities _(include if feature involves data)_

- **Student List View Model**: UI projection of student records plus loading/error/retry/skeleton/refresh states.
- **Search and Sort Criteria**: User-selected query and ordering rules applied to visible student results.
- **Dirty Form State**: Tracks whether add/edit modal has unsaved changes requiring confirmation on close.
- **Optimistic Mutation Record**: Temporary local mutation entry used to update UI before backend confirmation and rollback if failed.
- **Accessibility Metadata**: Labels/hints/roles attached to interactive controls for assistive technologies.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At least 95% of users can identify how to add the first student within 5 seconds on the empty screen.
- **SC-002**: At least 95% of load failures can be recovered by retry without restarting the app.
- **SC-003**: At least 90% of users can find a student using search in under 10 seconds on lists with 50+ items.
- **SC-004**: At least 95% of modal close attempts with unsaved changes correctly present confirmation before data loss.
- **SC-005**: At least 99% of optimistic updates either persist successfully or rollback to a consistent list state.
- **SC-006**: Accessibility audit finds labels/focus visibility coverage on all critical controls (add, edit, delete, refresh, submit, cancel).
