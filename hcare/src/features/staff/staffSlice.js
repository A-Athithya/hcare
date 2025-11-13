// src/redux/staffSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctors: [],
  nurses: [],
  receptionists: [],
  pharmacists: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // FETCH
    fetchStaffRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchStaffSuccess: (state, action) => {
      const { role, data } = action.payload;
      state[role] = data;
      state.loading = false;
    },
    fetchStaffFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },

    // ADD
    addStaffRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    addStaffSuccess: (state) => {
      state.loading = false;
    },
    addStaffFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },

    // UPDATE
    updateStaffRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    updateStaffSuccess: (state) => {
      state.loading = false;
    },
    updateStaffFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },

    // DELETE
    deleteStaffRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    deleteStaffSuccess: (state) => {
      state.loading = false;
    },
    deleteStaffFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,
  addStaffRequest,
  addStaffSuccess,
  addStaffFailure,
  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,
  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
} = staffSlice.actions;

export default staffSlice.reducer;
