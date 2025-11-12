import { call, put, takeLatest } from "redux-saga/effects";
import * as api from "../../api/inventoryApi";
import {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  addInventoryRequest,
  updateInventoryRequest,
  deleteInventoryRequest,
} from "./inventorySlice";

// FETCH
function* fetchInventorySaga() {
  try {
    const data = yield call(api.getInventory);
    yield put(fetchInventorySuccess(data));
  } catch (error) {
    yield put(fetchInventoryFailure(error.message));
  }
}

// ADD
function* addInventorySaga(action) {
  try {
    yield call(api.addInventoryItem, action.payload);
    yield put(fetchInventoryRequest()); // refresh list
  } catch (error) {
    console.error(error);
  }
}

// UPDATE
function* updateInventorySaga(action) {
  try {
    yield call(api.updateInventoryItem, action.payload);
    yield put(fetchInventoryRequest()); // refresh list
  } catch (error) {
    console.error(error);
  }
}

// DELETE
function* deleteInventorySaga(action) {
  try {
    yield call(api.deleteInventoryItem, action.payload);
    yield put(fetchInventoryRequest()); // refresh list
  } catch (error) {
    console.error(error);
  }
}

// WATCHER
export default function* inventorySaga() {
  yield takeLatest(fetchInventoryRequest.type, fetchInventorySaga);
  yield takeLatest(addInventoryRequest.type, addInventorySaga);
  yield takeLatest(updateInventoryRequest.type, updateInventorySaga);
  yield takeLatest(deleteInventoryRequest.type, deleteInventorySaga);
}
