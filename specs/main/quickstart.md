# Quickstart: Validate UX Polish and Reliability Enhancements

## Preconditions

- XAMPP Apache + MySQL running.
- PHP endpoints available under configured API base URL.
- Expo app dependencies installed in `StudentApp/`.

## Run

1. Start web app:
   - `cd StudentApp`
   - `npx expo start --web`
2. Start mobile session (optional additional validation):
   - `npx expo start`
   - open via Expo Go/device emulator.

## Validation Checklist

### Empty/Loading/Retry

1. Force empty data state and verify empty-state CTA appears.
2. Tap empty-state CTA and verify Add modal opens.
3. Trigger initial/refresh loading and verify skeleton/loading indicators appear.
4. Simulate fetch failure and verify retry action appears and works.

### Row Highlight

1. Create a student and verify affected row highlights briefly.
2. Edit a student and verify updated row highlights briefly.

### Accessibility and Consistency

1. Validate accessibility labels exist on critical controls.
2. Verify focus-visible styles on interactive controls (web focus traversal).
3. Confirm icon and wording consistency across list cards and modal actions.

### Search/Sort/Pull-to-Refresh

1. Enter search text and verify filtered results update immediately.
2. Change sort key/direction and verify deterministic ordering.
3. On mobile, perform pull-to-refresh and verify refresh state feedback.

### Unsaved Changes Guard

1. Open add/edit modal and change one or more fields.
2. Attempt close and verify discard-confirm prompt appears.
3. Cancel prompt and verify field values remain.
4. Confirm discard and verify modal closes with reset state.

### API Config + Optimistic Update

1. Verify app reads API base URL from external config source.
2. Perform create/update/delete and verify optimistic list update behavior.
3. Simulate failed mutation and verify rollback to consistent list state plus error feedback.

## Regression Checks

1. Baseline CRUD still works with existing PHP endpoints.
2. Existing status/message alerts still display appropriate outcomes.
3. No backend file edits are required for this feature.

## Validation Results (Latest)

- Date: 2026-03-15
- Implemented scope: Empty-state CTA, skeleton loading, retry action, row highlight,
  accessibility labels/focus visuals, icon consistency, search/sort, pull-to-refresh,
  unsaved-change guards, API config externalization, optimistic update rollback.
- Status: Ready for manual verification pass using this checklist.
