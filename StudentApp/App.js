import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import StudentForm from "./components/StudentForm";
import StudentCard from "./components/StudentCard";
import { colors, spacing, font } from "./theme/bootstrap";

const BASE_URL = "http://192.168.0.78/api"; // e.g. http://192.168.1.5/api

export default function App() {
  const [students, setStudents] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [ratings, setRatings] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/students.php`);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch students.");
    }
  };

  const createStudent = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create_student.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          ratings: parseInt(ratings, 10),
        }),
      });
      const data = await res.json();
      Alert.alert(data.status, data.message);
      fetchStudents();
      clearForm();
    } catch (error) {
      Alert.alert("Error", "Failed to create student.");
    }
  };

  const updateStudent = async () => {
    try {
      const res = await fetch(`${BASE_URL}/update_student.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          firstname,
          lastname,
          ratings: parseInt(ratings, 10),
        }),
      });
      const data = await res.json();
      Alert.alert(data.status, data.message);
      fetchStudents();
      clearForm();
    } catch (error) {
      Alert.alert("Error", "Failed to update student.");
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/delete_student.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      Alert.alert(data.status, data.message);
      fetchStudents();
    } catch (error) {
      Alert.alert("Error", "Failed to delete student.");
    }
  };

  const selectForEdit = (item) => {
    setEditingId(item.id);
    setFirstname(item.firstname);
    setLastname(item.lastname);
    setRatings(String(item.ratings));
  };

  const clearForm = () => {
    setFirstname("");
    setLastname("");
    setRatings("");
    setEditingId(null);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navbar / Header */}
        <View style={styles.navbar}>
          <Text style={styles.navbarBrand}>🎓 Student List</Text>
          <Text style={styles.navbarCount}>{students.length} students</Text>
        </View>

        {/* Add / Edit Form */}
        <StudentForm
          editingId={editingId}
          firstname={firstname}
          lastname={lastname}
          ratings={ratings}
          setFirstname={setFirstname}
          setLastname={setLastname}
          setRatings={setRatings}
          onSubmit={editingId ? updateStudent : createStudent}
          onCancel={clearForm}
        />

        {/* Divider with section label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Students</Text>
          <View style={styles.divider} />
        </View>

        {/* Student list */}
        {students.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No students yet.</Text>
            <Text style={styles.emptySubtext}>
              Add one using the form above.
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
              />
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
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
  // Navbar
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  navbarCount: {
    color: colors.white,
    fontSize: font.sm,
    opacity: 0.85,
  },
  // Section header
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
  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[5],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing[2],
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
});
