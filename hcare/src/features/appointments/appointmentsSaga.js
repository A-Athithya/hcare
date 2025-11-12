import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

function* fetchAppointments() {
  try {
    const data = yield call(() =>
      client.get("/appointments").then((r) => r.data)
    );
    yield put({ type: "appointments/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "appointments/fetchFailure", payload: e.message });
  }
}

export default function* appointmentsSaga() {
  yield takeLatest("appointments/fetchStart", fetchAppointments);
}
