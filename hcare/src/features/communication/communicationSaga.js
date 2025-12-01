// src/features/communication/communicationSaga.js
import { call, put, takeLatest, all } from "redux-saga/effects";
import { getData, postData, putData, deleteData } from "../../api/client";
import {
  fetchCommunicationsRequest,
  fetchCommunicationsSuccess,
  fetchCommunicationsFailure,
  fetchPatientsRequest,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  createCommunicationRequest,
  createCommunicationSuccess,
  createCommunicationFailure,
  updateCommunicationRequest,
  updateCommunicationSuccess,
  updateCommunicationFailure,
  deleteCommunicationRequest,
  deleteCommunicationSuccess,
  deleteCommunicationFailure,
} from "./communicationSlice";

/* ------------------- COMMUNICATIONS ------------------- */
function* fetchCommunicationsSaga(action) {
  try {
    const query = action.payload?.query || "";
    const res = yield call(() => getData(`/communications${query}`));
    const list = Array.isArray(res) ? res : res ? [res] : [];
    yield put(fetchCommunicationsSuccess(list));
  } catch (err) {
    yield put(fetchCommunicationsFailure(err.message));
  }
}

function* createCommunicationSaga(action) {
  try {
    const data = action.payload;
    const res = yield call(() => postData("/communications", data));
    yield put(createCommunicationSuccess(res));
  } catch (err) {
    yield put(createCommunicationFailure(err.message));
  }
}

function* updateCommunicationSaga(action) {
  try {
    const { id, payload } = action.payload;
    const existing = yield call(() => getData(`/communications/${id}`));
    if (!existing) throw new Error("Communication not found");
    const updated = { ...existing, ...payload };
    yield call(() => putData(`/communications/${id}`, updated));
    yield put(updateCommunicationSuccess(updated));
  } catch (err) {
    yield put(updateCommunicationFailure(err.message));
  }
}

function* deleteCommunicationSaga(action) {
  try {
    const id = action.payload;
    yield call(() => deleteData(`/communications/${id}`));
    yield put(deleteCommunicationSuccess(id));
  } catch (err) {
    yield put(deleteCommunicationFailure(err.message));
  }
}

/* ------------------- PATIENTS ------------------- */
function* fetchPatientsSaga() {
  try {
    const res = yield call(() => getData("/patients"));
    yield put(fetchPatientsSuccess(Array.isArray(res) ? res : [res]));
  } catch (err) {
    yield put(fetchPatientsFailure(err.message));
  }
}

/* ------------------- DOCTORS ------------------- */
function* fetchDoctorsSaga() {
  try {
    const res = yield call(() => getData("/doctors"));
    yield put(fetchDoctorsSuccess(Array.isArray(res) ? res : [res]));
  } catch (err) {
    yield put(fetchDoctorsFailure(err.message));
  }
}

/* ------------------- PRESCRIPTIONS ------------------- */
function* fetchPrescriptionsSaga() {
  try {
    const res = yield call(() => getData("/prescriptions"));
    yield put(fetchPrescriptionsSuccess(Array.isArray(res) ? res : [res]));
  } catch (err) {
    yield put(fetchPrescriptionsFailure(err.message));
  }
}

/* ------------------- ROOT ------------------- */
export default function* communicationSaga() {
  yield all([
    takeLatest(fetchCommunicationsRequest.type, fetchCommunicationsSaga),
    takeLatest(createCommunicationRequest.type, createCommunicationSaga),
    takeLatest(updateCommunicationRequest.type, updateCommunicationSaga),
    takeLatest(deleteCommunicationRequest.type, deleteCommunicationSaga),
    takeLatest(fetchPatientsRequest.type, fetchPatientsSaga),
    takeLatest(fetchDoctorsRequest.type, fetchDoctorsSaga),
    takeLatest(fetchPrescriptionsRequest.type, fetchPrescriptionsSaga),
  ]);
}
