import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import axios from "axios";

const TeacherScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/users?role=student")
      .then(({ data }) => setStudents(data))
      .catch(() => alert("Error loading students"));
  }, []);

  const addGrade = async () => {
    if (!selectedStudent || !subject || !score) return alert("Fill all fields");

    await axios.post("http://localhost:5000/api/grades", {
      student: selectedStudent,
      subject,
      score: parseInt(score),
    });

    alert("Success!");
  };

  return (
    <View>
      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text onPress={() => setSelectedStudent(item._id)}>{item.name}</Text>
        )}
      />
      <Text>Предмет:</Text>
      <TextInput value={subject} onChangeText={setSubject} />
      <Text>Оценка:</Text>
      <TextInput value={score} onChangeText={setScore} keyboardType="numeric" />
      <Button title="Add" onPress={addGrade} />
    </View>
  );
};

export default TeacherScreen;
