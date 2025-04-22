import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const BASE_URL = "http://192.168.1.72:5000";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: token };
};

export const isOnline = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

const OFFLINE_ACTIONS_KEY = "offline_grade_actions";

export const syncOfflineGrades = async () => {
  const isConnected = await isOnline();
  if (!isConnected) return;

  const raw = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
  if (!raw) return;

  const actions = JSON.parse(raw);

  for (let item of actions) {
    try {
      if (item.action === "add") {
        await axios.post(`${BASE_URL}/api/grades`, item.data, {
          headers: await getAuthHeader(),
        });
      } else if (item.action === "update") {
        await axios.put(`${BASE_URL}/api/grades/${item.id}`, item.data, {
          headers: await getAuthHeader(),
        });
      } else if (item.action === "delete") {
        await axios.delete(`${BASE_URL}/api/grades/${item.id}`, {
          headers: await getAuthHeader(),
        });
      }
    } catch (e) {
      console.error(`Failed to sync ${item.action}`, item);
    }
  }

  await AsyncStorage.removeItem(OFFLINE_ACTIONS_KEY);
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

export const addGrade = async (gradeData) => {
  const isConnected = await isOnline();

  if (isConnected) {
    return axios.post(`${BASE_URL}/api/grades`, gradeData, {
      headers: await getAuthHeader(),
    });
  } else {
    await queueOfflineAction({ action: "add", data: gradeData });
    return { data: { ...gradeData, _id: Date.now().toString() } };
  }
};

export const updateGrade = async (id, gradeData) => {
  const isConnected = await isOnline();

  if (isConnected) {
    return axios.put(`${BASE_URL}/api/grades/${id}`, gradeData, {
      headers: await getAuthHeader(),
    });
  } else {
    await queueOfflineAction({ action: "update", id, data: gradeData });
    return { data: { ...gradeData, _id: id } };
  }
};

export const deleteGrade = async (id) => {
  const isConnected = await isOnline();

  if (isConnected) {
    return axios.delete(`${BASE_URL}/api/grades/${id}`, {
      headers: await getAuthHeader(),
    });
  } else {
    await queueOfflineAction({ action: "delete", id });
    return { data: { _id: id } };
  }
};

export const getStudents = async () =>
  axios.get(`${BASE_URL}/api/users?role=student`, {
    headers: await getAuthHeader(),
  });

const queueOfflineAction = async (action) => {
  const existing = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
  const queue = existing ? JSON.parse(existing) : [];
  queue.push(action);
  await AsyncStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(queue));
};

export const queueOfflineUpdate = async (id, data) =>
  queueOfflineAction({ action: "update", id, data });

export const queueOfflineDelete = async (id) =>
  queueOfflineAction({ action: "delete", id });
