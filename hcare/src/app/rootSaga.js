import profileSaga from '../features/profile/profileSaga';
import { all } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";
import dashboardSaga from "../features/dashboard/dashboardSaga";
import patientsSaga from "../features/patients/patientsSaga";
import appointmentsSaga from "../features/appointments/appointmentsSaga";
import prescriptionsSaga from "../features/prescriptions/prescriptionsSaga";
import billingSaga from "../features/billing/billingSaga";
import staffSaga from '../features/staff/staffSaga';
import inventorySaga from "../features/inventory/inventorySaga";
import doctorsSaga from "../features/doctors/doctorsSaga";
import communicationSaga from "../features/communication/communicationSaga";
import notificationSaga from '../features/notification/notificationSaga';
export default function* rootSaga() {
  yield all([
    profileSaga(),
    authSaga(),
    dashboardSaga(),
    patientsSaga(),
    appointmentsSaga(),
    prescriptionsSaga(),
    billingSaga(),
    staffSaga(),
    inventorySaga(),
    doctorsSaga(),
    communicationSaga(),
    notificationSaga()
  ]);
}
