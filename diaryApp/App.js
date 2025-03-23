import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import StudentScreen from "./screens/StudentScreen";
import TeacherScreen from "./screens/TeacherScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen name="TeacherScreen" component={TeacherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}