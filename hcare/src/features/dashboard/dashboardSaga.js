import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/client";
import {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
} from "./dashboardSlice";

/* ✅ DASHBOARD MAIN WORKER */
function* fetchDashboardWorker() {
  try {
    yield put(fetchDashboardDataStart());

    const doctors = yield call(getData, "/doctors");
    const patients = yield call(getData, "/patients");
    const appointments = yield call(getData, "/appointments");
    const medicines = yield call(getData, "/medicines");
    const billings = yield call(getData, "/billing"); // ✅ NEW

    // ✅ TOTAL REVENUE CALCULATION
    const totalRevenue = Array.isArray(billings)
      ? billings.reduce((sum, bill) => sum + Number(bill.amount || 0), 0)
      : 0;

    // ✅ MONTHLY REVENUE FOR GRAPH (Line / Bar Chart)
    const revenueByMonth = {};

    if (Array.isArray(billings)) {
      billings.forEach((bill) => {
        if (bill.date) {
          const month = bill.date.slice(0, 7); // YYYY-MM
          revenueByMonth[month] =
            (revenueByMonth[month] || 0) + Number(bill.amount || 0);
        }
      });
    }

    const stats = {
      doctors: doctors?.length || 0,
      patients: patients?.length || 0,
      appointments: appointments?.length || 0,
      medicines: medicines?.length || 0,

      // ✅ NEW FOR DASHBOARD
      totalRevenue,
      revenueGraph: revenueByMonth,
    };

    yield put(fetchDashboardDataSuccess(stats));
  } catch (err) {
    yield put(fetchDashboardDataFailure(err.message));
  }
}

/* ✅ WATCHER */
export default function* dashboardSaga() {
  yield takeLatest("dashboard/fetchDashboardData", fetchDashboardWorker);

  // ✅ Payment pannina udane dashboard auto refresh
  yield takeLatest("billing/createSuccess", fetchDashboardWorker);
}
