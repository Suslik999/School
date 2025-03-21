import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      alert(`Welcome, ${data.role}`);
      navigation.navigate(data.role === "teacher" ? "TeacherScreen" : "StudentScreen");
    } catch {
      alert("Error");
    }
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default LoginScreen;

