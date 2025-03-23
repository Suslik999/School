import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://192.168.1.72:5000"; 

const subjects = ["Math", "PE", "History", "Chemistry"]; 

const TeacherScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [score, setScore] = useState("");

  useEffect(() => {
    axios.get("http://192.168.1.72:5000/api/users?role=student") 
      .then(({ data }) => setStudents(data))
      .catch(() => alert("Error"));
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users?role=student`);
      setStudents(data);
    } catch (error) {
      Alert.alert("Students loading error");
    }
  };

  const addGrade = async () => {
    if (!selectedStudent || !subject || !score) return alert("Fill fields");

    await axios.post("http://192.168.1.72:5000/api/grades", { 
      student: selectedStudent,
      subject,
      score: parseInt(score),
    });

    alert("Success");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Select student:</Text>
      <Picker selectedValue={selectedStudent} onValueChange={(value) => setSelectedStudent(value)}>
        <Picker.Item label="Select student" value="" />
        {students.map((student) => (
          <Picker.Item key={student._id} label={student.name} value={student._id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 20 }}>Select subject:</Text>
      <Picker selectedValue={selectedSubject} onValueChange={(value) => setSelectedSubject(value)}>
        {subjects.map((subject, index) => (
          <Picker.Item key={index} label={subject} value={subject} />
        ))}
      </Picker>

      <Text style={{ marginTop: 20 }}>Grade:</Text>
      <TextInput 
        value={score} 
        onChangeText={setScore} 
        keyboardType="numeric" 
        placeholder="Enter grade"
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />
      <Text>Subject:</Text>
      <TextInput value={subject} onChangeText={setSubject} />
      <Text>Grade:</Text>
      <TextInput value={score} onChangeText={setScore} keyboardType="numeric" />
      <Button title="Add" onPress={addGrade} />
    </View>
  );
};

export default TeacherScreen;
