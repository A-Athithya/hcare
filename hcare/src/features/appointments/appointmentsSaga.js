import { call, put, takeLatest, delay } from "redux-saga/effects";
import client from "../../api/client";

function fetchAppointmentsApi() {
  return client.get("/appointments?_sort=date&_order=desc").then((r) => r.data);
}

function* pollAppointments() {
  while (true) {
    try {
      const data = yield call(fetchAppointmentsApi);
      yield put({ type: "appointments/fetchSuccess", payload: data });
    } catch (e) {
      yield put({ type: "appointments/fetchFailure", payload: e.message });
    }
    yield delay(10000); // poll every 10 seconds
  }
}

export default function* appointmentsSaga() {
  yield takeLatest("appointments/startPolling", pollAppointments);
}
