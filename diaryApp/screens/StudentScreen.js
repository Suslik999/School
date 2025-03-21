import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";

const StudentScreen = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/grades")
      .then(({ data }) => setGrades(data))
      .catch(() => alert("Error"));
  }, []);

  return (
    <View>
      {grades.map((grade, index) => (
        <Text key={index}>{grade.subject}: {grade.score}</Text>
      ))}
    </View>
  );
};

export default StudentScreen;
