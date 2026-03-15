# Research: StudentApp UX Polish and Reliability Enhancements

## Decision 1: Skeleton Loading + Retry UX

- Decision: Implement client-side list skeleton placeholders during fetch and show inline retry action on failure in the same list context.
- Rationale: Skeletons improve perceived performance and preserve layout stability; retry controls reduce recovery friction compared to modal-only errors.
- Alternatives considered:
  - Spinner-only approach: rejected due to lower information density and weaker perceived responsiveness.
  - Full-screen blocking error: rejected because it interrupts ongoing context and requires extra navigation.

## Decision 2: Row Highlight After Create/Update

- Decision: Apply a temporary row highlight state keyed by student ID after successful create/update refresh.
- Rationale: Immediate visual confirmation reinforces action success without forcing users to scan all rows.
- Alternatives considered:
  - Alert-only confirmation: rejected because users still need to locate changed row manually.
  - Persistent badge indicator: rejected as visually noisy over repeated edits.

## Decision 3: Accessibility Labels and Focus States

- Decision: Add explicit accessibility labels/hints for all critical actions and enforce visible focus styles on actionable controls.
- Rationale: Improves keyboard/screen-reader usability and aligns with consistent cross-platform interaction behavior.
- Alternatives considered:
  - Rely on default labels from text content: rejected due to inconsistent assistive output across platforms.
  - Focus styling only on web: rejected to keep interaction signals consistent in RN environments.

## Decision 4: Search/Sort + Pull-to-Refresh

- Decision: Implement client-side search and sort against fetched list data, and use native pull-to-refresh for mobile list interaction.
- Rationale: Preserves current backend contract while improving list navigation speed and native platform ergonomics.
- Alternatives considered:
  - Backend query-driven search/sort endpoints: rejected to avoid backend contract expansion.
  - Refresh button only: rejected because mobile users expect pull gesture.

## Decision 5: Unsaved Changes Guard in Modals

- Decision: Track dirty form state in add/edit modals and prompt before close if unsaved data exists.
- Rationale: Prevents accidental data loss, especially on tap-outside or back action paths.
- Alternatives considered:
  - Auto-save drafts silently: rejected for higher complexity and ambiguous save semantics.
  - No guard with toast warning: rejected because warning appears after data is already lost.

## Decision 6: API Config Externalization

- Decision: Move API base URL from hardcoded source constant into Expo-driven configuration with a centralized accessor.
- Rationale: Simplifies environment switching and avoids code edits for deployment targets.
- Alternatives considered:
  - Keep hardcoded URL in app logic: rejected due to maintainability risk.
  - Multi-file duplicated constants: rejected due to drift risk.

## Decision 7: Optimistic Update Strategy

- Decision: Apply optimistic local mutations for create/update/delete with rollback if API response fails or returns failed status.
- Rationale: Improves responsiveness and keeps UX fluid while preserving correctness through rollback.
- Alternatives considered:
  - Always wait for backend before local update: rejected for slower perceived interactions.
  - Optimistic updates without rollback path: rejected due to data inconsistency risk.
