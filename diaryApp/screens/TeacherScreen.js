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
import {
  getStudents,
  getAllGrades,
  addGrade,
  updateGrade,
  deleteGrade,
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
    fetchStudents();
    fetchGrades();
  }, []);

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
      Alert.alert("Error loading grades");
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
    
    try {
      const data = {
        student: selectedStudent,
        subject: selectedSubject,
        score: numericScore,
      };
  
      if (editingId) {
        await updateGrade(editingId, data);
        Alert.alert("Grade updated");
      } else {
        await addGrade(data);
        Alert.alert("Grade added");
      }
  
      fetchGrades();
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
      await deleteGrade(id);
      Alert.alert("Grade deleted");
      fetchGrades();
    } catch (error) {
      Alert.alert("Delete error");
    }
  };

  const filteredGrades = grades.filter((g) => g.student?._id === selectedStudent);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Manage Grades</Text>

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
  scroll: {
    padding: 20,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
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
