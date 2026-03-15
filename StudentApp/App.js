import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import StudentCard from "./components/StudentCard";
import StudentForm from "./components/StudentForm";
import StudentModal from "./components/StudentModal";
import {
  createStudent as apiCreateStudent,
  deleteStudent as apiDeleteStudent,
  getStudents,
  updateStudent as apiUpdateStudent,
} from "./services/studentApi";
import { colors, font, layout, spacing } from "./theme/bootstrap";
import {
  isSuccessStatus,
  showDeleteConfirmation,
  showErrorAlert,
  showSuccessAlert,
} from "./utils/alerts";

const MIN_LOADING_MS = 1750;

const waitForMinimumLoading = async (startTime) => {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};

export default function App() {
  const { width } = useWindowDimensions();

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
  const [nativeAlert, setNativeAlert] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  const isWide = width >= 920;

  const openNativeAlert = ({ type, title, message, onConfirm }) => {
    setNativeAlert({
      visible: true,
      type: type || "success",
      title: title || "Notice",
      message: message || "",
      onConfirm: onConfirm || null,
    });
  };

  const closeNativeAlert = () => {
    setNativeAlert((current) => ({
      ...current,
      visible: false,
      onConfirm: null,
    }));
  };

  const handleNativeConfirm = () => {
    const action = nativeAlert.onConfirm;
    closeNativeAlert();
    if (typeof action === "function") {
      action();
    }
  };

  const clearForm = () => {
    setFirstname("");
    setLastname("");
    setRatings("");
    setEditingId(null);
  };

  const openAddModal = () => {
    setIsEditModalVisible(false);
    clearForm();
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsAddModalVisible(false);
    clearForm();
  };

  const closeEditModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsEditModalVisible(false);
    clearForm();
  };

  const fetchStudents = async ({ mode = "silent" } = {}) => {
    const startedAt = Date.now();

    if (mode === "refresh" && isRefreshing) {
      return;
    }

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
  };

  useEffect(() => {
    fetchStudents({ mode: "initial" });
  }, []);

  const createStudent = async () => {
    setIsSubmitting(true);
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
      await fetchStudents({ mode: "refresh" });
    } catch (error) {
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
      clearForm();
      await fetchStudents({ mode: "refresh" });
    } catch (error) {
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

        await fetchStudents({ mode: "refresh" });
      } catch (error) {
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
    setIsEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          isWide ? styles.containerWide : null,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.navbar}>
          <View>
            <Text style={styles.navbarBrand}>Student List</Text>
            <Text style={styles.navbarCount}>{students.length} students</Text>
          </View>

          <View style={styles.navbarActions}>
            <TouchableOpacity
              style={[styles.navButton, styles.addButton]}
              onPress={openAddModal}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.navButtonText}>Add Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.refreshButton]}
              onPress={() => fetchStudents({ mode: "refresh" })}
              disabled={isRefreshing || isSubmitting}
              activeOpacity={0.85}
            >
              <View style={styles.refreshButtonRow}>
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={colors.warningText} />
                ) : null}
                <Text style={styles.refreshButtonText}>
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Students</Text>
          <View style={styles.divider} />
        </View>

        {isRefreshing ? (
          <View style={styles.inlineRefreshingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.inlineRefreshingText}>
              Loading latest data...
            </Text>
          </View>
        ) : null}

        {isInitialLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : students.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyIcon, isWide ? styles.emptyIconWide : null]}
            >
              📋
            </Text>
            <Text style={styles.emptyText}>No students yet.</Text>
            <Text style={styles.emptySubtext}>
              Tap Add Student to create one.
            </Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <StudentCard
                item={item}
                onEdit={selectForEdit}
                onDelete={deleteStudent}
                disabled={isSubmitting}
              />
            )}
            scrollEnabled={false}
          />
        )}

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </ScrollView>

      <StudentModal
        visible={isAddModalVisible}
        title="＋ Add Student"
        onClose={closeAddModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <StudentForm
            title="Student Details"
            submitLabel="Save Student"
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
        title="✎ Edit Student"
        onClose={closeEditModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <StudentForm
            title="Update Student Details"
            submitLabel="Update Student"
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

      <AwesomeAlert
        show={nativeAlert.visible}
        showProgress={false}
        title={nativeAlert.title}
        message={nativeAlert.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={nativeAlert.type === "confirm"}
        showConfirmButton
        cancelText="Cancel"
        confirmText={nativeAlert.type === "confirm" ? "Delete" : "OK"}
        confirmButtonColor={
          nativeAlert.type === "error" || nativeAlert.type === "confirm"
            ? colors.danger
            : colors.primary
        }
        onCancelPressed={closeNativeAlert}
        onConfirmPressed={
          nativeAlert.type === "confirm"
            ? handleNativeConfirm
            : closeNativeAlert
        }
      />
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
    gap: spacing[3],
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginBottom: spacing[4],
  },
  navbarBrand: {
    color: colors.white,
    fontSize: font.h5,
    fontWeight: font.weightBold,
  },
  navbarActions: {
    flexDirection: "row",
    gap: spacing[2],
  },
  refreshButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  navButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: colors.success,
  },
  refreshButton: {
    backgroundColor: colors.warning,
  },
  navButtonText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  refreshButtonText: {
    color: colors.warningText,
    fontSize: font.sm,
    fontWeight: font.weightBold,
  },
  navbarCount: {
    color: colors.white,
    fontSize: font.sm,
    opacity: 0.85,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  inlineRefreshingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  inlineRefreshingText: {
    color: colors.mutedText,
    fontSize: font.sm,
    fontWeight: font.weightMedium,
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
  loadingState: {
    alignItems: "center",
    paddingVertical: spacing[5],
    gap: spacing[2],
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: font.base,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[5],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  emptyIconWide: {
    fontSize: 52,
  },
  emptyText: {
    fontSize: font.lg,
    fontWeight: font.weightBold,
    color: colors.mutedText,
    marginBottom: spacing[1],
  },
  emptySubtext: {
    fontSize: font.sm,
    color: colors.mutedText,
  },
  errorText: {
    marginTop: spacing[3],
    color: colors.danger,
    fontSize: font.sm,
  },
});
