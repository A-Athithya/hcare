import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET
export const getData = async (endpoint) => {
  try {
    const res = await API.get(endpoint);
    return res.data;
  } catch (err) {
    console.error('GET Error:', err);
    throw err;
  }
};

// Generic POST
export const postData = async (endpoint, data) => {
  try {
    const res = await API.post(endpoint, data);
    return res.data;
  } catch (err) {
    console.error('POST Error:', err);
    throw err;
  }
};

// Generic PUT
export const putData = async (endpoint, data) => {
  try {
    const res = await API.put(endpoint, data);
    return res.data;
  } catch (err) {
    console.error('PUT Error:', err);
    throw err;
  }
};

// Generic DELETE
export const deleteData = async (endpoint) => {
  try {
    const res = await API.delete(endpoint);
    return res.data;
  } catch (err) {
    console.error('DELETE Error:', err);
    throw err;
  }
};

export default API;
