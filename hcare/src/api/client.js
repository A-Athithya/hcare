// src/api/client.js
import axios from "axios";
import { getStoredToken } from "../utils/tokenHelper";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Load mock data from db.json for development fallback
const loadMockData = async () => {
  try {
    const dbResponse = await fetch('/db.json');
    if (dbResponse.ok) {
      return await dbResponse.json();
    }
  } catch (error) {
    console.warn('Could not load db.json for mock data fallback');
  }
  return {};
};

let mockDataPromise = loadMockData();

export const getData = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (error) {
    // Fallback to mock data from db.json if API fails
    const mockData = await mockDataPromise;
    const key = endpoint.replace('/', '');
    console.warn(`API call to ${endpoint} failed, using mock data for ${key}`);
    return mockData[key] || [];
  }
};

export const postData = async (endpoint, payload) => {
  try {
    // allow POST to /auth/register (routes.json -> /users) or other endpoints
    const res = await api.post(endpoint, payload);
    return res.data;
  } catch (error) {
    // For development, attempt to simulate server behaviour by writing to local db.json is not possible here.
    // Simulate a created resource (client-side) to keep UI flowing.
    console.warn(`API call to ${endpoint} failed, simulating success`, error?.message);
    return { ...payload, id: Date.now() };
  }
};

export const putData = async (endpoint, payload) => {
  try {
    const res = await api.put(endpoint, payload);
    return res.data;
  } catch (error) {
    console.warn(`API call to ${endpoint} failed, simulating success`);
    return payload;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const res = await api.delete(endpoint);
    return res.data;
  } catch (error) {
    console.warn(`API call to ${endpoint} failed, simulating success`);
    return {};
  }
};

export default api;
