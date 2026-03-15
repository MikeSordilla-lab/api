// Bootstrap 5 design tokens for React Native
// Values mirror Bootstrap 5's CSS variables and Sass defaults exactly.

export const colors = {
  // Contextual colors
  primary: "#0d6efd",
  primaryActive: "#0b5ed7",
  secondary: "#6c757d",
  secondaryActive: "#5c636a",
  success: "#198754",
  info: "#0dcaf0",
  danger: "#dc3545",
  dangerActive: "#b02a37",
  warning: "#ffc107",
  warningText: "#000000", // Bootstrap warning btn uses dark text

  // Surface / neutral
  white: "#ffffff",
  bodyBg: "#f8f9fa",
  softBg: "#eef2f7",
  skeletonBase: "#e9ecef",
  skeletonShimmer: "#f8f9fa",
  rowHighlight: "#d1e7dd",
  border: "#dee2e6",
  text: "#212529",
  mutedText: "#6c757d",
  placeholder: "#6c757d",

  // Focus ring (Bootstrap 5 focus-visible)
  focusRing: "#86b7fe",
};

// Bootstrap $spacer = 1rem = 16px; multiples below
export const spacing = {
  1: 4, // $spacer * 0.25
  2: 8, // $spacer * 0.5
  3: 16, // $spacer
  4: 24, // $spacer * 1.5
  5: 48, // $spacer * 3
};

export const radius = {
  base: 6, // $border-radius: 0.375rem
  card: 8, // $border-radius-lg: 0.5rem
  pill: 50,
};

export const layout = {
  containerMax: 980,
  modalMax: 520,
  touchMinHeight: 44,
};

export const motion = {
  rowHighlightMs: 1800,
};

export const font = {
  base: 16, // $font-size-base: 1rem
  sm: 14, // $font-size-sm: 0.875rem
  lg: 18, // $font-size-lg: 1.125rem
  h4: 24, // $h4-font-size: 1.5rem
  h5: 20, // $h5-font-size: 1.25rem
  weightNormal: "400",
  weightMedium: "500",
  weightBold: "700",
};

// Bootstrap card shadow: box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)
export const shadow = {
  color: "#000000",
  offset: { width: 0, height: 2 },
  opacity: 0.075,
  radius: 4,
  elevation: 2, // Android
};

// Reusable style fragments (not StyleSheet objects — just plain style props)
// Use these inside StyleSheet.create() calls in components.
export const btnBase = {
  paddingVertical: spacing[2], // 8px  (Bootstrap .btn py)
  paddingHorizontal: spacing[3], // 16px (Bootstrap .btn px)
  minHeight: layout.touchMinHeight,
  borderRadius: radius.base,
  alignItems: "center",
  justifyContent: "center",
};

export const inputBase = {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.base,
  paddingVertical: spacing[2], // 8
  paddingHorizontal: 12, // Bootstrap form-control px: 0.75rem
  fontSize: font.base,
  color: colors.text,
};

export const focusVisibleBase = {
  borderColor: colors.focusRing,
  shadowColor: colors.focusRing,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 4,
  elevation: 1,
};
