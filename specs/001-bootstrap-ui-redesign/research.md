# Research: Bootstrap UI Redesign

**Feature**: `001-bootstrap-ui-redesign`  
**Date**: 2026-03-08  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Research Question 1: Bootstrap Library Selection for React Native

**Unknown**: The spec noted "specific library is a planning decision" for applying
Bootstrap CSS to a React Native (Expo SDK ~55, React 19) app.

### Options Evaluated

| Library                          | Bootstrap?         | React 19               | Expo 55               | Verdict                |
| -------------------------------- | ------------------ | ---------------------- | --------------------- | ---------------------- |
| NativeBase v3                    | ✅ Bootstrap-like  | ❌ Targets React 17/18 | ❌ Peer dep conflicts | Rejected               |
| GlueStack UI (NativeBase v4)     | ✅ Bootstrap-like  | ⚠️ Experimental        | ⚠️ Beta               | Too risky              |
| react-native-paper               | ❌ Material Design | ✅ Yes                 | ✅ Yes                | Wrong design system    |
| react-native-bootstrap-styles    | ✅ Bootstrap       | ❌ Last update 2021    | ❌ Stale              | Rejected               |
| Tamagui                          | ✅ Configurable    | ✅ Yes                 | ✅ Yes                | Overkill — 8+ packages |
| Manual Bootstrap 5 design tokens | ✅ Bootstrap       | ✅ Guaranteed          | ✅ Guaranteed         | **Selected**           |

### Decision

**Implement Bootstrap 5 design tokens manually via React Native `StyleSheet`.**

No new npm dependency is added. A single `StudentApp/theme/bootstrap.js` module
exports Bootstrap 5's exact design tokens as JavaScript constants:

- **Colors**: Primary `#0d6efd`, Danger `#dc3545`, Warning `#ffc107`, Success
  `#198754`, Secondary `#6c757d`, Body bg `#f8f9fa`, Card bg `#ffffff`, Border
  `#dee2e6`, Text `#212529`, Muted text `#6c757d`
- **Typography**: Font base 16, H4 heading 20 bold, label 14 medium
- **Spacing**: 4 / 8 / 12 / 16 / 24px (Bootstrap's $spacer multiples)
- **Border radius**: 6px (Bootstrap default 0.375rem), 8px for cards
- **Shadows**: `elevation: 2` + iOS shadow config (~Bootstrap `box-shadow:
0 .125rem .25rem rgba(0,0,0,.075)`)
- **Button padding**: vertical 8px, horizontal 16px (Bootstrap btn default)
- **Input padding**: vertical 8px, horizontal 12px (Bootstrap form-control)

### Rationale

- Zero dependency delta → guaranteed React 19 + Expo 55 compatibility
- Visually identical to Bootstrap 5 (same hex values, spacing, radius)
- Constitution-compliant: no new external libraries, minimal complexity
- Works identically on Android, iOS, and Web (via react-native-web already installed)
- Easy to amend tokens for future Bootstrap version bumps

### Alternatives Considered

GlueStack UI was the strongest third-party candidate but is in active flux for
React 19 support. Tamagui requires 8+ packages and significant setup overhead,
violating Principle IV (Simplicity). NativeBase v3 and react-native-bootstrap-styles
both have known React 19 peer dependency conflicts confirmed by package.json
inspection (React 19.2.0 is installed).

---

## Research Question 2: Bootstrap Card Pattern in React Native

**Unknown**: How to faithfully replicate Bootstrap card (`card`, `card-body`,
`card-header`) in React Native.

### Decision

Use nested `View` components styled with Bootstrap shadow + border tokens:

```js
card: {
  backgroundColor: colors.white,
  borderRadius: radius.card,           // 8
  borderWidth: 1,
  borderColor: colors.border,          // #dee2e6
  marginBottom: spacing[3],            // 16
  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.075,
  shadowRadius: 2,
  // Android shadow
  elevation: 2,
}
```

---

## Research Question 3: Bootstrap Form Controls in React Native

**Unknown**: How to replicate Bootstrap `form-control` appearance (focus ring,
border, padding) in React Native `TextInput`.

### Decision

Use `TextInput` with Bootstrap token-derived style plus `onFocus`/`onBlur`
state to toggle a `:focus`-equivalent blue border (`#86b7fe`, Bootstrap's
focus ring color):

```js
input: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,          // #dee2e6 at rest
  borderRadius: radius.base,           // 6
  paddingVertical: spacing[2],         // 8
  paddingHorizontal: spacing[3] - 4,   // 12
  fontSize: font.base,                 // 16
  color: colors.text,
}
// On focus: borderColor -> '#86b7fe', borderWidth -> 2
```

---

## Research Question 4: Expo `android.usesCleartextTraffic` & Local API

**Unknown**: Will the HTTP (non-HTTPS) calls to the XAMPP local API work after
the redesign?

### Decision

No change needed. `app.json` already sets `"usesCleartextTraffic": true` for
Android, which allows plain HTTP to the XAMPP server at `192.168.0.78`. This
remains unchanged throughout the redesign.

---

## Summary of Decisions

| Question             | Decision                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| UI library           | Manual Bootstrap 5 design tokens in `theme/bootstrap.js` — zero new deps |
| Card pattern         | Nested `View` with Bootstrap shadow + border tokens                      |
| Form control pattern | `TextInput` with token-based style + onFocus border highlight            |
| HTTP cleartext       | Already configured in `app.json`; no action needed                       |

All NEEDS CLARIFICATION items resolved. Phase 1 design can proceed.
