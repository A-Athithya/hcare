// src/features/billing/billingSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { getData, postData } from "../../api/client";

// Fetch all billings
function* fetchBilling() {
  try {
    const data = yield call(getData, "/billing");
    yield put({ type: "billing/fetchSuccess", payload: data || [] });
  } catch (e) {
    yield put({ type: "billing/fetchFailure", payload: e.message });
  }
}

// Create billing after payment (triggered by PaymentPage)
function* createBilling(action) {
  try {
    const created = yield call(postData, "/billing", action.payload);
    yield put({ type: "billing/createSuccess", payload: created });

    // optional: dashboard refresh
    // yield put({ type: "dashboard/fetchDashboardData" });
  } catch (e) {
    yield put({ type: "billing/createFailure", payload: e.message });
  }
}

export default function* billingSaga() {
  yield takeLatest("billing/fetchStart", fetchBilling);
  yield takeLatest("payment/createStart", createBilling);
}
