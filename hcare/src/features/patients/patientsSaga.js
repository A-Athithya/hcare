// ✅ src/features/patients/patientsSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

// Worker saga: fetch all patients
function* fetchPatients() {
  try {
    const data = yield call(() => client.get("/patients").then((r) => r.data));
    yield put({ type: "patients/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "patients/fetchFailure", payload: e.message });
  }
}

// Worker saga: create patient
function* createPatient(action) {
  try {
    const payload = action.payload;
    const created = yield call(() =>
      client.post("/patients", payload).then((r) => r.data)
    );
    yield put({ type: "patients/createSuccess", payload: created });
  } catch (e) {
    yield put({ type: "patients/createFailure", payload: e.message });
  }
}

// Worker saga: update patient
function* updatePatient(action) {
  try {
    const { id, data } = action.payload;
    const updated = yield call(() =>
      client.put(`/patients/${id}`, data).then((r) => r.data)
    );
    yield put({ type: "patients/updateSuccess", payload: updated });
  } catch (e) {
    yield put({ type: "patients/updateFailure", payload: e.message });
  }
}

// ✅ Watcher saga
export default function* patientsSaga() {
  yield takeLatest("patients/fetchStart", fetchPatients);
  yield takeLatest("patients/createStart", createPatient);
  yield takeLatest("patients/updateStart", updatePatient);
}
