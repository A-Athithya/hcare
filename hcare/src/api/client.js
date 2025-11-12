import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const getData = async (endpoint) => {
  const res = await api.get(endpoint);
  return res.data;
};

export const postData = async (endpoint, payload) => {
  const res = await api.post(endpoint, payload);
  return res.data;
};

export const putData = async (endpoint, payload) => {
  const res = await api.put(endpoint, payload);
  return res.data;
};

export const deleteData = async (endpoint) => {
  const res = await api.delete(endpoint);
  return res.data;
};

export default api;
