import { call, put, takeLatest } from "redux-saga/effects";
import { getData, postData, putData } from "../../api/client";

function* fetchPrescriptions() {
  try {
    const data = yield call(getData, "/prescriptions"); // ✅ decrypted array
    yield put({ type: "prescriptions/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "prescriptions/fetchFailure", payload: e.message });
  }
}

function* createPrescription(action) {
  try {
    const created = yield call(postData, "/prescriptions", action.payload);
    yield put({ type: "prescriptions/createSuccess", payload: created });
  } catch (e) {
    yield put({ type: "prescriptions/createFailure", payload: e.message });
  }
}

function* updatePrescription(action) {
  try {
    const { id, data } = action.payload;
    const updated = yield call(putData, `/prescriptions/${id}`, data);
    yield put({ type: "prescriptions/updateSuccess", payload: updated });
  } catch (e) {
    yield put({ type: "prescriptions/updateFailure", payload: e.message });
  }
}

export default function* prescriptionsSaga() {
  yield takeLatest("prescriptions/fetchStart", fetchPrescriptions);
  yield takeLatest("prescriptions/createStart", createPrescription);
  yield takeLatest("prescriptions/updateStart", updatePrescription);
}
