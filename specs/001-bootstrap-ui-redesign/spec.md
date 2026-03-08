# Feature Specification: Bootstrap UI Redesign

**Feature Branch**: `001-bootstrap-ui-redesign`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "i want you to change the design make it that it uses boostrap css and it uses component that is bootstrap and remove custom css if needed and also make the design simple and intuative make the ui/ux good for a user"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View and Navigate the Student List (Priority: P1)

A user opens the app and immediately sees a clean, well-structured list of all students with their first name, last name, and rating clearly visible. Each row has clear Edit and Delete action buttons styled consistently.

**Why this priority**: The student list is the central screen; all other actions (add, edit, delete) live on or around it. Without a readable list, no other feature is usable.

**Independent Test**: Open the app against the live backend — a table/list of students should display immediately with names and ratings readable at a glance. Edit and Delete buttons must be visually distinct from each other.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the student list screen appears, **Then** all students are displayed in a structured list with firstname, lastname, and ratings visible per row.
2. **Given** the list is populated, **When** the user scans the screen, **Then** Edit and Delete actions are visible on each row and visually distinguishable (e.g. different colors/icons).
3. **Given** no students exist, **When** the list renders, **Then** a clear empty-state message is shown (e.g. "No students yet. Add one above.").

---

### User Story 2 - Add a New Student via Form (Priority: P2)

A user fills in the First Name, Last Name, and Ratings fields using Bootstrap-styled form controls and taps a clearly labelled primary button to submit. Success or error feedback is presented immediately without navigating away.

**Why this priority**: Adding students is the most frequent write operation. Bootstrap form controls must look polished and provide clear visual states (focus, error, disabled).

**Independent Test**: Clear all fields, type valid values, tap "Add Student" — the new entry should appear in the list and the form should reset, all without a page reload.

**Acceptance Scenarios**:

1. **Given** all three fields are filled, **When** the user taps "Add Student", **Then** the student is added and the form clears.
2. **Given** one or more fields are empty, **When** the user taps "Add Student", **Then** a visible validation message appears and no network request is made.
3. **Given** a successful add, **When** the feedback is shown, **Then** the feedback message uses a visually distinct success style (e.g. green/toast/alert-success).

---

### User Story 3 - Edit an Existing Student (Priority: P3)

A user taps Edit on a student row; the form at the top pre-fills with that student's data and the submit button changes label to "Update Student". A visible Cancel button lets the user abort without changes.

**Why this priority**: Editing is the second most common write action; the in-place edit pattern (re-using the same form) must be visually clear so users know they are in edit mode.

**Independent Test**: Tap Edit on any row — fields populate, button label changes to "Update Student", a Cancel button appears. Submit saves changes; Cancel discards them.

**Acceptance Scenarios**:

1. **Given** the user taps Edit, **When** the form populates, **Then** first name, last name, and ratings fields contain the selected student's values.
2. **Given** the form is in edit mode, **When** the user taps "Update Student", **Then** the student record is updated and the form resets to "add" mode.
3. **Given** the form is in edit mode, **When** the user taps "Cancel", **Then** all fields clear and the form returns to "add" mode with no changes persisted.
4. **Given** the form is in edit mode, **When** fields are left blank, **Then** the same validation rules as add mode apply.

---

### User Story 4 - Delete a Student with Confirmation (Priority: P4)

A user taps Delete on a student row; a confirmation prompt appears before the record is permanently removed. After deletion the list refreshes automatically.

**Why this priority**: Accidental deletion without confirmation is a common UX problem. Confirmation is a safety net that protects data.

**Independent Test**: Tap Delete on any row — a confirmation dialog must appear. Confirming removes the record from the list; cancelling leaves it intact.

**Acceptance Scenarios**:

1. **Given** the user taps Delete, **When** the confirmation prompt appears, **Then** the prompt identifies which student will be deleted.
2. **Given** the user confirms deletion, **When** the backend responds with success, **Then** the row is removed from the list and a brief success message is shown.
3. **Given** the user cancels the deletion prompt, **When** the list re-renders, **Then** the student record remains in the list unchanged.

---

### Edge Cases

- What happens when the network is unreachable when loading, adding, updating, or deleting? → An error message is shown; the form remains filled so the user does not lose their input.
- What happens if the user types non-numeric characters in the Ratings field? → The field prevents non-numeric input or shows an inline validation error.
- What happens if the Ratings value is outside a sensible range (e.g. negative or above 100)? → Validation rejects it with a user-friendly message.
- What happens if a student has very long names? → Names truncate or wrap gracefully without breaking the card/row layout.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The UI MUST replace all custom `StyleSheet` inline styles with Bootstrap-equivalent visual components (Bootstrap-styled cards, buttons, form controls, badges).
- **FR-002**: All custom CSS/style overrides MUST be removed; visual appearance MUST be driven exclusively by Bootstrap component conventions.
- **FR-003**: Form inputs MUST use Bootstrap `form-control`-style appearance: rounded borders, focus ring, appropriate padding.
- **FR-004**: Buttons MUST follow Bootstrap variants: primary (blue) for submit, secondary/muted (grey) for Cancel, danger (red) for Delete, info or warning (yellow/teal) for Edit.
- **FR-005**: Student rows MUST be presented as Bootstrap `card` components — white background, shadow, rounded corners, consistent padding.
- **FR-006**: The form section and the student list MUST be visually separated (e.g. with a divider, card border, or container spacing).
- **FR-007**: The page header "Student List" MUST be styled as a Bootstrap `navbar` or prominent heading with appropriate typography scale.
- **FR-008**: The app MUST display a non-blocking empty-state message when no students are present.
- **FR-009**: All existing CRUD operations (create, read, update, delete) MUST continue to function identically after the UI redesign.
- **FR-010**: The PHP backend endpoints MUST NOT be modified as part of this feature.

### Key Entities

- **Student**: Represents a student record; attributes: `id`, `firstname`, `lastname`, `ratings`, `last_update`.
- **Form State**: Tracks current field values (`firstname`, `lastname`, `ratings`) and whether the form is in Add or Edit mode (`editingId`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A user can identify the purpose of every button on screen without reading any tooltip or help text (100% of button labels and/or colors are self-explanatory).
- **SC-002**: All four CRUD actions (add, list, edit, delete) can be completed end-to-end without encountering any layout overflow, broken alignment, or invisible controls.
- **SC-003**: The app renders without any custom inline style rules — all visual presentation comes from Bootstrap component conventions.
- **SC-004**: A new user can add their first student record in under 60 seconds using only visual cues from the interface.
- **SC-005**: The list view can accommodate at least 20 student records with consistent card layout and no visual degradation.
- **SC-006**: On both small (375px-equivalent) and large (768px-equivalent) screen widths, all UI elements remain fully visible and usable without horizontal scrolling.

## Assumptions

- The app is a **React Native** mobile application; "Bootstrap CSS" means applying Bootstrap design patterns (component appearance, color conventions, spacing) via a Bootstrap-compatible React Native library or by faithfully replicating Bootstrap visual conventions via the existing `StyleSheet` — the specific library is a planning decision.
- Ratings are integers in the range 1–100; this constraint is assumed from the existing `parseInt` conversion.
- No authentication or role-based access control is in scope for this redesign.
- The PHP backend (`students.php`, `create_student.php`, `update_student.php`, `delete_student.php`) remains untouched.
- The `BASE_URL` constant stays in `App.js` as the single configuration point per the project constitution.

## Out of Scope

- Any changes to PHP backend files.
- Adding new CRUD fields or business logic beyond the existing four operations.
- Dark mode or theming support.
- Offline/PWA support.
