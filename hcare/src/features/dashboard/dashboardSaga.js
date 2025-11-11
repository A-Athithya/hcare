import { call, put, takeLatest } from 'redux-saga/effects';
import { getData } from '../../api/client';
import {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
} from './dashboardSlice';

function* fetchDashboardWorker() {
  try {
    yield put(fetchDashboardDataStart());
    const doctors = yield call(getData, '/doctors');
    const patients = yield call(getData, '/patients');
    const appointments = yield call(getData, '/appointments');
    const medicines = yield call(getData, '/medicines');

    const stats = {
      doctors: doctors?.length || 0,
      patients: patients?.length || 0,
      appointments: appointments?.length || 0,
      medicines: medicines?.length || 0,
    };

    yield put(fetchDashboardDataSuccess(stats));
  } catch (err) {
    yield put(fetchDashboardDataFailure(err.message));
  }
}

export default function* dashboardSaga() {
  yield takeLatest('dashboard/fetchDashboardData', fetchDashboardWorker);
}
