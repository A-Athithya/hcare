import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

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
    const res = await api.post(endpoint, payload);
    return res.data;
  } catch (error) {
    // For development, simulate successful creation
    console.warn(`API call to ${endpoint} failed, simulating success`);
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
