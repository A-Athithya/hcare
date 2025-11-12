import { all } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";
import dashboardSaga from "../features/dashboard/dashboardSaga";
import patientsSaga from "../features/patients/patientsSaga";
import appointmentsSaga from "../features/appointments/appointmentsSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    dashboardSaga(),
    patientsSaga(),
    appointmentsSaga(),
  ]);
}
