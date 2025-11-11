import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

function fetchPatientsApi() {
  return client.get("/patients").then((r) => r.data);
}

function* fetchPatients() {
  try {
    const data = yield call(fetchPatientsApi);
    yield put({ type: "patients/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "patients/fetchFailure", payload: e.message });
  }
}

export default function* patientsSaga() {
  yield takeLatest("patients/fetchStart", fetchPatients);
}
