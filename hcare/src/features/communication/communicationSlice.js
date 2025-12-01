// src/features/communication/communicationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],       // communications
  patients: [],
  doctors: [],
  prescriptions: [],
  loading: false,
  error: null,
};

const communicationSlice = createSlice({
  name: "communication",
  initialState,
  reducers: {
    /* ---------- COMMUNICATIONS ---------- */
    fetchCommunicationsRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommunicationsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
    },
    fetchCommunicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createCommunicationRequest: (state) => { state.loading = true; state.error = null; },
    createCommunicationSuccess: (state, action) => { state.loading = false; state.items.unshift(action.payload); },
    createCommunicationFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    updateCommunicationRequest: (state) => { state.loading = true; },
    updateCommunicationSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.items = state.items.map((c) =>
        String(c.id) === String(updated.id) ? { ...c, ...updated } : c
      );
    },
    updateCommunicationFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    deleteCommunicationRequest: (state) => { state.loading = true; },
    deleteCommunicationSuccess: (state, action) => {
      state.loading = false;
      state.items = state.items.filter((c) => String(c.id) !== String(action.payload));
    },
    deleteCommunicationFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    /* ---------- PATIENTS ---------- */
    fetchPatientsRequest: (state) => { state.loading = true; state.error = null; },
    fetchPatientsSuccess: (state, action) => { state.loading = false; state.patients = action.payload || []; },
    fetchPatientsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    /* ---------- DOCTORS ---------- */
    fetchDoctorsRequest: (state) => { state.loading = true; state.error = null; },
    fetchDoctorsSuccess: (state, action) => { state.loading = false; state.doctors = action.payload || []; },
    fetchDoctorsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    /* ---------- PRESCRIPTIONS ---------- */
    fetchPrescriptionsRequest: (state) => { state.loading = true; state.error = null; },
    fetchPrescriptionsSuccess: (state, action) => { state.loading = false; state.prescriptions = action.payload || []; },
    fetchPrescriptionsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchCommunicationsRequest,
  fetchCommunicationsSuccess,
  fetchCommunicationsFailure,
  createCommunicationRequest,
  createCommunicationSuccess,
  createCommunicationFailure,
  updateCommunicationRequest,
  updateCommunicationSuccess,
  updateCommunicationFailure,
  deleteCommunicationRequest,
  deleteCommunicationSuccess,
  deleteCommunicationFailure,
  fetchPatientsRequest,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
} = communicationSlice.actions;

export default communicationSlice.reducer;
