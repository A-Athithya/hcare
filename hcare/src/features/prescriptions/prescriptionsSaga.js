import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

function fetchApi() {
  return client.get("/prescriptions").then((r) => r.data);
}

function* fetch() {
  try {
    const data = yield call(fetchApi);
    yield put({ type: "prescriptions/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "prescriptions/failure", payload: e.message });
  }
}

export default function* prescriptionsSaga() {
  yield takeLatest("prescriptions/fetchStart", fetch);
}
