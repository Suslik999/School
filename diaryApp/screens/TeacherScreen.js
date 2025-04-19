import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.72:5000";
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

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");
    return token;
  };

  const fetchStudents = async () => {
    try {
      const token = await fetchToken();
      const { data } = await axios.get(`${API_URL}/api/users?role=student`, {
        headers: { Authorization: token },
      });
      setStudents(data);
    } catch (error) {
      Alert.alert("Error loading students");
    }
  };

  const fetchGrades = async () => {
    try {
      const token = await fetchToken();
      const { data } = await axios.get(`${API_URL}/api/grades`, {
        headers: { Authorization: token },
      });
      setGrades(data);
    } catch (error) {
      Alert.alert("Error loading grades");
    }
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedSubject(subjects[0]);
    setScore("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedSubject || !score) {
      return Alert.alert("Fill all fields");
    }

    try {
      const token = await fetchToken();
      const data = {
        student: selectedStudent,
        subject: selectedSubject,
        score: parseInt(score),
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/grades/${editingId}`, data, {
          headers: { Authorization: token },
        });
        Alert.alert("Grade updated");
      } else {
        await axios.post(`${API_URL}/api/grades`, data, {
          headers: { Authorization: token },
        });
        Alert.alert("Grade added");
      }

      fetchGrades();
      resetForm();
    } catch (error) {
      Alert.alert("Submit error");
    }
  };

  const handleEdit = (grade) => {
    setSelectedStudent(grade.student._id);
    setSelectedSubject(grade.subject);
    setScore(grade.score.toString());
    setEditingId(grade._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = await fetchToken();
      await axios.delete(`${API_URL}/api/grades/${id}`, {
        headers: { Authorization: token },
      });
      Alert.alert("Grade deleted");
      fetchGrades();
    } catch (error) {
      Alert.alert("Delete error");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>{editingId ? "Edit Grade" : "Add Grade"}</Text>

      <Text>Select student:</Text>
      <Picker selectedValue={selectedStudent} onValueChange={setSelectedStudent}>
        <Picker.Item label="Select student" value="" />
        {students.map((s) => (
          <Picker.Item key={s._id} label={s.name} value={s._id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 10 }}>Select subject:</Text>
      <Picker selectedValue={selectedSubject} onValueChange={setSelectedSubject}>
        {subjects.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
      </Picker>

      <Text style={{ marginTop: 10 }}>Grade:</Text>
      <TextInput
        value={score}
        onChangeText={setScore}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title={editingId ? "Update Grade" : "Add Grade"} onPress={handleSubmit} />

      <Text style={[styles.title, { marginTop: 20 }]}>All Grades</Text>

      <FlatList
        data={grades}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.gradeItem}>
            <Text style={{ flex: 1 }}>
              {item.student?.name || "Unknown"} | {item.subject}: {item.score}
            </Text>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
  },
  gradeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  editBtn: {
    color: "blue",
    marginHorizontal: 5,
  },
  deleteBtn: {
    color: "red",
    marginHorizontal: 5,
  },
});

export default TeacherScreen;
