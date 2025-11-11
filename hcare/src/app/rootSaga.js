import { all } from 'redux-saga/effects';
import dashboardSaga from '../features/dashboard/dashboardSaga';
import prescriptionsSaga from '../features/prescriptions/prescriptionsSaga';
import billingSaga from '../features/billing/billingSaga';
// import other sagas...

export default function* rootSaga() {
  yield all([
    dashboardSaga(),
    prescriptionsSaga(),
    billingSaga(),
    // ...other sagas
  ]);
}
 