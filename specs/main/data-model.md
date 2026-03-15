# Data Model: StudentApp UX Polish and Reliability Enhancements

## Entity: StudentViewItem

Represents a student row as rendered in list UI.

Fields:

- `id`: unique student identifier
- `firstname`: display name component
- `lastname`: display name component
- `ratings`: numeric score (1-100)
- `isHighlighted`: transient visual marker after create/update
- `optimisticState`: `none | pending-create | pending-update | pending-delete | rollback`

Validation Rules:

- `ratings` must remain integer 1-100 before submit.
- `firstname` and `lastname` must be non-empty after trim.

State Transitions:

- Normal -> pending-update/create/delete -> committed
- pending-\* -> rollback (on failed response) -> normal
- committed -> highlighted -> normal

## Entity: ListPresentationState

Represents state needed to render list status and user feedback.

Fields:

- `isInitialLoading`
- `isRefreshing`
- `isSkeletonVisible`
- `errorMessage`
- `canRetry`
- `lastUpdatedAt`

Validation Rules:

- `isSkeletonVisible` true only during loading phases.
- `canRetry` true only when `errorMessage` exists.

State Transitions:

- idle -> initial-loading -> loaded | failed
- loaded -> refreshing -> loaded | failed
- failed -> retrying -> loaded | failed

## Entity: QueryControls

Represents search and sort controls.

Fields:

- `searchText`
- `sortKey`: `name | rating | updated`
- `sortDirection`: `asc | desc`

Validation Rules:

- `searchText` normalized via trim/lowercase before filter.
- `sortKey` and `sortDirection` constrained to enum values.

State Transitions:

- default -> filtered/sorted
- filtered/sorted -> reset(default)

## Entity: ModalFormState

Represents add/edit modal form state and dirty guard behavior.

Fields:

- `mode`: `add | edit`
- `isOpen`
- `isDirty`
- `isSubmitting`
- `showDiscardConfirm`
- `formValues`: `{ firstname, lastname, ratings }`

Validation Rules:

- Dirty state set when current values differ from initial snapshot.
- `showDiscardConfirm` shown only when closing while `isDirty` and not `isSubmitting`.

State Transitions:

- closed -> open(clean)
- open(clean) -> open(dirty)
- open(dirty) + close-request -> confirm-discard | stay-open
- open(submitting) -> success(closed) | failure(open)

## Entity: ClientApiConfig

Represents frontend API configuration source.

Fields:

- `baseUrl`
- `source`: `expo-extra | fallback-constant`

Validation Rules:

- `baseUrl` must be non-empty and absolute URL.
- fallback used when config missing.

State Transitions:

- unresolved -> resolved
- resolved -> fallback-resolved (if config invalid)
