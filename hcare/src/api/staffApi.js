// src/api/staffApi.js
import { getData, postData, putData, deleteData } from "./client";

// Map roles to endpoints
const endpoints = {
  doctors: "/doctors",
  nurses: "/nurses",
  receptionists: "/receptionists",
  pharmacists: "/pharmacists",
};

// Generic GET
export const getStaff = (role) => getData(endpoints[role]);

// Generic ADD
export const addStaff = (role, staff) => postData(endpoints[role], staff);

// Generic UPDATE
export const updateStaff = (role, staff) => putData(`${endpoints[role]}/${staff.id}`, staff);

// Generic DELETE
export const deleteStaff = (role, id) => deleteData(`${endpoints[role]}/${id}`);
