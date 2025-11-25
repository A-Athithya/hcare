import axios from "axios";
import { getStoredToken } from "../utils/tokenHelper";
import { encrypt, decrypt } from "../utils/cryptoHelper";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ================= GET ================= */
export const getData = async (endpoint) => {
  const res = await api.get(endpoint);
  let data = res.data;

  // ✅ CASE A: Full DB encrypted => { data: "encrypted_string" }
  if (data && typeof data.data === "string") {
    const decrypted = decrypt(data.data);

    if (Array.isArray(decrypted)) return decrypted;
    if (typeof decrypted === "object") return Object.values(decrypted);
  }

  // ✅ CASE B: Per-record encrypted => [{id, data}]
  if (Array.isArray(data)) {
    return data.map(item => ({
      id: item.id,
      ...decrypt(item.data)
    }));
  }

  return [];
};

/* ================= POST ================= */
export const postData = async (endpoint, payload) => {
  const encrypted = encrypt(payload);
  const res = await api.post(endpoint, { data: encrypted });

  // return clean decrypted object
  return res.data?.data ? decrypt(res.data.data) : res.data;
};

/* ================= PUT ================= */
export const putData = async (endpoint, payload) => {
  const encrypted = encrypt(payload);
  const res = await api.put(endpoint, { data: encrypted });

  return res.data?.data ? decrypt(res.data.data) : res.data;
};

/* ================= DELETE ================= */
export const deleteData = async (endpoint) => {
  const res = await api.delete(endpoint);
  return res.data;
};

export default api;
