import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart(state, action) {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to load profile";
    },
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
