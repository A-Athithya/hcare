import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/client";

function* fetchDoctors() {
  try {
    const data = yield call(getData, "/doctors");   // ✅ automatically decrypted
    yield put({ type: "doctors/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "doctors/fetchFailure", payload: e.message });
  }
}

export default function* doctorsSaga() {
  yield takeLatest("doctors/fetchStart", fetchDoctors);
}
