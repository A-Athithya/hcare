// src/redux/staffSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { getData, postData, putData, deleteData } from "../../api/client";
import {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "./staffSlice";

// Map roles to endpoints
const endpoints = {
  doctors: "/doctors",
  nurses: "/nurses",
  receptionists: "/receptionists",
  pharmacists: "/pharmacists",
};

// FETCH
function* fetchStaffSaga(action) {
  try {
    const data = yield call(getData, endpoints[action.payload.role]);
    yield put(fetchStaffSuccess({ role: action.payload.role, data }));
  } catch (error) {
    yield put(fetchStaffFailure({ role: action.payload.role, error: error.message }));
  }
}

// ADD
function* addStaffSaga(action) {
  try {
    yield call(postData, endpoints[action.payload.role], action.payload.staff);
    yield put(fetchStaffRequest({ role: action.payload.role }));
  } catch (error) {
    console.error(error);
  }
}

// UPDATE
function* updateStaffSaga(action) {
  try {
    yield call(
      putData,
      `${endpoints[action.payload.role]}/${action.payload.staff.id}`,
      action.payload.staff
    );
    yield put(fetchStaffRequest({ role: action.payload.role }));
  } catch (error) {
    console.error(error);
  }
}

// DELETE
function* deleteStaffSaga(action) {
  try {
    yield call(deleteData, `${endpoints[action.payload.role]}/${action.payload.id}`);
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
