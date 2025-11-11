import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";

function fetchInvoicesApi() {
  return client.get("/invoices").then((r) => r.data);
}

function* fetchInvoices() {
  try {
    const data = yield call(fetchInvoicesApi);
    yield put({ type: "billing/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "billing/failure", payload: e.message });
  }
}

export default function* billingSaga() {
  yield takeLatest("billing/fetchStart", fetchInvoices);
}
