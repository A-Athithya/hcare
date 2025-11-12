// src/redux/staffSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import * as api from "../../api/staffApi";
import {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "./staffSlice";

// FETCH
function* fetchStaffSaga(action) {
  try {
    const data = yield call(api.getStaff, action.payload.role); // role = "doctors", "nurses", etc.
    yield put(fetchStaffSuccess({ role: action.payload.role, data }));
  } catch (error) {
    yield put(fetchStaffFailure({ role: action.payload.role, error: error.message }));
  }
}

// ADD
function* addStaffSaga(action) {
  try {
    yield call(api.addStaff, action.payload.role, action.payload.staff);
    yield put(fetchStaffRequest({ role: action.payload.role }));
  } catch (error) {
    console.error(error);
  }
}

// UPDATE
function* updateStaffSaga(action) {
  try {
    yield call(api.updateStaff, action.payload.role, action.payload.staff);
    yield put(fetchStaffRequest({ role: action.payload.role }));
  } catch (error) {
    console.error(error);
  }
}

// DELETE
function* deleteStaffSaga(action) {
  try {
    yield call(api.deleteStaff, action.payload.role, action.payload.id);
    yield put(fetchStaffRequest({ role: action.payload.role }));
  } catch (error) {
    console.error(error);
  }
}

// WATCHER
export default function* staffSaga() {
  yield takeLatest(fetchStaffRequest.type, fetchStaffSaga);
  yield takeLatest(addStaffRequest.type, addStaffSaga);
  yield takeLatest(updateStaffRequest.type, updateStaffSaga);
  yield takeLatest(deleteStaffRequest.type, deleteStaffSaga);
}
