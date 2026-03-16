import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const palette = {
  bg: "#f9fafb",
  surface: "#ffffff",
  ink: "#111827",
  ink2: "#6b7280",
  ink3: "#9ca3af",
  line: "#e5e7eb",
  accent: "#2563eb",
  accentLight: "#eff6ff",
  danger: "#ef4444",
};

export default function LoginPage({
  isSubmitting,
  isAuthLoading,
  username,
  password,
  setUsername,
  setPassword,
  onSubmit,
  authErrorMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [emptyError, setEmptyError] = useState(false);

  const validationError = useMemo(() => {
    if (authErrorMessage) {
      return authErrorMessage;
    }
    if (emptyError) {
      return "Invalid username or password.";
    }
    return "";
  }, [authErrorMessage, emptyError]);

  const isBusy = isSubmitting || isAuthLoading;

  const handleSubmit = () => {
    if (!String(username || "").trim() || !String(password || "").trim()) {
      setEmptyError(true);
      return;
    }

    setEmptyError(false);
    onSubmit();
  };

  const inputStyle = (field) => [
    styles.input,
    focusedField === field ? styles.inputFocused : null,
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Student Portal - enter your credentials to continue.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={inputStyle("username")}
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                setEmptyError(false);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter username"
              placeholderTextColor={palette.ink3}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField("")}
              editable={!isBusy}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={[inputStyle("password"), styles.passwordInput]}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setEmptyError(false);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                placeholder="Enter password"
                placeholderTextColor={palette.ink3}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                editable={!isBusy}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.pwButton}
                disabled={isBusy}
              >
                <Text style={styles.pwButtonText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>

            {validationError ? (
              <View style={styles.errorRow}>
                <Text style={styles.errorIcon}>!</Text>
                <Text style={styles.errorText}>{validationError}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.signInButton,
              isBusy ? styles.signInButtonDisabled : null,
            ]}
            onPress={handleSubmit}
            disabled={isBusy}
            activeOpacity={0.9}
          >
            {isBusy ? (
              <View style={styles.buttonLoadingRow}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.signInButtonText}>Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  heading: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: palette.ink,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: palette.ink2,
    marginTop: 6,
    fontWeight: "400",
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: palette.ink,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    color: palette.ink,
    backgroundColor: palette.bg,
    borderWidth: 1.5,
    borderColor: palette.line,
    borderRadius: 8,
  },
  inputFocused: {
    borderColor: palette.accent,
    backgroundColor: palette.surface,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  passwordWrap: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 58,
  },
  pwButton: {
    position: "absolute",
    right: 12,
    top: 11,
  },
  pwButtonText: {
    fontSize: 12,
    color: palette.ink3,
    fontWeight: "500",
  },
  errorRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  errorIcon: {
    width: 14,
    height: 14,
    textAlign: "center",
    lineHeight: 14,
    borderRadius: 7,
    color: palette.danger,
    borderWidth: 1,
    borderColor: palette.danger,
    fontSize: 10,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 13,
    color: palette.danger,
  },
  signInButton: {
    width: "100%",
    marginTop: 20,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accent,
  },
  signInButtonDisabled: {
    opacity: 0.65,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
