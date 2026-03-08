# Data Model: Bootstrap UI Redesign

**Feature**: `001-bootstrap-ui-redesign`  
**Date**: 2026-03-08  
**Source**: spec.md Key Entities + research.md decisions

---

## Entity: Student

Persisted in MySQL table `student_list` on the XAMPP database `student`.  
The PHP backend owns all writes; the React Native app reads and displays this entity.

| Field         | Type             | Constraints                           | Notes                                             |
| ------------- | ---------------- | ------------------------------------- | ------------------------------------------------- |
| `id`          | integer          | NOT NULL, AUTO_INCREMENT, PRIMARY KEY | Read-only from frontend                           |
| `firstname`   | string (varchar) | Required, non-empty                   | Displayed in card heading                         |
| `lastname`    | string (varchar) | Required, non-empty                   | Displayed in card heading alongside firstname     |
| `ratings`     | integer          | Required; 1–100 (frontend validation) | Stored as INT; frontend `parseInt` before sending |
| `last_update` | datetime         | Set by PHP backend on every write     | Format: `Y-m-d H:i:s`; displayed optionally       |

### Validation Rules

- `firstname`: non-empty string after `.trim()`
- `lastname`: non-empty string after `.trim()`
- `ratings`: non-empty, `parseInt` result must be a finite number and in range 1–100

### State Transitions (Backend)

```
[create]  → student_list row inserted; last_update set to NOW()
[read]    → all rows returned as JSON array
[update]  → matched row updated; last_update set to NOW()
[delete]  → matched row removed permanently
```

---

## UI State Model (React Native App State)

Managed entirely in `App.js` via React hooks. No external state library.

| State variable     | Type             | Initial value | Purpose                                                                     |
| ------------------ | ---------------- | ------------- | --------------------------------------------------------------------------- |
| `students`         | `Student[]`      | `[]`          | Array of student objects fetched from API                                   |
| `firstname`        | `string`         | `""`          | Controlled input value                                                      |
| `lastname`         | `string`         | `""`          | Controlled input value                                                      |
| `ratings`          | `string`         | `""`          | Controlled input value (string for TextInput; parsed to int before sending) |
| `editingId`        | `number \| null` | `null`        | `null` = "Add" mode; non-null = "Edit" mode with this student ID            |
| `focusedInput`     | `string \| null` | `null`        | Tracks which input is focused for Bootstrap focus-ring styling              |
| `validationErrors` | `object`         | `{}`          | Map of field name → error string for inline validation display              |

### Form Mode State Machine

```
[Add mode: editingId = null]
  → user fills form + taps "Add Student" → POST create → refresh list → clear form
  → user taps "Edit" on a card → [Edit mode: editingId = student.id]

[Edit mode: editingId = student.id]
  → user edits form + taps "Update Student" → POST update → refresh list → clear form → [Add mode]
  → user taps "Cancel" → clear form → [Add mode]
```

---

## Bootstrap Design Token Model

Defined in `StudentApp/theme/bootstrap.js`. Not persisted; pure UI constants.

### Colors

| Token          | Value     | Bootstrap equivalent             |
| -------------- | --------- | -------------------------------- |
| `primary`      | `#0d6efd` | `$primary` / `btn-primary`       |
| `primaryHover` | `#0b5ed7` | `$primary` darken 10%            |
| `danger`       | `#dc3545` | `$danger` / `btn-danger`         |
| `warning`      | `#ffc107` | `$warning` / `btn-warning`       |
| `warningText`  | `#000000` | Bootstrap warning uses dark text |
| `success`      | `#198754` | `$success`                       |
| `secondary`    | `#6c757d` | `$secondary` / `btn-secondary`   |
| `white`        | `#ffffff` | `$white` / card bg               |
| `bodyBg`       | `#f8f9fa` | `$body-bg`                       |
| `border`       | `#dee2e6` | `$border-color`                  |
| `text`         | `#212529` | `$body-color`                    |
| `mutedText`    | `#6c757d` | `text-muted`                     |
| `focusRing`    | `#86b7fe` | Bootstrap 5 focus-visible ring   |
| `inputBorder`  | `#dee2e6` | Default input border             |

### Spacing (px)

| Token        | Value | Bootstrap equivalent |
| ------------ | ----- | -------------------- |
| `spacing[1]` | 4     | `$spacer * 0.25`     |
| `spacing[2]` | 8     | `$spacer * 0.5`      |
| `spacing[3]` | 16    | `$spacer` (1rem)     |
| `spacing[4]` | 24    | `$spacer * 1.5`      |
| `spacing[5]` | 48    | `$spacer * 3`        |

### Border Radius (px)

| Token         | Value | Bootstrap equivalent         |
| ------------- | ----- | ---------------------------- |
| `radius.base` | 6     | `$border-radius` (0.375rem)  |
| `radius.card` | 8     | `$border-radius-lg` (0.5rem) |

### Typography

| Token               | Value   | Bootstrap equivalent       |
| ------------------- | ------- | -------------------------- |
| `font.base`         | 16      | `$font-size-base` (1rem)   |
| `font.sm`           | 14      | `$font-size-sm` (0.875rem) |
| `font.lg`           | 20      | `$h5-font-size`            |
| `font.xl`           | 24      | `$h4-font-size`            |
| `font.weightNormal` | `'400'` | `$font-weight-normal`      |
| `font.weightBold`   | `'700'` | `$font-weight-bold`        |

### Shadows

Replicates Bootstrap's `box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)`:

| Platform | Config                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------- |
| iOS      | `shadowColor: '#000'`, `shadowOffset: {width:0, height:2}`, `shadowOpacity: 0.075`, `shadowRadius: 4` |
| Android  | `elevation: 2`                                                                                        |
