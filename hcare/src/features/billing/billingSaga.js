import { call, put, takeLatest, select } from "redux-saga/effects";
import client from "../../api/client";

function fetchInvoicesApi() {
  return client.get("/invoices").then((r) => r.data);
}

function* fetchInvoices() {
  try {
    const data = yield call(fetchInvoicesApi);

    // Get user role from auth state
    const { user, role } = yield select((state) => state.auth);

    let filteredData = data;

    // Filter invoices based on user role
    if (role === 'doctor') {
      filteredData = data.filter(invoice => invoice.doctorId == user.id);
    } else if (role === 'patient') {
      filteredData = data.filter(invoice => invoice.patientId == user.id);
    }
    // Admin sees all invoices

    yield put({ type: "billing/fetchSuccess", payload: filteredData });
  } catch (e) {
    yield put({ type: "billing/failure", payload: e.message });
  }
}

export default function* billingSaga() {
  yield takeLatest("billing/fetchStart", fetchInvoices);
}
