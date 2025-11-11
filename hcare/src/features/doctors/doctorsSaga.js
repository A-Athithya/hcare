import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

function fetchDoctorsApi() {
  return client.get("/doctors").then((r) => r.data);
}

function* fetchDoctors() {
  try {
    const data = yield call(fetchDoctorsApi);
    yield put({ type: "doctors/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "doctors/fetchFailure", payload: e.message });
  }
}

export default function* doctorsSaga() {
  yield takeLatest("doctors/fetchStart", fetchDoctors);
}
