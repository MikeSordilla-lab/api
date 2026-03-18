import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import StudentCard from "./components/StudentCard";
import StudentForm from "./components/StudentForm";
import StudentModal from "./components/StudentModal";
import {
  createStudent as apiCreateStudent,
  deleteStudent as apiDeleteStudent,
  getStudents,
  updateStudent as apiUpdateStudent,
} from "./services/studentApi";
import {
  btnBase,
  colors,
  focusVisibleBase,
  font,
  layout,
  motion,
  spacing,
} from "./theme/bootstrap";
import {
  isSuccessStatus,
  showDeleteConfirmation,
  showErrorAlert,
  showSuccessAlert,
} from "./utils/alerts";
import {
  beginOptimisticCreate,
  beginOptimisticDelete,
  beginOptimisticUpdate,
  rollbackStudents,
} from "./utils/optimisticUpdates";
import { a11y } from "./utils/accessibility";
import { actionLabels, icons } from "./utils/icons";
import { getAuthConfig } from "./utils/config";

const MIN_LOADING_MS = 1750;

const waitForMinimumLoading = async (startTime) => {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};

const initialFormValues = { firstname: "", lastname: "", ratings: "" };

export default function App() {
  const { width } = useWindowDimensions();
  const authConfig = getAuthConfig();
  const defaultPassword = authConfig.defaultPassword || "";

  const [students, setStudents] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [ratings, setRatings] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightedId, setHighlightedId] = useState(null);
  const [focusedControl, setFocusedControl] = useState("");
  const [username, setUsername] = useState(authConfig.defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState("");
  const [authErrorMessage, setAuthErrorMessage] = useState("");
  const [pendingAddIntent, setPendingAddIntent] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const sortModes = [
    { key: "name", dir: "asc", label: "Name A-Z" },
    { key: "name", dir: "desc", label: "Name Z-A" },
    { key: "rating", dir: "desc", label: "Rating High" },
    { key: "rating", dir: "asc", label: "Rating Low" },
  ];

  const [editSnapshot, setEditSnapshot] = useState(initialFormValues);

  const isWide = width >= 920;

  const openNativeAlert = ({ type, title, message, onConfirm }) => {
    const alertType = type || "success";
    const alertTitle = title || "Notice";
    const alertMessage = message || "";

    if (alertType === "confirm") {
      Alert.alert(alertTitle, alertMessage, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: typeof onConfirm === "function" ? onConfirm : undefined,
        },
      ]);
      return;
    }

    Alert.alert(alertTitle, alertMessage, [
      {
        text: "OK",
        onPress: typeof onConfirm === "function" ? onConfirm : undefined,
      },
    ]);
  };

  const clearForm = () => {
    setFirstname("");
    setLastname("");
    setRatings("");
    setEditingId(null);
    setEditSnapshot(initialFormValues);
  };

  const showDiscardConfirm = (onConfirm) => {
    const message = "You have unsaved changes. Discard them?";

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(message)) {
        onConfirm();
      }
      return;
    }

    openNativeAlert({
      type: "confirm",
      title: "Discard changes?",
      message,
      onConfirm,
    });
  };

  const isAddDirty =
    firstname.trim() !== "" || lastname.trim() !== "" || ratings.trim() !== "";

  const isEditDirty =
    editingId !== null &&
    (firstname.trim() !== String(editSnapshot.firstname).trim() ||
      lastname.trim() !== String(editSnapshot.lastname).trim() ||
      ratings.trim() !== String(editSnapshot.ratings).trim());

  const openAddModal = () => {
    setIsEditModalVisible(false);
    clearForm();
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    if (isSubmitting) {
      return;
    }

    if (isAddDirty) {
      showDiscardConfirm(() => {
        setIsAddModalVisible(false);
        clearForm();
      });
      return;
    }

    setIsAddModalVisible(false);
    clearForm();
  };

  const closeEditModal = () => {
    if (isSubmitting) {
      return;
    }

    if (isEditDirty) {
      showDiscardConfirm(() => {
        setIsEditModalVisible(false);
        clearForm();
      });
      return;
    }

    setIsEditModalVisible(false);
    clearForm();
  };

  const fetchStudents = async ({ mode = "silent" } = {}) => {
    if (mode === "refresh" && isRefreshing) {
      return;
    }

    const startedAt = Date.now();

    if (mode === "initial") {
      setIsInitialLoading(true);
    }
    if (mode === "refresh") {
      setIsRefreshing(true);
    }

    setErrorMessage("");

    try {
      const data = await getStudents();
      setStudents(data);
      return data;
    } catch {
      const message = "Failed to fetch students.";
      setErrorMessage(message);
      showErrorAlert({
        title: "Fetch Error",
        message,
        onNativeAlert: openNativeAlert,
      });
    } finally {
      await waitForMinimumLoading(startedAt);
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }

    return [];
  };

  const bootstrapAuthState = async () => {
    // Bypass authentication - directly authenticate user
    setIsAuthLoading(true);
    try {
      setIsAuthenticated(true);
      setAuthUser("User");
      setAuthErrorMessage("");
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents({ mode: "initial" });
    bootstrapAuthState();
  }, []);

  // Removed handleLogin - authentication bypassed

  // Removed handleLogout - authentication bypassed

  const applyRowHighlight = (id) => {
    setHighlightedId(id);
    setTimeout(() => {
      setHighlightedId((current) => (current === id ? null : current));
    }, motion.rowHighlightMs);
  };

  const createStudent = async () => {
    setIsSubmitting(true);
    const draft = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      ratings: parseInt(ratings, 10),
    };
    const optimistic = beginOptimisticCreate(students, draft);
    setStudents(optimistic.next);

    try {
      const data = await apiCreateStudent({ firstname, lastname, ratings });
      if (!isSuccessStatus(data.status)) {
        throw new Error(data.message || "Unable to create student.");
      }

      showSuccessAlert({
        title: "Student Added",
        message: data.message || "Student created successfully.",
        onNativeAlert: openNativeAlert,
      });

      setIsAddModalVisible(false);
      clearForm();
      const refreshedStudents = await fetchStudents({ mode: "refresh" });

      const created = refreshedStudents.find(
        (item) =>
          item.firstname === draft.firstname &&
          item.lastname === draft.lastname &&
          Number(item.ratings) === Number(draft.ratings),
      );
      if (created?.id) {
        applyRowHighlight(created.id);
      }
    } catch (error) {
      setStudents(rollbackStudents(optimistic.rollback));

      showErrorAlert({
        title: "Create Error",
        message: error.message || "Failed to create student.",
        onNativeAlert: openNativeAlert,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStudent = async () => {
    setIsSubmitting(true);

    const optimistic = beginOptimisticUpdate(students, editingId, {
      firstname,
      lastname,
      ratings: parseInt(ratings, 10),
    });
    setStudents(optimistic.next);

    try {
      const data = await apiUpdateStudent({
        id: editingId,
        firstname,
        lastname,
        ratings,
      });

      if (!isSuccessStatus(data.status)) {
        throw new Error(data.message || "Unable to update student.");
      }

      showSuccessAlert({
        title: "Student Updated",
        message: data.message || "Student updated successfully.",
        onNativeAlert: openNativeAlert,
      });

      setIsEditModalVisible(false);
      const editedId = editingId;
      clearForm();
      await fetchStudents({ mode: "refresh" });
      applyRowHighlight(editedId);
    } catch (error) {
      setStudents(rollbackStudents(optimistic.rollback));
      showErrorAlert({
        title: "Update Error",
        message: error.message || "Failed to update student.",
        onNativeAlert: openNativeAlert,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStudent = async (item) => {
    if (isSubmitting) {
      return;
    }

    const executeDelete = async () => {
      setIsSubmitting(true);
      const optimistic = beginOptimisticDelete(students, item.id);
      setStudents(optimistic.next);

      try {
        const data = await apiDeleteStudent(item.id);
        if (!isSuccessStatus(data.status)) {
          throw new Error(data.message || "Unable to delete student.");
        }

        showSuccessAlert({
          title: "Student Deleted",
          message: data.message || "Student deleted successfully.",
          onNativeAlert: openNativeAlert,
        });

        if (editingId === item.id) {
          clearForm();
        }
      } catch (error) {
        setStudents(rollbackStudents(optimistic.rollback));
        showErrorAlert({
          title: "Delete Error",
          message: error.message || "Failed to delete student.",
          onNativeAlert: openNativeAlert,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    await showDeleteConfirmation({
      studentName: `${item.firstname} ${item.lastname}`,
      onConfirm: executeDelete,
      onNativeAlert: openNativeAlert,
    });
  };

  const selectForEdit = (item) => {
    setIsAddModalVisible(false);
    setEditingId(item.id);
    setFirstname(item.firstname);
    setLastname(item.lastname);
    setRatings(String(item.ratings));
    setEditSnapshot({
      firstname: item.firstname,
      lastname: item.lastname,
      ratings: String(item.ratings),
    });
    setIsEditModalVisible(true);
  };

  const sortMode = sortModes[sortIndex];

  const displayedStudents = useMemo(() => {
    const normalized = searchText.trim().toLowerCase();

    const filtered = students.filter((item) => {
      if (!normalized) {
        return true;
      }
      const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
      return fullName.includes(normalized);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode.key === "rating") {
        const delta = Number(a.ratings) - Number(b.ratings);
        return sortMode.dir === "asc" ? delta : -delta;
      }

      const aName = `${a.firstname} ${a.lastname}`.toLowerCase();
      const bName = `${b.firstname} ${b.lastname}`.toLowerCase();
      const delta = aName.localeCompare(bName);
      return sortMode.dir === "asc" ? delta : -delta;
    });

    return sorted;
  }, [students, searchText, sortMode]);

  const cycleSortMode = () => {
    setSortIndex((prev) => (prev + 1) % sortModes.length);
  };

  const retryFetch = () => fetchStudents({ mode: "refresh" });

  const renderSkeleton = (index) => (
    <View key={`skeleton-${index}`} style={styles.skeletonCard}>
      <View style={styles.skeletonLineLg} />
      <View style={styles.skeletonLineSm} />
      <View style={styles.skeletonFooter}>
        <View style={styles.skeletonBtn} />
        <View style={styles.skeletonBtn} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          isWide ? styles.containerWide : null,
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchStudents({ mode: "refresh" })}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.navbar}>
          <View>
            <Text style={styles.navbarBrand}>Student List</Text>
            <Text style={styles.navbarMeta}>
              {displayedStudents.length} students
            </Text>
          </View>

          <View style={styles.navbarActions}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.refreshButton,
                focusedControl === "refresh" ? styles.focusVisible : null,
              ]}
              onPress={() => fetchStudents({ mode: "refresh" })}
              onFocus={() => setFocusedControl("refresh")}
              onBlur={() => setFocusedControl("")}
              disabled={isRefreshing || isSubmitting}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={a11y.refreshButton.accessibilityLabel}
              accessibilityHint={a11y.refreshButton.accessibilityHint}
            >
              <View style={styles.refreshButtonRow}>
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={colors.mutedText} />
                ) : (
                  <Text style={styles.refreshIcon}>{icons.refresh}</Text>
                )}
                <Text style={styles.refreshButtonText}>
                  {isRefreshing ? "Refreshing..." : actionLabels.refreshList}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.addButton,
                focusedControl === "add" ? styles.focusVisible : null,
              ]}
              onPress={openAddModal}
              onFocus={() => setFocusedControl("add")}
              onBlur={() => setFocusedControl("")}
              disabled={isSubmitting}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={a11y.addStudentButton.accessibilityLabel}
              accessibilityHint={a11y.addStudentButton.accessibilityHint}
            >
              <Text style={styles.navButtonText}>
                {icons.add} {actionLabels.addStudent}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>{icons.search}</Text>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by first or last name"
              placeholderTextColor={colors.placeholder}
              accessibilityLabel={a11y.searchInput.accessibilityLabel}
              accessibilityHint={a11y.searchInput.accessibilityHint}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sortButton,
              focusedControl === "sort" ? styles.focusVisible : null,
            ]}
            onPress={cycleSortMode}
            onFocus={() => setFocusedControl("sort")}
            onBlur={() => setFocusedControl("")}
            accessibilityRole="button"
            accessibilityLabel={a11y.sortButton.accessibilityLabel}
            accessibilityHint={a11y.sortButton.accessibilityHint}
          >
            <Text style={styles.sortButtonText}>
              {icons.sort} {sortMode.label}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Students</Text>
          <View style={styles.divider} />
        </View>

        {isInitialLoading ? (
          <View style={styles.skeletonList}>
            {[1, 2, 3].map(renderSkeleton)}
          </View>
        ) : displayedStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyIcon, isWide ? styles.emptyIconWide : null]}
            >
              📋
            </Text>
            <Text style={styles.emptyText}>No students found.</Text>
            <Text style={styles.emptySubtext}>
              Add your first student or refine your search.
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyCtaButton,
                focusedControl === "empty-cta" ? styles.focusVisible : null,
              ]}
              onPress={openAddModal}
              onFocus={() => setFocusedControl("empty-cta")}
              onBlur={() => setFocusedControl("")}
              accessibilityRole="button"
              accessibilityLabel={a11y.addStudentButton.accessibilityLabel}
              accessibilityHint={a11y.addStudentButton.accessibilityHint}
            >
              <Text style={styles.emptyCtaText}>
                {icons.add} {actionLabels.addStudent}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={displayedStudents}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <StudentCard
                item={item}
                onEdit={selectForEdit}
                onDelete={deleteStudent}
                disabled={isSubmitting}
                isHighlighted={String(item.id) === String(highlightedId)}
              />
            )}
            scrollEnabled={false}
          />
        )}

        {errorMessage ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                focusedControl === "retry" ? styles.focusVisible : null,
              ]}
              onPress={retryFetch}
              onFocus={() => setFocusedControl("retry")}
              onBlur={() => setFocusedControl("")}
              accessibilityRole="button"
              accessibilityLabel={a11y.retryButton.accessibilityLabel}
              accessibilityHint={a11y.retryButton.accessibilityHint}
            >
              <Text style={styles.retryText}>{actionLabels.retryLoad}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <StudentModal
        visible={isAddModalVisible}
        title={`${icons.add} ${actionLabels.addStudent}`}
        onClose={closeAddModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <StudentForm
            title="Student Details"
            submitLabel={actionLabels.saveStudent}
            showCancel
            submitDisabled={isSubmitting}
            isSubmitting={isSubmitting}
            editingId={null}
            firstname={firstname}
            lastname={lastname}
            ratings={ratings}
            setFirstname={setFirstname}
            setLastname={setLastname}
            setRatings={setRatings}
            onSubmit={createStudent}
            onCancel={closeAddModal}
          />
        </KeyboardAvoidingView>
      </StudentModal>

      <StudentModal
        visible={isEditModalVisible}
        title={`${icons.edit} ${actionLabels.editStudent}`}
        onClose={closeEditModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <StudentForm
            title="Update Student Details"
            submitLabel={actionLabels.updateStudent}
            showCancel
            submitDisabled={isSubmitting}
            isSubmitting={isSubmitting}
            editingId={editingId}
            firstname={firstname}
            lastname={lastname}
            ratings={ratings}
            setFirstname={setFirstname}
            setLastname={setLastname}
            setRatings={setRatings}
            onSubmit={updateStudent}
            onCancel={closeEditModal}
          />
        </KeyboardAvoidingView>
      </StudentModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bodyBg,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: spacing[3],
    paddingBottom: spacing[5],
  },
  containerWide: {
    maxWidth: layout.containerMax,
    width: "100%",
    alignSelf: "center",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bodyBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginBottom: spacing[3],
  },
  navbarBrand: {
    color: colors.text,
    fontSize: font.h5,
    fontWeight: font.weightBold,
  },
  navbarMeta: {
    color: colors.mutedText,
    fontSize: font.sm,
    marginTop: spacing[1],
  },
  navbarActions: {
    flexDirection: "row",
    gap: spacing[2],
    alignItems: "center",
    marginLeft: spacing[2],
  },
  navButton: {
    ...btnBase,
    paddingHorizontal: spacing[2],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  refreshButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  logoutButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  navButtonText: {
    color: colors.white,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  refreshButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  refreshButtonText: {
    color: colors.mutedText,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  refreshIcon: {
    color: colors.mutedText,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing[2],
    minHeight: layout.touchMinHeight,
  },
  searchIcon: {
    color: colors.mutedText,
    marginRight: spacing[1],
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: font.base,
    paddingVertical: spacing[2],
  },
  sortButton: {
    ...btnBase,
    backgroundColor: colors.secondary,
    minWidth: 130,
  },
  sortButtonText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  sectionTitle: {
    fontSize: font.sm,
    fontWeight: font.weightBold,
    color: colors.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  skeletonList: {
    gap: spacing[2],
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing[3],
  },
  skeletonLineLg: {
    height: 20,
    width: "55%",
    borderRadius: 6,
    backgroundColor: colors.skeletonBase,
    marginBottom: spacing[2],
  },
  skeletonLineSm: {
    height: 14,
    width: "30%",
    borderRadius: 6,
    backgroundColor: colors.skeletonShimmer,
    marginBottom: spacing[2],
  },
  skeletonFooter: {
    flexDirection: "row",
    gap: spacing[2],
  },
  skeletonBtn: {
    flex: 1,
    height: layout.touchMinHeight,
    borderRadius: 6,
    backgroundColor: colors.skeletonBase,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[5],
    gap: spacing[1],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing[1],
  },
  emptyIconWide: {
    fontSize: 52,
  },
  emptyText: {
    fontSize: font.lg,
    fontWeight: font.weightBold,
    color: colors.mutedText,
  },
  emptySubtext: {
    fontSize: font.sm,
    color: colors.mutedText,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  emptyCtaButton: {
    ...btnBase,
    backgroundColor: colors.primary,
    minWidth: 180,
  },
  emptyCtaText: {
    color: colors.white,
    fontSize: font.base,
    fontWeight: font.weightBold,
  },
  errorWrap: {
    marginTop: spacing[3],
    alignItems: "flex-start",
    gap: spacing[2],
  },
  errorText: {
    color: colors.danger,
    fontSize: font.sm,
  },
  retryButton: {
    ...btnBase,
    backgroundColor: colors.danger,
  },
  retryText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  focusVisible: {
    ...focusVisibleBase,
  },
});
