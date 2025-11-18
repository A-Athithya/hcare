import { call, put, takeLatest, select } from "redux-saga/effects";
import client from "../../api/client";

function fetchApi() {
  return client.get("/prescriptions").then((r) => r.data);
}

function* fetch() {
  try {
    const data = yield call(fetchApi);
    const { user, role } = yield select((state) => state.auth);

    // Filter prescriptions based on user role
    let filteredData = data;
    if (role === 'doctor') {
      filteredData = data.filter(p => p.doctorId == user.id);
    } else if (role === 'patient') {
      filteredData = data.filter(p => p.patientId == user.id);
    }
    // Admin sees all prescriptions

    yield put({ type: "prescriptions/fetchSuccess", payload: filteredData });
  } catch (e) {
    yield put({ type: "prescriptions/failure", payload: e.message });
  }
}

export default function* prescriptionsSaga() {
  yield takeLatest("prescriptions/fetchStart", fetch);
}
