import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";

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
    const res = await fetch(`${BASE_URL}/students.php`);
    const data = await res.json();
    setStudents(data);
  };

  const createStudent = async () => {
    const res = await fetch(`${BASE_URL}/create_student.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, ratings: parseInt(ratings) }),
    });
    const data = await res.json();
    Alert.alert(data.status, data.message);
    fetchStudents();
    clearForm();
  };

  const updateStudent = async () => {
    const res = await fetch(`${BASE_URL}/update_student.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        firstname,
        lastname,
        ratings: parseInt(ratings),
      }),
    });
    const data = await res.json();
    Alert.alert(data.status, data.message);
    fetchStudents();
    clearForm();
  };

  const deleteStudent = async (id) => {
    const res = await fetch(`${BASE_URL}/delete_student.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    Alert.alert(data.status, data.message);
    fetchStudents();
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student List</Text>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Ratings"
        value={ratings}
        onChangeText={setRatings}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={editingId ? updateStudent : createStudent}
      >
        <Text style={styles.btnText}>
          {editingId ? "Update Student" : "Add Student"}
        </Text>
      </TouchableOpacity>
      {editingId && (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#999" }]}
          onPress={clearForm}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {/* List */}
      <FlatList
        data={students}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.firstname} {item.lastname}
            </Text>
            <Text>Ratings: {item.ratings}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => selectForEdit(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteStudent(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  edit: { color: "#2980b9", fontWeight: "bold" },
  delete: { color: "#e74c3c", fontWeight: "bold" },
});
