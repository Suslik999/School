import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import NetInfo from "@react-native-community/netinfo";
import {
  getStudents,
  getAllGrades,
  addGrade,
  updateGrade,
  deleteGrade,
  syncOfflineGrades,
  queueOfflineUpdate,
  queueOfflineDelete,
} from "../src/api/api.js";

const subjects = ["Math", "PE", "History", "Chemistry"];

const TeacherScreen = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [score, setScore] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      await syncOfflineGrades();
      await fetchStudents();
      await fetchGrades();
    } catch (err) {
      console.log("Init error:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await getStudents();
      setStudents(data);
    } catch (error) {
      Alert.alert("Error loading students");
    }
  };

  const fetchGrades = async () => {
    try {
      const { data } = await getAllGrades();
      setGrades(data);
    } catch (error) {
    }
  };

  const resetForm = () => {
    setSelectedSubject(subjects[0]);
    setScore("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedSubject || score === "") {
      return Alert.alert("Fill all fields");
    }

    const numericScore = parseInt(score);
    if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
      return Alert.alert("Grade must be a number between 1 and 5");
    }

    const gradeData = {
      student: selectedStudent,
      subject: selectedSubject,
      score: numericScore,
    };

    try {
      const net = await NetInfo.fetch();
      const isOnline = net.isConnected;

      if (editingId) {
        if (isOnline) {
          await updateGrade(editingId, gradeData);
          Alert.alert("Grade updated");
        } else {
          await queueOfflineUpdate(editingId, gradeData);
          Alert.alert("Offline: grade update queued");
        }
      } else {
        await addGrade(gradeData); 
        Alert.alert(isOnline ? "Grade added" : "Offline: grade queued");
      }

      await syncOfflineGrades();
      await fetchGrades();
      resetForm();
    } catch (error) {
      Alert.alert("Submit error");
    }
  };

  const handleEdit = (grade) => {
    setSelectedSubject(grade.subject);
    setScore(grade.score.toString());
    setEditingId(grade._id);
  };

  const handleDelete = async (id) => {
    try {
      const net = await NetInfo.fetch();
      const isOnline = net.isConnected;

      if (isOnline) {
        await deleteGrade(id);
        Alert.alert("Grade deleted");
      } else {
        await queueOfflineDelete(id);
        Alert.alert("Offline: delete queued");
      }

      await syncOfflineGrades();
      await fetchGrades();
    } catch (error) {
      Alert.alert("Delete error");
    }
  };

  const filteredGrades = grades.filter((g) => g.student?._id === selectedStudent);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Manage Grades</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={initializeScreen}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Select student:</Text>
      <Picker
        selectedValue={selectedStudent}
        onValueChange={setSelectedStudent}
        style={styles.picker}
      >
        <Picker.Item label="Select student" value="" />
        {students.map((s) => (
          <Picker.Item key={s._id} label={s.name} value={s._id} />
        ))}
      </Picker>

      {selectedStudent !== "" && (
        <>
          <Text style={styles.label}>Select subject:</Text>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={setSelectedSubject}
            style={styles.picker}
          >
            {subjects.map((subject, index) => (
              <Picker.Item key={index} label={subject} value={subject} />
            ))}
          </Picker>

          <Text style={styles.label}>Grade:</Text>
          <TextInput
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>
              {editingId ? "Update Grade" : "Add Grade"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.title, { marginTop: 30 }]}>Grades of Selected Student</Text>

          {filteredGrades.length === 0 ? (
            <Text style={{ color: "#888", fontStyle: "italic" }}>No grades yet</Text>
          ) : (
            <FlatList
              data={filteredGrades}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.gradeItem}>
                  <Text style={styles.gradeText}>
                    {item.subject}: {item.score}
                  </Text>
                  <View style={styles.buttons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  refreshButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  gradeText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: "#e94e4e",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TeacherScreen;