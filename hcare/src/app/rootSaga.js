import { all } from 'redux-saga/effects';
import dashboardSaga from '../features/dashboard/dashboardSaga';
// import other sagas...

export default function* rootSaga() {
  yield all([
    dashboardSaga(),
    // ...other sagas
  ]);
}
