import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentScreen = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // предполагаем, что токен хранится под ключом "token"

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const { data } = await axios.get("http://192.168.1.72:5000/api/grades", {
        headers: {
          Authorization: token,
        },
      });

      console.log("Grades:", data);
      setGrades(data);
    } catch (error) {
      console.error("Grades error:", error);
      alert("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Grades</Text>
      <FlatList
        data={grades}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Subject</Text>
            <Text style={[styles.cell, styles.headerText]}>Grades</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.subject}</Text>
            <Text style={styles.cell}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    fontWeight: "bold",
    color: "white",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default StudentScreen;
