import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    // FETCH
    fetchInventoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ADD
    addInventoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addInventorySuccess: (state) => {
      state.loading = false;
    },
    addInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // UPDATE
    updateInventoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateInventorySuccess: (state) => {
      state.loading = false;
    },
    updateInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // DELETE
    deleteInventoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteInventorySuccess: (state) => {
      state.loading = false;
    },
    deleteInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  addInventoryRequest,
  addInventorySuccess,
  addInventoryFailure,
  updateInventoryRequest,
  updateInventorySuccess,
  updateInventoryFailure,
  deleteInventoryRequest,
  deleteInventorySuccess,
  deleteInventoryFailure,
} = inventorySlice.actions;

export default inventorySlice.reducer;
