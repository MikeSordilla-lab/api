---
description: "Task list for Bootstrap UI Redesign"
---

# Tasks: Bootstrap UI Redesign

**Input**: Design documents from `specs/001-bootstrap-ui-redesign/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-endpoints.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap design token system and component structure

- [x] T001 [P] Create `StudentApp/theme/bootstrap.js` with Bootstrap 5 design tokens (colors, spacing, radius, shadows, typography)
- [x] T002 [P] Create `StudentApp/components/` directory structure

---

## Phase 2: Foundational Components

**Purpose**: Reusable Bootstrap-styled primitives that all user stories depend on

- [x] T003 Create `StudentApp/components/StudentCard.js` — Bootstrap card with student name, ratings badge, Edit (warning) and Delete (danger) buttons
- [x] T004 Create `StudentApp/components/StudentForm.js` — Bootstrap form with form-control inputs, inline validation errors, focus-ring state, primary submit button, secondary cancel button

**Checkpoint**: Components ready — App.js can now be rebuilt using them

---

## Phase 3: User Story 1 — View and Navigate the Student List (Priority: P1) 🎯 MVP

**Goal**: Student list renders as Bootstrap cards with readable data and distinct action buttons  
**Independent Test**: Open app → white cards with shadowed borders show student data and Edit/Delete buttons

### Implementation for User Story 1

- [x] T005 [US1] Rewrite `StudentApp/App.js` — replace all custom StyleSheet rules with Bootstrap theme tokens; integrate StudentCard and StudentForm components; add empty-state message when list is empty

**Checkpoint**: US1 fully functional — App renders list with Bootstrap card appearance

---

## Phase 4: User Story 2 — Add a New Student (Priority: P2)

**Goal**: Form uses Bootstrap form-control appearance; validation messages show inline; success feedback via Alert  
**Independent Test**: Fill fields → Add Student → success alert → form clears → student appears in list

### Implementation for User Story 2

- [x] T006 [US2] Implement inline validation in `StudentForm.js` — show error text below each invalid field; prevent submit when invalid; clear errors on successful submit

**Checkpoint**: US2 fully functional — Add Student flow works end-to-end with Bootstrap styling

---

## Phase 5: User Story 3 — Edit an Existing Student (Priority: P3)

**Goal**: Edit button pre-fills form; button label changes to "Update Student"; Cancel button restores add mode  
**Independent Test**: Tap Edit → fields fill → update → record changes; tap Cancel → form resets

### Implementation for User Story 3

- [x] T007 [US3] Ensure `StudentForm.js` and `App.js` correctly reflect edit mode — form header changes, Cancel button appears only in edit mode (already handled in T005/T006)

**Checkpoint**: US3 fully functional — Edit flow works end-to-end

---

## Phase 6: User Story 4 — Delete with Confirmation (Priority: P4)

**Goal**: Delete tap shows confirmation dialog naming the student; confirm deletes; cancel preserves record  
**Independent Test**: Tap Delete → confirmation dialog appears with student name → confirm removes row

### Implementation for User Story 4

- [x] T008 [US4] Implement delete confirmation in `StudentCard.js` — use `Alert.alert` with student name in confirmation message and two-button confirm/cancel pattern

**Checkpoint**: US4 fully functional — Delete requires confirmation, shows student name

---

## Phase 7: Polish and Validation

**Purpose**: Final verification against spec success criteria

- [x] T009 [P] Verify SC-003: no custom inline style values remain in App.js (all styling via theme/bootstrap.js tokens or component StyleSheets using tokens)
- [x] T010 [P] Verify SC-001: all button labels/colors self-explanatory without tooltips
- [x] T011 [P] Verify all four CRUD operations work end-to-end (manual test checklist in quickstart.md)
