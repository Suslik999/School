import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.72:5000";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: token };
};

export const loginUser = (email, password) =>
  axios.post(`${BASE_URL}/api/auth/login`, { email, password });

export const getGrades = async (studentId) =>
  axios.get(`${BASE_URL}/api/grades?student=${studentId}`, {
    headers: await getAuthHeader(),
  });

export const getAllGrades = async () =>
  axios.get(`${BASE_URL}/api/grades`, {
    headers: await getAuthHeader(),
  });

export const addGrade = async (gradeData) =>
  axios.post(`${BASE_URL}/api/grades`, gradeData, {
    headers: await getAuthHeader(),
  });

export const updateGrade = async (id, gradeData) =>
  axios.put(`${BASE_URL}/api/grades/${id}`, gradeData, {
    headers: await getAuthHeader(),
  });

export const deleteGrade = async (id) =>
  axios.delete(`${BASE_URL}/api/grades/${id}`, {
    headers: await getAuthHeader(),
  });

export const getStudents = async () =>
  axios.get(`${BASE_URL}/api/users?role=student`, {
    headers: await getAuthHeader(),
  });
