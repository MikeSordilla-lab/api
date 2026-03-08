import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, spacing, radius, font, shadow } from "../theme/bootstrap";

export default function StudentForm({
  editingId,
  firstname,
  lastname,
  ratings,
  setFirstname,
  setLastname,
  setRatings,
  onSubmit,
  onCancel,
}) {
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!firstname.trim()) errs.firstname = "First name is required.";
    if (!lastname.trim()) errs.lastname = "Last name is required.";
    if (!ratings.trim()) {
      errs.ratings = "Rating is required.";
    } else {
      const n = parseInt(ratings, 10);
      if (isNaN(n) || n < 1 || n > 100)
        errs.ratings = "Rating must be a number between 1 and 100.";
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit();
  };

  const inputStyle = (field) => [
    styles.input,
    focused === field && styles.inputFocused,
    errors[field] && styles.inputError,
  ];

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {editingId ? "✎ Edit Student" : "＋ Add Student"}
        </Text>
      </View>

      {/* Card body — form fields */}
      <View style={styles.cardBody}>
        {/* First Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={inputStyle("firstname")}
            placeholder="Enter first name"
            placeholderTextColor={colors.placeholder}
            value={firstname}
            onChangeText={(v) => {
              setFirstname(v);
              setErrors((e) => ({ ...e, firstname: null }));
            }}
            onFocus={() => setFocused("firstname")}
            onBlur={() => setFocused(null)}
          />
          {errors.firstname ? (
            <Text style={styles.errorText}>{errors.firstname}</Text>
          ) : null}
        </View>

        {/* Last Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={inputStyle("lastname")}
            placeholder="Enter last name"
            placeholderTextColor={colors.placeholder}
            value={lastname}
            onChangeText={(v) => {
              setLastname(v);
              setErrors((e) => ({ ...e, lastname: null }));
            }}
            onFocus={() => setFocused("lastname")}
            onBlur={() => setFocused(null)}
          />
          {errors.lastname ? (
            <Text style={styles.errorText}>{errors.lastname}</Text>
          ) : null}
        </View>

        {/* Ratings */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rating (1–100)</Text>
          <TextInput
            style={inputStyle("ratings")}
            placeholder="Enter rating"
            placeholderTextColor={colors.placeholder}
            value={ratings}
            onChangeText={(v) => {
              setRatings(v);
              setErrors((e) => ({ ...e, ratings: null }));
            }}
            onFocus={() => setFocused("ratings")}
            onBlur={() => setFocused(null)}
            keyboardType="numeric"
          />
          {errors.ratings ? (
            <Text style={styles.errorText}>{errors.ratings}</Text>
          ) : null}
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>
            {editingId ? "Update Student" : "Add Student"}
          </Text>
        </TouchableOpacity>

        {/* Cancel button — only visible in edit mode */}
        {editingId ? (
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={onCancel}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[4],
    shadowColor: shadow.color,
    shadowOffset: shadow.offset,
    shadowOpacity: shadow.opacity,
    shadowRadius: shadow.radius,
    elevation: shadow.elevation,
  },
  cardHeader: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bodyBg,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: font.weightBold,
    color: colors.text,
  },
  cardBody: {
    padding: spacing[3],
  },
  formGroup: {
    marginBottom: spacing[3],
  },
  label: {
    fontSize: font.sm,
    fontWeight: font.weightMedium,
    color: colors.text,
    marginBottom: spacing[1],
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.base,
    paddingVertical: spacing[2],
    paddingHorizontal: 12,
    fontSize: font.base,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.focusRing,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: font.sm,
    marginTop: spacing[1],
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.base,
    alignItems: "center",
    marginBottom: spacing[2],
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  btnSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.base,
    alignItems: "center",
  },
  btnSecondaryText: {
    color: colors.white,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
});
